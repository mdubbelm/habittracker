---
description: Sluit de sessie af met VOLLEDIGE documentatie update
---

# End Session - Habittracker

**🚨 VOLLEDIGE CHECKLIST UITVOEREN - GEEN SHORTCUTS 🚨**

## Scheiding van projecten

```
habittracker/          ← App development
├── blog/              ← Symlink naar devblog/content/habittracker/
└── ...

devblog/               ← Hugo blog site (vibemo.netlify.app)
├── content/
│   └── habittracker/  ← Blog posts over het bouwproces
└── ...
```

**Vuistregel:**
- App code + blogposts schrijven → werk in `habittracker`
- Blog config/theme/andere content → open `devblog` apart

---

Voer ALLE stappen uit voordat je afsluit:

## 1. ⏱️ Time Tracking

```bash
ls .time-tracking/
```

Maak een nieuw bestand `.time-tracking/SESSION_XXX.md` met:

```markdown
# Session XXX - [Datum]

## Tijdsinvestering
- **Datum**: [vandaag]
- **Geschatte tijd**: ~X uur
- **User tijd**: X minuten
- **AI tijd**: X minuten

## Wat is er gedaan
- [Lijst van taken]

## Commits
- [commit hash] - [message]

## Volgende stappen
- [wat moet er nog gebeuren]
```

## 2. 📖 Blog Post Schrijven

Maak een nieuwe blogpost in `blog/` met de template `blog/_template.md`:

**Bestandsnaam:** `blog/YYYY-MM-DD-[korte-titel].md`

**BELANGRIJK - Schrijfstijl:**
- Persoonlijk, niet droog
- Vertel het als een verhaal, niet als een changelog
- Include emoties, realisaties, "holy shit" momenten
- Concrete learnings, niet alleen feiten
- Code snippets alleen waar ze het verhaal versterken

**YAML frontmatter verplicht (FLAT, geen nesting!):**
```yaml
---
title: "[pakkende titel - sentence case]"
date: YYYY-MM-DD
session: X
tags: [relevante, tags]
user_time: "X min"
ai_time: "X uur"
efficiency: "1:X"
mood: "🎯"
---
```

**Update ook `blog/_index.md`:**
- Voeg nieuwe post toe aan de tabel
- Update cumulative stats

## 3. 📊 GitHub Issues

```bash
gh issue list --state open
```

- Sluit afgeronde issues: `gh issue close #XX --comment "Done in [commit]"`
- Update open issues met voortgang indien nodig
- Maak nieuwe issues aan voor ontdekt werk

## 4. 💾 Session Status

Update `.session-status.json` met:
- sessionNumber (increment)
- timestamp
- duration
- summary
- filesModified
- commits
- issuesManaged
- completedThisSession
- nextSteps

## 5. 📸 Screenshots (bij visuele changes)

Als er UI/UX wijzigingen zijn, maak screenshots voor de blog:

```bash
# Start dev server (als niet al draait)
npm run dev &

# Maak screenshots met versienummer
node scripts/capture-screenshots.js --version=vX.X.X

# Of met automatische versie uit package.json
node scripts/capture-screenshots.js
```

Screenshots komen in: `screenshots/YYYY-MM-DD_vX.X.X/`

**Voor de blog:**
- Kopieer relevante screenshots naar `~/Projecten/devblog/static/images/habittracker/`
- Verwijs in blogpost: `![Beschrijving](/images/habittracker/screenshot.png)`

---

## 6. ✅ Final Commit & Push - Habittracker

```bash
git add -A
git commit -m "docs: session X - [korte beschrijving]"
git push
```

## 7. 🌐 Devblog Sync & Deploy

**BELANGRIJK:** Blog posts staan via symlink in devblog. Na elke blogpost moet devblog ook gepusht worden!

```bash
cd ~/Projecten/devblog
git add -A
git status
```

Als er changes zijn:

```bash
git commit -m "content: habittracker session X"
git push
```

Dit triggert automatisch een Netlify deploy.

**Check:** https://vibemo.netlify.app/habittracker/

---

**Bevestig aan de gebruiker:**
- Welke blogpost is geschreven
- Devblog deploy status (gepusht ja/nee)
- Welke issues zijn gesloten/aangemaakt
- Wat de volgende sessie focus zou kunnen zijn

Wens de gebruiker een fijne dag!
