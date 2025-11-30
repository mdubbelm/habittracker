# 🏃‍♀️ Health Tracker

> Privacy-first PWA voor het bijhouden van dagelijkse gezondheid en gewoonten.

[![CI](https://github.com/mdubbelm/habittracker/actions/workflows/ci.yml/badge.svg)](https://github.com/mdubbelm/habittracker/actions/workflows/ci.yml)
[![Version](https://img.shields.io/badge/version-0.3.0-blue)]()
[![Live](https://img.shields.io/badge/live-daily.modub.nl-green)](https://daily.modub.nl)

**[▶ Open de app](https://daily.modub.nl)**

---

## Features

- 🎯 **Health Score** - Dagelijkse score (0-100%) gebaseerd op je gewoonten
- 📊 **Tracking** - Slaap, gewicht, water, beweging, consumptie
- 📈 **Statistieken** - Trends en grafieken over tijd
- 📅 **Backfill** - Bewerk data van eerdere dagen
- 🔒 **Privacy** - Alle data blijft lokaal op je apparaat
- 📴 **Offline** - Werkt zonder internet (PWA)

---

## Quick Start

```bash
# Clone & install
git clone https://github.com/mdubbelm/habittracker.git
cd habittracker
npm install

# Development
npm run dev      # Start op http://localhost:5173

# Production build
npm run build
npm run preview
```

---

## Tech Stack

| | |
|--|--|
| **Frontend** | Vanilla JS, HTML5, CSS3 |
| **Build** | Vite |
| **Storage** | localStorage |
| **Deploy** | GitHub Pages |
| **CI/CD** | GitHub Actions |

---

## Documentation

| Document | |
|----------|--|
| [ROADMAP.md](./ROADMAP.md) | Roadmap en huidige status |
| [CLAUDE.md](./CLAUDE.md) | Development guide |
| [LEARNINGS.md](./LEARNINGS.md) | Opgeloste problemen en patterns |

---

## Development

```bash
npm run dev          # Dev server
npm test             # Unit tests
npm run lint         # Linting
npm run lint:fix     # Auto-fix
```

---

## License

Voor persoonlijk gebruik.

---

**[daily.modub.nl](https://daily.modub.nl)** · Ontwikkeld met [Claude Code](https://claude.ai/code)
