# Definition of Done (DoD)

**Health Tracker Project**
**Laatst bijgewerkt**: 22 November 2024

---

## 🎯 Purpose

Dit document definieert wanneer een user story, feature, of bug fix "done" is. Alle team members moeten zich hieraan houden voordat work naar production gaat.

---

## ✅ General Definition of Done

Een feature/story is **DONE** wanneer:

### 1. Code Quality
- [ ] Code is geschreven volgens style guide (CONTRIBUTING.md)
- [ ] Code is peer reviewed (minimum 1 approval)
- [ ] Geen console.log() statements in production code
- [ ] Geen commented-out code
- [ ] No magic numbers (use constants with comments)
- [ ] Functions zijn gedocumenteerd (JSDoc)

### 2. Testing
- [ ] **Unit tests** geschreven voor nieuwe functies (target: 80% coverage)
- [ ] **Manual testing** gedaan op target device (iPhone 13)
- [ ] **Cross-browser** testing passed (Safari, Chrome, Firefox)
- [ ] **Regression testing**: Bestaande features werken nog
- [ ] Alle tests zijn groen (geen failing tests)

### 3. Accessibility
- [ ] **WCAG 2.1 AA** compliant
- [ ] **Contrast ratios** voldoen (4.5:1 voor normal text, 3:1 voor large)
- [ ] **Keyboard navigatie** werkt (tab order logisch)
- [ ] **Touch targets** >= 44×44px voor interactive elements
- [ ] **Screen reader** compatible (aria-labels waar nodig)
- [ ] **Focus indicators** zichtbaar (outline of custom)

### 4. Documentation
- [ ] **Code comments** toegevoegd waar nodig
- [ ] **README** updated (als public API changes)
- [ ] **CLAUDE.md** updated (als architecture changes)
- [ ] **Inline documentation** voor complexe logica
- [ ] **Screenshots** updated (als UI changes)

### 5. GitHub Process
- [ ] **GitHub issue** exists en is up-to-date
- [ ] **Branch** created from main (feature/*, bugfix/*, design/*)
- [ ] **Commits** zijn descriptive (niet "fix", maar "Fix water glass animation bug")
- [ ] **Pull Request** aangemaakt met description
- [ ] **PR linked** to issue (Closes #X)
- [ ] **Labels** correct (type, priority, area)
- [ ] **Reviewers** assigned

### 6. Design
- [ ] **Design approved** door @UXDesigner
- [ ] **Mobile-first** approach gevolgd
- [ ] **Responsive** op 390px (iPhone 13) en 768px+ (desktop)
- [ ] **Design system** consistency (colors, spacing, typography)
- [ ] **Safe area** handling (notch, bottom bar)

### 7. Security
- [ ] **Input validation** geïmplementeerd
- [ ] **XSS prevention** toegepast (sanitize user input)
- [ ] **No secrets** in code (geen hardcoded tokens, API keys)
- [ ] **Dependencies** up-to-date (no known vulnerabilities)

### 8. Performance
- [ ] **Load time** < 2s on 3G (target)
- [ ] **60fps animations** (geen janky transitions)
- [ ] **No layout thrashing** (minimize reflows)
- [ ] **localStorage** usage within limits (< 5MB)

---

## 🎨 Design-Specific DoD

Voor design changes (UI/UX):

- [ ] **Moodboard** reference check (aligned with vision)
- [ ] **Accessibility audit** passed
- [ ] **Visual regression** check (screenshots voor/na)
- [ ] **Gradient contrast** validated
- [ ] **Touch target** size validated (>= 44×44px)
- [ ] **Spacing consistency** check (design tokens used)

---

## 🧪 Testing-Specific DoD

Voor testing work:

- [ ] **Test plan** documented
- [ ] **Unit tests** voor nieuwe features (target 80% coverage)
- [ ] **E2E tests** voor critical user flows
- [ ] **Manual test cases** documented
- [ ] **Bug reports** created voor found issues
- [ ] **Test results** documented (pass/fail, screenshots)

---

## 🐛 Bug Fix DoD

Voor bug fixes:

- [ ] **Root cause** identified en gedocumenteerd
- [ ] **Regression test** added (zodat bug niet terugkomt)
- [ ] **Related bugs** checked (zijn er meer instances?)
- [ ] **User impact** assessed (hoe erg was de bug?)
- [ ] **Postmortem** (voor critical bugs)

---

## 📦 Release DoD

Voor releases naar production:

- [ ] **All issues** in milestone completed
- [ ] **All tests** green (unit + E2E)
- [ ] **Manual testing** on real device (iPhone 13)
- [ ] **Accessibility audit** passed
- [ ] **Performance audit** passed
- [ ] **Security audit** passed (no vulnerabilities)
- [ ] **Release notes** written
- [ ] **CHANGELOG** updated
- [ ] **Version bump** (package.json)
- [ ] **Git tag** created
- [ ] **Deployment** succesvol
- [ ] **Smoke test** on production
- [ ] **Rollback plan** ready

---

## 🚫 Not Done Until...

Een feature is **NIET** done als:

- ❌ Tests falen
- ❌ Code review pending
- ❌ Accessibility audit niet gedaan
- ❌ Manual testing op iPhone 13 niet gedaan
- ❌ PR niet gemerged
- ❌ Issue niet closed
- ❌ Breaking changes zonder migration guide
- ❌ Dependencies met known vulnerabilities

---

## 🔄 DoD Review Process

1. **Developer** checkt DoD voordat PR aanmaken
2. **Reviewer** checkt DoD tijdens code review
3. **QA** checkt testing DoD
4. **Product Owner** checkt acceptance criteria
5. **Lead Frontend** final check voor merge

---

## 📋 DoD Checklist Template

Copy-paste dit in PR description:

```markdown
## Definition of Done Checklist

### Code Quality
- [ ] Code follows style guide
- [ ] Peer reviewed (1+ approval)
- [ ] No console.log in production
- [ ] Functions documented

### Testing
- [ ] Unit tests (80% coverage)
- [ ] Manual testing on iPhone 13
- [ ] Cross-browser tested
- [ ] Regression testing passed

### Accessibility
- [ ] WCAG 2.1 AA compliant
- [ ] Contrast ratios OK
- [ ] Keyboard navigation works
- [ ] Touch targets >= 44×44px
- [ ] Screen reader compatible

### Documentation
- [ ] Code comments added
- [ ] Docs updated
- [ ] Screenshots updated (if UI change)

### GitHub
- [ ] Issue exists and linked
- [ ] Branch from main
- [ ] Descriptive commits
- [ ] Labels correct

### Design (if applicable)
- [ ] Design approved
- [ ] Mobile-first
- [ ] Responsive
- [ ] Design system consistent

### Security
- [ ] Input validation
- [ ] XSS prevention
- [ ] No secrets in code
```

---

## 🎓 Training

Nieuwe team members moeten:
1. Dit document lezen
2. DoD checklist gebruiken voor eerste 3 PRs
3. DoD review doen met Lead Frontend

---

## 📊 Metrics

We tracken:
- % of PRs that pass DoD first time
- Average time to meet DoD
- Most common DoD violations

**Target**: 90% of PRs pass DoD checklist on first review

---

## 🔄 Updates

Dit document wordt bijgewerkt:
- Na elke retrospective (als team feedback heeft)
- Bij major process changes
- Bij nieuwe compliance requirements

**Next review**: Na Sprint 1

---

**Owner**: @ProjectManager
**Approved by**: @LeadFrontend, @ProductOwner, @QALead
