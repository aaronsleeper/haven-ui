# Revenue Cycle & Billing

> How Cena Health gets paid. Claims generation, submission, tracking, and
> reconciliation. High automation potential — most steps are rule-based.

---

## Responsibilities

- Claims generation from documented services
- Claims submission to payers (via Athena Health)
- Payment posting and reconciliation
- Denial management and appeals
- PMPM billing cycle management
- Shared savings reconciliation
- Coding accuracy and compliance
- Timely filing enforcement

## Sub-functions

| Sub-function | Automation target | Agent coverage | Notes |
|---|---|---|---|
| Claims generation | 🤖 Automated | ClaimsAgent | Visit record → 837 claim file |
| Claims scrubbing | 🤖 Automated | ClaimsAgent | Pre-submission validation against rules |
| Claims submission | 🤖 Automated (with gate) | ClaimsAgent | Auto-submit below threshold; human review above |
| Payment posting | 🤖 Automated | FinancialOrchestrator | ERA/835 → payment reconciliation |
| Denial management | 🤝 Agent-assisted | ClaimsAgent | Agent categorizes denial, drafts appeal; human reviews |
| PMPM billing | 🤖 Automated | FinancialOrchestrator | Monthly cycle, member roster reconciliation |
| Shared savings reconciliation | 🤝 Agent-assisted | ReportingAgent | See [OQ-08](../../open-questions.md) |
| Coding review | 🤝 Agent-assisted | ClaimsAgent | Agent flags coding anomalies; coder reviews |
| Timely filing tracking | 🤖 Automated | FinancialOrchestrator | Deadline monitoring per payer; See [OQ-27](../../open-questions.md) |
| Revenue reporting | 🤖 Automated | ReportingAgent | Daily/weekly/monthly revenue dashboards |

## Interfaces

| Direction | Function | What flows |
|---|---|---|
| **From** | Clinical Care | Documented visits, procedure codes |
| **From** | Patient Operations | Enrollment, eligibility, insurance data |
| **From** | Partner & Payer | Contract terms, billing rates |
| **From** | Meal Operations | Delivery records for meal billing |
| **To** | Finance | Revenue data, collections, outstanding AR |
| **To** | Compliance | Billing audit data, coding accuracy metrics |
| **To** | Data & Analytics | Revenue per patient, denial rates, PMPM margin |
| **To** | Executive | Revenue performance, financial health |
| **To** | Customer Success | Financial performance per partner |

## Current state

Athena Health confirmed as billing platform ([OQ-03 in open-questions.md](../../open-questions.md)).
No billing operations yet — platform in planning phase.
Workflows specified in [05-revenue-cycle.md](../../workflows/05-revenue-cycle.md) (7 workflows).

## Quality checks

- Claims submitted within timely filing window (tracked per payer)
- Denial rate tracked weekly; root cause analysis on denials > 5%
- Coding accuracy audited monthly (sample review)
- Payment posting reconciled against bank deposits daily
- PMPM rosters reconciled against active patient census

## Detailed workflows

See [05-revenue-cycle.md](../../workflows/05-revenue-cycle.md) for full workflow specifications.

## Key roles

- [Admin](../../roles/admin.md) — billing oversight and exception handling
- FinancialOrchestrator — billing cycle management
- ClaimsAgent — claims generation and submission
