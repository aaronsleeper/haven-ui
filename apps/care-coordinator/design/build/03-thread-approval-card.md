# Task 03: Thread Approval Card — CSS + Pattern Library

## Scope
Pattern library + CSS

## Context
The hero component. This is the primary interaction element between the coordinator and the agent system. Creates the approval card with context, recommendation, downstream effects, action buttons, and optional note field.

## Prerequisites
- None (can run parallel with 01 and 02)

## Files to Read First
- `src/styles/tokens/components.css` — add after thread message components
- `apps/care-coordinator/design/new-components/thread-approval-card.md` — full spec

## Instructions

### Step 1: Add semantic classes to components.css

Add after the Thread Message Components section:

```css
/* ================================================================
   Thread Approval Card (THE HERO COMPONENT)
   ================================================================ */

.thread-approval-card {
    @apply border rounded-xl shadow-sm;
    @apply p-0 mx-3 my-2;
    background-color: theme(--color-amber-50);
    border-color: theme(--color-amber-200);
    border-left: 4px solid theme(--color-primary-500);
    @apply dark:bg-amber-900/20 dark:border-amber-800;
    dark: border-left-color: theme(--color-primary-400);
}

.thread-approval-card.is-urgent {
    background-color: theme(--color-red-50);
    border-color: theme(--color-red-200);
    border-left-color: theme(--color-red-500);
    @apply dark:bg-red-900/20 dark:border-red-800;
}

.thread-approval-card.is-warning {
    border-left-color: theme(--color-amber-500);
    @apply dark:border-l-amber-400;
}

.thread-approval-header {
    @apply flex items-center gap-2 px-4 pt-3 pb-2;
    @apply text-sm font-semibold text-gray-900;
    @apply dark:text-gray-100;
}

.thread-approval-header i {
    @apply text-amber-600;
    @apply dark:text-amber-400;
}

.thread-approval-body {
    @apply px-4 pb-3 space-y-3;
}

.thread-approval-context {
    @apply flex flex-col gap-0.5;
}

.thread-approval-context > :first-child {
    @apply text-sm font-medium text-gray-900;
    @apply dark:text-gray-100;
}

.thread-approval-context > :last-child {
    @apply text-xs text-gray-500;
    @apply dark:text-gray-400;
}

.thread-approval-summary {
    @apply text-sm text-gray-700 space-y-1;
    @apply dark:text-gray-300;
}

.thread-approval-summary ul {
    @apply list-disc list-inside text-sm text-gray-600 space-y-0.5;
    @apply dark:text-gray-400;
}

.thread-approval-effects {
    @apply pt-2 space-y-1;
    border-top: 1px solid theme(--color-amber-200);
    @apply dark:border-amber-800;
}

.thread-approval-effects > :first-child {
    @apply text-xs font-medium text-gray-500;
    @apply dark:text-gray-400;
}

.thread-approval-effects ul {
    @apply list-disc list-inside text-xs text-gray-600;
    @apply dark:text-gray-400;
}

.thread-approval-attachment {
    @apply flex items-center gap-1.5 text-xs text-gray-500;
    @apply dark:text-gray-400;
}

.thread-approval-actions {
    @apply flex flex-wrap gap-2 px-4 py-3;
    border-top: 1px solid theme(--color-amber-200);
    @apply dark:border-amber-800;
}

.thread-approval-note {
    @apply px-4 pb-3;
}

.thread-approval-note textarea {
    @apply w-full text-sm rounded-lg;
    border-color: theme(--color-gray-300);
    @apply focus:ring-primary-500 focus:border-primary-500;
    @apply dark:bg-neutral-800 dark:border-neutral-600 dark:text-gray-200;
}
```

**Note:** Some properties use raw CSS instead of `@apply` because Tailwind v4 doesn't support arbitrary border-left widths or theme() in `@apply` for some properties. This is acceptable per Haven conventions.

### Step 2: Create pattern library file

Create `pattern-library/components/thread-approval-card.html` with `@component-meta`:

```html
<!--
@component-meta
name: Thread Approval Card
category: Thread / Agent
classes: thread-approval-card, thread-approval-header, thread-approval-body, thread-approval-context, thread-approval-summary, thread-approval-effects, thread-approval-attachment, thread-approval-actions, thread-approval-note
variants: is-urgent, is-warning
preline: false
notes: THE HERO COMPONENT. Agent recommendation + action buttons. Shows context, downstream effects, and optional note. Urgency variants change border and background tint.
-->
```

Show three variants:
1. **Standard (care plan approval):** Default styling with goals summary, downstream effects, all four action buttons, note field, attachment indicator
2. **Urgent (eligibility failure):** `.is-urgent` with red tint, eligibility failure context
3. **Read-only (historical):** Same card without action buttons — used inside `thread-msg-response` expand

### Step 3: Update COMPONENT-INDEX.md

Add to the Thread / Agent section:

```
| Thread Approval Card | `thread-approval-card.html` | `thread-approval-card`, `thread-approval-header`, `thread-approval-body`, `thread-approval-context`, `thread-approval-summary`, `thread-approval-effects`, `thread-approval-attachment`, `thread-approval-actions`, `thread-approval-note` | no | THE HERO. Urgency modifiers: `.is-urgent`, `.is-warning`. Uses `.btn-primary btn-sm` and `.btn-outline btn-sm` for actions. |
```

### Known Constraints
- When nesting the approval card inside a thread panel, the card's `rounded-xl` is appropriate because it sits in a flat container (no parent card wrapping it).
- Button variants: do not put size on a base button rule. The `.btn-sm` modifier handles sizing.

## Expected Result
- `thread-approval-card` and all sub-element classes exist in `components.css`
- Pattern library file with 3 variant examples
- `COMPONENT-INDEX.md` updated

## Verification
- [ ] `.thread-approval-card` class exists in `components.css`
- [ ] All 9 sub-element classes exist
- [ ] `pattern-library/components/thread-approval-card.html` exists with `@component-meta`
- [ ] Standard, urgent, and read-only variants shown
- [ ] Action buttons use `.btn-primary btn-sm` and `.btn-outline btn-sm` (not custom button classes)
- [ ] Dark mode variants present for all color properties
- [ ] HTML classes are semantic
- [ ] ANDREY-README.md updated: yes
- [ ] `src/data/_schema-notes.md`: not applicable

## If Something Goes Wrong
- If `theme()` function doesn't work in raw CSS properties, replace with the hex value from `colors.css`. Check `src/styles/tokens/colors.css` for the exact values.
- If the `border-left: 4px solid` conflicts with the `border` shorthand, separate them: set `border` for the standard border, then override `border-left-width` and `border-left-color` separately.
