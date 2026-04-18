# Task Routing -- Operations / Compliance

Maps each task this expert performs to its execution mode (probabilistic vs.
deterministic) and model tier (Opus / Sonnet / Haiku). Reviewed during
`/expert-update` for optimization opportunities.

---

## Task map

### Policy proposals (core work)

| Task | Model tier | Determinism | Rationale |
|---|---|---|---|
| Draft policy proposal for novel open question | Deep (Opus) | Probabilistic | Cross-domain synthesis: regulatory research + operational context + business strategy. Requires weighing tradeoffs and producing structured recommendations with uncertainty analysis. |
| Draft policy proposal for well-precedented question | Standard (Sonnet) | Probabilistic | Applying established compliance frameworks to a known question type. Still requires judgment but within predictable bounds. |
| Update existing proposal based on new information | Standard (Sonnet) | Probabilistic | Revising a recommendation when assumptions are validated, new regulatory guidance appears, or Vanessa provides feedback. |

### BAA assessments

| Task | Model tier | Determinism | Rationale |
|---|---|---|---|
| BAA necessity analysis for novel entity type | Deep (Opus) | Probabilistic | Novel relationship types require reasoning through the BAA decision tree with nuanced PHI exposure analysis. |
| BAA necessity analysis for known entity type | Standard (Sonnet) | Mostly deterministic | Applying the BAA decision tree to a relationship type already analyzed (e.g., second kitchen partner). |
| PHI exposure documentation for known data flows | Light (Haiku) | Mostly deterministic | Documenting specific data elements in an established data flow. Template-driven. |

### Billing compliance

| Task | Model tier | Determinism | Rationale |
|---|---|---|---|
| Full billing compliance check for new service type | Standard (Sonnet) | Probabilistic | Requires researching payer-specific requirements, verifying code applicability, and identifying gaps. |
| Verify CPT code accuracy | Light (Haiku) | Deterministic candidate | Lookup against published CMS code definitions. Could be a reference table. |
| Check timely filing window for specific payer | Light (Haiku) | Deterministic candidate | Lookup against payer-specific filing rules. Could be a lookup table once mapped. |
| Medicare MNT visit cap verification | Light (Haiku) | Deterministic | Published cap (3+2/year). Binary check against published rules. |

### Contract frameworks

| Task | Model tier | Determinism | Rationale |
|---|---|---|---|
| Design pricing model framework for new partner type | Deep (Opus) | Probabilistic | Novel synthesis: partner context + market benchmarks + regulatory constraints + Cena cost structure. |
| Apply existing framework to new partner | Standard (Sonnet) | Probabilistic | Adapting an established framework to specific partner parameters. Judgment needed for rate adjustments. |
| Reconciliation process documentation | Standard (Sonnet) | Partially deterministic | Structured process but requires judgment on dispute escalation paths and reporting cadence. |

### Regulatory research

| Task | Model tier | Determinism | Rationale |
|---|---|---|---|
| Research new regulatory requirement | Standard (Sonnet) | Probabilistic | Finding, interpreting, and contextualizing regulatory guidance for Cena's specific situation. |
| Reference lookup (specific rule, code, deadline) | Light (Haiku) | Deterministic | Direct lookup against known authoritative source. |
| Freshness check against published sources | Light (Haiku) | Mostly deterministic | Comparing current domain knowledge against latest published guidance. |

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
| CPT code verification | Haiku | Lookup table: code -> description, rate, modifier requirements | Candidate -- needs CMS fee schedule data source |
| Timely filing window lookup | Haiku | Lookup table: payer -> filing deadline, appeal window | Ready once OQ-27 is resolved and payer map created |
| Medicare MNT visit cap check | Haiku | Deterministic function: visit count against 3+2 annual cap | Ready -- cap is stable and published |
| HEDIS measure field requirements | Haiku | Reference table: measure -> required fields, data types | Candidate -- needs NCQA spec extraction |
| Dietetics Compact state lookup | Haiku | Lookup table: state -> compact member (yes/no), effective date | Ready -- published list, updated annually |

---

## Context loading profiles

| Activity | Layers loaded |
|---|---|
| **Draft policy proposal** | README, domain-knowledge, judgment-framework, output-contract, task-routing |
| **BAA assessment** | README, domain-knowledge (BAA management section), judgment-framework (BAA tree), output-contract |
| **Billing compliance check** | README, domain-knowledge (Medicare/Medicaid section), output-contract, task-routing |
| **Contract framework** | README, domain-knowledge (partner contracts + VBC sections), judgment-framework (pricing tree), output-contract |
| **Self-assessment** | README, quality-criteria, retro-log, task-routing |
| **360 peer review** (as reviewer) | README, quality-criteria, output-contract, dependencies |
| **Update sweep** | README, freshness-triggers, dependencies, retro-log |
| **Escalation check** | README, escalation-thresholds |
