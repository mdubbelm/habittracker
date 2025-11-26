/**
 * Statistics Service
 *
 * Provides data aggregation and analytics for the statistics dashboard.
 * All calculations are done client-side with localStorage data.
 *
 * @module services/statistics
 */

import { getAllData } from './storage.js';

/**
 * Available time periods for statistics
 */
export const PERIODS = {
    WEEK: 7,
    TWO_WEEKS: 14,
    MONTH: 30,
    QUARTER: 90,
    ALL: -1
};

/**
 * Get dates for a specific period
 * @param {number} days - Number of days (-1 for all time)
 * @returns {string[]} Array of ISO date strings
 */
export function getDatesForPeriod(days) {
    const allData = getAllData();
    const allDates = Object.keys(allData).sort();

    if (days === -1 || allDates.length === 0) {
        return allDates;
    }

    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - days + 1);

    return allDates.filter(dateStr => {
        const date = new Date(dateStr);
        return date >= startDate && date <= today;
    });
}

/**
 * Get data entries for a specific period
 * @param {number} days - Number of days (-1 for all time)
 * @returns {Object[]} Array of {date, ...data} objects
 */
export function getDataForPeriod(days) {
    const allData = getAllData();
    const dates = getDatesForPeriod(days);

    return dates.map(date => ({
        date,
        ...allData[date]
    }));
}

/**
 * Calculate average for a numeric field
 * @param {Object[]} entries - Data entries
 * @param {string} field - Field name
 * @returns {number|null} Average value or null if no data
 */
function calculateAverage(entries, field) {
    const values = entries
        .map(e => e[field])
        .filter(v => v !== undefined && v !== null && !isNaN(v));

    if (values.length === 0) {
        return null;
    }

    const sum = values.reduce((a, b) => a + b, 0);
    return Math.round((sum / values.length) * 10) / 10;
}

/**
 * Calculate percentage of true values for a boolean field
 * @param {Object[]} entries - Data entries
 * @param {string} field - Field name
 * @returns {number|null} Percentage (0-100) or null if no data
 */
function calculatePercentage(entries, field) {
    const values = entries.map(e => e[field]).filter(v => v !== undefined);

    if (values.length === 0) {
        return null;
    }

    const trueCount = values.filter(v => v === true).length;
    return Math.round((trueCount / values.length) * 100);
}

/**
 * Get health score statistics for a period
 * @param {number} days - Period in days
 * @returns {Object} Health score stats
 */
export function getHealthScoreStats(days) {
    const entries = getDataForPeriod(days);

    // Import health score calculation
    // For now, we'll calculate a simple score based on available data
    const scores = entries
        .map(entry => {
            let score = 0;
            let maxScore = 0;

            // Sleep (20 points)
            if (entry.sleepScore !== undefined) {
                score += (entry.sleepScore / 10) * 20;
                maxScore += 20;
            }

            // Back pain (15 points, inverse)
            if (entry.backPain !== undefined) {
                score += ((10 - entry.backPain) / 10) * 15;
                maxScore += 15;
            }

            // Water (15 points)
            if (entry.waterIntake !== undefined) {
                score += Math.min(entry.waterIntake / 8, 1) * 15;
                maxScore += 15;
            }

            // Walking (10 points)
            if (entry.walked !== undefined) {
                score += entry.walked ? 10 : 0;
                maxScore += 10;
            }

            // Dreaming (5 points)
            if (entry.dreamed !== undefined) {
                score += entry.dreamed ? 5 : 0;
                maxScore += 5;
            }

            // Sugar (10 points for NOT consuming)
            if (entry.sugarConsumed !== undefined) {
                score += entry.sugarConsumed ? 0 : 10;
                maxScore += 10;
            }

            // Alcohol (10 points for NOT consuming)
            if (entry.alcoholConsumed !== undefined) {
                score += entry.alcoholConsumed ? 0 : 10;
                maxScore += 10;
            }

            // Caffeine (5 points for moderate, defined as having consumed some)
            if (entry.caffeineConsumed !== undefined) {
                score += 5; // Simplified: just tracking
                maxScore += 5;
            }

            return {
                date: entry.date,
                score: maxScore > 0 ? Math.round((score / maxScore) * 100) : null
            };
        })
        .filter(s => s.score !== null);

    return {
        entries: scores,
        average:
            scores.length > 0
                ? Math.round(scores.reduce((a, b) => a + b.score, 0) / scores.length)
                : null,
        highest: scores.length > 0 ? Math.max(...scores.map(s => s.score)) : null,
        lowest: scores.length > 0 ? Math.min(...scores.map(s => s.score)) : null,
        count: scores.length
    };
}

