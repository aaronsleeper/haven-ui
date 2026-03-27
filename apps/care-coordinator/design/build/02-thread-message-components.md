# Task 02: Thread Message Components — CSS + Pattern Library

## Scope
Pattern library + CSS

## Context
Creates the four thread message type components: system event, tool call, human message, and approval response. These render in the thread panel's chronological message list.

## Prerequisites
- None (can run parallel with 01 and 03)

## Files to Read First
- `src/styles/tokens/components.css` — add after queue components section
- `apps/care-coordinator/design/new-components/thread-msg-system.md`
- `apps/care-coordinator/design/new-components/thread-msg-tool-call.md`
- `apps/care-coordinator/design/new-components/thread-msg-human.md`
- `apps/care-coordinator/design/new-components/thread-msg-response.md`

## Instructions

### Step 1: Add semantic classes to components.css

Add after the Queue Components section:

```css
/* ================================================================
   Thread Message Components (Care Coordinator / Provider)
   ================================================================ */

/* System event — compact, centered, muted */
.thread-msg-system {
    @apply flex items-center justify-between px-4 py-1.5;
    @apply text-xs text-gray-400;
    @apply dark:text-gray-500;
}

.thread-msg-time {
    @apply text-xs text-gray-400 shrink-0 ml-2;
    @apply dark:text-gray-500;
}

/* Agent tool call — icon + expandable payload */
.thread-msg-tool {
    @apply flex gap-2 px-4 py-2;
}

.thread-msg-tool-icon {
    @apply w-6 h-6 rounded-full flex items-center justify-center shrink-0;
    @apply bg-violet-100 text-violet-600 text-xs;
    @apply dark:bg-violet-900/30 dark:text-violet-400;
}

.thread-msg-tool-content {
    @apply flex-1 min-w-0;
}

.thread-msg-tool-name {
    @apply text-xs text-gray-600;
    font-family: var(--font-mono);
    @apply dark:text-gray-400;
}

.thread-msg-tool-result {
    @apply text-xs text-gray-500 ml-1;
    font-family: var(--font-mono);
    @apply dark:text-gray-500;
}

.thread-msg-tool-detail {
    @apply mt-1 p-2 bg-gray-50 rounded-lg text-xs;
    font-family: var(--font-mono);
    @apply dark:bg-neutral-800;
}

/* Human message — right-aligned bubble */
.thread-msg-human {
    @apply flex flex-col items-end px-4 py-2;
}

.thread-msg-human-label {
    @apply text-xs font-medium text-primary-600 mb-0.5;
    @apply dark:text-primary-400;
}

.thread-msg-human-bubble {
    @apply bg-primary-50 text-sm text-gray-900 px-3 py-2 rounded-xl rounded-tr-none;
    @apply max-w-[85%];
    @apply dark:bg-primary-900/20 dark:text-gray-100;
}

/* Approval response — collapsed decision summary */
.thread-msg-response {
    @apply px-4 py-1.5;
}

.thread-msg-response .collapse-toggle {
    @apply flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer;
    @apply hover:text-gray-900 transition-colors;
    @apply dark:text-gray-400 dark:hover:text-gray-200;
}

.thread-msg-response .collapse-toggle strong {
    @apply font-medium;
}

.thread-msg-response.is-approved .collapse-toggle i {
    @apply text-green-600;
    @apply dark:text-green-400;
}

.thread-msg-response.is-rejected .collapse-toggle i {
    @apply text-red-600;
    @apply dark:text-red-400;
}

.thread-msg-response-detail {
    @apply mt-2;
}
```

### Step 2: Create pattern library files

Create four pattern library files, each with `@component-meta` header:

**`pattern-library/components/thread-msg-system.html`**
Show 2-3 example system messages with timestamps.

**`pattern-library/components/thread-msg-tool-call.html`**
Show a tool call with the agent icon, tool name, condensed result, and an expandable detail section using `data-hs-collapse`. Show both collapsed and expanded states.

**`pattern-library/components/thread-msg-human.html`**
Show 2 example human messages, right-aligned with the label and bubble.

**`pattern-library/components/thread-msg-response.html`**
Show an approved response and a rejected response, with the collapse toggle for re-expanding.

### Step 3: Update COMPONENT-INDEX.md

Add rows to a new "Thread / Agent" section:

```
| Thread System Message | `thread-msg-system.html` | `thread-msg-system`, `thread-msg-time` | no | Compact system event with timestamp |
| Thread Tool Call | `thread-msg-tool-call.html` | `thread-msg-tool`, `thread-msg-tool-icon`, `thread-msg-tool-content`, `thread-msg-tool-name`, `thread-msg-tool-result`, `thread-msg-tool-detail` | yes — HSCollapse | Agent action with expandable payload |
| Thread Human Message | `thread-msg-human.html` | `thread-msg-human`, `thread-msg-human-label`, `thread-msg-human-bubble` | no | Right-aligned coordinator message |
| Thread Approval Response | `thread-msg-response.html` | `thread-msg-response`, `thread-msg-response-detail` | yes — HSCollapse | Collapsed decision summary. Modifiers: `.is-approved`, `.is-rejected`. |
```

### Known Constraints
- Preline `hs-collapse` controls expand/collapse. Use `data-hs-collapse="#id"` on the toggle, `id` + `class="collapse-content hidden"` on the target.
- Do NOT add Preline CDN script — it loads via Vite module.
- When nesting components inside others, use one step smaller border-radius.

## Expected Result
- 4 thread message semantic class groups in `components.css`
- 4 pattern library files with examples
- `COMPONENT-INDEX.md` updated with new section

## Verification
- [ ] `.thread-msg-system` class exists in `components.css`
- [ ] `.thread-msg-tool` class exists in `components.css`
- [ ] `.thread-msg-human` class exists in `components.css`
- [ ] `.thread-msg-response` class exists in `components.css`
- [ ] 4 pattern library files exist with `@component-meta`
- [ ] `COMPONENT-INDEX.md` has rows for all 4 components
- [ ] Dark mode variants present for all color properties
- [ ] `hs-collapse` expand/collapse works on tool call and approval response
- [ ] HTML classes are semantic
- [ ] ANDREY-README.md updated: yes
- [ ] `src/data/_schema-notes.md`: not applicable

## If Something Goes Wrong
- If `font-family: var(--font-mono)` doesn't work, check `src/styles/tokens/typography.css` for the correct variable name (may be `--font-family-mono` or similar).
- If Preline collapse doesn't initialize, ensure `src/scripts/main.js` is loaded and contains `import 'preline'`.
