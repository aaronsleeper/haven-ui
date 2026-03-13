# Insurance

**Parent Navigation:** Billing & Insurance

## Screen Overview

Patients view their insurance information, upload or update insurance cards, verify eligibility, and see coverage details for Cena Health services. They can check which services are covered and track authorization status with Ava's help.

## Features on Screen

- **Insurance Card Display** - Shows front and back images of uploaded insurance card. Member ID, group number, insurance company name displayed prominently.
- **Upload/Update Card** - Button to upload new card or replace expired one. File picker for front and back images (mobile: use camera).
- **Insurance Details** - Plan name, policy holder, member ID, group number, effective dates, insurance company contact info.
- **Eligibility Status** - Badge showing verification status: Verified, Pending, Expired, Not Verified. Last verified date.
- **Coverage Summary** - List of covered services with status: Meal delivery (Covered/Not Covered), RDN visits (sessions remaining), BHN visits (sessions remaining).
- **Verify Eligibility Button** - Trigger manual eligibility check with insurance provider.

**Key data:** insuranceCompany, policyNumber, memberID, groupNumber, coverageStatus, effectiveDate, expirationDate, cardImageUrls

## Ava Integration

**Card missing:** "I don't see an insurance card on file. Would you like to upload it now? I can walk you through it."

**Card expiring:** "Your insurance card expires in 15 days. Do you have an updated card to upload?"

**Eligibility verified:** "Great news! Your insurance has been verified. You're covered for meal delivery and 12 nutrition counseling sessions."

## Wireframe

```
┌──────────────────────────────────────┬─────────────────┐
│ Insurance                            │ Ava Chat        │
├──────────────────────────────────────┤                 │
│ INSURANCE CARD                       │ "Great news!    │
│ ┌──────────────────────────────────┐ │ Your insurance  │
│ │ [Front Image]    [Back Image]    │ │ is verified..." │
│ │ [Upload New Card CLICK]          │ │                 │
│ └──────────────────────────────────┘ │ [Chat input]    │
│                                      │                 │
│ INSURANCE DETAILS                    │                 │
│ ┌──────────────────────────────────┐ │                 │
│ │ Insurance Company: Blue Cross    │ │                 │
│ │ Member ID: ABC123456             │ │                 │
│ │ Group Number: 987654             │ │                 │
│ │ Effective: Jan 1, 2024           │ │                 │
│ │ Expires: Dec 31, 2025            │ │                 │
│ │ [✓ Verified] Last: Dec 1, 2025   │ │ [Audit log]     │
│ │                                  │ │                 │
│ │ [Verify Eligibility CLICK]       │ │                 │
│ └──────────────────────────────────┘ │                 │
│                                      │                 │
│ COVERAGE SUMMARY                     │                 │
│ ┌──────────────────────────────────┐ │                 │
│ │ ✓ Meal Delivery - Covered        │ │                 │
│ │ ✓ RDN Visits - 10/12 remaining   │ │                 │
│ │ ✓ BHN Visits - 8/12 remaining    │ │                 │
│ │ ✓ Lab Tests - Covered            │ │                 │
│ └──────────────────────────────────┘ │                 │
└──────────────────────────────────────┴─────────────────┘
```

## Critical Questions

- **Verification method:** Real-time API check or manual staff verification? → **A) API when available, manual backup**
- **Multiple insurance:** Support primary and secondary insurance? → **A) Primary only for v1**
- **Self-pay option:** Allow patients without insurance? → **A) Yes, show different UI for self-pay patients**