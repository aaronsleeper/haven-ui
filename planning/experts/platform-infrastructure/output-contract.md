# Output Contract — Platform / Infrastructure

What this expert produces, in what format, and for whom. Downstream consumers
should know exactly what they'll receive.

---

## Primary outputs

### 1. Architecture decision proposal

**Produced when:** A new infrastructure decision needs CTO review, or a pending
decision (AD-04, AD-05, AD-07) needs a formal proposal drafted.

| Field | Format | Description |
|---|---|---|
| decision_id | string | AD-XX format, sequential |
| title | string | Short, descriptive title |
| recommendation | string | The proposed decision, stated clearly |
| alternatives_considered | list | Each alternative with: description, pros (list), cons (list) |
| rationale | string | Why this recommendation over alternatives — tied to judgment framework |
| reversibility_assessment | enum + detail | `easy` / `moderate` / `hard` with explanation of what reversal requires |
| hipaa_implications | string | How this decision affects HIPAA compliance posture |
| cost_estimate | string | Order-of-magnitude monthly cost range (e.g., "$50-150/mo at current scale") |
| what_breaks_if_wrong | string | Concrete worst-case scenario if this decision is the wrong call |
| dependencies | list | Other decisions or systems this depends on |
| ask | enum | `approve` / `modify` / `reject` — what the CTO is being asked to do |

**Consumed by:** Andrey (CTO) for review and decision, decisions.md for record

---

### 2. Infrastructure spec

**Produced when:** An approved architecture decision needs detailed technical
design before implementation begins.

| Field | Format | Description |
|---|---|---|
| component | string | What's being specified (e.g., "Research data pipeline") |
| scope | string | What this spec covers and explicitly doesn't cover |
| architecture_diagram | mermaid | System architecture showing services, data flow, network boundaries |
| data_flow | list | Step-by-step data movement with transformation points and trust boundaries |
| security_considerations | list | Authentication, encryption, access control, PHI exposure points |
| cost_estimate_range | string | Monthly cost at current scale and projected 12-month scale |
| dependencies | list | GCP services, other components, external integrations required |
| deployment_notes | string | How to deploy, what environment config is needed |
| monitoring_requirements | list | What to monitor, alert thresholds, dashboards needed |

**Consumed by:** Engineering (Andrey + Aaron) for implementation, UX Design Lead
(infrastructure constraints), Data & Analytics (pipeline specs)

---

### 3. Incident response playbook

**Produced when:** A new incident type is identified or on-call policy is established.

| Field | Format | Description |
|---|---|---|
| incident_type | string | Category (e.g., "Database connection exhaustion") |
| severity | enum | P1 / P2 / P3 |
| detection_method | string | How this incident is detected (alert, user report, monitoring) |
| response_steps | ordered list | Step-by-step response with commands, checks, and decision points |
| escalation_path | string | Who to contact at each escalation stage |
| communication_template | string | Status update template for internal and external stakeholders |
| post-incident | string | Required follow-up: root cause analysis, preventive measures |

**Consumed by:** On-call engineer (Aaron/Andrey), operations team

---

## Output guarantees

- Every proposal includes reversibility assessment — never omitted
- Every proposal documents what breaks if wrong — not just what's good about the choice
- HIPAA implications surfaced in every infrastructure proposal — never deferred
- Cost estimates are order-of-magnitude, never false precision (no "$147.32/mo")
- Proposals are self-contained — reviewer can decide without reading source docs
- All Mermaid diagrams render correctly and show trust/network boundaries
