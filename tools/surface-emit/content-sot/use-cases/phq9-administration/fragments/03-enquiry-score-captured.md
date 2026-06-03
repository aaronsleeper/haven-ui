---
fragment_id: 03-enquiry-score-captured
type: enquiry
x_cena_actor: system
x_cena_actor_role: cena-platform-assessment-forms
x_cena_uncertainty: resolved
enquiry:
  records:
    - total_score: integer (PHQ9 standard 0–27)
    - per_item_responses: array of 9 integer scores (0–3 each)
    - administration_metadata: { administered_by: care-coordinator-id, administered_at: timestamp, channel: enum [in-person, remote], visit_context: enum [baseline, repeat-screening] }
  storage_target: participant record (assessment-results subcollection)
  visibility: care-coordinator (assigned), clinical team (longitudinal review), agent (downstream threshold check)
gaps: []
outgoing_edges:
  - to: 04-decision-threshold-check
    type: default
    label: score saved → threshold check
---

# Enquiry: Score captured to participant record

The Cena assessment-forms platform records the captured PHQ9 result on the participant record. This is the structured enquiry step — the platform persists the score, per-item responses, and administration metadata so that downstream steps (threshold check, longitudinal monitoring, clinical-team review) can operate on the same canonical record.

## What is captured

- **Total score** — integer 0–27 (PHQ9 standard scoring)
- **Per-item responses** — array of 9 integer scores (0–3 each), to support answer-pattern analysis at downstream decision-time
- **Administration metadata** — who administered, when, on what channel (in-person vs. remote), in what visit context (baseline vs. repeat-screening)

## Storage target

The captured result is written to the participant's assessment-results subcollection. The record is immediately:

- Available to the agent for the downstream threshold check (fragment 04)
- Available to the clinical team for longitudinal review (comparing scores across the patient's screening history)
- Visible to the CC who administered it (for their own confirmation)

## Why a separate enquiry step

Capturing the result on the platform record is structurally separate from the CC's administration action because **the canonical score-of-record is the platform-stored value**, not the form-filled paper or tablet. Any downstream reasoning — threshold check, longitudinal comparison, audit — references the platform record, not the source artifact. This makes the system-of-record explicit.

## Authoring note (Cena-internal — strip before SoP render)

This fragment exercises:

- `type: enquiry` — structured information capture (PROforma enquiry)
- `x_cena_actor: system` — the Cena platform is the actor; this step is automated on save
- `x_cena_uncertainty: resolved` — well-defined storage shape; no clinical TBDs
- The `enquiry.records` block in frontmatter is the **canonical-record contract** for the PHQ9 result; future use cases that consume PHQ9 history (longitudinal monitoring, escalation case context) read from this shape
