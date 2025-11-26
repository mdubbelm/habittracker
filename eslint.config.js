import js from '@eslint/js';
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

export default [
    js.configs.recommended,
    prettierConfig,
    // Browser files (src/) - ES Modules
    {
        files: ['src/**/*.js'],
        plugins: {
            prettier: prettier
        },
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'module', // ES modules
            globals: {
                // Browser globals
                window: 'readonly',
                document: 'readonly',
                console: 'readonly',
                localStorage: 'readonly',
                sessionStorage: 'readonly',
                navigator: 'readonly',
                alert: 'readonly',
                confirm: 'readonly',
                setTimeout: 'readonly',
                Event: 'readonly',
                Blob: 'readonly',
                URL: 'readonly',
                HTMLElement: 'readonly'
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
