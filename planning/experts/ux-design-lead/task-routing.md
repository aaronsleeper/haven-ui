# Task Routing — UX Design Lead

Maps each task this expert performs to its execution mode (probabilistic vs.
deterministic) and model tier (Opus / Sonnet / Haiku). Reviewed during
`/expert-update` for optimization opportunities.

---

## Task map

### Interaction specifications (core work)

| Task | Model tier | Determinism | Rationale |
|---|---|---|---|
| Design novel interaction pattern | Deep (Opus) | Probabilistic | Requires weighing tradeoffs, synthesizing domain knowledge, and producing creative solutions. No two design problems are identical enough to templatize. |
| Adapt existing pattern to new surface | Standard (Sonnet) | Probabilistic | Framework exists; task is applying it to new content domain. Judgment needed but within established bounds. |
| Specify states for a view (loading, empty, error) | Standard (Sonnet) | Mostly deterministic | Patterns are well-established. Could extract a state checklist template, but content varies enough per view to need some reasoning. |
| Map Haven components to a composition | Light (Haiku) | Mostly deterministic | Component catalog is known; matching components to needs is lookup + basic reasoning. |
| Document responsive collapse behavior | Light (Haiku) | Deterministic candidate | Breakpoint rules are documented. Could be extracted to a responsive spec template with fill-in fields. |

### Component specifications

| Task | Model tier | Determinism | Rationale |
|---|---|---|---|
| Design new component from scratch | Deep (Opus) | Probabilistic | Requires understanding the gap, surveying existing components, and designing something that composes well with the system. |
| Specify variants of existing component | Standard (Sonnet) | Probabilistic | Pattern exists; new variant needs to fit within established component API. |
| Document token consumption for component | Light (Haiku) | Deterministic candidate | Mechanical mapping of visual values to token names. Could be a script that reads component spec and validates all values are tokens. |
| Generate accessibility spec (ARIA, keyboard) | Standard (Sonnet) | Partially deterministic | ARIA role selection follows rules but edge cases require judgment. Keyboard behavior is mostly patterned. |

### Design reviews

| Task | Model tier | Determinism | Rationale |
|---|---|---|---|
| Full interaction review of new feature | Deep (Opus) | Probabilistic | Requires understanding intent, evaluating against multiple criteria, and producing nuanced feedback. |
| Consistency check against ui-patterns.md | Light (Haiku) | Deterministic candidate | Mechanical comparison of implemented patterns against documented patterns. Strong extraction candidate — could be a script that flags deviations. |
| Accessibility audit (contrast, keyboard, ARIA) | Light (Haiku) | Mostly deterministic | Contrast checking is computable. Keyboard behavior is checklistable. ARIA correctness is rule-based. Could extract to an automated checker with manual review for edge cases. |
| Review approval card design | Standard (Sonnet) | Probabilistic | Requires evaluating whether context is sufficient for the decision — this is a judgment call per domain. |

### Usability assessments

| Task | Model tier | Determinism | Rationale |
|---|---|---|---|
| Full workflow usability assessment | Deep (Opus) | Probabilistic | Requires walking a workflow, identifying friction, and proposing improvements with tradeoff analysis. |
| Click/step counting for task analysis | Light (Haiku) | Deterministic candidate | Mechanical counting of interactions in a defined flow. Could be a script given a workflow spec as input. |
| Benchmark comparison to previous version | Standard (Sonnet) | Partially deterministic | Data comparison is mechanical; interpreting significance requires judgment. |

### Review system tasks

| Task | Model tier | Determinism | Rationale |
|---|---|---|---|
| Capture interaction summary | Light (Haiku) | Mostly deterministic | Structured extraction from conversation into a known template. Low judgment needed. |
| Self-assessment against quality criteria | Standard (Sonnet) | Probabilistic | Pattern detection across multiple summaries requires reasoning. |
| Synthesize 360 feedback into proposals | Deep (Opus) | Probabilistic | Cross-referencing multiple reviewer perspectives, identifying themes, and proposing specific layer edits. |
| Update retro log with outcome data | Light (Haiku) | Deterministic candidate | Appending structured data to existing entries. Could be a template fill. |

---

## Extraction candidates

Tasks flagged for potential extraction to deterministic utilities. Extraction
happens when the task has been performed enough times to validate the pattern.

| Task | Current tier | Extraction type | Status |
|---|---|---|---|
| Responsive collapse spec | Haiku | Template with fill-in fields per view | Ready — breakpoint rules are stable and documented |
| Token consumption validation | Haiku | Script: read component spec, flag any raw values not mapped to tokens | Ready — rule is absolute (no hardcoded values ever) |
| Consistency check vs. ui-patterns.md | Haiku | Checklist/script: compare implemented layout against three-panel spec | Ready — pattern is well-defined |
| Click/step counting | Haiku | Script: parse workflow spec, count interaction steps per path | Candidate — needs workflow spec format to be standardized first |
| Accessibility contrast check | Haiku | Script: read token values, compute contrast ratios, flag failures | Ready — purely mathematical |
| Interaction summary capture | Haiku | Template: structured form with fields from the spec | Candidate — some summaries need more interpretation than others |

---

## Routing review protocol

During `/expert-update`, review this map for:

1. **Tasks still at Opus that Sonnet handles well** — Check retro log for tasks
   where Opus output wasn't meaningfully better than what Sonnet-level reasoning
   would produce. Downgrade the tier.

2. **Tasks at Haiku with frequent corrections** — If human overrides are common
   for a Haiku-tier task, it needs more reasoning depth. Upgrade the tier.

3. **New extraction candidates** — Review interaction summaries for repeated
   identical output patterns, consistent human corrections, or zero-ambiguity tasks
   that are still running through probabilistic reasoning.

4. **Extracted functions that need judgment after all** — If a deterministic utility
   produces output that regularly needs expert correction, the extraction was premature.
   Pull it back to a Haiku or Sonnet task.

The progression is: Opus → Sonnet → Haiku → deterministic function. Each step
trades flexibility for efficiency and consistency. Movement in both directions is
normal as the expert learns what actually requires judgment.

---

## Context loading profiles

Which layers to load for each activity. Loading the minimum viable context
reduces token cost and prevents stale or irrelevant information from
influencing output.

| Activity | Layers loaded |
|---|---|
| **Design new interaction** | README, domain-knowledge, judgment-framework, output-contract, task-routing |
| **Design review** | README, quality-criteria, judgment-framework, task-routing |
| **Component spec** | README, domain-knowledge (visual design + platform sections only), output-contract, task-routing |
| **Usability assessment** | README, domain-knowledge (healthcare UX section only), judgment-framework, output-contract, task-routing |
| **Self-assessment** | README, quality-criteria, retro-log, task-routing |
| **360 peer review** (as reviewer) | README, quality-criteria, output-contract, dependencies |
| **Update sweep** | README, freshness-triggers, dependencies, retro-log |
| **Escalation check** | README, escalation-thresholds |
