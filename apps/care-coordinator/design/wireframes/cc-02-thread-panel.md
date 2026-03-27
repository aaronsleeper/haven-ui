# CC-02: Thread Panel

**Application:** Care Coordinator Admin App (Desktop)
**Use Case(s):** UC-CC-02, UC-CC-04
**User Type:** Care Coordinator
**Device:** Desktop (part of three-panel shell)
**Route:** *(persistent right panel — no independent route)*

## Page Purpose

The decision surface. Everything the agent did, every human decision made, every system event —
rendered chronologically. The approval card is the hero interaction. The thread input lets the
coordinator direct the agent. This panel is simultaneously the UX, the audit log, and the
compliance record.

---

## Layout Structure

### Shell
Persistent right panel of CC-SHELL. ~380px fixed width, full viewport height, border-left.
Background: `bg-white`. Messages scroll independently. Input field fixed at bottom.

### Header Zone
- **Component:** Thread header bar
- **Left:** Thread title — contextual to what's open in center panel
  - Patient thread: "Thread · Maria Garcia"
  - Referral thread: "Thread · Referral REF-2847"
- **Right:** Optional actions — `btn-icon` for thread settings (future)
- **Typography:** `text-sm font-semibold text-gray-900` for title
- **Bottom border:** `border-b border-gray-200`
- **Height:** ~44px, `px-4 py-2.5`

### Content Zone — Message List

Chronological message list, newest at bottom. Each message is a distinct component variant
based on `message_type`. The coordinator scrolls up for history, looks at the bottom for
the latest action.

#### Message Type: System Event
- **Component:** `[NEW COMPONENT: thread-msg-system]`
- Compact, muted, inline with timestamp
- Layout: single line, centered
- Icon: none
- Content: system event text — `text-xs text-gray-400`
- Timestamp: inline, right-aligned — `text-xs text-gray-400`
- Example: "Assessment complete. Initiating care plan. — 9:02am"
- **Spacing:** `py-1.5 px-4`
- Background: none (transparent)

#### Message Type: Agent Tool Call
- **Component:** `[NEW COMPONENT: thread-msg-tool-call]`
- Shows the agent performed an action. Expandable for detail.
- Layout:
  - **Left:** Small agent icon — `avatar-xs` with `fa-bolt` icon, `bg-violet-100 text-violet-600`
  - **Right column:**
    - Tool name: `◎ read_patient_assessment` — `text-xs font-mono text-gray-600`
    - Condensed result: `→ { phq9: 7, sdoh: 3 }` — `text-xs font-mono text-gray-500`
    - Timestamp: `text-xs text-gray-400`
- **Expandable:** Click tool call to expand full payload in a `collapse` component
- **Spacing:** `py-2 px-4`
- Background: none

#### Message Type: Agent Tool Result
- Rendered inline with tool call (not a separate message). The condensed `→` line IS the result.
- Full result visible on expand.

#### Message Type: Approval Request (THE HERO)
- **Component:** `[NEW COMPONENT: thread-approval-card]`
- Visually distinct from all other message types. This is the primary interaction moment.
- Layout:
  - **Container:** `card` with `border-l-4 border-primary-500` (or `border-amber-400` for warning, `border-red-500` for urgent)
  - **Card header:**
    - Icon + label: `fa-hand` + "Approval Needed" — `text-sm font-semibold`
    - Or contextual: `fa-hand` + "RDN Review Required" / `fa-hand` + "Final Approval"
  - **Card body:**
    - **Context line 1:** What this is about — "Care plan draft · Maria Garcia" — `text-sm font-medium`
    - **Context line 2:** Who prepared it — "Prepared by agent · 3 min ago" — `text-xs text-gray-500`
    - **Summary section:** Key facts the coordinator needs to decide (varies by type)
      - For care plan: goals list, nutrition summary, visit schedule
      - For referral: patient name, diagnosis, eligibility status
      - For discharge: discharge reason, outcome summary
    - **Typography:** Summary content in `text-sm`, labels in `text-xs text-gray-500`
    - **Downstream effects:** "Approving will:" + bullet list — `text-xs text-gray-600`
      - "Set patient status to active"
      - "Start meal prescription matching"
      - "Schedule first RDN visit"
  - **Card footer:**
    - **Primary action:** `.btn-primary btn-sm` — "Approve"
    - **Secondary actions:** `.btn-outline btn-sm` — "Edit first", "Reject", "Reassign" (or contextual alternatives)
    - **Note field:** `textarea` — "Add a note (optional)" — `text-sm`, 2 rows, expandable
    - **Attachment indicator:** If documents attached: `text-xs text-gray-500` — "1 document — not viewed" (warning) or "1 document — viewed" (muted)
  - **Spacing:** `p-4` inside card, standard card padding
  - **Max width:** Full panel width minus padding

#### Message Type: Human Message
- **Component:** `[NEW COMPONENT: thread-msg-human]`
- Coordinator's own messages and typed commands to the agent
- Layout:
  - **Right-aligned** (like `message-bubble-out` but styled for thread context)
  - Background: `bg-primary-50`
  - Content: message text — `text-sm text-gray-900`
  - Timestamp: below, right-aligned — `text-xs text-gray-400`
  - User label: "You" or coordinator name — `text-xs font-medium text-primary-600`
- **Spacing:** `py-2 px-4`, with `ml-8` to indent from left

#### Message Type: Approval Response
- **Component:** `[NEW COMPONENT: thread-msg-approval-response]`
- Collapsed summary of a past decision. Replaces the expanded approval card after action.
- Layout: single line, compact
  - Icon: `fa-circle-check` (approved) or `fa-circle-xmark` (rejected) — `text-green-600` or `text-red-600`
  - Text: "[Sarah K.] Approved with edits — sodium target reduced to 1800mg · 9:47am"
  - **Typography:** `text-xs text-gray-600`, name in `font-medium`
