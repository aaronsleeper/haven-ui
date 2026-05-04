# Slice Manifest — cc-shell-upgrade: Coordinator Agentic Shell Upgrade

**Target app:** `apps/care-coordinator`
**Primary wireframe(s):**
- `apps/care-coordinator/design/wireframes/cc-shell-flow.md`
- `apps/care-coordinator/design/wireframes/shell-cc-coordinator.md`
- `apps/care-coordinator/design/wireframes/cc-01-queue-with-care-plan-approval.md`
**Commit:** _[fill in after build]_

---

## In scope (ships in this slice)

### Shell structure
- `agentic-shell` → three-pane flex root — ported from `@haven/ui-react`; already in App.tsx
- `panel-nav` (left), `panel-chat` (center), `panel-content` (right) — landmark elements with correct `aria-label`
- Two `panel-splitter` handles — drag-resize active; min/max per wireframe (220–320 left, 480–800 right); keyboard step 16px
- `queue-sidebar` → `queue-sidebar-brand` + `queue-sidebar-body` wrappers — wraps existing nav content

### Queue panel (left pane)
- `queue-sidebar-brand` with Cena wordmark (`logo-cenahealth-teal.svg`)
- Five `filter-pill` buttons: All / Referrals / Care plans / Discharges / Insurance — `active` state + `aria-pressed`
- Per-user filter persistence via `localStorage` key `user_prefs.queue_filter`
- Three `queue-section-header` elements: `.is-urgent`, `.is-attention`, `.is-info` — each as `<h2>` with icon + count badge
- `queue-list` of `QueueItem` rows under each section
- `divider` separator below queue sections
- `sidebar-nav-list` with three `sidebar-nav-item` links: Patients, Reports, Settings
- User menu (pinned bottom): `avatar-sm` + name + `hs-dropdown` (Profile, Help, Sign out)
- Full queue empty state: `data-empty-state` with "Nothing needs your attention right now" + body copy
- Per-tier empty notes when one tier = 0 items and others have items

### Right pane (thread)
- Approval card action ordering fix: `[Approve][Edit first][Reassign][Reject]` — Reject rightmost with `ms-4` 16px gap
- `thread-msg-tool` events default-collapsed via `data-hs-collapse` (or React state `isExpanded=false`)
- Reject note: sr-only label, `aria-required="true"`, locked placeholder copy
- Approval card auto-scroll on first record-open (per-entry tracking via `Set`)
- Document-level toast portal for `ThreadUndoBar` via `ReactDOM.createPortal(bar, document.body)`
- Toast `role="status"` + `aria-live="assertive"`
- 5-second undo window

---

## Deferred (explicitly not in this slice, tracked for later)

Walk of `shell-cc-coordinator.md`:

### Layout / shell
- **Nav collapse toggle** (chevron to 80px icon-rail) — wireframe spec §Interaction "Toggle nav collapse" — deferred: power-user feature; defer to v1.1. Tracked as: roadmap entry.
- **Right pane "close" affordance** — collapsed panel at any viewport — deferred per Gate 2 decision 2 (coordinator has no close affordance at v1). Tracked as: confirmed deferred, not a tracking item.
- **Tablet responsive collapse** (auto-collapse `panel-content` below 720px) — deferred: coordinator is desktop-primary; mobile rare per shell-use-cases.md. Tracked as: next-slice item.

### Queue panel
- **"More" overflow for filter pills** (if pill set expands beyond 5) — wireframe mentions potential overflow; current 5 pills fit at 260px. Tracked as: monitor; wire when pills overflow.
- **Informational section collapse-by-default option** — review-notes decision was "expanded by default." Deferred. Tracked as: roadmap entry.
- **Filter pills icon-only with tooltips** — original review suggestion for narrow sidebar; overridden by "5 pills fit at 260px" decision. Tracked as: discard.
- **Queue item SLA text variants** ("Due in 1h", "4h overdue") — these are data-binding concerns (text comes from `queue.ts` fixture); the `queue-item-sla.is-warning` / `.is-breached` CSS exists. SLA text in fixture is out of scope for this task list; data layer not being restructured here. Tracked as: data-layer ticket.

