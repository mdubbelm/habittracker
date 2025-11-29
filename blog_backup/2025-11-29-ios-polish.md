---
title: "iOS polish - pull-to-refresh & wheel picker"
date: 2025-11-29
session: 7
tags: [ux, ios, native-feel, polish]
user_time: "15 min"
ai_time: "1.75 uur"
efficiency: "1:7"
version: "0.2.0"
mood: "💅"
---

# iOS polish

## "Het moet aanvoelen als een echte app"

De app werkt. De app is live. Maar... het voelt nog als een website.

Tijd voor native feel.

---

## Pull-to-refresh (30 min)

Je kent het. Trek naar beneden, de app refresht. Zo simpel, zo verwacht op iOS.

- Trek naar beneden → Refresh indicator
- **80px threshold** voor trigger
- Smooth animatie
- `overscroll-behavior` voor browser compatibility

**Feels:** Net een native app!

### De code

```javascript
let startY = 0;
let pulling = false;

element.addEventListener('touchstart', (e) => {
  if (window.scrollY === 0) {
    startY = e.touches[0].pageY;
    pulling = true;
  }
});

element.addEventListener('touchmove', (e) => {
  if (!pulling) return;
  const diff = e.touches[0].pageY - startY;
  if (diff > 80) {
    // Show indicator, trigger refresh
  }
});
```

Simpel. Effectief. Native feel.

---

## iOS-style weight wheel picker (45 min)

De standaard number input was... meh. Kleine plus/min knoppen. Niet smooth.

Dus bouwden we een wheel picker. iOS-style.

- **Wheel picker** met rotor effect
- **Touch scrolling** met momentum
- **Snap-to-value** effect
- **3D gradient mask** voor depth
- **Range**: 30-200 kg, 0.0-0.9 decimalen

### Hoe het werkt

```javascript
class WheelPicker {
  constructor(options) {
    this.itemHeight = 44; // iOS standard
    this.visibleItems = 5;
    this.friction = 0.95; // Momentum
  }

  snap() {
    // Snap to nearest value
    const index = Math.round(this.offset / this.itemHeight);
    this.animateTo(index * this.itemHeight);
  }
}
```

Het voelt **precies** zoals de native iOS picker. Smooth scroll, momentum, snap.

---

## Versie & update check (30 min)

In Instellingen:

- **Versie nummer** (0.2.0)
- **Build datum** (automatisch via Vite)
- **"Controleer op updates"** knop
- Service Worker update check
- Spinner + status feedback

### Vite config

```javascript
define: {
  __APP_VERSION__: JSON.stringify(pkg.version),
  __BUILD_DATE__: JSON.stringify(new Date().toISOString())
}
```

Versie info automatisch bij elke build. Geen handmatig werk.

---

## Version bump: 0.2.0

Met deze UX verbeteringen bumpen we naar versie 0.2.0.

### What's new
- Pull-to-refresh
- iOS-style wheel picker
- Version info in settings
- PWA update notification

---

## Cumulative stats (session 1-7)

| Metric | Waarde |
|--------|--------|
| Total User Time | ~2 uur |
| Total AI Time | ~16 uur |
| Efficiency | 1:8 |
| Issues Closed | 22 |
| Phase 0 | ✅ 100% |
| Phase 1 | ~70% |
| Version | 0.2.0 |
| Live URL | dailymo.netlify.app |

---

## Wat ik leerde

### Native feel is in de details
Het verschil tussen "website" en "app" zit in kleine dingen:
- Pull-to-refresh
- Smooth scroll met momentum
- Haptic-achtige feedback
- Native-looking inputs

### Custom components zijn leuk
De wheel picker was een uitdaging. Maar het resultaat is 100% custom, 100% iOS-feel, 0% dependencies.

---

## Open issues

- #27 Obsidian integratie
- #28 Customizable tracking fields
- #29 Energieniveau tracking
- #30 Design verbeteringen

---

*De app voelt nu als een app. Niet als een website. Dat is een milestone op zich.*
