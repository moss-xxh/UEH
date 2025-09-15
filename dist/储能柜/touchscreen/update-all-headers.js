// 批量更新所有页面的头部脚本

const fs = require('fs');
const path = require('path');

// 需要更新的页面列表
const pagesToUpdate = [
    'control.html',
    'alarm.html',
    'alarms.html',  // 如果这是告警页面的话
    'logs.html',
    'settings.html'
];

// 新的头部HTML
const newHeaderRight = `        <div class="header-right">
            <div class="header-time" id="currentTime">2024-01-31 14:30:00</div>
            
            <!-- 语言切换按钮 -->
            <div class="lang-switcher">
                <button class="lang-btn" onclick="toggleLanguageDropdown(event)">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="2" y1="12" x2="22" y2="12"></line>
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                    </svg>
                </button>
                <div class="lang-dropdown" id="langDropdown">
                    <div class="lang-option" onclick="changeLanguage('zh', event)">
                        <span class="flag">🇨🇳</span>
                        <span>中文</span>
                    </div>
                    <div class="lang-option" onclick="changeLanguage('en', event)">
                        <span class="flag">🇺🇸</span>
                        <span>English</span>
                    </div>
                </div>
            </div>
            
            <!-- 退出按钮 -->
            <div class="logout-wrapper">
                <button class="logout-btn" onclick="logout()">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                </button>
            </div>
        </div>`;

// 更新单个文件
function updateFile(filename) {
    const filePath = path.join(__dirname, filename);
    
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // 1. 添加CSS引用（如果没有的话）
        if (!content.includes('common-header-styles.css')) {
            content = content.replace(
                '</title>',
                '</title>\n    <link rel="stylesheet" href="common-header-styles.css">'
            );
        }
        
        // 2. 替换header-right内容
        // 使用正则表达式匹配header-right div及其内容
        const headerRightRegex = /<div class="header-right">[\s\S]*?<\/div>\s*<\/header>/;
        if (headerRightRegex.test(content)) {
            content = content.replace(headerRightRegex, newHeaderRight + '\n    </header>');
        }
        
        // 3. 在</body>之前添加脚本引用（如果没有的话）
        if (!content.includes('common-header-scripts.js')) {
            content = content.replace(
                '</body>',
                '    <script src="common-header-scripts.js"></script>\n</body>'
            );
        }
        
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ 更新成功: ${filename}`);
        
    } catch (error) {
        console.error(`❌ 更新失败 ${filename}:`, error.message);
    }
}

// 执行更新
console.log('开始批量更新页面头部...\n');
pagesToUpdate.forEach(updateFile);
console.log('\n更新完成！');

// 使用方法：
// 1. 确保 Node.js 已安装
// 2. 在终端运行: node update-all-headers.js