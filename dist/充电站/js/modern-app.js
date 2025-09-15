// Modern App - Main Application Logic

// Global state
let currentPage = 'admin';
let currentAdminSection = 'dashboard';
let currentCompanySection = 'overview';

// Initialize application
function initializeApp() {
    console.log('Initializing EV Charging Platform...');
    
    // Initialize i18n
    if (typeof initI18n === 'function') {
        initI18n();
    }
    
    // Set up event listeners
    setupEventListeners();
    
    // Check URL hash for platform selection
    const hash = window.location.hash.substring(1);
    if (hash === 'admin' || hash === 'company' || hash === 'mobile') {
        currentPage = hash === 'mobile' ? 'mobile' : hash;
        showPage(currentPage);
    } else {
        // Set default page to admin
        currentPage = 'admin';
        showPage('admin');
    }
    
    // Initialize dashboard
    if (currentPage === 'admin') {
        initializeDashboard();
    }
    
    // Load initial data
    loadInitialData();
    
    // Listen for hash changes
    window.addEventListener('hashchange', function() {
        const newHash = window.location.hash.substring(1);
        if (newHash === 'admin' || newHash === 'company' || newHash === 'mobile') {
            showPage(newHash === 'mobile' ? 'mobile' : newHash);
        }
    });
    
    console.log('Application initialized successfully');
}

// Setup event listeners
function setupEventListeners() {
    // Page navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.getAttribute('onclick').match(/showPage\('(.+)'\)/)?.[1];
            if (page) {
                showPage(page);
            }
        });
    });
    
    // Close modals on backdrop click
    document.querySelectorAll('.modal-backdrop-minimal').forEach(backdrop => {
        backdrop.addEventListener('click', function(e) {
            if (e.target === this) {
                this.style.display = 'none';
            }
        });
    });
}

// Page navigation
function showPage(pageId) {
    console.log('Navigating to page:', pageId);
    
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Show selected page
    const targetPage = document.getElementById(`${pageId}-page`);
    if (targetPage) {
        targetPage.classList.add('active');
        currentPage = pageId;
        
        // Update navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('onclick')?.includes(pageId)) {
                link.classList.add('active');
            }
        });
        
        // Initialize page-specific features
        initializePage(pageId);
    }
}

// Initialize page-specific features
function initializePage(pageId) {
    switch(pageId) {
        case 'admin':
            initializeDashboard();
            loadTenants();
            loadAuditLogs();
            break;
        case 'company':
            loadCompanyData();
            loadStations();
            loadUsers();
            break;
        case 'mobile':
            initializeMobileView();
            break;
    }
}

// Admin section navigation
function showAdminSection(sectionId) {
    console.log('Showing admin section:', sectionId);
    
    // Hide all sections
    document.querySelectorAll('.admin-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected section
    const targetSection = document.getElementById(`admin-${sectionId}`);
    if (targetSection) {
        targetSection.classList.add('active');
        currentAdminSection = sectionId;
        
        // Update sidebar
        document.querySelectorAll('.sidebar-link-minimal').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('onclick')?.includes(sectionId)) {
                link.classList.add('active');
            }
        });
    }
}

// Company section navigation
function showCompanySection(sectionId) {
    console.log('Showing company section:', sectionId);
    
    // Hide all sections
    document.querySelectorAll('.company-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected section
    const targetSection = document.getElementById(`company-${sectionId}`);
    if (targetSection) {
        targetSection.classList.add('active');
        currentCompanySection = sectionId;
        
        // Update sidebar
        document.querySelectorAll('#company-page .sidebar-link-minimal').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('onclick')?.includes(sectionId)) {
                link.classList.add('active');
            }
        });
    }
}

