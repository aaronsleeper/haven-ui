---
title: SOPs
description: The org SOP taxonomy and the UConn pilot's coverage slice — derived from the canonical SOP docs.
---

Standard Operating Procedures, by role and department. The single term "SOP" hides **three document tiers** in the standard quality-management hierarchy (ISO 9001 / HACCP convention):

- **Procedure** *(role-level SOP)* — the agreed way a recurring activity is done so any qualified person in the role performs it consistently. Few per role. The 4 drafted launch-readiness documents (CC, RD, Admin, Enrollment) sit here.
- **Work instruction** — step-by-step for a *single task*; safety- or quality-critical. Many per Procedure. Most of the "hundreds" live here.
- **Standardized recipe** *(food-service)* — measurements, times, temps, yields; HACCP-adjacent. Recipe development & standardization is a work-instruction-tier procedure whose *output* is a Standardized Recipe.

An SOP's authored makeup is defined by the `clinical-staff-sop` deliverable spec. Where "hundreds" lives: in the Work Instruction + Recipe tiers — the master taxonomy below scaffolds them, and the **Director of Clinical Ops** + **Vanessa (kitchen SME)** are the enumeration owners.

:::callout{variant="info" title="This page is a derived view."}
The tables below are generated at build time from the two canonical SOP docs — the org **SOP Master Taxonomy** (`SOP Master Taxonomy.md`) and the UConn **SOP Coverage Map** (`SOP Coverage Map.md`). **Edit those docs; rebuild; this page follows.** Currency lives there, not here.
:::

Status: ✅ drafted · ◔ planned · ⬜ not started · ◐ partial/in-progress · ⛔ gap/undecided. Scope: **O** = org-common · **P** = program-specific.

## Org master taxonomy (cross-program)

The org-wide list of every SOP Cena expects to maintain — recorded, not remembered. Org-common SOPs are written once and reused; program-specific ones live with their program. Owner: Director of Clinical Operations.

#### Clinical — Registered Dietitian

| Task SOP | Scope | Storage | Status | Accountable |
| --- | --- | --- | --- | --- |
| Counseling session conduct | O | Operations | ✅ (in RD SOP, UConn draft) | Marrero |
| Encounter notes in Athena | O | Operations | ✅ | Marrero |
| Care-plan review | O | Operations | ✅ | Marrero |
| 24-hr recall protocol (relative-day handling) | **P** (UConn) | UConn folder | ⛔ open clinical call | Marrero / RDN |
| Quality-of-life assessment | O? `[CONFIRM]` | TBD | ◔ Vanessa requested | Marrero |

#### Care Coordination

| Task SOP | Scope | Storage | Status | Accountable |
| --- | --- | --- | --- | --- |
| Patient roster management | O | Operations | ✅ | Marrero |
| Weekly check-ins | O | Operations | ✅ | Marrero |
| Contact logging | O | Operations | ✅ | Marrero |
| Appointment requests (email-trigger → book in Athena) | O | Operations | ✅ | Marrero |
| Escalation (safety/medical concern) | O | Operations | ✅ folded in CC SOP | Marrero |
| PHQ9 administration (CITI-trained CC owns; not RDN/student) | **P** (UConn — pending org-common confirmation) | UConn folder | ◔ added 2026-05-27 (M3); CC SOP step pending | Marrero / CC |

#### Enrollment & Onboarding *(cross-role)*

| Task SOP | Scope | Storage | Status | Accountable |
| --- | --- | --- | --- | --- |
| Referral → consent → account → 7-day intake → baseline → care plan | mixed | UConn folder (CommonWell intake is **P**) | ✅ drafted (most launch-critical) | Marrero / Vanessa |
| CommonWell referral intake (Epic→Athena, 48-hr account creation) | **P** (UConn) | UConn folder | ◐ pipeline decided 2026-05-27; SOP TBD | Vanessa / Andrey |

