/**
 * Tracker Habits Component
 *
 * Renders custom habits checkboxes in the tracker form.
 *
 * @module components/trackerHabits
 */

import { getCustomHabits } from '../services/customHabits.js';

/**
 * Initialize and render custom habits in tracker form
 * @param {Object} existingData - Existing day data (for pre-checking boxes)
 * @param {Function} onChange - Callback when habit state changes
 */
export function renderTrackerHabits(existingData = null, onChange = null) {
    const container = document.getElementById('custom-habits-tracker');
    const checkboxesContainer = document.getElementById('custom-habits-checkboxes');

    if (!container || !checkboxesContainer) {
        return;
    }

    const habits = getCustomHabits();

    // Show/hide section based on whether habits exist
    if (habits.length === 0) {
        container.classList.add('hidden');
        return;
    }

    container.classList.remove('hidden');

    // Get existing habit data
    const habitData = existingData?.customHabits || {};

    // Render checkboxes
    checkboxesContainer.innerHTML = habits
        .map(
            habit => `
        <div class="habit-checkbox-item">
            <input
                type="checkbox"
                id="habit-${habit.id}"
                data-habit-id="${habit.id}"
                ${habitData[habit.id] === true ? 'checked' : ''}
            />
            <label for="habit-${habit.id}">
                <span class="habit-emoji">${habit.emoji}</span>
                <span>${habit.name}</span>
            </label>
        </div>
    `
        )
        .join('');

    // Attach change listeners
    if (onChange) {
        checkboxesContainer.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                onChange(getHabitValues());
            });
        });
    }
}

/**
 * Get current habit checkbox values
 * @returns {Object} Object with habit IDs as keys and boolean values
 */
export function getHabitValues() {
    const checkboxes = document.querySelectorAll(
        '#custom-habits-checkboxes input[type="checkbox"]'
    );
    const values = {};

    checkboxes.forEach(checkbox => {
        const habitId = checkbox.dataset.habitId;
        values[habitId] = checkbox.checked;
    });

    return values;
}

/**
 * Set habit checkbox values
 * @param {Object} values - Object with habit IDs as keys and boolean values
 */
export function setHabitValues(values) {
    if (!values) {
        return;
    }

    Object.entries(values).forEach(([habitId, checked]) => {
        const checkbox = document.querySelector(`#habit-${habitId}`);
        if (checkbox) {
            checkbox.checked = checked;
        }
    });
}

/**
 * Clear all habit checkboxes
 */
export function clearHabitCheckboxes() {
    const checkboxes = document.querySelectorAll(
        '#custom-habits-checkboxes input[type="checkbox"]'
    );
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
}

/**
 * Refresh the habits display (call when habits list changes)
 * @param {Object} existingData - Existing day data
 * @param {Function} onChange - Change callback
 */
export function refreshTrackerHabits(existingData = null, onChange = null) {
    renderTrackerHabits(existingData, onChange);
}
