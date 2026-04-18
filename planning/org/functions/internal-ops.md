# Internal Operations

> How the company runs day to day. Infrastructure, tooling, processes, and the
> operational glue that keeps everything working.

---

## Responsibilities

- IT infrastructure management
- Security operations (infosec, access management)
- Vendor management (non-clinical)
- Office/remote work operations
- Internal communications and coordination
- Process documentation and improvement
- Disaster recovery and business continuity
- On-call and incident management

## Sub-functions

| Sub-function | Automation target | Agent coverage | Notes |
|---|---|---|---|
| Infrastructure monitoring | 🤖 Automated | None (DevOps tooling) | Cloud monitoring, alerting, auto-scaling |
| Access management | 🤖 Automated | QueueManager | Role-based provisioning/deprovisioning |
| Vendor management | 🤝 Agent-assisted | None (gap) | Contract tracking, performance review |
| Incident management | 🤝 Agent-assisted | AlertRouter | See [AD-07](../../decisions.md), [OQ-38](../../open-questions.md) |
| Process documentation | 🤖 Automated | None (gap) | Generated from workflows and decision logs |
| Internal comms | 🤝 Agent-assisted | None (gap) | Meeting summaries, status updates |
| Disaster recovery | 👤 Human-primary | None | Playbook-based, annual testing |
| Security operations | 🤖/🤝 Mixed | AuditMonitor | Automated monitoring, human response |

## Interfaces

| Direction | Function | What flows |
|---|---|---|
| **From** | Product & Engineering | System status, deployment events |
| **From** | All functions | IT requests, access requests, incidents |
| **To** | All functions | Working infrastructure, resolved incidents |
| **To** | Compliance | Security posture, access audit data |
| **To** | Executive | Operational health, incident summaries |
| **To** | Information Security | System events, access requests |

## Current state

Andrey handles infrastructure. GCP confirmed as primary cloud ([AD-01](../../decisions.md)).
Engineering on-call policy pending ([AD-07](../../decisions.md), [OQ-38](../../open-questions.md)).
Workflows specified in [08-internal-operations.md](../../workflows/08-internal-operations.md) (6 workflows).

## Quality checks

- System uptime > 99.9% (measured monthly)
- Security incidents responded to within 1 hour
- Access reviews quarterly (who has access to what)
- Backup restoration tested quarterly
- Vendor SLAs tracked and reviewed

## Overlap note

This function overlaps with People & Culture (credentialing, onboarding) and
Product & Engineering (infrastructure, DevOps). The boundaries:
- **Internal Ops** owns the operational environment and processes
- **People & Culture** owns the people and their credentials
- **Product & Engineering** owns the software and its deployment

## Detailed workflows

See [08-internal-operations.md](../../workflows/08-internal-operations.md) for full workflow specifications.
