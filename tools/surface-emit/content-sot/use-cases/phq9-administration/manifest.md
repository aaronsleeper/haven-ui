---
use_case: phq9-administration
title: PHQ9 Administration at Baseline and Repeat Screenings
owner: Marrero
status: DRAFT — clinical content pending Marrero + Healthcare Data Governance review
version: 0.1
created: 2026-06-03
description: A CITI-trained Care Coordinator administers the PHQ9 depression screening at baseline (in-person first visit) and at program repeat-screening milestones. The CC captures the result on the Cena platform; the agent checks the result against the protocol threshold; positive responses route same-day to the escalation use case while sub-threshold scores are stored for longitudinal monitoring.
inventive_primitives_exercised:
  - escalation-route
  - who-watches
  - hand-off
sequence:
  - 01-trigger-screening-milestone
  - 02-action-cc-administers-phq9
  - 03-enquiry-score-captured
  - 04-decision-threshold-check
  - 05-handoff-to-escalation-or-monitoring
gaps:
  - PHQ9 admin UI build state in Care-coordinator app is unconfirmed — [CONFIRM build state] tag in current SoP draft (catalog open question #1)
  - PHQ9 positive-response score thresholds under CT scope-of-practice are explicitly pending Healthcare Data Governance review (catalog open question #2)
  - Cap reference for mental-health screening is pending — flagged for Aaron reconciliation against the SOP Coverage Map cap inventory (catalog open question #3)
  - Escalation action specifics for a positive PHQ9 during a remote check-in (vs. in-person baseline) are not addressed (catalog open question #4)
  - Scope-of-practice for CC administration under CT licensure is pending Healthcare Data Governance confirmation; until confirmed, the CC follows UConn PI guidance for any positive-response handling
  - Remote-check-in PHQ9 administration channel (Cena platform self-administered? CC-administered over video?) — pending Marrero
  - First-action specifics for a CC handling a positive response when escalation-route fires during a remote check-in pending Vanessa/Marrero (catalog #2 structural gap)
  - BHN role unresolved — Cena-staffed vs UConn-side clinical-team function (catalog #1 structural gap — defined in planning workflows 02-clinical-care + 07-risk-management but absent from UConn SoP set); inherited from downstream escalation use case
parent_sop: care-coordinator
also_referenced_by:
  - escalation-phq9-positive
  - weekly-checkin
  - rd-recurring-assessment
references:
  - Care Coordinator SoP — PHQ9 administration section + [CONFIRM build state] tag
  - SOP Coverage Map — catalog workflow `wf_804a8e73-bfc` enumeration; phq9-administration row identified as P0 alongside escalation-phq9-positive
  - escalation-phq9-positive use case — this use case produces the trigger that escalation consumes; the terminal edge of administration is the entry edge of escalation
---

# PHQ9 administration: baseline + repeat screenings (CITI-trained CC scope)

## Summary

A CITI-trained Care Coordinator administers the PHQ9 depression screening to the patient at two trigger milestones: (1) the baseline visit, in-person and alongside the dietitian's initial assessments, and (2) program repeat-screening milestones per the IRB protocol schedule. The CC captures the result on the Cena assessment-forms platform. The agent checks the captured score against the protocol threshold. Positive responses route same-day to the escalation use case (`escalation-phq9-positive`); sub-threshold scores route to the patient record for longitudinal monitoring by the clinical team.

This use case is **upstream of `escalation-phq9-positive`** — its terminal edge produces the trigger that the escalation use case consumes. Escalation content is not duplicated here; the downstream edge references the sibling use case.

The use case exercises four spec primitives:

- **enquiry** — the CC administers the questionnaire to the patient (PROforma enquiry)
- **decision** — threshold check against protocol-defined positive cut-off
- **escalation-route** — positive result routes same-day to the escalation use case
- **who-watches** — UConn PI is supervisor-of-record for the CC's scope-of-practice on PHQ9 administration until CT licensure is confirmed (partner-as-watcher case)

## Reading this use case

Direction-D spec: markdown fragments with YAML spec frontmatter + prose body. The manifest sequences the fragments; both the diagram (visual) and the SoP (operational document) are renderings of this same source.

The notable structural feature is the **partner-as-watcher annotation** on the administration step. The UConn PI sits in the PARTNER lane but does not produce a step in the workflow — the PI watches the CC's scope-of-practice. This is the first use case in the catalog where `x_cena_watches` points to a partner-organization actor rather than to a Cena-staffed clinical role.

## Known gaps

This is a DRAFT. Per the catalog brief, four open questions/gaps are explicitly flagged in the SoP source, plus inherited gaps from the downstream escalation use case (BHN role, first-action specifics for a positive-response handler). Specific per-step gaps are labeled in each fragment's frontmatter and surfaced inline in the prose so they survive the render to SoP.
