# AD-04 Proposal: Multi-tenancy approach

## Decision

**decision_id:** AD-04
**title:** Shared DB with tenant_id + Postgres RLS for multi-tenant isolation
**date:** 2026-04-09
**status:** Proposal for Andrey

---

## Recommendation

Single Postgres database with a `tenant_id` column on every PHI table, enforced by Postgres Row-Level Security policies. Application connections use a limited-privilege role (not superuser). ORM-level tenant scoping provides the first line of defense; RLS is defense-in-depth.

Specific implementation:

1. **ORM tenant context** — every database session sets `app.current_tenant` via `SET LOCAL`. All queries go through a repository layer that injects tenant scope. No raw SQL without tenant filtering.
2. **Postgres RLS on all PHI tables** — `CREATE POLICY tenant_isolation ON <table> USING (tenant_id = current_setting('app.current_tenant')::uuid)`. Enabled on every table that contains or references PHI (all 26 entities in the data model).
3. **Application DB role** — app connects as `ava_app` with `SELECT, INSERT, UPDATE` on application tables. No `SUPERUSER`, no `BYPASSRLS`. Migrations run under a separate `ava_migrate` role.
4. **Cross-tenant isolation tests in CI** — test suite creates two tenants, populates both with test data, asserts that queries scoped to tenant A return zero rows from tenant B. Runs on every PR.
5. **Per-tenant data export** — admin tooling to export all data for a given tenant_id as structured JSON/CSV, for contract termination or data portability requests.

---

## Alternatives considered

### Option A: Database-per-tenant

**Description:** Each partner gets a dedicated Postgres instance (or Cloud SQL instance). Complete physical isolation.

**Pros:**
- Strongest isolation guarantee — no RLS bugs can leak data
- Per-tenant backup/restore without affecting others
- Simple data deletion for contract termination (drop the database)
- Satisfies any partner that demands physical separation

**Cons:**
- Schema migrations must run against N databases — with a 2-person team, this becomes the dominant operational burden by tenant 4-5
- Cross-tenant analytics (Cena-level reporting, HEDIS benchmarking) require a federation layer or ETL from N sources
- Cost scales linearly: 3 Cloud SQL instances at ~$70/mo each = $210/mo baseline before you add HA
- Connection management complexity — app must route to the correct DB per request
- No shared reference data (recipe catalog, measure definitions) without duplication or a shared DB anyway

### Option B: Shared DB, separate schemas (schema-per-tenant)

**Description:** One Postgres instance, one schema per tenant. Logical isolation without separate infrastructure.

