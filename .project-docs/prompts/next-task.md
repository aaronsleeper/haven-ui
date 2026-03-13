# Task: PAT-MEALS-05 Bug Fixes

_Generated: 2026-03-13_
_App: patient_

## Scope: SMALL — CSS edits only + one HTML markup fix

## Pre-Build Audit

Read before touching anything:

- `src/styles/tokens/components.css` — find `.meal-card-swap`, `.alert-inset`, `.mobile-i18n-toggle`
- `apps/patient/meals/index.html` — confirm swap button structure and i18n toggle markup

---

## Problem 1: Swap icon not visible

**Root cause:** `.meal-card-swap` uses `color: var(--color-gray-400)` but `--color-gray-400` is NOT defined in this project's token system (`colors.css` has no gray scale). The variable resolves to nothing; the icon is invisible.

**Fix in `src/styles/tokens/components.css`:**

Find and replace the entire `.meal-card-swap` block (and its hover/focus) with:

```css
.meal-card-swap {
	flex-shrink: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 2.25rem;
	height: 2.25rem;
	border-radius: 0.5rem;
	color: #9ca3af; /* gray-400 hardcoded — --color-gray-* not defined in token system */
	background: transparent !important;
	border: none !important;
	cursor: pointer;
	font-size: 0.875rem;
}

.meal-card-swap:hover {
	color: #4b5563; /* gray-600 */
	background-color: #f3f4f6 !important; /* gray-100 */
}

.meal-card-swap:focus {
	outline: 2px solid var(--color-primary-500);
	outline-offset: 2px;
}
```

---

## Problem 2: Alert padding still too wide

**Root cause:** `@apply px-3` loses to `p-4`'s `padding` shorthand in cascade.

**Fix in `src/styles/tokens/components.css`:**

Find `.alert-inset` and replace with:

```css
.alert-inset {
	padding-inline: 0.75rem !important;
}
```

---

## Problem 3: Language toggle renders as green pill

**Root cause:** The global `button` rule applies `border border-transparent` + focus ring, overriding `.mobile-i18n-toggle`'s intended bare-text appearance.

**Fix A — in `src/styles/tokens/components.css`:**

Find `.mobile-i18n-toggle` and replace with:

```css
.mobile-i18n-toggle {
	@apply inline-flex items-center gap-1.5 text-xs font-medium text-gray-600;
	@apply hover:text-gray-900 dark:text-neutral-400 dark:hover:text-neutral-200;
	@apply focus:outline-none;
	text-decoration: none;
	background: none !important;
	border: none !important;
	box-shadow: none !important;
	padding: 0 !important;
	cursor: pointer;
}
```

**Fix B — in `apps/patient/meals/index.html`:**

Inside the `#lang-dropdown-btn` button, set the children to this exact order (globe → label → chevron):

```html
<i
	class="fa-solid fa-globe text-gray-400"
	aria-hidden="true"
></i>
<span
	id="lang-label"
	data-i18n-en="English"
	data-i18n-es="Español"
	>English</span
>
<i
	class="fa-solid fa-chevron-down text-gray-400"
	style="font-size:10px"
	aria-hidden="true"
></i>
```

---

## Verification

Check at `http://localhost:5173/apps/patient/meals/index.html?state=confirmed`:

1. Each meal card shows a small shuffle icon in the right gutter (gray, ~14px)
2. The confirmed alert has tighter horizontal padding matching the card inset
3. The language toggle reads "English" as plain text with globe icon + small chevron — no green background, no pill shape

## Do NOT change

- Sheet swap button (`.btn-outline w-full`) inside `#sheet-swap` — leave as-is
- Any meal card HTML structure other than the i18n toggle
