---
use_case: written-consent-execution
title: In-person IRB Written Consent Execution
owner: Marrero
status: DRAFT — clinical content pending Marrero + Healthcare Data Governance review
version: 0.1
created: 2026-06-03
description: At the Month 0 in-person visit, the Registered Dietitian executes IRB written consent with the participant. The signed paper form is handed to the Program Administrator the same day for digitization and Athena PDF storage. Consent execution is the hard prerequisite gate before any baseline assessment.
inventive_primitives_exercised:
  - attestation-gate
  - hand-off
sequence:
  - 01-trigger-month0-visit
  - 02-attestation-participant-signs-consent
  - 03-handoff-rd-to-administrator
  - 04-action-digitize-and-upload-to-athena
gaps:
  - Decline-to-sign path — no documented re-consent or reschedule procedure if the participant declines at the visit (catalog open question; structural gap)
  - PDF-landed verification — no explicit audit step confirms the digitized PDF reached the Athena patient record before downstream care-plan work proceeds (catalog open question; gap between RD's handoff and administrator's digitization)
  - Patient-consent attestor identity — the participant is the attestor; cf. clinical-actor attestation in escalation-phq9-positive, this is the only use case in the v0.1 catalog where the attestor is the patient (structural shape worth surfacing for the Friday session)
  - First-action specifics for decline-to-sign — what the RD does in the first 5 minutes when a participant declines pending Vanessa/Marrero (analogous to catalog #2 structural gap; not flagged in catalog open questions but inferred from gap pattern)
  - Digitization-to-upload SLA — same-day is named but no time-of-day deadline; pending Marrero / administrator SoP
  - Witness requirement — IRB-compliant written consent in some protocols requires a witness signature in addition to participant + executor; UConn IRB protocol specifics pending
parent_sop: registered-dietitian
also_referenced_by:
  - baseline-assessment
  - care-plan-creation
  - enrollment-onboarding
references:
  - Registered Dietitian SoP — Enrollment & Onboarding (parent SoP; Marrero-owned)
  - SOP Coverage Map — catalog workflow `wf_804a8e73-bfc`
  - Athena patient record storage convention (PDF on participant chart)
---

# In-person IRB written consent execution

## Summary

At the Month 0 in-person visit at the UConn site, the Registered Dietitian executes IRB-required written consent with the participant. The participant reviews and signs the paper consent form. The RD then hands the signed paper to the Program Administrator the same day, who digitizes it and uploads the resulting PDF to the participant's record in Athena.

Consent execution is a hard prerequisite gate: no baseline assessment may begin until consent has been signed. This use case is the procedural floor for everything downstream in the enrollment & onboarding workflow.

The use case exercises two of the four Cena-novel spec primitives:

- **attestation-gate** — the participant's written signature is the attestation; this is the only use case in the v0.1 catalog where the attestor is the patient (`x_cena_actor: patient`) rather than a clinician
- **hand-off** — cross-medium hand-off: paper signed by patient → administrator digitizes → Athena PDF (one workflow step crosses three media)

It does NOT exercise `escalation-route` (no clinical-severity routing — consent either happens or it doesn't) or `who-watches` as a separate annotation (the RD is both executor and effective supervisor at the visit; no separate observer role exists).

## Reading this use case

This is a Direction-D spec: each step is a markdown fragment with YAML frontmatter (the structured spec) + prose body (narrative for SoP rendering). The fragments are sequenced via this manifest. When rendered:

- **Diagram** — the manifest's sequence + each fragment's spec assembles into a flowchart via haven-ui's `diagram-graph` Layer 2 helper. Fragment types map to diagram-box variants; outgoing_edges map to diagram-arrow connectors; `x_cena_uncertainty` values map to box modifier classes.
- **SoP** — the manifest + each fragment's prose body assembles into the operational document for RD + Program Administrator reference, rendered via the existing surface-emit pipeline.

## Known gaps

This is a DRAFT. Clinical content requires Marrero + Healthcare Data Governance review before operational use. Two structural gaps surfaced in the catalog are first-class blockers:

1. **Decline-to-sign path** — the parent SoP does not specify what happens if the participant declines to sign at the visit. There is no documented re-consent procedure, no reschedule path, no termination-of-enrollment procedure. This is a structural absence flagged as `x_cena_uncertainty: gap`. An out-of-scope outgoing edge from the consent attestation routes to a terminal labeled "decline-or-reschedule (out of scope; structural gap)".
2. **PDF-landed verification** — no explicit audit step confirms the digitized PDF reached the Athena patient record. The handoff from administrator to Athena is fire-and-forget; the gap between "administrator received paper" and "Athena PDF exists on chart" is unaudited. Flagged as `x_cena_uncertainty: gap` on the upload step.

Per-step gaps are labeled in each fragment's frontmatter (`x_cena_uncertainty` and `gaps` fields) and surfaced inline in the prose so they survive the render to SoP.
