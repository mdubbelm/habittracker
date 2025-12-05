/**
 * Storage Service
 *
 * PRIVACY: All data stays in localStorage (browser-only, never sent to servers)
 * SECURITY: All inputs are sanitized before storage
 *
 * @module services/storage
 */

import { sanitizeNumber, sanitizeBoolean } from '../utils/sanitize.js';

/**
 * Storage key for tracker data
 * Format: { "2024-11-22": {...data}, "2024-11-23": {...data} }
 */
const STORAGE_KEY = 'healthTracker_data';
const PRIVACY_ACCEPTED_KEY = 'healthTracker_privacyAccepted';

/**
 * Check if localStorage is available
 * @returns {boolean}
 */
function isLocalStorageAvailable() {
    try {
        const test = '__localStorage_test__';
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
    } catch (e) {
        console.error('localStorage niet beschikbaar:', e);
        return false;
    }
}

/**
 * Get all tracker data
 * @returns {Object} All stored data (key: date, value: tracker data)
 */
export function getAllData() {
    if (!isLocalStorageAvailable()) {
        return {};
    }

    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : {};
    } catch (e) {
        console.error('Fout bij lezen van data:', e);
        return {};
    }
}

/**
 * Get data for specific date
 * @param {string} date - ISO date string (YYYY-MM-DD)
 * @returns {Object|null} Tracker data for that date, or null if not found
 */
export function getDataForDate(date) {
    const allData = getAllData();
    return allData[date] || null;
}

/**
 * Get today's date in ISO format
 * @returns {string} YYYY-MM-DD
 */
export function getTodayDate() {
    return new Date().toISOString().split('T')[0];
}

/**
 * Get data for today
 * @returns {Object|null} Today's tracker data
 */
export function getTodayData() {
    return getDataForDate(getTodayDate());
}

/**
 * Save data for specific date
 *
 * @param {string} date - ISO date string (YYYY-MM-DD)
 * @param {Object} data - Tracker data to save
 * @returns {boolean} Success status
 *
 * @example
 * saveDataForDate('2024-11-22', {
 *   sleepScore: 7,
 *   backPain: 2,
 *   waterIntake: 8,
 *   walked: true,
 *   dreamed: true,
 *   sugarConsumed: false,
 *   alcoholConsumed: false,
 *   caffeineConsumed: true
 * });
 */
export function saveDataForDate(date, data) {
    if (!isLocalStorageAvailable()) {
        console.error('Kan niet opslaan: localStorage niet beschikbaar');
        return false;
    }

    // Validate date format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        console.error('Ongeldig datumformaat. Gebruik YYYY-MM-DD');
        return false;
    }

    try {
        const allData = getAllData();

        // Sanitize data before storing
        const sanitizedData = sanitizeTrackerData(data);

        // Add timestamp
        sanitizedData.timestamp = new Date().toISOString();

        // Store
        allData[date] = sanitizedData;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(allData));

        console.log(`✅ Data saved for ${date}`);
        return true;
    } catch (e) {
        console.error('Fout bij opslaan van data:', e);
        return false;
    }
}

/**
 * Save data for today
 * @param {Object} data - Tracker data
 * @returns {boolean} Success status
 */
export function saveTodayData(data) {
    return saveDataForDate(getTodayDate(), data);
}

/**
 * Sanitize tracker data before storage
 * Ensures all values are valid and safe
 * Supports both old boolean format and new numeric format
 *
 * @param {Object} data - Raw tracker data
 * @returns {Object} Sanitized data
 */
function sanitizeTrackerData(data) {
    const sanitized = {};

    // === EXISTING FIELDS ===
    if (data.sleepScore !== undefined) {
        sanitized.sleepScore = sanitizeNumber(data.sleepScore, 1, 10, 7);
    }
    if (data.backPain !== undefined) {
        sanitized.backPain = sanitizeNumber(data.backPain, 0, 10, 0);
    }
    if (data.waterIntake !== undefined) {
        sanitized.waterIntake = sanitizeNumber(data.waterIntake, 0, 20, 0);
    }
    if (data.weight !== undefined && data.weight !== null && data.weight !== '') {
        sanitized.weight = sanitizeNumber(data.weight, 30, 300, null);
    }
    if (data.walked !== undefined) {
        sanitized.walked = sanitizeBoolean(data.walked);
    }

    // === DREAMED: support both boolean (old) and string (new) format ===
    if (data.dreamed !== undefined && data.dreamed !== null) {
        if (typeof data.dreamed === 'boolean') {
            // Migrate old boolean to new string format
            sanitized.dreamed = data.dreamed ? 'yes' : 'no';
        } else if (['yes', 'no', 'unknown'].includes(data.dreamed)) {
            sanitized.dreamed = data.dreamed;
        }
    }

    // === NEW NUMERIC FIELDS ===
    // Sugar portions (new format)
    if (data.sugarPortions !== undefined) {
        sanitized.sugarPortions = sanitizeNumber(data.sugarPortions, 0, 20, 0);
    } else if (data.sugarConsumed !== undefined) {
        // Legacy migration: boolean -> number
        sanitized.sugarPortions = data.sugarConsumed ? 1 : 0;
    }

    // Caffeine count (new format)
    if (data.caffeineCount !== undefined) {
        sanitized.caffeineCount = sanitizeNumber(data.caffeineCount, 0, 20, 0);
    } else if (data.caffeineConsumed !== undefined) {
        // Legacy migration: boolean -> number
        sanitized.caffeineCount = data.caffeineConsumed ? 1 : 0;
    }

    // Alcohol count (new format)
    if (data.alcoholCount !== undefined) {
        sanitized.alcoholCount = sanitizeNumber(data.alcoholCount, 0, 20, 0);
    } else if (data.alcoholConsumed !== undefined) {
        // Legacy migration: boolean -> number
        sanitized.alcoholCount = data.alcoholConsumed ? 1 : 0;
    }

    // === READING (new field) ===
    if (data.reading !== undefined) {
        sanitized.reading = sanitizeBoolean(data.reading);
    }

    // === ENERGY LEVEL (new field) ===
    if (data.energyLevel !== undefined && data.energyLevel !== null) {
        const energyValue = sanitizeNumber(data.energyLevel, 1, 5, null);
        if (energyValue !== null) {
            sanitized.energyLevel = energyValue;
        }
    }

    // === MOOD (new field) ===
    if (data.mood !== undefined && data.mood !== null) {
        const moodValue = sanitizeNumber(data.mood, 1, 5, null);
        if (moodValue !== null) {
            sanitized.mood = moodValue;
        }
    }

    // Custom habits (if added later)
    if (data.customHabits) {
        sanitized.customHabits = data.customHabits;
    }

    // Explicit save flag - indicates user clicked "Bewaar" button (not autoSave)
    // Used to determine if a section should be considered "complete" and hidden
    if (data.explicitSave === true) {
        sanitized.explicitSave = true;
    }

    return sanitized;
}

