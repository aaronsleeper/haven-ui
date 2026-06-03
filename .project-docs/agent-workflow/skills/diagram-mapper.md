---
name: diagram-mapper
description: Render a haven-ui workflow diagram from a use-case's structured spec — a diagram.md instruction file (visual intent), the use-case manifest + fragments (workflow content), and haven-ui's diagram pattern-library family. Produces a standalone HTML/SVG file ready for review.
model: sonnet
tier: skill
---

# diagram-mapper

Renders a workflow diagram for a Cena use case. Reads structured instructions + workflow content + haven-ui patterns; produces the actual diagram HTML/SVG.

The wireframe-paradigm analogue for diagrams: same shape as `haven-mapper` (which reads wireframe → identifies PL components → builds), but for the diagram layer of the use-case pipeline.

## Inputs

| Input | Path | Purpose |
|---|---|---|
| `diagram.md` | `use-cases/<slug>/diagram.md` | Diagram-rendering intent — lanes, node placement, emphasis, uncertainty visualization, layout direction |
| `manifest.md` | `use-cases/<slug>/manifest.md` | Workflow content + sequence + edges (outgoing_edges from each fragment) |
| Fragment files | `use-cases/<slug>/fragments/*.md` | Typed step specs (enquiry, decision, action, attestation-gate, hand-off) |
| Diagram PL | `Lab/haven-ui/packages/design-system/pattern-library/components/diagram-*.html` | Visual primitives — Frame, Marker Defs, Box, Pill, Arrow, Lane, Caption, Milestone, Icon, Graph |
| components.css | `Lab/haven-ui/packages/design-system/src/styles/tokens/components.css` | Semantic classes including diagram-* modifier set |
| Brand spec | `Lab/cena-health-brand/specs/haven-directive-styling.md` + `_tokens/generated/palette.css` | Color tokens, typography stack, restraint discipline |
| Research plan | `~/.claude/plans/haven-ui-diagram-research.md` | Deep design decisions on the primitives (markers, viewBox conventions, layer split, accessibility) |

## Output

A `rendered-diagram.html` file at the use-case folder root containing:

- A `<diagram-frame>` SVG element with `role="img"`, `aria-labelledby`, `aria-describedby`
- `<diagram-marker-defs>` with canonical haven markers (`arrow-end`, `arrow-end-emphasis`, `arrow-end-bidirectional`, `arrow-end-open`)
- All nodes rendered as `diagram-box` instances with appropriate modifier classes
- All edges rendered as `diagram-arrow` instances with appropriate marker references
- Swimlanes rendered as `diagram-lane` instances
- A `diagram-caption` if `diagram.md` provides intent prose
- A `diagram-long-desc` (sr-only by default) with structured a11y content derived from the manifest + fragments

## Modifier-class resolution

The skill maps fragment + intent flags to modifier classes:

| Source | Modifier class | Status |
|---|---|---|
| `type: attestation-gate` (human) | `diagram-box--attestation-gate` | Candidate (pending promotion) |
| `x_cena_uncertainty: tbd` | `diagram-box--uncertain-tbd` | Candidate |
| `x_cena_uncertainty: assumption` | `diagram-box--uncertain-assumption` | Candidate |
| `x_cena_uncertainty: gap` | `diagram-box--uncertain-gap` | Candidate |
| `x_cena_uncertainty: resolved` | (no modifier — default styling) | n/a |
| `x_cena_watches: <role>` | `diagram-box--has-watcher` | Candidate (with inline `▲ watches: <role>` label) |
| `emphasis: high` (from diagram.md) | combined with attestation-gate where applicable | n/a |
| `emphasis: low` | `diagram-box--ghost` | Built |
| `diagram-box--substrate` (existing) | for system-of-record nodes when shown | Built |
| `diagram-box--milestone-progress/done/queued` (existing) | for timeline use cases | Built |

For candidate modifier classes that don't yet exist in `components.css`:

1. Inline-define them in a `<style>` block at the top of `rendered-diagram.html`
2. Comment each block: `/* CANDIDATE FOR PROMOTION TO components.css — see diagram-mapper skill spec for naming convention */`
3. Surface the candidate set in the rendered file's `<!-- DRIFT NOTES -->` block at the top so promotion work is discoverable

This follows the precedent set by `Lab/haven-ui/tools/surface-emit/content-sot/uconn-workflow-mapping-2026-06-02.md`, which inline-defined diagram CSS classes before the haven-ui Diagrams section had landed. Same pattern; same restraint.

## Steps

1. **Read inputs.** Load `diagram.md` (intent), `manifest.md` (sequence + edges), all fragments (typed steps), the COMPONENT-INDEX.md `## Diagrams` section.
2. **Verify the diagram source.** Every `node_placement` entry must reference a fragment that exists. Every lane must be referenced by at least one node. Every `crosses_boundary` annotation must align with an actual lane transition.
3. **Resolve modifier classes** per the mapping table above. For each candidate not in components.css, inline-define.
4. **Compute layout.**
   - If `diagram_type: swimlane-flow` with manual coordinates in `node_placement`: use them directly.
   - If layout coordinates are absent and node count ≤ 10: compute coordinates from sequence order + lane assignments. Use viewBox conventions from research plan §D3 (landscape: `0 0 760 460` baseline; widen as needed for node count).
   - If `edges_from_manifest: true`: use each fragment's `outgoing_edges` from its frontmatter as the canonical edge list, applying any `edge_overrides` from `diagram.md`.
   - For complex routing (>10 nodes OR ≥4 element types OR significant back-edges): use the `diagram-graph` Layer 2 ESM helper at `Lab/haven-ui/packages/design-system/src/scripts/env/diagram-graph.js`.
