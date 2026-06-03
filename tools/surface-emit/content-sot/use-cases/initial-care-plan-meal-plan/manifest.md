---
use_case: initial-care-plan-meal-plan
title: Initial care plan + meal plan creation (combined artifact, Month 0)
owner: Marrero
status: DRAFT — clinical content pending Marrero + Healthcare Data Governance review; SoP body reconciliation pending Vanessa
version: 0.1
created: 2026-06-03
description: At the Month 0 in-person visit, the Registered Dietitian builds the participant's combined nutrition care plan and meal plan in Cena, seeded from intake data and the full baseline assessment set. Per Vanessa's 2026-06-02 decision, care plan and meal plan are ONE combined artifact (supersedes the two-distinct-artifacts framing in SoP body v0.1). On RDN approval the combined-artifact activates and triggers downstream meal prescription generation.
inventive_primitives_exercised:
  - attestation-gate
  - who-watches
  - hand-off
sequence:
  - 01-trigger-baselines-complete
  - 02-action-author-combined-care-plan-and-meal-plan
  - 03-attestation-rdn-approval
  - 04-handoff-to-meal-prescription
gaps:
  - Care plan and meal plan are ONE combined artifact (2026-06-02 Coverage Map update; SoP body not yet reconciled — body still describes Steps 4 and 5 as separate)
  - Dr. Wu role on dietary requirements — does Dr. Wu review or approve the dietary requirements that seed the meal plan? Open per 2026-06-02 session wrap-up; Vanessa owns the answer
  - SoP body and Coverage Map are inconsistent — body describes two steps (Step 4 = care plan, Step 5 = meal plan); Coverage Map says one combined artifact — SoP needs reconciliation pass
  - No RD-level care plan approval gate specified in the SoP — workflow-spec has a hardcoded RDN approval step at `planning/workflows/care-plan-creation/steps.md` but it is not surfaced in the SoP body as a named step for the RD reader (structural gap)
  - First-action specifics on entering the Month 0 visit — what the RD does in the first 5 minutes of the visit before opening the authoring surface — analogous to catalog #2 critical structural gap (escalation use case); pending Vanessa/Marrero
  - Meal-prescription downstream workflow definition — what runs on care plan activation is described as automatic but the downstream workflow contract is not authored in the RD SoP scope (deferred)
parent_sop: registered-dietitian
also_referenced_by:
  - rd-recurring-assessment
  - weekly-checkin
  - monthly-uconn-review-meeting
references:
  - SOP Coverage Map — catalog entries for initial care plan + initial meal plan (combined per 2026-06-02 Vanessa update)
  - Registered Dietitian SoP body v0.1 (Steps 4–5 — pending reconciliation to combined-artifact framing)
  - `planning/workflows/care-plan-creation/steps.md` — workflow-spec carrying the hardcoded RDN approval step
---

# Initial care plan + meal plan: combined-artifact creation at Month 0

## Summary

At the participant's Month 0 in-person visit, the Registered Dietitian (RD) builds the individualized nutrition care plan and meal plan as **one combined artifact** in the Cena platform, seeded from the participant's intake data and the full baseline assessment set (4 RD-administered + 2 CC-administered instruments). Per Vanessa's 2026-06-02 decision, care plan and meal plan are one object — not two — superseding the two-distinct-artifacts framing still present in the SoP body v0.1.

The combined artifact governs the participant's nutrition goals, counseling structure, and meal prescription for the duration of the pilot. On RDN approval, the artifact activates and triggers downstream meal-prescription generation as a hand-off to the meal-prescription workflow.

This use case exercises four of the Cena-novel spec primitives:

- **action** — the RD authors the combined artifact in Cena (typed action with the platform as supporting system)
- **attestation-gate** — RDN sign-off before the combined artifact activates (the gate exists in the workflow-spec but is **not** yet surfaced in the RD SoP — structural gap)
- **who-watches** — Dr. Wu is the supervisor-of-record for dietary requirements that seed the meal plan; **whether Dr. Wu reviews or approves** is pending Vanessa
- **hand-off** — care plan activation hands off to the downstream meal-prescription workflow

## Reading this use case

This is a Direction-D spec: each step is a markdown fragment with YAML frontmatter (the structured spec) + prose body (narrative for SoP rendering). The fragments are sequenced via this manifest. When rendered:

- **Diagram** — the manifest's sequence + each fragment's spec assembles into a flowchart via haven-ui's `diagram-graph` Layer 2 helper. Fragment types map to diagram-box variants; outgoing_edges map to diagram-arrow connectors; `x_cena_uncertainty` values map to box modifier classes; `x_cena_watches` maps to the supervisor annotation.
- **SoP** — the manifest + each fragment's prose body assembles into the operational document for the Registered Dietitian and the broader clinical team, rendered via the existing surface-emit pipeline (directive markdown → docx/HTML).

## Known gaps

This is a DRAFT. The combined-artifact decision (2026-06-02 per Vanessa) is recent enough that the SoP body still describes care plan and meal plan as two separate steps — the SoP body needs a reconciliation pass. The RDN approval gate is hardcoded in the workflow-spec but **does not appear as a named step in the RD SoP** — a structural gap in the documentation, not in the platform. Dr. Wu's role on dietary requirements is flagged `NEEDS VANESSA CONFIRMATION`.

Clinical content requires Marrero + Healthcare Data Governance review before operational use. Specific per-step gaps are labeled in each fragment's frontmatter (`x_cena_uncertainty` and `gaps` fields) and surfaced inline in the prose so they survive the render to SoP.
