# Journey: Process a New Referral

## Journey Metadata
- **User:** Care Coordinator (e.g., Sarah, manages 60-patient panel)
- **Goal:** Take an inbound referral from receipt to enrollment-ready status
- **Frequency:** Multiple times daily (volume depends on partner pipeline)
- **Entry Point:** Referral appears in queue (from morning triage or real-time during the day)
- **Success Criteria:** Patient record created, eligibility confirmed, enrollment initiated
- **Duration:** 2-5 minutes for clean referrals, 10-15 minutes for referrals needing intervention

## Prerequisites
- At least one partner is onboarded and configured (referral source recognized)
- Eligibility engine is connected to payer APIs
- Coordinator has the referral queue item visible (from triage or real-time notification)

---

## Happy Path

### Step 1: Open Referral Queue Item
- **Screen:** Admin App — click referral item in left sidebar queue
- **User Action:** Clicks the referral queue item
- **System Response:**
  - Center panel loads the referral record — patient demographics, referring provider, diagnosis codes, insurance info
  - Right panel loads the referral thread — shows agent's processing history
  - Status badge: `referral_received`
- **Data Needed:** All referral data parsed and displayed
- **Decision Point:** None yet — coordinator is reading

**What the agent has already done (visible in thread):**
```
[agent]                          8:02am
◎ parse_referral_data
  → Source: UConn Health FHIR API
  → Patient: Maria Garcia, DOB 1964-03-15
  → Referring: Dr. James Chen, NPI 1234567890
  → Dx: E11.65 (Type 2 DM w/ hyperglycemia)

[agent]                          8:02am
◎ completeness_check
  → All required fields present ✓
  → Insurance: Anthem BCBS, Member ID: XYZ123
  → No duplicate detected

[agent]                          8:02am
◎ check_realtime_eligibility
  → Coverage: Active ✓
  → FAM benefit: Covered ✓
  → Clinical criteria: Met (E11.65 qualifies) ✓

[system]                         8:03am
Referral complete and eligible. Ready for coordinator review.
```

### Step 2: Review Referral Summary
- **Screen:** Center panel — referral record
- **User Action:** Scans the structured referral data. The center panel shows a clean summary card:

| Field | Value |
|---|---|
| Patient | Maria Garcia, 62, F |
| Referring Provider | Dr. James Chen, UConn Health |
| Diagnosis | E11.65 — Type 2 DM w/ hyperglycemia |
| Insurance | Anthem BCBS — Active, FAM covered |
| Eligibility | Confirmed by agent |
| Referral Source | UConn Health FHIR API |
| Attached Documents | 1 clinical summary (PDF) |

- **System Response:** Clean referrals show a green status bar: "Referral complete — eligible — ready to enroll"
- **Decision Point:** Does everything look correct?

### Step 3: Approve and Initiate Enrollment
- **Screen:** Right panel — approval card at bottom of thread
- **User Action:** Reviews the approval card:

```
┌─────────────────────────────────────┐
│ ✓ Referral Ready                    │
│                                     │
│ Maria Garcia — UConn Health         │
│ Eligible, all fields complete       │
│                                     │
│ Agent will:                         │
│ • Create patient record             │
│ • Send enrollment invite (SMS)      │
│ • Acknowledge receipt to UConn      │
│                                     │
│ [✓ Approve]  [✎ Edit first]         │
│ [✗ Reject]   [⏸ Hold]               │
│                                     │
│ Add a note (optional)               │
│ [                                 ] │
└─────────────────────────────────────┘
```

- **User Action:** Taps **Approve**
- **System Response:**
  - Patient record created — status: `enrollment_pending`
  - Enrollment invite sent to patient via preferred contact method
  - Acknowledgement sent to referring provider
  - Approval card collapses: "[Sarah K.] Approved — referral → enrollment initiated · 8:12am"
  - Queue item removed from sidebar
- **Next Step:** Patient receives enrollment invite (Journey: Patient First-Time Enrollment). Coordinator moves to next queue item.

---

## Alternative Paths

