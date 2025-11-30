# LEARNINGS.md - Health Tracker

Dit bestand documenteert learnings, opgeloste problemen en belangrijke beslissingen voor Health Tracker.

---

## Learnings

### [2025-11-30] Dev server conflict met Obsidian

**Context**: Bij testen van de app via `npm run dev` op het lokale netwerk.

**Probleem**: Op iPhone verschijnt een Obsidian-gerelateerde melding in plaats van de app. Dit gebeurt wanneer:
1. Obsidian app op de telefoon de URL probeert te intercepten
2. Er een URL scheme conflict is tussen localhost/netwerk URL en Obsidian

**Workaround**:
- Test via production build: `npm run build && npm run preview`
- Of test direct via GitHub Pages deployment
- Of sluit Obsidian app op de telefoon tijdens dev testen

**Permanente oplossing**: Onderzoek of Vite een andere poort/URL kan gebruiken die niet conflicteert. Of gebruik `--host 0.0.0.0` met een specifieke poort.

**Tags**: #dev-environment #ios #obsidian #vite

---

### [2025-11-30] iOS Safari PWA update - controllerchange event unreliable

**Context**: PWA update banner met "Updaten" knop werkte niet op iOS Safari.

**Probleem**: iOS Safari triggert het `controllerchange` event niet betrouwbaar na `skipWaiting()`. De knop deed dus niets.

**Oplossing**:
```javascript
// Timeout fallback voor iOS
let reloaded = false;
const reloadTimeout = window.setTimeout(() => {
    if (!reloaded) {
        reloaded = true;
        window.location.reload();
    }
}, 1500);

// Desktop: wacht op controllerchange
navigator.serviceWorker.addEventListener('controllerchange', () => {
    window.clearTimeout(reloadTimeout);
    if (!reloaded) {
        reloaded = true;
        window.location.reload();
    }
}, { once: true });
```

**Waarom**: iOS Safari heeft strikte beperkingen voor Service Worker lifecycle. Timeout fallback forceert reload na 1.5s als event niet komt.

**Tags**: #ios #safari #pwa #service-worker

---

### [2025-11-30] JavaScript Date timezone issues

**Context**: Date picker navigatie (vorige/volgende dag) sprong soms 2 dagen in plaats van 1.

**Probleem**: `toISOString()` converteert naar UTC, wat bij timezone offset kan resulteren in verkeerde datum.

**Oplossing**:
```javascript
// FOUT: toISOString() geeft UTC, niet lokale tijd
const date = new Date(selectedDate + 'T00:00:00');
date.setDate(date.getDate() - 1);
const newDate = date.toISOString().split('T')[0]; // Kan verkeerde datum geven!

// GOED: gebruik noon time en lokale formatting
const date = new Date(selectedDate + 'T12:00:00');
date.setDate(date.getDate() - 1);
const newDate = formatDateLocal(date);

function formatDateLocal(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}
```

**Waarom**: Door T12:00:00 (middag) te gebruiken i.p.v. T00:00:00 (middernacht) voorkom je timezone edge cases.

**Tags**: #javascript #date #timezone #bug

---

### [2025-11-30] parseInt met || operator voor nullable values

**Context**: Energie level (1-5) werd niet correct opgeslagen.

**Probleem**: `parseInt('') || null` geeft correct `null`, maar `parseInt('0') || null` geeft OOK `null` omdat 0 falsy is!

**Oplossing**:
```javascript
// FOUT: 0 wordt null
data.energyLevel = parseInt(document.getElementById('energy-value')?.value) || null;

// GOED: check expliciet op lege string
const energyValue = document.getElementById('energy-value')?.value;
data.energyLevel = energyValue !== '' ? parseInt(energyValue) : null;
```

**Waarom**: In JavaScript is 0 een falsy value. De || operator behandelt 0 hetzelfde als '', undefined, null, false.

**Tags**: #javascript #bug #form-data

---

### [2025-11-29] Data behoud bij verborgen secties

**Context**: App heeft tijd-gebaseerde secties (ochtend/avond) die verborgen worden buiten hun tijdvenster.

