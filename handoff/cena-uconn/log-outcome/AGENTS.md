# AGENTS.md — Log-outcome slice

For AI coding agents working with this slice. Read [`../AGENTS.md`](../AGENTS.md) first for bundle-wide conventions, then this file.

## What this slice is

The patient-facing self-reported-outcomes log for the UConn pilot (cap-20). A **deterministic structured form** — one card per measure (weight / BP / A1C / free-form note), each independently fillable and savable. It is the MVP for cap-20; the **agentic chat version** (`flows/flow-log-outcome.md`) is post-launch and is NOT what this slice builds.

Covers the **Care tier** from `candidate-measures.md` §3.2 only. Compliance tier = the [`assessments/`](../assessments/) slice; Evidence tier = EHR/lab linkage (not patient UI), deferred.

## The shape — cards + states

- **Container:** `<main data-log-outcome>` inside `app-shell-content`.
- **Measure card:** `<article data-measure-card data-measure="weight|bp|a1c|note">` — an **app-local composition** of `card` + `field-row` family + `trend-snippet-list`, not a new PL primitive. Precedent: the assessments `questionnaire-panel` carve-out (PL Steward verdict 2026-05-14). Promote to the PL only if a second flow needs the same shape.
- **States, per card:** *fillable* (inputs + Save) ⇄ *saved* (value read-back + timestamp + Edit). The gentle out-of-range *warning* is an inline variant of the fillable state, not a separate state.

The shell is `layout-app-shell-responsive.html` — the same shell as assessments, for the same reason (`../assessments/SHELL-DECISION.md`): deterministic form, chat silent, no right-pane artifact. The shell rationale is **referenced, not duplicated** here (define-once).

## Hard invariants

These are load-bearing rules from cap-20 + `flow-log-outcome.md`, not stylistic preferences. A ported runner that violates one breaks the spec.

- **Each measure saves independently.** No batched submit, no completion gate. Model per-card save. A patient may log one card and leave.
- **Everything is optional.** No required fields, no "you must log X" chrome. Empty Save is a no-op, not an error.
- **Out-of-range is a GENTLE CONFIRM, never a block.** A value outside the plausible band (or far from the last reading) shows an amber `field-row-warning` + `field-warning` message, but the Save button **stays enabled** — pressing Save again saves the value. The warning is a typo-catch.
- **Clinical alerting is NOT this flow's job.** Out-of-range values route to cap-62 (server-side, downstream of capture) via the `flaggedOutOfRange` flag — they are never surfaced to the patient as clinical advice, and never gate the patient. Patient-facing copy does not diagnose, alarm, or recommend.
- **No celebration / no gamification.** No streaks, no "great job", no progress trophies. Cohort-tone consideration (HIV+, food-insecure, chronic stress). The acknowledgement is calm and names where the data goes.
- **Plausible bands are typo-catch heuristics, not clinical thresholds.** `log-outcome.js` `PLAUSIBLE` is deliberately wide. Do not treat it as a clinical range; do not narrow it without clinical input.

Note: there is **no no-score invariant** here (unlike assessments). Self-report logging has no computed clinical score — showing the patient their own logged value back is correct and expected.

## Conventions to honor

- **Use the deterministic `field-row` family, NOT the chat primitives.** `chat-numeric-input` / `chat-paired-numeric` / `chat-tag-group` exist in the PL but are the **chat-embedded** (agentic) versions. Using them here would smuggle the post-launch agentic interaction model into the MVP. The deterministic form uses `field-row` + `field-input-group` + `field-addon`.
- **Save = `btn-primary`.** Saving a measurement is a commitment (DESIGN.md reserves primary teal for commitments, not advancement). Edit = `btn-ghost btn-sm`.
- **Copy semantic classes from the bundle; do not invent.** This slice added zero new component classes. If you need one that doesn't exist, that is a gap — surface it, don't substitute (see [`../AGENTS.md`](../AGENTS.md) Closed-vocabulary contract).
- **BP is a paired input** with sr-only `aria-label`s on each field ("Systolic (top number)" / "Diastolic (bottom number)"); the `/` separator is `aria-hidden`. No unit toggle (mmHg is fixed).
- **The instance page (`log-check-in.html`) is a demonstration, not a production page.** It stacks multiple states in one scroll. The production runner renders one card per state.

## JS contract

`log-outcome.js` — vanilla ES, zero deps, `data-*` attachment, bubbling `CustomEvent`s, programmatic API on `el._logOutcome`. Full contract (wiring, events `logoutcome:save`/`logoutcome:edit`, API, a11y) is in the file header. Andrey reads + ports to Angular. It does NOT write to a backend — the consumer owns persistence (see `README.md` § Data shapes for the suggested write shape).

## How to know when a porting task is done

- DOM hierarchy + semantic class names match the abstract template pages
- ARIA preserved: `aria-label` on BP fields, `aria-describedby` linking input → warning, `aria-hidden` on the `/` separator, unit-toggle `aria-label` kept in sync
- Per-card independent save wired (not a form submit)
- Gentle out-of-range = warning + Save-stays-enabled (not a block, not a clinical alert)
- `flaggedOutOfRange` routes to cap-62 / clinician path, never to patient-facing UI
- No celebratory chrome introduced
- Optional-everything: empty Save is a no-op

If any criterion cannot be met, surface the gap. Substitute content / structure / behavior is failure mode.

## Where to find the canonical spec for this slice

- Capability: `Knowledge/Projects/Cena Health/Partners/UCONN Health/capabilities/development/cap-20-self-reported-outcomes.md`
- Measures (Care tier): `…/development/candidate-measures.md` §3.2
- Flow doc (design intent; agentic/post-launch): `…/development/flows/flow-log-outcome.md`
- Cross-cutting principles: `Knowledge/Projects/Cena Health/Apps/Patients/chat-affordance-principles.md`
- Shell decision (inherited): [`../assessments/SHELL-DECISION.md`](../assessments/SHELL-DECISION.md)
- Plan: `~/.claude/plans/cena-uconn-measurements-ui.md`

When those paths are not accessible to your environment, the per-page HTML comment blocks + this AGENTS.md + the slice `README.md` carry the load-bearing spec.
