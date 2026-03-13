# PAT-PARTIALS-01: Convert Patient App Chrome to Partials

_Generated: 2026-03-13_
_App: patient_

## Scope Classification
- Type: REFACTOR (no visual change intended)
- Files touched: 5 HTML pages, 2 partial files, 1 new JS file
- CSS changes: NONE
- New components: NONE
- Verification: All 5 pages render identically before and after at localhost:5173

## Pre-Build Audit Gate
Before writing any code, verify:
1. Read `src/partials/patient-i18n-bar.html` — note current content (it is stale)
2. Read `src/partials/patient-bottom-nav.html` — note current content (it is stale)
3. Read `apps/patient/meals/index.html` — this is the source of truth for the i18n bar HTML (has the Preline dropdown version)
4. Confirm `vite-plugin-html-inject` is in `package.json` dependencies
5. Confirm `htmlInject()` is already in `vite.config.js` plugins array (it is)

## Context
The patient app has 5 post-onboarding pages. Each has the i18n bar and bottom nav hardcoded with a comment `(copied from partial)`. Two partial files exist but are stale and unused. This task:
1. Updates both partials to match the current HTML in meals/index.html (source of truth)
2. Replaces all hardcoded nav/bar blocks in all 5 pages with `<load>` injection tags
3. Adds a small JS module that sets the active tab automatically based on `window.location.pathname`
4. Fixes the stale FA stylesheet reference (`all.min.css` → `all.css`) on all pages that still have the wrong filename

## Pages to Update
- `apps/patient/index.html` (Home tab active)
- `apps/patient/meals/index.html` (Meals tab active) — source of truth for i18n bar HTML
- `apps/patient/deliveries/index.html` (Delivery tab active)
- `apps/patient/care-team/messages.html` (Team tab active)
- `apps/patient/profile/index.html` (Profile tab active)

---

## Step 1: Update `src/partials/patient-i18n-bar.html`

Replace the entire file contents with exactly this (copied from meals/index.html source of truth):

```html
<!-- Patient App: Language Toggle Bar -->
<!-- Include on ALL patient app screens, before other body content -->
<!-- Uses Preline dropdown. Requires Preline autoInit (main.js) and i18n.js to be loaded on the page. -->
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
      <i class="fa-solid fa-globe text-gray-400" aria-hidden="true"></i>
      <span id="lang-label" data-i18n-en="English" data-i18n-es="Español">English</span>
      <i class="fa-solid fa-chevron-down text-gray-400" style="font-size:10px" aria-hidden="true"></i>
    </button>

    <div
      class="hs-dropdown-menu"
      role="menu"
      aria-orientation="vertical"
      aria-labelledby="lang-dropdown-btn"
    >
      <button type="button" class="hs-dropdown-item" data-lang="en">English</button>
      <button type="button" class="hs-dropdown-item" data-lang="es">Español</button>
    </div>
  </div>
</div>
```

## Step 2: Update `src/partials/patient-bottom-nav.html`

Replace the entire file contents with exactly this. All tabs are inactive — active state is set by JS (Step 3):

```html
<!-- Patient App: Bottom Navigation Bar -->
<!-- Include on all post-onboarding screens (NOT on onboarding screens) -->
<!-- Active tab is set automatically by patient-nav-active.js based on pathname -->
<nav class="mobile-bottom-nav" aria-label="Main navigation">

  <a href="/apps/patient/index.html"
     class="mobile-bottom-nav-tab"
     data-nav-tab="home"
     aria-label="Home">
    <i class="fa-solid fa-house"></i>
    <span data-i18n-en="Home" data-i18n-es="Inicio">Home</span>
  </a>

  <a href="/apps/patient/meals/index.html"
     class="mobile-bottom-nav-tab"
     data-nav-tab="meals"
     aria-label="Meals">
    <i class="fa-solid fa-bowl-food"></i>
    <span data-i18n-en="Meals" data-i18n-es="Comidas">Meals</span>
  </a>

  <a href="/apps/patient/deliveries/index.html"
     class="mobile-bottom-nav-tab"
     data-nav-tab="deliveries"
     aria-label="Delivery">
    <i class="fa-solid fa-truck"></i>
    <span data-i18n-en="Delivery" data-i18n-es="Entrega">Delivery</span>
  </a>

  <a href="/apps/patient/care-team/messages.html"
     class="mobile-bottom-nav-tab"
     data-nav-tab="care-team"
     aria-label="Care Team">
    <span class="relative inline-flex">
      <i class="fa-solid fa-comments"></i>
      <span class="mobile-bottom-nav-badge">2</span>
    </span>
    <span data-i18n-en="Team" data-i18n-es="Equipo">Team</span>
  </a>

  <a href="/apps/patient/profile/index.html"
     class="mobile-bottom-nav-tab"
     data-nav-tab="profile"
     aria-label="Profile">
    <i class="fa-solid fa-circle-user"></i>
    <span data-i18n-en="Profile" data-i18n-es="Perfil">Profile</span>
  </a>

</nav>
```

