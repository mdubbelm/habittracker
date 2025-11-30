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
    deleteAllData,
    hasAcceptedPrivacy,
    acceptPrivacy,
    getStorageStats
} from './services/storage.js';

import { calculateHealthScore, getScoreMessage, getScoreColor } from './services/healthScore.js';
import { initStatistics, refreshStatistics } from './components/statisticsUI.js';
import {
    downloadJSON,
    downloadCSV,
    importJSON,
    importCSV,
    generateDemoData,
    cleanupOldData,
    getFormattedStats
} from './services/dataManager.js';

import {
    getSectionVisibility,
    getMissedWindows,
    getTimeWindowLabel
} from './services/timeService.js';

import { initWeightPicker } from './components/wheelPicker.js';
import { showSuccess, showError, showWarning, showInfo } from './services/toast.js';
import { getSettings, setFieldEnabled, applyFieldVisibility } from './services/settings.js';

// State
let weightPicker = null;
let currentView = 'tracker-view';
let statisticsInitialized = false;
let autoSaveTimeout = null;

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
 * Show privacy notice on first use (inline screen, not modal)
 */
function showPrivacyNotice() {
    const notice = document.getElementById('privacy-notice');
    const app = document.getElementById('app');
    const nav = document.querySelector('.bottom-nav');

    // Show privacy screen, hide app
    notice.classList.remove('hidden');
    app.classList.add('hidden');
    if (nav) {
        nav.classList.add('hidden');
    }

    // Accept button
    document.getElementById('accept-privacy').addEventListener('click', function () {
        acceptPrivacy();
        notice.classList.add('hidden');
        app.classList.remove('hidden');
        if (nav) {
            nav.classList.remove('hidden');
        }
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

    // Update time-based section visibility
    updateSectionVisibility();

    // Initialize wheel picker for weight (before loading data)
    weightPicker = initWeightPicker();

    // Load today's data (if exists)
    loadTodayData();

    // Update health score
    updateHealthScore();

    // Setup event listeners
    setupEventListeners();

    // Setup navigation
    setupNavigation();

    // Setup field toggles in settings
    setupFieldToggles();

    // Apply field visibility based on settings
    applyFieldVisibility();

    console.log('✅ App initialized!');
}

/**
 * Setup field toggle switches in settings
 */
function setupFieldToggles() {
    const settings = getSettings();
    const toggles = document.querySelectorAll('#field-toggles input[type="checkbox"]');

    toggles.forEach(toggle => {
        const field = toggle.dataset.field;
        if (!field) {
            return;
        }

        // Set initial state from settings
        toggle.checked = settings.fields[field] !== false;

        // Add change listener
        toggle.addEventListener('change', function () {
            setFieldEnabled(field, this.checked);
            applyFieldVisibility();
            showSuccess(`${this.checked ? 'Veld ingeschakeld' : 'Veld uitgeschakeld'}`);
        });
    });
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
        updateSectionVisibility();
        return;
    }

    console.log('📥 Data van vandaag laden:', data);

    // === MORNING FIELDS ===
    if (data.sleepScore !== undefined) {
        const sleepInput = document.getElementById('sleep-score');
        sleepInput.value = data.sleepScore;
        sleepInput.setAttribute('aria-valuenow', data.sleepScore);
        document.getElementById('sleep-output').textContent = data.sleepScore;
    }

    if (data.backPain !== undefined) {
        const painInput = document.getElementById('back-pain');
        painInput.value = data.backPain;
        painInput.setAttribute('aria-valuenow', data.backPain);
        document.getElementById('pain-output').textContent = data.backPain;
    }

    // Dreamed - handle both old boolean and new string format
    if (data.dreamed !== undefined) {
        let dreamedValue;
        if (typeof data.dreamed === 'boolean') {
            dreamedValue = data.dreamed ? 'yes' : 'no';
        } else {
            dreamedValue = data.dreamed;
        }
        document.getElementById('dreamed-value').value = dreamedValue;
        document.querySelectorAll('.pill-option').forEach(btn => {
            btn.setAttribute('aria-checked', btn.dataset.value === dreamedValue ? 'true' : 'false');
        });
    }

    // Weight (use wheel picker if available)
    if (data.weight !== undefined && data.weight !== null) {
        if (weightPicker) {
            weightPicker.setValue(parseFloat(data.weight));
        } else {
            document.getElementById('weight').value = parseFloat(data.weight).toFixed(2);
        }
    }

    // === WATER ===
    if (data.waterIntake !== undefined) {
        document.getElementById('water-intake').value = data.waterIntake;
        document.getElementById('water-count').textContent = data.waterIntake;
        updateWaterProgress(data.waterIntake);
    }

    // === EVENING FIELDS ===
    if (data.walked !== undefined) {
        document.getElementById('walked').checked = data.walked;
    }

    if (data.reading !== undefined) {
        document.getElementById('reading').checked = data.reading;
    }

    // Sugar - migrate from boolean if needed
    const sugarValue = data.sugarPortions ?? (data.sugarConsumed ? 1 : 0);
    document.getElementById('sugar-portions').value = sugarValue;

    // Caffeine - migrate from boolean if needed
    const caffeineValue = data.caffeineCount ?? (data.caffeineConsumed ? 1 : 0);
    document.getElementById('caffeine-count').value = caffeineValue;

    // Alcohol - migrate from boolean if needed
    const alcoholValue = data.alcoholCount ?? (data.alcoholConsumed ? 1 : 0);
    document.getElementById('alcohol-count').value = alcoholValue;

    // Energy level
    if (data.energyLevel !== undefined && data.energyLevel !== null) {
        document.getElementById('energy-value').value = data.energyLevel;
        document.querySelectorAll('.energy-option').forEach(btn => {
            btn.setAttribute(
                'aria-checked',
                btn.dataset.energy === String(data.energyLevel) ? 'true' : 'false'
            );
        });
    }

    // Mood
    if (data.mood !== undefined && data.mood !== null) {
        document.getElementById('mood-value').value = data.mood;
        document.querySelectorAll('.mood-option').forEach(btn => {
            btn.setAttribute(
                'aria-checked',
                btn.dataset.mood === String(data.mood) ? 'true' : 'false'
            );
        });
    }

    // Update section visibility based on loaded data
    updateSectionVisibility();
}

// Track if user is in edit mode (shows all sections)
let editMode = false;

/**
 * Update section visibility based on time and data
 */
function updateSectionVisibility() {
    const todayData = getTodayData();
    const visibility = getSectionVisibility(todayData);

    // Morning section
    const morningSection = document.getElementById('morning-section');
    if (morningSection) {
        // Show if visible OR in edit mode
        morningSection.classList.toggle('hidden', !visibility.morning.visible && !editMode);
    }

    // Weight section (separate from morning, wider time window)
    const weightSection = document.getElementById('weight-section');
    if (weightSection) {
        // Show if visible OR in edit mode
        weightSection.classList.toggle('hidden', !visibility.weight.visible && !editMode);
    }

    // Evening section
    const eveningSection = document.getElementById('evening-section');
    if (eveningSection) {
        // Show if visible OR in edit mode
        eveningSection.classList.toggle('hidden', !visibility.evening.visible && !editMode);
    }

    // Fallback banner - hide in edit mode
    const fallbackBanner = document.getElementById('fallback-banner');
    if (fallbackBanner) {
        fallbackBanner.classList.toggle('hidden', !visibility.showFallback || editMode);
        if (visibility.showFallback) {
            const missedLabel = document.getElementById('missed-window-label');
            if (missedLabel) {
                missedLabel.textContent = 'ochtend';
            }
        }
    }

    // Show edit button if any section is complete OR if in edit mode
    const editBtn = document.getElementById('edit-today-btn');
    if (editBtn) {
        const hasCompleteSection = visibility.morning.complete || visibility.evening.complete;
        // Show if: complete section exists OR currently in edit mode
        editBtn.classList.toggle('hidden', !hasCompleteSection && !editMode);
        // Update button text
        editBtn.textContent = editMode ? '✓ Klaar met bewerken' : '✏️ Bewerk ingevulde secties';
    }

    // Update greeting
    const greeting = document.getElementById('time-greeting');
    if (greeting) {
        greeting.textContent = getTimeWindowLabel();
    }
}

/**
 * Show all sections (fallback mode)
 */
function showAllSections() {
    document.getElementById('morning-section')?.classList.remove('hidden');
    document.getElementById('weight-section')?.classList.remove('hidden');
    document.getElementById('evening-section')?.classList.remove('hidden');
    document.getElementById('fallback-banner')?.classList.add('hidden');
}

/**
 * Toggle edit mode - shows all sections for editing
 */
function toggleEditMode() {
    editMode = !editMode;
    updateSectionVisibility();
}

/**
 * Update water progress bar
 */
function updateWaterProgress(count) {
    const fill = document.getElementById('water-progress-fill');
    if (fill) {
        const percentage = Math.min((count / 8) * 100, 100);
        fill.style.width = percentage + '%';
    }
    // Update aria
    const progressBar = document.querySelector('.water-progress');
    if (progressBar) {
        progressBar.setAttribute('aria-valuenow', count);
    }
}

/**
 * Pulse animation for output elements
 * @param {HTMLElement} element - The output element to animate
 */
function pulseOutput(element) {
    if (!element) {
        return;
    }
    element.classList.remove('pulse');
    // Trigger reflow to restart animation
    void element.offsetWidth;
    element.classList.add('pulse');
}

/**
 * Auto-save with debounce
 */
function autoSave() {
    window.clearTimeout(autoSaveTimeout);
    autoSaveTimeout = window.setTimeout(() => {
        saveData(true); // silent save
    }, 500);
}

/**
 * Setup all event listeners
 */
function setupEventListeners() {
    // === MORNING SECTION ===
    // Slider inputs (live update of output and aria-valuenow for screen readers)
    document.getElementById('sleep-score')?.addEventListener('input', function (e) {
        const output = document.getElementById('sleep-output');
        output.textContent = e.target.value;
        e.target.setAttribute('aria-valuenow', e.target.value);
        pulseOutput(output);
        autoSave();
    });

    document.getElementById('back-pain')?.addEventListener('input', function (e) {
        const output = document.getElementById('pain-output');
        output.textContent = e.target.value;
        e.target.setAttribute('aria-valuenow', e.target.value);
        pulseOutput(output);
        autoSave();
    });

    // Dreamed pills
    document.querySelectorAll('.pill-option').forEach(btn => {
        btn.addEventListener('click', function () {
            document
                .querySelectorAll('.pill-option')
                .forEach(b => b.setAttribute('aria-checked', 'false'));
            this.setAttribute('aria-checked', 'true');
            document.getElementById('dreamed-value').value = this.dataset.value;
            autoSave();
        });
    });

    // === WATER SECTION ===
    document.getElementById('water-add')?.addEventListener('click', function () {
        const countEl = document.getElementById('water-count');
        const waterInput = document.getElementById('water-intake');
        const current = parseInt(countEl.textContent) || 0;
        if (current < 20) {
            countEl.textContent = current + 1;
            waterInput.value = current + 1;
            updateWaterProgress(current + 1);
            autoSave();
        }
    });

    // === EVENING SECTION ===
    // Counter controls (sugar, caffeine, alcohol)
    document.querySelectorAll('.btn-counter').forEach(btn => {
        btn.addEventListener('click', function () {
            const target = document.getElementById(this.dataset.target);
            if (!target) {
                return;
            }
            const current = parseInt(target.value) || 0;
            const isPlus = this.classList.contains('btn-plus');
            const newValue = Math.max(0, Math.min(20, current + (isPlus ? 1 : -1)));
            target.value = newValue;
            autoSave();
        });
    });

    // Energy picker
    document.querySelectorAll('.energy-option').forEach(btn => {
        btn.addEventListener('click', function () {
            document
                .querySelectorAll('.energy-option')
                .forEach(b => b.setAttribute('aria-checked', 'false'));
            this.setAttribute('aria-checked', 'true');
            document.getElementById('energy-value').value = this.dataset.energy;
            autoSave();
        });
    });

    // Mood picker
    document.querySelectorAll('.mood-option').forEach(btn => {
        btn.addEventListener('click', function () {
            document
                .querySelectorAll('.mood-option')
                .forEach(b => b.setAttribute('aria-checked', 'false'));
            this.setAttribute('aria-checked', 'true');
            document.getElementById('mood-value').value = this.dataset.mood;
            autoSave();
        });
    });

    // Walked checkbox
    document.getElementById('walked')?.addEventListener('change', autoSave);

    // Reading checkbox
    document.getElementById('reading')?.addEventListener('change', autoSave);

    // Weight - auto-save on change (from wheel picker)
    document.getElementById('weight')?.addEventListener('change', autoSave);

    // === FALLBACK ===
    document.getElementById('fill-all-btn')?.addEventListener('click', showAllSections);

    // === EDIT MODE ===
    document.getElementById('edit-today-btn')?.addEventListener('click', toggleEditMode);

    // === GLOBAL ===
    // Save button
    document.getElementById('save-data')?.addEventListener('click', () => saveData(false));

    // Delete all data button
    document.getElementById('delete-all-data')?.addEventListener('click', confirmDeleteAll);

    // Settings: Export buttons
    document.getElementById('export-csv')?.addEventListener('click', handleExportCSV);
    document.getElementById('export-json')?.addEventListener('click', handleExportJSON);

    // Settings: Import buttons
    document.getElementById('import-csv')?.addEventListener('change', handleImportCSV);
    document.getElementById('import-json')?.addEventListener('change', handleImportJSON);

    // Settings: Demo data buttons
    document
        .getElementById('generate-demo')
        ?.addEventListener('click', () => handleGenerateDemo(7));
    document
        .getElementById('generate-demo-30')
        ?.addEventListener('click', () => handleGenerateDemo(30));

    // Settings: Cleanup button
    document.getElementById('cleanup-old')?.addEventListener('click', handleCleanupOld);
}

/**
 * Save current form data
 * Only saves data from visible sections, preserves existing data for hidden sections
 * @param {boolean} silent - If true, don't show feedback
 */
function saveData(silent = false) {
    if (!silent) {
        console.log('💾 Data opslaan...');
    }

    // Get existing data first (to preserve hidden section data)
    const existingData = getTodayData() || {};

    // Check which sections are visible
    const morningVisible = !document
        .getElementById('morning-section')
        ?.classList.contains('hidden');
    const eveningVisible = !document
        .getElementById('evening-section')
        ?.classList.contains('hidden');

    // Start with existing data, then update visible sections
    const data = { ...existingData };

    // Morning fields - only update if section is visible
    if (morningVisible) {
        data.sleepScore = parseInt(document.getElementById('sleep-score')?.value) || 7;
        data.backPain = parseInt(document.getElementById('back-pain')?.value) || 0;
        data.dreamed = document.getElementById('dreamed-value')?.value || null;
        const weightValue = parseFloat(document.getElementById('weight')?.value);
        if (!isNaN(weightValue) && weightValue > 0) {
            data.weight = weightValue;
        }
    }

    // Water (always visible)
    data.waterIntake = parseInt(document.getElementById('water-intake')?.value) || 0;

    // Evening fields - only update if section is visible
    if (eveningVisible) {
        data.walked = document.getElementById('walked')?.checked || false;
        data.reading = document.getElementById('reading')?.checked || false;
        data.sugarPortions = parseInt(document.getElementById('sugar-portions')?.value) || 0;
        data.caffeineCount = parseInt(document.getElementById('caffeine-count')?.value) || 0;
        data.alcoholCount = parseInt(document.getElementById('alcohol-count')?.value) || 0;
        data.energyLevel = parseInt(document.getElementById('energy-value')?.value) || null;
        data.mood = parseInt(document.getElementById('mood-value')?.value) || null;
    }

    if (!silent) {
        console.log('📊 Op te slaan data:', data);
        console.log('📍 Zichtbaar - Ochtend:', morningVisible, '| Avond:', eveningVisible);
    }

    // Save to storage
    const success = saveTodayData(data);

    if (success) {
        // Update health score
        updateHealthScore();

        // Update section visibility
        updateSectionVisibility();

        // Refresh statistics if initialized
        if (statisticsInitialized) {
            refreshStatistics();
        }

        // Show feedback (unless silent)
        if (!silent) {
            showSaveFeedback();
        }
    } else if (!silent) {
        showError('Fout bij opslaan. Probeer opnieuw.');
    }
}

/**
 * Show save feedback using toast notification
 */
function showSaveFeedback() {
    showSuccess('Data opgeslagen');
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
 * Update circular progress bar (mini version in header)
 * @param {number} score - Health score (0-100)
 */
function updateCircularProgress(score) {
    const circle = document.getElementById('progress-circle');
    if (!circle) {
        return;
    }

    // Mini circle has radius 24, circumference = 2 * PI * 24 ≈ 150.8
    const circumference = 150.8;

    // Calculate offset (100% = 0 offset, 0% = full circumference)
    const offset = circumference - (score / 100) * circumference;

    circle.style.strokeDashoffset = offset;

    // Change color based on score
    const color = getScoreColor(score);
    circle.setAttribute('stroke', color);
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

    // Initialize or refresh statistics when switching to stats view
    if (viewId === 'stats-view') {
        if (!statisticsInitialized) {
            initStatistics();
            statisticsInitialized = true;
        } else {
            refreshStatistics();
        }
    }

    // Update data stats when switching to settings view
    if (viewId === 'settings-view') {
        updateDataStats();
    }

    currentView = viewId;
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

            showSuccess('Alle data verwijderd');
            updateDataStats();
        }
    }
}

