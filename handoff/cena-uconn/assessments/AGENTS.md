# AGENTS.md — Assessments slice

For AI coding agents working with this slice. Read [`../AGENTS.md`](../AGENTS.md) first for bundle-wide conventions, then this file.

## What this slice is

A patient-facing questionnaire runner for the UConn pilot. One generalized runner administers four published clinical instruments + a pre-enrollment screener. The runner is structurally identical across instances; per-instrument variation lives in data + sensitivity register, not in separate runner code.

The slice covers cap-07 (multi-instrument assessment), cap-09 (satisfaction surveys, deferred to slice 2), and the pre-enrollment screener (operational; precedes IRB consent + program enrollment).

## The runner — four states + four registers

### Four states

Each state has its own abstract template page in this folder. The runner transitions between them; the production framework wires the state machine. **All four abstract template pages wrap in the agentic shell** (`layout-agentic-shell.html` from haven-ui PL): left rail = patient nav, center = chat thread, right = working surface (the runner state). The deterministic-first runner does not take free-text chat input, so `chat-input-area` is omitted from the chat panel; agent messages + button chips render in the thread. When agentic chat lands later, `chat-input-area` slots in below `chat-thread` per the PL spec — no rebuild of the right-pane runner is needed.

- **Step 1 — Entry** ([`take-assessment.entry.html`](./take-assessment.entry.html)) — agent surfaces the due assessment at greeting; right pane primes the preflight card. Two condition variants: `assessment-due-first-pass` and `assessment-due-resume`. Resume copy includes a stale-prefix when the last touch was more than ~7 days ago.
- **Step 2 — Preflight** ([`take-assessment.preflight.html`](./take-assessment.preflight.html)) — per-register tone framing in chat; preflight card mirrors the chat chip in the right pane. The CTA relabels from "Start the questionnaire" → "I'm ready" semantically (visually identical).
- **Step 3 — Question administration** ([`take-assessment.question.html`](./take-assessment.question.html)) — the working surface. Chat is silent unless the patient asks for help (mid-question-help is a `variant` of `agent-message`). Right pane composes assessment-header + progress-bar-pagination + a `card`-shaped questionnaire panel containing response-option-group(s) + pagination-row + (on last item) submit-region.
- **Step 5 — Submit confirmation** ([`take-assessment.confirm.html`](./take-assessment.confirm.html)) — per-register acknowledgement in chat; assessment-confirmation card in right pane. **HARD INVARIANT: no score is shown to the patient.** The score routes to the clinician surface (cap-51) asynchronously.

State 4 (save/resume) is a behavioral re-entry into Step 3 with `assessment.lastUnansweredIndex`, not a separate state with its own page.

### Four sensitivity registers

The runner reads `instrument.sensitivityRegister` to select per-state copy. Exactly one register applies per instrument instance.

- **`sensitive`** — HFIAS, WHOQOL-HIV BREF. Personal questions; copy grants permission ("answer how things actually are"); confirmation includes "talk to a person" bridge.
- **`knowledge-quiz`** — GNKQ-R. Knowledge questions with right answers; copy reframes ("a check of the program, not a check of you"); no correctness feedback shown to patient.
- **`satisfaction`** — satisfaction survey, slice 2. Copy frames feedback ("be honest — this is how we improve").
- **`screener`** — pre-enrollment screener. Distinct from the other three because the patient has not yet enrolled (no care relationship). Disclosure copy uses "program team," not "care team." Confirmation copy varies by outcome path (eligible / not-eligible / refer-to-team) without naming the classification.

The per-register copy is wired into each abstract template page. See per-state HTML comment blocks for the resolved copy keys.

## Resolved instance pages — what each demonstrates

The four resolved instance pages in this folder walk all four states top-to-bottom for one specific instrument with primary-source content. Read these to understand what real content looks like in the runner; do NOT port them as production pages.

| Instance | Why it exists |
|---|---|
| [`take-screener.html`](./take-screener.html) | Demonstrates the `screener` register (preflight + 3 outcome-path-differentiated confirmation variants), the early-exit predicate on Q1 (eligibility gate), and the program-team disclosure |
| [`take-hfias.html`](./take-hfias.html) | Demonstrates the two-step occurrence → frequency skip logic that's unique to HFIAS. Q1 occurrence "Yes" reveals Q1a frequency follow-up; "No" advances to Q2. |
| [`take-whoqol.html`](./take-whoqol.html) | Demonstrates per-item response-scale variation. WHOQOL has 5 distinct response scales across 31 items; the runner reads each item's `responseScale` field and renders matching options. The instance page renders 2 different scales on the same Step 3 page to make the variation visible. |
| [`take-gnkq.html`](./take-gnkq.html) | Demonstrates the multi-section structure (4 sections, 88 scored items) and the food-list multi-item pattern (one prompt → N sub-items, each its own radio group). |

