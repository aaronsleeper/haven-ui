# Journey: Morning Queue Triage

## Journey Metadata
- **User:** Care Coordinator (e.g., Sarah, manages 60-patient panel)
- **Goal:** Clear the overnight queue and set priorities for the day
- **Frequency:** Daily, first thing in the morning
- **Entry Point:** Opens Admin App, lands on queue view
- **Success Criteria:** All urgent items addressed, day's work prioritized, no patient left unattended past SLA
- **Duration:** 15-30 minutes (scales with panel size and overnight volume)

## Prerequisites
- Coordinator is logged in with MFA
- Agent has been running overnight — processing referrals, flagging exceptions, generating drafts
- Queue items have been auto-sorted by urgency tier

---

## Happy Path

### Step 1: Scan the Queue Summary
- **Screen:** Admin App — left sidebar (queue), center panel (summary dashboard)
- **User Action:** Glances at queue. The sidebar shows grouped counts by urgency tier.
- **System Response:** Queue displays:
  - 🔴 **Urgent** (SLA breaching or breached) — count and top item preview
  - 🟡 **Needs attention** (action needed, within SLA) — count
  - 🟢 **Informational** (FYI items, no action required) — count
- **Data Needed:** Queue item count per tier, oldest item age
- **Decision Point:** None yet — this is orientation. The coordinator is reading the room.

