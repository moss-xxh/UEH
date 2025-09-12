// 页面模块定义 - 将各页面转换为可动态加载的模块

// 数据概览模块
const DashboardModule = {
    stations: [],
    updateInterval: null,

    async init() {
        this.initStationMonitoring();
        this.initAnalysisCards();
        this.initTimeBars();
        this.bindEvents();
    },

    destroy() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
    },

    bindEvents() {
        document.querySelectorAll('.chart-option').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.chart-option').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
            });
        });

        document.querySelectorAll('.analysis-filter').forEach(select => {
            select.addEventListener('change', (e) => {
                const card = e.target.closest('.analysis-card');
                const timeRange = e.target.value;
                this.updateAnalysisData(card, timeRange);
            });
        });
    },

    initStationMonitoring() {
        this.stations = [
            { id: 1, name: '北京朝阳充电站', x: 25, y: 30, status: 'online', devices: 24, charging: 18, idle: 6, usage: 95.8, revenue: 12456, location: '北京市朝阳区建国路88号', power: 180 },
            { id: 2, name: '上海浦东充电站', x: 75, y: 45, status: 'busy', devices: 32, charging: 28, idle: 4, usage: 92.3, revenue: 18780, location: '上海市浦东新区世纪大道100号', power: 240 },
            { id: 3, name: '深圳南山充电站', x: 70, y: 75, status: 'maintenance', devices: 18, charging: 0, idle: 0, usage: 88.9, revenue: 9234, location: '深圳市南山区科技园路1号', power: 120 },
            { id: 4, name: '广州天河充电站', x: 65, y: 70, status: 'online', devices: 28, charging: 22, idle: 6, usage: 94.2, revenue: 15678, location: '广州市天河区珠江新城', power: 200 },
            { id: 5, name: '杭州西湖充电站', x: 60, y: 40, status: 'online', devices: 20, charging: 15, idle: 5, usage: 87.5, revenue: 11234, location: '杭州市西湖区文三路', power: 150 }
        ];

        this.updateStatusCounts();
        this.initMap();
        this.startRealTimeUpdates();
    },

    initMap() {
        setTimeout(() => {
            const mapContainer = document.getElementById('station-map');
            if (!mapContainer) return;

            mapContainer.innerHTML = '';

            this.stations.forEach((station) => {
                const markerContainer = document.createElement('div');
                markerContainer.className = 'map-marker-container';
                markerContainer.style.left = `${station.x}%`;
                markerContainer.style.top = `${station.y}%`;
                markerContainer.dataset.stationId = station.id;
                
                const infoCard = document.createElement('div');
                infoCard.className = `map-info-card ${station.status}`;
                infoCard.innerHTML = `
                    <div class="info-card-header">
                        <span class="station-mini-name">${station.name.replace('充电站', '')}</span>
                        <span class="status-dot ${station.status}"></span>
                    </div>
                    <div class="info-card-stats">
                        <div class="stat-item">
                            <span class="stat-icon">📊</span>
                            <span class="stat-text">总: ${station.devices}</span>
                        </div>
                        <div class="stat-item charging">
                            <span class="stat-icon">⚡</span>
                            <span class="stat-text">充: ${station.charging}</span>
                        </div>
                        <div class="stat-item idle">
                            <span class="stat-icon">✅</span>
                            <span class="stat-text">闲: ${station.idle}</span>
                        </div>
                    </div>
                `;
                
                const marker = document.createElement('div');
                marker.className = `map-marker ${station.status}`;
                
                markerContainer.appendChild(infoCard);
                markerContainer.appendChild(marker);
                
                markerContainer.addEventListener('click', () => {
                    this.showStationDetail(station);
                });

                mapContainer.appendChild(markerContainer);
            });
        }, 100);
    },

    updateStatusCounts() {
        const counts = { online: 0, busy: 0, maintenance: 0, offline: 0 };
        this.stations.forEach(station => counts[station.status]++);
        
        Object.keys(counts).forEach(status => {
            const el = document.getElementById(`${status}-count`);
            if (el) el.textContent = counts[status];
        });
    },

    startRealTimeUpdates() {
        this.updateInterval = setInterval(() => {
            this.stations.forEach(station => {
                if (station.status === 'online' || station.status === 'busy') {
                    const change = Math.floor(Math.random() * 5) - 2;
                    station.charging = Math.max(0, Math.min(station.devices, station.charging + change));
                    station.idle = station.devices - station.charging;
                    station.usage = Math.round((station.charging / station.devices) * 100 * 10) / 10;
                    station.revenue += Math.round(Math.random() * 100);
                    station.status = station.usage > 85 ? 'busy' : 'online';
                }
            });
            
            this.updateStatusCounts();
            this.updateMapMarkers();
        }, 5000);
    },

    updateMapMarkers() {
        const mapContainer = document.getElementById('station-map');
        if (!mapContainer) return;
        
        this.stations.forEach(station => {
            const markerContainer = mapContainer.querySelector(`[data-station-id="${station.id}"]`);
            if (markerContainer) {
                const marker = markerContainer.querySelector('.map-marker');
                if (marker) marker.className = `map-marker ${station.status}`;
                
                const infoCard = markerContainer.querySelector('.map-info-card');
                if (infoCard) {
                    infoCard.className = `map-info-card ${station.status}`;
                    const statusDot = infoCard.querySelector('.status-dot');
                    if (statusDot) statusDot.className = `status-dot ${station.status}`;
                    
                    const statTexts = infoCard.querySelectorAll('.stat-text');
                    if (statTexts[0]) statTexts[0].textContent = `总: ${station.devices}`;
                    if (statTexts[1]) statTexts[1].textContent = `充: ${station.charging}`;
                    if (statTexts[2]) statTexts[2].textContent = `闲: ${station.idle}`;
                }
            }
        });
    },

    showStationDetail(station) {
        SharedComponents.showToast(`查看电站: ${station.name}`, 'info');
    },

    initAnalysisCards() {
        setTimeout(() => {
            document.querySelectorAll('.rank-bar').forEach(bar => {
                bar.style.transform = 'scaleX(1)';
            });
        }, 500);

        setTimeout(() => {
            document.querySelectorAll('.usage-fill').forEach(fill => {
                fill.style.transform = 'scaleX(1)';
            });
        }, 800);
    },

    initTimeBars() {
        const timeBarsContainer = document.getElementById('time-bars');
        if (timeBarsContainer) {
            const bars = Array.from({length: 24}, (_, i) => {
                const height = Math.random() * 80 + 20;
                return `<div class="time-bar" style="height: ${height}%;" title="${i}:00"></div>`;
            }).join('');
            timeBarsContainer.innerHTML = bars;
        }
    },

    updateAnalysisData(card, timeRange) {
        const rankingItems = card.querySelectorAll('.ranking-item');
        rankingItems.forEach((item) => {
            const bar = item.querySelector('.rank-bar');
            if (bar) bar.style.width = (Math.random() * 80 + 20) + '%';
        });
    }
};

