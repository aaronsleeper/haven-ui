# Risk Register — Platform / Infrastructure

Known failure modes ranked by likelihood and impact.

---

## Risk matrix

| Risk | Likelihood | Impact | Current mitigation | Residual risk |
|---|---|---|---|---|
| **Cross-tenant data leak** — query bug bypasses tenant_id scoping, tenant A sees tenant B's patient data | Low | Critical | Postgres RLS as defense-in-depth behind ORM-level scoping; automated cross-tenant isolation tests in CI; application role (not superuser) for all app connections | Low — RLS is the backstop, but any RLS misconfiguration on a new table creates a window |
| **2-person on-call burnout** — sustained incident load or off-hours pages degrade quality of life and engineering output | High | High | Alternating weeks, secondary escalation, post-incident comp time, runbook-driven response to reduce cognitive load | High — mitigation reduces but doesn't eliminate; structural risk until team grows |
| **GCP vendor lock-in** — deep GCP integration (Cloud Run, Cloud SQL, BigQuery, Healthcare API) makes migration prohibitively expensive | Medium | Medium | Use standard interfaces where possible (Postgres over Firestore, containers over Cloud Functions, FHIR R4 over proprietary formats). Accept lock-in where GCP provides genuine value (Healthcare API, BigQuery). | Medium — some lock-in is acceptable and intentional; track which components are portable vs. locked |
| **BigQuery ETL lag** — research data is stale, researchers make decisions on outdated data | Medium | Medium | Start with daily batch ETL; document expected freshness. Add CDC pipeline if research team needs near-real-time. ETL monitoring alerts on failed or delayed runs. | Low — daily freshness is acceptable for research; risk is in silent ETL failure |
| **LLM cost scaling surprise** — Claude API costs scale non-linearly with patient volume or agent complexity | Medium | High | Cost monitoring with budget alerts in GCP. Per-request cost tracking. Model tier routing (Opus only where needed, Sonnet/Haiku for routine work). Monthly cost review. | Medium — cost is somewhat unpredictable with LLM workloads; monitoring catches it late |
| **Cloud SQL connection exhaustion** — Cloud Run instances open more connections than Cloud SQL can handle during traffic spikes | Medium | High | Cloud SQL Auth Proxy with connection pooling, max-connections configuration, Cloud Run concurrency limits aligned with connection pool size | Low — well-understood problem with known solution, but misconfiguration creates outages |
| **Encryption key management failure** — CMEK key rotation breaks access to encrypted data, or key is accidentally deleted | Low | Critical | Cloud KMS key rotation is automatic; key destruction has a 24-hour waiting period; key access logged in audit trail | Low — GCP's key management is mature, but human error during configuration is possible |
| **Staging/production drift** — staging environment diverges from production, masking bugs that only appear in production | Medium | Medium | Infrastructure-as-code (Terraform or Pulumi) for both environments; automated drift detection; deploy pipeline enforces same config | Medium — IaC helps but doesn't prevent config divergence in managed services (Cloud SQL flags, etc.) |
| **PHI in logs** — application logs inadvertently contain patient names, DOBs, or clinical data | Medium | High | Structured logging standard that excludes PHI fields; log review during code review; automated PHI detection in log output (regex for SSN, DOB patterns) | Medium — automated detection catches known patterns; novel PHI leaks require manual review |

---

## Highest-stakes decisions

1. **Multi-tenancy isolation model** — Getting this wrong means tenant data leaks.
   The shared-DB approach is operationally simpler but depends entirely on RLS +
   ORM discipline. A single misconfigured table creates a compliance incident.

2. **De-identification pipeline correctness** — If the ETL pipeline fails to
   properly de-identify data, PHI flows to BigQuery where researchers have access.
   This is a HIPAA breach. The pipeline boundary must be tested, audited, and
   monitored independently.

3. **On-call sustainability** — A 2-person on-call rotation is a structural risk.
   If either person is unavailable (vacation, illness, burnout), coverage drops
   to zero. This is acceptable at pre-launch but becomes critical at production.

4. **Encryption configuration** — Encryption at rest (Cloud SQL, Cloud Storage)
   and in transit (TLS everywhere) are HIPAA requirements, not nice-to-haves.
   Misconfiguration is a compliance violation, not just a security weakness.

5. **Log hygiene** — PHI in logs is a data breach. Structured logging standards
   must be established before the first patient record enters the system, not after.
