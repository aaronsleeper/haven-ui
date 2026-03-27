# New Component: Thread Message — Agent Tool Call

## Purpose
Shows an agent action with tool name, condensed result, and expandable full payload.
The agent avatar distinguishes these from system messages.

## Used In
- CC-THREAD: Multiple per workflow, between system messages and approval cards

## Preline Base
Uses `hs-collapse` for expand/collapse of full payload.

## Proposed Semantic Classes
`.thread-msg-tool` — Container
`.thread-msg-tool-icon` — Agent avatar circle
`.thread-msg-tool-content` — Tool name + result
`.thread-msg-tool-name` — Monospace tool name
`.thread-msg-tool-result` — Condensed result line
`.thread-msg-tool-detail` — Expandable full payload

### HTML Structure
```html
<div class="thread-msg-tool">
  <div class="thread-msg-tool-icon">
    <i class="fa-solid fa-bolt"></i>
  </div>
  <div class="thread-msg-tool-content">
    <button class="collapse-toggle" data-hs-collapse="#tool-detail-1">
      <span class="thread-msg-tool-name">◎ read_patient_assessment</span>
      <span class="thread-msg-tool-result">→ { phq9: 7, sdoh: 3 }</span>
      <span class="thread-msg-time">9:02am</span>
    </button>
    <div id="tool-detail-1" class="thread-msg-tool-detail collapse-content hidden">
      <pre class="text-xs text-gray-500 font-mono whitespace-pre-wrap">
{
  "phq9_score": 7,
  "sdoh_risk": 3,
  "dietary_restrictions": ["nut-free"],
  ...
}
      </pre>
    </div>
  </div>
</div>
```

### @apply Definitions
```css
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
    @apply text-xs font-mono text-gray-600;
    @apply dark:text-gray-400;
}

.thread-msg-tool-result {
    @apply text-xs font-mono text-gray-500 ml-1;
    @apply dark:text-gray-500;
}

.thread-msg-tool-detail {
    @apply mt-1 p-2 bg-gray-50 rounded-lg;
    @apply dark:bg-neutral-800;
}
```

### Dark Mode
Included inline.

### Accessibility
- Collapse toggle: `aria-expanded`, `aria-controls`
- Tool name readable by screen reader

## Pattern Library
- [ ] `pattern-library/components/thread-msg-tool-call.html`
- [ ] `COMPONENT-INDEX.md` row

## Priority
Required for launch.
