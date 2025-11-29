/**
 * Toast Notification Service
 *
 * Provides user feedback through toast notifications
 *
 * @module services/toast
 */

const ICONS = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
};

const DEFAULT_DURATION = 3000;

/**
 * Show a toast notification
 * @param {string} message - The message to display
 * @param {Object} options - Toast options
 * @param {string} options.type - 'success' | 'error' | 'warning' | 'info'
 * @param {number} options.duration - Duration in ms (default: 3000)
 * @returns {HTMLElement} The toast element
 */
export function showToast(message, options = {}) {
    const { type = 'info', duration = DEFAULT_DURATION } = options;

    const container = document.getElementById('toast-container');
    if (!container) {
        console.warn('Toast container not found');
        return null;
    }

    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.setAttribute('role', 'alert');

    toast.innerHTML = `
        <span class="toast-icon" aria-hidden="true">${ICONS[type] || ICONS.info}</span>
        <span class="toast-message">${escapeHtml(message)}</span>
    `;

    // Add to container
    container.appendChild(toast);

    // Auto-remove after duration
    const timeoutId = window.setTimeout(() => {
        removeToast(toast);
    }, duration);

    // Store timeout for potential manual dismissal
    toast.dataset.timeoutId = timeoutId;

    return toast;
}

/**
 * Remove a toast with animation
 * @param {HTMLElement} toast - The toast element to remove
 */
function removeToast(toast) {
    if (!toast || !toast.parentElement) {
        return;
    }

    // Clear any pending timeout
    if (toast.dataset.timeoutId) {
        window.clearTimeout(parseInt(toast.dataset.timeoutId));
    }

    // Add exit animation class
    toast.classList.add('toast-out');

    // Remove after animation completes
    toast.addEventListener('animationend', () => {
        toast.remove();
    });
}

/**
 * Show a success toast
 * @param {string} message - The message to display
 * @param {number} duration - Duration in ms
 */
export function showSuccess(message, duration = DEFAULT_DURATION) {
    return showToast(message, { type: 'success', duration });
}

/**
 * Show an error toast
 * @param {string} message - The message to display
 * @param {number} duration - Duration in ms
 */
export function showError(message, duration = 4000) {
    return showToast(message, { type: 'error', duration });
}

/**
 * Show a warning toast
 * @param {string} message - The message to display
 * @param {number} duration - Duration in ms
 */
export function showWarning(message, duration = DEFAULT_DURATION) {
    return showToast(message, { type: 'warning', duration });
}

/**
 * Show an info toast
 * @param {string} message - The message to display
 * @param {number} duration - Duration in ms
 */
export function showInfo(message, duration = DEFAULT_DURATION) {
    return showToast(message, { type: 'info', duration });
}

/**
 * Clear all toasts
 */
export function clearAllToasts() {
    const container = document.getElementById('toast-container');
    if (container) {
        container.innerHTML = '';
    }
}

/**
 * Escape HTML to prevent XSS
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
