# ASSESS-05: Metric Detail

**Application:** Patient App (Mobile)
**Use Case(s):** PT-ASSESS-003
**User Type:** Patient
**Device:** Mobile-first
**Route:** `/apps/patient/health/metric.html?id=[metricId]`

## Page Purpose

Show the patient a detailed view of one tracked health metric over time. The patient arrives here by tapping a trend card on the Health hub. They want to see their progress, understand what the numbers mean, and feel informed about their health trajectory. All data is presented in patient-friendly language — no raw clinical scores.

---

## Layout Structure

### Shell
- `mobile-shell` with `mobile-app` body class
- `mobile-i18n-bar` fixed at top
- `mobile-bottom-nav` — **Health** tab active
- Padding bottom: `pb-[64px]`

### Header Zone
- `<div class="flex items-center px-4 pt-4 pb-2">`
- Back button: `<button class="btn-icon">` with `fa-chevron-left` — returns to Health hub
- Title: `<h1 class="text-lg font-display font-semibold ml-2">` — metric label (e.g., "Mood" / "Estado de ánimo")

### Content Zone

#### Current Status Card
- `.card mx-4 mt-4`
- `.card-body` with a two-column layout:
  - Left column:
    - Current value label: `<p class="text-2xl font-semibold">` — patient-friendly label
      - For scored assessments: severity band label (e.g., "Mild" / "Leve", "Low risk" / "Bajo riesgo")
      - For emoji check-ins: the most recent emoji + text (e.g., 🙂 "Good" / "Bien")
      - For numeric values: the value + unit (e.g., "7 hours" for sleep — future wearable)
    - Last recorded: `<p class="text-xs text-sand-400">` — "Last check-in: March 28" / "Último registro: 28 de marzo"
  - Right column:
    - `trend-badge` — `trend-improving` / `trend-flat` / `trend-worsening`

#### Trend Chart
- `<div class="px-4 mt-6">`
- `<div class="chart-canvas-wrapper chart-line">` — Chart.js line chart
- Configuration:
  - Shows **all available data** (no date range filter in v1)
  - X-axis: dates (abbreviated: "Mar 1", "Mar 8", etc.)
  - Y-axis: depends on metric type
    - Scored assessments: score range (0–27 for PHQ-9) with patient-friendly severity band labels on the axis ("Doing well", "Something to watch", "Your care team is here to help") [REVISED: softened from clinical "None/Mild/Moderate/Severe"] and colored zone bands behind the line using Chart.js annotation plugin — zone colors use Haven palette tints (teal-50, sand-100, warm-100), NOT traffic-light red/green
    - Emoji check-ins: emoji data points on the chart (Chart.js supports image/emoji point styles) [REVISED: emojis as data points rather than mapping to numeric axis] — Y-axis unlabeled, visual pattern (higher = better) is self-evident
    - Numeric values: natural scale with unit
  - Line color: `HAVEN.TEAL_600`
  - Data points: visible dots on the line
  - Zone bands (scored assessments only): horizontal colored regions — green (low risk), yellow (moderate), red (severe). Semi-transparent. Use `chartjs-plugin-annotation` rectangle annotations.
  - No grid lines on Y-axis (Tufte: minimize chart junk)
  - X-axis shows sparse date labels to avoid crowding
- Uses `HAVEN.*` constants for all colors — no hardcoded hex
- Chart must include `src/partials/scripts-charts.html` and `haven-chart-config.js`

#### History List
- `<div class="px-4 mt-6">`
- Section label: `<p class="text-xs font-semibold text-sand-500 uppercase tracking-wide mb-2">` — "History" / "Historial"
- Scrollable list of past responses, most recent first
- Each row: `<div class="flex items-center justify-between py-3 border-b border-sand-100">`
  - Left: date `<p class="text-sm text-sand-600">` — "March 28, 2026" / "28 de marzo de 2026"
  - Right: value in patient-friendly format
    - Scored: severity label + `badge-sm` with color (e.g., `badge-success` "Low risk")
    - Emoji: the emoji + text label
    - Numeric: value + unit
- If more than 10 entries, show the 10 most recent with a "Show more" / "Mostrar más" `text-link` at the bottom

