import { describe, it, expect, beforeEach } from 'vitest';
import { generateDemoData, cleanupOldData, getFormattedStats } from '../src/js/services/dataManager.js';
import { getAllData, getDataForDate, saveDataForDate } from '../src/js/services/storage.js';

describe('Data Manager Service', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    // Note: importJSON and importCSV tests are skipped because File.text()
    // is not fully supported in jsdom. These functions work in the browser
    // and could be tested with e2e tests instead.

    describe('generateDemoData', () => {
        it('generates specified number of days', () => {
            const result = generateDemoData(5);

            expect(result.success).toBe(true);
            expect(result.count).toBe(5);

            const allData = getAllData();
            expect(Object.keys(allData).length).toBe(5);
        });

        it('defaults to 7 days', () => {
            const result = generateDemoData();

            expect(result.count).toBe(7);
        });

        it('generates data with required fields', () => {
            generateDemoData(1);

            const allData = getAllData();
            const entry = Object.values(allData)[0];

            expect(entry.sleepScore).toBeDefined();
            expect(entry.backPain).toBeDefined();
            expect(entry.waterIntake).toBeDefined();
            expect(typeof entry.walked).toBe('boolean');
        });

        it('generates sleepScore within valid range', () => {
            generateDemoData(10);

            const allData = getAllData();
            for (const entry of Object.values(allData)) {
                expect(entry.sleepScore).toBeGreaterThanOrEqual(1);
                expect(entry.sleepScore).toBeLessThanOrEqual(10);
            }
        });

        it('generates backPain within valid range', () => {
            generateDemoData(10);

            const allData = getAllData();
            for (const entry of Object.values(allData)) {
                expect(entry.backPain).toBeGreaterThanOrEqual(0);
                expect(entry.backPain).toBeLessThanOrEqual(10);
            }
        });
    });

    describe('cleanupOldData', () => {
        it('removes data older than specified days', () => {
            // Create data 100 days ago
            const oldDate = new Date();
            oldDate.setDate(oldDate.getDate() - 100);
            const oldDateStr = oldDate.toISOString().split('T')[0];

            // Create recent data
            const recentDate = new Date();
            recentDate.setDate(recentDate.getDate() - 10);
            const recentDateStr = recentDate.toISOString().split('T')[0];

            saveDataForDate(oldDateStr, { sleepScore: 5 });
            saveDataForDate(recentDateStr, { sleepScore: 8 });

            const result = cleanupOldData(90);

            expect(result.success).toBe(true);
            expect(result.count).toBe(1);
            expect(getDataForDate(oldDateStr)).toBeNull();
            expect(getDataForDate(recentDateStr)).not.toBeNull();
        });

        it('returns message when no old data to delete', () => {
            saveDataForDate(new Date().toISOString().split('T')[0], { sleepScore: 8 });

            const result = cleanupOldData(90);

            expect(result.success).toBe(true);
            expect(result.count).toBe(0);
            expect(result.message).toContain('Geen oude data');
        });

        it('defaults to 90 days', () => {
            // Create data 100 days ago
            const oldDate = new Date();
            oldDate.setDate(oldDate.getDate() - 100);
            const oldDateStr = oldDate.toISOString().split('T')[0];

            saveDataForDate(oldDateStr, { sleepScore: 5 });

            const result = cleanupOldData();

            expect(result.count).toBe(1);
        });
    });

    describe('getFormattedStats', () => {
        it('returns formatted stats for empty storage', () => {
            const stats = getFormattedStats();

            expect(stats.totalEntries).toBe(0);
            expect(stats.oldestEntry).toBe('-');
            expect(stats.newestEntry).toBe('-');
        });

        it('returns formatted stats with data', () => {
            saveDataForDate('2025-01-15', { sleepScore: 8 });
            saveDataForDate('2025-01-20', { sleepScore: 7 });

            const stats = getFormattedStats();

            expect(stats.totalEntries).toBe(2);
            expect(stats.storageSize).toMatch(/KB$/);
        });

        it('formats dates in Dutch locale', () => {
            saveDataForDate('2025-01-15', { sleepScore: 8 });

            const stats = getFormattedStats();

            // Dutch date format includes month abbreviation
            expect(stats.oldestEntry).toMatch(/\d+.*\d{4}/);
        });
    });
});
