# Haven Design System - Prompts Library

*Successful prompt patterns and lessons learned*

> **Path convention:** All file paths in this library use the haven-ui repo root as base.
> - Styles: `src/styles/tokens/components.css`
> - Partials: `src/partials/`
> - Scripts (env): `src/scripts/env/`
> - Scripts (components): `src/scripts/components/`
> - Apps: `apps/{provider,kitchen,patient,care-coordinator}/`
> - Pattern Library: `pattern-library/`

---

## Pattern: Preline v4 Dropdown Markup
**Tags:** #preline #dropdown #components
**Success Rate:** ✅ Verified 2026-03-09
**Last Used:** 2026-03-09

**Context:** Preline v4 uses FloatingUI internally. Its dropdown open/close behavior differs from docs and from v2/v3. The `hs-dropdown-open:*` Tailwind variants shown in Preline's own HTML examples are dead code in our setup because Preline never adds `hs-dropdown-open` to the wrapper element. Instead it adds `block` to the menu.

**Always use this markup — nothing more, nothing less:**
```html
<div class="hs-dropdown relative inline-flex">
  <button type="button" class="hs-dropdown-toggle btn-outline">
    Label <i class="fa-solid fa-chevron-down text-xs"></i>
  </button>
  <div class="hs-dropdown-menu" role="menu">
    <a class="hs-dropdown-item" href="#">Option 1</a>
    <a class="hs-dropdown-item" href="#">Option 2</a>
  </div>
</div>
```

**Required CSS (already in components.css — do not remove):**
```css
.hs-dropdown-menu {
    /* base styles via @apply */
    opacity: 0;
    transition: opacity 0.15s ease, margin 0.15s ease;
}
.hs-dropdown-menu.block {
    opacity: 1; /* Preline adds 'block' when open */
}
```

