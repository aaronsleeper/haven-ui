# Haven UX Design & Build Workflow

## Purpose

This document defines the end-to-end workflow for designing and building new features, screens, and applications for Cena Health using the Haven design system. It orchestrates a chain of skills that move from user research through implementation-ready build prompts, with human checkpoints at key decision points.

## Generative vs deterministic — the classification model

Every task in the pipeline is tagged as one of two classes. The classification drives model routing, verification style, and what judgment is allowed in the output. **Hybrid tasks are forbidden** — if a task mixes the two, split it into atomic tasks (generative first, deterministic downstream).

| Class | Definition | Model | Judgment | Examples |
|---|---|---|---|---|
| **generative** | Output requires novelty — invent a layout, write copy, design a new component, reconcile a divergent pattern | opus | Yes, but every judgment is logged on the completion report and may be promoted to pattern-library or decisions-log entries | ux-architect, ux-wireframe, new-component spec in haven-mapper, ux-design-review, brand analysis |
| **deterministic** | Output is fully specified by inputs — copy a pattern-library HTML entry into React, map a wireframe element to an existing component, add a row to COMPONENT-INDEX, wire dummy data, run a build | sonnet (default) or haiku (trivial wiring) | No — if the completion report lists any judgment call, the task was misclassified; STOP and route back | dev-tasker output prompts (deterministic by construction), ui-react-porter, haven-pl-qa, debrief-capture, existing-component mapping in haven-mapper |

Structural enforcement makes the classification robust:

- `dev-tasker` refuses to emit a prompt referencing a semantic class not found in `components.css` or `COMPONENT-INDEX.md`. That is the single most common drift mode and it is blocked at prompt-generation time, not at review time.
- `haven-mapper` pauses at a **Gap Gate** before writing any new-component spec. A human has to approve that a generative step is warranted.
- `ux-wireframe` pauses at Gate 2 when any `[NEW COMPONENT: ...]` was flagged, so the wireframe's novelty is acknowledged before the pipeline proceeds.
- `ui-react-porter` fails if the React component it would produce requires any judgment — missing pattern-library HTML, missing class in components.css, missing COMPONENT-INDEX row. It does not "fix" gaps, it routes back.

The classification and structural enforcement exist because prior UI attempts produced far-from-optimal results when generative work sneaked into deterministic task slots. Making the distinction explicit and the enforcement mechanical is the quality lever.

## haven-ui Path Conventions

All paths in this document and the skill files use haven-ui conventions:

- **App screens:** `apps/[persona]/` (e.g., `apps/provider/`, `apps/kitchen/`, `apps/patient/`)
- **Design artifacts:** `apps/[persona]/design/` (create if not present)
- **Wireframes:** `apps/[persona]/design/wireframes/[screen-name].md`
- **Personas:** `src/data/personas/[persona]/`
- **Shared references:** `src/data/shared/`
- **Component source of truth:** `src/styles/tokens/components.css`
- **Pattern library:** `pattern-library/components/` and `pattern-library/COMPONENT-INDEX.md`
- **ANDREY-README:** `ANDREY-README.md` (repo root)
- **Build prompts:** `apps/[persona]/design/build/`
- **Active agent prompt:** `.project-docs/prompts/next-task.md`

## Workflow Overview

```
Feature Description (Aaron)
       │
       ▼
  ux-architect ──── Phase 1: Discovery
       │             Phase 2: Functional Spec
       │             Phase 3: Information Architecture
       │
  ═══ GATE 1 ═══ Aaron reviews scope & structure
       │
       ▼
  ux-wireframe ─── Screen specs using Haven components
       │
       ▼
  ux-design-review (pre-build mode) ─── Expert-informed review & revision
       │
  ═══ GATE 2 ═══ Aaron reviews wireframes & copy
       │
       ▼
  haven-mapper ─── Component inventory check, gap analysis, screen recipes
       │
       ▼
  dev-tasker ───── Sequential build prompts for Claude Code
       │
  ═══ GATE 3 ═══ Aaron confirms task list (lightweight)
       │
       ▼
  [Claude Code builds]
       │
       ▼
  ux-design-review (post-build mode) ─── Compare output to spec
       │
       ▼
  debrief-capture ── Update prompts-library + decisions-log
```

## Skill Chain

| Step | Skill File | Reads | Produces |
|------|-----------|-------|----------|
| 1 | `skills/ux-architect.md` | Feature description, `src/data/personas/`, `src/data/shared/` | Use cases, func spec, IA (`apps/[persona]/design/`) |
| 2 | `skills/ux-wireframe.md` | ux-architect outputs, IA, `pattern-library/COMPONENT-INDEX.md` | `wireframes/[feature]-screen-flow.md`, `wireframes/[id]-[name].md` per screen |
| 3 | `skills/ux-design-review.md` (pre-build) | Wireframes, use cases, personas | `review-notes.md`, revised wireframes |
| 4 | `skills/haven-mapper.md` | Wireframes, `src/styles/tokens/components.css`, `pattern-library/COMPONENT-INDEX.md` | `component-map.md`, `new-components/*.md` |
| 5 | `skills/dev-tasker.md` | `component-map.md`, wireframes | `build/task-list.md`, `build/[nn]-[task-name].md` |
| 6 | `skills/ux-design-review.md` (post-build) | Wireframes, built output | `validation.md` |
| 7 | `skills/debrief-capture.md` | Aaron's notes, agent thread excerpts, `validation.md` | Entries in `prompts-library.md`, `decisions-log.md`; `design/debrief-[feature].md` |

