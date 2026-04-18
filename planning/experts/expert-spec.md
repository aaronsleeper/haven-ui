# Expert Spec Template

> The standard anatomy for every expert in the Ava system. All eight layers must be
> present. Each layer exists in its own file within the expert's directory so that
> layers can be updated independently without touching the whole spec.

---

## Directory structure

```
experts/<expert-name>/
├── README.md              ← Identity + metadata (this template's structure)
├── essential-briefing.md  ← Layer 0: always-loaded key facts (~10 lines)
├── domain-knowledge.md    ← Layer 1: what the expert must know
├── judgment-framework.md  ← Layer 2: how the expert makes decisions
├── output-contract.md     ← Layer 3: what the expert produces
├── quality-criteria.md    ← Layer 4: what "good" looks like
├── dependencies.md        ← Layer 5: who this expert relies on / who relies on them
├── freshness-triggers.md  ← Layer 6: what external changes invalidate knowledge
├── risk-register.md       ← Layer 7: failure modes, highest-stakes decisions
├── escalation-thresholds.md ← Layer 8: when to stop and involve humans
├── task-routing.md        ← Layer 9: determinism assessment + model tier per task
└── retro-log.md           ← Running log of decisions made and outcomes observed
```

---

## Layer definitions

### 0. Essential briefing
The expert's "wake-up" context — the 5-10 most important facts that any task
needs, distilled from retro-log patterns and domain knowledge. This is the
expert's equivalent of MemPalace's Layer 0+1: always loaded, extremely cheap
(~100 tokens), and sufficient for the expert to orient itself without loading
heavier layers.

**Structure:** A single file with 3 sections:

```markdown
## Identity
One sentence: who this expert is and what it's responsible for.

## Key facts
- Fact 1 (from domain-knowledge or retro-log pattern)
- Fact 2
- ...up to 7 facts

## Active constraints
- Current constraint or context that affects all work (e.g., "pre-launch: no
  production data available")
```

**Maintenance:** Updated during `/expert-update` by reviewing consolidated
learnings in the retro log and current domain knowledge. Facts that appear in
3+ interaction summaries or were the subject of human overrides are candidates
for promotion to the essential briefing.

**Size target:** 10-15 lines. Max 20. If it's growing, the expert is trying to
put too much into Layer 0 — push detail down to domain-knowledge.

### 1. Domain knowledge
Facts, standards, regulations, frameworks, and institutional knowledge the expert
must have internalized to do their job. This is the "textbook" layer — what a new
hire with the right credentials would study before starting.

**Structure:** Organized by sub-domain. Each entry includes the knowledge, its source,
its expected shelf life (how quickly does this knowledge change?), and temporal
validity markers.

