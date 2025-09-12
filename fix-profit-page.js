// 修复行情页面显示问题的脚本

// 检查并修复图表
function fixProfitCharts() {
    console.log('Fixing profit page charts...');
    
    const chartIds = ['userManagementChart', 'revenueDistributionChart', 'powerRevenueChart', 'profitRankingChart'];
    
    chartIds.forEach(id => {
        const container = document.getElementById(id);
        if (container) {
            console.log(`Checking ${id}...`);
            const rect = container.getBoundingClientRect();
            
            // 确保容器有合适的尺寸
            if (rect.width === 0 || rect.height === 0) {
                console.warn(`${id} has zero size, fixing...`);
                container.style.width = '100%';
                container.style.height = '300px';
                container.style.minHeight = '300px';
            }
            
            // 检查是否需要重新初始化图表
            const chartInstance = window[id];
            if (!chartInstance || !chartInstance.getDom || !chartInstance.getDom()) {
                console.log(`${id} not properly initialized, reinitializing...`);
                
                // 根据图表ID调用相应的初始化函数
                const initFunctionMap = {
                    'userManagementChart': 'initUserManagementChart',
                    'revenueDistributionChart': 'initRevenueDistributionChart',
                    'powerRevenueChart': 'initPowerRevenueChart',
                    'profitRankingChart': 'initProfitRankingChart'
                };
                
                const initFunction = window[initFunctionMap[id]];
                if (typeof initFunction === 'function') {
                    try {
                        initFunction();
                        console.log(`${id} reinitialized successfully`);
                    } catch (error) {
                        console.error(`Failed to reinitialize ${id}:`, error);
                    }
                }
            } else {
                // 图表存在，尝试resize
                try {
                    chartInstance.resize();
                    console.log(`${id} resized`);
                } catch (error) {
                    console.error(`Failed to resize ${id}:`, error);
                }
            }
        } else {
            console.error(`Container ${id} not found!`);
        }
    });
}

// 确保ChartManager存在
function ensureChartManager() {
    if (!window.chartManager && typeof ChartManager !== 'undefined') {
        console.log('Creating new ChartManager instance...');
        window.chartManager = new ChartManager();
    }
}

// 执行修复
setTimeout(() => {
    console.log('Starting profit page fix...');
    ensureChartManager();
    fixProfitCharts();
    
    // 再次尝试resize所有图表
    setTimeout(() => {
        if (window.chartManager && typeof window.chartManager.resizeAll === 'function') {
            console.log('Resizing all charts via ChartManager...');
            window.chartManager.resizeAll();
        }
    }, 1000);
}, 1500);