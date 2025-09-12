#!/bin/bash
# 恢复到今天13:22的版本

echo "恢复到今天13:22的版本..."
echo "这将撤销13:22之后的所有修改"
echo "⚠️  警告：这会撤销较多修改，包括17:44对user-settings-chrome.html的修改"
read -p "是否继续？(y/n): " confirm

if [ "$confirm" = "y" ]; then
    # 1. 先备份当前状态
    backup_dir="backups/before_restore_to_1322_$(date +%Y%m%d_%H%M%S)"
    mkdir -p "$backup_dir"
    
    echo "备份当前文件..."
    cp index.html "$backup_dir/index.html" 2>/dev/null
    cp user-settings-chrome.html "$backup_dir/user-settings-chrome.html" 2>/dev/null
    cp fix-market-chart.js "$backup_dir/fix-market-chart.js" 2>/dev/null
    cp map-fix-comprehensive.js "$backup_dir/map-fix-comprehensive.js" 2>/dev/null
    cp profit-chart-fix.js "$backup_dir/profit-chart-fix.js" 2>/dev/null
    
    # 2. 使用Git恢复到13:22之前的状态
    echo "恢复文件..."
    
    # 恢复index.html到Git版本（撤销所有今天的修改）
    git checkout -- index.html 2>/dev/null || echo "⚠️  无法从Git恢复index.html"
    
    # 恢复user-settings-chrome.html
    git checkout -- user-settings-chrome.html 2>/dev/null || echo "⚠️  无法从Git恢复user-settings-chrome.html"
    
    # 3. 删除13:22之后创建的所有文件
    echo "删除13:22之后创建的文件..."
    rm -f fix-market-chart.js
    rm -f map-fix-comprehensive.js
    rm -f restore-to-git.sh
    rm -f restore-from-backups.sh
    rm -f undo-today-changes.sh
    rm -f restore-to-1744.sh
    
    # 4. 如果profit-chart-fix.js是今天创建的，也删除它
    if [ -f "profit-chart-fix.js" ]; then
        # 检查文件创建时间，如果是今天创建的就删除
        if [[ $(find profit-chart-fix.js -newermt "2025-07-07 00:00" -print) ]]; then
            rm -f profit-chart-fix.js
            echo "✓ 删除了profit-chart-fix.js（今天创建的）"
        fi
    fi
    
    echo ""
    echo "✅ 恢复到13:22完成！"
    echo "备份保存在: $backup_dir"
    echo ""
    echo "已恢复的文件："
    echo "- index.html (恢复到Git版本)"
    echo "- user-settings-chrome.html (恢复到Git版本)"
    echo "- 删除了所有修复脚本"
else
    echo "取消恢复操作。"
fi