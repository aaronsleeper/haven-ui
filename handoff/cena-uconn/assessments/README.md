# Slice 1 — Assessments

Take-assessment runner covering four instruments + a pre-enrollment screener for the UConn pilot.

## What this is

A patient-facing questionnaire runner with four states (entry → preflight → question administration → submit confirmation). One generalized shape across all five variants — per-instrument differences live in data (instrument name, item count, time estimate) and copy register (sensitive / knowledge-quiz / satisfaction / screener).

**In scope this slice:**
- HFIAS (Household Food Insecurity Access Scale) — sensitive register
- WHOQOL-HIV BREF (Quality of Life) — sensitive register
- NKQ Short Form (Kliemann 2016 GNKQ-R) — knowledge-quiz register
- Pre-enrollment screener — screener register (consent-and-orientation framing)

**Deferred to slice 2:**
- Satisfaction survey (Vanessa-input content)
- HEI questionnaire portion (cap-07/cap-08 ambiguity pending Dieckhaus)
- 24-hour dietary recall (cap-08, agent-driven)

## States

Each state is a separate HTML page in this folder. The wireframes specify dynamic transitions; the static HTML pages demonstrate the structural shape per state for hand-port purposes.

| State | File | Wireframe | Purpose |
|---|---|---|---|
| 1. Entry | [`take-assessment.entry.html`](./take-assessment.entry.html) | [`take-assessment.step-1-entry.mdoc`](../../../../Knowledge/Projects/Cena Health/Partners/UCONN Health/capabilities/development/wireframes/take-assessment.step-1-entry.mdoc) | Agent surfaces the due assessment at greeting; right pane primes preflight |
| 2. Preflight | [`take-assessment.preflight.html`](./take-assessment.preflight.html) | [`take-assessment.step-2-preflight.mdoc`](../../../../Knowledge/Projects/Cena Health/Partners/UCONN Health/capabilities/development/wireframes/take-assessment.step-2-preflight.mdoc) | Per-register tone framing; preflight card mirrors the chat chip |
| 3. Question | [`take-assessment.question.html`](./take-assessment.question.html) | [`take-assessment.step-3-question.mdoc`](../../../../Knowledge/Projects/Cena Health/Partners/UCONN Health/capabilities/development/wireframes/take-assessment.step-3-question.mdoc) | Question administration — the working surface |
| 5. Confirm | [`take-assessment.confirm.html`](./take-assessment.confirm.html) | [`take-assessment.step-5-submit-confirm.mdoc`](../../../../Knowledge/Projects/Cena Health/Partners/UCONN Health/capabilities/development/wireframes/take-assessment.step-5-submit-confirm.mdoc) | Submit acknowledgement; per-register confirmation; no score shown |

State 4 (save/resume) is a behavioral re-entry into State 3 with `assessment.lastUnansweredIndex`, not a separate page.

## State transitions

```
[step-1 entry] → tap "Start" / "Begin" / "Keep going"
       ↓
[step-2 preflight] → tap "I'm ready" / "Begin"
       ↓
[step-3 question] → answer items; "Submit answers" (last item, when allRequiredAnswered)
       ↓                 ↓
       │            (early-exit predicate: e.g., screener Q1='no' → outcome='not-eligible')
       ↓                 ↓
[step-5 submit-confirm] ←┘
       ↓
[idle: at-a-glance] (existing patient-week-panel composition; out of slice 1)
```

## CSS — semantic classes used

These classes live in `packages/design-system/src/styles/tokens/components.css`. Andrey copies these into Angular component styles or imports the haven-ui CSS directly.

**State-shared:**
- `.patient-chat-message` — agent message with dot-sparkle indicator
- `.chat-button-row` (single-button variant) — chat chip row
- `.chat-handoff-trigger` (`.is-header` desktop / `.btn-block` in `.sticky-footer` mobile) — talk-to-a-person trigger

**Steps 1, 2:**
- `.assessment-preflight-card` (and internals: `-body`, `-title`, `-meta`, `-meta-item`, `-disclosure`, `-actions`) — covers gap-doc R-25

**Step 3 (the working surface):**
- `.assessment-header` (`-title`, `-meta`)
- `.progress-bar-pagination` (`-segment`, `.is-filled`)
- `.response-option-group` (`-prompt`, `-list`)
- `.response-option` (`-index`, `-index-num`, `-label`, `-check`)
- `.pagination-row`
- `.card`, `.card-header`, `.card-body` — composing the questionnaire-panel app-local carve-out
- `.btn-primary`, `.btn-secondary`, `.btn-outline`, `.btn-ghost` — submit + advance + save-pause buttons

**Step 5:**
- `.assessment-confirmation` (composes `.receipt`) — covers gap-doc R-29; PL-encoded no-score invariant

## JS contracts

Vanilla JS modules from `packages/design-system/src/scripts/components/` carry primitive behavior. Andrey reads the contract + ports to Angular services / directives.

