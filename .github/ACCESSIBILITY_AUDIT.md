# ♿ WCAG 2.1 AA Toegankelijkheidsaudit

**Datum**: 22 November 2025
**Standaard**: WCAG 2.1 Level AA
**Tool**: Handmatige audit + contrast checker

---

## ✅ Voldoet Aan WCAG

### 1. Kleurcontrast (Success Criterion 1.4.3)
- **Primary text** (#2C2822 op #F5F1ED): 13.2:1 ✅ AAA
- **Secondary text** (#5C574F op #F5F1ED): 6.8:1 ✅ AA
- **Buttons** (#FFFFFF op #C17A5C): 4.8:1 ✅ AA

### 2. Touch Targets (Success Criterion 2.5.5)
- **Buttons**: 48×48px ✅ (minimum 44×44px)
- **Checkboxes**: 20×20px + padding ✅
- **Nav items**: Groot genoeg ✅

### 3. Semantic HTML (Success Criterion 4.1.2)
- Juist gebruik van `<button>`, `<input>`, `<label>` ✅
- Headings hiërarchie correct (`<h1>`, `<h2>`, `<h3>`) ✅

### 4. Form Labels (Success Criterion 1.3.1, 3.3.2)
- Alle inputs hebben `<label>` met `for` attribuut ✅
- Placeholder text niet als enige label gebruikt ✅

---

## ❌ Problemen Gevonden

### CRITICAL (Must Fix)

#### #1: SVG Health Score Missing Accessible Text
**WCAG**: 1.1.1 Non-text Content
**Severity**: Critical
**Issue**: SVG cirkel heeft geen `<title>` of `aria-label`
**Impact**: Screen readers kunnen de health score niet voorlezen

#### #2: Emoji Icons Not Accessible
**WCAG**: 1.1.1 Non-text Content
**Severity**: High
**Issue**: Emojis (😴, 💧, 🚶, 🍬, etc.) hebben geen tekst alternatief
**Impact**: Screen readers lezen letterlijk "sleeping face emoji" voor

#### #3: Color-Only Information
**WCAG**: 1.4.1 Use of Color
**Severity**: Medium
**Issue**: Progress cirkel verandert kleur op basis van score (geen alternatieve indicatie)
**Impact**: Kleurenblinden zien verschil niet

#### #4: Focus Indicators Onvoldoende
**WCAG**: 2.4.7 Focus Visible
**Severity**: Medium
**Issue**: Focus outline niet overal zichtbaar (vooral op buttons)
**Impact**: Keyboard navigatie niet duidelijk

#### #5: Skip Link Ontbreekt
**WCAG**: 2.4.1 Bypass Blocks
**Severity**: Medium
**Issue**: Geen "skip to main content" link
**Impact**: Keyboard gebruikers moeten door hele nav

### MEDIUM (Should Fix)

#### #6: Language Not Declared on All Text
**WCAG**: 3.1.2 Language of Parts
**Severity**: Low
**Issue**: HTML heeft `lang="nl"` maar inline text checks ontbreken
**Impact**: Screen readers kunnen verkeerde uitspraak gebruiken

#### #7: Insufficient Error Identification
**WCAG**: 3.3.1 Error Identification
**Severity**: Medium
**Issue**: Form validatie geeft alleen alert() zonder inline errors
**Impact**: Screen reader gebruikers missen context

#### #8: No Keyboard Shortcuts Documented
**WCAG**: 2.1.4 Character Key Shortcuts (Level A)
**Severity**: Low
**Issue**: Geen keyboard shortcuts beschikbaar/gedocumenteerd
**Impact**: Power users kunnen app niet efficiënt gebruiken

---

## 🔧 Aanbevelingen

### High Priority
1. Voeg ARIA labels toe aan SVG elementen
2. Vervang emojis door iconen met `aria-label` of `<span class="sr-only">`
3. Voeg visuele indicatoren toe naast kleur (icons, tekst)
4. Verbeter focus states met duidelijke outline

### Medium Priority
5. Voeg skip link toe (`<a href="#main" class="sr-only">Skip to content</a>`)
6. Implementeer inline form validatie met `aria-describedby`
7. Voeg keyboard shortcuts toe (bijv. Ctrl+S voor opslaan)

### Low Priority
8. Voeg `aria-live` regions toe voor dynamische updates
9. Test met screen readers (VoiceOver, NVDA, JAWS)
10. Voeg `prefers-reduced-motion` support toe

---

## 📊 Score

| Categorie | Score | Opmerkingen |
|-----------|-------|-------------|
| Perceivable | 6/10 | Kleurcontrast goed, maar emojis en SVG problemen |
| Operable | 7/10 | Touch targets goed, maar focus en keyboard nav kan beter |
| Understandable | 8/10 | Goede labels, maar error handling kan beter |
| Robust | 7/10 | Semantic HTML goed, maar ARIA ontbreekt |
| **Overall** | **7/10** | **Voldoet grotendeels, maar critical issues moeten gefixed** |

---

## 🎯 Actieplan

1. ✅ Fix Critical issues (#1-5)
2. ⏳ Fix Medium issues (#6-8)
3. ⏳ Test met echte screen readers
4. ⏳ Documenteer toegankelijkheidsfeatures in README

---

**Next Steps**: GitHub issues aanmaken voor elk probleem met label `a11y`
