// 确保DOM完全加载后修复图表

console.log('=== DOM就绪后图表修复脚本 ===');

// 使用 DOMContentLoaded 确保DOM加载完成
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeCharts);
} else {
    // DOM已经加载完成
    setTimeout(initializeCharts, 1000);
}

function initializeCharts() {
    console.log('DOM已就绪，开始初始化图表...');
    
    // 检查图表容器是否存在
    const containers = {
        marketChart: document.getElementById('marketChart'),
        powerRevenueChart: document.getElementById('powerRevenueChart'),
        systemPerformance: document.getElementById('systemPerformance'),
        australiaMap: document.getElementById('australiaMap'),
        cumulativeMarketChart: document.getElementById('cumulativeMarketChart')
    };
    
    console.log('容器检查:', {
        marketChart: !!containers.marketChart,
        powerRevenueChart: !!containers.powerRevenueChart,
        systemPerformance: !!containers.systemPerformance,
        australiaMap: !!containers.australiaMap,
        cumulativeMarketChart: !!containers.cumulativeMarketChart
    });
    
    // 如果容器不存在，可能需要等待更长时间
    let allContainersExist = Object.values(containers).every(c => c !== null);
    
    if (!allContainersExist) {
        console.warn('部分容器还未就绪，等待2秒后重试...');
        setTimeout(initializeCharts, 2000);
        return;
    }
    
    // 所有容器都存在，开始初始化
    console.log('所有容器已就绪，开始初始化图表...');
    
    // 1. 初始化市场图表
    if (containers.marketChart && typeof initMarketChart === 'function') {
        try {
            console.log('调用 initMarketChart...');
            initMarketChart();
        } catch (e) {
            console.error('initMarketChart 失败:', e);
            // 尝试手动初始化
            try {
                window.marketChart = echarts.init(containers.marketChart, 'dark');
                createBasicMarketChart();
            } catch (e2) {
                console.error('手动初始化市场图表失败:', e2);
            }
        }
    }
    
    // 2. 初始化电力收益图表
    if (containers.powerRevenueChart && typeof initPowerRevenueChart === 'function') {
        try {
            console.log('调用 initPowerRevenueChart...');
            initPowerRevenueChart();
        } catch (e) {
            console.error('initPowerRevenueChart 失败:', e);
            // 尝试手动初始化
            try {
                window.powerRevenueChart = echarts.init(containers.powerRevenueChart);
                createBasicPowerRevenueChart();
            } catch (e2) {
                console.error('手动初始化电力收益图表失败:', e2);
            }
        }
    }
    
    // 3. 初始化系统性能图表
    if (containers.systemPerformance && typeof initSystemPerformanceChart === 'function') {
        try {
            console.log('调用 initSystemPerformanceChart...');
            initSystemPerformanceChart();
        } catch (e) {
            console.error('initSystemPerformanceChart 失败:', e);
            // 尝试手动初始化
            try {
                window.performanceChart = echarts.init(containers.systemPerformance);
                createBasicPerformanceChart();
            } catch (e2) {
                console.error('手动初始化系统性能图表失败:', e2);
            }
        }
    }
    
    // 4. 初始化地图
    if (containers.australiaMap && typeof initMap === 'function') {
        try {
            console.log('调用 initMap...');
            initMap();
        } catch (e) {
            console.error('initMap 失败:', e);
            // 尝试手动初始化
            try {
                window.mapChart = echarts.init(containers.australiaMap);
                createBasicMap();
            } catch (e2) {
                console.error('手动初始化地图失败:', e2);
            }
        }
    }
    
    // 5. 初始化累计图表
    if (containers.cumulativeMarketChart && typeof renderCumulativeChart === 'function') {
        try {
            console.log('调用 renderCumulativeChart...');
            renderCumulativeChart('NSW');
        } catch (e) {
            console.error('renderCumulativeChart 失败:', e);
        }
    }
    
    // 延迟调整所有图表大小
    setTimeout(() => {
        console.log('调整所有图表大小...');
        ['marketChart', 'powerRevenueChart', 'performanceChart', 'mapChart', 'cumulativeMarketChart'].forEach(chartName => {
            if (window[chartName] && window[chartName].resize) {
                try {
                    window[chartName].resize();
                    console.log(`✓ ${chartName} resize成功`);
                } catch (e) {
                    console.error(`${chartName} resize失败:`, e);
                }
            }
        });
    }, 500);
}

