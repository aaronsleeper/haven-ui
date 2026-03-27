# New Component: Thread Message — Human

## Purpose
Coordinator's own messages in the thread. Right-aligned, distinct background.

## Used In
- CC-THREAD: When coordinator types a message or the thread records a human decision note

## Preline Base
Pure Tailwind. Adapts from existing `message-bubble-out` pattern but styled for thread context.

## Proposed Semantic Classes
`.thread-msg-human` — Container (right-aligned)
`.thread-msg-human-label` — "You" label
`.thread-msg-human-bubble` — Message content

### HTML Structure
```html
<div class="thread-msg-human">
  <span class="thread-msg-human-label">You</span>
  <div class="thread-msg-human-bubble">
    Check if this patient has secondary insurance
  </div>
  <span class="thread-msg-time">9:15am</span>
</div>
```

### @apply Definitions
```css
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
```

### Dark Mode
Included inline.

### Accessibility
- Standard text content, no special ARIA needed

## Pattern Library
- [ ] `pattern-library/components/thread-msg-human.html`
- [ ] `COMPONENT-INDEX.md` row

## Priority
Required for launch.
