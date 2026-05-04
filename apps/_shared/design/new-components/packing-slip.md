# New Component: Packing Slip

**Gate approval:** Gate 2-prep #6 (new-component category confirmed), Stage 2-review (brand-fidelity concerns noted inline), Aaron pre-approved gap gate before Stage 3.
**Tier:** 1 — Novel primitive, no decomposition path, brand-fidelity-weighted
**4-expert panel:** Required at PL-fragment authoring time (Stage 5 prep)
**App home:** Kitchen (archived at `archive/inactive-apps/kitchen/`); spec lives in `_shared/` until restoration

---

## Purpose

The canonical kitchen view of a single patient order. Every time Carlos opens an order in the left pane, the center pane renders this component. Provides patient first name + last initial, delivery address, delivery window, allergen flags (safety-critical prominence), meal contents list, and optional delivery instructions.

**Structural constraint:** This component MUST NOT display clinical data — no full last name, no MRN, no SSN, no diagnosis, no insurance. Data scope is structurally limited at the API layer; the component surface enforces this visually (no field where clinical data would render).

**Safety-critical:** Allergen flags must be visually impossible to miss when scanning the slip from 24" away in a busy kitchen environment.

---

## Used In

- `apps/_shared/design/wireframes/kitchen/kt-01-orders-with-packing-slip.md` — center pane of every open order view
- `apps/_shared/design/wireframes/kitchen/shell-kt-kitchen.md` — referenced as the default center-pane content when an order is selected

Recurring across every kitchen order at v1. Structural primitive, not an inline carve-out.

---

## Preline Base

None — Haven-native implementation. No Preline component maps to this pattern. Pure Tailwind + semantic classes.

---

## Proposed Semantic Classes

- `.packing-slip` — container / envelope
- `.packing-slip-header` — patient identity + address + delivery window block
- `.packing-slip-allergens` — allergen flags row
- `.packing-slip-allergen-flag` — individual allergen pill
- `.packing-slip-meals` — meal contents vertical list
- `.packing-slip-meal` — individual meal row within the list
- `.packing-slip-instructions` — optional delivery instructions block

---

## HTML Structure

```html
<article class="packing-slip" aria-label="Packing slip — Maria R.">

  <!-- Header: identity + logistics -->
  <div class="packing-slip-header">
    <span class="packing-slip-patient">For: Maria R.</span>
    <address class="packing-slip-address">
      123 Main St, Apt 4B<br>
      San Francisco, CA 94103
    </address>
    <span class="packing-slip-window">
      <i class="fa-regular fa-clock" aria-hidden="true"></i>
      Delivery: 11:00 AM – 1:00 PM
    </span>
  </div>

  <!-- Allergen flags: safety-critical, always rendered if present, never hidden -->
  <div class="packing-slip-allergens" role="list" aria-label="Allergen restrictions">
    <span class="packing-slip-allergen-flag" role="listitem">
      <i class="fa-solid fa-triangle-exclamation" aria-hidden="true"></i>
      NUT-FREE
    </span>
    <!-- Multi-restriction: combined single pill -->
    <!-- <span class="packing-slip-allergen-flag" role="listitem">
      <i class="fa-solid fa-triangle-exclamation" aria-hidden="true"></i>
      GLUTEN-FREE + DAIRY-FREE
    </span> -->
  </div>

  <!-- Meal contents list -->
  <ul class="packing-slip-meals" aria-label="Meal contents">
    <li class="packing-slip-meal">
      <span class="packing-slip-meal-name">Grilled salmon with roasted vegetables</span>
      <span class="packing-slip-meal-notes">Single portion · Recipe R-0447</span>
    </li>
    <li class="packing-slip-meal">
      <span class="packing-slip-meal-name">Mediterranean grain bowl</span>
      <span class="packing-slip-meal-notes">Single portion · Recipe R-0211</span>
    </li>
    <li class="packing-slip-meal">
      <span class="packing-slip-meal-name">Fresh fruit cup</span>
      <span class="packing-slip-meal-notes">Single portion · Recipe R-0089</span>
    </li>
  </ul>

  <!-- Optional delivery instructions (agent-populated) -->
  <div class="packing-slip-instructions" aria-label="Delivery instructions">
    Leave with doorman if no answer.
  </div>

</article>
```

---

## @apply Definition

