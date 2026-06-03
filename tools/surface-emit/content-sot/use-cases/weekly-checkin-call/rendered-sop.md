---
title: Weekly check-in call — the routine Care Coordinator touch
role: Care Coordinator
type: Standard Operating Procedure
version: "0.1 (draft)"
status: draft
reviewed: 2026-06
accountable: Director of Clinical Operations
slug: weekly-checkin-call
---

:::callout-warning
**DRAFT** — clinical content pending Marrero + Healthcare Data Governance review. Do not use operationally. This document is rendered from the use-case spec at `use-cases/weekly-checkin-call/`; corrections land in the source fragments, not in this rendered output.
:::

## Who this is for and what it covers

| For | Care coordinators conducting routine weekly check-in calls with participants during the 26-week intervention window. |
|---|---|
| Covers | Roster-top trigger through outcome logging, with the yellow-flag escalation route to the UConn clinical team. |
| Does not cover | Onboarding contact (separate procedure); enrollment first-contact (separate procedure); RD recurring assessment (separate procedure); the receiving-team's intake and follow-up after a yellow-flag hand-off (separate procedure). |

## When the routine fires

1. **A participant surfaces at the top of the roster.** The patient profile surface sorts participants by days-since-last-contact; the participant at the top is the next routine touch.

   The roster sort is deterministic — the CC does not manually select who to call. Participants are touched once per intervention week across the 26-week window.

2. **The CC selects the channel per saved preference.** The patient profile carries a saved channel preference field (phone or text). The CC initiates the check-in on the saved channel.

   :::callout-warning
   **Channel-switch protocol pending cap-26.** If the preferred channel fails (phone unanswered, text bounces, participant unreachable), the protocol for switching channels and what counts as a successful contact attempt across modalities is not yet authored. The cap-26 multi-modal contact protocol is a structural gap blocking operational deployment.
   :::

3. **The CC conducts the 10–15 minute check-in.** The call covers three scope areas: order support (delivery confirmation, troubleshooting), adherence (participant-reported adherence to the meal plan, barriers), and barriers to participation (wraparound needs, life circumstances, platform issues).

   The CC's posture during the call is **service provider, not friend** — the routine surfaces participant state, captures structured fields, and routes concerns. The cap-25 do/don't guidance operationalizing this posture is contingent on the Dr. Wu script and data-goals draft; **the posture is named but not yet authored as operational guidance.**

   :::callout-warning
   **Cap-25 CC do/don't guidance pending Dr. Wu script + data-goals draft.** The service-provider-not-friend posture is named in current SoP but operational specifics (what to say, what to avoid, how to redirect a friendly drift, per-scope-area script content) are not yet authored.
   :::

4. **The CC classifies the contact outcome.** The 5-way enum determines the next routing.

   :::decision-branch
   **Successful (no yellow flag).** Contact completed, scope areas covered, no concern surfaced warranting escalation → routes to log outcome + next-touch.

   **Successful (yellow flag).** Contact completed AND a concern surfaced meeting yellow-flag criteria → routes to escalation to the UConn clinical team. **Yellow-flag routing takes precedence over routine logging — there is no deferral to next week's touch.**

   **Voicemail.** Call reached voicemail; CC left a structured message → routes to follow-up retry scheduling.

   **No answer.** Call did not connect → routes to follow-up retry scheduling.

   **Refused.** Participant declined to engage → routes to follow-up retry scheduling AND flags case for clinical-lead review.

   **Deferred.** Participant requested to reschedule the check-in → routes to follow-up retry scheduling at the participant-requested time.
   :::

   :::callout-warning
   **Yellow-flag criteria pending Marrero.** Which barriers or concerns surfaced during the call warrant a yellow-flag escalation versus log-and-monitor is the primary clinical-policy question for the outcome decision and is undefined in the current SoP. **5-way enum boundary semantics also pending** — when an unanswered call counts as voicemail vs. no answer, when a rescheduled mid-call counts as deferred vs. successful with next-touch.
   :::

5. **On successful outcome (no yellow flag), the CC logs structured outcome fields and sets the next-touch plan.** The patient profile surfaces structured fields for contact outcome, adherence rating, barriers surfaced, wraparound needs, satisfaction signal, and free-text note. The next-touch is set per the routine cadence (default +7 days; tier-by-barrier-severity adjustment pending Marrero).

   :::callout-warning
   **Structured-field schema pending Marrero + platform spec.** Specific fields surfaced for CC entry are not yet finalized. Next-touch cadence rules — fixed weekly vs. adjusted by barrier severity vs. clinical-lead-set — pending Marrero.
   :::

6. **On yellow-flag outcome, the CC routes the case to the UConn clinical team.** The hand-off package contains patient identity, check-in call summary, structured outcome, concern detail (free-text narrative of what surfaced and why CC classified as yellow flag), current care plan summary, prior check-in history, and patient contact preferences.

   :::callout-error
   **First-action specifics pending Vanessa + Marrero — same critical structural gap as the PHQ9 escalation use case.** What the CC does in the first 5 minutes after firing a yellow flag is undefined: does the CC stay on the line, end the call and transmit asynchronously, schedule a same-day callback, bridge the clinical team into a live text thread? The Care Coordinator SoP carries an explicit `[NEEDS VANESSA / MARRERO]` placeholder. Resolution unblocks both this use case and PHQ9 escalation.
   :::

   :::callout-warning
   **Receiving-actor identity unresolved.** Whether the receiving team is a UConn-side clinical team member or a Cena-staffed BHN function is pending UConn partner protocol. The hand-off transport (secure messaging API via Athena CommonWell, fax fallback) is also pending. **This is the same structural gap as escalation-phq9-positive** — resolution applies to both use cases.
   :::

