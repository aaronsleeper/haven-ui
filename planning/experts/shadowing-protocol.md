# Expert Shadowing & Bootstrapping Protocol

> New experts start cold — their judgment frameworks are theoretical until
> tested against real cases. This protocol defines how experts earn their way
> from draft spec to live workflow participation through structured shadow
> runs, comparison analysis, and gated graduation.
>
> Supersedes the shadow mode placeholder in `fallback-modes.md` (graduation
> protocol, section 1). Referenced by `expert-spec.md` (lifecycle),
> `fallback-modes.md` (graduation), and `system-postmortem.md` (stuck
> fallback trigger).

---

## When to shadow

Shadowing is not a single event — it's triggered by three distinct situations,
each with different comparison targets and graduation thresholds.

### Trigger 1: New expert activation

An expert spec is complete (all 9 layers authored) and ready for first live
use. The expert has never processed a real case.

**Comparison target:** Whatever is currently handling the step — fallback
mode (checklist, human-covers, peer-covers) or direct human execution.

**Minimum runs:** 5. Cold-start experts need enough cases to surface pattern
mismatches between theoretical judgment frameworks and real-world inputs.

**Graduation threshold:** Full criteria (see graduation section below).

### Trigger 2: Fallback graduation

An expert is replacing a fallback mode in a specific workflow step. The
fallback has been running and accumulating retro data. This is the case
described in `fallback-modes.md` — this protocol now governs it.

**Comparison target:** The fallback mode's output (checklist results,
human-covers decisions, peer-covers output).

**Minimum runs:** 5. Same as new activation — even though the expert may
exist elsewhere, this is its first time in this workflow step.

**Graduation threshold:** Full criteria, plus: the expert must demonstrate
it catches issues the fallback missed (value-add over the fallback, not
just equivalence).

### Trigger 3: Major spec revision

A live expert receives a significant update to its judgment framework,
domain knowledge, or quality criteria. The update needs a regression check
before the new version goes live.

**What qualifies as "major":** Changes to decision trees or heuristics in
the judgment framework, new or removed domain knowledge sub-domains,
modified quality criteria thresholds. Typo fixes, retro log consolidation,
and dependency table updates are not major.

**Comparison target:** The current live version of the same expert.

**Minimum runs:** 3. The expert already has calibration data — this is a
targeted check, not a cold start.

**Graduation threshold:** Regression-focused criteria (see graduation
section below).

---

## Shadow mechanics

### Execution model

The shadow expert runs in parallel with the live process. Its output is
captured but never consumed by the workflow.

```
Workflow step execution (shadow active):

  Input ──┬──→ [Live path: fallback / human / current expert] ──→ Handoff envelope (used)
          │
          └──→ [Shadow expert] ──→ Shadow output (captured, not used)
                                         │
                                         ▼
                                  Comparison log
```

**What "not consumed" means concretely:**

- Shadow output does not enter the handoff envelope
- Downstream steps never see shadow output
- The workflow's SLA clocks are unaffected — shadow runs don't add latency
  to the live path
- Queue priority (per `queue-prioritization.md`) is calculated from the live
  path only — shadowing is invisible to the QueueManager
- The workflow's degradation state reflects the live path, not the shadow

### Context loading

The shadow expert loads the same context profile it would use in live mode
(typically the core work profile from `expert-spec.md`: README +
domain-knowledge + judgment-framework + output-contract + task-routing).
This ensures the shadow is tested under realistic context conditions, not
an artificially generous loading.

### Concurrency limit

Shadow no more than **2 experts simultaneously** per workflow instance.
Each shadow run adds one expert invocation's worth of compute and context.
Shadowing 3+ experts at once in a single workflow creates diminishing
returns — the comparison analysis becomes complex and the compute cost
scales linearly.

If 3+ experts need shadowing in the same workflow, stagger them: shadow
the experts in dependency order (upstream first) so downstream experts
can eventually shadow against real upstream output, not fallback output.

---

## Comparison protocol

Each shadow run produces a structured comparison entry in the shadow log.

### Comparison record

```
shadow_comparison {
  shadow_run_id: string
  workflow: string
  step_id: string
  expert: string
  expert_version: string
  trigger: "new_activation" | "fallback_graduation" | "spec_revision"
  timestamp: datetime

  live_output: object          — what the live path produced
  live_source: string          — "fallback:checklist" | "fallback:human-covers" | "expert:v1.2" | etc.
  shadow_output: object        — what the shadow expert produced

  delta: {
    classification: "agreement" | "minor_divergence" | "major_divergence" | "error"
    summary: string            — 2-3 sentences: what differs and why it matters
    affected_fields: []        — which output contract fields diverged
    safety_relevant: boolean   — does the divergence affect patient safety?
  }

  human_correction: {
    corrected: boolean         — did a human modify the live output at a downstream gate?
    correction_summary: string — what the human changed
    shadow_would_have_caught: boolean  — would the shadow output have avoided the correction?
  }
}
```

### Delta classifications

