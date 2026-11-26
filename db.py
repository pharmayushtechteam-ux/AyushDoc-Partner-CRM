"""
SQLite Database, Migrations, Password Security, RBAC & Activity Logging
for AyushDoc+ Partner CRM — User Management Module.
"""

import hashlib
import hmac
import os
import secrets
import sqlite3
from datetime import datetime, timedelta, timezone

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DEFAULT_DB_PATH = os.environ.get("AYUSH_CRM_DB", os.path.join(BASE_DIR, "crm.db"))

PERMISSION_MODULES = [
    ("dashboard", "Dashboard"),
    ("partners", "Partners"),
    ("doctors", "Doctors"),
    ("clinics", "Clinics"),
    ("hospitals", "Hospitals"),
    ("leads", "Leads & Status"),
    ("leads_upload", "Leads Upload"),
    ("settlements", "Settlement Tracking"),
    ("leads_reports", "All Leads Reports"),
    ("followups", "Follow-ups"),
    ("campaigns", "WhatsApp Campaigns"),
    ("campaign_reports", "Campaign Reports"),
    ("automation", "Automation"),
    ("user_management", "User Management"),
    ("team_roles", "Team & Roles"),
    ("settings", "Settings"),
]

PERMISSION_ACTIONS = ["view", "create", "edit", "delete", "export", "assign"]

def _p(v=0, c=0, e=0, d=0, x=0, a=0):
    return {"view": v, "create": c, "edit": e, "delete": d, "export": x, "assign": a}

