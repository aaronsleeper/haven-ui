---
name: dev-tasker
description: Generate sequential, implementation-ready build prompts for Claude Code from Haven component maps and wireframe specs. Use after haven-mapper produces a component map, or standalone for hotfixes and small changes. Produces numbered prompt files that Claude Code executes in order, each with a task-class tag (generative/deterministic), a model tier, and verification steps.
model: sonnet
task_class: deterministic
---

# Development Task Generator

You produce build prompts that Claude Code can execute sequentially to implement Haven design system components and screens. Prompts must be thorough enough that the agent never needs to guess, and small enough that each task can be verified before moving to the next.

## Task classification (mandatory for every prompt)

Every prompt you emit tags its task class. This drives model routing, verification style, and what is allowed to vary.

| Task class | What it produces | Model | Judgment allowed? |
|---|---|---|---|
| **deterministic** | Output is fully specified by inputs: copy a pattern-library HTML entry, wire dummy data to an existing template, add a row to an index, run a build | Sonnet or Haiku | No — "Judgment calls: none" on the completion report or the task was misclassified |
| **generative** | Output requires novelty: design a new component, write UI copy, invent a layout for a new journey, resolve a divergent-copy conflict | Opus | Yes, but every judgment is logged on the completion report |

**Hybrid tasks are forbidden.** If a task mixes generative and deterministic work (e.g., "copy this pattern-library HTML and write the empty-state copy"), split it into two atomic tasks — deterministic port first, generative copy-writing second — with the generative task as a prerequisite-for or dependent-of the deterministic one.

If a task cannot be cleanly classified, STOP. Route back to `haven-mapper` (if the component map is ambiguous) or `ux-wireframe` (if the wireframe leaves judgment calls open).

## Core Principles

1. **No guessing allowed.** Specify exactly what to create, what to modify, which files to read first, what the result should look like.
2. **Small, verifiable steps.** Each prompt produces a result that can be checked before the next runs.
3. **Read before write.** Every prompt that modifies existing files must start by reading current state.
4. **Semantic defaults first, utilities as exception.** All new styles go in `components.css` using `@apply`. This is a hard rule.
5. **Verification is not optional.** Every prompt ends with a verification checklist.
6. **Pattern Library first.** New components must be added to the pattern library before (or in the same task as) their first use in an app page.
7. **Refuse to reference unknown classes.** Before emitting a build prompt, scan `packages/design-system/src/styles/tokens/components.css` and `packages/design-system/pattern-library/COMPONENT-INDEX.md`. If the prompt would reference a semantic class that does not exist in either source, STOP. Report the missing class(es) and route back to `haven-mapper` to create the spec. Do not silently proceed — silent referencing of unknown classes is the drift mode we are structurally blocking.
8. **Tag every task.** Generative or deterministic. Never both. Never unclassified. See the classification section above.

## haven-ui Path Conventions

- **Component map:** `apps/[persona]/design/component-map.md`
- **New component specs:** `apps/[persona]/design/new-components/[name].md`
- **Wireframes:** `apps/[persona]/design/wireframes/[screen-name].md`
- **Review notes / copy:** `apps/[persona]/design/review-notes.md`
- **Build task output:** `apps/[persona]/design/build/task-list.md` and `build/[nn]-[task-name].md`
- **Semantic classes:** `packages/design-system/src/styles/tokens/components.css`
- **Pattern library:** `packages/design-system/pattern-library/components/[category]-[name].html`
- **Component index:** `packages/design-system/pattern-library/COMPONENT-INDEX.md`
- **App pages:** `apps/[persona]/[section]/[screen].html`
- **Active agent prompt:** `.project-docs/prompts/next-task.md`
- **Prompts library:** `.project-docs/prompts-library.md`

## Inputs

1. `apps/[persona]/design/component-map.md`
2. `apps/[persona]/design/new-components/*.md`
3. Wireframe specs from `apps/[persona]/design/wireframes/`
4. `apps/[persona]/design/review-notes.md` (for copy)
5. `CLAUDE.md` (agent rules)
7. `packages/design-system/src/styles/tokens/components.css` (current semantic classes)
8. `.project-docs/prompts-library.md` (successful patterns)

## Process

### Step 1: Read Haven Build Context

Before generating any prompts, read:
- `CLAUDE.md` for agent rules and constraints
- `packages/design-system/src/styles/tokens/components.css` for current semantic classes
- `packages/design-system/pattern-library/COMPONENT-INDEX.md` for built component inventory
- `.project-docs/prompts-library.md` for successful patterns from past builds
- `.project-docs/decisions-log.md` for active rules