```css
/* ================================================================
   PACKING SLIP — Kitchen order per-patient view
   Safety-critical: allergen flags must scan from 24" away.
   Brand: restraint-driven; patient identity warm without PHI.
   ================================================================ */

.packing-slip {
    @apply rounded-[11px] p-6 space-y-5;
    background-color: var(--color-sand-100);
    border: 1px solid var(--color-sand-200);
    /* elevation/02 per DESIGN.md §Surface */
    box-shadow:
        0 3px 5px rgba(4,3,1,0.04),
        0 7px 11px rgba(4,3,1,0.07),
        0 11px 16px rgba(4,3,1,0.09),
        0 16px 24px rgba(4,3,1,0.05);
}

.packing-slip-header {
    @apply flex flex-col gap-1;
}

.packing-slip-patient {
    /* Lora Heading/02 — 23.04px Lora Medium per DESIGN.md §Typography */
    font-family: var(--font-serif);
    font-weight: var(--font-weight-medium);
    font-size: 1.44rem;  /* 23.04px */
    line-height: 1.25;
    color: var(--color-sand-900);
    @apply dark:text-sand-100;
}

.packing-slip-address {
    @apply text-base text-sand-700 not-italic leading-snug;
    @apply dark:text-sand-300;
}

.packing-slip-window {
    @apply flex items-center gap-1.5 text-base font-semibold text-sand-800;
    @apply dark:text-sand-200;
}

/* Allergen section — the safety-critical surface.
   Flex wrap so multiple flags stack gracefully.
   Border-top separator from header; generous vertical padding. */
.packing-slip-allergens {
    @apply flex flex-wrap gap-2;
    @apply pt-4;
    border-top: 1px solid var(--color-sand-200);
    @apply dark:border-sand-600;
}

/* Each allergen flag: large pill (32px+ tall), rose family per DESIGN.md §9-color tag-semantic.
   Must scan from 24" away — bold uppercase, strong color contrast. */
.packing-slip-allergen-flag {
    @apply inline-flex items-center gap-1.5 px-3 font-semibold uppercase tracking-wider rounded-[11px];
    min-height: 32px;
    font-size: 0.778rem;  /* 12.44px — smaller than Body but large for a pill */
    letter-spacing: 0.08em;
    /* rose /04 text + /14 border + /16 bg per DESIGN.md §9-color tag-semantic palette */
    background-color: var(--color-rose-16, #fff0f0);
    border: 1px solid var(--color-rose-14, #fca5a5);
    color: var(--color-rose-04, #6b0000);
    @apply dark:bg-rose-900/20 dark:border-rose-800 dark:text-rose-400;
}

/* Meal contents: clean vertical list, generous line-height for scan.
   No border-radius or card nesting — the packing-slip envelope is the container. */
.packing-slip-meals {
    @apply list-none space-y-3;
    @apply pt-4;
    border-top: 1px solid var(--color-sand-200);
    @apply dark:border-sand-600;
}

.packing-slip-meal {
    @apply flex flex-col gap-0.5;
}

.packing-slip-meal-name {
    /* Body/02 Semibold per DESIGN.md §Typography — 16px Source Sans 3 Semibold */
    @apply text-base font-semibold text-sand-900;
    @apply dark:text-sand-100;
}

.packing-slip-meal-notes {
    /* Body/04 muted — 11.11px Source Sans 3, meta / fine print */
    @apply text-[0.694rem] text-sand-600 tabular-nums;
    @apply dark:text-sand-400;
}

/* Optional delivery instructions block */
.packing-slip-instructions {
    @apply pt-4 text-sm text-sand-600 italic leading-normal;
    border-top: 1px solid var(--color-sand-200);
    @apply dark:text-sand-400 dark:border-sand-600;
}
```

---

## Variants

- **Default:** single allergen (e.g., "⚠ NUT-FREE") — one flag pill
- **Multi-restriction:** combined pill ("⚠ GLUTEN-FREE + DAIRY-FREE") or side-by-side separate pills (design decision at 4-expert panel — prefer combined for scan speed when ≤2 restrictions; separate stacked when ≥3)
- **No allergens:** `.packing-slip-allergens` section renders empty or is conditionally hidden — if hidden, remove the `border-top` separator; do NOT render an empty allergen row (false reassurance risk)
- **No instructions:** `.packing-slip-instructions` is conditionally hidden

> Decision for 4-expert panel: whether "no allergens" should render a positive "No restrictions" confirmation or simply hide the section. Safety argument for explicit confirmation; restraint argument for hiding. Flag for IA and Brand Fidelity experts.

---

## States

