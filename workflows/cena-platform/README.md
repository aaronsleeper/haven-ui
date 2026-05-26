---
workflow: cena-platform
version: 0.1.0
created: 2026-05-26
last-validated: 2026-05-26
trigger: Aaron — redesign + rebuild Cena's internal care-coordinator (Platform) app, seeded by the platform current-state walk
participating-experts: [Product Strategist, QA Lead, Tech Lead, DS Steward, IA Designer, Content Strategist, Interaction Designer, UX Designer, A11y Specialist, Content Designer, Frontend Architect, QA Reviewer, Senior Reviewer, UX Lead, skeptic]
slots-fired: [1, 7, 9, 10, 11, 13, 14, 17, 19, 20, 21, 22, 23, 24, 25, 27, 29, 30, 31, 34]
health: draft
---

# Workflow Instance — Cena Care-Coordinator Platform

This is a project **instance** of the canonical [UI Development Workflow](../../../../workflows/ui-development/README.md) (vault-root `workflows/ui-development/`). It does **not** fork or redefine the pipeline — it picks slots from the canonical catalog, names the experts that fill them, and declares this engagement's variables. All cross-cutting rules ([principles](../../../../workflows/ui-development/principles.md)) are inherited, not restated.

> **Sibling instance, different product.** This is the **internal care-coordinator app** (`platform.mlcnutrition.dev`), NOT the patient app. The patient-app instance (`../cena-uconn-patient-app/`) is the **structural template** for this one — same canonical pipeline, same Tier-A static-HTML emit pattern, same render discipline — but a different persona and a different brief. Do not carry the patient-app's population frame (HIV+/food-insecure, calm-default, no-gamification, ~5th-grade copy) into this app: the user here is an internal professional coordinator. Calibrate from *this* brief.

## Scope — whole app, formative-first

This run covers the **entire care-coordinator app** — all 19 jobs / 7 surfaces from the IA run through formative design into **one complete designed spec**, then **built as Tier-A static HTML** (the patient-app emit pattern). It is **not** a single-surface proof.

The upstream slots are **already complete** and live in the gitignored engagement folder — this instance **references** them (define-once; never copies):

- **Slot 1 — brief:** `Knowledge/Projects/Cena Health/Apps/Platform/Redesign Brief.md`
- **Slot 7 — app-scoped IA (reviewed + validated):** `Knowledge/Projects/Cena Health/Apps/Platform/IA Synthesis.md`
- **Discovery (slot 6) satisfied by:** `Knowledge/Projects/Cena Health/Apps/Platform/Current-State Inventory.md` (18 screens walked)
- **Layer-2 findability record:** `Knowledge/Projects/Cena Health/Apps/Platform/IA Findability Validation.md`

So "use cases → full IA" is done. What remains is the per-surface formative fan-out (×7), composition, and the whole-app build.

### The 7 surfaces (from IA Synthesis)

`Today · Patients · Referrals · Diet Operations · Network · Clinical Library · Admin`

Each expands to multiple state-screens (as Appointments became empty/request/pending/upcoming). "All screens" = every state across all 7 surfaces, one built HTML file each.

| Surface | Absorbs (jobs) | Shell-fit (from IA) |
|---|---|---|
| **Today** (new) | J1, J6, J11, J8/J10 | Triage launchpad — pushed work as actionable cards, each deep-linking into the entity where work is done. Landing surface. |
| **Patients** | J2, J3, J4, J5 | Roster (clinical-signal columns) → read-first patient record + app-access; intake (single + bulk). |
| **Referrals** | J6 | Partner-scoped pipeline → convert-to-patient. |
| **Diet Operations** | J7, J8, J9, J10, J11, J12 | The medically-tailored-diet pipeline as ONE connected surface (providers → catalog → weekly plans → AI import → distribution → kitchen orders), cross-linked. |
| **Network** | J13, J14 | Organization → Program Partners drill-down. |
| **Clinical Library** | J15, J16 | Reference tables (dietary guidelines, diagnosis codes). Low-frequency. |
| **Admin** | J17, J18, J19 | Staff/roles, settings, EHR integrations — config, separated from daily ops. |

## Commander's intent

Run the **whole care-coordinator app** through the canonical pipeline to produce a **complete, coherent designed spec** — per-surface flows/states/wireframes/a11y/strings/components for all 7 surfaces from the validated IA — then **build it as verified, render-coherent, brand-faithful, self-contained Tier-A static HTML** (the patient-app emit pattern). The built UI is the artifact Andrey sees; production-stack ownership (React vs Angular) is a downstream Andrey/Vanessa decision *after* the UI exists.

- **What matters most:** turning an engineer-designed 100%-pull CRUD app into a task-shaped, queue-first coordinator tool — pushed work surfaces, business relationships are navigable, one nav model, every screen oriented.
- **The tension it navigates:** richness of a real operational tool against the legibility a coordinator can hold in their head; a queue-first launchpad against the entity-level detail where work actually completes; fresh design rigor against cheap ratification of an IA that is already validated.

