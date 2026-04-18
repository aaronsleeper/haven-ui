# Architectural Decisions

Decisions made during planning that shape implementation. Each entry captures what was decided, what was considered, and why — so Andrey can review, challenge, or confirm.

**Status legend:**
- ✅ Decided — ready to implement against
- 🟡 Provisional — expert-drafted, accepted as build-against default; human review pending but not blocking
- 👀 Needs Andrey — decided directionally, needs CTO review before implementation
- 🔄 Revisit — decided for now, flagged for review
- ❌ Reversed — superseded by a later decision

---

## Index

| # | Decision | Date | Status |
|---|---|---|---|
| AD-01 | GCP as primary cloud provider | 2026-03-27 | ✅ Decided |
| AD-02 | Anthropic (Claude) via Vertex AI as production LLM | 2026-03-27 | ✅ Decided |
| AD-03 | Twilio as AVA voice provider | 2026-03-27 | ✅ Decided |
| AD-04 | Shared DB with tenant_id + row-level security | 2026-03-27 | 🟡 [Provisional](team/proposals/AD-04-proposal.md) — building against; Andrey review still welcome |
| AD-05 | Hybrid data separation — clinical DB + BigQuery for research | 2026-03-27 | 🟡 [Provisional](team/proposals/AD-05-proposal.md) — building against; Andrey review still welcome |
| AD-06 | Risk scoring weight change process — clinical proposes, eng validates and deploys | 2026-03-27 | ✅ Decided |
| AD-07 | Engineering on-call policy for P1 incidents | 2026-03-27 | 🟡 [Provisional](team/proposals/AD-07-proposal.md) — building against; Andrey review still welcome |
| AD-08 | React 19 + Vite as frontend framework | 2026-04-18 | ✅ Decided — locked after 3-expert consult; see scope note below |
| AD-09 | Turborepo + pnpm workspaces as monorepo tooling | 2026-04-18 | ✅ Decided — locked after 3-expert consult; see scope note below |
| AD-10 | Drizzle ORM for Postgres data access | 2026-04-10 | 🟡 [Provisional](team/proposals/stack-recommendations.md) — Andrey's scope; deferred until CTO review |

---

## AD-01: GCP as primary cloud provider

**Decision:** Google Cloud Platform

**Options considered:**
- **GCP** — already in Firebase ecosystem (Spark), Healthcare API for FHIR, Cloud Run for simpler ops, Vertex AI for LLMs, one billing relationship
- **AWS** — larger healthcare ecosystem, more HIPAA-eligible services (~150+), Bedrock for LLMs, but more config surface area and a second cloud to manage

**Rationale:** Spark already runs on Firebase/GCP. Staying in one cloud means one IAM model, one BAA, shared networking. GCP's developer ergonomics are better suited to a small team. Healthcare API is clean for FHIR R4. No compelling reason to split across clouds.

**Reversibility:** Hard to reverse after implementation begins. Would require re-architecting infrastructure.

---

## AD-02: Anthropic (Claude) via Vertex AI as production LLM

**Decision:** Claude models accessed through Vertex AI

**Options considered:**
- **Anthropic via Vertex AI** — Claude models, covered under Google's BAA, one billing relationship, stays in GCP
- **Anthropic direct** — more control over model versions, but separate vendor relationship and BAA
- **Vertex AI (Gemini)** — tightest GCP integration, but different model family
- **Multi-provider via Vertex** — swap models per task, avoids lock-in, adds complexity

