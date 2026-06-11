# haven-ui-pipeline-v2

Successor architecture to the current haven-ui UI emission pipeline ([UI Pipeline 🟢](../../../../PIPELINE-REGISTRY.md) — the existing instance at `Lab/haven-ui/tools/surface-emit/`). The v2 is being rebuilt from the ground up after three rewinds on cena-apps patient-app V0 (2026-06-10 → 2026-06-11) confirmed a structural failure shape: the existing pipeline produces clean output of the wrong shape because it lacks gates a mature design+dev team would have.

## Goal

A pipeline (or chain of pipelines, per Aaron's hypothesis) that produces **high-confidence, consistent, adherent UI output as the expectation and pattern** — borrowing patterns from mature design-led teams (Stripe, Linear, Figma, Airbnb) + one design-led-with-clinical-accountability hybrid (Headspace Health).

Aaron's framing (2026-06-11): "this pipeline is the crowning achievement thus far of Vault ... aside from Vault itself. we're rebuilding it from the ground up with all our learnings from past failure modes."

## Folder structure

- [`research/`](research/) — Phase 1-R discovery research
  - [`discovery-brief.md`](research/discovery-brief.md) — the brief every research agent works against (Workflow Designer-authored; Aaron-approved)
  - `companies/` — per-company research outputs (Stripe, Linear, Figma, Airbnb, Headspace Health) once Phase 1-R.b runs
  - `vault-failure-log.md` — past pipeline failure shapes mined from vault session/retro/plan history (Phase 1-R.b parallel sub-dispatch)
- *(future)* `architecture-map.md` — synthesis output from Phase 1-R.c
- *(future)* `cena-recommendation.md` — Q5a + Q5b paired deliverable
- *(future)* `dwg-runs/` — per-pipeline DWG outputs from Phase 2-R

## Parent plan

[cena-fable-window-2026-06-11](../../../../../.claude/plans/cena-fable-window-2026-06-11.md) — the umbrella plan that scopes the work, tracks phase status, and holds the Aaron-review gates.

## Owning expert

[Workflow Designer](../../../experts/workflow-designer.md) — runs the meta-architecture DWG (new variant: discovering the *chain* of pipelines + the coordination layer that ties them together, not a single deliverable-type pipeline).
