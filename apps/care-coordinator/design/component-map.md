# Component Map: Care Coordinator Queue Triage

**Date:** 2026-03-27
**Source wireframes:** cc-shell-layout.md, cc-01-queue-sidebar.md, cc-02-thread-panel.md, cc-03-morning-summary.md
**components.css read:** 2026-03-27
**COMPONENT-INDEX.md read:** 2026-03-27

## Component Inventory Summary

**Existing components used:** 18
**New components needed:** 7
**Utility-only patterns:** 3

## New Components Required

| Component | Spec File | Priority | Preline Base |
|-----------|-----------|----------|--------------|
| Queue Item | `new-components/queue-item.md` | Required | No |
| Queue Section Header | `new-components/queue-section-header.md` | Required | No |
| Thread Approval Card | `new-components/thread-approval-card.md` | Required | No |
| Thread Message System | `new-components/thread-msg-system.md` | Required | No |
| Thread Message Tool Call | `new-components/thread-msg-tool-call.md` | Required | HSCollapse |
| Thread Message Human | `new-components/thread-msg-human.md` | Required | No |
| Thread Message Approval Response | `new-components/thread-msg-response.md` | Required | HSCollapse |

## Existing Components Reused

| Component | Class | Used In |
|-----------|-------|---------|
| App Sidebar Shell | `app-sidebar`, `app-sidebar-header`, `app-sidebar-brand`, `app-sidebar-nav` | CC-SHELL left panel |
| Sidebar Nav | `sidebar-nav-list`, `sidebar-nav-item`, `sidebar-nav-section` | CC-QUEUE navigation |
| Card | `card`, `card-header`, `card-title`, `card-body` | CC-03 morning summary, approval card container |
| Stat Card | `card-stat`, `stat-label`, `stat-value` | CC-03 queue counts |
| Badge | `badge`, `badge-sm`, `badge-pill` | Queue item type badge |
| Badge Success/Warning/Error | `badge-success`, `badge-warning`, `badge-error` | SLA indicators |
| Filter Pill | `filter-pill` | CC-QUEUE type filters |
| List Group | `list-group`, `list-group-flush` | CC-03 urgent items preview |
| Divider | `divider-compact` | CC-03 section separator |
| Section Title | `section-title` | CC-03 scheduled items |
| Empty State | `empty-state`, `empty-state-icon` | CC-QUEUE empty, CC-THREAD empty |
| Skeleton | `skeleton`, `skeleton-text`, `skeleton-text-sm` | Loading states |
| Alert Error | `alert`, `alert-error` | Error states |
| Collapse | `collapse-toggle`, `collapse-content` | Tool call expand |
| Prompt Input | `prompt-input-container`, `prompt-textarea` | CC-THREAD input (adapted) |
| Avatar | `avatar-xs` | Thread agent avatar |
| Indicator | `indicator-pulse` | Agent working state |
| Toast | `toast`, `toast-content`, `toast-progress` | Undo approve toast |
| Dropdown | `hs-dropdown-menu`, `hs-dropdown-item` | Filter "More" dropdown |

---

## Screen: CC-SHELL (Three-Panel Layout)

**Wireframe source:** `wireframes/cc-shell-layout.md`

### Recipe

1. **Shell:** Utility layout — `flex h-screen overflow-hidden`
2. **Left panel:**
   - `app-sidebar` (extended — see note) — 240px fixed, `overflow-y-auto`
   - Contains CC-QUEUE content
3. **Center panel:**
   - Utility: `flex-1 min-w-0 overflow-y-auto bg-gray-50`
   - Contains CC-SUMMARY or record viewer
4. **Right panel:**
   - Utility: `w-[380px] shrink-0 border-l border-gray-200 flex flex-col overflow-hidden bg-white`
   - Contains CC-THREAD content