/**
 * Delete data for specific date
 * @param {string} date - ISO date string
 * @returns {boolean} Success status
 */
export function deleteDataForDate(date) {
    if (!isLocalStorageAvailable()) {
        return false;
    }

    try {
        const allData = getAllData();
        delete allData[date];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(allData));
        console.log(`🗑️ Data deleted for ${date}`);
        return true;
    } catch (e) {
        console.error('Fout bij verwijderen van data:', e);
        return false;
    }
}

/**
 * Delete ALL tracker data
 * DANGER: This cannot be undone!
 * @returns {boolean} Success status
 */
export function deleteAllData() {
    if (!isLocalStorageAvailable()) {
        return false;
    }

    try {
        localStorage.removeItem(STORAGE_KEY);
        console.log('🗑️ All data deleted');
        return true;
    } catch (e) {
        console.error('Fout bij verwijderen van alle data:', e);
        return false;
    }
}

/**
 * Export all data as JSON
 * @returns {string} JSON string of all data
 */
export function exportAsJSON() {
    const allData = getAllData();
    return JSON.stringify(allData, null, 2);
}

/**
 * Import data from JSON object (merges with existing)
 * @param {Object} data - Data to import
 * @returns {boolean} Success status
 */
export function importFromJSON(data) {
    if (!isLocalStorageAvailable()) {
        return false;
    }

    try {
        const existingData = getAllData();
        const mergedData = { ...existingData, ...data };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(mergedData));
        console.log('✅ Data imported');
        return true;
    } catch (e) {
        console.error('Import error:', e);
        return false;
    }
}

/**
 * Export all data as CSV
 * @returns {string} CSV string
 */
export function exportAsCSV() {
    const allData = getAllData();
    const dates = Object.keys(allData).sort();

    if (dates.length === 0) {
        return 'Geen data om te exporteren';
    }

    // CSV headers
    const headers = [
        'Datum',
        'Slaapcijfer',
        'Rugpijn',
        'Water Inname',
        'Gelopen',
        'Gedroomd',
        'Suiker',
        'Alcohol',
        'Cafeïne',
        'Tijdstempel'
    ];

    // CSV rows
    const rows = dates.map(date => {
        const data = allData[date];
        return [
            date,
            data.sleepScore || '',
            data.backPain || '',
            data.waterIntake || '',
            data.walked ? 'Ja' : 'Nee',
            data.dreamed ? 'Ja' : 'Nee',
            data.sugarConsumed ? 'Ja' : 'Nee',
            data.alcoholConsumed ? 'Ja' : 'Nee',
            data.caffeineConsumed ? 'Ja' : 'Nee',
            data.timestamp || ''
        ].join(',');
    });

    return [headers.join(','), ...rows].join('\n');
}

/**
 * Privacy acceptance
 */
export function hasAcceptedPrivacy() {
    return localStorage.getItem(PRIVACY_ACCEPTED_KEY) === 'true';
}

export function acceptPrivacy() {
    localStorage.setItem(PRIVACY_ACCEPTED_KEY, 'true');
}

/**
 * Get storage statistics
 * @returns {Object} Stats about stored data
 */
export function getStorageStats() {
    const allData = getAllData();
    const dates = Object.keys(allData);

    return {
        totalEntries: dates.length,
        oldestEntry: dates.length > 0 ? dates.sort()[0] : null,
        newestEntry: dates.length > 0 ? dates.sort().reverse()[0] : null,
        storageSize: new Blob([JSON.stringify(allData)]).size,
        storageSizeKB: (new Blob([JSON.stringify(allData)]).size / 1024).toFixed(2)
    };
}
