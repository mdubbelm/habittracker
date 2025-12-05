/**
 * Data Manager Service
 *
 * Handles import, export, backup, and demo data generation.
 *
 * @module services/dataManager
 */

import {
    getAllData,
    saveDataForDate,
    deleteDataForDate,
    exportAsCSV,
    exportAsJSON,
    getStorageStats,
    getTodayDate
} from './storage.js';

/**
 * Export data as JSON file download
 */
export function downloadJSON() {
    const data = getAllData();
    const json = JSON.stringify(data, null, 2);

    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `health-tracker-backup-${getTodayDate()}.json`;
    a.click();
    URL.revokeObjectURL(url);

    return { success: true, message: 'JSON geëxporteerd' };
}

/**
 * Export data as CSV file download
 */
export function downloadCSV() {
    const csv = exportAsCSV();

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `health-tracker-data-${getTodayDate()}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    return { success: true, message: 'CSV geëxporteerd' };
}

/**
 * Import data from JSON file
 * @param {File} file - JSON file to import
 * @returns {Promise<{success: boolean, message: string, count: number}>}
 */
export async function importJSON(file) {
    try {
        const text = await file.text();
        const data = JSON.parse(text);

        if (typeof data !== 'object' || data === null) {
            return { success: false, message: 'Ongeldig JSON formaat', count: 0 };
        }

        let imported = 0;
        let skipped = 0;

        for (const [date, entry] of Object.entries(data)) {
            // Validate date format
            if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
                skipped++;
                continue;
            }

            // Save entry
            const success = saveDataForDate(date, entry);
            if (success) {
                imported++;
            } else {
                skipped++;
            }
        }

        return {
            success: true,
            message: `${imported} dagen geïmporteerd${skipped > 0 ? `, ${skipped} overgeslagen` : ''}`,
            count: imported
        };
    } catch (e) {
        console.error('Import error:', e);
        return { success: false, message: 'Fout bij importeren: ' + e.message, count: 0 };
    }
}

/**
 * Import data from CSV file
 * @param {File} file - CSV file to import
 * @returns {Promise<{success: boolean, message: string, count: number}>}
 */
export async function importCSV(file) {
    try {
        const text = await file.text();
        const lines = text.split('\n').filter(line => line.trim());

        if (lines.length < 2) {
            return { success: false, message: 'CSV bestand is leeg of ongeldig', count: 0 };
        }

        // Parse header
        const header = lines[0].split(',').map(h => h.trim().toLowerCase());

        // Map column names to our data structure
        const columnMap = {
            datum: 'date',
            date: 'date',
            slaapcijfer: 'sleepScore',
            sleepscore: 'sleepScore',
            rugpijn: 'backPain',
            backpain: 'backPain',
            'water inname': 'waterIntake',
            waterintake: 'waterIntake',
            water: 'waterIntake',
            gelopen: 'walked',
            walked: 'walked',
            gedroomd: 'dreamed',
            dreamed: 'dreamed',
            suiker: 'sugarConsumed',
            sugar: 'sugarConsumed',
            sugarconsumed: 'sugarConsumed',
            alcohol: 'alcoholConsumed',
            alcoholconsumed: 'alcoholConsumed',
            cafeïne: 'caffeineConsumed',
            caffeine: 'caffeineConsumed',
            caffeineconsumed: 'caffeineConsumed'
        };

        let imported = 0;
        let skipped = 0;

        // Process data rows
        for (let i = 1; i < lines.length; i++) {
            const values = parseCSVLine(lines[i]);

            if (values.length !== header.length) {
                skipped++;
                continue;
            }

            const entry = {};
            let date = null;

            for (let j = 0; j < header.length; j++) {
                const columnName = columnMap[header[j]] || header[j];
                const value = values[j].trim();

                if (columnName === 'date') {
                    date = value;
                } else if (
                    columnName === 'sleepScore' ||
                    columnName === 'backPain' ||
                    columnName === 'waterIntake'
                ) {
                    const num = parseInt(value, 10);
                    if (!isNaN(num)) {
                        entry[columnName] = num;
                    }
                } else if (
                    [
                        'walked',
                        'dreamed',
                        'sugarConsumed',
                        'alcoholConsumed',
                        'caffeineConsumed'
                    ].includes(columnName)
                ) {
                    entry[columnName] =
                        value.toLowerCase() === 'ja' ||
                        value.toLowerCase() === 'true' ||
                        value === '1';
                }
            }

            // Validate and save
            if (date && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
                const success = saveDataForDate(date, entry);
                if (success) {
                    imported++;
                } else {
                    skipped++;
                }
            } else {
                skipped++;
            }
        }

        return {
            success: true,
            message: `${imported} dagen geïmporteerd${skipped > 0 ? `, ${skipped} overgeslagen` : ''}`,
            count: imported
        };
    } catch (e) {
        console.error('CSV Import error:', e);
        return { success: false, message: 'Fout bij importeren: ' + e.message, count: 0 };
    }
}

/**
 * Parse a CSV line handling quoted values
 * @param {string} line - CSV line
 * @returns {string[]} Array of values
 */
function parseCSVLine(line) {
    const values = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            values.push(current);
            current = '';
        } else {
            current += char;
        }
    }
    values.push(current);

    return values;
}

/**
 * Generate demo data for testing
 * @param {number} days - Number of days to generate
 * @returns {{success: boolean, message: string, count: number}}
 */
export function generateDemoData(days = 7) {
    const today = new Date();
    let generated = 0;

    for (let i = 0; i < days; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];

        // Generate realistic random data
        const data = {
            sleepScore: randomInt(5, 9),
            backPain: randomInt(0, 5),
            waterIntake: randomInt(4, 10),
            walked: Math.random() > 0.3,
            reading: Math.random() > 0.4, // ~60% chance of reading
            dreamed: Math.random() > 0.5,
            sugarConsumed: Math.random() > 0.6,
            alcoholConsumed: Math.random() > 0.7,
            caffeineConsumed: Math.random() > 0.2,
            energyLevel: randomInt(1, 5),
            mood: randomInt(1, 5)
        };

        // Occasionally add weight (morning measurement simulation)
        if (Math.random() > 0.5) {
            data.weight = randomFloat(70, 85, 1);
        }

        const success = saveDataForDate(dateStr, data);
        if (success) {
            generated++;
        }
    }

    return {
        success: true,
        message: `${generated} dagen demo data gegenereerd`,
        count: generated
    };
}

/**
 * Delete data older than specified days
 * @param {number} days - Delete data older than this many days
 * @returns {{success: boolean, message: string, count: number}}
 */
export function cleanupOldData(days = 90) {
    const allData = getAllData();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    let deleted = 0;

    for (const date of Object.keys(allData)) {
        const entryDate = new Date(date);
        if (entryDate < cutoffDate) {
            deleteDataForDate(date);
            deleted++;
        }
    }

    return {
        success: true,
        message:
            deleted > 0
                ? `${deleted} dagen verwijderd (ouder dan ${days} dagen)`
                : 'Geen oude data om te verwijderen',
        count: deleted
    };
}

/**
 * Get formatted storage statistics
 * @returns {Object} Formatted stats
 */
export function getFormattedStats() {
    const stats = getStorageStats();

    return {
        totalEntries: stats.totalEntries,
        oldestEntry: stats.oldestEntry ? formatDate(stats.oldestEntry) : '-',
        newestEntry: stats.newestEntry ? formatDate(stats.newestEntry) : '-',
        storageSize: `${stats.storageSizeKB} KB`
    };
}

/**
 * Format date for display
 * @param {string} dateStr - ISO date string
 * @returns {string} Formatted date
 */
function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('nl-NL', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
}

/**
 * Generate random integer between min and max (inclusive)
 */
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generate random float between min and max with specified decimals
 */
function randomFloat(min, max, decimals) {
    const value = Math.random() * (max - min) + min;
    return parseFloat(value.toFixed(decimals));
}
