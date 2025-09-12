// API Client for EV Charging SaaS Platform

// API Configuration
const API_CONFIG = {
    BASE_URL: window.location.hostname === 'localhost' 
        ? 'http://localhost:3000/api/v1' 
        : 'https://api.evcharge.com/v1',
    TIMEOUT: 10000,
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000
};

// API Endpoints
const ENDPOINTS = {
    // Authentication
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH_TOKEN: '/auth/refresh',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    
    // Admin endpoints
    TENANTS: '/admin/tenants',
    TENANT_DETAILS: '/admin/tenants/:id',
    PLATFORM_STATS: '/admin/stats',
    SYSTEM_HEALTH: '/admin/health',
    
    // Company endpoints
    STATIONS: '/stations',
    STATION_DETAILS: '/stations/:id',
    CHARGERS: '/chargers',
    CHARGER_DETAILS: '/chargers/:id',
    CHARGER_CONTROL: '/chargers/:id/control',
    SESSIONS: '/sessions',
    SESSION_DETAILS: '/sessions/:id',
    PRICING: '/pricing',
    ANALYTICS: '/analytics',
    
    // User endpoints
    USER_PROFILE: '/users/profile',
    USER_VEHICLES: '/users/vehicles',
    USER_PAYMENTS: '/users/payments',
    USER_HISTORY: '/users/history',
    USER_FAVORITES: '/users/favorites',
    
    // Charging operations
    START_CHARGING: '/charging/start',
    STOP_CHARGING: '/charging/stop',
    CHARGING_STATUS: '/charging/status/:sessionId',
    
    // Search and discovery
    SEARCH_STATIONS: '/search/stations',
    NEARBY_STATIONS: '/search/nearby',
    STATION_AVAILABILITY: '/stations/:id/availability',
    
    // Payments
    PAYMENT_METHODS: '/payments/methods',
    ADD_PAYMENT_METHOD: '/payments/methods/add',
    REMOVE_PAYMENT_METHOD: '/payments/methods/:id/remove',
    PAYMENT_HISTORY: '/payments/history',
    PROCESS_PAYMENT: '/payments/process'
};

// Custom API Error class
class APIError extends Error {
    constructor(message, status, code, details = null) {
        super(message);
        this.name = 'APIError';
        this.status = status;
        this.code = code;
        this.details = details;
    }
}

// Request interceptor for adding headers
function requestInterceptor(config) {
    // Add auth token if available
    const token = sessionManager.getAuthToken();
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Add CSRF token
    config.headers['X-CSRF-Token'] = csrfManager.getToken();
    
    // Add request ID for tracking
    config.headers['X-Request-ID'] = generateSecureRandomString(16);
    
    // Add timestamp
    config.headers['X-Timestamp'] = new Date().toISOString();
    
    return config;
}

// Response interceptor for handling responses
function responseInterceptor(response) {
    // Refresh session on successful requests
    sessionManager.refreshSession();
    
    // Handle rate limit headers
    const remaining = response.headers.get('X-RateLimit-Remaining');
    const reset = response.headers.get('X-RateLimit-Reset');
    
    if (remaining && parseInt(remaining) < 10) {
        console.warn(`API rate limit warning: ${remaining} requests remaining`);
    }
    
    return response;
}

// Retry logic with exponential backoff
async function retryRequest(fn, attempts = API_CONFIG.RETRY_ATTEMPTS) {
    try {
        return await fn();
    } catch (error) {
        if (attempts <= 1 || error.status === 401 || error.status === 403) {
            throw error;
        }
        
        const delay = API_CONFIG.RETRY_DELAY * Math.pow(2, API_CONFIG.RETRY_ATTEMPTS - attempts);
        await new Promise(resolve => setTimeout(resolve, delay));
        
        return retryRequest(fn, attempts - 1);
    }
}

// Main API client class
class APIClient {
    constructor(config = API_CONFIG) {
        this.baseURL = config.BASE_URL;
        this.timeout = config.TIMEOUT;
        this.cache = new Map();
        this.pendingRequests = new Map();
    }
    
