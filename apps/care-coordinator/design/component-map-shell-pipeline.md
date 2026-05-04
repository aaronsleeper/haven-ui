# Component Map: Care Coordinator — Universal Shell Pipeline (2026-05-04)

**Date:** 2026-05-04
**Source wireframes:**
- `apps/care-coordinator/design/wireframes/cc-shell-flow.md`
- `apps/care-coordinator/design/wireframes/shell-cc-coordinator.md`
- `apps/care-coordinator/design/wireframes/cc-01-queue-with-care-plan-approval.md`
**components.css read:** 2026-05-04 (fresh)
**COMPONENT-INDEX.md read:** 2026-05-04 (fresh)

> Note: Supersedes the earlier `component-map.md` (dated 2026-03-27, covering the bare three-panel-shell phase) for the shell-pipeline pass only. The prior file remains as historical reference for the queue-triage pass.

---

## Component Inventory Summary

**Existing components used:** 30
**New components required:** 0
**Utility-only patterns:** 3

---

## New Components Required

None. All coordinator primitives ship in PL. The open adoption gap (binding the existing React shell to `AgenticShell` + porting `panel-splitter` drag-resize to React) is a build/dev-tasker concern; no new semantic classes needed.

---

## Screen: shell-cc-coordinator (Persistent Coordinator Shell)

**Wireframe source:** `wireframes/shell-cc-coordinator.md`

### Recipe

1. **Shell root:** `agentic-shell` — inherits from universal shell map; three panes
2. **Left pane — Queue sidebar:**
   - `queue-sidebar` → `queue-sidebar-brand` → `nav-header` + `nav-logo` (Cena wordmark `logo-cenahealth-teal.svg`)
   - `queue-sidebar-body` containing:
     - Filter pills row: `filter-pill` × 5 ("All" / "Referrals" / "Care plans" / "Discharges" / "Insurance") — `.active` on selected; per-user persistence
     - Section: `queue-section-header.is-urgent` — "Urgent" + count + `fa-circle-exclamation`
     - Section: `queue-section-header.is-attention` — "Needs attention" + count + `fa-triangle-exclamation`
     - Section: `queue-section-header.is-info` — "Informational" + count + `fa-circle-info`
   - Each section contains: `queue-list` → `queue-item` (urgency + `.active` + SLA states)
     - `queue-item` anatomy: subject name (Body/02 Semibold) + `badge-pill` type badge + one-line summary (Body/03) + `queue-item-sla` (`.is-warning` at 75% / `.is-breached` at 100%)
   - Below: `divider` → `sidebar-nav-list` → `sidebar-nav-item` × 3 (Patients / Reports / Settings)
   - User menu (pinned bottom): `avatar-sm` + name + `hs-dropdown` (sign-out / profile / help)
3. **Center pane — Record viewer (default: morning summary):**
   - Default orientation: `card` + `card-header` + `card-body` — morning summary composition (cc-03; existing)
   - Item selected: `record-header` (Lora Heading/01 title + status badge + meta) at top + record body using existing `clinical-*` / `data-table` primitives
   - Agent-conversation mode: `chat-thread` + `chat-thread-inner` + `message-agent` + `message-user` + `tool-call` + Ava avatar 44px
4. **Right pane — Thread with thread input:**
   - `thread-panel` → `thread-panel-body` (coordinator allowlist — full)
   - Active approval card (hero): `thread-approval-card.is-urgent` / `.is-warning` / `.is-historical`
   - Thread events: `thread-msg-system`, `thread-msg-tool` (collapsed), `thread-msg-human`, `thread-msg-response`
   - Bottom: `prompt-input-container` — placeholder "Ask Ava or send a note…"
5. **Empty state (no items):** `data-empty-state` in left pane; `thread-panel-empty` in right pane
6. **Loading:** `skeleton` / `skeleton-text` rows all three panes
7. **Error (queue load fails):** `alert-error` at top of left pane + `btn-outline btn-sm` "Try again"

### Data Bindings

- Queue sections: `*ngFor` over urgency-tier groups — `is-urgent` / `is-attention` / `is-info` bound to urgency value
- SLA chip state: `is-warning` if elapsed > 75%; `is-breached` if elapsed > 100%
- Filter pills: per-user `user_prefs.queue_filter` — persisted to user profile
- Queue item `.active`: bound to currently-selected queue item ID; `aria-current="true"`
- Approval card variant: bound to `approval.urgency` field from API

### Preline Interactions

- `hs-dropdown` on user menu
- `data-hs-collapse` on `thread-msg-tool` rows (HSCollapse — default collapsed)
- `panel-splitter.js` — drag-resize both boundaries
- `filter-pill` active toggle — vanilla JS or React local state (no Preline required)

