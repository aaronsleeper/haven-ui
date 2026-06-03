---
use_case: weekly-checkin-call
title: Weekly check-in call (CC routine)
owner: Marrero
status: DRAFT — clinical content pending Marrero + Healthcare Data Governance review
version: 0.1
created: 2026-06-03
description: Care Coordinator initiates a 10–15 minute weekly check-in from the patient profile by participant-preferred channel (phone or text), covering order support, adherence, and barriers to participation, then captures and logs the outcome — with a yellow-flag escalation route to the UConn clinical team when concerns surface.
inventive_primitives_exercised:
  - escalation-route
  - who-watches
  - hand-off
sequence:
  - 01-trigger-roster-top
  - 02-decision-channel-selection
  - 03-enquiry-checkin-call
  - 04-decision-outcome-classification
  - 05-action-log-outcome
  - 06-handoff-yellow-flag-escalation
  - 07-action-schedule-followup
gaps:
  - CC weekly-check-in do/don't guidance (service-provider-not-friend posture) added 2026-06-02 but contingent on Dr. Wu script and data-goals draft for cap-25 — content not yet authored
  - Cap-26 multi-modal contact protocol not yet drafted — which channels, when to switch, what counts as a successful contact attempt across modalities is undefined in current SoP
  - Outcome-classification 5-way enum (successful / voicemail / no answer / refused / deferred) boundary semantics — pending Marrero confirmation (e.g., what counts as "deferred" vs. "no answer" when patient reschedules mid-call)
  - Yellow-flag criteria — pending Marrero (which barriers or concerns warrant escalation vs. log-and-monitor)
  - SLA for yellow-flag escalation to UConn clinical team — pending UConn partner protocol
  - Next-touch cadence rules — fixed weekly vs. tier-by-barrier-severity vs. clinical-lead-set — pending Marrero
  - BHN role unresolved — Cena-staffed vs UConn-side clinical-team function (catalog #1 structural gap; same shared gap as escalation-phq9-positive; yellow-flag handoff target is "UConn clinical team" by current SoP language but BHN-function distinction is not specified)
  - First-action specifics on yellow-flag escalation — pending Vanessa/Marrero (catalog #2 critical structural gap; what the CC does in the first 5 minutes after a yellow flag is undefined)
  - Channel preference data source — is the saved-preference field in the patient profile already populated at enrollment, or set during first contact? Pending compliance + enrollment SoP cross-reference
  - Channel-switch rules — if first channel fails (phone unanswered → text? wait and retry phone?) — pending cap-26 multi-modal protocol
parent_sop: care-coordinator
also_referenced_by:
  - escalation-phq9-positive
  - rd-recurring-assessment
  - monthly-uconn-review-meeting
references:
  - Care Coordinator SoP draft (parent SoP for this use case)
  - SOP Coverage Map — catalog workflow entry for weekly-checkin-call
  - Shared yellow-flag → UConn clinical team edge with escalation-phq9-positive and phq9-administration use cases
---

# Weekly check-in: Care Coordinator routine call

## Summary

The Care Coordinator opens the patient profile, identifies the participant at the top of the roster by days-since-last-contact, selects the participant's preferred channel (phone or text), and runs a 10–15 minute check-in covering order support, adherence, and barriers to participation. The CC classifies the contact outcome (successful / voicemail / no answer / refused / deferred), logs the outcome with structured fields, and sets a next-touch plan. If a concern surfaces during the call that meets yellow-flag criteria, the case escalates to the UConn clinical team via the shared escalation-route edge — no deferral to the next scheduled check-in.

This is the most operationally load-bearing use case in the Cena workflow batch — run hundreds of times across the 26 intervention weeks. The use case exercises three of the four Cena-novel spec primitives:

- **escalation-route** — typed routing from CC enquiry to UConn clinical team when a yellow flag surfaces
- **who-watches** — clinical-lead is the supervisor-of-record for any yellow-flag-eligible step
- **hand-off** — case transition from CC to UConn clinical team with a defined package when a yellow flag fires

Attestation-gate is not exercised here — the routine check-in does not require a named human signature mid-flow. Yellow-flag escalations route to the receiving clinical team, who run their own attestation-gated procedures (covered in escalation-phq9-positive and related use cases).

## Reading this use case

This is a Direction-D spec: each step is a markdown fragment with YAML frontmatter (the structured spec) + prose body (narrative for SoP rendering). The fragments are sequenced via this manifest. When rendered:

- **Diagram** — the manifest's sequence + each fragment's spec assembles into a flowchart via haven-ui's `diagram-graph` Layer 2 helper. Fragment types map to diagram-box variants; outgoing_edges map to diagram-arrow connectors; `x_cena_uncertainty` values map to box modifier classes; `x_cena_watches` maps to the supervisor annotation.
- **SoP** — the manifest + each fragment's prose body assembles into the operational document for Care Coordinator reference, rendered via the existing surface-emit pipeline (directive markdown → docx/HTML).

## Known gaps

This is a DRAFT. Clinical content requires Marrero + Healthcare Data Governance review before operational use. Two structural gaps are carried forward from the catalog and are shared with escalation-phq9-positive:

- **BHN role unresolved** (catalog #1) — whether the "UConn clinical team" yellow-flag receiver is a Cena-staffed BHN function or a UConn-side clinical function is unresolved. The shared escalation-route edge inherits this gap.
- **First-action specifics** (catalog #2) — what the CC does in the first 5 minutes after a yellow flag fires is undefined; the Care Coordinator SoP carries an explicit `[NEEDS VANESSA / MARRERO]` placeholder.

In addition, two use-case-specific structural gaps block operational deployment:

- **Cap-26 multi-modal contact protocol** — undefined; channels, switch rules, and successful-contact-attempt semantics across modalities are not authored.
- **Cap-25 CC do/don't guidance** — contingent on Dr. Wu script and data-goals draft; not yet authored.

Specific per-step gaps are labeled in each fragment's frontmatter (`x_cena_uncertainty` and `gaps` fields) and surfaced inline in the prose so they survive the render to SoP.
