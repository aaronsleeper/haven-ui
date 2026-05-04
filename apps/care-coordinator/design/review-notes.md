# UX Review: Care Coordinator Queue Triage

**Date:** 2026-03-27
**Inputs:** cc-shell-layout.md, cc-01-queue-sidebar.md, cc-02-thread-panel.md, cc-03-morning-summary.md
**Research consulted:** Pending — research agent running. Findings will be incorporated.

## Summary

The wireframes are structurally sound — the three-panel layout, urgency-grouped queue, and
approval card interaction model align well with the use cases. Three critical issues to address:
(1) the 240px sidebar is too narrow for the queue item content specified, (2) the thread panel
needs clearer visual separation between message types, and (3) the approval card needs
a more explicit visual break from surrounding thread messages to earn its "hero" status.

---

## Screen: CC-SHELL (Three-Panel Layout)

### Critical Issues

- **Sidebar width vs. content:** The spec calls for ~240px sidebar containing patient name + item type badge + one-line summary + SLA indicator. At 240px with 12px padding on each side, that's ~216px of content width. A patient name ("Maria Garcia-Rodriguez") + badge ("Care Plan") alone could exceed that. **Recommendation:** Increase to ~280px, or accept that patient names will truncate. Test with real name lengths from the patient data.

### Improvements

- **Right panel collapse on tablet:** The spec says the right panel collapses below `lg` (1024px) to a toggle. Consider that many coordinators may use 13" laptops at 1440px or even 1280px. At 280px + 380px fixed panels, the center panel gets only ~560px at 1280px. This is workable but tight. Flag for testing.
- **Panel dividers:** Border-only dividers between panels may be too subtle at a glance. Consider a 1px shadow or slightly darker border (`border-gray-300` instead of `border-gray-200`) on the sidebar right edge to give stronger panel definition.

### Copy
- No copy changes needed — the shell is structural.

---

## Screen: CC-01 (Queue Sidebar)

### Critical Issues

- **Queue item density:** Each item is specified at 64-72px. With 20+ items, the sidebar requires significant scrolling. The urgency section headers add height. **Recommendation:** Keep items at 60px maximum. Consider whether the "one-line summary" is earning its space — the summary is also visible in the thread panel when the item is selected. The queue item may only need: name, type badge, SLA indicator. The summary could appear on hover as a tooltip.

### Improvements

- **Filter pills horizontal scroll at 280px:** Six filter pills ("All", "Referrals", "Care Plans", "Eligibility", "Clinical", "Other") won't all fit at sidebar width. **Recommendation:** Use an overflow scroll with fade indicator, or limit to 4 visible pills with a "More" dropdown. Alternatively, filter pills could be icon-only with tooltips at this width.
- **Informational items visual weight:** The spec notes `opacity-75` for informational items. This is good. Consider also collapsing the informational section by default with a "3 informational" expand toggle. Most mornings, coordinators will focus on urgent + needs-attention and may never look at informational items.
- **Selected state vs. urgency border:** When an item is selected, the left border changes to primary color, replacing the urgency color. This means the coordinator loses the urgency context of the selected item. **Recommendation:** Keep the urgency border on select. Use background color (`bg-primary-50`) as the selection indicator instead. The urgency border should persist.

### Copy

- Queue section headers:
  - Urgent: "Urgent" → consider "Urgent · 2" (inline count, no separate badge)
  - Needs attention: keep as-is
  - Informational: keep as-is
- Empty state heading: "Nothing needs your attention right now." ✓ Good.
- Empty state message: "When agents need your input, items will appear here." ✓ Good.
- SLA indicators:
  - Within SLA: "2h ago" ✓
  - Warning: "Due in 1h" (not just a clock icon — state the time remaining)
  - Breached: "4h overdue" (state how long overdue, not just a red icon)

---

## Screen: CC-02 (Thread Panel)

### Critical Issues

- **Approval card visual distinction:** The approval card is specified with a `border-l-4` left border, same styling vocabulary as queue items. In a thread full of various message types, this may not be visually distinct enough. **Recommendation:** The approval card should break from the thread's visual flow more dramatically. Options:
  - Full-width card with `shadow-sm` (all other messages have no shadow)
  - Slightly larger padding than other messages
  - Subtle background tint (`bg-amber-50` for pending approvals)
  - The combination of shadow + background tint + left border would create a clear "this needs your attention" signal without being noisy.

