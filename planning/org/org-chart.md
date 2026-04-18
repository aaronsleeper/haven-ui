# Cena Health Org Chart

> A complete map of every function the company performs. Each function has an owner
> (human or agent), an automation target, and a detail file. This is the roadmap for
> Project Ava's "company in a box" goal.
>
> **How to read this:** The org chart has two tiers. Company infrastructure functions exist
> regardless of what the company sells. Service delivery functions are specific to Cena
> Health's food-as-medicine business. Together they cover everything a human org would staff.

---

## Automation status key

| Status | Meaning |
|---|---|
| 🤖 Automated | Agent handles end-to-end, no human needed |
| 🤝 Agent-assisted | Agent does the work, human reviews/approves |
| 👤 Human-primary | Human does the work, agent supports |
| ⬜ Not designed | Function identified but automation approach not yet defined |
| 🚫 Always human | Structural requirement for human judgment (relationships, strategy, clinical decisions) |

---

## Tier 1: Company Infrastructure

Functions that exist regardless of product. At Cena's current stage (3 co-founders),
most of these are handled by founders or not at all. The target state column shows what
full automation looks like.

| Function | Current owner | Target automation | Detail | Status |
|---|---|---|---|---|
| **Executive & Strategy** | Vanessa, Aaron, Andrey | 🚫 Always human (agent-informed) | [executive.md](functions/executive.md) | ⬜ |
| **Product & Engineering** | Aaron (product), Andrey (eng) | 🤝 Agent-assisted | [product-engineering.md](functions/product-engineering.md) | ⬜ |
| **People & Culture** | Vanessa | 🤝 Agent-assisted | [people-culture.md](functions/people-culture.md) | ⬜ |
| **Finance & Accounting** | Vanessa | 🤝 Agent-assisted | [finance.md](functions/finance.md) | ⬜ |
| **Marketing & Brand** | Aaron | 🤝 Agent-assisted | [marketing-brand.md](functions/marketing-brand.md) | ⬜ |
| **Legal & Corporate** | External counsel + Vanessa | 👤 Human-primary | [legal-corporate.md](functions/legal-corporate.md) | ⬜ |
| **Information Security** | Andrey | 🤖/🤝 Mixed | [information-security.md](functions/information-security.md) | ⬜ |

---

## Tier 2: Service Delivery

Functions specific to Cena Health's food-as-medicine business. These map to the 10
business domains in [business-functions.md](../business-functions.md) and are detailed
in the [workflows/](../workflows/) directory.

| Function | Current owner | Target automation | Detail | Workflow docs |
|---|---|---|---|---|
| **Patient Operations** | Care Coordinators | 🤝 Agent-assisted | [patient-ops.md](functions/patient-ops.md) | [01](../workflows/01-patient-operations.md) |
| **Clinical Care** | RDNs, BHNs | 🤝 Agent-assisted | [clinical-care.md](functions/clinical-care.md) | [02](../workflows/02-clinical-care.md) |
| **Meal Operations** | Kitchen partners + Coordinators | 🤝 Agent-assisted | [meal-ops.md](functions/meal-ops.md) | [03](../workflows/03-meal-operations.md) |
| **Partner & Payer Relations** | Vanessa, Aaron | 🚫/🤝 Mixed | [partner-payer.md](functions/partner-payer.md) | [04](../workflows/04-partner-payer-relations.md) |
| **Revenue Cycle & Billing** | Admin | 🤖 Automated (with gates) | [revenue-cycle.md](functions/revenue-cycle.md) | [05](../workflows/05-revenue-cycle.md) |
| **Compliance & Regulatory** | Cross-functional | 🤖/🤝 Mixed | [compliance.md](functions/compliance.md) | [06](../workflows/06-compliance.md) |
| **Risk Management & Quality** | Clinical team | 🤝 Agent-assisted | [risk-quality.md](functions/risk-quality.md) | [07](../workflows/07-risk-management.md) |
| **Internal Operations** | All founders | 🤝 Agent-assisted | [internal-ops.md](functions/internal-ops.md) | [08](../workflows/08-internal-operations.md) |
| **Business Development** | Vanessa, Aaron | 🚫/🤝 Mixed | [business-dev.md](functions/business-dev.md) | [09](../workflows/09-business-development.md) |
| **Data, Analytics & Research** | Andrey + agents | 🤖 Automated (reports) / 🤝 (research) | [data-analytics.md](functions/data-analytics.md) | [10](../workflows/10-data-analytics-research.md) |

### Cross-cutting functions

These span multiple service delivery domains and don't map cleanly to a single workflow doc.

| Function | Current owner | Target automation | Detail | Notes |
|---|---|---|---|---|
| **Patient Experience** | Distributed (no owner) | 🤖/🤝 Mixed | [patient-experience.md](functions/patient-experience.md) | Cross-cuts Patient Ops, Clinical Care, Meal Ops |
| **Customer Success** | Vanessa, Aaron | 🤝 Agent-assisted | [customer-success.md](functions/customer-success.md) | Activates at 5+ partners |
| **Clinical Education** | Not active | 🤝 Agent-assisted | [clinical-education.md](functions/clinical-education.md) | Activates with first clinical hire |

---

## Agent coverage map

> Canonical source: [`topology.yaml`](../topology.yaml) → generated in [`topology.md`](../topology.md).
> See the [Org Function → Agent Coverage](../topology.md#org-function--agent-coverage) diagram for the full interactive view.

**Gaps visible from this map:**
- All 7 company infrastructure functions have zero dedicated agent coverage (Info Security shares AuditMonitor with Compliance)
- Partner & Payer, Business Development, Customer Success, and Clinical Education have no dedicated agents
- Communication agent serves patient comms but not partner/payer comms
- Reporting agent covers data/analytics but not executive reporting or board prep
- No agent for financial planning, budgeting, or forecasting (FinancialOrchestrator handles revenue cycle only)
- Patient Experience has partial coverage (AVA, RiskScoring, Reporting) but no dedicated experience agent

---

## How to use this chart

**For prioritization:** Start from the leaves — functions with well-defined I/O and minimal
judgment calls automate first. Functions that are mostly coordination and relationships
(executive, business dev, partner relations) automate last or become the human-in-the-loop
checkpoints.

**For implementation:** Each function file is self-contained. An agent working on revenue
cycle automation reads `functions/revenue-cycle.md` and the linked workflow doc — it doesn't
need to load the full org chart.

**For gap analysis:** Compare what's in the agent framework against this chart. Any function
without agent coverage is either a gap to fill or a deliberate choice to keep human.

---

## Keeping this chart current

This chart is the source of truth for "what does the company do and who/what does it."
It must be updated when:

- A new function or sub-function is identified
- Ownership changes (human → agent, or vice versa)
- Automation status changes (designed, implemented, live)
- A new agent or workflow is added to the framework
- A function is retired or consolidated

See the agentic trigger in [CLAUDE.md](../CLAUDE.md) — any change to workflows, roles,
or agent specs should prompt a check of this chart.
