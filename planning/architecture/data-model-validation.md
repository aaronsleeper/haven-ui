# Data Model Validation

> Cross-references `architecture/data-model.md` (26 entities) against all 7 expert
> output contracts and the 2 step-level workflow specs (care-plan-creation, meal-prescription).
> Identifies schema gaps, cardinality issues, missing entities, and orphaned entities.
>
> **Created:** 2026-04-10
> **Phase:** 2.2
> **Key inputs:** `architecture/data-model.md`, `experts/*/output-contract.md` (all 7),
> `workflows/care-plan-creation/steps.md`, `workflows/meal-prescription/steps.md`

---

## Methodology

Three validation passes:

1. **Entity coverage** — Does every expert output map to a data model entity?
   Does every entity have at least one expert that produces or consumes it?
2. **Field alignment** — Do expert output fields match data model entity fields?
   Are there fields experts produce that the schema doesn't store?
3. **Workflow I/O** — Do workflow step inputs and outputs reference entities that
   exist, with fields that exist?

---

## 1. Missing entities

Expert outputs and workflow steps that reference structured data with no
corresponding entity in the data model.

### ME-01: QueueItem

| Field | Value |
|---|---|
| **Produced by** | Patient Ops (output #3: "Queue item") |
| **Consumed by** | QueueManager (aggregation), Admin/Provider app (UI) |
| **Why it matters** | Queue items are the primary human-facing work surface. SLA tracking, time-in-queue metrics, escalation clocks, and audit all require persistence. Currently the closest structure is Thread/Message with `requires_approval`, but queue items have richer semantics (priority class, headline, action options, agent recommendation). |
| **Severity** | High — this is the coordinator's primary work interface |

**Proposed entity:**

```
QueueItem {
  id: uuid
  thread_id: uuid
  tenant_id: uuid

  item_type: care_plan_review | status_transition | clinical_alert |
             delivery_issue | compliance_flag | general
  priority_class: p1_immediate | p2_today | p3_standard | p4_batch
  headline: string              // one-line summary
  context: object               // structured data for the approval card
  agent_recommendation: string  // what the agent suggests
  action_options: string[]      // e.g., ["approve", "reject", "modify"]

  assigned_to_role: string
  assigned_to_user: uuid | null
  sla_deadline: timestamp

  status: pending | in_review | completed | escalated | expired
  completed_by: uuid | null
  completed_at: timestamp | null
  outcome: string | null        // what the human decided

  created_at: timestamp
}
```

### ME-02: CheckIn (AVA call record)

| Field | Value |
|---|---|
| **Produced by** | AVA specialist agent (via Thread), Clinical Care (monitoring schedule) |
| **Consumed by** | RiskScoringAgent, Clinical Care (trend analysis), ReportingAgent |
| **Why it matters** | AVA calls produce structured data (PHQ-9 scores, wellness ratings, meal satisfaction, symptom reports). Currently, PHQ-9 flows into Biomarker, meal feedback flows into Feedback, but the call itself (duration, completion status, script used, structured responses) has no queryable home. Thread captures it but not in a form that supports trend queries like "how many calls did this patient complete in Q1?" |
| **Severity** | Medium — data is captured in threads, but querying and reporting are impaired |

**Proposed entity:**

```
CheckIn {
  id: uuid
  patient_id: uuid
  tenant_id: uuid

  type: scheduled_wellness | scheduled_phq9 | ad_hoc | post_delivery
  modality: ava_voice | app_self_report | coordinator_phone
  script_id: string | null       // which AVA script was used

  scheduled_at: timestamp
  occurred_at: timestamp | null
  duration_seconds: number | null
  completion: full | partial | not_reached | declined | crisis_handoff

  responses: [{ question_id: string, question_text: string,
                response: string, structured_value: any }]

  // Derived scores (also written to Biomarker for trend tracking)
  phq9_score: number | null
  gad7_score: number | null
  mood_rating: number | null

  hard_stop_triggered: boolean   // crisis protocol, emergency, human request
  hard_stop_type: string | null

  thread_id: uuid
  created_at: timestamp
}
```

### ME-03: Notification

| Field | Value |
|---|---|
| **Produced by** | CommunicationAgent |
| **Consumed by** | Admin app (delivery tracking), Patient app (notification history) |
| **Why it matters** | The system sends notifications at multiple workflow points (welcome messages, SLA reminders, delivery updates, appointment confirmations). Without a Notification entity, there's no record of what was sent, when, whether it was delivered/read, or which channel was used. This matters for engagement scoring and compliance ("did we notify the patient?"). |
| **Severity** | Low-medium — can defer to implementation if CommunicationAgent logs to Thread |

**Proposed entity:**

```
Notification {
  id: uuid
  patient_id: uuid | null       // null for staff-only notifications
  tenant_id: uuid

  channel: sms | email | push | in_app
  template_id: string
  recipient_type: patient | staff | partner
  recipient_id: uuid

  content_preview: string        // first 100 chars, no PHI
  phi_present: boolean

  status: queued | sent | delivered | failed | read
  sent_at: timestamp | null
  delivered_at: timestamp | null
  read_at: timestamp | null
  failure_reason: string | null

  triggered_by_thread_id: uuid | null
  created_at: timestamp
}
```

### ME-04: DischargeSummary

| Field | Value |
|---|---|
| **Produced by** | Patient Ops (output #5: "Discharge package") |
| **Consumed by** | Partner reporting, clinical handoff, compliance (data retention) |
| **Why it matters** | Patient Ops output contract describes a rich discharge package (transition summary, clinical outcomes, meal delivery history, closure actions). Patient entity only has `discharged_at` and `discharge_reason`. The full package needs to be persisted — partners and compliance may reference it months after discharge. |
| **Severity** | Medium — needed before discharge workflow is built |

**Proposed entity:**

```
DischargeSummary {
  id: uuid
  patient_id: uuid
  tenant_id: uuid
  care_plan_id: uuid             // final care plan version

  discharge_type: planned | partner_requested | patient_requested |
                  eligibility_lost | non_engagement
  discharge_date: date

  clinical_outcomes: {
    goals_met: [{ goal: string, status: met | partial | not_met }]
    biomarker_trends: [{ type: string, initial: number, final: number, direction: string }]
    risk_tier_trajectory: string
  }
  meal_summary: {
    total_meals_delivered: number
    satisfaction_avg: number | null
    missed_deliveries: number
  }
  transition_plan: string        // narrative: what comes next for the patient
  closure_actions: string[]      // e.g., "FHIR summary sent to PCP", "consent deactivated"

  partner_report_sent: boolean
  partner_report_sent_at: timestamp | null

  thread_id: uuid
  created_at: timestamp
}
```

---

## 2. Cardinality issues

### CI-01: CarePlan → MealPrescription should be one-to-many

The ER diagram shows `CARE_PLAN ||--|| MEAL_PRESCRIPTION` (one-to-one). But
MealPrescription has a `care_plan_version` field, and prescriptions are documented
as immutable once locked. When a care plan update (workflow 1.9) changes nutrition
parameters, a new prescription version is created. This means one CarePlan entity
(across its versions) maps to many MealPrescription records.

**Fix:** Change the ER diagram to `CARE_PLAN ||--o{ MEAL_PRESCRIPTION : generates`.
Each prescription is linked to a specific care plan version.

### CI-02: Order → Recipe should be many-to-many

The ER diagram shows `ORDER }o--|| RECIPE : contains`. But Order.meals is an array
of `{ recipe_id, variation_id, quantity }` — a single order contains multiple recipes.
And a single recipe appears in many orders.

**Fix:** Change to `ORDER }o--o{ RECIPE : contains` (many-to-many via the meals
array, which functions as a junction).

---

## 3. Field gaps

Expert outputs that include fields not present in the corresponding data model entity.
These are either missing fields that should be added, or intermediate workflow data
that correctly lives in the Thread rather than the entity.

### Fields that should be added to entities

| Expert output | Field | Target entity | Rationale |
|---|---|---|---|
| Clinical Care → Care plan draft | `restriction_conflicts` | CarePlan | Documents conflicts between competing dietary restrictions (e.g., renal vs. diabetes). Important for RDN review and future care plan updates. Array of `{ restriction_a, restriction_b, resolution, rationale }`. |
| Clinical Care → Care plan draft | `data_gaps` | CarePlan | Explicit list of assessment data the expert expected but didn't have. Drives follow-up actions and confidence signals. Array of `{ field, expected_source, impact_on_plan }`. |
| Meal Operations → Delivery status | `billing_eligibility` | Order | Whether this delivery qualifies for billing (relevant for PMPM and FFS models). Boolean + reason. |
| Meal Operations → Feedback routing | `routed_to` | Feedback | Which consumer received the feedback (kitchen, clinical, coordinator). Currently Feedback has no field for routing destination. |

### Fields that belong in Thread, not entities

These are intermediate workflow artifacts — expert metadata that informs human
review but doesn't persist as part of the final record.

| Expert output | Field | Why Thread is correct |
|---|---|---|
| Clinical Care → Care plan draft | `confidence_level` | Expert's confidence in its own output. Relevant for human review; not part of the locked care plan. Lives in the approval_request message. |
| Clinical Care → Clinical review | `flagged_issues` (with severity) | Review findings are workflow artifacts. They inform the reconciliation step, then the approved plan reflects the outcome. The issues themselves live in the review thread. |
| Patient Ops → Reconciled review | `conflict_report`, `degradation_manifest` | Reconciliation metadata. Important for audit (thread captures it) but not part of the final care plan entity. |
| Compliance → Compliance review verdict | `pass/fail` + `issues` | Review finding, not persisted data. Lives in thread. |

---

## 4. Entity ownership map

Which expert produces, consumes, or governs each entity. Entities with no expert
owner are orphaned — they'll need coverage before implementation.

| Entity | Producer (writes) | Consumer (reads) | Governor (rules) | Status |
|---|---|---|---|---|
| Tenant | Platform/Infra | All | Platform/Infra | Covered |
| AuditEvent | Platform/Infra (auto) | Compliance, Admin | Compliance (trigger spec) | Covered |
| Thread | All agents | All agents | Platform/Infra | Covered |
| Message | All agents | All agents | Compliance (visibility) | Covered |
| Patient | Patient Ops (lifecycle) | All | Compliance (PHI access) | Covered |
| Staff | *None* | Clinical Care, Patient Ops | *None* | **Orphaned** — HR/people ops gap |
| CredentialRecord | *None* | Ops/Compliance (freshness) | *None* | **Orphaned** — credentialing gap |
| ConsentRecord | Patient Ops (collection) | Compliance (scope) | Compliance | Covered |
| CarePlan | Clinical Care | Patient Ops, Meal Ops, UX | Compliance | Covered |
| ClinicalVisit | Clinical Care | Ops/Compliance (billing) | Compliance | Covered |
| ClinicalNote | Clinical Care (draft) | Ops/Compliance (coding) | Compliance | Covered |
| Biomarker | Clinical Care (import) | RiskScoringAgent | Compliance (PHI) | Covered |
| Medication | Clinical Care | Clinical Care (interactions) | Compliance (PHI) | Covered |
| Recipe | Meal Operations | Meal Operations (matching) | Clinical Care (nutrition) | Covered |
| Kitchen | Meal Operations | Meal Operations | Ops/Compliance (BAA) | Covered |
| Order | Meal Operations | Meal Operations (delivery) | Compliance (PHI boundary) | Covered |
| MealPrescription | Clinical Care (extract) | Meal Operations (match) | Compliance | Covered |
| Feedback | Meal Operations (collect) | Meal Operations (routing) | *None* | Partially covered |
| RiskScore | RiskScoringAgent | Clinical Care, Patient Ops | *None* | Partially covered |
| Alert | Multiple producers | AlertRouter | *None* | Partially covered |
| QualityMeasure | *None* | *None* | *None* | **Orphaned** — analytics/reporting gap |
| CareGap | *None* | *None* | *None* | **Orphaned** — analytics/reporting gap |
| Partner | Ops/Compliance | Patient Ops (referrals) | Ops/Compliance | Covered |
| Contract | Ops/Compliance | Financial orchestrator | Ops/Compliance | Covered |
| Referral | Patient Ops (intake) | Patient Ops | Ops/Compliance (rules) | Covered |
| Claim | ClaimsAgent | Ops/Compliance (validation) | Compliance (audit) | Covered |
| ERALine | *None (Athena import)* | *None* | *None* | **Orphaned** — revenue cycle gap |
| Prospect | *None* | *None* | *None* | **Orphaned** — BD, out of expert scope |

### Orphaned entity summary

| Entity | Gap type | Recommendation |
|---|---|---|
| Staff, CredentialRecord | No expert produces or governs | Credentialing is a sub-function of internal ops. For MVP, Patient Ops could absorb basic staff lifecycle; credentialing checks are deterministic (expiry dates). |
| QualityMeasure, CareGap | No expert owns analytics | These are P1 features (reporting, population health). No expert needed at MVP. ReportingAgent consumes them at query time. |
| ERALine | No expert owns payment posting | Revenue cycle gap — already flagged in feature-expert-mapping. Ops/Compliance covers billing compliance but not payment reconciliation. |
| Prospect | BD entity, no expert | Intentionally out of scope. BD is human-driven at this stage. |

---

## 5. Workflow I/O validation

Cross-references step inputs and outputs from the two detailed workflow specs
against data model entities.

### Care plan creation workflow

| Step | Input entities | Output entities | Validation |
|---|---|---|---|
| 1.0 Draft care plan | Patient (assessment data), Biomarker, Medication | CarePlan (draft) | **Pass** — all input fields exist. Output matches CarePlan schema except `restriction_conflicts` and `data_gaps` (see field gaps). |
| 2a Clinical review | CarePlan (draft) | Thread (review findings) | **Pass** — review output is workflow artifact, correctly lives in Thread. |
| 2b UX review | CarePlan (draft) | Thread (design review) | **Pass** |
| 2c Compliance review | CarePlan (draft), ConsentRecord | Thread (compliance check) | **Pass** |
| 3.0 Reconcile | Thread (3 review outputs) | CarePlan (reconciled draft) | **Pass** — intermediate, lives in Thread. |
| 4.0 RDN approval | CarePlan (draft), QueueItem* | CarePlan (approved) | **Gap** — QueueItem entity doesn't exist (ME-01). Approval card rendering needs QueueItem. |
| 5.0 BHN approval | CarePlan (BH section) | CarePlan (BH approved) | **Pass** — conditional on PHQ-9 >= 10. |
| 6.0 Coordinator approval | CarePlan (fully approved) | CarePlan (locked) | **Pass** |
| 7.0 Lock and activate | CarePlan (locked) | Patient (status → active), MealPrescription (trigger), ClinicalVisit (schedule trigger) | **Pass** — downstream triggers map to existing entities. |

### Meal prescription workflow

| Step | Input entities | Output entities | Validation |
|---|---|---|---|
| 1.0 Extract prescription | CarePlan (nutrition plan) | MealPrescription | **Pass** — all fields map. |
| 2.0 Validate | MealPrescription | Thread (validation result) | **Pass** |
| 3.0 Match recipes | MealPrescription, Recipe (catalog) | Thread (match result) | **Pass** — match result is intermediate. |
| 4.0 Select meals | Recipe (ranked list) | Order (meal selection) | **Pass** — Order.meals array holds the selection. |
| 4a Limited variety | Recipe (limited), QueueItem* | Order (confirmed) | **Gap** — QueueItem entity doesn't exist (ME-01). |
| 4b No matches | MealPrescription, Recipe (empty set) | CarePlan (revision trigger) | **Pass** — triggers workflow 1.9. |
| 5.0 Compliance check | Order (draft), MealPrescription, ConsentRecord | Thread (compliance result) | **Pass** |
| 6.0 Lock prescription | MealPrescription | MealPrescription (locked), Order (trigger) | **Pass** |

---

## 6. Summary of findings

### Must-fix before implementation

| # | Finding | Type | Action |
|---|---|---|---|
| ME-01 | **QueueItem entity missing** | Missing entity | Add to data model. This is the coordinator's primary work surface — every human gate depends on it. |
| CI-01 | **CarePlan → MealPrescription cardinality** | ER diagram error | Fix to one-to-many in ER diagram. |
| CI-02 | **Order → Recipe cardinality** | ER diagram error | Fix to many-to-many in ER diagram. |

### Should-fix before implementation

| # | Finding | Type | Action |
|---|---|---|---|
| ME-02 | **CheckIn entity missing** | Missing entity | Add to support AVA call querying and reporting. Without it, "how many check-ins did this patient complete?" requires parsing Thread messages. |
| ME-04 | **DischargeSummary missing** | Missing entity | Add to persist rich discharge packages. Needed before discharge workflow is built. |
| FG-01 | **CarePlan missing restriction_conflicts** | Field gap | Add array field. Important for RDN review context. |
| FG-02 | **CarePlan missing data_gaps** | Field gap | Add array field. Drives follow-up actions. |
| FG-03 | **Order missing billing_eligibility** | Field gap | Add boolean + reason. Revenue cycle depends on this. |
| FG-04 | **Feedback missing routed_to** | Field gap | Add routing destination field. |

### Defer to implementation

| # | Finding | Type | Rationale |
|---|---|---|---|
| ME-03 | **Notification entity** | Missing entity | CommunicationAgent can log to Thread. Standalone entity adds value for engagement analytics but isn't blocking. |
| OE-01 | **Staff/CredentialRecord orphaned** | No expert owner | Credentialing is deterministic at MVP. Absorb into Patient Ops or defer. |
| OE-02 | **QualityMeasure/CareGap orphaned** | No expert owner | P1 features. ReportingAgent consumes at query time. |
| OE-03 | **ERALine orphaned** | No expert owner | Revenue cycle gap, already documented. |
| ENG-01 | **Patient.engagement_score vs RiskScore.dimensions.engagement** | Potential redundancy | Clarify: is engagement_score a denormalized copy of the engagement dimension? If so, document the sync mechanism. If they're different metrics, rename one. |

---

## Cross-references

| This spec references | Referenced doc |
|---|---|
| Entity schemas | `architecture/data-model.md` |
| Expert output fields | `experts/*/output-contract.md` (all 7) |
| Workflow step I/O | `workflows/care-plan-creation/steps.md`, `workflows/meal-prescription/steps.md` |
| Feature coverage gaps | `feature-expert-mapping.md` |
| Agent classifications | `architecture/agent-implementation-spec.md` |
| Architectural decisions | `decisions.md` (AD-04, AD-05) |
