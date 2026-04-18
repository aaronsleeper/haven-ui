# Output Contract — Patient Ops

What this expert produces, in what format, for whom.

---

## Outputs

### 1. Patient status transition

**Description:** Advances a patient from one lifecycle status to the next.
Includes validation that the transition is valid, all prerequisites are met,
and downstream triggers fire.

**Format:**

```
patient_id: <uuid>
previous_status: <status>
new_status: <status>
trigger: <what caused this transition>
prerequisites_met: [<list of gates/checks that passed>]
downstream_triggers_fired: [<list of workflows/events triggered>]
timestamp: <iso8601>
actor: <agent_id or human_id>
```

**Consumers:** PatientJourneyOrchestrator (runtime), all Domain 1 workflows
(react to status changes), QueueManager (updates queue state).

**Update trigger:** New status added to state machine, new transition rule.

---

### 2. Reconciled review output

**Description:** Merged result of parallel expert reviews (care-plan-creation
step 3). Integrates findings from Clinical Care, UX Design Lead, and
Compliance into a single reconciled draft with conflict report.

**Format:**

```
workflow: <workflow_id>
step: 3.0
reviews_received:
  - expert: <name>
    verdict: <pass | pass_with_conditions | fail>
    findings: [<list>]
    confidence: <high | medium | low>
conflicts: [<list of conflicts with both positions>]
resolution:
  - conflict: <description>
    resolved_by: <authority_rule | human_decision>
    resolution: <what was decided>
    rationale: <why>
reconciled_draft: <updated care plan object>
degradation_manifest: [<any fallback modes active>]
```

**Consumers:** Human gates (RDN, BHN, coordinator — via approval card),
workflow retro log.

**Update trigger:** New expert added to care-plan-creation review step.

---

### 3. Queue item

**Description:** A structured item surfaced to a coordinator's review queue.
Every queue item represents one decision a human needs to make.

**Format:**

```
queue_item_id: <uuid>
patient_id: <uuid>
patient_name: <display name>
item_type: <approval | decision | alert | informational>
priority_class: <P0 | P1 | P2 | P3>
headline: <one-line action statement — "Approve care plan for Maria G.">
context: <2-3 sentences of decision-relevant information>
agent_recommendation: <what the agent suggests>
action_options: [approve, edit, reject, reassign, escalate]
sla: <deadline>
time_in_queue: <duration>
thread_id: <link to full context>
created_at: <timestamp>
```

**Consumers:** QueueManager (priority sorting, SLA tracking), Admin app
(coordinator UI), Provider app (clinician queue).

**Update trigger:** New queue item type, new priority rules.

---

### 4. Stuck patient alert

**Description:** Proactive alert when a patient has been in a non-terminal
status with no activity beyond the expected threshold.

**Format:**

```
patient_id: <uuid>
patient_name: <display name>
current_status: <status>
days_in_status: <number>
last_activity: <description + timestamp>
expected_next_action: <what should have happened>
blocker: <identified blocker or "none identified">
recommended_action: <what the coordinator should do>
```

**Consumers:** Coordinator queue (as a P2 queue item), care team.

**Update trigger:** Threshold change for stuck detection.

---

### 5. Discharge package

**Description:** Complete discharge record including transition summary,
downstream closure actions, and partner notification.

**Format:**

```
patient_id: <uuid>
discharge_type: <routine | patient_initiated | administrative | death>
discharge_date: <date>
episode_dates: { start: <date>, end: <date> }
transition_summary:
  care_plan_versions: [<version history>]
  clinical_outcomes: { hba1c_delta, weight_delta, phq9_delta, ... }
  meal_summary: { delivered, completion_rate, satisfaction_score }
  outstanding_referrals: [<list>]
closure_actions:
  meal_orders_closed: <boolean>
  monitoring_closed: <boolean>
  final_claims_triggered: <boolean>
  exit_survey_sent: <boolean>
  partner_notified: <boolean>
  record_archived: <boolean>
```

**Consumers:** Coordinator (approval gate before discharge), partner portal
(outcomes notification), Revenue Cycle (final claims), Data Analytics
(population outcomes).

**Update trigger:** New discharge type, new outcome metric.
