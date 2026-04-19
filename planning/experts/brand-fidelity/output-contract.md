# Output Contract

## Brand fidelity review

Produced on every slice as the fourth reviewer in the per-slice QA panel.

| Field | Format | Description |
|---|---|---|
| Verdict | `ship` / `iterate` / `block` | Scorecard-derived |
| Score | X/10 + per-dimension breakdown | 5 dimensions × 2 pts each |
| Findings | Bulleted list, each tied to a dimension and a specific file/line/Figma frame | Observed gaps with precise attribution |
| Required changes | Ordered list of specific edits | Actionable edits with file paths + token replacements |
| Optional polish | Ordered list | Non-blocking improvements for later |
| Figma references | List of Figma URLs consulted | With node-id for each frame |
| DESIGN.md references | List of section anchors | e.g., `DESIGN.md §Primary teal discipline` |

**Consumers:** slice author (frontend engineer), ux-workflow facilitator, Aaron on escalation.

## Brand consistency report

Produced on demand — cross-slice audit of a specific brand dimension (e.g., "how is primary teal being used across all current apps?").

| Field | Format | Description |
|---|---|---|
| Dimension audited | Named dimension from DESIGN.md | e.g., "Ava identity treatment" |
| Samples inventoried | Table: location, observed treatment, expected treatment | All instances across the codebase |
| Violations | Count + location list | Specific regressions |
| Root cause hypothesis | Prose | Why the pattern drifted (e.g., missing lint rule, unclear docs) |
| Proposed mitigation | Bulleted list | Lint rule, DESIGN.md clarification, retrofit scope |

**Consumers:** design-system-steward, ux-design-lead, Aaron.

## DESIGN.md delta proposal

Produced when reviewing exposes a gap in DESIGN.md itself (a pattern not documented, a rule that needs sharpening).

| Field | Format | Description |
|---|---|---|
| Gap | Section heading proposed | Where in DESIGN.md the addition lands |
| Trigger | Prose | What slice / review surfaced the gap |
| Proposed text | Draft DESIGN.md prose | Ready to paste |
| Figma evidence | URL(s) | Frames supporting the proposal |

**Consumers:** DESIGN.md editor (typically Aaron + Claude), tracked in `DESIGN.md` change log at haven-ui repo root.
