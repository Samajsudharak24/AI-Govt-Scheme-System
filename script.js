// ==========================================
// YOJANASETU AI - WEB APP LOGIC & STATE ENGINE
// ==========================================

// Mock Schemes Dataset
const SCHEMES_DATABASE = [
  {
    id: 'pmss',
    name: 'Prime Minister\'s Scholarship Scheme (PMSS)',
    department: 'Ministry of Home Affairs, Govt of India',
    category: 'Education',
    benefits: '₹3,000/month for female students, ₹2,500/month for male students.',
    eligibilityDesc: 'Age 18-25. Must be pursuing professional degree courses. Income limit applies.',
    ageMin: 18,
    ageMax: 25,
    states: ['All States', 'Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'Uttar Pradesh', 'Gujarat'],
    occupations: ['Student'],
    incomeMax: 600000,
    deadline: 'July 31, 2026',
    deadlineDays: 71,
    documentList: ['Admit Card/Fee Receipt', 'Aadhaar Card', 'Parent\'s Service Certificate', '12th Marks Sheet']
  },
  {
    id: 'pm-kisan',
    name: 'PM Kisan Samman Nidhi Yojana',
    department: 'Department of Agriculture & Farmers Welfare',
    category: 'Agriculture',
    benefits: '₹6,000 per year transferred in three equal quarterly installments.',
    eligibilityDesc: 'Available for small and marginal landholder farmer families.',
    ageMin: 18,
    ageMax: 100,
    states: ['All States', 'Maharashtra', 'Uttar Pradesh', 'Gujarat', 'West Bengal'],
    occupations: ['Farmer'],
    incomeMax: 300000,
    deadline: 'June 15, 2026',
    deadlineDays: 25,
    documentList: ['Land Ownership Proof (Khatauni)', 'Aadhaar Card', 'Bank Passbook Copy']
  },
  {
    id: 'mudra',
    name: 'Pradhan Mantri MUDRA Yojana (Shishu Loan)',
    department: 'Ministry of Finance, Govt of India',
    category: 'Business',
    benefits: 'Collateral-free business development loans up to ₹50,000.',
    eligibilityDesc: 'Non-farm micro units or startup entrepreneurs seeking capital.',
    ageMin: 18,
    ageMax: 65,
    states: ['All States'],
    occupations: ['Self-Employed', 'Farmer'],
    incomeMax: 1500000,
    deadline: 'Rolling / Open',
    deadlineDays: 365,
    documentList: ['Business Register Copy', 'Identity Proof (PAN/Aadhaar)', 'Estimated Project Costing']
  },
  {
    id: 'post-matric',
    name: 'Post Matric Scholarship for Scheduled Castes',
    department: 'Ministry of Social Justice & Empowerment',
    category: 'Education',
    benefits: '100% compulsory tuition fees reimbursement and academic maintenance support.',
    eligibilityDesc: 'Scheduled Caste students pursuing secondary/tertiary certifications.',
    ageMin: 17,
    ageMax: 35,
    states: ['All States'],
    occupations: ['Student'],
    incomeMax: 250000,
    deadline: 'October 30, 2026',
    deadlineDays: 162,
    documentList: ['Caste Certificate', 'Income Declaration Certificate', 'Institute Enrollment Letter']
  },
  {
    id: 'standup-india',
    name: 'Stand-Up India Scheme',
    department: 'SIDBI & Ministry of Finance',
    category: 'Business',
    benefits: 'Greenfield business enterprise loans from ₹10 Lakhs up to ₹1 Crore.',
    eligibilityDesc: 'Women or SC/ST entrepreneurs setting up trading/manufacturing units.',
    ageMin: 18,
    ageMax: 70,
    states: ['Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'Gujarat'],
    occupations: ['Self-Employed'],
    incomeMax: 2000000,
    deadline: 'December 31, 2026',
    deadlineDays: 224,
    documentList: ['Project Feasibility Document', 'Company Partnership Deed/LLP', 'Pollution Control NOC']
  },
  {
    id: 'mgnrega',
    name: 'Mahatma Gandhi National Rural Employment (MGNREGA)',
    department: 'Ministry of Rural Development',
    category: 'Social Welfare',
    benefits: '100 days of guaranteed wage employment per fiscal year in rural assets.',
    eligibilityDesc: 'Adult members of rural households willing to do unskilled manual work.',
    ageMin: 18,
    ageMax: 90,
    states: ['All States'],
    occupations: ['Unemployed', 'Farmer'],
    incomeMax: 150000,
    deadline: 'Rolling / Open',
    deadlineDays: 365,
    documentList: ['Rural Job Card application', 'Aadhaar Card', 'Local Gram Panchayat Verification']
  },
  {
    id: 'pmay-g',
    name: 'Pradhan Mantri Awas Yojana (Gramin)',
    department: 'Ministry of Rural Development',
    category: 'Social Welfare',
    benefits: '₹1.20 Lakh support in plain areas, ₹1.30 Lakh in hilly/difficult terrains.',
    eligibilityDesc: 'Families living in kutcha/dilapidated houses or landless laborers.',
    ageMin: 18,
    ageMax: 100,
    states: ['All States'],
    occupations: ['Unemployed', 'Farmer', 'Self-Employed'],
    incomeMax: 300000,
    deadline: 'September 30, 2026',
    deadlineDays: 132,
    documentList: ['SECC-2011 Household ID', 'Bank Account Details', 'Site Photo before construction']
  }
];

// Active Application State
let activeUser = {
  name: 'Sayali Mundhe',
  email: 'sayali@gemini.in',
  age: 24,
  state: 'Maharashtra',
  occupation: 'Student',
  income: 250000,
  isLoggedIn: true
};

// Application Global State Lists
let savedSchemeIds = ['pmss', 'post-matric'];
let searchHistory = [
  { timestamp: 'May 20, 2026, 14:10', parameters: 'Age: 24 | Maharashtra | Student | ₹2.5L', matchedCount: 4 },
  { timestamp: 'May 18, 2026, 09:45', parameters: 'Age: 24 | Delhi | Student | ₹2.5L', matchedCount: 3 }
];
let activeAlerts = [
  { id: 'a1', schemeId: 'pmss', title: 'Scholarship closes in 5 days', text: 'Prime Minister\'s Scholarship Scheme deadline is May 26, 2026. Submit documents.', read: false, time: '2 hours ago', type: 'expiring' },
  { id: 'a2', schemeId: 'pm-kisan', title: 'Upcoming Installment Verification', text: 'Confirm bank e-KYC status for PM Kisan Samman Nidhi to receive next installment.', read: false, time: '1 day ago', type: 'alert' },
  { id: 'a3', schemeId: 'mudra', title: 'MUDRA Loan Interest Subvention', text: 'Central Govt approved a 2% interest reduction for active Shishu borrowers.', read: true, time: '3 days ago', type: 'info' }
];

// Router Configuration
const VIEWS = ['landing', 'login', 'dashboard', 'ai-finder', 'saved', 'history', 'reminders', 'settings', 'admin'];

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
  // Sync state initially
  updateDashboardUI();
  updateAISchemesUI();
  updateSavedSchemesUI();
  updateHistoryUI();
  updateAlertsUI();
  updateSettingsUI();
  updateAdminUI();

  // Highlight active sidebar item
  updateSidebarHighlight('landing');
});

