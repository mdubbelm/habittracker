# 🎨 Design Verbeteringen - Gebaseerd op Referenties

## 📊 Wat Ik Zie in de Referenties

### HealthTrack UI Kit (Blauwe app)
- ✨ **Mini metric cards** met partial circular progress (niet volledig!)
- 📐 **2x2 Grid layout** voor quick stats
- ➕ **Grote floating + button** rechtsonder
- 🎯 **Grote cijfers** (1264 steps) in cards
- 💙 **Blue gradient accents** op interactive cards
- 🔵 **Kleine circulaire progress** als accent (niet hoofdvisualisatie)

### Sleep Tracking App
- 🌈 **Gradient cards** (dark bg, orange accents)
- 🔢 **Huge numbers** (2 Hour, 75%, 21.00) zeer prominent
- 📅 **Calendar view** met gekleurde dagen
- 🎨 **Colored cards** voor verschillende metrics
- 📊 **Wave charts** in cards

### Fastic & Health Dashboard
- 🃏 **Card-based layout** met verschillende groottes
- ⭕ **Partial circles** voor progress (50%, 75% etc)
- 📱 **Grid layouts** (2 kolommen, 3 kolommen)
- 🎯 **Icons + numbers** combinatie

---

## 🚀 Wat We MOETEN Verbeteren

### 1. Quick Stats Cards
**NU:** Basic cards met emoji + text
**MOET:** Grote cards met partial circular progress

```
┌─────────────────┐  ┌─────────────────┐
│   Slaap         │  │   Water         │
│     ⭕          │  │     ⭕          │
│    8/10         │  │   8 glazen      │
│  [semi circle]  │  │ [semi circle]   │
└─────────────────┘  └─────────────────┘
```

### 2. Tracking Form
**NU:** Lange lijst met alles onder elkaar
**MOET:** Grid-based met visuele groepering

### 3. Water Intake
**NU:** +/- buttons met number
**MOET:** Visual glasses indicator + grote buttons

```
[glass][glass][glass][glass][empty][empty][empty][empty]
              [-]  8 glazen  [+]
```

### 4. Health Score
**NU:** Grote cirkel als hero element
**MOET:** Smaller, als onderdeel van dashboard

### 5. Alcohol Selector
**NU:** 3-kolom grid met emoji pills
**MOET:** 2-kolom grid, GROTERE pills, betere iconen

---

## 🎯 Prioriteiten

### CRITICAL (Nu doen!)
1. ⭕ **Quick Stats** → Partial circular progress
2. 💧 **Water Visual** → Glass indicators
3. 📏 **Betere spacing** → Meer lucht
4. 🎨 **Card gradients** → Voor belangrijke metrics

### HIGH
5. 🍷 **Alcohol pills** → Groter, 2-kolom
6. 📊 **Health score** → Kleiner, niet dominant
7. 🎨 **Color accents** → Gradient highlights

### MEDIUM
8. 📐 **Grid layouts** → 2-kolom voor sliders
9. 🔢 **Bigger numbers** → Numbers > labels
10. 🎯 **Icon system** → Vervang ALLE emojis

---

## 💡 Design System Updates

### Typography Hiërarchie
```css
--font-hero: 3rem;      /* 48px - Big numbers */
--font-title: 1.5rem;   /* 24px - Card titles */
--font-body: 1rem;      /* 16px - Labels */
--font-small: 0.875rem; /* 14px - Hints */
```

### Card Sizes
```css
--card-mini: 160px;     /* Quick stats */
--card-normal: auto;    /* Regular forms */
--card-wide: 100%;      /* Full width */
```

### Colors - Add Gradients
```css
--gradient-card: linear-gradient(135deg, #C17A5C 0%, #A65D43 100%);
--gradient-accent: linear-gradient(135deg, #8B9E7D 0%, #6D7D5F 100%);
```

---

## 📐 Layout Improvements

### Grid System
- **Quick stats:** 2×2 grid (niet 3×1)
- **Alcohol:** 2×3 grid (niet 3×2)
- **Form sections:** Meer compact

### Spacing
- Tussen cards: 20px → 24px
- Binnen cards: 16px → 20px
- Touch targets: min 64×64px ✅ (al goed!)

---

**VOLGENDE STAP:** Implementeer deze verbeteringen!
