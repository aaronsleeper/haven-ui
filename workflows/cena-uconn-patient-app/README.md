---
workflow: cena-uconn-patient-app
version: 0.1.0
created: 2026-05-24
last-validated: 2026-05-24
trigger: Aaron — fresh canonical-pipeline run replacing the prior ad-hoc patient-app build
participating-experts: [Product Strategist, QA Lead, Tech Lead, DS Steward, IA Designer, Content Strategist, Interaction Designer, UX Designer, A11y Specialist, Content Designer, Frontend Architect, QA Reviewer, Senior Reviewer, UX Lead, clinical-care, healthcare-data-governance, skeptic]
slots-fired: [1, 2, 3, 4, 5, 7, 8, 9, 10, 11, 13, 14, 17, 19, 20, 21, 22, 23, 24, 25, 27, 29, 30, 31, 34]
health: draft
---

# Workflow Instance — Cena × UConn Patient App

This is a project **instance** of the canonical [UI Development Workflow](../../../../workflows/ui-development/README.md) (vault-root `workflows/ui-development/`). It does **not** fork or redefine the pipeline — it picks slots from the canonical catalog, names the experts that fill them, and declares this engagement's variables. All cross-cutting rules ([principles](../../../../workflows/ui-development/principles.md)) are inherited, not restated.

> **NOT the deprecated prototype.** `Lab/haven-ui/.project-docs/agent-workflow/` is retired. Fork collapsed 2026-05-24 (closure obligation `~/.claude/plans/closure-obligations/2026-05-24-ui-pipeline-fork-collapse.md`, closed). haven-ui's applying-mode skills (haven-mapper, ui-react-porter, haven-pl-builder, haven-pl-qa) remain valid as realizations of canonical slots.

## Scope — whole app, formative-first (Aaron, 2026-05-24)

This run covers the **entire patient app** — *all* patient-facing capabilities run through the pipeline into **one complete IA**, then the full per-surface formative design set. It is **not** a single-surface (Home) build.

The pipeline orders this correctly: **code (slots 21–22) is downstream of the whole formative spine.** Before any surface is built — before any is even wireframed — a large set of **formative documents** must exist: the app-level spine (brief, test-strategy, stack, framework-binding, ds-binding), the **app-scoped IA** (slot 7 app-mode — `trigger-map` + `surface-shell-model`, run once per app, *upstream* of per-slice work), the content-model, and then per-surface IA/flows/states/wireframes/a11y/strings/acceptance. The complete enumeration + dependency order + status is the **[formative-doc manifest](formative-doc-manifest.md)** — produced first so the "ton of docs before code" is visible and tracked.

Build is *additionally* gated on **T0.1 (stack/ownership)** + **T0.2 (data layer)** — Andrey/Vanessa decisions, not resolvable here. So formative work proceeds independently and fully; code waits on both the formative set and those gates. Patient-facing capabilities (UConn pilot, ratified against `Capability matrix.md`): consent 12; ordering 16/17/18/23/37/38/39/40/41; check-ins 07/08/09; outcomes 20; scheduling 21; notifications 22; escalation 27; bilingual 19 (EN-only v1). → 6 surfaces per the validated IA.

## Commander's intent

Run the **whole patient app** through the canonical pipeline to produce a **complete, coherent formative documentation set** — one app-wide IA covering every patient capability, then per-surface design specs — at the pipeline's quality bar, so that when build begins it executes against a fully-specified app rather than re-deriving structure per surface. Eventual build target: **verified, render-coherent, brand-faithful, self-contained static-HTML** we **own and maintain** (no framework-ownership liability, no dependence on Andrey).

