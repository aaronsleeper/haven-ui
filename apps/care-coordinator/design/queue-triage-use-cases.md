# Queue Triage — Use Cases, Functional Spec, and IA

**Feature:** Care Coordinator Queue Triage (Admin App)
**Source:** Project Ava user journeys — coordinator-morning-triage.md, coordinator-referral-intake.md, coordinator-care-plan-review.md
**Personas:** Care Coordinator (primary), Admin (secondary)
**Device:** Desktop (responsive down to tablet)

---

## Phase 1: Discovery

### Personas Involved

**Care Coordinator (Sarah)** — manages 60-patient panel. Daily workflow is queue-driven:
open queue, triage by urgency, review-decide-act on each item, then shift to scheduled work.
Primary interaction is review and approval, not task execution.

**Admin** — may share the same interface for operational items (billing exceptions, partner
management). Lower frequency, same interaction pattern.

### User Goals

| Goal | Frequency | Priority |
|---|---|---|
| Scan overnight queue and understand the day ahead | Daily, first action | Highest |
| Review and act on urgent items before SLA breach | Daily, immediate | Highest |
| Approve or reject agent recommendations with one tap | Per item, many times daily | Highest |
| Batch-process similar items (e.g., all new referrals) | Daily | High |
| Monitor for patients falling through gaps | Daily, end of triage | Medium |
| Direct the agent via thread input | Ad hoc | Medium |

### Use Cases

#### UC-CC-01: Morning Queue Scan
**Precondition:** Coordinator is logged in. Agent has been running overnight.
**Trigger:** Coordinator opens the Admin App.
**Flow:**
1. Queue sidebar loads with items grouped by urgency (urgent, needs attention, informational)
2. Center panel shows a morning summary card with counts and urgent item previews
3. Coordinator reads the summary in 2-3 seconds
**Outcome:** Coordinator knows how their day looks.

#### UC-CC-02: Review and Act on Queue Item
**Precondition:** Queue has items. Coordinator clicks one.
**Trigger:** Click on queue item in sidebar.
**Flow:**
1. Center panel loads the relevant record (patient, referral, report)
2. Right panel loads the contextual thread, scrolled to the relevant event
3. Approval card is visible in the thread with agent recommendation and action buttons
4. Coordinator reads context (center) and recommendation (right), then acts:
   - Approve (one tap)
   - Edit first (inline in center panel, then approve)
   - Reject with note
   - Reassign to another team member
5. Decision logged in thread. Queue item removed. Count decrements.
6. Next item highlights in sidebar (does not auto-open).
**Outcome:** Item resolved. Agent resumes downstream workflow.

#### UC-CC-03: Batch Process by Type
**Precondition:** Queue has multiple items of the same type.
**Trigger:** Coordinator clicks a filter in the sidebar (e.g., "Referrals").
**Flow:**
1. Queue filters to show only that item type
2. Coordinator works through filtered list sequentially
3. Click "All" to return to urgency-sorted view
**Outcome:** Coordinator processes similar items efficiently.

#### UC-CC-04: Direct Agent via Thread
**Precondition:** Coordinator has a record open in center panel.
**Trigger:** Coordinator types in the thread input field.
**Flow:**
1. Coordinator types a natural language request: "Check if this patient has secondary insurance"
2. Agent runs the requested action
3. Result appears in the thread
4. Coordinator uses the new information to make a decision
**Outcome:** Coordinator gets information without navigating away.

#### UC-CC-05: Quiet Risk Scan
**Precondition:** Queue is cleared or manageable.
**Trigger:** Coordinator switches to Patient List view.
**Flow:**
1. Patient list sorted by "last activity" (oldest first)
2. Patients with no activity in 7+ days highlighted subtly
3. Coordinator reviews and decides whether proactive outreach is needed
**Outcome:** No patient falls through a gap.

### Constraints
- **HIPAA:** Thread displays PHI — no raw SSN or full medical history in thread. Tool calls show field names and value summaries only.
- **Accessibility:** WCAG 2.1 AA. Keyboard navigation through queue items. Screen reader labels for urgency tiers.
- **SLA visibility:** Each queue item has a time-in-queue counter and escalation indicator.
- **Performance:** Queue must load within 2 seconds for up to 100 items. Thread must load within 1 second.

---

## Phase 2: Functional Specification

### Data Model

**Queue Item:**
| Field | Type | Source | R/W |
|---|---|---|---|
| id | string | system | R |
| patient_id | string | workflow | R |
| patient_name | string | patient record | R |
| item_type | enum: referral, care_plan, eligibility, discharge, missed_checkin, partner_request, report, communication | workflow | R |
| urgency_tier | enum: urgent, needs_attention, informational | agent | R |
| summary | string | agent | R |
| agent_recommendation | string | agent | R |
| sla_deadline | datetime | workflow rules | R |
| time_in_queue | duration | computed | R |
| sla_status | enum: within_sla, warning, breached | computed | R |
| created_at | datetime | system | R |
| status | enum: pending, resolved, reassigned | system | RW |
| resolved_by | string (user_id) | system | W |
| resolution | enum: approved, approved_with_edits, rejected, reassigned | system | W |
| resolution_note | string | coordinator | W |

**Approval Card:**
| Field | Type | Source | R/W |
|---|---|---|---|
| card_type | enum: approval_needed, action_needed, info | agent | R |
| title | string | agent | R |
| context_summary | string | agent | R |
| agent_recommendation | string | agent | R |
| downstream_effects | string[] | agent | R |
| primary_action | {label, action_type} | workflow | R |
| secondary_actions | [{label, action_type}][] | workflow | R |
| note_field | string | coordinator | W |
| attachments_count | int | record | R |
| attachments_viewed | boolean | system | R |

