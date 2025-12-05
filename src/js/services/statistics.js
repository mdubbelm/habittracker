/**
 * Statistics Service
 *
 * Provides data aggregation and analytics for the statistics dashboard.
 * All calculations are done client-side with localStorage data.
 *
 * @module services/statistics
 */

import { getAllData } from './storage.js';
import { getCustomHabits } from './customHabits.js';

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
 * Check if caffeine was consumed for an entry (supports both old and new format)
 * Old format: caffeineConsumed (boolean)
 * New format: caffeineCount (number > 0 means consumed)
 * @param {Object} entry - Data entry
 * @returns {boolean|undefined} true if consumed, false if not, undefined if no data
 */
function hasCaffeineConsumed(entry) {
    // New format: caffeineCount
    if (entry.caffeineCount !== undefined) {
        return entry.caffeineCount > 0;
    }
    // Old format: caffeineConsumed
    if (entry.caffeineConsumed !== undefined) {
        return entry.caffeineConsumed;
    }
    return undefined;
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

            // Caffeine (5 points for tracking - supports both old and new format)
            if (hasCaffeineConsumed(entry) !== undefined) {
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
 * Calculate current streak for a boolean field (consecutive days where field is false)
 * @param {string} field - Field name (e.g., 'sugarConsumed')
 * @returns {Object} Current streak and best streak
 */
function calculateStreak(field) {
    const allData = getAllData();
    const allDates = Object.keys(allData).sort().reverse(); // Most recent first

    if (allDates.length === 0) {
        return { current: 0, best: 0, recentDays: [] };
    }

    // Calculate current streak (consecutive days from today where field is false)
    let currentStreak = 0;
    for (const date of allDates) {
        const entry = allData[date];
        if (entry[field] === false) {
            currentStreak++;
        } else if (entry[field] === true) {
            break; // Streak broken
        }
        // If undefined, continue checking (gap in data)
    }

    // Calculate best streak ever
    let bestStreak = 0;
    let tempStreak = 0;
    const sortedDates = Object.keys(allData).sort(); // Oldest first for best calc

    for (const date of sortedDates) {
        const entry = allData[date];
        if (entry[field] === false) {
            tempStreak++;
            bestStreak = Math.max(bestStreak, tempStreak);
        } else if (entry[field] === true) {
            tempStreak = 0;
        }
    }

    // Get recent 20 days for dot visualization
    const today = new Date();
    const recentDays = [];
    for (let i = 19; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        const entry = allData[dateStr];

        if (entry && entry[field] !== undefined) {
            recentDays.push({
                date: dateStr,
                clean: entry[field] === false,
                isToday: i === 0
            });
        } else {
            recentDays.push({
                date: dateStr,
                clean: null, // No data
                isToday: i === 0
            });
        }
    }

    return { current: currentStreak, best: Math.max(bestStreak, currentStreak), recentDays };
}

/**
 * Get consumption statistics for a period
 * @param {number} days - Period in days
 * @returns {Object} Consumption stats
 */
export function getConsumptionStats(days) {
    const entries = getDataForPeriod(days);
    const sugarStreak = calculateStreak('sugarConsumed');
    const alcoholStreak = calculateStreak('alcoholConsumed');

    return {
        sugar: {
            percentage: calculatePercentage(entries, 'sugarConsumed'),
            daysConsumed: entries.filter(e => e.sugarConsumed === true).length,
            daysClean: entries.filter(e => e.sugarConsumed === false).length,
            currentStreak: sugarStreak.current,
            bestStreak: sugarStreak.best,
            recentDays: sugarStreak.recentDays
        },
        alcohol: {
            percentage: calculatePercentage(entries, 'alcoholConsumed'),
            daysConsumed: entries.filter(e => e.alcoholConsumed === true).length,
            daysClean: entries.filter(e => e.alcoholConsumed === false).length,
            currentStreak: alcoholStreak.current,
            bestStreak: alcoholStreak.best,
            recentDays: alcoholStreak.recentDays
        },
        caffeine: {
            percentage: (() => {
                const caffeineEntries = entries.filter(e => hasCaffeineConsumed(e) !== undefined);
                if (caffeineEntries.length === 0) {
                    return null;
                }
                const consumedCount = caffeineEntries.filter(
                    e => hasCaffeineConsumed(e) === true
                ).length;
                return Math.round((consumedCount / caffeineEntries.length) * 100);
            })(),
            daysConsumed: entries.filter(e => hasCaffeineConsumed(e) === true).length,
            daysWithout: entries.filter(e => hasCaffeineConsumed(e) === false).length
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

    // Calculate energy distribution (1-5 scale)
    const energyEntries = entries.filter(
        e => e.energyLevel !== undefined && e.energyLevel !== null
    );
    const energyDistribution = [0, 0, 0, 0, 0]; // Counts for levels 1-5
    energyEntries.forEach(e => {
        if (e.energyLevel >= 1 && e.energyLevel <= 5) {
            energyDistribution[e.energyLevel - 1]++;
        }
    });

    // Calculate mood distribution (1-5 scale)
    const moodEntries = entries.filter(e => e.mood !== undefined && e.mood !== null);
    const moodDistribution = [0, 0, 0, 0, 0]; // Counts for levels 1-5
    moodEntries.forEach(e => {
        if (e.mood >= 1 && e.mood <= 5) {
            moodDistribution[e.mood - 1]++;
        }
    });

    return {
        walking: {
            percentage: calculatePercentage(entries, 'walked'),
            daysWalked: entries.filter(e => e.walked === true).length,
            totalDays: entries.length
        },
        reading: {
            percentage: calculatePercentage(entries, 'reading'),
            daysRead: entries.filter(e => e.reading === true).length,
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
        },
        energy: {
            average: calculateAverage(entries, 'energyLevel'),
            distribution: energyDistribution,
            totalDays: energyEntries.length,
            labels: ['😫', '😴', '😐', '😊', '💪']
        },
        mood: {
            average: calculateAverage(entries, 'mood'),
            distribution: moodDistribution,
            totalDays: moodEntries.length,
            labels: ['😢', '😕', '😐', '🙂', '😄']
        }
    };
}

/**
 * Get all statistics for a period
 * @param {number} days - Period in days
 * @returns {Object} All statistics
 */
export function getAllStats(days) {
    const currentStats = {
        period: days,
        periodLabel: getPeriodLabel(days),
        healthScore: getHealthScoreStats(days),
        weight: getWeightStats(days),
        consumption: getConsumptionStats(days),
        activity: getActivityStats(days),
        customHabits: getCustomHabitsStats(days), // #43
        totalEntries: getDataForPeriod(days).length
    };

    // Calculate trends by comparing with previous period
    if (days > 0) {
        currentStats.trends = calculateTrends(days);
    }

    return currentStats;
}

/**
 * Calculate trends comparing current period to previous period
 * @param {number} days - Current period in days
 * @returns {Object} Trend data
 */
function calculateTrends(days) {
    const allData = getAllData();
    const allDates = Object.keys(allData).sort();

    if (allDates.length === 0) {
        return null;
    }

    const today = new Date();

    // Current period dates
    const currentStart = new Date(today);
    currentStart.setDate(today.getDate() - days + 1);

    // Previous period dates
    const prevEnd = new Date(currentStart);
    prevEnd.setDate(prevEnd.getDate() - 1);
    const prevStart = new Date(prevEnd);
    prevStart.setDate(prevEnd.getDate() - days + 1);

    // Get data for both periods
    const currentEntries = allDates
        .filter(dateStr => {
            const date = new Date(dateStr);
            return date >= currentStart && date <= today;
        })
        .map(date => ({ date, ...allData[date] }));

    const prevEntries = allDates
        .filter(dateStr => {
            const date = new Date(dateStr);
            return date >= prevStart && date <= prevEnd;
        })
        .map(date => ({ date, ...allData[date] }));

    // Calculate averages for comparison
    const calcAvg = (entries, field) => {
        const values = entries
            .map(e => e[field])
            .filter(v => v !== undefined && v !== null && !isNaN(v));
        return values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : null;
    };

    const calcPct = (entries, field) => {
        const values = entries.map(e => e[field]).filter(v => v !== undefined);
        if (values.length === 0) {
            return null;
        }
        return (values.filter(v => v === true).length / values.length) * 100;
    };

    // Calculate health score averages
    const calcHealthScore = entries => {
        const scores = entries
            .map(entry => {
                let score = 0,
                    maxScore = 0;
                if (entry.sleepScore !== undefined) {
                    score += (entry.sleepScore / 10) * 20;
                    maxScore += 20;
                }
                if (entry.backPain !== undefined) {
                    score += ((10 - entry.backPain) / 10) * 15;
                    maxScore += 15;
                }
                if (entry.waterIntake !== undefined) {
                    score += Math.min(entry.waterIntake / 8, 1) * 15;
                    maxScore += 15;
                }
                if (entry.walked !== undefined) {
                    score += entry.walked ? 10 : 0;
                    maxScore += 10;
                }
                if (entry.dreamed !== undefined) {
                    score += entry.dreamed ? 5 : 0;
                    maxScore += 5;
                }
                if (entry.sugarConsumed !== undefined) {
                    score += entry.sugarConsumed ? 0 : 10;
                    maxScore += 10;
                }
                if (entry.alcoholConsumed !== undefined) {
                    score += entry.alcoholConsumed ? 0 : 10;
                    maxScore += 10;
                }
                if (hasCaffeineConsumed(entry) !== undefined) {
                    score += 5;
                    maxScore += 5;
                }
                return maxScore > 0 ? (score / maxScore) * 100 : null;
            })
            .filter(s => s !== null);
        return scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : null;
    };

    // Get trend direction
    const getTrend = (current, previous, inverse = false) => {
        if (current === null || previous === null) {
            return null;
        }
        const diff = current - previous;
        const threshold = 0.5; // Minimum difference to show trend
        if (Math.abs(diff) < threshold) {
            return { direction: 'stable', diff: 0, positive: null };
        }
        // Arrow follows the number direction, color indicates good/bad
        const arrowDirection = diff > 0 ? 'up' : 'down';
        const isPositive = inverse ? diff < 0 : diff > 0; // For pain: down is good
        return {
            direction: arrowDirection,
            diff: Math.round(diff * 10) / 10,
            positive: isPositive
        };
    };

    return {
        healthScore: getTrend(calcHealthScore(currentEntries), calcHealthScore(prevEntries)),
        sleep: getTrend(calcAvg(currentEntries, 'sleepScore'), calcAvg(prevEntries, 'sleepScore')),
        backPain: getTrend(
            calcAvg(currentEntries, 'backPain'),
            calcAvg(prevEntries, 'backPain'),
            true
        ),
        water: getTrend(
            calcAvg(currentEntries, 'waterIntake'),
            calcAvg(prevEntries, 'waterIntake')
        ),
        walking: getTrend(calcPct(currentEntries, 'walked'), calcPct(prevEntries, 'walked')),
        reading: getTrend(calcPct(currentEntries, 'reading'), calcPct(prevEntries, 'reading')),
        // #50: Add energy and mood trends
        energy: getTrend(
            calcAvg(currentEntries, 'energyLevel'),
            calcAvg(prevEntries, 'energyLevel')
        ),
        mood: getTrend(calcAvg(currentEntries, 'mood'), calcAvg(prevEntries, 'mood'))
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
 * Get custom habits statistics for a period (#43)
 * @param {number} days - Number of days (-1 for all time)
 * @returns {Object} Custom habits statistics
 */
export function getCustomHabitsStats(days) {
    const habits = getCustomHabits();

    if (habits.length === 0) {
        return { habits: [], hasHabits: false };
    }

    const data = getDataForPeriod(days);
    const allData = getAllData();
    const allDates = Object.keys(allData).sort();

    // Calculate stats per habit
    const habitStats = habits.map(habit => {
        // Count completions in period
        let completedDays = 0;
        const totalDays = data.length;

        data.forEach(entry => {
            if (entry.customHabits && entry.customHabits[habit.id] === true) {
                completedDays++;
            }
        });

        const completionPct = totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0;

        // Calculate current streak (consecutive days ending today or most recent)
        let currentStreak = 0;
        let bestStreak = 0;
        let tempStreak = 0;

        // Iterate from oldest to newest for streak calculation
        for (let i = 0; i < allDates.length; i++) {
            const dateData = allData[allDates[i]];
            const isCompleted = dateData.customHabits && dateData.customHabits[habit.id] === true;

            if (isCompleted) {
                tempStreak++;
                if (tempStreak > bestStreak) {
                    bestStreak = tempStreak;
                }
            } else {
                tempStreak = 0;
            }
        }

        // Current streak: count backwards from today
        const today = new Date().toISOString().split('T')[0];
        for (let i = allDates.length - 1; i >= 0; i--) {
            const dateStr = allDates[i];
            // Skip future dates
            if (dateStr > today) {
                continue;
            }

            const dateData = allData[dateStr];
            const isCompleted = dateData.customHabits && dateData.customHabits[habit.id] === true;

            if (isCompleted) {
                currentStreak++;
            } else {
                break;
            }
        }

        return {
            id: habit.id,
            name: habit.name,
            emoji: habit.emoji,
            completedDays,
            totalDays,
            completionPct,
            currentStreak,
            bestStreak
        };
    });

    return {
        habits: habitStats,
        hasHabits: true
    };
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
