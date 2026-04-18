# CC-SHELL: Admin App Three-Panel Layout

**Application:** Care Coordinator Admin App (Desktop)
**Use Case(s):** UC-CC-01 through UC-CC-05
**User Type:** Care Coordinator
**Device:** Desktop (responsive to tablet — collapses right panel below lg)
**Route:** `/care-coordinator/`

## Page Purpose

The persistent shell for the entire Admin App. Every coordinator screen lives inside this
three-panel layout. The coordinator's day is spent scanning the left (queue), working in the
center (records), and deciding in the right (thread + approvals).

---

## Layout Structure

### Shell

Three fixed panels, no header bar. The queue sidebar IS the navigation.

```
┌──────────────┬─────────────────────────────────┬──────────────────┐
│              │                                 │                  │
│   LEFT       │         CENTER                  │   RIGHT          │
│   ~240px     │         flex-grow                │   ~380px         │
│   fixed      │         min-w-0                  │   fixed          │
│              │                                 │                  │
│  Queue       │  Record / Summary / List         │  Thread          │
│  Sidebar     │                                 │  Panel           │
│              │                                 │                  │
└──────────────┴─────────────────────────────────┴──────────────────┘
```

### Left Panel — Queue Sidebar (CC-QUEUE)
- **Component:** Extends `app-sidebar` pattern
- **Width:** 240px fixed, border-right
- **Content:** See [cc-01-queue-sidebar.md](cc-01-queue-sidebar.md)
- **Scroll:** Independent vertical scroll, does not scroll center or right

### Center Panel — Content
- **Component:** Flex-grow area, no fixed width
- **Min width:** Ensure content doesn't collapse below readable width (~480px)
- **Content:** Varies — morning summary (default), patient record, referral detail, etc.
- **Scroll:** Independent vertical scroll
- **Background:** `bg-gray-50` (slightly recessed from panels)

### Right Panel — Thread
- **Component:** New panel component
- **Width:** 380px fixed, border-left
- **Content:** See [cc-02-thread-panel.md](cc-02-thread-panel.md)
- **Scroll:** Independent vertical scroll, input field fixed at bottom
- **Background:** `bg-white`

---

## Interaction Specifications

### Panel Resize
- **Trigger:** None — panels are fixed width, not resizable
- **Rationale:** Coordinator workflow is optimized for consistent panel sizes. Resizing adds complexity without benefit for this role.

### Responsive Behavior
- **At `lg` and above (≥1024px):** All three panels visible
- **Below `lg`:** Right panel collapses. Thread accessible via a toggle button in the center panel header. Opens as an overlay or slide-in panel.
- **Below `md`:** Left sidebar collapses to hamburger. Center panel is full width. Thread is a separate view.

### Panel Focus
- **Trigger:** Clicking a queue item
- **Feedback:** Center and right panels update simultaneously. No animation — instant swap.
- **Navigation:** Sidebar scroll position preserved when switching items.

---

## States

### Empty State (No Queue Items)
- Left panel: queue section shows empty message (see queue sidebar spec)
- Center panel: morning summary with "Nothing needs your attention right now"
- Right panel: empty — subtle text: "Select a queue item to see its activity" (matches pattern-library thread-panel empty-state copy; the word "activity" was chosen over "thread" because the thread contains the agent's *activity*, not a separate object called a thread)

### Loading State
- Left panel: 4-5 `skeleton` rows in queue section
- Center panel: `skeleton` card
- Right panel: 3-4 `skeleton` rows for thread messages

### Error State
- `alert-error` banner at top of center panel: "Couldn't load your queue. Retrying..."
- Retry button in alert

---

## Accessibility Notes
- Each panel is a landmark region: `role="complementary"` (left), `role="main"` (center), `role="complementary"` (right)
- `aria-label` on each: "Queue sidebar", "Main content", "Activity thread"
- Tab order: left → center → right
- Keyboard shortcut to cycle panels: none at launch (add if coordinator feedback requests it)
- **Do not** focus-trap within a panel. Per WCAG 2.1.2 (No Keyboard Trap, Level A), persistent layouts (not modal dialogs) must allow focus to leave. Natural Tab flow moves through focusable elements in DOM order (queue items, then any focusable elements in center/right); Shift+Tab returns; Tab past the last focusable item moves to browser chrome. Focus trapping is only correct inside a modal dialog per the APG dialog pattern. (Wireframe originally specified trapping; corrected after a11y round-1 review of slice 2.)

## Open Questions
- Should the right panel have a close/minimize control on desktop? Or is it always visible?
- Should the center panel show breadcrumbs when navigating between views (summary → record → patient list)?

---

## New Components Flagged
- `[NEW COMPONENT: three-panel app shell with fixed side panels and flex center]` — extends `app-sidebar` pattern but with a right panel added
