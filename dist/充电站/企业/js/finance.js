// 财务统计页面功能
class FinancePage {
    constructor() {
        this.financialData = [];
        this.stationRevenue = [];
        this.currentPage = 1;
        this.itemsPerPage = 20;
        this.currentReportType = '收支明细';
        this.updateInterval = null;
        this.init();
    }

    init() {
        // 插入导航栏
        document.getElementById('header-container').innerHTML = SharedComponents.createHeader('finance');
        
        // 初始化通用功能
        SharedComponents.initCommonFeatures();
        
        // 初始化财务数据
        this.initFinancialData();
        
        // 渲染站点排行
        this.renderStationRanking();
        
        // 渲染财务报表
        this.renderFinancialTable();
        
        // 绑定事件
        this.bindEvents();
        
        // 启动实时更新
        this.startRealTimeUpdates();
    }

    initFinancialData() {
        // 生成模拟财务数据
        this.financialData = [];
        this.stationRevenue = [];
        
        const stations = [
            { name: '北京朝阳站', code: 'BJ' },
            { name: '上海浦东站', code: 'SH' },
            { name: '深圳南山站', code: 'SZ' },
            { name: '广州天河站', code: 'GZ' },
            { name: '杭州西湖站', code: 'HZ' },
            { name: '成都高新站', code: 'CD' },
            { name: '武汉光谷站', code: 'WH' },
            { name: '南京江宁站', code: 'NJ' },
            { name: '西安高新站', code: 'XA' },
            { name: '天津滨海站', code: 'TJ' }
        ];

        // 生成过去365天的财务数据
        for (let i = 0; i < 365; i++) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            
            stations.forEach(station => {
                const chargingRevenue = this.getRandomRevenue(8000, 25000);
                const membershipRevenue = this.getRandomRevenue(500, 3000);
                const parkingRevenue = this.getRandomRevenue(200, 1000);
                const otherRevenue = this.getRandomRevenue(50, 500);
                
                const totalRevenue = chargingRevenue + membershipRevenue + parkingRevenue + otherRevenue;
                
                const electricityCost = totalRevenue * (0.3 + Math.random() * 0.2); // 30-50%
                const maintenanceCost = totalRevenue * (0.05 + Math.random() * 0.1); // 5-15%
                const laborCost = totalRevenue * (0.08 + Math.random() * 0.07); // 8-15%
                const otherCost = totalRevenue * (0.03 + Math.random() * 0.07); // 3-10%
                
                const totalCost = electricityCost + maintenanceCost + laborCost + otherCost;
                const netProfit = totalRevenue - totalCost;
                const profitMargin = (netProfit / totalRevenue) * 100;

                this.financialData.push({
                    date: date.toISOString().split('T')[0],
                    station: station.name,
                    stationCode: station.code,
                    chargingRevenue: chargingRevenue,
                    membershipRevenue: membershipRevenue,
                    parkingRevenue: parkingRevenue,
                    otherRevenue: otherRevenue,
                    totalRevenue: totalRevenue,
                    electricityCost: electricityCost,
                    maintenanceCost: maintenanceCost,
                    laborCost: laborCost,
                    otherCost: otherCost,
                    totalCost: totalCost,
                    netProfit: netProfit,
                    profitMargin: profitMargin
                });
            });
        }

        // 按日期倒序排列
        this.financialData.sort((a, b) => new Date(b.date) - new Date(a.date));

