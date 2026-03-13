# Task: Patient Dashboard + 5-Tab Nav (PAT-DASH-01)
_Generated: 2026-03-12_
_App: patient_

---

## Scope Classification

**Work type:** App page + CSS modification + multi-file nav update.

**Files being created:**
- `apps/patient/index.html` (replace stub)
- `src/scripts/components/dashboard.js` (new)

**Files being modified:**
- `src/styles/tokens/components.css` — `mobile-bottom-nav` grid-cols-4 → grid-cols-5
- `apps/patient/meals/index.html` — nav block updated to 5-tab
- `apps/patient/deliveries/index.html` — nav block updated to 5-tab
- `apps/patient/care-team/messages.html` — nav block updated to 5-tab
- `apps/patient/care-team/feedback.html` — nav block updated to 5-tab
- `apps/patient/profile/index.html` — nav block updated to 5-tab

**Patterns being used (all verified in components.css):**
- `mobile-shell`, `mobile-app` — body/wrapper
- `mobile-i18n-bar`, `mobile-i18n-toggle` — language bar
- `mobile-bottom-nav`, `mobile-bottom-nav-tab`, `mobile-bottom-nav-badge` — bottom nav
- `card`, `card-body` — section cards
- `alert`, `alert-warning`, `alert-banner` — confirm-meals callout
- `badge`, `badge-primary`, `badge-pill` — meal tags
- `btn-primary`, `btn-outline` — action buttons
- `delivery-status-card` — delivery snapshot (read from deliveries/index.html)
- `text-link` — section links

**New semantic classes needed:** `dashboard-greeting`, `dashboard-section-header`, `dashboard-meal-scroll`, `dashboard-meal-chip`, `dashboard-message-preview`

Flag any gap found during audit before writing anything.

---

## Pre-Build Audit

Before writing any HTML or CSS:

1. Read `src/styles/tokens/components.css` — confirm all class names in Scope Classification exist. Note the exact `grid-cols-4` value in `.mobile-bottom-nav`. Note existing `.delivery-status-card` rules.
2. Read `apps/patient/meals/index.html` — note the bottom nav block and the `banner-unconfirmed` / `banner-confirmed` pattern.
3. Read `apps/patient/deliveries/index.html` — note bottom nav and `delivery-status-card` markup.
4. Read `apps/patient/care-team/messages.html` — copy bottom nav block as the reference for the 5-tab replacement.
5. Read `.project-docs/decisions-log.md` — extract every **"Rule to follow in future prompts"** entry. List which apply to this task.

---

## Prompt 1: Update `mobile-bottom-nav` in `src/styles/tokens/components.css`

Find the `.mobile-bottom-nav` rule and change `grid-cols-4` to `grid-cols-5`. No other changes to this rule.

The tab icon size (`text-xl`) and label size (`text-xs`) do not need changes — 5-column layout at mobile widths is tight but intentional.

Do NOT modify any other rules.

---

## Prompt 2: Update bottom nav in all existing patient screens

Each of the following files has a `<nav class="mobile-bottom-nav">` block. Replace it with the new 5-tab nav below. The only difference between files is which tab has `class="mobile-bottom-nav-tab active"` and `aria-current="page"`.

**Files and their active tab:**
- `apps/patient/meals/index.html` → Meals active
- `apps/patient/deliveries/index.html` → Delivery active
- `apps/patient/care-team/messages.html` → Team active
- `apps/patient/care-team/feedback.html` → Team active (care-team section)
- `apps/patient/profile/index.html` → Profile active

**Standard 5-tab nav block (substitute active tab per file):**

```html
<nav class="mobile-bottom-nav" aria-label="Main navigation">

  <a href="/apps/patient/index.html"
     class="mobile-bottom-nav-tab"
     aria-label="Home">
    <i class="fa-solid fa-house"></i>
    <span data-i18n-en="Home" data-i18n-es="Inicio">Home</span>
  </a>

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
     aria-label="Care Team">
    <span class="relative inline-flex">
      <i class="fa-solid fa-comments"></i>
      <span class="mobile-bottom-nav-badge">2</span>
    </span>
    <span data-i18n-en="Team" data-i18n-es="Equipo">Team</span>
  </a>

  <a href="/apps/patient/profile/index.html"
     class="mobile-bottom-nav-tab"
     aria-label="Profile">
    <i class="fa-solid fa-circle-user"></i>
    <span data-i18n-en="Profile" data-i18n-es="Perfil">Profile</span>
  </a>

</nav>
```

Add `class="mobile-bottom-nav-tab active"` and `aria-current="page"` to the correct tab in each file. Remove those attributes from all other tabs.

