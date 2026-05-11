# New Component Spec: `option-row`

**Date:** 2026-05-08
**Tier:** 1 — Novel primitive (PL fragment + components.css class set + COMPONENT-INDEX entry; brand-fidelity-weighted → 4-expert panel required)
**Priority:** Required for launch (blocks `thread-question-card` PL fragment + downstream React port + first consumer-app slice)
**App:** Multi-app shared primitive (Care Coordinator, Provider, Kitchen, Patient)
**Wireframes:**
- `apps/_shared/design/wireframes/agentic-question.md` (driving)
**Component map:**
- `apps/_shared/design/component-map-agentic-question.md`
**Gate references:**
- Gate 2 approved 2026-05-08 (Aaron); 13-component scope locked
- Gap-gate approved 2026-05-08 (Aaron); per-component spec authoring authorized
- Steward verdict 2026-05-08 (verbatim in wireframe `## Open Questions § Resolved`): keep `response-option` assessment-only; new `option-row` primitive for thread-question-card. Shared bone is Radix `<button role="radio">` + `aria-checked`; everything else differs because response-option carries assessment-specific assumptions (numbered index, 325px max-width, single-text label, single-select-only).

---

## Purpose

A selectable option row with a bold title, supporting description, optional inline `(Recommended)` badge slot, and a triple-cued selection state (ring + filled glyph + check icon). Single-select (`role="radio"`) and multi-select (`role="checkbox"`) variants share one structural primitive. A sub-primitive variant `.is-other` adds a reveal-on-select textarea for free-text answers.

This is the option-row used inside the agentic-question pattern's option zone (`option-row-list` slot inside `thread-question-card`). It is NOT response-option — that's assessment-only (PHQ-9, GAD-7) and stays unchanged. The two share the Radix radio semantics and nothing visual.

The pattern's success state: a user reads the option title in 1–2s, scans the description in 2–3s, and recognizes the recommended option without color-only cues.

---

## Used In

- `thread-question-card` (driving consumer; all 5 wireframe variants — single-select, multi-select, master-detail desktop, mobile bottom-sheet, mobile sequential bottom-sheets). Composed inside `option-row-list` (radiogroup/group slot).

Future consumers will require steward review before reuse — this primitive is shaped for the thread-card context. If a third surface emerges with the same shape and divergent decoration, promote a shared base under judgment-framework "used 3+ times in one app" — not now.

---

## Preline Base

**None.** Pure Tailwind + semantic-class implementation. Selection state is React/JSX-driven via `aria-checked` toggle; roving tabindex is consumer-side state (handled by `option-row-list` slot inside `thread-question-card`).

`role="radio"` and `role="checkbox"` are WAI-ARIA Radio Group + Checkbox patterns (W3C WAI-ARIA APG); not Preline behavior.

---

## New Classes Required

| Class | Type | Notes |
|-------|------|-------|
| `.option-row` | Primitive base | Outer `<button>` element; bold title + description + selection glyph + (Recommended) badge slot |
| `.option-row-glyph` | Sub-element | Selection circle (radio) or square (checkbox); filled-on-select |
| `.option-row-content` | Sub-element | Vertical stack of title + description |
| `.option-row-title` | Sub-element | Body/02 16px font-semibold sand-900 |
| `.option-row-recommended` | Sub-element (slot) | Inline `.badge.badge-sm` adjacent to title; "Recommended" label |
| `.option-row-description` | Sub-element | Body/03 14px sand-700 |
| `.option-row-check` | Sub-element | Check-icon; opacity 0 → 1 on `[aria-checked="true"]` |
| `.option-row.is-other` | Variant | Final-position option with reveal-on-select textarea |
| `.option-row-other-textarea` | Sub-element | Inline textarea revealed in `.is-other` variant when selected; collapses on deselect |
| `.option-row.is-tablet-dense` | Modifier (kitchen tablet override) | Raises `--option-row-min-height` from 44px to 48px for gloved-hand context. Steward call: this modifier vs per-app token override. |
| `.option-row-list` | Container slot | Provides `role="radiogroup"` (single) or `role="group"` (multi) wrapper. Default: lives as a slot inside `thread-question-card`; not a standalone PL entry unless second carrier emerges. |

