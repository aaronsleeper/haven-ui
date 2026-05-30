# Brand-team queue — proposed primitives, settled carve-outs

Items the haven-ui pattern-library team needs to settle, plus settled carve-outs that future consumers should be able to find by grep.

Two kinds of entry:

- **Settled** — a decision already made; recorded here for findability when a future consumer asks "why isn't there a PL primitive for X?"
- **Proposed (gated)** — a primitive worth codifying when its use-count clears the 3-use floor (`.claude/rules/generative-determinism.md`). Each proposal names its gate condition; do not codify before the gate fires.

New entries append to the bottom. Promote a "Proposed" to "Settled" by editing the entry in place and noting the date + the third use case that fired the gate.

---

## Settled: data-viz layer carve-out

**Date:** 2026-05-29
**Source:** [vault-constellation HAVEN-COMPONENT-AUDIT.md §6](../../vault-constellation/HAVEN-COMPONENT-AUDIT.md) + Haven Visual Designer expert verdict §8

**What it means.** Data-visualization surfaces — D3 force graphs, Chart.js charts, custom SVG node renderings, animation-driven elements — are **intentionally outside the PL pattern catalog**. They live in app or surface code and consume Haven *tokens* (`var(--color-*)`, `var(--font-*)`, `var(--space-*)`) directly, but do not try to express themselves through PL component classes.

**Why.** PL primitives are designed for typed, recurring UI structures (cards, list rows, badges, queue headers). A node-on-a-force-graph, a Chart.js dataset config, a GSAP'd pulse-ring — these are visualization code, not UI components. Forcing them through PL would either dilute the catalog with one-off entries or fight visualization libraries' own rendering models.

**The shape of compliance.** Data-viz code:
- ✅ uses Haven color/font/space tokens (`var(--color-text-brand)`, `var(--color-warning-base)`, `var(--font-mono)`, etc.)
- ✅ honors the brand voice in choices of palette / typography / motion timing
- ✅ documents itself as data-viz in a comment when the convention isn't obvious
- ❌ does NOT need a PL component entry, `components.css` class, or COMPONENT-INDEX row

**Working example.** `Lab/vault-constellation/template.html` — the beacon node + halo + pulse-ring + force-graph layout is canvas/D3 code, inherits Haven tokens, and is documented as a data-viz carve-out in `HAVEN-COMPONENT-AUDIT.md` row 6.

**Operational note for /haven-pl-qa and future audits.** Don't flag a surface as "off-pattern" because it's data-viz. The carve-out is the answer.

---

## Proposed (gated): floating-panel-shell primitive

**Date proposed:** 2026-05-29
**Source:** [vault-constellation HAVEN-COMPONENT-AUDIT.md §1 + Haven Visual Designer expert cross-cutting verdict](../../vault-constellation/HAVEN-COMPONENT-AUDIT.md)

**The shape.** A multi-panel shell where rails float over the canvas as bordered/rounded cards, not flanking columns. The canvas remains the figure; rails are overlay UI. Distinct from the existing `three-panel-shell` (flanking columns).

**Current consumers (use-count: 2 of 3).**
1. `Lab/vault-constellation/` — left rail (VIEWS) + right rail (COLOR BY / YOUR MOVE / detail) floating over the D3 force graph.
2. Patient-app reasoning surface — chrome floating over the brand canvas.

**Gate condition.** Codify as `floating-panel-shell` PL primitive when a **third canvas-primary surface** lands that needs the same composition. Until then, each consumer composes ad-hoc and the pattern stays uncodified.

**Why this is gated, not built.** Two uses are coincidence; three are a pattern (`generative-determinism.md` 3-use floor). Codifying speculatively risks baking in the wrong abstraction; the first wrong abstraction is harder to unwind than the third late codification.

**Why this passes "grew not built" today.** Per the Haven Visual Designer verdict, the constellation's floating rails were not authored from a brittle premise — they emerged from the canvas-as-figure requirement and the warm radial gradient that flanking columns would chop. Keep the current composition; codify only when a third instance proves the pattern.

---

## Proposed (gated): `.color-dot` primitive

**Date proposed:** 2026-05-29
**Source:** [vault-constellation HAVEN-COMPONENT-AUDIT.md §4 + Haven Visual Designer expert verdict §4-3](../../vault-constellation/HAVEN-COMPONENT-AUDIT.md)

**The shape.** A small inline color swatch dot — a circle that takes a color from a CSS variable, with a soft glow halo, optionally embedded inside a filter pill or legend row. Existing surfaces hand-roll the same `.sw` / `.lg-dot` / `.swatch` shape.

**Current consumers (use-count: 1+ of 3).**
1. `Lab/vault-constellation/` — `.legend .sw` + `.lg-dot` (deliverables ledger).
2. *(future)* patient-app metrics dashboards — KPI status indicators
3. *(future)* care-coordinator dashboard — alert category dots
4. *(future)* generic data-viz legends across surfaces

**Gate condition.** Codify as `.color-dot` PL primitive when two more surfaces ship the same hand-rolled shape — or earlier if Aaron or the Haven Visual Designer expert explicitly promotes it on the strength of expected near-term consumers.

**Why this is gated, not built.** Same 3-use-floor logic as `floating-panel-shell`. One concrete use today; the future consumers are anticipated but unbuilt.

**Authoring shape if/when codified.** Classes likely: `.color-dot` (the dot itself), `.color-dot-sm` / `.color-dot-md` (size variants), embeddable inside `.filter-pill`, `.legend-row`, `.list-group-item-icon` slots. Consumes a color via inline `style="color: var(--...)"` or a `data-color` attribute the PL CSS resolves.

---

## Adding a new entry

Append at the bottom. Use the section template above. Always name:

- **What it means / The shape** — what the entry covers in one paragraph.
- **Source** — the audit, plan, or thread that surfaced it (linked).
- **Status fields** — for *Settled*, the date + working example. For *Proposed (gated)*, the date proposed + current use-count + explicit gate condition for promotion.
