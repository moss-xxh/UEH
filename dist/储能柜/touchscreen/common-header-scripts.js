// 共享的头部脚本 - 语言切换和退出功能
console.log('common-header-scripts.js loading...');

// 当前语言设置
let currentLang = localStorage.getItem('language') || 'zh';

// 翻译文本
const translations = {
    zh: {
        cancel: '取消',
        confirm: '确定',
        logoutTitle: '退出登录',
        logoutMessage: '您确定要退出当前账户吗？退出后需要重新登录。',
        logout: '退出'
    },
    en: {
        cancel: 'Cancel',
        confirm: 'Confirm',
        logoutTitle: 'Logout',
        logoutMessage: 'Are you sure you want to logout? You will need to login again.',
        logout: 'Logout'
    }
};

// 切换语言下拉菜单
function toggleLanguageDropdown(event) {
    event.stopPropagation();
    const dropdown = document.getElementById('langDropdown');
    dropdown.classList.toggle('show');
}

// 更改语言
function changeLanguage(lang, event) {
    event.stopPropagation();
    
    // 更新选中状态
    document.querySelectorAll('.lang-option').forEach(option => {
        option.classList.remove('active');
    });
    event.target.closest('.lang-option').classList.add('active');
    
    // 保存语言设置
    currentLang = lang;
    localStorage.setItem('language', lang);
    
    // 关闭下拉菜单
    document.getElementById('langDropdown').classList.remove('show');
    
    // 如果页面有语言切换功能，调用它
    if (typeof applyLanguage === 'function') {
        applyLanguage(lang);
    }
}


// 退出登录相关函数
function logout() {
    console.log('logout function called');
    // 显示退出确认弹窗
    const modal = document.getElementById('logoutModal');
    console.log('modal element:', modal);
    if (modal) {
        modal.classList.add('show');
        // 更新弹窗文本
        updateLogoutModalText();
    } else {
        console.error('logoutModal element not found!');
    }
}

function closeLogoutModal() {
    const modal = document.getElementById('logoutModal');
    if (modal) {
        modal.classList.remove('show');
    }
}

function confirmLogout() {
    // 清除登录信息
    localStorage.removeItem('touchscreen_user');
    sessionStorage.removeItem('touchscreen_user');
    localStorage.removeItem('login_time');
    
    // 跳转到登录页
    window.location.href = 'login.html';
}

// 更新退出弹窗文本
function updateLogoutModalText() {
    const titleEl = document.getElementById('logoutTitle');
    const messageEl = document.getElementById('logoutMessage');
    const cancelBtn = document.getElementById('logoutCancelBtn');
    const confirmBtn = document.getElementById('logoutConfirmBtn');
    
    if (titleEl) titleEl.textContent = translations[currentLang].logoutTitle;
    if (messageEl) messageEl.textContent = translations[currentLang].logoutMessage;
    if (cancelBtn) cancelBtn.innerHTML = `<i class="fas fa-times"></i> ${translations[currentLang].cancel}`;
    if (confirmBtn) confirmBtn.innerHTML = `<i class="fas fa-sign-out-alt"></i> ${translations[currentLang].logout}`;
}

// 初始化头部功能
function initializeHeader() {
    // 设置语言选项的激活状态
    document.querySelectorAll('.lang-option').forEach(option => {
        const isCurrentLang = option.getAttribute('onclick').includes(`'${currentLang}'`);
        if (isCurrentLang) {
            option.classList.add('active');
        } else {
            option.classList.remove('active');
        }
    });
    
    // 点击其他地方关闭下拉菜单
    document.addEventListener('click', function(e) {
        const langSwitcher = document.querySelector('.lang-switcher');
        if (langSwitcher && !langSwitcher.contains(e.target)) {
            document.getElementById('langDropdown').classList.remove('show');
        }
        
        // 点击模态框外部关闭
        const logoutModal = document.getElementById('logoutModal');
        if (e.target === logoutModal) {
            closeLogoutModal();
        }
    });
}

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', initializeHeader);

// 确保函数在全局作用域可用
window.logout = logout;
window.closeLogoutModal = closeLogoutModal;
window.confirmLogout = confirmLogout;
window.changeLanguage = changeLanguage;
window.toggleLanguageDropdown = toggleLanguageDropdown;

console.log('common-header-scripts.js loaded successfully');
console.log('Available functions:', {
    logout: typeof window.logout,
    closeLogoutModal: typeof window.closeLogoutModal,
    confirmLogout: typeof window.confirmLogout
});