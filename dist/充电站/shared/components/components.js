/**
 * Shared Components Library for EV Charging Platform
 * 可复用的公共组件库
 */

// ============================================
// 1. Navigation Component (导航组件)
// ============================================
class NavigationComponent {
    constructor(config = {}) {
        this.config = {
            brand: config.brand || 'EV Charge',
            logo: config.logo || '<i class="fas fa-charging-station"></i>',
            items: config.items || [],
            activeItem: config.activeItem || '',
            onItemClick: config.onItemClick || (() => {}),
            style: config.style || 'horizontal', // horizontal | vertical
            theme: config.theme || 'light' // light | dark
        };
    }

    render(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const navClass = this.config.style === 'vertical' ? 'nav-vertical' : 'nav-horizontal';
        const themeClass = this.config.theme === 'dark' ? 'nav-dark' : 'nav-light';

        container.innerHTML = `
            <nav class="nav-component ${navClass} ${themeClass}">
                <div class="nav-brand">
                    ${this.config.logo}
                    <span>${this.config.brand}</span>
                </div>
                <ul class="nav-items">
                    ${this.config.items.map(item => `
                        <li class="nav-item ${item.id === this.config.activeItem ? 'active' : ''}">
                            <a href="${item.href || '#'}" data-id="${item.id}">
                                ${item.icon ? `<i class="${item.icon}"></i>` : ''}
                                <span>${item.label}</span>
                            </a>
                        </li>
                    `).join('')}
                </ul>
            </nav>
        `;

        // Add event listeners
        container.querySelectorAll('.nav-item a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const itemId = e.currentTarget.dataset.id;
                this.config.onItemClick(itemId);
            });
        });
    }
}

// ============================================
// 2. Pagination Component (分页组件)
// ============================================
class PaginationComponent {
    constructor(config = {}) {
        this.config = {
            totalItems: config.totalItems || 0,
            itemsPerPage: config.itemsPerPage || 10,
            currentPage: config.currentPage || 1,
            maxButtons: config.maxButtons || 5,
            onPageChange: config.onPageChange || (() => {}),
            showInfo: config.showInfo !== false,
            showJumper: config.showJumper || false
        };
    }

    get totalPages() {
        return Math.ceil(this.config.totalItems / this.config.itemsPerPage);
    }

    render(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const pages = this.getPageNumbers();
        
        container.innerHTML = `
            <div class="pagination-component">
                ${this.config.showInfo ? `
                    <div class="pagination-info">
                        Showing ${this.getStartIndex() + 1}-${this.getEndIndex()} of ${this.config.totalItems}
                    </div>
                ` : ''}
                
                <div class="pagination-controls">
                    <button class="page-btn page-first" ${this.config.currentPage === 1 ? 'disabled' : ''}>
                        <i class="fas fa-angle-double-left"></i>
                    </button>
                    <button class="page-btn page-prev" ${this.config.currentPage === 1 ? 'disabled' : ''}>
                        <i class="fas fa-angle-left"></i>
                    </button>
                    
                    ${pages.map(page => {
                        if (page === '...') {
                            return '<span class="page-ellipsis">...</span>';
                        }
                        return `
                            <button class="page-btn page-number ${page === this.config.currentPage ? 'active' : ''}" 
                                    data-page="${page}">${page}</button>
                        `;
                    }).join('')}
                    
                    <button class="page-btn page-next" ${this.config.currentPage === this.totalPages ? 'disabled' : ''}>
                        <i class="fas fa-angle-right"></i>
                    </button>
                    <button class="page-btn page-last" ${this.config.currentPage === this.totalPages ? 'disabled' : ''}>
                        <i class="fas fa-angle-double-right"></i>
                    </button>
                </div>
                
                ${this.config.showJumper ? `
                    <div class="pagination-jumper">
                        <span>Go to</span>
                        <input type="number" class="page-input" min="1" max="${this.totalPages}" value="${this.config.currentPage}">
                        <button class="page-btn page-go">Go</button>
                    </div>
                ` : ''}
            </div>
        `;

        this.attachEvents(container);
    }

