# Journey: Review and Approve a Care Plan

## Journey Metadata
- **User:** Care Coordinator (e.g., Sarah)
- **Goal:** Review an agent-drafted, clinician-approved care plan and give final approval to activate the patient
- **Frequency:** Several times per week (new patients) + periodic updates (existing patients)
- **Entry Point:** Care plan approval item appears in queue (after RDN and optionally BHN have signed off)
- **Success Criteria:** Care plan approved, patient status moves to `active`, meals and scheduling begin
- **Duration:** 3-8 minutes (new plan), 2-5 minutes (update to existing plan)

## Prerequisites
- Patient has completed intake assessment (1.4)
- Agent has drafted the care plan from assessment data
- RDN has reviewed and approved the nutrition section
- BHN has reviewed and approved the behavioral health section (if PHQ-9 >= 10)
- Care plan is now in coordinator's queue for final approval

---

## Happy Path

### Step 1: Open Care Plan Queue Item
- **Screen:** Admin App — click care plan item in left sidebar queue
- **User Action:** Clicks the queue item labeled "Care plan ready — Maria Garcia"
- **System Response:**
  - Center panel loads the care plan viewer — full plan organized by section
  - Right panel loads the care plan thread — shows the drafting and review history
  - Each section shows its approval status inline

### Step 2: Scan Section Approval Status
- **Screen:** Center panel — care plan viewer, top section
- **User Action:** Scans the section status bar at the top of the care plan:

```
Care Plan v1.0 — Maria Garcia
──────────────────────────────────────────────
Goals              ✅ RDN approved · Mar 26
Nutrition Plan     ✅ RDN approved · Mar 26
Behavioral Health  ✅ BHN approved · Mar 27
Visit Schedule     ⏳ Coordinator review
Monitoring         ⏳ Coordinator review
Meal Delivery      ⏳ Coordinator review
Medications        ✅ Imported from EHR
Risk Flags         ✅ Auto-populated
──────────────────────────────────────────────
```

- **Data Needed:** Which sections are coordinator-owned, which are already approved by clinicians
- **Decision Point:** Are all clinical sections approved? (If not, this shouldn't be in the coordinator's queue — system error)

### Step 3: Review Goals
- **Screen:** Center panel — goals section expanded
- **User Action:** Reads the 3-5 SMART goals. These were set by the RDN (already approved) but the coordinator checks they're coherent as a set.
- **System Response:** Goals displayed with target metrics and timeframes:
  - HbA1c < 8.0% within 6 months
  - Weight loss 5-8% within 6 months
  - PHQ-9 score < 10 within 3 months
- **Decision Point:** Do the goals make sense together? Are they achievable given this patient's situation?

### Step 4: Review Visit Schedule
- **Screen:** Center panel — visit schedule section
- **User Action:** Reviews the proposed visit cadence:

| Visit Type | Cadence | First Visit |
|---|---|---|
| RDN initial | One-time | Within 7 days |
| RDN follow-up | Monthly | Apr 30 |
| BHN initial | One-time | Within 14 days |
| BHN follow-up | Monthly | May 15 |
| AVA wellness check-in | Weekly | Begins after RDN initial |

- **System Response:** Schedule is pre-populated by the agent based on care plan parameters and provider availability. Conflicts or availability gaps are flagged.
- **Decision Point:** Is the cadence appropriate? Any conflicts with known constraints?

### Step 5: Review Monitoring Schedule
- **Screen:** Center panel — monitoring section
- **User Action:** Reviews what gets monitored and how often:
  - AVA weekly wellness calls
  - PHQ-9 monthly (via AVA)
  - Weight self-report weekly (patient app)
  - Lab draws: HbA1c every 3 months, lipid panel every 6 months
- **Decision Point:** Is the monitoring level appropriate for this patient's risk tier?

### Step 6: Review Meal Delivery Parameters
- **Screen:** Center panel — meal delivery section
- **User Action:** Reviews:
  - Meals per week: 14 (2/day)
  - Delivery days: Monday, Thursday
  - Delivery address: confirmed
  - Hot/cold: frozen (patient preference)
  - Dietary tags from nutrition plan: low-sodium, diabetic-appropriate, nut-free
- **Decision Point:** Are the logistics realistic? Address confirmed? Delivery frequency matches contract?

### Step 7: Check the Thread for Context
- **Screen:** Right panel — care plan thread
- **User Action:** Scrolls through the thread to see the full history:
  - Agent drafted plan (tool calls visible)
  - RDN reviewed — any edits or notes visible
  - BHN reviewed — any notes visible
  - Any flags or conversations between clinicians and agent
