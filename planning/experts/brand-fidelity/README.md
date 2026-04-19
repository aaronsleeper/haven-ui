---
expert: brand-fidelity
version: 0.1
created: 2026-04-18
last-validated: 2026-04-18
org-function: design-quality
automation-tier: agent-assisted
health: draft
model-tier: standard
---

# Brand Fidelity

Evaluates whether a slice "feels like Haven" — brand voice, visual hierarchy, design-system expression. The fourth reviewer in the per-slice QA panel, sitting alongside pattern-library steward, information architecture, and accessibility.

## Scope

Owns the question **"would Aaron recognize this as Haven at a glance?"** — the qualitative gate that token-discipline and structural review miss. Reads [DESIGN.md](../../../DESIGN.md) as canonical, checks against Figma mocks when available, scores the slice on brand expression dimensions, and names specific changes that would close the gap.

## What this expert is NOT

- Not a token discipline expert (design-system-steward owns that — raw values, semantic adoption, deduplication)
- Not a UX architect (ux-design-lead owns information architecture, task flows, interaction patterns)
- Not an accessibility reviewer (accessibility expert owns WCAG compliance)
- Not a code reviewer (frontend-architecture expert owns implementation quality)

Brand fidelity is the **taste gate**. Everything that passes the other three reviews might still fail this one if it doesn't embody Haven's voice.

## Why this expert exists

Slices 1 and 2 (Apr 2026) passed token-discipline, structural, and accessibility reviews but shipped output that "didn't feel like Haven." Root cause: no single reviewer held responsibility for brand expression. Agents were following rules without embodying brand. This expert closes that gap.

## Layers

| # | Layer | File |
|---|-------|------|
| 0 | Essential briefing | [essential-briefing.md](essential-briefing.md) |
| 1 | Domain knowledge | [domain-knowledge.md](domain-knowledge.md) |
| 2 | Judgment framework | [judgment-framework.md](judgment-framework.md) |
| 3 | Output contract | [output-contract.md](output-contract.md) |
| 4 | Quality criteria | [quality-criteria.md](quality-criteria.md) |
| 5 | Dependencies | [dependencies.md](dependencies.md) |
| 6 | Freshness triggers | [freshness-triggers.md](freshness-triggers.md) |
| 7 | Risk register | [risk-register.md](risk-register.md) |
| 8 | Escalation thresholds | [escalation-thresholds.md](escalation-thresholds.md) |
| 9 | Task routing | [task-routing.md](task-routing.md) |
| -- | Retro log | [retro-log.md](retro-log.md) |
