/**
 * Calendar Service Tests
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
    getDaysInMonth,
    getFirstDayOfMonth,
    getMonthName,
    formatDateISO,
    isToday,
    isFuture,
    generateCalendarMonth,
    getPreviousMonth,
    getNextMonth,
    getWeekdayHeaders
} from '../src/js/services/calendarService.js';

describe('calendarService', () => {
    describe('getDaysInMonth', () => {
        it('returns 31 for January', () => {
            expect(getDaysInMonth(2025, 0)).toBe(31);
        });

        it('returns 28 for February in non-leap year', () => {
            expect(getDaysInMonth(2025, 1)).toBe(28);
        });

        it('returns 29 for February in leap year', () => {
            expect(getDaysInMonth(2024, 1)).toBe(29);
        });

        it('returns 30 for April', () => {
            expect(getDaysInMonth(2025, 3)).toBe(30);
        });

        it('returns 31 for December', () => {
            expect(getDaysInMonth(2025, 11)).toBe(31);
        });
    });

    describe('getFirstDayOfMonth', () => {
        it('returns correct weekday for December 2025 (Monday = 0)', () => {
            // December 1, 2025 is a Monday
            expect(getFirstDayOfMonth(2025, 11)).toBe(0);
        });

        it('returns correct weekday for January 2025', () => {
            // January 1, 2025 is a Wednesday
            expect(getFirstDayOfMonth(2025, 0)).toBe(2);
        });

        it('handles Sunday correctly (returns 6)', () => {
            // June 1, 2025 is a Sunday
            expect(getFirstDayOfMonth(2025, 5)).toBe(6);
        });
    });

    describe('getMonthName', () => {
        it('returns Dutch month names', () => {
            expect(getMonthName(0)).toBe('januari');
            expect(getMonthName(5)).toBe('juni');
            expect(getMonthName(11)).toBe('december');
        });
    });

    describe('formatDateISO', () => {
        it('formats date correctly', () => {
            expect(formatDateISO(2025, 0, 1)).toBe('2025-01-01');
            expect(formatDateISO(2025, 11, 31)).toBe('2025-12-31');
        });

        it('pads single digit months and days', () => {
            expect(formatDateISO(2025, 0, 5)).toBe('2025-01-05');
            expect(formatDateISO(2025, 8, 9)).toBe('2025-09-09');
        });
    });

    describe('isToday', () => {
        it('returns true for today', () => {
            const now = new Date();
            expect(isToday(now.getFullYear(), now.getMonth(), now.getDate())).toBe(true);
        });

        it('returns false for yesterday', () => {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            expect(isToday(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate())).toBe(
                false
            );
        });

        it('returns false for tomorrow', () => {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            expect(isToday(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate())).toBe(
                false
            );
        });
    });

    describe('isFuture', () => {
        it('returns true for tomorrow', () => {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            expect(isFuture(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate())).toBe(
                true
            );
        });

        it('returns false for today', () => {
            const now = new Date();
            expect(isFuture(now.getFullYear(), now.getMonth(), now.getDate())).toBe(false);
        });

        it('returns false for yesterday', () => {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            expect(
                isFuture(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate())
            ).toBe(false);
        });

        it('returns true for next year', () => {
            const nextYear = new Date();
            nextYear.setFullYear(nextYear.getFullYear() + 1);
            expect(isFuture(nextYear.getFullYear(), nextYear.getMonth(), nextYear.getDate())).toBe(
                true
            );
        });
    });

    describe('getPreviousMonth', () => {
        it('returns previous month in same year', () => {
            expect(getPreviousMonth(2025, 5)).toEqual({ year: 2025, month: 4 });
        });

        it('wraps to December of previous year', () => {
            expect(getPreviousMonth(2025, 0)).toEqual({ year: 2024, month: 11 });
        });
    });

    describe('getNextMonth', () => {
        it('returns next month in same year', () => {
            expect(getNextMonth(2025, 5)).toEqual({ year: 2025, month: 6 });
        });

        it('wraps to January of next year', () => {
            expect(getNextMonth(2025, 11)).toEqual({ year: 2026, month: 0 });
        });
    });

    describe('getWeekdayHeaders', () => {
        it('returns Dutch weekday abbreviations starting with Monday', () => {
            const headers = getWeekdayHeaders();
            expect(headers).toEqual(['ma', 'di', 'wo', 'do', 'vr', 'za', 'zo']);
        });
    });

    describe('generateCalendarMonth', () => {
        it('generates correct structure for December 2025', () => {
            const weeks = generateCalendarMonth(2025, 11, {});

            // December 2025 has 5 weeks in calendar view
            expect(weeks.length).toBeGreaterThanOrEqual(4);
            expect(weeks.length).toBeLessThanOrEqual(6);

            // First day (Monday Dec 1) should be first in first week
            expect(weeks[0][0].day).toBe(1);
            expect(weeks[0][0].date).toBe('2025-12-01');
        });

        it('includes empty cells for days before month starts', () => {
            // January 2025 starts on Wednesday (index 2)
            const weeks = generateCalendarMonth(2025, 0, {});

            // First two cells should be null
            expect(weeks[0][0]).toBeNull();
            expect(weeks[0][1]).toBeNull();
            expect(weeks[0][2].day).toBe(1);
        });

        it('calculates scores for days with data', () => {
            const trackerData = {
                '2025-12-01': {
                    sleepScore: 8,
                    waterIntake: 8,
                    walked: true
                }
            };

            const weeks = generateCalendarMonth(2025, 11, trackerData);
            const dec1 = weeks[0][0];

            expect(dec1.hasData).toBe(true);
            expect(dec1.score).toBeGreaterThan(0);
            expect(dec1.color).toBeDefined();
        });

        it('marks days without data correctly', () => {
            const weeks = generateCalendarMonth(2025, 11, {});
            const dec1 = weeks[0][0];

            expect(dec1.hasData).toBe(false);
            expect(dec1.score).toBeNull();
        });

        it('marks today correctly', () => {
            const today = new Date();
            const weeks = generateCalendarMonth(today.getFullYear(), today.getMonth(), {});

            // Find today in the calendar
            let foundToday = false;
            weeks.forEach(week => {
                week.forEach(day => {
                    if (day && day.isToday) {
                        expect(day.day).toBe(today.getDate());
                        foundToday = true;
                    }
                });
            });

            expect(foundToday).toBe(true);
        });

        it('marks future days correctly', () => {
            const today = new Date();
            const weeks = generateCalendarMonth(today.getFullYear(), today.getMonth(), {});

            // Future days should have isFuture: true
            weeks.forEach(week => {
                week.forEach(day => {
                    if (day && day.day > today.getDate() && !day.isToday) {
                        expect(day.isFuture).toBe(true);
                        expect(day.color).toBeNull();
                    }
                });
            });
        });
    });
});
