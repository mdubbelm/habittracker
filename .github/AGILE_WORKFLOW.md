# Agile/DevOps Workflow

**Health Tracker Project**
**Laatst bijgewerkt**: 22 November 2024

---

## 🎯 Ons Agile Framework

We volgen een **Scrum-based** workflow met **DevOps** principes.

**Sprint lengte**: 2 weken
**Team size**: 15 specialisten (zie TEAM.md)
**Ceremonies**: Daily standup, planning, review, retrospective

---

## 🔄 Workflow Overview

```
Backlog → Sprint Planning → Development → Testing → Review → Deploy → Retrospective
   ↑                                                                        ↓
   └────────────────────────── Feedback Loop ─────────────────────────────┘
```

---

## 📅 Sprint Ceremonies

### 1. Sprint Planning (Start van sprint)
**Duur**: 2 uur
**Deelnemers**: Hele team
**Doel**: Bepalen wat we gaan bouwen

**Agenda**:
1. **Product Owner** presenteert prioriteiten
2. **Team** schat effort (story points)
3. **Team** committed aan sprint goal
4. **Issues** worden assigned aan team members
5. **Definition of Done** wordt bevestigd

**Output**:
- Sprint backlog (geselecteerde issues)
- Sprint goal (1 zin: "Deze sprint maken we...")
- Team capacity en velocity berekend

### 2. Daily Standup (Elke dag)
**Duur**: 15 minuten
**Tijd**: 10:00 CET
**Format**: Async (Slack) of sync (video call)

**3 Vragen per persoon**:
1. Wat heb je **gisteren** gedaan?
2. Wat ga je **vandaag** doen?
3. Heb je **blockers**?

**Regels**:
- Kort en bondig
- Geen problem-solving (neem offline)
- Focus op sprint goal
- Update GitHub issue status

### 3. Sprint Review (Einde sprint)
**Duur**: 1.5 uur
**Deelnemers**: Team + stakeholders

**Agenda**:
1. **Demo** van completed work
2. **Feedback** van Product Owner
3. **Metrics** (velocity, burn-down)
4. **Beslissing**: Ship it? Iterate?

**Output**:
- Sprint review document (zie `.sprint-review/`)
- Accept/reject beslissing per feature
- Updated backlog priorities

### 4. Sprint Retrospective (Na review)
**Duur**: 1 uur
**Deelnemers**: Team (zonder stakeholders)

**Format**: Start/Stop/Continue

**Vragen**:
- Wat ging **goed**?
- Wat ging **fout**?
- Wat gaan we **verbeteren**?

**Output**:
- Action items voor volgende sprint
- Process improvements
- Updated workflows (als nodig)

---

## 🎫 Issue Lifecycle

### 1. Issue Creation
**Wie**: Iedereen (team, PO, community)

**Required**:
- [ ] Clear title: `[TYPE] Short description`
- [ ] Description met context
- [ ] Labels: type, priority, area
- [ ] Acceptance criteria (voor features)
- [ ] Effort estimate (S/M/L/XL)

**Templates**:
- Bug report
- Feature request
- Task
- Design review

### 2. Issue Grooming
**Wie**: Product Owner + Lead Frontend
**Wanneer**: Weekly (tussen sprints)

**Acties**:
- Prioritize backlog
- Add details waar nodig
- Estimate effort
- Assign to milestone
- Label correctie

### 3. Issue Assignment
**Wie**: Project Manager (sprint planning)

**Criteria**:
- Skills match
- Capacity availability
- Priority
- Dependencies

### 4. Development
**Developer checklist**:
- [ ] Assign issue to self
- [ ] Move to "In Progress" (GitHub project)
- [ ] Create feature branch (`feature/issue-15-design-improvements`)
- [ ] Code + tests
- [ ] Self-review tegen DoD
- [ ] Push en create PR

