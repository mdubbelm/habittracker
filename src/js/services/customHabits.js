/**
 * Custom Habits Service
 *
 * Manages custom habits - CRUD operations and localStorage persistence.
 * Each habit has: id, name, emoji, createdAt
 *
 * @module services/customHabits
 */

const STORAGE_KEY = 'healthTracker_customHabits';
const MAX_HABITS = 10;

/**
 * Get all custom habits
 * @returns {Array} Array of habit objects
 */
export function getCustomHabits() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch (e) {
        console.error('Error reading custom habits:', e);
        return [];
    }
}

/**
 * Get a single habit by ID
 * @param {string} id - Habit ID
 * @returns {Object|null} Habit object or null
 */
export function getHabitById(id) {
    const habits = getCustomHabits();
    return habits.find(h => h.id === id) || null;
}

/**
 * Create a new custom habit
 * @param {Object} habit - Habit data (name, emoji)
 * @returns {Object|null} Created habit or null if failed
 */
export function createHabit({ name, emoji }) {
    const habits = getCustomHabits();

    // Check max limit
    if (habits.length >= MAX_HABITS) {
        console.error(`Maximum aantal habits bereikt (${MAX_HABITS})`);
        return null;
    }

    // Validate
    if (!name || name.trim().length === 0) {
        console.error('Habit naam is verplicht');
        return null;
    }

    if (name.length > 30) {
        console.error('Habit naam mag max 30 karakters zijn');
        return null;
    }

    // Create habit
    const newHabit = {
        id: `habit-${Date.now()}`,
        name: name.trim(),
        emoji: emoji || '✨',
        createdAt: new Date().toISOString()
    };

    habits.push(newHabit);
    saveHabits(habits);

    console.log(`✅ Habit aangemaakt: ${newHabit.emoji} ${newHabit.name}`);
    return newHabit;
}

/**
 * Update an existing habit
 * @param {string} id - Habit ID
 * @param {Object} updates - Fields to update (name, emoji)
 * @returns {Object|null} Updated habit or null
 */
export function updateHabit(id, { name, emoji }) {
    const habits = getCustomHabits();
    const index = habits.findIndex(h => h.id === id);

    if (index === -1) {
        console.error('Habit niet gevonden:', id);
        return null;
    }

    // Validate name if provided
    if (name !== undefined) {
        if (!name || name.trim().length === 0) {
            console.error('Habit naam is verplicht');
            return null;
        }
        if (name.length > 30) {
            console.error('Habit naam mag max 30 karakters zijn');
            return null;
        }
        habits[index].name = name.trim();
    }

    // Update emoji if provided
    if (emoji !== undefined) {
        habits[index].emoji = emoji;
    }

    habits[index].updatedAt = new Date().toISOString();

    saveHabits(habits);
    console.log(`✅ Habit bijgewerkt: ${habits[index].emoji} ${habits[index].name}`);
    return habits[index];
}

/**
 * Delete a habit
 * @param {string} id - Habit ID
 * @returns {boolean} Success status
 */
export function deleteHabit(id) {
    const habits = getCustomHabits();
    const index = habits.findIndex(h => h.id === id);

    if (index === -1) {
        console.error('Habit niet gevonden:', id);
        return false;
    }

    const deleted = habits.splice(index, 1)[0];
    saveHabits(habits);

    console.log(`🗑️ Habit verwijderd: ${deleted.emoji} ${deleted.name}`);
    return true;
}

/**
 * Reorder habits
 * @param {string} habitId - ID of habit to move
 * @param {number} newIndex - New position index
 * @returns {boolean} Success status
 */
export function reorderHabit(habitId, newIndex) {
    const habits = getCustomHabits();
    const currentIndex = habits.findIndex(h => h.id === habitId);

    if (currentIndex === -1) {
        return false;
    }

    // Remove from current position
    const [habit] = habits.splice(currentIndex, 1);

    // Insert at new position
    habits.splice(newIndex, 0, habit);

    saveHabits(habits);
    return true;
}

/**
 * Save habits to localStorage
 * @param {Array} habits - Array of habits
 */
function saveHabits(habits) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
    } catch (e) {
        console.error('Error saving custom habits:', e);
    }
}

/**
 * Get habit count
 * @returns {number} Number of habits
 */
export function getHabitCount() {
    return getCustomHabits().length;
}

/**
 * Get max habits limit
 * @returns {number} Maximum allowed habits
 */
export function getMaxHabits() {
    return MAX_HABITS;
}

/**
 * Calculate completion percentage for habits on a given date
 * @param {Object} dayData - Tracker data for a day
 * @returns {Object} { completed, total, percentage }
 */
export function getHabitCompletion(dayData) {
    const habits = getCustomHabits();

    if (habits.length === 0) {
        return { completed: 0, total: 0, percentage: 100 };
    }

    const customHabitsData = dayData?.customHabits || {};
    let completed = 0;

    habits.forEach(habit => {
        if (customHabitsData[habit.id] === true) {
            completed++;
        }
    });

    return {
        completed,
        total: habits.length,
        percentage: Math.round((completed / habits.length) * 100)
    };
}
