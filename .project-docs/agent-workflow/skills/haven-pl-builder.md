---
name: haven-pl-builder
description: Build a new pattern library component for haven-ui. Read this skill before writing any file. Produces a pre-build plan, then executes it. Followed by haven-pl-qa.
---

# Haven UI — Pattern Library Component Builder

## When to invoke

Read this skill before building any pattern library component. Applies to:
- Adding a new component to `packages/design-system/pattern-library/components/`
- Promoting a `missing` entry in `COMPONENT-REGISTRY.md` to `built`
- Adding a new variant to an existing component page

Do not write any file until Steps 1–3 are complete.

---

## Step 1: Read before touching anything

In this exact order:

1. `CLAUDE.md` — all rules. Extract every "Rule to follow in future prompts" from `decisions-log.md`.
2. `packages/design-system/pattern-library/COMPONENT-INDEX.md` — confirm the component does not already exist.
3. `.project-docs/COMPONENT-REGISTRY.md` — find the target row, confirm status is `missing`.
4. `packages/design-system/src/styles/tokens/components.css` — scan for any existing related classes.
5. `packages/design-system/pattern-library/components/alert.html` — this is the canonical structure model.
6. The relevant Preline docs page (if Preline is involved) — use Context7 MCP or https://preline.co/docs/

---

## Step 2: Pre-build plan (output this before writing any file)

```
## Pre-Build Plan — {Component Name}

### Existing classes found in components.css
[List any related classes already defined — do not duplicate them]

### New semantic classes to add to components.css
[List each new class with its @apply definition]

### Pattern library sections to build
[List each section: what it demonstrates, which semantic classes it uses]

### Preline required?
[yes — {which plugin} / no]

### JS required?
[yes — {what interaction} / no]

### Files to create or modify
- [ ] `packages/design-system/src/styles/tokens/components.css` — add classes
- [ ] `packages/design-system/pattern-library/components/{name}.html` — create
- [ ] `packages/design-system/pattern-library/pages/{name}.html` — create
- [ ] `packages/design-system/pattern-library/partials/pl-nav.html` — add nav link
- [ ] `packages/design-system/pattern-library/COMPONENT-INDEX.md` — add row(s)
- [ ] `.project-docs/COMPONENT-REGISTRY.md` — mark built

### Known constraints from decisions-log.md that apply
[List each relevant rule]
```

---

## Step 3: Architecture rules — follow exactly

### CSS rules

- All new classes go in `packages/design-system/src/styles/tokens/components.css` using `@apply`
- Never create a separate CSS file per component
- First line of any class using only raw CSS (no `@apply`) must be `@apply block;`
- Never `@apply` a semantic class inside another semantic class
- Dark mode variants required for every `bg-*`, `text-*`, `border-*` value
- No hardcoded hex values — use `var(--color-*)` tokens or `@apply` with Tailwind aliases
- `var(--color-sand-*)` is the canonical form for neutral raw CSS values

### HTML rules

- Semantic classes only in component markup — no utility chains
- Layout-only one-offs (e.g. `flex gap-4`) on wrapper divs are acceptable
- No `style=""` attributes (except data-driven values like chart flex)
- No `<script>` blocks — all JS in `src/scripts/components/`
- FontAwesome Pro icons only: `<i class="fa-solid fa-{name}"></i>`
- All placeholder text from `.project-docs/dummy-copy.md` — no Lorem ipsum
- Primary patient is Maria Rivera (MRN PT-2024-0847, Type 2 Diabetes)

### Component file structure

```html
<!--
  @component-meta
  name: {Name}
  category: {Category}
  file: {filename}.html
  classes: {comma-separated list}
  when-to-use: {one sentence}
  preline-required: yes — {plugin} / no
  notes: {any important constraints}
  @end-meta
-->

<!-- DEMO WRAPPER: visual context only, do not copy -->
<section>
  <h3 class="section-title mb-4">{Component Name}</h3>
  <p class="text-sm text-gray-500 dark:text-neutral-400 mb-8">
    {One-sentence description.}
  </p>

  <!-- Variant groups, each as a subsection -->
  <div class="mb-8">
    <h4 class="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-5">{Variant Group}</h4>
    <!-- @component: {variant-id} -->
    {component markup}
    <!-- /component -->
  </div>

</section>
```

### Pattern library page structure

```html
<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
  <load src="../partials/pl-head.html" />
</head>
<body class="bg-gray-50 dark:bg-neutral-900">
  <div class="flex min-h-screen">
    <load src="../partials/pl-nav.html" />
    <main class="flex-1 min-w-0 ml-64 p-8 lg:p-10 space-y-16">

      <div class="page-header">
        <h1>{Component Name}</h1>
      </div>

      <load src="../components/{name}.html" />
      <!-- additional component files if this page covers multiple -->

    </main>
  </div>
  <load src="../partials/pl-scripts.html" />
</body>
</html>
```

### Preline components

- Use `data-hs-*` attributes for all Preline JS behavior
- Never add CDN Preline script tags — Preline loads via `packages/design-system/src/partials/pl-scripts.html`
- For dropdowns: use exactly `.hs-dropdown`, `.hs-dropdown-toggle`, `.hs-dropdown-menu`, `.hs-dropdown-item` — no extras
- Overlay open state is driven by `.hs-overlay.open` — never `hs-dropdown-open:*` variants

---

## Step 4: After writing files

1. Confirm dev server is running at `http://localhost:5173`
2. Check the component page renders without JS errors
3. Hand off to `haven-pl-qa` skill for QA pass
4. Do not commit until QA passes

---

## What this skill does NOT cover

- Design decisions — follow existing `components.css` patterns
- Brand review — that is a separate `/brand-review` command
- App screen work — use `dev-tasker.md` for that