// Navigation Function
function navigateTo(viewName) {
  if (!VIEWS.includes(viewName)) return;

  // Toggle landing page full-width mode styling
  if (viewName === 'landing' || viewName === 'login') {
    document.body.classList.add('landing-active');
  } else {
    document.body.classList.remove('landing-active');
  }

  // Handle active states of containers
  VIEWS.forEach(v => {
    const el = document.getElementById(`view-${v}`);
    if (el) {
      if (v === viewName) {
        el.style.display = 'flex';
        el.classList.add('active');
      } else {
        el.style.display = 'none';
        el.classList.remove('active');
      }
    }
  });

  // Update sidebar highlighters
  updateSidebarHighlight(viewName);

  // Close mobile sidebar if open
  document.getElementById('app-sidebar').classList.remove('mobile-open');

  // Trigger animations or specific updates on transition
  if (viewName === 'admin') {
    animateAdminCharts();
  }
}

// Sidebars highlighters update
function updateSidebarHighlight(viewName) {
  const sidebarLinks = document.querySelectorAll('.nav-link');
  sidebarLinks.forEach(link => {
    link.classList.remove('active');
    if (link.id === `nav-${viewName}`) {
      link.classList.add('active');
    }
  });

  // Show/Hide top bar user indicators depending on login
  const profileWidget = document.getElementById('profile-trigger');
  if (activeUser.isLoggedIn && viewName !== 'landing' && viewName !== 'login') {
    profileWidget.style.display = 'flex';
  } else if (viewName === 'landing' || viewName === 'login') {
    profileWidget.style.display = 'none';
  }
}

// Mobile sidebar control
function toggleMobileSidebar() {
  document.getElementById('app-sidebar').classList.toggle('mobile-open');
}

// Global theme control (Light/Dark)
function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const targetTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', targetTheme);

  // Sync checkboxes
  const sidebarCheckbox = document.getElementById('sidebar-theme-toggle');
  if (sidebarCheckbox) {
    sidebarCheckbox.checked = (targetTheme === 'dark');
  }

  showToast('Theme Updated', `Switched application layout to ${targetTheme} mode.`, 'info');
}

// Language Selector Sim
function changeLanguage(langCode) {
  const langNames = { en: 'English', hi: 'हिन्दी', mr: 'मराठी', ta: 'தமிழ்' };
  showToast('Language Swapped', `Interface translated dynamically to ${langNames[langCode]}.`, 'info');
}

// Toast Notifications System
function showToast(title, desc, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toastId = 'toast-' + Date.now();
  const toastHtml = `
    <div class="notification-toast" id="${toastId}" style="border-left-color: var(--${type === 'info' ? 'accent' : type})">
      <span class="toast-close" onclick="closeToast('${toastId}')">×</span>
      <div class="toast-content">
        <div class="toast-title">${title}</div>
        <div class="toast-desc">${desc}</div>
      </div>
    </div>
  `;

  container.insertAdjacentHTML('beforeend', toastHtml);

  // Self-destruct after 5s
  setTimeout(() => {
    closeToast(toastId);
  }, 5000);
}

