// Comprehensive map fix script
(function() {
    console.log('Comprehensive map fix loading...');
    
    // Wait for all dependencies to load
    function waitForDependencies(callback) {
        const checkInterval = setInterval(() => {
            if (window.echarts && 
                typeof generateDeviceLocations === 'function' && 
                typeof initMap === 'function') {
                clearInterval(checkInterval);
                callback();
            }
        }, 100);
    }
    
    // Main fix function
    function fixMapComprehensive() {
        console.log('Starting comprehensive map fix...');
        
        // Step 1: Ensure deviceLocations are generated
        if (!window.deviceLocations || window.deviceLocations.length === 0) {
            console.log('Generating device locations...');
            window.deviceLocations = generateDeviceLocations();
            console.log(`Generated ${window.deviceLocations.length} device locations`);
        }
        
        // Step 2: Ensure map container is visible
        const mapContainer = document.getElementById('australiaMap');
        if (!mapContainer) {
            console.error('Map container not found!');
            return;
        }
        
        // Make sure container and parents are visible
        mapContainer.style.display = 'block';
        mapContainer.style.minHeight = '400px';
        mapContainer.style.height = '400px';
        
        let parent = mapContainer.parentElement;
        while (parent && parent !== document.body) {
            if (window.getComputedStyle(parent).display === 'none') {
                parent.style.display = 'block';
            }
            parent = parent.parentElement;
        }
        
        // Step 3: Initialize map
        console.log('Initializing map...');
        initMap();
        
        // Step 4: Update statistics after map loads
        setTimeout(() => {
            // Find the correct updateMapStatistics function
            if (window.mapChart) {
                console.log('Map chart initialized, updating statistics...');
                
                // Update device status counts
                let counts = {
                    total: window.deviceLocations.length,
                    active: 0,
                    charging: 0,
                    discharging: 0,
                    offline: 0,
                    inactive: 0
                };
                
                window.deviceLocations.forEach(device => {
                    switch(device.status) {
                        case 'active':
                            counts.active++;
                            break;
                        case 'charging':
                            counts.charging++;
                            counts.active++;
                            break;
                        case 'discharging':
                            counts.discharging++;
                            counts.active++;
                            break;
                        case 'offline':
                            counts.offline++;
                            break;
                        default:
                            counts.inactive++;
                    }
                });
                
                // Update UI elements if they exist
                const updateElement = (id, value) => {
                    const elem = document.getElementById(id);
                    if (elem) {
                        elem.textContent = value;
                        console.log(`Updated ${id}: ${value}`);
                    }
                };
                
                updateElement('totalDevices', counts.total);
                updateElement('activeDevices', counts.active);
                updateElement('chargingCount', counts.charging);
                updateElement('dischargingCount', counts.discharging);
                updateElement('offlineCount', counts.offline);
                
                // Update progress
                const progress = counts.total > 0 ? 
                    Math.round((counts.active / counts.total) * 100) : 0;
                updateElement('progressPercent', progress + '%');
                
                // Force chart resize
                if (window.mapChart && window.mapChart.resize) {
                    window.mapChart.resize();
                    console.log('Map chart resized');
                }
                
                // Add state labels if missing
                const option = window.mapChart.getOption();
                if (option && option.series && option.series[0]) {
                    // Ensure state labels are visible
                    option.series[0].label = {
                        show: true,
                        formatter: function(params) {
                            return params.data.name;
                        },
                        position: 'inside',
                        color: '#000',
                        fontSize: 14,
                        fontWeight: 'bold'
                    };
                    window.mapChart.setOption(option);
                }
            }
        }, 500);
    }
    
    // Auto-run on load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            waitForDependencies(() => {
                setTimeout(fixMapComprehensive, 1000);
            });
        });
    } else {
        waitForDependencies(() => {
            setTimeout(fixMapComprehensive, 1000);
        });
    }
    
    // Listen for panel switches
    document.addEventListener('click', function(e) {
        if (e.target.closest('.panel-tab')) {
            const tabText = e.target.textContent || '';
            if (tabText.includes('地图') || tabText.includes('Map')) {
                console.log('Map panel activated, fixing...');
                setTimeout(fixMapComprehensive, 300);
            }
        }
    });
    
    // Export for manual use
    window.fixMapComprehensive = fixMapComprehensive;
    
    console.log('Comprehensive map fix loaded. Use window.fixMapComprehensive() to manually fix.');
})();