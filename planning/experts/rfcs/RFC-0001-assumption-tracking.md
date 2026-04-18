---
id: RFC-0001
title: Assumption tracking convention for domain knowledge
author: Clinical Care expert creation (Aaron + Claude)
status: accepted
tier: major
created: 2026-04-06
decided: 2026-04-06
---

## Problem

Experts are authored before all institutional knowledge is available. The Clinical
Care expert was blocked on "domain research needed (Vanessa input)" — but the real
authority is a Clinical Operations Director role that doesn't exist yet, and the
answers will vary by study cohort. The current `[STAKEHOLDER GAP]` convention marks
knowledge as missing and stops. There is no convention for: "here's our best educated
guess, keep moving, flag it for validation when the authority arrives."

This is not unique to Clinical Care. Every expert bootstraps with theoretical
knowledge that institutional reality will refine. UX Design Lead has implicit
assumptions (density heuristics, approval card patterns) that are operating
unmarked. Future experts (Compliance, Design System Steward) will face the same
gap between published standards and Cena-specific application.

## Evidence

- Clinical Care expert creation (2026-04-06): 4 `[STAKEHOLDER GAP]` markers in
  `domain-knowledge.md` blocked forward progress. The gaps are not answerable by
  a single person — they require a role (Clinical Operations Director) and will
  vary by cohort. The expert cannot wait for this input without stalling all
  downstream work (care plan workflow shadowing, UX approval card design, meal
  prescription integration).

- UX Design Lead (2026-04-03): density heuristics (judgment-framework.md lines
  39-59) and approval card patterns are operating assumptions validated informally
  through use with Aaron, but not marked as assumptions or tracked for formal
  validation. If these were wrong, the retro log would eventually catch it — but
  there's no proactive mechanism to surface them for review.

- Shared principle #8 (degradation is visible, not silent): assumptions are a
  form of knowledge degradation — higher confidence than a gap, lower confidence
  than validated institutional knowledge. The principle already requires visibility
  for degradation; assumptions are an unmarked category.

## Proposal

Add an **Assumptions** convention to expert-spec.md Layer 1 (Domain Knowledge).
Not a new layer — a specification for how domain knowledge handles uncertainty
within the existing layer structure.

### Marker convention

Replace `[STAKEHOLDER GAP]` (which signals "stop") with `[ASSUMPTION]` (which
signals "proceed with this, validate later"):

```
| `[ASSUMPTION]` Cena MNT caloric targets | Diabetes: 1500-1800 kcal/day for BMI > 30, 1800-2200 for BMI <= 30. CKD: per KDOQI staging table. | ADA Standards of Care 2026 + KDOQI guidelines (published, not Cena-specific) | ~2 years | Clinical Operations Director or study protocol |
```

Each assumption entry includes five fields:
1. **Knowledge area** — prefixed with `[ASSUMPTION]` marker
2. **What specifically** — the assumed value, stated as if it were known
3. **Source** — basis for the assumption (published guideline, workflow doc,
   clinical domain knowledge, analogous practice)
4. **Shelf life** — how long the assumption is defensible without validation
5. **Validates by** — the role or event that can confirm or replace this
   assumption (role, not person)

### Assumptions index

Each domain-knowledge.md file that contains assumptions includes a summary
section at the bottom:

```markdown
## Assumptions index

| # | Assumption | Basis | Validates by | Status |
|---|---|---|---|---|
| A1 | Cena MNT caloric targets follow published ADA/KDOQI guidelines | ADA 2026, KDOQI | Clinical Ops Director | Unvalidated |
| A2 | EHR integration provides structured labs at intake | Workflow 1.4 design | Engineering (Andrey) | Unvalidated |
```

Status values: `unvalidated` (default), `validated` (authority confirmed),
`revised` (authority changed the assumption — update the knowledge entry),
`retired` (assumption no longer relevant).

### Lifecycle

1. **Authored** — expert author makes best educated guess, marks it, cites basis
2. **Operated on** — expert uses the assumption in outputs (care plans, reviews).
   Outputs that depend on assumptions carry a note in their confidence signal
3. **Retro signal** — if outputs based on assumptions get overridden at human
   gates, the retro log captures whether the override was assumption-related.
   Recurring overrides on the same assumption are a signal to revise the guess
   before formal validation
