// State Management for EV Charging SaaS Platform

// Observable State Manager
class StateManager {
    constructor(initialState = {}) {
        this.state = initialState;
        this.listeners = new Map();
        this.middleware = [];
        this.history = [];
        this.maxHistorySize = 50;
    }
    
    // Get current state or specific property
    getState(path = null) {
        if (!path) return { ...this.state };
        
        const keys = path.split('.');
        let value = this.state;
        
        for (const key of keys) {
            value = value?.[key];
        }
        
        return value;
    }
    
    // Set state with optional path
    setState(updates, action = 'UPDATE') {
        const prevState = { ...this.state };
        
        // Apply middleware
        let finalUpdates = updates;
        for (const mw of this.middleware) {
            finalUpdates = mw(prevState, finalUpdates, action);
        }
        
        // Update state
        if (typeof finalUpdates === 'function') {
            this.state = finalUpdates(prevState);
        } else {
            this.state = { ...this.state, ...finalUpdates };
        }
        
        // Add to history
        this.addToHistory(prevState, this.state, action);
        
        // Notify listeners
        this.notify(this.state, prevState, action);
    }
    
    // Subscribe to state changes
    subscribe(listener, filter = null) {
        const id = Symbol('listener');
        this.listeners.set(id, { listener, filter });
        
        // Return unsubscribe function
        return () => {
            this.listeners.delete(id);
        };
    }
    
    // Add middleware
    use(middleware) {
        this.middleware.push(middleware);
    }
    
    // Notify all listeners
    notify(state, prevState, action) {
        this.listeners.forEach(({ listener, filter }) => {
            if (!filter || filter(state, prevState, action)) {
                listener(state, prevState, action);
            }
        });
    }
    
    // Add to history for undo/redo
    addToHistory(prevState, newState, action) {
        this.history.push({
            prevState,
            newState,
            action,
            timestamp: Date.now()
        });
        
        // Limit history size
        if (this.history.length > this.maxHistorySize) {
            this.history.shift();
        }
    }
    
    // Get state history
    getHistory() {
        return [...this.history];
    }
    
    // Clear history
    clearHistory() {
        this.history = [];
    }
    
    // Reset state
    reset() {
        const initialState = {};
        this.setState(initialState, 'RESET');
    }
}

// Application State Store
const initialAppState = {
    // User state
    user: null,
    isAuthenticated: false,
    userRole: null,
    
    // Company state
    company: null,
    companySettings: {},
    
    // Navigation state
    currentPage: 'landing',
    currentSection: null,
    navigationHistory: [],
    
    // Stations state
    stations: [],
    selectedStation: null,
    stationFilters: {
        search: '',
        status: 'all',
        city: 'all'
    },
    
    // Chargers state
    chargers: [],
    selectedCharger: null,
    chargerFilters: {
        stationId: 'all',
        status: 'all',
        type: 'all'
    },
    
    // Sessions state
    sessions: [],
    activeSession: null,
    sessionHistory: [],
    
    // Tenants state (admin)
    tenants: [],
    selectedTenant: null,
    
    // UI state
    modals: {
        addTenant: false,
        addStation: false,
        qrScanner: false,
        userProfile: false
    },
    notifications: [],
    loading: {
        stations: false,
        chargers: false,
        sessions: false,
        tenants: false
    },
    errors: {},
    
    // Settings
    language: 'en',
    theme: 'light',
    currency: 'USD',
    
    // Cache
    cache: {
        lastUpdated: null,
        expiresAt: null
    }
};

// Create global app state
const appState = new StateManager(initialAppState);

