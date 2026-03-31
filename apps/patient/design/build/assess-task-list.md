# Build Tasks: Patient Assessments & Self-Report

**Date:** 2026-03-31
**Source:** `assess-component-map.md`, wireframes, new-components specs
**Target:** haven-ui patient app (`apps/patient/`)

---

## Task Summary

**Total tasks:** 10
**New components:** 4 (tasks 01–04)
**Screen builds:** 5 (tasks 05–09)
**Data + integration:** 1 (task 10)
**Estimated complexity:** Moderate — 4 new components, 5 screens, Chart.js trend config, JS-driven assessment flow

---

## Execution Order

| # | Task | Scope | Files Modified | Depends On | Status |
|---|------|-------|----------------|------------|--------|
| 01 | Task Card component | Pattern + CSS | `components.css`, `pattern-library/components/patient-task-card.html`, `COMPONENT-INDEX.md` | — | ☐ |
| 02 | Trend Card component | Pattern + CSS | `components.css`, `pattern-library/components/patient-trend-card.html`, `COMPONENT-INDEX.md` | — | ☐ |
| 03 | Emoji Scale component | Pattern + CSS | `components.css`, `pattern-library/components/patient-emoji-scale.html`, `COMPONENT-INDEX.md` | — | ☐ |
| 04 | Assessment Slider component | Pattern + CSS + JS | `components.css`, `pattern-library/components/patient-assess-slider.html`, `src/scripts/components/assess-slider.js`, `COMPONENT-INDEX.md` | — | ☐ |
| 05 | Bottom nav Health tab + assessment data files | App + Partial + Data | `src/partials/patient-bottom-nav.html`, all existing patient HTML (nav update), `src/data/patient/assessments/*.md` | — | ☐ |
| 06 | Tasks page + dashboard section | App | `apps/patient/tasks/index.html`, `apps/patient/index.html` | 01, 05 | ☐ |
| 07 | Health hub (My Health) | App | `apps/patient/health/index.html` | 02, 05 | ☐ |
| 08 | Assessment flow (Intro + Question + Complete) | App + JS | `apps/patient/health/assessment.html`, `src/scripts/components/assessment.js` | 03, 04, 05 | ☐ |
| 09 | Metric Detail page + trend chart config | App + JS | `apps/patient/health/metric.html`, `src/scripts/env/haven-trend-config.js` | 02, 07 | ☐ |
| 10 | Cross-screen wiring + verification | App | All patient HTML files (link audit, nav consistency) | 06–09 | ☐ |

---

## Parallelization

**Batch 1 (parallel, no dependencies):** Tasks 01, 02, 03, 04, 05
**Batch 2 (parallel after batch 1):** Tasks 06, 07, 08
**Batch 3 (sequential):** Task 09 (depends on 07), then Task 10

---

## Assessment Dummy Data (Task 05)

Create `src/data/patient/assessments/` with three assessment definition files in the YAML+markdown format specified in `assessments-use-cases.md`:

**phq-2.md** — 2 questions, radio type, scoring with escalation threshold
**mood-checkin.md** — 1 question, emoji-scale type, no scoring
**hunger-vital-sign.md** — 2 questions, yes-no type, flag if either is "yes"

Plus dummy response history for trend charts:
**src/data/patient/dummy-responses.md** — 8 weeks of PHQ-2 scores, 4 weeks of mood ratings, 2 Hunger Vital Sign completions

---

## Post-Build

- [ ] Run `npm run dev`; verify all new screens at `localhost:5173/apps/patient/`
- [ ] Test Health tab in bottom nav on all patient screens
- [ ] Test task cards on dashboard → link to assessment flow
- [ ] Test full assessment flow: Intro → Questions → Complete → return to Health hub
- [ ] Test check-in mode: skip intro, answer, submit
- [ ] Test trend chart rendering on Metric Detail page
- [ ] Test i18n toggle on all new screens
- [ ] Test empty states on Health hub and Tasks page
- [ ] Run ux-design-review (post-build mode) → `apps/patient/design/assess-validation.md`

## Notes

- Tasks 01–04 follow the Pattern-Library-First rule: create in pattern library, add to COMPONENT-INDEX.md, add to components.css, then use in app pages
- The assessment flow (task 08) is a single HTML page with JS-driven state transitions (intro → questions → complete). No page navigation between questions.
- Chart.js is already loaded via CDN on pages that include `scripts-charts.html` partial — no new dependencies
- The `chartjs-plugin-annotation` CDN is already in the project for zone bands — used on Metric Detail
- Bottom nav partial already has `grid-cols-5` in CSS — just needs the 5th tab HTML
- All new screens use the same `mobile-app` / `mobile-shell` pattern as existing patient screens
- Decisions log rules in effect: `@apply block` on CSS-only rules, button base must not set size/color, nested border radius reduction, semantic classes not utilities
