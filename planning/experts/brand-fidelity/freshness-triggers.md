# Freshness Triggers

## Re-sync when

- **Figma design-system file changes** — any new component, token, or spec update. Re-pull via MCP and diff against DESIGN.md.
- **DESIGN.md updates** — re-read before the next review.
- **New app in scope** — when a new app (provider, kitchen, patient beyond what's shipped) enters slicing, pull its Figma frames and add persona-specific notes to domain-knowledge.md.
- **Slice retrofit** — when a past slice is retrofitted against new DESIGN.md rules, score both the original and the retrofit to calibrate gap size.
- **Aaron changes his mind** — any time Aaron sharpens, relaxes, or reverses a brand rule, update DESIGN.md first, then this expert's judgment-framework.md if the change affects scoring.

## Retro cadence

Every 5 slices reviewed, read retro-log.md and check calibration:

- Are scores tracking Aaron's post-ship feedback?
- Are the 5 dimensions weighted right, or should one be split / merged?
- Are patterns of "iterate → ship" revealing DESIGN.md gaps?

## Staleness signals

- A DESIGN.md rule hasn't come up in any review for 10 slices → the rule may be implicitly universal (promote to build-time lint) or obsolete (retire)
- Brand-fidelity score correlates poorly with Aaron's post-ship reaction → calibration broken; escalate to Aaron for recalibration session
- A dimension always scores 2/2 → no signal; consider replacing with a tighter dimension
- A dimension always scores 0/2 → systemic issue upstream; escalate to ux-design-lead or design-system-steward
