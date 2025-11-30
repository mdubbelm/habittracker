import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        // Use jsdom for DOM testing
        environment: 'jsdom',

        // Test file patterns
        include: ['tests/**/*.test.js', 'tests/**/*.spec.js'],

        // Coverage configuration
        coverage: {
            provider: 'v8',
            reporter: ['text', 'html', 'lcov'],
            reportsDirectory: './coverage',
            include: ['src/js/**/*.js'],
            exclude: ['src/js/app.js'] // Main app file is integration-tested
        },

        // Global test timeout
        testTimeout: 10000,

        // Setup files (run before each test file)
        setupFiles: ['./tests/setup.js']
    }
});
