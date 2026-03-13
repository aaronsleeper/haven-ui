# Haven Design System - Decisions Log

*Track why we made key choices and what we learned*

---

## Decision: Semantic Classes Over Utility Class Soup
**Date:** February 10, 2026
**Context:** Andrey (Angular developer) found utility-heavy HTML difficult to read and integrate.

**Decision:** Use `@apply` to create semantic classes and element defaults in `components.css`. HTML should have minimal/no classes.

**Rationale:**
- Andrey needs readable HTML he can copy/paste into Angular
- Tailwind/Preline are implementation details, not user-facing
- Reduces integration friction between design and development

**What we tried that didn't work:**
- Giving Andrey React components (too much translation work)
- Utility classes directly in HTML (too verbose, hard to read)

**Outcome:** ✅ Working.

---

## Decision: Default Element Styling
**Date:** February 10, 2026
**Context:** Buttons and form elements should "just work" without requiring classes.

**Decision:** Style base HTML elements (`button`, `input[type="text"]`, etc.) directly in `components.css` using `@apply`.

**Rationale:**
- Reduces cognitive load - developers don't need to remember class names
- Enforces consistency - all buttons look the same by default
- Angular-friendly - minimal classes in templates

**Trade-off:** Less flexibility for one-off variations, but variant classes (`.btn-secondary`, `.btn-outline`) can override.

---

## Decision: Color Mappings in haven.css
**Date:** February 10, 2026
**Context:** Need semantic color names (primary, secondary) that map to specific palette colors.

**Decision:** Use `@theme` directive in `haven.css` to alias specific colors:
```css
--color-primary-600: var(--color-teal-600);
--color-secondary-600: var(--color-sand-600);
```

**Rationale:**
- Tailwind v4 CSS-first approach
- Easy to rebrand - change mapping, not every usage
- Keeps components.css readable (`bg-primary-600` not `bg-teal-600`)

**Alternative considered:** Direct color references in components - rejected because harder to rebrand.

---

## Decision: Button Element Rule Should Not Set Size or Color
**Date:** February 11, 2026
**Context:** Building chat interface components. `.btn-icon` and `.category-chip` were being overridden by the base `button` element rule even though class selectors have higher specificity than element selectors.

**Root Cause:** The base `button` rule was setting `py-3 px-4 gap-x-2 bg-primary-600` directly. When Tailwind v4 compiles `@apply` inside an element selector vs a class selector, the output layer ordering can cause the element rule's expanded utilities to appear after the class rule's utilities, effectively reversing expected specificity behavior.

**Decision:** The base `button` element rule should only set truly universal, non-visual defaults:
- `inline-flex items-center`
- `text-sm font-medium`
- `rounded-lg border border-transparent`
- `focus` and `disabled` states
- `cursor-pointer`

Size (`py-*`, `px-*`, `gap-*`) and color (`bg-*`, `text-*`) must live on variant classes only (`.btn-primary`, `.btn-icon`, etc.).

**Rationale:**
- Prevents variant classes from needing defensive resets
- Makes the override pattern predictable
- Matches how Preline itself structures button variants

**Trade-off:** Plain `<button>` elements with no class will have no background color. Acceptable because we want explicit intent on every button.

**Outcome:** ✅ Resolved the `.btn-icon` and `.category-chip` override issues.

**Rule to follow in future prompts:** When adding new button variants, never put size or color on the base `button` element rule. Add them to the variant class.

---

## Decision: Nested Border Radius Reduction
**Date:** February 12, 2026
**Context:** Inner elements sharing the same `rounded-lg` value as their parent containers made nesting visually flat.

**Decision:** Inner elements should use progressively smaller border radii than their parent containers. The hierarchy:

| Component | Radius | Tailwind Class |
|-----------|--------|----------------|
| `.card` | 12px | `rounded-xl` |
| `fieldset` | 8px | `rounded-lg` |
| `.nutrition-list`, `.comparison-column` | 6px | `rounded-md` |
| `.ai-field-zero-callout`, `.ai-field` | 4px | `rounded` |
| Pill badges | full | `rounded-full` (exempt, different visual language) |

**Rationale:** The ideal inner radius equals the outer radius minus the padding between them. At minimum, each nesting level should step down one size. Pill shapes are exempt because they read as a distinct element type.

**Rule to follow in future prompts:** When adding a new component that will be nested inside another, check the parent's border radius and use one step smaller.

**Outcome:** ✅ Applied and visually verified.

---

## Decision: Use !important for Component-Internal Form Element Overrides
**Date:** February 12, 2026
**Context:** Components wrapping form elements needed to strip default styling (border, shadow, ring) set by the global form element rules in `components.css`. Multiple rounds of `@apply` overrides failed due to Tailwind v4 output layer ordering.

