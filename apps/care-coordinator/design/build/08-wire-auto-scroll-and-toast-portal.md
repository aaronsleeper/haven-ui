# Task 08: Wire Approval Card Auto-Scroll + Document-Level Toast Portal

## Scope
App only

## Task class
deterministic

## Model tier
sonnet

## Context
Two behaviors need to be wired per locked decisions:

1. **Approval card auto-scroll** — when a queue item is first opened (first record-open), the thread panel should auto-scroll so the active approval card is visible. Subsequent scrolls are user-controlled. Locked decision: `auto-scroll to active approval card on first record-open`.

2. **Document-level toast portal** — the 5-second undo toast (`ThreadUndoBar`) must render at document level (not inside the `<aside>`). The wireframe specifies `toast-container` at the bottom-right of the right pane, but the `ThreadUndoBar` must be portalled outside the `<aside>` element to avoid clip/overflow issues from the panel layout.

## Prerequisites
- Task 07 must be complete

## Files to Read First
- `apps/care-coordinator/src/App.tsx` — how `ThreadUndoBar` is currently rendered (inside `panel-chat` or `panel-content`?)
- `apps/care-coordinator/src/components/thread/ThreadUndoBar.tsx` — current implementation; determine if it already uses `ReactDOM.createPortal`
- `apps/care-coordinator/src/components/thread/ThreadMessageList.tsx` — does it have a ref for the scroll container?

## Instructions

### Step 1 — Implement approval card auto-scroll

The goal: when `activeId` changes (a new queue item is selected), scroll the thread container so the first `thread-approval-card` in the list is visible.

In `App.tsx`, the `panel-chat` div or thread container needs a `ref`. The thread content scroll container is the `<div className="chat-thread">` wrapper (or the `overflow-y-auto` container around the thread).

**Mechanism:**
```tsx
// Track which entry has been "first-opened" so we only auto-scroll once
const firstOpenedRef = useRef<Set<string>>(new Set());

// When activeId changes, mark it for auto-scroll
useEffect(() => {
  if (!activeId) return;
  if (firstOpenedRef.current.has(activeId)) return; // already first-opened

  // Scroll to approval card on the next render tick
  const timer = setTimeout(() => {
    const approvalCard = document.querySelector('.thread-approval-card');
    if (approvalCard) {
      approvalCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    firstOpenedRef.current.add(activeId);
  }, 100); // slight delay to let React render

  return () => clearTimeout(timer);
}, [activeId]);
```

Add this `useEffect` to `App.tsx` after the existing state declarations. Import `useEffect` if not already imported.

**Note:** `document.querySelector('.thread-approval-card')` is acceptable here because there is at most one approval card visible at a time per the data model.

### Step 2 — Move ThreadUndoBar to document-level portal

Open `apps/care-coordinator/src/components/thread/ThreadUndoBar.tsx`.

If `ThreadUndoBar` does NOT already use `ReactDOM.createPortal`:

1. Add `import ReactDOM from 'react-dom';` at the top of `ThreadUndoBar.tsx`.
2. Wrap the returned JSX in `ReactDOM.createPortal(...)` targeting `document.body`:

```tsx
import ReactDOM from 'react-dom';

export function ThreadUndoBar({ message, actionLabel, onAction, onDismiss }: Props) {
  const bar = (
    <div className="toast-container" role="status" aria-live="assertive">
      <div className="toast toast-info">
        <span className="toast-content">
          <span className="toast-description">{message}</span>
        </span>
        {actionLabel && onAction && (
          <button type="button" className="text-link ms-3" onClick={onAction}>
            {actionLabel}
          </button>
        )}
        <button
          type="button"
          className="toast-dismiss"
          aria-label="Dismiss"
          onClick={onDismiss}
        >
          <i className="fa-solid fa-xmark" aria-hidden="true" />
        </button>
      </div>
    </div>
  );

  return ReactDOM.createPortal(bar, document.body);
}
```

