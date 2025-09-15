// 电站管理页面功能
class StationsPage {
    constructor() {
        this.stations = [];
        this.currentPage = 1;
        this.totalPages = 10;
        this.init();
    }

    init() {
        // 插入导航栏
        document.getElementById('header-container').innerHTML = SharedComponents.createHeader('stations');
        
        // 初始化通用功能
        SharedComponents.initCommonFeatures();
        
        // 加载数据
        this.loadStations();
        
        // 绑定事件
        this.bindEvents();
    }

    loadStations() {
        // 模拟电站数据
        this.stations = [
            { id: 'ST001', name: '北京朝阳充电站', address: '北京市朝阳区建国路88号', devices: 24, onlineRate: 95.8, todayRevenue: 12456, status: 'active' },
            { id: 'ST002', name: '上海浦东充电站', address: '上海市浦东新区世纪大道100号', devices: 32, onlineRate: 92.3, todayRevenue: 18780, status: 'active' },
            { id: 'ST003', name: '深圳南山充电站', address: '深圳市南山区科技园路1号', devices: 18, onlineRate: 88.9, todayRevenue: 9234, status: 'pending' },
            { id: 'ST004', name: '广州天河充电站', address: '广州市天河区珠江新城', devices: 28, onlineRate: 94.2, todayRevenue: 15678, status: 'active' },
            { id: 'ST005', name: '杭州西湖充电站', address: '杭州市西湖区文三路', devices: 20, onlineRate: 87.5, todayRevenue: 11234, status: 'active' },
            { id: 'ST006', name: '成都高新充电站', address: '成都市高新区天府大道', devices: 16, onlineRate: 0, todayRevenue: 0, status: 'inactive' },
            { id: 'ST007', name: '武汉光谷充电站', address: '武汉市东湖高新区光谷大道', devices: 22, onlineRate: 89.6, todayRevenue: 13456, status: 'active' },
            { id: 'ST008', name: '南京江宁充电站', address: '南京市江宁区双龙大道', devices: 26, onlineRate: 91.2, todayRevenue: 14567, status: 'active' }
        ];

        this.renderStations();
        this.renderPagination();
    }

    renderStations() {
        const tbody = document.getElementById('stations-tbody');
        if (!tbody) return;

        const rows = this.stations.map(station => `
            <tr>
                <td>${station.id}</td>
                <td>${station.name}</td>
                <td>${station.address}</td>
                <td>${station.devices}</td>
                <td>${station.onlineRate}%</td>
                <td>¥${SharedComponents.formatNumber(station.todayRevenue)}</td>
                <td>${this.getStatusBadge(station.status)}</td>
                <td>
                    <button class="btn-text" onclick="stationsPage.viewStation('${station.id}')">查看</button>
                    <button class="btn-text" onclick="stationsPage.editStation('${station.id}')">编辑</button>
                    <button class="btn-text danger" onclick="stationsPage.deleteStation('${station.id}')">删除</button>
                </td>
            </tr>
        `).join('');

        tbody.innerHTML = rows;
    }

    renderPagination() {
        const pagination = document.getElementById('pagination');
        if (!pagination) return;

        pagination.innerHTML = SharedComponents.createPagination(this.currentPage, this.totalPages);
        
        // 绑定分页事件
        pagination.querySelectorAll('.page-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (!btn.disabled && btn.textContent !== '...') {
                    if (btn.textContent === '←') {
                        this.currentPage = Math.max(1, this.currentPage - 1);
                    } else if (btn.textContent === '→') {
                        this.currentPage = Math.min(this.totalPages, this.currentPage + 1);
                    } else {
                        this.currentPage = parseInt(btn.textContent);
                    }
                    this.loadStations();
                }
            });
        });
    }

    getStatusBadge(status) {
        const statusMap = {
            active: '<span class="status active">运营中</span>',
            inactive: '<span class="status inactive">离线</span>',
            pending: '<span class="status pending">维护中</span>'
        };
        return statusMap[status] || status;
    }

    bindEvents() {
        // 搜索功能
        const searchBox = document.querySelector('.search-box');
        if (searchBox) {
            searchBox.addEventListener('input', SharedComponents.debounce((e) => {
                this.searchStations(e.target.value);
            }, 300));
        }

        // 新增按钮
        const addBtn = document.querySelector('.btn-primary');
        if (addBtn) {
            addBtn.addEventListener('click', () => {
                this.addStation();
            });
        }
    }

    searchStations(keyword) {
        if (!keyword) {
            this.loadStations();
            return;
        }

        const filtered = this.stations.filter(station => 
            station.name.includes(keyword) || 
            station.id.includes(keyword) ||
            station.address.includes(keyword)
        );

        this.stations = filtered;
        this.renderStations();
    }

    viewStation(id) {
        const station = this.stations.find(s => s.id === id);
        if (!station) return;

        SharedComponents.showToast(`查看电站: ${station.name}`, 'info');
        // 这里可以跳转到详情页或显示详情弹窗
    }

    editStation(id) {
        const station = this.stations.find(s => s.id === id);
        if (!station) return;

        SharedComponents.showToast(`编辑电站: ${station.name}`, 'info');
        // 这里可以显示编辑表单
    }

    deleteStation(id) {
        const station = this.stations.find(s => s.id === id);
        if (!station) return;

        SharedComponents.showConfirm(
            '确认删除',
            `确定要删除电站 "${station.name}" 吗？此操作不可恢复。`,
            () => {
                this.stations = this.stations.filter(s => s.id !== id);
                this.renderStations();
                SharedComponents.showToast('删除成功', 'success');
            }
        );
    }

    addStation() {
        SharedComponents.showToast('打开新增电站表单', 'info');
        // 这里可以显示新增表单
    }
}

// 初始化页面
const stationsPage = new StationsPage();