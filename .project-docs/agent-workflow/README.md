# Agent Workflow — README

This folder contains the UX design-to-build pipeline for haven-ui. It was developed in a prior project (`cena-health-spark/haven-tailwind-theme`) and migrated here with path and structure updates to match haven-ui conventions.

## What This Is

A chain of agent skills that moves a feature from user research through implementation-ready build prompts. Each skill produces a file artifact that the next skill consumes. Aaron reviews at three gate checkpoints.

## Folder Contents

| File | Purpose |
|------|---------|
| `README.md` | This file |
| `ux-workflow.md` | Full workflow definition, gate formats, file structure, invocation rules |
| `skills/ux-architect.md` | Phase 1-3: Discovery, Functional Spec, IA (generative) |
| `skills/ux-wireframe.md` | Text-based screen specs: layout zones, components, interactions, states (generative) |
| `skills/ux-design-review.md` | Pre-build wireframe review + post-build validation (generative) |
| `skills/haven-mapper.md` | Maps wireframes to Haven components (deterministic) and specs new components (generative, gated) |
| `skills/dev-tasker.md` | Generates sequential build prompts for Claude Code (deterministic; tags each prompt generative/deterministic) |
| `skills/ui-react-porter.md` | Mechanically ports a pattern-library HTML component to React 1:1 (deterministic; fails on any required judgment) |
| `skills/debrief-capture.md` | Writes build lessons to prompts-library.md and decisions-log.md (deterministic) |

## Pipeline Summary

```
Feature description (Aaron)
  → ux-architect       [Gate 1: scope + IA review]
  → ux-wireframe
  → ux-design-review (pre-build)   [Gate 2: wireframe + copy review]
  → haven-mapper
  → dev-tasker         [Gate 3: build plan confirmation]
  → Claude Code builds
  → ux-design-review (post-build)
  → debrief-capture
```

## Key Path Changes vs. Prior Project

The skills were written against `cena-health-spark/` paths. In haven-ui:

| Old path | haven-ui equivalent |
|----------|---------------------|
| `design/[app]-app/` | `apps/[persona]/` |
| `design/personas/` | `packages/design-system/src/data/personas/` |
| `design/references/` | `packages/design-system/src/data/shared/` |
| `haven-tailwind-theme/styles/tokens/components.css` | `packages/design-system/src/styles/tokens/components.css` |
| `haven-tailwind-theme/CLAUDE.md` | `CLAUDE.md` |
| `.project-docs/prompts/next-task.md` | `.project-docs/prompts/next-task.md` (same) |
| `haven-tailwind-theme/examples/` | `packages/design-system/pattern-library/components/` |

## How to Invoke

1. Read `ux-workflow.md` to understand the full pipeline and gate formats.
2. Read the relevant skill file before executing that phase.
3. Produce outputs in `apps/[persona]/design/` (create if it doesn't exist).
4. Pause at each gate with the structured summary format from `ux-workflow.md`.
