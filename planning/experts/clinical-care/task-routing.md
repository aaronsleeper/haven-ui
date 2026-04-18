# Task Routing — Clinical Care

Maps each task this expert performs to its execution mode (probabilistic vs.
deterministic) and model tier (Opus / Sonnet / Haiku). Reviewed during
`/expert-update` for optimization opportunities.

---

## Task map

### Care plan drafting (core work)

| Task | Model tier | Determinism | Rationale |
|---|---|---|---|
| Draft care plan for novel patient (first plan, complex comorbidities) | Deep (Opus) | Probabilistic | First-time synthesis across clinical, nutritional, and behavioral data for a unique patient. Requires weighing restriction conflicts, individualizing targets. Per step 1.0 SLA: 5 minutes. |
| Draft care plan for single, well-controlled condition | Standard (Sonnet) | Probabilistic | Established MNT targets apply; some individualization from labs and meds but within predictable bounds. |
| Auto-populate BH section (PHQ-9 < 10) | Light (Haiku) | Mostly deterministic | Template-driven population from structured score. Could extract to template. |
| Generate SMART goals from assessment data | Standard (Sonnet) | Probabilistic | Goal quality requires understanding the patient's specific situation; template goals are detectable and unacceptable. |
| Calculate risk flags from structured assessment | Light (Haiku) | Deterministic candidate | Mechanical computation on structured fields against defined thresholds. |

### Clinical review

| Task | Model tier | Determinism | Rationale |
|---|---|---|---|
| Review care plan for guideline compliance | Standard (Sonnet) | Probabilistic | Applying known guidelines to a structured draft. Per step 2a SLA: 2 minutes. Judgment needed for borderline cases. |
| Check dosage range validation | Light (Haiku) | Deterministic candidate | Known ranges for common medications. Could be a lookup table/script. |
| Flag drug-nutrient interactions | Light (Haiku) | Mostly deterministic | Database lookup plus basic interaction logic. Edge cases exist for novel drug combinations. |
| Assess overall plan quality (summary) | Standard (Sonnet) | Probabilistic | Requires synthesizing multiple quality dimensions into a coherent assessment. |

### Care plan updates

| Task | Model tier | Determinism | Rationale |
|---|---|---|---|
| Classify update trigger (minor/major/emergency) | Standard (Sonnet) | Partially deterministic | Decision tree is defined but edge cases require judgment (e.g., is this lab change significant enough for major?). |
| Draft proposed section changes | Standard (Sonnet) | Probabilistic | Must translate new clinical data into specific care plan modifications with rationale. |
| Identify downstream impacts | Light (Haiku) | Mostly deterministic | Mapping affected sections to downstream workflows is largely mechanical. |

### Clinical escalation

| Task | Model tier | Determinism | Rationale |
|---|---|---|---|
| Detect Q9 > 0 and route to crisis protocol | Light (Haiku) | Deterministic | Binary check on a single field. Should be extracted to a deterministic function — too critical for probabilistic handling. |
| Assess risk tier transition | Standard (Sonnet) | Partially deterministic | Threshold crossing is computable; severity classification and recommended action need clinical context. |
| Evaluate disengagement pattern | Standard (Sonnet) | Probabilistic | Pattern detection across multiple engagement signals requires reasoning about context. |

### Review system tasks

| Task | Model tier | Determinism | Rationale |
|---|---|---|---|
| Capture interaction summary | Light (Haiku) | Mostly deterministic | Structured extraction from conversation into known template. |
| Self-assessment against quality criteria | Standard (Sonnet) | Probabilistic | Pattern detection across multiple summaries. |
| Synthesize 360 feedback into proposals | Deep (Opus) | Probabilistic | Cross-referencing multiple reviewer perspectives and proposing specific edits. |

---

## Extraction candidates

| Task | Current tier | Extraction type | Status |
|---|---|---|---|
| Q9 > 0 crisis detection | Haiku | Deterministic function: binary field check → immediate alert | **Ready — extract immediately.** Too safety-critical for probabilistic handling. |
| Dosage range validation | Haiku | Lookup table: medication → acceptable ranges → flag if outside | Candidate — needs standardized medication-range data source |
| Drug-nutrient interaction check | Haiku | Database query: medication list × known interactions → flag list | Candidate — needs interaction database integration |
| Risk flag calculation | Haiku | Script: assessment fields × threshold table → risk flag list | Candidate — needs threshold table formalized |
| BH section auto-population (PHQ-9 < 10) | Haiku | Template: score + standard monitoring language → BH section | Ready — template is stable |
| Downstream impact mapping | Haiku | Lookup: affected section → downstream workflow list | Ready — mapping is static |

---

## Context loading profiles

| Activity | Layers loaded |
|---|---|
| **Draft care plan** | README, domain-knowledge, judgment-framework, output-contract, task-routing |
| **Clinical review** | README, quality-criteria, judgment-framework, task-routing |
| **Care plan update** | README, domain-knowledge, judgment-framework, output-contract, task-routing |
| **Clinical escalation** | README, escalation-thresholds, domain-knowledge (risk stratification section only) |
| **Self-assessment** | README, quality-criteria, retro-log, task-routing |
| **360 peer review** (as reviewer) | README, quality-criteria, output-contract, dependencies |
| **Update sweep** | README, freshness-triggers, dependencies, retro-log |
| **Escalation check** | README, escalation-thresholds |
