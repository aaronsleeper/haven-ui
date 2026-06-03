---
title: Monthly UConn program review meeting — prep and facilitation
role: Meeting owner (Vanessa current → Marrero post-launch)
type: Standard Operating Procedure
version: "0.1 (draft)"
status: draft
reviewed: 2026-06
accountable: Director of Clinical Operations
slug: monthly-uconn-review-meeting
---

:::callout-warning
**DRAFT** — no SoP draft exists in source material; this document is the structural shape with labeled gaps where operational content is undocumented. Do not use operationally. Rendered from the use-case spec at `use-cases/monthly-uconn-review-meeting/`; corrections land in the source fragments, not in this rendered output.
:::

:::callout-error
**This SoP is largely labeled uncertainty.** Per the source catalog (cap-48): "no SoP draft; deferred post-launch." Most steps below carry gaps. The structural shape (monthly cadence, agent-generates → human-customizes → meeting → routing) is what's authored; the operational specifics await Vanessa, Marrero, Marinka, and Andrey.
:::

## Who this is for and what it covers

| For | The meeting owner running the monthly UConn program review (currently Vanessa Sena; post-launch Dr. Marrero). |
|---|---|
| Covers | The monthly cadence from upstream reports closing through agenda generation, talking-point customization, meeting facilitation, and routing of protocol-refinement proposals. |
| Does not cover | The monthly reports themselves (cap-44 through cap-47 — separate procedures); the cap-9 participant satisfaction survey administration (separate procedure); the downstream clinical and operational refinement pipelines that receive routed proposals. |

## When the cadence fires

1. **The reporting system closes the monthly cycle.** When cap-44 through cap-47 monthly reports complete, the reporting system fires the cadence trigger and the agenda-generation pipeline kicks off.

   :::callout-warning
   **Timing offset undocumented.** How many days before the scheduled review meeting the trigger fires (T-7? T-3?) is not specified. What happens if a report is late (delay the meeting? fire with partial data?) is not specified.
   :::

   :::callout-warning
   **Survey integration undocumented.** At Months 3, 6, and 9 of the pilot, participant satisfaction surveys (cap-9) provide CQI inputs. Whether the trigger waits for survey results or attaches them when available is unspecified. The data-collection tool for surveys (UConn Qualtrics vs. a Cena-built tool) is open as of 2026-05-27.
   :::

2. **The reporting system auto-generates an agenda template.** The pipeline produces a template populated with current dashboard data — operational metrics, participant feedback themes, candidate protocol-refinement items surfaced upstream. Design intent: data fills automatically; talking-point customization stays human.

   :::callout-error
   **Dashboard data-element set pending Marinka + Andrey (Exhibit F).** What data the agenda template actually contains is not yet specified. Until Exhibit F lands, the agenda template's content is undefined.
   :::

3. **The meeting owner customizes talking points.** The auto-generated agenda goes to the meeting owner, who reviews the data, identifies operational challenges and protocol refinement opportunities to anchor discussion, and authors talking points. The meeting is CQI (continuous quality improvement) oriented — outcome review is explicitly NOT the meeting's purpose (research-blind constraint).

   :::callout-warning
   **Customization criteria undocumented.** What makes a dashboard-generated draft "ready" for facilitation is undefined. No sight-check / sign-off step before facilitation. During ownership-transition cycles, whether Vanessa customizes alone, Marrero customizes with Vanessa shadowing, or some other arrangement, is undefined.
   :::

4. **The meeting owner facilitates the program review with UConn participants.** The meeting surfaces operational challenges, walks through participant feedback themes from upstream reports, and captures protocol refinement proposals.

   :::callout-warning
   **Meeting format and UConn attendees undocumented.** Whether the meeting is in-person or virtual is unspecified. The UConn-side attendee list is unspecified — without it, partner-side accountability and decision-rights structure is undefined.
   :::

   :::callout-warning
   **No defined attestation moment at meeting close.** There is currently no formal "decisions captured — signed off" gate at the end of facilitation. This is a candidate gap worth raising with Vanessa and Marrero: without it, there's no formal record that the captured decisions reflect what was agreed.
   :::

5. **Protocol refinement proposals route to the right owner.** Each proposal is classified as clinical (routes to Dr. Marrero) or operational (routes to Vanessa Sena). Classification is currently the meeting owner's judgment.

   :::callout-error
   **Classification criteria undocumented.** What makes a refinement "clinical" vs "operational" is undefined. Whether a proposal can be both (and route to both) is undefined. Transport mechanism (Slack? email? structured queue?) is undefined. No acknowledgment contract or SLA from the receiving owner.
   :::

## The ownership-transition arc — a separate hand-off across cycles