## Gate Checkpoints

### Gate 1: Scope & Structure Review

**After:** ux-architect completes all three phases.

Present this summary to Aaron:

```
## Gate 1: [Feature Name] - Scope & Structure

### Personas
- [Name]: [One-line description and primary goal]

### Use Cases (summary)
1. [UC-1]: [One sentence]

### Key Functions
- [Function]: [What it does, which use case it serves]

### Proposed Screen Structure
- [Screen A]: [Purpose, primary persona]

### Navigation
[Where these screens live in the app]

### Research Findings
[Key insights from UX research that shaped decisions]

### Questions for Aaron
1. [Specific question]

### What happens next
Once confirmed, I'll create detailed wireframe specs for each screen.
```

### Gate 2: Wireframe & Copy Review

**After:** ux-wireframe + ux-design-review (pre-build) complete.

```
## Gate 2: [Feature Name] - Wireframes & Review

### Screens Created
- [screen-name.md]: [One-line summary]

### UX Review Changes Made
- [What was changed and why]

### UI Copy Samples
[Key labels, headings, empty states, error messages]

### Open Questions
1. [Specific question]

### What happens next
Once confirmed, I'll map to Haven components and generate build tasks.
```

### Gate 3: Build Plan Confirmation

**After:** haven-mapper + dev-tasker complete.

```
## Gate 3: [Feature Name] - Build Plan

### New Haven Components Needed
- [Component]: [Brief description, Preline base if applicable]
(or "None - all components exist")

### Build Tasks ([N] total)
1. [Task]: [One sentence]

### Estimated Complexity
[Simple / Moderate / Complex] - [Brief rationale]

### Any concerns?
```

## Research Requirements

**Must search before making recommendations:**
- `ux-architect` (Phase 1): NNG, Baymard, .gov accessibility guidance, healthcare UX publications
- `ux-design-review`: Expert guidance on specific interaction patterns being evaluated

**Use training knowledge, search only for unfamiliar patterns:**
- `ux-wireframe`
- `haven-mapper`: Search Preline/Tailwind docs when specifying new components

**Never fabricate citations.** If you didn't find it, say so.

## Context Sources

| What | Where |
|------|-------|
| Cena Health domain context | `src/data/shared/cena-context.md` (create if missing; see cena-health-spark/haven-tailwind-theme/cena-context.md for source) |
| User personas | `src/data/personas/[persona]/` |
| Design decisions log | `.project-docs/decisions-log.md` |
| Prompts library | `.project-docs/prompts-library.md` |
| Component ground truth | `src/styles/tokens/components.css` + `pattern-library/COMPONENT-INDEX.md` |
| Angular integration requirements | `ANDREY-README.md` |
| Agent build rules | `CLAUDE.md` |

## Starting a New Feature

1. Determine which persona/app (`provider`, `kitchen`, `patient`, `care-coordinator`)
2. Check `apps/[persona]/design/` for existing work
3. Read `src/data/shared/cena-context.md` if it exists (or refer to project context)
4. Read relevant persona data from `src/data/personas/`
5. Read `skills/ux-architect.md`
6. Begin Phase 1 with web research

**Opening message to Aaron:**
> Starting UX workflow for **[feature name]** in **[app/persona]**. I've reviewed existing work in `apps/[persona]/design/` and the shared references. I'll work through discovery, functional spec, and information architecture, then pause for your review before wireframing. Any initial constraints or preferences I should know about?

## Resuming Work

1. Check `apps/[persona]/design/` for existing outputs
2. Determine where in the pipeline we stopped
3. State current position: "We're at [step]. Last completed: [output]. Next: [step]."
4. Continue from the next incomplete step

## Partial Workflow Runs

| Scenario | Start at | End at |
|----------|----------|--------|
| Brand new feature or app | ux-architect | validation |
| New screen in existing feature | ux-wireframe (if IA exists) | validation |
| Redesign of existing screen | ux-design-review (document current), then ux-architect | validation |
| Component addition only | haven-mapper | dev-tasker |
| UX review of built screen | ux-design-review (post-build) | validation |
| Hotfix or small change | dev-tasker directly | — |

## Anti-Hallucination Rules

1. **Never assume component availability.** Read `src/styles/tokens/components.css` AND `pattern-library/COMPONENT-INDEX.md` before mapping.
2. **Never fabricate research.** If search returns nothing, say so.
3. **Never guess at data fields.** Add to Open Questions instead.
4. **Never skip the gate.** Always present the summary and wait for Aaron's response.
5. **Read before writing.** Don't work from memory of what a file contained earlier in the conversation.

## Debrief Protocol

After a successful build:

> **Should we debrief on what worked?**
>
> If yes, I'll capture:
> - Which prompt patterns worked well
> - What caused confusion or errors
> - Time investment (your estimate)
>
> Share via copy/paste with `[PROMPT 1]`, `[AGENT RESPONSE]`, `[PROMPT 2]` markers.

Debrief output goes to:
- `apps/[persona]/design/debrief-[feature].md` (feature-specific)
- `.project-docs/prompts-library.md` (reusable patterns, appended)
- `.project-docs/decisions-log.md` (design decisions, appended)
