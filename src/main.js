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

// Store the waiting service worker for update
let waitingServiceWorker = null;

// Register Service Worker and handle updates
async function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        try {
            const registration = await navigator.serviceWorker.register('/sw.js', {
                scope: '/'
            });
            console.log('Service Worker registered:', registration.scope);

            // Check for updates immediately and periodically
            registration.update();
            window.setInterval(() => registration.update(), 60 * 60 * 1000); // Check hourly

            // Listen for new service worker waiting
            registration.addEventListener('waiting', () => {
                waitingServiceWorker = registration.waiting;
                showUpdateBanner();
            });

            // Also check if there's already a waiting worker
            if (registration.waiting) {
                waitingServiceWorker = registration.waiting;
                showUpdateBanner();
            }

            // Listen for new service worker installing
            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        // New version available
                        waitingServiceWorker = newWorker;
                        showUpdateBanner();
                    }
                });
            });
        } catch {
            console.log('Service Worker registration skipped (dev mode or not available)');
        }
    }
}

// Show the update banner
function showUpdateBanner() {
    const updateBanner = document.getElementById('update-banner');
    if (updateBanner) {
        updateBanner.classList.remove('hidden');
    }
}

// Setup update banner handlers
function setupUpdateBanner() {
    const updateBanner = document.getElementById('update-banner');
    const updateButton = document.getElementById('update-button');
    const dismissButton = document.getElementById('dismiss-update');

    if (updateButton) {
        updateButton.addEventListener('click', () => {
            if (waitingServiceWorker) {
                // Tell the waiting service worker to activate
                waitingServiceWorker.postMessage({ type: 'SKIP_WAITING' });
                // Reload once the new service worker is active
                navigator.serviceWorker.addEventListener('controllerchange', () => {
                    window.location.reload();
                });
            } else {
                // Fallback: just reload
                window.location.reload();
            }
        });
    }

    if (dismissButton) {
        dismissButton.addEventListener('click', () => {
            updateBanner?.classList.add('hidden');
        });
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    setupInstallPrompt();
    setupUpdateBanner();
    registerServiceWorker();
});
