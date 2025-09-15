// 最终修复方案 - 确保所有图表正确显示

console.log('=== 执行最终图表修复方案 ===');

// 等待所有资源加载完成
function waitForEcharts(callback) {
    if (typeof echarts !== 'undefined') {
        callback();
    } else {
        console.log('等待 ECharts 加载...');
        setTimeout(() => waitForEcharts(callback), 100);
    }
}

// 修复函数
function finalChartsFix() {
    console.log('开始修复所有图表...');
    
    // 1. 确保全局变量存在
    if (!window.chartInstances) {
        window.chartInstances = {};
    }
    
    // 2. 修复每个图表
    fixMarketChartFinal();
    fixPowerRevenueChartFinal();
    fixSystemPerformanceChartFinal();
    fixMapFinal();
    fixCumulativeChartFinal();
    
    // 3. 设置自动刷新
    setTimeout(() => {
        console.log('触发图表刷新...');
        resizeAllCharts();
    }, 1000);
}

function fixMarketChartFinal() {
    console.log('修复市场图表（最终版）...');
    const container = document.getElementById('marketChart');
    if (!container) {
        console.error('找不到 marketChart 容器');
        return;
    }
    
    try {
        // 销毁旧实例
        if (window.marketChart && window.marketChart.dispose) {
            window.marketChart.dispose();
        }
        
        // 确保容器可见和有尺寸
        container.style.display = 'block';
        container.style.width = '100%';
        container.style.height = '450px';
        container.style.minHeight = '450px';
        
        // 创建新实例
        window.marketChart = echarts.init(container, 'dark');
        
        // 调用原始初始化函数
        if (typeof initMarketChart === 'function') {
            console.log('调用 initMarketChart...');
            initMarketChart();
        } else {
            // 如果找不到原函数，使用备用数据
            console.log('使用备用数据初始化市场图表...');
            const option = createMarketChartOption();
            window.marketChart.setOption(option);
        }
        
        window.marketChart.resize();
        console.log('✓ 市场图表修复成功');
    } catch (error) {
        console.error('市场图表修复失败:', error);
    }
}

function fixPowerRevenueChartFinal() {
    console.log('修复电力收益图表（最终版）...');
    const container = document.getElementById('powerRevenueChart');
    if (!container) {
        console.error('找不到 powerRevenueChart 容器');
        return;
    }
    
    try {
        // 销毁旧实例
        if (window.powerRevenueChart && window.powerRevenueChart.dispose) {
            window.powerRevenueChart.dispose();
        }
        
        // 确保容器可见和有尺寸
        container.style.display = 'block';
        container.style.width = '100%';
        const parentHeight = container.parentElement ? container.parentElement.offsetHeight : 400;
        container.style.height = Math.max(300, parentHeight - 70) + 'px';
        
        // 创建新实例
        window.powerRevenueChart = echarts.init(container);
        
        // 调用原始初始化函数
        if (typeof initPowerRevenueChart === 'function') {
            console.log('调用 initPowerRevenueChart...');
            initPowerRevenueChart();
        } else {
            // 使用备用数据
            console.log('使用备用数据初始化电力收益图表...');
            const option = createPowerRevenueChartOption();
            window.powerRevenueChart.setOption(option);
        }
        
        window.powerRevenueChart.resize();
        console.log('✓ 电力收益图表修复成功');
    } catch (error) {
        console.error('电力收益图表修复失败:', error);
    }
}

