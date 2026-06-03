---
fragment_id: 02-action-author-combined-care-plan-and-meal-plan
type: action
x_cena_actor: human
x_cena_actor_role: registered-dietitian
x_cena_watches: dr-wu
x_cena_uncertainty: tbd
action:
  performed_in: Cena platform — care-plan authoring surface
  inputs:
    - baseline assessment battery results (HFIAS, HEI/24-hour-recall, WHOQOL-HIV BREF, NKQ, PHQ9, 3-item anxiety)
    - intake data (demographics, medical history, current diet, prior care)
    - dietary preferences (participant-stated)
    - cultural food preferences (participant-stated)
    - dietary requirements (clinical — sourced from Dr. Wu per current draft; review-or-approve role pending Vanessa)
  output:
    artifact: combined-care-plan-and-meal-plan
    storage: Cena platform (system of record for patient-experience data; not Athena)
    versioned: yes
    governs:
      - participant nutrition goals
      - counseling structure
      - meal prescription (for the duration of the pilot)
gaps:
  - SoP body describes care plan (Step 4) and meal plan (Step 5) as separate artifacts; Coverage Map and 2026-06-02 Vanessa update say ONE combined artifact — SoP body reconciliation pending
  - Dr. Wu role on dietary requirements — does Dr. Wu review or approve the dietary requirements that seed the meal plan? Open per 2026-06-02 session wrap-up; Vanessa owns the answer (NEEDS VANESSA CONFIRMATION per SoP body line 46)
  - Cultural-food-preference capture mechanism — whether free-text, structured taxonomy, or hybrid — pending RD/platform spec
outgoing_edges:
  - to: 03-attestation-rdn-approval
    type: default
    label: combined artifact authored → ready for approval
---

# Action: RD authors combined care plan + meal plan in Cena

The Registered Dietitian opens the care-plan authoring surface in the Cena platform and builds the participant's combined nutrition care plan and meal plan as **one artifact**. The authoring surface is seeded with the baseline assessment results and intake data; the RD layers participant-stated dietary preferences, cultural food preferences, and Dr. Wu–sourced dietary requirements over that base.

## Combined-artifact framing (resolved 2026-06-02 per Vanessa — SoP body not yet updated)

Per Vanessa's 2026-06-02 decision, the participant has **one** combined care-plan-and-meal-plan object — not two distinct artifacts. The SoP body v0.1 still describes Step 4 (care plan) and Step 5 (meal plan) as separate; that framing is superseded but the SoP body has not yet been reconciled. The combined artifact governs the participant's nutrition goals, counseling structure, and meal prescription for the duration of the pilot.

## Inputs to the authoring surface

- **Baseline assessment battery** — all six instruments (HFIAS, HEI / 24-hour recall, WHOQOL-HIV BREF, NKQ, PHQ9, 3-item anxiety) — surfaced as the seed context
- **Intake data** — demographics, medical history, current diet, prior care
- **Dietary preferences** — participant-stated food preferences, restrictions, dislikes
- **Cultural food preferences** — participant-stated cultural context (capture mechanism — free-text vs. structured taxonomy — pending platform spec)
- **Dietary requirements** — clinical requirements sourced from Dr. Wu per current draft

## Dr. Wu role on dietary requirements (NEEDS VANESSA CONFIRMATION)

The SoP body v0.1 line 46 carries an explicit `NEEDS VANESSA CONFIRMATION` placeholder on Dr. Wu's role here. The open question: does Dr. Wu **review** the dietary requirements before they seed the meal plan, or does Dr. Wu **approve** them? The distinction matters — a review pattern surfaces requirements as input; an approval pattern is a second attestation gate upstream of the RDN approval gate (fragment 03). Pending Vanessa.

For the diagram, Dr. Wu is annotated as `watches: dietary-requirements` — supervisor-of-record for that input — with the role marked as uncertain-tbd until Vanessa confirms whether watches is read-only or includes approval semantics.

## Where the artifact lives

The combined artifact is built **in Cena, not Athena**. Cena is the system of record for patient-experience data (the participant's nutrition goals, counseling structure, meal prescription); Athena remains the system of record for clinical orders and partner-side EHR continuity. Cross-system handoffs are a separate workflow.

## Authoring note (Cena-internal)

This fragment exercises:

- `type: action` — PROforma action primitive (work the RD performs)
- `x_cena_actor: human` + `x_cena_actor_role: registered-dietitian` — typed human actor
- `x_cena_watches: dr-wu` — supervisor-of-record on dietary requirements (uncertain-tbd — review-vs-approve role pending Vanessa)
- `x_cena_uncertainty: tbd` — Dr. Wu role, combined-artifact reconciliation, cultural-preference capture mechanism
