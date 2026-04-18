# Checkpoints — Meal Prescription

> Human decision points in this workflow. Fewer gates than care-plan-creation
> because the care plan's clinical content was already approved upstream — this
> workflow translates approved clinical targets into meals, not clinical judgment.

---

## Checkpoint 1 — RDN review: no valid recipes (conditional, after step 4b)

```yaml
after_step: "4.b"
tier: gate
audience: RDN (assigned to this patient)
sla: 24 hours
escalation: Escalate to RDN supervisor at 24h.
hardcoded: true  # cannot relax clinical restrictions without RDN
condition: Recipe matching produced zero valid results
```

**What the RDN sees:**

| Card section | Content | Source |
|---|---|---|
| Patient summary | Name, diagnosis codes, active allergen exclusions | Patient record |
| Constraint analysis | Which constraints eliminated which recipes — sorted by impact | Step 3 match result |
| Near-misses | Recipes that almost matched, with the specific constraint that excluded them | Step 3 match result |
| Prescription parameters | Full prescription (caloric range, macros, restrictions) | Step 1 output |
| Kitchen catalog summary | How many active recipes the kitchen has, coverage by dietary category | Recipe catalog metadata |

**Decision options:**

| Decision | Routing |
|---|---|
| **Relax a soft constraint** | Specify which preference to deprioritize → return to step 3 with relaxed parameters |
| **Request new recipe** | Route to kitchen with specific nutritional requirements the catalog is missing |
| **Modify nutrition plan** | Triggers care plan update (workflow 1.9) → this workflow restarts with new parameters |
| **Approve alternative kitchen** | If another kitchen has matches → coordinator confirms reroute |

---

## Checkpoint 2 — Coordinator confirm: limited variety (conditional, after step 4a)

```yaml
after_step: "4.a"
tier: notify
audience: Care coordinator (assigned to this patient)
sla: 4 hours
escalation: Proceed with best available selection if no response.
hardcoded: false  # coordinator confirm is a quality check, not a safety gate
condition: Recipe matching produced 1-4 options per meal slot
```

**What the coordinator sees:**

| Card section | Content |
|---|---|
| Meal selection | Proposed meals for the week with preference match scores |
| Variety note | How limited the selection is and why (which constraints are narrowing options) |
| Patient preferences | Cultural preferences, stated likes/dislikes, feedback history |

**Decision options:**

| Decision | Routing |
|---|---|
| **Approve** | Proceed to step 5 |
| **Override selection** | Coordinator picks different meals from the eligible list |
| **Escalate to RDN** | If coordinator suspects the constraints are too aggressive → routes to checkpoint 1 |

---

## Checkpoint 3 — Coordinator approve: kitchen reroute (conditional)

```yaml
after_step: "3.0"
tier: gate
audience: Care coordinator (assigned to this patient)
sla: 4 hours
escalation: Reminder at 2h. Escalate to coordinator supervisor at 4h.
hardcoded: true  # patient must be informed when delivery source changes
condition: Primary kitchen cannot fulfill, alternative kitchen identified
```

**What the coordinator sees:**

| Card section | Content |
|---|---|
| Reroute reason | Why primary kitchen can't fulfill (inventory, capacity, no matching recipes) |
| Alternative kitchen | Which kitchen, their match quality, delivery logistics differences |
| Patient impact | Any changes to delivery schedule, format (fresh→frozen or vice versa) |

**Decision options:**

| Decision | Routing |
|---|---|
| **Approve reroute** | Alternative kitchen receives the order, patient is notified |
| **Reject — keep primary** | Return to step 3 with primary kitchen only — may result in limited variety or no-match path |
| **Reject — hold delivery** | Pause this cycle's delivery, resolve with kitchen before next cycle |

---

## Checkpoint summary

| # | Gate | Audience | Hardcoded | Condition |
|---|---|---|---|---|
| 1 | RDN review (no matches) | RDN | Yes | Zero valid recipes |
| 2 | Coordinator confirm (limited) | Coordinator | No | 1-4 options per slot |
| 3 | Coordinator approve (reroute) | Coordinator | Yes | Kitchen reroute needed |

This workflow has no always-on gates — all checkpoints are conditional.
The default path (sufficient matches, single kitchen) runs fully autonomous
from trigger to locked prescription. Human involvement only triggers when
the recipe catalog can't satisfy the clinical prescription or when the
delivery source changes.
