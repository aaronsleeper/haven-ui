# AGENTS.md — Satisfaction survey slice (cap-09)

For AI coding agents working with this slice. Read `../AGENTS.md` first for bundle-wide conventions, then this file.

## What this slice is

A patient-facing satisfaction questionnaire runner for the UConn pilot. Delivered at Months 3, 6, and 9. One runner; instrument variation lives in data. Structurally identical to the assessments slice (`../assessments/`) — reuse was the design goal; no new primitives were introduced.

## Relationship to the assessments slice

This slice is **Tier 2 (slice composition)** — it composes existing PL primitives only. The assessments slice is the pattern source; the satisfaction slice is a configured instance of the same runner pattern.

Key deltas from the assessments runner:
- No identity-capture state (satisfaction survey has no pre-consent step).
- Adds `inputType: 'emoji-scale'` to drive the `.emoji-scale` PL primitive (already in `haven.css`). The assessments runner didn't need it; the satisfaction runner adds the branch.
- Single outcome variant (`submitted`) — no clinical routing, no early-exit predicates.
- No sensitive-register distress-signal talk-to-a-person bridge in the confirmation (the satisfaction register is lower stakes than the HFIAS/WHOQOL sensitive register).

The runner file is `satisfaction-runner.js`. It is a documented copy-and-configure of `../assessments/assessment-runner.js` — the file header states the delta explicitly.

## Nav tab: none

The satisfaction survey has no nav tab. It surfaces from Home (or Activity) when the program triggers the M3/M6/M9 milestone. The 3-tab nav (Home · Order · Activity) is always the surrounding chrome. There is no "Health check" tab in this slice.

## Shell decision

Same as assessments: `layout-app-shell-responsive.html` (deterministic form; no live chat pane during administration). Chat renders only as static `patient-chat-message` blocks (entry framing, confirmation acknowledgement). Rationale: same as the assessments shell decision (SHELL-DECISION.md in assessments slice) — the questionnaire IS the primary task; the chat pane affordance is structurally inert here.

## Hard invariants

These match the assessments slice. Violating any one breaks the spec.

- **No score shown to the patient at the confirm step.** Score routes to the clinician surface (cap-51) via the backend payload. The `assessment:submit` event carries the answers for the backend. The DOM shows only "submitted, your care team has it."
- **No "Not now" chip at preflight.** Patient defers by closing the view or navigating away. No affordance for deferral in the runner UI.
- **Agent push only — never spontaneous.** The survey surfaces only after a program trigger (M3/M6/M9 milestone). It does not self-surface, does not have a nav tab, does not appear in the home view unless triggered.
- **Satisfaction register copy** — frames feedback as how-we-improve, not as a test of the patient. Copy is plain, warm, 2nd-person, ~5th–6th grade. No jargon, no gamification, no streaks.

## Provisional content

The item set in `satisfaction-runner.js` `DEFAULT_SURVEY_INSTANCE` is **provisional placeholder content**. Final items require Vanessa's input. Do not treat any item's `promptText` as approved copy until Vanessa signs off. See README.md for full note.

## Data shapes

Same as assessments runner, minus the `identity-form` inputType. New shape for satisfaction:

```typescript
interface SurveyItem {
  id: string;
  promptText: string;
  inputType: 'likert-5pt' | 'emoji-scale';
  options?: { value: string; label: string; index: number }[];      // for likert-5pt
  emojiOptions?: { value: string; emoji: string; label: string }[]; // for emoji-scale
  required: boolean;
}

interface SurveyInstance {
  id: string;                    // e.g. "satisfaction-month-3"
  plainLanguageName: string;
  itemCount: number;
  timeEstimateMinutes: number;
  sensitivityRegister: 'satisfaction';
  items: SurveyItem[];
}
```

## Porting notes

- The runner is vanilla ES (no deps). Port to Angular as a service or component the same way as the assessment runner — the `assessment:state-change`, `assessment:answer`, `assessment:submit`, `assessment:save-pause` CustomEvent contract is identical.
- The `el._assessment` programmatic API is identical: `getState()`, `getAnswers()`, `reset()`.
- The emoji-scale items use native `<input type="radio">` with `class="sr-only"` (accessible); the `:has(input:checked)` CSS pattern on `.emoji-scale-option` drives the selected state. No JS selection-state management needed beyond firing the `change` listener.
- The confirmation step has ONE variant (`data-confirm-variant="submitted"`). No outcome routing, no variant switching.
- The no-score invariant is enforced in the runner: `assessment:submit` carries `answers` for the backend; the runner transitions to confirm; confirm renders the static receipt. The score is never computed or stored in the DOM.

## How to know when a porting task is done

- DOM hierarchy + semantic class names match `take-survey.preflight.html` / `take-survey.question.html` / `take-survey.confirm.html` exactly.
- ARIA attributes preserved verbatim (`aria-checked`, `role="radiogroup"`, `role="radio"`, `aria-valuemin/max/now/text` on the progress bar).
- No score surface in any confirm variant.
- Satisfaction register copy wired (preflight: "be honest — this is how we improve"; confirm: "your care team has it" — no outcome label).
- `assessment:submit` event fires with `{ instanceId, answers }` on submit.
- `el._assessment` API available on the root element.
- The `[VERIFY]` provisional flag on all item copy resolved (Vanessa sign-off) before shipping to patients.

## Where to find canonical spec

- cap-09 spec: `Knowledge/Projects/Cena Health/Partners/UCONN Health/capabilities/development/cap-09-satisfaction-surveys.md`
- Assessments slice (pattern source): `../assessments/AGENTS.md`, `../assessments/assessment-runner.js`
- IA-v1 (Check-ins surface role + agent-push model): `~/.claude/plans/patient-app-ia-v1.md`
- Runner delta documented: `satisfaction-runner.js` file header
