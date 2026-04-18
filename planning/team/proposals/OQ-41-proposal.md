# OQ-41: Pricing Model Framework — Standard Rates vs. Case-by-Case

**question_id:** OQ-41
**domain:** partner_payer

---

## Recommendation

Case-by-case pricing for the first 3-5 contracts, within a standardized framework that makes each negotiation faster and more consistent. Standardize the structure (what's included, how it's calculated, what the levers are) while letting the rates vary by contract.

The framework has three components:

**Component 1 — PMPM base rate.** Every contract starts with a per-member-per-month rate. The rate varies based on four inputs: (1) population acuity (higher acuity = higher rate — a diabetes + CKD population costs more to serve than a pre-diabetes screening population), (2) service scope (meals included or excluded — this is the single biggest rate driver per A5), (3) volume (more members = lower per-member cost due to fixed cost amortization), and (4) contract term (longer commitment = rate discount, because Cena can amortize setup costs). For the first contracts, build a simple cost model: direct costs per member (RDN time, BHN time, meals, coordination) + overhead allocation + target margin. This becomes the floor. The rate offered is the floor plus the value proposition (projected cost savings to the payer).

**Component 2 — Shared savings upside (optional).** Layered on top of PMPM for contracts where the payer is willing to share downside risk savings. Per A6, first contracts should be upside-only: Cena shares in documented savings above a minimum savings rate (typically 2-3%), but bears no downside risk if costs increase. Split ratios for upside-only arrangements typically range from 25-50% to the provider (Cena). Quality gates (HEDIS measures per OQ-07) determine whether the savings share is earned.

**Component 3 — Rate card for add-on services.** Some services may be carved out of the PMPM and billed separately: BHN sessions (OQ-13 confirmed BHN bills independently), specialized assessments, or crisis intervention. A standard rate card for carved-out services ensures consistency across contracts even when PMPM rates vary.

After 3-5 contracts, Cena will have real cost data and can establish rate tiers (e.g., Tier 1: diabetes management with meals, Tier 2: nutrition counseling without meals, Tier 3: behavioral health add-on). Premature standardization before real cost data exists locks in rates based on assumptions.

## Basis

- **CMS ACO payment models (MSSP, ACO REACH):** Establish the standard framework for VBC pricing — PMPM base + shared savings. Commercial payers model their contracts on CMS templates. The structure Cena uses should be familiar to any payer accustomed to VBC contracting.
- **NAACOS benchmarking data:** Upside-only shared savings splits for new provider organizations typically range from 25-50% of net savings. Higher percentages are earned as the provider demonstrates outcomes over multiple performance years.
- **Milliman actuarial guidance on VBC pricing:** Recommends that new VBC entrants price based on cost-plus-margin for the first 3-5 contracts, then transition to value-based pricing once utilization data is available. Premature standardization based on projected rather than actual costs creates either margin compression (rates too low) or sales friction (rates too high).
- **Domain 4.2 (Contract Management):** Contract records already track PMPM rate, performance period, and shared savings terms. This proposal provides the framework for setting those values.
- **Domain 5.6 (PMPM & Contract Billing):** The billing workflow supports variable PMPM rates per contract — no system changes needed for case-by-case pricing.
- **OQ-13 decision:** BHN bills independently. This confirms that not all services are bundled into PMPM — the rate card for carved-out services is operationally necessary.

## Alternatives considered

| Alternative | Description | Why not | When it would be preferred |
|---|---|---|---|
| Standard rate from day one | Set a single PMPM rate and shared savings split applied to all contracts | Cena does not yet know its actual cost per member. A standard rate set on projections will be wrong — either leaving money on the table (too low) or losing deals (too high). Each partner's population acuity and service scope is different enough that a single rate cannot be optimal. | When Cena has 5+ contracts with 12+ months of cost data — then patterns emerge that support defensible standard tiers. |
| Pure FFS (no PMPM) | Bill every service individually under CPT codes | FFS alone does not capture the value of food-as-medicine outcomes (reduced ER visits, reduced inpatient admissions). PMPM + shared savings aligns Cena's revenue with the value it creates. FFS also creates unpredictable revenue compared to PMPM's monthly predictability. | For payers unwilling to do VBC contracts — FFS may be the only option for some commercial payers initially. The system should support both billing models (and does per Domain 5). |
| Percentage-of-savings only (no PMPM) | No base rate — Cena earns only from documented savings | Cena bears all delivery costs upfront with no guaranteed revenue until savings are calculated 12-18 months later. This is not viable for a startup with limited runway. | For a well-capitalized organization with strong confidence in outcomes data — this model maximizes payer willingness to participate because their risk is zero. Could be offered as an option for a high-value contract where Cena is confident in the population. |
| Outsource pricing to actuarial firm | Hire an actuary to set rates for each contract | Expensive ($20-50K per actuarial analysis) and unnecessary at Cena's current scale. The cost model approach (direct costs + overhead + margin) is sufficient for early contracts. Actuarial pricing becomes valuable when the population sizes and risk adjustment complexity warrant it. | When Cena is negotiating contracts with >5,000 attributed lives or when payers require actuarial certification of the PMPM rate (some large plans do). |

## Uncertainty flags

- **Actual cost per member:** Cena does not yet have real operational data on cost per member. The UConn pilot will generate this data. Until then, the PMPM rate is based on projected costs — which are estimates, not facts.
- **Meal cost variability:** If meals are included in PMPM (A5), meal cost is the largest variable component. Kitchen partner pricing, delivery logistics, and meal frequency all affect the per-member meal cost. This must be nailed down before pricing the first PMPM contract.
- **Payer expectations:** Different payers have different expectations for PMPM rates in food-as-medicine programs. Some may benchmark against existing MNT programs (lower cost, fewer services); others may benchmark against broader chronic disease management programs (higher cost, more services). Understanding the payer's internal benchmark before proposing a rate is critical.
- **Shared savings baseline methodology:** The savings split percentage matters less than the baseline methodology. A generous split on an aggressive baseline produces less revenue than a modest split on a favorable baseline. Cena should negotiate the baseline methodology as carefully as the split percentage.
- **Regulatory floor:** Medicare Advantage plans have CMS-defined actuarial floors for PMPM rates. If any contracts are with MA plans, the rate cannot be set below the regulatory floor.

## Assumption dependencies

- **A3** (PMPM rates will be contract-specific, not universal) — this proposal confirms A3 and provides the framework for how rates are determined per contract
- **A5** (PMPM model includes meals in the rate) — whether meals are in or out of the PMPM rate is the single biggest pricing variable. If meals are included, the rate is significantly higher. If excluded, meals need a separate billing mechanism per contract.
- **A6** (shared savings is upside-only for first 2-3 contracts) — this determines the risk profile. Upside-only means Cena never owes money back to the payer, which makes aggressive shared savings targets (lower minimum savings rate, higher share percentage) lower risk for Cena.

## What we need from you

1. **Confirm or correct:** Is the case-by-case approach aligned with how Vanessa is currently approaching pricing conversations with partners? Or is there pressure to present a standard rate sheet?
2. **Confirm:** Are meals included in the PMPM rate for the UConn contract specifically? (This is the first pricing decision that needs to be made.)
3. **Flag if known:** What PMPM rate range is Cena expecting? (Even a rough range — $50-100? $100-200? $200+? — helps calibrate the framework.)
4. **Confirm:** Is the shared savings split for the first contracts expected to be negotiated, or has a target split already been discussed with any payer?