### 5. Code Review
**Reviewer checklist**:
- [ ] Code quality (style guide)
- [ ] Tests aanwezig en groen
- [ ] DoD checklist compleet
- [ ] No security issues
- [ ] Performance OK
- [ ] Approve of Request Changes

**Required approvals**: Minimum 1 (Lead Frontend for critical changes)

### 6. Testing
**QA checklist**:
- [ ] Manual testing op iPhone 13
- [ ] Cross-browser testing
- [ ] Accessibility audit
- [ ] Regression testing
- [ ] Screenshot documentation

### 7. Merge & Deploy
**DevOps checklist**:
- [ ] PR approved
- [ ] Tests groen
- [ ] Merge to main
- [ ] CI/CD pipeline runs
- [ ] Deploy to staging
- [ ] Smoke test
- [ ] Deploy to production (if approved)

### 8. Issue Close
**Criteria**:
- [ ] Code merged
- [ ] Deployed to production
- [ ] Acceptance criteria voldaan
- [ ] Documentation updated
- [ ] PO accepts

---

## 🌳 Branch Strategy

### Main Branches
- **`main`**: Production-ready code (protected)
- **`develop`**: Integration branch (als we team groter wordt)

### Feature Branches
**Naming**: `feature/issue-NUMBER-short-description`

**Example**: `feature/issue-15-design-improvements`

**Workflow**:
1. Branch from `main`
2. Commit vaak (descriptive messages)
3. Push to origin
4. Create PR when ready
5. After merge: Delete branch

### Hotfix Branches
**Naming**: `hotfix/issue-NUMBER-short-description`

**Example**: `hotfix/issue-25-water-counter-bug`

**Workflow**:
1. Branch from `main`
2. Quick fix + test
3. Fast-track review
4. Merge en deploy immediately

---

## 🔀 Pull Request Process

### PR Creation
**Template**:
```markdown
## Beschrijving
Wat doet deze PR?

## Gerelateerde Issues
Closes #15

## Type Change
- [ ] Bug fix
- [x] New feature
- [ ] Breaking change

## DoD Checklist
[Copy from DEFINITION_OF_DONE.md]

## Screenshots
Voor/na screenshots (bij UI changes)

## Testing
Hoe heb je dit getest?
```

### PR Review
**Reviewers**:
- **Code**: @LeadFrontend
- **Design**: @UXDesigner
- **QA**: @QALead

**Review time**: Binnen 24 uur

**Status labels**:
- 🟡 Waiting for review
- 🔵 In review
- 🟢 Approved
- 🔴 Changes requested

### PR Merge
**Squash and merge** (default)
**Merge message**: Descriptive (niet "Merge PR #123")

**Example**: `Add design improvements: quick stats, water visual, gradients (#15)`

---

## 📊 Metrics & Monitoring

### Sprint Metrics
- **Velocity**: Story points per sprint
- **Burn-down**: Daily progress tracking
- **Cycle time**: Issue open → close
- **Lead time**: Idea → production

### Quality Metrics
- **Code coverage**: Target 80%
- **Bug rate**: Bugs per sprint
- **DoD compliance**: % PRs passing first time
- **Review time**: Avg time to review PR

### Accessibility Metrics
- **WCAG compliance**: % features AA compliant
- **Contrast ratios**: All text readable
- **Touch targets**: % >= 44×44px

---

## 🚀 Release Process

### Release Types
- **Patch**: Bug fixes (v1.0.1)
- **Minor**: New features (v1.1.0)
- **Major**: Breaking changes (v2.0.0)

### Release Checklist
- [ ] All milestone issues closed
- [ ] All tests groen
- [ ] Manual testing passed
- [ ] Accessibility audit passed
- [ ] Performance audit passed
- [ ] Release notes geschreven
- [ ] CHANGELOG.md updated
- [ ] Version bump (package.json)
- [ ] Git tag created
- [ ] Deploy to production
- [ ] Smoke test
- [ ] Announce release

