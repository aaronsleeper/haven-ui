# New Component: Queue Item

## Purpose
A sidebar queue item showing patient name, item type, one-line summary, and SLA status.
The left border color indicates urgency tier. This is the coordinator's primary scanning
target — they process dozens of these daily.

## Used In
- CC-QUEUE: Repeated within each urgency section
- CC-SUMMARY: Simplified version in urgent items preview (reuses core styling)

## Preline Base
Pure Tailwind implementation. No Preline JS needed.

## Proposed Semantic Classes

### Container
`.queue-item` — Single queue item row

### Sub-elements
`.queue-item-header` — Top line: patient name + type badge
`.queue-item-summary` — Middle line: agent summary text
`.queue-item-meta` — Bottom line: time + SLA indicator

### Urgency variants
`.queue-item.is-urgent` — `border-l-red-500`
`.queue-item.is-attention` — `border-l-amber-400`
`.queue-item.is-info` — `border-l-gray-200`

### State modifiers
`.queue-item.active` — Currently selected item
`.queue-item.is-info` items: slightly muted

## Implementation Notes

### HTML Structure
```html
<div class="queue-item is-urgent">
  <div class="queue-item-header">
    <span class="text-sm font-medium text-gray-900 truncate">Maria Garcia</span>
    <span class="badge badge-sm badge-pill">Care Plan</span>
  </div>
  <div class="queue-item-summary">Care plan ready for final approval</div>
  <div class="queue-item-meta">
    <span>2h ago</span>
    <span class="queue-item-sla is-warning">
      <i class="fa-solid fa-clock"></i> Due in 1h
    </span>
  </div>
</div>
```

### @apply Definitions
```css
.queue-item {
    @apply block px-3 py-2.5 cursor-pointer;
    @apply border-l-3 border-l-gray-200;
    @apply hover:bg-gray-50 transition-colors duration-100;
}

.queue-item.is-urgent {
    @apply border-l-red-500;
}

.queue-item.is-attention {
    @apply border-l-amber-400;
}

.queue-item.is-info {
    @apply border-l-gray-200 opacity-80;
}

.queue-item.active {
    @apply bg-primary-50;
}

.queue-item-header {
    @apply flex items-center justify-between gap-2;
}

.queue-item-summary {
    @apply text-xs text-gray-600 truncate mt-0.5;
}

.queue-item-meta {
    @apply flex items-center justify-between text-xs text-gray-400 mt-1;
}

.queue-item-sla {
    @apply flex items-center gap-1;
}

.queue-item-sla.is-warning {
    @apply text-amber-600 font-medium;
}

.queue-item-sla.is-breached {
    @apply text-red-600 font-medium;
}
```

### States
- **Default:** White background, urgency left border, normal text
- **Hover:** `bg-gray-50`
- **Active/Selected:** `bg-primary-50` (urgency border preserved)
- **Informational:** `opacity-80` for subtle muting

### Dark Mode
```css
.queue-item {
    @apply dark:hover:bg-neutral-800;
}

.queue-item.active {
    @apply dark:bg-primary-900/20;
}

.queue-item-header span:first-child {
    @apply dark:text-gray-100;
}

.queue-item-summary {
    @apply dark:text-gray-400;
}

.queue-item-meta {
    @apply dark:text-gray-500;
}
```

### Responsive Behavior
- Fixed within 240px sidebar. Content truncates with ellipsis as needed.
- On mobile (sidebar collapsed): same component renders in a slide-out drawer.

### Accessibility
- `role="option"` within a `role="listbox"` container
- `aria-selected="true"` on active item
- `aria-label` includes urgency: e.g., "Urgent: Maria Garcia, care plan approval"
- SLA text readable by screen reader (not icon-only)

## Pattern Library
- [ ] Component file needed: `pattern-library/components/queue-item.html`
- [ ] `COMPONENT-INDEX.md` row needed

## Priority
Required for launch.
