# Stack Recommendations — Phase 3.1

> Technical stack proposal for the Ava MVP build. Each recommendation is backed
> by research against Ava-specific constraints. Andrey: review and challenge —
> these are proposals, not decisions.
>
> **Created:** 2026-04-10
> **Status:** Proposal — awaiting review
> **Proposed decisions:** AD-08 (frontend), AD-09 (monorepo), AD-10 (ORM)

---

## Summary

| Layer | Recommendation | Key rationale |
|---|---|---|
| Frontend | React 19 + Vite | AI code generation quality, accessibility primitive depth |
| Monorepo | Turborepo + pnpm workspaces | Minimal config, free remote caching, easy to eject |
| ORM | Drizzle ORM | RLS-compatible tenant isolation, schema-as-code, no binary engine |
| Auth | Firebase Auth | Already in stack (cena-health-spark), GCP-native, BAA-eligible |
| Styling | Tailwind CSS 4 | Design token integration, AI generates well, utility-first |
| State (client) | Zustand | Minimal API, TypeScript-native, no boilerplate |
| State (server) | TanStack Query + Firestore hooks | Cache management, listener lifecycle |
| Testing | Vitest + React Testing Library + Playwright + axe-core | Unit, component, e2e, a11y |
| A11y primitives | React Aria (Adobe) | Deepest WCAG compliance, composable, unstyled — builds Haven |

---

## AD-08 (proposed): React 19 + Vite as frontend framework

### Decision

React 19 with Vite (not Next.js — no SSR needed for dashboard apps).

### Options considered

| | React (Vite) | Vue 3 (Nuxt) | Angular 19+ |
|---|---|---|---|
| **AI code gen** | Best — largest corpus, v0 support | Good — smaller corpus | Decent — verbose patterns confuse AI |
| **A11y primitives** | React Aria, Radix, Base UI (3 options) | Ark UI, Reka UI (growing) | CDK a11y utilities (not full primitives) |
| **Testing** | Vitest + RTL (gold standard) | Vitest + VTL (good) | Transitioning to Vitest |
| **Predictability** | Needs discipline (ESLint + Turborepo) | Nuxt conventions help | Most opinionated (DI, modules) |
| **Hiring pool** | 44.7% (SO 2025) | 17.6% | 18.2% |

### Rationale

Two factors dominate for a 3-person team where AI agents write most code:

1. **AI code generation quality.** React has the largest training corpus across Claude, Copilot, and Cursor. Generative UI tools (v0) only support React. When agents are writing the bulk of your UI, framework choice directly affects output quality.

2. **Accessibility primitive depth.** Ava serves elderly, chronically ill patients — WCAG 2.1 AA is non-negotiable. React Aria provides headless, WAI-ARIA-compliant primitives with focus management, keyboard nav, and screen reader support. No other ecosystem has three competing production-grade options. Haven design system builds on top of these.

### Tradeoffs

- React requires more architectural discipline than Angular — 4 apps sharing a component library need explicit conventions enforced via Turborepo package boundaries and ESLint rules
- Andrey knows Angular — learning curve exists, though React's hooks model is simpler than Angular's DI/decorator system
- Vue was a close second on DX; lost on a11y primitive depth and AI generation quality

### Reversibility

Moderate. Frontend framework choices are hard to reverse once components are built. The mitigation: Haven design system is built as a standalone package — component logic is framework-specific but design tokens, patterns, and a11y contracts are portable.

---

## AD-09 (proposed): Turborepo + pnpm workspaces

### Decision

Turborepo as the monorepo orchestrator, pnpm as the package manager.

### Options considered

| | Turborepo | Nx | pnpm bare | Moon |
|---|---|---|---|---|
| **Setup** | ~5 min, 3 config files | More config surface (nx.json, project.json, generators) | Zero extra tooling | Niche docs, Rust-based |
| **Build perf** | Excellent — content-aware hashing, remote cache | Excellent — comparable | None built-in | Excellent but immature |
| **AI-friendliness** | High — small JSON config, huge training corpus | Medium — multi-file config confuses AI | Highest | Low — AI hallucinates config |
| **CI** | Vercel remote cache free tier, trivial GHA setup | Nx Cloud free tier, more config | No cache to configure | Limited GHA examples |
| **Ejectability** | Clean — remove turbo.json, pnpm still works | Hard to extract | N/A (is the base) | Hard to extract |

### Rationale