SYSTEM_ROLES = [
    {
        "name": "Super Admin",
        "slug": "super_admin",
        "description": "Complete CRM access: manage administrators, users, roles, permissions, and all settings.",
        "is_system": 1,
        "perms": {m: _p(1, 1, 1, 1, 1, 1) for m, _ in PERMISSION_MODULES},
    },
    {
        "name": "Admin",
        "slug": "admin",
        "description": "Manage authorized CRM users, partner records, leads, campaigns, and reports (cannot alter Super Admin).",
        "is_system": 1,
        "perms": {
            "dashboard": _p(1, 1, 1, 0, 1, 1),
            "partners": _p(1, 1, 1, 1, 1, 1),
            "doctors": _p(1, 1, 1, 1, 1, 1),
            "clinics": _p(1, 1, 1, 1, 1, 1),
            "hospitals": _p(1, 1, 1, 1, 1, 1),
            "leads": _p(1, 1, 1, 1, 1, 1),
            "leads_upload": _p(1, 1, 1, 0, 1, 0),
            "settlements": _p(1, 1, 1, 0, 1, 1),
            "leads_reports": _p(1, 0, 0, 0, 1, 0),
            "followups": _p(1, 1, 1, 1, 1, 1),
            "campaigns": _p(1, 1, 1, 1, 1, 0),
            "campaign_reports": _p(1, 0, 0, 0, 1, 0),
            "automation": _p(1, 1, 1, 0, 0, 0),
            "user_management": _p(1, 1, 1, 1, 1, 1),
            "team_roles": _p(1, 1, 1, 0, 1, 1),
            "settings": _p(1, 0, 1, 0, 0, 0),
        },
    },
    {
        "name": "Manager",
        "slug": "manager",
        "description": "View team information, assign leads and tasks, monitor team performance, and view authorized reports.",
        "is_system": 1,
        "perms": {
            "dashboard": _p(1, 0, 0, 0, 1, 0),
            "partners": _p(1, 1, 1, 0, 1, 1),
            "doctors": _p(1, 1, 1, 0, 1, 1),
            "clinics": _p(1, 1, 1, 0, 1, 1),
            "hospitals": _p(1, 1, 1, 0, 1, 1),
            "leads": _p(1, 1, 1, 0, 1, 1),
            "leads_upload": _p(1, 1, 0, 0, 1, 0),
            "settlements": _p(1, 1, 1, 0, 1, 1),
            "leads_reports": _p(1, 0, 0, 0, 1, 0),
            "followups": _p(1, 1, 1, 0, 1, 1),
            "campaigns": _p(1, 1, 0, 0, 0, 0),
            "campaign_reports": _p(1, 0, 0, 0, 1, 0),
            "automation": _p(1, 0, 0, 0, 0, 0),
            "user_management": _p(1, 0, 0, 0, 0, 1),
            "team_roles": _p(1, 0, 0, 0, 0, 1),
            "settings": _p(0, 0, 0, 0, 0, 0),
        },
    },
    {
        "name": "Sales Executive",
        "slug": "sales_executive",
        "description": "Manage assigned leads, update partner details within access, manage follow-ups, and track sales.",
        "is_system": 1,
        "perms": {
            "dashboard": _p(1, 0, 0, 0, 0, 0),
            "partners": _p(1, 1, 1, 0, 0, 0),
            "doctors": _p(1, 1, 1, 0, 0, 0),
            "clinics": _p(1, 1, 1, 0, 0, 0),
            "hospitals": _p(1, 1, 1, 0, 0, 0),
            "leads": _p(1, 1, 1, 0, 0, 0),
            "leads_upload": _p(1, 1, 0, 0, 0, 0),
            "settlements": _p(1, 1, 1, 0, 0, 0),
            "leads_reports": _p(1, 0, 0, 0, 0, 0),
            "followups": _p(1, 1, 1, 0, 0, 0),
            "campaigns": _p(1, 0, 0, 0, 0, 0),
            "campaign_reports": _p(0, 0, 0, 0, 0, 0),
            "automation": _p(0, 0, 0, 0, 0, 0),
            "user_management": _p(0, 0, 0, 0, 0, 0),
            "team_roles": _p(0, 0, 0, 0, 0, 0),
            "settings": _p(0, 0, 0, 0, 0, 0),
        },
    },
    {
        "name": "Support Executive",
        "slug": "support_executive",
        "description": "Handle customer queries, manage authorized support records, and update support follow-ups.",
        "is_system": 1,
        "perms": {
            "dashboard": _p(1, 0, 0, 0, 0, 0),
            "partners": _p(1, 0, 1, 0, 0, 0),
            "doctors": _p(1, 0, 1, 0, 0, 0),
            "clinics": _p(1, 0, 1, 0, 0, 0),
            "hospitals": _p(1, 0, 1, 0, 0, 0),
            "leads": _p(1, 0, 0, 0, 0, 0),
            "leads_upload": _p(0, 0, 0, 0, 0, 0),
            "settlements": _p(0, 0, 0, 0, 0, 0),
            "leads_reports": _p(0, 0, 0, 0, 0, 0),
            "followups": _p(1, 1, 1, 0, 0, 0),
            "campaigns": _p(0, 0, 0, 0, 0, 0),
            "campaign_reports": _p(0, 0, 0, 0, 0, 0),
            "automation": _p(0, 0, 0, 0, 0, 0),
            "user_management": _p(0, 0, 0, 0, 0, 0),
            "team_roles": _p(0, 0, 0, 0, 0, 0),
            "settings": _p(0, 0, 0, 0, 0, 0),
        },
    },
]


def utc_now_iso() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def utc_future_iso(hours: int) -> str:
    return (datetime.now(timezone.utc) + timedelta(hours=hours)).strftime("%Y-%m-%dT%H:%M:%SZ")


def hash_password(password: str, salt: str | None = None) -> tuple[str, str]:
    """Hash password using scrypt with a 16-byte random salt. Never stores plain text."""
    if not salt:
        salt = secrets.token_hex(16)
    dk = hashlib.scrypt(
        password.encode("utf-8"),
        salt=salt.encode("utf-8"),
        n=16384,
        r=8,
        p=1,
        dklen=64,
    )
    return dk.hex(), salt


def verify_password(password: str, stored_hash: str, salt: str) -> bool:
    if not password or not stored_hash or not salt:
        return False
    computed, _ = hash_password(password, salt)
    return hmac.compare_digest(computed, stored_hash)


def hash_token(raw_token: str) -> str:
    return hashlib.sha256(raw_token.encode("utf-8")).hexdigest()


def generate_secure_token() -> tuple[str, str]:
    raw = secrets.token_urlsafe(32)
    return raw, hash_token(raw)


