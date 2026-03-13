# Task: Patient Meals — Language Dropdown + Swap Sheet Hover (PAT-MEALS-03)

_Generated: 2026-03-13_
_App: patient_

---

## Scope Classification

**Work type:** App only — no new component classes. Two targeted CSS changes to existing classes, plus HTML restructuring and a JS update within the meals page.

**Existing classes being modified:**
- `.meal-card` — add hover state
- `.mobile-i18n-bar` — markup structure change (button → hs-dropdown)
- `.mobile-i18n-toggle` — role changes to dropdown trigger; existing CSS stays as-is

**Files touched:**
- `src/styles/tokens/components.css` — 1 change
- `apps/patient/meals/index.html` — i18n bar + no other changes needed

---

## Pre-Build Audit

Before writing any code, the agent must:
1. Re-read the `.meal-card` block in `src/styles/tokens/components.css`
2. Re-read the `.hs-dropdown-menu` and `.hs-dropdown-item` blocks in `components.css`
3. Re-read the i18n bar section of `apps/patient/meals/index.html`
4. Re-read `src/scripts/components/i18n.js` to understand how the lang toggle currently works

---

## Fix 1 — Swap sheet item hover (CSS only)

**Problem:** `.meal-card` used as `<button>` elements in the swap sheet inherit the global `button` hover rule which applies a primary-colored background fill. This makes the hover state on swap options illegible — it turns them teal/primary instead of a subtle gray.

**Root cause:** Global `button` selector in `components.css` has no explicit hover color, but browser default + some Preline interaction creates the visible teal fill. `.meal-card` has no hover override of its own.

**Fix in `src/styles/tokens/components.css`:**

Add two lines to the `.meal-card` block — a `hover:bg-gray-50` to match the system's standard list-item hover pattern, and explicit background resets to suppress the inherited button behavior:

```css
.meal-card {
  @apply flex items-start gap-3 bg-white border border-gray-200 rounded-xl p-3 shadow-2xs;
  @apply dark:bg-neutral-900 dark:border-neutral-700;
  @apply hover:bg-gray-50 transition-colors;
  background-color: white !important; /* suppress button hover inheritance */
}

.meal-card:hover {
  background-color: var(--color-gray-50) !important;
}
```

This matches the hover behavior of `.activity-feed-row`, `.partner-list-item`, and `.alert-category-card` — the system standard for interactive list rows.

---

## Fix 2 — Language toggle → hs-dropdown (HTML only)

**Problem:** The current i18n toggle is a plain `<button>` that cycles between English/Spanish. It has an odd hover pill appearance (inherited button ring + hover bg). It also won't scale to 3+ languages.

**Decision:** Convert to `.hs-dropdown` with `.hs-dropdown-menu` + `.hs-dropdown-item` entries. Preline handles open/close. The existing `.hs-dropdown-menu` and `.hs-dropdown-item` semantic classes are already in `components.css` — no new CSS needed.

**Fix in `apps/patient/meals/index.html`:**

Replace the entire `<div class="mobile-i18n-bar">` block with:

```html
<!-- i18n bar -->
<div class="mobile-i18n-bar" role="navigation" aria-label="Language selection">
  <div class="hs-dropdown relative">
    <button
      id="lang-dropdown-btn"
      type="button"
      class="mobile-i18n-toggle"
      aria-haspopup="menu"
      aria-expanded="false"
      aria-label="Select language"
    >
      <span id="lang-label" data-i18n-en="English" data-i18n-es="Español">English</span>
      <i class="fa-solid fa-globe"></i>
    </button>

    <div
      class="hs-dropdown-menu"
      role="menu"
      aria-orientation="vertical"
      aria-labelledby="lang-dropdown-btn"
    >
      <button type="button" class="hs-dropdown-item" data-lang="en">
        <i class="fa-solid fa-globe text-xs"></i> English
      </button>
      <button type="button" class="hs-dropdown-item" data-lang="es">
        <i class="fa-solid fa-globe text-xs"></i> Español
      </button>
    </div>
  </div>
</div>
```

**Update `src/scripts/components/i18n.js`:**

The existing i18n script likely listens to `#lang-toggle` click. The agent must:
1. Read the current `i18n.js` in full
2. Update it to listen for clicks on `[data-lang]` buttons inside the dropdown instead of the toggle button itself
3. On click of a `[data-lang]` item: set the active language, update all `[data-i18n-en]` / `[data-i18n-es]` elements, update the `#lang-label` span text, and close the dropdown (remove `.open` from `.hs-dropdown` or call `HSDropdown.close()`)
4. Mark the active language item with `.active` class on the `.hs-dropdown-item`

The dropdown closes automatically via Preline on outside click. The agent should not re-implement that behavior.

---

## Verification Checklist

- [ ] Swap sheet options: hover shows `bg-gray-50`, no teal/primary fill
- [ ] Swap sheet options: border and text remain legible on hover
- [ ] Language toggle: renders as text + globe icon with no visible pill/ring at rest
- [ ] Language toggle: clicking opens a dropdown with English and Español options
- [ ] Selecting English or Español: updates all `data-i18n-*` text on the page
- [ ] Active language item in dropdown shows `.active` styling (primary bg/text)
- [ ] Dropdown closes on outside click (Preline behavior — no custom code needed)
- [ ] No new semantic classes added without paired HTML

---

## Commit

```bash
git add -A
git commit -m "fix(patient/meals): swap sheet hover, language dropdown"
```
