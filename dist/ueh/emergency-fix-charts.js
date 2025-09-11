// 紧急修复首页图表显示问题

console.log('=== 开始紧急修复图表 ===');

// 等待页面完全加载
window.addEventListener('load', function() {
    console.log('页面加载完成，开始修复图表...');
    
    // 延迟执行以确保所有脚本都已加载
    setTimeout(function() {
        // 1. 修复市场图表
        fixMarketChart();
        
        // 2. 修复电力收益图表
        fixPowerRevenueChart();
        
        // 3. 修复系统性能图表
        fixSystemPerformanceChart();
        
        // 4. 修复累计市场图表
        fixCumulativeChart();
        
        // 5. 修复地图
        fixMap();
    }, 500);
});

function fixMarketChart() {
    console.log('修复市场图表...');
    const container = document.getElementById('marketChart');
    if (!container) {
        console.error('找不到市场图表容器！');
        return;
    }
    
    // 确保容器有合适的尺寸
    container.style.width = '100%';
    container.style.height = '450px';
    container.style.minHeight = '450px';
    
    try {
        // 如果已存在实例，先销毁
        if (window.marketChart && window.marketChart.dispose) {
            window.marketChart.dispose();
        }
        
        // 重新初始化
        window.marketChart = echarts.init(container);
        
        // 设置基本选项
        const option = {
            backgroundColor: 'transparent',
            tooltip: {
                trigger: 'axis',
                backgroundColor: 'rgba(0,0,0,0.9)',
                borderColor: 'rgba(255,255,255,0.1)',
                textStyle: { color: '#fff' }
            },
            legend: {
                data: ['价格', '需求'],
                textStyle: { color: 'rgba(255, 255, 255, 0.7)' },
                top: 10
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                top: '15%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'],
                axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.2)' } },
                axisLabel: { color: 'rgba(255, 255, 255, 0.6)' }
            },
            yAxis: [
                {
                    type: 'value',
                    name: '价格 ($)',
                    axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.2)' } },
                    axisLabel: { color: 'rgba(255, 255, 255, 0.6)' },
                    splitLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.1)' } }
                },
                {
                    type: 'value',
                    name: '需求 (MW)',
                    axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.2)' } },
                    axisLabel: { color: 'rgba(255, 255, 255, 0.6)' },
                    splitLine: { show: false }
                }
            ],
            series: [
                {
                    name: '价格',
                    type: 'line',
                    data: [120, 132, 101, 134, 190, 230, 210],
                    smooth: true,
                    lineStyle: { color: '#00ff88', width: 3 },
                    itemStyle: { color: '#00ff88' }
                },
                {
                    name: '需求',
                    type: 'line',
                    yAxisIndex: 1,
                    data: [820, 932, 901, 934, 1290, 1330, 1320],
                    smooth: true,
                    lineStyle: { color: '#4B7BFF', width: 3 },
                    itemStyle: { color: '#4B7BFF' }
                }
            ]
        };
        
        window.marketChart.setOption(option);
        window.marketChart.resize();
        console.log('市场图表修复成功！');
    } catch (error) {
        console.error('市场图表修复失败：', error);
    }
}

function fixPowerRevenueChart() {
    console.log('修复电力收益图表...');
    const container = document.getElementById('powerRevenueChart');
    if (!container) {
        console.error('找不到电力收益图表容器！');
        return;
    }
    
    // 确保容器有合适的尺寸
    const parentHeight = container.parentElement.offsetHeight;
    container.style.height = Math.max(300, parentHeight - 70) + 'px';
    
    try {
        // 如果已存在实例，先销毁
        if (window.powerRevenueChart && window.powerRevenueChart.dispose) {
            window.powerRevenueChart.dispose();
        }
        
        // 重新初始化
        window.powerRevenueChart = echarts.init(container);
        
        // 设置基本选项
        const option = {
            backgroundColor: 'transparent',
            tooltip: {
                trigger: 'axis',
                backgroundColor: 'rgba(0,0,0,0.9)',
                borderColor: 'rgba(255,255,255,0.1)',
                textStyle: { color: '#fff' }
            },
            legend: {
                data: ['放电量', '收益'],
                textStyle: { color: 'rgba(255, 255, 255, 0.7)' }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                top: '15%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: ['周一', '周二', '周三', '周四', '周五'],
                axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.2)' } },
                axisLabel: { color: 'rgba(255, 255, 255, 0.6)' }
            },
            yAxis: [
                {
                    type: 'value',
                    name: '放电量 (kWh)',
                    axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.2)' } },
                    axisLabel: { color: 'rgba(255, 255, 255, 0.6)' },
                    splitLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.1)' } }
                },
                {
                    type: 'value',
                    name: '收益 ($)',
                    axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.2)' } },
                    axisLabel: { color: 'rgba(255, 255, 255, 0.6)' },
                    splitLine: { show: false }
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
                    lineStyle: { color: '#ffd700', width: 3 },
                    itemStyle: { color: '#ffd700' }
                }
            ]
        };
        
        window.powerRevenueChart.setOption(option);
        window.powerRevenueChart.resize();
        console.log('电力收益图表修复成功！');
    } catch (error) {
        console.error('电力收益图表修复失败：', error);
    }
}

