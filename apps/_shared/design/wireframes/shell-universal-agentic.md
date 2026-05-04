# shell-universal-agentic: Universal Three-Panel Agentic Shell

**Application:** All Haven apps (Care Coordinator, Provider, Kitchen — desktop primary; Patient — mobile uses `shell-pt-mobile`)
**Use Case(s):** UC-SHELL-01 through UC-SHELL-09 (`apps/_shared/design/universal-shell-use-cases.md`)
**User Type:** Coordinator, Provider, Kitchen Staff (Patient gets mobile variant)
**Device:** Desktop primary; tablet supported (≥720px)
**Route:** Persistent shell wrapping every desktop app route

This is the contract every desktop app inherits. Per Gate 1 G1.1 the universal shell adopts `layout-agentic-shell` as the rich base. Per-app variants restrict capability downward (queue allowlist, thread allowlist, optional Ava chat-header rendering); they do not alter shell structure.

---

## Page Purpose

Render the persistent three-pane workspace where the user's day takes place. Left = role-specific list (queue / orders / clinical queue). Center = the record or content currently in focus. Right = the contextual thread/activity for that record. The shell IS the navigation — there is no top navbar competing with the left pane. The user reads the room in 2-3 seconds and moves queue → record → decision in 2 taps.

---

## Layout Structure

### Shell

Three flex panes inside `agentic-shell` at `height: 100vh`. Two `panel-splitter` handles between panes provide drag-resize. No top navbar. No bottom bar (desktop). Cena logo lives in left-pane header; Ava avatar lives in chat-pane header (apps where Ava is the agent).

```
┌──────────┬──────────────────────────┬─────────────────┐
│  panel-  │  panel-chat               │  panel-content   │
│  nav     │  (center, flex)           │  (right)         │
│  (left)  │                          │                  │
│  260px   │  flex / 480 floor /      │  640 default     │
│  default │  560 comfortable          │  480-800 range   │
│ 220-320  │                          │                  │
└──────────┴──────────────────────────┴─────────────────┘
   ↑ panel-splitter         ↑ panel-splitter
```

### Header Zone — within `panel-nav` (left pane)
- **Component:** `nav-header` + `nav-logo` (from agentic-shell prototype set)
- Cena Health wordmark logo (`logo-cenahealth-teal.svg`), ~24px tall × ~131px wide
- Logo is constant across every app — Coordinator, Provider, Kitchen all show the same Cena mark
- No persona-conditional swapping; never substitute Ava avatar here (per `DESIGN.md` §Brand expression > Logo)
- Surface: `--color-surface-chrome` (sand-100)

### Content Zone — three panes

#### Left pane — `panel-nav`
- **Component:** `panel-nav` (agentic-shell) hosting role-specific content
  - Coordinator: `queue-sidebar` + `queue-section-header` (3 urgency tiers) + `queue-list` of `queue-item`
  - Provider: same primitives, gate-type-grouped
  - Kitchen: same primitives, status-grouped (extends `queue-section-header` with `is-status-*` modifiers — `[NEW COMPOSITION: status-grouped queue header]`)
- Below the role-specific list, secondary nav rendered as a `sidebar-nav-list` with `sidebar-nav-item` entries (Patients / Reports / Settings, etc. — per app)
- User menu pinned at bottom — `avatar` + name + dropdown trigger (`hs-dropdown` for sign-out, settings)
- Surface: pane = `rgba(255,255,255,0.6)` translucent white (`--color-surface-pane`)
- Scroll: independent vertical; never scrolls center or right
- Collapsed state: `panel-nav.collapsed` reduces to 80px icon-rail; nav items show icon-only with `aria-label`

#### Center pane — `panel-chat` (named for the agentic-shell convention; not always chat)
- **Component:** `panel-chat` envelope; inner content is record viewer or chat
- For a record-viewer screen: `record-header` at top (Lora display title per `DESIGN.md` §Typography) + record body
- For an agent-conversation screen (when Ava is the active surface): `chat-thread` + `chat-thread-inner` + `message-agent` / `message-user` + `tool-call` indicators + Ava avatar (44px gradient sphere) at top of pane
- Center never compresses below 480px floor (560 comfortable). Grid `minmax()` enforces this.
- Scroll: independent vertical; bottom anchor for chat input when present
- Surface: page = `--color-surface-page` (sand-50)

#### Right pane — `panel-content` (the thread / activity / approvals rail)
- **Component:** `thread-panel` + `thread-panel-body` + `thread-panel-empty`
- Configured per app via `data-allowlist`:
  - Coordinator: full allowlist (`system`, `agent_tool_call`, `agent_tool_result`, `approval_request`, `approval_response`, `human_message`, `notification`, `status_change`)
  - Provider: full clinical allowlist (same as coordinator + clinical-decision approval card variant)
  - Kitchen: order-relevant allowlist (`status_change`, `system`, `human_message` ops, scoped `agent_tool_*`, `notification`)
