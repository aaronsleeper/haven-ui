# UX Review: foundations-colors redesign

**Date:** 2026-05-12
**Mode:** Pre-build
**Inputs:**
- `packages/design-system/design/wireframes/foundations-colors-redesign.md`
- Plan: `~/.claude/plans/haven-ui-foundations-page-redesign.md`
- Current production page: `packages/design-system/pattern-library/components/foundations-colors.html` (Phase G Pass 1 baseline)

**Research consulted:**
- W3C WAI APG, "Tooltip Pattern" — tooltip must show on hover OR keyboard focus; container uses `role="tooltip"`; trigger uses `aria-describedby`; tooltip is a supplement, never replaces accessible name
- General palette-page conventions (Tailwind docs, Material, Polaris) — internalized; not cited

## Summary

Wireframe captures the IA correctly and the 70% density reduction is realistic given the de-duplication + compact swatches + hover-hex approach. Three pre-build decisions resolved below (mobile family-grid, tooltip implementation, overview-strip ordering). Copy proposed for all `[COPY: ...]` placeholders. One accessibility concern on `tabindex="0"` for 198 swatches in Zone 6 — recommendation: scope keyboard navigation to a subset to avoid tab-trap fatigue.

## Decisions on Gate 2 open questions

### Open Q #2 — Mobile family-grid behavior — RESOLVED: stack vertically

At `sm` and below, the 11-stop horizontal grid is unusable (~3px per cell on a 320px viewport). Two options were on the table: collapse to 6 stops OR stack vertically.

**Decision: stack vertically.** Below `sm`, each family row becomes a vertical sequence of 11 swatches (~48px tall × 11 = ~530px per family, with stop number labels). All 11 stops preserved. Reading mode shifts from "scan ladder" to "scan column," which is appropriate for mobile. Compacting to 6 stops loses reference information; mobile users are unlikely to be the dense-lookup readers anyway.

Implementation hint: Tailwind responsive classes — `grid-cols-11 sm:grid-cols-11 max-sm:grid-cols-1` (or analogous). haven-mapper will pick the exact composition.

### Open Q #3 — Hex tooltip implementation — RESOLVED: real DOM `role="tooltip"` + `aria-describedby`

Per W3C WAI APG Tooltip Pattern: native `title=` is keyboard-discovery-poor and screen-reader-inconsistent. CSS-only `::before/::after` is visual-only (not SR-accessible). The correct pattern is a real DOM tooltip element with `role="tooltip"` referenced from the trigger via `aria-describedby`, displayed via CSS on `:hover, :focus`.

Concretely each swatch gets:
- `tabindex="0"` (but see accessibility concern below — scope which swatches participate in keyboard nav)
- `aria-label="{family} {stop}"` (e.g., `aria-label="teal 500"`) — accessible name
- `aria-describedby="tooltip-{family}-{stop}"` — points to tooltip
- An adjacent invisible `<span role="tooltip" id="tooltip-{family}-{stop}" aria-hidden="true">#3a8478</span>`, made visible on `:hover, :focus` of the swatch via CSS

The hex is read by screen readers as supplementary detail; the accessible name communicates the family + stop identity. Matches WAI-APG canonical pattern.

Implementation hint: haven-ui may already have a tooltip primitive — flag for haven-mapper to check. If not, this is the second consumer that justifies promoting `palette-swatch` to a primitive (which would encapsulate the tooltip composition).

### Open Q #6 — Overview strip cell ordering — RESOLVED: spec-§2 order

Three orderings were considered: spec-§2 (canonical source), hue-wheel, brightness/semantic-importance.

**Decision: spec-§2 order** (sand, teal, sage, red, amber, green, cyan, orange, yellow, lime, emerald, blue, indigo, violet, purple, fuchsia, pink, rose).

Rationale: the strip is a system-overview affordance. Mirroring spec §2 builds the reader's mental model of "this is the canonical set." Hue-wheel would read prettier but distract from the system-shape message. Brightness/semantic-importance is a UX bias that's not load-bearing for a docs surface.

