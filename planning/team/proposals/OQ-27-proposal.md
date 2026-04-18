# OQ-27: Timely Filing Deadline Mapping by Payer

**question_id:** OQ-27
**domain:** revenue_cycle

---

## Recommendation

Create a payer-specific timely filing matrix before the first claim is submitted. Missing a timely filing deadline is unrecoverable revenue — there is no appeal path for a claim filed after the deadline. This is the single highest-ROI administrative task in revenue cycle setup.

The matrix should contain: payer name, payer ID (in Athena), filing deadline from date of service, filing deadline from date of denial (for corrected claims/appeals), and the source document (contract, payer manual, or state regulation). Start with confirmed payers: Medicare (365 days from DOS), Connecticut Medicaid (varies — verify with CT DSS, typically 90-180 days depending on claim type), and any commercial payers identified through partner contracts. Add California Medicaid (Medi-Cal, 6 months from DOS) and Tennessee Medicaid (TennCare, 12 months from DOS) as Cedars and Vanderbilt come online.

Athena Health likely has payer-specific filing rules in its system — verify this before building custom. If Athena's rules are accurate and current, the implementation is configuration (entering the right deadlines per payer in Athena) rather than custom development. If Athena's rules are incomplete or stale, build a supplemental lookup table that the billing agent (Domain 5.3) queries at claim monitoring time.

Automated monitoring thresholds: alert at 50% of filing window (early warning), escalate at 75% (action required), and block at 90% (critical — must file or write off). These thresholds are already designed into the Domain 5.3 workflow — this proposal ensures the underlying deadline data exists to drive them.

## Basis

- **Medicare Claims Processing Manual, Chapter 1, Section 70:** Claims must be filed within 12 months (365 days) of the date of service. No exceptions for provider error.
- **42 CFR 447.45(d):** States must allow at least 12 months for Medicaid providers to submit claims — but states can set shorter windows for specific claim types and most do.
- **Connecticut DSS Provider Bulletin:** CT Medicaid timely filing varies by claim type and provider enrollment status. Standard claims: 180 days from DOS. Claims requiring prior authorization: 180 days from authorization date. Verify current policy — CT has changed these windows historically.
- **Domain 5.3 (Submission & Tracking):** The claim monitoring workflow already includes timely filing alerts at 75% of the payer deadline and escalation at 90%. This proposal provides the deadline data that workflow depends on.
- **Domain 5.5 (Denial Management):** Appeal filing deadlines are separate from initial claim filing deadlines. Most payers allow 60-180 days from denial date to file an appeal — these must also be in the matrix.

## Alternatives considered

| Alternative | Description | Why not | When it would be preferred |
|---|---|---|---|
| Rely entirely on Athena's built-in rules | Trust Athena's payer configuration for timely filing deadlines | Athena's rules may be defaults, not contract-specific. Cena's specific payer contracts may have different deadlines than the payer's standard policy (some contracts negotiate extended filing windows). Must verify, not assume. | If Athena's payer-specific rules are verified accurate for every contracted payer AND Athena's alerting is robust enough to drive the escalation workflow. |
| Build custom from scratch | Build a standalone timely filing tracking system outside Athena | Duplicates functionality that Athena likely provides. Adds maintenance burden — every payer change must be updated in two places. | If Athena's timely filing capabilities are fundamentally inadequate (unlikely for a major practice management platform). |
| Track manually via spreadsheet | Maintain a spreadsheet of deadlines, billing staff checks manually | Does not scale. Human error is the primary cause of missed timely filing deadlines. The entire point is to automate the monitoring. | Never — this is exactly the kind of task that should be automated from day one. |

## Uncertainty flags

- **Athena's timely filing capabilities:** Unknown whether Athena has payer-specific filing deadline tracking out of the box, or whether it needs manual configuration. This is the first thing to verify — it determines whether this is a configuration task or a development task.
- **Contract-specific deadlines:** Some payer contracts negotiate custom filing windows (usually longer, occasionally shorter). The matrix must be updated when each contract is signed. If Vanessa has draft contracts, the filing deadlines should be extracted now.
- **State Medicaid variation:** CT, CA, and TN Medicaid each have different filing rules. As Cena expands to new states, each state's Medicaid filing rules must be added to the matrix. This is a recurring maintenance task, not a one-time build.
- **Appeal filing deadlines:** Separate from initial claim deadlines and often shorter (60-90 days from denial date). Must be tracked independently.

## Assumption dependencies

- **A3** (PMPM rates are contract-specific) — PMPM invoices have their own submission timelines defined in the contract, separate from FFS claim filing deadlines. The matrix should include PMPM invoice due dates as well.

## What we need from you

1. **Confirm or correct:** Has anyone on the team (or Athena's implementation team) already configured payer-specific filing deadlines in Athena? If yes, we verify rather than build.
2. **Flag if known:** Do any draft or signed contracts specify custom filing windows different from the payer's standard policy?
3. **Confirm payer list:** For the UConn pilot, which specific payers will Cena be billing? (Medicare traditional, specific Medicare Advantage plans, CT Medicaid, specific commercial plans?) The matrix starts with this list.