**Decision:** When a component needs to override global form element styling, use raw CSS with `!important` rather than `@apply`.

**Applies to:**
- `.prompt-input-container textarea` (border, shadow, ring)
- `.nutrition-input` (border, shadow, ring, padding)
- Any future component that wraps a form element and needs to strip default styling

**Rationale:** `@apply` compiles to utility classes whose layer ordering is determined by Tailwind, not by source order or selector specificity. Raw CSS with `!important` is the only reliable guarantee.

**Rule for future prompts:** When a component wraps a form element and needs to visually suppress its default styling, always use raw CSS properties with `!important`. Do not rely on `@apply` for the override.

---

## Decision: Always-Editable Nutrition Inputs (No Click-to-Edit)
**Date:** February 12, 2026
**Context:** The original spec had nutrition values as display text that converted to inputs on click. This created UI complexity.

**Decision:** Nutrition values are always `<input type="number">` elements styled to look like plain text (`.nutrition-input`). The input shows no border by default, a subtle underline on hover, and a primary-color underline on focus. Number spinners are hidden.

**Rationale:**
- Eliminates the click-to-edit interaction pattern
- Makes it obvious that values are editable without requiring discovery
- Editing a value implicitly confirms it

**Trade-off:** Input may look slightly less clean than display text, but hover/focus styling minimizes this.

---

## Decision: Preline Theme Token Integration
**Date:** February 12, 2026
**Context:** Preline interactive components showed dark teal + brown hover states that clashed with Haven's palette. Per-component `!important` overrides felt brittle.

**Discovery:** Preline v4 has its own theming system with CSS variables (`--primary`, `--sidebar-nav-hover`, etc.) separate from Tailwind's `--color-*` namespace.