def get_connection(db_path: str | None = None) -> sqlite3.Connection:
    path = db_path or DEFAULT_DB_PATH
    conn = sqlite3.connect(path, timeout=15)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON;")
    conn.execute("PRAGMA journal_mode = WAL;")
    return conn


def init_db(db_path: str | None = None) -> None:
    """Run idempotent schema migrations and seed system roles (NO fake users)."""
    conn = get_connection(db_path)
    try:
        with conn:
            conn.execute(
                """
                CREATE TABLE IF NOT EXISTS schema_migrations (
                    version TEXT PRIMARY KEY,
                    applied_at TEXT NOT NULL
                )
                """
            )
            applied = {
                row["version"]
                for row in conn.execute("SELECT version FROM schema_migrations").fetchall()
            }

            if "001_user_management_core" not in applied:
                conn.executescript(
                    """
                    CREATE TABLE IF NOT EXISTS roles (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        name TEXT NOT NULL UNIQUE,
                        slug TEXT NOT NULL UNIQUE,
                        description TEXT DEFAULT '',
                        is_system INTEGER NOT NULL DEFAULT 0,
                        is_active INTEGER NOT NULL DEFAULT 1,
                        created_at TEXT NOT NULL,
                        updated_at TEXT NOT NULL
                    );

                    CREATE TABLE IF NOT EXISTS role_permissions (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        role_id INTEGER NOT NULL,
                        module TEXT NOT NULL,
                        can_view INTEGER NOT NULL DEFAULT 0,
                        can_create INTEGER NOT NULL DEFAULT 0,
                        can_edit INTEGER NOT NULL DEFAULT 0,
                        can_delete INTEGER NOT NULL DEFAULT 0,
                        can_export INTEGER NOT NULL DEFAULT 0,
                        can_assign INTEGER NOT NULL DEFAULT 0,
                        UNIQUE(role_id, module),
                        FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
                    );

                    CREATE TABLE IF NOT EXISTS departments (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        name TEXT NOT NULL UNIQUE,
                        code TEXT NOT NULL UNIQUE,
                        description TEXT DEFAULT '',
                        head_user_id INTEGER NULL,
                        created_at TEXT NOT NULL,
                        updated_at TEXT NOT NULL
                    );

                    CREATE TABLE IF NOT EXISTS teams (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        name TEXT NOT NULL UNIQUE,
                        department_id INTEGER NULL,
                        manager_user_id INTEGER NULL,
                        description TEXT DEFAULT '',
                        created_at TEXT NOT NULL,
                        updated_at TEXT NOT NULL,
                        FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL
                    );

                    CREATE TABLE IF NOT EXISTS users (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        full_name TEXT NOT NULL,
                        email TEXT NOT NULL UNIQUE COLLATE NOCASE,
                        mobile TEXT DEFAULT '',
                        employee_id TEXT NOT NULL UNIQUE COLLATE NOCASE,
                        avatar_url TEXT DEFAULT '',
                        department_id INTEGER NULL,
                        designation TEXT DEFAULT '',
                        role_id INTEGER NOT NULL,
                        team_id INTEGER NULL,
                        reporting_manager_id INTEGER NULL,
                        status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Active', 'Inactive', 'Pending')),
                        password_hash TEXT DEFAULT '',
                        password_salt TEXT DEFAULT '',
                        invite_token_hash TEXT DEFAULT '',
                        invite_expires_at TEXT DEFAULT '',
                        reset_token_hash TEXT DEFAULT '',
                        reset_expires_at TEXT DEFAULT '',
                        created_at TEXT NOT NULL,
                        updated_at TEXT NOT NULL,
                        last_login_at TEXT DEFAULT '',
                        FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL,
                        FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE RESTRICT,
                        FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE SET NULL,
                        FOREIGN KEY (reporting_manager_id) REFERENCES users(id) ON DELETE SET NULL
                    );

                    CREATE TABLE IF NOT EXISTS sessions (
                        token_hash TEXT PRIMARY KEY,
                        user_id INTEGER NOT NULL,
                        ip_address TEXT DEFAULT '',
                        user_agent TEXT DEFAULT '',
                        created_at TEXT NOT NULL,
                        expires_at TEXT NOT NULL,
                        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
                    );

                    CREATE TABLE IF NOT EXISTS activity_logs (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        actor_user_id INTEGER NULL,
                        actor_name TEXT NOT NULL,
                        action TEXT NOT NULL,
                        module TEXT NOT NULL,
                        record_id TEXT DEFAULT '',
                        details TEXT DEFAULT '',
                        ip_address TEXT DEFAULT '',
                        created_at TEXT NOT NULL
                    );

                    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
                    CREATE INDEX IF NOT EXISTS idx_users_employee_id ON users(employee_id);
                    CREATE INDEX IF NOT EXISTS idx_users_role_id ON users(role_id);
                    CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
                    CREATE INDEX IF NOT EXISTS idx_activity_created ON activity_logs(created_at DESC);
                    """
                )

                now = utc_now_iso()
                for role in SYSTEM_ROLES:
                    existing = conn.execute(
                        "SELECT id FROM roles WHERE slug = ? OR lower(name) = lower(?)",
                        (role["slug"], role["name"]),
                    ).fetchone()
                    if existing:
                        role_id = existing["id"]
                    else:
                        cur = conn.execute(
                            """
                            INSERT INTO roles (name, slug, description, is_system, is_active, created_at, updated_at)
                            VALUES (?, ?, ?, ?, 1, ?, ?)
                            """,
                            (role["name"], role["slug"], role["description"], role["is_system"], now, now),
                        )
                        role_id = cur.lastrowid

                    for mod_key, _ in PERMISSION_MODULES:
                        p = role["perms"].get(mod_key, {})
                        conn.execute(
                            """
                            INSERT OR IGNORE INTO role_permissions
                            (role_id, module, can_view, can_create, can_edit, can_delete, can_export, can_assign)
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                            """,
                            (
                                role_id,
                                mod_key,
                                int(p.get("view", 0)),
                                int(p.get("create", 0)),
                                int(p.get("edit", 0)),
                                int(p.get("delete", 0)),
                                int(p.get("export", 0)),
                                int(p.get("assign", 0)),
                            ),
                        )

                conn.execute(
                    "INSERT INTO schema_migrations (version, applied_at) VALUES (?, ?)",
                    ("001_user_management_core", now),
                )

            if "002_system_state_and_crm_modules" not in applied:
                now2 = utc_now_iso()
                conn.execute(
                    """
                    CREATE TABLE IF NOT EXISTS system_settings (
                        key TEXT PRIMARY KEY,
                        value TEXT NOT NULL,
                        updated_at TEXT NOT NULL
                    )
                    """
                )
                # Ensure all 16 CRM sidebar modules exist in role_permissions for all system roles
                for role in SYSTEM_ROLES:
                    r_row = conn.execute("SELECT id FROM roles WHERE slug = ?", (role["slug"],)).fetchone()
                    if not r_row:
                        continue
                    rid = r_row["id"]
                    for mod_key, _ in PERMISSION_MODULES:
                        p = role["perms"].get(mod_key, {})
                        conn.execute(
                            """
                            INSERT OR IGNORE INTO role_permissions
                            (role_id, module, can_view, can_create, can_edit, can_delete, can_export, can_assign)
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                            """,
                            (
                                rid,
                                mod_key,
                                int(p.get("view", 0)),
                                int(p.get("create", 0)),
                                int(p.get("edit", 0)),
                                int(p.get("delete", 0)),
                                int(p.get("export", 0)),
                                int(p.get("assign", 0)),
                            ),
                        )

                # Sync setup completion state if a Super Admin already exists
                sa_exists = count_active_super_admins(conn) > 0
                conn.execute(
                    """
                    INSERT OR IGNORE INTO system_settings (key, value, updated_at)
                    VALUES ('initial_setup_completed', ?, ?)
                    """,
                    ("true" if sa_exists else "false", now2),
                )
                conn.execute(
                    "INSERT INTO schema_migrations (version, applied_at) VALUES (?, ?)",
                    ("002_system_state_and_crm_modules", now2),
                )
    finally:
        conn.close()


