# Workflow Spec Template

> The standard anatomy for multi-expert workflows in the Ava system. Experts own
> capabilities; workflows own choreography. This template defines how experts
> collaborate to accomplish business processes.
>
> Companion to `expert-spec.md`. References coordination patterns from
> `architecture/agent-framework.md`.

---

## Directory structure

```
workflows/<workflow-name>/
├── README.md             ← Identity, metadata, trigger conditions, participating experts
├── steps.md              ← Step definitions with expert assignments and coordination patterns
├── context-budget.md     ← Per-step expert loading profiles (minimum viable context)
├── checkpoints.md        ← Human gates: what humans see, decide, and how decisions route
└── retro-log.md          ← Workflow-level retrospective (run metrics, handoff friction, SLA)
```

---

## Commander's intent

Every workflow README includes a commander's intent section — a statement of purpose
that lives above individual steps and enables adaptive recovery when the playbook
breaks down. An experienced coordinator carries this information in their head;
making it explicit lets orchestrators and experts reason about *why* a workflow
exists, not just *what* it does.

The intent section has three components:

### Intent statement

2-3 sentences answering: What outcome does this workflow exist to produce? What
matters most? What tension does it navigate? Written so that an orchestrator who
has never seen the step definitions could reason about which recovery path serves
the workflow's purpose.

### Priority stack

An ordered list of concerns. When steps fail and the orchestrator must choose
between competing recovery paths, it walks this stack top-down. A higher-ranked
concern is never sacrificed for a lower-ranked one.

### Acceptable degradation boundary

What the workflow can lose and still be considered successful vs. what loss means
the workflow has fundamentally failed. This is where commander's intent connects
to the fallback system: when a step runs in fallback mode, the orchestrator checks
whether the degradation crosses this boundary before proceeding.

- **Above the line:** Degradations that are acceptable — the workflow continues.
- **Below the line:** Degradations that mean the workflow has fundamentally failed
  — pause, escalate, do not activate the output.

### How the orchestrator uses intent

1. **On step failure:** Before selecting an `error_route`, evaluate which path
   best serves the priority stack. A retry that delays activation by hours may
   be correct if patient safety is at stake; a skip-and-flag may be correct if
   only presentation quality is affected.
2. **On fallback activation:** Check the acceptable degradation boundary. A step
   running degraded on a concern *above the line* proceeds. A step running
   degraded on a concern *below the line* pauses the workflow.
3. **On conflict escalation:** Surface the intent statement alongside both expert
   positions so the human reviewer can reason about tradeoffs with the workflow's
   purpose in mind.
4. **On novel situations:** When something happens that no step's `error_route`
   anticipated, the intent statement is the orchestrator's decision framework.

---

## Step anatomy

Each step in a workflow defines these fields:

| Field | Description |
|---|---|
| **step_id** | Sequential identifier (e.g., `3.1`, `3.2a`) — branches use letter suffixes |
| **name** | Short description of what this step accomplishes |
| **expert** | Which expert(s) execute this step — references `experts/<name>/` |
| **coordination** | Which pattern from agent-framework.md: `sequential`, `fan-out`, `human-gate`, `event-driven` |
| **input** | What this step receives — references upstream step output or external trigger |
| **output** | What this step produces — references the expert's `output-contract.md` entry |
| **model_tier** | `deep` (Opus), `standard` (Sonnet), or `light` (Haiku) — inherits from expert's task-routing unless the workflow overrides |
| **autonomy** | `autonomous`, `notify`, or `gate` — inherits from expert's escalation-thresholds unless the workflow overrides |
| **sla** | Maximum time for this step to complete, including human wait time if gated |
| **error_route** | What happens on failure: retry, skip with flag, escalate, or halt workflow |
| **fallback** | Degradation behavior when the assigned expert is unavailable — mode, substitute, checklist path, confidence cap. See [fallback-modes.md](../experts/fallback-modes.md) for the type catalog. Omit if the expert is built and green-health. |

**Override principle:** Workflows can tighten an expert's defaults but not loosen them.
If an expert's escalation-thresholds say "gate," the workflow cannot downgrade to
"autonomous." Workflows can upgrade "autonomous" to "notify" or "gate" when the
process context demands it. The same principle applies to fallback modes: a
step-level fallback can be more conservative than the dependency default, not less.

**Fallback execution:** When a step's assigned expert is unavailable (planned,
red-health, or invalidated), the orchestrator checks for a `fallback` declaration
on the step. If present, it executes the fallback mode. If absent, it checks the
expert's `dependencies.md` for a default. If neither exists, the workflow halts
at that step and escalates to human. Fallback outputs include a `degradation`
block in the handoff envelope — see [fallback-modes.md](../experts/fallback-modes.md)
for the full protocol.

---

## Collaboration protocol

### Handoff format

When work passes between experts within a workflow, the sending expert produces a
**handoff envelope**:

```
handoff {
  from_expert: string
  from_step: string
  artifact: object        — the output per the expert's output-contract.md
  confidence: high | medium | low
  open_questions: []      — things the sending expert couldn't resolve
  context_summary: string — 3-5 sentences: what was done, what matters for the next step
  flags: []               — anything the receiving expert should check first
}
```

The receiving expert:
1. Verifies the artifact matches its expected input format
2. Reads open questions — these become its first priorities
3. Uses context_summary as orientation, not as authoritative reasoning
4. Logs any format mismatch as interface friction in both experts' retro logs

**Context boundary:** The receiving expert gets the handoff envelope, not the
sending expert's full reasoning chain. If the receiving expert needs upstream
reasoning, that's a signal the handoff envelope is underspecified — fix the
envelope, don't widen the context window.

### Conflict resolution

When experts in a workflow disagree (e.g., UX wants a pattern that Compliance
rejects), resolution follows this hierarchy:

