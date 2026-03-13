# New Component: Meal Card

## Purpose
Horizontal card displaying a single meal: photo left, name/day/tags right, optional swap link. Used in the weekly meals list. Also used in the swap-meal bottom sheet (without the swap link).

## Used In
- MEALS-01: stacked list of weekly meals, swap bottom sheet

## Preline Base
None.

## Proposed Semantic Classes
- `.meal-card` — outer card wrapper
- `.meal-card-img` — photo thumbnail
- `.meal-card-body` — right-side text stack
- `.meal-card-name` — meal name
- `.meal-card-day` — day label
- `.meal-card-tags` — tag row wrapper
- `.meal-card-swap` — swap link (text link style)
- `.meal-card.is-swapped` — state after swap, shows "Swapped" badge

## Implementation Notes

### HTML Structure
```html
<div class="meal-card">
  <img
    class="meal-card-img"
    src="/src/assets/meals/chicken-verde-rice.jpg"
    alt="Chicken verde with cilantro rice and black beans"
    data-i18n-en="Chicken verde with cilantro rice and black beans"
    data-i18n-es="Pollo verde con arroz de cilantro y frijoles negros"
  >
  <div class="meal-card-body">
    <p class="meal-card-name" data-i18n-en="Chicken Verde" data-i18n-es="Pollo Verde">Chicken Verde</p>
    <p class="meal-card-day" data-i18n-en="Monday" data-i18n-es="Lunes">Monday</p>
    <div class="meal-card-tags">
      <span class="badge badge-info badge-pill" data-i18n-en="Low sodium" data-i18n-es="Bajo en sodio">Low sodium</span>
      <span class="badge badge-secondary badge-pill" data-i18n-en="Diabetic-friendly" data-i18n-es="Apto para diabéticos">Diabetic-friendly</span>
    </div>
    <button class="meal-card-swap" aria-label="Swap Chicken Verde">
      <span data-i18n-en="Swap meal" data-i18n-es="Cambiar comida">Swap meal</span>
    </button>
  </div>
</div>
```

### Image Fallback
If the image file is missing, the wrapper shows a `bg-stone-100` placeholder. Do NOT show a broken image icon.
```css
.meal-card-img {
  object-fit: cover;
}
/* In JS or inline, hide broken images and show bg */
```

### @apply Definition
```css
.meal-card {
  @apply flex items-start gap-3 bg-white border border-gray-200 rounded-xl p-3 shadow-2xs;
  @apply dark:bg-neutral-900 dark:border-neutral-700;
}

.meal-card-img {
  @apply size-20 rounded-lg object-cover shrink-0 bg-stone-100;
}

.meal-card-body {
  @apply flex flex-col gap-1 flex-1 min-w-0;
}

.meal-card-name {
  @apply text-sm font-medium text-gray-900 leading-snug;
  @apply dark:text-neutral-100;
}

.meal-card-day {
  @apply text-xs text-gray-500;
  @apply dark:text-neutral-400;
}

.meal-card-tags {
  @apply flex flex-wrap gap-1 mt-0.5;
}

.meal-card-swap {
  @apply text-sm text-primary-600 font-medium text-left mt-1;
  @apply hover:text-primary-700 dark:text-primary-400;
}

.meal-card.is-swapped .meal-card-swap {
  display: none;
}
```

### Variants
- Without swap link: omit the `<button class="meal-card-swap">` element (used in swap bottom sheet)
- Swapped state: add `.is-swapped` to `.meal-card`; a `.badge-success` "Swapped" label replaces the swap button

### States
- Default: as shown
- Swapped: `.is-swapped` — swap button hidden, "Swapped" badge shown
- No image: `bg-stone-100` on `.meal-card-img`

### Dark Mode
As specified in `@apply` definitions above.

### Responsive Behavior
Card is full width of its container (inside `px-4` scroll area). Image is fixed at `size-20`; text truncates if needed.

### Accessibility
- `alt` text on image describes the dish (not "meal photo")
- Swap button has `aria-label="Swap [meal name]"` to distinguish multiple instances on the page
- Diet tag badges: text labels always present (no icon-only tags)

## Pattern Library
[ ] Component file needed: `pattern-library/components/patient-meal-card.html`
[ ] `COMPONENT-INDEX.md` row needed

## Priority
Required for launch