    getPageNumbers() {
        const pages = [];
        const totalPages = this.totalPages;
        const current = this.config.currentPage;
        const maxButtons = this.config.maxButtons;

        if (totalPages <= maxButtons) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            pages.push(1);
            
            let start = Math.max(2, current - Math.floor(maxButtons / 2));
            let end = Math.min(totalPages - 1, start + maxButtons - 3);
            
            if (end - start < maxButtons - 3) {
                start = Math.max(2, end - maxButtons + 3);
            }
            
            if (start > 2) pages.push('...');
            
            for (let i = start; i <= end; i++) {
                pages.push(i);
            }
            
            if (end < totalPages - 1) pages.push('...');
            pages.push(totalPages);
        }

        return pages;
    }

    getStartIndex() {
        return (this.config.currentPage - 1) * this.config.itemsPerPage;
    }

    getEndIndex() {
        return Math.min(this.getStartIndex() + this.config.itemsPerPage, this.config.totalItems);
    }

    attachEvents(container) {
        container.querySelector('.page-first')?.addEventListener('click', () => {
            this.goToPage(1);
        });

        container.querySelector('.page-prev')?.addEventListener('click', () => {
            this.goToPage(this.config.currentPage - 1);
        });

        container.querySelector('.page-next')?.addEventListener('click', () => {
            this.goToPage(this.config.currentPage + 1);
        });

        container.querySelector('.page-last')?.addEventListener('click', () => {
            this.goToPage(this.totalPages);
        });

        container.querySelectorAll('.page-number').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.goToPage(parseInt(e.target.dataset.page));
            });
        });

        const goBtn = container.querySelector('.page-go');
        const input = container.querySelector('.page-input');
        
        if (goBtn && input) {
            goBtn.addEventListener('click', () => {
                const page = parseInt(input.value);
                if (page >= 1 && page <= this.totalPages) {
                    this.goToPage(page);
                }
            });

            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    goBtn.click();
                }
            });
        }
    }

    goToPage(page) {
        if (page < 1 || page > this.totalPages || page === this.config.currentPage) return;
        
        this.config.currentPage = page;
        this.config.onPageChange(page);
        this.render(this.lastContainerId);
    }
}

// ============================================
// 3. Search Component (搜索组件)
// ============================================
class SearchComponent {
    constructor(config = {}) {
        this.config = {
            placeholder: config.placeholder || 'Search...',
            onSearch: config.onSearch || (() => {}),
            onClear: config.onClear || (() => {}),
            debounceTime: config.debounceTime || 300,
            showAdvanced: config.showAdvanced || false,
            filters: config.filters || [],
            showSuggestions: config.showSuggestions || false,
            suggestions: config.suggestions || []
        };
        this.debounceTimer = null;
    }

    render(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = `
            <div class="search-component">
                <div class="search-bar">
                    <i class="fas fa-search search-icon"></i>
                    <input type="text" class="search-input" placeholder="${this.config.placeholder}">
                    <button class="search-clear" style="display: none;">
                        <i class="fas fa-times"></i>
                    </button>
                    ${this.config.showAdvanced ? `
                        <button class="search-advanced">
                            <i class="fas fa-filter"></i>
                        </button>
                    ` : ''}
                </div>
                
                ${this.config.showAdvanced ? `
                    <div class="search-filters" style="display: none;">
                        ${this.config.filters.map(filter => `
                            <div class="filter-item">
                                <label>${filter.label}</label>
                                ${this.renderFilter(filter)}
                            </div>
                        `).join('')}
                        <button class="filter-apply">Apply Filters</button>
                        <button class="filter-reset">Reset</button>
                    </div>
                ` : ''}
                
                ${this.config.showSuggestions ? `
                    <div class="search-suggestions" style="display: none;">
                        <ul class="suggestions-list"></ul>
                    </div>
                ` : ''}
            </div>
        `;

        this.attachEvents(container);
    }

    renderFilter(filter) {
        switch (filter.type) {
            case 'select':
                return `
                    <select class="filter-select" data-field="${filter.field}">
                        <option value="">All</option>
                        ${filter.options.map(opt => `
                            <option value="${opt.value}">${opt.label}</option>
                        `).join('')}
                    </select>
                `;
            case 'date':
                return `
                    <input type="date" class="filter-date" data-field="${filter.field}">
                `;
            case 'range':
                return `
                    <div class="filter-range">
                        <input type="number" class="filter-min" data-field="${filter.field}" placeholder="Min">
                        <span>-</span>
                        <input type="number" class="filter-max" data-field="${filter.field}" placeholder="Max">
                    </div>
                `;
            default:
                return `<input type="text" class="filter-input" data-field="${filter.field}">`;
        }
    }