- **Default:** slip loaded; all sections visible
- **Loading:** skeleton version — `skeleton` for header block + `skeleton` for allergen row + 3× `skeleton-text` for meal rows (kitchen component-map specifies this)
- **Allergen-hold:** persistent `alert-warning` injected above the allergen section in center pane (not inside the slip component itself — the slip shows the flags; the hold banner is shell-level context). "Dispatch" button in right pane disabled. Not a packing-slip state variant — keep the component clean.
- **Print mode (deferred v1.1):** no interactive state; a future `@media print` stylesheet would adjust `box-shadow`, `background-color`, and ensure allergen flags render in color (not grayed out by browser print defaults)

---

## Dark Mode

**Mandatory.** Haven supports dark mode via `dark:` Tailwind variants. Defined above inline in `@apply` definitions. Summary:

- Container: `dark:bg-sand-800` (or `dark:bg-neutral-700`) — the sand-100 background; avoid opacity pattern for neutral/warm tones per skill guidance
- Container border: `dark:border-sand-600`
- Patient name: `dark:text-sand-100`
- Address + window: `dark:text-sand-300` / `dark:text-sand-200`
- Section separators: `dark:border-sand-600`
- Allergen flag: `dark:bg-rose-900/20 dark:border-rose-800 dark:text-rose-400` — the 900/20 opacity pattern IS correct for the rose family (colored variant, not neutral)
- Meal name: `dark:text-sand-100`
- Meal notes: `dark:text-sand-400`
- Instructions: `dark:text-sand-400 dark:border-sand-600`

> Flag for 4-expert panel: allergen flag dark mode. The `dark:bg-rose-900/20` treatment follows the skill's "colored variant" pattern, but allergen flags are safety-critical — confirm the dark mode contrast achieves WCAG AAA (not just AA) for the rose family text on rose-900/20 background. May need `dark:bg-rose-900/40` for sufficient contrast.

---

## Responsive Behavior

- Kitchen is desktop-primary + tablet (≥768px); mobile not in scope at v1
- `packing-slip` is a fixed-max-width content pane component — it fills the center `panel-chat` pane
- At 720–959px (icon-rail nav + right pane as inspector sheet): center pane expands; slip fills available width with `max-w-[640px] mx-auto` to avoid the slip becoming uncomfortably wide
- Allergen flags always flex-wrap; never truncate or collapse on narrow widths

---

## Accessibility

- Root `<article>` with `aria-label="Packing slip — {patient_first_name} {last_initial}"` — names the context for screen-reader landmark navigation
- Allergen flags section: `role="list"` + `aria-label="Allergen restrictions"` — list semantics for screen readers; each flag is `role="listitem"`
- `fa-triangle-exclamation` icon: `aria-hidden="true"` — the text label carries the accessible meaning (UPPERCASE constraint label)
- Allergen flags read in correct order: allergen section announces FIRST in DOM order — screen reader hears allergen before meals (safety-critical ordering matches visual hierarchy)
- Meal list: `<ul>` with `aria-label="Meal contents"` — semantic list; each item is `<li>`
- `<address>` element for delivery address — semantic HTML for mailing-address context
- WCAG contrast: allergen flag text (`rose/04 = #6b0000`) on `rose/16` background must achieve AA minimum; confirm AAA for safety-critical use at 4-expert panel
- Large-text mode: component is text-based; scales naturally with font-size increase

---

## Pattern Library

- [ ] Component file needed: `packages/design-system/pattern-library/components/packing-slip.html`
- [ ] `@component-meta` header with: name, category (Kitchen), all 7 semantic classes, variants, preline: false, safety-critical note
- [ ] `COMPONENT-INDEX.md` row needed — add under new "Kitchen-Specific" section or adjacent to "Meal Assignment Grid" section
- [ ] Semantic classes added to `packages/design-system/src/styles/tokens/components.css`
- [ ] 4-expert panel review on the PL fragment before proceeding to React port
- [ ] React port via `ui-react-porter` skill → `packages/ui-react/src/components/PackingSlip.tsx`

---

## Priority

**Required for launch** — blocking for kitchen app at v1. No utility fallback is acceptable because:
- Allergen prominence is safety-critical; ad-hoc utilities risk producing a visually insufficiently prominent flag
- Patient PHI discipline (first-name-only rule) needs semantic class enforcement visible in code review
- Component recurs on every order view (47 orders/day in worked example)

**Build sequence:** Author PL fragment → 4-expert panel → components.css → COMPONENT-INDEX → React port → kitchen app composition (after `git mv archive/inactive-apps/kitchen apps/kitchen`)
