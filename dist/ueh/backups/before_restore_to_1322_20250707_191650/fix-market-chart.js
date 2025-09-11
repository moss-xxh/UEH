// Fix for market chart showing map data issue
// This script ensures complete separation between market and map charts

// Global chart instances - properly separated
let marketChart = null;
let mapChart = null;

// Clear all chart data and dispose properly
function clearAllCharts() {
    // Dispose market chart
    if (marketChart && typeof marketChart.dispose === 'function') {
        try {
            marketChart.dispose();
            marketChart = null;
        } catch (e) {
            console.log('Market chart disposal completed');
        }
    }
    
    // Dispose map chart
    if (mapChart && typeof mapChart.dispose === 'function') {
        try {
            mapChart.dispose();
            mapChart = null;
        } catch (e) {
            console.log('Map chart disposal completed');
        }
    }
    
    // Clear any cached data
    if (window.dataCache && typeof window.dataCache.clear === 'function') {
        window.dataCache.clear();
    }
}

// Initialize clean market chart
function initCleanMarketChart() {
    const container = document.getElementById('marketChart');
    if (!container) {
        console.error('Market chart container not found!');
        return;
    }
    
    // Ensure container is visible and has dimensions
    container.style.display = 'block';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.minHeight = '280px';
    
    // Clear any existing content
    container.innerHTML = '';
    
    // Dispose any existing instance
    if (marketChart) {
        marketChart.dispose();
        marketChart = null;
    }
    
    // Wait for container to be ready
    setTimeout(() => {
        // Create new chart instance
        marketChart = echarts.init(container, null, {
            renderer: 'canvas',
            useDirtyRect: false
        });
        
        // Market data only - no map data
        const hours = [];
        const prices = [];
        const demands = [];
        const forecastPrices = [];
        const forecastDemands = [];
        const currentHour = new Date().getHours();
        
        // Generate 24 hours
        for (let i = 0; i < 24; i++) {
            hours.push(`${i}:00`);
        }
        
        // Generate market data
        for (let i = 0; i < 24; i++) {
            if (i <= currentHour) {
                // Historical data
                prices.push(100 + Math.random() * 200);
                demands.push(7000 + Math.random() * 2000);
                forecastPrices.push(null);
                forecastDemands.push(null);
            } else if (i === currentHour + 1) {
                // Transition point
                const lastPrice = prices[prices.length - 1];
                const lastDemand = demands[demands.length - 1];
                prices.push(null);
                demands.push(null);
                forecastPrices.push(lastPrice);
                forecastDemands.push(lastDemand);
            } else {
                // Forecast data
                prices.push(null);
                demands.push(null);
                const prevPrice = forecastPrices[forecastPrices.length - 1] || 150;
                const prevDemand = forecastDemands[forecastDemands.length - 1] || 8000;
                forecastPrices.push(prevPrice + (Math.random() - 0.5) * 50);
                forecastDemands.push(prevDemand + (Math.random() - 0.5) * 500);
            }
        }
        
        // Pure market chart configuration
        const option = {
            backgroundColor: 'transparent',
            title: {
                show: false
            },
            tooltip: {
                trigger: 'axis',
                backgroundColor: 'rgba(0, 0, 0, 0.9)',
                borderColor: '#00ff88',
                textStyle: { color: '#fff' }
            },
            legend: {
                data: ['Historical Price', 'Demand', 'Predicted Price', 'Predicted Demand'],
                textStyle: { color: 'rgba(255, 255, 255, 0.7)' },
                top: 10
            },
            grid: {
                left: 60,
                right: 60,
                bottom: 50,
                top: 60,
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: hours,
                axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.3)' } },
                axisLabel: { 
                    color: 'rgba(255, 255, 255, 0.7)',
                    interval: 2
                }
            },
            yAxis: [
                {
                    type: 'value',
                    name: 'Price ($/MWh)',
                    position: 'left',
                    axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.3)' } },
                    axisLabel: { 
                        color: 'rgba(255, 255, 255, 0.7)',
                        formatter: '${value}'
                    },
                    splitLine: { 
                        lineStyle: { 
                            color: 'rgba(255, 255, 255, 0.1)',
                            type: 'dashed'
                        } 
                    }
                },
                {
                    type: 'value',
                    name: 'Demand (MW)',
                    position: 'right',
                    axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.3)' } },
                    axisLabel: { 
                        color: 'rgba(255, 255, 255, 0.7)',
                        formatter: '{value}'
                    },
                    splitLine: { show: false }
                }
            ],
            series: [
                {
                    name: 'Historical Price',
                    type: 'line',
                    data: prices,
                    smooth: true,
                    lineStyle: { color: '#00ff88', width: 3 },
                    itemStyle: { color: '#00ff88' },
                    areaStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: 'rgba(0, 255, 136, 0.3)' },
                            { offset: 1, color: 'rgba(0, 255, 136, 0.05)' }
                        ])
                    }
                },
                {
                    name: 'Demand',
                    type: 'line',
                    yAxisIndex: 1,
                    data: demands,
                    smooth: true,
                    lineStyle: { color: '#ffd700', width: 2 },
                    itemStyle: { color: '#ffd700' }
                },
                {
                    name: 'Predicted Price',
                    type: 'line',
                    data: forecastPrices,
                    smooth: true,
                    lineStyle: { 
                        color: '#00ff88', 
                        width: 2,
                        type: 'dashed'
                    },
                    itemStyle: { color: '#00ff88' }
                },
                {
                    name: 'Predicted Demand',
                    type: 'line',
                    yAxisIndex: 1,
                    data: forecastDemands,
                    smooth: true,
                    lineStyle: {
                        color: '#ffd700',
                        width: 2,
                        type: 'dashed'
                    },
                    itemStyle: { color: '#ffd700' }
                }
            ],
            // Disable all map-related features
            geo: undefined,
            visualMap: undefined,
            roam: false
        };
        
        // Set the option
        marketChart.setOption(option, true); // true = not merge, complete replace
        
        // Force resize
        marketChart.resize();
        
        console.log('Clean market chart initialized successfully');
    }, 100);
}

