/**
 * Quantity Stepper — increment/decrement a numeric quantity with bounds
 * clamping, disabled-at-bounds state, and debounced screen-reader
 * announcements.
 *
 * Framework-agnostic vanilla ES module. Drop-in usable in vanilla HTML;
 * convertible to Angular/React/etc. by reading the contract below.
 *
 * Usage:
 *   <div class="quantity-stepper" data-quantity-stepper data-value="2"
 *        data-min="0" data-max="10">
 *     <button type="button" class="quantity-stepper-btn"
 *             data-action="decrement" aria-label="Decrease quantity">
 *       <i class="fa-solid fa-minus" aria-hidden="true"></i>
 *     </button>
 *     <span class="quantity-stepper-value" aria-hidden="true">2</span>
 *     <span class="sr-only" data-quantity-stepper-announce
 *           aria-live="polite" aria-atomic="true"></span>
 *     <button type="button" class="quantity-stepper-btn"
 *             data-action="increment" aria-label="Increase quantity">
 *       <i class="fa-solid fa-plus" aria-hidden="true"></i>
 *     </button>
 *   </div>
 *
 * Attributes:
 *   data-value    initial quantity (default: read from .quantity-stepper-value
 *                 textContent or 0)
 *   data-min      minimum quantity (default: 0)
 *   data-max      maximum quantity (default: Infinity — unbounded)
 *   data-step     increment/decrement unit (default: 1)
 *
 * Events:
 *   The stepper dispatches a 'quantity-change' CustomEvent on the stepper
 *   element when the value changes. Consumers (Angular, React, vanilla)
 *   listen with addEventListener:
 *
 *     stepperEl.addEventListener('quantity-change', (e) => {
 *       console.log(e.detail.value, e.detail.previousValue, e.detail.source);
 *     });
 *
 *   detail = { value, previousValue, source: 'click' | 'keyboard' | 'set' }
 *
 * Programmatic control:
 *   The element exposes a non-enumerable `_quantityStepper` reference with
 *   getValue() / setValue(n) for consumers that need to push state in:
 *
 *     stepperEl._quantityStepper.setValue(5);
 *
 *   setValue() emits 'quantity-change' with source: 'set'.
 *
 * Accessibility:
 *   - Buttons disable at bounds via the native `disabled` attribute.
 *   - Visible value cell carries aria-hidden="true" (sighted-only).
 *   - SR-only [data-quantity-stepper-announce] is a polite, atomic live
 *     region; updates debounced 400ms so rapid clicks announce the final
 *     settled value rather than each intermediate step. Resolves the chatty-
 *     announcement issue flagged in the 2026-05-12 a11y verdict.
 *   - Tab order is decrement → increment (natural DOM order); the value
 *     cell is non-interactive.
 */
(function () {
  var ANNOUNCE_DEBOUNCE_MS = 400;

  document.querySelectorAll('[data-quantity-stepper]').forEach(function (stepper) {
    var minAttr = stepper.getAttribute('data-min');
    var maxAttr = stepper.getAttribute('data-max');
    var stepAttr = stepper.getAttribute('data-step');
    var valueAttr = stepper.getAttribute('data-value');

    var min = minAttr !== null ? parseInt(minAttr, 10) : 0;
    var max = maxAttr !== null ? parseInt(maxAttr, 10) : Infinity;
    var step = stepAttr !== null ? parseInt(stepAttr, 10) : 1;

    var valueCell = stepper.querySelector('.quantity-stepper-value');
    var announceCell = stepper.querySelector('[data-quantity-stepper-announce]');
    var decrementBtn = stepper.querySelector('[data-action="decrement"]');
    var incrementBtn = stepper.querySelector('[data-action="increment"]');

    if (!valueCell || !decrementBtn || !incrementBtn) return;

    var value;
    if (valueAttr !== null) {
      value = parseInt(valueAttr, 10);
    } else {
      value = parseInt(valueCell.textContent, 10);
      if (isNaN(value)) value = 0;
    }
    // Clamp initial value to bounds before first render.
    value = Math.min(max, Math.max(min, value));

    var announceTimer = null;

    function render() {
      valueCell.textContent = String(value);
      decrementBtn.disabled = value <= min;
      incrementBtn.disabled = value >= max;
    }

    function announce() {
      if (!announceCell) return;
      if (announceTimer) clearTimeout(announceTimer);
      announceTimer = setTimeout(function () {
        // Force a re-announce even if value equals prior textContent: clear
        // then set so AT registers a change. (Some AT skip equal updates.)
        announceCell.textContent = '';
        // Microtask delay before setting; ensures AT sees the change.
        setTimeout(function () {
          announceCell.textContent = String(value);
        }, 10);
      }, ANNOUNCE_DEBOUNCE_MS);
    }

    function change(delta, source) {
      var previous = value;
      var next = Math.min(max, Math.max(min, value + delta));
      if (next === previous) return;
      value = next;
      render();
      announce();
      stepper.dispatchEvent(new CustomEvent('quantity-change', {
        bubbles: true,
        detail: { value: value, previousValue: previous, source: source || 'click' }
      }));
    }

    function setValue(n) {
      var previous = value;
      var next = Math.min(max, Math.max(min, parseInt(n, 10) || 0));
      if (next === previous) return;
      value = next;
      render();
      announce();
      stepper.dispatchEvent(new CustomEvent('quantity-change', {
        bubbles: true,
        detail: { value: value, previousValue: previous, source: 'set' }
      }));
    }

    decrementBtn.addEventListener('click', function () { change(-step, 'click'); });
    incrementBtn.addEventListener('click', function () { change(step, 'click'); });

    // Expose programmatic API on the element (non-enumerable; doesn't pollute
    // serialization).
    Object.defineProperty(stepper, '_quantityStepper', {
      value: {
        getValue: function () { return value; },
        setValue: setValue
      },
      enumerable: false,
      writable: false
    });

    render();
  });
})();
