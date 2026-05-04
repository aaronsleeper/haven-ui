# pt-04-my-health: Patient My Health (Stub)

**Application:** Patient App
**Use Case(s):** PT-SHELL-04 (`apps/patient/design/shell-use-cases.md`)
**User Type:** Patient (Maria Rivera)
**Device:** Mobile (320-430px); desktop renders centered at 430px max-width
**Route:** `/health`

**Stub-level wireframe.** This route surfaces the existing assess-01 My Health hub composition inside the universal-shell pipeline. Detailed content is shipped in `apps/patient/design/wireframes/assess-01-my-health.md`; this file documents the route's place in the bottom-nav and confirms the shell binding.

---

## Page Purpose

Maria opens My Health to see her own progress — trend cards per tracked metric (Mood, Energy, Meal Satisfaction). Tap a card → metric detail (assess-05). The surface uses patient-friendly labels — never clinical names like "PHQ-2".

---

## Layout Structure

### Shell

`shell-pt-mobile`. Active bottom-nav tab: My Health (`fa-heart-pulse`).

### Header Zone

- `<h1>`: Heading/01 27.65px Lora Medium — "My Health" / "Mi Salud" [REVISED]
- Subline: Body/03 muted — EN "Your progress, your story." / ES "Su progreso, su historia."

### Content Zone

Inherits content composition from `assess-01-my-health.md`:
- `trend-card` per tracked metric (Mood, Energy, Meal Satisfaction)
- Each card: header + sparkline (Chart.js) + trend badge + last-updated date
- Tappable → assess-05-metric-detail

Empty state if no data: per assess-01-my-health spec.

### Footer Zone

`mobile-bottom-nav` (shell-level).

---

## Interaction Specifications

Per assess-01-my-health and assess-05-metric-detail wireframes (existing).

### Tap a trend card
- **Trigger:** Tap any `trend-card`
- **Feedback:** Card press
- **Navigation:** Routes to assess-05-metric-detail for that metric
- **Error handling:** Per existing assess wireframe

---

## States

Per assess-01-my-health (loaded / loading / empty / error).

### Worked-example data for v1 demo
- 3 metrics: Mood, Energy, Meal Satisfaction
- Each shows 6-week sparkline + trend badge "Improving" / "Mejorando" / "Stable" / "Estable" / "Needs attention" / "Necesita atención"

---

## Accessibility Notes

Per assess-01-my-health:
- `<main aria-label="My Health">` wraps content
- `<h1>` receives focus on route entry
- Each `trend-card` is a `<button>` or `<a>` with `aria-label` describing metric + trend
- Color-as-status: trend badges use icon + label, never color alone
- Sparkline charts have `aria-label` describing the trend in plain language

## Bilingual Considerations

- All visible strings `data-i18n-en` / `data-i18n-es`
- Trend labels patient-friendly never clinical
- Spanish ~30% longer; cards padded for absorbed wrap
- Sparkline tooltips localize date format

## Open Questions

- Should v1 ship 1 metric (Mood only) or all 3 (Mood, Energy, Meal Satisfaction)? Recommend all 3 since assess-01 already specs the full hub. Confirm.
- Metric details: assess-05 covers per-metric drill-down; confirm /health navigation hits assess-05 directly without an intermediate "loading" route.
- Should patient see a "weekly recap" CTA on this page? Out of scope at v1; flag for v1.1.

---

## New Components Flagged

None — composition reuses `trend-card`, `data-empty-state`, `chart-sparkline` (Chart.js), `badge-trend`. All shipped per existing assess wireframes.
