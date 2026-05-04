# Care Coordinator — Shell Use Cases (Universal Shell + Coordinator Minimums)

**Application:** Care Coordinator (Admin App)
**Persona:** Care Coordinator (primary), Admin (secondary)
**Device:** Desktop primary; tablet supported; mobile rare
**Status:** Phase 1–3 complete; Gate 1 ready
**Parent:** [`apps/_shared/design/universal-shell-use-cases.md`](../../_shared/design/universal-shell-use-cases.md)

This doc covers the coordinator's slice of the universal shell + the **minimum features that make the app feel like the coordinator app** rather than chrome with placeholders. Per Gate 1 G1.2: *queue with 3 categories (urgent / needs-attention / informational) + thread showing one active agent task with approval card.*

---

## Phase 1: Discovery

### Persona — Care Coordinator (Sarah)

- 60-patient panel; daily workflow is queue-driven
- Primary mode: review-and-approve agent recommendations
- Sees the full agent activity thread (it is the audit record)
- Approves, edits, rejects, or reassigns queue items
- Desktop primary; tablet acceptable; mobile rare

Existing shipped material: `queue-triage-use-cases.md`, `cc-shell-layout.md`, slices cc-01 through cc-09. The shell + queue + thread is largely shipped — this pass updates the coordinator slice to adopt the **rich agentic-shell base** per Gate 1 G1.1 and demonstrates **one active agent task with approval card** as the worked example.

### User goals

| Goal | Frequency | Priority |
|---|---|---|
| Open the app and see the day's queue grouped by urgency | Daily, first action | Highest |
| Move queue → record → decision in 2 taps | Per item, many times | Highest |
| See full agent activity thread for the open record | Per item | Highest |
| Approve / edit / reject one agent recommendation | Many times daily | Highest |
| Direct the agent via thread input ("check secondary insurance") | Ad hoc | Medium |
| Resize the right pane to give myself more reading room | Per session | Medium |

### Use cases (coordinator-specific)

#### CC-SHELL-01: Morning queue scan
**Precondition:** Coordinator is logged in. Agent has been running overnight.
**Trigger:** Coordinator opens the Admin App.
**Flow:**
1. Shell renders three panes; agentic-shell rich base, Cena logo in nav header
2. Left pane queue is grouped by urgency: 🔴 Urgent, 🟡 Needs attention, 🟢 Informational, with item counts
3. Center pane shows morning summary card: "12 items overnight. 2 urgent, 7 need attention, 3 informational." with urgent items previewed
4. Right pane shows empty state: "Pick a queue item to start. Each conversation lives with a specific patient or referral, so the activity stays on the record."
**Outcome:** Coordinator reads the room in 2–3 seconds.

#### CC-SHELL-02: Open queue item → review record + thread
**Precondition:** Queue has at least one item.
**Trigger:** Coordinator clicks a queue item.
**Flow:**
1. Left pane: clicked item gets active state (`aria-current="true"`); other items remain visible
2. Center pane loads the relevant record viewer (patient record, referral, care plan, etc.)
3. Right pane loads the contextual thread, scrolled to the most recent approval-pending event
4. The approval card is visible in the thread with: agent recommendation, downstream effects, action buttons (Approve / Edit first / Reject + note / Reassign), optional note field
5. Ava avatar + "agent working" indicator visible on Ava-authored events
**Outcome:** Coordinator has full context to decide.

#### CC-SHELL-03: Decide and act on approval card
**Precondition:** Approval card is in the right pane.
**Trigger:** Coordinator taps an action button.
**Flow:**
1. Coordinator taps Approve → 5-second undo toast appears → if uncountermanded, decision is logged
2. OR taps Edit first → inline edits in center panel → tap Approve → decision logged with `approved_with_edits`
3. OR taps Reject → note required → decision logged → agent receives feedback
4. OR taps Reassign → routes to another team member; item moves to their queue
5. Approval card collapses to summary line: `[Sarah K.] Approved with edits — sodium target reduced to 1800mg · 9:47am`
6. Queue item disappears from left pane; count decrements; next urgent item highlights but does not auto-open
**Outcome:** Decision and audit are the same artifact.

