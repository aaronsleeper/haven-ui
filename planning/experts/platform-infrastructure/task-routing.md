# Task Routing — Platform / Infrastructure

Maps each task to execution mode and model tier.

---

## Task map

### Architecture decision proposals

| Task | Model tier | Determinism | Rationale |
|---|---|---|---|
| Draft novel architecture decision (first proposal for a domain) | Deep (Opus) | Probabilistic | Cross-cutting trade-offs, novel judgment calls, multiple stakeholder impacts. Per AD-04/05/07 — these are foundational decisions. |
| Draft architecture decision applying established pattern | Standard (Sonnet) | Probabilistic | Known framework applies but needs adaptation to specific context. |
| Update existing proposal based on CTO feedback | Standard (Sonnet) | Partially deterministic | Incorporating specific feedback into structured document. |
| Reversibility assessment for a decision | Standard (Sonnet) | Probabilistic | Requires reasoning about future scenarios and migration paths. |

### Infrastructure specs

| Task | Model tier | Determinism | Rationale |
|---|---|---|---|
| Design cross-cutting infrastructure (data pipeline, multi-tenancy) | Deep (Opus) | Probabilistic | Multiple services, security boundaries, compliance requirements interact. |
| Spec a single GCP service configuration | Standard (Sonnet) | Partially deterministic | Applying documented GCP patterns to Cena's specific requirements. |
| Generate Mermaid architecture diagram | Standard (Sonnet) | Partially deterministic | Translating design into diagram syntax — structure is known, layout needs judgment. |
| Estimate costs for a proposed architecture | Light (Haiku) | Mostly deterministic | Lookup against GCP pricing calculator with known service parameters. |

### Incident response

| Task | Model tier | Determinism | Rationale |
|---|---|---|---|
| Design on-call policy framework | Deep (Opus) | Probabilistic | Balancing human factors, SLA requirements, team sustainability — novel for this team. |
| Draft playbook for known incident type | Standard (Sonnet) | Partially deterministic | Adapting established incident response patterns to Cena's infrastructure. |
| Classify incident severity (P1/P2/P3) | Light (Haiku) | Mostly deterministic | Matching incident description against defined severity criteria. |

### Reference and validation

| Task | Model tier | Determinism | Rationale |
|---|---|---|---|
| Check GCP service BAA eligibility | Light (Haiku) | Deterministic | Lookup against published BAA service list. |
| Validate Mermaid diagram syntax | Light (Haiku) | Deterministic | Syntax validation — no judgment needed. |
| Cross-reference proposal against quality criteria | Light (Haiku) | Mostly deterministic | Checklist evaluation against defined criteria. |

### Review system tasks

| Task | Model tier | Determinism | Rationale |
|---|---|---|---|
| Capture interaction summary | Light (Haiku) | Mostly deterministic | Structured extraction into template. |
| Self-assessment against quality criteria | Standard (Sonnet) | Probabilistic | Pattern detection across summaries. |
| Synthesize 360 feedback into proposals | Deep (Opus) | Probabilistic | Cross-referencing multiple perspectives. |

---

## Extraction candidates

| Task | Current tier | Extraction type | Status |
|---|---|---|---|
| GCP BAA eligibility check | Haiku | Lookup table: service name -> BAA status | Ready — list is published and static between updates |
| Cost estimation | Haiku | Script: service list x pricing table -> monthly estimate | Candidate — needs pricing table maintenance |
| Severity classification | Haiku | Decision table: incident attributes -> P1/P2/P3 | Candidate — criteria need to stabilize first |

---

## Context loading profiles

| Activity | Layers loaded |
|---|---|
| **Draft architecture proposal** | README, domain-knowledge, judgment-framework, output-contract, task-routing |
| **Draft infrastructure spec** | README, domain-knowledge, output-contract, task-routing |
| **Draft incident playbook** | README, domain-knowledge (incident response section), output-contract, task-routing |
| **Self-assessment** | README, quality-criteria, retro-log, task-routing |
| **360 peer review** (as reviewer) | README, quality-criteria, output-contract, dependencies |
| **Update sweep** | README, freshness-triggers, dependencies, retro-log |
| **Escalation check** | README, escalation-thresholds |
