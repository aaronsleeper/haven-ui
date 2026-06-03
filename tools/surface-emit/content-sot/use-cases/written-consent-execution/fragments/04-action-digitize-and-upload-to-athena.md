---
fragment_id: 04-action-digitize-and-upload-to-athena
type: action
x_cena_actor: human
x_cena_actor_role: program-administrator
x_cena_uncertainty: gap
action:
  performer_role: program-administrator
  steps:
    - scan or photograph the signed paper form (full pages; both sides if double-sided)
    - assemble single PDF (one document per participant per consent execution)
    - locate participant record in Athena by MRN / name match
    - upload PDF to participant chart under the IRB-consent document category
    - file or destroy paper original per UConn IRB retention policy
  system_actor: Athena (EHR; PDF storage on participant chart)
  output: PDF stored on participant Athena record under IRB-consent document category
gaps:
  - PDF-landed verification — no explicit audit step confirms the PDF reached the Athena participant record before downstream care-plan work proceeds (catalog open question; structural gap between RD's handoff and administrator's digitization)
  - Same-day SLA — same-day is named but no time-of-day deadline; pending Marrero
  - Paper retention policy — file vs. destroy after digitization, retention window, IRB-required physical-copy preservation (pending UConn IRB)
  - Athena document category — exact category / template for IRB-consent (pending Athena configuration review)
  - Failed upload recovery — what happens if Athena is unavailable or the upload fails (pending administrator SoP)
outgoing_edges:
  - to: terminal-consent-on-record
    type: action-complete
    condition: PDF visible on participant Athena record
    label: PDF on chart → consent-on-record
---

# Action: Digitize signed paper consent and upload to Athena

The Program Administrator digitizes the signed paper consent form and uploads the resulting PDF to the participant's record in Athena. This completes the cross-medium chain: paper attestation → PDF → system-of-record.

## Steps

1. **Scan or photograph the signed paper form.** All pages, both sides if double-sided. Single document per participant per consent execution.
2. **Assemble single PDF.** Combine scan/photo pages into one PDF file; verify legibility (especially signature and date fields).
3. **Locate participant record in Athena.** Match by MRN if available; fall back to name + DOB if MRN is missing.
4. **Upload PDF to participant chart.** File under the IRB-consent document category (exact Athena category pending configuration review).
5. **File or destroy paper original.** Per UConn IRB retention policy (pending).

## System actor — Athena

Athena is the system-of-record for participant records. The PDF stored on the participant chart is the digital evidence of consent. Once uploaded:

- Downstream workflows (care plan creation, baseline assessment) can query Athena for the consent record
- IRB audit trails reference the Athena PDF as the consent evidence
- Original paper retention is governed by UConn IRB policy

## PDF-landed verification — structural gap

There is no explicit audit step that confirms the digitized PDF reached the Athena participant record before downstream care-plan work proceeds. The gap shape:

- Administrator scans and uploads (the action above)
- No automated check confirms the upload succeeded
- No automated check confirms the PDF is filed under the correct document category on the correct participant record
- Downstream workflows assume the consent record is present without verifying

The risk: a failed upload (Athena unavailable, wrong patient match, miscategorized document) could allow baseline assessment to proceed against a participant whose consent is not actually on record. This is flagged as `x_cena_uncertainty: gap` for the Friday session.

The desirable resolution is an attestation-style verification fragment between this action and downstream care-plan work: a system or human confirmation that the PDF is on the chart. That fragment does not exist in the current SoP and is out of scope for v0.1.

## Open questions

- **Same-day SLA** — what time-of-day deadline applies to "same-day digitization"
- **Paper retention policy** — file vs. destroy after digitization; retention window if filed; IRB-required physical-copy preservation
- **Athena document category** — exact category / template under which the IRB-consent PDF is filed
- **Failed-upload recovery** — what the administrator does if Athena is unavailable or the upload fails
- **PDF-landed verification step** — where the audit-confirmation step belongs in the chain (administrator self-check? automated query? downstream workflow precondition?)

## Authoring note (Cena-internal)

This fragment exercises:

- `type: action` — execution step (not a gate, not a hand-off)
- `x_cena_actor: human` + `x_cena_actor_role: program-administrator` + `action.system_actor: Athena` — human-operated action against a system actor (the system is acted upon, not the performer)
- `x_cena_uncertainty: gap` — the PDF-landed verification gap is the most structurally interesting feature of this fragment; surfaces a missing attestation-style verification fragment in the source SoP
