// Pricing Manager Module

class PricingManager {
    constructor() {
        this.pricingRules = [];
        this.currentCurrency = 'USD';
        this.currencies = ['USD', 'EUR', 'GBP', 'JPY', 'CNY'];
    }

    // Initialize pricing manager
    init() {
        console.log('Initializing pricing manager...');
        this.loadPricingRules();
        this.setupEventListeners();
    }

    // Load pricing rules
    async loadPricingRules() {
        try {
            // Mock pricing data
            this.pricingRules = [
                {
                    id: 1,
                    name: 'Peak Hours',
                    timeStart: '06:00',
                    timeEnd: '10:00',
                    rate: 0.45,
                    currency: 'USD',
                    unit: 'kWh'
                },
                {
                    id: 2,
                    name: 'Off-Peak Hours',
                    timeStart: '22:00',
                    timeEnd: '06:00',
                    rate: 0.25,
                    currency: 'USD',
                    unit: 'kWh'
                },
                {
                    id: 3,
                    name: 'Weekend Rate',
                    days: ['Saturday', 'Sunday'],
                    rate: 0.30,
                    currency: 'USD',
                    unit: 'kWh'
                }
            ];
            this.renderPricingTable();
        } catch (error) {
            console.error('Error loading pricing rules:', error);
        }
    }

    // Render pricing table
    renderPricingTable() {
        const container = document.getElementById('pricingRulesContainer');
        if (!container) return;

        container.innerHTML = this.pricingRules.map(rule => `
            <div class="pricing-rule-card">
                <h4>${rule.name}</h4>
                <div class="pricing-details">
                    ${rule.timeStart ? `<p>Time: ${rule.timeStart} - ${rule.timeEnd}</p>` : ''}
                    ${rule.days ? `<p>Days: ${rule.days.join(', ')}</p>` : ''}
                    <p class="pricing-rate">
                        ${this.formatCurrency(rule.rate)} / ${rule.unit}
                    </p>
                </div>
                <div class="pricing-actions">
                    <button onclick="pricingManager.editRule(${rule.id})" class="btn-minimal btn-ghost-minimal">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="pricingManager.deleteRule(${rule.id})" class="btn-minimal btn-ghost-minimal">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    // Format currency
    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: this.currentCurrency
        }).format(amount);
    }

    // Add pricing rule
    addRule(ruleData) {
        const newRule = {
            id: this.pricingRules.length + 1,
            ...ruleData,
            currency: this.currentCurrency
        };
        this.pricingRules.push(newRule);
        this.renderPricingTable();
    }

    // Edit pricing rule
    editRule(ruleId) {
        console.log('Editing pricing rule:', ruleId);
        // Implementation for edit functionality
    }

    // Delete pricing rule
    deleteRule(ruleId) {
        if (confirm('Are you sure you want to delete this pricing rule?')) {
            this.pricingRules = this.pricingRules.filter(r => r.id !== ruleId);
            this.renderPricingTable();
        }
    }

    // Calculate pricing for session
    calculateSessionCost(startTime, endTime, energyKwh) {
        const duration = (endTime - startTime) / (1000 * 60 * 60); // Hours
        const hour = new Date(startTime).getHours();
        
        // Find applicable rule
        let rate = 0.35; // Default rate
        for (const rule of this.pricingRules) {
            if (rule.timeStart && rule.timeEnd) {
                const ruleStart = parseInt(rule.timeStart.split(':')[0]);
                const ruleEnd = parseInt(rule.timeEnd.split(':')[0]);
                if (hour >= ruleStart && hour < ruleEnd) {
                    rate = rule.rate;
                    break;
                }
            }
        }

        return {
            energy: energyKwh,
            rate: rate,
            total: energyKwh * rate,
            currency: this.currentCurrency
        };
    }

    // Setup event listeners
    setupEventListeners() {
        // Add event listeners for pricing management
    }

    // Export pricing rules
    exportRules() {
        const json = JSON.stringify(this.pricingRules, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'pricing-rules.json';
        a.click();
    }

    // Import pricing rules
    importRules(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const rules = JSON.parse(e.target.result);
                this.pricingRules = rules;
                this.renderPricingTable();
            } catch (error) {
                console.error('Error importing rules:', error);
                alert('Invalid pricing rules file');
            }
        };
        reader.readAsText(file);
    }
}

// Create global instance
const pricingManager = new PricingManager();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PricingManager;
}