7. **On voicemail, no-answer, refused, or deferred outcome, the CC schedules a follow-up retry.** The retry is scheduled per the cap-26 multi-modal contact protocol. Refused outcomes additionally flag the case for clinical-lead review (immediate vs. accumulated-pattern threshold pending Marrero).

   :::callout-warning
   **Cap-26 multi-modal contact protocol entirely undefined.** Retry cadence, channel-switch rules, what counts as a successful contact attempt across modalities, and the retry-attempt allowance per week before clinical-lead escalation — all pending. This is a structural gap blocking operational deployment.
   :::

## Hand-off package — what ships on yellow flag

::: card

::: card-title
Yellow-flag hand-off package contents
:::

::: card-body
- Patient identity package (name, DOB, contact information, MRN if applicable)
- Check-in call summary (date, channel, duration, scope areas covered)
- Structured outcome (yellow-flag classification, barrier categories, adherence rating)
- Concern detail (free-text narrative of what surfaced and the CC's rationale for the yellow-flag classification)
- Current care plan summary (diet, recent vitals, current medications)
- Prior check-in history (recent-weeks trend for clinical context)
- Patient contact preferences (preferred channel, preferred window for clinical-team follow-up)
:::

:::

:::callout-warning
**Same hand-off package and transport as PHQ9 escalation.** Identity-resolution and transport gaps resolve once for both use cases.
:::

## Escalation — when this routes elsewhere

::: escalation
**If a yellow flag fires during the call** — the case escalates to the UConn clinical team in the same operational window. There is no deferral to next week's routine touch. First-action specifics in the first 5 minutes after the flag fires are pending Vanessa + Marrero.

**If the UConn clinical team does not acknowledge within their SLA** — the case re-routes to the Cena clinical lead via paging. Partner-side SLA is pending UConn protocol.

**If the contact is refused** — the case routes to follow-up retry scheduling AND flags the case for clinical-lead review. Whether the review fires immediately on a single refusal or accumulates (e.g., 2 consecutive refusals) is pending Marrero.

**If the retry-attempt allowance is exceeded** — the case routes to the clinical-lead review queue. Allowance value pending Marrero.
:::

## Each call — the checklist

::: card

::: card-title
Per-call checklist
:::

::: card-body
- [ ] Participant surfaced at top of roster (days-since-last-contact sort)
- [ ] Channel preference read from patient profile
- [ ] Contact initiated on preferred channel
- [ ] All three scope areas attempted (order support / adherence / barriers)
- [ ] Service-provider-not-friend posture maintained (pending cap-25 guidance)
- [ ] Contact outcome classified per 5-way enum
- [ ] Yellow-flag overlay evaluated independently of contact-outcome classification
- [ ] On successful (no yellow flag) — structured outcome fields logged and next-touch set
- [ ] On yellow flag — hand-off package transmitted to UConn clinical team via configured transport
- [ ] On yellow flag — ack received within SLA (or timeout escalation fired to clinical lead)
- [ ] On voicemail / no answer / refused / deferred — follow-up retry scheduled per cap-26
- [ ] On refused — case flagged for clinical-lead review
:::

:::

## Terms used here

:::glossary-term
Roster
:::

:::glossary-def
The Care Coordinator's view of participants sorted by days-since-last-contact. The participant at the top is the next routine touch. Sort is deterministic — the CC does not manually select who to call.
:::

:::glossary-term
Yellow flag
:::

:::glossary-def
A classification overlay on a contact outcome marking that a concern surfaced during the check-in warranting same-day escalation to the receiving clinical team rather than deferral to next week's routine touch. Specific yellow-flag criteria are pending Marrero. Routes via the same escalation edge shared with PHQ9-positive responses.
:::

:::glossary-term
BHN
:::

:::glossary-def
Behavioral Health Network — the partner clinical team that receives escalated cases for behavioral health follow-up. Whether BHN is a Cena-staffed role or a UConn-side function is unresolved as of this draft. Same definition as the PHQ9 escalation use case; resolution applies to both.
:::

:::glossary-term
Chain of custody
:::

:::glossary-def
The sequenced, hashed record of every action taken on a case — from the trigger event through every attestation gate, hand-off, and acknowledgment. Allows the case history to be reconstructed deterministically for audit or regulatory review.
:::

:::glossary-term
Cap-25
:::

:::glossary-def
A capability slot in the SOP Coverage Map representing the CC do/don't guidance (service-provider-not-friend posture) for the weekly check-in. Content is contingent on the Dr. Wu script and data-goals draft and is not yet authored. Cap-25 is a structural gap blocking operational deployment of the routine.
:::

:::glossary-term
Cap-26
:::

:::glossary-def
A capability slot in the SOP Coverage Map representing the multi-modal contact protocol — which channels are supported, when to switch between them, what counts as a successful contact attempt across modalities, retry cadence, and attempt allowance. Cap-26 is undefined and is a structural gap blocking operational deployment.
:::

## Not yet approved — gates remaining

::: attestation

This procedure is a DRAFT. Three approval gates remain before operational use.

::: attestation-gate
**Clinically accurate** — pending clinical lead (Cena hire TBD; coordinate with Vanessa)
:::

::: attestation-gate
**Operationally true** — pending Vanessa Sena
:::

::: attestation-gate
**Signed off** — pending Director of Clinical Operations
:::

_Awaiting all gates — draft, not yet approved for use • Version 0.1_

:::