// Fixed switchPanel function
window.switchPanelFixed = function(panelType, tabElement) {
    console.log('Switching to panel:', panelType);
    
    // Clear all charts first
    clearAllCharts();
    
    // Get panel elements
    const marketPanel = document.getElementById('marketPanel');
    const mapPanel = document.getElementById('mapPanel');
    
    // Hide all panels
    if (marketPanel) {
        marketPanel.classList.remove('active');
        marketPanel.style.display = 'none';
    }
    if (mapPanel) {
        mapPanel.classList.remove('active');
        mapPanel.style.display = 'none';
    }
    
    // Update tabs
    document.querySelectorAll('.panel-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Show requested panel
    if (panelType === 'market') {
        if (marketPanel) {
            marketPanel.classList.add('active');
            marketPanel.style.display = 'block';
            
            // Activate market tab
            const marketTab = tabElement || document.querySelector('[onclick*="market"]');
            if (marketTab) {
                marketTab.classList.add('active');
            }
            
            // Initialize clean market chart after panel is visible
            setTimeout(() => {
                initCleanMarketChart();
            }, 100);
        }
    } else if (panelType === 'map') {
        if (mapPanel) {
            mapPanel.classList.add('active');
            mapPanel.style.display = 'block';
            
            // Activate map tab
            const mapTab = tabElement || document.querySelector('[onclick*="map"]');
            if (mapTab) {
                mapTab.classList.add('active');
            }
            
            // Initialize map if needed
            setTimeout(() => {
                if (typeof initMap === 'function') {
                    initMap();
                }
            }, 100);
        }
    }
};

// Apply fix on load
document.addEventListener('DOMContentLoaded', function() {
    // Replace the original switchPanel with our fixed version
    window.switchPanel = window.switchPanelFixed;
    
    // Fix the existing initMarketChart function
    window.initMarketChart = initCleanMarketChart;
    
    // Clear cache
    if (window.dataCache) {
        window.dataCache.clear();
    }
    
    // Reinitialize the current view
    setTimeout(() => {
        const activePanel = document.querySelector('.panel-content.active');
        if (activePanel && activePanel.id === 'marketPanel') {
            initCleanMarketChart();
        }
    }, 500);
});

// Utility function to force fix
window.fixMarketChart = function() {
    console.log('Applying market chart fix...');
    
    // Clear everything
    clearAllCharts();
    
    // Clear cache
    if (window.dataCache) {
        window.dataCache.clear();
    }
    
    // Switch to market view with clean chart
    window.switchPanelFixed('market');
    
    console.log('Market chart fix applied!');
};

console.log('Market chart fix loaded. Use window.fixMarketChart() to apply the fix.');

// Additional fix for profit page charts
window.fixProfitCharts = function() {
    console.log('Fixing profit page charts...');
    
    // Get all chart containers on profit page
    const chartIds = ['userManagementChart', 'revenueDistributionChart', 'powerRevenueChart', 'profitRankingChart'];
    
    chartIds.forEach(id => {
        const container = document.getElementById(id);
        if (container) {
            // Ensure container has proper dimensions
            if (container.offsetHeight < 100) {
                container.style.minHeight = '300px';
                container.style.height = '300px';
            }
            
            // Check if chart exists
            const instance = echarts.getInstanceByDom(container);
            if (instance) {
                instance.resize();
                console.log(`Resized: ${id}`);
            } else {
                console.log(`No chart instance for: ${id} - may need reinitialization`);
            }
        }
    });
    
    // Trigger chart initialization if needed
    if (typeof initAllCharts === 'function') {
        console.log('Reinitializing all profit charts...');
        initAllCharts();
    }
};

// Additional fix for map visibility
window.fixMapDisplay = function() {
    console.log('Fixing map display...');
    
    const mapContainer = document.getElementById('australiaMap');
    if (mapContainer) {
        // Ensure container is visible and has dimensions
        mapContainer.style.display = 'block';
        mapContainer.style.minHeight = '350px';
        
        // Check parent visibility
        let parent = mapContainer.parentElement;
        while (parent && parent !== document.body) {
            const style = window.getComputedStyle(parent);
            if (style.display === 'none' || style.visibility === 'hidden') {
                console.log('Found hidden parent:', parent.className || parent.id);
                parent.style.display = 'block';
                parent.style.visibility = 'visible';
            }
            parent = parent.parentElement;
        }
        
        // Fix deviceLocations if empty
        if (typeof deviceLocations !== 'undefined' && (!deviceLocations || deviceLocations.length === 0)) {
            console.log('deviceLocations is empty, generating...');
            if (typeof generateDeviceLocations === 'function') {
                window.deviceLocations = generateDeviceLocations();
                console.log('Generated', window.deviceLocations.length, 'devices');
            }
        }
        
        // Reinitialize map
        if (typeof initMap === 'function') {
            setTimeout(() => {
                initMap();
                console.log('Map reinitialized');
                
                // Force update map statistics
                if (typeof updateMapStatistics === 'function') {
                    updateMapStatistics();
                }
            }, 300);
        }
    }
};

// Enhanced map initialization fix
window.enhancedMapInit = function() {
    console.log('Enhanced map initialization...');
    
    // First ensure deviceLocations exist
    if (typeof deviceLocations === 'undefined' || !deviceLocations || deviceLocations.length === 0) {
        console.log('Generating device locations...');
        if (typeof generateDeviceLocations === 'function') {
            window.deviceLocations = generateDeviceLocations();
            console.log('Generated', window.deviceLocations.length, 'device locations');
        } else {
            console.error('generateDeviceLocations function not found!');
            return;
        }
    }
    
    // Then initialize the map
    if (typeof initMap === 'function') {
        initMap();
        
        // Update statistics
        setTimeout(() => {
            if (typeof updateMapStatistics === 'function') {
                updateMapStatistics();
                console.log('Map statistics updated');
            }
            
            // Force resize to ensure proper rendering
            if (window.mapChart && typeof window.mapChart.resize === 'function') {
                window.mapChart.resize();
            }
        }, 500);
    } else {
        console.error('initMap function not found!');
    }
};

// Auto-fix on page detection
setTimeout(() => {
    // Check if we're on profit page
    if (window.location.pathname.includes('profit-new.html')) {
        fixProfitCharts();
    }
    
    // Check for map container
    if (document.getElementById('australiaMap')) {
        // Use enhanced initialization for better results
        enhancedMapInit();
    }
}, 2000);

// Add panel switch listener for map
document.addEventListener('click', function(e) {
    const target = e.target;
    // Check if clicking on map panel tab
    if (target.closest('.panel-tab') && target.textContent.includes('地图')) {
        console.log('Map tab clicked, reinitializing...');
        setTimeout(() => {
            enhancedMapInit();
        }, 300);
    }
});

// Global function to manually fix map
window.fixMap = function() {
    console.log('Manual map fix initiated...');
    enhancedMapInit();
};

console.log('Map fix functions loaded. Use window.fixMap() to manually fix the map.');