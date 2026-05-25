---
slot: 19
slot-name: acceptance-criteria (Home)
primary-author: QA Lead
project: cena-uconn-patient-app
surface: home
created: 2026-05-25
status: in-review
consumes:
  - slots/home/states.md
  - slots/home/ia.md
  - slots/_app/content-model.md
  - test-strategy.md#definition-of-verified
inputs-hash: null
friction: []
pre-flight-authority: aaron
---

# Home — Acceptance Criteria

The contract build executes against. Per-screen observable rows + flow-level use-case acceptance (rubric C5). Each row is binary pass/fail. The pre-build cognitive walkthrough (slot-19 sub-step) result is at the bottom.

## Per-screen acceptance

| # | Criterion | State | Pass condition |
|---|---|---|---|
| H1 | Greeting personalizes on name + time; warm name-less fallback if name absent | all | renders "Good morning, {name}" or fallback; no "Hi [FirstName]" placeholder failure |
| H2 | Caught-up shows affirmation block, not empty/"0 tasks" | caught-up | affirmation line + forward-orient line present; no empty-box, no count |
| H3 | One focus card for the top item; "Not now" present + quiet | one-item, several | exactly one prominent card; secondary "Not now" is low-emphasis |
| H4 | Several state: one focus card + collapsed "a couple of other things"; no flat stack; no count badge | several | one visible card + a collapsed disclosure; ≤3 surfaced; no "N more" tally |
| H5 | Tiles describe state-of-things (order, budget); budget framed *available* | all | "This week's order", "Food budget → $X of $Y left"; never "spent"/score |
| H6 | Entry doors present: My Health, Appointments row | all | both render as calm labeled rows, not nags |
| H7 | "Talk to a person" present, visibly human, reachable without hunting | **all incl. error/first-run** | person icon + text label; not agent-gated; reachable in caught-up without deep scroll |
| H8 | 3-tab bottom nav (Home · Order · Activity), Home active | all (mobile) | exactly 3 tabs; icon+label; `aria-current` on Home |
| H9 | Desktop reflows into the responsive shell (sidebar nav) | all (desktop) | `layout-app-shell-responsive`; no horizontal overflow |
| H10 | No red-alert / overdue / gamification anywhere | all | no red deadline styling, no streak/score/confetti/"we noticed…" |
| H11 | Furniture stable across content states (no flicker) | transitions | tiles/doors/human/tabs do not appear/disappear between states |
| H12 | First-run suppresses furniture for the consent moment; "Talk to a person" still present | first-run | consent full-canvas; human path available pre-consent |
| H13 | Error/offline fail-safe to calm, not alarm | error, offline | plain message; human escalation prominent; no red |
| H14 | Budget figures carry the provisional flag until B1/B5 | all | any dollar figure traceable; `[VERIFY]` until pricing model lands |

## Flow-level use-case acceptance (rubric C5)

**Job (from brief):** "A patient opens the app and either does the single most-relevant thing the program needs, or leaves reassured they're caught up — and can always reach a human." Pre-committed expected answers (falsifiable against a cold reviewer / slot-30):

| C5 sub-check | Pre-committed expected answer |
|---|---|
| **Orientation** | Lands knowing this is their care-program home and whether anything needs them now (greeting + reserved zone carry it). |
| **Affordance** | The primary action on the focus card reads as the obvious next tap; "Talk to a person" is discoverable without hunting. |
| **Path** | One tap from Home to the most-relevant due job (or to a human); caught-up requires no action. |
| **Feedback** | Completing/dismissing an item visibly recedes it; completion lands in calm with a plain acknowledgement (no celebration). |
| **Legibility** | All copy plain, ~5th–6th grade, one idea per line; no jargon; large tap targets. |

## Pre-build cognitive walkthrough (slot-19 sub-step) — result

Fresh-context walk of the wireframe/flow against the job, spec-checkable C5 subset (path / feedback-existence / legibility / orientation-ingredients):
- **Path:** PASS — every state offers a single clear primary path or calm no-op; human reachable everywhere.
- **Feedback-existence:** PASS — recede-on-complete + "That's taken care of." specified (states.md).
- **Legibility:** PASS — copy patterns meet the plain-language rule (content-model §copy patterns).
- **Orientation-ingredients:** PASS — greeting + reserved zone + tiles provide orientation in every state.
- **Product-rule gate audit (sub-check):** Home's happy path crosses no OPEN-blocking gate. Budget *display* depends on B1/B5 (provisional figures — H14 flags it) but does not block Home's structure. No backward route fired.

**Render-only C5 (affordance-discoverability, orientation-landing):** deferred to slot 30 (human cold render-and-look) per the use-case mechanics — human-judged, non-waivable.
