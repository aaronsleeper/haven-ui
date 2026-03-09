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
