# Health Tracker App - Ontwikkelingsdocumentatie

## Project Overzicht

Een moderne, mobiele-first health en habit tracker geïnspireerd op het Fastic app design. De applicatie stelt gebruikers in staat om dagelijks gezondheidsgegevens en gewoonten bij te houden met een visuele gezondheidscore.

## Functionaliteiten

### Core Tracking Features

1. **Slaap & Welzijn**
   - Slaapcijfer (1-10 schaal met slider)
   - Rugpijn niveau (0-10 schaal)
   - Dromen tracking (ja/nee)

2. **Gewicht Monitoring**
   - Dagelijkse gewichtsinvoer (kg)
   - Alleen zichtbaar 's ochtends (05:00 - 11:00)

3. **Consumptie Tracking**
   - Suiker (ja/nee + hoeveelheid in gram)
   - Alcohol (ja/nee + aantal glazen)
   - Cafeïne (ja/nee + aantal koppen)

4. **Hydratatie & Activiteit**
   - Water intake (aantal glazen)
   - Wandelen tracking (ja/nee)

5. **Custom Habits**
   - Gebruikers kunnen eigen habits toevoegen
   - Beheer via modal interface
   - Onbeperkt aantal custom habits mogelijk

### Tijdgebaseerde Zichtbaarheid

De app past de zichtbaarheid van secties aan op basis van het tijdstip:

- **Slaapsectie**: Zichtbaar tussen 18:00 - 12:00
- **Gewichtssectie**: Zichtbaar tussen 05:00 - 11:00

### Gezondheidscore Visualisatie

Een unieke feature bovenaan de homepage met:

- **Circulaire Progress Indicator** (0-100%)
- **Figuratieve menselijke illustratie** in het midden
- **Real-time score berekening** gebaseerd op:
  - Slaapcijfer (20 punten)
  - Rugpijn - lager is beter (15 punten)
  - Water intake (15 punten)
  - Gelopen (10 punten)
  - Gedroomd (5 punten - indicator van goede slaap)
  - Geen suiker (10 punten)
  - Geen alcohol (10 punten)
  - Matige cafeïne (10 punten)
  - Custom habits voltooiing (5 punten)

**Dynamische status berichten:**
- 80%+: "Uitstekend! Je bent op de goede weg! 🎉"
- 60-79%: "Goed bezig! Blijf doorgaan! 💪"
- 40-59%: "Je kunt het nog beter! 🌟"
- <40%: "Start vandaag met gezonde gewoontes!"

**Quick Stats Cards:**
- Drie frosted glass cards met slaap, water en loop status
- Live updates tijdens invoer

### Statistieken

Uitgebreide analytics met aanpasbare tijdsperiodes:

1. **Periode Selectie**
   - Laatste 7 dagen
   - Laatste 14 dagen
   - Laatste 30 dagen
   - Laatste 90 dagen
   - Alle data

2. **Statistiek Cards**
   - Gemiddeld slaapcijfer
   - Gemiddelde rugpijn
   - Gemiddeld gewicht met trend
   - Gemiddelde water intake
   - Gelopen percentage
   - Gedroomd percentage

3. **Visualisaties**
   - Gemiddelde scores bar chart
   - Gewichtstrend grafiek (laatste 30 metingen)
   - Consumptie frequentie chart
   - Custom habits voltooiingspercentages

### Data Management

- **Lokale opslag**: Alle data wordt opgeslagen in browser localStorage
- **Data geschiedenis**: Laatste 7 dagen zichtbaar in historie tab
- **CSV Export**: Volledige data export functionaliteit
- **Demo data**: 60 dagen aan realistische demo data voor nieuwe gebruikers

## Design Filosofie

### Fastic-Geïnspireerd Design

Het design is gebaseerd op moderne health app principes:

1. **Veel Whitespace**
   - Clean, onopvallende interface
   - Focus op essentiële informatie

