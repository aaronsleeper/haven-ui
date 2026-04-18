# Expert Registry

> Every expert follows the standard anatomy defined in `expert-spec.md`: 9 layers
> (domain knowledge through task routing), a retro log with review system
> (self-assessment + 360 peer review), and context management rules (size targets,
> selective loading, consolidation).
>
> **How to read this:** The dependency graph shows which experts consume knowledge
> from other experts. When one expert is updated, its dependents should be checked
> for cascading staleness.

---

## Specs

- **Expert anatomy:** [expert-spec.md](expert-spec.md) — standard template for individual experts (9 layers + retro log + review system)
- **Workflow anatomy:** [workflow-spec.md](workflow-spec.md) — standard template for multi-expert workflows (steps, handoffs, checkpoints, review system)
- **Fallback modes:** [fallback-modes.md](fallback-modes.md) — graceful degradation when experts are unavailable
- **System postmortem:** [system-postmortem.md](system-postmortem.md) — cross-registry retrospective synthesis (quarterly + threshold-triggered)
- **Convocation protocol:** [convocation-protocol.md](convocation-protocol.md) — ad-hoc multi-expert deliberation for cases that exceed workflow choreography
- **Shared operating principles:** [shared-principles.md](shared-principles.md) — constitutional defaults that apply to every expert unless explicitly overridden
- **Queue prioritization:** [queue-prioritization.md](queue-prioritization.md) — priority classes, composite scoring, and portfolio management policy for the QueueManager agent
- **Shadowing protocol:** [shadowing-protocol.md](shadowing-protocol.md) — how experts earn their way from draft to live through structured shadow runs, comparison analysis, and gated graduation
- **Governance & RFC process:** [governance.md](governance.md) — change taxonomy, RFC format, review authority, emergency fast-path, decision log
- **Human-expert interface:** [human-expert-protocol.md](human-expert-protocol.md) — human registry, expert→human channels (gate/notify/escalate), human→expert channels (override/feedback/validation), feedback capture at gates, onboarding

---

## Registry

| Expert | Version | Created | Last validated | Health | Detail |
|---|---|---|---|---|---|
| **UX Design Lead** | 0.1 | 2026-04-03 | 2026-04-03 | ⚪ Draft | [ux-design-lead/](ux-design-lead/) |
| **Clinical Care** | 0.1 | 2026-04-06 | 2026-04-06 | ⚪ Draft | [clinical-care/](clinical-care/) |
| **Platform / Infrastructure** | 0.1 | 2026-04-09 | 2026-04-09 | ⚪ Draft | [platform-infrastructure/](platform-infrastructure/) |
| **Operations / Compliance** | 0.1 | 2026-04-09 | 2026-04-09 | ⚪ Draft | [operations-compliance/](operations-compliance/) |
| **Compliance** | 0.1 | 2026-04-09 | 2026-04-09 | ⚪ Draft | [compliance/](compliance/) |
| **Patient Ops** | 0.1 | 2026-04-09 | 2026-04-09 | ⚪ Draft | [patient-ops/](patient-ops/) |
| **Meal Operations** | 0.1 | 2026-04-10 | 2026-04-10 | ⚪ Draft | [meal-operations/](meal-operations/) |
| **Accessibility** | 0.1 | 2026-04-11 | 2026-04-11 | ⚪ Draft | [accessibility/](accessibility/) |
| **Design System Steward** | 0.1 | 2026-04-11 | 2026-04-11 | ⚪ Draft | [design-system-steward/](design-system-steward/) |
| **Frontend Architecture** | 0.1 | 2026-04-11 | 2026-04-11 | ⚪ Draft | [frontend-architecture/](frontend-architecture/) |
| **Agent Integration Platform** | 0.1 | 2026-04-15 | 2026-04-15 | ⚪ Draft | [agent-integration-platform/](agent-integration-platform/) |

---

## Planned experts

Experts identified as needed but not yet created. Prioritized by how many existing
or planned experts depend on them.

