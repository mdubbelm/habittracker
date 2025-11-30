# Onderzoek: Statistieken weergave redesign

**Datum**: 30 november 2025
**Door**: Veerle (UX Designer) & Kehrana (UI Designer)
**Status**: Onderzoek + Wireframes

---

## Executive summary

Dit document bevat UX/UI onderzoek naar best practices voor het vastleggen en weergeven van data in health/habit trackers, met concrete wireframes voor de Health Tracker statistieken pagina.

---

## 1. Onderzoek: Best practices

### 1.1 Data visualisatie principes

**Bron**: [UX Studio - Self-tracking Apps](https://www.uxstudioteam.com/ux-blog/self-tracking)

| Principe | Toepassing Health Tracker |
|----------|---------------------------|
| **Maak data direct begrijpelijk** | Vermijd jargon, gebruik eenvoudige taal |
| **Bied context** | Vergelijk met persoonlijke historie of doelen |
| **Beperk tot 5-7 metrics** | Focus op belangrijkste indicatoren |
| **Minimaliseer scrollen** | Belangrijkste info direct zichtbaar |
| **Personalisatie** | Laat gebruiker kiezen welke metrics zichtbaar zijn |

### 1.2 Visualisatie types voor health data

**Bron**: [ResearchGate - Health Visualization on Mobile](https://www.researchgate.net/publication/378333403_The_Shape_of_Mobile_Health_A_Systematic_Review_of_Health_Visualization_on_Mobile_Devices)

| Data type | Aanbevolen visualisatie |
|-----------|-------------------------|
| **Trends over tijd** | Line charts, area charts |
| **Vergelijking periodes** | Bar charts (verticaal) |
| **Dagelijkse completion** | Calendar heatmap / streak dots |
| **Binaire data (ja/nee)** | Clean days counter, checkmarks |
| **Score/percentage** | Progress bars, donut charts |

### 1.3 Motivatie-patronen

**Bronnen**: [Streaks App](https://streaksapp.com/), [MacStories Review](https://www.macstories.net/reviews/streaks-6-brings-habit-tracking-to-your-home-screen-with-extensively-customizable-widgets/)

1. **Streak visualisatie** - Visueel tonen van aaneengesloten dagen
2. **Best streak vs current** - Motiveer om record te verbeteren
3. **Completion percentage** - Week/maand/all-time percentages
4. **Calendar heatmap** - GitHub-style activity grid
5. **Milestone celebrations** - Vier 7, 30, 100 dagen

---

## 2. Huidige situatie Health Tracker

### 2.1 Wat we nu tonen (Statistieken pagina)

```
┌─────────────────────────────┐
│ Statistieken                │
│ Periode: [7] [14] [30] [90] │
├─────────────────────────────┤
│ Slaap: gem. 7.2             │
│ Rugpijn: gem. 3.4           │
│ Water: gem. 6 glazen        │
│                             │
│ Suiker: X/Y dagen clean     │
│ Alcohol: X/Y dagen clean    │
│ Cafeïne: X/Y dagen          │
│                             │
│ Gewandeld: 85%              │
│ Gedroomd: 60%               │
└─────────────────────────────┘
```

### 2.2 Problemen geïdentificeerd

| Probleem | Impact | Prioriteit |
|----------|--------|------------|
| Geen visuele hiërarchie | Alle data lijkt even belangrijk | Hoog |
| Geen trend visualisatie | Gebruiker ziet geen progressie | Hoog |
| Tekst-only weergave | Minder engaging, harder te scannen | Medium |
| Geen persoonlijke doelen | Geen context voor succes/falen | Medium |
| Geen celebrations | Geen positieve reinforcement | Laag |

---

## 3. Design goals

### Must have (MVP)
1. Duidelijke visuele hiërarchie
2. Progress bars voor percentages
3. Trend indicators (omhoog/omlaag)
4. Streak visualisatie voor binaire habits

### Nice to have (V2)
1. Calendar heatmap
2. Interactieve grafieken
3. Doelen instellen
4. Milestone celebrations

---

## 4. Wireframes

### 4.1 Statistieken overview (Mobile - 390px)

```
┌─────────────────────────────────────┐
│ ← Statistieken                      │
├─────────────────────────────────────┤
│                                     │
│  Periode                            │
│  [7d] [14d] [30d] [90d] [Alles]    │
│                                     │
├─────────────────────────────────────┤
│                                     │
│  HEALTH SCORE                       │
│  ┌─────────────────────────────┐   │
│  │    ╭──────╮                 │   │
│  │   (  72%  )  ↑ +5% vs vorig │   │
│  │    ╰──────╯                 │   │
│  │  Gemiddeld deze periode     │   │
│  └─────────────────────────────┘   │
│                                     │
├─────────────────────────────────────┤
│                                     │
│  SLAAP & HERSTEL                    │
│  ┌─────────────────────────────┐   │
│  │ Slaapkwaliteit        7.2   │   │
│  │ [████████░░]          ↑     │   │
│  │                             │   │
│  │ Rugpijn               3.4   │   │
│  │ [███░░░░░░░]          ↓     │   │
│  │                             │   │
│  │ Gedroomd             60%    │   │
│  │ [██████░░░░]                │   │
│  └─────────────────────────────┘   │
│                                     │
├─────────────────────────────────────┤
│                                     │
│  CLEAN STREAKS                      │
│  ┌─────────────────────────────┐   │
│  │ Suiker                      │   │
│  │ 🎯 12 dagen clean           │   │
│  │ ●●●●●●●●●●●●○○○○○○○○       │   │
│  │ Best: 18 dagen              │   │
│  │                             │   │
│  │ Alcohol                     │   │
│  │ 🎯 7 dagen clean            │   │
│  │ ●●●●●●●○○○○○○○○○○○○○       │   │
│  │ Best: 14 dagen              │   │
│  └─────────────────────────────┘   │
│                                     │
├─────────────────────────────────────┤
│                                     │
│  DAGELIJKSE GEWOONTES               │
│  ┌─────────────────────────────┐   │
│  │ Gewandeld                   │   │
│  │ [████████░░]  85% (6/7)     │   │
│  │                             │   │
│  │ Water 8+ glazen             │   │
│  │ [██████░░░░]  57% (4/7)     │   │
│  │                             │   │
│  │ Cafeïne ≤2 kopjes           │   │
│  │ [████████░░]  71% (5/7)     │   │
│  └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

### 4.2 Streak detail view (uitklapbaar)

```
┌─────────────────────────────────────┐
│ Suiker - Clean Days                 │
├─────────────────────────────────────┤
│                                     │
│  HUIDIGE STREAK                     │
│       ┌─────────────────┐          │
│       │                 │          │
│       │   🔥 12         │          │
│       │   dagen         │          │
│       │                 │          │
│       └─────────────────┘          │
│                                     │
│  BESTE STREAK: 18 dagen             │
│  TOTAAL CLEAN: 45 dagen (75%)       │
│                                     │
├─────────────────────────────────────┤
│                                     │
│  NOVEMBER 2025                      │
│  Ma Di Wo Do Vr Za Zo               │
│                    1  2             │
│  ●  ●  ●  ●  ○  ●  ●   3-9         │
│  ●  ●  ●  ●  ●  ●  ●  10-16        │
│  ●  ●  ●  ●  ●  ●  ●  17-23        │
│  ●  ●  ●  ●  ●  ●  ◐  24-30        │
│                                     │
│  ● = clean  ○ = niet clean  ◐ = vandaag
│                                     │
└─────────────────────────────────────┘
```

### 4.3 Progress indicator componenten

```
LINEAR PROGRESS BAR
┌────────────────────────────────────┐
│ [████████░░░░░░░░░░░░]  42%        │
└────────────────────────────────────┘

STREAK DOTS (laatste 20 dagen)
┌────────────────────────────────────┐
│ ●●●●●●●●●●●●○○●●○●●◐              │
│ └── oudste ──────── nieuwste ──┘   │
└────────────────────────────────────┘

TREND INDICATOR
┌────────────────────────────────────┐
│ 7.2  ↑ +0.5 (vs vorige periode)   │ (groen)
│ 3.4  ↓ -1.2 (vs vorige periode)   │ (groen, want lager = beter voor pijn)
│ 6.0  → geen verandering            │ (grijs)
└────────────────────────────────────┘

CLEAN DAYS COUNTER
┌────────────────────────────────────┐
│  🎯 12 dagen clean                 │
│  ┌──────────────────────────────┐ │
│  │ ●●●●●●●●●●●●                 │ │ ← Terracotta dots
│  │ ○○○○○○○○                     │ │ ← Grijze placeholder
│  └──────────────────────────────┘ │
│  Best: 18 dagen                    │
└────────────────────────────────────┘
```

---

## 5. Kleurgebruik (project palette)

**Per DESIGN_PRINCIPLES.md - altijd CSS variables gebruiken!**

| Element | Variable | Hex | Gebruik |
|---------|----------|-----|---------|
| Progress fill | `--color-primary` | #C67B5C | Progress bars, streak dots |
| Progress bg | `--color-primary-light` | #E8D5C4 | Achtergrond progress bars |
| Trend up (positief) | `--color-success` | #4CAF50 | Verbeteringen |
| Trend down (negatief) | `--color-error` | #E57373 | Verslechteringen |
| Neutral | `--color-text-secondary` | #666 | Geen verandering |
| Streak best | `--color-secondary` | #7C9A82 | Best streak highlight |

---

## 6. Interactie specificaties

### 6.1 Touch targets
- Alle klikbare elementen minimaal 44x44px
- Periode buttons: 48px hoogte
- Streak cards: volledig klikbaar voor detail view

### 6.2 Animaties
- Progress bars: fill animatie 300ms ease-out bij laden
- Trend arrows: subtle bounce 200ms bij update
- Streak dots: sequential fade-in 50ms per dot

### 6.3 States
- **Loading**: Skeleton loaders voor alle cards
- **Empty**: "Nog geen data voor deze periode"
- **Error**: Retry button met error message

---

## 7. Toegankelijkheid (WCAG AA)

| Requirement | Implementatie |
|-------------|---------------|
| Contrast | Progress bars hebben voldoende contrast (4.5:1) |
| Screen reader | aria-labels voor alle visuele elementen |
| Kleurenblindheid | Iconen + tekst naast kleuren (niet alleen kleur) |
| Motion | Respecteer `prefers-reduced-motion` |

---

## 8. Implementatie voorstel

### Fase 1: Quick wins (1-2 uur)
1. Voeg trend indicators toe (↑↓→)
2. Progress bars voor percentages
3. Visuele hiërarchie met section headers

### Fase 2: Streak visualisatie (2-3 uur)
1. Clean days counter met dots
2. Best streak tracking
3. Uitklapbare detail view

### Fase 3: Calendar heatmap (4+ uur)
1. Maandweergave met dots
2. Interactieve dag selectie
3. Historische data navigatie

---

## 9. Test plan

### Usability test vragen
1. "Hoeveel dagen heb je geen suiker gehad?"
2. "Is je slaapkwaliteit verbeterd of verslechterd?"
3. "Wat is je beste streak voor alcohol?"
4. "Hoe goed doe je het met water drinken?"

### Success metrics
- Gebruiker vindt antwoord binnen 5 seconden
- Geen verwarring over wat "clean" betekent
- Trend richting is direct duidelijk

---

## 10. Bronnen

- [UX Studio - Self-tracking Apps Best Practices](https://www.uxstudioteam.com/ux-blog/self-tracking)
- [ResearchGate - Health Visualization on Mobile](https://www.researchgate.net/publication/378333403_The_Shape_of_Mobile_Health_A_Systematic_Review_of_Health_Visualization_on_Mobile_Devices)
- [Streaks App](https://streaksapp.com/)
- [MacStories - Streaks 6 Review](https://www.macstories.net/reviews/streaks-6-brings-habit-tracking-to-your-home-screen-with-extensively-customizable-widgets/)
- [Emizentech - Habit Tracking App Guide](https://emizentech.com/blog/habit-tracking-app.html)
- [Idea Usher - Habit Tracking Development](https://ideausher.com/blog/habit-tracking-app-development/)

---

## 11. Volgende stappen

1. **Review**: Bespreek wireframes met product owner (Tessa)
2. **Prototype**: HTML/CSS prototype voor testing
3. **Usability test**: Test met 3-5 gebruikers
4. **Iteratie**: Verfijn op basis van feedback
5. **Implementatie**: Ontwikkeling in sprints

---

**Opgesteld door**: Veerle (UX) & Kehrana (UI)
**Review door**: Monique (product owner check)
**Laatste update**: 30 november 2025
