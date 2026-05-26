# AGENTS.md — Cena Care-Coordinator Platform handoff

For AI coding agents working with this folder. Read this before touching any file.

This bundle is the **UX-designed care-coordinator platform** — the internal operational app Cena's care coordinators use to run patients, referrals, diet operations, the partner network, the clinical library, and admin. It is the design-led replacement for the current engineer-designed platform; the deliverable's purpose is to show the built UI (win buy-in) and then drive the production build.

It does NOT prescribe how to port to a target framework — that is the consuming team's call. Your job reading this folder is to extract structure, copy semantic classes, and honor contracts faithfully; the consuming team writes the framework wiring.

## Register — this is NOT the patient app

The patient app (`handoff/cena-uconn/`) is calm, plain-language, no-alarm, comfort-spaced, 3-tab patient nav. **This platform is the opposite end of the same design system:**

- **Audience:** internal care coordinators — professionals doing operational work, not patients.
- **Density:** compact/dense (`data-table-compact`), not comfort spacing.
- **Vocabulary:** clinical/operational terms used directly — no plain-language simplification. "Diet" (prescriptions conforming to clinical need + taste), "Cutoff passed", "Exception — 3 orders", "Pending review".
- **Color:** operational urgency color is **allowed and load-bearing** (clinical-flag `severity-badge`, app-access needs-fix warning) — not suppressed the way the patient app suppresses alarm.
- **Shell:** the 7-anchor `layout-app-shell-responsive` desktop shell (sidebar + topbar + content), NOT the patient 3-tab nav. See `_shell/` for the reference template every surface copies.

## What this folder is

A self-contained bundle of care-coordinator content-area composites, one folder per surface. The bundle is the deliverable: the receiving team reads the HTML structure, copies the semantic CSS classes from `assets/haven.css`, honors the JS contracts, and binds data shapes — in whatever framework they ship.

## Folder map

```
handoff/cena-platform/
├── README.md             ← human-oriented overview, asset model, rebuild procedure
├── AGENTS.md             ← this file
├── index.html            ← nav-shell linking every surface + its state-pages
├── assets/               ← self-contained CSS + font + JS bundle (consumed by every page)
│   ├── haven.css         ← compiled haven-ui CSS; the semantic-class spec
│   ├── haven-ui*.woff2   ← FontAwesome Pro font binaries
│   ├── haven-ui*.svg     ← FontAwesome SVG fallbacks
│   ├── haven-ui.png      ← haven-ui logo
│   └── *.js              ← curated JS primitives (flow-actions, context-menu,
│                            command-palette, file-upload, quantity-stepper)
├── _shell/               ← the 7-anchor app-shell reference template (S1) every surface copies
└── {surface}/            ← today · patients · referrals · diet-operations ·
                             network · clinical-library · admin
    └── {surface}.{state}.html   ← one page per enumerated state
```

Page naming is `{surface}.{state}.html` (e.g. `patients.roster.html`, `patients.record.html`, `diet-operations.weekly-plans-open.html`). The enumerated states per surface live in the spec (below).

## The 7 anchors (sidebar, in order)

1. **Today** — `fa-solid fa-inbox` + work-queue count badge. Landing (triage launchpad, deep-links into entities).
2. **Patients** — `fa-solid fa-user`
3. **Referrals** — `fa-solid fa-arrow-right-arrow-left`
4. **Diet Operations** — `fa-solid fa-utensils`
5. **Network** — `fa-solid fa-sitemap`
6. **Clinical Library** — `fa-regular fa-book-medical`
7. **Admin** — `fa-solid fa-gear`

Global in topbar: patient search (J2, highest-frequency pulled job) + work-queue badge. Within-surface wayfinding uses `page-header`/`page-title` + `nav-breadcrumb` + `nav-tabs` / drill-down — never sidebar sub-menus.

## Conventions to honor

- **Copy semantic classes from `assets/haven.css`. Do not regenerate equivalents.** The CSS is the spec. If a class you need does not exist, that is a gap — surface it; do not invent a substitute.
- **Layout-only utilities are acceptable inline — within the closed vocabulary.** Standard Tailwind-family layout utilities (`grid`, `flex`, `gap-*`, `p-*`) appear inline on layout containers. Arbitrary-value utilities (`max-w-[1400px]`, `grid-cols-[minmax(...)]`) are NOT sanctioned — promote to a named pattern.
- **Brand fonts load from Google Fonts CDN.** Lora (headings), Source Sans 3 (body), Source Code Pro (code). Every page links them in the head.
- **No real patient or business data.** Synthetic names/identifiers; dietary/diagnosis/clinical values representative only. This is internal operational tooling, but it ships as a design artifact — never seed it with PHI.

