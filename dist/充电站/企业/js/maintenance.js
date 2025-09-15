// 维护管理页面功能
class MaintenancePage {
    constructor() {
        this.maintenancePlans = [];
        this.maintenanceRecords = [];
        this.staff = [];
        this.urgentTasks = [];
        this.updateInterval = null;
        this.init();
    }

    init() {
        // 插入导航栏
        document.getElementById('header-container').innerHTML = SharedComponents.createHeader('maintenance');
        
        // 初始化通用功能
        SharedComponents.initCommonFeatures();
        
        // 初始化维护数据
        this.initMaintenanceData();
        
        // 渲染维护计划
        this.renderMaintenancePlans();
        
        // 绑定事件
        this.bindEvents();
        
        // 启动实时更新
        this.startRealTimeUpdates();
    }

    initMaintenanceData() {
        // 初始化维护计划数据
        this.maintenancePlans = [];
        const stations = [
            '北京朝阳站', '上海浦东站', '深圳南山站', '广州天河站', 
            '杭州西湖站', '成都高新站', '武汉光谷站', '南京江宁站'
        ];
        const maintenanceTypes = [
            '预防性维护', '故障修复', '升级改造', '应急维护', '定期检查'
        ];
        const staff = ['张工程师', '李技师', '王师傅', '赵工', '陈师傅'];
        const priorities = ['高', '中', '低'];
        const statuses = ['待执行', '进行中', '已完成', '已取消', '延期'];

        for (let i = 1; i <= 100; i++) {
            const station = stations[Math.floor(Math.random() * stations.length)];
            const deviceCode = this.generateDeviceCode(station);
            const maintenanceType = maintenanceTypes[Math.floor(Math.random() * maintenanceTypes.length)];
            const assignedStaff = staff[Math.floor(Math.random() * staff.length)];
            const priority = priorities[Math.floor(Math.random() * priorities.length)];
            const status = statuses[Math.floor(Math.random() * statuses.length)];
            const plannedDate = this.getRandomFutureDate(30);
            
            this.maintenancePlans.push({
                id: i,
                planNo: `PLAN-2024-${String(i).padStart(4, '0')}`,
                deviceCode: deviceCode,
                deviceName: `${deviceCode.startsWith('DC') ? '快充' : '慢充'}桩`,
                station: station,
                maintenanceType: maintenanceType,
                plannedDate: plannedDate,
                assignedStaff: assignedStaff,
                estimatedDuration: this.getRandomDuration(),
                priority: priority,
                status: status,
                description: this.getMaintenanceDescription(maintenanceType),
                createdDate: this.getRandomPastDate(7),
                lastUpdated: new Date().toISOString()
            });
        }

        // 按计划时间排序
        this.maintenancePlans.sort((a, b) => new Date(a.plannedDate) - new Date(b.plannedDate));

        // 初始化紧急维护任务
        this.urgentTasks = [
            {
                id: 1,
                device: 'DC-SZ-045',
                issue: '充电桩过温保护频繁触发',
                station: '深圳南山站',
                priority: 'high',
                reportTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2小时前
            },
            {
                id: 2,
                device: 'AC-BJ-089',
                issue: '通讯模块连接异常',
                station: '北京朝阳站',
                priority: 'medium',
                reportTime: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString() // 4小时前
            },
            {
                id: 3,
                device: 'DC-GZ-012',
                issue: '显示屏显示异常',
                station: '广州天河站',
                priority: 'low',
                reportTime: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString() // 6小时前
            }
        ];
    }

    generateDeviceCode(station) {
        const stationCodes = {
            '北京朝阳站': 'BJ',
            '上海浦东站': 'SH',
            '深圳南山站': 'SZ',
            '广州天河站': 'GZ',
            '杭州西湖站': 'HZ',
            '成都高新站': 'CD',
            '武汉光谷站': 'WH',
            '南京江宁站': 'NJ'
        };
        const typePrefix = Math.random() > 0.4 ? 'DC' : 'AC';
        const stationCode = stationCodes[station] || 'XX';
        const deviceNum = Math.floor(Math.random() * 100) + 1;
        return `${typePrefix}-${stationCode}-${String(deviceNum).padStart(3, '0')}`;
    }

    getRandomFutureDate(daysRange) {
        const date = new Date();
        date.setDate(date.getDate() + Math.floor(Math.random() * daysRange));
        date.setHours(Math.floor(Math.random() * 24));
        date.setMinutes(Math.floor(Math.random() * 60));
        return date.toISOString();
    }

