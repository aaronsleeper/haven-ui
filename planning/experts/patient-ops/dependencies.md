# Dependencies — Patient Ops

## Depends on

| Expert | What flows in | What breaks if unavailable | Fallback mode | Fallback detail |
|---|---|---|---|---|
| Clinical Care | Assessment data, care plan drafts, clinical review findings, nutrition parameters | Cannot draft care plans, cannot run clinical review step | `human-covers` | RDN drafts care plan manually using structured checklist; confidence capped at `low` |
| Compliance | Compliance review verdicts, consent scope rules, PHI field access matrix | Compliance review step runs in fallback; care plan proceeds without compliance validation | `checklist` | Static compliance checklist for PHI fields and consent coverage; catches known issues, misses nuance; confidence capped at `medium` |
| UX Design Lead | Approval card specs, presentation review findings | UX review step skipped; care plan advances without presentation optimization | `skip-and-flag` | Non-blocking — UX issues are presentation, not safety. Flag for later review. |
| Operations/Compliance | Revenue cycle policy, billing compliance context | Cannot validate billing-related workflow steps (claim triggers, discharge billing) | `human-covers` | Coordinator verifies billing steps manually |

## Depended on by

| Expert | What flows out | What breaks if this expert is unavailable |
|---|---|---|
| Clinical Care | Workflow orchestration signals (when to draft, when review is needed) | Clinical Care has no orchestrator to trigger its workflow steps |
| Compliance | Compliance review requests within workflows | Compliance checks not triggered at workflow gates |
| UX Design Lead | Presentation review requests within workflows | UX review not triggered; designs not validated against live workflows |
| QueueManager (agent) | Queue items with priority, SLA, and context | Coordinator queue is not populated; human review items don't surface |
| All downstream workflows | Status transitions and trigger events | Meal prescription, scheduling, monitoring, and discharge don't fire |