- **Data Needed:** Were there any disagreements, edits, or flags during clinical review?
- **Decision Point:** Any concerns raised during review that the coordinator should address?

### Step 8: Approve the Care Plan
- **Screen:** Right panel — approval card
- **User Action:** Reviews the approval card:

```
┌─────────────────────────────────────┐
│ ✋ Final Approval — Care Plan v1.0   │
│                                     │
│ Maria Garcia                        │
│ All clinical sections approved.     │
│                                     │
│ Approving will:                     │
│ • Set patient status to active      │
│ • Start meal prescription matching  │
│ • Schedule first RDN visit          │
│ • Begin AVA check-in calls          │
│ • Notify patient — welcome message  │
│                                     │
│ [✓ Approve]  [✎ Edit first]         │
│ [✗ Reject]   [↩ Send back to RDN]   │
│                                     │
│ Add a note (optional)               │
│ [                                 ] │
└─────────────────────────────────────┘
```

- **User Action:** Taps **Approve**
- **System Response:**
  - Care plan locked as v1.0 (immutable)
  - Patient status: `care_plan_pending` → `active`
  - Downstream workflows triggered:
    - Meal prescription matching (1.6)
    - Appointment scheduling (1.8)
    - Monitoring setup (1.7)
  - Patient notified: welcome message, delivery info, first appointment
  - Approval card collapses: "[Sarah K.] Approved care plan v1.0 · 8:22am"
  - Queue item removed

---

## Alternative Paths

### Alt 1: Care Plan Update (Not New Plan)
- **Trigger:** Existing active patient — care plan update triggered by lab result, risk score change, or provider request
- **Modified Steps:**
  - Center panel shows a **diff view** instead of the full plan: what changed between versions
  - Changed sections highlighted, unchanged sections collapsed
  - Approval card specifies version: "Care Plan v1.0 → v1.1"
  - Approving creates the new version; old version is archived
  - Downstream updates cascade: meal prescription, monitoring, scheduling adjusted as needed
- **Outcome:** Faster review — coordinator focuses on what changed, not the whole plan

### Alt 2: Coordinator Edits Before Approving
- **Trigger:** Coordinator sees something they want to adjust in a coordinator-owned section (visit schedule, monitoring, meal delivery)
- **Modified Steps:**
  - Taps **Edit first** on the approval card
  - Coordinator-owned sections become editable inline
  - Clinical sections (nutrition, behavioral) remain read-only — if those need changes, coordinator sends back to the relevant clinician
  - After editing, coordinator taps **Approve with edits**
  - Edits are logged in the thread: "[Sarah K.] Edited visit schedule — changed RDN follow-up from monthly to biweekly"
- **Convergence Point:** Approval proceeds as normal after edits