- Renders chronologically (newest at bottom)
- Active approval card pins as the hero (when present) — `thread-approval-card` with variants `.is-urgent` / `.is-warning` / `.is-historical` / `[NEW VARIANT: thread-approval-card.is-clinical]`
- Thread input at bottom: `prompt-input-container` (coordinator/provider) — single-row textarea + `btn-icon` send + `btn-icon` mic; surface stays solid white per `--color-surface-input`
- Surface: page (`sand-50`) — same as center; differentiated by border-left on the splitter

### Footer Zone

No persistent footer on the universal desktop shell. Sticky CTAs (when needed) live inside the center pane's record viewer, not at shell level.

---

## Interaction Specifications

### Open app [REVISED]
- **Trigger:** User loads the app at the root route
- **Feedback:** Shell renders three panes immediately. Brand fonts already linked (Lora + Source Sans 3 + Source Code Pro) — no FOUT.
- **Navigation:** Left pane loads role-specific list. Center pane loads orientation surface (morning summary / caseload / production summary). Right pane shows persona-specific empty-state copy (see §States Empty State for the per-app strings).
- **Error handling:** If queue/list fails to load, `alert-error` at top of left pane with retry CTA "Try again"; center renders fallback empty state.

### Select a left-pane item
- **Trigger:** User clicks/taps a left-pane item (queue-item, order, clinical-queue item)
- **Feedback:** Selected item gets `.active` class (sets `aria-current="true"`); other items remain visible; subtle teal left-border on active item.
- **Navigation:** Center loads the relevant record viewer (parallel-load). Right loads the thread for that record (parallel-load), scrolled to most-recent approval-pending event if any.
- **Error handling:** Per-pane: if center load fails, show `alert-error` inside center; right shows empty state. If right load fails, show inline retry inside right pane; center remains on the loaded record.

### Drag to resize (left boundary) [REVISED]
- **Trigger:** User mouse-down on `panel-splitter` between left and center; drags
- **Feedback:** Width updates live during drag, clamped 220-320px. Cursor: `col-resize`. Visual: 4px-wide hot zone glows on hover. When user drags past the clamp boundary, the splitter handle visually clamps at min/max while the cursor continues — no "detached handle" effect.
- **Persistence:** On mouse-up, write `user_pane_prefs.left_width_px` (per-user, not per-device). On next session load: clamp the saved value to the current viewport's allowed range before applying (per Gate 2 decision 3) — prevents a 320px saved width from forcing nav-rail collapse when the user moves between viewports.
- **Error handling:** If pref write fails, log silently — width still applies for current session.

### Drag to resize (right boundary) [REVISED]
- **Trigger:** User mouse-down on `panel-splitter` between center and right; drags
- **Feedback:** Width updates live during drag, clamped 480-800px (or 480 collapsible at 960-1239px viewport). Center absorbs released space. Same visual-clamp-on-overdrag behavior as left boundary.
- **Persistence:** Same as left — clamp to viewport's allowed range on session load.

### Toggle nav collapse
- **Trigger:** Click toggle button at top-right of `panel-nav` (small chevron icon, `btn-icon`)
- **Feedback:** Nav animates between 260px expanded and 80px icon-rail. Transitions respect `prefers-reduced-motion`.
- **Persistence:** `user_pane_prefs.nav_collapsed` written on toggle.

### Send a thread input message (coordinator/provider only; not Kitchen v1, not Patient) [REVISED]
- **Trigger:** User types in `prompt-input-container` textarea, presses Enter (Cmd+Enter for newline) or clicks send icon
- **Feedback:** Message appears immediately as `thread-msg-human` (right-aligned bubble). Spinner appears next to "Ava is working" indicator below the message.
- **Navigation:** None — stays in current record context.
- **Error handling:** If send fails, message shows retry icon (`fa-arrow-rotate-right`) with inline copy "Couldn't send. Tap to retry."

### Approve / Edit / Reject / Reassign in approval card (coordinator + provider) [REVISED]
- **Trigger:** User clicks an action button on a `thread-approval-card`
- **Feedback:** Undo toast (`toast` + `toast-info`) renders in a portal at the document level (NOT inside the right `<aside>`); pane scroll never moves the toast. Toast position visually anchors to bottom-right of the right pane via fixed positioning but is detached from the pane's scroll context. Undo window varies by stakes per Gate 2 decision 1: **5 seconds for coordinator (reversible downstream effects), 10 seconds for provider clinical signature (irreversible audit-trail implications).** Kitchen status changes have no undo — kitchen physical-progression is immediate by design.
- **Navigation:** On undo-window close, decision logs as `thread-msg-response` with `.is-approved` / `.is-rejected` modifier. Approval card collapses to one-line summary (`[Sarah K.] Approved with edits — sodium target reduced to 1800mg · 9:47am`). Left-pane queue item resolves; count decrements; next urgent item highlights but does not auto-open.
- **Error handling:** If decision write fails, surface `alert-error` inline below the card with retry; card stays in pending state.

### Responsive collapse
- **Trigger:** Viewport crosses a Material 3 + Fluent 2 threshold
- **Feedback per breakpoint:**
  - ≥1240px: 260 expanded nav, flex chat, 640 visible right
  - 960-1239px: 260 expanded nav, flex chat, 480 collapsible right
  - 720-959px: 80 icon-rail nav, flex chat, right pane becomes inspector sheet on demand (open via toggle button in record header)
  - <720px: hamburger sheet for nav, full-width center, right is full-screen sheet on demand
