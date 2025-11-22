# 📋 GitHub Project Board Setup

## Quick Setup (5 minuten)

### Stap 1: Maak een Project aan
1. Ga naar https://github.com/mdubbelm/habittracker
2. Klik op **"Projects"** tab (bovenaan)
3. Klik **"New project"** (groen knopje)
4. Kies **"Board"** template (Kanban style)
5. Naam: **"Health Tracker - Phase 0"**
6. Klik **"Create"**

### Stap 2: Configureer Kolommen
Je krijgt automatisch deze kolommen:
- 📋 **Todo** (nieuwe issues)
- 🏃 **In Progress** (waar je aan werkt)
- ✅ **Done** (afgerond)

### Stap 3: Voeg Issues toe
1. In het project board, klik **"+ Add item"**
2. Type **#** en selecteer alle issues (#1 t/m #8)
3. Of: Sleep issues vanuit de Issues tab naar het board

### Stap 4: Organiseer
Sleep de issues naar de juiste kolommen:

**📋 Todo:**
- #1 - Development Environment & Build Tools
- #2 - Testing Infrastructure
- #3 - Refactor HTML naar Modules
- #4 - CI/CD Pipeline
- #5 - Data Management Layer
- #6 - Health Score Algorithm Testing
- #7 - Code Quality Tools ⭐ (start hier!)

**🏃 In Progress:**
- #8 - Security & Privacy Audit (we zijn er al mee bezig!)

**✅ Done:**
- (nog leeg)

---

## Pro Tips

### Gebruik Views
GitHub Projects heeft meerdere views:
1. **Board view** - Kanban style (default)
2. **Table view** - Spreadsheet style
3. **Roadmap view** - Timeline met deadlines

**Schakel tussen views** via het dropdown bovenaan.

### Filters
Voeg filters toe om focus te houden:
- **Priority = Critical** → Zie alleen kritieke issues
- **Label = good first issue** → Perfect voor nieuwe contributors
- **Milestone = Phase 0** → Alleen deze sprint

### Automatisering
GitHub kan automatisch issues verplaatsen:
1. Ga naar **Settings** (⚙️ icoon rechtsboven in project)
2. Klik **"Workflows"**
3. Enable:
   - **"Item added to project"** → Zet in "Todo"
   - **"Item closed"** → Verplaats naar "Done"
   - **"Pull request merged"** → Verplaats naar "Done"

---

## Alternatief: GitHub CLI (als je permissions hebt)

```bash
# Refresh auth met project scopes
gh auth refresh -s project,read:project

# Create project
gh project create --owner mdubbelm --title "Health Tracker - Phase 0"

# Link issues (project number from URL)
gh project item-add 1 --owner mdubbelm --url https://github.com/mdubbelm/habittracker/issues/1
# ... repeat voor alle issues
```

---

## Voorbeeld Project URL

Na setup: `https://github.com/users/mdubbelm/projects/1` (of /2, /3, etc.)

**Bookmark deze URL** voor quick access!

---

## Daily Workflow

### Morning
1. Open project board
2. Check "In Progress" - wat doe ik vandaag?
3. Move een issue van "Todo" → "In Progress"

### During Day
1. Update issue met comments/progress
2. Link PRs aan issues (#8 in PR beschrijving)
3. Move tussen kolommen als status wijzigt

### End of Day
1. Update issue status
2. Move completed work → "Done"
3. Plan morgen (move volgende issue naar "In Progress")

---

## Sprint Planning

### Weekly Review (bijv. elke Maandag)
1. Review "Done" kolom → Wat hebben we bereikt?
2. Gesloten issues archiveren (optional)
3. Plan nieuwe issues voor deze week
4. Prioriteer "Todo" kolom (sleep belangrijkste naar boven)

### Sprint Retrospective
1. Hoeveel issues done vs planned?
2. Blockers? Voeg label "status: blocked" toe
3. Adjust planning voor volgende week

---

## Mobile Access

GitHub Projects werkt ook op mobile!
- Open GitHub app
- Navigeer naar repository
- Tap "Projects"
- Swipe tussen kolommen

Perfect voor snel updates doen onderweg.

---

## Tips voor Solo Developers

### Gebruik Custom Fields
Voeg extra velden toe voor tracking:
1. **Effort** (dropdown: XS, S, M, L, XL)
2. **Priority** (number: 1-5)
3. **Sprint** (text: "Sprint 1", etc.)

### Voeg Notes toe
Klik **"+ Add item"** → "Add note" voor:
- Quick TODOs zonder issue
- Brainstorm ideeën
- Weekly goals

### Koppelingen
Link gerelateerde issues:
- In issue beschrijving: "Related to #5"
- In comments: "Blocks #7"
- GitHub maakt automatisch links

---

## Troubleshooting

**Q: Ik zie geen Projects tab?**
A: Check repository settings → Features → Enable "Projects"

**Q: Kan geen project aanmaken?**
A: Je hebt admin rechten nodig op de repo

**Q: Issues verschijnen niet in project?**
A: Voeg ze handmatig toe via "+ Add item"

---

**Klaar!** 🎉

Je hebt nu een visual Kanban board om je issues te tracken!

**Next**: Open het board en sleep #8 (Security Audit) naar "In Progress"
