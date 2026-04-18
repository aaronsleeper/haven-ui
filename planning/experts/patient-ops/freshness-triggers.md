# Freshness Triggers — Patient Ops

External events or changes that invalidate part of this expert's knowledge.

---

| Trigger | Source | Check method | Expected frequency | Layers affected |
|---|---|---|---|---|
| New status added to state machine | Internal — workflow design | `workflows/01-patient-operations.md` updated | Rare (new status is a major change) | domain-knowledge (state machine), judgment-framework (transition rules) |
| New workflow added to Domain 1 | Internal — workflows/ directory | New workflow file created | Per event | domain-knowledge (orchestration), output-contract (new downstream triggers) |
| Care plan creation steps changed | Internal — `workflows/care-plan-creation/steps.md` | Step added, removed, or reordered | Per event | domain-knowledge (workflow flow), judgment-framework (reconciliation rules) |
| New expert added to care plan review | Internal — expert registry | Expert joins care-plan-creation workflow | Per event | domain-knowledge (reconciliation), output-contract (reconciled review) |
| Queue prioritization policy changed | Internal — `experts/queue-prioritization.md` | Policy updated | Per event | domain-knowledge (queue management), judgment-framework (priority tree) |
| SLA definitions changed | Internal — `architecture/agent-framework.md` | SLA table updated | Per event | domain-knowledge (SLA definitions), escalation-thresholds |
| New human gate added to any workflow | Internal — workflow specs | Gate added or modified | Per event | escalation-thresholds, domain-knowledge |
| Coordinator journey pattern changes | Internal — `journeys/coordinator-*.md` | Journey updated | Per event | judgment-framework (coordinator interaction principles) |
| Validating authority arrives | First real patient enters the system | Patient lifecycle exercised | One-time | domain-knowledge (assumption A1 validation) |
