#!/bin/bash

##
# Manual Screenshot Helper
# Usage: ./scripts/take-screenshot.sh [version]
##

VERSION=${1:-"manual"}
DATE=$(date +%Y-%m-%d_%H-%M-%S)
FOLDER="screenshots/${DATE}_${VERSION}"

echo "📸 Manual Screenshot Helper"
echo "============================"
echo ""
echo "Version: $VERSION"
echo "Date:    $DATE"
echo ""

# Create folder
mkdir -p "$FOLDER"

echo "✅ Created folder: $FOLDER"
echo ""
echo "📋 Screenshots to capture:"
echo "   1. Privacy Notice (first time only)"
echo "   2. Homepage / Tracker View"
echo "   3. Tracker Form (filled)"
echo "   4. Health Score (after save)"
echo "   5. Stats View"
echo "   6. History View"
echo "   7. Settings View"
echo ""
echo "📱 Instructions (Mac):"
echo "   1. Press: CMD + Shift + 4"
echo "   2. Press: Space"
echo "   3. Click on browser window"
echo "   4. Screenshot saved to Desktop"
echo "   5. Move to: $FOLDER/[name].png"
echo ""
echo "💡 Naming suggestion:"
echo "   - 01_privacy-notice.png"
echo "   - 02_homepage-tracker.png"
echo "   - 03_tracker-filled.png"
echo "   - 04_health-score-updated.png"
echo "   - 05_stats-view.png"
echo "   - 06_history-view.png"
echo "   - 07_settings-view.png"
echo ""

# Create template README
cat > "$FOLDER/README.md" << EOF
# Screenshots - $VERSION

**Date:** $DATE
**Commit:** $(git rev-parse --short HEAD 2>/dev/null || echo "N/A")

## Captured Views

- [ ] Privacy Notice (first-time user)
- [ ] Homepage / Tracker View (empty)
- [ ] Tracker Form (filled)
- [ ] Health Score (updated)
- [ ] Stats View
- [ ] History View
- [ ] Settings View

## Test Data Used

- Sleep Score:
- Back Pain:
- Water Intake:
- Walked:
- Dreamed:
- Consumption:

## Notes

[Add notes here]

---

*Created with scripts/take-screenshot.sh*
EOF

echo "✅ Template README created: $FOLDER/README.md"
echo ""
echo "🚀 Ready! Open http://localhost:8080/src/index.html and start capturing!"
echo ""
echo "📂 Save screenshots to: $FOLDER/"
echo ""
