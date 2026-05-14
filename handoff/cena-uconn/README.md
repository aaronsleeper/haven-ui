# Cena × UConn — Patient Content-Area Handoff

Plug-and-play patient-facing content areas for the UConn pilot, designed for hand-port into Cena's Angular codebase by Andrey.

## What this folder is

Self-contained HTML composites that render the patient-facing surfaces of the UConn pilot's contracted features (assessments, meal ordering, cart). Each composite is a content area, not a route — Cena's Angular shell wraps these into the agentic chat experience. Composites consume the haven-ui pattern library directly; the HTML in this folder demonstrates structure, copy, validators, and JS contracts that Andrey ports to Angular templates + services.

This folder superseded the prior `archive/vanilla-html-handoff/` model on 2026-05-14. Built fresh on the panel-resolved spec discipline + section-wrapper contract + brand/a11y standards now in force. See `~/.claude/plans/cena-uconn-isolated-uis.md` for the full pivot context.

## Folder structure

```
handoff/cena-uconn/
├── README.md                          ← this file
├── index.html                         ← nav-shell to slice pages
└── assessments/                       ← Slice 1 (HFIAS / WHOQOL-HIV BREF / NKQ + screener)
    ├── README.md                      ← slice handoff doc per ~/.claude/plans/cena-uconn-isolated-uis.md template
    ├── take-assessment.entry.html     ← Step 1: agent invitation
    ├── take-assessment.preflight.html ← Step 2: per-register framing + preflight card
    ├── take-assessment.question.html  ← Step 3: questionnaire panel (the working surface)
    └── take-assessment.confirm.html   ← Step 5: submit confirmation
```

## Asset model

**During development** (now): the HTML files reference haven-ui CSS + JS via relative paths (`../../packages/design-system/...`). Open in any modern browser via the haven-ui Vite dev server (`pnpm --filter @haven/design-system dev` → http://localhost:5173) or directly via `file://`.

**For hand-off to Andrey**: a build/bundle step will package the folder as a self-contained zip with inlined CSS + JS. Not built yet — slice 1 prioritizes structural validation; bundling lands when the slice is ready to send.

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