## Hard invariants

These are not stylistic preferences. They are load-bearing rules from clinical / governance / brand panel verdicts. A ported runner that violates one breaks the spec.

- **No score shown to the patient at Step 5.** Scoring is clinical context; it routes to the clinician surface (cap-51), not the patient. The PL primitive `assessment-confirmation` encodes this structurally.
- **Two interaction paths are always available during question administration.** Patient can answer questions directly in the right pane OR ask the agent in chat for clarification. Both paths edit the same answer set; the chat path uses `agent-message variant="mid-question-help"` and does NOT re-render the question in chat.
- **No "Not now" chip at Step 1 entry.** Per chat-affordance-principles: affordances render only when they are a productive next move. Patient defers by closing the chat or navigating away.
- **Screener disclosure says "program team," not "care team."** Pre-enrollment patients have no care relationship; "care team" is factually wrong and HIPAA-misleading. Wired via `disclosure-key="copy.preflight-disclosure-screener"` for `instrument.sensitivityRegister == 'screener'`. Same applies to the confirmation card's care-team-disclosure.
- **Screener answers route to a separate backend payload destination from cap-07 instrument data.** Screener data is pre-consent operational (HIPAA TPO, not Common Rule research). Access controls scope to the enrollment team, not the full RDN/research team. Front-end runner is shared; backend routing is distinct.
- **No correctness feedback shown to the patient on knowledge-quiz items (GNKQ-R).** Items use `feedback-on-select="false"`; correctness is computed at submit and never surfaced.

## Per-item early-exit predicates

The runner supports per-item declarations of `early-exit-when="<predicate>" → outcome="<class>"`. When the predicate evaluates true at answer time, the runner skips remaining items and transitions to Step 5 with the named outcome.

Currently used by:
- Screener Q1 — `early-exit-when="answer == 'no'" → outcome="not-eligible"` and `early-exit-when="answer == 'i-rather-not-say'" → outcome="refer-to-team"`. Q1 is the HIV-status hard gate.

Outcome instruments (HFIAS / WHOQOL / GNKQ-R) declare no early-exit predicates. Implementing agents should encode early-exit as a runner-level item-property, not a screener-specific carve-out — the contract generalizes for future instruments with eligibility gates.

## Data shapes

The runner accepts these shapes. Receiving framework binds these to its state model:

```typescript
interface AssessmentInstance {
  id: string;                         // e.g., "hfias-month-0", "screener-pre-enrollment"
  plainLanguageName: string;          // patient-facing display name
  plainLanguageFrame: string;         // one-line frame for entry message
  itemCount: number;                  // total questions
  timeEstimateMinutes: number;        // time estimate for preflight
  sensitivityRegister: 'sensitive' | 'knowledge-quiz' | 'satisfaction' | 'screener';
  groupingMode: 'one-per-screen' | 'grouped-3-to-5';
  items: AssessmentItem[];
}

interface AssessmentItem {
  id: string;
  promptText: string;                 // verbatim from primary source
  inputType: 'frequency-likert' | 'likert-5pt' | 'multi-choice-knowledge';
  responseScale?: ResponseOption[];   // per-item scale (WHOQOL uses 5 distinct; HFIAS uses 1)
  options?: ResponseOption[];         // for multi-choice items
  required: boolean;
  skipLogic?: {                       // HFIAS pattern: occurrence Yes reveals frequency follow-up
    revealItemId: string;             // item id to reveal on this answer
    revealWhen: string;               // matching answer value
  };
  earlyExitWhen?: {                   // screener Q1 pattern
    answer: string;
    outcome: string;
  }[];
}

interface ResponseOption {
  value: string;                      // machine value
  label: string;                      // patient-facing label (full text, no number alone)
  index: number;                      // display order
}

interface AssessmentSession {
  instanceId: string;
  status: 'pending' | 'in-progress' | 'submitted';
  startedAt?: number;
  lastTouchedAt?: number;
  submittedAt?: number;
  currentItemIndex: number;
  lastUnansweredIndex: number;
  answers: Record<string, string>;
  outcome?: string;                   // computed at submit; screener only
}
```

The `textarea-soft` input type is reserved for slice 2 (satisfaction); slice-1 runner does not render it. If an instance's `inputType == 'textarea-soft'` reaches the runner in slice 1, surface as out-of-scope.

## Open issues — Aaron-pending; not in slice 1