/**
 * Handle CSV export
 */
function handleExportCSV() {
    const result = downloadCSV();
    showImportStatus(result.message, result.success);
}

/**
 * Handle JSON export
 */
function handleExportJSON() {
    const result = downloadJSON();
    showImportStatus(result.message, result.success);
}

/**
 * Handle CSV import
 * @param {Event} e - Change event from file input
 */
async function handleImportCSV(e) {
    const file = e.target.files[0];
    if (!file) {
        return;
    }

    showImportStatus('Importeren...', true);
    const result = await importCSV(file);
    showImportStatus(result.message, result.success);

    if (result.success && result.count > 0) {
        updateHealthScore();
        updateDataStats();
        if (statisticsInitialized) {
            refreshStatistics();
        }
    }

    // Reset file input
    e.target.value = '';
}

/**
 * Handle JSON import
 * @param {Event} e - Change event from file input
 */
async function handleImportJSON(e) {
    const file = e.target.files[0];
    if (!file) {
        return;
    }

    showImportStatus('Importeren...', true);
    const result = await importJSON(file);
    showImportStatus(result.message, result.success);

    if (result.success && result.count > 0) {
        updateHealthScore();
        updateDataStats();
        if (statisticsInitialized) {
            refreshStatistics();
        }
    }

    // Reset file input
    e.target.value = '';
}