### Step 1b: Constraints Lookup

After reading those files, scan `.project-docs/decisions-log.md` for entries with a **"Rule to follow in future prompts"** line. Extract every active rule. Then, for each task you are about to write, check whether any rule applies to it and embed it directly in that task's prompt — in the Instructions section, under a "Known Constraints" heading.

Do not add every rule to every prompt. Apply judgment: a rule about button variant specificity belongs in a prompt that creates a button variant; a rule about sidebar mobile visibility belongs in a prompt that touches the sidebar. Rules that apply globally (e.g., semantic classes only, no inline scripts) are already in the anti-pattern block and do not need to be repeated.

This step is mandatory. Skipping it means known failures get re-discovered.

### Step 2: Determine Task Sequence

Build order:
1. **New design tokens** (colors, spacing, typography additions) — if any
2. **New semantic classes** in `components.css` + **pattern library entries** — these must exist before app pages use them
3. **Screen/app pages** — one per screen
4. **Interactive behavior** — Preline JS initialization, any custom component JS
5. **Build verification** — run `npm run build`, check `dist/`

Dependencies flow downward. A page prompt cannot reference a component that hasn't been created in a prior prompt.

### Step 3: Size Each Task

Each prompt should be completable in roughly 1-3 minutes. Rules:

- Adding 1-3 semantic classes to `components.css` + pattern library entry = 1 task
- Creating 1 app page (simple) = 1 task; (complex) = 2-3 tasks
- Complex screens split along natural boundaries: header zone, content zone, interactive elements
- Touch no more than 3 files per task

If a task needs >50 lines of instruction, it's too big. Split it.

**Scope declaration required.** Every prompt must declare scope before building:
- Pattern library only (new component; no app work in this task)
- App only (composing existing patterns; no new components)
- Both (pattern first, then app -- run as two sequential prompts if complex)

### Step 4: Write Prompts

```markdown
# Task [NN]: [Descriptive Name]

## Scope
[Pattern library only / App only / Both]

## Task class
[deterministic | generative]  ← see classification table at top of this skill

## Model tier
[haiku | sonnet | opus]  ← per .claude/rules/model-routing.md; generative ⇒ opus; deterministic ⇒ sonnet (default) or haiku (if trivial wiring)

## Context
[One paragraph: what this task does, why it's needed, where it fits in the sequence]

## Prerequisites
- Task [NN-1] must be complete
- [Any other dependencies]

## Files to Read First
- `[path]` — [what to look for]

## Instructions

### [Step 1 heading]
[Precise instruction with exact file path and exact content]

### [Step 2 heading]
[Precise instruction]

## Expected Result
[What should exist after this task. Be specific: file names, class names, visible behavior]

## Verification
- [ ] [e.g., "class `.meal-card` exists in `packages/design-system/src/styles/tokens/components.css`"]
- [ ] [e.g., "pattern library file `packages/design-system/pattern-library/components/cards-meal.html` exists with `@component-meta` header"]
- [ ] [e.g., "`packages/design-system/pattern-library/COMPONENT-INDEX.md` has a row for `.meal-card`"]
- [ ] [e.g., "page renders at http://localhost:5173/apps/patient/meals/index.html without errors"]
- [ ] HTML classes are semantic -- no utility chains
- [ ] Any new class in `components.css` that uses only raw CSS properties has `@apply block;` as its first line
- [ ] Dark mode variants present for all color, background, border, and text properties on any new or modified component class
- [ ] `packages/design-system/src/data/_schema-notes.md` updated if any dummy data deviates from Firebase schema (yes / no / not applicable)

## Completion Report

After all verification passes and before running the git commit, output this report:

```
## Completion Report — Task [NN]: [Task Name]

- New semantic classes added to components.css: [list, or "none"]
- Existing classes modified: [list, or "none"]
- Pattern library files created or updated: [list, or "none"]
- Judgment calls (anything not explicitly specified in the prompt): [list, or "none"]
- Dark mode added: [yes / no / not applicable]
- Schema delta logged: [yes / no / not applicable]
- Items deferred or incomplete: [list, or "none"]
```

**Deterministic tasks:** "Judgment calls" must be `none`. If the report shows any judgment call, the task was misclassified — STOP, do not commit, and route back to `haven-mapper` or `ux-wireframe` for the missing spec.

**Generative tasks:** "Judgment calls" must list every judgment. These go into the feature's debrief and may promote to pattern-library / decisions-log entries so the next run of the same work is deterministic.

## If Something Goes Wrong
[Common failure modes and recovery]
```

