import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
    getAllData,
    getDataForDate,
    getTodayDate,
    getTodayData,
    saveDataForDate,
    saveTodayData,
    deleteDataForDate,
    deleteAllData,
    exportAsJSON,
    exportAsCSV,
    importFromJSON,
    getStorageStats,
    hasAcceptedPrivacy,
    acceptPrivacy
} from '../src/js/services/storage.js';

describe('Storage Service', () => {
    beforeEach(() => {
        // Clear localStorage before each test
        localStorage.clear();
    });

    describe('getTodayDate', () => {
        it('returns date in YYYY-MM-DD format', () => {
            const today = getTodayDate();
            expect(today).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        });

        it('returns current date', () => {
            const today = getTodayDate();
            const expected = new Date().toISOString().split('T')[0];
            expect(today).toBe(expected);
        });
    });

    describe('getAllData', () => {
        it('returns empty object when no data stored', () => {
            expect(getAllData()).toEqual({});
        });

        it('returns stored data', () => {
            const testData = { '2025-01-01': { sleepScore: 8 } };
            localStorage.setItem('healthTracker_data', JSON.stringify(testData));
            expect(getAllData()).toEqual(testData);
        });

        it('handles invalid JSON gracefully', () => {
            localStorage.setItem('healthTracker_data', 'invalid json');
            expect(getAllData()).toEqual({});
        });
    });

    describe('getDataForDate', () => {
        it('returns null when no data for date', () => {
            expect(getDataForDate('2025-01-01')).toBeNull();
        });

        it('returns data for specific date', () => {
            const testData = { '2025-01-01': { sleepScore: 8 } };
            localStorage.setItem('healthTracker_data', JSON.stringify(testData));
            expect(getDataForDate('2025-01-01')).toEqual({ sleepScore: 8 });
        });
    });

    describe('getTodayData', () => {
        it('returns null when no data for today', () => {
            expect(getTodayData()).toBeNull();
        });

        it('returns data for today', () => {
            const today = getTodayDate();
            const testData = { [today]: { sleepScore: 7 } };
            localStorage.setItem('healthTracker_data', JSON.stringify(testData));
            expect(getTodayData()).toEqual({ sleepScore: 7 });
        });
    });

    describe('saveDataForDate', () => {
        it('saves data for valid date', () => {
            const result = saveDataForDate('2025-01-15', { sleepScore: 8 });
            expect(result).toBe(true);

            const saved = getDataForDate('2025-01-15');
            expect(saved.sleepScore).toBe(8);
        });

        it('rejects invalid date format', () => {
            const result = saveDataForDate('invalid-date', { sleepScore: 8 });
            expect(result).toBe(false);
        });

        it('rejects date without leading zeros', () => {
            const result = saveDataForDate('2025-1-5', { sleepScore: 8 });
            expect(result).toBe(false);
        });

        it('adds timestamp to saved data', () => {
            saveDataForDate('2025-01-15', { sleepScore: 8 });
            const saved = getDataForDate('2025-01-15');
            expect(saved.timestamp).toBeDefined();
        });

        it('sanitizes sleepScore out of range to default', () => {
            saveDataForDate('2025-01-15', { sleepScore: 15 });
            const saved = getDataForDate('2025-01-15');
            expect(saved.sleepScore).toBe(7); // Default is 7 when out of range
        });

        it('sanitizes backPain out of range to default', () => {
            saveDataForDate('2025-01-15', { backPain: -5 });
            const saved = getDataForDate('2025-01-15');
            expect(saved.backPain).toBe(0); // Default is 0 when out of range
        });

        it('sanitizes boolean fields', () => {
            saveDataForDate('2025-01-15', { walked: 'yes', reading: 1 });
            const saved = getDataForDate('2025-01-15');
            expect(saved.walked).toBe(true);
            expect(saved.reading).toBe(true);
        });

        it('preserves explicitSave flag', () => {
            saveDataForDate('2025-01-15', { sleepScore: 7, explicitSave: true });
            const saved = getDataForDate('2025-01-15');
            expect(saved.explicitSave).toBe(true);
        });

        it('migrates legacy sugarConsumed boolean to sugarPortions', () => {
            saveDataForDate('2025-01-15', { sugarConsumed: true });
            const saved = getDataForDate('2025-01-15');
            expect(saved.sugarPortions).toBe(1);
        });

        it('migrates legacy caffeineConsumed boolean to caffeineCount', () => {
            saveDataForDate('2025-01-15', { caffeineConsumed: true });
            const saved = getDataForDate('2025-01-15');
            expect(saved.caffeineCount).toBe(1);
        });

        it('migrates legacy alcoholConsumed boolean to alcoholCount', () => {
            saveDataForDate('2025-01-15', { alcoholConsumed: true });
            const saved = getDataForDate('2025-01-15');
            expect(saved.alcoholCount).toBe(1);
        });

        it('handles dreamed string values', () => {
            saveDataForDate('2025-01-15', { dreamed: 'yes' });
            const saved = getDataForDate('2025-01-15');
            expect(saved.dreamed).toBe('yes');
        });

        it('migrates dreamed boolean to string', () => {
            saveDataForDate('2025-01-15', { dreamed: true });
            const saved = getDataForDate('2025-01-15');
            expect(saved.dreamed).toBe('yes');
        });

        it('saves energyLevel within valid range', () => {
            saveDataForDate('2025-01-15', { energyLevel: 3 });
            const saved = getDataForDate('2025-01-15');
            expect(saved.energyLevel).toBe(3);
        });

        it('saves mood within valid range', () => {
            saveDataForDate('2025-01-15', { mood: 4 });
            const saved = getDataForDate('2025-01-15');
            expect(saved.mood).toBe(4);
        });
    });

    describe('saveTodayData', () => {
        it('saves data for today', () => {
            const result = saveTodayData({ sleepScore: 6 });
            expect(result).toBe(true);

            const saved = getTodayData();
            expect(saved.sleepScore).toBe(6);
        });
    });

    describe('deleteDataForDate', () => {
        it('deletes data for specific date', () => {
            saveDataForDate('2025-01-15', { sleepScore: 8 });
            expect(getDataForDate('2025-01-15')).not.toBeNull();

            deleteDataForDate('2025-01-15');
            expect(getDataForDate('2025-01-15')).toBeNull();
        });

        it('returns true on successful delete', () => {
            saveDataForDate('2025-01-15', { sleepScore: 8 });
            const result = deleteDataForDate('2025-01-15');
            expect(result).toBe(true);
        });
    });

    describe('deleteAllData', () => {
        it('removes all tracker data', () => {
            saveDataForDate('2025-01-15', { sleepScore: 8 });
            saveDataForDate('2025-01-16', { sleepScore: 7 });

            deleteAllData();

            expect(getAllData()).toEqual({});
        });
    });

    describe('exportAsJSON', () => {
        it('returns valid JSON string', () => {
            saveDataForDate('2025-01-15', { sleepScore: 8 });
            const json = exportAsJSON();
            const parsed = JSON.parse(json);
            expect(parsed['2025-01-15'].sleepScore).toBe(8);
        });

        it('returns empty object JSON when no data', () => {
            const json = exportAsJSON();
            expect(JSON.parse(json)).toEqual({});
        });
    });

    describe('exportAsCSV', () => {
        it('returns message when no data', () => {
            const csv = exportAsCSV();
            expect(csv).toBe('Geen data om te exporteren');
        });

        it('includes headers', () => {
            saveDataForDate('2025-01-15', { sleepScore: 8 });
            const csv = exportAsCSV();
            expect(csv).toContain('Datum');
            expect(csv).toContain('Slaapcijfer');
        });

        it('includes data rows', () => {
            saveDataForDate('2025-01-15', { sleepScore: 8, walked: true });
            const csv = exportAsCSV();
            expect(csv).toContain('2025-01-15');
            expect(csv).toContain('8');
            expect(csv).toContain('Ja');
        });
    });

    describe('importFromJSON', () => {
        it('imports data successfully', () => {
            const importData = { '2025-01-20': { sleepScore: 9 } };
            const result = importFromJSON(importData);
            expect(result).toBe(true);
            expect(getDataForDate('2025-01-20')).toEqual({ sleepScore: 9 });
        });

        it('merges with existing data', () => {
            saveDataForDate('2025-01-15', { sleepScore: 8 });
            importFromJSON({ '2025-01-20': { sleepScore: 9 } });

            expect(getDataForDate('2025-01-15')).not.toBeNull();
            expect(getDataForDate('2025-01-20')).not.toBeNull();
        });
    });

    describe('getStorageStats', () => {
        it('returns zero entries when empty', () => {
            const stats = getStorageStats();
            expect(stats.totalEntries).toBe(0);
            expect(stats.oldestEntry).toBeNull();
            expect(stats.newestEntry).toBeNull();
        });

        it('returns correct entry count', () => {
            saveDataForDate('2025-01-15', { sleepScore: 8 });
            saveDataForDate('2025-01-16', { sleepScore: 7 });
            saveDataForDate('2025-01-17', { sleepScore: 9 });

            const stats = getStorageStats();
            expect(stats.totalEntries).toBe(3);
        });

        it('returns oldest and newest entries', () => {
            saveDataForDate('2025-01-15', { sleepScore: 8 });
            saveDataForDate('2025-01-20', { sleepScore: 7 });

            const stats = getStorageStats();
            expect(stats.oldestEntry).toBe('2025-01-15');
            expect(stats.newestEntry).toBe('2025-01-20');
        });

        it('calculates storage size', () => {
            saveDataForDate('2025-01-15', { sleepScore: 8 });
            const stats = getStorageStats();
            expect(stats.storageSize).toBeGreaterThan(0);
            expect(parseFloat(stats.storageSizeKB)).toBeGreaterThan(0);
        });
    });

    describe('Privacy acceptance', () => {
        it('returns false when not accepted', () => {
            expect(hasAcceptedPrivacy()).toBe(false);
        });

        it('returns true after accepting', () => {
            acceptPrivacy();
            expect(hasAcceptedPrivacy()).toBe(true);
        });
    });
});
