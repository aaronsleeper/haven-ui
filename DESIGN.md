# DESIGN.md — Haven Design System

The living spec for how Haven looks, feels, and speaks. Read this before starting any UI work. Agent skills (app-composer, ui-react-porter, slice workflows) are required to consult it.

## Status

- **Stage:** in active reconciliation (2026-04-18; Figma-canonicality retired 2026-05-07)
- **Canonical source:** this document + the haven-ui token files (`packages/design-system/src/styles/tokens/`) and pattern library (`packages/design-system/pattern-library/`)
- **Figma:** historical reference. The design system was originally built in Figma; values were copied into haven-ui code. Haven-ui code is now operationally canonical and may diverge from Figma without back-syncing.

This document is the contract. When haven-ui code, cena-health-brand, or any historical Figma artifact disagree, DESIGN.md names which wins and why.

---

## Upstream — authority chain

Haven's brand system has one operational canonical (haven-ui code) plus one downstream-documentation surface (cena-health-brand). Figma is historical.

```
haven-ui code (canonical)   →   cena-health-brand/BRAND.md
this repo + DESIGN.md            OKLCH spec, downstream documentation
```

- **haven-ui code** — this repo. Operational canonical for tokens, components, and brand decisions. Pattern library HTML at `packages/design-system/pattern-library/` (authoritative — "copy, don't generate"). The framework-port pattern (e.g., `packages/ui-react/`) mirrors the pattern library 1:1 via the relevant porter skill. Tokens at `packages/design-system/src/styles/tokens/`. Tokens were originally seeded from Figma; new token decisions land directly here. Measurement tokens stay on haven-ui's 4px Tailwind scalar (see §Measurement).
- **cena-health-brand** — OKLCH brand spec at `Lab/cena-health-brand/`. Documents what shipped in haven-ui rather than driving it. Not a source for implementation.
- **Figma** — historical reference. The design system was originally built in Figma circa early 2026; values were copied into haven-ui code. Haven-ui has since diverged. Treat any reference to Figma in this document as a snapshot of the seed state. New decisions are not back-synced into Figma.

**Rule for new decisions:** taste lives in this document and the haven-ui token files. If you can't find a decision recorded, ask Aaron — don't invent adjacent to the system.

### Figma files (historical reference)

These Figma files were the original source of haven-ui's tokens and component specs. They are no longer actively maintained — haven-ui code is operationally canonical. Reference them only to understand seed-state decisions; do not pull values from them as a current source of truth.

| File | URL | Original use |
|---|---|---|
| Haven — Design System | https://www.figma.com/design/opvzZC7Ds38MNwRFvFuKZe/Haven---Design-System | Tokens, components, type/elevation/color specs |
| temp — screen export | https://www.figma.com/design/NvZceBAZq9uLWTWUY6Teko/temp---screen-export | Screen-level mocks for apps |

The Figma MCP (`mcp__claude_ai_Figma__get_design_context`, `get_variable_defs`, `get_screenshot`) can be used for archaeology — inspecting seed-state decisions when needed. Do not use it to drive new token or component decisions.

---

## Propagation discipline

haven-ui exists so design-system updates propagate to every Cena app when the new code lands — without per-app, per-instance rework. Every architectural choice trades against this goal.

**The principle applies up the compound tree, not just to primitives.** Updating a `Button` style should propagate to all buttons everywhere. Updating the three-panel shell's right pane — its sizing, padding, scroll behavior — should propagate to every app using it. Compound-level updates propagate the same way primitive-level updates do.

**Mechanism (framework-agnostic):**

- Every compound is defined first in the pattern library (`packages/design-system/pattern-library/`) — HTML structure + semantic CSS classes + ARIA / interaction contract. The pattern library is the framework-agnostic spec.
- Each framework target ports the pattern library 1:1: today `packages/ui-react/` mirrors the spec; a future `packages/ui-angular/` or any other port would do the same.
- Consumer apps import compounds via their framework's haven-ui port — never by copying source into app-local files, never by inlining HTML.
- Visual styling lives in semantic classes (`components.css`) and design tokens. CSS variable changes propagate automatically across all ports; pattern-library changes propagate to ports via the `ui-react-porter` skill (and future analogues); port changes propagate to consumer apps when they re-import.

**Carve-outs:**

