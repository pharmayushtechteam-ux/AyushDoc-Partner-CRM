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

  // ---- LEAD STATUS & SETTLEMENT HELPERS ----
  const LEAD_STATUSES = ['New Lead', 'Contacted', 'Interested', 'Meeting', 'Onboarded', 'Lost'];

  const STATUS_BADGE_MAP = {
    'New Lead': 'badge-newlead',
    'Contacted': 'badge-contacted',
    'Interested': 'badge-interested',
    'Meeting': 'badge-meeting',
    'Onboarded': 'badge-completed',
    'Lost': 'badge-lost'
  };

  const STATUS_SELECT_CLASS = {
    'New Lead': 'st-new',
    'Contacted': 'st-contacted',
    'Interested': 'st-interested',
    'Meeting': 'st-meeting',
    'Onboarded': 'st-onboarded',
    'Lost': 'st-lost'
  };

  function formatINR(val) {
    const num = Number(val) || 0;
    return '₹' + Math.round(num).toLocaleString('en-IN');
  }

  function todayISO() {
    return new Date().toISOString().slice(0, 10);
  }

  function computeSettlementMetrics(s) {
    const dealValue = Math.max(0, Number(s?.dealValue) || 0);
    const commissionPct = Math.max(0, Math.min(100, Number(s?.commissionPct ?? 10)));
    const commissionAmount = Math.round((dealValue * commissionPct) / 100);
    const paidAmount = Math.max(0, Math.min(dealValue, Number(s?.paidAmount) || 0));
    const pendingAmount = Math.max(0, dealValue - paidAmount);
    let settlementStatus = 'Unsettled';
    if (dealValue > 0 && pendingAmount === 0) settlementStatus = 'Settled';
    else if (paidAmount > 0 && pendingAmount > 0) settlementStatus = 'Partial';
    const settledPct = dealValue > 0 ? Math.round((paidAmount / dealValue) * 100) : 0;
    return { dealValue, commissionPct, commissionAmount, paidAmount, pendingAmount, settlementStatus, settledPct };
  }

  function cleanPhoneString(raw) {
    let s = String(raw || '').trim();
    const m = s.match(/^=\s*"([^"]+)"$/) || s.match(/^=\s*'([^']+)'$/);
    if (m) s = m[1].trim();
    return s.replace(/^["'=]+|["']+$/g, '').trim();
  }

  function normalizePartner(p, idx = 0) {
    const sources = ['WhatsApp Campaign', 'Website', 'CSV Upload', 'Field Referral', 'Manual Entry'];
    const owners = ['Rahul Krishnan', 'Sneha Nair', 'Arjun Menon', 'Kiran Panicker', 'Neha Raj'];
    const baseDates = [
      '2026-11-24', '2026-11-22', '2026-11-20', '2026-11-18', '2026-11-15',
      '2026-11-12', '2026-11-10', '2026-11-08', '2026-11-06', '2026-11-04',
      '2026-11-02', '2026-10-30', '2026-10-27', '2026-10-24', '2026-10-20', '2026-10-16'
    ];
    const defaultDeal = p.type === 'Hospitals' ? 120000 : p.type === 'Clinics' ? 55000 : 25000;
    const defaultPaid = p.status === 'Onboarded'
      ? defaultDeal
      : p.status === 'Meeting'
        ? Math.round(defaultDeal * 0.5)
        : p.status === 'Interested'
          ? Math.round(defaultDeal * 0.25)
          : 0;

    const existingSettlement = p.settlement || {};
    const dealValue = existingSettlement.dealValue !== undefined ? Number(existingSettlement.dealValue) : defaultDeal;
    const paidAmount = existingSettlement.paidAmount !== undefined ? Number(existingSettlement.paidAmount) : defaultPaid;
    const commissionPct = existingSettlement.commissionPct !== undefined ? Number(existingSettlement.commissionPct) : 12;
    const createdDate = p.createdDate || baseDates[idx % baseDates.length];
    const defaultTx = paidAmount > 0 && !existingSettlement.transactions
      ? [{
          id: `TX-${p.id || idx}-1`,
          date: createdDate,
          amount: paidAmount,
          mode: p.status === 'Onboarded' ? 'NEFT/RTGS' : 'UPI',
          utr: `AYU${String(261100 + (idx * 37)).slice(-6)}`,
          note: paidAmount >= dealValue ? 'Full onboarding settlement received' : 'Initial advance settlement'
        }]
      : (existingSettlement.transactions || []);

    const metrics = computeSettlementMetrics({ dealValue, commissionPct, paidAmount });
    const status = LEAD_STATUSES.includes(p.status) ? p.status : 'New Lead';

    return {
      ...p,
      phone: cleanPhoneString(p.phone || ''),
      status,
      badge: STATUS_BADGE_MAP[status] || 'badge-newlead',
      leadSource: p.leadSource || sources[idx % sources.length],
      assignedTo: p.assignedTo || owners[idx % owners.length],
      createdDate,
      statusHistory: Array.isArray(p.statusHistory) && p.statusHistory.length > 0
        ? p.statusHistory
        : [{ status, date: createdDate, note: 'Lead recorded in AyushDoc+ CRM' }],
      settlement: {
        ...metrics,
        paymentMode: existingSettlement.paymentMode || (defaultTx[0]?.mode || ''),
        utrNumber: existingSettlement.utrNumber || (defaultTx[0]?.utr || ''),
        settledDate: existingSettlement.settledDate || (metrics.settlementStatus === 'Settled' ? createdDate : ''),
        notes: existingSettlement.notes || '',
        transactions: defaultTx
      }
    };
  }

  function deduplicatePartners(list) {
    const seen = new Set();
    const out = [];
    for (const p of list) {
      const nameKey = (p.name || '').trim().toLowerCase();
      const cityKey = (p.city || '').trim().toLowerCase();
      const phoneKey = (p.phone || '').replace(/[^0-9]/g, '');
      const keyByNameCity = `${nameKey}|${cityKey}`;
      const keyByNamePhone = phoneKey.length >= 7 ? `${nameKey}|${phoneKey}` : '';
      if (seen.has(keyByNameCity) || (keyByNamePhone && seen.has(keyByNamePhone))) {
        continue;
      }
      seen.add(keyByNameCity);
      if (keyByNamePhone) seen.add(keyByNamePhone);
      out.push(p);
    }
    return out;
  }

  // Load saved partners/campaigns/uploads from localStorage if available
  const savedPartners = JSON.parse(localStorage.getItem('ayush_crm_partners') || 'null');
  const savedCampaigns = JSON.parse(localStorage.getItem('ayush_crm_campaigns') || 'null');
  const savedUploads = JSON.parse(localStorage.getItem('ayush_crm_uploads') || 'null');
  const normalizedInitialPartners = (savedPartners || defaultPartners).map((p, i) => normalizePartner(p, i));
  const cleanedInitialPartners = deduplicatePartners(normalizedInitialPartners);
  if (savedPartners && cleanedInitialPartners.length !== savedPartners.length) {
    localStorage.setItem('ayush_crm_partners', JSON.stringify(cleanedInitialPartners));
  }

  const defaultUploadHistory = [
    { id: 1, date: '2026-11-22 10:15 AM', fileName: 'kerala_ayurveda_doctors_nov.csv', source: 'CSV Upload', imported: 8, skipped: 1 },
    { id: 2, date: '2026-11-15 04:40 PM', fileName: 'kochi_clinics_batch.csv', source: 'CSV Upload', imported: 5, skipped: 0 }
  ];

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
      leadsPage: 1,
      leadsPageSize: 10,
      followupsPage: 1,
      followupsPageSize: 5,
      campaignsPage: 1,
      campaignsPageSize: 5,
      teamPage: 1,
      teamPageSize: 5,
      settlementsPage: 1,
      settlementsPageSize: 8,
      reportsPage: 1,
      reportsPageSize: 8,
      uploadPreviewPage: 1,
      uploadPreviewPageSize: 5,
      uploadHistoryPage: 1,
      uploadHistoryPageSize: 5
    },
    leadsFilter: {
      status: 'All',
      category: 'All',
      settlement: 'All',
      sortBy: 'default',
      search: '',
      onlyLatestBatch: false
    },
    settlementFilter: {
      status: 'All',
      search: ''
    },
    reportFilter: {
      status: 'All',
      category: 'All',
      settlement: 'All',
      source: 'All',
      fromDate: '',
      toDate: ''
    },
    pendingUploadRows: [],
    pendingUploadFileName: '',
    lastUploadedBatch: null,
    pasteCsvText: '',
    partners: cleanedInitialPartners,
    campaigns: savedCampaigns || defaultCampaigns,
    uploadHistory: savedUploads || defaultUploadHistory,
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
    localStorage.setItem('ayush_crm_uploads', JSON.stringify(state.uploadHistory));
  }

  function updateLeadStatus(partnerId, newStatus, note = '', preserveFollowup = false) {
    const partner = state.partners.find(p => p.id === partnerId);
    if (!partner || !LEAD_STATUSES.includes(newStatus)) return;
    const prevStatus = partner.status;
    partner.status = newStatus;
    partner.badge = STATUS_BADGE_MAP[newStatus] || 'badge-newlead';
    if (newStatus === 'Onboarded' && !preserveFollowup) partner.followup = 'Completed';
    if (!Array.isArray(partner.statusHistory)) partner.statusHistory = [];
    partner.statusHistory.unshift({
      status: newStatus,
      date: todayISO(),
      note: note || `Status updated from ${prevStatus} to ${newStatus}`
    });
    persistState();
    syncDashboardCounts();
    renderDashboardFollowups();
  }

  function refreshCurrentView() {
    syncDashboardCounts();
    renderDashboardFollowups();
    if (state.currentView === 'leads') renderLeadsView();
    else if (state.currentView === 'settlements') renderSettlementsView();
    else if (state.currentView === 'leads-reports') renderLeadsReportsView();
    else if (state.currentView === 'leads-upload') renderLeadsUploadView();
    else if (state.currentView === 'partners-all') renderPartnersView('All', globalSearchInput?.value?.trim() || '');
    else if (state.currentView === 'doctors') renderPartnersView('Doctors', globalSearchInput?.value?.trim() || '');
    else if (state.currentView === 'clinics') renderPartnersView('Clinics', globalSearchInput?.value?.trim() || '');
    else if (state.currentView === 'hospitals') renderPartnersView('Hospitals', globalSearchInput?.value?.trim() || '');
    else if (state.currentView === 'followups') renderFollowupsView();
  }

  function syncDashboardCounts() {
    const setEl = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = val.toLocaleString();
    };
    const countByStatus = (st) => state.partners.filter(p => p.status === st).length;
    setEl('pipeNewLeads', countByStatus('New Lead'));
    setEl('pipeContacted', countByStatus('Contacted'));
    setEl('pipeInterested', countByStatus('Interested'));
    setEl('pipeMeeting', countByStatus('Meeting'));
    setEl('pipeOnboarded', countByStatus('Onboarded'));
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

  function buildWindowedPagesHTML(currentPage, totalPages, dataAttr, extraStyle = '') {
    const pages = [];
    if (totalPages <= 7) {
      for (let p = 1; p <= totalPages; p++) pages.push(p);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let p = start; p <= end; p++) pages.push(p);
      if (currentPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    const styleAttr = extraStyle ? ` style="${extraStyle}"` : '';
    return pages.map(p => {
      if (p === '...') return `<span class="page-ellipsis">…</span>`;
      return `<button class="page-btn ${p === currentPage ? 'active' : ''}"${styleAttr} ${dataAttr}="${p}">${p}</button>`;
    }).join('');
  }

  function renderPaginationBarHTML(pager, pageSize, prefix) {
    const pageButtonsHTML = buildWindowedPagesHTML(pager.currentPage, pager.totalPages, `data-${prefix}-page`);

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
              <option value="25" ${pageSize === 25 ? 'selected' : ''}>25</option>
              <option value="50" ${pageSize === 50 ? 'selected' : ''}>50</option>
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
          <button type="button" class="fu-inline-edit-btn" data-edit-followup="${p.id}" title="Click to fix / schedule follow-up date">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <span>${p.followup}</span>
          </button>
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
          ${buildWindowedPagesHTML(pager.currentPage, pager.totalPages, 'data-dash-fu-page', 'height:28px;min-width:28px;font-size:12px;')}
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
          ${buildWindowedPagesHTML(pager.currentPage, pager.totalPages, 'data-dash-camp-page', 'height:28px;min-width:28px;font-size:12px;')}
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
  syncDashboardCounts();

  // ---- VIEW NAVIGATION ----
  const viewMeta = {
    'dashboard': {
      title: 'Welcome to <span class="text-green">AyushDoc CRM</span> <span class="wave-emoji">👋</span>',
      sub: 'Manage doctors, clinics and hospitals, track follow-ups and run WhatsApp campaigns.',
      actions: ['add-partner', 'new-followup', 'wa-campaign']
    },
    'partners-all': {
      title: 'All <span class="text-green">Partners Directory</span>',
      sub: 'Browse, filter, and manage all onboarded and prospective Doctors, Clinics, and Hospitals.',
      actions: ['add-partner']
    },
    'doctors': {
      title: 'Registered <span class="text-green">Doctors</span> (876)',
      sub: 'Manage Ayurveda, Homeopathy, Siddha, Unani & Naturopathy doctors across regions.',
      actions: ['add-partner']
    },
    'clinics': {
      title: 'Partner <span class="text-green">Clinics</span> (258)',
      sub: 'Track clinic partnerships, Panchakarma centers, and specialty outpatient clinics.',
      actions: ['add-partner']
    },
    'hospitals': {
      title: 'Partner <span class="text-green">Hospitals</span> (114)',
      sub: 'Manage multi-specialty AYUSH hospitals, inpatient facilities, and institutional tie-ups.',
      actions: ['add-partner']
    },
    'leads': {
      title: 'Leads &amp; <span class="text-green">Status Pipeline</span>',
      sub: 'Update lead stages inline, inspect status history, and track every lead through onboarding & settlement.',
      actions: ['add-partner', 'new-followup']
    },
    'leads-upload': {
      title: 'Bulk <span class="text-green">Leads Upload</span>',
      sub: 'Upload CSV/TSV lead sheets or paste rows, validate duplicates, and import directly into your CRM.',
      actions: []
    },
    'settlements': {
      title: 'Leads Full <span class="text-green">Settlement Tracking</span>',
      sub: 'Track deal values, partner commissions, partial/full payouts, UTR references, and pending balances.',
      actions: []
    },
    'leads-reports': {
      title: 'All Leads <span class="text-green">Reports &amp; Exports</span>',
      sub: 'Filter leads by status, category, settlement state, source & date range — export to CSV, Excel, or PDF.',
      actions: []
    },
    'followups': {
      title: 'Scheduled <span class="text-green">Follow-ups</span>',
      sub: 'Manage upcoming calls, demos, and WhatsApp check-ins with prospective partners.',
      actions: ['new-followup']
    },
    'campaigns': {
      title: 'WhatsApp <span class="text-green">Campaigns</span>',
      sub: 'Broadcast verified WhatsApp Business templates to Doctors, Clinics, and Hospitals.',
      actions: ['wa-campaign']
    },
    'reports': {
      title: 'Campaign <span class="text-green">Analytics &amp; Reports</span>',
      sub: 'Real-time delivery, read receipts, and reply conversion metrics via WhatsApp Business API.',
      actions: []
    },
    'automation': {
      title: 'Workflow <span class="text-green">Automation</span>',
      sub: 'Configure automated WhatsApp triggers, lead assignment rules, and meeting reminders.',
      actions: []
    },
    'user-management': {
      title: 'User <span class="text-green">Management &amp; Access Control</span>',
      sub: 'Manage CRM users, roles, granular module permissions, departments, teams, and security audit logs.',
      actions: []
    },
    'team': {
      title: 'Team &amp; <span class="text-green">Role Management</span>',
      sub: 'Manage CRM administrators, onboarding managers, and regional tele-calling executives.',
      actions: []
    },
    'settings': {
      title: 'CRM &amp; WABA <span class="text-green">Settings</span>',
      sub: 'Configure WhatsApp Business API credentials, templates, and organization preferences.',
      actions: []
    }
  };

  function syncHeaderActions(viewKey) {
    const allowed = new Set((viewMeta[viewKey]?.actions) || []);
    const wrap = document.querySelector('.welcome-actions');
    const btnMap = {
      'add-partner': document.getElementById('openAddPartnerBtn'),
      'new-followup': document.getElementById('openNewFollowupBtn'),
      'wa-campaign': document.getElementById('openWaCampaignBtn')
    };
    Object.entries(btnMap).forEach(([key, btn]) => {
      if (btn) btn.style.display = allowed.has(key) ? '' : 'none';
    });
    if (wrap) wrap.style.display = allowed.size > 0 ? '' : 'none';
  }
  syncHeaderActions(state.currentView);

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

  const CATEGORY_ORDER = { Doctors: 1, Clinics: 2, Hospitals: 3 };

  function sortPartnersOrderWise(list) {
    return [...list].sort((a, b) => {
      const oa = CATEGORY_ORDER[a.type] || 99;
      const ob = CATEGORY_ORDER[b.type] || 99;
      if (oa !== ob) return oa - ob;
      return 0;
    });
  }

  // ---- PAGINATED PARTNERS TABLE ----
  function renderPartnersView(filterType = 'All', searchQuery = '') {
    const filteredRaw = state.partners.filter(p => {
      const matchesType = filterType === 'All' || p.type === filterType;
      return matchesType && matchesPartnerQuery(p, searchQuery);
    });
    const filtered = filterType === 'All' ? sortPartnersOrderWise(filteredRaw) : filteredRaw;

    const pager = paginateArray(filtered, state.pagination.partnersPage, state.pagination.partnersPageSize);
    state.pagination.partnersPage = pager.currentPage;
    const batch = state.lastUploadedBatch;

    viewDynamic.innerHTML = `
      ${batch ? `
        <div class="panel-card" style="padding:14px 18px;border-color:#bbf7d0;background:#f0fdf4;">
          <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;">
            <div>
              <strong style="color:#15803d;font-size:13.5px;">✓ Auto-distributed "${batch.fileName}" order-wise into Partners Directory</strong>
              <div class="entity-sub" style="margin-top:3px;color:#166534;">
                Doctors: <strong>${batch.byCategory?.Doctors ?? 0}</strong> •
                Clinics: <strong>${batch.byCategory?.Clinics ?? 0}</strong> •
                Hospitals: <strong>${batch.byCategory?.Hospitals ?? 0}</strong>
                (${batch.added} new, ${batch.updated} updated — ordered Doctors → Clinics → Hospitals)
              </div>
            </div>
            <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
              <button type="button" class="action-pill-btn pill-blue" data-batch-nav="doctors">Doctors (${state.partners.filter(x => x.type === 'Doctors').length})</button>
              <button type="button" class="action-pill-btn pill-green" data-batch-nav="clinics">Clinics (${state.partners.filter(x => x.type === 'Clinics').length})</button>
              <button type="button" class="action-pill-btn" data-batch-nav="hospitals">Hospitals (${state.partners.filter(x => x.type === 'Hospitals').length})</button>
              <button type="button" class="action-pill-btn" data-batch-nav="leads">Leads &amp; Status →</button>
              <button type="button" class="action-pill-btn" id="dismissPartnersBatchBtn">✕</button>
            </div>
          </div>
        </div>
      ` : ''}
      <div class="panel-card">
        <div class="panel-header">
          <div class="filter-tabs">
            <button class="filter-tab ${filterType === 'All' ? 'active' : ''}" data-filter="All">All Partners (${state.partners.length})</button>
            <button class="filter-tab ${filterType === 'Doctors' ? 'active' : ''}" data-filter="Doctors">Doctors (${state.partners.filter(x => x.type === 'Doctors').length})</button>
            <button class="filter-tab ${filterType === 'Clinics' ? 'active' : ''}" data-filter="Clinics">Clinics (${state.partners.filter(x => x.type === 'Clinics').length})</button>
            <button class="filter-tab ${filterType === 'Hospitals' ? 'active' : ''}" data-filter="Hospitals">Hospitals (${state.partners.filter(x => x.type === 'Hospitals').length})</button>
          </div>
          <button type="button" class="btn btn-outline" id="partnersUploadShortcutBtn">📤 Upload Leads</button>
        </div>
        <div class="table-no-scroll">
          <table class="data-table">
            <thead>
              <tr>
                <th>Partner Name</th>
                <th>Category</th>
                <th>Specialty • City</th>
                <th>Phone</th>
                <th>Next Follow-up</th>
                <th>Status</th>
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
                  <td data-label="Phone / WhatsApp" style="white-space:nowrap;">${p.phone}</td>
                  <td data-label="Next Follow-up" style="white-space:nowrap;">📅 ${p.followup}</td>
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

    viewDynamic.querySelectorAll('[data-batch-nav]').forEach(btn => {
      btn.addEventListener('click', () => {
        state.pagination.partnersPage = 1;
        switchView(btn.getAttribute('data-batch-nav'));
      });
    });
    document.getElementById('dismissPartnersBatchBtn')?.addEventListener('click', () => {
      state.lastUploadedBatch = null;
      renderPartnersView(filterType, searchQuery);
    });
    document.getElementById('partnersUploadShortcutBtn')?.addEventListener('click', () => switchView('leads-upload'));

    bindPaginationEvents(viewDynamic, 'partners', 'partnersPage', 'partnersPageSize', () => {
      renderPartnersView(filterType, searchQuery);
    });
  }

  // ---- LEADS & STATUS PIPELINE VIEW (INTERACTIVE TABLE-FIRST) ----
  function renderLeadsView() {
    const stages = [
      { name: 'New Lead', key: 'New Lead', color: '#2563eb', soft: '#eff6ff', dot: '#3b82f6' },
      { name: 'Contacted', key: 'Contacted', color: '#0284c7', soft: '#f0f9ff', dot: '#0ea5e9' },
      { name: 'Interested', key: 'Interested', color: '#0d9488', soft: '#f0fdfa', dot: '#14b8a6' },
      { name: 'Meeting', key: 'Meeting', color: '#d97706', soft: '#fffbeb', dot: '#f59e0b' },
      { name: 'Onboarded', key: 'Onboarded', color: '#16a34a', soft: '#f0fdf4', dot: '#22c55e' },
      { name: 'Lost', key: 'Lost', color: '#dc2626', soft: '#fef2f2', dot: '#ef4444' }
    ];
    const stageOrder = { 'New Lead': 1, 'Contacted': 2, 'Interested': 3, 'Meeting': 4, 'Onboarded': 5, 'Lost': 0 };

    const filteredLeads = state.partners.filter(p => {
      const matchBatch = !state.leadsFilter.onlyLatestBatch || !state.lastUploadedBatch || p.uploadBatch === state.lastUploadedBatch.fileName;
      const matchSt = state.leadsFilter.status === 'All' || p.status === state.leadsFilter.status;
      const matchCat = state.leadsFilter.category === 'All' || p.type === state.leadsFilter.category;
      const matchSettle = state.leadsFilter.settlement === 'All' || p.settlement.settlementStatus === state.leadsFilter.settlement;
      const q = (state.leadsFilter.search || '').trim().toLowerCase();
      const matchQ = !q || matchesPartnerQuery(p, q) || (p.leadSource || '').toLowerCase().includes(q) || (p.assignedTo || '').toLowerCase().includes(q);
      return matchBatch && matchSt && matchCat && matchSettle && matchQ;
    });

    const sortedLeads = [...filteredLeads];
    if (state.leadsFilter.sortBy === 'name-asc') {
      sortedLeads.sort((a, b) => a.name.localeCompare(b.name));
    } else if (state.leadsFilter.sortBy === 'deal-desc') {
      sortedLeads.sort((a, b) => (b.settlement.dealValue || 0) - (a.settlement.dealValue || 0));
    } else if (state.leadsFilter.sortBy === 'stage-desc') {
      sortedLeads.sort((a, b) => (stageOrder[b.status] || 0) - (stageOrder[a.status] || 0));
    }

    const pager = paginateArray(sortedLeads, state.pagination.leadsPage, state.pagination.leadsPageSize);
    state.pagination.leadsPage = pager.currentPage;

    const hasActiveFilters = state.leadsFilter.onlyLatestBatch || state.leadsFilter.status !== 'All' || state.leadsFilter.category !== 'All' || state.leadsFilter.settlement !== 'All' || (state.leadsFilter.search || '').trim() !== '';

    const renderStageProgress = (status) => {
      if (status === 'Lost') {
        return `<div class="lp-progress-track" title="Marked as Lost"><span class="lp-progress-lost">Closed / Lost</span></div>`;
      }
      const step = stageOrder[status] || 1;
      const labels = ['New', 'Contacted', 'Interested', 'Meeting', 'Active'];
      return `
        <div class="lp-progress-track" title="Pipeline progress: ${step} of 5 (${status})">
          ${labels.map((lbl, idx) => `<span class="lp-step-dot ${idx + 1 <= step ? 'filled' : ''} ${idx + 1 === step ? 'current' : ''}" title="${lbl}"></span>`).join('')}
          <span class="lp-step-label">${step}/5</span>
        </div>
      `;
    };

    const renderFollowupChip = (followup, partnerId) => {
      const f = (followup || '').trim();
      const lower = f.toLowerCase();
      let cls = 'lp-followup-normal';
      let icon = '📅';
      if (lower === 'completed') {
        cls = 'lp-followup-done';
        icon = '✓';
      } else if (lower.startsWith('today') || lower.startsWith('tomorrow')) {
        cls = 'lp-followup-urgent';
        icon = '⏰';
      }
      return `<button type="button" class="lp-followup-chip ${cls} lp-followup-btn" data-edit-followup="${partnerId}" title="Click to fix / change next follow-up date">${icon} <span>${f || 'Set Date'}</span><span class="lp-fu-caret">▾</span></button>`;
    };

    const totalDealAll = state.partners.reduce((sum, p) => sum + (p.settlement.dealValue || 0), 0);

    viewDynamic.innerHTML = `
      <!-- Interactive Pipeline Stage Summary Strip -->
      <div class="lp-stage-strip" id="leadsStatusTabs">
        <button type="button" class="lp-stage-card ${state.leadsFilter.status === 'All' ? 'active' : ''}" data-lead-st="All" style="--stage-color:#0b57d0;--stage-soft:#eff6ff;">
          <div class="lp-stage-top">
            <span class="lp-stage-name">All Leads</span>
            <span class="lp-stage-count">${state.partners.length}</span>
          </div>
          <div class="lp-stage-meta">${formatINR(totalDealAll)} pipeline</div>
        </button>
        ${stages.map(s => {
          const stageItems = state.partners.filter(x => x.status === s.key);
          const stageValue = stageItems.reduce((sum, x) => sum + (x.settlement.dealValue || 0), 0);
          return `
            <button type="button" class="lp-stage-card ${state.leadsFilter.status === s.key ? 'active' : ''}" data-lead-st="${s.key}" style="--stage-color:${s.color};--stage-soft:${s.soft};">
              <div class="lp-stage-top">
                <span class="lp-stage-name"><span class="lp-stage-dot" style="background:${s.dot};"></span>${s.name}</span>
                <span class="lp-stage-count">${stageItems.length}</span>
              </div>
              <div class="lp-stage-meta">${formatINR(stageValue)}</div>
            </button>
          `;
        }).join('')}
      </div>

      <!-- Main Interactive Leads Workspace Card -->
      <div class="panel-card lp-main-card">
        <div class="lp-toolbar">
          <div class="lp-toolbar-left">
            <div class="lp-search-wrap">
              <span class="lp-search-icon">🔍</span>
              <input type="text" id="leadsInlineSearch" value="${state.leadsFilter.search || ''}" placeholder="Search name, phone, city, owner..." class="lp-search-input" />
              ${state.leadsFilter.search ? `<button type="button" class="lp-search-clear" id="leadsClearSearchBtn" title="Clear search">✕</button>` : ''}
            </div>
            <select id="leadsCategoryFilter" class="lp-filter-select" aria-label="Filter by category">
              <option value="All" ${state.leadsFilter.category === 'All' ? 'selected' : ''}>All Categories</option>
              <option value="Doctors" ${state.leadsFilter.category === 'Doctors' ? 'selected' : ''}>Doctors</option>
              <option value="Clinics" ${state.leadsFilter.category === 'Clinics' ? 'selected' : ''}>Clinics</option>
              <option value="Hospitals" ${state.leadsFilter.category === 'Hospitals' ? 'selected' : ''}>Hospitals</option>
            </select>
            <select id="leadsSettlementFilter" class="lp-filter-select" aria-label="Filter by settlement">
              <option value="All" ${state.leadsFilter.settlement === 'All' ? 'selected' : ''}>All Settlements</option>
              <option value="Unsettled" ${state.leadsFilter.settlement === 'Unsettled' ? 'selected' : ''}>Unsettled</option>
              <option value="Partial" ${state.leadsFilter.settlement === 'Partial' ? 'selected' : ''}>Partial</option>
              <option value="Settled" ${state.leadsFilter.settlement === 'Settled' ? 'selected' : ''}>Settled</option>
            </select>
            <select id="leadsSortSelect" class="lp-filter-select" aria-label="Sort leads">
              <option value="default" ${state.leadsFilter.sortBy === 'default' ? 'selected' : ''}>Sort: Default</option>
              <option value="name-asc" ${state.leadsFilter.sortBy === 'name-asc' ? 'selected' : ''}>Name (A–Z)</option>
              <option value="deal-desc" ${state.leadsFilter.sortBy === 'deal-desc' ? 'selected' : ''}>Deal Value (High–Low)</option>
              <option value="stage-desc" ${state.leadsFilter.sortBy === 'stage-desc' ? 'selected' : ''}>Stage Progress</option>
            </select>
            ${hasActiveFilters ? `<button type="button" class="lp-reset-btn" id="leadsResetFiltersBtn">Reset</button>` : ''}
          </div>

          <div class="lp-toolbar-right">
            <button class="btn btn-primary lp-compact-btn" id="leadsGoUploadBtn">📤 Upload</button>
            <button class="btn btn-outline lp-compact-btn" id="leadsGoSettleBtn">💳 Settlements</button>
            <button class="btn btn-outline lp-compact-btn" id="leadsGoReportsBtn">📊 Reports</button>
          </div>
        </div>

        ${state.lastUploadedBatch ? `
          <div class="lp-batch-banner">
            <div class="lp-batch-info">
              <span class="lp-batch-badge">✓ Uploaded</span>
              <span><strong>${state.lastUploadedBatch.fileName}</strong> — ${state.lastUploadedBatch.total} leads (${state.lastUploadedBatch.added} new, ${state.lastUploadedBatch.updated} synced)</span>
            </div>
            <div class="lp-batch-actions">
              <button type="button" class="lp-batch-btn ${state.leadsFilter.onlyLatestBatch ? 'active' : ''}" id="leadsToggleBatchBtn">
                ${state.leadsFilter.onlyLatestBatch ? '✓ Showing Uploaded Sheet Only (Show All)' : 'Show Only Uploaded Sheet Leads'}
              </button>
              <button type="button" class="lp-batch-btn" id="leadsUploadAnotherBtn">+ Upload Another Sheet</button>
              <button type="button" class="lp-batch-close" id="leadsDismissBatchBtn" title="Dismiss banner">✕</button>
            </div>
          </div>
        ` : ''}

        <div class="lp-table-wrap">
          <table class="data-table lp-leads-table">
            <thead>
              <tr>
                <th class="lp-col-lead">Partner / Lead</th>
                <th class="lp-col-contact">Contact</th>
                <th class="lp-col-stage">Stage</th>
                <th class="lp-col-deal">Deal &amp; Paid</th>
                <th class="lp-col-followup">Follow-up</th>
                <th class="lp-col-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${pager.pageItems.length === 0 ? `
                <tr>
                  <td colspan="6" class="lp-empty-cell">
                    <div class="lp-empty-box">
                      <div style="font-size:28px;">🔎</div>
                      <div style="font-weight:700;color:#0f2547;">No leads match your current filter</div>
                      <div style="font-size:13px;color:#64748b;">Try clearing your search or switching to another stage tab above.</div>
                      ${hasActiveFilters ? `<button type="button" class="btn btn-outline" id="leadsEmptyResetBtn" style="margin-top:6px;">Show All Leads</button>` : ''}
                    </div>
                  </td>
                </tr>
              ` : pager.pageItems.map(p => {
                const isActivePartner = p.status === 'Onboarded';
                const stBadge = p.settlement.settlementStatus === 'Settled'
                  ? 'badge-settled'
                  : p.settlement.settlementStatus === 'Partial'
                    ? 'badge-partial'
                    : 'badge-unsettled';
                const typeLabel = p.type.endsWith('s') ? p.type.slice(0, -1) : p.type;
                const pct = p.settlement.settledPct || 0;

                return `
                  <tr class="lp-row ${isActivePartner ? 'lp-row-active' : ''}">
                    <td data-label="Partner / Lead" class="td-primary lp-col-lead">
                      <div class="followup-entity">
                        <div class="avatar-circle ${p.color}">${p.initials}</div>
                        <div class="entity-info lp-entity-info">
                          <div class="lp-name-row">
                            <button type="button" class="lp-name-link" data-open-lead="${p.id}" title="${p.name}">${p.name}</button>
                            <span class="lp-type-pill">${typeLabel}</span>
                          </div>
                          <div class="lp-sub-line" title="${p.specialty} • ${p.city}">${p.specialty} • ${p.city}</div>
                        </div>
                      </div>
                    </td>
                    <td data-label="Contact" class="lp-col-contact">
                      <a href="tel:${p.phone.replace(/\s+/g, '')}" class="lp-phone-link">${p.phone}</a>
                      <div class="lp-sub-line" title="${p.assignedTo} • ${p.leadSource}">${p.assignedTo} • ${p.leadSource}</div>
                    </td>
                    <td data-label="Stage" class="lp-col-stage">
                      <div class="lp-stage-cell">
                        <select class="inline-status-select ${STATUS_SELECT_CLASS[p.status] || 'st-new'}" data-status-lead-id="${p.id}" aria-label="Stage for ${p.name}">
                          ${LEAD_STATUSES.map(st => `<option value="${st}" ${p.status === st ? 'selected' : ''}>${st}</option>`).join('')}
                        </select>
                        ${renderStageProgress(p.status)}
                      </div>
                    </td>
                    <td data-label="Deal & Paid" class="lp-col-deal">
                      <div class="lp-deal-cell">
                        <div class="lp-deal-top">
                          <span class="lp-deal-amount">${formatINR(p.settlement.dealValue)}</span>
                          <span class="status-badge ${stBadge}">${p.settlement.settlementStatus}</span>
                        </div>
                        <div class="lp-deal-bar">
                          <div class="lp-deal-bar-fill ${stBadge}" style="width:${pct}%;"></div>
                        </div>
                        <div class="lp-sub-line">Paid ${formatINR(p.settlement.paidAmount)} (${pct}%)</div>
                      </div>
                    </td>
                    <td data-label="Follow-up" class="lp-col-followup">
                      ${renderFollowupChip(p.followup, p.id)}
                    </td>
                    <td data-label="Actions" class="td-action lp-col-actions">
                      <div class="lp-actions-grid">
                        ${isActivePartner
                          ? `<span class="lp-activated-pill" title="Partner is Onboarded & Active">✓ Active</span>`
                          : `<button type="button" class="action-pill-btn pill-activate" data-quick-activate="${p.id}" title="Activate & Onboard ${p.name} in 1 click">⚡ Activate</button>`
                        }
                        <button type="button" class="action-pill-btn pill-green" data-open-settle="${p.id}" title="Record or view settlement">₹ Settle</button>
                        <button type="button" class="action-pill-btn pill-blue" data-open-lead="${p.id}" title="View lead details & history">Details</button>
                        <button type="button" class="action-pill-btn pill-wa" data-wa="${p.name}" data-wa-phone="${p.phone}" title="WhatsApp ${p.name}">
                          ${waSvgIcon}<span>WhatsApp</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
        ${renderPaginationBarHTML(pager, state.pagination.leadsPageSize, 'leads')}
      </div>
    `;

    // Navigation buttons
    document.getElementById('leadsGoUploadBtn')?.addEventListener('click', () => switchView('leads-upload'));
    document.getElementById('leadsGoSettleBtn')?.addEventListener('click', () => switchView('settlements'));
    document.getElementById('leadsGoReportsBtn')?.addEventListener('click', () => switchView('leads-reports'));

    // Stage summary strip click
    viewDynamic.querySelectorAll('#leadsStatusTabs [data-lead-st]').forEach(btn => {
      btn.addEventListener('click', () => {
        state.leadsFilter.status = btn.getAttribute('data-lead-st');
        state.pagination.leadsPage = 1;
        renderLeadsView();
      });
    });

    // Search input
    const inlineSearch = document.getElementById('leadsInlineSearch');
    if (inlineSearch) {
      inlineSearch.addEventListener('input', (e) => {
        state.leadsFilter.search = e.target.value;
        state.pagination.leadsPage = 1;
        renderLeadsView();
        const el = document.getElementById('leadsInlineSearch');
        if (el) { el.focus(); el.setSelectionRange(el.value.length, el.value.length); }
      });
    }

    document.getElementById('leadsClearSearchBtn')?.addEventListener('click', () => {
      state.leadsFilter.search = '';
      state.pagination.leadsPage = 1;
      renderLeadsView();
    });

    // Dropdown filters & sort
    document.getElementById('leadsCategoryFilter')?.addEventListener('change', (e) => {
      state.leadsFilter.category = e.target.value;
      state.pagination.leadsPage = 1;
      renderLeadsView();
    });

    document.getElementById('leadsSettlementFilter')?.addEventListener('change', (e) => {
      state.leadsFilter.settlement = e.target.value;
      state.pagination.leadsPage = 1;
      renderLeadsView();
    });

    document.getElementById('leadsSortSelect')?.addEventListener('change', (e) => {
      state.leadsFilter.sortBy = e.target.value;
      state.pagination.leadsPage = 1;
      renderLeadsView();
    });

    const resetAllFilters = () => {
      state.leadsFilter.status = 'All';
      state.leadsFilter.category = 'All';
      state.leadsFilter.settlement = 'All';
      state.leadsFilter.sortBy = 'default';
      state.leadsFilter.search = '';
      state.leadsFilter.onlyLatestBatch = false;
      state.pagination.leadsPage = 1;
      renderLeadsView();
    };
    document.getElementById('leadsResetFiltersBtn')?.addEventListener('click', resetAllFilters);
    document.getElementById('leadsEmptyResetBtn')?.addEventListener('click', resetAllFilters);

    document.getElementById('leadsToggleBatchBtn')?.addEventListener('click', () => {
      state.leadsFilter.onlyLatestBatch = !state.leadsFilter.onlyLatestBatch;
      state.pagination.leadsPage = 1;
      renderLeadsView();
    });
    document.getElementById('leadsUploadAnotherBtn')?.addEventListener('click', () => switchView('leads-upload'));
    document.getElementById('leadsDismissBatchBtn')?.addEventListener('click', () => {
      state.lastUploadedBatch = null;
      state.leadsFilter.onlyLatestBatch = false;
      state.pagination.leadsPage = 1;
      renderLeadsView();
    });

    // 1-Click Quick Activate per row
    viewDynamic.querySelectorAll('[data-quick-activate]').forEach(btn => {
      btn.addEventListener('click', () => {
        const pid = Number(btn.getAttribute('data-quick-activate'));
        const lead = state.partners.find(x => x.id === pid);
        updateLeadStatus(pid, 'Onboarded', 'Quick-activated from Leads Pipeline table');
        showToast(`✓ ${lead?.name || 'Lead'} is now Activated (Onboarded)!`);
        renderLeadsView();
      });
    });

    // Inline stage dropdown
    viewDynamic.querySelectorAll('[data-status-lead-id]').forEach(sel => {
      sel.addEventListener('change', () => {
        const pid = Number(sel.getAttribute('data-status-lead-id'));
        const newSt = sel.value;
        const lead = state.partners.find(x => x.id === pid);
        updateLeadStatus(pid, newSt);
        showToast(`Updated ${lead?.name || 'Lead'} status to "${newSt}"`);
        renderLeadsView();
      });
    });

    viewDynamic.querySelectorAll('[data-open-settle]').forEach(btn => {
      btn.addEventListener('click', () => openSettlementModal(Number(btn.getAttribute('data-open-settle'))));
    });

    viewDynamic.querySelectorAll('[data-open-lead]').forEach(btn => {
      btn.addEventListener('click', () => openLeadDetailModal(Number(btn.getAttribute('data-open-lead'))));
    });

    bindPaginationEvents(viewDynamic, 'leads', 'leadsPage', 'leadsPageSize', renderLeadsView);
  }

  // ---- LEADS UPLOAD VIEW (CSV / TSV / PASTE / DEMO BATCH) ----
  function parseCSVText(text) {
    const lines = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n').filter(l => l.trim().length > 0);
    if (lines.length === 0) return [];

    const parseLineWithDelim = (line, delim) => {
      const cells = [];
      let cur = '';
      let inQuotes = false;
      for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (ch === '"') {
          if (inQuotes && line[i + 1] === '"') { cur += '"'; i++; }
          else { inQuotes = !inQuotes; }
        } else if (ch === delim && !inQuotes) {
          cells.push(cur.trim());
          cur = '';
        } else {
          cur += ch;
        }
      }
      cells.push(cur.trim());
      return cells;
    };

    const headerKeywords = [
      'name', 'leadname', 'partnername', 'doctorname', 'clinicname', 'hospitalname',
      'pharmacyname', 'entityname', 'clientname', 'customername', 'partner', 'doctor',
      'clinic', 'hospital', 'pharmacy', 'entity', 'phone', 'whatsapp', 'mobile',
      'contact', 'city', 'location', 'specialty', 'speciality', 'status', 'stage',
      'deal', 'amount', 'paid', 'source', 'category', 'type'
    ];

    let headerRowIdx = -1;
    let delimiter = ',';
    let rawHeaders = [];
    const scanLimit = Math.min(10, lines.length);
    for (let li = 0; li < scanLimit; li++) {
      const candLine = lines[li];
      const candDelim = candLine.includes('\t') && !candLine.includes(',')
        ? '\t'
        : (candLine.includes(';') && !candLine.includes(',') ? ';' : ',');
      const candCells = parseLineWithDelim(candLine, candDelim).map(h => h.toLowerCase().replace(/[^a-z0-9]/g, ''));
      if (candCells.length >= 2 && candCells.some(h => headerKeywords.includes(h) || headerKeywords.some(k => h.includes(k)))) {
        headerRowIdx = li;
        delimiter = candDelim;
        rawHeaders = candCells;
        break;
      }
    }

    const hasHeader = headerRowIdx !== -1;
    if (!hasHeader) {
      const firstLine = lines[0];
      delimiter = firstLine.includes('\t') && !firstLine.includes(',')
        ? '\t'
        : (firstLine.includes(';') && !firstLine.includes(',') ? ';' : ',');
    }
    const parseLine = (line) => parseLineWithDelim(line, delimiter);
    const startIdx = hasHeader ? headerRowIdx + 1 : 0;
    if (startIdx >= lines.length) return [];

    const colIdx = (aliases, fallbackIdx) => {
      if (!hasHeader) return fallbackIdx;
      for (const a of aliases) {
        const exact = rawHeaders.findIndex(h => h === a);
        if (exact !== -1) return exact;
      }
      for (const a of aliases) {
        const partial = rawHeaders.findIndex(h => h.includes(a));
        if (partial !== -1) return partial;
      }
      return -1;
    };

    let idxName = colIdx([
      'leadname', 'partnername', 'doctorname', 'clinicname', 'hospitalname',
      'pharmacyname', 'entityname', 'clientname', 'customername',
      'name', 'partner', 'doctor', 'clinic', 'hospital', 'pharmacy', 'entity', 'title'
    ], 0);
    const idxType = colIdx(['category', 'partnertype', 'type', 'segment'], 1);
    const idxSpec = colIdx(['specialty', 'speciality', 'system', 'department'], 2);
    const idxCity = colIdx(['city', 'location', 'district', 'place', 'area', 'region'], 3);
    const idxPhone = colIdx(['phone', 'whatsapp', 'mobile', 'contact', 'tel'], 4);
    const idxStatus = colIdx(['leadstatus', 'status', 'stage'], 5);
    const idxSource = colIdx(['leadsource', 'source', 'channel'], 6);
    const idxAssigned = colIdx(['assignedto', 'assigned', 'owner', 'executive', 'rep'], 7);
    const idxDeal = colIdx(['dealvalue', 'totalvalue', 'deal', 'amount', 'total', 'revenue', 'value', 'price', 'mrp', 'rate', 'cost', 'sales', 'net'], 8);
    const idxPaid = colIdx(['paidamount', 'settledamount', 'paid', 'collected', 'settled'], 9);
    const idxFollowup = colIdx(['nextfollowup', 'followup'], 10);

    if (hasHeader && idxName === -1) {
      const sampleCols = parseLine(lines[startIdx]);
      const fallbackNameIdx = sampleCols.findIndex((val, cIdx) => {
        if (cIdx === idxPhone || cIdx === idxDeal || cIdx === idxPaid) return false;
        const v = (val || '').trim();
        if (!v) return false;
        const isPureNum = /^[\d,.\s₹$%-]+$/.test(v);
        const isDateLike = /^\d{2,4}[-/]\d{1,2}[-/]\d{1,4}/.test(v);
        return !isPureNum && !isDateLike && /[a-zA-Z]/.test(v);
      });
      if (fallbackNameIdx !== -1) idxName = fallbackNameIdx;
    }

    const existingNamePhoneKeys = new Set(
      state.partners.map(p => `${(p.name || '').trim().toLowerCase()}|${(p.phone || '').replace(/[^0-9]/g, '')}`)
    );
    const existingNameCityKeys = new Set(
      state.partners.map(p => `${(p.name || '').trim().toLowerCase()}|${(p.city || '').trim().toLowerCase()}`)
    );
    const rows = [];

    for (let i = startIdx; i < lines.length; i++) {
      const cols = parseLine(lines[i]);
      const get = (idx, def = '') => (idx >= 0 && idx < cols.length && cols[idx] !== '' ? cols[idx] : def);

      let name = '';
      let rawType = '';
      let specialty = '';
      let city = '';
      let phone = '';

      if (!hasHeader && cols.length <= 4) {
        const phoneIdx = cols.findIndex(c => c.replace(/[^0-9]/g, '').length >= 7);
        const nonPhone = cols.filter((_, idx) => idx !== phoneIdx);
        name = nonPhone[0] || '';
        phone = phoneIdx >= 0 ? cols[phoneIdx] : '';
        if (nonPhone.length >= 3) {
          specialty = nonPhone[1] || 'Ayurveda';
          city = nonPhone[2] || 'Kochi';
        } else if (nonPhone.length === 2) {
          specialty = 'Ayurveda';
          city = nonPhone[1] || 'Kochi';
        } else {
          specialty = 'Ayurveda';
          city = 'Kochi';
        }
        rawType = /hosp/i.test(name) ? 'Hospitals' : (/clinic|center|centre/i.test(name) ? 'Clinics' : 'Doctors');
      } else {
        name = get(idxName, '');
        rawType = get(idxType, '');
        if (!rawType) {
          rawType = /hosp/i.test(name) ? 'Hospitals' : (/clinic|center|centre/i.test(name) ? 'Clinics' : 'Doctors');
        }
        specialty = get(idxSpec, 'Ayurveda');
        city = get(idxCity, 'Kochi');
        phone = get(idxPhone, '');
      }

      let type = 'Doctors';
      if (/clinic/i.test(rawType)) type = 'Clinics';
      else if (/hosp/i.test(rawType)) type = 'Hospitals';

      const rawStatus = !hasHeader && cols.length <= 4 ? 'New Lead' : get(idxStatus, 'New Lead');
      const status = LEAD_STATUSES.find(s => s.toLowerCase() === rawStatus.toLowerCase()) || 'New Lead';
      const leadSource = !hasHeader && cols.length <= 4 ? 'Quick Paste' : get(idxSource, 'CSV Upload');
      const assignedTo = !hasHeader && cols.length <= 4 ? 'Rahul Krishnan' : get(idxAssigned, 'Rahul Krishnan');
      const defaultDeal = type === 'Hospitals' ? '120000' : type === 'Clinics' ? '55000' : '25000';
      const parsedDeal = Number(String(!hasHeader && cols.length <= 4 ? defaultDeal : get(idxDeal, defaultDeal)).replace(/[^0-9.]/g, '')) || 0;
      const dealValue = parsedDeal > 0 ? parsedDeal : Number(defaultDeal);
      const paidAmount = Math.max(0, Number(String(!hasHeader && cols.length <= 4 ? '0' : get(idxPaid, '0')).replace(/[^0-9.]/g, '')) || 0);
      const followup = !hasHeader && cols.length <= 4 ? 'Tomorrow, 11:00 AM' : get(idxFollowup, 'Tomorrow, 11:00 AM');

      phone = cleanPhoneString(phone);
      let cleanPhone = phone.replace(/[^0-9]/g, '');
      if (name && (!phone || cleanPhone.length < 7)) {
        phone = '+91 98470 00000';
        cleanPhone = '919847000000';
      }
      const nameKey = name.trim().toLowerCase();
      const cityKey = city.trim().toLowerCase();
      const isDuplicate = (nameKey && cleanPhone.length >= 7 && existingNamePhoneKeys.has(`${nameKey}|${cleanPhone}`))
        || (nameKey && cityKey && existingNameCityKeys.has(`${nameKey}|${cityKey}`));
      const errors = [];
      if (!name) errors.push('Missing Name');

      rows.push({
        rowNum: i + 1,
        name,
        type,
        specialty,
        city,
        phone,
        status,
        leadSource,
        assignedTo,
        dealValue,
        paidAmount: Math.min(paidAmount, dealValue),
        followup,
        isDuplicate,
        errors,
        isValid: errors.length === 0
      });
    }
    return rows;
  }

  function autoSaveUploadedRows(rows, fileName, sourceLabel = 'CSV Upload') {
    if (!Array.isArray(rows) || rows.length === 0) {
      return { addedCount: 0, updatedCount: 0, skippedCount: 0 };
    }
    const newLeads = [];
    let addedCount = 0;
    let updatedCount = 0;
    let skippedCount = 0;
    const baseId = Date.now();

    rows.forEach((r, idx) => {
      if (!r.isValid) {
        skippedCount++;
        return;
      }
      if (r._autoSaved) return;

      const normName = r.name.trim().toLowerCase();
      const existing = state.partners.find(p => (p.name || '').trim().toLowerCase() === normName);

      if (!existing) {
        const initials = r.name.replace(/^Dr\.\s*/i, '').split(/\s+/).filter(Boolean).map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'LD';
        const newLead = normalizePartner({
          id: baseId + idx,
          initials,
          color: r.type === 'Doctors' ? 'avatar-blue' : r.type === 'Clinics' ? 'avatar-green' : 'avatar-purple',
          name: r.name.trim(),
          type: r.type,
          specialty: r.specialty,
          city: r.city,
          phone: r.phone,
          status: r.status,
          followup: r.followup,
          leadSource: r.leadSource || sourceLabel,
          assignedTo: r.assignedTo || 'Rahul Krishnan',
          uploadBatch: fileName || 'Uploaded Batch',
          createdDate: todayISO(),
          settlement: {
            dealValue: r.dealValue,
            commissionPct: 12,
            paidAmount: r.paidAmount
          }
        }, idx);

        newLeads.push(newLead);
        state.counts.total++;
        if (r.type === 'Doctors') state.counts.doctors++;
        if (r.type === 'Clinics') state.counts.clinics++;
        if (r.type === 'Hospitals') state.counts.hospitals++;
        addedCount++;
      } else {
        let changed = false;
        existing.uploadBatch = fileName || 'Uploaded Batch';
        if (r.type && existing.type !== r.type) { existing.type = r.type; changed = true; }
        if (r.specialty && existing.specialty !== r.specialty) { existing.specialty = r.specialty; changed = true; }
        if (r.city && existing.city !== r.city) { existing.city = r.city; changed = true; }
        if (r.phone && existing.phone !== r.phone) { existing.phone = r.phone; changed = true; }
        if (r.assignedTo && existing.assignedTo !== r.assignedTo) { existing.assignedTo = r.assignedTo; changed = true; }
        if (r.status && existing.status !== r.status && LEAD_STATUSES.includes(r.status)) {
          const prevStatus = existing.status;
          existing.status = r.status;
          existing.badge = STATUS_BADGE_MAP[r.status] || 'badge-newlead';
          if (r.status === 'Onboarded') existing.followup = 'Completed';
          if (!Array.isArray(existing.statusHistory)) existing.statusHistory = [];
          existing.statusHistory.unshift({
            status: r.status,
            date: todayISO(),
            note: `Synced from ${fileName || sourceLabel} (${prevStatus} → ${r.status})`
          });
          changed = true;
        }
        const curDeal = existing.settlement?.dealValue || 0;
        const curPaid = existing.settlement?.paidAmount || 0;
        if (r.dealValue !== curDeal || r.paidAmount !== curPaid) {
          const metrics = computeSettlementMetrics({
            dealValue: r.dealValue,
            commissionPct: existing.settlement?.commissionPct ?? 12,
            paidAmount: r.paidAmount
          });
          existing.settlement = {
            ...existing.settlement,
            ...metrics
          };
          changed = true;
        }
        if (changed) updatedCount++;
      }
      r._autoSaved = true;
    });

    if (newLeads.length > 0) {
      const orderedNew = sortPartnersOrderWise(newLeads);
      state.partners = sortPartnersOrderWise([...orderedNew, ...state.partners]);
    } else {
      state.partners = sortPartnersOrderWise(state.partners);
    }

    const totalSaved = addedCount + updatedCount;
    if (totalSaved > 0 || rows.length > 0) {
      const nowStr = new Date().toLocaleString('en-IN', { year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' });
      state.uploadHistory.unshift({
        id: Date.now(),
        date: nowStr,
        fileName: fileName || 'Uploaded Batch',
        source: sourceLabel,
        imported: addedCount + updatedCount,
        skipped: skippedCount
      });
      state.pagination.uploadHistoryPage = 1;
    }

    persistState();
    syncDashboardCounts();
    const setKpi = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val.toLocaleString(); };
    setKpi('kpiTotalPartners', state.counts.total);
    setKpi('kpiDoctors', state.counts.doctors);
    setKpi('kpiClinics', state.counts.clinics);
    setKpi('kpiHospitals', state.counts.hospitals);
    renderDashboardFollowups();

    return { addedCount, updatedCount, skippedCount };
  }

  function renderLeadsUploadView() {
    const validRows = state.pendingUploadRows.filter(r => r.isValid);
    const dupRows = state.pendingUploadRows.filter(r => r.isDuplicate);
    const invalidRows = state.pendingUploadRows.filter(r => !r.isValid);
    const previewPager = paginateArray(
      state.pendingUploadRows,
      state.pagination.uploadPreviewPage,
      state.pagination.uploadPreviewPageSize
    );
    state.pagination.uploadPreviewPage = previewPager.currentPage;

    const historyPager = paginateArray(
      state.uploadHistory,
      state.pagination.uploadHistoryPage,
      state.pagination.uploadHistoryPageSize
    );
    state.pagination.uploadHistoryPage = historyPager.currentPage;

    viewDynamic.innerHTML = `
      <div class="upload-ref-shell">
        <div class="panel-card upload-ref-card">
          <div class="upload-ref-header">
            <div class="panel-title"><h2>Upload Leads File (CSV / Excel)</h2></div>
            <button type="button" class="btn btn-outline upload-hdr-btn" id="downloadSampleCsvBtn">📥 Download CSV Template</button>
          </div>

          <div class="upload-ref-body">
            <input type="file" id="leadsFileInput" accept=".csv,.tsv,.txt,.xls,.xlsx,text/csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" style="position:absolute;width:1px;height:1px;opacity:0;overflow:hidden;pointer-events:none;" />
            <div class="upload-dropzone" id="leadsDropzone">
              <div class="upload-icon-circle">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
              </div>
              <h3>Drop your CSV / Excel file here</h3>
              <p>Supports <strong>.csv, .xlsx, .xls, .tsv, .txt</strong> with columns: Name, Category, Specialty, City, Phone, Status, Source, Assigned To, Deal Value, Paid Amount</p>
              <div class="upload-actions-row">
                <label for="leadsFileInput" class="btn btn-primary" id="browseCsvBtn" style="cursor:pointer;">Browse File</label>
                <button type="button" class="btn btn-outline" id="loadDemoBatchBtn">⚡ Load 5 Sample Leads</button>
              </div>
            </div>

            <div class="upload-ref-field-group">
              <div class="upload-ref-field-header">
                <div class="panel-title"><h2>Quick Paste Bulk Leads</h2></div>
                <button class="btn btn-outline upload-hdr-btn" id="openSingleLeadFromUploadBtn">+ Add Single Lead</button>
              </div>
              <p class="entity-sub upload-paste-hint">Paste comma-separated rows (header optional) and click <strong>Parse Rows</strong> to preview before importing.</p>
              <textarea class="paste-box" id="pasteCsvInput" placeholder="Name,Category,Specialty,City,Phone,Status,Source,Assigned To,Deal Value,Paid Amount&#10;Dr. Kavya Nair,Doctors,Ayurveda,Kochi,+91 98471 22334,New Lead,CSV Upload,Rahul Krishnan,30000,10000"></textarea>
            </div>
          </div>

          <div class="upload-ref-footer">
            <button type="button" class="btn btn-outline upload-ref-cancel" id="clearPasteBtn">Clear</button>
            <button type="button" class="btn btn-primary upload-ref-submit" id="parsePasteBtn">Parse &amp; Preview Rows</button>
          </div>
        </div>

        ${state.pendingUploadRows.length > 0 ? `
          <div class="panel-card upload-ref-card" id="importPreviewCard">
            <div class="upload-ref-header">
              <div class="panel-title"><h2>Import Preview — ${state.pendingUploadFileName || 'Parsed Batch'} (${state.pendingUploadRows.length} rows)</h2></div>
              <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
                <label style="display:inline-flex;align-items:center;gap:6px;font-size:13px;font-weight:600;color:#344054;cursor:pointer;">
                  <input type="checkbox" id="skipDuplicatesChk" checked /> Skip duplicate phone numbers
                </label>
                <button class="btn btn-outline" id="cancelPreviewBtn">Close Preview</button>
                <button class="btn btn-whatsapp" id="confirmImportLeadsBtn">✓ Open in Leads &amp; Status →</button>
              </div>
            </div>
            <div class="upload-ref-body">
              <div class="preview-summary-bar">
                <div class="preview-badges">
                  <span class="status-badge badge-completed">✓ Valid: ${validRows.length}</span>
                  <span class="status-badge badge-meeting">↻ Synced / Existing: ${dupRows.length}</span>
                  <span class="status-badge badge-lost">✕ Invalid: ${invalidRows.length}</span>
                </div>
                <span class="entity-sub">All valid leads from this sheet are automatically saved to <strong>Leads &amp; Status</strong>, <strong>Partners</strong>, and <strong>Settlement Tracking</strong>.</span>
              </div>
              <div class="upload-table-scroll table-compact">
                <table class="data-table">
                  <thead>
                    <tr>
                      <th>Lead Name &amp; Phone</th>
                      <th>Category • Specialty • City</th>
                      <th>Status</th>
                      <th>Deal / Paid</th>
                      <th>Validation</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${previewPager.pageItems.map(r => `
                      <tr>
                        <td class="td-primary">
                          <strong>#${r.rowNum} ${r.name || '—'}</strong>
                          <div class="entity-sub">${r.phone || 'Missing Phone'}</div>
                        </td>
                        <td><strong>${r.type.slice(0, -1)}</strong> • ${r.specialty} • ${r.city}</td>
                        <td><span class="status-badge ${STATUS_BADGE_MAP[r.status] || 'badge-newlead'}">${r.status}</span></td>
                        <td>
                          <strong>${formatINR(r.dealValue)}</strong>
                          <div class="entity-sub" style="color:#15803d;font-weight:600;">Paid: ${formatINR(r.paidAmount)}</div>
                        </td>
                        <td>
                          ${!r.isValid
                            ? `<span class="status-badge badge-lost">${r.errors.join(', ')}</span>`
                            : r._autoSaved
                              ? `<span class="status-badge badge-completed">${r.isDuplicate ? 'Synced to CRM' : 'Saved to Pipeline'}</span>`
                              : r.isDuplicate
                                ? `<span class="status-badge badge-meeting">Existing Lead</span>`
                                : `<span class="status-badge badge-completed">Ready</span>`
                          }
                        </td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
              ${renderPaginationBarHTML(previewPager, state.pagination.uploadPreviewPageSize, 'uploadPreview')}
            </div>
          </div>
        ` : ''}

        <div class="panel-card upload-ref-card upload-history-card">
          <div class="panel-header upload-history-header">
            <div class="panel-title"><h2>Recent Leads Upload History (${state.uploadHistory.length})</h2></div>
            <button class="btn btn-outline upload-hdr-btn" id="uploadViewAllLeadsBtn">View All Leads →</button>
          </div>
          <div class="upload-table-scroll">
            <table class="data-table upload-history-table">
              <thead>
                <tr>
                  <th>Upload Date &amp; Time</th>
                  <th>Batch / File Name</th>
                  <th>Source</th>
                  <th>Leads Imported</th>
                  <th style="text-align:center;">Skipped</th>
                </tr>
              </thead>
              <tbody>
                ${historyPager.pageItems.map(u => `
                  <tr>
                    <td style="white-space:nowrap;color:#475569;">${u.date}</td>
                    <td><strong>${u.fileName}</strong></td>
                    <td><span class="status-badge badge-contacted">${u.source}</span></td>
                    <td><strong style="color:#15803d;">+${u.imported} leads</strong></td>
                    <td style="text-align:center;font-weight:600;color:#475569;">${u.skipped}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          ${renderPaginationBarHTML(historyPager, state.pagination.uploadHistoryPageSize, 'uploadHistory')}
        </div>
      </div>
    `;

    const fileInput = document.getElementById('leadsFileInput');
    const dropzone = document.getElementById('leadsDropzone');

    const redirectToLeadsAfterUpload = (rows, fileName, sourceLabel) => {
      const res = autoSaveUploadedRows(rows, fileName, sourceLabel);
      const validRows = rows.filter(r => r.isValid);
      const byCategory = {
        Doctors: validRows.filter(r => r.type === 'Doctors').length,
        Clinics: validRows.filter(r => r.type === 'Clinics').length,
        Hospitals: validRows.filter(r => r.type === 'Hospitals').length
      };
      state.lastUploadedBatch = {
        fileName,
        total: rows.length,
        added: res.addedCount,
        updated: res.updatedCount,
        byCategory
      };
      state.pagination.partnersPage = 1;
      state.pagination.partnersPageSize = Math.max(state.pagination.partnersPageSize, Math.min(15, validRows.length || 5));
      showToast(`Auto-distributed "${fileName}": ${byCategory.Doctors} Doctors, ${byCategory.Clinics} Clinics, ${byCategory.Hospitals} Hospitals!`);
      switchView('partners-all');
    };

    const finishParsedText = (text, fileName) => {
      let csvText = text;
      if (/<table[\s>]/i.test(text)) {
        try {
          const doc = new DOMParser().parseFromString(text, 'text/html');
          const trs = Array.from(doc.querySelectorAll('table tr'));
          csvText = trs.map(tr =>
            Array.from(tr.querySelectorAll('th,td'))
              .map(cell => `"${(cell.textContent || '').trim().replace(/"/g, '""')}"`)
              .join(',')
          ).join('\n');
        } catch (err) {
          console.error(err);
        }
      }
      const parsed = parseCSVText(csvText);
      if (parsed.length === 0) {
        showToast(`No lead rows found in "${fileName}". Check the file format or download the CSV template.`);
        return;
      }
      state.pendingUploadRows = parsed;
      state.pendingUploadFileName = fileName;
      state.pagination.uploadPreviewPage = 1;
      redirectToLeadsAfterUpload(parsed, fileName, 'CSV / Excel Upload');
    };

    const handleFile = (file) => {
      if (!file) return;
      const lowerName = (file.name || '').toLowerCase();
      const isExcel = lowerName.endsWith('.xlsx') || lowerName.endsWith('.xls');

      if (isExcel && typeof window.XLSX !== 'undefined') {
        const reader = new FileReader();
        reader.onload = (ev) => {
          try {
            const data = new Uint8Array(ev.target.result);
            const workbook = window.XLSX.read(data, { type: 'array' });
            const firstSheet = workbook.SheetNames[0];
            const csv = window.XLSX.utils.sheet_to_csv(workbook.Sheets[firstSheet]);
            finishParsedText(csv, file.name);
          } catch (err) {
            // Fallback for HTML-based .xls files
            const textReader = new FileReader();
            textReader.onload = (e2) => finishParsedText(String(e2.target.result || ''), file.name);
            textReader.readAsText(file);
          }
        };
        reader.onerror = () => showToast(`Failed to read ${file.name}`);
        reader.readAsArrayBuffer(file);
        return;
      }

      const reader = new FileReader();
      reader.onload = (ev) => finishParsedText(String(ev.target.result || ''), file.name);
      reader.onerror = () => showToast(`Failed to read ${file.name}`);
      reader.readAsText(file);
    };

    document.getElementById('browseCsvBtn')?.addEventListener('click', (e) => {
      e.stopPropagation();
    });
    dropzone?.addEventListener('click', (e) => {
      if (e.target.closest('button, label, a, input')) return;
      if (fileInput) {
        fileInput.value = '';
        fileInput.click();
      }
    });
    fileInput?.addEventListener('change', (e) => {
      const f = e.target.files?.[0];
      if (f) handleFile(f);
      e.target.value = '';
    });

    dropzone?.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzone.classList.add('drag-over');
    });
    dropzone?.addEventListener('dragleave', () => dropzone.classList.remove('drag-over'));
    dropzone?.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.classList.remove('drag-over');
      handleFile(e.dataTransfer?.files?.[0]);
    });

    document.getElementById('downloadSampleCsvBtn')?.addEventListener('click', () => {
      const sample = [
        'Name,Category,Specialty,City,Phone,Status,Source,Assigned To,Deal Value,Paid Amount,Follow-up',
        'Dr. Kavya Nair,Doctors,Ayurveda Kayachikitsa,Kochi,+91 98471 22334,New Lead,CSV Upload,Rahul Krishnan,30000,0,Tomorrow 10:30 AM',
        'Arogya Wellness Clinic,Clinics,Panchakarma,Thrissur,+91 94462 77889,Interested,CSV Upload,Sneha Nair,60000,20000,Nov 28 2:00 PM',
        'Sree Dhanwanthari Hospital,Hospitals,Multi-Specialty AYUSH,Trivandrum,+91 98952 44110,Onboarded,CSV Upload,Kiran Panicker,150000,150000,Completed'
      ].join('\n');
      const blob = new Blob([sample], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'AyushDoc_Leads_Upload_Template.csv';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      showToast('Downloaded AyushDoc_Leads_Upload_Template.csv!');
    });

    document.getElementById('loadDemoBatchBtn')?.addEventListener('click', (e) => {
      e.stopPropagation();
      const demoCsv = [
        'Name,Category,Specialty,City,Phone,Status,Source,Assigned To,Deal Value,Paid Amount,Follow-up',
        'Dr. Kavya Nair,Doctors,Ayurveda Kayachikitsa,Kochi,+91 98471 22334,New Lead,CSV Upload,Rahul Krishnan,30000,0,Tomorrow 10:30 AM',
        'Arogya Wellness Clinic,Clinics,Panchakarma,Thrissur,+91 94462 77889,Interested,CSV Upload,Sneha Nair,60000,20000,Nov 28 2:00 PM',
        'Sree Dhanwanthari Hospital,Hospitals,Multi-Specialty AYUSH,Trivandrum,+91 98952 44110,Onboarded,CSV Upload,Kiran Panicker,150000,150000,Completed',
        'Dr. Arvind Pillai,Doctors,Homeopathy,Kozhikode,+91 97455 33991,Meeting,CSV Upload,Arjun Menon,28000,14000,Nov 29 11:00 AM',
        'Nila Siddha Center,Clinics,Siddha & Varma,Palakkad,+91 96338 55221,Contacted,CSV Upload,Neha Raj,45000,0,Nov 30 4:00 PM'
      ].join('\n');
      const parsedDemo = parseCSVText(demoCsv);
      state.pendingUploadRows = parsedDemo;
      state.pendingUploadFileName = 'demo_leads_batch_nov2026.csv';
      state.pagination.uploadPreviewPage = 1;
      redirectToLeadsAfterUpload(parsedDemo, 'demo_leads_batch_nov2026.csv', 'Sample Batch');
    });

    const pasteBox = document.getElementById('pasteCsvInput');
    if (pasteBox) {
      pasteBox.value = state.pasteCsvText || '';
      pasteBox.addEventListener('input', (e) => {
        state.pasteCsvText = e.target.value;
      });
    }

    document.getElementById('parsePasteBtn')?.addEventListener('click', () => {
      const box = document.getElementById('pasteCsvInput');
      let text = box?.value || '';
      if (!text.trim()) {
        text = 'Name,Category,Specialty,City,Phone,Status,Source,Assigned To,Deal Value,Paid Amount\nDr. Kavya Nair,Doctors,Ayurveda,Kochi,+91 98471 22334,New Lead,CSV Upload,Rahul Krishnan,30000,10000';
        state.pasteCsvText = text;
        if (box) box.value = text;
      } else {
        state.pasteCsvText = text;
      }
      const parsed = parseCSVText(text);
      if (parsed.length === 0) {
        showToast('No valid rows found. Paste lines like: Name, Phone or full CSV columns.');
        return;
      }
      state.pendingUploadRows = parsed;
      state.pendingUploadFileName = 'Pasted Bulk Leads';
      state.pagination.uploadPreviewPage = 1;
      redirectToLeadsAfterUpload(parsed, 'Pasted Bulk Leads', 'Bulk Paste');
    });

    document.getElementById('clearPasteBtn')?.addEventListener('click', () => {
      state.pasteCsvText = '';
      const box = document.getElementById('pasteCsvInput');
      if (box) box.value = '';
      if (state.pendingUploadFileName === 'Pasted Bulk Leads') {
        state.pendingUploadRows = [];
        state.pendingUploadFileName = '';
        state.pagination.uploadPreviewPage = 1;
        renderLeadsUploadView();
      }
      document.getElementById('pasteCsvInput')?.focus();
    });

    document.getElementById('openSingleLeadFromUploadBtn')?.addEventListener('click', openAddPartnerModal);
    document.getElementById('uploadViewAllLeadsBtn')?.addEventListener('click', () => switchView('leads'));

    document.getElementById('cancelPreviewBtn')?.addEventListener('click', () => {
      state.pendingUploadRows = [];
      state.pendingUploadFileName = '';
      state.pagination.uploadPreviewPage = 1;
      renderLeadsUploadView();
    });

    document.getElementById('confirmImportLeadsBtn')?.addEventListener('click', () => {
      const pendingUnsaved = state.pendingUploadRows.filter(r => !r._autoSaved && r.isValid);
      if (pendingUnsaved.length > 0) {
        const res = autoSaveUploadedRows(
          pendingUnsaved,
          state.pendingUploadFileName || 'Uploaded Batch',
          state.pendingUploadFileName === 'Pasted Bulk Leads' ? 'Bulk Paste' : 'CSV Upload'
        );
        showToast(`Saved ${res.addedCount + res.updatedCount} leads to Leads & Status!`);
      } else {
        showToast('All valid leads are already saved in Leads & Status Pipeline!');
      }
      state.pendingUploadRows = [];
      state.pendingUploadFileName = '';
      state.pagination.uploadPreviewPage = 1;
      switchView('leads');
    });

    bindPaginationEvents(viewDynamic, 'uploadPreview', 'uploadPreviewPage', 'uploadPreviewPageSize', renderLeadsUploadView);
    bindPaginationEvents(viewDynamic, 'uploadHistory', 'uploadHistoryPage', 'uploadHistoryPageSize', renderLeadsUploadView);
  }

  // ---- FULL SETTLEMENT TRACKING VIEW ----
  function renderSettlementsView() {
    const allPartners = state.partners;
    const settledCount = allPartners.filter(p => p.settlement?.settlementStatus === 'Settled').length;
    const partialCount = allPartners.filter(p => p.settlement?.settlementStatus === 'Partial').length;
    const unsettledCount = allPartners.filter(p => p.settlement?.settlementStatus === 'Unsettled').length;

    const filtered = allPartners.filter(p => {
      const matchSt = state.settlementFilter.status === 'All' || p.settlement.settlementStatus === state.settlementFilter.status;
      const q = state.settlementFilter.search.trim().toLowerCase();
      const matchQ = !q || matchesPartnerQuery(p, q) || (p.settlement.utrNumber || '').toLowerCase().includes(q) || (p.settlement.paymentMode || '').toLowerCase().includes(q);
      return matchSt && matchQ;
    });

    const pager = paginateArray(filtered, state.pagination.settlementsPage, state.pagination.settlementsPageSize);
    state.pagination.settlementsPage = pager.currentPage;

    viewDynamic.innerHTML = `
      <div class="panel-card">
        <div class="panel-header">
          <div class="filter-tabs" id="settlementStatusTabs">
            <button class="filter-tab ${state.settlementFilter.status === 'All' ? 'active' : ''}" data-settle-st="All">All (${allPartners.length})</button>
            <button class="filter-tab ${state.settlementFilter.status === 'Settled' ? 'active' : ''}" data-settle-st="Settled">Fully Settled (${settledCount})</button>
            <button class="filter-tab ${state.settlementFilter.status === 'Partial' ? 'active' : ''}" data-settle-st="Partial">Partial (${partialCount})</button>
            <button class="filter-tab ${state.settlementFilter.status === 'Unsettled' ? 'active' : ''}" data-settle-st="Unsettled">Unsettled (${unsettledCount})</button>
          </div>
          <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
            <input type="text" id="settlementSearchInput" value="${state.settlementFilter.search}" placeholder="Search lead, city, UTR, mode..." style="padding:7px 12px;border:1px solid #cbd5e1;border-radius:8px;font-size:13px;min-width:210px;font-family:inherit;" />
            <button class="btn btn-outline" id="exportSettlementCsvBtn">📥 Export Settlement CSV</button>
          </div>
        </div>
        <div class="table-no-scroll table-compact">
          <table class="data-table">
            <thead>
              <tr>
                <th>Lead / Partner</th>
                <th>Deal &amp; Comm.</th>
                <th>Paid / Balance</th>
                <th>Settlement Progress</th>
                <th>UTR / Payment</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${pager.pageItems.length === 0 ? `
                <tr><td colspan="6" style="text-align:center;padding:24px;color:#64748b;">No settlement records match the filter.</td></tr>
              ` : pager.pageItems.map(p => {
                const s = p.settlement;
                const badgeCls = s.settlementStatus === 'Settled' ? 'badge-settled' : s.settlementStatus === 'Partial' ? 'badge-partial' : 'badge-unsettled';
                const barColor = s.settlementStatus === 'Settled' ? '#16a34a' : s.settlementStatus === 'Partial' ? '#f59e0b' : '#ef4444';
                return `
                  <tr>
                    <td data-label="Lead / Partner" class="td-primary">
                      <div class="followup-entity">
                        <div class="avatar-circle ${p.color}">${p.initials}</div>
                        <div class="entity-info">
                          <div class="entity-name">${p.name}</div>
                          <div class="entity-sub">
                            ${p.type.slice(0, -1)} • ${p.city}
                            <span class="lead-mini-status ${p.badge}">${p.status}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td data-label="Deal & Comm.">
                      <div style="font-weight:700;color:#0f2547;white-space:nowrap;">${formatINR(s.dealValue)}</div>
                      <div class="entity-sub" style="white-space:nowrap;">Comm: ${formatINR(s.commissionAmount)} (${s.commissionPct}%)</div>
                    </td>
                    <td data-label="Paid / Balance">
                      <div style="font-weight:700;color:#15803d;white-space:nowrap;">${formatINR(s.paidAmount)}</div>
                      <div class="entity-sub" style="white-space:nowrap;color:${s.pendingAmount > 0 ? '#b91c1c' : '#64748b'};">Bal: ${formatINR(s.pendingAmount)}</div>
                    </td>
                    <td data-label="Settlement">
                      <div class="settlement-progress-wrap">
                        <div style="display:flex;align-items:center;justify-content:space-between;gap:6px;">
                          <span class="status-badge ${badgeCls}" style="padding:2px 8px;font-size:11px;">${s.settlementStatus}</span>
                          <span style="font-size:11.5px;font-weight:700;color:#334155;">${s.settledPct}%</span>
                        </div>
                        <div class="settlement-progress-track">
                          <div class="settlement-progress-fill" style="width:${s.settledPct}%;background:${barColor};"></div>
                        </div>
                      </div>
                    </td>
                    <td data-label="UTR / Payment">
                      <div style="font-size:12.2px;font-weight:700;color:#0f2547;">${s.utrNumber || '—'}</div>
                      <div class="entity-sub">${s.paymentMode || 'Not paid'}${s.settledDate ? ' • ' + s.settledDate : ''}</div>
                    </td>
                    <td data-label="Actions" class="td-action">
                      <div class="followup-actions" style="display:flex;flex-direction:column;align-items:stretch;gap:5px;width:88px;">
                        <button type="button" class="action-pill-btn pill-blue" style="justify-content:center;width:100%;" data-manage-settle="${p.id}">Manage</button>
                        ${s.pendingAmount > 0 ? `<button type="button" class="action-pill-btn pill-green" style="justify-content:center;width:100%;" data-quick-full-settle="${p.id}">✓ Settle</button>` : ''}
                      </div>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
        ${renderPaginationBarHTML(pager, state.pagination.settlementsPageSize, 'settlements')}
      </div>
    `;

    viewDynamic.querySelectorAll('#settlementStatusTabs [data-settle-st]').forEach(btn => {
      btn.addEventListener('click', () => {
        state.settlementFilter.status = btn.getAttribute('data-settle-st');
        state.pagination.settlementsPage = 1;
        renderSettlementsView();
      });
    });

    const settleSearch = document.getElementById('settlementSearchInput');
    if (settleSearch) {
      settleSearch.addEventListener('input', (e) => {
        state.settlementFilter.search = e.target.value;
        state.pagination.settlementsPage = 1;
        renderSettlementsView();
        const el = document.getElementById('settlementSearchInput');
        if (el) { el.focus(); el.setSelectionRange(el.value.length, el.value.length); }
      });
    }

    viewDynamic.querySelectorAll('[data-manage-settle]').forEach(btn => {
      btn.addEventListener('click', () => openSettlementModal(Number(btn.getAttribute('data-manage-settle'))));
    });

    viewDynamic.querySelectorAll('[data-quick-full-settle]').forEach(btn => {
      btn.addEventListener('click', () => {
        const pid = Number(btn.getAttribute('data-quick-full-settle'));
        const partner = state.partners.find(x => x.id === pid);
        if (!partner) return;
        const rem = partner.settlement.pendingAmount;
        if (rem <= 0) return;
        const utr = `AYU${String(Date.now()).slice(-7)}`;
        const dt = todayISO();
        partner.settlement.transactions.unshift({
          id: `TX-${Date.now()}`,
          date: dt,
          amount: rem,
          mode: 'NEFT/RTGS',
          utr,
          note: 'Quick Full Settlement'
        });
        const newPaid = partner.settlement.dealValue;
        const metrics = computeSettlementMetrics({
          dealValue: partner.settlement.dealValue,
          commissionPct: partner.settlement.commissionPct,
          paidAmount: newPaid
        });
        partner.settlement = {
          ...partner.settlement,
          ...metrics,
          paymentMode: 'NEFT/RTGS',
          utrNumber: utr,
          settledDate: dt
        };
        if (partner.status !== 'Onboarded') {
          updateLeadStatus(partner.id, 'Onboarded', `Marked Onboarded after full settlement (${utr})`);
        } else {
          persistState();
        }
        showToast(`Full settlement of ${formatINR(rem)} recorded for ${partner.name} (UTR: ${utr})`);
        renderSettlementsView();
      });
    });

    document.getElementById('exportSettlementCsvBtn')?.addEventListener('click', () => {
      exportLeadsCSV(filtered, `AyushDoc_Settlement_Report_${todayISO()}.csv`);
    });

    bindPaginationEvents(viewDynamic, 'settlements', 'settlementsPage', 'settlementsPageSize', renderSettlementsView);
  }

  // ---- ALL LEADS REPORTS GENERATION VIEW ----
  function getFilteredReportLeads() {
    const f = state.reportFilter;
    return state.partners.filter(p => {
      if (f.status !== 'All' && p.status !== f.status) return false;
      if (f.category !== 'All' && p.type !== f.category) return false;
      if (f.settlement !== 'All' && p.settlement.settlementStatus !== f.settlement) return false;
      if (f.source !== 'All' && p.leadSource !== f.source) return false;
      if (f.fromDate && p.createdDate < f.fromDate) return false;
      if (f.toDate && p.createdDate > f.toDate) return false;
      return true;
    });
  }

  function exportLeadsCSV(leads, filename) {
    const headers = [
      'Lead Name', 'Category', 'Specialty', 'City', 'Phone', 'Lead Source', 'Assigned To',
      'Created Date', 'Lead Status', 'Follow-up', 'Deal Value (INR)', 'Commission %',
      'Commission (INR)', 'Paid Amount (INR)', 'Pending Balance (INR)', 'Settlement Status',
      'Payment Mode', 'UTR / Reference', 'Settled Date'
    ];
    const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const rows = leads.map(p => [
      p.name, p.type.slice(0, -1), p.specialty, p.city, p.phone, p.leadSource, p.assignedTo,
      p.createdDate, p.status, p.followup, p.settlement.dealValue, p.settlement.commissionPct,
      p.settlement.commissionAmount, p.settlement.paidAmount, p.settlement.pendingAmount,
      p.settlement.settlementStatus, p.settlement.paymentMode, p.settlement.utrNumber, p.settlement.settledDate
    ].map(esc).join(','));

    const csv = [headers.map(esc).join(','), ...rows].join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    showToast(`Exported ${filename} (${leads.length} leads)!`);
  }

  function exportLeadsExcel(leads, filename) {
    const totalDeal = leads.reduce((s, p) => s + p.settlement.dealValue, 0);
    const totalPaid = leads.reduce((s, p) => s + p.settlement.paidAmount, 0);
    const totalPending = leads.reduce((s, p) => s + p.settlement.pendingAmount, 0);
    const html = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head><meta charset="UTF-8" /></head>
      <body>
        <h2>AyushDoc+ Partner CRM — All Leads &amp; Settlement Report</h2>
        <p>Generated on: ${new Date().toLocaleString('en-IN')} | Total Leads: ${leads.length} | Total Deal: ${formatINR(totalDeal)} | Settled: ${formatINR(totalPaid)} | Pending: ${formatINR(totalPending)}</p>
        <table border="1" cellspacing="0" cellpadding="6">
          <thead style="background:#0f2547;color:#ffffff;font-weight:bold;">
            <tr>
              <th>Lead Name</th><th>Category</th><th>Specialty</th><th>City</th><th>Phone</th>
              <th>Source</th><th>Assigned To</th><th>Date</th><th>Lead Status</th>
              <th>Deal Value</th><th>Paid Amount</th><th>Pending</th><th>Settlement Status</th><th>UTR / Ref</th>
            </tr>
          </thead>
          <tbody>
            ${leads.map(p => `
              <tr>
                <td>${p.name}</td><td>${p.type.slice(0, -1)}</td><td>${p.specialty}</td><td>${p.city}</td>
                <td>${p.phone}</td><td>${p.leadSource}</td><td>${p.assignedTo}</td><td>${p.createdDate}</td>
                <td>${p.status}</td><td>${p.settlement.dealValue}</td><td>${p.settlement.paidAmount}</td>
                <td>${p.settlement.pendingAmount}</td><td>${p.settlement.settlementStatus}</td><td>${p.settlement.utrNumber || ''}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </body>
      </html>
    `;
    const blob = new Blob([html], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    showToast(`Exported ${filename} (${leads.length} leads)!`);
  }

  function printLeadsPDFReport(leads) {
    const totalDeal = leads.reduce((s, p) => s + p.settlement.dealValue, 0);
    const totalPaid = leads.reduce((s, p) => s + p.settlement.paidAmount, 0);
    const totalPending = leads.reduce((s, p) => s + p.settlement.pendingAmount, 0);
    const onboarded = leads.filter(p => p.status === 'Onboarded').length;
    const win = window.open('', '_blank', 'width=1050,height=780');
    if (!win) {
      showToast('Please allow pop-ups to open the PDF print preview.');
      return;
    }
    win.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>AyushDoc+ All Leads Report (${todayISO()})</title>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; color: #0f172a; padding: 24px; }
          h1 { margin: 0 0 4px; color: #0f2547; font-size: 22px; }
          .sub { color: #475569; font-size: 12.5px; margin-bottom: 18px; }
          .kpi-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 20px; }
          .kpi { border: 1px solid #cbd5e1; border-radius: 8px; padding: 12px; background: #f8fafc; }
          .kpi .lbl { font-size: 11px; color: #64748b; text-transform: uppercase; font-weight: 700; }
          .kpi .val { font-size: 20px; font-weight: 800; color: #0f2547; margin-top: 4px; }
          table { width: 100%; border-collapse: collapse; font-size: 11.5px; }
          th { background: #0f2547; color: #ffffff; text-align: left; padding: 8px; }
          td { border-bottom: 1px solid #e2e8f0; padding: 7px 8px; }
          tr:nth-child(even) td { background: #f8fafc; }
          @media print { .no-print { display: none; } }
        </style>
      </head>
      <body>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">
          <div>
            <h1>AyushDoc+ Partner CRM — All Leads &amp; Settlement Report</h1>
            <div class="sub">Generated: ${new Date().toLocaleString('en-IN')} | Records: ${leads.length}</div>
          </div>
          <button class="no-print" onclick="window.print()" style="padding:8px 16px;background:#0b57d0;color:#fff;border:none;border-radius:6px;cursor:pointer;font-weight:700;">🖨️ Print / Save PDF</button>
        </div>
        <div class="kpi-row">
          <div class="kpi"><div class="lbl">Total Leads</div><div class="val">${leads.length}</div></div>
          <div class="kpi"><div class="lbl">Onboarded</div><div class="val">${onboarded}</div></div>
          <div class="kpi"><div class="lbl">Total Settled</div><div class="val">${formatINR(totalPaid)}</div></div>
          <div class="kpi"><div class="lbl">Pending Balance</div><div class="val">${formatINR(totalPending)}</div></div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Lead Name</th><th>Category</th><th>City</th><th>Phone</th><th>Source</th>
              <th>Date</th><th>Status</th><th>Deal Value</th><th>Paid</th><th>Pending</th><th>Settlement</th><th>UTR</th>
            </tr>
          </thead>
          <tbody>
            ${leads.map(p => `
              <tr>
                <td><strong>${p.name}</strong></td><td>${p.type.slice(0, -1)}</td><td>${p.city}</td>
                <td>${p.phone}</td><td>${p.leadSource}</td><td>${p.createdDate}</td>
                <td>${p.status}</td><td>${formatINR(p.settlement.dealValue)}</td>
                <td>${formatINR(p.settlement.paidAmount)}</td><td>${formatINR(p.settlement.pendingAmount)}</td>
                <td>${p.settlement.settlementStatus}</td><td>${p.settlement.utrNumber || '—'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </body>
      </html>
    `);
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 300);
  }

  function renderLeadsReportsView() {
    const filtered = getFilteredReportLeads();
    const sources = Array.from(new Set(state.partners.map(p => p.leadSource).filter(Boolean)));
    const totalDeal = filtered.reduce((s, p) => s + p.settlement.dealValue, 0);
    const totalPaid = filtered.reduce((s, p) => s + p.settlement.paidAmount, 0);
    const totalPending = filtered.reduce((s, p) => s + p.settlement.pendingAmount, 0);
    const onboardedCount = filtered.filter(p => p.status === 'Onboarded').length;
    const convRate = filtered.length ? ((onboardedCount / filtered.length) * 100).toFixed(1) : '0.0';

    const pager = paginateArray(filtered, state.pagination.reportsPage, state.pagination.reportsPageSize);
    state.pagination.reportsPage = pager.currentPage;

    const statusColors = {
      'New Lead': '#2563eb',
      'Contacted': '#0284c7',
      'Interested': '#16a34a',
      'Meeting': '#f59e0b',
      'Onboarded': '#15803d',
      'Lost': '#dc2626'
    };

    const settleBuckets = [
      { key: 'Settled', label: 'Fully Settled', color: '#16a34a' },
      { key: 'Partial', label: 'Partial Settlement', color: '#f59e0b' },
      { key: 'Unsettled', label: 'Unsettled / Pending', color: '#ef4444' }
    ];

    viewDynamic.innerHTML = `
      <div class="rep-shell">
        <div class="panel-card rep-card">
          <div class="rep-card-header">
            <div class="panel-title"><h2>Report Filters &amp; Export Controls</h2></div>
            <div class="rep-export-actions">
              <button class="btn btn-outline rep-btn" id="resetReportFiltersBtn">Reset Filters</button>
              <button class="btn btn-outline rep-btn" id="genCsvReportBtn">📥 Export CSV</button>
              <button class="btn btn-whatsapp rep-btn" id="genExcelReportBtn">📗 Export Excel (.xls)</button>
              <button class="btn btn-primary rep-btn" id="genPdfReportBtn">🖨️ Print / PDF Report</button>
            </div>
          </div>
          <div class="rep-filters-bar">
            <div class="form-group">
              <label for="repFilterStatus">Lead Status</label>
              <select id="repFilterStatus">
                <option value="All" ${state.reportFilter.status === 'All' ? 'selected' : ''}>All Statuses</option>
                ${LEAD_STATUSES.map(st => `<option value="${st}" ${state.reportFilter.status === st ? 'selected' : ''}>${st}</option>`).join('')}
              </select>
            </div>
            <div class="form-group">
              <label for="repFilterCategory">Partner Category</label>
              <select id="repFilterCategory">
                <option value="All" ${state.reportFilter.category === 'All' ? 'selected' : ''}>All Categories</option>
                <option value="Doctors" ${state.reportFilter.category === 'Doctors' ? 'selected' : ''}>Doctors</option>
                <option value="Clinics" ${state.reportFilter.category === 'Clinics' ? 'selected' : ''}>Clinics</option>
                <option value="Hospitals" ${state.reportFilter.category === 'Hospitals' ? 'selected' : ''}>Hospitals</option>
              </select>
            </div>
            <div class="form-group">
              <label for="repFilterSettlement">Settlement Status</label>
              <select id="repFilterSettlement">
                <option value="All" ${state.reportFilter.settlement === 'All' ? 'selected' : ''}>All Settlement States</option>
                <option value="Settled" ${state.reportFilter.settlement === 'Settled' ? 'selected' : ''}>Fully Settled</option>
                <option value="Partial" ${state.reportFilter.settlement === 'Partial' ? 'selected' : ''}>Partial</option>
                <option value="Unsettled" ${state.reportFilter.settlement === 'Unsettled' ? 'selected' : ''}>Unsettled</option>
              </select>
            </div>
            <div class="form-group">
              <label for="repFilterSource">Lead Source</label>
              <select id="repFilterSource">
                <option value="All" ${state.reportFilter.source === 'All' ? 'selected' : ''}>All Sources</option>
                ${sources.map(src => `<option value="${src}" ${state.reportFilter.source === src ? 'selected' : ''}>${src}</option>`).join('')}
              </select>
            </div>
            <div class="form-group">
              <label for="repFilterFrom">From Date</label>
              <input type="date" id="repFilterFrom" value="${state.reportFilter.fromDate}" />
            </div>
            <div class="form-group">
              <label for="repFilterTo">To Date</label>
              <input type="date" id="repFilterTo" value="${state.reportFilter.toDate}" />
            </div>
          </div>
        </div>

        <div class="rep-kpi-grid">
          <div class="rep-kpi-card rep-kpi-blue">
            <div class="rep-kpi-title">Matching Leads</div>
            <div class="rep-kpi-value">${filtered.length}</div>
            <div class="rep-kpi-sub"><span class="trend-up">${onboardedCount} Onboarded</span> (${convRate}% conv.)</div>
          </div>
          <div class="rep-kpi-card rep-kpi-purple">
            <div class="rep-kpi-title">Total Pipeline Deal Value</div>
            <div class="rep-kpi-value">${formatINR(totalDeal)}</div>
            <div class="rep-kpi-sub">Across filtered leads</div>
          </div>
          <div class="rep-kpi-card rep-kpi-green">
            <div class="rep-kpi-title">Settled Amount</div>
            <div class="rep-kpi-value">${formatINR(totalPaid)}</div>
            <div class="rep-kpi-sub"><span class="trend-up">${totalDeal ? Math.round((totalPaid / totalDeal) * 100) : 0}%</span> of deal value</div>
          </div>
          <div class="rep-kpi-card rep-kpi-orange">
            <div class="rep-kpi-title">Pending Settlement</div>
            <div class="rep-kpi-value">${formatINR(totalPending)}</div>
            <div class="rep-kpi-sub">Outstanding balance</div>
          </div>
        </div>

        <div class="rep-charts-grid">
          <div class="panel-card rep-card">
            <div class="rep-card-header">
              <div class="panel-title"><h2>Lead Status Distribution</h2></div>
              <span class="status-badge badge-contacted">${filtered.length} leads</span>
            </div>
            <div class="rep-card-body">
              <div class="rep-funnel-grid-2">
                ${LEAD_STATUSES.map(st => {
                  const cnt = filtered.filter(p => p.status === st).length;
                  const pct = filtered.length ? Math.round((cnt / filtered.length) * 100) : 0;
                  const isActive = state.reportFilter.status === st;
                  return `
                    <button type="button" class="rep-funnel-btn ${isActive ? 'active' : ''}" data-rep-quick-status="${st}" title="Click to filter by ${st}">
                      <div class="funnel-meta">
                        <span>${st}</span>
                        <span>${cnt} leads (${pct}%)</span>
                      </div>
                      <div class="funnel-track"><div class="funnel-fill" style="width:${pct}%;background:${statusColors[st]};"></div></div>
                    </button>
                  `;
                }).join('')}
              </div>
            </div>
          </div>

          <div class="panel-card rep-card">
            <div class="rep-card-header">
              <div class="panel-title"><h2>Settlement Status Breakdown</h2></div>
              <span class="status-badge badge-completed">${formatINR(totalPaid)} settled</span>
            </div>
            <div class="rep-card-body">
              <div class="rep-funnel-stack">
                ${settleBuckets.map(b => {
                  const items = filtered.filter(p => p.settlement.settlementStatus === b.key);
                  const amt = items.reduce((s, p) => s + (b.key === 'Unsettled' ? p.settlement.pendingAmount : p.settlement.paidAmount), 0);
                  const pct = filtered.length ? Math.round((items.length / filtered.length) * 100) : 0;
                  const isActive = state.reportFilter.settlement === b.key;
                  return `
                    <button type="button" class="rep-funnel-btn ${isActive ? 'active' : ''}" data-rep-quick-settle="${b.key}" title="Click to filter by ${b.label}">
                      <div class="funnel-meta">
                        <span>${b.label} (${items.length} leads)</span>
                        <span>${formatINR(amt)} (${pct}%)</span>
                      </div>
                      <div class="funnel-track"><div class="funnel-fill" style="width:${pct}%;background:${b.color};"></div></div>
                    </button>
                  `;
                }).join('')}
              </div>
            </div>
          </div>
        </div>

        <div class="panel-card rep-card rep-table-card">
          <div class="rep-card-header">
            <div class="panel-title"><h2>All Leads Detailed Report Preview (${filtered.length})</h2></div>
            <span class="entity-sub">Click any lead name to inspect full details &amp; history</span>
          </div>
          <div class="table-no-scroll table-compact">
            <table class="data-table rep-table">
              <thead>
                <tr>
                  <th>Lead Name &amp; Phone</th>
                  <th>Category • City</th>
                  <th>Source • Owner</th>
                  <th>Lead Status</th>
                  <th>Deal / Paid / Bal</th>
                  <th>Settlement</th>
                </tr>
              </thead>
              <tbody>
                ${pager.pageItems.length === 0 ? `
                  <tr><td colspan="6" style="text-align:center;padding:28px;color:#64748b;">No leads match the selected report filters.</td></tr>
                ` : pager.pageItems.map(p => {
                  const s = p.settlement;
                  const sBadge = s.settlementStatus === 'Settled' ? 'badge-settled' : s.settlementStatus === 'Partial' ? 'badge-partial' : 'badge-unsettled';
                  return `
                    <tr>
                      <td class="td-primary">
                        <div class="followup-entity">
                          <div class="avatar-circle ${p.color}" style="width:32px;height:32px;font-size:11.5px;">${p.initials}</div>
                          <div class="entity-info">
                            <button type="button" class="lp-name-link" data-open-lead="${p.id}">${p.name}</button>
                            <div class="entity-sub">${p.phone}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div style="font-weight:600;color:#0f2547;">${p.type.slice(0, -1)} • ${p.city}</div>
                        <div class="entity-sub">${p.createdDate}</div>
                      </td>
                      <td>
                        <div style="font-weight:600;color:#334155;">${p.leadSource}</div>
                        <div class="entity-sub">${p.assignedTo}</div>
                      </td>
                      <td><span class="status-badge ${p.badge}">${p.status}</span></td>
                      <td>
                        <div style="font-weight:700;color:#0f2547;white-space:nowrap;">${formatINR(s.dealValue)}</div>
                        <div class="entity-sub" style="white-space:nowrap;"><span style="color:#15803d;font-weight:600;">Paid ${formatINR(s.paidAmount)}</span> • Bal ${formatINR(s.pendingAmount)}</div>
                      </td>
                      <td>
                        <span class="status-badge ${sBadge}">${s.settlementStatus}</span>
                        ${s.utrNumber ? `<div class="entity-sub">${s.utrNumber}</div>` : ''}
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
          ${renderPaginationBarHTML(pager, state.pagination.reportsPageSize, 'reports')}
        </div>
      </div>
    `;

    const bindFilter = (id, key) => {
      document.getElementById(id)?.addEventListener('change', (e) => {
        state.reportFilter[key] = e.target.value;
        state.pagination.reportsPage = 1;
        renderLeadsReportsView();
      });
    };
    bindFilter('repFilterStatus', 'status');
    bindFilter('repFilterCategory', 'category');
    bindFilter('repFilterSettlement', 'settlement');
    bindFilter('repFilterSource', 'source');
    bindFilter('repFilterFrom', 'fromDate');
    bindFilter('repFilterTo', 'toDate');

    viewDynamic.querySelectorAll('[data-rep-quick-status]').forEach(btn => {
      btn.addEventListener('click', () => {
        const st = btn.getAttribute('data-rep-quick-status');
        state.reportFilter.status = state.reportFilter.status === st ? 'All' : st;
        state.pagination.reportsPage = 1;
        renderLeadsReportsView();
      });
    });

    viewDynamic.querySelectorAll('[data-rep-quick-settle]').forEach(btn => {
      btn.addEventListener('click', () => {
        const st = btn.getAttribute('data-rep-quick-settle');
        state.reportFilter.settlement = state.reportFilter.settlement === st ? 'All' : st;
        state.pagination.reportsPage = 1;
        renderLeadsReportsView();
      });
    });

    viewDynamic.querySelectorAll('[data-open-lead]').forEach(btn => {
      btn.addEventListener('click', () => openLeadDetailModal(Number(btn.getAttribute('data-open-lead'))));
    });

    document.getElementById('resetReportFiltersBtn')?.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const f = state.reportFilter;
      const hadFilters = f.status !== 'All' || f.category !== 'All' || f.settlement !== 'All' || f.source !== 'All' || f.fromDate || f.toDate;
      state.reportFilter = { status: 'All', category: 'All', settlement: 'All', source: 'All', fromDate: '', toDate: '' };
      state.pagination.reportsPage = 1;
      renderLeadsReportsView();
      showToast(hadFilters ? 'Report filters reset — showing all leads.' : 'No filters applied — already showing all leads.');
    });

    document.getElementById('genCsvReportBtn')?.addEventListener('click', () => {
      exportLeadsCSV(filtered, `AyushDoc_All_Leads_Report_${todayISO()}.csv`);
    });

    document.getElementById('genExcelReportBtn')?.addEventListener('click', () => {
      exportLeadsExcel(filtered, `AyushDoc_All_Leads_Report_${todayISO()}.xls`);
    });

    document.getElementById('genPdfReportBtn')?.addEventListener('click', () => {
      printLeadsPDFReport(filtered);
    });

    bindPaginationEvents(viewDynamic, 'reports', 'reportsPage', 'reportsPageSize', renderLeadsReportsView);
  }

  // ---- SETTLEMENT MANAGEMENT MODAL ----
  function openSettlementModal(partnerId, opts = {}) {
    const partner = state.partners.find(p => p.id === partnerId);
    if (!partner) return;
    const s = partner.settlement;
    const returnToLead = Boolean(opts.returnToLead);

    modalContent.classList.add('modal-wide');
    modalContent.innerHTML = `
      <div class="modal-header">
        <h3>💳 Settlement Tracking — ${partner.name}</h3>
        <button type="button" class="modal-close" id="closeModalBtn">✕</button>
      </div>
      <div class="settlement-kpi-strip">
        <div class="settlement-mini-box">
          <div class="mini-lbl">Deal Value</div>
          <div class="mini-val" id="settleModalDealDisp">${formatINR(s.dealValue)}</div>
          <div class="entity-sub" id="settleModalCommDisp">Comm (${s.commissionPct}%): ${formatINR(s.commissionAmount)}</div>
        </div>
        <div class="settlement-mini-box">
          <div class="mini-lbl">Total Paid</div>
          <div class="mini-val" style="color:#15803d;" id="settleModalPaidDisp">${formatINR(s.paidAmount)}</div>
          <div class="entity-sub" id="settleModalPctDisp">${s.settledPct}% settled</div>
        </div>
        <div class="settlement-mini-box">
          <div class="mini-lbl">Pending Balance</div>
          <div class="mini-val" style="color:${s.pendingAmount > 0 ? '#b91c1c' : '#15803d'};" id="settleModalPendDisp">${formatINR(s.pendingAmount)}</div>
          <div class="entity-sub" id="settleModalStatusDisp">${s.settlementStatus}</div>
        </div>
      </div>

      <form id="settlementForm">
        <div class="form-grid-2">
          <div class="form-group">
            <label>Total Deal Value (₹) *</label>
            <input type="number" name="dealValue" id="settleDealInput" min="0" value="${s.dealValue}" required />
          </div>
          <div class="form-group">
            <label>Partner Commission (%)</label>
            <input type="number" name="commissionPct" id="settleCommInput" min="0" max="100" value="${s.commissionPct}" />
          </div>
        </div>

        <div class="form-grid-2">
          <div class="form-group">
            <label>Record New Payment Amount (₹)</label>
            <div style="display:flex;gap:6px;">
              <input type="number" name="payAmount" id="settlePayInput" min="0" placeholder="0" value="${s.pendingAmount > 0 ? s.pendingAmount : 0}" style="flex:1;" />
              <button type="button" class="action-pill-btn pill-green" id="fillFullBalBtn">Full Bal</button>
            </div>
          </div>
          <div class="form-group">
            <label>Payment Mode</label>
            <select name="paymentMode">
              ${['NEFT/RTGS', 'UPI', 'IMPS', 'Bank Transfer', 'Cheque', 'Cash'].map(m => `<option value="${m}" ${s.paymentMode === m ? 'selected' : ''}>${m}</option>`).join('')}
            </select>
          </div>
        </div>

        <div class="form-grid-2">
          <div class="form-group">
            <label>UTR / Transaction Reference</label>
            <input type="text" name="utrNumber" value="${s.utrNumber || ''}" placeholder="e.g. AYU26119981" />
          </div>
          <div class="form-group">
            <label>Payment / Settlement Date</label>
            <input type="date" name="settledDate" value="${todayISO()}" />
          </div>
        </div>

        <div class="form-group">
          <label>Settlement Remarks / Notes</label>
          <input type="text" name="notes" value="${s.notes || ''}" placeholder="e.g. Final tranche cleared via HDFC NEFT" />
        </div>

        <div style="margin-top:8px;">
          <div style="font-size:12.5px;font-weight:700;color:#334155;">Payment Ledger (${s.transactions.length} transactions)</div>
          <div class="ledger-list">
            ${s.transactions.length === 0
              ? `<div class="entity-sub" style="padding:8px 0;">No settlement payments recorded yet.</div>`
              : s.transactions.map((tx, idx) => `
                  <div class="ledger-item">
                    <div>
                      <strong>${formatINR(tx.amount)}</strong> via <strong>${tx.mode}</strong>
                      <div class="entity-sub">${tx.date} • UTR: ${tx.utr || 'N/A'}${tx.note ? ' • ' + tx.note : ''}</div>
                    </div>
                    <div style="display:flex;align-items:center;gap:6px;">
                      <span class="status-badge badge-completed">Paid</span>
                      <button type="button" class="action-pill-btn" data-undo-tx="${idx}" title="Remove this payment entry" style="padding:3px 7px;font-size:11px;color:#b91c1c;border-color:#fecaca;">Undo</button>
                    </div>
                  </div>
                `).join('')
            }
          </div>
        </div>

        <div class="modal-actions modal-actions-split">
          <div>
            ${returnToLead ? `<button type="button" class="btn btn-outline" id="backToLeadProfileBtn">← Back to Lead Profile</button>` : ''}
          </div>
          <div class="modal-actions-right">
            <button type="button" class="btn btn-outline" id="cancelModalBtn">Close</button>
            <button type="submit" class="btn btn-whatsapp">💾 Save &amp; Record Settlement</button>
          </div>
        </div>
      </form>
    `;

    modalBackdrop.style.display = 'flex';
    const closeAndReset = () => { modalContent.classList.remove('modal-wide'); closeModal(); };
    document.getElementById('closeModalBtn').onclick = closeAndReset;
    document.getElementById('cancelModalBtn').onclick = closeAndReset;

    document.getElementById('backToLeadProfileBtn')?.addEventListener('click', () => {
      openLeadDetailModal(partner.id);
    });

    const updateLivePreview = () => {
      const deal = Math.max(0, Number(document.getElementById('settleDealInput')?.value) || 0);
      const commPct = Math.max(0, Math.min(100, Number(document.getElementById('settleCommInput')?.value) || 0));
      const addPay = Math.max(0, Number(document.getElementById('settlePayInput')?.value) || 0);
      const previewPaid = Math.min(deal, s.paidAmount + addPay);
      const previewMetrics = computeSettlementMetrics({ dealValue: deal, commissionPct: commPct, paidAmount: previewPaid });

      const dealEl = document.getElementById('settleModalDealDisp');
      const commEl = document.getElementById('settleModalCommDisp');
      const paidEl = document.getElementById('settleModalPaidDisp');
      const pctEl = document.getElementById('settleModalPctDisp');
      const pendEl = document.getElementById('settleModalPendDisp');
      const stEl = document.getElementById('settleModalStatusDisp');

      if (dealEl) dealEl.textContent = formatINR(previewMetrics.dealValue);
      if (commEl) commEl.textContent = `Comm (${previewMetrics.commissionPct}%): ${formatINR(previewMetrics.commissionAmount)}`;
      if (paidEl) paidEl.textContent = formatINR(previewMetrics.paidAmount);
      if (pctEl) pctEl.textContent = `${previewMetrics.settledPct}% settled${addPay > 0 ? ' (after save)' : ''}`;
      if (pendEl) {
        pendEl.textContent = formatINR(previewMetrics.pendingAmount);
        pendEl.style.color = previewMetrics.pendingAmount > 0 ? '#b91c1c' : '#15803d';
      }
      if (stEl) stEl.textContent = previewMetrics.settlementStatus;
    };

    document.getElementById('settleDealInput')?.addEventListener('input', updateLivePreview);
    document.getElementById('settleCommInput')?.addEventListener('input', updateLivePreview);
    document.getElementById('settlePayInput')?.addEventListener('input', updateLivePreview);
    updateLivePreview();

    document.getElementById('fillFullBalBtn')?.addEventListener('click', () => {
      const deal = Math.max(0, Number(document.getElementById('settleDealInput')?.value) || 0);
      const rem = Math.max(0, deal - s.paidAmount);
      const payEl = document.getElementById('settlePayInput');
      if (payEl) payEl.value = rem;
      updateLivePreview();
      showToast(rem > 0 ? `Filled remaining balance: ${formatINR(rem)}` : 'This lead is already fully settled!');
    });

    modalContent.querySelectorAll('[data-undo-tx]').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = Number(btn.getAttribute('data-undo-tx'));
        const removed = partner.settlement.transactions.splice(idx, 1)[0];
        const recalcPaid = partner.settlement.transactions.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
        const metrics = computeSettlementMetrics({
          dealValue: partner.settlement.dealValue,
          commissionPct: partner.settlement.commissionPct,
          paidAmount: recalcPaid
        });
        partner.settlement = {
          ...partner.settlement,
          ...metrics,
          paymentMode: partner.settlement.transactions[0]?.mode || '',
          utrNumber: partner.settlement.transactions[0]?.utr || '',
          settledDate: metrics.settlementStatus === 'Settled' ? (partner.settlement.transactions[0]?.date || '') : ''
        };
        persistState();
        refreshCurrentView();
        showToast(`Removed payment of ${formatINR(removed?.amount || 0)} from ledger`);
        openSettlementModal(partner.id, { returnToLead });
      });
    });

    document.getElementById('settlementForm').onsubmit = (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const newDeal = Math.max(0, Number(fd.get('dealValue')) || 0);
      const newComm = Math.max(0, Math.min(100, Number(fd.get('commissionPct')) || 0));
      const addPay = Math.max(0, Number(fd.get('payAmount')) || 0);
      const mode = fd.get('paymentMode').toString();
      const utr = fd.get('utrNumber').toString().trim() || `AYU${String(Date.now()).slice(-7)}`;
      const dt = fd.get('settledDate').toString() || todayISO();
      const notes = fd.get('notes').toString().trim();

      let totalPaid = s.paidAmount;
      const remainingBefore = Math.max(0, newDeal - totalPaid);
      if (addPay > 0 && remainingBefore === 0) {
        showToast('Already fully settled! Increase Deal Value if adding more.');
        return;
      }

      if (addPay > 0) {
        const appliedPay = Math.min(addPay, remainingBefore);
        if (appliedPay > 0) {
          totalPaid += appliedPay;
          partner.settlement.transactions.unshift({
            id: `TX-${Date.now()}`,
            date: dt,
            amount: appliedPay,
            mode,
            utr,
            note: notes || (totalPaid >= newDeal ? 'Full settlement completed' : 'Partial settlement payment')
          });
        }
      }

      const metrics = computeSettlementMetrics({
        dealValue: newDeal,
        commissionPct: newComm,
        paidAmount: totalPaid
      });

      partner.settlement = {
        ...partner.settlement,
        ...metrics,
        paymentMode: addPay > 0 ? mode : partner.settlement.paymentMode,
        utrNumber: addPay > 0 ? utr : partner.settlement.utrNumber,
        settledDate: metrics.settlementStatus === 'Settled' ? dt : partner.settlement.settledDate,
        notes
      };

      if (metrics.settlementStatus === 'Settled' && partner.status !== 'Onboarded') {
        updateLeadStatus(partner.id, 'Onboarded', `Full settlement completed (${utr})`);
      } else {
        persistState();
      }

      refreshCurrentView();
      window.AyushUserManagement?.logCrmEvent(
        'SETTLEMENT_UPDATED',
        'settlements',
        partner.id,
        `Updated settlement for ${partner.name}: paid=${formatINR(partner.settlement.paidAmount)} (${partner.settlement.settlementStatus})`
      );
      showToast(`Settlement saved for ${partner.name} (${partner.settlement.settlementStatus})!`);
      if (returnToLead) {
        openLeadDetailModal(partner.id);
      } else {
        closeAndReset();
      }
    };
  }

  // ---- SCROLL-WHEEL DATE & TIME PICKER HELPER ----
  function buildDateWheelOptions(currentVal = '') {
    const opts = ['Today', 'Tomorrow'];
    const base = new Date();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    for (let i = 2; i <= 15; i++) {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      opts.push(`${months[d.getMonth()]} ${d.getDate()}`);
    }
    const existingDay = String(currentVal || '').split(',')[0].trim();
    if (existingDay && existingDay !== 'Completed' && !opts.includes(existingDay)) {
      opts.unshift(existingDay);
    }
    return opts;
  }

  function parseFollowupString(val) {
    const str = String(val || '').trim();
    const m = str.match(/^([^,]+),\s*(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (m) {
      const day = m[1].trim();
      const hour = String(Math.min(12, Math.max(1, Number(m[2])))).padStart(2, '0');
      const rawMin = Math.round((Number(m[3]) || 0) / 5) * 5;
      const minute = String(rawMin >= 60 ? 55 : rawMin).padStart(2, '0');
      const ampm = m[4].toUpperCase();
      return { day, hour, minute, ampm };
    }
    return { day: 'Today', hour: '03', minute: '00', ampm: 'PM' };
  }

  function renderScrollTimePickerHTML(prefix, fieldName, initialValue) {
    const safeVal = initialValue || 'Today, 3:00 PM';
    const dayOpts = buildDateWheelOptions(safeVal);
    const hourOpts = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
    const minOpts = Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, '0'));
    const ampmOpts = ['AM', 'PM'];

    return `
      <div class="scroll-picker-wrap" id="${prefix}Wrap">
        <input type="hidden" name="${fieldName}" id="${prefix}HiddenInput" value="${safeVal}" />
        <button type="button" class="scroll-picker-trigger" id="${prefix}Trigger">
          <span id="${prefix}TriggerText">📅 ${safeVal}</span>
          <span style="font-size:11.5px;color:#0b57d0;font-weight:700;">🕒 Scroll Time ▾</span>
        </button>
        <div class="scroll-picker-popover" id="${prefix}Popover">
          <div class="wheel-header-row">
            <span>Day / Date</span>
            <span>Hour</span>
            <span>Min</span>
            <span>AM/PM</span>
          </div>
          <div class="wheel-stage">
            <div class="wheel-highlight-band"></div>
            <div class="wheel-col" id="${prefix}DayCol">
              ${dayOpts.map(d => `<div class="wheel-item" data-val="${d}">${d}</div>`).join('')}
            </div>
            <div class="wheel-col" id="${prefix}HourCol">
              ${hourOpts.map(h => `<div class="wheel-item" data-val="${h}">${h}</div>`).join('')}
            </div>
            <div class="wheel-col" id="${prefix}MinCol">
              ${minOpts.map(m => `<div class="wheel-item" data-val="${m}">${m}</div>`).join('')}
            </div>
            <div class="wheel-col" id="${prefix}AmpmCol">
              ${ampmOpts.map(a => `<div class="wheel-item" data-val="${a}">${a}</div>`).join('')}
            </div>
          </div>
          <div class="wheel-footer">
            <span class="wheel-preview-text" id="${prefix}Preview">Selected: ${safeVal}</span>
            <button type="button" class="action-pill-btn pill-blue" id="${prefix}DoneBtn">✓ Set Time</button>
          </div>
        </div>
      </div>
    `;
  }

  function initScrollTimePicker(prefix, initialValue) {
    const trigger = document.getElementById(`${prefix}Trigger`);
    const triggerText = document.getElementById(`${prefix}TriggerText`);
    const popover = document.getElementById(`${prefix}Popover`);
    const hiddenInput = document.getElementById(`${prefix}HiddenInput`);
    const previewEl = document.getElementById(`${prefix}Preview`);
    const doneBtn = document.getElementById(`${prefix}DoneBtn`);

    const cols = {
      day: document.getElementById(`${prefix}DayCol`),
      hour: document.getElementById(`${prefix}HourCol`),
      minute: document.getElementById(`${prefix}MinCol`),
      ampm: document.getElementById(`${prefix}AmpmCol`)
    };
    if (!trigger || !popover || !cols.day) return;

    const ITEM_H = 36;
    const selected = parseFollowupString(initialValue);

    const syncOutput = () => {
      const displayHour = String(Number(selected.hour));
      const formatted = `${selected.day}, ${displayHour}:${selected.minute} ${selected.ampm}`;
      if (hiddenInput) hiddenInput.value = formatted;
      if (triggerText) triggerText.textContent = `📅 ${formatted}`;
      if (previewEl) previewEl.textContent = `Selected: ${formatted}`;
    };

    const setColToValue = (colEl, key, val, instant = false) => {
      const items = Array.from(colEl.querySelectorAll('.wheel-item'));
      let idx = items.findIndex(el => el.getAttribute('data-val') === val);
      if (idx < 0) idx = 0;
      items.forEach((el, i) => el.classList.toggle('selected', i === idx));
      selected[key] = items[idx]?.getAttribute('data-val') || val;
      if (instant) {
        const prevBehavior = colEl.style.scrollBehavior;
        colEl.style.scrollBehavior = 'auto';
        colEl.scrollTop = idx * ITEM_H;
        colEl.style.scrollBehavior = prevBehavior;
      } else {
        colEl.scrollTo({ top: idx * ITEM_H, behavior: 'smooth' });
      }
    };

    Object.entries(cols).forEach(([key, colEl]) => {
      let scrollTimer;
      colEl.addEventListener('scroll', () => {
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(() => {
          const items = Array.from(colEl.querySelectorAll('.wheel-item'));
          const idx = Math.min(items.length - 1, Math.max(0, Math.round(colEl.scrollTop / ITEM_H)));
          items.forEach((el, i) => el.classList.toggle('selected', i === idx));
          const val = items[idx]?.getAttribute('data-val');
          if (val) {
            selected[key] = val;
            syncOutput();
          }
        }, 60);
      });

      colEl.querySelectorAll('.wheel-item').forEach((itemEl) => {
        itemEl.addEventListener('click', () => {
          const val = itemEl.getAttribute('data-val');
          setColToValue(colEl, key, val, false);
          syncOutput();
        });
      });
    });

    const alignAllInstant = () => {
      setColToValue(cols.day, 'day', selected.day, true);
      setColToValue(cols.hour, 'hour', selected.hour, true);
      setColToValue(cols.minute, 'minute', selected.minute, true);
      setColToValue(cols.ampm, 'ampm', selected.ampm, true);
    };

    trigger.addEventListener('click', () => {
      const isOpen = popover.classList.toggle('open');
      trigger.classList.toggle('open', isOpen);
      if (isOpen) {
        requestAnimationFrame(alignAllInstant);
      }
    });

    doneBtn?.addEventListener('click', () => {
      syncOutput();
      popover.classList.remove('open');
      trigger.classList.remove('open');
    });
  }

  function formatDateToFollowupLabel(isoDate, timeLabel) {
    if (!isoDate) return '';
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const [y, m, d] = isoDate.split('-').map(Number);
    if (!y || !m || !d) return '';
    const chosen = new Date(y, m - 1, d);
    const diffDays = Math.round((chosen.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let dayLabel = `${months[chosen.getMonth()]} ${chosen.getDate()}`;
    if (diffDays === 0) dayLabel = 'Today';
    else if (diffDays === 1) dayLabel = 'Tomorrow';
    return `${dayLabel}, ${timeLabel || '11:00 AM'}`;
  }

  function openQuickFollowupModal(partnerId) {
    const partner = state.partners.find(p => p.id === partnerId);
    if (!partner) return;

    const base = new Date();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const addDaysLabel = (days, time) => {
      const d = new Date(base);
      d.setDate(base.getDate() + days);
      return `${months[d.getMonth()]} ${d.getDate()}, ${time}`;
    };

    const presets = [
      { label: 'Today, 5:00 PM', val: 'Today, 5:00 PM' },
      { label: 'Tomorrow, 11:00 AM', val: 'Tomorrow, 11:00 AM' },
      { label: 'Tomorrow, 3:00 PM', val: 'Tomorrow, 3:00 PM' },
      { label: addDaysLabel(2, '11:00 AM'), val: addDaysLabel(2, '11:00 AM') },
      { label: addDaysLabel(7, '10:00 AM'), val: addDaysLabel(7, '10:00 AM') },
      { label: '✓ Completed', val: 'Completed' }
    ];

    const timeChoices = [
      '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
      '12:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM'
    ];

    const tomorrowISO = (() => {
      const t = new Date(base);
      t.setDate(base.getDate() + 1);
      return t.toISOString().slice(0, 10);
    })();

    modalContent.classList.remove('modal-wide');
    modalContent.innerHTML = `
      <div class="modal-header">
        <h3>📅 Fix Next Follow-up — ${partner.name}</h3>
        <button type="button" class="modal-close" id="closeModalBtn">✕</button>
      </div>
      <div class="entity-sub" style="margin:-8px 0 14px;">
        ${partner.specialty} • ${partner.city} • Current: <strong>${partner.followup || 'Not set'}</strong>
      </div>
      <form id="quickFollowupForm">
        <div class="form-group">
          <label>Quick Schedule Presets (1-Click)</label>
          <div class="fu-preset-grid">
            ${presets.map(pr => `
              <button type="button" class="fu-preset-btn ${partner.followup === pr.val ? 'active' : ''}" data-fu-preset="${pr.val}">
                ${pr.label}
              </button>
            `).join('')}
          </div>
        </div>
        <div class="form-grid-2">
          <div class="form-group">
            <label for="quickFuCalDate">Pick Calendar Date</label>
            <input type="date" id="quickFuCalDate" value="${tomorrowISO}" />
          </div>
          <div class="form-group">
            <label for="quickFuCalTime">Pick Time</label>
            <select id="quickFuCalTime">
              ${timeChoices.map(t => `<option value="${t}" ${t === '11:00 AM' ? 'selected' : ''}>${t}</option>`).join('')}
            </select>
          </div>
        </div>
        <div class="form-group">
          <label>Selected Follow-up Date &amp; Time (or Scroll Wheel)</label>
          ${renderScrollTimePickerHTML('quickFuPicker', 'followup', partner.followup === 'Completed' ? 'Tomorrow, 11:00 AM' : partner.followup)}
        </div>
        <div class="form-group">
          <label for="quickFuNote">Follow-up Note (Optional)</label>
          <input type="text" id="quickFuNote" placeholder="e.g. Call back to confirm onboarding docs..." autocomplete="off" />
        </div>
        <div class="modal-actions">
          <button type="button" class="btn btn-outline" id="cancelModalBtn">Cancel</button>
          <button type="submit" class="btn btn-primary" id="saveQuickFuBtn">✓ Save Follow-up Date</button>
        </div>
      </form>
    `;
    modalBackdrop.style.display = 'flex';
    document.getElementById('closeModalBtn').onclick = closeModal;
    document.getElementById('cancelModalBtn').onclick = closeModal;

    const hiddenInput = document.getElementById('quickFuPickerHiddenInput');
    const triggerText = document.getElementById('quickFuPickerTriggerText');
    const previewEl = document.getElementById('quickFuPickerPreview');
    const initialVal = partner.followup || 'Tomorrow, 11:00 AM';
    if (hiddenInput) hiddenInput.value = initialVal;
    if (triggerText) triggerText.textContent = `📅 ${initialVal}`;
    if (previewEl) previewEl.textContent = `Selected: ${initialVal}`;

    initScrollTimePicker('quickFuPicker', partner.followup === 'Completed' ? 'Tomorrow, 11:00 AM' : partner.followup);

    const applyFollowupValue = (val) => {
      if (hiddenInput) hiddenInput.value = val;
      if (triggerText) triggerText.textContent = val === 'Completed' ? '✓ Completed' : `📅 ${val}`;
      if (previewEl) previewEl.textContent = `Selected: ${val}`;
      modalContent.querySelectorAll('[data-fu-preset]').forEach(b => {
        b.classList.toggle('active', b.getAttribute('data-fu-preset') === val);
      });
    };

    modalContent.querySelectorAll('[data-fu-preset]').forEach(btn => {
      btn.addEventListener('click', () => {
        applyFollowupValue(btn.getAttribute('data-fu-preset'));
      });
    });

    const calDateEl = document.getElementById('quickFuCalDate');
    const calTimeEl = document.getElementById('quickFuCalTime');
    const syncFromCal = () => {
      const formatted = formatDateToFollowupLabel(calDateEl?.value, calTimeEl?.value);
      if (formatted) applyFollowupValue(formatted);
    };
    calDateEl?.addEventListener('change', syncFromCal);
    calTimeEl?.addEventListener('change', syncFromCal);

    document.getElementById('quickFollowupForm').onsubmit = (e) => {
      e.preventDefault();
      const newFollowup = (hiddenInput?.value || '').trim() || 'Tomorrow, 11:00 AM';
      const note = (document.getElementById('quickFuNote')?.value || '').trim();
      const prevFollowup = partner.followup;
      partner.followup = newFollowup;
      if (!Array.isArray(partner.statusHistory)) partner.statusHistory = [];
      partner.statusHistory.unshift({
        status: partner.status,
        date: todayISO(),
        note: note || `Follow-up updated from "${prevFollowup || 'Not set'}" to "${newFollowup}"`
      });
      persistState();
      closeModal();
      refreshCurrentView();
      showToast(`📅 Follow-up for ${partner.name} set to ${newFollowup}`);
    };
  }

  // ---- LEAD DETAILS & STATUS TIMELINE MODAL ----
  function openLeadDetailModal(partnerId) {
    const partner = state.partners.find(p => p.id === partnerId);
    if (!partner) return;
    const s = partner.settlement;

    modalContent.classList.add('modal-wide');
    modalContent.innerHTML = `
      <div class="modal-header">
        <h3>📋 Lead Profile &amp; Status History — ${partner.name}</h3>
        <button type="button" class="modal-close" id="closeModalBtn">✕</button>
      </div>
      <form id="leadDetailForm">
        <div class="form-grid-2">
          <div class="form-group">
            <label>Lead Status</label>
            <select name="status" id="leadDetailStatusSel">
              ${LEAD_STATUSES.map(st => `<option value="${st}" ${partner.status === st ? 'selected' : ''}>${st}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label>Assigned Executive</label>
            <input type="text" name="assignedTo" value="${partner.assignedTo}" placeholder="Enter executive name" autocomplete="off" />
          </div>
        </div>
        <div class="form-grid-2">
          <div class="form-group">
            <label>Lead Source</label>
            <input type="text" name="leadSource" value="${partner.leadSource}" placeholder="Enter lead source" autocomplete="off" />
          </div>
          <div class="form-group">
            <label>Next Follow-up</label>
            ${renderScrollTimePickerHTML('leadFuPicker', 'followup', partner.followup)}
          </div>
        </div>
        <div class="form-group">
          <label>Status Update Note (Optional)</label>
          <input type="text" name="statusNote" placeholder="e.g. Doctor confirmed onboarding fee transfer" />
        </div>

        <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:12px;margin:10px 0;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;">
          <div>
            <div style="font-size:12px;font-weight:700;color:#64748b;">SETTLEMENT SUMMARY</div>
            <div style="font-size:14px;font-weight:800;color:#0f2547;margin-top:2px;">
              Paid ${formatINR(s.paidAmount)} / ${formatINR(s.dealValue)}
              <span class="entity-sub">(${s.settlementStatus} • Bal ${formatINR(s.pendingAmount)})</span>
            </div>
          </div>
          <button type="button" class="action-pill-btn pill-green" id="jumpToSettleFromLeadBtn">💳 Manage Settlement</button>
        </div>

        <div style="margin-top:10px;">
          <div style="font-size:12.5px;font-weight:700;color:#334155;">Status Change Timeline (${partner.statusHistory.length})</div>
          <div class="timeline-list">
            ${partner.statusHistory.map(h => `
              <div class="timeline-item">
                <div style="font-size:13px;font-weight:700;color:#0f2547;">${h.status} <span class="entity-sub">• ${h.date}</span></div>
                <div class="entity-sub">${h.note || ''}</div>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="modal-actions">
          <button type="button" class="btn btn-outline" id="cancelModalBtn">Close</button>
          <button type="submit" class="btn btn-primary">Save Lead Changes</button>
        </div>
      </form>
    `;

    modalBackdrop.style.display = 'flex';
    initScrollTimePicker('leadFuPicker', partner.followup);
    const closeAndReset = () => { modalContent.classList.remove('modal-wide'); closeModal(); };
    document.getElementById('closeModalBtn').onclick = closeAndReset;
    document.getElementById('cancelModalBtn').onclick = closeAndReset;

    const saveLeadFormValues = () => {
      const formEl = document.getElementById('leadDetailForm');
      if (!formEl) return false;
      const fd = new FormData(formEl);
      const newStatus = fd.get('status').toString();
      const note = fd.get('statusNote').toString().trim();
      const newAssigned = fd.get('assignedTo').toString().trim() || partner.assignedTo;
      const newSource = fd.get('leadSource').toString().trim() || partner.leadSource;
      const newFollowup = fd.get('followup').toString().trim() || partner.followup;

      const changed = (
        newStatus !== partner.status ||
        Boolean(note) ||
        newAssigned !== partner.assignedTo ||
        newSource !== partner.leadSource ||
        newFollowup !== partner.followup
      );

      partner.assignedTo = newAssigned;
      partner.leadSource = newSource;
      partner.followup = newFollowup;

      if (newStatus !== partner.status || note) {
        updateLeadStatus(partner.id, newStatus, note || `Status updated to ${newStatus}`, true);
      } else if (changed) {
        persistState();
      }
      if (changed) {
        refreshCurrentView();
        window.AyushUserManagement?.logCrmEvent(
          'LEAD_ASSIGNED',
          'leads',
          partner.id,
          `Updated lead ${partner.name}: status=${partner.status}, assignedTo=${partner.assignedTo}`
        );
      }
      return changed;
    };

    document.getElementById('jumpToSettleFromLeadBtn')?.addEventListener('click', () => {
      saveLeadFormValues();
      openSettlementModal(partner.id, { returnToLead: true });
    });

    document.getElementById('leadDetailForm').onsubmit = (e) => {
      e.preventDefault();
      saveLeadFormValues();
      closeAndReset();
      showToast(`Saved updates for ${partner.name}`);
    };
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
        <div class="table-no-scroll table-compact">
          <table class="data-table">
            <thead>
              <tr>
                <th>Partner / Lead</th>
                <th>Specialty • City</th>
                <th>Follow-up Schedule</th>
                <th>Status</th>
                <th>Quick Action</th>
              </tr>
            </thead>
            <tbody>
              ${pager.pageItems.map(p => `
                <tr>
                  <td data-label="Partner / Lead" class="td-primary">
                    <div class="followup-entity">
                      <div class="avatar-circle ${p.color}">${p.initials}</div>
                      <div class="entity-info">
                        <div class="entity-name">${p.name}</div>
                        <div class="entity-sub">${p.type.slice(0, -1)} • ${p.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td data-label="Specialty • City">${p.specialty} • ${p.city}</td>
                  <td data-label="Follow-up Schedule" style="white-space:nowrap;">
                    <button type="button" class="fu-inline-edit-btn" data-edit-followup="${p.id}" title="Click to fix / schedule follow-up date">
                      <span>📅 ${p.followup}</span>
                    </button>
                  </td>
                  <td data-label="Status"><span class="status-badge ${p.badge}">${p.status}</span></td>
                  <td data-label="Quick Action" class="td-action">
                    <div class="followup-actions">
                      <button type="button" class="wa-action-btn" data-wa="${p.name}" data-wa-phone="${p.phone}">
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
        ${renderPaginationBarHTML(pager, state.pagination.followupsPageSize, 'followups')}
      </div>
    `;

    document.getElementById('inlineNewFollowupBtn')?.addEventListener('click', openNewFollowupModal);
    bindPaginationEvents(viewDynamic, 'followups', 'followupsPage', 'followupsPageSize', renderFollowupsView);
  }

  // ---- 1. WHATSAPP CAMPAIGNS VIEW (Clean, Minimal Broadcasts & Templates UI) ----
  function renderCampaignsView(filterSegment = 'All') {
    const filteredCampaigns = filterSegment === 'All'
      ? state.campaigns
      : state.campaigns.filter(c => c.segment.toLowerCase().includes(filterSegment.toLowerCase()));

    const pager = paginateArray(filteredCampaigns, state.pagination.campaignsPage, state.pagination.campaignsPageSize);
    state.pagination.campaignsPage = pager.currentPage;

    const totalSent = state.campaigns.reduce((acc, c) => acc + (Number(c.sent) || 0), 0);
    const totalReplied = state.campaigns.reduce((acc, c) => acc + (Number(c.replied) || 0), 0);

    const segPillClass = (seg) => {
      const s = String(seg || '').toLowerCase();
      if (s.includes('clinic')) return 'wa-seg-clinics';
      if (s.includes('hosp')) return 'wa-seg-hospitals';
      return 'wa-seg-doctors';
    };

    const templates = [
      {
        name: 'Doctor Onboarding Invite',
        segment: 'Doctors',
        preview: 'Invite doctors to join AyushDoc+ Partner Network to digitize appointments & prescriptions.',
        body: 'Namaste Doctor, join AyushDoc+ Partner Network to digitize appointments & prescriptions. Reply YES for instant onboarding.'
      },
      {
        name: 'Clinic Partnership Outreach',
        segment: 'Clinics',
        preview: 'Reach Ayurveda & Siddha clinics to list on AyushDoc+ and grow patient bookings.',
        body: 'Greetings, list your Ayurveda/Siddha clinic on AyushDoc+ and grow patient bookings. Reply YES for quick setup.'
      },
      {
        name: 'Hospital Collaboration Drive',
        segment: 'Hospitals',
        preview: 'Connect with multi-specialty AYUSH hospitals for integrated IPD/OPD referrals.',
        body: 'Dear Hospital Management, partner with AyushDoc+ for integrated IPD/OPD referrals. Reply DEMO to schedule a walkthrough.'
      }
    ];

    viewDynamic.innerHTML = `
      <section class="wa-summary-strip">
        <div class="wa-stat-card">
          <div>
            <div class="wa-stat-label">Total Campaigns</div>
            <div class="wa-stat-value">${state.campaigns.length}</div>
          </div>
          <div class="wa-stat-icon ic-blue">📣</div>
        </div>
        <div class="wa-stat-card">
          <div>
            <div class="wa-stat-label">Messages Sent</div>
            <div class="wa-stat-value">${totalSent.toLocaleString()}</div>
          </div>
          <div class="wa-stat-icon ic-green">✓</div>
        </div>
        <div class="wa-stat-card">
          <div>
            <div class="wa-stat-label">Partner Replies</div>
            <div class="wa-stat-value">${totalReplied.toLocaleString()}</div>
          </div>
          <div class="wa-stat-icon ic-purple">💬</div>
        </div>
      </section>

      <div class="panel-card">
        <div class="panel-header">
          <div class="panel-title">
            <h2>Quick Message Templates</h2>
          </div>
        </div>
        <div class="wa-tpl-grid">
          ${templates.map((t, idx) => `
            <div class="wa-tpl-card">
              <div class="wa-tpl-head">
                <div class="wa-tpl-title">${t.name}</div>
                <span class="wa-seg-pill ${segPillClass(t.segment)}">${t.segment}</span>
              </div>
              <div class="wa-tpl-msg">${t.preview}</div>
              <div class="wa-tpl-foot">
                <button type="button" class="wa-action-btn use-template-btn" data-tpl-idx="${idx}">
                  ${waSvgIcon}
                  <span>Use Template</span>
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="panel-card">
        <div class="panel-header broadcast-toolbar">
          <div class="filter-tabs" id="campaignSegmentTabs">
            ${['All', 'Doctors', 'Clinics', 'Hospitals'].map(seg => {
              const count = seg === 'All'
                ? state.campaigns.length
                : state.campaigns.filter(c => c.segment.toLowerCase().includes(seg.toLowerCase())).length;
              return `
                <button class="filter-tab ${filterSegment === seg ? 'active' : ''}" data-seg="${seg}">
                  ${seg === 'All' ? `All (${count})` : `${seg} (${count})`}
                </button>
              `;
            }).join('')}
          </div>
          <button type="button" class="btn btn-whatsapp" id="inlineLaunchCampaignBtn">+ New Broadcast</button>
        </div>
        <div class="table-no-scroll table-compact">
          <table class="data-table">
            <thead>
              <tr>
                <th>Campaign</th>
                <th>Audience</th>
                <th>Date</th>
                <th>Sent</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              ${pager.pageItems.map(c => `
                <tr>
                  <td data-label="Campaign" class="td-primary"><strong>${c.title}</strong></td>
                  <td data-label="Audience"><span class="wa-seg-pill ${segPillClass(c.segment)}">${c.segment}</span></td>
                  <td data-label="Date" style="white-space:nowrap;">${c.date}</td>
                  <td data-label="Sent" style="white-space:nowrap;"><strong>${c.sent.toLocaleString()}</strong></td>
                  <td data-label="Status"><span class="status-badge badge-completed">${c.status}</span></td>
                  <td data-label="Action" class="td-action">
                    <div class="followup-actions">
                      <button type="button" class="wa-action-btn clone-campaign-btn" data-title="${c.title}" data-seg="${c.segment}">
                        ${waSvgIcon}
                        <span>Send Again</span>
                      </button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        ${renderPaginationBarHTML(pager, state.pagination.campaignsPageSize, 'campaigns')}
      </div>
    `;

    document.getElementById('inlineLaunchCampaignBtn')?.addEventListener('click', () => openWaCampaignModal());

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

  // ---- 2. CAMPAIGN REPORTS VIEW (Simplified KPIs + Vertical Bar Chart + Donut Chart) ----
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

    const segPillClass = (seg) => {
      const s = String(seg || '').toLowerCase();
      if (s.includes('clinic')) return 'wa-seg-clinics';
      if (s.includes('hosp')) return 'wa-seg-hospitals';
      return 'wa-seg-doctors';
    };

    // Vertical column chart geometry
    const maxVal = Math.max(1, totalSent);
    const chartTop = 26;
    const chartBottom = 154;
    const maxH = chartBottom - chartTop;
    const bars = [
      { label: 'Sent', sub: '100%', val: totalSent, color: '#2563eb', x: 48 },
      { label: 'Delivered', sub: `${delivPct}%`, val: totalDelivered, color: '#0d9488', x: 146 },
      { label: 'Read', sub: `${readPct}%`, val: totalRead, color: '#16a34a', x: 244 },
      { label: 'Replied', sub: `${replyPct}%`, val: totalReplied, color: '#f59e0b', x: 342 }
    ].map(b => {
      const h = Math.max(10, Math.round((b.val / maxVal) * maxH));
      return { ...b, h, y: chartBottom - h };
    });

    // Dynamic Audience Share Donut Ring geometry
    const segDefs = [
      { key: 'Doctors', color: '#2563eb' },
      { key: 'Clinics', color: '#16a34a' },
      { key: 'Hospitals', color: '#7c3aed' }
    ];
    const segTotals = segDefs.map(sd => {
      const list = state.campaigns.filter(c => c.segment.toLowerCase().includes(sd.key.toLowerCase()));
      const sent = list.reduce((s, c) => s + c.sent, 0);
      const read = list.reduce((s, c) => s + c.read, 0);
      const replied = list.reduce((s, c) => s + c.replied, 0);
      const share = totalSent ? Math.round((sent / totalSent) * 100) : 0;
      const rRate = read ? ((replied / read) * 100).toFixed(1) : '0.0';
      return { ...sd, sent, share, rRate };
    });
    const radius = 62;
    const circumference = 2 * Math.PI * radius;
    let offsetAcc = 0;
    const donutSegments = segTotals.map(st => {
      const len = totalSent ? (st.sent / totalSent) * circumference : 0;
      const seg = { ...st, dash: `${len.toFixed(1)} ${(circumference - len).toFixed(1)}`, offset: (-offsetAcc).toFixed(1) };
      offsetAcc += len;
      return seg;
    });

    viewDynamic.innerHTML = `
      <div class="kpi-grid">
        <div class="kpi-card kpi-blue">
          <div class="kpi-details">
            <div class="kpi-title">Messages Sent</div>
            <div class="kpi-value">${totalSent.toLocaleString()}</div>
            <div class="kpi-trend"><span class="trend-sub">${state.campaigns.length} campaigns</span></div>
          </div>
        </div>
        <div class="kpi-card kpi-green">
          <div class="kpi-details">
            <div class="kpi-title">Delivered</div>
            <div class="kpi-value">${delivPct}%</div>
            <div class="kpi-trend"><span class="trend-sub">${totalDelivered.toLocaleString()} reached</span></div>
          </div>
        </div>
        <div class="kpi-card kpi-orange">
          <div class="kpi-details">
            <div class="kpi-title">Opened / Read</div>
            <div class="kpi-value">${readPct}%</div>
            <div class="kpi-trend"><span class="trend-sub">${totalRead.toLocaleString()} opened</span></div>
          </div>
        </div>
        <div class="kpi-card kpi-purple">
          <div class="kpi-details">
            <div class="kpi-title">Replies</div>
            <div class="kpi-value">${totalReplied.toLocaleString()}</div>
            <div class="kpi-trend"><span class="trend-up">${replyPct}%</span> <span class="trend-sub">reply rate</span></div>
          </div>
        </div>
      </div>

      <div class="rep-charts-grid">
        <div class="panel-card">
          <div class="panel-header" style="margin-bottom:8px;">
            <div class="panel-title"><h2>Campaign Funnel Overview</h2></div>
          </div>
          <svg viewBox="0 0 440 198" class="rep-bar-svg">
            <g stroke="#eef2f7" stroke-width="1">
              <line x1="20" y1="26" x2="420" y2="26" />
              <line x1="20" y1="69" x2="420" y2="69" />
              <line x1="20" y1="112" x2="420" y2="112" />
              <line x1="20" y1="154" x2="420" y2="154" stroke="#cbd5e1" />
            </g>
            ${bars.map(b => `
              <g>
                <rect x="${b.x}" y="${b.y}" width="52" height="${b.h}" rx="8" fill="${b.color}" opacity="0.92" />
                <text x="${b.x + 26}" y="${b.y - 8}" text-anchor="middle" fill="#0f2547" font-size="12" font-weight="800">${b.val.toLocaleString()}</text>
                <text x="${b.x + 26}" y="173" text-anchor="middle" fill="#334155" font-size="12" font-weight="700">${b.label}</text>
                <text x="${b.x + 26}" y="189" text-anchor="middle" fill="#64748b" font-size="11" font-weight="600">${b.sub}</text>
              </g>
            `).join('')}
          </svg>
        </div>

        <div class="panel-card">
          <div class="panel-header" style="margin-bottom:8px;">
            <div class="panel-title"><h2>Audience Share</h2></div>
          </div>
          <div class="rep-donut-layout">
            <svg viewBox="0 0 160 160" class="rep-donut-svg">
              <circle cx="80" cy="80" r="${radius}" fill="none" stroke="#eef2f7" stroke-width="18" />
              <g transform="rotate(-90 80 80)">
                ${donutSegments.map(seg => `
                  <circle cx="80" cy="80" r="${radius}" fill="none" stroke="${seg.color}" stroke-width="18"
                    stroke-dasharray="${seg.dash}" stroke-dashoffset="${seg.offset}" />
                `).join('')}
              </g>
              <text x="80" y="76" text-anchor="middle" fill="#0f2547" font-size="19" font-weight="800">${totalSent.toLocaleString()}</text>
              <text x="80" y="94" text-anchor="middle" fill="#64748b" font-size="11" font-weight="600">Total Sent</text>
            </svg>
            <div class="rep-donut-legend">
              ${segTotals.map(st => `
                <div class="rep-legend-row">
                  <div class="rep-legend-left">
                    <span class="rep-legend-dot" style="background:${st.color};"></span>
                    <span>${st.key}</span>
                  </div>
                  <div class="rep-legend-right">
                    <div>${st.share}%</div>
                    <div class="rep-legend-sub">${st.rRate}% reply</div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>

      <div class="panel-card">
        <div class="panel-header">
          <div class="panel-title"><h2>Campaign Performance (${state.campaigns.length})</h2></div>
          <button type="button" class="btn btn-outline" id="exportReportCsvBtn">📥 Export CSV</button>
        </div>
        <div class="table-no-scroll table-compact">
          <table class="data-table">
            <thead>
              <tr>
                <th>Campaign</th>
                <th>Audience</th>
                <th>Sent</th>
                <th>Delivered</th>
                <th>Read</th>
                <th>Replies</th>
              </tr>
            </thead>
            <tbody>
              ${pager.pageItems.map(c => {
                const dRate = c.sent ? Math.round((c.delivered / c.sent) * 100) : 0;
                const rRate = c.delivered ? Math.round((c.read / c.delivered) * 100) : 0;
                const convRate = c.read ? ((c.replied / c.read) * 100).toFixed(1) : '0.0';
                return `
                  <tr>
                    <td data-label="Campaign" class="td-primary"><strong>${c.title}</strong></td>
                    <td data-label="Audience"><span class="wa-seg-pill ${segPillClass(c.segment)}">${c.segment}</span></td>
                    <td data-label="Sent"><strong>${c.sent.toLocaleString()}</strong></td>
                    <td data-label="Delivered">${c.delivered.toLocaleString()} <span class="entity-sub">(${dRate}%)</span></td>
                    <td data-label="Read">${c.read.toLocaleString()} <span class="entity-sub">(${rRate}%)</span></td>
                    <td data-label="Replies"><strong style="color:#15803d;">${c.replied.toLocaleString()}</strong> <span class="entity-sub">(${convRate}%)</span></td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
        ${renderPaginationBarHTML(pager, state.pagination.campaignsPageSize, 'campaigns')}
      </div>
    `;

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

  // ---- REAL DB-BACKED TEAM & ROLES VIEW ----
  function renderTeamView() {
    if (window.AyushUserManagement && typeof window.AyushUserManagement.renderTeamRolesView === 'function') {
      window.AyushUserManagement.renderTeamRolesView(viewDynamic);
      return;
    }
    viewDynamic.innerHTML = `<div class="panel-card"><div class="um-empty-state">User Management module is loading...</div></div>`;
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
      state.pagination.settlementsPage = 1;
      state.pagination.reportsPage = 1;
    }
    state.currentView = viewKey;
    setActiveSidebarItem(viewKey);

    const meta = viewMeta[viewKey] || viewMeta['dashboard'];
    pageMainHeading.innerHTML = meta.title;
    pageSubHeading.textContent = meta.sub;
    syncHeaderActions(viewKey);

    if (viewKey === 'dashboard') {
      viewDashboard.style.display = 'flex';
      viewDynamic.style.display = 'none';
      syncDashboardCounts();
      return;
    }

    viewDashboard.style.display = 'none';
    viewDynamic.style.display = 'flex';

    if (window.AyushUserManagement && !window.AyushUserManagement.checkViewAccess(viewKey, viewDynamic)) {
      return;
    }

    if (viewKey === 'partners-all') renderPartnersView('All', searchQuery);
    else if (viewKey === 'doctors') renderPartnersView('Doctors', searchQuery);
    else if (viewKey === 'clinics') renderPartnersView('Clinics', searchQuery);
    else if (viewKey === 'hospitals') renderPartnersView('Hospitals', searchQuery);
    else if (viewKey === 'leads') renderLeadsView();
    else if (viewKey === 'leads-upload') renderLeadsUploadView();
    else if (viewKey === 'settlements') renderSettlementsView();
    else if (viewKey === 'leads-reports') renderLeadsReportsView();
    else if (viewKey === 'followups') renderFollowupsView();
    else if (viewKey === 'campaigns') renderCampaignsView('All');
    else if (viewKey === 'reports') renderReportsView();
    else if (viewKey === 'automation') renderAutomationView();
    else if (viewKey === 'user-management') {
      if (window.AyushUserManagement) window.AyushUserManagement.renderView(viewDynamic);
    }
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
  document.getElementById('topWaStatusBtn')?.remove();
  document.querySelectorAll('.wa-connected-pill').forEach(el => el.remove());

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
    const authUser = window.AyushUserManagement?.getCurrentUser?.() || null;
    const displayName = authUser ? authUser.full_name : (document.getElementById('headerUserName')?.textContent || 'Sign In');
    const displayRole = authUser ? authUser.role_name : (document.getElementById('headerUserOrg')?.textContent || 'AyushDoc+ CRM');
    const displayEmail = authUser ? authUser.email : 'Not signed in';

    userDropdown.innerHTML = `
      <div class="dropdown-head" style="flex-direction:column;align-items:flex-start;gap:2px;">
        <strong>${displayName} — ${displayRole}</strong>
        <span style="font-size:11.5px;color:#64748b;">${displayEmail}</span>
      </div>
      ${authUser ? `
        <button class="menu-list-item" id="umProfileMenuBtn">👤 My Account &amp; Security</button>
        <button class="menu-list-item" id="umManageMenuBtn">🛡️ User Management</button>
        <button class="menu-list-item" id="teamMenuBtn">👥 Team &amp; Roles</button>
        <button class="menu-list-item" id="wabaSettingsMenuBtn">⚙️ WABA &amp; CRM Settings</button>
        <button class="menu-list-item danger" id="signOutMenuBtn">🚪 Sign Out</button>
      ` : `
        <button class="menu-list-item" id="umSignInMenuBtn">🔐 Sign In / Setup Admin</button>
        <button class="menu-list-item" id="teamMenuBtn">👥 Team &amp; Roles</button>
        <button class="menu-list-item" id="wabaSettingsMenuBtn">⚙️ WABA &amp; CRM Settings</button>
      `}
    `;

    document.getElementById('umProfileMenuBtn')?.addEventListener('click', () => {
      userDropdown.classList.remove('open');
      window.AyushUserManagement?.setActiveTab('profile');
      switchView('user-management');
    });
    document.getElementById('umManageMenuBtn')?.addEventListener('click', () => {
      userDropdown.classList.remove('open');
      window.AyushUserManagement?.setActiveTab('users');
      switchView('user-management');
    });
    document.getElementById('umSignInMenuBtn')?.addEventListener('click', () => {
      userDropdown.classList.remove('open');
      switchView('user-management');
    });
    document.getElementById('teamMenuBtn')?.addEventListener('click', () => {
      userDropdown.classList.remove('open');
      switchView('team');
    });
    document.getElementById('wabaSettingsMenuBtn')?.addEventListener('click', () => {
      userDropdown.classList.remove('open');
      switchView('settings');
    });
    document.getElementById('signOutMenuBtn')?.addEventListener('click', async () => {
      userDropdown.classList.remove('open');
      if (window.AyushUserManagement?.logout) {
        await window.AyushUserManagement.logout();
        switchView('user-management');
      }
    });
  }

  renderNotifications();
  renderUserDropdown();
  window.addEventListener('ayush-auth-changed', renderUserDropdown);

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
    modalContent.classList.remove('modal-wide');
  }

  modalBackdrop?.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop?.style.display === 'flex') {
      closeModal();
    }
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
        <div class="modal-actions modal-actions-split">
          <button type="button" class="btn btn-outline" id="cancelModalBtn">Cancel</button>
          <div class="modal-actions-right">
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

      const cleanPhone = phone.replace(/[^0-9]/g, '');
      const existingPartner = state.partners.find(p => {
        const sameName = p.name.trim().toLowerCase() === name.toLowerCase();
        const pDigits = (p.phone || '').replace(/[^0-9]/g, '');
        const samePhone = cleanPhone.length >= 7 && pDigits === cleanPhone;
        return sameName || samePhone;
      });

      if (existingPartner) {
        existingPartner.name = name;
        existingPartner.type = type;
        existingPartner.specialty = specialty;
        existingPartner.city = city;
        existingPartner.phone = phone;
        existingPartner.initials = initials;
        persistState();
        syncDashboardCounts();
        renderDashboardFollowups();
        closeModal();
        showToast(`Updated existing partner "${name}" (duplicate prevented)`);
        if (state.currentView !== 'dashboard') switchView(state.currentView);
        if (openWaAfterSave) openDirectWhatsAppModal(name, phone);
        return;
      }

      state.partners.unshift(normalizePartner({
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
        followup: 'Today, 5:00 PM',
        leadSource: 'Manual Entry',
        createdDate: todayISO()
      }, 0));

      persistState();
      syncDashboardCounts();

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
          ${renderScrollTimePickerHTML('newFuPicker', 'time', 'Tomorrow, 11:30 AM')}
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
        <div class="modal-actions modal-actions-split">
          <button type="button" class="btn btn-outline" id="cancelModalBtn">Cancel</button>
          <div class="modal-actions-right">
            <button type="submit" class="btn btn-primary">Schedule Follow-up</button>
            <button type="submit" class="btn btn-whatsapp" id="scheduleAndWaBtn">Schedule &amp; WhatsApp</button>
          </div>
        </div>
      </form>
    `;
    modalBackdrop.style.display = 'flex';
    initScrollTimePicker('newFuPicker', 'Tomorrow, 11:30 AM');
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

      const cleanPhoneFu = phone.replace(/[^0-9]/g, '');
      const existing = state.partners.find(p => {
        const sameName = p.name.trim().toLowerCase() === name.toLowerCase();
        const pDigits = (p.phone || '').replace(/[^0-9]/g, '');
        const samePhone = cleanPhoneFu.length >= 7 && pDigits === cleanPhoneFu;
        return sameName || samePhone;
      });
      if (existing) {
        existing.followup = time;
        existing.status = status;
        existing.badge = badgeMap[status] || 'badge-interested';
        existing.phone = phone;
      } else {
        state.partners.unshift(normalizePartner({
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
          followup: time,
          leadSource: 'Follow-up Schedule',
          createdDate: todayISO()
        }, 0));
      }

      persistState();
      syncDashboardCounts();

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
          <div class="share-num-row">
            <input type="text" id="waSharePhone" value="${defaultShareNumber}" placeholder="Enter WhatsApp number to share..." style="flex:1;min-width:0;" />
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
        <div class="modal-actions modal-actions-split">
          <button type="button" class="btn btn-outline" id="cancelModalBtn">Cancel</button>
          <div class="modal-actions-right">
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

  // Delegated WhatsApp & Quick Follow-up listeners
  document.body.addEventListener('click', (e) => {
    const fuBtn = e.target.closest('[data-edit-followup]');
    if (fuBtn) {
      openQuickFollowupModal(Number(fuBtn.getAttribute('data-edit-followup')));
      return;
    }
    const waBtn = e.target.closest('[data-wa]');
    if (waBtn) {
      const name = waBtn.getAttribute('data-wa');
      const phone = waBtn.getAttribute('data-wa-phone') || '';
      openDirectWhatsAppModal(name, phone);
    }
  });

  // Initialize User Management Module & Hash Routing (#user-management, #activate, #reset-password)
  if (window.AyushUserManagement) {
    window.AyushUserManagement.init({
      toastFn: showToast,
      modalBackdrop,
      modalContent,
    });
    const handleHashRoute = () => {
      const h = window.location.hash || '';
      if (h === '#user-management' || h.startsWith('#activate?') || h.startsWith('#reset-password?')) {
        switchView('user-management');
      }
    };
    window.addEventListener('hashchange', handleHashRoute);
    handleHashRoute();
  }
});
