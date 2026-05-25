---
slot: 23
slot-name: slice-verify (Home) — consolidates 24 code-review, 25 design-qa, 27 a11y-audit for this single-surface pass
primary-author: QA Reviewer (fresh-context)
project: cena-uconn-patient-app
surface: home
created: 2026-05-25
status: in-review
consumes:
  - slots/home/acceptance.md
  - slots/home/states.md
  - slots/home/render/caught-up/render-check.md
  - slots/home/render/one-item/render-check.md
  - slots/home/render/several/render-check.md
inputs-hash: null
friction: []
pre-flight-authority: aaron
---

# Home — Slice Verify

Per-slice verification against `acceptance.md`. Fresh-context reviewers (Principle 4): a render-verifier judged the screenshots and a code reviewer judged the markup, each unprimed (no orchestrator conclusions handed in). This single-surface pass consolidates slots 23/24/25/27; when the build widens, these split into per-slot files.

## Build under test

- `handoff/cena-uconn/home/home.{caught-up,one-item,several}.html` (static HTML, haven-ui PL; chrome = `app-shell`/`mobile-bottom-nav` referenced components).
- Rendered: `slots/home/render/{state}/` (mechanical render-check.md + screenshots, desktop 1280 + mobile 390).

## Mechanical render-check (slot-22 sub-step, Principle 13)

| State | Verdict | Notes |
|---|---|---|
| caught-up | PASS | 63 classes all resolve; no overflow/console/dup-label |
| one-item | PASS | clean |
| several | **PASS (after fix)** | initially FLAGged duplicate "Not now" accessible names; fixed (distinct `aria-label`s), re-rendered PASS |

## Rendered-evidence pass — render-verifier (fresh-context, Sonnet; Principle 13)

**Verdict: PASS** across all 6 screenshots. Per-dimension: visual hierarchy PASS · calm/non-nagging PASS · dignity/no-AI-slop PASS · legibility PASS · human-escalation present PASS · mobile↔desktop reflow PASS.
- Confirmed: caught-up reads reassuring (avoids empty-state sadness); several uses one focus card + collapsed disclosure (no pile-up); budget framed as available; "Talk to a person" person-iconed + human across all states; desktop is a true reflow into the sidebar shell, not a stretched column.
- **Iterate-next (not a block):** several-state mobile — the collapse affordance is carried only by the small native ▶ marker; for a low-tech-literacy reader the "a couple of other things" row reads as text, not a tap target. → design-qa finding D1.

## Code review (slot 24, fresh-context, Sonnet) — ITERATE → fixes applied

| Dimension | Result |
|---|---|
| Semantic classes vs utility soup | PASS w/ minor — tile text uses typographic utilities (`text-xs uppercase…`) inline; candidates for `tile-label`/`tile-value` semantic classes → follow-up F1 |
| Style escape hatches | data-driven only — `style="width:X%"` on the budget `progress-bar`; **resolved** as the sanctioned data-driven-dimension carve-out (the direct analog of the Chart.js flex carve-out; a static class cannot express dynamic spend ratios). The production port wires it to the spend ratio. Not a theming escape hatch. |
| No Preline in bundle | PASS — native `<details>`; only `haven.css` loaded |
| Icons (FA only) | PASS |
| Nav canon (3 tabs) | PASS — Home · Order · Activity, sidebar mirrors |
| Accessibility | **FIXED** — added `aria-current="page"` to active sidebar + bottom-nav tabs (all 3 files); clarified the demo placeholder `title` so it no longer reads as the element's purpose |
| Self-contained relative paths | PASS |
| Population-safety in markup | PASS — no counts/scores/progress-on-person; budget = available framing |

## a11y audit (slot 27 summary)

- Landmarks (`nav`/`main`), one `<h1>` per page, FA icons `aria-hidden`, `aria-live` polite on the things-to-do zone with a debounced announce span, target sizes generous. Active-tab `aria-current` now present. Distinct accessible names on the three "Not now" buttons.
- **Full axe + keyboard + screen-reader walkthrough** is deferred to the build-phase a11y-audit when the surface is wired; this static pass covers structural a11y. No AA blocker found in markup.

## Acceptance rows (slot-19 contract) — status

H1–H13 **PASS** by render + markup inspection (greeting/fallback, caught-up affirmation, one-focus-card discipline, state-of-things tiles, doors, human-escalation-everywhere, 3-tab nav + aria-current, desktop reflow, no-red/no-gamification, furniture stability, first-run handling, error/offline fail-safe-to-calm — the last two verified in spec, not yet built as live states). **H14** (budget figures provisional) — flagged in copy; depends on B1/B5.

## Open items carried forward

- **D1 (design-qa, iterate):** several-state disclosure affordance — make the "a couple of other things" row an explicit tap target (chevron + styled row). Recommended as a Tier-1 PL `home-overflow-toggle` (hide native marker, chevron rotates on open) → escape-hatch-with-return-path; not hacked inline. For Aaron's slot-30 look.
- **F1 (PL discipline, follow-up):** promote tile text utilities → `tile-label`/`tile-value` semantic classes (3-use rule met across the tiles).
- **First-run / error / offline / partial** content states are specified (`states.md`) but only caught-up/one-item/several are built — build them when the surface is wired.

## Verdict

**SHIP-pending-slot-30.** Mechanical + render-verifier + code-review + structural-a11y all pass (fixes applied). The **non-waivable human cold render-and-look (slot 30)** is the remaining gate before release-readiness — see the slot-30 package. D1 is an iterate-next, not a block.
