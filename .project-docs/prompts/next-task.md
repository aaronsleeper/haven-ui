# Task: Set up agent-based UX workflow
_Generated: 2026-03-09_
_App: cross-app_
_Context: The agent-workflow folder at `.project-docs/agent-workflow/` contains a complete
UX design-to-build pipeline (6 skill files + workflow doc + README). This task integrates
it into the active haven-ui workflow: updates the task-template, adds the workflow to
CLAUDE.md awareness, and verifies everything is readable and correctly pathed._

---

## Scope Classification

- [x] Cross-app infrastructure — no new components, no app pages

---

## Prompt 1: Read and verify the workflow files

Read the following files in full and confirm each exists and is non-empty:

- `.project-docs/agent-workflow/README.md`
- `.project-docs/agent-workflow/ux-workflow.md`
- `.project-docs/agent-workflow/skills/ux-architect.md`
- `.project-docs/agent-workflow/skills/ux-wireframe.md`
- `.project-docs/agent-workflow/skills/ux-design-review.md`
- `.project-docs/agent-workflow/skills/haven-mapper.md`
- `.project-docs/agent-workflow/skills/dev-tasker.md`
- `.project-docs/agent-workflow/skills/debrief-capture.md`

Report: file name, approximate line count, and first heading for each.
Do not summarize content — just confirm they exist and are readable.

---

## Prompt 2: Update task-template.md

Read `.project-docs/prompts/task-template.md` in full.

Then replace its entire contents with the updated version below. This adds three
things the old template was missing: the Constraints Lookup step, mandatory dark mode
verification, and the Completion Report.

Write this exact content to `.project-docs/prompts/task-template.md`:

```markdown
# Task: [Short descriptive title]
_Generated: YYYY-MM-DD_
_App: [provider | kitchen | patient | care-coordinator | pattern-library | cross-app]_

---

## Scope Classification

Answer these before writing any code or touching any file.

**Work type (check one):**
- [ ] Pattern library only — new component or variant; no app work in this task
- [ ] App only — composing existing patterns into a page; no new components
- [ ] Both — pattern library first, then app usage (run as two sequential prompts)

**If pattern library work:**
List every new semantic class that will be added to `components.css`:
- `.class-name` — what it does

**If app work:**
List every pattern library component being used (verify each exists in `COMPONENT-INDEX.md`):
- `[component-file].html` — how it's used on this page

**If a component you need is NOT in the index:**
Stop. Add it to the pattern library in a prior prompt before continuing.

---

## Pre-Build Audit

Before writing any HTML or CSS, the agent must:

1. Read `pattern-library/COMPONENT-INDEX.md` and confirm every component needed exists
2. Read the relevant sections of `src/styles/tokens/components.css` to confirm class names
3. Check `src/partials/` for any reusable partials relevant to this task
4. Read `.project-docs/decisions-log.md` and extract every entry that has a
   **"Rule to follow in future prompts"** line — list them here before proceeding
5. For each rule extracted in step 4, note whether it applies to this task.
   Embed applicable rules in the relevant prompt below under a "Known Constraints" heading.
6. List any component gaps found (missing components, missing classes)

If component gaps exist, resolve them in the pattern library before touching app files.

---

## Prompt 1: [First discrete step]

[Instructions for the first atomic task.]

### Known Constraints
[Rules from decisions-log.md that apply to this specific prompt. Leave blank if none apply.]

---

## Prompt 2: [Second discrete step]

[Instructions for the next step. Reference specific files and class names.]

### Known Constraints
[Rules from decisions-log.md that apply to this specific prompt. Leave blank if none apply.]

---

## Verification

After all prompts complete, confirm:

- [ ] Verified at `http://localhost:5173/[path/to/page.html]`
- [ ] All new classes are in `components.css` with `@apply` definitions
- [ ] Any new class using only raw CSS properties has `@apply block;` as its first line
- [ ] No utility chains in HTML (layout-only utilities are OK)
- [ ] No `style="..."` attributes (except data-driven flex on pipeline segments)
- [ ] No `<script>` blocks in HTML files
- [ ] All JS in `src/scripts/`
- [ ] Dark mode variants present for all color, bg, border, and text on any new or modified component class (yes / no / not applicable)
- [ ] Pattern library component file created with `@component-meta` header (if new component was added)
- [ ] `COMPONENT-INDEX.md` updated (if new component was added)
- [ ] `ANDREY-README.md` updated if component HTML structure or class names changed (yes / no / not applicable)
- [ ] `src/data/_schema-notes.md` updated if dummy data deviates from Firebase schema (yes / no / not applicable)
- [ ] Committed

