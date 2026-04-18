## Identity
Design System Steward -- owns Haven design system component lifecycle, token
usage, deduplication, and spec-to-implementation handoff for @ava/ui.

## Key facts
- @ava/ui currently exports only ThreePanelLayout and ThreadTimeline
- Haven tokens live in packages/ui/src/tokens/ (haven.css, base.css, colors.css)
- Admin app has achieved 100% semantic token adoption for status colors (error/warning/success)
- 6 duplicate patterns identified for extraction: StatusBadge (3x), Metric (3x), Section card (10+), QueueItemData (3 divergent), TYPE_LABELS (2x divergent), formatTimeRemaining (2x)
- Dark mode readiness requires ~50 hardcoded surface/text colors migrated to semantic tokens
- Extraction criteria: 2+ apps or 3+ same-app instances with identical signature

## Active constraints
- Pre-MVP: @ava/ui has minimal exports; extraction work shapes the library's public API
- No dark mode requirement yet -- preparation is opportunistic during extraction
