# New Component: Feedback Rating Card

## Purpose
Large tap-friendly rating option card for the meal feedback screen. Three instances per row (Good / Okay / Not good). Icon above label. Selected state: primary border + tinted background.

## Used In
- CARE-02: overall rating (Section 1), replaces generic `.radio-label` which is horizontal-layout and not tall enough for comfortable tapping.

## Preline Base
None — radio input styled as a large card.

## Proposed Semantic Class
`.feedback-rating-card`

## Implementation Notes

### HTML Structure
```html
<fieldset class="feedback-rating-fieldset">
  <legend data-i18n-en="Overall, how were your meals this week?" data-i18n-es="En general, ¿cómo estuvieron tus comidas esta semana?">
    Overall, how were your meals this week?
  </legend>
  <div class="grid grid-cols-3 gap-2">
    <label class="feedback-rating-card">
      <input type="radio" name="overall-rating" value="good" class="sr-only">
      <i class="fa-solid fa-thumbs-up text-2xl"></i>
      <span data-i18n-en="Good" data-i18n-es="Buenas">Good</span>
    </label>
    <label class="feedback-rating-card">
      <input type="radio" name="overall-rating" value="okay" class="sr-only">
      <i class="fa-solid fa-face-meh text-2xl"></i>
      <span data-i18n-en="Okay" data-i18n-es="Regular">Okay</span>
    </label>
    <label class="feedback-rating-card">
      <input type="radio" name="overall-rating" value="bad" class="sr-only">
      <i class="fa-solid fa-thumbs-down text-2xl"></i>
      <span data-i18n-en="Not good" data-i18n-es="No buenas">Not good</span>
    </label>
  </div>
</fieldset>
```

### @apply Definition
```css
.feedback-rating-card {
  @apply flex flex-col items-center justify-center gap-2 p-3 bg-white border border-gray-200 rounded-xl cursor-pointer;
  min-height: 80px;
  @apply hover:border-primary-300 hover:bg-primary-50;
  @apply dark:bg-neutral-900 dark:border-neutral-700;
}

.feedback-rating-card:has(input:checked) {
  @apply border-primary-500 bg-primary-50;
  @apply dark:border-primary-600 dark:bg-primary-900/20;
}

.feedback-rating-card span {
  @apply text-xs font-medium text-gray-700;
  @apply dark:text-neutral-300;
}

.feedback-rating-card i {
  @apply text-gray-400;
}

.feedback-rating-card:has(input:checked) i {
  @apply text-primary-600;
  @apply dark:text-primary-400;
}
```

### Fieldset Override
The feedback rating fieldset suppresses the default fieldset border/padding:
```css
.feedback-rating-fieldset {
  @apply border-0 p-0 space-y-2;
}
```

### States
- Default: white border, gray icon
- Hover: light primary border + tinted bg
- Selected (`:has(input:checked)`): primary border + tinted bg + primary icon color
- The `sr-only` radio input remains accessible to screen readers

### Dark Mode
As specified above.

### Accessibility
- Radio input is `sr-only` but present in DOM — screen readers read it correctly
- Icon + text label on every option — never icon alone
- Each `<label>` wraps its input — tap target is the full card

## Pattern Library
[ ] Component file needed: `pattern-library/components/patient-feedback-rating.html`
[ ] `COMPONENT-INDEX.md` row needed

## Priority
Required for launch
