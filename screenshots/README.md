# 📸 Screenshots Archive

This folder contains screenshots of each version for documentation, blog posts, and presentations.

## Naming Convention

```
YYYY-MM-DD_version_view-name.png
```

**Examples:**
- `2025-11-22_v0.1.0-mvp_homepage.png`
- `2025-11-22_v0.1.0-mvp_tracker-view.png`
- `2025-11-22_commit-a1b2c3d_settings.png`

## Folder Structure

```
screenshots/
├── README.md (this file)
├── 2025-11-22_v0.1.0-mvp/
│   ├── homepage.png
│   ├── tracker-view.png
│   ├── stats-view.png
│   ├── settings-view.png
│   └── README.md (version notes)
└── archive/
    └── [older versions]
```

## Taking Screenshots

### Automated (Playwright)
```bash
# Install Playwright first (one-time)
npm install -D playwright

# Take screenshots
node scripts/capture-screenshots.js
```

### Manual (Mac)
```bash
# Run helper script
./scripts/take-screenshot.sh v0.1.0

# Or manually:
# 1. CMD + Shift + 4
# 2. Press Space
# 3. Click on browser window
# 4. Save to screenshots/[date]_[version]_[view].png
```

## Device Specs

**Target Device:** iPhone 13
- Width: 390px
- Height: 844px
- Device Pixel Ratio: 3x
- Viewport: 390×844 (without browser chrome)

## Screenshot Checklist

For each version, capture:
- [ ] Homepage (with health score circle)
- [ ] Tracker view (with form filled)
- [ ] Stats view (with data)
- [ ] History view
- [ ] Settings view
- [ ] Privacy notice (first-time user)

## Usage in Blog/Presentations

All screenshots can be freely used in:
- DEVLOG.md blog posts
- GitHub README
- Presentations
- Social media
- Documentation

**License:** Same as project (open source)

---

**Last Updated:** 22 November 2025
