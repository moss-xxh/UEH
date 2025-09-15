// 企业管理系统主逻辑
class EnterpriseManagementSystem {
    constructor() {
        this.currentPage = 'dashboard';
        this.sidebarCollapsed = false;
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadPage('dashboard');
        this.startRealtimeUpdates();
    }

    bindEvents() {
        // 侧边栏导航
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const page = item.dataset.page;
                this.switchPage(page);
            });
        });

        // 菜单切换
        document.querySelector('.menu-toggle')?.addEventListener('click', () => {
            this.toggleSidebar();
        });

        // 退出登录
        document.querySelector('.logout-btn')?.addEventListener('click', () => {
            if (confirm('确定要退出登录吗？')) {
                window.location.href = '../index.html';
            }
        });

        // 时间筛选
        document.querySelector('.time-filter')?.addEventListener('change', (e) => {
            this.updateDataByTimeRange(e.target.value);
        });
    }

    toggleSidebar() {
        const sidebar = document.querySelector('.sidebar');
        sidebar.classList.toggle('collapsed');
        this.sidebarCollapsed = !this.sidebarCollapsed;
    }

    switchPage(page) {
        // 更新导航状态
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.page === page) {
                item.classList.add('active');
            }
        });

        // 更新页面标题
        const titles = {
            dashboard: '数据概览',
            stations: '电站管理',
            devices: '设备管理',
            orders: '订单管理',
            users: '用户管理',
            finance: '财务统计',
            maintenance: '维护管理',
            settings: '系统设置'
        };
        document.querySelector('.page-title').textContent = titles[page] || '数据概览';

        // 加载页面内容
        this.loadPage(page);
        this.currentPage = page;
    }

    loadPage(page) {
        const content = document.getElementById('page-content');
        content.innerHTML = this.getPageContent(page);
        this.initPageComponents(page);
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
                    <div class="stat-header">
                        <span class="stat-title">总电站数</span>
                        <div class="stat-icon blue">⚡</div>
                    </div>
                    <div class="stat-value">156</div>
                    <div class="stat-change positive">
                        <span>↑</span>
                        <span>12.5% 较上月</span>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-header">
                        <span class="stat-title">在线设备</span>
                        <div class="stat-icon green">🔌</div>
                    </div>
                    <div class="stat-value">2,847</div>
                    <div class="stat-change positive">
                        <span>↑</span>
                        <span>8.3% 较昨日</span>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-header">
                        <span class="stat-title">今日订单</span>
                        <div class="stat-icon yellow">📋</div>
                    </div>
                    <div class="stat-value">1,234</div>
                    <div class="stat-change negative">
                        <span>↓</span>
                        <span>3.2% 较昨日</span>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-header">
                        <span class="stat-title">今日收入</span>
                        <div class="stat-icon purple">💰</div>
                    </div>
                    <div class="stat-value">¥89,456</div>
                    <div class="stat-change positive">
                        <span>↑</span>
                        <span>15.8% 较昨日</span>
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
                        <button class="chart-option">年</button>
                    </div>
                </div>
                <div class="chart-body">
                    <canvas id="charging-trend-chart"></canvas>
                </div>
            </div>
            
            <!-- 最近订单 -->
            <div class="data-table-container">
                <div class="table-header">
                    <h3 class="table-title">最近订单</h3>
                    <div class="table-actions">
                        <button class="btn btn-secondary">导出</button>
                        <button class="btn btn-primary">查看全部</button>
                    </div>
                </div>
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>订单编号</th>
                            <th>用户</th>
                            <th>电站</th>
                            <th>充电量(kWh)</th>
                            <th>金额</th>
                            <th>状态</th>
                            <th>时间</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>#ORD20240101</td>
                            <td>张三</td>
                            <td>北京站A区</td>
                            <td>45.5</td>
                            <td>¥68.25</td>
                            <td><span class="status-badge active">充电中</span></td>
                            <td>10:30</td>
                        </tr>
                        <tr>
                            <td>#ORD20240102</td>
                            <td>李四</td>
                            <td>上海站B区</td>
                            <td>32.8</td>
                            <td>¥49.20</td>
                            <td><span class="status-badge inactive">已完成</span></td>
                            <td>10:15</td>
                        </tr>
                        <tr>
                            <td>#ORD20240103</td>
                            <td>王五</td>
                            <td>深圳站C区</td>
                            <td>28.3</td>
                            <td>¥42.45</td>
                            <td><span class="status-badge pending">待支付</span></td>
                            <td>09:45</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `;
    }

    getStationsContent() {
        return `
            <div class="data-table-container">
                <div class="table-header">
                    <h3 class="table-title">电站列表</h3>
                    <div class="table-actions">
                        <input type="text" class="search-box" placeholder="搜索电站...">
                        <button class="btn btn-secondary">筛选</button>
                        <button class="btn btn-primary" onclick="ems.showAddStationModal()">+ 新增电站</button>
                    </div>
                </div>
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
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>#ST001</td>
                            <td>北京朝阳充电站</td>
                            <td>北京市朝阳区建国路88号</td>
                            <td>24</td>
                            <td>95.8%</td>
                            <td>¥12,456</td>
                            <td><span class="status-badge active">运营中</span></td>
                            <td>
                                <button class="btn btn-secondary" style="padding: 4px 8px; font-size: 12px;">编辑</button>
                                <button class="btn btn-secondary" style="padding: 4px 8px; font-size: 12px;">详情</button>
                            </td>
                        </tr>
                        <tr>
                            <td>#ST002</td>
                            <td>上海浦东充电站</td>
                            <td>上海市浦东新区世纪大道100号</td>
                            <td>32</td>
                            <td>92.3%</td>
                            <td>¥18,780</td>
                            <td><span class="status-badge active">运营中</span></td>
                            <td>
                                <button class="btn btn-secondary" style="padding: 4px 8px; font-size: 12px;">编辑</button>
                                <button class="btn btn-secondary" style="padding: 4px 8px; font-size: 12px;">详情</button>
                            </td>
                        </tr>
                        <tr>
                            <td>#ST003</td>
                            <td>深圳南山充电站</td>
                            <td>深圳市南山区科技园路1号</td>
                            <td>18</td>
                            <td>88.9%</td>
                            <td>¥9,234</td>
                            <td><span class="status-badge pending">维护中</span></td>
                            <td>
                                <button class="btn btn-secondary" style="padding: 4px 8px; font-size: 12px;">编辑</button>
                                <button class="btn btn-secondary" style="padding: 4px 8px; font-size: 12px;">详情</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div class="table-pagination">
                    <div class="pagination-info">显示 1-10 条，共 156 条</div>
                    <div class="pagination-controls">
                        <button class="pagination-btn" disabled>上一页</button>
                        <button class="pagination-btn active">1</button>
                        <button class="pagination-btn">2</button>
                        <button class="pagination-btn">3</button>
                        <button class="pagination-btn">...</button>
                        <button class="pagination-btn">16</button>
                        <button class="pagination-btn">下一页</button>
                    </div>
                </div>
            </div>
        `;
    }

    getDevicesContent() {
        return `
            <div class="stats-grid" style="margin-bottom: 24px;">
                <div class="stat-card">
                    <div class="stat-header">
                        <span class="stat-title">总设备数</span>
                        <div class="stat-icon blue">🔌</div>
                    </div>
                    <div class="stat-value">3,156</div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-header">
                        <span class="stat-title">在线设备</span>
                        <div class="stat-icon green">✅</div>
                    </div>
                    <div class="stat-value">2,847</div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-header">
                        <span class="stat-title">离线设备</span>
                        <div class="stat-icon yellow">⚠️</div>
                    </div>
                    <div class="stat-value">209</div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-header">
                        <span class="stat-title">故障设备</span>
                        <div class="stat-icon purple">❌</div>
                    </div>
                    <div class="stat-value">100</div>
                </div>
            </div>
            
            <div class="data-table-container">
                <div class="table-header">
                    <h3 class="table-title">设备列表</h3>
                    <div class="table-actions">
                        <input type="text" class="search-box" placeholder="搜索设备...">
                        <select class="btn btn-secondary">
                            <option>全部状态</option>
                            <option>在线</option>
                            <option>离线</option>
                            <option>故障</option>
                        </select>
                        <button class="btn btn-primary">+ 添加设备</button>
                    </div>
                </div>
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>设备编号</th>
                            <th>设备型号</th>
                            <th>所属电站</th>
                            <th>功率(kW)</th>
                            <th>今日使用率</th>
                            <th>累计充电量</th>
                            <th>状态</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>#DEV001</td>
                            <td>DC-120kW</td>
                            <td>北京朝阳充电站</td>
                            <td>120</td>
                            <td>78.5%</td>
                            <td>45,678 kWh</td>
                            <td><span class="status-badge active">在线</span></td>
                            <td>
                                <button class="btn btn-secondary" style="padding: 4px 8px; font-size: 12px;">控制</button>
                                <button class="btn btn-secondary" style="padding: 4px 8px; font-size: 12px;">详情</button>
                            </td>
                        </tr>
                        <tr>
                            <td>#DEV002</td>
                            <td>AC-7kW</td>
                            <td>上海浦东充电站</td>
                            <td>7</td>
                            <td>65.3%</td>
                            <td>12,345 kWh</td>
                            <td><span class="status-badge active">在线</span></td>
                            <td>
                                <button class="btn btn-secondary" style="padding: 4px 8px; font-size: 12px;">控制</button>
                                <button class="btn btn-secondary" style="padding: 4px 8px; font-size: 12px;">详情</button>
                            </td>
                        </tr>
                        <tr>
                            <td>#DEV003</td>
                            <td>DC-60kW</td>
                            <td>深圳南山充电站</td>
                            <td>60</td>
                            <td>0%</td>
                            <td>23,456 kWh</td>
                            <td><span class="status-badge inactive">故障</span></td>
                            <td>
                                <button class="btn btn-secondary" style="padding: 4px 8px; font-size: 12px;">维修</button>
                                <button class="btn btn-secondary" style="padding: 4px 8px; font-size: 12px;">详情</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `;
    }

    getOrdersContent() {
        return `
            <div class="stats-grid" style="margin-bottom: 24px;">
                <div class="stat-card">
                    <div class="stat-header">
                        <span class="stat-title">今日订单</span>
                        <div class="stat-icon blue">📋</div>
                    </div>
                    <div class="stat-value">1,234</div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-header">
                        <span class="stat-title">进行中</span>
                        <div class="stat-icon green">⚡</div>
                    </div>
                    <div class="stat-value">89</div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-header">
                        <span class="stat-title">已完成</span>
                        <div class="stat-icon yellow">✅</div>
                    </div>
                    <div class="stat-value">1,098</div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-header">
                        <span class="stat-title">异常订单</span>
                        <div class="stat-icon purple">⚠️</div>
                    </div>
                    <div class="stat-value">47</div>
                </div>
            </div>
            
            <div class="data-table-container">
                <div class="table-header">
                    <h3 class="table-title">订单管理</h3>
                    <div class="table-actions">
                        <input type="text" class="search-box" placeholder="订单号/用户/电站">
                        <input type="date" class="btn btn-secondary">
                        <select class="btn btn-secondary">
                            <option>全部状态</option>
                            <option>充电中</option>
                            <option>已完成</option>
                            <option>待支付</option>
                            <option>已取消</option>
                        </select>
                        <button class="btn btn-primary">导出报表</button>
                    </div>
                </div>
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>订单号</th>
                            <th>用户信息</th>
                            <th>电站/设备</th>
                            <th>开始时间</th>
                            <th>时长</th>
                            <th>充电量(kWh)</th>
                            <th>金额(元)</th>
                            <th>支付方式</th>
                            <th>状态</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>#2024010100001</td>
                            <td>张三<br><small>135****1234</small></td>
                            <td>北京朝阳站<br><small>DEV001</small></td>
                            <td>10:30:00</td>
                            <td>45分钟</td>
                            <td>45.5</td>
                            <td>68.25</td>
                            <td>微信</td>
                            <td><span class="status-badge active">充电中</span></td>
                            <td>
                                <button class="btn btn-secondary" style="padding: 4px 8px; font-size: 12px;">停止</button>
                            </td>
                        </tr>
                        <tr>
                            <td>#2024010100002</td>
                            <td>李四<br><small>138****5678</small></td>
                            <td>上海浦东站<br><small>DEV002</small></td>
                            <td>09:15:00</td>
                            <td>62分钟</td>
                            <td>32.8</td>
                            <td>49.20</td>
                            <td>支付宝</td>
                            <td><span class="status-badge inactive">已完成</span></td>
                            <td>
                                <button class="btn btn-secondary" style="padding: 4px 8px; font-size: 12px;">详情</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `;
    }

    getUsersContent() {
        return `
            <div class="stats-grid" style="margin-bottom: 24px;">
                <div class="stat-card">
                    <div class="stat-header">
                        <span class="stat-title">总用户数</span>
                        <div class="stat-icon blue">👥</div>
                    </div>
                    <div class="stat-value">45,678</div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-header">
                        <span class="stat-title">今日新增</span>
                        <div class="stat-icon green">📈</div>
                    </div>
                    <div class="stat-value">234</div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-header">
                        <span class="stat-title">活跃用户</span>
                        <div class="stat-icon yellow">⚡</div>
                    </div>
                    <div class="stat-value">12,345</div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-header">
                        <span class="stat-title">会员用户</span>
                        <div class="stat-icon purple">💎</div>
                    </div>
                    <div class="stat-value">8,901</div>
                </div>
            </div>
            
            <div class="data-table-container">
                <div class="table-header">
                    <h3 class="table-title">用户列表</h3>
                    <div class="table-actions">
                        <input type="text" class="search-box" placeholder="搜索用户...">
                        <select class="btn btn-secondary">
                            <option>全部类型</option>
                            <option>普通用户</option>
                            <option>会员用户</option>
                            <option>企业用户</option>
                        </select>
                        <button class="btn btn-primary">导出数据</button>
                    </div>
                </div>
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>用户ID</th>
                            <th>姓名</th>
                            <th>手机号</th>
                            <th>用户类型</th>
                            <th>注册时间</th>
                            <th>累计充电</th>
                            <th>累计消费</th>
                            <th>账户余额</th>
                            <th>状态</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>#U001234</td>
                            <td>张三</td>
                            <td>135****1234</td>
                            <td>会员用户</td>
                            <td>2023-06-15</td>
                            <td>1,234 kWh</td>
                            <td>¥2,456.50</td>
                            <td>¥128.00</td>
                            <td><span class="status-badge active">正常</span></td>
                            <td>
                                <button class="btn btn-secondary" style="padding: 4px 8px; font-size: 12px;">详情</button>
                            </td>
                        </tr>
                        <tr>
                            <td>#U001235</td>
                            <td>李四</td>
                            <td>138****5678</td>
                            <td>普通用户</td>
                            <td>2023-08-20</td>
                            <td>567 kWh</td>
                            <td>¥890.25</td>
                            <td>¥56.80</td>
                            <td><span class="status-badge active">正常</span></td>
                            <td>
                                <button class="btn btn-secondary" style="padding: 4px 8px; font-size: 12px;">详情</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `;
    }

    getFinanceContent() {
        return `
            <div class="stats-grid" style="margin-bottom: 24px;">
                <div class="stat-card">
                    <div class="stat-header">
                        <span class="stat-title">今日收入</span>
                        <div class="stat-icon blue">💰</div>
                    </div>
                    <div class="stat-value">¥89,456</div>
                    <div class="stat-change positive">
                        <span>↑</span>
                        <span>15.8% 较昨日</span>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-header">
                        <span class="stat-title">本月收入</span>
                        <div class="stat-icon green">📈</div>
                    </div>
                    <div class="stat-value">¥2.35M</div>
                    <div class="stat-change positive">
                        <span>↑</span>
                        <span>12.3% 较上月</span>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-header">
                        <span class="stat-title">待结算</span>
                        <div class="stat-icon yellow">⏰</div>
                    </div>
                    <div class="stat-value">¥45,678</div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-header">
                        <span class="stat-title">退款金额</span>
                        <div class="stat-icon purple">↩️</div>
                    </div>
                    <div class="stat-value">¥3,456</div>
                </div>
            </div>
            
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
                    <canvas id="revenue-chart"></canvas>
                </div>
            </div>
            
            <div class="data-table-container">
                <div class="table-header">
                    <h3 class="table-title">财务明细</h3>
                    <div class="table-actions">
                        <input type="date" class="btn btn-secondary">
                        <select class="btn btn-secondary">
                            <option>全部类型</option>
                            <option>充电收入</option>
                            <option>服务费</option>
                            <option>退款</option>
                        </select>
                        <button class="btn btn-primary">导出报表</button>
                    </div>
                </div>
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
                            <td>#FIN20240101001</td>
                            <td>2024-01-01 10:30</td>
                            <td>充电收入</td>
                            <td>#2024010100001</td>
                            <td>+¥68.25</td>
                            <td>微信支付</td>
                            <td><span class="status-badge active">已到账</span></td>
                        </tr>
                        <tr>
                            <td>#FIN20240101002</td>
                            <td>2024-01-01 09:15</td>
                            <td>充电收入</td>
                            <td>#2024010100002</td>
                            <td>+¥49.20</td>
                            <td>支付宝</td>
                            <td><span class="status-badge active">已到账</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `;
    }

    getMaintenanceContent() {
        return `
            <div class="stats-grid" style="margin-bottom: 24px;">
                <div class="stat-card">
                    <div class="stat-header">
                        <span class="stat-title">待维护</span>
                        <div class="stat-icon blue">🔧</div>
                    </div>
                    <div class="stat-value">23</div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-header">
                        <span class="stat-title">维护中</span>
                        <div class="stat-icon green">🔨</div>
                    </div>
                    <div class="stat-value">8</div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-header">
                        <span class="stat-title">本月完成</span>
                        <div class="stat-icon yellow">✅</div>
                    </div>
                    <div class="stat-value">156</div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-header">
                        <span class="stat-title">紧急故障</span>
                        <div class="stat-icon purple">🚨</div>
                    </div>
                    <div class="stat-value">3</div>
                </div>
            </div>
            
            <div class="data-table-container">
                <div class="table-header">
                    <h3 class="table-title">维护工单</h3>
                    <div class="table-actions">
                        <input type="text" class="search-box" placeholder="搜索工单...">
                        <select class="btn btn-secondary">
                            <option>全部状态</option>
                            <option>待处理</option>
                            <option>处理中</option>
                            <option>已完成</option>
                        </select>
                        <button class="btn btn-primary">+ 创建工单</button>
                    </div>
                </div>
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
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>#WO20240101</td>
                            <td>DEV003</td>
                            <td>深圳南山站</td>
                            <td>充电枪故障</td>
                            <td><span style="color: #EF4444;">紧急</span></td>
                            <td>王工</td>
                            <td>2024-01-01 08:00</td>
                            <td><span class="status-badge pending">处理中</span></td>
                            <td>
                                <button class="btn btn-secondary" style="padding: 4px 8px; font-size: 12px;">详情</button>
                            </td>
                        </tr>
                        <tr>
                            <td>#WO20240102</td>
                            <td>DEV015</td>
                            <td>北京朝阳站</td>
                            <td>通信异常</td>
                            <td><span style="color: #F59E0B;">普通</span></td>
                            <td>李工</td>
                            <td>2024-01-01 09:30</td>
                            <td><span class="status-badge inactive">待处理</span></td>
                            <td>
                                <button class="btn btn-secondary" style="padding: 4px 8px; font-size: 12px;">分配</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `;
    }

    getSettingsContent() {
        return `
            <div style="display: grid; grid-template-columns: 250px 1fr; gap: 24px;">
                <div style="background: white; border-radius: 12px; padding: 24px; border: 1px solid #E5E7EB;">
                    <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 16px;">设置项</h3>
                    <nav>
                        <a href="#" class="settings-nav-item active">基本信息</a>
                        <a href="#" class="settings-nav-item">充电费率</a>
                        <a href="#" class="settings-nav-item">支付配置</a>
                        <a href="#" class="settings-nav-item">通知设置</a>
                        <a href="#" class="settings-nav-item">权限管理</a>
                        <a href="#" class="settings-nav-item">系统日志</a>
                        <a href="#" class="settings-nav-item">数据备份</a>
                    </nav>
                </div>
                
                <div style="background: white; border-radius: 12px; padding: 32px; border: 1px solid #E5E7EB;">
                    <h3 style="font-size: 20px; font-weight: 600; margin-bottom: 24px;">基本信息</h3>
                    
                    <form class="settings-form">
                        <div class="form-group">
                            <label>企业名称</label>
                            <input type="text" class="form-input" value="新能源充电科技有限公司">
                        </div>
                        
                        <div class="form-group">
                            <label>企业代码</label>
                            <input type="text" class="form-input" value="ENT20230001" readonly>
                        </div>
                        
                        <div class="form-group">
                            <label>联系电话</label>
                            <input type="tel" class="form-input" value="400-888-8888">
                        </div>
                        
                        <div class="form-group">
                            <label>企业地址</label>
                            <input type="text" class="form-input" value="北京市朝阳区建国路88号">
                        </div>
                        
                        <div class="form-group">
                            <label>营业时间</label>
                            <div style="display: flex; gap: 12px;">
                                <input type="time" class="form-input" value="00:00">
                                <span style="align-self: center;">至</span>
                                <input type="time" class="form-input" value="23:59">
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label>服务费率</label>
                            <div style="display: flex; gap: 8px; align-items: center;">
                                <input type="number" class="form-input" value="0.8" step="0.1" style="width: 100px;">
                                <span>元/kWh</span>
                            </div>
                        </div>
                        
                        <div style="display: flex; gap: 12px; margin-top: 32px;">
                            <button type="submit" class="btn btn-primary">保存设置</button>
                            <button type="button" class="btn btn-secondary">取消</button>
                        </div>
                    </form>
                </div>
            </div>
            
            <style>
                .settings-nav-item {
                    display: block;
                    padding: 10px 16px;
                    color: #6B7280;
                    text-decoration: none;
                    border-radius: 6px;
                    margin-bottom: 4px;
                    transition: all 0.2s ease;
                }
                
                .settings-nav-item:hover {
                    background: #F3F4F6;
                    color: #1A1A1A;
                }
                
                .settings-nav-item.active {
                    background: #F0F9FF;
                    color: #0EA5E9;
                    font-weight: 500;
                }
                
                .settings-form {
                    max-width: 600px;
                }
                
                .form-group {
                    margin-bottom: 20px;
                }
                
                .form-group label {
                    display: block;
                    margin-bottom: 8px;
                    font-size: 14px;
                    font-weight: 500;
                    color: #374151;
                }
                
                .form-input {
                    width: 100%;
                    padding: 10px 12px;
                    border: 1px solid #E5E7EB;
                    border-radius: 8px;
                    font-size: 14px;
                    transition: all 0.2s ease;
                }
                
                .form-input:focus {
                    outline: none;
                    border-color: #0EA5E9;
                    box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
                }
                
                .form-input[readonly] {
                    background: #F9FAFB;
                    cursor: not-allowed;
                }
            </style>
        `;
    }

    initPageComponents(page) {
        // 初始化图表
        if (page === 'dashboard' || page === 'finance') {
            this.initCharts();
        }
        
        // 绑定页面特定事件
        this.bindPageEvents(page);
    }

    initCharts() {
        // 这里可以集成 Chart.js 或其他图表库
        const chartCanvas = document.getElementById('charging-trend-chart') || document.getElementById('revenue-chart');
        if (chartCanvas) {
            // 模拟图表初始化
            chartCanvas.style.width = '100%';
            chartCanvas.style.height = '300px';
            
            // 如果需要真实图表，可以集成 Chart.js：
            // new Chart(chartCanvas, { ... });
        }
    }

    bindPageEvents(page) {
        // 绑定搜索框事件
        document.querySelectorAll('.search-box').forEach(input => {
            input.addEventListener('input', (e) => {
                this.handleSearch(e.target.value, page);
            });
        });
        
        // 绑定筛选器事件
        document.querySelectorAll('.chart-option').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.chart-option').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.updateChartData(e.target.textContent);
            });
        });
        
        // 绑定分页事件
        document.querySelectorAll('.pagination-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (!e.target.disabled) {
                    this.handlePagination(e.target.textContent);
                }
            });
        });
    }

    handleSearch(query, page) {
        console.log(`搜索: ${query} 在页面: ${page}`);
        // 实现搜索逻辑
    }

    updateChartData(timeRange) {
        console.log(`更新图表数据: ${timeRange}`);
        // 实现图表数据更新
    }

    handlePagination(action) {
        console.log(`分页操作: ${action}`);
        // 实现分页逻辑
    }

    updateDataByTimeRange(range) {
        console.log(`按时间范围更新数据: ${range}`);
        // 实现数据更新逻辑
        this.loadPage(this.currentPage);
    }

    showAddStationModal() {
        // 显示添加电站弹窗
        alert('添加电站功能 - 可以在这里实现弹窗表单');
    }

    startRealtimeUpdates() {
        // 模拟实时数据更新
        setInterval(() => {
            if (this.currentPage === 'dashboard') {
                // 更新统计数据
                this.updateDashboardStats();
            }
        }, 30000); // 每30秒更新一次
    }

    updateDashboardStats() {
        // 实现实时数据更新逻辑
        console.log('更新仪表板数据');
    }
}

// 初始化系统
const ems = new EnterpriseManagementSystem();