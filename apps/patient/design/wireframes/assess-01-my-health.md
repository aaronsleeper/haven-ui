# ASSESS-01: My Health (Hub)

**Application:** Patient App (Mobile)
**Use Case(s):** PT-ASSESS-001, PT-ASSESS-002, PT-ASSESS-003, PT-ASSESS-004
**User Type:** Patient
**Device:** Mobile-first
**Route:** `/apps/patient/health/index.html`

## Page Purpose

The patient's health hub — the single place to see pending assessments, complete check-ins, and review health trends over time. The patient arrives here to answer a health check-in, see how they're doing, or follow a notification prompt. Success: the patient sees their pending tasks, completes them, and feels a sense of progress from the trend data.

---

## Layout Structure

### Shell
- `mobile-shell` with `mobile-app` body class
- `mobile-i18n-bar` fixed at top
- `mobile-bottom-nav` — **Health** tab active (new 5th tab: `fa-heart-pulse`)
- Padding bottom for nav clearance: `pb-[64px]`

### Header Zone
- `<div class="px-4 pt-6 pb-2">`
- Title: `<h1>` — "My Health" / "Mi Salud"
- Subtitle: `<p class="text-sm text-sand-500">` — "Your check-ins and progress" / "Sus evaluaciones y progreso"

### Content Zone

#### Section 1: Pending Assessments (Action Items)
Shown only when the patient has pending or overdue assessments. This is the primary action zone — it sits above trends to ensure assessments are completed before browsing.

- Section label: `<p class="text-xs font-semibold text-sand-500 uppercase tracking-wide px-4 mb-2">` — "Your check-ins" / "Sus evaluaciones" [REVISED: warmer than "To do"]
- Stack of assessment prompt cards: `<div class="space-y-3 px-4">`

**Assessment Prompt Card:**
- `.card` with left-accent border (category color via CSS variable)
- `.card-body` — single row layout:
  - Left: category icon in a colored circle (`avatar avatar-sm` with category-appropriate color)
    - Behavioral: `fa-brain` in `avatar-primary`
    - SDOH: `fa-people-group` in `avatar-secondary`
    - Dietary: `fa-utensils` in `avatar-neutral`
    - Check-in: `fa-face-smile` in `avatar-primary`
  - Center: assessment name `<p class="text-sm font-medium">` + estimated time `<p class="text-xs text-sand-400">` ("About 2 min")
  - Right: `fa-chevron-right text-sand-300`
- Overdue card gets `.alert-warning` background tint and a `badge-warning badge-sm` label "Overdue" / "Atrasado"
- Tap anywhere on the card → navigate to assess-02 (Intro) or directly to assess-03 for check-ins

#### Section 2: Health Trends
Shown when the patient has completed at least one assessment or check-in. Each tracked metric gets a trend card.

- Section label: `<p class="text-xs font-semibold text-sand-500 uppercase tracking-wide px-4 mt-6 mb-2">` — "Your progress" / "Su progreso"
- Stack of trend cards: `<div class="space-y-3 px-4">`

**Trend Card:**
- `.card` — tappable (navigates to assess-05 Metric Detail)
- `.card-body` with two-row layout:
  - Row 1: metric label `<p class="text-sm font-medium">` (e.g., "Mood" / "Estado de ánimo") + last data date `<span class="text-xs text-sand-400">` (e.g., "Last: Mar 28") [REVISED: shows currency] + `trend-badge` (e.g., `trend-improving` "Improving")
  - Row 2: sparkline chart (`chart-sparkline`, ~60px tall, showing all historical data points) OR stat summary for metrics with few data points ("Completed 3 of 4 weeks")
- Each trend card shows the patient-friendly metric label, not the clinical assessment name. E.g., "Mood" not "PHQ-2 Score".

**Trend card variants by data type:**
- **Scored assessment** (PHQ-9, GAD-7, MNA-SF): sparkline of total score over time. Trend badge shows direction. No raw numbers — just "Low risk" / "Improving" / "Needs attention" labels.
- **Single-value check-in** (mood, meal satisfaction): sparkline of emoji values mapped to numeric axis. Most recent emoji shown alongside trend badge.
- **Wearable metric** (future): same sparkline pattern. Labeled with data source icon.

