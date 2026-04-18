# Journey: Post-Visit Documentation and Signing

## Journey Metadata
- **User:** RDN (e.g., Dr. Priya)
- **Goal:** Review, edit, and sign the agent-drafted SOAP note after an MNT visit
- **Frequency:** Multiple times per week (every completed visit)
- **Entry Point:** SOAP note draft appears in clinical queue after visit is marked complete
- **Success Criteria:** Note signed, ICD-10 codes confirmed, note locked as part of the clinical record
- **Duration:** 3-7 minutes

## Prerequisites
- MNT visit completed (telehealth or in-person)
- Agent has drafted the SOAP note from visit data (structured intake + any real-time notes)
- Physician referral order is on file (or warning is displayed)

---

## Happy Path

### Step 1: Open SOAP Note Queue Item
- **Screen:** Provider App — click "SOAP note ready — Maria Garcia" in clinical queue
- **User Action:** Clicks the queue item
- **System Response:**
  - Center panel loads the SOAP note editor with the agent's draft
  - Right panel loads the visit thread — what happened during the visit, data collected
  - Note status: `draft — awaiting RDN signature`

### Step 2: Review the Agent-Drafted Note
- **Screen:** Center panel — SOAP note editor
- **User Action:** Reads through the four sections:

```
SOAP NOTE — MNT Follow-up Visit
Patient: Maria Garcia | Visit Date: Mar 27, 2026
Provider: Dr. Priya M., RDN | Visit Type: Telehealth
──────────────────────────────────────────────

SUBJECTIVE
Patient reports improved energy since starting the meal program.
States she is eating all delivered meals. Reports occasional
cravings for sweets, especially in the evening. Denies nausea,
vomiting, or GI discomfort. Weight self-reported at 207 lbs
(down 3 lbs from baseline).

OBJECTIVE
Weight: 207 lbs (baseline: 210 lbs, -1.4%)
HbA1c: 9.2% (baseline, lab draw pending for follow-up)
BP: 138/82 (self-reported)
Current meal prescription: 1800 cal, <1800mg sodium,
  diabetic-appropriate, nut-free
Meals delivered: 28/28 past 2 weeks, 0 missed
Meal satisfaction: 4.2/5 avg rating

ASSESSMENT
NCP Diagnosis: Excessive energy intake (NI-1.3) — improving
Progress toward goals:
  • Weight loss: on track (3 lbs in 2 weeks)
  • HbA1c: pending follow-up lab
  • Meal adherence: excellent (100% delivery acceptance)
Barriers: evening cravings, limited snack options

PLAN
• Continue current meal prescription — no changes
• Add evening snack guidance: 150-cal diabetic-appropriate options
• Request follow-up HbA1c lab draw (due Apr 15)
• Next visit: 4 weeks (Apr 24)
• AVA to monitor evening craving frequency at weekly check-in
──────────────────────────────────────────────
```

- **Decision Point:** Is the note accurate, complete, and clinically appropriate?

### Step 3: Edit If Needed
- **Screen:** Center panel — SOAP note editor (inline editing)
- **User Action:** Clicks into any section to edit. Common edits:
  - Add clinical observations the agent didn't capture
  - Refine assessment language
  - Adjust the plan based on clinical judgment
- **System Response:** Edits are tracked — original agent text preserved, RDN changes highlighted in the audit trail
- **Decision Point:** Is the note ready to sign?

### Step 4: Confirm ICD-10 Codes
- **Screen:** Center panel — below SOAP note, code mapping section
- **User Action:** Reviews the agent-mapped codes:

| NCP Term | ICD-10 | Confidence | Billing Impact |
|---|---|---|---|
| Excessive energy intake (NI-1.3) | E11.65 | High | Primary dx for 97803 |
| Food/nutrition knowledge deficit (NB-1.1) | Z71.3 | Medium | Supporting dx |

- **System Response:** Medium-confidence codes are highlighted. Agent shows reasoning for each mapping.
- **Decision Point:** Codes correct for billing?

### Step 5: Verify Billing Prerequisites
- **Screen:** Center panel — billing status bar below codes
- **User Action:** Scans the billing checklist:

```
Billing prerequisites:
  ✅ Physician referral order on file (Dr. Chen, 2026-03-15)
  ✅ Visit type: 97803 (MNT follow-up, 15 min)
  ⚠ Medicare MNT visits this year: 3 of 5 used
     (2 follow-up visits remaining)
  ✅ RDN enrolled with Anthem BCBS
```

- **Decision Point:** Any billing blockers? Note the visit cap warning.

