# Steps — Care Plan Creation

> Each step references the business logic in `workflows/01-patient-operations.md`
> section 1.5 and layers on expert assignments, coordination patterns, and routing.

---

## Step 1 — Draft care plan

| Field | Value |
|---|---|
| **step_id** | 1.0 |
| **expert** | Clinical Care |
| **coordination** | Sequential (orchestrator → specialist) |
| **input** | Structured patient assessment (from 1.4), clinical guidelines, care plan template |
| **output** | Draft care plan object (per Clinical Care output-contract: goals, nutrition plan, BH plan, visit schedule, monitoring schedule, medications, risk flags) |
| **model_tier** | Deep (Opus) — first-time synthesis across clinical, nutritional, and behavioral data for a unique patient |
| **autonomy** | Autonomous — drafting is internal; no external effect until reviewed |
| **sla** | 5 minutes |
| **error_route** | If assessment data has critical gaps → halt, escalate to coordinator with specific missing fields |
| **fallback** | `human-covers`: RDN drafts care plan directly using structured checklist prompt (`.checklists/1.0-care-plan-draft.md`). No AI-synthesized nutrition plan — human does it manually. Confidence capped at `low`. |

**Notes:** The agent drafts all sections from structured data. The nutrition plan
section applies MNT guidelines to the patient's diagnosis codes, lab values, and
dietary restrictions. The behavioral health section is auto-populated if PHQ-9 < 10
(BHN notified for awareness) or flagged for BHN authorship if PHQ-9 >= 10.

---

## Step 2 — Parallel review (fan-out)

Three independent reviews run simultaneously. Each reviewer evaluates the draft
through their own quality criteria.

### Step 2a — Clinical review

| Field | Value |
|---|---|
| **step_id** | 2.a |
| **expert** | Clinical Care |
| **coordination** | Fan-out (parallel with 2b, 2c) |
| **input** | Draft care plan from step 1 |
| **output** | Clinical review: flagged issues (dosage conflicts, guideline deviations, missing labs), confidence signal |
| **model_tier** | Standard (Sonnet) — applying known clinical guidelines to a structured draft |
| **autonomy** | Autonomous — review findings go to reconciliation, not directly to humans |
| **sla** | 2 minutes |
| **error_route** | If critical safety issue detected → halt workflow, immediate RDN alert |
| **fallback** | `checklist`: Static clinical checklist (`.checklists/2.a-clinical-review.md`) — dosage range validation, guideline deviation flags, required lab presence. Catches known issues, misses subtle clinical judgment. Confidence capped at `medium`. |

### Step 2b — UX review

| Field | Value |
|---|---|
| **step_id** | 2.b |
| **expert** | UX Design Lead |
| **coordination** | Fan-out (parallel with 2a, 2c) |
| **input** | Draft care plan from step 1 |
| **output** | Design review (per UX output-contract): verdict, issues list, consistency check against care plan approval card patterns |
| **model_tier** | Standard (Sonnet) — applying established approval card patterns to care plan content |
| **autonomy** | Autonomous |
| **sla** | 2 minutes |
| **error_route** | Non-blocking — UX issues are flagged but don't halt the clinical workflow |

**Scope:** UX reviews the *presentation* of the care plan for human review: Is the
approval card showing sufficient context for the RDN to make an informed decision?
Are the goal statements readable? Does the information hierarchy work? UX does not
review clinical content.

### Step 2c — Compliance review

| Field | Value |
|---|---|
| **step_id** | 2.c |
| **expert** | Compliance |
| **coordination** | Fan-out (parallel with 2a, 2b) |
| **input** | Draft care plan from step 1 + patient consent record |
| **output** | Compliance check: PHI display validation, consent scope coverage, audit trail completeness |
| **model_tier** | Standard (Sonnet) — applying known HIPAA rules to structured content |
| **autonomy** | Autonomous — compliance findings go to reconciliation |
| **sla** | 2 minutes |
| **error_route** | If PHI violation detected → halt workflow, gate on compliance resolution |
| **fallback** | `checklist`: PHI field inventory checklist + consent scope matrix (`.checklists/2.c-compliance-review.md`). Binary pass/fail per field. No nuanced HIPAA interpretation. Confidence capped at `medium`. |

---

## Step 3 — Reconcile reviews

