---
fragment_id: 02-decision-severity-assessment
type: decision
x_cena_actor: agent
x_cena_watches: clinical-lead
x_cena_uncertainty: gap
gaps:
  - severity tier boundaries (red/yellow/green specific score ranges) pending Marrero
  - answer-pattern overrides into higher tier pending Marrero
branches:
  - condition: critical (immediate safety concern)
    target: 03-attestation-clinical-lead-review
    x_cena_severity: red
    label: red — same-hour escalation
  - condition: high (same-day attention)
    target: 03-attestation-clinical-lead-review
    x_cena_severity: yellow
    label: yellow — same-day escalation
  - condition: moderate (next-business-day RD follow-up)
    target: out-of-scope-rd-followup
    x_cena_severity: green
    label: green — RD follow-up
default: 03-attestation-clinical-lead-review
---

# Decision: Severity assessment

The agent classifies the positive response into a severity tier based on score, answer pattern, and history. Three tiers route the case to different destinations:

## Severity tiers (TBD pending Marrero)

- **Red — Critical.** Suicidal ideation present (Q9 > 0) or score in severe range [TBD: 20-27 typical]. Same-hour clinical escalation. Routes to attestation-gate for clinical-lead review.
- **Yellow — High.** Moderate-severe range [TBD: 15-19 typical] or rapid score change since prior screening. Same-day clinical attention. Routes to attestation-gate for clinical-lead review.
- **Green — Moderate.** Mild-moderate range [TBD: 10-14 typical], stable trajectory. Next-business-day RD follow-up; no escalation. Routes out of this use case to RD recurring assessment.

## Open questions for Marrero

- Specific tier boundary scores
- Answer-pattern rules that promote a case to a higher tier (e.g., specific Q3 sleep + Q7 concentration combination)
- Whether "rapid score change" is part of red/yellow logic or a separate flag

## Who watches

Clinical lead reviews any case where the classification routes to attestation-gate (red or yellow). Green cases route to RD follow-up without escalation; the clinical lead reviews aggregated green cases as part of weekly review (not per-case).

## Authoring note (Cena-internal)

This fragment exercises:

- `type: decision` — PROforma decision primitive
- `x_cena_uncertainty: gap` — entire tier-definition logic is a known gap
- Multiple branches with `x_cena_severity` — typed edges carrying severity metadata for diagram rendering
