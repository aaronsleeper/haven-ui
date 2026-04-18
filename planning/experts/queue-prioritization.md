# Queue Prioritization & Portfolio Management

> The system's triage policy. When multiple workflow instances compete for the
> same human attention or expert capacity, this document defines how the
> QueueManager agent decides what gets processed next. It composes with — not
> replaces — SLA clocks, commander's intent, and degradation manifests from
> existing specs.
>
> Consumed by: `QueueManager` (architecture/agent-framework.md, meta layer).
> References: `workflow-spec.md` (SLA, commander's intent, autonomy tiers),
> `fallback-modes.md` (degradation signals), `shared-principles.md` (safety
> before speed, conservative by default).

---

## Priority classes

Every item in the QueueManager's queue belongs to exactly one class. Classes
are absolute — all items in a higher class process before any item in a lower
class, regardless of scoring within classes.

| Class | When | Examples | Processing rule |
|---|---|---|---|
| **Critical** | Safety or regulatory constraint is at risk or already violated | Crisis protocol triggered, PHI violation detected in a care plan view, clinical safety flag from step 2a error route, degradation boundary crossed per commander's intent | Immediate: push notification + escalation. No batching. |
| **Standard** | Normal workflow processing | RDN approval pending, coordinator sign-off, compliance review awaiting human input, claim review | Sorted by composite score (see below). Batching allowed. |
| **Deferred** | Intentionally parked | Workflow paused by human choice, pending external dependency (lab results, payer eligibility response), intentionally delayed by coordinator | Not scored. Resumes on trigger event and enters Standard at its computed score. |

**Class transitions:**

- Standard → Critical: degradation boundary crossed, safety flag raised, or
  SLA breaches 2× ceiling (see starvation prevention)
- Standard → Deferred: human explicitly parks the item, or workflow blocks on
  external dependency
- Deferred → Standard: trigger event fires (lab result arrives, payer responds,
  human unparks)
- Critical → Standard: safety concern resolved, item returns to normal processing

**Structural encoding of principle #1 (safety before speed):** Safety items
are not "highly weighted" within a shared queue — they are in a separate lane
that categorically precedes all non-safety work. This makes the guarantee
architectural, not probabilistic.

---

## Composite scoring (Standard class)

Items in the Standard class are sorted by a composite score (0–100) computed
from five signals. The QueueManager recalculates scores on each sort pass —
scores are live, not frozen at queue entry.

### Signal definitions

#### 1. SLA urgency (weight: 30)

**Source:** Step SLA clock — time remaining as percentage of total SLA.

**Curve:** Non-linear. The score accelerates as the deadline approaches,
reflecting the reality that the first 50% of an SLA is less urgent than the
last 20%.

| SLA remaining | Score contribution (of 30) |
|---|---|
| > 75% | 0–5 |
| 50–75% | 5–12 |
| 25–50% | 12–20 |
| 10–25% | 20–27 |
| < 10% | 27–30 |

**Test:** A care plan at step 4 with 22 hours of its 24-hour SLA remaining
scores ~3. The same care plan with 3 hours remaining scores ~25. The
non-linearity means items don't clog the top of the queue until they actually
need attention.

#### 2. Clinical acuity (weight: 25)

**Source:** Patient risk tier (from RiskScoringAgent) combined with the
workflow's priority stack.

| Risk tier | Base score (of 25) |
|---|---|
| Critical | 25 |
| High | 18–22 |
| Medium | 10–15 |
| Low | 3–8 |

**Workflow type modifier:** Workflows whose commander's intent priority stack
places patient safety at position #1 (care plan creation, clinical
documentation) receive full clinical acuity scoring. Workflows where safety
is lower in the stack (report generation, billing reconciliation) receive
clinical acuity at 60% — the patient's risk tier still matters, but the
workflow itself is less safety-sensitive.

**Test:** A high-risk patient's meal prescription workflow (safety is priority
#1 in that workflow's intent) scores 18–22. A high-risk patient's monthly
partner report (safety is not the primary concern) scores 11–13.

#### 3. Degradation pressure (weight: 20)

**Source:** Degradation manifest — count and severity of degraded steps in
the workflow so far.