#### CC-SHELL-04: Direct the agent via thread input
**Precondition:** A record is open in the center pane.
**Trigger:** Coordinator types in the thread input.
**Flow:**
1. Coordinator types: "Check if this patient has secondary insurance"
2. Send → human message appears in thread → agent runs the check → tool call + tool result appear in thread
3. Coordinator reads the result and proceeds with their decision
**Outcome:** Coordinator gets information without navigating away.

#### CC-SHELL-05: Resize the right pane for a denser record
**Precondition:** Coordinator is on desktop ≥1240px.
**Trigger:** Coordinator drags the right-pane splitter handle leftward.
**Flow:**
1. Right pane width updates live during drag (clamped 480–800px); center pane absorbs the released space
2. On release, new width persists per-user
3. Next session: coordinator's preferred width restored regardless of device
**Outcome:** Coordinator shapes workspace to their preference.

### Constraints (coordinator-specific)

- HIPAA: thread renders PHI but tool calls show field names + value summaries only — never raw SSN or full med history
- WCAG 2.1 AA: keyboard navigation through queue items; screen reader labels for urgency tiers; focus is NOT trapped in the persistent shell
- SLA visibility: each queue item shows time-in-queue; SLA warning at 75% elapsed; SLA breach visually distinct
- Performance: queue ≤2s for 100 items; thread ≤1s; resize ≤16ms/frame
- EN-only at v1; bilingual deferred for coordinator app

### Constraints inherited from universal shell

See `_shared/design/universal-shell-use-cases.md` §Phase 1 Constraints.

---

## Phase 2: Functional Specification

### Coordinator-specific functions

| Function | Notes |
|---|---|
| `loadQueue(coordinatorId)` | reads queue grouped by urgency_tier; sorted by sla_status then created_at desc within tier |
| `filterQueueByType(itemType)` | sidebar filter pill — referrals only, care plans only, etc. |
| `submitApprovalDecision(cardId, decision, note?)` | logs to thread, transitions queue item, triggers agent resume |
| `directAgent(threadId, text)` | adds human_message to thread, dispatches agent task |
| `reassignItem(itemId, toUserId, note?)` | moves item to new owner's queue |
| `holdItem(itemId)` | keeps item pending without action |

### Thread message-type allowlist (coordinator)

Coordinator sees the full message set:
- `system` (compact, muted)
- `agent_tool_call` (expandable)
- `agent_tool_result` (expandable)
- `approval_request` (hero card)
- `approval_response` (collapsed summary)
- `human_message` (full-width with avatar)
- `notification` (status events)
- `status_change`

### Business rules (coordinator)

- Urgent items with SLA < 1 hour: red indicator, persistent at top of queue
- Informational items auto-dismiss after 24h if unread
- 5-second undo window after approve
- Approval card always shows downstream effects before user taps
- Queue item removal animation: smooth fade + slide; count updates immediately

---

## Phase 3: Information Architecture

### Coordinator screen inventory

| Screen ID | Name | Purpose | Primary actions |
|---|---|---|---|
| CC-SHELL | Coordinator three-pane shell | Persistent layout | pane resize, item select |
| CC-LEFT | Queue sidebar | Urgency-grouped items + secondary nav | click item, filter by type |
| CC-CENTER-SUMMARY | Morning summary | Lightweight orientation | read |
| CC-CENTER-RECORD | Record viewer | Patient / referral / care plan record | read, inline edit |
| CC-CENTER-PATIENT-LIST | Patient list (caseload) | Browsable list | sort, filter, click |
| CC-RIGHT-THREAD | Thread + approval card | Activity log + decisions | approve, reject, type |

### Navigation placement

