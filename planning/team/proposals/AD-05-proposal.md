# AD-05 Proposal: Clinical vs. research data separation

## Decision

**decision_id:** AD-05
**title:** Clinical Postgres DB → scheduled ETL → de-identified BigQuery dataset for research
**date:** 2026-04-09
**status:** Proposal for Andrey

---

## Recommendation

Clinical Postgres database is the sole source of truth for PHI. A scheduled ETL pipeline (Cloud Dataflow or Cloud Run job) extracts clinical data nightly, applies HIPAA Safe Harbor de-identification, and loads the result into a dedicated BigQuery dataset. UConn and other research partners get read-only access to BigQuery. They never touch the clinical database.

Specific implementation:

1. **ETL pipeline** — a Cloud Run job triggered by Cloud Scheduler at 02:00 UTC daily. Reads from a read replica of the clinical Postgres DB (not the primary). Writes to `project-ava-research.deidentified` BigQuery dataset.
2. **De-identification method: HIPAA Safe Harbor (§164.514(b)(2))** — remove all 18 identifiers. Dates truncated to year. ZIP codes truncated to first 3 digits (or removed if population < 20,000). Ages over 89 grouped as 90+. Patient IDs replaced with research-specific pseudonyms (one-way hash with a per-dataset salt stored in Secret Manager, not derivable back to clinical IDs).
3. **BigQuery access** — UConn researchers get a GCP service account with `roles/bigquery.dataViewer` on the `deidentified` dataset only. No access to any other GCP resource. Access logged via Cloud Audit Logs.
4. **Schema versioning** — BigQuery dataset schema is versioned. ETL pipeline writes a `_metadata` table with pipeline run timestamp, source row counts, schema version, and de-identification method applied. Researchers can verify data freshness and completeness.
5. **Data request process** — when a researcher needs a field that doesn't exist in BigQuery, they submit a request. Cena evaluates whether the field can be de-identified under Safe Harbor. If yes, it's added to the next ETL schema version. If no (e.g., free-text clinical notes that may contain identifiers), it requires Expert Determination or IRB amendment.

---

## Alternatives considered

### Option A: Row-level access controls on the clinical DB

**Description:** Researchers query the clinical Postgres database directly, with row-level policies restricting which columns and rows they can see.

**Pros:**
- No ETL pipeline to build or maintain
- Real-time data access — no sync lag
- Single database to manage

**Cons:**
- Research queries hit production. A poorly optimized analytical query (common in research) can degrade clinical system performance
- The de-identification boundary is logical (column-level permissions), not physical. A permission misconfiguration exposes PHI
- Postgres is not optimized for the wide, aggregation-heavy queries researchers run. BigQuery is purpose-built for this
- Audit trail for research access is mixed with clinical audit trail — harder to demonstrate compliance for IRB
- If UConn's IRB requires proof of physical data separation, this approach fails

### Option B: Real-time streaming to BigQuery (CDC)

**Description:** Change Data Capture (Debezium or Datastream) replicates changes from Postgres to BigQuery in near-real-time, with a de-identification transformation layer in the stream.

**Pros:**
- Data freshness measured in minutes, not hours
- Researchers see today's data, not yesterday's
- CDC is a well-understood pattern

**Cons:**
- Significantly more infrastructure: Debezium/Kafka or Datastream + transformation layer + BigQuery
- De-identification in a streaming context is harder to audit — each record transforms independently, vs. a batch job with a clear before/after snapshot
- Operational complexity is high for a 2-person team — CDC pipelines require monitoring, dead letter queues, and schema evolution handling
- Research use cases at UConn are analytical (cohort studies, outcome trends), not operational. Near-real-time adds complexity without matching the actual need

### Option C: Nightly batch ETL to BigQuery (recommended)

**Description:** Scheduled nightly job reads from a Postgres read replica, de-identifies, loads to BigQuery.

**Pros:**
- Clear, auditable de-identification boundary — entire batch processed uniformly
- Research queries never touch production infrastructure
- BigQuery is fully managed — no indexing, no vacuuming, no connection pool tuning
- Cost-effective: BigQuery charges per query (on-demand) or flat rate; at pre-launch volumes, cost is negligible
- Operationally simple: one Cloud Run job, one Cloud Scheduler trigger, one monitoring alert
- Easy to explain to an IRB: "clinical data lives here, de-identified copy lives there, here's the transformation log"

**Cons:**
- 24-hour data latency. Researchers see yesterday's data, not today's
- ETL pipeline is a new component to build and maintain (estimated 2-3 days initial build)
- Schema changes in the clinical DB require corresponding ETL updates

---

## Rationale

Three factors:

1. **Research queries must not touch production.** This is non-negotiable. A single runaway `SELECT *` with a multi-table join from a researcher's notebook can lock tables or exhaust connections on the clinical DB. Physical separation eliminates this class of risk entirely.

2. **De-identification must happen at a clear boundary.** For IRB compliance and HIPAA audit, the de-identification step needs to be a discrete, logged, verifiable process — not a set of column permissions that could be misconfigured. A batch ETL job produces a complete transformation log: "these 18 identifiers were removed, these dates were truncated, these pseudonyms were assigned." An auditor can inspect the pipeline code, the transformation log, and the output dataset independently.

3. **Nightly is sufficient for research.** UConn's research use cases are retrospective cohort analysis and outcome tracking. These are not time-sensitive — a 24-hour lag is immaterial. If a future partner needs fresher data, we can reduce the batch interval to every 4 hours without architectural changes. CDC is only warranted if a partner needs sub-minute freshness, which no current or foreseeable partner does.

