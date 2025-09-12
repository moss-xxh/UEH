/**
 * Shared Utilities for All Portals
 * 所有门户的通用工具函数
 */

// Date and Time Utilities
const DateUtils = {
    format: (date, format = 'YYYY-MM-DD HH:mm:ss') => {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        const seconds = String(d.getSeconds()).padStart(2, '0');
        
        return format
            .replace('YYYY', year)
            .replace('MM', month)
            .replace('DD', day)
            .replace('HH', hours)
            .replace('mm', minutes)
            .replace('ss', seconds);
    },
    
    relative: (date) => {
        const now = new Date();
        const then = new Date(date);
        const diff = now - then;
        
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        
        if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
        if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        return 'Just now';
    },
    
    isToday: (date) => {
        const today = new Date();
        const d = new Date(date);
        return d.toDateString() === today.toDateString();
    },
    
    addDays: (date, days) => {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }
};

// Number Utilities
const NumberUtils = {
    format: (num, decimals = 0) => {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        }).format(num);
    },
    
    currency: (amount, currency = 'USD') => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency
        }).format(amount);
    },
    
    percentage: (value, total) => {
        if (total === 0) return '0%';
        return `${((value / total) * 100).toFixed(1)}%`;
    },
    
    abbreviate: (num) => {
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
        return num.toString();
    }
};

// String Utilities
const StringUtils = {
    truncate: (str, length = 50, suffix = '...') => {
        if (str.length <= length) return str;
        return str.substring(0, length - suffix.length) + suffix;
    },
    
    capitalize: (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    },
    
    camelToSnake: (str) => {
        return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    },
    
    snakeToCamel: (str) => {
        return str.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
    },
    
    slugify: (str) => {
        return str
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    },
    
    generateId: (prefix = '') => {
        return `${prefix}${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
};

// Array Utilities
const ArrayUtils = {
    chunk: (array, size) => {
        const chunks = [];
        for (let i = 0; i < array.length; i += size) {
            chunks.push(array.slice(i, i + size));
        }
        return chunks;
    },
    
    unique: (array, key) => {
        if (key) {
            const seen = new Set();
            return array.filter(item => {
                const val = item[key];
                if (seen.has(val)) return false;
                seen.add(val);
                return true;
            });
        }
        return [...new Set(array)];
    },
    
    groupBy: (array, key) => {
        return array.reduce((groups, item) => {
            const group = item[key];
            if (!groups[group]) groups[group] = [];
            groups[group].push(item);
            return groups;
        }, {});
    },
    
    sortBy: (array, key, desc = false) => {
        return array.sort((a, b) => {
            if (a[key] < b[key]) return desc ? 1 : -1;
            if (a[key] > b[key]) return desc ? -1 : 1;
            return 0;
        });
    }
};

// Storage Utilities
const StorageUtils = {
    set: (key, value, expiry = null) => {
        const item = {
            value: value,
            expiry: expiry ? Date.now() + expiry : null
        };
        localStorage.setItem(key, JSON.stringify(item));
    },
    
    get: (key) => {
        const itemStr = localStorage.getItem(key);
        if (!itemStr) return null;
        
        try {
            const item = JSON.parse(itemStr);
            if (item.expiry && Date.now() > item.expiry) {
                localStorage.removeItem(key);
                return null;
            }
            return item.value;
        } catch (e) {
            return null;
        }
    },
    
    remove: (key) => {
        localStorage.removeItem(key);
    },
    
    clear: () => {
        localStorage.clear();
    },
    
    size: () => {
        let size = 0;
        for (let key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                size += localStorage[key].length + key.length;
            }
        }
        return size;
    }
};

// URL Utilities
const URLUtils = {
    getParams: () => {
        const params = {};
        const searchParams = new URLSearchParams(window.location.search);
        for (const [key, value] of searchParams) {
            params[key] = value;
        }
        return params;
    },
    
    getParam: (name) => {
        const searchParams = new URLSearchParams(window.location.search);
        return searchParams.get(name);
    },
    
    setParam: (name, value) => {
        const url = new URL(window.location);
        url.searchParams.set(name, value);
        window.history.pushState({}, '', url);
    },
    
    removeParam: (name) => {
        const url = new URL(window.location);
        url.searchParams.delete(name);
        window.history.pushState({}, '', url);
    },
    
    buildQuery: (params) => {
        return Object.keys(params)
            .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
            .join('&');
    }
};

// Validation Utilities
const ValidationUtils = {
    isEmail: (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },
    
    isPhone: (phone) => {
        const re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
        return re.test(phone);
    },
    
    isURL: (url) => {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    },
    
    isStrongPassword: (password) => {
        // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
        const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return re.test(password);
    },
    
    isCreditCard: (number) => {
        const re = /^[0-9]{13,19}$/;
        return re.test(number.replace(/\s/g, ''));
    }
};

// DOM Utilities
const DOMUtils = {
    ready: (fn) => {
        if (document.readyState !== 'loading') {
            fn();
        } else {
            document.addEventListener('DOMContentLoaded', fn);
        }
    },
    
    createElement: (tag, attributes = {}, children = []) => {
        const element = document.createElement(tag);
        Object.entries(attributes).forEach(([key, value]) => {
            if (key === 'className') {
                element.className = value;
            } else if (key === 'style' && typeof value === 'object') {
                Object.assign(element.style, value);
            } else if (key.startsWith('on')) {
                element.addEventListener(key.substring(2).toLowerCase(), value);
            } else {
                element.setAttribute(key, value);
            }
        });
        children.forEach(child => {
            if (typeof child === 'string') {
                element.appendChild(document.createTextNode(child));
            } else {
                element.appendChild(child);
            }
        });
        return element;
    },
    
    show: (element) => {
        element.style.display = '';
    },
    
    hide: (element) => {
        element.style.display = 'none';
    },
    
    toggle: (element) => {
        element.style.display = element.style.display === 'none' ? '' : 'none';
    },
    
    addClass: (element, className) => {
        element.classList.add(className);
    },
    
    removeClass: (element, className) => {
        element.classList.remove(className);
    },
    
    toggleClass: (element, className) => {
        element.classList.toggle(className);
    }
};

// Event Utilities
const EventUtils = {
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    throttle: (func, limit) => {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },
    
    once: (func) => {
        let called = false;
        return function(...args) {
            if (!called) {
                called = true;
                return func.apply(this, args);
            }
        };
    }
};

// Clipboard Utilities
const ClipboardUtils = {
    copy: async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (err) {
            // Fallback for older browsers
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            const success = document.execCommand('copy');
            document.body.removeChild(textarea);
            return success;
        }
    },
    
    paste: async () => {
        try {
            return await navigator.clipboard.readText();
        } catch (err) {
            return null;
        }
    }
};

// Export utilities
window.Utils = {
    Date: DateUtils,
    Number: NumberUtils,
    String: StringUtils,
    Array: ArrayUtils,
    Storage: StorageUtils,
    URL: URLUtils,
    Validation: ValidationUtils,
    DOM: DOMUtils,
    Event: EventUtils,
    Clipboard: ClipboardUtils
};