---
slot: 19
slot-name: acceptance-criteria (app-wide product-rule gate audit sub-step)
primary-author: QA Lead + clinical-care
project: cena-uconn-patient-app
created: 2026-05-24
status: in-review
consumes:
  - slots/_app/trigger-map.md
  - brief.md#scope-fences
inputs-hash: null
friction: []
pre-flight-authority: aaron
---

# App-wide Product-Rule Gate Audit

The slot-19 product-rule gate-audit sub-step, run **app-wide** (Phase 0) so no OPEN gate that blocks a v1 happy path enters build undecided. Closes the C5-Path blind spot: flow-completability ≠ product-rule-completeness — every decision gate a job crosses is **DECIDED** (cited) or **OPEN** (dependency named).

## Ratification (fresh-process)

This **ratifies** the validated prior `~/.claude/plans/ui-workflow-patient-gate-audit.md` (all 13 patient caps; DECIDED/OPEN with primary-source citations; matches `ui-workflow-meal-ordering-gate-map.md` rigor). The prior is sound and current (2026-05-24). It is **not** redone here (define-once — the prior owns the full per-cap tables). This artifact carries forward the **actionable headline**: the blocking-OPEN gates, their owners, and the routing for AM, plus the verify-time-sensitive-claims flags.

Per-cap detail (do not re-litigate): see the prior's §3 per-cap gate tables (cap-07 A1–A12, meal-ordering G1–G22, etc.) and §2 data-engineering collation.

## Blocking-OPEN gates — the actionable headline (would block a clean v1)

### → Vanessa (policy / contract / clinical)
- **B1 — Pricing model** (17/18/40/41): flat-per-meal vs. kitchen-cost+markup, and rounding. Until it lands, **every budget number on the patient surface is provisional.** `[VERIFY-primary-source]` on any displayed dollar figure.
- **B2 — Contract-required self-reported-outcome subset** (20): which of weight/A1C/BP/custom is *must-capture*. Blocks the My Health form spec.
- **B3 — Required vs. desired notification categories** (22): the concrete required set. Blocks the Activity notification trigger map + any push design.
- **B4 — Assessment re-surface cadence + "a while" resume threshold** (07): "every greeting until done" vs. "daily-max-once"; 7-day resume is a guess. Clinical preference may apply.

### → Andrey / data-architecture
- **B5 — Budget model = running weekly drawdown + spend granularity** (18/39/40). `[VERIFY]` $200/26-week.
- **B6 — Editable-order data model** (17/39/40/57): mutable records + spend recalc on edit + audit trail. **The central data-engineering gate.**
- **B7 — Athena↔Cena scheduling boundary** (21): request-only (Path A) vs. live slots (Path B). Blocks scheduling beyond a Path-A stub.
- **B8 — Consent surface conflict** (12): Andrey asserts CC+Athena own consent entirely; flow-onboarding designs a light in-app ack. **Resolve before building (or not building) a consent surface.**

### → Kitchen (Fire by Forge) / delivery partner
- **B9 — Kitchen change-order cutoff time** (17): exact cutoff is a placeholder. `[VERIFY]`.
- **B10 — Kitchen confirmation SLA** (38): "within a few hours" placeholder. `[VERIFY]`.
- **B11 — Pickup confirmation mechanism + grocery-vs-meal split** (37). `[VERIFY]`.

### → UX-design / product (smaller, still block a clean v1)
- **B12 — cap-38 patient status surface: keep / kill / redesign** (prior QR page: 3 clicks in 3 weeks, no retro).
- **B13 — Left-rail UX pattern (cross-flow)** — right-pane-on-click feels disjointed for nav-driven entries.

## The load-bearing block (for the data-arch conversation)

The **financial cluster (B1, B5, B6)** is load-bearing: budget display, enforcement, invoicing (42), reconciliation (43) all derive from `Program.budget_rule` + `Program.markup_rule` + a per-participant-per-week spend ledger. **B6 (editable orders)** turns a static ledger into a mutable-records + recalc + audit-trail problem — the non-obvious cost.

## Highest-stakes safety gap (carry separately)

- **A11 / distress-signal escalation** (07/27): no cap found; out of scope for the assessment flow as designed. The agent-detected distress-routing path is an **open agent-behavior spec → Vanessa + clinical.** The app keeps the patient-initiated "Talk to a person" path; the agent-detected path is unbuilt. This is below-the-line for any surface that conducts sensitive flows — must resolve before those surfaces build.

## Impact on formative work (what's buildable-spec vs. blocked)

- **Spec-complete now (DECIDED gates dominate):** Home (greeting/surfacing/tiles), assessments runner shape (A1/A3/A4/A5/A8/A9 DECIDED; no-score invariant firm), meal-ordering UX (G1/G3/G4/G5/G12–G19/G21 DECIDED), order-status transitions (G21), outcomes capture behavior (C3 DECIDED).
- **Spec-blocked on an OPEN gate (design around with a documented assumption; flag for AM):** displayed dollar figures (B1/B5), editable-order flows (B6), scheduling beyond request-stub (B7), whether a consent surface exists at all (B8), notification categories (B3), My Health required fields (B2), assessment re-surface cadence (B4).

These blocks gate **build**, not formative **design** — surfaces can be wireframed against a documented assumption (per the per-surface acceptance + a flagged OPEN), with the dollar/record/cadence specifics deferred to the resolving conversation.
