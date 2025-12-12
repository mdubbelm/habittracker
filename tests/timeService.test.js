import { describe, it, expect } from 'vitest';
import { hasAnyData } from '../src/js/services/timeService.js';

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
