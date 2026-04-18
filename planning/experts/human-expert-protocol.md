# Human-Expert Interface Protocol

> The explicit rules for how humans and experts collaborate, communicate, and
> calibrate each other. The expert system has well-defined expert-to-expert
> interfaces (output contracts, handoff envelopes, dependency graphs). This
> document defines the equivalent for the human-expert boundary.
>
> Companion to `expert-spec.md` (Layer 8: escalation thresholds),
> `workflow-spec.md` (human checkpoints), and `architecture/agent-framework.md`
> (QueueManager, AlertRouter). Those specs define *what* happens at the
> human-expert boundary; this protocol defines *how*.
>
> Referenced by all expert specs (escalation thresholds reference this for
> delivery mechanics) and all workflow specs (checkpoints reference this for
> feedback capture).

---

## 1. Human registry

The expert registry (`experts/README.md`) tracks experts — identity, health,
dependencies. The human registry tracks the people who interact with the expert
system.

### Registry structure

```
humans/
├── README.md              ← Human registry index (parallel to experts/README.md)
└── <person-or-role>.md    ← Individual entries
```

### Entry format

```yaml
---
name: <person name or role title if unfilled>
status: active | planned | departed
roles: [<role names from roles/*.md>]
---
```

Each entry contains:

| Section | Content |
|---|---|
| **Role mapping** | Which roles from `roles/*.md` this person fills. A person can hold multiple roles. |
| **Expert relationships** | Which experts this person reviews, validates assumptions for, or staffs gates for. Table: expert name → relationship type (reviewer, gate approver, assumption validator, domain authority). |
| **Notification preferences** | How to reach this person for each escalation tier: gate (requires action), notify (FYI), escalate (urgent). Channel and timing preferences. |
| **Capacity** | Approximate availability for gate reviews. Not a schedule — a signal for the QueueManager to estimate wait times and escalation timing. |
| **Onboarding status** | Which experts and workflows this person has been briefed on. New entries start with an onboarding checklist (see section 5). |

### Registry rules

- **One entry per person, not per role.** Vanessa holds multiple roles; she has
  one registry entry listing all of them. This prevents conflicting notification
  preferences or split escalation paths.
- **Role entries for unfilled positions.** When a role exists but nobody fills it
  (e.g., Clinical Operations Director), create a placeholder entry with
  `status: planned`. This makes the gap visible and connects to assumption
  validation — the placeholder lists which assumptions await this role.
- **Registry maintenance.** Updated when people join, leave, or change roles.
  The Expert Operations expert (when built) owns registry maintenance; until
  then, it's manual.

### Relationship to existing docs

- `roles/*.md` define what a role *can do* — permissions, workflows, PHI access.
- Human registry entries define what a specific *person does* — which experts
  they review, which gates they staff, how to reach them.
- `org/org-chart.md` shows the organizational view — functions, owners, automation
  status. The human registry shows the expert system view — who connects to which
  expert through which interface.

---

## 2. Expert→Human channels

Three channel types, matching the escalation tiers in `expert-spec.md` Layer 8.
Each channel defines: what triggers it, what the human receives, what response
is expected, and the SLA.

### Gate channel — "I need your decision"

**Trigger:** An expert's escalation thresholds classify an action as `gate`, or
a workflow checkpoint is declared as a gate.

**Delivery:**

```
gate_item {
  id: string
  source_expert: string
  source_step: string (if within a workflow)
  patient_id: string (if applicable)
  
  context: {
    summary: string           — 2-3 sentences: what happened, what's at stake
    recommendation: string    — what the expert recommends (always opinionated, per vision principle #1)
    confidence: high | medium | low
    assumption_dependencies: [] — which assumptions (from domain-knowledge.md) this recommendation relies on
    degradation: {}           — if any upstream steps ran in fallback mode (per fallback-modes.md)
  }
  
  artifact: object            — the full output per the expert's output-contract (expandable, not forced)
  
  actions: {
    approve: {}               — accept the recommendation as-is
    approve_with_changes: {
      changed_fields: []      — which fields the human modified
      changes: []             — from → to for each changed field
      reason: string          — why (structured capture — see section 4)
    }
    reject: {
      reason: string          — why
      redirect: string        — where to send it (back to expert, to different expert, to human)
    }
    escalate: {
      to: string              — who to escalate to
      reason: string          — why this gate can't be resolved by the current reviewer
    }
  }
  
  sla: duration               — from workflow checkpoint or expert escalation threshold
  escalation_path: string     — who gets it if SLA breaches (from agent-framework.md SLA table)
}
```

