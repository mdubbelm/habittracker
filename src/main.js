/**
 * Main Entry Point
 *
 * This is the entry point for the Vite build.
 * It imports styles and initializes the application.
 */

// Import styles (Vite handles CSS bundling)
import './styles/main.css';

// Import and initialize the app
import { initializeApp } from './js/app.js';

// PWA Install Prompt Handler
let deferredPrompt = null;

function setupInstallPrompt() {
    const installBanner = document.getElementById('install-banner');
    const installButton = document.getElementById('install-button');
    const dismissButton = document.getElementById('dismiss-install');

    if (!installBanner || !installButton) {
        return;
    }

    // Listen for the beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', e => {
        // Prevent the mini-infobar from appearing on mobile
        e.preventDefault();
        // Save the event for later
        deferredPrompt = e;
        // Show the install banner
        installBanner.classList.remove('hidden');
    });

    // Handle install button click
    installButton.addEventListener('click', async () => {
        if (!deferredPrompt) {
            return;
        }

        // Show the install prompt
        deferredPrompt.prompt();

        // Wait for the user's response
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            console.log('PWA installed');
        }

        // Clear the deferred prompt
        deferredPrompt = null;
        installBanner.classList.add('hidden');
    });

    // Handle dismiss button click
    if (dismissButton) {
        dismissButton.addEventListener('click', () => {
            installBanner.classList.add('hidden');
            // Remember dismissal for this session
            sessionStorage.setItem('installDismissed', 'true');
        });
    }

    // Check if already dismissed this session
    if (sessionStorage.getItem('installDismissed')) {
        installBanner.classList.add('hidden');
    }

    // Listen for successful installation
    window.addEventListener('appinstalled', () => {
        console.log('Health Tracker installed successfully!');
        installBanner.classList.add('hidden');
        deferredPrompt = null;
    });
}

// Register Service Worker (vite-plugin-pwa handles this automatically in production)
async function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        try {
            // In production, vite-plugin-pwa injects the SW registration
            // This is a fallback for development or manual registration
            const registration = await navigator.serviceWorker.register('/sw.js', {
                scope: '/'
            });
            console.log('Service Worker registered:', registration.scope);
        } catch {
            // SW registration may fail in development, that's okay
            console.log('Service Worker registration skipped (dev mode or not available)');
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    setupInstallPrompt();
    registerServiceWorker();
});