4. **Validated** — when the validating role/event arrives, they review the
   assumptions index and confirm, revise, or retire each entry
5. **Absorbed** — validated assumptions lose their marker and become regular
   domain knowledge. Revised assumptions update the knowledge entry and log the
   change in the retro log

### Freshness trigger integration

"Validating role hired" or "study protocol published" is a freshness trigger
that fires once. When it fires, the assumptions index becomes the validation
checklist — the new authority reviews it as part of onboarding.

Add to freshness-triggers.md:

```
| Validating authority arrives | Hiring / protocol publication | All assumptions pending that authority's validation | Direct notification | Once per authority |
```

### Interaction with confidence signaling

Outputs that materially depend on unvalidated assumptions should note this in
their confidence signal. This is not an automatic downgrade — an assumption
based on published ADA guidelines may warrant `high` confidence for a standard
diabetic patient. But it should be visible:

```
confidence: high
assumption_dependencies: [A1 — Cena caloric targets assumed from ADA guidelines]
```

Downstream steps (including human gates) can see which assumptions underpin the
output and apply their own judgment.

### Interaction with shadowing

During shadow runs (per `shadowing-protocol.md`), comparison analysis should
track whether assumption-dependent outputs diverge from the live path more than
non-assumption outputs. If they do, the assumptions are miscalibrated — revise
before graduation, don't wait for the validating authority.

## Affected specs

- `experts/expert-spec.md` — Layer 1 (Domain Knowledge): add Assumptions
  convention after Reference sources section
- `experts/expert-spec.md` — Layer 6 (Freshness Triggers): add note about
  validating authority as a trigger type
- `experts/shared-principles.md` — no change needed; principle #8 already
  covers this conceptually

## Affected experts

- `experts/clinical-care/domain-knowledge.md` — replace `[STAKEHOLDER GAP]`
  markers with `[ASSUMPTION]` markers containing assumed values; add assumptions
  index
- `experts/ux-design-lead/domain-knowledge.md` — audit for implicit assumptions
  that should be marked (future task, not blocking)

## Trade-offs

- **Risk of false confidence:** Assumptions that look like knowledge could be
  treated as validated prematurely. The `[ASSUMPTION]` marker and assumptions
  index mitigate this, but only if authors and reviewers respect the convention.
  A marker that gets ignored is worse than a gap that blocks, because it creates
  invisible uncertainty.

- **Maintenance cost:** Each assumption is a thing to track. If an expert
  accumulates 20+ assumptions, the index becomes its own management burden.
  Mitigation: if assumptions dominate the domain knowledge, the expert probably
  shouldn't be built yet — the gap between theoretical and institutional
  knowledge is too wide for a defensible guess.

- **Premature operation:** An expert operating on many unvalidated assumptions
  may produce outputs that need significant revision post-validation, creating
  rework for downstream consumers who built against assumption-based outputs.
  Mitigation: confidence signaling makes assumption-dependence visible;
  downstream consumers can treat assumption-dependent outputs as provisional.

## Alternatives considered

1. **Keep `[STAKEHOLDER GAP]` and block** — Status quo. Expert cannot proceed
   until authority provides input. Rejected because the blocking authority (Clinical
   Operations Director) doesn't exist yet and the gaps vary by cohort — blocking
   means blocking indefinitely.

2. **Fill in values without marking them** — Fastest path forward but violates
   principle #8 (degradation is visible). Creates invisible assumptions that are
   indistinguishable from validated knowledge. Rejected — the whole point is
   transparency.

3. **Separate assumptions file per expert** — Assumptions live in their own file
   rather than inline in domain-knowledge.md. Rejected because assumptions are
   domain knowledge — they belong in the layer where they're used. A separate
   file creates a maintenance burden and makes it easy to read domain-knowledge.md
   without seeing the caveats.

4. **Track assumptions only in retro log** — Log the assumptions but don't mark
   them inline. Rejected because the retro log is a temporal record; assumptions
   need to be visible at the point of use, not just historically recorded.

## Decision (filled by reviewer)

**Status:** accepted
**Reviewer:** Aaron
**Rationale:** Every expert faces the bootstrapping gap between published guidelines and institutional knowledge. The convention is lightweight (marker + index, no new files/layers) and aligns with existing principle #8 (degradation is visible). Blocking on absent authorities stalls all downstream work.
**Modifications:** None — accepted as proposed.