**Custom CSS variable:**

| Variable | Default | Purpose |
|---|---|---|
| `--option-row-min-height` | `2.75rem` (44px) | Touch-target floor; modifier `is-tablet-dense` raises to `3rem` (48px) |

**Existing classes reused (no changes needed):**

- `.badge` + `.badge-info` + `.badge-sm` — for the `(Recommended)` inline badge (Round 1 brand verdict 2026-05-11: `badge-info` preserves teal as the commit-signal token; the recommendation is an informational signal from the agent, not a commit-state cue)
- `.btn-loading` + `.btn-spinner` — N/A for option-row itself; consumer-app Submit button uses these on commit

**Existing tokens reused:**

- Selection ring: `--color-accent-interactive` (matches response-option precedent at line 10444)
- Hover border: `--color-sand-600` (clears WCAG 1.4.11 against sand-50 hover-fill at 3.82:1; Round 1 a11y verdict 2026-05-11 corrected response-option's sand-500 precedent which was measured against white default surface and computes 2.81:1 against sand-50; Round 2 recomputed actual ratio from palette.css hex literals)
- Glyph border: `--color-sand-600` (same WCAG 1.4.11 reasoning as hover border — the glyph's outer edge sits against the row's hover fill when hovered)
- Focus ring: `--color-primary-600` (matches response-option's `:focus-visible` at line 10440)
- Title text: `--color-text-normal` / `text-sand-900`
- Description text: `--color-sand-700`
- Disabled opacity: `0.6`

---

## HTML Structure

### Single-select (`role="radio"`)

```html
<button
  type="button"
  class="option-row"
  role="radio"
  aria-checked="false"
  tabindex="0"
  data-option-id="opt-1"
>
  <span class="option-row-glyph" aria-hidden="true"></span>
  <span class="option-row-content">
    <span class="option-row-title">
      Match to existing referral
      <span class="badge badge-info badge-sm option-row-recommended">Recommended</span>
    </span>
    <span class="option-row-description">
      Aaron Sleeper from BHN — same patient, same provider, last seen 3 days ago.
    </span>
  </span>
  <i class="fa-solid fa-check option-row-check" aria-hidden="true"></i>
</button>
```

**Selected state (single-select):**

```html
<button class="option-row" role="radio" aria-checked="true" tabindex="0">
  <!-- same structure; visual changes applied via [aria-checked="true"] selector -->
</button>
```

### Multi-select (`role="checkbox"`)

```html
<button
  type="button"
  class="option-row"
  role="checkbox"
  aria-checked="false"
  tabindex="0"
  data-option-id="opt-1"
>
  <span class="option-row-glyph" aria-hidden="true"></span>
  <span class="option-row-content">
    <span class="option-row-title">Cilantro</span>
    <span class="option-row-description">Substitute with parsley if unavailable.</span>
  </span>
  <i class="fa-solid fa-check option-row-check" aria-hidden="true"></i>
</button>
```

ARIA verdict: `role="checkbox"` is locked (NOT `aria-pressed`). `option-row-list` is a structured group of selectable options; `role="checkbox"` is the WAI-ARIA-canonical multi-select-from-a-group pattern. `aria-pressed` is the toggle-button pattern (used elsewhere in `chat-tag-group` for free-form chip clouds — different shape).

### `.is-other` variant (collapsed)

```html
<button
  type="button"
  class="option-row is-other"
  role="radio"
  aria-checked="false"
  tabindex="0"
  data-option-id="other"
  aria-expanded="false"
  aria-controls="opt-other-textarea-[id]"
>
  <span class="option-row-glyph" aria-hidden="true"></span>
  <span class="option-row-content">
    <span class="option-row-title">Other</span>
    <span class="option-row-description">Type a different answer</span>
  </span>
  <i class="fa-solid fa-check option-row-check" aria-hidden="true"></i>
</button>
```

### `.is-other` variant (selected; textarea revealed)

```html
<div class="option-row-other-wrapper">
  <button
    type="button"
    class="option-row is-other"
    role="radio"
    aria-checked="true"
    tabindex="0"
    aria-expanded="true"
    aria-controls="opt-other-textarea-[id]"
  >
    <span class="option-row-glyph" aria-hidden="true"></span>
    <span class="option-row-content">
      <span class="option-row-title">Other</span>
      <span class="option-row-description">Type a different answer</span>
    </span>
    <i class="fa-solid fa-check option-row-check" aria-hidden="true"></i>
  </button>
  <label class="sr-only" for="opt-other-textarea-[id]">Tell us what fits better</label>
  <textarea
    id="opt-other-textarea-[id]"
    class="option-row-other-textarea"
    rows="3"
    placeholder="Tell us what fits better."
    aria-required="true"
  ></textarea>
</div>
```

**Reveal behavior:** focus moves to the textarea on reveal. Per gov.uk Accessibility Blog ("Conditionally revealed questions"): single-input conditional reveals perform well; complex reveals fail testing — so a single textarea is the right shape. Deselecting `.is-other` collapses the textarea; content is preserved in consumer-app local state but not committed. Re-selecting restores the textarea content.

**Bilingual placeholder:** Spanish — `placeholder="Cuéntanos qué se ajusta mejor."`; description copy `"Escribe otra respuesta"`. (Per wireframe Bilingual Considerations.)

### List container (slot inside `thread-question-card`)

```html
<!-- Single-select -->
<div
  class="option-row-list"
  role="radiogroup"
  aria-labelledby="thread-question-card-prompt-[id]"
>
  <!-- option-row × N, with .is-other always last -->
</div>

<!-- Multi-select -->
<div
  class="option-row-list"
  role="group"
  aria-labelledby="thread-question-card-prompt-[id]"
>
  <!-- option-row × N -->
</div>
```

---

## CSS Definition (`components.css` additions)

```css
/* ============================================================
   option-row
   Tier 1 novel primitive — shared by all variants of
   thread-question-card. NOT response-option (assessment-only
   per steward verdict 2026-05-08).
   Wireframe source: agentic-question.md
   ============================================================ */

.option-row {
    --option-row-min-height: 2.75rem; /* 44px touch-target floor */

    @apply flex items-start gap-3 w-full px-3 py-2 rounded-[5px] bg-surface-card text-left cursor-pointer transition-colors duration-100;
    min-height: var(--option-row-min-height);
    border: 1px solid var(--color-border-image);
}

/* Hover — sand-600 border on sand-50 hover-fill (3.82:1) per WCAG 1.4.11.
   Note: response-option Patch 8 cited sand-500 at 3.42:1 measured
   against WHITE (default state). The relevant state for 1.4.11 is
   hover, where the row's fill is sand-50 — sand-500 on sand-50
   computes 2.81:1 (fail). Bumped to sand-600 per Round 1 a11y
   verdict 2026-05-11 (Round 2 recomputed: 3.82:1; comfortable
   headroom over 3.0). Pale fill so hover reads as "considering";
   selected reads as "committed" via teal border. */
.option-row:hover {
    @apply bg-sand-50;
    border-color: var(--color-sand-600);
}

@media (prefers-reduced-motion: reduce) {
    .option-row {
        transition: none;
    }
}

.option-row:focus-visible {
    @apply outline-none ring-2 ring-primary-600;
}

.option-row[aria-checked="true"] {
    border-color: var(--color-accent-interactive);
}

.option-row[aria-disabled="true"],
.option-row:disabled {
    @apply opacity-60 cursor-not-allowed;
}

/* Tablet-dense modifier — kitchen gloved-hand context.
   Steward call at PL authoring whether this lives as a class
   here or as a per-app --option-row-min-height token override. */
.option-row.is-tablet-dense {
    --option-row-min-height: 3rem; /* 48px */
}

/* ----------------------------------------------------------
   option-row-glyph — selection circle (radio) or square (checkbox)
   Triple-cued selection state #1: filled glyph.
   ---------------------------------------------------------- */

.option-row-glyph {
    @apply flex items-center justify-center shrink-0 w-5 h-5 mt-0.5;
    /* sand-600 (not sand-500) to clear WCAG 1.4.11 against sand-50
       row-hover fill (3.82:1); see hover-state note above. */
    border: 2px solid var(--color-sand-600);
    background-color: var(--color-surface-card);
    transition: background-color var(--duration-fast) var(--ease-default),
                border-color var(--duration-fast) var(--ease-default);
}

/* Radio — circle */
.option-row[role="radio"] .option-row-glyph {
    @apply rounded-full;
}

/* Checkbox — rounded square */
.option-row[role="checkbox"] .option-row-glyph {
    @apply rounded-[3px];
}

.option-row[aria-checked="true"] .option-row-glyph {
    border-color: var(--color-accent-interactive);
    background-color: var(--color-accent-interactive);
}

@media (prefers-reduced-motion: reduce) {
    .option-row-glyph {
        transition: none;
    }
}

/* ----------------------------------------------------------
   option-row-content — vertical stack of title + description
   ---------------------------------------------------------- */

.option-row-content {
    @apply flex flex-col gap-0.5 flex-1 min-w-0;
}

/* Title — Body/02 16px Source Sans 3 font-semibold sand-900.
   Wraps to support inline (Recommended) badge slot.
   items-center (not items-baseline) so a small uppercase pill badge
   aligns visually with the title text x-height rather than hanging
   off the baseline. Round 1 brand-fidelity verdict 2026-05-11. */
.option-row-title {
    @apply flex flex-wrap items-center gap-2 text-body-02 font-semibold;
    color: var(--color-text-normal);
}

/* .option-row-recommended is a semantic-hook class only — no CSS rule.
   Visual styling is composed via .badge.badge-info.badge-sm on the slot
   element (informational tone per Round 1 brand verdict 2026-05-11;
   preserves teal as the commit-signal token). Class retained in HTML
   for semantic clarity, JS/test selectors, and future scoped overrides. */

/* Description — Body/03 14px sand-700.
   1–3 sentences expected; line-height tuned for compact two-line max. */
.option-row-description {
    @apply text-body-03 leading-snug;
    color: var(--color-sand-700);
}

/* ----------------------------------------------------------
   option-row-check — check-icon, fade in on select
   Triple-cued selection state #2: visible check icon.
   (#3 — ring — is the [aria-checked] border treatment above.)
   ---------------------------------------------------------- */

.option-row-check {
    @apply text-lg opacity-0 shrink-0 mt-0.5;
    color: var(--color-accent-interactive);
    transition: opacity var(--duration-fast) var(--ease-default);
}

.option-row[aria-checked="true"] .option-row-check {
    @apply opacity-100;
}

@media (prefers-reduced-motion: reduce) {
    .option-row-check {
        transition: none;
    }
}

/* ----------------------------------------------------------
   option-row.is-other — final option with reveal-on-select textarea
   Tier 1 sub-primitive variant. No PL precedent for reveal-on-select
   interaction; load-bearing for the agentic-question pattern.
   ---------------------------------------------------------- */

.option-row-other-wrapper {
    @apply flex flex-col gap-2;
}

.option-row-other-textarea {
    @apply w-full min-h-[2.75rem] px-3 py-2 rounded-[5px] text-body-03;
    background-color: var(--color-surface-card);
    color: var(--color-text-normal);
    border: 1px solid var(--color-border-image);
    resize: vertical;
}

.option-row-other-textarea::placeholder {
    color: var(--color-sand-500);
}

.option-row-other-textarea:focus-visible {
    @apply outline-none ring-2 ring-primary-600;
    border-color: var(--color-accent-interactive);
}

/* ----------------------------------------------------------
   option-row-list — container slot
   role="radiogroup" (single-select) or role="group" (multi-select).
   Default: lives as a slot inside thread-question-card, no standalone
   PL entry. Steward call at PL authoring whether to extract.
   ---------------------------------------------------------- */

.option-row-list {
    @apply flex flex-col gap-2;
}

/* ----------------------------------------------------------
   Dark mode
   All color properties redeclared — no implicit inheritance.
   ---------------------------------------------------------- */

.dark .option-row {
    background-color: var(--color-sand-900);
    border-color: var(--color-sand-700);
}

.dark .option-row:hover {
    background-color: var(--color-sand-800);
    border-color: var(--color-sand-500);
}

.dark .option-row[aria-checked="true"] {
    border-color: var(--color-accent-interactive);
}

.dark .option-row-glyph {
    background-color: var(--color-sand-900);
    border-color: var(--color-sand-500);
}

.dark .option-row[aria-checked="true"] .option-row-glyph {
    background-color: var(--color-accent-interactive);
    border-color: var(--color-accent-interactive);
}

.dark .option-row-title {
    color: var(--color-sand-100);
}

.dark .option-row-description {
    color: var(--color-sand-300);
}

.dark .option-row-check {
    color: var(--color-accent-interactive);
}

.dark .option-row-other-textarea {
    background-color: var(--color-sand-900);
    border-color: var(--color-sand-700);
    color: var(--color-sand-100);
}

.dark .option-row-other-textarea::placeholder {
    color: var(--color-sand-500);
}
```

---

## Variants

### Single-select (default)
- Root: `<button role="radio" aria-checked="false">`
- Selected via `aria-checked="true"`
- Glyph: circle (`rounded-full`)
- Used in: Variant 1, Variant 3 (master-detail desktop), Variant 4 (mobile bottom-sheet), Variant 5 (mobile sequential)

### Multi-select
- Root: `<button role="checkbox" aria-checked="false">`
- Toggled via `aria-checked` flip
- Glyph: rounded square (`rounded-[3px]`)
- Used in: Variant 2

### `.is-other` (final-position; reveal-on-select textarea)
- Always last in `option-row-list`
- Same selection glyph + title slot; description copy: "Type a different answer" (Spanish: "Escribe otra respuesta")
- On selection: inline textarea reveals below option-row; focus moves to textarea
- Description copy stays visible (collapses to caption above textarea)
- `aria-expanded` toggled on the button; `aria-controls` references the textarea
- Submit affordance (consumer-app concern): enabled only when textarea has non-whitespace content
- Used in: every variant with an "Other" option (1, 2, 3 if applicable, 4, 5)

### `.is-tablet-dense`
- Modifier; raises `--option-row-min-height` from 44px to 48px
- Kitchen tablet gloved-hand context
- Steward call at PL authoring: modifier-on-primitive vs per-app token override (`--option-row-min-height` set at app shell level for kitchen)

### Disabled state
- `aria-disabled="true"` or `disabled` attribute
- Opacity 0.6 + cursor-not-allowed
- Edge case: agent provides an option that should display but not be selectable (rare; not a primary use case)

---

## Data Bindings

| Element | Binding |
|---|---|
| `data-option-id` | Stable option identifier from agent payload — used for selection-tracking, telemetry, and `aria-controls` anchoring |
| `option-row-title` text | `option.title` (agent-authored) |
| `option-row-description` text | `option.description` (agent-authored, optional) |
| `.option-row-recommended` slot | Conditional render when `option.recommended === true` (single-select: at most one option marked) |
| `aria-checked` | `selectedIds.includes(option.id)` (single: 0–1 checked; multi: 0–N checked) |
| `tabindex` | Roving — `0` for the focused/last-focused option; `-1` for all others (managed by `option-row-list` consumer) |
| `aria-expanded` (`.is-other` only) | `aria-checked === "true"` (true iff "Other" is selected) |
| Other textarea content | Controlled via consumer-app local state; preserved across deselect/reselect cycles |
| `aria-disabled` | `option.disabled === true` (rare; defensive) |

**Pin-priority / allowlist note:** option-row carries no thread-renderer-policy. The wireframe-flagged pin-priority + `agent_question` allowlist work happens in the consuming app's thread renderer + `thread-question-card`, not in option-row. (See component-map "Cross-primitive scope".)

---

## Accessibility Notes

- **Roles:** `role="radio"` (single-select) or `role="checkbox"` (multi-select) on the `<button>` element. Both per W3C WAI-ARIA APG. NOT `aria-pressed` (that's the toggle-button pattern).
- **`aria-checked`:** state on every option; `false` default, `true` on select. SR announces "checked"/"not checked" automatically.
- **`aria-labelledby`:** the parent `option-row-list` references the question-card's prompt body heading. Each option-row's accessible name comes from its title text (in DOM, not via `aria-labelledby` — title content is naturally exposed).
- **Roving tabindex:** the option-row-list consumer maintains exactly one option-row with `tabindex="0"` at any time (the focused or last-focused option); all others get `tabindex="-1"`. Tab enters/exits the group as a single stop. This is consumer-side state, not a primitive concern. Reference: WAI-ARIA APG Radio Group Pattern (cited in wireframe Accessibility Notes).
- **Arrow keys:** within a radiogroup, arrow keys move focus AND check (single-select). Within a multi-select group, arrow keys move focus only; Space toggles. Consumer-side keyboard handler.
- **Initial focus on card mount:** first checked option-row, otherwise the first option-row (per WAI-ARIA APG Radio Group). Consumer-side responsibility.
- **Triple-cued selection** (per WCAG 1.4.1):
  1. Filled glyph (color independent — shape change)
  2. Visible check icon (color independent — icon presence)
  3. Border ring color shift to `accent-interactive` (color cue, reinforced by 1+2)
- **`.is-other` reveal:**
  - Focus moves to the textarea on reveal (gov.uk Accessibility Blog "Conditionally revealed questions" — single-input reveals are reliably testable).
  - `aria-expanded` on the button + `aria-controls` linking to the textarea — SR announces "expanded"/"collapsed".
  - `<label class="sr-only">` for the textarea — required for SC 1.3.1 (info and relationships).
  - Empty textarea on Submit attempt: Submit stays disabled (consumer-side); affordance is self-evident — no error message needed.
- **Touch targets:** `--option-row-min-height: 2.75rem` (44px) at primitive level. `.is-tablet-dense` raises to 48px for kitchen.
- **Color-independence for `(Recommended)` badge:** text label "Recommended" is the canonical signal; color is reinforcement. The wireframe explicitly notes: does NOT rely on color alone.
- **Reduced motion:** `transition: none` on `.option-row`, `.option-row-glyph`, `.option-row-check` under `(prefers-reduced-motion: reduce)`. Selection state still applies — only the transition is suppressed.
- **Screen reader announcement on focus:** consumer-side script announces option title + description + "Recommended" if applicable. The DOM structure makes title and description naturally accessible without `aria-label`.
- **Consumer Space-key handling (consumer responsibility):** the WAI-ARIA APG specifies Space toggles a `role="radio"`/`role="checkbox"` button. Native `<button>` elements also activate on Space. The consumer keydown handler MUST call `preventDefault()` on Space to avoid double-fire (browser native activation + ARIA toggle). Round 1 a11y verdict 2026-05-11.
- **Bottom-sheet focus-trap (consumer responsibility):** Variant 4 (mobile bottom-sheet) consumer surface must trap focus inside the sheet for the duration of the question. Primitive provides the role/aria scaffolding only; trap behavior is consumer-side via Preline's `data-hs-overlay` or equivalent. Round 1 a11y verdict 2026-05-11.
- **List-length threshold:** lists of more than 6 options trigger steward review for `.is-other` reveal direction (compression vs vertical scroll vs sequential reveal). The primitive does not enforce a cap — judgment is exercised at composition time. See wireframe §Option Zone and `thread-question-card.md` § Used In.

---

## 4-Expert Panel Scope

Required before PL fragment ships (Tier 1, brand-fidelity-weighted per `Lab/haven-ui/CLAUDE.md` § Slice authoring — wireframe-driven, PL-first).

| Expert | Focus areas |
|---|---|
| **Pattern-library steward** | Net-new primitive vs response-option (verdict already in hand 2026-05-08; confirm at PL authoring); class vocabulary (option-row-* sub-classes); `.is-other` as variant-modifier vs sibling primitive; `.is-tablet-dense` as primitive modifier vs per-app token override; `--option-row-min-height` custom property naming + scope; option-row-list slot vs standalone PL entry decision; `@apply` cleanliness; whether the `(Recommended)` slot warrants its own utility class beyond inline `.badge-sm` usage. |
| **Information architecture** | Title + description scan order (title-first read; description as supporting context, not gate); inline `(Recommended)` slot placement (after title vs before vs separate row); selection glyph as left-or-right (default left, matching response-option); check-icon-on-right vs glyph-only (this primitive has both — confirm dual-cue isn't redundant); `.is-other` reveal direction (in-place expansion default; lists >6 trigger steward review per wireframe). |
| **Accessibility** | `role="radio"` vs `role="checkbox"` distinction (WAI-ARIA APG canonical); `aria-checked` true/false (NOT `aria-pressed`); `aria-expanded` + `aria-controls` for `.is-other`; roving tabindex semantics (consumer-side; primitive must not interfere with `tabindex` overrides); reveal-on-select textarea focus-move (gov.uk pattern); 44px / 48px touch-target floors; triple-cued selection state (color-independence); `<label class="sr-only">` on textarea; reduced-motion handling; screen-reader cadence for title + description + (Recommended); contrast pairs: sand-700 description on sand-50 hover, sand-900 title on sand-50 hover, accent-interactive border on sand-50, accent-interactive check on sand-50. |
| **Brand fidelity** | Restraint check — option-row is high-frequency; visual weight should support scan-and-commit not Brand-decoration; sand-50 hover fill (matches response-option Patch 8 brand verdict); accent-interactive teal as commit-signal (consistent with response-option, btn-primary); description Body/03 weight (don't over-soften vs title); inline `(Recommended)` badge tone (sand-tone vs primary-tone — defer to badge-sm precedent); `.is-other` description copy "Type a different answer" / "Escribe otra respuesta" (Cena voice — utilitarian without being terse). |

---

## PL Authoring Checklist

Before this spec feeds the build (dev-tasker handoff):

- [ ] 4-expert panel review complete (all four verdicts ship or iterate-then-ship)
- [ ] `packages/design-system/pattern-library/components/option-row.html` created with `@component-meta` header; includes single-select, multi-select, with-recommendation, `.is-other` collapsed, `.is-other` expanded, disabled, and `.is-tablet-dense` examples
- [ ] New classes added to `packages/design-system/src/styles/tokens/components.css` per CSS definition above
- [ ] `packages/design-system/pattern-library/COMPONENT-INDEX.md` row for `option-row` added under appropriate category (likely "Forms" or new "Thread / Agent" row given primitive's home in the question pattern)
- [ ] `pnpm --filter @haven/design-system dev` renders the option-row variants at http://localhost:5173/pattern-library/components/option-row.html
- [ ] `conform:contrast-pairs` passes: sand-700 on sand-50 (≥7:1 AA Large), sand-900 on sand-50 (≥7:1 AA Body), accent-interactive border on sand-50 (≥3:1 SC 1.4.11), accent-interactive check icon on sand-50
- [ ] Reduced-motion verified: hover and selection still register; transitions suppressed
- [ ] Dark mode verified: all color properties in `.dark` block render at ≥ WCAG AA contrast
- [ ] `.is-other` reveal verified: focus moves to textarea on select; collapses on deselect; content preserved across re-selection (consumer-app pattern, demonstrate in PL with vanilla JS)
- [ ] Visual feel-test of (Recommended) badge co-existence with `ai-insight-callout` recommendation register (deferred-to-PL-authoring item from wireframe)
- [ ] `ui-react-porter` skill: port `<OptionRow />` 1:1 from PL HTML; `registry.json` entry; variant-matrix Storybook stories (single-select, multi-select, with-recommendation, is-other-collapsed, is-other-expanded, is-tablet-dense, disabled)
- [ ] `conform:manifest`, `conform:css-family`, `conform:brand-fonts`, `conform:wireframe-shell` all pass on patch
- [ ] `conform:visual` Storybook diffs baseline-locked (when CI bootstrap lands per Patch 8b)

---

## Build Sequencing Note

`option-row` MUST ship before `thread-question-card` — the card's PL fragment composes option-row instances inside its `option-row-list` slot. Recommended sequence (matches component-map Phase 1):

1. **option-row PL fragment + CSS + COMPONENT-INDEX update** (this spec; pattern-library-only task)
2. **4-expert panel for option-row**
3. **thread-question-card PL fragment** (separate spec; composes option-row)
4. **4-expert panel for thread-question-card** (option-row already approved)
5. **`ui-react-porter` skill: `<OptionRow />` then `<ThreadQuestionCard />` ports** (mechanical 1:1; skip 4-expert panel — review happened at PL fragment level)
6. **First consumer-app slice** (Tier 2 composition; uses ported components)

The `.is-other` reveal interaction is the highest-risk Tier 1 element in this spec — reveal-on-select has no PL precedent. Plan for at least one design-review iteration cycle after the initial PL fragment renders.