**Routing:** QueueManager (from `agent-framework.md`) receives the gate item,
looks up the appropriate human in the human registry by matching the expert
relationship + role, and places it in that person's queue. If no human is
registered for this gate, QueueManager escalates immediately — an unroutable
gate is an urgent system problem.

**UI rendering:** Per `architecture/ui-patterns.md` — gate items appear in the
left sidebar queue with urgency visualization, render as approval cards in the
center panel with context and one-tap actions, and log to the thread in the
right panel.

### Notify channel — "I did this, FYI"

**Trigger:** An expert's escalation thresholds classify an action as `notify`.

**Delivery:**

```
notification {
  source_expert: string
  action_taken: string        — what the expert did
  summary: string             — 1-2 sentences: what happened and why
  override_window: duration   — how long the human has to override before downstream effects lock in
  override_action: {}         — what the human can do if they disagree (same structure as gate reject)
}
```

**Routing:** Delivered per the human's notification preferences in their registry
entry. Lower urgency than gate — notification feed, not queue.

**Key difference from gate:** The expert already acted. The human can override
but the default is the action stands. This is "agents propose, humans dispose"
in low-risk mode.

### Escalate channel — "Something unexpected"

**Trigger:** An error or unexpected condition that the expert can't resolve
through normal error routes. Also fires on SLA breaches of existing gate items.

**Delivery:**

```
escalation {
  source: string              — expert, workflow step, or QueueManager
  type: clinical_safety | system_error | sla_breach | unroutable_gate | scope_exceeded
  severity: urgent | elevated | watch
  description: string         — what happened, specifically
  recommended_action: string  — what the expert thinks should happen
  affected_patients: []       — if applicable
  routing: string             — who receives this, from escalation-thresholds.md
}
```

**Routing:** AlertRouter (from `agent-framework.md`) handles escalations. Routes
by type, severity, and human registry lookup. Escalations always route to a
specific person — never to a role without a person behind it. If the target
person is unavailable, AlertRouter walks the escalation chain.

---

## 3. Human→Expert channels

How humans provide structured input that the expert system can consume. Three
channel types based on when and why the human is providing input.

### Override — "I changed your output"

**When:** A human modifies an expert's output at a gate (approve_with_changes
or reject). This is the highest-signal calibration data for expert learning.

**Capture structure:**

```
override {
  gate_item_id: string
  expert: string
  human: string (from human registry)
  
  disposition: approved_with_changes | rejected
  
  changes: [{
    field: string             — which output contract field was changed
    original_value: any       — what the expert produced
    new_value: any            — what the human changed it to
    reason_category: enum     — clinical_judgment | guideline_deviation | patient_specific |
                                institutional_standard | data_error | preference
    reason_detail: string     — free text: why this change was necessary
  }]
  
  pattern_signal: {
    recurring: boolean        — has the human made this same type of change before?
    expert_could_learn: boolean — does the human think the expert should handle this differently next time?
    note_to_expert: string    — optional: what the human would tell the expert if coaching it
  }
}
```

**Routing:** Override records flow to the expert's retro log as interaction
summaries (per `expert-spec.md` retro log format). The `reason_category` and
`pattern_signal` fields are the bridge between "human changed a number" and
"expert learns why."

**Why `reason_category` matters:** An override because of `institutional_standard`
(Cena does it differently than guidelines) has different implications than
`patient_specific` (this patient is unusual). The first signals a domain
knowledge gap; the second signals the judgment framework handled an edge case
correctly but with insufficient data. The expert's self-assessment reads these
categories to diagnose *what kind* of learning is needed.

### Feedback — "I noticed a pattern"

**When:** A human observes something about expert behavior outside a gate
interaction — a recurring issue, a positive pattern worth preserving, or a
domain knowledge update.

**Capture structure:**

```
feedback {
  from: string (human registry entry)
  to_expert: string
  type: pattern_observation | domain_update | positive_reinforcement | concern
  
  observation: string         — what the human noticed, specifically
  evidence: string            — which interactions, dates, or outputs support this
  suggested_action: string    — what the human thinks should change (optional)
  affected_layers: []         — which expert layers this might inform
}
```

**Routing:** Feedback records append to the expert's retro log with a `[human-feedback]`
tag. They are reviewed during the expert's self-assessment cycle and weighed
alongside interaction summaries and 360 reviews.

**Important:** Feedback is a structured input, not a command. The expert
considers it during self-assessment and proposes spec changes if the feedback
warrants them. Per shared principle #11, the expert proposes changes but a human
approves them — feedback doesn't bypass governance.

### Validation — "I can confirm or correct this assumption"

**When:** A human with the appropriate authority reviews an assumption from an
expert's assumptions index (per RFC-0001). This is the primary mechanism for
assumption lifecycle management.

