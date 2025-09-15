// 订单管理页面功能
class OrdersPage {
    constructor() {
        this.orders = [];
        this.filteredOrders = [];
        this.currentPage = 1;
        this.itemsPerPage = 20;
        this.updateInterval = null;
        this.latestOrdersInterval = null;
        this.init();
    }

    init() {
        // 插入导航栏
        document.getElementById('header-container').innerHTML = SharedComponents.createHeader('orders');
        
        // 初始化通用功能
        SharedComponents.initCommonFeatures();
        
        // 初始化订单数据
        this.initOrderData();
        
        // 渲染订单列表
        this.renderOrderTable();
        
        // 初始化实时订单
        this.initLatestOrders();
        
        // 绑定事件
        this.bindEvents();
        
        // 启动实时更新
        this.startRealTimeUpdates();
    }

    initOrderData() {
        // 生成模拟订单数据
        this.orders = [];
        const users = [
            '张三', '李四', '王五', '赵六', '钱七', '孙八', '周九', '吴十',
            '陈明', '林华', '黄强', '郭亮', '何静', '马超', '朱丽', '许辉'
        ];
        const stations = [
            '北京朝阳站', '上海浦东站', '深圳南山站', '广州天河站', 
            '杭州西湖站', '成都高新站', '武汉光谷站', '南京江宁站'
        ];

        for (let i = 1; i <= 12847; i++) {
            const user = users[Math.floor(Math.random() * users.length)];
            const station = stations[Math.floor(Math.random() * stations.length)];
            const chargeType = Math.random() > 0.315 ? 'fast' : 'slow';
            const status = this.getRandomOrderStatus();
            const startTime = this.getRandomDate(30);
            
            this.orders.push({
                id: i,
                orderNo: `ORD-2024-${String(i).padStart(4, '0')}`,
                user: user,
                userPhone: this.generatePhone(),
                station: station,
                deviceCode: this.generateDeviceCode(station, chargeType),
                chargeType: chargeType,
                chargeTypeName: chargeType === 'fast' ? '快充' : '慢充',
                energy: this.getRandomEnergy(chargeType),
                duration: this.getRandomDuration(chargeType),
                amount: this.getRandomAmount(chargeType),
                status: status,
                startTime: startTime,
                endTime: status === 'completed' ? this.addTime(startTime, this.getRandomDuration(chargeType)) : null,
                paymentMethod: this.getRandomPaymentMethod(),
                createdAt: startTime
            });
        }

        // 按时间倒序排列
        this.orders.sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
        this.filteredOrders = [...this.orders];
    }

    generatePhone() {
        const prefixes = ['138', '139', '150', '151', '188', '189'];
        const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
        const suffix = Math.floor(Math.random() * 100000000).toString().padStart(8, '0');
        return prefix + suffix;
    }

    generateDeviceCode(station, type) {
        const stationCodes = {
            '北京朝阳站': 'BJ',
            '上海浦东站': 'SH',
            '深圳南山站': 'SZ',
            '广州天河站': 'GZ',
            '杭州西湖站': 'HZ',
            '成都高新站': 'CD',
            '武汉光谷站': 'WH',
            '南京江宁站': 'NJ'
        };
        const typePrefix = type === 'fast' ? 'DC' : 'AC';
        const stationCode = stationCodes[station] || 'XX';
        const deviceNum = Math.floor(Math.random() * 50) + 1;
        return `${typePrefix}-${stationCode}-${String(deviceNum).padStart(3, '0')}`;
    }

    getRandomOrderStatus() {
        const statuses = [
            { status: 'completed', weight: 80 },
            { status: 'charging', weight: 15 },
            { status: 'pending', weight: 4 },
            { status: 'cancelled', weight: 1 }
        ];
        
        let random = Math.random() * 100;
        for (const item of statuses) {
            if (random < item.weight) {
                return item.status;
            }
            random -= item.weight;
        }
        return 'completed';
    }

    getRandomEnergy(type) {
        if (type === 'fast') {
            return (Math.random() * 50 + 10).toFixed(1); // 10-60 kWh
        } else {
            return (Math.random() * 30 + 5).toFixed(1); // 5-35 kWh
        }
    }