    // Build URL with path parameters
    buildURL(endpoint, params = {}) {
        let url = this.baseURL + endpoint;
        
        // Replace path parameters
        Object.keys(params).forEach(key => {
            url = url.replace(`:${key}`, params[key]);
        });
        
        return url;
    }
    
    // Make HTTP request
    async request(method, endpoint, options = {}) {
        const { 
            params = {}, 
            data = null, 
            headers = {}, 
            cache = false,
            retry = true 
        } = options;
        
        const url = this.buildURL(endpoint, params);
        const cacheKey = `${method}:${url}`;
        
        // Check cache for GET requests
        if (method === 'GET' && cache) {
            const cachedData = this.cache.get(cacheKey);
            if (cachedData && Date.now() - cachedData.timestamp < 60000) {
                return cachedData.data;
            }
        }
        
        // Prevent duplicate requests
        if (this.pendingRequests.has(cacheKey)) {
            return this.pendingRequests.get(cacheKey);
        }
        
        const requestConfig = {
            method,
            headers: {
                'Content-Type': 'application/json',
                ...headers
            },
            signal: AbortSignal.timeout(this.timeout)
        };
        
        if (data && method !== 'GET') {
            requestConfig.body = JSON.stringify(data);
        }
        
        // Apply request interceptor
        const config = requestInterceptor(requestConfig);
        
        // Create request promise
        const requestPromise = (async () => {
            try {
                const makeRequest = async () => {
                    const response = await fetch(url, config);
                    
                    // Apply response interceptor
                    responseInterceptor(response);
                    
                    if (!response.ok) {
                        const errorData = await response.json().catch(() => ({}));
                        throw new APIError(
                            errorData.message || `Request failed: ${response.statusText}`,
                            response.status,
                            errorData.code || 'API_ERROR',
                            errorData.details
                        );
                    }
                    
                    const responseData = await response.json();
                    
                    // Cache successful GET requests
                    if (method === 'GET' && cache) {
                        this.cache.set(cacheKey, {
                            data: responseData,
                            timestamp: Date.now()
                        });
                    }
                    
                    return responseData;
                };
                
                // Use retry logic if enabled
                return retry ? await retryRequest(makeRequest) : await makeRequest();
                
            } catch (error) {
                if (error.name === 'AbortError') {
                    throw new APIError('Request timeout', 408, 'TIMEOUT');
                }
                
                if (error instanceof APIError) {
                    throw error;
                }
                
                throw new APIError(
                    error.message || 'Network error',
                    0,
                    'NETWORK_ERROR'
                );
            } finally {
                this.pendingRequests.delete(cacheKey);
            }
        })();
        
        this.pendingRequests.set(cacheKey, requestPromise);
        return requestPromise;
    }
    
    // HTTP method shortcuts
    get(endpoint, options = {}) {
        return this.request('GET', endpoint, options);
    }
    
    post(endpoint, data, options = {}) {
        return this.request('POST', endpoint, { ...options, data });
    }
    
    put(endpoint, data, options = {}) {
        return this.request('PUT', endpoint, { ...options, data });
    }
    
    patch(endpoint, data, options = {}) {
        return this.request('PATCH', endpoint, { ...options, data });
    }
    
    delete(endpoint, options = {}) {
        return this.request('DELETE', endpoint, options);
    }
    
    // Clear cache
    clearCache() {
        this.cache.clear();
    }
}

// Create singleton instance
const apiClient = new APIClient();

// Authentication API
const authAPI = {
    async login(email, password) {
        const response = await apiClient.post(ENDPOINTS.LOGIN, { email, password });
        if (response.token) {
            sessionManager.createSession(response.user, response.token);
        }
        return response;
    },
    
    async register(userData) {
        return apiClient.post(ENDPOINTS.REGISTER, userData);
    },
    
    async logout() {
        try {
            await apiClient.post(ENDPOINTS.LOGOUT);
        } finally {
            sessionManager.destroySession();
        }
    },
    
    async refreshToken() {
        const response = await apiClient.post(ENDPOINTS.REFRESH_TOKEN);
        if (response.token) {
            const session = sessionManager.getSession();
            if (session) {
                sessionManager.createSession(session.user, response.token);
            }
        }
        return response;
    },
    
    async forgotPassword(email) {
        return apiClient.post(ENDPOINTS.FORGOT_PASSWORD, { email });
    },
    
    async resetPassword(token, newPassword) {
        return apiClient.post(ENDPOINTS.RESET_PASSWORD, { token, newPassword });
    }
};