- **Undo toast and approval response timing:** The spec says: approve → card collapses to response line → toast with 5-second undo. If the card immediately collapses, the coordinator loses the context they just reviewed. **Recommendation:** During the 5-second undo window, show a transitional state: the card dims but stays visible (not collapsed), with a "Approved ✓ [Undo]" overlay. Only collapse to the response line after the undo window expires. This lets the coordinator verify what they just approved while the undo is still available.

### Improvements

- **Agent tool call messages are noisy:** In a typical care plan workflow, there might be 5-10 tool calls before the approval card. That's a lot of `◎ read_patient_assessment → { phq9: 7 }` messages for a coordinator who just wants to approve. **Recommendation:** Group consecutive tool calls under a single expandable block: "Agent completed 6 actions — [expand]". Only the final tool call result (the one that produced the approval request) shows individually. This dramatically reduces visual noise while preserving the audit trail.

- **Thread input placeholder:** "Type a message or ask the agent..." — consider "Message care team or ask the agent..." to make clear the input supports both human-to-human messaging and agent commands.

- **Attachment indicator wording:** "1 document — not viewed" is subtly judgmental. **Recommendation:** "1 attachment · [View]" when unviewed (with the View link being the nudge). After viewing: "1 attachment · viewed ✓". The call-to-action is more effective than the label.

### Copy

- Thread empty state heading: "Select an item to see its thread" ✓ Good.
- Thread empty state message: "Click a queue item or patient to view their activity." ✓ Good.
- Agent working indicator: "Agent working..." → "Processing..." (shorter, less anthropomorphic for the UI label; the thread messages themselves can be conversational)
- Approval card downstream effects heading: "Approving will:" ✓ Good — this transparency is excellent.
- Reject confirmation: "Confirm rejection" → "Reject with note" (the button label should describe the action, not the confirmation state)
- Undo toast: "Approved. [Undo]" → "Approved ✓ Undo" (remove period, add checkmark, make Undo a text-link not a button — faster to scan)

---

## Screen: CC-03 (Morning Summary)

### Improvements

- **Greeting personalization:** "Good morning, Sarah" is warm and correct. The time-of-day question in Open Questions is worth implementing — it's low effort and avoids "Good morning" at 2pm.
- **Urgent items preview click target:** The clickable items in the preview list should have the same hover state as queue items for consistency. The user should recognize that these are the same items they'll see in the sidebar.

### Copy

- Nothing-urgent variant: "Nothing urgent overnight." ✓ Good with the green checkmark.
- No scheduled items: "No scheduled items today." → "No scheduled items today. Your queue is your guide." (gently redirects attention)

---

## Cross-Screen Issues

### Visual Hierarchy Across Panels

The three panels need distinct visual treatments to guide the coordinator's eyes:
- **Left (queue):** Dense, scannable, low visual weight per item. The coordinator's eye starts here.
- **Center (record):** Full detail, comfortable reading density. The coordinator's eye goes here for context.
- **Right (thread):** Action-oriented, the approval card pulls attention. The coordinator's eye ends here for decisions.

The current specs handle this well. One addition: the approval card should be the single loudest visual element on the screen when it's present. If the coordinator's eye is in the center panel, the approval card in the right panel should pull it over.

### Consistency of Time Display

The wireframes show times in multiple formats:
- Queue item: "2h ago"
- Thread messages: "9:02am"
- Approval card: "3 min ago"
- Morning summary: no times on scheduled items

**Recommendation:** Standardize on relative time for recent events (< 24h) and absolute time for older events. Queue items and thread messages should use the same format. Scheduled items in the morning summary should show time: "10:00am — RDN visit, Maria Garcia."

---

## Use Case Walk-Through

### UC-CC-01 (Morning Queue Scan)
Can the coordinator understand their day in 2-3 seconds? **Yes**, with the morning summary card showing counts + urgent previews. The queue summary bar reinforces this. No friction.