**Capture structure:**

```
validation {
  from: string (human registry entry)
  expert: string
  assumption_id: string       — e.g., "A1" from domain-knowledge.md assumptions index
  
  disposition: validated | revised | retired
  
  revision: {                 — only if disposition is "revised"
    original_value: string
    new_value: string
    rationale: string         — why the institutional standard differs from the assumption
    scope: string             — does this apply globally or to specific cohorts/studies?
  }
  
  effective_date: date        — when the validation takes effect
  review_cadence: string      — when should this be re-validated? (optional)
}
```

**Routing:** Validation records trigger updates to the expert's domain-knowledge.md:
- `validated` → assumption marker removed, knowledge becomes standard
- `revised` → assumption value updated, marker remains until the revision is
  confirmed stable (one review cycle)
- `retired` → assumption removed from index and knowledge table

All changes follow governance: the validation is a structured proposal, applied
after human approval per the expert's normal spec update process.

---

## 4. Feedback capture at gates

Every human gate interaction is a learning opportunity. The protocol defines what
must be captured and what is optional, balancing signal quality against reviewer
friction.

### Required capture (every gate decision)

| Decision | Automatically captured | Minimum human input |
|---|---|---|
| **Approve** | Gate item ID, timestamp, human ID, "approved as-is" | None — approval is one tap. The absence of changes is a positive signal. |
| **Approve with changes** | Gate item ID, timestamp, human ID, changed fields (diffed automatically) | `reason_category` per changed field (select from enum). `reason_detail` strongly encouraged but not blocking. |
| **Reject** | Gate item ID, timestamp, human ID | `reason` (free text, required). `redirect` (where to send, required). |

### Optional capture (reduces friction, increases signal)

| Field | When to surface | Why it matters |
|---|---|---|
| `pattern_signal.recurring` | After approve_with_changes | If the human has made this change before, the expert should learn faster. Surfacing this question costs one checkbox. |
| `pattern_signal.expert_could_learn` | After approve_with_changes | Distinguishes "this patient is unusual" from "the expert should handle all cases differently." |
| `pattern_signal.note_to_expert` | After any non-trivial change | Free text coaching. Highest signal per character, but also highest friction. Never require it. |

### Capture principles

- **One-tap approval is sacred.** The most common gate decision (approve) must
  be frictionless. Adding required fields to approval kills throughput.
  Vision principle #5 (human attention is the scarce resource) governs here.
- **Changes require explanation.** When a human changes expert output, the *why*
  is more valuable than the *what*. The diff is automatic; the reason is the
  learning signal. `reason_category` is the minimum viable signal — a single
  enum selection per changed field.
- **Rejection always requires a reason.** Rejection sends the work somewhere
  else. Without a reason, the recipient has no context. This is not optional.
- **Optional fields use progressive disclosure.** Surface them after the
  decision, not before. The human has already committed to the action; asking
  "want to add more detail?" costs less attention than requiring it upfront.
- **Capture is a cost.** Every field added to the gate interaction takes
  seconds from a coordinator or clinician who processes dozens of gates per
  day. The value of the signal must justify the time. Default to less capture
  and add fields only when retro data shows the system needs more signal
  to learn.

### Signal flow: gate → retro log → spec update

```
Human decision at gate
    │
    ├── Approve → logged as agreement (positive signal)
    │             → retro log: "approved as-is, N of M fields matched"
    │
    ├── Approve with changes → override record created
    │   │                      → retro log: interaction summary with [override] tag
    │   │
    │   └── If pattern_signal.recurring = true
    │       → retro log flags for self-assessment: "recurring override on [field]"
    │       → self-assessment checks: is this a domain knowledge gap, a judgment
    │         framework gap, or an edge case the expert shouldn't try to learn?
    │
    └── Reject → rejection record created
                → retro log: interaction summary with [rejection] tag
                → if 3+ rejections on the same output type → freshness trigger fires
```

---

## 5. Human onboarding

When a new person enters the system — new hire, role change, or a planned
position being filled — the system brings them up to speed on their expert
relationships.

### Onboarding checklist

Generated from the human registry entry's expert relationships:

| Step | Content | Source |
|---|---|---|
| 1. Role briefing | Which roles you hold, what permissions they grant, which app surfaces you'll use | `roles/*.md` matching your role list |
| 2. Expert relationships | Which experts you'll interact with, how (reviewer, gate approver, domain authority) | Human registry entry |
| 3. Gate orientation | What gate items look like, what decisions you can make, where to find your queue | `architecture/ui-patterns.md` queue patterns |
| 4. Current expert state | Health status, recent retro log highlights, known issues for each expert you relate to | `experts/<name>/README.md` and `retro-log.md` |
| 5. Assumption validation | If you're the validating authority for any assumptions, here's the index to review | `experts/<name>/domain-knowledge.md` assumptions index |
| 6. Active workflows | Which workflows you participate in, which steps are gates you staff | `workflows/<name>/checkpoints.md` |

