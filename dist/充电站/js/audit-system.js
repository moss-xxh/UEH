// Audit System for EV Charging Platform
// Implements FR-ADM-005: Tenant operation audit logs

class AuditSystem {
    constructor() {
        this.auditLogs = [];
        this.maxLogs = 10000;
        this.logRetentionDays = 1095; // 3 years
        this.initializeAuditSystem();
    }

    initializeAuditSystem() {
        // Load existing logs from localStorage
        const storedLogs = localStorage.getItem('auditLogs');
        if (storedLogs) {
            try {
                this.auditLogs = JSON.parse(storedLogs);
                this.cleanOldLogs();
            } catch (e) {
                console.error('Failed to load audit logs:', e);
                this.auditLogs = [];
            }
        }

        // Set up periodic cleanup
        setInterval(() => this.cleanOldLogs(), 24 * 60 * 60 * 1000); // Daily cleanup
    }

    // Log an audit event
    logEvent(eventData) {
        const auditEntry = {
            id: this.generateAuditId(),
            timestamp: new Date().toISOString(),
            user: eventData.user || this.getCurrentUser(),
            action: eventData.action,
            resource: eventData.resource,
            resourceId: eventData.resourceId,
            details: eventData.details || {},
            ipAddress: this.getClientIP(),
            userAgent: navigator.userAgent,
            status: eventData.status || 'SUCCESS',
            sessionId: this.getSessionId(),
            changes: eventData.changes || null,
            metadata: {
                browser: this.getBrowserInfo(),
                platform: navigator.platform,
                language: navigator.language,
                screenResolution: `${window.screen.width}x${window.screen.height}`
            }
        };

        this.auditLogs.unshift(auditEntry);

        // Trim logs if exceeding max
        if (this.auditLogs.length > this.maxLogs) {
            this.auditLogs = this.auditLogs.slice(0, this.maxLogs);
        }

        // Persist to localStorage
        this.persistLogs();

        // Emit event for real-time updates
        this.emitAuditEvent(auditEntry);

        return auditEntry;
    }

    // Generate unique audit ID
    generateAuditId() {
        return `AUDIT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    // Get current user info
    getCurrentUser() {
        const session = sessionManager?.getSession();
        return session?.user?.email || 'anonymous';
    }

    // Get client IP (mock for demo)
    getClientIP() {
        // In production, this would come from the server
        return '192.168.1.' + Math.floor(Math.random() * 255);
    }

    // Get session ID
    getSessionId() {
        return sessionStorage.getItem('sessionId') || this.createSessionId();
    }

    createSessionId() {
        const sessionId = `SESSION-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        sessionStorage.setItem('sessionId', sessionId);
        return sessionId;
    }

    // Get browser info
    getBrowserInfo() {
        const ua = navigator.userAgent;
        if (ua.indexOf('Chrome') > -1) return 'Chrome';
        if (ua.indexOf('Safari') > -1) return 'Safari';
        if (ua.indexOf('Firefox') > -1) return 'Firefox';
        if (ua.indexOf('Edge') > -1) return 'Edge';
        return 'Unknown';
    }

    // Clean old logs
    cleanOldLogs() {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - this.logRetentionDays);
        
        this.auditLogs = this.auditLogs.filter(log => {
            return new Date(log.timestamp) > cutoffDate;
        });
        
        this.persistLogs();
    }

    // Persist logs to localStorage
    persistLogs() {
        try {
            localStorage.setItem('auditLogs', JSON.stringify(this.auditLogs));
        } catch (e) {
            console.error('Failed to persist audit logs:', e);
            // In production, send to server
        }
    }

    // Emit audit event for real-time updates
    emitAuditEvent(entry) {
        window.dispatchEvent(new CustomEvent('auditLog', { detail: entry }));
    }

    // Query audit logs
    queryLogs(filters = {}) {
        let results = [...this.auditLogs];

        if (filters.user) {
            results = results.filter(log => log.user.includes(filters.user));
        }

        if (filters.action) {
            results = results.filter(log => log.action === filters.action);
        }

        if (filters.resource) {
            results = results.filter(log => log.resource === filters.resource);
        }

        if (filters.status) {
            results = results.filter(log => log.status === filters.status);
        }

        if (filters.startDate) {
            const startDate = new Date(filters.startDate);
            results = results.filter(log => new Date(log.timestamp) >= startDate);
        }

        if (filters.endDate) {
            const endDate = new Date(filters.endDate);
            results = results.filter(log => new Date(log.timestamp) <= endDate);
        }

        return results;
    }

    // Export logs
    exportLogs(format = 'json') {
        if (format === 'json') {
            return JSON.stringify(this.auditLogs, null, 2);
        } else if (format === 'csv') {
            return this.convertToCSV(this.auditLogs);
        }
    }

    // Convert logs to CSV
    convertToCSV(logs) {
        if (logs.length === 0) return '';

        const headers = ['Timestamp', 'User', 'Action', 'Resource', 'Status', 'IP Address'];
        const rows = logs.map(log => [
            log.timestamp,
            log.user,
            log.action,
            log.resource,
            log.status,
            log.ipAddress
        ]);

        return [headers, ...rows].map(row => row.join(',')).join('\n');
    }

    // Get statistics
    getStatistics() {
        const stats = {
            totalLogs: this.auditLogs.length,
            byAction: {},
            byUser: {},
            byStatus: {},
            byResource: {},
            recentActivity: []
        };

        this.auditLogs.forEach(log => {
            // By action
            stats.byAction[log.action] = (stats.byAction[log.action] || 0) + 1;
            
            // By user
            stats.byUser[log.user] = (stats.byUser[log.user] || 0) + 1;
            
            // By status
            stats.byStatus[log.status] = (stats.byStatus[log.status] || 0) + 1;
            
            // By resource
            stats.byResource[log.resource] = (stats.byResource[log.resource] || 0) + 1;
        });

        // Recent activity (last 24 hours)
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        stats.recentActivity = this.auditLogs.filter(log => 
            new Date(log.timestamp) > yesterday
        );

        return stats;
    }
}

