---
name: Andrey
status: active
roles: [admin]
---

# Andrey

Co-founder. CTO and engineering lead. Owns engineering architecture, information
security, data infrastructure, and implementation decisions. The authority for
technical feasibility and system architecture.

## Role mapping

| Role (from `roles/*.md`) | Context |
|---|---|
| Admin | Early-stage — holds admin role until dedicated staff are hired |

## Expert relationships

| Expert | Relationship | What this means |
|---|---|---|
| **UX Design Lead** | Gate approver | Approval interaction model changes, engineering feasibility assessments |
| **Clinical Care** | Assumption validator | A2 (EHR integration specifics) — Andrey knows which systems are connected and what structured data is available |
| **All experts** | Gate approver (Constitutional) | Constitutional governance changes require Andrey (with Aaron + Vanessa for safety) |
| **All experts** | Architecture reviewer | Reviews architectural decisions that affect expert system implementation |
| **QA** (planned) | Reviewer | Will co-own when built — test infrastructure is engineering-dependent |

## Notification preferences

| Tier | Channel | Timing |
|---|---|---|
| Gate | In-app queue + Slack | During working hours |
| Notify | In-app feed | Batched |
| Escalate (system) | Slack + SMS | Immediate — system errors and P1 incidents |

## Capacity

`available` — Engineering lead. On-call rotation with Aaron for P1 incidents
(weekly rotation per AD-07, pending Andrey's review). Primary constraint:
implementation work will compete with review load as system moves to build phase.

## Onboarding status

| Item | Status |
|---|---|
| Role briefing | N/A — founder |
| Expert relationships | Partial — aware of expert system, has not deeply reviewed expert specs |
| Gate orientation | Pending — will need walkthrough when gate system is implemented |
| Current expert state | Pending review — decisions.md items AD-04, AD-05, AD-07 awaiting his CTO review |
| Assumption validation | Pending — Clinical Care A2 (EHR integration) flagged for his validation |
| Active workflows | Familiar with architecture docs, not deeply engaged with workflow specs |

## Pending decisions (blocking)

- AD-04: Multi-tenancy model (shared DB + tenant_id + RLS)
- AD-05: Data separation hybrid model (clinical Postgres → BigQuery ETL)
- AD-07: Engineering on-call policy

## Open questions owned

- OQ-02: LLM BAA execution (in progress)
- OQ-38: Engineering on-call for P1 incidents
- OQ-42: Data warehouse architecture
