# Task 02: Mobile Bottom Nav + Onboarding Progress Indicator

## Scope
Pattern library + CSS + Partial. No app page work in this task.

## Context
Two more foundational components before any screen is built:
1. `mobile-bottom-nav` — the fixed four-tab bar that appears on all post-onboarding screens
2. `onb-progress` — the "Step N of 3" indicator on the onboarding screens

The bottom nav will become a shared partial (`src/partials/patient-bottom-nav.html`) that the agent copies and modifies per screen to set the active tab. The progress indicator is a simple single class used inline.

## Prerequisites
- Task 01 complete (`mobile-app`, `mobile-shell`, `mobile-i18n-bar`, `mobile-i18n-toggle` exist in `components.css`)

## Files to Read First
- `src/styles/tokens/components.css` — confirm Tasks 01 classes are present; find the right insertion point for new classes
- `pattern-library/COMPONENT-INDEX.md` — confirm no existing bottom nav or onboarding progress component
- `src/partials/` — list existing partials; confirm `patient-i18n-bar.html` exists from Task 01
- `.project-docs/decisions-log.md` — review active rules

## Instructions

### Step 1: Add semantic classes to components.css

Open `src/styles/tokens/components.css`. Add the following block immediately after the `/* MOBILE i18n BAR */` section added in Task 01. Do NOT modify any existing rules.

```css
/* ===================================
   MOBILE BOTTOM NAV (Patient App)
   =================================== */

/* Fixed four-tab bar — present on all post-onboarding screens */
.mobile-bottom-nav {
  @apply fixed bottom-0 left-0 right-0 z-40 grid grid-cols-4 bg-white border-t border-gray-200 shadow-lg;
  max-width: 430px;
  margin-inline: auto;
  padding-bottom: env(safe-area-inset-bottom);
  @apply dark:bg-neutral-900 dark:border-neutral-700;
}

/* Individual tab item — <a> or <button> */
.mobile-bottom-nav-tab {
  @apply flex flex-col items-center justify-center gap-1 py-2 text-gray-400 text-xs font-medium;
  @apply hover:text-primary-600 dark:text-neutral-500 dark:hover:text-primary-400;
  min-height: 64px;
  text-decoration: none;
  background: none;
  border: none;
  cursor: pointer;
}

.mobile-bottom-nav-tab i {
  @apply text-xl;
}

/* Active tab — applied to the tab matching the current screen */
.mobile-bottom-nav-tab.active {
  @apply text-primary-600 dark:text-primary-400;
}

/* Unread count badge — positioned on the Care Team tab icon */
.mobile-bottom-nav-badge {
  @apply absolute -top-1.5 -right-2.5 flex items-center justify-center;
  @apply bg-error-500 text-white font-bold rounded-full;
  @apply dark:bg-error-600;
  min-width: 18px;
  height: 18px;
  padding: 0 3px;
  font-size: 10px;
}

/* ===================================
   ONBOARDING PROGRESS (Patient App)
   =================================== */

/* "Step N of 3" indicator on onboarding screens */
.onb-progress {
  @apply block text-sm text-gray-500 text-center mt-4 mb-2;
  @apply dark:text-neutral-400;
}
```

**Known Constraints (from decisions-log.md):**
- The base `button` element rule must not set size or color. `.mobile-bottom-nav-tab` sets its own padding and colors via the class — correct pattern.
- Any class using only raw CSS properties must include `@apply block;` as its first line. `.onb-progress` uses `@apply` so it is safe. The `min-height`, `padding-bottom env(...)`, `min-width`, `height`, `padding`, `font-size` raw properties inside classed rules are fine — they live on classes that also have `@apply` directives.

### Step 2: Create the bottom nav partial

Create `src/partials/patient-bottom-nav.html` with this exact content:

```html
<!-- Patient App: Bottom Navigation Bar -->
<!-- Include on all post-onboarding screens (NOT on onboarding screens) -->
<!-- Set the .active class and aria-current="page" on the correct tab per screen -->
<nav class="mobile-bottom-nav" aria-label="Main navigation">

  <a href="/apps/patient/meals/index.html"
     class="mobile-bottom-nav-tab"
     aria-label="Meals">
    <i class="fa-solid fa-bowl-food"></i>
    <span data-i18n-en="Meals" data-i18n-es="Comidas">Meals</span>
  </a>

  <a href="/apps/patient/deliveries/index.html"
     class="mobile-bottom-nav-tab"
     aria-label="Delivery">
    <i class="fa-solid fa-truck"></i>
    <span data-i18n-en="Delivery" data-i18n-es="Entrega">Delivery</span>
  </a>

  <a href="/apps/patient/care-team/messages.html"
     class="mobile-bottom-nav-tab"
     aria-label="Care Team, 2 unread messages">
    <span class="relative inline-flex">
      <i class="fa-solid fa-comments"></i>
      <span class="mobile-bottom-nav-badge">2</span>
    </span>
    <span data-i18n-en="Care Team" data-i18n-es="Mi Equipo">Care Team</span>
  </a>

  <a href="/apps/patient/profile/index.html"
     class="mobile-bottom-nav-tab"
     aria-label="Profile">
    <i class="fa-solid fa-circle-user"></i>
    <span data-i18n-en="Profile" data-i18n-es="Perfil">Profile</span>
  </a>

</nav>
```

**Note for the agent building app screens (Tasks 04–09):** When including this partial in a screen, copy it and add `class="mobile-bottom-nav-tab active"` and `aria-current="page"` to the correct tab for that screen. Do not use JavaScript to set the active state — set it statically in the HTML per screen.

### Step 3: Create pattern library files

Create `pattern-library/components/layout-mobile-bottom-nav.html`:

```html
<!--
@component-meta
name: Mobile Bottom Nav
category: Layout
classes: mobile-bottom-nav, mobile-bottom-nav-tab, mobile-bottom-nav-tab.active, mobile-bottom-nav-badge
preline: false
description: Fixed four-tab bottom navigation bar for the patient app. Present on all post-onboarding screens. Shared partial: src/partials/patient-bottom-nav.html. Copy partial and set .active + aria-current="page" on the correct tab per screen. Badge on Care Team tab shows unread count; hide with display:none when count is 0.
-->

<nav class="mobile-bottom-nav" aria-label="Main navigation">

  <!-- Meals tab (active example) -->
  <a href="/apps/patient/meals/index.html"
     class="mobile-bottom-nav-tab active"
     aria-current="page"
     aria-label="Meals">
    <i class="fa-solid fa-bowl-food"></i>
    <span>Meals</span>
  </a>

  <!-- Delivery tab -->
  <a href="/apps/patient/deliveries/index.html"
     class="mobile-bottom-nav-tab"
     aria-label="Delivery">
    <i class="fa-solid fa-truck"></i>
    <span>Delivery</span>
  </a>

  <!-- Care Team tab with unread badge -->
  <a href="/apps/patient/care-team/messages.html"
     class="mobile-bottom-nav-tab"
     aria-label="Care Team, 2 unread messages">
    <span class="relative inline-flex">
      <i class="fa-solid fa-comments"></i>
      <span class="mobile-bottom-nav-badge">2</span>
    </span>
    <span>Care Team</span>
  </a>

  <!-- Profile tab -->
  <a href="/apps/patient/profile/index.html"
     class="mobile-bottom-nav-tab"
     aria-label="Profile">
    <i class="fa-solid fa-circle-user"></i>
    <span>Profile</span>
  </a>

</nav>
```

Create `pattern-library/components/layout-onb-progress.html`:

```html
<!--
@component-meta
name: Onboarding Progress Indicator
category: Layout
classes: onb-progress
preline: false
description: "Step N of 3" text indicator for onboarding screens. Set aria-label to the full readable string. Inner spans carry data-i18n-en/es attributes for language toggle support.
-->

<!-- Step 1 of 3 example -->
<p class="onb-progress" aria-label="Step 1 of 3">
  <span data-i18n-en="Step" data-i18n-es="Paso">Step</span>
  1
  <span data-i18n-en="of" data-i18n-es="de">of</span>
  3
</p>
```