---

## 🔧 Tools & Automation

### GitHub
- **Issues**: Task tracking
- **Projects**: Kanban board
- **Actions**: CI/CD pipeline
- **Pull Requests**: Code review
- **Milestones**: Sprint planning

### CI/CD Pipeline
**On PR**:
- Run linters (ESLint, Prettier)
- Run unit tests
- Run E2E tests
- Check code coverage
- Build production bundle

**On Merge to main**:
- Deploy to staging
- Run smoke tests
- Deploy to production (manual approval)

### Quality Gates
**PR cannot merge if**:
- ❌ Tests failing
- ❌ Coverage < 80%
- ❌ Linter errors
- ❌ No approvals

---

## 👥 Team Roles in Workflow

### Product Owner
- Prioritize backlog
- Define acceptance criteria
- Accept/reject features in review
- Update roadmap

### Project Manager
- Sprint planning facilitation
- Daily standup facilitation
- Remove blockers
- Track metrics

### Lead Frontend
- Architecture decisions
- Code review (critical PRs)
- Technical debt management
- Mentorship

### Developers
- Implement features
- Write tests
- Code review (peer)
- Documentation

### QA Team
- Test plan creation
- Manual testing
- Automation
- Bug reporting

### DevOps
- CI/CD maintenance
- Deployment
- Monitoring
- Performance

### UX/UI Design
- Design approval
- Accessibility review
- Design system maintenance
- User research

---

## 🎓 Onboarding

### Week 1: Setup
- [ ] Repository access
- [ ] Read CLAUDE.md, CONTRIBUTING.md, TEAM.md
- [ ] Setup local environment
- [ ] Attend daily standup
- [ ] Shadow sprint review

### Week 2: Small Tasks
- [ ] Pick "good first issue"
- [ ] Create PR
- [ ] Participate in code review
- [ ] Write tests

### Week 3: Feature Work
- [ ] Full feature assignment
- [ ] Mentorship with lead
- [ ] Own issue from start to finish

### Week 4: Full Sprint
- [ ] Sprint planning participation
- [ ] Own multiple issues
- [ ] Review others' PRs
- [ ] Retrospective participation

---

## 📝 Documentation Standards

### Code Documentation
- JSDoc for all functions
- Inline comments for complex logic
- README voor major components
- Architecture Decision Records (ADRs)

### Process Documentation
- This file (AGILE_WORKFLOW.md)
- DEFINITION_OF_DONE.md
- CONTRIBUTING.md
- Sprint review documents

---

## 🔄 Continuous Improvement

### Retrospective Action Items
Track in `.retrospectives/YYYY-MM-DD.md`

**Template**:
```markdown
## What went well
- Item 1
- Item 2

## What went wrong
- Issue 1
- Issue 2

## Action items
- [ ] Improvement 1 (Owner: @person)
- [ ] Improvement 2 (Owner: @person)
```

### Process Updates
- Review DoD quarterly
- Update workflow after major issues
- Team vote on big changes

---

## 🚨 Escalation Path

### Issue Blocker
1. Mention in daily standup
2. Tag @ProjectManager in issue
3. Emergency meeting if critical

### Code Review Stalled
1. Ping reviewer (after 24h)
2. Request backup reviewer
3. Escalate to @LeadFrontend

### Production Bug
1. Create hotfix branch
2. Fast-track review
3. Deploy ASAP
4. Postmortem later

---

## ✅ Success Criteria

We zijn succesvol als:
- 🟢 Sprint goal wordt 80%+ gehaald
- 🟢 DoD compliance > 90%
- 🟢 Code review < 24h
- 🟢 Zero critical bugs in production
- 🟢 Team satisfaction > 8/10
- 🟢 Velocity stabiel (±10%)

---

**Owner**: @ProjectManager
**Last review**: 22 November 2024
**Next review**: Einde Sprint 1
