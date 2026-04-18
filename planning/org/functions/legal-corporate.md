# Legal & Corporate

> Contracts, intellectual property, corporate governance, and regulatory navigation.
> Distinct from clinical Compliance — that function handles HIPAA, clinical regulations,
> and audit. This function handles the company as a legal entity.

---

## Responsibilities

- Contract management — drafting, review, execution, renewal tracking
- BAA management — Business Associate Agreements for all PHI-handling vendors
- Intellectual property — patent strategy, trade secrets, software licensing
- Corporate governance — entity maintenance, board minutes, state filings
- Insurance — D&O, E&O, malpractice, cyber liability, general liability
- Employment law — offer letters, handbook, termination procedures
- Regulatory navigation — state-by-state requirements for food-as-medicine services
- Data privacy — beyond HIPAA: state privacy laws, data breach procedures

## Sub-functions

| Sub-function | Owner today | Automation target | Notes |
|---|---|---|---|
| Contract drafting | External counsel | 🤝 Agent drafts from templates, counsel reviews | Standard agreements are highly templatable |
| Contract lifecycle tracking | Vanessa | 🤖 Automated alerts | Renewal dates, expiration, auto-reminders |
| BAA tracking | Vanessa | 🤖 Automated inventory | See [OQ-28](../../open-questions.md) re: kitchen BAAs |
| IP documentation | Not active | 🤝 Agent catalogs, human evaluates | Invention disclosure tracking |
| Corporate filings | External counsel | 👤 Human-primary | Annual reports, state registrations |
| Insurance management | Vanessa | 🤝 Agent tracks policies, renewal dates | Policy inventory with coverage gap analysis |
| Employment agreements | External counsel | 🤝 Agent drafts, counsel reviews | Templates for offers, NDAs, IP assignment |
| Regulatory tracking | Not active | 🤖 Automated monitoring | State-by-state rule changes affecting operations |
| Data breach procedures | Not active | 🤝 Agent detects, human manages response | Playbook-based incident response |

## Interfaces

| Direction | Function | What flows |
|---|---|---|
| **From** | Executive | Contract requests, partnership terms |
| **From** | Compliance | Regulatory requirements, audit findings |
| **From** | People & Culture | Employment agreements, policy questions |
| **From** | Partner & Payer | Partner contracts, BAA requirements |
| **To** | All functions | Executed agreements, legal constraints |
| **To** | Compliance | BAA inventory, regulatory interpretations |
| **To** | Finance | Contract values, payment obligations |
| **From** | Information Security | Breach notification triggers |

## Current state (Cena Health, March 2026)

External counsel handles contract review and corporate governance. Vanessa manages
BAA tracking and vendor agreements. No in-house legal. BAA status for some vendors
is still being confirmed (kitchen partners, LLM providers).

## Quality checks

- Every PHI-handling vendor has a current BAA on file
- Contract renewals flagged 90 days before expiration
- All employment agreements include IP assignment and NDA
- Insurance coverage reviewed annually against risk profile
- Regulatory changes affecting operations flagged within 48 hours

## Automation roadmap

**Phase 1:** Contract and BAA lifecycle tracking — inventory, expiration alerts,
renewal reminders. Regulatory change monitoring for key jurisdictions.

**Phase 2:** Agent-drafted standard contracts from templates. Automated insurance
policy inventory with coverage gap analysis.

**Phase 3:** Proactive regulatory intelligence — agent monitors state and federal
regulatory changes, assesses impact on Cena Health operations, and drafts
compliance response recommendations.
