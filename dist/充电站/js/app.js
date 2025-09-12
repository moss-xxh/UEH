// Main application JavaScript
let currentUser = null;
let currentPage = 'landing';
let chargingSession = null;
let sessionInterval = null;

// Mock data for demonstration
const mockData = {
    tenants: [
        { id: 'T001', name: 'GreenCharge Networks', country: 'US', stations: 145, users: 12500, status: 'active' },
        { id: 'T002', name: 'EuroCharge GmbH', country: 'DE', stations: 89, users: 8900, status: 'active' },
        { id: 'T003', name: 'AsiaEV Solutions', country: 'CN', stations: 234, users: 45000, status: 'active' },
        { id: 'T004', name: 'Nordic Power', country: 'NO', stations: 67, users: 5600, status: 'active' },
        { id: 'T005', name: 'ChargePoint UK', country: 'UK', stations: 98, users: 11200, status: 'inactive' }
    ],
    stations: [
        { id: 'ST001', name: 'Downtown Plaza', address: '123 Main St', city: 'New York', lat: 40.7128, lng: -74.0060, chargers: 8, available: 3 },
        { id: 'ST002', name: 'Airport Terminal 1', address: '456 Airport Rd', city: 'Los Angeles', lat: 34.0522, lng: -118.2437, chargers: 12, available: 5 },
        { id: 'ST003', name: 'Shopping Mall East', address: '789 Mall Dr', city: 'Chicago', lat: 41.8781, lng: -87.6298, chargers: 6, available: 2 },
        { id: 'ST004', name: 'Highway Rest Stop', address: '321 Highway 101', city: 'San Francisco', lat: 37.7749, lng: -122.4194, chargers: 10, available: 7 }
    ],
    chargers: [
        { id: 'CH001', stationId: 'ST001', station: 'Downtown Plaza', type: 'DC Fast', power: 150, status: 'available', user: null },
        { id: 'CH002', stationId: 'ST001', station: 'Downtown Plaza', type: 'DC Fast', power: 150, status: 'charging', user: 'john.doe@example.com' },
        { id: 'CH003', stationId: 'ST001', station: 'Downtown Plaza', type: 'AC Type 2', power: 22, status: 'available', user: null },
        { id: 'CH004', stationId: 'ST002', station: 'Airport Terminal 1', type: 'DC Fast', power: 350, status: 'available', user: null },
        { id: 'CH005', stationId: 'ST002', station: 'Airport Terminal 1', type: 'DC Fast', power: 350, status: 'offline', user: null }
    ],
    sessions: [
        { id: 'S001', chargerId: 'CH002', user: 'john.doe@example.com', startTime: new Date(), duration: 0, energy: 0, cost: 0, status: 'active' },
        { id: 'S002', chargerId: 'CH001', user: 'jane.smith@example.com', startTime: new Date(Date.now() - 3600000), endTime: new Date(), duration: 60, energy: 45.2, cost: 18.50, status: 'completed' },
        { id: 'S003', chargerId: 'CH003', user: 'bob.wilson@example.com', startTime: new Date(Date.now() - 7200000), endTime: new Date(Date.now() - 3600000), duration: 60, energy: 22.8, cost: 9.75, status: 'completed' }
    ]
};

// Page navigation
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    const page = document.getElementById(pageId + '-page');
    if (page) {
        page.classList.add('active');
        currentPage = pageId;
        
        // Initialize page-specific content
        if (pageId === 'admin-dashboard') {
            initAdminDashboard();
        } else if (pageId === 'company-dashboard') {
            initCompanyDashboard();
        } else if (pageId === 'user-app') {
            initUserApp();
        }
    }
}

// Admin login
function handleAdminLogin(event) {
    event.preventDefault();
    const email = document.getElementById('adminEmail').value;
    const password = document.getElementById('adminPassword').value;
    
    // Mock authentication
    if (email && password) {
        currentUser = { email, role: 'admin' };
        showPage('admin-dashboard');
        showNotification('Login successful', 'success');
    }
}

// Company login
function handleCompanyLogin(event) {
    event.preventDefault();
    const companyId = document.getElementById('companyId').value;
    const email = document.getElementById('companyEmail').value;
    const password = document.getElementById('companyPassword').value;
    
    // Mock authentication
    if (companyId && email && password) {
        currentUser = { email, role: 'company', companyId };
        showPage('company-dashboard');
        showNotification('Login successful', 'success');
    }
}

// Logout
function logout() {
    currentUser = null;
    showPage('landing');
    showNotification('Logged out successfully', 'info');
}

// Admin sections
function showAdminSection(sectionId) {
    document.querySelectorAll('.admin-section').forEach(section => {
        section.classList.remove('active');
    });
    
    document.querySelectorAll('.sidebar-menu li').forEach(item => {
        item.classList.remove('active');
    });
    
    const section = document.getElementById('admin-' + sectionId);
    if (section) {
        section.classList.add('active');
        event.currentTarget.parentElement.classList.add('active');
    }
    
    if (sectionId === 'tenants') {
        loadTenants();
    }
}

