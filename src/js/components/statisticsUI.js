/**
 * Statistics UI Component
 *
 * Handles rendering of statistics dashboard including charts and metrics.
 *
 * @module components/statisticsUI
 */

import { getAllStats, formatDateShort } from '../services/statistics.js';

let currentPeriod = 7;

/**
 * Initialize statistics UI
 */
export function initStatistics() {
    setupPeriodSelector();
    renderStatistics(currentPeriod);
}

/**
 * Setup period selector buttons
 */
function setupPeriodSelector() {
    const buttons = document.querySelectorAll('.period-btn');

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            buttons.forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-selected', 'false');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-selected', 'true');

            // Get period and render
            const period = parseInt(btn.dataset.period, 10);
            currentPeriod = period;
            renderStatistics(period);
        });
    });
}

/**
 * Render all statistics for a period
 * @param {number} days - Period in days
 */
export function renderStatistics(days) {
    const stats = getAllStats(days);

    renderSummaryCards(stats);
    renderHealthScoreChart(stats.healthScore, stats.trends);
    renderWeightChart(stats.weight);
    renderActivityStats(stats.activity, stats.trends);
    renderConsumptionStats(stats.consumption);
    renderEnergyMoodStats(stats.activity);
}

/**
 * Get trend arrow HTML
 * @param {Object} trend - Trend object with direction, diff, and positive
 * @returns {string} HTML for trend indicator
 */
function getTrendHTML(trend) {
    if (!trend) {
        return '';
    }

    const { direction, diff, positive } = trend;
    if (direction === 'stable') {
        return '<span class="trend-indicator trend-stable" aria-label="Stabiel">→</span>';
    }

    // Arrow follows number direction, color indicates good (green) or bad (red)
    const arrow = direction === 'up' ? '↑' : '↓';
    const colorClass = positive ? 'trend-positive' : 'trend-negative';
    const label = direction === 'up' ? 'Omhoog' : 'Omlaag';

    return `<span class="trend-indicator ${colorClass}" aria-label="${label} ${Math.abs(diff)}">${arrow}</span>`;
}

/**
 * Render summary cards
 * @param {Object} stats - All statistics
 */
function renderSummaryCards(stats) {
    const avgScoreEl = document.getElementById('stats-avg-score');
    const totalDaysEl = document.getElementById('stats-total-days');
    const walkPctEl = document.getElementById('stats-walk-pct');

    if (avgScoreEl) {
        const scoreValue =
            stats.healthScore.average !== null ? `${stats.healthScore.average}%` : '--';
        const trendHTML = stats.trends?.healthScore ? getTrendHTML(stats.trends.healthScore) : '';
        avgScoreEl.innerHTML = `${scoreValue} ${trendHTML}`;
    }

    if (totalDaysEl) {
        totalDaysEl.textContent = stats.totalEntries || '--';
    }

    if (walkPctEl) {
        const walkValue =
            stats.activity.walking.percentage !== null
                ? `${stats.activity.walking.percentage}%`
                : '--';
        const trendHTML = stats.trends?.walking ? getTrendHTML(stats.trends.walking) : '';
        walkPctEl.innerHTML = `${walkValue} ${trendHTML}`;
    }
}

/**
 * Render health score bar chart
 * @param {Object} healthStats - Health score statistics
 */
function renderHealthScoreChart(healthStats) {
    const container = document.getElementById('health-score-chart');
    if (!container) {
        return;
    }

    if (!healthStats.entries || healthStats.entries.length === 0) {
        container.innerHTML = '<p class="no-data">Geen data beschikbaar</p>';
        return;
    }

    // Create bar chart
    const bars = healthStats.entries
        .map(entry => {
            const height = entry.score; // 0-100%
            return `<div class="bar-chart-bar" style="height: ${height}%" data-value="${entry.score}%" title="${formatDateShort(entry.date)}: ${entry.score}%"></div>`;
        })
        .join('');

    container.innerHTML = `<div class="bar-chart">${bars}</div>`;
}

/**
 * Render weight line chart
 * @param {Object} weightStats - Weight statistics
 */
