# Domain Knowledge

## What "feels like Haven" means

Haven's brand voice is **warm + specific + playful + stress-literate**. Every surface earns its warmth by being specific to the patient's context. Generic positivity reads as inauthentic; observational specificity lands.

### Visual signals that say "this is Haven"

- **Stone + teal + Lora pairing** — warm surface palette with serif-headings-on-sans-body typographic contrast
- **Translucent white panes over stone bg** — layered surface depth without hard edges
- **Page floats** — 3px `stone/150` outer border + `border-radius/md 11px` on the shell container; apps live inside a frame, not edge-to-edge
- **Rich font-feature settings on Inter** — ss01/ss03/ss04/cv01–cv11/dlig/frac enabled; gives the typographic polish
- **Lora for headings** — warmth and humanity in type; Inter alone reads cold
- **Ava's bubble avatar in chat** — distinctive, organic, non-human; marks agent presence
- **Measurement cards on solid white over stone bg** — crisp data hierarchy
- **Coach-mark cards with image top + copy + CTA + close** — reward-forward, earns attention

### Visual signals that say "this is NOT Haven"

- Pure white page background
- Bootstrap/Material default shadows (flat or uniform)
- Sans-only typography stack
- Primary teal on every interactive element (dilutes commitment signal)
- Active nav state as background fill (breaks the weight-only rule)
- FA icons replacing the Ava avatar in chat
- Hard-edged panes without translucency
- Dense-by-default layouts ignoring `data-density`
- Clinical / sterile copy ("Submit," "Are you sure you want to proceed?")

## Voice patterns

### Warm greeting
- Observes a specific action the user took
- Names what's positive about it, briefly
- Leaves the conversational door open
- Sample: *"¡Hola Maria! How are you feeling today? I noticed you logged your weight this morning - great job!"*

### Recommended content titles
- Assertion-framed, not question-framed
- Specific cultural/emotional reference
- Plain language ("Real Talk") over clinical ("Guidance Document")
- Sample: *"Why Your Abuela Was Right About Eating Together"*

### Reward-forward moments
- Reference the specific thing the user achieved
- Use informal register to land emotion
- Sample: *"Your A1C dropped like it's hot"*

### Destructive confirmations
- Repetition as warmth ("absolutely sure")
- Not sterile, not hedged
- Sample: *"Are you sure absolutely sure?"*

### Prompt placeholders
- Invitation, not instruction
- Italic treatment
- Sample: *"You talk. I'll listen."*

## Primary teal discipline

`teal/700 #337a6e` is the primary action color. Reserve it for:
- User commits that change state — "Book my visit," "Schedule Appointment"
- Destructive confirms — "Continue" in a dialog context
- Send actions — "Send" in chat, mic activation

Don't use it for:
- Advancement — "Next" in a multi-step form (use secondary stone)
- Navigation — nav items, breadcrumbs (use weight/muted treatment)
- Informational buttons — "Learn more," "View details" (use tertiary or secondary)

The rule: teal earns its weight by being rare. Overuse kills the commitment signal.

## Haven's surface hierarchy

1. **Page** — `stone/50 #f5eee5` (never white)
2. **Shell container** — outer border `3px stone/150` + `border-radius/md`
3. **Panes** — translucent white over stone (`rgba(255,255,255,0.6)` nav, slightly lower opacity when bg has blob imagery)
4. **Cards** — solid white or `stone/100`, `border-radius/sm` or `md`, no visible shadow at rest
5. **Elevated surfaces** (coach-marks, dialogs, notifications) — `elevation/02` or `elevation/03`, stone-family bg

Shadows are warm-black (`rgba(4,3,1, <opacity>)`) — not pure black — because Haven's visual world is warm.

## Interactive affordances — button hover policy

Haven sets **no default hover** on bare `<button>` elements. Every interactive element classes its own hover register at the canvas-semantic layer (`.btn-*` for the named-tier taxonomy, or a context-specific canvas class like `.chat-chip`, `.pagination-btn`, `.navbar-action-btn`, `.queue-item`). Bare `<button>` is a discipline gap — class it. The historical global `button:hover { background-color: var(--accent-10) }` rule in `defaults.css` was structurally broken (contrast-blind across surface contexts; painted text-only affordances teal on hover) and was removed 2026-06-04 (HVD-04). The Preline `.hs-dropdown-toggle` / `.hs-collapse-toggle` bridges carry a `text-sand-700` floor hover so the bare-trigger case still reads interactive; consumers wrapping them in a button-shaped surface should compose a haven semantic class to override.

