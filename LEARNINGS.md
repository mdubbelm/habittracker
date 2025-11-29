# LEARNINGS.md - Health Tracker

Dit bestand documenteert learnings, opgeloste problemen en belangrijke beslissingen voor Health Tracker.

---

## Learnings

### [2025-11] Single-file HTML voor rapid prototyping

**Context**: Project gestart als experiment voor health tracking app.

**Beslissing**: Bewust gekozen voor single HTML file (~2700 lines) met inline CSS en JS.

**Waarom**:
- Snelle iteratie zonder build setup
- Direct testen in browser (open file)
- Makkelijk delen (één bestand)
- Refactoring naar modules kan later (Phase 1)

**Trade-offs**:
- Geen code splitting of lazy loading
- Moeilijker te onderhouden bij groei
- Geen linting/formatting tools

**Tags**: #architecture #prototyping #single-file

---

### [2025-11] localStorage voor privacy-first data

**Context**: Health data is gevoelig, gebruikers willen privacy.

**Beslissing**: Alle data in localStorage, geen backend.

**Waarom**:
- Data blijft op device van gebruiker
- Geen server kosten
- Geen privacy policy nodig
- Werkt offline

**Beperkingen**:
- Max ~5-10MB storage
- Geen sync tussen devices
- Data verloren bij browser reset

**Tags**: #privacy #storage #architecture

---

### [2025-11] Time-based visibility voor UX

**Context**: Gebruikers hoeven niet alle velden de hele dag te zien.

**Pattern**:
```javascript
function isTimeInRange(startHour, endHour) {
  const hour = new Date().getHours();
  if (startHour <= endHour) {
    return hour >= startHour && hour < endHour;
  }
  // Wraps around midnight
  return hour >= startHour || hour < endHour;
}

// Sleep section: 18:00 - 12:00 (evening + morning)
// Weight section: 05:00 - 11:00 (morning only)
```

**Waarom**: Reduceert cognitive load, toont relevante velden op relevante momenten.

**Tags**: #ux #time-based #visibility

---

### [2025-11] Safe Area Insets voor iPhone notch

**Context**: App moet goed werken als PWA op iPhone met notch.

**Pattern**:
```css
:root {
  --safe-area-inset-top: env(safe-area-inset-top, 0px);
  --safe-area-inset-bottom: env(safe-area-inset-bottom, 0px);
}

header {
  padding-top: calc(20px + var(--safe-area-inset-top));
}

/* In viewport meta tag */
<meta name="viewport" content="viewport-fit=cover">
```

**Waarom**: Zonder safe area insets verdwijnt content achter de notch of home indicator.

**Tags**: #ios #pwa #css #safe-area

---

### [2025-11] Health Score algoritme met gewichten

**Context**: Verschillende metrics hebben verschillende impact op gezondheid.

**Pattern**:
```javascript
function calculateHealthScore(data) {
  let score = 0;

  // Sleep: 20 points (most important)
  score += (data.sleepScore / 10) * 20;

  // Back pain: 15 points (inverse - lower is better)
  score += ((10 - data.backPain) / 10) * 15;

  // Water: 15 points (8 glasses = max)
  score += Math.min(data.waterIntake / 8, 1) * 15;

  // Booleans: 10 points each
  if (data.walked) score += 10;
  if (!data.sugarConsumed) score += 10;
  if (!data.alcoholConsumed) score += 10;

  // Caffeine: 10 points if ≤2 cups
  if (data.caffeineAmount <= 2) score += 10;

  // Custom habits: 5 points (completion %)
  score += calculateHabitCompletion(data.customHabits) * 5;

  return Math.round(score); // 0-100
}
```

**Waarom**: Gewogen scoring reflecteert relatief belang van elke metric.

**Tags**: #algorithm #health-score #gamification

---

## Index per Tag

### Architecture
- Single-file HTML voor rapid prototyping
- localStorage voor privacy-first data

### UX
- Time-based visibility voor UX

### iOS / PWA
- Safe Area Insets voor iPhone notch

### Algorithm
- Health Score algoritme met gewichten

### CSS
- Safe Area Insets voor iPhone notch

---

**Laatste update**: November 2025
