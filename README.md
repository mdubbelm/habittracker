# 🏃‍♀️ Health Tracker

> A modern, privacy-first Progressive Web App for tracking daily health metrics and habits, optimized for mobile devices.

[![Phase](https://img.shields.io/badge/Phase-0%20Foundation-yellow)]()
[![Platform](https://img.shields.io/badge/Platform-Mobile%20First-blue)]()
[![Device](https://img.shields.io/badge/Optimized%20for-iPhone%2013-black)]()

---

## 📱 Overview

Health Tracker is een intuïtieve mobile-first app die je helpt gezonde gewoonten te ontwikkelen door middel van visuele feedback en betekenisvolle insights. De app berekent een dagelijkse gezondheidscore (0-100%) gebaseerd op slaap, activiteit, consumptie en custom habits.

**Key Features:**
- 🎯 **Real-time Health Score** - Circulaire visualisatie met menselijke figuur
- 📊 **Comprehensive Tracking** - Slaap, gewicht, water, activiteit, consumptie
- 📈 **Advanced Statistics** - Trends, grafieken en insights over tijd
- 🎨 **Modern Design** - Fastic-geïnspireerd met gradient accenten
- 🔒 **Privacy First** - Alle data blijft lokaal (localStorage)
- 📴 **Offline Ready** - PWA met offline functionaliteit (Phase 1)

---

## 🚀 Quick Start

### Huidige Setup (Phase 0)

```bash
# Clone de repository
git clone https://github.com/mdubbelm/habittracker.git
cd habittracker

# Open in browser (gebruik een lokale server)
python3 -m http.server 3000

# Navigeer naar:
# - App: http://localhost:3000/habittracker.html
# - iPhone 13 Preview: http://localhost:3000/dev-preview.html
```

### Toekomstige Setup (Phase 1+)

```bash
# Installeer dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build voor production
npm run build
```

---

## 🎯 Project Status

**Current Phase:** Phase 0 - Foundation & Setup

**Progress:**
- [x] Initial prototype (single HTML file)
- [x] Team samenstelling
- [x] Product roadmap
- [x] GitHub omgeving (labels, milestones, issue templates)
- [x] iPhone 13 preview omgeving
- [ ] Codebase refactoring (modular structure)
- [ ] Testing infrastructure
- [ ] CI/CD pipeline
- [ ] Design system documentatie

Zie [ROADMAP.md](./ROADMAP.md) voor de volledige planning.

---

## 📚 Documentation

| Document | Beschrijving |
|----------|--------------|
| [ROADMAP.md](./ROADMAP.md) | Product roadmap met alle fasen en milestones |
| [TEAM.md](./TEAM.md) | Team structuur, rollen en verantwoordelijkheden |
| [CLAUDE.md](./CLAUDE.md) | Development guide voor Claude Code assistance |
| [health-tracker-development.md](./health-tracker-development.md) | Uitgebreide feature documentatie |
| [.github/MOBILE_TESTING.md](./.github/MOBILE_TESTING.md) | iPhone 13 testing guide |
| [.github/PHASE0_ISSUES.md](./.github/PHASE0_ISSUES.md) | Phase 0 backlog |

---

## 🏗️ Architecture

### Current (Phase 0)
Monolithic HTML file met inline CSS en JavaScript voor rapid prototyping.

### Target (Phase 1+)
```
src/
├── components/     # UI componenten
├── services/       # Business logica
├── utils/          # Utilities
└── styles/         # CSS modules

tests/
├── unit/           # Unit tests
└── e2e/            # E2E tests (Playwright)
```

Zie [CLAUDE.md](./CLAUDE.md#high-level-architecture) voor details.

---

## 🎨 Design System

**Color Palette:**
- Primary: Purple gradient (#6366F1 → #8B5CF6)
- Success: Green gradient (#10B981 → #059669)
- Background: Light purple/blue (#F8F9FE)

**Typography:**
- Font: System fonts
- Scale: 12px - 48px
- Weights: 500, 600, 700-800

**Inspiration:** Fastic app design met veel whitespace en duidelijke cijfers.

---

## 📱 Mobile Testing

### iPhone 13 Preview

Open `dev-preview.html` voor een real-time preview in een iPhone 13 frame:

```bash
open dev-preview.html
```

**Features:**
- ✅ Accurate viewport (390×844px)
- ✅ Device notch simulation
- ✅ Rotation toggle
- ✅ Live reload controls
- ✅ DevTools integration

### Automated Testing

```bash
# Run Playwright tests (future)
npm run test:e2e

# Run iPhone 13 tests specifically
npm run test:iphone
```

Zie [.github/MOBILE_TESTING.md](./.github/MOBILE_TESTING.md) voor complete guide.

---

## 🧪 Testing

### Test Coverage Goals
- Unit tests: > 80%
- E2E tests: Critical user flows
- Visual regression: Key components

### Test Devices
- **Primary:** iPhone 13 (390×844px)
- **Secondary:** Desktop Chrome, iPad Pro

### Running Tests

```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e

# Visual regression
npm run test:visual

# All tests
npm run test:all
```

---

## 🤝 Contributing

We verwelkomen contributions! Zie de volgende documenten:

1. **Issue aanmaken:** Gebruik een van de [issue templates](./.github/ISSUE_TEMPLATE/)
2. **Development setup:** Zie [Quick Start](#-quick-start)
3. **Coding standards:** Volg de code style in het project
4. **Testing:** Schrijf tests voor nieuwe features
5. **Pull Request:** Volg de PR template

**Good First Issues:** Check issues gelabeld met `good first issue`.

---

## 📦 Tech Stack

| Category | Technology |
|----------|-----------|
| **Frontend** | Vanilla JavaScript, HTML5, CSS3 |
| **Storage** | localStorage API |
| **Graphics** | SVG |
| **Testing** | Playwright (E2E), Vitest (Unit) |
| **Build** | Vite (future) |
| **CI/CD** | GitHub Actions |
| **Deployment** | Netlify/Vercel (planned) |

---

## 🗺️ Roadmap Highlights

### Phase 0: Foundation (Weeks 1-2) - 🟢 Current
- ✅ Team setup
- ✅ Documentation
- 🔄 Codebase refactoring
- 🔄 Testing infrastructure

### Phase 1: MVP (Weeks 3-6)
- Production-ready PWA
- Offline functionaliteit
- Polish & UX improvements

### Phase 2: Enhancement (Weeks 7-10)
- Advanced visualizations
- Gamification
- Dark mode

### Phase 3: Scale (Weeks 11-14)
- Backend & cloud sync
- Multi-device support
- Performance optimization

### Phase 4: Advanced (Weeks 15+)
- AI insights
- Wearables integration
- Native apps

Zie [ROADMAP.md](./ROADMAP.md) voor complete details.

---

## 👥 Team

| Role | Expertise |
|------|-----------|
| Product Owner | Product visie, UX strategy |
| Lead Frontend | Architecture, code reviews |
| UI Specialist | CSS, animations, responsive design |
| Data Specialist | localStorage, statistics, export |
| QA Lead | Testing strategy, quality metrics |
| Mobile QA | iOS testing, device compatibility |
| DevOps | CI/CD, deployment, monitoring |

Zie [TEAM.md](./TEAM.md) voor volledige team structuur.

---

## 🔐 Privacy & Security

- **Lokale Data:** Alle data blijft op jouw apparaat
- **Geen Tracking:** Geen analytics of tracking scripts
- **Geen Server:** Volledig client-side applicatie (Phase 0-1)
- **Gebruikerscontrole:** Volledige controle over eigen data
- **Data Export:** CSV export voor portability

---

## 📄 License

**Voor persoonlijk gebruik** - Licentie details komen in latere fase.

---

## 📧 Contact

- **GitHub:** [@mdubbelm](https://github.com/mdubbelm)
- **Repository:** [habittracker](https://github.com/mdubbelm/habittracker)
- **Issues:** [GitHub Issues](https://github.com/mdubbelm/habittracker/issues)

---

## 🙏 Acknowledgments

- Design geïnspireerd door [Fastic](https://www.fastic.com/)
- Ontwikkeld met assistance van [Claude Code](https://claude.ai/code)

---

**Built with ❤️ for a healthier lifestyle**

*Last updated: November 2025*
