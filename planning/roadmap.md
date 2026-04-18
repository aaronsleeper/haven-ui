# Project Ava — Roadmap

> Where we are, where we're headed, and what depends on what.
>
> **Current state (2026-04-10):** Phase 0/1 substantially complete. 7 experts drafted,
> 2 workflow prototypes done, expert system infrastructure complete (10/10 patterns).
> AD-04/05/07 provisionally accepted. **Phase 2 (implementation bridge) complete** —
> all 5 deliverables shipped (feature mapping, data model validation, agent impl spec,
> thread engine spec, expert runtime spec). Next: Phase 3 (MVP build). Zero code yet.

---

## Phase 0: Foundation completion (current)

What must be true before experts can shadow against real workflows and before
implementation planning begins. These are system-level gaps in the planning layer.

| # | Item | What it solves | Status | Depends on |
|---|---|---|---|---|
| 0.1 | **Human-expert interface protocol** | No explicit rules for how humans and experts collaborate: how humans provide input, how experts surface decisions needing human action, how feedback flows back into expert calibration. The connective tissue between the expert system and the people who use it. | **Complete** — [human-expert-protocol.md](experts/human-expert-protocol.md). Human registry (`humans/`) not yet populated. | — |
| 0.2 | **Expert Operations expert** | No one manages expert lifecycle: onboarding, health checks, dependency graph maintenance, retro log sweeps. Currently manual. Planned in registry but unbuilt. | Not started | 0.1 (needs human-expert interface to define how Expert Ops interacts with human reviewers) |
| 0.3 | **Second workflow prototype** | care-plan-creation is the only workflow with full step-level detail. Need at least one more (likely meal-prescription or monitoring) to validate that workflow-spec.md generalizes. | **Complete** — [meal-prescription/](workflows/meal-prescription/). Validates workflow-spec.md with a different pattern: sequential pipeline, conditional-only gates, cross-domain handoff (Clinical Care → Meal Ops). | Clinical Care expert (done) |
| 0.4 | **Open questions resolution push** | 11 pending questions (OQ-07 through OQ-41), several blocking compliance and revenue cycle confidence. Need a structured pass to resolve or explicitly defer with rationale. | **Proposals drafted** — 7 OQ proposals ready in `team/proposals/` (OQ-07, 08, 25, 27, 28, 40, 41). Awaiting Vanessa review. Remaining 4 OQs (OQ-10, 16, 33, 38) are pending other reviewers. | Some require Vanessa, some require Andrey |
| 0.5 | **Architecture decisions — expert proposals** | AD-04 (multi-tenancy), AD-05 (data separation), AD-07 (on-call policy) need proposals drafted. Platform/Infrastructure expert (1.1) drafts recommendations; Andrey reviews. | **Provisionally accepted** (2026-04-10) — building against expert proposals. Andrey review still welcome; override replaces defaults. See `decisions.md`. | Platform expert (1.1) — done |

---

## Phase 1: Expert coverage expansion

Build the experts that unblock the most downstream work. Each expert follows
the full spec (9 layers + retro log) and enters at draft health status.

New pattern for Phase 1: domain experts draft proposals for pending decisions.
Humans review and approve instead of being the bottleneck. This applies Ava's
core principle — agents propose, humans dispose — to building Ava itself.

