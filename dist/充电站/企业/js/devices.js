// 设备管理页面功能
class DevicesPage {
    constructor() {
        this.devices = [];
        this.filteredDevices = [];
        this.currentPage = 1;
        this.itemsPerPage = 20;
        this.updateInterval = null;
        this.init();
    }

    init() {
        // 插入导航栏
        document.getElementById('header-container').innerHTML = SharedComponents.createHeader('devices');
        
        // 初始化通用功能
        SharedComponents.initCommonFeatures();
        
        // 初始化设备数据
        this.initDeviceData();
        
        // 渲染设备列表
        this.renderDeviceTable();
        
        // 绑定事件
        this.bindEvents();
        
        // 启动实时更新
        this.startRealTimeUpdates();
    }

    initDeviceData() {
        // 生成模拟设备数据
        this.devices = [];
        const stations = [
            '北京朝阳站', '上海浦东站', '深圳南山站', '广州天河站', 
            '杭州西湖站', '成都高新站', '武汉光谷站', '南京江宁站', '西安高新站'
        ];
        const deviceTypes = [
            { type: 'fast', name: '快充', power: [60, 120, 180] },
            { type: 'slow', name: '慢充', power: [7, 11, 22] }
        ];

        for (let i = 1; i <= 2847; i++) {
            const deviceType = deviceTypes[Math.floor(Math.random() * deviceTypes.length)];
            const station = stations[Math.floor(Math.random() * stations.length)];
            const power = deviceType.power[Math.floor(Math.random() * deviceType.power.length)];
            const status = this.getRandomStatus();
            
            this.devices.push({
                id: i,
                code: `${deviceType.type === 'fast' ? 'DC' : 'AC'}-${this.getStationCode(station)}-${String(i).padStart(3, '0')}`,
                name: `${deviceType.name}桩-${String(i).padStart(3, '0')}`,
                station: station,
                type: deviceType.type,
                typeName: deviceType.name,
                power: power,
                status: status,
                onlineTime: this.getRandomOnlineTime(),
                todayEnergy: this.getRandomEnergyValue(),
                efficiency: this.getRandomEfficiency(),
                lastMaintenance: this.getRandomDate(30),
                installDate: this.getRandomDate(365)
            });
        }

        this.filteredDevices = [...this.devices];
    }

    getStationCode(station) {
        const codeMap = {
            '北京朝阳站': 'BJ',
            '上海浦东站': 'SH',
            '深圳南山站': 'SZ',
            '广州天河站': 'GZ',
            '杭州西湖站': 'HZ',
            '成都高新站': 'CD',
            '武汉光谷站': 'WH',
            '南京江宁站': 'NJ',
            '西安高新站': 'XA'
        };
        return codeMap[station] || 'XX';
    }

    getRandomStatus() {
        const statuses = [
            { status: 'online', weight: 60 },
            { status: 'charging', weight: 30 },
            { status: 'maintenance', weight: 8 },
            { status: 'offline', weight: 2 }
        ];
        
        let random = Math.random() * 100;
        for (const item of statuses) {
            if (random < item.weight) {
                return item.status;
            }
            random -= item.weight;
        }
        return 'online';
    }

    getRandomOnlineTime() {
        const hours = Math.floor(Math.random() * 24);
        const minutes = Math.floor(Math.random() * 60);
        return `${hours}小时${minutes}分钟`;
    }

    getRandomEnergyValue() {
        return (Math.random() * 500 + 50).toFixed(1);
    }

    getRandomEfficiency() {
        return (Math.random() * 10 + 90).toFixed(1);
    }