**Pros:**
- Single instance to manage — one backup, one connection pool
- Schema-level isolation is stronger than row-level (a bad query can't accidentally cross schemas without explicit `SET search_path`)
- Per-tenant schema export is cleaner than row-level filtering
- Migrations can be scripted to iterate schemas

**Cons:**
- Schema migration tooling must handle N schemas — most ORMs (Prisma, TypeORM, Drizzle) don't natively support this pattern well
- Connection pool management is more complex (one pool per schema, or dynamic `search_path` switching)
- At 3-10 tenants, the operational overhead is manageable; the tooling cost is front-loaded and non-trivial for 2 engineers
- Cross-tenant queries still require explicit cross-schema joins

### Option C: Shared DB with tenant_id + RLS (recommended)

**Description:** Single schema, single database, tenant_id column, RLS enforcement.

**Pros:**
- One schema, one migration path, one connection pool
- Standard ORM patterns work out of the box
- Cross-tenant analytics are trivial (admin role bypasses RLS for reporting)
- Operational overhead is minimal — one Cloud SQL instance, one backup strategy
- Well-documented pattern with Postgres (Citus, Supabase, and most multi-tenant SaaS use this)

**Cons:**
- RLS misconfiguration = cross-tenant data leak. This is the risk that must be mitigated with automated testing
- A superuser connection or `BYPASSRLS` role accidentally used in production would bypass all isolation
- Some partners may contractually require physical separation (mitigated: offer schema or DB split as an upsell)
- Bulk data export for one tenant requires filtering, not a clean database dump

---

## Rationale

Three factors drive this recommendation:

1. **Team size vs. operational load.** A 2-person engineering team cannot sustain N independent database instances with independent migration pipelines. The marginal cost of each new tenant must be near-zero operationally. Shared DB achieves this; DB-per-tenant does not.

2. **Cena's legal position.** Cena is the covered entity under the BAA. Partners are not independent tenants in the traditional SaaS sense — they're partners under Cena's umbrella. HIPAA requires access controls, not physical separation. RLS + application-level scoping satisfies this requirement.

3. **The nightmare scenario is testable.** Cross-tenant data contamination is the worst outcome. With shared DB + RLS, this risk is addressed through automated CI tests that prove isolation on every code change. With DB-per-tenant, the equivalent risk (misconfigured connection routing) is harder to test exhaustively.

### Migration triggers — when to move to schema-per-tenant or DB-per-tenant

Revisit this decision if any of the following occur:

- **A partner contract explicitly requires physical data separation** — migrate that single partner to a dedicated schema or DB. Do not migrate all tenants preemptively.
- **Tenant count exceeds 15-20 and query performance degrades** — RLS adds overhead per query. At high tenant counts with large tables, evaluate whether partitioning by tenant_id (Postgres native partitioning) or schema separation improves performance.
- **A security audit identifies RLS as insufficient** — if a SOC 2 or HITRUST auditor requires physical separation, comply for the scope they require.
- **Noisy neighbor problems emerge** — one tenant's query load impacts others. Address first with connection pooling limits and query governor, then with separation if needed.

The migration path: extract one tenant at a time into a dedicated schema. The application routing layer (tenant context → schema) is the same pattern regardless. Design the tenant context middleware now to support this future without code changes.

---

## Reversibility assessment

**Rating:** Moderate

**What reversal requires:** Migrating from shared DB to schema-per-tenant or DB-per-tenant involves: (1) creating the target schema/DB, (2) migrating data with `WHERE tenant_id = X`, (3) updating the application routing layer to direct that tenant's requests to the new location, (4) verifying data integrity post-migration, (5) removing the migrated rows from the shared DB. Estimated effort: 1-2 engineering weeks per tenant, assuming the tenant context middleware is designed for swappable backends.

Going the other direction (separate → shared) is harder, which is why starting shared is the safer default.

---

## HIPAA implications

- **Access control (§164.312(a)(1)):** RLS enforces minimum necessary access at the database layer. Application role cannot bypass RLS. Audit events log tenant context for every query.
- **Audit controls (§164.312(b)):** `app.current_tenant` is set per session and logged. Any query executed without tenant context fails (RLS denies by default).
- **Integrity (§164.312(c)(1)):** Soft deletes only — no `DELETE` permission on the application role. Immutable audit trail in AuditEvent table.
- **No physical separation requirement:** HIPAA does not mandate physical database separation between tenants under the same covered entity's BAA. The requirement is "reasonable and appropriate" access controls, which RLS satisfies.

---

## Cost estimate

| Item | Monthly cost |
|---|---|
| Cloud SQL (Postgres), db-custom-2-8192, HA | ~$140 |
| Cloud SQL storage (100GB SSD) | ~$17 |
| Automated backups (7-day retention) | ~$10 |
| **Total** | **~$170/mo** |

Compare to DB-per-tenant at 3 tenants: ~$510/mo (3x instances). At 10 tenants: ~$1,700/mo.

---

## What breaks if wrong

**Worst case:** A bug in the ORM layer or a raw query bypasses tenant scoping, and Patient A (UConn) sees data belonging to Patient B (Cedars). This is a reportable breach under HIPAA, triggers notification obligations, and damages partner trust.

**Mitigations that make this unlikely:**
- RLS is enforced at the database layer — even if the ORM fails, Postgres blocks the query
- CI tests verify isolation on every PR
- Application role cannot disable RLS
- No `SUPERUSER` connections in production
- Code review checklist includes "does this query use the tenant-scoped repository?"

**Second worst case:** A partner contract requires physical separation that RLS cannot satisfy. Mitigation: the migration path to schema-per-tenant is designed in from day one. Estimated migration time: 1-2 weeks for a single tenant.

---

## Dependencies

- AD-01 (GCP) — Cloud SQL Postgres on GCP
- Data model (`architecture/data-model.md`) — `tenant_id` on all 26 entities
- ORM selection (not yet decided) — must support session-level variable setting for RLS context
- CI pipeline (not yet decided) — must support cross-tenant isolation test suite

---

## Ask

Andrey: **approve, modify, or reject.**

Specific questions for your review:

1. Are you comfortable with RLS as the primary isolation mechanism, given the automated testing mitigations?
2. Do you have a preference on ORM (Prisma, Drizzle, TypeORM) that affects how we implement tenant-scoped sessions?
3. Should we design the tenant context middleware to support schema-per-tenant from day one, or build that migration path only when triggered?