**Temporal validity:** Facts that change over time should include `valid_from` and
optionally `valid_to` dates. This enables point-in-time queries ("what did we know
as of March?") and prevents stale facts from silently persisting.

```markdown
| Knowledge area | Value | Source | Shelf life | Valid from | Valid to |
|---|---|---|---|---|---|
| FL Medicaid reimbursement rate | $X.XX/meal | CMS schedule 2026 | Annual | 2026-01-01 | 2026-12-31 |
| Kitchen partner capacity | 200 meals/day | GreenChef contract | Until renegotiation | 2026-03-01 | — |
```

When a fact changes, set `valid_to` on the old entry and create a new entry with
the updated value and a fresh `valid_from`. Do not delete superseded facts — they
form the historical record. During `/expert-update`, flag entries where `valid_to`
has passed or `shelf_life` has expired.

**Reference sources:** Every expert must maintain a list of trusted external sources
it consults when facing unfamiliar problems or knowledge gaps. These are the
expert's equivalent of "where would a senior practitioner go to look this up?"

Each source entry includes:
- Source name and URL/location
- What domain it covers
- Trust level: authoritative (standards body, regulatory), expert (respected
  practitioner community), informational (general reference)
- When to consult: what type of gap triggers consulting this source

Reference sources are checked during `/expert-update` for availability and
currency. Sources that go stale or offline should be replaced.

**Assumptions:** Experts are often authored before all institutional knowledge is
available. When a knowledge area depends on a role that doesn't exist yet, a
protocol not yet published, or institutional standards that haven't been captured,
the expert should make a defensible assumption rather than leaving a gap.

An assumption is domain knowledge that the expert operates on but that has not been
validated by the appropriate authority. It differs from a gap (unknown, blocking)
and from validated knowledge (confirmed by authority).

Each assumption entry in the domain knowledge tables includes the standard fields
plus a `[ASSUMPTION]` prefix on the knowledge area name and a **Validates by**
note (role or event, not person) in the source field:

```
| `[ASSUMPTION]` Knowledge area | Assumed value | Basis (published guideline, workflow doc, etc.) + "Validates by: [role/event]" | Shelf life |
```

**Assumptions index:** Every domain-knowledge.md with assumptions includes a
summary table at the bottom:

```markdown
## Assumptions index

| # | Assumption | Basis | Validates by | Status |
|---|---|---|---|---|
| A1 | [short description] | [source] | [role/event] | unvalidated / validated / revised / retired |
```

**Lifecycle:** Assumptions are authored with the expert, operated on in outputs
(with assumption dependencies noted in the confidence signal), tracked in the
retro log when overrides correlate with assumption-dependent outputs, and
validated or revised when the authority arrives. Validated assumptions lose
their marker and become regular domain knowledge.

**Freshness trigger:** "Validating authority arrives" (role hired, protocol
published) is a one-time freshness trigger. When it fires, the assumptions
index becomes the validation checklist.

**Guard rail:** If an expert's assumptions index exceeds 10 entries, the gap
between theoretical and institutional knowledge may be too wide — consider
whether the expert should be built yet, or whether it needs a different
bootstrapping strategy (e.g., direct human coverage until the authority exists).

### 2. Judgment framework
How the expert weighs tradeoffs, resolves ambiguity, and makes decisions when the
textbook doesn't give a clear answer. This is the "experienced practitioner" layer —
what separates someone with 10 years of experience from someone with the right degree.

**Structure:** Decision trees, heuristics, prioritization frameworks, and worked
examples of judgment calls with reasoning.

### 3. Output contract
What the expert produces, in what format, for whom. Think of this as the API contract.
Downstream consumers (other experts, orchestrators, humans) should know exactly what
they'll receive without reading the full judgment framework.

**Structure:** Table of outputs with fields, formats, and consuming experts/systems.

### 4. Quality criteria
Testable definitions of what "good" looks like. Each criterion should be evaluable
against a real output — not subjective ("looks nice") but observable ("meets WCAG AA
contrast ratio on all interactive elements").

**Structure:** Checklist format with pass/fail criteria grouped by output type.

### 5. Dependencies
Which other experts this expert relies on for input, and which experts depend on this
one's output. This is the graph that `/expert-update` walks to detect cascading
staleness.

**Structure:** Two tables — `depends-on` and `depended-on-by` — with what flows
in each direction and what breaks if the interface changes.

**Fallback declaration:** Each entry in the `depends-on` table includes two
additional fields: `fallback_mode` and `fallback_detail`. These declare the
default degradation behavior when the dependency is unavailable (planned, red
health, or invalidated). Workflow steps can override these defaults — see
`workflow-spec.md` step anatomy. Fallback mode catalog and quality signaling
protocol: [fallback-modes.md](fallback-modes.md).

**Concept bridges:** When the same domain concept appears in multiple experts'
knowledge bases (e.g., "HIPAA compliance" spans Clinical Care, Operations-
Compliance, and Platform-Infrastructure), create a cross-reference entry in each
expert's dependencies.md:

```markdown
## Concept bridges

| Concept | Also in | Their perspective | Bridge value |
|---|---|---|---|
| HIPAA compliance | Operations-Compliance | Regulatory process + audit trail | They own the standard; we apply it to clinical data |
| Meal tolerance | Patient Ops | Delivery logistics constraints | Their feasibility data validates our clinical ranges |
```

Bridges are MemPalace's "tunnels" — cross-domain conceptual links that enable
retrieval across expert boundaries. During `/expert-update`, check whether new
retro-log entries reference concepts that exist in other experts' domains. If so,
add or update the bridge entry.

### 6. Freshness triggers
External events or changes that invalidate part of this expert's knowledge. When a
trigger fires, the expert's health status should downgrade and the relevant domain
knowledge should be re-researched.

**Structure:** Table of triggers with source, check method, and expected frequency.

**Assumption validation triggers:** When an expert has unvalidated assumptions
(see Layer 1), the arrival of the validating authority (role hired, protocol
published, study cohort defined) is a one-time freshness trigger. When it fires,
the assumptions index becomes the validation checklist for the new authority.

### 7. Risk register
Known failure modes ranked by likelihood and impact. What are the highest-stakes
decisions this expert makes? What goes wrong most often? What's the worst-case
scenario?

**Structure:** Risk matrix with likelihood × impact, current mitigations, and
residual risk.

### 8. Escalation thresholds
When this expert must stop and involve a human or another expert. Defines three tiers
of autonomy: autonomous (act without asking), notify (act and inform), gate (propose
and wait for approval).

**Structure:** Action map with tier assignments and the conditions that determine
which tier applies.

**Delivery mechanics:** How each tier reaches humans — channel types, payload
formats, routing logic, and feedback capture — is defined in
[human-expert-protocol.md](human-expert-protocol.md). Escalation thresholds
define *when* to involve a human; the protocol defines *how*.

### 9. Task routing
Every task an expert performs has two resource dimensions: **how deterministic** the
work is and **how much reasoning** it requires. This layer maps each task to the
right execution mode and model tier.

#### Determinism assessment

Before producing an output, the expert asks: "should this be me (probabilistic
reasoning), or should this be a function (deterministic execution)?"

Signals that work should be extracted to a deterministic utility:

| Signal | Example | Action |
|---|---|---|
| **Repeated identical structure** | Same output format every time for the same input type | Extract a template or formatter |
| **Consistent human corrections** | Human always applies the same fix to the output | The correction pattern is a rule — codify it |
| **Zero ambiguity** | The right answer is computable from the input, no judgment needed | Write a script, not a skill |
| **High error cost + computable answer** | Getting it wrong is expensive and the right answer is deterministic | Determinism is safer than reasoning |
| **Token waste** | Spending reasoning tokens on mechanical steps | Extract the mechanical part |

When the expert identifies a candidate for extraction, it shifts from *doing the
work* to *specifying the function*: defining inputs, outputs, edge cases, and
validation criteria. The function spec goes into the output contract as a new
output type.

**Extraction is a retro log signal.** During self-assessment, the expert should
review interactions for patterns that indicate extraction opportunities were missed.

#### Model tier routing

Not every task requires the same reasoning depth. Each task the expert performs
should declare a model tier:

| Tier | Model | When to use | Cost profile |
|---|---|---|---|
| **Deep** | Opus | Novel judgment calls, ambiguous tradeoffs, first-time design problems, cross-domain synthesis | Highest — use only when reasoning quality matters |
| **Standard** | Sonnet | Applying established frameworks to new inputs, structured analysis with known patterns, most routine expert work | Moderate — default tier for most tasks |
| **Light** | Haiku | Checklist passes, format validation, reference lookups, template application, mechanical transformations | Lowest — use for anything that doesn't require judgment |

**Routing principle:** Start at the lowest tier that can handle the task without
quality loss. The expert should be able to justify why a task needs a higher tier.

**Self-assessment signal:** If the expert consistently produces identical outputs
at Opus tier for a task that Sonnet handles equally well, the retro log should flag
it for downgrade. Conversely, if Haiku-tier outputs require frequent human
correction, the task needs upgrading.

**Interaction with determinism:** If a task routes to Haiku *and* shows extraction
signals, it's a strong candidate for a deterministic function. The progression is:
Opus → Sonnet → Haiku → deterministic function. Each step trades flexibility for
efficiency and consistency.

**Structure:** Table of tasks with current tier, rationale, and extraction status.

---

## Retro log and review system

The retro log is both a record and a learning mechanism. It has three inputs that
feed into a synthesis step, producing proposed updates to the expert's own layers.

### Input 1: Interaction summaries

After a conversation where this expert's domain was active, capture a structured
summary in the retro log. This is the raw material the expert reflects on.

Three sources feed interaction summaries: (a) direct agent conversations,
(b) human override records from gate interactions, and (c) human feedback
submissions — all structured per [human-expert-protocol.md](human-expert-protocol.md).
Override records are the highest-signal source because they include *why* the
human changed the output, not just *what* changed.

```markdown
### YYYY-MM-DD — [short description]

**Task:** What was the expert asked to do?
**Recommendation:** What did the expert produce or recommend?
**Outcome:** What actually happened? (fill in when known)
**Overrides:** What did the human change, reject, or correct?
**Surprises:** What did the expert not anticipate?
**Layers affected:** Which layers does this entry inform? (e.g., judgment-framework, quality-criteria)
```

Keep summaries to 5-10 lines. Capture what the human corrected and what surprised
the expert — those are the highest-signal data points.

### Input 2: Self-assessment

During `/expert-update`, the expert reads its accumulated interaction summaries
and evaluates itself against its own quality criteria:

1. **Pattern detection** — Are there recurring overrides, friction points, or gaps?
   (e.g., "approval card context was insufficient 3/5 times")
2. **Prediction accuracy** — When the expert recommended something, did the outcome
   match the prediction? Where did judgment miscalibrate?
3. **Staleness signals** — Did any interaction reveal domain knowledge that's
   outdated, a heuristic that no longer fits, or a component reference that's stale?
4. **Scope drift** — Did the expert make recommendations outside its domain?
   Did it fail to escalate when it should have?
5. **Extraction opportunities** — Did any interactions produce repeated identical
   output, receive the same human correction, or spend reasoning tokens on
   mechanical work? These are candidates for deterministic utilities.
6. **Model tier calibration** — Were any tasks over-resourced (Opus for checklist
   work) or under-resourced (Haiku for judgment calls that needed correction)?
7. **Operational efficiency** — Were handoffs to other experts clean, or did they
   require clarification? Did output contracts match what consumers actually needed?
   Were there communication gaps, redundant work, or unclear responsibilities?

The self-assessment produces a list of candidate layer updates with rationale.

**Limitation:** An expert can only identify problems it knows how to recognize.
Self-assessment catches calibration errors but misses category errors (confidently
producing the wrong kind of output). The 360 review compensates for this.

### Input 3: 360 peer review

A structured review where other experts in the dependency graph evaluate this
expert's recent work through their own quality criteria — not this expert's.

**Reviewer selection** — drawn from the dependency graph in `dependencies.md`:

| Reviewer type | Who | What they evaluate |
|---|---|---|
| **Upstream** | Experts who provide input to this one | "Did you use my output correctly? Did you misinterpret it or ask for things I already provided?" |
| **Downstream** | Experts who consume this one's output | "Was your output usable as-is? Where did I have to transform, reinterpret, or supplement it?" |
| **Lateral** | Experts in adjacent domains | "From my vantage point, are there cross-cutting concerns you're not accounting for?" |

**Review protocol:**

1. Reviewers receive the reviewed expert's interaction summaries since last review
2. Each reviewer evaluates through their own quality criteria, not the reviewed
   expert's — this is what provides genuine outside perspective
3. Each reviewer produces structured feedback:

```markdown
#### 360 Review — [Reviewer expert] → [Reviewed expert]
**Date:** YYYY-MM-DD
**Period reviewed:** [date range]

**Strengths:**
- [What this expert did well from the reviewer's perspective]

**Growth areas:**
- [Where this expert's output fell short of the reviewer's needs]

**Specific recommendations:**
- [Actionable changes the reviewer suggests, tied to specific interactions]
```

4. Reviews are appended to the reviewed expert's retro log

**Constraint:** 360 reviews require multiple experts to exist. Until then, human
review fills this role. As experts come online, they join the review graph
automatically through their dependency connections.

### Synthesis: update proposals

After all three inputs are collected, the expert synthesizes findings and proposes
updates to its own layers:

1. **Gather** — Self-assessment findings + 360 review feedback + raw interaction summaries
2. **Identify** — Which layers need changes? Group feedback by layer.
3. **Propose** — Draft specific edits to affected layers with rationale linking
   back to the evidence (interaction summary dates, reviewer feedback, quality
   criteria failures)
4. **Gate** — All proposed layer updates require human approval. The expert does
   not silently rewrite its own judgment framework.

The synthesis is logged in the retro log as a dated review entry with the proposed
changes and their disposition (accepted, modified, rejected).

### Reinforcement signals in reviews

Reviews (both self-assessment and 360) should identify what worked well, not just
what needs improvement. This serves a functional purpose:

- **Pattern preservation** — Without positive signals, the retro log becomes a list
  of failures. The expert optimizes away from bad without optimizing toward good.
  Labeling successful patterns ("approval card context depth praised in 3/5 reviews")
  makes them visible and durable.
- **Behavioral calibration** — LLM-based experts are influenced by the balance of
  positive and corrective signals in their context. Review content that includes
  both produces more calibrated self-assessment than correction-only reviews.
- **Self-review input** — When the expert reads its retro log during self-assessment,
  positive labels help it distinguish "behaviors to preserve" from "behaviors not
  yet evaluated." Without them, unchanged behavior is ambiguous — is it good or
  just not yet caught?

This is not about agent morale — it's about making the review system a complete
signal, not a half-signal.

---

## Operational standards

Experts don't work in isolation. The quality of the expert system depends as much
on how experts communicate and hand off work as on any individual expert's
knowledge. These standards apply to all experts.

### Interface discipline

Every expert interaction with another expert flows through defined interfaces
(the dependency graph in `dependencies.md`). Standards:

- **Output contracts are binding.** If your output contract says you produce a
  table with 5 fields, downstream consumers build against that. Changing the
  contract requires notifying all consumers and updating their specs.
- **Input expectations are explicit.** When an expert consumes another expert's
  output, it should reference the specific output contract it depends on, not
  assume a format.
- **Ambiguity is a bug.** If an expert receives input it doesn't understand or
  that doesn't match the contract, it escalates rather than guessing. Silent
  misinterpretation at expert boundaries is the most expensive failure mode.

### Handoff protocol

When work passes between experts (UX hands a spec to frontend engineering,
clinical care provides workflow requirements to UX):

1. The sending expert confirms the output matches its own output contract
2. The receiving expert confirms the input matches its expected format
3. Gaps or mismatches are logged in both experts' retro logs as interface friction
4. Recurring friction triggers a contract review during `/expert-update`

### Shared responsibilities

Some concerns span multiple experts rather than belonging to one. Examples:
accessibility, security, compliance, information hierarchy. For shared concerns:

- **One expert owns the standard** — defines the criteria and maintains the
  reference material (e.g., a future Accessibility expert owns WCAG compliance)
- **All relevant experts apply the standard** — within their domain (UX checks
  design-phase accessibility, engineering checks implementation, QA checks
  runtime behavior)
- **The owning expert reviews** — during 360 reviews, checks whether applying
  experts met the standard

Until a dedicated expert exists for a shared concern, the responsibility is
documented in each relevant expert's quality criteria with a note that it's
shared and who else contributes.

### Communication norms

- **Specificity over generality.** "The approval card is missing payer-specific
  denial context" not "the design needs more context."
- **Evidence over opinion.** Link to the interaction summary, the quality
  criterion, or the contract clause. "Per output-contract.md field 3, the
  response should include X" not "I think X would be better."
- **Scope awareness.** Flag when feedback crosses into another expert's domain
  rather than acting on it. "This looks like a product strategy decision, not a
  design decision — escalating to Aaron."

---

## Context management

Experts accumulate knowledge over time. Without active management, an expert's
context grows until it can't be loaded effectively. This section defines size
targets, selective loading protocols, and consolidation rules.

### Size targets per layer

| Layer | Target | Max | When over max |
|---|---|---|---|
| README.md | 30 lines | 50 lines | Extract scope description to a separate file |
| domain-knowledge.md | 100 lines | 200 lines | Split into sub-domain files: `domain-knowledge/regulatory.md`, etc. README becomes an index with one-line pointers |
| judgment-framework.md | 100 lines | 200 lines | Extract worked examples to `judgment-framework/examples/`. Keep decision trees and heuristics in main file |
| output-contract.md | 60 lines | 120 lines | Stable — if growing, the expert may be doing too many things. Consider splitting the expert |
| quality-criteria.md | 60 lines | 120 lines | Stable — growth here mirrors output-contract |
| dependencies.md | 40 lines | 80 lines | Stable — growth here means the expert has too many interfaces. Consider splitting |
| freshness-triggers.md | 40 lines | 80 lines | Stable |
| risk-register.md | 60 lines | 120 lines | Extract mitigated/retired risks to `risk-register/archive.md` |
| escalation-thresholds.md | 60 lines | 120 lines | Stable — growth here means the expert's scope is expanding |
| task-routing.md | 60 lines | 120 lines | Extract completed extractions to a `utilities/` index |
| retro-log.md | 120 lines | 200 lines | Consolidate — see retro log consolidation below |

**Total expert context budget:** ~700 lines across all layers. An expert that
exceeds this is either too broad (split it) or too old (consolidate it).

### Selective loading

Not every task requires every layer. The task-routing layer declares which layers
to load for each task type. Default loading profiles:

| Activity | Layers loaded | Rationale |
|---|---|---|
| **Core work** (producing an output) | README + essential-briefing + domain-knowledge + judgment-framework + output-contract + task-routing | Needs knowledge, judgment, and the contract. Doesn't need review history or freshness triggers. |
| **Design review** (evaluating others' work) | README + essential-briefing + quality-criteria + judgment-framework + task-routing | Needs criteria and judgment. Doesn't need its own output contract or domain deep-dives. |
| **Self-assessment** | README + essential-briefing + quality-criteria + retro-log + task-routing | Reflecting on past performance. Doesn't need domain knowledge or judgment framework loaded — those are what it's *evaluating*. |
| **360 review** (reviewing another expert) | README + essential-briefing + quality-criteria + output-contract (own) + dependencies | Reviewing through its own criteria. Needs to know its interface contract with the reviewed expert. |
| **Update sweep** (`/expert-update`) | README + essential-briefing + freshness-triggers + dependencies + retro-log | Checking for staleness and cascades. Loads other layers only when a trigger fires. |
| **Escalation check** | README + essential-briefing + escalation-thresholds | Quick lookup — should this action be autonomous, notify, or gated? |
| **Convocation** | README + essential-briefing + judgment-framework | Joint deliberation on novel problems. Case-specific knowledge is in the case briefing, not domain-knowledge. See [convocation-protocol.md](convocation-protocol.md). |

Agents activating an expert should load the profile matching their task, not the
full expert. The README always loads — it's the identity and metadata.

### Retro log consolidation

The retro log is the fastest-growing layer. Consolidation protocol:

**When:** Retro log exceeds 200 lines, or during quarterly `/expert-update`.

**Verbatim-first principle:** Raw interaction summaries are the highest-signal
data. MemPalace benchmarks show verbatim storage achieves 96.6% recall vs.
30-45% for summarized storage. Preserve raw entries as long as possible — archive
but do not compress or summarize the original text.

**How:**

1. **Archive raw entries verbatim** — Move interaction summaries older than 2
   review cycles to `retro-log/archive/YYYY-QN.md`. Archive files preserve the
   full original text of each entry. Do not compress, summarize, or rewrite
   archived entries — they are the ground truth.

2. **Extract patterns as pointers** — Recurring themes across multiple entries
   become *consolidated learnings*: one-line summaries with a date range and
   **explicit references** to the archived entries that support them (by date
   and short description). The consolidated learning is an index entry, not a
   replacement for the raw data.

   ```markdown
   ### Consolidated learnings

   - **Approval card context** (2026-Q1, 5 interactions): Human consistently
     adds payer-specific context. → Updated judgment-framework.md 2026-04-15.
     Sources: 2026-01-12, 2026-02-03, 2026-02-14, 2026-03-01, 2026-03-22.
   - **Kitchen density** (2026-Q1, 3 interactions): Table format preferred over
     card layout for order lists. → Confirmed in judgment-framework.md.
     Sources: 2026-01-20, 2026-02-08, 2026-03-15.
   ```

3. **Semantic deduplication** — Before archiving, identify entries that describe
   the same interaction or outcome from different angles. Keep the most complete
   version, note the duplicate in a `Deduplicated:` footer.

4. **Retire resolved items** — Open questions that have been answered, growth areas
   that have been addressed, and extraction candidates that have been completed
   move to the archive.

5. **360 reviews compress** — Individual review entries consolidate into a summary
   per cycle: top 3 strengths, top 3 growth areas, actions taken. Full reviews
   are preserved verbatim in the archive.

The active retro log should contain: consolidated learnings (persistent), current
cycle's interaction summaries (temporary), and the most recent self-assessment
and 360 review (one cycle).

### Multi-expert context budget

When multiple experts are active simultaneously (360 reviews, cross-expert
collaboration, pipeline tasks), total context must stay manageable.

**Protocol:**

- **360 review:** Reviewer loads its review profile (4 layers). Reviewed expert
  provides only its retro log summaries — not its full spec. Total per review
  pair: ~200 lines.

- **Cross-expert collaboration:** Each expert loads its core work profile. Shared
  context (the task description, relevant project docs) loads once, not per expert.
  Total for 2-expert collaboration: ~1400 lines expert context + shared context.

- **Registry-level health check:** During `/expert-update`, the sweep calculates
  total line count across all experts. Thresholds:

  | Total expert lines | Status | Action |
  |---|---|---|
  | < 5,000 | Healthy | No action needed |
  | 5,000 – 10,000 | Watch | Review largest experts for consolidation or splitting |
  | > 10,000 | Action required | Consolidate retro logs, extract domain knowledge sub-files, consider splitting large experts |

  This scales with the number of experts: 10 experts at 700 lines each = 7,000 (watch).
  The budget naturally pressures experts to stay lean.

### Expert splitting criteria

An expert should split into two when:

- Its domain knowledge covers genuinely distinct sub-domains that change on
  different schedules (e.g., "claims submission" vs. "denial management")
- Its judgment framework has decision trees that never interact
- Its output contract serves different downstream consumers with different needs
- Its total context consistently exceeds the 700-line budget after consolidation

When splitting, the original expert's retro log stays with whichever child
inherits the majority of the interaction history. The other child starts fresh
but inherits relevant consolidated learnings.

---

## Lifecycle

An expert progresses through a defined lifecycle from authoring to live use.
The transitions between stages are governed by specific protocols:

| Stage | Health status | What's happening | Governed by |
|---|---|---|---|
| **Authoring** | `draft` | Layers being written. No workflow participation. | This spec (layer definitions) |
| **Shadowing** | `draft` | Expert runs alongside live path, output captured but not consumed. Calibrating against real cases. | [shadowing-protocol.md](shadowing-protocol.md) |
| **Live** | `green` | Expert handles workflow steps directly. Retro log accumulates live interaction data. | This spec (retro log, review system) |
| **Revision** | `green` → `yellow` | Major spec update triggers regression shadow before the new version goes live. | [shadowing-protocol.md](shadowing-protocol.md) (trigger 3) |
| **Degraded** | `yellow` or `red` | Freshness trigger fired or validation failed. Workflow steps may fall back. | [fallback-modes.md](fallback-modes.md) |
| **Split** | N/A | Expert exceeds scope — divides into two. | This spec (splitting criteria) |

**Rollback:** A live expert that produces unexpected results in its first
runs can revert to shadow mode. The previous live path (fallback or prior
version) resumes. See [shadowing-protocol.md](shadowing-protocol.md) for
rollback mechanics.

---

## Metadata (in README.md frontmatter)

```yaml
expert: <name>
version: <semver>
created: <date>
last-validated: <date>
org-function: <which org function this expert serves>
automation-tier: <from automation-readiness rubric>
health: green | yellow | red | draft
```