### Step 6: Sign the Note
- **Screen:** Right panel — signature card
- **User Action:** Taps **Sign note**
- **System Response:**
  - Note locked with RDN signature, timestamp, and attestation: "I have reviewed and approve this documentation"
  - Note becomes part of the immutable clinical record
  - Visit event triggers claim generation (Domain 5)
  - Queue item removed
  - Thread logs: "[Dr. Priya M.] Signed SOAP note — MNT follow-up · 2:34pm"

---

## Alternative Paths

### Alt 1: Visit Cap Warning — Approaching Medicare Limit
- **Trigger:** Patient has used 4 of 5 Medicare MNT visits for the year
- **Modified Steps:**
  - Prominent warning: "1 MNT visit remaining this calendar year"
  - Agent suggests: schedule remaining visit strategically (e.g., before anticipated HbA1c recheck)
  - RDN factors this into the plan section
- **Outcome:** RDN makes a clinically informed scheduling decision

### Alt 2: Physician Referral Order Missing
- **Trigger:** No referral order linked to this patient's MNT visits
- **Modified Steps:**
  - Red warning: "⚠ No physician referral order — this visit cannot be billed"
  - RDN can still sign the note (clinical documentation proceeds)
  - Agent alerts coordinator to obtain the referral order
  - Claim generation is blocked until the order is on file
- **Outcome:** Clinical care documented, billing gap tracked

### Alt 3: Agent Draft Significantly Wrong
- **Trigger:** Agent misheard or misinterpreted visit data — major inaccuracies in the note
- **Modified Steps:**
  - RDN makes substantial edits — the draft is more scaffold than content
  - Or RDN taps **Reject and re-draft** with notes on what was wrong
  - Agent re-drafts from the RDN's corrections
- **Outcome:** More time spent, but the signed note is accurate

---

## Exception Handling

### Exception 1: Note Signed Prematurely with Error
- **Cause:** RDN signed a note, then realizes an error
- **Frequency:** Rare
- **Severity:** Critical — signed notes are part of the clinical and legal record
- **Recovery:**
  - RDN can submit an **addendum** (append-only, original note preserved)
  - Addendum is timestamped and linked to the original note
  - Original note is never modified — this is a legal and compliance requirement
- **Prevention:** Pre-sign confirmation: "Review complete? This note will be locked after signing."

### Exception 2: Visit Data Not Available for Draft
- **Cause:** Telehealth platform didn't transmit data, or visit was partially completed
- **Frequency:** Occasional
- **Severity:** Graceful
- **Recovery:** Agent creates a skeleton note with available data, flags gaps. RDN fills in from their own notes.
- **Prevention:** Agent checks for data completeness before surfacing the draft in the queue

---

## Critical Moments

| Step | Risk | Mitigation |
|---|---|---|
| 2 | RDN signs without reading (rubber-stamp risk) | Scroll tracking — signature button only activates after all sections are viewed |
| 3 | RDN edits change clinical meaning without tracking | All edits logged with original text preserved |
| 4 | Wrong ICD-10 code leads to claim denial | Medium-confidence codes visually distinct; agent explains mapping |
| 5 | Visit cap exceeded unknowingly | Counter is persistent and prominent, not buried |
| 6 | Accidental sign | Confirmation prompt (not undo — signed notes are legally binding) |

---

## Connected Journeys

**Feeds into:**
- Claims generation (Domain 5) — signed note triggers claim
- Patient clinical record — note becomes part of longitudinal record
- RDN caseload overview — visit marked complete

**Feeds from:**
- MNT visit completion — visit data drives the agent's draft
- [RDN nutrition plan review](rdn-nutrition-plan-review.md) — the nutrition plan determines visit context

---

## Design Implications

1. **The SOAP note editor is a writing tool, not a form.** RDNs think in narrative clinical
   language. The editor should feel like editing a document, not filling out fields. Inline
   text editing with section headers, not input boxes.

2. **Scroll tracking before signing is a compliance feature.** The RDN must have viewed all
   sections before the sign button activates. This protects the RDN legally and ensures
   the review is real.

3. **Medicare visit cap is a constant awareness item.** It should be visible on every SOAP
   note screen for the patient, not just when it's about to expire. "Visit 3 of 5 this year"
   is useful context even when there's no urgency.

4. **Addendum, never edit.** Signed clinical notes cannot be modified. This is a legal and
   compliance requirement. The addendum flow must be clean and discoverable — not a workaround
   but a designed feature.

5. **Agent edits are transparent.** When the RDN changes the agent's draft, both versions
   are preserved. This builds the data set for improving future drafts and protects the
   audit trail.
