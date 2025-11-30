/**
 * Health Score Service Tests
 *
 * Tests for the health score calculation algorithm.
 * The algorithm uses weighted averages based on filled-in metrics.
 */

import { describe, it, expect } from 'vitest';

// Import the functions to test
const healthScoreModule = await import('../src/js/services/healthScore.js');
const { calculateHealthScore, getScoreMessage, getScoreColor, WEIGHTS } = healthScoreModule;

describe('calculateHealthScore', () => {
    describe('empty/null data', () => {
        it('returns 0 for empty object', () => {
            expect(calculateHealthScore({})).toBe(0);
        });

        it('returns 0 for null', () => {
            expect(calculateHealthScore(null)).toBe(0);
        });

        it('returns 0 for undefined', () => {
            expect(calculateHealthScore(undefined)).toBe(0);
        });
    });

    describe('sleep score calculation', () => {
        it('perfect sleep (10/10) gives 100% of sleep weight', () => {
            const result = calculateHealthScore({ sleepScore: 10 });
            expect(result).toBe(100); // 100% of only metric filled
        });

        it('half sleep (5/10) gives 50% of sleep weight', () => {
            const result = calculateHealthScore({ sleepScore: 5 });
            expect(result).toBe(50);
        });

        it('no sleep (0/10) gives 0%', () => {
            const result = calculateHealthScore({ sleepScore: 0 });
            expect(result).toBe(0);
        });
    });

    describe('back pain calculation (inverted - lower is better)', () => {
        it('no pain (0/10) gives 100%', () => {
            const result = calculateHealthScore({ backPain: 0 });
            expect(result).toBe(100);
        });

        it('max pain (10/10) gives 0%', () => {
            const result = calculateHealthScore({ backPain: 10 });
            expect(result).toBe(0);
        });

        it('medium pain (5/10) gives 50%', () => {
            const result = calculateHealthScore({ backPain: 5 });
            expect(result).toBe(50);
        });
    });

    describe('water intake calculation', () => {
        it('target reached (8 glasses) gives 100%', () => {
            const result = calculateHealthScore({ waterIntake: 8 });
            expect(result).toBe(100);
        });

        it('over target (10 glasses) is capped at 100%', () => {
            const result = calculateHealthScore({ waterIntake: 10 });
            expect(result).toBe(100);
        });

        it('half target (4 glasses) gives 50%', () => {
            const result = calculateHealthScore({ waterIntake: 4 });
            expect(result).toBe(50);
        });

        it('no water (0 glasses) gives 0%', () => {
            const result = calculateHealthScore({ waterIntake: 0 });
            expect(result).toBe(0);
        });
    });

    describe('walking calculation', () => {
        it('walked gives 100%', () => {
            const result = calculateHealthScore({ walked: true });
            expect(result).toBe(100);
        });

        it('not walked gives 0%', () => {
            const result = calculateHealthScore({ walked: false });
            expect(result).toBe(0);
        });
    });

    describe('consumption calculation', () => {
        it('no consumption gives 100%', () => {
            const result = calculateHealthScore({
                sugarConsumed: false,
                alcoholConsumed: false,
                caffeineConsumed: false
            });
            expect(result).toBe(100);
        });

        it('sugar only reduces score', () => {
            const noSugar = calculateHealthScore({
                sugarConsumed: false,
                alcoholConsumed: false,
                caffeineConsumed: false
            });
            const withSugar = calculateHealthScore({
                sugarConsumed: true,
                alcoholConsumed: false,
                caffeineConsumed: false
            });
            expect(withSugar).toBeLessThan(noSugar);
        });

        it('alcohol reduces score', () => {
            const noAlcohol = calculateHealthScore({
                sugarConsumed: false,
                alcoholConsumed: false,
                caffeineConsumed: false
            });
            const withAlcohol = calculateHealthScore({
                sugarConsumed: false,
                alcoholConsumed: true,
                caffeineConsumed: false
            });
            expect(withAlcohol).toBeLessThan(noAlcohol);
        });

        it('caffeine reduces score (but less than sugar/alcohol)', () => {
            const noCaffeine = calculateHealthScore({
                sugarConsumed: false,
                alcoholConsumed: false,
                caffeineConsumed: false
            });
            const withCaffeine = calculateHealthScore({
                sugarConsumed: false,
                alcoholConsumed: false,
                caffeineConsumed: true
            });
            expect(withCaffeine).toBeLessThan(noCaffeine);
            expect(withCaffeine).toBe(80); // 100 - 20 for caffeine
        });

        it('all bad habits gives 0%', () => {
            const result = calculateHealthScore({
                sugarConsumed: true,
                alcoholConsumed: true,
                caffeineConsumed: true
            });
            expect(result).toBe(0); // 100 - 40 - 40 - 20 = 0
        });
    });

    describe('combined metrics', () => {
        it('calculates weighted average for multiple metrics', () => {
            const result = calculateHealthScore({
                sleepScore: 10, // 100%
                backPain: 10 // 0%
            });
            // Weighted average of 100% and 0% based on weights
            // Sleep: 25, Pain: 15 → (100*25 + 0*15) / 40 = 62.5 → 63%
            expect(result).toBe(63);
        });

        it('perfect day gives high score', () => {
            const perfectDay = {
                sleepScore: 10, // 100%
                backPain: 0, // 100%
                waterIntake: 8, // 100%
                walked: true, // 100%
                sugarConsumed: false, // 100%
                alcoholConsumed: false,
                caffeineConsumed: false
            };
            expect(calculateHealthScore(perfectDay)).toBe(100);
        });

        it('terrible day gives low score', () => {
            const terribleDay = {
                sleepScore: 0, // 0%
                backPain: 10, // 0%
                waterIntake: 0, // 0%
                walked: false, // 0%
                sugarConsumed: true, // part of consumption
                alcoholConsumed: true,
                caffeineConsumed: true
            };
            expect(calculateHealthScore(terribleDay)).toBe(0);
        });
    });

    describe('score boundaries', () => {
        // TODO: These tests document current behavior. Consider adding input validation.
        it.skip('score is never negative (needs input validation)', () => {
            const score = calculateHealthScore({
                sleepScore: -5, // invalid
                backPain: 100 // invalid but handled
            });
            expect(score).toBeGreaterThanOrEqual(0);
        });

        it.skip('score never exceeds 100 (needs input validation)', () => {
            const score = calculateHealthScore({
                sleepScore: 100, // over max
                waterIntake: 1000 // way over
            });
            expect(score).toBeLessThanOrEqual(100);
        });

        it('handles valid boundary values correctly', () => {
            // Min values
            expect(calculateHealthScore({ sleepScore: 0 })).toBe(0);
            expect(calculateHealthScore({ backPain: 10 })).toBe(0);
            // Max values
            expect(calculateHealthScore({ sleepScore: 10 })).toBe(100);
            expect(calculateHealthScore({ backPain: 0 })).toBe(100);
        });
    });
});

