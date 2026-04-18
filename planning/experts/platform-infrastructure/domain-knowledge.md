# Domain Knowledge — Platform / Infrastructure

What this expert must know to make infrastructure architecture decisions for a
HIPAA-compliant healthcare platform on GCP with a 2-person engineering team.

---

## Cloud infrastructure (GCP)

| Knowledge area | What specifically | Source | Shelf life |
|---|---|---|---|
| GCP HIPAA-eligible services | Which GCP services are covered under Google's BAA: Cloud Run, Cloud SQL, Cloud Storage, BigQuery, Pub/Sub, Cloud KMS, VPC, IAM, Healthcare API, Cloud Build, Artifact Registry, Cloud Monitoring, Cloud Logging, Secret Manager | Google HIPAA compliance page, BAA service list | ~6 months (services added quarterly) |
| Cloud Run architecture | Serverless containers, auto-scaling, concurrency controls, VPC connectors for private networking, min-instances for cold-start avoidance, request timeout limits (60 min max) | GCP Cloud Run docs | ~1 year |
| Cloud SQL for Postgres | Managed Postgres 15+, automatic backups, point-in-time recovery, private IP via VPC peering, read replicas, failover, connection pooling via Cloud SQL Auth Proxy | GCP Cloud SQL docs | ~1 year |
| VPC and networking | Private service networking, VPC Service Controls for data exfiltration prevention, Cloud NAT for egress, firewall rules, Private Google Access for GCP service calls without public IP | GCP networking docs | ~1 year |
| IAM and access control | Service accounts per Cloud Run service (principle of least privilege), Workload Identity Federation for CI/CD, no long-lived service account keys, IAM Conditions for tenant-scoped access | GCP IAM docs | ~1 year |
| Healthcare API | FHIR R4 store for structured clinical data exchange, DICOM/HL7v2 support if needed later, de-identification API for research data | GCP Healthcare API docs | ~1 year |
| Cloud KMS | Customer-managed encryption keys (CMEK) for Cloud SQL and Cloud Storage, key rotation policies, envelope encryption | GCP Cloud KMS docs | ~2 years |

## Database architecture

| Knowledge area | What specifically | Source | Shelf life |
|---|---|---|---|
| Multi-tenancy patterns | Three models: (1) DB-per-tenant — strongest isolation, highest ops cost; (2) schema-per-tenant — moderate isolation, migration complexity; (3) shared with tenant_id — lowest ops cost, requires RLS discipline. Trade-offs shift with team size and tenant count. | Postgres docs, multi-tenancy literature | Stable patterns |
| Postgres RLS | Row-level security policies tied to session variables (`SET app.current_tenant`). Policies apply to SELECT, INSERT, UPDATE, DELETE. Must be enabled per table. Bypassed by superuser and table owners — use separate application role. | Postgres RLS docs | Stable (Postgres feature) |
| Tenant isolation testing | Automated tests that: (1) set tenant context to tenant A, query, verify zero rows from tenant B; (2) attempt INSERT without tenant context, verify rejection; (3) test RLS bypass paths (superuser, table owner) are blocked at application layer | Testing best practices | Stable pattern |
| `[ASSUMPTION]` Cloud SQL Postgres as primary database | Postgres on Cloud SQL for all transactional data: patient records, care plans, clinical data, operational data. Chosen over Firestore for relational integrity and RLS support. | AD-01 (GCP decided), relational data model needs. Validates by: Andrey (CTO) | Until implementation begins |
| Connection pooling | Cloud SQL Auth Proxy for IAM-authenticated connections. PgBouncer for connection pooling at scale. Cloud Run instances share connection pools via proxy sidecar. | Cloud SQL docs, PgBouncer docs | ~1 year |

## Data pipeline architecture

| Knowledge area | What specifically | Source | Shelf life |
|---|---|---|---|
| ETL for research separation | Scheduled Cloud Run job or Dataflow pipeline: extract from Cloud SQL, apply de-identification transforms, load into BigQuery. De-identification is the pipeline boundary — upstream is PHI, downstream is de-identified. | AD-05 design, GCP Dataflow docs | ~1 year |
| De-identification methods | Safe Harbor method (remove 18 HIPAA identifiers) or Expert Determination. For research ETL, Safe Harbor is simpler and auditable. GCP Healthcare API has built-in de-identification for FHIR resources. | HIPAA de-identification guidance (HHS) | Regulatory — stable |
| BigQuery for research | Fully managed analytics warehouse. Separate GCP project for research data (billing isolation, IAM isolation). Dataset-level access controls. UConn gets BigQuery Reader role on specific datasets only. | GCP BigQuery docs, AD-05 | ~1 year |
| Change data capture | Cloud SQL logical replication or Debezium for real-time change capture if batch ETL latency is insufficient. Start with scheduled batch (simplest); add CDC if research team needs near-real-time. | Postgres logical replication docs | Stable pattern |