    getRandomPastDate(daysRange) {
        const date = new Date();
        date.setDate(date.getDate() - Math.floor(Math.random() * daysRange));
        date.setHours(Math.floor(Math.random() * 24));
        date.setMinutes(Math.floor(Math.random() * 60));
        return date.toISOString();
    }

    getRandomDuration() {
        const durations = ['2小时', '4小时', '6小时', '8小时', '1天', '2天'];
        return durations[Math.floor(Math.random() * durations.length)];
    }

    getMaintenanceDescription(type) {
        const descriptions = {
            '预防性维护': '定期检查设备运行状态，清洁维护',
            '故障修复': '修复设备故障，恢复正常运行',
            '升级改造': '升级设备软硬件，提升性能',
            '应急维护': '紧急处理设备故障，确保安全',
            '定期检查': '按计划进行设备巡检'
        };
        return descriptions[type] || '维护设备';
    }

    renderMaintenancePlans() {
        const tbody = document.getElementById('maintenance-plan-body');
        if (!tbody) return;

        // 显示最近的30个计划
        const recentPlans = this.maintenancePlans.slice(0, 30);

        tbody.innerHTML = recentPlans.map(plan => `
            <tr data-plan-id="${plan.id}">
                <td>
                    <div class="plan-no">${plan.planNo}</div>
                </td>
                <td>
                    <div class="device-info">
                        <div class="device-code">${plan.deviceCode}</div>
                        <div class="device-name">${plan.deviceName}</div>
                        <div class="device-station">${plan.station}</div>
                    </div>
                </td>
                <td>
                    <span class="maintenance-type ${this.getMaintenanceTypeClass(plan.maintenanceType)}">
                        ${plan.maintenanceType}
                    </span>
                </td>
                <td>
                    <div class="planned-time">
                        <div class="planned-date">${SharedComponents.formatDateTime(plan.plannedDate).split(' ')[0]}</div>
                        <div class="planned-time-detail">${SharedComponents.formatDateTime(plan.plannedDate).split(' ')[1]}</div>
                    </div>
                </td>
                <td>
                    <div class="staff-info">
                        <div class="staff-name">${plan.assignedStaff}</div>
                    </div>
                </td>
                <td>${plan.estimatedDuration}</td>
                <td>
                    <span class="status ${plan.status === '待执行' ? 'pending' : plan.status === '进行中' ? 'in-progress' : plan.status === '已完成' ? 'completed' : 'cancelled'}">
                        ${plan.status}
                    </span>
                </td>
                <td>
                    <span class="priority ${plan.priority === '高' ? 'high' : plan.priority === '中' ? 'medium' : 'low'}">
                        ${plan.priority}
                    </span>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn" onclick="maintenancePage.viewPlan(${plan.id})" title="查看详情">👁️</button>
                        ${plan.status === '待执行' ? 
                            `<button class="action-btn" onclick="maintenancePage.startMaintenance(${plan.id})" title="开始维护">▶️</button>` :
                            ''
                        }
                        ${plan.status === '进行中' ? 
                            `<button class="action-btn" onclick="maintenancePage.completeMaintenance(${plan.id})" title="完成维护">✅</button>` :
                            ''
                        }
                        <button class="action-btn" onclick="maintenancePage.editPlan(${plan.id})" title="编辑">✏️</button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    getMaintenanceTypeClass(type) {
        const typeMap = {
            '预防性维护': 'preventive',
            '故障修复': 'corrective',
            '升级改造': 'upgrade',
            '应急维护': 'emergency',
            '定期检查': 'inspection'
        };
        return typeMap[type] || '';
    }

    bindEvents() {
        // 计划筛选
        const planningFilter = document.querySelector('.planning-filter');
        if (planningFilter) {
            planningFilter.addEventListener('change', (e) => {
                this.filterPlans(e.target.value);
            });
        }

        // 创建计划按钮
        const createPlanBtn = document.querySelector('.btn-primary');
        if (createPlanBtn) {
            createPlanBtn.addEventListener('click', () => {
                this.showCreatePlanModal();
            });
        }

        // 分析筛选
        const analysisFilter = document.querySelector('.analysis-filter');
        if (analysisFilter) {
            analysisFilter.addEventListener('change', (e) => {
                this.updateAnalysisData(e.target.value);
            });
        }

        // 人员管理按钮
        const staffButtons = document.querySelectorAll('.staff-controls .btn');
        staffButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (btn.textContent.includes('排班')) {
                    this.showStaffSchedule();
                } else if (btn.textContent.includes('添加')) {
                    this.showAddStaffModal();
                }
            });
        });

        // 紧急任务处理
        document.querySelectorAll('.urgent-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const urgentItem = e.target.closest('.urgent-item');
                this.handleUrgentTask(urgentItem);
            });
        });

        // 知识库搜索
        const knowledgeSearch = document.querySelector('.knowledge-search .search-box');
        if (knowledgeSearch) {
            knowledgeSearch.addEventListener('input', SharedComponents.debounce((e) => {
                this.searchKnowledge(e.target.value);
            }, 300));
        }
    }

    filterPlans(filterType) {
        console.log(`筛选计划: ${filterType}`);
        
        let filteredPlans = [...this.maintenancePlans];
        const now = new Date();
        
        switch (filterType) {
            case '今日计划':
                filteredPlans = this.maintenancePlans.filter(plan => {
                    const planDate = new Date(plan.plannedDate);
                    return planDate.toDateString() === now.toDateString();
                });
                break;
            case '本周计划':
                const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
                const weekEnd = new Date(weekStart);
                weekEnd.setDate(weekEnd.getDate() + 7);
                filteredPlans = this.maintenancePlans.filter(plan => {
                    const planDate = new Date(plan.plannedDate);
                    return planDate >= weekStart && planDate < weekEnd;
                });
                break;
            case '逾期计划':
                filteredPlans = this.maintenancePlans.filter(plan => {
                    const planDate = new Date(plan.plannedDate);
                    return planDate < now && plan.status === '待执行';
                });
                break;
        }
        
        // 重新渲染表格
        this.renderFilteredPlans(filteredPlans);
    }

    renderFilteredPlans(plans) {
        const tbody = document.getElementById('maintenance-plan-body');
        if (!tbody) return;

        tbody.innerHTML = plans.slice(0, 30).map(plan => `
            <tr data-plan-id="${plan.id}">
                <td><div class="plan-no">${plan.planNo}</div></td>
                <td>
                    <div class="device-info">
                        <div class="device-code">${plan.deviceCode}</div>
                        <div class="device-name">${plan.deviceName}</div>
                        <div class="device-station">${plan.station}</div>
                    </div>
                </td>
                <td>
                    <span class="maintenance-type ${this.getMaintenanceTypeClass(plan.maintenanceType)}">
                        ${plan.maintenanceType}
                    </span>
                </td>
                <td>
                    <div class="planned-time">
                        <div class="planned-date">${SharedComponents.formatDateTime(plan.plannedDate).split(' ')[0]}</div>
                        <div class="planned-time-detail">${SharedComponents.formatDateTime(plan.plannedDate).split(' ')[1]}</div>
                    </div>
                </td>
                <td><div class="staff-info"><div class="staff-name">${plan.assignedStaff}</div></div></td>
                <td>${plan.estimatedDuration}</td>
                <td>
                    <span class="status ${plan.status === '待执行' ? 'pending' : plan.status === '进行中' ? 'in-progress' : plan.status === '已完成' ? 'completed' : 'cancelled'}">
                        ${plan.status}
                    </span>
                </td>
                <td>
                    <span class="priority ${plan.priority === '高' ? 'high' : plan.priority === '中' ? 'medium' : 'low'}">
                        ${plan.priority}
                    </span>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn" onclick="maintenancePage.viewPlan(${plan.id})" title="查看详情">👁️</button>
                        ${plan.status === '待执行' ? 
                            `<button class="action-btn" onclick="maintenancePage.startMaintenance(${plan.id})" title="开始维护">▶️</button>` :
                            ''
                        }
                        ${plan.status === '进行中' ? 
                            `<button class="action-btn" onclick="maintenancePage.completeMaintenance(${plan.id})" title="完成维护">✅</button>` :
                            ''
                        }
                        <button class="action-btn" onclick="maintenancePage.editPlan(${plan.id})" title="编辑">✏️</button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    viewPlan(planId) {
        const plan = this.maintenancePlans.find(p => p.id === planId);
        if (!plan) return;

        const modal = document.createElement('div');
        modal.className = 'maintenance-plan-modal';
        modal.innerHTML = `
            <div class="modal-overlay" onclick="this.parentElement.remove()"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h3>维护计划详情 - ${plan.planNo}</h3>
                    <button class="modal-close" onclick="this.closest('.maintenance-plan-modal').remove()">×</button>
                </div>
                <div class="modal-body">
                    <div class="plan-detail-grid">
                        <div class="detail-section">
                            <h4>基本信息</h4>
                            <div class="detail-item">
                                <label>计划编号</label>
                                <span>${plan.planNo}</span>
                            </div>
                            <div class="detail-item">
                                <label>设备编号</label>
                                <span>${plan.deviceCode}</span>
                            </div>
                            <div class="detail-item">
                                <label>设备名称</label>
                                <span>${plan.deviceName}</span>
                            </div>
                            <div class="detail-item">
                                <label>所在站点</label>
                                <span>${plan.station}</span>
                            </div>
                        </div>
                        
                        <div class="detail-section">
                            <h4>维护信息</h4>
                            <div class="detail-item">
                                <label>维护类型</label>
                                <span class="maintenance-type ${this.getMaintenanceTypeClass(plan.maintenanceType)}">
                                    ${plan.maintenanceType}
                                </span>
                            </div>
                            <div class="detail-item">
                                <label>计划时间</label>
                                <span>${SharedComponents.formatDateTime(plan.plannedDate)}</span>
                            </div>
                            <div class="detail-item">
                                <label>预计时长</label>
                                <span>${plan.estimatedDuration}</span>
                            </div>
                            <div class="detail-item">
                                <label>维护描述</label>
                                <span>${plan.description}</span>
                            </div>
                        </div>

                        <div class="detail-section">
                            <h4>执行信息</h4>
                            <div class="detail-item">
                                <label>执行人员</label>
                                <span>${plan.assignedStaff}</span>
                            </div>
                            <div class="detail-item">
                                <label>优先级</label>
                                <span class="priority ${plan.priority === '高' ? 'high' : plan.priority === '中' ? 'medium' : 'low'}">
                                    ${plan.priority}
                                </span>
                            </div>
                            <div class="detail-item">
                                <label>当前状态</label>
                                <span class="status ${plan.status === '待执行' ? 'pending' : plan.status === '进行中' ? 'in-progress' : plan.status === '已完成' ? 'completed' : 'cancelled'}">
                                    ${plan.status}
                                </span>
                            </div>
                            <div class="detail-item">
                                <label>创建时间</label>
                                <span>${SharedComponents.formatDateTime(plan.createdDate)}</span>
                            </div>
                        </div>
                    </div>
                    <div class="modal-actions">
                        ${plan.status === '待执行' ? 
                            `<button class="btn btn-primary" onclick="maintenancePage.startMaintenance(${plan.id})">开始维护</button>` :
                            ''
                        }
                        ${plan.status === '进行中' ? 
                            `<button class="btn btn-success" onclick="maintenancePage.completeMaintenance(${plan.id})">完成维护</button>` :
                            ''
                        }
                        <button class="btn" onclick="maintenancePage.editPlan(${plan.id})">编辑计划</button>
                        <button class="btn" onclick="this.closest('.maintenance-plan-modal').remove()">关闭</button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    startMaintenance(planId) {
        const plan = this.maintenancePlans.find(p => p.id === planId);
        if (!plan) return;

        SharedComponents.showConfirm(
            '开始维护',
            `确定要开始执行维护计划 ${plan.planNo} 吗？`,
            () => {
                plan.status = '进行中';
                plan.lastUpdated = new Date().toISOString();
                this.renderMaintenancePlans();
                SharedComponents.showToast(`维护计划 ${plan.planNo} 已开始执行`, 'success');
                
                // 关闭详情模态框（如果存在）
                const modal = document.querySelector('.maintenance-plan-modal');
                if (modal) {
                    modal.remove();
                }
            }
        );
    }

    completeMaintenance(planId) {
        const plan = this.maintenancePlans.find(p => p.id === planId);
        if (!plan) return;

        SharedComponents.showConfirm(
            '完成维护',
            `确定维护计划 ${plan.planNo} 已完成吗？`,
            () => {
                plan.status = '已完成';
                plan.lastUpdated = new Date().toISOString();
                this.renderMaintenancePlans();
                SharedComponents.showToast(`维护计划 ${plan.planNo} 已完成`, 'success');
                
                // 关闭详情模态框（如果存在）
                const modal = document.querySelector('.maintenance-plan-modal');
                if (modal) {
                    modal.remove();
                }
                
                // 更新统计数据
                this.updateStatistics();
            }
        );
    }

    editPlan(planId) {
        const plan = this.maintenancePlans.find(p => p.id === planId);
        if (!plan) return;

        SharedComponents.showToast(`编辑维护计划 ${plan.planNo}`, 'info');
        // 这里可以添加编辑计划的表单逻辑
    }

    showCreatePlanModal() {
        SharedComponents.showToast('创建新的维护计划', 'info');
        // 这里可以添加创建计划的表单逻辑
    }

    showStaffSchedule() {
        SharedComponents.showToast('查看人员排班', 'info');
        // 这里可以添加人员排班的逻辑
    }

    showAddStaffModal() {
        SharedComponents.showToast('添加维护人员', 'info');
        // 这里可以添加添加人员的表单逻辑
    }

    handleUrgentTask(urgentItem) {
        const device = urgentItem.querySelector('.urgent-device').textContent;
        SharedComponents.showConfirm(
            '处理紧急任务',
            `确定要立即处理设备 ${device} 的紧急维护任务吗？`,
            () => {
                urgentItem.style.opacity = '0.5';
                SharedComponents.showToast(`正在处理设备 ${device} 的紧急任务`, 'info');
                
                setTimeout(() => {
                    urgentItem.remove();
                    this.updateUrgentCount();
                    SharedComponents.showToast('紧急任务处理完成', 'success');
                }, 2000);
            }
        );
    }

    updateUrgentCount() {
        const urgentCount = document.querySelector('.urgent-count');
        const remainingTasks = document.querySelectorAll('.urgent-item').length;
        if (urgentCount) {
            urgentCount.textContent = `${remainingTasks}个紧急任务`;
        }
    }

    searchKnowledge(query) {
        console.log(`搜索知识库: ${query}`);
        // 这里可以添加知识库搜索逻辑
    }

    updateAnalysisData(period) {
        console.log(`更新分析数据: ${period}`);
        // 这里可以添加分析数据更新逻辑
    }

    startRealTimeUpdates() {
        this.updateInterval = setInterval(() => {
            // 随机更新一些计划状态
            const inProgressPlans = this.maintenancePlans.filter(p => p.status === '进行中');
            inProgressPlans.forEach(plan => {
                if (Math.random() < 0.1) { // 10% 概率完成
                    plan.status = '已完成';
                    plan.lastUpdated = new Date().toISOString();
                }
            });

            // 随机生成新的紧急任务
            if (Math.random() < 0.05) { // 5% 概率生成新紧急任务
                this.generateNewUrgentTask();
            }

            this.renderMaintenancePlans();
            this.updateStatistics();
        }, 15000); // 每15秒更新一次
    }

    generateNewUrgentTask() {
        const devices = ['DC-HZ-056', 'AC-WH-023', 'DC-NJ-078'];
        const issues = ['电压异常', '接触器故障', '软件系统错误'];
        const stations = ['杭州西湖站', '武汉光谷站', '南京江宁站'];
        
        const newTask = {
            id: Date.now(),
            device: devices[Math.floor(Math.random() * devices.length)],
            issue: issues[Math.floor(Math.random() * issues.length)],
            station: stations[Math.floor(Math.random() * stations.length)],
            priority: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)],
            reportTime: new Date().toISOString()
        };

        // 添加到紧急任务列表
        const urgentList = document.querySelector('.urgent-list');
        if (urgentList) {
            const taskElement = document.createElement('div');
            taskElement.className = `urgent-item ${newTask.priority}`;
            taskElement.innerHTML = `
                <div class="urgent-priority">${newTask.priority === 'high' ? '高' : newTask.priority === 'medium' ? '中' : '低'}</div>
                <div class="urgent-info">
                    <div class="urgent-device">${newTask.device}</div>
                    <div class="urgent-issue">${newTask.issue}</div>
                    <div class="urgent-station">${newTask.station}</div>
                </div>
                <div class="urgent-time">刚刚</div>
                <div class="urgent-actions">
                    <button class="urgent-btn">立即处理</button>
                </div>
            `;
            
            // 绑定事件
            taskElement.querySelector('.urgent-btn').addEventListener('click', (e) => {
                this.handleUrgentTask(taskElement);
            });
            
            urgentList.insertBefore(taskElement, urgentList.firstChild);
            this.updateUrgentCount();
        }
    }

    updateStatistics() {
        const stats = {
            pending: this.maintenancePlans.filter(p => p.status === '待执行').length,
            inProgress: this.maintenancePlans.filter(p => p.status === '进行中').length,
            completed: this.maintenancePlans.filter(p => {
                const planDate = new Date(p.plannedDate);
                const currentMonth = new Date().getMonth();
                return p.status === '已完成' && planDate.getMonth() === currentMonth;
            }).length,
            successRate: 98.5 // 模拟数据
        };

        const statCards = document.querySelectorAll('.stat-value');
        if (statCards[0]) statCards[0].textContent = stats.pending.toLocaleString();
        if (statCards[1]) statCards[1].textContent = stats.inProgress.toLocaleString();
        if (statCards[2]) statCards[2].textContent = stats.completed.toLocaleString();
        if (statCards[3]) statCards[3].textContent = `${stats.successRate}%`;
    }

    destroy() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
    }
}

// 初始化页面
const maintenancePage = new MaintenancePage();

// 页面卸载时清理
window.addEventListener('beforeunload', () => {
    maintenancePage.destroy();
});