These are documented gaps the receiving team should know exist but should NOT try to resolve unilaterally:

- **GNKQ-R 3 image-dependent items** (Section 3 Q12 nutrition-label compare; Section 3 Q13 ingredient-list sugar; Section 4 Q16 apple-vs-pear body shape). Slice 1 ships 85 of 88 GNKQ-R items. Cena will source digital equivalents or substitute culturally-equivalent items in a follow-up. See `instrument-content-primary-sources.md` § Open Issues.
- **GNKQ-R Section 5 — UK ethnicity adaptation.** Section 5 (unscored demographics) uses UK ethnicity categories. US deployment needs adaptation to US Census / HHS standards. Pending Cena decision.
- **Screener Q2 routing** ("UConn Health patient — No"). Currently `refer-to-team` (referral pathway may still permit eligibility). Pending Vanessa / Dieckhaus on whether the pilot strictly requires UConn Health main-campus patients.
- **Distress-signal escalation cap-XX** (named Gap Gate item from clinical-care panel verdict CC-01). For WHOQOL specifically, the Step 5 "talk to a person" bridge is the current backstop; when the cap lands, wire it to the WHOQOL submission path FIRST, HFIAS second.
- **HEI questionnaire portion** (cap-07 / cap-08 ambiguity). May collapse entirely into cap-08 (24-hour dietary recall, agent-driven). Pending Dieckhaus.
- **Satisfaction survey** (cap-09, Months 3/6/9). Vanessa-input content; deferred to slice 2.
- **Free-text-input primitive** (textarea-soft input type). Deferred to slice 2 with satisfaction. When promoted, evaluate cross-flow scope (build-companion lists it across take-assessment, log-outcome, respond-to-cc — three flows).

## How to know when a porting task is done

For each artifact you port from this slice, completeness means:

- DOM hierarchy + semantic class names match the abstract template page exactly
- ARIA attributes are preserved verbatim (`aria-checked`, `aria-describedby`, `aria-valuenow`, `aria-valuetext`, `aria-labelledby`, `role="radiogroup"`, `role="radio"`, etc.)
- Per-register dispatch logic is wired (the four sensitivity registers select copy + disclosure variants; do not collapse to a single message)
- Hard invariants above are honored
- Skip logic (HFIAS) is wired item-by-item, not faked at the runner level
- Per-item response-scale (WHOQOL) is read from data, not hardcoded
- Per-item early-exit (screener Q1) is wired as a runner-level property, not a screener-specific carve-out
- Submit-time scoring computes the score + routes to the clinician surface; patient sees only the no-score acknowledgement
- The `[VERIFY]` tags that remain in the bundle (none currently for HFIAS/WHOQOL/GNKQ-R since primary-source landed; none for screener since content is Aaron-approved best-guess) are resolved before that artifact ships to patients

If any criterion cannot be met, surface the gap explicitly. Substitute content / structure / behavior is failure mode.

## Where to find the canonical spec for this slice

- Wireframes: `Knowledge/Projects/Cena Health/Partners/UCONN Health/capabilities/development/wireframes/take-assessment.step-{1-entry,2-preflight,3-question,5-submit-confirm}.mdoc`
- Component-map: `Knowledge/Projects/Cena Health/Partners/UCONN Health/capabilities/development/wireframes/component-map-take-assessment.md`
- Panel verdicts: `Knowledge/Projects/Cena Health/Partners/UCONN Health/capabilities/development/wireframes/panel-verdicts-take-assessment-{structural,clinical}.md`
- Flow doc (design intent): `Knowledge/Projects/Cena Health/Partners/UCONN Health/capabilities/development/flows/flow-take-assessment.md`
- Instrument content: `Knowledge/Projects/Cena Health/Partners/UCONN Health/capabilities/development/instrument-content-primary-sources.md`
- Screener content: `Knowledge/Projects/Cena Health/Partners/UCONN Health/capabilities/development/screener-pre-enrollment-content-draft.md`
- Cross-cutting principles: `Knowledge/Projects/Cena Health/Apps/Patients/chat-affordance-principles.md`
- cap-07 (multi-instrument assessment): `Knowledge/Projects/Cena Health/Partners/UCONN Health/capabilities/development/cap-07-multi-instrument-assessment.md`
- cap-09 (satisfaction): same directory, `cap-09-satisfaction-surveys.md`
- cap-12 (IRB consent): same directory (consent capture runs through CC + Athena, not Cena platform — relevant for screener data routing)

When those paths are not accessible to your environment, the per-page HTML comment blocks + this AGENTS.md + the slice `README.md` carry the load-bearing spec.