### Alt 3: Coordinator Sends Back to Clinician
- **Trigger:** Coordinator spots an issue in a clinical section (inconsistent goals, nutrition plan doesn't match diagnosis, etc.)
- **Modified Steps:**
  - Taps **Send back to RDN** (or BHN)
  - Types a note explaining the concern
  - Queue item moves back to the relevant clinician's queue
  - Patient remains in `care_plan_pending` — no meals, no scheduling
  - When the clinician re-approves their section, the item returns to the coordinator's queue
- **Outcome:** Extra review cycle — adds time but prevents bad plans from activating

### Alt 4: BHN Review Was Skipped (PHQ-9 < 10)
- **Trigger:** Patient's PHQ-9 score is below 10, so BHN section was auto-populated, not formally reviewed
- **Modified Steps:**
  - Section status shows: "Behavioral Health — auto-populated (PHQ-9: 7, BHN notified for awareness)"
  - Coordinator can still flag for BHN review if something seems off
  - Most of the time, no action needed — the section just has a different status indicator
- **Convergence Point:** Normal approval flow — BHN is aware but formal review wasn't required

### Alt 5: Emergency Care Plan Update
- **Trigger:** Critical lab result or crisis event triggered an emergency care plan revision
- **Modified Steps:**
  - Queue item marked with emergency indicator — red border, distinct from normal urgency
  - SLA is 4 hours (not 24)
  - Diff view shows the emergency change with triggering event: "HbA1c 12.1 — up from 8.4"
  - Approval card includes a flag: "Emergency version — v1.0e"
  - Approving creates an emergency version that can be reviewed more thoroughly later
- **Outcome:** Fast approval, full review follows

---

## Exception Handling

### Exception 1: Clinical Section Not Actually Approved
- **Cause:** System error — care plan reached coordinator queue without RDN/BHN sign-off
- **Frequency:** Should not happen (system bug if it does)
- **Severity:** Critical — coordinator must not approve without clinical sign-off
- **User Impact:** Section status shows ⏳ instead of ✅ for a clinical section
- **Recovery:**
  - Approval card is disabled: "Cannot approve — awaiting RDN review"
  - Coordinator can manually route to the clinician from the thread
  - Log the system error for engineering investigation
- **Prevention:** Hard gate in the agent framework — care plan cannot enter coordinator queue without required clinical approvals

### Exception 2: Patient Data Changed After Plan Was Drafted
- **Cause:** New information arrived between plan drafting and coordinator review (e.g., new lab result, patient reported a change)
- **Frequency:** Occasional
- **Severity:** Graceful
- **User Impact:** Thread shows a warning: "New data received since plan was drafted"
- **Recovery:**
  - Agent highlights what changed and whether it affects the plan
  - If material: agent suggests re-drafting affected sections, routes back to clinician
  - If immaterial: coordinator can acknowledge and approve as-is
- **Prevention:** Agent checks for data staleness at approval time, not just draft time

### Exception 3: Meal Prescription Has No Valid Matches
- **Cause:** The nutrition plan parameters are so restrictive that the recipe catalog has no valid matches
- **Frequency:** Rare but important
- **Severity:** Graceful — plan can be approved, but meals can't start
- **User Impact:** Warning in meal delivery section: "0 valid recipes match current parameters"
- **Recovery:**
  - Coordinator can approve the plan (patient becomes active for clinical care)
  - Meal delivery is flagged — RDN alerted to review constraints or request new recipes
  - Patient is notified that meal delivery will begin once menu is finalized
- **Prevention:** Agent runs a pre-check during drafting and flags this early

---

## Critical Moments

| Step | Risk | Mitigation |
|---|---|---|
| 2 | Coordinator approves without checking all sections | Section status bar makes unapproved sections visually prominent |
| 3 | Goals are clinically approved but operationally unrealistic | Coordinator's perspective is operational — schedule, resources, logistics |
| 6 | Meal delivery address is wrong or outdated | Address confirmation prompt if address hasn't been verified in 30+ days |
| 7 | Missing context from clinical review — why did the RDN change something? | RDN/BHN edit notes are visible in the thread, not just the final result |
| 8 | Accidental approval | 5-second undo window, same as queue triage |

---

## Connected Journeys

**Feeds into:**
- Meal prescription matching (1.6) — triggered immediately on approval
- Appointment scheduling (1.8) — first visits scheduled on approval
- Monitoring setup (1.7) — AVA calls and self-reporting begin
- Patient welcome notification — patient learns they're active in the program

**Feeds from:**
- [Morning queue triage](coordinator-morning-triage.md) — care plan items discovered during triage
- RDN nutrition plan review — RDN approval is a prerequisite
- BHN behavioral health review — BHN approval is a prerequisite (if PHQ-9 >= 10)
- Intake assessment (1.4) — assessment data drives the care plan draft

**Intersects with:**
- [Process a new referral](coordinator-referral-intake.md) — the referral journey ends when care plan review begins
- Care plan updates (1.9) — same review flow, diff view instead of full plan

---

## Design Implications

1. **The section status bar is the coordinator's checklist.** At a glance: what's approved, what
   needs their attention. Green checkmarks for clinician-approved sections, pending indicators
   for coordinator-owned sections. The coordinator should never have to wonder "did the RDN
   sign off on this?"

2. **Diff view for updates is essential.** Reviewing a full care plan from scratch every time
   it changes is too slow. For updates (Alt 1), show only what changed — highlighted additions,
   strikethrough removals, unchanged sections collapsed. This is the difference between a
   5-minute review and a 15-minute review.

3. **The approval card tells the coordinator what happens next.** "Approving will: start meals,
   schedule visits, notify patient" — this transparency builds trust. The coordinator knows
   exactly what their tap triggers.

4. **Clinical sections are read-only for the coordinator.** The coordinator can send them back
   for re-review, but cannot edit nutrition or behavioral health sections directly. This
   enforces the clinical sign-off boundary while keeping the coordinator in control of the
   overall plan.

5. **The thread preserves clinical reasoning.** When the RDN changed the sodium target or the
   BHN adjusted the session cadence, the coordinator sees why. This context is what makes
   the coordinator's review meaningful rather than rubber-stamp.
