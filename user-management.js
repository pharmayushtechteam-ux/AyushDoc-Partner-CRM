/**
 * AyushDoc+ Partner CRM — User Management Module
 * Connects to /api/auth/* and /api/um/* (SQLite-backed with server-side RBAC).
 */
(function () {
  const umState = {
    authLoaded: false,
    needsSetup: false,
    authenticated: false,
    user: null,
    permissions: {},
    modules: [],
    actions: ['view', 'create', 'edit', 'delete', 'export', 'assign'],
    activeTab: 'users', // users | roles | org | logs | profile
    profileUserId: null,
    dashboard: null,
    roles: [],
    departments: [],
    teams: [],
    allUsersBrief: [],
    usersResult: { items: [], total: 0, page: 1, page_size: 10, total_pages: 1 },
    usersQuery: { q: '', role_id: '', department_id: '', team_id: '', status: '', sort_by: 'created_at', sort_dir: 'desc', page: 1, page_size: 10 },
    teamQuery: { q: '', role_id: '', department_id: '', team_id: '', status: '', page: 1, page_size: 10 },
    teamUsersResult: { items: [], total: 0, page: 1, page_size: 10, total_pages: 1 },
    viewMode: 'um', // um | team
    logsResult: { items: [], total: 0, page: 1, page_size: 15, total_pages: 1 },
    logsQuery: { q: '', action: '', page: 1, page_size: 15 },
    lastInviteLink: null,
    lastInviteNote: '',
    prefillEmail: '',
    container: null,
    toastFn: (msg) => console.log(msg),
    modalBackdrop: null,
    modalContent: null,
  };

  function esc(val) {
    return String(val ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function initialsOf(name) {
    return (String(name || 'U').trim().split(/\s+/).map(w => w[0]).join('').slice(0, 2) || 'U').toUpperCase();
  }

  function fmtDate(iso) {
    if (!iso) return '—';
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  }

  function fmtDateShort(iso) {
    if (!iso) return '—';
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso.slice(0, 10);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  function can(moduleKey, action) {
    if (!umState.authenticated || !umState.user) return false;
    if (umState.user.role_slug === 'super_admin') return true;
    return Boolean(umState.permissions?.[moduleKey]?.[action]);
  }

  function buildWindowedPages(currentPage, totalPages) {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages = [1];
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    if (start > 2) pages.push('...');
    for (let p = start; p <= end; p++) pages.push(p);
    if (end < totalPages - 1) pages.push('...');
    pages.push(totalPages);
    return pages;
  }

  function suggestNextEmployeeId() {
    let maxNum = 0;
    (umState.allUsersBrief || []).forEach(u => {
      const m = String(u.employee_id || '').match(/(\d+)/);
      if (m) maxNum = Math.max(maxNum, parseInt(m[1], 10));
    });
    return `EMP-${String(maxNum + 1).padStart(3, '0')}`;
  }

  function countRolePermissions(perms) {
    let totalEnabled = 0;
    let modulesWithView = 0;
    (umState.modules || []).forEach(m => {
      const p = perms?.[m.key] || {};
      if (p.view) modulesWithView += 1;
      (umState.actions || []).forEach(a => {
        if (p[a]) totalEnabled += 1;
      });
    });
    return { totalEnabled, modulesWithView };
  }

  function extractTokenFromInput(rawVal) {
    const s = String(rawVal || '').trim();
    if (!s) return '';
    if (s.includes('token=')) {
      const qIdx = s.indexOf('?');
      const qStr = qIdx >= 0 ? s.slice(qIdx + 1) : s.slice(s.indexOf('token='));
      const tok = new URLSearchParams(qStr).get('token');
      if (tok) return tok.trim();
    }
    return s;
  }

  function rerenderActiveContainer() {
    if (!umState.container) return Promise.resolve();
    return umState.viewMode === 'team' ? renderTeamRolesView(umState.container) : renderView(umState.container);
  }

  async function api(url, opts = {}) {
    const fetchOpts = {
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) },
      ...opts,
    };
    const res = await fetch(url, fetchOpts);
    let data = {};
    try { data = await res.json(); } catch (_) { data = {}; }
    if (!res.ok) {
      const err = new Error(data.error || `Request failed (${res.status})`);
      err.status = res.status;
      err.data = data;
      throw err;
    }
    return data;
  }

  function syncHeaderUser() {
    const nameEl = document.getElementById('headerUserName');
    const orgEl = document.getElementById('headerUserOrg');
    const avEl = document.getElementById('headerUserAvatar');
    if (umState.authenticated && umState.user) {
      if (nameEl) nameEl.textContent = umState.user.full_name;
      if (orgEl) orgEl.textContent = umState.user.role_name;
      if (avEl) avEl.textContent = initialsOf(umState.user.full_name);
    } else if (umState.authLoaded) {
      if (nameEl) nameEl.textContent = umState.needsSetup ? 'Setup Admin' : 'Sign In';
      if (orgEl) orgEl.textContent = 'AyushDoc+ CRM';
      if (avEl) avEl.textContent = 'AD';
    }
    window.dispatchEvent(new CustomEvent('ayush-auth-changed', {
      detail: {
        authenticated: umState.authenticated,
        needsSetup: umState.needsSetup,
        user: umState.user,
        permissions: umState.permissions,
      },
    }));
  }

  function openModal(html, wide = true) {
    if (!umState.modalBackdrop || !umState.modalContent) return;
    umState.modalContent.classList.toggle('modal-wide', wide);
    umState.modalContent.innerHTML = html;
    umState.modalBackdrop.style.display = 'flex';
    const closeBtn = umState.modalContent.querySelector('#closeModalBtn');
    const cancelBtn = umState.modalContent.querySelector('#cancelModalBtn');
    const closeFn = () => {
      umState.modalBackdrop.style.display = 'none';
      umState.modalContent.classList.remove('modal-wide');
    };
    if (closeBtn) closeBtn.onclick = closeFn;
    if (cancelBtn) cancelBtn.onclick = closeFn;
    return closeFn;
  }

  function closeModal() {
    if (!umState.modalBackdrop || !umState.modalContent) return;
    umState.modalBackdrop.style.display = 'none';
    umState.modalContent.classList.remove('modal-wide');
  }

  async function refreshAuthStatus() {
    const data = await api('/api/auth/status');
    umState.authLoaded = true;
    umState.needsSetup = Boolean(data.needs_setup);
    umState.authenticated = Boolean(data.authenticated);
    umState.user = data.user || null;
    umState.permissions = data.permissions || {};
    umState.modules = data.modules || [];
    umState.actions = data.actions || ['view', 'create', 'edit', 'delete', 'export', 'assign'];
    syncHeaderUser();
    return data;
  }

  function parseHashAction() {
    const h = window.location.hash || '';
    if (h.startsWith('#activate?')) {
      const token = new URLSearchParams(h.slice('#activate?'.length)).get('token') || '';
      return { mode: 'activate', token };
    }
    if (h.startsWith('#reset-password?')) {
      const token = new URLSearchParams(h.slice('#reset-password?'.length)).get('token') || '';
      return { mode: 'reset', token };
    }
    return null;
  }

  function renderAvatar(u, large = false) {
    if (u.avatar_url) {
      return `<img src="${esc(u.avatar_url)}" alt="${esc(u.full_name)}" class="${large ? 'um-avatar-lg' : 'um-avatar-img'}" />`;
    }
    const cls = large ? 'avatar-circle avatar-blue um-avatar-lg' : 'avatar-circle avatar-blue';
    return `<div class="${cls}">${esc(initialsOf(u.full_name))}</div>`;
  }

  function statusBadge(st) {
    const cls = st === 'Active' ? 'badge-active' : st === 'Pending' ? 'badge-pending' : 'badge-inactive';
    return `<span class="status-badge ${cls}">${esc(st)}</span>`;
  }

  // ---------------- AUTH / SETUP / TOKEN VIEWS ----------------
  function renderAuthView(forcedMode = null, token = '') {
    const c = umState.container;
    if (!c) return;

    const backHome = async () => {
      window.location.hash = umState.viewMode === 'team' ? '#team' : '#user-management';
      await refreshAuthStatus().catch(() => {});
      if (umState.authenticated) {
        await rerenderActiveContainer();
      } else {
        renderAuthView();
      }
    };

    if (forcedMode === 'activate') {
      c.innerHTML = `
        <div class="um-auth-card">
          <h2>Activate Your CRM Account</h2>
          <p>Paste your invitation token (or full invite URL) and set a strong password (minimum 8 characters) to activate your AyushDoc+ Partner CRM account.</p>
          <div id="umAuthAlert"></div>
          <form id="umActivateForm">
            <div class="form-group">
              <label>Invitation Token or Invite Link *</label>
              <input type="text" name="token" value="${esc(token)}" required placeholder="Paste token or #activate?token=... link" />
            </div>
            <div class="form-group">
              <label>Create Password (min 8 chars) *</label>
              <input type="password" name="password" minlength="8" required placeholder="Enter a strong password" />
            </div>
            <div class="modal-actions modal-actions-split">
              <button type="button" class="btn btn-outline" id="umBackToLoginBtn">← Back</button>
              <button type="submit" class="btn btn-primary">Activate Account</button>
            </div>
          </form>
        </div>
      `;
      document.getElementById('umBackToLoginBtn')?.addEventListener('click', backHome);
      document.getElementById('umActivateForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const fd = new FormData(e.target);
        const alertBox = document.getElementById('umAuthAlert');
        try {
          const cleanToken = extractTokenFromInput(fd.get('token'));
          const res = await api('/api/auth/activate', {
            method: 'POST',
            body: JSON.stringify({ token: cleanToken, password: fd.get('password') }),
          });
          if (res.email) umState.prefillEmail = res.email;
          alertBox.innerHTML = `<div class="um-alert um-alert-success">${esc(res.message)}</div>`;
          umState.toastFn(res.message);
          window.location.hash = umState.viewMode === 'team' ? '#team' : '#user-management';
          setTimeout(() => renderAuthView(), 1100);
        } catch (err) {
          alertBox.innerHTML = `<div class="um-alert um-alert-error">${esc(err.message)}</div>`;
        }
      });
      return;
    }

    if (forcedMode === 'reset') {
      c.innerHTML = `
        <div class="um-auth-card">
          <h2>Reset Your Password</h2>
          <p>Request a one-time reset token by email or paste an administrator-issued reset token below.</p>
          <div id="umAuthAlert"></div>

          <div class="um-reset-request-box">
            <div class="um-reset-req-title">Step 1: Need a Reset Token?</div>
            <form id="umRequestResetForm" style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-top:6px;">
              <input type="email" name="email" value="${esc(umState.prefillEmail || '')}" required placeholder="Enter your registered email" style="flex:1;min-width:190px;" />
              <button type="submit" class="btn btn-outline" style="white-space:nowrap;">Generate Reset Token</button>
            </form>
          </div>

          <form id="umResetForm" style="margin-top:16px;">
            <div class="form-group">
              <label>Step 2: Reset Token or Link *</label>
              <input type="text" name="token" id="umResetTokenInput" value="${esc(token)}" required placeholder="Paste reset token or #reset-password?token=... link" />
            </div>
            <div class="form-group">
              <label>New Password (min 8 chars) *</label>
              <input type="password" name="new_password" minlength="8" required placeholder="Enter new password" />
            </div>
            <div class="modal-actions modal-actions-split">
              <button type="button" class="btn btn-outline" id="umBackToLoginBtn">← Back</button>
              <button type="submit" class="btn btn-primary">Update Password</button>
            </div>
          </form>
        </div>
      `;
      document.getElementById('umBackToLoginBtn')?.addEventListener('click', backHome);
      document.getElementById('umRequestResetForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const fd = new FormData(e.target);
        const alertBox = document.getElementById('umAuthAlert');
        try {
          const email = String(fd.get('email') || '').trim();
          const res = await api('/api/auth/request-reset', {
            method: 'POST',
            body: JSON.stringify({ email }),
          });
          umState.prefillEmail = email;
          const tokInp = document.getElementById('umResetTokenInput');
          if (tokInp && res.reset_token) tokInp.value = res.reset_token;
          alertBox.innerHTML = `<div class="um-alert um-alert-success">${esc(res.message)} ${esc(res.email_note || '')} Token pre-filled below.</div>`;
          umState.toastFn(res.message);
        } catch (err) {
          alertBox.innerHTML = `<div class="um-alert um-alert-error">${esc(err.message)}</div>`;
        }
      });
      document.getElementById('umResetForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const fd = new FormData(e.target);
        const alertBox = document.getElementById('umAuthAlert');
        try {
          const cleanToken = extractTokenFromInput(fd.get('token'));
          const res = await api('/api/auth/reset-password', {
            method: 'POST',
            body: JSON.stringify({ token: cleanToken, new_password: fd.get('new_password') }),
          });
          if (res.email) umState.prefillEmail = res.email;
          alertBox.innerHTML = `<div class="um-alert um-alert-success">${esc(res.message)}</div>`;
          umState.toastFn(res.message);
          window.location.hash = umState.viewMode === 'team' ? '#team' : '#user-management';
          setTimeout(() => renderAuthView(), 1100);
        } catch (err) {
          alertBox.innerHTML = `<div class="um-alert um-alert-error">${esc(err.message)}</div>`;
        }
      });
      return;
    }

    if (umState.needsSetup) {
      c.innerHTML = `
        <div class="um-auth-card">
          <h2>Initial Super Admin Setup</h2>
          <p>No users exist in the database yet. Create your first <strong>Super Admin</strong> account to initialize User Management &amp; Role-Based Access Control. This setup can only be completed once.</p>
          <div id="umAuthAlert"></div>
          <form id="umSetupForm">
            <div class="form-group">
              <label>Full Name *</label>
              <input type="text" name="full_name" required placeholder="e.g. Rajesh Nair" />
            </div>
            <div class="form-grid-2">
              <div class="form-group">
                <label>Email Address *</label>
                <input type="email" name="email" required placeholder="admin@ayushdoc.in" />
              </div>
              <div class="form-group">
                <label>Employee ID *</label>
                <input type="text" name="employee_id" value="EMP-001" required />
              </div>
            </div>
            <div class="form-grid-2">
              <div class="form-group">
                <label>Mobile Number</label>
                <input type="text" name="mobile" placeholder="+91 98470 00000" />
              </div>
              <div class="form-group">
                <label>Password (min 8 chars) *</label>
                <input type="password" name="password" minlength="8" required placeholder="••••••••" />
              </div>
            </div>
            <div class="modal-actions">
              <button type="submit" class="btn btn-primary" style="width:100%;justify-content:center;">Create Super Admin &amp; Sign In</button>
            </div>
          </form>
        </div>
      `;
      document.getElementById('umSetupForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const fd = new FormData(e.target);
        const alertBox = document.getElementById('umAuthAlert');
        try {
          const res = await api('/api/auth/setup', {
            method: 'POST',
            body: JSON.stringify(Object.fromEntries(fd.entries())),
          });
          umState.toastFn(res.message);
          await refreshAuthStatus();
          await rerenderActiveContainer();
        } catch (err) {
          alertBox.innerHTML = `<div class="um-alert um-alert-error">${esc(err.message)}</div>`;
        }
      });
      return;
    }

    c.innerHTML = `
      <div class="um-auth-card">
        <h2>Sign In to AyushDoc+ CRM</h2>
        <p>Authenticate with your AyushDoc+ CRM credentials to access role-protected User Management, Team &amp; Roles features.</p>
        <div id="umAuthAlert"></div>
        <form id="umLoginForm">
          <div class="form-group">
            <label>Email Address *</label>
            <input type="email" name="email" value="${esc(umState.prefillEmail || '')}" required placeholder="name@ayushdoc.in" />
          </div>
          <div class="form-group">
            <label>Password *</label>
            <input type="password" name="password" required placeholder="Enter your password" />
          </div>
          <div class="modal-actions modal-actions-split">
            <div style="display:flex;gap:8px;flex-wrap:wrap;">
              <button type="button" class="action-pill-btn" id="umGoActivateBtn">Have Invite Token?</button>
              <button type="button" class="action-pill-btn" id="umGoResetBtn">Reset Password</button>
            </div>
            <button type="submit" class="btn btn-primary">Sign In</button>
          </div>
        </form>
      </div>
    `;
    document.getElementById('umGoActivateBtn')?.addEventListener('click', () => renderAuthView('activate', ''));
    document.getElementById('umGoResetBtn')?.addEventListener('click', () => renderAuthView('reset', ''));
    document.getElementById('umLoginForm')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const alertBox = document.getElementById('umAuthAlert');
      try {
        const res = await api('/api/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email: fd.get('email'), password: fd.get('password') }),
        });
        umState.prefillEmail = '';
        umState.toastFn(res.message);
        await refreshAuthStatus();
        await rerenderActiveContainer();
      } catch (err) {
        alertBox.innerHTML = `<div class="um-alert um-alert-error">${esc(err.message)}</div>`;
      }
    });
  }

  // ---------------- DATA FETCHERS ----------------
  async function loadCoreReferenceData() {
    const [dash, rolesRes, deptsRes, teamsRes, allBrief] = await Promise.all([
      api('/api/um/dashboard'),
      api('/api/um/roles'),
      api('/api/um/departments'),
      api('/api/um/teams'),
      api('/api/um/users?page=1&page_size=100'),
    ]);
    umState.dashboard = dash;
    umState.roles = rolesRes.roles || [];
    umState.departments = deptsRes.departments || [];
    umState.teams = teamsRes.teams || [];
    umState.allUsersBrief = allBrief.items || [];
  }

  async function loadUsersTable() {
    const q = umState.usersQuery;
    const params = new URLSearchParams();
    Object.entries(q).forEach(([k, v]) => {
      if (v !== '' && v !== null && v !== undefined) params.set(k, String(v));
    });
    umState.usersResult = await api(`/api/um/users?${params.toString()}`);
  }

  async function loadTeamUsersTable() {
    const q = umState.teamQuery;
    const params = new URLSearchParams();
    Object.entries(q).forEach(([k, v]) => {
      if (v !== '' && v !== null && v !== undefined) params.set(k, String(v));
    });
    umState.teamUsersResult = await api(`/api/um/users?${params.toString()}`);
  }

  async function loadLogsTable() {
    const q = umState.logsQuery;
    const params = new URLSearchParams();
    Object.entries(q).forEach(([k, v]) => {
      if (v !== '' && v !== null && v !== undefined) params.set(k, String(v));
    });
    umState.logsResult = await api(`/api/um/logs?${params.toString()}`);
  }

  // ---------------- MAIN RENDER SHELL ----------------
  async function renderView(container) {
    umState.viewMode = 'um';
    umState.container = container;
    container.innerHTML = `<div class="panel-card"><div class="um-empty-state">Loading User Management...</div></div>`;

    try {
      await refreshAuthStatus();
    } catch (err) {
      container.innerHTML = `<div class="panel-card"><div class="um-alert um-alert-error">Unable to connect to User Management backend API: ${esc(err.message)}</div></div>`;
      return;
    }

    const hashAction = parseHashAction();
    if (hashAction) {
      renderAuthView(hashAction.mode, hashAction.token);
      return;
    }

    if (!umState.authenticated) {
      renderAuthView();
      return;
    }

    // If user lacks user_management:view permission, show Access Denied + My Profile only
    if (!can('user_management', 'view')) {
      if (umState.activeTab !== 'profile') {
        container.innerHTML = `
          <div class="panel-card">
            <div class="panel-header">
              <div class="panel-title"><h2>Access Restricted</h2></div>
              <div style="display:flex;gap:8px;">
                <button class="btn btn-outline" id="umViewOwnProfileBtn">My Profile</button>
                <button class="btn btn-outline" id="umSignOutBtn">Sign Out (${esc(umState.user.full_name)})</button>
              </div>
            </div>
            <div class="um-alert um-alert-error">
              Access Denied (403): Your assigned role (<strong>${esc(umState.user.role_name)}</strong>) does not have permission to view User Management. Backend APIs enforce this restriction automatically.
            </div>
          </div>
        `;
        document.getElementById('umViewOwnProfileBtn')?.addEventListener('click', () => {
          umState.activeTab = 'profile';
          umState.profileUserId = umState.user.id;
          renderView(container);
        });
        document.getElementById('umSignOutBtn')?.addEventListener('click', handleSignOut);
        return;
      }
      await renderProfileTabOnly(container);
      return;
    }

    try {
      await loadCoreReferenceData();
      if (umState.activeTab === 'users') await loadUsersTable();
      else if (umState.activeTab === 'logs') await loadLogsTable();
    } catch (err) {
      container.innerHTML = `<div class="panel-card"><div class="um-alert um-alert-error">${esc(err.message)}</div></div>`;
      return;
    }

    const d = umState.dashboard || {};
    container.innerHTML = `
      <section class="um-kpi-grid">
        <button type="button" class="um-kpi-card um-kpi-clickable accent-blue" data-kpi-nav="users" data-kpi-status="">
          <div class="um-kpi-label">Total Users</div>
          <div class="um-kpi-val">${d.total_users ?? 0}</div>
          <div class="um-kpi-sub">${d.administrators ?? 0} Admins • ${d.employees ?? 0} Team</div>
        </button>
        <button type="button" class="um-kpi-card um-kpi-clickable accent-green" data-kpi-nav="users" data-kpi-status="Active">
          <div class="um-kpi-label">Active Users</div>
          <div class="um-kpi-val">${d.active_users ?? 0}</div>
          <div class="um-kpi-sub">Click to view active</div>
        </button>
        <button type="button" class="um-kpi-card um-kpi-clickable accent-red" data-kpi-nav="users" data-kpi-status="Inactive">
          <div class="um-kpi-label">Inactive Users</div>
          <div class="um-kpi-val">${d.inactive_users ?? 0}</div>
          <div class="um-kpi-sub">Click to view inactive</div>
        </button>
        <button type="button" class="um-kpi-card um-kpi-clickable accent-purple" data-kpi-nav="roles">
          <div class="um-kpi-label">Roles</div>
          <div class="um-kpi-val">${d.total_roles ?? umState.roles.length}</div>
          <div class="um-kpi-sub">${d.system_roles ?? 5} System • ${d.custom_roles ?? 0} Custom</div>
        </button>
        <button type="button" class="um-kpi-card um-kpi-clickable accent-amber" data-kpi-nav="users" data-kpi-status="Pending">
          <div class="um-kpi-label">Pending Invitations</div>
          <div class="um-kpi-val">${d.pending_invitations ?? 0}</div>
          <div class="um-kpi-sub">Awaiting activation</div>
        </button>
        <button type="button" class="um-kpi-card um-kpi-clickable accent-teal" data-kpi-nav="org">
          <div class="um-kpi-label">Depts &amp; Teams</div>
          <div class="um-kpi-val">${d.total_departments ?? umState.departments.length} <span style="font-size:15px;font-weight:700;color:#64748b;">/ ${d.total_teams ?? umState.teams.length}</span></div>
          <div class="um-kpi-sub">Org structure</div>
        </button>
      </section>

      <div class="panel-card" style="padding:14px 18px;">
        <div class="um-subnav">
          <div class="filter-tabs" id="umSubTabs">
            <button class="filter-tab ${umState.activeTab === 'users' ? 'active' : ''}" data-um-tab="users">Users (${d.total_users ?? 0})</button>
            <button class="filter-tab ${umState.activeTab === 'roles' ? 'active' : ''}" data-um-tab="roles">Roles &amp; Permissions (${umState.roles.length})</button>
            <button class="filter-tab ${umState.activeTab === 'org' ? 'active' : ''}" data-um-tab="org">Departments &amp; Teams</button>
            <button class="filter-tab ${umState.activeTab === 'logs' ? 'active' : ''}" data-um-tab="logs">Activity Logs</button>
            <button class="filter-tab ${umState.activeTab === 'profile' ? 'active' : ''}" data-um-tab="profile">User Profile</button>
          </div>
          <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
            <span class="entity-sub">Signed in as <strong>${esc(umState.user.full_name)}</strong> (${esc(umState.user.role_name)})</span>
            <button class="action-pill-btn" id="umSignOutBtn">Sign Out</button>
          </div>
        </div>
      </div>

      ${umState.lastInviteLink ? `
        <div class="panel-card" style="padding:14px 18px;border-color:#bbf7d0;background:#f0fdf4;">
          <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;">
            <strong style="color:#15803d;font-size:13.5px;">Secure One-Time Link Generated</strong>
            <button class="action-pill-btn" id="umDismissLinkBtn">Dismiss</button>
          </div>
          <div class="entity-sub" style="margin-top:4px;color:#166534;">${esc(umState.lastInviteNote)}</div>
          <div class="um-link-copy-box">
            <input type="text" readonly value="${esc(umState.lastInviteLink)}" id="umGeneratedLinkInput" />
            <button type="button" class="action-pill-btn pill-blue" id="umCopyLinkBtn">Copy Link</button>
            <button type="button" class="action-pill-btn pill-green" id="umOpenGeneratedLinkBtn">Open Link Now</button>
          </div>
        </div>
      ` : ''}

      <div id="umTabBody"></div>
    `;

    container.querySelectorAll('[data-kpi-nav]').forEach(card => {
      card.addEventListener('click', () => {
        const nav = card.getAttribute('data-kpi-nav');
        umState.activeTab = nav;
        if (nav === 'users') {
          umState.usersQuery.status = card.getAttribute('data-kpi-status') ?? '';
          umState.usersQuery.page = 1;
        }
        renderView(container);
      });
    });

    container.querySelectorAll('#umSubTabs [data-um-tab]').forEach(btn => {
      btn.addEventListener('click', () => {
        umState.activeTab = btn.getAttribute('data-um-tab');
        if (umState.activeTab === 'profile' && !umState.profileUserId) {
          umState.profileUserId = umState.user.id;
        }
        renderView(container);
      });
    });

    document.getElementById('umSignOutBtn')?.addEventListener('click', handleSignOut);
    document.getElementById('umDismissLinkBtn')?.addEventListener('click', () => {
      umState.lastInviteLink = null;
      renderView(container);
    });
    document.getElementById('umCopyLinkBtn')?.addEventListener('click', () => {
      const inp = document.getElementById('umGeneratedLinkInput');
      if (inp) {
        navigator.clipboard?.writeText(inp.value);
        umState.toastFn('Copied secure link to clipboard!');
      }
    });
    document.getElementById('umOpenGeneratedLinkBtn')?.addEventListener('click', () => {
      const link = umState.lastInviteLink || '';
      const tok = extractTokenFromInput(link);
      const mode = link.includes('reset-password') ? 'reset' : 'activate';
      renderAuthView(mode, tok);
    });

    const bodyEl = document.getElementById('umTabBody');
    if (umState.activeTab === 'users') renderUsersTab(bodyEl);
    else if (umState.activeTab === 'roles') renderRolesTab(bodyEl);
    else if (umState.activeTab === 'org') renderOrgTab(bodyEl);
    else if (umState.activeTab === 'logs') renderLogsTab(bodyEl);
    else if (umState.activeTab === 'profile') await renderProfileTab(bodyEl, umState.profileUserId || umState.user.id);
  }

  async function handleSignOut() {
    try {
      await api('/api/auth/logout', { method: 'POST', body: '{}' });
      umState.toastFn('Signed out successfully.');
      umState.lastInviteLink = null;
      await refreshAuthStatus();
      if (umState.container && (umState.viewMode === 'um' || umState.viewMode === 'team')) {
        await rerenderActiveContainer();
      }
    } catch (err) {
      umState.toastFn(err.message);
    }
  }

  // ---------------- TAB 1: USERS DIRECTORY ----------------
  function renderUsersTab(bodyEl) {
    const q = umState.usersQuery;
    const res = umState.usersResult;
    const sortArrow = (col) => (q.sort_by === col ? (q.sort_dir === 'asc' ? '▲' : '▼') : '↕');
    const hasActiveFilters = Boolean(q.q || q.role_id || q.department_id || q.team_id || q.status);
    const pages = buildWindowedPages(res.page, res.total_pages);

    bodyEl.innerHTML = `
      <div class="panel-card">
        <div class="panel-header">
          <div class="panel-title"><h2>User Directory (${res.total})</h2></div>
          <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;">
            ${hasActiveFilters ? `<button class="btn btn-outline" id="umResetFiltersBtn">Reset Filters</button>` : ''}
            ${can('user_management', 'export') ? `<button class="btn btn-outline" id="umExportUsersBtn">Export CSV</button>` : ''}
            ${can('user_management', 'create') ? `<button class="btn btn-primary" id="umOpenAddUserBtn">+ Add New User</button>` : ''}
          </div>
        </div>

        <div class="um-filters-row">
          <input type="text" id="umSearchInput" value="${esc(q.q)}" placeholder="Search name, email, employee ID..." />
          <select id="umFilterRole">
            <option value="">All Roles</option>
            ${umState.roles.map(r => `<option value="${r.id}" ${String(q.role_id) === String(r.id) ? 'selected' : ''}>${esc(r.name)}</option>`).join('')}
          </select>
          <select id="umFilterDept">
            <option value="">All Departments</option>
            ${umState.departments.map(d => `<option value="${d.id}" ${String(q.department_id) === String(d.id) ? 'selected' : ''}>${esc(d.name)}</option>`).join('')}
          </select>
          <select id="umFilterTeam">
            <option value="">All Teams</option>
            ${umState.teams.map(t => `<option value="${t.id}" ${String(q.team_id) === String(t.id) ? 'selected' : ''}>${esc(t.name)}</option>`).join('')}
          </select>
          <select id="umFilterStatus">
            <option value="">All Statuses</option>
            ${['Active', 'Inactive', 'Pending'].map(s => `<option value="${s}" ${q.status === s ? 'selected' : ''}>${s}</option>`).join('')}
          </select>
          <select id="umPageSizeSelect" title="Rows per page">
            ${[5, 10, 25, 50].map(sz => `<option value="${sz}" ${Number(q.page_size) === sz ? 'selected' : ''}>${sz} / page</option>`).join('')}
          </select>
        </div>

        ${res.items.length === 0 ? `
          <div class="um-empty-state">
            <h3>No users found</h3>
            <p>Adjust your search or filters, or add a new user to get started.</p>
          </div>
        ` : `
          <div class="table-no-scroll table-compact">
            <table class="data-table">
              <thead>
                <tr>
                  <th><button class="um-sort-btn" data-sort="full_name">Employee ${sortArrow('full_name')}</button></th>
                  <th>Contact &amp; ID</th>
                  <th><button class="um-sort-btn" data-sort="role_name">Role ${sortArrow('role_name')}</button></th>
                  <th><button class="um-sort-btn" data-sort="department_name">Dept / Team ${sortArrow('department_name')}</button></th>
                  <th><button class="um-sort-btn" data-sort="status">Status ${sortArrow('status')}</button></th>
                  <th><button class="um-sort-btn" data-sort="last_login_at">Created / Login ${sortArrow('last_login_at')}</button></th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                ${res.items.map(u => `
                  <tr>
                    <td data-label="Employee" class="td-primary">
                      <div class="followup-entity">
                        ${renderAvatar(u)}
                        <div class="entity-info">
                          <div class="entity-name">${esc(u.full_name)}</div>
                          <div class="entity-sub">${esc(u.designation || 'Team Member')}</div>
                        </div>
                      </div>
                    </td>
                    <td data-label="Contact & ID">
                      <div style="font-weight:600;font-size:12.5px;">${esc(u.email)}</div>
                      <div class="entity-sub">${esc(u.employee_id)}${u.mobile ? ' • ' + esc(u.mobile) : ''}</div>
                    </td>
                    <td data-label="Role">
                      <strong>${esc(u.role_name)}</strong>
                    </td>
                    <td data-label="Dept / Team">
                      <div>${esc(u.department_name || 'Unassigned')}</div>
                      <div class="entity-sub">${esc(u.team_name || 'No Team')}</div>
                    </td>
                    <td data-label="Status">${statusBadge(u.status)}</td>
                    <td data-label="Created / Login">
                      <div style="font-size:12px;">${esc(fmtDateShort(u.created_at))}</div>
                      <div class="entity-sub">Login: ${u.last_login_at ? esc(fmtDateShort(u.last_login_at)) : 'Never'}</div>
                    </td>
                    <td data-label="Actions" class="td-action">
                      <div class="followup-actions" style="gap:5px;flex-wrap:wrap;">
                        <button type="button" class="action-pill-btn pill-blue" data-um-view="${u.id}">Profile</button>
                        ${can('user_management', 'edit') ? `<button type="button" class="action-pill-btn" data-um-edit="${u.id}">Edit</button>` : ''}
                        ${can('user_management', 'edit') && u.status === 'Pending' ? `
                          <button type="button" class="action-pill-btn pill-amber" data-um-invite-user="${u.id}">Invite Link</button>
                        ` : ''}
                        ${can('user_management', 'edit') && u.status !== 'Pending' ? `
                          <button type="button" class="action-pill-btn ${u.status === 'Active' ? '' : 'pill-green'}" data-um-toggle="${u.id}" data-next-status="${u.status === 'Active' ? 'Inactive' : 'Active'}">
                            ${u.status === 'Active' ? 'Deactivate' : 'Activate'}
                          </button>
                          <button type="button" class="action-pill-btn" data-um-reset-pw="${u.id}" title="Generate password reset link">Reset PW</button>
                        ` : ''}
                        ${can('user_management', 'delete') && u.id !== umState.user.id ? `
                          <button type="button" class="action-pill-btn" style="color:#b91c1c;border-color:#fecaca;" data-um-delete="${u.id}" data-um-name="${esc(u.full_name)}">Delete</button>
                        ` : ''}
                      </div>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          <div class="pagination-bar">
            <div class="pagination-info">
              <span>Showing <strong>${res.items.length}</strong> of <strong>${res.total}</strong> users (Page <strong>${res.page}</strong> of <strong>${res.total_pages}</strong>)</span>
            </div>
            <div class="pagination-controls">
              <button class="page-btn" id="umUsersPrev" ${res.page <= 1 ? 'disabled' : ''}>‹ Prev</button>
              ${pages.map(p => p === '...'
                ? `<span class="page-ellipsis">…</span>`
                : `<button class="page-btn ${p === res.page ? 'active' : ''}" data-um-page="${p}">${p}</button>`
              ).join('')}
              <button class="page-btn" id="umUsersNext" ${res.page >= res.total_pages ? 'disabled' : ''}>Next ›</button>
            </div>
          </div>
        `}
      </div>
    `;

    let searchTimer;
    document.getElementById('umSearchInput')?.addEventListener('input', (e) => {
      clearTimeout(searchTimer);
      umState.usersQuery.q = e.target.value;
      umState.usersQuery.page = 1;
      searchTimer = setTimeout(async () => {
        await loadUsersTable();
        renderUsersTab(bodyEl);
        const inp = document.getElementById('umSearchInput');
        if (inp) { inp.focus(); inp.setSelectionRange(inp.value.length, inp.value.length); }
      }, 220);
    });

    const bindSel = (id, key) => {
      document.getElementById(id)?.addEventListener('change', async (e) => {
        umState.usersQuery[key] = key === 'page_size' ? Number(e.target.value) : e.target.value;
        umState.usersQuery.page = 1;
        await loadUsersTable();
        renderUsersTab(bodyEl);
      });
    };
    bindSel('umFilterRole', 'role_id');
    bindSel('umFilterDept', 'department_id');
    bindSel('umFilterTeam', 'team_id');
    bindSel('umFilterStatus', 'status');
    bindSel('umPageSizeSelect', 'page_size');

    document.getElementById('umResetFiltersBtn')?.addEventListener('click', async () => {
      umState.usersQuery = { ...umState.usersQuery, q: '', role_id: '', department_id: '', team_id: '', status: '', page: 1 };
      await loadUsersTable();
      renderUsersTab(bodyEl);
    });

    bodyEl.querySelectorAll('[data-sort]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const col = btn.getAttribute('data-sort');
        if (umState.usersQuery.sort_by === col) {
          umState.usersQuery.sort_dir = umState.usersQuery.sort_dir === 'asc' ? 'desc' : 'asc';
        } else {
          umState.usersQuery.sort_by = col;
          umState.usersQuery.sort_dir = 'asc';
        }
        await loadUsersTable();
        renderUsersTab(bodyEl);
      });
    });

    document.getElementById('umUsersPrev')?.addEventListener('click', async () => {
      umState.usersQuery.page = Math.max(1, umState.usersQuery.page - 1);
      await loadUsersTable();
      renderUsersTab(bodyEl);
    });
    document.getElementById('umUsersNext')?.addEventListener('click', async () => {
      umState.usersQuery.page = Math.min(res.total_pages, umState.usersQuery.page + 1);
      await loadUsersTable();
      renderUsersTab(bodyEl);
    });
    bodyEl.querySelectorAll('[data-um-page]').forEach(btn => {
      btn.addEventListener('click', async () => {
        umState.usersQuery.page = Number(btn.getAttribute('data-um-page'));
        await loadUsersTable();
        renderUsersTab(bodyEl);
      });
    });

    document.getElementById('umOpenAddUserBtn')?.addEventListener('click', () => openUserFormModal(null));
    document.getElementById('umExportUsersBtn')?.addEventListener('click', () => {
      const params = new URLSearchParams();
      ['q', 'role_id', 'department_id', 'team_id', 'status'].forEach(k => {
        if (umState.usersQuery[k]) params.set(k, umState.usersQuery[k]);
      });
      window.location.href = `/api/um/users/export?${params.toString()}`;
      umState.toastFn('Downloading Users CSV export...');
    });

    bodyEl.querySelectorAll('[data-um-view]').forEach(btn => {
      btn.addEventListener('click', () => {
        umState.profileUserId = Number(btn.getAttribute('data-um-view'));
        umState.activeTab = 'profile';
        renderView(umState.container);
      });
    });

    bodyEl.querySelectorAll('[data-um-edit]').forEach(btn => {
      btn.addEventListener('click', () => {
        const uid = Number(btn.getAttribute('data-um-edit'));
        const userObj = res.items.find(x => x.id === uid);
        if (userObj) openUserFormModal(userObj);
      });
    });

    bodyEl.querySelectorAll('[data-um-invite-user]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const uid = Number(btn.getAttribute('data-um-invite-user'));
        try {
          const out = await api(`/api/um/users/${uid}/resend-invite`, { method: 'POST', body: '{}' });
          umState.lastInviteLink = out.activation_link;
          umState.lastInviteNote = `${out.message} ${out.email_note || ''}`;
          umState.toastFn(out.message);
          await rerenderActiveContainer();
        } catch (err) {
          umState.toastFn(err.message);
        }
      });
    });

    bodyEl.querySelectorAll('[data-um-reset-pw]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const uid = Number(btn.getAttribute('data-um-reset-pw'));
        try {
          const out = await api(`/api/um/users/${uid}/reset-password`, { method: 'POST', body: '{}' });
          umState.lastInviteLink = out.reset_link;
          umState.lastInviteNote = `${out.message} ${out.email_note || ''}`;
          umState.toastFn(out.message);
          await rerenderActiveContainer();
        } catch (err) {
          umState.toastFn(err.message);
        }
      });
    });

    bodyEl.querySelectorAll('[data-um-toggle]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const uid = Number(btn.getAttribute('data-um-toggle'));
        const nextSt = btn.getAttribute('data-next-status');
        try {
          const out = await api(`/api/um/users/${uid}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status: nextSt }),
          });
          umState.toastFn(out.message);
          await rerenderActiveContainer();
        } catch (err) {
          umState.toastFn(err.message);
        }
      });
    });

    bodyEl.querySelectorAll('[data-um-delete]').forEach(btn => {
      btn.addEventListener('click', () => {
        const uid = Number(btn.getAttribute('data-um-delete'));
        const name = btn.getAttribute('data-um-name');
        openModal(`
          <div class="modal-header">
            <h3>Confirm Delete User</h3>
            <button type="button" class="modal-close" id="closeModalBtn">✕</button>
          </div>
          <p style="font-size:13.5px;color:#334155;line-height:1.5;">
            Are you sure you want to permanently delete <strong>${esc(name)}</strong>? Their active sessions will be revoked immediately. This action is logged in the audit trail.
          </p>
          <div id="umDelErr" style="margin-top:10px;"></div>
          <div class="modal-actions">
            <button type="button" class="btn btn-outline" id="cancelModalBtn">Cancel</button>
            <button type="button" class="btn btn-primary" style="background:#dc2626;" id="umConfirmDeleteBtn">Delete User</button>
          </div>
        `, false);
        document.getElementById('umConfirmDeleteBtn')?.addEventListener('click', async () => {
          try {
            const out = await api(`/api/um/users/${uid}`, { method: 'DELETE' });
            closeModal();
            umState.toastFn(out.message);
            await rerenderActiveContainer();
          } catch (err) {
            document.getElementById('umDelErr').innerHTML = `<div class="um-alert um-alert-error">${esc(err.message)}</div>`;
          }
        });
      });
    });
  }

  // ---------------- ADD / EDIT USER MODAL ----------------
  function openUserFormModal(existingUser) {
    const isEdit = Boolean(existingUser);
    const u = existingUser || {};
    const assignableRoles = umState.roles.filter(r => r.is_active && (r.slug !== 'super_admin' || umState.user?.role_slug === 'super_admin'));
    const defaultEmpId = isEdit ? (u.employee_id || '') : suggestNextEmployeeId();
    let avatarDataUrl = '';

    openModal(`
      <div class="modal-header">
        <h3>${isEdit ? `Edit User — ${esc(u.full_name)}` : 'Add New CRM User'}</h3>
        <button type="button" class="modal-close" id="closeModalBtn">✕</button>
      </div>
      <div id="umUserFormAlert"></div>
      <form id="umUserForm">
        <div class="form-grid-2">
          <div class="form-group">
            <label>Full Name *</label>
            <input type="text" name="full_name" value="${esc(u.full_name || '')}" required placeholder="e.g. Ananya Menon" />
          </div>
          <div class="form-group">
            <label>Email Address *</label>
            <input type="email" name="email" value="${esc(u.email || '')}" required placeholder="ananya@ayushdoc.in" />
          </div>
        </div>
        <div class="form-grid-2">
          <div class="form-group">
            <label>Mobile Number</label>
            <input type="text" name="mobile" value="${esc(u.mobile || '')}" placeholder="+91 98470 00000" />
          </div>
          <div class="form-group">
            <label>Employee ID *</label>
            <input type="text" name="employee_id" value="${esc(defaultEmpId)}" required placeholder="e.g. EMP-007" />
          </div>
        </div>
        <div class="form-grid-2">
          <div class="form-group">
            <label>Department</label>
            <select name="department_id">
              <option value="">-- Unassigned --</option>
              ${umState.departments.map(d => `<option value="${d.id}" ${String(u.department_id) === String(d.id) ? 'selected' : ''}>${esc(d.name)}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label>Designation</label>
            <input type="text" name="designation" value="${esc(u.designation || '')}" placeholder="e.g. Regional Sales Lead" />
          </div>
        </div>
        <div class="form-grid-2">
          <div class="form-group">
            <label>User Role *</label>
            <select name="role_id" required>
              ${assignableRoles.map(r => `<option value="${r.id}" ${String(u.role_id) === String(r.id) ? 'selected' : ''}>${esc(r.name)}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label>Assigned Team</label>
            <select name="team_id">
              <option value="">-- No Team --</option>
              ${umState.teams.map(t => `<option value="${t.id}" ${String(u.team_id) === String(t.id) ? 'selected' : ''}>${esc(t.name)}</option>`).join('')}
            </select>
          </div>
        </div>
        <div class="form-grid-2">
          <div class="form-group">
            <label>Reporting Manager</label>
            <select name="reporting_manager_id">
              <option value="">-- None --</option>
              ${umState.allUsersBrief.filter(m => !isEdit || m.id !== u.id).map(m => `<option value="${m.id}" ${String(u.reporting_manager_id) === String(m.id) ? 'selected' : ''}>${esc(m.full_name)} (${esc(m.employee_id)})</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label>Account Status</label>
            <select name="status">
              <option value="Active" ${u.status === 'Active' ? 'selected' : ''}>Active</option>
              <option value="Pending" ${(!isEdit || u.status === 'Pending') ? 'selected' : ''}>Pending (Invitation)</option>
              <option value="Inactive" ${u.status === 'Inactive' ? 'selected' : ''}>Inactive</option>
            </select>
          </div>
        </div>
        <div class="form-grid-2">
          <div class="form-group">
            <label>Profile Picture (PNG/JPG/WEBP, max 2MB)</label>
            <input type="file" id="umAvatarFileInput" accept="image/png,image/jpeg,image/webp,image/gif" />
          </div>
          ${!isEdit ? `
            <div class="form-group">
              <label>Initial Password (leave blank to generate secure invite link)</label>
              <input type="password" name="password" minlength="8" placeholder="Optional (min 8 chars)" />
            </div>
          ` : `
            <div class="form-group">
              <label>Set / Override Password (optional)</label>
              <input type="password" name="password" minlength="8" placeholder="Leave blank to keep current password" />
            </div>
          `}
        </div>
        ${isEdit ? `
          <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:8px;">
            <button type="button" class="action-pill-btn" id="umGenResetLinkBtn">🔑 Generate Password Reset Link</button>
            ${u.status === 'Pending' ? `<button type="button" class="action-pill-btn pill-amber" id="umResendInviteModalBtn">🔗 Generate Activation Invite Link</button>` : ''}
          </div>
        ` : ''}
        <div class="modal-actions">
          <button type="button" class="btn btn-outline" id="cancelModalBtn">Cancel</button>
          <button type="submit" class="btn btn-primary">${isEdit ? 'Save User Changes' : 'Create User'}</button>
        </div>
      </form>
    `, true);

    document.getElementById('umAvatarFileInput')?.addEventListener('change', (e) => {
      const f = e.target.files?.[0];
      if (!f) return;
      const reader = new FileReader();
      reader.onload = (ev) => { avatarDataUrl = String(ev.target.result || ''); };
      reader.readAsDataURL(f);
    });

    document.getElementById('umGenResetLinkBtn')?.addEventListener('click', async () => {
      try {
        const res = await api(`/api/um/users/${u.id}/reset-password`, { method: 'POST', body: '{}' });
        umState.lastInviteLink = res.reset_link;
        umState.lastInviteNote = `${res.message} ${res.email_note || ''}`;
        closeModal();
        umState.toastFn(res.message);
        await rerenderActiveContainer();
      } catch (err) {
        document.getElementById('umUserFormAlert').innerHTML = `<div class="um-alert um-alert-error">${esc(err.message)}</div>`;
      }
    });

    document.getElementById('umResendInviteModalBtn')?.addEventListener('click', async () => {
      try {
        const res = await api(`/api/um/users/${u.id}/resend-invite`, { method: 'POST', body: '{}' });
        umState.lastInviteLink = res.activation_link;
        umState.lastInviteNote = `${res.message} ${res.email_note || ''}`;
        closeModal();
        umState.toastFn(res.message);
        await rerenderActiveContainer();
      } catch (err) {
        document.getElementById('umUserFormAlert').innerHTML = `<div class="um-alert um-alert-error">${esc(err.message)}</div>`;
      }
    });

    document.getElementById('umUserForm')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const payload = Object.fromEntries(fd.entries());
      if (!payload.password) delete payload.password;
      if (avatarDataUrl) payload.avatar_data = avatarDataUrl;
      const alertBox = document.getElementById('umUserFormAlert');
      try {
        const res = isEdit
          ? await api(`/api/um/users/${u.id}`, { method: 'PUT', body: JSON.stringify(payload) })
          : await api('/api/um/users', { method: 'POST', body: JSON.stringify(payload) });
        if (res.activation_link) {
          umState.lastInviteLink = res.activation_link;
          umState.lastInviteNote = res.email_note || 'Share this activation link securely.';
        }
        closeModal();
        umState.toastFn(res.message);
        await rerenderActiveContainer();
      } catch (err) {
        alertBox.innerHTML = `<div class="um-alert um-alert-error">${esc(err.message)}</div>`;
      }
    });
  }

  // ---------------- TAB 2: ROLES & PERMISSIONS ----------------
  function renderRolesTab(bodyEl) {
    bodyEl.innerHTML = `
      <div class="panel-card">
        <div class="panel-header">
          <div class="panel-title"><h2>Roles &amp; Permission Matrix (${umState.roles.length})</h2></div>
          ${can('user_management', 'create') ? `<button class="btn btn-primary" id="umOpenCreateRoleBtn">+ Create Custom Role</button>` : ''}
        </div>
        <div class="table-no-scroll table-compact">
          <table class="data-table">
            <thead>
              <tr>
                <th>Role Name</th>
                <th>Type</th>
                <th>Assigned Users</th>
                <th>Access Scope</th>
                <th>Status</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${umState.roles.map(r => {
                const counts = countRolePermissions(r.permissions);
                return `
                <tr>
                  <td class="td-primary"><strong>${esc(r.name)}</strong></td>
                  <td><span class="status-badge ${r.is_system ? 'badge-contacted' : 'badge-meeting'}">${r.is_system ? 'System' : 'Custom'}</span></td>
                  <td><strong>${r.user_count}</strong> users</td>
                  <td><span class="status-badge badge-onboarded">${counts.modulesWithView}/${umState.modules.length} modules • ${counts.totalEnabled} perms</span></td>
                  <td>${statusBadge(r.is_active ? 'Active' : 'Inactive')}</td>
                  <td><span class="entity-sub">${esc(r.description || '—')}</span></td>
                  <td class="td-action">
                    <div class="followup-actions" style="gap:6px;flex-wrap:wrap;">
                      <button type="button" class="action-pill-btn pill-blue" data-role-users="${r.id}" data-role-name="${esc(r.name)}">View Users</button>
                      ${can('user_management', 'edit') && r.slug !== 'super_admin' ? `
                        <button type="button" class="action-pill-btn" data-role-edit="${r.id}">Permissions</button>
                      ` : ''}
                      ${can('user_management', 'delete') && !r.is_system ? `
                        <button type="button" class="action-pill-btn" style="color:#b91c1c;border-color:#fecaca;" data-role-delete="${r.id}" data-role-name="${esc(r.name)}">Delete</button>
                      ` : ''}
                    </div>
                  </td>
                </tr>
              `; }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

    document.getElementById('umOpenCreateRoleBtn')?.addEventListener('click', () => openRoleModal(null));
    bodyEl.querySelectorAll('[data-role-edit]').forEach(btn => {
      btn.addEventListener('click', () => {
        const rid = Number(btn.getAttribute('data-role-edit'));
        const roleObj = umState.roles.find(r => r.id === rid);
        if (roleObj) openRoleModal(roleObj);
      });
    });

    bodyEl.querySelectorAll('[data-role-delete]').forEach(btn => {
      btn.addEventListener('click', () => {
        const rid = Number(btn.getAttribute('data-role-delete'));
        const rName = btn.getAttribute('data-role-name');
        openModal(`
          <div class="modal-header">
            <h3>Delete Custom Role</h3>
            <button type="button" class="modal-close" id="closeModalBtn">✕</button>
          </div>
          <p style="font-size:13.5px;color:#334155;">Are you sure you want to delete custom role <strong>${esc(rName)}</strong>? Roles with assigned users cannot be deleted until users are reassigned.</p>
          <div id="umDelRoleErr" style="margin-top:10px;"></div>
          <div class="modal-actions">
            <button type="button" class="btn btn-outline" id="cancelModalBtn">Cancel</button>
            <button type="button" class="btn btn-primary" style="background:#dc2626;" id="umConfirmRoleDelBtn">Delete Role</button>
          </div>
        `, false);
        document.getElementById('umConfirmRoleDelBtn')?.addEventListener('click', async () => {
          try {
            const out = await api(`/api/um/roles/${rid}`, { method: 'DELETE' });
            closeModal();
            umState.toastFn(out.message);
            await rerenderActiveContainer();
          } catch (err) {
            document.getElementById('umDelRoleErr').innerHTML = `<div class="um-alert um-alert-error">${esc(err.message)}</div>`;
          }
        });
      });
    });

    bodyEl.querySelectorAll('[data-role-users]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const rid = Number(btn.getAttribute('data-role-users'));
        const rName = btn.getAttribute('data-role-name');
        try {
          const data = await api(`/api/um/roles/${rid}/users`);
          openModal(`
            <div class="modal-header">
              <h3>Users Assigned to "${esc(rName)}" (${data.users.length})</h3>
              <button type="button" class="modal-close" id="closeModalBtn">✕</button>
            </div>
            ${data.users.length === 0
              ? `<div class="um-empty-state"><p>No users are currently assigned to this role.</p></div>`
              : `<div class="ledger-list" style="max-height:320px;">
                  ${data.users.map(u => `
                    <div class="ledger-item">
                      <div>
                        <strong>${esc(u.full_name)}</strong> (${esc(u.employee_id)})
                        <div class="entity-sub">${esc(u.email)} • ${esc(u.department_name || 'No Dept')}</div>
                      </div>
                      ${statusBadge(u.status)}
                    </div>
                  `).join('')}
                </div>`
            }
            <div class="modal-actions">
              <button type="button" class="btn btn-primary" id="cancelModalBtn">Close</button>
            </div>
          `, false);
        } catch (err) {
          umState.toastFn(err.message);
        }
      });
    });
  }

  function openRoleModal(roleObj) {
    const isEdit = Boolean(roleObj);
    const r = roleObj || { name: '', description: '', is_system: false, is_active: true, permissions: {} };

    openModal(`
      <div class="modal-header">
        <h3>${isEdit ? `Edit Role &amp; Permissions — ${esc(r.name)}` : 'Create Custom Role'}</h3>
        <button type="button" class="modal-close" id="closeModalBtn">✕</button>
      </div>
      <div id="umRoleAlert"></div>
      <form id="umRoleForm">
        <div class="form-grid-2">
          <div class="form-group">
            <label>Role Name *</label>
            <input type="text" name="name" value="${esc(r.name)}" ${r.is_system ? 'readonly style="background:#f8fafc;"' : 'required'} placeholder="e.g. Regional Coordinator" />
          </div>
          <div class="form-group">
            <label>Role Status</label>
            <select name="is_active" ${r.is_system ? 'disabled' : ''}>
              <option value="true" ${r.is_active ? 'selected' : ''}>Active</option>
              <option value="false" ${!r.is_active ? 'selected' : ''}>Inactive</option>
            </select>
          </div>
        </div>
        <div class="form-group">
          <label>Description</label>
          <input type="text" name="description" value="${esc(r.description || '')}" placeholder="Describe what this role can access" />
        </div>

        <div style="margin-top:8px;">
          <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;">
            <label style="font-size:12.5px;font-weight:700;color:#334155;">Module Permissions Matrix (${umState.modules.length} CRM Modules × 6 Actions)</label>
            <div style="display:flex;gap:6px;">
              <button type="button" class="action-pill-btn pill-blue" id="umPermSelectViewBtn">View Only All</button>
              <button type="button" class="action-pill-btn pill-green" id="umPermSelectAllBtn">Select All</button>
              <button type="button" class="action-pill-btn" id="umPermClearAllBtn">Clear All</button>
            </div>
          </div>
          <div style="max-height:330px;overflow-y:auto;border:1px solid #e2e8f0;border-radius:10px;margin-top:6px;">
          <table class="um-perm-table" style="margin-top:0;">
            <thead style="position:sticky;top:0;background:#f8fafc;z-index:2;">
              <tr>
                <th>CRM Module</th>
                ${umState.actions.map(a => `<th>${esc(a)}</th>`).join('')}
                <th>All</th>
              </tr>
            </thead>
            <tbody>
              ${umState.modules.map(m => {
                const allChecked = umState.actions.every(a => r.permissions?.[m.key]?.[a]);
                return `
                <tr>
                  <td>${esc(m.label)}</td>
                  ${umState.actions.map(a => `
                    <td>
                      <input type="checkbox" data-perm-mod="${m.key}" data-perm-act="${a}" ${r.permissions?.[m.key]?.[a] ? 'checked' : ''} />
                    </td>
                  `).join('')}
                  <td>
                    <input type="checkbox" data-perm-row="${m.key}" ${allChecked ? 'checked' : ''} title="Toggle all permissions for ${esc(m.label)}" />
                  </td>
                </tr>
              `; }).join('')}
            </tbody>
          </table>
          </div>
        </div>

        <div class="modal-actions">
          <button type="button" class="btn btn-outline" id="cancelModalBtn">Cancel</button>
          <button type="submit" class="btn btn-primary">${isEdit ? 'Save Role & Permissions' : 'Create Role'}</button>
        </div>
      </form>
    `, true);

    umState.modalContent.querySelectorAll('[data-perm-row]').forEach(rowChk => {
      rowChk.addEventListener('change', () => {
        const mod = rowChk.getAttribute('data-perm-row');
        umState.modalContent.querySelectorAll(`[data-perm-mod="${mod}"]`).forEach(c => { c.checked = rowChk.checked; });
      });
    });

    document.getElementById('umPermSelectAllBtn')?.addEventListener('click', () => {
      umState.modalContent.querySelectorAll('[data-perm-mod], [data-perm-row]').forEach(c => { c.checked = true; });
    });
    document.getElementById('umPermClearAllBtn')?.addEventListener('click', () => {
      umState.modalContent.querySelectorAll('[data-perm-mod], [data-perm-row]').forEach(c => { c.checked = false; });
    });
    document.getElementById('umPermSelectViewBtn')?.addEventListener('click', () => {
      umState.modalContent.querySelectorAll('[data-perm-mod]').forEach(c => {
        c.checked = c.getAttribute('data-perm-act') === 'view';
      });
      umState.modalContent.querySelectorAll('[data-perm-row]').forEach(c => { c.checked = false; });
    });

    document.getElementById('umRoleForm')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const permissions = {};
      umState.modules.forEach(m => {
        permissions[m.key] = {};
        umState.actions.forEach(a => {
          const chk = umState.modalContent.querySelector(`[data-perm-mod="${m.key}"][data-perm-act="${a}"]`);
          permissions[m.key][a] = Boolean(chk?.checked);
        });
      });
      const payload = {
        name: fd.get('name'),
        description: fd.get('description'),
        is_active: r.is_system ? true : fd.get('is_active') === 'true',
        permissions,
      };
      try {
        const res = isEdit
          ? await api(`/api/um/roles/${r.id}`, { method: 'PUT', body: JSON.stringify(payload) })
          : await api('/api/um/roles', { method: 'POST', body: JSON.stringify(payload) });
        closeModal();
        umState.toastFn(res.message);
        await rerenderActiveContainer();
      } catch (err) {
        document.getElementById('umRoleAlert').innerHTML = `<div class="um-alert um-alert-error">${esc(err.message)}</div>`;
      }
    });
  }

  // ---------------- TAB 3: DEPARTMENTS & TEAMS ----------------
  function renderOrgTab(bodyEl) {
    bodyEl.innerHTML = `
      <div class="um-split-2">
        <div class="panel-card">
          <div class="panel-header">
            <div class="panel-title"><h2>Departments (${umState.departments.length})</h2></div>
            ${can('user_management', 'create') ? `<button class="btn btn-primary" id="umAddDeptBtn">+ Add Department</button>` : ''}
          </div>
          ${umState.departments.length === 0 ? `
            <div class="um-empty-state"><p>No departments created yet.</p></div>
          ` : `
            <div class="table-no-scroll table-compact">
              <table class="data-table">
                <thead>
                  <tr><th>Department</th><th>Head</th><th>Employees</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  ${umState.departments.map(d => `
                    <tr>
                      <td class="td-primary"><strong>${esc(d.name)}</strong><div class="entity-sub">Code: ${esc(d.code)}</div></td>
                      <td>${esc(d.head_name || '—')}</td>
                      <td><strong>${d.employee_count}</strong></td>
                      <td class="td-action">
                        <div class="followup-actions" style="gap:5px;flex-wrap:wrap;">
                          <button type="button" class="action-pill-btn pill-blue" data-dept-users="${d.id}" data-dept-name="${esc(d.name)}">View</button>
                          ${can('user_management', 'edit') ? `<button type="button" class="action-pill-btn" data-dept-edit="${d.id}">Edit</button>` : ''}
                          ${can('user_management', 'delete') ? `<button type="button" class="action-pill-btn" style="color:#b91c1c;border-color:#fecaca;" data-dept-delete="${d.id}" data-dept-name="${esc(d.name)}">Delete</button>` : ''}
                        </div>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          `}
        </div>

        <div class="panel-card">
          <div class="panel-header">
            <div class="panel-title"><h2>Teams (${umState.teams.length})</h2></div>
            ${can('user_management', 'create') ? `<button class="btn btn-primary" id="umAddTeamBtn">+ Create Team</button>` : ''}
          </div>
          ${umState.teams.length === 0 ? `
            <div class="um-empty-state"><p>No teams created yet.</p></div>
          ` : `
            <div class="table-no-scroll table-compact">
              <table class="data-table">
                <thead>
                  <tr><th>Team</th><th>Manager</th><th>Members</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  ${umState.teams.map(t => `
                    <tr>
                      <td class="td-primary"><strong>${esc(t.name)}</strong><div class="entity-sub">${esc(t.department_name || 'General')}</div></td>
                      <td>${esc(t.manager_name || '—')}</td>
                      <td><strong>${t.member_count}</strong></td>
                      <td class="td-action">
                        <div class="followup-actions" style="gap:5px;flex-wrap:wrap;">
                          <button type="button" class="action-pill-btn pill-blue" data-team-users="${t.id}" data-team-name="${esc(t.name)}">Members</button>
                          ${can('user_management', 'edit') ? `<button type="button" class="action-pill-btn" data-team-edit="${t.id}">Edit</button>` : ''}
                          ${can('user_management', 'delete') ? `<button type="button" class="action-pill-btn" style="color:#b91c1c;border-color:#fecaca;" data-team-delete="${t.id}" data-team-name="${esc(t.name)}">Delete</button>` : ''}
                        </div>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          `}
        </div>
      </div>

      ${can('user_management', 'assign') ? `
        <div class="panel-card" style="margin-top:16px;">
          <div class="panel-header">
            <div class="panel-title"><h2>Assign or Transfer Employee Between Teams</h2></div>
          </div>
          <form id="umTransferForm" style="display:grid;grid-template-columns:1fr 1fr auto;gap:12px;align-items:end;">
            <div class="form-group" style="margin-bottom:0;">
              <label>Select Employee *</label>
              <select name="user_id" required>
                <option value="">-- Choose Employee --</option>
                ${umState.allUsersBrief.map(u => `<option value="${u.id}">${esc(u.full_name)} (${esc(u.employee_id)}) — ${esc(u.team_name || 'No Team')}</option>`).join('')}
              </select>
            </div>
            <div class="form-group" style="margin-bottom:0;">
              <label>Target Team</label>
              <select name="team_id">
                <option value="">-- Unassign from Team --</option>
                ${umState.teams.map(t => `<option value="${t.id}">${esc(t.name)}${t.department_name ? ' (' + esc(t.department_name) + ')' : ''}</option>`).join('')}
              </select>
            </div>
            <button type="submit" class="btn btn-whatsapp" style="height:38px;">Assign / Transfer</button>
          </form>
        </div>
      ` : ''}
    `;

    document.getElementById('umAddDeptBtn')?.addEventListener('click', () => openDeptModal(null));
    document.getElementById('umAddTeamBtn')?.addEventListener('click', () => openTeamModal(null));

    bodyEl.querySelectorAll('[data-dept-edit]').forEach(btn => {
      btn.addEventListener('click', () => {
        const d = umState.departments.find(x => x.id === Number(btn.getAttribute('data-dept-edit')));
        if (d) openDeptModal(d);
      });
    });

    bodyEl.querySelectorAll('[data-dept-users]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const did = Number(btn.getAttribute('data-dept-users'));
        const dName = btn.getAttribute('data-dept-name');
        try {
          const data = await api(`/api/um/departments/${did}/users`);
          openModal(`
            <div class="modal-header">
              <h3>Employees in "${esc(dName)}" (${data.users.length})</h3>
              <button type="button" class="modal-close" id="closeModalBtn">✕</button>
            </div>
            ${data.users.length === 0
              ? `<div class="um-empty-state"><p>No employees in this department yet.</p></div>`
              : `<div class="ledger-list" style="max-height:320px;">
                  ${data.users.map(u => `
                    <div class="ledger-item">
                      <div><strong>${esc(u.full_name)}</strong> (${esc(u.employee_id)})<div class="entity-sub">${esc(u.role_name)} • ${esc(u.team_name || 'No Team')}</div></div>
                      ${statusBadge(u.status)}
                    </div>
                  `).join('')}
                </div>`
            }
            <div class="modal-actions"><button type="button" class="btn btn-primary" id="cancelModalBtn">Close</button></div>
          `, false);
        } catch (err) {
          umState.toastFn(err.message);
        }
      });
    });

    bodyEl.querySelectorAll('[data-team-users]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const tid = Number(btn.getAttribute('data-team-users'));
        const tName = btn.getAttribute('data-team-name');
        try {
          const data = await api(`/api/um/teams/${tid}/users`);
          openModal(`
            <div class="modal-header">
              <h3>Members of Team "${esc(tName)}" (${data.users.length})</h3>
              <button type="button" class="modal-close" id="closeModalBtn">✕</button>
            </div>
            ${data.users.length === 0
              ? `<div class="um-empty-state"><p>No employees are assigned to this team yet.</p></div>`
              : `<div class="ledger-list" style="max-height:320px;">
                  ${data.users.map(u => `
                    <div class="ledger-item">
                      <div><strong>${esc(u.full_name)}</strong> (${esc(u.employee_id)})<div class="entity-sub">${esc(u.role_name)} • ${esc(u.department_name || 'No Dept')}</div></div>
                      ${statusBadge(u.status)}
                    </div>
                  `).join('')}
                </div>`
            }
            <div class="modal-actions"><button type="button" class="btn btn-primary" id="cancelModalBtn">Close</button></div>
          `, false);
        } catch (err) {
          umState.toastFn(err.message);
        }
      });
    });

    bodyEl.querySelectorAll('[data-team-edit]').forEach(btn => {
      btn.addEventListener('click', () => {
        const t = umState.teams.find(x => x.id === Number(btn.getAttribute('data-team-edit')));
        if (t) openTeamModal(t);
      });
    });

    bodyEl.querySelectorAll('[data-dept-delete]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const did = Number(btn.getAttribute('data-dept-delete'));
        const name = btn.getAttribute('data-dept-name');
        openModal(`
          <div class="modal-header">
            <h3>Delete Department</h3>
            <button type="button" class="modal-close" id="closeModalBtn">✕</button>
          </div>
          <p style="font-size:13.5px;color:#334155;">Delete department <strong>${esc(name)}</strong>? Assigned employees and teams will become unassigned cleanly.</p>
          <div id="umDelDeptErr" style="margin-top:10px;"></div>
          <div class="modal-actions">
            <button type="button" class="btn btn-outline" id="cancelModalBtn">Cancel</button>
            <button type="button" class="btn btn-primary" style="background:#dc2626;" id="umConfirmDeptDelBtn">Delete Department</button>
          </div>
        `, false);
        document.getElementById('umConfirmDeptDelBtn')?.addEventListener('click', async () => {
          try {
            const out = await api(`/api/um/departments/${did}`, { method: 'DELETE' });
            closeModal();
            umState.toastFn(out.message);
            await rerenderActiveContainer();
          } catch (err) {
            document.getElementById('umDelDeptErr').innerHTML = `<div class="um-alert um-alert-error">${esc(err.message)}</div>`;
          }
        });
      });
    });

    bodyEl.querySelectorAll('[data-team-delete]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const tid = Number(btn.getAttribute('data-team-delete'));
        const name = btn.getAttribute('data-team-name');
        openModal(`
          <div class="modal-header">
            <h3>Delete Team</h3>
            <button type="button" class="modal-close" id="closeModalBtn">✕</button>
          </div>
          <p style="font-size:13.5px;color:#334155;">Delete team <strong>${esc(name)}</strong>? Team members will be unassigned from this team.</p>
          <div id="umDelTeamErr" style="margin-top:10px;"></div>
          <div class="modal-actions">
            <button type="button" class="btn btn-outline" id="cancelModalBtn">Cancel</button>
            <button type="button" class="btn btn-primary" style="background:#dc2626;" id="umConfirmTeamDelBtn">Delete Team</button>
          </div>
        `, false);
        document.getElementById('umConfirmTeamDelBtn')?.addEventListener('click', async () => {
          try {
            const out = await api(`/api/um/teams/${tid}`, { method: 'DELETE' });
            closeModal();
            umState.toastFn(out.message);
            await rerenderActiveContainer();
          } catch (err) {
            document.getElementById('umDelTeamErr').innerHTML = `<div class="um-alert um-alert-error">${esc(err.message)}</div>`;
          }
        });
      });
    });

    document.getElementById('umTransferForm')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      try {
        const res = await api('/api/um/teams/transfer', {
          method: 'POST',
          body: JSON.stringify({ user_id: fd.get('user_id'), team_id: fd.get('team_id') || null }),
        });
        umState.toastFn(res.message);
        await rerenderActiveContainer();
      } catch (err) {
        umState.toastFn(err.message);
      }
    });
  }

  function openDeptModal(dept) {
    const isEdit = Boolean(dept);
    const d = dept || {};
    openModal(`
      <div class="modal-header">
        <h3>${isEdit ? 'Edit Department' : 'Add Department'}</h3>
        <button type="button" class="modal-close" id="closeModalBtn">✕</button>
      </div>
      <div id="umDeptAlert"></div>
      <form id="umDeptForm">
        <div class="form-grid-2">
          <div class="form-group"><label>Department Name *</label><input type="text" name="name" value="${esc(d.name || '')}" required placeholder="e.g. Partner Onboarding" /></div>
          <div class="form-group"><label>Department Code *</label><input type="text" name="code" value="${esc(d.code || '')}" required placeholder="e.g. ONB" /></div>
        </div>
        <div class="form-group">
          <label>Department Head</label>
          <select name="head_user_id">
            <option value="">-- Unassigned --</option>
            ${umState.allUsersBrief.map(u => `<option value="${u.id}" ${String(d.head_user_id) === String(u.id) ? 'selected' : ''}>${esc(u.full_name)}</option>`).join('')}
          </select>
        </div>
        <div class="form-group"><label>Description</label><input type="text" name="description" value="${esc(d.description || '')}" /></div>
        <div class="modal-actions">
          <button type="button" class="btn btn-outline" id="cancelModalBtn">Cancel</button>
          <button type="submit" class="btn btn-primary">${isEdit ? 'Save Department' : 'Create Department'}</button>
        </div>
      </form>
    `, false);
    document.getElementById('umDeptForm')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const payload = Object.fromEntries(new FormData(e.target).entries());
      try {
        const res = isEdit
          ? await api(`/api/um/departments/${d.id}`, { method: 'PUT', body: JSON.stringify(payload) })
          : await api('/api/um/departments', { method: 'POST', body: JSON.stringify(payload) });
        closeModal();
        umState.toastFn(res.message);
        await rerenderActiveContainer();
      } catch (err) {
        document.getElementById('umDeptAlert').innerHTML = `<div class="um-alert um-alert-error">${esc(err.message)}</div>`;
      }
    });
  }

  function openTeamModal(team) {
    const isEdit = Boolean(team);
    const t = team || {};
    openModal(`
      <div class="modal-header">
        <h3>${isEdit ? 'Edit Team' : 'Create Team'}</h3>
        <button type="button" class="modal-close" id="closeModalBtn">✕</button>
      </div>
      <div id="umTeamAlert"></div>
      <form id="umTeamForm">
        <div class="form-group"><label>Team Name *</label><input type="text" name="name" value="${esc(t.name || '')}" required placeholder="e.g. South Kerala Sales" /></div>
        <div class="form-grid-2">
          <div class="form-group">
            <label>Department</label>
            <select name="department_id">
              <option value="">-- General --</option>
              ${umState.departments.map(d => `<option value="${d.id}" ${String(t.department_id) === String(d.id) ? 'selected' : ''}>${esc(d.name)}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label>Team Manager</label>
            <select name="manager_user_id">
              <option value="">-- Unassigned --</option>
              ${umState.allUsersBrief.map(u => `<option value="${u.id}" ${String(t.manager_user_id) === String(u.id) ? 'selected' : ''}>${esc(u.full_name)}</option>`).join('')}
            </select>
          </div>
        </div>
        <div class="form-group"><label>Description</label><input type="text" name="description" value="${esc(t.description || '')}" /></div>
        <div class="modal-actions">
          <button type="button" class="btn btn-outline" id="cancelModalBtn">Cancel</button>
          <button type="submit" class="btn btn-primary">${isEdit ? 'Save Team' : 'Create Team'}</button>
        </div>
      </form>
    `, false);
    document.getElementById('umTeamForm')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const payload = Object.fromEntries(new FormData(e.target).entries());
      try {
        const res = isEdit
          ? await api(`/api/um/teams/${t.id}`, { method: 'PUT', body: JSON.stringify(payload) })
          : await api('/api/um/teams', { method: 'POST', body: JSON.stringify(payload) });
        closeModal();
        umState.toastFn(res.message);
        await rerenderActiveContainer();
      } catch (err) {
        document.getElementById('umTeamAlert').innerHTML = `<div class="um-alert um-alert-error">${esc(err.message)}</div>`;
      }
    });
  }

  // ---------------- TAB 4: ACTIVITY LOGS ----------------
  function renderLogsTab(bodyEl) {
    const res = umState.logsResult;
    bodyEl.innerHTML = `
      <div class="panel-card">
        <div class="panel-header">
          <div class="panel-title"><h2>User Activity &amp; Security Audit Logs (${res.total})</h2></div>
          <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;">
            <span class="status-badge badge-completed">Immutable Read-Only Log</span>
            <input type="text" id="umLogsSearch" value="${esc(umState.logsQuery.q)}" placeholder="Search actor, action, details..." style="padding:7px 11px;border:1px solid #cbd5e1;border-radius:8px;font-size:13px;" />
          </div>
        </div>
        ${res.items.length === 0 ? `
          <div class="um-empty-state"><p>No activity logs recorded yet.</p></div>
        ` : `
          <div class="table-no-scroll table-compact">
            <table class="data-table">
              <thead>
                <tr><th>Date &amp; Time</th><th>Actor</th><th>Action</th><th>Record</th><th>Details</th><th>IP</th></tr>
              </thead>
              <tbody>
                ${res.items.map(l => `
                  <tr>
                    <td style="white-space:nowrap;font-size:12px;">${esc(fmtDate(l.created_at))}</td>
                    <td><strong>${esc(l.actor_name)}</strong></td>
                    <td><span class="template-code">${esc(l.action)}</span></td>
                    <td>${l.record_id ? `#${esc(l.record_id)}` : '—'}</td>
                    <td>${esc(l.details)}</td>
                    <td style="white-space:nowrap;font-size:12px;">${esc(l.ip_address || '—')}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          <div class="pagination-bar">
            <div class="pagination-info"><span>Page <strong>${res.page}</strong> of <strong>${res.total_pages}</strong></span></div>
            <div class="pagination-controls">
              <button class="page-btn" id="umLogsPrev" ${res.page <= 1 ? 'disabled' : ''}>‹ Prev</button>
              <button class="page-btn" id="umLogsNext" ${res.page >= res.total_pages ? 'disabled' : ''}>Next ›</button>
            </div>
          </div>
        `}
      </div>
    `;
    let timer;
    document.getElementById('umLogsSearch')?.addEventListener('input', (e) => {
      clearTimeout(timer);
      umState.logsQuery.q = e.target.value;
      umState.logsQuery.page = 1;
      timer = setTimeout(async () => {
        await loadLogsTable();
        renderLogsTab(bodyEl);
        const el = document.getElementById('umLogsSearch');
        if (el) { el.focus(); el.setSelectionRange(el.value.length, el.value.length); }
      }, 220);
    });
    document.getElementById('umLogsPrev')?.addEventListener('click', async () => {
      umState.logsQuery.page = Math.max(1, umState.logsQuery.page - 1);
      await loadLogsTable();
      renderLogsTab(bodyEl);
    });
    document.getElementById('umLogsNext')?.addEventListener('click', async () => {
      umState.logsQuery.page = Math.min(res.total_pages, umState.logsQuery.page + 1);
      await loadLogsTable();
      renderLogsTab(bodyEl);
    });
  }

  // ---------------- TAB 5: USER PROFILE & ACCOUNT DETAILS ----------------
  async function renderProfileTabOnly(container) {
    container.innerHTML = `<div id="umProfileSolo"></div>`;
    await renderProfileTab(document.getElementById('umProfileSolo'), umState.user.id);
  }

  async function renderProfileTab(bodyEl, userId) {
    bodyEl.innerHTML = `<div class="panel-card"><div class="um-empty-state">Loading user profile...</div></div>`;
    try {
      const data = await api(`/api/um/users/${userId}`);
      const u = data.user;
      const activity = data.activity || [];
      const canEditProfile = can('user_management', 'edit') || u.id === umState.user?.id;

      bodyEl.innerHTML = `
        <div class="um-profile-grid">
          <div class="panel-card">
            <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;">
              <div style="display:flex;align-items:center;gap:14px;">
                ${renderAvatar(u, true)}
                <div>
                  <h2 style="font-size:19px;font-weight:800;color:#0f2547;">${esc(u.full_name)}</h2>
                  <div class="entity-sub">${esc(u.designation || u.role_name)} • ${statusBadge(u.status)}</div>
                </div>
              </div>
              ${canEditProfile ? `<button class="btn btn-primary" id="umEditThisProfileBtn">Edit Profile</button>` : ''}
            </div>

            <div class="um-detail-kv">
              <div class="um-kv-item"><div class="um-kv-label">Employee ID</div><div class="um-kv-val">${esc(u.employee_id)}</div></div>
              <div class="um-kv-item"><div class="um-kv-label">Assigned Role</div><div class="um-kv-val">${esc(u.role_name)}</div></div>
              <div class="um-kv-item"><div class="um-kv-label">Email Address</div><div class="um-kv-val">${esc(u.email)}</div></div>
              <div class="um-kv-item"><div class="um-kv-label">Mobile Number</div><div class="um-kv-val">${esc(u.mobile || '—')}</div></div>
              <div class="um-kv-item"><div class="um-kv-label">Department</div><div class="um-kv-val">${esc(u.department_name || 'Unassigned')}</div></div>
              <div class="um-kv-item"><div class="um-kv-label">Assigned Team</div><div class="um-kv-val">${esc(u.team_name || 'No Team')}</div></div>
              <div class="um-kv-item"><div class="um-kv-label">Reporting Manager</div><div class="um-kv-val">${esc(u.reporting_manager_name || '—')}</div></div>
              <div class="um-kv-item"><div class="um-kv-label">Joining / Created</div><div class="um-kv-val">${esc(fmtDate(u.created_at))}</div></div>
              <div class="um-kv-item" style="grid-column:1/-1;"><div class="um-kv-label">Last Login</div><div class="um-kv-val">${u.last_login_at ? esc(fmtDate(u.last_login_at)) : 'Never signed in'}</div></div>
            </div>

            ${u.id === umState.user?.id ? `
              <div class="um-change-pw-box" style="margin-top:16px;padding-top:14px;border-top:1px solid #e2e8f0;">
                <h3 style="font-size:14px;font-weight:700;color:#0f2547;margin-bottom:8px;">Change My Password</h3>
                <div id="umChangePwAlert"></div>
                <form id="umChangePwForm" style="display:grid;grid-template-columns:1fr 1fr auto;gap:10px;align-items:end;">
                  <div class="form-group" style="margin-bottom:0;">
                    <label>Current Password *</label>
                    <input type="password" name="current_password" required placeholder="Current password" />
                  </div>
                  <div class="form-group" style="margin-bottom:0;">
                    <label>New Password (min 8) *</label>
                    <input type="password" name="new_password" minlength="8" required placeholder="New password" />
                  </div>
                  <button type="submit" class="btn btn-outline" style="height:38px;white-space:nowrap;">Update Password</button>
                </form>
              </div>
            ` : ''}
          </div>

          <div class="panel-card">
            <div class="panel-header">
              <div class="panel-title"><h2>Recent Account Activity (${activity.length})</h2></div>
            </div>
            ${activity.length === 0 ? `
              <div class="um-empty-state"><p>No activity recorded for this account yet.</p></div>
            ` : `
              <div class="timeline-list">
                ${activity.map(a => `
                  <div class="timeline-item">
                    <div style="font-size:13px;font-weight:700;color:#0f2547;">${esc(a.action)} <span class="entity-sub">• ${esc(fmtDate(a.created_at))}</span></div>
                    <div class="entity-sub">${esc(a.details)} (by ${esc(a.actor_name)})</div>
                  </div>
                `).join('')}
              </div>
            `}
          </div>
        </div>
      `;

      document.getElementById('umEditThisProfileBtn')?.addEventListener('click', () => openUserFormModal(u));
      document.getElementById('umChangePwForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const fd = new FormData(e.target);
        const alertEl = document.getElementById('umChangePwAlert');
        try {
          const out = await api('/api/auth/change-password', {
            method: 'POST',
            body: JSON.stringify({ current_password: fd.get('current_password'), new_password: fd.get('new_password') }),
          });
          alertEl.innerHTML = `<div class="um-alert um-alert-success">${esc(out.message)}</div>`;
          e.target.reset();
          umState.toastFn(out.message);
        } catch (err) {
          alertEl.innerHTML = `<div class="um-alert um-alert-error">${esc(err.message)}</div>`;
        }
      });
    } catch (err) {
      bodyEl.innerHTML = `<div class="panel-card"><div class="um-alert um-alert-error">${esc(err.message)}</div></div>`;
    }
  }

  // ---------------- TEAM & ROLES DIRECTORY (CONNECTED TO REAL DB) ----------------
  async function renderTeamRolesView(container) {
    umState.viewMode = 'team';
    umState.container = container;
    container.innerHTML = `<div class="panel-card"><div class="um-empty-state">Loading Team &amp; Roles from database...</div></div>`;

    try {
      await refreshAuthStatus();
    } catch (err) {
      container.innerHTML = `<div class="panel-card"><div class="um-alert um-alert-error">Unable to connect to backend API: ${esc(err.message)}</div></div>`;
      return;
    }

    if (!umState.authenticated) {
      renderAuthView();
      return;
    }

    if (!can('team_roles', 'view') && !can('user_management', 'view')) {
      container.innerHTML = `
        <div class="panel-card">
          <div class="panel-header">
            <div class="panel-title"><h2>Access Restricted (403)</h2></div>
            <button type="button" class="btn btn-outline" id="umTeamSignOutBtn">Sign Out (${esc(umState.user.full_name)})</button>
          </div>
          <div class="um-alert um-alert-error">
            Your assigned role (<strong>${esc(umState.user.role_name)}</strong>) does not have permission to view Team &amp; Roles.
          </div>
        </div>
      `;
      document.getElementById('umTeamSignOutBtn')?.addEventListener('click', handleSignOut);
      return;
    }

    try {
      await Promise.all([loadCoreReferenceData(), loadTeamUsersTable()]);
    } catch (err) {
      container.innerHTML = `<div class="panel-card"><div class="um-alert um-alert-error">${esc(err.message)}</div></div>`;
      return;
    }

    const d = umState.dashboard || {};
    const q = umState.teamQuery;
    const res = umState.teamUsersResult;
    const pages = buildWindowedPages(res.page, res.total_pages);
    const hasFilters = Boolean(q.q || q.role_id || q.department_id || q.team_id || q.status);

    container.innerHTML = `
      <section class="um-kpi-grid um-kpi-grid-5">
        <div class="um-kpi-card accent-blue">
          <div class="um-kpi-label">Total Members</div>
          <div class="um-kpi-val">${d.total_users ?? 0}</div>
          <div class="um-kpi-sub">Synced with User Directory</div>
        </div>
        <div class="um-kpi-card accent-green">
          <div class="um-kpi-label">Active Members</div>
          <div class="um-kpi-val">${d.active_users ?? 0}</div>
          <div class="um-kpi-sub">Enabled accounts</div>
        </div>
        <div class="um-kpi-card accent-purple">
          <div class="um-kpi-label">Configured Roles</div>
          <div class="um-kpi-val">${d.total_roles ?? umState.roles.length}</div>
          <div class="um-kpi-sub">${d.system_roles ?? 5} System • ${d.custom_roles ?? 0} Custom</div>
        </div>
        <div class="um-kpi-card accent-teal">
          <div class="um-kpi-label">Departments</div>
          <div class="um-kpi-val">${d.total_departments ?? umState.departments.length}</div>
          <div class="um-kpi-sub">Active org units</div>
        </div>
        <div class="um-kpi-card accent-amber">
          <div class="um-kpi-label">Teams</div>
          <div class="um-kpi-val">${d.total_teams ?? umState.teams.length}</div>
          <div class="um-kpi-sub">Working groups</div>
        </div>
      </section>

      <div class="panel-card">
        <div class="panel-header">
          <div class="panel-title"><h2>Team Members &amp; Role Assignments (${res.total})</h2></div>
          <div style="display:flex;gap:8px;flex-wrap:wrap;">
            ${hasFilters ? `<button type="button" class="btn btn-outline" id="tmResetFiltersBtn">Reset Filters</button>` : ''}
            ${can('user_management', 'create') ? `<button type="button" class="btn btn-primary" id="tmAddMemberBtn">+ Add Team Member</button>` : ''}
            ${can('user_management', 'view') ? `<button type="button" class="btn btn-outline" id="tmOpenFullUmBtn">Full Access Control →</button>` : ''}
          </div>
        </div>

        <div class="um-filters-row">
          <input type="text" id="tmSearchInput" value="${esc(q.q)}" placeholder="Search member, email, employee ID..." />
          <select id="tmFilterRole">
            <option value="">All Roles</option>
            ${umState.roles.map(r => `<option value="${r.id}" ${String(q.role_id) === String(r.id) ? 'selected' : ''}>${esc(r.name)}</option>`).join('')}
          </select>
          <select id="tmFilterDept">
            <option value="">All Departments</option>
            ${umState.departments.map(dep => `<option value="${dep.id}" ${String(q.department_id) === String(dep.id) ? 'selected' : ''}>${esc(dep.name)}</option>`).join('')}
          </select>
          <select id="tmFilterTeam">
            <option value="">All Teams</option>
            ${umState.teams.map(t => `<option value="${t.id}" ${String(q.team_id) === String(t.id) ? 'selected' : ''}>${esc(t.name)}</option>`).join('')}
          </select>
          <select id="tmFilterStatus">
            <option value="">All Statuses</option>
            ${['Active', 'Inactive', 'Pending'].map(s => `<option value="${s}" ${q.status === s ? 'selected' : ''}>${s}</option>`).join('')}
          </select>
          <select id="tmPageSizeSelect">
            ${[5, 10, 25, 50].map(sz => `<option value="${sz}" ${Number(q.page_size) === sz ? 'selected' : ''}>${sz} / page</option>`).join('')}
          </select>
        </div>

        ${res.items.length === 0 ? `
          <div class="um-empty-state">
            <h3>No matching team members</h3>
            <p>Adjust your search filters or add a new team member.</p>
          </div>
        ` : `
          <div class="table-no-scroll table-compact">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Member</th>
                  <th>Role &amp; Designation</th>
                  <th>Department &amp; Team</th>
                  <th>Reporting Manager</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                ${res.items.map(u => `
                  <tr>
                    <td class="td-primary">
                      <div class="followup-entity">
                        ${renderAvatar(u)}
                        <div class="entity-info">
                          <div class="entity-name">${esc(u.full_name)}</div>
                          <div class="entity-sub">${esc(u.email)} • ${esc(u.employee_id)}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <strong>${esc(u.role_name)}</strong>
                      <div class="entity-sub">${esc(u.designation || 'Team Member')}</div>
                    </td>
                    <td>
                      <div>${esc(u.department_name || 'Unassigned')}</div>
                      <div class="entity-sub">${esc(u.team_name || 'No Team')}</div>
                    </td>
                    <td>${esc(u.reporting_manager_name || '—')}</td>
                    <td>${statusBadge(u.status)}</td>
                    <td class="td-action">
                      <div class="followup-actions" style="gap:5px;flex-wrap:wrap;">
                        ${can('user_management', 'edit') ? `<button type="button" class="action-pill-btn pill-blue" data-tm-edit="${u.id}">Edit / Role</button>` : ''}
                        <button type="button" class="action-pill-btn" data-tm-profile="${u.id}">Profile</button>
                      </div>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          <div class="pagination-bar">
            <div class="pagination-info">
              <span>Showing <strong>${res.items.length}</strong> of <strong>${res.total}</strong> members (Page <strong>${res.page}</strong> of <strong>${res.total_pages}</strong>)</span>
            </div>
            <div class="pagination-controls">
              <button class="page-btn" id="tmPrevBtn" ${res.page <= 1 ? 'disabled' : ''}>‹ Prev</button>
              ${pages.map(p => p === '...'
                ? `<span class="page-ellipsis">…</span>`
                : `<button class="page-btn ${p === res.page ? 'active' : ''}" data-tm-page="${p}">${p}</button>`
              ).join('')}
              <button class="page-btn" id="tmNextBtn" ${res.page >= res.total_pages ? 'disabled' : ''}>Next ›</button>
            </div>
          </div>
        `}
      </div>

      <div class="um-split-2">
        <div class="panel-card">
          <div class="panel-header">
            <div class="panel-title"><h2>Roles &amp; Access Control (${umState.roles.length})</h2></div>
            ${can('user_management', 'create') ? `<button type="button" class="btn btn-outline" id="tmCreateRoleBtn">+ Create Role</button>` : ''}
          </div>
          <div class="table-no-scroll table-compact">
            <table class="data-table">
              <thead><tr><th>Role</th><th>Members</th><th>Permissions</th><th>Actions</th></tr></thead>
              <tbody>
                ${umState.roles.map(r => {
                  const counts = countRolePermissions(r.permissions);
                  return `
                  <tr>
                    <td class="td-primary"><strong>${esc(r.name)}</strong><div class="entity-sub">${r.is_system ? 'System Role' : 'Custom Role'}</div></td>
                    <td><strong>${r.user_count}</strong></td>
                    <td><span class="status-badge badge-onboarded">${counts.modulesWithView}/${umState.modules.length} modules</span></td>
                    <td>
                      ${can('user_management', 'edit') && r.slug !== 'super_admin'
                        ? `<button type="button" class="action-pill-btn" data-tm-role-edit="${r.id}">Configure</button>`
                        : `<span class="entity-sub">${r.slug === 'super_admin' ? 'Full Access' : 'Read Only'}</span>`}
                    </td>
                  </tr>
                `; }).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <div class="panel-card">
          <div class="panel-header">
            <div class="panel-title"><h2>Departments (${umState.departments.length}) &amp; Teams (${umState.teams.length})</h2></div>
            <div style="display:flex;gap:6px;flex-wrap:wrap;">
              ${can('user_management', 'create') ? `<button type="button" class="btn btn-outline" id="tmAddDeptBtn">+ Dept</button>` : ''}
              ${can('user_management', 'create') ? `<button type="button" class="btn btn-outline" id="tmAddTeamBtn">+ Team</button>` : ''}
            </div>
          </div>
          ${umState.departments.length === 0 && umState.teams.length === 0 ? `
            <div class="um-empty-state"><p>No departments or teams created yet. Click + Dept or + Team to organize your CRM staff.</p></div>
          ` : `
            <div class="ledger-list" style="max-height:320px;">
              ${umState.departments.map(dep => `
                <div class="ledger-item">
                  <div>
                    <strong>🏢 ${esc(dep.name)}</strong> <span class="template-code">${esc(dep.code)}</span>
                    <div class="entity-sub">Head: ${esc(dep.head_name || 'Unassigned')} • <strong>${dep.employee_count}</strong> employees</div>
                  </div>
                  ${can('user_management', 'edit') ? `<button type="button" class="action-pill-btn" data-tm-dept-edit="${dep.id}">Edit</button>` : ''}
                </div>
              `).join('')}
              ${umState.teams.map(t => `
                <div class="ledger-item">
                  <div>
                    <strong>👥 ${esc(t.name)}</strong>
                    <div class="entity-sub">${esc(t.department_name || 'General')} • Lead: ${esc(t.manager_name || 'Unassigned')} • <strong>${t.member_count}</strong> members</div>
                  </div>
                  ${can('user_management', 'edit') ? `<button type="button" class="action-pill-btn" data-tm-team-edit="${t.id}">Edit</button>` : ''}
                </div>
              `).join('')}
            </div>
          `}
        </div>
      </div>
    `;

    let tmTimer;
    document.getElementById('tmSearchInput')?.addEventListener('input', (e) => {
      clearTimeout(tmTimer);
      umState.teamQuery.q = e.target.value;
      umState.teamQuery.page = 1;
      tmTimer = setTimeout(async () => {
        await renderTeamRolesView(container);
        const inp = document.getElementById('tmSearchInput');
        if (inp) { inp.focus(); inp.setSelectionRange(inp.value.length, inp.value.length); }
      }, 240);
    });
    const bindTmSel = (id, key) => {
      document.getElementById(id)?.addEventListener('change', (e) => {
        umState.teamQuery[key] = key === 'page_size' ? Number(e.target.value) : e.target.value;
        umState.teamQuery.page = 1;
        renderTeamRolesView(container);
      });
    };
    bindTmSel('tmFilterRole', 'role_id');
    bindTmSel('tmFilterDept', 'department_id');
    bindTmSel('tmFilterTeam', 'team_id');
    bindTmSel('tmFilterStatus', 'status');
    bindTmSel('tmPageSizeSelect', 'page_size');

    document.getElementById('tmResetFiltersBtn')?.addEventListener('click', () => {
      umState.teamQuery = { ...umState.teamQuery, q: '', role_id: '', department_id: '', team_id: '', status: '', page: 1 };
      renderTeamRolesView(container);
    });
    document.getElementById('tmPrevBtn')?.addEventListener('click', () => {
      umState.teamQuery.page = Math.max(1, umState.teamQuery.page - 1);
      renderTeamRolesView(container);
    });
    document.getElementById('tmNextBtn')?.addEventListener('click', () => {
      umState.teamQuery.page = Math.min(res.total_pages, umState.teamQuery.page + 1);
      renderTeamRolesView(container);
    });
    container.querySelectorAll('[data-tm-page]').forEach(btn => {
      btn.addEventListener('click', () => {
        umState.teamQuery.page = Number(btn.getAttribute('data-tm-page'));
        renderTeamRolesView(container);
      });
    });

    document.getElementById('tmAddMemberBtn')?.addEventListener('click', () => openUserFormModal(null));
    document.getElementById('tmCreateRoleBtn')?.addEventListener('click', () => openRoleModal(null));
    document.getElementById('tmAddDeptBtn')?.addEventListener('click', () => openDeptModal(null));
    document.getElementById('tmAddTeamBtn')?.addEventListener('click', () => openTeamModal(null));
    document.getElementById('tmOpenFullUmBtn')?.addEventListener('click', () => {
      document.querySelector('.sidebar-nav [data-view="user-management"]')?.click();
    });

    container.querySelectorAll('[data-tm-edit]').forEach(btn => {
      btn.addEventListener('click', () => {
        const u = res.items.find(x => x.id === Number(btn.getAttribute('data-tm-edit')));
        if (u) openUserFormModal(u);
      });
    });
    container.querySelectorAll('[data-tm-profile]').forEach(btn => {
      btn.addEventListener('click', () => {
        umState.profileUserId = Number(btn.getAttribute('data-tm-profile'));
        umState.activeTab = 'profile';
        document.querySelector('.sidebar-nav [data-view="user-management"]')?.click();
      });
    });
    container.querySelectorAll('[data-tm-role-edit]').forEach(btn => {
      btn.addEventListener('click', () => {
        const r = umState.roles.find(x => x.id === Number(btn.getAttribute('data-tm-role-edit')));
        if (r) openRoleModal(r);
      });
    });
    container.querySelectorAll('[data-tm-dept-edit]').forEach(btn => {
      btn.addEventListener('click', () => {
        const dep = umState.departments.find(x => x.id === Number(btn.getAttribute('data-tm-dept-edit')));
        if (dep) openDeptModal(dep);
      });
    });
    container.querySelectorAll('[data-tm-team-edit]').forEach(btn => {
      btn.addEventListener('click', () => {
        const t = umState.teams.find(x => x.id === Number(btn.getAttribute('data-tm-team-edit')));
        if (t) openTeamModal(t);
      });
    });
  }

  const VIEW_TO_MODULE = {
    'dashboard': 'dashboard',
    'partners-all': 'partners',
    'doctors': 'doctors',
    'clinics': 'clinics',
    'hospitals': 'hospitals',
    'leads': 'leads',
    'leads-upload': 'leads_upload',
    'settlements': 'settlements',
    'leads-reports': 'leads_reports',
    'followups': 'followups',
    'campaigns': 'campaigns',
    'reports': 'campaign_reports',
    'automation': 'automation',
    'user-management': 'user_management',
    'team': 'team_roles',
    'settings': 'settings',
  };

  window.AyushUserManagement = {
    init({ toastFn, modalBackdrop, modalContent }) {
      if (toastFn) umState.toastFn = toastFn;
      umState.modalBackdrop = modalBackdrop;
      umState.modalContent = modalContent;
      refreshAuthStatus().catch(() => {});
    },
    renderView,
    renderTeamRolesView,
    parseHashAction,
    setActiveTab(tab) {
      umState.activeTab = tab || 'users';
    },
    getCurrentUser() {
      return umState.authenticated ? umState.user : null;
    },
    getAuthState() {
      return {
        authenticated: umState.authenticated,
        needsSetup: umState.needsSetup,
        user: umState.user,
        permissions: umState.permissions,
      };
    },
    async logout() {
      await handleSignOut();
    },
    checkViewAccess(viewKey, containerEl) {
      if (!umState.authenticated || !umState.user) return true;
      if (viewKey === 'user-management') return true;
      const mod = VIEW_TO_MODULE[viewKey];
      if (!mod) return true;
      if (can(mod, 'view')) return true;
      if (containerEl) {
        containerEl.innerHTML = `
          <div class="panel-card">
            <div class="panel-header">
              <div class="panel-title"><h2>Access Restricted (403)</h2></div>
              <button type="button" class="btn btn-outline" id="umDeniedSignOutBtn">Sign Out (${esc(umState.user.full_name)})</button>
            </div>
            <div class="um-alert um-alert-error">
              Your role (<strong>${esc(umState.user.role_name)}</strong>) does not have <strong>View</strong> permission for the <strong>${esc(mod)}</strong> module.
            </div>
          </div>
        `;
        document.getElementById('umDeniedSignOutBtn')?.addEventListener('click', handleSignOut);
      }
      return false;
    },
    logCrmEvent(action, module, recordId, details) {
      if (!umState.authenticated) return;
      api('/api/um/logs/crm-event', {
        method: 'POST',
        body: JSON.stringify({ action, module, record_id: String(recordId || ''), details: String(details || '') }),
      }).catch(() => {});
    },
  };
})();