// Company sections
function showCompanySection(sectionId) {
    document.querySelectorAll('.company-section').forEach(section => {
        section.classList.remove('active');
    });
    
    document.querySelectorAll('.sidebar-menu li').forEach(item => {
        item.classList.remove('active');
    });
    
    const section = document.getElementById('company-' + sectionId);
    if (section) {
        section.classList.add('active');
        event.currentTarget.parentElement.classList.add('active');
    }
    
    if (sectionId === 'stations') {
        loadStations();
    } else if (sectionId === 'chargers') {
        loadChargers();
    } else if (sectionId === 'sessions') {
        loadSessions();
    }
}

// Initialize Admin Dashboard
function initAdminDashboard() {
    loadTenants();
    initCharts();
}

// Initialize Company Dashboard
function initCompanyDashboard() {
    loadStations();
    loadChargers();
}

// Initialize User App
function initUserApp() {
    // Initialize map and other user app features
}

// Load tenants
function loadTenants() {
    const tbody = document.getElementById('tenantsTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    mockData.tenants.forEach(tenant => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${tenant.id}</td>
            <td>${tenant.name}</td>
            <td>${tenant.country}</td>
            <td>${tenant.stations}</td>
            <td>${tenant.users.toLocaleString()}</td>
            <td><span class="status-badge ${tenant.status}">${tenant.status}</span></td>
            <td>
                <button class="btn btn-sm" onclick="editTenant('${tenant.id}')">Edit</button>
                <button class="btn btn-sm" onclick="viewTenant('${tenant.id}')">View</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Load stations
function loadStations() {
    const grid = document.getElementById('stationsGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    mockData.stations.forEach(station => {
        const card = document.createElement('div');
        card.className = 'station-card';
        card.innerHTML = `
            <div class="station-card-header">
                <h4>${station.name}</h4>
            </div>
            <div class="station-card-body">
                <div class="station-info">
                    <span>Address:</span>
                    <span>${station.address}</span>
                </div>
                <div class="station-info">
                    <span>City:</span>
                    <span>${station.city}</span>
                </div>
                <div class="station-info">
                    <span>Chargers:</span>
                    <span>${station.chargers}</span>
                </div>
                <div class="station-info">
                    <span>Available:</span>
                    <span>${station.available}</span>
                </div>
                <button class="btn btn-primary btn-block" onclick="viewStation('${station.id}')">Manage</button>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Load chargers
function loadChargers() {
    const tbody = document.getElementById('chargersTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    mockData.chargers.forEach(charger => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${charger.id}</td>
            <td>${charger.station}</td>
            <td>${charger.type}</td>
            <td>${charger.power}</td>
            <td><span class="status-badge ${charger.status}">${charger.status}</span></td>
            <td>${charger.user || '-'}</td>
            <td>
                <button class="btn btn-sm" onclick="controlCharger('${charger.id}')">Control</button>
                <button class="btn btn-sm" onclick="viewChargerDetails('${charger.id}')">Details</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Load sessions
function loadSessions() {
    const activeList = document.getElementById('activeSessionsList');
    const recentList = document.getElementById('recentSessionsList');
    
    if (activeList) {
        activeList.innerHTML = '';
        mockData.sessions.filter(s => s.status === 'active').forEach(session => {
            const item = document.createElement('div');
            item.className = 'session-item';
            item.innerHTML = `
                <h4>Session ${session.id}</h4>
                <p>Charger: ${session.chargerId}</p>
                <p>User: ${session.user}</p>
                <p>Duration: ${session.duration} min</p>
                <p>Energy: ${session.energy} kWh</p>
            `;
            activeList.appendChild(item);
        });
    }
    
    if (recentList) {
        recentList.innerHTML = '';
        mockData.sessions.filter(s => s.status === 'completed').forEach(session => {
            const item = document.createElement('div');
            item.className = 'session-item';
            item.innerHTML = `
                <h4>Session ${session.id}</h4>
                <p>Charger: ${session.chargerId}</p>
                <p>User: ${session.user}</p>
                <p>Duration: ${session.duration} min</p>
                <p>Energy: ${session.energy} kWh</p>
                <p>Cost: $${session.cost.toFixed(2)}</p>
            `;
            recentList.appendChild(item);
        });
    }
}

// Modal functions
function showAddTenantModal() {
    document.getElementById('addTenantModal').classList.add('active');
}

function showAddStationModal() {
    document.getElementById('addStationModal').classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

function addTenant(event) {
    event.preventDefault();
    // Add tenant logic
    const name = document.getElementById('tenantName').value;
    const country = document.getElementById('tenantCountry').value;
    const email = document.getElementById('tenantEmail').value;
    const plan = document.getElementById('tenantPlan').value;
    
    // Mock adding tenant
    const newTenant = {
        id: 'T' + (mockData.tenants.length + 1).toString().padStart(3, '0'),
        name,
        country,
        stations: 0,
        users: 0,
        status: 'active'
    };
    
    mockData.tenants.push(newTenant);
    loadTenants();
    closeModal('addTenantModal');
    showNotification('Tenant added successfully', 'success');
}

function addStation(event) {
    event.preventDefault();
    // Add station logic
    const name = document.getElementById('stationName').value;
    const address = document.getElementById('stationAddress').value;
    const city = document.getElementById('stationCity').value;
    const lat = parseFloat(document.getElementById('stationLat').value);
    const lng = parseFloat(document.getElementById('stationLng').value);
    const chargerCount = parseInt(document.getElementById('chargerCount').value);
    
    // Mock adding station
    const newStation = {
        id: 'ST' + (mockData.stations.length + 1).toString().padStart(3, '0'),
        name,
        address,
        city,
        lat,
        lng,
        chargers: chargerCount,
        available: chargerCount
    };
    
    mockData.stations.push(newStation);
    loadStations();
    closeModal('addStationModal');
    showNotification('Station added successfully', 'success');
}

// Mobile app functions
function showMobileView(viewName) {
    document.querySelectorAll('.mobile-view').forEach(view => {
        view.classList.remove('active');
    });
    
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    event.currentTarget.classList.add('active');
    
    if (viewName === 'map') {
        document.getElementById('user-map-view').classList.add('active');
    } else if (viewName === 'scan') {
        startQRScanner();
    } else if (viewName === 'activity') {
        if (chargingSession) {
            document.getElementById('charging-session-view').classList.add('active');
        } else {
            showNotification('No active charging session', 'info');
        }
    }
}

function startQRScanner() {
    document.getElementById('qrScannerModal').classList.add('active');
    // In real implementation, initialize camera and QR scanner
    setTimeout(() => {
        // Mock QR scan success
        closeModal('qrScannerModal');
        startCharging('CH001');
    }, 3000);
}

function startCharging(chargerId) {
    chargingSession = {
        id: 'S' + Date.now(),
        chargerId,
        startTime: new Date(),
        duration: 0,
        energy: 0,
        cost: 0
    };
    
    document.getElementById('charging-session-view').classList.add('active');
    
    // Start updating session info
    sessionInterval = setInterval(updateChargingSession, 1000);
    showNotification('Charging started', 'success');
}

function updateChargingSession() {
    if (!chargingSession) return;
    
    const duration = Math.floor((Date.now() - chargingSession.startTime) / 1000);
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = duration % 60;
    
    chargingSession.duration = duration;
    chargingSession.energy = (duration / 60) * 0.8; // Mock energy consumption
    chargingSession.cost = chargingSession.energy * 0.35; // Mock pricing
    
    document.getElementById('sessionDuration').textContent = 
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    document.getElementById('sessionEnergy').textContent = 
        `${chargingSession.energy.toFixed(2)} kWh`;
    document.getElementById('sessionCost').textContent = 
        `$${chargingSession.cost.toFixed(2)}`;
    
    // Update battery animation
    const batteryLevel = Math.min((chargingSession.energy / 50) * 100, 100);
    document.getElementById('batteryLevel').style.width = batteryLevel + '%';
}

function stopCharging() {
    if (sessionInterval) {
        clearInterval(sessionInterval);
        sessionInterval = null;
    }
    
    if (chargingSession) {
        // Save session to history
        mockData.sessions.push({
            ...chargingSession,
            endTime: new Date(),
            status: 'completed'
        });
        
        showNotification(`Charging stopped. Total: $${chargingSession.cost.toFixed(2)}`, 'success');
        chargingSession = null;
        
        // Return to map view
        showMobileView('map');
    }
}

function showUserProfile() {
    document.getElementById('user-profile-view').classList.add('active');
}

function backToMap() {
    document.getElementById('user-map-view').classList.add('active');
    document.getElementById('station-details-view').classList.remove('active');
}

// Utility functions
function showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        padding: 12px 20px;
        background: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#3498db'};
        color: white;
        border-radius: 4px;
        z-index: 1001;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Initialize charts (placeholder)
function initCharts() {
    const ctx = document.getElementById('growthChart');
    if (ctx && typeof Chart !== 'undefined') {
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Charging Sessions',
                    data: [12000, 19000, 23000, 25000, 32000, 38000],
                    borderColor: '#00a651',
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }
}

// Filter functions
function filterChargers() {
    // Implement charger filtering logic
}

function searchStations() {
    // Implement station search logic
}

function toggleStationList() {
    // Toggle between map and list view
}

function toggleMobileMenu() {
    // Toggle mobile menu
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Check if Chart.js is loaded before initializing charts
    if (typeof Chart !== 'undefined') {
        initCharts();
    }
});

// Add CSS animation for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);