**Rationale:** One BAA (Google's), one billing relationship, Claude models the team is already comfortable with. Vertex keeps the option open to add Gemini later for specific tasks (e.g., cheaper summarization) without a new vendor agreement.

**Reversibility:** Moderate. Vertex provides an abstraction layer — switching LLM providers within Vertex is straightforward. Switching away from Vertex entirely is harder.

---

## AD-03: Twilio as AVA voice provider

**Decision:** Twilio for telephony, with separate STT/TTS providers

**Options considered:**
- **Twilio** — industry standard, HIPAA-eligible with BAA, mature WebSocket support for streaming audio, full pipeline control
- **Bland AI / Vapi / Retell** — all-in-one voice agent platforms, faster to prototype, but younger companies with uncertain BAA availability and less pipeline control
- **Google CCAI** — GCP-native, but Dialogflow-based architecture may conflict with custom agent framework

**Rationale:** Healthcare telephony demands reliability and HIPAA compliance — Twilio is proven on both. Owning the voice pipeline (Twilio → STT → LLM → TTS) gives full control over latency, error handling, and compliance logging. Pair with Deepgram (STT) and Google Cloud TTS or ElevenLabs, all BAA-capable.

**Reversibility:** Moderate. Telephony provider is isolated behind the voice pipeline — swapping Twilio for another SIP provider is contained work.

---

## AD-04: Shared database with tenant_id and row-level security

**Decision:** Single shared database, tenant isolation via tenant_id column + Postgres RLS
**Status:** 🟡 Provisional (2026-04-10). Expert-drafted proposal accepted as build-against default. Andrey review still welcome — override replaces this default. See [full proposal](team/proposals/AD-04-proposal.md).

**Options considered:**
- **Separate DBs per tenant** — strongest isolation, simplest data deletion, but multiplies operational overhead and schema migrations
- **Shared DB with tenant_id** — one schema, one migration path, simpler ops, cross-tenant analytics are straightforward
- **Shared DB, separate schemas** — middle ground (Postgres), logical isolation without separate infrastructure

**Rationale:** At current scale (3 partners, solo eng + CTO), operational simplicity wins. Required safeguards:
1. Tenant-scoped query context at the ORM layer — no raw queries without tenant filtering
2. Postgres RLS as defense-in-depth
3. Automated tests verifying cross-tenant queries return zero rows
4. Per-tenant physical isolation available later if a contract requires it

**Reversibility:** Moderate. Splitting a tenant into its own DB later is migration work but architecturally contained. Starting with separate DBs and merging later would be harder.

---

## AD-05: Hybrid data separation — clinical DB + BigQuery for research

**Decision:** Clinical Postgres DB is the source of truth. Scheduled ETL exports de-identified data to a separate BigQuery dataset for research use.
**Status:** 🟡 Provisional (2026-04-10). Expert-drafted proposal accepted as build-against default. Andrey review still welcome — override replaces this default. See [full proposal](team/proposals/AD-05-proposal.md).

**Options considered:**
- **Hard separation (separate stores)** — clearest compliance boundary, research can never touch live PHI, but requires ETL pipelines and duplicated infrastructure
- **Row-level access controls (same DB)** — simpler architecture, no sync lag, but research queries hit production and the boundary is logical, not physical
- **Hybrid (clinical DB → ETL → BigQuery)** — physical separation for compliance, managed analytics infrastructure, UConn gets BigQuery access only

**Rationale:** Research queries should never hit the clinical production database. BigQuery is GCP-native, managed, and built for the kind of analytical queries research teams run. De-identification happens at the ETL boundary — a clear, auditable point. UConn gets read access to BigQuery, never to clinical data. Minimal operational overhead since BigQuery is fully managed.

**Reversibility:** Easy. The clinical DB is unaffected by this decision — BigQuery is additive. Could swap BigQuery for another warehouse without touching clinical architecture.

---

## AD-06: Risk scoring weight change process

**Decision:** Clinical team proposes weight changes, engineering validates and deploys. No change takes effect without impact review.

**Process:**
1. Clinical team submits a change request (admin panel form)
2. System runs new weights against historical data and shows impact (e.g., "12 patients reclassified from medium to high risk")
3. Clinical team reviews impact and confirms
4. Engineering validates and deploys
5. Change logged in audit trail with before/after weights and approver

**Guardrails:**
- No weight change takes effect without both clinical approval and impact review
- Emergency overrides require two approvers

**Context:** OQ-32 established that the clinical team owns risk score weight configuration. This decision defines the change process and safety mechanisms.

**Reversibility:** Easy. Process is organizational, not architectural. Can adjust the approval flow without code changes.

---

## AD-07: Engineering on-call policy for P1 incidents

**Decision:** Rotation-based on-call between Aaron and Andrey, expanding with team.
**Status:** 🟡 Provisional (2026-04-10). Expert-drafted proposal accepted as build-against default. Andrey review still welcome — override replaces this default. See [full proposal](team/proposals/AD-07-proposal.md).

**Proposed framework:**
- Rotation between Aaron and Andrey, alternating weeks (adjust once team grows)
- P1 = patient-facing system down, suspected data breach, or AVA voice agent unreachable
- Response SLA: acknowledge within 15 min, status update within 1 hour
- Escalation: auto-page the other person if on-call doesn't respond in 15 min
- Tooling (PagerDuty, Opsgenie, etc.) TBD closer to go-live

**Status note:** Andrey's input still welcome. Aaron's role in on-call may shift based on that conversation.

---

## AD-08: React 19 + Vite as frontend framework

**Decision:** React 19 with Vite for all app surfaces (care-coordinator, provider, kitchen, patient).
**Status:** ✅ Decided (2026-04-18). Locked after a three-expert consult (frontend-architecture, design-system-steward, ux-design-lead) on the haven-ui scope change — haven-ui now owns the full frontend; no more HTML-to-Angular translation step. See [full analysis](team/proposals/stack-recommendations.md). Andrey's CTO courtesy review still welcome but not blocking.

**Scope change context (2026-04-18):** haven-ui previously produced vanilla HTML + CSS delivered to Andrey for Angular translation in cena-health-spark. That handoff was the primary friction point — slow and produced far-from-optimal results. haven-ui now builds React apps directly. Pattern library HTML stays as the authoritative *spec* that React components mirror 1:1 (see the related workflow rewrite in `.project-docs/agent-workflow/`). This is the "Path 3 without Angular" outcome of the expert consult.

**Options considered:**
- **React 19 + Vite** — largest AI training corpus, 3 production-grade headless a11y libraries (React Aria, Radix, Base UI), most mature testing story (Vitest + RTL)
- **Vue 3 + Nuxt** — close second on DX, strong conventions, but weaker a11y primitive depth and smaller AI training corpus
- **Angular 19+** — most opinionated (good for consistency), but verbose patterns reduce AI code gen quality, CDK a11y is utilities not full primitives

**Rationale:** Two factors dominate for a 3-person team where AI agents write most code: (1) AI code generation quality — React has the largest training corpus; (2) accessibility primitive depth — React Aria is purpose-built for building custom design systems with WCAG baked in. Ava serves elderly, chronically ill patients; a11y is non-negotiable.

**Tradeoff:** Andrey knows Angular. React hooks are simpler than DI/decorators, and AI bridges learning curves, but worth acknowledging.

**Reversibility:** Moderate. Haven design system as a standalone package mitigates — tokens and a11y contracts are portable even if component implementations aren't.

---

## AD-09: Turborepo + pnpm workspaces as monorepo tooling

**Decision:** Turborepo as build orchestrator, pnpm as package manager. haven-ui becomes a monorepo: `packages/design-system/` (tokens + pattern-library HTML + semantic classes as spec), `packages/ui-react/` (React components mirroring pattern-library 1:1), `apps/{care-coordinator,provider,kitchen,patient}/` (React + Vite).
**Status:** ✅ Decided (2026-04-18). Locked alongside AD-08. See [full analysis](team/proposals/stack-recommendations.md).

**Options considered:**
- **Turborepo + pnpm** — 3 config files, free remote caching (Vercel), AI understands the JSON config, ejects cleanly to bare pnpm
- **Nx** — more powerful (module boundaries, generators), but multi-file config adds surface area; enterprise features are overhead at 14 packages
- **pnpm bare** — zero extra tooling, but you hand-roll caching and task orchestration
- **Moon** — technically interesting (Rust), but niche docs and AI hallucinates its config

**Rationale:** Right-sized for 14 packages. One `turbo.json` defines the pipeline. Dependencies inferred from `package.json`. Remote caching is one command. At this team size, simplicity beats power.

**Reversibility:** Easy. Turborepo is a thin layer — remove `turbo.json` and the pnpm monorepo still works.

---

## AD-10: Drizzle ORM for Postgres data access

**Decision:** Drizzle ORM as primary database toolkit. Kysely documented as fallback.
**Status:** 🟡 Provisional — Andrey's scope; deferred. AD-10 is a backend/data-layer decision that belongs to Andrey as CTO. Frontend work (AD-08/09) does not depend on it; haven-ui will consume whatever API contract Andrey exposes. See [full analysis](team/proposals/stack-recommendations.md).

**Options considered:**
- **Drizzle** — direct connection access for `SET LOCAL app.tenant_id` (RLS), schema-as-code with inferred types, human-readable SQL migrations, no binary engine
- **Prisma** — larger ecosystem, but cannot reliably execute `SET LOCAL` per-connection — dealbreaker for AD-04 RLS
- **Kysely** — equivalent RLS support, but no built-in migrations (pair with another tool)
- **TypeORM** — ActiveRecord coupling, historically buggy migrations

**Rationale:** AD-04 requires `SET LOCAL app.tenant_id` at the start of every transaction for Postgres RLS. Drizzle is one of two contenders (with Kysely) that can do this cleanly. Drizzle wins over Kysely on migrations (drizzle-kit generates reviewable SQL) and ecosystem maturity.

**Reversibility:** Moderate. Repository pattern abstracts Drizzle from consumers — services call `patientRepo.findById()`, not Drizzle directly. Swapping is contained to `packages/db`.
