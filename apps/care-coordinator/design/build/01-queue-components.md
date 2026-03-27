# Task 01: Queue Components — CSS + Pattern Library

## Scope
Pattern library + CSS

## Context
Creates the queue-item and queue-section-header components needed for the care coordinator queue sidebar. These are new components with no Haven precedent.

## Prerequisites
- None (first task)

## Files to Read First
- `src/styles/tokens/components.css` — find the end of the Clinical/Healthcare section to add after
- `apps/care-coordinator/design/new-components/queue-item.md` — full spec
- `apps/care-coordinator/design/new-components/queue-section-header.md` — full spec

## Instructions

### Step 1: Add semantic classes to components.css

Add the following classes to `src/styles/tokens/components.css` after the Clinical/Healthcare section (after the last `.timeline-*` or `.sla-warning` class). Add a section comment:

```css
/* ================================================================
   Queue Components (Care Coordinator)
   ================================================================ */

.queue-item {
    @apply block px-3 py-2.5 cursor-pointer;
    border-left: 3px solid theme(--color-gray-200);
    @apply hover:bg-gray-50 transition-colors duration-100;
    @apply dark:hover:bg-neutral-800;
}

.queue-item.is-urgent {
    border-left-color: theme(--color-red-500);
}

.queue-item.is-attention {
    border-left-color: theme(--color-amber-400);
}

.queue-item.is-info {
    border-left-color: theme(--color-gray-200);
    @apply opacity-80;
    @apply dark:opacity-70;
}

.queue-item.active {
    @apply bg-primary-50;
    @apply dark:bg-primary-900/20;
}

.queue-item-header {
    @apply flex items-center justify-between gap-2;
}

.queue-item-header > span:first-child {
    @apply text-sm font-medium text-gray-900 truncate;
    @apply dark:text-gray-100;
}

.queue-item-summary {
    @apply text-xs text-gray-600 truncate mt-0.5;
    @apply dark:text-gray-400;
}

.queue-item-meta {
    @apply flex items-center justify-between text-xs text-gray-400 mt-1;
    @apply dark:text-gray-500;
}

.queue-item-sla {
    @apply flex items-center gap-1;
}

.queue-item-sla.is-warning {
    @apply text-amber-600 font-medium;
    @apply dark:text-amber-400;
}

.queue-item-sla.is-breached {
    @apply text-red-600 font-medium;
    @apply dark:text-red-400;
}

.queue-section-header {
    @apply flex items-center gap-1.5 px-3 py-1.5;
    @apply text-xs font-semibold uppercase tracking-wide;
}

.queue-section-header.is-urgent {
    @apply text-red-700 bg-red-50;
    @apply dark:text-red-400 dark:bg-red-900/20;
}

.queue-section-header.is-attention {
    @apply text-amber-700;
    @apply dark:text-amber-400;
}

.queue-section-header.is-info {
    @apply text-gray-500;
    @apply dark:text-gray-400;
}
```

### Step 2: Create pattern library file for queue-item

Create `pattern-library/components/queue-item.html` with the following content. Include a `@component-meta` header block at the top:

```html
<!--
@component-meta
name: Queue Item
category: Clinical / Healthcare
classes: queue-item, queue-item-header, queue-item-summary, queue-item-meta, queue-item-sla
variants: is-urgent, is-attention, is-info, active
preline: false
notes: Care coordinator queue sidebar item. Left border indicates urgency. Truncates content at sidebar width.
-->
```

Show all variants: urgent active, urgent default, attention, info, with SLA states (within SLA, warning, breached).

### Step 3: Create pattern library file for queue-section-header

Create `pattern-library/components/queue-section-header.html` with `@component-meta` header. Show all three urgency variants.

### Step 4: Update COMPONENT-INDEX.md

Add rows to the Clinical/Healthcare section of `pattern-library/COMPONENT-INDEX.md`:

```
| Queue Item | `queue-item.html` | `queue-item`, `queue-item-header`, `queue-item-summary`, `queue-item-meta`, `queue-item-sla` | no | Urgency modifiers: `.is-urgent`, `.is-attention`, `.is-info`. State: `.active`. SLA: `.is-warning`, `.is-breached`. |
| Queue Section Header | `queue-section-header.html` | `queue-section-header` | no | Urgency modifiers: `.is-urgent`, `.is-attention`, `.is-info`. |
```

### Known Constraints
- When adding new components that nest inside cards or other containers, check the parent's border radius and use one step smaller for the child.
- Queue items do NOT nest inside cards — they sit directly in the sidebar, so the border-radius rule does not apply here.

## Expected Result
- `queue-item` and `queue-section-header` classes exist in `components.css`
- Pattern library files exist with examples of all variants
- `COMPONENT-INDEX.md` updated

## Verification
- [ ] `.queue-item` class exists in `src/styles/tokens/components.css`
- [ ] `.queue-section-header` class exists in `src/styles/tokens/components.css`
- [ ] `pattern-library/components/queue-item.html` exists with `@component-meta`
- [ ] `pattern-library/components/queue-section-header.html` exists with `@component-meta`
- [ ] `COMPONENT-INDEX.md` has rows for both components
- [ ] Dark mode variants present for all color/bg/border/text properties
- [ ] HTML classes are semantic — no utility chains in the pattern library HTML (layout utilities like `flex` and `gap` in the wrapper are acceptable)
- [ ] Page renders at http://localhost:5173/pattern-library/components/queue-item.html without errors
- [ ] ANDREY-README.md updated: yes — add queue-item and queue-section-header
- [ ] `src/data/_schema-notes.md` updated: not applicable

## If Something Goes Wrong
- If `border-left: 3px` doesn't work with `@apply`, use the raw CSS property directly. `@apply` does not support arbitrary border-width values in all Tailwind versions.
- If urgency colors don't match the brand palette, check `src/styles/tokens/colors.css` for the exact token names.
