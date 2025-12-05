# Health Tracker - Product Roadmap

## Visie

Een intuïtieve, privacy-first health tracking app die gebruikers motiveert om gezonde gewoonten te ontwikkelen door middel van visuele feedback en betekenisvolle insights.

---

## Status: December 2025

```
Phase 0: Foundation          ████████████████████ DONE ✅
Phase 1: MVP                 ████████████████████ DONE ✅
Phase 2: Enhancement         ████████████░░░░░░░░ IN PROGRESS (50%)
Phase 3: Scale & Optimize    ░░░░░░░░░░░░░░░░░░░░ PLANNED
```

---

## ✅ Phase 0: Foundation (COMPLETED)

### Wat is gedaan:
- [x] Repository & project setup
- [x] Vite build tooling met ES modules
- [x] ESLint, Prettier, Husky code quality
- [x] Vitest testing infrastructure
- [x] GitHub Actions CI/CD
- [x] CLAUDE.md voor AI assistance
- [x] Design system (earthy palette, typography)
- [x] Mobile-first responsive design

---

## ✅ Phase 1: MVP (COMPLETED)

### Core Tracking
- [x] Slaap & welzijn tracking
- [x] Gewicht monitoring (ochtend time-gated)
- [x] Consumptie tracking (suiker, alcohol, cafeïne)
- [x] Water intake tracking
- [x] Activiteit (gelopen, lezen)
- [x] Energie & stemming tracking
- [x] Data persistentie (localStorage)
- [x] Aanpasbare tracking velden (toggles)

### Health Score
- [x] Circulaire progress indicator
- [x] Real-time score updates
- [x] Gewogen score berekening
- [x] Quick stats in header
- [x] Motiverende berichten

### Statistieken
- [x] Periode selectie (7/14/30/90/all)
- [x] Gemiddelden berekeningen
- [x] Gewichtstrend grafiek
- [x] Consumptie visualisaties
- [x] Activity bars

### Data Management
- [x] CSV & JSON export
- [x] CSV & JSON import
- [x] Demo data generator
- [x] Data cleanup (90 dagen)

### PWA
- [x] Service Worker met offline support
- [x] App manifest
- [x] Install prompt
- [x] Update notifications
- [x] Pull to refresh

### UX Polish
- [x] Toast notifications
- [x] Offline indicator
- [x] Form feedback (pulse animations)
- [x] Custom checkboxes & toggles
- [x] Flat design nav icons
- [x] Accessibility (ARIA, keyboard nav)

---

## 🔄 Phase 2: Enhancement (IN PROGRESS)

### Geprioriteerde Backlog (door PO - December 2025)

| Prio | # | Titel | SP | Status |
|------|---|-------|-----|--------|
| 🔴 1 | #41 | Update banner → Settings | 1 | ✅ Done |
| 🔴 2 | #50 | Trend indicatoren energie/stemming | 3 | ✅ Done |
| 🟠 3 | #43 | Custom habits in statistieken | 5 | ✅ Done |
| 🟠 4 | #54 | Accessibility audit (WCAG) | 5 | Backlog |
| 🟡 5 | #55 | Test coverage verhogen | 3 | Backlog |
| 🟡 6 | #52 | Dark mode | 5 | Backlog |
| 🟡 7 | #53 | Weekly summary notificatie | 3 | Backlog |
| 🟢 8 | #27 | Obsidian integratie | 5 | Backlog |
| 🟢 9 | #24 | Health Score visualisatie polish | 8 | Backlog |

### Recent Completed
- [x] #32 - Bewerk data van eerdere dagen (backfill)
- [x] #33 - PWA update button iOS (timeout fallback)
- [x] #36 - Pull-to-refresh tab state fix
- [x] #37 - README update
- [x] #38 - Statistieken redesign (trends, streak dots, energie/stemming)
- [x] #39 - Energie/stemming UX verduidelijken
- [x] #40 - Cafeïne weergave in statistieken verduidelijken
- [x] #41 - Update banner naar Settings verplaatst
- [x] #42 - Slider waarden naast label
- [x] #44 - Cafeïne statistiek backwards compatibility
- [x] #49 - Statistieken undefined kg fix
- [x] #50 - Trend indicatoren energie/stemming
- [x] #43 - Custom habits in statistieken

---

## 📋 Phase 3: Scale & Optimize (PLANNED)

### Performance
- [ ] Lighthouse score optimaliseren
- [ ] Bundle size verkleinen
- [ ] Lazy loading

### Backend (optioneel)
- [ ] Cloud sync overwegen
- [ ] Multi-device support

### Internationalization
- [ ] Engels vertaling
- [ ] i18n framework

---

## 📊 Metrics

### Kwaliteit
- Test coverage: 51 tests (healthScore, sanitize)
- Lint: 0 errors, 9 warnings
- Build: ~62KB JS, ~40KB CSS

### Performance targets
- Initial load: < 2s
- Lighthouse Performance: > 90
- Lighthouse Accessibility: > 90

---

## Story Point Reference

| SP | Effort | Tijd |
|----|--------|------|
| 1 | XS | < 2 uur |
| 3 | S | 2-4 uur |
| 5 | M | 4-8 uur |
| 8 | L | 8-16 uur |
| 13 | XL | 16+ uur |

---

## Milestones

| Milestone | Status | Open | Closed |
|-----------|--------|------|--------|
| Phase 0: Foundation | ✅ Closed | 0 | 8 |
| Phase 1: MVP | ✅ Closed | 0 | 9 |
| Phase 2: Enhancement | 🔄 Open | 6 | 7 |

---

**Laatst bijgewerkt**: 5 december 2025
**Versie**: 0.3.0
