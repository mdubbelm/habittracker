/**
 * Health Score Calculation Service
 *
 * Calculates a 0-100% health score based on tracked metrics
 * Algorithm is transparent and adjustable
 *
 * @module services/healthScore
 */

/**
 * Weight configuration for each metric
 * Total should add up to 100 for easy percentage calculation
 */
export const WEIGHTS = {
    sleep: 30, // Sleep is VERY important
    pain: 20, // Pain management crucial
    hydration: 15, // Water intake
    activity: 15, // Walking/movement
    consumption: 20 // Sugar/alcohol/caffeine (negative impact)
};

/**
 * Calculate health score from tracker data
 *
 * @param {Object} data - Tracker data for a day
 * @returns {number} Health score (0-100)
 *
 * @example
 * calculateHealthScore({
 *   sleepScore: 8,
 *   backPain: 2,
 *   waterIntake: 8,
 *   walked: true,
 *   sugarConsumed: false,
 *   alcoholConsumed: false,
 *   caffeineConsumed: true
 * });
 * // Returns: 83 (example)
 */
export function calculateHealthScore(data) {
    if (!data || Object.keys(data).length === 0) {
        return 0;
    }

    let totalScore = 0;
    let totalWeight = 0;

    // Sleep Score (1-10 scale → 0-100%)
    if (data.sleepScore !== undefined) {
        const sleepPercent = (data.sleepScore / 10) * 100;
        totalScore += sleepPercent * (WEIGHTS.sleep / 100);
        totalWeight += WEIGHTS.sleep;
    }

    // Pain Level (0-10 scale, INVERTED → lower is better)
    if (data.backPain !== undefined) {
        const painPercent = ((10 - data.backPain) / 10) * 100;
        totalScore += painPercent * (WEIGHTS.pain / 100);
        totalWeight += WEIGHTS.pain;
    }

    // Water Intake (0-8+ glasses, target = 8)
    if (data.waterIntake !== undefined) {
        const waterPercent = Math.min((data.waterIntake / 8) * 100, 100);
        totalScore += waterPercent * (WEIGHTS.hydration / 100);
        totalWeight += WEIGHTS.hydration;
    }

    // Walking (boolean → 100% or 0%)
    if (data.walked !== undefined) {
        const walkPercent = data.walked ? 100 : 0;
        totalScore += walkPercent * (WEIGHTS.activity / 100);
        totalWeight += WEIGHTS.activity;
    }

    // Consumption (sugar, alcohol, caffeine)
    // Each "bad" thing reduces the score
    if (
        data.sugarConsumed !== undefined ||
        data.alcoholConsumed !== undefined ||
        data.caffeineConsumed !== undefined
    ) {
        let consumptionScore = 100; // Start at 100%

        if (data.sugarConsumed) {
            consumptionScore -= 40;
        }
        if (data.alcoholConsumed) {
            consumptionScore -= 40;
        }
        if (data.caffeineConsumed) {
            consumptionScore -= 20;
        }

        consumptionScore = Math.max(consumptionScore, 0); // Don't go below 0

        totalScore += consumptionScore * (WEIGHTS.consumption / 100);
        totalWeight += WEIGHTS.consumption;
    }

    // Calculate final score (normalize by actual weights used)
    const finalScore = totalWeight > 0 ? (totalScore / totalWeight) * 100 : 0;

    return Math.round(finalScore);
}

/**
 * Get health score message based on score
 * @param {number} score - Health score (0-100)
 * @returns {string} Motivational message
 */
export function getScoreMessage(score) {
    if (score === 0) {
        return 'Start met tracken!';
    }
    if (score < 30) {
        return 'Zware dag? Morgen is een nieuwe kans!';
    }
    if (score < 50) {
        return 'Er is ruimte voor verbetering!';
    }
    if (score < 70) {
        return 'Je komt er!';
    }
    if (score < 85) {
        return 'Goed bezig!';
    }
    if (score < 95) {
        return 'Geweldig! Ga zo door!';
    }
    return 'Perfecte dag! 🎉';
}

