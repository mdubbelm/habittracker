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
    morning: { start: 6, end: 10 }, // 06:00 - 10:00
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

    // Check of ochtend data is ingevuld (any field)
    const hasMorningData =
        data.sleepScore !== undefined || data.backPain !== undefined || data.dreamed !== undefined;

    // Gemiste ochtend: het is na 10:00 EN geen ochtend data
    const missedMorning = hour >= TIME_WINDOWS.morning.end && !hasMorningData;

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
        // We checken op timestamp EN alle velden
        const hasAllFields =
            data.sleepScore !== undefined &&
            data.backPain !== undefined &&
            data.dreamed !== undefined &&
            data.dreamed !== null &&
            data.dreamed !== '';
        // Alleen complete als er een timestamp is (= expliciet opgeslagen)
        const wasSaved = data.timestamp !== undefined;
        return hasAllFields && wasSaved;
    }

    if (section === 'evening') {
        // Avond is compleet als walked, mood en alle counters zijn ingevuld
        // (counters hebben default 0, dus checken of ze bestaan of expliciet gezet zijn)
        return data.walked !== undefined && data.mood !== undefined && data.mood !== null;
    }

    return false;
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

    // Morning: visible if in time window OR missed, BUT hidden if complete
    const morningVisible =
        !morningComplete && (currentWindow === 'morning' || missed.missedMorning);

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
