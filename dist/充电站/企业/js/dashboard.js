// 数据概览页面功能
class DashboardPage {
    constructor() {
        this.stations = [];
        this.updateInterval = null;
        this.init();
    }

    init() {
        // 插入导航栏
        document.getElementById('header-container').innerHTML = SharedComponents.createHeader('dashboard');
        
        // 初始化通用功能
        SharedComponents.initCommonFeatures();
        
        // 初始化页面特定功能
        this.initStationMonitoring();
        this.initAnalysisCards();
        this.initTimeBars();
        
        // 绑定事件
        this.bindEvents();
    }

    bindEvents() {
        // 绑定图表选项切换
        document.querySelectorAll('.chart-option').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.chart-option').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.updateChartData(e.target.textContent);
            });
        });

        // 绑定分析卡片筛选器
        document.querySelectorAll('.analysis-filter').forEach(select => {
            select.addEventListener('change', (e) => {
                const card = e.target.closest('.analysis-card');
                const timeRange = e.target.value;
                this.updateAnalysisData(card, timeRange);
            });
        });
    }

    initStationMonitoring() {
        // 初始化站点数据
        this.stations = [
            { id: 1, name: '北京朝阳充电站', x: 25, y: 30, status: 'online', devices: 24, charging: 18, idle: 6, usage: 95.8, revenue: 12456, location: '北京市朝阳区建国路88号', power: 180 },
            { id: 2, name: '上海浦东充电站', x: 75, y: 45, status: 'busy', devices: 32, charging: 28, idle: 4, usage: 92.3, revenue: 18780, location: '上海市浦东新区世纪大道100号', power: 240 },
            { id: 3, name: '深圳南山充电站', x: 70, y: 75, status: 'maintenance', devices: 18, charging: 0, idle: 0, usage: 88.9, revenue: 9234, location: '深圳市南山区科技园路1号', power: 120 },
            { id: 4, name: '广州天河充电站', x: 65, y: 70, status: 'online', devices: 28, charging: 22, idle: 6, usage: 94.2, revenue: 15678, location: '广州市天河区珠江新城', power: 200 },
            { id: 5, name: '杭州西湖充电站', x: 60, y: 40, status: 'online', devices: 20, charging: 15, idle: 5, usage: 87.5, revenue: 11234, location: '杭州市西湖区文三路', power: 150 },
            { id: 6, name: '成都高新充电站', x: 40, y: 60, status: 'offline', devices: 16, charging: 0, idle: 0, usage: 0, revenue: 0, location: '成都市高新区天府大道', power: 120 },
            { id: 7, name: '武汉光谷充电站', x: 45, y: 50, status: 'busy', devices: 22, charging: 20, idle: 2, usage: 89.6, revenue: 13456, location: '武汉市东湖高新区光谷大道', power: 160 },
            { id: 8, name: '南京江宁充电站', x: 55, y: 35, status: 'online', devices: 26, charging: 19, idle: 7, usage: 91.2, revenue: 14567, location: '南京市江宁区双龙大道', power: 180 },
            { id: 9, name: '西安高新充电站', x: 35, y: 45, status: 'online', devices: 30, charging: 24, idle: 6, usage: 93.5, revenue: 16789, location: '西安市高新区科技路', power: 220 }
        ];

        // 更新状态统计
        this.updateStatusCounts();
        
        // 初始化地图
        this.initMap();
        
        // 启动实时数据更新模拟
        this.startRealTimeUpdates();
    }

    initMap() {
        setTimeout(() => {
            const mapContainer = document.getElementById('station-map');
            if (!mapContainer) return;

            // 清空地图
            mapContainer.innerHTML = '';

            // 创建地图标记
            this.stations.forEach((station) => {
                // 创建标记容器
                const markerContainer = document.createElement('div');
                markerContainer.className = 'map-marker-container';
                markerContainer.style.left = `${station.x}%`;
                markerContainer.style.top = `${station.y}%`;
                markerContainer.dataset.stationId = station.id;
                
                // 创建信息卡片
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
                
                // 创建标记点
                const marker = document.createElement('div');
                marker.className = `map-marker ${station.status}`;
                
                markerContainer.appendChild(infoCard);
                markerContainer.appendChild(marker);
                
                // 添加点击事件
                markerContainer.addEventListener('click', () => {
                    this.showStationDetail(station);
                });

                mapContainer.appendChild(markerContainer);
            });
        }, 100);
    }

    updateStatusCounts() {
        const counts = {
            online: 0,
            busy: 0,
            maintenance: 0,
            offline: 0
        };

        this.stations.forEach(station => {
            counts[station.status]++;
        });

        document.getElementById('online-count').textContent = counts.online;
        document.getElementById('busy-count').textContent = counts.busy;
        document.getElementById('maintenance-count').textContent = counts.maintenance;
        document.getElementById('offline-count').textContent = counts.offline;
    }

    startRealTimeUpdates() {
        this.updateInterval = setInterval(() => {
            // 随机更新站点数据
            this.stations.forEach(station => {
                if (station.status === 'online' || station.status === 'busy') {
                    const change = Math.floor(Math.random() * 5) - 2;
                    const newCharging = Math.max(0, Math.min(station.devices, station.charging + change));
                    station.charging = newCharging;
                    station.idle = station.devices - newCharging;
                    station.usage = Math.round((station.charging / station.devices) * 100 * 10) / 10;
                    
                    const revenueIncrease = Math.random() * 100;
                    station.revenue += Math.round(revenueIncrease);
                    
                    if (station.usage > 85) {
                        station.status = 'busy';
                    } else {
                        station.status = 'online';
                    }
                }
            });
            
            this.updateStatusCounts();
            this.updateMapMarkers();
        }, 5000);
    }

    updateMapMarkers() {
        const mapContainer = document.getElementById('station-map');
        if (!mapContainer) return;
        
        this.stations.forEach(station => {
            const markerContainer = mapContainer.querySelector(`[data-station-id="${station.id}"]`);
            if (markerContainer) {
                const marker = markerContainer.querySelector('.map-marker');
                if (marker) {
                    marker.className = `map-marker ${station.status}`;
                }
                
                const infoCard = markerContainer.querySelector('.map-info-card');
                if (infoCard) {
                    infoCard.className = `map-info-card ${station.status}`;
                    
                    const statusDot = infoCard.querySelector('.status-dot');
                    if (statusDot) {
                        statusDot.className = `status-dot ${station.status}`;
                    }
                    
                    const statTexts = infoCard.querySelectorAll('.stat-text');
                    if (statTexts[0]) statTexts[0].textContent = `总: ${station.devices}`;
                    if (statTexts[1]) statTexts[1].textContent = `充: ${station.charging}`;
                    if (statTexts[2]) statTexts[2].textContent = `闲: ${station.idle}`;
                }
            }
        });
    }

    showStationDetail(station) {
        const modal = document.createElement('div');
        modal.className = 'station-detail-modal';
        modal.innerHTML = `
            <div class="modal-overlay" onclick="this.parentElement.remove()"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${station.name}</h3>
                    <button class="modal-close" onclick="this.closest('.station-detail-modal').remove()">×</button>
                </div>
                <div class="modal-body">
                    <div class="detail-grid">
                        <div class="detail-item">
                            <label>地址</label>
                            <span>${station.location}</span>
                        </div>
                        <div class="detail-item">
                            <label>状态</label>
                            <span class="status-badge ${station.status}">${this.getStatusText(station.status)}</span>
                        </div>
                        <div class="detail-item">
                            <label>设备数量</label>
                            <span>${station.devices} 台</span>
                        </div>
                        <div class="detail-item">
                            <label>总功率</label>
                            <span>${station.power} kW</span>
                        </div>
                        <div class="detail-item">
                            <label>在线率</label>
                            <span>${station.usage}%</span>
                        </div>
                        <div class="detail-item">
                            <label>今日充电量</label>
                            <span>${station.charging.toLocaleString()} kWh</span>
                        </div>
                        <div class="detail-item">
                            <label>今日收入</label>
                            <span>¥${station.revenue.toLocaleString()}</span>
                        </div>
                    </div>
                    <div class="modal-actions">
                        <a href="stations.html" class="btn btn-primary">查看详情</a>
                        <button class="btn" onclick="this.closest('.station-detail-modal').remove()">关闭</button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    getStatusText(status) {
        const statusMap = {
            online: '正常运行',
            busy: '高负载',
            maintenance: '维护中',
            offline: '离线'
        };
        return statusMap[status] || status;
    }

    initAnalysisCards() {
        // 初始化排行榜动画
        setTimeout(() => {
            document.querySelectorAll('.rank-bar').forEach(bar => {
                bar.style.transform = 'scaleX(1)';
            });
        }, 500);

        // 初始化使用率动画
        setTimeout(() => {
            document.querySelectorAll('.usage-fill').forEach(fill => {
                fill.style.transform = 'scaleX(1)';
            });
        }, 800);
    }

    initTimeBars() {
        const timeBarsContainer = document.getElementById('time-bars');
        if (timeBarsContainer) {
            const bars = Array.from({length: 24}, (_, i) => {
                const height = Math.random() * 80 + 20;
                return `<div class="time-bar" style="height: ${height}%;" title="${i}:00"></div>`;
            }).join('');
            timeBarsContainer.innerHTML = bars;
        }
    }

    updateAnalysisData(card, timeRange) {
        console.log(`更新分析数据: ${timeRange}`);
        
        const rankingItems = card.querySelectorAll('.ranking-item');
        rankingItems.forEach((item) => {
            const bar = item.querySelector('.rank-bar');
            const newWidth = Math.random() * 80 + 20;
            bar.style.width = newWidth + '%';
        });
    }

    updateChartData(period) {
        console.log(`更新图表数据: ${period}`);
        // 这里可以添加图表更新逻辑
    }

    destroy() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
    }
}

// 初始化页面
const dashboardPage = new DashboardPage();

// 页面卸载时清理
window.addEventListener('beforeunload', () => {
    dashboardPage.destroy();
});