- **What matters most:** dignity and safety for an HIV+/food-insecure, mixed/low-tech-literacy, partly-ESL population. Calm is the default; the app never surveils, gamifies, shames, or nags. Clinical copy is accurate and the no-score invariant holds.
- **The tension it navigates:** agent *initiative* (surfacing what's genuinely due) against a *never-nagging* calm; richness against legibility for a low-literacy/ESL reader; fresh-process rigor against cheap ratification of priors that are already sound.

Written so an orchestrator who has never seen the steps can reason about *why* this workflow exists, not just *what* it does.

## Priority stack (Aaron-confirmed, 2026-05-24 — safety-first)

When steps fail or recovery paths compete, walk top-down. A higher concern is never sacrificed for a lower one.

1. **Patient safety** — no PHI leak; clinically accurate copy; the no-score invariant (computed scores route to clinicians, never to the patient).
2. **Clinical compliance** — accountable-human sign-off where required; consent-gate integrity; primary-source clinical content.
3. **Brand fidelity** — Haven restraint + the population-frame constraints (dignity, no surveillance/gamification, calm-default, plain ~5th–6th-grade copy, mobile-first).
4. **Velocity** — the slice progresses.
5. **Polish** — visual finesse beyond the brand-fidelity floor.

## Acceptable degradation boundary

- **Above the line (workflow continues):** incomplete polish; a conditional slot skipped because its condition does not hold (logged); a sound prior ratified rather than re-derived; a design decision made under proceed-and-document and logged for AM review; English-only v1 (ES deferred).
- **Below the line (pause, escalate, do NOT activate the output):** any PHI exposure; clinically inaccurate or score-revealing patient copy; a consent dark-pattern; a surface that renders **incoherent** (Principle 13 fail) shipped as done; the **non-waivable human cold render-and-look** (slot 30) skipped and the run called complete; surveillance/gamification/shaming creeping onto a vulnerable-population surface.

## Project variables (per canonical README opt-in §2)

| Variable | Value |
|---|---|
| `design-system` | `Lab/haven-ui/DESIGN.md` (brand spec) + `packages/design-system/pattern-library/` — `COMPONENT-INDEX.md` is ground truth |
| `target-framework` | **Static HTML (handoff-style), self-contained bundle composed from the haven-ui pattern library.** NOT React, NOT Angular. Rationale: [[feedback_ownership_bar_over_language]] — the bar is ownership, not language; PL HTML+CSS is the DS's native stack (not a translation handoff); production stack (React vs Angular) is the separate T0.1 Andrey/Vanessa decision. |
| `target-model` | per `.claude/rules/model-routing.md` — Opus for generative/judgment slots, Sonnet for mechanical port/verify |
| `pattern-library` | `packages/design-system/pattern-library/COMPONENT-INDEX.md` (closed-vocabulary contract; render gate enforces) |
| `project-root` | `/Users/aaronsleeper/Vaults/Lab/haven-ui` |
| `wireframe-syntax` | markdown/`.mdoc` per-state wireframes (as in `capabilities/development/wireframes/` + `apps/patient/design/wireframes/recall-01-interview.md`) |
| `qa-panel` | pattern-library-steward · IA · accessibility · brand-fidelity · clinical-care · healthcare-data-governance · **skeptic** (Principle 15) |
| `tier-model` | haven-ui Tier 1 / Tier 2 / Tier 3 (default) |
| `deterministic-integrations` | haven design system (`components.css` closed vocabulary + handoff render gate); IA-v1 (3-tab nav); surface-primary shell model; FA Pro v7 icon canon; self-contained handoff bundle format |

## Build + render mechanics (this engagement)

- **Build target:** static HTML in `handoff/cena-uconn/<surface>/`, composing referenced PL components. The **shell/nav chrome is a referenced ds component** (`layout-mobile-shell`, `layout-mobile-bottom-nav`, `layout-app-shell-responsive`), never hand-rolled.
- **Self-contained:** HTML + `assets/haven.css` + font binaries, relative paths, renders under `file://`. No Preline JS in the bundle (use native `<details>`). Rebuild only via `scripts/handoff-rebuild-bundle.sh` (never CSS-only — Guardrail 1).
- **Render-verification (Principle 13):** `node tools/render-check.mjs` (vault-root pipeline tool) and/or `scripts/handoff-render-gate.sh` (bundle-local closed-vocabulary gate). Read the screenshot PNG, don't trust a gate-pass alone (Guardrail 5).
- **3-tab nav canon** (Guardrail 4): Home · Order · Activity. The sibling 5-tab demo nav is drift — do not propagate.

## Fresh-process posture (Aaron, 2026-05-24)

Run from slot 1. Prior docs are **reference-only evidence**, never authoritative `consumes:` inputs — every slot produces its own deliverable and passes its gate. Where a prior is sound, the slot **ratifies it cheaply** (cites it, confirms it still holds, records the ratification) rather than re-deriving. The prior ad-hoc build (`handoff/cena-uconn/home/*`, `handoff/cena-uconn/{assessments,meals,log-outcome}/*`) is **superseded-pending**: visual reference only; archived per-surface to `archive/cena-uconn-adhoc-build/` when the fresh run ships a verified replacement.

## Companion files

- [steps.md](steps.md) — slot→step mapping with anatomy fields
- [checkpoints.md](checkpoints.md) — human gates
- [context-budget.md](context-budget.md) — per-step loading profiles
- [retro-log.md](retro-log.md) — run metrics + workflow-level retro
- Slot deliverables: this dir (`brief.md`, `test-strategy.md`, `stack.md`, `framework-binding.md`, `ds-binding.md`) + per-surface design deliverables under `slots/<surface>/`
- AM review queue (proceed-and-document log): [review-queue-AM.md](review-queue-AM.md)
- Ambient plan: `~/.claude/plans/cena-uconn-patient-app-canonical-run.md`
