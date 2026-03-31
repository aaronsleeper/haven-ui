# New Component: Emoji Scale

## Purpose
Horizontal row of 3–5 tappable circular options with emoji/icon and text label. Used for quick mood/satisfaction ratings in assessments. Extends the `:has(input:checked)` pattern established by `feedback-rating-card`.

## Used In
- assess-03 (Assessment Question): emoji-scale question type

## Preline Base
Pure Tailwind implementation. No Preline JS. Uses native radio inputs (sr-only) with label wrappers.

## Proposed Semantic Classes

### `.emoji-scale`
Horizontal flex container for the row of options.

### `.emoji-scale-option`
Individual circular tappable option. Wraps a hidden radio input.

### `.emoji-scale-icon`
The emoji or icon element inside the option.

### `.emoji-scale-label`
Text label below the icon.

## Implementation Notes

### HTML Structure
```html
<fieldset class="emoji-scale">
  <legend class="sr-only" data-i18n-en="How are you feeling?" data-i18n-es="¿Cómo se siente?">How are you feeling?</legend>

  <label class="emoji-scale-option">
    <input type="radio" name="mood" value="1" class="sr-only">
    <span class="emoji-scale-icon">😫</span>
    <span class="emoji-scale-label" data-i18n-en="Awful" data-i18n-es="Muy mal">Awful</span>
  </label>

  <label class="emoji-scale-option">
    <input type="radio" name="mood" value="2" class="sr-only">
    <span class="emoji-scale-icon">😔</span>
    <span class="emoji-scale-label" data-i18n-en="Not great" data-i18n-es="No muy bien">Not great</span>
  </label>

  <label class="emoji-scale-option">
    <input type="radio" name="mood" value="3" class="sr-only">
    <span class="emoji-scale-icon">😐</span>
    <span class="emoji-scale-label" data-i18n-en="Okay" data-i18n-es="Más o menos">Okay</span>
  </label>

  <label class="emoji-scale-option">
    <input type="radio" name="mood" value="4" class="sr-only">
    <span class="emoji-scale-icon">🙂</span>
    <span class="emoji-scale-label" data-i18n-en="Good" data-i18n-es="Bien">Good</span>
  </label>

  <label class="emoji-scale-option">
    <input type="radio" name="mood" value="5" class="sr-only">
    <span class="emoji-scale-icon">😊</span>
    <span class="emoji-scale-label" data-i18n-en="Great" data-i18n-es="Muy bien">Great</span>
  </label>
</fieldset>
```

### @apply Definition
```css
.emoji-scale {
  @apply flex justify-between gap-2 border-0 p-0;
}

.emoji-scale-option {
  @apply flex flex-col items-center justify-center gap-1 cursor-pointer;
  @apply rounded-2xl p-2;
  @apply hover:bg-sand-100;
  @apply dark:hover:bg-neutral-800;
  min-width: 56px;
  transition: background-color 0.15s ease;
}

.emoji-scale-option:has(input:checked) {
  @apply bg-primary-50 ring-2 ring-primary-500;
  @apply dark:bg-primary-900/20 dark:ring-primary-600;
}

.emoji-scale-icon {
  @apply block text-2xl;
  line-height: 1;
}

.emoji-scale-label {
  @apply text-xs text-sand-500 text-center;
  @apply dark:text-neutral-400;
  max-width: 64px;
}

.emoji-scale-option:has(input:checked) .emoji-scale-label {
  @apply text-primary-700 font-medium;
  @apply dark:text-primary-300;
}
```

### Variants
- **3-option:** `gap-4` override if only 3 options (more breathing room)
- **Icon variant:** Use `<i class="fa-solid fa-face-smile">` instead of emoji text for consistent rendering across platforms. FA icons: `fa-face-tired`, `fa-face-frown`, `fa-face-meh`, `fa-face-smile`, `fa-face-grin-stars`

### States
- Default: transparent bg, emoji visible, muted label
- Hover: light sand bg
- Selected (`:has(input:checked)`): primary-50 bg, primary ring, bold label
- No disabled state needed in v1

### Dark Mode
- Hover: `dark:hover:bg-neutral-800`
- Selected: `dark:bg-primary-900/20`, `dark:ring-primary-600`
- Label: `dark:text-neutral-400`, selected: `dark:text-primary-300`

### Responsive Behavior
Full-width row. Options flex evenly. On very narrow screens (320px), labels may wrap to 2 lines — `text-center` and `max-width: 64px` handle this.

### Accessibility
- Native `<input type="radio">` elements — keyboard navigable with arrow keys
- `<fieldset>` + `<legend class="sr-only">` for screen reader context
- Each option's label is the accessible name via the `<label>` wrapper
- Selected state communicated via `:checked` pseudo-class (screen readers announce "selected")
- Touch targets: 56px min-width, adequate padding for 44px+ target

## Pattern Library
- [ ] Component file needed: `pattern-library/components/patient-emoji-scale.html`
- [ ] `COMPONENT-INDEX.md` row needed

## Priority
Required for launch.
