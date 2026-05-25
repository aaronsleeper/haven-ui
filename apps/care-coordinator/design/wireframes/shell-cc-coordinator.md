---
shells:
  - name: agentic-shell
    pl_shell_version: sha256:ad941b49f775658633dc7e30121545c3a092fb6d712a7fd1c37167c6d3346940
---

# shell-cc-coordinator: Care Coordinator Shell (Universal Agentic Base)

**Application:** Care Coordinator (Admin App)
**Use Case(s):** CC-SHELL-01 through CC-SHELL-05 (`apps/care-coordinator/design/shell-use-cases.md`)
**User Type:** Care Coordinator (Sarah)
**Device:** Desktop primary; tablet supported (≥720px); mobile rare
**Route:** Persistent shell wrapping every coordinator route

This wireframe specifies coordinator's slice of the universal shell — the `agentic-shell` rich base specialized for the coordinator's queue + thread workflow. Inherits structure from `apps/_shared/design/wireframes/shell-universal-agentic.md`; restricts/specializes content per coordinator persona.

Per Gate 2-prep decision 1: this wireframe describes the **target** rich-base coordinator shell. dev-tasker sequences the upgrade from the currently-shipped bare `three-panel-shell` to this target.

---

## Page Purpose

Render the persistent three-pane workspace for Sarah (or any coordinator). Left = urgency-grouped queue + secondary nav. Center = the record currently in focus (patient, referral, care plan). Right = the contextual thread including any pending approval card. The coordinator opens the app, reads the room in 2-3 seconds, moves queue → record → decision in 2 taps.

---

## Layout Structure

### Shell

Inherits from `shell-universal-agentic.md`:
- `agentic-shell` flex root at `height: 100vh`
- Three panes with two `panel-splitter` handles
- 260px default left, flex center (480 floor / 560 comfortable), 640px default right (480-800 range)
- `panel-nav` left, `panel-chat` center (record-viewer mode at v1, not chat-mode), `panel-content` right (thread)
- Surface: chrome (sand-100 outer) → page (sand-50 panes) → solid white inputs

### Header Zone — left pane top

- **Component:** `nav-header` + `nav-logo`
- Cena Health wordmark (`logo-cenahealth-teal.svg`), 24px tall × 131px wide
- No persona switching — same Cena mark for every coordinator
- Surface: `--color-surface-chrome` (sand-100) within the translucent-white pane overlay

### Content Zone

#### Left pane (`panel-nav`) — Queue + secondary nav

- **Component:** `queue-sidebar` + `queue-sidebar-brand` + `queue-sidebar-body`
- Below brand header, three queue sections:
  - `queue-section-header.is-urgent` — "Urgent" + count + `fa-circle-exclamation` (red)
  - `queue-section-header.is-attention` — "Needs attention" + count + `fa-triangle-exclamation` (amber)
  - `queue-section-header.is-info` — "Informational" + count + `fa-circle-info` (sand)
- Within each section: `queue-list` of `queue-item` rows
  - Each `queue-item`: subject name + type badge + one-line summary + time-in-queue + SLA chip (`.is-warning` at 75% elapsed, `.is-breached` past SLA)
  - Active state: `.active` (`aria-current="true"`) — teal left border + bold name
- Below queue sections: `divider` + secondary nav as `sidebar-nav-list`
  - Patients (caseload) → routes to CC-CENTER-PATIENT-LIST
  - Reports
  - Settings
- User menu pinned at bottom: `avatar-sm` + name + `hs-dropdown` for "Sign out", "Profile", "Help"
- Scroll: independent vertical
- Min-width 220, max-width 320, default 260 (drag-resize via `panel-splitter`)

#### Center pane (`panel-chat`) — Record viewer

- **Component:** envelope is `panel-chat`; inner content varies by mode
- **Default (no item selected):** morning summary card (per cc-03-morning-summary.md) — `card` with summary text + stat-cards previewing urgent items
- **Item selected:** `record-header` (Lora display title + status badge + meta) at top + record body
- Record body varies: patient record, referral, care plan, care-plan diff, etc. — uses shipped `record-header` + `clinical-*` + `data-table` primitives
- For agent-conversation mode (CC-SHELL-04 — direct the agent): `chat-thread` + `chat-thread-inner` + `message-agent` + `message-user` + `tool-call`. Ava avatar (gradient sphere) at top-left of chat content area, 44px. (Per Gate 1, Ava chat-header appears in coordinator shell.)
- Min-width 480 floor (560 comfortable). Never collapses.
- Surface: `--color-surface-page` (sand-50)

