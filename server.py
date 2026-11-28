"""
AyushDoc+ Partner CRM Backend & Static Server
Serves the existing CRM frontend AND provides secure, SQLite-backed
User Management, RBAC, Department/Team, Auth, and Activity Log APIs.
"""

import base64
import csv
import io
import json
import mimetypes
import os
import re
import secrets
from http import cookies
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import parse_qs, unquote, urlparse

import db

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOADS_DIR = os.path.join(BASE_DIR, "uploads", "avatars")
os.makedirs(UPLOADS_DIR, exist_ok=True)

SESSION_COOKIE_NAME = "ayush_crm_session"
SESSION_TTL_HOURS = 24
EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
SLUG_RE = re.compile(r"[^a-z0-9]+")


def slugify(text: str) -> str:
    return SLUG_RE.sub("_", text.strip().lower()).strip("_") or f"role_{secrets.token_hex(3)}"


def extract_raw_token(val: str) -> str:
    """Extract raw token whether user enters a raw token or pastes a full invite/reset URL."""
    s = (val or "").strip()
    if not s:
        return ""
    if "token=" in s:
        # Handle both full URLs (#activate?token=...) and query substrings
        q_part = s.split("?", 1)[1] if "?" in s else s
        if "#" in q_part and "token=" in q_part.split("#", 1)[1]:
            q_part = q_part.split("#", 1)[1]
            if "?" in q_part:
                q_part = q_part.split("?", 1)[1]
        parsed_q = parse_qs(q_part)
        tok = (parsed_q.get("token", [""])[0] or "").strip()
        if tok:
            return tok
    return s


def save_avatar_data_url(data_url: str, employee_id: str) -> str:
    """Validate and save a base64 image data URL under uploads/avatars/."""
    if not data_url:
        return ""
    if data_url.startswith("/uploads/avatars/"):
        return data_url
    m = re.match(r"^data:image/(png|jpeg|jpg|webp|gif);base64,(.+)$", data_url, re.IGNORECASE | re.DOTALL)
    if not m:
        raise ValueError("Invalid profile picture format. Use PNG, JPG, WEBP, or GIF.")
    ext = m.group(1).lower().replace("jpeg", "jpg")
    raw = base64.b64decode(m.group(2))
    if len(raw) > 2 * 1024 * 1024:
        raise ValueError("Profile picture must be 2 MB or smaller.")
    safe_emp = re.sub(r"[^a-zA-Z0-9_-]", "", employee_id or "user")[:24] or "user"
    fname = f"{safe_emp}_{secrets.token_hex(6)}.{ext}"
    fpath = os.path.join(UPLOADS_DIR, fname)
    with open(fpath, "wb") as f:
        f.write(raw)
    return f"/uploads/avatars/{fname}"


USER_SELECT_SQL = """
    SELECT
        u.*,
        r.name AS role_name,
        r.slug AS role_slug,
        d.name AS department_name,
        t.name AS team_name,
        m.full_name AS reporting_manager_name
    FROM users u
    JOIN roles r ON r.id = u.role_id
    LEFT JOIN departments d ON d.id = u.department_id
    LEFT JOIN teams t ON t.id = u.team_id
    LEFT JOIN users m ON m.id = u.reporting_manager_id
"""