**Probleem**: Bij opslaan werden ook default waarden van verborgen secties opgeslagen, waardoor eerder ingevulde data werd overschreven.

**Oplossing**:
```javascript
function saveData() {
    // Haal eerst bestaande data op
    const existingData = getTodayData() || {};

    // Check welke secties zichtbaar zijn
    const morningVisible = !document.getElementById('morning-section')
        ?.classList.contains('hidden');

    // Start met bestaande data
    const data = { ...existingData };

    // Update alleen velden van zichtbare secties
    if (morningVisible) {
        data.sleepScore = parseInt(document.getElementById('sleep-score')?.value);
        // ... andere ochtend velden
    }

    // Water is altijd zichtbaar
    data.waterIntake = parseInt(document.getElementById('water-intake')?.value);

    saveTodayData(data);
}
```

**Waarom**: Door eerst bestaande data te laden en alleen zichtbare secties te updaten, blijft eerder ingevulde data behouden.

**Tags**: #data-persistence #ux #time-based

---

### [2025-11-29] PWA update notificatie pattern

**Context**: PWA gebruikers zien niet automatisch nieuwe versies door service worker caching.

**Probleem**: Gebruikers moeten de app herinstalleren om updates te krijgen.

**Oplossing**:
```javascript
// In service worker registration
registration.addEventListener('updatefound', () => {
    const newWorker = registration.installing;
    newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // Nieuwe versie beschikbaar - toon banner
            waitingServiceWorker = newWorker;
            showUpdateBanner();
        }
    });
});

// Bij klik op "Updaten"
updateButton.addEventListener('click', () => {
    waitingServiceWorker.postMessage({ type: 'SKIP_WAITING' });
    navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload();
    });
});
```

**Waarom**: Service worker lifecycle vereist dat nieuwe versie wacht tot oude inactief is. Met `SKIP_WAITING` message kan gebruiker handmatig updaten.

**Tags**: #pwa #service-worker #ux

---

### [2025-11-29] ESLint browser globals expliciet maken

**Context**: ESLint configuratie voor browser JavaScript.

**Probleem**: `clearTimeout` en `setInterval` geven "not defined" errors in ESLint.

**Oplossing**:
```javascript
// Gebruik window prefix voor browser globals
window.clearTimeout(autoSaveTimeout);
autoSaveTimeout = window.setTimeout(() => {
    saveData(true);
}, 500);

window.setInterval(() => registration.update(), 60 * 60 * 1000);
```

**Waarom**: ESLint weet niet automatisch dat code in browser draait. `window.` prefix maakt expliciet dat dit browser APIs zijn.

**Alternatief**: ESLint config aanpassen met `"env": { "browser": true }`.

**Tags**: #eslint #javascript #browser

---

### [2025-11-29] Section completion na expliciet opslaan

**Context**: Secties moeten verdwijnen als alle velden zijn ingevuld.

**Probleem**: Sectie verdween al tijdens invullen (bij elke auto-save), voordat gebruiker klaar was.

**Oplossing**:
```javascript
function isSectionComplete(todayData, section) {
    const data = todayData || {};

    if (section === 'morning') {
        const hasAllFields = (
            data.sleepScore !== undefined &&
            data.backPain !== undefined &&
            data.dreamed !== undefined
        );
        // Alleen complete als expliciet opgeslagen (heeft timestamp)
        const wasSaved = data.timestamp !== undefined;
        return hasAllFields && wasSaved;
    }
    return false;
}
```

**Waarom**: Door timestamp te checken weten we dat gebruiker expliciet op "Bewaar" heeft geklikt, niet alleen auto-save.

**Tags**: #ux #form-validation #state-management

---

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
- Data behoud bij verborgen secties
- PWA update notificatie pattern
- Section completion na expliciet opslaan

### iOS / PWA
- Safe Area Insets voor iPhone notch
- PWA update notificatie pattern

### Algorithm
- Health Score algoritme met gewichten

### CSS
- Safe Area Insets voor iPhone notch

### JavaScript / ESLint
- ESLint browser globals expliciet maken

### Data Persistence
- Data behoud bij verborgen secties

### State Management
- Section completion na expliciet opslaan

---

**Laatste update**: 29 november 2025
