Read the file `.project-docs/prompts/next-task.md` and execute all instructions in it exactly as written.

Before starting:
1. Read `CLAUDE.md` in full
2. Read `.project-docs/decisions-log.md` and extract every "Rule to follow in future prompts" entry
3. Apply relevant rules to each step of the task

After completing all steps in next-task.md:

Spawn a sub-agent with this instruction:
"You are the Haven UI QA agent. Read `.project-docs/agent-workflow/skills/haven-pl-qa.md` and run the full QA checklist against the component that was just built. The component name and files are in the most recent completion report above. Output the full QA report. If any check FAILs, fix the issue and re-run only that check before declaring PASS."

Do not commit until the QA sub-agent returns a PASS verdict on all required checks.

After QA passes, run:
```
git add -A
git commit -m "[description from completion report]"
```