5. **Render.** Compose the SVG using haven primitive class conventions:
   - `<diagram-frame>` → `<svg class="diagram-frame" viewBox="..." role="img" ...>`
   - `<diagram-marker-defs>` → `<defs class="diagram-marker-defs"> ... </defs>` with markers per research plan §D3
   - `<diagram-lane>` → `<g class="diagram-lane"> <text class="diagram-lane-label" ...>` (Source Code Pro, letter-spaced uppercase)
   - `<diagram-box>` → `<g class="diagram-box <modifiers>"> <rect class="diagram-box-shape" ...> <text ...>`
   - `<diagram-arrow>` → `<path class="diagram-arrow" marker-end="url(#arrow-end)" ...>` with stroke per `edge_overrides`
6. **Surface uncertainty callouts.** For each `uncertainty_visualization` entry, render a small monospace `<text class="diagram-tbd-callout">` above (or per `callout_position`) the affected node with the callout text.
7. **Render watcher annotations.** For each `watcher_annotations` entry, render an additional `<text class="diagram-box-watcher-label">` inside the affected box.
8. **Write the long-desc.** Per research plan §D3 canonical structure: purpose-line + elements list + relationships list + notes. Pull elements from manifest + fragments; pull relationships from edges. Sr-only by default.
9. **Validate.** Run an integrity check: every fragment in `manifest.sequence` has been rendered; every edge between consecutive fragments is present; every cross-boundary transition has an emphasized marker; every uncertainty entry has both modifier class AND callout rendered.

## Rules

- **Pattern-library is canonical** per haven-ui CLAUDE.md. Do not invent new primitive HTML — use existing `diagram-*` primitives. Modifier-class additions are allowed but must be flagged as candidates for promotion.
- **No `style="..."` attributes on SVG elements** per haven-ui rules. Inline `<style>` block at the rendered-diagram file level IS allowed for candidate modifier classes pending promotion (precedent: yesterday's UConn workflow-mapping artifact).
- **All colors via `var(--color-*)` tokens** per haven-ui token discipline. Use the brand spec's documented diagram tokens (`--color-arrow-default`, `--color-arrow-emphasis`, `--color-diagram-substrate-bg`, etc.) where they exist; provide fallback hex literals via `var(--token, #fallback)` for the candidate modifier inlines.
- **All `<diagram-arrow>` paths get `aria-hidden="true"`** — meaning lives in the connected boxes' labels + the long-desc.
- **The rendered HTML's `<diagram-long-desc>` follows the canonical structure** from research plan §D3.
- **Layout-only attributes stay inline** (`x`, `y`, `width`, `height`, `cx`, `cy`, `r`, `d`) — those are SVG positioning, not styling.
- **One marker-defs per `<svg>`** — reference at the top of the frame; don't redefine per-diagram.

## Drift detection

The skill verifies (at render time) that every fragment ID referenced in `diagram.md` exists in `fragments/`. A missing fragment → surface as an error; do not render with a phantom node.

Per Aaron (2026-06-03): the load-bearing drift surfaces are (a) the diagram-source syntax itself (rare) and (b) the codified attribute set or accepted values (rare-but-real). Both produce smell-detectable output anomalies; the skill spots them at validate-step, OR they manifest in rendered output and the agent notices during review.

The invariant-tripwire candidate at the spec layer: pin `"every fragment_id in diagram.md is referenced in manifest.sequence OR in a fragment's outgoing_edges"` against `use-cases/**/diagram.md`. Worth adding once the second use case lands.

## Honest limits

- This skill produces a **static HTML/SVG file**. Runtime interactivity (drag, click-to-expand) is out of scope.
- The skill does **not validate clinical content** — that's Marrero's domain. Surface clinical TBDs as labeled uncertainty; do not edit clinical content.
- Drift between diagram.md and fragments is **detectable** (via the verify step) but not auto-corrected — the skill reports inconsistencies for human resolution.
- For the candidate modifier classes inlined in `<style>` blocks: these are **brand-fidelity-weighted** decisions that ultimately want the 4-expert review panel (per haven-ui Tier 1 conventions). Inlining is the iteration mode; promotion to `components.css` is the commitment.

## Relationship to other skills

- **`sop-from-fragments`** — sibling skill that renders the SoP from the same fragments + manifest. Different concerns (visual vs. operational document); same source data.
- **`haven-mapper`** — wireframe-side analogue; this skill is the diagram-side equivalent of that wireframe → PL-build pipeline.
- **`haven-pl-builder`** — used to PROMOTE the candidate modifier classes from inline `<style>` to `components.css` once a pattern is proven (after the worked example survives review).
- **`ui-react-porter`** — if a diagram primitive needs a React port, this skill is the mechanical translator. Not invoked by diagram-mapper directly.
- **4-expert review panel** — required for promoting candidate modifier classes to `components.css`. Brand-fidelity expert is the load-bearing reviewer.

## Source

2026-06-03: Aaron proposed the wireframe-paradigm reframe — "in our UI emission pipelines our wireframes essentially function like instructions for the build using markdown syntactically codified to haven patterns. Wondering if we could benefit from a similar approach here." Approved as the diagram layer's authoring pattern. First use case: `escalation-phq9-positive`.
