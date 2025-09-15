#!/bin/bash

# Backup script for UEH project files
# Usage: ./backup-script.sh

# Set the directory
DIR="/Users/xuexinhai/Desktop/UEH"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)

# Create backups directory if it doesn't exist
mkdir -p "$DIR/backups"

# Files to backup
FILES=(
    "analysis-historical.html"
    "analysis-today.html"
    "index.html"
    "realtime-decision.html"
)

echo "Creating backups with timestamp: $TIMESTAMP"
echo "================================"

# Backup each file
for file in "${FILES[@]}"; do
    if [ -f "$DIR/$file" ]; then
        cp "$DIR/$file" "$DIR/backups/${file%.html}-backup-$TIMESTAMP.html"
        echo "✓ Backed up: $file"
    else
        echo "✗ File not found: $file"
    fi
done

echo "================================"
echo "Backups created in: $DIR/backups/"

# Show recent backups
echo ""
echo "Recent backups:"
ls -lt "$DIR/backups/" | head -10