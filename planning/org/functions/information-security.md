# Information Security

> Protecting the systems, data, and infrastructure that handle PHI and run the
> business. Distinct from Compliance (which handles regulatory requirements) and
> Internal Ops (which handles general IT). This function owns the security posture.

---

## Responsibilities

- Security architecture — defense in depth, zero trust, encryption standards
- Access control — identity management, authentication, authorization
- Vulnerability management — scanning, patching, remediation
- Threat detection and response — monitoring, alerting, incident handling
- Penetration testing — periodic security assessments
- Security awareness — staff training on security practices
- Vendor security assessment — evaluating third-party security posture
- Data encryption — at rest, in transit, key management
- LLM/AI security — prompt injection prevention, data leakage controls, model access
- Business continuity — disaster recovery, backup verification

## Sub-functions

| Sub-function | Automation target | Agent coverage | Notes |
|---|---|---|---|
| Access control management | 🤖 Automated | QueueManager | Role-based provisioning, MFA enforcement |
| Vulnerability scanning | 🤖 Automated | None (DevOps tooling) | Automated scanners on schedule |
| Patch management | 🤖 Automated | None (DevOps tooling) | Automated patching with rollback |
| Threat detection | 🤖 Automated | AuditMonitor | SIEM integration, anomaly detection |
| Incident response | 🤝 Agent-assisted | AuditMonitor, AlertRouter | Agent detects + triages; human responds |
| Penetration testing | 👤 Human-primary | None | External assessors, annual minimum |
| Vendor security review | 🤝 Agent-assisted | None (gap) | Agent pre-screens; human evaluates |
| Security awareness training | 🤝 Agent-assisted | None (gap) | Agent delivers + tracks; human updates content |
| Encryption key management | 🤖 Automated | None (infrastructure) | Cloud KMS, automated rotation |
| LLM security monitoring | 🤖 Automated | AuditMonitor | Prompt injection detection, PHI-in-prompt monitoring |
| Backup verification | 🤖 Automated | None (DevOps tooling) | Automated restore testing |
| Security posture reporting | 🤖 Automated | ReportingAgent | Dashboards + periodic reports |

## Interfaces

| Direction | Function | What flows |
|---|---|---|
| **From** | Product & Engineering | Code changes, infrastructure changes, new integrations |
| **From** | Internal Ops | System events, access requests |
| **From** | All functions | Security incidents, suspicious activity reports |
| **To** | Compliance | Security posture data, incident reports |
| **To** | Executive | Security risk assessment, incident summaries |
| **To** | Legal & Corporate | Breach notification triggers |
| **To** | Product & Engineering | Security requirements, vulnerability findings |

## Current state

Andrey handles security as part of infrastructure. GCP provides baseline security
services (Cloud KMS, IAM, VPC). No dedicated security function. HIPAA Security Rule
compliance is architecturally designed but not yet independently assessed.

LLM security is a unique concern — Claude via Vertex AI ([AD-02](../../decisions.md))
means PHI potentially in prompts. BAA coverage addresses the legal side; technical
controls (prompt sanitization, output filtering, access logging) address the operational side.

## Quality checks

- Vulnerability scans run weekly on all production systems
- Critical vulnerabilities patched within 24 hours
- Penetration test conducted annually by external firm
- Access reviews quarterly — revoke unused access
- Security incident response tested semi-annually (tabletop exercise)
- LLM interactions audited monthly for PHI exposure patterns
- Encryption keys rotated per policy (90 days for data keys)

## Why this deserves its own function

For a HIPAA-covered entity pushing PHI through LLM pipelines:
- The attack surface is novel (prompt injection, model data leakage)
- A breach has legal, financial, and reputational consequences that dwarf most operational failures
- Security requirements cascade into every other function's design
- Splitting security across Internal Ops and Compliance creates gaps

## Automation roadmap

**Phase 1:** Automated vulnerability scanning and patch management. Access
provisioning/deprovisioning tied to role changes. LLM interaction logging.

**Phase 2:** Threat detection with SIEM integration. Automated vendor security
pre-screening. Security posture dashboards.

**Phase 3:** Predictive threat modeling — agent identifies emerging risks from
threat intelligence feeds and maps them to Cena Health's attack surface.
Automated compliance evidence collection for audits.