- **Already-composed app-local code** (JSX, Angular templates, etc.) — once a screen is composed from primitives in an app, structural changes don't propagate unless the screen is rewritten to use a higher-order compound. This is the gravity that drives the compound library forward: every new compound shipped converts a class of app-local composition into propagation-eligible imports.
- **App-local components (CLAUDE.md's narrow inline carve-out)** — single-use shapes that haven't earned a pattern-library spot stay app-local. They lose propagation. The migration path is always toward the PL: when a second consumer needs the same shape, promote it.
- **Inline styles** — `style="..."`, `style={{}}`, scoped `<style>` blocks — forbidden by CLAUDE.md regardless of framework. Listed here for completeness because they break propagation entirely.

**How to apply:**

- When designing a new compound, ask: can apps consume this such that future changes propagate? If the answer is "only if the app re-edits its composition," the compound is wrong.
- Watch for utility soup in app-level code that should be a semantic class — utility soup freezes styling per-instance and breaks propagation.
- When promoting an app-local component to PL, the propagation gain is part of the case for promotion, not an afterthought.

This principle is the reason haven-ui exists. Without it, we'd be writing one-off code per app.

---

## Sources of truth — per axis

| Axis | Source | Translation rule |
|---|---|---|
| Colors (palette, semantic, surface, border, interactive) | **haven-ui tokens** (`colors.css`) | Hexes were originally pulled from Figma variable defs; new color decisions land directly in `packages/design-system/src/styles/tokens/colors.css`. Figma-native names map to haven-ui code names per §Figma-to-code token mapping (historical reference). |
| Border radii | **haven-ui tokens** | Originally seeded from Figma; new decisions land here. Round-down rule was applied when seeding (e.g., Figma 6px → `border-radius/sm` 5px). |
| Elevations / shadows | **haven-ui tokens** | Originally seeded from Figma's 5-level multi-shadow stacks; new decisions land here. |
| Typography (family, weight, scale, tokens) | **Cena brand spec** | Adopt directly: Lora (headings) + Source Sans 3 (body/UI) + Source Code Pro (mono). Per directive 2026-04-27, the Cena brand source is the canonical font-family source; the scale and tokens here remain haven-ui's. |
| Font-feature settings | **this document** | Codified as Tailwind/CSS global defaults on body (see §Typography). Originally pulled from Figma. |
| Iconography | **haven-ui code** | FA Pro v7.1.0 (brand spec's inline-SVG guidance is retired) |
| Spacing / padding / gap / margin / size | **haven-ui code** | Keep existing 4px Tailwind scalar; snap Figma values to nearest 4px utility |
| Voice / copy tone | **Figma mocks + this doc** | Use mock-observed samples as exemplars; codify patterns here |

---

## Brand expression

### Logo

Canonical logo: **Cena Health wordmark** (`logo-cenahealth-teal.svg`).

**Rule:** Cena Health logo appears in the nav header across every app and context. It never changes based on persona, mode, or content. It is the application's brand identity.

- Placement: top of the left nav pane, within the header region (~81px tall)
- Size: ~24px tall × ~131px wide (observed in Figma mock 1-472)
- Variants: `logo-cenahealth-teal.svg` (wordmark + mark), `favicon.svg` (mark only for browser tab)
- Background: translucent-white-on-sand page background

**Do not:** substitute the Ava avatar for the Cena logo in nav. That mode was considered and retired 2026-04-18.

### Color

Haven's palette has three layers: a 9-family tag-semantic palette, a brand palette (teal + sand), and interactive/surface/text/border semantic tokens. All hexes were originally pulled from Figma; haven-ui's `colors.css` is now the canonical source.

#### Figma-to-code token mapping (historical reference)

When values were originally pulled from Figma into haven-ui code, token names were renamed. This table documents the rename mapping for archaeology — it is historical reference only. New decisions land in haven-ui code; the Figma-side names will not be updated as haven-ui evolves.

| Figma name | haven-ui code token | Notes |
|---|---|---|
| `stone/*` (surface) | `sand-*` | **Surface family rename.** Haven-ui's warm-neutral surface family is canonical as `sand`; `stone` survives in palette.css as a hex-literal defensive fallback against Tailwind v4's `@layer theme` cascade override (see [haven-ui CLAUDE.md — Tailwind @theme cascade trap](./CLAUDE.md#framework-usage)), never component-facing. Extended stops `/15 /16 /150 /250` exist in both. |
| `teal/*` | `teal-*` | Name-identical. Brand primary family. |
| `emerald/*`, `cyan/*`, `indigo/*`, `violet/*`, `fuchsia/*`, `rose/*`, `gold/*`, `lime/*` | *(tag tokens pending Figma pull)* | 9-color tag-semantic palette; `/04 /14 /16` stops. See §9-color tag-semantic palette below. |
| `stone/*` (tag-semantic) | *(pending)* | **Distinct from the surface family above.** Figma names both the surface family and the neutral-tag family `stone`; haven-ui will namespace the tag version when Figma tag tokens are pulled (candidate: `tag-neutral-*`). Tracked as open question. |
| `interactive/accent-color` | `--color-accent-interactive` | Semantic singleton. |
| `text/on-light/*`, `text/on-dark/*` | `--color-text-normal` / `-muted` / `-faint` / `-on-dark` | Role-scoped semantic singletons. |
| `border/default`, `border/image` | `--color-border-default`, `--color-border-image` | Role-scoped semantic singletons. |

**Authoring rule:** write haven-ui code-token names inside components, semantic classes, and `@apply` directives. Figma-native names appear in this document only within this mapping table and in `.project-docs/references/figma-north-star.md`.

#### Brand palette

| Token | Hex | Role |
|---|---|---|
| `teal/350` | `#71c0b2` | Illustration highlight, coach-mark banners |
| `teal/700` | `#337a6e` | Primary button fill |
| `teal/750` | `#2d6f64` | Primary button border |
| `teal/800` | `#27655b` | Dark brand accent |
| `interactive/accent-color` | `#418f82` | Selection, progress-filled, form input accent (semantically distinct from button primary) |

#### Surface (sand family)

| Token | Hex | Role |
|---|---|---|
| `sand-50`  | `#fbfaf8` | **Page background** (never white) |
| `sand-100` | `#e6e4e0` | Chrome, appointment cards, grouped rows, response-index bg, secondary-button fill |
| `sand-200` | `#d1cec8` | Surface-raised (elevated panels, coach-mark cards), shell container border |
| `sand-300` | `#bcb8b1` | Border/default, tertiary button border |

Pane backgrounds use translucent white overlays (`rgba(255,255,255,0.6)` nav, `rgba(255,255,255,0.42)` nav on screens with background blobs). Pages are never pure white.

#### Text

| Token | Hex | Role |
|---|---|---|
| `text/on-light/normal` | `#040301` | Body + heading on light bg |
| `text/on-light/muted` | `#52432a` | Secondary text, helper copy |
| `text/on-light/faint` | `#806f56` | Tertiary / placeholder |
| `text/on-dark/default` | `#f5eee5` | Text on dark-teal bg (same hex as `sand-50`) |

#### Border

| Token | Hex | Role |
|---|---|---|
| `border/default` | `#d8cec0` | Pane separator, card border |
| `border/image` | `rgba(4,3,1,0.1)` | Image outline |

#### 9-color tag-semantic palette

Each family uses a 3-stop triple: `/04` text (darkest), `/14` border (mid), `/16` background (lightest).

| Family | `/04` text | Semantic use (suggested, not locked) |
|---|---|---|
| `emerald` | `#004200` | Success, completion, positive trend |
| `cyan` | `#00414f` | Informational |
| `indigo` | `#1b187f` | Neutral-cool, secondary info |
| `violet` | `#3b0375` | Premium, special-status |
| `fuchsia` | `#69001f` | Alert-warm |
| `rose` | `#6b0000` | Error, destructive |
| `gold` | `#571900` | Warning, attention-needed |
| `lime` | `#143b00` | New, in-progress |
| `stone` | `#33251b` | Neutral, default |

**Numbering rule:** higher number = lighter. The `/04 /14 /16` labels are semantic slots in the triple, not arithmetic steps — treat as opaque.

**Palette rule for new contexts:** when a UI needs a colored callout (alert, badge, pill, banner), use the `/04 /14 /16` triple of the matching family. Don't create ad-hoc color combinations.

### Typography

Three fonts. Load in this order.

| Role | Family | Weights |
|---|---|---|
| Headings + Display | **Lora** | 400, 500 (medium), 600 (semibold), italic |
| Body + UI | **Source Sans 3** | 400, 500, 600 (+ Italic, Bold Italic) |
| Mono (code, tabular data) | **Source Code Pro** | 400 |

Type scale (minor-third ratio, 1.2; values in pixels):

| Token | Size | Weight | Line height | Use |
|---|---|---|---|---|
| `Display/01` | 47.78 | Lora Regular | 1.1 | Rare — hero / marketing surfaces |
| `Display/02` | 39.81 | Lora Regular | 1.1 | Large feature headings |
| `Display/03` | 33.18 | Lora Regular | 1.15 | Landing heroes |
| `Heading/01` | 27.65 | Lora Medium | 1.2 | Screen title |
| `Heading/02` | 23.04 | Lora Medium | 1.25 | Section header |
| `Heading/03` | 19.2 | Lora Medium | 1.3 | Sub-section / dialog title |
| `Heading/04` | 16 | Lora Medium | 1.35 | Minor heading |
| `Heading/05` | 13.33 | Lora Semibold | 1.4 | Meta heading |
| `Body/01` | 19.2 | Source Sans 3 Regular | 1.5 | Intro / lede |
| `Body/02` | 16 | Source Sans 3 Regular | 1.5 | Default body |
| `Body/03` | 13.33 | Source Sans 3 Regular | 1.5 | Dense body, dialog body |
| `Body/04` | 11.11 | Source Sans 3 Regular | 1.4 | Meta / fine print, letter-spacing `-1.5` |
| `Button/Large` | 16 | Source Sans 3 Medium | 1.0 | Large CTA label |
| `Button/Medium` | 13.33 | Source Sans 3 Medium | 1.0 | Default button label |
| `Button/Small` | 11.11 | Source Sans 3 Medium | 1.0 | Compact button label |
| `Navigation/Primary` | 13.33 | Source Sans 3 Medium | 1.0 | Top-level nav item |
| `Navigation/Secondary` | 13.33 | Source Sans 3 Regular | 1.4 | Sub-nav item |
| `Input/Comfortable/Label` | 13.33 | Source Sans 3 Medium | 1.4, letter-spacing 0.5 | Form label (default density) |
| `Input/Comfortable/Value` | 16 | Source Sans 3 Regular | 1.4 | Form value |
| `Input/Comfortable/Helper` | 11.11 | Source Sans 3 Regular | 1.0 | Helper text |
| `Input/Compact/Label` | 11.11 | Source Sans 3 Medium | 1.4, letter-spacing 1 | Compact label |
| `Input/Compact/Value` | 16 | Source Sans 3 Regular | 1.4 | Compact value |
| `Utility/Tab` | 13.33 | Source Sans 3 Regular | 1.0, letter-spacing 0.5 | Tab label |
| `Utility/Table Header` | 13.33 | Source Sans 3 Regular | 1.4, letter-spacing 0.5 | Table header |
| `Utility/Badge` | 11.11 | Source Sans 3 Regular | 1.0, letter-spacing 0.5 | Badge |
| `Utility/Timestamp` | 11.11 | Source Sans 3 Regular | 1.4 | Dates / times |
| `Utility/Code` | 13.33 | Source Code Pro Regular | 1.4 | Inline code |
| `Utility/OVERLINE` | 11.11 | Source Sans 3 Semibold | 1.6, letter-spacing 2, UPPERCASE | Section labels |
| `Utility/Metric/Large` | 33.18 | Source Sans 3 Semibold | 1.1 | Measurement value |
| `Utility/Metric/Small` | 19.2 | Source Sans 3 Semibold | 1.1 | Small measurement |

#### Font-feature settings — canonical default

Source Sans 3 + Lora text must enable this feature-settings string. Apply globally on `body`:

```css
font-feature-settings:
  'case' 1, 'cpsp' 1, 'ordn' 1, 'salt' 1,
  'ss01' 1, 'ss03' 1, 'ss04' 1,
  'dlig' 1;
```

Inter-specific character variants (`cv01`–`cv11`) were removed during the 2026-04-27 rename — those codes are not in Source Sans 3's feature table.

These features carry the typographic voice: stylistic alternates (ss01/ss03/ss04), discretionary ligatures, ordinals, case-sensitive forms. Disabling them is a regression.

#### Lora italic — weight bump

When rendering text in Lora italic, bump the weight one step above the surrounding roman context. Lora's design makes italic appear lighter than its roman counterpart at matching weights — the bump preserves visual density.

- Body italic (roman 400) → Lora italic 500
- Medium italic (roman 500) → Lora italic 600
- Semibold italic (roman 600) → Lora italic 700

Only applies to Lora — Source Sans 3 italic doesn't need the bump. When loading Lora italic weights, load the bumped-up set (e.g., if the roman set is 400 + 600, load italic 500 + 700, not 400 + 600). In `components.css` where Lora is in scope, the rule for `em`, `i`, `.italic` sets both `font-style: italic` and the bumped `font-weight`.

##### Fractions — opt-in only

`'frac' 1` is **not** on the body baseline. Source Sans 3's `frac` engine substitutes digits with numerator-style glyphs in digit-adjacent prose (e.g. `Column 1` → `Column ¹`, `grid-2` → `grid-²`), regressing pattern-library text and any UI copy that mentions a numbered column, version, or hyphenated identifier. Patches 70/71/72/73 round-tripped this; the body-baseline removal + opt-in class is the system fix.

For actual fractional strings, wrap them in the `.frac` semantic class:

```html
<span class="frac">1/2 cup</span>
```

The `conform:font-features` gate enforces this — `frac` on `:root` / `html` / `body` is a hard fail.

On long-form body text that needs stable letter spacing, add `'calt' 0` to disable contextual alternates. Observed on assessment question text in mock 1-2172.

### Iconography

**FontAwesome Pro v7.1.0** is the canonical icon system. This overrides cena-health-brand's inline-SVG spec.

- Loaded once at app root via `fontawesome-pro` license
- Preferred style: regular weight outlined; solid for active/selected states
- Size: typically 20px (`size-5`) in buttons, 24px (`size-6`) in nav items
- Opacity: `opacity/muted 0.6` for leading icons; `opacity/faint 0.4` for trailing/disabled

Where Figma mocks show an inline SVG that doesn't exist in FA Pro's library, pick the closest FA Pro icon rather than falling back to SVG. Exception: brand-identity assets (Cena logo, Ava avatar) are bespoke SVG, not icons.

### Density

Adopt `data-density="comfortable|compact"` on a parent container.

- **Default:** `comfortable`
- **Compact:** rendered opt-in, typically in dense tabular views and provider workflows
- **Exposure:** per-user preference in the settings page (persisted)

All density-bearing components (cards, inputs, buttons, list items) vary their padding/gap via the parent `data-density` attribute. Components never bake density in as a prop.

**Build sequence:** comfortable ships first (current state). Compact styling is a retrofit pass after DESIGN.md lands.

### Motion

haven-ui inherits the motion token set from `packages/design-system/src/styles/tokens/motion.css`: 5 durations + 5 easings. `prefers-reduced-motion: reduce` respected via CSS `@media` queries. DESIGN.md does not redefine motion; consult the tokens file for the scale.

### Surface / elevation

Seven surface rungs. Naming follows DESIGN.md §Pages float — pages float above a ground; chrome is the ground; panes layer translucent white on top of pages; cards are primitives above the page; inputs are form primitives above whatever surface they sit on.

| Role | Token | Value | When to use |
|---|---|---|---|
| **chrome** | `--color-surface-chrome` | `sand-100` | Nav, rails, persistent app chrome — the ground below floating pages |
| **page** | `--color-surface-page` | `sand-50` | Main content area that floats above chrome |
| **pane** | `--color-surface-pane` | `rgba(255,255,255,0.6)` | Container surfaces layered translucent over page |
| **card** | `--color-surface-card` | `#ffffff` | Primary card primitive — solid white on page |
| **card-grouped** | `--color-surface-card-grouped` | `sand-100` | Secondary card for grouped-row contexts |
| **raised** | `--color-surface-raised` | `sand-200` | Elevated panels, coach-mark cards |
| **input** | `--color-surface-input` | `#ffffff` | Form primitives (inputs, selects, textareas) — solid white above page |

**Translucent white is reserved for pane (container) role.** Form primitives use solid white even though they also sit "above" the page. Reason: inputs aggregate — a forms page with 15+ inputs at translucent-white would composite into a near-white region, violating the "pages are never pure white" brand-taste rule. Solid white inputs preserve the pane vocabulary and sit cleanly above sand-50.

**Chrome ↔ card-grouped share `sand-100`** by design — the roles address authoring intent (chrome is persistent app structure; card-grouped is transient in-content rows) and never appear adjacent. The `conform:surface-role` gate enforces role-by-annotation, not hex, so the shared hex does not collapse the roles.

Structural enforcement: the `conform:surface-role` gate (`packages/ui-react/tests/conform/surface-role.ts`) asserts every annotated class's background declarations match the allowed token set for its role. Adding a new surface class = add `/* @surface-role: <role> */` annotation; the gate picks it up automatically.

Five elevation stacks. Each is a multi-shadow composition at graduated opacities. Use a single `elevation/*` token per surface — don't compose shadows ad-hoc.

| Token | Stack |
|---|---|
| `elevation/01` | (0,2,2) 4% + (0,3,5) 6% + (0,5,7) 8% + (0,7,11) 8% |
| `elevation/02` | (0,3,5) 4% + (0,7,11) 7% + (0,11,16) 9%,spread 6 + (0,16,24) 5% |
| `elevation/03` | (0,7,11) 5% + (0,16,24) 8% + (0,24,36) 11% + (0,36,54) 6% |
| `elevation/04` | (0,11,16) 5% + (0,24,36) 8% + (0,36,54) 11% + (0,54,122) 6% |
| `elevation/05` | (0,16,24) 6% + (0,36,54) 9% + (0,54,81) 12% + (0,81,122) 7% |

Shadow color: `rgba(4,3,1, <opacity>)` — warm-black derived from `text/on-light/normal`. Not pure black.

---

## Composition patterns

### Canonical shell

Three panes. This is THE shell for every Haven app — coordinator, patient, provider, kitchen. Pane *content* varies by persona; structure does not.

```
┌───────────┬──────────────────────┬────────────────────┐
│  nav      │  center agent chat    │  right content     │
│  (logo,   │  (Ava + messages +    │  (forms, articles, │
│  nav      │   prompt input)       │   details,         │
│  items,   │                       │   assessments,     │
│  user     │                       │   dashboards)      │
│  menu)    │                       │                    │
│           │                       │                    │
│ 260 def   │  flex 480 floor       │  640 def           │
│ 220–320   │  560 comfortable      │  480–800           │
└───────────┴──────────────────────┴────────────────────┘
```

**Existing component:** `agentic-shell.html` in `packages/design-system/pattern-library/components/`. The `three-panel-shell` variant added during slice 2 is retired; queue + thread were content variants of the nav and right panes, not a separate shell.

### Panel widths

| Pane | Default | Min | Max | Resize |
|---|---|---|---|---|
| Left nav (expanded) | 260px | 220px | 320px | User-resizable, persisted per-user |
| Left nav (icon rail) | 80px | 80px | 80px | Toggle only, not free resize |
| Center chat | flex | 480 floor / 560 comfortable | — | Always flexes; never collapses |
| Right content | 640px | 480px | 800px | User-resizable within range |

Sources: Material 3 Navigation Rail + Drawer specs; Apple HIG Sidebars; IBM Carbon; Fluent 2 Drawer S/M/L tier; Baymard + NN/G line-length research. `minmax()` in the grid enforces the floor — when width gets tight, the right pane yields first and the chat never compresses below its floor.

### Resize behavior

Both inter-pane boundaries are drag-to-resize. Use the existing `panel-splitter.html` + `panel-splitter.js` with `data-panel-splitter` / `data-target` / `data-min` / `data-max`. Resize state persists per-user (not per-device).

Content pane in certain layouts (e.g., patient dashboard) may flex-fill the remaining width instead of clamping. This is a per-screen decision driven by the content type. Default is clamped; exceptional layouts declare `data-pane-mode="fill"` on the content wrapper.

### Responsive collapse

Anchored to Material 3 window size classes + Fluent 2 Nav thresholds.

| Viewport | Left nav | Center chat | Right content |
|---|---|---|---|
| ≥1240px | 260 expanded | flex | 640 visible |
| 960–1239px | 260 expanded | flex | 480 collapsible |
| 720–959px | 80 icon rail | flex | inspector sheet on demand |
| <720px | hamburger sheet | full | full-screen sheet on demand |

**Collapse order:** right pane first → left to rail → left to sheet. Center chat is the product; it never collapses.

### Ava presence scope

Ava's avatar (abstract dimensional bubble sculpture — teal/sand/amber with sparkle) appears in:

1. **Chat pane** — 44px at top of center pane as conversation-leading identity
2. **Message dots** — small teal-sparkle leading indicator on Ava-authored messages (distinct bubble-style border around user messages)
3. **Agent-action citations** — when Ava takes an action visible outside the chat (e.g., "Ava updated your care plan"), attribute with her avatar
4. **Agent-generated content attribution** — reserved; use sparingly

Ava's avatar does **not** appear in:

- Nav header (Cena logo only)
- Buttons, icons, UI chrome
- App branding (favicons, titles)

The rule: Ava is the agent. When the agent is doing something or has authored something, mark it with her avatar. When the app itself is speaking, mark it with the Cena logo.

### Measurement translation (Figma → Tailwind)

Figma uses a ~1.5× geometric spacing scale: `3 / 7 / 11 / 16 / 24 / 36 / 54`. Haven-ui stays on the 4px Tailwind utility scale. Implementers snap Figma values to the nearest 4px utility:

| Figma token | Figma value | haven-ui Tailwind | Resolved px |
|---|---|---|---|
| `length/gap/tight` | 3 | `gap-1` | 4 |
| `length/gap/normal` | 7 | `gap-2` | 8 |
| `length/gap/loose` | 16 | `gap-4` | 16 |
| `length/padding/tight` | 7 | `p-2` | 8 |
| `length/padding/snug` | 11 | `p-3` | 12 |
| `length/padding/normal` | 16 | `p-4` | 16 |
| `length/padding/relaxed` | 24 | `p-6` | 24 |
| `length/padding/loose` | 36 | `p-9` | 36 |
| `length/margin/snug` | 16 | `m-4` | 16 |
| `length/margin/normal` | 24 | `m-6` | 24 |
| `length/margin/loose` | 54 | `m-14` | 56 |
| `length/border-radius/xs` | 2 | `rounded-[2px]` | 2 |
| `length/border-radius/sm` | 5 | `rounded-[5px]` | 5 |
| `length/border-radius/md` | 11 | `rounded-[11px]` | 11 |
| `length/border-radius/lg` | 24 | `rounded-[24px]` | 24 |
| `length/border-radius/xl` | 54 | `rounded-[54px]` (pill) | 54 |

**Round-down rule:** when Figma shows a value between two existing tokens, use the smaller. One pixel closer to Figma isn't worth adding a new token.

---

## Component archetypes

Every component in `packages/design-system/pattern-library/components/` (HTML, authoritative) and its React port in `packages/ui-react/src/components/` should express these archetypes. Variations are specializations, not divergences.

### Button

One component, three priorities.

| Priority | Fill | Border | Label color |
|---|---|---|---|
| Primary | `teal/700` | `teal/750` | white |
| Secondary | `sand-100` | `border/default` | `text/on-light/normal` |
| Tertiary | transparent | `sand-300` | `text/on-light/normal` |

- Height 36px (`interactive/min-height/in-input`)
- Padding 11px horizontal, 7px gap
- Border-radius 5px (`border-radius/sm`)
- Label type: `Button/Small` (11.11 Source Sans 3 Semibold, letter-spacing 0.1389)
- Leading icon 20px, `opacity/muted 0.6`

**Brand-taste rule:** primary teal is reserved for **user commitments that change state** — "Book my visit," "Schedule Appointment," "Continue" in a destructive dialog, "Send" in chat. Advancement through forms (Next) and navigation (Previous) is *secondary*, not primary. The teal earns its weight by being used sparingly.

Pill-shape variant (`border-radius/xl 54px`) is used for chat input send/mic — round treatment signals "speech-adjacent" rather than "commit." Don't pill-shape advance/commit buttons.

### Card — canonical radius

Card-archetype surfaces use `border-radius/md` (11px). This includes every named card type in this spec — Ava recommended-content card, user chat bubble, floating tip / coach-mark card, notification-center panel, command-palette panel, toast, data-table wrapper, accordion container, prompt-input container, file-upload dropzone, and every `.*-card` semantic class in `components.css`. Media thumbnails 96×96 or larger use `border-radius/lg` (24px) to preserve imagery warmth. Dialogs use `border-radius/sm` (5px) — see §Dialog.

**Pill (`border-radius/xl` 54px) is reserved exclusively for chat-input send/mic button primitives**, per §Button brand-taste rule. Container surfaces, list rows, and content cards do NOT pill-shape. In practice, legitimate circle/stadium surfaces (avatars, toggles, badges) use `rounded-full`; `rounded-xl` (54px) should appear only on `.prompt-toolbar`-class send/mic controls.

This rule is enforced structurally by the `conform:radius-pill` gate (`packages/ui-react/tests/conform/radius-pill.ts`): any `rounded-xl` / `rounded-[54px]` / `var(--radius-xl)` / `border-radius: 54px` in `components.css` fails the gate. Patch 19 (2026-04-22) swept 23 legacy drift sites to `rounded-md` and 2 media sites to `rounded-lg`; the gate prevents the drift class from returning.

### Dialog

White bg, 1px `border/default`, `border-radius/sm` (5px), 24px padding.

- Title: `Heading/03` (Lora Medium 19.2)
- Body: `Body/03` (Source Sans 3 Regular 13.33)
- Buttons right-aligned: tertiary (Cancel) + primary (destructive/commit action)
- No close icon, no dividers, no header bar
- Uses `elevation/02` or `elevation/03` depending on modality

Voice sample: *"Are you sure absolutely sure?"* — playful repetition keeps tone warm in destructive moments. This is deliberate voice, not a typo. See §Voice.

### Tag

Meta/status pill. Nine color families (see §Color — 9-color tag-semantic palette).

- Min-height 24px, padding 3×7
- Border-radius 11px (`border-radius/md`)
- Label type: 11.11 Source Sans 3 Semibold, letter-spacing 0.1389
- Leading icon 20px (optional)
- Close icon 12px, `opacity/muted 0.6` (when removeable)
- `mix-blend-multiply` on text and icons against the `/16` bg for subtle tint layering

### Input response option

Pattern for numbered multi-choice responses (e.g., GAD-7 scale, Likert items).

- 325px max width (`length/size/13`)
- Index square: 36px × 36px, `border-radius/xs 2px`
  - Unselected: `sand-100` bg + numeric index
  - Selected: `interactive/accent-color` bg + index (white)
- Response label: 13.33 Source Sans 3 Semibold, letter-spacing 0.1666
- Check icon: 24px on selected, hidden on unselected (opacity 0)
- Border: `border/image` 1px unselected, `interactive/accent-color` 1px selected

Group uses progress-bar pagination below the question (bars equal to question count, `interactive/accent-color` filled for completed, `sand-500` for remaining — raised from `sand-15` pre-Patch-8 to clear 3:1 vs white per WCAG 1.4.11).

### Chat message patterns

Two variants based on author.

| Author | Structure |
|---|---|
| Ava | Dot-sparkle leading indicator (teal + sand) at 16px + plain `Body/02` text, no bubble |
| User | Bordered container with `border/default`, 16px padding vertical / 7px horizontal, `border-radius/md`, `Body/02` text |

Inline recommended-content cards appear within the Ava column: 42px image thumbnail + `Body/02 Semibold` title + `Body/03 muted` subtitle, `sand-50` bg + `sand-200` border + `border-radius/md` + 16px padding.

### Prompt input

Chat-pane bottom. `border/default`, `border-radius/md`, white bg, two rows:

1. Text area (min 51px, padded). Placeholder italic `text/on-light/faint`. Sample: *"You talk. I'll listen."*
2. Action row: language toggle + image attach + mic (primary pill, teal/700) + send (secondary pill, sand-100). All pill buttons are `border-radius/xl 54px`.

### Coach-mark / tap-in card

Small floating card with `elevation/03`, `sand-100` bg, `border/default`, `border-radius/md`, 191px width.

- Feature image at top (`teal/350` bg with border)
- Copy: `Body/03 Semibold` headline + `Body/04 muted` supporting line
- Primary button CTA
- Close button top-right (20px sand circle)

Voice sample: *"Your A1C dropped like it's hot"* — playful, reward-forward, earns the moment.

---

## Voice

Haven's voice is **warm + specific + playful + stress-literate**. Every line earns its warmth by being specific to the patient's context.

### Samples from the mocks

| Surface | Copy | Why it works |
|---|---|---|
| Ava greeting | *"¡Hola Maria! How are you feeling today? I noticed you logged your weight this morning - great job!"* | Bilingual, specific action observed, positive reinforcement without fluff |
| Recommended content | *"Why Your Abuela Was Right About Eating Together"* | Culturally specific, assertion-framed (not question-framed), connects past to present |
| Recommended content | *"Managing Diabetes During the Holidays: A Real Talk Guide"* | Plain language, stress-literate, non-clinical ("Real Talk") |
| Tap-in card | *"Your A1C dropped like it's hot"* | Playful, reward-forward, breaks clinical register to land emotion |
| Dialog | *"Are you sure absolutely sure?"* | Repetition as warmth; prevents accidents without sterility |
| Prompt placeholder | *"You talk. I'll listen."* | Italic, inviting, positions Ava as listener not interrogator |

### Brand-taste rules

- **Primary teal is for commitments, not advancement.** Primary button fill reserved for "Book my visit," "Schedule," destructive confirms. `Next` buttons are secondary.
- **Active nav state = Source Sans 3 Bold, not background color.** Weight change carries the signal; color stays consistent with the rest of the nav.
- **Pages are never pure white.** Page bg is `sand-50`. Panes layer translucent white on top.
- **Pages float.** The outermost shell has a 3px `sand-200` border + `border-radius/md 11px` — apps live inside a containing frame, not edge-to-edge. Chrome (nav, rails) sits at `sand-100` as the ground below the floating page (`sand-50`). Panes layer translucent white on top of pages. Inputs layer solid white on top of whatever surface they sit on — the translucent stack is reserved for container surfaces.
- **Logo is chrome; Ava is agent.** Don't mix the two.
- **Warmth is observational, not performative.** Specific details land; generic positivity doesn't.

---

## Deltas from cena-health-brand

cena-health-brand/BRAND.md is currently stale. The following items are known deltas; reconciliation backports these to the brand spec (see `Remaining` in the plan).

| Delta | cena-health-brand says | haven-ui ships | Resolution |
|---|---|---|---|
| Icon system | inline SVG, 24×24, specific stroke rules | FA Pro v7.1.0 | Brand spec updates to FA Pro |
| Color step labels | implicit 50–950 | `/04 /14 /16` Figma labels | Brand spec updates labels |
| Color hexes (teal interactive) | teal-400 = interactive | `teal/700 #337a6e` | Brand spec updates |
| Typography fonts | Lora + Source Sans 3 + Source Code Pro (per directive 2026-04-27) | Lora + Source Sans 3 + Source Code Pro | Aligned 2026-04-27 — brand spec is canonical |
| Dummy data | Maria Rivera (DOB 1958, MRN PT-2024-0847) | Slice 1 used Maria Garcia; Figma mocks use María González / Maria Rivera | Use Maria Rivera per `dummy-copy.md` |

---

## Slice workflow

Every slice follows the per-slice QA protocol (`../planning/ux-workflow.md`). A 4-expert review panel reviews each slice before merge:

1. **Pattern-library steward** — token discipline, no utility soup, component reuse
2. **Information architecture** — structure, handoff, gates
3. **Accessibility** — WCAG 2.1 AA floor + focus management
4. **Brand fidelity** (new) — "does this feel like Haven" — voice, visual hierarchy, design-system voice

Expert definition for brand fidelity: `planning/experts/brand-fidelity/`.

Slice-opening checklist:

- [ ] Read this DESIGN.md
- [ ] (optional, historical) Load relevant Figma frames via MCP if researching seed-state decisions — do not treat what you find as canonical
- [ ] Identify which existing components apply (haven-ui has 139 built components)
- [ ] Name the delta between Figma and existing components, if any
- [ ] Score the slice against all 4 expert dimensions before shipping

---

## Open questions

Living list. Closed via DESIGN.md updates (not by silent consensus).

- **Per-app nav categories** — the mock shows patient-app nav (Dashboard / Messages / My Health / Meals / Appointments / Documents / Billing). What's the coordinator / provider / kitchen nav? Pull Figma frames when those apps are in scope.
- **Coach-mark placement rules** — the "Tap in" card in 1-472 floats absolute-positioned. When does a coach-mark fire, and what governs dismissal?
- **Data visualization** — no charts observed yet. Likely needed for patient progress, provider dashboards. Deferred.
- **Login / auth flow** — `1-1345` frame exists but not yet pulled.
- **Care-plan / appointments content patterns** — Figma frames 1-1831 and 1-1499 exceeded pull limits; pull in chunks when a slice needs them.

---

## Change log

| Date | Change | Author |
|---|---|---|
| 2026-05-07 | Figma-canonicality retired. Updated §Status, §Upstream, §Figma files, §Sources of truth, §Color intro, §Figma-to-code token mapping intro, and the slice-opening checklist to reflect haven-ui code as operationally canonical. Figma reframed as historical reference / archaeology — values were originally seeded from Figma, but new decisions land in haven-ui code (token files + this document) and are not back-synced. cena-health-brand remains downstream documentation. Per Aaron's directive 2026-05-06 ("Figma is no longer a canonical source of truth for anything"). | Claude (session with Aaron) |
| 2026-04-20 | Nomenclature reconciliation: surface family renamed `stone/*` → `sand-*` throughout §Color, §Surface, and in-body references. Added §Figma-to-code token mapping. Tag-semantic `stone` family (§9-color tag-semantic palette) preserved pending Figma tag-token pull. Patch 11 / slice-1 debt item 7. | Token Steward + Registry Steward |
| 2026-04-18 | Initial DESIGN.md from census + Figma pulls (shell 1-472, design-system tokens, button, dialog, tag, assessments). Reconciliation direction: Figma canonical per-axis; haven-ui keeps measurement tokens on 4px scalar. | Claude (session with Aaron) |
