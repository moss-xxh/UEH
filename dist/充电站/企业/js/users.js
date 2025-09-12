// 用户管理页面功能
class UsersPage {
    constructor() {
        this.users = [];
        this.filteredUsers = [];
        this.currentPage = 1;
        this.itemsPerPage = 20;
        this.updateInterval = null;
        this.init();
    }

    init() {
        // 插入导航栏
        document.getElementById('header-container').innerHTML = SharedComponents.createHeader('users');
        
        // 初始化通用功能
        SharedComponents.initCommonFeatures();
        
        // 初始化用户数据
        this.initUserData();
        
        // 渲染用户列表
        this.renderUserTable();
        
        // 初始化最新用户
        this.initLatestUsers();
        
        // 绑定事件
        this.bindEvents();
        
        // 启动实时更新
        this.startRealTimeUpdates();
    }

    initUserData() {
        // 生成模拟用户数据
        this.users = [];
        const surnames = ['张', '李', '王', '刘', '陈', '杨', '黄', '赵', '周', '吴', '徐', '孙', '胡', '朱', '高', '林'];
        const names = ['伟', '芳', '娜', '秀英', '敏', '静', '丽', '强', '磊', '军', '洋', '勇', '艳', '杰', '涛', '明'];
        const companies = ['科技有限公司', '贸易有限公司', '投资有限公司', '建设集团', '物流公司', '制造有限公司'];
        const cities = ['北京', '上海', '深圳', '广州', '杭州', '成都', '武汉', '南京', '西安', '重庆'];

        for (let i = 1; i <= 45678; i++) {
            const userType = Math.random() > 0.289 ? 'personal' : 'enterprise';
            const surname = surnames[Math.floor(Math.random() * surnames.length)];
            const name = names[Math.floor(Math.random() * names.length)];
            const userName = userType === 'personal' ? 
                `${surname}${name}` : 
                `${surname}${name}(${companies[Math.floor(Math.random() * companies.length)]})`;
            
            this.users.push({
                id: i,
                userId: `U${String(i).padStart(6, '0')}`,
                name: userName,
                phone: this.generatePhone(),
                email: this.generateEmail(userName),
                userType: userType,
                userLevel: this.getRandomUserLevel(),
                status: this.getRandomUserStatus(),
                registrationDate: this.getRandomDate(365),
                lastLogin: this.getRandomDate(30),
                chargeCount: Math.floor(Math.random() * 200),
                totalSpent: Math.random() * 5000,
                balance: Math.random() * 1000,
                city: cities[Math.floor(Math.random() * cities.length)],
                avatar: this.generateAvatar(userName),
                membershipExpiry: this.getMembershipExpiry(),
                points: Math.floor(Math.random() * 10000)
            });
        }

        // 按注册时间倒序排列
        this.users.sort((a, b) => new Date(b.registrationDate) - new Date(a.registrationDate));
        this.filteredUsers = [...this.users];
    }

    generatePhone() {
        const prefixes = ['138', '139', '150', '151', '188', '189', '130', '131', '132'];
        const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
        const suffix = Math.floor(Math.random() * 100000000).toString().padStart(8, '0');
        return prefix + suffix;
    }

    generateEmail(name) {
        const domains = ['163.com', 'qq.com', 'gmail.com', 'sina.com', 'outlook.com'];
        const domain = domains[Math.floor(Math.random() * domains.length)];
        const localPart = name.toLowerCase().replace(/[^a-z0-9]/g, '') + Math.floor(Math.random() * 1000);
        return `${localPart}@${domain}`;
    }

    generateAvatar(name) {
        // 使用第一个字符作为头像
        return name.charAt(0);
    }

    getRandomUserLevel() {
        const levels = [
            { level: 'normal', weight: 60 },
            { level: 'vip', weight: 30 },
            { level: 'premium', weight: 10 }
        ];
        
        let random = Math.random() * 100;
        for (const item of levels) {
            if (random < item.weight) {
                return item.level;
            }
            random -= item.weight;
        }
        return 'normal';
    }

