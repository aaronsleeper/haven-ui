# Component Map: Patient Assessments & Self-Report

**Date:** 2026-03-31
**Source wireframes:** `wireframes/assess-01` through `assess-05`, `tasks-01`, `dashboard-tasks-section`
**components.css read:** 2026-03-31 (fresh)
**COMPONENT-INDEX.md read:** 2026-03-31 (fresh)

---

## Component Inventory Summary

**Existing components used:** 28 classes across existing components
**New components needed:** 4
**Utility-only patterns:** 2 (one-off layout adjustments)

---

## New Components Required

| Component | Spec File | Priority | Preline Base | Used In |
|-----------|-----------|----------|--------------|---------|
| `task-card` | `new-components/task-card.md` | Required | None | Dashboard tasks section, tasks-01 |
| `trend-card` | `new-components/trend-card.md` | Required | None | assess-01 |
| `emoji-scale` | `new-components/emoji-scale.md` | Required | None | assess-03 |
| `assess-slider` | `new-components/assess-slider.md` | Required | None | assess-03 |

**Note:** `assess-progress` (flagged in wireframes) reuses `onb-progress` with minor adaptation — not a new component. The existing `.onb-progress` class works with dynamic "Question N of M" text; it just needs the progress bar element added below the text. This is a small addition to the existing class, not a new component.

---

## Existing Components Used

| Component | Classes | Used In |
|-----------|---------|---------|
| Mobile Shell | `mobile-app`, `mobile-shell` | All screens |
| Mobile i18n Bar | `mobile-i18n-bar`, `mobile-i18n-toggle` | All screens |
| Mobile Bottom Nav | `mobile-bottom-nav`, `mobile-bottom-nav-tab`, `mobile-bottom-nav-badge` | assess-01, assess-05, tasks-01 |
| Card | `card`, `card-body`, `card-header`, `card-title`, `card-footer` | All screens |
| Stat Card | `card-stat`, `stat-label`, `stat-value` | assess-05 current status |
| Buttons | `btn-primary`, `btn-outline`, `btn-icon`, `btn-sm`, `btn-loading` | All screens |
| Badge | `badge`, `badge-primary`, `badge-warning`, `badge-success`, `badge-sm`, `badge-pill` | tasks-01, assess-01, assess-05 |
| Trend Badge | `trend-badge`, `trend-improving`, `trend-flat`, `trend-worsening` | assess-01, assess-05 |
| Alert | `alert`, `alert-error`, `alert-icon` | Error states |
| Empty State | `empty-state`, `empty-state-icon` | assess-01, tasks-01 |
| Text Link | `text-link` | Multiple |
| Spinner | `spinner`, `spinner-container-vertical`, `spinner-label` | Loading states |
| Skeleton | `skeleton`, `skeleton-text` | Loading states |
| Avatar | `avatar`, `avatar-sm`, `avatar-xl`, `avatar-primary`, `avatar-secondary`, `avatar-neutral` | task-card icons, assess-02 category icon |
| Onboarding Progress | `onb-progress` | assess-03 (adapted) |
| Pref Row | `pref-row`, `pref-row-indicator`, `pref-row-indicator--circle`, `pref-row-label` | assess-03 radio questions |
| Feedback Rating Card | `feedback-rating-card`, `feedback-rating-fieldset` | Pattern reference for emoji-scale |
| Chart Containers | `chart-canvas-wrapper`, `chart-sparkline`, `chart-line` | assess-01, assess-05 |
| Accordion | Preline `hs-accordion` | assess-05 educational card, tasks-01 completed section |
| Bottom Sheet | `bottom-sheet-panel`, Preline `hs-overlay` | Not used in v1 (future enhancement) |
| Divider | `divider` | assess-01 between sections |

---

## Screen: Dashboard Tasks Section

**Wireframe source:** `wireframes/dashboard-tasks-section.md`

### Recipe

1. **Placement:** Insert above existing dashboard content in `apps/patient/index.html`
2. **Section header:**
   - `<div class="flex items-center justify-between px-4 mt-6 mb-2">`
   - Left: `<p class="text-xs font-semibold text-sand-500 uppercase tracking-wide">` — "Tasks" / "Tareas"
   - Right (conditional, >3 tasks): `<a class="text-link text-xs" href="tasks/index.html">` — "See all ([N])" / "Ver todas ([N])"
3. **Task cards:** `<div class="space-y-2 px-4">` — up to 3 `task-card` components, sorted by urgency
4. **Visibility:** Entire section hidden via JS when 0 tasks

### Data Bindings
- Task list from dummy data in `src/data/patient/assessments/`
- Count for "See all" badge is total outstanding tasks

### Preline Interactions
None.

---

## Screen: TASKS-01 Task List

