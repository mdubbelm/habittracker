/**
 * Vitest Setup File
 *
 * This file runs before each test file.
 * Use it to set up global mocks, test utilities, etc.
 */

import { vi, beforeEach } from 'vitest';

// Mock localStorage
const localStorageMock = {
    store: {},
    getItem: vi.fn(key => localStorageMock.store[key] || null),
    setItem: vi.fn((key, value) => {
        localStorageMock.store[key] = value;
    }),
    removeItem: vi.fn(key => {
        delete localStorageMock.store[key];
    }),
    clear: vi.fn(() => {
        localStorageMock.store = {};
    })
};

// Set up global localStorage mock
Object.defineProperty(global, 'localStorage', {
    value: localStorageMock
});

// Reset localStorage before each test
beforeEach(() => {
    localStorageMock.store = {};
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
    localStorageMock.clear.mockClear();
});

// Mock console methods to reduce noise in tests (optional)
// vi.spyOn(console, 'log').mockImplementation(() => {});
// vi.spyOn(console, 'warn').mockImplementation(() => {});
