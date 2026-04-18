# Risk Register — Clinical Care

Known failure modes ranked by likelihood and impact. What goes wrong most often,
what's the worst-case scenario, and what mitigations exist.

---

## Risk matrix

| Risk | Likelihood | Impact | Current mitigation | Residual risk |
|---|---|---|---|---|
| **Missed drug-nutrient interaction** — care plan doesn't flag a contraindication between patient's medication and prescribed nutrition | Medium | Critical | Interaction check is in quality criteria; medications list is required input; RDN reviews at step 4 | Medium — interaction databases are incomplete; novel drugs may not have nutrition data |
| **Incorrect restriction for comorbidities** — conflicting condition requirements resolved incorrectly (e.g., CKD protein limit applied to a patient whose renal function doesn't warrant it) | Medium | High | Decision tree requires lab-value-driven staging, not diagnosis-code-only; conflicts flagged for RDN | Medium — staging thresholds have gray zones; expert may over- or under-restrict |
| **PHQ-9 routing error** — patient with suicidal ideation (Q9 > 0) not routed to crisis protocol | Low | Critical | Q9 > 0 check is independent of total score in decision tree; hardcoded as first-priority check | Low — but any implementation bug in the Q9 check has catastrophic consequences |
| **Stale clinical guidelines** — expert applies outdated MNT targets because freshness trigger wasn't caught | Medium | High | Freshness triggers for major guideline bodies; update sweep checks sources | Medium — guideline publication timing varies; there's a window between publication and detection |
| **Over-reliance on structured data** — care plan misses clinically significant information in unstructured assessment notes (coordinator notes, AVA transcript context) | High | Medium | Quality criteria require gap transparency; RDN reviews full assessment at step 4 | Medium — agent processes structured fields well but may miss nuance in freeform text |
| **Fabricated clinical data** — expert infers or estimates a lab value or clinical finding when data is missing | Low | Critical | Judgment framework explicitly prohibits data fabrication; quality criteria check gap transparency | Low — but LLM-based experts have inherent confabulation risk; gap list is the primary defense |
| **Allergen misclassification** — food intolerance treated as preference (soft constraint) when patient has true allergy (hard constraint) | Low | Critical | Allergen absoluteness check in quality criteria; FDA Top 9 always hard exclusions | Low — edge cases exist for non-Top-9 allergens where classification depends on patient history |
| **Care plan update cascade failure** — update to nutrition plan doesn't propagate to meal prescription, causing patient to receive meals mismatched with current plan | Medium | High | Output contract includes downstream_impacts field; Patient Ops orchestrates cascading updates | Medium — cascade logic is in orchestration layer, not this expert; this expert flags what changed |
| **Confidence signal miscalibration** — expert reports `high` confidence on a plan with significant uncertainty, causing downstream steps to under-review | Medium | Medium | Confidence calibration criteria link signal to data completeness and comorbidity count | Medium — calibration improves with retro log data; initial calibration is theoretical |
| **Assumption-based protocol deviation** — expert applies published guideline assumptions (A1, A3) where Cena's institutional standards may differ by cohort | High | Medium | Assumptions flagged with `[ASSUMPTION]` markers in domain-knowledge.md; RDN review at step 4 catches deviations; assumptions index tracks validation status | Medium — assumptions are defensible (published guidelines) but institutional override is expected when Clinical Ops Director is hired |

---

## Highest-stakes decisions

1. **PHQ-9 crisis routing** — Q9 > 0 must trigger crisis protocol. A missed
   routing could mean a patient expressing suicidal ideation doesn't receive
   immediate intervention. This is the single highest-consequence decision
   this expert makes.

2. **Allergen hard exclusions** — Classifying a true allergen as a preference
   could result in anaphylaxis. The expert must never downgrade an allergen
   to a soft constraint.

3. **Comorbid restriction resolution** — When conditions conflict (e.g., CKD
   protein restriction vs. diabetes protein needs), the wrong resolution
   produces a care plan that actively harms the patient. The expert's policy
   is to flag and defer to the RDN, but the flag itself must be accurate.

4. **Emergency version triggering** — When a critical lab value arrives, the
   expert must correctly classify this as an emergency update (4h coordinator
   review) rather than a routine minor update. Under-classification delays
   clinical response.

5. **Data gap transparency** — When assessment data is incomplete, the expert
   must surface the gaps rather than produce a plan that appears complete.
   A plan that looks complete but has hidden assumptions is more dangerous
   than a plan with explicit unknowns.