#### What This Measures (Educational)
- `.card mx-4 mt-6 bg-sand-50 border-sand-200`
- `.card-body`:
  - `<p class="text-xs font-semibold text-sand-500 uppercase tracking-wide">` — "About this check-in" / "Sobre esta evaluación"
  - `<p class="text-sm text-sand-600 mt-1">` — plain-language explanation of the metric
    - PHQ-9: "This measures how often you've felt down or lost interest in things. Lower scores mean less risk." / "Esto mide con qué frecuencia se ha sentido desanimado/a o ha perdido interés en las cosas. Puntuaciones más bajas significan menos riesgo."
    - Mood check-in: "This tracks how you've been feeling day to day." / "Esto rastrea cómo se ha sentido día a día."
  - Explanation text comes from the assessment definition file

### Footer Zone
No sticky footer on this screen.

---

## Interaction Specifications

### Tap Back
- **Trigger:** Tap back chevron
- **Navigation:** Return to Health hub
- **Error handling:** N/A

### Tap Chart Data Point (Optional Enhancement)
- **Trigger:** Tap a dot on the chart line
- **Feedback:** Tooltip showing date and value (Chart.js native tooltip, styled with Haven colors)
- **Navigation:** None
- **Error handling:** N/A

### Tap "Show More" (History)
- **Trigger:** Tap link at bottom of history list
- **Feedback:** Next 10 entries appear below, link updates or disappears if no more entries
- **Navigation:** None (in-page expansion)
- **Error handling:** N/A

---

## States

### Scored Assessment Trend (PHQ-9, GAD-7, MNA-SF, etc.)
- Current status card shows severity label
- Chart shows line with colored zone bands
- History rows show date + severity badge

### Emoji Check-In Trend (Mood, Meal Satisfaction)
- Current status card shows most recent emoji + text
- Chart shows line with emoji/text labels on Y-axis (1–5 scale)
- No zone bands (no clinical severity thresholds)
- History rows show date + emoji + text label

### Minimal Data (2–4 Points)
- Chart renders with available data (Chart.js handles sparse data fine)
- Below chart: encouraging message `<p class="text-xs text-sand-400 text-center mt-2">` — "Keep checking in — your trends become clearer over time." / "Siga registrando — sus tendencias se aclaran con el tiempo."

### Single Data Point
- No chart shown (a single dot on a line chart is meaningless)
- Current status card shows the single value
- History list shows the single entry
- Encouraging message where the chart would be: `<p class="text-sm text-sand-400 text-center py-8">` — "Complete one more check-in to see your trend." / "Complete una evaluación más para ver su tendencia."

### Empty State
N/A — this screen is only reachable when at least one data point exists (the trend card on the Health hub requires ≥1 completed assessment).

### Loading State
- Current status card: `skeleton` block
- Chart area: `skeleton` rectangle (height matching chart area, ~200px)
- History list: three `skeleton-text` rows

### Error State
- `.alert alert-error mx-4 mt-4`
- "We couldn't load your progress data." / "No pudimos cargar sus datos de progreso."
- `.btn-outline btn-sm` — "Try again" / "Intentar de nuevo"

---

## Accessibility Notes
- Chart is supplementary — all data is also available in the history list (text-based, screen-reader-accessible)
- Chart canvas: `aria-hidden="true"` with a visually hidden summary: `<span class="sr-only">` — "Trend chart showing [metric] over time. Current status: [value]."
- Zone bands use color + text labels — not color alone
- Trend badge text communicates direction without color dependence
- History list rows are native HTML — no special ARIA needed
- Touch targets: back button ≥44px, "Show more" link has adequate padding

## Bilingual Considerations
- Metric labels, severity band labels, educational text, and all UI strings need EN/ES
- Severity labels: "Low risk" / "Bajo riesgo", "Mild" / "Leve", "Moderate" / "Moderado", "Severe" / "Severo"
- Chart axis labels in Spanish are slightly longer — ensure tick labels have adequate spacing
- Date formatting: "March 28" / "28 de marzo" — different order (month-day vs. day-month in Spanish convention)
- Educational card text is the longest bilingual content — `text-sm` with card padding accommodates longer Spanish strings

## New Components Flagged
- `[NEW COMPONENT: trend-chart-config — Chart.js configuration preset for patient-facing trend charts. Line chart with HAVEN colors, zone band annotations for scored assessments, emoji Y-axis labels for check-ins. Extends haven-chart-config.js.]`

## Open Questions
- ~~For the educational "About this check-in" card, should this be always visible or collapsed behind an accordion toggle?~~ [RESOLVED by review: collapsed by default on return visits, expanded on first view. Use localStorage flag per metric.]
- Should the chart support pinch-to-zoom on mobile for patients with many data points, or is the simple static chart sufficient for v1?