### UC-CC-02 (Review and Act on Queue Item)
Can the coordinator go from queue click to decision to resolution smoothly? **Yes**, with one modification: the approval card undo behavior needs the transitional state described above. Otherwise the flow is: click → read context → read recommendation → tap approve → done. Clean.

### UC-CC-03 (Batch Process by Type)
Can the coordinator filter and process similar items efficiently? **Partially.** The filter pills work, but the sidebar width constraint may make them hard to use. Icon-only pills with tooltips would solve this. The sequential click-review-approve loop within a filtered set is smooth.

### UC-CC-04 (Direct Agent via Thread)
Can the coordinator type a question and get an answer? **Yes.** The thread input is always visible. The agent working indicator shows something is happening. Response appears inline. No friction identified.

### UC-CC-05 (Quiet Risk Scan)
Can the coordinator spot patients who are falling through gaps? **Not covered in these wireframes.** This requires the Patient List view (CC-PATIENTS), which is out of scope for this sprint. The wireframes correctly defer this. No issue.

---

## Decisions (Gate 2 — Aaron, 2026-03-27)

1. **Sidebar width:** 240px. Accept truncation on longer names.
2. **Tool call grouping:** Individual messages. Each tool call stays visible and expandable for transparency.
3. **Informational section:** Expanded by default. No "happy path" actions hidden.
4. **Approval card undo behavior:** Option A — immediate collapse + toast with undo.
5. **Filter pills format:** 4 visible pills + "More" dropdown for overflow.

---

## Wireframe Revisions Applied

The following changes should be applied to the wireframe files before haven-mapper:

### CC-01 Revisions
- [REVISED] Selected queue item keeps urgency left border; selection indicated by `bg-primary-50` only
- [REVISED] SLA warning text: show time remaining ("Due in 1h"), not just icon
- [REVISED] SLA breached text: show time overdue ("4h overdue"), not just icon

### CC-02 Revisions
- [REVISED] Approval card: add `shadow-sm` + `bg-amber-50` background for pending state
- [REVISED] Approval card undo: immediate collapse + toast (Option A confirmed)
- [KEPT] Tool calls remain individual messages — each expandable for transparency
- [REVISED] Attachment indicator: "1 attachment · [View]" / "1 attachment · viewed ✓"
- [REVISED] Thread input placeholder: "Message care team or ask the agent..."
- [REVISED] Reject button label: "Reject with note"

### CC-03 Revisions
- [REVISED] Scheduled items show time: "10:00am — RDN visit, Maria Garcia"
- [REVISED] Add time-of-day greeting variant

---

# UX Review: Care Coordinator Shell + Per-App Minimums (Stage 2 Pipeline)

**Date:** 2026-05-03
**Inputs:**
- `apps/care-coordinator/design/wireframes/cc-shell-flow.md`
- `apps/care-coordinator/design/wireframes/shell-cc-coordinator.md`
- `apps/care-coordinator/design/wireframes/cc-01-queue-with-care-plan-approval.md`
**Reviewer:** ux-design-review (pre-build mode)
**Research consulted:**
- NN/G, "Dangerous UX: Consequential Options Close to Benign Options" — Approve / Reject button proximity in approval card [Source: NN/G, "Dangerous UX"]
- NN/G, "Tabs, Used Right" — content chunking (informs filter-pill design) [Source: NN/G, "Tabs, Used Right"]
- W3C WAI 2.2.1 Timing Adjustable — undo timer accessibility [Source: W3C WAI, "WCAG 2.1 — Timing Adjustable"]
- Destructive-action UX timing 5–30s range; clinical signature stakes (uncited but established practice — Gmail Undo Send precedent at 20-30s)
- WCAG 2.1.2 (No Keyboard Trap) — verified

## Summary

Coordinator wireframes are tightly aligned with the universal shell, and the worked example (Maria Rivera care-plan final approval) is concrete enough to drive haven-mapper directly. All primitives shipped — zero new components required. Three issues need attention: (1) the approval card's `Reject` button sits adjacent to `Approve` with no visual separation, violating NN/G guidance on benign-vs-consequential proximity; (2) the worked-example summary card mixes RDN-owned nutrition values with coordinator-edit context — needs a clear "what the coordinator owns vs reads" demarcation; (3) `cc-01` underspecifies focus management when a left-pane item is clicked. All resolvable with revisions; none structural.

