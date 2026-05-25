# Retro log — Cena × UConn Patient App

Workflow-level retrospective per [workflow-spec](../../../../workflows/ui-development/workflow-spec.md) § Workflow review system. Run metrics accumulate per run; slot 34 clusters friction into change proposals against the canonical workflow.

## Run 1 — 2026-05-24 (overnight, formative-first)

- **Trigger:** Aaron — fresh canonical-pipeline run replacing the prior ad-hoc build; mid-run rescope from single-surface (Home) to **whole app, formative-first**.
- **Mode:** proceed-and-document, unattended.
- **Scope reached:** see [review-queue-AM.md](review-queue-AM.md) for what landed.

### Friction observed (for slot-34 clustering)

<!-- Append as encountered. Each entry: what, which slot/step, proposed canonical change. -->
- 2026-05-24: Orchestrator initially scoped the run to a single surface (Home) despite the app having ~13 caps across 6 surfaces. Root: defaulted to the most-developed prior (Home spec) as the unit, not the app. Canonical mitigation already exists — Principle 16 (composition is first-class) + slot-7 app-scoped mode. **Proposed:** the brief template / Phase-0 ordering should make "enumerate the full formative-doc set before any surface" an explicit first step, so app-scope is the default unit, not surface-scope. Surfaced as a candidate canonical change; logged here, not yet a PR.

### Metrics

- Cycle time, step duration, handoff re-requests, SLA breaches, conflict count, override rate — captured once Phase 3 (build) runs with fresh-context reviewers. Phase 0–1 are single-author formative; metrics are light.
