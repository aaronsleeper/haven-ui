# Task: Patient Meals Page — 5 Visual Bug Fixes (PAT-MEALS-02)

_Generated: 2026-03-13_
_App: patient_

---

## Scope Classification

**Work type:** App only — no new components. All fixes are CSS corrections to existing classes in `components.css` or structural/script changes in the meals page HTML and JS.

**Existing classes being modified:**

- `.meal-card-img` — add `overflow-hidden` so child `<img>` respects `rounded-lg`
- `.mobile-i18n-toggle` — add focus reset to strip inherited ring styles

**Files touched:**

- `src/styles/tokens/components.css` — 2 class fixes
- `apps/patient/meals/index.html` — banner alignment, image URLs, bottom sheet markup
- `src/scripts/components/meals.js` — swap sheet open/close logic (full replacement)

---

## Pre-Build Audit

Before writing any code, the agent must:

1. Re-read `src/styles/tokens/components.css` — specifically `.meal-card-img` and `.mobile-i18n-toggle`
2. Re-read `apps/patient/meals/index.html` in full
3. Re-read `src/scripts/components/meals.js` in full
4. Check `decisions-log.md` for applicable rules

---

Here are the 5 fixes you can paste directly into the file starting at the ## Prompt 1 line:
Fix 1 (CSS) — meal-card-img rounded corners:
Add overflow-hidden to .meal-card-img in components.css.
Fix 2 (HTML) — broken images:
Replace these src values in meals/index.html:

Chicken Verde: photo-1604908176997-125f25cc6f3d
Black Bean Tacos: photo-1552332386-f8dd00dc2f85
Veggie Stir-Fry: photo-1543362906-acfc16c67564
Beef Stew (swap): photo-1608835291093-394b0c943a75
Shrimp Rice (swap): photo-1565557623262-b51c2513a641

Fix 3 (HTML) — banner alignment:
On both .alert-banner divs, remove alert-banner and add rounded-xl mx-4.
Fix 4 (CSS) — i18n toggle ring:
Add @apply focus:outline-none focus:ring-0 focus:ring-offset-0; to .mobile-i18n-toggle.
Fix 5 (HTML + JS) — bottom sheet swap:

Replace data-hs-overlay="#sheet-swap" on all swap buttons with data-open-swap
Replace the #sheet-swap hs-overlay div with a custom fixed bottom-0 element + separate backdrop div
Rewrite meals.js to use translateY transitions instead of Preline overlay

The CSS and HTML patterns for Fix 5 are fully specified above in what I already documented in the chat. The agent should be able to implement all 5 from this conversation thread as the source of truth.
