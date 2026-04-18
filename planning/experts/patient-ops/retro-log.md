# Retro Log — Patient Ops

Running log of decisions made and outcomes observed.

---

## Consolidated learnings

*No consolidated learnings yet — expert is in draft status.*

---

## Interaction summaries

### 2026-04-09 — Initial expert authoring

**Task:** Draft the Patient Ops expert spec (all 9 layers + retro log).
**Recommendation:** Scope to lifecycle orchestration and coordinator queue
management. Distinguish from Clinical Care (domain judgment) and QueueManager
agent (runtime implementation). Patient Ops is the intelligence layer that
decides WHAT goes in the queue and WHEN transitions happen; QueueManager is
the runtime that PRESENTS the queue.
**Outcome:** Expert drafted at v0.1. Orchestration scope is clear. Heavy
reliance on care-plan-creation step-level workflow spec for reconciliation
behavior. Five output types defined.
**Overrides:** None — first draft.
**Surprises:** The "no patient in limbo" assumption (A1) is load-bearing —
it's the single principle that drives stuck-patient detection, error routing,
and queue item creation. If this assumption fails in practice (a patient
ends up in a state with no defined next action), the entire orchestration
model has a gap.
**Layers affected:** All — initial authoring.
