# Patient app — IA-v1 wireframe-layer reconciliation (ux-architect, Stage 1)

**Date:** 2026-05-24 · **Pipeline stage:** ux-architect (Phases 1–3 → Gate 1) · **Status:** awaiting Gate 1.

The existing patient wireframes (`pt-01..05`, `assess-01..05`, `onb-01..03`, the demo shell docs) describe the **pre-IA-v1 demo app**: 5-tab nav (Dashboard / My Health / Messages / Care / Settings), the `task-card` checklist paradigm, a Dashboard-not-Home front door. IA-v1 (anchored 2026-05-24) replaced that architecture. This doc reconciles the wireframe layer to the canonical architecture so the **wrapper (shell + nav + links) is pinned upstream and consumed by the build** — not re-derived per slice (the failure that produced the recall agentic-shell drift).

**This doc owns (canonical):** the shell-canon *for wireframes* (which shell each surface's `shells:` frontmatter declares), the nav reconciliation, and the wireframe-set inventory (author / retire). It **references** — does not restate:
- `~/.claude/plans/patient-app-ia-v1.md` — surfaces, 3-tab nav, per-surface agent role. THE architecture.
- `~/.claude/plans/ui-workflow-ia-synthesis/surface-primary-shell-model.md` — shell paradigm (dockable agent, not 3-pane), per-surface shell-fit.
- the `flow-*.md` docs — per-surface interaction design.
- `~/.claude/plans/patient-app-home-surface.md` — Home composition/states.

---

## Phase 1 — Discovery (delta only; full discovery lives in IA-v1 + flows)
- **Population/constraints** unchanged: HIV+/food-insecure adults, mixed/low tech-literacy, ESL (EN v1), sensitive. Dignity, no gamification/surveillance, mobile-first, WCAG AA, 5th–6th grade. (IA-v1 population frame.)
- **What changed since the demo wireframes:** the surface-primary pivot (agents do the work; the patient surface is NOT a chat window), the 6→3 nav collapse, and the "center-pane agent chat → dockable agent" shell delta. The demo wireframes predate all three.

## Phase 2 — Functional spec
No new functions. Functions are owned by the `flow-*.md` docs (per-surface) and IA-v1 (surface set). The reconciliation is structural (wrapper + nav), not functional.

## Phase 3 — Information architecture (the reconciliation)

### Shell-canon for wireframes (define-once — every patient wireframe's `shells:` frontmatter declares this)
Per `surface-primary-shell-model.md` §Desktop-vs-mobile + §per-surface shell-fit:
- **Canonical patient shell = `layout-app-shell-responsive`** (responsive: desktop sidebar + mobile bottom-nav; one nav authored once, two renderings). This is what every shipped slice already uses (home, assessments, log-outcome, appointments, order-status, survey). It carries the IA-v1 3-tab nav, a dockable/summonable agent affordance (later layer), and global "Talk to a person" + Account corner.
- **NOT the CC `agentic-shell`** (3-pane, center-chat). The shell-model commits "center-pane agent chat → dockable agent; chat is not the app." The recall slice's agentic-shell is the drift this reconciliation corrects.
- **Focused-canvas carve-out (nav suppressed):** one-time and stepper moments render full-canvas inside the shell with nav suppressed — onboarding/consent (one-time), assessment/survey/recall runners (focused flow). This is the assessments SHELL-DECISION (2026-05-14) pattern, generalized.
- **`mobile-shell` vs `layout-app-shell-responsive`:** the demo wireframes declare `mobile-shell` (430px mobile-only envelope); the shipped slices use `layout-app-shell-responsive` (handles mobile via bottom-nav AND desktop via sidebar). **Recommend standardizing on `layout-app-shell-responsive`** — shell-model wants desktop + mobile, and it's the de-facto built shell. (Gate-1 decision 1.)

### Nav reconciliation (define-once — IA-v1 wins)
- **Canonical: IA-v1 3-tab — Home · Order · Activity.** Supersedes BOTH the demo 5-tab (Dashboard/My Health/Messages/Care/Settings) AND `surface-primary-shell-model.md`'s "~4 anchors" table (Home/Order/Inbox/Talk-to-person). Reconciliation: IA-v1's **Activity** = shell-model's **Inbox** (notifications/messages list); **Talk to a person** is a **global affordance**, not a tab; **Account** is the header corner; **My Health** + **Appointments** are **Home rows**, not tabs; check-ins (assessments/recall/survey) are **agent-pushed, no tab**. (shell-model's nav table is marked superseded-by-IA-v1 below.)

