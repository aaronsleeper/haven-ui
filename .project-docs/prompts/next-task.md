# Task: Patient Meals Confirmed Page — Swap Button Affordance, Alert Padding, Image Inset Border (PAT-MEALS-04)

_Generated: 2026-03-13_
_App: patient_

---

## Scope Classification

**Work type:** Both — one new CSS modifier for `.meal-card-img`, targeted changes to `.meal-card-swap` to repromote it to a visible button, and an HTML tweak to the alert wrapper.

**Existing classes being modified:**
- `.meal-card-swap` — repromote from text-link to visible outline button with icon
- `.meal-card-img` — add `::after` pseudo-element for inset image border

**New classes added:**
- None. The swap button will use existing `.btn-outline .btn-sm` classes applied via HTML. The image overlay is a `::after` rule added to the existing `.meal-card-img` block.

**Files touched:**
- `src/styles/tokens/components.css` — two targeted edits
- `apps/patient/meals/index.html` — swap button HTML updated on all 5 meal cards + the detail sheet

---

## Pre-Build Audit

Before writing any code, the agent must:
1. Read the `.meal-card-swap`, `.meal-card-img`, `.meal-card`, `.btn-outline`, `.btn-sm` blocks in `src/styles/tokens/components.css` — confirm exact current content
2. Read `apps/patient/meals/index.html` — confirm current swap button markup on all 5 meal cards and inside `#sheet-detail`
3. Count how many `.meal-card-swap` buttons exist (should be 5 meal list + 1 in detail sheet = 6 total)

---

## Fix 1 — Swap button: text-link → outline button with icon

**Problem:** `.meal-card-swap` renders as a bare text link. It has no border, no background, and no icon. On a confirmed meals screen it is the only interactive action per card, but it reads like secondary metadata. Users scanning the list do not identify it as tappable.

**Solution:** Update `.meal-card-swap` in `components.css` to inherit from the existing `.btn-outline .btn-sm` pattern, and add a shuffle icon in HTML on every instance.

### CSS change in `src/styles/tokens/components.css`

Replace the current `.meal-card-swap` block:

```css
.meal-card-swap {
  @apply text-sm text-primary-600 font-medium text-left mt-1;
  @apply hover:text-primary-700 dark:text-primary-400;
  background: none !important;
  border: none !important;
  padding: 0 !important;
  cursor: pointer;
  box-shadow: none !important;
}
```

With:

```css
.meal-card-swap {
  @apply inline-flex items-center gap-x-1.5 py-1.5 px-3 text-xs font-medium mt-1.5;
  @apply bg-transparent border border-gray-300 text-gray-700 rounded-lg;
  @apply hover:bg-gray-50;
  @apply focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2;
  @apply dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800;
  cursor: pointer;
}
```

This is semantically equivalent to `.btn-outline.btn-sm` but scoped to `.meal-card-swap` so it can carry its own adjustments (smaller padding, mt-1.5 for card spacing) without fighting the base button reset.

### HTML change in `apps/patient/meals/index.html`

On every `.meal-card-swap` button (5 in the meal list, 1 inside `#sheet-detail`), add a shuffle icon before the label text:

```html
<button class="meal-card-swap" ...>
  <i class="fa-solid fa-shuffle" aria-hidden="true"></i>
  <span data-i18n-en="Swap meal" data-i18n-es="Cambiar comida">Swap meal</span>
</button>
```

The agent must update all 6 instances. The `aria-label` on the button already describes the action — no additional ARIA needed on the icon.

For the detail sheet button (`#sheet-detail`), the current markup is `.btn-outline w-full`. Update it to also include the icon:

```html
<button class="btn-outline w-full mt-4" data-open-swap>
  <i class="fa-solid fa-shuffle" aria-hidden="true"></i>
  <span data-i18n-en="Swap this meal" data-i18n-es="Cambiar esta comida">Swap this meal</span>
</button>
```

---

