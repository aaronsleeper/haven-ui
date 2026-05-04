# Build Tasks: Patient App — Universal Shell + v1 Routes

**Date:** 2026-05-04
**Source:** `apps/patient/design/component-map-shell-pipeline.md`, wireframes `pt-shell-flow.md` through `pt-05-care.md`, `review-notes.md` (Stage 2 pipeline)
**Target:** `apps/patient/` (React + Vite, port 5176)
**Tier:** Tier 2 — Slice composition (zero PL gaps; all components exist in PL + ui-react)
**Prerequisite:** Assessments flow (`/assessment/gad-7/*`, `/assessment/phq-9/*`) is already shipped — do not touch.

---

## Task Summary

**Total tasks:** 10
**New PL fragments:** 0 (all components exist)
**New ui-react ports:** 0 (all components ported)
**Screen route builds:** 5 (tasks 03–07)
**Shell wiring tasks:** 2 (tasks 01–02)
**Feature tasks:** 2 (tasks 08–09)
**Verification task:** 1 (task 10)
**Estimated total build time:** 20–35 minutes
**Estimated complexity:** Moderate (6–12 tasks)

---

## Execution Order

| #  | Task                                   | Class         | Model  | Scope    | File(s) Modified                                                    | Depends On | Status |
|----|----------------------------------------|---------------|--------|----------|---------------------------------------------------------------------|------------|--------|
| 01 | Shell wiring — i18n bar + bottom nav   | deterministic | sonnet | App only | `apps/patient/src/App.tsx`, new `apps/patient/src/components/BottomNav.tsx`, new `apps/patient/src/components/I18nBar.tsx` | —          | ☐      |
| 02 | i18n hook + language context           | deterministic | sonnet | App only | new `apps/patient/src/lib/useLanguage.ts`                           | 01         | ☐      |
| 03 | Dashboard route (`/`)                  | deterministic | sonnet | App only | new `apps/patient/src/screens/dashboard/index.tsx`                  | 01, 02     | ☐      |
| 04 | Messages route (`/messages`)           | deterministic | sonnet | App only | new `apps/patient/src/screens/messages/index.tsx`                   | 01, 02     | ☐      |
| 05 | Settings route (`/settings`)           | deterministic | sonnet | App only | new `apps/patient/src/screens/settings/index.tsx`                   | 01, 02     | ☐      |
| 06 | My Health route (`/health`)            | deterministic | sonnet | App only | new `apps/patient/src/screens/health/index.tsx`                     | 01, 02     | ☐      |
| 07 | Care route (`/care`)                   | deterministic | sonnet | App only | new `apps/patient/src/screens/care/index.tsx`                       | 01, 02     | ☐      |
| 08 | App.tsx — wire all 5 routes + shell    | deterministic | sonnet | App only | `apps/patient/src/App.tsx`                                          | 01–07      | ☐      |
| 09 | Offline banner + shell states          | deterministic | sonnet | App only | `apps/patient/src/App.tsx`, `apps/patient/src/components/OfflineBanner.tsx` | 08    | ☐      |
| 10 | Build verification                     | deterministic | haiku  | App only | (read-only; runs build + typecheck)                                 | 01–09      | ☐      |

---

## Build Phases

### Phase 1 — Shell infrastructure (tasks 01–02)
Wire the persistent patient shell: `I18nBar`, `BottomNav`, language context. These are the prereqs for every route screen.

### Phase 2 — Route screens (tasks 03–07)
One file per route. Each task creates a single `index.tsx` screen file composing existing ui-react components. No new semantic classes. No new pattern library entries.

### Phase 3 — App wiring + shell states (tasks 08–09)
Rewire `App.tsx` to include all 5 routes, shell components, and the offline-banner state. Task 09 is a small addition on top of the wired app.

### Phase 4 — Verification (task 10)
Build + typecheck + lint; confirm all routes render at http://localhost:5176.

---

## Post-Build
- [ ] Run build: `pnpm --filter @haven/app-patient build`
- [ ] Typecheck: `pnpm --filter @haven/app-patient typecheck`
- [ ] Verify app at: http://localhost:5176
- [ ] 320px viewport check for ES tab labels ("Mensajes" wrap risk)
- [ ] iOS home indicator: `pb-safe-4` / `pb-safe-8` present on all sticky surfaces
- [ ] Run `pnpm --filter @haven/ui-react conform:fast` gate set
- [ ] Route ux-design-review (post-build mode)

---

## Known Constraints from decisions-log.md

- **Button variants:** never put size or color on the base `button` element rule; add to variant class
- **Nested border radius:** inner elements step down one radius from parent
- **Form element overrides inside components:** use raw CSS `!important` — never `@apply` for overrides
- **card-body spacing exclusion list:** any row component with `border-b` must be added to `:not()` exclusion
- **Mobile shell:** `.mobile-shell` is the content root; state show/hide targets `.mobile-shell`, not `<main>`
- **Semantic class @apply anchor:** any pure-CSS rule in `components.css` must start with `@apply block;`
- **Raw CSS colors:** prefer `var(--color-sand-*)` for neutrals; never `var(--color-gray-*)` in raw blocks (resolved identically but sand is canonical)
- **Never @apply a semantic class inside another semantic class** (Tailwind can't resolve custom classes in @apply)

## Notes

- Patient app currently uses `MobileShell` from `@haven/ui-react` which adds `mobile-app` to `<body>`. The new shell wiring tasks build on top of that without replacing it.
- `i18n.js` is a vanilla-JS module at `packages/design-system/src/scripts/components/i18n.js`. For React, the `useLanguage` hook wraps localStorage directly — do NOT import the vanilla module; replicate the logic as a React hook.
- Bilingual strings: always use `data-i18n-en` / `data-i18n-es` HTML attributes for server-rendered strings; for dynamic React JSX, use the `useLanguage` hook to pick the appropriate string.
- Assessments flow (`/assessment/gad-7/*`, `/assessment/phq-9/*`) is already shipped. The new `/health` route (`pt-04-my-health`) is a stub that will link to assessment flows — do not duplicate them.
- pt-02-messages `thread-panel` allowlist: implement as client-side filter in the Messages route; flag where server-side filtering must also exist (P0 HIPAA gate); do NOT rely on client-only filter as the sole guard.
- App dev server: `pnpm --filter @haven/app-patient dev` → http://localhost:5176
