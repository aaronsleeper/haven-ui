# Dashboard Modification: Tasks Section

**Application:** Patient App (Mobile)
**Modifies:** `/apps/patient/index.html` (existing dashboard)
**Use Case(s):** PT-ASSESS-001, PT-ASSESS-002 (and future task types)

## Purpose

Add a Tasks section to the patient dashboard showing the 3 most urgent outstanding tasks. This is the primary entry point for assessments — patients see what they need to do as soon as they open the app.

---

## Placement

Insert the Tasks section **above the existing content** on the dashboard (above meals, delivery status, or any other dashboard cards). Tasks are action items — they should be the first thing the patient sees.

## Layout

### Section Header
- `<div class="flex items-center justify-between px-4 mt-6 mb-2">`
- Left: `<p class="text-xs font-semibold text-sand-500 uppercase tracking-wide">` — "Tasks" / "Tareas"
- Right (only if >3 tasks): `<a class="text-link text-xs">` — "See all ([N])" / "Ver todas ([N])" → links to `tasks/index.html`

### Task Cards (Top 3)
- `<div class="space-y-2 px-4">`
- Uses the same `task-card` component from tasks-01, sorted by urgency (overdue first, then nearest due date)
- Maximum 3 cards shown. If the patient has more, the "See all" link provides access.
- If the patient has 0 tasks, the entire Tasks section is hidden (no empty state on the dashboard — the section simply doesn't render)

### Compact Variant
On the dashboard, task cards can optionally use a slightly more compact layout than the full tasks page — same content, tighter vertical padding (`py-2` instead of card default). This is a CSS modifier, not a structural change.

---

## Interaction Specifications

### Tap Task Card
Same as tasks-01: navigates to `health/assessment.html?id=[assessmentId]` (or `&mode=checkin` for check-ins).

### Tap "See all"
- **Navigation:** `tasks/index.html`

---

## States

### No Tasks
The entire Tasks section is hidden. Dashboard renders without it. No empty state, no placeholder — less noise when the patient has nothing to do.

### 1–3 Tasks
Section shown with all tasks. "See all" link hidden.

### 4+ Tasks
Section shown with top 3 tasks. "See all ([N])" link visible.

---

## Bilingual Considerations
- "Tasks" / "Tareas"
- "See all ([N])" / "Ver todas ([N])"

## Open Questions
- None — this is a straightforward dashboard section.
