# New Component: Meal Delivery Card

## Purpose
Horizontal card displaying a single scheduled meal delivery: photo left, name/day/tags right, optional swap link. Used in the weekly meals list. Also used in the swap-meal bottom sheet (without the swap link).

Distinct from `meal-option-card` (agentic browse + select for chat-pane meal-ordering). This card represents a confirmed delivery slot; the option card represents a candidate before selection.

## Used In
- MEALS-01: stacked list of weekly meals, swap bottom sheet

## Preline Base
None.

## Proposed Semantic Classes
- `.meal-delivery-card` — outer card wrapper
- `.meal-delivery-card-img` — photo thumbnail
- `.meal-delivery-card-body` — right-side text stack
- `.meal-delivery-card-name` — meal name
- `.meal-delivery-card-day` — day label
- `.meal-delivery-card-tags` — tag row wrapper
- `.meal-delivery-card-swap` — swap link (text link style)
- `.meal-delivery-card.is-swapped` — state after swap, shows "Swapped" badge

## Implementation Notes

### HTML Structure
```html
<div class="meal-delivery-card">
  <img
    class="meal-delivery-card-img"
    src="/src/assets/meals/chicken-verde-rice.jpg"
    alt="Chicken verde with cilantro rice and black beans"
    data-i18n-en="Chicken verde with cilantro rice and black beans"
    data-i18n-es="Pollo verde con arroz de cilantro y frijoles negros"
  >
  <div class="meal-delivery-card-body">
    <p class="meal-delivery-card-name" data-i18n-en="Chicken Verde" data-i18n-es="Pollo Verde">Chicken Verde</p>
    <p class="meal-delivery-card-day" data-i18n-en="Monday" data-i18n-es="Lunes">Monday</p>
    <div class="meal-delivery-card-tags">
      <span class="badge badge-info badge-pill" data-i18n-en="Low sodium" data-i18n-es="Bajo en sodio">Low sodium</span>
      <span class="badge badge-secondary badge-pill" data-i18n-en="Diabetic-friendly" data-i18n-es="Apto para diabéticos">Diabetic-friendly</span>
    </div>
    <button class="meal-delivery-card-swap" aria-label="Swap Chicken Verde">
      <span data-i18n-en="Swap meal" data-i18n-es="Cambiar comida">Swap meal</span>
    </button>
  </div>
</div>
```

### Image Fallback
If the image file is missing, the wrapper shows a `bg-stone-100` placeholder. Do NOT show a broken image icon.
```css
.meal-delivery-card-img {
  object-fit: cover;
}
/* In JS or inline, hide broken images and show bg */
```

### @apply Definition
```css
.meal-delivery-card {
  @apply flex items-start gap-3 bg-white border border-gray-200 rounded-xl p-3 shadow-2xs;
  @apply dark:bg-neutral-900 dark:border-neutral-700;
}

.meal-delivery-card-img {
  @apply size-20 rounded-lg object-cover shrink-0 bg-stone-100;
}

.meal-delivery-card-body {
  @apply flex flex-col gap-1 flex-1 min-w-0;
}

.meal-delivery-card-name {
  @apply text-sm font-medium text-gray-900 leading-snug;
  @apply dark:text-neutral-100;
}

.meal-delivery-card-day {
  @apply text-xs text-gray-500;
  @apply dark:text-neutral-400;
}

.meal-delivery-card-tags {
  @apply flex flex-wrap gap-1 mt-0.5;
}

.meal-delivery-card-swap {
  @apply text-sm text-primary-600 font-medium text-left mt-1;
  @apply hover:text-primary-700 dark:text-primary-400;
}

.meal-delivery-card.is-swapped .meal-delivery-card-swap {
  display: none;
}
```

### Variants
- Without swap link: omit the `<button class="meal-delivery-card-swap">` element (used in swap bottom sheet)
- Swapped state: add `.is-swapped` to `.meal-delivery-card`; a `.badge-success` "Swapped" label replaces the swap button

### States
- Default: as shown
- Swapped: `.is-swapped` — swap button hidden, "Swapped" badge shown
- No image: `bg-stone-100` on `.meal-delivery-card-img`

### Dark Mode
As specified in `@apply` definitions above.

### Responsive Behavior
Card is full width of its container (inside `px-4` scroll area). Image is fixed at `size-20`; text truncates if needed.

### Accessibility
- `alt` text on image describes the dish (not "meal photo")
- Swap button has `aria-label="Swap [meal name]"` to distinguish multiple instances on the page
- Diet tag badges: text labels always present (no icon-only tags)

## Pattern Library
[x] Component file: `pattern-library/components/meal-delivery-card.html`
[x] `COMPONENT-INDEX.md` row added

## Priority
Required for launch
