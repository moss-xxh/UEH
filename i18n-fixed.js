/**
 * 修复版国际化系统
 * 解决页面加载时机问题
 */

// 等待原始i18n加载完成后再进行修复
function fixI18nSystem() {
    if (typeof I18n === 'undefined') {
        setTimeout(fixI18nSystem, 100);
        return;
    }

    // 备份原始方法
    const originalInit = I18n.prototype.init;
    const originalSetLanguage = I18n.prototype.setLanguage;
    const originalUpdatePageTexts = I18n.prototype.updatePageTexts;

    // 重写init方法
    I18n.prototype.init = function() {
        console.log('Fixed I18n init called');
        this.loadTranslations();
        this.createLanguageSelectorHTML();
        this.bindEvents();
        
        // 立即更新一次
        this.updatePageTexts();
        
        // 多次延迟更新，确保动态内容被翻译
        setTimeout(() => this.updatePageTexts(), 100);
        setTimeout(() => this.updatePageTexts(), 500);
        setTimeout(() => this.updatePageTexts(), 1000);
        setTimeout(() => this.updatePageTexts(), 2000);
        
        // 监听DOM变化
        this.observeDOM();
    };

    // 重写setLanguage方法
    I18n.prototype.setLanguage = function(language) {
        console.log('Fixed setLanguage called:', language);
        if (!this.supportedLanguages[language]) {
            console.warn(`Language ${language} is not supported`);
            return;
        }
        
        const oldLanguage = this.currentLanguage;
        this.currentLanguage = language;
        
        // 保存到本地存储
        this.saveLanguageToStorage(language);
        
        // 更新UI
        this.updateLanguageSelector();
        this.closeDropdown();
        
        // 多次更新确保所有内容都被翻译
        this.updatePageTexts();
        setTimeout(() => this.updatePageTexts(), 50);
        setTimeout(() => this.updatePageTexts(), 200);
        setTimeout(() => this.updatePageTexts(), 500);
        
        // 通知观察者
        this.notifyObservers(language, oldLanguage);
        
        // 重新渲染需要多语言的组件
        this.reloadComponents();

        // 更新导航栏
        if (window.headerNav && typeof window.headerNav.updateTexts === 'function') {
            window.headerNav.updateTexts();
        }
    };

    // 重写updatePageTexts方法
    I18n.prototype.updatePageTexts = function() {
        console.log('Fixed updatePageTexts called, current language:', this.currentLanguage);
        
        // 更新所有标记了 data-i18n 的元素
        const dataI18nElements = document.querySelectorAll('[data-i18n]');
        console.log('Found', dataI18nElements.length, 'elements with data-i18n');
        
        dataI18nElements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            const text = this.getText(key);
            if (text !== key) {
                if (element.tagName === 'INPUT' && (element.type === 'text' || element.type === 'search')) {
                    element.placeholder = text;
                } else {
                    element.textContent = text;
                }
            }
        });

        // 更新所有标记了 data-i18n-key 的元素
        const dataI18nKeyElements = document.querySelectorAll('[data-i18n-key]');
        console.log('Found', dataI18nKeyElements.length, 'elements with data-i18n-key');
        
        dataI18nKeyElements.forEach(el => {
            const key = el.getAttribute('data-i18n-key');
            const text = this.getText(key);
            if (text !== key) {
                if (el.tagName === 'INPUT' && (el.type === 'text' || el.type === 'search')) {
                    el.placeholder = text;
                } else if (el.tagName === 'TITLE') {
                    el.textContent = text;
                } else {
                    el.textContent = text;
                }
            }
        });
        
        // 处理其他i18n相关元素
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            const text = this.getText(key);
            if (text !== key) {
                el.placeholder = text;
            }
        });
        
        // 处理 data-i18n-title
        document.querySelectorAll('[data-i18n-title]').forEach(el => {
            const key = el.getAttribute('data-i18n-title');
            const text = this.getText(key);
            if (text !== key) {
                el.title = text;
            }
        });

        console.log('Fixed updatePageTexts completed');
        
        // 强制更新测试工具面板（即使它是隐藏的）
        const testPanel = document.getElementById('testToolsPanel');
        if (testPanel) {
            console.log('Force updating test tools panel translations');
            testPanel.querySelectorAll('[data-i18n]').forEach(el => {
                const key = el.getAttribute('data-i18n');
                const text = this.getText(key);
                if (text !== key) {
                    el.textContent = text;
                    console.log(`Updated test panel element: ${key} -> ${text}`);
                }
            });
        }
    };

    // 新增DOM观察方法
    I18n.prototype.observeDOM = function() {
        // 观察DOM变化，自动翻译新增的元素
        const observer = new MutationObserver((mutations) => {
            let needsUpdate = false;
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1) { // Element node
                            if (node.hasAttribute && (node.hasAttribute('data-i18n-key') || node.hasAttribute('data-i18n'))) {
                                needsUpdate = true;
                            }
                            if (node.querySelectorAll && node.querySelectorAll('[data-i18n-key], [data-i18n]').length > 0) {
                                needsUpdate = true;
                            }
                        }
                    });
                }
            });
            
            if (needsUpdate) {
                setTimeout(() => this.updatePageTexts(), 50);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    };

    // 新增强制更新方法
    I18n.prototype.forceUpdateAllTexts = function() {
        console.log('Force updating all texts');
        this.updatePageTexts();
        setTimeout(() => this.updatePageTexts(), 100);
        setTimeout(() => this.updatePageTexts(), 300);
        setTimeout(() => this.updatePageTexts(), 500);
        return this;
    };

    console.log('I18n system fixed successfully');
}

// 在页面加载完成后修复i18n系统
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fixI18nSystem);
} else {
    fixI18nSystem();
}

// 也在window load事件中再次尝试
window.addEventListener('load', fixI18nSystem);