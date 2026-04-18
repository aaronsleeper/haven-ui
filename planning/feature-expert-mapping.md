# Phase 2.1: Feature-to-Expert Mapping

> Cross-references P0 features from `product-structure.md` against the expert
> registry. Identifies which expert owns which feature's domain logic, where
> coverage gaps exist, and what those gaps mean for implementation.
>
> **Created:** 2026-04-10
> **Status:** Draft — first pass, ready for review

---

## How to read this

Each P0 feature is mapped to:
- **Primary expert** — owns the domain logic and judgment calls for this feature
- **Supporting experts** — contribute output contracts, constraints, or review
- **Gap** — domain knowledge needed but not covered by any current expert

Features with no primary expert are **coverage gaps** — they need either a new
expert, an expansion of an existing expert's scope, or explicit fallback to
human-only operation at launch.

---

## Module 1: Admin App (Coordinator, Admin)

| Feature | Primary Expert | Supporting Experts | Gap |
|---|---|---|---|
| **1.1 Patient Queue** | Patient Ops | Compliance (field access), UX Design Lead (UI spec) | — |
| **1.2 Patient List & Records** | Patient Ops | Clinical Care (clinical summary), Compliance (PHI display rules), UX Design Lead | — |
| **1.3 Care Plan Review** | Patient Ops (orchestration) | Clinical Care (clinical sections), Compliance (consent/PHI), UX Design Lead (diff view) | — |
| **1.6 Discharge Management** | Patient Ops | Clinical Care (outcome summary), Compliance (data retention), Ops/Compliance (partner reporting) | — |
| **1.10 User & Tenant Admin** | Platform/Infrastructure | Compliance (RBAC/field access matrix) | **No expert owns RBAC UI logic** — Platform owns infrastructure, UX Design Lead owns UI, but tenant admin workflows are uncovered |

---

## Module 2: Provider App (RDN, BHN)

| Feature | Primary Expert | Supporting Experts | Gap |
|---|---|---|---|
| **2.1 Clinical Queue** | Patient Ops (queue management) | Clinical Care (queue item clinical context), Compliance (field access per role) | — |
| **2.2 Patient Clinical Record** | Clinical Care | Compliance (PHI display per provider role), UX Design Lead (biomarker charts) | — |
| **2.3 Care Plan Clinical Review** | Clinical Care | Patient Ops (review reconciliation), Compliance (consent scope), UX Design Lead | — |
| **2.4 Visit Documentation** | Clinical Care | Compliance (documentation standards), Ops/Compliance (CPT codes, MNT caps, timely filing) | **Revenue Cycle expert missing** — CPT mapping, ICD-10 validation, and billing code generation are partially covered by Ops/Compliance but no expert owns the claim-generation pipeline |

---

## Module 3: Kitchen App (Kitchen Staff)

| Feature | Primary Expert | Supporting Experts | Gap |
|---|---|---|---|
| **3.1 Order Queue** | Meal Operations | Clinical Care (dietary requirements from care plan), Compliance (PHI boundary — no diagnosis on orders), Patient Ops (order trigger from care plan) | — |
| **3.3 Delivery Tracking** | Meal Operations | Compliance (minimum necessary on packing slips), Ops/Compliance (kitchen partner BAA) | — |

---

## Module 4: Patient App (Patient)

| Feature | Primary Expert | Supporting Experts | Gap |
|---|---|---|---|
| **4.1 Home Dashboard** | UX Design Lead (UI) | Patient Ops (status/activity data), Clinical Care (care team info) | **Patient-facing experience expert missing** — no expert owns the patient's perspective: health literacy adaptation, engagement patterns, accessibility for diverse populations |
| **4.2 Enrollment & Onboarding** | Patient Ops (lifecycle) | Compliance (consent collection, e-signature), Ops/Compliance (eligibility, program rules) | — |
| **4.5 Appointments** | *None* | Patient Ops (scheduling trigger), UX Design Lead (UI) | **Scheduling expert or scope gap** — appointment management is referenced in workflows but no expert owns the scheduling domain logic (provider availability, conflict resolution, no-show rebooking) |

---

## Module 5: Partner Portal (External partners)

| Feature | Primary Expert | Supporting Experts | Gap |
|---|---|---|---|
| **5.1 Referral Submission** | Patient Ops (intake) | Ops/Compliance (partner contract terms, referral requirements), Compliance (PHI handling for external users) | — |

---

## Module 6: AVA Voice Agent

| Feature | Primary Expert | Supporting Experts | Gap |
|---|---|---|---|
| **6.1 Scheduled Check-in Calls** | Clinical Care (clinical content: PHQ-9, wellness, adherence) | Platform/Infrastructure (Twilio pipeline), Compliance (call recording consent, PHI in voice), Patient Ops (monitoring schedule) | **Voice/conversational AI expert missing** — no expert owns conversation design, speech flow, error recovery, warm transfer protocols, or voice-specific UX (latency tolerance, turn-taking, silence handling) |

---

## Module 7: Platform Core