| Classification | Definition | Implication |
|---|---|---|
| **Agreement** | Shadow and live outputs reach the same conclusion on all material fields | Positive signal — expert aligns with established baseline |
| **Minor divergence** | Same direction, different emphasis or detail level | Expected and often desirable — the expert should add nuance beyond a checklist |
| **Major divergence** | Different conclusion on a material field | Requires individual review. May indicate a judgment framework gap or a case where the expert is actually right and the fallback was wrong |
| **Error** | Shadow output is malformed, violates the output contract, or fails quality criteria | The expert has a spec problem — fix before continuing shadow runs |

### Human correction signal

The highest-value calibration data comes from human corrections at
downstream gates. When an RDN modifies a care plan at step 4, that
correction reveals gaps in everything upstream — including the shadow
expert's output.

For each human correction during the shadow period:

1. Check whether the shadow output would have produced the same issue
   the human corrected
2. If yes: the shadow expert has the same gap as the live path — expected
   for fallback graduation, concerning for spec revision
3. If no (shadow would have avoided the correction): strong positive signal
   — the expert adds value over the current live path
4. Log the finding in the comparison record

---

## Graduation criteria

### Full criteria (triggers 1 and 2: new activation, fallback graduation)

An expert graduates from shadow to live when **all five conditions** are met:

| # | Criterion | Threshold | Rationale |
|---|---|---|---|
| 1 | **Minimum run count** | >= 5 completed shadow runs | Enough cases for basic pattern detection across different patient profiles and edge cases |
| 2 | **Agreement rate** | >= 80% of runs classified as agreement or minor divergence | The expert doesn't need to be identical to the baseline — minor divergences are expected and often represent value-add. Major divergences need explanation. |
| 3 | **No safety misses** | Zero runs where the shadow output would have missed a safety-critical issue that the live path caught | Non-negotiable. A single safety miss resets the shadow counter and requires a judgment framework review. Per principle #1: safety before speed. |
| 4 | **Quality criteria pass rate** | >= 90% of shadow outputs pass the expert's own quality-criteria.md checks | The expert must meet its own standards. The 10% margin accounts for edge cases that may require quality criteria refinement, not expert failure. |
| 5 | **Human approval** | Human reviews the comparison log and approves cutover | Per principle #11 (propose, never self-apply). The expert and the shadowing protocol propose graduation; a human authorizes it. |

**Additional criterion for fallback graduation (trigger 2):** The shadow
expert must demonstrate at least one case where it caught an issue or added
nuance that the fallback missed. Pure equivalence with a checklist doesn't
justify the expert's existence — the expert must show value-add.

### Regression criteria (trigger 3: spec revision)

| # | Criterion | Threshold | Rationale |
|---|---|---|---|
| 1 | **Minimum run count** | >= 3 completed shadow runs | Shorter because the expert already has calibration data; this is a targeted check |
| 2 | **No regressions on unchanged areas** | Output on fields unrelated to the spec change matches the previous version on >= 90% of runs | The update should improve targeted areas without degrading others |
| 3 | **Improvement on targeted areas** | At least 1 run shows measurable improvement in the area the spec change targeted | The change should do what it intended |
| 4 | **No new safety misses** | Zero safety-relevant regressions | Same non-negotiable standard as full criteria |
| 5 | **Human approval** | Human reviews comparison log focused on the changed areas | Lighter review — focused on the delta, not the full expert |

### Graduation failure

When an expert fails to meet graduation criteria after its minimum runs:

1. **Diagnose** — Review the comparison log for patterns. Are the major
   divergences concentrated in specific output fields? Specific case types?
2. **Adjust** — Propose targeted spec updates (judgment framework heuristics,
   domain knowledge gaps, quality criteria recalibration) based on the
   diagnosis
3. **Re-shadow** — After spec adjustments, reset the shadow counter. The
   minimum run count restarts.
4. **Escalate** — If the expert fails graduation twice, escalate to the
   system postmortem process. The expert may be scoped wrong, the workflow
   step may need redesign, or the fallback may be the right long-term
   answer.

---

## Retro log seeding

Shadow runs produce calibration data that seeds the expert's retro log,
giving it a head start on self-assessment when it goes live.

### Shadow-era entries

Each shadow run's comparison record translates to a retro log interaction
summary tagged `[shadow]`:

```markdown
### YYYY-MM-DD — [shadow] Care plan draft, patient P-1234

**Task:** Draft care plan from structured assessment (step 1.0, care-plan-creation)
**Shadow output:** Goals: [3 goals], nutrition plan: 1800cal diabetic-appropriate
**Live output:** Checklist: all items passed, RDN drafted manually
**Delta:** Minor divergence — shadow included BH screening note that checklist omitted
**Human correction:** RDN added potassium restriction at step 4 — shadow also missed this
**Layers affected:** domain-knowledge (renal + diabetic interaction), judgment-framework
```

### Fallback-era entries

Interaction summaries accumulated during the fallback period (before
shadowing began) transfer to the expert's retro log with a `[fallback-era]`
tag. These entries show the landscape the expert is inheriting:

- What humans corrected (highest signal — patterns here are the expert's
  first calibration priorities)