## Screen: cc-shell-flow

### Critical Issues

None. Flow document is concise and accurate.

### Improvements

- **`cc-shell-layout.md` is "superseded" but still present.** Add a `> [!archived]` callout at the top of `cc-shell-layout.md` so dev-tasker doesn't try to map both.

## Screen: shell-cc-coordinator

### Critical Issues

None. Inherits universal shell correctly; per-app constraints (EN-only at v1; coordinator full-allowlist thread; thread input in right pane) are locked.

### Improvements

- **§Filter queue by type — "Per-session; resets on app reload" is a regression risk.** Sarah works the queue all day; if filter resets every reload, she'll re-apply the same filter many times. Recommend per-user persistence to match resize-pref behavior.

- **§Open Questions item 3 ("right pane close affordance")** — Gate 2 decision 2 confirmed kitchen-only collapsibility. Promote: coordinator has no collapse-the-right-pane affordance at v1.

- **Thread input placeholder "Ask Ava or send a note…"** is correct for coordinator workflow (overrides PL default "You talk. I'll listen.")

- **Filter pills** — flag the candidate set in Open Questions for Aaron: "All / Referrals / Care plans / Discharges / Insurance" (Insurance is its own pill, not folded).

### Copy

- **Empty queue heading:** "Nothing needs your attention right now"
- **Empty queue body:** "We'll surface anything urgent. Until then, you're caught up."
- **Empty tier (one tier 0, others populated):** "Nothing urgent right now." / "Nothing in needs-attention." / "No informational items."
- **Right pane empty (no record selected):** "Pick a queue item to start. Each conversation lives with a specific patient or referral."
- **Queue load failed:** "We couldn't load your queue. Retrying…" + "Try again"
- **Center load failed:** "We couldn't load this record. Try again or pick a different item." + "Try again"
- **Thread load failed:** "We couldn't load activity for this record." + "Try again"
- **Thread input placeholder:** "Ask Ava or send a note…"

## Screen: cc-01-queue-with-care-plan-approval

### Critical Issues

- **Approve and Reject sit adjacent in the action row.** Current order: `[Approve] [Edit first] [Reject] [Reassign]`. Reject is consequential (sends back to agent for redraft, blocks downstream meal-match scheduling); Approve is the happy path. NN/G "Dangerous UX" recommends separation. — Recommendation: reorder to `[Approve] [Edit first] [Reassign] [Reject]` so Reject is rightmost and physically separated from Approve. Reassign sits naturally between (also a "not approving" path but reversible). [Source: NN/G, "Dangerous UX"]
  - **Severity:** moderate — current state is unsafe-adjacent but tap-target sizing creates some buffer. Worth fixing now.

### Improvements

- **`thread-msg-tool` events default state unspecified.** For coordinator review, agent's intermediate work is context, not action — should default collapsed. Approval card auto-scroll on first record-open (Gate 2 decision 6) means tool calls don't need to compete for attention.

- **Plan summary card mixes RDN-owned nutrition values with coordinator-edit context.** Per Gate 2 decision 4, nutrition section is read-only after RDN sig. — Recommendation: render nutrition values with a small "Signed by Dr. Soto · 9:43 AM · Locked" inline indicator (`badge-success badge-sm`) per nutrition value to communicate clearly that these are not coordinator-editable.

- **"Edit first" mode — coordinator-editable fields not enumerated.** Per Gate 2 decision 4: nutrition is RDN-locked; goals + downstream effects are coordinator-owned. State enumeration explicitly: "Coordinator-editable fields in Edit-first mode: care plan goals, downstream effects, scheduling preferences. Nutrition section: read-only with Re-route to RDN affordance instead of inline edit."

- **Approval card auto-scroll on first record-open (Gate 2 decision 6)** — promote from Open Questions to canonical interaction spec.

- **Reject note** — required, minimum 10 chars; field-level validation matches Reassign pattern.

- **Reassign scope** — team-only at v1.

- **Focus management on queue-item click** — when Sarah clicks a queue-item with mouse, focus moves to the clicked item; keyboard arrow keys within queue follow active item. State explicitly.

