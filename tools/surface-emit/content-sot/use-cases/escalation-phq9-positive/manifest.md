---
use_case: escalation-phq9-positive
title: PHQ9 Positive Response Escalation
owner: Marrero
status: DRAFT — clinical content pending Marrero + Healthcare Data Governance review
version: 0.1
created: 2026-06-03
description: When a patient's PHQ9 screening result triggers the same-day-escalation threshold, route to clinical lead for review and hand off to the Behavioral Health Network (BHN) partner for follow-up.
inventive_primitives_exercised:
  - attestation-gate
  - escalation-route
  - who-watches
  - hand-off
sequence:
  - 01-trigger-phq9-positive
  - 02-decision-severity-assessment
  - 03-attestation-clinical-lead-review
  - 04-handoff-to-bhn
  - 05-attestation-audit-record
gaps:
  - PHQ9 threshold for "positive" undetermined — pending HDG review (likely 10-15 per standard clinical guidance)
  - Severity tier definitions (red/yellow/green boundaries) — pending Marrero
  - Receiving actor identity for BHN handoff — pending partner protocol with UConn
  - Clinical-lead role assignment — pending Cena hire (Dr. Soto / Dr. Morales TBD; confirm with Vanessa)
  - SLA-on-receipt at each gate — pending Marrero clinical input
  - Question 9 (suicidal ideation) override behavior — pending Marrero
  - First-action specifics for safety-concern escalation — pending Vanessa/Marrero (catalog flagged as #2 critical structural gap; explicit [NEEDS VANESSA / MARRERO] placeholder in CC SoP line 51)
  - BHN role resolution — Cena-staffed vs UConn-side clinical-team function unresolved (catalog #1 structural gap — defined in planning workflows 02-clinical-care + 07-risk-management but absent from UConn SoP set)
  - C-SSRS (Columbia Suicide Severity Rating Scale) adoption — referenced in planning workflows as the secondary instrument for BHN handoff; not yet adopted into any UConn SoP; pending Marrero decision
parent_sop: care-coordinator
also_referenced_by:
  - care-plan-review
  - weekly-checkin
  - rd-recurring-assessment
references:
  - yesterday's UConn workflow-mapping artifact, sections 7c (PHQ9 thresholds) + 7g (Escalation folded or standalone)
  - SOP Coverage Map — catalog workflow `wf_804a8e73-bfc` locating
---

# Escalation: PHQ9 positive response → clinical lead + BHN

## Summary

When a patient completes their PHQ9 screening and the result meets or exceeds the configured threshold for same-day clinical attention, this use case routes the case to the Cena clinical lead for review and hands off to the Behavioral Health Network (BHN) partner for follow-up.

The use case exercises all four Cena-novel spec primitives:

- **attestation-gate** — clinical-lead sign-off before BHN handoff
- **escalation-route** — typed routing from agent detection to clinical lead, then to BHN
- **who-watches** — clinical-lead is the supervisor-of-record for the agent's classification step
- **hand-off** — case transition from Cena clinical lead to BHN partner with a defined package

## Reading this use case

This is a Direction-D spec: each step is a markdown fragment with YAML frontmatter (the structured spec) + prose body (narrative for SoP rendering). The fragments are sequenced via this manifest. When rendered:

- **Diagram** — the manifest's sequence + each fragment's spec assembles into a flowchart via haven-ui's `diagram-graph` Layer 2 helper. Fragment types map to diagram-box variants; outgoing_edges map to diagram-arrow connectors; `x_cena_uncertainty` values map to box modifier classes (TBD: `--uncertain-tbd`, `--uncertain-assumption`, `--uncertain-gap`); `x_cena_watches` maps to the supervisor annotation (TBD: `--has-watcher` modifier or `diagram-watcher-link`).
- **SoP** — the manifest + each fragment's prose body assembles into the operational document for Care Coordinator + BHN reference, rendered via the existing surface-emit pipeline (directive markdown → docx/HTML).

## Known gaps

This is a DRAFT. Clinical content requires Marrero + Healthcare Data Governance review before operational use. Specific per-step gaps are labeled in each fragment's frontmatter (`x_cena_uncertainty` and `gaps` fields) and surfaced inline in the prose so they survive the render to SoP.
