// 全局状态
let currentTheme = localStorage.getItem('theme') || 'light';
let currentLang = localStorage.getItem('language') || 'zh';
let sidebarOpen = true;

// 用户下拉菜单功能
function toggleUserDropdown(event) {
    if (event) {
        event.stopPropagation();
    }
    const dropdown = document.getElementById('userDropdown');
    if (dropdown) {
        dropdown.classList.toggle('show');
    }
}

// 点击其他地方关闭下拉菜单
document.addEventListener('click', function() {
    const dropdown = document.getElementById('userDropdown');
    if (dropdown) {
        dropdown.classList.remove('show');
    }
});

// 确认退出
function confirmLogout(event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    const modal = document.getElementById('logoutModal');
    if (modal) {
        modal.style.display = 'flex';
    }
}

// 关闭退出弹窗
function closeLogoutModal() {
    const modal = document.getElementById('logoutModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// 翻译对象
const translations = {
    zh: {
        loginTitle: '欢迎回来',
        loginSubtitle: '登录您的储能管理账户',
        rememberLabel: '记住我',
        forgotLink: '忘记密码？',
        loginBtnText: '登录',
        dividerText: '或',
        noAccountText: '还没有账户？',
        registerLink: '创建账户',
        userName: '管理员',
        menuDashboard: '仪表盘',
        menuDevices: '设备管理',
        menuMonitoring: '数据监控',
        menuControl: '设备控制',
        menuAlarms: '告警管理',
        menuReports: '报告中心',
        menuSystem: '系统管理',
        dashboardTitle: '仪表盘',
        dashboardSubtitle: '储能系统运行概览',
        devicesTitle: '设备管理',
        devicesSubtitle: '管理所有储能设备',
        monitoringTitle: '数据监控',
        monitoringSubtitle: '实时监控系统运行状态',
        totalPowerLabel: '总功率 (kW)',
        avgSocLabel: '平均SOC (%)',
        efficiencyLabel: '系统效率 (%)',
        avgTempLabel: '平均温度 (°C)',
        powerTrendTitle: '功率趋势图',
        energyDiagramTitle: '能量图',
        settingsBtn: '设置',
        solarLabel: '光伏',
        loadLabel: '负载',
        storageLabel: '储能',
        gridLabel: '电网',
        solarStatsTitle: '光伏',
        storageStatsTitle: '储能',
        revenueStatsTitle: '收益',
        dailyGeneration: '日发电量',
        totalGeneration: '总发电量',
        dailyCharge: '日充电量',
        totalCharge: '累计充电量',
        dailyDischarge: '日放电量',
        totalDischarge: '累计放电量',
        yesterdayRevenue: '昨日收益',
        todayRevenue: '今日收益',
        monthlyRevenue: '当月收益',
        totalRevenue: '累计收益'
    },
    en: {
        loginTitle: 'Welcome Back',
        loginSubtitle: 'Sign in to your energy management account',
        rememberLabel: 'Remember me',
        forgotLink: 'Forgot password?',
        loginBtnText: 'Sign In',
        dividerText: 'Or',
        noAccountText: "Don't have an account?",
        registerLink: 'Create Account',
        userName: 'Administrator',
        menuDashboard: 'Dashboard',
        menuDevices: 'Device Management',
        menuMonitoring: 'Data Monitoring',
        menuControl: 'Device Control',
        menuAlarms: 'Alarm Management',
        menuReports: 'Reports',
        menuSystem: 'System Management',
        dashboardTitle: 'Dashboard',
        dashboardSubtitle: 'Energy system operation overview',
        devicesTitle: 'Device Management',
        devicesSubtitle: 'Manage all energy storage devices',
        monitoringTitle: 'Data Monitoring',
        monitoringSubtitle: 'Real-time monitoring of system status',
        totalPowerLabel: 'Total Power (kW)',
        avgSocLabel: 'Average SOC (%)',
        efficiencyLabel: 'System Efficiency (%)',
        avgTempLabel: 'Average Temperature (°C)',
        powerTrendTitle: 'Power Trend Chart',
        energyDiagramTitle: 'Energy Flow',
        settingsBtn: 'Settings',
        solarLabel: 'Solar',
        loadLabel: 'Load',
        storageLabel: 'Storage',
        gridLabel: 'Grid',
        solarStatsTitle: 'Solar',
        storageStatsTitle: 'Storage',
        revenueStatsTitle: 'Revenue',
        dailyGeneration: 'Daily Generation',
        totalGeneration: 'Total Generation',
        dailyCharge: 'Daily Charge',
        totalCharge: 'Total Charge',
        dailyDischarge: 'Daily Discharge',
        totalDischarge: 'Total Discharge',
        yesterdayRevenue: 'Yesterday Revenue',
        todayRevenue: 'Today Revenue',
        monthlyRevenue: 'Monthly Revenue',
        totalRevenue: 'Total Revenue'
    }
};

// 初始化页面
document.addEventListener('DOMContentLoaded', function() {
    // 设置主题和语言
    setTheme(currentTheme);
    setLanguage(currentLang);
    
    // 添加加载动画
    setTimeout(() => {
        document.querySelectorAll('.fade-in').forEach(el => {
            el.style.opacity = '1';
        });
    }, 100);
});

// 主题切换
function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(currentTheme);
    localStorage.setItem('theme', currentTheme);
}

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const themeIcons = document.querySelectorAll('#themeIcon, #headerThemeIcon');
    themeIcons.forEach(icon => {
        icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    });
}