### Center pane (record viewer)
- **Morning summary card (default center state)** — `cc-03-morning-summary.md` spec; not in this upgrade slice. Tracked as: future slice.
- **Agent-conversation mode** (center pane chat thread for CC-SHELL-04) — `chat-thread` + `chat-thread-inner` + `message-agent` + Ava avatar — deferred. Tracked as: next-slice item.
- **"Edit first" sticky footer in center pane** ("Save and approve" + "Cancel") — exists in existing `CarePlanViewer.tsx` `onCommitEdit`/`onCancelEdit` flow; verify completeness in Task 09. If missing, tracked as: follow-up patch.
- **Downstream effects card in center pane** (`alert-info` + "What approving this plan does") — exists in wireframe `cc-01`; covered by existing `CarePlanViewer.tsx`. Not explicitly a new task; verify visual in Task 09.

### Thread / approval card
- **Reassign modal** (`overlay-modal` + `combobox` coordinator picker) — interaction is wired to `btn-ghost btn-sm` "Reassign" button but modal itself is not in scope for this upgrade slice. Tracked as: next-slice item (cc-reassign-modal).
- **Approval write-fail error state** (`alert-error` inline below card with retry) — error branch exists in interaction spec; out of scope for this upgrade. Tracked as: next-slice item.
- **Post-approval thread sequence** (queue item disappears, count decrements, `thread-msg-system` downstream effects) — partially handled by `handleAction` in `App.tsx`; visual completeness to verify in Task 09. Tracked as: verify in Task 09 / follow-up if incomplete.
- **Loading skeleton states** (all three panes) — `skeleton` / `skeleton-text` while queue/thread/record load — deferred: no async data layer at v1 (fixtures). Tracked as: data-layer ticket.
- **Error state (queue load fails)** (`alert-error` at top of left pane with retry) — no async queue load at v1. Tracked as: data-layer ticket.

### Accessibility notes (from wireframe)
- **`panel-splitter` keyboard semantics** — `role="separator"` + `aria-orientation="vertical"` + `aria-controls` — confirm present on splitter divs in Task 01; if not present, add in that task. If still missing after Task 01: tracked as: follow-up patch.
- **`aria-live="polite"` on left pane queue body** — for reactive queue count updates — deferred: no real-time data at v1. Tracked as: data-layer ticket.
- **`aria-live="polite"` on right pane thread body** — same reason. Tracked as: data-layer ticket.
- **Touch targets 44px minimum on queue items** — existing `QueueItem` component; verify in Task 09.
- **Arrow-key queue navigation** — keyboard users navigate queue items with arrow keys; focus management on click stated in wireframe. Deferred: complex keyboard nav out of scope for this upgrade slice. Tracked as: next-slice item (accessibility-queue-nav).

---

## Workflow gates applied

- ui-react-porter preconditions met for every ported component: yes — no new PL components in this slice; all components drawn from existing `@haven/ui-react` exports
- app-composer utility-soup rejection clean: yes — tasks explicitly forbid utility chains on styled elements; layout-only utilities used for spacing/flex only
- Post-slice expert review dispatched (ux-design-lead, design-system-steward, accessibility): pending — dispatch after Task 09 passes

---

## Known gaps at slice-end

- **Reassign modal not wired** — severity: should-fix — needed for CC-SHELL-03 (Reassign action) to be complete; currently clicking Reassign does nothing or renders a stub.
- **Loading states not implemented** — severity: nice-to-have — fixture data loads instantly; no user-facing loading skeletons. Will matter when real API is wired.
- **`aria-live` on queue/thread panels not present** — severity: should-fix — correct behavior once real-time updates exist; not testable until data layer is live.
- **Panel-splitter `role="separator"` attributes** — severity: should-fix — verify in Task 01; if missing, follow-up patch required. WCAG 2.1 conformance item.

---

## Round N expert verdict (optional — appended after each review round)

- **ux-design-lead:** _pending_
- **design-system-steward:** _pending_
- **accessibility:** _pending_
- **brand-fidelity:** _pending_

### Pre-build check retrospective (per round)

_To be filled after each review round._