| Feature | Primary Expert | Supporting Experts | Gap |
|---|---|---|---|
| **7.1 Auth & RBAC** | Platform/Infrastructure | Compliance (field access matrix, MFA requirements) | — |
| **7.2 Agent Framework** | Platform/Infrastructure | All experts (each expert's task-routing defines agent behavior) | — |
| **7.3 Thread & Audit Engine** | Platform/Infrastructure | Compliance (audit event spec, retention, immutability) | — |
| **7.4 Consent Management** | Compliance | Patient Ops (consent gates in lifecycle), Ops/Compliance (regulatory requirements) | — |
| **7.5 Notification Engine** | *None* | Patient Ops (notification triggers), Compliance (opt-out, consent), UX Design Lead (template design) | **Minor gap** — notification logic is straightforward infrastructure; Platform/Infrastructure could absorb this |
| **7.8 Eligibility & Benefits Engine** | Ops/Compliance | Platform/Infrastructure (payer API integration) | — |

---

## Coverage gap summary

| Gap | Severity | Affects | Recommendation |
|---|---|---|---|
| ~~**Meal Operations**~~ | ~~High~~ | ~~3.1, 3.3~~ | **Resolved** — Meal Operations expert created 2026-04-10. Covers recipe matching, order generation, kitchen coordination, delivery logistics, and patient feedback. |
| **Revenue Cycle** | Medium | 2.4 (visit documentation billing), 7.9 (claims — P1) | Partially covered by Ops/Compliance (CPT codes, MNT caps). Full expert not needed for MVP if Ops/Compliance scope expands to cover claim-generation rules. Revisit for P1 claims engine. |
| **Voice / Conversational AI** | Medium | 6.1 (AVA check-in calls) | Conversation design is a distinct domain from clinical content. For MVP, Clinical Care owns content and Platform/Infrastructure owns pipeline — but conversation flow design (error recovery, turn-taking, silence handling) is a gap. Could defer to implementation-time UX research. |
| **Scheduling** | Low | 4.5 (appointments) | Scheduling logic is structured enough to be infrastructure, not expert judgment. Platform/Infrastructure or Patient Ops can absorb. No new expert needed. |
| **Patient-facing experience** | Low | 4.1 (home dashboard) | UX Design Lead covers interaction design. The gap is health literacy and patient engagement strategy — important but not blocking MVP. Address in Phase 4 when real patient data informs design. |
| **Notification Engine** | Low | 7.5 | Platform/Infrastructure can absorb. No new expert needed. |

---

## Expert utilization heatmap

How heavily each expert is loaded across P0 features.

| Expert | Primary owner | Supporting role | Total P0 touchpoints |
|---|---|---|---|
| **Patient Ops** | 6 features | 6 features | 12 |
| **Clinical Care** | 3 features | 5 features | 8 |
| **Compliance** | 1 feature | 11 features | 12 |
| **UX Design Lead** | 1 feature | 7 features | 8 |
| **Platform/Infrastructure** | 3 features | 3 features | 6 |
| **Meal Operations** | 2 features | 0 features | 2 |
| **Ops/Compliance** | 1 feature | 4 features | 5 |

**Observations:**
- **Patient Ops and Compliance are the most cross-cutting** — they touch nearly every feature. This validates their positioning as orchestration (Patient Ops) and constraint (Compliance) layers.
- **Clinical Care is appropriately focused** — primary on clinical features, supporting where clinical context is needed.
- **Ops/Compliance is underloaded at P0** — its heavy work comes at P1 (revenue cycle, partner management, analytics). At MVP it primarily provides CPT/billing constraints and partner contract rules.
- **No expert is a bottleneck** — the load is distributed. The risk is in the gaps (Meal Ops), not in overloading an existing expert.

---

## Recommended next actions

1. **Build Meal Operations expert** — highest-severity gap. Kitchen App is P0 with zero coverage. This expert owns recipe matching, order generation, dietary tag translation, kitchen scheduling, delivery logistics, and the PHI boundary between clinical and kitchen.

2. **Expand Ops/Compliance scope** or create lightweight Revenue Cycle expert stub — for MVP, Ops/Compliance needs to explicitly own CPT→claim-generation rules for visit documentation (Feature 2.4). Decide: expand scope (risk: Ops/Compliance is already over budget at 808 lines) or create a focused Revenue Cycle stub.

3. **Defer Voice/Conversational AI expert** — for MVP, Clinical Care + Platform/Infrastructure cover content and pipeline. Conversation design (the gap) can be addressed through UX Design Lead consultation during implementation. Revisit when AVA usage data reveals real conversation failure patterns.

4. **Confirm Platform/Infrastructure absorbs scheduling and notifications** — document this scope expansion in the expert's domain-knowledge layer so it's explicit.

5. **Start Phase 2.2 (data model validation)** — the feature mapping reveals which entities each feature needs. Cross-reference against `architecture/data-model.md`.

---

## What this document does NOT cover

- Feature-to-data-entity mapping (Phase 2.2)
- Feature-to-agent mapping (Phase 2.3 — which features are agent-driven vs. human-only)
- Screen-level interaction design (future — post Phase 2)
- P1/P2/P3 feature mapping (can be done later; P0 is the critical path)
