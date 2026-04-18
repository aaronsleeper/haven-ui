# Governance & RFC Process

> The meta-rules for changing the rules. Every spec in the expert system
> includes "human approval required" gates, but none defines the unified
> process for how proposals move from identification to decision. This
> document makes governance as explicit as the rules it governs.
>
> Wraps existing proposal mechanisms (system postmortem action routing,
> expert retro synthesis, shared principles evolution, shadowing graduation)
> with a consistent format, evidence requirements, and review authority model.
>
> Referenced by all system-level specs. Consumed by anyone proposing a change
> to the expert system's structure.

---

## Change taxonomy

Not all changes need the same review depth. The taxonomy maps change scope
to process weight — lightweight at the bottom (most changes), rigorous at
the top (rare but consequential).

### Tier 1: Patch

**Scope:** Single expert, single layer, no interface change.

**Examples:** Retro log consolidation, domain knowledge factual correction,
typo fix, freshness trigger date update, retro log entry addition, task
routing tier adjustment confirmed by retro data.

**Process:** Self-documenting. Make the change, log it in the expert's retro
log or commit message. No blocking review. The next `/expert-update` sweep
validates that the change didn't break anything.

**Guardrail:** If a Patch change touches `output-contract.md` or
`dependencies.md`, it's not a Patch — it's a Minor (interface change).

### Tier 2: Minor

**Scope:** Single expert with multiple layers affected or interface change;
single workflow step adjustment; shadowing graduation.

**Examples:** Output contract field addition, quality criteria threshold
change, step SLA adjustment, model tier change, new dependency declaration,
fallback mode update for a specific step, expert graduation from shadow to
live.

**Process:**

1. Author describes the change and rationale (inline in commit message or
   retro log — no separate RFC document needed)
2. Expert owner reviews (currently Aaron for all experts)
3. If the change affects an interface (`output-contract.md`, `dependencies.md`),
   all consumers listed in `dependencies.md` are notified
4. Change is applied after review. Logged in the expert's retro log.

**Guardrail:** If the change affects 2+ experts or any system-level spec,
it's not Minor — it's Major.

### Tier 3: Major

**Scope:** Cross-expert or cross-workflow impact; system-level spec change;
new expert creation.

**Examples:** New expert creation, shared principle addition or modification,
`expert-spec.md` change, `workflow-spec.md` change, `fallback-modes.md`
change, `queue-prioritization.md` change, `shadowing-protocol.md` change,
new workflow creation, expert splitting, cross-expert dependency restructuring.

**Process:** Full RFC required (see format below).

1. RFC drafted with problem statement, evidence, and proposal
2. Affected specs and experts identified
3. Human reviewer evaluates (see review authority)
4. Decision recorded in RFC file: accepted, rejected, or modified
5. If accepted, changes are applied and affected specs updated

### Tier 4: Constitutional

