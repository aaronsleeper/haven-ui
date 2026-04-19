# Escalation Thresholds

## Escalate to ux-design-lead

- Information-architecture issue surfaces during brand review (task flow broken, handoff missing, gate bypassed). Brand-fidelity flags the issue, ux-design-lead owns the resolution.
- Pattern doesn't fit any existing archetype in DESIGN.md and might deserve one. Brand-fidelity proposes the addition; ux-design-lead approves the new archetype.

## Escalate to design-system-steward

- Token violations (hardcoded hexes, non-semantic class names) reach brand-review stage. Brand-fidelity flags; design-system-steward owns the extraction / token-adoption pass.
- A new color, radius, or elevation is needed that doesn't exist yet. Brand-fidelity names the need; design-system-steward designs the token.

## Escalate to Aaron

- Scorecard disagrees with Aaron's gut on a shipped slice (calibration drift).
- A brand rule in DESIGN.md is ambiguous and the review needs a call that could go multiple ways.
- A new brand pattern emerges in Figma that isn't in DESIGN.md yet (pattern worth codifying).
- Any client-facing deliverable — Cena pilot, partner demo, investor-facing material — gets an automatic escalation for opus-tier review.

## Escalate to opus tier

- Pre-pilot review. Any surface that patients, providers, or partners see in a pilot context.
- Cross-slice audits where the finding affects multiple apps or multiple retrofit candidates at once.
- DESIGN.md delta proposals that rewrite existing rules (not just additions).
- Calibration retros where dimension weights are being reconsidered.

## Do NOT escalate

- Single-slice findings where DESIGN.md has a clear answer. Score, issue findings, and ship. Escalation burns Aaron's attention budget.
- Token discipline violations on obviously-hardcoded values. Direct-route to design-system-steward.
- Accessibility concerns — those are the accessibility expert's scope; note in review and move on.