function closeToast(id) {
  const el = document.getElementById(id);
  if (el) {
    el.style.animation = 'none';
    el.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    el.style.opacity = '0';
    el.style.transform = 'translateX(100%)';
    setTimeout(() => el.remove(), 300);
  }
}

// Match Score calculation algorithm
function calculateMatchScore(scheme, profile) {
  let score = 0;
  
  // State Criteria Match
  if (scheme.states.includes('All States') || scheme.states.includes(profile.state)) {
    score += 25;
  }
  
  // Occupation Match
  if (scheme.occupations.includes(profile.occupation)) {
    score += 25;
  }
  
  // Age Limit Match
  if (profile.age >= scheme.ageMin && profile.age <= scheme.ageMax) {
    score += 25;
  }

  // Income Limit Match
  if (profile.income <= scheme.incomeMax) {
    score += 25;
  }

  return score;
}

// --- PHASE 1 - ELIGIBILITY FORM SUBMISSION ---
function handleEligibilitySubmit(event) {
  event.preventDefault();

  const ageVal = parseInt(document.getElementById('elig-age').value);
  const stateVal = document.getElementById('elig-state').value;
  const occupationVal = document.getElementById('elig-occupation').value;
  const incomeVal = parseFloat(document.getElementById('elig-income').value);

  // Update profile variables
  activeUser.age = ageVal;
  activeUser.state = stateVal;
  activeUser.occupation = occupationVal;
  activeUser.income = incomeVal;

  // Add search log history
  const matchedList = SCHEMES_DATABASE.filter(s => calculateMatchScore(s, activeUser) >= 75);
  searchHistory.unshift({
    timestamp: new Date().toLocaleString('en-US', { hour12: false }),
    parameters: `Age: ${ageVal} | ${stateVal} | ${occupationVal} | ₹${(incomeVal/100000).toFixed(1)}L`,
    matchedCount: matchedList.length
  });

  // Re-sync UI parts
  updateDashboardUI();
  updateAISchemesUI();
  updateHistoryUI();
  updateSettingsUI();
  updateAdminUI();

  // Redirect to signup/login or directly dashboard
  showToast('Eligibility Analyzed', `AI matched ${matchedList.length} relevant yojanas with your demographic inputs.`, 'success');
  
  // If not logged in, prompt signup, else navigate dashboard
  if (activeUser.isLoggedIn) {
    navigateTo('dashboard');
  } else {
    navigateTo('login');
  }
}

// Scroll support on Landing page
function scrollAndFocusEligibility() {
  document.getElementById('landing-eligibility-form').scrollIntoView({ behavior: 'smooth' });
}


// --- PHASE 2 - AUTHENTICATION SYSTEMS ---
let currentAuthState = 'login';

function toggleAuthState(state) {
  const states = ['login', 'signup', 'forgot', 'otp', 'success'];
  states.forEach(s => {
    const box = document.getElementById(`auth-state-${s}`);
    if (box) {
      box.style.display = (s === state) ? 'block' : 'none';
    }
  });
  currentAuthState = state;
}

function handleAuthSubmit(event, state) {
  event.preventDefault();
  
  if (state === 'login') {
    // Transition to success screen
    toggleAuthState('success');
    document.getElementById('success-message-text').innerText = 'Initializing verified citizen profile...';
    
    setTimeout(() => {
      activeUser.isLoggedIn = true;
      updateDashboardUI();
      showToast('Logged In Successfully', `Welcome back, ${activeUser.name}!`, 'success');
      navigateTo('dashboard');
      toggleAuthState('login'); // reset auth card back state
    }, 1800);
  }
  else if (state === 'signup') {
    const signupName = document.getElementById('signup-name').value;
    const signupEmail = document.getElementById('signup-email').value;
    const signupState = document.getElementById('signup-state').value;
    const signupOcc = document.getElementById('signup-occupation').value;
    
    // Save to state
    activeUser.name = signupName;
    activeUser.email = signupEmail;
    activeUser.state = signupState;
    activeUser.occupation = signupOcc;
    activeUser.isLoggedIn = true;
    
    toggleAuthState('success');
    document.getElementById('success-message-text').innerText = 'Registering credentials with Digilocker database...';

    setTimeout(() => {
      updateDashboardUI();
      updateSettingsUI();
      showToast('Profile Registered', 'Your citizen portal access has been initialized.', 'success');
      navigateTo('dashboard');
      toggleAuthState('login'); // reset card state
    }, 2000);
  }
  else if (state === 'forgot') {
    toggleAuthState('otp');
    showToast('OTP Dispatched', 'Verification code dispatched to your email address.', 'info');
  }
  else if (state === 'otp') {
    toggleAuthState('success');
    document.getElementById('success-message-text').innerText = 'Validating 4-digit MFA token...';
    setTimeout(() => {
      navigateTo('dashboard');
      toggleAuthState('login');
      showToast('Access Verified', 'Sandbox session authorized.', 'success');
    }, 1500);
  }
}

// Auto tab in OTP inputs
function focusNextInput(input, index) {
  if (input.value.length === 1 && index < 4) {
    const next = document.querySelectorAll('.otp-input')[index];
    if (next) next.focus();
  }
}