**What the center panel shows at this moment:**
A lightweight morning summary card (not a full dashboard — the coordinator hasn't clicked anything yet):
- "12 items overnight. 2 urgent, 7 need attention, 3 informational."
- Urgent items listed by name with one-line descriptions
- Any SLA breaches highlighted

### Step 2: Open First Urgent Item
- **Screen:** Left sidebar → click first 🔴 urgent item
- **User Action:** Clicks the top urgent queue item
- **System Response:**
  - Center panel loads the relevant record (patient, referral, report — whatever the item is about)
  - Right panel loads the thread for that record, scrolled to the relevant event
  - The approval card or action prompt is visible in the thread
- **Data Needed:** Full context for this item — patient record, agent recommendation, what happened
- **Decision Point:** What does this item need?

### Step 3: Review Context and Decide
- **Screen:** Center panel (record), right panel (thread with approval card)
- **User Action:** Reads the agent's recommendation in the approval card. Scans the thread to understand what led here. Checks the center panel for any additional context.
- **System Response:** Approval card shows:
  - What happened (trigger event)
  - What the agent recommends
  - Action buttons: Approve / Edit first / Reject / Reassign
  - Optional note field
- **Decision Point:** Approve, edit, reject, or reassign

**Common urgent item types and typical actions:**

| Item Type | Typical Action | Time |
|---|---|---|
| Care plan ready for final approval | Review sections, approve | 2-3 min |
| Eligibility failure — alternative path available | Review options, decide | 3-5 min |
| Patient unreachable > 5 days | Review attempts, decide next step | 2-3 min |
| SLA breach on partner communication | Review draft, approve send | 1-2 min |
| 3+ missed check-ins | Review history, initiate outreach | 3-5 min |

### Step 4: Take Action
- **Screen:** Right panel — approval card
- **User Action:** One of:
  - **Approve** (one tap) — agent resumes workflow automatically
  - **Edit first** — inline edits in center panel, then approve
  - **Reject with note** — types reason, agent receives feedback
  - **Reassign** — routes to another team member (e.g., RDN needs to review first)
- **System Response:**
  - Decision logged in thread with timestamp, coordinator name, and any notes
  - Approval card collapses to summary line: "[Sarah K.] Approved — 8:14am"
  - Queue item removed from sidebar
  - Queue count decrements
  - Next urgent item auto-highlights in sidebar (does not auto-open — coordinator controls pace)
- **Next Step:** Return to step 2 for next urgent item, or move to step 5

### Step 5: Work Through Needs-Attention Items
- **Screen:** Left sidebar — 🟡 needs-attention section
- **User Action:** Clicks through needs-attention items, same review-decide-act loop as steps 2-4
- **System Response:** Same pattern. These items have longer SLAs, so the coordinator can batch similar types:
  - "Let me handle all the new referrals first, then care plan reviews"
- **Decision Point:** Per item — same as step 3

**Batching behavior:** The coordinator may want to filter the queue by item type rather than working strictly by urgency. The sidebar supports this:
- Click "Referrals" filter → see only referral-related items
- Click "Care Plans" filter → see only care plan items
- Click "All" → return to urgency-sorted view

### Step 6: Scan Informational Items
- **Screen:** Left sidebar — 🟢 informational section
- **User Action:** Scans titles. Most are FYI — patient enrolled successfully, delivery confirmed, report generated. No action needed.
- **System Response:** Informational items auto-dismiss after 24h if unread, or on click. They don't require action — they keep the coordinator aware.
- **Decision Point:** Flag any that need follow-up (promotes to needs-attention)

### Step 7: Check Patient List for Quiet Risks
- **Screen:** Center panel — switch to Patient List view
- **User Action:** Scans patient list sorted by "last activity" (oldest first). Looks for patients with no recent events — these are the ones who might be falling through gaps.
- **System Response:** Patient list shows:
  - Status badge (active, high_risk, on_hold, etc.)
  - Risk tier with trend arrow (↑ rising, → stable, ↓ improving)
  - Last activity date and type
  - Patients with no activity in 7+ days highlighted subtly
- **Decision Point:** Any patient need proactive outreach?

### Step 8: Set the Day's Focus
- **Screen:** Center panel — back to summary view
- **User Action:** Queue is clear (or managed). Coordinator knows what needs doing today:
  - Scheduled patient calls
  - Upcoming appointments to prep for
  - Follow-ups from this morning's queue actions
- **System Response:** Summary card updates to show today's scheduled items
- **Next Step:** Begin scheduled work — the queue is now the background monitor

---

## Alternative Paths

### Alt 1: No Urgent Items Overnight
- **Trigger:** Queue shows 0 urgent, some needs-attention
- **Modified Steps:** Skip step 2-4, go directly to step 5
- **Outcome:** Shorter triage, coordinator starts scheduled work sooner
- **UX implication:** The empty-urgent state should feel good: "Nothing urgent overnight" — not "No items found"

### Alt 2: Crisis Item in Queue
- **Trigger:** A crisis protocol item (PHQ-9 Q9 > 0, patient safety concern)
- **Modified Steps:**
  - Crisis items render differently — red border, distinct icon, cannot be scrolled past
  - Center panel shows crisis detail with BHN contact info
  - Coordinator cannot approve/dismiss — must confirm BHN has been notified
  - This is a visibility item, not an approval item — coordinator's job is to verify the system worked
- **Convergence Point:** After confirming BHN is engaged, returns to normal queue flow

### Alt 3: High Volume Day (20+ items)
- **Trigger:** Large overnight volume (new partner onboarding, batch referrals)
- **Modified Steps:**
  - Morning summary card highlights the spike: "28 items overnight — 15 are new referrals from UConn batch"
  - Coordinator uses queue filters to batch by type
  - May delegate some items to another coordinator (if multiple staff)
- **Outcome:** Same flow, but batching and filtering become essential

### Alt 4: Coordinator Picks Up Mid-Day
- **Trigger:** Coordinator didn't start first thing — checking in after a meeting
- **Modified Steps:** Same flow, but queue may include items from earlier today in addition to overnight
- **Outcome:** No change to the interaction pattern — the queue is always current

---

## Exception Handling

### Exception 1: Agent Made a Bad Recommendation
- **Cause:** Agent drafted something incorrect — wrong eligibility path, inappropriate care plan suggestion
- **Frequency:** Occasional
- **Severity:** Graceful (caught by human review — this is why the review exists)
- **User Impact:** Coordinator sees the recommendation and disagrees
- **Recovery:**
  - Reject with note explaining why
  - Agent receives feedback and re-drafts
  - Or coordinator edits inline and approves the corrected version
- **Prevention:** Agent confidence scoring (future — P2). Low-confidence drafts get flagged visually.

### Exception 2: Queue Item Missing Context
- **Cause:** Agent surfaced an item but the thread doesn't have enough info to decide
- **Frequency:** Rare
- **Severity:** Graceful
- **User Impact:** Coordinator can't make a decision from what's shown
- **Recovery:**
  - Type a question in the thread: "What insurance does this patient have?"
  - Agent runs the lookup and returns the answer in the thread
  - Coordinator decides with new information
- **Prevention:** Agent should proactively include decision-relevant context in every queue item

### Exception 3: System Slow or Unresponsive
- **Cause:** Infrastructure issue, high load
- **Frequency:** Rare
- **Severity:** Critical (coordinator can't work)
- **User Impact:** Queue doesn't load, or actions don't save
- **Recovery:**
  - Loading state with "retrying" indicator (not a spinner with no context)
  - If persistent: banner with "System is experiencing delays — your actions are queued and will be processed"
  - Fallback: coordinator can access patient records read-only even if the agent framework is down
- **Prevention:** P1 incident (see AD-07 on-call policy)

---

## Critical Moments

| Step | Risk | Mitigation |
|---|---|---|
| 1 | Coordinator overwhelmed by high count | Morning summary card with headline, not just a number |
| 2 | Clicking wrong item, losing place | Sidebar preserves scroll position; "back to queue" is instant |
| 3 | Not enough context to decide | Agent includes decision-relevant context in every approval card |
| 4 | Accidental approve on wrong item | Undo window (5 seconds) after approve — "Approved. [Undo]" |
| 7 | Missing a quiet patient who's disengaging | "Last activity" sort + subtle highlight for 7+ day gaps |

---

## Connected Journeys

**Feeds into:**
- [Process a new referral](coordinator-referral-intake.md) — referral queue items discovered during triage lead here
- [Review and approve a care plan](coordinator-care-plan-review.md) — care plan items in queue lead here
- [Handle a disengaged patient](coordinator-disengaged-patient.md) — quiet-risk patients found in step 7

**Feeds from:**
- Agent overnight processing — the agent's work becomes the coordinator's queue
- AVA check-in calls — missed calls and flagged responses generate queue items
- Clinical workflows — RDN/BHN completions create approval items for coordinator

**Intersects with:**
- RDN clinical queue — some items require RDN action before coordinator can approve
- Partner portal — referral submissions from partners appear as queue items

---

## Design Implications

### This journey defines the coordinator's relationship with the product

The morning triage is where trust is built or lost. If the queue feels overwhelming, unclear, or
unreliable, the coordinator loses confidence in the entire system. Key design priorities:

1. **Urgency must be instantly readable.** Color, position, and size — not just labels. The coordinator
   should know how their day looks in the first 2 seconds.

2. **One click to full context.** Clicking a queue item must load everything needed to decide — record
   in center, thread in right, approval card visible. No second click to "see details."

3. **The approval card is the hero component.** It carries the agent's recommendation, the action
   buttons, and the note field. It must be scannable (what happened, what to do) and actionable
   (one tap to approve). This is the single most important UI element in the platform.

4. **Queue item removal is satisfying.** When an item is approved, it should feel resolved —
   smooth removal, count update, next item ready. The queue should feel like it's getting shorter.

5. **The empty state is a reward.** "Nothing needs your attention right now" is the goal state.
   Design it to feel earned, not broken.

6. **Filtering is power, not complexity.** Batch processing by type is a natural coordinator behavior.
   Filters should be visible, not buried. Think tabs or toggles, not a filter dropdown.
