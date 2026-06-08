---
title: Apps & surfaces
description: Patient + ops surfaces — the development capability set, derived from the per-capability notes.
---

The patient and provider/ops surfaces the program builds. This index is a **derived view** of the per-capability notes in `capabilities/development/` — the canonical source for any cap's scope, contract citation, and decisions log. Edit a cap note; rebuild; this table follows.

For app structure see `patient-app-ia-v1.md`; for the live operational dashboard see `Capability matrix.md` (Bases views, Obsidian-only). Build mode: IA v1 validated; Home/Assessments/Order slices built; build gated on stack (T0.1) + data layer (T0.2).

## Development capabilities (55)

| ID | Capability | Surface | Priority | Dev scope | Status |
| --- | --- | --- | --- | --- | --- |
| cap-02 | Referral receipt — Epic → Commonwell → Athena | Backend | must-june-1 | code-needed | needs-verification |
| cap-03 | Manual/paper referral fallback to CC | CC, Backend | must-june-1 | code-needed | not-started |
| cap-04 | Referral acknowledgement / decline notification to UConn | Backend | must-later | code-needed | not-started |
| cap-05 | Eligibility intake data capture (demographics, medical history, dietary, cultural prefs) | Provider | must-june-1 | code-needed | not-started |
| cap-06 | Individualized nutrition care plan generation | Provider | must-june-1 | code-needed | not-started |
| cap-07 | Multi-instrument assessment administration (HFIAS, HEI, WHOQOL-HIV BREF, NKQ) | Patient, Backend | must-may-15 | code-needed | not-started |
| cap-08 | 24-hour dietary recall (HEI input via multiple-pass methodology) | Patient, Provider | must-may-15 | code-needed | not-started |
| cap-09 | Participant satisfaction surveys at Months 3, 6, 9 | Patient, Backend | must-later | code-needed | not-started |
| cap-10 | CC creates patient account in Athena | CC | must-june-1 | external-integration | live |
| cap-11 | Athena ↔ Cena patient account sync | Backend | must-may-15 | code-needed | in-progress |
| cap-12 | IRB consent capture (UConn-provided form) | Patient, Provider | must-june-1 | external-integration | not-started |
| cap-14 | RDN encounter notes input (free-form, AI-classifiable later) | Provider | must-june-1 | code-needed | needs-verification |
| cap-16 | Food preferences, allergies, tolerances, care plan capture | Provider | must-june-1 | code-needed | not-started |
| cap-17 | Weekly meal ordering & menu browsing (deterministic) | Patient | must-june-1 | code-needed | not-started |
| cap-18 | Per-participant per-week budget visibility ($200/week × 26 weeks) | Patient | must-june-1 | code-needed | not-started |
| cap-19 | Bilingual UI (English/Spanish) | Patient | should | deferred | not-started |
| cap-20 | Self-reported outcomes (representative — weight, A1C, BP, custom fields) | Patient | should | live-verify | not-started |
| cap-21 | Self-service appointment scheduling with RDN | Patient | should | ops-overlap | not-started |
| cap-22 | Patient notifications (order, appointment) — bilingual | Patient, Backend | should | code-needed | not-started |
| cap-23 | Phone / web-portal / assisted-ordering channels | Patient, CC | must-june-1 | code-needed | not-started |
| cap-24 | CC patient roster / panel | CC | must-june-1 | live-verify | live |
| cap-25 | CC weekly check-in workflow + notes capture | CC | must-june-1 | code-needed | not-started |
| cap-27 | Escalation protocol to UConn clinical team | CC, External | must-june-1 | code-needed | not-started |
| cap-28 | Dropout flagging + retention reporting | CC, Backend | must-later | code-needed | not-started |
| cap-29a | Internal staff patient detail view (Cena platform app) | Employee | must-june-1 | live-verify | live |
| cap-29b | External provider dashboard (UConn study team / partner clinicians) | Provider | must-june-1 | code-needed | not-started |
| cap-30 | Provider/RDN appointment management | Provider | must-june-1 | ops-overlap | not-started |
| cap-31 | Provider/RDN follow-up scheduling | Provider | should | code-needed | not-started |
| cap-32 | Kitchen order intake / dashboard | Kitchen | must-june-1 | live-verify | live |
| cap-33 | Kitchen meal & recipe upload | Kitchen | must-june-1 | live-verify | live |
| cap-34 | Kitchen pricing input (their cost only) | Kitchen | must-june-1 | live-verify | needs-verification |
| cap-35 | Kitchen-facing artifacts hide patient pricing | Kitchen | must-june-1 | live-verify | in-progress |
| cap-36 | Home delivery via contracted delivery partners | Backend, External | must-june-1 | ops-overlap | not-started |
| cap-37 | Pickup at The Grocery on Broad (585 Broad St, Hartford) | Patient, Kitchen | must-june-1 | code-needed | not-started |
| cap-38 | Delivery / pickup status tracking (patient-visible) | Patient, Backend | should | code-needed | not-started |
| cap-39 | Per-participant per-week spend tracking, itemized (meals/kits/groceries) | Backend | must-may-15 | code-needed | not-started |
| cap-40 | Per-participant $200/week budget enforcement | Backend, Patient | must-june-1 | code-needed | not-started |
| cap-41 | Cena markup application (kitchen cost → patient price) | Backend | must-june-1 | code-needed | not-started |
| cap-42 | Monthly UConn invoice generation with backup documentation | Backend, Admin | must-later | code-needed | not-started |
| cap-43 | Cena ↔ kitchen owed-amount tracking | Backend | must-june-1 | code-needed | not-started |
| cap-44 | Monthly UConn report — onboarding + baseline | Backend, Admin | must-later | code-needed | not-started |
| cap-45 | Monthly UConn report — order volumes + delivery metrics | Backend, Admin | must-later | code-needed | not-started |
| cap-46 | Monthly UConn report — RDN session attendance + clinical summaries | Backend, Admin | must-later | code-needed | not-started |
| cap-47 | Monthly UConn report — care coordination check-ins | Backend, Admin | must-later | code-needed | not-started |
| cap-49 | 6-month interim progress report | Admin, Backend | must-later | code-needed | not-started |
| cap-50 | Final outcomes report (draft penultimate month, final final month) | Admin, Backend | must-later | code-needed | not-started |
| cap-51 | Assessment timepoint reports (post each survey window) | Backend, Admin | must-later | code-needed | not-started |
| cap-54 | Materials distribution tracking | Backend, Admin | must-june-1 | code-needed | not-started |
| cap-55 | Role-based access controls (per IRB protocol) | Backend | must-may-15 | code-needed | not-started |
| cap-57 | PHI audit trail / accounting of disclosures | Backend | must-later | code-needed | not-started |
| cap-58 | Data export in non-proprietary format on UConn request (15-day SLA) | Backend, Admin | must-later | code-needed | not-started |
| cap-59 | Program-entity codification (60 patients, $499,790 cap, fixed schedule) | Backend, Admin | must-may-15 | live-verify | in-progress |
| cap-60 | Per-participant timeline tracking (rolling enrollment, individualized milestones) | Backend, Provider | must-june-1 | code-needed | not-started |
| cap-61 | Multi-role auth & authorization (patient, RDN, CC, kitchen, provider, admin, MPH student) | Backend | must-may-15 | live-verify | needs-verification |
| cap-62 | Event-driven notification system | Backend | must-june-1 | code-needed | not-started |

> Capability detail pages grow section-by-section as a real need appears (the hub-plus-matrix decision). The notes themselves are the canonical detail today.
