# Domain Knowledge — Patient Ops

What this expert must know to orchestrate the patient lifecycle.

---

## Patient status state machine

| Knowledge area | What specifically | Source | Shelf life |
|---|---|---|---|
| Status values (11) | `referral_received`, `eligibility_pending`, `eligibility_failed`, `enrollment_pending`, `assessment_pending`, `care_plan_pending`, `active`, `care_plan_update_pending`, `high_risk`, `discharged`, `on_hold` | `workflows/01-patient-operations.md` | Internal — stable |
| Valid transitions | referral_received→eligibility_pending, eligibility_pending→enrollment_pending or eligibility_failed, enrollment_pending→assessment_pending, assessment_pending→care_plan_pending, care_plan_pending→active, active↔care_plan_update_pending, active↔high_risk, active→on_hold→active, active→discharged | `workflows/01-patient-operations.md` | Internal — stable |
| Transition triggers | Each transition has a defined trigger: API result, human approval, assessment completion, care plan lock, risk score change, discharge event | `workflows/01-patient-operations.md` 1.1–1.11 | Internal — stable |
| Invalid transitions | No patient goes from referral_received to active. No patient goes from discharged to any other state. eligibility_failed can only transition back to eligibility_pending (re-check) or be archived. | State machine design | Internal — stable |

## Workflow orchestration

| Knowledge area | What specifically | Source | Shelf life |
|---|---|---|---|
| Care plan creation flow | 7 steps: draft → parallel review (clinical, UX, compliance) → reconcile → RDN gate → BHN gate (conditional) → coordinator gate → lock and activate. Patient Ops owns steps 3 (reconcile) and 7 (lock/activate). | `workflows/care-plan-creation/steps.md` | Internal — stable |
| Care plan update flow | Trigger identification → section-specific routing (nutrition→RDN, BH→BHN) → coordinator approval → version lock → downstream cascade (meals, monitoring, scheduling) | `workflows/01-patient-operations.md` 1.9 | Internal — stable |
| Meal prescription flow | Translates care plan nutrition section into prescription object → recipe catalog query → coordinator/RDN review if gaps → send to Domain 3 | `workflows/01-patient-operations.md` 1.6 | Internal — stable |
| Downstream trigger coordination | Care plan activation fires 4 parallel triggers: meal prescription (1.6), scheduling (1.8), monitoring setup (1.7), patient notification. Each is independent — failure of one does not block others. | `workflows/01-patient-operations.md` 1.5 | Internal — stable |
| Conflict resolution rules | Clinical overrides UX (constraint trumps preference). Compliance overrides all (regulatory is hard constraint). UX has authority on presentation. Ambiguous conflicts escalate to human. | `workflows/care-plan-creation/steps.md` step 3, `shared-principles.md` | Internal — stable |

## Queue management

| Knowledge area | What specifically | Source | Shelf life |
|---|---|---|---|
| Queue priority classes | P0: crisis/safety, P1: SLA-breaching, P2: action needed within SLA, P3: informational. Items sorted by composite score within class. | `experts/queue-prioritization.md` | Internal — stable |
| SLA definitions | Critical: immediate. High (clinical alert): 2h. Standard (care plan review): 24h. Low (report review): 72h. | `architecture/agent-framework.md` SLA table | Internal — stable |
| Escalation cascade | SLA breach → reminder at 50% → escalate to supervisor at 100% → escalate to medical director at 150%. | `architecture/agent-framework.md` | Internal — stable |
| Queue item structure | Patient name/ID, what happened, what agent recommends, what human needs to decide, urgency level, time in queue. | `workflows/01-patient-operations.md` cross-cutting | Internal — stable |
| Coordinator interaction model | One click to full context. Approval card is the hero component. Decision logged in thread. Queue item removed on action. | `journeys/coordinator-morning-triage.md` | Internal — stable |

## Error states and gap detection

| Knowledge area | What specifically | Source | Shelf life |
|---|---|---|---|
| Stuck patient detection | Patient in any non-terminal status with no activity for >7 days. Surface to coordinator with last activity and recommended action. | `journeys/coordinator-morning-triage.md` step 7 | Internal — stable |
| Disengagement indicators | 1 missed check-in: log. 2 consecutive: soft outreach. 3 consecutive: disengagement alert. 5 consecutive: partner escalation. | `workflows/01-patient-operations.md` 1.7 | Internal — stable |
| Failed transition recovery | Eligibility API timeout: retry 3x, then manual. Enrollment incomplete after 3 coordinator attempts: partner notified. Care plan gate SLA breach: reminder → escalate. | `workflows/01-patient-operations.md` error states per workflow | Internal — stable |
| `[ASSUMPTION]` No patient in limbo | Every patient in every status has a named next action and a named responsible party (agent or human). If the system cannot determine the next action, it creates a queue item for the coordinator. | State machine design principle. Validates by: operational testing with real patients | Until first patient |

## Discharge and transitions

| Knowledge area | What specifically | Source | Shelf life |
|---|---|---|---|
| Discharge types | Routine (goals met/episode end), patient-initiated, administrative (eligibility lost), death (coordinator-led). Each has different documentation and communication requirements. | `workflows/01-patient-operations.md` 1.11 | Internal — stable |
| Transition summary | Episode dates, discharge reason, care plan version history, clinical outcomes (HbA1c/weight/PHQ-9 deltas), meal summary, outstanding referrals, coordinator contact. | `workflows/01-patient-operations.md` 1.11 | Internal — stable |
| Post-discharge | Close meal orders, close monitoring, trigger final claims, collect exit survey, archive record, notify partner with outcomes. Record retained per HIPAA (6 years). | `workflows/01-patient-operations.md` 1.11 | Internal — stable |

## Reference sources

| Source | Domain | Trust level | When to consult |
|---|---|---|---|
| `workflows/01-patient-operations.md` | All 11 Domain 1 workflows | Authoritative | Any workflow question |
| `workflows/care-plan-creation/steps.md` | Step-level care plan creation detail | Authoritative | Orchestration questions |
| `experts/queue-prioritization.md` | Queue management policy | Authoritative | Priority and SLA questions |
| `architecture/agent-framework.md` | Agent coordination patterns, SLA table | Authoritative | Orchestration architecture |
| `journeys/coordinator-*.md` | Coordinator interaction patterns | Expert | UX and queue design questions |
| `experts/human-expert-protocol.md` | Human-expert boundary rules | Authoritative | Gate, notification, and escalation mechanics |

---

## Assumptions index

| # | Assumption | Basis | Validates by | Status |
|---|---|---|---|---|
| A1 | Every patient always has a named next action and responsible party | State machine design | Operational testing with real patients | Unvalidated |