    attachEvents(container) {
        const input = container.querySelector('.search-input');
        const clearBtn = container.querySelector('.search-clear');
        const advancedBtn = container.querySelector('.search-advanced');
        const filtersPanel = container.querySelector('.search-filters');

        input.addEventListener('input', (e) => {
            const value = e.target.value;
            clearBtn.style.display = value ? 'block' : 'none';
            
            clearTimeout(this.debounceTimer);
            this.debounceTimer = setTimeout(() => {
                this.config.onSearch(value, this.getFilters());
                if (this.config.showSuggestions) {
                    this.updateSuggestions(value);
                }
            }, this.config.debounceTime);
        });

        clearBtn?.addEventListener('click', () => {
            input.value = '';
            clearBtn.style.display = 'none';
            this.config.onClear();
        });

        advancedBtn?.addEventListener('click', () => {
            filtersPanel.style.display = filtersPanel.style.display === 'none' ? 'block' : 'none';
        });

        container.querySelector('.filter-apply')?.addEventListener('click', () => {
            this.config.onSearch(input.value, this.getFilters());
        });

        container.querySelector('.filter-reset')?.addEventListener('click', () => {
            container.querySelectorAll('.filter-select, .filter-input, .filter-date').forEach(el => {
                el.value = '';
            });
            this.config.onSearch(input.value, {});
        });
    }

    getFilters() {
        const filters = {};
        document.querySelectorAll('[data-field]').forEach(el => {
            if (el.value) {
                filters[el.dataset.field] = el.value;
            }
        });
        return filters;
    }

    updateSuggestions(query) {
        // Implementation for suggestions
    }
}

// ============================================
// 4. Date/Time Picker Component (日期时间选择器)
// ============================================
class DateTimePickerComponent {
    constructor(config = {}) {
        this.config = {
            type: config.type || 'date', // date | time | datetime | daterange
            format: config.format || 'YYYY-MM-DD',
            value: config.value || null,
            min: config.min || null,
            max: config.max || null,
            onChange: config.onChange || (() => {}),
            showTime: config.showTime || false,
            showClear: config.showClear !== false
        };
    }

    render(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const inputType = this.config.type === 'datetime' ? 'datetime-local' : this.config.type;
        
        container.innerHTML = `
            <div class="datetime-component">
                ${this.config.type === 'daterange' ? `
                    <div class="daterange-picker">
                        <input type="date" class="date-start" placeholder="Start Date">
                        <span class="date-separator">to</span>
                        <input type="date" class="date-end" placeholder="End Date">
                    </div>
                ` : `
                    <div class="datetime-picker">
                        <input type="${inputType}" 
                               class="datetime-input" 
                               value="${this.config.value || ''}"
                               ${this.config.min ? `min="${this.config.min}"` : ''}
                               ${this.config.max ? `max="${this.config.max}"` : ''}>
                        ${this.config.showClear ? `
                            <button class="date-clear" ${!this.config.value ? 'style="display:none;"' : ''}>
                                <i class="fas fa-times"></i>
                            </button>
                        ` : ''}
                    </div>
                `}
                
                <div class="datetime-shortcuts">
                    <button class="shortcut-btn" data-shortcut="today">Today</button>
                    <button class="shortcut-btn" data-shortcut="yesterday">Yesterday</button>
                    <button class="shortcut-btn" data-shortcut="week">This Week</button>
                    <button class="shortcut-btn" data-shortcut="month">This Month</button>
                </div>
            </div>
        `;

        this.attachEvents(container);
    }

    attachEvents(container) {
        const input = container.querySelector('.datetime-input');
        const clearBtn = container.querySelector('.date-clear');
        
        if (input) {
            input.addEventListener('change', (e) => {
                this.config.value = e.target.value;
                if (clearBtn) {
                    clearBtn.style.display = e.target.value ? 'block' : 'none';
                }
                this.config.onChange(e.target.value);
            });
        }

        clearBtn?.addEventListener('click', () => {
            input.value = '';
            this.config.value = null;
            clearBtn.style.display = 'none';
            this.config.onChange(null);
        });

        container.querySelectorAll('.shortcut-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const shortcut = e.target.dataset.shortcut;
                const date = this.getShortcutDate(shortcut);
                if (input) {
                    input.value = this.formatDate(date);
                    input.dispatchEvent(new Event('change'));
                }
            });
        });
    }

    getShortcutDate(shortcut) {
        const now = new Date();
        switch (shortcut) {
            case 'today':
                return now;
            case 'yesterday':
                return new Date(now.setDate(now.getDate() - 1));
            case 'week':
                return new Date(now.setDate(now.getDate() - now.getDay()));
            case 'month':
                return new Date(now.getFullYear(), now.getMonth(), 1);
            default:
                return now;
        }
    }

    formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
}