**Wireframe source:** `wireframes/tasks-01-task-list.md`

### Recipe

1. **Shell:** `mobile-shell` with `mobile-app` body class, `pb-[64px]`
2. **i18n bar:** `mobile-i18n-bar` partial
3. **Bottom nav:** `mobile-bottom-nav` partial — no tab highlighted
4. **Header:**
   - `<div class="flex items-center px-4 pt-4 pb-2">`
   - Back: `.btn-icon` `fa-chevron-left` → dashboard
   - Title: `<h1 class="text-lg font-display font-semibold ml-2">` — "Tasks" / "Tareas"
   - Right: `.badge.badge-primary.badge-pill.badge-sm` — count
5. **Task list:** `<div class="space-y-2 px-4 mt-4">` — all outstanding `task-card` components
6. **Completed section:** Preline `hs-accordion` — "Completed" / "Completados" header, collapsed by default
   - Inside: muted `task-card` variants with `fa-circle-check text-success-500` replacing chevron
7. **Empty state:** `.empty-state` — `fa-circle-check text-sand-200`, "You're all caught up" / "Está al día"

### Data Bindings
- Task list from dummy data
- Completed tasks from dummy data (last 7 days)

### Preline Interactions
- `hs-accordion` for completed section

---

## Screen: ASSESS-01 My Health (Hub)

**Wireframe source:** `wireframes/assess-01-my-health.md`

### Recipe

1. **Shell:** `mobile-shell` with `mobile-app` body class, `pb-[64px]`
2. **i18n bar:** `mobile-i18n-bar` partial
3. **Bottom nav:** `mobile-bottom-nav` partial — **Health** tab active (`fa-heart-pulse`)
4. **Header:**
   - `<div class="px-4 pt-6 pb-2">`
   - `<h1>` — "My Health" / "Mi Salud"
   - `<p class="text-sm text-sand-500">` — subtitle
5. **Trends section:**
   - Section label: `<p class="text-xs font-semibold text-sand-500 uppercase tracking-wide px-4 mb-2">`
   - `<div class="space-y-3 px-4">` — stack of `trend-card` components
6. **Wearable placeholder:** `.card mx-4 mt-6` — `bg-sand-50 border-sand-200`, `fa-watch text-sand-300`, disabled appearance
7. **Empty state:** `.empty-state` — `fa-chart-line text-sand-200`

### Data Bindings
- Trend data from dummy historical assessment responses

### Preline Interactions
None.

---

## Screen: ASSESS-02 Assessment Intro

**Wireframe source:** `wireframes/assess-02-assessment-intro.md`

### Recipe

1. **Shell:** `mobile-shell` with `mobile-app` body class. **No bottom nav.**
2. **i18n bar:** `mobile-i18n-bar` partial
3. **Header:** `.btn-icon` `fa-chevron-left` top-left
4. **Content:** vertically centered `<div class="px-6 py-8 flex flex-col items-center text-center">`
   - Category icon: `.avatar.avatar-xl.[category-color]` with FA icon
   - Title: `<h1 class="text-xl font-display font-semibold">`
   - Description: `<p class="text-sm text-sand-500 mt-2 max-w-xs">`
   - Time estimate: `<p class="text-xs text-sand-400 mt-3">` with `fa-clock`
   - Section label (PRAPARE): `<p class="text-xs text-sand-400 mt-1">`
5. **Footer:** `<div class="px-6 pb-8 mt-auto">`
   - `.btn-primary` full width — "Start" / "Comenzar"
   - Privacy note: `<p class="text-xs text-sand-400 text-center mt-3">`

### Data Bindings
- Assessment metadata from definition file (title, description, estimated_minutes, category)

### Preline Interactions
None.

---

## Screen: ASSESS-03 Assessment Question

**Wireframe source:** `wireframes/assess-03-question.md`

### Recipe

1. **Shell:** `mobile-shell` with `mobile-app` body class. **No bottom nav.**
2. **i18n bar:** `mobile-i18n-bar` partial
3. **Header:**
   - `<div class="flex items-center justify-between px-4 pt-4 pb-2">`
   - Left: `.btn-icon` `fa-chevron-left` (back/previous)
   - Center: adapted `.onb-progress` — "Question N of M" + progress bar. Hidden for 1–2 question check-ins.
   - Right: `.btn-icon` `fa-xmark` (save and exit)
4. **Question text:**
   - `<div class="px-6 pt-6">`
   - `<p class="text-lg font-medium leading-relaxed">` — question text
   - Helper: `<p class="text-sm text-sand-400 mt-1">` (conditional)