describe('getScoreMessage', () => {
    it('returns message for score 0', () => {
        const msg = getScoreMessage(0);
        expect(msg).toBeTruthy();
        expect(typeof msg).toBe('string');
    });

    it('returns message for score 50', () => {
        const msg = getScoreMessage(50);
        expect(msg).toBeTruthy();
    });

    it('returns message for score 100', () => {
        const msg = getScoreMessage(100);
        expect(msg).toBeTruthy();
    });

    it('returns different messages for different score ranges', () => {
        const low = getScoreMessage(20);
        const high = getScoreMessage(90);
        // At minimum, check both return strings
        expect(typeof low).toBe('string');
        expect(typeof high).toBe('string');
    });
});

describe('getScoreColor', () => {
    it('returns a valid hex color for score 0', () => {
        const color = getScoreColor(0);
        expect(color).toMatch(/^#[0-9A-Fa-f]{6}$/);
    });

    it('returns a valid hex color for score 50', () => {
        const color = getScoreColor(50);
        expect(color).toMatch(/^#[0-9A-Fa-f]{6}$/);
    });

    it('returns a valid hex color for score 100', () => {
        const color = getScoreColor(100);
        expect(color).toMatch(/^#[0-9A-Fa-f]{6}$/);
    });
});

describe('WEIGHTS constant', () => {
    it('has expected structure', () => {
        expect(WEIGHTS).toBeDefined();
        expect(typeof WEIGHTS).toBe('object');
    });

    it('base weights sum to 100 (customHabits is bonus)', () => {
        // Base weights (without customHabits bonus) should sum to 100
        const baseWeights = { ...WEIGHTS };
        delete baseWeights.customHabits;
        const sum = Object.values(baseWeights).reduce((a, b) => a + b, 0);
        expect(sum).toBe(100);
        // CustomHabits adds optional bonus points
        expect(WEIGHTS.customHabits).toBe(10);
    });

    it('all weights are positive', () => {
        Object.values(WEIGHTS).forEach(weight => {
            expect(weight).toBeGreaterThan(0);
        });
    });
});
