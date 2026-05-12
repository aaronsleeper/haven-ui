---
feature: foundations-colors-redesign
scope: pattern-library documentation page (not an app screen)
gate_scope_exempt: conform:wireframe-shell (this wireframe lives outside apps/*/design/wireframes/ and is for a PL docs page, not an app screen)
upstream: ~/.claude/plans/haven-ui-foundations-page-redesign.md (Gate 1 IA approved 2026-05-12)
target_file: packages/design-system/pattern-library/components/foundations-colors.html
---

# FOUND-COLORS-01: Foundations — Colors (Pattern Library docs page)

**Application:** Haven Pattern Library (design-system spec server)
**Use Case(s):** Lookup, learning, audit (see Page Purpose)
**User Type:** Designer / dev / coding agent / brand reviewer (not patient/RDN/coordinator — this is a developer-facing reference surface)
**Device:** Desktop primary; responsive at `sm` breakpoint (PL sidebar collapses)
**Route:** `http://localhost:5173/pattern-library/pages/foundations.html` (loads `components/foundations-colors.html` as a partial via `<load src=>`)

## Page Purpose

The canonical brand-color reference for haven-ui. A reader arrives here to do one of three things:
1. **Lookup** — find the class for a specific color they already have in mind ("what's the class for that warm green at stop 500?")
2. **Pick** — choose a color for a new design decision they're making ("I need a community/relational accent — what should I reach for?")
3. **Learn** — understand the system shape (what families exist, what each role means, why some stops are logo-locked)

Success looks like: the lookup reader finds their class in one scan-glance; the picker reader sees role-to-family mappings and example chips at top; the learner sees the system at a glance via the overview strip before going deep.

---

## Layout Structure

### Shell

Pattern-library standard shell (`app-sidebar` left + content area). Active sidebar item: **Foundations → Colors**. Inherits from `packages/design-system/pattern-library/partials/pl-sidebar.html`.

### Header Zone

- **Component:** standard PL page header (h2 + pl-description)
- Title: **Colors**
- Lead paragraph: `[COPY: one-sentence statement of the system — "Cena Color System v2: 18 active families (16 Tailwind + sage + sand) in OKLCH/P3, with hex output. Hex literals only in @theme to survive Tailwind v4 cascade."]`
- Inline link to spec: "Architecture — `Lab/cena-health-brand/_tokens/color-system-v2.md`"

### Content Zone

The page reads top-to-bottom as 7 zones in this order. No collapsibles, no tabs (per `feedback_show_dont_hide_content.md` — default flat). The reader scrolls.

---

#### Zone 1: @component-meta (existing)

- **Component:** standard PL `@component-meta` HTML comment header
- Required field updates:
  - `name: Color Tokens` (unchanged)
  - `category: Foundations` (unchanged)
  - `classes:` list — keep accurate
  - `when-to-use:` — emphasize this is the canonical reference; semantic aliases are the default vocabulary
  - `notes:` — concise system summary; v2 architecture; logo decoupling caveat; cascade trap rationale

This is HTML-comment metadata, not user-visible. Keeps existing behavior.

---

#### Zone 2: System Overview Strip (NEW)

- **Component:** `[NEW COMPONENT: palette-overview-strip — single horizontal row of every active family's 500 stop side-by-side, abbreviated label below each cell]`
- **Position:** Top of visible page content, immediately after lead paragraph
- **Purpose:** Answers "what does the whole system look like?" in one scan-glance. Solves Aaron's "I still don't see all hue families" feel issue.
- **Layout:** flex row, 18 cells, equal width (~5.5% each at 1080px content width), height ~64px, `rounded` (4px) — `bg-{family}-500` per cell with `text-xs uppercase tracking-wide` label centered below
- **Cell order:** sand → teal → sage → red → amber → green → cyan → orange → yellow → lime → emerald → blue → indigo → violet → purple → fuchsia → pink → rose (neutral surfaces first, brand-canonical next, semantic roles, then expanded families per spec §2)
- **Interaction:** click a cell → smooth-scroll to that family's deep reference row (Zone 6)

---

#### Zone 3: Logo Identity Tokens

- **Component:** existing 4-cell card grid (`grid grid-cols-2 sm:grid-cols-4 gap-4`)
- **Position:** Just below overview strip — anchored high because these are the brand's frozen-hex truth
- **Lead text:** "Hex-frozen per spec §5; never computed. Family palette stops decouple from these by design (spec §1.5) — use `--logo-*` when exact logo hex is required (SVG export, email signatures, brand assets); use the family palette stops for everything else."
- **Cells (each):**
  - Swatch: 64px tall, `rounded` (4px), `style="background-color: var(--logo-X)"` (inline CSS var; these are not Tailwind utilities)
  - Label: `--logo-primary` etc. (mono font)
  - Hex: `#3A8478` always visible (no hover-only here — these are the canonical hex values; readers need them visible)
  - Caption: short role descriptor
- **Stays as-is from Phase G Pass 1; no redesign needed for this zone.**

---

#### Zone 4: Semantic Roles

- **Component:** `[NEW COMPONENT: semantic-role-row — role label + 5-stop compact preview + role description, repeated for each semantic role]`
- **Position:** Below logo identity tokens
- **Purpose:** The picker reader's primary destination. Maps brand-canonical semantic names to families with a compact stop preview.
- **Layout:** Each role is one `flex` row:
  - Left (240px): role name in heading style ("Primary" / "Secondary" / "Sage" / "Success" / "Warning" / "Error" / "Info" / "Accent"), with family name in `text-sm text-sand-600` parenthetical
  - Center (flex): 5 swatches at `h-8` with `rounded-sm` (2px), showing stops 50/100/300/500/700. Hex visible on hover/focus (title attribute or tooltip). On-click → scroll to that family's deep reference row.
  - Right (flex): role description in `text-sm` — what to reach for it for, with a "Don't use for: ..." anti-pattern note where appropriate
- **Rows (in order):** Primary (Teal), Secondary (Sand), Sage, Success (Green), Warning (Amber), Error (Red), Info (Cyan), Accent (Violet) — 8 rows total
- **Visual divider:** `border-b border-sand-200` between rows

---

#### Zone 5: Semantic Surfaces

- **Component:** existing 5-cell card grid (`grid grid-cols-2 sm:grid-cols-5 gap-4`)
- **Position:** Below semantic roles
- **Lead text:** "Named surface tokens for the warm-ground mechanism. `surface-page` (`sand-50`) is never pure white."
- **Cells:** surface-page / surface-primary / surface-secondary / surface-teal / surface-sage (5 cells, existing structure)
- **Treatment update:** swatches shift from `rounded-lg` to `rounded` (4px) — matches new system-wide radius decision
- **Hex labels:** always visible (these are canonical surface hex values, like logo tokens)

---

#### Zone 6: Family Reference Grid

- **Component:** `[NEW COMPONENT: family-reference-grid — 18-family deep reference; one row per family, each row showing all 11 stops at smaller swatch size with hex-on-hover]`
- **Position:** Below semantic surfaces
- **Lead text:** "Every active family at all 11 stops. Use semantic role names (above) in component code; reach for family names only for data viz, illustration, and forthcoming role assignments."
- **Layout per family:**
  - Family name + role hint header: e.g., "Teal — brand primary" / "Orange — terracotta / earth accent" (h3, section-title style)
  - Stop grid: 11 swatches in a `grid-cols-11`, each `h-8` with `rounded-sm` (2px), `bg-{family}-{stop}`
  - Stop number label below each swatch (50/100/200/.../950) in `text-xs text-sand-600`
  - Hover/focus on a swatch → tooltip or `title=` attribute revealing the hex value (e.g., "#3a8478"). Hex computed at runtime from the CSS var so it stays accurate if the palette regenerates.
- **Family order (same as overview strip):** sand, teal, sage, red, amber, green, cyan, orange, yellow, lime, emerald, blue, indigo, violet, purple, fuchsia, pink, rose
- **Density relative to current page:** each family row drops from `h-12` (48px) to `h-8` (32px), saving ~33% vertical space per family × 18 families = significant compression. Hex labels move from caption-below-each-swatch (always visible) to hover-only — saves another ~16px per row.

---

#### Zone 7: Rules & Discipline

- **Component:** `[NEW COMPONENT: rules-list — bulleted list of usage rules with each rule paired with the conform gate that enforces it, where applicable]`
- **Position:** Bottom of page
- **Purpose:** Consolidate the usage discipline currently scattered across inline asterisks, captions, and notes
- **Rules to surface:**
  - Never use `--color-{stone|slate|gray|zinc|neutral}-*` in component code. They're defensive aliases mirroring sand to neutralize Tailwind's cascade trap. *Enforced by `conform:css-family` (One-Family-Per-Role gate).*
  - Use semantic role names (`bg-primary-500`, `text-success-700`) in component code; raw family names (`bg-orange-500`, `bg-rose-200`) are reserved for data visualization, illustration, and future semantic role assignments.
  - When exact logo hex is required, use `--logo-{primary|secondary|anchor-dark|sage}` — not the family palette stop. v2 §1.5 decoupled the two.
  - Contrast pairs are validated by `conform:contrast-pairs` — if a new role mapping fails, surface to brand-fidelity expert.
  - Dark-mode parity is enforced by `conform:token-theme-parity` — every semantic token must have a `.dark` override or be marked theme-invariant.

### Footer Zone

None. This is a documentation partial loaded into a pattern-library page; the parent page provides any footer.

---

## Interaction Specifications

### Click on overview strip cell
- **Trigger:** Click any cell in Zone 2 (System Overview Strip)
- **Feedback:** Cell briefly highlights (`ring-2 ring-primary-500 ring-offset-2` for 200ms)
- **Navigation:** Smooth-scroll to that family's row in Zone 6 (Family Reference Grid)
- **Error handling:** N/A (anchor link; no failure mode)

### Click on semantic-role-row swatch
- **Trigger:** Click any stop swatch in Zone 4 (Semantic Roles)
- **Feedback:** None local; navigation immediate
- **Navigation:** Smooth-scroll to that family's row in Zone 6
- **Error handling:** N/A

### Hover/focus on any swatch (Zones 2, 4, 6)
- **Trigger:** Mouse hover OR keyboard focus on a swatch element
- **Feedback:** Native `title=` attribute reveals hex value (e.g., "Teal 500 · #3a8478"). Alternative: lightweight CSS-only tooltip via `::before/::after` pseudo-elements if `title=` feels too small.
- **Accessibility:** swatches receive `tabindex="0"` to enable keyboard focus. `aria-label` on each (e.g., `aria-label="Teal 500, hex 3a8478"`) for screen reader users.
- **Navigation:** None
- **Error handling:** N/A

### No other interactive elements

The page is reference content. No forms, no toggles, no async actions, no modals.

---

## States

### Default state
The page renders all zones top-to-bottom. No state variation.

### Empty / Loading / Error states
**N/A.** This is static documentation. No data loading; no async behavior; no failure surfaces.

### Print state (optional — defer to wireframe review)
Could be valuable for brand-fidelity reviewers wanting hard-copy reference. Open question — see below.

### Dark mode
Inherits PL standard dark-mode treatment. Every swatch displays its `--color-{family}-{stop}` value, which is the same hex in light/dark (the palette is theme-invariant; only semantic surfaces flip in `.dark` per `semantic.css`). Text labels use `dark:text-sand-300` etc. Card backgrounds use `dark:bg-neutral-900`.

---

## Accessibility Notes

- **Keyboard navigation:** all swatches `tabindex="0"`; visible focus ring via `focus:ring-2 focus:ring-primary-500 focus:ring-offset-2`. Tab order follows visual order (overview strip first, then logo, then roles, then surfaces, then family grid).
- **Screen reader:** each swatch carries `aria-label="{family} {stop}, hex {hex-value}"` computed from `data-` attributes or rendered server-side from the palette source.
- **Color independence:** family identity is communicated by name labels alongside swatches; not color-alone. Role hints in Zone 4 and Zone 6 spell out the semantic intent in text.
- **Contrast:** all label text (`text-sand-600`, `text-sand-700`, etc.) on `surface-page` (`sand-50`) is WCAG AA. `conform:contrast-pairs` enforces.
- **Touch targets:** swatches at `h-8` (32px) are below 44px touch target standard. On mobile, this page is reference content — touch targets aren't the primary constraint, but we should consider tap-friendly cell padding (`p-2` around each cell increases hit area without enlarging visible swatch). Open question — see below.
- **Tooltip behavior:** `title=` attribute is screen-reader-readable but not keyboard-discoverable except via focus. If hex visibility on focus is critical, consider visible-on-focus hex label as well.

## Bilingual Considerations

N/A. This is a developer/designer-facing reference surface; English-only by design. If brand documentation is ever published to a Spanish-speaking audience separately, it lives in different artifacts.

## Open Questions

1. **Print state.** Should the page render usefully when printed? Print-mode CSS could collapse the overview strip + family grid into compact swatch sheets useful for brand-fidelity hardcopy review. Low priority; punt unless someone asks.
2. **Swatch hit-area padding on mobile.** `h-8` swatches in a `grid-cols-11` at mobile width would be tiny (~30px / 11 = ~3px wide each). At `sm` and below, should the family reference grid collapse to 6 stops per row (50/100/300/500/700/950) to maintain usable width? Or stack vertically?
3. **Hex tooltip implementation choice.** Native `title=` attribute is the simplest path but renders inconsistently across browsers and is keyboard-discovery-poor. CSS-only `::before` tooltip is more reliable but adds complexity. Defer to ux-design-review.
4. **Semantic-role-row component naming.** Is this worth promoting to a true PL primitive (e.g., `palette-role-row`), or compose inline? Decision likely depends on whether anywhere else in the PL would reuse this shape. Currently no clear second consumer — favor inline composition unless brand-fidelity disagrees.
5. **Overview strip click-to-scroll.** Smooth-scroll is the proposed interaction; alternative is "navigate-to-anchor" with browser-default jump. Smooth-scroll is friendlier; browser jump is more performant and accessible (URL hash updates). Defer.
6. **System Overview Strip cell count and ordering.** Proposed 18 cells in spec-§2 order. Alternative orderings: hue-wheel order (red → orange → yellow → green → ...), brightness order, semantic-importance order. Spec-§2 order has the virtue of mirroring the canonical source.
7. **Family Reference Grid: should `--logo-*` tokens get their own row in the grid?** Currently they're in Zone 3 (their own section) and not in Zone 6. Could double-list them at the top of the grid for "I'm scanning for the brand-anchor hex" readers. Increases density; risks confusion. Lean toward no.
8. **Should Phase G Pass 2's `badge-{family}` variants be referenced on this page?** The role guide already documents that raw family names are reserved for data viz / illustration / future role assignments. Could add a "see also: badge-{family}" pointer on each family row in Zone 6. Defer to ux-design-review.

---

## New Components Flagged

Three new composition patterns are introduced. None require new PL primitive entries beyond what is reasonable to define:

1. **`palette-overview-strip`** — single-row hue strip in Zone 2. Trivial composition (`flex` of `rounded` divs); could be inline-only OR promoted to a primitive. Decision deferred to haven-mapper.
2. **`semantic-role-row`** — 3-column flex layout (label / 5-stop preview / description) repeated 8 times in Zone 4. Could be inline-only OR promoted to a primitive class `palette-role-row` + `palette-role-row-label` + `palette-role-row-preview` + `palette-role-row-description`. Decision deferred to haven-mapper. Lean: inline unless second consumer appears.
3. **`family-reference-grid`** — per-family row showing all 11 stops with hex-on-hover. Composition of existing grid + swatch primitives. Promote to a primitive class (`palette-swatch` / `palette-swatch-stop` / `palette-swatch-grid`) to standardize the hex-on-hover behavior and `aria-label` generation. Decision deferred to haven-mapper. Lean: yes, promote — the swatch-with-hex-tooltip pattern is reusable enough to warrant a primitive.

haven-mapper will evaluate and gate per its Gap Gate process.

---

## Anti-patterns explicitly excluded

These were considered and rejected:

- **Collapsible / accordion sections.** Per `feedback_show_dont_hide_content.md` — default flat exposition. Readers should not have to interact to discover content. Rejected.
- **Tabs (semantic / family / surfaces).** Same reason. Rejected.
- **Color-picker widget.** This is a reference page, not a tool. Out of scope.
- **Per-family detail subpages.** Adds navigation depth without benefit. Rejected; reference content stays on one page.
- **Search/filter input.** Page is short enough (target: ~3500px after redesign vs current 11669px) that scroll + anchor navigation is sufficient. Rejected.
- **Decorative gradient backgrounds in cards.** Would compete with swatch identity. Rejected.

---

## Density target

Current page: 11669px tall. New page target: under 3500px tall (one ~70% reduction). Achieved by:

- Replacing 18 full-ladder rows (8 semantic-named + 10 expanded-families) with one Family Reference Grid in compact form (Zone 6)
- Adding System Overview Strip as a single-row condensed view (Zone 2) that satisfies the "scan glance" task without scrolling
- Removing duplicated content — semantic-named ladders (Primary, Secondary, Accent) get a 5-stop preview in Zone 4 and the full ladder lives once in Zone 6, not twice
- Smaller swatches (`h-8` vs `h-12`) and tighter radius (`rounded-sm` vs `rounded-lg`)
- Hex labels move from always-visible captions to hover-only tooltips
