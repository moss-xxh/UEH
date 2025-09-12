// Language translations
const translations = {
    en: {
        // Page content
        pageTitle: "Discharge & Profit",
        day: "Day",
        month: "Month",
        year: "Year",
        total: "Total",
        today: "Today",
        // Discharge section
        dischargeTitle: "Discharge Overview",
        totalDischarge: "Total Discharge",
        peakPower: "Peak Power",
        avgEfficiency: "Avg Efficiency",
        // Profit section
        profitTitle: "Profit Analysis",
        totalRevenue: "Total Revenue",
        avgPrice: "Avg Price",
        profitMargin: "Profit Margin",
        // Summary section
        summaryTitle: "Performance Summary",
        operatingHours: "Operating Hours",
        gridContribution: "Grid Contribution",
        co2Saved: "CO₂ Saved",
        systemStatus: "System Status",
        online: "Online",
        offline: "Offline",
        loadingChart: "Loading chart..."
    },
    zh: {
        // Page content
        pageTitle: "放电与收益",
        day: "日",
        month: "月",
        year: "年",
        total: "累计",
        today: "今日",
        // Discharge section
        dischargeTitle: "放电概览",
        totalDischarge: "总放电量",
        peakPower: "峰值功率",
        avgEfficiency: "平均效率",
        // Profit section
        profitTitle: "收益分析",
        totalRevenue: "总收入",
        avgPrice: "平均价格",
        profitMargin: "利润率",
        // Summary section
        summaryTitle: "性能摘要",
        operatingHours: "运行时长",
        gridContribution: "电网贡献",
        co2Saved: "减少碳排放",
        systemStatus: "系统状态",
        online: "在线",
        offline: "离线",
        loadingChart: "加载图表中..."
    }
};

// Current language
let currentLang = 'en';
let currentPeriod = 'day';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Set default language from browser or localStorage
    const savedLang = localStorage.getItem('vpp-language');
    const browserLang = navigator.language.startsWith('zh') ? 'zh' : 'en';
    currentLang = savedLang || browserLang;
    
    // Update language switcher
    updateLanguageSwitcher();
    
    // Apply translations
    updateTranslations();
    
    // Language switcher click handler
    document.getElementById('langSwitcher').addEventListener('click', () => {
        currentLang = currentLang === 'en' ? 'zh' : 'en';
        localStorage.setItem('vpp-language', currentLang);
        updateLanguageSwitcher();
        updateTranslations();
    });
    
    // Time selector handlers
    document.querySelectorAll('.time-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            if (!btn.classList.contains('disabled')) {
                handleTimeSelection(btn.dataset.period);
            }
        });
    });
    
    // Date input handler
    const dateInput = document.getElementById('dateInput');
    if (dateInput) {
        // Set today's date
        const today = new Date();
        dateInput.value = today.toISOString().split('T')[0];
        
        dateInput.addEventListener('change', (e) => {
            updateDateDisplay(e.target.value);
            loadData(currentPeriod, e.target.value);
        });
    }
    
    // Load initial data
    loadData('day');
});

// Update language switcher display
function updateLanguageSwitcher() {
    const langTexts = document.querySelectorAll('.lang-text');
    langTexts.forEach(text => {
        if (text.dataset.lang === currentLang) {
            text.classList.add('active');
        } else {
            text.classList.remove('active');
        }
    });
}

// Update all translations
function updateTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[currentLang][key]) {
            element.textContent = translations[currentLang][key];
        }
    });
    
    // Update date display
    updateDateDisplay(document.getElementById('dateInput')?.value);
}

// Handle time period selection
function handleTimeSelection(period) {
    currentPeriod = period;
    
    // Update active state
    document.querySelectorAll('.time-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.period === period) {
            btn.classList.add('active');
        }
    });
    
    // Update date picker visibility and type
    const datePickerContainer = document.getElementById('datePickerContainer');
    const dateInput = document.getElementById('dateInput');
    
    if (period === 'total') {
        // Hide date picker for total
        datePickerContainer.style.opacity = '0';
        datePickerContainer.style.pointerEvents = 'none';
    } else {
        // Show date picker
        datePickerContainer.style.opacity = '1';
        datePickerContainer.style.pointerEvents = 'auto';
        
        // Update input type based on period
        switch(period) {
            case 'day':
                dateInput.type = 'date';
                break;
            case 'month':
                dateInput.type = 'month';
                break;
            case 'year':
                // For year, we'll use a date input and extract year
                dateInput.type = 'date';
                break;
        }
    }
    
    // Load data for selected period
    loadData(period);
    
    // Update charts with new period
    if (dischargeChart || profitChart) {
        initCharts(period);
    }
}

