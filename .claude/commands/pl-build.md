# Pattern Library Build Sprint

This command builds the next missing component from the registry, runs QA, and marks it done.
Run repeatedly until all components are built.

## Step 1: Find the next component

Read `.project-docs/COMPONENT-REGISTRY.md`.
Find the **first row** where Status = `missing`.
Note the component name, PL page path, and any notes.

If no `missing` rows remain, output:
"All components built. Run /brand-review to begin the brand review phase."
Then stop.

## Step 2: Mark in-progress

Update `.project-docs/COMPONENT-REGISTRY.md` — change that row's Status from `missing` to `in-progress`.

## Step 3: Spawn a builder sub-agent

Spawn a sub-agent with this instruction:

"You are the Haven UI Pattern Library Builder. Your task is to build the {component name} component.

Read these files before writing anything:
1. `.project-docs/agent-workflow/skills/haven-pl-builder.md` — your full build protocol
2. `CLAUDE.md` — all project rules
3. `.project-docs/decisions-log.md` — extract every 'Rule to follow in future prompts' entry
4. `pattern-library/COMPONENT-INDEX.md` — confirm the component does not already exist
5. `src/styles/tokens/components.css` — scan for any existing related classes

Target component: {component name}
Target page: {PL page path from registry}
Registry notes: {any notes from registry row}

Produce the pre-build plan first. Then execute it. Output a completion report when done."

## Step 4: Spawn a QA sub-agent

After the builder sub-agent completes, spawn a QA sub-agent:

"You are the Haven UI QA Agent. Read `.project-docs/agent-workflow/skills/haven-pl-qa.md` and run the full QA checklist against the {component name} component that was just built.

Output the full QA report. If any check FAILs, fix the issue and re-run only the failed checks. Do not proceed until all checks are PASS."

## Step 5: Mark built and commit

After QA passes:
1. Update `.project-docs/COMPONENT-REGISTRY.md` — change Status from `in-progress` to `built`
2. Run:
```
git add -A
git commit -m "feat(pl): add {component name} component"
```

## Step 6: Continue automatically

Do not stop. Do not wait for input. Return to Step 1 and build the next `missing` component.

Continue this loop until one of these conditions is met:
- No `missing` rows remain in COMPONENT-REGISTRY.md — output "Sprint complete. All components built." and stop.
- A QA check fails twice on the same component — output a failure report and stop for Aaron's review.
- A build produces a JS console error at localhost:5173 that cannot be resolved — stop and report.

**Do not pause between components for confirmation. Build continuously.**
