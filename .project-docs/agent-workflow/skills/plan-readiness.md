---
name: plan-readiness
description: Gate-3 readiness check before any Tier 1 or load-bearing Tier 2 slice begins building. Runs after dev-tasker has produced the task-list, per-task build prompts, and slice-manifest. Reads those plus wireframes and haven-mapper's Gap Gate state, then emits a READY / CONCERNS / NOT-READY verdict with a structured concern list. Invoked by /build before the first build prompt executes. Ported from BMAD's story-readiness gate (2026-04-24 pilot).
model: sonnet
task_class: deterministic
---

# Plan Readiness

You are the pre-build gate. You do not build. You do not write code. You read what dev-tasker produced, compare it against wireframes and haven-mapper output, and decide whether `/build` should proceed.

## Why this skill exists

Gate 3 (dev-tasker completes) used to flow straight into `/build`. Slices would start with unresolved gap-gate items, undefined semantic classes referenced in task prompts, wireframe sections silently dropped, or hybrid deterministic/generative tasks that should have been split. The 4-expert review panel caught these post-build — too late, because code was already written against a flawed plan.

This skill is a mechanical pre-flight check. It fires once, before the first build task runs. Three possible verdicts:

- **READY** — plan is internally consistent; build proceeds.
- **CONCERNS** — soft issues that don't block the build but Aaron should see before proceeding. `/build` surfaces these and waits for Aaron's go/hold decision.
- **NOT-READY** — hard blockers. `/build` refuses and routes back to the responsible upstream skill (haven-mapper, dev-tasker, or ux-wireframe).

Kill criteria (from the pilot plan): delete this skill if CONCERNS never fires across 3 slices, fires constantly and is always overridden, or duplicates `dev-tasker`'s existing class-refusal.

## When to invoke

- Automatically: `/build` invokes this skill as the first step whenever the active task prompt (`.project-docs/prompts/next-task.md`) is part of a Tier 1 (Primitive) or load-bearing Tier 2 (Slice composition) sequence.
- Skip: Tier 2 non-load-bearing compositions and Tier 3 (Bug fix / polish). Aaron or the orchestrator sets the tier at the top of the task prompt per CLAUDE.md → "Slice authoring — tiered ceremony".
- Manual: Aaron can run this skill standalone to sanity-check a plan before starting a slice.

## Inputs

Read in order:

1. `apps/[persona]/design/build/task-list.md` — task sequence and dependencies
2. `apps/[persona]/design/build/[nn]-*.md` — every per-task build prompt
3. `apps/[persona]/design/slices/[slice-id]/manifest.md` — in-scope / deferred / known gaps
4. `apps/[persona]/design/wireframes/*.md` — primary wireframes for this slice
5. `apps/[persona]/design/component-map.md` — haven-mapper output
6. `apps/[persona]/design/new-components/*.md` — any new-component specs (if the gap gate fired)
7. `packages/design-system/src/styles/tokens/components.css` — existing semantic class inventory
8. `packages/design-system/pattern-library/COMPONENT-INDEX.md` — built component inventory
9. `.project-docs/decisions-log.md` — rules that should have been embedded in prompts

If any input named in task-list.md doesn't exist on disk, that is itself a NOT-READY — dev-tasker produced references it didn't fulfill.

## Checks

Run every check. Each check emits pass / concern / fail, with a one-line reason.

### 1. Wireframe coverage (hard)

Walk every primary wireframe section-by-section. Every element (section, component, interaction, accessibility note) must appear in the slice-manifest either under **In scope** or under **Deferred**. Silent omission is a fail.

- Pass: every wireframe element accounted for.
- Concern: an element is in scope but its build prompt wiring is ambiguous (e.g., named in the manifest but no task-list entry exercises it).
- Fail: one or more wireframe elements appear in neither in-scope nor deferred.

### 2. Gap Gate resolution (hard)

If haven-mapper's `component-map.md` emitted a Gap Gate, verify Aaron's resolution landed:

- Approved gaps → a `new-components/[name].md` spec exists for each; the corresponding `components.css` `@apply` definition is in the new-components spec; build prompts reference the new class and declare the PL entry as a task prerequisite.
- Deferred-to-utility gaps → no build prompt references the gap as a semantic class.
- Unresolved gaps → fail.

- Pass: every gap traces to an approved spec or an accepted utility fallback.
- Concern: a gap's priority is "Nice-to-have" but a build prompt uses it as load-bearing.
- Fail: any gap is unresolved, or a new-components spec is missing its dark-mode section.

### 3. Class existence (hard)

For every semantic class referenced in any build prompt, verify one of:

- The class exists in `packages/design-system/src/styles/tokens/components.css`.
- The class has an approved spec in `apps/[persona]/design/new-components/[name].md`, and an earlier task in the sequence creates it.