def is_initial_setup_completed(conn: sqlite3.Connection) -> bool:
    """Backend source of truth: True if setup flag is completed OR any Super Admin exists."""
    flag = conn.execute(
        "SELECT value FROM system_settings WHERE key = 'initial_setup_completed'"
    ).fetchone()
    if flag and str(flag["value"]).lower() == "true":
        return True
    sa_row = conn.execute(
        """
        SELECT COUNT(*) AS cnt FROM users u
        JOIN roles r ON r.id = u.role_id
        WHERE r.slug = 'super_admin'
        """
    ).fetchone()
    return bool(sa_row and int(sa_row["cnt"]) > 0)


def mark_initial_setup_completed(conn: sqlite3.Connection, super_admin_id: int) -> None:
    now = utc_now_iso()
    for k, v in (
        ("initial_setup_completed", "true"),
        ("initial_setup_completed_at", now),
        ("initial_super_admin_id", str(super_admin_id)),
    ):
        conn.execute(
            """
            INSERT INTO system_settings (key, value, updated_at)
            VALUES (?, ?, ?)
            ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at
            """,
            (k, v, now),
        )


def get_role_permissions_map(conn: sqlite3.Connection, role_id: int) -> dict:
    rows = conn.execute(
        """
        SELECT module, can_view, can_create, can_edit, can_delete, can_export, can_assign
        FROM role_permissions WHERE role_id = ?
        """,
        (role_id,),
    ).fetchall()
    result = {
        mod_key: {a: False for a in PERMISSION_ACTIONS}
        for mod_key, _ in PERMISSION_MODULES
    }
    for r in rows:
        mod = r["module"]
        if mod in result:
            result[mod] = {
                "view": bool(r["can_view"]),
                "create": bool(r["can_create"]),
                "edit": bool(r["can_edit"]),
                "delete": bool(r["can_delete"]),
                "export": bool(r["can_export"]),
                "assign": bool(r["can_assign"]),
            }
    return result