/**
 * Get weight statistics for a period
 * @param {number} days - Period in days
 * @returns {Object} Weight stats
 */
export function getWeightStats(days) {
    const entries = getDataForPeriod(days)
        .filter(e => e.weight !== undefined && e.weight !== null)
        .map(e => ({
            date: e.date,
            weight: e.weight
        }));

    if (entries.length === 0) {
        return { entries: [], average: null, change: null, trend: null };
    }

    const weights = entries.map(e => e.weight);
    const average = Math.round((weights.reduce((a, b) => a + b, 0) / weights.length) * 10) / 10;

    // Calculate change (first to last)
    const change =
        entries.length >= 2
            ? Math.round((entries[entries.length - 1].weight - entries[0].weight) * 10) / 10
            : null;

    // Determine trend
    let trend = null;
    if (change !== null) {
        if (change < -0.5) {
            trend = 'down';
        } else if (change > 0.5) {
            trend = 'up';
        } else {
            trend = 'stable';
        }
    }

    return {
        entries,
        average,
        change,
        trend,
        current: entries[entries.length - 1]?.weight || null,
        count: entries.length
    };
}

/**
 * Get consumption statistics for a period
 * @param {number} days - Period in days
 * @returns {Object} Consumption stats
 */
export function getConsumptionStats(days) {
    const entries = getDataForPeriod(days);

    return {
        sugar: {
            percentage: calculatePercentage(entries, 'sugarConsumed'),
            daysConsumed: entries.filter(e => e.sugarConsumed === true).length,
            daysClean: entries.filter(e => e.sugarConsumed === false).length
        },
        alcohol: {
            percentage: calculatePercentage(entries, 'alcoholConsumed'),
            daysConsumed: entries.filter(e => e.alcoholConsumed === true).length,
            daysClean: entries.filter(e => e.alcoholConsumed === false).length
        },
        caffeine: {
            percentage: calculatePercentage(entries, 'caffeineConsumed'),
            daysConsumed: entries.filter(e => e.caffeineConsumed === true).length,
            daysWithout: entries.filter(e => e.caffeineConsumed === false).length
        },
        totalDays: entries.length
    };
}

/**
 * Get activity statistics for a period
 * @param {number} days - Period in days
 * @returns {Object} Activity stats
 */
export function getActivityStats(days) {
    const entries = getDataForPeriod(days);

    return {
        walking: {
            percentage: calculatePercentage(entries, 'walked'),
            daysWalked: entries.filter(e => e.walked === true).length,
            totalDays: entries.length
        },
        sleep: {
            average: calculateAverage(entries, 'sleepScore'),
            entries: entries
                .filter(e => e.sleepScore !== undefined)
                .map(e => ({ date: e.date, score: e.sleepScore }))
        },
        backPain: {
            average: calculateAverage(entries, 'backPain'),
            entries: entries
                .filter(e => e.backPain !== undefined)
                .map(e => ({ date: e.date, level: e.backPain }))
        },
        water: {
            average: calculateAverage(entries, 'waterIntake'),
            entries: entries
                .filter(e => e.waterIntake !== undefined)
                .map(e => ({ date: e.date, glasses: e.waterIntake }))
        },
        dreaming: {
            percentage: calculatePercentage(entries, 'dreamed'),
            daysDreamed: entries.filter(e => e.dreamed === true).length
        }
    };
}

/**
 * Get all statistics for a period
 * @param {number} days - Period in days
 * @returns {Object} All statistics
 */
export function getAllStats(days) {
    return {
        period: days,
        periodLabel: getPeriodLabel(days),
        healthScore: getHealthScoreStats(days),
        weight: getWeightStats(days),
        consumption: getConsumptionStats(days),
        activity: getActivityStats(days),
        totalEntries: getDataForPeriod(days).length
    };
}

/**
 * Get human-readable period label
 * @param {number} days - Period in days
 * @returns {string} Label
 */
export function getPeriodLabel(days) {
    switch (days) {
        case 7:
            return 'Afgelopen week';
        case 14:
            return 'Afgelopen 2 weken';
        case 30:
            return 'Afgelopen maand';
        case 90:
            return 'Afgelopen 3 maanden';
        case -1:
            return 'Alle tijd';
        default:
            return `Afgelopen ${days} dagen`;
    }
}

/**
 * Format date for display
 * @param {string} dateStr - ISO date string
 * @returns {string} Formatted date
 */
export function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('nl-NL', {
        day: 'numeric',
        month: 'short'
    });
}

/**
 * Format date short (for charts)
 * @param {string} dateStr - ISO date string
 * @returns {string} Short formatted date
 */
export function formatDateShort(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('nl-NL', {
        day: 'numeric',
        month: 'numeric'
    });
}
