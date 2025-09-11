// 修复首页显示问题的脚本

// 1. 检查并修复HeaderNav
function fixHeaderNav() {
    console.log('Fixing HeaderNav...');
    const headerContainer = document.getElementById('headerContainer');
    if (headerContainer && !headerContainer.innerHTML) {
        console.log('HeaderNav container is empty, attempting to reinitialize...');
        
        if (typeof HeaderNav !== 'undefined') {
            try {
                const headerNav = new HeaderNav({
                    currentPage: 'home',
                    containerId: 'headerContainer'
                });
                console.log('HeaderNav reinitialized successfully');
            } catch (error) {
                console.error('HeaderNav reinitialization failed:', error);
            }
        } else {
            console.error('HeaderNav class not found!');
        }
    }
}

// 2. 检查并修复图表
function fixCharts() {
    console.log('Fixing charts...');
    
    // 检查市场图表
    const marketChartContainer = document.getElementById('marketChart');
    if (marketChartContainer) {
        console.log('Market chart container found, checking if chart exists...');
        if (!window.marketChart || !window.marketChart.getDom()) {
            console.log('Market chart not initialized, reinitializing...');
            if (typeof initMarketChart === 'function') {
                initMarketChart();
            }
        }
    }
    
    // 检查地图
    const mapContainer = document.getElementById('australiaMap');
    if (mapContainer) {
        console.log('Map container found, checking if map exists...');
        if (!window.mapChart || !window.mapChart.getDom()) {
            console.log('Map not initialized, reinitializing...');
            if (typeof initMap === 'function') {
                initMap();
            }
        }
    }
    
    // 检查其他图表
    const chartIds = ['powerChart', 'performanceChart'];
    chartIds.forEach(id => {
        const container = document.getElementById(id);
        if (container && (!window[id] || !window[id].getDom())) {
            console.log(`${id} not initialized, attempting to reinitialize...`);
            const initFunctionName = 'init' + id.charAt(0).toUpperCase() + id.slice(1);
            if (typeof window[initFunctionName] === 'function') {
                window[initFunctionName]();
            }
        }
    });
}

// 3. 检查容器可见性
function checkVisibility() {
    console.log('Checking element visibility...');
    
    // 检查header容器
    const header = document.getElementById('headerContainer');
    if (header) {
        const styles = window.getComputedStyle(header);
        console.log('Header visibility:', styles.display, styles.visibility);
        if (styles.display === 'none' || styles.visibility === 'hidden') {
            header.style.display = 'block';
            header.style.visibility = 'visible';
        }
    }
    
    // 检查主容器
    const container = document.querySelector('.container');
    if (container) {
        const styles = window.getComputedStyle(container);
        console.log('Container visibility:', styles.display, styles.visibility);
    }
}

// 4. 强制重新渲染所有图表
function forceRerender() {
    console.log('Force rerendering all charts...');
    
    // 获取所有echart实例
    const chartInstances = ['marketChart', 'mapChart', 'powerChart', 'performanceChart'];
    chartInstances.forEach(chartName => {
        if (window[chartName] && typeof window[chartName].resize === 'function') {
            console.log(`Resizing ${chartName}...`);
            window[chartName].resize();
        }
    });
}

// 执行修复
console.log('Starting homepage fix...');
fixHeaderNav();
setTimeout(() => {
    fixCharts();
    checkVisibility();
    setTimeout(() => {
        forceRerender();
    }, 500);
}, 1000);