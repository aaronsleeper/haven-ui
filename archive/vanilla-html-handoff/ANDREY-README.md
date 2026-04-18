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
| Tasks | http://localhost:5173/apps/patient/tasks/index.html |
| My Health (trends) | http://localhost:5173/apps/patient/health/index.html |
| Assessment: PHQ-2 | http://localhost:5173/apps/patient/health/assessment.html?id=phq-2 |
| Assessment: Mood check-in | http://localhost:5173/apps/patient/health/assessment.html?id=mood-checkin&mode=checkin |
| Assessment: Hunger Vital Sign | http://localhost:5173/apps/patient/health/assessment.html?id=hunger-vital-sign |
| Metric Detail: Mood | http://localhost:5173/apps/patient/health/metric.html?id=mood |
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

Fixed six-tab bar at the bottom of all post-onboarding patient screens.

### HTML Structure

```html
<nav class="mobile-bottom-nav" aria-label="Main navigation">
  <a href="/apps/patient/index.html"
     class="mobile-bottom-nav-tab"
     data-nav-tab="home"
     aria-label="Home">
    <i class="fa-solid fa-house"></i>
    <span>Home</span>
  </a>
  <a href="/apps/patient/meals/index.html"
     class="mobile-bottom-nav-tab"
     data-nav-tab="meals"
     aria-label="Meals">
    <i class="fa-solid fa-bowl-food"></i>
    <span>Meals</span>
  </a>
  <a href="/apps/patient/deliveries/index.html"
     class="mobile-bottom-nav-tab"
     data-nav-tab="deliveries"
     aria-label="Delivery">
    <i class="fa-solid fa-truck"></i>
    <span>Delivery</span>
  </a>
  <a href="/apps/patient/health/index.html"
     class="mobile-bottom-nav-tab"
     data-nav-tab="health"
     aria-label="Health">
    <i class="fa-solid fa-heart-pulse"></i>
    <span>Health</span>
  </a>
  <a href="/apps/patient/care-team/messages.html"
     class="mobile-bottom-nav-tab"
     data-nav-tab="care-team"
     aria-label="Care Team">
    <span class="relative inline-flex">
      <i class="fa-solid fa-comments"></i>
      <span class="mobile-bottom-nav-badge">2</span>
    </span>
    <span>Team</span>
  </a>
  <a href="/apps/patient/profile/index.html"
     class="mobile-bottom-nav-tab"
     data-nav-tab="profile"
     aria-label="Profile">
    <i class="fa-solid fa-circle-user"></i>
    <span>Profile</span>
  </a>
</nav>
```

### Active State

Active tab is set automatically by `src/scripts/components/patient-nav-active.js` based on the `data-nav-tab` attribute and the current pathname. In Angular, use `routerLinkActive="active"`.

### Unread Badge

The `.mobile-bottom-nav-badge` shows an unread count on the Care Team tab. Hide it with `display: none` (or `*ngIf`) when the count is 0.

### Semantic Classes

| Class | Element | Purpose |
|---|---|---|
| `mobile-bottom-nav` | `<nav>` | Fixed bottom bar, 6-col grid, 430px max-width |
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

## Panel Splitter (Resizable Panels)

Drag-to-resize handles between panels (VS Code / Obsidian-style). Used in the care coordinator three-panel layout and reusable across all multi-panel apps.

### HTML

Place a splitter `<div>` between sibling panels:

```html
<div class="flex h-screen overflow-hidden">
  <aside class="w-60 shrink-0 queue-sidebar" style="min-width: 180px; max-width: 400px;">
    <!-- left panel content -->
  </aside>

  <div class="panel-splitter" data-panel-splitter data-target="previous" data-min="180" data-max="400"></div>

  <main class="flex-1 min-w-0">
    <!-- center panel content -->
  </main>

  <div class="panel-splitter" data-panel-splitter data-target="next" data-min="300" data-max="520"></div>

  <aside class="w-[380px] shrink-0" style="min-width: 300px; max-width: 520px;">
    <!-- right panel content -->
  </aside>
</div>
```

### Attributes

| Attribute | Required | Values | Default |
|---|---|---|---|
| `data-panel-splitter` | yes | *(presence)* | — |
| `data-target` | no | `previous`, `next` | `previous` |
| `data-min` | no | px value | `120` |
| `data-max` | no | px value | `600` |

### Classes

| Class | Purpose |
|---|---|
| `.panel-splitter` | 5px vertical drag handle with hover highlight |
| `.queue-sidebar` | Warm tinted sidebar background (`sand-50`) |
| `.queue-list` | Left padding on queue item container for urgency border visibility |

### JS

Load `src/scripts/components/panel-splitter.js` after `main.js`. It self-initializes on `[data-panel-splitter]` elements. No API — the drag behavior sets inline width/min-width/max-width on the target panel.

### Angular integration

Replace the vanilla JS with Angular `(mousedown)` binding or a directive. The CSS classes and data attributes remain the same. Store panel widths in user preferences if persistence is desired.

---

## Patient App: Task Card

Tappable card for outstanding patient tasks (assessments, check-ins, future task types).

```html
<a href="/apps/patient/health/assessment.html?id=phq-2" class="task-card">
  <div class="task-card-icon">
    <span class="avatar avatar-sm avatar-primary"><i class="fa-solid fa-brain"></i></span>
  </div>
  <div class="task-card-content">
    <p class="task-card-name">How have you been feeling?</p>
    <p class="task-card-meta">About 2 min</p>
  </div>
  <i class="fa-solid fa-chevron-right text-sand-300"></i>
</a>
```

