# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Project Overview

**Health Tracker** is a modern, mobile-first Progressive Web App for tracking daily health metrics and habits. The app features a unique health score visualization with real-time feedback and is optimized for iPhone 13.

**Tech Stack:**
- Vanilla JavaScript (ES6+)
- HTML5 & CSS3
- localStorage for data persistence
- SVG for visualizations
- PWA capabilities (planned)

**Target Platform:** Mobile-first (iPhone 13: 390×844px), responsive design

---

## Workflow Vereisten

**🚨 KRITISCH - NIET OVERSLAAN 🚨**

Deze checklist MOET worden afgewerkt. Geen excuses.

---

### 📋 END-OF-SESSION CHECKLIST

Wanneer de gebruiker `/end-session` aanroept OF aangeeft klaar te zijn, doorloop deze checklist **VOORDAT** je afsluit:

#### 1. ⏱️ Time Tracking
```bash
# Check huidige sessie nummer
ls .time-tracking/
```
- [ ] Maak `.time-tracking/SESSION_XXX.md` (volgende nummer)
- [ ] Vul in: datum, geschatte tijd, wat is gedaan
- [ ] Update cumulative time

#### 2. 📖 Blog Post (blog/)
- [ ] Maak `blog/YYYY-MM-DD-[titel].md` (gebruik `blog/_template.md`)
- [ ] **Schrijf persoonlijk**, niet als changelog!
- [ ] Include: emoties, realisaties, learnings
- [ ] YAML frontmatter met stats en mood
- [ ] Update `blog/_index.md` tabel en stats

#### 3. 📊 GitHub Issues
```bash
gh issue list --state open
```
- [ ] Sluit afgeronde issues met comment
- [ ] Update open issues met voortgang
- [ ] Maak nieuwe issues voor ontdekte werk

#### 4. 💾 Session Status
- [ ] Update `.session-status.json` met:
  - sessionNumber
  - summary
  - filesModified
  - commits
  - nextSteps

#### 5. ✅ Final Commit
- [ ] Commit alle documentatie updates
- [ ] Push naar GitHub

---

### 🔄 Tijdens het werk
- **GitHub Issues**: Check relevante open issues (`gh issue list`)
- **Issues linken**: Verwijs naar issue nummers in commits (bijv. "fixes #26")
- **LEARNINGS.md**: Voeg learnings toe bij interessante problemen/oplossingen

### 🚀 Bij feature completion
- **GitHub Issue sluiten**: `gh issue close #XX --comment "Implemented in [commit]"`
- **Deploy check**: Verifieer Netlify deploy succesvol is

---

**⚠️ HERINNERING**: Als je deze checklist niet afwerkt, mist de gebruiker belangrijke documentatie en moet ze er later om vragen. Dat is vervelend. Doe het gewoon.

---

## Development Commands

### Setup & Installation
```bash
# Not yet implemented - currently single HTML file
# Future: npm install
```

### Development
```bash
# Local preview with iPhone 13 frame
open dev-preview.html

# Or serve with any HTTP server
python3 -m http.server 3000
# Then open: http://localhost:3000/habittracker.html
```

### Testing
```bash
# Unit tests (future)
npm test

# E2E tests with Playwright (future)
npm run test:e2e

# Run iPhone 13 tests specifically
npm run test:iphone

# Visual regression tests
npm run test:visual
```

### Code Quality
```bash
# Linting (future)
npm run lint

# Format code
npm run format

# Type checking (if TypeScript migration happens)
npm run type-check
```

### Build & Deploy
```bash
# Production build (future)
npm run build

# Preview production build
npm run preview
```

---

## High-Level Architecture

### Current State (Phase 0)
The app is currently a **single HTML file** (`habittracker.html`) containing:
- All HTML structure
- Inline CSS styles
- Inline JavaScript logic

**This is intentional** for rapid prototyping but will be refactored in Phase 0 (see ROADMAP.md).

### Target Architecture (Phase 1+)

```
habittracker/
├── src/
│   ├── components/          # UI components
│   │   ├── HealthScore/     # Circular progress + human figure
│   │   ├── TrackingForm/    # Daily data input forms
│   │   ├── Statistics/      # Charts and analytics
│   │   ├── CustomHabits/    # Custom habit management
│   │   └── Navigation/      # Bottom tab navigation
│   │
│   ├── services/            # Business logic layer
│   │   ├── StorageService.js    # localStorage abstraction
│   │   ├── HealthScoreService.js # Score calculation
│   │   ├── StatisticsService.js  # Analytics calculations
│   │   └── ExportService.js      # CSV export
│   │
│   ├── utils/               # Utility functions
│   │   ├── dateUtils.js     # Date formatting, time checks
│   │   ├── chartUtils.js    # Chart generation helpers
│   │   └── validators.js    # Input validation
│   │
│   ├── styles/              # CSS modules
│   │   ├── variables.css    # Design tokens
│   │   ├── components/      # Component styles
│   │   └── global.css       # Global styles
│   │
│   └── main.js              # Application entry point
│
├── tests/
│   ├── unit/                # Jest/Vitest unit tests
│   └── e2e/                 # Playwright E2E tests
│
├── public/                  # Static assets
│   ├── icons/               # PWA icons
│   └── manifest.json        # PWA manifest
│
└── docs/                    # Documentation
```

