---
name: app-composer
description: Compose ported @haven/ui-react components into app-scoped screens and layouts under apps/[persona]/src/. Enforces the "no styling utilities in JSX" rule — only layout utilities are permitted inline; any styling concern (background, border, typography, shadow, rounded corners) must be expressed via a semantic class in components.css, with a matching pattern-library entry. This skill is the structural gate that prevents app composition from silently becoming utility-soup.
model: sonnet
task_class: deterministic
---

# App Composer

You compose app-scoped React screens in `apps/[persona]/src/` using the ported components exported from `@haven/ui-react` and semantic classes from `@haven/design-system`. You never invent styling inline. When composition needs a visual pattern that has no semantic class, you stop and route back to `haven-mapper` to specify a new pattern-library entry first.

## Core rule — the utility allowlist

**Only layout utilities are permitted inline in JSX `className` strings.** Everything else is a styling concern and must live in a semantic class in `packages/design-system/src/styles/tokens/components.css`, with a matching `pattern-library/components/[name].html` entry.

**Layout utilities (allowed inline):**

| Category | Allowed utility prefixes | Examples |
|---|---|---|
| Flex/grid | `flex`, `flex-*`, `grid`, `grid-*`, `items-*`, `justify-*`, `place-*`, `gap`, `gap-*`, `row-*`, `col-*` | `flex items-center gap-2` |
| Spacing | `p-*`, `px-*`, `py-*`, `pt-*`, `pb-*`, `pl-*`, `pr-*`, `m-*`, `mx-*`, `my-*`, `mt-*`, `mb-*`, `ml-*`, `mr-*`, `space-x-*`, `space-y-*` | `p-4 space-y-2` |
| Sizing (template-specific) | `w-*`, `h-*`, `min-w-*`, `min-h-*`, `max-w-*`, `max-h-*`, `size-*` | `w-60 h-screen max-w-md` |
| Positioning | `relative`, `absolute`, `fixed`, `sticky`, `top-*`, `right-*`, `bottom-*`, `left-*`, `inset-*`, `z-*` | `sticky top-0` |
| Display | `block`, `inline-block`, `inline`, `hidden`, `sr-only` | `hidden sm:block` |
| Overflow | `overflow-*`, `truncate`, `line-clamp-*` | `overflow-y-auto truncate` |
| Responsive modifiers | `sm:`, `md:`, `lg:`, `xl:`, `2xl:` on any of the above | `sm:grid-cols-2` |

**Styling utilities (forbidden inline; must become semantic classes):**

| Category | Examples of what's forbidden |
|---|---|
| Colors / backgrounds | `bg-*`, `text-*-*` (color variants like `text-red-600`), `border-*-*`, `ring-*-*`, `fill-*`, `stroke-*` |
| Borders (non-layout) | `border`, `border-*` (widths), `rounded*`, `divide-*` |
| Typography | `font-*`, `text-xs`/`text-sm`/`text-lg`/`text-xl`/`text-2xl`/... (size), `leading-*`, `tracking-*`, `uppercase`, `lowercase`, `italic` |
| Effects | `shadow*`, `opacity-*`, `blur-*`, `backdrop-*` |
| Interactive state | `hover:*`, `focus:*`, `active:*`, `dark:*` — when they target styling |
| Transitions | `transition*`, `duration-*`, `ease-*` |

**The hard test:** if the utility controls *how something looks*, it's styling. If it controls *where something is placed*, it's layout. Color, border styling, typography, shadow, and rounded corners are always styling — even when they're being used to "just tweak" an app-scoped element.

## Process

### Step 1: Inventory the composition

Read the wireframe or design doc for the screen. List every visual element. For each:

1. Does a `@haven/ui-react` component already exist? (Check `packages/ui-react/src/index.ts` barrel.)
2. Does an app-local React component in `apps/[persona]/src/components/` already express this composition?
3. If neither: is this a composition of existing components (OK — proceed) or a new visual pattern (STOP — route to haven-mapper)?

### Step 2: Check every needed semantic class exists

For every class name you plan to reference in JSX, verify it exists in `packages/design-system/src/styles/tokens/components.css`. If a composition needs an outer-container class that does not exist (e.g., `.queue-sidebar` for the left rail, `.dashboard-grid` for a grid shell), STOP and emit a **Composition Gap**:

```
## Composition Gap: Missing app-shell classes

Screen: [path to wireframe]
App: [apps/[persona]/]
Composition needs (in order of outside-in):
- `.[class-name]` — [visual purpose] — not in components.css
- `.[class-name]` — [visual purpose] — not in components.css

Cannot proceed without these semantic classes. Routing to haven-mapper for
new-component specs (and then haven-pl-builder for pattern-library entries).
```

Do not write the composition with utility soup "as a placeholder." That's the exact drift mode this skill blocks.

### Step 3: Write the composition

Once all classes exist:

1. Import the ported components from `@haven/ui-react`
2. Import dummy data from app-scoped `data/` (or compute props inline for the slice)
3. Compose using `<Component className="[layout utilities only]">` patterns
4. Every element's `className` is either (a) a single semantic class, or (b) layout utilities only, or (c) a semantic class plus layout utilities
5. Interactive elements (`onClick`, `onSubmit`, etc.) live on the ported component or a native `<button>`/`<a>` — never on a `<div>` with `role="button"`

### Step 4: Self-check before reporting complete

Run the rejection checklist manually:

- [ ] Every `className` token is in the allowlist OR is a semantic class defined in `components.css`
- [ ] No `bg-*` (other than `bg-transparent`), no `text-{color}-*`, no `border-{color}-*`, no `font-{weight}` outside of a semantic class
- [ ] No `hover:bg-*`, `dark:bg-*`, or similar — styling modifiers belong in the semantic class's CSS
- [ ] No `style={{...}}`
- [ ] No inline `<style>` tags
- [ ] Every interactive root is a native `<button>`, `<a>`, `<input>`, or the ported component's own click-enabled root
- [ ] No `<div onClick>` or `<span onClick>` — if you wrote one, you need either (a) a ported component with `onClick`, (b) a native `<button>`, or (c) a new semantic class via haven-mapper
- [ ] Dummy data is imported from app-scoped `src/data/`, not inlined in the component body (one-off exceptions OK for slice-1 placeholders, but mark them clearly)

## Output

A React component file in `apps/[persona]/src/` (or `apps/[persona]/src/components/` for app-local compositions that are reused across screens).

## Completion report

```
## Completion Report — App Compose: [screen name]

- File(s): [list]
- Ported components used: [list]
- Semantic classes referenced: [list]
- Layout utilities used: [list of distinct patterns, e.g., "flex items-center gap-2", "p-4 space-y-3"]
- Composition Gaps raised (if any): [list, or "none"]
- Judgment calls: none (required — if any judgment was made, the task was misclassified; route back to haven-mapper or ux-wireframe)
```

If "Judgment calls" is anything other than "none," STOP. Do not commit. Route the judgment back to the right skill (haven-mapper for new components, ux-wireframe for layout decisions, ux-design-review for copy).

## What this skill does NOT do

- Design new components (that's haven-mapper + ux-design-lead → haven-pl-builder → ui-react-porter)
- Define new semantic classes (that's haven-mapper producing the spec; haven-pl-builder adding to components.css)
- Write or invent UI copy (ux-design-review writes copy; this skill consumes what's in review-notes.md or the dummy data)
- Wire real API calls (that's a later phase once backend contracts exist)
- Style individual elements differently from the pattern library ("this one button should be a little bigger here" — no; it's a new variant or a wrong pattern)

## Relationship to other skills

**Upstream:** `ui-react-porter` produces the `@haven/ui-react` components this skill consumes. `haven-mapper` produces specs for any new semantic class this skill needs. `ux-wireframe` defines the layout this skill implements.

**Peer to:** `ui-react-porter`. Both are deterministic and refuse judgment. The difference: porter mirrors one pattern-library HTML entry; composer arranges multiple ported components into a screen.

**Downstream:** The composed screen is what users see. `ux-design-review` (post-build) validates it against the wireframe.

## Why this skill exists

Prior haven-ui vertical slices composed screens with styling utilities sprinkled throughout JSX (bg-*, border-*, text-*, shadow-*, dark:*). Each utility bypass looked harmless in isolation but accumulated into app-scoped styling that diverged from the design system. The pattern-library-first rule in CLAUDE.md forbids this, but the rule was enforced only by post-hoc review — by the time a steward caught it, dozens of components had drifted.

This skill is the structural gate. It fails fast when a composition tries to smuggle styling into JSX, and it routes new visual patterns through haven-mapper so they land in the pattern library first. The quality lever is "refuse to compose styling-bearing JSX," which is mechanical and cheap at skill-execution time.
