# OQ-08: Shared Savings Reconciliation Ownership

**question_id:** OQ-08
**domain:** partner_payer

---

## Recommendation

Cena should own the reconciliation calculation and present it to the payer for validation. This means Cena builds the calculation, runs it against its own data, and delivers a reconciliation package to the payer with full supporting documentation. The payer reviews and either accepts or disputes specific line items.

The contract must define five things explicitly: (1) who calculates the baseline and performance-period costs, (2) the review period the payer gets to validate Cena's numbers, (3) the dispute window after review, (4) the resolution method for unresolved disputes (neutral third-party actuarial review is standard), and (5) the payment timeline after reconciliation is accepted. A typical structure: Cena delivers reconciliation package within 90 days of performance period end → payer has 60 days to review → disputes filed within 30 days of payer review → unresolved disputes go to mutually agreed independent actuary → final settlement within 30 days of resolution.

For Cena's first contracts, keep the reconciliation methodology simple: total cost of care for attributed members in the performance period vs. the agreed baseline, with a minimum savings rate (typically 2-3%) before sharing begins. Complexity (risk adjustment, trend factor, outlier truncation) should be negotiated per contract but kept minimal until Cena has the actuarial capacity to defend complex methodologies.

## Basis

- **CMS MSSP (Medicare Shared Savings Program) regulations, 42 CFR 425:** Establishes the standard reconciliation framework for shared savings — baseline calculation, quality gate, minimum savings rate, and settlement timeline. While Cena's contracts are commercial (not MSSP), payers use MSSP as the template.
- **NAACOS shared savings contract guidance:** Recommends that the entity delivering care own the reconciliation calculation, with payer audit rights, because the provider has better visibility into clinical data driving costs.
- **Domain 4.6 (Shared Savings Calculation workflow):** Currently defines the calculation flow but does not specify dispute resolution or who owns the calculation. This proposal fills that gap.
- **Domain 5.6 (PMPM & Contract Billing):** Notes that shared savings settlement periods are typically 12-18 months post-performance year — the dispute process must fit within this timeline.

## Alternatives considered

| Alternative | Description | Why not | When it would be preferred |
|---|---|---|---|
| Payer owns calculation | Let the health plan run the reconciliation and present results to Cena | Cena loses visibility into how savings are calculated, making it nearly impossible to dispute unfavorable methodology choices (attribution logic, outlier handling, trend adjustment). Startups that cede calculation ownership consistently leave money on the table. | If the payer insists on owning calculation (some large plans do) — in that case, negotiate full audit rights and an independent review clause. |
| Joint calculation | Both parties independently calculate and reconcile differences | Expensive — requires Cena to have actuarial staff AND the payer to share their claims data for Cena's independent calculation. Appropriate for large ACOs, not a startup with 3 contracts. | When Cena has an in-house actuary and the contract is large enough (>5,000 attributed lives) to justify dual calculation. |
| Third-party administrator | Outsource reconciliation to an independent TPA | Adds cost and a dependency. The TPA has no stake in accuracy and may use generic methodologies that don't reflect Cena's food-as-medicine model. | If Cena and a payer cannot agree on who owns the calculation and want a neutral party from the start — but this should be the dispute resolution, not the default. |

## Uncertainty flags

- **Payer negotiating leverage:** Large health plans may insist on owning the calculation. Cena's leverage increases with demonstrated outcomes data. For the first 1-2 contracts, Cena may need to accept payer-owned calculation with strong audit rights rather than Cena-owned calculation.
- **Actuarial capacity:** Cena does not currently have an in-house actuary. The reconciliation calculation for early contracts should be simple enough for a finance lead to run. If contracts require risk-adjusted reconciliation, Cena will need actuarial support (contracted, not necessarily hired).
- **Attribution methodology:** The biggest source of disputes. "Which patients count" is a contract-by-contract definition. Cena should push for prospective attribution (patient is attributed at enrollment) rather than retrospective attribution (patient is attributed based on claims history), because Cena controls enrollment but not claims history.

## Assumption dependencies

- **A6** (shared savings is upside-only for first 2-3 contracts) — upside-only means Cena's downside risk in a dispute is zero (worst case: no savings payment), which makes Cena-owned calculation lower risk
- **A3** (PMPM rates are contract-specific) — the shared savings baseline and methodology will also be contract-specific, reinforcing the need for per-contract reconciliation terms
- **A5** (PMPM includes meals) — if meals are in the PMPM rate, meal costs are already accounted for in the total cost of care baseline; if meals are carved out, the reconciliation must exclude them

## What we need from you

1. **Confirm or correct:** Is Cena positioned to own the reconciliation calculation for its first contracts, or do the payers you're in discussions with expect to own it?
2. **Flag if known:** Do any current or prospective payer partners have standard reconciliation templates they require? (If so, we design around their template rather than building from scratch.)
3. **Confirm:** Does Cena have access to actuarial support (even contracted) for the first shared savings settlement, or should we design for a finance-lead-executable calculation?
