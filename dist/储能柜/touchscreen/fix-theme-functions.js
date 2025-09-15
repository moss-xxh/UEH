// 修复所有页面的主题函数
// 这个文件包含了需要在每个页面中替换的正确的主题函数

// 正确的切换主题函数
function switchTheme() {
    // 显示主题选择器
    if (window.ThemeManager) {
        ThemeManager.showThemePicker();
    } else {
        console.error('ThemeManager not loaded');
    }
}

// 正确的应用主题函数 - 不再使用filter
function applyTheme() {
    // 由 ThemeManager 处理所有主题应用逻辑
    // 不需要手动设置样式
    const theme = localStorage.getItem('touchscreen_theme') || 'light';
    if (window.ThemeManager) {
        ThemeManager.applyTheme(theme);
    }
}

// 页面加载时的主题初始化
function initTheme() {
    // 确保主题管理器已加载
    if (window.ThemeManager) {
        const savedTheme = localStorage.getItem('touchscreen_theme') || 'light';
        ThemeManager.applyTheme(savedTheme);
    }
}