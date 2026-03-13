# New Component: Preference Image Card

## Purpose
Visual checkbox card for selecting cultural food preferences. Square image with label below. Tap to select/deselect. Multi-select; "No preference" is mutually exclusive with all others.

## Used In
- ONB-03: food preferences section (Section 2)
- PROFILE-01: meal preferences card (Card 2)

## Preline Base
None.

## Proposed Semantic Class
`.pref-image-card`

## Implementation Notes

### HTML Structure
```html
<label class="pref-image-card">
  <input type="checkbox" name="food-pref" value="latin-american" class="sr-only">
  <div class="pref-image-card-img-wrap">
    <img
      src="/src/assets/meals/pref-latin-american.jpg"
      alt="Latin American cuisine"
      data-i18n-en="Latin American cuisine"
      data-i18n-es="Cocina latinoamericana"
      class="pref-image-card-img"
    >
    <div class="pref-image-card-check">
      <i class="fa-solid fa-check text-white text-sm"></i>
    </div>
  </div>
  <span class="pref-image-card-label" data-i18n-en="Latin American" data-i18n-es="Latinoamericana">Latin American</span>
</label>
```

"No preference" option:
```html
<label class="pref-image-card pref-image-card-nopref">
  <input type="checkbox" name="food-pref" value="no-preference" class="sr-only" id="pref-none">
  <div class="pref-image-card-img-wrap pref-image-card-img-wrap-plain">
    <i class="fa-regular fa-circle-dot text-gray-300 text-3xl"></i>
  </div>
  <span class="pref-image-card-label" data-i18n-en="No preference" data-i18n-es="Sin preferencia">No preference</span>
</label>
```

### @apply Definition
```css
.pref-image-card {
  @apply flex flex-col items-center gap-2 cursor-pointer;
}

.pref-image-card-img-wrap {
  @apply relative w-full aspect-square rounded-lg overflow-hidden bg-stone-100 border-2 border-transparent;
  @apply transition-all;
}

.pref-image-card:has(input:checked) .pref-image-card-img-wrap {
  @apply border-primary-500;
}

.pref-image-card-img {
  @apply w-full h-full object-cover;
}

.pref-image-card-check {
  @apply absolute inset-0 flex items-center justify-center bg-primary-600/60 opacity-0 transition-opacity;
}

.pref-image-card:has(input:checked) .pref-image-card-check {
  @apply opacity-100;
}

.pref-image-card-label {
  @apply text-xs font-medium text-gray-700 text-center;
  @apply dark:text-neutral-300;
}

.pref-image-card:has(input:checked) .pref-image-card-label {
  @apply text-primary-600 dark:text-primary-400;
}

/* "No preference" plain variant */
.pref-image-card-img-wrap-plain {
  @apply flex items-center justify-center;
}
```

### JavaScript — Mutual Exclusivity (src/scripts/components/pref-image-cards.js)
```javascript
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    const noPref = document.getElementById('pref-none');
    const otherPrefs = document.querySelectorAll('input[name="food-pref"]:not(#pref-none)');
    if (!noPref) return;

    noPref.addEventListener('change', function () {
      if (this.checked) {
        otherPrefs.forEach(cb => cb.checked = false);
      }
    });

    otherPrefs.forEach(cb => {
      cb.addEventListener('change', function () {
        if (this.checked) noPref.checked = false;
      });
    });
  });
})();
```

### States
- Default: no border, no overlay
- Selected: primary border, checkmark overlay, label in primary color
- No image (missing file): `bg-stone-100` placeholder (image wrapper bg)

### Dark Mode
- Label: `dark:text-neutral-300`
- Selected label: `dark:text-primary-400`

### Responsive Behavior
Grid layout controlled by the parent screen: `grid grid-cols-2 gap-3`. Cards are square via `aspect-square`.

### Accessibility
- `sr-only` checkbox present for screen reader access
- `<label>` wraps checkbox — full card is the tap target
- Image `alt` text describes the cuisine in English and Spanish via `data-i18n-*`
- Selected state uses border + overlay — not color alone

## Pattern Library
[ ] Component file needed: `pattern-library/components/patient-pref-image-card.html`
[ ] `COMPONENT-INDEX.md` row needed

## Priority
Required for launch