        // 生成站点收入汇总
        this.generateStationRevenueSummary();
    }

    getRandomRevenue(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }

    generateStationRevenueSummary() {
        const stationMap = new Map();
        
        // 汇总本月数据
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        
        this.financialData
            .filter(item => {
                const itemDate = new Date(item.date);
                return itemDate.getMonth() === currentMonth && itemDate.getFullYear() === currentYear;
            })
            .forEach(item => {
                if (!stationMap.has(item.station)) {
                    stationMap.set(item.station, {
                        name: item.station,
                        revenue: 0,
                        cost: 0,
                        profit: 0,
                        days: 0
                    });
                }
                
                const station = stationMap.get(item.station);
                station.revenue += item.totalRevenue;
                station.cost += item.totalCost;
                station.profit += item.netProfit;
                station.days++;
            });

        this.stationRevenue = Array.from(stationMap.values())
            .map(station => ({
                ...station,
                profitMargin: (station.profit / station.revenue) * 100
            }))
            .sort((a, b) => b.revenue - a.revenue);
    }

    renderStationRanking() {
        this.renderRevenueRanking();
        this.renderProfitRanking();
    }

    renderRevenueRanking() {
        const container = document.getElementById('revenue-ranking');
        if (!container) return;

        const top10Revenue = this.stationRevenue.slice(0, 10);
        const maxRevenue = top10Revenue[0]?.revenue || 1;

        container.innerHTML = top10Revenue.map((station, index) => `
            <div class="ranking-item">
                <span class="rank-num">${index + 1}</span>
                <div class="rank-info">
                    <div class="rank-name">${station.name}</div>
                    <div class="rank-value">¥${SharedComponents.formatNumber(station.revenue, 0)}</div>
                </div>
                <div class="rank-bar">
                    <div class="rank-fill" style="width: ${(station.revenue / maxRevenue) * 100}%;"></div>
                </div>
            </div>
        `).join('');
    }

    renderProfitRanking() {
        const container = document.getElementById('profit-ranking');
        if (!container) return;

        const top10Profit = [...this.stationRevenue]
            .sort((a, b) => b.profit - a.profit)
            .slice(0, 10);
        const maxProfit = top10Profit[0]?.profit || 1;

        container.innerHTML = top10Profit.map((station, index) => `
            <div class="ranking-item">
                <span class="rank-num">${index + 1}</span>
                <div class="rank-info">
                    <div class="rank-name">${station.name}</div>
                    <div class="rank-value">¥${SharedComponents.formatNumber(station.profit, 0)}</div>
                </div>
                <div class="rank-bar profit">
                    <div class="rank-fill" style="width: ${(station.profit / maxProfit) * 100}%;"></div>
                </div>
            </div>
        `).join('');
    }

    renderFinancialTable() {
        const tbody = document.getElementById('financial-table-body');
        if (!tbody) return;

        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const currentData = this.financialData.slice(startIndex, endIndex);

        tbody.innerHTML = currentData.map(item => `
            <tr>
                <td>${item.date}</td>
                <td>${item.station}</td>
                <td>¥${SharedComponents.formatNumber(item.chargingRevenue, 2)}</td>
                <td>¥${SharedComponents.formatNumber(item.membershipRevenue, 2)}</td>
                <td>¥${SharedComponents.formatNumber(item.parkingRevenue, 2)}</td>
                <td>¥${SharedComponents.formatNumber(item.otherRevenue, 2)}</td>
                <td>¥${SharedComponents.formatNumber(item.electricityCost, 2)}</td>
                <td>¥${SharedComponents.formatNumber(item.maintenanceCost, 2)}</td>
                <td>¥${SharedComponents.formatNumber(item.laborCost, 2)}</td>
                <td>¥${SharedComponents.formatNumber(item.otherCost, 2)}</td>
                <td class="${item.netProfit >= 0 ? 'positive' : 'negative'}">
                    ¥${SharedComponents.formatNumber(item.netProfit, 2)}
                </td>
                <td class="${item.profitMargin >= 0 ? 'positive' : 'negative'}">
                    ${item.profitMargin.toFixed(1)}%
                </td>
            </tr>
        `).join('');

        this.updatePaginationInfo();
    }

    updatePaginationInfo() {
        const info = document.querySelector('.pagination-info');
        if (info) {
            const start = (this.currentPage - 1) * this.itemsPerPage + 1;
            const end = Math.min(this.currentPage * this.itemsPerPage, this.financialData.length);
            info.textContent = `显示 ${start}-${end} 条，共 ${this.financialData.length.toLocaleString()} 条记录`;
        }
    }

    bindEvents() {
        // 时间选择器
        document.querySelectorAll('.time-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.time-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.updateRevenueChart(e.target.textContent);
            });
        });

        // 站点筛选
        const stationFilter = document.querySelector('.station-filter');
        if (stationFilter) {
            stationFilter.addEventListener('change', (e) => {
                this.filterByStation(e.target.value);
            });
        }

        // 收入构成期间筛选
        document.querySelectorAll('.period-filter').forEach(filter => {
            filter.addEventListener('change', (e) => {
                this.updatePeriodData(e.target.value);
            });
        });

        // 排行榜筛选
        const rankingFilter = document.querySelector('.ranking-filter');
        if (rankingFilter) {
            rankingFilter.addEventListener('change', (e) => {
                this.updateRankingData(e.target.value);
            });
        }

        // 报表类型选择
        const reportType = document.querySelector('.report-type');
        if (reportType) {
            reportType.addEventListener('change', (e) => {
                this.currentReportType = e.target.value;
                this.updateReportTable();
            });
        }

        // 日期筛选
        const startDate = document.getElementById('report-start-date');
        const endDate = document.getElementById('report-end-date');
        if (startDate && endDate) {
            startDate.addEventListener('change', () => this.filterByDateRange());
            endDate.addEventListener('change', () => this.filterByDateRange());
        }

        // 生成报表按钮
        const generateBtn = document.querySelector('.btn-primary');
        if (generateBtn) {
            generateBtn.addEventListener('click', () => {
                this.generateReport();
            });
        }

        // 导出Excel按钮
        const exportBtn = document.querySelector('.btn:not(.btn-primary)');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                this.exportToExcel();
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

        // 预警处理
        document.querySelectorAll('.alert-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (btn.classList.contains('dismiss')) {
                    this.dismissAlert(btn.closest('.alert-item'));
                } else {
                    this.handleAlert(btn.closest('.alert-item'));
                }
            });
        });
    }

    updateRevenueChart(period) {
        console.log(`更新收入图表: ${period}`);
        // 这里可以添加图表更新逻辑
    }

    filterByStation(stationCode) {
        if (!stationCode) {
            this.renderFinancialTable();
            return;
        }
        
        // 根据站点筛选数据
        console.log(`按站点筛选: ${stationCode}`);
        // 这里可以添加站点筛选逻辑
    }

    updatePeriodData(period) {
        console.log(`更新期间数据: ${period}`);
        // 这里可以添加期间数据更新逻辑
    }

    updateRankingData(period) {
        console.log(`更新排行数据: ${period}`);
        // 这里可以根据不同期间重新计算排行
        this.generateStationRevenueSummary();
        this.renderStationRanking();
    }

    updateReportTable() {
        console.log(`更新报表类型: ${this.currentReportType}`);
        // 这里可以根据报表类型显示不同的表格结构
    }

    filterByDateRange() {
        const startDate = document.getElementById('report-start-date').value;
        const endDate = document.getElementById('report-end-date').value;
        
        if (startDate && endDate) {
            console.log(`日期范围筛选: ${startDate} 到 ${endDate}`);
            // 这里可以添加日期范围筛选逻辑
        }
    }

    generateReport() {
        SharedComponents.showToast('正在生成财务报表...', 'info');
        
        setTimeout(() => {
            SharedComponents.showToast('财务报表生成完成', 'success');
        }, 2000);
    }

    exportToExcel() {
        SharedComponents.showToast('正在导出Excel文件...', 'info');
        
        setTimeout(() => {
            SharedComponents.showToast('Excel文件导出完成', 'success');
        }, 1500);
    }

    changePage(page) {
        this.currentPage = page;
        this.renderFinancialTable();
        
        // 更新分页按钮状态
        document.querySelectorAll('.page-btn').forEach(btn => {
            btn.classList.remove('active');
            if (parseInt(btn.textContent) === page) {
                btn.classList.add('active');
            }
        });
    }

    handleAlert(alertItem) {
        const alertTitle = alertItem.querySelector('.alert-title').textContent;
        SharedComponents.showToast(`正在处理预警: ${alertTitle}`, 'info');
        
        setTimeout(() => {
            alertItem.style.opacity = '0.5';
            SharedComponents.showToast('预警处理完成', 'success');
        }, 1000);
    }

    dismissAlert(alertItem) {
        alertItem.style.transition = 'all 0.3s ease';
        alertItem.style.opacity = '0';
        alertItem.style.transform = 'translateX(100%)';
        
        setTimeout(() => {
            alertItem.remove();
            this.updateAlertCount();
        }, 300);
    }

    updateAlertCount() {
        const alertCount = document.querySelector('.alert-count');
        const remainingAlerts = document.querySelectorAll('.alert-item').length;
        if (alertCount) {
            alertCount.textContent = `${remainingAlerts}个预警`;
        }
    }

    startRealTimeUpdates() {
        this.updateInterval = setInterval(() => {
            // 模拟实时数据更新
            this.updateTodayStats();
            
            // 随机更新一些财务数据
            const todayData = this.financialData.filter(item => {
                const itemDate = new Date(item.date);
                const today = new Date();
                return itemDate.toDateString() === today.toDateString();
            });

            todayData.forEach(item => {
                if (Math.random() < 0.1) { // 10% 概率更新
                    const increment = this.getRandomRevenue(100, 1000);
                    item.chargingRevenue += increment;
                    item.totalRevenue += increment;
                    item.netProfit = item.totalRevenue - item.totalCost;
                    item.profitMargin = (item.netProfit / item.totalRevenue) * 100;
                }
            });

            // 更新站点收入汇总
            this.generateStationRevenueSummary();
            this.renderStationRanking();
            
            // 如果当前显示的是今天的数据，更新表格
            if (this.currentPage === 1) {
                this.renderFinancialTable();
            }
        }, 10000); // 每10秒更新一次
    }

    updateTodayStats() {
        // 计算今日数据
        const today = new Date().toDateString();
        const todayData = this.financialData.filter(item => 
            new Date(item.date).toDateString() === today
        );

        const todayRevenue = todayData.reduce((sum, item) => sum + item.totalRevenue, 0);
        const todayCost = todayData.reduce((sum, item) => sum + item.totalCost, 0);
        const todayProfit = todayRevenue - todayCost;

        // 计算本月数据
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const monthData = this.financialData.filter(item => {
            const itemDate = new Date(item.date);
            return itemDate.getMonth() === currentMonth && itemDate.getFullYear() === currentYear;
        });

        const monthRevenue = monthData.reduce((sum, item) => sum + item.totalRevenue, 0);
        const monthCost = monthData.reduce((sum, item) => sum + item.totalCost, 0);
        const monthProfit = monthRevenue - monthCost;

        // 更新统计卡片
        const statCards = document.querySelectorAll('.stat-value');
        if (statCards[0]) statCards[0].textContent = `¥${(todayRevenue / 1000).toFixed(1)}K`;
        if (statCards[1]) statCards[1].textContent = `¥${(monthRevenue / 1000000).toFixed(1)}M`;
        if (statCards[2]) statCards[2].textContent = `¥${(monthCost / 1000).toFixed(0)}K`;
        if (statCards[3]) statCards[3].textContent = `¥${(monthProfit / 1000000).toFixed(2)}M`;
    }

    destroy() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
    }
}

// 初始化页面
const financePage = new FinancePage();

// 页面卸载时清理
window.addEventListener('beforeunload', () => {
    financePage.destroy();
});