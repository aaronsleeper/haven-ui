# Cena Care-Coordinator Platform — handoff bundle

The UX-designed care-coordinator platform, built as self-contained static HTML against the Haven design system. This is the design-led replacement for Cena's current engineer-designed internal platform — the deliverable that shows the built UI (to win buy-in) and seeds the production build.

**Agents:** read [`AGENTS.md`](./AGENTS.md) first — it defines the register, the closed-vocabulary contract, the guardrails, and where the spec lives.

## What's here

- `index.html` — walkthrough launcher linking each surface's primary state-page.
- `_shell/` — the 7-anchor `layout-app-shell-responsive` reference template every surface copies.
- One folder per surface: `today/ patients/ referrals/ diet-operations/ network/ clinical-library/ admin/`. Pages are named `{surface}.{state}.html`.
- `assets/` — the self-contained CSS + font + JS bundle every page consumes.

## Register — internal, not patient-facing

This is operational tooling for care coordinators: dense tables, professional/clinical vocabulary, operational urgency color (clinical-flag severity, app-access warnings) used directly. It is the opposite-end calibration of the same design system that produced the calm, plain-language patient app (`handoff/cena-uconn/`). The shell is the 7-anchor desktop sidebar + topbar, not the patient 3-tab nav.

No real patient or business data appears anywhere — all names, identifiers, and clinical values are synthetic.

## The asset model

Every page links one stylesheet — `./assets/haven.css` — plus the Google-Fonts CDN block for Lora / Source Sans 3 / Source Code Pro. `haven.css` is the **compiled** output of the haven-ui design system with `url(/assets/…)` font references relativized to `url(./…)` so the bundle renders from `file://` with no server. FontAwesome Pro glyphs come from the `haven-ui*.woff2` binaries; the SVG files are fallbacks. Curated JS primitives (`flow-actions`, `context-menu`, `command-palette`, `file-upload`, `quantity-stepper`) ship in `assets/` for the interactions that need them.

`haven.css` is generated output — **never edit it directly.** Edits get overwritten on the next rebuild.

## Rebuilding the assets

From the haven-ui repo root:

```
bash scripts/handoff-rebuild-bundle-platform.sh   # build DS → copy fonts → relativize → copy JS + logo
bash scripts/handoff-render-gate-platform.sh       # render every page; fail on undefined-class drift
```

The rebuild is **atomic** — it copies the `woff2` binaries and relativizes the CSS in one step. Never re-run the CSS relativize alone: doing so without recopying the fonts scrambles FontAwesome Pro glyphs bundle-wide, and the render gate cannot detect it (the classes are defined; only the font binary is stale — commit `77cd7ae`). Always rebuild via the script.

The render gate discovers pages via `find` (the ~55 pages land incrementally across 7 surfaces), so new pages are gated automatically. Scope it to one surface with `handoff-render-gate-platform.sh patients`.

## Where the spec lives

- Per-surface formative docs (authoritative): `Lab/haven-ui/workflows/cena-platform/slots/{surface}/{ia,states,acceptance}.md`.
- App-level model: `Lab/haven-ui/workflows/cena-platform/slots/_app/{content-model,surface-shell-model,trigger-map}.md`.
- Build backlog + execution plan: `~/.claude/plans/cena-platform-pipeline-build.md`; master plan: `~/.claude/plans/cena-platform-redesign-build.md`.
