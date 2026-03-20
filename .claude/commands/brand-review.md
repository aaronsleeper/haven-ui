# Brand Review

Reviews a pattern library component (or section) against the Cena Health brand spec
and produces actionable recommendations for Aaron to approve.

## Usage

Run as: `/brand-review` (reviews next unreviewed component)
Or: `/brand-review {component name}` (reviews a specific component)

## Step 1: Find the target

If a specific component was named in the command argument, use that.

Otherwise, read `.project-docs/COMPONENT-REGISTRY.md` and find the first row where
Status = `built` (not yet `brand-reviewed`). That is the target.

If no `built` rows remain (all are `brand-reviewed` or `missing`), output:
"All built components have been brand-reviewed. Run /pl-build to build more components first."
Then stop.

## Step 2: Spawn a brand analyst sub-agent

Spawn a sub-agent with this instruction:

"You are the Haven UI Brand Analyst. Your task is to review the {component name} component
against the Cena Health brand specification.

Read these files before reviewing anything:
1. `.project-docs/agent-workflow/skills/haven-brand-analyst.md` — your full review protocol
2. `/Users/aaronsleeper/Desktop/Vaults/Lab/cena-health-brand/.agents/PROJECT-CONTEXT.md`
3. `/Users/aaronsleeper/Desktop/Vaults/Lab/cena-health-brand/principles/design-principles.md`
4. `pattern-library/components/{component-file}.html`
5. The relevant sections of `src/styles/tokens/components.css`

Produce the full brand review report in the format specified in the skill file.
Do not modify any files — proposals only."

## Step 3: Present to Aaron

Output the brand analyst's full report. Ask:

"Review the recommendations above. For each High Priority item, confirm:
- Approve and implement now
- Approve but defer to next sprint
- Reject (with reason)

Reply with your decisions and I will implement the approved changes."

## Step 4: Implement approved changes

For each approved recommendation:
1. Make the specific change described (CSS or HTML)
2. Verify at localhost:5173
3. Note any judgment calls

## Step 5: Mark brand-reviewed

After all approved changes are implemented:
1. Update `.project-docs/COMPONENT-REGISTRY.md` — change Status from `built` to `brand-reviewed`
2. Run:
```
git add -A
git commit -m "brand: review and update {component name} per Cena brand spec"
```