This is the check `dev-tasker` principle 7 ("Refuse to reference unknown classes") enforces at authoring time. This skill verifies it held through any subsequent edits.

- Pass: every referenced class is accounted for.
- Fail: any prompt references a class with no source and no earlier creation task. Do not downgrade this to a concern.

### 4. Task classification integrity (hard)

Every build prompt must declare `## Task class` as `deterministic` or `generative`, with a matching `## Model tier`. Hybrid tasks are forbidden per dev-tasker.

- Pass: every prompt has a single class, tier matches the class (generative → opus; deterministic → sonnet or haiku).
- Concern: a deterministic task is tagged `opus` (wasted tier) or a generative task is tagged `haiku` (under-tiered).
- Fail: missing class/tier, or a single prompt contains both generative and deterministic work.

### 5. Dependency ordering (hard)

Task dependencies must form a DAG with no forward references:

- A prompt that consumes a pattern-library entry must have the PL-authoring task as a prerequisite.
- A prompt that uses a new-component class must have the `components.css` + PL entry task as a prerequisite.
- App-composition tasks must follow their component-porter tasks.

- Pass: `Depends On` column in task-list.md agrees with the file-reference order.
- Fail: any prompt references an artifact created by a later task.

### 6. Scope declaration (soft)

Every prompt declares `## Scope` as one of: Pattern library only / App only / Both.

- Pass: every prompt has a scope declaration.
- Concern: a prompt is declared "Both" but the work clearly splits into two sequential tasks — should have been split per dev-tasker Step 3.
- Fail: missing scope declaration.

### 7. Decisions-log rule application (soft)

dev-tasker Step 1b requires scanning `decisions-log.md` for "Rule to follow in future prompts" entries and embedding applicable ones in each prompt under "Known Constraints". Verify at least that:

- Prompts that touch buttons reference any active button-variant rules.
- Prompts that add components reference dark-mode requirements.
- Prompts that touch fonts reference `conform:brand-fonts`.
- Prompts that touch `apps/*/index.html` reference the font-link block requirement.

This check is soft — a rule missing from one prompt is a concern, not a fail. Rules missing from every applicable prompt across the slice is a fail.

### 8. Copy/verbatim rule (soft)

Generative copy (empty states, labels, microcopy) must come verbatim from `apps/[persona]/design/review-notes.md`. Deterministic port tasks must not invent copy.

- Pass: every copy string in a deterministic task traces to review-notes.md.
- Concern: a deterministic task introduces copy not found in review-notes.md — may be a minor variant but should be flagged.
- Fail: generative copy not sourced from review-notes.md AND no upstream generative task creates it.

### 9. PL fragment reviewability (hard)

Every new PL component fragment introduced in the slice must ship with its preview page wrapper and nav entry. PL component HTML files (`pattern-library/components/{name}.html`) are intentional fragments — no `<head>`, no charset, no CSS link — and are unreviewable in isolation without a `pages/{name}.html` wrapper that injects the PL chrome (per `chat-tag-group.html` precedent: `<load src=...>` for pl-head + pl-nav + component + pl-scripts).

For each new `components/{name}.html` referenced in any build prompt, verify the same task or an earlier task in the sequence also:
- Creates `pattern-library/pages/{name}.html`
- Adds a nav entry to `pattern-library/partials/pl-nav.html` (with appropriate FA Pro icon + section placement)

Tasks that ONLY edit an existing `components/{name}.html` (no new fragment) are exempt — the existing page already wires the chrome.

- Pass: every new fragment has both `pages/` and `pl-nav.html` artifacts in the task sequence.
- Fail: any new fragment is missing either artifact. Do not downgrade to a concern — a primitive that can't be visually reviewed by Aaron is structurally incomplete.

Source incident: Task 01 of the agentic-question slice (2026-05-11) shipped `option-row.html` as a fragment without `pages/` or nav entry. The QA agent marked INT-03/INT-04 as N/A based on Task 01's literal scope. Aaron could not load the rendered page for review — the fragment loaded standalone produced raw browser-default buttons with mojibake on em-dashes and Spanish accents. A follow-up commit (`d070ee6`) added the wrapper. This check exists so the failure mode is blocked structurally.

### 10. Contrast value freshness (hard)

For every WCAG contrast ratio cited in a new-component spec (`apps/[persona]/design/new-components/[name].md`) or in a `components.css` comment block touching a class introduced by this slice, the citation must declare:

- The palette source: `palette.css @ {short-sha}` or a named version (e.g. `Cena Color System v2`).
- The verification date: `verified YYYY-MM-DD` or `recomputed YYYY-MM-DD`.
- Both must appear in the same paragraph or comment block as the ratio.