### Copy

- **Record header trailing badge:** "Pending coordinator approval"
- **Status meta:** "Updated 9:47 AM by Ava (agent draft) · RDN signed 9:43 AM by Dr. Soto"
- **Plan summary section heading:** "Plan summary"
- **Nutrition section locked indicator:** "Signed by Dr. Soto · 9:43 AM · Locked"
- **Meal plan helper text:** "Ava generated this meal plan from Maria's preferences and the nutrition targets above. Approving the care plan resumes meal-match scheduling for the next 7 days."
- **Downstream effects heading:** "What approving this plan does"
- **Downstream effects bullets:**
  - "Resume meal-match scheduling (7 days)"
  - "Send patient notification: 'Your new care plan is ready'"
  - "Schedule first nutrition check-in for next Wednesday"
- **Approval card header title:** "Approval requested · Care plan final approval"
- **Approval card context meta:** "Prepared by Ava 9:47 AM · RDN signed 9:43 AM"
- **Approval card summary:** "Plan: 1800mg sodium, 1500 kcal, 75g protein/day. Nutrition section signed. No BHN required (PHQ-9 = 4). Meal plan generated from preferences + targets."
- **Approval card effects label:** "Approving will:"
- **Approve toast:** "Care plan approved. Tap to undo." (5-second window per Gate 2 decision 1)
- **Approve confirmed log:** `[Sarah K.] Approved · 9:48 AM`
- **Approve confirmed system event:** "9:48 AM · Meal-match scheduling resumed for Maria Rivera"
- **Approval write-failed:** "We couldn't save the approval. Tap retry, or contact support if it keeps failing." + "Try again"
- **Reject note label (sr-only):** "Reason for rejection (required)"
- **Reject note placeholder:** "Tell the team what needs to change…"
- **Reject confirmation log:** `[Sarah K.] Rejected — [first 60 chars of note] · 9:48 AM`
- **Reassign modal title:** "Reassign to a teammate"
- **Reassign modal helper:** "Pick a coordinator on your team. They'll see this in their queue."
- **Reassign confirm toast:** "Reassigned to [name]."
- **Edit-first sticky footer save:** "Save and approve"
- **Edit-first sticky footer cancel:** "Cancel"
- **Re-route to RDN button:** "Re-route to RDN"
- **Re-route to RDN helper:** "The RDN signed this section. Edits need a re-signature."

## Cross-Screen Issues

- **Filter persistence** — only "per-session" persistence in coordinator wireframes; recommend per-user for consistency.
- **Approval card action ordering** — apply the proximity-fix to all coordinator approval flows.
- **`thread-msg-tool` default-collapsed pattern** — apply consistently to coordinator + provider screens.

## Use Case Walk-Through

- **CC-SHELL-01 (Morning queue scan):** Walks. Three panes render; Sarah reads the room.
- **CC-SHELL-02 (Open queue item → review record + thread):** Walks. Click → parallel-load → approval card pinned with auto-scroll on first open.
- **CC-SHELL-03 (Decide and act on approval card):** Walks except for Reject-adjacent-to-Approve issue.
- **CC-SHELL-04 (Direct agent via thread input):** Walks. Send → human message → tool call + result.
- **CC-SHELL-05 (Resize right pane):** Walks. Drag-clamp + per-user persistence with viewport clamping is correct.

## Open Questions for Aaron at Gate 2-review

1. **Approval card action ordering** — re-order to `[Approve][Edit first][Reassign][Reject]` per NN/G destructive-separation guidance? Recommend yes.
2. **Filter pills set** — "All / Referrals / Care plans / Discharges / Insurance" — confirm Insurance stands alone.
3. **Filter persistence** — per-user vs per-session? Recommend per-user.
4. **Reassign scope** — team-only at v1 vs org-wide? Recommend team-only.
5. **Reject note minimum** — 10 chars? Recommend yes (matches Reassign pattern).

## Verdict

**ITERATE-THEN-SHIP.** Revisions land inline; ready for haven-mapper after Aaron's Gate 2-review on the action-ordering decision (only structurally meaningful question; rest is copy + decision promotion).