#### Right pane (`panel-content`) — Thread + approval card

- **Component:** `thread-panel` + `thread-panel-body`
- Configured with **coordinator allowlist** — `system`, `agent_tool_call`, `agent_tool_result`, `approval_request`, `approval_response`, `human_message`, `notification`, `status_change`
- Active approval card (when present) pins as the hero — `thread-approval-card` with variant per urgency (`.is-urgent` / `.is-warning` / `.is-historical`)
- Thread events render newest at bottom — `thread-msg-system`, `thread-msg-tool` (collapsible), `thread-msg-human`, `thread-msg-response`
- Bottom: `prompt-input-container` for thread input — single-row textarea with placeholder "Ask Ava or send a note…" + `btn-icon` send + `btn-icon` mic [REVISED]
- Default 640px; clamp 480-800; drag-resize via `panel-splitter`
- Surface: `--color-surface-page` (sand-50); border-left from splitter

### Footer Zone

No persistent footer. Sticky CTAs (e.g., "Save changes" inside care-plan editor) live inside the center record viewer when needed.

---

## Interaction Specifications

### Open app
- **Trigger:** Coordinator loads `/`
- **Feedback:** Shell renders three panes immediately; brand fonts already linked. Left loads queue; center loads morning summary; right shows empty state.
- **Navigation:** Stays at root; queue render is the orientation
- **Error handling:** If queue load fails, `alert-error` at top of left pane with retry; center shows fallback morning-summary skeleton.

### Click queue item
- **Trigger:** Click any `queue-item` in left pane
- **Feedback:** Item gets `.active` (`aria-current="true"`); other items remain visible; subtle teal left-border on active.
- **Navigation:** Center loads the relevant record viewer (patient / referral / care plan). Right loads the thread for that record, scrolled to most-recent approval-pending event.
- **Error handling:** Per-pane error states; queue retains the click selection.

### Type in thread input
- **Trigger:** Coordinator types in `prompt-input-container` at bottom of right pane; presses Enter (or clicks send icon)
- **Feedback:** Message appears immediately as `thread-msg-human` (right-aligned); spinner appears with "Ava is working..." indicator below.
- **Navigation:** Stays in current record context
- **Error handling:** Send-failed message shows retry icon

### Approve / Edit / Reject / Reassign on approval card
- **Trigger:** Click an action button on `thread-approval-card`
- **Feedback:** 5-second undo `toast.toast-info` at bottom-right of right pane: "Approved. Tap to undo."
- **Navigation:** On undo close, decision logs as `thread-msg-response.is-approved` (or `.is-rejected` / `.is-historical`). Approval card collapses to one-line summary. Queue item resolves; left-pane count decrements; next urgent item highlights but does not auto-open.
- **Error handling:** If decision write fails, surface inline `alert-error` below the card with retry; card stays pending.

### Resize right pane
- **Trigger:** Drag the right `panel-splitter` handle
- **Feedback:** Width updates live during drag, clamped 480-800.
- **Persistence:** Per-user pref written on release.

### Resize left pane
- **Trigger:** Drag the left `panel-splitter` handle
- **Feedback:** Width updates live, clamped 220-320; queue items reflow within new width.
- **Persistence:** Per-user.

### Toggle nav collapse
- **Trigger:** Chevron toggle at top-right of left pane (`btn-icon`)
- **Feedback:** Nav animates to 80px icon-rail (or back). Items show icons only with `aria-label`.
- **Persistence:** Per-user.

### Filter queue by type [REVISED]
- **Trigger:** Click filter pills above queue sections — `filter-pill` row showing "All", "Referrals", "Care plans", "Discharges", "Insurance"
- **Feedback:** Pill activates (`.active`), queue re-renders with matched items only; section counts update.
- **Persistence:** Per-user (matches resize-pref pattern); persists across reloads and devices. Pending Aaron's confirmation at Gate 2-review.

