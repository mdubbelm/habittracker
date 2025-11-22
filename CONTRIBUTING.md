# Contributing to Health Tracker

Bedankt voor je interesse in het bijdragen aan Health Tracker! Dit document bevat richtlijnen om het contributeren gemakkelijk en effectief te maken.

---

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Pull Request Process](#pull-request-process)
- [Issue Guidelines](#issue-guidelines)

---

## Code of Conduct

Dit project houdt zich aan een Code of Conduct. Door deel te nemen, ga je akkoord met deze gedragscode:

- **Respectvol:** Behandel iedereen met respect
- **Inclusief:** Verwelkom diversiteit in bijdragen
- **Constructief:** Geef constructieve feedback
- **Professioneel:** Houd het professioneel en vriendelijk

---

## Getting Started

### 1. Fork & Clone

```bash
# Fork de repository op GitHub
# Clone je fork
git clone https://github.com/YOUR_USERNAME/habittracker.git
cd habittracker

# Voeg upstream toe
git remote add upstream https://github.com/mdubbelm/habittracker.git
```

### 2. Setup Development Environment

**Current (Phase 0):**
```bash
# Simpele HTTP server
python3 -m http.server 3000
```

**Future (Phase 1+):**
```bash
npm install
npm run dev
```

### 3. Create a Branch

```bash
# Sync met upstream
git fetch upstream
git checkout main
git merge upstream/main

# Create feature branch
git checkout -b feature/your-feature-name
# of
git checkout -b fix/your-bug-fix
```

**Branch naming:**
- `feature/` - Voor nieuwe features
- `fix/` - Voor bug fixes
- `refactor/` - Voor code refactoring
- `docs/` - Voor documentatie
- `test/` - Voor test toevoegingen

---

## Development Workflow

### 1. Make Changes

- **Focus:** Eén feature/fix per branch
- **Commits:** Maak kleine, logische commits
- **Testing:** Test je wijzigingen lokaal

### 2. Test iPhone 13 Compatibility

```bash
# Open preview
open dev-preview.html

# Of gebruik browser DevTools
# Chrome: F12 → Device toolbar → iPhone 13
```

### 3. Commit Changes

```bash
git add .
git commit -m "type: beschrijving van wijziging"
```

**Commit message format:**
```
type: korte beschrijving (max 50 chars)

Optionele uitgebreide beschrijving van de wijziging.
Leg uit WAAROM, niet WAT (code spreekt voor zich).

Closes #123
```

**Types:**
- `feat:` - Nieuwe feature
- `fix:` - Bug fix
- `refactor:` - Code refactoring
- `docs:` - Documentatie
- `test:` - Tests
- `style:` - Code formatting
- `perf:` - Performance improvement
- `chore:` - Build/tooling changes

**Voorbeelden:**
```
feat: add dark mode toggle to settings

fix: resolve health score calculation for edge case

docs: update mobile testing guide with screenshots

test: add unit tests for health score algorithm
```

### 4. Push & Create PR

```bash
# Push naar je fork
git push origin feature/your-feature-name

# Ga naar GitHub en create Pull Request
```

---

## Coding Standards

### JavaScript

#### Style Guide
```javascript
// Use const/let, never var
const healthScore = calculateScore(data);
let currentTab = 'tracker';

// Use arrow functions for callbacks
items.map(item => processItem(item));

// Use template literals
const message = `Your score is ${score}%`;

// Destructuring waar mogelijk
const { sleepScore, backPain } = data;

// Early returns
function validateInput(value) {
  if (!value) return false;
  if (value < 0) return false;
  return true;
}
```

#### Naming Conventions
```javascript
// camelCase voor variabelen en functies
const healthScore = 85;
function calculateScore() { }

// PascalCase voor classes
class StorageService { }

// UPPER_SNAKE_CASE voor constants
const MAX_HEALTH_SCORE = 100;
const DEFAULT_WATER_GLASSES = 8;

// Prefix boolean met is/has/can
const isVisible = true;
const hasData = false;
const canSave = true;
```

#### Comments
```javascript
// Good: Explain WHY, not WHAT
// Calculate score inverse for pain (lower is better)
const painScore = ((10 - backPain) / 10) * 15;

// Bad: Explaining obvious code
// Set sleep score to 8
const sleepScore = 8;

// JSDoc voor functions
/**
 * Calculate the daily health score
 * @param {Object} data - Daily tracking data
 * @returns {number} Health score (0-100)
 */
function calculateHealthScore(data) {
  // ...
}
```

### CSS

#### Organization
```css
/* 1. Variables */
:root {
  --color-primary: #6366F1;
}

/* 2. Reset/Base */
* {
  box-sizing: border-box;
}

/* 3. Layout */
.container { }

/* 4. Components */
.health-circle { }

/* 5. Utilities */
.mt-4 { }

/* 6. Media queries */
@media (min-width: 768px) { }
```

#### Naming (BEM-style)
```css
/* Block */
.health-score { }

/* Element */
.health-score__circle { }
.health-score__value { }

/* Modifier */
.health-score--excellent { }
.health-score--poor { }
```

#### Mobile-First
```css
/* Start with mobile */
.container {
  padding: 16px;
}

/* Then scale up */
@media (min-width: 768px) {
  .container {
    padding: 32px;
  }
}
```

### HTML

#### Semantic HTML
```html
<!-- Good -->
<header>
  <nav>
    <ul>
      <li><a href="#tracker">Tracker</a></li>
    </ul>
  </nav>
</header>

<main>
  <article>
    <h1>Health Score</h1>
    <section>...</section>
  </article>
</main>

<!-- Bad -->
<div class="header">
  <div class="nav">
    <div class="item">...</div>
  </div>
</div>
```

#### Accessibility
```html
<!-- Alt text voor images -->
<img src="icon.svg" alt="Health icon">

<!-- Labels voor inputs -->
<label for="sleep">Sleep Score</label>
<input id="sleep" type="range">

<!-- ARIA waar nodig -->
<button aria-label="Close modal">×</button>

<!-- Keyboard accessible -->
<div role="button" tabindex="0">Click me</div>
```

---

## Testing Guidelines

### Unit Tests (Vitest)

```javascript
// tests/unit/healthScore.test.js
import { describe, it, expect } from 'vitest';
import { calculateHealthScore } from '@/services/HealthScoreService';

describe('calculateHealthScore', () => {
  it('should return 100 for perfect health', () => {
    const perfectData = {
      sleepScore: 10,
      backPain: 0,
      waterIntake: 8,
      walked: true,
      dreamed: true,
      sugarConsumed: false,
      alcoholConsumed: false,
      caffeineConsumed: false,
      customHabits: {}
    };

    expect(calculateHealthScore(perfectData)).toBe(100);
  });

  it('should handle missing data gracefully', () => {
    const incompleteData = {
      sleepScore: 8
    };

    const score = calculateHealthScore(incompleteData);
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });
});
```

### E2E Tests (Playwright)

```javascript
// tests/e2e/tracking.spec.js
import { test, expect } from '@playwright/test';

test.describe('Health Tracking', () => {
  test('should save daily data', async ({ page }) => {
    await page.goto('/');

    // Fill in data
    await page.locator('#sleepScore').fill('9');
    await page.locator('#waterIntake').fill('8');

    // Save
    await page.click('button:has-text("Opslaan")');

    // Verify saved
    await expect(page.locator('.success-message')).toBeVisible();
  });
});
```

### Testing Checklist

- [ ] Unit tests voor nieuwe functies
- [ ] E2E tests voor nieuwe user flows
- [ ] iPhone 13 compatibility check
- [ ] Accessibility check (keyboard nav, screen reader)
- [ ] Performance check (no regressions)

---

## Pull Request Process

### Before Submitting

1. **Self Review:**
   - [ ] Code volgt coding standards
   - [ ] Geen console.log() statements
   - [ ] Geen commented-out code
   - [ ] Tests added en passing

2. **Testing:**
   - [ ] Lokaal getest
   - [ ] iPhone 13 preview checked
   - [ ] No console errors

3. **Documentation:**
   - [ ] README updated (indien nodig)
   - [ ] Comments toegevoegd
   - [ ] CHANGELOG entry (toekomstig)

### PR Template

```markdown
## Description
Korte beschrijving van de wijziging.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Related Issue
Closes #123

## Screenshots (indien applicable)
[Screenshot hier]

## Testing
- [ ] Unit tests pass
- [ ] E2E tests pass
- [ ] Manual testing done

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-reviewed code
- [ ] Commented complex code
- [ ] Documentation updated
- [ ] No new warnings
- [ ] Tests added
```

### Review Process

1. **Automated Checks:**
   - Linting passes
   - Tests pass
   - Build succeeds

2. **Code Review:**
   - Minimaal 1 approval nodig
   - Address feedback
   - Re-request review na changes

3. **Merge:**
   - Squash en merge (meestal)
   - Delete branch na merge

---

## Issue Guidelines

### Creating Issues

Gebruik een van de templates:
- **Bug Report** - Voor bugs
- **Feature Request** - Voor nieuwe features
- **Task** - Voor development tasks

### Good Issue Qualities

**Clear Title:**
```
❌ "App doesn't work"
✅ "Health score not updating when sleep slider changes"
```

**Reproducible Steps:**
```markdown
1. Open app on iPhone 13
2. Adjust sleep slider to 8
3. Observe health score circle
4. Expected: Score updates immediately
5. Actual: Score stays at 0%
```

**Context:**
- Device/browser info
- Screenshots
- Console errors
- Expected vs actual behavior

---

## Questions?

- **GitHub Discussions:** Voor algemene vragen
- **Issue Tracker:** Voor bugs en features
- **Team Members:** Zie [TEAM.md](./TEAM.md)

---

Bedankt voor je bijdrage! 🙏