| Class | Element | Purpose |
|---|---|---|
| `task-card` | `<a>` or `<div>` | Outer tappable row |
| `task-card-icon` | `<div>` | Left icon container (wraps an `avatar`) |
| `task-card-content` | `<div>` | Center column (name + metadata) |
| `task-card-name` | `<p>` | Task title, truncated |
| `task-card-meta` | `<p>` | Time estimate, due date, or status |
| `task-card-overdue` | modifier | Left border in warning color — add overdue `badge-warning badge-sm` in metadata |
| `task-card-in-progress` | modifier | Left border in teal |
| `task-card-completed` | modifier | Muted opacity, replaces chevron with `fa-circle-check` |

Category icons: `fa-brain` (behavioral), `fa-people-group` (SDOH), `fa-utensils` (dietary), `fa-face-smile` (check-in). Avatar colors: `avatar-primary`, `avatar-secondary`, `avatar-neutral`.

---

## Patient App: Trend Card

Tappable card showing a health metric trend with sparkline chart.

```html
<a href="/apps/patient/health/metric.html?id=mood" class="trend-card">
  <div class="trend-card-header">
    <div>
      <p class="text-sm font-medium">Mood</p>
      <p class="text-xs text-sand-400">Last: Mar 28</p>
    </div>
    <span class="trend-badge trend-improving">
      <i class="fa-solid fa-arrow-up text-[10px]"></i> Improving
    </span>
  </div>
  <div class="trend-card-chart">
    <div class="chart-canvas-wrapper chart-sparkline">
      <canvas id="trend-mood"></canvas>
    </div>
  </div>
</a>
```

| Class | Element | Purpose |
|---|---|---|
| `trend-card` | `<a>` | Tappable card wrapper |
| `trend-card-header` | `<div>` | Flex row: metric label + trend badge |
| `trend-card-chart` | `<div>` | Sparkline chart container |

Requires Chart.js. Sparkline is rendered via JS using `HAVEN.primary[600]` for line color.

---

## Patient App: Emoji Scale

Horizontal emoji/icon rating selector for assessment questions.

```html
<fieldset class="emoji-scale">
  <legend class="sr-only">How are you feeling?</legend>
  <label class="emoji-scale-option">
    <input type="radio" name="mood" value="1" class="sr-only">
    <span class="emoji-scale-icon">😫</span>
    <span class="emoji-scale-label">Awful</span>
  </label>
  <!-- repeat for each option (3-5 total) -->
</fieldset>
```

| Class | Element | Purpose |
|---|---|---|
| `emoji-scale` | `<fieldset>` | Horizontal flex row, no border |
| `emoji-scale-option` | `<label>` | Tappable option (wraps sr-only radio) |
| `emoji-scale-icon` | `<span>` | Emoji or FA icon |
| `emoji-scale-label` | `<span>` | Text label below icon |

Selected state uses `:has(input:checked)` — teal ring + bold label. No JS class toggle needed.

---

## Patient App: Assessment Slider

Styled range input for visual analog scale questions (pain level, energy, etc.).

```html
<div class="assess-slider">
  <p class="assess-slider-value" aria-live="polite">5</p>
  <input type="range" class="assess-slider-track" min="0" max="10" value="5" step="1" aria-label="Pain level">
  <div class="assess-slider-labels">
    <span>No pain</span>
    <span>Worst pain</span>
  </div>
</div>
```

| Class | Element | Purpose |
|---|---|---|
| `assess-slider` | `<div>` | Outer wrapper |
| `assess-slider-value` | `<p>` | Current value display (updated by JS) |
| `assess-slider-track` | `<input>` | Styled range input, 44px thumb |
| `assess-slider-labels` | `<div>` | Min/max endpoint labels |

JS: `src/scripts/components/assess-slider.js` — updates the fill gradient and value display on input. Self-initializes on `.assess-slider-track` elements.

---

## Patient App: Assessment Progress Bar

Question stepper progress indicator for multi-question assessments.

```html
<div class="assess-progress" aria-label="Question 3 of 9">
  Question 3 of 9
  <span class="assess-progress-bar">
    <span class="assess-progress-fill" style="width: 33%"></span>
  </span>
</div>
```

| Class | Element | Purpose |
|---|---|---|
| `assess-progress` | `<div>` | Text label + progress bar wrapper |
| `assess-progress-bar` | `<span>` | Track (sand background) |
| `assess-progress-fill` | `<span>` | Fill bar (teal), width set via inline style or JS |

Hidden for assessments with 1-2 questions (unnecessary chrome).

---

## Patient App: Assessment Flow

The assessment flow (`health/assessment.html`) is a single-page JS-driven experience with three states: Intro → Questions → Complete.

### JS Architecture

`src/scripts/components/assessment.js` contains:
- Assessment definitions (questions, options, scoring rules) as a JS object
- Question type renderers: `radio`, `emoji-scale`, `slider`, `yes-no`, `free-text`
- State machine: intro → question[n] → complete
- Scoring logic: sum-based (PHQ-2) and flag-any-yes (Hunger Vital Sign)
- Follow-up queuing: if PHQ-2 score ≥ 3, completion screen shows a "Continue" card linking to PHQ-9
- Slide transitions between questions (CSS translateX, 200ms)

### URL Parameters

| Param | Values | Effect |
|---|---|---|
| `id` | `phq-2`, `mood-checkin`, `hunger-vital-sign` | Which assessment to load |
| `mode` | `checkin` | Skips intro screen, goes straight to first question |

### Angular Integration

Replace the hardcoded `ASSESSMENTS` object with an API call to load assessment definitions. The renderer logic (question type → HTML template) maps directly to Angular template directives. Each question type is a natural Angular component.

---

## Questions / Updates

If component HTML or class names change, the agent will update this file as part of the same task.
Do not rely on a version of this file that is more than one sprint old.
