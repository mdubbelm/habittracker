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

### Bugs & Fixes
- [ ] #33 - PWA update button werkt niet op iOS
- [ ] Test coverage verhogen (nu ~51 tests)

### User Requests
- [ ] #32 - Bewerk data van eerdere dagen (backfill)
- [ ] #23 - Custom Habits Management System
- [ ] #24 - Health Score Visualisatie verbeteringen

### Nice-to-haves
- [ ] #27 - Obsidian integratie/export
- [ ] Dark mode
- [ ] Streak tracking
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

1. **Bugs fixen** - #33 iOS PWA update
2. **Stabiliteit** - Tests, accessibility audit
3. **User value** - #32 Backfill feature
4. **Personalisatie** - #23 Custom habits

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

## Open Issues

| # | Titel | Type | Prioriteit |
|---|-------|------|------------|
| 33 | PWA update button iOS | Bug | Hoog |
| 32 | Backfill eerdere dagen | Feature | Hoog |
| 23 | Custom Habits System | Feature | Medium |
| 24 | Health Score Visualisatie | Polish | Laag |
| 27 | Obsidian integratie | Niche | Laag |

---

**Laatst bijgewerkt**: 29 november 2025
**Versie**: 2.0
