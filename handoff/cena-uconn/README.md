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

When the haven-ui CSS changes (new tokens, semantic classes, or pattern-library updates), regenerate the bundle from haven-ui repo root:

```
pnpm --filter @haven/design-system build
# → produces packages/design-system/dist/assets/haven-ui.css + fonts

# Copy the rebuilt CSS + fonts into the handoff bundle, rewriting absolute url() refs to relative:
mkdir -p handoff/cena-uconn/assets
cp packages/design-system/dist/assets/haven-ui*.woff2 handoff/cena-uconn/assets/
cp packages/design-system/dist/assets/haven-ui*.svg handoff/cena-uconn/assets/
cp packages/design-system/dist/assets/haven-ui.png handoff/cena-uconn/assets/
sed -E 's|url\(/assets/|url(./|g' packages/design-system/dist/assets/haven-ui.css \
  > handoff/cena-uconn/assets/haven.css
```

The `sed` step rewrites `url(/assets/haven-ui.woff2)` → `url(./haven-ui.woff2)` so the CSS resolves font URLs relative to its own location — required for self-contained operation.

When ready, this rebuild can move into a `pnpm --filter @haven/design-system handoff:bundle` script.

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