## Step 3: Create `src/scripts/components/patient-nav-active.js`

Create this new file:

```js
/**
 * patient-nav-active.js
 * Sets the active tab on the patient app bottom nav based on the current URL.
 * Must be loaded after the bottom nav partial is injected (i.e., before </body>).
 */
(function () {
  const path = window.location.pathname;

  const tabMap = [
    { tab: 'home',       pattern: /\/apps\/patient\/index\.html/ },
    { tab: 'meals',      pattern: /\/apps\/patient\/meals\// },
    { tab: 'deliveries', pattern: /\/apps\/patient\/deliveries\// },
    { tab: 'care-team',  pattern: /\/apps\/patient\/care-team\// },
    { tab: 'profile',    pattern: /\/apps\/patient\/profile\// },
  ];

  const match = tabMap.find(({ pattern }) => pattern.test(path));
  if (!match) return;

  const tab = document.querySelector(`[data-nav-tab="${match.tab}"]`);
  if (!tab) return;

  tab.classList.add('active');
  tab.setAttribute('aria-current', 'page');
})();
```

## Step 4: Update all 5 HTML pages

Apply the following changes to each page. Read each file before editing.

### Change A: Fix FA stylesheet (applies to all pages still using `all.min.css`)
Change:
```html
<link rel="stylesheet" href="/src/vendor/fontawesome/css/all.min.css">
```
To:
```html
<link rel="stylesheet" href="/src/vendor/fontawesome/css/all.css">
```

### Change B: Replace hardcoded i18n bar with partial injection
Remove the entire `<div class="mobile-i18n-bar"` block (from opening tag to its closing `</div>`) along with its surrounding comment. Replace with:
```html
<load src="src/partials/patient-i18n-bar.html" />
```

### Change C: Replace hardcoded bottom nav with partial injection
Remove the entire `<nav class="mobile-bottom-nav"` block (opening tag through closing `</nav>`) along with its surrounding comment. Replace with:
```html
<load src="src/partials/patient-bottom-nav.html" />
```

### Change D: Add nav-active script
In each page's script block, add after `i18n.js` and before `main.js`:
```html
<!-- Patient nav active state -->
<script src="/src/scripts/components/patient-nav-active.js"></script>
```

### Per-page notes

**`apps/patient/index.html`**
- FA: currently `all.min.css` — fix
- i18n bar comment reads `<!-- i18n bar (copied from partial) -->`
- Bottom nav comment reads `<!-- Bottom nav — Home tab active -->`

**`apps/patient/meals/index.html`**
- FA: already `all.css` — no change needed
- i18n bar is the Preline dropdown version (source of truth) — replace with `<load>` tag
- Bottom nav comment reads `<!-- Bottom nav (copied from partial) -->`

**`apps/patient/deliveries/index.html`**
- FA: currently `all.min.css` — fix
- i18n bar comment reads `<!-- i18n bar (copied from partial) -->`
- Bottom nav comment reads `<!-- Bottom nav (copied from partial) -->`

**`apps/patient/care-team/messages.html`**
- FA: currently `all.min.css` — fix
- i18n bar comment reads `<!-- i18n bar (copied from partial) -->`
- Bottom nav comment reads `<!-- Bottom nav (copied from partial) — Care Team active -->`
- IMPORTANT: On this page the bottom nav sits inside `.mobile-shell` (flex column layout), after the compose bar. Place the `<load>` tag in the same position — do not move it outside the shell.

**`apps/patient/profile/index.html`**
- FA: currently `all.min.css` — fix
- i18n bar comment reads `<!-- i18n bar (copied from partial) -->`
- Bottom nav comment reads `<!-- Bottom nav — Profile tab active -->`

---

## Verification

After all edits:
1. Hard-refresh each of the 5 pages at localhost:5173
2. Confirm the correct tab is active on each page (Home / Meals / Delivery / Team / Profile)
3. Confirm i18n bar renders correctly on all pages (globe icon, label, chevron)
4. Confirm no console 404 errors (partials, scripts)
5. Screenshot meals and deliveries pages as confirmation

## Do NOT
- Change any page content, layout, or CSS
- Move or rename any existing script tags other than adding patient-nav-active.js
- Modify `vite.config.js`
- Touch onboarding pages
