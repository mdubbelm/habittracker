import js from '@eslint/js';
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

export default [
    js.configs.recommended,
    prettierConfig,
    // Browser files (src/)
    {
        files: ['src/**/*.js'],
        plugins: {
            prettier: prettier
        },
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'script', // Browser scripts, not ES modules
            globals: {
                // Browser globals
                window: 'readonly',
                document: 'readonly',
                console: 'readonly',
                localStorage: 'readonly',
                alert: 'readonly',
                confirm: 'readonly',
                setTimeout: 'readonly',
                Event: 'readonly',
                Blob: 'readonly',
                URL: 'readonly',
                HTMLElement: 'readonly',
                // Cross-file functions (loaded via script tags)
                // From sanitize.js
                sanitizeText: 'readonly',
                sanitizeNumber: 'readonly',
                sanitizeBoolean: 'readonly',
                sanitizeObject: 'readonly',
                // From storage.js
                hasAcceptedPrivacy: 'readonly',
                acceptPrivacy: 'readonly',
                getTodayDate: 'readonly',
                getTodayData: 'readonly',
                saveTodayData: 'readonly',
                getAllData: 'readonly',
                deleteAllData: 'readonly',
                exportAsCSV: 'readonly',
                getStorageStats: 'readonly',
                // From healthScore.js
                calculateHealthScore: 'readonly',
                getScoreMessage: 'readonly',
                getScoreColor: 'readonly'
            }
        },
        rules: {
            'prettier/prettier': 'error',
            'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
            'no-console': 'off',
            'eqeqeq': ['error', 'always'],
            'curly': ['error', 'all'],
            'no-var': 'error',
            'prefer-const': 'error',
            'no-prototype-builtins': 'off', // Allow hasOwnProperty
            'no-redeclare': 'off' // Functions are used cross-file via script tags
        }
    },
    // Node scripts (scripts/)
    {
        files: ['scripts/**/*.js'],
        plugins: {
            prettier: prettier
        },
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'module',
            globals: {
                console: 'readonly',
                process: 'readonly',
                Buffer: 'readonly'
            }
        },
        rules: {
            'prettier/prettier': 'error',
            'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
            'no-console': 'off',
            'eqeqeq': ['error', 'always'],
            'curly': ['error', 'all'],
            'no-var': 'error',
            'prefer-const': 'error',
            'no-duplicate-imports': 'error'
        }
    },
    {
        ignores: ['node_modules/**', 'dist/**', 'screenshots/**', '*.min.js']
    }
];
