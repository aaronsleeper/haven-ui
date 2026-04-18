# Partner & Payer Relations

> How Cena Health works with health systems, MCOs, and payers. Relationship-heavy
> on the front end, data-heavy on the back end.

---

## Responsibilities

- Partner onboarding — contracts, integration setup, workflow alignment
- Referral pipeline management — inbound referral volume and quality
- Payer contract management — rates, terms, covered services
- Partner reporting — outcomes, utilization, ROI
- Integration management — FHIR/HL7/Epic connections per partner
- Account management — ongoing relationship, issue resolution, expansion
- Co-marketing — joint case studies, presentations, materials

## Sub-functions

| Sub-function | Automation target | Agent coverage | Notes |
|---|---|---|---|
| Partner onboarding | 🤝 Agent-assisted | None (gap) | Checklist-driven but relationship-heavy |
| Referral pipeline tracking | 🤖 Automated | ReportingAgent | Volume, conversion rates, source attribution |
| Payer contract tracking | 🤝 Agent-assisted | None (gap) | Terms, rates, renewal dates |
| Partner outcomes reporting | 🤖 Automated | ReportingAgent, DataExchangeAgent | Scheduled reports from live data |
| Integration setup & monitoring | 🤝 Agent-assisted | DataExchangeAgent | FHIR endpoint config, health monitoring |
| Account management | 🚫 Always human | None | Relationship-driven |
| Payer eligibility management | 🤖 Automated | EligibilityAgent | Real-time eligibility checks |
| Co-marketing materials | 🤝 Agent-assisted | None (gap) | See [marketing-brand.md](marketing-brand.md) |

## Interfaces

| Direction | Function | What flows |
|---|---|---|
| **From** | Business Development | New partner agreements, terms |
| **From** | Executive | Partnership strategy, pricing decisions |
| **From** | Data & Analytics | Outcomes data for reporting |
| **To** | Patient Operations | Referrals, eligibility information |
| **To** | Revenue Cycle | Contract terms, billing rates |
| **To** | Compliance | BAA status, integration audit trails |
| **To** | Executive | Partner health, expansion opportunities |
| **To** | Finance | Contract values, payment terms |
| **To** | Legal & Corporate | Contract requests, BAA requirements |
| **From** | Marketing & Brand | Co-branded materials, partner-specific content |
| **From** | Customer Success | Relationship context for operational decisions |

## Current state

Active partners: UConn Health, Vanderbilt Health. TriCare early stage (deferred).
Partner-specific details in `Stack Overflowed/Projects/Cena Health/Partners/`.
Workflows specified in [04-partner-payer-relations.md](../../workflows/04-partner-payer-relations.md) (6 workflows).

## Quality checks

- Partner reports delivered on contracted schedule
- Referral acknowledgment within 24 hours
- Integration health monitored — alert on failure within 15 minutes
- Contract terms reviewed 90 days before renewal
- Partner satisfaction surveyed quarterly

## Agent gaps

This function has notable gaps in agent coverage:
- No dedicated partner onboarding agent
- No payer contract management agent
- CommunicationAgent serves patients but not partner communications
- ReportingAgent covers data but not relationship management

These gaps are appropriate for early stage — partner relationships require human
judgment. As patterns stabilize, more sub-functions can shift to agent-assisted.

## Detailed workflows

See [04-partner-payer-relations.md](../../workflows/04-partner-payer-relations.md) for full workflow specifications.