Process all 5 files. Report each file updated.

---

## Prompt 3: Add new semantic classes to `src/styles/tokens/components.css`

Append the following section at the end of the file, after all existing rules.

```css
/* ============================================================
   DASHBOARD SCREEN
   ============================================================ */

/* Greeting block — "Good morning, Maria" */
.dashboard-greeting {
    @apply text-2xl font-semibold text-gray-900;
    font-family: var(--font-serif);
}

/* Section label above each card group */
.dashboard-section-header {
    @apply flex items-center justify-between mb-2 mt-5;
}

.dashboard-section-header h2 {
    @apply text-sm font-semibold text-gray-700;
}

.dashboard-section-header a {
    @apply text-xs text-primary-600 font-medium;
    @apply dark:text-primary-400;
    text-decoration: none;
}

/* Horizontal scroll row of meal chips */
.dashboard-meal-scroll {
    @apply flex gap-2 overflow-x-auto pb-1;
    scrollbar-width: none;
}

.dashboard-meal-scroll::-webkit-scrollbar {
    @apply block;
    display: none;
}

/* Individual meal chip in the scroll row */
.dashboard-meal-chip {
    @apply flex flex-col gap-1 shrink-0 w-24;
}

.dashboard-meal-chip-img {
    @apply w-24 h-24 rounded-xl object-cover bg-stone-100;
}

.dashboard-meal-chip-day {
    @apply text-xs text-gray-400 font-medium;
}

.dashboard-meal-chip-name {
    @apply text-xs text-gray-700 leading-tight;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

/* Care team message preview row */
.dashboard-message-preview {
    @apply flex items-start gap-3 py-1;
}

.dashboard-message-preview-avatar {
    @apply w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center shrink-0 text-primary-600 text-xs font-bold;
}

.dashboard-message-preview-body {
    @apply flex-1 min-w-0;
}

.dashboard-message-preview-sender {
    @apply text-sm font-semibold text-gray-900;
}

.dashboard-message-preview-text {
    @apply text-sm text-gray-500 truncate;
}

.dashboard-message-preview-time {
    @apply text-xs text-gray-400 shrink-0 mt-0.5;
}
```

Do NOT modify any existing rules. Only append this section.

---

## Prompt 4: Create `apps/patient/index.html`

Completely replace the existing stub. This is the patient app dashboard — the home screen.

### Shell setup
- `<body class="mobile-app">` with `<div class="mobile-shell pb-[128px]">`
- i18n bar: copy verbatim from `messages.html`
- Bottom nav: use the 5-tab nav from Prompt 2, with **Home tab active**
- Title: `"Home — Cena Health"`

### Head block
Match `messages.html` exactly — same stylesheet and FontAwesome links.

### Page structure

All content inside `<main class="px-4 pt-20 pb-4">`.

---

**Greeting**
```html
<div class="mb-1">
  <p class="text-sm text-gray-400" id="dashboard-time-greeting">
    <span data-i18n-en="Good morning" data-i18n-es="Buenos días">Good morning</span>
  </p>
  <h1 class="dashboard-greeting">
    <span data-i18n-en="Maria" data-i18n-es="Maria">Maria</span>
  </h1>
</div>
```

---

**Confirm meals callout** — shown when meals are unconfirmed (default state)

```html
<div class="alert alert-warning alert-banner mt-4 dashboard-confirm-callout" role="alert">
  <div class="flex items-center justify-between w-full gap-3">
    <div class="flex items-center gap-2 min-w-0">
      <i class="fa-solid fa-clock-rotate-left shrink-0" aria-hidden="true"></i>
      <span class="text-sm" data-i18n-en="Confirm your meals by Thursday at 5pm" data-i18n-es="Confirma tus comidas antes del jueves a las 5pm">Confirm your meals by Thursday at 5pm</span>
    </div>
    <a href="/apps/patient/meals/index.html" class="btn-primary shrink-0 text-xs py-1.5 px-3">
      <span data-i18n-en="Confirm" data-i18n-es="Confirmar">Confirm</span>
    </a>
  </div>
</div>
```

Hide this element when meals are confirmed (class `meals-confirmed` on `<body>` — see JS).

---

**Delivery snapshot**

