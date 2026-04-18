# Retro Log — Meal Prescription

> Workflow-level retrospective. Tracks run metrics, handoff friction, and
> optimization signals across workflow executions.

---

## Consolidated learnings

_None yet — workflow is in draft status._

---

## Run log

_No runs yet. First entries will appear when the workflow executes against a real
or simulated patient case._

### Entry template

```markdown
### YYYY-MM-DD — [patient ID or simulation label]

**Trigger:** Initial activation / care plan update (which fields changed?)
**Cycle time:** [trigger to locked prescription]
**Step durations:** [per step, noting any that exceeded SLA]
**Match quality:** [sufficient / limited / none — and why]
**Handoff friction:** [any issues at Clinical Care → Meal Ops interface]
**Human gates triggered:** [which conditional checkpoints fired and outcome]
**SLA breaches:** [which steps, by how much, root cause]
**Notes:** [anything surprising — especially prescription→recipe mismatches]
```

---

## Optimization backlog

| Finding | Source | Proposed change | Status |
|---|---|---|---|
| _None yet_ | | | |

---

## Key metrics to watch (once running)

| Metric | Why it matters | Target |
|---|---|---|
| % prescriptions auto-completed (no human gate) | Measures recipe catalog sufficiency | > 80% |
| Time from care plan activation to locked prescription | Core SLA for patient experience | < 30 minutes (auto path) |
| No-match rate | Signals catalog gaps per dietary restriction type | < 5% |
| Allergen violation rate | Safety metric — must be zero | 0% |
| RDN gate resolution time | How long no-match cases take to resolve | < 24 hours |
