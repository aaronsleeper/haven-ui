# TASKS-01: Tasks (Full List)

**Application:** Patient App (Mobile)
**Use Case(s):** PT-ASSESS-001, PT-ASSESS-002 (and future task types)
**User Type:** Patient
**Device:** Mobile-first
**Route:** `/apps/patient/tasks/index.html`

## Page Purpose

Shows all outstanding tasks the patient needs to complete. The patient arrives here from the dashboard's "See all tasks" link. Tasks are sorted by urgency (overdue first, then nearest due date). Each task is a link to its action — for v1, that's always an assessment or check-in. The page is designed to accommodate future task types (measurements, appointments, documentation, meal orders) without structural changes.

---

## Layout Structure

### Shell
- `mobile-shell` with `mobile-app` body class
- `mobile-i18n-bar` fixed at top
- `mobile-bottom-nav` — no tab highlighted (Tasks is accessed from dashboard, not a tab)
- Padding bottom: `pb-[64px]`

### Header Zone
- `<div class="flex items-center px-4 pt-4 pb-2">`
- Back button: `<button class="btn-icon">` with `fa-chevron-left` — returns to dashboard
- Title: `<h1 class="text-lg font-display font-semibold ml-2">` — "Tasks" / "Tareas"
- Right: count badge `<span class="badge badge-primary badge-pill badge-sm">` — e.g., "5"

### Content Zone

#### Task List
- `<div class="space-y-2 px-4 mt-4">`
- Stack of task cards, sorted: overdue → due soonest → no due date

**Task Card:**
- `[NEW COMPONENT: task-card]`
- `.card` — full-width tappable row
- `.card-body` — horizontal layout:
  - Left: task type icon in a colored circle (`avatar avatar-sm`)
    - Assessment (behavioral): `fa-brain` in `avatar-primary`
    - Assessment (SDOH): `fa-people-group` in `avatar-secondary`
    - Assessment (dietary): `fa-utensils` in `avatar-neutral`
    - Check-in: `fa-face-smile` in `avatar-primary`
    - Future — Measurement: `fa-weight-scale`
    - Future — Appointment: `fa-calendar-check`
    - Future — Document: `fa-file-upload`
    - Future — Meal order: `fa-utensils`
  - Center column:
    - Task name: `<p class="text-sm font-medium">` — e.g., "How have you been feeling?" / "¿Cómo se ha sentido?"
    - Metadata line: `<p class="text-xs text-sand-400">`
      - Estimated time if available: "About 2 min" / "Aprox. 2 min"
      - Due date if available: "Due Mar 31" / "Vence 31 mar"
      - For in-progress: "In progress" / "En progreso" in `text-teal-600`
  - Right: `fa-chevron-right text-sand-300`
- **Overdue variant:** card gets `border-l-4 border-warning-500` left accent + `badge-warning badge-sm` "Overdue" / "Atrasado" inline with the metadata line
- **In-progress variant:** card gets `border-l-4 border-teal-500` left accent

#### Completed Section (Collapsed)
- Below the active task list
- `<div class="px-4 mt-6">`
- Accordion toggle: `<button class="flex items-center justify-between w-full py-2">` with `<span class="text-xs font-semibold text-sand-500 uppercase tracking-wide">` — "Completed" / "Completados" + `fa-chevron-down text-sand-300`
- When expanded: list of recently completed tasks (last 7 days) with same card layout but muted styling (`opacity-60`) and a `fa-circle-check text-success-500` replacing the chevron
- Collapsed by default — saves space, but lets patients see their recent completions

### Footer Zone
No sticky footer.

---

## Interaction Specifications

### Tap Task Card
- **Trigger:** Tap anywhere on the card
- **Feedback:** Card pressed state
- **Navigation:** For assessments → `health/assessment.html?id=[assessmentId]`. For check-ins → `health/assessment.html?id=[assessmentId]&mode=checkin`. Future task types will have their own routes.
- **Error handling:** N/A (local navigation)

### Toggle Completed Section
- **Trigger:** Tap "Completed" header
- **Feedback:** Accordion expands/collapses with Preline `hs-accordion`
- **Navigation:** None
- **Error handling:** N/A

### Tap Back
- **Trigger:** Tap back chevron
- **Navigation:** Return to dashboard (`apps/patient/index.html`)
- **Error handling:** N/A

---

## States

### Empty State — No Tasks
- `.empty-state` centered
- Icon: `fa-circle-check` in `text-sand-200`
- Heading: "You're all caught up" / "Está al día"
- Message: "No tasks right now. We'll let you know when something needs your attention." / "No hay tareas ahora. Le avisaremos cuando algo necesite su atención."

### Loading State
- Three `skeleton` cards in the task list area

### Error State
- `.alert alert-error mx-4 mt-4`
- "We couldn't load your tasks. Please try again." / "No pudimos cargar sus tareas. Inténtelo de nuevo."
- `.btn-outline btn-sm` — "Try again" / "Intentar de nuevo"

---

## Accessibility Notes
- Task cards are full-card tap targets (44px+ height from card padding)
- Each card: `role="link"` with `aria-label` describing task name and status
- Overdue status is communicated via text badge, not color alone
- Completed section accordion follows Preline `hs-accordion` ARIA pattern

## Bilingual Considerations
- All task names come from assessment definition files (already bilingual)
- "Tasks" / "Tareas" — header
- "Overdue" / "Atrasado" — badge
- "In progress" / "En progreso" — metadata
- "Completed" / "Completados" — section header
- "You're all caught up" / "Está al día" — empty state
- Due date format: "Due Mar 31" / "Vence 31 mar"

## New Components Flagged
- `[NEW COMPONENT: task-card — tappable card with type icon (avatar), task name, metadata line (time estimate, due date, status), chevron. Overdue variant with left accent border + warning badge. In-progress variant with teal left accent. Completed variant with muted opacity + check icon.]`

## Open Questions
- Should completed tasks show for 7 days, 30 days, or until the next instance of the same assessment is assigned?
- When future task types are added (appointments, documentation), should they sort intermixed with assessments by due date, or grouped by type?