### Step 4: Update COMPONENT-INDEX.md

Add these two rows to the **Layout** table in `pattern-library/COMPONENT-INDEX.md`, after the two rows added in Task 01:

```
| Mobile Bottom Nav | `layout-mobile-bottom-nav.html` | `mobile-bottom-nav`, `mobile-bottom-nav-tab`, `mobile-bottom-nav-badge` | no | Patient app only. Shared partial: `src/partials/patient-bottom-nav.html`. Copy + set `.active` per screen. |
| Onboarding Progress | `layout-onb-progress.html` | `onb-progress` | no | Patient app only. Used on ONB-01, 02, 03. Set `aria-label="Step N of 3"`. |
```

## Expected Result
After this task:
- `components.css` contains `.mobile-bottom-nav`, `.mobile-bottom-nav-tab`, `.mobile-bottom-nav-tab.active`, `.mobile-bottom-nav-badge`, `.onb-progress` with dark mode variants
- `src/partials/patient-bottom-nav.html` exists (no active tab set — that is per-screen)
- `pattern-library/components/layout-mobile-bottom-nav.html` exists with `@component-meta` header
- `pattern-library/components/layout-onb-progress.html` exists with `@component-meta` header
- `COMPONENT-INDEX.md` has two new rows in the Layout table

No app pages are built in this task.

## Verification
- [ ] `.mobile-bottom-nav` is `position: fixed`, `grid-cols-4`, `max-width: 430px`, `padding-bottom: env(safe-area-inset-bottom)` with dark mode
- [ ] `.mobile-bottom-nav-tab` min-height is 64px (exceeds 44px WCAG touch target minimum)
- [ ] `.mobile-bottom-nav-tab.active` applies `text-primary-600` (not a background fill)
- [ ] `.mobile-bottom-nav-badge` is `position: absolute` — confirm parent `<span>` uses `relative inline-flex` in the partial (not on the class itself)
- [ ] `.onb-progress` has `@apply` (not raw-CSS-only — no `@apply block` workaround needed, but confirm)
- [ ] `src/partials/patient-bottom-nav.html` exists; no `.active` class set (left for per-screen customization)
- [ ] Both pattern library files exist with `@component-meta` headers
- [ ] `COMPONENT-INDEX.md` has both new rows in the Layout table
- [ ] HTML classes in pattern library files are semantic — no utility chains in component styling
- [ ] Dark mode variants present on all new classes
- [ ] `ANDREY-README.md` updated with bottom nav tab active state convention and badge hide/show pattern (yes — Andrey needs this for Angular router `routerLinkActive`)
- [ ] `src/data/_schema-notes.md` not affected

## Completion Report

After all verification passes, output:

```
## Completion Report — Task 02: Mobile Bottom Nav + Onboarding Progress

- New semantic classes added to components.css: [list]
- Existing classes modified: none
- Pattern library files created: [list]
- Partials created: src/partials/patient-bottom-nav.html
- Scripts created: none
- Judgment calls: [any]
- Dark mode added: yes
- ANDREY-README.md updated: yes
- Schema delta logged: not applicable
- Items deferred or incomplete: none
```

Then run:
```
git add -A
git commit -m "task 02: mobile bottom nav and onboarding progress indicator"
```

## If Something Goes Wrong
- If `.mobile-bottom-nav-badge` positioning looks off: confirm the parent `<span>` in the HTML has `class="relative inline-flex"`. The badge itself uses `position: absolute` via the class, but needs a positioned ancestor — that is handled in the HTML structure, not the CSS class.
- If `env(safe-area-inset-bottom)` causes a lint warning: it is valid CSS for iOS home indicator clearance. Keep it.
- If the nav appears wider than 430px on desktop: confirm `max-width: 430px; margin-inline: auto;` is present in `.mobile-bottom-nav` (mirrors `mobile-shell` constraint).
