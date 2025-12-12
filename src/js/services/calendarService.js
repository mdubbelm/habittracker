/**
 * Calendar Service
 *
 * Provides calendar utilities for the history overview
 * Generates month grids with health score data
 *
 * @module services/calendarService
 */

import { calculateHealthScore, getScoreColor } from './healthScore.js';

/**
 * Get number of days in a month
 * @param {number} year - Full year (e.g., 2025)
 * @param {number} month - Month (0-11)
 * @returns {number} Number of days
 */
export function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
}

/**
 * Get the weekday of the first day of a month (Monday = 0)
 * @param {number} year - Full year
 * @param {number} month - Month (0-11)
 * @returns {number} Weekday (0 = Monday, 6 = Sunday)
 */
export function getFirstDayOfMonth(year, month) {
    const day = new Date(year, month, 1).getDay();
    // Convert from Sunday = 0 to Monday = 0
    return day === 0 ? 6 : day - 1;
}

/**
 * Format month name in Dutch
 * @param {number} month - Month (0-11)
 * @returns {string} Dutch month name
 */
export function getMonthName(month) {
    const months = [
        'januari',
        'februari',
        'maart',
        'april',
        'mei',
        'juni',
        'juli',
        'augustus',
        'september',
        'oktober',
        'november',
        'december'
    ];
    return months[month];
}

/**
 * Format date as ISO string (YYYY-MM-DD)
 * @param {number} year - Full year
 * @param {number} month - Month (0-11)
 * @param {number} day - Day of month
 * @returns {string} ISO date string
 */
export function formatDateISO(year, month, day) {
    const m = String(month + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${year}-${m}-${d}`;
}

/**
 * Check if a date is today
 * @param {number} year - Full year
 * @param {number} month - Month (0-11)
 * @param {number} day - Day of month
 * @returns {boolean} True if date is today
 */
export function isToday(year, month, day) {
    const today = new Date();
    return today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;
}

/**
 * Check if a date is in the future
 * @param {number} year - Full year
 * @param {number} month - Month (0-11)
 * @param {number} day - Day of month
 * @returns {boolean} True if date is in the future
 */
export function isFuture(year, month, day) {
    const date = new Date(year, month, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date > today;
}

/**
 * Generate calendar data for a month
 * @param {number} year - Full year
 * @param {number} month - Month (0-11)
 * @param {Object} trackerData - All tracker data (keyed by ISO date)
 * @returns {Array} Array of week arrays, each containing day objects
 */
export function generateCalendarMonth(year, month, trackerData = {}) {
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    const weeks = [];
    let currentWeek = [];

    // Add empty cells for days before the first of the month
    for (let i = 0; i < firstDay; i++) {
        currentWeek.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = formatDateISO(year, month, day);
        const dayData = trackerData[dateStr] || null;
        const score = dayData ? calculateHealthScore(dayData) : null;
        const future = isFuture(year, month, day);

        currentWeek.push({
            day,
            date: dateStr,
            score,
            color: future ? null : score !== null ? getScoreColor(score) : '#d1cbc3',
            isToday: isToday(year, month, day),
            isFuture: future,
            hasData: dayData !== null
        });

        // Start a new week after Sunday
        if (currentWeek.length === 7) {
            weeks.push(currentWeek);
            currentWeek = [];
        }
    }

    // Fill the last week with empty cells
    while (currentWeek.length > 0 && currentWeek.length < 7) {
        currentWeek.push(null);
    }
    if (currentWeek.length > 0) {
        weeks.push(currentWeek);
    }

    return weeks;
}

/**
 * Get previous month
 * @param {number} year - Full year
 * @param {number} month - Month (0-11)
 * @returns {Object} { year, month } of previous month
 */
export function getPreviousMonth(year, month) {
    if (month === 0) {
        return { year: year - 1, month: 11 };
    }
    return { year, month: month - 1 };
}

/**
 * Get next month
 * @param {number} year - Full year
 * @param {number} month - Month (0-11)
 * @returns {Object} { year, month } of next month
 */
export function getNextMonth(year, month) {
    if (month === 11) {
        return { year: year + 1, month: 0 };
    }
    return { year, month: month + 1 };
}

/**
 * Get weekday headers in Dutch (short)
 * @returns {Array} Array of weekday abbreviations
 */
export function getWeekdayHeaders() {
    return ['ma', 'di', 'wo', 'do', 'vr', 'za', 'zo'];
}