// 基础图表创建函数
function createBasicMarketChart() {
    const option = {
        title: { text: '市场价格与需求', textStyle: { color: '#fff' } },
        tooltip: { trigger: 'axis' },
        legend: { data: ['价格', '需求'], textStyle: { color: '#fff' } },
        grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
        xAxis: {
            type: 'category',
            data: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
            axisLine: { lineStyle: { color: '#666' } }
        },
        yAxis: [
            {
                type: 'value',
                name: '价格',
                axisLine: { lineStyle: { color: '#666' } }
            },
            {
                type: 'value',
                name: '需求',
                axisLine: { lineStyle: { color: '#666' } }
            }
        ],
        series: [
            {
                name: '价格',
                type: 'line',
                data: [150, 180, 200, 170, 190, 210],
                lineStyle: { color: '#00ff88' }
            },
            {
                name: '需求',
                type: 'line',
                yAxisIndex: 1,
                data: [5000, 5500, 6000, 5800, 6200, 6500],
                lineStyle: { color: '#4B7BFF' }
            }
        ]
    };
    window.marketChart.setOption(option);
}

function createBasicPowerRevenueChart() {
    const option = {
        title: { text: '放电量与收益', textStyle: { color: '#fff' } },
        tooltip: { trigger: 'axis' },
        legend: { data: ['放电量', '收益'], textStyle: { color: '#fff' } },
        grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
        xAxis: {
            type: 'category',
            data: ['周一', '周二', '周三', '周四', '周五'],
            axisLine: { lineStyle: { color: '#666' } }
        },
        yAxis: [
            {
                type: 'value',
                name: '放电量',
                axisLine: { lineStyle: { color: '#666' } }
            },
            {
                type: 'value',
                name: '收益',
                axisLine: { lineStyle: { color: '#666' } }
            }
        ],
        series: [
            {
                name: '放电量',
                type: 'bar',
                data: [320, 332, 301, 334, 390],
                itemStyle: { color: '#00ff88' }
            },
            {
                name: '收益',
                type: 'line',
                yAxisIndex: 1,
                data: [150, 180, 240, 120, 165],
                lineStyle: { color: '#ffd700' }
            }
        ]
    };
    window.powerRevenueChart.setOption(option);
}

function createBasicPerformanceChart() {
    const option = {
        title: { text: '系统性能', textStyle: { color: '#fff', fontSize: 14 } },
        tooltip: { trigger: 'axis' },
        grid: { left: '3%', right: '3%', bottom: '3%', top: '15%', containLabel: true },
        xAxis: {
            type: 'category',
            data: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
            axisLine: { lineStyle: { color: '#666' } }
        },
        yAxis: {
            type: 'value',
            min: 80,
            max: 100,
            axisLine: { lineStyle: { color: '#666' } }
        },
        series: [{
            type: 'line',
            data: [92, 94, 95, 93, 96, 94],
            smooth: true,
            areaStyle: { color: 'rgba(0, 255, 136, 0.3)' },
            lineStyle: { color: '#00ff88' }
        }]
    };
    window.performanceChart.setOption(option);
}

function createBasicMap() {
    const option = {
        title: { text: '设备分布地图', textStyle: { color: '#fff' } },
        tooltip: { trigger: 'item' },
        series: [{
            type: 'scatter',
            coordinateSystem: 'geo',
            data: [
                { name: 'NSW', value: [151.2093, -33.8688, 100] },
                { name: 'VIC', value: [144.9631, -37.8136, 80] },
                { name: 'QLD', value: [153.0251, -27.4698, 90] },
                { name: 'SA', value: [138.6007, -34.9285, 70] },
                { name: 'TAS', value: [147.3272, -42.8821, 60] }
            ],
            symbolSize: 20,
            itemStyle: { color: '#00ff88' }
        }],
        geo: {
            map: 'australia',
            roam: true,
            itemStyle: {
                areaColor: '#323c48',
                borderColor: '#404a59'
            }
        }
    };
    window.mapChart.setOption(option);
}

console.log('=== DOM就绪图表修复脚本已加载 ===');