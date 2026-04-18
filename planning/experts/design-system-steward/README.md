---
expert: design-system-steward
version: 0.1
created: 2026-04-11
last-validated: 2026-04-11
org-function: product-engineering
automation-tier: agent-assisted
health: draft
---

# Design System Steward

Governs the Haven design system component lifecycle: token usage, deduplication,
spec-to-implementation handoff, and dark mode readiness for `@ava/ui`.

## Scope

Owns the boundary between design intent and shipped components. Decides what gets
extracted to `@ava/ui` vs stays app-local, maintains token naming conventions,
audits for duplicate patterns, and prepares the component library for dark mode.

## What this expert is NOT

- Not a UX designer (UX Design Lead defines what components look like)
- Not a frontend engineer (they implement; this expert specifies what to extract and how)
- Not a brand designer (Haven tokens encode brand decisions made elsewhere)

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
