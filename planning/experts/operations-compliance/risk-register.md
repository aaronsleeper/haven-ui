# Risk Register -- Operations / Compliance

Known failure modes ranked by likelihood and impact. What goes wrong most often,
what's the worst-case scenario, and what mitigations exist.

---

## Risk matrix

| Risk | Likelihood | Impact | Current mitigation | Residual risk |
|---|---|---|---|---|
| **Kitchen partners handling PHI without BAAs** -- Diagnosis-linked dietary orders flow to kitchens before BAAs are executed. Active HIPAA violation if kitchen receives patient-identifiable condition data. | High (current state) | Critical | OQ-28 sent to Vanessa; org review flagged as P0 blocker; data model includes baa_status field | High -- no BAAs executed yet. Risk exists from moment of first patient enrollment if unresolved |
| **Medicare MNT visit cap mismanagement** -- Care plan schedules more visits than Medicare covers (3+2/year), resulting in denied claims or patient billing | Medium | High | OQ-25 sent to Vanessa; workflow 5.1 and 2.1 include visit count tracking | Medium -- tracking is designed but cap-aware scheduling logic not confirmed with clinical team |
| **Timely filing deadline miss** -- Claims submitted past payer-specific filing deadline, resulting in irrecoverable revenue loss | Medium | High | OQ-27 sent to Vanessa; workflow 5.3 includes filing deadline monitoring | High -- per-payer deadline map does not exist yet. Cannot monitor what isn't mapped |
| **HEDIS reporting inability** -- First VBC contract requires HEDIS reporting but data model lacks required fields, making 12+ months of patient data unusable | Medium | High | OQ-07 recommendation: design for HEDIS from day one | Medium -- recommendation drafted but not yet confirmed or implemented |
| **Shared savings dispute with no defined process** -- Payer's reconciliation calculation differs from Cena's; no contractual dispute path exists | Low (no VBC contracts yet) | High | OQ-08 sent to Vanessa; recommendation to define dispute process in contract template | Low currently -- risk grows when first shared savings contract is signed |
| **Grant PI structure failure** -- Federal grant application rejected because UConn PI requirements not met (missing F&A agreement, eRA Commons issues, faculty appointment gap) | Low | Medium | OQ-40 sent to Vanessa for UConn confirmation | Low -- R1 universities typically have infrastructure, but specific PI identification needed |
| **AKS/Stark violation in pricing model** -- PMPM or shared savings arrangement structured in a way that violates anti-kickback statute or Stark Law | Low | Critical | Judgment framework flags AKS/Stark for counsel review; OQ-41 recommendation includes legal review flag | Medium -- safe harbors exist but require specific structuring. Counsel review is the mitigation |
| **LLM BAA gap** -- PHI enters LLM prompts before Google/Vertex AI BAA is executed. HIPAA violation. | Medium (tempting to use AI before BAA is done) | Critical | A5 assumption tracks BAA status; org review flagged as P0 | High until BAA is executed -- "in progress" is not "done" |
| **Multi-state licensure gap** -- RDN provides MNT to patient in a state where they're not licensed, resulting in practicing without a license | Low | Critical | OQ-29 resolved: scheduling must block on lapsed credentials. Compact covers ~20 states. | Low -- system design addresses it, but implementation must enforce the block |
| **Stale payer requirements** -- Expert's billing compliance checks reference outdated payer policies, leading to denied claims | Medium | Medium | Freshness triggers for CMS updates and payer policy changes | Medium -- payer communications are fragmented; no single source of truth |

---

## Highest-stakes decisions

1. **BAA execution before PHI flows** -- Every entity that receives PHI must
   have an executed BAA. A single PHI disclosure without a BAA is a reportable
   HIPAA violation. Kitchen partners (OQ-28) and LLM provider are the immediate
   gaps.

2. **Timely filing compliance** -- A missed filing deadline means permanently
   lost revenue. There is no appeal for most payers. The filing deadline map
   is the single most operationally critical artifact this expert should produce.

3. **AKS/Stark compliance in pricing** -- A pricing model that violates
   anti-kickback statute can result in criminal penalties, civil monetary
   penalties, and exclusion from federal healthcare programs. Every pricing
   arrangement must be reviewed by counsel for AKS/Stark compliance.

4. **Medicare visit cap enforcement** -- Billing for visits beyond the annual
   cap results in denied claims (best case) or fraud allegations (worst case
   if systematic). Cap-aware scheduling is a compliance requirement, not a
   feature.

5. **Research vs. clinical data boundary** -- Sending clinical PHI to a
   research partner without proper data use agreements and consent is both
   a HIPAA violation and an IRB violation. Physical data separation (clinical
   Postgres vs. analytics BigQuery) is the architectural defense.
