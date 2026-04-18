# Freshness Triggers — Clinical Care

External events or changes that invalidate part of this expert's knowledge.
When a trigger fires, the expert's health status should downgrade and the
relevant domain knowledge should be re-researched.

---

## Triggers

| Trigger | Source | What it invalidates | Check method | Expected frequency |
|---|---|---|---|---|
| ADA Standards of Care annual update | American Diabetes Association | Diabetes-related MNT targets, HbA1c thresholds, medication-nutrition interactions | Check ADA publications page for new edition | Annual (January) |
| KDOQI guideline update | National Kidney Foundation | CKD nutrition management, protein restriction thresholds, eGFR staging | Check NKF/KDOQI page for updates | Every ~3-5 years |
| AND Evidence Analysis Library update | Academy of Nutrition and Dietetics | MNT protocols, evidence-based nutrition recommendations | Check AND EAL for new systematic reviews in relevant conditions | Ongoing (check quarterly) |
| FDA allergen regulation change | FDA / US Congress | Allergen classification, labeling requirements, Top 9 list changes | Check FDA food allergen page | Rare (~5-10 years), high impact when it occurs |
| ICD-10-CM annual update | CMS | Diagnosis code mappings for referral validation and care plan grounding | Check CMS ICD-10 page for new fiscal year release | Annual (October) |
| FHIR specification version change | HL7 | Data model mapping for EHR integration, resource definitions | Check HL7 FHIR releases | Every ~2-3 years |
| PHQ-9/GAD-7 instrument revision | Instrument authors / USPSTF | Scoring thresholds, routing rules, BH section logic | Check USPSTF screening recommendations | Rare — instruments are very stable |
| Cena internal protocol change | Vanessa / clinical team | Institution-specific targets, thresholds, care plan requirements | Direct notification from clinical stakeholder | As needed |
| Patient operations workflow change | `workflows/01-patient-operations.md` | Care plan structure, version semantics, approval chain, monitoring schedules | Check workflow files for significant revisions | Quarterly |
| Care-plan-creation workflow change | `workflows/care-plan-creation/steps.md` | Step inputs, outputs, fallback declarations, SLAs | Check step definitions for changes to Clinical Care steps | As needed |
| New condition added to Cena's service scope | Business decision / partner contract | May require new MNT knowledge, new nutrition targets, new comorbidity interactions | Direct notification from Aaron/clinical team | As needed |
| Clinical Ops Director hired | Hiring event | All unvalidated assumptions (A1, A2, A3) — assumptions index becomes validation checklist | Direct notification | Once |
| Study protocol published | Partner/research event | Assumptions A1, A3 may need cohort-specific overrides | Direct notification from Aaron/clinical team | Per study |

---

## Trigger evaluation during `/expert-update`

For each trigger, the update sweep should:

1. **Check:** Has this trigger fired since `last-validated`?
2. **Assess:** Does the change affect domain knowledge, judgment framework, or output contract?
3. **Scope:** Which layers need updating? (Guideline changes typically affect domain-knowledge.md; threshold changes may affect judgment-framework.md)
4. **Act:** Update affected layers, bump version, reset `last-validated`

If a trigger fires but the change is minor (e.g., ICD-10 code addition for a condition
Cena doesn't serve), note it in the retro log and keep health status green.