function renderWeightChart(weightStats) {
    const container = document.getElementById('weight-chart');
    const currentEl = document.getElementById('weight-current');
    const changeEl = document.getElementById('weight-change');

    // Update current weight
    if (currentEl) {
        currentEl.textContent =
            weightStats.current !== null ? `${weightStats.current} kg` : '-- kg';
    }

    // Update weight change
    if (changeEl) {
        if (weightStats.change !== null) {
            const sign = weightStats.change > 0 ? '+' : '';
            changeEl.textContent = `${sign}${weightStats.change} kg`;
            changeEl.className = `weight-change ${weightStats.trend || ''}`;
        } else {
            changeEl.textContent = '';
        }
    }

    if (!container) {
        return;
    }

    if (!weightStats.entries || weightStats.entries.length === 0) {
        container.innerHTML = '<p class="no-data">Nog geen gewicht geregistreerd</p>';
        return;
    }

    if (weightStats.entries.length === 1) {
        container.innerHTML =
            '<p class="no-data">Eén meting geregistreerd — voeg meer toe voor trend</p>';
        return;
    }

    // Create SVG line chart
    const entries = weightStats.entries;
    const width = 300;
    const height = 120;
    const padding = { top: 10, right: 10, bottom: 20, left: 10 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    // Calculate scales
    const weights = entries.map(e => e.weight);
    const minWeight = Math.min(...weights) - 1;
    const maxWeight = Math.max(...weights) + 1;
    const weightRange = maxWeight - minWeight || 1;

    // Generate points
    const points = entries.map((entry, i) => {
        const x = padding.left + (i / (entries.length - 1)) * chartWidth;
        const y =
            padding.top + chartHeight - ((entry.weight - minWeight) / weightRange) * chartHeight;
        return { x, y, weight: entry.weight, date: entry.date };
    });

    // Create path
    const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

    // Create area path
    const areaPath =
        linePath +
        ` L ${points[points.length - 1].x} ${height - padding.bottom}` +
        ` L ${points[0].x} ${height - padding.bottom} Z`;

    // Create dots
    const dots = points
        .map(
            p =>
                `<circle cx="${p.x}" cy="${p.y}" r="3" class="line-chart-dot">
            <title>${formatDateShort(p.date)}: ${p.weight} kg</title>
        </circle>`
        )
        .join('');

    container.innerHTML = `
        <svg class="line-chart" viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid meet">
            <path class="line-chart-area" d="${areaPath}"/>
            <path class="line-chart-path" d="${linePath}"/>
            ${dots}
        </svg>
    `;
}

/**
 * Render activity statistics
 * @param {Object} activityStats - Activity statistics
 * @param {Object} trends - Trend data
 */
function renderActivityStats(activityStats, trends) {
    // Sleep
    const sleepAvgEl = document.getElementById('stats-sleep-avg');
    const sleepBarEl = document.getElementById('stats-sleep-bar');
    if (sleepAvgEl && sleepBarEl) {
        const sleepAvg = activityStats.sleep.average;
        const trendHTML = trends?.sleep ? getTrendHTML(trends.sleep) : '';
        sleepAvgEl.innerHTML = sleepAvg !== null ? `${sleepAvg}/10 ${trendHTML}` : '--';
        sleepBarEl.style.width = sleepAvg !== null ? `${sleepAvg * 10}%` : '0%';
    }

    // Water - show goal completion instead of average
    const waterAvgEl = document.getElementById('stats-water-avg');
    const waterBarEl = document.getElementById('stats-water-bar');
    if (waterAvgEl && waterBarEl) {
        const waterEntries = activityStats.water.entries || [];
        const daysGoalMet = waterEntries.filter(e => e.glasses >= 8).length;
        const totalDays = waterEntries.length;
        const trendHTML = trends?.water ? getTrendHTML(trends.water) : '';

        if (totalDays > 0) {
            waterAvgEl.innerHTML = `${daysGoalMet}/${totalDays} ${trendHTML}`;
            waterBarEl.style.width = `${(daysGoalMet / totalDays) * 100}%`;
        } else {
            waterAvgEl.textContent = '--';
            waterBarEl.style.width = '0%';
        }
    }

    // Back pain
    const painAvgEl = document.getElementById('stats-pain-avg');
    const painBarEl = document.getElementById('stats-pain-bar');
    if (painAvgEl && painBarEl) {
        const painAvg = activityStats.backPain.average;
        const trendHTML = trends?.backPain ? getTrendHTML(trends.backPain) : '';
        painAvgEl.innerHTML = painAvg !== null ? `${painAvg}/10 ${trendHTML}` : '--';
        painBarEl.style.width = painAvg !== null ? `${painAvg * 10}%` : '0%';
    }
}

/**
 * Generate streak dots HTML
 * @param {Array} recentDays - Array of recent days with clean status
 * @returns {string} HTML for streak dots
 */
function getStreakDotsHTML(recentDays) {
    if (!recentDays || recentDays.length === 0) {
        return '';
    }

    const dots = recentDays
        .map(day => {
            if (day.isToday) {
                return `<span class="streak-dot streak-dot-today" title="Vandaag" aria-label="Vandaag">◐</span>`;
            }
            if (day.clean === true) {
                return `<span class="streak-dot streak-dot-clean" title="Clean" aria-label="Clean dag">●</span>`;
            }
            if (day.clean === false) {
                return `<span class="streak-dot streak-dot-consumed" title="Geconsumeerd" aria-label="Niet clean">○</span>`;
            }
            return `<span class="streak-dot streak-dot-nodata" title="Geen data" aria-label="Geen data">·</span>`;
        })
        .join('');

    return `<div class="streak-dots">${dots}</div>`;
}

/**
 * Render consumption statistics
 * @param {Object} consumptionStats - Consumption statistics
 */
function renderConsumptionStats(consumptionStats) {
    const totalDays = consumptionStats.totalDays || 0;

    // Sugar - show current streak with dots
    const sugarBarEl = document.getElementById('stats-sugar-bar');
    const sugarDetailEl = document.getElementById('stats-sugar-detail');
    if (sugarBarEl && sugarDetailEl) {
        const currentStreak = consumptionStats.sugar.currentStreak || 0;
        const bestStreak = consumptionStats.sugar.bestStreak || 0;
        const cleanPct = totalDays > 0 ? (consumptionStats.sugar.daysClean / totalDays) * 100 : 0;
        sugarBarEl.style.width = `${cleanPct}%`;

        if (totalDays === 0) {
            sugarDetailEl.innerHTML = 'Geen data';
        } else {
            const streakDots = getStreakDotsHTML(consumptionStats.sugar.recentDays);
            sugarDetailEl.innerHTML = `
                <div class="streak-info">
                    <span class="streak-current">🎯 ${currentStreak} dagen clean</span>
                    <span class="streak-best">Best: ${bestStreak}</span>
                </div>
                ${streakDots}
            `;
        }
    }

    // Alcohol - show current streak with dots
    const alcoholBarEl = document.getElementById('stats-alcohol-bar');
    const alcoholDetailEl = document.getElementById('stats-alcohol-detail');
    if (alcoholBarEl && alcoholDetailEl) {
        const currentStreak = consumptionStats.alcohol.currentStreak || 0;
        const bestStreak = consumptionStats.alcohol.bestStreak || 0;
        const cleanPct = totalDays > 0 ? (consumptionStats.alcohol.daysClean / totalDays) * 100 : 0;
        alcoholBarEl.style.width = `${cleanPct}%`;

        if (totalDays === 0) {
            alcoholDetailEl.innerHTML = 'Geen data';
        } else {
            const streakDots = getStreakDotsHTML(consumptionStats.alcohol.recentDays);
            alcoholDetailEl.innerHTML = `
                <div class="streak-info">
                    <span class="streak-current">🎯 ${currentStreak} dagen clean</span>
                    <span class="streak-best">Best: ${bestStreak}</span>
                </div>
                ${streakDots}
            `;
        }
    }

    // Caffeine - show frequency (neutral, caffeine is not inherently bad)
    const caffeineBarEl = document.getElementById('stats-caffeine-bar');
    const caffeineDetailEl = document.getElementById('stats-caffeine-detail');
    if (caffeineBarEl && caffeineDetailEl) {
        const daysConsumed = consumptionStats.caffeine.daysConsumed || 0;
        const pct = totalDays > 0 ? (daysConsumed / totalDays) * 100 : 0;
        caffeineBarEl.style.width = `${pct}%`;

        if (totalDays === 0) {
            caffeineDetailEl.textContent = 'Geen data';
        } else {
            caffeineDetailEl.textContent = `${daysConsumed}/${totalDays} dagen`;
        }
    }
}

/**
 * Render energy and mood statistics
 * @param {Object} activityStats - Activity statistics containing energy and mood
 */
function renderEnergyMoodStats(activityStats) {
    const container = document.getElementById('energy-mood-stats');
    if (!container) {
        return;
    }

    const { energy, mood } = activityStats;

    // Check if we have data
    if (energy.totalDays === 0 && mood.totalDays === 0) {
        container.innerHTML = '<p class="no-data">Nog geen energie/stemming geregistreerd</p>';
        return;
    }

    let html = '<div class="energy-mood-grid">';

    // Energy distribution
    if (energy.totalDays > 0) {
        const maxCount = Math.max(...energy.distribution, 1);
        const bars = energy.distribution
            .map((count, i) => {
                const height = (count / maxCount) * 100;
                const label = energy.labels[i];
                return `
                <div class="distribution-bar-wrapper">
                    <div class="distribution-bar" style="height: ${height}%" title="${count} dagen"></div>
                    <span class="distribution-label">${label}</span>
                </div>
            `;
            })
            .join('');

        html += `
            <div class="distribution-card">
                <h4>Energie</h4>
                <div class="distribution-chart">${bars}</div>
                <div class="distribution-avg">Gem: ${energy.average !== null ? energy.average.toFixed(1) : '--'}/5</div>
            </div>
        `;
    }

    // Mood distribution
    if (mood.totalDays > 0) {
        const maxCount = Math.max(...mood.distribution, 1);
        const bars = mood.distribution
            .map((count, i) => {
                const height = (count / maxCount) * 100;
                const label = mood.labels[i];
                return `
                <div class="distribution-bar-wrapper">
                    <div class="distribution-bar mood" style="height: ${height}%" title="${count} dagen"></div>
                    <span class="distribution-label">${label}</span>
                </div>
            `;
            })
            .join('');

        html += `
            <div class="distribution-card">
                <h4>Stemming</h4>
                <div class="distribution-chart">${bars}</div>
                <div class="distribution-avg">Gem: ${mood.average !== null ? mood.average.toFixed(1) : '--'}/5</div>
            </div>
        `;
    }

    html += '</div>';
    container.innerHTML = html;
}

/**
 * Refresh statistics (call when data changes)
 */
export function refreshStatistics() {
    renderStatistics(currentPeriod);
}
