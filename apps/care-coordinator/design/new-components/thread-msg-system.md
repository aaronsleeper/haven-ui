# New Component: Thread Message — System Event

## Purpose
Compact, muted system event line in the thread. Timestamps, status changes, automated events.

## Used In
- CC-THREAD: Between other message types

## Preline Base
Pure Tailwind.

## Proposed Semantic Classes
`.thread-msg-system`

### HTML Structure
```html
<div class="thread-msg-system">
  <span>Assessment complete. Initiating care plan.</span>
  <span class="thread-msg-time">9:02am</span>
</div>
```

### @apply Definitions
```css
.thread-msg-system {
    @apply flex items-center justify-between px-4 py-1.5;
    @apply text-xs text-gray-400;
    @apply dark:text-gray-500;
}

.thread-msg-time {
    @apply text-xs text-gray-400 shrink-0 ml-2;
    @apply dark:text-gray-500;
}
```

### Dark Mode
Included inline.

### Accessibility
- `role="status"` — non-intrusive announcement

## Pattern Library
- [ ] `pattern-library/components/thread-msg-system.html`
- [ ] `COMPONENT-INDEX.md` row

## Priority
Required for launch.
