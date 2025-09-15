/**
 * Common JavaScript for Platform Admin
 * 平台管理员通用功能
 */

// Initialize sidebar navigation
function initializeSidebar(activeItem) {
    const sidebarConfig = {
        brand: 'EV Platform Admin',
        logo: '<i class="fas fa-bolt"></i>',
        items: [
            { id: 'dashboard', label: 'Dashboard', href: 'index.html', icon: 'fas fa-tachometer-alt' },
            { id: 'tenants', label: 'Tenants', href: 'tenants.html', icon: 'fas fa-building' },
            { id: 'audit', label: 'Audit Logs', href: 'audit-logs.html', icon: 'fas fa-file-alt' },
            { id: 'monitoring', label: 'Monitoring', href: 'monitoring.html', icon: 'fas fa-chart-line' },
            { id: 'settings', label: 'Settings', href: 'settings.html', icon: 'fas fa-cog' }
        ],
        activeItem: activeItem,
        style: 'vertical',
        theme: 'light'
    };

    const nav = new Components.Navigation(sidebarConfig);
    nav.render('sidebar');
}

// Common notification function
function showNotification(type, message, title) {
    Components.Notification[type](message, title);
}

// Common modal functions
function showConfirmModal(title, message, onConfirm) {
    const modal = new Components.Modal({
        title: title,
        content: `<p>${message}</p>`,
        size: 'small',
        buttons: [
            { text: 'Cancel', type: 'secondary', action: 'close' },
            { text: 'Confirm', type: 'primary', action: 'confirm' }
        ],
        onConfirm: onConfirm
    });
    modal.open();
}

// Format date for display
function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Format number with commas
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Toggle notifications panel
function toggleNotifications() {
    const panel = document.getElementById('notificationPanel');
    if (panel) {
        panel.classList.toggle('show');
    }
}

// Export data to CSV
function exportToCSV(data, filename) {
    const csv = convertToCSV(data);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
}

function convertToCSV(data) {
    if (data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const csv = [
        headers.join(','),
        ...data.map(row => 
            headers.map(header => {
                const value = row[header];
                return typeof value === 'string' && value.includes(',') 
                    ? `"${value}"` 
                    : value;
            }).join(',')
        )
    ];
    
    return csv.join('\n');
}

// API calls for admin operations
const adminAPI = {
    getTenants: async () => {
        // Simulated API call
        return [
            { id: 1, name: 'TeslaCharge Inc', stations: 245, users: 12500, status: 'active', created: '2024-01-15' },
            { id: 2, name: 'GreenPower Solutions', stations: 189, users: 8900, status: 'active', created: '2024-02-20' },
            { id: 3, name: 'ChargePoint Network', stations: 567, users: 45000, status: 'active', created: '2023-11-10' },
            { id: 4, name: 'EVgo Services', stations: 321, users: 23400, status: 'suspended', created: '2023-12-05' },
            { id: 5, name: 'Electrify America', stations: 890, users: 67000, status: 'active', created: '2023-09-18' }
        ];
    },

    getAuditLogs: async () => {
        // Simulated API call
        return [
            { timestamp: '2025-01-20 14:23:45', user: 'admin@platform.com', action: 'CREATE_TENANT', details: 'Created new tenant: TeslaCharge Inc', ip: '192.168.1.1', status: 'success' },
            { timestamp: '2025-01-20 13:15:30', user: 'system', action: 'BACKUP', details: 'Automated backup completed', ip: 'localhost', status: 'success' },
            { timestamp: '2025-01-20 12:45:00', user: 'admin@platform.com', action: 'UPDATE_SETTINGS', details: 'Updated system configuration', ip: '192.168.1.1', status: 'success' },
            { timestamp: '2025-01-20 11:30:15', user: 'monitor@system.com', action: 'ALERT', details: 'High CPU usage detected', ip: 'localhost', status: 'warning' },
            { timestamp: '2025-01-20 10:00:00', user: 'admin@platform.com', action: 'DELETE_USER', details: 'Removed inactive user account', ip: '192.168.1.1', status: 'success' }
        ];
    },

    getSystemMetrics: async () => {
        // Simulated API call
        return {
            cpu: { current: 45, average: 40, peak: 78 },
            memory: { current: 62, available: 38, total: 64 },
            storage: { used: 78, free: 22, total: 500 },
            network: { in: 125, out: 89, connections: 1234 },
            database: { queries: 4567, connections: 45, responseTime: 23 }
        };
    },

    getAlerts: async () => {
        // Simulated API call
        return [
            { id: 1, type: 'warning', message: 'Storage usage above 75%', time: '5 mins ago', resolved: false },
            { id: 2, type: 'info', message: 'Scheduled maintenance tonight', time: '1 hour ago', resolved: false },
            { id: 3, type: 'error', message: 'Failed login attempts detected', time: '2 hours ago', resolved: true },
            { id: 4, type: 'success', message: 'Backup completed successfully', time: '3 hours ago', resolved: true }
        ];
    }
};

// Initialize common features on page load
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    const isAuthenticated = sessionStorage.getItem('adminAuthenticated');
    if (!isAuthenticated && !window.location.pathname.includes('login')) {
        window.location.href = 'login.html';
    }

    // Setup user menu
    const userMenu = document.querySelector('.user-menu');
    if (userMenu) {
        userMenu.addEventListener('click', function() {
            showUserMenu();
        });
    }

    // Setup keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + K for search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            openSearchModal();
        }
        
        // Escape to close modals
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });
});

function showUserMenu() {
    const menuHTML = `
        <div class="user-dropdown">
            <a href="profile.html"><i class="fas fa-user"></i> Profile</a>
            <a href="settings.html"><i class="fas fa-cog"></i> Settings</a>
            <hr>
            <a href="#" onclick="logout()"><i class="fas fa-sign-out-alt"></i> Logout</a>
        </div>
    `;
    
    // Implementation for dropdown menu
}

function logout() {
    sessionStorage.removeItem('adminAuthenticated');
    window.location.href = 'login.html';
}

function openSearchModal() {
    const modal = new Components.Modal({
        title: 'Quick Search',
        content: `
            <div class="quick-search">
                <input type="text" placeholder="Search tenants, users, or settings..." class="search-input" autofocus>
                <div class="search-results"></div>
            </div>
        `,
        size: 'medium'
    });
    modal.open();
}

function closeAllModals() {
    document.querySelectorAll('.modal-component').forEach(modal => {
        modal.remove();
    });
}