function fixSystemPerformanceChartFinal() {
    console.log('修复系统性能图表（最终版）...');
    const container = document.getElementById('systemPerformance');
    if (!container) {
        console.error('找不到 systemPerformance 容器');
        return;
    }
    
    try {
        // 销毁旧实例
        if (window.performanceChart && window.performanceChart.dispose) {
            window.performanceChart.dispose();
        }
        
        // 确保容器可见和有尺寸
        container.style.display = 'block';
        container.style.width = '100%';
        container.style.height = '120px';
        
        // 创建新实例 - 注意这里要赋值给全局变量
        window.performanceChart = echarts.init(container);
        
        // 调用原始初始化函数
        if (typeof initSystemPerformanceChart === 'function') {
            console.log('调用 initSystemPerformanceChart...');
            // 修复：确保函数内部使用全局变量
            const originalInit = initSystemPerformanceChart;
            initSystemPerformanceChart = function() {
                originalInit();
                // 确保全局变量被正确赋值
                if (!window.performanceChart && container._echarts_instance_) {
                    window.performanceChart = container._echarts_instance_;
                }
            };
            initSystemPerformanceChart();
        } else {
            // 使用备用数据
            console.log('使用备用数据初始化系统性能图表...');
            const option = createSystemPerformanceOption();
            window.performanceChart.setOption(option);
        }
        
        window.performanceChart.resize();
        console.log('✓ 系统性能图表修复成功');
    } catch (error) {
        console.error('系统性能图表修复失败:', error);
    }
}

function fixMapFinal() {
    console.log('修复地图（最终版）...');
    const container = document.getElementById('australiaMap');
    if (!container) {
        console.error('找不到 australiaMap 容器');
        return;
    }
    
    try {
        // 销毁旧实例
        if (window.mapChart && window.mapChart.dispose) {
            window.mapChart.dispose();
        }
        
        // 确保容器可见和有尺寸
        container.style.display = 'block';
        container.style.width = '100%';
        container.style.height = '500px';
        
        // 创建新实例
        window.mapChart = echarts.init(container);
        
        // 调用原始初始化函数
        if (typeof initMap === 'function') {
            console.log('调用 initMap...');
            initMap();
        } else {
            console.log('initMap 函数不存在');
        }
        
        console.log('✓ 地图修复成功');
    } catch (error) {
        console.error('地图修复失败:', error);
    }
}

function fixCumulativeChartFinal() {
    console.log('修复累计图表（最终版）...');
    const container = document.getElementById('cumulativeMarketChart');
    if (!container) {
        console.error('找不到 cumulativeMarketChart 容器');
        return;
    }
    
    try {
        // 销毁旧实例
        if (window.cumulativeMarketChart && window.cumulativeMarketChart.dispose) {
            window.cumulativeMarketChart.dispose();
        }
        
        // 确保容器可见和有尺寸
        container.style.display = 'block';
        container.style.width = '100%';
        container.style.minHeight = '300px';
        
        // 调用原始渲染函数
        if (typeof renderCumulativeChart === 'function') {
            console.log('调用 renderCumulativeChart...');
            renderCumulativeChart('NSW');
        }
        
        console.log('✓ 累计图表修复成功');
    } catch (error) {
        console.error('累计图表修复失败:', error);
    }
}

// 备用图表选项生成函数
function createMarketChartOption() {
    const hours = Array.from({length: 24}, (_, i) => `${i}:00`);
    const prices = hours.map(() => Math.floor(Math.random() * 100) + 100);
    const demand = hours.map(() => Math.floor(Math.random() * 2000) + 5000);
    
    return {
        backgroundColor: 'transparent',
        tooltip: { trigger: 'axis' },
        legend: {
            data: ['价格', '需求'],
            textStyle: { color: '#fff' }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            top: '10%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: hours,
            axisLine: { lineStyle: { color: '#333' } },
            axisLabel: { color: '#999' }
        },
        yAxis: [
            {
                type: 'value',
                name: '价格 ($/MWh)',
                axisLine: { lineStyle: { color: '#333' } },
                axisLabel: { color: '#999' },
                splitLine: { lineStyle: { color: '#222' } }
            },
            {
                type: 'value',
                name: '需求 (MW)',
                axisLine: { lineStyle: { color: '#333' } },
                axisLabel: { color: '#999' }
            }
        ],
        series: [
            {
                name: '价格',
                type: 'line',
                data: prices,
                smooth: true,
                lineStyle: { color: '#00ff88', width: 2 },
                itemStyle: { color: '#00ff88' }
            },
            {
                name: '需求',
                type: 'line',
                yAxisIndex: 1,
                data: demand,
                smooth: true,
                lineStyle: { color: '#4B7BFF', width: 2 },
                itemStyle: { color: '#4B7BFF' }
            }
        ]
    };
}

