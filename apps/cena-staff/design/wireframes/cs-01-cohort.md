---
slot: 11
slot-name: wireframes
project: cena-uconn-cena-staff-meal-flow
created: 2026-06-09
status: draft
consumes:
  - apps/cena-staff/design/brief.md
  - apps/cena-staff/design/ia.md
  - apps/cena-staff/design/flows/meal-visibility.md
shells: []
---

# cs-01-cohort: Cena staff — meal-flow cohort view

**Application:** Cena-staff (providers/platform) app
**Use Case(s):** CS-001 (read cohort meal-flow health)
**User Type:** Cena staff (clinical coordinator / RD / ops — composite role for MVP)
**Device:** Desktop primary
**Route:** `/meals` (default tab: "This week")

Staff opens the Meals tab in the providers/platform app to scan the UConn cohort's meal-flow state. Exceptions surface visibly at the top; routine state recedes. Goal: 30-second scan answers "is the meal flow healthy?"

---

## Layout

Mounts within the existing providers/platform shell. This wireframe defines the CONTENT REGION inside that shell.

### Header zone (page-level, inside providers/platform shell)

- `<h1>`: "Meal flow — UConn cohort" (Heading/02, Lora)
- Subhead: "This week's orders due Wednesday delivery · {N} patients" (Body/03 muted)
- Tab control: This week (active) | Exceptions (3)
- Right: "Last refreshed: 2 minutes ago" + refresh button (`<button>` icon-only, `fa-arrows-rotate`)

### Content zone

#### Exception summary strip (top of content)
Three counts via `stat-group`:
- **Needs attention** — exception count (amber accent)
- **In flight** — placed orders awaiting prep/pack/delivery (neutral)
- **Completed** — delivered this window (teal accent, dimmed)

Pinned at top of scroll region.

#### Patient rows — grouped by exception status

Three groups in scroll order:

1. **Needs attention** (amber group header, `<h2>` "Needs attention — 3 patients")
   - Each row: patient name + photo placeholder (initial avatar, no real photo) · exception type · how-long-ago · escalation owner (placeholder: "Clinical coord.") · drill-in chevron
   - Row treatment: subtle amber-50 background; amber-left-border 3px
   - Click row → drill-in (cs-02-patient-meals)
2. **In flight** (neutral group header, `<h2>` "Active — 9 patients")
   - Each row: patient name + initial avatar · state breadcrumb (Ordered → Prepping → Packing → Delivering) with current state highlighted · delivery window · drill-in chevron
   - Row treatment: standard
3. **Completed** (dimmed group header with toggle, `<h2>` "Delivered this week — 12 patients" + chevron-down to expand if collapsed)
   - Each row: patient name + initial avatar · delivered-at timestamp · drill-in chevron
   - Row treatment: sand-50 background; muted text

Rows are 56px tall; group headers 40px with subtle separator.

### States

- **Default:** all three groups present with counts. Exceptions visible without scroll.
- **Exceptions filter tab:** only the "Needs attention" group renders; others hidden.
- **No exceptions:** "Needs attention" group renders an empty calm message: "Nothing needs attention right now." (Body/02, sand-700)
- **Loading:** skeleton rows in all three groups (3 per group); no spinner.
- **Error — partial data unavailable:** Banner above content: "Some data may be stale (kitchen-app feed delayed). Showing last-known state." Drill-in remains accessible.

## Interaction

- Click patient row → drill-in (`/meals/<patient-id>`)
- Click refresh → re-fetches all data sources; subtle skeleton flash, then re-render
- Click "Exceptions" tab → URL changes to `?tab=exceptions`, filtered view
- Click "Delivered this week" group header → expands/collapses (default collapsed if count > 10)

## Render-time assertions

- Exception group renders first in DOM order (above-the-fold)
- Patient identifiers include FULL NAMES (PHI-authorized — this is the inverse of kitchens app)
- No food images
- Exception rows have a visible amber accent (not subtle-gray; should pull eye)

## Novel primitives (delta-review candidates)

- Possibly: a "meal-flow-state-breadcrumb" component (Ordered → Prepping → Packing → Delivering with current state highlighted). Check COMPONENT-INDEX for existing process-stepper / progress-stepper that fits; promote if not.

## Proposed use cases

- **CS-001** — Cena staff reads UConn cohort meal-flow state at a glance. Exceptions surface; routine state recedes.
