# Health Tracker - Product Roadmap

## Visie

Een intuïtieve, privacy-first health tracking app die gebruikers motiveert om gezonde gewoonten te ontwikkelen door middel van visuele feedback en betekenisvolle insights.

---

## Status: November 2025

```
Phase 0: Foundation          ████████████████████ DONE ✅
Phase 1: MVP                 ████████████████████ DONE ✅
Phase 2: Enhancement         ████████░░░░░░░░░░░░ IN PROGRESS
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

### Recent Completed (Nov 30)
- [x] #32 - Bewerk data van eerdere dagen (backfill)
- [x] #33 - PWA update button iOS (timeout fallback)
- [x] #36 - Pull-to-refresh tab state fix
- [x] #37 - README update
- [x] #38 - Statistieken redesign (trends, streak dots, energie/stemming)

### In Progress
- [ ] #23 - Custom Habits Management System
- [ ] #24 - Health Score Visualisatie verbeteringen
- [ ] #39 - Energie/stemming UX verduidelijken
- [ ] Test coverage verhogen (nu ~51 tests)

### Nice-to-haves
- [ ] #27 - Obsidian integratie/export
- [ ] Dark mode
- [x] Streak tracking (done in #38)
- [ ] Weekly summaries

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

## 🎯 Huidige Prioriteiten

1. **Personalisatie** - #23 Custom habits
2. **Polish** - #24 Health Score visualisaties
3. **Stabiliteit** - Tests, accessibility audit
4. **Nice-to-have** - Dark mode, streaks

---

## 📊 Metrics

### Kwaliteit
- Test coverage: 51 tests (healthScore, sanitize)
- Lint: 0 errors, 12 warnings
- Build: ~40KB JS, ~35KB CSS

### Performance targets
- Initial load: < 2s
- Lighthouse Performance: > 90
- Lighthouse Accessibility: > 90

---

## Open Issues (Phase 2)

| # | Titel | Type | Prioriteit | Labels |
|---|-------|------|------------|--------|
| 23 | Custom Habits System | Feature | 🔴 Hoog | `priority: high` |
| 24 | Health Score Visualisatie | Polish | 🟡 Medium | `area: design` |
| 39 | Energie/stemming UX | UX | 🟡 Medium | `area: design` |
| 27 | Obsidian integratie | Niche | 🟢 Laag | `enhancement` |

---

## Milestones

| Milestone | Status | Issues |
|-----------|--------|--------|
| Phase 0: Foundation | ✅ Closed | 8 closed |
| Phase 1: MVP | ✅ Closed | 9 closed |
| Phase 2: Enhancement | 🔄 Open | 4 open |

---

**Laatst bijgewerkt**: 30 november 2025
**Versie**: 0.3.0
