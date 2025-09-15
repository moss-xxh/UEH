// 系统设置页面功能
class SettingsPage {
    constructor() {
        this.currentTab = 'basic';
        this.settings = {
            basic: {},
            pricing: {},
            notification: {},
            security: {},
            integration: {},
            backup: {}
        };
        this.init();
    }

    init() {
        // 插入导航栏
        document.getElementById('header-container').innerHTML = SharedComponents.createHeader('settings');
        
        // 初始化通用功能
        SharedComponents.initCommonFeatures();
        
        // 初始化设置数据
        this.initSettingsData();
        
        // 绑定事件
        this.bindEvents();
    }

    initSettingsData() {
        // 初始化各模块的设置数据
        this.settings = {
            basic: {
                companyName: '绿能充电科技有限公司',
                creditCode: '91110000MA001234567',
                phone: '400-888-6666',
                email: 'contact@greencharge.com',
                address: '北京市朝阳区建国路88号现代城A座',
                description: '专业的新能源充电服务提供商，致力于为用户提供便捷、高效、安全的充电服务。',
                timezone: 'Asia/Shanghai',
                language: 'zh-CN',
                dataRetention: 365,
                refreshInterval: 10
            },
            pricing: {
                fastCharging: {
                    peakPrice: 1.8,
                    valleyPrice: 1.2,
                    servicePrice: 0.5
                },
                slowCharging: {
                    peakPrice: 1.5,
                    valleyPrice: 1.0,
                    servicePrice: 0.3
                },
                additional: {
                    parkingFee: 5.0,
                    freeParkingHours: 2
                }
            },
            notification: {
                deviceFault: {
                    email: true,
                    sms: true,
                    wechat: false,
                    threshold: 'immediate'
                },
                maintenance: {
                    email: true,
                    sms: false,
                    system: true,
                    advance: '3day'
                },
                financial: {
                    email: true,
                    auto: false,
                    frequency: 'weekly'
                }
            },
            security: {
                password: {
                    minLength: true,
                    alphanumeric: true,
                    special: false,
                    forceChange: true
                },
                login: {
                    maxFailures: 5,
                    lockoutTime: 30,
                    sessionTimeout: 8
                },
                twoFactor: {
                    enabled: false,
                    sms: false,
                    email: false
                },
                ipControl: ''
            },
            integration: {
                alipay: {
                    connected: true,
                    appId: '2021001234567890',
                    merchantId: '2088123456789012'
                },
                wechat: {
                    connected: true,
                    appId: 'wx1234567890abcdef',
                    merchantId: '1234567890'
                },
                sms: {
                    connected: false,
                    provider: ''
                }
            },
            backup: {
                frequency: 'daily',
                time: '02:00',
                retention: 30,
                storage: {
                    local: true,
                    cloud: false,
                    ftp: false
                }
            }
        };
    }

