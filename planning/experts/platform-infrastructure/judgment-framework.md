# Judgment Framework — Platform / Infrastructure

How this expert weighs trade-offs and makes infrastructure decisions. These
frameworks separate experienced infrastructure reasoning from checkbox evaluation.

---

## Core decision principle

> **Operational simplicity is the non-negotiable constraint** (adapted from shared
> principle: a 2-person team cannot operate what it cannot understand and maintain).
> Every infrastructure decision is evaluated against: can two engineers keep this
> running while also building the product? When sophistication and simplicity
> conflict, simplicity wins — unless compliance forces otherwise.

Within the simplicity constraint, the secondary principle is: **managed over
custom**. If GCP offers a managed service that fits, use it. Custom infrastructure
earns its place only when managed options genuinely don't work.

---

## Decision trees

### Build vs. managed service

```
Does GCP offer a managed, BAA-covered service for this need?
+-- No -> Is there a third-party managed service with HIPAA BAA?
|   +-- No -> Build custom. Document why. Flag for Andrey.
|   +-- Yes -> Evaluate: is the integration cost lower than build + maintain?
|       +-- Yes -> Use third-party managed service
|       +-- No -> Build custom. Document comparison.
+-- Yes -> Does the managed service meet the specific requirement?
    +-- Yes -> Use it. Default answer.
    +-- No -> What's the gap?
        +-- Configuration gap (solvable with settings) -> Configure and use
        +-- Feature gap (missing capability) -> Can we architect around it?
            +-- Yes, with acceptable trade-offs -> Work around + document
            +-- No -> Build custom for this component only
```

**Principle:** "Build custom" is always the answer of last resort. Every custom
component is a maintenance liability that two engineers must carry indefinitely.

### Isolation vs. simplicity (multi-tenancy)

```
How many tenants? What's the trust model?
+-- < 10 tenants, all under one BAA -> Shared DB with tenant_id + RLS
|   (Current state: 3 partners. Operational simplicity wins.)
+-- 10-50 tenants, mixed trust levels -> Schema-per-tenant
|   (Logical isolation without infra multiplication.)
+-- > 50 tenants OR contractual isolation requirement -> DB-per-tenant
|   (Only when a contract explicitly requires physical separation.)
+-- Any count + government/military contract -> DB-per-tenant
    (Contractual obligation overrides simplicity preference.)

At every level, ask: does the next isolation level solve a REAL problem
we have, or a hypothetical one? Premature isolation is operational debt.
```

### Reversibility assessment

```
Can we change this decision later?
+-- Data is involved (DB schema, storage format, encryption) -> Assume hard
|   to reverse. Invest more upfront evaluation. Flag in proposal.
+-- API/interface boundary -> Moderate to reverse. Design clean interfaces
|   so the implementation behind them can change.
+-- Compute/runtime choice -> Easy to reverse. Cloud Run today, GKE later
|   if needed. Don't over-invest in evaluation.
+-- Vendor choice with data gravity -> Hard to reverse. Moving data between
    cloud providers or databases is always harder than expected.
```

### Cost vs. compliance

```
Does the cheaper option introduce compliance ambiguity?
+-- No -> Choose cheaper. Budget is a constraint, not a nice-to-have.
+-- Yes -> How much ambiguity?
    +-- "We think it's compliant but aren't sure" -> Spend more for clarity.
    |   Compliance ambiguity with PHI is not a risk worth taking.
    +-- "It's compliant but requires careful configuration" -> Acceptable
    |   if the configuration is documented, testable, and auditable.
    +-- "It might not be compliant" -> Spend more. Full stop.
```

### Scale-now vs. scale-later

```
What's the current load? What's 12-month projected load?
+-- Current: < 1000 patients, < 10 concurrent users -> Do not over-engineer.
|   Cloud Run auto-scaling handles this. Single Cloud SQL instance is fine.
|   Optimize for developer velocity, not throughput.
+-- Projected: 10x current within 12 months -> Design for the 10x case
|   but implement for the 1x case. Ensure the path to 10x is clear.
+-- Projected: 100x current -> Flag for Andrey. Architecture review needed.
    This changes fundamental assumptions (connection pooling, read replicas,
    caching layers, event-driven patterns).
```

---

## Worked example: AD-04 multi-tenancy

**Context:** 3 partner organizations, 2-person eng team, shared Postgres database.
Should we use shared DB + RLS, schema-per-tenant, or DB-per-tenant?

**Applying the isolation vs. simplicity tree:**
- Tenant count: 3. Well under the schema-per-tenant threshold.
- Trust model: all partners under Cena's BAA. No contractual isolation requirement.
- Decision: shared DB with tenant_id + RLS.

**Applying reversibility:**
- Data is involved — this is hard to reverse. But the path FROM shared TO separated
  is well-understood (extract tenant data, migrate to new DB/schema). Going the
  other direction (merge separate DBs) is harder. Starting shared is the safer bet.

**Applying cost vs. compliance:**
- Shared DB is cheaper (one Cloud SQL instance). RLS provides defense-in-depth.
  Is this compliant? Yes — HIPAA requires access controls, not physical separation.
  RLS + application-layer tenant scoping satisfies the requirement.

**Required safeguards (what makes shared-DB safe):**
1. ORM-level tenant scoping — every query gets `WHERE tenant_id = ?` automatically
2. Postgres RLS policies on every table with PHI
3. Application role (not superuser) for all app connections
4. Automated cross-tenant isolation tests in CI
5. Per-tenant data export capability for contract termination

**What breaks if wrong:**
- Query bug bypasses tenant scoping → tenant A sees tenant B's patient data
- This is the single highest-consequence infrastructure failure mode
- Mitigation: RLS is the backstop. Even if ORM fails, Postgres blocks the query.

**Recommendation to Andrey:** Approve shared DB + RLS. Revisit if any partner
contract requires physical isolation or tenant count exceeds 10.
