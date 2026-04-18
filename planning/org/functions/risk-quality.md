# Risk Management & Quality

> How Cena Health catches problems before they become crises and continuously
> improves care quality. The function that makes the system learn.

---

## Responsibilities

- Patient risk scoring and tier management
- Clinical alert generation and routing
- Quality metrics tracking (HEDIS, custom)
- Outcome measurement and benchmarking
- Incident reporting and root cause analysis
- Care gap identification
- Population health management
- Continuous quality improvement (CQI) cycles

## Sub-functions

| Sub-function | Automation target | Agent coverage | Notes |
|---|---|---|---|
| Risk scoring | 🤖 Automated | RiskScoringAgent | Continuous scoring from patient data |
| Risk tier transitions | 🤝 Agent-assisted | RiskScoringAgent, AlertRouter | Agent proposes tier change; clinician confirms for upgrades |
| Clinical alerts | 🤖 Automated | AlertRouter | Routed by urgency, type, and availability |
| Quality metric calculation | 🤖 Automated | ReportingAgent | HEDIS and custom metrics from clinical data |
| Outcome benchmarking | 🤖 Automated | ReportingAgent | Compare against baselines and peer data |
| Incident reporting | 🤝 Agent-assisted | AuditMonitor | Agent detects and categorizes; human investigates |
| Root cause analysis | 👤 Human-primary | AuditMonitor (provides data) | Requires clinical judgment |
| Care gap detection | 🤖 Automated | RiskScoringAgent | Identify patients missing expected services |
| CQI cycle management | 🤝 Agent-assisted | None (gap) | Plan-Do-Study-Act cycles tracked |

## Interfaces

| Direction | Function | What flows |
|---|---|---|
| **From** | Patient Operations | Patient data, status changes |
| **From** | Clinical Care | Visit outcomes, lab results, documentation |
| **From** | Meal Operations | Delivery success, dietary adherence |
| **To** | Clinical Care | Alerts, care gaps, risk tier changes |
| **To** | Patient Operations | Risk-driven monitoring frequency changes |
| **To** | Executive | Quality dashboards, incident summaries |
| **To** | Data & Analytics | Quality data for population analysis |
| **To** | Partner & Payer | Quality metrics for partner reporting |
| **From** | Patient Experience | Engagement scores as risk factor |
| **From** | Clinical Education | Competency data for quality analysis |

## Current state

Risk scoring architecture defined in [agent-framework.md](../../architecture/agent-framework.md).
Weight change process decided ([AD-06 in decisions.md](../../decisions.md)).
HEDIS data model pending ([OQ-07](../../open-questions.md)).
Workflows specified in [07-risk-management.md](../../workflows/07-risk-management.md) (6 workflows).

## Quality checks

- Risk scores recalculated on every data change (not batch)
- Critical alerts acknowledged within SLA (2 hours)
- Quality metrics published monthly
- Incident root cause analysis completed within 7 days
- Care gaps surfaced to responsible provider within 24 hours

## Detailed workflows

See [07-risk-management.md](../../workflows/07-risk-management.md) for full workflow specifications.
