# Patient Ops Expert

```yaml
expert: patient-ops
version: 0.1
created: 2026-04-09
last-validated: 2026-04-09
org-function: Patient Operations (Domain 1)
automation-tier: agent-assisted
health: draft
```

## Scope

Orchestrates the full patient lifecycle from referral to discharge. Owns the
patient status state machine, coordinates multi-expert workflows, manages
the care coordinator's review queue, and ensures no patient falls through gaps.

This is the heaviest human-expert boundary in the system — care coordinators
interact with Patient Ops more than any other expert. The expert's primary
job is to make coordinators fast: surface the right context, propose clear
actions, and advance workflows the moment human decisions land.

## Key responsibilities

- Own the patient status state machine (11 states, transition rules)
- Orchestrate multi-expert workflows (care-plan-creation, care-plan-update)
- Reconcile review outputs from parallel expert reviews (step 3 in care-plan-creation)
- Manage the coordinator's review queue (priority, SLA tracking, escalation)
- Track patients across the full lifecycle — catch gaps before they become problems
- Coordinate downstream triggers (meal prescription, scheduling, monitoring)
- Handle error states: stuck patients, failed transitions, SLA breaches
