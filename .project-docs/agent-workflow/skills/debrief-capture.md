---
name: debrief-capture
description: Capture lessons from a completed build into the prompts library and decisions log. Use after a successful build (validation passed or Aaron confirms it's working). Triggered by the debrief prompt in ux-workflow.md. Produces no UI artifacts — only updates institutional knowledge files.
---

# Debrief Capture

You extract institutional knowledge from completed builds and write it into the appropriate files so future agents and future Aaron don't repeat the same discoveries.

This skill runs after a build is complete. Its job is to be a disciplined editor: deciding what is worth keeping, what format it belongs in, and writing it clearly enough that an agent reading it in six months can act on it without context.

## haven-ui Path Conventions

- **Prompts library:** `.project-docs/prompts-library.md`
- **Decisions log:** `.project-docs/decisions-log.md`
- **Feature debrief:** `apps/[persona]/design/debrief-[feature-slug].md` (temporary; not permanent record)

## Inputs

Aaron provides some combination of:
- **Completion reports** from Claude Code (one per task, produced automatically by the dev-tasker prompt template)
- Text excerpts from the Claude Code agent thread (labeled `[PROMPT N]` / `[AGENT RESPONSE]`)
- Summary of what worked and what didn't
- What surprised him (good or bad)
- Rough time estimate

Completion reports are the preferred primary input -- they are structured and already filtered to what matters. Agent thread excerpts are secondary, for cases where the completion report doesn't capture the full story.

You read:
- The wireframe spec files that were built against
- The validation.md output (if produced)
- The `component-map.md` (if produced)

## Process

### Step 1: Extract

Read Aaron's notes and the agent thread excerpts. Identify every event that falls into one of these categories:

**A. Prompt patterns that worked well**
A prompt that produced the correct result on the first attempt, without correction. Note: what was the task, what made the prompt effective (specificity, code included, files listed, anti-patterns named), how long did it take.

**B. Failures and fixes**
A prompt that required one or more correction rounds. Note: what failed, what the root cause was, what the fix was, how to prevent it next time.

**C. Gotchas and surprises**
Unexpected behavior from Haven, Tailwind v4, Preline, Chart.js, or the agent itself -- even if it was resolved quickly. Note: what happened, what caused it, what the correct behavior is.

**D. Design decisions made during build**
Any point where you or Aaron made a deliberate choice between two approaches. Note: what the choice was, what was considered, what was decided and why.

**E. New rules**
Any instruction that should now be added to every relevant future prompt (e.g., "always include X when Y").

### Step 2: Classify and Route

Each item goes to one or more destinations:

| Type | Destination |
|------|-------------|
| A (prompt pattern) | `.project-docs/prompts-library.md` |
| B (failure/fix) | `.project-docs/prompts-library.md` as Anti-Pattern |
| C (gotcha) | `.project-docs/prompts-library.md` + `.project-docs/decisions-log.md` if it reflects an architectural decision |
| D (design decision) | `.project-docs/decisions-log.md` |
| E (new rule) | `.project-docs/prompts-library.md` under the relevant existing pattern, AND note for CLAUDE.md update if it should be a hard agent rule |

### Step 3: Write

Write each item in the correct format for its destination file. Append to the appropriate section -- never overwrite existing entries.

---

## prompts-library.md Entry Formats

### Pattern entry (types A, C)

```markdown
## Pattern: [Descriptive Name]
**Tags:** #[tag1] #[tag2] #[tag3]
**Success Rate:** ✅ Verified [date]
**Last Used:** [date]

**Context:** [One paragraph: what task this pattern is for, why the naive approach fails]

**Prompt template / approach:**
[Exact prompt text, or structured description if it varies by context]

**Key details:**
- [What made this work -- be specific]
- [Any inclusion that was critical]
- [Any anti-pattern that was explicitly avoided]

**Hallucination triggers to avoid:**
- [What an agent might do wrong without this pattern]

**Time investment:** [rough estimate]
```

### Anti-pattern entry (types B, C)

```markdown
## Anti-Pattern: [Descriptive Name]
**Tags:** #[tag1] #[tag2]
**What Went Wrong:** [What the agent did / what failed]
**Root Cause:** [Why it failed -- technical explanation]

**Fix:**
[Exact correction applied]

**Rule:** [One-sentence instruction for future prompts, phrased as a directive]
```

---

## decisions-log.md Entry Format

```markdown
## Decision: [Name]
**Date:** [date]
**Context:** [What problem were we solving? What prompted this decision?]
**Decision:** [What we chose -- be precise]
**Rationale:** [Why this choice over alternatives?]
**Trade-offs:** [What did we give up? What risk did we accept?]
**What we tried that didn't work:** [If applicable]
**Rule to follow in future prompts:** [Directive phrasing if this affects agent behavior]
**Outcome:** ✅ / ⚠️ / ❌ [One sentence]
```

---

## Feature Debrief File Format

Write a summary file at `apps/[persona]/design/debrief-[feature-slug].md`. This is the working notes file -- it does not need to be as polished as the library entries, but it should be complete enough that someone reading it can understand what happened without the original thread.

```markdown
# Build Debrief: [Feature Name]

**Date:** [date]
**Built by:** Claude Code
**Aaron's time estimate:** [rough total]

## What Was Built
[2-3 sentences: what screens/components were produced]

## What Worked Well
[Bullet list: what went smoothly, what was faster than expected]

## What Required Correction
[Bullet list: what failed, how many rounds it took, final resolution]

## Surprises
[Bullet list: unexpected behavior, things that took longer than expected]

## Carry-Forward
[Anything that was deferred, left incomplete, or needs a follow-up task]

## Library Entries Added
- `.project-docs/prompts-library.md`: [list of pattern/anti-pattern titles added]
- `.project-docs/decisions-log.md`: [list of decision titles added]
```

---

## Triage: What Is Worth Capturing

Not every observation needs an entry. Apply this filter:

**Capture if:**
- A future agent would benefit from this instruction in a prompt
- The failure took more than one correction round to fix
- The behavior was non-obvious or contradicted reasonable expectations
- A design decision was made that has implications for other screens/components

**Skip if:**
- The agent made a trivial mistake (typo, wrong class name) that was corrected in one reply
- The observation is already documented in an existing prompts-library or decisions-log entry
- It's specific to the content of this feature and not generalizable

**When in doubt, capture it.** The prompts library and decisions log are only useful if they're specific and concrete. Vague entries ("agent sometimes gets confused by CSS") are worthless. Specific entries ("when overriding Preline's `.hs-overlay-backdrop` background-color, always use `!important` because Preline owns the selector specificity" -- worth capturing every time it's encountered.

---

## CLAUDE.md Update Flag

If any debrief item represents a rule that should apply to every build -- not just this feature type -- flag it explicitly in the debrief file:

```
## CLAUDE.md Update Recommended
- [Rule]: [Exact directive text that should be added to CLAUDE.md]
- Reason: [Why this is universal, not feature-specific]
```

Aaron decides whether to add it. The debrief skill does not edit CLAUDE.md directly.

---

## Relationship to Other Skills

**Upstream:** ux-design-review (post-build) produces `validation.md`. Claude Code builds. Aaron provides notes.
**Downstream:** Nothing -- this is the terminal step of the pipeline.

This skill produces no UI artifacts and does not make design or implementation decisions. It only records what happened.
