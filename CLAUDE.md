# haven-ui — Agent Rules

Read the full task before taking any action. Complete it fully before stopping.

When done:
1. List every file modified and every new semantic class added to `components.css`
2. Run the following git commands from the repo root:
   ```
   git add -A
   git commit -m "[brief description of what was built]"
   ```
3. Output the local server URL so Aaron can review:
   - If `npm run dev` is already running: http://localhost:5173/[path/to/primary/file.html]
   - If not running: instruct Aaron to run `npm run dev` from the repo root, then visit the URL

Do not proceed to the next task — wait for review.

---

## Project Structure

haven-ui is the design system and UI prototype layer for Cena Health.
It produces static HTML/CSS that is the primary handoff format to Andrey for Angular integration.

```
haven-ui/
├── src/
│   ├── styles/
│   │   ├── main.css              # Entry: imports tokens + haven + components + preline
│   │   ├── haven.css             # Tailwind theme + Preline token overrides
│   │   └── tokens/
│   │       ├── colors.css        # All color tokens (@theme)
│   │       ├── typography.css    # Fonts, sizes, heading/body defaults
│   │       ├── spacing.css       # Spacing scalar
│   │       ├── defaults.css      # Form element defaults, shadows, surface vars
│   │       └── components.css    # ALL semantic component classes — edit here
│   ├── partials/                 # Shared HTML fragments (head, scripts, etc.)
│   ├── scripts/
│   │   ├── env/                  # Environment functions: data loading, chart config
│   │   └── components/           # Component-scoped interaction JS
│   └── data/                     # Dummy data as markdown (Firebase-schema-conformant)
│       ├── _schema-notes.md      # Delta log: deviations from Firebase schema
│       ├── shared/
│       └── personas/
│           ├── provider/
│           ├── kitchen/
│           ├── patient/
│           └── care-coordinator/
├── apps/
│   ├── provider/
│   ├── kitchen/
│   ├── patient/
│   ├── care-coordinator/
│   └── _prototypes/              # Exploratory work not tied to a persona
├── pattern-library/
├── dist/                         # Build output — NEVER edit directly
├── .project-docs/
│   ├── prompts/next-task.md      # Active agent prompt
│   ├── decisions-log.md
│   ├── roadmap.md
│   └── prompts-library.md
├── CLAUDE.md
├── vite.config.js
└── package.json
```

---

## File System Rules

### Never edit files in `dist/`

`dist/` is build output only. It is auto-generated and overwritten on every build.

| What you want to change | Edit this file |
|---|---|
| Colors, tokens | `src/styles/tokens/colors.css` |
| Semantic component classes | `src/styles/tokens/components.css` |
| Typography | `src/styles/tokens/typography.css` |
| Spacing | `src/styles/tokens/spacing.css` |
| Theme + Preline overrides | `src/styles/haven.css` |
| Page HTML | `apps/[persona]/**/*.html` |
| Shared partials | `src/partials/*.html` |

### Dev server and verification

- `npm run dev` runs Vite on `http://localhost:5173`, watching source files directly
- Changes to source CSS appear instantly via hot reload — no build step needed
- `npm run build` is only needed for Angular handoff, not for visual verification
- **Always verify at `http://localhost:5173` — not any other port.**
  `vite.config.js` uses `strictPort: true`. If 5173 is taken, Vite will fail loudly.

---

## Architecture: Semantic Classes, Not Utility Soup

**This is the most important rule.**

All styling goes in `src/styles/tokens/components.css` using `@apply` directives.
HTML files use clean semantic class names.

```html
<!-- Correct -->
<div class="card">
  <div class="card-header">
    <h2 class="card-title">Title</h2>
  </div>
  <div class="card-body">Content</div>
</div>

<!-- Wrong -->
<div class="flex flex-col bg-white border border-gray-200 shadow-sm rounded-xl">
  <div class="px-4 py-3 border-b border-gray-200">
    <h2 class="text-2xl font-semibold text-gray-800">Title</h2>
  </div>
</div>
```

### Rules

- Use existing semantic classes from `components.css` in HTML
- If a semantic class doesn't exist, add it to `components.css` with `@apply`, then use it in HTML
- Layout-only classes (e.g. `grid sm:grid-cols-3`) that apply only to the current template
  may appear in HTML — these are not component styling
- **Never** write `style="..."` attributes — exception: Chart.js `flex` values on pipeline
  segments (e.g., `style="flex: 65"`) are data-driven and acceptable
- **Never** write `<style>` blocks in HTML files

### Audit before building

Before creating or editing any file:

1. Check `src/styles/tokens/components.css` for existing classes
2. Check `src/partials/` for existing partials
3. Only then write or modify files

---

## JavaScript Rules

### Two categories of JS — each with a fixed location

**1. Environment functions** (data loading, chart config, utilities)
- Location: `src/scripts/env/`
- These are shared across the entire repo
- Reference them from HTML via `<script src="/src/scripts/env/[file].js"></script>`
- Or include via a partial (e.g., `src/partials/scripts-charts.html`)

**2. Component interaction JS** (accordion toggle, modal open/close, etc.)
- Location: `src/scripts/components/[component-name].js`
- Scoped to the component it serves
- Referenced from the HTML page that uses the component

### Inline script ban

- **No inline `<script>` blocks in HTML files**
- All JS must be in external files and referenced via `<script src="...">` tags
- Page scripts go at the bottom of `<body>`, before `</body>`, after partials

---

## Framework Usage

### Tailwind CSS v4 (CSS-first)

