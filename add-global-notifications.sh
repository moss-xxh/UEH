#!/bin/bash

# 要更新的主要页面列表
pages=(
    "index.html"
    "profit-new.html"
    "family-new.html"
    "settings.html"
    "message-center.html"
    "operation-log-page.html"
    "push-strategy-page.html"
    "user-settings.html"
    "organization-new.html"
    "analysis-historical.html"
)

# 要插入的脚本标签
script_tag='    <script src="components/global-notifications.js"></script>'

# 遍历每个页面
for page in "${pages[@]}"; do
    if [ -f "$page" ]; then
        echo "Processing $page..."
        
        # 检查是否已经包含了global-notifications.js
        if grep -q "global-notifications.js" "$page"; then
            echo "  ✓ Already contains global-notifications.js, skipping..."
        else
            # 在</body>标签前插入脚本标签
            sed -i.bak "s|</body>|${script_tag}\n</body>|" "$page"
            echo "  ✓ Added global-notifications.js"
        fi
    else
        echo "  ✗ File not found: $page"
    fi
done

echo "Done! Global notifications component has been added to all main pages."