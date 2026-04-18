# Output Contract — Clinical Care

What this expert produces, in what format, and for whom. Downstream consumers
should know exactly what they'll receive.

---

## Primary outputs

### 1. Draft care plan

**Produced when:** Step 1.0 of care-plan-creation workflow. Patient status is
`care_plan_pending` and structured assessment is complete.

| Field | Format | Description |
|---|---|---|
| patient_id | string | Patient identifier |
| care_plan_version | semver | Always `1.0` for initial draft |
| goals | list (3-5) | SMART goals — each with target metric, timeline, and measurement method |
| nutrition_plan | object | Caloric range, macro targets (protein, fat, carb, sodium, potassium as applicable), dietary restrictions (hard/soft), clinical rationale for each target |
| bh_plan | object | PHQ-9 baseline score, GAD-7 baseline, BH intervention level (none/awareness/active), session cadence if applicable, escalation thresholds |
| visit_schedule | list | Visit types (RDN, BHN, PCP) with recommended cadence and urgency notes |
| monitoring_schedule | object | AVA check-in frequency, lab draw schedule, PHQ-9 reassessment cadence, weight/vitals self-report cadence |
| meal_delivery | object | Frequency, delivery days, hot/cold preference, address |
| medications | list | Current medication list with reconciliation notes and drug-nutrient interaction flags |
| risk_flags | list | Auto-populated from assessment: clinical risks, behavioral risks, social risks |
| restriction_conflicts | list | Any conflicts between comorbid condition requirements, with both positions documented |
| confidence | enum | `high` / `medium` / `low` — based on assessment data completeness and comorbidity complexity |
| gaps | list | Specific data gaps that affect plan quality (e.g., "eGFR pending — potassium restriction provisional") |

**Consumed by:** Patient Ops (orchestration), UX Design Lead (approval card rendering), Compliance (PHI validation), RDN (approval gate at step 4)

---

### 2. Clinical review

**Produced when:** Step 2a of care-plan-creation workflow. Reviewing a draft
care plan (either agent-drafted at step 1 or human-drafted via fallback).

| Field | Format | Description |
|---|---|---|
| reviewed_plan_version | semver | Which care plan version was reviewed |
| flagged_issues | list | Each issue with: category (dosage_conflict / guideline_deviation / missing_lab / interaction_risk / goal_quality), severity (critical/major/minor), specific finding, recommended resolution |
| guideline_references | list | Which clinical guidelines each flag references |
| confidence | enum | `high` / `medium` / `low` — based on how well the plan aligns with available evidence |
| pass | boolean | `true` if no critical or major issues; `false` otherwise |
| summary | string | 2-3 sentence clinical assessment of overall plan quality |

**Consumed by:** Patient Ops (reconciliation at step 3), UX Design Lead (review display), RDN (context for approval decision at step 4)

---

### 3. Care plan update recommendation

**Produced when:** An update trigger fires (lab result, risk score change,
scheduled review, provider request) per workflow 1.9.

| Field | Format | Description |
|---|---|---|
| trigger | object | What triggered the update: source, timestamp, specific data point |
| affected_sections | list | Which care plan sections need revision |
| proposed_changes | list | Per section: current value, proposed value, clinical rationale |
| version_type | enum | `minor` / `major` / `emergency` — per version semantics |
| downstream_impacts | list | Which downstream workflows are affected (meal prescription, monitoring, scheduling) |
| confidence | enum | `high` / `medium` / `low` |

**Consumed by:** Patient Ops (update orchestration), RDN (approval if nutrition affected), BHN (approval if BH affected), Coordinator (final approval)

---

### 4. Clinical escalation assessment

**Produced when:** Risk score crosses tier boundary, critical lab value received,
or engagement pattern triggers concern.

| Field | Format | Description |
|---|---|---|
| patient_id | string | Patient identifier |
| escalation_type | enum | `clinical_risk` / `behavioral_risk` / `disengagement` / `crisis` |
| trigger_data | object | Specific data point(s) that triggered assessment |
| severity | enum | `urgent` / `elevated` / `watch` |
| recommended_action | string | Specific next step (e.g., "Schedule urgent RDN review — eGFR dropped below 30") |
| routing | string | Who receives this: RDN, BHN, coordinator, or crisis protocol |

**Consumed by:** Patient Ops (alert routing), care team members (action queue)

---

## Output guarantees

- Nutrition targets always include clinical rationale — never bare numbers
- Restriction conflicts documented with both positions — never silently resolved
- Gaps explicitly listed — the expert never infers missing clinical values
- Confidence signal always present for degradation propagation per `fallback-modes.md`
- `[ASSUMPTION]` Field formats use clinical standard conventions: caloric targets as kcal/day range (e.g., "1500-1800 kcal/day"), protein as g/kg/day, electrolytes as mg/day, goals as SMART format. Validates by: Clinical Ops Director or study protocol