function resendOTP() {
  showToast('Token Regenerated', 'A fresh code was sent to your inbox.', 'info');
}

function handleGoogleSignIn() {
  toggleAuthState('success');
  document.getElementById('success-message-text').innerText = 'Syncing via National Single Sign-On (SSO)...';
  setTimeout(() => {
    activeUser.isLoggedIn = true;
    updateDashboardUI();
    showToast('SSO Sign In Complete', 'Verified secure credentials loaded.', 'success');
    navigateTo('dashboard');
    toggleAuthState('login');
  }, 1600);
}

function handleLogout() {
  activeUser.isLoggedIn = false;
  showToast('Logged Out', 'Your session was destroyed securely.', 'info');
  navigateTo('landing');
}


// --- PHASE 3 - SMART DASHBOARD ---
function updateDashboardUI() {
  // Update name & greetings
  document.getElementById('dashboard-welcome-title').innerText = `Welcome back, ${activeUser.name.split(' ')[0]} 👋`;
  document.getElementById('user-display-name').innerText = activeUser.name;
  
  // Get letter
  document.getElementById('avatar-letter').innerText = activeUser.name.charAt(0);

  // Profile parameter updates
  document.getElementById('dash-summary-age').innerText = `${activeUser.age} Years`;
  document.getElementById('dash-summary-state').innerText = activeUser.state;
  document.getElementById('dash-summary-occupation').innerText = activeUser.occupation;
  document.getElementById('dash-summary-income').innerText = `₹ ${activeUser.income.toLocaleString('en-IN')} /yr`;

  // Dynamic Scheme Filter Matches
  const recommendations = SCHEMES_DATABASE.filter(s => calculateMatchScore(s, activeUser) >= 75);
  const dashboardSchemesBox = document.getElementById('dashboard-schemes-list');
  
  if (recommendations.length === 0) {
    dashboardSchemesBox.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">
          <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
        </div>
        <div class="empty-state-title">No direct schemes matches found</div>
        <div class="empty-state-desc">Update your demographics in the settings panel to verify state/income parameters.</div>
      </div>
    `;
    // Update Score Circle to 0
    document.getElementById('dashboard-score-text').innerText = '0%';
    document.getElementById('dashboard-score-ring').style.strokeDashoffset = '226';
    document.getElementById('dashboard-eligibility-grade').innerText = 'Incomplete';
    document.getElementById('dashboard-eligibility-grade').className = 'tag tag-gray';
  } else {
    // Generate Cards
    dashboardSchemesBox.innerHTML = '';
    // Limit to 2 for summary screen, sorted by deadline urgency
    const sorted = [...recommendations].sort((a,b) => a.deadlineDays - b.deadlineDays).slice(0, 2);
    
    sorted.forEach(scheme => {
      const cardHtml = createSchemeCardMarkup(scheme);
      dashboardSchemesBox.insertAdjacentHTML('beforeend', cardHtml);
    });

    // Calculate score gauge
    let totalMatchPoints = 0;
    recommendations.forEach(s => {
      totalMatchPoints += calculateMatchScore(s, activeUser);
    });
    const avgPercent = Math.round(totalMatchPoints / recommendations.length);

    // Update gauge
    document.getElementById('dashboard-score-text').innerText = `${avgPercent}%`;
    const offset = 226 - (226 * avgPercent / 100);
    document.getElementById('dashboard-score-ring').style.strokeDashoffset = offset;
    
    // Grade text
    const gradeLabel = document.getElementById('dashboard-eligibility-grade');
    if (avgPercent >= 90) {
      gradeLabel.innerText = 'High Match';
      gradeLabel.className = 'tag tag-emerald';
    } else if (avgPercent >= 75) {
      gradeLabel.innerText = 'Moderate Match';
      gradeLabel.className = 'tag tag-accent';
    } else {
      gradeLabel.innerText = 'Weak Match';
      gradeLabel.className = 'tag tag-saffron';
    }
  }

  // Load Recent Discoveries
  const recentBox = document.getElementById('dashboard-recent-searches');
  recentBox.innerHTML = '';
  searchHistory.slice(0, 3).forEach(hist => {
    recentBox.insertAdjacentHTML('beforeend', `
      <div class="widget-item">
        <div class="widget-item-info">
          <div class="widget-item-icon">
            <svg viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
          </div>
          <div>
            <span class="widget-item-title">${hist.parameters}</span>
            <span class="widget-item-desc">Discovered ${hist.matchedCount} scheme matches</span>
          </div>
        </div>
        <div style="font-size:0.75rem;color:var(--text-light)">${hist.timestamp}</div>
      </div>
    `);
  });
}

// Scheme Card HTML Generator utility
function createSchemeCardMarkup(scheme) {
  const isSaved = savedSchemeIds.includes(scheme.id);
  const score = calculateMatchScore(scheme, activeUser);
  
  return `
    <div class="card scheme-card">
      <div class="scheme-header">
        <div class="scheme-name-box">
          <span class="scheme-department">${scheme.department}</span>
          <h4 class="scheme-name">${scheme.name}</h4>
        </div>
        <span class="tag tag-accent">${score}% RAG Match</span>
      </div>

      <div class="scheme-meta">
        <div class="scheme-meta-item">
          <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
          <span>Category: ${scheme.category}</span>
        </div>
        <div class="scheme-meta-item">
          <svg viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
          <span>State Focus: ${scheme.states.join(', ')}</span>
        </div>
      </div>

      <div class="scheme-details-grid">
        <div class="scheme-detail-col">
          <span class="scheme-detail-label">Financial Benefits</span>
          <span class="scheme-detail-val">${scheme.benefits}</span>
        </div>
        <div class="scheme-detail-col">
          <span class="scheme-detail-label">Eligibility Thresholds</span>
          <span class="scheme-detail-val">${scheme.eligibilityDesc}</span>
        </div>
      </div>

      <div class="scheme-footer">
        <span class="scheme-deadline ${scheme.deadlineDays <= 30 ? 'urgent' : ''}">
          <svg style="width:14px;height:14px;fill:currentColor" viewBox="0 0 24 24"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>
          App closes: ${scheme.deadline}
        </span>
        
        <div class="scheme-actions">
          <button class="btn-icon-only ${isSaved ? 'saved' : ''}" onclick="toggleBookmark('${scheme.id}')" title="Save / Bookmark">
            <svg style="width:18px;height:18px;fill:currentColor" viewBox="0 0 24 24">
              <path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z"/>
            </svg>
          </button>
          <button class="btn btn-primary" onclick="simulateApplicationStart('${scheme.id}', '${scheme.name}')">Apply via YojanaSetu</button>
        </div>
      </div>
    </div>
  `;
}

// Simulate app progress triggers
function simulateApplicationStart(id, name) {
  document.getElementById('progress-step-1').className = 'progress-step completed';
  document.getElementById('progress-step-2').className = 'progress-step active';
  document.getElementById('progress-step-3').className = 'progress-step';
  document.getElementById('app-progress-bar').style.width = '33%';
  
  document.getElementById('progress-helper-text').innerText = `Currently tracking: ${name} (Applied on May 21, 2026)`;
  
  showToast('Application Initialized', `Digilocker credentials transmitted successfully for ${name}. Track review status on dashboard.`, 'success');
  navigateTo('dashboard');
  
  // Advance progress slightly after 10s to simulate review progress
  setTimeout(() => {
    document.getElementById('progress-step-2').className = 'progress-step completed';
    document.getElementById('progress-step-3').className = 'progress-step active';
    document.getElementById('app-progress-bar').style.width = '66%';
    showToast('Application Updated', `Application review complete for ${name}. Verification stage: Disbursal pending.`, 'info');
  }, 10000);
}


// --- PHASE 4 - AI RECOMMENDATION CENTER ---
function updateAISchemesUI() {
  const listContainer = document.getElementById('ai-center-recommendations-list');
  const alternativeContainer = document.getElementById('ai-alternative-schemes');

  // Filter recommendations
  const matched = SCHEMES_DATABASE.filter(s => calculateMatchScore(s, activeUser) >= 75);
  const un-matched = SCHEMES_DATABASE.filter(s => calculateMatchScore(s, activeUser) < 75);

  // Recommendations column
  listContainer.innerHTML = '';
  matched.forEach(scheme => {
    listContainer.insertAdjacentHTML('beforeend', createSchemeCardMarkup(scheme));
  });

  // Alternative recommendations (low score)
  alternativeContainer.innerHTML = '';
  if (un-matched.length === 0) {
    alternativeContainer.innerHTML = '<p style="font-size:0.85rem;color:var(--text-light)">No alternate yojanas matching threshold guidelines.</p>';
  } else {
    un-matched.forEach(scheme => {
      alternativeContainer.insertAdjacentHTML('beforeend', `
        <div class="card scheme-card" style="opacity: 0.75">
          <div class="scheme-header">
            <div>
              <span class="scheme-department">${scheme.department}</span>
              <h5 class="scheme-name" style="font-size:0.95rem">${scheme.name}</h5>
            </div>
            <span class="tag tag-gray">${calculateMatchScore(scheme, activeUser)}% AI Confidence</span>
          </div>
          <div style="font-size:0.8rem;color:var(--text-muted)">
            <strong>Blocker criteria:</strong> Age requirement ranges ${scheme.ageMin}-${scheme.ageMax} or Income cap limits below ₹${(scheme.incomeMax/100000).toFixed(2)} Lakhs.
          </div>
        </div>
      `);
    });
  }

  // Populate dynamic AI reasoning details panel
  const reasonPanel = document.getElementById('ai-reasoning-details');
  reasonPanel.innerHTML = '';
  
  if (matched.length > 0) {
    const topScheme = matched[0];
    reasonPanel.insertAdjacentHTML('beforeend', `
      <div class="ai-reason-item">
        <div class="ai-reason-number">1</div>
        <div class="ai-reason-text">
          <strong>State Criteria (Matched):</strong> Your address parameter (${activeUser.state}) matches targeted regions.
        </div>
      </div>
      <div class="ai-reason-item">
        <div class="ai-reason-number">2</div>
        <div class="ai-reason-text">
          <strong>Demographic Segment (Student Focus):</strong> Identified education status as primary occupation driver.
        </div>
      </div>
      <div class="ai-reason-item">
        <div class="ai-reason-number">3</div>
        <div class="ai-reason-text">
          <strong>Economic Bracket:</strong> Income limit (₹${activeUser.income.toLocaleString()}) fits beneath top capping parameter.
        </div>
      </div>
    `);
  } else {
    reasonPanel.innerHTML = '<p style="font-size:0.82rem;color:var(--text-muted)">Verify your demographic parameters to generate AI recommendation maps.</p>';
  }
}

// RAG Chatbot Integration logic
function handleChatSubmit(event) {
  event.preventDefault();
  const inputEl = document.getElementById('chat-user-input');
  const userText = inputEl.value.trim();
  if (!userText) return;

  const messagesContainer = document.getElementById('chat-messages-container');

  // Insert user message
  messagesContainer.insertAdjacentHTML('beforeend', `
    <div class="chat-msg chat-msg-user">
      <div class="chat-msg-avatar">ME</div>
      <div class="chat-msg-bubble">${userText}</div>
    </div>
  `);

  inputEl.value = '';
  messagesContainer.scrollTop = messagesContainer.scrollHeight;

  // Simulate loader bubble
  const loaderId = 'chat-load-' + Date.now();
  messagesContainer.insertAdjacentHTML('beforeend', `
    <div class="chat-msg chat-msg-bot" id="${loaderId}">
      <div class="chat-msg-avatar">AI</div>
      <div class="chat-msg-bubble chat-msg-loading">
        <span></span><span></span><span></span>
      </div>
    </div>
  `);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;

  // Formulate reply based on keyword matches
  setTimeout(() => {
    const loader = document.getElementById(loaderId);
    if (loader) loader.remove();

    let reply = `Based on your profile data, the top yojana matching your parameters is the Prime Minister's Scholarship Scheme (PMSS) which awards monthly bursaries. Let me know if you would like me to list its mandatory certificates.`;

    if (userText.toLowerCase().includes('document') || userText.toLowerCase().includes('certificate') || userText.toLowerCase().includes('proof')) {
      const topMatch = SCHEMES_DATABASE.find(s => calculateMatchScore(s, activeUser) >= 75);
      if (topMatch) {
        reply = `To apply for <strong>${topMatch.name}</strong>, our database guidelines require compiling the following official documents:<br><ul>` +
          topMatch.documentList.map(doc => `<li>${doc}</li>`).join('') + `</ul>All documents can be securely retrieved via Digilocker.`;
      }
    } 
    else if (userText.toLowerCase().includes('deadline') || userText.toLowerCase().includes('date') || userText.toLowerCase().includes('close')) {
      const urgentMatch = SCHEMES_DATABASE.find(s => calculateMatchScore(s, activeUser) >= 75);
      if (urgentMatch) {
        reply = `The deadline to register for <strong>${urgentMatch.name}</strong> is <strong>${urgentMatch.deadline}</strong> (${urgentMatch.deadlineDays} days remaining). I recommend submitting your credentials today.`;
      }
    }
    else if (userText.toLowerCase().includes('apply') || userText.toLowerCase().includes('how to')) {
      reply = `To submit your application:<br>1. Tap the "Apply via YojanaSetu" button on the card.<br>2. Consented details will be auto-populated using your profile info.<br>3. Verify scanned documents via Digilocker Integration.<br>4. Monitor progress milestones directly on your citizen dashboard.`;
    }

    messagesContainer.insertAdjacentHTML('beforeend', `
      <div class="chat-msg chat-msg-bot">
        <div class="chat-msg-avatar">AI</div>
        <div class="chat-msg-bubble">${reply}</div>
      </div>
    `);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }, 1200);
}


