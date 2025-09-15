// 通用的主题切换函数更新
// 将此函数添加到每个页面，替换原有的 switchTheme 函数

function switchTheme() {
    // 显示主题选择器而不是简单切换
    if (window.ThemeManager) {
        ThemeManager.showThemePicker();
    } else {
        // 如果ThemeManager未加载，使用备用方案
        const themes = ['light', 'dark', 'blue', 'green'];
        const currentTheme = localStorage.getItem('touchscreen_theme') || 'light';
        const currentIndex = themes.indexOf(currentTheme);
        const nextIndex = (currentIndex + 1) % themes.length;
        const nextTheme = themes[nextIndex];
        
        localStorage.setItem('touchscreen_theme', nextTheme);
        
        // 重新加载页面以应用新主题
        location.reload();
    }
}

// 确保主题正确应用的备用函数
function applyTheme() {
    const theme = localStorage.getItem('touchscreen_theme') || 'light';
    
    // 如果有ThemeManager，使用它
    if (window.ThemeManager) {
        ThemeManager.applyTheme(theme);
    } else {
        // 基础的主题应用逻辑
        document.body.setAttribute('data-theme', theme);
        document.body.className = document.body.className.replace(/theme-\w+/g, '');
        document.body.classList.add(`theme-${theme}`);
        
        // 基础的深色模式处理
        if (theme === 'dark' || theme === 'blue' || theme === 'green') {
            // 不再使用filter方式，而是依赖CSS
            document.body.style.filter = 'none';
        }
    }
}