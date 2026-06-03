---
fragment_id: 02-action-cc-administers-phq9
type: action
x_cena_actor: human
x_cena_actor_role: care-coordinator
x_cena_watches: uconn-pi
x_cena_uncertainty: tbd
action:
  description: The CITI-trained Care Coordinator administers the PHQ9 via the Cena assessment-forms platform. The patient completes the questionnaire; the CC captures and saves the result on the participant record.
  scope_of_practice:
    role_authorization: CITI-trained CC scope per IRB protocol
    excluded_roles: [registered-dietitian, uconn-student-researcher]
    licensure_status: PENDING — CT licensure for CC administration is pending Healthcare Data Governance confirmation; until confirmed, follow PI guidance for any positive-response handling
  channel:
    in_person: standard for baseline visits — paper-or-tablet PHQ9 form filled with patient on-site
    remote: PENDING Marrero — channel (self-administered via Cena platform vs. CC-administered over video) and CC-supervision contract not yet specified for repeat-screening remote visits
gaps:
  - PHQ9 admin UI build state in Care-coordinator app is unconfirmed — [CONFIRM build state] tag in current SoP draft (catalog open question #1)
  - Scope-of-practice for CC administration under CT licensure is pending Healthcare Data Governance confirmation
  - Cap reference for mental-health screening is pending — flagged for Aaron reconciliation against the SOP Coverage Map cap inventory
  - Remote-check-in PHQ9 administration channel is not specified — pending Marrero
outgoing_edges:
  - to: 03-enquiry-score-captured
    type: default
    label: questionnaire complete → result captured
---

# Action: CC administers the PHQ9

The CITI-trained Care Coordinator administers the PHQ9 to the patient using the Cena assessment-forms platform. The patient completes the questionnaire; the CC captures and saves the result on the participant record. The agent then takes the captured result through the threshold check.

## Scope of practice (PENDING — Healthcare Data Governance)

Administration of the PHQ9 is **scoped to the CITI-trained CC** by the IRB protocol. The registered dietitian and UConn student researchers are not authorized to administer it.

CT licensure for the CC to administer the PHQ9 under CT scope-of-practice rules is **pending Healthcare Data Governance confirmation.** Until licensure is confirmed:

- The CC may administer the PHQ9 under PI oversight
- Any positive-response handling follows PI guidance, not autonomous CC action
- The UConn PI is supervisor-of-record for the CC's scope on this step (see Who watches below)

## Administration channel

- **Baseline (in-person).** PHQ9 is administered alongside the dietitian's initial assessments at the first in-person visit. CC is on-site; patient completes the form on paper or tablet; CC captures the saved result on the Cena platform.
- **Repeat-screening (remote — PENDING).** Per the catalog, escalation action specifics for a positive PHQ9 during a remote check-in are not yet addressed. Channel selection (self-administered via Cena platform vs. CC-administered over video) and the CC-supervision contract for the remote channel are pending Marrero. The administration step shape (questionnaire → score capture) holds; what differs is who is in the room and how the CC responds when a result lands as positive on a remote channel.

## Cena platform behavior

The Cena assessment-forms system hosts the PHQ9 administration UI. Build state of the PHQ9 admin UI in the Care-coordinator app is **unconfirmed** per the SoP draft (catalog flagged as [CONFIRM build state]). The platform records and stores the depression-screening score on the participant record at fragment 03.

## Who watches

The **UConn PI** is supervisor-of-record for this step. This is a **partner-as-watcher** annotation — the UConn PI sits in the PARTNER lane and provides oversight on the CITI-trained CC's scope-of-practice on PHQ9 administration. The PI is not a step actor (the PI does not administer the screening) but provides scope-of-practice oversight until CT licensure for CC administration is confirmed.

## Authoring note (Cena-internal — strip before SoP render)

This fragment exercises:

- `type: action` — PROforma action primitive (the administration is the discrete operational act)
- `x_cena_actor: human` — CITI-trained CC operates the screening
- `x_cena_watches: uconn-pi` — partner-as-watcher; the supervisor-of-record sits in a partner organization, not the Cena-staffed clinical team
- `x_cena_uncertainty: tbd` — UI build state + CT licensure + remote channel are pending
- The `scope_of_practice` block in the frontmatter encodes the role-authorization contract; future fragments that touch CC-administered assessments can reference this shape
