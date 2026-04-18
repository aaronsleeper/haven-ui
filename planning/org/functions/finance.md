# Finance & Accounting

> Money in, money out, and knowing the difference. Distinct from Revenue Cycle —
> that function handles getting paid for clinical services. This function handles
> the company's overall financial health.

---

## Responsibilities

- Bookkeeping — transaction recording, categorization, reconciliation
- Accounts payable — vendor payments, contractor invoices, expense management
- Accounts receivable — non-clinical revenue (grants, investments, partner payments)
- Financial planning & analysis — budgets, forecasts, runway modeling
- Tax compliance — filings, estimated payments, deductions
- Payroll — processing, tax withholding, benefits administration
- Financial reporting — P&L, balance sheet, cash flow, board-ready financials
- Grant financial management — budget tracking, reporting, compliance for research grants

## Sub-functions

| Sub-function | Owner today | Automation target | Notes |
|---|---|---|---|
| Bookkeeping | Vanessa / accountant | 🤖 Automated (bank sync + categorization) | QuickBooks/Xero integration |
| AP processing | Vanessa | 🤝 Agent matches invoices, human approves | Invoice → PO matching, payment scheduling |
| AR tracking | Vanessa | 🤝 Agent tracks, human follows up | Non-clinical receivables |
| Budget vs. actual reporting | Manual | 🤖 Automated dashboards | Real-time from accounting data |
| Runway forecasting | Vanessa | 🤝 Agent models scenarios, human decides | Burn rate × revenue × funding |
| Tax prep | External CPA | 👤 Human-primary | Agent organizes documents |
| Payroll processing | External provider | 🤖 Automated | Direct integration with payroll provider |
| Grant budget tracking | Vanessa | 🤝 Agent tracks spend against grant budget | See [OQ-40](../../open-questions.md) re: UConn grant |
| Financial dashboards | Not active | 🤖 Automated | KPIs: runway, burn rate, revenue per patient, PMPM margin |
| Expense management | Ad hoc | 🤖 Automated (receipt capture + categorization) | Mobile capture → auto-categorize |

## Interfaces

| Direction | Function | What flows |
|---|---|---|
| **From** | Revenue Cycle | Clinical revenue, claims payments, PMPM income |
| **From** | People & Culture | Payroll data, contractor costs |
| **From** | All functions | Expenses, purchase requests |
| **From** | Partner & Payer | Contract values, payment terms |
| **To** | Executive | Financial reports, runway status, forecasts |
| **To** | Compliance | Financial audit data, grant compliance reports |
| **To** | Data & Analytics | Cost data for unit economics analysis |
| **From** | Legal & Corporate | Contract values, payment obligations |

## Current state (Cena Health, March 2026)

Vanessa manages finances with external accountant and CPA. No dedicated finance
role. Basic bookkeeping in place. Financial planning done in spreadsheets.
Grant financial tracking is becoming important with UConn partnership.

## Quality checks

- Monthly reconciliation — bank statements match books
- Quarterly financial review by all founders
- Grant spend reviewed against budget monthly
- AP approved by a second founder above threshold (define threshold)
- Annual audit by external CPA

## Automation roadmap

**Phase 1:** Automated bookkeeping via accounting platform integration. Expense
categorization. Basic financial dashboards (runway, burn rate).

**Phase 2:** AP automation with invoice matching. Grant budget tracking with
variance alerts. Payroll integration.

**Phase 3:** Predictive runway modeling that incorporates patient volume projections,
contract pipeline, and hiring plans. Agent-generated board financial packages.
