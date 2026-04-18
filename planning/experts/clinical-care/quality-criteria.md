# Quality Criteria — Clinical Care

Testable definitions of "good" for every output this expert produces. Each
criterion is observable and evaluable — not subjective.

---

## Draft care plans

| Criterion | Pass condition | Check method |
|---|---|---|
| Section completeness | All 8 sections present (goals, nutrition, BH, visits, monitoring, meals, medications, risk flags) | Checklist — verify each section exists and is non-empty |
| SMART goal quality | Each goal has: specific metric, measurable target, achievable baseline comparison, relevant condition tie, time-bound reassessment date | Evaluate each goal against SMART criteria |
| Nutrition target grounding | Every caloric/macro target cites the clinical basis (condition, lab value, or guideline) | Check nutrition_plan.clinical_rationale for each target |
| Restriction conflict documentation | All comorbid restriction conflicts listed with both positions | Cross-reference diagnosis codes against restriction_conflicts list |
| Drug-nutrient interaction coverage | Every current medication checked against known interaction database; interactions flagged | Compare medications list to interaction flags |
| PHQ-9 routing correctness | BH section authorship matches PHQ-9 score routing rules (< 10: auto-populated; >= 10: flagged for BHN) | Verify bh_plan.intervention_level against PHQ-9 score |
| Lab value utilization | All available lab values referenced where clinically relevant (e.g., HbA1c in diabetes goals, eGFR in renal restrictions) | Cross-reference lab data from assessment against nutrition_plan and goals |
| Gap transparency | All known data gaps explicitly listed in gaps field — no silent omissions | Compare assessment data completeness against care plan assumptions |
| Allergen absoluteness | FDA Top 9 allergens in patient profile appear as hard exclusions (not preferences) in nutrition plan | Check allergen_exclusions against patient allergen profile |
| Confidence calibration | Confidence signal reflects actual data quality: `high` only when assessment is complete and single-condition; `low` when significant gaps exist | Evaluate confidence against gaps list and comorbidity count |

## Clinical reviews

| Criterion | Pass condition | Check method |
|---|---|---|
| Issue specificity | Each flagged issue identifies: what's wrong, which plan section, which guideline is violated, and recommended resolution | Review each flagged_issues entry for all four fields |
| Severity calibration | Critical = patient safety risk. Major = guideline deviation with clinical consequence. Minor = suboptimal but not harmful. | Check severity assignments against definitions |
| Guideline citation | Every flag references the specific clinical guideline or evidence source | Check guideline_references completeness |
| False negative rate | Review catches all dosage conflicts, missing required labs, and allergen/restriction violations present in the plan | Independent checklist comparison (shadowing validation) |
| Pass/fail consistency | `pass: true` only when zero critical and zero major issues | Verify pass field against flagged_issues severity counts |

## Care plan update recommendations

| Criterion | Pass condition | Check method |
|---|---|---|
| Trigger traceability | Update recommendation traces back to specific data point with timestamp | Verify trigger object completeness |
| Version type accuracy | Version type matches the version semantics in domain knowledge (minor/major/emergency correctly assigned) | Apply version decision tree to the trigger type |
| Downstream impact completeness | All affected downstream workflows identified (meals, monitoring, scheduling) | Cross-reference affected_sections against downstream dependency map |
| Change specificity | Each proposed change shows current value, proposed value, and rationale — not vague ("update nutrition plan") | Review proposed_changes list for specificity |

## Clinical escalation assessments

| Criterion | Pass condition | Check method |
|---|---|---|
| Routing accuracy | Escalation routed to correct team member based on type (clinical→RDN, behavioral→BHN, crisis→crisis protocol) | Verify routing against escalation_type |
| Urgency calibration | Severity matches trigger severity (crisis lab → urgent, trend decline → elevated, single data point → watch) | Evaluate severity against trigger_data |
| Action specificity | Recommended action names the specific next step, not generic ("review patient") | Check recommended_action for actionability |

---

## Meta-quality: what makes the expert itself good

| Criterion | Pass condition | Check method |
|---|---|---|
| RDN override rate trending down | Proportion of draft care plan sections the RDN modifies decreases over time | Compare override counts across review cycles in retro log |
| Restriction conflict detection rate | Expert catches comorbid restriction conflicts that would otherwise surface at RDN review | Track conflicts flagged by expert vs. caught by RDN at step 4 |
| Guideline currency | Expert applies current clinical guidelines, not outdated versions | Spot-check guideline references against latest published versions during update sweep |
| Safety miss rate: zero | Expert never produces a care plan that passes clinical review but is later found to have a safety issue | Track post-activation adverse events linked to care plan content |
| Scope discipline | Expert stays in clinical domain — doesn't make UX, billing, or logistics decisions | Review outputs for out-of-scope recommendations |
| Individualization quality | Care plans for patients with the same diagnosis but different labs/meds/comorbidities are meaningfully different | Compare plans for similar-diagnosis patients — they should diverge where clinical data diverges |
