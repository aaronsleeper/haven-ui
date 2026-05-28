---
type: Standard Operating Procedure
role: Program Operations
version: "0.1 (draft)"
status: draft
reviewed: 2026-05
accountable: Director of Clinical Operations
slug: sop-review-and-approval
caps: []
caps_note: Process SoP — the workflow the other SoPs ride on. No cap traceability because it codifies the meta-workflow, not a Cap of the UConn pilot. Derived from the Clinical Staff SOP pipeline's process axis at Knowledge/Areas/Meta/Entities/workflows/clinical-staff-sop.md.
---

# SoP Review & Approval Process

Program Operations · Standard Operating Procedure · Version 0.1 (draft) · Reviewed May 2026

::: callout-warning
**Draft — this is the first version of the process itself.** Read it as a starting point and tell us what to change. Once approved, this is how every Cena SoP moves from draft to operational.
:::

This procedure describes how a Cena SoP moves from initial draft through review, approval, and publication. It is the process that every other SoP rides on — including this one.

## Scope

What this procedure covers, and where its boundaries are.

| | |
|---|---|
| **For** | Anyone publishing or approving a Cena SoP — Aaron (drafting and editing), Vanessa (operational confirmation), the Director of Clinical Operations (clinical sign-off). |
| **Covers** | The lifecycle of a single SoP: drafting, surfacing for review, capturing suggested edits, reconciling them, and moving to approved status. |
| **Does not cover** | The content of any individual SoP (that's role- or topic-specific), training delivery after approval, or changes after a version is approved (those start a new draft cycle). |

## How a SoP moves through review

The same flow for every SoP. Work the steps in order; the cycle can repeat if the first pass surfaces substantial changes.

1. **Draft.** A new or updated SoP begins as a single source-of-truth document maintained by Aaron. The draft already includes a Sign-off block with status "Awaiting sign-off."

2. **Surface for review.** The draft is rendered as a Cena-branded Word document and placed in [Drive → ❁ cena share → ⚙️ Operations → Staff SOPs — DRAFTS (internal review)]{.screen-ref}. The accountable reviewer receives suggesting + comment access.

3. **Notify the reviewer.** Aaron pings the reviewer that a draft is ready and names what kind of input is most helpful — direction on scope, clinical accuracy, operational truth, or all of the above. _Note: the reviewer always has latitude to flag anything else._

4. **Reviewer works through the draft.** The reviewer opens the document in Google Docs and uses any combination of: suggesting-mode edits directly on the text, comments for anything they'd rather talk through than rewrite, or a direct message asking for a call. They take as much time as they need — Cena does not push pace on review.

5. **Capture the review.** Once the reviewer signals they're done with a pass, Aaron downloads the edited document. Tracked changes are extracted into a review report listing each suggested edit with author and date, anchored to its section in the SoP.

6. **Reconcile each suggested change.** Aaron works through the report and marks every change as one of three: **absorb** (applied to the source), **reject** (with reason captured in the report), or **discuss** (carried to a follow-up conversation with the reviewer). Comments are handled the same way — addressed in the source or routed to conversation.

7. **Re-render and re-review if needed.** If the changes were substantial, the updated draft is re-rendered and re-uploaded for a second pass. Lightweight passes (a few absorbed edits, no scope shift) can go straight to approval.

8. **Approve.** When the reviewer is satisfied, they sign off — the attestation block is updated to "Approved," the document moves from [Drive → ❁ cena share → ⚙️ Operations → Staff SOPs — APPROVED v1.0]{.screen-ref}, and access changes from suggesting to comment-only. The approved Drive doc stays as the witnessed record.

9. **Publish.** The approved source becomes the canonical version everywhere it appears — training, the operations site, and the role-specific reference materials.

## Decision branches

The everyday routing decisions that come up during a review cycle.

### What kind of input the reviewer can give

::: decision-branch
**Suggesting-mode edits on the text** — Aaron captures them through the review report and reconciles each.

**Comments on the document** — Aaron addresses each in the source (or carries it to conversation) and resolves the comment.

**A request to talk through something** — Aaron and the reviewer schedule a call; whatever's decided becomes a source edit and a note in the report.
:::

### When a second review pass is needed

::: decision-branch
**The first pass surfaced substantial scope or content changes** — Re-render and re-upload; the reviewer does another pass before approval.

**The first pass surfaced light edits with no scope shift** — Apply the absorbed changes and go directly to approval; no second pass needed.

**The reviewer flagged something that needs a separate conversation** — Hold approval until the conversation resolves, then re-render only if the conversation produced source changes.
:::

### Disposition per suggested change

::: decision-branch
**Absorb** — Apply the change to the source markdown and capture it in the report.

**Reject** — Leave the source unchanged; capture a one-line reason in the report so the reviewer can see why.

**Discuss** — Carry the change to a follow-up conversation; defer the source decision until the conversation resolves.
:::

## Escalation flags

::: callout-warning
**A review pass goes 14 days without a response.** Aaron follows up directly with the reviewer to check whether they need more context, a call, or a re-prioritization.
:::

::: callout-error
**A reviewer rejects an entire SoP or asks for the scope to be rethought.** This is a scope conversation, not a content edit — pause the cycle and bring the conversation up a level before continuing.
:::

::: escalation
**An approved SoP needs a material change later.** Start a new draft cycle from the current approved version; do not edit the approved Drive doc. The approved version remains the witnessed record of what was in operation at the time.
:::

## Quick reference

The cycle, condensed to a tickable list.

::: card-title
For every SoP from draft to approved
:::

- [ ] Draft the SoP in the markdown source-of-truth, with an "Awaiting sign-off" Sign-off block
- [ ] Render the draft as a Cena-branded Word doc and place it in the DRAFTS folder
- [ ] Notify the reviewer that the draft is ready and name what input is most helpful
- [ ] Reviewer works through the doc on their own pace (suggesting edits, comments, or call)
- [ ] Download the edited doc and capture suggested changes into the review report
- [ ] Reconcile each change (absorb / reject / discuss) and update the source
- [ ] Re-render and re-upload if a second pass is warranted
- [ ] Reviewer signs off; move the doc to the APPROVED folder and switch to comment-only
- [ ] Publish the approved source to training and operational surfaces

## Terms used in this SOP

Plain-language definitions, no system jargon.

::: glossary-term
Source of truth
:::
::: glossary-def
The single canonical version of an SoP. Every other version — the Word doc in Drive, the published reference, the training materials — is derived from it. The source is what gets edited; the other versions get re-rendered.
:::

::: glossary-term
Draft
:::
::: glossary-def
An SoP version not yet approved by the accountable reviewer. Drafts live in the DRAFTS Drive folder and carry an "Awaiting sign-off" status in their Sign-off block.
:::

::: glossary-term
Approved
:::
::: glossary-def
An SoP version that has cleared all its sign-off gates and is operational. Approved docs live in the APPROVED folder with comment-only access, and the approved source is what publishes everywhere the SoP appears.
:::

::: glossary-term
Suggesting mode
:::
::: glossary-def
The Google Docs editing mode where every change a reviewer makes is captured as a tracked suggestion (rather than a direct edit). The reviewer's intent is preserved with author and date; Aaron decides whether to absorb each suggestion when reconciling the review.
:::

::: glossary-term
Review report
:::
::: glossary-def
The list of suggested changes extracted from a reviewed Drive doc, one entry per change, with author, date, and the section of the SoP it lands in. Aaron works through each entry and assigns a disposition before merging anything into the source.
:::

::: glossary-term
Sign-off block
:::
::: glossary-def
The attestation block at the bottom of every SoP listing each gate that must clear before the SoP is approved (clinical accuracy, operational truth, sign-off by the accountable role). The block is honest about which gates are pending and which are clear.
:::

## Sign-off

The process itself is approved for use only when all gates are signed. Until then, it is a proposal in active drafting.

::: attestation
**Sign-off**
:::

::: attestation-gate
⏳ **Process confirmed** — Aaron Sleeper (the cycle and tooling work end-to-end)
:::

::: attestation-gate
⏳ **Operationally true** — Vanessa Sena (this fits how Cena actually runs reviews)
:::

::: attestation-gate
⏳ **Signed off** — Director of Clinical Operations (this is how Cena will work review going forward)
:::

::: attestation-gate
_Awaiting all gates — draft, not yet approved for use · Version 0.1_
:::