1. **Workflow-declared authority** — Each step declares which expert has final say
   for that step's domain. The step owner's judgment prevails within their scope.
2. **Constraint trumps preference** — Hard constraints (regulatory, safety, PHI)
   override soft preferences (UX polish, performance optimization). The expert
   owning the constraint documents the specific rule being applied.
3. **Escalate to human** — When authority is ambiguous or both experts hold hard
   constraints that conflict, the workflow halts at that step and surfaces both
   positions to the human checkpoint. The human decides; the decision is logged
   in the workflow retro log for future precedent.

Conflicts are always logged. Recurring conflicts between the same expert pair
signal that the workflow's authority assignments need revision.

### Ad-hoc convocation

When a case exceeds workflow choreography — domains are entangled, conflict
resolution is cycling, or the degradation boundary is crossed — the
orchestrator can convene an ad-hoc expert panel for joint deliberation.
This is the system's tumor board for problems that no predefined step
sequence anticipated.

Convocations use rounds-based deliberation (not simultaneous multi-expert
context), produce a gated recommendation, and reintegrate into the originating
workflow. Full protocol: [convocation-protocol.md](../experts/convocation-protocol.md).

### Context passing

Total context for a workflow step = shared context + expert context.

- **Shared context** loads once per workflow run: the workflow README, the
  patient/entity record, and relevant project docs. Not duplicated per expert.
- **Expert context** uses selective loading from `expert-spec.md`. Each step in
  `context-budget.md` declares which loading profile each participating expert
  uses (core work, design review, escalation check, convocation, etc.).
- **Budget rule:** A single workflow step should not exceed ~1,400 lines of expert
  context (2 experts × core work profile) plus shared context. Steps involving
  3+ experts should use fan-out with reduced profiles, not simultaneous full loads.

---

## Human checkpoints

Checkpoints map to the three autonomy tiers from `expert-spec.md`, applied at the
workflow level:

| Tier | Workflow behavior | What the human sees |
|---|---|---|
| **Autonomous** | Step executes, result logged in thread | Nothing — unless they check the thread |
| **Notify** | Step executes, human receives a summary | Handoff envelope summary + expert's confidence signal |
| **Gate** | Step stages a proposal, workflow pauses | Full handoff envelope + expert recommendation + approval/reject/modify controls |

**Checkpoint definition** in `checkpoints.md`:

```
checkpoint {
  after_step: string       — which step triggers this checkpoint
  tier: autonomous | notify | gate
  audience: string         — which role or person reviews
  sla: duration            — from agent-framework.md SLA table
  escalation: string       — what happens if SLA breaches
  decision_options: []     — what the human can do (approve, reject, modify, redirect)
  routing: {}              — where each decision option sends the workflow next
}
```

**Hardcoded gates:** Some checkpoints cannot be configured away — they are
regulatory or safety requirements. These are declared in the workflow README
and cannot be overridden by any step configuration. Examples: RDN sign-off on
care plans, coordinator approval on outbound FHIR documents.

**Feedback capture:** Every gate interaction captures structured feedback per
[human-expert-protocol.md](human-expert-protocol.md): approve (positive signal),
approve-with-changes (override record with reason), or reject (reason + redirect).
Override records flow to the assigned expert's retro log as the primary learning
signal. Checkpoint definitions should not add capture fields beyond what the
protocol requires — additional friction at gates reduces throughput.

---

## Workflow review system

Workflows accumulate performance data over runs. The retro log tracks:

### Run metrics (captured automatically per run)

| Metric | What it measures |
|---|---|
| **Cycle time** | Total wall-clock time from trigger to completion |
| **Step duration** | Time per step, including wait time at human gates |
| **Handoff re-requests** | How often a receiving expert asked for clarification or flagged format mismatch |
| **SLA breaches** | Which steps exceeded their declared SLA and by how much |
| **Conflict count** | How many inter-expert disagreements required escalation |
| **Human override rate** | How often gated steps were modified vs. approved as-is (override records per [human-expert-protocol.md](human-expert-protocol.md) include reason categories for pattern analysis) |

### Workflow retrospective

During `/expert-update`, workflows with accumulated run data are reviewed:

1. **Bottleneck detection** — Steps that consistently exceed SLA. Is it the expert,
   the model tier, or the human gate wait time?
2. **Handoff friction** — Steps with high re-request rates. Fix the handoff envelope
   or the upstream expert's output contract.
3. **Parallelization opportunities** — Sequential steps that don't actually depend on
   each other. Convert to fan-out.
4. **Tier calibration** — Steps where human override rate is near zero may be
   candidates for downgrading from gate to notify. Steps with high override rates
   may need a higher model tier or tighter quality criteria upstream.
5. **Expert splitting signals** — If one expert is the bottleneck across multiple
   workflows, it may be doing too much. Cross-reference with the expert's own
   retro log.

Retrospective findings produce proposed workflow edits (step reordering, tier
changes, handoff format updates) that require human approval before applying.

---

## Metadata (in README.md frontmatter)

```yaml
workflow: <name>
version: <semver>
created: <date>
last-validated: <date>
trigger: <what starts this workflow>
orchestrator: <which orchestrator from agent-framework.md owns this>
experts: [<list of participating expert names>]
health: green | yellow | red | draft
```

---

## Relationship to existing workflow docs

The domain workflow docs (`workflows/01-patient-operations.md`, etc.) describe
**what happens** in each domain. Workflow specs describe **how experts collaborate**
to make it happen. They are complementary:

- Domain docs define steps, data objects, error states, and domain logic
- Workflow specs define expert assignments, handoff protocols, context budgets,
  and review systems

A workflow spec references its domain doc for the step sequence and business rules,
then layers on the expert collaboration protocol defined here.
