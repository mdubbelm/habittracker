import { defineConfig } from 'vite';
import { resolve } from 'path';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
    plugins: [
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'icons/*.png'],
            manifest: {
                name: 'Health Tracker',
                short_name: 'HealthTracker',
                description:
                    'Privacy-first gezondheids- en gewoontetracker. Al je data blijft op jouw apparaat.',
                theme_color: '#C17A5C',
                background_color: '#F8F5F0',
                display: 'standalone',
                orientation: 'portrait',
                scope: '/',
                start_url: '/',
                lang: 'nl',
                icons: [
                    {
                        src: 'icons/icon-72x72.png',
                        sizes: '72x72',
                        type: 'image/png',
                        purpose: 'maskable any'
                    },
                    {
                        src: 'icons/icon-96x96.png',
                        sizes: '96x96',
                        type: 'image/png',
                        purpose: 'maskable any'
                    },
                    {
                        src: 'icons/icon-128x128.png',
                        sizes: '128x128',
                        type: 'image/png',
                        purpose: 'maskable any'
                    },
                    {
                        src: 'icons/icon-144x144.png',
                        sizes: '144x144',
                        type: 'image/png',
                        purpose: 'maskable any'
                    },
                    {
                        src: 'icons/icon-152x152.png',
                        sizes: '152x152',
                        type: 'image/png',
                        purpose: 'maskable any'
                    },
                    {
                        src: 'icons/icon-192x192.png',
                        sizes: '192x192',
                        type: 'image/png',
                        purpose: 'maskable any'
                    },
                    {
                        src: 'icons/icon-384x384.png',
                        sizes: '384x384',
                        type: 'image/png',
                        purpose: 'maskable any'
                    },
                    {
                        src: 'icons/icon-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'maskable any'
                    }
                ]
            },
            workbox: {
                // Cache-first voor static assets
                globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
                runtimeCaching: [
                    {
                        // Cache voor lokale data requests (indien toekomstige API)
                        urlPattern: /^https:\/\/api\./i,
                        handler: 'NetworkFirst',
                        options: {
                            cacheName: 'api-cache',
                            expiration: {
                                maxEntries: 50,
                                maxAgeSeconds: 60 * 60 * 24 // 24 uur
                            }
                        }
                    }
                ]
            }
        })
    ],

    // Root directory for source files
    root: 'src',

    // Public directory (static assets copied as-is to dist)
    publicDir: '../public',

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
