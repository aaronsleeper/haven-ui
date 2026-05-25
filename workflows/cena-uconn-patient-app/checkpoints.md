# Checkpoints — Cena × UConn Patient App

Human gates per [workflow-spec](../../../../workflows/ui-development/workflow-spec.md) § Human checkpoints. Audience is Aaron unless a clinical/compliance gate routes to a named accountable human (Vanessa / partner clinician).

## Overnight posture (2026-05-24)

Aaron chose **proceed-and-document** for the unattended run: at each gate I make the best-judgment call, log every decision + every OPEN product-rule gate to [review-queue-AM.md](review-queue-AM.md), and continue. Nothing irreversible ships (no deploy, no client-facing send, no code while T0.1/T0.2 are open). Gates below revert to their normal blocking behavior once Aaron is back.

## Gates

| after step | tier | audience | decision options | routing |
|---|---|---|---|---|
| 0.1 brief | gate | Aaron | approve / modify / reject | modify → revise brief; approve → Phase 0 continues |
| 0.3 stack · 0.4 framework | gate | Aaron (+ Andrey for T0.1) | approve / defer | T0.1 production stack is Andrey/Vanessa's; this run declares the **formative + prototype** target only |
| 0.5 ds-binding | gate | Aaron / DS Steward | approve / modify | drift → re-run against COMPONENT-INDEX |
| 0.6 app-scoped IA | gate | Aaron | approve / modify | the load-bearing app structure; modify routes back to trigger-map |
| 0.8 product-rule gate audit | gate | Aaron → Vanessa/Andrey for OPEN gates | resolve / defer-with-owner | OPEN gates that block a v1 happy path escalate to the named human |
| S.3 states · S.4 wireframes · S.8 acceptance | gate | Aaron | approve / modify | per-surface design gates |

## Hardcoded (non-waivable) gates

Cannot be configured away (regulatory / safety / render-fidelity):

- **Clinical-accuracy sign-off** on any patient-facing clinical copy (assessments, recall, consent) — accountable human (Vanessa / partner clinician). The no-score invariant is structural.
- **IRB consent-gate integrity** — consent (cap-12) must read plain, unhurried, no dark patterns; gates the rest of the app.
- **Human cold render-and-look (slot 30)** — non-waivable for this client-facing/regulated UI. Human judges rendered screens cold, then sees agent verdicts. Applies at build (Phase 3) — cannot be satisfied overnight by design.
- **Distress-detection agent-behavior spec** — flagged to Vanessa (highest-stakes open gap); not a UI nav element.
