# Customer Success & Account Management

> The function that owns ongoing partner relationships after the deal closes.
> Distinct from Business Development (which acquires partners) and Partner & Payer
> Relations (which manages the operational integration). This function ensures partners
> get value, renew, and expand.

---

## Responsibilities

- Partner health monitoring — are they getting value from the program?
- Quarterly business reviews (QBRs) — structured partner check-ins
- Escalation management — when a partner has concerns or issues
- Expansion planning — growing scope within existing partnerships
- Churn prevention — detecting and addressing dissatisfaction early
- Partner training — ensuring partner staff know how to use the platform
- Success metrics — defining and tracking what "success" means per partner
- Renewal management — contract renewal process

## Sub-functions

| Sub-function | Automation target | Agent coverage | Notes |
|---|---|---|---|
| Partner health scoring | 🤖 Automated | ReportingAgent | Composite score: referral volume, outcomes, engagement |
| QBR preparation | 🤖 Automated | ReportingAgent | Agent compiles data package; human leads meeting |
| QBR follow-up tracking | 🤝 Agent-assisted | None (gap) | Action items tracked to completion |
| Escalation detection | 🤖 Automated | None (gap) | Pattern-based: referral drops, delayed responses, complaints |
| Escalation management | 🤝 Agent-assisted | None (gap) | Agent drafts response; human manages relationship |
| Expansion opportunity identification | 🤝 Agent-assisted | ReportingAgent | Data-driven: capacity, outcomes, new populations |
| Partner training materials | 🤝 Agent-assisted | None (gap) | Generated from platform docs; updated on feature changes |
| Renewal tracking | 🤖 Automated | None (gap) | Contract dates, auto-reminders, renewal prep |
| Success metric dashboards | 🤖 Automated | ReportingAgent | Per-partner dashboards accessible to partner contacts |

## Interfaces

| Direction | Function | What flows |
|---|---|---|
| **From** | Partner & Payer | Operational issues, integration status |
| **From** | Data & Analytics | Outcomes data, utilization metrics |
| **From** | Patient Operations | Enrollment rates, referral conversion |
| **From** | Revenue Cycle | Financial performance per partner |
| **To** | Executive | Partner health, renewal risk, expansion pipeline |
| **To** | Business Development | Expansion opportunities, reference partners |
| **To** | Partner & Payer | Relationship context for operational decisions |
| **To** | Product & Engineering | Partner-driven feature requests |

## Current state

No formal customer success function — Vanessa and Aaron manage partner relationships
directly. QBRs not yet structured. With only 2 active partners (UConn, Vanderbilt),
this is manageable but won't scale past 5-10 partnerships.

## Quality checks

- Partner health score calculated monthly
- QBR conducted quarterly for every active partner
- QBR action items tracked with owners and deadlines
- Renewal process initiated 120 days before contract expiration
- Partner NPS measured annually

## Scaling trigger

This function becomes critical at 5+ active partners. Below that, it can be
absorbed by Executive and Partner & Payer. The org chart should track when
partner count approaches this threshold and formalize the function.

## Automation roadmap

**Phase 1:** Partner health scoring from existing data. Automated QBR data packages.
Renewal date tracking with alerts.

**Phase 2:** Escalation detection from referral and engagement patterns. Expansion
opportunity scoring. Partner-facing dashboards.

**Phase 3:** Predictive churn modeling. Automated partner training content that
updates when platform features change. Success playbooks per partner archetype.
