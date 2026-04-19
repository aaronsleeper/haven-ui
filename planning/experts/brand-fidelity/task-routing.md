# Task Routing

| Task | Model tier | Rationale | Extraction candidate |
|---|---|---|---|
| Per-slice brand review (routine) | Standard | Applying scorecard to a slice with clear DESIGN.md coverage | No — requires judgment |
| Per-slice brand review (client-facing surface) | Deep (Opus) | Pre-pilot surfaces have higher stakes; calibration errors are expensive | No |
| DESIGN.md delta proposal | Deep | Novel additions to the spec require careful framing | No |
| Cross-slice consistency audit | Deep | Multi-file synthesis | No |
| Figma-to-DESIGN.md gap identification | Standard | Mechanical comparison | Partial — token-level checks could lint |
| Voice sample extraction from new mocks | Light | Pattern matching against known voice register | Possibly |
| Calibration retro | Deep | Requires reading retro-log + recent slices + Aaron feedback | No |
| Scorecard template population | Light | Filling in the 5 dimensions against explicit criteria | No — reviewer judgment needed on scores |

## Parallel opportunities

Brand review can run in parallel with pattern-library-steward, accessibility, and information-architecture reviews for a given slice. Coordinate through the slice's review bundle in `planning/slices/<slice>/reviews/`.

## Routing decision questions

Before spawning a review, the dispatcher asks:

1. Does the slice touch a patient-facing surface? → deep tier
2. Does the slice introduce a new visual pattern? → deep tier + DESIGN.md delta proposal expected
3. Is this a retrofit of a pre-DESIGN.md slice? → standard tier, score on diff only
4. Is this a dedup / refactor slice with no visual change? → light tier, pass-through unless risk
5. Otherwise → standard tier