| Degradation state | Score contribution (of 20) |
|---|---|
| No degradation | 0 |
| One step degraded, confidence `medium` | 5–8 |
| One step degraded, confidence `low` | 8–12 |
| Multiple steps degraded | 12–18 |
| Approaching acceptable degradation boundary | 18–20 |

**Direction: degraded workflows go UP, not down.** A care plan where Clinical
Care ran via checklist (step 2a fallback, confidence capped at `medium`) is
more dependent on the RDN catching issues at step 4. The human review is
compensating for reduced agentic coverage — it needs to happen sooner.

If degradation crosses the workflow's acceptable degradation boundary (from
commander's intent), the item escalates from Standard to Critical class
entirely. This score dimension only applies to degradation that is still
within acceptable bounds.

**Interaction with principle #8 (degradation is visible):** Prioritization
ensures degraded items reach humans faster. The degradation manifest (already
required by fallback-modes.md) ensures the human knows what's degraded when
they see it. Speed of routing + visibility at review = the system compensating
for its own reduced confidence.

#### 4. Workflow stage (weight: 15)

**Source:** Step position relative to total workflow length.

| Stage | Score contribution (of 15) |
|---|---|
| Early (first 25% of steps) | 0–3 |
| Mid (25–50%) | 3–7 |
| Late (50–75%) | 7–11 |
| Final (last 25% of steps) | 11–15 |

**Rationale:** A care plan at step 6 (coordinator approval) has passed through
drafting, three parallel reviews, reconciliation, and RDN sign-off. Letting it
stall now wastes all prior work. A care plan at step 1 (drafting) has less
invested context — it can wait longer without system-level cost.

**Test:** Two care plans at RDN approval (step 4 of 7 = ~57%). Both score
~8–9 on workflow stage. A care plan at coordinator approval (step 6 of 7 =
~86%) scores ~13.

#### 5. Wait time (weight: 10)

**Source:** Wall-clock time since item entered the current queue position.

This is the FIFO tiebreaker. Among items with similar composite scores on
the other four dimensions, the one that's been waiting longest wins.

| Wait time | Score contribution (of 10) |
|---|---|
| < 15 min | 0–1 |
| 15 min – 1 hour | 1–3 |
| 1–4 hours | 3–6 |
| 4–12 hours | 6–8 |
| > 12 hours | 8–10 |

**Deterministic tiebreaker:** If two items' total composite scores are within
2 points of each other, the item with the earlier queue entry timestamp
processes first. No randomness.

---

## Resource contention

### Human role contention

When one human role (RDN, BHN, coordinator) has multiple items from different
workflows pending simultaneously:

**Queue presentation:** Items are sorted by composite score within the role's
queue. The human sees the highest-priority item first but can choose to
process any item — the queue is a recommendation, not a lock.

**No preemption:** If the RDN is actively reviewing one care plan and a
higher-priority one arrives, the new item enters the queue at its computed
position. The QueueManager does not interrupt the active review. Notification
is appropriate; forced context-switching is not.

**Batch awareness:** When a role has 5+ pending items of the same type (e.g.,
all nutrition plan approvals), the QueueManager surfaces a batch review
option. Batch review groups similar items so the reviewer can maintain
cognitive context across reviews rather than switching between unrelated
workflow types. Within the batch, items are still sorted by composite score.

### Expert agent contention

When the same expert agent is requested by multiple workflow instances
simultaneously:

1. The QueueManager serializes requests by composite score — highest-priority
   workflow gets the expert first
2. Lower-priority requests queue behind it with their own SLA clocks running
3. If serialization would cause an SLA breach on a waiting request, the
   QueueManager evaluates whether the expert can run concurrently (stateless
   specialists can; orchestrators cannot) or whether escalation is needed

**Capacity signal:** When an expert's queue depth exceeds 3 pending requests,
the QueueManager logs a capacity warning. Persistent capacity warnings
(3+ times per week) are a signal for the system postmortem process — the
expert may need splitting (per expert-spec.md splitting criteria) or the
workflow may need load-balancing.

---

## Human gates and queue position

A workflow waiting at a human gate retains and updates its priority position
continuously:

- **SLA clock keeps running** — urgency score rises while waiting
- **Degradation signals can propagate** — if upstream retro data or system
  events change the degradation state, the pressure score updates
- **Score recalculation on each sort pass** — the item's position in the
  human's queue is live, not frozen at gate entry
- **No queue-position penalty for human waits** — a workflow does not restart
  at the back of the queue after passing a human gate. It enters the next
  step's queue with its current composite score. The work already invested
  (reflected in workflow stage score) carries forward.

**Multi-gate workflows:** Care plan creation has 3 sequential human gates
(RDN → BHN → Coordinator). Each gate is a separate queue entry. The workflow's
composite score at each gate reflects its current state — a care plan that
sailed through RDN approval (no edits, high confidence) may score lower at
the coordinator gate than one that required RDN modifications and now carries
edit flags.

---

## Starvation prevention

Without guardrails, high-acuity workflows could indefinitely starve
lower-priority ones. Three mechanisms prevent this:

### Age escalation

Items in the Standard class gain **+1 composite point per hour** after passing
their SLA midpoint. This is additive to the wait time signal — it's a
separate anti-starvation mechanism that compounds with the existing wait
time score.

**Effect:** A low-acuity item (base composite ~30) that has been waiting for
12 hours past its SLA midpoint has gained +12, putting it at ~42 — competitive
with medium-acuity fresh arrivals. This creates a soft guarantee that nothing
waits forever.

### Hard ceiling

No item remains in the Standard class beyond **2× its declared SLA** without
automatic escalation. At the 2× mark:

1. The item escalates to the next role up (coordinator → supervisor → medical
   director, per agent-framework.md SLA escalation table)