**Scope:** Changes to governance itself, or to non-overridable principles
(shared principles #1 and #11).

**Examples:** Modifying this governance process, changing the safety-before-speed
principle, changing the propose-never-self-apply principle, altering the
change taxonomy tiers, modifying what constitutes a hardcoded gate.

**Process:** Full RFC with elevated evidence bar.

1. Same RFC format as Major, plus: explicit rationale for why the meta-rules
   need changing and what failure mode the current rules create
2. Requires broader review (see review authority)
3. Decision must document the systemic implications — changing a meta-rule
   affects every downstream process that relies on it

---

## RFC format

For Major and Constitutional tier changes. Stored as individual files in
`experts/rfcs/`.

```markdown
---
id: RFC-NNNN
title: <short descriptive title>
author: <who identified the need — expert name, postmortem ID, or human>
status: draft | review | accepted | rejected | withdrawn
tier: major | constitutional
created: YYYY-MM-DD
decided: YYYY-MM-DD (filled on decision)
---

## Problem

What's broken or missing. 2-3 sentences. Specific enough that someone
unfamiliar with the history can understand why this matters.

## Evidence

What observations, data, or incidents support this proposal. Each entry
cites a specific source:

- Retro log entry: `experts/<name>/retro-log.md`, YYYY-MM-DD entry
- Postmortem finding: `system-postmortem` YYYY-QN, finding #N
- Workflow retro: `workflows/<name>/retro-log.md`, run metrics or finding
- Incident: description of what happened, when, and what it cost
- Shadow comparison: `shadowing-protocol` run data showing the gap

An RFC without evidence is opinion, not governance. Per shared principle #6:
evidence over opinion, specificity over generality.

## Proposal

What specifically changes. Diff-level specificity — name the files, the
sections, the fields. A reviewer should be able to evaluate the exact
change, not an abstract direction.

## Affected specs

Which documents change and how:
- `<spec-path>` — <what changes in this spec>

## Affected experts

Which experts are impacted and how:
- `<expert-name>` — <what changes for this expert>

## Trade-offs

What this costs or risks. Every change has a downside — name it. If you
can't identify one, you haven't thought hard enough.

## Alternatives considered

What else was considered and why it lost. This prevents future proposals
from re-treading rejected paths without new evidence.

## Decision (filled by reviewer)

**Status:** accepted | rejected | modified
**Reviewer:** <name>
**Rationale:** <why this decision>
**Modifications:** <if modified, what changed from the original proposal>
```

### RFC numbering

Sequential. `RFC-0001`, `RFC-0002`, etc. The number is assigned when the
RFC moves from draft to review. Draft RFCs use a working title until numbered.

### RFC lifecycle

```
draft → review → accepted → applied (changes made to specs)
                → rejected → closed (rationale recorded)
                → modified → applied (modified changes made)
       → withdrawn → closed (author abandoned)
```

Rejected RFCs are preserved — they record what was considered and why it
was declined, preventing the same proposal from cycling without new evidence.

---

## Review authority

Who reviews depends on what's changing. The reviewer is accountable for
the decision — they own the "yes" as much as the proposal author owns
the "what."

| What changes | Reviewer | Rationale |
|---|---|---|
| Individual expert layers (Minor) | Expert's human owner (currently Aaron) | Accountable for the expert's quality |
| Workflow steps or choreography (Minor/Major) | Workflow owner + affected expert owners | Choreography changes affect everyone in the workflow |
| System-level specs: expert-spec.md, workflow-spec.md, shared-principles.md, fallback-modes.md, queue-prioritization.md, shadowing-protocol.md (Major) | Aaron (system architect) | Constitutional-level specs affect every expert and workflow |
| New expert creation (Major) | Aaron + relevant domain stakeholder | New experts need both system architecture review and domain validation |
| Safety-critical changes — anything touching principle #1 gates, hardcoded gates, or clinical logic (Major) | Aaron + clinical stakeholder (Vanessa when applicable) | Safety changes need domain authority, not just system authority |
| Governance process changes (Constitutional) | Aaron + Andrey | Meta-rules need the broadest review |
| Non-overridable principle changes (Constitutional) | Aaron + Andrey + clinical stakeholder | The highest-stakes changes to the system's foundations |

**Scaling path:** "Aaron reviews everything" works with one expert. As the
registry grows, review authority delegates to expert owners — the person
(or team) accountable for the expert's domain. The reviewer column in this
table should be updated as ownership is established. The system postmortem
process already routes proposals to appropriate destinations; this
governance process formalizes those routing decisions.

**Conflict of interest:** When the proposal author and the reviewer would be
the same person (Aaron proposing a system-level change that Aaron reviews),
the review includes a self-check: "Would I accept this from someone else
with this evidence?" The decision rationale must be explicit enough that
a future reader can evaluate whether the review was rigorous.

---

## Emergency fast-path

Safety-critical fixes — PHI exposure, clinical safety gap, regulatory
violation, active patient harm risk — skip the RFC process. Fix first,
document after.

### Protocol

1. **Fix immediately.** Apply the minimum change that resolves the safety
   issue. Do not expand scope beyond the fix.
2. **Log the emergency.** Record what changed, why, and what triggered it
   in the affected spec's retro log with an `[emergency]` tag.
3. **File retroactive RFC.** Within 48 hours, file an RFC documenting:
   - What the safety issue was
   - What fix was applied
   - Why the fix was correct (or what should change now that the emergency
     is resolved)
   - Whether the emergency reveals a systemic gap (candidate for system
     postmortem)
4. **Retroactive review.** The RFC gets the same review as a normal Major
   RFC. The emergency bypass means review happens after instead of before —
   it does not mean the change is unreviewed.

**What qualifies as emergency:** The triggering condition must implicate
patient safety, regulatory compliance, or active data integrity risk. "We
want to ship faster" is not an emergency. "A care plan activated without
RDN sign-off" is.

---

## Interaction with existing mechanisms

The RFC process wraps existing proposal mechanisms — it doesn't replace them.
Each mechanism generates proposals; this process governs how proposals of
sufficient scope move through review.

| Mechanism | What it generates | Governance tier |
|---|---|---|
| **Expert self-assessment** | Proposed layer updates from retro synthesis | Patch or Minor — handled by existing retro synthesis gate. RFC not needed unless the change crosses expert boundaries. |
| **360 peer review** | Growth area recommendations from reviewing experts | Patch or Minor — same as self-assessment. Cross-expert patterns may trigger a Major RFC. |
| **System postmortem** | Cross-registry findings and action items | Major RFC automatically when the proposal affects system-level specs or multiple experts. The postmortem finding becomes the RFC's evidence section. |
| **Shared principles evolution** | Principle addition, modification, or removal | Major or Constitutional — already has its own evidence requirements (test scenario, source). The RFC process adds the format and review authority. |
| **Shadowing graduation** | Expert ready for live use | Minor — already governed by shadowing-protocol.md graduation criteria. RFC not needed unless the criteria themselves change (Major). |
| **Convocation precedent** | Novel case resolution that may inform future workflows | Logged in workflow retro. Becomes a Major RFC if the precedent warrants a workflow step change or expert spec update. |
| **Human-initiated** | Aaron or team member identifies a needed change directly | Any tier based on scope. Follows the same format and evidence requirements — human-initiated proposals are not exempt from rigor. |

---

## Decision log

Accepted and rejected RFCs accumulate in `experts/rfcs/`. This directory is
the institutional memory for why the system is shaped the way it is.

### Reading the log

The RFC directory serves several audiences:

- **Before proposing a change:** Check whether it was previously proposed
  and rejected. If the evidence hasn't changed, the proposal shouldn't
  recycle. If new evidence exists, cite the previous RFC and explain what's
  different.
- **During system postmortem:** The RFC log shows the velocity and direction
  of system evolution. Clusters of related RFCs may indicate a structural
  issue that individual proposals are working around.
- **During onboarding (new expert or new team member):** The RFC log explains
  decisions that the current specs alone don't — why a particular approach
  was chosen over alternatives.

### Maintenance

During quarterly `/expert-update` sweeps, review the RFC directory for:

- **Stale drafts** — RFCs in draft status for 2+ months. Either advance to
  review or withdraw with rationale.
- **Implemented but unclosed** — Accepted RFCs whose changes have been
  applied but status wasn't updated. Close them.
- **Pattern signals** — 3+ RFCs touching the same spec or expert in a
  quarter suggests the spec may need structural rethinking, not incremental
  patches.