- What the checklist or fallback caught vs. missed
- Where peer-covers produced out-of-domain errors
- Common case profiles that the expert will encounter

### Entry lifecycle

Shadow and fallback-era entries follow the same consolidation protocol as
regular retro log entries (per `expert-spec.md`): they consolidate into
patterns during the first `/expert-update` sweep after the expert goes live.
The `[shadow]` and `[fallback-era]` tags are preserved in consolidated
learnings so the expert's self-assessment can distinguish pre-live
calibration from live experience.

---

## Cutover

When graduation criteria are met and human approval is granted:

### Activation

1. The workflow step's `fallback` field is removed (or the previous expert
   version reference is updated)
2. The expert's README metadata updates: `health: draft` → `health: green`
   (or the version increments for spec revision cutover)
3. The `degradation` block drops from the handoff envelope for that step
4. The step's degradation contribution disappears from the workflow's
   degradation manifest on subsequent runs
5. The registry (`experts/README.md`) is updated with the new health status
   and last-validated date

### No gradual blend

An expert is either active or it's not. Running half-expert-half-checklist
creates ambiguous accountability — who owns the output? Clean cutover
avoids this. This principle carries forward from `fallback-modes.md`.

### Rollback

If the newly-live expert produces unexpected results in its first 3 live
runs (human overrides, quality criteria failures, safety flags):

1. The expert reverts to shadow mode immediately
2. The previous live path (fallback or prior version) resumes
3. The problematic live runs are logged as high-priority retro entries
4. The expert re-enters the graduation pipeline with its shadow counter reset
5. If the expert was replacing a fallback, the degradation block returns to
   the handoff envelope

Rollback is the expert equivalent of reverting a deploy. It should be fast
(one workflow configuration change) and safe (the previous path was already
working).

---

## Concrete scenario: Clinical Care expert activation

The Clinical Care expert is planned but unbuilt. The care-plan-creation
workflow runs steps 1 (draft) and 2a (clinical review) via fallback:
`human-covers` and `checklist` respectively.

**Phase 1 — Fallback period:**
The workflow runs with fallbacks. Each run accumulates retro data: what the
RDN drafted manually (step 1), what the clinical checklist caught and missed
(step 2a), what the RDN corrected at step 4. This data accumulates with
`[fallback-era]` tags.

**Phase 2 — Expert spec authored:**
Clinical Care expert directory is created with all 9 layers. Health: draft.
The expert has theoretical knowledge but zero real-case calibration.

**Phase 3 — Shadow activation:**
Shadow mode is activated for steps 1 and 2a simultaneously (2 experts
shadowed = at concurrency limit). For each care plan run:
- Step 1: Clinical Care drafts a care plan in shadow. The RDN still drafts
  manually via `human-covers`. Both outputs are compared.
- Step 2a: Clinical Care reviews the (RDN-drafted) care plan in shadow.
  The clinical checklist still runs live. Both outputs are compared.

**Phase 4 — Comparison analysis (after 5+ runs):**
- Step 1 shadow: 3 agreements, 1 minor divergence (shadow included more
  detailed BH section), 1 major divergence (shadow missed a drug-nutrient
  interaction the RDN caught). Agreement rate: 80%. One safety-adjacent
  miss — review needed.
- Step 2a shadow: 4 agreements, 1 minor divergence (shadow flagged a subtle
  guideline deviation the checklist missed). Agreement rate: 100%.
  Value-add demonstrated.

**Phase 5 — Graduation decision:**
Step 2a is ready: high agreement rate, demonstrated value-add over checklist,
no safety misses. Human approves cutover.

Step 1 needs work: the drug-nutrient interaction miss points to a gap in
domain-knowledge.md. Spec is updated, shadow counter resets for step 1
(trigger 3: spec revision, minimum 3 runs). Step 2a goes live while step 1
continues shadowing.

**Phase 6 — Step 1 cutover:**
After 3 more shadow runs with the updated spec, step 1 shows no further
safety misses. Human approves. Both steps now run with the live Clinical
Care expert. `human-covers` fallback for step 1 and `checklist` fallback
for step 2a become dormant (retained in config for rollback).

---

## Relationship to other specs

| Spec | Connection |
|---|---|
| `fallback-modes.md` | This protocol supersedes the graduation protocol placeholder (sections 1-4). Fallback-era retro log seeding is formalized here. |
| `expert-spec.md` | Shadow and fallback-era entries follow the retro log format and consolidation rules defined there. Lifecycle status transitions (draft → green) are governed by graduation criteria here. |
| `queue-prioritization.md` | Shadow runs are invisible to the QueueManager. The live workflow's priority is unaffected by shadowing activity. |
| `system-postmortem.md` | Stuck fallback trigger (2+ quarters with no shadow activity) references this protocol. Double graduation failure escalates to system postmortem. |
| `shared-principles.md` | #1 (safety before speed): zero-tolerance safety miss criterion. #11 (propose, never self-apply): human approval required for graduation. |
| `workflow-spec.md` | Shadow runs respect step-level context loading profiles. Cutover updates the step's fallback field. |