// Update date display
function updateDateDisplay(dateValue) {
    const dateDisplay = document.getElementById('dateDisplay');
    if (!dateValue || !dateDisplay) return;
    
    const date = new Date(dateValue);
    const today = new Date();
    
    // Check if it's today
    if (currentPeriod === 'day' && 
        date.toDateString() === today.toDateString()) {
        dateDisplay.textContent = translations[currentLang].today;
        return;
    }
    
    // Format based on period and language
    let formattedDate = '';
    
    if (currentLang === 'en') {
        switch(currentPeriod) {
            case 'day':
                formattedDate = date.toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric' 
                });
                break;
            case 'month':
                formattedDate = date.toLocaleDateString('en-US', { 
                    month: 'long', 
                    year: 'numeric' 
                });
                break;
            case 'year':
                formattedDate = date.getFullYear().toString();
                break;
        }
    } else {
        switch(currentPeriod) {
            case 'day':
                formattedDate = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
                break;
            case 'month':
                formattedDate = `${date.getFullYear()}年${date.getMonth() + 1}月`;
                break;
            case 'year':
                formattedDate = `${date.getFullYear()}年`;
                break;
        }
    }
    
    dateDisplay.textContent = formattedDate;
}

// Load data based on period and date
function loadData(period, date) {
    // Simulate data loading
    console.log(`Loading data for ${period}${date ? ` - ${date}` : ''}`);
    
    // Update stats with random variations
    updateStats();
    
    // Initialize charts
    setTimeout(() => {
        initCharts(currentPeriod);
    }, 500);
}

// Update stats with random data (for demo)
function updateStats() {
    // Discharge stats
    const dischargeStats = {
        totalDischarge: Math.floor(1000 + Math.random() * 500),
        peakPower: Math.floor(400 + Math.random() * 100),
        avgEfficiency: (90 + Math.random() * 5).toFixed(1)
    };
    
    // Profit stats
    const profitStats = {
        totalRevenue: Math.floor(2000 + Math.random() * 1000),
        avgPrice: (0.18 + Math.random() * 0.05).toFixed(3),
        profitMargin: (65 + Math.random() * 10).toFixed(1)
    };
    
    // Update DOM
    const statElements = document.querySelectorAll('.stat-value');
    statElements[0].innerHTML = `${dischargeStats.totalDischarge} <span class="stat-unit">kWh</span>`;
    statElements[1].innerHTML = `${dischargeStats.peakPower} <span class="stat-unit">kW</span>`;
    statElements[2].innerHTML = `${dischargeStats.avgEfficiency}<span class="stat-unit">%</span>`;
    statElements[3].innerHTML = `$${profitStats.totalRevenue}`;
    statElements[4].innerHTML = `$${profitStats.avgPrice} <span class="stat-unit">/kWh</span>`;
    statElements[5].innerHTML = `${profitStats.profitMargin}<span class="stat-unit">%</span>`;
    
    // Update changes
    document.querySelectorAll('.stat-change').forEach(change => {
        const isPositive = Math.random() > 0.3;
        const value = (Math.random() * 20).toFixed(1);
        change.className = `stat-change ${isPositive ? 'positive' : 'negative'}`;
        change.textContent = `${isPositive ? '+' : '-'}${value}%`;
    });
    
    // Update summary
    const summaryValues = document.querySelectorAll('.summary-value');
    summaryValues[0].textContent = `${(15 + Math.random() * 8).toFixed(1)}h`;
    summaryValues[1].textContent = `${Math.floor(80 + Math.random() * 15)}%`;
    summaryValues[2].textContent = `${Math.floor(800 + Math.random() * 400)} kg`;
}

// Chart instances
let dischargeChart = null;
let profitChart = null;

