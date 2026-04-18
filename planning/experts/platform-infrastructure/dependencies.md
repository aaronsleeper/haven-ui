# Dependencies — Platform / Infrastructure

Who this expert relies on, and who relies on this expert.

---

## Depends on

| Source | What flows in | Impact if source changes | Fallback mode | Fallback detail |
|---|---|---|---|---|
| **Compliance** (planned) | HIPAA requirements, PHI handling rules, audit requirements | Infrastructure may not meet compliance requirements | `checklist` | HIPAA on GCP checklist (BAA services list, encryption requirements, access control minimums) |
| **Clinical Care** | Data model requirements: what clinical data exists, relationships, access patterns | Database schema and pipeline design may not fit clinical data | `defer` | Design against FHIR R4 standard model; validate when Clinical Care provides specifics |
| **Product strategy** (human — Aaron) | What's being built, priority order, scale expectations | Determines which infrastructure to design and when | N/A | Human decision — no automation fallback |
| **CTO decisions** (human — Andrey) | Architecture decision approvals, technical direction, on-call agreement | All architectural decisions gate on CTO review | N/A | Expert proposes; cannot proceed without approval |
| **GCP service documentation** | Service capabilities, pricing, HIPAA eligibility, deprecation notices | Infrastructure proposals may reference deprecated or ineligible services | `checklist` | BAA service list as minimum viable reference |

---

## Depended on by

| Consumer | What flows out | Impact if this expert changes |
|---|---|---|
| **All implementation-phase experts** | Infrastructure architecture decisions (DB, compute, networking) | Implementation builds against these decisions — changes require re-architecture |
| **UX Design Lead** | Infrastructure constraints (latency budgets, offline capability, data access patterns) | UX designs against infrastructure assumptions — constraint changes may invalidate UI decisions |
| **Clinical Care** | Data model validation, data pipeline specs | Clinical data storage and research data separation depend on infrastructure design |
| **Data & Analytics** (planned) | BigQuery pipeline specs, data freshness guarantees, access controls | Research data access depends on pipeline architecture |
| **Operations / Compliance** (planned) | Security posture, audit log architecture, incident response procedures | Compliance validations depend on infrastructure meeting security requirements |
| **decisions.md** | Architecture decision proposals for the permanent record | Decision log depends on well-structured proposals |

---

## Interface contracts

| Interface | Between | What to verify |
|---|---|---|
| Architecture decision proposal | Platform/Infra -> Andrey (CTO) | All fields populated per output contract, self-contained for review |
| Infrastructure constraints | Platform/Infra -> UX Design Lead | Latency budgets, data access patterns, offline capability documented |
| Data pipeline spec | Platform/Infra -> Data & Analytics | ETL schedule, de-identification method, BigQuery schema, access controls |
| Database architecture | Platform/Infra -> Clinical Care | Schema supports clinical data model, RLS policies match access patterns |
| Security posture | Platform/Infra -> Compliance | Encryption, access controls, audit logging meet HIPAA requirements |
