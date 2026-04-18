# Journey: Submit a Referral

## Journey Metadata
- **User:** Partner staff (e.g., Nurse Jenny at UConn Health, submitting a referral for a patient)
- **Goal:** Refer a patient to Cena Health's Food-as-Medicine program
- **Frequency:** Variable — daily for high-volume partners, weekly for smaller ones
- **Entry Point:** Partner Portal login or FHIR API integration
- **Success Criteria:** Referral submitted, acknowledgement received, status trackable
- **Duration:** 3-5 minutes (manual form), instant (FHIR API)

## Prerequisites
- Partner is onboarded and configured in the system
- Partner staff has portal credentials
- Patient has been identified as a candidate for the program

---

## Happy Path (Manual — Portal Form)

### Step 1: Log In to Partner Portal
- **Screen:** Partner Portal — login page
- **User Action:** Logs in with partner credentials (SSO if partner supports it)
- **System Response:** Landing page shows referral queue and submission option

### Step 2: Start New Referral
- **Screen:** Partner Portal — click "New Referral"
- **User Action:** Opens the referral form
- **System Response:** Clean form with clear sections:

```
NEW REFERRAL
──────────────────────────────────────────
Patient Information
  First name:    [              ]
  Last name:     [              ]
  Date of birth: [MM/DD/YYYY    ]
  Phone:         [              ]
  Address:       [              ]

Insurance
  Payer:         [Anthem BCBS  ▾]
  Member ID:     [              ]

Clinical
  Primary Dx:    [E11.65       ▾] (searchable ICD-10)
  Reason for referral:
  [Type 2 diabetes, elevated HbA1c,       ]
  [would benefit from nutrition therapy    ]

Referring Provider
  Name:          [auto-filled from login   ]
  NPI:           [auto-filled              ]

Attachments (optional)
  [📎 Upload clinical summary]

──────────────────────────────────────────
[Submit Referral]
──────────────────────────────────────────
```

- **Decision Point:** Is the information complete?

### Step 3: Submit
- **User Action:** Taps **Submit Referral**
- **System Response:**
  - Referral created in Ava system — status: `referral_received`
  - Acknowledgement shown immediately:

```
┌─────────────────────────────────┐
│   ✓ Referral Submitted          │
│                                 │
│   Patient: Maria Garcia         │
│   Reference #: REF-2847         │
│   Submitted: Mar 27, 2026       │
│                                 │
│   What happens next:            │
│   • Cena Health reviews within  │
│     1 business day              │
│   • You'll receive a status     │
│     update by email             │
│   • Track status anytime in     │
│     your referral dashboard     │
│                                 │
│   [Submit another referral]     │
│   [View referral dashboard]     │
│                                 │
└─────────────────────────────────┘
```

  - Email confirmation sent to referring provider
  - Referral enters coordinator queue (Journey: coordinator referral intake)

### Step 4: Track Status
- **Screen:** Partner Portal — referral dashboard
- **User Action:** Views submitted referrals and their status:

```
REFERRAL DASHBOARD
──────────────────────────────────────────
| Patient       | Submitted | Status        |
|---------------|-----------|---------------|
| Garcia, Maria | Mar 27    | Under review  |
| Thompson, R.  | Mar 20    | Enrolled      |
| Chen, L.      | Mar 15    | Active — care |
| Williams, J.  | Feb 28    | Discharged    |
──────────────────────────────────────────
```

- **System Response:** Status updates automatically as the patient moves through the lifecycle
- **Decision Point:** None — read-only tracking

---

## Alternative Path: FHIR API Referral

### Automated Referral via Integration
- **Trigger:** Partner EHR sends a FHIR ServiceRequest resource via API
- **Modified Steps:**
  - No portal interaction — referral arrives programmatically
  - Agent parses the FHIR resource, runs completeness check
  - If complete: enters coordinator queue silently
  - If incomplete: agent drafts data request back via FHIR or email
  - Partner can track status via API polling or portal
- **Outcome:** Zero-touch referral submission for integrated partners

---

## Alternative Paths

### Alt 1: Incomplete Form Submission
- **Trigger:** Required fields missing when partner clicks Submit
- **Modified Steps:**
  - Inline validation highlights missing fields: "Insurance member ID is required"
  - Submit button disabled until required fields are complete
  - Optional fields are clearly marked as optional
- **Outcome:** Partner completes the form before submission — no partial referrals

### Alt 2: Duplicate Referral
- **Trigger:** Partner submits a referral for a patient already in the system
- **Modified Steps:**
  - System detects the match (name + DOB)
  - Message: "It looks like Maria Garcia (DOB 03/15/1964) may already be in our system. We'll check and follow up."
  - Referral submitted with duplicate flag — coordinator reviews
  - Partner is not blocked from submitting (they may have a legitimate reason)
- **Outcome:** Duplicate flagged for coordinator, not rejected at the portal

### Alt 3: Batch Referral (Multiple Patients)
- **Trigger:** Partner onboarding a cohort of patients (e.g., UConn pilot launch)
- **Modified Steps:**
  - Partner uploads a CSV or uses FHIR batch endpoint
  - System validates each row, reports errors per row
  - Valid referrals enter the system; invalid rows returned with error detail
  - Coordinator receives a single "batch referral" queue item with summary
- **Outcome:** Bulk onboarding without 50 individual form submissions

---

## Exception Handling

### Exception 1: Partner Credentials Expired
- **Cause:** Portal access expired, SSO integration failed
- **Frequency:** Occasional
- **Severity:** Blocking — partner can't submit
- **Recovery:** "Contact Cena Health to renew your portal access: (860) 555-0100" — or fax/email referral as fallback
- **Prevention:** 30-day warning before credential expiration

---

## Critical Moments

| Step | Risk | Mitigation |
|---|---|---|
| 2 | ICD-10 code is wrong or too vague | Searchable ICD-10 field with common codes highlighted |
| 2 | Insurance info not available to the referring nurse | Field marked required but "Unknown" is accepted — coordinator follows up |
| 3 | Partner unsure if referral went through | Immediate on-screen confirmation + email |
| 4 | Partner can't find status of a submitted referral | Dashboard is the landing page — referrals visible immediately after login |

---

## Connected Journeys

**Feeds into:**
- [Coordinator referral intake](coordinator-referral-intake.md) — referral appears in coordinator's queue
- [Patient enrollment](patient-enrollment.md) — after referral is accepted

**Feeds from:**
- Partner onboarding (Domain 4) — partner must be configured before referrals flow

---

## Design Implications

1. **The form is the entire product for most partner users.** Partner staff may use this portal
   once a week. Every interaction must be self-explanatory — no training required, no
   documentation to read.

2. **Auto-fill from login context.** Referring provider name, NPI, and organization should
   pre-populate from the partner's portal account. Fewer fields to fill = fewer errors.

3. **Confirmation must be unambiguous.** Partners need to trust that the referral arrived.
   Reference number, on-screen confirmation, and email confirmation — all three.

4. **The dashboard is the return surface.** When a partner logs back in, they land on the
   dashboard — status of all their referrals at a glance. This is how partners gauge
   whether the program is working for their patients.

5. **Accept imperfect data, don't block.** If a nurse doesn't have the insurance member ID,
   let them submit anyway with "Unknown." A partial referral is better than no referral.
   The coordinator follows up on gaps.