// 电站管理模块
const StationsModule = {
    stations: [],
    currentPage: 1,
    totalPages: 10,

    async init() {
        this.loadStations();
        this.bindEvents();
    },

    destroy() {
        // 清理资源
    },

    loadStations() {
        this.stations = [
            { id: 'ST001', name: '北京朝阳充电站', address: '北京市朝阳区建国路88号', devices: 24, onlineRate: 95.8, todayRevenue: 12456, status: 'active' },
            { id: 'ST002', name: '上海浦东充电站', address: '上海市浦东新区世纪大道100号', devices: 32, onlineRate: 92.3, todayRevenue: 18780, status: 'active' },
            { id: 'ST003', name: '深圳南山充电站', address: '深圳市南山区科技园路1号', devices: 18, onlineRate: 88.9, todayRevenue: 9234, status: 'pending' },
            { id: 'ST004', name: '广州天河充电站', address: '广州市天河区珠江新城', devices: 28, onlineRate: 94.2, todayRevenue: 15678, status: 'active' }
        ];

        this.renderStations();
        this.renderPagination();
    },

    renderStations() {
        const tbody = document.getElementById('stations-tbody');
        if (!tbody) return;

        tbody.innerHTML = this.stations.map(station => `
            <tr>
                <td>${station.id}</td>
                <td>${station.name}</td>
                <td>${station.address}</td>
                <td>${station.devices}</td>
                <td>${station.onlineRate}%</td>
                <td>¥${SharedComponents.formatNumber(station.todayRevenue)}</td>
                <td>${this.getStatusBadge(station.status)}</td>
                <td>
                    <button class="btn-text" onclick="pageModules.stations.viewStation('${station.id}')">查看</button>
                    <button class="btn-text" onclick="pageModules.stations.editStation('${station.id}')">编辑</button>
                    <button class="btn-text danger" onclick="pageModules.stations.deleteStation('${station.id}')">删除</button>
                </td>
            </tr>
        `).join('');
    },

    renderPagination() {
        const pagination = document.getElementById('pagination');
        if (pagination) {
            pagination.innerHTML = SharedComponents.createPagination(this.currentPage, this.totalPages);
        }
    },

    getStatusBadge(status) {
        const statusMap = {
            active: '<span class="status active">运营中</span>',
            inactive: '<span class="status inactive">离线</span>',
            pending: '<span class="status pending">维护中</span>'
        };
        return statusMap[status] || status;
    },

    bindEvents() {
        const searchBox = document.querySelector('.search-box');
        if (searchBox) {
            searchBox.addEventListener('input', SharedComponents.debounce((e) => {
                this.searchStations(e.target.value);
            }, 300));
        }

        const addBtn = document.querySelector('.btn-primary');
        if (addBtn && !addBtn.hasAttribute('data-bound')) {
            addBtn.setAttribute('data-bound', 'true');
            addBtn.addEventListener('click', () => this.addStation());
        }
    },

    searchStations(keyword) {
        // 实现搜索逻辑
    },

    viewStation(id) {
        SharedComponents.showToast(`查看电站: ${id}`, 'info');
    },

    editStation(id) {
        SharedComponents.showToast(`编辑电站: ${id}`, 'info');
    },

    deleteStation(id) {
        const station = this.stations.find(s => s.id === id);
        if (!station) return;

        SharedComponents.showConfirm(
            '确认删除',
            `确定要删除电站 "${station.name}" 吗？`,
            () => {
                this.stations = this.stations.filter(s => s.id !== id);
                this.renderStations();
                SharedComponents.showToast('删除成功', 'success');
            }
        );
    },

    addStation() {
        SharedComponents.showToast('打开新增电站表单', 'info');
    }
};

