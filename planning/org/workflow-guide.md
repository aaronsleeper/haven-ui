# Org Chart Workflow Guide

> How to use the org management skills together with gstack skills to maintain,
> review, and evolve the org chart. This is the recommended workflow — not rigid
> procedure, but a tested sequence that produces good results.

---

## Skill inventory

### Org management skills (project-ava-specific)

| Skill | Purpose | When to run |
|---|---|---|
| `/org-review` | Expert panel review (3 domain experts stress-test the org chart) | Quarterly, or after significant structural changes |
| `/org-qa` | Structural validation (completeness, consistency, broken links) | After any org chart edit, before `/org-review` |
| `/org-refresh` | Drift detection (sync org chart with workflows, roles, agents, decisions) | Monthly, or after batch project changes |

### gstack skills (general-purpose, relevant to org chart work)

| Skill | Purpose | When to use with org chart |
|---|---|---|
| `/plan-ceo-review` | Challenge strategy and scope — find the 10-star version | After `/org-review` surfaces strategic questions |
| `/plan-eng-review` | Validate architecture and implementation feasibility | When moving a function from "designed" to "building" |
| `/plan-design-review` | Evaluate design quality of plans and specs | When function files are being deepened for implementation |
| `/autoplan` | Run CEO + design + eng reviews as automated pipeline | Quarterly full review as alternative to manual sequence |
| `/office-hours` | Forcing questions for specific function areas | When exploring a new function or challenging assumptions |
| `/retro` | Track patterns and progress across implementation | Weekly during active org chart buildout |
| `/cso` | Security audit that should cross-reference info security function | Monthly, findings should update `information-security.md` |
| `/review` | Code review for org chart file changes | Before committing structural changes to org files |

---

## Workflow sequences

### Sequence 1: Quarterly full review

The comprehensive review cycle. Run quarterly or when the org chart has accumulated
significant changes.

```
/org-refresh          → Sync org chart with current project state
    ↓
/org-qa               → Validate structural integrity after refresh
    ↓
/org-review           → Expert panel identifies strategic gaps
    ↓
/plan-ceo-review      → Challenge the expert panel's recommendations
    ↓                    (run on the review output, not the org chart directly)
Apply changes         → Update function files based on review findings
    ↓
/org-qa               → Validate structural integrity after changes
    ↓
Commit                → chore(org): quarterly org chart review — [summary]
```

**Time estimate:** 1-2 sessions depending on findings.

**What this catches:** Structural drift, strategic blind spots, scaling risks,
automation targets that need revision, new functions that should be added.

### Sequence 2: Monthly maintenance

Light-touch maintenance to prevent drift from accumulating.

```
/org-refresh          → Detect drift, apply auto-updates
    ↓
/org-qa               → Validate integrity
    ↓
/cso                  → Security audit (if security-relevant changes occurred)
    ↓                    Cross-reference findings with information-security.md
Commit                → chore(org): monthly refresh — [summary]
```

**Time estimate:** 15-30 minutes if drift is minimal.

**What this catches:** Stale references, resolved open questions not reflected,
new agents or workflows not in the coverage map.

### Sequence 3: New function exploration

When you identify a potential new function or need to deepen an existing one.

```
/office-hours         → Forcing questions: what problem does this function solve?
    ↓                    Who needs it? What happens without it?
Draft function file   → Write the new org/functions/*.md
    ↓
/org-qa               → Validate the new file integrates cleanly
    ↓
/plan-eng-review      → If the function involves technical architecture,
    ↓                    validate feasibility and design
/org-review [focus]   → Run expert panel focused on the new function area
    ↓
Commit                → feat(org): add [function name] function
```

**What this catches:** Functions that seem necessary but aren't, missing interfaces,
unrealistic automation targets.

### Sequence 4: Pre-implementation review

When a function is moving from "planned" to "building" — the moment automation
targets become real commitments.

```
/org-refresh          → Ensure function file is current
    ↓
Score sub-functions   → Apply automation readiness rubric (org/automation-readiness.md)
    ↓
/plan-eng-review      → Architecture review of the function's agent design
    ↓
/plan-design-review   → Design quality of the function's workflows and interfaces
    ↓
/autoplan             → (Alternative) Run all three plan reviews as pipeline
    ↓
Update function file  → Revise automation targets based on review findings
    ↓
/org-qa               → Validate changes
    ↓
Commit                → feat(org): finalize [function] for implementation
```

**What this catches:** Automation targets that looked feasible on paper but aren't,
architectural gaps in the agent framework, design quality issues.

### Sequence 5: Post-implementation reconciliation

After a function (or significant sub-function) ships.

```
/retro                → What did we learn? What was harder/easier than expected?
    ↓
Update function file  → Revise automation status from "designed" to "live"
    ↓                    Update "current state" section
    ↓                    Revise rubric scores based on actual experience
/org-qa               → Validate changes
    ↓
Commit                → chore(org): update [function] — now live
```

**What this catches:** Rubric scores that were wrong (recalibrates future scoring),
automation targets that shifted during implementation, lessons for other functions.

---

## Decision guide: which sequence to run

| Situation | Sequence |
|---|---|
| End of quarter | 1 (Quarterly full review) |
| End of month (no major changes) | 2 (Monthly maintenance) |
| "We need a function for X" | 3 (New function exploration) |
| "Let's build the revenue cycle agents" | 4 (Pre-implementation review) |
| "Revenue cycle is live" | 5 (Post-implementation reconciliation) |
| Just edited a function file | `/org-qa` only |
| Major decision made (new AD-XX) | `/org-refresh` → `/org-qa` |
| Multiple open questions resolved | `/org-refresh` → `/org-qa` |
| Security concern raised | `/cso` → update `information-security.md` → `/org-qa` |

---

## Anti-patterns

- **Running `/org-review` on stale data.** Always `/org-refresh` first.
- **Skipping `/org-qa` after changes.** Structural errors compound — catch them immediately.
- **Running the full quarterly sequence monthly.** The monthly maintenance sequence exists to keep things tidy without the overhead. Save the full review for real inflection points.
- **Treating review findings as requirements.** Expert panel findings are input to decisions, not decisions themselves. Aaron decides what gets implemented.
- **Editing org files without committing.** The org chart is a living document — uncommitted changes create phantom drift that `/org-refresh` can't detect.
