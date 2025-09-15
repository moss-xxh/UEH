// 图表轴线显示修复 - 最终版
(function() {
    // 等待DOM和图表完全加载
    function waitForCharts() {
        const checkInterval = setInterval(() => {
            // 检查ECharts是否加载
            if (window.echarts) {
                clearInterval(checkInterval);
                // 等待图表初始化完成
                setTimeout(() => {
                    fixAllCharts();
                    // 持续监控并修复
                    setInterval(fixAllCharts, 3000);
                }, 2000);
            }
        }, 100);
    }

    // 开始等待
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', waitForCharts);
    } else {
        waitForCharts();
    }

    function fixAllCharts() {
        // 修复所有图表
        fixChartById('revenueDistributionChart');
        fixChartById('powerRevenueChart');
        fixChartById('profitRankingChart');
        fixChartById('userManagementChart');
    }

    function fixChartById(chartId) {
        try {
            const chartDom = document.getElementById(chartId);
            if (!chartDom) return;
            
            const chart = window.echarts.getInstanceByDom(chartDom);
            if (!chart || chart.isDisposed()) return;
            
            const option = chart.getOption();
            const newOption = {};
            
            // 通用轴线样式 - 与首页一致
            const axisLineStyle = {
                show: true,
                lineStyle: {
                    color: 'rgba(255, 255, 255, 0.2)',
                    width: 1,
                    type: 'solid'
                }
            };
            
            const axisLabelStyle = {
                show: true,
                color: 'rgba(255, 255, 255, 0.6)',
                fontSize: 10
            };
            
            const splitLineStyle = {
                show: true,
                lineStyle: {
                    color: 'rgba(255, 255, 255, 0.05)',
                    type: 'dashed',
                    width: 1
                }
            };
            
            // 修复X轴
            if (option.xAxis) {
                newOption.xAxis = option.xAxis.map(axis => ({
                    ...axis,
                    axisLine: axisLineStyle,
                    axisTick: {
                        show: true,
                        lineStyle: {
                            color: 'rgba(255, 255, 255, 0.2)',
                            width: 1
                        }
                    },
                    axisLabel: {
                        ...axisLabelStyle,
                        ...(axis.axisLabel || {}),
                        color: 'rgba(255, 255, 255, 0.6)'
                    },
                    splitLine: axis.type === 'value' ? splitLineStyle : { show: false }
                }));
            }
            
            // 修复Y轴
            if (option.yAxis) {
                newOption.yAxis = option.yAxis.map((axis, index) => {
                    // 对于powerRevenueChart，所有轴使用统一颜色；其他图表保持原有逻辑
                    const isMultiAxis = option.yAxis.length > 1;
                    const isPowerRevenueChart = chartId === 'powerRevenueChart';
                    
                    let yAxisColor, yAxisLabelColor;
                    if (isPowerRevenueChart) {
                        // powerRevenueChart使用统一的轴颜色
                        yAxisColor = 'rgba(255, 255, 255, 0.2)';
                        yAxisLabelColor = 'rgba(255, 255, 255, 0.6)';
                    } else {
                        // 其他图表保持原有的双Y轴颜色逻辑
                        yAxisColor = isMultiAxis ? 
                            (index === 0 ? '#00ff88' : '#1e7fff') : 'rgba(255, 255, 255, 0.2)';
                        yAxisLabelColor = isMultiAxis ? 
                            (index === 0 ? '#00ff88' : '#1e7fff') : 'rgba(255, 255, 255, 0.6)';
                    }
                    
                    return {
                        ...axis,
                        axisLine: {
                            show: true,
                            lineStyle: {
                                color: yAxisColor,
                                width: 1,
                                type: 'solid'
                            }
                        },
                        axisTick: {
                            show: true,
                            lineStyle: {
                                color: yAxisColor,
                                width: 1
                            }
                        },
                        axisLabel: {
                            ...axisLabelStyle,
                            ...(axis.axisLabel || {}),
                            color: yAxisLabelColor,
                            fontSize: 10,
                            formatter: axis.axisLabel?.formatter || '{value}'
                        },
                        splitLine: index === 0 ? splitLineStyle : { show: false }
                    };
                });
            }
            
            // 根据图表类型添加特定修复
            switch(chartId) {
                case 'revenueDistributionChart':
                    newOption.xAxis = [{
                        ...newOption.xAxis[0],
                        name: '用户',
                        nameLocation: 'end',
                        nameGap: 15,
                        nameTextStyle: {
                            color: 'rgba(255, 255, 255, 0.6)',
                            fontSize: 12,
                            fontWeight: 'normal'
                        }
                    }];
                    newOption.yAxis = [{
                        ...newOption.yAxis[0],
                        name: '收益 ($)',
                        nameLocation: 'middle',
                        nameGap: 60,
                        nameRotate: 90,
                        nameTextStyle: {
                            color: 'rgba(255, 255, 255, 0.6)',
                            fontSize: 12,
                            fontWeight: 'normal'
                        }
                    }];
                    newOption.grid = {
                        left: 80,
                        right: 50,
                        bottom: 60,
                        top: 40
                    };
                    break;
                    
                case 'powerRevenueChart':
                    newOption.xAxis = [{
                        ...newOption.xAxis[0],
                        name: '时间',
                        nameLocation: 'middle',
                        nameGap: 35,
                        nameTextStyle: {
                            color: 'rgba(255, 255, 255, 0.6)',
                            fontSize: 12,
                            fontWeight: 'normal'
                        }
                    }];
                    if (newOption.yAxis && newOption.yAxis[0]) {
                        newOption.yAxis[0] = {
                            ...newOption.yAxis[0],
                            name: '放电量 (kWh)',
                            nameLocation: 'middle',
                            nameGap: 60,
                            nameRotate: 90,
                            nameTextStyle: {
                                color: 'rgba(255, 255, 255, 0.6)',
                                fontSize: 12,
                                fontWeight: 'normal'
                            }
                        };
                    }
                    if (newOption.yAxis && newOption.yAxis[1]) {
                        newOption.yAxis[1] = {
                            ...newOption.yAxis[1],
                            name: '获利 ($)',
                            nameLocation: 'middle',
                            nameGap: 60,
                            nameRotate: 90,
                            nameTextStyle: {
                                color: 'rgba(255, 255, 255, 0.6)',
                                fontSize: 12,
                                fontWeight: 'normal'
                            }
                        };
                    }
                    newOption.grid = {
                        left: 100,
                        right: 100,
                        bottom: 60,
                        top: 60
                    };
                    break;
                    
                case 'profitRankingChart':
                    newOption.yAxis = [{
                        ...newOption.yAxis[0],
                        name: '获利金额 ($)',
                        nameLocation: 'middle',
                        nameGap: 60,
                        nameRotate: 90,
                        nameTextStyle: {
                            color: 'rgba(255, 255, 255, 0.6)',
                            fontSize: 12,
                            fontWeight: 'normal'
                        }
                    }];
                    if (newOption.xAxis && newOption.xAxis[0]) {
                        newOption.xAxis[0].axisLabel = {
                            ...newOption.xAxis[0].axisLabel,
                            interval: 0,
                            rotate: -30
                        };
                    }
                    newOption.grid = {
                        left: 100,
                        right: 50,
                        bottom: 80,
                        top: 40
                    };
                    break;
            }
            
            // 应用修复
            chart.setOption(newOption);
            console.log(`Fixed chart: ${chartId}`);
            
        } catch (error) {
            console.error(`Error fixing chart ${chartId}:`, error);
        }
    }

    // 监听窗口大小变化
    window.addEventListener('resize', () => {
        setTimeout(fixAllCharts, 300);
    });

    // 导出函数供调试
    window.fixProfitCharts = fixAllCharts;
    
    // 额外的修复：确保图表容器有足够的高度
    function ensureChartContainerHeight() {
        const chartIds = ['userManagementChart', 'revenueDistributionChart', 'powerRevenueChart', 'profitRankingChart'];
        
        chartIds.forEach(id => {
            const container = document.getElementById(id);
            if (container) {
                // 如果容器高度太小，设置最小高度
                if (container.offsetHeight < 200) {
                    container.style.minHeight = '300px';
                    container.style.height = '300px';
                    
                    // 如果有图表实例，重新resize
                    const chart = window.echarts.getInstanceByDom(container);
                    if (chart && !chart.isDisposed()) {
                        setTimeout(() => {
                            chart.resize();
                        }, 100);
                    }
                }
            }
        });
    }
    
    // 添加到修复循环中
    const originalFixAllCharts = fixAllCharts;
    window.fixAllCharts = function() {
        ensureChartContainerHeight();
        originalFixAllCharts();
    };
    
    // 监听视图切换
    document.addEventListener('click', function(e) {
        if (e.target.matches('.page-tab, .filter-tab, .time-pill')) {
            setTimeout(() => {
                ensureChartContainerHeight();
                fixAllCharts();
            }, 300);
        }
    });
})();