// --- PHASE 5 - SAVED SCHEMES ---
let activeSavedCategory = 'all';
let activeSavedSearch = '';

function updateSavedSchemesUI() {
  const container = document.getElementById('saved-schemes-grid');
  document.getElementById('saved-badge-count').innerText = `${savedSchemeIds.length} Saved`;

  const savedSchemes = SCHEMES_DATABASE.filter(s => savedSchemeIds.includes(s.id));
  
  // Filter by category
  let filtered = savedSchemes;
  if (activeSavedCategory !== 'all') {
    filtered = savedSchemes.filter(s => s.category === activeSavedCategory);
  }

  // Filter by search
  if (activeSavedSearch) {
    const q = activeSavedSearch.toLowerCase();
    filtered = filtered.filter(s => s.name.toLowerCase().includes(q) || s.department.toLowerCase().includes(q));
  }

  container.innerHTML = '';
  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">
          <svg viewBox="0 0 24 24"><path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z"/></svg>
        </div>
        <div class="empty-state-title">No Bookmarked Schemes</div>
        <div class="empty-state-desc">Saved yojanas will show up here for easy access and deadlines monitoring.</div>
      </div>
    `;
  } else {
    filtered.forEach(scheme => {
      container.insertAdjacentHTML('beforeend', createSchemeCardMarkup(scheme));
    });
  }
}

function filterSaved(cat) {
  activeSavedCategory = cat;
  
  // Update active tab buttons UI
  const tabs = document.querySelectorAll('#saved-category-tabs .filter-tab');
  tabs.forEach(t => {
    t.classList.remove('active');
    if (t.innerText.includes(cat) || (cat === 'all' && t.innerText.includes('All'))) {
      t.classList.add('active');
    }
  });

  updateSavedSchemesUI();
}

function handleSavedSearch(val) {
  activeSavedSearch = val.trim();
  updateSavedSchemesUI();
}

function toggleBookmark(id) {
  const idx = savedSchemeIds.indexOf(id);
  if (idx > -1) {
    savedSchemeIds.splice(idx, 1);
    showToast('Bookmark Removed', 'Scheme deleted from bookmarks.', 'warning');
  } else {
    savedSchemeIds.push(id);
    showToast('Scheme Bookmarked', 'Saved to bookmarked schemes list.', 'success');
  }

  // Re-render components that show bookmarks status
  updateDashboardUI();
  updateAISchemesUI();
  updateSavedSchemesUI();
}


// --- PHASE 6 - HISTORY PAGE ---
function updateHistoryUI() {
  const container = document.getElementById('history-timeline-container');
  container.innerHTML = '';

  if (searchHistory.length === 0) {
    container.innerHTML = '<p style="text-align:center;color:var(--text-muted)">History log registry is empty.</p>';
  } else {
    searchHistory.forEach(hist => {
      container.insertAdjacentHTML('beforeend', `
        <div class="timeline-item">
          <div class="timeline-dot"></div>
          <div class="timeline-content">
            <span class="timeline-date">${hist.timestamp}</span>
            <div class="card" style="padding:14px;margin-top:6px">
              <h4 style="font-size:0.92rem;margin-bottom:4px">AI Recommendation Search Parameters</h4>
              <p style="font-size:0.82rem;color:var(--text-muted)">
                ${hist.parameters}<br>
                <strong>Status:</strong> Matched ${hist.matchedCount} schemes successfully with 95%+ confidence.
              </p>
            </div>
          </div>
        </div>
      `);
    });
  }
}

function clearHistoryLog() {
  searchHistory = [];
  updateHistoryUI();
  showToast('Logs Cleared', 'Citizen query search logs wiped from memory cache.', 'info');
}


// --- PHASE 7 - REMINDER SYSTEM ---
function updateAlertsUI() {
  const container = document.getElementById('active-alerts-list');
  container.innerHTML = '';

  const active = activeAlerts.filter(a => !a.read);
  
  // Update topbar bells
  const badgeCount = document.getElementById('bell-badge-count');
  if (badgeCount) {
    badgeCount.innerText = active.length;
    badgeCount.style.display = active.length > 0 ? 'flex' : 'none';
  }

  if (activeAlerts.length === 0) {
    container.innerHTML = '<p style="color:var(--text-muted);text-align:center;">No upcoming yojanas deadlines.</p>';
  } else {
    activeAlerts.forEach(alert => {
      container.insertAdjacentHTML('beforeend', `
        <div class="alert-item ${alert.read ? '' : 'unread'}">
          <div class="alert-icon ${alert.type === 'expiring' ? 'expired' : ''}">
            <svg viewBox="0 0 24 24"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/></svg>
          </div>
          <div class="alert-body">
            <span class="alert-title">${alert.title}</span>
            <span class="alert-text">${alert.text}</span>
            <span class="alert-time">${alert.time}</span>
          </div>
          <div class="alert-action">
            ${alert.read ? '' : `<button class="btn btn-secondary" style="font-size:0.75rem;padding:6px 12px" onclick="markAlertRead('${alert.id}')">Dismiss</button>`}
          </div>
        </div>
      `);
    });
  }
}

function markAlertRead(id) {
  const alert = activeAlerts.find(a => a.id === id);
  if (alert) {
    alert.read = true;
    updateAlertsUI();
    showToast('Alert Dismissed', 'Notification marked as read.', 'info');
  }
}

function saveAlertPrefs() {
  const sms = document.getElementById('sms-pref-toggle').checked;
  const email = document.getElementById('email-pref-toggle').checked;
  const whatsapp = document.getElementById('whatsapp-pref-toggle').checked;

  showToast('Preferences Saved', `Updated notification parameters: SMS (${sms}), Email (${email}), WhatsApp (${whatsapp}).`, 'success');
}

function toggleNotificationDropdown() {
  const unreadAlerts = activeAlerts.filter(a => !a.read);
  if (unreadAlerts.length > 0) {
    const listStr = unreadAlerts.map(a => `- ${a.title}`).join('\n');
    showToast('Unread Reminders Registry', `Current Pending Notifications:\n${listStr}`, 'info');
  } else {
    showToast('Reminders Clean', 'All deadline notifications are cleared.', 'success');
  }
  navigateTo('reminders');
}


// --- PHASE 8 - PROFILE SETTINGS ---
function updateSettingsUI() {
  document.getElementById('settings-name').value = activeUser.name;
  document.getElementById('settings-age').value = activeUser.age;
  document.getElementById('settings-state').value = activeUser.state;
  document.getElementById('settings-occupation').value = activeUser.occupation;
  document.getElementById('settings-income').value = activeUser.income;
}

function switchSettingsSection(sectionId) {
  // Toggle active class on menu items
  const menuItems = document.querySelectorAll('.settings-menu-item');
  menuItems.forEach(item => {
    item.classList.remove('active');
    if (item.getAttribute('onclick').includes(sectionId)) {
      item.classList.add('active');
    }
  });

  // Toggle active class on forms
  const forms = document.querySelectorAll('.settings-section-card');
  forms.forEach(form => {
    form.classList.remove('active');
    if (form.id === `settings-${sectionId}`) {
      form.classList.add('active');
    }
  });
}

function handleSettingsUpdate(event, section) {
  event.preventDefault();

  if (section === 'personal') {
    activeUser.name = document.getElementById('settings-name').value;
    activeUser.age = parseInt(document.getElementById('settings-age').value);
    activeUser.state = document.getElementById('settings-state').value;
    activeUser.occupation = document.getElementById('settings-occupation').value;
    activeUser.income = parseFloat(document.getElementById('settings-income').value);

    // Sync views
    updateDashboardUI();
    updateAISchemesUI();
    showToast('Profile Parameters Saved', 'Verifying details... Dashboard calculations updated.', 'success');
  } 
  else if (section === 'security') {
    const currentPass = document.getElementById('sec-curr-pass').value;
    const newPass = document.getElementById('sec-new-pass').value;
    const confPass = document.getElementById('sec-conf-pass').value;

    if (newPass !== confPass) {
      showToast('Validation Error', 'New passwords match key verify failure.', 'danger');
      return;
    }

    document.getElementById('sec-curr-pass').value = '';
    document.getElementById('sec-new-pass').value = '';
    document.getElementById('sec-conf-pass').value = '';
    
    showToast('Password Updated', 'Your security profile was updated with 256-bit hash verification.', 'success');
  }
}


// --- PHASE 9 - ADMIN / ANALYTICS ---
function updateAdminUI() {
  const logTable = document.querySelector('#admin-logs-table tbody');
  logTable.innerHTML = '';

  const mockLogs = [
    { time: 'Just now', params: 'Age: 24 | Maharashtra | Student | ₹2.5L', topScheme: 'PM Scholarship Scheme', conf: '98%', status: 'Success' },
    { time: '3 mins ago', params: 'Age: 42 | Uttar Pradesh | Farmer | ₹1.2L', topScheme: 'PM Kisan Samman Nidhi', conf: '94%', status: 'Success' },
    { time: '12 mins ago', params: 'Age: 31 | Karnataka | Self-Employed | ₹4.8L', topScheme: 'MUDRA Loan (Shishu)', conf: '96%', status: 'Success' },
    { time: '24 mins ago', params: 'Age: 22 | Delhi | Student | ₹80K', topScheme: 'Post Matric Scholarship', conf: '99%', status: 'Success' }
  ];

  mockLogs.forEach(log => {
    logTable.insertAdjacentHTML('beforeend', `
      <tr style="border-bottom:1px solid var(--border)">
        <td style="padding:12px 8px;font-size:0.8rem;color:var(--text-light)">${log.time}</td>
        <td style="padding:12px 8px;font-weight:600">${log.params}</td>
        <td style="padding:12px 8px">${log.topScheme}</td>
        <td style="padding:12px 8px"><span class="tag tag-accent">${log.conf} Match</span></td>
        <td style="padding:12px 8px"><span class="tag tag-emerald" style="font-size:0.7rem">${log.status}</span></td>
      </tr>
    `);
  });
}

function animateAdminCharts() {
  const chartBox = document.getElementById('bar-chart-container');
  if (!chartBox) return;

  const data = [
    { label: 'Education', val: 82, count: '64.1K' },
    { label: 'Agriculture', val: 56, count: '31.2K' },
    { label: 'Business', val: 68, count: '24.9K' },
    { label: 'Social Welfare', val: 42, count: '18.1K' }
  ];

  chartBox.innerHTML = '';
  data.forEach(item => {
    chartBox.insertAdjacentHTML('beforeend', `
      <div class="bar-chart-item">
        <div class="bar-wrapper">
          <span class="bar-value">${item.count}</span>
          <div class="bar-fill" id="bar-${item.label}" style="height: 0%"></div>
        </div>
        <span class="bar-label">${item.label}</span>
      </div>
    `);

    // Trigger height transition
    setTimeout(() => {
      const fill = document.getElementById(`bar-${item.label}`);
      if (fill) fill.style.height = `${item.val}%`;
    }, 100);
  });
}

// Global search bar handler
function handleGlobalSearch(query) {
  const q = query.trim().toLowerCase();
  if (q.length > 2) {
    navigateTo('ai-finder');
    const matched = SCHEMES_DATABASE.filter(s => s.name.toLowerCase().includes(q) || s.department.toLowerCase().includes(q));
    const listContainer = document.getElementById('ai-center-recommendations-list');
    listContainer.innerHTML = '';
    
    if (matched.length === 0) {
      listContainer.innerHTML = '<div class="empty-state">No schemes found matching search.</div>';
    } else {
      matched.forEach(scheme => {
        listContainer.insertAdjacentHTML('beforeend', createSchemeCardMarkup(scheme));
      });
    }
  }
}
