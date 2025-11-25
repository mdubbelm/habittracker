/**
 * Sanitize Utility Tests
 *
 * Tests for input sanitization functions to prevent XSS and ensure data integrity.
 */

import { describe, it, expect, vi } from 'vitest';

const sanitizeModule = await import('../src/js/utils/sanitize.js');
const { sanitizeText, sanitizeNumber, sanitizeBoolean, sanitizeObject } = sanitizeModule;

describe('sanitizeText', () => {
    it('returns empty string for non-string input', () => {
        expect(sanitizeText(null)).toBe('');
        expect(sanitizeText(undefined)).toBe('');
        expect(sanitizeText(123)).toBe('');
        expect(sanitizeText(true)).toBe('');
        expect(sanitizeText({})).toBe('');
    });

    it('escapes HTML entities', () => {
        expect(sanitizeText('<script>')).toBe('&lt;script&gt;');
        expect(sanitizeText('a & b')).toBe('a &amp; b');
        expect(sanitizeText('<div>')).toBe('&lt;div&gt;');
    });

    it('prevents XSS attacks', () => {
        const xss = '<script>alert("xss")</script>';
        const result = sanitizeText(xss);
        expect(result).not.toContain('<script>');
        expect(result).not.toContain('</script>');
        expect(result).toContain('&lt;');
        expect(result).toContain('&gt;');
    });

    it('handles normal text unchanged', () => {
        expect(sanitizeText('Hello World')).toBe('Hello World');
        expect(sanitizeText('123-456')).toBe('123-456');
        expect(sanitizeText('email@example.com')).toBe('email@example.com');
    });
});

describe('sanitizeNumber', () => {
    it('returns number for valid input within range', () => {
        expect(sanitizeNumber(5, 0, 10)).toBe(5);
        expect(sanitizeNumber('7', 0, 10)).toBe(7);
        expect(sanitizeNumber(0, 0, 10)).toBe(0);
        expect(sanitizeNumber(10, 0, 10)).toBe(10);
    });

    it('returns default for NaN input', () => {
        // Suppress console.warn for cleaner test output
        vi.spyOn(console, 'warn').mockImplementation(() => {});

        expect(sanitizeNumber('abc', 0, 10, 0)).toBe(0);
        expect(sanitizeNumber('abc', 0, 10, 5)).toBe(5);

        vi.restoreAllMocks();
    });

    it('returns default for out-of-range values', () => {
        vi.spyOn(console, 'warn').mockImplementation(() => {});

        expect(sanitizeNumber(-5, 0, 10, 0)).toBe(0);
        expect(sanitizeNumber(15, 0, 10, 0)).toBe(0);
        expect(sanitizeNumber(100, 0, 10, 5)).toBe(5);

        vi.restoreAllMocks();
    });

    it('uses 0 as default defaultValue', () => {
        vi.spyOn(console, 'warn').mockImplementation(() => {});

        expect(sanitizeNumber('abc', 0, 10)).toBe(0);

        vi.restoreAllMocks();
    });
});

describe('sanitizeBoolean', () => {
    it('returns boolean for boolean input', () => {
        expect(sanitizeBoolean(true)).toBe(true);
        expect(sanitizeBoolean(false)).toBe(false);
    });

    it('converts truthy values to true', () => {
        expect(sanitizeBoolean(1)).toBe(true);
        expect(sanitizeBoolean('anything')).toBe(true);
        expect(sanitizeBoolean([])).toBe(true);
        expect(sanitizeBoolean({})).toBe(true);
    });

    it('converts falsy values to false', () => {
        expect(sanitizeBoolean(0)).toBe(false);
        expect(sanitizeBoolean('')).toBe(false);
        expect(sanitizeBoolean(null)).toBe(false);
        expect(sanitizeBoolean(undefined)).toBe(false);
    });
});

describe('sanitizeObject', () => {
    it('filters to allowed keys only', () => {
        const input = { a: 1, b: 2, c: 3 };
        const result = sanitizeObject(input, ['a', 'b']);
        expect(result).toHaveProperty('a', 1);
        expect(result).toHaveProperty('b', 2);
        expect(result).not.toHaveProperty('c');
    });

    it('handles missing keys gracefully', () => {
        const input = { a: 1 };
        const result = sanitizeObject(input, ['a', 'b', 'c']);
        expect(result).toEqual({ a: 1 });
    });

    it('preserves number and boolean types', () => {
        const input = {
            num: 42,
            bool: true,
            boolFalse: false
        };
        const result = sanitizeObject(input, ['num', 'bool', 'boolFalse']);
        expect(result.num).toBe(42);
        expect(result.bool).toBe(true);
        expect(result.boolFalse).toBe(false);
    });

    it('sanitizes string values', () => {
        const input = {
            name: '<script>alert("xss")</script>'
        };
        const result = sanitizeObject(input, ['name']);
        expect(result.name).not.toContain('<script>');
        expect(result.name).toContain('&lt;');
    });

    it('preserves nested objects', () => {
        const input = {
            customHabits: { 'habit-1': true, 'habit-2': false }
        };
        const result = sanitizeObject(input, ['customHabits']);
        expect(result.customHabits).toEqual({ 'habit-1': true, 'habit-2': false });
    });

    it('returns empty object for empty allowed keys', () => {
        const input = { a: 1, b: 2 };
        const result = sanitizeObject(input, []);
        expect(result).toEqual({});
    });
});