/**
 * Get score color (for UI)
 * @param {number} score - Health score (0-100)
 * @returns {string} Color name or hex
 */
export function getScoreColor(score) {
    if (score === 0) {
        return '#94A3B8';
    } // Slate (no data)
    if (score < 30) {
        return '#EF4444';
    } // Red
    if (score < 50) {
        return '#F59E0B';
    } // Orange
    if (score < 70) {
        return '#EAB308';
    } // Yellow
    if (score < 85) {
        return '#84CC16';
    } // Lime
    return '#10B981'; // Green
}

/**
 * Calculate score breakdown
 * Shows individual component scores for transparency
 *
 * @param {Object} data - Tracker data
 * @returns {Object} Breakdown of scores by category
 */
export function getScoreBreakdown(data) {
    if (!data || Object.keys(data).length === 0) {
        return null;
    }

    const breakdown = {};

    // Sleep
    if (data.sleepScore !== undefined) {
        breakdown.sleep = {
            score: Math.round((data.sleepScore / 10) * 100),
            weight: WEIGHTS.sleep,
            label: 'Sleep Quality'
        };
    }

    // Pain
    if (data.backPain !== undefined) {
        breakdown.pain = {
            score: Math.round(((10 - data.backPain) / 10) * 100),
            weight: WEIGHTS.pain,
            label: 'Pain Management'
        };
    }

    // Hydration
    if (data.waterIntake !== undefined) {
        breakdown.hydration = {
            score: Math.round(Math.min((data.waterIntake / 8) * 100, 100)),
            weight: WEIGHTS.hydration,
            label: 'Hydration'
        };
    }

    // Activity
    if (data.walked !== undefined) {
        breakdown.activity = {
            score: data.walked ? 100 : 0,
            weight: WEIGHTS.activity,
            label: 'Activity'
        };
    }

    // Consumption
    if (
        data.sugarConsumed !== undefined ||
        data.alcoholConsumed !== undefined ||
        data.caffeineConsumed !== undefined
    ) {
        let score = 100;
        if (data.sugarConsumed) {
            score -= 40;
        }
        if (data.alcoholConsumed) {
            score -= 40;
        }
        if (data.caffeineConsumed) {
            score -= 20;
        }
        score = Math.max(score, 0);

        breakdown.consumption = {
            score: score,
            weight: WEIGHTS.consumption,
            label: 'Healthy Choices'
        };
    }

    return breakdown;
}

/**
 * Calculate average score over multiple days
 * @param {Object} allData - All tracker data (key: date, value: data)
 * @param {number} days - Number of recent days to include (default: 7)
 * @returns {number} Average health score
 */
export function calculateAverageScore(allData, days = 7) {
    const dates = Object.keys(allData).sort().reverse().slice(0, days);

    if (dates.length === 0) {
        return 0;
    }

    const scores = dates.map(date => calculateHealthScore(allData[date]));
    const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;

    return Math.round(average);
}

/**
 * Get trend (improving, stable, declining)
 * @param {Object} allData - All tracker data
 * @param {number} days - Number of days to analyze
 * @returns {string} 'improving', 'stable', or 'declining'
 */
export function getScoreTrend(allData, days = 7) {
    const dates = Object.keys(allData).sort().reverse().slice(0, days);

    if (dates.length < 3) {
        return 'stable'; // Not enough data
    }

    const scores = dates.map(date => calculateHealthScore(allData[date]));
    const recentAvg =
        scores.slice(0, Math.floor(dates.length / 2)).reduce((sum, s) => sum + s, 0) /
        Math.floor(dates.length / 2);
    const olderAvg =
        scores.slice(Math.floor(dates.length / 2)).reduce((sum, s) => sum + s, 0) /
        Math.ceil(dates.length / 2);

    const difference = recentAvg - olderAvg;

    if (difference > 5) {
        return 'improving';
    }
    if (difference < -5) {
        return 'declining';
    }
    return 'stable';
}
