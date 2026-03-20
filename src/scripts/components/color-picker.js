/**
 * Color Picker — swatch selection, active state, custom color input
 *
 * Attributes:
 *   [data-color-picker]        — root wrapper
 *   [data-color-preview]       — preview container (optional)
 *   [data-color-custom-trigger]— custom swatch label
 *   [data-color-custom-input]  — native input[type=color] inside custom swatch
 *   [data-color-name]          — human-readable name on radio inputs (optional)
 */

(function () {
  'use strict';

  function initColorPicker(picker) {
    var swatches = picker.querySelectorAll('.color-picker-swatch, .color-picker-swatch-sm');
    var preview = picker.querySelector('[data-color-preview]');
    var customTrigger = picker.querySelector('[data-color-custom-trigger]');
    var customInput = picker.querySelector('[data-color-custom-input]');

    // Handle swatch click/change
    swatches.forEach(function (swatch) {
      var radio = swatch.querySelector('input[type="radio"]');
      if (!radio) return;

      radio.addEventListener('change', function () {
        // Remove active from all swatches (including custom)
        swatches.forEach(function (s) {
          s.classList.remove('active');
          var check = s.querySelector('.fa-check');
          if (check) check.remove();
        });
        if (customTrigger) {
          customTrigger.classList.remove('active');
        }

        // Set active on current
        swatch.classList.add('active');

        // Add check icon
        var icon = document.createElement('i');
        icon.className = 'fa-solid fa-check color-picker-check';
        swatch.appendChild(icon);

        // Update preview if present
        updatePreview(picker, preview, radio.value, radio.dataset.colorName);
      });
    });

    // Custom color trigger
    if (customTrigger && customInput) {
      customTrigger.addEventListener('click', function (e) {
        // Prevent if disabled
        if (picker.classList.contains('color-picker-disabled')) return;
        customInput.click();
      });

      customInput.addEventListener('input', function () {
        var color = customInput.value;

        // Remove active from all swatches
        swatches.forEach(function (s) {
          s.classList.remove('active');
          var check = s.querySelector('.fa-check');
          if (check) check.remove();
        });

        // Uncheck all radios
        swatches.forEach(function (s) {
          var r = s.querySelector('input[type="radio"]');
          if (r) r.checked = false;
        });

        // Style the custom trigger as active with the selected color
        customTrigger.classList.add('active');
        customTrigger.style.backgroundColor = color;
        customTrigger.style.borderColor = color;
        customTrigger.style.color = color;

        // Replace plus icon with check
        var plusIcon = customTrigger.querySelector('.fa-plus');
        if (plusIcon) {
          plusIcon.className = 'fa-solid fa-check text-white text-xs';
        }

        // Update preview
        updatePreview(picker, preview, color, 'Custom');
      });
    }
  }

  function updatePreview(picker, preview, color, name) {
    if (!preview) return;
    var dot = preview.querySelector('.color-picker-preview-dot');
    var value = preview.querySelector('.color-picker-value');
    if (dot) dot.style.backgroundColor = color;
    if (value) {
      var label = name ? name + ' (' + color.toUpperCase() + ')' : color.toUpperCase();
      value.textContent = label;
    }
  }

  // Init all color pickers on the page
  function initAll() {
    document.querySelectorAll('[data-color-picker]').forEach(initColorPicker);
  }

  // Run on DOMContentLoaded or immediately if already loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
})();