#### Administration / Backend

| Task SOP | Scope | Storage | Status | Accountable |
| --- | --- | --- | --- | --- |
| Staff training & credentials | O | Operations | ✅ (Admin SOP — scope pending Vanessa) | Marrero |
| Access provisioning | O | Operations | ✅ | Marrero |
| Materials distribution | O | Operations | ✅ | Marrero |
| Data export | O | Operations | ✅ | Marrero |
| Subcontractor onboarding + BAA | O | Operations | ✅ (Admin step; promote if heavy) | Marrero |
| Consent-form digitization (scan → PDF; electronic storage) | O | Operations | ◔ added 2026-05-27 (M3); Admin SOP step pending | Marrero |

#### Data & Analytics `[scope to confirm]`

| Task SOP | Scope | Storage | Status | Accountable |
| --- | --- | --- | --- | --- |
| Aggregate quality-metric reporting (per data dictionary) | mixed (cadence is **P**) | TBD | ⬜ deferred post-launch | Marrero / Marinka |

#### Kitchen operations — food production *(Work Instruction + Recipe tier; Vanessa is SME)*

| Task SOP | Scope | Storage | Status | Accountable |
| --- | --- | --- | --- | --- |
| Recipe development & standardization *(Vanessa's "new recipe" — produces a Standardized Recipe)* | O? `[CONFIRM scope]` | Operations or kitchen-side TBD | ⛔ gap — enumerate w/ Vanessa | Vanessa (SME) |
| HACCP food-safety SOPs (receiving, storage, cooking, cooling, dishwashing, allergen control) | O | Operations | ⛔ gap — enumerate w/ Vanessa | Vanessa (SME) |
| Order intake (Cena → kitchen) | **P** (UConn) | UConn folder | ⛔ gap | Andrey / Vanessa |
| Pricing visibility — hide patient pricing on kitchen side | **P** (UConn) | UConn folder | ⛔ gap | Andrey / Vanessa |

#### Fulfillment / delivery *(External partner — partner-facing one-pagers, not full internal SOPs)*

| Task SOP | Scope | Storage | Status | Accountable |
| --- | --- | --- | --- | --- |
| Delivery vs. pickup at Grocery-on-Broad | **P** (UConn) | UConn folder | ⛔ gap | Andrey / Vanessa |
| Patient-facing partner one-pager | **P** (UConn) | UConn folder | ⛔ gap | Andrey / Vanessa |

## UConn pilot slice (first program instance)

The SOPs this pilot needs to execute the contract, and their draft status. Rendered drafts live in the haven-ui Document district (`pattern-library/pages/doc-*-sop.html`); the filename is noted where one exists. *(Co-deploying the rendered SOPs into this site so the references become live links is a tracked follow-up.)*

#### Departmental ownership (settled 2026-06-01 Clinical Workflows Meeting)

| SOP | Covers | Status | Rendered draft |
| --- | --- | --- | --- |
| Care Coordinator | **Dr. Marrero** (Clinical Ops) | roster, weekly check-ins, contact logging, appointment requests, escalation (24/25/26/27/21), **PHQ9 administration (added 2026-05-27, M3)**, **CC weekly-check-in do's and don'ts (added 2026-06-02 Part 2 — guidelines for the service-provider-not-friend posture; contingent on Dr. Wu's script + data-goals draft for cap-25)**, **multi-modal contact / cap-26 (added 2026-06-02 Part 2 — operational SoP needed even though platform dev is excluded)** | `doc-care-coordinator-sop.html` |
| Registered Dietitian | **Dr. Marrero** (Clinical Ops; Dr. Wu not separately owning Dietetics) | counseling sessions, encounter notes (Athena), care plan review (14/15/06/16). **2026-06-02: meal plan + care plan = one combined artifact** (not two distinct). | `doc-rd-sop.html` |
| Administrator | **Vanessa Sena** (Operations) | staff training/credentials, access provisioning, materials distribution, data-export (13/55/61/54/58), **consent-form digitization → PDF storage (added 2026-05-27, M3; 2026-06-02 owner refined: care coordinator + MPH student scan, not Admin-only)**, **monthly UConn invoice template / cap-42 (added 2026-06-02 Part 2 — Vanessa flagged template needed)** | `doc-admin-sop.html` |
| Enrollment & Onboarding | **Dr. Marrero** (primary; Andrey consulted on technical services — forms, Athena connections) | referral → consent → account → 7-day intake → baseline assessments → care plan (02/03/05/07/08/10/12). **Focus: staff/patient interactions.** **M3 refinements:** consent at screening; in-person first visit; baseline-before-intervention; PHQ9 + 3-item anxiety added to baseline set. | — |
| Escalation protocol | **Dr. Marrero** (Clinical Ops) | cap-27 | — |
| Kitchen operations | **Vanessa Sena** | 32–35 | — |
| Fulfillment / delivery | **Vanessa Sena** | 36–38 | — |
| Subcontractor onboarding + BAA | **Vanessa Sena** | 56/63 | — |
| Monthly reporting & review | **Vanessa Sena + Dr. Marrero** (shared; transitions fully to Marrero after V brings him through a few cycles) | 44–51, 47, 48 | — |
| SoP class | Proposed dept head | Status | — |
| Technical infrastructure (data handling, account provisioning, system integration, incident response, audit logging, subcontractor tech onboarding, backup/DR, vulnerability mgmt) | **Split by axis** (resolved 2026-06-02 workflow-mapping session, reconciled via Gemini transcript Part 3): operational PHI → Marrero; technical infrastructure → Andrey + Marinka; cross-cutting → all three | **⚠️ Part-1 correction:** my initial filing read this as Vanessa "denying" the first three Tech-Infra candidates. The transcript reveals a **productive reframe, not a denial.** Per-candidate resolution: **Patient Data Handling** → split (Marrero owns operational PHI handling SOPs; Andrey + Marinka own technical-infrastructure PHI docs). **System Integration & Interoperability** → reclassified as a *technical implementation document*, not an operational SOP — the artifact exists, the class is different. Andrey + Marinka own. **Account Provisioning & Deprovisioning** → not explicitly addressed; pending. **Incident Response** → assigned: Marrero (with potential IRB-process involvement). **Audit Logging & Compliance** → assigned: Marrero + Marinka + Andrey (joint). **Subcontractor Technical Onboarding** → confirmed required SOP (already standalone — see row above). **Backup / Disaster Recovery / Business Continuity** + **Vulnerability Management** → SHELVED until required by future external security reviews. **Net:** Marrero owns the patient-data SOP authoring; Andrey + Marinka own the back-end infrastructure SOP authoring; audit/incident sits cross-functional. ✅ All 8 Part-1 candidates now resolved (assigned, reclassified, or shelved). | — |

### Recommended sequence to ready

1. ~~Admin SOP~~ ✅ drafted (confirm scope w/ Vanessa).
2. ~~Enrollment & Onboarding~~ ✅ drafted (most launch-critical).
3. Kitchen + Fulfillment partner one-pagers — needed before meals flow; lighter than internal SOPs.
4. Get the 4 drafted SOPs through their sign-off gates (clinical lead / Vanessa / Director of Clinical Ops).
5. Monthly reporting SOP — after launch.

### Open scope decisions

- Confirm the **Admin task set** (the proposed five tasks).
- Decide whether **escalation** stays folded in the CC SOP or becomes standalone for UConn.
- Decide whether **kitchen/fulfillment** are partner one-pagers or full SOPs.

> **Editable source of truth:** the org list lives in `SOP Master Taxonomy.md`; the UConn slice in `Partners/UCONN Health/SOP Coverage Map.md`. This page never owns SOP rows — it renders theirs.
