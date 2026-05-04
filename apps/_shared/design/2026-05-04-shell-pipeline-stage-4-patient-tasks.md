# Stage 4: Dev-Tasker Output — Patient App Shell + v1 Routes

**Date:** 2026-05-04
**Pipeline stage:** Stage 4 (dev-tasker) — complete
**Slice:** `pt-shell-and-routes`
**Input:** Stage 3 component maps (7 patient wireframes), Gate 3 confirmed
**Output:** 10 task files + 1 task-list + 1 manifest + this summary
**Next stage:** Stage 5 (build) — execute tasks 01–10 sequentially

---

## Totals

| Metric | Count |
|--------|-------|
| Total tasks | 10 |
| Deterministic tasks | 10 |
| Generative tasks | 0 |
| New PL fragments required | 0 |
| New ui-react ports required | 0 |
| New semantic classes required | 0 |
| App-scoped files created | ~14 (7 screen files + 3 component files + 2 lib files + App.tsx update) |
| Estimated build time | 20–35 minutes |

---

## Task Classification Summary

| # | Task | Class | Model | Phase |
|---|------|-------|-------|-------|
| 01 | Shell — I18nBar + BottomNav components | deterministic | sonnet | Shell infra |
| 02 | useLanguage hook | deterministic | sonnet | Shell infra |
| 03 | Dashboard route (`/`) | deterministic | sonnet | Route screens |
| 04 | Messages route (`/messages`) | deterministic | sonnet | Route screens |
| 05 | Settings route (`/settings`) | deterministic | sonnet | Route screens |
| 06 | My Health route (`/health`) | deterministic | sonnet | Route screens |
| 07 | Care route (`/care`) | deterministic | sonnet | Route screens |
| 08 | App.tsx route wiring | deterministic | sonnet | App wiring |
| 09 | Offline banner + shell states | deterministic | sonnet | App wiring |
| 10 | Build verification | deterministic | haiku | Verification |

All 10 tasks are deterministic. Zero generative tasks because Stage 3 confirmed zero PL gaps and all copy was resolved in Stage 2 review notes.

---

## Build Phases

### Phase 1: Shell infrastructure (tasks 01–02)
Sequential. Task 02 depends on 01 for the `Language` type export. ~4 minutes.

### Phase 2: Route screens (tasks 03–07)
Can run in parallel (each task touches a different file directory). Each screen is independent. ~10–15 minutes total (2–3 minutes per screen).

### Phase 3: App wiring + shell states (tasks 08–09)
Sequential: 08 must complete before 09. Depends on all Phase 1–2 tasks. ~5 minutes.

### Phase 4: Verification (task 10)
After all prior tasks. ~5–10 minutes.

---

## Files Produced in Stage 4

### Task list (1)
- `apps/patient/design/build/task-list.md`

### Task prompt files (10)
- `apps/patient/design/build/01-shell-i18n-bar-bottom-nav.md`
- `apps/patient/design/build/02-i18n-hook-language-context.md`
- `apps/patient/design/build/03-dashboard-route.md`
- `apps/patient/design/build/04-messages-route.md`
- `apps/patient/design/build/05-settings-route.md`
- `apps/patient/design/build/06-my-health-route.md`
- `apps/patient/design/build/07-care-route.md`
- `apps/patient/design/build/08-app-wire-all-routes.md`
- `apps/patient/design/build/09-offline-banner-shell-states.md`
- `apps/patient/design/build/10-build-verification.md`

### Slice manifest (1)
- `apps/patient/design/slices/pt-shell-and-routes/manifest.md`

### This summary (1)
- `apps/_shared/design/2026-05-04-shell-pipeline-stage-4-patient-tasks.md`

---

## Key Decisions Made in Stage 4

- **Chart.js sparklines deferred to v1.1** — Chart.js is not in the React app's package.json; the vanilla-JS CDN pattern doesn't port to React without a wrapper. `/health` route ships with placeholder `chart-sparkline` containers + `// TODO v1.1` comment. The trend badge + card layout ships correctly.
- **`ThreadPanel` ui-react component not used for pt-02-messages** — inline composition in the route is the Tier 1 promotable carve-out approved at Stage 3. Promote to PL when kitchen ships its own allowlist.
- **Sign-out dialog: state-controlled, not Preline `data-hs-overlay`** — Preline overlay system works well for vanilla HTML; in React the simpler state-controlled pattern avoids Preline hydration complications. The `hs-overlay-backdrop` CSS class is still used for the dim effect.
- **`useLocation`-based shell component visibility** — I18nBar + BottomNav hide on `/assessment/*` routes. This pattern is minimal and avoids prop-drilling from individual route screens. Assessment screens already handle their own navigation (AssessmentHeader from ui-react).
- **Inline `paddingTop`/`paddingBottom` on the content wrapper** — the only inline styles in the entire slice; these are data-driven layout clearances for the fixed bars (CLAUDE.md carve-out: "Chart.js flex values on pipeline segments are data-driven and acceptable" — analogous pattern).

---

## Items Needing Aaron's Call Before Stage 5

**P1 — Critical (affects Stage 5 start):**

- **320px ES tab label validation** — "Mensajes" at 13.33px Source Sans 3 Semibold may wrap at 320px viewport in the 5-tab nav. Stage 2 review flagged this; confirm the BottomNav renders at 320px before closing Task 10. If it wraps: two options: (a) reduce to `text-[11px]`; (b) use abbreviated ES label "Msg" for Mensajes at 320px (not ideal). Recommend option (a) but need Aaron's call.

**P2 — Should resolve before branch merge:**

- **Privacy + Terms links in Settings footer** — placeholder text; real URLs pending legal. Confirm with Cena legal team. Not a blocker for build; blocker for production ship.
- **`useLanguage` language pref source-of-truth** — the hook currently reads from `localStorage` only. Production will have the patient's user profile as the canonical source (write to profile API on toggle). This is wired with a console.info comment in Task 09; needs API integration to close.
- **Authentication / sign-out** — Settings route logs sign-out to console. Production needs session clearing + redirect to login. Flag for auth integration pass.

**P3 — Nice to have:**

- **unreadCount hardcoded as 1** in App.tsx. Confirm this is acceptable for demo; production wires to messages API.

---

## Ready for Stage 5

**Yes** — with awareness of the three open items above. The task list is executable in order. Each task is small (1–3 files, 2–3 minutes), self-verifying, and deterministic. No generative tasks require Opus; all are Sonnet or Haiku.

Coordinator task list (parallel slice) is independent of this patient task list. Both slices can execute concurrently if two build tracks are available.
