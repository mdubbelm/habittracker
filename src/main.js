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

// App version (from package.json via Vite)
/* global __APP_VERSION__, __BUILD_DATE__ */
const APP_VERSION = __APP_VERSION__;
const BUILD_DATE = __BUILD_DATE__;

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

// Pull to Refresh functionality
function setupPullToRefresh() {
    const pullRefresh = document.getElementById('pull-refresh');
    if (!pullRefresh) {
        return;
    }

    let startY = 0;
    let isPulling = false;
    const threshold = 80; // Pixels to pull before refresh triggers

    // Only enable when at top of page
    function isAtTop() {
        return window.scrollY <= 0;
    }

    document.addEventListener(
        'touchstart',
        e => {
            if (isAtTop()) {
                startY = e.touches[0].clientY;
                isPulling = true;
            }
        },
        { passive: true }
    );

    document.addEventListener(
        'touchmove',
        e => {
            if (!isPulling) {
                return;
            }

            const currentY = e.touches[0].clientY;
            const pullDistance = currentY - startY;

            if (pullDistance > 0 && isAtTop()) {
                // Show pulling indicator
                const progress = Math.min(pullDistance / threshold, 1);
                pullRefresh.style.transform = `translateY(${Math.min(pullDistance * 0.5, threshold) - 100}%)`;
                pullRefresh.classList.add('pulling');

                // Rotate icon based on progress
                const icon = pullRefresh.querySelector('.pull-refresh-icon');
                if (icon) {
                    icon.style.transform = `rotate(${progress * 180}deg)`;
                }
            }
        },
        { passive: true }
    );

    document.addEventListener(
        'touchend',
        () => {
            if (!isPulling) {
                return;
            }
            isPulling = false;

            const pullRefreshRect = pullRefresh.getBoundingClientRect();
            const wasFullyPulled = pullRefreshRect.bottom >= threshold;

            if (wasFullyPulled) {
                // Trigger refresh
                pullRefresh.classList.remove('pulling');
                pullRefresh.classList.add('refreshing');
                pullRefresh.style.transform = 'translateY(0)';

                // Reload after short delay
                window.setTimeout(() => {
                    window.location.reload();
                }, 500);
            } else {
                // Cancel pull
                pullRefresh.classList.remove('pulling');
                pullRefresh.style.transform = 'translateY(-100%)';
                const icon = pullRefresh.querySelector('.pull-refresh-icon');
                if (icon) {
                    icon.style.transform = 'rotate(0deg)';
                }
            }
        },
        { passive: true }
    );
}

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

                // iOS Safari doesn't reliably fire 'controllerchange' event (issue #33)
                // Use timeout fallback to ensure reload happens
                let reloaded = false;
                const reloadTimeout = window.setTimeout(() => {
                    if (!reloaded) {
                        reloaded = true;
                        window.location.reload();
                    }
                }, 1500);

                // Try standard approach first (works on desktop)
                navigator.serviceWorker.addEventListener(
                    'controllerchange',
                    () => {
                        window.clearTimeout(reloadTimeout);
                        if (!reloaded) {
                            reloaded = true;
                            window.location.reload();
                        }
                    },
                    { once: true }
                );
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

// Display version info
function displayVersionInfo() {
    const versionEl = document.getElementById('app-version');
    const buildDateEl = document.getElementById('app-build-date');

    if (versionEl) {
        versionEl.textContent = APP_VERSION;
    }

    if (buildDateEl) {
        // Format the build date nicely
        const date = new Date(BUILD_DATE);
        const formatted = date.toLocaleDateString('nl-NL', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        buildDateEl.textContent = formatted;
    }
}

// Setup check for updates button
function setupCheckForUpdates() {
    const checkButton = document.getElementById('check-update');
    const statusEl = document.getElementById('update-status');

    if (!checkButton) {
        return;
    }

    checkButton.addEventListener('click', async () => {
        const btnText = checkButton.querySelector('.btn-text');
        const spinner = checkButton.querySelector('.btn-spinner');

        // Show loading state
        checkButton.disabled = true;
        spinner?.classList.remove('hidden');
        statusEl.textContent = 'Controleren op updates...';
        statusEl.className = 'update-status checking';

        try {
            // Check if service worker is registered
            if ('serviceWorker' in navigator) {
                const registration = await navigator.serviceWorker.getRegistration();

                if (registration) {
                    // Force check for updates
                    await registration.update();

                    // Wait a moment for the update check
                    await new Promise(resolve => window.setTimeout(resolve, 1500));

                    if (registration.waiting || waitingServiceWorker) {
                        // New version available
                        statusEl.textContent =
                            '🆕 Nieuwe versie beschikbaar! Gebruik de banner bovenaan om te updaten.';
                        statusEl.className = 'update-status info';
                        showUpdateBanner();
                    } else if (registration.installing) {
                        // Update in progress
                        statusEl.textContent = '⏳ Update wordt geïnstalleerd...';
                        statusEl.className = 'update-status checking';
                    } else {
                        // Already up to date
                        statusEl.textContent = '✓ Je hebt de nieuwste versie!';
                        statusEl.className = 'update-status success';
                    }
                } else {
                    statusEl.textContent = 'Service worker niet beschikbaar';
                    statusEl.className = 'update-status error';
                }
            } else {
                statusEl.textContent = 'Updates niet ondersteund in deze browser';
                statusEl.className = 'update-status error';
            }
        } catch (error) {
            console.error('Update check failed:', error);
            statusEl.textContent = 'Kon niet controleren op updates';
            statusEl.className = 'update-status error';
        } finally {
            // Reset button state
            checkButton.disabled = false;
            spinner?.classList.add('hidden');
        }
    });
}

// Offline indicator
function setupOfflineIndicator() {
    const banner = document.getElementById('offline-banner');
    if (!banner) {
        return;
    }

    function updateOnlineStatus() {
        if (navigator.onLine) {
            banner.classList.remove('visible');
        } else {
            banner.classList.add('visible');
        }
    }

    // Initial check
    updateOnlineStatus();

    // Listen for changes
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    setupInstallPrompt();
    setupUpdateBanner();
    setupPullToRefresh();
    setupOfflineIndicator();
    displayVersionInfo();
    setupCheckForUpdates();
    registerServiceWorker();
});