    getRandomDuration(type) {
        if (type === 'fast') {
            return Math.floor(Math.random() * 60 + 15); // 15-75分钟
        } else {
            return Math.floor(Math.random() * 180 + 60); // 60-240分钟
        }
    }

    getRandomAmount(type) {
        const basePrice = type === 'fast' ? 1.5 : 0.8;
        return (Math.random() * 50 + 20) * basePrice;
    }

    getRandomPaymentMethod() {
        const methods = ['微信支付', '支付宝', '银联卡', '余额支付'];
        return methods[Math.floor(Math.random() * methods.length)];
    }

    getRandomDate(daysAgo) {
        const date = new Date();
        date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo));
        date.setHours(Math.floor(Math.random() * 24));
        date.setMinutes(Math.floor(Math.random() * 60));
        return date.toISOString();
    }

    addTime(startTime, minutes) {
        const date = new Date(startTime);
        date.setMinutes(date.getMinutes() + minutes);
        return date.toISOString();
    }

    renderOrderTable() {
        const tbody = document.getElementById('orders-table-body');
        if (!tbody) return;

        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const currentOrders = this.filteredOrders.slice(startIndex, endIndex);

        tbody.innerHTML = currentOrders.map(order => `
            <tr data-order-id="${order.id}">
                <td>
                    <div class="order-no">${order.orderNo}</div>
                </td>
                <td>
                    <div class="user-info">
                        <div class="user-name">${order.user}</div>
                        <div class="user-phone">${order.userPhone}</div>
                    </div>
                </td>
                <td>${order.station}</td>
                <td>
                    <span class="device-code">${order.deviceCode}</span>
                </td>
                <td>
                    <span class="charge-type ${order.chargeType}">${order.chargeTypeName}</span>
                </td>
                <td>${order.energy} kWh</td>
                <td>${this.formatDuration(order.duration)}</td>
                <td>¥${order.amount.toFixed(2)}</td>
                <td>${SharedComponents.formatStatus(order.status)}</td>
                <td>
                    <div class="time-info">
                        <div>${SharedComponents.formatDateTime(order.startTime).split(' ')[0]}</div>
                        <div class="time-detail">${SharedComponents.formatDateTime(order.startTime).split(' ')[1]}</div>
                    </div>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn" onclick="ordersPage.viewOrder(${order.id})" title="查看详情">👁️</button>
                        ${order.status === 'charging' ? 
                            `<button class="action-btn" onclick="ordersPage.stopCharging(${order.id})" title="停止充电">⏹️</button>` :
                            ''
                        }
                        ${order.status === 'pending' ? 
                            `<button class="action-btn" onclick="ordersPage.processPayment(${order.id})" title="处理支付">💳</button>` :
                            ''
                        }
                        <button class="action-btn" onclick="ordersPage.exportOrder(${order.id})" title="导出">📄</button>
                    </div>
                </td>
            </tr>
        `).join('');

        this.updatePaginationInfo();
    }

    formatDuration(minutes) {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        if (hours > 0) {
            return `${hours}h${mins}m`;
        }
        return `${mins}m`;
    }

    updatePaginationInfo() {
        const info = document.querySelector('.pagination-info');
        if (info) {
            const start = (this.currentPage - 1) * this.itemsPerPage + 1;
            const end = Math.min(this.currentPage * this.itemsPerPage, this.filteredOrders.length);
            info.textContent = `显示 ${start}-${end} 条，共 ${this.filteredOrders.length.toLocaleString()} 条记录`;
        }
    }

    initLatestOrders() {
        this.updateLatestOrders();
    }

    updateLatestOrders() {
        const container = document.getElementById('latest-orders');
        if (!container) return;

        const latestOrders = this.orders
            .filter(order => order.status === 'charging' || order.status === 'completed')
            .slice(0, 5);

        container.innerHTML = latestOrders.map(order => `
            <div class="latest-order-item">
                <div class="order-info">
                    <div class="order-header">
                        <span class="order-no">${order.orderNo}</span>
                        <span class="order-status ${order.status}">${this.getStatusText(order.status)}</span>
                    </div>
                    <div class="order-details">
                        <span class="user-name">${order.user}</span>
                        <span class="station-name">${order.station}</span>
                        <span class="order-amount">¥${order.amount.toFixed(2)}</span>
                    </div>
                </div>
                <div class="order-time">${this.getRelativeTime(order.startTime)}</div>
            </div>
        `).join('');
    }

    getStatusText(status) {
        const statusMap = {
            charging: '充电中',
            completed: '已完成',
            pending: '待支付',
            cancelled: '已取消'
        };
        return statusMap[status] || status;
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
        return `${days}天前`;
    }

    bindEvents() {
        // 搜索功能
        const searchBox = document.querySelector('.search-box');
        if (searchBox) {
            searchBox.addEventListener('input', SharedComponents.debounce((e) => {
                this.filterOrders();
            }, 300));
        }

        // 状态筛选
        const statusFilter = document.querySelector('.filter-select');
        if (statusFilter) {
            statusFilter.addEventListener('change', (e) => {
                this.filterOrders();
            });
        }

        // 类型筛选
        const typeFilter = document.querySelectorAll('.filter-select')[1];
        if (typeFilter) {
            typeFilter.addEventListener('change', (e) => {
                this.filterOrders();
            });
        }

        // 日期筛选
        const startDate = document.getElementById('start-date');
        const endDate = document.getElementById('end-date');
        if (startDate && endDate) {
            startDate.addEventListener('change', () => this.filterOrders());
            endDate.addEventListener('change', () => this.filterOrders());
        }

        // 导出按钮
        const exportBtn = document.querySelector('.btn-primary');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                this.exportOrders();
            });
        }

        // 图表选项切换
        document.querySelectorAll('.chart-option').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.chart-option').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.updateChartData(e.target.textContent);
            });
        });

        // 分页按钮
        document.querySelectorAll('.page-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (!btn.disabled && btn.textContent !== '...') {
                    const page = parseInt(btn.textContent) || this.currentPage;
                    this.changePage(page);
                }
            });
        });
    }

    filterOrders() {
        const searchTerm = document.querySelector('.search-box').value.toLowerCase();
        const statusFilter = document.querySelector('.filter-select').value;
        const typeFilter = document.querySelectorAll('.filter-select')[1].value;
        const startDate = document.getElementById('start-date').value;
        const endDate = document.getElementById('end-date').value;

        this.filteredOrders = this.orders.filter(order => {
            const matchesSearch = !searchTerm || 
                order.orderNo.toLowerCase().includes(searchTerm) ||
                order.user.toLowerCase().includes(searchTerm) ||
                order.userPhone.includes(searchTerm) ||
                order.station.toLowerCase().includes(searchTerm);
            
            const matchesStatus = !statusFilter || order.status === statusFilter;
            const matchesType = !typeFilter || order.chargeType === typeFilter;
            
            let matchesDate = true;
            if (startDate || endDate) {
                const orderDate = new Date(order.startTime).toISOString().split('T')[0];
                if (startDate && orderDate < startDate) matchesDate = false;
                if (endDate && orderDate > endDate) matchesDate = false;
            }

            return matchesSearch && matchesStatus && matchesType && matchesDate;
        });

        this.currentPage = 1;
        this.renderOrderTable();
    }

    changePage(page) {
        this.currentPage = page;
        this.renderOrderTable();
        
        // 更新分页按钮状态
        document.querySelectorAll('.page-btn').forEach(btn => {
            btn.classList.remove('active');
            if (parseInt(btn.textContent) === page) {
                btn.classList.add('active');
            }
        });
    }

    viewOrder(orderId) {
        const order = this.orders.find(o => o.id === orderId);
        if (!order) return;

        const modal = document.createElement('div');
        modal.className = 'order-detail-modal';
        modal.innerHTML = `
            <div class="modal-overlay" onclick="this.parentElement.remove()"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h3>订单详情 - ${order.orderNo}</h3>
                    <button class="modal-close" onclick="this.closest('.order-detail-modal').remove()">×</button>
                </div>
                <div class="modal-body">
                    <div class="order-detail-grid">
                        <div class="detail-section">
                            <h4>基本信息</h4>
                            <div class="detail-item">
                                <label>订单编号</label>
                                <span>${order.orderNo}</span>
                            </div>
                            <div class="detail-item">
                                <label>订单状态</label>
                                <span>${SharedComponents.formatStatus(order.status)}</span>
                            </div>
                            <div class="detail-item">
                                <label>充电类型</label>
                                <span>${order.chargeTypeName}</span>
                            </div>
                            <div class="detail-item">
                                <label>订单金额</label>
                                <span>¥${order.amount.toFixed(2)}</span>
                            </div>
                        </div>
                        
                        <div class="detail-section">
                            <h4>用户信息</h4>
                            <div class="detail-item">
                                <label>用户姓名</label>
                                <span>${order.user}</span>
                            </div>
                            <div class="detail-item">
                                <label>手机号码</label>
                                <span>${order.userPhone}</span>
                            </div>
                            <div class="detail-item">
                                <label>支付方式</label>
                                <span>${order.paymentMethod}</span>
                            </div>
                        </div>

                        <div class="detail-section">
                            <h4>充电信息</h4>
                            <div class="detail-item">
                                <label>充电站点</label>
                                <span>${order.station}</span>
                            </div>
                            <div class="detail-item">
                                <label>设备编号</label>
                                <span>${order.deviceCode}</span>
                            </div>
                            <div class="detail-item">
                                <label>充电量</label>
                                <span>${order.energy} kWh</span>
                            </div>
                            <div class="detail-item">
                                <label>充电时长</label>
                                <span>${this.formatDuration(order.duration)}</span>
                            </div>
                        </div>

                        <div class="detail-section">
                            <h4>时间信息</h4>
                            <div class="detail-item">
                                <label>开始时间</label>
                                <span>${SharedComponents.formatDateTime(order.startTime)}</span>
                            </div>
                            ${order.endTime ? `
                                <div class="detail-item">
                                    <label>结束时间</label>
                                    <span>${SharedComponents.formatDateTime(order.endTime)}</span>
                                </div>
                            ` : ''}
                            <div class="detail-item">
                                <label>创建时间</label>
                                <span>${SharedComponents.formatDateTime(order.createdAt)}</span>
                            </div>
                        </div>
                    </div>
                    <div class="modal-actions">
                        ${order.status === 'charging' ? 
                            `<button class="btn btn-warning" onclick="ordersPage.stopCharging(${order.id})">停止充电</button>` :
                            ''
                        }
                        <button class="btn btn-primary" onclick="ordersPage.exportOrder(${order.id})">导出订单</button>
                        <button class="btn" onclick="this.closest('.order-detail-modal').remove()">关闭</button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    stopCharging(orderId) {
        const order = this.orders.find(o => o.id === orderId);
        if (!order) return;

        SharedComponents.showConfirm(
            '停止充电',
            `确定要停止订单 ${order.orderNo} 的充电吗？`,
            () => {
                order.status = 'completed';
                order.endTime = new Date().toISOString();
                this.renderOrderTable();
                SharedComponents.showToast(`订单 ${order.orderNo} 充电已停止`, 'success');
                
                // 关闭详情模态框（如果存在）
                const modal = document.querySelector('.order-detail-modal');
                if (modal) {
                    modal.remove();
                }
            }
        );
    }

    processPayment(orderId) {
        const order = this.orders.find(o => o.id === orderId);
        if (!order) return;

        SharedComponents.showConfirm(
            '处理支付',
            `确定要处理订单 ${order.orderNo} 的支付吗？`,
            () => {
                order.status = 'completed';
                this.renderOrderTable();
                SharedComponents.showToast(`订单 ${order.orderNo} 支付处理完成`, 'success');
            }
        );
    }

    exportOrder(orderId) {
        const order = this.orders.find(o => o.id === orderId);
        if (!order) return;

        SharedComponents.showToast(`正在导出订单 ${order.orderNo}...`, 'info');
        // 这里可以添加实际的导出逻辑
    }

    exportOrders() {
        SharedComponents.showToast(`正在导出 ${this.filteredOrders.length} 条订单数据...`, 'info');
        // 这里可以添加实际的批量导出逻辑
    }

    updateChartData(period) {
        console.log(`更新图表数据: ${period}`);
        // 这里可以添加图表更新逻辑
    }

    startRealTimeUpdates() {
        // 更新订单状态
        this.updateInterval = setInterval(() => {
            // 随机更新一些充电中的订单
            const chargingOrders = this.orders.filter(o => o.status === 'charging');
            const ordersToUpdate = chargingOrders.slice(0, Math.floor(Math.random() * 3) + 1);

            ordersToUpdate.forEach(order => {
                if (Math.random() < 0.1) { // 10% 概率完成充电
                    order.status = 'completed';
                    order.endTime = new Date().toISOString();
                }
            });

            // 随机生成新订单
            if (Math.random() < 0.3) { // 30% 概率生成新订单
                const newOrder = this.generateNewOrder();
                this.orders.unshift(newOrder);
                
                // 如果当前没有筛选条件，更新显示
                if (this.filteredOrders.length === this.orders.length - 1) {
                    this.filteredOrders.unshift(newOrder);
                }
            }

            this.renderOrderTable();
            this.updateStatistics();
        }, 15000); // 每15秒更新一次

        // 更新最新订单
        this.latestOrdersInterval = setInterval(() => {
            this.updateLatestOrders();
        }, 5000); // 每5秒更新一次
    }

    generateNewOrder() {
        const users = ['张三', '李四', '王五', '赵六', '钱七', '孙八'];
        const stations = ['北京朝阳站', '上海浦东站', '深圳南山站', '广州天河站'];
        
        const newId = Math.max(...this.orders.map(o => o.id)) + 1;
        const user = users[Math.floor(Math.random() * users.length)];
        const station = stations[Math.floor(Math.random() * stations.length)];
        const chargeType = Math.random() > 0.315 ? 'fast' : 'slow';
        const status = Math.random() > 0.8 ? 'charging' : 'completed';
        
        return {
            id: newId,
            orderNo: `ORD-2024-${String(newId).padStart(4, '0')}`,
            user: user,
            userPhone: this.generatePhone(),
            station: station,
            deviceCode: this.generateDeviceCode(station, chargeType),
            chargeType: chargeType,
            chargeTypeName: chargeType === 'fast' ? '快充' : '慢充',
            energy: this.getRandomEnergy(chargeType),
            duration: this.getRandomDuration(chargeType),
            amount: this.getRandomAmount(chargeType),
            status: status,
            startTime: new Date().toISOString(),
            endTime: status === 'completed' ? new Date().toISOString() : null,
            paymentMethod: this.getRandomPaymentMethod(),
            createdAt: new Date().toISOString()
        };
    }

    updateStatistics() {
        const todayOrders = this.orders.filter(order => {
            const orderDate = new Date(order.startTime).toDateString();
            const today = new Date().toDateString();
            return orderDate === today;
        });

        const stats = {
            total: todayOrders.length,
            revenue: todayOrders.reduce((sum, order) => sum + order.amount, 0),
            charging: this.orders.filter(o => o.status === 'charging').length,
            avgAmount: todayOrders.length > 0 ? 
                todayOrders.reduce((sum, order) => sum + order.amount, 0) / todayOrders.length : 0
        };

        const statCards = document.querySelectorAll('.stat-value');
        if (statCards[0]) statCards[0].textContent = stats.total.toLocaleString();
        if (statCards[1]) statCards[1].textContent = `¥${(stats.revenue / 1000).toFixed(1)}K`;
        if (statCards[2]) statCards[2].textContent = stats.charging.toLocaleString();
        if (statCards[3]) statCards[3].textContent = `¥${stats.avgAmount.toFixed(1)}`;

        // 更新状态分布
        const statusCounts = {
            charging: this.orders.filter(o => o.status === 'charging').length,
            completed: this.orders.filter(o => o.status === 'completed').length,
            pending: this.orders.filter(o => o.status === 'pending').length,
            cancelled: this.orders.filter(o => o.status === 'cancelled').length
        };

        document.getElementById('charging-orders').textContent = statusCounts.charging.toLocaleString();
        document.getElementById('completed-orders').textContent = statusCounts.completed.toLocaleString();
        document.getElementById('pending-orders').textContent = statusCounts.pending.toLocaleString();
        document.getElementById('cancelled-orders').textContent = statusCounts.cancelled.toLocaleString();
    }

    destroy() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
        if (this.latestOrdersInterval) {
            clearInterval(this.latestOrdersInterval);
        }
    }
}

// 初始化页面
const ordersPage = new OrdersPage();

// 页面卸载时清理
window.addEventListener('beforeunload', () => {
    ordersPage.destroy();
});