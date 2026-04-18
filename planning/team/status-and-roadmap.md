# Project Ava — Status & Roadmap

*Last updated: 2026-04-10*

## Where we are

**Business stage:** Cena Health is in-network with all major payers but pre-revenue — no contracted projects yet, pilots in planning. Many operational decisions are open questions dependent on actual client needs. This means: answers to pending proposals should be "good enough to move forward," not "permanent." We'll revisit when real workflows surface what needs to change.

**Project phase: Planning & documentation.** Zero code. The planning corpus is comprehensive — 125+ documents covering vision, architecture, workflows, expert system infrastructure, product structure, and user journeys. Two workflow prototypes are built at step level. Six AI experts are drafted. The gap is between planning and implementation.

**How we unblock:** When a question requires domain expertise the team doesn't have, we build or consult an expert agent to draft a defensible starting answer — then move forward. This is the core operating pattern, not a workaround. Agents hold more domain expertise across Cena's operational areas than our three-person team can. Every proposal drafted by an expert and reviewed by a human builds the trust evidence that this model works.

### What exists today

| Layer | What's built | Detail |
|---|---|---|
| **Vision & principles** | Complete | Core principles, decision filters, success criteria |
| **Architecture** | Complete | Agent framework, data model, UI patterns (3-panel layout) |
| **Product structure** | Complete | Module/feature/screen hierarchy with P0-P3 priorities |
| **Org design** | Complete | 10 domains, 55+ sub-functions mapped, automation readiness scored |
| **Workflows** | 10 domain-level + 2 step-level prototypes | Care-plan-creation and meal-prescription at full step detail |
| **User journeys** | 14 journey maps | Per-role: coordinator, RDN, patient, kitchen, partner |
| **Expert system infrastructure** | Complete | Spec templates, governance, shadowing, fallback modes, queue prioritization, shared principles, convocation protocol, human-expert protocol |
| **Experts (drafted)** | 7 of ~8 needed | UX Design Lead, Clinical Care, Platform/Infrastructure, Operations/Compliance, Compliance, Patient Ops, Meal Operations — all Draft status |
| **UI prototype** | Admin app prototype | Built in haven-ui with thread components, queue sidebar, morning summary |
| **Architectural decisions** | 4 decided, 3 provisionally accepted | AD-04/05/07 building against expert proposals; Andrey review welcome |
| **Feature-expert mapping** | Draft complete | 20 P0 features mapped; 1 high-severity gap (Meal Ops), 2 medium |

### What's blocking progress

| Blocker | Owner | Impact |
|---|---|---|
| OQ-07, 08, 25, 27, 28, 40, 41 proposals | **Drafted** — awaiting Vanessa review | Blocks compliance and revenue cycle confidence |
| OQ-10, 16, 33, 38 | Pending other reviewers (clinical ops director, Shenira, Andrey) | Various domain blocks |
| Expert coverage gaps | Aaron + Claude | Design System Steward, QA not yet built (both have blockers) |
| AD-04, AD-05, AD-07 | **Provisionally accepted** — Andrey review still welcome | No longer blocking Phase 2 |

---

## Roadmap

### Phase 0: Foundation completion (substantially complete)

| Item | Status |
|---|---|
| Human-expert interface protocol | **Done** |
| Expert Operations expert | Not started |
| Second workflow prototype (meal-prescription) | **Done** |
| Open questions resolution push | **Proposals drafted** — 7 OQ proposals awaiting Vanessa |
| Architecture decisions — expert proposals for Andrey | **Provisionally accepted** — building against; Andrey review welcome |

### Phase 1: Expert coverage expansion

Build experts that unblock the most downstream work. New pattern: domain experts draft proposals for pending decisions; humans review.

| Expert | Purpose | Status |
|---|---|---|
| **Platform / Infrastructure** | Draft proposals for AD-04, AD-05, AD-07. Own infrastructure architecture decisions. | **Done** — expert drafted, proposals ready for Andrey |
| **Operations / Compliance** | Draft proposals for pending Vanessa questions (OQ-07, 08, 25, 27, 28, 40, 41). Own compliance and revenue cycle domains. | **Done** — expert drafted, proposals ready for Vanessa |
| Compliance | PHI rendering, audit requirements, consent scope | **Done** — structural HIPAA controls, distinct from Ops/Compliance |
| Design System Steward | Component governance, token usage, spec-to-impl handoff | Not started |
| QA | Test against specs, visual review pipeline | Not started |
| Patient Ops | Care-plan orchestration, Domain 1 workflows | **Done** — lifecycle state machine, queue management, review reconciliation |

### Phase 2: Implementation bridge (active)

Translate planning into executable architecture. No longer blocked — AD-04/05/07 provisionally accepted.

| Item | Status |
|---|---|
| 2.1 Feature-to-expert mapping | **Draft complete** — [feature-expert-mapping.md](../feature-expert-mapping.md) |
| 2.2 Data model validation | Unblocked, not started |
| 2.3 Agent framework implementation spec | Unblocked, not started |
| 2.4 Thread engine spec | Unblocked after 2.2 |
| 2.5 Expert runtime spec | Unblocked after 2.3 |

### Phase 3: MVP build

Code. Platform core → thread engine → agent framework → app surfaces (admin, provider, kitchen, patient, partner) → first live workflow → AVA voice.

### Phase 4: Operational maturation

Expert shadowing against real workflows, assumption validation, retro logs, peer reviews, system postmortems.

### Phase 5: Scale

Expert splitting, automation tier advancement, multi-tenant operations, research pipeline.

---

*Source of truth: [roadmap.md](../roadmap.md). This is the team-readable summary.*
