# New Component: Mobile i18n Bar

## Purpose
Fixed top bar present on every patient app screen. Contains the language toggle (English / Español). Persists across onboarding and post-onboarding screens. Manages the `data-i18n-en` / `data-i18n-es` attribute swap and sets `lang` on `<html>`.

## Used In
- All 10 patient app screens (as a shared partial: `src/partials/patient-i18n-bar.html`)

## Preline Base
None — pure Tailwind + vanilla JS.

## Proposed Semantic Classes
- `.mobile-i18n-bar` — fixed top bar wrapper
- `.mobile-i18n-toggle` — the toggle button itself

## Implementation Notes

### HTML Structure
```html
<div class="mobile-i18n-bar" role="navigation" aria-label="Language selection">
  <button
    class="mobile-i18n-toggle"
    id="lang-toggle"
    aria-label="Switch to Spanish"
    data-lang-en="English"
    data-lang-es="Español"
  >
    <span data-i18n-en="English" data-i18n-es="Español">English</span>
    <i class="fa-solid fa-globe text-xs ml-1"></i>
  </button>
</div>
```

### @apply Definition
```css
.mobile-i18n-bar {
  @apply fixed top-0 left-0 right-0 z-50 flex justify-end items-center px-4 py-2 bg-white border-b border-gray-100;
  @apply dark:bg-neutral-900 dark:border-neutral-800;
  max-width: 430px;
  margin-inline: auto;
}

.mobile-i18n-toggle {
  @apply text-xs text-gray-500 hover:text-primary-600 flex items-center gap-1;
  @apply dark:text-neutral-400 dark:hover:text-primary-400;
}
```

### JavaScript (src/scripts/components/i18n.js)
```javascript
// i18n.js — shared across all patient app screens
(function () {
  const LANG_KEY = 'cena-lang';
  const DEFAULT_LANG = 'en';

  function applyLanguage(lang) {
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n-en]').forEach(el => {
      el.textContent = el.dataset[lang === 'en' ? 'i18nEn' : 'i18nEs'];
    });
    const toggle = document.getElementById('lang-toggle');
    if (toggle) {
      toggle.setAttribute('aria-label', lang === 'en' ? 'Switch to Spanish' : 'Switch to English');
    }
    localStorage.setItem(LANG_KEY, lang);
  }

  function init() {
    const saved = localStorage.getItem(LANG_KEY) || DEFAULT_LANG;
    applyLanguage(saved);

    const toggle = document.getElementById('lang-toggle');
    if (toggle) {
      toggle.addEventListener('click', () => {
        const current = localStorage.getItem(LANG_KEY) || DEFAULT_LANG;
        applyLanguage(current === 'en' ? 'es' : 'en');
      });
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})();
```

File location: `src/scripts/components/i18n.js`

### Content Offset
Screens must add `padding-top: 40px` (height of the i18n bar) to their content wrapper so the bar doesn't overlap content. Use utility `pt-10` on the `mobile-shell` inner content div.

### i18n Attribute Pattern
Every bilingual text node in every screen uses:
```html
<span data-i18n-en="Your Meals" data-i18n-es="Tus Comidas">Your Meals</span>
```
The JS reads `data-i18n-en` or `data-i18n-es` and sets `textContent` accordingly.

### States
- Default: shows current language label
- On toggle: swaps all text nodes; updates `html[lang]`; persists to localStorage

### Dark Mode
- Bar: `dark:bg-neutral-900 dark:border-neutral-800`
- Toggle: `dark:text-neutral-400 dark:hover:text-primary-400`

### Responsive Behavior
Bar is constrained to `max-width: 430px` matching `mobile-shell`. On wider screens it stays visually inside the shell.

### Accessibility
- `role="navigation"` with `aria-label="Language selection"` on the bar
- Toggle button has dynamic `aria-label` that names the language you'll switch TO (not the current one)

## Pattern Library
[ ] Component file needed: `pattern-library/components/layout-mobile-i18n-bar.html`
[ ] `COMPONENT-INDEX.md` row needed

## Priority
Required for launch