class CRMRequestHandler(BaseHTTPRequestHandler):
    server_version = "AyushDocCRM/2.0"

    def log_message(self, format, *args):
        # Concise server logging without exposing sensitive headers/tokens
        print(f"[{self.log_date_time_string()}] {self.command} {self.path.split('?')[0]} -> {args[1] if len(args) > 1 else ''}")

    def client_ip(self) -> str:
        fwd = self.headers.get("X-Forwarded-For", "").split(",")[0].strip()
        return fwd or (self.client_address[0] if self.client_address else "")

    def send_json(self, status: int, payload: dict, extra_headers: dict | None = None):
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        if extra_headers:
            for k, v in extra_headers.items():
                self.send_header(k, v)
        self.end_headers()
        self.wfile.write(body)

    def read_json_body(self) -> dict:
        length = int(self.headers.get("Content-Length", "0") or "0")
        if length > 4 * 1024 * 1024:
            raise ValueError("Request payload too large.")
        raw = self.rfile.read(length) if length > 0 else b"{}"
        try:
            data = json.loads(raw.decode("utf-8"))
        except Exception:
            raise ValueError("Invalid JSON request body.")
        if not isinstance(data, dict):
            raise ValueError("JSON body must be an object.")
        return data

    def get_session_token(self) -> str:
        cookie_hdr = self.headers.get("Cookie", "")
        if not cookie_hdr:
            return ""
        c = cookies.SimpleCookie()
        try:
            c.load(cookie_hdr)
        except Exception:
            return ""
        morsel = c.get(SESSION_COOKIE_NAME)
        return morsel.value if morsel else ""

    def get_current_auth(self, conn):
        """Return (user_dict, permissions_dict) or (None, None) if unauthenticated/expired."""
        raw_token = self.get_session_token()
        if not raw_token:
            return None, None
        t_hash = db.hash_token(raw_token)
        row = conn.execute(
            f"""
            SELECT s.expires_at, u.*, r.name AS role_name, r.slug AS role_slug,
                   d.name AS department_name, t.name AS team_name, m.full_name AS reporting_manager_name
            FROM sessions s
            JOIN users u ON u.id = s.user_id
            JOIN roles r ON r.id = u.role_id
            LEFT JOIN departments d ON d.id = u.department_id
            LEFT JOIN teams t ON t.id = u.team_id
            LEFT JOIN users m ON m.id = u.reporting_manager_id
            WHERE s.token_hash = ?
            """,
            (t_hash,),
        ).fetchone()
        if not row:
            return None, None
        if row["expires_at"] < db.utc_now_iso() or row["status"] != "Active":
            with conn:
                conn.execute("DELETE FROM sessions WHERE token_hash = ?", (t_hash,))
            return None, None
        user = db.serialize_user_row(row)
        perms = db.get_role_permissions_map(conn, row["role_id"])
        return user, perms

    def require_permission(self, conn, module: str, action: str):
        """Enforce backend authentication & RBAC permission. Sends 401/403 on failure."""
        user, perms = self.get_current_auth(conn)
        if not user:
            self.send_json(401, {"error": "Authentication required. Please sign in."})
            return None, None
        if user["role_slug"] == "super_admin":
            return user, perms
        allowed = bool(perms.get(module, {}).get(action, False))
        if not allowed:
            self.send_json(
                403,
                {"error": f"Access denied. Your role ({user['role_name']}) lacks '{action}' permission for '{module}'."},
            )
            return None, None
        return user, perms

    def require_any_view_permission(self, conn, modules=("user_management", "team_roles")):
        """Allow read access when user holds 'view' permission on any listed module."""
        user, perms = self.get_current_auth(conn)
        if not user:
            self.send_json(401, {"error": "Authentication required. Please sign in."})
            return None, None
        if user["role_slug"] == "super_admin":
            return user, perms
        if any(bool(perms.get(m, {}).get("view", False)) for m in modules):
            return user, perms
        self.send_json(
            403,
            {"error": f"Access denied. Your role ({user['role_name']}) lacks 'view' permission for User Management / Team & Roles."},
        )
        return None, None

    def make_session_cookie(self, raw_token: str, clear: bool = False) -> str:
        if clear:
            return f"{SESSION_COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0"
        max_age = SESSION_TTL_HOURS * 3600
        return f"{SESSION_COOKIE_NAME}={raw_token}; Path=/; HttpOnly; SameSite=Lax; Max-Age={max_age}"

    # ---------------- STATIC FILE SERVING ----------------
    def serve_static(self, path: str):
        clean_path = unquote(path).lstrip("/")
        if not clean_path:
            clean_path = "index.html"
        # Prevent directory traversal and block direct access to backend/db files
        norm = os.path.normpath(os.path.join(BASE_DIR, clean_path))
        if not norm.startswith(BASE_DIR):
            self.send_error(403, "Forbidden")
            return
        lower_rel = os.path.relpath(norm, BASE_DIR).replace("\\", "/").lower()
        blocked_ext = (".py", ".db", ".db-wal", ".db-shm", ".sqlite", ".env")
        if lower_rel.startswith(".") or lower_rel.endswith(blocked_ext):
            self.send_error(403, "Forbidden")
            return
        if not os.path.isfile(norm):
            self.send_error(404, "File not found")
            return
        ctype, _ = mimetypes.guess_type(norm)
        ctype = ctype or "application/octet-stream"
        with open(norm, "rb") as f:
            data = f.read()
        self.send_response(200)
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(len(data)))
        self.send_header("Cache-Control", "no-cache")
        self.end_headers()
        self.wfile.write(data)

    # ---------------- HTTP VERB ROUTING ----------------
    def do_GET(self):
        parsed = urlparse(self.path)
        path = parsed.path
        qs = parse_qs(parsed.query)
        if not path.startswith("/api/"):
            return self.serve_static(path)

        conn = db.get_connection()
        try:
            if path == "/api/auth/status":
                return self.handle_auth_status(conn)
            if path == "/api/auth/can":
                return self.handle_auth_can(conn, qs)
            if path == "/api/um/dashboard":
                return self.handle_um_dashboard(conn)
            if path == "/api/um/users":
                return self.handle_list_users(conn, qs)
            if path == "/api/um/users/export":
                return self.handle_export_users(conn, qs)
            if re.match(r"^/api/um/users/\d+$", path):
                uid = int(path.rsplit("/", 1)[1])
                return self.handle_get_user(conn, uid)
            if path == "/api/um/roles":
                return self.handle_list_roles(conn)
            if re.match(r"^/api/um/roles/\d+/users$", path):
                rid = int(path.split("/")[4])
                return self.handle_role_users(conn, rid)
            if path == "/api/um/departments":
                return self.handle_list_departments(conn)
            if re.match(r"^/api/um/departments/\d+/users$", path):
                did = int(path.split("/")[4])
                return self.handle_department_users(conn, did)
            if path == "/api/um/teams":
                return self.handle_list_teams(conn)
            if re.match(r"^/api/um/teams/\d+/users$", path):
                tid = int(path.split("/")[4])
                return self.handle_team_users(conn, tid)
            if path == "/api/um/logs":
                return self.handle_list_logs(conn, qs)
            self.send_json(404, {"error": "API endpoint not found."})
        except Exception as exc:
            self.send_json(500, {"error": f"Server error: {exc}"})
        finally:
            conn.close()

    def do_POST(self):
        parsed = urlparse(self.path)
        path = parsed.path
        if not path.startswith("/api/"):
            self.send_json(405, {"error": "Method not allowed"})
            return

        conn = db.get_connection()
        try:
            if path == "/api/auth/setup":
                return self.handle_auth_setup(conn)
            if path == "/api/auth/login":
                return self.handle_auth_login(conn)
            if path == "/api/auth/logout":
                return self.handle_auth_logout(conn)
            if path == "/api/auth/activate":
                return self.handle_auth_activate(conn)
            if path == "/api/auth/request-reset":
                return self.handle_auth_request_reset(conn)
            if path == "/api/auth/reset-password":
                return self.handle_auth_reset_password(conn)
            if path == "/api/auth/change-password":
                return self.handle_auth_change_password(conn)
            if path == "/api/um/users":
                return self.handle_create_user(conn)
            if re.match(r"^/api/um/users/\d+/resend-invite$", path):
                uid = int(path.split("/")[4])
                return self.handle_user_resend_invite(conn, uid)
            if re.match(r"^/api/um/users/\d+/reset-password$", path):
                uid = int(path.split("/")[4])
                return self.handle_admin_reset_link(conn, uid)
            if path == "/api/um/roles":
                return self.handle_create_role(conn)
            if path == "/api/um/departments":
                return self.handle_create_department(conn)
            if path == "/api/um/teams":
                return self.handle_create_team(conn)
            if path == "/api/um/teams/transfer":
                return self.handle_transfer_team(conn)
            if path == "/api/um/logs/crm-event":
                return self.handle_log_crm_event(conn)
            self.send_json(404, {"error": "API endpoint not found."})
        except ValueError as ve:
            self.send_json(400, {"error": str(ve)})
        except Exception as exc:
            self.send_json(500, {"error": f"Server error: {exc}"})
        finally:
            conn.close()

    def do_PUT(self):
        parsed = urlparse(self.path)
        path = parsed.path
        if not path.startswith("/api/"):
            self.send_json(405, {"error": "Method not allowed"})
            return
        if path.startswith("/api/um/logs"):
            self.send_json(403, {"error": "Activity logs are immutable and cannot be modified."})
            return

        conn = db.get_connection()
        try:
            if re.match(r"^/api/um/users/\d+$", path):
                uid = int(path.rsplit("/", 1)[1])
                return self.handle_update_user(conn, uid)
            if re.match(r"^/api/um/roles/\d+$", path):
                rid = int(path.rsplit("/", 1)[1])
                return self.handle_update_role(conn, rid)
            if re.match(r"^/api/um/departments/\d+$", path):
                did = int(path.rsplit("/", 1)[1])
                return self.handle_update_department(conn, did)
            if re.match(r"^/api/um/teams/\d+$", path):
                tid = int(path.rsplit("/", 1)[1])
                return self.handle_update_team(conn, tid)
            self.send_json(404, {"error": "API endpoint not found."})
        except ValueError as ve:
            self.send_json(400, {"error": str(ve)})
        except Exception as exc:
            self.send_json(500, {"error": f"Server error: {exc}"})
        finally:
            conn.close()

    def do_PATCH(self):
        parsed = urlparse(self.path)
        path = parsed.path
        if path.startswith("/api/um/logs"):
            self.send_json(403, {"error": "Activity logs are immutable and cannot be modified."})
            return
        conn = db.get_connection()
        try:
            if re.match(r"^/api/um/users/\d+/status$", path):
                uid = int(path.split("/")[4])
                return self.handle_toggle_user_status(conn, uid)
            self.send_json(404, {"error": "API endpoint not found."})
        except ValueError as ve:
            self.send_json(400, {"error": str(ve)})
        except Exception as exc:
            self.send_json(500, {"error": f"Server error: {exc}"})
        finally:
            conn.close()

    def do_DELETE(self):
        parsed = urlparse(self.path)
        path = parsed.path
        if path.startswith("/api/um/logs"):
            self.send_json(403, {"error": "Activity logs are immutable and cannot be deleted."})
            return
        conn = db.get_connection()
        try:
            if re.match(r"^/api/um/users/\d+$", path):
                uid = int(path.rsplit("/", 1)[1])
                return self.handle_delete_user(conn, uid)
            if re.match(r"^/api/um/roles/\d+$", path):
                rid = int(path.rsplit("/", 1)[1])
                return self.handle_delete_role(conn, rid)
            if re.match(r"^/api/um/departments/\d+$", path):
                did = int(path.rsplit("/", 1)[1])
                return self.handle_delete_department(conn, did)
            if re.match(r"^/api/um/teams/\d+$", path):
                tid = int(path.rsplit("/", 1)[1])
                return self.handle_delete_team(conn, tid)
            self.send_json(404, {"error": "API endpoint not found."})
        except Exception as exc:
            self.send_json(500, {"error": f"Server error: {exc}"})
        finally:
            conn.close()

    # ---------------- AUTH HANDLERS ----------------
    def handle_auth_status(self, conn):
        setup_done = db.is_initial_setup_completed(conn)
        user, perms = self.get_current_auth(conn)
        self.send_json(
            200,
            {
                "needs_setup": not setup_done,
                "initial_setup_completed": setup_done,
                "authenticated": user is not None,
                "user": user,
                "permissions": perms or {},
                "modules": [{"key": k, "label": lbl} for k, lbl in db.PERMISSION_MODULES],
                "actions": db.PERMISSION_ACTIONS,
                "email_configured": False,
            },
        )

    def handle_auth_can(self, conn, qs: dict):
        user, perms = self.get_current_auth(conn)
        if not user:
            self.send_json(401, {"allowed": False, "error": "Authentication required."})
            return
        mod = (qs.get("module", [""])[0] or "").strip()
        act = (qs.get("action", ["view"])[0] or "view").strip()
        allowed = user["role_slug"] == "super_admin" or bool(perms.get(mod, {}).get(act, False))
        self.send_json(200 if allowed else 403, {"allowed": allowed, "module": mod, "action": act, "role": user["role_name"]})

    def handle_auth_setup(self, conn):
        if db.is_initial_setup_completed(conn):
            self.send_json(403, {"error": "Initial Super Admin setup has already been completed. Please sign in."})
            return
        body = self.read_json_body()
        full_name = (body.get("full_name") or "").strip()
        email = (body.get("email") or "").strip().lower()
        mobile = (body.get("mobile") or "").strip()
        employee_id = (body.get("employee_id") or "EMP-001").strip().upper()
        password = body.get("password") or ""

        if not full_name or not EMAIL_RE.match(email):
            raise ValueError("Valid full name and email address are required.")
        if not employee_id:
            raise ValueError("Employee ID is required.")
        if len(password) < 8:
            raise ValueError("Password must be at least 8 characters long.")
        if conn.execute("SELECT id FROM users WHERE lower(email) = ?", (email,)).fetchone():
            self.send_json(409, {"error": f"Email '{email}' is already registered."})
            return
        if conn.execute("SELECT id FROM users WHERE lower(employee_id) = lower(?)", (employee_id,)).fetchone():
            self.send_json(409, {"error": f"Employee ID '{employee_id}' is already registered."})
            return

        sa_role = conn.execute("SELECT id FROM roles WHERE slug = 'super_admin'").fetchone()
        if not sa_role:
            raise ValueError("Super Admin role is missing from database.")

        pw_hash, pw_salt = db.hash_password(password)
        raw_session, session_hash = db.generate_secure_token()
        now = db.utc_now_iso()

        with conn:
            cur = conn.execute(
                """
                INSERT INTO users
                (full_name, email, mobile, employee_id, designation, role_id, status,
                 password_hash, password_salt, created_at, updated_at, last_login_at)
                VALUES (?, ?, ?, ?, 'System Super Administrator', ?, 'Active', ?, ?, ?, ?, ?)
                """,
                (full_name, email, mobile, employee_id, sa_role["id"], pw_hash, pw_salt, now, now, now),
            )
            uid = cur.lastrowid
            db.mark_initial_setup_completed(conn, uid)
            conn.execute(
                """
                INSERT INTO sessions (token_hash, user_id, ip_address, user_agent, created_at, expires_at)
                VALUES (?, ?, ?, ?, ?, ?)
                """,
                (session_hash, uid, self.client_ip(), self.headers.get("User-Agent", "")[:200], now, db.utc_future_iso(SESSION_TTL_HOURS)),
            )
            db.log_activity(
                conn, uid, full_name, "SUPER_ADMIN_INITIALIZED", "user_management",
                str(uid), f"One-time Initial Super Admin account created ({email})", self.client_ip(),
            )

        row = conn.execute(f"{USER_SELECT_SQL} WHERE u.id = ?", (uid,)).fetchone()
        self.send_json(
            201,
            {
                "message": "Super Admin account created and signed in.",
                "initial_setup_completed": True,
                "user": db.serialize_user_row(row),
                "permissions": db.get_role_permissions_map(conn, sa_role["id"]),
            },
            {"Set-Cookie": self.make_session_cookie(raw_session)},
        )

    def handle_auth_login(self, conn):
        body = self.read_json_body()
        email = (body.get("email") or "").strip().lower()
        password = body.get("password") or ""
        if not email or not password:
            raise ValueError("Email and password are required.")

        row = conn.execute(f"{USER_SELECT_SQL} WHERE lower(u.email) = ?", (email,)).fetchone()
        if not row or not db.verify_password(password, row["password_hash"], row["password_salt"]):
            with conn:
                db.log_activity(
                    conn, row["id"] if row else None, row["full_name"] if row else email,
                    "LOGIN_FAILED", "auth", str(row["id"]) if row else "",
                    f"Failed login attempt for email '{email}' (invalid credentials)", self.client_ip(),
                )
            self.send_json(401, {"error": "Invalid email or password."})
            return
        if row["status"] == "Pending":
            with conn:
                db.log_activity(
                    conn, row["id"], row["full_name"], "LOGIN_FAILED", "auth",
                    str(row["id"]), f"Blocked login for pending account '{email}'", self.client_ip(),
                )
            self.send_json(403, {"error": "Account is pending activation. Please activate using your invitation link."})
            return
        if row["status"] != "Active":
            with conn:
                db.log_activity(
                    conn, row["id"], row["full_name"], "LOGIN_FAILED", "auth",
                    str(row["id"]), f"Blocked login for deactivated account '{email}'", self.client_ip(),
                )
            self.send_json(403, {"error": "This account is deactivated. Contact your administrator."})
            return

        raw_session, session_hash = db.generate_secure_token()
        now = db.utc_now_iso()
        with conn:
            conn.execute("UPDATE users SET last_login_at = ? WHERE id = ?", (now, row["id"]))
            conn.execute(
                """
                INSERT INTO sessions (token_hash, user_id, ip_address, user_agent, created_at, expires_at)
                VALUES (?, ?, ?, ?, ?, ?)
                """,
                (session_hash, row["id"], self.client_ip(), self.headers.get("User-Agent", "")[:200], now, db.utc_future_iso(SESSION_TTL_HOURS)),
            )
            db.log_activity(
                conn, row["id"], row["full_name"], "USER_LOGIN", "auth",
                str(row["id"]), f"Signed in as {row['role_name']}", self.client_ip(),
            )

        updated = conn.execute(f"{USER_SELECT_SQL} WHERE u.id = ?", (row["id"],)).fetchone()
        self.send_json(
            200,
            {
                "message": f"Welcome back, {row['full_name']}!",
                "user": db.serialize_user_row(updated),
                "permissions": db.get_role_permissions_map(conn, row["role_id"]),
            },
            {"Set-Cookie": self.make_session_cookie(raw_session)},
        )

    def handle_auth_logout(self, conn):
        raw_token = self.get_session_token()
        user, _ = self.get_current_auth(conn)
        if raw_token:
            with conn:
                conn.execute("DELETE FROM sessions WHERE token_hash = ?", (db.hash_token(raw_token),))
                if user:
                    db.log_activity(
                        conn, user["id"], user["full_name"], "USER_LOGOUT", "auth",
                        str(user["id"]), "Signed out of CRM session", self.client_ip(),
                    )
        self.send_json(
            200,
            {"message": "Signed out successfully."},
            {"Set-Cookie": self.make_session_cookie("", clear=True)},
        )

    def handle_auth_activate(self, conn):
        body = self.read_json_body()
        raw_token = extract_raw_token(body.get("token") or "")
        password = body.get("password") or ""
        if not raw_token:
            raise ValueError("Activation token is required.")
        if len(password) < 8:
            raise ValueError("Password must be at least 8 characters long.")

        t_hash = db.hash_token(raw_token)
        row = conn.execute("SELECT * FROM users WHERE invite_token_hash = ?", (t_hash,)).fetchone()
        if not row or not row["invite_expires_at"] or row["invite_expires_at"] < db.utc_now_iso():
            self.send_json(400, {"error": "Invalid or expired invitation token."})
            return

        pw_hash, pw_salt = db.hash_password(password)
        now = db.utc_now_iso()
        with conn:
            conn.execute(
                """
                UPDATE users
                SET password_hash = ?, password_salt = ?, status = 'Active',
                    invite_token_hash = '', invite_expires_at = '', updated_at = ?
                WHERE id = ?
                """,
                (pw_hash, pw_salt, now, row["id"]),
            )
            db.log_activity(
                conn, row["id"], row["full_name"], "ACCOUNT_ACTIVATED", "auth",
                str(row["id"]), f"Account activated via invitation ({row['email']})", self.client_ip(),
            )
        self.send_json(200, {
            "message": "Account activated! You can now sign in with your email and password.",
            "email": row["email"],
            "full_name": row["full_name"],
        })

    def handle_auth_request_reset(self, conn):
        body = self.read_json_body()
        email = (body.get("email") or "").strip().lower()
        if not email or not EMAIL_RE.match(email):
            raise ValueError("Please enter a valid registered email address.")

        row = conn.execute(f"{USER_SELECT_SQL} WHERE lower(u.email) = ?", (email,)).fetchone()
        if not row:
            self.send_json(404, {"error": "No account found with that email address."})
            return
        if row["status"] == "Inactive":
            self.send_json(403, {"error": "This account is deactivated. Contact your administrator to reactivate it."})
            return
        if row["status"] == "Pending":
            self.send_json(400, {"error": "Account is still Pending activation. Use your invitation link to set your initial password."})
            return

        raw_token, token_hash = db.generate_secure_token()
        expires_at = db.utc_future_iso(2)
        with conn:
            conn.execute(
                "UPDATE users SET reset_token_hash = ?, reset_expires_at = ?, updated_at = ? WHERE id = ?",
                (token_hash, expires_at, db.utc_now_iso(), row["id"]),
            )
            db.log_activity(
                conn, row["id"], row["full_name"], "PASSWORD_RESET_REQUESTED", "auth",
                str(row["id"]), f"Self-service password reset requested for {row['email']}", self.client_ip(),
            )
        host = self.headers.get("Host", "127.0.0.1:8000")
        self.send_json(
            200,
            {
                "ok": True,
                "message": f"Password reset token generated for {row['full_name']} (expires in 2 hours).",
                "reset_token": raw_token,
                "reset_link": f"http://{host}/#reset-password?token={raw_token}",
                "expires_at": expires_at,
                "user_name": row["full_name"],
                "email_sent": False,
                "email_note": "SMTP email service is not configured. Use the generated reset token below to set your new password.",
            },
        )

    def handle_auth_reset_password(self, conn):
        body = self.read_json_body()
        raw_token = extract_raw_token(body.get("token") or "")
        new_password = body.get("new_password") or ""
        if not raw_token:
            raise ValueError("Reset token is required.")
        if len(new_password) < 8:
            raise ValueError("New password must be at least 8 characters long.")

        t_hash = db.hash_token(raw_token)
        row = conn.execute("SELECT * FROM users WHERE reset_token_hash = ?", (t_hash,)).fetchone()
        if not row or not row["reset_expires_at"] or row["reset_expires_at"] < db.utc_now_iso():
            self.send_json(400, {"error": "Invalid or expired password reset token."})
            return

        pw_hash, pw_salt = db.hash_password(new_password)
        now = db.utc_now_iso()
        with conn:
            conn.execute(
                """
                UPDATE users
                SET password_hash = ?, password_salt = ?, reset_token_hash = '', reset_expires_at = '', updated_at = ?
                WHERE id = ?
                """,
                (pw_hash, pw_salt, now, row["id"]),
            )
            conn.execute("DELETE FROM sessions WHERE user_id = ?", (row["id"],))
            db.log_activity(
                conn, row["id"], row["full_name"], "PASSWORD_RESET_COMPLETED", "auth",
                str(row["id"]), f"Password reset completed for {row['email']}", self.client_ip(),
            )
        self.send_json(200, {
            "message": "Password updated successfully. Please sign in with your new password.",
            "email": row["email"],
        })

    def handle_auth_change_password(self, conn):
        user, _ = self.get_current_auth(conn)
        if not user:
            self.send_json(401, {"error": "Authentication required."})
            return
        body = self.read_json_body()
        current_password = body.get("current_password") or ""
        new_password = body.get("new_password") or ""
        if not current_password or not new_password:
            raise ValueError("Current password and new password are required.")
        if len(new_password) < 8:
            raise ValueError("New password must be at least 8 characters long.")
        row = conn.execute("SELECT password_hash, password_salt FROM users WHERE id = ?", (user["id"],)).fetchone()
        if not row or not db.verify_password(current_password, row["password_hash"], row["password_salt"]):
            self.send_json(400, {"error": "Current password is incorrect."})
            return
        pw_hash, pw_salt = db.hash_password(new_password)
        with conn:
            conn.execute(
                "UPDATE users SET password_hash = ?, password_salt = ?, updated_at = ? WHERE id = ?",
                (pw_hash, pw_salt, db.utc_now_iso(), user["id"]),
            )
            db.log_activity(
                conn, user["id"], user["full_name"], "PASSWORD_CHANGED", "auth",
                str(user["id"]), f"Changed own password ({user['email']})", self.client_ip(),
            )
        self.send_json(200, {"ok": True, "message": "Your password has been updated."})

    # ---------------- DASHBOARD SUMMARY ----------------
    def handle_um_dashboard(self, conn):
        user, _ = self.require_any_view_permission(conn, ("user_management", "team_roles"))
        if not user:
            return
        row = conn.execute(
            """
            SELECT
                COUNT(*) AS total_users,
                SUM(CASE WHEN u.status = 'Active' THEN 1 ELSE 0 END) AS active_users,
                SUM(CASE WHEN u.status = 'Inactive' THEN 1 ELSE 0 END) AS inactive_users,
                SUM(CASE WHEN u.status = 'Pending' THEN 1 ELSE 0 END) AS pending_invitations,
                SUM(CASE WHEN r.slug IN ('super_admin', 'admin') THEN 1 ELSE 0 END) AS administrators,
                SUM(CASE WHEN r.slug NOT IN ('super_admin', 'admin') THEN 1 ELSE 0 END) AS employees
            FROM users u
            JOIN roles r ON r.id = u.role_id
            """
        ).fetchone()
        role_row = conn.execute(
            """
            SELECT
                SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) AS total_roles,
                SUM(CASE WHEN is_system = 1 THEN 1 ELSE 0 END) AS system_roles,
                SUM(CASE WHEN is_system = 0 THEN 1 ELSE 0 END) AS custom_roles
            FROM roles
            """
        ).fetchone()
        dept_cnt = conn.execute("SELECT COUNT(*) AS cnt FROM departments").fetchone()["cnt"]
        team_cnt = conn.execute("SELECT COUNT(*) AS cnt FROM teams").fetchone()["cnt"]
        self.send_json(
            200,
            {
                "total_users": int(row["total_users"] or 0),
                "active_users": int(row["active_users"] or 0),
                "inactive_users": int(row["inactive_users"] or 0),
                "pending_invitations": int(row["pending_invitations"] or 0),
                "administrators": int(row["administrators"] or 0),
                "employees": int(row["employees"] or 0),
                "total_roles": int((role_row["total_roles"] if role_row else 0) or 0),
                "system_roles": int((role_row["system_roles"] if role_row else 0) or 0),
                "custom_roles": int((role_row["custom_roles"] if role_row else 0) or 0),
                "total_departments": int(dept_cnt or 0),
                "total_teams": int(team_cnt or 0),
            },
        )

    # ---------------- USERS CRUD ----------------
    def _build_users_filter(self, qs: dict):
        where = []
        params = []
        q = (qs.get("q", [""])[0] or "").strip()
        if q:
            like = f"%{q}%"
            where.append("(u.full_name LIKE ? OR u.email LIKE ? OR u.employee_id LIKE ? OR u.mobile LIKE ?)")
            params.extend([like, like, like, like])
        role_id = (qs.get("role_id", [""])[0] or "").strip()
        if role_id.isdigit():
            where.append("u.role_id = ?")
            params.append(int(role_id))
        dept_id = (qs.get("department_id", [""])[0] or "").strip()
        if dept_id.isdigit():
            where.append("u.department_id = ?")
            params.append(int(dept_id))
        team_id = (qs.get("team_id", [""])[0] or "").strip()
        if team_id.isdigit():
            where.append("u.team_id = ?")
            params.append(int(team_id))
        status = (qs.get("status", [""])[0] or "").strip()
        if status in ("Active", "Inactive", "Pending"):
            where.append("u.status = ?")
            params.append(status)
        clause = f" WHERE {' AND '.join(where)}" if where else ""
        return clause, params

    def handle_list_users(self, conn, qs: dict):
        user, _ = self.require_any_view_permission(conn, ("user_management", "team_roles"))
        if not user:
            return
        clause, params = self._build_users_filter(qs)
        sort_map = {
            "full_name": "u.full_name",
            "email": "u.email",
            "employee_id": "u.employee_id",
            "role_name": "r.name",
            "department_name": "d.name",
            "status": "u.status",
            "created_at": "u.created_at",
            "last_login_at": "u.last_login_at",
        }
        sort_by = sort_map.get((qs.get("sort_by", ["created_at"])[0] or "created_at"), "u.created_at")
        sort_dir = "ASC" if (qs.get("sort_dir", ["desc"])[0] or "desc").lower() == "asc" else "DESC"
        page = max(1, int(qs.get("page", ["1"])[0] or 1))
        page_size = min(100, max(1, int(qs.get("page_size", ["10"])[0] or 10)))

        total = conn.execute(
            f"SELECT COUNT(*) AS cnt FROM users u JOIN roles r ON r.id = u.role_id LEFT JOIN departments d ON d.id = u.department_id LEFT JOIN teams t ON t.id = u.team_id {clause}",
            params,
        ).fetchone()["cnt"]

        offset = (page - 1) * page_size
        rows = conn.execute(
            f"{USER_SELECT_SQL} {clause} ORDER BY {sort_by} {sort_dir}, u.id DESC LIMIT ? OFFSET ?",
            [*params, page_size, offset],
        ).fetchall()

        self.send_json(
            200,
            {
                "items": [db.serialize_user_row(r) for r in rows],
                "total": int(total),
                "page": page,
                "page_size": page_size,
                "total_pages": max(1, (int(total) + page_size - 1) // page_size),
            },
        )

    def handle_export_users(self, conn, qs: dict):
        user, _ = self.require_permission(conn, "user_management", "export")
        if not user:
            return
        clause, params = self._build_users_filter(qs)
        rows = conn.execute(f"{USER_SELECT_SQL} {clause} ORDER BY u.created_at DESC", params).fetchall()

        buf = io.StringIO()
        writer = csv.writer(buf)
        writer.writerow([
            "Employee ID", "Full Name", "Email", "Mobile", "Department",
            "Designation", "Role", "Team", "Reporting Manager", "Status", "Created At", "Last Login"
        ])
        for r in rows:
            u = db.serialize_user_row(r)
            writer.writerow([
                u["employee_id"], u["full_name"], u["email"], u["mobile"],
                u["department_name"], u["designation"], u["role_name"],
                u["team_name"], u["reporting_manager_name"], u["status"],
                u["created_at"], u["last_login_at"],
            ])

        with conn:
            db.log_activity(
                conn, user["id"], user["full_name"], "USERS_EXPORTED", "user_management",
                "", f"Exported {len(rows)} user records to CSV", self.client_ip(),
            )

        data = ("\ufeff" + buf.getvalue()).encode("utf-8")
        self.send_response(200)
        self.send_header("Content-Type", "text/csv; charset=utf-8")
        self.send_header("Content-Disposition", 'attachment; filename="AyushDoc_Users_Export.csv"')
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def handle_get_user(self, conn, uid: int):
        auth_user, perms = self.get_current_auth(conn)
        if not auth_user:
            self.send_json(401, {"error": "Authentication required."})
            return
        can_view_any = (
            auth_user["role_slug"] == "super_admin"
            or bool(perms.get("user_management", {}).get("view"))
            or bool(perms.get("team_roles", {}).get("view"))
        )
        if not can_view_any and auth_user["id"] != uid:
            self.send_json(403, {"error": "Access denied."})
            return

        row = conn.execute(f"{USER_SELECT_SQL} WHERE u.id = ?", (uid,)).fetchone()
        if not row:
            self.send_json(404, {"error": "User not found."})
            return
        logs = conn.execute(
            """
            SELECT id, actor_user_id, actor_name, action, module, record_id, details, ip_address, created_at
            FROM activity_logs
            WHERE actor_user_id = ? OR (module = 'user_management' AND record_id = ?)
            ORDER BY id DESC LIMIT 25
            """,
            (uid, str(uid)),
        ).fetchall()
        self.send_json(
            200,
            {
                "user": db.serialize_user_row(row),
                "activity": [dict(l) for l in logs],
            },
        )

    def handle_create_user(self, conn):
        actor, _ = self.require_permission(conn, "user_management", "create")
        if not actor:
            return
        body = self.read_json_body()
        full_name = (body.get("full_name") or "").strip()
        email = (body.get("email") or "").strip().lower()
        mobile = (body.get("mobile") or "").strip()
        employee_id = (body.get("employee_id") or "").strip().upper()
        designation = (body.get("designation") or "").strip()
        role_id = body.get("role_id")
        department_id = body.get("department_id") or None
        team_id = body.get("team_id") or None
        reporting_manager_id = body.get("reporting_manager_id") or None
        status = (body.get("status") or "Pending").strip()
        initial_password = body.get("password") or ""
        avatar_data = (body.get("avatar_data") or "").strip()

        if not full_name:
            raise ValueError("Full Name is required.")
        if not EMAIL_RE.match(email):
            raise ValueError("A valid Email Address is required.")
        if not employee_id:
            raise ValueError("Employee ID is required.")
        if not role_id:
            raise ValueError("User Role is required.")
        if status not in ("Active", "Inactive", "Pending"):
            raise ValueError("Account Status must be Active, Inactive, or Pending.")

        role = conn.execute("SELECT * FROM roles WHERE id = ?", (int(role_id),)).fetchone()
        if not role or not role["is_active"]:
            raise ValueError("Selected role is invalid or inactive.")
        if role["slug"] == "super_admin" and actor["role_slug"] != "super_admin":
            self.send_json(403, {"error": "Only a Super Admin can create another Super Admin account."})
            return

        if conn.execute("SELECT id FROM users WHERE lower(email) = ?", (email,)).fetchone():
            self.send_json(409, {"error": f"A user with email '{email}' already exists."})
            return
        if conn.execute("SELECT id FROM users WHERE lower(employee_id) = lower(?)", (employee_id,)).fetchone():
            self.send_json(409, {"error": f"Employee ID '{employee_id}' is already assigned to another user."})
            return

        avatar_url = save_avatar_data_url(avatar_data, employee_id) if avatar_data else ""
        pw_hash, pw_salt = ("", "")
        raw_invite, invite_hash, invite_exp = ("", "", "")

        if initial_password:
            if len(initial_password) < 8:
                raise ValueError("Initial password must be at least 8 characters long.")
            pw_hash, pw_salt = db.hash_password(initial_password)
        else:
            raw_invite, invite_hash = db.generate_secure_token()
            invite_exp = db.utc_future_iso(72)
            status = "Pending"

        now = db.utc_now_iso()
        with conn:
            cur = conn.execute(
                """
                INSERT INTO users
                (full_name, email, mobile, employee_id, avatar_url, department_id, designation,
                 role_id, team_id, reporting_manager_id, status, password_hash, password_salt,
                 invite_token_hash, invite_expires_at, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    full_name, email, mobile, employee_id, avatar_url,
                    int(department_id) if department_id else None,
                    designation, int(role_id),
                    int(team_id) if team_id else None,
                    int(reporting_manager_id) if reporting_manager_id else None,
                    status, pw_hash, pw_salt, invite_hash, invite_exp, now, now,
                ),
            )
            uid = cur.lastrowid
            db.log_activity(
                conn, actor["id"], actor["full_name"], "USER_CREATED", "user_management",
                str(uid), f"Created user {full_name} ({employee_id}) with role {role['name']} [{status}]", self.client_ip(),
            )

        created = conn.execute(f"{USER_SELECT_SQL} WHERE u.id = ?", (uid,)).fetchone()
        resp = {
            "message": f"User {full_name} created successfully.",
            "user": db.serialize_user_row(created),
            "email_sent": False,
        }
        if raw_invite:
            resp["activation_token"] = raw_invite
            resp["activation_link"] = f"http://{self.headers.get('Host', 'localhost:8000')}/#activate?token={raw_invite}"
            resp["email_note"] = "Email service (SMTP) is not configured. Share the one-time activation link securely with the employee."
        self.send_json(201, resp)

    def handle_update_user(self, conn, uid: int):
        actor, perms = self.get_current_auth(conn)
        if not actor:
            self.send_json(401, {"error": "Authentication required."})
            return
        can_edit_any = actor["role_slug"] == "super_admin" or bool(perms.get("user_management", {}).get("edit"))
        is_self = actor["id"] == uid
        if not can_edit_any and not is_self:
            self.send_json(403, {"error": "Access denied. You do not have permission to edit users."})
            return

        target = conn.execute(f"{USER_SELECT_SQL} WHERE u.id = ?", (uid,)).fetchone()
        if not target:
            self.send_json(404, {"error": "User not found."})
            return
        if target["role_slug"] == "super_admin" and actor["role_slug"] != "super_admin":
            self.send_json(403, {"error": "Only a Super Admin can modify a Super Admin account."})
            return

        body = self.read_json_body()
        full_name = (body.get("full_name") if body.get("full_name") is not None else target["full_name"]).strip()
        email = (body.get("email") if body.get("email") is not None else target["email"]).strip().lower()
        mobile = (body.get("mobile") if body.get("mobile") is not None else target["mobile"] or "").strip()
        employee_id = (body.get("employee_id") if body.get("employee_id") is not None else target["employee_id"]).strip().upper()
        designation = (body.get("designation") if body.get("designation") is not None else target["designation"] or "").strip()
        avatar_data = (body.get("avatar_data") or "").strip()

        if not full_name or not EMAIL_RE.match(email) or not employee_id:
            raise ValueError("Full Name, valid Email Address, and Employee ID are required.")

        if conn.execute("SELECT id FROM users WHERE lower(email) = ? AND id != ?", (email, uid)).fetchone():
            self.send_json(409, {"error": f"Email '{email}' is already used by another account."})
            return
        if conn.execute("SELECT id FROM users WHERE lower(employee_id) = lower(?) AND id != ?", (employee_id, uid)).fetchone():
            self.send_json(409, {"error": f"Employee ID '{employee_id}' is already used by another account."})
            return

        # Restrict role/status/org changes to users with edit permission (prevent self privilege escalation)
        if can_edit_any:
            role_id = int(body.get("role_id") or target["role_id"])
            department_id = body.get("department_id") if "department_id" in body else target["department_id"]
            team_id = body.get("team_id") if "team_id" in body else target["team_id"]
            reporting_manager_id = body.get("reporting_manager_id") if "reporting_manager_id" in body else target["reporting_manager_id"]
            status = (body.get("status") or target["status"]).strip()
        else:
            role_id = target["role_id"]
            department_id = target["department_id"]
            team_id = target["team_id"]
            reporting_manager_id = target["reporting_manager_id"]
            status = target["status"]

        if status not in ("Active", "Inactive", "Pending"):
            raise ValueError("Invalid account status.")
        if reporting_manager_id and int(reporting_manager_id) == uid:
            raise ValueError("A user cannot be their own reporting manager.")

        new_role = conn.execute("SELECT * FROM roles WHERE id = ?", (role_id,)).fetchone()
        if not new_role or not new_role["is_active"]:
            raise ValueError("Selected role is invalid or inactive.")
        if new_role["slug"] == "super_admin" and actor["role_slug"] != "super_admin":
            self.send_json(403, {"error": "Privilege escalation blocked: only Super Admin can assign Super Admin role."})
            return

        # Protect last active Super Admin from demotion or deactivation
        if target["role_slug"] == "super_admin" and target["status"] == "Active":
            if new_role["slug"] != "super_admin" or status != "Active":
                if db.count_active_super_admins(conn, exclude_user_id=uid) == 0:
                    self.send_json(400, {"error": "Cannot demote or deactivate the last active Super Admin account."})
                    return

        avatar_url = save_avatar_data_url(avatar_data, employee_id) if avatar_data else (target["avatar_url"] or "")
        new_password = (body.get("password") or "") if can_edit_any else ""
        if new_password and len(new_password) < 8:
            raise ValueError("Password must be at least 8 characters long.")
        if status == "Active" and not target["password_hash"] and not new_password:
            raise ValueError("Cannot set status to Active until the user sets a password via their invitation link, or you enter a password below.")

        now = db.utc_now_iso()

        with conn:
            if new_password:
                pw_hash, pw_salt = db.hash_password(new_password)
                conn.execute(
                    """
                    UPDATE users
                    SET full_name = ?, email = ?, mobile = ?, employee_id = ?, avatar_url = ?,
                        department_id = ?, designation = ?, role_id = ?, team_id = ?,
                        reporting_manager_id = ?, status = ?, password_hash = ?, password_salt = ?,
                        invite_token_hash = '', invite_expires_at = '', updated_at = ?
                    WHERE id = ?
                    """,
                    (
                        full_name, email, mobile, employee_id, avatar_url,
                        int(department_id) if department_id else None,
                        designation, role_id,
                        int(team_id) if team_id else None,
                        int(reporting_manager_id) if reporting_manager_id else None,
                        status, pw_hash, pw_salt, now, uid,
                    ),
                )
            else:
                conn.execute(
                    """
                    UPDATE users
                    SET full_name = ?, email = ?, mobile = ?, employee_id = ?, avatar_url = ?,
                        department_id = ?, designation = ?, role_id = ?, team_id = ?,
                        reporting_manager_id = ?, status = ?, updated_at = ?
                    WHERE id = ?
                    """,
                    (
                        full_name, email, mobile, employee_id, avatar_url,
                        int(department_id) if department_id else None,
                        designation, role_id,
                        int(team_id) if team_id else None,
                        int(reporting_manager_id) if reporting_manager_id else None,
                        status, now, uid,
                    ),
                )
            if status != "Active":
                conn.execute("DELETE FROM sessions WHERE user_id = ?", (uid,))
            if role_id != target["role_id"]:
                db.log_activity(
                    conn, actor["id"], actor["full_name"], "ROLE_CHANGED", "user_management",
                    str(uid), f"Changed role of {full_name} from {target['role_name']} to {new_role['name']}", self.client_ip(),
                )
            elif new_password:
                db.log_activity(
                    conn, actor["id"], actor["full_name"], "PASSWORD_SET_BY_ADMIN", "user_management",
                    str(uid), f"Updated profile & password for {full_name} ({employee_id})", self.client_ip(),
                )
            else:
                db.log_activity(
                    conn, actor["id"], actor["full_name"], "PROFILE_UPDATED", "user_management",
                    str(uid), f"Updated profile for {full_name} ({employee_id})", self.client_ip(),
                )

        updated = conn.execute(f"{USER_SELECT_SQL} WHERE u.id = ?", (uid,)).fetchone()
        self.send_json(200, {"message": f"Updated {full_name} successfully.", "user": db.serialize_user_row(updated)})

    def handle_toggle_user_status(self, conn, uid: int):
        actor, _ = self.require_permission(conn, "user_management", "edit")
        if not actor:
            return
        target = conn.execute(f"{USER_SELECT_SQL} WHERE u.id = ?", (uid,)).fetchone()
        if not target:
            self.send_json(404, {"error": "User not found."})
            return
        if target["role_slug"] == "super_admin" and actor["role_slug"] != "super_admin":
            self.send_json(403, {"error": "Only a Super Admin can change a Super Admin's status."})
            return

        body = self.read_json_body()
        new_status = (body.get("status") or "").strip()
        if new_status not in ("Active", "Inactive"):
            raise ValueError("Status must be 'Active' or 'Inactive'.")

        if target["role_slug"] == "super_admin" and new_status != "Active":
            if db.count_active_super_admins(conn, exclude_user_id=uid) == 0:
                self.send_json(400, {"error": "Cannot deactivate the last active Super Admin account."})
                return

        opt_password = body.get("password") or ""
        if new_status == "Active" and not target["password_hash"] and not opt_password:
            self.send_json(
                400,
                {"error": "This user has not completed invitation setup yet (no password set). Use 'Invite Link' to activate or set a password in Edit User."},
            )
            return
        if opt_password and len(opt_password) < 8:
            raise ValueError("Password must be at least 8 characters long.")

        now = db.utc_now_iso()
        with conn:
            if opt_password:
                pw_hash, pw_salt = db.hash_password(opt_password)
                conn.execute(
                    "UPDATE users SET status = ?, password_hash = ?, password_salt = ?, invite_token_hash = '', invite_expires_at = ?, updated_at = ? WHERE id = ?",
                    (new_status, pw_hash, pw_salt, "", now, uid),
                )
            else:
                conn.execute("UPDATE users SET status = ?, updated_at = ? WHERE id = ?", (new_status, now, uid))
            if new_status != "Active":
                conn.execute("DELETE FROM sessions WHERE user_id = ?", (uid,))
            action = "USER_ACTIVATED" if new_status == "Active" else "USER_DEACTIVATED"
            db.log_activity(
                conn, actor["id"], actor["full_name"], action, "user_management",
                str(uid), f"{'Activated' if new_status == 'Active' else 'Deactivated'} {target['full_name']} ({target['employee_id']})",
                self.client_ip(),
            )

        updated = conn.execute(f"{USER_SELECT_SQL} WHERE u.id = ?", (uid,)).fetchone()
        self.send_json(200, {"message": f"User {target['full_name']} is now {new_status}.", "user": db.serialize_user_row(updated)})

    def handle_user_resend_invite(self, conn, uid: int):
        actor, _ = self.require_permission(conn, "user_management", "edit")
        if not actor:
            return
        target = conn.execute(f"{USER_SELECT_SQL} WHERE u.id = ?", (uid,)).fetchone()
        if not target:
            self.send_json(404, {"error": "User not found."})
            return
        if target["role_slug"] == "super_admin" and actor["role_slug"] != "super_admin":
            self.send_json(403, {"error": "Only a Super Admin can manage another Super Admin."})
            return

        raw_token, token_hash = db.generate_secure_token()
        expires_at = db.utc_future_iso(72)
        next_status = "Pending" if not target["password_hash"] else target["status"]
        with conn:
            conn.execute(
                "UPDATE users SET invite_token_hash = ?, invite_expires_at = ?, status = ?, updated_at = ? WHERE id = ?",
                (token_hash, expires_at, next_status, db.utc_now_iso(), uid),
            )
            db.log_activity(
                conn, actor["id"], actor["full_name"], "INVITE_LINK_GENERATED", "user_management",
                str(uid), f"Generated fresh 72h activation invite link for {target['email']}", self.client_ip(),
            )
        host = self.headers.get("Host", "127.0.0.1:8000")
        self.send_json(
            200,
            {
                "ok": True,
                "message": f"Activation invite link generated for {target['full_name']} (expires in 72 hours).",
                "activation_token": raw_token,
                "activation_link": f"http://{host}/#activate?token={raw_token}",
                "expires_at": expires_at,
                "email_sent": False,
                "email_note": "Email service (SMTP) is not configured. Share this one-time activation link securely with the employee.",
            },
        )

    def handle_admin_reset_link(self, conn, uid: int):
        actor, _ = self.require_permission(conn, "user_management", "edit")
        if not actor:
            return
        target = conn.execute(f"{USER_SELECT_SQL} WHERE u.id = ?", (uid,)).fetchone()
        if not target:
            self.send_json(404, {"error": "User not found."})
            return
        if target["role_slug"] == "super_admin" and actor["role_slug"] != "super_admin":
            self.send_json(403, {"error": "Only a Super Admin can reset another Super Admin's password."})
            return

        raw_token, token_hash = db.generate_secure_token()
        with conn:
            conn.execute(
                "UPDATE users SET reset_token_hash = ?, reset_expires_at = ?, updated_at = ? WHERE id = ?",
                (token_hash, db.utc_future_iso(2), db.utc_now_iso(), uid),
            )
            db.log_activity(
                conn, actor["id"], actor["full_name"], "PASSWORD_RESET_LINK_GENERATED", "user_management",
                str(uid), f"Generated secure password reset link for {target['email']}", self.client_ip(),
            )
        self.send_json(
            200,
            {
                "message": f"Password reset link generated for {target['full_name']} (expires in 2 hours).",
                "reset_token": raw_token,
                "reset_link": f"http://{self.headers.get('Host', 'localhost:8000')}/#reset-password?token={raw_token}",
                "email_sent": False,
                "email_note": "SMTP email service is not configured. Share this one-time link securely.",
            },
        )

    def handle_delete_user(self, conn, uid: int):
        actor, _ = self.require_permission(conn, "user_management", "delete")
        if not actor:
            return
        if actor["id"] == uid:
            self.send_json(400, {"error": "You cannot delete your own currently signed-in account."})
            return
        target = conn.execute(f"{USER_SELECT_SQL} WHERE u.id = ?", (uid,)).fetchone()
        if not target:
            self.send_json(404, {"error": "User not found."})
            return
        if target["role_slug"] == "super_admin" and actor["role_slug"] != "super_admin":
            self.send_json(403, {"error": "Only a Super Admin can delete a Super Admin account."})
            return
        if target["role_slug"] == "super_admin" and target["status"] == "Active":
            if db.count_active_super_admins(conn, exclude_user_id=uid) == 0:
                self.send_json(400, {"error": "Cannot delete the last active Super Admin account."})
                return

        with conn:
            conn.execute("UPDATE departments SET head_user_id = NULL WHERE head_user_id = ?", (uid,))
            conn.execute("UPDATE teams SET manager_user_id = NULL WHERE manager_user_id = ?", (uid,))
            conn.execute("DELETE FROM users WHERE id = ?", (uid,))
            db.log_activity(
                conn, actor["id"], actor["full_name"], "USER_DELETED", "user_management",
                str(uid), f"Deleted user {target['full_name']} ({target['email']}, {target['employee_id']})",
                self.client_ip(),
            )
        self.send_json(200, {"message": f"User {target['full_name']} deleted."})

    # ---------------- ROLES & PERMISSIONS ----------------
    def handle_list_roles(self, conn):
        user, _ = self.require_any_view_permission(conn, ("user_management", "team_roles"))
        if not user:
            return
        rows = conn.execute(
            """
            SELECT r.*, COUNT(u.id) AS user_count
            FROM roles r
            LEFT JOIN users u ON u.role_id = r.id
            GROUP BY r.id
            ORDER BY r.is_system DESC, r.id ASC
            """
        ).fetchall()
        roles = []
        for r in rows:
            item = dict(r)
            item["is_system"] = bool(item["is_system"])
            item["is_active"] = bool(item["is_active"])
            item["permissions"] = db.get_role_permissions_map(conn, r["id"])
            roles.append(item)
        self.send_json(
            200,
            {
                "roles": roles,
                "modules": [{"key": k, "label": lbl} for k, lbl in db.PERMISSION_MODULES],
                "actions": db.PERMISSION_ACTIONS,
            },
        )

    def handle_role_users(self, conn, rid: int):
        user, _ = self.require_any_view_permission(conn, ("user_management", "team_roles"))
        if not user:
            return
        rows = conn.execute(f"{USER_SELECT_SQL} WHERE u.role_id = ? ORDER BY u.full_name ASC", (rid,)).fetchall()
        self.send_json(200, {"users": [db.serialize_user_row(r) for r in rows]})

    def handle_create_role(self, conn):
        actor, _ = self.require_permission(conn, "user_management", "create")
        if not actor:
            return
        body = self.read_json_body()
        name = (body.get("name") or "").strip()
        description = (body.get("description") or "").strip()
        permissions = body.get("permissions") or {}
        if not name:
            raise ValueError("Role name is required.")
        slug = slugify(name)
        if conn.execute("SELECT id FROM roles WHERE lower(name) = lower(?) OR slug = ?", (name, slug)).fetchone():
            self.send_json(409, {"error": f"Role '{name}' already exists."})
            return

        now = db.utc_now_iso()
        with conn:
            cur = conn.execute(
                """
                INSERT INTO roles (name, slug, description, is_system, is_active, created_at, updated_at)
                VALUES (?, ?, ?, 0, 1, ?, ?)
                """,
                (name, slug, description, now, now),
            )
            rid = cur.lastrowid
            for mod_key, _ in db.PERMISSION_MODULES:
                p = permissions.get(mod_key) or {}
                conn.execute(
                    """
                    INSERT INTO role_permissions
                    (role_id, module, can_view, can_create, can_edit, can_delete, can_export, can_assign)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                    """,
                    (
                        rid, mod_key,
                        int(bool(p.get("view"))), int(bool(p.get("create"))),
                        int(bool(p.get("edit"))), int(bool(p.get("delete"))),
                        int(bool(p.get("export"))), int(bool(p.get("assign"))),
                    ),
                )
            db.log_activity(
                conn, actor["id"], actor["full_name"], "ROLE_CREATED", "user_management",
                str(rid), f"Created custom role '{name}'", self.client_ip(),
            )
        self.send_json(201, {"message": f"Role '{name}' created.", "id": rid})

    def handle_update_role(self, conn, rid: int):
        actor, _ = self.require_permission(conn, "user_management", "edit")
        if not actor:
            return
        role = conn.execute("SELECT * FROM roles WHERE id = ?", (rid,)).fetchone()
        if not role:
            self.send_json(404, {"error": "Role not found."})
            return
        if role["slug"] == "super_admin":
            self.send_json(403, {"error": "Super Admin role permissions and status are locked for security."})
            return

        body = self.read_json_body()
        name = (body.get("name") if body.get("name") is not None else role["name"]).strip()
        description = (body.get("description") if body.get("description") is not None else role["description"] or "").strip()
        is_active = bool(body.get("is_active")) if "is_active" in body else bool(role["is_active"])
        if role["is_system"] and not is_active:
            self.send_json(400, {"error": "System roles cannot be deactivated; only custom roles can be deactivated."})
            return
        if not name:
            raise ValueError("Role name is required.")
        if conn.execute("SELECT id FROM roles WHERE lower(name) = lower(?) AND id != ?", (name, rid)).fetchone():
            self.send_json(409, {"error": f"Role name '{name}' already exists."})
            return

        permissions = body.get("permissions")
        now = db.utc_now_iso()
        with conn:
            conn.execute(
                "UPDATE roles SET name = ?, description = ?, is_active = ?, updated_at = ? WHERE id = ?",
                (name, description, int(is_active), now, rid),
            )
            if isinstance(permissions, dict):
                for mod_key, _ in db.PERMISSION_MODULES:
                    p = permissions.get(mod_key) or {}
                    conn.execute(
                        """
                        INSERT INTO role_permissions
                        (role_id, module, can_view, can_create, can_edit, can_delete, can_export, can_assign)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                        ON CONFLICT(role_id, module) DO UPDATE SET
                            can_view = excluded.can_view,
                            can_create = excluded.can_create,
                            can_edit = excluded.can_edit,
                            can_delete = excluded.can_delete,
                            can_export = excluded.can_export,
                            can_assign = excluded.can_assign
                        """,
                        (
                            rid, mod_key,
                            int(bool(p.get("view"))), int(bool(p.get("create"))),
                            int(bool(p.get("edit"))), int(bool(p.get("delete"))),
                            int(bool(p.get("export"))), int(bool(p.get("assign"))),
                        ),
                    )
            db.log_activity(
                conn, actor["id"], actor["full_name"], "PERMISSIONS_UPDATED", "user_management",
                str(rid), f"Updated role '{name}' (active={is_active}) and permissions", self.client_ip(),
            )
        self.send_json(200, {"message": f"Role '{name}' updated."})

    def handle_delete_role(self, conn, rid: int):
        actor, _ = self.require_permission(conn, "user_management", "delete")
        if not actor:
            return
        role = conn.execute("SELECT * FROM roles WHERE id = ?", (rid,)).fetchone()
        if not role:
            self.send_json(404, {"error": "Role not found."})
            return
        if role["is_system"]:
            self.send_json(400, {"error": "System roles cannot be deleted."})
            return
        assigned = conn.execute("SELECT COUNT(*) AS cnt FROM users WHERE role_id = ?", (rid,)).fetchone()["cnt"]
        if assigned > 0:
            self.send_json(400, {"error": f"Cannot delete role '{role['name']}' while {assigned} user(s) are assigned to it. Reassign those users first."})
            return
        with conn:
            conn.execute("DELETE FROM role_permissions WHERE role_id = ?", (rid,))
            conn.execute("DELETE FROM roles WHERE id = ?", (rid,))
            db.log_activity(
                conn, actor["id"], actor["full_name"], "ROLE_DELETED", "user_management",
                str(rid), f"Deleted custom role '{role['name']}'", self.client_ip(),
            )
        self.send_json(200, {"ok": True, "message": f"Custom role '{role['name']}' deleted."})

    # ---------------- DEPARTMENTS & TEAMS ----------------
    def handle_list_departments(self, conn):
        user, _ = self.require_any_view_permission(conn, ("user_management", "team_roles"))
        if not user:
            return
        rows = conn.execute(
            """
            SELECT d.*, h.full_name AS head_name, COUNT(u.id) AS employee_count
            FROM departments d
            LEFT JOIN users h ON h.id = d.head_user_id
            LEFT JOIN users u ON u.department_id = d.id
            GROUP BY d.id
            ORDER BY d.name ASC
            """
        ).fetchall()
        self.send_json(200, {"departments": [dict(r) for r in rows]})

    def handle_department_users(self, conn, did: int):
        user, _ = self.require_any_view_permission(conn, ("user_management", "team_roles"))
        if not user:
            return
        rows = conn.execute(f"{USER_SELECT_SQL} WHERE u.department_id = ? ORDER BY u.full_name ASC", (did,)).fetchall()
        self.send_json(200, {"users": [db.serialize_user_row(r) for r in rows]})

    def handle_create_department(self, conn):
        actor, _ = self.require_permission(conn, "user_management", "create")
        if not actor:
            return
        body = self.read_json_body()
        name = (body.get("name") or "").strip()
        code = (body.get("code") or slugify(name)[:6]).strip().upper()
        description = (body.get("description") or "").strip()
        head_user_id = body.get("head_user_id") or None
        if not name or not code:
            raise ValueError("Department name and code are required.")
        if conn.execute("SELECT id FROM departments WHERE lower(name) = lower(?) OR lower(code) = lower(?)", (name, code)).fetchone():
            self.send_json(409, {"error": f"Department '{name}' or code '{code}' already exists."})
            return
        now = db.utc_now_iso()
        with conn:
            cur = conn.execute(
                """
                INSERT INTO departments (name, code, description, head_user_id, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?)
                """,
                (name, code, description, int(head_user_id) if head_user_id else None, now, now),
            )
            did = cur.lastrowid
            db.log_activity(
                conn, actor["id"], actor["full_name"], "DEPARTMENT_CREATED", "user_management",
                str(did), f"Created department '{name}' ({code})", self.client_ip(),
            )
        self.send_json(201, {"message": f"Department '{name}' created.", "id": did})

    def handle_update_department(self, conn, did: int):
        actor, _ = self.require_permission(conn, "user_management", "edit")
        if not actor:
            return
        dept = conn.execute("SELECT * FROM departments WHERE id = ?", (did,)).fetchone()
        if not dept:
            self.send_json(404, {"error": "Department not found."})
            return
        body = self.read_json_body()
        name = (body.get("name") if body.get("name") is not None else dept["name"]).strip()
        code = (body.get("code") if body.get("code") is not None else dept["code"]).strip().upper()
        description = (body.get("description") if body.get("description") is not None else dept["description"] or "").strip()
        head_user_id = body.get("head_user_id") if "head_user_id" in body else dept["head_user_id"]
        if not name or not code:
            raise ValueError("Department name and code are required.")
        if conn.execute(
            "SELECT id FROM departments WHERE (lower(name) = lower(?) OR lower(code) = lower(?)) AND id != ?",
            (name, code, did),
        ).fetchone():
            self.send_json(409, {"error": f"Department '{name}' or code '{code}' already exists."})
            return
        with conn:
            conn.execute(
                "UPDATE departments SET name = ?, code = ?, description = ?, head_user_id = ?, updated_at = ? WHERE id = ?",
                (name, code, description, int(head_user_id) if head_user_id else None, db.utc_now_iso(), did),
            )
            db.log_activity(
                conn, actor["id"], actor["full_name"], "DEPARTMENT_UPDATED", "user_management",
                str(did), f"Updated department '{name}' ({code})", self.client_ip(),
            )
        self.send_json(200, {"message": f"Department '{name}' updated."})

    def handle_delete_department(self, conn, did: int):
        actor, _ = self.require_permission(conn, "user_management", "delete")
        if not actor:
            return
        dept = conn.execute("SELECT * FROM departments WHERE id = ?", (did,)).fetchone()
        if not dept:
            self.send_json(404, {"error": "Department not found."})
            return
        with conn:
            conn.execute("UPDATE users SET department_id = NULL WHERE department_id = ?", (did,))
            conn.execute("UPDATE teams SET department_id = NULL WHERE department_id = ?", (did,))
            conn.execute("DELETE FROM departments WHERE id = ?", (did,))
            db.log_activity(
                conn, actor["id"], actor["full_name"], "DEPARTMENT_DELETED", "user_management",
                str(did), f"Deleted department '{dept['name']}' ({dept['code']})", self.client_ip(),
            )
        self.send_json(200, {"ok": True, "message": f"Department '{dept['name']}' deleted."})

    def handle_list_teams(self, conn):
        user, _ = self.require_any_view_permission(conn, ("user_management", "team_roles"))
        if not user:
            return
        rows = conn.execute(
            """
            SELECT t.*, d.name AS department_name, m.full_name AS manager_name, COUNT(u.id) AS member_count
            FROM teams t
            LEFT JOIN departments d ON d.id = t.department_id
            LEFT JOIN users m ON m.id = t.manager_user_id
            LEFT JOIN users u ON u.team_id = t.id
            GROUP BY t.id
            ORDER BY t.name ASC
            """
        ).fetchall()
        self.send_json(200, {"teams": [dict(r) for r in rows]})

    def handle_team_users(self, conn, tid: int):
        user, _ = self.require_any_view_permission(conn, ("user_management", "team_roles"))
        if not user:
            return
        rows = conn.execute(f"{USER_SELECT_SQL} WHERE u.team_id = ? ORDER BY u.full_name ASC", (tid,)).fetchall()
        self.send_json(200, {"users": [db.serialize_user_row(r) for r in rows]})

    def handle_create_team(self, conn):
        actor, _ = self.require_permission(conn, "user_management", "create")
        if not actor:
            return
        body = self.read_json_body()
        name = (body.get("name") or "").strip()
        department_id = body.get("department_id") or None
        manager_user_id = body.get("manager_user_id") or None
        description = (body.get("description") or "").strip()
        if not name:
            raise ValueError("Team name is required.")
        if conn.execute("SELECT id FROM teams WHERE lower(name) = lower(?)", (name,)).fetchone():
            self.send_json(409, {"error": f"Team '{name}' already exists."})
            return
        now = db.utc_now_iso()
        with conn:
            cur = conn.execute(
                """
                INSERT INTO teams (name, department_id, manager_user_id, description, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?)
                """,
                (
                    name,
                    int(department_id) if department_id else None,
                    int(manager_user_id) if manager_user_id else None,
                    description, now, now,
                ),
            )
            tid = cur.lastrowid
            db.log_activity(
                conn, actor["id"], actor["full_name"], "TEAM_CREATED", "user_management",
                str(tid), f"Created team '{name}'", self.client_ip(),
            )
        self.send_json(201, {"message": f"Team '{name}' created.", "id": tid})

    def handle_update_team(self, conn, tid: int):
        actor, _ = self.require_permission(conn, "user_management", "edit")
        if not actor:
            return
        team = conn.execute("SELECT * FROM teams WHERE id = ?", (tid,)).fetchone()
        if not team:
            self.send_json(404, {"error": "Team not found."})
            return
        body = self.read_json_body()
        name = (body.get("name") if body.get("name") is not None else team["name"]).strip()
        department_id = body.get("department_id") if "department_id" in body else team["department_id"]
        manager_user_id = body.get("manager_user_id") if "manager_user_id" in body else team["manager_user_id"]
        description = (body.get("description") if body.get("description") is not None else team["description"] or "").strip()
        if not name:
            raise ValueError("Team name is required.")
        if conn.execute("SELECT id FROM teams WHERE lower(name) = lower(?) AND id != ?", (name, tid)).fetchone():
            self.send_json(409, {"error": f"Team '{name}' already exists."})
            return
        with conn:
            conn.execute(
                "UPDATE teams SET name = ?, department_id = ?, manager_user_id = ?, description = ?, updated_at = ? WHERE id = ?",
                (
                    name,
                    int(department_id) if department_id else None,
                    int(manager_user_id) if manager_user_id else None,
                    description, db.utc_now_iso(), tid,
                ),
            )
            db.log_activity(
                conn, actor["id"], actor["full_name"], "TEAM_UPDATED", "user_management",
                str(tid), f"Updated team '{name}'", self.client_ip(),
            )
        self.send_json(200, {"message": f"Team '{name}' updated."})

    def handle_delete_team(self, conn, tid: int):
        actor, _ = self.require_permission(conn, "user_management", "delete")
        if not actor:
            return
        team = conn.execute("SELECT * FROM teams WHERE id = ?", (tid,)).fetchone()
        if not team:
            self.send_json(404, {"error": "Team not found."})
            return
        with conn:
            conn.execute("UPDATE users SET team_id = NULL WHERE team_id = ?", (tid,))
            conn.execute("DELETE FROM teams WHERE id = ?", (tid,))
            db.log_activity(
                conn, actor["id"], actor["full_name"], "TEAM_DELETED", "user_management",
                str(tid), f"Deleted team '{team['name']}'", self.client_ip(),
            )
        self.send_json(200, {"ok": True, "message": f"Team '{team['name']}' deleted."})

    def handle_transfer_team(self, conn):
        actor, _ = self.require_permission(conn, "user_management", "assign")
        if not actor:
            return
        body = self.read_json_body()
        user_id = body.get("user_id")
        team_id = body.get("team_id") or None
        if not user_id:
            raise ValueError("Employee (user_id) is required.")
        target = conn.execute("SELECT id, full_name FROM users WHERE id = ?", (int(user_id),)).fetchone()
        if not target:
            self.send_json(404, {"error": "Employee not found."})
            return
        team_name = "Unassigned"
        dept_id = None
        if team_id:
            t = conn.execute("SELECT id, name, department_id FROM teams WHERE id = ?", (int(team_id),)).fetchone()
            if not t:
                self.send_json(404, {"error": "Target team not found."})
                return
            team_name = t["name"]
            dept_id = t["department_id"]

        with conn:
            if dept_id:
                conn.execute(
                    "UPDATE users SET team_id = ?, department_id = ?, updated_at = ? WHERE id = ?",
                    (int(team_id) if team_id else None, dept_id, db.utc_now_iso(), int(user_id)),
                )
            else:
                conn.execute(
                    "UPDATE users SET team_id = ?, updated_at = ? WHERE id = ?",
                    (int(team_id) if team_id else None, db.utc_now_iso(), int(user_id)),
                )
            db.log_activity(
                conn, actor["id"], actor["full_name"], "TEAM_ASSIGNMENT_UPDATED", "user_management",
                str(user_id), f"Assigned {target['full_name']} to team '{team_name}'", self.client_ip(),
            )
        self.send_json(200, {"message": f"Assigned {target['full_name']} to {team_name}."})

    def handle_log_crm_event(self, conn):
        actor, _ = self.get_current_auth(conn)
        if not actor:
            self.send_json(401, {"error": "Authentication required."})
            return
        body = self.read_json_body()
        allowed_actions = {
            "LEAD_ASSIGNED", "LEAD_STATUS_UPDATED", "CUSTOMER_RECORD_UPDATED",
            "SETTLEMENT_UPDATED", "PARTNER_CREATED",
        }
        action = (body.get("action") or "").strip().upper()
        if action not in allowed_actions:
            raise ValueError("Unsupported CRM audit action.")
        module = (body.get("module") or "leads").strip()[:40]
        record_id = str(body.get("record_id") or "")[:64]
        details = str(body.get("details") or "")[:300]
        with conn:
            db.log_activity(conn, actor["id"], actor["full_name"], action, module, record_id, details, self.client_ip())
        self.send_json(201, {"message": "Activity recorded."})

    # ---------------- ACTIVITY LOGS (READ-ONLY) ----------------
    def handle_list_logs(self, conn, qs: dict):
        user, _ = self.require_permission(conn, "user_management", "view")
        if not user:
            return
        where = []
        params = []
        q = (qs.get("q", [""])[0] or "").strip()
        if q:
            like = f"%{q}%"
            where.append("(actor_name LIKE ? OR action LIKE ? OR details LIKE ? OR record_id LIKE ?)")
            params.extend([like, like, like, like])
        action = (qs.get("action", [""])[0] or "").strip()
        if action:
            where.append("action = ?")
            params.append(action)
        clause = f" WHERE {' AND '.join(where)}" if where else ""
        page = max(1, int(qs.get("page", ["1"])[0] or 1))
        page_size = min(100, max(1, int(qs.get("page_size", ["15"])[0] or 15)))
        total = conn.execute(f"SELECT COUNT(*) AS cnt FROM activity_logs {clause}", params).fetchone()["cnt"]
        rows = conn.execute(
            f"SELECT * FROM activity_logs {clause} ORDER BY id DESC LIMIT ? OFFSET ?",
            [*params, page_size, (page - 1) * page_size],
        ).fetchall()
        self.send_json(
            200,
            {
                "items": [dict(r) for r in rows],
                "total": int(total),
                "page": page,
                "page_size": page_size,
                "total_pages": max(1, (int(total) + page_size - 1) // page_size),
            },
        )


def run_server(host: str = "127.0.0.1", port: int = 8000):
    db.init_db()
    server = ThreadingHTTPServer((host, port), CRMRequestHandler)
    print(f"AyushDoc+ Partner CRM Server running at http://{host}:{port}/ (DB: {db.DEFAULT_DB_PATH})")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()


if __name__ == "__main__":
    port = int(os.environ.get("PORT", "8000"))
    run_server("127.0.0.1", port)
