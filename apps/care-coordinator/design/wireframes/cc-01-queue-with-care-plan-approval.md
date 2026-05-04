# cc-01-queue-with-care-plan-approval: Queue + Care Plan + Approval Card (Worked Example)

**Application:** Care Coordinator (Admin App)
**Use Case(s):** CC-SHELL-01, CC-SHELL-02, CC-SHELL-03 (`apps/care-coordinator/design/shell-use-cases.md`)
**User Type:** Care Coordinator (Sarah)
**Device:** Desktop primary; tablet (≥720px) supported
**Route:** `/patients/maria-rivera/care-plan` (queue item that maps to this record's care plan)

This is the worked example for the coordinator slice (Gate 2-prep decision 5): **Maria Rivera's care plan ready for final approval — RDN signed the nutrition section; coordinator approving the full plan.** It demonstrates the per-app minimum (queue with 3 urgency categories + thread with one active approval card) inside the universal agentic shell.

---

## Page Purpose

Sarah opens the app at the start of her shift; the queue contains one urgent item: Maria Rivera's care plan is ready for final coordinator approval after the RDN signed the nutrition section. Sarah clicks the queue item, reviews the care plan in the center pane, reads the agent's recommendation summary in the thread, and decides — Approve / Edit first / Reject + note / Reassign. Decision and audit are the same artifact.

---

## Layout Structure

### Shell

Inherits from `shell-cc-coordinator.md`. Three panes:
- Left: queue with Maria Rivera's "Care plan ready for approval" item active
- Center: care plan record viewer with focus on full-plan summary
- Right: thread with the active approval card pinned at top

### Header Zone — `record-header` in center pane

- **Component:** `record-header` + `record-header-main` + `record-header-title` + `record-header-subtitle` + `record-header-trailing` + `record-header-meta`
- Title: "Care Plan — Maria Rivera" (Lora display, Heading/01 27.65px Lora Medium per `DESIGN.md` §Typography)
- Subtitle: "DOB 1958-03-12 · MRN PT-2024-0847 · Patient since Aug 2024" (Body/03 muted)
- Trailing: status badge — `badge-warning` "Pending coordinator approval" + risk tier badge `badge-info` "Moderate risk"
- Meta: "Updated 9:47 AM by Ava (agent draft) · RDN signed 9:43 AM by Dr. Soto"
- Surface: solid white card primitive on sand-50 page

### Content Zone

#### Left pane — Queue with active item

- Section: `queue-section-header.is-urgent` "Urgent" (count: 1)
  - `queue-item.is-urgent.active` (`aria-current="true"`) — the Maria Rivera care plan item
    - Header: "Maria Rivera" (Body/02 semibold) + `badge-pill badge-warning` "Care plan"
    - Summary: "Care plan ready for final approval" (Body/03 muted, one line)
    - Meta: "12 min ago · SLA 2h" + `queue-item-sla.is-warning` chip showing 75% elapsed
- Section: `queue-section-header.is-attention` "Needs attention" (count: 7)
  - 7 `queue-item.is-attention` rows preview (Body/03 truncated): a discharge follow-up, an insurance verification, a meal-match exception, etc.
- Section: `queue-section-header.is-info` "Informational" (count: 3)
  - 3 `queue-item.is-info` rows (Body/03)
- Below: `divider` + secondary nav: Patients / Reports / Settings (`sidebar-nav-list`)
- User menu pinned at bottom

#### Center pane — Care plan record viewer

- **Record header** (described above)
- **Plan summary card** — `card` with `card-header` ("Plan summary" Heading/03) + `card-body` [REVISED — locked-section indicator added per Gate 2 decision 4]
  - Goals: 3-bullet list (Body/02) — "Reduce HbA1c to <7.0", "Establish 1800mg/day sodium target", "Weekly nutrition check-ins"
  - Nutrition section status: `badge-success` "Signed by Dr. Soto · 9:43 AM · Locked" (per-value indicator on the nutrition values shown below — communicates that nutrition is RDN-owned and read-only from coordinator's view)
  - Behavioral health status: `badge-secondary` "Not applicable (PHQ-9 = 4)"
  - Coordinator-editable fields in this view: care plan goals, downstream effects, scheduling preferences. Nutrition section: read-only with "Re-route to RDN" affordance instead of inline edit.
- **Nutrition section card** (preview of what RDN signed) — `card`
  - `clinical-nutrition-list` showing: Caloric target, Protein g/day, Sodium mg/day, Carbohydrate g/day, Fiber g/day
  - `editable-indicator` is **hidden** here (signed and locked); coordinator views read-only
  - `clinical-ai-field-confirmed` markers on agent-populated values that RDN reviewed
- **Meal plan preview card** — `card` [REVISED]
  - `data-table` showing 7 days × 3 meals/day grid (compact); patient-friendly meal names
  - Helper: "Ava generated this meal plan from Maria's preferences and the nutrition targets above. Approving the care plan resumes meal-match scheduling for the next 7 days."
- **Downstream effects card** — `card.card-body` with `alert-info` inside
  - Heading: "What approving this plan does"
  - Bulleted: "Resume meal-match scheduling (7 days)", "Send patient notification: 'Your new care plan is ready'", "Schedule first nutrition check-in for next Wednesday"

#### Right pane — Thread with approval card pinned

- **Active approval card (hero) — `thread-approval-card.is-urgent`:**
  - Header: `thread-approval-header` with `fa-hand` icon (sand) + "Approval requested · Care plan final approval" + Ava avatar (16px sparkle leading dot)
  - Body: `thread-approval-body`
    - `thread-approval-context` — `thread-approval-context-title` "Maria Rivera · Care plan v2" + `thread-approval-context-meta` "Prepared by Ava 9:47 AM · RDN signed 9:43 AM"
    - `thread-approval-summary` — Body/03: "Plan: 1800mg sodium, 1500 kcal, 75g protein/day. Nutrition section signed. No BHN required (PHQ-9 = 4). Meal plan generated from preferences + targets."
    - `thread-approval-effects-label` "Approving will:" + `thread-approval-effects` (3-bullet list mirroring the downstream effects card)
  - Actions row: `thread-approval-actions` [REVISED — action ordering separates destructive from happy-path per NN/G "Dangerous UX" guidance]
    - `btn-primary btn-sm` "Approve" (primary teal — this is a commitment per `DESIGN.md` brand-taste rule)
    - `btn-outline btn-sm` "Edit first"
    - `btn-ghost btn-sm` "Reassign"
    - `btn-outline btn-sm` "Reject" (rightmost; visually separated by a 16px gap so accidental tap-buddying is blocked)
  - Note field (collapsed by default; expands on Reject click) — `thread-approval-note` + sr-only `<label>`. Required; minimum 10 chars; field-level validation matches Reassign note pattern.

- **Recent thread events** (above the approval card, scrollable): [REVISED — default collapsed state stated explicitly]
  - `thread-msg-system` "9:43 AM · Dr. Soto signed the nutrition section"
  - `thread-msg-tool` (collapsible, default collapsed) — Ava authored — "Generated meal plan from Maria's dietary preferences (Mediterranean lean) and nutrition targets" + on expand: 7-day meal-match output summary
  - `thread-msg-tool` (collapsible, default collapsed) — Ava authored — "Verified no BHN handoff needed (PHQ-9 = 4, well below 10 threshold)"
  - `thread-msg-system` "9:30 AM · Care plan v2 draft generated by Ava"
  - `thread-msg-system` "8:15 AM · Maria submitted weekly check-in (energy: improving)"
  - Older events fade upward; user scrolls for history
  - Approval card auto-scrolls to itself on first record-open (Gate 2 decision 6); preserves user scroll on subsequent reads.

- **Thread input** at bottom: `prompt-input-container` — placeholder "Ask Ava or send a note…" [REVISED]

### Footer Zone

No persistent footer; record-viewer in center has no sticky footer because all actions live in the right-pane approval card.

---

## Interaction Specifications

### Click Approve
- **Trigger:** Click `btn-primary btn-sm` "Approve" in the approval card
- **Feedback:** Card actions disable; 5-second undo `toast.toast-info` slides in at bottom-right of right pane: "Care plan approved. Tap to undo." with `fa-arrow-rotate-left` icon
- **Navigation:** On undo timeout (5s elapsed without click):
  1. Approval card collapses to `thread-msg-response.is-approved` summary: "[Sarah K.] Approved · 9:48 AM"
  2. Queue item disappears from left pane; urgent count decrements 1 → 0
  3. Next urgent item (if any) highlights but does NOT auto-open
  4. Center pane stays on Maria Rivera's care plan; status badge updates to `badge-success` "Approved"
  5. New `thread-msg-system` appears below the response: "9:48 AM · Meal-match scheduling resumed for Maria Rivera"
- **Error handling:** If decision write fails, undo toast persists with `alert-error` inline below the card: "We couldn't save the approval. Tap retry, or contact support if it keeps failing." + retry CTA "Try again". Card stays pending. [REVISED]

### Click Edit first
- **Trigger:** Click `btn-outline btn-sm` "Edit first"
- **Feedback:** Center pane plan summary card transitions to inline-edit mode (`editable-indicator` markers appear next to coordinator-owned fields — goals, downstream effects). Right-pane approval card stays visible.
- **Navigation:** Coordinator edits in center, then clicks "Save & approve" (sticky footer in center pane appears with `btn-primary` "Save and approve") — flow returns to Approve handling above with `[Sarah K.] Approved with edits` summary noting the edited field
- **Error handling:** Per-field validation; save-failed inline error.

### Click Reject
- **Trigger:** Click `btn-outline btn-sm` "Reject"
- **Feedback:** `thread-approval-note` field expands below actions; textarea + sr-only label "Reason for rejection (required)" appears with "Send reject" `btn-danger btn-sm` and "Cancel" `btn-ghost btn-sm`
- **Navigation:** On Send: decision logs as `thread-msg-response.is-rejected` with the note expanded by default; queue item moves to "Needs attention" with new agent task to revise; agent receives feedback
- **Error handling:** Required-field validation on note; field-level error if empty

### Click Reassign
- **Trigger:** Click `btn-ghost btn-sm` "Reassign"
- **Feedback:** `overlay-modal` opens — coordinator picker with `combobox` of other coordinators + optional note field
- **Navigation:** On confirm: item moves to selected coordinator's queue; current view's queue item disappears; toast confirmation
- **Error handling:** Coordinator-pick validation; modal-level error.

### Click queue item (already active in this state)
- **Trigger:** Click the active queue item again
- **Feedback:** No state change (item is already active)
- **Navigation:** None
- **Error handling:** N/A
- **Focus management:** [REVISED] When user clicks a queue-item with mouse, keyboard focus moves to the clicked item; arrow-key navigation within the queue follows the active item.

### Click another queue item
- **Trigger:** Click any non-active queue item
- **Feedback:** New item gets `.active`; current Maria Rivera record fades from center; new record loads
- **Navigation:** Center loads the new record; right loads the new thread
- **Error handling:** Per-pane.

### Type in thread input
- **Trigger:** Type in `prompt-input-container` and press Enter or click send
- **Feedback:** Message appears as `thread-msg-human` (right-aligned bubble); spinner with "Ava is working..."
- **Navigation:** Stays in current view; agent runs the request; tool-call + result render below
- **Error handling:** Send-failed retry icon

---

## States

### Default (loaded)
- Approval card pinned as hero in right pane
- Queue urgent count: 1; needs-attention 7; informational 3
- Center: Maria Rivera care plan loaded with all summary cards rendered

### Loading State
- Approval card area: `skeleton` matching card height + button row skeleton
- Thread above: 3-4 `skeleton` rows for prior events
- Center: record-header skeleton + 3 `skeleton` cards for plan summary / nutrition / meal plan
- Left queue: 5 `skeleton` rows already loaded under section skeletons (but typically queue loads first)

### Empty State (queue cleared after approving) [REVISED]
- Right pane: card collapses to `thread-msg-response.is-approved` summary
- Left urgent count = 0; section header still visible with empty-tier copy "Nothing urgent right now"
- Center stays on Maria Rivera with status updated to "Approved"

### Error State (approval write fails)
- Approval card remains pending
- Below action row: `alert-error` inline with retry CTA; card actions re-enabled
- 5-sec undo toast persists if applicable

### Post-approval State (decision logged, queue item resolved)
- Approval card collapses to one-line `thread-msg-response.is-approved`
- New `thread-msg-system` events log downstream effects
- Center pane status badge updates from "Pending" to "Approved"

---

## Accessibility Notes

- Approval card: `<section role="region" aria-labelledby="approval-card-title">` with `<h3>` title for landmark navigation
- Approve button: primary teal — color-independence: button label text ("Approve") + icon (`fa-check`) carry the meaning beyond color
- 5-second undo toast: `aria-live="assertive"` so screen readers announce; toast itself is `<div role="status">`
- Reject note textarea: `<label class="sr-only" for="reject-note">Reason for rejection (required)</label>` + `aria-required="true"`
- Tab order: queue items in left → record content in center → thread events / approval card actions / thread input in right
- Approval card actions are buttons in DOM order Approve → Edit first → Reject → Reassign; arrow-key navigation within the action row optional
- Touch targets 44px minimum; primary action `btn-sm` on desktop is 36px-tall — confirm tablet (48px-tall variant) by using `btn-md` if tablet primary

## Bilingual Considerations

- Coordinator app is EN-only at v1
- Maria Rivera is bilingual (per persona); patient-facing notification ("Your new care plan is ready") will render bilingual on the patient app — that copy is owned by patient-app wireframes, not this coordinator screen
- For now, all coordinator-facing strings on this screen are EN

## Open Questions

- "Reassign" target list: scoped to the coordinator's team only or org-wide? Recommend team-scoped at v1.
- Approve flow on first-load: does the approval card auto-scroll into view, or stay positioned wherever the thread last left off? Recommend auto-scroll to the active approval card on record-open.
- 5-sec undo: is 5 seconds correct for this stakes level (downstream meal-match scheduling resumes)? Higher-stakes signature flows may want 10 seconds; here 5 feels right because the downstream effects are reversible (cancel meal scheduling). Confirm.
- "Edit first" returns to approve flow with edits attached — should the system require RDN re-signature if a coordinator edits the nutrition section? In this worked example, the coordinator edits goals/downstream, not nutrition; recommend: edits to nutrition section ARE locked from coordinator (read-only after RDN signature) and require explicit "Re-route to RDN" instead of "Approve."

---

## New Components Flagged

None. All primitives ship in PL: `record-header`, `card`, `card-header`, `card-body`, `clinical-nutrition-list`, `clinical-ai-field-confirmed`, `data-table`, `alert-info`, `thread-approval-card.is-urgent` (shipped variant), `thread-approval-header`, `thread-approval-body`, `thread-approval-context`, `thread-approval-summary`, `thread-approval-effects`, `thread-approval-actions`, `thread-approval-note`, `thread-msg-system`, `thread-msg-tool`, `thread-msg-response.is-approved` / `.is-rejected`, `prompt-input-container`, `btn-primary`, `btn-outline`, `btn-ghost`, `btn-danger`, `btn-sm`, `toast`, `toast-info`, `overlay-modal`, `combobox`, `badge-warning`, `badge-success`, `badge-info`, `badge-secondary`, `badge-pill`, `queue-section-header`, `queue-item`, `queue-item-sla.is-warning`, `divider`, `editable-indicator`.
