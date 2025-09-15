#!/bin/bash

# 触摸屏页面批量打开脚本
# 用于在浏览器中打开所有页面，方便手动截图

echo "🚀 正在打开所有触摸屏页面..."

# 定义基础路径
BASE_PATH="/Users/xuexinhai/Desktop/003/touchscreen"

# 页面列表
pages=(
    "login.html"
    "login-loading.html"
    "home.html"
    "data.html"
    "control.html"
    "alarm.html"
    "history.html"
    "logs.html"
    "settings.html"
    "touchscreen-display.html"
)

# 打开每个页面
for page in "${pages[@]}"; do
    echo "打开页面: $page"
    open "file://$BASE_PATH/$page"
    # 等待一秒，避免同时打开太多标签页
    sleep 1
done

echo "✅ 所有页面已打开！"
echo ""
echo "📌 截图提示："
echo "1. 使用 Chrome DevTools: Cmd+Shift+P → 'Capture full size screenshot'"
echo "2. 使用 Safari: 开发 → 显示网页检查器 → 元素 → 右键 html → 捕获截屏"
echo "3. 使用 Firefox: F12 → 相机图标 → Save full page"
echo ""
echo "📁 保存位置: $BASE_PATH/touchscreen-design-slices/"