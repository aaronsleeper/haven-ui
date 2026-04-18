# Context Budget — Care Plan Creation

> Per-step context loading profiles. Each expert loads the minimum viable context
> for their role in that step. Shared context loads once per workflow run.

---

## Shared context (loaded once)

| Source | Lines (est.) | Rationale |
|---|---|---|
| Workflow README | ~50 | Workflow identity, participating experts, hardcoded gates |
| Patient record (assessment data) | ~80 | The entity this workflow operates on — all steps need it |
| Care plan template structure | ~30 | Structural reference for what the output must contain |
| **Shared total** | **~160** | |

---

## Per-step expert context

### Step 1 — Draft care plan (Clinical Care)

| Layer | Loaded? | Rationale |
|---|---|---|
| README | Yes | Identity and scope |
| domain-knowledge | Yes | MNT guidelines, clinical standards needed for drafting |
| judgment-framework | Yes | Tradeoff resolution for conflicting clinical signals |
| output-contract | Yes | Care plan draft must match contract |
| task-routing | Yes | Confirms model tier |
| quality-criteria | No | Not self-evaluating at this step |
| dependencies | No | Not relevant during drafting |
| escalation-thresholds | No | Drafting is autonomous |
| **Expert total** | **~400 lines** | Core work profile per expert-spec.md |

**Step 1 total: ~560 lines** (shared + expert). Within budget.

### Steps 2a/2b/2c — Parallel review (fan-out)

Each reviewer loads its **design review** profile:

| Expert | Layers loaded | Lines (est.) |
|---|---|---|
| Clinical Care | README + quality-criteria + judgment-framework + task-routing | ~300 |
| UX Design Lead | README + quality-criteria + judgment-framework + task-routing | ~350 |
| Compliance | README + quality-criteria + judgment-framework + task-routing | ~300 |

**Fan-out note:** These run in parallel, not simultaneously in one context window.
Each review is an independent agent invocation with its own context. Total per
review step: ~460-510 lines (shared + expert review profile).

### Step 3 — Reconcile reviews (Patient Ops)

| Layer | Loaded? | Rationale |
|---|---|---|
| README | Yes | Identity |
| output-contract | Yes | Reconciled output must match contract |
| dependencies | Yes | Needs to understand expert interfaces to merge findings |
| escalation-thresholds | Yes | Determines whether conflicts auto-resolve or escalate |
| **Expert total** | **~200 lines** | Reduced profile — reconciliation is structural, not domain-deep |

**Step 3 total: ~360 lines** + three handoff envelopes (~50 lines each = ~150).
Grand total ~510 lines. Within budget.

### Steps 4-6 — Human gates

No expert context loaded. The orchestrator renders the handoff envelope as an
approval card. The human sees the artifact, not expert reasoning.

### Step 7 — Lock and activate (Patient Ops)

| Layer | Loaded? | Rationale |
|---|---|---|
| README | Yes | Identity |
| output-contract | Yes | Final output format |
| **Expert total** | **~90 lines** | Minimal — mechanical state transition |

**Step 7 total: ~250 lines.** Lightest step in the workflow.

---

## Budget summary

| Step | Experts active | Est. context lines | Status |
|---|---|---|---|
| 1. Draft | 1 (Clinical Care) | ~560 | Within budget |
| 2a-c. Review | 1 per invocation | ~460-510 each | Within budget (parallel, not combined) |
| 3. Reconcile | 1 (Patient Ops) | ~510 | Within budget |
| 4-6. Human gates | 0 | ~160 (shared only) | Minimal |
| 7. Lock | 1 (Patient Ops) | ~250 | Within budget |

No step exceeds the ~1,400-line expert context guideline from workflow-spec.md.