- Use `@import "tailwindcss";` — no `tailwind.config.js`
- Design tokens use `@theme` directive in `src/styles/tokens/colors.css`
- Semantic classes use `@apply` in `src/styles/tokens/components.css`
- Do not create `tailwind.config.js`

### Preline UI

- Used for interactive behavior (dropdowns, accordions, modals, overlays)
- Always copy the exact Preline HTML structure from the docs — do not invent Preline JS API calls
- Use Preline's `data-hs-*` attributes for JS behavior
- Apply Haven semantic classes instead of Preline's utility-heavy markup patterns
- A single accordion does not need `hs-accordion-group` wrapper
- Apply `.hs-accordion-toggle` to toggle buttons to neutralize Preline's hover background

### Icons

- **FontAwesome Pro v7.1.0** — local copy at `src/vendor/fontawesome/`
- Usage: `<i class="fa-solid fa-[icon-name]"></i>`
- Pro styles available: solid, regular, light, thin, duotone, sharp variants
- Never use Material Icons, Heroicons, emoji as icons, or any other icon library
- Never reference the FA CDN — always use the local copy

### Charts

- **Chart.js v4** via CDN only — no npm-installed chart libraries
- Every chart page must include `src/partials/scripts-charts.html` after base scripts
- Never write raw Chart.js config without using Haven defaults from `haven-chart-config.js`
- Always use `HAVEN.*` constants for colors — never hardcode hex values
- **Never use pie or donut charts.** Use stat cards, bar charts, or numeric comparisons.
  This is a firm design principle (Tufte).

### No frameworks in HTML output

- No React, Vue, Angular, or any npm-installed JS framework in HTML files
- No `localStorage` or `sessionStorage`
- Pure HTML / CSS / vanilla JS only
- Angular integration is Andrey's responsibility — deliver clean HTML/CSS

---

## Data Rules

- All dummy data lives in `src/data/`
- Data files are markdown (`.md`) formatted to reflect Firebase schema shapes
- Any delta from Firebase schema must be documented in `src/data/_schema-notes.md`
  before building pages that depend on that data

---

## CDN Resources (Use These Exact Versions)

```html
<!-- Haven UI compiled theme (always first) -->
<link rel="stylesheet" href="/dist/assets/haven-ui.css">

<!-- FontAwesome Pro (local) -->
<link rel="stylesheet" href="/src/vendor/fontawesome/css/all.css">

<!-- Preline JS (for interactive components) -->
<script src="https://cdn.jsdelivr.net/npm/preline@2.6.0/dist/preline.min.js"></script>

<!-- Chart.js v4 (only on pages with charts) -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js"></script>

<!-- Chart.js annotation plugin (only on pages with zone bands / reference lines) -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/chartjs-plugin-annotation/3.1.0/chartjs-plugin-annotation.min.js"></script>

<!-- Leaflet CSS (only on pages with a map) -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css">

<!-- Leaflet JS (only on pages with a map) -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js"></script>

<!-- Haven chart config (after Chart.js, before page chart scripts) -->
<script src="/src/scripts/env/haven-chart-config.js"></script>
```

Only include Chart.js, annotation plugin, and Leaflet on pages that actually use them.

---

## Verification Checklist

After completing any build task:

- [ ] Verified at `http://localhost:5173` (not any other port)
- [ ] HTML classes are semantic — no utility chains
- [ ] Layout-only utilities are acceptable in HTML (one-off template layout)
- [ ] All new classes added to `src/styles/tokens/components.css` with `@apply` definitions
- [ ] No `style="..."` attributes (except data-driven flex values on pipeline segments)
- [ ] No `<script>` blocks in HTML files
- [ ] All JS in external files under `src/scripts/`
- [ ] Chart.js colors use `HAVEN.*` constants, no hardcoded hex
- [ ] Preline interactive components open/close correctly
- [ ] Layout holds at ~768px width
- [ ] No files edited in `dist/`
- [ ] Any new dummy data schema deltas documented in `src/data/_schema-notes.md`

---

## Common Icon Reference

| Concept | Icon | Style |
|---------|------|-------|
| Alert / Warning | `fa-triangle-exclamation` | solid |
| Clinical | `fa-stethoscope` | solid |
| Delivery | `fa-truck` | solid |
| Social | `fa-people-group` | solid |
| Safety | `fa-shield-halved` | solid |
| Patient | `fa-user` | solid |
| Check / Resolved | `fa-circle-check` | solid |
| Unresolved | `fa-circle-exclamation` | solid |
| Chart / Reports | `fa-chart-line` | solid |
| Escalate | `fa-arrow-up-right-from-square` | solid |
| Session / Visit | `fa-circle-play` | solid |
| Timeline | `fa-clock-rotate-left` | solid |
| Care Plan | `fa-file-medical` | solid |
| Medication | `fa-pills` | solid |
| AI Insight | `fa-bolt` | solid |
| Print | `fa-print` | solid |
| Export | `fa-file-csv` | solid |
| Filter | `fa-filter` | solid |
| Sort | `fa-sort` | solid |

---

## ANDREY-README.md

`ANDREY-README.md` documents component HTML and integration notes for Angular handoff.
If you add a new component or change any class names or HTML structure that Andrey would use,
update `ANDREY-README.md` in the same task. Do not leave it stale.

---

## Documentation

- **Tailwind:** https://tailwindcss.com/docs
- **Preline:** https://preline.co/docs/index.html
- **Chart.js:** https://www.chartjs.org/docs/latest/
