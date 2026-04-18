# Output Contract -- Operations / Compliance

What this expert produces, in what format, and for whom. Downstream consumers
should know exactly what they'll receive.

---

## Primary outputs

### 1. Policy proposal

**Produced when:** An open question (OQ-XX) in the compliance, revenue cycle,
or partner/payer domain requires a structured recommendation for CEO review.

| Field | Format | Description |
|---|---|---|
| question_id | string | OQ reference (e.g., "OQ-07") |
| domain | enum | `compliance` / `revenue_cycle` / `partner_payer` / `grant_research` |
| recommendation | string | Specific, actionable recommendation (1-3 paragraphs) |
| basis | enum + string | `regulatory` / `contractual` / `operational` + specific citation (rule, manual section, industry practice) |
| alternatives_considered | list | Each alternative with: description, why not recommended, conditions under which it would be preferred |
| uncertainty_flags | list | What this expert doesn't know that could change the recommendation. Each flag includes: the unknown, its potential impact, and who can resolve it |
| assumption_dependencies | list | Which assumptions from the assumptions index (A1-A6) this recommendation relies on |
| what_we_need_from_you | string | Specific ask for Vanessa: confirm, correct, or flag gaps. Structured so she can respond in 2 minutes, not 20 |

**Consumed by:** Vanessa (CEO -- decision authority), Clinical Care (visit caps, billing constraints), Platform/Infrastructure (data model requirements)

---

### 2. BAA assessment

**Produced when:** A new vendor, partner, or service relationship is evaluated
for HIPAA business associate requirements.

| Field | Format | Description |
|---|---|---|
| entity | string | Name of the vendor/partner/service |
| relationship_type | enum | `kitchen_partner` / `technology_vendor` / `research_partner` / `payer` / `subcontractor` |
| phi_exposure_analysis | string | What PHI the entity would access, how, and why. Minimum necessary analysis included |
| baa_required | enum | `yes` / `no` / `unclear` |
| recommended_action | string | Execute standard BAA / execute custom BAA / no BAA needed / escalate to counsel |
| legal_review_needed | boolean | True if novel relationship type, unclear PHI exposure, or counsel hasn't reviewed this category |
| subcontractor_chain | list | Known downstream entities that would also need BAAs |

**Consumed by:** Vanessa (execution authority), Compliance expert (future -- regulatory validation)

---

### 3. Billing compliance check

**Produced when:** A new service type, payer relationship, or billing pathway
needs compliance verification.

| Field | Format | Description |
|---|---|---|
| service_type | string | e.g., "MNT initial assessment," "group nutrition therapy," "telehealth follow-up" |
| applicable_codes | list | CPT/HCPCS codes with descriptions (e.g., 97802, 97803, 97804) |
| payer_requirements | object | Per-payer: covered diagnoses, referral requirements, modifier requirements, credentialing status |
| cap_limits | object | Visit/hour caps per calendar year, per payer. Reset dates. |
| timely_filing_window | object | Per-payer: days from DOS, known exceptions, appeal window for missed deadlines |
| known_gaps | list | Requirements not yet verified, payer responses pending, credentialing incomplete |

**Consumed by:** Revenue cycle workflows (claims generation), Clinical Care (visit scheduling within caps), Patient Ops (enrollment compliance)

---

### 4. Partner contract framework

**Produced when:** A new partner or payer relationship is being structured
and needs a pricing/contract model recommendation.

| Field | Format | Description |
|---|---|---|
| partner_type | enum | `health_system` / `payer` / `employer` / `research_institution` / `government` |
| recommended_model | enum | `pmpm` / `shared_savings` / `ffs` / `hybrid` / `grant_subaward` |
| rate_range_basis | string | How the recommended rate range was derived (acuity, service scope, market benchmarks, cost modeling) |
| reconciliation_process | string | How savings/costs are reconciled, who owns the calculation, dispute path |
| reporting_cadence | enum | `monthly` / `quarterly` / `annual` + what metrics are reported |
| legal_review_flags | list | AKS/Stark considerations, state-specific requirements, novel structure elements |

**Consumed by:** Vanessa (negotiation), BD workflows (proposal development)

---

## Output guarantees

- Every recommendation cites regulatory or contractual basis -- no unsourced guidance
- Uncertainty is explicit -- the expert never presents assumptions as settled facts
- Legal questions flagged for counsel -- this expert researches but does not render legal opinions
- Proposals are self-contained -- Vanessa can decide without reading source docs
- `[ASSUMPTION]` dependencies are listed on every output that relies on unvalidated assumptions
