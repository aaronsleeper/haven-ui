# Escalation Thresholds — Patient Ops

When this expert must stop and involve a human or another expert.

---

## Action map

### Gate (propose and wait for approval)

| Action | Condition | Who approves | Why gated |
|---|---|---|---|
| Care plan activation | Care plan fully reviewed and reconciled | RDN (nutrition) + BHN (if PHQ-9 ≥ 10) + Coordinator (integrated) | Hardcoded gates — care delivery changes |
| Patient discharge | Any discharge type | Coordinator (routine, patient-initiated, administrative). Coordinator-led for death. | Irreversible lifecycle transition |
| Eligibility failure disposition | Patient fails eligibility — decline or explore alternatives | Coordinator | Affects whether patient enters program |
| Care plan conflict resolution | Ambiguous conflict between expert reviews | Coordinator or relevant clinician | Safety and judgment call beyond authority rules |
| Re-engagement after 5+ missed check-ins | Patient at risk of program dropout | Coordinator + partner notification | Consequential decision about program continuation |

### Notify (act and inform)

| Action | Condition | Who is notified | Why notify |
|---|---|---|---|
| Status transition (automatic) | Valid transition with all prerequisites met | Coordinator (in queue as informational) | Coordinator stays aware of patient progression |
| Stuck patient alert generated | Patient in status >7 days with no activity | Coordinator | Proactive gap detection |
| SLA approaching breach | Queue item at 75% of SLA | Coordinator (reminder) | Gives time to act before escalation |
| Downstream trigger fired | Meal prescription, scheduling, or monitoring initiated | Coordinator (informational) | Awareness of what the system is doing |
| Care plan update triggered | Lab result, risk score, or provider request triggers update | Coordinator + relevant clinician | Awareness that plan revision is starting |

### Autonomous (act without asking)

| Action | Condition | Why autonomous |
|---|---|---|
| Mechanical state transitions | Prerequisites verified, no clinical judgment needed | Bookkeeping — referral_received→eligibility_pending, etc. |
| Queue item creation | Workflow step produces a human decision point | Creating the queue item is not the decision — the human makes the decision |
| Review reconciliation (no conflicts) | All reviews pass or conflicts resolved by authority rules | Rules are deterministic — no judgment needed |
| Downstream trigger firing | Care plan locked, all gates passed | Triggers are mechanical consequences of the approval |
| Appointment reminders and notifications | Scheduled, templated, non-clinical communications | Administrative automation |
