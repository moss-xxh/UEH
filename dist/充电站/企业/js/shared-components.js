// 共享组件和工具函数
class SharedComponents {
    // 创建顶部导航栏
    static createHeader(activePage = 'dashboard') {
        return `
            <!-- 顶部固定栏 -->
            <header class="top-header">
                <!-- Logo -->
                <div class="logo-container">
                    <img src="../logo.png" alt="充电站管理平台" class="logo-img">
                </div>

                <!-- 导航菜单 -->
                <nav class="nav-menu">
                    <a href="dashboard.html" class="nav-link ${activePage === 'dashboard' ? 'active' : ''}">数据概览</a>
                    <a href="stations.html" class="nav-link ${activePage === 'stations' ? 'active' : ''}">电站管理</a>
                    <a href="devices.html" class="nav-link ${activePage === 'devices' ? 'active' : ''}">设备管理</a>
                    <a href="orders.html" class="nav-link ${activePage === 'orders' ? 'active' : ''}">订单管理</a>
                    <a href="users.html" class="nav-link ${activePage === 'users' ? 'active' : ''}">用户管理</a>
                    <a href="finance.html" class="nav-link ${activePage === 'finance' ? 'active' : ''}">财务统计</a>
                    <a href="maintenance.html" class="nav-link ${activePage === 'maintenance' ? 'active' : ''}">维护管理</a>
                    <a href="settings.html" class="nav-link ${activePage === 'settings' ? 'active' : ''}">系统设置</a>
                    <a href="../index.html" class="nav-link exit">← 返回</a>
                </nav>
            </header>
        `;
    }

    // 创建页面容器
    static createPageContainer(title, subtitle) {
        return `
            <div class="container">
                <!-- 页面标题 -->
                <header class="page-header">
                    <h1 class="page-title">${title}</h1>
                    <p class="page-subtitle">${subtitle}</p>
                </header>

                <!-- 主要内容区域 -->
                <div id="page-content" class="page-content">
                    <!-- 页面特定内容 -->
                </div>
            </div>
        `;
    }

    // 初始化通用功能
    static initCommonFeatures() {
        // 绑定图表选项切换
        document.querySelectorAll('.chart-option').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.chart-option').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
            });
        });

        // 绑定分页按钮
        document.querySelectorAll('.page-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (!btn.disabled && btn.textContent !== '...') {
                    document.querySelectorAll('.page-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                }
            });
        });

        // 搜索框焦点效果
        document.querySelectorAll('.search-box').forEach(input => {
            input.addEventListener('focus', () => {
                input.style.borderColor = '#000000';
            });
            input.addEventListener('blur', () => {
                input.style.borderColor = '#E5E5E5';
            });
        });

        // 表单输入框焦点效果
        document.querySelectorAll('.form-input, .form-select').forEach(input => {
            input.addEventListener('focus', () => {
                input.style.borderColor = '#000000';
            });
            input.addEventListener('blur', () => {
                input.style.borderColor = '#E5E5E5';
            });
        });
    }

    // 创建统计卡片
    static createStatCard(label, value, change = null) {
        let changeHtml = '';
        if (change !== null) {
            const changeClass = change > 0 ? 'positive' : 'negative';
            const arrow = change > 0 ? '↑' : '↓';
            changeHtml = `<div class="stat-change ${changeClass}">${arrow} ${Math.abs(change)}%</div>`;
        }
        
        return `
            <div class="stat-card">
                <div class="stat-label">${label}</div>
                <div class="stat-value">${value}</div>
                ${changeHtml}
            </div>
        `;
    }

    // 创建数据表格
    static createDataTable(headers, rows, tableClass = '') {
        const headerHtml = headers.map(h => `<th>${h}</th>`).join('');
        const rowsHtml = rows.map(row => {
            const cells = row.map(cell => `<td>${cell}</td>`).join('');
            return `<tr>${cells}</tr>`;
        }).join('');

        return `
            <div class="minimal-table">
                <div class="table-wrapper">
                    <table class="data-table ${tableClass}">
                        <thead>
                            <tr>${headerHtml}</tr>
                        </thead>
                        <tbody>
                            ${rowsHtml}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    // 创建分页组件
    static createPagination(currentPage = 1, totalPages = 16) {
        return `
            <div class="pagination">
                <button class="page-btn" ${currentPage === 1 ? 'disabled' : ''}>←</button>
                <button class="page-btn ${currentPage === 1 ? 'active' : ''}">1</button>
                <button class="page-btn ${currentPage === 2 ? 'active' : ''}">2</button>
                <button class="page-btn ${currentPage === 3 ? 'active' : ''}">3</button>
                <button class="page-btn">...</button>
                <button class="page-btn ${currentPage === totalPages ? 'active' : ''}">${totalPages}</button>
                <button class="page-btn" ${currentPage === totalPages ? 'disabled' : ''}>→</button>
            </div>
        `;
    }

    // 格式化状态标签
    static formatStatus(status, type = 'default') {
        const statusMap = {
            active: '在线',
            inactive: '离线',
            pending: '待处理',
            completed: '已完成',
            charging: '充电中',
            idle: '空闲',
            maintenance: '维护中',
            online: '正常运行',
            offline: '离线',
            busy: '高负载'
        };

        const text = statusMap[status] || status;
        return `<span class="status ${status}">${text}</span>`;
    }

    // 显示提示信息
    static showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('show');
        }, 100);

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }

    // 显示确认对话框
    static showConfirm(title, message, onConfirm, onCancel) {
        const modal = document.createElement('div');
        modal.className = 'confirm-modal';
        modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${title}</h3>
                </div>
                <div class="modal-body">
                    <p>${message}</p>
                </div>
                <div class="modal-footer">
                    <button class="btn" id="cancel-btn">取消</button>
                    <button class="btn btn-primary" id="confirm-btn">确认</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        document.getElementById('cancel-btn').onclick = () => {
            document.body.removeChild(modal);
            if (onCancel) onCancel();
        };

        document.getElementById('confirm-btn').onclick = () => {
            document.body.removeChild(modal);
            if (onConfirm) onConfirm();
        };

        modal.querySelector('.modal-overlay').onclick = () => {
            document.body.removeChild(modal);
            if (onCancel) onCancel();
        };
    }

    // 格式化数字
    static formatNumber(num, decimals = 0) {
        return new Intl.NumberFormat('zh-CN', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        }).format(num);
    }

    // 格式化货币
    static formatCurrency(amount) {
        return new Intl.NumberFormat('zh-CN', {
            style: 'currency',
            currency: 'CNY'
        }).format(amount);
    }

    // 格式化日期时间
    static formatDateTime(date) {
        return new Intl.DateTimeFormat('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        }).format(new Date(date));
    }

    // 生成随机数据（用于演示）
    static generateRandomData(min, max, decimals = 0) {
        const num = Math.random() * (max - min) + min;
        return decimals > 0 ? num.toFixed(decimals) : Math.floor(num);
    }

    // 防抖函数
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // 节流函数
    static throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// 导出到全局
window.SharedComponents = SharedComponents;