- `assessment.js` — questionnaire panel state machine (TBD; may need to author for slice 1 if existing module doesn't cover the runner)
- `assess-slider.js` — assessment slider primitive (used by `patient-assess-slider`; not in slice 1)
- Future per-slice: any new behavior modules ship alongside the HTML

Contract format follows haven-ui's "Vanilla JS per primitive" convention — `data-*` attribute attachment, dispatched `CustomEvent`s on the host element with detail shapes documented in the primitive's `@component-meta` block, programmatic API on `el._<primitiveName>`. See `Lab/haven-ui/CLAUDE.md` § "Vanilla JS per primitive."

## Data shapes

Inputs the runner expects:

```typescript
interface AssessmentInstance {
  id: string;                         // e.g., "hfias-month-0", "screener-pre-enrollment"
  plainLanguageName: string;          // patient-facing display name
  plainLanguageFrame: string;         // one-line frame for entry message
  itemCount: number;                  // total questions
  timeEstimateMinutes: number;        // time estimate for preflight
  sensitivityRegister: 'sensitive' | 'knowledge-quiz' | 'satisfaction' | 'screener';
  groupingMode: 'one-per-screen' | 'grouped-3-to-5';  // per item-presentation density
  items: AssessmentItem[];
}

interface AssessmentItem {
  id: string;                         // e.g., "hfias-q1"
  promptText: string;                 // question text (primary-source-verified for instruments)
  inputType: 'frequency-likert' | 'likert-5pt' | 'multi-choice-knowledge';  // textarea-soft DEFERRED
  options?: AssessmentOption[];       // for radio/multi-select inputs
  required: boolean;
  earlyExitWhen?: {                   // per-item early-exit predicate (e.g., screener Q1)
    answer: string;                   // matching answer value
    outcome: string;                  // outcome class to fire on match
  }[];
}

interface AssessmentOption {
  value: string;                      // machine value
  label: string;                      // patient-facing label (full text, no number alone)
  index: number;                      // display order
}

interface AssessmentSession {
  instanceId: string;
  status: 'pending' | 'in-progress' | 'submitted';
  startedAt?: number;                 // Date.now()
  lastTouchedAt?: number;
  submittedAt?: number;
  currentItemIndex: number;
  lastUnansweredIndex: number;        // for save-resume re-entry
  answers: Record<string, string>;    // itemId → answer value
  outcome?: string;                   // outcome class (computed at submit; screener only)
}
```

## Port notes

- The composite is a **content area**, not a route. Wire to your Angular routing as fits the agentic-shell composition.
- The runner is **deterministic**, not agentic, in slice 1. The chat-pane affordances (entry message, mid-question help, confirmation) render as static `<div class="patient-chat-message">` elements; no real-time agent behavior. When agentic chat lands, the runner state machine wires to chat events; the right-pane primitives don't change.
- The **no-score invariant** (Step 5) is a hard rule, not a UX choice. Patient never sees the computed score / outcome label. For the screener, the eligible / not-eligible / refer-to-team classification routes to the enrollment team via separate backend payload (per healthcare-data-governance verdict DG-01).
- **Screener data routing** is separate from cap-07 instrument data. Screener answers are pre-consent operational data (HIPAA TPO); the backend payload destination + access controls scope to the enrollment team only.

## Open issues

- **Instrument question content is `[VERIFY]`-tagged** until primary-source PDFs are sourced (HFIAS v3, WHOQOL-HIV BREF 2002, Kliemann 2016 GNKQ-R). Slice ships structurally with placeholder text; real content wires in when PDFs land.
- **Q2 routing for screener** ("UConn Health patient — No") routes to `refer-to-team` by default; pending Vanessa / Dieckhaus on referral pathway scope.
- **WHOQOL distress-signal escalation** (cap-XX) is a named Gap Gate item per clinical-care panel verdict CC-01; not implemented in slice 1.
- **Asset bundling** for self-contained zip ship to Andrey is TBD; current state references haven-ui CSS + JS via relative paths.

## Canonical references

- Wireframes: `Knowledge/Projects/Cena Health/Partners/UCONN Health/capabilities/development/wireframes/take-assessment.step-*.mdoc`
- Component map: `Knowledge/Projects/Cena Health/Partners/UCONN Health/capabilities/development/wireframes/component-map-take-assessment.md`
- Panel verdicts: `panel-verdicts-take-assessment-{structural,clinical}.md` (same directory)
- Screener content: `Knowledge/Projects/Cena Health/Partners/UCONN Health/capabilities/development/screener-pre-enrollment-content-draft.md`
- Flow doc: `Knowledge/Projects/Cena Health/Partners/UCONN Health/capabilities/development/flows/flow-take-assessment.md`
- Plan: `~/.claude/plans/cena-uconn-isolated-uis.md`
