# AGENTS.md — Cena × UConn handoff

For AI coding agents working with this folder. Read this before touching any file.

This document defines what each artifact in `handoff/cena-uconn/` is and how it relates to the others. It does NOT prescribe how to port the artifacts to a target framework — that is the consuming team's call. Your job as an agent reading this folder is to extract structure, copy, and contracts faithfully; the consuming team writes the framework wiring.

## What this folder is

A self-contained bundle of patient-facing content-area composites for the UConn pilot at Cena Health. Each composite is a content area, not a route. The bundle was authored fresh on 2026-05-14 (panel-resolved spec discipline, brand + a11y standards in force, primary-source content for clinical instruments). It supersedes the prior `archive/vanilla-html-handoff/` model.

The bundle is the deliverable. The receiving team consumes it by reading the HTML structure, copying the semantic CSS classes, honoring the JS contracts, and binding the data shapes — in whatever framework they ship.

## Artifact vocabulary

Three kinds of artifact live here. An agent should always know which kind it is reading:

- **Bundle scaffolding** (`README.md`, `index.html`, `AGENTS.md`, `assets/`) — orientation + nav + the self-contained CSS/font assets that all pages consume. Edits here affect every consumer.

- **Abstract template pages** (`{slice}/take-{flow}.{state}.html`) — one per state of a runner. They show the structural shape of one state with placeholder or representative content, wrapped in the slice's chosen shell. **Shell choice is per-slice**, declared in the slice's `AGENTS.md`. Assessments uses `layout-app-shell-responsive.html` (deterministic single content area; rationale in `assessments/SHELL-DECISION.md`); future slices like meals will use `layout-agentic-shell.html` (chat-primary, two-surface). Receiving agents port the template once; instances are data.

- **Resolved instance pages** (`{slice}/take-{instrument}.html`) — single-page narrative demos that walk all states top-to-bottom for one specific instance with primary-source content. They demonstrate per-instrument variation that the abstract template can't show (e.g., HFIAS's skip logic, WHOQOL's per-item response scales, the screener's outcome-path-differentiated copy variants). Use these to understand what real content looks like in the runner; do NOT port them as the production page (the production runner is parameterized; instance pages are demonstrations).

The distinction matters: an agent that ports an instance page as the production runner duplicates work and creates drift conditions when content changes.

## Folder map

```
handoff/cena-uconn/
├── README.md             ← human-oriented overview, asset model, rebuild procedure
├── AGENTS.md             ← this file
├── index.html            ← nav-shell to all slices
├── assets/               ← self-contained CSS + font bundle (consumed by every page)
│   ├── haven.css         ← compiled haven-ui CSS; semantic classes Andrey's port copies
│   ├── haven-ui*.woff2   ← FontAwesome Pro font binaries
│   ├── haven-ui*.svg     ← FontAwesome SVG fallbacks
│   └── haven-ui.png      ← haven-ui logo
└── {slice}/              ← one folder per slice (assessments, future: meals, cart, ...)
    ├── README.md         ← human-oriented slice doc (HTML / CSS / JS / data shapes / port notes)
    ├── AGENTS.md         ← agent-oriented slice doc (read this before touching slice files)
    ├── take-{flow}.{state}.html  ← abstract template pages (one per state)
    └── take-{instrument}.html    ← resolved instance pages (one per real-content instance)
```

Each slice has its own `AGENTS.md`. Read it before working on slice files.

## Conventions to honor

These apply across every page in the bundle. When you author or modify HTML here, your output should preserve these:

- **Copy semantic classes from `assets/haven.css`. Do not regenerate equivalents.** The CSS is the spec. If a class you need does not exist in `assets/haven.css`, treat that as a gap and surface it in your work output — do not invent a substitute.
- **Layout-only utilities are acceptable inline — within the closed vocabulary.** Standard Tailwind-family layout utilities (`grid`, `flex`, `gap-*`, `mx-auto`, `p-*`, etc.) appear inline on layout containers. But an inline utility is realizable only if it is sanctioned — see **Closed-vocabulary contract** below. Arbitrary-value utilities (`max-w-[1400px]`, `grid-cols-[minmax(...)]`) are not sanctioned; promote those to a named pattern. Component styling lives in semantic classes.
- **Brand fonts load from Google Fonts CDN.** Lora (headings), Source Sans 3 (body), Source Code Pro (code). Every page links them in the head. The receiving environment needs internet access for fonts; this is the standard pattern.
- **Reference the canonical wireframes for every state's structural decisions.** Each page's HTML comment block names the wireframe path; follow the link before second-guessing the structure.
- **Cite the source for clinical content.** Every instrument question, response option, and scoring rule traces to a primary-source citation in `instrument-content-primary-sources.md` (the receiving environment may not have access to that file; the per-page comment blocks name the source inline as well).

## Conventions to NOT violate

