# New Component: Message Bubble

## Purpose
Chat-style message bubbles for the patient messaging screen. Two variants: outgoing (patient, right-aligned) and incoming (care team, left-aligned). Includes date separator and new-message floating pill.

## Used In
- CARE-01: message thread

## Preline Base
None. (Existing `.chat-bubble-user` / `.chat-bubble-ai` classes exist but are styled for the AI prompt interface, not a patient SMS-style thread. New classes needed.)

## Proposed Semantic Classes
- `.message-bubble-out` — outgoing (patient) bubble
- `.message-bubble-in` — incoming (care team) bubble
- `.message-sender-label` — sender role label above incoming bubble
- `.message-date-sep` — date separator between day groups
- `.message-timestamp` — timestamp below bubble
- `.message-new-pill` — floating "new message" pill

## Implementation Notes

### HTML Structure
```html
<!-- Date separator -->
<div class="message-date-sep">
  <span data-i18n-en="Today" data-i18n-es="Hoy">Today</span>
</div>

<!-- Incoming (care team) -->
<div class="flex flex-col items-start mb-3">
  <p class="message-sender-label">Your dietitian</p>
  <div class="message-bubble-in">
    Hi Maria! Your meals for next week are all set. Let me know if you have any questions.
  </div>
  <p class="message-timestamp">9:14 AM</p>
</div>

<!-- Outgoing (patient) -->
<div class="flex flex-col items-end mb-3">
  <div class="message-bubble-out">
    Thanks! Can I swap the salmon for something else?
  </div>
  <p class="message-timestamp text-right">9:16 AM</p>
</div>

<!-- Floating new message pill (static/visible for prototype) -->
<button class="message-new-pill" aria-live="polite">
  <i class="fa-solid fa-arrow-down text-xs"></i>
  <span data-i18n-en="New message" data-i18n-es="Nuevo mensaje">New message</span>
</button>
```

### @apply Definition
```css
.message-bubble-out {
  @apply bg-primary-500 text-white rounded-2xl px-4 py-2 max-w-[80%] text-sm leading-relaxed;
  border-bottom-right-radius: 4px;
  @apply dark:bg-primary-600;
}

.message-bubble-in {
  @apply bg-gray-100 text-gray-900 rounded-2xl px-4 py-2 max-w-[80%] text-sm leading-relaxed;
  border-bottom-left-radius: 4px;
  @apply dark:bg-neutral-800 dark:text-neutral-100;
}

.message-sender-label {
  @apply text-xs text-gray-500 mb-1;
  @apply dark:text-neutral-400;
}

.message-date-sep {
  @apply text-xs text-gray-400 text-center py-2;
  @apply dark:text-neutral-500;
}

.message-timestamp {
  @apply text-xs text-gray-400 mt-1;
  @apply dark:text-neutral-500;
}

.message-new-pill {
  @apply fixed bottom-[128px] left-1/2 -translate-x-1/2 z-30;
  @apply bg-primary-500 text-white rounded-full text-sm px-3 py-1 flex items-center gap-1.5;
  @apply shadow-md;
  @apply dark:bg-primary-600;
}
```

Note: `.message-new-pill` bottom offset assumes 64px bottom nav + 64px compose bar.

### States
- Default: as shown
- Send pending: small `fa-clock` icon below outgoing bubble instead of timestamp
- Send failed: `fa-triangle-exclamation text-error-300` icon (tappable to retry) — static demo only

### Dark Mode
As specified above.

### Responsive Behavior
Bubbles are max 80% of container width. Text wraps naturally.

### Accessibility
- At 200% text zoom bubbles must not cause horizontal scroll — `max-w-[80%]` handles this
- Compose textarea supports native voice dictation (no special handling needed)
- New message pill: `aria-live="polite"` for screen reader announcement

## Pattern Library
[ ] Component file needed: `pattern-library/components/patient-message-bubble.html`
[ ] `COMPONENT-INDEX.md` row needed

## Priority
Required for launch