---

## States

### Empty State (no queue items at all) [REVISED]
- **Component:** `data-empty-state` filling the queue body
- Icon: `fa-circle-check` (regular) in `text-gray-300`, 48px
- Heading: "Nothing needs your attention right now"
- Message: "We'll surface anything urgent. Until then, you're caught up."
- Center: morning summary still renders with "All clear today" treatment.
- Right: `thread-panel-empty` with "Pick a queue item to start. Each conversation lives with a specific patient or referral."

### Empty State (one tier empty, others populated) [REVISED]
- The empty section renders header with count "0" and a one-line note
  - Urgent: "Nothing urgent right now."
  - Needs attention: "Nothing in needs-attention."
  - Informational: "No informational items."
- Other tiers render normally

### Loading State
- Left: 5 `skeleton` rows under skeleton section headers
- Center: `skeleton` `card` with skeleton lines for morning summary OR record-header skeleton + record-body skeleton
- Right: 3-4 `skeleton` rows mimicking thread message heights; thread input area shows greyed input placeholder

### Error State (queue load fails) [REVISED]
- Left pane top: `alert-error` with "We couldn't load your queue. Retrying…" + `btn-outline btn-sm` "Try again"
- Center continues to render morning summary with cached data if available
- Right shows empty state

### SLA Warning State
- Queue items with SLA elapsed past 75% render `queue-item.is-warning`: amber-bordered SLA chip + amber accent
- Items past SLA: `queue-item.is-breached`: red SLA chip + red dot indicator + persistent at top of urgent group

---

## Accessibility Notes

- Left = `<aside aria-label="Queue sidebar">`; center = `<main aria-label="Main content">`; right = `<aside aria-label="Activity thread">`
- Tab order left → center → right
- No focus trapping in shell (per WCAG 2.1.2)
- `panel-splitter` handles: `<button role="separator" aria-orientation="vertical" aria-controls="<adjacent>">` with arrow-key resize support
- Touch targets 44px minimum; queue items 48px tall to give thumb-room on tablet
- Decorative SLA icons `aria-hidden="true"`; SLA span `aria-label` names the state ("SLA breached", "SLA warning")
- Color-as-status: every urgency tier carries a non-color fallback (icon shape + text)
- `aria-live="polite"` on left-pane queue body for queue updates; same on right-pane thread body for new events

## Bilingual Considerations

- Coordinator app is **EN-only at v1** (per Gate 2-prep decision 4 — bilingual scope is patient-only at v1)
- Spanish coordinator support deferred; copy strings use `data-i18n-en` attributes for forward compatibility but no `data-i18n-es` strings authored at v1

## Open Questions

- Thread input location: center pane (current `agentic-shell` prototype) or right pane (this spec)? Recommend right-pane for v1 across all desktop apps. Confirm at Gate 2.
- Filter pills for queue: needed at v1 or deferred? Sarah's day is queue-driven; filtering by type is high-value but not in Gate 1 G1.2 minimum. Recommend ship at v1.
- Right pane "close" affordance: should there be a button to collapse the right pane to icon-only at any viewport? Currently relies on auto-collapse below 720px. Power-user feature — defer to v1.1 unless coordinators flag it.

---

## New Components Flagged

None. All primitives shipped: `agentic-shell`, `panel-splitter`, `queue-sidebar`, `queue-section-header` (.is-urgent / .is-attention / .is-info), `queue-item` (urgency + SLA modifiers), `thread-panel`, `thread-msg-*`, `thread-approval-card` (.is-urgent / .is-warning / .is-historical), `prompt-input-container`, `record-header`, `editable-indicator`, `filter-pill`, `data-empty-state`, `alert-error`, `toast`, `skeleton`, `nav-header`, `nav-logo`, `sidebar-nav-list`, `sidebar-nav-item`, `avatar-sm`, `divider`.

The adoption gap (binding the coordinator React app to the agentic-shell rich base + porting `panel-splitter` drag-resize to React) is a build/dev-tasker concern, not a wireframe-level new component.
