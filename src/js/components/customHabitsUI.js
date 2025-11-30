/**
 * Custom Habits UI Component
 *
 * Provides UI for managing custom habits in Settings.
 * Uses inline forms (no modals) following design principles.
 *
 * @module components/customHabitsUI
 */

import {
    getCustomHabits,
    createHabit,
    updateHabit,
    deleteHabit,
    getMaxHabits
} from '../services/customHabits.js';
import { createEmojiPicker } from './emojiPicker.js';
import { showToast } from '../services/toast.js';

let currentEditId = null;
let onHabitsChangeCallback = null;

/**
 * Initialize custom habits UI in settings
 * @param {Function} onHabitsChange - Callback when habits change (for tracker form update)
 */
export function initCustomHabitsUI(onHabitsChange) {
    onHabitsChangeCallback = onHabitsChange;

    const container = document.getElementById('custom-habits-settings');
    if (!container) {
        console.warn('Custom habits container not found');
        return;
    }

    renderHabitsManager(container);
}

/**
 * Render the habits manager UI
 * @param {HTMLElement} container - Container element
 */
function renderHabitsManager(container) {
    const habits = getCustomHabits();
    const maxHabits = getMaxHabits();

    container.innerHTML = `
        <div class="habits-list" id="habits-list">
            ${habits.length === 0 ? '<p class="no-habits">Nog geen custom habits</p>' : ''}
            ${habits.map(habit => renderHabitItem(habit)).join('')}
        </div>

        ${
            habits.length < maxHabits
                ? `
        <div class="habit-add-section" id="habit-add-section">
            <button type="button" id="add-habit-btn" class="btn-add-habit">
                + Nieuwe habit toevoegen
            </button>
        </div>
        `
                : `
        <p class="habits-limit-reached">Maximum aantal habits bereikt (${maxHabits})</p>
        `
        }

        <div id="habit-form-container" class="habit-form-container hidden"></div>
    `;

    // Attach event listeners
    attachEventListeners(container);
}

/**
 * Render a single habit item
 * @param {Object} habit - Habit object
 * @returns {string} HTML string
 */
function renderHabitItem(habit) {
    return `
        <div class="habit-item" data-habit-id="${habit.id}">
            <div class="habit-info">
                <span class="habit-emoji">${habit.emoji}</span>
                <span class="habit-name">${habit.name}</span>
            </div>
            <div class="habit-actions">
                <button type="button" class="btn-habit-edit" data-action="edit" aria-label="Bewerk ${habit.name}">
                    ✏️
                </button>
                <button type="button" class="btn-habit-delete" data-action="delete" aria-label="Verwijder ${habit.name}">
                    🗑️
                </button>
            </div>
        </div>
    `;
}

/**
 * Attach event listeners to the habits manager
 * @param {HTMLElement} container - Container element
 */
function attachEventListeners(container) {
    // Add habit button
    const addBtn = container.querySelector('#add-habit-btn');
    if (addBtn) {
        addBtn.addEventListener('click', () => showHabitForm(container));
    }

    // Habit item actions (edit/delete)
    container.querySelectorAll('.habit-item').forEach(item => {
        item.querySelectorAll('button').forEach(btn => {
            btn.addEventListener('click', () => {
                const action = btn.dataset.action;
                const habitId = item.dataset.habitId;

                if (action === 'edit') {
                    showHabitForm(container, habitId);
                } else if (action === 'delete') {
                    handleDeleteHabit(container, habitId);
                }
            });
        });
    });
}

/**
 * Show the habit form (add or edit mode)
 * @param {HTMLElement} container - Container element
 * @param {string} editId - Habit ID to edit (optional)
 */