### Per-surface shell + nav (the `shells:` + nav each wireframe declares)
| Surface (cap) | Shell | Nav state | Agent mode | Flow doc (canonical design) | Built slice |
|---|---|---|---|---|---|
| Home (greeting + things-to-do) | app-shell-responsive | 3-tab, Home active | Surfacer | flow-greeting / home-surface | home/ ✅ |
| Order — entry/budget/optimize | app-shell-responsive | 3-tab, Order active | Assistant (dockable) | flow-meal-ordering | meals/ 🟡 (5-tab drift) |
| Order — status/pickup/issue | app-shell-responsive | 3-tab, Order active | Assistant (push updates) | flow-order-status | order-status/ ✅ |
| Activity (notifications) | app-shell-responsive | 3-tab, Activity active | Surfacer feeds it | flow-notifications | ⬜ not built |
| My Health (log outcome) | app-shell-responsive | 3-tab (Home-row entry) | Surfacer + Assistant | flow-log-outcome | log-outcome/ ✅ |
| Appointments (request) | app-shell-responsive | 3-tab (Home-row entry) | Surfacer (when due) | flow-request-appointment | appointments/ ✅ |
| Assessments (runner) | app-shell-responsive, **nav suppressed** | focused stepper | Surfacer→pushes | flow-take-assessment | assessments/ ✅ |
| Satisfaction survey | app-shell-responsive, **nav suppressed** | focused stepper | Surfacer | flow-take-assessment (survey) | satisfaction-survey/ ✅ |
| **Dietary recall** | app-shell-responsive + **food-list working surface** (right-pane desktop / full-screen sheet mobile) | focused interview | **Interviewer** | flow-dietary-recall | dietary-recall/ ❌ (CC agentic-shell — REBUILD) |
| Onboarding / consent | app-shell-responsive, **nav suppressed** (one-time) | focused canvas | — | flow-onboarding | onboarding/ ✅ |
| Talk to a person | global affordance (every surface) | — | hands to human | flow-talk-to-person | (in every slice) |

### Component gaps for haven-mapper
**None.** The PL is complete for every surface (verified 2026-05-24: all required classes present in `components.css` + the compiled bundle). The reconciliation needs zero new primitives — recall's rebuild composes existing primitives in the patient shell (`patient-recall-list` as the food-list surface + chat affordances + `layout-app-shell-responsive`), dropping `agentic-shell`/`panel-*`.

### Wireframe-set inventory (Stage 2 work)
- **Author new** (no wireframe exists; were build-invented): `recall` (food-list-surface interview), `satisfaction-survey`, `appointments`, `order-status`, `activity`. Each with `shells: [{name: <canonical>, pl_shell_version: <current>}]`.
- **Re-derive to IA-v1** (demo→canonical): `home` (Dashboard→Home, task-card→focus-card/Surfacer), `order` (meals, 5-tab→3-tab), `my-health` (from log-outcome), `assessments` (verify 3-tab + nav-suppressed).
- **Retire** (map to the abandoned demo app, not IA-v1): `pt-01-dashboard`, `pt-02-messages`, `pt-03-settings`, `pt-05-care`, `tasks-01`, `dashboard-tasks-section`, and the demo shell docs (`patient-mobile-shell`, `shell-pt-mobile`, `pt-shell-flow`) — archive, supersede with the IA-v1 shell wireframe. (Gate-1 decision 2: retire vs update.)
- **Stale doc to mark superseded:** `surface-primary-shell-model.md` nav table (4-anchor) → annotate "nav superseded by IA-v1 3-tab; paradigm/shell-fit still canonical."

---

## Gate 1 — decisions for Aaron
1. **Canonical patient shell:** standardize on `layout-app-shell-responsive` (responsive; what the slices use), retiring the wireframes' `mobile-shell` declaration? (Rec: yes.)
2. **Demo wireframes:** retire/archive `pt-*`/`tasks-*`/demo-shell-docs as pre-IA-v1, and author a fresh IA-v1 wireframe set? Or update-in-place? (Rec: archive + author fresh — the demo app is a different architecture.)
3. **Recall wrapper (confirm):** patient shell + food-list working surface (right-pane desktop / full-screen sheet mobile) + agent-led interview, per shell-model — NOT the CC 3-pane. (Rec: yes; this is the canonical shell-model spec.)
4. **Scope of Stage 2:** author the full IA-v1 wireframe set (≈10 surfaces), or sequence it (recall + the 4 un-wireframed first, since those are the live drift; re-derive home/order/assessments second)? (Rec: sequence — close the drift first.)