| Field | Value |
|---|---|
| **step_id** | 3.0 |
| **expert** | Patient Ops (orchestration role) |
| **coordination** | Sequential — waits for all fan-out reviews to complete |
| **input** | Three handoff envelopes from steps 2a, 2b, 2c |
| **output** | Reconciled care plan draft with all review findings integrated, conflict report if any |
| **model_tier** | Standard (Sonnet) — merging structured review outputs, flagging conflicts |
| **autonomy** | Autonomous if no conflicts; Notify if minor conflicts resolved by authority rules; Gate if ambiguous conflicts |
| **sla** | 3 minutes (automated reconciliation) |
| **error_route** | Unresolvable conflicts → step 3a |
| **fallback** | `peer-covers`: Orchestrator handles merge mechanically — applies conflict rules from workflow-spec.md without domain judgment on ops priorities. Confidence capped at `low`. |

**Conflict resolution per workflow-spec.md:**
- Clinical issues override UX preferences (constraint trumps preference)
- Compliance issues override all other concerns (regulatory is a hard constraint)
- UX vs. Patient Ops presentation disagreements → UX has step authority for presentation
- Ambiguous conflicts → escalate to human at step 4 with both positions documented

### Step 3a — Resolve conflicts (conditional)

Only executes if step 3 identifies conflicts that can't be auto-resolved.

| Field | Value |
|---|---|
| **step_id** | 3.a |
| **expert** | Depends on conflict type — the expert with declared authority acts first |
| **coordination** | Human gate if authority is ambiguous |
| **input** | Conflict report from step 3 |
| **output** | Resolution with rationale, logged for workflow retro |
| **model_tier** | Deep (Opus) — novel judgment call requiring cross-domain synthesis |
| **autonomy** | Gate — conflicts are surfaced to the relevant human with both expert positions |
| **sla** | 4 hours |
| **error_route** | If unresolved after SLA → escalate to Aaron |

---

## Step 4 — RDN approval (hardcoded gate)

| Field | Value |
|---|---|
| **step_id** | 4.0 |
| **expert** | None — this is a human-only step |
| **coordination** | Human gate |
| **input** | Reconciled care plan draft, rendered as approval card in Provider app |
| **output** | Approved (with optional edits), rejected (with reason), or modify (specific changes requested) |
| **model_tier** | N/A — human decision |
| **autonomy** | Gate (hardcoded — cannot be overridden) |
| **sla** | 24 hours (standard clinical review) |
| **error_route** | SLA breach → reminder at 12h, escalate to supervisor at 24h |

**What the RDN sees:** Approval card with nutrition plan summary, goals, relevant
lab values, dietary restrictions, and any clinical review flags from step 2a. The
card renders per UX Design Lead's approval card spec.

---

## Step 5 — BHN approval (conditional hardcoded gate)

Only executes if PHQ-9 >= 10 at intake assessment.

| Field | Value |
|---|---|
| **step_id** | 5.0 |
| **expert** | None — human-only step |
| **coordination** | Human gate |
| **input** | Behavioral health section of care plan + PHQ-9 score + trend data |
| **output** | BHN approves behavioral health plan section |
| **model_tier** | N/A |
| **autonomy** | Gate (hardcoded) |
| **sla** | 24 hours |
| **error_route** | SLA breach → escalate to BHN supervisor |

---

## Step 6 — Coordinator final approval (hardcoded gate)

| Field | Value |
|---|---|
| **step_id** | 6.0 |
| **expert** | None — human-only step |
| **coordination** | Human gate |
| **input** | Fully approved care plan (RDN signed, BHN signed if applicable) |
| **output** | Coordinator approves integrated plan — confirms logistics (delivery address, schedule, contact prefs) |
| **model_tier** | N/A |
| **autonomy** | Gate (hardcoded) |
| **sla** | 24 hours |
| **error_route** | SLA breach → reminder at 12h |

---

## Step 7 — Lock and activate

| Field | Value |
|---|---|
| **step_id** | 7.0 |
| **expert** | Patient Ops |
| **coordination** | Sequential — triggered by coordinator approval |
| **input** | Approved care plan with all signatures |
| **output** | Care plan v1.0 locked, patient status → `active`, downstream triggers fired |
| **model_tier** | Light (Haiku) — mechanical state transition, no judgment |
| **autonomy** | Autonomous — all human gates have already passed |
| **sla** | 1 minute |
| **error_route** | If state transition fails → halt, alert coordinator |
| **fallback** | `checklist`: State transition checklist — verify all gates passed, lock plan, fire triggers. Mechanical step that barely needs expert judgment. Confidence capped at `medium`. |

**Downstream triggers:**
- Meal prescription generation (workflow 1.6 → Domain 3)
- Visit scheduling (workflow 1.8)
- Monitoring setup — AVA check-in cadence (workflow 1.7)
- Patient notification — welcome message with delivery info and first appointment
