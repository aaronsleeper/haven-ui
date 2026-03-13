# haven-ui — Component Documentation for Angular Integration

Haven-ui produces static HTML/CSS as the primary handoff format for Angular integration.
All styling uses semantic class names. Utility classes do not appear in component HTML.

---

## Getting Started (Browse in a Browser)

If you're pulling this repo to review progress on the patient app or any other screen,
this is the fastest path to seeing it live.

**Prerequisites:** Node.js 18+ and npm.

```bash
git pull
npm install
npm run dev
```

Vite starts at **http://localhost:5173** — open that in your browser.
`strictPort: true` is set, so if port 5173 is already occupied, Vite will fail loudly
rather than silently picking a different port. Free the port and retry.

No build step is needed for local review. Hot reload is active — CSS and HTML changes
appear in the browser immediately without refreshing.

---

## Patient App Screen Index

All patient screens live under `apps/patient/`. Open them directly at:

| Screen | URL |
|---|---|
| Patient dashboard | http://localhost:5173/apps/patient/index.html |
| Meals | http://localhost:5173/apps/patient/meals/index.html |
| Deliveries | http://localhost:5173/apps/patient/deliveries/index.html |
| Care team messages | http://localhost:5173/apps/patient/care-team/messages.html |
| Care team feedback | http://localhost:5173/apps/patient/care-team/feedback.html |
| Profile | http://localhost:5173/apps/patient/profile/index.html |
| Onboarding: Welcome | http://localhost:5173/apps/patient/onboarding/welcome.html |
| Onboarding: Consent | http://localhost:5173/apps/patient/onboarding/consent.html |
| Onboarding: Preferences | http://localhost:5173/apps/patient/onboarding/preferences.html |

Patient screens are designed at 430px width (iPhone 14 viewport). In Chrome DevTools,
use the device toolbar and set a custom size of 430 x 932 for the most accurate view.

---

## Angular Integration Notes

### Compiled stylesheet

1. `npm install` then `npm run build` to compile the theme to `dist/assets/haven-ui.css`
2. Copy `dist/assets/haven-ui.css` to your Angular project
3. Copy the HTML structure for any component you need (see sections below)
4. FontAwesome Pro v7.1.0 is used for icons -- you will need the local copy at `src/vendor/fontawesome/`
5. Preline UI JS is required for interactive components (dropdowns, modals, accordions, overlays)
   Load it once per page; in Angular it can go in `angular.json` scripts array:
   `node_modules/preline/dist/preline.js`

---

## Sidebar Navigation

A collapsible sidebar navigation component.

### Features

- Collapsible on mobile with overlay and hamburger toggle
- Accordion sub-menus with smooth transitions
- Semantic HTML (`nav`, `ul`, `li`) with clean class names
- FontAwesome Pro icons
- Fixed width on desktop, hidden off-screen on mobile

### HTML Structure

```html
<!-- Mobile trigger (place in your top bar) -->
<button type="button"
  data-hs-overlay="#application-sidebar"
  aria-controls="application-sidebar"
  aria-label="Toggle navigation">
  <i class="fa-solid fa-bars"></i>
</button>

<!-- Sidebar -->
<aside id="application-sidebar" class="app-sidebar">
  <nav class="sidebar-nav">
    <ul class="sidebar-nav-list">
      <li>
        <a href="#" class="sidebar-nav-item active">
          <i class="fa-solid fa-chart-line"></i>
          Dashboard
        </a>
      </li>
      <li>
        <a href="#" class="sidebar-nav-item">
          <i class="fa-solid fa-file-invoice-dollar"></i>
          Finance
        </a>
      </li>
    </ul>
  </nav>
</aside>
```

### Active State

Add `.active` to the `.sidebar-nav-item` anchor for the current page.

### Semantic Classes

All sidebar styles are in `src/styles/tokens/components.css` under `/* SIDEBAR NAVIGATION */`.

---

## Cards

The primary surface container.

```html
<div class="card">
  <div class="card-header">
    <h2 class="card-title">Title</h2>
    <p class="card-subtitle">Supporting text</p>
  </div>
  <div class="card-body">
    <!-- content -->
  </div>
</div>
```

---

## Badges / Status Tags

```html
<span class="badge badge-success">Active</span>
<span class="badge badge-warning">Pending</span>
<span class="badge badge-error">Issues</span>
<span class="badge badge-info">Info</span>
<span class="badge badge-neutral">Draft</span>
```

---

## Buttons

```html
<!-- Primary -->
<button class="btn-primary">Save</button>

<!-- Secondary -->
<button class="btn-secondary">Cancel</button>

<!-- Outline -->
<button class="btn-outline">Export</button>

<!-- Icon only -->
<button class="btn-icon">
  <i class="fa-solid fa-ellipsis-vertical"></i>
</button>
```

---

## Data Tables