| Expert | Org function | Why needed | Blocked by | Depended on by |
|---|---|---|---|---|
| ~~**Design System Steward**~~ | ~~Product & Engineering~~ | ~~Governs component lifecycle~~ | | — **Moved to registry** |
| **Expert Operations** | Internal Ops (HR analog) | Onboards/offboards experts: where they fit, who they report to, which workflows and decision trees need updating | Expert pipeline (`/expert-create`) must exist first | All experts — manages lifecycle |
| ~~**Compliance**~~ | ~~Compliance & Regulatory~~ | ~~HIPAA rendering constraints, audit requirements, PHI display rules~~ | ~~Legal review of requirements~~ | ~~UX Design Lead, Clinical Care, Revenue Cycle~~ — **Moved to registry** |
| **QA** | Product & Engineering | Tests against specs, runtime verification, visual review pipeline | Needs defined test infrastructure | UX Design Lead, Frontend Engineering |

---

## Dependency graph

> Canonical source: [`topology.yaml`](../topology.yaml) → generated in [`topology.md`](../topology.md).
> See the [Expert Dependencies](../topology.md#expert-dependencies) diagram for the full interactive view.

---

## System infrastructure roadmap

Patterns identified from organizational design that the expert system needs but
doesn't yet have. Ordered by implementation priority. Each becomes a spec
addition or standalone document when built.

| # | Pattern | What it solves | Scope | Status |
|---|---|---|---|---|
| 1 | **Graceful degradation** | Workflows halt when a required expert is absent or stale. Fallback modes let workflows run with planned-but-unbuilt experts by degrading to checklists or human coverage. Solves the bootstrapping problem. | [fallback-modes.md](fallback-modes.md) + additions to expert-spec.md (Layer 5) and workflow-spec.md (step anatomy) | **Complete** |
| 2 | **Commander's intent** | Experts have no way to reason about *why* a workflow exists when steps fail. A 2-3 sentence intent statement in each workflow README enables adaptive recovery instead of halting. | Addition to `workflow-spec.md` (new section) + example in `workflows/care-plan-creation/README.md` | **Complete** |
| 3 | **System-level postmortems** | Expert retro logs and workflow retro logs don't surface cross-cutting themes ("Compliance flagged the same issue in 3 workflows this month"). A system retro synthesizes signals across the full registry. | [system-postmortem.md](system-postmortem.md) — quarterly + threshold-triggered cross-registry analysis | **Complete** |
| 4 | **Ad-hoc convocation (tumor board)** | Some cases exceed workflow complexity. A convocation protocol lets multiple experts reason together in shared context for novel problems — the tiger team for cases that break predefined choreography. | [convocation-protocol.md](convocation-protocol.md) + cross-reference in `workflow-spec.md` (collaboration protocol) | **Complete** |
| 5 | **Shared operating principles** | Some heuristics span all experts ("patient safety overrides process efficiency") but only exist if manually added to each judgment framework. A constitutional layer provides system-wide defaults experts check when their own spec is silent. | [shared-principles.md](shared-principles.md) — 11 principles with override mechanism, evolution process, and vagueness filter | **Complete** |
| 6 | **Queue prioritization / portfolio management** | No framework for prioritizing across concurrent workflow instances. When 10 care plans compete for one RDN, the system needs a policy beyond SLA clocks. | [queue-prioritization.md](queue-prioritization.md) — priority classes, composite scoring, resource contention, starvation prevention | **Complete** |
| 7 | **Expert shadowing / bootstrapping** | Draft experts start with zero calibration data. A shadowing protocol runs the expert alongside a workflow, comparing its output to human decisions, populating the retro log before the expert takes live steps. | [shadowing-protocol.md](shadowing-protocol.md) — 3 triggers, comparison protocol, graduation criteria, retro log seeding, rollback. References added to expert-spec.md and fallback-modes.md | **Complete** |
| 8 | **Governance / RFC process** | No explicit rules about who can change expert-spec.md, create experts, or modify system patterns. An RFC process makes meta-rules as explicit as the rules themselves. | [governance.md](governance.md) — 4-tier change taxonomy, RFC format, review authority, emergency fast-path. RFCs stored in `rfcs/` | **Complete** |
| 9 | **Human-expert interface** | Expert-to-expert interfaces are explicit (output contracts, handoffs, dependencies). The human-expert boundary was implicit — scattered across escalation thresholds, workflow gates, and governance with no unifying protocol. | [human-expert-protocol.md](human-expert-protocol.md) — human registry, 3 expert→human channels (gate/notify/escalate), 3 human→expert channels (override/feedback/validation), feedback capture, onboarding. References added to expert-spec.md and workflow-spec.md | **Complete** |
| 10 | **Assumption tracking** | Experts block on missing institutional knowledge. Assumption convention lets experts operate on defensible guesses while making uncertainty visible and trackable. | [RFC-0001](rfcs/RFC-0001-assumption-tracking.md) — `[ASSUMPTION]` marker convention, assumptions index, lifecycle, confidence interaction. Added to expert-spec.md Layer 1 | **Complete** |

---

## Health status key

| Status | Meaning |
|---|---|
| 🟢 Green | Validated, all freshness triggers current |
| 🟡 Yellow | Knowledge may be stale, review recommended |
| 🔴 Red | Known invalidating change detected, update required |
| ⚪ Draft | Initial spec, not yet validated through use |

---

## Maintenance

Run `/expert-update` monthly to sweep the registry. Run system postmortem
quarterly (after the sweep) or when threshold triggers fire — see
[system-postmortem.md](system-postmortem.md).

The `/expert-update` sweep:
1. Reads each expert's freshness triggers
2. Checks if any triggers have fired since last validation
3. Walks the dependency graph for cascade effects
4. Runs retro log consolidation for any expert over 150 lines
5. Calculates registry-wide context health (see below)
6. Triggers self-assessment + 360 reviews for experts with accumulated summaries
7. Updates health status and proposes changes where needed

When an expert is created or updated, bump its version and `last-validated` date here.

## Context health

Total context across all experts should stay within budget. Checked during
each `/expert-update` sweep.

| Total expert lines | Status | Action |
|---|---|---|
| < 5,000 | Healthy | No action needed |
| 5,000 – 10,000 | Watch | Review largest experts for consolidation or splitting |
| > 10,000 | Action required | Consolidate retro logs, extract domain knowledge, consider splitting |

| Expert | Lines | Budget (700) | Largest layers | Status |
|---|---|---|---|---|
| UX Design Lead | 848 | Over by 148 | judgment-framework (182), task-routing (114) | Watch — extract worked examples from judgment-framework |
| Clinical Care | 754 | Over by 54 | judgment-framework (144), output-contract (95) | Watch — comorbidity decision trees are load-bearing; trim if retro data shows over-specification |
| Platform / Infrastructure | 716 | Over by 16 | judgment-framework (138), domain-knowledge (85) | OK — AD-04 worked example is load-bearing; trim after Andrey validates |
| Operations / Compliance | 808 | Over by 108 | judgment-framework (164), domain-knowledge (99) | Watch — OQ-07 worked example and 7 sub-domains are load-bearing; trim after Vanessa validates assumptions |
| Compliance | 598 | Under by 102 | judgment-framework (146), output-contract (140) | OK — within budget; kitchen packing slip worked example is load-bearing |
| Patient Ops | 606 | Under by 94 | output-contract (152), judgment-framework (147) | OK — within budget; reconciliation worked example is load-bearing |
| Meal Operations | 427 | Under by 273 | judgment-framework (83), output-contract (77) | OK — well within budget; first kitchen partner onboarding will be critical validation |
| Accessibility | 284 | Under by 416 | domain-knowledge (79), judgment-framework (52) | OK — well within budget; focused on domain knowledge and judgment |
| **Total** | **5041** | | | **Watch (registry-wide)** |


