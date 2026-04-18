# Quality Criteria -- Operations / Compliance

Testable definitions of "good" for every output this expert produces. Each
criterion is observable and evaluable -- not subjective.

---

## Policy proposals

| Criterion | Pass condition | Check method |
|---|---|---|
| Regulatory citation present | Every recommendation includes specific regulatory or contractual basis (rule number, manual section, statute) | Check basis field for specific citations, not generic references |
| Uncertainty explicit | All unknowns that could change the recommendation are listed with potential impact | Review uncertainty_flags for completeness against known unknowns |
| Legal boundary respected | No legal interpretations rendered -- legal questions explicitly flagged for counsel | Scan recommendation and alternatives for legal conclusions vs. legal questions |
| Self-contained | Reviewer can make a decision from the proposal alone, without reading source documents | Test: can a reader who hasn't seen the source material understand the recommendation and its basis? |
| Alternatives considered | At least one alternative to the recommendation is described with reasons for not choosing it | Check alternatives_considered is non-empty and substantive |
| Assumption dependencies listed | Every unvalidated assumption the recommendation relies on is cited by index number | Cross-reference recommendation logic against assumptions index |
| Actionable ask | what_we_need_from_you field contains a specific, bounded ask (not "what do you think?") | Check for confirm/correct/flag structure |
| Financial impact estimated | Where applicable, order-of-magnitude financial impact is included | Check for cost/revenue implications in recommendation or uncertainty_flags |

## BAA assessments

| Criterion | Pass condition | Check method |
|---|---|---|
| PHI exposure specificity | Analysis names specific data elements, not generic "patient data" | Check phi_exposure_analysis for named fields (diagnosis codes, delivery addresses, etc.) |
| Minimum necessary applied | Assessment considers whether PHI exposure can be reduced while maintaining function | Check for minimum necessary analysis in phi_exposure_analysis |
| Decision tree compliance | baa_required determination follows the BAA necessity decision tree in judgment framework | Trace the assessment through the decision tree steps |
| Subcontractor chain identified | Known downstream entities listed even if BAA status is unclear | Check subcontractor_chain field |

## Billing compliance checks

| Criterion | Pass condition | Check method |
|---|---|---|
| Code accuracy | CPT/HCPCS codes match current CMS published code set | Verify codes against CMS fee schedule |
| Payer specificity | Requirements are per-payer, not generic "payers require..." | Check payer_requirements for named payers with specific requirements |
| Gap transparency | Unknown payer requirements are in known_gaps, not silently omitted | Compare known payers against payer_requirements coverage |
| Cap arithmetic correct | Visit/hour caps match published Medicare limits or contract terms | Verify cap_limits against source (Medicare manual, contract) |

## Partner contract frameworks

| Criterion | Pass condition | Check method |
|---|---|---|
| Model rationale grounded | recommended_model choice traces back to judgment framework decision tree | Apply pricing model selection tree to the partner context |
| AKS/Stark flagged when applicable | Any arrangement involving referrals, shared savings, or PMPM has legal_review_flags for AKS/Stark | Check legal_review_flags for VBC-related arrangements |
| Reconciliation defined | reconciliation_process includes who calculates, who verifies, and what happens when numbers disagree | Check for all three elements |

---

## Meta-quality

| Criterion | Pass condition | Check method |
|---|---|---|
| Vanessa override rate | Proportion of proposals Vanessa accepts without modification tracks over time | Compare proposal recommendations against Vanessa's decisions in retro log |
| Scope discipline | Expert stays in compliance/revenue cycle/operations -- doesn't make clinical or architectural decisions | Review outputs for out-of-scope recommendations |
| Counsel escalation accuracy | Legal questions are flagged, not answered; flagged questions are actually legal (not just complex) | Review legal_review_needed flags against actual counsel needs |