// Initialize charts
function initCharts(period) {
    // Clear any existing charts
    if (dischargeChart) {
        dischargeChart.dispose();
    }
    if (profitChart) {
        profitChart.dispose();
    }
    
    // Initialize discharge chart
    const dischargeContainer = document.getElementById('dischargeChart');
    if (dischargeContainer) {
        // Clear the container first
        dischargeContainer.innerHTML = '';
        dischargeContainer.style.width = '100%';
        dischargeContainer.style.height = '100%';
        
        dischargeChart = echarts.init(dischargeContainer);
        
        const dischargeOption = {
            tooltip: {
                trigger: 'axis',
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                borderColor: '#00ff88',
                borderWidth: 1,
                textStyle: {
                    color: '#fff'
                }
            },
            xAxis: {
                type: 'category',
                data: getTimeLabels(period),
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: '#666666',
                        width: 2
                    }
                },
                axisTick: {
                    show: true,
                    lineStyle: {
                        color: '#666666',
                        width: 1
                    }
                },
                axisLabel: {
                    show: true,
                    color: '#ffffff',
                    fontSize: 14,
                    fontWeight: 'normal'
                },
                splitLine: {
                    show: false
                }
            },
            yAxis: {
                type: 'value',
                name: 'Discharge (kWh)',
                nameLocation: 'end',
                nameGap: 20,
                nameTextStyle: {
                    color: '#ffffff',
                    fontSize: 14,
                    fontWeight: 'normal',
                    align: 'right'
                },
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: 'rgba(255, 255, 255, 0.4)',
                        width: 1
                    }
                },
                axisLabel: {
                    show: true,
                    color: '#ffffff',
                    fontSize: 14,
                    fontWeight: 'normal'
                },
                axisTick: {
                    show: true,
                    lineStyle: {
                        color: 'rgba(255, 255, 255, 0.4)'
                    }
                },
                splitLine: {
                    lineStyle: {
                        color: 'rgba(255, 255, 255, 0.05)'
                    }
                }
            },
            series: [{
                name: 'Discharge',
                data: generateRandomData(period),
                type: 'line',
                smooth: true,
                lineStyle: {
                    color: '#00ff88',
                    width: 3
                },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: 'rgba(0, 255, 136, 0.3)' },
                        { offset: 1, color: 'rgba(0, 255, 136, 0)' }
                    ])
                },
                symbol: 'circle',
                symbolSize: 6,
                itemStyle: {
                    color: '#00ff88',
                    borderColor: '#fff',
                    borderWidth: 2
                }
            }]
        };
        
        dischargeChart.setOption(dischargeOption);
    }
    
    // Initialize profit chart
    const profitContainer = document.getElementById('profitChart');
    if (profitContainer) {
        profitChart = echarts.init(profitContainer);
        
        const profitOption = {
            ...chartTheme,
            color: ['#00ff88', '#4a9eff'],
            tooltip: {
                trigger: 'axis',
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                borderColor: '#00ff88',
                borderWidth: 1,
                textStyle: {
                    color: '#fff'
                }
            },
            legend: {
                data: ['Revenue', 'Cost'],
                textStyle: {
                    color: 'rgba(255, 255, 255, 0.6)'
                },
                top: 10
            },
            xAxis: {
                type: 'category',
                data: getTimeLabels(period),
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: '#666666',
                        width: 2
                    }
                },
                axisTick: {
                    show: true,
                    lineStyle: {
                        color: '#666666',
                        width: 1
                    }
                },
                axisLabel: {
                    show: true,
                    color: '#ffffff',
                    fontSize: 14,
                    fontWeight: 'normal'
                },
                splitLine: {
                    show: false
                }
            },
            yAxis: {
                type: 'value',
                name: 'Amount ($)',
                nameLocation: 'end',
                nameGap: 20,
                nameTextStyle: {
                    color: '#ffffff',
                    fontSize: 14,
                    fontWeight: 'normal',
                    align: 'right'
                },
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: 'rgba(255, 255, 255, 0.4)',
                        width: 1
                    }
                },
                axisLabel: {
                    show: true,
                    color: '#ffffff',
                    fontSize: 14,
                    fontWeight: 'normal',
                    formatter: '${value}'
                },
                axisTick: {
                    show: true,
                    lineStyle: {
                        color: 'rgba(255, 255, 255, 0.4)'
                    }
                },
                splitLine: {
                    lineStyle: {
                        color: 'rgba(255, 255, 255, 0.05)'
                    }
                }
            },
            series: [
                {
                    name: 'Revenue',
                    data: generateRandomData(period, 500, 1500),
                    type: 'bar',
                    barWidth: '40%',
                    itemStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: '#00ff88' },
                            { offset: 1, color: '#00cc6a' }
                        ]),
                        borderRadius: [4, 4, 0, 0]
                    }
                },
                {
                    name: 'Cost',
                    data: generateRandomData(period, 200, 600),
                    type: 'line',
                    smooth: true,
                    lineStyle: {
                        color: '#4a9eff',
                        width: 2
                    },
                    symbol: 'circle',
                    symbolSize: 4,
                    itemStyle: {
                        color: '#4a9eff'
                    }
                }
            ]
        };
        
        profitChart.setOption(profitOption);
    }
    
    // Remove loading indicators
    document.querySelectorAll('.chart-loading').forEach(loading => {
        loading.style.display = 'none';
    });
}

// Get time labels based on period
function getTimeLabels(period) {
    switch(period) {
        case 'day':
            return ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'];
        case 'month':
            return ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
        case 'year':
            return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        case 'total':
            return ['2021', '2022', '2023', '2024'];
        default:
            return ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'];
    }
}

// Generate random data for demo
function generateRandomData(period, min = 100, max = 500) {
    const labels = getTimeLabels(period);
    return labels.map(() => Math.floor(min + Math.random() * (max - min)));
}

// Resize charts on window resize
window.addEventListener('resize', () => {
    if (dischargeChart) dischargeChart.resize();
    if (profitChart) profitChart.resize();
});