/**
 * Settings Service
 *
 * Manages user preferences for tracking fields
 *
 * @module services/settings
 */

const STORAGE_KEY = 'healthTrackerSettings';

// Default settings - all fields enabled
const DEFAULT_SETTINGS = {
    fields: {
        sleep: true,
        pain: true,
        weight: true,
        dreamed: true,
        water: true,
        walked: true,
        reading: true,
        sugar: true,
        caffeine: true,
        alcohol: true,
        energy: true,
        mood: true
    }
};

/**
 * Get all settings
 * @returns {Object} Settings object
 */
export function getSettings() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            // Merge with defaults to handle new fields
            return {
                ...DEFAULT_SETTINGS,
                fields: { ...DEFAULT_SETTINGS.fields, ...parsed.fields }
            };
        }
    } catch (e) {
        console.error('Error loading settings:', e);
    }
    return { ...DEFAULT_SETTINGS };
}

/**
 * Save settings
 * @param {Object} settings - Settings object to save
 */
export function saveSettings(settings) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
        return true;
    } catch (e) {
        console.error('Error saving settings:', e);
        return false;
    }
}

/**
 * Check if a field is enabled
 * @param {string} fieldName - Name of the field
 * @returns {boolean} Whether the field is enabled
 */
export function isFieldEnabled(fieldName) {
    const settings = getSettings();
    return settings.fields[fieldName] !== false;
}

/**
 * Toggle a field on/off
 * @param {string} fieldName - Name of the field
 * @param {boolean} enabled - Whether to enable or disable
 */
export function setFieldEnabled(fieldName, enabled) {
    const settings = getSettings();
    settings.fields[fieldName] = enabled;
    saveSettings(settings);
}

/**
 * Get all enabled fields
 * @returns {Object} Object with field names as keys and boolean values
 */
export function getEnabledFields() {
    const settings = getSettings();
    return settings.fields;
}

/**
 * Field to DOM element mapping
 */
export const FIELD_ELEMENT_MAP = {
    sleep: ['sleep-score', 'sleep-output'],
    pain: ['back-pain', 'pain-output'],
    weight: ['weight-picker-trigger', 'weight'],
    dreamed: ['dreamed-value'],
    water: ['water-section'],
    walked: ['walked'],
    reading: ['reading'],
    sugar: ['sugar-portions'],
    caffeine: ['caffeine-count'],
    alcohol: ['alcohol-count'],
    energy: ['energy-value'],
    mood: ['mood-value']
};

/**
 * Apply field visibility based on settings
 */
export function applyFieldVisibility() {
    const settings = getSettings();

    Object.entries(settings.fields).forEach(([field, enabled]) => {
        // Find the form-group containing this field
        const elements = FIELD_ELEMENT_MAP[field] || [];

        elements.forEach(elementId => {
            const element = document.getElementById(elementId);
            if (!element) {
                return;
            }

            // Find parent form-group
            const formGroup = element.closest('.form-group');
            if (formGroup) {
                formGroup.style.display = enabled ? '' : 'none';
            }

            // Special case for water section (it's a whole card)
            if (elementId === 'water-section') {
                element.style.display = enabled ? '' : 'none';
            }
        });
    });
}