- **Spacing:** `py-1.5 px-4`
- **Expandable:** Click to re-expand the original approval card (read-only)

### Footer Zone — Thread Input

- **Component:** Extends `prompt-input-container` pattern
- **Fixed position:** Always visible at bottom of right panel, above any scroll
- **Layout:**
  - Input field: `textarea` with placeholder "Type a message or ask the agent..." — `text-sm`
  - Send button: `btn-icon btn-icon-primary` with `fa-paper-plane` — right side of input
  - Height: 44px default, expandable to 3 rows on multiline input
- **Border top:** `border-t border-gray-200`
- **Background:** `bg-white`
- **Spacing:** `p-3`

---

## Interaction Specifications

### Approve Action
- **Trigger:** Click "Approve" on approval card
- **Feedback:**
  1. Button shows `btn-loading` state (200ms)
  2. Approval card collapses to approval response line
  3. `toast` appears at bottom: "Approved. [Undo]" with 5-second countdown bar
  4. Queue item in left panel starts fade-out
- **Navigation:** None — thread stays showing the same record
- **Error handling:** If approval fails, `toast-error`: "Couldn't process approval. Try again." Card stays expanded.

### Undo Approve
- **Trigger:** Click "Undo" in the toast within 5 seconds
- **Feedback:**
  1. Toast dismisses
  2. Approval card re-expands to active state
  3. Queue item re-appears in sidebar
  4. Downstream workflows are cancelled (agent has not yet resumed)
- **Navigation:** None
- **Error handling:** If undo fails (agent already resumed), `toast-warning`: "This action has already been processed."

### Edit and Approve
- **Trigger:** Click "Edit first" on approval card
- **Feedback:**
  1. Center panel enters edit mode for the relevant record
  2. Approval card updates primary button to "Approve with edits"
  3. After edits, coordinator clicks "Approve with edits"
  4. Edits logged in thread with before/after
- **Navigation:** Focus moves to center panel for editing
- **Error handling:** If edits can't be saved, `alert-error` in center panel

### Reject with Note
- **Trigger:** Click "Reject" on approval card
- **Feedback:**
  1. Note field expands / focuses (if not already visible)
  2. "Reject" button becomes "Confirm rejection" (requires note)
  3. On confirm: approval card collapses to rejection response line
  4. No undo for rejections — agent needs to process the feedback
- **Navigation:** None
- **Error handling:** Rejection without a note is blocked — field validation

### Expand Tool Call
- **Trigger:** Click on a tool call message
- **Feedback:** `collapse` component expands to show full input/output payload
- **Navigation:** None
- **Error handling:** N/A

### Type Message to Agent
- **Trigger:** Coordinator types in thread input and presses Enter or clicks send
- **Feedback:**
  1. Message appears in thread as human message (right-aligned)
  2. Agent processes — `indicator-pulse` shows agent is working
  3. Agent response appears as tool call(s) and/or system message
- **Navigation:** None — stays in thread
- **Error handling:** If agent fails to respond, system message: "Agent couldn't process your request. Try rephrasing."

---

## States

### Empty State (No Thread Selected)
- Thread area shows centered content:
  - **Component:** `empty-state`
  - Icon: `fa-messages` in `text-gray-300`
  - Heading: "Select an item to see its thread"
  - Message: "Click a queue item or patient to view their activity."
  - No CTA
- Input field: disabled, placeholder "Select an item first"

### Loading State
- Thread header: `skeleton-text` for title
- Message area: 4-5 mixed `skeleton` rows (varying heights to suggest different message types)
- Input field: disabled during load

### Error State
- **Component:** `alert-error` at top of thread area
- Message: "Couldn't load thread"
- CTA: `.btn-outline btn-sm` "Retry"

### Agent Working State
- After coordinator sends a message or approval triggers agent work:
  - Bottom of thread: `indicator-pulse` + "Agent working..." — `text-xs text-gray-500`
  - Input field remains enabled (coordinator can queue another message)

### Approval Card After Decision
- Active card → collapsed response line (see approval response message type)
- Historical approval cards in the thread render as collapsed by default
- Can be expanded to see the original card (read-only)

---

## Accessibility Notes
- Thread panel: `role="complementary"` with `aria-label="Activity thread"`
- Message list: `role="log"` with `aria-live="polite"` for new messages
- Approval card buttons: standard button accessibility, no special ARIA needed
- Undo toast: `role="alert"` with `aria-live="assertive"`
- Tool call expand: `aria-expanded` on the toggle
- Thread input: `aria-label="Message to agent or care team"`
- Screen reader should announce new approval requests: `aria-live="polite"` on the message container

## Open Questions
- Should the approval card show a "Reassign" option at launch, or is that a future feature?
- Should rejected items show an "Agent re-drafting..." status in the thread after rejection?
- Should the thread input support slash commands (e.g., "/check-eligibility") in addition to natural language?
- Should there be a "Jump to latest" button when scrolled up in a long thread?

---

## New Components Flagged
- `[NEW COMPONENT: thread-msg-system — compact centered system event with timestamp]`
- `[NEW COMPONENT: thread-msg-tool-call — agent action with expandable payload, agent avatar]`
- `[NEW COMPONENT: thread-approval-card — THE HERO: card with context, recommendation, action buttons, note field, downstream effects list]`
- `[NEW COMPONENT: thread-msg-human — right-aligned coordinator message bubble]`
- `[NEW COMPONENT: thread-msg-approval-response — collapsed decision summary, expandable to read-only card]`
- `[NEW COMPONENT: thread-input — textarea with send button, fixed at panel bottom]`