### Alt 1: Referral Missing Required Fields
- **Trigger:** Agent's completeness check found gaps (missing insurance, no diagnosis code, incomplete demographics)
- **Modified Steps:**
  - Thread shows what's missing:
    ```
    [agent]                          8:02am
    ◎ completeness_check
      → Missing: insurance member ID, emergency contact
      → Agent drafted data request to referring source
    ```
  - Approval card changes to:
    ```
    ┌─────────────────────────────────────┐
    │ ⚠ Referral Incomplete               │
    │                                     │
    │ Maria Garcia — UConn Health         │
    │ Missing: insurance member ID,       │
    │ emergency contact                   │
    │                                     │
    │ Agent drafted a data request to     │
    │ Dr. Chen's office.                  │
    │ [View draft]                        │
    │                                     │
    │ [✓ Send request]  [✎ Edit draft]    │
    │ [📞 Call myself]  [✗ Reject referral]│
    └─────────────────────────────────────┘
    ```
  - Coordinator can: approve the data request (agent sends it), edit the draft, call the referring office directly, or reject
  - After data request is sent, referral goes into a waiting state with a 5-business-day timer
  - When response arrives, referral re-enters the queue for coordinator review
- **Convergence Point:** Once fields are complete, rejoins at step 2

### Alt 2: Eligibility Failed
- **Trigger:** Agent's eligibility check returned a failure — coverage inactive, benefit not covered, or clinical criteria not met
- **Modified Steps:**
  - Thread shows the specific failure:
    ```
    [agent]                          8:03am
    ◎ check_realtime_eligibility
      → Coverage: Active ✓
      → FAM benefit: NOT covered ✗
      → Agent identified alternative: patient may qualify
        under PMPM contract with Anthem
    ```
  - Approval card presents options:
    ```
    ┌─────────────────────────────────────┐
    │ ⚠ Eligibility Issue                 │
    │                                     │
    │ Maria Garcia — Anthem BCBS          │
    │ FAM benefit not covered under       │
    │ current plan.                       │
    │                                     │
    │ Alternative path: PMPM contract     │
    │ with Anthem may cover this patient. │
    │                                     │
    │ [✓ Pursue alternative]              │
    │ [✗ Decline — notify referral source]│
    │ [📞 Call payer to verify]            │
    │ [⏸ Hold — need more info]           │
    └─────────────────────────────────────┘
    ```
  - If coordinator chooses "Decline," agent drafts a decline notice for coordinator approval before sending
  - If coordinator chooses "Pursue alternative," agent initiates the alternative eligibility path and the referral re-enters the queue when resolved
- **Convergence Point:** If alternative path succeeds, rejoins at step 3

