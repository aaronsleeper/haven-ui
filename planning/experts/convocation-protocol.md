# Ad-hoc Convocation Protocol

> When a case exceeds workflow choreography — too many interacting constraints,
> too much novelty, too many experts needing to reason about each other's
> reasoning — the orchestrator convenes an ad-hoc panel. This is the expert
> system's tumor board: structured enough to be repeatable, flexible enough
> to handle problems that no predefined step sequence anticipated.
>
> Referenced by `workflow-spec.md` (collaboration protocol). Reuses handoff
> envelopes, conflict resolution, and autonomy tiers from existing specs.

---

## When to convene (trigger boundary)

The distinction between "workflow with more steps" and "genuine convocation" is:
**Can this be solved by adjusting step parameters, or does it require experts
reasoning about each other's reasoning?**

Workflows handle cases where each expert's contribution is independent — review
in parallel, reconcile mechanically, resolve conflicts by authority rules. A
convocation is needed when the experts' domains are entangled: the nutrition
plan depends on the compliance interpretation, which depends on the behavioral
health assessment, which changes the nutrition plan.

### Trigger signals

| Signal | Detection | Example |
|---|---|---|
| **Conflict cycling** | Step 3a (or equivalent reconciliation) loops 2+ times without resolution | Clinical and Compliance keep overriding each other's changes |
| **Multi-domain entanglement** | 3+ review findings reference each other's domains, not just their own | UX flags that the compliance constraint makes the care plan unreadable for the RDN, who needs the clinical context that compliance wants hidden |
| **Degradation boundary crossed** | Fallback-mode degradation pushes the workflow below its acceptable degradation boundary (commander's intent) | Two experts running in fallback simultaneously — combined confidence too low for a safe care plan |
| **Complexity threshold** | Case metadata exceeds workflow-declared complexity bounds | 6+ active diagnoses with conflicting dietary restrictions, or unusual insurance requiring manual benefit interpretation |
| **Human request** | A human reviewer at any gate requests multi-expert deliberation | RDN sees a case they're not comfortable approving without talking to the BHN and a compliance check |

**Not a convocation:** A single expert needing more information from another
expert. That's a handoff envelope clarification — fix the interface, don't
convene a panel. Convocations are for problems that require joint reasoning,
not sequential information exchange.

---

## Anatomy of a convocation

### Assembly

The orchestrator proposes a panel. A human approves before the convocation
begins — convocation assembly is always `gate` tier.

**Panel composition:**

| Role | Who | Required? |
|---|---|---|
| **Facilitator** | The expert closest to the case's primary domain, or the orchestrator if no expert has clear ownership | Yes — exactly one |
| **Panelists** | Experts whose domains are entangled in the case | Yes — minimum 2, recommended max 5 |
| **Originating workflow** | Reference to the workflow and step that triggered the convocation | Yes — this is where the output reintegrates |

The facilitator is a panelist who also owns synthesis. They don't outrank other
panelists on domain questions — they own the process, not the conclusions.

### Case briefing

The facilitator prepares a **case briefing** before the first round — a
structured summary that replaces each expert's need to load domain-specific
case data independently.

```
case_briefing {
  convocation_id: string
  originating_workflow: string
  originating_step: string
  trigger_signal: string          — which trigger from the table above
  patient_summary: object         — relevant demographics, diagnoses, constraints
  workflow_state: object          — what the workflow has produced so far
  entanglement_map: string        — which domains are interacting and why
  question: string                — the specific question the panel must answer
  commander_intent: string        — from the originating workflow's README
  constraints: []                 — hard constraints that cannot be violated
  time_box: duration              — maximum wall-clock time for deliberation
}
```

The `question` field is critical. A convocation without a clear question
drifts. "What should this patient's care plan look like?" is too broad.
"How do we reconcile the renal diet restriction with the high-calorie
requirement given this patient's insulin regimen?" is answerable.

---

## Deliberation protocol

Convocations use **structured rounds**, not simultaneous multi-expert context.
Each round is a sequence of independent expert invocations that read and
contribute to a shared **deliberation record**.

### Round structure

```
Round N:
  1. Each panelist receives: case briefing + deliberation record + own profile
  2. Each panelist contributes: a position statement on the question
  3. Facilitator receives: all position statements + deliberation record
  4. Facilitator synthesizes: updates deliberation record, identifies
     convergence or remaining disagreements, frames next round's focus
```

Panelist invocations within a round are independent — they can run in parallel
(fan-out). The facilitator step is sequential (waits for all panelists).

### Deliberation record

The deliberation record is the convocation's shared memory. It accumulates
across rounds and is the primary input for each subsequent round.

```
deliberation_record {
  convocation_id: string
  round: number
  positions: [
    {
      expert: string
      position: string            — 3-10 sentences: expert's answer to the question
      constraints_cited: []       — which hard constraints inform this position
      confidence: high | medium | low
      dissents_from: []           — which other positions this disagrees with, and why
      defers_to: []               — which other experts this yields to, and on what
    }
  ]
  synthesis: {
    convergence: string           — where panelists agree
    open_disagreements: []        — where they don't, with both sides stated
    next_round_focus: string | null  — what the next round should resolve (null = converged)
  }
}
```

### Convergence and termination

A convocation ends when any of these conditions is met:

| Condition | Outcome |
|---|---|
| **Consensus** | All panelists' positions are compatible. Facilitator drafts the recommendation. |
| **Authority resolution** | Remaining disagreements resolve via the conflict resolution hierarchy from workflow-spec.md (constraint trumps preference, then declared authority, then escalate). |
| **Time box expired** | Facilitator synthesizes best-available recommendation with explicit uncertainty flags. |
| **Round limit** | Maximum 3 rounds. If no convergence after 3 rounds, the facilitator produces a structured escalation to human with all positions documented. |
| **Facilitator judgment** | Facilitator determines that further rounds won't produce new information. |

The 3-round limit is a context budget constraint, not an arbitrary number —
each round adds ~50 lines to the deliberation record, and the total must stay
within the per-invocation budget.

---

## Context budget

The hard constraint. Convocations are expensive — the protocol is designed to
stay within the ~1,400-line per-invocation budget established in workflow-spec.md.

### Convocation loading profile

Each panelist loads a **convocation profile** — lighter than the core work
profile, heavier than the escalation check profile:

| Layer | Loaded? | Rationale |
|---|---|---|
| README | Yes | Identity and scope |
| judgment-framework | Yes | This is a judgment task — the expert needs its decision-making tools |
| output-contract | No | The convocation has its own output format |
| domain-knowledge | No | Case-relevant knowledge is in the case briefing |
| quality-criteria | No | Not producing a standard output |
| All other layers | No | Not relevant to deliberation |

**Per-expert convocation context: ~130 lines** (README ~30 + judgment-framework ~100).

### Budget math

| Component | Lines | Notes |
|---|---|---|
| Case briefing | ~100-150 | Loaded once per invocation |
| Expert convocation profile | ~130 | Per panelist, per invocation |
| Deliberation record (round 1) | ~0 | Empty on first round |
| Deliberation record (round 2) | ~80 | Positions + synthesis from round 1 |
| Deliberation record (round 3) | ~160 | Cumulative |

**Per-invocation totals (4-expert panel):**

| Round | Panelist invocation | Facilitator invocation |
|---|---|---|
| 1 | ~280 (briefing + profile) | ~530 (briefing + profile + 4 positions) |
| 2 | ~360 (+ round 1 record) | ~610 |
| 3 | ~440 (+ round 2 record) | ~690 |

All under the ~1,400-line budget, with room for a 5th panelist.

### Budget discipline

- **5-expert maximum** is a context budget constraint, not an organizational one.
  A 6th expert pushes round 3 facilitator invocations past ~800 lines — still
  under budget, but leaving less room for complex case briefings.
- **If the case briefing exceeds 200 lines**, reduce the panel to 3 experts or
  load only the judgment-framework (skip README) for panelists.
- **The facilitator's invocation is always the most expensive** — it reads all
  positions plus the deliberation record. Monitor this.

---

## Output

### Recommendation types

The convocation produces one of three output types:

| Type | When | What it contains |
|---|---|---|
| **Step overrides** | The originating workflow can continue with modified parameters | Specific step-level changes: different expert assignments, tightened autonomy tiers, additional gates, modified handoff requirements |
| **One-time plan** | The case doesn't fit any workflow's step sequence | A bespoke sequence of actions for this specific case, structured like a workflow's steps.md but not reusable |
| **Escalation** | The panel cannot produce a safe recommendation | Structured presentation of all positions, disagreements, and the facilitator's assessment of why convergence failed — for human decision |

### Output format

The convocation recommendation wraps in a standard handoff envelope with a
`convocation` block:

```
handoff {
  from_expert: string             — facilitator
  from_step: "convocation"
  artifact: {
    type: "step_overrides" | "one_time_plan" | "escalation"
    recommendation: object        — type-specific content
    deliberation_summary: string  — 5-10 sentences: how the panel reached this
    dissenting_views: []          — positions that didn't make it into the recommendation
    round_count: number
    confidence: high | medium | low
  }
  open_questions: []
  context_summary: string
  flags: []
  convocation: {
    convocation_id: string
    panel: []                     — which experts participated
    trigger_signal: string
    originating_workflow: string
    originating_step: string
    time_elapsed: duration
  }
}
```

### Autonomy tier

Convocation recommendations are **always `gate`**. A multi-expert deliberation
about a novel problem is exactly the situation where human judgment is
non-negotiable. The human sees:

- The recommendation with its type and confidence
- The deliberation summary
- Any dissenting views
- The commander's intent from the originating workflow

The human can: accept, modify, reject, or request another round of deliberation
(which starts a new convocation, not a 4th round of the current one).

---

## Reintegration

After human approval, the recommendation feeds back into the originating
workflow:

| Output type | Reintegration path |
|---|---|
| **Step overrides** | Orchestrator applies overrides to the remaining steps. Workflow resumes from the step that triggered the convocation. Overrides are logged in the workflow retro log. |
| **One-time plan** | Orchestrator executes the bespoke plan as a sub-workflow. When complete, it produces the artifact the originating workflow was expecting, and the workflow resumes. |
| **Escalation** | Workflow pauses. Human makes the decision. Decision is logged as a precedent in the workflow retro log. |

**Degradation manifest interaction:** If the convocation was triggered by
degradation, the recommendation's confidence inherits the most severe
degradation signal from its inputs (per fallback-modes.md propagation rule).
A convocation doesn't launder degraded confidence — it reasons about it.

---

## Retro log

Convocations generate two types of retro entries:

### Workflow retro log

```markdown
### YYYY-MM-DD — Convocation [convocation_id]

**Trigger:** [which signal]
**Panel:** [expert list]
**Rounds:** [count]
**Output type:** [step_overrides | one_time_plan | escalation]
**Disposition:** [accepted | modified | rejected]
**Time elapsed:** [duration]
**Precedent value:** [high | medium | low] — could this inform a future workflow step or expert spec update?
```

### Expert retro logs

Each panelist gets an interaction summary in its own retro log:

```markdown
### YYYY-MM-DD — Convocation [convocation_id] (panelist)

**Task:** Deliberation on [question summary]
**Position:** [summary of this expert's position]
**Outcome:** [was the position reflected in the final recommendation?]
**Overrides:** [did the panel or human change this expert's recommendation?]
**Cross-domain learning:** [what did this expert learn from other panelists' positions?]
```

The `cross-domain learning` field is unique to convocation retro entries. It
captures knowledge that an expert wouldn't encounter in normal workflow
handoffs — exactly the kind of calibration signal that makes convocations
valuable beyond solving the immediate case.

---

## Relationship to workflows

| Concern | Workflow | Convocation |
|---|---|---|
| **When** | Known process, repeatable steps | Novel problem, entangled domains |
| **Expert interaction** | Sequential or fan-out, mediated by handoff envelopes | Rounds-based deliberation with shared record |
| **Context sharing** | Experts see envelopes, not each other's reasoning | Experts see each other's positions |
| **Output** | Predefined artifact per step's output contract | Recommendation: overrides, one-time plan, or escalation |
| **Autonomy** | Per-step, ranges from autonomous to gate | Always gate — novel problems require human approval |
| **Choreography** | Predefined step sequence | Facilitator-led, converges dynamically |
| **Cost** | Bounded by step count and model tiers | Higher — multiple experts × multiple rounds |

A convocation is not a failure of the workflow — it's the workflow correctly
recognizing that it's out of its depth. Workflows that frequently trigger
convocations for similar cases are candidates for new steps or new workflows
that encode the convocation's pattern (see system postmortem analysis
framework, question #6: spec-level gaps).
