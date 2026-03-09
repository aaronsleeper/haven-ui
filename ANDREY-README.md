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

## Questions / Updates

If component HTML or class names change, the agent will update this file as part of the same task.
Do not rely on a version of this file that is more than one sprint old.
