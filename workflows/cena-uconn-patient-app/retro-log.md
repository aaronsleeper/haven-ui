# Retro log — Cena × UConn Patient App

Workflow-level retrospective per [workflow-spec](../../../../workflows/ui-development/workflow-spec.md) § Workflow review system. Run metrics accumulate per run; slot 34 clusters friction into change proposals against the canonical workflow.

## Run 1 — 2026-05-24 (overnight, formative-first)

- **Trigger:** Aaron — fresh canonical-pipeline run replacing the prior ad-hoc build; mid-run rescope from single-surface (Home) to **whole app, formative-first**.
- **Mode:** proceed-and-document, unattended.
- **Scope reached:** see [review-queue-AM.md](review-queue-AM.md) for what landed.

### Friction observed (for slot-34 clustering)

<!-- Append as encountered. Each entry: what, which slot/step, proposed canonical change. -->
- 2026-05-24: Orchestrator initially scoped the run to a single surface (Home) despite the app having ~13 caps across 6 surfaces. Root: defaulted to the most-developed prior (Home spec) as the unit, not the app. Canonical mitigation already exists — Principle 16 (composition is first-class) + slot-7 app-scoped mode. **Proposed:** the brief template / Phase-0 ordering should make "enumerate the full formative-doc set before any surface" an explicit first step, so app-scope is the default unit, not surface-scope. Surfaced as a candidate canonical change; logged here, not yet a PR.

## Run 2 — 2026-05-25 (Angular-emit reconciliation, slots 4 + 17)

- **Trigger:** Aaron — scoped re-entry for the Angular-emit variant; Frontend Architecture expert synthesis of two prior read-only surveys (his Angular build + the HTML app).
- **Mode:** synthesis; reviewer + skeptic pass scheduled after.
- **Scope reached:** authored `slots/framework-binding-angular.md` (slot-4 sibling to the static-HTML binding) and `slots/component-plan-angular-reuse.md` (slot-17 new-vs-reuse audit). Grounded against `cena-health-spark/patients/` @ b205df2.

### Friction observed (for slot-34 clustering)

- 2026-05-25: A slot can need **two framework-binding variants in one engagement** (static-HTML owned realization + Angular-emit production target). The slot-4 doc already anticipated this ("a sibling framework-binding is authored for that target"), but the workflow dir had no naming/registration convention for variant slot docs. Resolved ad-hoc with a `variant:` frontmatter field + `-angular` filename suffix. **Proposed:** canonical slot-list should bless a `variant` convention so multi-target engagements don't improvise it.
- 2026-05-25: Preferences-ledger row #6 ("separate `.html`+`.scss`, never inline") is contradicted by his route-level page components (inline `template:`). The ledger encoded an idiom that holds for his reusable `components/*` but not his pages. **Proposed (to the ledger, not the workflow):** soften row #6 + confirm with Andrey. Logged here so slot-34 sees the assumption-vs-code drift pattern (idioms extracted from a partial read of the code).

### Change-proposal to the canonical pipeline (slot-34 cluster)

- 2026-05-25: **Static-HTML `target-framework` should mandate a partials+flatten build, not per-page chrome copy.** Friction: copying nav into every page drifted and rotted cross-surface links — Aaron walked the wired build and hit dead ends; "doesn't feel like walking through an app." Fix shipped this engagement: `scripts/handoff-partials-build.mjs` (chrome defined once, injected into managed nav regions, link-check fails on broken links, output stays flat self-contained HTML for the downstream dev). **Proposed canonical change:** `principles.md` / the static-HTML framework-binding template should require (a) shared chrome via partials/build, (b) a link-check gate over the navigable set, (c) **the build bundles the design-system's framework-agnostic JS primitives** (`src/scripts/components/*.js` — flow-actions, assess-slider, quantity-stepper, cart-panel, …) and pages include the ones they use, so flows ship *interactive and completable*; do NOT author one-off flow JS in the output. PR against the workflow specs, gated by the workflow owner (Principle 10). Logged, not yet a PR.

- 2026-05-25 (meta, Aaron): **Layer-discipline is a first-class orchestration habit** — when a fix is a *property of generation* (recurs for every app/flow: chrome, flow-advancement, link integrity, JS primitives) it belongs in the pipeline/DS layer so every future engagement inherits it; only *output-specific* facts (which button → which next page) belong in the generated output. Caught in-flight: `flow-actions.js` was about to be authored as handoff output; relocated to the DS as a primitive. Discriminator: property-of-generation → up-layer (guarded by the 3-use rule against premature codifying); output-specific → here. This is the same "audit a level higher than the failing system" principle behind Principle 16 + closure-obligations.

### Metrics

- Cycle time, step duration, handoff re-requests, SLA breaches, conflict count, override rate — captured once Phase 3 (build) runs with fresh-context reviewers. Phase 0–1 are single-author formative; metrics are light.
