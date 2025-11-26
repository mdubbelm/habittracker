/**
 * Main Application Logic
 *
 * Handles UI interactions, updates, and orchestrates services
 *
 * @module app
 */

import {
    getTodayData,
    saveTodayData,
    getTodayDate,
    exportAsCSV,
    deleteAllData,
    hasAcceptedPrivacy,
    acceptPrivacy,
    getStorageStats
} from './services/storage.js';

import { calculateHealthScore, getScoreMessage, getScoreColor } from './services/healthScore.js';

// State
let currentView = 'tracker-view';

/**
 * Initialize app
 */
export function initializeApp() {
    console.log('🚀 Health Tracker starting...');

    // Check privacy acceptance
    if (!hasAcceptedPrivacy()) {
        showPrivacyNotice();
    } else {
        initApp();
    }
}

/**
 * Show privacy notice on first use
 */
function showPrivacyNotice() {
    const notice = document.getElementById('privacy-notice');
    notice.classList.remove('hidden');

    // Accept button
    document.getElementById('accept-privacy').addEventListener('click', function () {
        acceptPrivacy();
        notice.classList.add('hidden');
        initApp();
    });

    // View security link
    document.getElementById('view-security').addEventListener('click', function (e) {
        e.preventDefault();
        window.open('./SECURITY.md', '_blank');
    });
}

/**
 * Initialize application
 */
function initApp() {
    console.log('✅ Privacy accepted. Initializing app...');

    // Set current date
    updateCurrentDate();

    // Load today's data (if exists)
    loadTodayData();

    // Update health score
    updateHealthScore();

    // Setup event listeners
    setupEventListeners();

    // Setup navigation
    setupNavigation();

    console.log('✅ App initialized!');
}

/**
 * Update current date display
 */
function updateCurrentDate() {
    const dateEl = document.getElementById('current-date');
    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateEl.textContent = today.toLocaleDateString('nl-NL', options);
}

/**
 * Load today's data from storage and populate form
 */
function loadTodayData() {
    const data = getTodayData();

    if (!data) {
        console.log('📋 Nog geen data voor vandaag');
        return;
    }

    console.log('📥 Data van vandaag laden:', data);

    // Populate form fields
    if (data.sleepScore !== undefined) {
        document.getElementById('sleep-score').value = data.sleepScore;
        document.getElementById('sleep-output').textContent = data.sleepScore;
    }

    if (data.backPain !== undefined) {
        document.getElementById('back-pain').value = data.backPain;
        document.getElementById('pain-output').textContent = data.backPain;
    }

    if (data.waterIntake !== undefined) {
        document.getElementById('water-intake').value = data.waterIntake;
        updateWaterGlasses(data.waterIntake);
    }

    if (data.walked !== undefined) {
        document.getElementById('walked').checked = data.walked;
    }

    if (data.dreamed !== undefined) {
        document.getElementById('dreamed').checked = data.dreamed;
    }

    if (data.sugarConsumed !== undefined) {
        document.getElementById('sugar-consumed').checked = data.sugarConsumed;
    }

    if (data.alcoholConsumed !== undefined) {
        document.getElementById('alcohol-consumed').checked = data.alcoholConsumed;
    }

    if (data.caffeineConsumed !== undefined) {
        document.getElementById('caffeine-consumed').checked = data.caffeineConsumed;
    }

    if (data.alcoholType !== undefined && data.alcoholType) {
        document.getElementById('alcohol-type').value = data.alcoholType;
        document.getElementById('alcohol-type-group').style.display = 'block';
        // Set active pill and aria-pressed state
        const pillButton = document.querySelector(`.pill-button[data-type="${data.alcoholType}"]`);
        if (pillButton) {
            pillButton.classList.add('active');
            pillButton.setAttribute('aria-pressed', 'true');
        }
    }
}

/**
 * Setup all event listeners
 */