```html
<div class="table-wrapper">
  <table class="data-table">
    <thead>
      <tr>
        <th>Name</th>
        <th>Status</th>
        <th>Amount</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Row value</td>
        <td><span class="badge badge-success">Active</span></td>
        <td>$8.00</td>
      </tr>
    </tbody>
  </table>
</div>
```

---

## Form Elements

Haven provides default styling for standard form elements with no additional classes needed:

```html
<label>Label text</label>
<input type="text" placeholder="Enter value">
<textarea rows="3"></textarea>
<select>
  <option>Option 1</option>
</select>
```

For a styled Haven select (custom chevron, no OS-native appearance):
```html
<select class="select-haven">
  <option>Option 1</option>
</select>
```

---

## Dropdowns

Preline UI handles dropdown behavior. Required class names (exact spelling matters -- Preline's autoInit scans for these):

```html
<div class="hs-dropdown relative inline-flex">
  <button type="button" class="hs-dropdown-toggle btn-outline"
    id="hs-dropdown-filter"
    aria-haspopup="menu"
    aria-expanded="false"
    aria-label="Filter">
    All Statuses <i class="fa-solid fa-chevron-down text-xs"></i>
  </button>
  <div class="hs-dropdown-menu" role="menu" aria-labelledby="hs-dropdown-filter">
    <a class="hs-dropdown-item" href="#">All Statuses</a>
    <a class="hs-dropdown-item" href="#">Active</a>
    <a class="hs-dropdown-item" href="#">Draft</a>
    <a class="hs-dropdown-item" href="#">Issues</a>
  </div>
</div>
```

**Preline v4 note:** The menu's open/closed state is driven by `display: none` (default) and `display: block` (open). Preline removes the `block` class and adds `hidden` on close. Do not add any additional Tailwind visibility utilities to the menu element -- Haven's `components.css` handles this entirely.

**Active item:**
```html
<a class="hs-dropdown-item active" href="#">All Statuses</a>
```

---

## JavaScript Requirements

- **Preline UI** is required for: sidebar overlay, dropdowns, modals, accordions, tooltips
- Include Preline JS once, at the bottom of `<body>`
- No other JS frameworks are used in Haven HTML output
- Page interaction scripts live in `src/scripts/components/` -- each file is scoped to one component

---

## Schema / Data Notes

Dummy data in `src/data/` follows Firebase schema shapes.
Any deviations from the Firebase schema are logged in `src/data/_schema-notes.md`.

---

## Patient App: i18n (Language Toggle)

The patient app supports bilingual text (English/Spanish) via `data-i18n-*` attributes.

### How It Works

Any element with both `data-i18n-en` and `data-i18n-es` attributes will have its `textContent` swapped when the user toggles language:

```html
<span data-i18n-en="Meals Today" data-i18n-es="Comidas Hoy">Meals Today</span>
```

- Default language is English (`en`)
- Language choice persists in `localStorage` under key `cena-lang`
- The `<html lang>` attribute updates on toggle
- JS module: `src/scripts/components/i18n.js` (include once per page)

### i18n Bar Partial

Include `src/partials/patient-i18n-bar.html` at the top of `<body>` on all patient screens. It renders a fixed 40px bar with a language toggle button.

### Mobile Shell

Patient app screens use a mobile-first layout:

```html
<body class="mobile-app">
  <!-- i18n bar partial here -->
  <div class="mobile-shell">
    <!-- page content -->
  </div>
</body>
```

- `mobile-app` on `<body>`: white background, disables desktop ambient blobs
- `mobile-shell` on inner wrapper: constrains to 430px, centers horizontally

### Semantic Classes

| Class | Element | Purpose |
|---|---|---|
| `mobile-app` | `<body>` | White bg, disable ambient blobs |
| `mobile-shell` | `<div>` | 430px max-width centered wrapper |
| `mobile-i18n-bar` | `<div>` | Fixed top bar (40px height) |
| `mobile-i18n-toggle` | `<button>` | Language toggle button |

---

## Patient App: Bottom Navigation

Fixed four-tab bar at the bottom of all post-onboarding patient screens.

### HTML Structure

```html
<nav class="mobile-bottom-nav" aria-label="Main navigation">
  <a href="/apps/patient/meals/index.html"
     class="mobile-bottom-nav-tab active"
     aria-current="page"
     aria-label="Meals">
    <i class="fa-solid fa-bowl-food"></i>
    <span>Meals</span>
  </a>
  <a href="/apps/patient/deliveries/index.html"
     class="mobile-bottom-nav-tab"
     aria-label="Delivery">
    <i class="fa-solid fa-truck"></i>
    <span>Delivery</span>
  </a>
  <a href="/apps/patient/care-team/messages.html"
     class="mobile-bottom-nav-tab"
     aria-label="Care Team, 2 unread messages">
    <span class="relative inline-flex">
      <i class="fa-solid fa-comments"></i>
      <span class="mobile-bottom-nav-badge">2</span>
    </span>
    <span>Care Team</span>
  </a>
  <a href="/apps/patient/profile/index.html"
     class="mobile-bottom-nav-tab"
     aria-label="Profile">
    <i class="fa-solid fa-circle-user"></i>
    <span>Profile</span>
  </a>
</nav>
```

### Active State

Add `.active` to the `.mobile-bottom-nav-tab` for the current page and set `aria-current="page"`. In Angular, use `routerLinkActive="active"`.

### Unread Badge

The `.mobile-bottom-nav-badge` shows an unread count on the Care Team tab. Hide it with `display: none` (or `*ngIf`) when the count is 0.

### Semantic Classes

| Class | Element | Purpose |
|---|---|---|
| `mobile-bottom-nav` | `<nav>` | Fixed bottom bar, 4-col grid, 430px max-width |
| `mobile-bottom-nav-tab` | `<a>` or `<button>` | Individual tab (icon + label, 64px min-height) |
| `mobile-bottom-nav-tab.active` | same | Active tab highlight (primary color text) |
| `mobile-bottom-nav-badge` | `<span>` | Absolute-positioned unread count badge (needs `relative` parent) |

---

## Patient App: Onboarding Progress

"Step N of 3" indicator used on onboarding screens.

```html
<p class="onb-progress" aria-label="Step 1 of 3">
  Step 1 of 3
</p>
```

| Class | Element | Purpose |
|---|---|---|
| `onb-progress` | `<p>` | Centered, small gray text for step indicator |

---

## Patient App: Meal Card

Horizontal card showing a meal photo, name, day label, diet tags, and optional swap link.

```html
<div class="meal-card">
  <img class="meal-card-img" src="[photo]" alt="[meal description]">
  <div class="meal-card-body">
    <p class="meal-card-name">Chicken Verde</p>
    <p class="meal-card-day">Monday</p>
    <div class="meal-card-tags">
      <span class="badge badge-info badge-pill">Low sodium</span>
    </div>
    <button class="meal-card-swap" aria-label="Swap Chicken Verde">Swap meal</button>
  </div>
</div>
```

| Class | Element | Purpose |
|---|---|---|
| `meal-card` | `<div>` | Outer card wrapper |
| `meal-card-img` | `<img>` | Photo thumbnail (80×80) |
| `meal-card-body` | `<div>` | Right-side text stack |
| `meal-card-name` | `<p>` | Meal name |
| `meal-card-day` | `<p>` | Day label |
| `meal-card-tags` | `<div>` | Tag row wrapper |
| `meal-card-swap` | `<button>` | Swap link (text style) |
| `meal-card.is-swapped` | modifier | Hides swap button after substitution |

---

## Patient App: Delivery Status Card

Large-format card showing delivery status with icon, label, timing, and meal summary.

```html
<div class="delivery-status-card">
  <div class="delivery-status-top">
    <i class="fa-solid fa-kitchen-set delivery-status-icon text-warning-500"></i>
    <p class="delivery-status-label">Getting your meals ready</p>
    <p class="delivery-status-timing">Arriving between 10am – 2pm</p>
  </div>
  <hr class="delivery-status-divider">
  <div class="delivery-summary">
    <p class="delivery-summary-label">What's coming</p>
    <p class="delivery-summary-count">5 meals</p>
    <ul class="delivery-summary-list">
      <li>Chicken Verde</li>
    </ul>
  </div>
</div>
```

| Class | Element | Purpose |
|---|---|---|
| `delivery-status-card` | `<div>` | Outer card (composes `.card` + `mx-4`) |
| `delivery-status-top` | `<div>` | Centered icon + label area |
| `delivery-status-icon` | `<i>` | Large status icon |
| `delivery-status-label` | `<p>` | Status text (serif font) |
| `delivery-status-timing` | `<p>` | Timing detail |
| `delivery-status-divider` | `<hr>` | Horizontal rule |
| `delivery-summary` | `<div>` | Meal summary section |
| `delivery-summary-label` | `<p>` | Section label |
| `delivery-summary-count` | `<p>` | Meal count |
| `delivery-summary-list` | `<ul>` | Meal name list |

---

## Patient App: Message Bubbles

SMS-style chat bubbles for patient messaging.

```html
<!-- Incoming -->
<div class="flex flex-col items-start mb-3">
  <p class="message-sender-label">Your dietitian</p>
  <div class="message-bubble-in">Message text</div>
  <p class="message-timestamp">9:14 AM</p>
</div>

<!-- Outgoing -->
<div class="flex flex-col items-end mb-3">
  <div class="message-bubble-out">Message text</div>
  <p class="message-timestamp">9:16 AM</p>
</div>
```

| Class | Element | Purpose |
|---|---|---|
| `message-bubble-out` | `<div>` | Outgoing (patient) bubble, right-aligned |
| `message-bubble-in` | `<div>` | Incoming (care team) bubble, left-aligned |
| `message-sender-label` | `<p>` | Sender role label above incoming bubble |
| `message-date-sep` | `<div>` | Date separator between day groups |
| `message-timestamp` | `<p>` | Timestamp below bubble |
| `message-new-pill` | `<button>` | Floating "new message" indicator |

---

## Patient App: Feedback Rating Card

Large tap-target rating option cards (Good / Okay / Not good).

```html
<fieldset class="feedback-rating-fieldset">
  <legend>Overall, how were your meals this week?</legend>
  <div class="grid grid-cols-3 gap-2">
    <label class="feedback-rating-card">
      <input type="radio" name="overall-rating" value="good" class="sr-only">
      <i class="fa-solid fa-thumbs-up"></i>
      <span>Good</span>
    </label>
    <!-- repeat for okay, bad -->
  </div>
</fieldset>
```

| Class | Element | Purpose |
|---|---|---|
| `feedback-rating-fieldset` | `<fieldset>` | Strips default fieldset border/padding |
| `feedback-rating-card` | `<label>` | Card wrapping sr-only radio input |

Selected state uses `:has(input:checked)` — no JS class toggle needed.

---

## Patient App: Preference Image Card

Visual checkbox card for cultural food preference selection.

```html
<label class="pref-image-card">
  <input type="checkbox" name="food-pref" value="latin-american" class="sr-only">
  <div class="pref-image-card-img-wrap">
    <img class="pref-image-card-img" src="[photo]" alt="Latin American cuisine">
    <div class="pref-image-card-check">
      <i class="fa-solid fa-check text-white text-sm"></i>
    </div>
  </div>
  <span class="pref-image-card-label">Latin American</span>
</label>
```

| Class | Element | Purpose |
|---|---|---|
| `pref-image-card` | `<label>` | Outer tappable wrapper |
| `pref-image-card-img-wrap` | `<div>` | Square image container with selection border |
| `pref-image-card-img` | `<img>` | Cuisine photo |
| `pref-image-card-check` | `<div>` | Checkmark overlay (visible on selection) |
| `pref-image-card-label` | `<span>` | Label below image |
| `pref-image-card-img-wrap-plain` | modifier | Icon-only variant for "No preference" |

JS: `src/scripts/components/pref-image-cards.js` enforces mutual exclusivity between "No preference" and other options.

---

## Patient App: Dashboard Message Preview (updated structure)

Care team message rows on the patient dashboard. Sender name and timestamp now share one baseline row via a `.dashboard-message-preview-header` wrapper.

```html
<div class="dashboard-message-preview">
  <div class="dashboard-message-preview-avatar" aria-hidden="true">MC</div>
  <div class="dashboard-message-preview-body">
    <div class="dashboard-message-preview-header">
      <p class="dashboard-message-preview-sender">Maria Chen, RD</p>
      <span class="dashboard-message-preview-time">2:14 PM</span>
    </div>
    <p class="dashboard-message-preview-text">I've set up your meal plan for next week.</p>
  </div>
</div>
```

| Class | Element | Purpose |
|---|---|---|
| `dashboard-message-preview` | `<div>` | Row wrapper — adds `border-b` between rows |
| `dashboard-message-preview-avatar` | `<div>` | Initials circle |
| `dashboard-message-preview-body` | `<div>` | Text column |
| `dashboard-message-preview-header` | `<div>` | **New** — flex row for sender + time on one baseline |
| `dashboard-message-preview-sender` | `<p>` | Sender name |
| `dashboard-message-preview-time` | `<span>` | Timestamp (moved inside `-header`) |
| `dashboard-message-preview-text` | `<p>` | Message preview text |

## Patient App: Dashboard Meal Chip Image Wrapper

Meal chip images now use a wrapper div for the `::after` inset border.

```html
<div class="dashboard-meal-chip">
  <div class="dashboard-meal-chip-img-wrap">
    <img src="..." alt="Meal name" loading="lazy">
  </div>
  <span class="dashboard-meal-chip-day">Mon</span>
  <span class="dashboard-meal-chip-name">Chicken Verde Rice Bowl</span>
</div>
```

| Class | Element | Purpose |
|---|---|---|
| `dashboard-meal-chip-img-wrap` | `<div>` | **New** — wrapper with `::after` inset border |

## Patient App: Alert Warning Button

New `.alert-warning-btn` class for action buttons inside warning alerts (amber, not teal).

```html
<a href="..." class="alert-warning-btn">Confirm</a>
```

---

## Questions / Updates

If component HTML or class names change, the agent will update this file as part of the same task.
Do not rely on a version of this file that is more than one sprint old.