### ETL frequency decision

Start at **nightly (daily)**. The pipeline is a Cloud Run job — changing the Cloud Scheduler cron from `0 2 * * *` to `0 */4 * * *` (every 4 hours) is a one-line config change. No architectural change needed. Move to more frequent batches only when a partner demonstrates the need.

### Safe Harbor vs. Expert Determination

**Recommend Safe Harbor** for launch. It's prescriptive (remove these 18 things), requires no external statistician, and is sufficient for UConn's initial research protocols. Expert Determination is appropriate if a future study requires richer data that can't survive Safe Harbor stripping (e.g., precise dates for time-series analysis). At that point, engage a qualified statistical expert per §164.514(b)(1), and scope the determination to that specific study.

### When a researcher needs data that doesn't exist in BigQuery

This will happen. The process:

1. Researcher submits a field request via a structured form (field name, clinical source, research justification, study protocol reference)
2. Cena evaluates: Can this field survive Safe Harbor de-identification?
   - **Yes** (e.g., a new biomarker type, a categorical field) → add to ETL, available in next nightly run
   - **Maybe** (e.g., date field that needs truncation, geographic data) → add with appropriate transformation
   - **No** (e.g., free-text notes, exact addresses) → requires Expert Determination or is not exportable. Researcher works with IRB to amend protocol if needed.
3. Schema version incremented, `_metadata` table updated

---

## Reversibility assessment

**Rating:** Easy

**What reversal requires:** The clinical database is completely unaffected by this decision. BigQuery is additive infrastructure. To reverse: stop the ETL job, delete the BigQuery dataset. To swap BigQuery for another warehouse (Snowflake, Redshift): update the ETL sink — the de-identification logic and Postgres read replica are unchanged. Estimated effort: 1-2 days.

---

## HIPAA implications

- **Minimum necessary (§164.502(b)):** Researchers receive only de-identified data. They cannot access PHI even if they wanted to — they have no credentials for the clinical DB.
- **De-identification standard (§164.514(b)):** Safe Harbor method removes all 18 identifiers. The ETL pipeline logs which identifiers were removed and which transformations were applied, per run.
- **Research use (§164.512(i)):** De-identified data is not PHI under HIPAA. UConn's use of the BigQuery dataset does not require individual patient authorization, though it still requires IRB approval for the research protocol itself.
- **Audit trail:** Cloud Audit Logs capture every BigQuery query by every service account. Cena can demonstrate exactly which researchers queried which tables and when.
- **BAA scope:** BigQuery is a GCP service covered under Google's BAA (AD-01). No additional BAA needed for the research dataset specifically, since it contains de-identified data (not PHI). However, the ETL pipeline processes PHI in transit — the read replica and Cloud Run job are within BAA scope.

---

## Cost estimate

| Item | Monthly cost |
|---|---|
| Cloud SQL read replica (db-custom-1-4096) | ~$50 |
| Cloud Run ETL job (nightly, ~5 min runtime) | ~$1 |
| Cloud Scheduler | ~$0 (free tier) |
| BigQuery storage (10GB de-identified data) | ~$0.20 |
| BigQuery queries (on-demand, ~100 queries/mo) | ~$5 |
| Secret Manager (pseudonym salt) | ~$0.06 |
| **Total** | **~$56/mo** |

This scales well. At 10x data volume (1,000 patients), BigQuery storage rises to ~$2/mo and query costs stay under $50/mo. The read replica is the fixed cost floor.

---

## What breaks if wrong

**Worst case:** The de-identification pipeline has a bug and exports PHI to the research dataset. A UConn researcher downloads a dataset containing patient names or exact dates of birth. This is a HIPAA breach affecting the research participants.

**Mitigations:**
- ETL pipeline includes a post-load validation step: query the BigQuery output and assert that no column matches any of the 18 Safe Harbor identifier patterns (regex for SSN formats, date patterns with day precision, full ZIP codes, etc.)
- Pipeline fails loudly if validation fails — no data is made available until the validation passes
- Quarterly manual audit: sample 100 rows from BigQuery, verify de-identification completeness
- BigQuery dataset has a 24-hour access delay from load (configured via scheduled query that copies from staging to production dataset), giving time for automated validation to complete

**Second worst case:** ETL pipeline breaks silently and researchers work with stale data for weeks. Mitigation: monitoring alert if the `_metadata` table hasn't been updated in 36 hours. Dashboard showing last successful pipeline run.

---

## Dependencies

- AD-01 (GCP) — Cloud SQL, Cloud Run, BigQuery, Cloud Scheduler all GCP services
- AD-04 (multi-tenancy) — ETL must respect tenant boundaries; research dataset may include data from consented patients across tenants, or be scoped per-partner depending on IRB protocol
- Clinical DB schema (`architecture/data-model.md`) — ETL field mapping depends on entity definitions
- UConn IRB protocol — de-identification method must align with what the IRB approved. Safe Harbor is the most common default; confirm with UConn before implementation
- Consent model — only patients with `research_enrolled: true` and active research consent should be included in the ETL export

---

## Ask

Andrey: **approve, modify, or reject.**

Specific questions for your review:

1. Are you comfortable with nightly batch frequency, or do you see a near-term need for more frequent updates?
2. Do you prefer Cloud Run for the ETL job, or would you rather use Cloud Dataflow (Apache Beam) for the transformation step? Cloud Run is simpler; Dataflow is more robust for large-scale transforms but overkill at current volumes.
3. Should the pseudonym salt rotation be time-based (annual) or event-based (per study)? Annual is simpler; per-study means a researcher can't correlate patients across studies, which some IRBs prefer.