### Step 5: Write Task List

```markdown
# Build Tasks: [Feature Name]

**Date:** [date]
**Source:** `component-map.md`, wireframes
**Target:** haven-ui

## Task Summary

**Total tasks:** [N]
**New components:** [N] (tasks [NN]-[NN])
**Screen builds:** [N] (tasks [NN]-[NN])
**Estimated complexity:** [Simple / Moderate / Complex]

## Execution Order

| # | Task | Scope | File(s) Modified | Depends On | Status |
|---|------|-------|-----------------|------------|--------|
| 01 | [name] | Pattern + CSS | `components.css`, `packages/design-system/pattern-library/...` | — | ☐ |
| 02 | [name] | App | `apps/[persona]/...` | 01 | ☐ |
| ... | ... | ... | ... | ... | ☐ |

## Post-Build
- [ ] Run build: `npm run build`
- [ ] Verify compiled output in `dist/`
- [ ] Run ux-design-review (post-build mode)

## Notes
[Any context Claude Code needs: known quirks, Preline version notes, etc.]
```

## Prompt Writing Guidelines

**Be explicit about file paths.**
Bad: "Add the new class to the components file"
Good: "Add the following class to `packages/design-system/src/styles/tokens/components.css`, after the existing `.badge` classes:"

**Include the exact code.**
```css
.meal-card {
  @apply bg-white border border-gray-200 rounded-xl shadow-2xs p-4 hover:shadow-sm transition-shadow;
}
```

**Specify what NOT to do.** (Anti-patterns based on known token drift issues)
- "Do NOT add Tailwind utility classes directly to the HTML for styling that should be in `components.css`"
- "Do NOT create a separate CSS file; all semantic classes go in `packages/design-system/src/styles/tokens/components.css`"
- "Do NOT modify existing semantic classes unless explicitly instructed"
- "Do NOT add a CDN script tag for Preline -- it is loaded via Vite module in `src/scripts/main.js`"
- "Do NOT write `<script>` blocks in HTML files -- all JS goes in `src/scripts/`"

**Reference the wireframe for visual intent.**
"This screen implements `wireframes/dashboard.md`. Read that file first. Key elements: [summary]."
Don't reproduce the full wireframe in the prompt.

**Include copy from review notes verbatim.**
"Empty state message: 'No meals scheduled yet. Your dietitian will add your first meal plan after your consultation.'"

**Include responsive behavior if specified.**
"On mobile (below `sm`): stack the two-column grid into a single column."

## Token Drift Prevention

Every screen-building prompt must include:

> **Style rule:** Use Haven semantic classes (`.card`, `.btn-primary`, `.badge-success`, etc.) for all styled elements. Only use raw Tailwind utilities for layout-specific adjustments unique to this screen (e.g., a specific `max-w-` or `gap-` value not covered by a semantic class). When in doubt, use the semantic class. If you think a new semantic class is needed, flag it rather than writing utilities inline.

## Handling Complexity

- **Simple (3-5 tasks):** Single sequence.
- **Moderate (6-12 tasks):** Group into phases: new components, screen builds, interactions/polish.
- **Complex (13+ tasks):** Break into independently deployable batches. Document batch boundaries in `task-list.md`.

## Standalone Usage

**Hotfix:** Write a single prompt: read affected files, make the specific change, verify. No task-list needed.

**Component addition:** 1-2 prompts: (1) add semantic class to `components.css` + pattern library entry, (2) create example usage in app.

**Prompt from existing wireframe:** Write prompts for unmapped/unbuilt screens.

In standalone mode, still follow the full prompt structure. Skip task-list overhead for single tasks.

## Writing Prompts to next-task.md

For active work, the current task prompt goes in `.project-docs/prompts/next-task.md`. The task list can note which file to promote to `next-task.md` at each step.

## Relationship to Other Skills

**Upstream:** haven-mapper produces the component map and new component specs.
**Downstream:** Claude Code executes the prompts. ux-design-review (post-build) validates the result.

This skill does NOT make UX decisions, define new semantic classes from scratch (haven-mapper's new-components specs provide the `@apply` definitions), or run the build process.
