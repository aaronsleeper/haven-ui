# Task: Patient Meals — Swap Trailing Icon Button (PAT-MEALS-05)

_Generated: 2026-03-13_
_App: patient_

---

## Scope Classification

**Work type:** App only — restructure swap action from inline card content to trailing icon button. No new component classes. Modifies `.meal-card-swap` CSS and `.meal-card` HTML structure only.

**Existing classes being modified:**
- `.meal-card-swap` — restyle as a compact trailing icon button
- `.meal-card` — restructure flex layout to place swap icon in right gutter

**Files touched:**
- `src/styles/tokens/components.css` — `.meal-card-swap` block
- `apps/patient/meals/index.html` — all 5 meal card instances (not the detail sheet)

---

## Pre-Build Audit

Before writing any code, the agent must:
1. Read the `.meal-card`, `.meal-card-body`, `.meal-card-swap`, `.meal-card-img`, `.btn-icon` blocks in `src/styles/tokens/components.css` — confirm exact current content of each
2. Read `apps/patient/meals/index.html` — confirm exact current HTML structure of one meal card in full
3. Note the current flex structure: `.meal-card` > `.meal-card-img` + `.meal-card-body` (which contains day, name, tags, swap button)

---

## Restructure — Swap as trailing icon button

**Design intent:** Move the swap action out of `.meal-card-body` and into a dedicated right-gutter column. The card reads as three columns: `[image] [day + name + tags] [swap icon]`. The swap icon is vertically centered in the card, spatially adjacent to the item it acts on, and visually distinct from the card's content.

### New card structure (HTML)

The outer `.meal-card` is already `display: flex; align-items: start`. Change it to `items-center` to vertically center the three columns, then restructure each card as:

```html
<div class="meal-card">
  <div class="meal-card-img">...</div>
  <div class="meal-card-body">
    <p class="meal-card-day">...</p>
    <p class="meal-card-name">...</p>
    <div class="meal-card-tags">...</div>
    <!-- swap button REMOVED from here -->
  </div>
  <button class="meal-card-swap"
          aria-label="Swap [Meal Name]"
          data-open-swap
          data-meal="[day]">
    <i class="fa-solid fa-shuffle" aria-hidden="true"></i>
  </button>
</div>
```

The agent must apply this structure to all 5 meal cards in the meal list. The `aria-label` must retain the meal-specific name (e.g., `aria-label="Swap Chicken Verde Rice Bowl"`) since there is no visible text label.

**Do not restructure the swap button inside `#sheet-detail`.** That button is `.btn-outline w-full` and should remain as-is.

### CSS changes in `src/styles/tokens/components.css`

**1. Update `.meal-card`** — change `items-start` to `items-center`:

The current block uses `@apply flex items-start gap-3 ...`. Change to `items-center`:

```css
.meal-card {
  @apply flex items-center gap-3 bg-white border border-gray-200 rounded-xl p-3 shadow-2xs;
  @apply dark:bg-neutral-900 dark:border-neutral-700;
  @apply hover:bg-gray-50 transition-colors;
  background-color: white !important;
}

.meal-card:hover {
  background-color: var(--color-gray-50) !important;
}
```

**2. Replace `.meal-card-swap`** — restyle as a compact icon-only button in the right gutter:

```css
.meal-card-swap {
  @apply flex-shrink-0 flex items-center justify-center;
  @apply size-9 rounded-lg text-gray-400;
  @apply hover:text-gray-600 hover:bg-gray-100;
  @apply focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2;
  @apply dark:text-neutral-500 dark:hover:text-neutral-300 dark:hover:bg-neutral-800;
  background: transparent !important;
  border: none !important;
  cursor: pointer;
}
```

This is visually equivalent to `.btn-icon` but scoped to `.meal-card-swap` so it stays decoupled from any future `.btn-icon` changes and carries its own `flex-shrink-0` to prevent the gutter from collapsing.

**3. Update `.meal-card-body`** — add `flex-1 min-w-0` to ensure it takes remaining space between image and swap icon:

The current block already has `@apply flex flex-col gap-1 flex-1 min-w-0`. Confirm this is present — no change needed if it is.

### Icon sizing

The shuffle icon inside `.meal-card-swap` should be `text-base` (16px). Do not add a size class to the `<i>` — let it inherit from the button's default font size. The button is `size-9` (36px square) which gives adequate tap target on mobile.

---

## Verification Checklist

- [ ] Verified at `http://localhost:5173/apps/patient/meals/index.html?state=confirmed`
- [ ] Each meal card shows: image | day/name/tags | shuffle icon (right gutter)
- [ ] Shuffle icon is vertically centered with the card content
- [ ] Shuffle icon has adequate tap target (min 36px square)
- [ ] Clicking the shuffle icon opens the swap sheet (same behavior as before)
- [ ] `aria-label` on each swap button retains the meal-specific name
- [ ] `.meal-card-body` has no swap button inside it on any of the 5 cards
- [ ] Detail sheet swap button (`#sheet-detail`) is unchanged
- [ ] Unconfirmed state also renders correctly (visit without `?state=confirmed`)
- [ ] No utility chains added to HTML
- [ ] No inline `style=` attributes added

---

## Commit

```bash
git add -A
git commit -m "refactor(patient/meals): swap action to trailing icon button"
```