## Closed-vocabulary contract

A class is realizable here only if it is one of:

- a **design-system component class** defined in `packages/design-system/src/styles/tokens/components.css`, or
- a **sanctioned utility** — a standard Tailwind utility the design-system build already scans, or one explicitly safelisted in the `@source inline(...)` block in `packages/design-system/src/styles/main.css`.

The design-system Tailwind build scans only its own pattern library — never `handoff/cena-platform/**`. A utility a handoff page uses is in the bundle only if some pattern-library page also uses it, or it is safelisted. That independence is what gives the render gate teeth.

When you need a class that is not realizable:

- **A standard utility** → add it to the `@source inline(...)` safelist in `main.css`, rebuild, re-run the gate.
- **An arbitrary-value utility** → do NOT safelist; promote the layout to a named DS pattern.
- **A component class that does not exist** → add it to `components.css` + `COMPONENT-INDEX.md` (Tier-1 ceremony), or correct the page to an existing class. Never invent a phantom class with no backing rule.

### The render gate

`scripts/handoff-render-gate-platform.sh` (haven-ui repo) renders every page in this bundle with `render-check.mjs` and fails if any references a class the bundle cannot realize. Run it after every `haven.css` rebuild — the closed vocabulary holds only because the gate runs. Pass a surface name to scope (`handoff-render-gate-platform.sh patients`).

## Guardrails

Hard-won rules. Each cost a debugging round-trip; honor them.

1. **Rebuild the bundle ONLY via `scripts/handoff-rebuild-bundle-platform.sh`. Never CSS-only.** Re-running the `sed` without recopying the `woff2` font binaries scrambles FontAwesome Pro glyphs bundle-wide, and the render gate cannot catch it (classes defined; only the font binary stale — commit `77cd7ae`). The script makes the steps inseparable.
2. **No Preline in the self-contained bundle.** It ships without Preline's JS, so Preline-driven collapse (`hs-accordion`, `hs-collapse`) is inert here. Use native `<details>`/`<summary>` for any collapse/disclosure. (Tabs that need JS use the curated primitives in `assets/` — wire them per the primitive's contract.)
3. **Only use PL classes COMPILED into the bundle.** Closed vocabulary (above). A stray Tailwind utility no design-system source uses is NOT in the build and fails the render gate (observed with `select-none`). Add it to the `@source inline(...)` safelist and rebuild, or use a real DS class.
4. **This app uses the 7-anchor `layout-app-shell-responsive` desktop shell** (see `_shell/`), NOT the patient 3-tab nav and NOT patient-app-only classes. Internal-coordinator register: dense, professional, operational color allowed.
5. **Browser-verify by RUNNING `render-check` and reading the screenshot PNG.** A gate pass alone misses visual + glyph bugs — the gate checks for undefined classes, not whether the page looks right. Render the page and look at the PNG before calling a surface done.

## Where canonical sources live

The bundle is self-contained for runtime, but the *spec* lives in the vault:

- Formative docs (the authoritative per-surface spec): `Lab/haven-ui/workflows/cena-platform/slots/{surface}/{ia,states,acceptance}.md` — `states.md` enumerates each surface's state-pages + PL composition + a11y/strings.
- App-level model: `Lab/haven-ui/workflows/cena-platform/slots/_app/{content-model,surface-shell-model,trigger-map}.md` — entity graph, the 7-anchor shell composition, cross-surface trigger/deep-link map.
- Build backlog + execution plan: `~/.claude/plans/cena-platform-pipeline-build.md`.
- Master plan / design intent: `~/.claude/plans/cena-platform-redesign-build.md`.

When you cannot read those paths, each page's HTML comment block + this AGENTS.md carry the load-bearing spec inline.

## Surface index

| Surface | Folder | ~Pages | Notes |
|---|---|---|---|
| Patients | `patients/` | ~7 | Reference consumer — roster, record (+ app-access), single + bulk intake. Authors shared primitives. |
| Diet Operations | `diet-operations/` | ~20 | One connected surface: providers · catalog · AI-import · weekly-plans · distribution · orders. Biggest structural change. |
| Referrals | `referrals/` | ~4 | Partner-scoped pipeline → convert-to-patient (pre-fills intake). |
| Network | `network/` | 6 | Organization → Program-Partner graph; org + partner records. |
| Clinical Library | `clinical-library/` | 8 | Dietary guidelines + diagnosis codes (reference). |
| Admin | `admin/` | 8 | Staff/roles · settings · EHR integrations. |
| Today | `today/` | 2 built (+ loading/error spec) | Triage launchpad; deep-links into entities — built LAST once link targets exist. |