- **Do not regenerate Tailwind output to a custom CSS file.** `assets/haven.css` is the compiled output of the haven-ui design system; it gets regenerated from haven-ui's source via the rebuild procedure in `README.md`. A receiving agent that invents new utility CSS or rewrites `haven.css` introduces drift.
- **Do not modify `assets/haven.css` directly.** Regenerate from the haven-ui source per `README.md`'s rebuild section. Direct edits get overwritten on next rebuild.
- **Do not invent question text or scoring rules for clinical instruments.** All four UConn instruments (HFIAS, WHOQOL-HIV BREF, GNKQ-R, satisfaction-when-it-lands) source verbatim from primary documents. Inferred or paraphrased content fails the slice's verify-time-sensitive-claims standard. If a question is incomplete or you cannot find the source, stop and surface the gap.
- **Do not change the no-score invariant on assessment confirmations.** Step 5 confirmation pages show submission acknowledgement only; the computed score routes to the clinician surface, never the patient. This is encoded structurally in `assessment-confirmation` and reinforced in every slice's confirm page.
- **Do not consolidate the per-register copy variants into a single message.** Sensitive / knowledge-quiz / satisfaction / screener registers each carry different framing; the variation is editorially load-bearing (a "care team" disclosure for a pre-enrollment screener is factually wrong, for example).
- **Do not invent state-machine behavior beyond what the wireframes spec.** The runner's transitions, save-pause, early-exit predicates, and submit validators are all spec'd in the wireframes. Adding novel behavior creates drift.

## Closed-vocabulary contract

The bundle uses a **closed vocabulary**, declared independently of these pages. A class is realizable here only if it is one of:

- a **design-system component class** defined in `packages/design-system/src/styles/tokens/components.css` (e.g. `card`, `receipt`, `text-link`, `skip-link`, `layout-two-pane`), or
- a **sanctioned utility** — either a standard Tailwind utility the design-system build already scans, or one explicitly safelisted in the `@source inline(...)` block in `packages/design-system/src/styles/main.css`.

The design-system Tailwind build scans only its own pattern library — it never scans `handoff/cena-uconn/**`. A utility a handoff page uses is in the bundle only if some pattern-library page also uses it, or it is in the safelist. Decided 2026-05-16 on the workflow's determinism tenet: the vocabulary is declared independently of these pages — that independence is what gives the render gate teeth.

When you need a class that is not realizable:

- **A standard utility** (a token / spacing / type utility on the normal scale) — add it to the `@source inline(...)` safelist in `main.css`, rebuild, re-run the gate.
- **An arbitrary-value utility** (`max-w-[1400px]`, `grid-cols-[minmax(...)]`) — do NOT safelist it. Promote the layout to a named design-system pattern (see `layout-two-pane` / `layout-two-pane-grid`) and use that.
- **A component class that does not exist** — add it to `components.css` + `COMPONENT-INDEX.md`, or correct the page to an existing class. Never invent a class with no rule behind it (a "phantom" — e.g. `text-fg-muted`, which has no backing token; use `text-sand-600`).

### The render gate

`scripts/handoff-render-gate.sh` (in the haven-ui repo) renders all 9 pages with `render-check.mjs` and fails if any page references a class the bundle cannot realize. Run it after every `haven.css` rebuild — the closed vocabulary holds only because the gate runs. See `README.md` → Rebuilding the assets.

## Guardrails

Hard-won rules from building the patient-app slices. Each one cost a debugging round-trip; honor them so the next agent doesn't pay it again.

