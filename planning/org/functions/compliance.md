# Compliance & Regulatory

> How Cena Health stays legal, licensed, and auditable. This is the clinical and
> healthcare compliance function. Corporate legal matters are in [legal-corporate.md](legal-corporate.md).

---

## Responsibilities

- HIPAA compliance — Privacy Rule, Security Rule, Breach Notification
- PHI access controls and audit
- Consent management
- Clinical regulatory compliance (state-by-state)
- Audit readiness — documentation, evidence collection, response
- Privacy incident response
- Staff compliance training
- LLM/AI compliance — BAA coverage, data handling, model governance

## Sub-functions

| Sub-function | Automation target | Agent coverage | Notes |
|---|---|---|---|
| PHI access monitoring | 🤖 Automated | AuditMonitor | Continuous monitoring, anomaly detection |
| Consent tracking | 🤖 Automated | PatientJourneyOrchestrator | Consent status enforced at enrollment |
| Audit log maintenance | 🤖 Automated | Thread model (structural) | Thread-as-audit-log is the architecture |
| Compliance reporting | 🤖 Automated | ReportingAgent | Scheduled compliance digests |
| Privacy incident detection | 🤖 Automated | AuditMonitor | Pattern-based detection |
| Privacy incident response | 🤝 Agent-assisted | AuditMonitor | Agent detects and drafts response; human manages |
| Training tracking | 🤝 Agent-assisted | None (gap) | Completion tracking, renewal reminders |
| Regulatory change monitoring | 🤖 Automated | None (gap) | State/federal healthcare regulation changes |
| LLM governance | 🤝 Agent-assisted | AuditMonitor | PHI exposure monitoring, model access audit |
| BAA compliance verification | 🤖 Automated | None (gap) | Cross-reference with [legal-corporate.md](legal-corporate.md) |

## Interfaces

| Direction | Function | What flows |
|---|---|---|
| **From** | All functions | Actions that touch PHI, audit events |
| **From** | Legal & Corporate | BAA inventory, regulatory interpretations |
| **From** | People & Culture | Staff credential and training status |
| **To** | Executive | Compliance posture, risk assessment |
| **To** | All functions | Compliance requirements, constraints |
| **To** | Legal & Corporate | Incidents requiring legal response |
| **To** | Product & Engineering | Security requirements, audit findings |
| **To** | People & Culture | Credentialing requirements, training mandates |

## Current state

HIPAA compliance is architecturally designed into the platform (thread-as-audit-log,
role-based PHI access, minimum necessary enforcement). LLM BAA in progress via
Google/Vertex AI ([AD-02 in decisions.md](../../decisions.md)).
Workflows specified in [06-compliance.md](../../workflows/06-compliance.md) (9 workflows).

## Quality checks

- PHI access audit reviewed weekly (automated anomaly detection)
- Every patient has documented consent before any PHI access
- Breach notification timeline met (72 hours to HHS if applicable)
- Staff training completion > 95% at all times
- Annual HIPAA risk assessment completed
- LLM data handling audited quarterly

## Structural advantage

Ava's architecture makes compliance easier than in traditional systems:
- The thread is the audit log — no separate compliance logging needed
- Role-based tool registries enforce minimum necessary at the action level
- AuditMonitor runs continuously, not as periodic spot-checks
- Consent is a gate in the patient state machine, not a paper form

## Detailed workflows

See [06-compliance.md](../../workflows/06-compliance.md) for full workflow specifications.
