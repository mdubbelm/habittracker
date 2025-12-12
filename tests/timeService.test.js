import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
    hasAnyData,
    TIME_WINDOWS,
    getCurrentHour,
    isInTimeWindow,
    getCurrentTimeWindow,
    getMissedWindows,
    isSectionComplete,
    getSectionVisibility,
    getTimeWindowLabel
} from '../src/js/services/timeService.js';

describe('hasAnyData', () => {
    it('returns false for null/undefined', () => {
        expect(hasAnyData(null)).toBe(false);
        expect(hasAnyData(undefined)).toBe(false);
    });

    it('returns false for empty object', () => {
        expect(hasAnyData({})).toBe(false);
    });

    it('returns false for object with only metadata', () => {
        expect(hasAnyData({ date: '2025-12-12', timestamp: 123456789 })).toBe(false);
        expect(hasAnyData({ explicitSave: true })).toBe(false);
    });

    it('returns true when sleepScore is set', () => {
        expect(hasAnyData({ sleepScore: 7 })).toBe(true);
        expect(hasAnyData({ sleepScore: 0 })).toBe(true);
    });

    it('returns true when backPain is set', () => {
        expect(hasAnyData({ backPain: 3 })).toBe(true);
    });

    it('returns true when dreamed is set', () => {
        expect(hasAnyData({ dreamed: true })).toBe(true);
        expect(hasAnyData({ dreamed: false })).toBe(true);
    });

    it('returns true when weight is set', () => {
        expect(hasAnyData({ weight: 75.5 })).toBe(true);
    });

    it('returns true when walked is set', () => {
        expect(hasAnyData({ walked: true })).toBe(true);
        expect(hasAnyData({ walked: false })).toBe(true);
    });

    it('returns true when mood is set', () => {
        expect(hasAnyData({ mood: 'good' })).toBe(true);
    });

    it('returns true when waterIntake is set', () => {
        expect(hasAnyData({ waterIntake: 5 })).toBe(true);
        expect(hasAnyData({ waterIntake: 0 })).toBe(true);
    });

    it('returns true when consumption fields are set', () => {
        expect(hasAnyData({ sugarConsumed: false })).toBe(true);
        expect(hasAnyData({ alcoholConsumed: true })).toBe(true);
        expect(hasAnyData({ caffeineConsumed: false })).toBe(true);
    });

    it('returns true when reading is set', () => {
        expect(hasAnyData({ reading: true })).toBe(true);
    });

    it('returns true when energyLevel is set', () => {
        expect(hasAnyData({ energyLevel: 7 })).toBe(true);
    });

    it('returns false for empty string values', () => {
        expect(hasAnyData({ sleepScore: '' })).toBe(false);
        expect(hasAnyData({ mood: '' })).toBe(false);
    });

    it('returns true with mixed data and metadata', () => {
        expect(
            hasAnyData({
                date: '2025-12-12',
                sleepScore: 8,
                explicitSave: false
            })
        ).toBe(true);
    });
});

describe('TIME_WINDOWS', () => {
    it('has morning window from 6 to 10', () => {
        expect(TIME_WINDOWS.morning.start).toBe(6);
        expect(TIME_WINDOWS.morning.end).toBe(10);
    });

    it('has weight window from 5 to 12', () => {
        expect(TIME_WINDOWS.weight.start).toBe(5);
        expect(TIME_WINDOWS.weight.end).toBe(12);
    });

    it('has evening window from 20 to 24', () => {
        expect(TIME_WINDOWS.evening.start).toBe(20);
        expect(TIME_WINDOWS.evening.end).toBe(24);
    });
});

describe('getCurrentHour', () => {
    it('returns a number between 0 and 23', () => {
        const hour = getCurrentHour();
        expect(hour).toBeGreaterThanOrEqual(0);
        expect(hour).toBeLessThanOrEqual(23);
    });
});

describe('isSectionComplete', () => {
    describe('morning section', () => {
        it('returns false for empty data', () => {
            expect(isSectionComplete({}, 'morning')).toBe(false);
            expect(isSectionComplete(null, 'morning')).toBe(false);
        });

        it('returns false when missing explicitSave', () => {
            const data = {
                sleepScore: 8,
                backPain: 2,
                dreamed: 'yes'
            };
            expect(isSectionComplete(data, 'morning')).toBe(false);
        });

        it('returns false when missing required fields', () => {
            const data = {
                sleepScore: 8,
                explicitSave: true
            };
            expect(isSectionComplete(data, 'morning')).toBe(false);
        });

        it('returns true when all fields present and explicitSave', () => {
            const data = {
                sleepScore: 8,
                backPain: 2,
                dreamed: 'yes',
                explicitSave: true
            };
            expect(isSectionComplete(data, 'morning')).toBe(true);
        });

        it('handles dreamed boolean value', () => {
            const data = {
                sleepScore: 8,
                backPain: 2,
                dreamed: true,
                explicitSave: true
            };
            expect(isSectionComplete(data, 'morning')).toBe(true);
        });

        it('returns false when dreamed is empty string', () => {
            const data = {
                sleepScore: 8,
                backPain: 2,
                dreamed: '',
                explicitSave: true
            };
            expect(isSectionComplete(data, 'morning')).toBe(false);
        });
    });

    describe('evening section', () => {
        it('returns false for empty data', () => {
            expect(isSectionComplete({}, 'evening')).toBe(false);
        });

        it('returns false when missing explicitSave', () => {
            const data = {
                walked: true,
                mood: 4
            };
            expect(isSectionComplete(data, 'evening')).toBe(false);
        });

        it('returns true when all fields present and explicitSave', () => {
            const data = {
                walked: true,
                mood: 4,
                explicitSave: true
            };
            expect(isSectionComplete(data, 'evening')).toBe(true);
        });

        it('returns false when mood is null', () => {
            const data = {
                walked: true,
                mood: null,
                explicitSave: true
            };
            expect(isSectionComplete(data, 'evening')).toBe(false);
        });
    });

    describe('unknown section', () => {
        it('returns false for unknown section', () => {
            expect(isSectionComplete({ sleepScore: 8 }, 'unknown')).toBe(false);
        });
    });
});

