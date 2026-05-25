# Cena × UConn — Patient Content-Area Handoff

Plug-and-play patient-facing content areas for the UConn pilot, designed for hand-port into Cena's Angular codebase by Andrey.

> **AI coding agents:** read [`AGENTS.md`](./AGENTS.md) before touching files in this folder. Each slice subfolder has its own `AGENTS.md` with slice-specific conventions, hard invariants, and pointers to the canonical spec. The artifact vocabulary and porting completeness criteria live there.

## What this folder is

Self-contained HTML composites that render the patient-facing surfaces of the UConn pilot's contracted features (assessments, meal ordering, cart). Each composite is a content area, not a route — Cena's Angular shell wraps these into the agentic chat experience. Composites consume the haven-ui pattern library directly; the HTML in this folder demonstrates structure, copy, validators, and JS contracts that Andrey ports to Angular templates + services.

This folder superseded the prior `archive/vanilla-html-handoff/` model on 2026-05-14. Built fresh on the panel-resolved spec discipline + section-wrapper contract + brand/a11y standards now in force. See `~/.claude/plans/cena-uconn-isolated-uis.md` for the full pivot context.

## Folder structure

```
handoff/cena-uconn/
├── README.md                          ← this file
├── index.html                         ← nav-shell to slice pages
├── assets/                            ← compiled CSS + font binaries (self-contained)
│   ├── haven.css                      ← built haven-ui CSS (compiled from packages/design-system)
│   ├── haven-ui*.woff2                ← FontAwesome Pro font binaries
│   ├── haven-ui*.svg                  ← FontAwesome SVG fallbacks
│   └── haven-ui.png                   ← haven-ui logo
└── assessments/                       ← Slice 1 (HFIAS / WHOQOL-HIV BREF / NKQ + screener)
    ├── README.md                      ← slice handoff doc per ~/.claude/plans/cena-uconn-isolated-uis.md template
    ├── take-assessment.entry.html     ← Step 1: agent invitation
    ├── take-assessment.preflight.html ← Step 2: per-register framing + preflight card
    ├── take-assessment.question.html  ← Step 3: questionnaire panel (the working surface)
    └── take-assessment.confirm.html   ← Step 5: submit confirmation
```

## Asset model — self-contained

This folder is structured so Andrey can download `handoff/cena-uconn/` (or any single slice subdirectory) and the HTML renders without further setup. CSS + fonts live locally in `assets/`; HTML references them via relative paths (`./assets/haven.css` from the top level, `../assets/haven.css` from slice subdirectories). The brand fonts (Lora, Source Sans 3, Source Code Pro) load from Google Fonts via CDN — Andrey's environment needs internet for those, which is the standard pattern.

To open: any static HTTP server pointed at this directory works. For example:
```
cd Lab/haven-ui/handoff/cena-uconn/
python3 -m http.server 8765
# → open http://localhost:8765/
```
Or just open `index.html` directly via `file://` in a modern browser.

## Rebuilding the assets

When the haven-ui CSS changes (new tokens, semantic classes, or pattern-library updates), regenerate the bundle with the single command from haven-ui repo root:

```
bash scripts/handoff-rebuild-bundle.sh
```

That script is the **only** supported rebuild path. It runs three steps as one inseparable operation: builds `@haven/design-system`, copies the binary assets (FA Pro fonts, SVG fallbacks, logo) into `assets/`, and rewrites the built CSS's absolute `url(/assets/)` → relative `url(./)` so it resolves fonts relative to its own location (required for self-contained operation). It is idempotent and safe to re-run.

**Never run the CSS step alone.** Re-running just the `sed` (regenerating `haven.css` without recopying the `woff2` font binaries) scrambles FontAwesome Pro glyphs bundle-wide — and the render gate cannot detect it, because every class is still defined; only the font binary is stale (commit `77cd7ae`). The CSS and fonts are versioned together; the script keeps them inseparable.

### Render gate — required after every rebuild

```
bash scripts/handoff-render-gate.sh
```

Renders all 9 handoff pages with `render-check.mjs` and exits non-zero if any page references a class the rebuilt bundle cannot realize (undefined-class drift). The bundle uses a **closed vocabulary** — design-system component classes plus an explicit `@source inline(...)` safelist in `packages/design-system/src/styles/main.css`, declared independently of these pages (see `AGENTS.md` → Closed-vocabulary contract). The gate is what keeps the drift from silently recurring; a bundle the gate rejects is not shippable. Fix per the gate's output — safelist a standard utility, or correct the page to real vocabulary — then rebuild and re-run.

When ready, the rebuild + gate can move into a `pnpm --filter @haven/design-system handoff:bundle` script.

## How to read this for porting

For each composite under a slice's `README.md`:

1. **What this is** — one sentence + screenshot (when generated)
2. **HTML** — link to the composite file; this is the structural spec
3. **CSS** — list of semantic classes from `packages/design-system/src/styles/tokens/components.css` the composite uses; copy these into your Angular component styles
4. **JS contracts** — if the composite carries a vanilla-JS behavior module, the event names + detail shapes + programmatic API (per haven-ui's "Vanilla JS per primitive" convention)
5. **Data shapes** — JSON/TS interface for inputs the composite expects
6. **Port note** — wire to your Angular state however fits; the composite is a content area, not a route

## Canonical references

- Wireframes (per-state structural spec): `Knowledge/Projects/Cena Health/Partners/UCONN Health/capabilities/development/wireframes/take-assessment.step-*.mdoc`
- Flow doc (design intent / WHY): `Knowledge/Projects/Cena Health/Partners/UCONN Health/capabilities/development/flows/flow-take-assessment.md`
- Pattern library: `Lab/haven-ui/packages/design-system/pattern-library/COMPONENT-INDEX.md`
- Plan: `~/.claude/plans/cena-uconn-isolated-uis.md`