Beyond the per-meeting flow above, this workflow carries a second hand-off the catalog explicitly flagged but did not specify: **meeting ownership migrates from Vanessa to Marrero over multiple cycles.**

:::callout-error
**The ownership-transition gate is undefined — this is a NOVEL attestation shape the catalog flagged but did not author.** The arc names Vanessa as the attestor and Marrero as the subject; the thing being attested is that Marrero is ready to assume ownership. No analogous gate exists elsewhere in the surveyed catalog. The catalog records:

- That Vanessa must walk Marrero through "several cycles" — count undefined
- That handoff is "formal" only after readiness — readiness criterion undefined
- That no attestation step is currently defined for the transition itself

This is the load-bearing gap of this use case. The structural shape is present and meaningful (an attestation-gate where one role attests another role's operational readiness); the operational content is entirely absent.
:::

## Escalation — when this routes elsewhere

::: escalation
**If a routed clinical refinement touches BHN-relevant care** — the BHN role-resolution gap applies (catalog #1 structural gap: BHN role unresolved — Cena-staffed vs. UConn-side clinical-team function). This use case does NOT itself route to BHN, but a downstream clinical refinement might.

**If a refinement is both clinical AND operational** — the routing rule does not cover this case. Currently a meeting-owner judgment call without defined criterion.

**If the meeting owner cannot determine classification** — undefined. No fallback path is documented.
:::

## Each cycle — the (incomplete) checklist

::: card

::: card-title
Per-cycle checklist
:::

::: card-body
- [ ] Upstream monthly reports (cap-44 through cap-47) confirmed closed
- [ ] cap-9 satisfaction survey results attached (Months 3, 6, 9 only)
- [ ] Agenda template auto-generated from dashboard data (content pending Exhibit F)
- [ ] Talking points customized by meeting owner
- [ ] Meeting facilitated with UConn participants (attendees TBD)
- [ ] Meeting notes captured (no defined sign-off gate)
- [ ] Protocol refinement proposals classified and routed (criteria undefined)
- [ ] Ownership-transition cycle counter incremented if applicable (transition gate undefined)
:::

:::

## Terms used here

:::glossary-term
CQI
:::

:::glossary-def
Continuous Quality Improvement — an iterative cycle of identifying operational challenges and protocol-refinement opportunities, then closing the loop on each. The monthly UConn review meeting is the explicit CQI anchor for the pilot; outcome review is NOT the meeting's purpose (research-blind constraint).
:::

:::glossary-term
Attestation gate
:::

:::glossary-def
A point in a procedure where a named human in a named role must record an explicit sign-off — with rationale and timestamp — before the case can proceed. Every sign-off generates an immutable audit-trail entry. This SoP names two attestation-gate-shaped moments that are NOT currently defined as gates: the meeting-close sign-off (decisions captured) and the ownership-transition gate (Vanessa attesting Marrero is ready). Both are candidate gates the catalog flagged but did not author.
:::

:::glossary-term
Ownership-transition arc
:::

:::glossary-def
The cross-cycle hand-off of meeting ownership from one role to another, spanning multiple cycles. The current arc moves ownership from Vanessa Sena to Dr. Marrero. The catalog records that Vanessa must walk Marrero through several cycles before formal handoff, but the cycle count, readiness criterion, and attestation gate are all undefined. This is a novel attestation shape worth authoring before launch.
:::

:::glossary-term
Exhibit F
:::

:::glossary-def
The pending Cena-internal deliverable that will specify the dashboard data-element set — what metrics, feedback themes, and protocol-refinement signals the agenda template actually contains. Authorship is pending Marinka and Andrey. Until Exhibit F lands, the agenda template's content is undefined.
:::

:::glossary-term
BHN
:::

:::glossary-def
Behavioral Health Network — the partner clinical team that receives escalated behavioral-health cases. Whether BHN is a Cena-staffed role or a UConn-side function is unresolved as of this draft. This SoP does not itself route to BHN, but a downstream clinical refinement might.
:::

## Not yet approved — gates remaining

::: attestation

This procedure is a DRAFT with substantial labeled uncertainty. Three approval gates remain before operational use, and three structural gaps remain before the SoP can be operationally complete.

::: attestation-gate
**Clinically accurate** — pending Dr. Marrero
:::

::: attestation-gate
**Operationally true** — pending Vanessa Sena
:::

::: attestation-gate
**Signed off** — pending Director of Clinical Operations
:::

_Awaiting all gates — draft, not yet approved for use • Version 0.1_

**Structural gaps the catalog flagged as deferred:**

- The dashboard data-element set (Exhibit F — pending Marinka + Andrey)
- The ownership-transition attestation gate (novel shape; not authored)
- The classification criteria for clinical-vs-operational refinement routing

:::
