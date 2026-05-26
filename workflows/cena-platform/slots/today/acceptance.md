---
slot: 19
slot-name: acceptance-criteria (Today)
primary-author: QA Lead
project: cena-platform
surface: today
created: 2026-05-26
status: in-review
consumes:
  - slots/today/states.md
  - slots/today/ia.md
  - slots/_app/content-model.md
folds-in: [test-plan (20)]
---

# Today — Acceptance Criteria

The contract build executes against. Per-screen observable rows (binary pass/fail) + flow-level use-case acceptance. Pre-build cognitive walkthrough result at the bottom.

## Per-screen acceptance

| # | Criterion | State | Pass condition |
|---|---|---|---|
| T1 | Four queue groups present + labeled, urgency-sorted | queue | Patient alerts · Pending referrals · Order exceptions · Due cutoffs/distributions each render with a `queue-section-header` + count |
| T2 | Every queue card deep-links into its entity | queue | each `queue-item` is a `<button>`/link whose target is the entity surface (patient record / referral / order / week-or-distribution); no inline "do the work here" |
| T3 | Operational urgency color is correct + reserved | queue | `.is-urgent`/`.is-breached` red appears only on genuine urgency (fired alert, SLA breach, near cutoff); not decorative |
| T4 | Counts are subordinate to cards | queue | `stat-group` glance row is visually secondary; actionable cards lead (no vanity-dashboard inversion) |
| T5 | Caught-up shows a professional all-clear, not a sad empty box | caught-up | `empty-state` plain copy + the standing-glance counts remain; no patient-app affirmation tone, no ceremony |
| T6 | Shell furniture stable across states | transitions | sidebar (7 anchors, Today active) + topbar (search + work-queue badge + user) never appear/disappear |
| T7 | Work-queue badge count present + accessible | queue, caught-up | Today nav-item + topbar badge show the pending count; `aria-label` names it; 0/hidden in caught-up |
| T8 | Overflow routes, never piles | queue | long groups show top N + "View all in [surface]" link; launchpad does not become an infinite list |
| T9 | Professional voice, no plain-language simplification, no gamification | all | operational strings ("Cutoff in 6h", "3 orders unfulfilled"); no streaks/scores/confetti |
| T10 | A11y: queue is keyboard-navigable buttons in urgency order; headings + SLA labels correct | all | `<h2>` section headers; SLA icon `aria-hidden` + span `aria-label`; skip-link to main; visible focus |
| T11 | Renders self-contained under `file://` | all | `../assets/haven.css` + relative paths; no dev server; render-gate clean (zero undefined classes) |
| T12 | No real patient/business data | all | representative/synthetic names + values only |

## Flow-level use-case acceptance

**Job (from brief):** "A coordinator opens the app at start-of-day and, in one glance, sees whether anything needs them and what's most urgent — then reaches the most-urgent item's entity in one click, or is reassured the queue is clear."

| Sub-check | Pre-committed expected answer |
|---|---|
| **Orientation** | Lands knowing this is the work queue and whether anything is pending now (page-title + grouped, urgency-sorted cards carry it). |
| **Affordance** | The top card reads as the obvious next click; pushed work is visually distinct from the 7 standing nav anchors. |
| **Path** | One click from Today into the most-urgent item's entity; caught-up requires no action. |
| **Feedback** | An actioned item leaves the queue (count decrements); when all clear, Today recedes to caught-up. |
| **Legibility** | Operational copy, one item per card, scannable in a dense professional register. |

## Pre-build cognitive walkthrough (slot-19 sub-step) — result

Fresh-context walk of the spec against the job (spec-checkable subset):
- **Path:** PASS — each state offers a single clear route (deep-link into entity) or calm no-op (caught-up); 7 anchors always available.
- **Feedback-existence:** PASS — actioned items leave the queue; badge decrements; caught-up is the cleared state (states.md transitions).
- **Legibility:** PASS — professional operational copy patterns (ds-binding voice contract); urgency color carries triage meaning.
- **Orientation-ingredients:** PASS — page-title + four labeled groups + urgency sort provide start-of-day orientation.
- **Product-rule gate audit:** Today's happy path crosses no blocking gate — it is read + route; the work (and its gates) live in the target entities. Deep-link href targets finalize once entity surfaces are built (build Today last).

**Render-only checks (counts-truly-subordinate, urgency-reads-right, glanceability):** deferred to slot 30 (human cold render-and-look) — non-waivable.