### Core Components

#### 1. Health Score Visualization
**Location:** Currently in main HTML, future: `src/components/HealthScore/`

**Purpose:** Displays user's daily health score (0-100%) in a circular progress indicator with human figure illustration.

**Key Logic:**
```javascript
function calculateHealthScore(data) {
  // Weight-based scoring:
  // - Sleep: 20 points (data.sleepScore / 10 * 20)
  // - Back pain: 15 points (inverse: (10 - data.backPain) / 10 * 15)
  // - Water: 15 points (Math.min(data.waterIntake / 8, 1) * 15)
  // - Walking: 10 points (boolean)
  // - Dreaming: 5 points (boolean)
  // - No sugar: 10 points (boolean)
  // - No alcohol: 10 points (boolean)
  // - Moderate caffeine: 10 points (≤2 cups)
  // - Custom habits: 5 points (completion %)
  // Total: 100 points
}
```

**Updates:** Real-time via event listeners on all input fields.

#### 2. Data Storage
**Location:** Currently inline, future: `src/services/StorageService.js`

**Storage Schema:**
```javascript
localStorage.trackerData = [
  {
    date: "2025-11-22",           // ISO date string
    sleepScore: 8,                // 0-10
    backPain: 3,                  // 0-10
    weight: 75.5,                 // kg (optional, time-gated)
    dreamed: true,                // boolean
    waterIntake: 8,               // glasses
    walked: true,                 // boolean
    sugarConsumed: false,         // boolean
    sugarAmount: 0,               // grams (if consumed)
    alcoholConsumed: false,       // boolean
    alcoholAmount: 0,             // glasses (if consumed)
    caffeineConsumed: true,       // boolean
    caffeineAmount: 2,            // cups (if consumed)
    customHabits: {               // object with habit IDs
      "habit-1": true,
      "habit-2": false
    }
  },
  // ... more entries
];

localStorage.customHabits = [
  {
    id: "habit-1",
    name: "Meditation",
    icon: "🧘"
  },
  // ... more habits
];
```

**Important:** All data stays local. No backend (yet). Privacy-first approach.

#### 3. Time-Based Visibility
**Key Feature:** Sections show/hide based on time of day.

**Logic:**
- **Sleep section:** Visible 18:00 - 12:00 (evening + morning)
- **Weight section:** Visible 05:00 - 11:00 (morning only)

**Implementation:**
```javascript
function isTimeInRange(startHour, endHour) {
  const now = new Date();
  const hour = now.getHours();

  if (startHour <= endHour) {
    return hour >= startHour && hour < endHour;
  } else {
    // Wraps around midnight
    return hour >= startHour || hour < endHour;
  }
}
```

#### 4. Statistics & Charts
**Location:** Currently inline, future: `src/components/Statistics/`

**Capabilities:**
- Adjustable time periods (7/14/30/90 days, all-time)
- Average calculations for all metrics
- Trend visualization (weight loss over time)
- Consumption frequency charts
- Custom habit completion percentages

**Chart Library:** Currently manual SVG, future: Consider Chart.js or D3.js (lightweight).

---

## Key Development Patterns

### 1. Mobile-First Design
**Always start with mobile (390×844px) and scale up.**

```css
/* Mobile first */
.container {
  padding: 16px;
}

/* Then desktop */
@media (min-width: 768px) {
  .container {
    padding: 32px;
  }
}
```

### 2. Safe Area Handling (iPhone Notch)
```css
:root {
  --safe-area-inset-top: env(safe-area-inset-top, 0px);
  --safe-area-inset-bottom: env(safe-area-inset-bottom, 0px);
}

header {
  padding-top: calc(20px + var(--safe-area-inset-top));
}
```

### 3. Touch-Friendly Interactions
- Minimum touch target: 44×44px
- No hover-dependent interactions
- Clear visual feedback on tap
- Swipe gestures where appropriate

### 4. Performance Optimization
- **Target:** < 2s initial load on 3G
- **60fps animations** (use CSS transforms, avoid layout thrashing)
- **Lazy load** images and non-critical components
- **Service Worker** for offline (Phase 1)

### 5. Data Validation
**Always validate user input:**
```javascript
function validateSleepScore(value) {
  const num = parseInt(value, 10);
  return !isNaN(num) && num >= 0 && num <= 10;
}
```

---

## Common Development Tasks

### Adding a New Tracking Metric

1. **Update HTML form** (in tracking section)
2. **Add to data schema** (localStorage structure)
3. **Update health score algorithm** (if it affects score)
4. **Add to statistics calculations**
5. **Update CSV export** (include new field)
6. **Write tests** for new metric