- Collapse order: right first → left to rail → left to sheet. Center never collapses.

---

## States

### Empty State (no left-pane items) [REVISED]
- **Component:** `data-empty-state` inside left pane below the section headers
- Icon: `fa-circle-check` (regular weight) in `text-gray-300`, 48px
- Heading: "Nothing needs your attention right now"
- Message: "We'll surface anything urgent. Until then, you're caught up."
- Center pane: morning summary or caseload still renders; "All clear today" treatment.
- Right pane: `thread-panel-empty` with "Pick a queue item to start. Each conversation lives with a specific patient or referral." (coordinator default — per-app shells override the right-pane copy: provider "Pick a clinical review to start."; kitchen "Pick an order to see its activity.")

### Loading State
- Left pane: 5 `skeleton` rows matching `queue-item` shape (icon + name + summary + meta), grouped under skeleton section headers
- Center pane: single `skeleton` `card` with `skeleton-text-sm` lines for orientation surface OR record-header skeleton + 4-5 `skeleton-text` lines for record viewer
- Right pane: 3-4 `skeleton` rows matching thread message heights (varied)
- All three panes load in parallel; whichever returns first renders its real content while others remain skeleton.

### Error State [REVISED]
- Per-pane error: `alert-error` at top of the failed pane with retry button (`btn-outline btn-sm`)
  - Queue load: "We couldn't load your queue. Retrying…" + "Try again"
  - Center load: "We couldn't load this record. Try again or pick a different item." + "Try again"
  - Thread load: "We couldn't load activity for this record." + "Try again"
- Send-failed inline error (thread input): "Couldn't send. Tap to retry."
- Other panes continue to function — no full-shell error blockade.

### Resizing State
- During drag: cursor `col-resize`, body class `is-resizing` to disable transitions on neighbors
- On release: persist pref; remove `is-resizing`

### Nav-collapsed State
- `panel-nav.collapsed` shrinks pane to 80px
- Nav items show icon-only; tooltips on hover via `aria-label`
- Logo hides; replaced by Cena mark-only (`favicon.svg`)

---

## Accessibility Notes

- Each pane is a landmark: left = `<aside aria-label="Queue sidebar">` (or "Orders", "Clinical queue" per app); center = `<main aria-label="Main content">`; right = `<aside aria-label="Activity thread">` (universal default; per-app shells re-author: coordinator "Activity thread", provider "Clinical activity thread", kitchen "Order activity thread")
- Tab order: left → center → right (DOM order)
- No focus trapping in the persistent shell — per WCAG 2.1.2 (No Keyboard Trap, Level A). Focus trapping applies only inside modal dialogs (`overlay-modal`, `overlay-confirm-dialog`).
- `panel-splitter` handles are `<button role="separator" aria-orientation="vertical" aria-controls="<adjacent-pane-id>">` with keyboard support: Left/Right arrows resize by 16px (one Tailwind 4px scalar × 4); Home/End jump to min/max. [REVISED]
- Touch targets: 44px minimum (48px for kitchen tablet workflow with gloved hands)
- Ava avatar in chat-pane header is `<img alt="Ava (your care assistant)">` — name reflects how the agent is identified to the user
- Color-as-status: every urgency/severity color (`.is-urgent` red, `.is-attention` amber, `.is-info` sand) carries a non-color fallback (icon + text label, never color alone)
- Live regions for dynamic content: thread updates announce via `aria-live="polite"` on `thread-panel-body`; queue updates announce via `aria-live="polite"` on left pane

## Bilingual Considerations

- Universal desktop shell is **EN-only at v1** for Coordinator / Provider / Kitchen apps (per Gate 2-prep decision 4 — bilingual is patient-only at v1, with patient app's Messages + Settings + Assessments + Dashboard all EN/ES)
- Future Spanish adoption (provider serving Spanish-speaking RDN, kitchen serving Spanish-speaking partner) is a string update, not a layout change

## Open Questions

- Nav-collapse toggle (260 ↔ 80) — should it be exposed at all viewports, or only ≥1240px? Auto-collapse at 720-959 is mechanical; manual toggle at 1240+ is a power-user feature. Recommend: auto-collapse below 960; manual toggle ≥960.

(Resize-pref clamping and chat-input location are now resolved inline per Gate 2 decisions 3 + 2; see Drag to resize and shell-cc-coordinator/shell-pv-provider/shell-kt-kitchen for thread-input location specifics.)

---

## New Components Flagged

None at the universal-shell level — `layout-agentic-shell`, `panel-splitter`, all `thread-msg-*` primitives, `thread-approval-card` (with shipped variants), `queue-sidebar`, `queue-section-header`, `queue-item` all exist in PL.

(Per-app variants flag two new components: `[NEW COMPONENT: packing-slip]` in kitchen wireframes and `[NEW COMPONENT: thread-approval-card.is-clinical variant]` in provider wireframes.)
