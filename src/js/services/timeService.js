/**
 * Time-Based Visibility Service
 *
 * Bepaalt welke tracking secties zichtbaar zijn op basis van tijd van de dag
 * en of de gebruiker een tijdvenster heeft gemist.
 *
 * @module services/timeService
 */

// Tijdvenster definities
export const TIME_WINDOWS = {
    morning: { start: 6, end: 10 }, // 06:00 - 10:00 (slaap, rugpijn, dromen)
    weight: { start: 5, end: 12 }, // 05:00 - 12:00 (ruimer venster voor gewicht)
    evening: { start: 20, end: 24 } // 20:00 - 23:59
};

/**
 * Haal het huidige uur op (voor testing kan dit worden overschreven)
 * @returns {number} Huidig uur (0-23)
 */
export function getCurrentHour() {
    return new Date().getHours();
}

/**
 * Check of het huidige tijdstip binnen een tijdvenster valt
 * @param {"morning" | "evening"} window - Het tijdvenster om te checken
 * @returns {boolean}
 */
export function isInTimeWindow(window) {
    const hour = getCurrentHour();
    const config = TIME_WINDOWS[window];
    if (!config) {
        return false;
    }
    return hour >= config.start && hour < config.end;
}

/**
 * Bepaal het huidige actieve tijdvenster
 * @returns {"morning" | "evening" | "day"}
 */
export function getCurrentTimeWindow() {
    const hour = getCurrentHour();
    if (hour >= TIME_WINDOWS.morning.start && hour < TIME_WINDOWS.morning.end) {
        return 'morning';
    }
    if (hour >= TIME_WINDOWS.evening.start) {
        return 'evening';
    }
    return 'day';
}

/**
 * Check of de gebruiker een tijdvenster heeft gemist
 * @param {Object|null} todayData - Data van vandaag uit storage
 * @returns {{missedMorning: boolean}}
 */
export function getMissedWindows(todayData) {
    const hour = getCurrentHour();
    const data = todayData || {};

    // Check of ochtend VOLLEDIG is ingevuld EN expliciet opgeslagen
    // Dit voorkomt dat de fallback banner verdwijnt na invullen van 1 veld
    const morningComplete = isSectionComplete(data, 'morning');

    // Gemiste ochtend: het is na 10:00 EN ochtend niet volledig afgerond
    const missedMorning = hour >= TIME_WINDOWS.morning.end && !morningComplete;

    return { missedMorning };
}

/**
 * Check of alle velden van een sectie zijn ingevuld
 * @param {Object|null} todayData - Data van vandaag uit storage
 * @param {"morning" | "evening"} section - De sectie om te checken
 * @returns {boolean}
 */
export function isSectionComplete(todayData, section) {
    const data = todayData || {};

    if (section === 'morning') {
        // Ochtend is compleet als slaap, rugpijn, dreamed EN expliciet opgeslagen
        // We checken op explicitSave flag (niet timestamp - die wordt ook door autoSave gezet)
        const hasAllFields =
            data.sleepScore !== undefined &&
            data.backPain !== undefined &&
            data.dreamed !== undefined &&
            data.dreamed !== null &&
            data.dreamed !== '';
        // Alleen complete als expliciet op "Bewaar" is geklikt (niet autoSave)
        const wasSavedExplicitly = data.explicitSave === true;
        return hasAllFields && wasSavedExplicitly;
    }

    if (section === 'evening') {
        // Avond is compleet als walked, mood en alle counters zijn ingevuld EN expliciet opgeslagen
        const hasAllFields =
            data.walked !== undefined && data.mood !== undefined && data.mood !== null;
        const wasSavedExplicitly = data.explicitSave === true;
        return hasAllFields && wasSavedExplicitly;
    }

    return false;
}

/**
 * Check of er enige betekenisvolle data is ingevuld voor vandaag
 * (los van of secties "complete" zijn met explicitSave)
 * @param {Object|null} todayData - Data van vandaag uit storage
 * @returns {boolean}
 */
export function hasAnyData(todayData) {
    if (!todayData || typeof todayData !== 'object') {
        return false;
    }

    // Velden die tellen als "echte data" (niet metadata)
    const dataFields = [
        'sleepScore',
        'backPain',
        'dreamed',
        'weight',
        'walked',
        'mood',
        'waterIntake',
        'sugarConsumed',
        'alcoholConsumed',
        'caffeineConsumed',
        'reading',
        'energyLevel'
    ];

    // Check of minstens één dataveld is ingevuld
    return dataFields.some(field => {
        const value = todayData[field];
        return value !== undefined && value !== null && value !== '';
    });
}

/**
 * Bepaal de zichtbaarheid van alle secties
 * @param {Object|null} todayData - Data van vandaag uit storage
 * @returns {Object} Visibility configuratie per sectie
 */
export function getSectionVisibility(todayData) {
    const currentWindow = getCurrentTimeWindow();
    const missed = getMissedWindows(todayData);
    const morningComplete = isSectionComplete(todayData, 'morning');
    const eveningComplete = isSectionComplete(todayData, 'evening');

    // Morning: visible ONLY if in time window, NOT if missed (fallback banner handles that)
    // When missed, user must click "Alles invullen" to show the section
    const morningVisible = !morningComplete && currentWindow === 'morning';

    // Weight: visible if within weight time window (05:00-12:00), independent of morning section
    const hour = getCurrentHour();
    const weightVisible = hour >= TIME_WINDOWS.weight.start && hour < TIME_WINDOWS.weight.end;

    // Evening: visible if in time window, BUT hidden if complete
    const eveningVisible = !eveningComplete && currentWindow === 'evening';

    return {
        morning: {
            visible: morningVisible,
            reason: morningComplete
                ? 'complete'
                : currentWindow === 'morning'
                  ? 'time'
                  : missed.missedMorning
                    ? 'missed'
                    : 'hidden',
            complete: morningComplete
        },
        weight: {
            visible: weightVisible,
            reason: weightVisible ? 'time' : 'hidden'
        },
        water: {
            visible: true,
            reason: 'always'
        },
        evening: {
            visible: eveningVisible,
            reason: eveningComplete ? 'complete' : currentWindow === 'evening' ? 'time' : 'hidden',
            complete: eveningComplete
        },
        showFallback: missed.missedMorning && currentWindow !== 'morning' && !morningComplete
    };
}

/**
 * Krijg een gebruiksvriendelijke beschrijving van het huidige tijdvenster
 * @returns {string}
 */
export function getTimeWindowLabel() {
    const window = getCurrentTimeWindow();
    switch (window) {
        case 'morning':
            return 'Goedemorgen';
        case 'evening':
            return 'Goedenavond';
        default:
            return 'Goedemiddag';
    }
}