    bindEvents() {
        // 标签页切换
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const tabId = e.target.dataset.tab;
                this.switchTab(tabId);
            });
        });

        // 表单保存按钮
        document.querySelectorAll('.btn-primary').forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (btn.textContent.includes('保存')) {
                    this.saveCurrentTabSettings();
                } else if (btn.textContent.includes('立即备份')) {
                    this.performBackup();
                } else if (btn.textContent.includes('配置连接')) {
                    this.configureIntegration(e.target.closest('.integration-service'));
                }
            });
        });

        // 重置按钮
        document.querySelectorAll('.btn').forEach(btn => {
            if (btn.textContent.includes('重置')) {
                btn.addEventListener('click', () => {
                    this.resetCurrentTabSettings();
                });
            } else if (btn.textContent.includes('测试通知')) {
                btn.addEventListener('click', () => {
                    this.testNotification();
                });
            } else if (btn.textContent.includes('重新配置')) {
                btn.addEventListener('click', (e) => {
                    this.reconfigureIntegration(e.target.closest('.integration-service'));
                });
            } else if (btn.textContent.includes('断开连接')) {
                btn.addEventListener('click', (e) => {
                    this.disconnectIntegration(e.target.closest('.integration-service'));
                });
            }
        });

        // 备份操作按钮
        document.querySelectorAll('.backup-actions .btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const backupItem = e.target.closest('.backup-item');
                const backupName = backupItem.querySelector('.backup-name').textContent;
                
                if (btn.textContent.includes('下载')) {
                    this.downloadBackup(backupName);
                } else if (btn.textContent.includes('恢复')) {
                    this.restoreBackup(backupName);
                } else if (btn.textContent.includes('删除')) {
                    this.deleteBackup(backupName, backupItem);
                }
            });
        });

        // 表单输入监听
        document.querySelectorAll('.form-input, .form-select, .form-textarea').forEach(input => {
            input.addEventListener('change', () => {
                this.markTabAsModified();
            });
        });

        // 复选框和单选框监听
        document.querySelectorAll('input[type="checkbox"], input[type="radio"]').forEach(input => {
            input.addEventListener('change', () => {
                this.markTabAsModified();
            });
        });
    }

    switchTab(tabId) {
        // 更新导航状态
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');

        // 更新内容区域
        document.querySelectorAll('.settings-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.getElementById(`${tabId}-tab`).classList.add('active');

        this.currentTab = tabId;
    }

    saveCurrentTabSettings() {
        switch (this.currentTab) {
            case 'basic':
                this.saveBasicSettings();
                break;
            case 'pricing':
                this.savePricingSettings();
                break;
            case 'notification':
                this.saveNotificationSettings();
                break;
            case 'security':
                this.saveSecuritySettings();
                break;
            case 'integration':
                this.saveIntegrationSettings();
                break;
            case 'backup':
                this.saveBackupSettings();
                break;
        }
    }

    saveBasicSettings() {
        const basicTab = document.getElementById('basic-tab');
        
        // 获取企业信息
        this.settings.basic.companyName = basicTab.querySelector('input[value*="绿能充电"]').value;
        this.settings.basic.creditCode = basicTab.querySelector('input[value*="91110000"]').value;
        this.settings.basic.phone = basicTab.querySelector('input[value*="400-888"]').value;
        this.settings.basic.email = basicTab.querySelector('input[value*="contact@"]').value;
        this.settings.basic.address = basicTab.querySelector('input[value*="北京市朝阳区"]').value;
        this.settings.basic.description = basicTab.querySelector('textarea').value;

        // 获取系统配置
        const selects = basicTab.querySelectorAll('.form-select');
        this.settings.basic.timezone = selects[0].value;
        this.settings.basic.language = selects[1].value;
        this.settings.basic.dataRetention = parseInt(selects[2].value);
        this.settings.basic.refreshInterval = parseInt(selects[3].value);

        SharedComponents.showToast('基本设置已保存', 'success');
        this.removeTabModified();
    }

    savePricingSettings() {
        const pricingTab = document.getElementById('pricing-tab');
        const priceInputs = pricingTab.querySelectorAll('.price-input');

        // 快充电价
        this.settings.pricing.fastCharging.peakPrice = parseFloat(priceInputs[0].value);
        this.settings.pricing.fastCharging.valleyPrice = parseFloat(priceInputs[1].value);
        this.settings.pricing.fastCharging.servicePrice = parseFloat(priceInputs[2].value);

        // 慢充电价
        this.settings.pricing.slowCharging.peakPrice = parseFloat(priceInputs[3].value);
        this.settings.pricing.slowCharging.valleyPrice = parseFloat(priceInputs[4].value);
        this.settings.pricing.slowCharging.servicePrice = parseFloat(priceInputs[5].value);

        // 附加费用
        this.settings.pricing.additional.parkingFee = parseFloat(priceInputs[6].value);
        this.settings.pricing.additional.freeParkingHours = parseFloat(priceInputs[7].value);

        SharedComponents.showToast('计费设置已保存', 'success');
        this.removeTabModified();
    }

    saveNotificationSettings() {
        const notificationTab = document.getElementById('notification-tab');
        
        // 这里可以根据实际的表单元素获取通知设置
        SharedComponents.showToast('通知设置已保存', 'success');
        this.removeTabModified();
    }

    saveSecuritySettings() {
        const securityTab = document.getElementById('security-tab');
        
        // 获取密码策略
        const passwordChecks = securityTab.querySelectorAll('.security-options input[type="checkbox"]');
        this.settings.security.password.minLength = passwordChecks[0].checked;
        this.settings.security.password.alphanumeric = passwordChecks[1].checked;
        this.settings.security.password.special = passwordChecks[2].checked;
        this.settings.security.password.forceChange = passwordChecks[3].checked;

        // 获取登录控制
        const loginInputs = securityTab.querySelectorAll('.security-grid .form-input');
        this.settings.security.login.maxFailures = parseInt(loginInputs[0].value);
        this.settings.security.login.lockoutTime = parseInt(loginInputs[1].value);
        this.settings.security.login.sessionTimeout = parseInt(loginInputs[2].value);

        // 获取IP控制
        this.settings.security.ipControl = securityTab.querySelector('.ip-control textarea').value;

        SharedComponents.showToast('安全设置已保存', 'success');
        this.removeTabModified();
    }

    saveIntegrationSettings() {
        SharedComponents.showToast('集成设置已保存', 'success');
        this.removeTabModified();
    }

    saveBackupSettings() {
        const backupTab = document.getElementById('backup-tab');
        
        // 获取备份策略
        const frequencyRadios = backupTab.querySelectorAll('input[name="backup-frequency"]');
        frequencyRadios.forEach(radio => {
            if (radio.checked) {
                this.settings.backup.frequency = radio.value;
            }
        });

        // 获取备份时间和保留期限
        this.settings.backup.time = backupTab.querySelector('input[type="time"]').value;
        this.settings.backup.retention = parseInt(backupTab.querySelector('.backup-retention select').value);

        // 获取存储选项
        const storageChecks = backupTab.querySelectorAll('.storage-options input[type="checkbox"]');
        this.settings.backup.storage.local = storageChecks[0].checked;
        this.settings.backup.storage.cloud = storageChecks[1].checked;
        this.settings.backup.storage.ftp = storageChecks[2].checked;

        SharedComponents.showToast('备份设置已保存', 'success');
        this.removeTabModified();
    }

    resetCurrentTabSettings() {
        SharedComponents.showConfirm(
            '重置设置',
            '确定要重置当前页面的设置吗？所有未保存的更改将丢失。',
            () => {
                this.loadTabDefaults(this.currentTab);
                SharedComponents.showToast('设置已重置', 'info');
                this.removeTabModified();
            }
        );
    }

    loadTabDefaults(tabId) {
        // 这里可以重新加载默认设置到表单
        console.log(`重置 ${tabId} 标签页设置`);
    }

    testNotification() {
        SharedComponents.showToast('正在发送测试通知...', 'info');
        
        setTimeout(() => {
            SharedComponents.showToast('测试通知发送成功', 'success');
        }, 2000);
    }

    configureIntegration(serviceElement) {
        const serviceName = serviceElement.querySelector('h4').textContent;
        SharedComponents.showToast(`配置 ${serviceName} 集成`, 'info');
        
        // 这里可以打开配置对话框
        setTimeout(() => {
            const statusElement = serviceElement.querySelector('.service-status');
            statusElement.textContent = '已连接';
            statusElement.className = 'service-status connected';
            SharedComponents.showToast(`${serviceName} 配置成功`, 'success');
        }, 2000);
    }

    reconfigureIntegration(serviceElement) {
        const serviceName = serviceElement.querySelector('h4').textContent;
        SharedComponents.showToast(`重新配置 ${serviceName}`, 'info');
        
        // 这里可以打开重新配置对话框
    }

    disconnectIntegration(serviceElement) {
        const serviceName = serviceElement.querySelector('h4').textContent;
        
        SharedComponents.showConfirm(
            '断开连接',
            `确定要断开与 ${serviceName} 的连接吗？`,
            () => {
                const statusElement = serviceElement.querySelector('.service-status');
                statusElement.textContent = '未连接';
                statusElement.className = 'service-status disconnected';
                SharedComponents.showToast(`已断开与 ${serviceName} 的连接`, 'success');
            }
        );
    }

    performBackup() {
        SharedComponents.showToast('正在执行数据备份...', 'info');
        
        setTimeout(() => {
            // 模拟添加新的备份记录
            const backupList = document.querySelector('.backup-list');
            const today = new Date();
            const backupName = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}-backup.sql`;
            const backupSize = `${(Math.random() * 50 + 100).toFixed(1)} MB`;
            
            const newBackupItem = document.createElement('div');
            newBackupItem.className = 'backup-item';
            newBackupItem.innerHTML = `
                <div class="backup-info">
                    <div class="backup-name">${backupName}</div>
                    <div class="backup-size">${backupSize}</div>
                </div>
                <div class="backup-date">${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')} ${String(today.getHours()).padStart(2, '0')}:${String(today.getMinutes()).padStart(2, '0')}</div>
                <div class="backup-actions">
                    <button class="btn">下载</button>
                    <button class="btn">恢复</button>
                    <button class="btn btn-danger">删除</button>
                </div>
            `;
            
            // 绑定新备份项的事件
            newBackupItem.querySelectorAll('.backup-actions .btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    if (btn.textContent.includes('下载')) {
                        this.downloadBackup(backupName);
                    } else if (btn.textContent.includes('恢复')) {
                        this.restoreBackup(backupName);
                    } else if (btn.textContent.includes('删除')) {
                        this.deleteBackup(backupName, newBackupItem);
                    }
                });
            });
            
            backupList.insertBefore(newBackupItem, backupList.firstChild);
            SharedComponents.showToast('数据备份完成', 'success');
        }, 3000);
    }

    downloadBackup(backupName) {
        SharedComponents.showToast(`正在下载 ${backupName}...`, 'info');
        
        setTimeout(() => {
            SharedComponents.showToast('备份文件下载完成', 'success');
        }, 2000);
    }

    restoreBackup(backupName) {
        SharedComponents.showConfirm(
            '恢复备份',
            `确定要从备份文件 ${backupName} 恢复数据吗？当前数据将被覆盖。`,
            () => {
                SharedComponents.showToast(`正在从 ${backupName} 恢复数据...`, 'info');
                
                setTimeout(() => {
                    SharedComponents.showToast('数据恢复完成', 'success');
                }, 5000);
            }
        );
    }

    deleteBackup(backupName, backupItem) {
        SharedComponents.showConfirm(
            '删除备份',
            `确定要删除备份文件 ${backupName} 吗？此操作不可恢复。`,
            () => {
                backupItem.style.transition = 'all 0.3s ease';
                backupItem.style.opacity = '0';
                backupItem.style.transform = 'translateX(-100%)';
                
                setTimeout(() => {
                    backupItem.remove();
                    SharedComponents.showToast('备份文件已删除', 'success');
                }, 300);
            }
        );
    }

    markTabAsModified() {
        const currentNavItem = document.querySelector(`[data-tab="${this.currentTab}"]`);
        if (!currentNavItem.classList.contains('modified')) {
            currentNavItem.classList.add('modified');
        }
    }

    removeTabModified() {
        const currentNavItem = document.querySelector(`[data-tab="${this.currentTab}"]`);
        currentNavItem.classList.remove('modified');
    }

    // 获取所有设置数据
    getAllSettings() {
        return this.settings;
    }

    // 应用设置数据
    applySettings(settings) {
        this.settings = { ...this.settings, ...settings };
        // 这里可以将设置应用到界面
    }
}

// 初始化页面
const settingsPage = new SettingsPage();

// 页面卸载时检查未保存的更改
window.addEventListener('beforeunload', (e) => {
    const modifiedTabs = document.querySelectorAll('.nav-item.modified');
    if (modifiedTabs.length > 0) {
        e.preventDefault();
        e.returnValue = '您有未保存的设置更改，确定要离开吗？';
    }
});