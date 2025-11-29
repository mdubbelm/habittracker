/**
 * Wheel Picker Component
 *
 * iOS-style rotor/drum picker for selecting numeric values.
 * Used for weight input with kg and decimal wheels.
 *
 * @module components/wheelPicker
 */

// Constants
const ITEM_HEIGHT = 40; // Must match CSS .picker-wheel-item height
const VISIBLE_ITEMS = 5; // Items visible at once
const WHEEL_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS;

/**
 * Initialize the weight wheel picker
 */
export function initWeightPicker() {
    const overlay = document.getElementById('weight-picker-overlay');
    const trigger = document.getElementById('weight-picker-trigger');
    const display = document.getElementById('weight-display');
    const hiddenInput = document.getElementById('weight');
    const cancelBtn = document.getElementById('weight-picker-cancel');
    const confirmBtn = document.getElementById('weight-picker-confirm');
    const kgWheel = document.getElementById('weight-kg-inner');
    const decimalWheel = document.getElementById('weight-decimal-inner');

    if (!overlay || !trigger || !kgWheel || !decimalWheel) {
        return;
    }

    // State
    let selectedKg = 70;
    let selectedDecimal = 0;

    // Generate wheel items
    function generateKgItems() {
        // Weight range: 30-200 kg
        const items = [];
        for (let i = 30; i <= 200; i++) {
            items.push(i);
        }
        return items;
    }

    function generateDecimalItems() {
        // Decimals: 0-9 (representing .0 to .9)
        const items = [];
        for (let i = 0; i <= 9; i++) {
            items.push(i);
        }
        return items;
    }

    // Populate wheel with items
    function populateWheel(wheelInner, items, selectedValue) {
        // Add padding items for scroll
        const paddingCount = Math.floor(VISIBLE_ITEMS / 2);

        wheelInner.innerHTML = '';

        // Top padding
        for (let i = 0; i < paddingCount; i++) {
            const padding = document.createElement('div');
            padding.className = 'picker-wheel-item picker-padding';
            wheelInner.appendChild(padding);
        }

        // Actual items
        items.forEach(value => {
            const item = document.createElement('div');
            item.className = 'picker-wheel-item';
            item.dataset.value = value;
            item.textContent = value;
            if (value === selectedValue) {
                item.classList.add('selected');
            }
            wheelInner.appendChild(item);
        });

        // Bottom padding
        for (let i = 0; i < paddingCount; i++) {
            const padding = document.createElement('div');
            padding.className = 'picker-wheel-item picker-padding';
            wheelInner.appendChild(padding);
        }
    }

    // Scroll to selected value
    function scrollToValue(wheelInner, items, value) {
        const index = items.indexOf(value);
        if (index >= 0) {
            const offset = -index * ITEM_HEIGHT;
            wheelInner.style.transform = `translateY(${offset}px)`;
        }
    }

    // Update selected state visually
    function updateSelectedVisual(wheelInner, items, value) {
        const allItems = wheelInner.querySelectorAll('.picker-wheel-item:not(.picker-padding)');
        allItems.forEach((item, index) => {
            if (items[index] === value) {
                item.classList.add('selected');
            } else {
                item.classList.remove('selected');
            }
        });
    }

    // Setup touch/scroll handling for a wheel
    function setupWheelInteraction(wheelContainer, wheelInner, items, getValue, setValue) {
        let startY = 0;
        let currentOffset = 0;
        let isDragging = false;
        let velocity = 0;
        let lastY = 0;
        let lastTime = 0;
        let animationFrame = null;

        function getOffset() {
            const transform = wheelInner.style.transform;
            const match = transform.match(/translateY\((-?\d+(?:\.\d+)?)px\)/);
            return match ? parseFloat(match[1]) : 0;
        }

        function snapToNearest() {
            const offset = getOffset();
            const index = Math.round(-offset / ITEM_HEIGHT);
            const clampedIndex = Math.max(0, Math.min(items.length - 1, index));
            const snappedOffset = -clampedIndex * ITEM_HEIGHT;

            wheelInner.style.transition = 'transform 0.2s ease-out';
            wheelInner.style.transform = `translateY(${snappedOffset}px)`;

            setValue(items[clampedIndex]);
            updateSelectedVisual(wheelInner, items, items[clampedIndex]);

            // Haptic feedback if available
            if (navigator.vibrate) {
                navigator.vibrate(5);
            }

            window.setTimeout(() => {
                wheelInner.style.transition = 'none';
            }, 200);
        }

        function handleMomentum() {
            if (Math.abs(velocity) < 0.5) {
                snapToNearest();
                return;
            }

            velocity *= 0.95; // Friction
            currentOffset += velocity;

            // Clamp offset
            const minOffset = -(items.length - 1) * ITEM_HEIGHT;
            const maxOffset = 0;
            currentOffset = Math.max(minOffset, Math.min(maxOffset, currentOffset));

            wheelInner.style.transform = `translateY(${currentOffset}px)`;

            animationFrame = window.requestAnimationFrame(handleMomentum);
        }

        // Touch events
        wheelContainer.addEventListener(
            'touchstart',
            e => {
                if (animationFrame) {
                    window.cancelAnimationFrame(animationFrame);
                }
                isDragging = true;
                startY = e.touches[0].clientY;
                currentOffset = getOffset();
                lastY = startY;
                lastTime = Date.now();
                velocity = 0;
                wheelInner.style.transition = 'none';
            },
            { passive: true }
        );

        wheelContainer.addEventListener(
            'touchmove',
            e => {
                if (!isDragging) {
                    return;
                }

                const currentY = e.touches[0].clientY;
                const delta = currentY - startY;
                const now = Date.now();

                // Calculate velocity
                const timeDelta = now - lastTime;
                if (timeDelta > 0) {
                    velocity = ((currentY - lastY) / timeDelta) * 16; // Normalize to ~60fps
                }
                lastY = currentY;
                lastTime = now;

                // Apply offset with bounds
                let newOffset = currentOffset + delta;
                const minOffset = -(items.length - 1) * ITEM_HEIGHT;
                const maxOffset = 0;

                // Rubber band effect at edges
                if (newOffset > maxOffset) {
                    newOffset = maxOffset + (newOffset - maxOffset) * 0.3;
                } else if (newOffset < minOffset) {
                    newOffset = minOffset + (newOffset - minOffset) * 0.3;
                }

                wheelInner.style.transform = `translateY(${newOffset}px)`;
            },
            { passive: true }
        );

        wheelContainer.addEventListener(
            'touchend',
            () => {
                if (!isDragging) {
                    return;
                }
                isDragging = false;
                currentOffset = getOffset();

                if (Math.abs(velocity) > 2) {
                    handleMomentum();
                } else {
                    snapToNearest();
                }
            },
            { passive: true }
        );

        // Click on item to select
        wheelInner.addEventListener('click', e => {
            const item = e.target.closest('.picker-wheel-item:not(.picker-padding)');
            if (item) {
                const value = parseInt(item.dataset.value, 10);
                scrollToValue(wheelInner, items, value);
                setValue(value);
                updateSelectedVisual(wheelInner, items, value);
            }
        });
    }

    // Initialize
    const kgItems = generateKgItems();
    const decimalItems = generateDecimalItems();

    populateWheel(kgWheel, kgItems, selectedKg);
    populateWheel(decimalWheel, decimalItems, selectedDecimal);

    setupWheelInteraction(
        document.getElementById('weight-kg-wheel'),
        kgWheel,
        kgItems,
        () => selectedKg,
        val => {
            selectedKg = val;
        }
    );

    setupWheelInteraction(
        document.getElementById('weight-decimal-wheel'),
        decimalWheel,
        decimalItems,
        () => selectedDecimal,
        val => {
            selectedDecimal = val;
        }
    );

    // Open picker
    function openPicker() {
        // Load current value if set
        const currentValue = parseFloat(hiddenInput.value);
        if (!isNaN(currentValue) && currentValue > 0) {
            selectedKg = Math.floor(currentValue);
            selectedDecimal = Math.round((currentValue - selectedKg) * 10);
        }

        // Update wheels
        scrollToValue(kgWheel, kgItems, selectedKg);
        scrollToValue(decimalWheel, decimalItems, selectedDecimal);
        updateSelectedVisual(kgWheel, kgItems, selectedKg);
        updateSelectedVisual(decimalWheel, decimalItems, selectedDecimal);

        overlay.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    // Close picker
    function closePicker() {
        overlay.classList.add('hidden');
        document.body.style.overflow = '';
    }

    // Confirm selection
    function confirmSelection() {
        const value = selectedKg + selectedDecimal / 10;
        hiddenInput.value = value.toFixed(1);
        display.textContent = `${selectedKg},${selectedDecimal} kg`;
        trigger.dataset.empty = 'false';
        closePicker();

        // Trigger change event for auto-save
        hiddenInput.dispatchEvent(new Event('change', { bubbles: true }));
    }

    // Event listeners
    trigger.addEventListener('click', openPicker);
    cancelBtn.addEventListener('click', closePicker);
    confirmBtn.addEventListener('click', confirmSelection);

    // Close on backdrop click
    overlay.addEventListener('click', e => {
        if (e.target === overlay) {
            closePicker();
        }
    });

    // Close on escape key
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && !overlay.classList.contains('hidden')) {
            closePicker();
        }
    });

    // Public method to set value programmatically
    return {
        setValue: value => {
            if (value && !isNaN(value)) {
                const kg = Math.floor(value);
                const decimal = Math.round((value - kg) * 10);
                selectedKg = kg;
                selectedDecimal = decimal;
                hiddenInput.value = value.toFixed(1);
                display.textContent = `${kg},${decimal} kg`;
                trigger.dataset.empty = 'false';
            } else {
                hiddenInput.value = '';
                display.textContent = '-- kg';
                trigger.dataset.empty = 'true';
            }
        },
        getValue: () => {
            const val = parseFloat(hiddenInput.value);
            return isNaN(val) ? null : val;
        }
    };
}