## Incident response

| Knowledge area | What specifically | Source | Shelf life |
|---|---|---|---|
| On-call patterns for small teams | 2-person rotation: alternating weeks, with explicit secondary escalation. Primary must ack within SLA. If primary doesn't ack, auto-page secondary. Burnout mitigation: max 1 week on-call per 2 weeks, swap mechanism, post-incident comp time. | SRE literature, PagerDuty best practices | Stable principles |
| Severity classification | P1: patient-facing system down, data breach suspected, AVA voice unreachable. P2: degraded functionality, non-critical feature down, elevated error rates. P3: monitoring alert, no user impact, investigation needed. | Industry standards adapted to healthcare | Stable framework |
| `[ASSUMPTION]` 15-min P1 ack SLA | On-call engineer acknowledges P1 within 15 min, provides status update within 1 hour. Achievable with 2-person rotation if both carry alert-capable devices and maintain notification hygiene. | AD-07 proposal, industry norms. Validates by: Andrey (CTO) | Until on-call policy is confirmed |
| Incident communication | Internal: Slack channel per incident, status page updates. External (if patient-affecting): prepared templates per incident type, notification within regulatory timelines for breaches. | HIPAA Breach Notification Rule, incident response best practices | Regulatory timeline is stable |

## CI/CD and deployment

| Knowledge area | What specifically | Source | Shelf life |
|---|---|---|---|
| Cloud Build | GCP-native CI/CD. Build triggers from GitHub, build steps as containers, artifact output to Artifact Registry. Covered under GCP BAA. | GCP Cloud Build docs | ~1 year |
| Deployment strategy | Staging environment mirrors production (same Cloud Run config, separate Cloud SQL instance). All changes deploy to staging first. Production deploy requires passing staging smoke tests. Blue-green or canary deployment via Cloud Run traffic splitting. | Cloud Run traffic management docs | Stable pattern |
| `[ASSUMPTION]` Cloud Run for compute | All application services run on Cloud Run. Chosen over GKE for operational simplicity — a 2-person team should not manage Kubernetes. Cloud Run provides auto-scaling, HTTPS, and container isolation without cluster management. | AD-01 (GCP), team size constraint. Validates by: Andrey (CTO) | Until implementation begins |
| Artifact management | Container images in Artifact Registry (GCP-native, BAA-covered). Image scanning for vulnerabilities. Signed images for production deployment. | GCP Artifact Registry docs | ~1 year |

## Monitoring and observability

| Knowledge area | What specifically | Source | Shelf life |
|---|---|---|---|
| Cloud Monitoring | Metrics, alerting, uptime checks. Custom metrics for application-level signals (care plan creation latency, AVA call success rate). Alert policies with notification channels (PagerDuty integration for on-call). | GCP Cloud Monitoring docs | ~1 year |
| Structured logging | Cloud Logging with structured JSON logs. Correlation IDs across service calls. PHI must never appear in logs — log patient_id (opaque), never names, DOBs, or clinical data. Log retention per HIPAA requirements. | GCP Cloud Logging docs, HIPAA audit requirements | Regulatory stability |
| Error tracking | Cloud Error Reporting or Sentry for application errors. Error grouping, alerting on new error types, stack trace capture. Ensure error payloads don't contain PHI. | GCP Error Reporting docs | ~1 year |

## Reference sources

| Source | Domain | Trust level | When to consult |
|---|---|---|---|
| GCP HIPAA compliance documentation | Which services are BAA-covered, compliance configurations | Authoritative | Any new GCP service selection |
| Google Cloud Architecture Framework | Architecture patterns, security best practices | Expert | Novel architecture decisions |
| Postgres documentation (postgresql.org) | RLS, connection pooling, replication, performance | Authoritative | Database architecture decisions |
| HIPAA on GCP whitepaper | Cloud-specific HIPAA implementation guidance | Authoritative | Compliance-intersecting infrastructure decisions |
| HHS HIPAA guidance (hhs.gov/hipaa) | De-identification, breach notification, security rule | Authoritative | Data pipeline design, incident response |
| GCP pricing calculator | Cost estimation for infrastructure proposals | Informational | Every infrastructure proposal |
| PagerDuty incident response guide | On-call patterns, escalation design, incident lifecycle | Expert | On-call policy design |

---

## Assumptions index

| # | Assumption | Basis | Validates by | Status |
|---|---|---|---|---|
| A1 | Cloud SQL Postgres as primary database | AD-01 (GCP decided), relational data needs | Andrey (CTO) | Unvalidated |
| A2 | Cloud Run for all compute services | AD-01 (GCP), 2-person team constraint | Andrey (CTO) | Unvalidated |
| A3 | 15-min P1 ack SLA achievable with 2-person rotation | AD-07 proposal, industry norms | Andrey (CTO) | Unvalidated |