```html
<div class="dashboard-section-header">
  <h2 data-i18n-en="Delivery" data-i18n-es="Entrega">Delivery</h2>
  <a href="/apps/patient/deliveries/index.html" data-i18n-en="Details" data-i18n-es="Detalles">Details</a>
</div>
<div class="card">
  <div class="card-body">
    <div class="flex items-center gap-3">
      <i class="fa-solid fa-bowl-food text-primary-500 text-xl" aria-hidden="true"></i>
      <div>
        <p class="text-sm font-semibold text-gray-900" data-i18n-en="Getting your meals ready" data-i18n-es="Preparando tus comidas">Getting your meals ready</p>
        <p class="text-xs text-gray-500" data-i18n-en="Arriving Thursday, March 19 · 11am–1pm" data-i18n-es="Llegando el jueves 19 de marzo · 11am–1pm">Arriving Thursday, March 19 · 11am–1pm</p>
      </div>
    </div>
  </div>
</div>
```

---

**This week's meals**

```html
<div class="dashboard-section-header">
  <h2 data-i18n-en="This week's meals" data-i18n-es="Tus comidas de esta semana">This week's meals</h2>
  <a href="/apps/patient/meals/index.html" data-i18n-en="See all" data-i18n-es="Ver todas">See all</a>
</div>
<div class="dashboard-meal-scroll">

  <div class="dashboard-meal-chip">
    <img class="dashboard-meal-chip-img"
         src="https://images.unsplash.com/photo-1512058454903-4d8b520e7e8b?w=200&h=200&fit=crop&q=80"
         alt="Chicken Verde Rice Bowl" loading="lazy">
    <span class="dashboard-meal-chip-day" data-i18n-en="Mon" data-i18n-es="Lun">Mon</span>
    <span class="dashboard-meal-chip-name">Chicken Verde Rice Bowl</span>
  </div>

  <div class="dashboard-meal-chip">
    <img class="dashboard-meal-chip-img"
         src="https://images.unsplash.com/photo-1565299507177-b3b0a4b9b5d5?w=200&h=200&fit=crop&q=80"
         alt="Black Bean Tacos" loading="lazy">
    <span class="dashboard-meal-chip-day" data-i18n-en="Tue" data-i18n-es="Mar">Tue</span>
    <span class="dashboard-meal-chip-name">Black Bean Tacos</span>
  </div>

  <div class="dashboard-meal-chip">
    <img class="dashboard-meal-chip-img"
         src="https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=200&h=200&fit=crop&q=80"
         alt="Lemon Herb Salmon" loading="lazy">
    <span class="dashboard-meal-chip-day" data-i18n-en="Wed" data-i18n-es="Mié">Wed</span>
    <span class="dashboard-meal-chip-name">Lemon Herb Salmon</span>
  </div>

  <div class="dashboard-meal-chip">
    <img class="dashboard-meal-chip-img"
         src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=200&fit=crop&q=80"
         alt="Turkey Sofrito Bowl" loading="lazy">
    <span class="dashboard-meal-chip-day" data-i18n-en="Thu" data-i18n-es="Jue">Thu</span>
    <span class="dashboard-meal-chip-name">Turkey Sofrito Bowl</span>
  </div>

  <div class="dashboard-meal-chip">
    <img class="dashboard-meal-chip-img"
         src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&h=200&fit=crop&q=80"
         alt="Veggie Stir-Fry" loading="lazy">
    <span class="dashboard-meal-chip-day" data-i18n-en="Fri" data-i18n-es="Vie">Fri</span>
    <span class="dashboard-meal-chip-name">Veggie Stir-Fry</span>
  </div>

</div>
```

---

**Care team messages**

```html
<div class="dashboard-section-header">
  <h2 data-i18n-en="Care Team" data-i18n-es="Equipo de cuidado">Care Team</h2>
  <a href="/apps/patient/care-team/messages.html" data-i18n-en="Open" data-i18n-es="Abrir">Open</a>
</div>
<div class="card">
  <div class="card-body">

    <div class="dashboard-message-preview">
      <div class="dashboard-message-preview-avatar" aria-hidden="true">MC</div>
      <div class="dashboard-message-preview-body">
        <p class="dashboard-message-preview-sender">Maria Chen, RD</p>
        <p class="dashboard-message-preview-text" data-i18n-en="I've set up your meal plan for next week." data-i18n-es="He preparado tu plan de comidas para la semana.">I've set up your meal plan for next week.</p>
      </div>
      <span class="dashboard-message-preview-time">2:14 PM</span>
    </div>

    <div class="dashboard-message-preview mt-2">
      <div class="dashboard-message-preview-avatar" aria-hidden="true">JR</div>
      <div class="dashboard-message-preview-body">
        <p class="dashboard-message-preview-sender">James Rivera</p>
        <p class="dashboard-message-preview-text" data-i18n-en="Your delivery window is Thursday 11am–1pm." data-i18n-es="Tu ventana de entrega es el jueves 11am–1pm.">Your delivery window is Thursday 11am–1pm.</p>
      </div>
      <span class="dashboard-message-preview-time">8:02 AM</span>
    </div>

  </div>
</div>
```

