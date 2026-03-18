/**
 * 公共头部导航栏组件
 * 包含导航菜单、消息中心、用户头像、多语言切换等功能
 */
class HeaderNav {
    constructor(options = {}) {
        this.currentPage = options.currentPage || '';
        this.containerId = options.containerId || 'headerContainer';
        this.showMessageCenter = options.showMessageCenter !== false; // 默认显示
        this.showUserAvatar = options.showUserAvatar !== false; // 默认显示
        this.showLanguageSelector = options.showLanguageSelector !== false; // 默认显示多语言选择器
        this.showBackButton = options.showBackButton || false; // 是否显示返回按钮
        this.backButtonText = options.backButtonText || '返回'; // 返回按钮文字
        this.backButtonUrl = options.backButtonUrl || 'javascript:history.back()'; // 返回按钮链接
        
        // 消息中心相关
        this.messages = [];
        this.unreadCount = 0;
        this.isMessageDropdownOpen = false;
        this.currentMessageTab = 'all';
        
        // 多语言支持
        this.i18n = null;
        
        // 默认黑色主题
        if (!document.body.classList.contains('theme-dark')) {
            document.body.classList.add('theme-dark');
        }
        this.init();
    }
    
    init() {
        try {
            // 初始化多语言支持
            if (this.showLanguageSelector) {
                this.initI18n();
            }
            
            this.createHeaderHTML();
            this.bindEvents();
            
            if (this.showMessageCenter) {
                this.initMessageCenter();
            }
            
            // 设置全局实例引用
            window.headerNav = this;
        } catch (error) {
            console.error('HeaderNav initialization failed:', error);
        }
    }
    
    initI18n() {
        // 检查是否已有全局i18n实例
        if (window.i18n) {
            this.i18n = window.i18n;
        } else {
            // 检查是否已经加载了I18n类
            if (typeof I18n !== 'undefined') {
                this.i18n = new I18n({
                    containerId: 'headerLanguageSelector'
                });
                // 设置全局i18n实例
                window.i18n = this.i18n;
            } else {
                console.warn('I18n class not found. Language selector will not be available.');
                this.showLanguageSelector = false;
            }
        }
        
        // 添加语言变化监听
        if (this.i18n) {
            this.i18n.addObserver((newLanguage, oldLanguage) => {
                this.updateTexts();
                // 调用i18n系统的updatePageTexts方法来更新页面上的所有翻译
                if (this.i18n.updatePageTexts) {
                    this.i18n.updatePageTexts();
                }
            });
        }
    }
    