// Audit action types
const AuditActions = {
    // Authentication
    LOGIN: 'LOGIN',
    LOGOUT: 'LOGOUT',
    LOGIN_FAILED: 'LOGIN_FAILED',
    PASSWORD_RESET: 'PASSWORD_RESET',
    
    // Tenant operations
    TENANT_CREATE: 'TENANT_CREATE',
    TENANT_UPDATE: 'TENANT_UPDATE',
    TENANT_DELETE: 'TENANT_DELETE',
    TENANT_SUSPEND: 'TENANT_SUSPEND',
    TENANT_ACTIVATE: 'TENANT_ACTIVATE',
    
    // Station operations
    STATION_CREATE: 'STATION_CREATE',
    STATION_UPDATE: 'STATION_UPDATE',
    STATION_DELETE: 'STATION_DELETE',
    STATION_IMPORT: 'STATION_IMPORT',
    
    // Charger operations
    CHARGER_CREATE: 'CHARGER_CREATE',
    CHARGER_UPDATE: 'CHARGER_UPDATE',
    CHARGER_DELETE: 'CHARGER_DELETE',
    CHARGER_CONTROL: 'CHARGER_CONTROL',
    
    // User management
    USER_CREATE: 'USER_CREATE',
    USER_UPDATE: 'USER_UPDATE',
    USER_DELETE: 'USER_DELETE',
    USER_SUSPEND: 'USER_SUSPEND',
    USER_ACTIVATE: 'USER_ACTIVATE',
    
    // Charging sessions
    SESSION_START: 'SESSION_START',
    SESSION_STOP: 'SESSION_STOP',
    SESSION_CANCEL: 'SESSION_CANCEL',
    
    // Payment operations
    PAYMENT_PROCESS: 'PAYMENT_PROCESS',
    PAYMENT_REFUND: 'PAYMENT_REFUND',
    PAYMENT_METHOD_ADD: 'PAYMENT_METHOD_ADD',
    PAYMENT_METHOD_REMOVE: 'PAYMENT_METHOD_REMOVE',
    
    // Configuration
    CONFIG_UPDATE: 'CONFIG_UPDATE',
    PRICING_UPDATE: 'PRICING_UPDATE',
    
    // Data operations
    DATA_EXPORT: 'DATA_EXPORT',
    DATA_IMPORT: 'DATA_IMPORT',
    REPORT_GENERATE: 'REPORT_GENERATE',
    
    // Security
    PERMISSION_GRANT: 'PERMISSION_GRANT',
    PERMISSION_REVOKE: 'PERMISSION_REVOKE',
    SECURITY_ALERT: 'SECURITY_ALERT'
};

// Resource types
const ResourceTypes = {
    TENANT: 'TENANT',
    STATION: 'STATION',
    CHARGER: 'CHARGER',
    USER: 'USER',
    SESSION: 'SESSION',
    PAYMENT: 'PAYMENT',
    CONFIG: 'CONFIG',
    REPORT: 'REPORT',
    SYSTEM: 'SYSTEM'
};

// Initialize global audit system
const auditSystem = new AuditSystem();

// Helper function to log common actions
function logAuditEvent(action, resource, details = {}) {
    return auditSystem.logEvent({
        action,
        resource,
        ...details
    });
}

// Intercept and audit API calls
if (typeof apiClient !== 'undefined') {
    const originalRequest = apiClient.request;
    apiClient.request = async function(method, endpoint, options = {}) {
        const startTime = Date.now();
        let response;
        let status = 'SUCCESS';
        
        try {
            response = await originalRequest.call(this, method, endpoint, options);
        } catch (error) {
            status = 'FAILED';
            response = error;
            throw error;
        } finally {
            // Log API call audit
            auditSystem.logEvent({
                action: `API_${method}`,
                resource: 'API',
                resourceId: endpoint,
                status,
                details: {
                    method,
                    endpoint,
                    duration: Date.now() - startTime,
                    statusCode: response?.status
                }
            });
        }
        
        return response;
    };
}

// Display audit logs in UI
function displayAuditLogs(containerId = 'auditLogsTableBody') {
    const container = document.getElementById(containerId);
    if (!container) return;

    const logs = auditSystem.queryLogs({ 
        startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
    });

    container.innerHTML = logs.slice(0, 100).map(log => `
        <tr>
            <td>${new Date(log.timestamp).toLocaleString()}</td>
            <td>${log.user}</td>
            <td><span class="badge">${log.action}</span></td>
            <td>${log.resource}</td>
            <td>${log.ipAddress}</td>
            <td>
                <span class="status-badge ${log.status.toLowerCase()}">
                    ${log.status}
                </span>
            </td>
        </tr>
    `).join('');
}

// Listen for audit events and update UI
window.addEventListener('auditLog', (event) => {
    displayAuditLogs();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        AuditSystem,
        auditSystem,
        AuditActions,
        ResourceTypes,
        logAuditEvent
    };
}