// Station API
const stationAPI = {
    async getStations(filters = {}) {
        return apiClient.get(ENDPOINTS.STATIONS, { 
            params: filters,
            cache: true 
        });
    },
    
    async getStationDetails(stationId) {
        return apiClient.get(ENDPOINTS.STATION_DETAILS, { 
            params: { id: stationId },
            cache: true 
        });
    },
    
    async createStation(stationData) {
        return apiClient.post(ENDPOINTS.STATIONS, stationData);
    },
    
    async updateStation(stationId, updates) {
        return apiClient.put(ENDPOINTS.STATION_DETAILS, updates, {
            params: { id: stationId }
        });
    },
    
    async deleteStation(stationId) {
        return apiClient.delete(ENDPOINTS.STATION_DETAILS, {
            params: { id: stationId }
        });
    },
    
    async searchNearby(lat, lng, radius = 10) {
        return apiClient.get(ENDPOINTS.NEARBY_STATIONS, {
            params: { lat, lng, radius },
            cache: true
        });
    },
    
    async getAvailability(stationId) {
        return apiClient.get(ENDPOINTS.STATION_AVAILABILITY, {
            params: { id: stationId }
        });
    }
};

// Charger API
const chargerAPI = {
    async getChargers(stationId = null) {
        const params = stationId ? { stationId } : {};
        return apiClient.get(ENDPOINTS.CHARGERS, { params, cache: true });
    },
    
    async getChargerDetails(chargerId) {
        return apiClient.get(ENDPOINTS.CHARGER_DETAILS, {
            params: { id: chargerId },
            cache: true
        });
    },
    
    async controlCharger(chargerId, command) {
        return apiClient.post(ENDPOINTS.CHARGER_CONTROL, { command }, {
            params: { id: chargerId }
        });
    },
    
    async updateChargerStatus(chargerId, status) {
        return apiClient.patch(ENDPOINTS.CHARGER_DETAILS, { status }, {
            params: { id: chargerId }
        });
    }
};

// Charging Session API
const chargingAPI = {
    async startSession(chargerId, paymentMethodId) {
        return apiClient.post(ENDPOINTS.START_CHARGING, {
            chargerId,
            paymentMethodId
        });
    },
    
    async stopSession(sessionId) {
        return apiClient.post(ENDPOINTS.STOP_CHARGING, { sessionId });
    },
    
    async getSessionStatus(sessionId) {
        return apiClient.get(ENDPOINTS.CHARGING_STATUS, {
            params: { sessionId }
        });
    },
    
    async getSessionHistory(filters = {}) {
        return apiClient.get(ENDPOINTS.SESSIONS, {
            params: filters,
            cache: true
        });
    }
};

// Payment API
const paymentAPI = {
    async getPaymentMethods() {
        return apiClient.get(ENDPOINTS.PAYMENT_METHODS);
    },
    
    async addPaymentMethod(paymentData) {
        return apiClient.post(ENDPOINTS.ADD_PAYMENT_METHOD, paymentData);
    },
    
    async removePaymentMethod(methodId) {
        return apiClient.delete(ENDPOINTS.REMOVE_PAYMENT_METHOD, {
            params: { id: methodId }
        });
    },
    
    async getPaymentHistory(filters = {}) {
        return apiClient.get(ENDPOINTS.PAYMENT_HISTORY, {
            params: filters,
            cache: true
        });
    },
    
    async processPayment(paymentData) {
        return apiClient.post(ENDPOINTS.PROCESS_PAYMENT, paymentData);
    }
};

// Export APIs
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        APIClient,
        apiClient,
        authAPI,
        stationAPI,
        chargerAPI,
        chargingAPI,
        paymentAPI,
        ENDPOINTS,
        API_CONFIG
    };
}