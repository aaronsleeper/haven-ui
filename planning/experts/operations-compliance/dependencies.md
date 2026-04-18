# Dependencies -- Operations / Compliance

Who this expert relies on, and who relies on this expert. This graph is walked
during `/expert-update` to detect cascading staleness.

---

## Depends on

| Source | What flows in | Impact if source changes | Fallback mode | Fallback detail |
|---|---|---|---|---|
| **Clinical Care** | Service types, documentation requirements, visit cadence, care plan structure | Billing compliance checks may reference wrong service types or visit frequencies | `checklist` | Use published MNT billing codes and Medicare-documented service types |
| **Platform / Infrastructure** (planned) | Data architecture decisions (AD-05), HEDIS field availability, EHR integration capabilities | HEDIS data model recommendations may conflict with actual architecture | `checklist` | Recommend field-level requirements; engineering validates feasibility |
| **Product strategy** (human -- Aaron) | Feature priorities, partner pipeline, market direction | Pricing model and contract framework recommendations may misalign with business strategy | N/A | Human decision -- no automation fallback |
| **Vanessa** (human -- CEO) | Institutional knowledge: partner relationships, payer contracts, legal counsel status, operational constraints | Expert operates on assumptions instead of validated institutional knowledge | N/A | Assumptions index tracks what needs validation |
| **Legal counsel** (external) | Legal opinions on AKS/Stark, BAA adequacy, state regulatory interpretation | Expert flags legal questions but cannot resolve them without counsel | N/A | Flag and hold -- no compliance decision without counsel on legal questions |

---

## Depended on by

| Consumer | What flows out | Impact if this expert changes |
|---|---|---|
| **Compliance** (planned) | Regulatory context, HIPAA interpretations, BAA assessments | Compliance expert builds enforcement and audit readiness on this expert's regulatory research |
| **Clinical Care** | Visit caps, billing constraints, payer-specific requirements | Clinical Care must account for Medicare MNT visit caps in care plan cadence; billing code requirements shape documentation |
| **Patient Ops** (planned) | Enrollment compliance requirements, consent management rules | Enrollment workflows must comply with payer eligibility and consent requirements |
| **Revenue Cycle workflows** | Claims generation rules, timely filing windows, denial management policies | Revenue cycle automation depends on this expert's billing compliance checks |
| **Platform / Infrastructure** (planned) | HEDIS data model requirements, PHI handling rules, audit logging requirements | Data architecture must accommodate compliance requirements |
| **BD workflows** | Partner contract frameworks, pricing model recommendations | Proposal development and contract negotiation use this expert's frameworks |

---

## Interface contracts

| Interface | Between | What to verify |
|---|---|---|
| Visit cap enforcement | Ops/Compliance -> Clinical Care | Medicare MNT cap (3+2/year) correctly reflected in care plan visit scheduling |
| Billing code mapping | Ops/Compliance -> Revenue Cycle | CPT codes and payer requirements match claims generation logic |
| HEDIS field requirements | Ops/Compliance -> Platform/Infrastructure | Required HEDIS fields are in the data model schema |
| BAA status per partner | Ops/Compliance -> Patient Ops | BAA execution status is checked before PHI flows to any partner |
| Contract framework -> proposals | Ops/Compliance -> BD workflows | Pricing model and reconciliation terms are accurate in partner proposals |