def log_activity(
    conn: sqlite3.Connection,
    actor_user_id: int | None,
    actor_name: str,
    action: str,
    module: str,
    record_id: str = "",
    details: str = "",
    ip_address: str = "",
) -> None:
    conn.execute(
        """
        INSERT INTO activity_logs (actor_user_id, actor_name, action, module, record_id, details, ip_address, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (
            actor_user_id,
            actor_name or "System",
            action,
            module,
            str(record_id or ""),
            details or "",
            ip_address or "",
            utc_now_iso(),
        ),
    )


def count_active_super_admins(conn: sqlite3.Connection, exclude_user_id: int | None = None) -> int:
    if exclude_user_id is not None:
        row = conn.execute(
            """
            SELECT COUNT(*) AS cnt
            FROM users u
            JOIN roles r ON r.id = u.role_id
            WHERE r.slug = 'super_admin' AND u.status = 'Active' AND u.id != ?
            """,
            (exclude_user_id,),
        ).fetchone()
    else:
        row = conn.execute(
            """
            SELECT COUNT(*) AS cnt
            FROM users u
            JOIN roles r ON r.id = u.role_id
            WHERE r.slug = 'super_admin' AND u.status = 'Active'
            """
        ).fetchone()
    return int(row["cnt"]) if row else 0


def serialize_user_row(row: sqlite3.Row) -> dict:
    """Safe user serializer — NEVER exposes password_hash, salt, or token hashes."""
    return {
        "id": row["id"],
        "full_name": row["full_name"],
        "email": row["email"],
        "mobile": row["mobile"] or "",
        "employee_id": row["employee_id"],
        "avatar_url": row["avatar_url"] or "",
        "department_id": row["department_id"],
        "department_name": row["department_name"] or "",
        "designation": row["designation"] or "",
        "role_id": row["role_id"],
        "role_name": row["role_name"] or "",
        "role_slug": row["role_slug"] or "",
        "team_id": row["team_id"],
        "team_name": row["team_name"] or "",
        "reporting_manager_id": row["reporting_manager_id"],
        "reporting_manager_name": row["reporting_manager_name"] or "",
        "status": row["status"],
        "created_at": row["created_at"],
        "updated_at": row["updated_at"],
        "last_login_at": row["last_login_at"] or "",
    }