#### Section 3: Wearable Placeholder (Future)
- `.card mx-4 mt-6` with muted styling (`bg-sand-50 border-sand-200`)
- Icon: `fa-watch text-sand-300` centered, large
- Text: "Connect a health device" / "Conectar un dispositivo de salud"
- Subtext: "Track steps, sleep, and more. Coming soon." / "Rastree pasos, sueño y más. Próximamente." [REVISED: explains value, not just status]
- Card is not tappable (disabled appearance — reduced opacity on the text, no chevron)

### Footer Zone
No sticky footer on this screen.

---

## Interaction Specifications

### Tap Assessment Prompt Card
- **Trigger:** Tap anywhere on the card
- **Feedback:** Card shows pressed state (slight scale or opacity change)
- **Navigation:** Navigate to `assessment.html?id=[assessmentId]`. For quick check-ins (`mode=checkin`), go directly to first question.
- **Error handling:** N/A (local navigation)

### Tap Trend Card
- **Trigger:** Tap anywhere on the card
- **Feedback:** Card pressed state
- **Navigation:** Navigate to `metric.html?id=[metricId]`
- **Error handling:** N/A

---

## States

### Empty State — No Assessments, No Trends
- `.empty-state` centered in content zone
- Icon: `fa-heart-pulse` in `text-sand-200`
- Heading: "Your health hub" / "Su centro de salud"
- Message: "When your care team assigns check-ins, they'll show up here. You'll also see your health progress over time." / "Cuando su equipo de atención le asigne evaluaciones, aparecerán aquí. También verá su progreso de salud con el tiempo."
- No CTA button (nothing for the patient to do — assessments are care-team-initiated)

### Empty State — No Trends Yet (Assessments Pending)
- Pending assessment cards shown in Section 1
- Section 2 replaced with an encouraging message card:
  - `.card mx-4 mt-6` with `bg-teal-50 border-teal-200`
  - Icon: `fa-chart-line text-teal-400`
  - Text: "Complete your first check-in to start tracking your progress." / "Complete su primera evaluación para comenzar a seguir su progreso."

### Loading State
- Section 1: two `skeleton` cards (height matching assessment prompt card)
- Section 2: two `skeleton` cards (height matching trend card with sparkline area)

### Error State
- `.alert alert-error mx-4 mt-4`
- Icon: `fa-triangle-exclamation`
- Message: "We couldn't load your health data. Please try again." / "No pudimos cargar sus datos de salud. Inténtelo de nuevo."
- `.btn-outline btn-sm` — "Try again" / "Intentar de nuevo"

---

## Accessibility Notes
- Assessment prompt cards are full-card tap targets (44px+ height guaranteed by card padding)
- Each card has `role="link"` and `aria-label` describing the assessment name and status
- Trend sparklines have `aria-hidden="true"` — trend direction is communicated via the trend badge text
- Overdue badge color (warning amber) is paired with text label "Overdue" — not color-dependent
- Section labels use semantic headings for screen reader navigation

## Bilingual Considerations
- All labels, headings, assessment names, trend labels, and status text need EN/ES via `data-i18n-en` / `data-i18n-es`
- Assessment names and descriptions come from the markdown definition files (already bilingual in the schema)
- "About 2 min" / "Aproximadamente 2 min" — Spanish is longer but fits in the available space
- "Overdue" / "Atrasado" — similar length, no layout concern

## New Components Flagged
- `[NEW COMPONENT: assessment-prompt-card — card with left-accent border, category icon, assessment name, estimated time, chevron. Overdue variant with warning tint.]`
- `[NEW COMPONENT: trend-card — card with metric label, trend-badge, and sparkline chart. Tappable. Variants for scored assessments, single-value check-ins, and future wearable metrics.]`

## Open Questions
- Should the dashboard (`apps/patient/index.html`) show the top 1-2 pending assessments as a preview, or just a "You have N check-ins" link to the Health tab?
- Should completed assessments (e.g., "PHQ-2 completed today") show briefly in Section 1 with a checkmark before disappearing, or should they immediately move to trends only?
