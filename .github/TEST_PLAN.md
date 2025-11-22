# Test Plan - Design Improvements
**Issue**: #16
**Milestone**: Design Improvements Testing & QA
**Datum**: 22 November 2025
**Status**: In Progress

---

## 🎯 Test Scope

**Features to Test**:
1. Quick Stats - Partial circular progress (2×2 grid)
2. Water intake - Visual glass indicators
3. Alcohol selector - 2-column pills
4. Health score - Compact design
5. Gradient accents - Card headers
6. Spacing & typography - Overall hierarchy

**Out of Scope**:
- Existing MVP features (already tested)
- Future features (Stats view, History view)

---

## 🧪 Unit Tests

### Test Suite 1: `updateArcProgress()`
**Location**: `src/js/app.js:352-362`

**Test Cases**:
```javascript
describe('updateArcProgress', () => {
  test('Progress 0% sets offset to 125.66', () => {
    // Arc should be fully hidden at 0%
  });

  test('Progress 100% sets offset to 0', () => {
    // Arc should be fully visible at 100%
  });

  test('Progress 50% sets offset to 62.83', () => {
    // Arc should be half visible at 50%
  });

  test('Handles invalid element ID gracefully', () => {
    // Should not throw error if element doesn't exist
  });
});
```

**Expected Coverage**: 100%

---

### Test Suite 2: `updateWaterGlasses()`
**Location**: `src/js/app.js:368-378`

**Test Cases**:
```javascript
describe('updateWaterGlasses', () => {
  test('Count 0 marks all glasses as empty', () => {
    // All .glass-icon should NOT have .filled class
  });

  test('Count 8 marks all glasses as filled', () => {
    // All 8 .glass-icon should have .filled class
  });

  test('Count 5 marks first 5 glasses as filled', () => {
    // First 5 should have .filled, last 3 should not
  });

  test('Count > 8 marks all 8 glasses as filled', () => {
    // Edge case: more than 8 glasses
  });

  test('Negative count marks all glasses as empty', () => {
    // Edge case: negative input
  });
});
```

**Expected Coverage**: 100%

---

### Test Suite 3: `updateQuickStats()`
**Location**: `src/js/app.js:305-346`

**Test Cases**:
```javascript
describe('updateQuickStats', () => {
  test('No data shows dashes and 0% progress', () => {
    // All values should be '-', all arcs at 0%
  });

  test('Sleep score 7/10 shows correct value and 70% progress', () => {
    // Text: '7/10', arc offset: 37.7
  });

  test('Water 8 glasses shows correct value and 100% progress', () => {
    // Text: '8 glazen', arc offset: 0
  });

  test('Water 4 glasses shows 50% progress', () => {
    // Text: '4 glazen', arc offset: 62.83
  });

  test('Walked true shows "Ja ✓" and 100% progress', () => {
    // Text: 'Ja ✓', arc offset: 0
  });

  test('Walked false shows "Nee" and 0% progress', () => {
    // Text: 'Nee', arc offset: 125.66
  });

  test('Back pain 3/10 shows inverted progress (70%)', () => {
    // Text: '3/10', arc offset: 37.7 (inverted!)
  });

  test('Back pain 0/10 shows 100% progress (no pain is good)', () => {
    // Text: '-' or '0/10', arc offset: 0
  });
});
```

**Expected Coverage**: 90%+ (edge cases OK)

---

## 📱 Manual Testing

### Device Testing
**Device**: iPhone 13 (390×844px)
**Browser**: Safari (iOS 14+)

**Test Cases**:

#### TC-01: Quick Stats Display
- [ ] Quick stats show in 2×2 grid
- [ ] All 4 cards visible (Sleep, Water, Walk, Pain)
- [ ] Partial circular progress arcs render correctly
- [ ] Water card has green gradient background
- [ ] Text is readable on gradient (white color)

#### TC-02: Quick Stats Updates
- [ ] Enter sleep score → quick stat updates
- [ ] Arc animates smoothly (1s transition)
- [ ] Percentage calculates correctly
- [ ] Add water → quick stat updates
- [ ] Water arc reaches 100% at 8 glasses

#### TC-03: Water Glasses Visual
- [ ] 8 glass icons visible
- [ ] All start as gray/faded (opacity 0.2)
- [ ] Click + button → next glass fills
- [ ] Filled glass is colored and scaled (opacity 1, scale 1.1)
- [ ] Click - button → last glass unfills
- [ ] Animation is smooth (0.3s transition)

#### TC-04: Alcohol Selector
- [ ] Pills show in 2-column grid
- [ ] Pills are large enough (min-height: 100px)
- [ ] Icons are big (2.5rem)
- [ ] Click pill → becomes active (terracotta bg, white text)
- [ ] Click another pill → previous deselects
- [ ] Touch targets >= 44×44px

#### TC-05: Health Score
- [ ] Circle is 140px (not too big)
- [ ] Percentage text is centered
- [ ] Score message is subtle
- [ ] Updates when data saved
- [ ] Animation smooth

