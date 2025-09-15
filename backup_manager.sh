#!/bin/bash

# 代码备份和回滚管理器
# 使用方法:
# ./backup_manager.sh backup [description]  - 创建备份
# ./backup_manager.sh list                  - 列出所有备份
# ./backup_manager.sh restore <backup_id>   - 恢复到指定备份
# ./backup_manager.sh auto                  - 开启自动备份

BACKUP_DIR="./backups"
MAIN_FILES=("analysis-historical.html" "analysis-today.html" "index.html")

# 创建备份目录
mkdir -p "$BACKUP_DIR"

# 获取当前时间戳
get_timestamp() {
    date +"%Y%m%d_%H%M%S"
}

# 创建备份
create_backup() {
    local description="$1"
    local timestamp=$(get_timestamp)
    local backup_id="${timestamp}"
    local backup_path="${BACKUP_DIR}/${backup_id}"
    
    mkdir -p "$backup_path"
    
    echo "创建备份: $backup_id"
    echo "时间: $(date)"
    echo "描述: $description"
    
    # 备份主要文件
    for file in "${MAIN_FILES[@]}"; do
        if [ -f "$file" ]; then
            cp "$file" "$backup_path/"
            echo "已备份: $file"
        fi
    done
    
    # 创建备份信息文件
    cat > "$backup_path/backup_info.txt" << EOF
备份ID: $backup_id
创建时间: $(date)
描述: $description
文件列表:
$(ls -la "$backup_path" | grep -v backup_info.txt)
EOF
    
    echo "备份完成: $backup_path"
    echo "备份ID: $backup_id"
}

# 列出所有备份
list_backups() {
    echo "所有可用备份:"
    echo "格式: [备份ID] [时间] [描述]"
    echo "----------------------------------------"
    
    for backup in $(ls -t "$BACKUP_DIR" 2>/dev/null); do
        if [ -f "$BACKUP_DIR/$backup/backup_info.txt" ]; then
            local info_file="$BACKUP_DIR/$backup/backup_info.txt"
            local time=$(grep "创建时间:" "$info_file" | cut -d' ' -f2-)
            local desc=$(grep "描述:" "$info_file" | cut -d' ' -f2-)
            echo "[$backup] $time - $desc"
        fi
    done
}

# 恢复备份
restore_backup() {
    local backup_id="$1"
    local backup_path="${BACKUP_DIR}/${backup_id}"
    
    if [ ! -d "$backup_path" ]; then
        echo "错误: 备份 $backup_id 不存在"
        list_backups
        return 1
    fi
    
    echo "恢复备份: $backup_id"
    
    # 先创建当前状态的紧急备份
    create_backup "自动备份-恢复前状态"
    
    # 恢复文件
    for file in "${MAIN_FILES[@]}"; do
        if [ -f "$backup_path/$file" ]; then
            cp "$backup_path/$file" "./"
            echo "已恢复: $file"
        fi
    done
    
    echo "恢复完成!"
    cat "$backup_path/backup_info.txt"
}

# 自动备份(监控文件变化)
auto_backup() {
    echo "开启自动备份监控..."
    echo "监控文件: ${MAIN_FILES[*]}"
    echo "按 Ctrl+C 停止监控"
    
    # 初始备份
    create_backup "自动备份-监控开始"
    
    while true; do
        sleep 300  # 每5分钟检查一次
        
        local need_backup=false
        for file in "${MAIN_FILES[@]}"; do
            if [ -f "$file" ]; then
                # 检查文件是否在最近5分钟内被修改
                if [ $(find "$file" -mmin -5 | wc -l) -gt 0 ]; then
                    need_backup=true
                    break
                fi
            fi
        done
        
        if [ "$need_backup" = true ]; then
            create_backup "自动备份-$(date +%H:%M)"
        fi
    done
}

# 清理旧备份(保留最近20个)
cleanup_backups() {
    echo "清理旧备份..."
    local count=$(ls -1 "$BACKUP_DIR" 2>/dev/null | wc -l)
    if [ "$count" -gt 20 ]; then
        local to_delete=$((count - 20))
        ls -t "$BACKUP_DIR" | tail -n "$to_delete" | while read backup; do
            rm -rf "$BACKUP_DIR/$backup"
            echo "已删除旧备份: $backup"
        done
    fi
}

# 主函数
case "$1" in
    "backup")
        create_backup "$2"
        cleanup_backups
        ;;
    "list")
        list_backups
        ;;
    "restore")
        if [ -z "$2" ]; then
            echo "请指定备份ID"
            list_backups
        else
            restore_backup "$2"
        fi
        ;;
    "auto")
        auto_backup
        ;;
    "cleanup")
        cleanup_backups
        ;;
    *)
        echo "代码备份和回滚管理器"
        echo ""
        echo "使用方法:"
        echo "  $0 backup [描述]      - 创建备份"
        echo "  $0 list              - 列出所有备份"
        echo "  $0 restore <ID>      - 恢复到指定备份"
        echo "  $0 auto              - 开启自动备份(5分钟间隔)"
        echo "  $0 cleanup           - 清理旧备份"
        echo ""
        echo "示例:"
        echo "  $0 backup '修复图表显示问题'"
        echo "  $0 restore 20250703_160000"
        ;;
esac