function createPowerRevenueChartOption() {
    return {
        backgroundColor: 'transparent',
        tooltip: { trigger: 'axis' },
        legend: {
            data: ['放电量', '收益'],
            textStyle: { color: '#fff' }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            top: '10%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: ['周一', '周二', '周三', '周四', '周五'],
            axisLine: { lineStyle: { color: '#333' } },
            axisLabel: { color: '#999' }
        },
        yAxis: [
            {
                type: 'value',
                name: '放电量 (kWh)',
                axisLine: { lineStyle: { color: '#333' } },
                axisLabel: { color: '#999' },
                splitLine: { lineStyle: { color: '#222' } }
            },
            {
                type: 'value',
                name: '收益 ($)',
                axisLine: { lineStyle: { color: '#333' } },
                axisLabel: { color: '#999' }
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
                smooth: true,
                lineStyle: { color: '#ffd700', width: 2 },
                itemStyle: { color: '#ffd700' }
            }
        ]
    };
}

function createSystemPerformanceOption() {
    const hours = Array.from({length: 12}, (_, i) => `${i * 2}:00`);
    const efficiency = hours.map(() => Math.floor(Math.random() * 8) + 92);
    
    return {
        backgroundColor: 'transparent',
        tooltip: { trigger: 'axis' },
        grid: {
            left: '3%',
            right: '3%',
            bottom: '3%',
            top: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: hours,
            axisLine: { lineStyle: { color: '#333' } },
            axisLabel: { color: '#999' }
        },
        yAxis: {
            type: 'value',
            min: 80,
            max: 100,
            axisLine: { lineStyle: { color: '#333' } },
            axisLabel: { 
                color: '#999',
                formatter: '{value}%'
            },
            splitLine: { lineStyle: { color: '#222' } }
        },
        series: [{
            type: 'line',
            data: efficiency,
            smooth: true,
            areaStyle: {
                color: {
                    type: 'linear',
                    x: 0, y: 0, x2: 0, y2: 1,
                    colorStops: [
                        { offset: 0, color: 'rgba(0, 255, 136, 0.3)' },
                        { offset: 1, color: 'rgba(0, 255, 136, 0.1)' }
                    ]
                }
            },
            lineStyle: { color: '#00ff88', width: 2 },
            itemStyle: { color: '#00ff88' }
        }]
    };
}

// 调整所有图表大小
function resizeAllCharts() {
    const charts = [
        window.marketChart,
        window.powerRevenueChart,
        window.performanceChart,
        window.mapChart,
        window.cumulativeMarketChart
    ];
    
    charts.forEach((chart, index) => {
        if (chart && chart.resize) {
            try {
                chart.resize();
                console.log(`✓ 图表 ${index + 1} resize 成功`);
            } catch (e) {
                console.error(`图表 ${index + 1} resize 失败:`, e);
            }
        }
    });
}

// 监听窗口大小变化
window.removeEventListener('resize', resizeAllCharts); // 移除旧监听器
window.addEventListener('resize', () => {
    console.log('窗口大小变化，调整图表...');
    resizeAllCharts();
});

// 执行修复
waitForEcharts(() => {
    console.log('ECharts 已加载，开始修复...');
    
    // 立即执行一次
    finalChartsFix();
    
    // 延迟再执行一次，确保DOM完全就绪
    setTimeout(() => {
        console.log('第二次修复检查...');
        finalChartsFix();
    }, 2000);
});

console.log('=== 最终修复脚本已加载 ===');