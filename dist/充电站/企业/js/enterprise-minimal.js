// 企业管理系统 - 极简版
class EnterpriseSystem {
    constructor() {
        this.currentPage = 'dashboard';
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadPage('dashboard');
    }

    bindEvents() {
        // 导航菜单事件
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                if (link.classList.contains('exit')) return;
                
                e.preventDefault();
                const page = link.dataset.page;
                this.switchPage(page);
            });
        });
    }

    switchPage(page) {
        // 更新导航状态
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.dataset.page === page) {
                link.classList.add('active');
            }
        });

        // 更新页面标题
        const titles = {
            dashboard: ['数据概览', '实时监控充电站运营状态'],
            stations: ['电站管理', '管理和监控所有充电站点'],
            devices: ['设备管理', '充电设备状态与控制中心'],
            orders: ['订单管理', '订单处理与交易记录'],
            users: ['用户管理', '用户信息与服务管理'],
            finance: ['财务统计', '收入分析与财务报表'],
            maintenance: ['维护管理', '设备维护与故障处理'],
            settings: ['系统设置', '配置系统参数与权限']
        };

        const [title, subtitle] = titles[page] || titles.dashboard;
        document.querySelector('.page-title').textContent = title;
        document.querySelector('.page-subtitle').textContent = subtitle;

        // 加载页面内容
        this.loadPage(page);
        this.currentPage = page;
    }

    loadPage(page) {
        const content = document.getElementById('page-content');
        content.innerHTML = this.getPageContent(page);
        this.initPageFeatures(page);
    }

    getPageContent(page) {
        const pages = {
            dashboard: this.getDashboardContent(),
            stations: this.getStationsContent(),
            devices: this.getDevicesContent(),
            orders: this.getOrdersContent(),
            users: this.getUsersContent(),
            finance: this.getFinanceContent(),
            maintenance: this.getMaintenanceContent(),
            settings: this.getSettingsContent()
        };
        return pages[page] || pages.dashboard;
    }

    getDashboardContent() {
        return `
            <!-- 统计卡片 -->
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-label">总电站数</div>
                    <div class="stat-value">156</div>
                    <div class="stat-change positive">↑ 12.5%</div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-label">在线设备</div>
                    <div class="stat-value">2,847</div>
                    <div class="stat-change positive">↑ 8.3%</div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-label">今日订单</div>
                    <div class="stat-value">1,234</div>
                    <div class="stat-change negative">↓ 3.2%</div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-label">今日收入</div>
                    <div class="stat-value">¥89.5K</div>
                    <div class="stat-change positive">↑ 15.8%</div>
                </div>
            </div>

            <!-- 充电站运行状态地图 -->
            <div class="station-status-container">
                <div class="status-header">
                    <div class="status-title-section">
                        <h3 class="section-title">充电站运行状态监控</h3>
                        <div class="status-summary">
                            <span class="summary-item">
                                <span class="summary-dot online"></span>
                                正常运行: <strong id="online-count">5</strong>
                            </span>
                            <span class="summary-item">
                                <span class="summary-dot busy"></span>
                                高负载: <strong id="busy-count">2</strong>
                            </span>
                            <span class="summary-item">
                                <span class="summary-dot maintenance"></span>
                                维护中: <strong id="maintenance-count">1</strong>
                            </span>
                            <span class="summary-item">
                                <span class="summary-dot offline"></span>
                                离线: <strong id="offline-count">1</strong>
                            </span>
                        </div>
                    </div>
                </div>
                
                <!-- 地图视图 -->
                <div id="station-map-view" class="station-map-view active">
                    <div id="station-map" class="station-map-fullscreen">
                        <!-- 地图容器 -->
                    </div>
                </div>
            </div>

            <!-- 多维度数据分析 -->
            <div class="multi-analysis-grid">
                <!-- 充电量排行 -->
                <div class="analysis-card">
                    <div class="analysis-header">
                        <h3 class="analysis-title">充电量TOP5</h3>
                        <select class="analysis-filter">
                            <option>今日</option>
                            <option>本周</option>
                            <option>本月</option>
                        </select>
                    </div>
                    <div class="ranking-list">
                        <div class="ranking-item">
                            <span class="rank-num">1</span>
                            <div class="rank-info">
                                <div class="rank-name">北京朝阳充电站</div>
                                <div class="rank-value">8,456 kWh</div>
                            </div>
                            <div class="rank-bar" style="width: 100%;"></div>
                        </div>
                        <div class="ranking-item">
                            <span class="rank-num">2</span>
                            <div class="rank-info">
                                <div class="rank-name">上海浦东充电站</div>
                                <div class="rank-value">7,234 kWh</div>
                            </div>
                            <div class="rank-bar" style="width: 85%;"></div>
                        </div>
                        <div class="ranking-item">
                            <span class="rank-num">3</span>
                            <div class="rank-info">
                                <div class="rank-name">深圳南山充电站</div>
                                <div class="rank-value">6,789 kWh</div>
                            </div>
                            <div class="rank-bar" style="width: 80%;"></div>
                        </div>
                        <div class="ranking-item">
                            <span class="rank-num">4</span>
                            <div class="rank-info">
                                <div class="rank-name">广州天河充电站</div>
                                <div class="rank-value">5,678 kWh</div>
                            </div>
                            <div class="rank-bar" style="width: 67%;"></div>
                        </div>
                        <div class="ranking-item">
                            <span class="rank-num">5</span>
                            <div class="rank-info">
                                <div class="rank-name">杭州西湖充电站</div>
                                <div class="rank-value">4,567 kWh</div>
                            </div>
                            <div class="rank-bar" style="width: 54%;"></div>
                        </div>
                    </div>
                </div>

                <!-- 收益排行 -->
                <div class="analysis-card">
                    <div class="analysis-header">
                        <h3 class="analysis-title">收益TOP5</h3>
                        <select class="analysis-filter">
                            <option>今日</option>
                            <option>本周</option>
                            <option>本月</option>
                        </select>
                    </div>
                    <div class="ranking-list">
                        <div class="ranking-item">
                            <span class="rank-num">1</span>
                            <div class="rank-info">
                                <div class="rank-name">上海浦东充电站</div>
                                <div class="rank-value">¥18,780</div>
                            </div>
                            <div class="rank-bar revenue" style="width: 100%;"></div>
                        </div>
                        <div class="ranking-item">
                            <span class="rank-num">2</span>
                            <div class="rank-info">
                                <div class="rank-name">北京朝阳充电站</div>
                                <div class="rank-value">¥16,456</div>
                            </div>
                            <div class="rank-bar revenue" style="width: 87%;"></div>
                        </div>
                        <div class="ranking-item">
                            <span class="rank-num">3</span>
                            <div class="rank-info">
                                <div class="rank-name">深圳南山充电站</div>
                                <div class="rank-value">¥14,234</div>
                            </div>
                            <div class="rank-bar revenue" style="width: 76%;"></div>
                        </div>
                        <div class="ranking-item">
                            <span class="rank-num">4</span>
                            <div class="rank-info">
                                <div class="rank-name">广州天河充电站</div>
                                <div class="rank-value">¥12,678</div>
                            </div>
                            <div class="rank-bar revenue" style="width: 67%;"></div>
                        </div>
                        <div class="ranking-item">
                            <span class="rank-num">5</span>
                            <div class="rank-info">
                                <div class="rank-name">成都高新充电站</div>
                                <div class="rank-value">¥10,456</div>
                            </div>
                            <div class="rank-bar revenue" style="width: 56%;"></div>
                        </div>
                    </div>
                </div>

                <!-- 使用率分析 -->
                <div class="analysis-card">
                    <div class="analysis-header">
                        <h3 class="analysis-title">使用率分析</h3>
                        <select class="analysis-filter">
                            <option>今日</option>
                            <option>本周</option>
                            <option>本月</option>
                        </select>
                    </div>
                    <div class="usage-stats">
                        <div class="usage-item">
                            <div class="usage-label">平均使用率</div>
                            <div class="usage-value">68.5%</div>
                            <div class="usage-bar">
                                <div class="usage-fill" style="width: 68.5%;"></div>
                            </div>
                        </div>
                        <div class="usage-item">
                            <div class="usage-label">峰时使用率</div>
                            <div class="usage-value">92.3%</div>
                            <div class="usage-bar">
                                <div class="usage-fill peak" style="width: 92.3%;"></div>
                            </div>
                        </div>
                        <div class="usage-item">
                            <div class="usage-label">谷时使用率</div>
                            <div class="usage-value">35.8%</div>
                            <div class="usage-bar">
                                <div class="usage-fill valley" style="width: 35.8%;"></div>
                            </div>
                        </div>
                        <div class="usage-time-dist">
                            <div class="time-label">24小时分布</div>
                            <div class="time-bars">
                                ${Array.from({length: 24}, (_, i) => {
                                    const height = Math.random() * 80 + 20;
                                    return `<div class="time-bar" style="height: ${height}%;" title="${i}:00"></div>`;
                                }).join('')}
                            </div>
                            <div class="time-axis">
                                <span>0</span>
                                <span>6</span>
                                <span>12</span>
                                <span>18</span>
                                <span>24</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 图表区域 -->
            <div class="chart-container">
                <div class="chart-header">
                    <h3 class="chart-title">充电量趋势</h3>
                    <div class="chart-options">
                        <button class="chart-option active">日</button>
                        <button class="chart-option">周</button>
                        <button class="chart-option">月</button>
                    </div>
                </div>
                <div class="chart-body">
                    <div style="text-align: center; color: #999;">
                        图表加载中...
                    </div>
                </div>
            </div>

            <!-- 最近订单 -->
            <div class="data-section">
                <div class="section-header">
                    <h2 class="section-title">最近订单</h2>
                    <div class="section-actions">
                        <button class="btn">查看全部 →</button>
                    </div>
                </div>
                
                <div class="minimal-table">
                    <div class="table-wrapper">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>订单编号</th>
                                    <th>用户</th>
                                    <th>电站</th>
                                    <th>充电量</th>
                                    <th>金额</th>
                                    <th>状态</th>
                                    <th>时间</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>ORD-2024-0101</td>
                                    <td>张三</td>
                                    <td>北京朝阳站A区</td>
                                    <td>45.5 kWh</td>
                                    <td>¥68.25</td>
                                    <td><span class="status active">充电中</span></td>
                                    <td>10:30</td>
                                </tr>
                                <tr>
                                    <td>ORD-2024-0102</td>
                                    <td>李四</td>
                                    <td>上海浦东站B区</td>
                                    <td>32.8 kWh</td>
                                    <td>¥49.20</td>
                                    <td><span class="status inactive">已完成</span></td>
                                    <td>10:15</td>
                                </tr>
                                <tr>
                                    <td>ORD-2024-0103</td>
                                    <td>王五</td>
                                    <td>深圳南山站C区</td>
                                    <td>28.3 kWh</td>
                                    <td>¥42.45</td>
                                    <td><span class="status pending">待支付</span></td>
                                    <td>09:45</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    }

    getStationsContent() {
        return `
            <div class="data-section">
                <div class="section-header">
                    <h2 class="section-title">电站列表</h2>
                    <div class="section-actions">
                        <input type="text" class="search-box" placeholder="搜索电站...">
                        <button class="btn btn-primary">+ 新增电站</button>
                    </div>
                </div>
                
                <div class="minimal-table">
                    <div class="table-wrapper">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>电站编号</th>
                                    <th>电站名称</th>
                                    <th>地址</th>
                                    <th>充电桩数</th>
                                    <th>在线率</th>
                                    <th>今日收入</th>
                                    <th>状态</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>ST001</td>
                                    <td>北京朝阳充电站</td>
                                    <td>北京市朝阳区建国路88号</td>
                                    <td>24</td>
                                    <td>95.8%</td>
                                    <td>¥12,456</td>
                                    <td><span class="status active">运营中</span></td>
                                </tr>
                                <tr>
                                    <td>ST002</td>
                                    <td>上海浦东充电站</td>
                                    <td>上海市浦东新区世纪大道100号</td>
                                    <td>32</td>
                                    <td>92.3%</td>
                                    <td>¥18,780</td>
                                    <td><span class="status active">运营中</span></td>
                                </tr>
                                <tr>
                                    <td>ST003</td>
                                    <td>深圳南山充电站</td>
                                    <td>深圳市南山区科技园路1号</td>
                                    <td>18</td>
                                    <td>88.9%</td>
                                    <td>¥9,234</td>
                                    <td><span class="status pending">维护中</span></td>
                                </tr>
                                <tr>
                                    <td>ST004</td>
                                    <td>广州天河充电站</td>
                                    <td>广州市天河区珠江新城</td>
                                    <td>28</td>
                                    <td>94.2%</td>
                                    <td>¥15,678</td>
                                    <td><span class="status active">运营中</span></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                
                <div class="pagination">
                    <button class="page-btn" disabled>←</button>
                    <button class="page-btn active">1</button>
                    <button class="page-btn">2</button>
                    <button class="page-btn">3</button>
                    <button class="page-btn">...</button>
                    <button class="page-btn">16</button>
                    <button class="page-btn">→</button>
                </div>
            </div>
        `;
    }

    getDevicesContent() {
        return `
            <!-- 设备统计 -->
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-label">总设备数</div>
                    <div class="stat-value">3,156</div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-label">在线设备</div>
                    <div class="stat-value">2,847</div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-label">离线设备</div>
                    <div class="stat-value">209</div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-label">故障设备</div>
                    <div class="stat-value">100</div>
                </div>
            </div>

            <div class="data-section">
                <div class="section-header">
                    <h2 class="section-title">设备列表</h2>
                    <div class="section-actions">
                        <input type="text" class="search-box" placeholder="搜索设备...">
                        <button class="btn btn-primary">+ 添加设备</button>
                    </div>
                </div>
                
                <div class="minimal-table">
                    <div class="table-wrapper">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>设备编号</th>
                                    <th>设备型号</th>
                                    <th>所属电站</th>
                                    <th>功率</th>
                                    <th>使用率</th>
                                    <th>累计充电</th>
                                    <th>状态</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>DEV001</td>
                                    <td>DC-120kW</td>
                                    <td>北京朝阳充电站</td>
                                    <td>120 kW</td>
                                    <td>78.5%</td>
                                    <td>45,678 kWh</td>
                                    <td><span class="status active">在线</span></td>
                                </tr>
                                <tr>
                                    <td>DEV002</td>
                                    <td>AC-7kW</td>
                                    <td>上海浦东充电站</td>
                                    <td>7 kW</td>
                                    <td>65.3%</td>
                                    <td>12,345 kWh</td>
                                    <td><span class="status active">在线</span></td>
                                </tr>
                                <tr>
                                    <td>DEV003</td>
                                    <td>DC-60kW</td>
                                    <td>深圳南山充电站</td>
                                    <td>60 kW</td>
                                    <td>0%</td>
                                    <td>23,456 kWh</td>
                                    <td><span class="status inactive">故障</span></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    }

    getOrdersContent() {
        return `
            <!-- 订单统计 -->
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-label">今日订单</div>
                    <div class="stat-value">1,234</div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-label">进行中</div>
                    <div class="stat-value">89</div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-label">已完成</div>
                    <div class="stat-value">1,098</div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-label">异常订单</div>
                    <div class="stat-value">47</div>
                </div>
            </div>

            <div class="data-section">
                <div class="section-header">
                    <h2 class="section-title">订单记录</h2>
                    <div class="section-actions">
                        <input type="text" class="search-box" placeholder="订单号/用户/电站">
                        <button class="btn">导出报表</button>
                    </div>
                </div>
                
                <div class="minimal-table">
                    <div class="table-wrapper">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>订单号</th>
                                    <th>用户</th>
                                    <th>电站/设备</th>
                                    <th>开始时间</th>
                                    <th>时长</th>
                                    <th>充电量</th>
                                    <th>金额</th>
                                    <th>状态</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>2024010100001</td>
                                    <td>张三</td>
                                    <td>北京朝阳站 / DEV001</td>
                                    <td>10:30:00</td>
                                    <td>45分钟</td>
                                    <td>45.5 kWh</td>
                                    <td>¥68.25</td>
                                    <td><span class="status active">充电中</span></td>
                                </tr>
                                <tr>
                                    <td>2024010100002</td>
                                    <td>李四</td>
                                    <td>上海浦东站 / DEV002</td>
                                    <td>09:15:00</td>
                                    <td>62分钟</td>
                                    <td>32.8 kWh</td>
                                    <td>¥49.20</td>
                                    <td><span class="status inactive">已完成</span></td>
                                </tr>
                                <tr>
                                    <td>2024010100003</td>
                                    <td>王五</td>
                                    <td>深圳南山站 / DEV005</td>
                                    <td>08:45:00</td>
                                    <td>38分钟</td>
                                    <td>28.3 kWh</td>
                                    <td>¥42.45</td>
                                    <td><span class="status pending">待支付</span></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    }

    getUsersContent() {
        return `
            <!-- 用户统计 -->
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-label">总用户数</div>
                    <div class="stat-value">45,678</div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-label">今日新增</div>
                    <div class="stat-value">234</div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-label">活跃用户</div>
                    <div class="stat-value">12,345</div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-label">会员用户</div>
                    <div class="stat-value">8,901</div>
                </div>
            </div>

            <div class="data-section">
                <div class="section-header">
                    <h2 class="section-title">用户列表</h2>
                    <div class="section-actions">
                        <input type="text" class="search-box" placeholder="搜索用户...">
                        <button class="btn">导出数据</button>
                    </div>
                </div>
                
                <div class="minimal-table">
                    <div class="table-wrapper">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>用户ID</th>
                                    <th>姓名</th>
                                    <th>手机号</th>
                                    <th>类型</th>
                                    <th>注册时间</th>
                                    <th>累计充电</th>
                                    <th>累计消费</th>
                                    <th>状态</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>U001234</td>
                                    <td>张三</td>
                                    <td>135****1234</td>
                                    <td>会员用户</td>
                                    <td>2023-06-15</td>
                                    <td>1,234 kWh</td>
                                    <td>¥2,456.50</td>
                                    <td><span class="status active">正常</span></td>
                                </tr>
                                <tr>
                                    <td>U001235</td>
                                    <td>李四</td>
                                    <td>138****5678</td>
                                    <td>普通用户</td>
                                    <td>2023-08-20</td>
                                    <td>567 kWh</td>
                                    <td>¥890.25</td>
                                    <td><span class="status active">正常</span></td>
                                </tr>
                                <tr>
                                    <td>U001236</td>
                                    <td>王五</td>
                                    <td>139****9012</td>
                                    <td>企业用户</td>
                                    <td>2023-05-10</td>
                                    <td>3,456 kWh</td>
                                    <td>¥5,678.90</td>
                                    <td><span class="status active">正常</span></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    }

    getFinanceContent() {
        return `
            <!-- 财务统计 -->
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-label">今日收入</div>
                    <div class="stat-value">¥89,456</div>
                    <div class="stat-change positive">↑ 15.8%</div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-label">本月收入</div>
                    <div class="stat-value">¥2.35M</div>
                    <div class="stat-change positive">↑ 12.3%</div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-label">待结算</div>
                    <div class="stat-value">¥45,678</div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-label">退款金额</div>
                    <div class="stat-value">¥3,456</div>
                </div>
            </div>

            <!-- 收入趋势图 -->
            <div class="chart-container">
                <div class="chart-header">
                    <h3 class="chart-title">收入趋势分析</h3>
                    <div class="chart-options">
                        <button class="chart-option active">日</button>
                        <button class="chart-option">周</button>
                        <button class="chart-option">月</button>
                        <button class="chart-option">年</button>
                    </div>
                </div>
                <div class="chart-body">
                    <div style="text-align: center; color: #999;">
                        图表加载中...
                    </div>
                </div>
            </div>

            <!-- 财务明细 -->
            <div class="data-section">
                <div class="section-header">
                    <h2 class="section-title">财务明细</h2>
                    <div class="section-actions">
                        <button class="btn btn-primary">导出报表</button>
                    </div>
                </div>
                
                <div class="minimal-table">
                    <div class="table-wrapper">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>流水号</th>
                                    <th>时间</th>
                                    <th>类型</th>
                                    <th>关联订单</th>
                                    <th>金额</th>
                                    <th>支付方式</th>
                                    <th>状态</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>FIN20240101001</td>
                                    <td>2024-01-01 10:30</td>
                                    <td>充电收入</td>
                                    <td>2024010100001</td>
                                    <td style="color: #00AA00;">+¥68.25</td>
                                    <td>微信支付</td>
                                    <td><span class="status active">已到账</span></td>
                                </tr>
                                <tr>
                                    <td>FIN20240101002</td>
                                    <td>2024-01-01 09:15</td>
                                    <td>充电收入</td>
                                    <td>2024010100002</td>
                                    <td style="color: #00AA00;">+¥49.20</td>
                                    <td>支付宝</td>
                                    <td><span class="status active">已到账</span></td>
                                </tr>
                                <tr>
                                    <td>FIN20240101003</td>
                                    <td>2024-01-01 08:45</td>
                                    <td>退款</td>
                                    <td>2023123100089</td>
                                    <td style="color: #FF3333;">-¥35.60</td>
                                    <td>原路退回</td>
                                    <td><span class="status inactive">已退款</span></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    }

    getMaintenanceContent() {
        return `
            <!-- 维护统计 -->
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-label">待维护</div>
                    <div class="stat-value">23</div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-label">维护中</div>
                    <div class="stat-value">8</div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-label">本月完成</div>
                    <div class="stat-value">156</div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-label">紧急故障</div>
                    <div class="stat-value">3</div>
                </div>
            </div>

            <div class="data-section">
                <div class="section-header">
                    <h2 class="section-title">维护工单</h2>
                    <div class="section-actions">
                        <input type="text" class="search-box" placeholder="搜索工单...">
                        <button class="btn btn-primary">+ 创建工单</button>
                    </div>
                </div>
                
                <div class="minimal-table">
                    <div class="table-wrapper">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>工单号</th>
                                    <th>设备编号</th>
                                    <th>电站</th>
                                    <th>故障类型</th>
                                    <th>优先级</th>
                                    <th>负责人</th>
                                    <th>创建时间</th>
                                    <th>状态</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>WO20240101</td>
                                    <td>DEV003</td>
                                    <td>深圳南山站</td>
                                    <td>充电枪故障</td>
                                    <td style="color: #FF3333;">紧急</td>
                                    <td>王工</td>
                                    <td>2024-01-01 08:00</td>
                                    <td><span class="status pending">处理中</span></td>
                                </tr>
                                <tr>
                                    <td>WO20240102</td>
                                    <td>DEV015</td>
                                    <td>北京朝阳站</td>
                                    <td>通信异常</td>
                                    <td style="color: #FFAA00;">普通</td>
                                    <td>李工</td>
                                    <td>2024-01-01 09:30</td>
                                    <td><span class="status inactive">待处理</span></td>
                                </tr>
                                <tr>
                                    <td>WO20240103</td>
                                    <td>DEV028</td>
                                    <td>上海浦东站</td>
                                    <td>显示屏损坏</td>
                                    <td style="color: #666666;">低</td>
                                    <td>张工</td>
                                    <td>2024-01-01 10:15</td>
                                    <td><span class="status active">已完成</span></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    }

    getSettingsContent() {
        return `
            <div class="data-section">
                <h2 class="section-title" style="margin-bottom: 40px;">基本设置</h2>
                
                <div class="form-grid">
                    <div class="form-group">
                        <label class="form-label">企业名称</label>
                        <input type="text" class="form-input" value="新能源充电科技有限公司">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">企业代码</label>
                        <input type="text" class="form-input" value="ENT20230001" readonly style="background: #F5F5F5;">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">联系电话</label>
                        <input type="tel" class="form-input" value="400-888-8888">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">企业邮箱</label>
                        <input type="email" class="form-input" value="contact@charging.com">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">企业地址</label>
                        <input type="text" class="form-input" value="北京市朝阳区建国路88号">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">营业时间</label>
                        <select class="form-select">
                            <option>24小时营业</option>
                            <option>06:00 - 23:00</option>
                            <option>自定义时间</option>
                        </select>
                    </div>
                </div>
                
                <h2 class="section-title" style="margin: 60px 0 40px;">费率设置</h2>
                
                <div class="form-grid">
                    <div class="form-group">
                        <label class="form-label">峰时电价（元/kWh）</label>
                        <input type="number" class="form-input" value="1.2" step="0.01">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">平时电价（元/kWh）</label>
                        <input type="number" class="form-input" value="0.8" step="0.01">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">谷时电价（元/kWh）</label>
                        <input type="number" class="form-input" value="0.5" step="0.01">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">服务费（元/kWh）</label>
                        <input type="number" class="form-input" value="0.3" step="0.01">
                    </div>
                </div>
                
                <div style="margin-top: 60px;">
                    <button class="btn btn-primary" style="margin-right: 16px;">保存设置</button>
                    <button class="btn">取消</button>
                </div>
            </div>
        `;
    }

    initPageFeatures(page) {
        // 绑定图表选项切换
        document.querySelectorAll('.chart-option').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.chart-option').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
            });
        });

        // 绑定分页按钮
        document.querySelectorAll('.page-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (!btn.disabled && btn.textContent !== '...') {
                    document.querySelectorAll('.page-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                }
            });
        });

        // 搜索框焦点效果
        document.querySelectorAll('.search-box').forEach(input => {
            input.addEventListener('focus', () => {
                input.style.borderColor = '#000000';
            });
            input.addEventListener('blur', () => {
                input.style.borderColor = '#E5E5E5';
            });
        });

        // 初始化地图功能
        if (page === 'dashboard') {
            this.initStationMonitoring();
            this.initAnalysisCards();
        }
    }

    initStationMonitoring() {
        // 初始化站点数据，增加充电中和空闲数据
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
        
        // 直接加载地图视图
        this.initMap();
        
        // 启动实时数据更新模拟
        this.startRealTimeUpdates();
    }
    
    startRealTimeUpdates() {
        // 每5秒更新一次数据
        this.updateInterval = setInterval(() => {
            // 随机更新站点数据
            this.stations.forEach(station => {
                // 只更新在线和忙碌状态的站点
                if (station.status === 'online' || station.status === 'busy') {
                    // 随机更新充电中和空闲数
                    const change = Math.floor(Math.random() * 5) - 2; // -2 到 2 的随机变化
                    const newCharging = Math.max(0, Math.min(station.devices, station.charging + change));
                    station.charging = newCharging;
                    station.idle = station.devices - newCharging;
                    
                    // 更新在线率
                    station.usage = Math.round((station.charging / station.devices) * 100 * 10) / 10;
                    
                    // 更新收入
                    const revenueIncrease = Math.random() * 100;
                    station.revenue += Math.round(revenueIncrease);
                    
                    // 根据使用率更新状态
                    if (station.usage > 85) {
                        station.status = 'busy';
                    } else {
                        station.status = 'online';
                    }
                }
                
                // 随机改变状态（低概率）
                if (Math.random() < 0.02) {
                    const statuses = ['online', 'busy'];
                    if (station.status !== 'maintenance' && station.status !== 'offline') {
                        station.status = statuses[Math.floor(Math.random() * statuses.length)];
                    }
                }
            });
            
            // 更新显示
            this.updateStatusCounts();
            
            // 更新地图标记
            this.updateMapMarkers();
        }, 5000);
    }
    
    updateMapMarkers() {
        const mapContainer = document.getElementById('station-map');
        if (!mapContainer) return;
        
        // 更新每个标记容器的状态和数据
        this.stations.forEach(station => {
            const markerContainer = mapContainer.querySelector(`[data-station-id="${station.id}"]`);
            if (markerContainer) {
                // 更新标记点状态
                const marker = markerContainer.querySelector('.map-marker');
                if (marker) {
                    marker.className = `map-marker ${station.status}`;
                }
                
                // 更新信息卡片
                const infoCard = markerContainer.querySelector('.map-info-card');
                if (infoCard) {
                    infoCard.className = `map-info-card ${station.status}`;
                    
                    // 更新状态点
                    const statusDot = infoCard.querySelector('.status-dot');
                    if (statusDot) {
                        statusDot.className = `status-dot ${station.status}`;
                    }
                    
                    // 更新统计数据
                    const statTexts = infoCard.querySelectorAll('.stat-text');
                    if (statTexts[0]) statTexts[0].textContent = `总: ${station.devices}`;
                    if (statTexts[1]) statTexts[1].textContent = `充: ${station.charging}`;
                    if (statTexts[2]) statTexts[2].textContent = `闲: ${station.idle}`;
                }
            }
        });
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

    getStatusText(status) {
        const statusMap = {
            online: '正常运行',
            busy: '高负载',
            maintenance: '维护中',
            offline: '离线'
        };
        return statusMap[status] || status;
    }

    showStationDetail(stationId) {
        const station = this.stations.find(s => s.id === stationId);
        if (!station) return;

        // 创建详情弹窗
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
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    initMap() {
        // 等待DOM加载完成
        setTimeout(() => {
            // 使用已初始化的站点数据
            const stations = this.stations;

            const mapContainer = document.getElementById('station-map');
            console.log('地图容器:', mapContainer);
            
            if (!mapContainer) {
                console.error('未找到地图容器元素');
                return;
            }

            // 清空地图
            mapContainer.innerHTML = '';

            // 添加调试信息
            console.log('开始创建地图标记，站点数量:', stations.length);

            // 创建带信息卡片的地图标记
            stations.forEach((station, index) => {
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
                
                console.log(`创建标记 ${index + 1}:`, station.name, `位置: ${station.x}%, ${station.y}%`);
                
                // 添加点击事件
                markerContainer.addEventListener('click', () => {
                    console.log('点击站点:', station.name);
                    this.showStationDetail(station);
                });

                mapContainer.appendChild(markerContainer);
            });

            console.log('地图标记创建完成，容器内容:', mapContainer.innerHTML);

            // 绑定地图筛选按钮
            document.querySelectorAll('.map-filter-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    document.querySelectorAll('.map-filter-btn').forEach(b => b.classList.remove('active'));
                    e.target.classList.add('active');
                    
                    const filter = e.target.dataset.filter;
                    this.filterMapMarkers(filter);
                });
            });
        }, 100);
    }

    showMapTooltip(event, station) {
        let tooltip = document.querySelector('.map-tooltip');
        if (!tooltip) {
            tooltip = document.createElement('div');
            tooltip.className = 'map-tooltip';
            document.body.appendChild(tooltip);
        }

        tooltip.innerHTML = `
            <div><strong>${station.name}</strong></div>
            <div>设备数量: ${station.devices}</div>
            <div>使用率: ${station.usage}%</div>
            <div>今日收入: ¥${station.revenue.toLocaleString()}</div>
        `;

        tooltip.style.left = event.pageX + 10 + 'px';
        tooltip.style.top = event.pageY - 10 + 'px';
        tooltip.classList.add('show');
    }

    hideMapTooltip() {
        const tooltip = document.querySelector('.map-tooltip');
        if (tooltip) {
            tooltip.classList.remove('show');
        }
    }

    filterMapMarkers(filter) {
        const markers = document.querySelectorAll('.map-marker');
        markers.forEach(marker => {
            const station = this.stations.find(s => s.id == marker.dataset.stationId);
            if (filter === 'all' || station.status === filter) {
                marker.style.display = 'block';
            } else {
                marker.style.display = 'none';
            }
        });
    }

    showStationDetail(station) {
        const detailContainer = document.getElementById('station-detail');
        const placeholder = detailContainer.querySelector('.detail-placeholder');
        
        if (placeholder) {
            placeholder.style.display = 'none';
        }

        detailContainer.innerHTML = `
            <div class="detail-content show">
                <div class="detail-header">
                    <div>
                        <div class="detail-title">${station.name}</div>
                        <div class="detail-subtitle">站点编号: ST${String(station.id).padStart(3, '0')}</div>
                    </div>
                    <span class="status ${station.status}">${this.getStatusText(station.status)}</span>
                </div>
                
                <div class="detail-stats">
                    <div class="detail-stat">
                        <span class="detail-stat-label">设备数量</span>
                        <span class="detail-stat-value">${station.devices}</span>
                    </div>
                    <div class="detail-stat">
                        <span class="detail-stat-label">在线率</span>
                        <span class="detail-stat-value">${station.usage}%</span>
                    </div>
                    <div class="detail-stat">
                        <span class="detail-stat-label">今日充电量</span>
                        <span class="detail-stat-value">${station.charging.toLocaleString()} kWh</span>
                    </div>
                    <div class="detail-stat">
                        <span class="detail-stat-label">今日收入</span>
                        <span class="detail-stat-value">¥${station.revenue.toLocaleString()}</span>
                    </div>
                    <div class="detail-stat">
                        <span class="detail-stat-label">平均单价</span>
                        <span class="detail-stat-value">¥${(station.revenue / station.charging).toFixed(2)}/kWh</span>
                    </div>
                    <div class="detail-stat">
                        <span class="detail-stat-label">服务效率</span>
                        <span class="detail-stat-value">${(station.charging / station.devices).toFixed(0)} kWh/桩</span>
                    </div>
                </div>
            </div>
        `;
    }

    getStatusText(status) {
        const statusMap = {
            online: '正常运营',
            busy: '高负载',
            maintenance: '维护中',
            offline: '离线'
        };
        return statusMap[status] || '未知';
    }

    initAnalysisCards() {
        // 绑定分析卡片筛选器
        document.querySelectorAll('.analysis-filter').forEach(select => {
            select.addEventListener('change', (e) => {
                const card = e.target.closest('.analysis-card');
                const timeRange = e.target.value;
                this.updateAnalysisData(card, timeRange);
            });
        });

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

    updateAnalysisData(card, timeRange) {
        // 模拟数据更新
        console.log(`更新分析数据: ${timeRange}`);
        
        // 这里可以添加数据更新逻辑
        const rankingItems = card.querySelectorAll('.ranking-item');
        rankingItems.forEach((item, index) => {
            const bar = item.querySelector('.rank-bar');
            const newWidth = Math.random() * 80 + 20;
            bar.style.width = newWidth + '%';
        });
    }
}

// 初始化系统
const system = new EnterpriseSystem();