2. The escalation is logged in the workflow retro log as an SLA breach
3. The item may transition to Critical class if the breach implicates safety
   (determined by the workflow's priority stack — if the breached step's SLA
   was protecting a safety concern, it's Critical)

### Portfolio health digest

The QueueManager emits a **daily portfolio health digest** summarizing queue
state across all active workflows:

```
portfolio_health {
  timestamp: datetime
  items_by_class: { critical: N, standard: N, deferred: N }
  avg_wait_time_by_class: { critical: duration, standard: duration }
  sla_breach_rate_24h: percentage
  starvation_candidates: [         — items past SLA midpoint with no human touch
    { workflow_id, step_id, patient_id, wait_time, composite_score }
  ]
  capacity_warnings: [             — experts with queue depth > 3
    { expert, queue_depth, oldest_request_age }
  ]
  degraded_workflows_in_queue: N   — how many active items carry degradation
}
```

This digest is consumed by the AuditMonitor and surfaced in the Admin app.
It is the system's self-awareness mechanism for queue health — the equivalent
of a charge nurse checking the board.

---

## Interaction with existing mechanisms

### Commander's intent

The priority stack in each workflow's commander's intent informs scoring
but does not replace it:

- **Clinical acuity modifier** — workflows whose priority stack leads with
  patient safety receive full clinical acuity weight; others receive reduced
  weight (see signal #2)
- **Acceptable degradation boundary** — the trip wire from Standard class
  to Critical class. When a workflow's degradation state crosses this
  boundary, the QueueManager doesn't just score it higher — it reclassifies it
- **Priority stack as escalation context** — when an item escalates (SLA
  breach, class transition), the escalation notification includes the
  workflow's intent statement and priority stack so the human can reason about
  the tradeoff

### Shared principles

| Principle | How it manifests in prioritization |
|---|---|
| #1 Safety before speed | Critical class is structurally separate — not just a high score |
| #4 Tighten, never loosen | A workflow cannot configure its items to score lower than their signals warrant. Scoring is system-level, not workflow-configurable |
| #8 Degradation is visible | Degradation pressure score bumps items up + degradation manifest travels with the queue item to the human reviewer |
| #9 Conservative by default | When a signal is ambiguous or missing (no risk tier available, no degradation manifest), the QueueManager assumes the more conservative interpretation: higher acuity, more degradation pressure |

### SLA clocks

This policy does not replace SLA clocks — it uses them as one of five inputs.
SLA clocks remain the authoritative time-based constraint. This policy adds
the other dimensions (acuity, degradation, stage, fairness) that SLA clocks
alone cannot express.

### Fallback modes

When a workflow runs in fallback, the degradation manifest is the primary
input to the degradation pressure signal. The QueueManager does not need to
understand fallback types — it reads the manifest's confidence caps and gap
declarations, and scores accordingly.

---

## Concrete scenario: 10 care plans pending RDN approval

All 10 are at step 4 of care-plan-creation (RDN approval). Same workflow
stage score (~8). Differentiated by other signals:

| Patient | Risk tier | SLA remaining (of 24h) | Degraded steps | Composite | Position |
|---|---|---|---|---|---|
| A | High | 4h (83% used) | 2a: checklist, conf `medium` | **78** | 1 |
| B | Critical | 8h (67% used) | None | **75** | 2 |
| C | Medium | 2h (92% used) | None | **72** | 3 |
| D | High | 8h (67% used) | None | **68** | 4 |
| E | Medium | 6h (75% used) | 2a + 2c: both checklist | **65** | 5 |
| F | High | 14h (42% used) | None | **55** | 6 |
| G | Medium | 12h (50% used) | None | **45** | 7 |
| H | Low | 20h (17% used) | 2a + 2c | **42** | 8 |
| I | Low | 18h (25% used) | None | **30** | 9 |
| J | Low | 22h (8% used) | None | **22** | 10 |

**Reading the queue:**

- Patient A is first: high risk + acute SLA + degraded clinical review.
  The RDN is the last safety net for a care plan whose clinical review ran
  on a checklist. This is exactly the case where fast human attention
  compensates for reduced agentic coverage.
- Patient B is second despite more SLA remaining: critical risk tier
  generates enough clinical acuity to outweigh C's SLA urgency.
- Patient C is third: medium acuity but 92% SLA consumed. The non-linear
  SLA curve is doing its job — this item is about to breach.
- Patient H (low risk, early SLA, but double degradation) outranks Patient I
  (low risk, similar SLA, no degradation) because degradation pressure
  pulls it up.

**If Patient J waits another 26 hours** (reaching 2× SLA): automatic
escalation to RDN supervisor. If that RDN supervisor queue is also full,
the item transitions to Critical class.

---

## Cross-workflow competition

When care plans compete with other workflow types (meal prescriptions, claim
denials, partner reports) for the same human's attention:

- **Same scoring framework applies.** The five signals and weights are
  workflow-agnostic. A claim denial review with a high-risk patient and
  approaching SLA can outrank a care plan with a low-risk patient and
  plenty of SLA remaining.
- **Clinical acuity naturally favors clinical workflows** — but does not
  monopolize. A meal prescription for a critical-risk patient with renal
  diet constraints scores high on acuity. A partner report for a low-risk
  patient scores low. The signal reflects patient impact, not workflow
  prestige.
- **Batch awareness spans workflow types.** If the coordinator has 3 care
  plan approvals and 4 meal prescription reviews, the QueueManager can
  suggest batching the care plans together and the prescriptions together —
  cognitive context switching between workflow types is expensive for humans.

---

## Implementation notes for QueueManager

The QueueManager agent (meta layer) implements this policy through these
responsibilities:

1. **Score computation** — recalculates composite scores on every sort pass
   (triggered by: new item added, SLA tick, degradation signal received,
   score request from UI)
2. **Class management** — monitors transition triggers (degradation boundary,
   2× SLA ceiling, safety flags) and reclassifies items
3. **Queue presentation** — serves sorted queues to the Admin app and Provider
   app review panels per the left-sidebar pattern in agent-framework.md
4. **Escalation execution** — when SLA breach or class transition triggers
   escalation, routes to the next role per the SLA escalation table
5. **Portfolio health** — emits daily digest; emits real-time capacity
   warnings when expert queue depth exceeds threshold
6. **Audit trail** — every scoring decision, class transition, and escalation
   is a message in the relevant workflow thread (per the thread-is-the-record
   principle)

The QueueManager does not make clinical judgments. It reads signals that
other agents and humans produce (risk tiers, degradation manifests, SLA
clocks) and applies this policy mechanically. Its judgment is limited to
tiebreaking and escalation routing.