function setupEventListeners() {
    // Slider inputs (live update of output)
    document.getElementById('sleep-score').addEventListener('input', function (e) {
        document.getElementById('sleep-output').textContent = e.target.value;
    });

    document.getElementById('back-pain').addEventListener('input', function (e) {
        document.getElementById('pain-output').textContent = e.target.value;
    });

    // Save button
    document.getElementById('save-data').addEventListener('click', saveData);

    // Export data button
    document.getElementById('export-data').addEventListener('click', exportData);

    // Delete all data button
    document.getElementById('delete-all-data').addEventListener('click', confirmDeleteAll);

    // Water +/- buttons
    document.getElementById('water-add').addEventListener('click', function () {
        const waterInput = document.getElementById('water-intake');
        const currentValue = parseInt(waterInput.value) || 0;
        if (currentValue < 20) {
            waterInput.value = currentValue + 1;
            updateWaterGlasses(currentValue + 1);
        }
    });

    document.getElementById('water-minus').addEventListener('click', function () {
        const waterInput = document.getElementById('water-intake');
        const currentValue = parseInt(waterInput.value) || 0;
        if (currentValue > 0) {
            waterInput.value = currentValue - 1;
            updateWaterGlasses(currentValue - 1);
        }
    });

    // Alcohol type conditional display
    document.getElementById('alcohol-consumed').addEventListener('change', function (e) {
        const alcoholTypeGroup = document.getElementById('alcohol-type-group');
        if (e.target.checked) {
            alcoholTypeGroup.style.display = 'block';
        } else {
            alcoholTypeGroup.style.display = 'none';
            document.getElementById('alcohol-type').value = '';
            // Deselect all pills
            document
                .querySelectorAll('.pill-button')
                .forEach(btn => btn.classList.remove('active'));
        }
    });

    // Alcohol type pill buttons
    document.querySelectorAll('.pill-button').forEach(button => {
        button.addEventListener('click', function () {
            // Remove active from all and set aria-pressed to false
            document.querySelectorAll('.pill-button').forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-pressed', 'false');
            });
            // Add active to clicked and set aria-pressed to true
            this.classList.add('active');
            this.setAttribute('aria-pressed', 'true');
            // Set hidden input value
            document.getElementById('alcohol-type').value = this.getAttribute('data-type');
        });
    });
}

/**
 * Save current form data
 */
function saveData() {
    console.log('💾 Data opslaan...');

    // Collect form data
    const data = {
        sleepScore: parseInt(document.getElementById('sleep-score').value),
        backPain: parseInt(document.getElementById('back-pain').value),
        waterIntake: parseInt(document.getElementById('water-intake').value),
        walked: document.getElementById('walked').checked,
        dreamed: document.getElementById('dreamed').checked,
        sugarConsumed: document.getElementById('sugar-consumed').checked,
        alcoholConsumed: document.getElementById('alcohol-consumed').checked,
        alcoholType: document.getElementById('alcohol-type').value,
        caffeineConsumed: document.getElementById('caffeine-consumed').checked
    };

    console.log('📊 Op te slaan data:', data);

    // Save to storage
    const success = saveTodayData(data);

    if (success) {
        // Update health score
        updateHealthScore();

        // Show feedback
        showSaveFeedback();
    } else {
        alert('❌ Fout bij opslaan van data. Controleer de browser console.');
    }
}

/**
 * Show save feedback
 */
function showSaveFeedback() {
    const btn = document.getElementById('save-data');
    const originalText = btn.textContent;

    btn.textContent = '✅ Opgeslagen!';
    btn.style.backgroundColor = '#10B981';

    setTimeout(() => {
        btn.textContent = originalText;
        btn.style.backgroundColor = '';
    }, 2000);
}

/**
 * Update health score display
 */
function updateHealthScore() {
    const data = getTodayData();
    const score = calculateHealthScore(data || {});

    console.log('📈 Health Score:', score);

    // Update score display (both SVG and HTML if it exists)
    const svgScoreEl = document.getElementById('svg-score-value');
    if (svgScoreEl) {
        svgScoreEl.textContent = score + '%';
    }

    // Update SVG accessible description for screen readers
    const scoreDesc = document.getElementById('health-score-desc');
    if (scoreDesc) {
        scoreDesc.textContent = `Je huidige gezondheidscore is ${score}%`;
    }

    document.getElementById('score-message').textContent = getScoreMessage(score);

    // Update circular progress
    updateCircularProgress(score);

    // Update quick stats
    updateQuickStats(data);
}

/**
 * Update circular progress bar
 * @param {number} score - Health score (0-100)
 */
function updateCircularProgress(score) {
    const circle = document.getElementById('progress-circle');
    const radius = 80;
    const circumference = 2 * Math.PI * radius; // ≈ 502.65

    // Calculate offset (100% = 0 offset, 0% = full circumference)
    const offset = circumference - (score / 100) * circumference;

    circle.style.strokeDashoffset = offset;

    // Change color based on score
    const color = getScoreColor(score);
    if (circle) {
        circle.setAttribute('stroke', color);
    }
}

/**
 * Update quick stats cards with partial circular progress
 * @param {Object} data - Today's tracker data
 */
