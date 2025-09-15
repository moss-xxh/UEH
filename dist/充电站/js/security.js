// Security utilities for EV Charging SaaS Platform

// Password validation
function validatePassword(password) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    const errors = [];
    
    if (password.length < minLength) {
        errors.push(`Password must be at least ${minLength} characters long`);
    }
    if (!hasUpperCase) {
        errors.push('Password must contain at least one uppercase letter');
    }
    if (!hasLowerCase) {
        errors.push('Password must contain at least one lowercase letter');
    }
    if (!hasNumbers) {
        errors.push('Password must contain at least one number');
    }
    if (!hasSpecialChar) {
        errors.push('Password must contain at least one special character');
    }
    
    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

// Email validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Input sanitization
function sanitizeInput(input) {
    if (typeof input !== 'string') return input;
    
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}

// CSRF token management
class CSRFManager {
    constructor() {
        this.tokenKey = 'csrf_token';
    }
    
    generateToken() {
        const array = new Uint8Array(32);
        crypto.getRandomValues(array);
        const token = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
        sessionStorage.setItem(this.tokenKey, token);
        return token;
    }
    
    getToken() {
        let token = sessionStorage.getItem(this.tokenKey);
        if (!token) {
            token = this.generateToken();
        }
        return token;
    }
    
    validateToken(token) {
        const storedToken = sessionStorage.getItem(this.tokenKey);
        return token === storedToken;
    }
}

// Session management
class SessionManager {
    constructor() {
        this.sessionKey = 'user_session';
        this.tokenKey = 'auth_token';
        this.sessionTimeout = 30 * 60 * 1000; // 30 minutes
    }
    
    createSession(user, token) {
        const session = {
            user: user,
            token: token,
            createdAt: Date.now(),
            expiresAt: Date.now() + this.sessionTimeout
        };
        
        localStorage.setItem(this.sessionKey, JSON.stringify(session));
        localStorage.setItem(this.tokenKey, token);
        
        // Set auto-logout timer
        this.setAutoLogout();
        
        return session;
    }
    
    getSession() {
        const sessionStr = localStorage.getItem(this.sessionKey);
        if (!sessionStr) return null;
        
        const session = JSON.parse(sessionStr);
        
        // Check if session expired
        if (Date.now() > session.expiresAt) {
            this.destroySession();
            return null;
        }
        
        return session;
    }
    
    refreshSession() {
        const session = this.getSession();
        if (session) {
            session.expiresAt = Date.now() + this.sessionTimeout;
            localStorage.setItem(this.sessionKey, JSON.stringify(session));
            this.setAutoLogout();
        }
    }
    
    destroySession() {
        localStorage.removeItem(this.sessionKey);
        localStorage.removeItem(this.tokenKey);
        clearTimeout(this.logoutTimer);
    }
    
    setAutoLogout() {
        clearTimeout(this.logoutTimer);
        this.logoutTimer = setTimeout(() => {
            this.destroySession();
            window.location.href = '/';
            showNotification('Session expired. Please login again.', 'info');
        }, this.sessionTimeout);
    }
    
    getAuthToken() {
        return localStorage.getItem(this.tokenKey);
    }
}

// Rate limiting
class RateLimiter {
    constructor(maxRequests = 10, windowMs = 60000) {
        this.maxRequests = maxRequests;
        this.windowMs = windowMs;
        this.requests = new Map();
    }
    
    isAllowed(identifier) {
        const now = Date.now();
        const userRequests = this.requests.get(identifier) || [];
        
        // Remove old requests outside the window
        const validRequests = userRequests.filter(time => now - time < this.windowMs);
        
        if (validRequests.length >= this.maxRequests) {
            return false;
        }
        
        validRequests.push(now);
        this.requests.set(identifier, validRequests);
        
        return true;
    }
    
    reset(identifier) {
        this.requests.delete(identifier);
    }
}

// XSS prevention
function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Secure random string generation
function generateSecureRandomString(length = 32) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars[array[i] % chars.length];
    }
    
    return result;
}

// API key validation
function validateAPIKey(apiKey) {
    // Check format: xxx-xxx-xxx-xxx
    const apiKeyPattern = /^[A-Za-z0-9]{8}-[A-Za-z0-9]{4}-[A-Za-z0-9]{4}-[A-Za-z0-9]{12}$/;
    return apiKeyPattern.test(apiKey);
}

// Initialize security managers
const csrfManager = new CSRFManager();
const sessionManager = new SessionManager();
const rateLimiter = new RateLimiter();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validatePassword,
        validateEmail,
        sanitizeInput,
        CSRFManager,
        SessionManager,
        RateLimiter,
        escapeHtml,
        generateSecureRandomString,
        validateAPIKey,
        csrfManager,
        sessionManager,
        rateLimiter
    };
}