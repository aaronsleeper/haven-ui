# Task Routing — Patient Ops

Determinism assessment and model tier for each task this expert performs.

---

## Task map

| Task | Model tier | Determinism | Rationale | Extraction status |
|---|---|---|---|---|
| Status transition execution | Light (Haiku) | High — validate prerequisites, update status, fire triggers | Mechanical: check a list, update a field, send events. No judgment. | Strong candidate for extraction — could be a state machine function |
| Queue item creation | Light (Haiku) | High — populate fields from workflow context | Template-filling from structured data. Headline requires minimal judgment. | Candidate for extraction — template engine with field mapping |
| Review reconciliation (no conflicts) | Light (Haiku) | High — merge three pass verdicts into one output | If all reviews pass, reconciliation is mechanical aggregation. | Extractable — merge function for structured review outputs |
| Review reconciliation (with conflicts) | Standard (Sonnet) | Medium — apply authority rules, determine if human escalation needed | Authority rules are defined, but matching a novel conflict to the right rule requires judgment. | Not extractable — rule application needs contextual reasoning |
| Stuck patient detection | Light (Haiku) | High — query patients by status duration, compare to threshold | Time-based check against a threshold. | Extractable — scheduled query with threshold comparison |
| Queue priority scoring | Standard (Sonnet) | Medium — composite scoring with multiple factors | Priority classes are defined, but edge cases (competing P1s) require judgment. | Partially extractable — class assignment is deterministic, within-class ordering needs judgment |
| Discharge package assembly | Standard (Sonnet) | Medium — structured but requires assembling data from multiple sources | Pulling data from care plan history, clinical records, meal records, claims. Judgment needed for outcome narrative. | Not extractable — data assembly requires cross-source synthesis |
| Conflict resolution (novel) | Deep (Opus) | Low — cross-domain synthesis, no precedent in authority rules | Novel conflict between experts with no clear rule. Requires understanding both positions and the patient's situation. | Not extractable — must remain judgment |
| Coordinator communication | Standard (Sonnet) | Medium — structured but tone and framing matter | Queue items need clear, actionable framing. Approval cards need appropriate context depth. | Not extractable — communication quality requires reasoning |

---

## Selective loading profiles

| Activity | Layers loaded |
|---|---|
| Status transition | README + domain-knowledge (state machine) + task-routing |
| Queue item creation | README + domain-knowledge (queue management) + output-contract (queue item format) + task-routing |
| Review reconciliation | README + domain-knowledge (conflict rules) + judgment-framework + output-contract + task-routing |
| Stuck patient scan | README + domain-knowledge (gap detection) + output-contract (alert format) + task-routing |
| Discharge processing | README + domain-knowledge (discharge) + output-contract (discharge package) + quality-criteria + task-routing |
| Self-assessment | README + quality-criteria + retro-log + task-routing |
| 360 review of another expert | README + quality-criteria + output-contract + dependencies |