    createHeaderHTML() {
        const navItems = [
            { href: 'dashboard.html', i18nKey: 'nav.home', key: 'home' },
            { href: 'family-new.html', i18nKey: 'nav.family', key: 'family' },
            { href: 'reports.html', i18nKey: 'nav.reports', key: 'reports' },
            { href: '002.html', i18nKey: 'nav.profit', key: 'profit' },
            { href: '001.html', i18nKey: 'nav.analysis', key: 'analysis' },
            { href: 'organization-new.html', i18nKey: 'nav.organization', key: 'organization' },
            { href: 'push-strategy-page.html', i18nKey: 'nav.pushStrategy', key: 'pushStrategy' },
            { href: 'operation-log-page.html', i18nKey: 'nav.operationLog', key: 'operationLog' }
        ];
        
        const navHTML = navItems.map(item => {
            const text = this.i18n ? this.i18n.getText(item.i18nKey) : item.i18nKey.split('.')[1];
            return `<a href="${item.href}" 
                       class="${this.currentPage === item.key ? 'active' : ''}"
                       data-i18n="${item.i18nKey}">${text}</a>`;
        }).join('');
        
        // 创建简单的消息中心图标，总是显示
        const messageCenter = `
            <div class="simple-message-icon" onclick="window.location.href='message-center.html'" style="cursor: pointer; padding: 0 10px;">
                <span style="font-size: 20px;">🔔</span>
            </div>
        `;
        
        // 创建语言切换图标（不可点击）
        const languageIcon = ``;
        
        // 创建设置图标
        const settingsIcon = `
            <div class="settings-icon" onclick="window.location.href='settings.html'" style="cursor: pointer; padding: 0 10px;">
                <span style="font-size: 20px;">⚙️</span>
            </div>
        `;
        const languageSelector = '';
        const themeToggleBtn = '';
        const userAvatar = this.showUserAvatar ? '<div id="userDropdownContainer"></div>' : '';
        
        const backButton = this.showBackButton ? `
            <button class="back-button" onclick="location.href='${this.backButtonUrl}'" style="
                background: transparent;
                border: 1px solid var(--color-border);
                color: var(--color-text);
                padding: 8px 16px;
                border-radius: 6px;
                cursor: pointer;
                margin-right: 20px;
                font-size: 14px;
                transition: all 0.3s;
            ">
                ← ${this.backButtonText}
            </button>
        ` : '';
        
        const currentLang = this.i18n ? this.i18n.getCurrentLanguage() : 'zh';
        const headerHTML = `
            <div class="header" data-lang="${currentLang}">
                ${backButton}
                <div class="logo">
                    <img src="logo.png" alt="U Energy" style="height: 45px; width: auto;">
                </div>
                <div class="nav">
                    ${navHTML}
                </div>
                <div class="header-right">
                    ${messageCenter}
                    ${languageIcon}
                    ${settingsIcon}
                    ${languageSelector}
                    ${themeToggleBtn}
                    ${userAvatar}
                </div>
            </div>
        `;
        
        // 插入到指定容器或body开头
        const container = document.getElementById(this.containerId);
        if (container) {
            container.innerHTML = headerHTML;
        } else {
            console.warn(`HeaderNav: Container ${this.containerId} not found, inserting at body start`);
            document.body.insertAdjacentHTML('afterbegin', headerHTML);
        }
        
        // 初始化语言选择器（需要在DOM插入后）
        if (this.showLanguageSelector && this.i18n) {
            // 重新创建语言选择器到指定位置
            setTimeout(() => {
                this.i18n.createLanguageSelectorHTML();
            }, 0);
        }
        
        // 初始化用户下拉菜单
        if (this.showUserAvatar) {
            setTimeout(() => {
                // 使用新的简洁用户下拉菜单
                if (typeof UserDropdownSimpleNew !== 'undefined' && !window.userDropdownSimpleNew) {
                    window.userDropdownSimpleNew = new UserDropdownSimpleNew({
                        containerId: 'userDropdownContainer'
                    });
                    console.log('UserDropdownSimpleNew initialized successfully');
                }
            }, 100);
        }
        
        // 主题切换按钮事件委托，保证每次渲染都可用
        const headerRight = document.querySelector('.header-right');
        if (headerRight) {
            headerRight.addEventListener('click', function(e) {
                if (e.target && e.target.id === 'themeToggle') {
                    document.body.classList.toggle('theme-dark');
                    e.target.textContent = document.body.classList.contains('theme-dark') ? '☀️' : '🌙';
                }
            });
        }
    }
    
    createMessageCenterHTML() {
        // 简单的消息中心图标，点击跳转，没有任何徽章
        return `
            <div class="message-center" onclick="window.location.href='message-center.html'" style="cursor: pointer; position: relative;">
                <span class="message-icon">🔔</span>
            </div>
        `;
    }
    