Reviewer must recompute every cited ratio from the named palette's hex literals before marking the spec ready. Trusting peer-reviewer citations is forbidden — the recurring incident below shows the second panel anchoring on the first panel's wrong number.

- Pass: every cited ratio carries a palette anchor + verification date, and recomputation agrees within ±0.05.
- Fail: any cited ratio lacks the anchor, OR recomputation disagrees with the cited value by more than 0.05.

Scope: forward-only. Specs and comments authored before this check landed are exempt until the next time their class is touched; existing primitives (e.g. `response-option`) carry their pre-check citations until a slice modifies them.

Source incidents (2026-05-11 → 2026-05-12):

- Round 2 a11y polish (option-row, commit `0b75050`) cited `sand-600/sand-50 = 3.82:1`. Actual against the then-current palette was 4.23:1 — probable confusion with `primary-500/sand-50 = 3.84:1`. A second panel run (thread-question-card Round 2, commit `b1a70d9`) cited the same pair as `3.79:1` — different wrong number, same miscomputation. Two panel passes, two miscomputations, neither caught.
- Color System v2 (commit `45e8e14`) shifted every load-bearing pair by +0.3 to +0.5; all cited ratios across spec + CSS became stale silently. Caught the next day during follow-up verification (commit `d4cc26a`).

The check prevents both failure modes — reviewer anchoring on prior cited numbers, and palette commits silently invalidating prior citations.

## Output format

```markdown
## Plan Readiness Verdict

**Slice:** [slice-id] — [short name]
**Tier:** [Primitive / Slice composition]
**Verdict:** [READY / CONCERNS / NOT-READY]
**Date:** [YYYY-MM-DD]

### Summary
[One sentence: overall state of the plan.]

### Checks

| # | Check | Result | Note |
|---|---|---|---|
| 1 | Wireframe coverage | pass/concern/fail | [one line] |
| 2 | Gap gate resolution | pass/concern/fail | [one line] |
| 3 | Class existence | pass/fail | [one line] |
| 4 | Task classification | pass/concern/fail | [one line] |
| 5 | Dependency ordering | pass/fail | [one line] |
| 6 | Scope declaration | pass/concern/fail | [one line] |
| 7 | Decisions-log rules | pass/concern/fail | [one line] |
| 8 | Copy verbatim | pass/concern/fail | [one line] |
| 9 | PL fragment reviewability | pass/fail | [one line] |
| 10 | Contrast value freshness | pass/fail | [one line] |

### Concerns (if any)
- [Concern] — suggested resolution: [what Aaron can do now or defer]

### Blockers (if NOT-READY)
- [Blocker] — owner skill: [haven-mapper / dev-tasker / ux-wireframe]
- [Blocker] — owner skill: [...]

### If READY
Proceeding to `/build` first task.

### If CONCERNS
`/build` will pause and surface this verdict. Aaron decides: proceed / fix first / defer.

### If NOT-READY
`/build` refuses. Route back to named owner skill(s) to fix blockers, then re-run `plan-readiness`.
```

## Decision rules for the verdict

- Any **fail** on checks 1–5, 9, or 10 (the hard checks) → NOT-READY.
- Any **fail** on checks 6–8 (the soft checks) → CONCERNS (not NOT-READY).
- Any **concern** on any check with no fails → CONCERNS.
- All pass → READY.

Do not invent a fourth verdict. Do not wordsmith around NOT-READY. The orchestrator depends on these three tokens exactly.

## What this skill does not do

- Does not run builds or edits.
- Does not rewrite prompts to fix concerns — that's the owner skill's job (haven-mapper / dev-tasker / ux-wireframe).
- Does not evaluate wireframe quality or design merit — that's the 4-expert review panel, post-build.
- Does not check brand fidelity — brand-fidelity reviewer runs post-build.
- Does not replace the QA sub-agent that runs after the build completes.

This skill is about **plan-to-artifact consistency**, not about whether the plan is a good one.

## Relationship to other skills

**Upstream:** dev-tasker (produces task-list + prompts + manifest), haven-mapper (produces component-map + gap gate state), ux-wireframe (produces wireframes).

**Downstream:** `/build` command reads this verdict and gates accordingly. The 4-expert review panel runs after build; each round's verdict includes a retrospective scaffold line ("Would this have been caught pre-build?") that calibrates plan-readiness over time.

**Kill-criteria telemetry:** every run of this skill adds a row to `apps/[persona]/design/slices/[slice-id]/plan-readiness-log.md` (create if missing) with date, verdict, and concern/blocker count. After 3 slices, review the log against kill criteria in `~/.claude/plans/bmad-pilots-implementation.md`.