Aaron can override in post-build review if the visual reading is weak.

## Strengths of the wireframe

- 7-zone top-to-bottom structure is clean and matches the three reader tasks (scan / pick / look up) without modes or tabs
- System Overview Strip is the highest-leverage addition — solves the "feel" problem of "I don't see all hue families" with one viewport
- De-duplicating semantic-named ladders (Primary, Secondary, Accent) into role-rows + single family reference is the right call; current page renders teal three times (Primary section, Color Role table mention, "v2 Expanded Families" mental gap)
- Open Questions section is honest about deferred decisions — exactly what Gate 2 wants
- Anti-patterns explicitly rejected with reasoning — prevents future scope creep

## Concerns

### Critical: Tab-trap fatigue on 198 keyboard-focusable swatches

If every swatch in Zone 6 gets `tabindex="0"`, a keyboard-only user tabbing through the page hits 198 sequential focus stops before reaching the next interactive element on the page. This is alert fatigue's keyboard cousin — focus exhaustion.

**Recommendation:** Scope keyboard focus to the 5-stop preview in Zone 4 (Semantic Roles — 40 swatches total) and the Overview Strip in Zone 2 (18 swatches). Zone 6 swatches expose their hex via `title=` as a fallback for mouse users, but are NOT keyboard-focusable. Reasoning: the lookup-driven reader who needs the exact hex of, say, blue-700 is overwhelmingly mouse + dev-tools (computed style); the keyboard-only reader is the learner/auditor who's served by Zones 2 + 4 + accessible navigation via headings.

Alternative if Aaron wants full keyboard parity: introduce a "skip to next family" pattern (arrow keys cycle within a family, tab jumps to next family heading). More complex; defer unless brand-fidelity flags.

### Moderate: ARIA live announcement on tooltip appearance

Per WAI APG, tooltips can use `aria-live="polite"` to announce on appearance. With 198 potential triggers in Zone 6, polite-live spam would be noisy. **Recommendation:** omit `aria-live` on the tooltip element. The hex is read via `aria-describedby` association when focus lands on the swatch — that's the canonical pattern and avoids over-announcing.

### Moderate: Contrast on hex-value tooltip text

