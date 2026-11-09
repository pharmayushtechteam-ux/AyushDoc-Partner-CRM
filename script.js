document.addEventListener('DOMContentLoaded', () => {
  // ---- INITIAL DEFAULT DATA ----
  const defaultPartners = [
    { id: 100, initials: 'S', color: 'avatar-blue', name: 'sheetha', type: 'Doctors', specialty: 'Siddha', city: 'Kacharcode', phone: '+91 98470 55112', status: 'New Lead', badge: 'badge-newlead', followup: 'Today, 5:00 PM' },
    { id: 1, initials: 'RP', color: 'avatar-blue', name: 'Dr. Remya Prabha', type: 'Doctors', specialty: 'Ayurveda', city: 'Trivandrum', phone: '+91 98470 11223', status: 'Interested', badge: 'badge-interested', followup: 'Today, 11:00 AM' },
    { id: 2, initials: 'SC', color: 'avatar-green', name: 'Sanjeevani Ayurveda Clinic', type: 'Clinics', specialty: 'Panchakarma & Kayachikitsa', city: 'Kochi', phone: '+91 98461 44550', status: 'Contacted', badge: 'badge-contacted', followup: 'Today, 3:00 PM' },
    { id: 3, initials: 'WH', color: 'avatar-purple', name: 'Wellness Hospital', type: 'Hospitals', specialty: 'Multi-Specialty AYUSH', city: 'Kozhikode', phone: '+91 94472 88991', status: 'Meeting', badge: 'badge-meeting', followup: 'Tomorrow, 10:00 AM' },
    { id: 4, initials: 'DS', color: 'avatar-orange', name: 'Dr. Suresh Kumar', type: 'Doctors', specialty: 'Homeopathy', city: 'Kollam', phone: '+91 94460 77321', status: 'New Lead', badge: 'badge-newlead', followup: 'Nov 5, 2:00 PM' },
    { id: 5, initials: 'AM', color: 'avatar-blue', name: 'Dr. Anjali Menon', type: 'Doctors', specialty: 'Siddha Medicine', city: 'Thrissur', phone: '+91 98951 66210', status: 'Onboarded', badge: 'badge-completed', followup: 'Completed' },
    { id: 6, initials: 'KV', color: 'avatar-green', name: 'Kottakkal Vaidya Clinic', type: 'Clinics', specialty: 'Ayurveda Therapy', city: 'Malappuram', phone: '+91 97450 22334', status: 'Interested', badge: 'badge-interested', followup: 'Nov 6, 11:30 AM' },
    { id: 7, initials: 'AH', color: 'avatar-purple', name: 'Arya Holistic Hospital', type: 'Hospitals', specialty: 'Ayurveda & Naturopathy', city: 'Palakkad', phone: '+91 94952 99110', status: 'Onboarded', badge: 'badge-completed', followup: 'Completed' },
    { id: 8, initials: 'VN', color: 'avatar-orange', name: 'Dr. Vivek Nair', type: 'Doctors', specialty: 'Yoga & Naturopathy', city: 'Kottayam', phone: '+91 96331 55442', status: 'Contacted', badge: 'badge-contacted', followup: 'Nov 7, 4:00 PM' },
    { id: 9, initials: 'MK', color: 'avatar-blue', name: 'Dr. Meera Krishnan', type: 'Doctors', specialty: 'Ayurveda Prasuti', city: 'Alappuzha', phone: '+91 98472 33901', status: 'Interested', badge: 'badge-interested', followup: 'Nov 8, 10:30 AM' },
    { id: 10, initials: 'PC', color: 'avatar-green', name: 'Prana Siddha & Varma Clinic', type: 'Clinics', specialty: 'Siddha & Varma', city: 'Kannur', phone: '+91 94478 12098', status: 'New Lead', badge: 'badge-newlead', followup: 'Nov 8, 2:15 PM' },
    { id: 11, initials: 'MH', color: 'avatar-purple', name: 'Malabar Ayur Hospital', type: 'Hospitals', specialty: 'Panchakarma Hospital', city: 'Wayanad', phone: '+91 99460 77812', status: 'Meeting', badge: 'badge-meeting', followup: 'Nov 9, 11:00 AM' },
    { id: 12, initials: 'RG', color: 'avatar-orange', name: 'Dr. Rajesh Gopinath', type: 'Doctors', specialty: 'Homeopathy', city: 'Pathanamthitta', phone: '+91 94465 89012', status: 'Onboarded', badge: 'badge-completed', followup: 'Completed' },
    { id: 13, initials: 'NC', color: 'avatar-green', name: 'Nirmala Unani Care Clinic', type: 'Clinics', specialty: 'Unani Medicine', city: 'Kasaragod', phone: '+91 97461 45090', status: 'Contacted', badge: 'badge-contacted', followup: 'Nov 10, 3:30 PM' },
    { id: 14, initials: 'TH', color: 'avatar-purple', name: 'Trivandrum Heritage Hospital', type: 'Hospitals', specialty: 'Integrated AYUSH', city: 'Trivandrum', phone: '+91 98471 60900', status: 'Interested', badge: 'badge-interested', followup: 'Nov 11, 12:00 PM' },
    { id: 15, initials: 'LP', color: 'avatar-blue', name: 'Dr. Lakshmi Pillai', type: 'Doctors', specialty: 'Ayurveda Kayachikitsa', city: 'Kochi', phone: '+91 98950 11447', status: 'Meeting', badge: 'badge-meeting', followup: 'Nov 12, 9:30 AM' }
  ];

  const defaultCampaigns = [
    { title: 'Doctor Onboarding Invitation', segment: 'Doctors', date: 'Oct 28, 2026', status: 'Completed', sent: 2450, delivered: 2210, read: 1735, replied: 318 },
    { title: 'Clinic Partnership Outreach', segment: 'Clinics', date: 'Oct 20, 2026', status: 'Completed', sent: 1280, delivered: 1138, read: 876, replied: 142 },
    { title: 'Hospital Collaboration Drive', segment: 'Hospitals', date: 'Oct 15, 2026', status: 'Completed', sent: 620, delivered: 588, read: 436, replied: 76 },
    { title: 'Kerala Ayurveda Summit Invite', segment: 'Doctors', date: 'Oct 10, 2026', status: 'Completed', sent: 1890, delivered: 1740, read: 1320, replied: 245 },
    { title: 'Digital Prescription Webinar', segment: 'Doctors', date: 'Oct 02, 2026', status: 'Completed', sent: 1540, delivered: 1420, read: 1105, replied: 198 },
    { title: 'Panchakarma Center Tie-up Drive', segment: 'Clinics', date: 'Sep 25, 2026', status: 'Completed', sent: 840, delivered: 790, read: 612, replied: 94 },
    { title: 'Insurance & Tele-Ayush Integration', segment: 'Hospitals', date: 'Sep 18, 2026', status: 'Completed', sent: 480, delivered: 452, read: 360, replied: 61 },
    { title: 'Homeopathy Practitioners Meet', segment: 'Doctors', date: 'Sep 11, 2026', status: 'Completed', sent: 1120, delivered: 1045, read: 810, replied: 134 }
  ];

  const defaultTeam = [
    { initials: 'AD', color: 'avatar-blue', name: 'Admin (You)', role: 'Super Admin', email: 'admin@ayushdoc.in', region: 'All Kerala & India', active: 'Online' },
    { initials: 'RK', color: 'avatar-green', name: 'Rahul Krishnan', role: 'Onboarding Lead', email: 'rahul@ayushdoc.in', region: 'Central Zone (Kochi / Thrissur)', active: 'Online' },
    { initials: 'SN', color: 'avatar-purple', name: 'Sneha Nair', role: 'Senior Tele-caller', email: 'sneha@ayushdoc.in', region: 'South Zone (Trivandrum / Kollam)', active: 'In a Call' },
    { initials: 'AM', color: 'avatar-orange', name: 'Arjun Menon', role: 'Field Partnership Exec', email: 'arjun@ayushdoc.in', region: 'North Zone (Kozhikode / Kannur)', active: 'Online' },
    { initials: 'DV', color: 'avatar-blue', name: 'Divya Varma', role: 'WhatsApp Campaign Specialist', email: 'divya@ayushdoc.in', region: 'Kochi HQ', active: 'Online' },
    { initials: 'KP', color: 'avatar-green', name: 'Kiran Panicker', role: 'Hospital Relations Manager', email: 'kiran@ayushdoc.in', region: 'Kottayam / Alappuzha', active: 'Online' },
    { initials: 'NR', color: 'avatar-purple', name: 'Neha Raj', role: 'Tele-calling Executive', email: 'neha@ayushdoc.in', region: 'Malappuram / Palakkad', active: 'In a Call' },
    { initials: 'VS', color: 'avatar-orange', name: 'Vishnu S', role: 'Support & Verification Exec', email: 'vishnu@ayushdoc.in', region: 'Trivandrum', active: 'Online' }
  ];

  // Load saved partners/campaigns from localStorage if available
  const savedPartners = JSON.parse(localStorage.getItem('ayush_crm_partners') || 'null');
  const savedCampaigns = JSON.parse(localStorage.getItem('ayush_crm_campaigns') || 'null');

  const state = {
    currentView: 'dashboard',
    counts: {
      total: 1248,
      doctors: 876,
      clinics: 258,
      hospitals: 114
    },
    pagination: {
      dashFollowupsPage: 1,
      dashFollowupsSize: 4,
      dashCampaignsPage: 1,
      dashCampaignsSize: 3,
      partnersPage: 1,
      partnersPageSize: 5,
      followupsPage: 1,
      followupsPageSize: 5,
      campaignsPage: 1,
      campaignsPageSize: 5,
      teamPage: 1,
      teamPageSize: 5
    },
    partners: savedPartners || defaultPartners,
    campaigns: savedCampaigns || defaultCampaigns,
    team: defaultTeam,
    automations: [
      { id: 1, title: 'Instant WhatsApp Welcome on New Lead', desc: 'Automatically send an official WABA brochure & onboarding link when a new Doctor/Clinic lead is added.', enabled: true },
      { id: 2, title: 'Follow-up Reminder (1 Hour Before)', desc: 'Send automated WhatsApp + CRM reminder to assigned tele-caller and partner 60 mins prior to scheduled meeting.', enabled: true },
      { id: 3, title: 'Auto-Tag Interested Replies', desc: 'Move partner stage to "Interested" automatically when they reply "YES" or click the CTA button on WhatsApp.', enabled: true },
      { id: 4, title: 'Weekly Digest Report to Admin', desc: 'Send weekly partner onboarding funnel summary every Monday at 9:00 AM.', enabled: false }
    ]
  };

  function persistState() {
    localStorage.setItem('ayush_crm_partners', JSON.stringify(state.partners));
    localStorage.setItem('ayush_crm_campaigns', JSON.stringify(state.campaigns));
  }

  // ---- DOM ELEMENTS ----
  const sidebar = document.getElementById('sidebar');
  const sidebarCollapseBtn = document.getElementById('sidebarCollapseBtn');
  const partnersToggle = document.getElementById('partnersToggle');
  const partnersSubmenu = document.getElementById('partnersSubmenu');
  const viewDashboard = document.getElementById('view-dashboard');
  const viewDynamic = document.getElementById('view-dynamic');
  const pageMainHeading = document.getElementById('pageMainHeading');
  const pageSubHeading = document.getElementById('pageSubHeading');
  const modalBackdrop = document.getElementById('crmModalBackdrop');
  const modalContent = document.getElementById('crmModalContent');
  const toastEl = document.getElementById('crmToast');
  const globalSearchInput = document.getElementById('globalSearchInput');

  // ---- TOAST HELPER ----
  let toastTimeout;
  function showToast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => toastEl.classList.remove('show'), 2800);
  }

  // ---- REUSABLE PAGINATION HELPER ----
  function paginateArray(items, currentPage, pageSize) {
    const totalItems = items.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
    const safePage = Math.min(Math.max(1, currentPage), totalPages);
    const startIdx = (safePage - 1) * pageSize;
    const endIdx = Math.min(startIdx + pageSize, totalItems);
    const pageItems = items.slice(startIdx, endIdx);
    return {
      pageItems,
      totalItems,
      totalPages,
      currentPage: safePage,
      startRow: totalItems === 0 ? 0 : startIdx + 1,
      endRow: endIdx
    };
  }

  function renderPaginationBarHTML(pager, pageSize, prefix) {
    let pageButtonsHTML = '';
    for (let p = 1; p <= pager.totalPages; p++) {
      pageButtonsHTML += `<button class="page-btn ${p === pager.currentPage ? 'active' : ''}" data-${prefix}-page="${p}">${p}</button>`;
    }

    return `
      <div class="pagination-bar">
        <div class="pagination-info">
          <span>Showing <strong>${pager.startRow}</strong> to <strong>${pager.endRow}</strong> of <strong>${pager.totalItems}</strong> entries</span>
          <label style="display:inline-flex;align-items:center;gap:6px;">
            <span>Rows per page:</span>
            <select class="page-size-select" id="${prefix}PageSizeSelect">
              <option value="5" ${pageSize === 5 ? 'selected' : ''}>5</option>
              <option value="8" ${pageSize === 8 ? 'selected' : ''}>8</option>
              <option value="10" ${pageSize === 10 ? 'selected' : ''}>10</option>
              <option value="15" ${pageSize === 15 ? 'selected' : ''}>15</option>
            </select>
          </label>
        </div>
        <div class="pagination-controls">
          <button class="page-btn" data-${prefix}-page="${pager.currentPage - 1}" ${pager.currentPage <= 1 ? 'disabled' : ''}>‹ Prev</button>
          ${pageButtonsHTML}
          <button class="page-btn" data-${prefix}-page="${pager.currentPage + 1}" ${pager.currentPage >= pager.totalPages ? 'disabled' : ''}>Next ›</button>
        </div>
      </div>
    `;
  }

  function bindPaginationEvents(container, prefix, pageKey, sizeKey, reRenderFn) {
    container.querySelectorAll(`[data-${prefix}-page]`).forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.disabled) return;
        state.pagination[pageKey] = Number(btn.getAttribute(`data-${prefix}-page`));
        reRenderFn();
      });
    });

    const sizeSelect = container.querySelector(`#${prefix}PageSizeSelect`);
    if (sizeSelect) {
      sizeSelect.addEventListener('change', (e) => {
        state.pagination[sizeKey] = Number(e.target.value);
        state.pagination[pageKey] = 1;
        reRenderFn();
      });
    }
  }

  // ---- SIDEBAR COLLAPSE & MOBILE DRAWER ----
  const sidebarBackdrop = document.getElementById('sidebarBackdrop');
  const viewModeSelector = document.getElementById('viewModeSelector');

  function closeMobileSidebar() {
    sidebar.classList.remove('mobile-open');
    sidebarBackdrop?.classList.remove('active');
  }

  sidebarCollapseBtn?.addEventListener('click', () => {
    const isMobileOrTablet = window.innerWidth <= 1024 ||
      document.body.classList.contains('mode-mobile') ||
      document.body.classList.contains('mode-tablet');

    if (isMobileOrTablet) {
      const opened = sidebar.classList.toggle('mobile-open');
      sidebarBackdrop?.classList.toggle('active', opened);
    } else {
      sidebar.classList.toggle('collapsed');
    }
  });

  sidebarBackdrop?.addEventListener('click', closeMobileSidebar);

  viewModeSelector?.addEventListener('change', (e) => {
    const mode = e.target.value;
    document.body.classList.remove('force-view-mode', 'mode-system', 'mode-laptop', 'mode-tablet', 'mode-mobile');
    closeMobileSidebar();
    sidebar.classList.remove('collapsed');

    if (mode !== 'auto') {
      if (mode !== 'system') {
        document.body.classList.add('force-view-mode', `mode-${mode}`);
      } else {
        document.body.classList.add('mode-system');
      }
      showToast(`Switched to ${e.target.options[e.target.selectedIndex].text}`);
    } else {
      showToast('Switched to Auto Responsive mode');
    }
  });

  const waSvgIcon = `
    <svg viewBox="0 0 24 24" fill="none">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2Z" stroke="#16a34a" stroke-width="2"/>
      <path d="M16.56 14.33C16.31 15.03 15.1 15.61 14.52 15.69C13.98 15.77 13.3 15.8 11.02 14.86C8.18 13.68 6.36 10.79 6.22 10.6C6.08 10.41 5.07 9.08 5.07 7.7C5.07 6.32 5.79 5.65 6.06 5.36C6.31 5.09 6.62 5.02 6.82 5.02C7.01 5.02 7.2 5.02 7.37 5.03C7.55 5.04 7.79 4.96 8.02 5.52C8.27 6.12 8.85 7.53 8.92 7.67C8.99 7.82 9.04 7.99 8.94 8.18C8.85 8.37 8.79 8.48 8.65 8.65C8.5 8.81 8.35 8.99 8.22 9.13C8.08 9.28 7.93 9.44 8.09 9.72C8.26 10 8.83 10.94 9.68 11.7C10.77 12.67 11.67 12.98 11.96 13.11C12.24 13.24 12.41 13.21 12.58 13.02C12.75 12.83 13.31 12.17 13.5 11.88C13.69 11.59 13.89 11.64 14.15 11.74C14.41 11.83 15.81 12.52 16.1 12.67C16.38 12.81 16.58 12.88 16.65 13C16.72 13.13 16.81 13.63 16.56 14.33Z" fill="#16a34a"/>
    </svg>
  `;

  // ---- DASHBOARD TABLES PAGINATION ----
  function renderDashboardFollowups() {
    const listEl = document.getElementById('dashboardFollowupList');
    if (!listEl) return;
    const pager = paginateArray(state.partners, state.pagination.dashFollowupsPage, state.pagination.dashFollowupsSize);
    state.pagination.dashFollowupsPage = pager.currentPage;

    listEl.innerHTML = pager.pageItems.map(p => `
      <div class="followup-row">
        <div class="followup-entity">
          <div class="avatar-circle ${p.color}">${p.initials}</div>
          <div class="entity-info">
            <div class="entity-name">${p.name}</div>
            <div class="entity-sub">${p.specialty} • ${p.city}</div>
          </div>
        </div>
        <div class="followup-time">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          <span>${p.followup}</span>
        </div>
        <div class="followup-status">
          <span class="status-badge ${p.badge}">${p.status}</span>
        </div>
        <div class="followup-actions">
          <button class="icon-action-btn wa-btn" data-wa="${p.name}" data-wa-phone="${p.phone}" title="Send WhatsApp Message to ${p.name}" aria-label="WhatsApp">
            ${waSvgIcon}
          </button>
        </div>
      </div>
    `).join('') + `
      <div class="pagination-bar" style="padding-top:10px;margin-top:4px;">
        <div class="pagination-info" style="font-size:12px;">
          <span>Showing <strong>${pager.startRow}-${pager.endRow}</strong> of <strong>${pager.totalItems}</strong></span>
        </div>
        <div class="pagination-controls">
          <button class="page-btn" style="height:28px;min-width:28px;font-size:12px;" data-dash-fu-page="${pager.currentPage - 1}" ${pager.currentPage <= 1 ? 'disabled' : ''}>‹</button>
          ${Array.from({ length: pager.totalPages }, (_, i) => i + 1).map(p => `
            <button class="page-btn ${p === pager.currentPage ? 'active' : ''}" style="height:28px;min-width:28px;font-size:12px;" data-dash-fu-page="${p}">${p}</button>
          `).join('')}
          <button class="page-btn" style="height:28px;min-width:28px;font-size:12px;" data-dash-fu-page="${pager.currentPage + 1}" ${pager.currentPage >= pager.totalPages ? 'disabled' : ''}>›</button>
        </div>
      </div>
    `;

    listEl.querySelectorAll('[data-dash-fu-page]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.disabled) return;
        state.pagination.dashFollowupsPage = Number(btn.getAttribute('data-dash-fu-page'));
        renderDashboardFollowups();
      });
    });
  }

  function renderDashboardCampaigns() {
    const campEl = document.getElementById('dashboardCampaignList');
    if (!campEl) return;
    const pager = paginateArray(state.campaigns, state.pagination.dashCampaignsPage, state.pagination.dashCampaignsSize);
    state.pagination.dashCampaignsPage = pager.currentPage;

    campEl.innerHTML = pager.pageItems.map(c => `
      <div class="campaign-row">
        <div class="campaign-entity">
          <div class="campaign-icon-circle">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M18 6L9 10H5a2 2 0 0 0-2 2v1a2 2 0 0 0 2 2h4l9 4V6z" fill="#6d28d9"/>
              <path d="M7 15l1 4h2.2l-.7-4" fill="#6d28d9"/>
              <path d="M20.5 9.5a3.5 3.5 0 0 1 0 5" stroke="#6d28d9" stroke-width="1.8" stroke-linecap="round"/>
            </svg>
          </div>
          <div class="entity-info">
            <div class="entity-name">${c.title}</div>
            <div class="entity-sub">${c.segment} • ${c.date}</div>
          </div>
        </div>
        <div class="campaign-status">
          <span class="status-badge badge-completed">${c.status}</span>
        </div>
        <div class="campaign-stats">
          <div class="stat-col"><div class="stat-num">${c.sent.toLocaleString()}</div><div class="stat-lbl">Sent</div></div>
          <div class="stat-col"><div class="stat-num">${c.delivered.toLocaleString()}</div><div class="stat-lbl">Delivered</div></div>
          <div class="stat-col"><div class="stat-num">${c.read.toLocaleString()}</div><div class="stat-lbl">Read</div></div>
          <div class="stat-col"><div class="stat-num">${c.replied.toLocaleString()}</div><div class="stat-lbl">Replied</div></div>
        </div>
      </div>
    `).join('') + `
      <div class="pagination-bar" style="padding-top:10px;margin-top:4px;">
        <div class="pagination-info" style="font-size:12px;">
          <span>Showing <strong>${pager.startRow}-${pager.endRow}</strong> of <strong>${pager.totalItems}</strong></span>
        </div>
        <div class="pagination-controls">
          <button class="page-btn" style="height:28px;min-width:28px;font-size:12px;" data-dash-camp-page="${pager.currentPage - 1}" ${pager.currentPage <= 1 ? 'disabled' : ''}>‹</button>
          ${Array.from({ length: pager.totalPages }, (_, i) => i + 1).map(p => `
            <button class="page-btn ${p === pager.currentPage ? 'active' : ''}" style="height:28px;min-width:28px;font-size:12px;" data-dash-camp-page="${p}">${p}</button>
          `).join('')}
          <button class="page-btn" style="height:28px;min-width:28px;font-size:12px;" data-dash-camp-page="${pager.currentPage + 1}" ${pager.currentPage >= pager.totalPages ? 'disabled' : ''}>›</button>
        </div>
      </div>
    `;

    campEl.querySelectorAll('[data-dash-camp-page]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.disabled) return;
        state.pagination.dashCampaignsPage = Number(btn.getAttribute('data-dash-camp-page'));
        renderDashboardCampaigns();
      });
    });
  }

  renderDashboardFollowups();
  renderDashboardCampaigns();

  // ---- VIEW NAVIGATION ----
  const viewMeta = {
    'dashboard': {
      title: 'Welcome to <span class="text-green">AyushDoc CRM</span> <span class="wave-emoji">👋</span>',
      sub: 'Manage doctors, clinics and hospitals, track follow-ups and run WhatsApp campaigns.'
    },
    'partners-all': {
      title: 'All <span class="text-green">Partners Directory</span>',
      sub: 'Browse, filter, and manage all onboarded and prospective Doctors, Clinics, and Hospitals.'
    },
    'doctors': {
      title: 'Registered <span class="text-green">Doctors</span> (876)',
      sub: 'Manage Ayurveda, Homeopathy, Siddha, Unani & Naturopathy doctors across regions.'
    },
    'clinics': {
      title: 'Partner <span class="text-green">Clinics</span> (258)',
      sub: 'Track clinic partnerships, Panchakarma centers, and specialty outpatient clinics.'
    },
    'hospitals': {
      title: 'Partner <span class="text-green">Hospitals</span> (114)',
      sub: 'Manage multi-specialty AYUSH hospitals, inpatient facilities, and institutional tie-ups.'
    },
    'leads': {
      title: 'Leads &amp; <span class="text-green">Onboarding Pipeline</span>',
      sub: 'Track every partner from initial lead capture through WhatsApp outreach to onboarding.'
    },
    'followups': {
      title: 'Scheduled <span class="text-green">Follow-ups</span>',
      sub: 'Manage upcoming calls, demos, and WhatsApp check-ins with prospective partners.'
    },
    'campaigns': {
      title: 'WhatsApp <span class="text-green">Campaigns</span>',
      sub: 'Broadcast verified WhatsApp Business templates to Doctors, Clinics, and Hospitals.'
    },
    'reports': {
      title: 'Campaign <span class="text-green">Analytics &amp; Reports</span>',
      sub: 'Real-time delivery, read receipts, and reply conversion metrics via WhatsApp Business API.'
    },
    'automation': {
      title: 'Workflow <span class="text-green">Automation</span>',
      sub: 'Configure automated WhatsApp triggers, lead assignment rules, and meeting reminders.'
    },
    'team': {
      title: 'Team &amp; <span class="text-green">Role Management</span>',
      sub: 'Manage CRM administrators, onboarding managers, and regional tele-calling executives.'
    },
    'settings': {
      title: 'CRM &amp; WABA <span class="text-green">Settings</span>',
      sub: 'Configure WhatsApp Business API credentials, templates, and organization preferences.'
    }
  };

  function setActiveSidebarItem(viewKey) {
    document.querySelectorAll('.sidebar-nav .nav-item, .sidebar-nav .submenu-item').forEach(el => {
      el.classList.remove('active');
    });

    if (['doctors', 'clinics', 'hospitals'].includes(viewKey)) {
      partnersToggle.classList.add('active');
      const subEl = document.querySelector(`.submenu-item[data-view="${viewKey}"]`);
      if (subEl) subEl.classList.add('active');
      partnersSubmenu.style.display = 'flex';
      partnersToggle.closest('.nav-group')?.classList.add('open');
    } else {
      const navEl = document.querySelector(`.sidebar-nav .nav-item[data-view="${viewKey}"]`);
      if (navEl) navEl.classList.add('active');
    }
  }

  function matchesPartnerQuery(p, q) {
    if (!q) return true;
    const s = q.toLowerCase();
    return (
      p.name.toLowerCase().includes(s) ||
      p.city.toLowerCase().includes(s) ||
      p.specialty.toLowerCase().includes(s) ||
      p.type.toLowerCase().includes(s) ||
      p.phone.toLowerCase().includes(s) ||
      p.status.toLowerCase().includes(s) ||
      p.followup.toLowerCase().includes(s)
    );
  }

  // ---- PAGINATED PARTNERS TABLE ----
  function renderPartnersView(filterType = 'All', searchQuery = '') {
    const filtered = state.partners.filter(p => {
      const matchesType = filterType === 'All' || p.type === filterType;
      return matchesType && matchesPartnerQuery(p, searchQuery);
    });

    const pager = paginateArray(filtered, state.pagination.partnersPage, state.pagination.partnersPageSize);
    state.pagination.partnersPage = pager.currentPage;

    viewDynamic.innerHTML = `
      <div class="panel-card">
        <div class="panel-header">
          <div class="filter-tabs">
            <button class="filter-tab ${filterType === 'All' ? 'active' : ''}" data-filter="All">All Partners (${state.partners.length})</button>
            <button class="filter-tab ${filterType === 'Doctors' ? 'active' : ''}" data-filter="Doctors">Doctors (${state.partners.filter(x => x.type === 'Doctors').length})</button>
            <button class="filter-tab ${filterType === 'Clinics' ? 'active' : ''}" data-filter="Clinics">Clinics (${state.partners.filter(x => x.type === 'Clinics').length})</button>
            <button class="filter-tab ${filterType === 'Hospitals' ? 'active' : ''}" data-filter="Hospitals">Hospitals (${state.partners.filter(x => x.type === 'Hospitals').length})</button>
          </div>
        </div>
        <div class="table-no-scroll">
          <table class="data-table">
            <thead>
              <tr>
                <th>Partner Name</th>
                <th>Category</th>
                <th>Specialty • City</th>
                <th>Phone / WhatsApp</th>
                <th>Next Follow-up</th>
                <th>Pipeline Status</th>
                <th>Quick Actions</th>
              </tr>
            </thead>
            <tbody>
              ${pager.pageItems.map(p => `
                <tr>
                  <td data-label="Partner" class="td-primary">
                    <div class="followup-entity">
                      <div class="avatar-circle ${p.color}">${p.initials}</div>
                      <div class="entity-info">
                        <div class="entity-name">${p.name}</div>
                        <div class="entity-sub mobile-only-sub">${p.type.slice(0, -1)} • ${p.specialty} • ${p.city}</div>
                      </div>
                    </div>
                  </td>
                  <td data-label="Category"><strong>${p.type.slice(0, -1)}</strong></td>
                  <td data-label="Specialty • City">${p.specialty} • ${p.city}</td>
                  <td data-label="Phone / WhatsApp">${p.phone}</td>
                  <td data-label="Next Follow-up">📅 ${p.followup}</td>
                  <td data-label="Status"><span class="status-badge ${p.badge}">${p.status}</span></td>
                  <td data-label="Action" class="td-action">
                    <div class="followup-actions">
                      <button class="wa-action-btn" data-wa="${p.name}" data-wa-phone="${p.phone}">
                        ${waSvgIcon}
                        <span>WhatsApp</span>
                      </button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        ${renderPaginationBarHTML(pager, state.pagination.partnersPageSize, 'partners')}
      </div>
    `;

    viewDynamic.querySelectorAll('.filter-tab[data-filter]').forEach(btn => {
      btn.addEventListener('click', () => {
        state.pagination.partnersPage = 1;
        const f = btn.getAttribute('data-filter');
        if (f === 'Doctors') switchView('doctors');
        else if (f === 'Clinics') switchView('clinics');
        else if (f === 'Hospitals') switchView('hospitals');
        else switchView('partners-all');
      });
    });

    bindPaginationEvents(viewDynamic, 'partners', 'partnersPage', 'partnersPageSize', () => {
      renderPartnersView(filterType, searchQuery);
    });
  }

  // ---- LEADS & PIPELINE VIEW (WITH PAGINATED TABLE BELOW KANBAN) ----
  function renderLeadsView() {
    const stages = [
      { name: 'New Leads', count: 286, key: 'New Lead', color: '#1d4ed8' },
      { name: 'Contacted', count: 198, key: 'Contacted', color: '#0284c7' },
      { name: 'Interested', count: 128, key: 'Interested', color: '#15803d' },
      { name: 'Meeting', count: 62, key: 'Meeting', color: '#b45309' },
      { name: 'Onboarded', count: 172, key: 'Onboarded', color: '#16a34a' }
    ];

    const pager = paginateArray(state.partners, state.pagination.partnersPage, state.pagination.partnersPageSize);
    state.pagination.partnersPage = pager.currentPage;

    viewDynamic.innerHTML = `
      <div class="kanban-grid">
        ${stages.map(s => {
          const items = state.partners.filter(p => p.status === s.key).slice(0, 3);
          return `
            <div class="kanban-col">
              <div class="kanban-col-header" style="border-bottom-color:${s.color}">
                <span>${s.name}</span>
                <span class="status-badge badge-contacted">${s.count}</span>
              </div>
              ${items.map(item => `
                <div class="kanban-card">
                  <div class="kanban-card-title">${item.name}</div>
                  <div class="kanban-card-sub">${item.specialty} • ${item.city}</div>
                  <div class="kanban-card-foot">
                    <span>📅 ${item.followup}</span>
                    <button class="wa-action-btn" style="padding:4px 9px;font-size:11.5px;" data-wa="${item.name}" data-wa-phone="${item.phone}">
                      ${waSvgIcon}
                      <span>WhatsApp</span>
                    </button>
                  </div>
                </div>
              `).join('')}
            </div>
          `;
        }).join('')}
      </div>

      <div class="panel-card">
        <div class="panel-header">
          <div class="panel-title"><h2>Pipeline Leads Table (${state.partners.length})</h2></div>
        </div>
        <div class="table-no-scroll">
          <table class="data-table">
            <thead>
              <tr>
                <th>Lead Name</th>
                <th>Category</th>
                <th>Specialty • City</th>
                <th>Phone</th>
                <th>Stage</th>
                <th>Follow-up</th>
                <th>Quick Actions</th>
              </tr>
            </thead>
            <tbody>
              ${pager.pageItems.map(p => `
                <tr>
                  <td data-label="Lead Name" class="td-primary">
                    <div class="followup-entity">
                      <div class="avatar-circle ${p.color}">${p.initials}</div>
                      <div class="entity-info">
                        <div class="entity-name">${p.name}</div>
                        <div class="entity-sub mobile-only-sub">${p.type.slice(0, -1)} • ${p.specialty} • ${p.city}</div>
                      </div>
                    </div>
                  </td>
                  <td data-label="Category">${p.type.slice(0, -1)}</td>
                  <td data-label="Specialty • City">${p.specialty} • ${p.city}</td>
                  <td data-label="Phone">${p.phone}</td>
                  <td data-label="Stage"><span class="status-badge ${p.badge}">${p.status}</span></td>
                  <td data-label="Follow-up">📅 ${p.followup}</td>
                  <td data-label="Action" class="td-action">
                    <div class="followup-actions">
                      <button class="wa-action-btn" data-wa="${p.name}" data-wa-phone="${p.phone}">
                        ${waSvgIcon}
                        <span>WhatsApp</span>
                      </button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        ${renderPaginationBarHTML(pager, state.pagination.partnersPageSize, 'leads')}
      </div>
    `;

    bindPaginationEvents(viewDynamic, 'leads', 'partnersPage', 'partnersPageSize', renderLeadsView);
  }

  // ---- PAGINATED FOLLOW-UPS VIEW ----
  function renderFollowupsView() {
    const pager = paginateArray(state.partners, state.pagination.followupsPage, state.pagination.followupsPageSize);
    state.pagination.followupsPage = pager.currentPage;

    viewDynamic.innerHTML = `
      <div class="panel-card">
        <div class="panel-header">
          <div class="panel-title"><h2>All Scheduled Follow-ups (${state.partners.length})</h2></div>
          <button class="btn btn-primary" id="inlineNewFollowupBtn">+ Schedule Follow-up</button>
        </div>
        <div class="followup-list">
          ${pager.pageItems.map(p => `
            <div class="followup-row">
              <div class="followup-entity">
                <div class="avatar-circle ${p.color}">${p.initials}</div>
                <div class="entity-info">
                  <div class="entity-name">${p.name}</div>
                  <div class="entity-sub">${p.specialty} • ${p.city}</div>
                </div>
              </div>
              <div class="followup-time">
                <span>📅 ${p.followup}</span>
              </div>
              <div class="followup-status">
                <span class="status-badge ${p.badge}">${p.status}</span>
              </div>
              <div class="followup-actions">
                <button class="wa-action-btn" data-wa="${p.name}" data-wa-phone="${p.phone}">
                  ${waSvgIcon}
                  <span>WhatsApp</span>
                </button>
              </div>
            </div>
          `).join('')}
        </div>
        ${renderPaginationBarHTML(pager, state.pagination.followupsPageSize, 'followups')}
      </div>
    `;

    document.getElementById('inlineNewFollowupBtn')?.addEventListener('click', openNewFollowupModal);
    bindPaginationEvents(viewDynamic, 'followups', 'followupsPage', 'followupsPageSize', renderFollowupsView);
  }

  // ---- 1. WHATSAPP CAMPAIGNS VIEW (Broadcasts & Approved WABA Templates) ----
  function renderCampaignsView(filterSegment = 'All') {
    const filteredCampaigns = filterSegment === 'All'
      ? state.campaigns
      : state.campaigns.filter(c => c.segment.toLowerCase().includes(filterSegment.toLowerCase()));

    const pager = paginateArray(filteredCampaigns, state.pagination.campaignsPage, state.pagination.campaignsPageSize);
    state.pagination.campaignsPage = pager.currentPage;

    const templates = [
      {
        code: 'ayush_doctor_onboarding_v2',
        name: 'Doctor Onboarding Invite',
        segment: 'Doctors',
        body: 'Namaste Dr. {{1}}, join AyushDoc+ Partner Network to digitize appointments & prescriptions. Reach our WhatsApp desk at +91 98470 99880 or reply YES.'
      },
      {
        code: 'ayush_clinic_partnership_v1',
        name: 'Clinic Partnership Outreach',
        segment: 'Clinics',
        body: 'Greetings {{1}}, list your Ayurveda/Siddha clinic on AyushDoc+ and grow patient bookings by 3x. Contact +91 98470 99880 for instant setup.'
      },
      {
        code: 'ayush_hospital_collab_v3',
        name: 'Hospital Collaboration Drive',
        segment: 'Hospitals',
        body: 'Dear {{1}} Management, partner with AyushDoc+ for integrated IPD/OPD referrals across Kerala. Reply DEMO to schedule a walkthrough.'
      }
    ];

    viewDynamic.innerHTML = `
      <div class="panel-card">
        <div class="panel-header">
          <div class="panel-title">
            <h2>Approved WhatsApp Business (WABA) Message Templates</h2>
          </div>
          <button class="btn btn-whatsapp" id="inlineLaunchCampaignBtn">+ Launch New Broadcast</button>
        </div>
        <div class="templates-grid">
          ${templates.map((t, idx) => `
            <div class="template-card">
              <div class="template-card-top">
                <span class="template-code">${t.code}</span>
                <span class="status-badge badge-completed">Approved ✓</span>
              </div>
              <div class="entity-name" style="font-size:15px;">${t.name}</div>
              <div class="template-bubble">${t.body}</div>
              <div style="display:flex;align-items:center;justify-content:space-between;margin-top:auto;padding-top:4px;">
                <span class="entity-sub">Target: <strong>${t.segment}</strong></span>
                <button class="wa-action-btn use-template-btn" data-tpl-idx="${idx}">
                  ${waSvgIcon}
                  <span>Use Template</span>
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="panel-card">
        <div class="panel-header">
          <div class="panel-title">
            <h2>WhatsApp Broadcast Campaigns (${state.campaigns.length})</h2>
          </div>
          <button class="btn btn-outline" id="goToReportsBtn">📊 View Analytics Reports →</button>
        </div>
        <div class="filter-tabs" id="campaignSegmentTabs" style="margin-bottom: 14px;">
          ${['All', 'Doctors', 'Clinics', 'Hospitals'].map(seg => {
            const count = seg === 'All'
              ? state.campaigns.length
              : state.campaigns.filter(c => c.segment.toLowerCase().includes(seg.toLowerCase())).length;
            return `
              <button class="filter-tab ${filterSegment === seg ? 'active' : ''}" data-seg="${seg}">
                ${seg === 'All' ? `All Broadcasts (${count})` : `${seg} (${count})`}
              </button>
            `;
          }).join('')}
        </div>
        <div class="table-no-scroll">
          <table class="data-table">
            <thead>
              <tr>
                <th>Campaign Name</th>
                <th>Target Audience</th>
                <th>WABA Template</th>
                <th>Launch Date</th>
                <th>Recipients</th>
                <th>Broadcast Status</th>
                <th>Quick Action</th>
              </tr>
            </thead>
            <tbody>
              ${pager.pageItems.map(c => {
                const tplCode = c.segment === 'Doctors'
                  ? 'ayush_doctor_onboarding_v2'
                  : c.segment === 'Clinics'
                    ? 'ayush_clinic_partnership_v1'
                    : 'ayush_hospital_collab_v3';
                return `
                  <tr>
                    <td data-label="Campaign Name" class="td-primary"><strong>${c.title}</strong></td>
                    <td data-label="Target Audience"><strong>${c.segment}</strong></td>
                    <td data-label="WABA Template"><span class="template-code">${tplCode}</span></td>
                    <td data-label="Launch Date">${c.date}</td>
                    <td data-label="Recipients"><strong>${c.sent.toLocaleString()}</strong> partners</td>
                    <td data-label="Broadcast Status"><span class="status-badge badge-completed">${c.status}</span></td>
                    <td data-label="Quick Action" class="td-action">
                      <div class="followup-actions">
                        <button class="wa-action-btn clone-campaign-btn" data-title="${c.title}" data-seg="${c.segment}">
                          ${waSvgIcon}
                          <span>Send Again</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
        ${renderPaginationBarHTML(pager, state.pagination.campaignsPageSize, 'campaigns')}
      </div>
    `;

    document.getElementById('inlineLaunchCampaignBtn')?.addEventListener('click', () => openWaCampaignModal());
    document.getElementById('goToReportsBtn')?.addEventListener('click', () => switchView('reports'));

    viewDynamic.querySelectorAll('.use-template-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const t = templates[Number(btn.getAttribute('data-tpl-idx'))];
        openWaCampaignModal(t.name, t.segment, t.body);
      });
    });

    viewDynamic.querySelectorAll('.clone-campaign-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const title = btn.getAttribute('data-title');
        const seg = btn.getAttribute('data-seg');
        openWaCampaignModal(`${title} (Follow-up)`, seg);
      });
    });

    viewDynamic.querySelectorAll('#campaignSegmentTabs .filter-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        state.pagination.campaignsPage = 1;
        renderCampaignsView(tab.getAttribute('data-seg'));
      });
    });

    bindPaginationEvents(viewDynamic, 'campaigns', 'campaignsPage', 'campaignsPageSize', () => {
      renderCampaignsView(filterSegment);
    });
  }

  // ---- 2. CAMPAIGN REPORTS VIEW (Delivery Funnel, Conversion Analytics & ROI Breakdown) ----
  function renderReportsView() {
    const pager = paginateArray(state.campaigns, state.pagination.campaignsPage, state.pagination.campaignsPageSize);
    state.pagination.campaignsPage = pager.currentPage;

    const totalSent = state.campaigns.reduce((acc, c) => acc + c.sent, 0);
    const totalDelivered = state.campaigns.reduce((acc, c) => acc + c.delivered, 0);
    const totalRead = state.campaigns.reduce((acc, c) => acc + c.read, 0);
    const totalReplied = state.campaigns.reduce((acc, c) => acc + c.replied, 0);

    const delivPct = totalSent ? ((totalDelivered / totalSent) * 100).toFixed(1) : '0.0';
    const readPct = totalDelivered ? ((totalRead / totalDelivered) * 100).toFixed(1) : '0.0';
    const replyPct = totalRead ? ((totalReplied / totalRead) * 100).toFixed(1) : '0.0';

    viewDynamic.innerHTML = `
      <div class="kpi-grid">
        <div class="kpi-card kpi-blue">
          <div class="kpi-details">
            <div class="kpi-title">Total Messages Sent</div>
            <div class="kpi-value">${totalSent.toLocaleString()}</div>
            <div class="kpi-trend"><span class="trend-up">↑ 100%</span> <span class="trend-sub">via WABA API</span></div>
          </div>
        </div>
        <div class="kpi-card kpi-green">
          <div class="kpi-details">
            <div class="kpi-title">Delivery Rate</div>
            <div class="kpi-value">${delivPct}%</div>
            <div class="kpi-trend"><span class="trend-up">${totalDelivered.toLocaleString()}</span> <span class="trend-sub">delivered</span></div>
          </div>
        </div>
        <div class="kpi-card kpi-orange">
          <div class="kpi-details">
            <div class="kpi-title">Open / Read Rate</div>
            <div class="kpi-value">${readPct}%</div>
            <div class="kpi-trend"><span class="trend-up">${totalRead.toLocaleString()}</span> <span class="trend-sub">opened</span></div>
          </div>
        </div>
        <div class="kpi-card kpi-purple">
          <div class="kpi-details">
            <div class="kpi-title">Partner Replies &amp; Leads</div>
            <div class="kpi-value">${totalReplied.toLocaleString()}</div>
            <div class="kpi-trend"><span class="trend-up">${replyPct}%</span> <span class="trend-sub">reply conversion</span></div>
          </div>
        </div>
      </div>

      <div class="middle-grid">
        <div class="panel-card">
          <div class="panel-header">
            <div class="panel-title"><h2>WhatsApp Delivery &amp; Conversion Funnel</h2></div>
            <span class="status-badge badge-interested">Live WABA Telemetry</span>
          </div>
          <div class="funnel-list">
            <div class="funnel-row">
              <div class="funnel-meta">
                <span>1. Total Broadcast Sent</span>
                <span>${totalSent.toLocaleString()} (100%)</span>
              </div>
              <div class="funnel-track"><div class="funnel-fill" style="width:100%;background:#2563eb;"></div></div>
            </div>
            <div class="funnel-row">
              <div class="funnel-meta">
                <span>2. Successfully Delivered</span>
                <span>${totalDelivered.toLocaleString()} (${delivPct}%)</span>
              </div>
              <div class="funnel-track"><div class="funnel-fill" style="width:${delivPct}%;background:#0d9488;"></div></div>
            </div>
            <div class="funnel-row">
              <div class="funnel-meta">
                <span>3. Read by Doctors / Clinics</span>
                <span>${totalRead.toLocaleString()} (${readPct}% of delivered)</span>
              </div>
              <div class="funnel-track"><div class="funnel-fill" style="width:${readPct}%;background:#16a34a;"></div></div>
            </div>
            <div class="funnel-row">
              <div class="funnel-meta">
                <span>4. Replied &amp; Interested</span>
                <span>${totalReplied.toLocaleString()} (${replyPct}% of read)</span>
              </div>
              <div class="funnel-track"><div class="funnel-fill" style="width:${Math.min(100, Number(replyPct) * 2.5)}%;background:#f59e0b;"></div></div>
            </div>
          </div>
        </div>

        <div class="panel-card">
          <div class="panel-header">
            <div class="panel-title"><h2>Audience Segment Engagement</h2></div>
            <button class="btn btn-outline" id="exportReportCsvBtn">📥 Export CSV Report</button>
          </div>
          <div class="funnel-list">
            <div class="funnel-row">
              <div class="funnel-meta">
                <span>🩺 Doctors Segment (Ayurveda, Siddha, Homeo)</span>
                <span style="color:#15803d;">81.2% Read • 18.4% Reply</span>
              </div>
              <div class="funnel-track"><div class="funnel-fill" style="width:81.2%;background:#16a34a;"></div></div>
            </div>
            <div class="funnel-row">
              <div class="funnel-meta">
                <span>🏥 Clinics &amp; Panchakarma Centers</span>
                <span style="color:#1d4ed8;">76.5% Read • 16.9% Reply</span>
              </div>
              <div class="funnel-track"><div class="funnel-fill" style="width:76.5%;background:#2563eb;"></div></div>
            </div>
            <div class="funnel-row">
              <div class="funnel-meta">
                <span>🏢 Multi-Specialty AYUSH Hospitals</span>
                <span style="color:#b45309;">74.8% Read • 15.2% Reply</span>
              </div>
              <div class="funnel-track"><div class="funnel-fill" style="width:74.8%;background:#f59e0b;"></div></div>
            </div>
          </div>
        </div>
      </div>

      <div class="panel-card">
        <div class="panel-header">
          <div class="panel-title"><h2>Campaign-Wise Delivery &amp; Conversion Report (${state.campaigns.length})</h2></div>
          <button class="btn btn-outline" id="backToCampaignsBtn">← Manage Broadcasts</button>
        </div>
        <div class="table-no-scroll">
          <table class="data-table">
            <thead>
              <tr>
                <th>Campaign Name</th>
                <th>Segment</th>
                <th>Sent</th>
                <th>Delivered (%)</th>
                <th>Read (%)</th>
                <th>Replied</th>
                <th>Conversion Rate</th>
              </tr>
            </thead>
            <tbody>
              ${pager.pageItems.map(c => {
                const dRate = c.sent ? Math.round((c.delivered / c.sent) * 100) : 0;
                const rRate = c.delivered ? Math.round((c.read / c.delivered) * 100) : 0;
                const convRate = c.read ? ((c.replied / c.read) * 100).toFixed(1) : '0.0';
                return `
                  <tr>
                    <td data-label="Campaign Name" class="td-primary"><strong>${c.title}</strong></td>
                    <td data-label="Segment"><strong>${c.segment}</strong></td>
                    <td data-label="Sent"><strong>${c.sent.toLocaleString()}</strong></td>
                    <td data-label="Delivered (%)">${c.delivered.toLocaleString()} <span class="entity-sub">(${dRate}%)</span></td>
                    <td data-label="Read (%)">${c.read.toLocaleString()} <span class="entity-sub">(${rRate}%)</span></td>
                    <td data-label="Replied"><strong style="color:#15803d;">${c.replied.toLocaleString()}</strong></td>
                    <td data-label="Conversion Rate"><span class="status-badge badge-interested">${convRate}% Conv.</span></td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
        ${renderPaginationBarHTML(pager, state.pagination.campaignsPageSize, 'campaigns')}
      </div>
    `;

    document.getElementById('backToCampaignsBtn')?.addEventListener('click', () => switchView('campaigns'));
    document.getElementById('exportReportCsvBtn')?.addEventListener('click', () => {
      const headers = ['Campaign Name,Segment,Launch Date,Status,Sent,Delivered,Read,Replied'];
      const rows = state.campaigns.map(c =>
        `"${c.title}","${c.segment}","${c.date}","${c.status}",${c.sent},${c.delivered},${c.read},${c.replied}`
      );
      const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
      const link = document.createElement('a');
      link.setAttribute('href', encodeURI(csvContent));
      link.setAttribute('download', 'AyushDoc_Campaign_Reports.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      showToast('Exported AyushDoc_Campaign_Reports.csv!');
    });

    bindPaginationEvents(viewDynamic, 'campaigns', 'campaignsPage', 'campaignsPageSize', renderReportsView);
  }

  function renderAutomationView() {
    viewDynamic.innerHTML = `
      <div class="cards-grid-2">
        ${state.automations.map(a => `
          <div class="auto-card">
            <div>
              <div class="entity-name" style="font-size:15px;">⚡ ${a.title}</div>
              <p class="entity-sub" style="margin-top:6px;line-height:1.45;">${a.desc}</p>
            </div>
            <button class="toggle-switch ${a.enabled ? 'on' : ''}" data-auto-id="${a.id}" aria-label="Toggle"></button>
          </div>
        `).join('')}
      </div>
    `;
    viewDynamic.querySelectorAll('.toggle-switch').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = Number(btn.getAttribute('data-auto-id'));
        const item = state.automations.find(x => x.id === id);
        if (item) {
          item.enabled = !item.enabled;
          btn.classList.toggle('on', item.enabled);
          showToast(`${item.title}: ${item.enabled ? 'Enabled' : 'Paused'}`);
        }
      });
    });
  }

  // ---- PAGINATED TEAM & ROLES VIEW ----
  function renderTeamView() {
    const pager = paginateArray(state.team, state.pagination.teamPage, state.pagination.teamPageSize);
    state.pagination.teamPage = pager.currentPage;

    viewDynamic.innerHTML = `
      <div class="panel-card">
        <div class="panel-header">
          <div class="panel-title"><h2>CRM Team Members &amp; Roles (${state.team.length})</h2></div>
        </div>
        <div class="table-no-scroll">
          <table class="data-table">
            <thead>
              <tr>
                <th>Member</th>
                <th>Role</th>
                <th>Email</th>
                <th>Assigned Territory</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${pager.pageItems.map(m => `
                <tr>
                  <td data-label="Member" class="td-primary">
                    <div class="followup-entity">
                      <div class="avatar-circle ${m.color}">${m.initials.toUpperCase()}</div>
                      <div class="entity-name">${m.name}</div>
                    </div>
                  </td>
                  <td data-label="Role"><strong>${m.role}</strong></td>
                  <td data-label="Email">${m.email}</td>
                  <td data-label="Territory">${m.region}</td>
                  <td data-label="Status"><span class="status-badge badge-completed">${m.active}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        ${renderPaginationBarHTML(pager, state.pagination.teamPageSize, 'team')}
      </div>
    `;

    bindPaginationEvents(viewDynamic, 'team', 'teamPage', 'teamPageSize', renderTeamView);
  }

  function renderSettingsView() {
    viewDynamic.innerHTML = `
      <div class="panel-card" style="max-width:680px;">
        <div class="panel-header">
          <div class="panel-title"><h2>WhatsApp Business API &amp; CRM Configuration</h2></div>
          <span class="status-badge badge-completed">Connected ✓</span>
        </div>
        <div class="form-group">
          <label>Organization Name</label>
          <input type="text" value="AyushDoc+ Partner CRM" />
        </div>
        <div class="form-group">
          <label>WhatsApp Business Account (WABA) ID</label>
          <input type="text" value="1668505274797804" />
        </div>
        <div class="form-group">
          <label>Connected Display Phone Number</label>
          <input type="text" value="+91 484 299 8800 (Verified Green Tick)" />
        </div>
        <div class="form-group">
          <label>Webhook Callback URL</label>
          <input type="text" value="https://api.ayushdoc.com/v1/whatsapp/webhook" />
        </div>
        <div class="modal-actions">
          <button class="btn btn-primary" id="saveSettingsBtn">Save Configuration</button>
        </div>
      </div>
    `;
    document.getElementById('saveSettingsBtn')?.addEventListener('click', () => {
      showToast('Settings saved successfully!');
    });
  }

  function switchView(viewKey, searchQuery = '') {
    closeMobileSidebar();
    if (state.currentView !== viewKey) {
      state.pagination.partnersPage = 1;
      state.pagination.followupsPage = 1;
      state.pagination.campaignsPage = 1;
      state.pagination.teamPage = 1;
    }
    state.currentView = viewKey;
    setActiveSidebarItem(viewKey);

    const meta = viewMeta[viewKey] || viewMeta['dashboard'];
    pageMainHeading.innerHTML = meta.title;
    pageSubHeading.textContent = meta.sub;

    if (viewKey === 'dashboard') {
      viewDashboard.style.display = 'flex';
      viewDynamic.style.display = 'none';
      return;
    }

    viewDashboard.style.display = 'none';
    viewDynamic.style.display = 'flex';

    if (viewKey === 'partners-all') renderPartnersView('All', searchQuery);
    else if (viewKey === 'doctors') renderPartnersView('Doctors', searchQuery);
    else if (viewKey === 'clinics') renderPartnersView('Clinics', searchQuery);
    else if (viewKey === 'hospitals') renderPartnersView('Hospitals', searchQuery);
    else if (viewKey === 'leads') renderLeadsView();
    else if (viewKey === 'followups') renderFollowupsView();
    else if (viewKey === 'campaigns') renderCampaignsView('All');
    else if (viewKey === 'reports') renderReportsView();
    else if (viewKey === 'automation') renderAutomationView();
    else if (viewKey === 'team') renderTeamView();
    else if (viewKey === 'settings') renderSettingsView();
  }

  // ---- SIDEBAR CLICK LISTENERS ----
  document.querySelectorAll('.sidebar-nav [data-view]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetView = link.getAttribute('data-view');

      if (link.id === 'partnersToggle') {
        const navGroup = link.closest('.nav-group');
        if (state.currentView === 'partners-all') {
          navGroup.classList.toggle('open');
          const isOpen = navGroup.classList.contains('open');
          partnersSubmenu.style.display = isOpen ? 'flex' : 'none';
          partnersToggle.querySelector('.submenu-arrow').style.transform = isOpen ? 'rotate(0deg)' : 'rotate(-90deg)';
          return;
        } else {
          navGroup.classList.add('open');
          partnersSubmenu.style.display = 'flex';
          partnersToggle.querySelector('.submenu-arrow').style.transform = 'rotate(0deg)';
        }
      }

      switchView(targetView);
    });
  });

  document.querySelectorAll('[data-nav-trigger]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      switchView(el.getAttribute('data-nav-trigger'));
    });
  });

  document.getElementById('manageWabaBtn')?.addEventListener('click', openWabaStatusModal);
  document.getElementById('topWaStatusBtn')?.addEventListener('click', openWabaStatusModal);

  // ---- TOPBAR NOTIFICATIONS & ADMIN PROFILE DROPDOWNS ----
  const notifBtn = document.getElementById('notifBtn');
  const notifDropdown = document.getElementById('notifDropdown');
  const notifCountEl = document.getElementById('notifCount');
  const userProfileBtn = document.getElementById('userProfileBtn');
  const userDropdown = document.getElementById('userDropdown');

  const notifications = [
    { id: 1, text: '<strong>Dr. Remya Prabha</strong> replied <em>"YES, interested in demo"</em> on WhatsApp.', time: '2 mins ago', unread: true, action: () => openDirectWhatsAppModal('Dr. Remya Prabha', '+91 98470 11223') },
    { id: 2, text: 'Follow-up reminder: <strong>Sanjeevani Ayurveda Clinic</strong> scheduled today at 3:00 PM.', time: '18 mins ago', unread: true, action: () => switchView('followups') },
    { id: 3, text: 'New Hospital Lead: <strong>Wellness Hospital (Kozhikode)</strong> requested tie-up details.', time: '1 hour ago', unread: true, action: () => switchView('hospitals') }
  ];

  function renderNotifications() {
    if (!notifDropdown) return;
    const unreadCount = notifications.filter(n => n.unread).length;
    if (notifCountEl) {
      notifCountEl.textContent = unreadCount;
      notifCountEl.style.display = unreadCount > 0 ? 'flex' : 'none';
    }

    notifDropdown.innerHTML = `
      <div class="dropdown-head">
        <strong>Notifications (${unreadCount} new)</strong>
        <button class="dropdown-link-btn" id="markAllReadBtn">Mark all read</button>
      </div>
      <div>
        ${notifications.map(n => `
          <div class="notif-item ${n.unread ? 'unread' : ''}" data-notif-id="${n.id}">
            <span class="notif-dot"></span>
            <div>
              <div class="notif-text">${n.text}</div>
              <div class="notif-time">${n.time}</div>
            </div>
          </div>
        `).join('')}
      </div>
      <div class="dropdown-head" style="border-top:1px solid #eef2f7;border-bottom:none;justify-content:center;">
        <button class="dropdown-link-btn" id="viewAllFollowupsNotifBtn">View All Follow-ups →</button>
      </div>
    `;

    document.getElementById('markAllReadBtn')?.addEventListener('click', (e) => {
      e.stopPropagation();
      notifications.forEach(n => { n.unread = false; });
      renderNotifications();
      showToast('All notifications marked as read');
    });

    document.getElementById('viewAllFollowupsNotifBtn')?.addEventListener('click', () => {
      notifDropdown.classList.remove('open');
      switchView('followups');
    });

    notifDropdown.querySelectorAll('[data-notif-id]').forEach(item => {
      item.addEventListener('click', () => {
        const id = Number(item.getAttribute('data-notif-id'));
        const notif = notifications.find(x => x.id === id);
        if (notif) {
          notif.unread = false;
          renderNotifications();
          notifDropdown.classList.remove('open');
          notif.action();
        }
      });
    });
  }

  function renderUserDropdown() {
    if (!userDropdown) return;
    const adminName = document.getElementById('headerUserName')?.textContent || 'Admin';
    const adminOrg = document.getElementById('headerUserOrg')?.textContent || 'AyushDoc';

    userDropdown.innerHTML = `
      <div class="dropdown-head" style="flex-direction:column;align-items:flex-start;gap:2px;">
        <strong>${adminName} — ${adminOrg}</strong>
        <span style="font-size:11.5px;color:#64748b;">admin@ayushdoc.in</span>
      </div>
      <button class="menu-list-item" id="openCustomerPortalBtn">🌐 Open Customer Portal</button>
      <button class="menu-list-item" id="editProfileMenuBtn">👤 Edit Admin Profile</button>
      <button class="menu-list-item" id="teamMenuBtn">👥 Team &amp; Roles</button>
      <button class="menu-list-item" id="wabaSettingsMenuBtn">⚙️ WABA &amp; CRM Settings</button>
      <button class="menu-list-item" id="resetDemoDataBtn">🔄 Reset Demo Data</button>
      <button class="menu-list-item danger" id="signOutMenuBtn">🚪 Switch Account</button>
    `;

    document.getElementById('openCustomerPortalBtn')?.addEventListener('click', () => {
      userDropdown.classList.remove('open');
      window.location.href = 'customer.html';
    });

    document.getElementById('editProfileMenuBtn')?.addEventListener('click', () => {
      userDropdown.classList.remove('open');
      openEditAdminProfileModal();
    });
    document.getElementById('teamMenuBtn')?.addEventListener('click', () => {
      userDropdown.classList.remove('open');
      switchView('team');
    });
    document.getElementById('wabaSettingsMenuBtn')?.addEventListener('click', () => {
      userDropdown.classList.remove('open');
      switchView('settings');
    });
    document.getElementById('resetDemoDataBtn')?.addEventListener('click', () => {
      localStorage.removeItem('ayush_crm_partners');
      localStorage.removeItem('ayush_crm_campaigns');
      state.partners = [...defaultPartners];
      state.campaigns = [...defaultCampaigns];
      userDropdown.classList.remove('open');
      renderDashboardFollowups();
      renderDashboardCampaigns();
      if (state.currentView !== 'dashboard') switchView(state.currentView);
      showToast('Demo data restored to default!');
    });
    document.getElementById('signOutMenuBtn')?.addEventListener('click', () => {
      userDropdown.classList.remove('open');
      openEditAdminProfileModal(true);
    });
  }

  renderNotifications();
  renderUserDropdown();

  notifBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    userDropdown?.classList.remove('open');
    notifDropdown?.classList.toggle('open');
  });

  userProfileBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    notifDropdown?.classList.remove('open');
    userDropdown?.classList.toggle('open');
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.dropdown-wrap')) {
      notifDropdown?.classList.remove('open');
      userDropdown?.classList.remove('open');
    }
  });

  // ---- WHATSAPP CONNECTED STATUS MODAL ----
  function openWabaStatusModal() {
    modalContent.innerHTML = `
      <div class="modal-header">
        <h3 style="display:flex;align-items:center;gap:8px;">
          <span style="width:22px;height:22px;display:inline-flex;">${waSvgIcon}</span>
          <span>WhatsApp Business API Status</span>
        </h3>
        <button class="modal-close" id="closeModalBtn">✕</button>
      </div>
      <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:14px;margin-bottom:14px;display:flex;align-items:center;justify-content:space-between;">
        <div>
          <div style="font-size:14px;font-weight:800;color:#15803d;">● Connected &amp; Active</div>
          <div style="font-size:12px;color:#334155;margin-top:2px;">WABA ID: <strong>1668505274797804</strong></div>
        </div>
        <button type="button" class="filter-tab" id="copyWabaIdBtn" style="background:#ffffff;">📋 Copy ID</button>
      </div>
      <div class="form-group">
        <label>Verified Business WhatsApp Number</label>
        <input type="text" id="wabaConnectedPhone" value="+91 98470 99880" />
      </div>
      <div class="form-group">
        <label>Send Quick Test Message to Any WhatsApp Number</label>
        <div style="display:flex;gap:8px;">
          <input type="text" id="wabaTestPhone" placeholder="+91 98470 11223" value="+91 98470 11223" style="flex:1;" />
          <button type="button" class="btn btn-whatsapp" id="sendTestWaBtn">Test on WhatsApp</button>
        </div>
      </div>
      <div class="modal-actions">
        <button type="button" class="btn btn-outline" id="openFullWabaSettingsBtn">Full Settings</button>
        <button type="button" class="btn btn-primary" id="closeWabaModalBtn">Done</button>
      </div>
    `;
    modalBackdrop.style.display = 'flex';
    document.getElementById('closeModalBtn').onclick = closeModal;
    document.getElementById('closeWabaModalBtn').onclick = closeModal;
    document.getElementById('copyWabaIdBtn').onclick = () => {
      navigator.clipboard?.writeText('1668505274797804');
      showToast('Copied WABA ID: 1668505274797804');
    };
    document.getElementById('openFullWabaSettingsBtn').onclick = () => {
      closeModal();
      switchView('settings');
    };
    document.getElementById('sendTestWaBtn').onclick = () => {
      const target = document.getElementById('wabaTestPhone').value.trim();
      closeModal();
      openDirectWhatsAppModal('Partner Test Contact', target);
    };
  }

  // ---- ADMIN PROFILE / SWITCH ACCOUNT MODAL ----
  function openEditAdminProfileModal(isSwitch = false) {
    const currName = document.getElementById('headerUserName')?.textContent || 'Admin';
    const currOrg = document.getElementById('headerUserOrg')?.textContent || 'AyushDoc';

    modalContent.innerHTML = `
      <div class="modal-header">
        <h3>${isSwitch ? 'Switch CRM Account' : 'Edit Admin Profile'}</h3>
        <button class="modal-close" id="closeModalBtn">✕</button>
      </div>
      <form id="adminProfileForm">
        <div class="form-group">
          <label>User / Admin Name *</label>
          <input type="text" name="adminName" value="${currName}" required />
        </div>
        <div class="form-group">
          <label>Organization / Role Label *</label>
          <input type="text" name="adminOrg" value="${currOrg}" required />
        </div>
        <div class="form-group">
          <label>Official WhatsApp Support Number</label>
          <input type="text" name="adminPhone" value="+91 98470 99880" />
        </div>
        <div class="modal-actions">
          <button type="button" class="btn btn-outline" id="cancelModalBtn">Cancel</button>
          <button type="submit" class="btn btn-primary">Save Profile</button>
        </div>
      </form>
    `;
    modalBackdrop.style.display = 'flex';
    document.getElementById('closeModalBtn').onclick = closeModal;
    document.getElementById('cancelModalBtn').onclick = closeModal;

    document.getElementById('adminProfileForm').onsubmit = (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const newName = fd.get('adminName').toString().trim() || 'Admin';
      const newOrg = fd.get('adminOrg').toString().trim() || 'AyushDoc';
      const initials = newName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'AD';

      document.getElementById('headerUserName').textContent = newName;
      document.getElementById('headerUserOrg').textContent = newOrg;
      document.getElementById('headerUserAvatar').textContent = initials;
      renderUserDropdown();
      closeModal();
      showToast(`Updated profile to ${newName} (${newOrg})`);
    };
  }

  // ---- GLOBAL SEARCH BAR & LIVE RESULTS DROPDOWN ----
  const clearSearchBtn = document.getElementById('clearSearchBtn');
  const globalSearchDropdown = document.getElementById('globalSearchDropdown');
  const globalSearchBox = document.getElementById('globalSearchBox');

  function renderGlobalSearchDropdown(query = '') {
    if (!globalSearchDropdown) return;
    const q = query.trim();

    if (clearSearchBtn) {
      clearSearchBtn.style.display = q.length > 0 ? 'inline-flex' : 'none';
    }

    const matchedPartners = q
      ? state.partners.filter(p => matchesPartnerQuery(p, q))
      : state.partners.slice(0, 5);

    const matchedCampaigns = q
      ? state.campaigns.filter(c =>
          c.title.toLowerCase().includes(q.toLowerCase()) ||
          c.segment.toLowerCase().includes(q.toLowerCase()) ||
          c.date.toLowerCase().includes(q.toLowerCase())
        )
      : [];

    const matchedTeam = q
      ? state.team.filter(m =>
          m.name.toLowerCase().includes(q.toLowerCase()) ||
          m.role.toLowerCase().includes(q.toLowerCase()) ||
          m.region.toLowerCase().includes(q.toLowerCase())
        )
      : [];

    const totalMatches = matchedPartners.length + matchedCampaigns.length + matchedTeam.length;

    let html = `
      <div class="search-quick-chips">
        <button type="button" class="search-chip" data-quick-q="Doctors">🩺 Doctors</button>
        <button type="button" class="search-chip" data-quick-q="Clinics">🏥 Clinics</button>
        <button type="button" class="search-chip" data-quick-q="Hospitals">🏢 Hospitals</button>
        <button type="button" class="search-chip" data-quick-q="New Lead">🔥 New Leads</button>
        <button type="button" class="search-chip" data-quick-q="Interested">🤝 Interested</button>
        <button type="button" class="search-chip" data-quick-q="Today">📅 Today's Follow-ups</button>
      </div>
    `;

    if (q && totalMatches === 0) {
      html += `
        <div class="search-empty">
          No doctors, clinics, hospitals, or leads found for "<strong>${q}</strong>".
          <div style="margin-top:8px;">
            <button type="button" class="btn btn-primary" id="searchAddNewPartnerBtn" style="padding:6px 12px;font-size:12px;">+ Add "${q}" as New Partner</button>
          </div>
        </div>
      `;
    } else {
      if (matchedPartners.length > 0) {
        html += `<div class="search-group-title">${q ? `Matching Partners & Leads (${matchedPartners.length})` : 'Recent Partners & Leads'}</div>`;
        html += matchedPartners.slice(0, 6).map(p => `
          <div class="search-result-item" data-search-partner="${p.name}" data-search-type="${p.type}">
            <div class="search-result-left">
              <div class="avatar-circle ${p.color}" style="width:32px;height:32px;font-size:11.5px;">${p.initials}</div>
              <div style="min-width:0;">
                <div class="search-result-name">${p.name}</div>
                <div class="search-result-sub">${p.type.slice(0, -1)} • ${p.specialty} • ${p.city} • ${p.phone}</div>
              </div>
            </div>
            <div style="display:flex;align-items:center;gap:6px;flex-shrink:0;">
              <span class="status-badge ${p.badge}" style="font-size:10.5px;padding:3px 8px;">${p.status}</span>
              <button type="button" class="wa-action-btn" style="padding:4px 9px;font-size:11.5px;" data-wa="${p.name}" data-wa-phone="${p.phone}">
                ${waSvgIcon}
                <span>WhatsApp</span>
              </button>
            </div>
          </div>
        `).join('');
      }

      if (matchedCampaigns.length > 0) {
        html += `<div class="search-group-title">WhatsApp Campaigns (${matchedCampaigns.length})</div>`;
        html += matchedCampaigns.slice(0, 3).map(c => `
          <div class="search-result-item" data-search-view="campaigns">
            <div class="search-result-left">
              <div class="campaign-icon-circle" style="width:32px;height:32px;">📣</div>
              <div style="min-width:0;">
                <div class="search-result-name">${c.title}</div>
                <div class="search-result-sub">${c.segment} • ${c.date} • Sent: ${c.sent.toLocaleString()}</div>
              </div>
            </div>
            <span class="status-badge badge-completed" style="font-size:10.5px;">${c.status}</span>
          </div>
        `).join('');
      }

      if (matchedTeam.length > 0) {
        html += `<div class="search-group-title">Team Members (${matchedTeam.length})</div>`;
        html += matchedTeam.slice(0, 3).map(m => `
          <div class="search-result-item" data-search-view="team">
            <div class="search-result-left">
              <div class="avatar-circle ${m.color}" style="width:32px;height:32px;font-size:11.5px;">${m.initials.toUpperCase()}</div>
              <div style="min-width:0;">
                <div class="search-result-name">${m.name}</div>
                <div class="search-result-sub">${m.role} • ${m.region}</div>
              </div>
            </div>
            <span class="status-badge badge-completed" style="font-size:10.5px;">${m.active}</span>
          </div>
        `).join('');
      }

      if (q) {
        html += `
          <div style="padding:8px 14px 2px;text-align:center;border-top:1px solid #eef2f7;">
            <button type="button" class="dropdown-link-btn" id="viewAllSearchMatchesBtn">View all ${matchedPartners.length} matching partners in table →</button>
          </div>
        `;
      }
    }

    globalSearchDropdown.innerHTML = html;
    globalSearchDropdown.classList.add('open');

    // Quick filter chips inside search dropdown
    globalSearchDropdown.querySelectorAll('[data-quick-q]').forEach(chip => {
      chip.addEventListener('click', (e) => {
        e.stopPropagation();
        const chipQ = chip.getAttribute('data-quick-q');
        globalSearchInput.value = chipQ;
        state.pagination.partnersPage = 1;
        renderGlobalSearchDropdown(chipQ);
        switchView('partners-all', chipQ);
      });
    });

    // Clicking a partner row in the search dropdown
    globalSearchDropdown.querySelectorAll('[data-search-partner]').forEach(row => {
      row.addEventListener('click', (e) => {
        if (e.target.closest('[data-wa]')) return;
        const pName = row.getAttribute('data-search-partner');
        globalSearchDropdown.classList.remove('open');
        state.pagination.partnersPage = 1;
        switchView('partners-all', pName);
      });
    });

    // Clicking a campaign or team row in the search dropdown
    globalSearchDropdown.querySelectorAll('[data-search-view]').forEach(row => {
      row.addEventListener('click', () => {
        const target = row.getAttribute('data-search-view');
        globalSearchDropdown.classList.remove('open');
        switchView(target);
      });
    });

    document.getElementById('viewAllSearchMatchesBtn')?.addEventListener('click', () => {
      globalSearchDropdown.classList.remove('open');
      state.pagination.partnersPage = 1;
      switchView('partners-all', q);
    });

    document.getElementById('searchAddNewPartnerBtn')?.addEventListener('click', () => {
      globalSearchDropdown.classList.remove('open');
      openAddPartnerModal();
      const nameInput = modalContent.querySelector('input[name="name"]');
      if (nameInput) nameInput.value = q;
    });
  }

  globalSearchInput?.addEventListener('focus', () => {
    renderGlobalSearchDropdown(globalSearchInput.value);
  });

  globalSearchInput?.addEventListener('input', (e) => {
    const q = e.target.value;
    state.pagination.partnersPage = 1;
    renderGlobalSearchDropdown(q);
    if (q.trim().length > 0) {
      switchView('partners-all', q.trim());
    } else if (state.currentView === 'partners-all') {
      renderPartnersView('All', '');
    }
  });

  globalSearchInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      globalSearchDropdown?.classList.remove('open');
      const q = globalSearchInput.value.trim();
      state.pagination.partnersPage = 1;
      switchView('partners-all', q);
    } else if (e.key === 'Escape') {
      globalSearchDropdown?.classList.remove('open');
    }
  });

  clearSearchBtn?.addEventListener('click', () => {
    globalSearchInput.value = '';
    clearSearchBtn.style.display = 'none';
    globalSearchDropdown?.classList.remove('open');
    state.pagination.partnersPage = 1;
    if (state.currentView === 'partners-all') {
      renderPartnersView('All', '');
    }
    globalSearchInput.focus();
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('#globalSearchBox')) {
      globalSearchDropdown?.classList.remove('open');
    }
  });

  // ---- MODALS FOR TOP 3 BUTTONS ----
  function closeModal() {
    modalBackdrop.style.display = 'none';
  }

  modalBackdrop?.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) closeModal();
  });

  function openAddPartnerModal() {
    modalContent.innerHTML = `
      <div class="modal-header">
        <h3>Add New Partner</h3>
        <button class="modal-close" id="closeModalBtn">✕</button>
      </div>
      <form id="addPartnerForm">
        <div class="form-group">
          <label>Partner Name *</label>
          <input type="text" name="name" placeholder="e.g. Dr. Nair / Prana Ayurveda Clinic" required />
        </div>
        <div class="form-group">
          <label>Partner Category *</label>
          <select name="type">
            <option value="Doctors">Doctor</option>
            <option value="Clinics">Clinic</option>
            <option value="Hospitals">Hospital</option>
          </select>
        </div>
        <div class="form-group">
          <label>System of Medicine / Specialty *</label>
          <input type="text" name="specialty" placeholder="e.g. Ayurveda, Homeopathy, Siddha" required />
        </div>
        <div class="form-group">
          <label>City / Location *</label>
          <input type="text" name="city" placeholder="e.g. Trivandrum, Kochi, Kozhikode" required />
        </div>
        <div class="form-group">
          <label>WhatsApp / Phone Number *</label>
          <input type="text" name="phone" placeholder="+91 98470 00000" value="+91 " required />
        </div>
        <div class="modal-actions" style="justify-content:space-between;">
          <button type="button" class="btn btn-outline" id="cancelModalBtn">Cancel</button>
          <div style="display:flex;gap:8px;">
            <button type="submit" class="btn btn-primary" data-send-wa="false">Save Partner</button>
            <button type="submit" class="btn btn-whatsapp" id="saveAndWaBtn">Save &amp; WhatsApp</button>
          </div>
        </div>
      </form>
    `;
    modalBackdrop.style.display = 'flex';
    document.getElementById('closeModalBtn').onclick = closeModal;
    document.getElementById('cancelModalBtn').onclick = closeModal;

    let openWaAfterSave = false;
    document.getElementById('saveAndWaBtn').onclick = () => {
      openWaAfterSave = true;
    };

    document.getElementById('addPartnerForm').onsubmit = (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const name = fd.get('name').toString().trim();
      const type = fd.get('type').toString();
      const specialty = fd.get('specialty').toString().trim();
      const city = fd.get('city').toString().trim();
      const phone = fd.get('phone').toString().trim();
      const initials = name.replace(/^Dr\.\s*/i, '').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'PR';

      state.partners.unshift({
        id: Date.now(),
        initials,
        color: type === 'Doctors' ? 'avatar-blue' : type === 'Clinics' ? 'avatar-green' : 'avatar-purple',
        name,
        type,
        specialty,
        city,
        phone,
        status: 'New Lead',
        badge: 'badge-newlead',
        followup: 'Today, 5:00 PM'
      });

      persistState();

      state.counts.total++;
      if (type === 'Doctors') state.counts.doctors++;
      if (type === 'Clinics') state.counts.clinics++;
      if (type === 'Hospitals') state.counts.hospitals++;

      document.getElementById('kpiTotalPartners').textContent = state.counts.total.toLocaleString();
      document.getElementById('kpiDoctors').textContent = state.counts.doctors.toLocaleString();
      document.getElementById('kpiClinics').textContent = state.counts.clinics.toLocaleString();
      document.getElementById('kpiHospitals').textContent = state.counts.hospitals.toLocaleString();

      state.pagination.partnersPage = 1;
      state.pagination.followupsPage = 1;
      state.pagination.dashFollowupsPage = 1;
      renderDashboardFollowups();
      closeModal();
      showToast(`Added ${name} to ${type}!`);
      if (state.currentView !== 'dashboard') switchView(state.currentView);

      if (openWaAfterSave) {
        openDirectWhatsAppModal(name, phone);
      }
    };
  }

  function openNewFollowupModal() {
    modalContent.innerHTML = `
      <div class="modal-header">
        <h3>Schedule New Follow-up</h3>
        <button class="modal-close" id="closeModalBtn">✕</button>
      </div>
      <form id="newFollowupForm">
        <div class="form-group">
          <label>Quick Select Existing Partner (Optional)</label>
          <select id="followupExistingSelect">
            <option value="">-- Or type a new partner below --</option>
            ${state.partners.map(p => `<option value="${p.id}">${p.name} (${p.specialty} • ${p.city})</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label>Partner / Doctor / Clinic Name *</label>
          <input type="text" name="name" id="fuNameInput" placeholder="e.g. Dr. Meera Varma" required />
        </div>
        <div class="form-group">
          <label>Specialty &amp; City *</label>
          <input type="text" name="sub" id="fuSubInput" placeholder="e.g. Ayurveda • Thrissur" required />
        </div>
        <div class="form-group">
          <label>WhatsApp / Phone Number *</label>
          <input type="text" name="phone" id="fuPhoneInput" value="+91 98470 99000" required />
        </div>
        <div class="form-group">
          <label>Follow-up Date &amp; Time *</label>
          <input type="text" name="time" value="Tomorrow, 11:30 AM" required />
        </div>
        <div class="form-group">
          <label>Lead Stage</label>
          <select name="status" id="fuStatusInput">
            <option value="Interested">Interested</option>
            <option value="Contacted">Contacted</option>
            <option value="Meeting">Meeting</option>
            <option value="New Lead">New Lead</option>
          </select>
        </div>
        <div class="modal-actions" style="justify-content:space-between;">
          <button type="button" class="btn btn-outline" id="cancelModalBtn">Cancel</button>
          <div style="display:flex;gap:8px;">
            <button type="submit" class="btn btn-primary">Schedule Follow-up</button>
            <button type="submit" class="btn btn-whatsapp" id="scheduleAndWaBtn">Schedule &amp; WhatsApp</button>
          </div>
        </div>
      </form>
    `;
    modalBackdrop.style.display = 'flex';
    document.getElementById('closeModalBtn').onclick = closeModal;
    document.getElementById('cancelModalBtn').onclick = closeModal;

    const existingSel = document.getElementById('followupExistingSelect');
    existingSel?.addEventListener('change', (e) => {
      const pid = Number(e.target.value);
      const found = state.partners.find(x => x.id === pid);
      if (found) {
        document.getElementById('fuNameInput').value = found.name;
        document.getElementById('fuSubInput').value = `${found.specialty} • ${found.city}`;
        document.getElementById('fuPhoneInput').value = found.phone;
      }
    });

    let sendWaReminder = false;
    document.getElementById('scheduleAndWaBtn').onclick = () => {
      sendWaReminder = true;
    };

    document.getElementById('newFollowupForm').onsubmit = (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const name = fd.get('name').toString().trim();
      const sub = fd.get('sub').toString().trim();
      const phone = fd.get('phone').toString().trim();
      const parts = sub.split('•').map(s => s.trim());
      const specialty = parts[0] || sub;
      const city = parts[1] || 'Kerala';
      const time = fd.get('time').toString().trim();
      const status = fd.get('status').toString();
      const initials = name.replace(/^Dr\.\s*/i, '').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'FU';
      const badgeMap = {
        'Interested': 'badge-interested',
        'Contacted': 'badge-contacted',
        'Meeting': 'badge-meeting',
        'New Lead': 'badge-newlead'
      };

      const existing = state.partners.find(p => p.name.toLowerCase() === name.toLowerCase());
      if (existing) {
        existing.followup = time;
        existing.status = status;
        existing.badge = badgeMap[status] || 'badge-interested';
        existing.phone = phone;
      } else {
        state.partners.unshift({
          id: Date.now(),
          initials,
          color: 'avatar-blue',
          name,
          type: 'Doctors',
          specialty,
          city,
          phone,
          status,
          badge: badgeMap[status] || 'badge-interested',
          followup: time
        });
      }

      persistState();

      state.pagination.followupsPage = 1;
      state.pagination.dashFollowupsPage = 1;
      renderDashboardFollowups();
      closeModal();
      showToast(`Scheduled follow-up with ${name} (${time})`);
      if (state.currentView === 'followups') renderFollowupsView();

      if (sendWaReminder) {
        openDirectWhatsAppModal(name, phone);
      }
    };
  }

  function openWaCampaignModal(prefillTitle = '', prefillSegment = 'Doctors', prefillTemplate = '') {
    const safeTitle = typeof prefillTitle === 'string' ? prefillTitle : '';
    const defaultTpl = prefillTemplate || 'Namaste {{1}}, join AyushDoc+ Partner Network to digitize appointments & patient records. Contact our WhatsApp desk at +91 98470 99880 or reply YES for a 5-min demo.';
    modalContent.innerHTML = `
      <div class="modal-header">
        <h3>Launch WhatsApp Campaign</h3>
        <button class="modal-close" id="closeModalBtn">✕</button>
      </div>
      <form id="waCampaignForm">
        <div class="form-group">
          <label>Campaign Title *</label>
          <input type="text" name="title" value="${safeTitle}" placeholder="e.g. Kerala Ayurveda Summit Invite" required />
        </div>
        <div class="form-group">
          <label>Target Partner Segment *</label>
          <select name="segment">
            <option value="Doctors" ${prefillSegment === 'Doctors' ? 'selected' : ''}>Doctors (876 recipients)</option>
            <option value="Clinics" ${prefillSegment === 'Clinics' ? 'selected' : ''}>Clinics (258 recipients)</option>
            <option value="Hospitals" ${prefillSegment === 'Hospitals' ? 'selected' : ''}>Hospitals (114 recipients)</option>
            <option value="All Partners" ${prefillSegment === 'All Partners' ? 'selected' : ''}>All Partners (1,248 recipients)</option>
          </select>
        </div>
        <div class="form-group">
          <label>Share Official WhatsApp Helpline Number in Campaign</label>
          <input type="text" name="sharePhone" id="campSharePhone" value="+91 98470 99880" />
        </div>
        <div class="form-group">
          <label>Approved WABA Template</label>
          <textarea name="template" id="campTemplateText" rows="3">${defaultTpl}</textarea>
        </div>
        <div class="modal-actions">
          <button type="button" class="btn btn-outline" id="cancelModalBtn">Cancel</button>
          <button type="submit" class="btn btn-whatsapp">Launch Campaign via WhatsApp API</button>
        </div>
      </form>
    `;
    modalBackdrop.style.display = 'flex';
    document.getElementById('closeModalBtn').onclick = closeModal;
    document.getElementById('cancelModalBtn').onclick = closeModal;

    document.getElementById('waCampaignForm').onsubmit = (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const title = fd.get('title').toString().trim();
      const segment = fd.get('segment').toString();
      const sent = segment === 'Doctors' ? 876 : segment === 'Clinics' ? 258 : segment === 'Hospitals' ? 114 : 1248;
      const delivered = Math.round(sent * 0.92);
      const read = Math.round(delivered * 0.78);
      const replied = Math.round(read * 0.18);

      state.campaigns.unshift({
        title,
        segment,
        date: 'Nov 3, 2026',
        status: 'Completed',
        sent,
        delivered,
        read,
        replied
      });

      persistState();

      state.pagination.campaignsPage = 1;
      state.pagination.dashCampaignsPage = 1;
      renderDashboardCampaigns();
      closeModal();
      showToast(`WhatsApp Campaign "${title}" launched to ${sent} partners!`);
      if (state.currentView === 'campaigns') {
        renderCampaignsView('All');
      } else if (state.currentView === 'reports') {
        renderReportsView();
      }
    };
  }

  // ---- DIRECT WHATSAPP MESSAGE & NUMBER SHARING MODAL ----
  function openDirectWhatsAppModal(partnerName, partnerPhone) {
    const partnerObj = state.partners.find(p => p.name === partnerName);
    const defaultPhone = partnerPhone || partnerObj?.phone || '+91 98470 11223';
    const defaultShareNumber = '+91 98470 99880';

    modalContent.innerHTML = `
      <div class="modal-header">
        <h3 style="display:flex;align-items:center;gap:8px;">
          <span style="width:22px;height:22px;display:inline-flex;">${waSvgIcon}</span>
          <span>Send WhatsApp Message</span>
        </h3>
        <button class="modal-close" id="closeModalBtn">✕</button>
      </div>
      <form id="directWaForm">
        <div class="form-group">
          <label>Partner / Recipient Name</label>
          <input type="text" id="waRecipName" value="${partnerName}" readonly style="background:#f8fafc;font-weight:700;" />
        </div>
        <div class="form-group">
          <label>Recipient WhatsApp Number *</label>
          <input type="text" id="waRecipPhone" value="${defaultPhone}" placeholder="+91 98470 00000" required />
        </div>
        <div class="form-group">
          <label>WhatsApp Number to Share in Message (Contact / Support Number)</label>
          <div style="display:flex;gap:8px;">
            <input type="text" id="waSharePhone" value="${defaultShareNumber}" placeholder="Enter WhatsApp number to share..." style="flex:1;" />
            <button type="button" class="filter-tab" id="insertShareNumBtn" style="white-space:nowrap;background:#eff6ff;color:#0b57d0;border-color:#bfdbfe;">+ Insert Number</button>
          </div>
        </div>
        <div class="form-group">
          <label>Quick Message Templates</label>
          <div class="template-chips">
            <button type="button" class="template-chip" data-tpl="share-num">📲 Share WhatsApp Number</button>
            <button type="button" class="template-chip" data-tpl="onboard">🤝 Onboarding Invite</button>
            <button type="button" class="template-chip" data-tpl="followup">📅 Follow-up Reminder</button>
          </div>
          <textarea id="waMessageText" rows="4" required>Namaste ${partnerName}, greetings from AyushDoc+ Partner CRM! You can reach our dedicated Partner Onboarding desk directly on WhatsApp at ${defaultShareNumber} (https://wa.me/${defaultShareNumber.replace(/[^0-9]/g, '')}) for quick verification and support.</textarea>
        </div>
        <div class="modal-actions" style="justify-content:space-between;">
          <button type="button" class="btn btn-outline" id="cancelModalBtn">Cancel</button>
          <div style="display:flex;gap:8px;">
            <button type="button" class="btn btn-primary" id="sendViaWabaBtn">Send via CRM API</button>
            <button type="submit" class="btn btn-whatsapp">Open WhatsApp &amp; Send</button>
          </div>
        </div>
      </form>
    `;

    modalBackdrop.style.display = 'flex';
    document.getElementById('closeModalBtn').onclick = closeModal;
    document.getElementById('cancelModalBtn').onclick = closeModal;

    const shareInput = document.getElementById('waSharePhone');
    const msgBox = document.getElementById('waMessageText');
    const recipPhoneInput = document.getElementById('waRecipPhone');

    // Insert shared WhatsApp number into message textarea
    document.getElementById('insertShareNumBtn').onclick = () => {
      const num = shareInput.value.trim();
      const cleanNum = num.replace(/[^0-9]/g, '');
      const waLink = cleanNum ? ` (https://wa.me/${cleanNum})` : '';
      msgBox.value = msgBox.value.trim() + `\n📲 Connect on WhatsApp: ${num}${waLink}`;
      msgBox.focus();
      showToast(`Inserted WhatsApp number ${num} into message!`);
    };

    // Template chips
    modalContent.querySelectorAll('[data-tpl]').forEach(chip => {
      chip.addEventListener('click', () => {
        const tpl = chip.getAttribute('data-tpl');
        const num = shareInput.value.trim();
        const cleanNum = num.replace(/[^0-9]/g, '');
        if (tpl === 'share-num') {
          msgBox.value = `Namaste ${partnerName}, greetings from AyushDoc+ Partner CRM! Please save & message our official WhatsApp number ${num} (https://wa.me/${cleanNum}) for direct partner assistance.`;
        } else if (tpl === 'onboard') {
          msgBox.value = `Namaste ${partnerName}, we invite you to join the AyushDoc+ Partner Network. For instant onboarding support, WhatsApp us at ${num} (https://wa.me/${cleanNum}).`;
        } else if (tpl === 'followup') {
          msgBox.value = `Namaste ${partnerName}, this is a friendly reminder regarding our scheduled AyushDoc+ follow-up. Feel free to message or share documents on our WhatsApp number: ${num}.`;
        }
      });
    });

    // Update message automatically if user edits the shared WhatsApp number
    shareInput.addEventListener('input', () => {
      const num = shareInput.value.trim();
      const cleanNum = num.replace(/[^0-9]/g, '');
      msgBox.value = `Namaste ${partnerName}, greetings from AyushDoc+ Partner CRM! You can reach our dedicated Partner Onboarding desk directly on WhatsApp at ${num} (https://wa.me/${cleanNum}) for quick verification and support.`;
    });

    // Send via CRM WABA API button
    document.getElementById('sendViaWabaBtn').onclick = () => {
      const updatedRecipPhone = recipPhoneInput.value.trim();
      if (partnerObj && updatedRecipPhone) {
        partnerObj.phone = updatedRecipPhone;
        persistState();
      }
      closeModal();
      showToast(`✅ WhatsApp message with contact number ${shareInput.value.trim()} sent to ${partnerName} (${updatedRecipPhone})!`);
      if (state.currentView !== 'dashboard') switchView(state.currentView);
    };

    // Open real WhatsApp (wa.me) with recipient number & message
    document.getElementById('directWaForm').onsubmit = (e) => {
      e.preventDefault();
      const updatedRecipPhone = recipPhoneInput.value.trim();
      if (partnerObj && updatedRecipPhone) {
        partnerObj.phone = updatedRecipPhone;
        persistState();
      }
      const cleanTargetPhone = updatedRecipPhone.replace(/[^0-9]/g, '');
      const encodedMsg = encodeURIComponent(msgBox.value.trim());
      const waUrl = `https://wa.me/${cleanTargetPhone}?text=${encodedMsg}`;
      window.open(waUrl, '_blank', 'noopener,noreferrer');
      closeModal();
      showToast(`💬 Opened WhatsApp chat for ${partnerName} (${updatedRecipPhone})!`);
      if (state.currentView !== 'dashboard') switchView(state.currentView);
    };
  }

  document.getElementById('openAddPartnerBtn')?.addEventListener('click', openAddPartnerModal);
  document.getElementById('openNewFollowupBtn')?.addEventListener('click', openNewFollowupModal);
  document.getElementById('openWaCampaignBtn')?.addEventListener('click', () => openWaCampaignModal());

  // Delegated WhatsApp button listener
  document.body.addEventListener('click', (e) => {
    const waBtn = e.target.closest('[data-wa]');
    if (waBtn) {
      const name = waBtn.getAttribute('data-wa');
      const phone = waBtn.getAttribute('data-wa-phone') || '';
      openDirectWhatsAppModal(name, phone);
    }
  });
});
