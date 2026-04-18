# Task Routing — Compliance

Determinism assessment and model tier for each task this expert performs.

---

## Task map

| Task | Model tier | Determinism | Rationale | Extraction status |
|---|---|---|---|---|
| PHI field classification (is this field PHI?) | Light (Haiku) | High — 18 Safe Harbor identifiers are a fixed list | Matching a field against a known list. Judgment only for edge cases (derived fields, aggregates). | Candidate for extraction — could be a lookup function against the 18-identifier list |
| Field access matrix update (new field or role) | Standard (Sonnet) | Medium — requires minimum-necessary analysis per role | Applying the field-render decision tree to a new field × role combination. Framework is established but inputs vary. | Not extractable — requires contextual judgment about operational need |
| Consent scope review | Standard (Sonnet) | Medium — applying boundary rules to a specific data operation | Matching operation against consent type covers/does-not-cover lists. Novel operations require judgment. | Not extractable — consent scope has edge cases |
| Compliance review (UI design) | Deep (Opus) | Low — cross-domain synthesis of field access rules, consent scope, and visual design | First-time review of a new screen or component. Must understand what the UI is trying to accomplish and whether it complies. | Not extractable |
| Compliance review (workflow step) | Standard (Sonnet) | Medium — applying audit and consent rules to a defined step | Workflow steps have structured inputs/outputs. Check each against the audit trigger spec and consent scope. | Partially extractable — audit coverage check could be automated |
| Compliance review (tool assignment) | Standard (Sonnet) | Medium-high — comparing tool's field access against agent's authorized scope | Structured comparison. Judgment needed only when tool returns more fields than minimum-necessary but restricting would break the tool. | Candidate for extraction with a tool-field-scope comparison function |
| Breach risk assessment | Deep (Opus) | Low — novel situation, high stakes, requires synthesis of 4 factors | Every potential breach is unique. Cannot be templated beyond the 4-factor framework. | Not extractable — must remain judgment |
| Audit trigger specification (new workflow) | Standard (Sonnet) | Medium — applying audit requirements to structured workflow steps | Walk each step, identify PHI access, specify trigger. Methodical but requires understanding of what each step does. | Partially extractable — step-to-trigger mapping could be semi-automated |
| De-identification method selection | Light (Haiku) | High for Safe Harbor (prescriptive), Low for Expert Determination | Safe Harbor: remove the 18 identifiers. Expert Determination: requires statistical analysis — always escalate to qualified expert. | Safe Harbor selection is extractable; Expert Determination is not |

---

## Selective loading profiles

| Activity | Layers loaded |
|---|---|
| Compliance review (any type) | README + domain-knowledge + judgment-framework + output-contract + task-routing |
| Field access matrix update | README + domain-knowledge (PHI field inventory) + output-contract (matrix format) + task-routing |
| Breach assessment | README + domain-knowledge (breach notification) + judgment-framework (breach tree) + risk-register + escalation-thresholds |
| Self-assessment | README + quality-criteria + retro-log + task-routing |
| 360 review of another expert | README + quality-criteria + output-contract + dependencies |