| # | Expert | Why next | Depends on | Unblocks |
|---|---|---|---|---|
| 1.1 | **Platform / Infrastructure** | Three architectural decisions (AD-04, AD-05, AD-07) are pending CTO review but can be drafted by an expert. Andrey reviews proposals instead of reasoning from scratch. Owns infrastructure architecture domain. | Architecture docs (available) | AD-04, AD-05, AD-07 decisions → Phase 2.2 (data model validation), Phase 2.3 (agent framework spec) |
| 1.2 | **Operations / Compliance** | Seven open questions (OQ-07, 08, 25, 27, 28, 40, 41) are pending Vanessa but can be researched and drafted by an expert. Owns compliance, revenue cycle, and operational policy domains. | Regulatory context (partially available from architecture/workflow docs) | Compliance confidence, revenue cycle design, partner/payer policy |
| 1.3 | **Compliance** | PHI rendering constraints, audit requirements, and consent scope rules are referenced by every clinical workflow and every expert that touches patient data. Operating without Compliance means every expert carries implicit compliance assumptions. | **Complete** — [compliance/](experts/compliance/). 598 lines, under budget. Owns structural HIPAA controls (field access matrix, consent scope, audit triggers, breach assessment). Distinct from Ops/Compliance (regulatory interpretation, BAA management). | UX Design Lead (PHI display), Clinical Care (consent scope), Revenue Cycle (future) |
| 1.4 | **Design System Steward** | UX Design Lead proposes components; nobody governs them. Token usage guidance, component dedup, and spec-to-implementation handoff are undefined. | Haven token usage guide authoring | UX Design Lead, Frontend Engineering (future) |
| 1.5 | **QA** | No expert validates that implementations match specs. Currently a gap between "design" and "verify." | Defined test infrastructure (can start with manual protocol) | UX Design Lead, Frontend Engineering (future) |
| 1.6 | **Patient Ops** | Orchestrates care-plan-creation and all Domain 1 workflows. Currently a planned expert referenced by many workflow steps but unbuilt. | **Complete** — [patient-ops/](experts/patient-ops/). 606 lines, under budget. Owns lifecycle state machine, review reconciliation, coordinator queue, stuck patient detection, discharge packaging. | Workflow execution, queue management, lifecycle orchestration |

---

## Phase 2: Implementation bridge

Translate planning docs into executable architecture. This is where project-ava
stops being a documentation project and starts informing code.

| # | Item | What it produces | Depends on |
|---|---|---|---|
| 2.1 | **Feature-to-expert mapping** | Cross-reference product-structure.md P0 features against expert registry. Which expert owns which feature? Where are coverage gaps? Which features have no expert and need one? | **Complete** — `feature-expert-mapping.md` |
| 2.2 | **Data model validation** | Verify architecture/data-model.md against workflow step inputs/outputs and expert output contracts. Ensure the data model can actually support what the workflows need. | **Complete** — `architecture/data-model-validation.md`. Found 4 missing entities, 2 cardinality errors, 4 field gaps. |
| 2.3 | **Agent framework implementation spec** | Translate architecture/agent-framework.md into technical implementation plan: which agents are Claude tool-use, which are orchestration code, which are deterministic functions. Map expert task-routing tiers to actual model calls. | **Complete** — `architecture/agent-implementation-spec.md`. 17 agents classified, 33 extraction candidates, GCP runtime patterns. |
| 2.4 | **Thread engine spec** | Detailed technical design for thread-as-audit-log: message types, storage, rendering, compliance logging, PHI handling. This is the backbone of the UI and compliance model. | **Complete** — `architecture/thread-engine-spec.md`. Firestore/Postgres split, approval gates, immutability guarantees. |
| 2.5 | **Expert runtime spec** | How expert specs translate to runtime behavior: context loading, selective layer loading, model tier routing, handoff envelope implementation, degradation signaling. The bridge between expert-spec.md and actual code. | **Complete** — `architecture/expert-runtime-spec.md`. Expert activation, selective loading, extraction coexistence, health gating. |

---

## Phase 3: MVP build

Code. Ordered by what unblocks the most downstream features.

