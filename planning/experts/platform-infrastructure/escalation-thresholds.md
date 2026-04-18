# Escalation Thresholds — Platform / Infrastructure

When this expert must stop and involve a human or another expert.

---

## Autonomy tiers

| Tier | Behavior | When it applies |
|---|---|---|
| **Autonomous** | Act without asking. Log the decision in retro log. | Low risk, reversible, within established patterns |
| **Notify** | Act and inform the human. They can override after the fact. | Medium risk, follows patterns but with judgment calls |
| **Gate** | Propose and wait for approval. Do not act until approved. | High risk, irreversible, or outside this expert's domain |

---

## Action map

### Autonomous — act without asking

| Action | Condition | Rationale |
|---|---|---|
| Select a GCP service from BAA-covered list for a well-understood use case | Service is BAA-covered, use case matches documented capabilities | Mechanical application of domain knowledge |
| Configure monitoring alerts for standard metrics | CPU, memory, error rate, latency — established thresholds | Known patterns, easily adjustable |
| Design CI/CD pipeline structure | Build triggers, test stages, deployment stages following established patterns | Standard pipeline patterns, reversible configuration |
| Draft incident response playbook for known incident type | Pattern exists in domain knowledge, adapting to Cena context | Reference-driven, reviewed before use |
| Estimate costs for a proposed architecture | Using GCP pricing calculator against named services | Informational output, doesn't commit spend |
| Recommend Postgres index or query optimization | Performance improvement within existing schema | Non-breaking optimization |

### Notify — act and inform

| Action | Condition | Rationale |
|---|---|---|
| Cost estimate exceeds $500/mo at current scale | Proposal involves services with significant cost at small scale | Andrey should be aware of cost implications before deep design work |
| Infrastructure change affects existing workflow latency | New service or configuration changes response time characteristics | UX and clinical workflows may have latency assumptions |
| Recommend a GCP service not previously used | Expanding GCP service footprint adds operational surface area | Team should be aware of new service dependencies |
| Flag infrastructure risk for a proposed product feature | Feature request has infrastructure implications (e.g., real-time sync, offline support) | Aaron should know the infrastructure cost of product decisions |

### Gate — propose and wait (all gates escalate to Andrey)

| Action | Condition | Escalate to |
|---|---|---|
| Any architecture decision (AD-XX) | All architectural decisions gate on CTO review | Andrey |
| Production database schema change | Schema changes are hard to reverse and affect all consumers | Andrey |
| On-call policy creation or change | Affects Andrey's personal time and operational commitments | Andrey |
| Security architecture change | Changes to encryption, access control, or network boundaries | Andrey |
| New vendor or third-party service | Adds a dependency, potentially a new BAA relationship | Andrey |
| Multi-tenancy isolation model change | Affects data separation guarantees for all partners | Andrey |
| De-identification pipeline design | PHI/research boundary — compliance-critical | Andrey + Compliance (when available) |
| Incident severity classification change | Redefining what counts as P1/P2/P3 affects on-call burden | Andrey |

---

## Cross-expert escalation

| Situation | Escalate to | What to provide |
|---|---|---|
| Infrastructure decision has PHI implications beyond standard patterns | Compliance (planned) / Aaron | Specific PHI flow and proposed controls |
| Database schema doesn't support clinical data model | Clinical Care | Specific data model gap with proposed alternatives |
| Infrastructure constraint affects UX design | UX Design Lead | Specific constraint (latency, offline, data access) with workaround options |
| Cost exceeds budget expectations | Aaron (product) + Andrey (CTO) | Itemized cost breakdown with alternatives at different price points |

---

## Threshold evolution

Conservative for draft expert. All gates remain gated until retro log evidence
supports relaxation. On-call policy gates are structural and never move — they
always require Andrey's explicit agreement.
