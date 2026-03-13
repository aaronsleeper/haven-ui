# haven-ui — Component Documentation for Angular Integration

Haven-ui produces static HTML/CSS as the primary handoff format for Angular integration.
All styling uses semantic class names. Utility classes do not appear in component HTML.

---

## How to Use This Repo

1. `npm install` then `npm run build` to compile the theme to `dist/assets/haven-ui.css`
2. Copy `dist/assets/haven-ui.css` to your Angular project
3. Copy the HTML structure for any component you need (see sections below)
4. FontAwesome Pro v7.1.0 is used for icons -- you will need the local copy at `src/vendor/fontawesome/`
5. Preline UI JS is required for interactive components (dropdowns, modals, accordions, overlays)
   CDN: `https://cdn.jsdelivr.net/npm/preline@2.6.0/dist/preline.min.js`

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

## Questions / Updates

If component HTML or class names change, the agent will update this file as part of the same task.
Do not rely on a version of this file that is more than one sprint old.