### Notes
- The existing `app-sidebar` uses `fixed` positioning with `lg:ps-64` on the content area. For a three-panel layout, we need `flex` instead of `fixed` so all three panels participate in the same flex row. This is a layout-level adaptation, not a new component — use utility classes on the shell container.
- Right panel uses `flex flex-col` so the thread input can be `mt-auto` pinned to bottom.

---

## Screen: CC-QUEUE (Queue Sidebar)

**Wireframe source:** `wireframes/cc-01-queue-sidebar.md`

### Recipe

1. **Sidebar header:** `app-sidebar-header` + `app-sidebar-brand` with Cena logo + "Ava"
2. **Queue summary bar:** Utility layout — `flex items-center justify-around px-3 py-2`
   - 3x urgency counts: `text-2xl font-bold` in urgency colors + `text-xs` label
   - These are simple enough to not need a new component
3. **Filter pills:** `filter-pill` × 4 visible + `hs-dropdown` for "More"
4. **Urgency sections:** × 3 (urgent, needs attention, informational)
   - Section header: **NEW** `queue-section-header`
   - Items: **NEW** `queue-item` (repeated)
5. **Divider:** `divider-compact`
6. **Navigation:** `sidebar-nav-list` + `sidebar-nav-item` × 4

### Data Bindings
- `*ngFor` on queue items within each urgency section
- Queue counts bound to filtered array lengths
- Filter pill `.active` toggled by selected filter
- `queue-item.active` bound to currently selected item

### Preline Interactions
- `hs-dropdown` on the "More" filter pill

---

## Screen: CC-THREAD (Thread Panel)

**Wireframe source:** `wireframes/cc-02-thread-panel.md`

### Recipe

1. **Thread header:** Utility layout — `flex items-center justify-between px-4 py-2.5 border-b border-gray-200`
   - Title: `text-sm font-semibold text-gray-900`
2. **Message list:** `flex-1 overflow-y-auto px-0 py-3` — scrollable area
   - **System message:** **NEW** `thread-msg-system`
   - **Tool call message:** **NEW** `thread-msg-tool-call` (uses `collapse` for expand)
   - **Approval card:** **NEW** `thread-approval-card` (card-based)
   - **Human message:** **NEW** `thread-msg-human`
   - **Approval response:** **NEW** `thread-msg-response` (uses `collapse` for re-expand)
3. **Agent working indicator:** `indicator-pulse` + `text-xs text-gray-500`
4. **Thread input:** Adapted `prompt-input-container` — `border-t border-gray-200 p-3 mt-auto`
   - Textarea with send button (`btn-icon btn-icon-primary` + `fa-paper-plane`)

### Data Bindings
- `*ngFor` on thread messages, switching template by `message_type`
- Approval card conditionally renders action buttons (only on pending items)
- Thread input bound to send action

### Preline Interactions
- `hs-collapse` on tool call messages (expand/collapse payload)
- `hs-collapse` on approval response messages (expand to read-only card)

---

## Screen: CC-SUMMARY (Morning Summary)

**Wireframe source:** `wireframes/cc-03-morning-summary.md`

### Recipe

1. **Summary card:** `card`
   - **Card header:**
     - Greeting: `text-lg font-semibold text-gray-900` (Plus Jakarta Sans)
     - Date: `text-sm text-gray-500`
   - **Card body:**
     - Queue counts: `grid grid-cols-3 gap-4` → 3x `card-stat` with urgency-colored `stat-value`
     - Nothing-urgent variant: single line with `fa-circle-check text-green-600`
     - Urgent items preview: `section-title` + `list-group list-group-flush`
       - Each item: patient name + summary + SLA (utility classes, not a new component — these mirror queue items but simpler)
     - `divider-compact`
     - Scheduled items: `section-title` + simple list with time + description

### Data Bindings
- Queue counts from queue data
- Urgent items list from filtered queue (urgency === 'urgent', limit 5)
- Scheduled items from calendar/schedule data
- Greeting name from auth context
- Time-of-day greeting computed client-side

### Preline Interactions
- None