### First-day signal

The onboarding process is itself a feedback opportunity. After the new person's
first week of gate interactions, capture a structured debrief:

- Were gate items understandable without prior context?
- Were recommendations well-calibrated or consistently off?
- Were any assumptions obviously wrong from the new person's expertise?

This debrief feeds into the retro logs of all experts the person interacts with,
tagged `[onboarding]`. It's a one-time calibration burst — a new expert
reviewer sees patterns that long-tenure reviewers have adapted to and stopped
noticing.

---

## 6. Capacity and routing

### Routing logic

When an expert produces a gate item or escalation:

1. **Match expert relationship** — look up which human(s) are registered for
   this expert + relationship type in the human registry
2. **Match role** — if no specific person is registered, fall back to role-based
   routing from the workflow checkpoint's `audience` field
3. **Check capacity** — if the matched person's queue is above capacity threshold,
   route to backup (next person with the same role + expert relationship)
4. **No match → escalate** — if no human can be routed to, the QueueManager
   raises a system escalation. Unroutable gates are always urgent.

### Capacity signals

The human registry's capacity field is intentionally lightweight — not a
scheduling system, just enough for the QueueManager to make routing decisions:

| Signal | Meaning | Source |
|---|---|---|
| `available` | Processing gates normally | Default state |
| `limited` | Reduced capacity — route new items to backup if possible | Self-reported or inferred from response times |
| `unavailable` | Out of office, on leave — do not route | Self-reported or calendar integration |
| `overloaded` | Queue depth exceeds threshold — distribute to peers | QueueManager-detected from queue metrics |

### Escalation chains

Every gate type has an escalation chain: primary reviewer → backup reviewer →
supervisor → system-level escalation. Chains are defined in the human registry
by role, not hardcoded per workflow. This means adding a new workflow step
doesn't require defining a new escalation chain — it inherits from the role.

---

## Interaction with existing specs

| Spec | Connection |
|---|---|
| `expert-spec.md` Layer 8 | Escalation thresholds define *when* to involve humans (autonomous/notify/gate). This protocol defines *how* — channel type, delivery format, feedback capture. |
| `workflow-spec.md` checkpoints | Checkpoint definition declares audience, SLA, and decision options. This protocol defines the delivery, routing, and feedback capture that make checkpoints work. |
| `architecture/agent-framework.md` | QueueManager and AlertRouter are the delivery mechanisms. This protocol defines the payload format and routing logic they implement. |
| `architecture/ui-patterns.md` | Queue UI, approval cards, and thread rendering are the surfaces. This protocol defines the data that surfaces display. |
| `fallback-modes.md` | Degradation signals propagate through the gate channel — the human reviewer sees which upstream steps ran degraded and adjusts their review accordingly. |
| `shadowing-protocol.md` | Shadow comparison data (human corrections during shadow period) uses the override capture structure from this protocol. The shadow log's `human_correction` field maps to the override record. |
| `shared-principles.md` | #1 (safety before speed): gate items never auto-approve on SLA breach. #5 (human attention is the scarce resource): one-tap approval, progressive disclosure for optional fields. #8 (degradation is visible): degradation manifest in gate context. #11 (propose, never self-apply): expert recommendations are always proposals, human actions are always authoritative. |
| RFC-0001 (assumption tracking) | Validation channel is the mechanism for assumption lifecycle. Planned-role placeholder entries in human registry connect to assumption `validates_by` fields. |

---

## Implementation sequence

This protocol can be adopted incrementally:

1. **Human registry** — create `humans/README.md` and entries for current team
   (Aaron, Vanessa, Andrey). Map expert relationships and gate responsibilities.
   This is useful immediately even without implementation.

2. **Gate channel + required capture** — when workflow implementation begins
   (Phase 3 on roadmap), gate items use this format. Approve, approve with
   changes (+ reason_category), and reject (+ reason) are the minimum viable
   feedback capture.

3. **Override → retro log pipeline** — connect override records to expert retro
   logs. This closes the learning loop and makes shadowing comparison data
   structured.

4. **Feedback channel** — add after experts have enough retro data that humans
   can observe patterns worth reporting. Premature deployment produces noise.

5. **Validation channel** — activate when validating authorities exist (Clinical
   Ops Director hired, study protocols published).

6. **Onboarding protocol** — activate when the team grows beyond the founders.
