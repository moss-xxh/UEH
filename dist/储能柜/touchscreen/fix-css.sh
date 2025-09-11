#!/bin/bash

# Fix the CSS issues by adding missing closing braces
files="home.html data.html control.html alarm.html history.html logs.html settings.html"

for file in $files; do
    if [ -f "$file" ]; then
        echo "Fixing CSS in $file..."
        
        # Find lines with "transform: translateY(-2px);" that are missing closing braces
        # and add the missing brace on the next line
        sed -i '' '/transform: translateY(-2px);/{n;/^[[:space:]]*\..*{/i\
        }
        }' "$file"
        
        # Also check for other common patterns that might be missing braces
        sed -i '' '/box-shadow:.*rgba.*;$/{n;/^[[:space:]]*\./i\
        }
        }' "$file" 2>/dev/null || true
        
        echo "✓ Fixed $file"
    fi
done

echo "CSS fixes complete!"