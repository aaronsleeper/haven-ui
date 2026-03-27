# New Component: Thread Approval Card

## Purpose
The hero interaction component. Agent surfaces a recommendation to the coordinator with
full context and action buttons. This is where human judgment meets agent execution.

## Used In
- CC-THREAD: Primary interaction element in the thread panel
- Provider App thread (future): RDN/BHN approval of clinical sections

## Preline Base
Pure Tailwind implementation. Builds on existing `.card` pattern with approval-specific
modifications. Uses `hs-collapse` for the optional note field expand.

## Proposed Semantic Classes

### Container
`.thread-approval-card` — The full approval card

### Sub-elements
`.thread-approval-header` — Icon + title bar
`.thread-approval-body` — Context, summary, downstream effects
`.thread-approval-context` — What this is about (patient, type, time)
`.thread-approval-summary` — Key facts for the decision
`.thread-approval-effects` — "Approving will:" list
`.thread-approval-actions` — Button row
`.thread-approval-note` — Optional note textarea
`.thread-approval-attachment` — Attachment indicator

### Urgency variants
`.thread-approval-card.is-urgent` — Red left border + subtle red tint
`.thread-approval-card.is-warning` — Amber left border + subtle amber tint
`.thread-approval-card.is-standard` — Primary left border + subtle amber tint (default)

## Implementation Notes

### HTML Structure
```html
<div class="thread-approval-card is-standard">
  <div class="thread-approval-header">
    <i class="fa-solid fa-hand"></i>
    <span>Approval Needed</span>
  </div>
  <div class="thread-approval-body">
    <div class="thread-approval-context">
      <span class="text-sm font-medium">Care plan draft · Maria Garcia</span>
      <span class="text-xs text-gray-500">Prepared by agent · 3 min ago</span>
    </div>
    <div class="thread-approval-summary">
      <!-- Varies by item type — goals, nutrition params, referral data, etc. -->
      <p class="text-sm">Goals (2)</p>
      <ul class="text-sm text-gray-700">
        <li>HbA1c &lt; 8.0% within 6 months</li>
        <li>Weight loss 5–8% within 6 months</li>
      </ul>
    </div>
    <div class="thread-approval-effects">
      <span class="text-xs font-medium text-gray-500">Approving will:</span>
      <ul class="text-xs text-gray-600">
        <li>Set patient status to active</li>
        <li>Start meal prescription matching</li>
        <li>Schedule first RDN visit</li>
      </ul>
    </div>
    <div class="thread-approval-attachment">
      <i class="fa-solid fa-paperclip"></i>
      <span>1 attachment</span>
      <a href="#" class="text-link">View</a>
    </div>
  </div>
  <div class="thread-approval-actions">
    <button class="btn-primary btn-sm">Approve</button>
    <button class="btn-outline btn-sm">Edit first</button>
    <button class="btn-outline btn-sm">Reject with note</button>
    <button class="btn-outline btn-sm">Reassign</button>
  </div>
  <div class="thread-approval-note">
    <textarea placeholder="Add a note (optional)" rows="2"></textarea>
  </div>
</div>
```

### @apply Definitions
```css
.thread-approval-card {
    @apply bg-amber-50 border border-amber-200 rounded-xl shadow-sm;
    @apply border-l-4 border-l-primary-500;
    @apply p-0 mx-3 my-2;
}

.thread-approval-card.is-urgent {
    @apply bg-red-50 border-red-200 border-l-red-500;
}

.thread-approval-card.is-warning {
    @apply bg-amber-50 border-amber-200 border-l-amber-500;
}

.thread-approval-header {
    @apply flex items-center gap-2 px-4 pt-3 pb-2;
    @apply text-sm font-semibold text-gray-900;
}

.thread-approval-header i {
    @apply text-amber-600;
}

.thread-approval-body {
    @apply px-4 pb-3 space-y-3;
}

.thread-approval-context {
    @apply flex flex-col gap-0.5;
}

.thread-approval-summary {
    @apply text-sm text-gray-700 space-y-1;
}

.thread-approval-summary ul {
    @apply list-disc list-inside text-sm text-gray-600 space-y-0.5;
}

.thread-approval-effects {
    @apply pt-2 border-t border-amber-200 space-y-1;
}

.thread-approval-effects ul {
    @apply list-disc list-inside;
}

.thread-approval-actions {
    @apply flex flex-wrap gap-2 px-4 py-3 border-t border-amber-200;
}

.thread-approval-note {
    @apply px-4 pb-3;
}

.thread-approval-note textarea {
    @apply w-full text-sm rounded-lg border-gray-300;
    @apply focus:ring-primary-500 focus:border-primary-500;
}

.thread-approval-attachment {
    @apply flex items-center gap-1.5 text-xs text-gray-500;
}
```

### States
- **Default (pending):** Full card visible with action buttons. Background `bg-amber-50`.
- **Hover on buttons:** Standard button hover states.
- **After approve:** Card collapses, replaced by `thread-msg-response`. Toast appears.
- **After reject:** Note field required. Card collapses after rejection confirmed.
- **Historical (read-only):** Same layout but action buttons hidden. Rendered inside a `collapse` when expanding a past `thread-msg-response`.

### Dark Mode
```css
.thread-approval-card {
    @apply dark:bg-amber-900/20 dark:border-amber-800 dark:border-l-primary-400;
}

.thread-approval-card.is-urgent {
    @apply dark:bg-red-900/20 dark:border-red-800 dark:border-l-red-400;
}

.thread-approval-header {
    @apply dark:text-gray-100;
}

.thread-approval-header i {
    @apply dark:text-amber-400;
}

.thread-approval-summary {
    @apply dark:text-gray-300;
}

.thread-approval-effects {
    @apply dark:border-amber-800;
}

.thread-approval-actions {
    @apply dark:border-amber-800;
}
```

### Responsive Behavior
- At full panel width (380px): all content displays normally.
- Below `lg` when thread is an overlay: card takes full overlay width.
- Buttons wrap via `flex-wrap` if space is tight.

### Accessibility
- Card container: `role="alert"` with `aria-label="Approval needed: [item description]"`
- Action buttons: standard button semantics, no special ARIA
- Note textarea: `aria-label="Optional note for this decision"`
- Urgency conveyed by text in header, not color alone

## Pattern Library
- [ ] Component file needed: `pattern-library/components/thread-approval-card.html`
- [ ] `COMPONENT-INDEX.md` row needed

## Priority
Required for launch — this is the hero component.