    getRandomDate(daysAgo) {
        const date = new Date();
        date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo));
        return date.toISOString().split('T')[0];
    }

    renderDeviceTable() {
        const tbody = document.getElementById('devices-table-body');
        if (!tbody) return;

        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const currentDevices = this.filteredDevices.slice(startIndex, endIndex);

        tbody.innerHTML = currentDevices.map(device => `
            <tr data-device-id="${device.id}">
                <td><input type="checkbox" class="device-checkbox" value="${device.id}"></td>
                <td>${device.code}</td>
                <td>${device.name}</td>
                <td>${device.station}</td>
                <td>
                    <span class="device-type ${device.type}">${device.typeName}</span>
                </td>
                <td>${device.power}kW</td>
                <td>${SharedComponents.formatStatus(device.status)}</td>
                <td>${device.onlineTime}</td>
                <td>${device.todayEnergy} kWh</td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn" onclick="devicesPage.viewDevice(${device.id})" title="查看详情">👁️</button>
                        <button class="action-btn" onclick="devicesPage.editDevice(${device.id})" title="编辑">✏️</button>
                        <button class="action-btn" onclick="devicesPage.restartDevice(${device.id})" title="重启">🔄</button>
                        <button class="action-btn fault" onclick="devicesPage.deleteDevice(${device.id})" title="删除">🗑️</button>
                    </div>
                </td>
            </tr>
        `).join('');

        this.updatePaginationInfo();
    }

    updatePaginationInfo() {
        const info = document.querySelector('.pagination-info');
        if (info) {
            const start = (this.currentPage - 1) * this.itemsPerPage + 1;
            const end = Math.min(this.currentPage * this.itemsPerPage, this.filteredDevices.length);
            info.textContent = `显示 ${start}-${end} 条，共 ${this.filteredDevices.length.toLocaleString()} 条记录`;
        }
    }

    bindEvents() {
        // 搜索功能
        const searchBox = document.querySelector('.search-box');
        if (searchBox) {
            searchBox.addEventListener('input', SharedComponents.debounce((e) => {
                this.filterDevices();
            }, 300));
        }

        // 状态筛选
        const statusFilter = document.querySelector('.filter-select');
        if (statusFilter) {
            statusFilter.addEventListener('change', (e) => {
                this.filterDevices();
            });
        }

        // 类型筛选
        const typeFilter = document.querySelectorAll('.filter-select')[1];
        if (typeFilter) {
            typeFilter.addEventListener('change', (e) => {
                this.filterDevices();
            });
        }

        // 全选功能
        const selectAll = document.getElementById('select-all');
        if (selectAll) {
            selectAll.addEventListener('change', (e) => {
                const checkboxes = document.querySelectorAll('.device-checkbox');
                checkboxes.forEach(checkbox => {
                    checkbox.checked = e.target.checked;
                });
            });
        }

        // 批量操作
        const batchBtn = document.querySelector('.btn-primary');
        if (batchBtn) {
            batchBtn.addEventListener('click', () => {
                this.showBatchOperations();
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

        // 时间筛选
        const timeFilter = document.querySelector('.time-filter');
        if (timeFilter) {
            timeFilter.addEventListener('change', (e) => {
                this.updatePerformanceData(e.target.value);
            });
        }
    }

    filterDevices() {
        const searchTerm = document.querySelector('.search-box').value.toLowerCase();
        const statusFilter = document.querySelector('.filter-select').value;
        const typeFilter = document.querySelectorAll('.filter-select')[1].value;

        this.filteredDevices = this.devices.filter(device => {
            const matchesSearch = !searchTerm || 
                device.code.toLowerCase().includes(searchTerm) ||
                device.name.toLowerCase().includes(searchTerm) ||
                device.station.toLowerCase().includes(searchTerm);
            
            const matchesStatus = !statusFilter || device.status === statusFilter;
            const matchesType = !typeFilter || device.type === typeFilter;

            return matchesSearch && matchesStatus && matchesType;
        });

        this.currentPage = 1;
        this.renderDeviceTable();
    }

    changePage(page) {
        this.currentPage = page;
        this.renderDeviceTable();
        
        // 更新分页按钮状态
        document.querySelectorAll('.page-btn').forEach(btn => {
            btn.classList.remove('active');
            if (parseInt(btn.textContent) === page) {
                btn.classList.add('active');
            }
        });
    }

    viewDevice(deviceId) {
        const device = this.devices.find(d => d.id === deviceId);
        if (!device) return;

        const modal = document.createElement('div');
        modal.className = 'device-detail-modal';
        modal.innerHTML = `
            <div class="modal-overlay" onclick="this.parentElement.remove()"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${device.name} - 详细信息</h3>
                    <button class="modal-close" onclick="this.closest('.device-detail-modal').remove()">×</button>
                </div>
                <div class="modal-body">
                    <div class="device-detail-grid">
                        <div class="detail-section">
                            <h4>基本信息</h4>
                            <div class="detail-item">
                                <label>设备编号</label>
                                <span>${device.code}</span>
                            </div>
                            <div class="detail-item">
                                <label>设备名称</label>
                                <span>${device.name}</span>
                            </div>
                            <div class="detail-item">
                                <label>所属电站</label>
                                <span>${device.station}</span>
                            </div>
                            <div class="detail-item">
                                <label>设备类型</label>
                                <span>${device.typeName}</span>
                            </div>
                            <div class="detail-item">
                                <label>额定功率</label>
                                <span>${device.power} kW</span>
                            </div>
                        </div>
                        
                        <div class="detail-section">
                            <h4>运行状态</h4>
                            <div class="detail-item">
                                <label>当前状态</label>
                                <span>${SharedComponents.formatStatus(device.status)}</span>
                            </div>
                            <div class="detail-item">
                                <label>在线时长</label>
                                <span>${device.onlineTime}</span>
                            </div>
                            <div class="detail-item">
                                <label>运行效率</label>
                                <span>${device.efficiency}%</span>
                            </div>
                            <div class="detail-item">
                                <label>今日充电量</label>
                                <span>${device.todayEnergy} kWh</span>
                            </div>
                        </div>

                        <div class="detail-section">
                            <h4>维护信息</h4>
                            <div class="detail-item">
                                <label>安装日期</label>
                                <span>${device.installDate}</span>
                            </div>
                            <div class="detail-item">
                                <label>上次维护</label>
                                <span>${device.lastMaintenance}</span>
                            </div>
                        </div>
                    </div>
                    <div class="modal-actions">
                        <button class="btn btn-primary" onclick="devicesPage.editDevice(${device.id})">编辑设备</button>
                        <button class="btn" onclick="this.closest('.device-detail-modal').remove()">关闭</button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    editDevice(deviceId) {
        const device = this.devices.find(d => d.id === deviceId);
        if (!device) return;

        SharedComponents.showToast(`编辑设备 ${device.name}`, 'info');
        // 这里可以添加编辑设备的表单逻辑
    }

    restartDevice(deviceId) {
        const device = this.devices.find(d => d.id === deviceId);
        if (!device) return;

        SharedComponents.showConfirm(
            '重启设备',
            `确定要重启设备 ${device.name} 吗？`,
            () => {
                SharedComponents.showToast(`设备 ${device.name} 正在重启...`, 'info');
                // 模拟重启过程
                setTimeout(() => {
                    SharedComponents.showToast(`设备 ${device.name} 重启完成`, 'success');
                }, 2000);
            }
        );
    }

    deleteDevice(deviceId) {
        const device = this.devices.find(d => d.id === deviceId);
        if (!device) return;

        SharedComponents.showConfirm(
            '删除设备',
            `确定要删除设备 ${device.name} 吗？此操作不可恢复。`,
            () => {
                this.devices = this.devices.filter(d => d.id !== deviceId);
                this.filterDevices();
                SharedComponents.showToast(`设备 ${device.name} 已删除`, 'success');
            }
        );
    }

    showBatchOperations() {
        const selectedDevices = Array.from(document.querySelectorAll('.device-checkbox:checked'))
            .map(checkbox => parseInt(checkbox.value));

        if (selectedDevices.length === 0) {
            SharedComponents.showToast('请先选择要操作的设备', 'warning');
            return;
        }

        const modal = document.createElement('div');
        modal.className = 'batch-operations-modal';
        modal.innerHTML = `
            <div class="modal-overlay" onclick="this.parentElement.remove()"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h3>批量操作</h3>
                    <button class="modal-close" onclick="this.closest('.batch-operations-modal').remove()">×</button>
                </div>
                <div class="modal-body">
                    <p>已选择 ${selectedDevices.length} 台设备</p>
                    <div class="batch-actions">
                        <button class="btn" onclick="devicesPage.batchRestart([${selectedDevices.join(',')}])">批量重启</button>
                        <button class="btn" onclick="devicesPage.batchMaintenance([${selectedDevices.join(',')}])">进入维护</button>
                        <button class="btn" onclick="devicesPage.batchExport([${selectedDevices.join(',')}])">导出数据</button>
                        <button class="btn fault" onclick="devicesPage.batchDelete([${selectedDevices.join(',')}])">批量删除</button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    batchRestart(deviceIds) {
        SharedComponents.showConfirm(
            '批量重启',
            `确定要重启选中的 ${deviceIds.length} 台设备吗？`,
            () => {
                SharedComponents.showToast(`正在重启 ${deviceIds.length} 台设备...`, 'info');
                document.querySelector('.batch-operations-modal').remove();
            }
        );
    }

    batchMaintenance(deviceIds) {
        SharedComponents.showToast(`${deviceIds.length} 台设备已进入维护模式`, 'info');
        document.querySelector('.batch-operations-modal').remove();
    }

    batchExport(deviceIds) {
        SharedComponents.showToast(`正在导出 ${deviceIds.length} 台设备的数据...`, 'info');
        document.querySelector('.batch-operations-modal').remove();
    }

    batchDelete(deviceIds) {
        SharedComponents.showConfirm(
            '批量删除',
            `确定要删除选中的 ${deviceIds.length} 台设备吗？此操作不可恢复。`,
            () => {
                this.devices = this.devices.filter(d => !deviceIds.includes(d.id));
                this.filterDevices();
                SharedComponents.showToast(`已删除 ${deviceIds.length} 台设备`, 'success');
                document.querySelector('.batch-operations-modal').remove();
            }
        );
    }

    updatePerformanceData(timeRange) {
        console.log(`更新性能数据: ${timeRange}`);
        // 这里可以添加性能数据更新逻辑
    }

    startRealTimeUpdates() {
        this.updateInterval = setInterval(() => {
            // 随机更新一些设备状态
            const randomDevices = this.devices
                .sort(() => 0.5 - Math.random())
                .slice(0, Math.floor(Math.random() * 10) + 5);

            randomDevices.forEach(device => {
                if (Math.random() < 0.3) { // 30% 概率更新
                    const oldStatus = device.status;
                    device.status = this.getRandomStatus();
                    if (oldStatus !== device.status) {
                        device.todayEnergy = this.getRandomEnergyValue();
                    }
                }
            });

            // 更新表格显示
            this.renderDeviceTable();

            // 更新统计数据
            this.updateStatistics();
        }, 10000); // 每10秒更新一次
    }

    updateStatistics() {
        const stats = {
            total: this.devices.length,
            online: this.devices.filter(d => d.status === 'online').length,
            charging: this.devices.filter(d => d.status === 'charging').length,
            fault: this.devices.filter(d => d.status === 'offline').length
        };

        // 更新统计卡片
        const statCards = document.querySelectorAll('.stat-value');
        if (statCards[0]) statCards[0].textContent = stats.total.toLocaleString();
        if (statCards[1]) statCards[1].textContent = (stats.online + stats.charging).toLocaleString();
        if (statCards[2]) statCards[2].textContent = stats.charging.toLocaleString();
        if (statCards[3]) statCards[3].textContent = stats.fault.toLocaleString();

        // 更新状态分布
        document.getElementById('normal-count').textContent = (stats.online + stats.charging).toLocaleString();
        document.getElementById('charging-count').textContent = stats.charging.toLocaleString();
        document.getElementById('maintenance-count').textContent = this.devices.filter(d => d.status === 'maintenance').length.toLocaleString();
        document.getElementById('fault-count').textContent = stats.fault.toLocaleString();
    }

    destroy() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
    }
}

// 初始化页面
const devicesPage = new DevicesPage();

// 页面卸载时清理
window.addEventListener('beforeunload', () => {
    devicesPage.destroy();
});