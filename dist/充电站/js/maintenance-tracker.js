// Maintenance Tracker Module

class MaintenanceTracker {
    constructor() {
        this.maintenanceRecords = [];
        this.scheduledMaintenance = [];
        this.maintenanceTypes = ['Preventive', 'Corrective', 'Emergency', 'Inspection'];
    }

    // Initialize maintenance tracker
    init() {
        console.log('Initializing maintenance tracker...');
        this.loadMaintenanceRecords();
        this.loadScheduledMaintenance();
        this.setupEventListeners();
    }

    // Load maintenance records
    async loadMaintenanceRecords() {
        try {
            // Mock maintenance data
            this.maintenanceRecords = [
                {
                    id: 1,
                    date: '2024-01-20',
                    station: 'Downtown Plaza',
                    charger: 'CHG-001',
                    type: 'Preventive',
                    technician: 'John Smith',
                    status: 'Completed',
                    notes: 'Regular maintenance check completed'
                },
                {
                    id: 2,
                    date: '2024-01-19',
                    station: 'Airport Terminal',
                    charger: 'CHG-045',
                    type: 'Corrective',
                    technician: 'Mike Johnson',
                    status: 'In Progress',
                    notes: 'Replacing faulty connector'
                },
                {
                    id: 3,
                    date: '2024-01-18',
                    station: 'Shopping Mall',
                    charger: 'CHG-023',
                    type: 'Emergency',
                    technician: 'Sarah Davis',
                    status: 'Completed',
                    notes: 'Emergency repair - power issue resolved'
                }
            ];
            this.renderMaintenanceTable();
        } catch (error) {
            console.error('Error loading maintenance records:', error);
        }
    }

    // Load scheduled maintenance
    async loadScheduledMaintenance() {
        try {
            this.scheduledMaintenance = [
                {
                    id: 1,
                    scheduledDate: '2024-01-25',
                    station: 'City Center',
                    chargers: ['CHG-010', 'CHG-011', 'CHG-012'],
                    type: 'Preventive',
                    assignedTo: 'Team A'
                },
                {
                    id: 2,
                    scheduledDate: '2024-01-28',
                    station: 'Tech Park',
                    chargers: ['CHG-030', 'CHG-031'],
                    type: 'Inspection',
                    assignedTo: 'Team B'
                }
            ];
            this.renderScheduledMaintenance();
        } catch (error) {
            console.error('Error loading scheduled maintenance:', error);
        }
    }

    // Render maintenance table
    renderMaintenanceTable() {
        const tbody = document.getElementById('maintenanceTableBody');
        if (!tbody) return;

        tbody.innerHTML = this.maintenanceRecords.map(record => `
            <tr>
                <td>${record.date}</td>
                <td>${record.station}</td>
                <td>${record.charger}</td>
                <td>
                    <span class="badge badge-${this.getTypeBadgeClass(record.type)}">
                        ${record.type}
                    </span>
                </td>
                <td>${record.technician}</td>
                <td>
                    <span class="badge badge-${this.getStatusBadgeClass(record.status)}">
                        ${record.status}
                    </span>
                </td>
                <td>${record.notes}</td>
            </tr>
        `).join('');
    }

    // Render scheduled maintenance
    renderScheduledMaintenance() {
        const container = document.getElementById('scheduledMaintenanceContainer');
        if (!container) return;

        container.innerHTML = this.scheduledMaintenance.map(schedule => `
            <div class="maintenance-schedule-card">
                <div class="schedule-header">
                    <h4>${schedule.station}</h4>
                    <span class="schedule-date">${schedule.scheduledDate}</span>
                </div>
                <div class="schedule-details">
                    <p>Chargers: ${schedule.chargers.join(', ')}</p>
                    <p>Type: ${schedule.type}</p>
                    <p>Assigned: ${schedule.assignedTo}</p>
                </div>
                <div class="schedule-actions">
                    <button onclick="maintenanceTracker.editSchedule(${schedule.id})" class="btn-minimal btn-ghost-minimal">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="maintenanceTracker.cancelSchedule(${schedule.id})" class="btn-minimal btn-ghost-minimal">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    // Get badge class for type
    getTypeBadgeClass(type) {
        switch(type) {
            case 'Emergency': return 'danger';
            case 'Corrective': return 'warning';
            case 'Preventive': return 'info';
            case 'Inspection': return 'secondary';
            default: return 'primary';
        }
    }

    // Get badge class for status
    getStatusBadgeClass(status) {
        switch(status) {
            case 'Completed': return 'success';
            case 'In Progress': return 'warning';
            case 'Scheduled': return 'info';
            case 'Cancelled': return 'secondary';
            default: return 'primary';
        }
    }

    // Add maintenance record
    addMaintenanceRecord(recordData) {
        const newRecord = {
            id: this.maintenanceRecords.length + 1,
            date: new Date().toISOString().split('T')[0],
            ...recordData,
            status: 'In Progress'
        };
        this.maintenanceRecords.unshift(newRecord);
        this.renderMaintenanceTable();
    }

    // Schedule maintenance
    scheduleMaintenance(scheduleData) {
        const newSchedule = {
            id: this.scheduledMaintenance.length + 1,
            ...scheduleData
        };
        this.scheduledMaintenance.push(newSchedule);
        this.renderScheduledMaintenance();
    }

    // Edit schedule
    editSchedule(scheduleId) {
        console.log('Editing schedule:', scheduleId);
        // Implementation for edit functionality
    }

    // Cancel schedule
    cancelSchedule(scheduleId) {
        if (confirm('Are you sure you want to cancel this scheduled maintenance?')) {
            this.scheduledMaintenance = this.scheduledMaintenance.filter(s => s.id !== scheduleId);
            this.renderScheduledMaintenance();
        }
    }

    // Generate maintenance report
    generateReport(startDate, endDate) {
        const filtered = this.maintenanceRecords.filter(record => {
            const recordDate = new Date(record.date);
            return recordDate >= new Date(startDate) && recordDate <= new Date(endDate);
        });

        const report = {
            period: `${startDate} to ${endDate}`,
            totalRecords: filtered.length,
            byType: {},
            byStatus: {},
            byStation: {}
        };

        filtered.forEach(record => {
            // Count by type
            report.byType[record.type] = (report.byType[record.type] || 0) + 1;
            // Count by status
            report.byStatus[record.status] = (report.byStatus[record.status] || 0) + 1;
            // Count by station
            report.byStation[record.station] = (report.byStation[record.station] || 0) + 1;
        });

        return report;
    }

    // Setup event listeners
    setupEventListeners() {
        // Add event listeners for maintenance tracking
    }

    // Export maintenance records
    exportRecords() {
        const csv = [
            ['Date', 'Station', 'Charger', 'Type', 'Technician', 'Status', 'Notes'],
            ...this.maintenanceRecords.map(r => [
                r.date, r.station, r.charger, r.type, r.technician, r.status, r.notes
            ])
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'maintenance-records.csv';
        a.click();
    }
}

// Create global instance
const maintenanceTracker = new MaintenanceTracker();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MaintenanceTracker;
}