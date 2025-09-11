#!/bin/bash

# 需要更新的页面列表
pages=(
    "personnel.html"
    "devices.html"
    "site1.html"
    "menus.html"
    "roles.html"
    "logs.html"
    "system-management.html"
    "rule-engine.html"
    "devices-3d.html"
    "device-control.html"
    "cabinet-detail.html"
    "alarm-management.html"
)

for page in "${pages[@]}"; do
    echo "Updating $page..."
    
    # 1. 替换 user-menu onclick
    sed -i '' 's/onclick="logout()"/onclick="toggleUserDropdown(event)"/g' "$page"
    
    # 2. 在 user-menu 的 span 后面添加下拉菜单HTML
    sed -i '' '/<span class="user-name" id="userName">.*<\/span>/a\
                <div class="user-dropdown" id="userDropdown">\
                    <a href="account-settings.html" class="dropdown-item">\
                        <i class="fas fa-user-cog"></i>\
                        <span>账号设置</span>\
                    </a>\
                    <div class="dropdown-divider"></div>\
                    <a href="#" class="dropdown-item" onclick="confirmLogout(event)">\
                        <i class="fas fa-sign-out-alt"></i>\
                        <span>退出登录</span>\
                    </a>\
                </div>' "$page"
    
    echo "Updated $page"
done

echo "All pages updated successfully!"