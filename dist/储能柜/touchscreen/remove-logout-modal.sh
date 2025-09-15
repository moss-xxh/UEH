#!/bin/bash

# 删除退出弹窗相关的CSS样式
for file in home.html data.html control.html alarm.html history.html logs.html settings.html; do
    echo "Processing $file..."
    
    # 删除 .confirm-modal 到 .confirm-btn.secondary:hover 之间的所有CSS样式
    sed -i '' '/\.confirm-modal {/,/\.confirm-btn\.secondary:hover {/d' "$file"
    
    # 清理可能剩余的相关样式
    sed -i '' '/transform: translateY(-2px);/{N;/^[[:space:]]*}$/d;}' "$file"
done

echo "CSS styles removed successfully!"