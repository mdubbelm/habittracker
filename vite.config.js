import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    // Root directory for source files
    root: 'src',

    // Development server configuration
    server: {
        port: 3000,
        open: true, // Auto-open browser
        host: true // Allow access from network (useful for mobile testing)
    },

    // Build configuration
    build: {
        // Output to dist folder at project root
        outDir: '../dist',
        emptyOutDir: true,

        // Generate sourcemaps for debugging
        sourcemap: true,

        // Rollup options
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'src/index.html')
            }
        }
    },

    // Resolve configuration
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src'),
            '@components': resolve(__dirname, 'src/js/components'),
            '@services': resolve(__dirname, 'src/js/services'),
            '@utils': resolve(__dirname, 'src/js/utils'),
            '@styles': resolve(__dirname, 'src/styles')
        }
    },

    // CSS configuration
    css: {
        devSourcemap: true
    }
});
