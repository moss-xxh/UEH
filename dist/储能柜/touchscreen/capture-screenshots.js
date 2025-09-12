/**
 * 触摸屏页面自动截图脚本
 * 使用 Puppeteer 自动捕获所有页面的截图
 * 
 * 安装依赖：
 * npm install puppeteer
 * 
 * 运行：
 * node capture-screenshots.js
 */

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

// 页面配置
const pages = [
    { name: 'login', url: 'login.html', folder: '01-login' },
    { name: 'login-loading', url: 'login-loading.html', folder: '01-login' },
    { name: 'home', url: 'home.html', folder: '02-home' },
    { name: 'data', url: 'data.html', folder: '03-data' },
    { name: 'control', url: 'control.html', folder: '04-control' },
    { name: 'alarm', url: 'alarm.html', folder: '05-alarm' },
    { name: 'history', url: 'history.html', folder: '06-history' },
    { name: 'logs', url: 'logs.html', folder: '07-logs' },
    { name: 'settings', url: 'settings.html', folder: '08-settings' },
    { name: 'touchscreen-display', url: 'touchscreen-display.html', folder: '02-home' }
];

// 需要截图的特殊状态
const specialStates = [
    {
        page: 'data',
        states: [
            { name: 'data-realtime', action: async (page) => { /* 默认状态 */ } },
            { name: 'data-history', action: async (page) => {
                await page.click('.sub-tab:nth-child(2)'); // 点击历史数据标签
                await page.waitForTimeout(500);
            }},
            { name: 'data-settings', action: async (page) => {
                await page.click('.data-settings-btn');
                await page.waitForTimeout(500);
            }}
        ]
    },
    {
        page: 'alarm',
        states: [
            { name: 'alarm-list', action: async (page) => { /* 默认状态 */ } },
            { name: 'alarm-detail', action: async (page) => {
                await page.click('.detail-btn:first-child');
                await page.waitForTimeout(500);
            }}
        ]
    },
    {
        page: 'control',
        states: [
            { name: 'control-manual', action: async (page) => { /* 默认状态 */ } },
            { name: 'control-auto', action: async (page) => {
                await page.click('[onclick*="auto"]');
                await page.waitForTimeout(500);
            }}
        ]
    }
];

async function captureScreenshots() {
    console.log('🚀 开始截图...');
    
    // 启动浏览器
    const browser = await puppeteer.launch({
        headless: false, // 设置为 true 可以在后台运行
        defaultViewport: {
            width: 1920,
            height: 1080
        }
    });

    try {
        // 为每个页面截图
        for (const pageConfig of pages) {
            console.log(`\n📸 正在截图: ${pageConfig.name}`);
            
            const page = await browser.newPage();
            
            // 设置视口大小（触摸屏标准尺寸）
            await page.setViewport({
                width: 1920,
                height: 1080
            });

            // 构建完整URL
            const url = `file://${path.join(__dirname, pageConfig.url)}`;
            console.log(`   访问: ${url}`);
            
            // 导航到页面
            await page.goto(url, {
                waitUntil: 'networkidle2',
                timeout: 30000
            });

            // 等待页面完全加载
            await page.waitForTimeout(2000);

            // 确保输出文件夹存在
            const outputFolder = path.join(__dirname, 'touchscreen-design-slices', pageConfig.folder);
            if (!fs.existsSync(outputFolder)) {
                fs.mkdirSync(outputFolder, { recursive: true });
            }

            // 截图主页面
            const screenshotPath = path.join(outputFolder, `${pageConfig.name}-full.png`);
            await page.screenshot({
                path: screenshotPath,
                fullPage: true
            });
            console.log(`   ✅ 已保存: ${screenshotPath}`);

            // 检查是否有特殊状态需要截图
            const specialState = specialStates.find(s => s.page === pageConfig.name);
            if (specialState) {
                for (const state of specialState.states) {
                    console.log(`   📸 截图状态: ${state.name}`);
                    
                    // 刷新页面到初始状态
                    await page.reload({ waitUntil: 'networkidle2' });
                    await page.waitForTimeout(1000);
                    
                    // 执行状态动作
                    await state.action(page);
                    
                    // 截图
                    const statePath = path.join(outputFolder, `${state.name}.png`);
                    await page.screenshot({
                        path: statePath,
                        fullPage: true
                    });
                    console.log(`   ✅ 已保存: ${statePath}`);
                }
            }

            await page.close();
        }

        // 截图一些通用组件
        console.log('\n📸 截图通用组件...');
        const page = await browser.newPage();
        await page.setViewport({ width: 1920, height: 1080 });
        
        // 组件文件夹
        const componentsFolder = path.join(__dirname, 'touchscreen-design-slices', '09-components');
        if (!fs.existsSync(componentsFolder)) {
            fs.mkdirSync(componentsFolder, { recursive: true });
        }

        // 截图导航栏（从首页）
        await page.goto(`file://${path.join(__dirname, 'home.html')}`, {
            waitUntil: 'networkidle2'
        });
        await page.waitForTimeout(2000);
        
        // 截图顶部导航
        const navbar = await page.$('.navbar');
        if (navbar) {
            await navbar.screenshot({
                path: path.join(componentsFolder, 'navbar.png')
            });
            console.log('   ✅ 导航栏截图完成');
        }

        // 截图语言切换器
        await page.click('.lang-switcher');
        await page.waitForTimeout(500);
        const langDropdown = await page.$('#langDropdown');
        if (langDropdown) {
            await langDropdown.screenshot({
                path: path.join(componentsFolder, 'language-switcher.png')
            });
            console.log('   ✅ 语言切换器截图完成');
        }

        await page.close();

        console.log('\n✨ 所有截图完成！');
        console.log('📁 截图保存在: touchscreen-design-slices/ 文件夹');

    } catch (error) {
        console.error('❌ 截图出错:', error);
    } finally {
        await browser.close();
    }
}

// 运行截图
captureScreenshots();