## Priority stack (Platform — internal-tool calibration)

When steps fail or recovery paths compete, walk top-down. A higher concern is never sacrificed for a lower one.

1. **Data safety** — production PHI app; the redesign reasons over *structure*, never over real patient/business records. No real data in any deliverable or built screen (inherits the walk's no-real-data discipline).
2. **Operational correctness** — the IA's coverage holds: every job has a home; pushed work has a queue; relationships stay navigable. A redesign that loses a job fails.
3. **Brand fidelity** — Haven restraint, composed from the PL closed vocabulary; coherent render (Principle 13).
4. **Velocity** — surfaces progress.
5. **Polish** — finesse beyond the brand-fidelity floor.

## Acceptable degradation boundary

- **Above the line (continues):** incomplete polish; a conditional slot skipped because its condition does not hold (logged); the validated IA ratified rather than re-derived; a design decision made under proceed-and-document and logged.
- **Below the line (pause, escalate, do NOT call complete):** any real patient/business data leaking into a deliverable or screen; a job from the IA losing its home in build; a surface that renders **incoherent** (Principle 13 fail) shipped as done; the **non-waivable human cold render-and-look** (slot 30) skipped and the run called complete.

## Project variables (per canonical README opt-in §2)

| Variable | Value |
|---|---|
| `design-system` | `Lab/haven-ui/DESIGN.md` (brand spec) + `packages/design-system/pattern-library/` — `COMPONENT-INDEX.md` is ground truth (closed vocabulary; render gate enforces) |
| `target-framework` | **Tier-A static HTML, self-contained bundle composed from the haven-ui pattern library** (the patient-app emit pattern). NOT React, NOT Angular. Production stack is a downstream Andrey/Vanessa call *after* the built UI exists. Rationale: [[feedback_ownership_bar_over_language]] — the static-HTML handoff is the DS-native artifact, not the production-stack decision, so it is **not** gated on Andrey buy-in. |
| `target-model` | per `.claude/rules/model-routing.md` — Opus for generative/judgment slots, Sonnet for mechanical port/verify |
| `pattern-library` | `packages/design-system/pattern-library/COMPONENT-INDEX.md` (closed-vocabulary contract; render gate enforces) |
| `project-root` | `/Users/aaronsleeper/Vaults/Lab/haven-ui` (build output + instance machinery). Engagement artifacts (brief, IA, inventory) live in the gitignored `Knowledge/Projects/Cena Health/Apps/Platform/` because they describe a PHI app. |
| `output-dir` | `Lab/haven-ui/handoff/cena-platform/<surface>/` — one HTML file per state, `<surface>.<state>.html` (e.g. `today/today.queue.html`), mirroring `handoff/cena-uconn/`. |
| `wireframe-syntax` | markdown/`.mdoc` per-state wireframes (as in `cena-uconn-patient-app/slots/*/`) |
| `qa-panel` | pattern-library-steward · IA · accessibility · brand-fidelity · **skeptic** (Principle 15) |
| `tier-model` | haven-ui Tier 1 / Tier 2 / Tier 3 (default) |
| `deterministic-integrations` | haven design system (`components.css` closed vocabulary + handoff render gate); the validated Platform IA (7-anchor nav, queue-first); FA Pro v7 icon canon; self-contained handoff bundle format |

## Build + render mechanics (this engagement)

- **Build target:** static HTML in `handoff/cena-platform/<surface>/`, composing referenced PL components. Shell/nav chrome is a **referenced ds component** (the persistent left-nav + top-bar shell from the IA's surface-shell-model), never hand-rolled.
- **Self-contained:** HTML + `assets/haven.css` + font binaries, relative paths, renders under `file://`. Rebuild only via `scripts/handoff-rebuild-bundle.sh` (never CSS-only — Guardrail 1).
- **Render-verification (Principle 13):** `scripts/handoff-render-gate.sh` (closed-vocabulary gate) and read the screenshot PNG — never trust a gate-pass alone (Guardrail 5).
- **Nav canon:** the 7 grouped anchors from the IA (`Today · Patients · Referrals · Diet Operations · Network · Clinical Library · Admin`) + global patient search + work-queue badge on Today. Do not introduce competing nav models (the current app's three-model problem is the thing being fixed).

## Fresh-process posture

Run from the first uncompleted slot. Slots 1 + 7 are **done + validated** — ratify cheaply (cite them, confirm they still hold), do not re-derive. The current `platform.mlcnutrition.dev` app is **current-state reference only** (captured in the inventory), never an authoritative `consumes:` input — every formative slot produces its own deliverable and passes its gate.

## Companion files

- [steps.md](steps.md) — slot→step mapping for the whole-app run
- Slot deliverables: per-surface design deliverables under `slots/<surface>/`; app-scoped deliverables under `slots/_app/`
- Ambient plan: `~/.claude/plans/cena-platform-walk-and-redesign.md` (root) + `~/.claude/plans/cena-platform-pipeline-instance.md` (this scaffold)