function updateQuickStats(data) {
    if (!data) {
        document.getElementById('stat-sleep').textContent = '-';
        document.getElementById('stat-water').textContent = '-';
        document.getElementById('stat-walked').textContent = '-';
        document.getElementById('stat-pain').textContent = '-';

        // Reset progress arcs
        updateArcProgress('stat-sleep-progress', 0);
        updateArcProgress('stat-water-progress', 0);
        updateArcProgress('stat-walked-progress', 0);
        updateArcProgress('stat-pain-progress', 0);
        return;
    }

    // Sleep (0-10 scale)
    const sleepValue = data.sleepScore !== undefined ? data.sleepScore : 0;
    document.getElementById('stat-sleep').textContent = sleepValue > 0 ? sleepValue + '/10' : '-';
    updateArcProgress('stat-sleep-progress', sleepValue / 10);

    // Water (0-8 glasses target)
    const waterValue = data.waterIntake !== undefined ? data.waterIntake : 0;
    document.getElementById('stat-water').textContent =
        waterValue > 0 ? waterValue + ' glazen' : '-';
    updateArcProgress('stat-water-progress', Math.min(waterValue / 8, 1));

    // Walk (boolean → 0% or 100%)
    const walkedValue = data.walked !== undefined ? data.walked : false;
    document.getElementById('stat-walked').textContent = walkedValue ? 'Ja ✓' : 'Nee';
    updateArcProgress('stat-walked-progress', walkedValue ? 1 : 0);

    // Back Pain (0-10 scale, inverted - less pain is better)
    const painValue = data.backPain !== undefined ? data.backPain : 0;
    document.getElementById('stat-pain').textContent = painValue > 0 ? painValue + '/10' : '-';
    updateArcProgress('stat-pain-progress', 1 - painValue / 10);
}

/**
 * Update partial circular progress arc
 * @param {string} elementId - ID of the SVG path element
 * @param {number} progress - Progress value (0-1)
 */
function updateArcProgress(elementId, progress) {
    const arc = document.getElementById(elementId);
    if (!arc) {
        return;
    }

    const arcLength = 125.66;
    const offset = arcLength - progress * arcLength;

    arc.style.strokeDashoffset = offset;
}

/**
 * Update water glass visual indicators
 * @param {number} count - Number of glasses (0-8+)
 */
function updateWaterGlasses(count) {
    const glasses = document.querySelectorAll('.glass-icon');

    glasses.forEach((glass, index) => {
        if (index < count) {
            glass.classList.add('filled');
        } else {
            glass.classList.remove('filled');
        }
    });

    // Update screen reader announcement
    const waterStatus = document.getElementById('water-status');
    if (waterStatus) {
        waterStatus.textContent = `Water: ${count} van 8 glazen`;
    }
}

/**
 * Setup bottom navigation
 */
function setupNavigation() {
    const navButtons = document.querySelectorAll('.nav-item');

    navButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            const targetView = this.getAttribute('data-view');
            switchView(targetView);
        });
    });
}

/**
 * Switch between views
 * @param {string} viewId - ID of view to show
 */
function switchView(viewId) {
    // Hide all views
    document.querySelectorAll('.view').forEach(view => {
        view.classList.remove('active');
    });

    // Show target view
    document.getElementById(viewId).classList.add('active');

    // Update nav buttons
    document.querySelectorAll('.nav-item').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-view') === viewId) {
            btn.classList.add('active');
        }
    });

    currentView = viewId;
}

/**
 * Export data as CSV
 */
function exportData() {
    console.log('📥 Data exporteren...');

    const csv = exportAsCSV();

    // Create download link
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `health-tracker-data-${getTodayDate()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    console.log('✅ Data geëxporteerd');
}

/**
 * Confirm and delete all data
 */
function confirmDeleteAll() {
    const stats = getStorageStats();

    const confirmed = confirm(
        `⚠️ WAARSCHUWING: Dit verwijdert ALLE data!\n\n` +
            `Je hebt ${stats.totalEntries} dagen aan data.\n` +
            `Van ${stats.oldestEntry} tot ${stats.newestEntry}\n\n` +
            `Deze actie kan NIET ongedaan gemaakt worden!\n\n` +
            `Weet je het zeker?`
    );

    if (confirmed) {
        const doubleCheck = confirm('Laatste kans! Echt alles verwijderen?');

        if (doubleCheck) {
            deleteAllData();

            // Reset UI
            document.querySelectorAll('input[type="range"]').forEach(input => {
                input.value = input.min;
            });
            document.querySelectorAll('input[type="checkbox"]').forEach(input => {
                input.checked = false;
            });
            document.querySelectorAll('input[type="number"]').forEach(input => {
                input.value = 0;
            });

            updateHealthScore();

            alert('🗑️ Alle data verwijderd');
        }
    }
}

/**
 * Development helpers (remove in production)
 */
if (import.meta.env?.DEV) {
    console.log('🔧 Development mode');

    // Add some test data helper
    window.addTestData = function () {
        const testData = {
            sleepScore: 7,
            backPain: 2,
            waterIntake: 8,
            walked: true,
            dreamed: true,
            sugarConsumed: false,
            alcoholConsumed: false,
            caffeineConsumed: true
        };

        saveTodayData(testData);
        loadTodayData();
        updateHealthScore();

        console.log('✅ Test data toegevoegd voor vandaag');
    };

    console.log('💡 Tip: Use window.addTestData() to add test data');
}
