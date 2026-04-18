# Quality Criteria — Patient Ops

Testable definitions of what "good" looks like for each output type.

---

## Patient status transition

| # | Criterion | Pass | Fail |
|---|---|---|---|
| 1 | Transition is valid per state machine | Transition exists in the valid transitions table | Attempted invalid transition (e.g., referral_received → active) |
| 2 | All prerequisites are verified before transition | Prerequisites list is populated and all items are true | Any prerequisite missing or unchecked |
| 3 | Downstream triggers fire atomically | All expected triggers fired and logged | Any trigger missed or partially fired |
| 4 | Transition logged with actor and timestamp | Audit event recorded with all required fields | Transition executed without audit event |

## Reconciled review output

| # | Criterion | Pass | Fail |
|---|---|---|---|
| 1 | All participating reviews accounted for | Every expected expert review has a verdict | Any expert review missing without documented fallback |
| 2 | Conflicts cite both positions with evidence | Each conflict includes expert name, finding, and source | Conflict described vaguely ("reviewers disagreed") |
| 3 | Resolution cites the applicable authority rule | Resolution references shared principle, workflow rule, or human decision | Resolution without rationale |
| 4 | Degradation manifest propagated | If any review ran in fallback, the manifest is present and visible | Fallback occurred but not flagged in reconciled output |
| 5 | No clinical finding silently overridden by non-clinical concern | Clinical findings resolved by clinical authority, not by UX or operational preference | Clinical concern dismissed for non-clinical reason |

## Queue item

| # | Criterion | Pass | Fail |
|---|---|---|---|
| 1 | Headline is an action statement | Starts with a verb: "Approve," "Review," "Decide" | Descriptive statement ("Care plan is ready") |
| 2 | Context includes only decision-relevant information | 2-3 sentences that help the coordinator decide THIS item | Full patient history crammed into context |
| 3 | One action per queue item | Item requires exactly one decision | Item bundles multiple unrelated decisions |
| 4 | Priority class is correct per queue-prioritization.md | Priority matches the composite scoring rules | Over- or under-prioritized |
| 5 | SLA is assigned and accurate | SLA matches the escalation table for this item type | SLA missing or incorrect |
| 6 | Thread link resolves to full context | thread_id links to the complete interaction history | Broken or missing thread link |

## Stuck patient alert

| # | Criterion | Pass | Fail |
|---|---|---|---|
| 1 | Alert fires at the correct threshold | 7+ days with no activity triggers alert | Alert fires too early (<7 days) or too late (>14 days) |
| 2 | Expected next action is identified | Specific action named ("RDN should review care plan draft") | Vague ("something should happen") |
| 3 | Blocker is identified or explicitly marked "none identified" | Blocker named with evidence, or gap acknowledged | Blocker field empty |

## Discharge package

| # | Criterion | Pass | Fail |
|---|---|---|---|
| 1 | All closure actions completed or documented as skipped | Every action in the closure list has a boolean result | Any action unaccounted for |
| 2 | Transition summary includes clinical outcome deltas | HbA1c, weight, PHQ-9 deltas present (or documented as unavailable) | Outcome metrics missing without explanation |
| 3 | Discharge type matches the trigger | Discharge type accurately reflects why the episode ended | Misclassified (e.g., "routine" when patient requested exit) |
| 4 | Partner notification includes outcomes data | Partner receives the summary per contract requirements | Partner notified without outcomes |