### Modifying Health Score Weights

**Location:** `calculateHealthScore()` function

**Process:**
1. Adjust point allocations (must total 100)
2. Update documentation in comments
3. Run tests to verify range (0-100)
4. Update user documentation

### Adding a Custom Chart

**Future location:** `src/components/Statistics/`

**Steps:**
1. Create chart component
2. Fetch required data from StorageService
3. Process data for visualization
4. Render using SVG or chart library
5. Make responsive (mobile + desktop)
6. Add to statistics view

---

## Testing Strategy

### Unit Tests
**Focus areas:**
- Health score calculations (all scenarios)
- Data validation functions
- Date/time utilities
- Storage service methods
- Statistics calculations

### E2E Tests
**Critical user flows:**
- Load app → See demo data
- Enter today's data → Save → Verify stored
- Navigate tabs → Check all views load
- Add custom habit → Use it → See in stats
- Export data → Verify CSV format

**Device coverage:**
- iPhone 13 (primary)
- Desktop Chrome
- iPad Pro (secondary)

### Visual Regression
- Health score circle rendering
- Chart visualizations
- Responsive layouts
- Dark mode (future)

---

## Design System

### Colors
```css
/* Primary Gradient */
--gradient-primary: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%);

/* Success */
--gradient-success: linear-gradient(135deg, #10B981 0%, #059669 100%);

/* Backgrounds */
--bg-main: #F8F9FE;
--bg-card: #FFFFFF;
--bg-input: #F8FAFC;

/* Text */
--text-primary: #1a1a1a;
--text-secondary: #64748B;
--text-tertiary: #94A3B8;

/* Borders */
--border-light: #E2E8F0;
--border-medium: #CBD5E1;
```

### Typography
- **Font:** System fonts (`-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto`)
- **Scale:** 12px, 14px, 16px, 18px, 24px, 32px, 48px
- **Weights:** 500 (normal), 600 (semibold), 700-800 (bold/headings)

### Spacing
- **Base unit:** 4px
- **Common values:** 8px, 12px, 16px, 20px, 24px, 32px, 48px

### Border Radius
- **Small:** 8px
- **Medium:** 12px
- **Large:** 16px
- **XLarge:** 20px
- **Circle:** 50%

---

## Browser Compatibility

**Target:** Modern browsers with localStorage + SVG support

**Minimum:**
- Safari 14+ (iOS)
- Chrome 90+
- Firefox 88+
- Edge 90+

**Features requiring polyfills:**
- None currently (using vanilla JS features widely supported)

**Progressive enhancement:**
- Service Worker (Phase 1) - Graceful fallback if unsupported

---

## Performance Budget

| Metric | Target | Critical |
|--------|--------|----------|
| Initial Load (3G) | < 2s | < 3s |
| Time to Interactive | < 3s | < 4s |
| First Contentful Paint | < 1s | < 1.5s |
| Largest Contentful Paint | < 2s | < 2.5s |
| Cumulative Layout Shift | < 0.1 | < 0.25 |
| JavaScript Bundle | < 50KB | < 100KB |
| CSS Bundle | < 20KB | < 30KB |

---

## Security Considerations

1. **XSS Prevention:** Always sanitize user input before rendering
2. **localStorage Security:** No sensitive data (passwords, tokens)
3. **CSP:** Implement Content Security Policy in Phase 1
4. **HTTPS Only:** Production must use HTTPS (for service worker)
5. **Dependencies:** Regular vulnerability scans

---

## Deployment

### Staging
- **URL:** TBD (Netlify preview)
- **Trigger:** Every PR
- **Purpose:** QA and stakeholder review

### Production
- **URL:** TBD
- **Trigger:** Merge to main
- **CDN:** Cloudflare or similar
- **Monitoring:** Error tracking (Sentry) + analytics (privacy-friendly)

---

## Troubleshooting

### App won't load
- Check console for errors
- Verify localStorage is enabled
- Clear localStorage: `localStorage.clear()`
- Hard refresh: Cmd+Shift+R

### Data not saving
- Check localStorage quota (5-10MB)
- Verify localStorage permissions
- Check for JSON parse errors

### Health score not updating
- Check event listeners attached
- Verify `updateHealthScorePreview()` is called
- Inspect data object in console

### Charts not rendering
- Check data format
- Verify date parsing
- Inspect SVG in DevTools

---

## Contributing

See `CONTRIBUTING.md` for:
- Code style guidelines
- Git workflow (feature branches)
- PR requirements
- Code review process

---

## Resources

- **Design Inspiration:** Fastic app
- **Roadmap:** See `ROADMAP.md`
- **Team Structure:** See `TEAM.md`
- **Mobile Testing:** See `.github/MOBILE_TESTING.md`
- **Issues:** See `.github/PHASE0_ISSUES.md`

---

**Last Updated:** November 2025
**Project Phase:** 0 (Foundation)
**Primary Developer:** @mdubbelm