### Alt 3: Duplicate Patient Detected
- **Trigger:** Agent found an existing patient record with matching name + DOB or SSN
- **Modified Steps:**
  - Thread shows the match:
    ```
    [agent]                          8:02am
    ◎ duplicate_check
      → Potential duplicate: Maria Garcia, DOB 1964-03-15
      → Existing record: PAT-2847 (status: discharged, 2025-11-20)
      → Match confidence: high (name + DOB + address match)
    ```
  - Center panel shows a side-by-side comparison: new referral data vs. existing record
  - Approval card:
    ```
    ┌─────────────────────────────────────┐
    │ ⚠ Possible Duplicate                │
    │                                     │
    │ New referral matches existing       │
    │ patient PAT-2847 (discharged).      │
    │ [View comparison]                   │
    │                                     │
    │ [✓ Re-enroll existing patient]      │
    │ [➕ Create new record (not a dup)]   │
    │ [🔗 Link records (same person,      │
    │     different episode)]              │
    └─────────────────────────────────────┘
    ```
  - Coordinator decides: re-enroll the existing patient (preserves history), create a new record (if it's actually a different person), or link records
- **Convergence Point:** After resolution, rejoins at step 2 with the correct patient record

### Alt 4: Referral from Unknown Partner
- **Trigger:** Referral source is not a configured partner in the system
- **Modified Steps:**
  - Agent does not auto-create a patient record (safety — unknown source)
  - Thread shows:
    ```
    [agent]                          8:02am
    ◎ validate_referral_source
      → Source: Hartford Hospital
      → NOT in configured partner list
      → Record NOT created — awaiting coordinator decision
    ```
  - Approval card:
    ```
    ┌─────────────────────────────────────┐
    │ ⚠ Unknown Referral Source           │
    │                                     │
    │ Referral from Hartford Hospital     │
    │ — not a configured partner.         │
    │                                     │
    │ [✓ Accept — process as one-off]     │
    │ [➕ Add as new partner first]        │
    │ [✗ Reject — notify sender]          │
    └─────────────────────────────────────┘
    ```
- **Convergence Point:** If accepted, agent creates record and continues from step 2

### Alt 5: Manual/Freeform Referral (Not Structured API)
- **Trigger:** Referral arrives via fax, email, phone call, or unstructured form rather than FHIR/HL7
- **Modified Steps:**
  - Agent attempts to parse the unstructured input:
    ```
    [agent]                          8:02am
    ◎ structure_freeform_referral
      → Source: fax from Dr. Chen's office (2 pages)
      → Extracted: patient name, DOB, diagnosis
      → Could not extract: insurance member ID
      → Confidence: moderate
    ```
  - Center panel shows the extracted data alongside the original document (PDF/image viewer)
  - Coordinator validates the extraction: confirms correct fields, fills gaps
  - Once coordinator confirms, flow continues as normal
- **Convergence Point:** After coordinator validates extraction, rejoins at step 2

---

## Exception Handling

### Exception 1: Payer API Timeout
- **Cause:** Real-time eligibility check times out or returns an error
- **Frequency:** Occasional
- **Severity:** Graceful — referral is not lost
- **User Impact:** Eligibility status shows "Pending — API unavailable"
- **Recovery:**
  - Agent retries 3x with backoff (visible in thread)
  - If still failing: queue item surfaces with "Manual eligibility check needed"
  - Coordinator can call the payer directly, enter the result manually
  - Agent logs the manual verification with coordinator attestation
- **Prevention:** Payer API health monitoring — if a payer API is consistently failing, surface a system-level alert

### Exception 2: Referral Data Request Unanswered (5 Days)
- **Cause:** Referring provider hasn't responded to the data completion request
- **Frequency:** Occasional
- **Severity:** Graceful — patient is waiting, not harmed
- **User Impact:** Queue item re-surfaces: "Data request unanswered — 5 business days"
- **Recovery:**
  - Coordinator can: send a follow-up, call directly, or close the referral
  - If closed: agent sends a courtesy notice to the referring source
  - Partner SLA tracking logs the non-response (feeds into partner relationship management)
- **Prevention:** Agent sends one reminder at day 3 automatically

### Exception 3: Patient Declines Enrollment After Referral Accepted
- **Cause:** Patient is contacted for enrollment and declines
- **Frequency:** Occasional
- **Severity:** Graceful
- **User Impact:** Enrollment flow reports back that patient declined
- **Recovery:**
  - Patient record marked with decline reason
  - Referring provider notified: "Patient declined enrollment — [reason if provided]"
  - Record archived (not deleted — retained for reporting)
- **Prevention:** None — this is a valid outcome

---

## Critical Moments

| Step | Risk | Mitigation |
|---|---|---|
| 2 | Coordinator trusts agent's eligibility check without verifying | Show confidence indicator on eligibility result; highlight any ambiguities |
| 3 | Approving before reading attached clinical documents | If documents are attached, approval card shows "1 document — viewed / not viewed" |
| Alt 2 | Declining an eligible patient due to benefit misread | Agent explains the eligibility failure in plain language, not just codes |
| Alt 3 | Merging records that aren't actually duplicates | Side-by-side comparison with match confidence score; "Create new" is always available |
| Alt 5 | Agent misparses freeform referral data | Show original document alongside extraction; coordinator must confirm each field |

---

## Connected Journeys

**Feeds into:**
- [Patient first-time enrollment](patient-enrollment.md) — after coordinator approves, patient receives enrollment invite
- [Morning queue triage](coordinator-morning-triage.md) — referral items appear in the daily queue

**Feeds from:**
- Partner referral submission (Partner Portal) — structured referrals
- Fax/email/phone — unstructured referrals
- EHR integration — FHIR-based referrals

**Intersects with:**
- Eligibility verification (agent-driven, coordinator reviews exceptions)
- Partner management — unknown sources, SLA tracking

---

## Design Implications

1. **The clean referral should be fast.** A structured, eligible, complete referral is the most common
   case. The coordinator should be able to process it in under 2 minutes: scan summary, approve, done.
   Don't slow down the happy path with unnecessary confirmation dialogs.

2. **Exception handling is where the coordinator earns their salary.** The alternative paths (missing
   data, eligibility failure, duplicates, unknown source) are where judgment matters. These screens
   need to give the coordinator options, not just problems. Every exception card should present
   2-4 clear next actions.

3. **Freeform referral parsing is a trust exercise.** When the agent extracts data from a fax or
   email, the coordinator needs to see the source alongside the extraction. Split-panel view:
   original on one side, structured data on the other.

4. **Eligibility results need plain language.** "Coverage active, FAM benefit covered, clinical
   criteria met" — not "270/271 response code 1, EB segment 30." The coordinator is not a
   billing specialist.

5. **The side-by-side duplicate view must be decisive.** Show what matches, what differs, and a
   confidence score. Make it easy to say "same person" or "different person" without second-guessing.