// State Actions
const actions = {
    // Authentication actions
    LOGIN: (userData, token) => {
        appState.setState({
            user: userData,
            isAuthenticated: true,
            userRole: userData.role,
            currentPage: userData.role === 'admin' ? 'admin-dashboard' : 
                       userData.role === 'company' ? 'company-dashboard' : 
                       'user-app'
        }, 'LOGIN');
    },
    
    LOGOUT: () => {
        appState.setState({
            user: null,
            isAuthenticated: false,
            userRole: null,
            currentPage: 'landing',
            activeSession: null
        }, 'LOGOUT');
        sessionManager.destroySession();
    },
    
    // Navigation actions
    NAVIGATE: (page, section = null) => {
        const currentNav = appState.getState('navigationHistory') || [];
        appState.setState({
            currentPage: page,
            currentSection: section,
            navigationHistory: [...currentNav, { page, section, timestamp: Date.now() }]
        }, 'NAVIGATE');
    },
    
    // Station actions
    SET_STATIONS: (stations) => {
        appState.setState({ stations }, 'SET_STATIONS');
    },
    
    ADD_STATION: (station) => {
        const stations = appState.getState('stations');
        appState.setState({ 
            stations: [...stations, station] 
        }, 'ADD_STATION');
    },
    
    UPDATE_STATION: (stationId, updates) => {
        const stations = appState.getState('stations');
        appState.setState({
            stations: stations.map(s => 
                s.id === stationId ? { ...s, ...updates } : s
            )
        }, 'UPDATE_STATION');
    },
    
    DELETE_STATION: (stationId) => {
        const stations = appState.getState('stations');
        appState.setState({
            stations: stations.filter(s => s.id !== stationId)
        }, 'DELETE_STATION');
    },
    
    SELECT_STATION: (station) => {
        appState.setState({ selectedStation: station }, 'SELECT_STATION');
    },
    
    // Charger actions
    SET_CHARGERS: (chargers) => {
        appState.setState({ chargers }, 'SET_CHARGERS');
    },
    
    UPDATE_CHARGER_STATUS: (chargerId, status) => {
        const chargers = appState.getState('chargers');
        appState.setState({
            chargers: chargers.map(c => 
                c.id === chargerId ? { ...c, status } : c
            )
        }, 'UPDATE_CHARGER_STATUS');
    },
    
    // Session actions
    START_SESSION: (session) => {
        appState.setState({ 
            activeSession: session 
        }, 'START_SESSION');
    },
    
    UPDATE_SESSION: (updates) => {
        const activeSession = appState.getState('activeSession');
        if (activeSession) {
            appState.setState({
                activeSession: { ...activeSession, ...updates }
            }, 'UPDATE_SESSION');
        }
    },
    
    END_SESSION: () => {
        const activeSession = appState.getState('activeSession');
        if (activeSession) {
            const sessionHistory = appState.getState('sessionHistory') || [];
            appState.setState({
                activeSession: null,
                sessionHistory: [...sessionHistory, { 
                    ...activeSession, 
                    endTime: Date.now(),
                    status: 'completed'
                }]
            }, 'END_SESSION');
        }
    },
    
    // Modal actions
    OPEN_MODAL: (modalName) => {
        const modals = appState.getState('modals');
        appState.setState({
            modals: { ...modals, [modalName]: true }
        }, 'OPEN_MODAL');
    },
    
    CLOSE_MODAL: (modalName) => {
        const modals = appState.getState('modals');
        appState.setState({
            modals: { ...modals, [modalName]: false }
        }, 'CLOSE_MODAL');
    },
    
    // Notification actions
    ADD_NOTIFICATION: (notification) => {
        const notifications = appState.getState('notifications') || [];
        const newNotification = {
            id: Date.now(),
            timestamp: Date.now(),
            ...notification
        };
        appState.setState({
            notifications: [...notifications, newNotification]
        }, 'ADD_NOTIFICATION');
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            actions.REMOVE_NOTIFICATION(newNotification.id);
        }, 5000);
    },
    
    REMOVE_NOTIFICATION: (notificationId) => {
        const notifications = appState.getState('notifications') || [];
        appState.setState({
            notifications: notifications.filter(n => n.id !== notificationId)
        }, 'REMOVE_NOTIFICATION');
    },
    
    // Loading actions
    SET_LOADING: (resource, isLoading) => {
        const loading = appState.getState('loading');
        appState.setState({
            loading: { ...loading, [resource]: isLoading }
        }, 'SET_LOADING');
    },
    
    // Error actions
    SET_ERROR: (resource, error) => {
        const errors = appState.getState('errors');
        appState.setState({
            errors: { ...errors, [resource]: error }
        }, 'SET_ERROR');
    },
    
    CLEAR_ERROR: (resource) => {
        const errors = appState.getState('errors');
        const { [resource]: _, ...remainingErrors } = errors;
        appState.setState({
            errors: remainingErrors
        }, 'CLEAR_ERROR');
    },
    
    // Settings actions
    UPDATE_SETTINGS: (settings) => {
        appState.setState(settings, 'UPDATE_SETTINGS');
    },
    
    CHANGE_LANGUAGE: (language) => {
        appState.setState({ language }, 'CHANGE_LANGUAGE');
        localStorage.setItem('language', language);
    },
    
    CHANGE_THEME: (theme) => {
        appState.setState({ theme }, 'CHANGE_THEME');
        localStorage.setItem('theme', theme);
        document.body.className = theme;
    }
};