Turborepo is the right-sized tool. One `turbo.json` defines the entire build pipeline. Package dependencies are inferred from `package.json`, not manually declared. Remote caching is free via Vercel. At 14 packages, Nx's enterprise features (module boundaries, code generation, affected graph visualization) are overhead without payoff.

### Proposed structure

```
ava/
├── turbo.json
├── pnpm-workspace.yaml
├── package.json
├── packages/
│   ├── db/             # Drizzle schema, migrations, repositories
│   ├── shared/         # Types, constants, utilities
│   └── ui/             # Haven design system (React Aria + Tailwind)
├── apps/
│   ├── admin/          # Admin app (React + Vite)
│   ├── provider/       # Provider app
│   ├── kitchen/        # Kitchen app
│   └── patient/        # Patient app
└── services/
    ├── orchestrators/  # 4 Cloud Run orchestrator services
    ├── specialists/    # ~10 specialist agent services
    └── functions/      # Cloud Functions (deterministic extractions)
```

### Reversibility

Easy. Turborepo is a thin layer on pnpm workspaces. Remove `turbo.json` and the monorepo still works.

---

## AD-10 (proposed): Drizzle ORM

### Decision

Drizzle ORM as the primary database toolkit. Kysely as a documented fallback if Drizzle's relational query API proves insufficient for complex joins.

### Options considered

| | Drizzle | Prisma | Kysely | TypeORM |
|---|---|---|---|---|
| **RLS compat** | **Strong** — `SET LOCAL` in transactions | **Weak** — can't run SET per-connection reliably | Strong | Moderate |
| **Migrations** | Schema-as-code, SQL diffs via drizzle-kit | Auto-generated, opaque | No built-in | Built-in but historically buggy |
| **Type safety** | Inferred from schema (zero codegen) | Generated via `prisma generate` | Inferred from interfaces | Runtime/decorator-based |
| **Repo pattern** | Clean — wrap table objects | Awkward — PrismaClient god object | Clean | Coupled to ActiveRecord |
| **Raw SQL** | `sql` template tag, full Postgres access | `$queryRaw` bypasses types | `sql` template tag | Loses types |
| **Binary engine** | None | Rust query engine (cold start, container size) | None | None |

### Rationale

**RLS is the deciding factor.** AD-04 requires `SET LOCAL app.tenant_id` at the start of every transaction for Postgres RLS. Drizzle's `db.transaction()` gives direct connection access:

```ts
await db.transaction(async (tx) => {
  await tx.execute(sql`SET LOCAL app.tenant_id = ${tenantId}`);
  // all queries in this tx respect RLS policies
});
```

Prisma cannot do this cleanly. Its Client Extensions and middleware lack the ability to inject arbitrary SQL before a query on the same connection. This is a dealbreaker for RLS-based multi-tenancy.

Additional advantages:
- Schema defined in TypeScript — 30 entity definitions become the source of truth, types inferred automatically
- `drizzle-kit` generates human-readable SQL migrations (critical for audit table constraints and RLS policy DDL)
- No binary engine — simpler Cloud Run containers, fewer cold-start concerns
- Repository pattern wraps naturally: `TenantScopedRepository` base class handles `SET LOCAL` automatically

### Risks

- Younger ecosystem than Prisma — fewer tutorials, smaller community
- Relational query API is newer — complex versioned care plan joins may need raw SQL
- Mitigation: raw SQL escape hatch is clean, and Kysely is a documented fallback

### Reversibility

Moderate. Schema definitions would need rewriting, but the repository pattern abstracts the ORM from consumers. Services call `patientRepo.findById()`, not Drizzle directly. Swapping the ORM is contained to the `packages/db` package.

---

## Firebase Auth (no new AD — already in use)

Firebase Auth is already used in cena-health-spark. GCP-native, BAA-eligible under Google's BAA, supports JWT verification in Cloud Run services. Custom claims carry `tenant_id` and role array for RBAC. No reason to change.

---

## Cross-references

| This proposal references | Doc |
|---|---|
| Multi-tenancy approach | `decisions.md` AD-04 |
| Data separation | `decisions.md` AD-05 |
| Data model (30 entities) | `architecture/data-model.md` + `architecture/data-model-validation.md` |
| Swappability requirements | `architecture/agent-implementation-spec.md` Section 5 |
| RBAC definitions | `roles/README.md` |
| Runtime topology | `architecture/agent-implementation-spec.md` Section 4 |