function fixSystemPerformanceChart() {
    console.log('修复系统性能图表...');
    const container = document.getElementById('systemPerformance');
    if (!container) {
        console.error('找不到系统性能图表容器！');
        return;
    }
    
    try {
        // 如果已存在实例，先销毁
        if (window.performanceChart && window.performanceChart.dispose) {
            window.performanceChart.dispose();
        }
        
        // 重新初始化
        window.performanceChart = echarts.init(container);
        
        // 设置基本选项
        const option = {
            backgroundColor: 'transparent',
            tooltip: {
                trigger: 'axis',
                backgroundColor: 'rgba(0,0,0,0.9)',
                borderColor: 'rgba(255,255,255,0.1)',
                textStyle: { color: '#fff' }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                top: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
                axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.2)' } },
                axisLabel: { color: 'rgba(255, 255, 255, 0.6)' }
            },
            yAxis: {
                type: 'value',
                max: 100,
                axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.2)' } },
                axisLabel: { 
                    color: 'rgba(255, 255, 255, 0.6)',
                    formatter: '{value}%'
                },
                splitLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.1)' } }
            },
            series: [{
                type: 'line',
                data: [85, 88, 92, 89, 91, 87],
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
        
        window.performanceChart.setOption(option);
        window.performanceChart.resize();
        console.log('系统性能图表修复成功！');
    } catch (error) {
        console.error('系统性能图表修复失败：', error);
    }
}

function fixCumulativeChart() {
    console.log('修复累计市场图表...');
    const container = document.getElementById('cumulativeMarketChart');
    if (!container) {
        console.error('找不到累计市场图表容器！');
        return;
    }
    
    try {
        // 如果已存在实例，先销毁
        if (window.cumulativeMarketChart && window.cumulativeMarketChart.dispose) {
            window.cumulativeMarketChart.dispose();
        }
        
        // 重新初始化
        window.cumulativeMarketChart = echarts.init(container);
        
        // 调用原有的渲染函数
        if (typeof renderCumulativeChart === 'function') {
            renderCumulativeChart('NSW');
        } else {
            console.error('找不到 renderCumulativeChart 函数');
        }
        
        console.log('累计市场图表修复成功！');
    } catch (error) {
        console.error('累计市场图表修复失败：', error);
    }
}

function fixMap() {
    console.log('修复地图...');
    const container = document.getElementById('australiaMap');
    if (!container) {
        console.error('找不到地图容器！');
        return;
    }
    
    // 确保容器有合适的尺寸
    container.style.height = '500px';
    
    try {
        // 如果已存在实例，先销毁
        if (window.mapChart && window.mapChart.dispose) {
            window.mapChart.dispose();
        }
        
        // 调用原有的初始化函数
        if (typeof initMap === 'function') {
            initMap();
            console.log('地图修复成功！');
        } else {
            console.error('找不到 initMap 函数');
        }
    } catch (error) {
        console.error('地图修复失败：', error);
    }
}

// 监听窗口大小变化
window.addEventListener('resize', function() {
    const charts = [window.marketChart, window.powerRevenueChart, window.performanceChart, window.cumulativeMarketChart, window.mapChart];
    charts.forEach(chart => {
        if (chart && chart.resize) {
            chart.resize();
        }
    });
});

console.log('=== 图表修复脚本加载完成 ===');