describe('Time-dependent functions', () => {
    let originalDate;

    beforeEach(() => {
        originalDate = Date;
    });

    afterEach(() => {
        global.Date = originalDate;
        vi.restoreAllMocks();
    });

    function mockHour(hour) {
        const mockDate = class extends Date {
            getHours() {
                return hour;
            }
        };
        global.Date = mockDate;
    }

    describe('isInTimeWindow', () => {
        it('returns true during morning window (7am)', () => {
            mockHour(7);
            expect(isInTimeWindow('morning')).toBe(true);
        });

        it('returns false outside morning window (11am)', () => {
            mockHour(11);
            expect(isInTimeWindow('morning')).toBe(false);
        });

        it('returns true during evening window (21pm)', () => {
            mockHour(21);
            expect(isInTimeWindow('evening')).toBe(true);
        });

        it('returns false outside evening window (15pm)', () => {
            mockHour(15);
            expect(isInTimeWindow('evening')).toBe(false);
        });

        it('returns false for invalid window name', () => {
            mockHour(7);
            expect(isInTimeWindow('invalid')).toBe(false);
        });
    });

    describe('getCurrentTimeWindow', () => {
        it('returns morning at 7am', () => {
            mockHour(7);
            expect(getCurrentTimeWindow()).toBe('morning');
        });

        it('returns day at 14pm', () => {
            mockHour(14);
            expect(getCurrentTimeWindow()).toBe('day');
        });

        it('returns evening at 21pm', () => {
            mockHour(21);
            expect(getCurrentTimeWindow()).toBe('evening');
        });

        it('returns evening at 23pm', () => {
            mockHour(23);
            expect(getCurrentTimeWindow()).toBe('evening');
        });
    });

    describe('getMissedWindows', () => {
        it('returns missedMorning false during morning window', () => {
            mockHour(8);
            const result = getMissedWindows({});
            expect(result.missedMorning).toBe(false);
        });

        it('returns missedMorning true after morning window with incomplete data', () => {
            mockHour(14);
            const result = getMissedWindows({});
            expect(result.missedMorning).toBe(true);
        });

        it('returns missedMorning false after morning window with complete data', () => {
            mockHour(14);
            const completeData = {
                sleepScore: 8,
                backPain: 2,
                dreamed: 'yes',
                explicitSave: true
            };
            const result = getMissedWindows(completeData);
            expect(result.missedMorning).toBe(false);
        });
    });

    describe('getSectionVisibility', () => {
        it('shows morning section during morning window', () => {
            mockHour(8);
            const visibility = getSectionVisibility({});
            expect(visibility.morning.visible).toBe(true);
            expect(visibility.morning.reason).toBe('time');
        });

        it('hides morning section outside morning window', () => {
            mockHour(14);
            const visibility = getSectionVisibility({});
            expect(visibility.morning.visible).toBe(false);
        });

        it('shows weight section during weight window', () => {
            mockHour(10);
            const visibility = getSectionVisibility({});
            expect(visibility.weight.visible).toBe(true);
        });

        it('hides weight section outside weight window', () => {
            mockHour(15);
            const visibility = getSectionVisibility({});
            expect(visibility.weight.visible).toBe(false);
        });

        it('shows evening section during evening window', () => {
            mockHour(21);
            const visibility = getSectionVisibility({});
            expect(visibility.evening.visible).toBe(true);
        });

        it('water section is always visible', () => {
            mockHour(14);
            const visibility = getSectionVisibility({});
            expect(visibility.water.visible).toBe(true);
            expect(visibility.water.reason).toBe('always');
        });

        it('shows fallback when morning was missed', () => {
            mockHour(14);
            const visibility = getSectionVisibility({});
            expect(visibility.showFallback).toBe(true);
        });

        it('hides fallback when morning is complete', () => {
            mockHour(14);
            const completeData = {
                sleepScore: 8,
                backPain: 2,
                dreamed: 'yes',
                explicitSave: true
            };
            const visibility = getSectionVisibility(completeData);
            expect(visibility.showFallback).toBe(false);
        });

        it('hides morning section when complete', () => {
            mockHour(8);
            const completeData = {
                sleepScore: 8,
                backPain: 2,
                dreamed: 'yes',
                explicitSave: true
            };
            const visibility = getSectionVisibility(completeData);
            expect(visibility.morning.visible).toBe(false);
            expect(visibility.morning.reason).toBe('complete');
        });
    });

    describe('getTimeWindowLabel', () => {
        it('returns Goedemorgen in morning', () => {
            mockHour(8);
            expect(getTimeWindowLabel()).toBe('Goedemorgen');
        });

        it('returns Goedemiddag during day', () => {
            mockHour(14);
            expect(getTimeWindowLabel()).toBe('Goedemiddag');
        });

        it('returns Goedenavond in evening', () => {
            mockHour(21);
            expect(getTimeWindowLabel()).toBe('Goedenavond');
        });
    });
});