2. **Gradient Accenten**
   - Primary: Purple gradient (#6366F1 → #8B5CF6)
   - Success: Green (#10B981 → #059669)
   - Background: Light purple/blue (#F8F9FE)

3. **Grote, Duidelijke Cijfers**
   - 48px font size voor belangrijke metrics
   - Gradient text voor extra impact
   - Bold typography (font-weight: 700-800)

4. **Card-Based Layout**
   - Strakke cards zonder ruimte ertussen
   - Minimale schaduwen
   - 16-20px border radius

5. **Bottom Navigation**
   - Moderne app-achtige navigatie
   - Drie tabs: Tracker, Stats, Historie
   - Sticky navigation met icons

### Typography

- **Font Familie**: System fonts (-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto)
- **Labels**: Uppercase met letter-spacing voor moderne look
- **Headings**: 700-800 font weight
- **Body**: 500-600 font weight

### Color Palette

```css
/* Primary Gradient */
background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%);

/* Success */
background: linear-gradient(135deg, #10B981 0%, #059669 100%);

/* Backgrounds */
--bg-main: #F8F9FE;
--bg-card: #FFFFFF;
--bg-input: #F8FAFC;

/* Text Colors */
--text-primary: #1a1a1a;
--text-secondary: #64748B;
--text-tertiary: #94A3B8;

/* Borders */
--border-light: #E2E8F0;
--border-medium: #CBD5E1;
```

## Technische Specificaties

### Technologie Stack

- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Data Opslag**: localStorage API
- **Graphics**: SVG voor illustraties en grafieken
- **Responsive**: Mobile-first design (max-width: 480px)

### Browser Compatibiliteit

- Modern browsers met localStorage support
- SVG support vereist
- CSS Grid en Flexbox support

### Bestandsstructuur

```
health-tracker.html (alles in één bestand)
├── HTML Structure
├── CSS Styles
└── JavaScript Logic
    ├── Data Management
    ├── UI Updates
    ├── Statistics Calculations
    └── Health Score Algorithm
```

## Gebruik

### Eerste Gebruik

1. Open de app - demo data wordt automatisch gegenereerd
2. Bekijk de gezondheidsvisualisatie bovenaan
3. Vul vandaag's gegevens in
4. Zie de health score live updaten

### Dagelijks Gebruik

1. Open de app op het gewenste tijdstip
2. Relevante secties zijn zichtbaar op basis van tijd
3. Vul gegevens in via sliders, inputs en checkboxes
4. Zie direct de impact op je gezondheidscore
5. Klik "Opslaan" om data op te slaan

### Custom Habits Toevoegen

1. Scroll naar "Eigen Habits" sectie
2. Klik "Beheer Habits"
3. Voeg nieuwe habit toe via het formulier
4. Verwijder habits met de "Verwijder" knop
5. Sluit modal - nieuwe habits verschijnen direct

### Statistieken Bekijken

1. Navigeer naar "Stats" tab via bottom navigation
2. Selecteer gewenste periode
3. Bekijk kaarten met gemiddeldes
4. Scroll voor gedetailleerde grafieken

### Data Exporteren

1. Ga naar "Historie" tab
2. Klik "Exporteer Data (CSV)"
3. CSV wordt gedownload met alle data

## Responsive Design

### Breakpoints

```css
@media (max-width: 600px) {
    .stats-grid {
        grid-template-columns: 1fr;
    }
    
    .container {
        max-width: 100%;
    }
}
```

### Mobile Optimalisatie

- Touch-friendly UI elementen (min 44px touch targets)
- Grote knoppen en sliders
- Bottom navigation voor duim-bereikbaarheid
- Vertical scrolling (geen horizontal scroll)
- Optimale viewport instellingen

## Code Highlights

### Health Score Algoritme

```javascript
function calculateHealthScore(data) {
    let score = 0;
    let maxScore = 100;
    
    // Sleep (20 points)
    score += (data.sleepScore / 10) * 20;
    
    // Back pain (15 points, inverse)
    score += ((10 - data.backPain) / 10) * 15;
    
    // Water (15 points)
    score += Math.min(data.waterIntake / 8, 1) * 15;
    
    // Walking (10 points)
    if (data.walked) score += 10;
    
    // Dreaming (5 points)
    if (data.dreamed) score += 5;
    
    // No sugar (10 points)
    if (!data.sugarConsumed) score += 10;
    
    // No alcohol (10 points)
    if (!data.alcoholConsumed) score += 10;
    
    // Moderate caffeine (10 points)
    if (!data.caffeineConsumed || data.caffeineAmount <= 2) {
        score += 10;
    }
    
    // Custom habits (5 points)
    const habitsScore = calculateHabitsScore(data.customHabits);
    score += habitsScore * 5;
    
    return Math.round(score);
}
```

### Real-time Updates

De app gebruikt event listeners om de gezondheidscore live te updaten:

```javascript
// Sliders
document.getElementById('sleepScore').addEventListener('input', updateHealthScorePreview);

// Checkboxes en inputs
['dreamed', 'walked', 'waterIntake', ...].forEach(id => {
    document.getElementById(id).addEventListener('change', updateHealthScorePreview);
});
```

### SVG Circulaire Progress

```javascript
// Circumference = 2πr
const circumference = 534.07;
const offset = circumference - (healthScore / 100) * circumference;
progressCircle.style.strokeDashoffset = offset;
```

## Toekomstige Uitbreidingen

Mogelijke verbeteringen:

1. **Cloud Sync**
   - Account systeem
   - Data synchronisatie tussen devices

2. **Notificaties**
   - Herinneringen voor tracking
   - Motiverende berichten

3. **Trends & Insights**
   - AI-gebaseerde inzichten
   - Voorspellingen en aanbevelingen

4. **Social Features**
   - Vrienden toevoegen
   - Challenges delen
   - Leaderboards

5. **Advanced Analytics**
   - Correlatie analyses
   - Export naar health apps
   - Integratie met wearables

6. **Customization**
   - Thema's (light/dark mode)
   - Personaliseerbare scoring
   - Widget layouts

## Privacy & Security

- **Lokale Data**: Alle data blijft op het apparaat
- **Geen Tracking**: Geen analytics of tracking scripts
- **Geen Server**: Volledig client-side applicatie
- **Gebruikerscontrole**: Volledige controle over eigen data

## Accessibility

Toegankelijkheidsfeatures:

- Semantische HTML
- ARIA labels waar nodig
- Keyboard navigatie
- Touch-friendly UI
- Contrast ratios voldoen aan WCAG richtlijnen
- Schaalbare tekst

## Browser Opslag

De app gebruikt localStorage voor persistentie:

```javascript
// Data structure
{
    "trackerData": [...],      // Array van dagelijkse entries
    "customHabits": [...]      // Array van custom habits
}
```

**Opslag Limiet**: ~5-10MB (afhankelijk van browser)

## Conclusie

De Health Tracker app combineert modern design met praktische functionaliteit. De focus ligt op gebruiksvriendelijkheid, visuele feedback en motivatie door de unieke gezondheidscore visualisatie. De app is volledig responsive, werkt offline en respecteert de privacy van gebruikers door alle data lokaal op te slaan.

---

**Ontwikkeld**: November 2024  
**Versie**: 1.0  
**Platform**: Web (Progressive Web App ready)  
**Licentie**: Voor persoonlijk gebruik
