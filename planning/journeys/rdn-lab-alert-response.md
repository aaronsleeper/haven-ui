# Journey: Respond to Out-of-Range Lab Alert

## Journey Metadata
- **User:** RDN (e.g., Dr. Priya)
- **Goal:** Review a flagged lab result, assess clinical significance, and decide whether the care plan needs updating
- **Frequency:** Several times per week across caseload
- **Entry Point:** Lab alert appears in clinical queue
- **Success Criteria:** Lab reviewed, clinical decision made (no action, care plan update, or escalation)
- **Duration:** 2-5 minutes (no action needed) to 10-15 minutes (care plan update initiated)

## Prerequisites
- Lab result imported via EHR integration or entered manually
- Agent has compared the result against the patient's care plan targets and historical trend
- Agent has flagged the result as out of range and generated a clinical significance assessment

---

## Happy Path

### Step 1: Open Lab Alert
- **Screen:** Provider App — click lab alert in clinical queue
- **User Action:** Clicks "Lab flag — Maria Garcia — HbA1c"
- **System Response:**
  - Center panel loads the patient record, focused on the biomarker trend view
  - Right panel loads the alert thread — agent's analysis and recommendation
  - Alert card prominent in the thread

### Step 2: Review the Lab Result in Context
- **Screen:** Center panel — biomarker trend view
- **User Action:** Reads the flagged result against the patient's history:

```
HbA1c Trend — Maria Garcia
──────────────────────────────────────────────
Mar 2026:  9.2%  (baseline — at enrollment)
Jun 2026:  8.4%  ↓ improving
Sep 2026:  8.1%  ↓ improving — approaching goal
Dec 2026:  8.8%  ↑ FLAGGED — reversal
──────────────────────────────────────────────
Goal: < 8.0%
Direction: worsening after 6-month improvement trend
```

A sparkline chart shows the full trend visually with the goal line marked.

- **Decision Point:** Is this clinically significant or expected variation?

### Step 3: Read Agent's Assessment
- **Screen:** Right panel — alert thread
- **User Action:** Reads the agent's analysis:

```
[agent]                          Dec 18, 9:02am
◎ analyze_lab_result
  → HbA1c: 8.8% (previous: 8.1%, goal: <8.0%)
  → Trend: reversal after 6-month improvement
  → Contributing factors identified:
    • Meal adherence dropped to 71% (from 95%) over past 6 weeks
    • 2 missed AVA check-ins in November
    • Patient reported increased stress (AVA mood ratings declining)
  → Recommendation: care plan update — review nutrition parameters,
    schedule RDN visit within 7 days, alert BHN if mood trend continues

┌─────────────────────────────────────────┐
│ ⚠ Lab Alert — Action Needed             │
│                                         │
│ HbA1c 8.8% — reversal from 8.1%        │
│ Agent identified contributing factors.  │
│                                         │
│ [✓ Initiate care plan update]           │
│ [📅 Schedule RDN visit]                 │
│ [👁 Acknowledge — monitor only]          │
│ [↗ Escalate to coordinator]             │
│                                         │
│ Add a clinical note (optional)          │
│ [                                     ] │
└─────────────────────────────────────────┘
```

- **Decision Point:** What action does this warrant?

### Step 4: Take Action
- **Screen:** Right panel — action card
- **User Action:** Selects the appropriate response:

**Option A — Initiate care plan update:**
  - Triggers workflow 1.9 — agent drafts proposed nutrition changes
  - Care plan enters update flow (RDN review → coordinator approval)
  - Thread logs the decision and clinical reasoning

**Option B — Schedule RDN visit:**
  - Agent checks provider availability, offers slots within 7 days
  - RDN confirms a slot or requests coordinator help scheduling
  - Visit purpose pre-populated: "HbA1c reversal follow-up"

**Option C — Acknowledge, monitor only:**
  - RDN adds a clinical note explaining why no action is needed (e.g., "Expected variation given holiday season. Will reassess at next scheduled visit.")
  - Agent increases monitoring — next AVA check-in asks about meal adherence
  - No care plan change

**Option D — Escalate to coordinator:**
  - If the issue involves non-clinical factors (disengagement, logistics, social issues)
  - Coordinator receives a queue item with the RDN's concern

- **System Response:** Decision logged in thread. Queue item resolved. Follow-up actions (if any) tracked.

---

## Alternative Paths

### Alt 1: Lab Result Within Range but Trending Wrong
- **Trigger:** HbA1c is 7.8% (within goal < 8.0%) but up from 7.2%
- **Modified Steps:**
  - Alert is lower urgency (yellow, not red)
  - Agent flags the trend, not the absolute value
  - RDN more likely to choose "monitor only" with a note
- **Outcome:** Awareness without overreaction

### Alt 2: Critical Lab Value
- **Trigger:** Lab result is dangerously out of range (e.g., HbA1c > 12%, potassium critical)
- **Modified Steps:**
  - Alert is marked critical — bypasses normal queue ordering
  - Agent auto-notifies coordinator in parallel
  - PCP notification is pre-drafted
  - RDN must take action — "acknowledge only" is not available for critical results
- **Outcome:** Immediate clinical response, multi-party awareness

### Alt 3: Lab from EHR Doesn't Match Expected Schedule
- **Trigger:** Lab result arrived but wasn't on the monitoring schedule (patient got labs independently)
- **Modified Steps:**
  - Agent flags: "Unexpected lab — not on monitoring schedule"
  - RDN reviews whether the result changes anything
  - May adjust monitoring schedule based on new data
- **Outcome:** Unexpected data integrated without disruption

---

## Exception Handling

### Exception 1: Lab Result Appears Erroneous
- **Cause:** Value is physiologically implausible (e.g., HbA1c of 2.1%)
- **Frequency:** Rare
- **Severity:** Graceful — RDN catches it
- **Recovery:** RDN flags as likely lab error, requests redraw. Agent marks result as "disputed" — not used in trend calculations.
- **Prevention:** Agent flags physiologically implausible values automatically

---

## Critical Moments

| Step | Risk | Mitigation |
|---|---|---|
| 2 | Viewing the number without the trend | Trend chart is the primary view, not just the latest value |
| 3 | Agent misidentifies contributing factors | Agent cites data sources for each factor (meal adherence %, AVA scores) |
| 4 | RDN dismisses a significant result | Critical values require action — monitor-only is gated |

---

## Connected Journeys

**Feeds into:**
- Care plan update (1.9) — if RDN initiates update
- [Coordinator care plan review](coordinator-care-plan-review.md) — if update is initiated
- Appointment scheduling (1.8) — if RDN schedules a follow-up visit

**Feeds from:**
- EHR integration (7.7) — lab import
- Monitoring schedule (1.7) — expected lab timing
- AVA check-ins (1.7) — mood and adherence data that contextualizes the lab

---

## Design Implications

1. **Trend is the primary visualization, not the single value.** A number in isolation is
   meaningless. The sparkline with goal line, direction arrow, and historical context is
   what drives good clinical decisions.

2. **Agent-identified contributing factors are the differentiator.** Any system can flag an
   out-of-range lab. Connecting the lab reversal to declining meal adherence and missed
   check-ins — that's what makes the RDN's response targeted rather than generic.

3. **Action options match clinical decision-making.** The four choices (update plan, schedule
   visit, monitor, escalate) map to real clinical thinking. Don't add unnecessary granularity
   or force the RDN through a multi-step decision tree.

4. **Critical values have different rules.** When a lab is dangerous, the UI changes — no
   dismiss option, auto-escalation, PCP notification pre-drafted. The system's behavior
   must match the clinical severity.
