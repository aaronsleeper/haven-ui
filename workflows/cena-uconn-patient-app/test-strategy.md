---
slot: 2
slot-name: risk-and-test-strategy
primary-author: QA Lead
project: cena-uconn-patient-app
created: 2026-05-24
status: in-review
consumes:
  - brief.md#success-criteria
  - brief.md#constraints
inputs-hash: null
friction: []
pre-flight-authority: aaron
---

# Risk & Test Strategy — Cena × UConn Patient App

Defines what "verified" means **before any design starts** (Principle 6). Owns: the risk register, automation/human split, regression scope, a11y/perf/responsive budgets, gate ownership, definition of verified, and the AI-slop pattern list for this engagement.

## Risk register (ranked by the priority stack)

| # | Risk | Stakes tier | Mitigation slot |
|---|---|---|---|
| R1 | PHI leaked to a surface or a push notification | safety (below-line) | content-model validators; no-clinical-detail-in-push rule (B3); a11y/data review |
| R2 | Computed assessment score shown to patient (no-score invariant broken) | safety/compliance | structural in `assessment-confirmation`; acceptance row per check-ins surface |
| R3 | Clinically inaccurate or paraphrased instrument content | compliance | primary-source citation per item; clinical-care sign-off gate |
| R4 | Consent dark-pattern / unhurried-violation | compliance | onboarding flow review; no pre-checked boxes; human-question path present |
| R5 | Surveillance/gamification/shaming creeps onto a vulnerable-population surface | brand (below-line if shipped) | AI-slop list below; brand-fidelity + skeptic seat; human cold-look (slot 30) |
| R6 | Caught-up state reads as empty/sad | brand | designed-for-default rule; render-verifier + human cold-look |
| R7 | Illegible to low-literacy/ESL reader | brand/a11y | ~5th–6th-grade copy rule; a11y-spec; strings review |
| R8 | A surface renders incoherent though spec-correct (Principle 13) | brand/safety | render-check.mjs + render-verifier + human cold-look |
| R9 | An OPEN product-rule gate goes into build undecided | compliance/velocity | slot-0.8 gate audit; escalate OPEN-blocking to Vanessa/Andrey |
| R10 | Nav drift (5-tab demo nav propagates) | brand | 3-tab canon (Guardrail 4); ds-binding allowed-components list |

## Definition of "verified" (this engagement)

A surface is **verified** when, against its `acceptance.md`:
1. Per-screen acceptance rows pass (functional + state coverage: loading/empty/partial/error/success/permission).
2. **Flow-level use-case acceptance (C5)** passes — the named patient can accomplish the named job across the flow (orientation/affordance/path/feedback/legibility).
3. **Render-verification (Principle 13):** rendered at declared viewports; `render-check.md` mechanical checks pass; the render-verifier agent judges the screenshots coherent; **the human cold render-and-look (slot 30) passes** — non-waivable here.
4. a11y (WCAG 2.2 AA), and for build: perf budget + responsive matrix pass.
5. No AI-slop pattern (below) present.

Formative docs (Phases 0–1) are **complete** when internally consistent, gate-passed, and the pre-build cognitive walkthrough (slot-19 sub-step) finds no unrouted C5 failure or OPEN-blocking product-rule gate.

## Automation / human split

- **Automated:** render-check.mjs mechanical checks; undefined-class render gate; axe a11y scan; link/route coverage (IA Layer-1); copy reading-level lint (heuristic).
- **Render-verifier agent (trusted verify-tier, Sonnet — eval passed 2026-05-15):** screenshot coherence/hierarchy/duplication.
- **Human (non-waivable):** clinical-accuracy sign-off; consent integrity; the cold render-and-look task-walkthrough (slot 30); C5 task-completion verdict (human-judged until a labeled corpus passes the render-verifier bar).

## Budgets

- **a11y:** WCAG 2.2 AA. Target sizes ≥44px; visible focus; keyboard maps; icon+label pairing for escalation; contrast meets AA against sand surfaces.
- **Perf (at build):** mobile-first; self-contained bundle, no JS framework; fonts via CDN (acceptable). Core Web Vitals measured at slot 28.
- **Responsive:** mobile-first primary; desktop reflow. Declared breakpoints set in stack.md; visual diffs at slot 29.

## Conditional/optional slots required for this engagement

Per brief §Conditional declarations: discovery-research skipped (documented); visual-direction conditional; prototype-novel-interactions conditional (Order basket, recall runner); data-contracts deferred (T0.2); performance-audit + responsive + human-exploratory required at build.

## AI-slop pattern list (this engagement; updated retro-by-retro)

From principles §9 + the population frame:
- Wrong information hierarchy; inconsistent spacing not caught by tokens.
- Hallucinated interactions that "work" but aren't what patients do.
- **Gamification/surveillance creep:** counts, scores, streaks, progress-on-people, "we noticed you didn't…", overdue-red, confetti.
- **Nagging pile-up:** flat stack of equal-weight task cards; count badges.
- **Empty-state sadness:** "0 tasks," empty-box illustration, manufactured task to fill space.
- Register collapse (marketing-cheerful motion/copy on a clinical/sensitive surface).
- Jargon leakage ("assessment battery," "PRO instrument") to a low-literacy reader.
- Generated divergent CSS where canon PL components exist; 5-tab nav drift.
- Chat-field-as-default where the design calls for structured interaction (recall watch-item).

## Gate ownership

Per [checkpoints.md](checkpoints.md). Clinical/compliance gates → accountable human (Vanessa/partner clinician). Render-fidelity human cold-look → Aaron. Design gates → Aaron. OPEN-blocking product-rule gates → named human per the gate audit.
