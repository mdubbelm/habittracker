/**
 * Emoji Picker Component
 *
 * Simple, accessible emoji picker for custom habits.
 * Uses inline display (no modal) following design principles.
 *
 * @module components/emojiPicker
 */

// Curated emoji categories for habits
const EMOJI_CATEGORIES = {
    wellness: {
        label: 'Wellness',
        emojis: ['🧘', '😴', '🛁', '💆', '🧠', '❤️', '💪', '🌟', '✨', '🙏']
    },
    fitness: {
        label: 'Fitness',
        emojis: ['🏃', '🚶', '🚴', '🏋️', '⚽', '🎾', '🏊', '🧗', '🤸', '🎯']
    },
    food: {
        label: 'Voeding',
        emojis: ['🥗', '🍎', '🥕', '💧', '🍵', '🥛', '🥑', '🍇', '🥦', '🍳']
    },
    productivity: {
        label: 'Productiviteit',
        emojis: ['📚', '✍️', '💻', '📝', '🎨', '🎵', '📖', '🔬', '💡', '⏰']
    },
    social: {
        label: 'Sociaal',
        emojis: ['👥', '📞', '💬', '🤝', '👨‍👩‍👧', '🎉', '💌', '🫂', '😊', '🌈']
    },
    nature: {
        label: 'Natuur',
        emojis: ['🌳', '🌻', '🌊', '☀️', '🌙', '⭐', '🍃', '🦋', '🐕', '🌸']
    }
};

/**
 * Create an emoji picker element
 * @param {Object} options - Configuration options
 * @param {string} options.id - Unique ID for the picker
 * @param {Function} options.onSelect - Callback when emoji is selected
 * @param {string} options.selectedEmoji - Currently selected emoji
 * @returns {HTMLElement} The picker element
 */
export function createEmojiPicker({ id, onSelect, selectedEmoji = '' }) {
    const container = document.createElement('div');
    container.className = 'emoji-picker';
    container.id = id;

    // Category tabs
    const tabsHtml = Object.entries(EMOJI_CATEGORIES)
        .map(
            ([key, cat], index) => `
            <button
                type="button"
                class="emoji-tab ${index === 0 ? 'active' : ''}"
                data-category="${key}"
                aria-selected="${index === 0}"
            >
                ${cat.emojis[0]} ${cat.label}
            </button>
        `
        )
        .join('');

    // Emoji grid (show first category by default)
    const firstCategory = Object.keys(EMOJI_CATEGORIES)[0];

    container.innerHTML = `
        <div class="emoji-tabs" role="tablist" aria-label="Emoji categorieën">
            ${tabsHtml}
        </div>
        <div class="emoji-grid" role="listbox" aria-label="Kies een emoji">
            ${renderEmojiGrid(firstCategory, selectedEmoji)}
        </div>
    `;

    // Setup event listeners
    setupPickerEvents(container, onSelect, selectedEmoji);

    return container;
}

/**
 * Render emoji grid for a category
 * @param {string} category - Category key
 * @param {string} selectedEmoji - Currently selected emoji
 * @returns {string} HTML string
 */
function renderEmojiGrid(category, selectedEmoji) {
    const emojis = EMOJI_CATEGORIES[category]?.emojis || [];

    return emojis
        .map(
            emoji => `
        <button
            type="button"
            class="emoji-option ${emoji === selectedEmoji ? 'selected' : ''}"
            data-emoji="${emoji}"
            role="option"
            aria-selected="${emoji === selectedEmoji}"
            aria-label="${emoji}"
        >
            ${emoji}
        </button>
    `
        )
        .join('');
}

/**
 * Setup event listeners for the picker
 * @param {HTMLElement} container - Picker container
 * @param {Function} onSelect - Selection callback
 * @param {string} selectedEmoji - Currently selected emoji
 */
function setupPickerEvents(container, onSelect, selectedEmoji) {
    const tabs = container.querySelectorAll('.emoji-tab');
    const grid = container.querySelector('.emoji-grid');
    let currentSelected = selectedEmoji;

    // Tab switching
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Update active tab
            tabs.forEach(t => {
                t.classList.remove('active');
                t.setAttribute('aria-selected', 'false');
            });
            tab.classList.add('active');
            tab.setAttribute('aria-selected', 'true');

            // Update grid
            const category = tab.dataset.category;
            grid.innerHTML = renderEmojiGrid(category, currentSelected);

            // Re-attach emoji click handlers
            attachEmojiHandlers(grid, onSelect, val => {
                currentSelected = val;
            });
        });
    });

    // Initial emoji handlers
    attachEmojiHandlers(grid, onSelect, val => {
        currentSelected = val;
    });
}

/**
 * Attach click handlers to emoji buttons
 * @param {HTMLElement} grid - Grid container
 * @param {Function} onSelect - Selection callback
 * @param {Function} updateSelected - Update selected state
 */
function attachEmojiHandlers(grid, onSelect, updateSelected) {
    grid.querySelectorAll('.emoji-option').forEach(btn => {
        btn.addEventListener('click', () => {
            // Update selection state
            grid.querySelectorAll('.emoji-option').forEach(b => {
                b.classList.remove('selected');
                b.setAttribute('aria-selected', 'false');
            });
            btn.classList.add('selected');
            btn.setAttribute('aria-selected', 'true');

            const emoji = btn.dataset.emoji;
            updateSelected(emoji);

            // Callback
            if (onSelect) {
                onSelect(emoji);
            }
        });
    });
}

/**
 * Get all available emojis (flat list)
 * @returns {string[]} Array of emojis
 */
export function getAllEmojis() {
    return Object.values(EMOJI_CATEGORIES).flatMap(cat => cat.emojis);
}

/**
 * Get emoji categories
 * @returns {Object} Categories object
 */
export function getEmojiCategories() {
    return EMOJI_CATEGORIES;
}