The tooltip itself needs to meet WCAG AA against whatever background it sits on. If the tooltip is positioned over a saturated stop swatch (e.g., over teal-500 #3a8478), default text colors may fail. **Recommendation:** tooltip background must be `bg-sand-900` or `bg-sand-50` (consistent independent of trigger color) with `text-sand-50` or `text-sand-900` respectively. Tested in conform:contrast-pairs at build time.

### Minor: Cross-reference to Phase G Pass 2 badge variants

The wireframe's Open Q #8 asks whether to reference `badge-{family}` variants in the family reference grid. **Recommendation:** Don't reference them. The page's job is palette documentation; badge variants are a consumer of the palette. A pointer would tempt readers into thinking badge-{family} is the canonical way to use raw families — but raw family use is intentionally restricted (data viz / illustration / forthcoming role assignments). The role guide already says this. Skip the badge cross-reference.

## Copy

All copy below is proposed for direct use unless Aaron flags otherwise. Adjust at will.

### Lead paragraph (Zone 1 / page header)

> Cena's color system. 18 active families — sand (neutral), teal, sage, plus the 16 Tailwind hues — calibrated in OKLCH, served as hex. Use the semantic role names below in component code; raw family names are reserved for data visualization and forthcoming role assignments. System reference: [`color-system-v2.md`](../../../../cena-health-brand/_tokens/color-system-v2.md).

### Color Role Guide (Zone 1 cont.) — keep existing table from Phase G Pass 1

The Phase G Pass 1 role guide is solid. One tweak: drop the parenthetical "(v2 — no semantic alias yet)" on each of the 10 expanded families and replace with a single footer sentence: *"Families without a semantic alias are reserved for data visualization, illustration, and forthcoming role assignments. Don't invent semantic vocabulary ad-hoc — promote through brand review."* (Avoids repeating the same parenthetical 10 times.)

### Logo Identity Tokens (Zone 3)

Lead caption (replaces current):

> Brand-anchor hex values. These never change and never compute — use them when exact logo reproduction matters (SVG export, email signatures, brand assets). Family palette stops drift from these by design (spec §1.5); reach for the family stops for everything else.

Per-cell role descriptors:

- `--logo-primary` — Outer ring, "health" wordmark
- `--logo-secondary` — Middle ring
- `--logo-anchor-dark` — "Cena" wordmark
- `--logo-sage` — Inner ring

### Semantic Roles (Zone 4) — 8 role rows

Format: **Role name (Family)** — short description. Anti-pattern note where it adds value.

- **Primary (Teal)** — Brand actions, links, focus rings, active states. Use `bg-primary-*` and `text-primary-*` in component code. *Don't reach for raw `bg-teal-*` — primary captures the brand semantic.*
- **Secondary (Sand)** — Neutral surfaces, secondary buttons, subtle borders. Carries the warm-ground mechanism (`sand-50` is the canonical page background; never pure white).
- **Sage** — Patient-facing content, nutrition, food, community. The brand's hue-shift family — Cena-canonical 18th family alongside the 16 Tailwind hues plus sand.
- **Success (Green)** — Active, enrolled, confirmed, positive outcomes. *Don't use for "Save" or other neutral confirmation actions — primary is the right reach there.*
- **Warning (Amber)** — Pending, approaching threshold, caution, needs review.
- **Error (Red)** — Critical, flagged, overdue, destructive actions, validation failures.
- **Info (Cyan)** — Informational, delivery context, neutral highlights. *Not the same as Primary — Info is for notices; Primary is for actions.*
- **Accent (Violet)** — AI-generated content, insight callouts, special emphasis. Reserved; don't over-reach.

### Semantic Surfaces (Zone 5) — keep existing structure, refresh lead caption

> Named tokens for the warm-ground mechanism. `surface-page` (`sand-50`, `#FBFAF8`) is never pure white — the warm cast is the entire warmth mechanism of the brand. Cards sit on `surface-primary` on `surface-page`; sidebars on `surface-secondary`.

Per-cell labels: keep existing (`surface-page`, `surface-primary`, `surface-secondary`, `surface-teal`, `surface-sage` with hex labels and roles).

### Family Reference Grid (Zone 6) — lead caption

> Every active family at all 11 stops. Hover or focus a swatch to see its hex. Use semantic role names (above) in component code; reach for family names only for data visualization, illustration, and forthcoming semantic role assignments.

Per-family heading format: **{Family name}** — {short role hint}. Examples:

- **Teal** — Brand primary; coincides with `--logo-primary` at stop 500.
- **Sage** — Brand hue-shift family. Cena-canonical 18th family.
- **Sand** — Warm neutral; carries the warm-ground mechanism.
- **Red** — Error / critical.
- **Amber** — Warning / caution.
- **Green** — Success / confirmation.
- **Cyan** — Info / informational.
- **Orange** — Terracotta / earth accent. *No semantic alias yet.*
- **Yellow** — Illumination accent. *No semantic alias yet.*
- **Lime** — Sage-adjacent accent. *No semantic alias yet.*
- **Emerald** — Alternate saturated green. *No semantic alias yet.*
- **Blue** — Deep slate; sky-replacement. *No semantic alias yet.*
- **Indigo** — External systems, partner identities. *No semantic alias yet.*
- **Violet** — Currently serves Accent. Available raw for additional uses.
- **Purple** — Alternate violet. *No semantic alias yet.*
- **Fuchsia** — Vivid magenta accent. *No semantic alias yet.*
- **Pink** — Warm-shifted pink. *No semantic alias yet.*
- **Rose** — Community / relational. *No semantic alias yet.*

### Rules & Discipline (Zone 7)

> ### System rules
>
> - **Use semantic role names in component code.** `bg-primary-500`, `text-success-700`, `border-warning-200`. Raw family names (`bg-orange-500`) are reserved for data visualization, illustration, and forthcoming semantic role assignments.
> - **Never reach for `--color-{stone|slate|gray|zinc|neutral}-*`.** These are defensive aliases mirroring sand to neutralize Tailwind's `@layer theme` cascade override. *Enforced by `conform:css-family` (One-Family-Per-Role gate).*
> - **For exact logo hex, use `--logo-*`.** Spec §1.5 decoupled the palette stops from logo identity. `--color-teal-500` coincides with `--logo-primary` by alignment, but `--color-teal-400` does not equal `--logo-secondary` — use the logo token when the logo hex is what you need.
> - **Dark mode parity is automatic.** Every semantic token has a `.dark` override or is marked theme-invariant in `semantic.css`. *Enforced by `conform:token-theme-parity`.*
> - **Contrast pairs are validated at build time.** New role mappings that fail WCAG AA must surface to brand-fidelity review. *Enforced by `conform:contrast-pairs`.*
> - **Hex values are downstream conversion.** OKLCH/P3 in the cena-brand generator is the source of truth; the hex literals in `palette.css` are translations made for Tailwind v4's cascade-trap discipline.

## Use Case Walk-Through

### "Lookup — find the class for a color I already have in mind"

Reader path: scroll to Zone 6 (Family Reference Grid). Find family by name (headings act as anchors). Hover the stop they want. Get hex. **Pass** — direct path, no nav layers.

### "Pick — choose a color for a new design decision"

Reader path: Zone 1 lead → scan Color Role Guide → scroll to Zone 4 (Semantic Roles). Read role descriptions; see 5-stop preview. Click into a role row → smooth-scroll to Zone 6 → see full ladder. **Pass** — the chain Zone 1 → Zone 4 → Zone 6 is the picker's journey; explicit and short.

### "Learn — understand the system shape"

Reader path: Zone 1 lead → Zone 2 (Overview Strip) → Zone 3 (Logo Identity Tokens) → Zone 4 (Semantic Roles) → Zone 5 (Surfaces) → Zone 7 (Rules). Skips Zone 6's deep grid until needed. **Pass** — top-to-bottom read teaches the system without forcing the reader through 198 swatches.

### "Audit — verify constraints (brand-fidelity, design-system-steward review)"

Reader path: Zone 7 (Rules) first → spot-checks elsewhere. **Pass** — Rules zone at bottom is fine because auditors are doing targeted lookups; not the primary scroll path.

## Open Questions

**1. Should the page's overall heading style (h2 "Colors") gain a section anchor like `#colors`?**
Pattern-library convention varies; some pages do, some don't. Defer to consistency with the parent `foundations.html`.

**2. Logo Identity Tokens — should the inline `style="background-color: var(--logo-X)"` get refactored to utility classes?**
Currently inline because `--logo-*` are not in `@theme` Tailwind utility namespace (they're at `@theme { --logo-primary: ... }` so do they generate utilities? — needs confirmation). If they do, prefer `bg-[var(--logo-primary)]` or extend Tailwind theme to alias them. Defer to haven-mapper.

**3. Print stylesheet.**
Still deferred from Gate 2. Recommend ship without; revisit only if requested.

## Revisions to wireframe (none required)

After this review, no `[REVISED]` tags are needed in the wireframe — open questions resolved here, copy added here, accessibility refinements added here. haven-mapper consumes the wireframe + this review-notes together.

---

## Next steps in pipeline

→ **haven-mapper** consumes wireframe + this review-notes; maps zones to existing PL primitives; gates new primitives via Gap Gate.
→ **dev-tasker** produces build prompts.
→ Build, then **ux-design-review post-build** (validation), then **debrief-capture**.

Throughout: 4-expert panel (design-system-steward, brand-fidelity, ux-design-lead, accessibility) reviews before merge per haven-ui Tier 1 slice protocol.
