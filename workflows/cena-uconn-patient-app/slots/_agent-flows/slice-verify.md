---
slot: 23
slot-name: slice-verify (agent-pushed flows — assessments, dietary recall, satisfaction survey)
primary-author: QA Reviewer (fresh-context render-verifier, Sonnet)
project: cena-uconn-patient-app
created: 2026-05-25
status: in-review
consumes:
  - slots/_agent-flows/render/*/render-check.md
  - test-strategy.md#definition-of-verified
inputs-hash: null
friction: []
pre-flight-authority: aaron
---

# Agent-pushed flows — Slice Verify (#3b)

Brings the agent-pushed clinical flows (assessments, 24-hr dietary recall, satisfaction survey) toward the verified bar Home/Order/Activity met. Fresh-context render-verifier (Principle 4 — a separate agent instance judging only screenshots, no orchestrator reasoning handed in). Screenshots post the emoji-scale fix + rebuild.

## Mechanical render-check (slot-22)

| Page | Verdict |
|---|---|
| assessments/take-screener (live runner) | PASS |
| dietary-recall/recall.entry | PASS |
| dietary-recall/recall.review | PASS |
| satisfaction-survey/take-survey.question | PASS (after dev-note + inline-style fix) |

## Fresh-context render-verifier verdict

| Flow | Coherence | Dignity/No-score | Legibility | Recall=guided | a11y | Overall |
|---|---|---|---|---|---|---|
| Assessment (screener) | PASS | PASS | PASS | n/a | PASS | **PASS** |
| Dietary recall — entry | ITERATE | PASS | ITERATE | ITERATE | ITERATE | **ITERATE** |
| Dietary recall — review | PASS | PASS | PASS | PASS | ITERATE | **ITERATE** |
| Satisfaction survey — question | ITERATE | PASS | PASS | n/a | ITERATE | **ITERATE** |

**Dignity + no-score invariant holds across all flows** (no computed scores shown to the patient; calm, reassuring). The assessment screener is a clean PASS.

## Findings + disposition

- **FIXED — survey.question dev-note leak + inline styles.** A demo-scaffold separator rendered the text "↓ Interactive runner (satisfaction-runner.js)…" as visible body copy, via `style="…"` (forbidden). Converted to an HTML comment; removed all 3 inline styles. Re-render PASS, 0 inline styles.
- **RESOLVED (F1) — recall.entry free-text box undercuts the guided interview.** Was: a bare "Type a message…" field below the day chips read as an open chat box, not a paced structured interview (IA F1 watch-item, `surface-shell-model.md`). Routed to Grief-Context UX (independent verdict), decided + implemented: entry **leads with chips**; free-text demoted to a summonable native-`<details>` "Type instead". render PASS, committed `1298624`.
  - **ROUTED (clinical residual) — relative-day date ambiguity.** A sub-question fell out of F1 that is *not* Aaron's design call: does recall Step 1 need a date-confirm when a patient says a relative day ("yesterday") that's ambiguous after midnight? Out of Aaron's domain → routed to the **UConn Pilot Program Manager** ledger (`UConn Pilot — Source of Truth.md` → state ledger, **open-with-owner**, Vanessa → Dieckhaus / RDN). Build-side already settled: if a confirm is needed it renders as a *date chip*, not free-text; the surface ships chip-led with the confirm step pluggable.
- **RESOLVED — recall.entry desktop layout.** Was: agent message + chips anchored bottom-left, status panel mid-right, ~60% dead whitespace, two disconnected halves. Root cause was shared chrome, not entry-specific: the focused-session header wrapped in `.app-shell-content` (flex-1) competed with `<main>` (flex-1) and split the column 50/50, ballooning the header to ~355px and shoving the two-pane down. Fix: `.recall-header-bar` (shrink-0) swapped in across all 6 recall pages; `<main>` now fills the column, panes share a top edge. Verified desktop (entry + pass1) + mobile + render gate. Committed `fe38b99`.
- **OPEN — recall.pass1 inline styles → semantic classes.** 4 inline `style=` (chat-message `flex-direction: row-reverse` for outgoing, a flex header). Should be a `patient-chat-message` outgoing modifier + a header class in `components.css` (DS layer — propagation). Recurs across recall passes.
- **OPEN (a11y) — recall.review label contrast.** "REVIEW — DOES THIS LOOK RIGHT?" is low-contrast + visually merged with the date heading; needs heavier weight or to move outside the table.
- **NOTE — instance-demo pages stack states.** survey.question (and recall passes) are instance-demo pages that stack multiple states on one page (per the handoff AGENTS.md instance-page pattern). For app-feel, candidate to convert to a single runner-driven state view. Not a defect; a structural choice flagged for the QA/restructure backlog.

## Verdict

Assessment flow **verified (PASS)**. Recall + survey flows **ITERATE** — no dignity/safety/no-score issue (the safety-critical bar holds), but UX/a11y findings remain, headlined by the **F1 recall free-text box** (Aaron's design call) + the recall desktop layout. These are the agent-flow QA backlog; none blocks the walkthrough's safety, all block "verified" for those two flows.