// 其他页面模块（简化版）
const DevicesModule = {
    async init() {
        this.bindEvents();
    },
    destroy() {},
    bindEvents() {
        // 设备页面事件绑定
    }
};

const OrdersModule = {
    async init() {
        this.bindEvents();
    },
    destroy() {},
    bindEvents() {
        // 订单页面事件绑定
    }
};

const UsersModule = {
    async init() {
        this.bindEvents();
    },
    destroy() {},
    bindEvents() {
        // 用户页面事件绑定
    }
};

const FinanceModule = {
    async init() {
        this.bindEvents();
    },
    destroy() {},
    bindEvents() {
        // 财务页面事件绑定
    }
};

const MaintenanceModule = {
    async init() {
        this.bindEvents();
    },
    destroy() {},
    bindEvents() {
        // 维护页面事件绑定
    }
};

const SettingsModule = {
    async init() {
        this.bindEvents();
    },
    destroy() {},
    bindEvents() {
        const saveBtn = document.querySelector('.btn-primary');
        if (saveBtn && !saveBtn.hasAttribute('data-bound')) {
            saveBtn.setAttribute('data-bound', 'true');
            saveBtn.addEventListener('click', () => {
                SharedComponents.showToast('设置已保存', 'success');
            });
        }
    }
};

// 导出模块
window.pageModules = {
    dashboard: DashboardModule,
    stations: StationsModule,
    devices: DevicesModule,
    orders: OrdersModule,
    users: UsersModule,
    finance: FinanceModule,
    maintenance: MaintenanceModule,
    settings: SettingsModule
};