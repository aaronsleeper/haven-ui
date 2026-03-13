# Task 01: Mobile Shell + i18n System

## Scope
Pattern library + CSS + Partial + JS. No app page work in this task.

## Context
This task establishes the three foundational pieces every patient app screen depends on:
1. The `mobile-shell` CSS classes that override the desktop body defaults
2. The `mobile-i18n-bar` — a fixed top bar with a language toggle (EN/ES)
3. The `i18n.js` script that swaps `data-i18n-en` / `data-i18n-es` attributes on toggle

These must exist before any app screen is built. The i18n bar will be a shared partial included on all 10 patient screens.

## Prerequisites
None — this is the first task.

## Files to Read First
- `src/styles/tokens/components.css` — confirm there is no existing `.mobile-shell` or `.mobile-app` class before adding
- `pattern-library/COMPONENT-INDEX.md` — confirm no existing mobile shell component
- `src/partials/` — list existing partials to avoid naming conflicts
- `.project-docs/decisions-log.md` — review active rules before writing any CSS

## Instructions

### Step 1: Add semantic classes to components.css

Open `src/styles/tokens/components.css`. Add the following block after the existing `.sidebar-toggle-bar` section (around line 80). Do NOT modify any existing rules.

```css
/* ===================================
   MOBILE APP SHELL (Patient App)
   =================================== */

/* Applied to <body> on all patient app screens.
   Disables desktop ambient blobs, sets white bg. */
.mobile-app {
  @apply bg-white;
  @apply dark:bg-neutral-900;
}

.mobile-app::before,
.mobile-app::after {
  display: none !important;
}

/* Inner centering wrapper — constrains content to mobile width */
.mobile-shell {
  @apply block w-full max-w-[430px] mx-auto min-h-dvh bg-white relative;
  @apply dark:bg-neutral-900;
}

/* ===================================
   MOBILE i18n BAR (Patient App)
   =================================== */

/* Fixed top bar containing the language toggle.
   Present on all patient app screens. */
.mobile-i18n-bar {
  @apply fixed top-0 left-0 right-0 z-50 flex justify-end items-center px-4 bg-white border-b border-gray-100;
  height: 40px;
  max-width: 430px;
  margin-inline: auto;
  @apply dark:bg-neutral-900 dark:border-neutral-800;
}

/* Language toggle button inside the i18n bar */
.mobile-i18n-toggle {
  @apply inline-flex items-center gap-1 text-xs text-gray-500;
  @apply hover:text-primary-600 dark:text-neutral-400 dark:hover:text-primary-400;
  text-decoration: none;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
}
```

**Known Constraints (from decisions-log.md):**
- Any class using only raw CSS properties (no `@apply`) must include `@apply block;` as the first line to prevent Tailwind v4 tree-shaking from silently dropping it. The `.mobile-app::before` and `.mobile-app::after` rules are pseudo-elements on a class that does have `@apply`, so they are safe.
- The base `button` element rule must not set size or color — `.mobile-i18n-toggle` overrides size/color via its own class, which is correct.

### Step 2: Create the i18n partial

Create `src/partials/patient-i18n-bar.html` with this exact content:

```html
<!-- Patient App: Language Toggle Bar -->
<!-- Include on ALL patient app screens, before other body content -->
<div class="mobile-i18n-bar" role="navigation" aria-label="Language selection">
  <button
    class="mobile-i18n-toggle"
    id="lang-toggle"
    type="button"
    aria-label="Switch to Spanish"
  >
    <span id="lang-label" data-i18n-en="English" data-i18n-es="Español">English</span>
    <i class="fa-solid fa-globe"></i>
  </button>
</div>
```

### Step 3: Create the i18n JavaScript module

Create `src/scripts/components/i18n.js` with this exact content:

```javascript
/**
 * i18n.js — Patient App language toggle
 * Swaps data-i18n-en / data-i18n-es attributes on all text nodes.
 * Persists language choice in localStorage.
 * Include on all patient app screens.
 */
(function () {
  'use strict';

  var LANG_KEY = 'cena-lang';
  var DEFAULT_LANG = 'en';

  function applyLanguage(lang) {
    // Update html lang attribute
    document.documentElement.lang = lang;

    // Swap all bilingual text nodes
    document.querySelectorAll('[data-i18n-en]').forEach(function (el) {
      var text = lang === 'en' ? el.dataset.i18nEn : el.dataset.i18nEs;
      if (text !== undefined) el.textContent = text;
    });

    // Update toggle aria-label to name the language you WILL switch to
    var toggle = document.getElementById('lang-toggle');
    if (toggle) {
      toggle.setAttribute(
        'aria-label',
        lang === 'en' ? 'Switch to Spanish' : 'Switch to English'
      );
    }

    // Persist choice
    try { localStorage.setItem(LANG_KEY, lang); } catch (e) {}
  }

  function init() {
    var saved;
    try { saved = localStorage.getItem(LANG_KEY); } catch (e) {}
    applyLanguage(saved || DEFAULT_LANG);

    var toggle = document.getElementById('lang-toggle');
    if (toggle) {
      toggle.addEventListener('click', function () {
        var current;
        try { current = localStorage.getItem(LANG_KEY); } catch (e) {}
        applyLanguage((current || DEFAULT_LANG) === 'en' ? 'es' : 'en');
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
```

### Step 4: Create pattern library files

