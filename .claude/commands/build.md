Read the file `.project-docs/prompts/next-task.md` and execute all instructions in it exactly as written.

Before starting:
1. Read `CLAUDE.md` in full
2. Read `.project-docs/decisions-log.md` and extract every "Rule to follow in future prompts" entry
3. Apply relevant rules to each step of the task

## Gate 3 — plan-readiness check

Before executing the first instruction in `next-task.md`, determine the task's tier from its top-of-prompt declaration (per CLAUDE.md → "Slice authoring — tiered ceremony"):

- **Tier 1 (Primitive)** or **load-bearing Tier 2 (Slice composition)** → run plan-readiness.
- **Non-load-bearing Tier 2** or **Tier 3 (Bug fix / polish)** → skip plan-readiness; proceed directly.
- **Tier not declared** → STOP. Ask Aaron to declare the tier before proceeding.

When plan-readiness runs:

1. Read `.project-docs/agent-workflow/skills/plan-readiness.md` and follow its instructions.
2. Emit the verdict block exactly as the skill specifies.
3. Route by verdict:
   - **READY** — proceed to execute `next-task.md`.
   - **CONCERNS** — pause. Surface the verdict block to Aaron. Wait for explicit "proceed" / "fix first" / "defer" direction. Do not execute any task instruction until Aaron answers.
   - **NOT-READY** — refuse. Surface the verdict block. Route back to the named owner skill(s) (haven-mapper / dev-tasker / ux-wireframe) to fix blockers. Do not execute any task instruction. Do not attempt to self-heal the plan.

Append the verdict to `apps/[persona]/design/slices/[slice-id]/plan-readiness-log.md` (create if missing). One row per run: date, verdict, concern count, blocker count.

After completing all steps in next-task.md:

Spawn a sub-agent with this instruction:
"You are the Haven UI QA agent. Read `.project-docs/agent-workflow/skills/haven-pl-qa.md` and run the full QA checklist against the component that was just built. The component name and files are in the most recent completion report above. Output the full QA report. If any check FAILs, fix the issue and re-run only that check before declaring PASS."

Do not commit until the QA sub-agent returns a PASS verdict on all required checks.

After QA passes, run:
```
git add [specific files from the completion report]
git commit -m "[description from completion report]"
```

Stage only files the task touched — never `git add -A`, `git add .`, or `git commit -a`. See this repo's `CLAUDE.md` and `Lab/CLAUDE.md` → "Do not commit unrelated files".