function showHabitForm(container, editId = null) {
    currentEditId = editId;
    const formContainer = container.querySelector('#habit-form-container');
    const addSection = container.querySelector('#habit-add-section');

    // Get existing data if editing
    let existingHabit = null;
    if (editId) {
        const habits = getCustomHabits();
        existingHabit = habits.find(h => h.id === editId);
    }

    // Hide add button
    if (addSection) {
        addSection.classList.add('hidden');
    }

    // Show form
    formContainer.classList.remove('hidden');
    formContainer.innerHTML = `
        <div class="habit-form">
            <h4>${editId ? 'Habit bewerken' : 'Nieuwe habit'}</h4>

            <div class="form-group">
                <label for="habit-name-input">Naam</label>
                <input
                    type="text"
                    id="habit-name-input"
                    class="habit-name-input"
                    placeholder="bijv. Meditatie"
                    maxlength="30"
                    value="${existingHabit?.name || ''}"
                />
                <span class="char-count"><span id="name-char-count">${existingHabit?.name?.length || 0}</span>/30</span>
            </div>

            <div class="form-group">
                <label>Kies een emoji</label>
                <div id="habit-emoji-picker"></div>
            </div>

            <div class="habit-form-actions">
                <button type="button" id="habit-form-cancel" class="btn-secondary">
                    Annuleren
                </button>
                <button type="button" id="habit-form-save" class="btn-primary">
                    ${editId ? 'Opslaan' : 'Toevoegen'}
                </button>
            </div>
        </div>
    `;

    // Add emoji picker
    const pickerContainer = formContainer.querySelector('#habit-emoji-picker');
    const emojiPicker = createEmojiPicker({
        id: 'habit-emoji-picker-component',
        selectedEmoji: existingHabit?.emoji || '',
        onSelect: emoji => {
            // Store selected emoji
            formContainer.dataset.selectedEmoji = emoji;
        }
    });
    pickerContainer.appendChild(emojiPicker);

    // Set initial emoji
    formContainer.dataset.selectedEmoji = existingHabit?.emoji || '';

    // Character count
    const nameInput = formContainer.querySelector('#habit-name-input');
    const charCount = formContainer.querySelector('#name-char-count');
    nameInput.addEventListener('input', () => {
        charCount.textContent = nameInput.value.length;
    });

    // Focus name input
    nameInput.focus();

    // Cancel button
    formContainer.querySelector('#habit-form-cancel').addEventListener('click', () => {
        hideHabitForm(container);
    });

    // Save button
    formContainer.querySelector('#habit-form-save').addEventListener('click', () => {
        handleSaveHabit(container);
    });

    // Enter key to save
    nameInput.addEventListener('keypress', e => {
        if (e.key === 'Enter') {
            handleSaveHabit(container);
        }
    });
}

/**
 * Hide the habit form
 * @param {HTMLElement} container - Container element
 */
function hideHabitForm(container) {
    currentEditId = null;
    const formContainer = container.querySelector('#habit-form-container');
    const addSection = container.querySelector('#habit-add-section');

    formContainer.classList.add('hidden');
    formContainer.innerHTML = '';

    if (addSection) {
        addSection.classList.remove('hidden');
    }
}

/**
 * Handle saving a habit (create or update)
 * @param {HTMLElement} container - Container element
 */
function handleSaveHabit(container) {
    const formContainer = container.querySelector('#habit-form-container');
    const nameInput = formContainer.querySelector('#habit-name-input');
    const name = nameInput.value.trim();
    const emoji = formContainer.dataset.selectedEmoji || '✨';

    // Validate
    if (!name) {
        showToast('Vul een naam in', 'error');
        nameInput.focus();
        return;
    }

    let result;
    if (currentEditId) {
        // Update existing
        result = updateHabit(currentEditId, { name, emoji });
        if (result) {
            showToast('Habit bijgewerkt', 'success');
        }
    } else {
        // Create new
        result = createHabit({ name, emoji });
        if (result) {
            showToast('Habit toegevoegd', 'success');
        }
    }

    if (result) {
        hideHabitForm(container);
        renderHabitsManager(container);

        // Notify callback
        if (onHabitsChangeCallback) {
            onHabitsChangeCallback();
        }
    } else {
        showToast('Er ging iets mis', 'error');
    }
}

/**
 * Handle deleting a habit
 * @param {HTMLElement} container - Container element
 * @param {string} habitId - Habit ID to delete
 */
function handleDeleteHabit(container, habitId) {
    const habits = getCustomHabits();
    const habit = habits.find(h => h.id === habitId);

    if (!habit) {
        return;
    }

    // Simple confirmation via inline UI
    const item = container.querySelector(`[data-habit-id="${habitId}"]`);
    if (item.classList.contains('confirm-delete')) {
        // Second click - actually delete
        const success = deleteHabit(habitId);
        if (success) {
            showToast(`${habit.emoji} ${habit.name} verwijderd`, 'success');
            renderHabitsManager(container);

            // Notify callback
            if (onHabitsChangeCallback) {
                onHabitsChangeCallback();
            }
        }
    } else {
        // First click - show confirmation state
        item.classList.add('confirm-delete');
        const deleteBtn = item.querySelector('[data-action="delete"]');
        deleteBtn.textContent = '✓';
        deleteBtn.setAttribute('aria-label', `Bevestig verwijderen ${habit.name}`);

        // Reset after 3 seconds
        setTimeout(() => {
            if (item && item.classList.contains('confirm-delete')) {
                item.classList.remove('confirm-delete');
                deleteBtn.textContent = '🗑️';
                deleteBtn.setAttribute('aria-label', `Verwijder ${habit.name}`);
            }
        }, 3000);
    }
}

/**
 * Refresh the habits list
 */
export function refreshHabitsList() {
    const container = document.getElementById('custom-habits-settings');
    if (container) {
        renderHabitsManager(container);
    }
}
