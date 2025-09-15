/**
 * 简化的国际化系统
 * 专门为新的analysis页面设计
 */
class SimpleI18n {
    constructor() {
        this.currentLanguage = this.loadLanguage() || 'zh';
        this.translations = this.loadTranslations();
        this.init();
    }

    loadLanguage() {
        try {
            return localStorage.getItem('app_language');
        } catch (error) {
            return 'zh';
        }
    }

    saveLanguage(language) {
        try {
            localStorage.setItem('app_language', language);
        } catch (error) {
            console.warn('Failed to save language:', error);
        }
    }

    loadTranslations() {
        return {
            zh: {
                nav: {
                    home: "首页",
                    profit: "获利",
                    family: "家庭",
                    analysis: "分析",
                    organization: "组织",
                    pushStrategy: "推送策略",
                    operationLog: "操作记录",
                    messageCenter: "消息中心"
                },
                analysis: {
                    title: "历史数据深度分析 - U Energy",
                    realtime: "实时分析",
                    historical: "历史分析",
                    analysisConclusion: "分析结论",
                    yesterday: "昨天",
                    recent7days: "近7天",
                    recent30days: "近30天",
                    pricePrediction: "价格预测",
                    accuratePrediction: "准确预测",
                    moderatelyAccuratePrediction: "较准预测",
                    largeDeviation: "偏差较大",
                    dischargeAnalysis: "放电分析",
                    totalDischarge: "总放电量",
                    averagePrice: "平均价格",
                    totalRevenue: "总收益",
                    accuracyTrendChart: "预测准确率趋势",
                    sellingTimingAnalysis: "卖电时机分析图",
                    waitToSell: "等待卖出",
                    waitingMessage: "预计3小时后电价上涨至峰值，建议继续持有",
                    decisionConfidence: "决策信心度",
                    expectedWaitTime: "预计等待时间",
                    estimatedPrice: "预计价格",
                    estimatedExtraProfit: "预计多获利",
                    riskAlert: "风险提示",
                    dischargingCapacityDecline: "可放电量下降，峰值时刻仅剩52MWh",
                    priceVolatility: "价格波动大，容易错失放电时机",
                    opportunityHint: "机会提示",
                    eveningPeak: "晚高峰将至，需求将会增加",
                    demandGrowth: "需求快速增长，发电量持续下降，缺口将继续扩大"
                }
            },
            en: {
                nav: {
                    home: "Home",
                    profit: "Profit",
                    family: "Family",
                    analysis: "Analysis",
                    organization: "Organization",
                    pushStrategy: "Push Strategy",
                    operationLog: "Operation Log",
                    messageCenter: "Message Center"
                },
                analysis: {
                    title: "Historical Data Deep Analysis - U Energy",
                    realtime: "Real-time Analysis",
                    historical: "Historical Analysis",
                    analysisConclusion: "Analysis Conclusion",
                    yesterday: "Yesterday",
                    recent7days: "Recent 7 days",
                    recent30days: "Recent 30 days",
                    pricePrediction: "Price Prediction",
                    accuratePrediction: "Accurate Prediction",
                    moderatelyAccuratePrediction: "Moderate Prediction",
                    largeDeviation: "Large Deviation",
                    dischargeAnalysis: "Discharge Analysis",
                    totalDischarge: "Total Discharge",
                    averagePrice: "Average Price",
                    totalRevenue: "Total Revenue",
                    accuracyTrendChart: "Accuracy Trend Chart",
                    sellingTimingAnalysis: "Selling Timing Analysis",
                    waitToSell: "Wait to Sell",
                    waitingMessage: "Expected price peak in 3 hours, recommend continuing to hold",
                    decisionConfidence: "Decision Confidence",
                    expectedWaitTime: "Expected Wait Time",
                    estimatedPrice: "Estimated Price",
                    estimatedExtraProfit: "Estimated Extra Profit",
                    riskAlert: "Risk Alert",
                    dischargingCapacityDecline: "Discharging capacity declining, only 52MWh left at peak",
                    priceVolatility: "High price volatility, easy to miss discharge opportunities",
                    opportunityHint: "Opportunity Hint",
                    eveningPeak: "Evening peak approaching, demand will increase",
                    demandGrowth: "Rapid demand growth, generation continues to decline, gap will keep expanding"
                }
            }
        };
    }

    init() {
        this.createLanguageSelector();
        this.updateAllTexts();
        
        // 设置全局引用
        window.simpleI18n = this;
    }

    createLanguageSelector() {
        const languages = {
            'zh': { name: '中文', flag: '🇨🇳' },
            'en': { name: 'English', flag: '🇺🇸' }
        };

        const selector = document.createElement('div');
        selector.className = 'simple-language-selector';
        selector.innerHTML = `
            <style>
                .simple-language-selector {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: rgba(255, 255, 255, 0.1);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    border-radius: 8px;
                    padding: 8px;
                    z-index: 1000;
                }
                .simple-language-option {
                    display: inline-block;
                    margin: 0 4px;
                    padding: 4px 8px;
                    border-radius: 4px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    color: rgba(255, 255, 255, 0.7);
                    font-size: 14px;
                }
                .simple-language-option:hover {
                    background: rgba(255, 255, 255, 0.1);
                }
                .simple-language-option.active {
                    background: var(--color-primary, #00ff88);
                    color: white;
                }
            </style>
            ${Object.entries(languages).map(([code, lang]) => `
                <span class="simple-language-option ${code === this.currentLanguage ? 'active' : ''}" 
                      onclick="simpleI18n.setLanguage('${code}')">
                    ${lang.flag} ${lang.name}
                </span>
            `).join('')}
        `;

        document.body.appendChild(selector);
    }

    setLanguage(language) {
        if (!this.translations[language]) {
            console.warn(`Language ${language} not supported`);
            return;
        }

        this.currentLanguage = language;
        this.saveLanguage(language);
        this.updateAllTexts();
        this.updateLanguageSelector();
    }

    updateLanguageSelector() {
        document.querySelectorAll('.simple-language-option').forEach(option => {
            option.classList.remove('active');
        });
        
        const activeOption = document.querySelector(`[onclick="simpleI18n.setLanguage('${this.currentLanguage}')"]`);
        if (activeOption) {
            activeOption.classList.add('active');
        }
    }

    getText(key) {
        const keys = key.split('.');
        let text = this.translations[this.currentLanguage];
        
        for (const k of keys) {
            if (text && typeof text === 'object' && k in text) {
                text = text[k];
            } else {
                return key; // 返回原始key作为fallback
            }
        }
        
        return typeof text === 'string' ? text : key;
    }

    updateAllTexts() {
        // 更新所有带有 data-i18n-key 的元素
        document.querySelectorAll('[data-i18n-key]').forEach(element => {
            const key = element.getAttribute('data-i18n-key');
            const text = this.getText(key);
            
            if (element.tagName === 'TITLE') {
                element.textContent = text;
            } else if (element.tagName === 'INPUT' && (element.type === 'text' || element.type === 'search')) {
                element.placeholder = text;
            } else {
                element.textContent = text;
            }
        });

        console.log(`Updated texts to ${this.currentLanguage}`);
    }
}

// 自动初始化
document.addEventListener('DOMContentLoaded', function() {
    new SimpleI18n();
});