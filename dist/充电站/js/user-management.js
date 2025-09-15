// User Management Module

class UserManagement {
    constructor() {
        this.users = [];
        this.currentPage = 1;
        this.pageSize = 10;
    }

    // Initialize user management
    init() {
        console.log('Initializing user management...');
        this.loadUsers();
        this.setupEventListeners();
    }

    // Load users from API
    async loadUsers() {
        try {
            // Mock data for now
            this.users = [
                { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active' },
                { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Active' },
                { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Manager', status: 'Inactive' }
            ];
            this.renderUserTable();
        } catch (error) {
            console.error('Error loading users:', error);
        }
    }

    // Render user table
    renderUserTable() {
        const tbody = document.getElementById('usersTableBody');
        if (!tbody) return;

        const start = (this.currentPage - 1) * this.pageSize;
        const end = start + this.pageSize;
        const pageUsers = this.users.slice(start, end);

        tbody.innerHTML = pageUsers.map(user => `
            <tr>
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.role}</td>
                <td>
                    <span class="badge ${user.status === 'Active' ? 'badge-success' : 'badge-secondary'}">
                        ${user.status}
                    </span>
                </td>
                <td>
                    <button class="btn-minimal btn-ghost-minimal" onclick="userManagement.editUser(${user.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-minimal btn-ghost-minimal" onclick="userManagement.deleteUser(${user.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    // Edit user
    editUser(userId) {
        console.log('Editing user:', userId);
        // Implementation for edit functionality
    }

    // Delete user
    deleteUser(userId) {
        if (confirm('Are you sure you want to delete this user?')) {
            this.users = this.users.filter(u => u.id !== userId);
            this.renderUserTable();
        }
    }

    // Add new user
    addUser(userData) {
        const newUser = {
            id: this.users.length + 1,
            ...userData,
            status: 'Active'
        };
        this.users.push(newUser);
        this.renderUserTable();
    }

    // Setup event listeners
    setupEventListeners() {
        // Add event listeners for user management features
    }

    // Search users
    searchUsers(query) {
        const filtered = this.users.filter(user => 
            user.name.toLowerCase().includes(query.toLowerCase()) ||
            user.email.toLowerCase().includes(query.toLowerCase())
        );
        return filtered;
    }

    // Export users to CSV
    exportToCSV() {
        const csv = [
            ['ID', 'Name', 'Email', 'Role', 'Status'],
            ...this.users.map(u => [u.id, u.name, u.email, u.role, u.status])
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'users.csv';
        a.click();
    }
}

// Create global instance
const userManagement = new UserManagement();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UserManagement;
}