// Middleware for logging
const loggingMiddleware = (prevState, updates, action) => {
    console.group(`Action: ${action}`);
    console.log('Previous State:', prevState);
    console.log('Updates:', updates);
    console.log('Next State:', { ...prevState, ...updates });
    console.groupEnd();
    return updates;
};

// Middleware for persistence
const persistenceMiddleware = (prevState, updates, action) => {
    // Persist certain state to localStorage
    const persistKeys = ['language', 'theme', 'currency'];
    const toPersist = {};
    
    Object.keys(updates).forEach(key => {
        if (persistKeys.includes(key)) {
            toPersist[key] = updates[key];
        }
    });
    
    if (Object.keys(toPersist).length > 0) {
        Object.entries(toPersist).forEach(([key, value]) => {
            localStorage.setItem(key, JSON.stringify(value));
        });
    }
    
    return updates;
};

// Apply middleware
appState.use(loggingMiddleware);
appState.use(persistenceMiddleware);

// State selectors
const selectors = {
    // User selectors
    getCurrentUser: () => appState.getState('user'),
    isAuthenticated: () => appState.getState('isAuthenticated'),
    getUserRole: () => appState.getState('userRole'),
    
    // Station selectors
    getStations: () => appState.getState('stations'),
    getSelectedStation: () => appState.getState('selectedStation'),
    getFilteredStations: () => {
        const stations = appState.getState('stations');
        const filters = appState.getState('stationFilters');
        
        return stations.filter(station => {
            if (filters.search && !station.name.toLowerCase().includes(filters.search.toLowerCase())) {
                return false;
            }
            if (filters.status !== 'all' && station.status !== filters.status) {
                return false;
            }
            if (filters.city !== 'all' && station.city !== filters.city) {
                return false;
            }
            return true;
        });
    },
    
    // Charger selectors
    getChargers: () => appState.getState('chargers'),
    getAvailableChargers: () => {
        const chargers = appState.getState('chargers');
        return chargers.filter(c => c.status === 'available');
    },
    
    // Session selectors
    getActiveSession: () => appState.getState('activeSession'),
    getSessionHistory: () => appState.getState('sessionHistory'),
    
    // UI selectors
    isModalOpen: (modalName) => {
        const modals = appState.getState('modals');
        return modals[modalName] || false;
    },
    isLoading: (resource) => {
        const loading = appState.getState('loading');
        return loading[resource] || false;
    },
    getError: (resource) => {
        const errors = appState.getState('errors');
        return errors[resource] || null;
    },
    getNotifications: () => appState.getState('notifications') || []
};

// Initialize state from localStorage
function initializeState() {
    const language = localStorage.getItem('language');
    const theme = localStorage.getItem('theme');
    const currency = localStorage.getItem('currency');
    
    if (language) appState.setState({ language: JSON.parse(language) });
    if (theme) appState.setState({ theme: JSON.parse(theme) });
    if (currency) appState.setState({ currency: JSON.parse(currency) });
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        StateManager,
        appState,
        actions,
        selectors,
        initializeState
    };
}