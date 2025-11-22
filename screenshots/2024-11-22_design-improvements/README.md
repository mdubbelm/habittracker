# Screenshots - Design Improvements
**Date**: 22 November 2024
**Version**: Post-design improvements
**Related Issues**: #15 (Design Improvements), #16 (Testing), #17 (Contrast fix)

---

## 📸 Screenshot List

### Before/After Comparisons

| # | Filename | Description | Status |
|---|----------|-------------|--------|
| 01 | `quick-stats-2x2-grid.png` | New 2×2 grid layout with partial progress | ⏳ Pending |
| 02 | `quick-stats-filled.png` | Quick stats with sample data | ⏳ Pending |
| 03 | `water-glasses-empty.png` | Water intake at 0 glasses | ⏳ Pending |
| 04 | `water-glasses-5.png` | Water intake at 5 glasses | ⏳ Pending |
| 05 | `water-glasses-full.png` | Water intake at 8 glasses (full) | ⏳ Pending |
| 06 | `alcohol-pills-2column.png` | New 2-column alcohol selector | ⏳ Pending |
| 07 | `alcohol-selected.png` | Alcohol pill selected (active state) | ⏳ Pending |
| 08 | `gradient-headers.png` | Card headers with gradient backgrounds | ⏳ Pending |
| 09 | `health-score-compact.png` | Compact 140px health score | ⏳ Pending |
| 10 | `full-page.png` | Complete page overview | ⏳ Pending |

---

## 🎨 Design Changes Captured

### Quick Stats
- ✅ 2×2 grid (was 3×1)
- ✅ Partial circular progress indicators
- ✅ 4th card added (Rugpijn/Pain)
- ✅ Water card with FIXED green gradient (#7A8B6E - WCAG compliant!)
- ✅ Bigger numbers (2rem)

### Water Intake
- ✅ 8 visual glass indicators
- ✅ Fill/unfill animations
- ✅ 64×64px +/- buttons

### Alcohol Selector
- ✅ 2-column grid (was 3-column)
- ✅ Larger pills (100px min-height)
- ✅ Bigger icons (2.5rem)

### Health Score
- ✅ Compact size (140px, was 200px)
- ✅ Less dominant in layout

### Gradient Accents
- ✅ Terracotta gradient (Slaap & Welzijn)
- ✅ FIXED Sage green gradient (Hydratatie - now WCAG AA compliant!)

### Typography & Spacing
- ✅ Larger headings
- ✅ Better spacing
- ✅ More breathing room

---

## 📱 Capture Settings

**Device**: iPhone 13 (390×844px)
**Browser**: Safari
**URL**: http://localhost:3000/src/index.html
**Test Data**: Use `window.addTestData()` for consistent screenshots

---

## ⚠️ Note

Screenshots are **PENDING** manual capture. Need to:
1. Start local server
2. Open in browser / iPhone simulator
3. Fill in test data
4. Capture each state
5. Save to this directory

**Alternative**: Use Playwright screenshot script when test infrastructure is setup.

---

**Status**: ⏳ Manual capture pending
**Assigned**: @MobileQA
