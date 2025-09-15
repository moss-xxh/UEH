#!/bin/bash

# List of HTML files to process
files="home.html data.html control.html alarm.html history.html logs.html settings.html"

echo "Removing exit popup JavaScript functions from all pages..."

for file in $files; do
    if [ -f "$file" ]; then
        echo "Processing $file..."
        
        # Remove logout() function
        sed -i '' '/function logout()/,/^[[:space:]]*}[[:space:]]*$/d' "$file"
        
        # Remove closeLogoutModal() function
        sed -i '' '/function closeLogoutModal()/,/^[[:space:]]*}[[:space:]]*$/d' "$file"
        
        # Remove confirmLogout() function
        sed -i '' '/function confirmLogout()/,/^[[:space:]]*}[[:space:]]*$/d' "$file"
        
        # Remove any onclick handlers calling these functions
        sed -i '' 's/onclick="logout()"//g' "$file"
        sed -i '' 's/onclick="closeLogoutModal()"//g' "$file"
        sed -i '' 's/onclick="confirmLogout()"//g' "$file"
        
        echo "✓ Cleaned $file"
    fi
done

# Also clean common-header-scripts.js if it exists
if [ -f "common-header-scripts.js" ]; then
    echo "Processing common-header-scripts.js..."
    
    # Remove logout() function (lines 53-96)
    sed -i '' '53,96d' "common-header-scripts.js"
    
    # Remove confirmLogout() function (need to find its end)
    sed -i '' '/function confirmLogout()/,/window\.location\.href = "01-login\.html";/d' "common-header-scripts.js"
    
    echo "✓ Cleaned common-header-scripts.js"
fi

echo "JavaScript cleanup complete!"