/**
 * Handle demo data generation
 * @param {number} days - Number of days to generate
 */
function handleGenerateDemo(days) {
    const confirmed = confirm(
        `Dit genereert ${days} dagen aan voorbeelddata. Bestaande data voor deze dagen wordt overschreven. Doorgaan?`
    );

    if (confirmed) {
        const result = generateDemoData(days);
        showImportStatus(result.message, result.success);

        if (result.success) {
            loadTodayData();
            updateHealthScore();
            updateDataStats();
            if (statisticsInitialized) {
                refreshStatistics();
            }
        }
    }
}

/**
 * Handle cleanup of old data
 */
function handleCleanupOld() {
    const stats = getStorageStats();
    const confirmed = confirm(
        `Dit verwijdert alle data ouder dan 90 dagen.\nJe hebt momenteel ${stats.totalEntries} dagen aan data.\n\nDoorgaan?`
    );

    if (confirmed) {
        const result = cleanupOldData(90);
        showImportStatus(result.message, result.success);

        if (result.count > 0) {
            updateDataStats();
            if (statisticsInitialized) {
                refreshStatistics();
            }
        }
    }
}

/**
 * Show import/export status message using toast
 * @param {string} message - Status message
 * @param {boolean} success - Whether operation was successful
 */
function showImportStatus(message, success) {
    if (success) {
        showSuccess(message);
    } else {
        showError(message);
    }
}

/**
 * Update data statistics display in settings
 */
function updateDataStats() {
    const statsEl = document.getElementById('data-stats');
    if (!statsEl) {
        return;
    }

    const stats = getFormattedStats();

    statsEl.innerHTML = `
        <div class="data-stats-item">
            <span class="data-stats-value">${stats.totalEntries}</span>
            <span class="data-stats-label">Dagen</span>
        </div>
        <div class="data-stats-item">
            <span class="data-stats-value">${stats.oldestEntry}</span>
            <span class="data-stats-label">Eerste</span>
        </div>
        <div class="data-stats-item">
            <span class="data-stats-value">${stats.newestEntry}</span>
            <span class="data-stats-label">Laatste</span>
        </div>
        <div class="data-stats-item">
            <span class="data-stats-value">${stats.storageSize}</span>
            <span class="data-stats-label">Opslag</span>
        </div>
    `;

    // Hide demo data section if user already has data
    const demoCard = document.getElementById('demo-data-card');
    if (demoCard) {
        demoCard.style.display = stats.totalEntries > 0 ? 'none' : 'block';
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
