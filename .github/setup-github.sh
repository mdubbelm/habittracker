#!/bin/bash

# Health Tracker - GitHub Setup Script
# Dit script richt de GitHub repository in met labels, milestones en issues

set -e

echo "🚀 Health Tracker - GitHub Setup"
echo "================================"
echo ""

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) is not installed"
    echo "Install it from: https://cli.github.com/"
    exit 1
fi

# Check if authenticated
if ! gh auth status &> /dev/null; then
    echo "❌ Not authenticated with GitHub"
    echo "Run: gh auth login"
    exit 1
fi

echo "✅ GitHub CLI is installed and authenticated"
echo ""

# Get repository info
REPO=$(gh repo view --json nameWithOwner -q .nameWithOwner 2>/dev/null || echo "")

if [ -z "$REPO" ]; then
    echo "⚠️  No GitHub repository found"
    echo "Would you like to create a new repository for habittracker? (y/n)"
    read -r response
    if [[ "$response" =~ ^[Yy]$ ]]; then
        echo "Creating repository..."
        gh repo create habittracker --private --source=. --remote=origin
        REPO=$(gh repo view --json nameWithOwner -q .nameWithOwner)
    else
        echo "Exiting..."
        exit 0
    fi
fi

echo "📦 Repository: $REPO"
echo ""

# Create labels
echo "🏷️  Creating labels..."
while IFS= read -r line; do
    # Parse JSON (simple approach - in production use jq)
    if echo "$line" | grep -q '"name"'; then
        NAME=$(echo "$line" | sed 's/.*"name": "\([^"]*\)".*/\1/')
        COLOR=$(echo "$line" | sed 's/.*"color": "\([^"]*\)".*/\1/' | head -1)
        DESC=$(echo "$line" | sed 's/.*"description": "\([^"]*\)".*/\1/' | tail -1)

        # Create or update label
        gh label create "$NAME" --color "$COLOR" --description "$DESC" --force 2>/dev/null || true
        echo "  ✓ $NAME"
    fi
done < <(cat .github/labels.json)

echo ""

# Create milestones
echo "🎯 Creating milestones..."
MILESTONES=(
    "Phase 0: Foundation & Setup|2024-12-06|Project infrastructure, development environment, and team setup"
    "Phase 1: MVP Release|2025-01-03|Production-ready version with PWA, health score, and statistics"
    "Phase 2: Enhancement & UX|2025-01-31|Enhanced UX with advanced visualizations and gamification"
    "Phase 3: Scale & Optimize|2025-02-28|Backend, cloud sync, and performance optimization"
    "Phase 4: Advanced Features|2025-04-30|AI capabilities and advanced health features"
    "v1.0.0 - Initial Release|2025-01-10|First public release"
)

for milestone_data in "${MILESTONES[@]}"; do
    IFS='|' read -r TITLE DUE DESC <<< "$milestone_data"
    gh api repos/$REPO/milestones -f title="$TITLE" -f description="$DESC" -f due_on="${DUE}T23:59:59Z" -f state="open" 2>/dev/null || true
    echo "  ✓ $TITLE"
done

echo ""
echo "✅ GitHub setup complete!"
echo ""
echo "Next steps:"
echo "  1. Review the created labels and milestones"
echo "  2. Run './github/create-phase0-issues.sh' to create initial issues"
echo "  3. Configure GitHub Projects for sprint planning"
echo ""