    bindEvents() {
        // 绑定外部点击事件关闭消息下拉框
        document.addEventListener('click', (e) => {
            if (this.showMessageCenter && !e.target.closest('.message-center')) {
                this.closeMessageDropdown();
            }
        });
        
        // ESC键关闭消息下拉框
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMessageDropdownOpen) {
                this.closeMessageDropdown();
            }
        });
        
        // 滚动检测增强头部效果
        this.bindScrollEvents();
        
        // LOGO点击跳转首页
        this.bindLogoClick();
    }
    
    toggleLanguageDropdown() {
        console.log('Toggle language dropdown');
        const dropdown = document.getElementById('languageDropdown');
        if (dropdown) {
            dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
            console.log('Dropdown display:', dropdown.style.display);
        } else {
            console.error('Language dropdown not found');
        }
    }
    
    closeLanguageDropdown() {
        const dropdown = document.getElementById('languageDropdown');
        if (dropdown) {
            dropdown.style.display = 'none';
        }
    }
    
    changeLanguage(lang) {
        console.log('Changing language to:', lang);
        if (this.i18n) {
            this.i18n.setLanguage(lang);
        } else if (window.i18n) {
            window.i18n.setLanguage(lang);
        } else {
            console.error('i18n not found');
        }
        this.closeLanguageDropdown();
    }
    
    bindScrollEvents() {
        let ticking = false;
        
        const updateHeaderOnScroll = () => {
            const header = document.querySelector('.header');
            if (!header) return;
            
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > 50) {
                header.classList.add('scrolled');
                if (scrollTop > 200) {
                    header.classList.add('glass-enhanced');
                }
            } else {
                header.classList.remove('scrolled', 'glass-enhanced');
            }
            
            ticking = false;
        };
        
        const onScroll = () => {
            if (!ticking) {
                requestAnimationFrame(updateHeaderOnScroll);
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', onScroll, { passive: true });
        
        // 初始检查
        updateHeaderOnScroll();
    }
    
    bindLogoClick() {
        const logo = document.querySelector('.header .logo');
        if (logo) {
            logo.addEventListener('click', () => {
                window.location.href = 'dashboard.html';
            });
        }
    }
    
    // ==================== 消息中心功能 ====================
    
    initMessageCenter() {
        this.loadMockMessages();
        this.updateMessageCounts();
        // this.updateMessageBadge(); // 移除徽章功能
        this.renderMessages();
        this.startMessageSimulation();
    }
    
    loadMockMessages() {
        const mockMessages = [
            {
                id: 1,
                type: 'alert',
                title: '电站异常告警',
                message: '电站A01检测到充电功率异常，请及时检查',
                time: new Date(Date.now() - 300000),
                read: false,
                level: 'high'
            },
            {
                id: 2,
                type: 'system',
                title: '系统维护通知',
                message: '系统将于今晚22:00-24:00进行例行维护',
                time: new Date(Date.now() - 1800000),
                read: false,
                level: 'medium'
            },
            {
                id: 3,
                type: 'operation',
                title: '操作执行完成',
                message: '充电指令已成功下发至45个电站',
                time: new Date(Date.now() - 3600000),
                read: true,
                level: 'low'
            },
            {
                id: 4,
                type: 'alert',
                title: '温度告警',
                message: '电站B12温度超过安全阈值',
                time: new Date(Date.now() - 7200000),
                read: false,
                level: 'high'
            },
            {
                id: 5,
                type: 'system',
                title: '版本更新',
                message: '系统已更新至v2.1.0，新增多项功能',
                time: new Date(Date.now() - 86400000),
                read: true,
                level: 'low'
            }
        ];
        
        this.messages = mockMessages;
    }
    
    startMessageSimulation() {
        // 模拟实时消息推送
        setInterval(() => {
            if (Math.random() < 0.12) { // 12% 概率生成新消息
                this.addNewMessage(this.generateRandomMessage());
            }
        }, 10000); // 每10秒检查一次
    }
    
    generateRandomMessage() {
        const types = ['alert', 'system', 'operation'];
        const levels = ['high', 'medium', 'low'];
        const templates = {
            alert: [
                { title: '电站异常告警', message: '电站{id}检测到异常，请及时处理' },
                { title: '温度告警', message: '电站{id}温度超过安全阈值' },
                { title: '电池告警', message: '电站{id}电池状态异常' },
                { title: '网络连接异常', message: '电站{id}网络连接中断' }
            ],
            system: [
                { title: '系统通知', message: '系统将进行例行维护' },
                { title: '版本更新', message: '系统已更新到新版本' },
                { title: '配置变更', message: '系统配置已更新' },
                { title: '安全扫描', message: '系统安全扫描已完成' }
            ],
            operation: [
                { title: '操作完成', message: '{action}指令执行完成' },
                { title: '任务完成', message: '定时任务执行成功' },
                { title: '数据同步', message: '数据同步已完成' },
                { title: '备份完成', message: '系统数据备份已完成' }
            ]
        };
        
        const type = types[Math.floor(Math.random() * types.length)];
        const level = levels[Math.floor(Math.random() * levels.length)];
        const template = templates[type][Math.floor(Math.random() * templates[type].length)];
        
        const stationId = String.fromCharCode(65 + Math.floor(Math.random() * 26)) + 
                         (Math.floor(Math.random() * 99) + 1).toString().padStart(2, '0');
        const actions = ['充电', '放电', '停止充电', '停止放电'];
        const action = actions[Math.floor(Math.random() * actions.length)];
        
        return {
            id: Date.now(),
            type: type,
            title: template.title,
            message: template.message.replace('{id}', stationId).replace('{action}', action),
            time: new Date(),
            read: false,
            level: level
        };
    }
    
    addNewMessage(message) {
        this.messages.unshift(message);
        
        // 限制消息数量
        if (this.messages.length > 50) {
            this.messages = this.messages.slice(0, 50);
        }
        
        this.updateMessageCounts();
        // this.updateMessageBadge(); // 移除徽章功能
        this.renderMessages();
    }
    
    toggleMessageDropdown() {
        if (this.isMessageDropdownOpen) {
            this.closeMessageDropdown();
        } else {
            this.openMessageDropdown();
        }
    }
    
    openMessageDropdown() {
        const dropdown = document.getElementById('messageDropdown');
        if (!dropdown) return;
        
        this.isMessageDropdownOpen = true;
        dropdown.style.display = 'flex';
        
        // 强制重排，然后添加show类实现动画
        dropdown.offsetHeight;
        dropdown.classList.add('show');
        
        // 自动标记前3个未读消息为已读
        this.autoMarkVisible();
    }
    
    closeMessageDropdown() {
        const dropdown = document.getElementById('messageDropdown');
        if (!dropdown) return;
        
        this.isMessageDropdownOpen = false;
        dropdown.classList.remove('show');
        
        // 动画完成后隐藏
        setTimeout(() => {
            dropdown.style.display = 'none';
        }, 300);
    }
    
    switchMessageTab(type, button, event) {
        // 阻止事件冒泡，防止关闭下拉框
        if (event) {
            event.stopPropagation();
        }
        
        // 更新标签按钮状态
        document.querySelectorAll('.message-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        button.classList.add('active');
        
        this.currentMessageTab = type;
        this.renderMessages();
    }
    
    getFilteredMessages() {
        if (this.currentMessageTab === 'all') {
            return this.messages;
        }
        return this.messages.filter(m => m.type === this.currentMessageTab);
    }
    
    renderMessages() {
        const listContainer = document.getElementById('messageList');
        const emptyContainer = document.getElementById('messageEmpty');
        if (!listContainer || !emptyContainer) return;
        
        const filteredMessages = this.getFilteredMessages();
        
        if (filteredMessages.length === 0) {
            listContainer.style.display = 'none';
            emptyContainer.style.display = 'flex';
            return;
        }
        
        listContainer.style.display = 'block';
        emptyContainer.style.display = 'none';
        
        listContainer.innerHTML = filteredMessages.map(message => 
            this.renderMessageItem(message)
        ).join('');
    }
    
    renderMessageItem(message) {
        const timeString = this.formatMessageTime(message.time);
        const levelClass = `level-${message.level}`;
        const typeIcon = this.getMessageTypeIcon(message.type);
        
        return `
            <div class="message-item ${message.read ? 'read' : 'unread'} ${levelClass}" 
                 data-id="${message.id}" 
                 onclick="window.headerNav.openMessageDetail(${message.id}); event.stopPropagation();"
                 style="cursor: pointer;">
                <div class="message-item-icon">
                    ${typeIcon}
                </div>
                <div class="message-item-content">
                    <div class="message-item-header">
                        <div class="message-item-title">${message.title}</div>
                        <div class="message-item-time">${timeString}</div>
                    </div>
                    <div class="message-item-text">${message.message}</div>
                    ${!message.read ? '<div class="unread-indicator"></div>' : ''}
                </div>
            </div>
        `;
    }
    
    getMessageTypeIcon(type) {
        const icons = {
            alert: '⚠️',
            system: '⚙️',
            operation: '⚡'
        };
        return icons[type] || '📝';
    }
    
    formatMessageTime(time) {
        // 使用i18n的formatTime方法，如果可用的话
        if (this.i18n && typeof this.i18n.formatTime === 'function') {
            return this.i18n.formatTime(time, { relative: true });
        }
        
        // 降级到默认实现
        const now = new Date();
        const diff = now - time;
        
        if (diff < 60000) { // 1分钟内
            return this.i18n ? this.i18n.getText('notification.justNow') : '刚刚';
        } else if (diff < 3600000) { // 1小时内
            const minutes = Math.floor(diff / 60000);
            const minutesAgoText = this.i18n ? this.i18n.getText('notification.minutesAgo') : '分钟前';
            return `${minutes} ${minutesAgoText}`;
        } else if (diff < 86400000) { // 24小时内
            const hours = Math.floor(diff / 3600000);
            const hoursAgoText = this.i18n ? this.i18n.getText('notification.hoursAgo') : '小时前';
            return `${hours} ${hoursAgoText}`;
        } else { // 超过24小时
            const locale = this.i18n ? 
                (this.i18n.getCurrentLanguage() === 'en' ? 'en-US' : 
                 this.i18n.getCurrentLanguage() === 'ja' ? 'ja-JP' : 
                 this.i18n.getCurrentLanguage() === 'ko' ? 'ko-KR' : 'zh-CN') : 'zh-CN';
            return time.toLocaleDateString(locale);
        }
    }
    
    updateMessageCounts() {
        const counts = {
            all: this.messages.length,
            alert: this.messages.filter(m => m.type === 'alert').length,
            system: this.messages.filter(m => m.type === 'system').length,
            operation: this.messages.filter(m => m.type === 'operation').length
        };
        
        this.unreadCount = this.messages.filter(m => !m.read).length;
        
        // 更新标签计数
        Object.keys(counts).forEach(type => {
            const countElement = document.getElementById(`${type}Count`);
            if (countElement) {
                countElement.textContent = counts[type];
            }
        });
        
        // 更新总计数
        const totalCountElement = document.getElementById('messageCount');
        if (totalCountElement) {
            totalCountElement.textContent = this.unreadCount;
        }
    }
    
    // 移除徽章功能
    // updateMessageBadge() {
    //     const badge = document.getElementById('messageBadge');
    //     if (!badge) return;
    //     
    //     if (this.unreadCount > 0) {
    //         badge.style.display = 'flex';
    //         badge.textContent = this.unreadCount > 99 ? '99+' : this.unreadCount;
    //     } else {
    //         badge.style.display = 'none';
    //     }
    // }
    
    markMessageAsRead(id) {
        const message = this.messages.find(m => m.id === id);
        if (message && !message.read) {
            message.read = true;
            this.updateMessageCounts();
            // this.updateMessageBadge(); // 移除徽章功能
            this.renderMessages();
        }
    }
    
    markAllAsRead() {
        this.messages.forEach(m => m.read = true);
        this.updateMessageCounts();
        // this.updateMessageBadge(); // 移除徽章功能
        this.renderMessages();
    }
    
    openMessageDetail(messageId) {
        // 关闭消息下拉框
        this.closeMessageDropdown();
        
        // 标记消息为已读
        const message = this.messages.find(m => m.id === messageId);
        if (message && !message.read) {
            message.read = true;
            this.updateMessageCounts();
            // this.updateMessageBadge(); // 移除徽章功能
        }
        
        // 构建消息中心URL，包含消息ID用于定位到特定消息
        const url = `message-center.html?messageId=${messageId}`;
        window.location.href = url;
    }
    
    clearAllMessages() {
        // 改为全部标记为已读，而不是删除消息
        this.markAllAsRead();
    }
    
    autoMarkVisible() {
        // 自动标记可见的未读消息为已读
        const visibleUnread = this.getFilteredMessages()
            .filter(m => !m.read)
            .slice(0, 3);
            
        setTimeout(() => {
            visibleUnread.forEach(m => {
                m.read = true;
            });
            this.updateMessageCounts();
            // this.updateMessageBadge(); // 移除徽章功能
            this.renderMessages();
        }, 2000);
    }
    
    viewAllMessages() {
        // 跳转到消息中心页面
        // 如果需要创建消息中心页面，建议文件名为 message-center.html
        window.location.href = 'message-center.html';
        this.closeMessageDropdown();
    }
    
    // ==================== 公共方法 ====================
    
    // 设置当前页面（用于高亮导航）
    setCurrentPage(page) {
        this.currentPage = page;
        // 更新导航高亮状态
        document.querySelectorAll('.nav a').forEach(link => {
            link.classList.remove('active');
        });
        
        const currentLink = document.querySelector(`.nav a[href*="${page}"]`);
        if (currentLink) {
            currentLink.classList.add('active');
        }
    }
    
    // 获取未读消息数
    getUnreadCount() {
        return this.unreadCount;
    }
    
    // 添加消息（供外部调用）
    addMessage(message) {
        this.addNewMessage(message);
    }
    
    // 更新文本（语言切换时调用）
    updateTexts() {
        // 只更新文本内容，不重新创建DOM结构
        if (!this.i18n) return;
        
        // 更新header的语言属性以支持多语言样式
        const header = document.querySelector('.header');
        if (header) {
            header.setAttribute('data-lang', this.i18n.getCurrentLanguage());
        }
        
        // 更新导航链接文本
        const navLinks = document.querySelectorAll('.header .nav a[data-i18n]');
        navLinks.forEach(link => {
            const i18nKey = link.getAttribute('data-i18n');
            if (i18nKey) {
                link.textContent = this.i18n.getText(i18nKey);
            }
        });
        
        // 更新消息中心文本
        if (this.showMessageCenter) {
            const messageCenterElements = [
                { selector: '.message-title-text[data-i18n]', attr: 'data-i18n' },
                { selector: '.message-action-btn[data-i18n]', attr: 'data-i18n' },
                { selector: '.message-tab span[data-i18n]', attr: 'data-i18n' },
                { selector: '.empty-text[data-i18n]', attr: 'data-i18n' },
                { selector: '.message-footer-btn[data-i18n]', attr: 'data-i18n' }
            ];
            
            messageCenterElements.forEach(({ selector, attr }) => {
                const elements = document.querySelectorAll(selector);
                elements.forEach(el => {
                    const i18nKey = el.getAttribute(attr);
                    if (i18nKey) {
                        el.textContent = this.i18n.getText(i18nKey);
                    }
                });
            });
        }
        
        // 如果i18n有updatePageTexts方法，调用它更新页面中的其他文本
        if (typeof this.i18n.updatePageTexts === 'function') {
            this.i18n.updatePageTexts();
        }
        
        // 确保语言选择器仍然正常工作
        if (this.showLanguageSelector && this.i18n) {
            // 重新初始化语言选择器，确保事件绑定正常
            setTimeout(() => {
                if (this.i18n.bindEvents) {
                    this.i18n.bindEvents();
                }
            }, 0);
        }
    }
    
    // 获取当前语言
    getCurrentLanguage() {
        return this.i18n ? this.i18n.getCurrentLanguage() : 'zh';
    }
    
    // 设置语言
    setLanguage(language) {
        if (this.i18n && typeof this.i18n.setLanguage === 'function') {
            this.i18n.setLanguage(language);
        }
    }
    
    // 销毁组件
    destroy() {
        const header = document.querySelector('.header');
        if (header) {
            header.remove();
        }
        
        // 清理全局引用
        if (window.headerNav === this) {
            window.headerNav = null;
        }
        
        // 清理i18n观察者
        if (this.i18n) {
            this.i18n.removeObserver(this.updateTexts.bind(this));
        }
    }
}

// 导出供其他文件使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HeaderNav;
}