**Thread Message:**
| Field | Type | Source | R/W |
|---|---|---|---|
| id | string | system | R |
| thread_id | string | system | R |
| message_type | enum: system, agent_tool_call, agent_tool_result, approval_request, human_message, approval_response | system | R |
| actor | string (agent_id or user_id) | system | R |
| timestamp | datetime | system | R |
| content | object (varies by type) | system | R |
| is_expandable | boolean | system | R |
| expanded | boolean | UI state | RW |

### State Transitions

**Queue Item lifecycle:**
```
pending → resolved (approved | approved_with_edits | rejected)
pending → reassigned → pending (new assignee)
pending → sla_warning (time-based, auto)
pending → sla_breached (time-based, auto)
```

**Approval Card actions → downstream:**
| Action | Queue Item Status | Agent Behavior |
|---|---|---|
| Approve | resolved: approved | Agent resumes workflow |
| Edit + Approve | resolved: approved_with_edits | Agent resumes with edits applied |
| Reject with note | resolved: rejected | Agent receives feedback, may re-draft |
| Reassign | reassigned | Item moves to another user's queue |
| Hold | pending (stays) | No agent action, timer continues |

### Business Rules
- Urgent items with SLA < 1 hour: red indicator, persistent position at top
- SLA warning: when 75% of SLA window has elapsed
- SLA breached: visual escalation, supervisor notified (if configured)
- Informational items auto-dismiss after 24h if unread
- 5-second undo window after approve action
- Queue item removal animation: smooth fade + slide, count updates immediately

---

## Phase 3: Information Architecture

### Screen Inventory

| Screen ID | Name | Purpose | Primary Actions |
|---|---|---|---|
| CC-SHELL | Admin App Shell | Three-panel layout: sidebar, center, right | Panel navigation |
| CC-QUEUE | Queue Sidebar | Urgency-grouped queue items | Click item, filter by type |
| CC-SUMMARY | Morning Summary | Lightweight orientation card | Read, then dismiss |
| CC-RECORD | Record Viewer | Patient record, referral, report (center panel) | Read, inline edit |
| CC-THREAD | Thread Panel | Chronological event log + approval cards (right panel) | Approve, reject, type message |
| CC-PATIENTS | Patient List | Browsable patient caseload | Sort, filter, click to open |

### Navigation Placement

The Admin App uses a **three-panel layout** (not tabbed navigation):
- **Left:** Queue sidebar (~240px fixed) — always visible
- **Center:** Content panel (flex-grow) — record viewer or patient list or summary
- **Right:** Thread panel (~380px fixed) — contextual to center panel selection

Top-level navigation (if needed) lives in the sidebar below the queue:
- Queue (default, active)
- Patients
- Reports
- Settings

### Screen-to-Screen Flows

- App opens → CC-QUEUE (sidebar) + CC-SUMMARY (center)
- Click queue item → CC-QUEUE (item highlighted) + CC-RECORD (center) + CC-THREAD (right)
- Click "Patients" in sidebar nav → CC-PATIENTS (center), CC-THREAD empty
- Click patient in patient list → CC-RECORD (center) + CC-THREAD (right)
- Approve item → CC-QUEUE (item removed, next highlighted) + center/right stay or update

### Content Priority per Screen

**CC-QUEUE (sidebar):**
1. Urgency tier grouping (visual hierarchy)
2. Queue item: patient name, item type, one-line summary, time in queue
3. SLA indicator (color)
4. Queue count per tier
5. Filter controls

**CC-THREAD (right panel):**
1. Approval card (when present — this is the hero)
2. Recent thread messages (newest at bottom)
3. Thread input field (always visible at bottom)
4. Historical messages (scrollable)

**CC-RECORD (center panel):**
1. Record identity (patient name, status, risk tier)
2. Relevant record content (varies by item type)
3. Inline edit capability for coordinator-owned fields

### Potential Component Gaps

Components needed that likely don't exist in the pattern library:

| Component | Purpose | Closest Existing |
|---|---|---|
| Approval card | Agent recommendation + action buttons in thread | None — new component |
| Queue item card | Sidebar queue item with urgency indicator | `alert-summary-row` (partial fit) |
| Thread system message | Muted timestamp-only event | `timeline-event` (partial fit) |
| Thread tool call message | Agent action with expandable payload | `timeline-event` (partial fit) |
| Thread human message | Full-width message with user avatar | `chat-bubble-user` (partial fit) |
| Thread approval response | Collapsed decision summary | `timeline-event` (partial fit) |
| Urgency tier header | Section header in queue sidebar with count | None — new component |
| SLA indicator | Time-based color indicator | `badge` variants (good fit) |
| Undo toast | "Approved. [Undo]" with 5-second timer | `toast` (exists, needs timer variant) |
| Morning summary card | Lightweight orientation with counts | `card` + `stat-card` (composable) |

---

## Gate 1 Summary

**Scope:** Care Coordinator queue triage — the daily entry point and UX spine of the Admin App.

**What we're building:**
- Three-panel Admin App shell (sidebar + center + right)
- Queue sidebar with urgency-grouped items
- Thread panel with approval cards, message types, and input
- Morning summary card
- Record viewer (center panel — adapts based on item type)

**5 use cases defined:** Morning scan, review-and-act, batch process, direct agent, quiet risk scan.

**10 potential new components identified.** Most can be composed from existing Haven primitives (cards, badges, timeline, chat bubbles) with new semantic classes.

**Key design decisions embedded:**
- One tap to approve (approval card is the hero)
- 5-second undo, not confirmation dialog
- Queue filters as visible tabs/toggles, not dropdown
- Approval card tells you what happens downstream before you tap
- Thread is append-only, contextual to the center panel record

Ready for your go/no-go on Gate 1 before I proceed to wireframes.