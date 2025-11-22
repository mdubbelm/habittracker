/**
 * Input Sanitization Utilities
 *
 * SECURITY: All user inputs MUST be sanitized to prevent XSS attacks
 * @module utils/sanitize
 */

/**
 * Sanitize text input to prevent XSS
 * Converts special characters to HTML entities
 *
 * @param {string} input - Raw user input
 * @returns {string} Sanitized string safe for HTML
 *
 * @example
 * sanitizeText("<script>alert('xss')</script>")
 * // Returns: "&lt;script&gt;alert('xss')&lt;/script&gt;"
 */
function sanitizeText(input) {
    if (typeof input !== 'string') {
        return '';
    }

    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}

/**
 * Sanitize and validate number input
 *
 * @param {any} input - User input
 * @param {number} min - Minimum allowed value
 * @param {number} max - Maximum allowed value
 * @param {number} defaultValue - Default if invalid
 * @returns {number} Validated number
 *
 * @example
 * sanitizeNumber("10", 0, 10, 0) // Returns: 10
 * sanitizeNumber("999", 0, 10, 0) // Returns: 0 (out of range)
 * sanitizeNumber("abc", 0, 10, 0) // Returns: 0 (not a number)
 */
function sanitizeNumber(input, min, max, defaultValue = 0) {
    const num = Number(input);

    // Check if valid number
    if (isNaN(num)) {
        console.warn(`Invalid number input: ${input}`);
        return defaultValue;
    }

    // Check range
    if (num < min || num > max) {
        console.warn(`Number out of range: ${num} (allowed: ${min}-${max})`);
        return defaultValue;
    }

    return num;
}

/**
 * Sanitize boolean input
 *
 * @param {any} input - User input
 * @returns {boolean} Validated boolean
 */
function sanitizeBoolean(input) {
    return Boolean(input);
}

/**
 * Sanitize date input
 * Returns ISO date string (YYYY-MM-DD) or null if invalid
 *
 * @param {string|Date} input - Date input
 * @returns {string|null} ISO date string or null
 */
function sanitizeDate(input) {
    try {
        const date = new Date(input);
        if (isNaN(date.getTime())) {
            return null;
        }
        return date.toISOString().split('T')[0];
    } catch (e) {
        console.error('Invalid date input:', input);
        return null;
    }
}

/**
 * Sanitize object for storage
 * Removes any potentially dangerous properties
 *
 * @param {Object} obj - Object to sanitize
 * @param {Array<string>} allowedKeys - List of allowed properties
 * @returns {Object} Sanitized object
 */
function sanitizeObject(obj, allowedKeys) {
    const sanitized = {};

    for (const key of allowedKeys) {
        if (obj.hasOwnProperty(key)) {
            const value = obj[key];

            // Sanitize based on type
            if (typeof value === 'string') {
                sanitized[key] = sanitizeText(value);
            } else if (typeof value === 'number') {
                sanitized[key] = value;
            } else if (typeof value === 'boolean') {
                sanitized[key] = value;
            } else if (typeof value === 'object' && value !== null) {
                // For nested objects (like customHabits)
                sanitized[key] = value;
            }
        }
    }

    return sanitized;
}

// Export for module use (or global if not using modules)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        sanitizeText,
        sanitizeNumber,
        sanitizeBoolean,
        sanitizeDate,
        sanitizeObject
    };
}
