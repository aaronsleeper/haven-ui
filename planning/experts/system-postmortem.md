# System-Level Postmortem

> The cross-cutting retrospective layer. Expert retro logs and workflow retro logs
> capture per-unit performance data; the system postmortem synthesizes signals
> across the full registry to surface patterns no individual retro log can see.
>
> Referenced by `README.md` (roadmap item #3). Consumes data from `expert-spec.md`
> (retro log) and `workflow-spec.md` (workflow review system).

---

## Purpose

Catch patterns that emerge only when reading across the full expert and workflow
registry. Three categories of signal this process exists to detect:

1. **Recurring cross-unit friction** — The same issue appears in multiple expert
   retro logs or workflow retro logs independently. Each unit logs it; none
   connects them. Example: Compliance flags the same PHI rendering concern in
   3 different workflows this quarter.

2. **Systemic structural problems** — Expert pairs that consistently produce
   handoff friction, dependency relationships that generate more rework than
   value, workflow steps that bottleneck across every workflow they appear in.

3. **Stalled lifecycle signals** — Fallback modes that never graduate, planned
   experts that block multiple workflows but aren't progressing, draft experts
   that accumulate retro data without validation.

The postmortem does not replace per-expert self-assessment or per-workflow
retrospectives. It reads their outputs and asks: "What do these say together
that none of them says alone?"

---

## Trigger conditions

### Cadence trigger

**Quarterly**, aligned with retro log consolidation. Runs *after* the quarterly
`/expert-update` sweep so it consumes freshly-consolidated retro logs rather
than raw entries.

Sequence: `/expert-update` (consolidates retro logs, runs reviews) → system
postmortem (synthesizes across registry) → targeted follow-ups.

### Threshold triggers

Between quarterly runs, a postmortem fires early if any of these conditions
are met:

| Trigger | Threshold | Rationale |
|---|---|---|
| **Cross-unit signal density** | 3+ expert or workflow retro logs reference the same dependency, expert, or theme within a rolling 30-day window | Pattern is dense enough to act on now |
| **Optimization backlog depth** | Any workflow accumulates 5+ unactioned items in its optimization backlog | Backlog is growing faster than the quarterly cycle can drain it |
| **Stuck fallback** | Any fallback mode has been active for 2+ quarters with no shadow-mode activity | Graduation protocol isn't engaging — needs escalation |
| **Registry health shift** | 3+ experts move to yellow or red health in the same `/expert-update` sweep | Coordinated staleness suggests a systemic cause, not individual drift |

Threshold triggers produce a scoped postmortem — focused on the triggering
signal, not a full registry sweep.

---

## Inputs

### Context-efficient two-pass strategy

Reading every retro log in full would exceed context budgets as the registry
grows. The postmortem uses a two-pass approach:

**Pass 1 — Survey (light context):**

For each expert, load:
- Retro log consolidated learnings section only (~10-20 lines)
- Most recent self-assessment summary (~10 lines)
- Most recent 360 review summary (~10 lines)

For each workflow, load:
- Retro log optimization backlog only (~10-20 lines)
- Most recent retrospective findings (~10 lines)

Also load:
- Expert registry (`README.md`) — dependency graph, health status, planned experts
- Fallback status across all workflows — which steps are degraded, for how long
- Context health table from `README.md`

Pass 1 budget: ~40-50 lines per expert + ~30 lines per workflow + ~50 lines
registry overhead. At 10 experts and 5 workflows, this is ~600 lines — well
within a single context load.

**Pass 2 — Targeted deep reads:**

For each theme identified in pass 1, pull the supporting raw entries from the
relevant retro logs. Only the retro logs that contributed to the theme are
loaded, and only the relevant entries within them.

Pass 2 budget: variable, but bounded by theme count. Each theme typically
requires 2-4 retro log sections at ~30-50 lines each.

### Input sources by signal type

| Signal type | Primary input | Supporting input |
|---|---|---|
| Recurring friction | Expert retro log consolidated learnings | Raw interaction summaries (pass 2) |
| Handoff dysfunction | Workflow retro log handoff friction metrics | Expert 360 reviews mentioning the same pair |
| Bottleneck experts | Workflow retro log step durations + SLA breaches | Expert retro log scope drift signals |
| Stuck fallbacks | Workflow step fallback declarations + graduation protocol status | Fallback-era retro log entries |
| Missing experts | Planned expert table in `README.md` + blocked-by status | Workflow retro logs citing absent expert capabilities |
| Spec gaps | Expert 360 reviews citing uncovered concerns | Workflow conflict logs where no expert owned the domain |

---

## Analysis framework

The postmortem asks six cross-cutting questions. Each question has a detection
method and a proposal type.

### 1. What themes recur across multiple retro logs?

**Detection:** Cluster consolidated learnings and optimization backlog items by
topic. Flag any topic that appears in 2+ independent retro logs (expert or
workflow).

**Proposal type:** Spec change — update the relevant expert's domain knowledge,
judgment framework, or quality criteria to address the root cause once rather
than per-unit.

### 2. Which expert pairs consistently produce friction?

**Detection:** Cross-reference handoff friction entries in workflow retro logs
with 360 review feedback between the same pair. Flag pairs where friction
appears in 2+ workflows or 2+ review cycles.

**Proposal type:** Interface revision — update one or both experts' output
contracts, or revise the handoff envelope format between them.

### 3. Which experts are systemic bottlenecks?

**Detection:** Identify experts that appear in SLA breach logs across multiple
workflows. Cross-reference with the expert's own retro log for scope drift
and extraction opportunity signals.

**Proposal type:** Expert splitting (if scope is too broad), model tier
recalibration (if under-resourced), or workflow restructuring (if the
choreography is the problem, not the expert).

### 4. Which fallback modes are stalled?

**Detection:** For every active fallback, check: Is there a built expert that
could replace it? Has shadow mode been attempted? Has the fallback been active
for 2+ quarters? Is the planned expert progressing?

**Proposal type:** Graduation action plan — specify what's blocking cutover and
what needs to happen (expert build, shadow run, human decision). Or: accept
the fallback as permanent and update the workflow to reflect that reality.

### 5. Is a missing expert creating distributed pain?

**Detection:** Multiple workflow retro logs cite the absence of a capability
that maps to a planned expert. Or: multiple experts' 360 reviews flag a
cross-cutting concern that no expert owns.

**Proposal type:** Expert prioritization change — move a planned expert up the
build queue, or define a new expert that the registry hasn't identified yet.

### 6. Are there spec-level gaps the system has outgrown?

**Detection:** Patterns that don't fit into any individual expert's scope —
recurring escalations to human that could be codified, workflow patterns that
the workflow spec doesn't support, review system blind spots.

**Proposal type:** Spec evolution — propose additions to `expert-spec.md`,
`workflow-spec.md`, or a new system-level document (like this one was).

---

## Output contract

The postmortem produces a **postmortem report** — a structured document, not a
narrative summary. Format:

```markdown
## System Postmortem — YYYY-QN

**Scope:** Full registry | Scoped to [trigger signal]
**Period:** [date range]
**Inputs read:** [list of retro logs and registry sections consulted]

### Findings

#### [Finding title]
**Signal type:** [one of the six analysis framework categories]
**Evidence:** [specific retro log entries, with dates and expert/workflow names]
**Impact:** [what this costs — quality, speed, human time, risk]
**Proposal:** [specific change with target file and section]
**Priority:** critical | high | medium | low
**Disposition:** pending | accepted | modified | rejected | deferred

[Repeat per finding]

### Registry health snapshot
- Total experts: [n] ([n] active, [n] draft, [n] planned)
- Total workflows: [n] ([n] active, [n] draft)
- Active fallbacks: [n] ([n] stalled)
- Cross-cutting themes identified: [n]
- Proposals generated: [n]

### Follow-up actions
- [ ] [Specific action items with owners]
```

### Where it lives

Postmortem reports are stored at:

```
experts/postmortems/YYYY-QN.md       — quarterly reports
experts/postmortems/YYYY-MM-DD.md    — threshold-triggered scoped reports
```

The `experts/postmortems/` directory is created when the first postmortem runs.

### Disposition tracking

Each finding's disposition is updated in-place as the human reviews:
- **Accepted** — proposal will be implemented. Links to the resulting commit or PR.
- **Modified** — proposal accepted with changes. The modified version is recorded.
- **Rejected** — proposal declined. Reason recorded for future reference.
- **Deferred** — valid but not now. Moves to next postmortem's input.

Deferred findings carry forward — they appear in the next postmortem's pass 1
input automatically. A finding deferred twice is escalated to `critical` priority.

---

## Action routing

Proposals route to different destinations based on type:

| Proposal type | Destination | Approval |
|---|---|---|
| Expert spec change | Targeted `/expert-update` for the affected expert | Human approves the specific layer edit |
| Workflow revision | Workflow owner reviews proposed step/handoff changes | Human approves, then workflow version bumps |
| Interface revision | Both experts in the pair review the contract change | Both experts' owners approve |
| Expert prioritization | Registry planned-expert table | Human reorders the build queue |
| New expert identification | Registry planned-expert table (new row) | Human approves scope and priority |
| Spec evolution | `expert-spec.md` or `workflow-spec.md` | Human approves — these are constitutional changes |

**No self-application:** The postmortem proposes; it never applies. This matches
the pattern established in expert self-assessment (gate tier for layer updates)
and workflow retrospectives (proposals require human approval).

---

## Relationship to `/expert-update`

| Concern | `/expert-update` | System postmortem |
|---|---|---|
| **Scope** | Per-expert: freshness, self-assessment, 360 review, retro consolidation | Cross-registry: patterns, trends, systemic issues |
| **Trigger** | Monthly sweep | Quarterly (post-sweep) + threshold triggers |
| **Reads** | One expert's layers + its dependency graph neighbors | All consolidated retro logs + registry metadata |
| **Produces** | Per-expert layer update proposals | Cross-cutting findings with routed proposals |
| **Feeds into** | System postmortem (as input) | Targeted `/expert-update` runs (as follow-up) |

The postmortem depends on `/expert-update` having run first — it reads
consolidated retro logs, not raw entries. When the postmortem identifies an
expert-specific issue, it triggers a targeted `/expert-update` for that expert
rather than duplicating the per-expert analysis.

The maintenance section in `README.md` should reference the postmortem cadence
alongside the existing `/expert-update` sweep schedule.