If `ThreadUndoBar.tsx` already uses `createPortal`: verify it targets `document.body` (not the `<aside>` element).

**Accessibility:** `role="status"` + `aria-live="assertive"` on the toast container — per wireframe accessibility notes.

### Step 3 — Verify ThreadUndoBar render location in App.tsx

In `App.tsx`, find where `<ThreadUndoBar .../>` is rendered. It should NOT be nested inside `<aside className="panel-content">` or `<main className="panel-chat">`. If it is, move it outside all panel wrappers (after the `</AgenticShell>` closing tag or at the `App()` return's outermost level).

```tsx
return (
  <>
    <AgenticShell>
      {/* ... panels ... */}
    </AgenticShell>
    {/* Toast portal renders to document.body via createPortal — placement here is irrelevant */}
    {undo && (
      <ThreadUndoBar
        message={undo.message}
        actionLabel={undo.message.startsWith('Approved') ? 'Undo' : undefined}
        onAction={undo.message.startsWith('Approved') ? handleUndoAction : undefined}
        onDismiss={handleUndoDismiss}
      />
    )}
  </>
);
```

### Known Constraints
- **Toast portal: document-level** (locked decision). NOT inside `<aside>`. Use `ReactDOM.createPortal(bar, document.body)`.
- **Auto-scroll: first record-open only** (locked decision). Do not re-scroll on subsequent renders for the same entry.
- `aria-live="assertive"` on the toast container — screen readers announce approval immediately.
- 5-second undo window: the undo bar dismissal timer (if present) should match the 5-second lock. If `ThreadUndoBar` already has an auto-dismiss timer, confirm it is 5000ms.
- Do NOT add `style={{...}}`.
- Do NOT add CDN scripts.

## Expected Result
- When a queue item is clicked for the first time, the thread panel auto-scrolls to the approval card.
- Clicking the same queue item again does NOT re-scroll.
- The undo toast renders at the bottom of the viewport (document-level), not clipped by the panel layout.
- `role="status"` + `aria-live="assertive"` on the toast container.

## Verification
- [ ] Auto-scroll fires on first record-open (approval card scrolls into view)
- [ ] Auto-scroll does NOT fire on second/subsequent click of the same item
- [ ] `ThreadUndoBar` uses `ReactDOM.createPortal(bar, document.body)`
- [ ] Toast renders visible at viewport level (not clipped by `overflow: hidden` panel)
- [ ] Toast container has `role="status"` and `aria-live="assertive"`
- [ ] Auto-dismiss (if present in `ThreadUndoBar`) is 5000ms
- [ ] No `style={{...}}` added
- [ ] `pnpm typecheck` passes
- [ ] HTML classes are semantic — no utility chains on styled elements
- [ ] Dark mode — N/A (no CSS changes)
- [ ] `_schema-notes.md` — not applicable

## Completion Report

```
## Completion Report — Task 08: Wire Approval Card Auto-Scroll + Document-Level Toast Portal

- New semantic classes added to components.css: none
- Existing classes modified: none
- Pattern library files created or updated: none
- Judgment calls: none
- Dark mode added: not applicable
- Schema delta logged: not applicable
- Items deferred or incomplete: [list any, or "none"]
- Auto-scroll mechanism: [describe — useEffect + querySelector / ref-based]
- Portal target: [document.body confirmed / other]
- Auto-dismiss timer: [Nms or "not present — manual dismiss only"]
```

## If Something Goes Wrong
- If `document.querySelector('.thread-approval-card')` returns null: the card may not be rendered yet on the tick the query runs. Increase the timeout from 100ms to 200ms, or use a MutationObserver to wait for the card element.
- If `ReactDOM` is not in scope: add `import ReactDOM from 'react-dom'` to `ThreadUndoBar.tsx`.
- If the portal renders behind the panel layout: add `z-index` via a utility class (`z-50`) to the toast container (layout-only, acceptable per CLAUDE.md).
