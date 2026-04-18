# People & Culture

> Hiring, onboarding, performance, team health. Currently minimal at 3 founders,
> but this function scales with every hire and contractor relationship.

---

## Responsibilities

- Recruiting — sourcing, screening, interviewing, offer management
- Onboarding — new hire setup, training, access provisioning, culture integration
- Performance management — goal setting, reviews, feedback cycles
- HR administration — payroll coordination, benefits, leave tracking, policies
- Culture — values, norms, communication practices, team rituals
- Credentialing — clinical staff licensure verification and maintenance
- Contractor management — SOWs, access, deliverable tracking

## Sub-functions

| Sub-function | Owner today | Automation target | Notes |
|---|---|---|---|
| Job descriptions & postings | Vanessa | 🤖 Agent drafts from role specs | Structured input → structured output |
| Candidate sourcing | Not active | 🤝 Agent sources, human evaluates | LinkedIn, job boards, referral tracking |
| Interview scheduling | Not active | 🤖 Automated | Calendar coordination |
| Onboarding workflows | Ad hoc | 🤖 Automated checklists + provisioning | Account setup, training modules, intro scheduling |
| Credential verification | Vanessa | 🤖 Automated (API checks) | State license databases, NPI registry |
| Credential renewal tracking | Manual | 🤖 Automated alerts | Expiration monitoring + renewal reminders |
| Performance reviews | Not active | 🤝 Agent aggregates data, human evaluates | Combine project output, peer feedback, metrics |
| Policy documentation | Ad hoc | 🤖 Agent maintains from decisions | Living handbook generated from decisions |
| Payroll coordination | Vanessa | 🤝 Agent prepares, human approves | Interface with payroll provider |
| Leave tracking | Not active | 🤖 Automated | Calendar-based |
| Contractor SOW tracking | Ad hoc | 🤝 Agent tracks milestones, surfaces gaps | Deliverable deadlines, payment triggers |

## Interfaces

| Direction | Function | What flows |
|---|---|---|
| **From** | Executive | Headcount plan, hiring priorities |
| **From** | All functions | Hiring requests, performance signals |
| **From** | Compliance | Credentialing requirements, training mandates |
| **To** | All functions | Staffed and credentialed team members |
| **To** | Finance | Payroll data, contractor costs |
| **To** | Compliance | Credential status, training completion |
| **From** | Clinical Education | Training completion data, credential status |

## Current state (Cena Health, March 2026)

Three co-founders, no formal HR. Credentialing handled manually by Vanessa for
clinical partners (RDNs at UConn, Vanderbilt). No structured onboarding, performance
reviews, or policy documentation beyond what's in shared docs.

Key near-term hires: care coordinators, RDNs as patient volume grows.

## Quality checks

- Every clinical staff member credentialed and verified before patient access
- Credential expiration tracked with 90/60/30-day alerts
- Onboarding checklist completion verified before system access granted
- New hire has 1:1 with each founder within first week

## Automation roadmap

**Phase 1:** Credential verification and renewal tracking (high value, low complexity).
Onboarding checklists with automated provisioning.

**Phase 2:** Recruiting pipeline with agent-assisted sourcing and scheduling.
Performance data aggregation from project tools.

**Phase 3:** Predictive hiring — agent models capacity needs from patient volume
projections and surfaces hiring recommendations before bottlenecks form.

## Cross-reference

- Credentialing workflows detailed in [08-internal-operations.md](../../workflows/08-internal-operations.md)
- Clinical role definitions in [roles/](../../roles/)