// Initialize dashboard
function initializeDashboard() {
    console.log('Initializing dashboard...');
    
    // Create performance chart
    const ctx = document.getElementById('performanceChart');
    if (ctx && typeof Chart !== 'undefined') {
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'],
                datasets: [{
                    label: 'Active Sessions',
                    data: [3200, 2800, 4500, 7800, 8900, 9200, 5600],
                    borderColor: '#0071E3',
                    backgroundColor: 'rgba(0, 113, 227, 0.1)',
                    tension: 0.4
                }, {
                    label: 'Power Usage (MW)',
                    data: [120, 95, 180, 320, 380, 410, 240],
                    borderColor: '#34C759',
                    backgroundColor: 'rgba(52, 199, 89, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
}

// Load tenants
function loadTenants() {
    const tenantsData = [
        { id: 'TEN001', name: 'ChargePoint Network', country: 'US', stations: 324, users: 15420, status: 'Active' },
        { id: 'TEN002', name: 'Electrify Europe', country: 'DE', stations: 256, users: 12300, status: 'Active' },
        { id: 'TEN003', name: 'GreenCharge Asia', country: 'JP', stations: 189, users: 8900, status: 'Active' },
        { id: 'TEN004', name: 'PowerGrid Solutions', country: 'UK', stations: 145, users: 6700, status: 'Active' },
        { id: 'TEN005', name: 'EcoCharge France', country: 'FR', stations: 98, users: 4500, status: 'Pending' }
    ];
    
    const tbody = document.getElementById('tenantsTableBody');
    if (tbody) {
        tbody.innerHTML = tenantsData.map(tenant => `
            <tr>
                <td>${tenant.id}</td>
                <td>${tenant.name}</td>
                <td>${tenant.country}</td>
                <td>${tenant.stations}</td>
                <td>${tenant.users.toLocaleString()}</td>
                <td><span class="badge ${tenant.status === 'Active' ? 'badge-success' : 'badge-warning'}">${tenant.status}</span></td>
                <td>
                    <button class="btn-minimal btn-ghost-minimal" style="padding: 4px 8px;">
                        <i class="fas fa-edit"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }
}

// Load audit logs
function loadAuditLogs() {
    const auditData = [
        { timestamp: '2024-01-20 14:32:00', user: 'admin@evcharge.com', action: 'CREATE', resource: 'Station #ST-4521', ip: '192.168.1.10', status: 'Success' },
        { timestamp: '2024-01-20 14:28:15', user: 'john.doe@company.com', action: 'UPDATE', resource: 'Pricing Rules', ip: '10.0.0.45', status: 'Success' },
        { timestamp: '2024-01-20 14:15:30', user: 'system', action: 'DELETE', resource: 'Expired Sessions', ip: 'localhost', status: 'Success' },
        { timestamp: '2024-01-20 13:45:00', user: 'mary.smith@tenant.com', action: 'LOGIN', resource: 'Web Portal', ip: '203.45.67.89', status: 'Failed' },
        { timestamp: '2024-01-20 13:30:00', user: 'admin@evcharge.com', action: 'EXPORT', resource: 'User Data', ip: '192.168.1.10', status: 'Success' }
    ];
    
    const tbody = document.getElementById('auditLogsTableBody');
    if (tbody) {
        tbody.innerHTML = auditData.map(log => `
            <tr>
                <td>${log.timestamp}</td>
                <td>${log.user}</td>
                <td>${log.action}</td>
                <td>${log.resource}</td>
                <td>${log.ip}</td>
                <td><span class="badge ${log.status === 'Success' ? 'badge-success' : 'badge-danger'}">${log.status}</span></td>
            </tr>
        `).join('');
    }
}

// Load company data
function loadCompanyData() {
    // Load mock company statistics
    console.log('Loading company data...');
}

// Load stations
function loadStations() {
    const stationsData = [
        { id: 'ST001', name: 'Downtown Plaza', location: 'New York, NY', chargers: 12, status: 'Online', utilization: 75 },
        { id: 'ST002', name: 'Airport Terminal 2', location: 'Los Angeles, CA', chargers: 8, status: 'Online', utilization: 92 },
        { id: 'ST003', name: 'Shopping Mall West', location: 'Chicago, IL', chargers: 6, status: 'Maintenance', utilization: 0 },
        { id: 'ST004', name: 'University Campus', location: 'Boston, MA', chargers: 10, status: 'Online', utilization: 45 }
    ];
    
    const grid = document.getElementById('stationsGrid');
    if (grid) {
        grid.innerHTML = stationsData.map(station => `
            <div class="card-glass" style="padding: 20px;">
                <h4>${station.name}</h4>
                <p style="color: var(--medium-gray); margin: 8px 0;">${station.location}</p>
                <div style="display: flex; justify-content: space-between; margin-top: 16px;">
                    <span>${station.chargers} Chargers</span>
                    <span class="${station.status === 'Online' ? 'text-success' : 'text-warning'}">${station.status}</span>
                </div>
                <div style="margin-top: 12px;">
                    <div style="background: #f0f0f0; height: 4px; border-radius: 2px;">
                        <div style="background: #0071E3; width: ${station.utilization}%; height: 100%; border-radius: 2px;"></div>
                    </div>
                    <span style="font-size: 12px; color: var(--medium-gray);">${station.utilization}% Utilization</span>
                </div>
            </div>
        `).join('');
    }
}

// Load users
function loadUsers() {
    const usersData = [
        { id: 'USR001', name: 'John Smith', email: 'john.smith@email.com', type: 'Regular', sessions: 145, kwh: 2340, status: 'Active' },
        { id: 'USR002', name: 'Sarah Johnson', email: 'sarah.j@email.com', type: 'Premium', sessions: 89, kwh: 1560, status: 'Active' },
        { id: 'USR003', name: 'Michael Brown', email: 'm.brown@email.com', type: 'Regular', sessions: 67, kwh: 890, status: 'Inactive' },
        { id: 'USR004', name: 'Emma Davis', email: 'emma.d@email.com', type: 'Fleet', sessions: 234, kwh: 4500, status: 'Active' }
    ];
    
    const tbody = document.getElementById('usersTableBody');
    if (tbody) {
        tbody.innerHTML = usersData.map(user => `
            <tr>
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.type}</td>
                <td>${user.sessions}</td>
                <td>${user.kwh.toLocaleString()}</td>
                <td><span class="badge ${user.status === 'Active' ? 'badge-success' : 'badge-secondary'}">${user.status}</span></td>
                <td>
                    <button class="btn-minimal btn-ghost-minimal" style="padding: 4px 8px;">
                        <i class="fas fa-edit"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }
}

// Initialize mobile view
function initializeMobileView() {
    console.log('Initializing mobile view...');
    
    // Load nearby stations for mobile
    const nearbyStations = [
        { name: 'Downtown Plaza', distance: '0.5 mi', available: 3, total: 8, price: '$0.35/kWh' },
        { name: 'City Center Mall', distance: '1.2 mi', available: 5, total: 6, price: '$0.32/kWh' },
        { name: 'Tech Park Station', distance: '2.0 mi', available: 2, total: 4, price: '$0.38/kWh' }
    ];
    
    const stationsList = document.getElementById('stationsList');
    if (stationsList) {
        stationsList.innerHTML = nearbyStations.map(station => `
            <div style="padding: 12px; border: 1px solid #e0e0e0; border-radius: 8px; margin-bottom: 8px;">
                <div style="display: flex; justify-content: space-between; align-items: start;">
                    <div>
                        <h5 style="margin: 0 0 4px 0;">${station.name}</h5>
                        <p style="margin: 0; color: #666; font-size: 13px;">${station.distance} • ${station.price}</p>
                    </div>
                    <div style="text-align: right;">
                        <div style="color: #34C759; font-weight: 600;">${station.available}/${station.total}</div>
                        <div style="font-size: 11px; color: #666;">Available</div>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

// Modal functions
function openAddTenantModal() {
    document.getElementById('addTenantModal').style.display = 'flex';
}

function openAddStationModal() {
    console.log('Opening add station modal...');
    // Implementation for station modal
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function handleAddTenant(event) {
    event.preventDefault();
    console.log('Adding new tenant...');
    
    // Get form values
    const formData = {
        name: document.getElementById('tenantName').value,
        email: document.getElementById('tenantEmail').value,
        country: document.getElementById('tenantCountry').value,
        plan: document.getElementById('tenantPlan').value
    };
    
    console.log('Tenant data:', formData);
    
    // Close modal and refresh list
    closeModal('addTenantModal');
    loadTenants();
    
    // Reset form
    document.getElementById('addTenantForm').reset();
}

// Import stations from CSV
function importStations() {
    console.log('Importing stations from CSV...');
    // Implementation for CSV import
}

// Load initial data
function loadInitialData() {
    console.log('Loading initial data...');
    
    // Load data based on current page
    if (currentPage === 'admin') {
        loadTenants();
        loadAuditLogs();
    } else if (currentPage === 'company') {
        loadCompanyData();
        loadStations();
        loadUsers();
    }
}

// Language change handler
function changeLanguage(lang) {
    console.log('Changing language to:', lang);
    
    // Update i18n if available
    if (typeof i18n !== 'undefined' && i18n.changeLanguage) {
        i18n.changeLanguage(lang);
    } else {
        console.warn('i18n not initialized, unable to change language');
    }
}

// Export functions for global access
window.initializeApp = initializeApp;
window.showPage = showPage;
window.showAdminSection = showAdminSection;
window.showCompanySection = showCompanySection;
window.openAddTenantModal = openAddTenantModal;
window.openAddStationModal = openAddStationModal;
window.closeModal = closeModal;
window.handleAddTenant = handleAddTenant;
window.importStations = importStations;
window.changeLanguage = changeLanguage;