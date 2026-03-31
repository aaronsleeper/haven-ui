# New Component: Assessment Slider

## Purpose
Styled range input for visual analog scale questions in assessments (e.g., pain level 0–10, energy level). Wraps native `<input type="range">` with Haven theme colors and accessible labels.

## Used In
- assess-03 (Assessment Question): slider question type

## Preline Base
Pure Tailwind + raw CSS implementation. No Preline JS. Native `<input type="range">` with vendor-prefixed pseudo-elements for styling.

## Proposed Semantic Classes

### `.assess-slider`
Wrapper container for the slider, labels, and value display.

### `.assess-slider-track`
The `<input type="range">` element itself (styled via CSS pseudo-elements).

### `.assess-slider-labels`
Container for min/max endpoint labels.

### `.assess-slider-value`
Current value display above or beside the slider.

## Implementation Notes

### HTML Structure
```html
<div class="assess-slider">
  <p class="assess-slider-value" aria-live="polite">5</p>
  <input
    type="range"
    class="assess-slider-track"
    min="0"
    max="10"
    value="5"
    step="1"
    aria-label="Pain level"
    aria-valuemin="0"
    aria-valuemax="10"
    aria-valuenow="5"
  >
  <div class="assess-slider-labels">
    <span data-i18n-en="No pain" data-i18n-es="Sin dolor">No pain</span>
    <span data-i18n-en="Worst pain" data-i18n-es="Peor dolor">Worst pain</span>
  </div>
</div>
```

### @apply Definition
```css
.assess-slider {
  @apply block py-4;
}

.assess-slider-value {
  @apply text-center text-2xl font-semibold text-teal-700 mb-4;
  @apply dark:text-teal-400;
}

.assess-slider-track {
  @apply block w-full h-2 rounded-full appearance-none cursor-pointer;
  background: linear-gradient(to right, var(--color-teal-300) 0%, var(--color-teal-300) var(--slider-fill, 50%), var(--color-sand-200) var(--slider-fill, 50%), var(--color-sand-200) 100%);
}

/* Webkit thumb */
.assess-slider-track::-webkit-slider-thumb {
  @apply appearance-none rounded-full bg-teal-600 border-4 border-white shadow-md;
  width: 44px;
  height: 44px;
  cursor: pointer;
}

/* Firefox thumb */
.assess-slider-track::-moz-range-thumb {
  @apply rounded-full bg-teal-600 border-4 border-white shadow-md;
  width: 44px;
  height: 44px;
  cursor: pointer;
}

.assess-slider-track:focus {
  @apply outline-none;
}

.assess-slider-track:focus::-webkit-slider-thumb {
  @apply ring-2 ring-teal-300;
}

.assess-slider-labels {
  @apply flex justify-between mt-2 text-xs text-sand-400;
  @apply dark:text-neutral-500;
}
```

### JS Note
A small script updates `--slider-fill` CSS variable on input to show the filled portion of the track:
```js
// src/scripts/components/assess-slider.js
document.querySelectorAll('.assess-slider-track').forEach(slider => {
  const update = () => {
    const pct = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
    slider.style.setProperty('--slider-fill', pct + '%');
    const valueEl = slider.closest('.assess-slider').querySelector('.assess-slider-value');
    if (valueEl) valueEl.textContent = slider.value;
  };
  slider.addEventListener('input', update);
  update(); // initial
});
```

### States
- Default: thumb at initial value, track shows fill gradient
- Active/dragging: thumb moves, value updates in real-time
- Focus: teal ring around thumb
- No disabled state needed in v1

### Dark Mode
- Track background: `dark:var(--color-neutral-700)` for unfilled portion
- Thumb: `dark:bg-teal-500 dark:border-neutral-800`
- Value text: `dark:text-teal-400`
- Labels: `dark:text-neutral-500`

Note: The gradient background on `.assess-slider-track` uses CSS variables, so dark mode needs a media query override for the unfilled color. Use:
```css
@media (prefers-color-scheme: dark) {
  .assess-slider-track {
    background: linear-gradient(to right, var(--color-teal-500) 0%, var(--color-teal-500) var(--slider-fill, 50%), var(--color-neutral-700) var(--slider-fill, 50%), var(--color-neutral-700) 100%);
  }
}
```

### Responsive Behavior
Full-width within its container. Thumb is 44px for touch targets on all screen sizes.

### Accessibility
- Native `<input type="range">` — keyboard navigable with arrow keys
- `aria-label` describes what's being measured
- `aria-valuemin`, `aria-valuemax`, `aria-valuenow` updated by JS
- `aria-live="polite"` on value display for screen reader announcements
- 44px thumb exceeds WCAG touch target minimum
- Focus ring visible on keyboard navigation

## Pattern Library
- [ ] Component file needed: `pattern-library/components/patient-assess-slider.html`
- [ ] `COMPONENT-INDEX.md` row needed

## Priority
Required for launch.