5. **Response area:** `<div class="px-6 pt-6 pb-4">` — renders one of:
   - **radio:** stacked `.pref-row` cards with `.pref-row-indicator--circle` (existing pattern)
   - **emoji-scale:** `emoji-scale` component (new) — horizontal row of 5 circular tappable options
   - **slider:** `assess-slider` component (new) — styled `<input type="range">`
   - **yes-no:** two `.card` elements in `grid grid-cols-2 gap-3` with `:has(input:checked)` (utility pattern, no new class needed — similar to `feedback-rating-card` but simpler)
   - **free-text:** `<textarea>` element default + character counter `<p class="text-xs text-sand-400 text-right mt-1">`
6. **Footer:**
   - `<div class="sticky bottom-0 bg-white border-t border-sand-200 px-6 py-4">`
   - `.btn-primary` full width — "Next" / "Submit" (disabled until answered for required questions)
   - Optional skip: `<a class="text-link text-sm text-sand-400">`

### Data Bindings
- Question text, options, type from assessment definition file
- Current question index and total for progress

### Preline Interactions
None — all interaction is vanilla JS (question navigation, answer selection, progress tracking).

---

## Screen: ASSESS-04 Assessment Complete

**Wireframe source:** `wireframes/assess-04-complete.md`

### Recipe

1. **Shell:** `mobile-shell` with `mobile-app` body class. **No bottom nav.**
2. **i18n bar:** `mobile-i18n-bar` partial
3. **Content:** vertically centered
   - `fa-circle-check text-success-500 text-4xl`
   - `<h1>` — "Thank you" / "Gracias"
   - `<p class="text-sm text-sand-500 mt-2 max-w-xs">` — category-specific message
4. **Follow-up card (conditional):** `.card mx-4 mt-6 bg-teal-50 border-teal-200`
   - `.card-body`: `fa-clipboard-list text-teal-500` + text + `.btn-primary.btn-sm`
5. **Reassurance card (conditional):** `.card mx-4 mt-4 bg-teal-50 border-teal-200`
   - `.card-body`: `fa-hand-holding-heart text-teal-500` + text
6. **PRAPARE section complete (conditional):** heading + message + `.btn-primary` "Next section" + `.btn-outline` "Take a break"
7. **Footer:**
   - `.btn-primary` or `.btn-outline` full width — "Done" / "Listo"
   - `<a class="text-link text-sm text-sand-400 mt-3">` — "View my progress"

### Data Bindings
- Category from completed assessment
- Follow-up assessment ID (if queued)
- Flagged response boolean

### Preline Interactions
None.

---

## Screen: ASSESS-05 Metric Detail

**Wireframe source:** `wireframes/assess-05-metric-detail.md`

### Recipe

1. **Shell:** `mobile-shell` with `mobile-app` body class, `pb-[64px]`
2. **i18n bar:** `mobile-i18n-bar` partial
3. **Bottom nav:** `mobile-bottom-nav` partial — **Health** tab active
4. **Header:**
   - `.btn-icon` `fa-chevron-left` + `<h1 class="text-lg font-display font-semibold ml-2">` — metric label
5. **Current status card:** `.card mx-4 mt-4`
   - `.card-body` two-column: current value label (`text-2xl font-semibold`) + last recorded date + `trend-badge`
6. **Trend chart:** `<div class="px-4 mt-6">`
   - `.chart-canvas-wrapper.chart-line` — Chart.js line chart with all historical data
   - Zone bands for scored assessments: `chartjs-plugin-annotation` rectangle annotations in Haven palette tints
   - Emoji data points for check-ins: Chart.js image/emoji point styles
   - Colors via `HAVEN.*` constants
   - Requires `scripts-charts.html` partial + `haven-chart-config.js`
7. **History list:** `<div class="px-4 mt-6">`
   - Section label: uppercase tracking text
   - Rows: `<div class="flex items-center justify-between py-3 border-b border-sand-100">`
   - Date left, value + badge right
   - "Show more" `text-link` if >10 entries
8. **Educational card:** `.card mx-4 mt-6 bg-sand-50 border-sand-200` — Preline `hs-accordion`, collapsed by default on return visits
   - Label + explanation text from assessment definition file

### Data Bindings
- Historical response data (dummy, hardcoded for prototype)
- Assessment metadata for educational content

### Preline Interactions
- `hs-accordion` for educational card collapse/expand

---

## Bottom Nav Update

The `mobile-bottom-nav` partial (`src/partials/patient-bottom-nav.html`) already uses `grid-cols-5` in `components.css`. The 5th tab needs to be added:

```html
<a href="/apps/patient/health/index.html" class="mobile-bottom-nav-tab">
  <i class="fa-solid fa-heart-pulse"></i>
  <span data-i18n-en="Health" data-i18n-es="Salud">Health</span>
</a>
```

Insert between Delivery and Care Team tabs.
