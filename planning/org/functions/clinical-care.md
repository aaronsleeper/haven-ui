# Clinical Care

> How care is delivered, documented, and coordinated. The clinical core of the
> company — where patient outcomes are made.

---

## Responsibilities

- Nutrition assessment and counseling (RDN)
- Behavioral health assessment and monitoring (BHN)
- Clinical documentation (SOAP notes, care plans, progress notes)
- Lab result tracking and interpretation
- Medication reconciliation
- Care plan lifecycle management
- Clinical scheduling
- Crisis protocol management
- Inter-provider communication

## Sub-functions

| Sub-function | Automation target | Agent coverage | Notes |
|---|---|---|---|
| Visit scheduling | 🤖 Automated | CommunicationAgent | Calendar matching + patient preference |
| Pre-visit prep | 🤖 Automated | DocumentationAgent, RiskScoringAgent | Agent compiles patient summary, flags changes |
| Visit documentation | 🤝 Agent-assisted | DocumentationAgent | Agent drafts SOAP note from transcript; provider reviews |
| Lab tracking | 🤖 Automated | DataExchangeAgent, RiskScoringAgent | Inbound lab results → risk score update → alerts |
| Medication reconciliation | 🤝 Agent-assisted | DocumentationAgent | Agent flags discrepancies; provider confirms |
| Care plan updates | 🤝 Agent-assisted | DocumentationAgent | Agent proposes updates; RDN approves |
| Crisis protocol | 🚫 Always human (agent-triggered) | AVA, AlertRouter | Hard stops trigger immediate human response |
| Clinical quality review | 🤝 Agent-assisted | AuditMonitor | Agent flags documentation gaps; supervisor reviews |
| Peer consultation | 🚫 Always human | None | Clinical judgment between providers |

## Interfaces

| Direction | Function | What flows |
|---|---|---|
| **From** | Patient Operations | Enrolled patients, assessment data, care plans |
| **From** | Data & Analytics | Population health insights, benchmarks |
| **To** | Revenue Cycle | Documented visits for claims generation |
| **To** | Risk & Quality | Clinical data for risk scoring and quality metrics |
| **To** | Meal Operations | Updated dietary prescriptions |
| **To** | Data & Analytics | Clinical outcome data |
| **To** | Compliance | Documentation for audit |
| **To** | Product & Engineering | Feature requests, workflow gaps |
| **To** | Marketing & Brand | Clinical accuracy review for patient-facing content |

## Current state

No clinical operations yet — platform in planning phase. RDN roles defined.
Workflows fully specified in [02-clinical-care.md](../../workflows/02-clinical-care.md) (9 workflows).
Open question on documentation format: [OQ-16](../../open-questions.md) (SOAP vs NCP/eNCPT).

## Quality checks

- Every visit documented within 24 hours
- Care plans reviewed at defined intervals (quarterly minimum)
- Lab results acknowledged within SLA (critical: 2 hours, routine: 24 hours)
- Crisis protocol triggers verified monthly (test scenarios)
- Documentation completeness score tracked per provider

## Detailed workflows

See [02-clinical-care.md](../../workflows/02-clinical-care.md) for full workflow specifications.

## Key roles

- [RDN](../../roles/rdn.md) — nutrition assessment and care
- [BHN](../../roles/bhn.md) — behavioral health assessment
- [Care Coordinator](../../roles/care-coordinator.md) — care team coordination
- ClinicalOrchestrator — workflow state management
