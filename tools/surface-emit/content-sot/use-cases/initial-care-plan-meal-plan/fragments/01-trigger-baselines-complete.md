---
fragment_id: 01-trigger-baselines-complete
type: enquiry
x_cena_actor: agent
x_cena_actor_role: care-coordination-agent
x_cena_watches: clinical-lead
x_cena_uncertainty: tbd
trigger:
  source: baseline assessment battery completion + Month 0 in-person visit start
  fires_when: all 6 baseline instruments complete on participant record AND Month 0 visit is in-progress
gaps:
  - First-action specifics on entering the Month 0 visit — what the RD does in the first 5 minutes before opening the authoring surface — pending Vanessa/Marrero (analogous to catalog #2 first-action gap)
  - Whether the trigger fires automatically on baseline-completion or requires explicit RD confirmation at visit start — pending Vanessa
outgoing_edges:
  - to: 02-action-author-combined-care-plan-and-meal-plan
    type: default
    label: ready-to-author signal raised
---

# Trigger: Baseline assessment battery complete + Month 0 visit in progress

The Cena platform confirms that all six baseline instruments are complete on the participant's record and that the Month 0 in-person visit is in progress. When both conditions hold, the platform raises a ready-to-author signal that surfaces the combined-artifact authoring surface to the Registered Dietitian.

## Baseline instruments required (all six)

- **RD-administered (4):**
  - HFIAS (Household Food Insecurity Access Scale)
  - HEI / 24-hour dietary recall
  - WHOQOL-HIV BREF (quality-of-life instrument)
  - NKQ (Nutrition Knowledge Questionnaire)
- **CC-administered (2):**
  - PHQ9 (depression screening)
  - 3-item anxiety screening

## Trigger detail (TBD pending Vanessa)

- **Automatic vs. RD-confirmed firing:** whether the ready-to-author signal raises automatically the moment baselines are complete, or whether the RD explicitly confirms visit-start before the surface opens — pending Vanessa.
- **First-action specifics on visit start:** what the RD does in the first 5 minutes of the Month 0 visit before opening the authoring surface (greeting, consent re-confirmation, data sanity-check) is not specified in the SoP body. Analogous to the catalog #2 critical first-action gap in the Care Coordinator SoP — pending Vanessa/Marrero.

## Who watches

The clinical lead is the supervisor-of-record for the participant's baseline state. The RD authors against the baseline package; the clinical lead reviews aggregated baseline-to-care-plan transitions as part of weekly review (not per-case).

## Authoring note (Cena-internal — strip before SoP render)

This fragment exercises:

- `type: enquiry` — PROforma enquiry primitive (gate condition test)
- `x_cena_actor: agent` — automated readiness detection by the platform
- `x_cena_watches: clinical-lead` — human supervisor of record for baseline integrity
- `x_cena_uncertainty: tbd` — automatic-vs-confirmed and first-action specifics pending
