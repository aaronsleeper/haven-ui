# Dependencies — Clinical Care

Who this expert relies on, and who relies on this expert. This graph is walked
during `/expert-update` to detect cascading staleness.

---

## Depends on

| Source | What flows in | Impact if source changes | Fallback mode | Fallback detail |
|---|---|---|---|---|
| **Patient assessment data** (workflow 1.4) | Structured patient profile: diagnoses, labs, meds, PHQ-9, GAD-7, dietary restrictions, SDOH | Assessment format change breaks care plan drafting input parsing | `human-covers` | RDN works from raw assessment data directly |
| **Clinical guidelines** (AND, ADA, KDOQI) | MNT targets, condition-specific protocols | Outdated targets produce incorrect nutrition plans | `checklist` | Static target tables by condition (stale but bounded) |
| **Compliance expert** (planned) | PHI display rules, consent scope, audit requirements | Care plan may include data outside consent scope | `checklist` | PHI field inventory checklist per `fallback-modes.md` |
| **FHIR/EHR integration** (engineering) | Lab values, medication lists, condition codes | Missing structured data forces manual entry, reduces confidence | `human-covers` | Coordinator manually enters clinical data from external sources |
| **Product strategy** (human — Aaron) | Care plan priorities, feature direction, clinical model decisions | Determines scope of what the expert covers | N/A | Human decision — no automation fallback |
| **Expert Operations** (planned) | Lifecycle management, onboarding/offboarding | Missing lifecycle governance has no immediate clinical impact | N/A | Manual process |

---

## Depended on by

| Consumer | What flows out | Impact if this expert changes |
|---|---|---|
| **UX Design Lead** | Clinical workflow requirements, documentation formats, field definitions for approval cards | UX builds care plan views and approval cards against this expert's output contract — field changes = redesign |
| **Compliance** (planned) | Care plan content for PHI validation, clinical data classifications | Compliance validates that care plan fields respect consent scope and minimum-necessary |
| **Patient Ops** (planned) | Draft care plans, clinical reviews, update recommendations, escalation assessments | Patient Ops orchestrates the care plan workflow — output contract changes break step inputs |
| **RDN / BHN** (human) | Draft care plans for approval, clinical review findings for decision support | Humans review and approve what this expert produces — format changes affect their review workflow |
| **Meal Operations** (Domain 3) | Nutrition plan parameters feed meal prescription generation (workflow 1.6) | Caloric targets, macro limits, allergen exclusions, dietary restrictions flow directly into meal matching |
| **Monitoring** (workflow 1.7) | Monitoring schedule, escalation thresholds, PHQ-9 reassessment cadence | Check-in frequency and content derived from care plan monitoring section |
| **Scheduling** (workflow 1.8) | Visit schedule with types, cadence, and urgency | Appointment generation depends on care plan visit schedule section |

---

## Interface contracts

| Interface | Between | What to verify |
|---|---|---|
| Care plan draft format | Clinical Care → Patient Ops | All 8 sections present, confidence signal included, gaps list populated |
| Clinical review format | Clinical Care → Patient Ops | Flagged issues follow severity taxonomy, pass/fail is consistent with issues |
| Nutrition plan → meal prescription | Clinical Care → Meal Ops | Caloric range, macro targets, allergen exclusions match meal_prescription schema in workflow 1.6 |
| PHQ-9 routing | Clinical Care → BHN workflow | BH section authorship matches PHQ-9 score thresholds; BHN notification fires at correct score levels |
| Approval card content | Clinical Care → UX Design Lead | Fields in draft care plan map to approval card data requirements at step 4 |
| Lab value thresholds | Clinical Care → Monitoring | Threshold values that trigger care plan updates match monitoring alert rules |