    getRandomUserStatus() {
        const statuses = [
            { status: 'active', weight: 85 },
            { status: 'blocked', weight: 10 },
            { status: 'inactive', weight: 5 }
        ];
        
        let random = Math.random() * 100;
        for (const item of statuses) {
            if (random < item.weight) {
                return item.status;
            }
            random -= item.weight;
        }
        return 'active';
    }

    getRandomDate(daysAgo) {
        const date = new Date();
        date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo));
        date.setHours(Math.floor(Math.random() * 24));
        date.setMinutes(Math.floor(Math.random() * 60));
        return date.toISOString();
    }

    getMembershipExpiry() {
        const date = new Date();
        date.setMonth(date.getMonth() + Math.floor(Math.random() * 12) + 1);
        return date.toISOString();
    }

    renderUserTable() {
        const tbody = document.getElementById('users-table-body');
        if (!tbody) return;

        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const currentUsers = this.filteredUsers.slice(startIndex, endIndex);

        tbody.innerHTML = currentUsers.map(user => `
            <tr data-user-id="${user.id}">
                <td>
                    <div class="user-id">${user.userId}</div>
                </td>
                <td>
                    <div class="user-info">
                        <div class="user-avatar">${user.avatar}</div>
                        <div class="user-details">
                            <div class="user-name">${user.name}</div>
                            <div class="user-contact">${user.phone}</div>
                            <div class="user-email">${user.email}</div>
                        </div>
                    </div>
                </td>
                <td>
                    <span class="user-type ${user.userType}">
                        ${user.userType === 'personal' ? '个人用户' : '企业用户'}
                    </span>
                </td>
                <td>
                    <span class="user-level ${user.userLevel}">
                        ${this.getUserLevelText(user.userLevel)}
                    </span>
                </td>
                <td>
                    <div class="date-info">
                        ${SharedComponents.formatDateTime(user.registrationDate).split(' ')[0]}
                    </div>
                </td>
                <td>
                    <div class="date-info">
                        ${this.getRelativeTime(user.lastLogin)}
                    </div>
                </td>
                <td>${user.chargeCount}次</td>
                <td>¥${user.totalSpent.toFixed(2)}</td>
                <td>¥${user.balance.toFixed(2)}</td>
                <td>${SharedComponents.formatStatus(user.status)}</td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn" onclick="usersPage.viewUser(${user.id})" title="查看详情">👁️</button>
                        <button class="action-btn" onclick="usersPage.editUser(${user.id})" title="编辑">✏️</button>
                        ${user.status === 'active' ? 
                            `<button class="action-btn warning" onclick="usersPage.blockUser(${user.id})" title="冻结">🚫</button>` :
                            `<button class="action-btn success" onclick="usersPage.unblockUser(${user.id})" title="解冻">✅</button>`
                        }
                        <button class="action-btn fault" onclick="usersPage.deleteUser(${user.id})" title="删除">🗑️</button>
                    </div>
                </td>
            </tr>
        `).join('');

        this.updatePaginationInfo();
    }

    getUserLevelText(level) {
        const levelMap = {
            normal: '普通用户',
            vip: 'VIP用户',
            premium: '高级会员'
        };
        return levelMap[level] || level;
    }

    getRelativeTime(timeString) {
        const time = new Date(timeString);
        const now = new Date();
        const diff = now - time;
        const minutes = Math.floor(diff / 60000);
        
        if (minutes < 1) return '刚刚';
        if (minutes < 60) return `${minutes}分钟前`;
        
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}小时前`;
        
        const days = Math.floor(hours / 24);
        if (days < 30) return `${days}天前`;
        
        return SharedComponents.formatDateTime(timeString).split(' ')[0];
    }

    updatePaginationInfo() {
        const info = document.querySelector('.pagination-info');
        if (info) {
            const start = (this.currentPage - 1) * this.itemsPerPage + 1;
            const end = Math.min(this.currentPage * this.itemsPerPage, this.filteredUsers.length);
            info.textContent = `显示 ${start}-${end} 条，共 ${this.filteredUsers.length.toLocaleString()} 条记录`;
        }
    }

    initLatestUsers() {
        this.updateLatestUsers();
    }

    updateLatestUsers() {
        const container = document.getElementById('latest-users');
        if (!container) return;

        const latestUsers = this.users
            .filter(user => user.status === 'active')
            .slice(0, 10);

        container.innerHTML = latestUsers.map(user => `
            <div class="latest-user-item">
                <div class="user-avatar">${user.avatar}</div>
                <div class="user-info">
                    <div class="user-name">${user.name}</div>
                    <div class="user-details">
                        <span class="user-type ${user.userType}">
                            ${user.userType === 'personal' ? '个人' : '企业'}
                        </span>
                        <span class="user-city">${user.city}</span>
                    </div>
                </div>
                <div class="registration-time">${this.getRelativeTime(user.registrationDate)}</div>
            </div>
        `).join('');
    }

    bindEvents() {
        // 搜索功能
        const searchBox = document.querySelector('.search-box');
        if (searchBox) {
            searchBox.addEventListener('input', SharedComponents.debounce((e) => {
                this.filterUsers();
            }, 300));
        }

        // 状态筛选
        const statusFilter = document.querySelector('.filter-select');
        if (statusFilter) {
            statusFilter.addEventListener('change', (e) => {
                this.filterUsers();
            });
        }

        // 类型筛选
        const typeFilter = document.querySelectorAll('.filter-select')[1];
        if (typeFilter) {
            typeFilter.addEventListener('change', (e) => {
                this.filterUsers();
            });
        }

        // 等级筛选
        const levelFilter = document.querySelectorAll('.filter-select')[2];
        if (levelFilter) {
            levelFilter.addEventListener('change', (e) => {
                this.filterUsers();
            });
        }

        // 导出按钮
        const exportBtn = document.querySelector('.btn-primary');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                this.exportUsers();
            });
        }

        // 分页按钮
        document.querySelectorAll('.page-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (!btn.disabled && btn.textContent !== '...') {
                    const page = parseInt(btn.textContent) || this.currentPage;
                    this.changePage(page);
                }
            });
        });

        // 活跃度筛选
        const activityFilter = document.querySelector('.analysis-filter');
        if (activityFilter) {
            activityFilter.addEventListener('change', (e) => {
                this.updateActivityData(e.target.value);
            });
        }

        // 时间筛选
        const timeFilter = document.querySelector('.time-filter');
        if (timeFilter) {
            timeFilter.addEventListener('change', (e) => {
                this.updateBehaviorData(e.target.value);
            });
        }
    }

    filterUsers() {
        const searchTerm = document.querySelector('.search-box').value.toLowerCase();
        const statusFilter = document.querySelector('.filter-select').value;
        const typeFilter = document.querySelectorAll('.filter-select')[1].value;
        const levelFilter = document.querySelectorAll('.filter-select')[2].value;

        this.filteredUsers = this.users.filter(user => {
            const matchesSearch = !searchTerm || 
                user.name.toLowerCase().includes(searchTerm) ||
                user.phone.includes(searchTerm) ||
                user.email.toLowerCase().includes(searchTerm) ||
                user.userId.toLowerCase().includes(searchTerm);
            
            const matchesStatus = !statusFilter || user.status === statusFilter;
            const matchesType = !typeFilter || user.userType === typeFilter;
            const matchesLevel = !levelFilter || user.userLevel === levelFilter;

            return matchesSearch && matchesStatus && matchesType && matchesLevel;
        });

        this.currentPage = 1;
        this.renderUserTable();
    }

    changePage(page) {
        this.currentPage = page;
        this.renderUserTable();
        
        // 更新分页按钮状态
        document.querySelectorAll('.page-btn').forEach(btn => {
            btn.classList.remove('active');
            if (parseInt(btn.textContent) === page) {
                btn.classList.add('active');
            }
        });
    }

    viewUser(userId) {
        const user = this.users.find(u => u.id === userId);
        if (!user) return;

        const modal = document.createElement('div');
        modal.className = 'user-detail-modal';
        modal.innerHTML = `
            <div class="modal-overlay" onclick="this.parentElement.remove()"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h3>用户详情 - ${user.name}</h3>
                    <button class="modal-close" onclick="this.closest('.user-detail-modal').remove()">×</button>
                </div>
                <div class="modal-body">
                    <div class="user-detail-grid">
                        <div class="detail-section">
                            <h4>基本信息</h4>
                            <div class="detail-item">
                                <label>用户ID</label>
                                <span>${user.userId}</span>
                            </div>
                            <div class="detail-item">
                                <label>用户姓名</label>
                                <span>${user.name}</span>
                            </div>
                            <div class="detail-item">
                                <label>手机号码</label>
                                <span>${user.phone}</span>
                            </div>
                            <div class="detail-item">
                                <label>邮箱地址</label>
                                <span>${user.email}</span>
                            </div>
                            <div class="detail-item">
                                <label>所在城市</label>
                                <span>${user.city}</span>
                            </div>
                        </div>
                        
                        <div class="detail-section">
                            <h4>账户信息</h4>
                            <div class="detail-item">
                                <label>用户类型</label>
                                <span class="user-type ${user.userType}">
                                    ${user.userType === 'personal' ? '个人用户' : '企业用户'}
                                </span>
                            </div>
                            <div class="detail-item">
                                <label>用户等级</label>
                                <span class="user-level ${user.userLevel}">
                                    ${this.getUserLevelText(user.userLevel)}
                                </span>
                            </div>
                            <div class="detail-item">
                                <label>账户状态</label>
                                <span>${SharedComponents.formatStatus(user.status)}</span>
                            </div>
                            <div class="detail-item">
                                <label>账户余额</label>
                                <span>¥${user.balance.toFixed(2)}</span>
                            </div>
                            <div class="detail-item">
                                <label>积分</label>
                                <span>${user.points.toLocaleString()}</span>
                            </div>
                        </div>

                        <div class="detail-section">
                            <h4>使用统计</h4>
                            <div class="detail-item">
                                <label>注册时间</label>
                                <span>${SharedComponents.formatDateTime(user.registrationDate)}</span>
                            </div>
                            <div class="detail-item">
                                <label>最后登录</label>
                                <span>${SharedComponents.formatDateTime(user.lastLogin)}</span>
                            </div>
                            <div class="detail-item">
                                <label>充电次数</label>
                                <span>${user.chargeCount}次</span>
                            </div>
                            <div class="detail-item">
                                <label>累计消费</label>
                                <span>¥${user.totalSpent.toFixed(2)}</span>
                            </div>
                            ${user.userLevel !== 'normal' ? `
                                <div class="detail-item">
                                    <label>会员到期</label>
                                    <span>${SharedComponents.formatDateTime(user.membershipExpiry).split(' ')[0]}</span>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                    <div class="modal-actions">
                        <button class="btn btn-primary" onclick="usersPage.editUser(${user.id})">编辑用户</button>
                        ${user.status === 'active' ? 
                            `<button class="btn btn-warning" onclick="usersPage.blockUser(${user.id})">冻结账户</button>` :
                            `<button class="btn btn-success" onclick="usersPage.unblockUser(${user.id})">解冻账户</button>`
                        }
                        <button class="btn" onclick="this.closest('.user-detail-modal').remove()">关闭</button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    editUser(userId) {
        const user = this.users.find(u => u.id === userId);
        if (!user) return;

        SharedComponents.showToast(`编辑用户 ${user.name}`, 'info');
        // 这里可以添加编辑用户的表单逻辑
    }

    blockUser(userId) {
        const user = this.users.find(u => u.id === userId);
        if (!user) return;

        SharedComponents.showConfirm(
            '冻结用户',
            `确定要冻结用户 ${user.name} 的账户吗？`,
            () => {
                user.status = 'blocked';
                this.renderUserTable();
                SharedComponents.showToast(`用户 ${user.name} 已被冻结`, 'success');
                
                // 关闭详情模态框（如果存在）
                const modal = document.querySelector('.user-detail-modal');
                if (modal) {
                    modal.remove();
                }
            }
        );
    }

    unblockUser(userId) {
        const user = this.users.find(u => u.id === userId);
        if (!user) return;

        SharedComponents.showConfirm(
            '解冻用户',
            `确定要解冻用户 ${user.name} 的账户吗？`,
            () => {
                user.status = 'active';
                this.renderUserTable();
                SharedComponents.showToast(`用户 ${user.name} 已解冻`, 'success');
                
                // 关闭详情模态框（如果存在）
                const modal = document.querySelector('.user-detail-modal');
                if (modal) {
                    modal.remove();
                }
            }
        );
    }

    deleteUser(userId) {
        const user = this.users.find(u => u.id === userId);
        if (!user) return;

        SharedComponents.showConfirm(
            '删除用户',
            `确定要删除用户 ${user.name} 吗？此操作不可恢复。`,
            () => {
                this.users = this.users.filter(u => u.id !== userId);
                this.filterUsers();
                SharedComponents.showToast(`用户 ${user.name} 已删除`, 'success');
            }
        );
    }

    exportUsers() {
        SharedComponents.showToast(`正在导出 ${this.filteredUsers.length} 条用户数据...`, 'info');
        // 这里可以添加实际的导出逻辑
    }

    updateActivityData(timeRange) {
        console.log(`更新活跃度数据: ${timeRange}`);
        // 这里可以添加活跃度数据更新逻辑
    }

    updateBehaviorData(timeRange) {
        console.log(`更新行为数据: ${timeRange}`);
        // 这里可以添加行为数据更新逻辑
    }

    startRealTimeUpdates() {
        this.updateInterval = setInterval(() => {
            // 随机生成新用户
            if (Math.random() < 0.2) { // 20% 概率生成新用户
                const newUser = this.generateNewUser();
                this.users.unshift(newUser);
                
                // 如果当前没有筛选条件，更新显示
                if (this.filteredUsers.length === this.users.length - 1) {
                    this.filteredUsers.unshift(newUser);
                }
                
                this.updateLatestUsers();
                this.updateStatistics();
            }

            // 随机更新用户登录时间
            const randomUsers = this.users
                .filter(u => u.status === 'active')
                .sort(() => 0.5 - Math.random())
                .slice(0, Math.floor(Math.random() * 5) + 1);

            randomUsers.forEach(user => {
                if (Math.random() < 0.1) { // 10% 概率更新登录时间
                    user.lastLogin = new Date().toISOString();
                }
            });

            this.renderUserTable();
        }, 20000); // 每20秒更新一次
    }

    generateNewUser() {
        const surnames = ['张', '李', '王', '刘', '陈', '杨', '黄', '赵'];
        const names = ['伟', '芳', '娜', '秀英', '敏', '静', '丽', '强'];
        const cities = ['北京', '上海', '深圳', '广州', '杭州', '成都'];
        
        const newId = Math.max(...this.users.map(u => u.id)) + 1;
        const userType = Math.random() > 0.289 ? 'personal' : 'enterprise';
        const surname = surnames[Math.floor(Math.random() * surnames.length)];
        const name = names[Math.floor(Math.random() * names.length)];
        const userName = `${surname}${name}`;
        
        return {
            id: newId,
            userId: `U${String(newId).padStart(6, '0')}`,
            name: userName,
            phone: this.generatePhone(),
            email: this.generateEmail(userName),
            userType: userType,
            userLevel: 'normal',
            status: 'active',
            registrationDate: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
            chargeCount: 0,
            totalSpent: 0,
            balance: Math.random() * 100,
            city: cities[Math.floor(Math.random() * cities.length)],
            avatar: this.generateAvatar(userName),
            membershipExpiry: this.getMembershipExpiry(),
            points: 0
        };
    }

    updateStatistics() {
        const stats = {
            total: this.users.length,
            active: this.users.filter(u => u.status === 'active').length,
            newToday: this.users.filter(user => {
                const regDate = new Date(user.registrationDate).toDateString();
                const today = new Date().toDateString();
                return regDate === today;
            }).length,
            members: this.users.filter(u => u.userLevel !== 'normal').length
        };

        const statCards = document.querySelectorAll('.stat-value');
        if (statCards[0]) statCards[0].textContent = stats.total.toLocaleString();
        if (statCards[1]) statCards[1].textContent = stats.active.toLocaleString();
        if (statCards[2]) statCards[2].textContent = stats.newToday.toLocaleString();
        if (statCards[3]) statCards[3].textContent = stats.members.toLocaleString();
    }

    destroy() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
    }
}

// 初始化页面
const usersPage = new UsersPage();

// 页面卸载时清理
window.addEventListener('beforeunload', () => {
    usersPage.destroy();
});