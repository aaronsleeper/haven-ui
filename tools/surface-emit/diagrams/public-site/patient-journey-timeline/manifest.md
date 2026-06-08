---
use_case: patient-journey-timeline
title: Patient Journey Timeline — Live Academic-Medical-Center HIV-Nutrition Program
owner: Cena Public Site (Phase 3a slice 1)
status: DRAFT — generic-AMC framing; strict-superset UConn-named upgrade pending Vanessa clearance
version: 0.1
created: 2026-06-08
description: Horizontal patient-journey timeline rendering of the live academic-medical-center HIV-nutrition program — 9 stages (Referral through Re-assessment) across 4 swim-lanes (Patient / Clinical staff / Cena substrate / Provenance artifact). The bottom provenance lane carries the audit-trail artifact written at each stage; this is the page's load-bearing legal/compliance read.
inventive_primitives_exercised:
  - swim-lane-timeline
  - provenance-as-swim-lane
  - partner-protagonist-clinical-lane
sequence:
  - 01-referral
  - 02-enrollment
  - 03-assessment
  - 04-care-plan
  - 05-ordering
  - 06-fulfillment
  - 07-adherence-check-ins
  - 08-outcome-capture
  - 09-re-assessment
gaps:
  - Per-stage substrate-action claims must hold under technical-evaluator scrutiny per reference-program.md §2 lens-specific notes; hedge any cell whose claim doesn't match current Spark + Ava shipped fidelity (HDG §8 watchlist applies — particularly stages 07 adherence-check-ins + 08 outcome-capture)
  - UConn-named upgrade — every cell that says "the program" inherits the generic-AMC framing; strict-superset edit when Vanessa clears (outstanding-partner-input.md item #1)
  - Visual-language calls deferred to Haven Visual Designer — lane background tints, substrate-uniformity register, provenance-lane treatment, stage-column-header treatment
parent_page: /reference-program
also_referenced_by:
  - /how-the-substrate-works/sample-audit-trail
  - /how-the-substrate-works/provenance-and-accountability
  - /how-the-substrate-works/integration
references:
  - Lab/cena-health-public-site/strategy/content/reference-program.md §2 — content brief locking the 9 stages × 4 lanes + voice register
  - Lab/cena-health-public-site/strategy/phase-2-information-architecture.md §7 — full partner-protagonist blueprint spec (load-bearing structural anchor)
  - Lab/cena-health-public-site/brand/voice.md §2 Reference program row — *blueprint voice* register
  - Lab/cena-health-public-site/strategy/phase-2-hdg-review-packet.md row 4 — partner-clinician phrasing for clinical-staff lane (non-negotiable)
  - Knowledge/Areas/Meta/Entities/cena-health/haven-diagram.md — diagram pipeline canonical definition; sibling rendered-diagram precedent at content-sot/use-cases/<slug>/
---

# Patient Journey Timeline: live AMC HIV-nutrition program (blueprint render)

## Summary

A horizontal swim-lane timeline depicting the 9-stage patient journey through the live academic-medical-center HIV-nutrition program running on Cena's substrate today. The timeline reads left-to-right by temporal stage (Referral → Re-assessment); each stage crosses four top-to-bottom actor lanes: the patient's action, the partner's clinical staff action, the Cena substrate's action, and the audit-trail artifact the substrate writes at that stage.

This diagram is the primary visual primitive of `/reference-program` per IA §7. Four-of-five decision-roles eventually read it: the clinical champion scans the clinical-staff lane to verify accountability stays partner-owned; the technical evaluator scans the substrate lane for connection topology; the financial steward scans the substrate lane for system-economics absorption; the legal/compliance reader scans the provenance lane end-to-end to verify a complete defensible trail. The shape itself is the differentiator from competitor case-study renderings — the four-lane structure is the structural answer to *"what makes Cena infrastructure rather than a wrapper."*

The diagram exercises three structural features:

- **swim-lane-timeline** — horizontal time axis × vertical actor lanes; multi-role read at a glance
- **provenance-as-swim-lane** — the audit-trail artifact gets its own first-class lane (not a footer annotation); each stage names the artifact written there
- **partner-protagonist-clinical-lane** — every clinical-action cell uses HDG row 4 partner-clinician phrasing (*"the partner's clinician approves,"* never *"Cena's clinical team"*); accountability stays partner-owned

## Reading this diagram

Direction-D spec: markdown fragments with YAML spec frontmatter + prose body, sequenced by this manifest. The diagram (visual) is the rendering of this same source.

Generic-AMC framing throughout — the diagram depicts *"the live academic-medical-center HIV-nutrition program"*; never names UConn before clearance lands. When Vanessa's red-line clearance lands per outstanding-partner-input.md item #1, the upgrade is a strict-superset edit — *"academic-medical-center"* → *"UConn Health's"* — with no other copy moving.

## Voice register

Documentation / artifact voice — no marketing inflection. Substrate-lane verbs are structural (*"writes the audit trail,"* *"captures the adherence signal,"* *"generates the recommendation for clinician approval,"* *"flags the re-assessment trigger"*) never service or vendor-flattery (*"delivers,"* *"empowers,"* *"orchestrates"*). Clinical-staff lane uses partner-possessive constructions per HDG row 4. Patient lane uses role language not identity language (*"patient enters via referral"* not *"member completes intake"*).

## Known gaps

This is a DRAFT v0.1 for the Phase 3a slice 1 v2 render verification. The generic-AMC framing ships at launch; the UConn-named upgrade is strict-superset when Vanessa clears. Per-stage substrate-action claims must hold under technical-evaluator scrutiny — the per-cell content here is the writer's first pass, deliberately conservative on substrate claims for cells 07 (adherence) and 08 (outcome) per HDG §8 watchlist. Hand-off to the Haven Visual Designer expert for visual-language calls (lane background tints, substrate-uniformity register, provenance-lane treatment, stage-column-header treatment); the brief deferred these by name in v1 and they remain deferred here.