---

## Screen: cc-01-queue-with-care-plan-approval (Worked Example)

**Wireframe source:** `wireframes/cc-01-queue-with-care-plan-approval.md`

### Recipe

1. **Shell:** `agentic-shell` — coordinator shell; active nav: queue; active queue item: Maria Rivera care plan
2. **Left pane:**
   - `queue-section-header.is-urgent` (count: 1) → `queue-list` → `queue-item.is-urgent.active` (Maria Rivera) with `badge-pill badge-warning` "Care plan" + SLA `queue-item-sla.is-warning`
   - `queue-section-header.is-attention` (count: 7) → 7 `queue-item.is-attention` rows
   - `queue-section-header.is-info` (count: 3) → 3 `queue-item.is-info` rows
   - Below: `divider` + `sidebar-nav-list`
3. **Center pane — Care plan record viewer:**
   - `record-header` → `record-header-main` → `record-header-title` "Care Plan — Maria Rivera" (Lora Heading/01) + `record-header-subtitle` (DOB/MRN/since) + `record-header-trailing` (`badge-warning` "Pending coordinator approval" + `badge-info` "Moderate risk") + `record-header-meta` (agent draft + RDN signed)
   - Plan summary: `card` → `card-header` "Plan summary" + `card-body`
     - Goals: 3-bullet list (Body/02)
     - Nutrition section status: `badge-success` "Signed by Dr. Soto · Locked" per-field indicator
     - Coordinator-editable scope noted with `editable-indicator` (hidden when read-only)
   - Nutrition section: `card` → `clinical-nutrition-list` (caloric / protein / sodium / carbohydrate / fiber rows) — read-only; `clinical-ai-field-confirmed` markers on agent-populated values
   - Meal plan preview: `card` → `card-body` → `data-table` (7-day × 3-meal grid, compact)
   - Downstream effects: `card` → `card-body` → `alert-info` inside with effects list
4. **Right pane — Thread with approval card (hero):**
   - **Approval card hero:** `thread-approval-card.is-urgent` (`<section role="region" aria-labelledby>`)
     - `thread-approval-header`: `fa-hand` + `<h3>` "Approval requested · Care plan final approval" + Ava sparkle dot
     - `thread-approval-body`:
       - `thread-approval-context` → `thread-approval-context-title` + `thread-approval-context-meta`
       - `thread-approval-summary` (Body/03 plan summary text)
       - `thread-approval-effects-label` + `thread-approval-effects` (3-bullet downstream list)
     - `thread-approval-actions` (NN/G-ordered): `btn-primary btn-sm` "Approve" + `btn-outline btn-sm` "Edit first" + `btn-ghost btn-sm` "Reassign" + `btn-outline btn-sm` "Reject" (rightmost, 16px gap)
     - `thread-approval-note` (hidden until Reject clicked) → `<label class="sr-only">` + `<textarea>` + `btn-danger btn-sm` "Send reject" + `btn-ghost btn-sm` "Cancel"
   - Thread events (above approval card, scrollable — newest at bottom):
     - `thread-msg-system` × 3 (signed, draft generated, check-in)
     - `thread-msg-tool` × 2 (collapsed default — meal plan gen, BHN check)
   - Bottom: `prompt-input-container` — placeholder "Ask Ava or send a note…"
5. **Toast (on approve):** `toast` + `toast-info` — portal at document level; 5-second undo window
6. **Post-approval:** `thread-msg-response.is-approved` collapses the card; `thread-msg-system` logs downstream effects; center pane `badge-success` "Approved"
7. **Error (decision write fails):** `alert-error` inline below card actions + `btn-outline btn-sm` "Try again"; card stays pending
8. **Reassign modal:** `overlay-modal` + `combobox` (coordinator picker) + optional note `<textarea>`

### Data Bindings

- `thread-approval-card.is-urgent` variant — bound to `approval.urgency === 'urgent'`
- Thread events: `*ngFor` over thread messages; `thread-msg-tool` collapsed default via `data-hs-collapse`
- `thread-approval-note` visibility: conditional on `rejectIntent` flag
- Approval action buttons: disable on action-in-flight (loading state via `btn-loading btn-spinner`)
- Queue item counts: `aria-live="polite"` on left pane; counts update reactively on decision

### Preline Interactions

- `data-hs-collapse` — tool call expand/collapse (HSCollapse)
- `hs-dropdown` — Reassign modal trigger (alternative: vanilla overlay)
- `data-hs-overlay` — modal for Reassign coordinator picker
- Toast: `HavenToast.show()` API from `toast.js` — document-level portal