// 语言切换
function toggleLanguage() {
    currentLang = currentLang === 'zh' ? 'en' : 'zh';
    setLanguage(currentLang);
    localStorage.setItem('language', currentLang);
}

function setLanguage(lang) {
    const t = translations[lang];
    if (!t) return;

    // 更新所有翻译文本
    Object.keys(t).forEach(key => {
        const element = document.getElementById(key);
        if (element) {
            if (element.tagName === 'INPUT' && element.type === 'text') {
                element.placeholder = t[key];
            } else {
                element.textContent = t[key];
            }
        }
    });

    // 更新HTML语言属性
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en-US';
}

// 侧边栏切换
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
    const overlay = document.getElementById('mobileOverlay');
    
    if (window.innerWidth <= 768) {
        // 移动端：显示/隐藏侧边栏
        sidebar.classList.toggle('mobile-open');
        overlay.classList.toggle('hidden');
    } else {
        // 桌面端：收缩/展开侧边栏
        sidebarOpen = !sidebarOpen;
        if (sidebarOpen) {
            sidebar.classList.remove('collapsed');
            mainContent.classList.remove('expanded');
        } else {
            sidebar.classList.add('collapsed');
            mainContent.classList.add('expanded');
        }
    }
}

function closeMobileSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('mobileOverlay');
    
    sidebar.classList.remove('mobile-open');
    overlay.classList.add('hidden');
}

// 响应式处理
window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
        // 桌面端：关闭移动端菜单
        document.getElementById('sidebar').classList.remove('mobile-open');
        document.getElementById('mobileOverlay').classList.add('hidden');
    }
});

// 模拟实时数据更新
function updateRealTimeData() {
    // 更新仪表数据
    const metrics = document.querySelectorAll('.metric-value');
    metrics.forEach(metric => {
        const currentValue = parseFloat(metric.textContent);
        const change = (Math.random() - 0.5) * 10;
        const newValue = Math.max(0, currentValue + change);
        
        if (metric.textContent.includes('kW')) {
            metric.innerHTML = Math.round(newValue) + '<span style="font-size: 1rem; font-weight: 400; color: var(--text-secondary);">kW</span>';
        } else if (metric.textContent.includes('%')) {
            metric.innerHTML = newValue.toFixed(1) + '<span style="font-size: 1rem; font-weight: 400; color: var(--text-secondary);">%</span>';
        } else if (metric.textContent.includes('°C')) {
            metric.innerHTML = newValue.toFixed(1) + '<span style="font-size: 1rem; font-weight: 400; color: var(--text-secondary);">°C</span>';
        }
    });

    // 更新进度条
    const progressBars = document.querySelectorAll('.progress-fill');
    progressBars.forEach(bar => {
        const currentWidth = parseFloat(bar.style.width);
        const change = (Math.random() - 0.5) * 5;
        const newWidth = Math.max(0, Math.min(100, currentWidth + change));
        bar.style.width = newWidth + '%';
    });
}

// 设置当前页面的菜单项为激活状态
function setActiveMenuItem(menuId) {
    // 移除所有激活状态
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // 设置当前页面菜单项为激活状态
    const activeItem = document.querySelector(`.menu-item[data-menu="${menuId}"]`);
    if (activeItem) {
        activeItem.classList.add('active');
    }
}

// 检查登录状态（已禁用，允许直接访问所有页面）
function checkAuth() {
    // 注释掉登录验证，允许直接访问所有页面
    // const isLoggedIn = localStorage.getItem('isLoggedIn');
    // if (!isLoggedIn && !window.location.pathname.includes('login.html')) {
    //     window.location.href = 'login.html';
    // }
}

// 登出功能
function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    window.location.href = 'login.html';
}