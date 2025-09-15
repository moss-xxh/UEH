// 主题管理器 - 统一管理所有页面的主题切换
const ThemeManager = {
    // 主题配置
    themes: {
        light: {
            name: '浅色主题',
            nameEn: 'Light Theme',
            primary: '#1e90ff',
            secondary: '#f0f2f5',
            background: '#ffffff',
            surface: '#f8f9fa',
            text: '#1a1a1a',
            textSecondary: '#666666',
            border: '#e5e7eb',
            success: '#10b981',
            warning: '#f59e0b',
            error: '#ef4444',
            headerBg: 'linear-gradient(135deg, #1e3a5f 0%, #0a1628 100%)',
            cardShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
            hoverShadow: '0 5px 20px rgba(0, 0, 0, 0.1)'
        },
        dark: {
            name: '深色主题',
            nameEn: 'Dark Theme',
            primary: '#3b82f6',
            secondary: '#1f2937',
            background: '#0f172a',
            surface: '#1e293b',
            text: '#f1f5f9',
            textSecondary: '#94a3b8',
            border: '#334155',
            success: '#22c55e',
            warning: '#fbbf24',
            error: '#f87171',
            headerBg: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
            cardShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
            hoverShadow: '0 5px 20px rgba(0, 0, 0, 0.5)'
        },
        blue: {
            name: '科技蓝',
            nameEn: 'Tech Blue',
            primary: '#00d4ff',
            secondary: '#001e3c',
            background: '#000d1a',
            surface: '#001e3c',
            text: '#e0f2fe',
            textSecondary: '#7dd3fc',
            border: '#0284c7',
            success: '#22d3ee',
            warning: '#fbbf24',
            error: '#f87171',
            headerBg: 'linear-gradient(135deg, #001e3c 0%, #000d1a 100%)',
            cardShadow: '0 2px 10px rgba(0, 212, 255, 0.1)',
            hoverShadow: '0 5px 20px rgba(0, 212, 255, 0.2)'
        },
        green: {
            name: '自然绿',
            nameEn: 'Nature Green',
            primary: '#22c55e',
            secondary: '#14532d',
            background: '#052e16',
            surface: '#14532d',
            text: '#dcfce7',
            textSecondary: '#86efac',
            border: '#16a34a',
            success: '#4ade80',
            warning: '#facc15',
            error: '#f87171',
            headerBg: 'linear-gradient(135deg, #14532d 0%, #052e16 100%)',
            cardShadow: '0 2px 10px rgba(34, 197, 94, 0.1)',
            hoverShadow: '0 5px 20px rgba(34, 197, 94, 0.2)'
        }
    },

    // 获取当前主题
    getCurrentTheme() {
        return localStorage.getItem('touchscreen_theme') || 'light';
    },

    // 设置主题
    setTheme(themeName) {
        if (!this.themes[themeName]) {
            console.error('Theme not found:', themeName);
            return;
        }

        localStorage.setItem('touchscreen_theme', themeName);
        this.applyTheme(themeName);
    },

    // 应用主题
    applyTheme(themeName) {
        const theme = this.themes[themeName];
        const root = document.documentElement;

        // 设置CSS变量
        root.style.setProperty('--primary-color', theme.primary);
        root.style.setProperty('--secondary-color', theme.secondary);
        root.style.setProperty('--background-color', theme.background);
        root.style.setProperty('--surface-color', theme.surface);
        root.style.setProperty('--text-color', theme.text);
        root.style.setProperty('--text-secondary-color', theme.textSecondary);
        root.style.setProperty('--border-color', theme.border);
        root.style.setProperty('--success-color', theme.success);
        root.style.setProperty('--warning-color', theme.warning);
        root.style.setProperty('--error-color', theme.error);
        root.style.setProperty('--header-bg', theme.headerBg);
        root.style.setProperty('--card-shadow', theme.cardShadow);
        root.style.setProperty('--hover-shadow', theme.hoverShadow);

        // 应用到body
        document.body.style.backgroundColor = theme.background;
        document.body.style.color = theme.text;
        
        // 设置data-theme属性，用于CSS选择器
        document.body.setAttribute('data-theme', themeName);
        
        // 添加theme class
        document.body.className = document.body.className.replace(/theme-\w+/g, '');
        document.body.classList.add(`theme-${themeName}`);

        // 触发自定义事件
        window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: themeName } }));
    },

    // 初始化主题
    init() {
        // 应用保存的主题
        const savedTheme = this.getCurrentTheme();
        this.applyTheme(savedTheme);

        // 监听主题切换按钮
        this.setupThemeListeners();
    },

    // 设置主题切换监听器
    setupThemeListeners() {
        // 监听主题切换按钮
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-theme-switch]')) {
                const themeName = e.target.getAttribute('data-theme-switch');
                this.setTheme(themeName);
            }
        });

        // 监听键盘快捷键 (Ctrl/Cmd + Shift + T)
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
                this.showThemePicker();
            }
        });
    },

    // 显示主题选择器
    showThemePicker() {
        // 移除已存在的选择器
        const existing = document.getElementById('theme-picker-modal');
        if (existing) existing.remove();

        // 创建主题选择器模态框
        const modal = document.createElement('div');
        modal.id = 'theme-picker-modal';
        modal.innerHTML = `
            <style>
                #theme-picker-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.8);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 9999;
                    animation: fadeIn 0.3s ease;
                }

                .theme-picker-container {
                    background: var(--surface-color, #fff);
                    border-radius: 20px;
                    padding: 30px;
                    max-width: 600px;
                    width: 90%;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                    animation: slideIn 0.3s ease;
                }

                .theme-picker-header {
                    text-align: center;
                    margin-bottom: 30px;
                }

                .theme-picker-title {
                    font-size: 24px;
                    font-weight: 600;
                    color: var(--text-color);
                    margin-bottom: 10px;
                }

                .theme-picker-subtitle {
                    font-size: 14px;
                    color: var(--text-secondary-color);
                }

                .theme-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 20px;
                    margin-bottom: 30px;
                }

                .theme-card {
                    border: 2px solid var(--border-color);
                    border-radius: 12px;
                    overflow: hidden;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .theme-card:hover {
                    transform: translateY(-5px);
                    box-shadow: var(--hover-shadow);
                }

                .theme-card.active {
                    border-color: var(--primary-color);
                    box-shadow: 0 0 0 3px rgba(30, 144, 255, 0.2);
                }

                .theme-preview {
                    height: 120px;
                    position: relative;
                    overflow: hidden;
                }

                .theme-preview-header {
                    height: 30px;
                    display: flex;
                    align-items: center;
                    padding: 0 10px;
                    gap: 5px;
                }

                .theme-preview-dot {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                }

                .theme-preview-content {
                    padding: 10px;
                    height: 90px;
                }

                .theme-preview-card {
                    height: 100%;
                    border-radius: 8px;
                    padding: 10px;
                }

                .theme-info {
                    padding: 15px;
                    background: var(--surface-color);
                }

                .theme-name {
                    font-weight: 600;
                    margin-bottom: 5px;
                    color: var(--text-color);
                }

                .theme-desc {
                    font-size: 12px;
                    color: var(--text-secondary-color);
                }

                .theme-picker-actions {
                    display: flex;
                    justify-content: center;
                    gap: 15px;
                }

                .theme-btn {
                    padding: 10px 24px;
                    border: none;
                    border-radius: 8px;
                    font-size: 16px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .theme-btn-close {
                    background: var(--border-color);
                    color: var(--text-color);
                }

                .theme-btn-close:hover {
                    background: var(--text-secondary-color);
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                @keyframes slideIn {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
            </style>
            <div class="theme-picker-container">
                <div class="theme-picker-header">
                    <h2 class="theme-picker-title">${this.getCurrentLang() === 'zh' ? '选择主题' : 'Choose Theme'}</h2>
                    <p class="theme-picker-subtitle">${this.getCurrentLang() === 'zh' ? '选择您喜欢的界面主题' : 'Select your preferred interface theme'}</p>
                </div>
                <div class="theme-grid">
                    ${Object.entries(this.themes).map(([key, theme]) => `
                        <div class="theme-card ${key === this.getCurrentTheme() ? 'active' : ''}" onclick="ThemeManager.selectTheme('${key}')">
                            <div class="theme-preview" style="background: ${theme.background}">
                                <div class="theme-preview-header" style="background: ${theme.headerBg}">
                                    <div class="theme-preview-dot" style="background: ${theme.error}"></div>
                                    <div class="theme-preview-dot" style="background: ${theme.warning}"></div>
                                    <div class="theme-preview-dot" style="background: ${theme.success}"></div>
                                </div>
                                <div class="theme-preview-content">
                                    <div class="theme-preview-card" style="background: ${theme.surface}; box-shadow: ${theme.cardShadow}">
                                        <div style="width: 60%; height: 8px; background: ${theme.primary}; border-radius: 4px; margin-bottom: 8px;"></div>
                                        <div style="width: 80%; height: 6px; background: ${theme.textSecondary}; border-radius: 3px; margin-bottom: 6px; opacity: 0.5;"></div>
                                        <div style="width: 70%; height: 6px; background: ${theme.textSecondary}; border-radius: 3px; opacity: 0.3;"></div>
                                    </div>
                                </div>
                            </div>
                            <div class="theme-info">
                                <div class="theme-name">${this.getCurrentLang() === 'zh' ? theme.name : theme.nameEn}</div>
                                <div class="theme-desc">${this.getThemeDescription(key)}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div class="theme-picker-actions">
                    <button class="theme-btn theme-btn-close" onclick="ThemeManager.closeThemePicker()">
                        ${this.getCurrentLang() === 'zh' ? '关闭' : 'Close'}
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // 点击背景关闭
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeThemePicker();
            }
        });
    },

    // 选择主题
    selectTheme(themeName) {
        this.setTheme(themeName);
        
        // 更新选中状态
        document.querySelectorAll('.theme-card').forEach(card => {
            card.classList.remove('active');
        });
        event.currentTarget.classList.add('active');

        // 延迟关闭
        setTimeout(() => {
            this.closeThemePicker();
        }, 500);
    },

    // 关闭主题选择器
    closeThemePicker() {
        const modal = document.getElementById('theme-picker-modal');
        if (modal) {
            modal.style.opacity = '0';
            setTimeout(() => modal.remove(), 300);
        }
    },

    // 获取当前语言
    getCurrentLang() {
        return localStorage.getItem('touchscreen_lang') || 'zh';
    },

    // 获取主题描述
    getThemeDescription(key) {
        const descriptions = {
            light: {
                zh: '明亮清爽的界面风格',
                en: 'Bright and clean interface'
            },
            dark: {
                zh: '护眼的深色界面风格',
                en: 'Eye-friendly dark interface'
            },
            blue: {
                zh: '科技感十足的蓝色主题',
                en: 'Tech-inspired blue theme'
            },
            green: {
                zh: '自然舒适的绿色主题',
                en: 'Natural comfortable green theme'
            }
        };

        const lang = this.getCurrentLang();
        return descriptions[key][lang];
    }
};

// 自动初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => ThemeManager.init());
} else {
    ThemeManager.init();
}

// 导出给全局使用
window.ThemeManager = ThemeManager;