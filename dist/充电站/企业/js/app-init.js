// 应用初始化和路由配置

// 页面内容模板
const pageTemplates = {
    dashboard: () => `
        <div class="container">
            <header class="page-header">
                <h1 class="page-title">数据概览</h1>
                <p class="page-subtitle">实时监控充电站运营状态</p>
            </header>
            <div id="page-content" class="page-content">
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
                    <div id="station-map-view" class="station-map-view active">
                        <div id="station-map" class="station-map-fullscreen"></div>
                    </div>
                </div>

                <div class="multi-analysis-grid">
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
                            ${[
                                ['北京朝阳充电站', '8,456 kWh', 100],
                                ['上海浦东充电站', '7,234 kWh', 85],
                                ['深圳南山充电站', '6,789 kWh', 80],
                                ['广州天河充电站', '5,678 kWh', 67],
                                ['杭州西湖充电站', '4,567 kWh', 54]
                            ].map((item, i) => `
                                <div class="ranking-item">
                                    <span class="rank-num">${i + 1}</span>
                                    <div class="rank-info">
                                        <div class="rank-name">${item[0]}</div>
                                        <div class="rank-value">${item[1]}</div>
                                    </div>
                                    <div class="rank-bar" style="width: ${item[2]}%;"></div>
                                </div>
                            `).join('')}
                        </div>
                    </div>

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
                            ${[
                                ['上海浦东充电站', '¥18,780', 100],
                                ['北京朝阳充电站', '¥16,456', 87],
                                ['深圳南山充电站', '¥14,234', 76],
                                ['广州天河充电站', '¥12,678', 67],
                                ['成都高新充电站', '¥10,456', 56]
                            ].map((item, i) => `
                                <div class="ranking-item">
                                    <span class="rank-num">${i + 1}</span>
                                    <div class="rank-info">
                                        <div class="rank-name">${item[0]}</div>
                                        <div class="rank-value">${item[1]}</div>
                                    </div>
                                    <div class="rank-bar revenue" style="width: ${item[2]}%;"></div>
                                </div>
                            `).join('')}
                        </div>
                    </div>

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
                                <div class="time-bars" id="time-bars"></div>
                                <div class="time-axis">
                                    <span>0</span><span>6</span><span>12</span><span>18</span><span>24</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,

    stations: () => `
        <div class="container">
            <header class="page-header">
                <h1 class="page-title">电站管理</h1>
                <p class="page-subtitle">管理和监控所有充电站点</p>
            </header>
            <div id="page-content" class="page-content">
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
                                        <th>操作</th>
                                    </tr>
                                </thead>
                                <tbody id="stations-tbody"></tbody>
                            </table>
                        </div>
                    </div>
                    <div class="pagination" id="pagination"></div>
                </div>
            </div>
        </div>
    `,

    devices: () => `
        <div class="container">
            <header class="page-header">
                <h1 class="page-title">设备管理</h1>
                <p class="page-subtitle">充电设备状态与控制中心</p>
            </header>
            <div id="page-content" class="page-content">
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
                </div>
            </div>
        </div>
    `,

    orders: () => `
        <div class="container">
            <header class="page-header">
                <h1 class="page-title">订单管理</h1>
                <p class="page-subtitle">订单处理与交易记录</p>
            </header>
            <div id="page-content" class="page-content">
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
            </div>
        </div>
    `,

    users: () => `
        <div class="container">
            <header class="page-header">
                <h1 class="page-title">用户管理</h1>
                <p class="page-subtitle">用户信息与服务管理</p>
            </header>
            <div id="page-content" class="page-content">
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
            </div>
        </div>
    `,

    finance: () => `
        <div class="container">
            <header class="page-header">
                <h1 class="page-title">财务统计</h1>
                <p class="page-subtitle">收入分析与财务报表</p>
            </header>
            <div id="page-content" class="page-content">
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
            </div>
        </div>
    `,

    maintenance: () => `
        <div class="container">
            <header class="page-header">
                <h1 class="page-title">维护管理</h1>
                <p class="page-subtitle">设备维护与故障处理</p>
            </header>
            <div id="page-content" class="page-content">
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
            </div>
        </div>
    `,

    settings: () => `
        <div class="container">
            <header class="page-header">
                <h1 class="page-title">系统设置</h1>
                <p class="page-subtitle">配置系统参数与权限</p>
            </header>
            <div id="page-content" class="page-content">
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
                    </div>
                    <div style="margin-top: 60px;">
                        <button class="btn btn-primary">保存设置</button>
                        <button class="btn" style="margin-left: 16px;">取消</button>
                    </div>
                </div>
            </div>
        </div>
    `
};

// 注册路由
Object.keys(pageTemplates).forEach(route => {
    router.register(route, {
        title: {
            dashboard: '数据概览 - 充电站企业管理系统',
            stations: '电站管理 - 充电站企业管理系统',
            devices: '设备管理 - 充电站企业管理系统',
            orders: '订单管理 - 充电站企业管理系统',
            users: '用户管理 - 充电站企业管理系统',
            finance: '财务统计 - 充电站企业管理系统',
            maintenance: '维护管理 - 充电站企业管理系统',
            settings: '系统设置 - 充电站企业管理系统'
        }[route],
        loadContent: async () => pageTemplates[route](),
        loadModule: async () => window.pageModules[route]
    });
});

// 应用初始化
document.addEventListener('DOMContentLoaded', () => {
    // 获取初始路由
    const hash = window.location.hash.slice(1);
    const initialRoute = hash || 'dashboard';
    
    // 导航到初始路由
    router.navigate(initialRoute, false);
    
    // 预加载其他页面以提升性能
    setTimeout(() => {
        router.preload(['stations', 'devices', 'orders']);
    }, 1000);
});

// 全局错误处理
window.addEventListener('error', (e) => {
    console.error('Global error:', e);
});

// 性能监控
if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
            console.log('Performance:', entry.name, entry.duration);
        }
    });
    observer.observe({ entryTypes: ['navigation', 'resource'] });
}