1. **Rebuild the bundle ONLY via `scripts/handoff-rebuild-bundle.sh`. Never CSS-only.** Re-running the `sed` without recopying the `woff2` font binaries scrambles FontAwesome Pro glyphs bundle-wide, and the render gate cannot catch it (classes are defined; only the font binary is stale — commit `77cd7ae`). The script makes the steps inseparable; bypassing it reopens the bug. (Rebuild detail: `README.md` → Rebuilding the assets.)
2. **No Preline in the self-contained bundle.** The bundle ships without Preline's JS, so Preline-driven collapse (`hs-accordion`, `hs-collapse`) is inert here. Use native `<details>`/`<summary>` for any collapse/disclosure. (The pattern library uses Preline; this handoff bundle deliberately does not — it must render from `file://` with no JS framework.)
3. **Only use PL classes that are COMPILED into the bundle.** The bundle uses a closed vocabulary (see Closed-vocabulary contract above). A stray Tailwind utility that no design-system source uses is NOT in the build and **fails the render gate** (observed with `select-none`). Add it to the `@source inline(...)` safelist in `main.css` and rebuild, or use a real DS class — never assume an arbitrary utility is present.
4. **New patient surfaces use the IA-v1 3-tab nav (Home · Order · Activity).** The sibling slices' 5-tab nav (`assessments/`, `meals/`, `log-outcome/`) is demo-era drift, not canon — do not copy it into new surfaces. Reconciling those siblings to the 3-tab nav is tracked cleanup, not a license to propagate the 5-tab. (Canon: `~/.claude/plans/patient-app-ia-v1.md`.)
5. **Browser-verify by RUNNING `render-check` and reading the screenshot PNG.** A gate pass alone misses visual and glyph bugs — the gate checks for undefined classes, not whether the rendered page looks right. Render the page and look at the PNG before calling a surface done. (This is the bundle-local form of the workflow's render-verification principle.)

## Where canonical sources live

The bundle is self-contained for runtime, but the *spec* (wireframes, panel verdicts, content sources, design intent) lives in another repository the receiving environment may not have access to.

When you can read these paths, they are the authoritative spec:

- Wireframes: `Knowledge/Projects/Cena Health/Partners/UCONN Health/capabilities/development/wireframes/take-{flow}.step-{N}-{name}.mdoc` — define structural shape, copy keys, behavior contracts per state
- Component-map: same directory, `component-map-{flow}.md` — names which haven-ui PL primitives compose each tag in the wireframes
- Panel verdicts: same directory, `panel-verdicts-{flow}-{focus}.md` — pre-build review feedback from PL steward + IA + a11y + brand-fidelity + clinical-care + healthcare-data-governance experts; iterations have already been applied to the wireframes + bundle, but the verdicts log *why*
- Flow doc (design intent / WHY): `Knowledge/Projects/Cena Health/Partners/UCONN Health/capabilities/development/flows/flow-{flow}.md` — design rationale; read this when a structural choice doesn't make sense from the wireframe alone
- Instrument content: `Knowledge/Projects/Cena Health/Partners/UCONN Health/capabilities/development/instrument-content-primary-sources.md` — verbatim primary-source content for clinical instruments
- Screener content: `Knowledge/Projects/Cena Health/Partners/UCONN Health/capabilities/development/screener-pre-enrollment-content-draft.md`
- Cross-cutting principles: `Knowledge/Projects/Cena Health/Apps/Patients/chat-affordance-principles.md` — the rules that govern every patient-facing flow (two interaction paths, no-op-affordance discipline, etc.)
- Plan: `~/.claude/plans/cena-uconn-isolated-uis.md` — full pivot context, slice sequence, completion notes

When you cannot read those paths, the bundle's per-page comment blocks + per-slice `AGENTS.md` + per-page `README.md` carry the load-bearing spec inline.

## What is NOT in this folder

- The primary-source PDFs for the clinical instruments (HFIAS, WHOQOL-HIV BREF, GNKQ-R) are not bundled. They are linked by URL in the instrument content artifact. Receiving agents that need to verify a question against the source should fetch from the cited URL.
- The haven-ui source CSS is not here. `assets/haven.css` is the compiled output. To rebuild, follow the procedure in `README.md`.
- The React port that lived at `Lab/haven-ui/apps/patient/` was retired 2026-05-14 PM in favor of this HTML deliverable. It is not part of the handoff. If you find references to React component names (`PatientWeekPanel`, `BudgetMeter`, etc.) in vault documentation, they refer to that retired port; the HTML composites here are the canonical surface.
- The actual production runtime code (Cena's Angular monorepo) is not here. The receiving team writes that against this bundle's spec.

## How to know when a porting task is done

Per slice and per artifact, completeness criteria vary. The per-slice `AGENTS.md` defines them concretely. In general:

- **Structural fidelity**: the ported component renders the same DOM hierarchy + semantic classes as the abstract template page. ARIA attributes are preserved verbatim.
- **Content fidelity**: every copy string traces to its source (per-page comment block names the wireframe + copy key). Clinical content traces to primary-source citation.
- **Contract fidelity**: state transitions, save-pause behavior, validators, and per-register dispatch match the wireframe's `{% behavior %}` block (or the per-slice AGENTS.md's behavior summary).
- **Invariant fidelity**: hard invariants (no-score, two-interaction-paths, separate screener data routing, etc.) are honored.

If any of those four cannot be met, surface the gap in your work output. Do not silently substitute.

## Slice index

- [`assessments/`](./assessments/) — UConn pilot assessment runner: HFIAS, WHOQOL-HIV BREF, GNKQ-R, satisfaction (slice 2), pre-enrollment screener. Read [`assessments/AGENTS.md`](./assessments/AGENTS.md) first.
- [`meals/`](./meals/) — UConn pilot weekly meal-ordering flow: entry, state-read, preferences, cart, submit, at-a-glance. Chat-primary agentic shell; desktop-only (≥1440px). Read [`meals/AGENTS.md`](./meals/AGENTS.md) first.
- [`log-outcome/`](./log-outcome/) — UConn pilot self-reported-outcomes log (cap-20): one card per measure (weight, BP, A1C, free-form note), each independently savable. Deterministic form (the agentic chat version is post-launch); responsive app shell (same as assessments). Read [`log-outcome/AGENTS.md`](./log-outcome/AGENTS.md) first.

Future slices will land here when authored. Each will have its own `AGENTS.md`.