Create `pattern-library/components/layout-mobile-shell.html`:

```html
<!--
@component-meta
name: Mobile Shell
category: Layout
classes: mobile-app, mobile-shell
preline: false
description: Base layout wrapper for patient app screens. Applied as class on body + inner div. Constrains to 430px, disables desktop ambient blobs, sets white background.
-->

<!-- Usage: Add mobile-app to <body>, wrap all content in mobile-shell -->
<body class="mobile-app bg-gray-100">
  <div class="mobile-shell">
    <!-- Patient app content here -->
    <div class="px-4 py-6">
      <p class="text-sm text-gray-500">Mobile shell — max 430px, centered</p>
    </div>
  </div>
</body>
```

Create `pattern-library/components/layout-mobile-i18n-bar.html`:

```html
<!--
@component-meta
name: Mobile i18n Bar
category: Layout
classes: mobile-i18n-bar, mobile-i18n-toggle
preline: false
description: Fixed top bar for patient app screens. Language toggle swaps data-i18n-en / data-i18n-es attributes. Shared partial: src/partials/patient-i18n-bar.html. JS: src/scripts/components/i18n.js
-->

<div class="mobile-i18n-bar" role="navigation" aria-label="Language selection">
  <button class="mobile-i18n-toggle" id="lang-toggle" type="button" aria-label="Switch to Spanish">
    <span id="lang-label" data-i18n-en="English" data-i18n-es="Español">English</span>
    <i class="fa-solid fa-globe"></i>
  </button>
</div>

<!-- i18n attribute pattern for bilingual text nodes on any screen: -->
<!-- <span data-i18n-en="English text" data-i18n-es="Texto en español">English text</span> -->
```

### Step 5: Update COMPONENT-INDEX.md

Add these two rows to the **Layout** table in `pattern-library/COMPONENT-INDEX.md`, after the existing "App Shell" row:

```
| Mobile Shell | `layout-mobile-shell.html` | `mobile-app`, `mobile-shell` | no | Patient app only. Apply `mobile-app` to `<body>`, `mobile-shell` to inner wrapper. |
| Mobile i18n Bar | `layout-mobile-i18n-bar.html` | `mobile-i18n-bar`, `mobile-i18n-toggle` | no | Patient app only. Partial: `src/partials/patient-i18n-bar.html`. JS: `src/scripts/components/i18n.js` |
```

## Expected Result
After this task:
- `src/styles/tokens/components.css` contains `.mobile-app`, `.mobile-shell`, `.mobile-i18n-bar`, `.mobile-i18n-toggle` with proper dark mode variants
- `src/partials/patient-i18n-bar.html` exists with the language toggle markup
- `src/scripts/components/i18n.js` exists with the language swap module
- `pattern-library/components/layout-mobile-shell.html` exists with `@component-meta` header
- `pattern-library/components/layout-mobile-i18n-bar.html` exists with `@component-meta` header
- `pattern-library/COMPONENT-INDEX.md` has two new rows in the Layout table

No app pages are built in this task.

## Verification
- [ ] `.mobile-app` class exists in `components.css` with `@apply bg-white` and dark mode
- [ ] `.mobile-app::before, .mobile-app::after` have `display: none !important`
- [ ] `.mobile-shell` class exists with `max-w-[430px]` and dark mode
- [ ] `.mobile-i18n-bar` is `position: fixed`, `height: 40px`, `max-width: 430px`
- [ ] `.mobile-i18n-toggle` has no size/color on the base `button` element rule — all styling is on the class
- [ ] `src/partials/patient-i18n-bar.html` exists and contains `id="lang-toggle"`
- [ ] `src/scripts/components/i18n.js` exists
- [ ] Both pattern library files exist with `@component-meta` headers
- [ ] `COMPONENT-INDEX.md` has both new rows
- [ ] HTML classes in pattern library files are semantic — no utility chains in component styling
- [ ] Dark mode variants present on `.mobile-app`, `.mobile-shell`, `.mobile-i18n-bar`, `.mobile-i18n-toggle`
- [ ] `ANDREY-README.md` updated with i18n attribute pattern and `data-i18n-en`/`data-i18n-es` documentation (yes — Andrey needs this for Angular binding)
- [ ] `src/data/_schema-notes.md` not affected (no data model changes)

## Completion Report

After all verification passes, output:

```
## Completion Report — Task 01: Mobile Shell + i18n System

- New semantic classes added to components.css: [list]
- Existing classes modified: none
- Pattern library files created: [list]
- Partials created: src/partials/patient-i18n-bar.html
- Scripts created: src/scripts/components/i18n.js
- Judgment calls: [any decisions not explicitly specified above]
- Dark mode added: yes
- ANDREY-README.md updated: yes
- Schema delta logged: not applicable
- Items deferred or incomplete: none
```

Then run:
```
git add -A
git commit -m "task 01: mobile shell, i18n bar, and language toggle system"
```

## If Something Goes Wrong
- If `components.css` already has a `.mobile-shell` or `.mobile-app` class: do not duplicate. Read the existing class, confirm it matches the spec above, add any missing properties.
- If the i18n bar partial conflicts with an existing partial name: check `src/partials/`, rename to `patient-i18n-bar.html` (already specified).
- If `localStorage` is not available in the test environment: the `try/catch` blocks handle this gracefully — language defaults to English.
