// SPA路由管理器 - 实现流畅的页面切换
class SPARouter {
    constructor() {
        this.routes = {};
        this.currentRoute = null;
        this.currentModule = null;
        this.beforeRouteChange = null;
        this.afterRouteChange = null;
        this.cache = {}; // 缓存已加载的页面内容
        this.modules = {}; // 缓存已加载的模块
        this.init();
    }

    init() {
        // 监听浏览器前进后退
        window.addEventListener('popstate', (e) => {
            const route = e.state?.route || 'dashboard';
            this.navigate(route, false);
        });

        // 拦截所有导航链接点击
        document.addEventListener('click', (e) => {
            const link = e.target.closest('[data-route]');
            if (link) {
                e.preventDefault();
                const route = link.dataset.route;
                this.navigate(route);
            }
        });
    }

    // 注册路由
    register(route, config) {
        this.routes[route] = {
            title: config.title,
            loadContent: config.loadContent,
            loadModule: config.loadModule,
            onEnter: config.onEnter,
            onLeave: config.onLeave
        };
    }

    // 导航到指定路由
    async navigate(route, pushState = true) {
        if (!this.routes[route]) {
            console.error(`Route ${route} not found`);
            route = 'dashboard'; // 默认路由
        }

        // 如果是同一个路由，不重复加载
        if (this.currentRoute === route && this.cache[route]) {
            return;
        }

        const routeConfig = this.routes[route];

        // 执行离开钩子
        if (this.currentRoute && this.routes[this.currentRoute]?.onLeave) {
            await this.routes[this.currentRoute].onLeave();
        }

        // 执行前置钩子
        if (this.beforeRouteChange) {
            const canProceed = await this.beforeRouteChange(route, this.currentRoute);
            if (!canProceed) return;
        }

        // 显示加载动画
        this.showLoading();

        try {
            // 加载页面内容
            let content;
            if (this.cache[route]) {
                content = this.cache[route];
            } else {
                content = await routeConfig.loadContent();
                this.cache[route] = content;
            }

            // 执行页面切换动画
            await this.transitionPage(content);

            // 更新导航状态
            this.updateNavigation(route);

            // 加载并初始化页面模块
            if (routeConfig.loadModule) {
                // 销毁旧模块
                if (this.currentModule && this.currentModule.destroy) {
                    this.currentModule.destroy();
                }

                // 加载新模块
                if (!this.modules[route]) {
                    this.modules[route] = await routeConfig.loadModule();
                }
                this.currentModule = this.modules[route];

                // 初始化模块
                if (this.currentModule && this.currentModule.init) {
                    await this.currentModule.init();
                }
            }

            // 更新页面标题
            document.title = routeConfig.title;

            // 更新浏览器历史
            if (pushState) {
                history.pushState({ route }, routeConfig.title, `#${route}`);
            }

            // 执行进入钩子
            if (routeConfig.onEnter) {
                await routeConfig.onEnter();
            }

            // 执行后置钩子
            if (this.afterRouteChange) {
                await this.afterRouteChange(route, this.currentRoute);
            }

            this.currentRoute = route;

        } catch (error) {
            console.error('Navigation error:', error);
            this.showError('页面加载失败');
        } finally {
            this.hideLoading();
        }
    }

    // 页面切换动画
    async transitionPage(content) {
        const container = document.getElementById('app-container');
        if (!container) return;

        return new Promise((resolve) => {
            // 淡出动画
            container.style.opacity = '0';
            container.style.transform = 'translateY(20px)';

            setTimeout(() => {
                // 更新内容
                container.innerHTML = content;

                // 淡入动画
                requestAnimationFrame(() => {
                    container.style.opacity = '1';
                    container.style.transform = 'translateY(0)';
                    
                    // 初始化新页面的通用功能
                    if (window.SharedComponents) {
                        SharedComponents.initCommonFeatures();
                    }

                    setTimeout(resolve, 300);
                });
            }, 300);
        });
    }

    // 更新导航栏状态
    updateNavigation(activeRoute) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.dataset.route === activeRoute) {
                link.classList.add('active');
            }
        });
    }

    // 显示加载动画
    showLoading() {
        let loader = document.getElementById('page-loader');
        if (!loader) {
            loader = document.createElement('div');
            loader.id = 'page-loader';
            loader.className = 'page-loader';
            loader.innerHTML = `
                <div class="loader-spinner"></div>
                <div class="loader-text">加载中...</div>
            `;
            document.body.appendChild(loader);
        }
        loader.classList.add('show');
    }

    // 隐藏加载动画
    hideLoading() {
        const loader = document.getElementById('page-loader');
        if (loader) {
            loader.classList.remove('show');
        }
    }

    // 显示错误信息
    showError(message) {
        if (window.SharedComponents) {
            SharedComponents.showToast(message, 'error');
        } else {
            alert(message);
        }
    }

    // 预加载路由
    async preload(routes) {
        for (const route of routes) {
            if (this.routes[route] && !this.cache[route]) {
                try {
                    const content = await this.routes[route].loadContent();
                    this.cache[route] = content;
                } catch (error) {
                    console.error(`Failed to preload route ${route}:`, error);
                }
            }
        }
    }

    // 清除缓存
    clearCache(route = null) {
        if (route) {
            delete this.cache[route];
            delete this.modules[route];
        } else {
            this.cache = {};
            this.modules = {};
        }
    }

    // 获取当前路由
    getCurrentRoute() {
        return this.currentRoute;
    }

    // 刷新当前页面
    refresh() {
        if (this.currentRoute) {
            this.clearCache(this.currentRoute);
            this.navigate(this.currentRoute, false);
        }
    }

    // 路由守卫
    beforeEach(callback) {
        this.beforeRouteChange = callback;
    }

    afterEach(callback) {
        this.afterRouteChange = callback;
    }
}

// 创建全局路由实例
window.router = new SPARouter();