---

### Scripts (in order)
```html
<script src="/src/scripts/components/i18n.js"></script>
<script src="/src/scripts/components/dashboard.js"></script>
<script src="/src/scripts/main.js" type="module"></script>
```

### Known Constraints
- No `<script>` blocks in HTML.
- Never `@apply` a semantic class inside another semantic class.
- Raw-CSS-only rules in `components.css` must begin with `@apply block;`.
- `dashboard-meal-scroll::-webkit-scrollbar` needs `@apply block;` as its first line to survive Tailwind v4 tree-shaking.
- The confirm callout uses `alert alert-warning alert-banner` — same classes as `meals/index.html`. Do not invent new classes for it.

---

## Prompt 5: Create `src/scripts/components/dashboard.js`

```js
/**
 * Dashboard screen
 * - Time-of-day greeting
 * - Hide confirm callout if meals already confirmed
 *   (reads localStorage key 'mealsConfirmed' set by meals.js)
 */

document.addEventListener('DOMContentLoaded', () => {
  // Time-of-day greeting
  const greetingEl = document.getElementById('dashboard-time-greeting');
  if (greetingEl) {
    const hour = new Date().getHours();
    const isSpanish = document.documentElement.lang === 'es' ||
      document.querySelector('[data-i18n-es]');

    let en, es;
    if (hour < 12) {
      en = 'Good morning'; es = 'Buenos días';
    } else if (hour < 18) {
      en = 'Good afternoon'; es = 'Buenas tardes';
    } else {
      en = 'Good evening'; es = 'Buenas noches';
    }

    const span = greetingEl.querySelector('span[data-i18n-en]');
    if (span) {
      span.setAttribute('data-i18n-en', en);
      span.setAttribute('data-i18n-es', es);
      span.textContent = en;
    }
  }

  // Hide confirm callout if meals are confirmed
  const confirmed = localStorage.getItem('mealsConfirmed') === 'true';
  if (confirmed) {
    const callout = document.querySelector('.dashboard-confirm-callout');
    if (callout) callout.style.display = 'none';
  }
});
```

**Note on localStorage:** This is a prototype-only pattern. The agent should add a comment to this effect in the file. No persistence architecture changes are needed.

---

## Verification

Verify at `http://localhost:5173/apps/patient/index.html`:

- [ ] Page loads without console errors
- [ ] Greeting shows correct time-of-day text (Good morning / afternoon / evening)
- [ ] Patient name "Maria" renders in serif
- [ ] Confirm callout visible by default (warning banner with Confirm button)
- [ ] Delivery snapshot card renders with icon, status, and ETA text
- [ ] Meal scroll row renders 5 chips; scroll works horizontally without visible scrollbar
- [ ] Each chip shows image, day abbreviation, and truncated meal name
- [ ] Care team section shows 2 message previews with initials avatars
- [ ] "Details", "See all", "Open" links navigate to correct screens
- [ ] "Confirm" button in callout links to `/apps/patient/meals/index.html`
- [ ] Bottom nav: Home tab active; 5 tabs visible
- [ ] i18n toggle works on all `data-i18n-en/es` strings

Then verify nav update across all existing screens:

- [ ] `meals/index.html` — 5 tabs, Meals active
- [ ] `deliveries/index.html` — 5 tabs, Delivery active
- [ ] `care-team/messages.html` — 5 tabs, Team active
- [ ] `care-team/feedback.html` — 5 tabs, Team active
- [ ] `profile/index.html` — 5 tabs, Profile active

---

## Completion Report

After verification passes, output:

```
## Completion Report — Patient Dashboard + 5-Tab Nav (PAT-DASH-01)

- New semantic classes added to components.css: [list]
- Existing classes modified: mobile-bottom-nav (grid-cols-4 → grid-cols-5)
- Files with nav updated: [list all 5]
- Judgment calls: [list, or "none"]
- Dark mode added: [list new classes with dark variants, or "none"]
- ANDREY-README.md updated: not applicable
- Schema delta logged: not applicable
- Items deferred or incomplete: [list, or "none"]
```

---

## Final Step

```bash
git add -A
git commit -m "feat(patient): add dashboard home screen and 5-tab nav (PAT-DASH-01)"
```

Then output:

---
**View your result:**
- Dashboard: http://localhost:5173/apps/patient/index.html
- Meals (nav check): http://localhost:5173/apps/patient/meals/index.html
- Profile (nav check): http://localhost:5173/apps/patient/profile/index.html
---