- **Left pane:** queue (default top), then secondary nav (Patients, Reports, Settings, user menu)
- **Center pane:** loads based on left-pane selection or secondary-nav choice
- **Right pane:** contextual thread for whatever is in center; empty when center is a list view (Patient List, Reports)

### Screen flows (coordinator slice)

```
Open app → CC-LEFT (queue rendered) + CC-CENTER-SUMMARY + CC-RIGHT-THREAD (empty)

Click queue item → CC-LEFT (item active) + CC-CENTER-RECORD + CC-RIGHT-THREAD (loaded for that record, scrolled to approval)

Click "Patients" in secondary nav → CC-LEFT (queue still visible above) + CC-CENTER-PATIENT-LIST + CC-RIGHT-THREAD (empty)

Approve in CC-RIGHT-THREAD → CC-LEFT (item removed, next highlighted) + CC-CENTER and CC-RIGHT stay or update per next-item rules
```

### Content priority per pane

**CC-LEFT (queue + secondary nav):**
1. Cena logo header
2. Urgent group (red marker, count, items)
3. Needs-attention group (amber marker, count, items)
4. Informational group (sand marker, count, items)
5. Per-item: subject name, type badge, one-line summary, time-in-queue + SLA chip
6. Secondary nav: Patients, Reports, Settings
7. User menu at bottom

**CC-CENTER (record viewer mode):**
1. Record identity bar (patient/referral name, type, status badge, risk tier — Lora display per DESIGN.md)
2. Record content (varies)
3. Inline edit on coordinator-owned fields (`editable-indicator` semantic class)

**CC-RIGHT (thread):**
1. Active approval card (the hero, when present)
2. Recent thread events (newest at bottom)
3. Thread input (always visible at bottom)
4. Historical events above (scroll)

### Per-app minimum (Gate 1 G1.2)

- Queue grouped into 3 urgency categories (urgent / needs-attention / informational)
- One active agent task in the thread, surfaced as an approval card with full anatomy:
  - Header: "✋ RDN Review Required" or equivalent + leading Ava avatar
  - Context: patient name, prepared-by + ago timestamp
  - Goals / nutrition plan / change summary
  - Downstream effects line ("Approving will resume meal-match workflow")
  - Buttons: Approve / Edit first / Reject + note / Reassign
- Coordinator queue + thread already shipped (cc-01 through cc-07); the universal-shell upgrade adds the **agentic-shell rich base** (resizable panes, Ava avatar in chat, agent-working indicator, gradient-sphere identity) and unifies under the universal contract.

---

## Component-gap pointer

See `apps/_shared/design/shell-component-gaps.md` for the wireframe-vs-PL delta. Coordinator-specific items: `thread-approval-card` is shipped (Patch series, full anatomy with `.is-urgent` / `.is-warning` / `.is-historical` variants), `queue-item` shipped, `queue-section-header` shipped. Adoption gap is binding the existing care-coordinator React shell to the agentic-shell rich base (resize splitters, Ava-avatar chat header).

---

## Open questions for Aaron at Gate 2

1. **Care-coordinator existing shell vs. agentic-shell adoption:** the care-coordinator app currently renders the bare `three-panel-shell` composition (per cc-shell-layout.md). Adopting the agentic-shell rich base means upgrading panel-splitter integration, adding the Ava avatar chat-header treatment, and adding the agent-working indicator. Is this in scope for the wireframing pass, or do we wireframe the *target* and let dev-tasker sequence the upgrade?
2. **Approval-card variant for the worked example:** which agent task is the demo case — care plan ready for final approval (RDN signed, coordinator approving the full plan)? That's the canonical 2-tap moment in cc-shell-layout. Recommend yes; calling out so the wireframer doesn't pick a different example.
3. **Agent identity in coordinator pane:** Ava avatar appears on the Ava-authored chat-header and on Ava-authored thread events. Confirm this includes `agent_tool_call` events in coordinator's thread view (currently ambiguous in the source docs).
