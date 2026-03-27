# New Component: Queue Section Header

## Purpose
Labels each urgency tier in the queue sidebar with icon, label, and count.

## Used In
- CC-QUEUE: 3 instances (Urgent, Needs Attention, Informational)

## Preline Base
Pure Tailwind. No JS needed.

## Proposed Semantic Classes
`.queue-section-header` — Section header row
`.queue-section-header.is-urgent` — Red styling
`.queue-section-header.is-attention` — Amber styling
`.queue-section-header.is-info` — Gray styling

## Implementation Notes

### HTML Structure
```html
<div class="queue-section-header is-urgent">
  <i class="fa-solid fa-circle-exclamation"></i>
  <span>Urgent · 2</span>
</div>
```

### @apply Definitions
```css
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

### Dark Mode
Included inline above.

### Accessibility
- `role="heading"` with `aria-level="3"`
- Count included in text, not as a separate badge

## Pattern Library
- [ ] `pattern-library/components/queue-section-header.html`
- [ ] `COMPONENT-INDEX.md` row

## Priority
Required for launch.