| # | Item | Scope | Depends on |
|---|---|---|---|
| 3.1 | **Platform core** | Auth, tenant model, RBAC from role definitions, base data model | 2.2, 0.5 |
| 3.2 | **Thread engine** | Message storage, rendering, tool call logging, audit trail | 2.4, 3.1 |
| 3.3 | **Agent framework** | Orchestrator, specialist agents, QueueManager, AlertRouter | 2.3, 2.5, 3.2 |
| 3.4 | **Admin app — P0 features** | Patient queue, care plan review, scheduling, discharge | 3.1, 3.2, 3.3 |
| 3.5 | **Provider app — P0 features** | Clinical queue, patient records, care plan review, documentation | 3.1, 3.2, 3.3 |
| 3.6 | **Care-plan-creation workflow** | First live workflow — implements steps.md with expert integration | 3.3, Clinical Care + UX Design Lead experts |
| 3.7 | **Kitchen app — P0 features** | Order queue, delivery tracking | 3.1, 3.2 |
| 3.8 | **Patient app — P0 features** | Home dashboard, enrollment, appointments | 3.1, 3.2 |
| 3.9 | **AVA voice — initial** | Scheduled check-in calls | 3.3, Twilio integration (AD-03 done) |
| 3.10 | **Partner portal — P0** | Referral submission | 3.1 |

---

## Phase 4: Operational maturation

What happens after MVP is running with real patients.

| # | Item | What it solves |
|---|---|---|
| 4.1 | **Expert shadowing runs** | Graduate UX Design Lead and Clinical Care from draft to live using real workflow data per shadowing-protocol.md |
| 4.2 | **Assumption validation** | Clinical Ops Director (when hired) reviews assumptions index across all experts; study protocols override defaults per cohort |
| 4.3 | **Retro log maturation** | Experts accumulate real interaction data, self-assess, propose spec updates. The learning loop starts producing signal. |
| 4.4 | **360 peer reviews** | With 4+ experts live, the peer review system activates. Experts evaluate each other through their own quality criteria. |
| 4.5 | **System postmortem (first)** | First quarterly cross-registry retrospective per system-postmortem.md. Identifies cross-cutting themes across experts and workflows. |
| 4.6 | **Additional workflow prototypes** | Expand step-level workflow detail to remaining Domain 1 workflows (monitoring, scheduling, discharge) and Domain 3 (meal operations) |
| 4.7 | **Revenue cycle expert + workflows** | Billing, claims, denial management. High automation potential (~90%) but requires resolved compliance questions (OQ-07, OQ-08, OQ-25, OQ-27) |

---

## Phase 5: Scale

What emerges after the system is operational and learning.

- **Expert splitting** — experts that exceed 700-line budget or cover genuinely distinct sub-domains split per expert-spec.md criteria
- **Automation tier advancement** — functions move from agent-assisted to agent-primary as expert judgment calibrates and human override rates drop
- **Partner scaling** — multi-tenant operation, partner-specific workflow variants, cohort-specific assumption overrides
- **Research pipeline** — UConn IRB integration, de-identified data exports, outcomes analytics (Domain 10)
- **Deterministic extraction** — mature experts identify repeated mechanical work and extract it to scripts/functions per task-routing progression

---

## Cross-cutting concerns (every phase)

These aren't phase-gated — they apply continuously.

| Concern | How it's managed |
|---|---|
| **HIPAA compliance** | Structural, not procedural. Built into data model (minimum-necessary), thread engine (audit trail), and every expert's quality criteria. Compliance expert (1.1) owns the standard; all experts apply it. |
| **Governance** | RFC process (governance.md) for Major/Constitutional changes. Tier 1-2 changes are self-documenting. |
| **Expert health** | Monthly `/expert-update` sweeps check freshness triggers, run retro consolidation, calculate registry-wide context health. |
| **Open questions** | Tracked in open-questions.md. Resolved questions feed into relevant specs. Pending questions have named owners and blockers. |
| **Org chart sync** | Per CLAUDE.md agentic trigger: any workflow, role, or agent change checks and updates org/org-chart.md. |

---

## How to use this roadmap

- **Phase numbers indicate dependency order, not calendar dates.** Phase 1 can
  start before Phase 0 is fully complete — items within each phase have their
  own dependency declarations.
- **Items within a phase can run in parallel** unless a dependency is declared.
- **This document is the index, not the detail.** Each item, when started,
  gets its own spec or RFC as appropriate. The roadmap tracks what and why;
  the specs track how.
- **Update this document** when items complete, new items are identified, or
  dependencies change. It should always reflect current understanding.