// ============================================
// 5. Modal Component (模态框组件)
// ============================================
class ModalComponent {
    constructor(config = {}) {
        this.config = {
            title: config.title || 'Modal',
            content: config.content || '',
            size: config.size || 'medium', // small | medium | large | fullscreen
            showClose: config.showClose !== false,
            showFooter: config.showFooter !== false,
            buttons: config.buttons || [
                { text: 'Cancel', type: 'secondary', action: 'close' },
                { text: 'Confirm', type: 'primary', action: 'confirm' }
            ],
            onClose: config.onClose || (() => {}),
            onConfirm: config.onConfirm || (() => {}),
            backdrop: config.backdrop !== false,
            keyboard: config.keyboard !== false
        };
        this.isOpen = false;
    }

    render() {
        // Remove existing modal if any
        const existing = document.getElementById('modal-component');
        if (existing) existing.remove();

        const modal = document.createElement('div');
        modal.id = 'modal-component';
        modal.className = `modal-component ${this.config.size}`;
        modal.innerHTML = `
            <div class="modal-backdrop" ${!this.config.backdrop ? 'style="pointer-events:none;"' : ''}></div>
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 class="modal-title">${this.config.title}</h3>
                        ${this.config.showClose ? `
                            <button class="modal-close">
                                <i class="fas fa-times"></i>
                            </button>
                        ` : ''}
                    </div>
                    <div class="modal-body">
                        ${this.config.content}
                    </div>
                    ${this.config.showFooter ? `
                        <div class="modal-footer">
                            ${this.config.buttons.map(btn => `
                                <button class="modal-btn btn-${btn.type}" data-action="${btn.action}">
                                    ${btn.text}
                                </button>
                            `).join('')}
                        </div>
                    ` : ''}
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        this.attachEvents(modal);
        
        // Add open animation
        setTimeout(() => {
            modal.classList.add('open');
        }, 10);
        
        this.isOpen = true;
    }

    attachEvents(modal) {
        const backdrop = modal.querySelector('.modal-backdrop');
        const closeBtn = modal.querySelector('.modal-close');
        
        if (this.config.backdrop && backdrop) {
            backdrop.addEventListener('click', () => this.close());
        }

        closeBtn?.addEventListener('click', () => this.close());

        modal.querySelectorAll('.modal-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.target.dataset.action;
                if (action === 'close') {
                    this.close();
                } else if (action === 'confirm') {
                    this.config.onConfirm();
                    this.close();
                } else {
                    // Custom action
                    const button = this.config.buttons.find(b => b.action === action);
                    if (button && button.handler) {
                        button.handler();
                    }
                }
            });
        });

        if (this.config.keyboard) {
            document.addEventListener('keydown', this.handleKeydown = (e) => {
                if (e.key === 'Escape' && this.isOpen) {
                    this.close();
                }
            });
        }
    }

    open() {
        this.render();
    }

    close() {
        const modal = document.getElementById('modal-component');
        if (modal) {
            modal.classList.remove('open');
            setTimeout(() => {
                modal.remove();
                this.isOpen = false;
                this.config.onClose();
                
                if (this.handleKeydown) {
                    document.removeEventListener('keydown', this.handleKeydown);
                }
            }, 300);
        }
    }
}

// ============================================
// 6. Table Component (表格组件)
// ============================================
class TableComponent {
    constructor(config = {}) {
        this.config = {
            columns: config.columns || [],
            data: config.data || [],
            sortable: config.sortable !== false,
            filterable: config.filterable || false,
            selectable: config.selectable || false,
            pagination: config.pagination || false,
            pageSize: config.pageSize || 10,
            onSort: config.onSort || (() => {}),
            onSelect: config.onSelect || (() => {}),
            onRowClick: config.onRowClick || (() => {}),
            emptyText: config.emptyText || 'No data available',
            striped: config.striped !== false,
            hoverable: config.hoverable !== false
        };
        this.sortColumn = null;
        this.sortDirection = 'asc';
        this.selectedRows = [];
        this.currentPage = 1;
    }

    render(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const paginatedData = this.config.pagination ? 
            this.getPaginatedData() : this.config.data;

        container.innerHTML = `
            <div class="table-component">
                <table class="data-table ${this.config.striped ? 'striped' : ''} ${this.config.hoverable ? 'hoverable' : ''}">
                    <thead>
                        <tr>
                            ${this.config.selectable ? `
                                <th class="checkbox-column">
                                    <input type="checkbox" class="select-all">
                                </th>
                            ` : ''}
                            ${this.config.columns.map(col => `
                                <th class="${this.config.sortable && col.sortable !== false ? 'sortable' : ''}"
                                    data-field="${col.field}">
                                    ${col.label}
                                    ${this.config.sortable && col.sortable !== false ? `
                                        <span class="sort-icon">
                                            <i class="fas fa-sort"></i>
                                        </span>
                                    ` : ''}
                                </th>
                            `).join('')}
                        </tr>
                    </thead>
                    <tbody>
                        ${paginatedData.length > 0 ? paginatedData.map((row, index) => `
                            <tr data-index="${index}">
                                ${this.config.selectable ? `
                                    <td class="checkbox-column">
                                        <input type="checkbox" class="row-select" data-index="${index}">
                                    </td>
                                ` : ''}
                                ${this.config.columns.map(col => `
                                    <td>${this.getCellValue(row, col)}</td>
                                `).join('')}
                            </tr>
                        `).join('') : `
                            <tr>
                                <td colspan="${this.config.columns.length + (this.config.selectable ? 1 : 0)}" 
                                    class="empty-message">
                                    ${this.config.emptyText}
                                </td>
                            </tr>
                        `}
                    </tbody>
                </table>
                
                ${this.config.pagination ? `
                    <div id="table-pagination"></div>
                ` : ''}
            </div>
        `;

        this.attachEvents(container);

        if (this.config.pagination) {
            const pagination = new PaginationComponent({
                totalItems: this.config.data.length,
                itemsPerPage: this.config.pageSize,
                currentPage: this.currentPage,
                onPageChange: (page) => {
                    this.currentPage = page;
                    this.render(containerId);
                }
            });
            pagination.render('table-pagination');
        }
    }

    getCellValue(row, column) {
        if (column.render) {
            return column.render(row[column.field], row);
        }
        return row[column.field] || '';
    }

    getPaginatedData() {
        const start = (this.currentPage - 1) * this.config.pageSize;
        const end = start + this.config.pageSize;
        return this.config.data.slice(start, end);
    }

    attachEvents(container) {
        // Sort events
        if (this.config.sortable) {
            container.querySelectorAll('th.sortable').forEach(th => {
                th.addEventListener('click', () => {
                    const field = th.dataset.field;
                    this.sort(field);
                });
            });
        }

        // Select events
        if (this.config.selectable) {
            const selectAll = container.querySelector('.select-all');
            selectAll?.addEventListener('change', (e) => {
                const checked = e.target.checked;
                container.querySelectorAll('.row-select').forEach(cb => {
                    cb.checked = checked;
                });
                this.updateSelection();
            });

            container.querySelectorAll('.row-select').forEach(cb => {
                cb.addEventListener('change', () => {
                    this.updateSelection();
                });
            });
        }

        // Row click events
        container.querySelectorAll('tbody tr').forEach(tr => {
            tr.addEventListener('click', (e) => {
                if (!e.target.matches('input[type="checkbox"]')) {
                    const index = parseInt(tr.dataset.index);
                    if (!isNaN(index)) {
                        this.config.onRowClick(this.config.data[index], index);
                    }
                }
            });
        });
    }

    sort(field) {
        if (this.sortColumn === field) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortColumn = field;
            this.sortDirection = 'asc';
        }

        this.config.data.sort((a, b) => {
            const aVal = a[field];
            const bVal = b[field];
            
            if (aVal < bVal) return this.sortDirection === 'asc' ? -1 : 1;
            if (aVal > bVal) return this.sortDirection === 'asc' ? 1 : -1;
            return 0;
        });

        this.config.onSort(field, this.sortDirection);
        this.render(this.lastContainerId);
    }

    updateSelection() {
        this.selectedRows = [];
        document.querySelectorAll('.row-select:checked').forEach(cb => {
            const index = parseInt(cb.dataset.index);
            if (!isNaN(index)) {
                this.selectedRows.push(this.config.data[index]);
            }
        });
        this.config.onSelect(this.selectedRows);
    }
}

// ============================================
// 7. Notification Component (通知组件)
// ============================================
class NotificationComponent {
    static show(config = {}) {
        const notification = {
            type: config.type || 'info', // success | error | warning | info
            title: config.title || '',
            message: config.message || '',
            duration: config.duration || 3000,
            position: config.position || 'top-right',
            showClose: config.showClose !== false,
            onClick: config.onClick || (() => {})
        };

        // Create container if not exists
        let container = document.getElementById('notification-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'notification-container';
            container.className = `notification-container ${notification.position}`;
            document.body.appendChild(container);
        }

        // Create notification element
        const element = document.createElement('div');
        element.className = `notification notification-${notification.type}`;
        element.innerHTML = `
            <div class="notification-icon">
                <i class="fas fa-${this.getIcon(notification.type)}"></i>
            </div>
            <div class="notification-content">
                ${notification.title ? `<div class="notification-title">${notification.title}</div>` : ''}
                <div class="notification-message">${notification.message}</div>
            </div>
            ${notification.showClose ? `
                <button class="notification-close">
                    <i class="fas fa-times"></i>
                </button>
            ` : ''}
        `;

        container.appendChild(element);

        // Add animation
        setTimeout(() => element.classList.add('show'), 10);

        // Auto close
        let closeTimer;
        if (notification.duration > 0) {
            closeTimer = setTimeout(() => {
                this.close(element);
            }, notification.duration);
        }

        // Events
        element.addEventListener('click', (e) => {
            if (!e.target.matches('.notification-close')) {
                notification.onClick();
            }
        });

        element.querySelector('.notification-close')?.addEventListener('click', (e) => {
            e.stopPropagation();
            clearTimeout(closeTimer);
            this.close(element);
        });

        return element;
    }

    static close(element) {
        element.classList.remove('show');
        setTimeout(() => {
            element.remove();
            // Remove container if empty
            const container = document.getElementById('notification-container');
            if (container && container.children.length === 0) {
                container.remove();
            }
        }, 300);
    }

    static getIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'times-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    static success(message, title) {
        return this.show({ type: 'success', message, title });
    }

    static error(message, title) {
        return this.show({ type: 'error', message, title });
    }

    static warning(message, title) {
        return this.show({ type: 'warning', message, title });
    }

    static info(message, title) {
        return this.show({ type: 'info', message, title });
    }
}

// ============================================
// 8. Loading Component (加载组件)
// ============================================
class LoadingComponent {
    static show(config = {}) {
        const loading = {
            text: config.text || 'Loading...',
            type: config.type || 'spinner', // spinner | dots | bar
            overlay: config.overlay !== false,
            target: config.target || document.body
        };

        const element = document.createElement('div');
        element.className = 'loading-component';
        element.innerHTML = `
            ${loading.overlay ? '<div class="loading-overlay"></div>' : ''}
            <div class="loading-content">
                <div class="loading-${loading.type}">
                    ${this.getLoader(loading.type)}
                </div>
                ${loading.text ? `<div class="loading-text">${loading.text}</div>` : ''}
            </div>
        `;

        loading.target.appendChild(element);
        loading.target.classList.add('loading-active');

        return element;
    }

    static hide(element) {
        if (element) {
            element.remove();
            const parent = element.parentElement;
            if (parent) {
                parent.classList.remove('loading-active');
            }
        } else {
            // Hide all loading
            document.querySelectorAll('.loading-component').forEach(el => {
                el.remove();
            });
            document.querySelectorAll('.loading-active').forEach(el => {
                el.classList.remove('loading-active');
            });
        }
    }

    static getLoader(type) {
        switch (type) {
            case 'dots':
                return `
                    <div class="loading-dots">
                        <span></span><span></span><span></span>
                    </div>
                `;
            case 'bar':
                return `<div class="loading-bar"></div>`;
            default:
                return `<div class="loading-spinner"></div>`;
        }
    }
}

// Export components for use
window.Components = {
    Navigation: NavigationComponent,
    Pagination: PaginationComponent,
    Search: SearchComponent,
    DateTimePicker: DateTimePickerComponent,
    Modal: ModalComponent,
    Table: TableComponent,
    Notification: NotificationComponent,
    Loading: LoadingComponent
};