**Decision:** Added `:root` and `.dark` blocks in `haven.css` (after the `@theme` block) that map Preline's semantic tokens to the Haven palette. This is Preline's documented approach (https://preline.co/docs/themes.html).

**Tokens mapped:** `--primary-*` scale, `--primary`/hover/focus/active, `--sidebar-*`, `--layer-*` hover states, `--muted-*` hover states, `--destructive-*`.

**Rationale:** Uses the framework's intended extension point. No `!important`, no brittle overrides.

**Trade-offs:** Need to maintain both the Tailwind `@theme` mappings AND the Preline `:root` mappings. If primary changes from teal, update in two places.

---

## Decision: Modal Backdrop Override Uses !important
**Date:** 2026-02-20
**Context:** Preline's `.hs-overlay-backdrop` was fully opaque. Adding `background-color: rgba(0,0,0,0.4)` without `!important` lost the specificity battle.

**Decision:** Used `!important` on the background-color only. `backdrop-filter` did not require it.

**Rationale:** Same pragmatic exception as the `.prompt-input-container` pattern -- when Preline owns the selector, raw CSS with `!important` is the only reliable override.

**Risk:** If Preline updates their backdrop implementation, this could conflict. Revisit if modal backdrop behavior changes after a Preline upgrade.

**Outcome:** ✅ Build succeeded. Backdrop is semi-transparent with blur.

---

## Decision: Dark Mode Pattern for Neutral/Sand Badge Variant
**Date:** 2026-02-19
**Context:** Standardizing dark mode coverage across all `.badge-*` variants.

**Decision:** The `.badge-neutral` dark mode uses solid mid-range values (`dark:bg-neutral-700 dark:border-neutral-600 dark:text-neutral-300`) instead of the `{color}-900/20` opacity pattern used by all other badge variants.

**Rationale:** Sand/neutral at 20% opacity of the 900 shade is nearly invisible on dark surfaces -- the color has insufficient saturation for the opacity trick to produce legible contrast.

**The standard pattern (all other variants):**
`dark:bg-{color}-900/20` / `dark:border-{color}-800` / `dark:text-{color}-400`

**The neutral exception:**
`dark:bg-neutral-700` / `dark:border-neutral-600` / `dark:text-neutral-300`

**Applies to:** Any future component using a neutral/sand/gray color scheme in dark mode. Do not attempt to use the 900/20 opacity pattern for neutral tones.

**Outcome:** ✅ Confirmed legible in dark mode across all badge variants.

---

## Decision: Remap Info Color from Blue to Cyan
**Date:** February 12, 2026
**Context:** `.badge-info` tags used the `info` semantic color mapped to blue, which read as cold and corporate against Haven's warm sand/teal aesthetic.

**Decision:** Remap `--color-info-*` from `--color-blue-*` to `--color-cyan-*` in `haven.css`.

**Rationale:** Cyan is in the same hue family as teal (primary), so it feels cohesive while remaining visually distinct from primary.

**Outcome:** Applied. Affects all `.badge-info`, `.alert-info`, and any other info-colored components.

---

## Decision: File-Based Prompt Handoff
**Date:** February 12, 2026
**Context:** Aaron was manually copying prompts from Claude chat into the IDE agent. Clipboard-middleman step added friction.

**Decision:** Claude writes prompt sequences directly to `.project-docs/prompts/next-task.md`. Aaron opens that file in the code agent via `/build`.

**Workflow:**
1. Aaron describes what needs building (in Claude chat)
2. Claude writes audit/build/verify prompts to `next-task.md`
3. Aaron runs `/build` in Claude Code
4. After completion, Aaron moves file to `prompts/completed/YYYY-MM-DD-topic.md`
5. Debrief happens back in Claude chat

**Outcome:** Adopted. Claude Code confirmed as viable executor (replaced Antigravity).

---

## Decision: Raw CSS Rules Without @apply Silently Dropped by Tailwind v4
**Date:** 2026-02-20
**Context:** `.prose-section` was written as pure raw CSS with no `@apply` directive and disappeared silently from the compiled output.

**Discovery:** In Tailwind v4, the build pipeline can silently drop component rules that have no `@apply` -- nothing to trace through tree-shaking.

**Fix:** Add a no-op `@apply` to any pure-CSS rule in `components.css`:
```css
.prose-section {
    @apply block; /* keeps rule alive through Tailwind v4 tree-shaking */
    max-inline-size: 72ch;
}
```

**Rule:** Any class in `src/styles/tokens/components.css` that uses only raw CSS properties must get `@apply block;` as the first line.

---

## Decision: Sidebar Mobile Visibility (Preline + Tailwind v4)
**Date:** 2026-02-20
**Context:** Using `@apply hidden` or `display:none` on the sidebar for mobile broke Preline's overlay toggle entirely -- Preline cannot animate an element that isn't rendered.

**Correct pattern:**
```css
.app-sidebar {
  @apply -translate-x-full;
}
.app-sidebar.open {
  @apply translate-x-0;
}
@media (min-width: 64rem) {
  .app-sidebar {
    @apply translate-x-0;
  }
}
```

**Never do this:**
```css
.app-sidebar { @apply hidden lg:block; } /* breaks Preline toggle */
```

**Rule for prompts:** Any prompt that creates or modifies a sidebar must reference this pattern. Never use `hidden` for sidebar mobile visibility.

---

## Decision: Preline theme.css Must Be Imported Before haven.css
**Date:** 2026-03-09
**Context:** After migrating to haven-ui, all primary colors rendered as blue despite `haven.css` correctly mapping `--primary-*` to teal. The computed styles panel showed `--primary-50` through `--primary-950` all resolving to `--color-blue-*`.

**Root Cause:** `preline/css/themes/theme.css` was imported after `haven.css` in `main.css`. Preline's theme sets its own `--primary-*` variables to blue. Since CSS cascade is source-order dependent, Preline's values overwrote Haven's overrides.

**Fix:** Move the Preline theme import to before `haven.css` in `main.css`:
```css
/* Correct order */
@import "../../node_modules/preline/css/themes/theme.css"; /* sets Preline defaults */
@import "./haven.css";                                     /* overrides with Haven palette */
@import "./tokens/components.css";
```

**Rule:** Preline's theme.css must always come before haven.css. Haven's `:root` overrides only work if they appear after Preline's defaults in the compiled output.

**Outcome:** ✅ Fixed. Primary color correctly resolves to teal.

---

## Decision: Preline v4 Dropdown Open State Uses 'block' Class, Not 'hs-dropdown-open'
**Date:** 2026-03-09
**Context:** Dropdown on `meal-list.html` was registering with Preline JS and toggling correctly, but the menu remained invisible (opacity: 0) after opening.

**Root Cause:** Preline v4 uses FloatingUI for menu positioning. When a dropdown opens, it:
1. Removes the `hidden` class from the menu
2. Adds the `block` class to the menu
3. Applies `position: fixed` + transform via FloatingUI for positioning
4. Does NOT add `hs-dropdown-open` class to the wrapper element

The Tailwind variant `hs-dropdown-open:opacity-100` (used in Preline's own example markup) only fires if a parent has the literal class `hs-dropdown-open`. Since Preline v4 never adds that class, the variant is dead code in our setup.

**Decision:** Drive dropdown visibility with explicit CSS targeting `.hs-dropdown-menu.block`:
```css
.hs-dropdown-menu {
    opacity: 0;
    transition: opacity 0.15s ease, margin 0.15s ease;
}
.hs-dropdown-menu.block {
    opacity: 1;
}
```

HTML should use clean class names with NO Tailwind transition utilities:
```html
<!-- Correct -->
<div class="hs-dropdown-menu" role="menu">

<!-- Wrong - these classes are inert in Preline v4 -->
<div class="hs-dropdown-menu transition-[opacity,margin] hs-dropdown-open:opacity-100 opacity-0 hidden">
```

**Also confirmed:** The menu must use `hs-dropdown-menu` (not `dropdown-menu`). Preline's autoInit scans for `.hs-dropdown` wrappers and expects to find `.hs-dropdown-menu` inside them.

**Rationale:** Targets the actual class Preline sets, not the one its docs imply. Verified by MutationObserver tracing the exact class mutations during open/close.

**Rule for future prompts:** Any Haven dropdown must use these exact class names:
- Wrapper: `hs-dropdown`
- Toggle: `hs-dropdown-toggle`
- Menu: `hs-dropdown-menu` (no additional Tailwind utilities)
- Items: `hs-dropdown-item`

Do NOT include `hs-dropdown-open:*` variants on the menu -- they will never fire. Visibility is handled by `components.css`.

**Outcome:** ✅ Dropdown opens and closes correctly with opacity transition.

---

## Rule: Never @apply a Semantic Class Inside Another Semantic Class
**Date:** March 2026
**Context:** Task 03 spec wrote `.delivery-status-card { @apply card mx-4; }` as a shorthand. This caused a Vite/Tailwind build error: `Cannot apply unknown utility class 'card'`.

**Rule:** Tailwind's `@apply` can only resolve utility classes from Tailwind's own registry. Custom semantic classes defined in `components.css` (like `.card`) are NOT resolvable by `@apply` inside another class definition.

**Correct pattern:** Inline the constituent `@apply` properties directly. If `.card` is `@apply flex flex-col bg-white border border-gray-200 shadow-2xs rounded-xl dark:...`, then a derived class must repeat those properties, not reference `.card`.

**Outcome:** Fixed by inlining `.card`'s properties into `.delivery-status-card` directly.

---

## Decision: Unified Preference Control System (pref-row)
**Date:** March 2026
**Context:** Patient onboarding preferences screen needed both radio (single-select) and checkbox (multi-select) controls styled as full-width tap targets. The platform default `.radio-label` / `.checkbox-label` classes are shared across provider, kitchen, and care coordinator -- modifying them would have cascading effects.

**Decision:** Introduced a new self-contained class set: `.pref-row`, `.pref-row-indicator`, `.pref-row-indicator--circle` (radio), `.pref-row-indicator--square` (checkbox), `.pref-row-label`. Native inputs are `sr-only`; all visual state is driven by `:has(input:checked)`.

**Design principle established:** Things that function the same should look the same. Circle indicator = single-select (radio). Square indicator = multi-select (checkbox). Both use an inset ring (solid fill + `box-shadow: inset 0 0 0 3px white`) as the selected state signal -- consistent with the `pref-image-card-check` indicator on image cards.

**Scope:** Patient app onboarding only. `.radio-label` and `.checkbox-label` are NOT changed -- they remain the standard for all other apps.

**Candidate for reuse:** Any future profile settings or intake screen that needs large tap-target selection controls should use `.pref-row` rather than adding new variants to the global radio/checkbox classes.

**Outcome:** ✅ Applied to language, contact method, and best times sections of `preferences.html`.

---

## Decision: State-Submitted Hides .mobile-shell, Not main
**Date:** March 2026
**Context:** The feedback screen spec called for hiding `main` and `#feedback-footer` when `state=submitted`. The page has no `<main>` element -- it uses `.mobile-shell` as the top-level content wrapper, with the sticky footer inside it.

**Decision:** `.state-submitted .mobile-shell { display: none; }` hides the entire form + footer in one rule. `.state-submitted .feedback-confirmation { display: flex; }` shows the confirmation.

**Rationale:** Targeting the actual DOM structure beats patching around a missing `<main>`. Both the form content and the sticky footer are children of `.mobile-shell`, so one rule handles both.

**Rule:** In patient app screens, `.mobile-shell` is the content root. Any show/hide state that would target `main` should target `.mobile-shell` instead.

**Outcome:** ✅ Applied. Submitted state works correctly.

---

## Template for Future Decisions

**Decision:** [Name]
**Date:** [Date]
**Context:** [What problem were we solving?]
**Decision:** [What we chose]
**Rationale:** [Why this choice?]
**Trade-offs:** [What did we give up?]
**Outcome:** [Did it work?]