---

## Completion Report

After verification passes and before running the git commit, output this report:

```
## Completion Report — [Task Title]

- New semantic classes added to components.css: [list, or "none"]
- Existing classes modified: [list, or "none"]
- Pattern library files created or updated: [list, or "none"]
- Judgment calls (anything not explicitly specified in the prompt): [list, or "none"]
- Dark mode added: [yes / no / not applicable]
- ANDREY-README.md updated: [yes / no / not applicable]
- Schema delta logged: [yes / no / not applicable]
- Items deferred or incomplete: [list, or "none"]
```

---

## Final Step: View the Result

After completing the Completion Report, run:

```bash
git add -A
git commit -m "[brief description of what was built]"
```

Then output:

---
**View your result:**
- If `npm run dev` is already running: http://localhost:5173/[path/to/file.html]
- If not running: open a terminal in the repo root, run `npm run dev`, then visit the URL above
---
```

Confirm the write succeeded by reading back the first 20 lines of the updated file.

---

## Prompt 3: Add workflow awareness to CLAUDE.md

Read `CLAUDE.md` in full.

Find the `## .project-docs/` section or the section that describes project documentation
files. If no such section exists, find the last section in the file.

Append the following block. Do NOT modify any existing content — only add this:

```markdown
---

## UX Design & Build Workflow

A full design-to-build pipeline lives in `.project-docs/agent-workflow/`.
Read `.project-docs/agent-workflow/README.md` for an overview.

**When to use it:** Any time Aaron describes a new feature, screen, or application
to design and build. Also for redesigns of existing screens.

**Pipeline:**
ux-architect → ux-wireframe → ux-design-review (pre-build) → haven-mapper →
dev-tasker → [build] → ux-design-review (post-build) → debrief-capture

**To invoke a skill:** Read the skill file from
`.project-docs/agent-workflow/skills/[skill-name].md`, follow its instructions,
produce its specified outputs.

**Design artifacts live in:** `apps/[persona]/design/`

**Gates:** Pause and present a structured summary to Aaron after:
1. ux-architect completes (Gate 1: scope + IA)
2. ux-wireframe + ux-design-review pre-build complete (Gate 2: wireframes + copy)
3. dev-tasker completes (Gate 3: build plan)

**Constraints Lookup (mandatory before writing any build prompt):**
Read `.project-docs/decisions-log.md`. Extract every entry with a
"Rule to follow in future prompts" line. Apply relevant rules to each prompt
under a "Known Constraints" heading.
```

Confirm the addition by reading back the last 40 lines of `CLAUDE.md`.

---

## Prompt 4: Smoke test — verify workflow is invocable

Read `.project-docs/agent-workflow/ux-workflow.md` and answer these questions:

1. What are the three gate checkpoint names and what triggers each?
2. What file does ux-architect produce as its primary output, and where does it go?
3. What two files does haven-mapper read as its component inventory source of truth?
4. What is the Constraints Lookup step in dev-tasker, and when does it run?
5. What does debrief-capture produce, and where does it go?

Answer from the file content only. This confirms the workflow is readable and
self-consistent from the agent's perspective.

---

## Verification

- [ ] All 8 workflow files confirmed readable in Prompt 1
- [ ] `task-template.md` updated with Constraints Lookup, dark mode check, and Completion Report
- [ ] `CLAUDE.md` has the workflow awareness block appended
- [ ] Smoke test answers in Prompt 4 are consistent with actual file content
- [ ] No existing `CLAUDE.md` content was modified (only appended)
- [ ] No files in `src/`, `apps/`, or `pattern-library/` were touched

---

## Completion Report

```
## Completion Report — Agent Workflow Setup

- New semantic classes added to components.css: none
- Existing classes modified: none
- Pattern library files created or updated: none
- Judgment calls: [list any]
- Dark mode added: not applicable
- ANDREY-README.md updated: not applicable
- Schema delta logged: not applicable
- Items deferred or incomplete: [list any, or "none"]
```

---

## Final Step

Run:
```bash
git add -A
git commit -m "Add agent-based UX workflow to .project-docs"
```

Then output:

---
**Workflow setup complete.**

The UX design-to-build pipeline is ready to use. To start a new feature:
1. Describe the feature to your planning agent (this Claude project)
2. It will run through ux-architect → wireframes → review → component mapping → build prompts
3. Build prompts land in `.project-docs/prompts/next-task.md` as usual
4. Run `/build` in Claude Code to execute

Skills are in `.project-docs/agent-workflow/skills/`.
Workflow doc: `.project-docs/agent-workflow/ux-workflow.md`
---