**Hallucination triggers to avoid:**
- Do NOT add `transition-[opacity,margin]` to the menu div
- Do NOT add `hs-dropdown-open:opacity-100` to the menu div
- Do NOT add `opacity-0` to the menu div
- Do NOT add `hidden` to the menu div
- Do NOT add a CDN `<script>` tag for Preline (it's loaded via `src/scripts/main.js`)

**Diagnosis pattern if dropdown appears registered but not visible:**
1. Check `window.$hsDropdownCollection.length` — if 0, Preline didn't find `hs-dropdown`
2. Check menu has `hs-dropdown-menu` class (not `dropdown-menu`)
3. After clicking toggle, check if menu has `block` class and `position: fixed` style
4. If `block` is present but menu invisible, something is overriding `opacity: 1` — check for lingering `opacity-0` utility class on the menu element

---

## Pattern: Semantic Defaults Implementation
**Tags:** #defaults #semantic-classes #core-pattern
**Success Rate:** ✅ High
**Last Used:** February 10, 2026

**Context:** Adding default styling to HTML elements so they work without classes.

**Prompt Sequence:**

### Prompt 1: Add Element Defaults
```
In src/styles/tokens/components.css, update the [ELEMENT] section to provide
default styling for ALL [elements], not just classes.

Replace the current section with:

[Provide complete CSS using @apply]
```

**Key Details:**
- Always specify full path with `src/styles/tokens/` prefix
- Provide complete replacement code, not just snippets
- Use `@apply` with Tailwind utility classes
- Include all states (hover, focus, disabled, dark mode)

### Prompt 2: Rebuild and Verify
```
Run npm run dev from the repo root.

Then open [path to HTML file] in a browser and verify:
- [Checklist of what should work]

Report back what works and what doesn't.
```

**What Made This Work:**
- Sequential prompts in same thread (agent retained context)
- Each prompt had one clear task
- Verification step caught issues early

---

## Pattern: Audit Before Build
**Tags:** #hallucination-prevention #workflow
**Success Rate:** ✅ High

**Prompt Template:**
```
Audit all HTML files in [directory] to identify:
1. [What we're looking for]
2. [Specific patterns]
3. [Common usage]

Format findings as:
## [Category]
- [Finding 1]
- [Finding 2]

Only report what actually exists - don't invent or suggest.
```

**Why This Works:**
- Prevents agent from hallucinating components that don't exist
- Grounds build prompts in reality
- Shows actual usage patterns, not idealized ones

**When to Use:**
- Before building new semantic classes
- Before creating component wrappers
- When unsure what's already implemented

---

## Pattern: Incremental Semantic Class Addition
**Tags:** #semantic-classes #workflow #core-pattern
**Success Rate:** ✅ High (10/10 prompts, zero corrections)
**Last Used:** February 12, 2026

**Context:** Adding multiple new semantic class groups to components.css, then building a page that uses them.

**Structure:**
1. Audit prompt (list what exists, report only)
2. One prompt per semantic class group (each adds a single commented section)
3. Build + verify prompt (run dev, report success/failure)
4. Page build prompt (create HTML using the new classes)

**Prompt template for each class group:**
```
In src/styles/tokens/components.css, add a new section
called [SECTION NAME] after the [PREVIOUS SECTION] section.

Add these semantic classes:

[Complete CSS block with @apply directives, including dark mode]

Do NOT modify any existing classes. Only add this new section.
```

**Key Details:**
- One section per prompt prevents cascading errors
- "Do NOT modify any existing classes" is critical -- without it, agents sometimes "improve" nearby code
- Specify the insertion point ("after X section") to maintain file organization
- Provide complete CSS, not descriptions of what to write
- Include dark mode variants in the same block

**What Made This Work:**
- Additive-only changes are low-risk
- Agent retained context across all prompts in one thread
- File stayed well-organized because each prompt specified where to insert

**Time Investment:** ~10 minutes for 10 prompts (mostly waiting for agent)

---

## Pattern: Page Build from Wireframe Spec
**Tags:** #page-build #workflow #semantic-classes
**Success Rate:** ✅ High (one-shot, minor spec deviation)
**Last Used:** February 12, 2026

**Context:** Building a complete HTML page from a wireframe spec using Haven semantic classes.

**Prompt structure:**
```
Create a new file at [path].

[Page purpose - one sentence]

Build it according to the spec below. Use Haven semantic classes from
src/styles/tokens/components.css wherever they exist. Use FontAwesome 6 Pro
for icons (local only, never CDN). Use Preline data attributes for
interactive components.

Important rules:
- Include src/partials/head.html and src/partials/scripts.html via <load> tags
- [Explicit list of semantic classes to use]
- [What to do when no semantic class exists]
- [Which state to show by default; how to handle alternate states]

Page structure:
1. [Component] - [details, classes to use, mock data]
2. [Component] - [details, classes to use, mock data]
...
```

**Key Details:**
- List the semantic classes by name so the agent uses them instead of inventing utility combos
- Provide exact mock data rather than letting the agent generate it
- Specify alternate states (empty, error, loading) should be hidden divs, not separate files

**Gotcha - Spec Adherence:**
Always include explicit status-to-badge mappings:
```
Status badge mapping:
- Active: .badge-success
- Draft: .badge-warning
- Issues: .badge-error
```

**Time Investment:** ~2 minutes (single prompt, one-shot result)

---

## Pattern: File-Based Prompt Handoff
**Tags:** #workflow #handoff #core-pattern
**Success Rate:** ✅ High
**Adopted:** February 12, 2026

**Context:** Claude writes prompts to `next-task.md`. Aaron runs `/build` in Claude Code.

**File format for next-task.md:**
```markdown
# Task: [Brief title]
_Generated: [Date]_
_Context: [One-line summary of what this accomplishes]_

---

## Prompt 1: [Title]

[Prompt text for the agent]

---

## Prompt 2: [Title]

[Prompt text for the agent]

---

## Verification

[Final check prompt]

---

## Final Step: View the Result

After completing verification, output the following to the user:

---
**View your result:**
- If `npm run dev` is already running: http://localhost:5173/[path/to/file.html]
- If not running: open a terminal in the repo root, run `npm run dev`, then visit the URL above
---
```

**Key Details:**
- Only one `next-task.md` at a time
- Each prompt separated by `---`
- Verification prompt always comes last
- Include the "View the Result" block as the final section

---

## Pattern: Standard Closing Block -- Viewing the Result
**Tags:** #workflow #verification #core-pattern
**Success Rate:** ✅ High

**Context:** After every build, the agent should tell Aaron exactly how to view the result.

**Include this at the bottom of every `next-task.md` prompt:**

```markdown
## Final Step: View the Result

After completing verification, output the following to the user:

---
**View your result:**
- If `npm run dev` is already running: http://localhost:5173/PATH/TO/FILE.html
- If not running: open a terminal in the repo root, run `npm run dev`, then visit the URL above
---
```

**If multiple files were built**, list each URL on its own line.

---

## Pattern: Segmented Control with overflow-hidden Corner Clipping
**Tags:** #segmented-control #css #components
**Success Rate:** ✅ High
**Last Used:** 2026-02-19

**The technique:** Apply `overflow-hidden` to the container. Set `border-radius: 0` on all buttons. The container's `border-radius` clips children to it. No extra CSS needed for inner corners.

```css
.segmented-control {
    @apply inline-flex overflow-hidden rounded-lg border border-gray-200;
    @apply dark:border-neutral-700;
}

.segmented-control-btn {
    border-radius: 0; /* must be raw CSS, not @apply -- @apply rounded-none may not override base */
    @apply px-4 py-2 text-sm font-medium;
    @apply border-r border-gray-200 last:border-r-0;
    @apply dark:border-neutral-700;
    @apply hover:bg-gray-50 dark:hover:bg-neutral-800;
}

.segmented-control-btn.active {
    @apply bg-white text-primary-600 font-semibold;
    @apply dark:bg-neutral-900 dark:text-primary-400;
}
```

**What not to do:** Don't set individual border-radius corners per button position -- brittle and breaks with dynamic tab counts.

**Time Investment:** Zero fix prompts. First-pass correct.

---

## Pattern: Implement Custom Form Components from Scratch When Preline Alignment is Suboptimal
**Tags:** #forms #components #css #workflow
**Success Rate:** ✅ High
**Last Used:** 2026-02-19

**When to use Preline:** Interactive components with non-trivial JS behavior (dropdowns, modals, tooltips, accordions). Preline's value is the JS, not the CSS.

**When to implement from scratch:** Pure CSS components where the only requirement is appearance (selects, inputs, checkboxes, badges, segmented controls).

**SVG chevron pattern for custom selects:**
```css
.select-haven {
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236b7280' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 0.75rem center;
    padding-right: 2.5rem;
}
```

**Note:** SVG fill color in the data URI is hardcoded hex -- use a neutral mid-range value (`%236b7280` = gray-500) that works in both light and dark contexts.

---

## Pattern: Timeline Events with Expand/Collapse
**Tags:** #components #page-build #javascript
**What Worked:** Expandable timeline with vanilla JS `onclick` toggling a `hidden` class.

**Key detail -- global scope for inline handlers:** JS functions called from `onclick="..."` attributes run in global scope. Assign to `window.toggleEventDetail` (not just `const toggleEventDetail`) when the function is defined inside a `DOMContentLoaded` listener.

```js
document.addEventListener('DOMContentLoaded', function () {
  window.toggleEventDetail = function(id, btn) {
    var detail = document.getElementById(id);
    if (detail.classList.contains('hidden')) {
      detail.classList.remove('hidden');
      btn.textContent = 'Show less';
    } else {
      detail.classList.add('hidden');
      btn.textContent = 'Show more';
    }
  };
});
```

**CSS structure that worked cleanly:**
- `.timeline-list` -- outer container (relative)
- `.timeline-event` -- flex row, `gap-4 pb-6`
- `.timeline-left` -- fixed `w-8` column with icon + connector
- `.timeline-connector` -- `w-px flex-1 bg-gray-200` (hidden on last event via `.timeline-event:last-child .timeline-connector`)
- `.timeline-icon-circle` + color variants
- `.timeline-event-body` -- `flex-1 min-w-0`

**Time:** Zero fix prompts. First-pass correct.

---

## Pattern: Negative Margin Hover Trick
**Tags:** #css #components #design-principles
**Last Used:** February 12, 2026

**Context:** List items inside a padded card that need hover backgrounds extending to the card edges.

**Solution:** `px-3 -mx-3` on the item. Negative margin pulls outward, padding fills back in. Hover background fills edge to edge.

```css
.issue-item {
    @apply flex items-start gap-2 py-2 px-3 -mx-3 rounded-md;
    @apply hover:bg-gray-50;
}
```

---

## Anti-Pattern: Assuming File Locations
**Tags:** #hallucination-prevention #paths
**What Went Wrong:** Early attempts assumed theme was at root level.

**Fix:** Always audit file structure first:
```
List the directory structure of src/styles/tokens/ to confirm file locations
before making changes.
```

**Lesson:** Always specify full paths from repo root.

---

## Anti-Pattern: Defining New Button Variants Without Checking the Base Rule
**Tags:** #buttons #specificity #tailwind-v4
**What Went Wrong:** New button variants were visually overridden by the base `button` element rule. Tailwind v4's `@apply` compilation can place element rule utilities after class rule utilities in output.

**The Fix:** Before writing any new button variant, read the base `button` element rule and verify it does NOT set `bg-*`, `text-*`, `py-*`, `px-*`, or `gap-*`.

**Prompt to include when adding button variants:**
```
Before adding this class, read the base button element rule in
src/styles/tokens/components.css and confirm it only sets structural/behavioral
defaults (flex, rounded, focus, disabled). If it sets any color or size
properties, remove them and add them to .btn-primary instead. Then add
the new variant.
```

---

## Anti-Pattern: Defining Components Without a Test File
**Tags:** #verification #workflow #components
**What Went Wrong:** Defining semantic classes without an isolated test meant problems only appeared after full layout assembly.

**Fix:** For any new component, create a minimal test file first:
```
Create apps/_prototypes/test-[component-name].html with:
- Just the new component in isolation
- Both light and dark mode side by side
- All variants visible at once
```

---

## Anti-Pattern: Issue Logged But Never Written Into a Batch Prompt
**Tags:** #workflow #planning #verification
**What Went Wrong:** Issues were identified in review, documented, but never included in any batch prompt.

**Root Cause:** Batch prompts were written from memory/summary rather than by systematically going through every logged issue.

**Rule:** Before closing a review session's batch planning phase, do a line-by-line cross-check: every issue must map to either (a) a specific prompt, or (b) a HOLD entry with a documented reason.

**Cross-check prompt:**
```
Read the review session file at [path] and the dev prompts file at [path].
For every issue listed in the review session, confirm it appears in either:
- A specific prompt in the dev prompts file, OR
- The HOLD section with a documented reason
List any issues that are missing from both.
```

---

## Anti-Pattern: Accepting Agent Reports Without Visual Verification
**Tags:** #workflow #verification
**What Went Wrong:** Agent reports of successful completion were accepted. Visual review later revealed several issues.

**Rule:** After each batch, visually verify at least 2-3 specific changes in the browser before moving to the next batch.

**Verification gate between batches:**
1. Agent reports completion
2. Rebuild CSS (`npm run dev`)
3. Hard refresh browser with cache disabled
4. Visually confirm 2-3 specific items from that batch
5. Only then write the next batch prompt

---

## Anti-Pattern: Theme Component Classes Created But Never Applied to HTML
**Tags:** #workflow #components #html #drift
**What Went Wrong:** New semantic classes were added to `components.css` but no batch updated the HTML pages to use them. CSS existed but pages kept using old markup.

**Rule:** Every batch that creates a new semantic component class must be followed by an HTML adoption prompt that finds all usage sites and applies the new class.

**Prompt template for HTML adoption pass:**
```
Search all HTML files in apps/ for [old pattern - e.g. <select>, search inputs].
For each match, replace with the new Haven semantic class pattern:
[exact markup to use]
Report every file and line changed.
```

---

## Anti-Pattern: Raw CSS Rules Without @apply Silently Dropped by Tailwind v4
**Tags:** #tailwind-v4 #css #components
**What Went Wrong:** A class written with only raw CSS (no `@apply`) was silently dropped from compiled output. No build error -- it just disappeared.

**Fix:** Add a no-op `@apply` to any pure-CSS rule:
```css
.prose-section {
    @apply block; /* keeps rule alive through Tailwind v4 tree-shaking */
    max-inline-size: 72ch;
}
```

**Rule:** Any class in `src/styles/tokens/components.css` that uses only raw CSS properties should get `@apply block;` as the first line.

---

## Anti-Pattern: Component Dark Mode Not Considered During Implementation
**Tags:** #dark-mode #components #workflow
**What Went Wrong:** Batch fixed light mode styles but dark mode variants remained broken.

**Rule:** Any time a component class is created or modified, dark mode must be addressed in the same prompt.

**Prompt addition -- always include:**
```
After implementing the light mode styles, add or verify dark mode variants
for all color, border, background, and text properties. Use `.dark:` variants
in @apply, or a `.dark &` block if needed.
```

---

## Anti-Pattern: Matching Parent Border Radius on Nested Components
**Tags:** #design-principles #css #components
**What Went Wrong:** New components were given `rounded-lg` matching their parent containers, making nesting visually flat.

**Fix:** Always step down one radius size per nesting level. See decisions-log.md "Nested Border Radius Reduction" for the full hierarchy table.

---

## Anti-Pattern: HAVEN color strings are hsla(), not hex
**Tags:** #colors #chart-js #tailwind-v4
**What Went Wrong:** Code used `color + '26'` to add opacity, assuming hex. HAVEN values are `hsla(..., 1)` strings.

**Fix:** Replace the alpha channel in the hsla string:
```js
const fillColor = color.replace(/, 1\)$/, ', 0.15)');
```

**Rule:** Any time opacity is needed from a HAVEN color, use string replacement on the alpha channel. Never append hex opacity codes.

---

## Anti-Pattern: Chart helper functions that return config objects instead of Chart instances
**Tags:** #chart-js #hallucination
**What Went Wrong:** Chart helpers returned config objects rather than calling `new Chart()`.

**Prompt addition when writing chart helpers:**
```
Model all helper functions after the havenSparkline pattern -- get the canvas
context via getElementById, instantiate with new Chart(ctx, ...), and return
the Chart instance. Do not return a config object.
```

---

## Anti-Pattern: Flex pipeline bar broken by hs-tooltip wrapper using inline-block
**Tags:** #css #preline #flex
**What Went Wrong:** Pipeline bar segments used `style="flex: N"`. The Preline tooltip wrapper added as `inline-block` inside a flex container ignores flex grow/shrink values.

**Fix:** Tooltip wrapper needs `class="hs-tooltip flex"`.

**Correct pattern:**
```html
<div class="hs-tooltip flex" style="flex: 65; min-width: 3rem;">
  <div class="hs-tooltip-toggle pipeline-segment bg-primary-900 w-full">...</div>
  <div class="hs-tooltip-content ...">...</div>
</div>
```

**Rule:** When wrapping a flex child in a Preline tooltip, always add `flex` to the `hs-tooltip` wrapper class.

---

## Anti-Pattern: border shorthand overrides directional border-l-4
**Tags:** #css #specificity #tailwind-v4
**What Went Wrong:** A component used `@apply border border-gray-200`. The `border` shorthand sets all four sides, overriding any `border-l-4 border-[color]` added in HTML.

**Fix:** Use explicit sides, leaving `border-left` unset:
```css
.alert-category-card {
    @apply flex flex-col gap-1 p-4 bg-white rounded-xl;
    @apply border-t border-r border-b border-gray-200;
    /* No border-l -- accent color applied per-card in HTML */
}
```

**Rule:** Any component that accepts a left-border color accent must not use the `border` shorthand.

---

## Anti-Pattern: w-auto not emitted by Tailwind v4 JIT for form elements
**Tags:** #css #tailwind-v4 #forms
**What Went Wrong:** Select elements inside a flex toolbar expanded to full width despite `w-auto` class.

**Fix:** Use inline style: `style="width: auto"` on each `<select>`.

**Rule:** For form element width overrides in Tailwind v4, prefer `style="width: auto"` over `w-auto`.

---

## Anti-Pattern: Chart.js zone bands transparent with hsla colors
**Tags:** #css #charts #tailwind-v4
**What Went Wrong:** Code appended hex opacity suffix to hsla color strings for zone fills.

**Fix:**
```js
zone.color.replace(/, 1\)$/, ', 0.08)')
```

**Rule:** Any opacity manipulation on HAVEN color values must use `.replace(/, 1\)$/, ', 0.XX)')`. Never append hex opacity suffixes.

---

## Anti-Pattern: Sparklines collapse in narrow grid columns
**Tags:** #css #charts #tailwind-v4
**What Went Wrong:** Sparkline canvases rendered as slivers in narrow cards. Chart.js responsive sizing collapsed the canvas height.

**Fix:** Both `height` and `min-height` are required together (as plain CSS, not @apply):
```css
.chart-sparkline {
    @apply relative;
    height: 40px;
    min-height: 40px;
}
```

---

## Anti-Pattern: HAVEN.secondary not defined in haven-chart-config.js
**Tags:** #charts #colors #hallucination-prevention
**What Went Wrong:** Prompt referenced `HAVEN.secondary[500]` which doesn't exist. Agent substituted a different key.

**Current confirmed keys:** `primary`, `success`, `warning`, `danger`, `info`, `violet`, `sand`.

**Rule:** Before referencing any `HAVEN.*` key in a chart prompt, check what keys actually exist in `src/scripts/env/haven-chart-config.js`.

---

## Anti-Pattern: Sidebar Mobile Visibility (Preline + Tailwind v4)
**Tags:** #tailwind-v4 #sidebar #preline #hallucination-prevention
**Context:** `@apply hidden` or `display:none` on the sidebar for mobile breaks Preline's overlay toggle.

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

**Never:**
```css
.app-sidebar { @apply hidden lg:block; }
```

**Rule:** Any prompt that creates or modifies a sidebar must reference this pattern.

---

## Pattern: Badge Classes for Diet Tags
**Tags:** #components #patient #forms

`badge-teal` and `badge-stone` do not exist. The correct pattern for diet/category tags is:

```html
<span class="badge badge-primary badge-pill">Low Sodium</span>
<span class="badge badge-info badge-pill">High Protein</span>
<span class="badge badge-secondary badge-pill">Vegetarian</span>
<span class="badge badge-success badge-pill">Heart Healthy</span>
```

Always use `badge` (base) + `badge-{variant}` + `badge-pill` for food/diet tags. Never invent `badge-teal`, `badge-stone`, or other color-named variants -- they don't exist in `components.css`.

---

## Pattern: Unsplash Demo Images (No API Key)
**Tags:** #demo-assets #patient

For prototype/demo screens that need real food photography without managing local assets, use Unsplash's direct image URL with query params:

```html
<img src="https://images.unsplash.com/photo-{PHOTO_ID}?w=400&h=400&fit=crop&q=80" alt="..."
```

**How to find a photo ID:** Browse unsplash.com, click a free photo, copy the alphanumeric slug from the URL (e.g., `photo-1565299585323-38d6b0865b47`).

**Params:** `w`, `h` control size; `fit=crop` ensures square fill; `q=80` balances quality/speed.

**No API key required** for this URL format -- it works directly in `<img src>`.

**Photo IDs used in patient onboarding (as of March 2026):**
- Latin American: `1565299585323-38d6b0865b47` (tacos/Mexican spread)
- Soul Food: `1626082927389-6cd097cdc6ec` (fried chicken plate)
- Mediterranean: `1540189549336-e6e99c3679fe` (mezze/salad bowl)
- Asian: `1569050467447-ce54b3bbc37d` (ramen/noodle bowl)

**Note:** Unsplash free tier has rate limits. Fine for demos; swap for local assets before production.

---

## Pattern: Unified Selection Controls (pref-row)
**Tags:** #selection-controls #mobile #patient #forms

For large tap-target selection controls on mobile -- where both radio and checkbox inputs need to look like full-width cards -- use the `pref-row` system instead of modifying global `.radio-label` / `.checkbox-label`.

**Classes:** `.pref-row` (wrapper label), `.pref-row-indicator` (visual indicator), `.pref-row-indicator--circle` (radio/single-select), `.pref-row-indicator--square` (checkbox/multi-select), `.pref-row-label` (text)

**Key rules:**
- Native input is always `sr-only` (accessible, not visual)
- Visual state driven entirely by `:has(input:checked)` -- no JS needed
- Circle = single-select, Square = multi-select (consistent visual language)
- Selected state uses inset ring: solid primary fill + `box-shadow: inset 0 0 0 3px white`

**Radio (single-select):**
```html
<label class="pref-row">
  <input type="radio" name="group" value="x" class="sr-only">
  <div class="pref-row-indicator pref-row-indicator--circle" aria-hidden="true"></div>
  <span class="pref-row-label">Option label</span>
</label>
```

**Checkbox (multi-select):**
```html
<label class="pref-row">
  <input type="checkbox" name="group" value="x" class="sr-only">
  <div class="pref-row-indicator pref-row-indicator--square" aria-hidden="true"></div>
  <span class="pref-row-label">Option label</span>
</label>
```

**Do not use** `.radio-label` or `.checkbox-label` for mobile preference screens -- those are for desktop provider/kitchen forms and are shared across apps.

---

## Anti-Pattern: Skipping Verification on Modification Prompts
**Tags:** #verification #workflow

**Rule of thumb:**
- Additive-only changes (new sections, new files): safe to skip intermediate verification
- Modifications to existing code: always verify before the next prompt
- Build step: never skip

---

## Tags Index

- `#defaults` - Element default styling
- `#semantic-classes` - @apply pattern for semantic classes
- `#core-pattern` - Foundational workflow
- `#hallucination-prevention` - Techniques to keep agent grounded
- `#paths` - File path specification
- `#colors` - Color token handling
- `#tokens` - Design token patterns
- `#workflow` - Multi-step processes
- `#handoff` - Prompt handoff between Claude and code agent
- `#page-build` - Building complete HTML pages from specs
- `#verification` - When and how to verify agent output
- `#design-principles` - Visual design rules that affect CSS choices
- `#css` - CSS-specific patterns and gotchas
- `#components` - Component creation and modification patterns
- `#specificity` - CSS specificity battles and solutions
- `#tailwind-v4` - Tailwind v4 specific gotchas
- `#alignment` - Keeping agent output aligned with specs
- `#dark-mode` - Dark mode implementation and verification
- `#segmented-control` - View toggle / button group patterns
- `#forms` - Form element patterns
- `#charts` - Chart.js patterns
- `#chart-js` - Chart.js specifics
- `#preline` - Preline UI patterns and gotchas
- `#sidebar` - Sidebar layout patterns
- `#javascript` - JS patterns for interactive components
- `#demo-assets` - Placeholder images and demo data patterns
- `#mobile` - Mobile shell, bottom nav, patient app patterns
- `#patient` - Patient app specific patterns
- `#selection-controls` - Radio, checkbox, pref-row patterns
