// 企业管理系统 - 增强版（优化页面切换流畅度）
class EnterpriseSystem {
    constructor() {
        this.currentPage = 'dashboard';
        this.pageCache = {}; // 页面内容缓存
        this.pageInstances = {}; // 页面实例缓存
        this.isTransitioning = false; // 防止重复切换
        this.stationViewMode = 'table'; // 电站视图模式: table 或 visual
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadPage('dashboard');
        // 预加载其他页面
        this.preloadPages();
    }

    bindEvents() {
        // 导航菜单事件 - 使用事件委托优化性能
        document.querySelector('.nav-menu').addEventListener('click', (e) => {
            const link = e.target.closest('.nav-link');
            if (!link || link.classList.contains('exit')) return;
            
            e.preventDefault();
            const page = link.dataset.page;
            
            // 防止重复点击同一页面
            if (page === this.currentPage || this.isTransitioning) return;
            
            this.switchPage(page);
        });

        // 添加键盘快捷键支持
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                const keyMap = {
                    '1': 'dashboard',
                    '2': 'stations',
                    '3': 'devices',
                    '4': 'orders',
                    '5': 'users',
                    '6': 'finance',
                    '7': 'maintenance',
                    '8': 'settings'
                };
                if (keyMap[e.key]) {
                    e.preventDefault();
                    this.switchPage(keyMap[e.key]);
                }
            }
        });
    }

    async switchPage(page) {
        if (this.isTransitioning) return;
        this.isTransitioning = true;

        // 更新导航状态 - 立即响应
        this.updateNavigation(page);

        // 更新页面标题 - 立即响应
        this.updatePageHeader(page);

        // 执行页面切换
        await this.performPageTransition(page);

        this.currentPage = page;
        this.isTransitioning = false;
    }

    updateNavigation(page) {
        // 使用 requestAnimationFrame 优化性能
        requestAnimationFrame(() => {
            document.querySelectorAll('.nav-link').forEach(link => {
                if (link.dataset.page === page) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
        });
    }

    updatePageHeader(page) {
        const titles = {
            dashboard: ['数据概览', '实时监控充电站运营状态'],
            stations: ['', ''],
            devices: ['设备管理', '充电设备状态与控制中心'],
            orders: ['订单管理', '订单处理与交易记录'],
            users: ['用户管理', '用户信息与服务管理'],
            finance: ['财务统计', '收入分析与财务报表'],
            maintenance: ['维护管理', '设备维护与故障处理'],
            settings: ['系统设置', '配置系统参数与权限']
        };

        const [title, subtitle] = titles[page] || titles.dashboard;
        
        requestAnimationFrame(() => {
            const titleEl = document.querySelector('.page-title');
            const subtitleEl = document.querySelector('.page-subtitle');
            const headerEl = document.querySelector('.page-header');
            
            // 添加渐变效果
            titleEl.style.opacity = '0';
            subtitleEl.style.opacity = '0';
            
            setTimeout(() => {
                if (page === 'stations') {
                    // 电站管理页面隐藏整个header
                    if (headerEl) {
                        headerEl.style.display = 'none';
                    }
                } else {
                    // 其他页面显示header
                    if (headerEl) {
                        headerEl.style.display = 'block';
                    }
                    titleEl.textContent = title;
                    if (subtitle) {
                        subtitleEl.textContent = subtitle;
                        subtitleEl.style.display = 'block';
                    } else {
                        subtitleEl.style.display = 'none';
                    }
                }
                titleEl.style.opacity = '1';
                subtitleEl.style.opacity = '1';
            }, 150);
        });
    }

    async performPageTransition(page) {
        const content = document.getElementById('page-content');
        
        // 淡出当前内容
        content.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
        content.style.opacity = '0';
        content.style.transform = 'translateY(10px)';

        // 销毁当前页面实例
        if (this.pageInstances[this.currentPage]) {
            this.pageInstances[this.currentPage].destroy();
        }

        await new Promise(resolve => setTimeout(resolve, 200));

        // 获取新页面内容
        let pageContent;
        if (this.pageCache[page]) {
            pageContent = this.pageCache[page];
        } else {
            pageContent = await this.getPageContent(page);
            this.pageCache[page] = pageContent;
        }

        // 更新内容
        content.innerHTML = pageContent;

        // 淡入新内容
        requestAnimationFrame(() => {
            content.style.opacity = '1';
            content.style.transform = 'translateY(0)';
            
            // 初始化页面功能
            this.initPageFeatures(page);
        });
    }

    async loadPage(page) {
        const content = document.getElementById('page-content');
        const pageContent = await this.getPageContent(page);
        
        // 添加初始动画
        content.style.opacity = '0';
        content.innerHTML = pageContent;
        
        requestAnimationFrame(() => {
            content.style.transition = 'opacity 0.3s ease';
            content.style.opacity = '1';
            this.initPageFeatures(page);
        });

        this.currentPage = page;
    }

    preloadPages() {
        // 延迟预加载其他页面内容
        setTimeout(async () => {
            const pages = ['stations', 'devices', 'orders', 'users', 'finance', 'maintenance', 'settings'];
            for (const page of pages) {
                if (!this.pageCache[page]) {
                    try {
                        this.pageCache[page] = await this.getPageContent(page);
                    } catch (error) {
                        console.warn(`预加载页面 ${page} 失败:`, error);
                    }
                }
            }
        }, 1000);
    }

    async getPageContent(page) {
        try {
            const response = await fetch(`pages/${page}.html`);
            if (response.ok) {
                return await response.text();
            } else {
                console.warn(`页面 ${page}.html 不存在，使用默认内容`);
                return this.getFallbackContent(page);
            }
        } catch (error) {
            console.error(`加载页面 ${page}.html 失败:`, error);
            return this.getFallbackContent(page);
        }
    }

    getFallbackContent(page) {
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
            <div class="stats-grid animated-entrance">
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
            <div class="station-status-container animated-entrance">
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
            <div class="multi-analysis-grid animated-entrance">
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
            <div class="chart-container animated-entrance">
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
            <div class="data-section animated-entrance">
                <div class="section-header">
                    <h2 class="section-title">最近订单</h2>
                    <div class="section-actions">
                        <button class="btn" onclick="system.switchPage('orders')">查看全部 →</button>
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
        // 获取存储的电站数据或使用默认数据
        if (!this.stationsData) {
            this.stationsData = [
                { id: 'ST001', name: '北京朝阳充电站', address: '北京市朝阳区建国路88号', devices: 24, onlineRate: 95.8, revenue: 12456, status: 'active', operationStatus: 'operating' },
                { id: 'ST002', name: '上海浦东充电站', address: '上海市浦东新区世纪大道100号', devices: 32, onlineRate: 92.3, revenue: 18780, status: 'active', operationStatus: 'operating' },
                { id: 'ST003', name: '深圳南山充电站', address: '深圳市南山区科技园路1号', devices: 18, onlineRate: 88.9, revenue: 9234, status: 'maintenance', operationStatus: 'closed' },
                { id: 'ST004', name: '广州天河充电站', address: '广州市天河区珠江新城', devices: 28, onlineRate: 94.2, revenue: 15678, status: 'active', operationStatus: 'operating' }
            ];
        }

        const stationRows = this.stationsData.map(station => {
            const inUse = this.getInUseCount(station);
            const idle = station.devices - inUse;
            const usageRate = station.devices > 0 ? ((inUse / station.devices) * 100).toFixed(1) : 0;
            
            return `
            <tr>
                <td>${station.name}</td>
                <td>${station.address}</td>
                <td>${station.devices}</td>
                <td>${usageRate}%</td>
                <td>${idle}</td>
                <td>${inUse}</td>
                <td>¥${station.revenue.toLocaleString()}</td>
                <td>${this.getStationStatusBadge(station.status, station.operationStatus)}</td>
                <td>
                    <button class="btn-text" onclick="system.viewStation('${station.id}')">查看</button>
                    <button class="btn-text" onclick="system.editStation('${station.id}')">编辑</button>
                    <button class="btn-text danger" onclick="system.deleteStation('${station.id}')">删除</button>
                </td>
            </tr>
            `;
        }).join('');

        return `
            <div class="data-section animated-entrance">
                <div class="section-header">
                    <h2 class="section-title">电站列表</h2>
                    <div class="section-actions">
                        <div style="display: flex; gap: 8px; align-items: center; margin-right: 12px;">
                            <button class="view-mode-btn ${this.stationViewMode === 'table' ? 'active' : ''}" 
                                onclick="system.switchStationView('table')" 
                                style="
                                    padding: 6px 12px;
                                    background: ${this.stationViewMode === 'table' ? '#000' : '#FFF'};
                                    color: ${this.stationViewMode === 'table' ? '#FFF' : '#666'};
                                    border: 1px solid ${this.stationViewMode === 'table' ? '#000' : '#E5E5E5'};
                                    border-radius: 4px;
                                    cursor: pointer;
                                    font-size: 13px;
                                    transition: all 0.3s ease;
                                ">
                                📋 表格
                            </button>
                            <button class="view-mode-btn ${this.stationViewMode === 'visual' ? 'active' : ''}" 
                                onclick="system.switchStationView('visual')" 
                                style="
                                    padding: 6px 12px;
                                    background: ${this.stationViewMode === 'visual' ? '#000' : '#FFF'};
                                    color: ${this.stationViewMode === 'visual' ? '#FFF' : '#666'};
                                    border: 1px solid ${this.stationViewMode === 'visual' ? '#000' : '#E5E5E5'};
                                    border-radius: 4px;
                                    cursor: pointer;
                                    font-size: 13px;
                                    transition: all 0.3s ease;
                                ">
                                🗺️ 视图
                            </button>
                        </div>
                        <input type="text" class="search-box" id="station-search" placeholder="搜索电站...">
                        <button class="btn btn-primary" onclick="system.showAddStationModal()">+ 新增电站</button>
                    </div>
                </div>
                
                ${this.stationViewMode === 'visual' ? this.getStationVisualView() : ''}
                
                <div class="minimal-table" style="${this.stationViewMode === 'visual' ? 'display: none;' : ''}"
                    <div class="table-wrapper">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>电站名称</th>
                                    <th>地址</th>
                                    <th style="cursor: pointer;" onclick="system.sortStations('devices')">
                                        充电桩数 <span id="sort-devices" style="margin-left: 6px; display: inline-block; width: 12px; height: 12px;">
                                            <svg width="12" height="12" viewBox="0 0 12 12" style="vertical-align: middle;">
                                                <polyline points="4,3 6,1 8,3" fill="none" stroke="#ccc" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/>
                                                <polyline points="4,9 6,11 8,9" fill="none" stroke="#ccc" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/>
                                            </svg>
                                        </span>
                                    </th>
                                    <th style="cursor: pointer;" onclick="system.sortStations('usageRate')">
                                        使用率 <span id="sort-usageRate" style="margin-left: 6px; display: inline-block; width: 12px; height: 12px;">
                                            <svg width="12" height="12" viewBox="0 0 12 12" style="vertical-align: middle;">
                                                <polyline points="4,3 6,1 8,3" fill="none" stroke="#ccc" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/>
                                                <polyline points="4,9 6,11 8,9" fill="none" stroke="#ccc" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/>
                                            </svg>
                                        </span>
                                    </th>
                                    <th style="cursor: pointer;" onclick="system.sortStations('idle')">
                                        空闲 <span id="sort-idle" style="margin-left: 6px; display: inline-block; width: 12px; height: 12px;">
                                            <svg width="12" height="12" viewBox="0 0 12 12" style="vertical-align: middle;">
                                                <polyline points="4,3 6,1 8,3" fill="none" stroke="#ccc" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/>
                                                <polyline points="4,9 6,11 8,9" fill="none" stroke="#ccc" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/>
                                            </svg>
                                        </span>
                                    </th>
                                    <th style="cursor: pointer;" onclick="system.sortStations('inUse')">
                                        使用中 <span id="sort-inUse" style="margin-left: 6px; display: inline-block; width: 12px; height: 12px;">
                                            <svg width="12" height="12" viewBox="0 0 12 12" style="vertical-align: middle;">
                                                <polyline points="4,3 6,1 8,3" fill="none" stroke="#ccc" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/>
                                                <polyline points="4,9 6,11 8,9" fill="none" stroke="#ccc" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/>
                                            </svg>
                                        </span>
                                    </th>
                                    <th>今日收入</th>
                                    <th>状态</th>
                                    <th>操作</th>
                                </tr>
                            </thead>
                            <tbody id="stations-tbody">
                                ${stationRows}
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

    getStationStatusBadge(status, operationStatus = 'operating') {
        // 如果有运营状态，优先显示运营状态
        if (operationStatus) {
            const operationStatusMap = {
                operating: '<span class="status active">营业</span>',
                closed: '<span class="status inactive">未营业</span>'
            };
            return operationStatusMap[operationStatus] || operationStatusMap.operating;
        }
        
        // 兼容旧的状态系统
        const statusMap = {
            active: '<span class="status active">运营中</span>',
            maintenance: '<span class="status pending">维护中</span>',
            offline: '<span class="status inactive">离线</span>'
        };
        return statusMap[status] || statusMap.active;
    }

    getDevicesContent() {
        return `
            <!-- 设备统计 -->
            <div class="stats-grid animated-entrance">
                <div class="stat-card">
                    <div class="stat-label">总充电枪数</div>
                    <div class="stat-value">10</div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-label">空闲</div>
                    <div class="stat-value">2</div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-label">插枪未充电</div>
                    <div class="stat-value">0</div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-label">插枪充电中</div>
                    <div class="stat-value">8</div>
                </div>

                <div class="stat-card">
                    <div class="stat-label">故障</div>
                    <div class="stat-value">0</div>
                </div>

                <div class="stat-card">
                    <div class="stat-label">今日收入</div>
                    <div class="stat-value">¥45,680</div>
                </div>
            </div>

            <!-- 实时监控 -->
            <div class="data-section animated-entrance" style="animation-delay: 0.1s;">
                <div class="section-header">
                    <h2 class="section-title">实时监控</h2>
                    <div class="section-actions">
                        <select class="form-select" id="station-filter">
                            <option value="">全部电站</option>
                            <option value="ST001">北京朝阳充电站</option>
                            <option value="ST002">上海浦东充电站</option>
                            <option value="ST003">深圳南山充电站</option>
                            <option value="ST004">广州天河充电站</option>
                        </select>
                        <select class="form-select" id="status-filter">
                            <option value="">全部状态</option>
                            <option value="online">在线</option>
                            <option value="charging">充电中</option>
                            <option value="idle">空闲</option>
                            <option value="fault">故障</option>
                            <option value="maintenance">维护</option>
                        </select>
                        <select class="form-select" id="type-filter">
                            <option value="">全部类型</option>
                            <option value="slow">慢充</option>
                            <option value="fast">快充</option>
                            <option value="super">超充</option>
                        </select>
                        <button class="btn btn-secondary" onclick="system.refreshDeviceData()">刷新</button>
                        <button class="btn btn-primary" onclick="system.showAddDeviceModal()">+ 添加设备</button>
                    </div>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 40px;">
                    <div class="analysis-card">
                        <h3>充电枪状态分布</h3>
                        <div class="ranking-list">
                            <div class="ranking-item">
                                <span class="rank-label">插枪充电中</span>
                                <span class="rank-value">8枪 (80%)</span>
                                <div class="rank-bar-container">
                                    <div class="rank-bar" style="width: 80%; background: #52C41A;"></div>
                                </div>
                            </div>
                            <div class="ranking-item">
                                <span class="rank-label">空闲</span>
                                <span class="rank-value">2枪 (20%)</span>
                                <div class="rank-bar-container">
                                    <div class="rank-bar" style="width: 20%; background: #1890FF;"></div>
                                </div>
                            </div>
                            <div class="ranking-item">
                                <span class="rank-label">插枪未充电</span>
                                <span class="rank-value">0枪 (0%)</span>
                                <div class="rank-bar-container">
                                    <div class="rank-bar" style="width: 0%; background: #FAAD14;"></div>
                                </div>
                            </div>
                            <div class="ranking-item">
                                <span class="rank-label">故障</span>
                                <span class="rank-value">0枪 (0%)</span>
                                <div class="rank-bar-container">
                                    <div class="rank-bar" style="width: 0%; background: #FF4D4F;"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="analysis-card">
                        <h3>实时告警</h3>
                        <div class="alert-list">
                            <div style="display: flex; align-items: center; padding: 12px 0; border-bottom: 1px solid #f0f0f0;">
                                <span style="width: 8px; height: 8px; background: #FF4D4F; border-radius: 50%; margin-right: 12px;"></span>
                                <div style="flex: 1;">
                                    <div style="font-weight: 500; margin-bottom: 4px;">DEV003 通信故障</div>
                                    <div style="font-size: 12px; color: #999;">深圳南山充电站 · 2分钟前</div>
                                </div>
                            </div>
                            <div style="display: flex; align-items: center; padding: 12px 0; border-bottom: 1px solid #f0f0f0;">
                                <span style="width: 8px; height: 8px; background: #FAAD14; border-radius: 50%; margin-right: 12px;"></span>
                                <div style="flex: 1;">
                                    <div style="font-weight: 500; margin-bottom: 4px;">DEV015 温度过高</div>
                                    <div style="font-size: 12px; color: #999;">北京朝阳充电站 · 5分钟前</div>
                                </div>
                            </div>
                            <div style="display: flex; align-items: center; padding: 12px 0;">
                                <span style="width: 8px; height: 8px; background: #1890FF; border-radius: 50%; margin-right: 12px;"></span>
                                <div style="flex: 1;">
                                    <div style="font-weight: 500; margin-birth: 4px;">DEV032 维护提醒</div>
                                    <div style="font-size: 12px; color: #999;">上海浦东充电站 · 10分钟前</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 设备列表 -->
            <div class="data-section animated-entrance" style="animation-delay: 0.2s;">
                <div class="section-header">
                    <h2 class="section-title">设备列表</h2>
                    <div class="section-actions">
                        <input type="text" class="search-box" placeholder="搜索设备..." id="device-search">
                        <button class="btn" onclick="system.exportDeviceData()">导出数据</button>
                        <button class="btn" onclick="system.showBatchActions()">批量操作</button>
                        <button class="btn btn-primary" onclick="system.showAddDeviceModal()">+ 添加设备</button>
                    </div>
                </div>
                
                <div class="minimal-table">
                    <div class="table-wrapper">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>充电枪编号</th>
                                    <th>充电桩状态</th>
                                    <th>实时充电量(kWh)</th>
                                    <th>充电时长(时)</th>
                                    <th>设备编号</th>
                                    <th>充电站</th>
                                    <th>操作</th>
                                </tr>
                            </thead>
                            <tbody id="devices-tbody">
                                ${this.getDeviceRows()}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    }

    // 生成设备数据行
    getDeviceRows() {
        const devicesData = [
            { 
                id: 'DEV001', model: 'Tesla V3 Supercharger', station: '北京朝阳充电站', stationId: 'ST001',
                power: 250, gunCount: 2, currentPower: 185, status: 'charging', 
                voltage: 480, current: 385, gunsInUse: 2, gunsIdle: 0
            },
            { 
                id: 'DEV002', model: 'ABB Terra 184', station: '上海浦东充电站', stationId: 'ST002',
                power: 180, gunCount: 2, currentPower: 125, status: 'charging', 
                voltage: 400, current: 312, gunsInUse: 2, gunsIdle: 0
            },
            { 
                id: 'DEV003', model: 'ChargePoint Express 250', station: '深圳南山充电站', stationId: 'ST003',
                power: 250, gunCount: 4, currentPower: 220, status: 'charging', 
                voltage: 480, current: 458, gunsInUse: 4, gunsIdle: 0
            },
            { 
                id: 'DEV004', model: 'EVBox Troniq 100', station: '广州天河充电站', stationId: 'ST004',
                power: 100, gunCount: 2, currentPower: 0, status: 'idle', 
                voltage: 400, current: 0, gunsInUse: 0, gunsIdle: 2
            }
        ];

        const allGuns = [];
        
        // 为每个设备的每个充电枪创建单独的行
        devicesData.forEach(device => {
            for (let gunIndex = 1; gunIndex <= device.gunCount; gunIndex++) {
                // 模拟每个枪的状态和参数
                let gunStatus, gunPower, gunVoltage, gunCurrent;
                
                if (device.status === 'fault') {
                    gunStatus = 'fault';
                    gunPower = 0;
                    gunVoltage = 0;
                    gunCurrent = 0;
                } else if (device.status === 'charging') {
                    // 根据设备的使用情况分配枪的状态
                    if (gunIndex <= device.gunsInUse) {
                        gunStatus = 'charging';
                        gunPower = Math.floor(device.currentPower / device.gunsInUse);
                        gunVoltage = device.voltage;
                        gunCurrent = Math.floor(device.current / device.gunsInUse);
                    } else {
                        gunStatus = 'plugged_not_charging';
                        gunPower = 0;
                        gunVoltage = device.voltage;
                        gunCurrent = 0;
                    }
                } else {
                    // 设备状态为 idle
                    gunStatus = 'idle';
                    gunPower = 0;
                    gunVoltage = device.voltage;
                    gunCurrent = 0;
                }
                
                allGuns.push({
                    deviceId: device.id,
                    gunNumber: gunIndex,
                    gunId: `${device.id}-G${gunIndex}`,
                    model: device.model,
                    station: device.station,
                    maxPower: Math.floor(device.power / device.gunCount), // 平均分配最大功率
                    status: gunStatus,
                    currentPower: gunPower,
                    voltage: gunVoltage,
                    current: gunCurrent,
                    isFirstGun: gunIndex === 1 // 用于判断是否显示设备操作按钮
                });
            }
        });
        
        // 按设备分组生成表格行
        const deviceGroups = {};
        allGuns.forEach(gun => {
            if (!deviceGroups[gun.deviceId]) {
                deviceGroups[gun.deviceId] = [];
            }
            deviceGroups[gun.deviceId].push(gun);
        });
        
        let tableRows = '';
        
        Object.keys(deviceGroups).forEach(deviceId => {
            const guns = deviceGroups[deviceId];
            const gunCount = guns.length;
            
            guns.forEach((gun, index) => {
                // 计算充电时长（模拟数据，以小时为单位）
                let chargingDuration = '';
                if (gun.status === 'charging') {
                    const randomHours = (Math.random() * 3 + 0.1).toFixed(1); // 0.1-3.1小时
                    chargingDuration = randomHours;
                } else {
                    chargingDuration = '0';
                }
                
                // 计算实时充电量（模拟数据，基于功率和时长）
                let realtimeEnergy = '';
                if (gun.status === 'charging' && gun.currentPower > 0) {
                    const energy = (gun.currentPower * parseFloat(chargingDuration)).toFixed(1);
                    realtimeEnergy = energy;
                } else {
                    realtimeEnergy = '0';
                }
                
                tableRows += `
                    <tr>
                        <td>${gun.gunId}</td>
                        <td>${this.getGunStatusBadge(gun.status)}</td>
                        <td>${realtimeEnergy}</td>
                        <td>${chargingDuration}</td>
                        ${index === 0 ? `<td rowspan="${gunCount}">${gun.deviceId}</td>` : ''}
                        ${index === 0 ? `<td rowspan="${gunCount}">${gun.station}</td>` : ''}
                        ${index === 0 ? `<td rowspan="${gunCount}">
                            <button class="btn-text" onclick="system.showDeviceDetail('${gun.deviceId}')">详情</button>
                            <button class="btn-text" onclick="system.controlDevice('${gun.deviceId}')">控制</button>
                        </td>` : ''}
                    </tr>
                `;
            });
        });
        
        return tableRows;
    }

    // 获取设备状态徽章
    getDeviceStatusBadge(status) {
        const statusMap = {
            'charging': '<span class="status active">充电中</span>',
            'idle': '<span class="status pending">空闲</span>',
            'fault': '<span class="status inactive">故障</span>',
            'maintenance': '<span class="status warning">维护中</span>',
            'offline': '<span class="status inactive">离线</span>'
        };
        return statusMap[status] || statusMap.idle;
    }

    // 获取充电枪状态徽章
    getGunStatusBadge(status) {
        const statusMap = {
            'idle': '<span class="status pending">空闲</span>',
            'plugged_not_charging': '<span class="status warning">插枪未充电</span>',
            'charging': '<span class="status active">插枪充电中</span>',
            'fault': '<span class="status inactive">故障</span>'
        };
        return statusMap[status] || statusMap.idle;
    }


    // 设备管理相关方法
    refreshDeviceMonitoring() {
        this.showToast('设备监控数据已刷新', 'info');
        // 这里可以添加实际的数据刷新逻辑
    }

    exportDeviceData() {
        this.showToast('设备数据导出中...', 'info');
        // 模拟导出过程
        setTimeout(() => {
            this.showToast('设备数据导出完成', 'success');
        }, 2000);
    }

    showBatchActions() {
        const selectedDevices = document.querySelectorAll('#devices-tbody input[type="checkbox"]:checked');
        if (selectedDevices.length === 0) {
            this.showToast('请先选择设备', 'warning');
            return;
        }
        
        const modal = document.createElement('div');
        modal.className = 'device-batch-modal';
        modal.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0, 0, 0, 0.5); display: flex; justify-content: center; align-items: center; z-index: 10000;
        `;
        modal.innerHTML = `
            <div class="modal-content" style="background: white; border-radius: 8px; max-width: 400px; width: 90%; position: relative;">
                <div class="modal-header" style="padding: 20px 24px 16px; border-bottom: 1px solid #f0f0f0;">
                    <h3 style="margin: 0;">批量操作 (${selectedDevices.length}台设备)</h3>
                    <button class="modal-close" onclick="this.closest('.device-batch-modal').remove()" style="position: absolute; top: 16px; right: 20px; background: none; border: none; font-size: 20px; cursor: pointer;">×</button>
                </div>
                <div class="modal-body" style="padding: 20px 24px;">
                    <div style="margin-bottom: 16px;">
                        <button class="btn" onclick="system.batchControlDevices('start')" style="width: 100%; margin-bottom: 8px;">启动充电</button>
                        <button class="btn" onclick="system.batchControlDevices('stop')" style="width: 100%; margin-bottom: 8px;">停止充电</button>
                        <button class="btn" onclick="system.batchControlDevices('restart')" style="width: 100%; margin-bottom: 8px;">重启设备</button>
                        <button class="btn" onclick="system.batchControlDevices('maintenance')" style="width: 100%; background: #FAAD14; color: white;">进入维护模式</button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    batchControlDevices(action) {
        const selectedDevices = document.querySelectorAll('#devices-tbody input[type="checkbox"]:checked');
        const actionNames = {
            'start': '启动充电',
            'stop': '停止充电', 
            'restart': '重启设备',
            'maintenance': '进入维护模式'
        };
        
        this.showToast(`正在对 ${selectedDevices.length} 台设备执行${actionNames[action]}...`, 'info');
        document.querySelector('.device-batch-modal').remove();
        
        // 模拟批量操作
        setTimeout(() => {
            this.showToast(`${actionNames[action]}操作完成`, 'success');
        }, 2000);
    }

    showAddDeviceModal() {
        const modal = document.createElement('div');
        modal.className = 'device-modal';
        modal.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0, 0, 0, 0.5); display: flex; justify-content: center; align-items: center; z-index: 10000;
        `;
        modal.innerHTML = `
            <div class="modal-content" style="background: white; border-radius: 8px; max-width: 600px; width: 90%; max-height: 80vh; overflow-y: auto;">
                <div class="modal-header" style="padding: 20px 24px 16px; border-bottom: 1px solid #f0f0f0;">
                    <h3 style="margin: 0;">添加新设备</h3>
                    <button class="modal-close" onclick="this.closest('.device-modal').remove()" style="position: absolute; top: 16px; right: 20px; background: none; border: none; font-size: 20px; cursor: pointer;">×</button>
                </div>
                <div class="modal-body" style="padding: 20px 24px;">
                    <form id="add-device-form">
                        <div class="form-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                            <div class="form-group">
                                <label class="form-label">设备厂商 <span style="color: red;">*</span></label>
                                <select class="form-select" name="manufacturer" required>
                                    <option value="">选择厂商</option>
                                    <option value="Tesla">特斯拉 (Tesla)</option>
                                    <option value="ABB">ABB集团</option>
                                    <option value="BYD">比亚迪 (BYD)</option>
                                    <option value="ChargePoint">ChargePoint</option>
                                    <option value="EVBox">EVBox</option>
                                    <option value="Schneider">施耐德 (Schneider)</option>
                                    <option value="Siemens">西门子 (Siemens)</option>
                                    <option value="StarCharge">星星充电</option>
                                    <option value="TELD">特来电</option>
                                    <option value="XPeng">小鹏汽车</option>
                                    <option value="Other">其他厂商</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label class="form-label">设备型号 <span style="color: red;">*</span></label>
                                <input type="text" class="form-input" name="deviceModel" placeholder="如: V3 Supercharger" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label">设备编号 <span style="color: red;">*</span></label>
                                <input type="text" class="form-input" name="deviceId" placeholder="如: DEV009" required>
                                <small style="color: #999; font-size: 12px;">设备唯一标识编号</small>
                            </div>
                            <div class="form-group">
                                <label class="form-label">所属电站 <span style="color: red;">*</span></label>
                                <select class="form-select" name="stationId" required>
                                    <option value="">选择电站</option>
                                    <option value="ST001">北京朝阳充电站</option>
                                    <option value="ST002">上海浦东充电站</option>
                                    <option value="ST003">深圳南山充电站</option>
                                    <option value="ST004">广州天河充电站</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label class="form-label">最大功率 (kW) <span style="color: red;">*</span></label>
                                <input type="number" class="form-input" name="maxPower" min="1" max="1000" step="0.1" placeholder="如: 250" required>
                                <small style="color: #999; font-size: 12px;">设备额定最大输出功率</small>
                            </div>
                            <div class="form-group">
                                <label class="form-label">充电枪数量 <span style="color: red;">*</span></label>
                                <input type="number" class="form-input" name="gunCount" min="1" max="8" value="1" required>
                                <small style="color: #999; font-size: 12px;">单个设备的充电枪数量（1-8个）</small>
                            </div>
                            <div class="form-group">
                                <label class="form-label">充电类型</label>
                                <div class="form-input" id="charging-type-display" style="background: #f5f5f5; color: #666; cursor: not-allowed;">
                                    请先输入最大功率
                                </div>
                                <small style="color: #999; font-size: 12px;">
                                    慢充：交流桩，≤22kW &nbsp;|&nbsp; 快充：直流桩，30-120kW &nbsp;|&nbsp; 超充：直流桩，≥250kW
                                </small>
                            </div>
                        </div>
                        <div class="form-group" style="margin-top: 16px;">
                            <label class="form-label">备注信息</label>
                            <textarea class="form-input" name="remarks" rows="3" placeholder="设备的详细描述、安装位置、特殊配置等信息..."></textarea>
                        </div>
                    </form>
                </div>
                <div class="modal-footer" style="padding: 16px 24px 20px; border-top: 1px solid #f0f0f0; display: flex; justify-content: flex-end; gap: 12px;">
                    <button class="btn" onclick="this.closest('.device-modal').remove()">取消</button>
                    <button class="btn btn-primary" onclick="system.addDevice()">添加设备</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        // 添加功率输入监听，自动更新充电类型
        const powerInput = document.querySelector('input[name="maxPower"]');
        const chargingTypeDisplay = document.getElementById('charging-type-display');
        
        powerInput.addEventListener('input', function() {
            const power = parseFloat(this.value);
            let chargingType = '';
            let displayText = '';
            
            if (isNaN(power) || power <= 0) {
                displayText = '请先输入最大功率';
                chargingTypeDisplay.style.color = '#666';
            } else if (power <= 22) {
                chargingType = 'slow';
                displayText = '慢充 - 交流桩';
                chargingTypeDisplay.style.color = '#52C41A';
            } else if (power >= 30 && power <= 120) {
                chargingType = 'fast';
                displayText = '快充 - 直流桩';
                chargingTypeDisplay.style.color = '#1890FF';
            } else if (power >= 250) {
                chargingType = 'super';
                displayText = '超充 - 直流桩';
                chargingTypeDisplay.style.color = '#FF4D4F';
            } else {
                // 22kW < power < 30kW 或 120kW < power < 250kW 的情况
                displayText = '功率范围未匹配标准类型';
                chargingTypeDisplay.style.color = '#FAAD14';
            }
            
            chargingTypeDisplay.textContent = displayText;
            chargingTypeDisplay.setAttribute('data-type', chargingType);
        });
    }

    addDevice() {
        const form = document.getElementById('add-device-form');
        const formData = new FormData(form);
        
        // 验证表单
        if (!form.checkValidity()) {
            this.showToast('请填写完整的设备信息', 'error');
            return;
        }
        
        // 验证必填字段
        const requiredFields = ['manufacturer', 'deviceModel', 'deviceId', 'stationId', 'maxPower', 'gunCount'];
        const missingFields = [];
        
        for (const field of requiredFields) {
            if (!formData.get(field) || formData.get(field).trim() === '') {
                missingFields.push(field);
            }
        }
        
        if (missingFields.length > 0) {
            const fieldNames = {
                'manufacturer': '设备厂商',
                'deviceModel': '设备型号', 
                'deviceId': '设备编号',
                'stationId': '所属电站',
                'maxPower': '最大功率',
                'gunCount': '充电枪数量'
            };
            const missing = missingFields.map(field => fieldNames[field]).join('、');
            this.showToast(`请填写必填字段：${missing}`, 'error');
            return;
        }
        
        // 验证设备编号是否已存在（模拟检查）
        const existingDeviceIds = ['DEV001', 'DEV002', 'DEV003', 'DEV004', 'DEV005', 'DEV006', 'DEV007', 'DEV008'];
        if (existingDeviceIds.includes(formData.get('deviceId'))) {
            this.showToast('设备编号已存在，请使用其他编号', 'error');
            return;
        }
        
        // 获取自动计算的充电类型
        const chargingTypeDisplay = document.getElementById('charging-type-display');
        const chargingType = chargingTypeDisplay.getAttribute('data-type') || '';
        
        // 构造设备数据
        const deviceData = {
            manufacturer: formData.get('manufacturer'),
            model: formData.get('deviceModel'),
            id: formData.get('deviceId'),
            stationId: formData.get('stationId'),
            maxPower: parseFloat(formData.get('maxPower')),
            gunCount: parseInt(formData.get('gunCount')),
            chargingType: chargingType,
            status: 'idle', // 默认状态为空闲
            health: 100, // 默认健康度100%
            remarks: formData.get('remarks')
        };
        
        console.log('新增设备数据:', deviceData);
        
        // 模拟添加设备
        this.showToast('设备添加成功', 'success');
        document.querySelector('.device-modal').remove();
        
        // 刷新设备列表（实际项目中会重新加载数据）
        // this.refreshDeviceList();
    }

    showDeviceDetail(deviceId) {
        // 获取设备详细信息
        const deviceInfo = this.getDeviceDetailInfo(deviceId);
        
        const modal = document.createElement('div');
        modal.className = 'device-detail-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            animation: fadeInBg 0.3s ease forwards;
        `;
        
        modal.innerHTML = `
            <div class="modal-container" style="
                background: white;
                border-radius: 12px;
                max-width: 900px;
                width: 90%;
                max-height: 90vh;
                overflow-y: auto;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
                opacity: 0;
                transform: scale(0.95);
                animation: fadeInScale 0.3s ease forwards;
            ">
                <div class="modal-header" style="
                    padding: 24px;
                    border-bottom: 1px solid #e0e0e0;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                ">
                    <h3 style="margin: 0; font-size: 20px; color: #333;">设备详情 - ${deviceInfo.id}</h3>
                    <button class="modal-close" onclick="this.closest('.device-detail-modal').remove()" style="
                        background: none;
                        border: none;
                        font-size: 24px;
                        cursor: pointer;
                        color: #999;
                        padding: 0;
                        width: 30px;
                        height: 30px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        transition: color 0.3s ease;
                    ">×</button>
                </div>

                <div class="modal-body" style="padding: 24px;">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
                        <div>
                            <h4 style="margin: 0 0 16px; font-size: 16px; color: #333; padding-bottom: 8px; border-bottom: 1px solid #e0e0e0;">基本信息</h4>
                            <div style="display: flex; flex-direction: column; gap: 12px;">
                                <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f0f0f0;">
                                    <span style="color: #666; font-size: 14px;">设备编号</span>
                                    <span style="color: #333; font-weight: 500; font-size: 14px;">${deviceInfo.id}</span>
                                </div>
                                <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f0f0f0;">
                                    <span style="color: #666; font-size: 14px;">设备型号</span>
                                    <span style="color: #333; font-weight: 500; font-size: 14px;">${deviceInfo.model}</span>
                                </div>
                                <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f0f0f0;">
                                    <span style="color: #666; font-size: 14px;">所属电站</span>
                                    <span style="color: #333; font-weight: 500; font-size: 14px;">${deviceInfo.station}</span>
                                </div>
                                <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f0f0f0;">
                                    <span style="color: #666; font-size: 14px;">充电枪数</span>
                                    <span style="color: #333; font-weight: 500; font-size: 14px;">${deviceInfo.gunCount}个</span>
                                </div>
                                <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f0f0f0;">
                                    <span style="color: #666; font-size: 14px;">最大功率</span>
                                    <span style="color: #333; font-weight: 500; font-size: 14px;">${deviceInfo.power} kW</span>
                                </div>
                                <div style="display: flex; justify-content: space-between; padding: 8px 0;">
                                    <span style="color: #666; font-size: 14px;">设备状态</span>
                                    <span style="font-size: 14px;">${this.getDeviceStatusBadge(deviceInfo.status)}</span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4 style="margin: 0 0 16px; font-size: 16px; color: #333; padding-bottom: 8px; border-bottom: 1px solid #e0e0e0;">充电枪状态</h4>
                            <div style="display: flex; flex-direction: column; gap: 12px;">
                                ${deviceInfo.guns.map(gun => `
                                    <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f0f0f0;">
                                        <span style="color: #666; font-size: 14px;">${gun.id}</span>
                                        <span style="font-size: 14px; display: flex; align-items: center; gap: 8px;">
                                            ${this.getGunStatusBadge(gun.status)}
                                            ${gun.status === 'charging' ? `<span style="color: #999; font-size: 12px;">充电${gun.chargingDuration}h / ${gun.realtimeEnergy}kWh</span>` : ''}
                                        </span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>

                    <div style="margin-top: 24px;">
                        <h4 style="margin: 0 0 16px; font-size: 16px; color: #333;">运行数据</h4>
                        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px;">
                            <div class="stat-card">
                                <div class="stat-label">当前功率</div>
                                <div class="stat-value">${deviceInfo.currentPower} kW</div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-label">设备温度</div>
                                <div class="stat-value">${deviceInfo.temperature}°C</div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-label">今日充电次数</div>
                                <div class="stat-value">${deviceInfo.todayCount}次</div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-label">今日收入</div>
                                <div class="stat-value">¥${deviceInfo.todayRevenue}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="modal-footer" style="
                    padding: 16px 24px;
                    border-top: 1px solid #e0e0e0;
                    display: flex;
                    justify-content: flex-end;
                    gap: 12px;
                ">
                    <button class="btn btn-secondary" onclick="this.closest('.device-detail-modal').remove()" style="
                        padding: 8px 24px;
                        border: 1px solid #d9d9d9;
                        background: white;
                        color: #666;
                        border-radius: 6px;
                        cursor: pointer;
                        font-size: 14px;
                        transition: all 0.3s ease;
                    ">关闭</button>
                    <button class="btn btn-primary" onclick="system.controlDevice('${deviceId}')" style="
                        padding: 8px 24px;
                        border: none;
                        background: #1890ff;
                        color: white;
                        border-radius: 6px;
                        cursor: pointer;
                        font-size: 14px;
                        transition: all 0.3s ease;
                    ">设备控制</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }
    
    // 获取设备详细信息的辅助方法
    getDeviceDetailInfo(deviceId) {
        const baseDevices = [
            { 
                id: 'DEV001', model: 'Tesla V3 Supercharger', station: '北京朝阳充电站', 
                power: 250, gunCount: 2, currentPower: 185, status: 'charging', 
                voltage: 480, current: 385, gunsInUse: 2, gunsIdle: 0
            },
            { 
                id: 'DEV002', model: 'ABB Terra 184', station: '上海浦东充电站', 
                power: 180, gunCount: 2, currentPower: 125, status: 'charging', 
                voltage: 400, current: 312, gunsInUse: 2, gunsIdle: 0
            },
            { 
                id: 'DEV003', model: 'ChargePoint Express 250', station: '深圳南山充电站', 
                power: 250, gunCount: 4, currentPower: 220, status: 'charging', 
                voltage: 480, current: 458, gunsInUse: 4, gunsIdle: 0
            },
            { 
                id: 'DEV004', model: 'EVBox Troniq 100', station: '广州天河充电站', 
                power: 100, gunCount: 2, currentPower: 0, status: 'idle', 
                voltage: 400, current: 0, gunsInUse: 0, gunsIdle: 2
            }
        ];
        
        const device = baseDevices.find(d => d.id === deviceId) || baseDevices[0];
        
        // 生成充电枪数据
        const guns = [];
        for (let i = 1; i <= device.gunCount; i++) {
            let gunStatus, realtimeEnergy, chargingDuration;
            
            if (device.status === 'charging' && i <= device.gunsInUse) {
                gunStatus = 'charging';
                chargingDuration = (Math.random() * 3 + 0.1).toFixed(1);
                realtimeEnergy = (device.currentPower / device.gunsInUse * parseFloat(chargingDuration)).toFixed(1);
            } else {
                gunStatus = 'idle';
                chargingDuration = '0';
                realtimeEnergy = '0';
            }
            
            guns.push({
                id: `${device.id}-G${i}`,
                status: gunStatus,
                realtimeEnergy,
                chargingDuration
            });
        }
        
        return {
            ...device,
            temperature: Math.floor(Math.random() * 20 + 35),
            sessionCount: Math.floor(Math.random() * 500 + 1000),
            todayCount: Math.floor(Math.random() * 20 + 5),
            todayRevenue: (Math.random() * 2000 + 800).toFixed(0),
            uptime: '99.5%',
            firmwareVersion: 'v2.3.1',
            installDate: '2023-03-15',
            ipAddress: '192.168.1.' + Math.floor(Math.random() * 200 + 10),
            guns: guns,
            maintenanceRecords: [
                { title: '定期检查', date: '2024-08-15', description: '设备运行正常，各项指标正常', type: 'routine' },
                { title: '固件升级', date: '2024-07-22', description: '升级至v2.3.1，优化充电效率', type: 'upgrade' },
                { title: '清洁维护', date: '2024-07-01', description: '清洁充电接口和散热系统', type: 'routine' }
            ]
        };
    }
    
    // 获取充电枪状态颜色
    getGunStatusColor(status) {
        const colorMap = {
            'idle': '#3b82f6',
            'plugged_not_charging': '#f59e0b', 
            'charging': '#10b981',
            'fault': '#ef4444'
        };
        return colorMap[status] || colorMap.idle;
    }
    
    // 新增设备操作方法
    exportDeviceReport(deviceId) {
        this.showToast(`正在导出 ${deviceId} 设备报告...`, 'info');
        setTimeout(() => {
            this.showToast('设备报告导出完成', 'success');
        }, 2000);
    }
    
    scheduleDeviceMaintenance(deviceId) {
        this.showToast(`已为 ${deviceId} 预约维护服务`, 'success');
    }

    controlGun(gunId) {
        const [deviceId, gunNumber] = gunId.split('-G');
        const modal = document.createElement('div');
        modal.className = 'gun-control-modal';
        modal.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0, 0, 0, 0.5); display: flex; justify-content: center; align-items: center; z-index: 10001;
        `;
        modal.innerHTML = `
            <div class="modal-content" style="background: white; border-radius: 8px; max-width: 500px; width: 90%;">
                <div class="modal-header" style="padding: 20px 24px 16px; border-bottom: 1px solid #f0f0f0;">
                    <h3 style="margin: 0;">充电枪控制 - ${gunId}</h3>
                    <button class="close-btn" style="background: none; border: none; font-size: 24px; cursor: pointer; float: right; margin-top: -30px;">×</button>
                </div>
                <div class="modal-body" style="padding: 24px;">
                    <div class="gun-info" style="margin-bottom: 20px; padding: 16px; background: #f8f9fa; border-radius: 6px;">
                        <p style="margin: 0 0 8px 0;"><strong>设备ID:</strong> ${deviceId}</p>
                        <p style="margin: 0 0 8px 0;"><strong>充电枪:</strong> ${gunNumber}号枪</p>
                        <p style="margin: 0;"><strong>当前状态:</strong> <span style="color: #52c41a;">空闲</span></p>
                    </div>
                    <div class="control-buttons" style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                        <button class="btn-primary" onclick="system.startCharging('${gunId}')">启动充电</button>
                        <button class="btn-secondary" onclick="system.stopCharging('${gunId}')">停止充电</button>
                        <button class="btn-secondary" onclick="system.resetGun('${gunId}')">重置充电枪</button>
                        <button class="btn-secondary" onclick="system.lockGun('${gunId}')">锁定充电枪</button>
                    </div>
                </div>
                <div class="modal-footer" style="padding: 16px 24px; border-top: 1px solid #f0f0f0; text-align: right;">
                    <button class="btn-secondary close-modal-btn">关闭</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        
        const closeModal = () => document.body.removeChild(modal);
        modal.querySelector('.close-btn').onclick = closeModal;
        modal.querySelector('.close-modal-btn').onclick = closeModal;
        modal.onclick = (e) => {
            if (e.target === modal) closeModal();
        };
    }

    controlDevice(deviceId) {
        // 获取设备详细信息
        const deviceInfo = this.getDeviceDetailInfo(deviceId);
        
        const modal = document.createElement('div');
        modal.className = 'device-control-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10001;
            animation: fadeInBg 0.3s ease forwards;
        `;
        
        modal.innerHTML = `
            <div class="modal-content" style="
                background: white;
                border-radius: 8px;
                max-width: 1000px;
                width: 90%;
                max-height: 90vh;
                overflow-y: auto;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                opacity: 0;
                transform: scale(0.98);
                animation: fadeInScale 0.3s ease forwards;
            ">
                <div class="modal-header" style="
                    padding: 20px 24px;
                    border-bottom: 1px solid #F0F0F0;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                ">
                    <h3 style="margin: 0; font-size: 18px; font-weight: 500; color: #000;">充电设备控制中心 - ${deviceInfo.id}</h3>
                    <button class="modal-close" onclick="this.closest('.device-control-modal').remove()" style="
                        background: none;
                        border: none;
                        font-size: 20px;
                        cursor: pointer;
                        color: #999;
                        padding: 0;
                        width: 24px;
                        height: 24px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        transition: color 0.3s ease;
                    ">×</button>
                </div>
                
                <div class="modal-body" style="padding: 24px;">
                    <!-- 充电桩整体控制 -->
                    <div style="
                        padding: 20px;
                        background: #FAFAFA;
                        border: 1px solid #F0F0F0;
                        border-radius: 8px;
                        margin-bottom: 24px;
                    ">
                        <div style="display: flex; align-items: center; margin-bottom: 16px;">
                            <div style="
                                width: 8px;
                                height: 8px;
                                background: #000;
                                border-radius: 50%;
                                margin-right: 12px;
                            "></div>
                            <h4 style="margin: 0; font-size: 14px; font-weight: 500; color: #000;">
                                充电桩控制
                            </h4>
                            <span style="
                                margin-left: 12px;
                                font-size: 12px;
                                color: #999;
                            ">（控制整个充电桩设备）</span>
                        </div>
                        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px;">
                            <button onclick="system.executeDeviceAction('${deviceId}', 'restart')" style="
                                padding: 12px 16px;
                                background: #000;
                                color: white;
                                border: none;
                                border-radius: 6px;
                                cursor: pointer;
                                font-size: 13px;
                                font-weight: 400;
                                transition: all 0.3s ease;
                                text-align: center;
                            ">
                                重启充电桩
                            </button>
                            <button onclick="system.executeDeviceAction('${deviceId}', 'reset')" style="
                                padding: 12px 16px;
                                background: #FFF;
                                color: #000;
                                border: 1px solid #E5E5E5;
                                border-radius: 6px;
                                cursor: pointer;
                                font-size: 13px;
                                font-weight: 400;
                                transition: all 0.3s ease;
                                text-align: center;
                            ">
                                系统重置
                            </button>
                            <button onclick="system.executeDeviceAction('${deviceId}', 'maintain')" style="
                                padding: 12px 16px;
                                background: #FFF;
                                color: #000;
                                border: 1px solid #E5E5E5;
                                border-radius: 6px;
                                cursor: pointer;
                                font-size: 13px;
                                font-weight: 400;
                                transition: all 0.3s ease;
                                text-align: center;
                            ">
                                维护模式
                            </button>
                            <button onclick="system.executeDeviceAction('${deviceId}', 'emergency')" style="
                                padding: 12px 16px;
                                background: #FFF;
                                color: #FF4D4F;
                                border: 1px solid #FF4D4F;
                                border-radius: 6px;
                                cursor: pointer;
                                font-size: 13px;
                                font-weight: 400;
                                transition: all 0.3s ease;
                                text-align: center;
                            ">
                                紧急停止
                            </button>
                        </div>
                        
                        <!-- 功率设置 -->
                        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #F0F0F0;">
                            <label style="display: block; font-size: 13px; color: #666; margin-bottom: 12px;">充电桩总功率限制</label>
                            <div style="display: flex; align-items: center; gap: 12px;">
                                <input type="range" 
                                    min="50" 
                                    max="${deviceInfo.power}" 
                                    value="${deviceInfo.currentPower || deviceInfo.power * 0.8}" 
                                    id="total-power-slider"
                                    style="flex: 1; height: 2px; background: #E5E5E5; outline: none; -webkit-appearance: none;">
                                <span style="font-weight: 500; min-width: 60px; color: #000;">
                                    <span id="total-power-value">${deviceInfo.currentPower || Math.round(deviceInfo.power * 0.8)}</span> kW
                                </span>
                                <button onclick="system.setPowerLimit('${deviceId}')" style="
                                    padding: 6px 16px;
                                    background: #000;
                                    color: white;
                                    border: none;
                                    border-radius: 6px;
                                    cursor: pointer;
                                    font-size: 12px;
                                    transition: all 0.3s ease;
                                ">应用</button>
                            </div>
                        </div>
                    </div>
                    
                    <!-- 充电枪独立控制 -->
                    <div style="margin-bottom: 24px;">
                        <div style="display: flex; align-items: center; margin-bottom: 16px;">
                            <div style="
                                width: 8px;
                                height: 8px;
                                background: #52C41A;
                                border-radius: 50%;
                                margin-right: 12px;
                            "></div>
                            <h4 style="margin: 0; font-size: 14px; font-weight: 500; color: #000;">
                                充电枪控制
                            </h4>
                            <span style="
                                margin-left: 12px;
                                font-size: 12px;
                                color: #999;
                            ">（独立控制每个充电枪）</span>
                        </div>
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px;">
                            ${deviceInfo.guns.map((gun, index) => `
                                <div style="
                                    border: 1px solid #E5E5E5;
                                    border-radius: 8px;
                                    padding: 20px;
                                    background: #FFFFFF;
                                    transition: all 0.3s ease;
                                ">
                                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                                        <h5 style="margin: 0; font-size: 14px; font-weight: 500; color: #000;">充电枪 ${index + 1}</h5>
                                        ${gun.status === 'charging' ? 
                                            '<span style="padding: 4px 8px; background: #F0FAF0; color: #52C41A; border-radius: 4px; font-size: 12px; border: 1px solid #D9F7BE;">充电中</span>' :
                                            '<span style="padding: 4px 8px; background: #FAFAFA; color: #999; border-radius: 4px; font-size: 12px; border: 1px solid #F0F0F0;">空闲</span>'
                                        }
                                    </div>
                                    
                                    ${gun.status === 'charging' ? `
                                        <div style="font-size: 12px; color: #666; margin-bottom: 12px;">
                                            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                                                <span>充电时长：</span>
                                                <span style="font-weight: 500;">${gun.chargingDuration}小时</span>
                                            </div>
                                            <div style="display: flex; justify-content: space-between;">
                                                <span>已充电量：</span>
                                                <span style="font-weight: 500;">${gun.realtimeEnergy} kWh</span>
                                            </div>
                                        </div>
                                    ` : ''}
                                    
                                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                                        ${gun.status === 'charging' ? `
                                            <button onclick="system.controlGun('${gun.id}', 'stop')" style="
                                                padding: 8px 12px;
                                                background: #FFF;
                                                color: #FF4D4F;
                                                border: 1px solid #FF4D4F;
                                                border-radius: 6px;
                                                cursor: pointer;
                                                font-size: 13px;
                                                transition: all 0.3s ease;
                                            ">停止</button>
                                            <button onclick="system.controlGun('${gun.id}', 'pause')" style="
                                                padding: 8px 12px;
                                                background: #FFF;
                                                color: #FAAD14;
                                                border: 1px solid #FAAD14;
                                                border-radius: 6px;
                                                cursor: pointer;
                                                font-size: 13px;
                                                transition: all 0.3s ease;
                                            ">暂停</button>
                                        ` : `
                                            <button onclick="system.controlGun('${gun.id}', 'start')" style="
                                                padding: 8px 12px;
                                                background: #000;
                                                color: white;
                                                border: none;
                                                border-radius: 6px;
                                                cursor: pointer;
                                                font-size: 13px;
                                                transition: all 0.3s ease;
                                                grid-column: 1 / -1;
                                            ">启动充电</button>
                                        `}
                                        <button onclick="system.controlGun('${gun.id}', 'unlock')" style="
                                            padding: 8px 12px;
                                            background: white;
                                            color: #666;
                                            border: 1px solid #E5E5E5;
                                            border-radius: 6px;
                                            cursor: pointer;
                                            font-size: 13px;
                                            transition: all 0.3s ease;
                                            grid-column: 1 / -1;
                                        ">解锁</button>
                                    </div>
                                    
                                    <!-- 功率调节 -->
                                    <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #F0F0F0;">
                                        <label style="display: block; font-size: 12px; color: #999; margin-bottom: 8px;">功率限制</label>
                                        <div style="display: flex; align-items: center; gap: 12px;">
                                            <input type="range" 
                                                min="0" 
                                                max="${deviceInfo.power}" 
                                                value="${gun.status === 'charging' ? deviceInfo.currentPower / deviceInfo.gunsInUse : 0}" 
                                                id="gun-power-${gun.id}"
                                                onchange="system.updateGunPower('${gun.id}', this.value)"
                                                style="flex: 1; height: 2px; background: #E5E5E5; outline: none; -webkit-appearance: none;">
                                            <span style="font-size: 13px; min-width: 50px; text-align: right; color: #000; font-weight: 500;">
                                                <span id="gun-power-value-${gun.id}">${gun.status === 'charging' ? Math.round(deviceInfo.currentPower / deviceInfo.gunsInUse) : 0}</span> kW
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <!-- 充电模式设置 -->
                    <div style="
                        padding: 20px;
                        background: #FAFAFA;
                        border: 1px solid #F0F0F0;
                        border-radius: 8px;
                    ">
                        <div style="display: flex; align-items: center; margin-bottom: 16px;">
                            <div style="
                                width: 8px;
                                height: 8px;
                                background: #1890FF;
                                border-radius: 50%;
                                margin-right: 12px;
                            "></div>
                            <h4 style="margin: 0; font-size: 14px; font-weight: 500; color: #000;">
                                充电模式
                            </h4>
                        </div>
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <select id="charging-mode" style="
                                flex: 1;
                                padding: 8px 12px;
                                border: 1px solid #E5E5E5;
                                border-radius: 6px;
                                font-size: 13px;
                                background: white;
                                color: #000;
                            ">
                                <option value="fast">快速充电模式</option>
                                <option value="normal" selected>标准充电模式</option>
                                <option value="eco">节能充电模式</option>
                                <option value="scheduled">预约充电模式</option>
                            </select>
                            <button onclick="system.setChargingMode('${deviceId}')" style="
                                padding: 8px 20px;
                                background: #000;
                                color: white;
                                border: none;
                                border-radius: 6px;
                                cursor: pointer;
                                font-size: 13px;
                                transition: all 0.3s ease;
                            ">应用模式</button>
                        </div>
                        <div style="margin-top: 12px; font-size: 12px; color: #999; line-height: 1.5;">
                            <div>• 快速充电：最大功率输出，充电速度最快</div>
                            <div>• 标准充电：平衡充电速度与电池保护</div>
                            <div>• 节能充电：低功率充电，延长电池寿命</div>
                            <div>• 预约充电：设定时间段自动充电</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // 功率滑块事件
        const totalSlider = document.getElementById('total-power-slider');
        const totalValueDisplay = document.getElementById('total-power-value');
        if (totalSlider) {
            totalSlider.addEventListener('input', function() {
                totalValueDisplay.textContent = this.value;
            });
        }
        
        // 每个充电枪的功率滑块事件
        deviceInfo.guns.forEach(gun => {
            const gunSlider = document.getElementById(`gun-power-${gun.id}`);
            const gunValueDisplay = document.getElementById(`gun-power-value-${gun.id}`);
            if (gunSlider) {
                gunSlider.addEventListener('input', function() {
                    gunValueDisplay.textContent = this.value;
                });
            }
        });
    }

    executeDeviceAction(deviceId, action) {
        const actionNames = {
            'start': '启动充电',
            'stop': '停止充电',
            'restart': '重启充电桩',
            'reset': '系统重置',
            'unlock': '解锁连接器',
            'maintain': '进入维护模式',
            'emergency': '紧急停止'
        };
        
        this.showToast(`正在执行${actionNames[action]}操作...`, 'info');
        
        // 模拟操作执行
        setTimeout(() => {
            this.showToast(`${actionNames[action]}操作完成`, 'success');
            // 如果是维护模式，不关闭弹窗
            if (action !== 'maintain') {
                const modal = document.querySelector('.device-control-modal');
                if (modal) modal.remove();
            }
        }, 1500);
    }
    
    // 控制单个充电枪
    controlGun(gunId, action) {
        const actionNames = {
            'start': '启动充电',
            'stop': '停止充电',
            'pause': '暂停充电',
            'unlock': '解锁充电枪'
        };
        
        this.showToast(`充电枪 ${gunId}: 正在${actionNames[action]}...`, 'info');
        
        // 模拟操作执行
        setTimeout(() => {
            this.showToast(`充电枪 ${gunId}: ${actionNames[action]}成功`, 'success');
            
            // 更新界面状态（实际项目中应该重新获取数据）
            if (action === 'stop' || action === 'pause') {
                const statusBadge = document.querySelector(`#gun-status-${gunId}`);
                if (statusBadge) {
                    statusBadge.innerHTML = '<span style="padding: 2px 8px; background: #d9d9d9; color: #666; border-radius: 4px; font-size: 12px;">空闲</span>';
                }
            }
        }, 1000);
    }
    
    // 更新充电枪功率
    updateGunPower(gunId, power) {
        console.log(`更新充电枪 ${gunId} 功率至 ${power} kW`);
    }
    
    // 设置充电模式
    setChargingMode(deviceId) {
        const mode = document.getElementById('charging-mode').value;
        const modeNames = {
            'fast': '快速充电',
            'normal': '标准充电',
            'eco': '节能充电'
        };
        
        this.showToast(`正在切换至${modeNames[mode]}模式...`, 'info');
        
        setTimeout(() => {
            this.showToast(`已切换至${modeNames[mode]}模式`, 'success');
        }, 1000);
    }

    setPowerLimit(deviceId) {
        const powerValue = document.getElementById('total-power-slider').value;
        this.showToast(`正在设置功率限制为 ${powerValue} kW...`, 'info');
        
        setTimeout(() => {
            this.showToast(`功率限制已设置为 ${powerValue} kW`, 'success');
        }, 1000);
    }

    maintainDevice(deviceId) {
        const modal = document.createElement('div');
        modal.className = 'device-maintain-modal';
        modal.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0, 0, 0, 0.5); display: flex; justify-content: center; align-items: center; z-index: 10001;
        `;
        modal.innerHTML = `
            <div class="modal-content" style="background: white; border-radius: 8px; max-width: 600px; width: 90%; max-height: 80vh; overflow-y: auto;">
                <div class="modal-header" style="padding: 20px 24px 16px; border-bottom: 1px solid #f0f0f0;">
                    <h3 style="margin: 0;">维护管理 - ${deviceId}</h3>
                    <button class="modal-close" onclick="this.closest('.device-maintain-modal').remove()" style="position: absolute; top: 16px; right: 20px; background: none; border: none; font-size: 20px; cursor: pointer;">×</button>
                </div>
                <div class="modal-body" style="padding: 20px 24px;">
                    <div style="margin-bottom: 24px;">
                        <h4 style="margin: 0 0 12px;">快速操作</h4>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                            <button class="btn" onclick="system.startMaintenance('${deviceId}')" style="background: #FAAD14; color: white;">🔧 进入维护模式</button>
                            <button class="btn" onclick="system.endMaintenance('${deviceId}')" style="background: #52C41A; color: white;">✅ 结束维护</button>
                            <button class="btn" onclick="system.runDiagnostic('${deviceId}')">🔍 运行诊断</button>
                            <button class="btn" onclick="system.updateFirmware('${deviceId}')">📱 固件更新</button>
                        </div>
                    </div>
                    
                    <div style="margin-bottom: 24px;">
                        <h4 style="margin: 0 0 12px;">维护记录</h4>
                        <div style="background: #fafafa; border-radius: 6px; padding: 16px; max-height: 200px; overflow-y: auto;">
                            <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #f0f0f0;">
                                <div>
                                    <div style="font-weight: 500; font-size: 14px;">例行检查</div>
                                    <div style="font-size: 12px; color: #999;">2024-08-15 10:30</div>
                                </div>
                                <span style="padding: 2px 8px; background: #52C41A; color: white; border-radius: 4px; font-size: 12px;">完成</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #f0f0f0;">
                                <div>
                                    <div style="font-weight: 500; font-size: 14px;">冷却系统清洁</div>
                                    <div style="font-size: 12px; color: #999;">2024-08-10 14:20</div>
                                </div>
                                <span style="padding: 2px 8px; background: #52C41A; color: white; border-radius: 4px; font-size: 12px;">完成</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0;">
                                <div>
                                    <div style="font-weight: 500; font-size: 14px;">连接器更换</div>
                                    <div style="font-size: 12px; color: #999;">2024-07-25 09:15</div>
                                </div>
                                <span style="padding: 2px 8px; background: #52C41A; color: white; border-radius: 4px; font-size: 12px;">完成</span>
                            </div>
                        </div>
                    </div>
                    
                    <div>
                        <h4 style="margin: 0 0 12px;">添加维护记录</h4>
                        <form style="display: grid; gap: 12px;">
                            <div>
                                <label style="display: block; margin-bottom: 4px; font-size: 14px;">维护类型</label>
                                <select class="form-select" style="width: 100%;">
                                    <option>例行检查</option>
                                    <option>故障维修</option>
                                    <option>预防性维护</option>
                                    <option>部件更换</option>
                                    <option>固件升级</option>
                                </select>
                            </div>
                            <div>
                                <label style="display: block; margin-bottom: 4px; font-size: 14px;">维护描述</label>
                                <textarea class="form-input" rows="3" placeholder="详细描述维护内容..." style="width: 100%; resize: vertical;"></textarea>
                            </div>
                            <button type="button" class="btn btn-primary" onclick="system.addMaintenanceRecord('${deviceId}')" style="margin-top: 8px;">添加记录</button>
                        </form>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    startMaintenance(deviceId) {
        this.showToast(`${deviceId} 已进入维护模式`, 'success');
        document.querySelector('.device-maintain-modal').remove();
    }

    endMaintenance(deviceId) {
        this.showToast(`${deviceId} 已退出维护模式`, 'success');
        document.querySelector('.device-maintain-modal').remove();
    }

    runDiagnostic(deviceId) {
        this.showToast('正在运行设备诊断...', 'info');
        setTimeout(() => {
            this.showToast('设备诊断完成，设备状态正常', 'success');
        }, 3000);
    }

    updateFirmware(deviceId) {
        this.showToast('正在检查固件更新...', 'info');
        setTimeout(() => {
            this.showToast('固件已是最新版本', 'info');
        }, 2000);
    }

    addMaintenanceRecord(deviceId) {
        this.showToast('维护记录已添加', 'success');
        document.querySelector('.device-maintain-modal').remove();
    }

    getOrdersContent() {
        return `
            <!-- 订单统计 -->
            <div class="stats-grid animated-entrance">
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

            <div class="data-section animated-entrance">
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
            <div class="stats-grid animated-entrance">
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

            <div class="data-section animated-entrance">
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
            <div class="stats-grid animated-entrance">
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
            <div class="chart-container animated-entrance">
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
            <div class="data-section animated-entrance">
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
            <div class="stats-grid animated-entrance">
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

            <div class="data-section animated-entrance">
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
            <div class="data-section animated-entrance">
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
        // 销毁旧的页面实例
        if (this.pageInstances[this.currentPage]) {
            this.pageInstances[this.currentPage].destroy();
        }

        // 创建新的页面实例
        const pageInstance = {
            destroy: () => {
                // 清理页面特定的定时器和事件
                if (page === 'dashboard' && this.updateInterval) {
                    clearInterval(this.updateInterval);
                    this.updateInterval = null;
                }
            }
        };

        this.pageInstances[page] = pageInstance;

        // 通用功能绑定
        this.bindCommonEvents();

        // 页面特定功能
        if (page === 'dashboard') {
            this.initDashboardFeatures();
        }

        // 添加入场动画
        this.animatePageElements();
    }

    bindCommonEvents() {
        // 图表选项切换
        document.querySelectorAll('.chart-option').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const parent = e.target.parentElement;
                parent.querySelectorAll('.chart-option').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
            });
        });

        // 分页按钮
        document.querySelectorAll('.page-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (!btn.disabled && btn.textContent !== '...') {
                    const parent = btn.parentElement;
                    parent.querySelectorAll('.page-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                }
            });
        });

        // 搜索框焦点效果
        document.querySelectorAll('.search-box').forEach(input => {
            input.addEventListener('focus', () => {
                input.style.borderColor = '#000000';
                input.style.transform = 'scale(1.02)';
            });
            input.addEventListener('blur', () => {
                input.style.borderColor = '#E5E5E5';
                input.style.transform = 'scale(1)';
            });
        });

        // 按钮悬停效果
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                btn.style.transform = 'translateY(-2px)';
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translateY(0)';
            });
        });
    }

    initDashboardFeatures() {
        this.initStationMonitoring();
        this.initAnalysisCards();
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

        this.updateStatusCounts();
        this.initMap();
        this.startRealTimeUpdates();
    }

    initMap() {
        setTimeout(() => {
            const mapContainer = document.getElementById('station-map');
            if (!mapContainer) return;

            mapContainer.innerHTML = '';

            this.stations.forEach((station, index) => {
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
                
                // 添加渐进动画
                markerContainer.style.opacity = '0';
                markerContainer.style.transform = 'scale(0)';
                setTimeout(() => {
                    markerContainer.style.transition = 'all 0.5s ease';
                    markerContainer.style.opacity = '1';
                    markerContainer.style.transform = 'scale(1)';
                }, index * 50);

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

        Object.keys(counts).forEach(status => {
            const el = document.getElementById(`${status}-count`);
            if (el) el.textContent = counts[status];
        });
    }

    startRealTimeUpdates() {
        this.updateInterval = setInterval(() => {
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
            document.querySelectorAll('.rank-bar').forEach((bar, index) => {
                setTimeout(() => {
                    bar.style.transition = 'transform 0.5s ease';
                    bar.style.transform = 'scaleX(1)';
                }, index * 50);
            });
        }, 300);

        // 初始化使用率动画
        setTimeout(() => {
            document.querySelectorAll('.usage-fill').forEach((fill, index) => {
                setTimeout(() => {
                    fill.style.transition = 'transform 0.5s ease';
                    fill.style.transform = 'scaleX(1)';
                }, index * 100);
            });
        }, 500);

        // 绑定筛选器事件
        document.querySelectorAll('.analysis-filter').forEach(select => {
            select.addEventListener('change', (e) => {
                const card = e.target.closest('.analysis-card');
                const timeRange = e.target.value;
                this.updateAnalysisData(card, timeRange);
            });
        });
    }

    updateAnalysisData(card, timeRange) {
        const rankingItems = card.querySelectorAll('.ranking-item');
        rankingItems.forEach((item, index) => {
            const bar = item.querySelector('.rank-bar');
            const newWidth = Math.random() * 80 + 20;
            
            bar.style.transition = 'width 0.5s ease';
            setTimeout(() => {
                bar.style.width = newWidth + '%';
            }, index * 50);
        });
    }

    animatePageElements() {
        const elements = document.querySelectorAll('.animated-entrance');
        elements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                el.style.transition = 'all 0.5s ease';
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    // 新增电站相关方法
    showAddStationModal() {
        // 生成自动电站编号
        const nextId = this.generateStationId();
        
        const modal = document.createElement('div');
        modal.className = 'station-modal';
        modal.innerHTML = `
            <div class="modal-overlay" onclick="this.parentElement.remove()"></div>
            <div class="modal-content" style="max-width: 600px;">
                <div class="modal-header">
                    <h3>新增电站</h3>
                    <button class="modal-close" onclick="this.closest('.station-modal').remove()">×</button>
                </div>
                <div class="modal-body">
                    <form id="add-station-form" onsubmit="system.handleAddStation(event)">
                        <input type="hidden" name="stationId" value="${nextId}">
                        <div class="form-grid" style="grid-template-columns: 1fr 1fr;">
                            <div class="form-group" style="grid-column: 1 / -1;">
                                <label class="form-label">电站名称 *</label>
                                <input type="text" class="form-input" name="stationName" placeholder="例如: 杭州西湖充电站" required>
                            </div>
                            <div class="form-group" style="grid-column: 1 / -1;">
                                <label class="form-label">详细地址 *</label>
                                <div style="display: flex; gap: 10px;">
                                    <input type="text" class="form-input" name="address" id="address-input" placeholder="例如: 浙江省杭州市西湖区文三路100号" required style="flex: 1;">
                                    <button type="button" class="btn" onclick="system.openLocationPicker()" style="padding: 10px 20px;">
                                        📍 地图选址
                                    </button>
                                </div>
                                <input type="hidden" name="latitude" id="latitude">
                                <input type="hidden" name="longitude" id="longitude">
                                <div id="location-display" style="margin-top: 8px; font-size: 12px; color: #999;"></div>
                            </div>
                            <div class="form-group">
                                <label class="form-label">充电桩数量 *</label>
                                <input type="number" class="form-input" name="devices" min="1" placeholder="例如: 20" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label">总功率 (kW)</label>
                                <input type="number" class="form-input" name="power" min="0" placeholder="例如: 1200">
                            </div>
                            <div class="form-group">
                                <label class="form-label">联系人</label>
                                <input type="text" class="form-input" name="contact" placeholder="例如: 张经理">
                            </div>
                            <div class="form-group">
                                <label class="form-label">联系电话</label>
                                <input type="tel" class="form-input" name="phone" placeholder="例如: 13800138000">
                            </div>
                            <div class="form-group">
                                <label class="form-label">运营状态</label>
                                <select class="form-select" name="operationStatus">
                                    <option value="operating">营业</option>
                                    <option value="closed">未营业</option>
                                </select>
                            </div>
                            <div class="form-group" style="grid-column: 1 / -1;">
                                <label class="form-label">备注</label>
                                <textarea class="form-input" name="remark" rows="3" placeholder="输入备注信息..."></textarea>
                            </div>
                        </div>
                        <div class="modal-footer" style="margin-top: 30px; justify-content: flex-end; display: flex; gap: 12px;">
                            <button type="button" class="btn" onclick="this.closest('.station-modal').remove()">取消</button>
                            <button type="submit" class="btn btn-primary">确认添加</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        // 自动聚焦第一个输入框
        setTimeout(() => {
            modal.querySelector('input[name="stationName"]').focus();
        }, 100);
    }

    // 生成电站编号
    generateStationId() {
        if (!this.stationsData || this.stationsData.length === 0) {
            return 'ST001';
        }
        
        // 获取最大编号
        const maxId = this.stationsData.reduce((max, station) => {
            const num = parseInt(station.id.replace('ST', ''));
            return num > max ? num : max;
        }, 0);
        
        // 生成新编号
        const newNum = maxId + 1;
        return `ST${String(newNum).padStart(3, '0')}`;
    }


    // 打开地图选址
    openLocationPicker(mode = 'add') {
        this.locationPickerMode = mode; // 保存当前模式
        const mapModal = document.createElement('div');
        mapModal.className = 'map-picker-modal';
        mapModal.innerHTML = `
            <div class="modal-overlay" onclick="this.parentElement.remove()"></div>
            <div class="modal-content" style="max-width: 1000px; width: 95%; height: 85vh; max-height: 90vh;">
                <div class="modal-header">
                    <h3>选择位置</h3>
                    <button class="modal-close" onclick="this.closest('.map-picker-modal').remove()">×</button>
                </div>
                <div class="modal-body" style="padding: 20px; height: calc(100% - 50px); display: flex; flex-direction: column; overflow: hidden;">
                    <!-- 搜索区域 -->
                    <div class="search-section" style="display: flex; gap: 10px; margin-bottom: 20px; flex-shrink: 0;">
                        <input type="text" class="form-input" id="location-search" placeholder="搜索地址..." style="flex: 1; height: 40px;">
                        <button class="btn btn-primary" onclick="system.searchLocation()" style="padding: 0 20px; height: 40px;">搜索</button>
                    </div>
                    
                    <!-- 地图区域 -->
                    <div id="map-container" style="width: 100%; flex: 1; background: #f0f0f0; border-radius: 8px; position: relative; overflow: hidden; margin-bottom: 20px;">
                        <!-- 模拟地图 -->
                        <div id="map-background" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center;">
                            <div style="font-size: 48px;">🗺️</div>
                            <p style="color: #666; margin-top: 10px;">地图功能（模拟）</p>
                            <p style="color: #999; font-size: 12px;">点击地图选择位置或使用搜索功能</p>
                        </div>
                        <!-- 动态标记将在这里显示 -->
                    </div>
                    
                    
                    <!-- 操作按钮 -->
                    <div class="action-buttons" style="display: flex; justify-content: flex-end; gap: 12px; flex-shrink: 0;">
                        <button class="btn" onclick="document.querySelector('.map-picker-modal').remove()" style="padding: 12px 24px;">取消</button>
                        <button class="btn" id="confirm-location-btn" onclick="system.confirmLocation()" disabled style="padding: 12px 24px; background: #ddd; color: #999; cursor: not-allowed;">确认选择</button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(mapModal);

        // 绑定搜索功能 - 回车搜索
        document.getElementById('location-search').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.searchLocation();
            }
        });

        // 绑定地图点击事件
        this.bindMapClickEvents();
    }

    // 添加单个位置标记
    addSingleMarker(name, x, y, isSearchResult = false) {
        // 清除所有现有标记
        this.clearAllMarkers();
        
        // 隐藏地图背景提示
        const mapBackground = document.getElementById('map-background');
        if (mapBackground) mapBackground.style.display = 'none';
        
        const mapContainer = document.getElementById('map-container');
        const marker = document.createElement('div');
        marker.className = 'location-marker';
        marker.style.cssText = `
            position: absolute;
            left: ${x}%;
            top: ${y}%;
            transform: translate(-50%, -50%);
            z-index: 10;
        `;
        
        const markerColor = '#333333'; // 统一使用黑色
        marker.innerHTML = `
            <div style="width: 40px; height: 40px; background: ${markerColor}; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 3px solid white; box-shadow: 0 4px 12px rgba(0,0,0,0.3); cursor: pointer;"></div>
            <div style="position: absolute; top: -35px; left: 50%; transform: translateX(-50%); white-space: nowrap; background: ${markerColor}; color: white; padding: 6px 12px; border-radius: 6px; font-size: 13px; font-weight: 500; box-shadow: 0 2px 8px rgba(0,0,0,0.2);">
                ${name}
            </div>
        `;
        
        mapContainer.appendChild(marker);
        return marker;
    }
    
    // 清除所有标记
    clearAllMarkers() {
        const mapContainer = document.getElementById('map-container');
        if (mapContainer) {
            const markers = mapContainer.querySelectorAll('.location-marker, .temp-marker');
            markers.forEach(marker => marker.remove());
        }
    }

    // 选择位置（搜索或点击）
    selectLocation(name, x, y, isSearchResult = false) {
        // 生成模拟经纬度
        const lat = (39.9 + (90 - y) * 0.01).toFixed(6);
        const lng = (116.3 + (x - 50) * 0.01).toFixed(6);
        
        // 生成完整的模拟地址
        const fullAddress = name.includes('区') ? this.generateFullAddress(name) : name;
        
        // 添加单个标记到地图
        this.addSingleMarker(name, x, y, isSearchResult);
        
        // 启用确认按钮
        const confirmBtn = document.getElementById('confirm-location-btn');
        if (confirmBtn) {
            confirmBtn.disabled = false;
            confirmBtn.style.background = '#333333';
            confirmBtn.style.color = 'white';
            confirmBtn.style.cursor = 'pointer';
            confirmBtn.classList.add('btn-primary');
        }
        
        // 保存临时位置
        this.tempLocation = {
            address: fullAddress,
            lat: lat,
            lng: lng
        };
    }
    
    // 生成完整地址
    generateFullAddress(locationName) {
        const addresses = {
            '北京朝阳区': '北京市朝阳区建国路88号SOHO现代城',
            '上海浦东区': '上海市浦东新区世纪大道100号环球金融中心',
            '深圳南山区': '深圳市南山区科技园路1号软件产业基地',
            '杭州西湖区': '浙江省杭州市西湖区文三路90号数字产业园',
            '广州天河区': '广东省广州市天河区珠江新城华夏路16号'
        };
        return addresses[locationName] || locationName + '充电站';
    }
    

    // 确认位置选择
    confirmLocation() {
        if (!this.tempLocation) {
            this.showToast('请先在地图上选择位置', 'error');
            return;
        }

        // 根据模式填充地址信息
        const prefix = this.locationPickerMode === 'edit' ? 'edit-' : '';
        const addressInput = document.getElementById(prefix + 'address-input');
        const latitudeInput = document.getElementById(prefix + 'latitude');
        const longitudeInput = document.getElementById(prefix + 'longitude');
        const locationDisplay = document.getElementById(prefix + 'location-display');

        // 填充表单数据
        if (addressInput) {
            addressInput.value = this.tempLocation.address;
            // 添加视觉反馈
            addressInput.style.background = '#e8f5e8';
            setTimeout(() => {
                addressInput.style.background = '';
            }, 2000);
        }
        
        if (latitudeInput) latitudeInput.value = this.tempLocation.lat;
        if (longitudeInput) longitudeInput.value = this.tempLocation.lng;
        if (locationDisplay) {
            locationDisplay.innerHTML = '';
        }

        // 关闭地图弹窗
        const modal = document.querySelector('.map-picker-modal');
        if (modal) modal.remove();
        
        this.showToast('✅ 位置已选择并自动填入地址', 'success');
        
        // 清除临时数据
        this.tempLocation = null;
        this.locationPickerMode = 'add';
    }

    // 搜索位置（模拟）
    searchLocation() {
        const searchInput = document.getElementById('location-search');
        const keyword = searchInput.value.trim();
        
        if (!keyword) {
            this.showToast('请输入搜索关键词', 'warning');
            return;
        }
        
        // 模拟搜索结果
        const mockResults = [
            { name: '北京朝阳区', x: 70, y: 30 },
            { name: '上海浦东区', x: 80, y: 50 },
            { name: '深圳南山区', x: 65, y: 80 },
            { name: '杭州西湖区', x: 75, y: 45 },
            { name: '广州天河区', x: 60, y: 75 }
        ];
        
        // 模糊匹配
        const matched = mockResults.find(item => 
            item.name.includes(keyword) || keyword.includes(item.name.substring(0, 2))
        );
        
        if (matched) {
            // 自动选择匹配的位置
            this.selectLocation(matched.name, matched.x, matched.y, true);
            this.showToast(`找到位置: ${matched.name}`, 'success');
        } else {
            this.showToast('未找到相关位置，请在地图上手动选择', 'info');
        }
    }

    // 绑定地图点击事件
    bindMapClickEvents() {
        const mapContainer = document.getElementById('map-container');
        mapContainer.addEventListener('click', (e) => {
            // 检查是否点击了地图背景区域
            if (e.target === mapContainer || e.target.id === 'map-background' || 
                (e.target.parentElement && e.target.parentElement.id === 'map-background')) {
                
                const rect = mapContainer.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width * 100).toFixed(1);
                const y = ((e.clientY - rect.top) / rect.height * 100).toFixed(1);
                
                // 根据点击位置生成地址
                const address = this.generateAddressByCoords(x, y);
                
                // 使用统一的选择位置方法
                this.selectLocation(address, x, y, false);
            }
        });
    }
    
    // 根据坐标生成地址
    generateAddressByCoords(x, y) {
        // 根据位置判断大概的城市区域
        let city = '';
        let district = '';
        
        if (x < 40) {
            city = '西部地区';
            district = x < 20 ? '新疆' : '四川';
        } else if (x < 60) {
            city = '中部地区';
            district = y < 50 ? '河南' : '湖南';
        } else {
            city = '东部地区';
            district = y < 50 ? '山东' : '江苏';
        }
        
        // 生成随机街道号
        const streetNum = Math.floor(Math.random() * 500) + 1;
        const roads = ['创新路', '科技路', '发展大道', '未来路', '智慧街'];
        const road = roads[Math.floor(Math.random() * roads.length)];
        
        return `${district}省${city}${road}${streetNum}号`;
    }

    handleAddStation(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        
        
        // 构建新电站数据
        const newStation = {
            id: formData.get('stationId'),
            name: formData.get('stationName'),
            address: formData.get('address'),
            latitude: formData.get('latitude'),
            longitude: formData.get('longitude'),
            devices: parseInt(formData.get('devices')),
            onlineRate: Math.random() * 30 + 70, // 模拟在线率
            revenue: Math.floor(Math.random() * 10000 + 5000), // 模拟收入
            status: 'active', // 默认设置为运营中
            power: formData.get('power') || 0,
            contact: formData.get('contact'),
            phone: formData.get('phone'),
            operationStatus: formData.get('operationStatus'),
            remark: formData.get('remark')
        };

        // 添加到数据数组
        if (!this.stationsData) {
            this.stationsData = [];
        }
        this.stationsData.unshift(newStation); // 添加到开头

        // 关闭弹窗
        document.querySelector('.station-modal').remove();

        // 刷新页面
        this.switchPage('stations');
        
        // 显示成功提示
        this.showToast(`电站 "${newStation.name}" 添加成功！`, 'success');
    }

    viewStation(stationId) {
        const station = this.stationsData.find(s => s.id === stationId);
        if (!station) return;

        const modal = document.createElement('div');
        modal.className = 'station-modal';
        modal.innerHTML = `
            <div class="modal-overlay" onclick="this.parentElement.remove()"></div>
            <div class="modal-content" style="max-width: 700px;">
                <div class="modal-header">
                    <h3>${station.name} - 详情</h3>
                    <button class="modal-close" onclick="this.closest('.station-modal').remove()">×</button>
                </div>
                <div class="modal-body">
                    <div class="detail-grid" style="display: grid; grid-template-columns: 1fr; gap: 20px;">
                        <div class="detail-item">
                            <label style="color: #999; font-size: 12px;">状态</label>
                            <div style="margin-top: 4px;">${this.getStationStatusBadge(station.status, station.operationStatus)}</div>
                        </div>
                        <div class="detail-item">
                            <label style="color: #999; font-size: 12px;">地址</label>
                            <div style="font-size: 16px; margin-top: 4px;">
                                ${station.address}
                                ${station.latitude && station.longitude ? 
                                    `<span style="font-size: 12px; color: #1890ff; margin-left: 10px; cursor: pointer;" 
                                           onclick="system.showLocationOnMap('${station.latitude}', '${station.longitude}')">
                                        📍 查看地图
                                    </span>` : ''}
                            </div>
                        </div>
                        <div class="detail-item">
                            <label style="color: #999; font-size: 12px;">充电桩数量</label>
                            <div style="font-size: 16px; margin-top: 4px;">${station.devices} 台</div>
                        </div>
                        <div class="detail-item">
                            <label style="color: #999; font-size: 12px;">在线率</label>
                            <div style="font-size: 16px; margin-top: 4px;">${station.onlineRate.toFixed(1)}%</div>
                        </div>
                        <div class="detail-item">
                            <label style="color: #999; font-size: 12px;">今日收入</label>
                            <div style="font-size: 16px; margin-top: 4px; color: #00AA00;">¥${station.revenue.toLocaleString()}</div>
                        </div>
                        <div class="detail-item">
                            <label style="color: #999; font-size: 12px;">总功率</label>
                            <div style="font-size: 16px; margin-top: 4px;">${station.power || 'N/A'} kW</div>
                        </div>
                        ${station.contact ? `
                        <div class="detail-item">
                            <label style="color: #999; font-size: 12px;">联系人</label>
                            <div style="font-size: 16px; margin-top: 4px;">${station.contact}</div>
                        </div>
                        ` : ''}
                        ${station.phone ? `
                        <div class="detail-item">
                            <label style="color: #999; font-size: 12px;">联系电话</label>
                            <div style="font-size: 16px; margin-top: 4px;">${station.phone}</div>
                        </div>
                        ` : ''}
                        ${station.remark ? `
                        <div class="detail-item" style="grid-column: 1 / -1;">
                            <label style="color: #999; font-size: 12px;">备注</label>
                            <div style="font-size: 14px; margin-top: 4px; color: #666;">${station.remark}</div>
                        </div>
                        ` : ''}
                    </div>
                    <div class="modal-footer" style="margin-top: 30px; justify-content: flex-end; display: flex; gap: 12px;">
                        <button class="btn" onclick="system.editStation('${station.id}')">编辑</button>
                        <button class="btn btn-primary" onclick="this.closest('.station-modal').remove()">关闭</button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    // 在地图上显示位置
    showLocationOnMap(lat, lng) {
        this.showToast(`坐标: ${lng}, ${lat} (实际应用中将打开地图)`, 'info');
    }

    // 获取使用中的充电桩数量
    getInUseCount(station) {
        // 根据在线率和运营状态模拟使用中的数量
        if (station.operationStatus === 'closed') {
            return 0;
        }
        
        // 基于在线率和一些随机因素计算使用中的数量
        const baseUsage = Math.floor(station.devices * (station.onlineRate / 100) * 0.7);
        const randomFactor = Math.floor(Math.random() * 3) - 1; // -1, 0, 1
        return Math.max(0, Math.min(station.devices, baseUsage + randomFactor));
    }

    // 排序电站数据
    sortStations(field) {
        if (!this.stationsData) return;

        // 重置所有排序图标为默认状态
        document.querySelectorAll('[id^="sort-"]').forEach(icon => {
            icon.innerHTML = `
                <svg width="12" height="12" viewBox="0 0 12 12" style="vertical-align: middle;">
                    <polyline points="4,3 6,1 8,3" fill="none" stroke="#ccc" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/>
                    <polyline points="4,9 6,11 8,9" fill="none" stroke="#ccc" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            `;
        });

        // 获取或初始化排序状态
        if (!this.sortState) this.sortState = {};
        
        // 三状态循环：无排序 → 升序 → 降序 → 无排序
        let currentState = this.sortState[field] || 'none';
        let nextState;
        
        switch (currentState) {
            case 'none':
                nextState = 'asc';
                break;
            case 'asc':
                nextState = 'desc';
                break;
            case 'desc':
                nextState = 'none';
                break;
            default:
                nextState = 'asc';
        }
        
        // 清除其他字段的排序状态
        this.sortState = { [field]: nextState };

        // 更新排序图标
        const sortIcon = document.getElementById(`sort-${field}`);
        if (sortIcon) {
            if (nextState === 'asc') {
                sortIcon.innerHTML = `
                    <svg width="12" height="12" viewBox="0 0 12 12" style="vertical-align: middle;">
                        <polyline points="4,3 6,1 8,3" fill="none" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        <polyline points="4,9 6,11 8,9" fill="none" stroke="#ccc" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                `;
            } else if (nextState === 'desc') {
                sortIcon.innerHTML = `
                    <svg width="12" height="12" viewBox="0 0 12 12" style="vertical-align: middle;">
                        <polyline points="4,3 6,1 8,3" fill="none" stroke="#ccc" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/>
                        <polyline points="4,9 6,11 8,9" fill="none" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                `;
            }
            // nextState === 'none' 时保持默认状态（已在上面设置）
        }

        // 如果是无排序状态，恢复原始顺序并退出
        if (nextState === 'none') {
            // 重新获取原始数据顺序
            this.stationsData = [
                { id: 'ST001', name: '北京朝阳充电站', address: '北京市朝阳区建国路88号', devices: 24, onlineRate: 95.8, revenue: 12456, status: 'active', operationStatus: 'operating' },
                { id: 'ST002', name: '上海浦东充电站', address: '上海市浦东新区世纪大道100号', devices: 32, onlineRate: 92.3, revenue: 18780, status: 'active', operationStatus: 'operating' },
                { id: 'ST003', name: '深圳南山充电站', address: '深圳市南山区科技园路1号', devices: 18, onlineRate: 88.9, revenue: 9234, status: 'maintenance', operationStatus: 'closed' },
                { id: 'ST004', name: '广州天河充电站', address: '广州市天河区珠江新城', devices: 28, onlineRate: 94.2, revenue: 15678, status: 'active', operationStatus: 'operating' }
            ];
            this.updateStationsTable();
            return;
        }

        // 排序数据
        this.stationsData.sort((a, b) => {
            let valueA, valueB;

            switch (field) {
                case 'devices':
                    valueA = a.devices;
                    valueB = b.devices;
                    break;
                case 'usageRate':
                    const inUseA = this.getInUseCount(a);
                    const inUseB = this.getInUseCount(b);
                    valueA = a.devices > 0 ? (inUseA / a.devices) * 100 : 0;
                    valueB = b.devices > 0 ? (inUseB / b.devices) * 100 : 0;
                    break;
                case 'idle':
                    valueA = a.devices - this.getInUseCount(a);
                    valueB = b.devices - this.getInUseCount(b);
                    break;
                case 'inUse':
                    valueA = this.getInUseCount(a);
                    valueB = this.getInUseCount(b);
                    break;
                default:
                    return 0;
            }

            if (nextState === 'asc') {
                return valueA - valueB;
            } else if (nextState === 'desc') {
                return valueB - valueA;
            }
            return 0;
        });

            // 只更新表格数据，不重新渲染整个页面
        this.updateStationsTable();
    }

    // 只更新电站表格数据
    updateStationsTable() {
        const tbody = document.getElementById('stations-tbody');
        if (!tbody) return;

        const stationRows = this.stationsData.map(station => {
            const inUse = this.getInUseCount(station);
            const idle = station.devices - inUse;
            const usageRate = station.devices > 0 ? ((inUse / station.devices) * 100).toFixed(1) : 0;
            
            return `
            <tr>
                <td>${station.name}</td>
                <td>${station.address}</td>
                <td>${station.devices}</td>
                <td>${usageRate}%</td>
                <td>${idle}</td>
                <td>${inUse}</td>
                <td>¥${station.revenue.toLocaleString()}</td>
                <td>${this.getStationStatusBadge(station.status, station.operationStatus)}</td>
                <td>
                    <button class="btn-text" onclick="system.viewStation('${station.id}')">查看</button>
                    <button class="btn-text" onclick="system.editStation('${station.id}')">编辑</button>
                    <button class="btn-text danger" onclick="system.deleteStation('${station.id}')">删除</button>
                </td>
            </tr>
            `;
        }).join('');

        tbody.innerHTML = stationRows;
    }

    editStation(stationId) {
        const station = this.stationsData.find(s => s.id === stationId);
        if (!station) return;

        // 关闭查看弹窗（如果存在）
        const viewModal = document.querySelector('.station-modal');
        if (viewModal) viewModal.remove();

        // 保存当前编辑的电站ID
        this.editingStationId = stationId;

        const modal = document.createElement('div');
        modal.className = 'station-modal';
        modal.innerHTML = `
            <div class="modal-overlay" onclick="this.parentElement.remove()"></div>
            <div class="modal-content" style="max-width: 600px;">
                <div class="modal-header">
                    <h3>编辑电站 - ${station.name}</h3>
                    <button class="modal-close" onclick="this.closest('.station-modal').remove()">×</button>
                </div>
                <div class="modal-body">
                    <form id="edit-station-form" onsubmit="system.handleEditStation(event, '${station.id}')">
                        <div class="form-grid" style="grid-template-columns: 1fr 1fr;">
                            <div class="form-group">
                                <label class="form-label">电站编号</label>
                                <input type="text" class="form-input" value="${station.id}" readonly style="background: #F5F5F5;">
                            </div>
                            <div class="form-group">
                                <label class="form-label">电站名称 *</label>
                                <input type="text" class="form-input" name="stationName" value="${station.name}" required>
                            </div>
                            <div class="form-group" style="grid-column: 1 / -1;">
                                <label class="form-label">详细地址 *</label>
                                <div style="display: flex; gap: 10px;">
                                    <input type="text" class="form-input" name="address" id="edit-address-input" value="${station.address}" required style="flex: 1;">
                                    <button type="button" class="btn" onclick="system.openLocationPicker('edit')" style="padding: 10px 20px;">
                                        📍 地图选址
                                    </button>
                                </div>
                                <input type="hidden" name="latitude" id="edit-latitude" value="${station.latitude || ''}">
                                <input type="hidden" name="longitude" id="edit-longitude" value="${station.longitude || ''}">
                                <div id="edit-location-display" style="margin-top: 8px; font-size: 12px; color: #999;">
                                    ${station.latitude && station.longitude ? 
                                        `<div style="color: #00AA00; font-weight: 500;">📍 当前位置已设置</div>
                                         <div style="color: #999; font-size: 11px; margin-top: 2px;">坐标: ${station.longitude}, ${station.latitude}</div>` : 
                                        '未设置位置信息'}
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="form-label">充电桩数量 *</label>
                                <input type="number" class="form-input" name="devices" value="${station.devices}" min="1" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label">总功率 (kW)</label>
                                <input type="number" class="form-input" name="power" value="${station.power || ''}" min="0">
                            </div>
                            <div class="form-group">
                                <label class="form-label">联系人</label>
                                <input type="text" class="form-input" name="contact" value="${station.contact || ''}">
                            </div>
                            <div class="form-group">
                                <label class="form-label">联系电话</label>
                                <input type="tel" class="form-input" name="phone" value="${station.phone || ''}">
                            </div>
                            <div class="form-group">
                                <label class="form-label">运营状态</label>
                                <select class="form-select" name="operationStatus">
                                    <option value="operating" ${(station.operationStatus === 'operating' || !station.operationStatus) ? 'selected' : ''}>营业</option>
                                    <option value="closed" ${station.operationStatus === 'closed' ? 'selected' : ''}>未营业</option>
                                </select>
                            </div>
                            <div class="form-group" style="grid-column: 1 / -1;">
                                <label class="form-label">备注</label>
                                <textarea class="form-input" name="remark" rows="3">${station.remark || ''}</textarea>
                            </div>
                        </div>
                        <div class="modal-footer" style="margin-top: 30px; justify-content: flex-end; display: flex; gap: 12px;">
                            <button type="button" class="btn" onclick="this.closest('.station-modal').remove()">取消</button>
                            <button type="submit" class="btn btn-primary">保存修改</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    handleEditStation(event, stationId) {
        event.preventDefault();
        const formData = new FormData(event.target);
        
        
        // 找到并更新电站数据
        const stationIndex = this.stationsData.findIndex(s => s.id === stationId);
        if (stationIndex !== -1) {
            this.stationsData[stationIndex] = {
                ...this.stationsData[stationIndex],
                name: formData.get('stationName'),
                address: formData.get('address'),
                latitude: formData.get('latitude'),
                longitude: formData.get('longitude'),
                devices: parseInt(formData.get('devices')),
                power: formData.get('power') || 0,
                contact: formData.get('contact'),
                phone: formData.get('phone'),
                operationStatus: formData.get('operationStatus'),
                remark: formData.get('remark')
            };
        }

        // 关闭弹窗
        document.querySelector('.station-modal').remove();

        // 刷新页面
        this.switchPage('stations');
        
        // 显示成功提示
        this.showToast('电站信息更新成功！', 'success');
    }

    deleteStation(stationId) {
        const station = this.stationsData.find(s => s.id === stationId);
        if (!station) return;

        const confirmModal = document.createElement('div');
        confirmModal.className = 'confirm-modal';
        confirmModal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
        `;
        confirmModal.innerHTML = `
            <div class="modal-overlay" onclick="this.parentElement.remove()" style="position: absolute; width: 100%; height: 100%;"></div>
            <div class="modal-content" style="
                background: white;
                border-radius: 8px;
                max-width: 400px;
                width: 90%;
                position: relative;
                z-index: 1;
            ">
                <div class="modal-header" style="padding: 20px 24px 16px; border-bottom: 1px solid #f0f0f0;">
                    <h3 style="margin: 0; font-size: 18px; font-weight: 600;">确认删除</h3>
                </div>
                <div class="modal-body" style="padding: 20px 24px;">
                    <p style="margin: 0 0 12px; font-size: 14px;">确定要删除电站 "<strong>${station.name}</strong>" 吗？</p>
                    <p style="color: #FF3333; margin: 0; font-size: 13px;">此操作不可恢复！</p>
                </div>
                <div class="modal-footer" style="
                    padding: 16px 24px 20px;
                    border-top: 1px solid #f0f0f0;
                    display: flex;
                    justify-content: flex-end;
                    gap: 12px;
                ">
                    <button class="btn" onclick="this.closest('.confirm-modal').remove()" style="
                        padding: 8px 16px;
                        border: 1px solid #ddd;
                        background: white;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 14px;
                    ">取消</button>
                    <button class="btn btn-primary" onclick="system.confirmDeleteStation('${stationId}')" style="
                        padding: 8px 16px;
                        background: #FF3333;
                        color: white;
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 14px;
                    ">确认删除</button>
                </div>
            </div>
        `;
        document.body.appendChild(confirmModal);
    }

    confirmDeleteStation(stationId) {
        // 删除电站
        this.stationsData = this.stationsData.filter(s => s.id !== stationId);
        
        // 关闭确认弹窗
        document.querySelector('.confirm-modal').remove();
        
        // 只更新表格内容，不刷新整个页面
        this.updateStationsTable();
        
        // 显示成功提示
        this.showToast('电站删除成功！', 'success');
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            background: ${type === 'success' ? '#00AA00' : type === 'error' ? '#FF3333' : '#333'};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            font-size: 14px;
            z-index: 10000;
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.3s ease;
            max-width: 350px;
        `;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateY(0)';
        }, 100);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(20px)';
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }

    startCharging(gunId) {
        const [deviceId, gunNumber] = gunId.split('-G');
        this.showToast(`${gunId} 充电启动成功`, 'success');
        document.querySelector('.gun-control-modal').remove();
    }

    stopCharging(gunId) {
        const [deviceId, gunNumber] = gunId.split('-G');
        this.showToast(`${gunId} 充电已停止`, 'success');
        document.querySelector('.gun-control-modal').remove();
    }

    resetGun(gunId) {
        const [deviceId, gunNumber] = gunId.split('-G');
        this.showToast(`${gunId} 重置成功`, 'success');
        document.querySelector('.gun-control-modal').remove();
    }

    lockGun(gunId) {
        const [deviceId, gunNumber] = gunId.split('-G');
        this.showToast(`${gunId} 已锁定`, 'success');
        document.querySelector('.gun-control-modal').remove();
    }
}

// 添加CSS动画样式
const style = document.createElement('style');
style.textContent = `
    /* 页面切换动画优化 */
    .page-title, .page-subtitle {
        transition: opacity 0.3s ease;
    }

    /* 元素入场动画 */
    .animated-entrance {
        animation: slideInUp 0.5s ease forwards;
    }

    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    /* 统计卡片悬停效果 */
    .stat-card {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .stat-card:hover {
        transform: translateY(-4px) scale(1.02);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    }

    /* 按钮和输入框动效 */
    .btn, .search-box, .form-input, .form-select {
        transition: all 0.3s ease;
    }

    /* 地图标记动画 */
    .map-marker-container {
        transition: all 0.3s ease;
    }

    .map-marker-container:hover {
        transform: scale(1.1);
        z-index: 10;
    }

    /* 表格行悬停效果 */
    .data-table tbody tr {
        transition: background-color 0.2s ease;
    }

    .data-table tbody tr:hover {
        background-color: rgba(0, 0, 0, 0.02);
    }

    /* 导航链接优化 */
    .nav-link {
        position: relative;
        transition: all 0.2s ease;
    }

    .nav-link::after {
        transition: all 0.2s ease;
    }

    .nav-link:not(.exit):hover {
        transform: translateY(-2px);
    }

    /* 排行榜条形图动画 */
    .rank-bar {
        transform: scaleX(0);
        transform-origin: left;
        transition: transform 0.5s ease;
    }

    /* 使用率条形图动画 */
    .usage-fill {
        transform: scaleX(0);
        transform-origin: left;
        transition: transform 0.5s ease;
    }

    /* 电站弹窗样式 */
    .station-modal {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
    }

    .station-modal .modal-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        cursor: pointer;
    }

    .station-modal .modal-content {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        border-radius: 16px;
        padding: 30px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
        animation: slideUp 0.3s ease;
    }

    .station-modal .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 30px;
    }

    .station-modal .modal-header h3 {
        margin: 0;
        font-size: 24px;
        font-weight: 500;
    }

    .station-modal .modal-close {
        background: none;
        border: none;
        font-size: 28px;
        cursor: pointer;
        color: #999;
        line-height: 1;
        padding: 0;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: color 0.3s ease;
    }

    .station-modal .modal-close:hover {
        color: #333;
    }

    .station-modal .form-grid {
        display: grid;
        gap: 20px;
    }

    .station-modal .form-group {
        display: flex;
        flex-direction: column;
    }

    .station-modal .form-label {
        font-size: 14px;
        color: #666;
        margin-bottom: 8px;
    }

    .station-modal .form-input,
    .station-modal .form-select,
    .station-modal textarea {
        padding: 10px 12px;
        border: 1px solid #E5E5E5;
        border-radius: 8px;
        font-size: 14px;
        transition: all 0.3s ease;
    }

    .station-modal .form-input:focus,
    .station-modal .form-select:focus,
    .station-modal textarea:focus {
        outline: none;
        border-color: #000;
        box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.05);
    }

    .station-modal textarea {
        resize: vertical;
        min-height: 80px;
        font-family: inherit;
    }

    /* 操作按钮样式 */
    .btn-text {
        background: none;
        border: none;
        color: #1890ff;
        cursor: pointer;
        padding: 4px 8px;
        font-size: 14px;
        transition: color 0.3s ease;
        margin: 0 4px;
    }

    .btn-text:hover {
        color: #40a9ff;
        text-decoration: underline;
    }

    .btn-text.danger {
        color: #ff4d4f;
    }

    .btn-text.danger:hover {
        color: #ff7875;
    }

    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    @keyframes slideUp {
        from {
            transform: translate(-50%, -40%);
            opacity: 0;
        }
        to {
            transform: translate(-50%, -50%);
            opacity: 1;
        }
    }
    
    @keyframes fadeInBg {
        from { background: rgba(0, 0, 0, 0); }
        to { background: rgba(0, 0, 0, 0.5); }
    }
    
    @keyframes fadeInScale {
        from {
            opacity: 0;
            transform: scale(0.95);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }

    /* 地图选择器弹窗样式 */
    .map-picker-modal {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 10001;
        animation: fadeIn 0.3s ease;
    }

    .map-picker-modal .modal-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        cursor: pointer;
    }

    .map-picker-modal .modal-content {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        border-radius: 16px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
        animation: slideUp 0.3s ease;
        display: flex;
        flex-direction: column;
    }

    .map-picker-modal .modal-header {
        padding: 20px 30px;
        border-bottom: 1px solid #e5e5e5;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .map-picker-modal .modal-body {
        flex: 1;
        overflow: auto;
    }

    #map-container {
        cursor: crosshair;
    }

    .mock-marker {
        z-index: 10;
        transition: transform 0.2s ease;
    }

    .mock-marker:hover {
        transform: translate(-50%, -50%) scale(1.1);
        z-index: 20;
    }
`;
document.head.appendChild(style);

// 初始化系统
let system;
try {
    system = new EnterpriseSystem();
    console.log('✅ EnterpriseSystem 初始化成功');
} catch (error) {
    console.error('❌ EnterpriseSystem 初始化失败:', error);
    console.error('错误堆栈:', error.stack);
    // 尝试创建一个基础版本
    system = {
        showDeviceDetail: function(deviceId) {
            alert('设备详情功能暂时不可用，正在修复中...');
        }
    };
}