Restraint guidance for new canvas-class hovers: text-darken or border-darken first; bg-paint only when discoverability genuinely needs it (committable affordances, listed-item rows where the row IS the click target). The `option-row` / `response-option` / `queue-item` family uses `bg-sand-50` with a darker border for hover; that's the high-bar register. Most chrome / dismissal / utility buttons use text-only or `bg-sand-100`. Match the existing register; don't invent.

## Bordered vs non-bordered button alignment

Every haven button-shaped affordance — `.btn-*`, `.chat-chip`, `.chat-chip.is-soft`, anything whose DOM is a `<button>` — inherits a `border border-transparent` from the global button base in `components.css`. Bordered consumers (`.btn-outline`, `.chat-chip.is-soft`) shift only the border-color, never the border-width. Bounding boxes and text baselines align mathematically in rows of mixed-border buttons; no per-button padding tweak is needed.

The rule for any non-button-element affordance that needs to align next to a button: add `border border-transparent` explicitly. This is haven's canonical solution to the "border eats 1px" problem (HVD-02, 2026-06-04). Aaron has flagged this since his first design system; haven solves it at the base.

## Styled-wrapper semantics — two axes

Visual chrome and interactive contract are two axes, not one.

**Interactive contract** (hard rule): any affordance that accepts interaction must carry **focus-ring + `cursor:pointer`**, regardless of visual chrome. `<button>` carries them via the global button base; any non-button consumer that styles itself as an affordance must add them explicitly.

**Visual register** (vocabulary, not contract):
- **Filled** signals committable preference (`btn-primary`, `chat-chip`)
- **Bordered** signals secondary or soft (`btn-outline`, `chat-chip.is-soft`)
- **Color-only** signals link-register sheet-opening or text-action (`chat-sheet-link`, `text-link`)

**DOM follows function**: navigation uses `<a>`, UI-actions use `<button>` (even when visually link-like — see `chat-sheet-link`'s meta: "sheet-opening is a UI action, not navigation"). Wrapping a `<button>` in link visuals to perform a UI action (open a sheet, focus an input, run a handler) is canonical haven and stays canonical.

Authored as canon HVD-03, 2026-06-04. The register vocabulary is descriptive, not gate-enforceable; the 4-expert panel + `/brand-review` catch register-vocabulary violations at slice time.

## Header-pair pattern

Any record header that carries a primary identifier and a secondary state/status label uses `.header-pair`. Narrow viewports stack (primary above secondary, left-aligned); wide viewports lay them out horizontally with space-between. The breakpoint is sm (640px) — narrow enough that 390px-class phones always stack, wide enough that even compact tablets get the horizontal register. The pattern preserves the **two-register typography** discipline (Lora humanized identifier + uppercase tracking-wider semantic-state) at both layouts — even when stacked, the two registers read as "identifier above state", not as a single chunk. Consumers: `.patient-recall-list-header` (day + pass), and any future record-title + status-pill or queue-heading + count composition. UX-06 canon, 2026-06-04.

## Two-pane consumer-pairing rule

`layout-two-pane-grid` gives both panes the same top edge by design. When pairing a content card (`patient-recall-list`) with a content-flow surface (`chat-thread`) where the chat-thread inset carries top padding for breathing room, the card consumer carries matching top padding so first-content lines align. The grid stays consumer-agnostic; consumers carry their own alignment intent. This is the haven-wide rule: **canvas-level grids never assume consumer responsibility.** Some consumers (dashboard tiles, document shells) want flush-top intentionally — adjusting the grid would break them. HVD-01 canon, 2026-06-04. Pattern: add `lg:pt-6` (or matching offset) to the card consumer; or wrap in a `<div class="lg:pt-6">` at the call site.

## Mobile-canonical patient surfaces — composition over reflow

Mobile-canonical surfaces **compose**. The canvas-semantic primitive (`patient-recall-list`, `chat-thread`) is responsibility-stable across viewports; the **arrangement** swaps — desktop seats it in `layout-two-pane-grid`'s right-pane, mobile seats it in `bottom-sheet-panel` with an **agent-uttered** `chat-sheet-link` trigger. Two-pane is the desktop expression of mobile-first IA, not the canonical layout that reflows down. Pull-to-reveal is not a haven affordance — the `bottom-sheet-handle` signals drag-to-dismiss only; the trigger is conversational (agent says "Tap to view your list"), not chrome. One DOM, viewport-switched via `.patient-recall-mobile-trigger` (mobile-only) + `.patient-recall-desktop-pane` (desktop-only). UX-02 canon, 2026-06-04.
