---
use_case: monthly-uconn-review-meeting
title: Monthly UConn program review meeting — prep and facilitation
owner: Vanessa Sena (current) → Dr. Marrero (post-launch)
status: DRAFT — no SoP draft yet; deferred post-launch per catalog. Operational content largely absent; this spec exists to surface the structural shape and labeled gaps.
version: 0.1
created: 2026-06-03
description: Cena prepares meeting materials and agenda for the monthly UConn program review, covering operational challenges, participant feedback themes, and protocol refinement opportunities (CQI). Catalog cap-48 (Exhibit B.h.i).
inventive_primitives_exercised:
  - hand-off
  - who-watches
sequence:
  - 01-trigger-monthly-cadence
  - 02-action-auto-generate-agenda
  - 03-action-customize-talking-points
  - 04-action-facilitate-meeting
  - 05-handoff-protocol-refinement-routing
gaps:
  - No SoP draft exists; deferred post-launch (catalog)
  - Transition cadence undefined — how many cycles Vanessa walks Marrero through before formal handoff is not specified
  - Ownership-transition gate has no defined attestation step (novel attestation shape — Vanessa attesting that Marrero is ready to assume ownership)
  - Meeting format (in-person vs virtual) unspecified
  - UConn-side attendee list unspecified
  - cap-9 satisfaction survey timing (Months 3, 6, 9) must integrate into meeting prep — data collection tool not finalized (UConn Qualtrics vs Cena tool open as of 2026-05-27)
  - Talking-points customization criteria undefined — what makes a dashboard-generated draft "ready" for facilitation
  - Post-meeting routing criteria undefined — what distinguishes a clinical refinement (Marrero) from an operational refinement (Vanessa)
  - BHN role resolution — Cena-staffed vs UConn-side clinical-team function unresolved (catalog #1 structural gap — surfaces here if a refinement touches clinical routing)
  - Dashboard data-element set (Exhibit F) pending Marinka + Andrey — what's actually IN the auto-generated agenda is not yet specified
parent_sop: monthly-reporting-and-review
also_referenced_by:
  - monthly-reports-cap-44-to-47
  - participant-satisfaction-surveys-cap-9
references:
  - SOP Coverage Map — catalog workflow `wf_804a8e73-bfc` cap-48
  - yesterday's UConn workflow-mapping artifact (Exhibit F data-elements list — pending Marinka + Andrey)
---

# Monthly UConn program review meeting — prep and facilitation

## Summary

Each month, after the cap-44 through cap-47 monthly reports complete, Cena prepares an agenda and materials for a program review meeting with UConn Health. The meeting is CQI (continuous quality improvement) oriented — operational challenges, participant feedback themes, and protocol refinement opportunities are the agenda anchors. (Research-blind constraint: outcome review is explicitly NOT the meeting's purpose.)

The use case exercises two Cena-novel spec primitives:

- **hand-off** — reports → meeting prep materials → Cena lead for facilitation → post-meeting routing of refinement proposals
- **who-watches** — the ownership-transition arc (Vanessa current → Marrero post-launch) names supervisor-of-record as a moving target across cycles

## Reading this use case

This is a Direction-D spec: each step is a markdown fragment with YAML frontmatter (the structured spec) + prose body (narrative for SoP rendering). The fragments are sequenced via this manifest. When rendered:

- **Diagram** — manifest sequence + each fragment's spec assembles into a flowchart via haven-ui's `diagram-graph` Layer 2 helper. Fragment types map to diagram-box variants; outgoing_edges map to diagram-arrow connectors; `x_cena_uncertainty` values map to box modifier classes.
- **SoP** — manifest + each fragment's prose body assembles into the operational document, rendered via the existing surface-emit pipeline (directive markdown → docx/HTML).

## Known gaps

This is the THINNEST catalog entry — the source records "no SoP draft; deferred post-launch." Most fragments carry `x_cena_uncertainty: gap` because the operational content does not yet exist. The structural shape (mostly hand-offs between humans and a system-produced agenda; a novel ownership-transition attestation arc with no defined gate) is the deliverable, not a polished SoP draft.

The spec's iteration mode is labeled uncertainty: each gap is surfaced in the fragment frontmatter (`x_cena_uncertainty` and `gaps` fields) AND inline in the prose, so it survives the SoP render as a visible blocker that reviewers (Vanessa, Marrero, UConn) must engage with.

Per the per-use-case authoring hint: this is the honest LABELED-UNCERTAINTY-AS-DELIVERABLE example — the discipline is to show the structure with the gaps marked, not invent content.
