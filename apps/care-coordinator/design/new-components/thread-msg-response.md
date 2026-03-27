# New Component: Thread Message — Approval Response

## Purpose
Collapsed single-line summary of a past decision. Expandable to show the original
approval card in read-only mode.

## Used In
- CC-THREAD: After an approval or rejection action. Historical decisions throughout the thread.

## Preline Base
Uses `hs-collapse` for expand to read-only approval card.

## Proposed Semantic Classes
`.thread-msg-response` — Container
`.thread-msg-response.is-approved` — Green icon
`.thread-msg-response.is-rejected` — Red icon
`.thread-msg-response-detail` — Expandable read-only card

### HTML Structure
```html
<div class="thread-msg-response is-approved">
  <button class="collapse-toggle" data-hs-collapse="#response-detail-1">
    <i class="fa-solid fa-circle-check text-green-600"></i>
    <span><strong>Sarah K.</strong> Approved care plan v1.0 · 9:47am</span>
  </button>
  <div id="response-detail-1" class="thread-msg-response-detail collapse-content hidden">
    <!-- Read-only thread-approval-card rendered here -->
  </div>
</div>
```

### @apply Definitions
```css
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

.thread-msg-response.is-rejected .collapse-toggle i {
    @apply text-red-600;
    @apply dark:text-red-400;
}

.thread-msg-response.is-approved .collapse-toggle i {
    @apply text-green-600;
    @apply dark:text-green-400;
}

.thread-msg-response-detail {
    @apply mt-2;
}
```

### Dark Mode
Included inline.

### Accessibility
- Collapse toggle: `aria-expanded`, `aria-controls`
- Icon supplemented by "Approved" / "Rejected" in text

## Pattern Library
- [ ] `pattern-library/components/thread-msg-response.html`
- [ ] `COMPONENT-INDEX.md` row

## Priority
Required for launch.