## Fix 2 — Alert padding: align with adjacent card content

**Problem:** The `.alert.alert-success` and `.alert.alert-warning` banners use `mx-4 mb-4` positioning inside `.mobile-shell`. The internal `p-4` padding means the alert icon + text start 16px from the alert's left edge, which is 16px (mx-4) + 16px (p-4) = 32px from the shell edge. The `.meal-card` elements below also use `px-4` at the list wrapper level and then have `p-3` internal padding, making their content start at a different visual indent. The alert reads as floating outside the card grid's column.

**Fix:** The simplest fix that keeps HTML clean is to tighten the alert's horizontal position so its left text edge visually aligns with card text. Since the cards use `p-3` (12px) internal padding after a `px-4` (16px) outer, the card text starts at ~28px. The alert at `mx-4 p-4` has its icon at 32px. The gap is small but perceptible.

Update the HTML alert wrappers (both `.banner-unconfirmed` and `.banner-confirmed`) to use `px-3` instead of the default `p-4` on internal spacing. The cleanest approach without altering `.alert` globally is to add a modifier class.

**Add to `src/styles/tokens/components.css`** (append to the ALERTS section):

```css
/* Tighter horizontal padding for alerts used inside .mobile-shell card lists */
.alert-inset {
  @apply px-3;
}
```

**Update `apps/patient/meals/index.html`** — add `alert-inset` to both alert divs:

```html
<div class="alert alert-warning alert-inset rounded-xl mx-4 mb-4 banner-unconfirmed" role="alert">
  ...
</div>

<div class="alert alert-success alert-inset rounded-xl mx-4 mb-4 banner-confirmed" role="alert">
  ...
</div>
```

---

## Fix 3 — Image inset border: contrast aid for light-background photos

**Problem:** Some food photos have a light background that bleeds into the white card surface, making images appear borderless and undefined.

**Solution:** Add a `::after` pseudo-element to `.meal-card-img` that overlays a 1px dark border at low opacity with `mix-blend-mode: multiply`. This is invisible on dark images (multiply with near-black is no-op on dark pixels) and provides a subtle definition line on light images.

**Add to the `.meal-card-img` block in `src/styles/tokens/components.css`:**

Current `.meal-card-img` block:

```css
.meal-card-img {
  @apply size-20 rounded-lg overflow-hidden object-cover shrink-0 bg-stone-100;
}
```

Replace with:

```css
.meal-card-img {
  @apply size-20 rounded-lg overflow-hidden object-cover shrink-0 bg-stone-100;
  position: relative;
}

.meal-card-img::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  border: 1px solid rgba(0, 0, 0, 0.10);
  mix-blend-mode: multiply;
  pointer-events: none;
}
```

The `border-radius: inherit` ensures the overlay respects the `rounded-lg` applied by Tailwind. `position: relative` on the parent is needed for `inset: 0` to work correctly.

Note: `.meal-card-img` already has `overflow-hidden` which clips the image, but the `::after` must be positioned inside the element (not on the img tag) to avoid the clip cutting the border. The structure is correct as written.

---

## Verification Checklist

- [ ] Verified at `http://localhost:5173/apps/patient/meals/index.html?state=confirmed`
- [ ] Swap button on each meal card renders as a bordered outline button with shuffle icon
- [ ] Swap button label still translates to Spanish when language is toggled
- [ ] Alert icon + text left edge visually aligns with card content below
- [ ] Food images show a subtle 1px inset border on light-background photos
- [ ] Dark-background images are not visibly affected by the inset border
- [ ] No utility chains in HTML (layout utilities OK)
- [ ] No inline `style=` attributes added
- [ ] `.alert-inset` added to `components.css` with dark mode variants if needed
- [ ] Both state variants (unconfirmed and confirmed) tested at `?state=confirmed` and without the param

---

## Commit

```bash
git add -A
git commit -m "fix(patient/meals): swap affordance, alert alignment, image inset border"
```