#### TC-06: Gradient Headers
- [ ] Tracking card headers have gradients
- [ ] "Slaap & Welzijn" has terracotta gradient
- [ ] "Hydratatie & Activiteit" has sage green gradient
- [ ] White text is readable (contrast check)
- [ ] Headers span full card width

#### TC-07: Spacing & Typography
- [ ] H1 is big and bold (2rem, 800 weight)
- [ ] H2 has good spacing below (var(--spacing-lg))
- [ ] Form groups have breathing room
- [ ] Container padding feels comfortable
- [ ] No cramped sections

### Cross-browser Testing
- [ ] Safari (iOS 14+) - Primary
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Edge (latest)

**Test per browser**:
- Visual regression (no layout breaks)
- Animations work
- Colors render correctly
- Gradients display

---

## ♿ Accessibility Audit

### WCAG 2.1 AA Compliance

#### Color Contrast
**Tool**: WebAIM Contrast Checker

**Tests**:
- [ ] Terracotta gradient header (#C17A5C) + white text
  - Expected: >= 4.5:1 (normal text)
- [ ] Sage green gradient header (#8B9E7D) + white text
  - Expected: >= 4.5:1 (normal text)
- [ ] Water card gradient (#8B9E7D) + white text
  - Expected: >= 4.5:1 (normal text)
- [ ] All form labels (--text-secondary) on light bg
  - Expected: >= 4.5:1

**Fail criteria**: Any ratio < 4.5:1 → Create issue for fix

#### Keyboard Navigation
**Tests**:
- [ ] Tab through all interactive elements
- [ ] Tab order is logical (top to bottom, left to right)
- [ ] Focus indicators visible (outline or custom)
- [ ] +/- water buttons are keyboard accessible
- [ ] Alcohol pills are keyboard accessible
- [ ] Enter/Space activates buttons
- [ ] No keyboard traps

**Fail criteria**: Any element not keyboard accessible → Create issue

#### Screen Reader
**Tool**: VoiceOver (macOS/iOS) or NVDA (Windows)

**Tests**:
- [ ] Quick stats cards announce values
- [ ] Water glasses announce "3 van 8 glazen"
- [ ] Alcohol pills announce type + selected state
- [ ] Form labels properly associated
- [ ] Buttons announce purpose
- [ ] SVG arcs have aria-labels or descriptions

**Fail criteria**: Any unclear or missing announcement → Create issue

#### Touch Targets
**Tests**:
- [ ] Water +/- buttons >= 44×44px ✅ (already 64×64px)
- [ ] Alcohol pills >= 44×44px ✅ (min-height 100px)
- [ ] Nav buttons >= 44×44px
- [ ] Checkboxes >= 44×44px
- [ ] All interactive elements meet minimum

**Fail criteria**: Any target < 44×44px → Create issue

---

## 📸 Visual Testing

### Screenshots Needed
**Location**: `screenshots/2025-11-22_design-improvements/`

**Captures**:
1. `01_quick-stats-empty.png` - Quick stats without data
2. `02_quick-stats-filled.png` - Quick stats with sample data
3. `03_water-glasses-0.png` - Water at 0 glasses
4. `04_water-glasses-5.png` - Water at 5 glasses
5. `05_water-glasses-8.png` - Water at 8 glasses (full)
6. `06_alcohol-selector.png` - Alcohol pills
7. `07_alcohol-selected.png` - One pill selected
8. `08_gradient-headers.png` - Card headers with gradients
9. `09_health-score-compact.png` - New compact health score
10. `10_full-page-overview.png` - Complete page with all changes

**Device**: iPhone 13 (390×844px)
**Browser**: Safari

---

## 🐛 Bug Tracking

**Found bugs go here**:

| ID | Severity | Description | Status |
|----|----------|-------------|--------|
| - | - | - | - |

---

## ✅ Definition of Done

Testing is DONE when:

### Unit Tests
- [x] All 3 test suites written
- [ ] All tests passing (green)
- [ ] Code coverage >= 80% for new functions
- [ ] Tests committed to repo

### Manual Testing
- [ ] All 7 test cases passed on iPhone 13
- [ ] Cross-browser testing passed (4 browsers)
- [ ] No critical bugs found
- [ ] Screenshots captured

### Accessibility
- [ ] Contrast ratios all >= 4.5:1
- [ ] Keyboard navigation works
- [ ] Screen reader tested
- [ ] Touch targets validated
- [ ] Issues logged for any failures

### Documentation
- [ ] Test results documented
- [ ] Screenshots committed
- [ ] Bug reports created (if any)
- [ ] Issue #16 updated with results

### Approval
- [ ] QA Lead approves
- [ ] Product Owner accepts
- [ ] Ready for production

---

## 📊 Test Results

**Will be filled in after testing**:

- **Unit Tests**: ⏳ Pending
- **Manual Tests**: ⏳ Pending
- **Accessibility**: ⏳ Pending
- **Screenshots**: ⏳ Pending

**Overall Status**: ⏳ IN PROGRESS

---

**Test Lead**: @QALead
**Execution**: @AutomationQA (unit), @MobileQA (manual)
**Target Completion**: 25 November 2025
