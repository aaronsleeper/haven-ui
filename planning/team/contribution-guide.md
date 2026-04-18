# Project Ava — Contribution Guide

*Last updated: 2026-04-10*

## How contributing works right now

Ava is in planning phase. Contributing means reviewing proposals, answering domain questions, and validating assumptions — not writing code. Domain experts draft recommendations with tradeoff analysis; your job is to review and decide, not to reason from scratch.

**Important context:** Cena is pre-revenue with no contracted projects yet. Many of the questions in pending proposals don't have definitively "right" answers — they depend on client needs we haven't encountered yet. What we need from reviews is a defensible starting position, not a permanent decision. Approve what's good enough to build against; flag what would be dangerous to get wrong. Everything else can be revisited when real workflows tell us what needs to change.

---

## Andrey — Platform & Infrastructure

Your primary contribution is reviewing expert-drafted architectural proposals. Three decisions have been **provisionally accepted** — we're building against them, but your review can still override or modify.

### Provisional decisions (review welcome)

| Decision | What we're building against | What your review can change |
|---|---|---|
| **AD-04: Multi-tenancy** | Shared DB with tenant_id + Postgres RLS | Isolation model, ORM approach, migration triggers |
| **AD-05: Data separation** | Clinical Postgres DB + BigQuery ETL for research | ETL boundary, de-identification method, BigQuery vs. alternatives |
| **AD-07: On-call policy** | Aaron/Andrey rotation, 15-min ack SLA, auto-escalation | Availability model, tooling, SLA thresholds |

These are provisionally accepted as of 2026-04-10 so they don't block Phase 2 work. Your review replaces the default — no sunk cost.

### How to review

Each proposal arrives as a document with:
- **What we recommend** and why
- **What we considered** and why not
- **What breaks if we're wrong** (reversibility assessment)
- **What we need from you** — approve, modify, or reject with rationale

Your response can be as brief as "approved" or "approved with change: X." The expert updates the decision log and cascades changes to dependent docs.

### Ongoing role

Once initial decisions are made, you'll review implementation-phase architecture: agent framework implementation spec, thread engine design, expert runtime spec. Same pattern — proposals come to you, not blank pages.

---

## Vanessa — Operations & Compliance

Your primary contribution is reviewing expert-drafted answers to compliance and revenue cycle questions. Seven questions are pending — each will come as a structured proposal based on regulatory research and operational analysis.

### Pending proposals

| Question | Domain | What the expert drafts |
|---|---|---|
| **OQ-07** | HEDIS data model timing | When to design HEDIS data model relative to first VBC contract |
| **OQ-08** | Shared savings disputes | Who owns payer disputes, what the escalation path looks like |
| **OQ-25** | Medicare MNT visit caps | Whether care plan cadence accounts for 3+2/year limits |
| **OQ-27** | Timely filing deadlines | Payer-by-payer filing deadline map |
| **OQ-28** | Kitchen partner BAAs | Which kitchen partners need BAAs for diagnosis-linked dietary orders |
| **OQ-40** | Grant PI strategy | Whether UConn is structured to serve as PI on federal grants |
| **OQ-41** | Pricing model | Standard PMPM rates and shared savings splits vs. case-by-case |

### How to review

Each proposal arrives with:
- **Our best understanding** based on research and operational context
- **What we're uncertain about** and what would change the answer
- **What we need from you** — confirm, correct, or flag what we're missing

Some answers may be "we don't know yet and here's when we'll know." That's a valid response — it lets us plan around the uncertainty instead of being blocked by it.

### Ongoing role

As the expert system matures, you'll validate operational assumptions: how workflows match reality, where the automation boundaries feel right or wrong, whether the agent-human handoff points make sense for clinical staff.

---

## Aaron — Product & UX

You're already embedded in this — leading the planning, building expert specs, prototyping UI. Your contribution guide is the working docs themselves.

### Current focus

- Phase 2 implementation bridge: data model validation, agent framework spec, thread engine spec
- Build Meal Operations expert (highest-severity coverage gap from feature-expert mapping)
- Polish the admin app prototype, then build provider/patient/kitchen surfaces
- Drive remaining open questions to resolution through expert-drafted proposals

---

## General: How the expert system works for reviewers

The expert system follows one pattern: **experts propose, humans dispose.**

1. A domain expert analyzes the question using project context, regulatory research, and architectural constraints
2. The expert drafts a recommendation with tradeoff analysis
3. The recommendation lands in your review queue with clear context and a specific ask
4. You approve, modify, or reject — with as much or as little rationale as you want
5. The decision is recorded, and dependent docs are updated automatically

You never need to start from a blank page. Your time is spent on judgment, not research.

---

*Source of truth for open questions: [open-questions.md](../open-questions.md). For decisions: [decisions.md](../decisions.md).*
