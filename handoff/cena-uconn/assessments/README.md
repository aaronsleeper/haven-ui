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

### Runner template — abstract states inside the responsive app shell

The 4 abstract template pages each wrap their state in the **responsive app shell** (`layout-app-shell-responsive.html` from haven-ui PL). The 4-expert UX panel verdict 2026-05-14 PM is in [`SHELL-DECISION.md`](./SHELL-DECISION.md) — switched from agentic-shell to responsive-app-shell because the assessment runner is a deterministic multi-step form with no live agent / chat surface during admin (chat would carry only a single pre-scripted framing sentence; agentic-shell's right-pane affordance is structurally inert here).

Each page renders the production-equivalent surround:

- Desktop sidebar (≥lg): `app-shell-sidebar` — patient nav (Home, Health check, Meals, Care, Messages) + pinned-bottom "Talk to a person" + user menu
- Content region: `app-shell-content` — the state's working surface (any pre-flow agent framing renders inline above the working surface as `patient-chat-message`)
- Mobile bottom nav (<lg): `app-shell-bottom-nav` — same 5 nav items rendered as horizontal tabs
- Topbar omitted: patient app is English-only at pilot, no language toggle / no notifications surface for this slice

The shell uses the sensitive register (HFIAS / WHOQOL framing) by default and renders representative copy per state. Instrument content is HFIAS Q3a (the only non-placeholder; primary-source via SPIROMICS III). For per-instrument content variation across the four states top-to-bottom, see the resolved instance pages in the next section.

| State | File | Wireframe |
|---|---|---|
| 1. Entry | [`take-assessment.entry.html`](./take-assessment.entry.html) | [`take-assessment.step-1-entry.mdoc`](../../../../Knowledge/Projects/Cena Health/Partners/UCONN Health/capabilities/development/wireframes/take-assessment.step-1-entry.mdoc) |
| 2. Preflight | [`take-assessment.preflight.html`](./take-assessment.preflight.html) | [`take-assessment.step-2-preflight.mdoc`](../../../../Knowledge/Projects/Cena Health/Partners/UCONN Health/capabilities/development/wireframes/take-assessment.step-2-preflight.mdoc) |
| 3. Question | [`take-assessment.question.html`](./take-assessment.question.html) | [`take-assessment.step-3-question.mdoc`](../../../../Knowledge/Projects/Cena Health/Partners/UCONN Health/capabilities/development/wireframes/take-assessment.step-3-question.mdoc) |
| 5. Confirm | [`take-assessment.confirm.html`](./take-assessment.confirm.html) | [`take-assessment.step-5-submit-confirm.mdoc`](../../../../Knowledge/Projects/Cena Health/Partners/UCONN Health/capabilities/development/wireframes/take-assessment.step-5-submit-confirm.mdoc) |

State 4 (save/resume) is a behavioral re-entry into State 3 with `assessment.lastUnansweredIndex`, not a separate page.

Cross-slice shell-divergence note: assessments uses `layout-app-shell-responsive.html` (deterministic, single content area). Meals will use `layout-agentic-shell.html` (chat-primary; cart vs menu is a genuine two-surface problem). The sidebar nav-item family is identical in both shells (`.nav-header`, `.nav-section`, `.nav-item`), so the sidebar chrome reads as continuous; what changes is the content column's shape per the slice's interaction model. Documented in [`SHELL-DECISION.md`](./SHELL-DECISION.md).

### Resolved instances — single-page narrative demos with primary-source content

Each instance page walks the 4 runner states top-to-bottom for one specific instrument, with primary-source content (verbatim, cited) and the per-instrument structural shape that the abstract template can't show. **These pages do not wrap in the agentic shell** — they're scrollable narratives where the shell would compete with the per-state stacking. For shell context, see the abstract template pages above.

| File | Instrument | What it demonstrates that the abstract template doesn't |
|---|---|---|
| [`take-screener.html`](./take-screener.html) | Pre-enrollment screener (6 questions; Aaron-approved 2026-05-14 PM) | Screener register copy variants (preflight + 3 outcome-path confirmations); Q1 eligibility-gate with early-exit predicate |
| [`take-hfias.html`](./take-hfias.html) | HFIAS — Coates/Swindale/Bilinsky 2007 (via SPIROMICS III implementation) | Two-step occurrence → frequency skip logic (Q1 Yes reveals Q1a; No advances to Q2). 9 occurrence questions; 4-category HFIAP scoring computed at submit. |
| [`take-whoqol.html`](./take-whoqol.html) | WHOQOL-HIV BREF — WHO/MSD/MER/02.2 2002 | Per-item response-scale variation (5 distinct scales across 31 items; runner reads each item's `responseScale` field). 6-domain scoring; 6 items reverse-scored. Foregrounded talk-to-a-person bridge per CC-01 distress-signal verdict. |
| [`take-gnkq.html`](./take-gnkq.html) | GNKQ-R — Kliemann et al. 2016 EJCN open-access | Multi-section structure (4 sections, 88 scored items); food-list multi-item pattern (one prompt → N sub-items, each its own radio group). 3 image-dependent items + Section 5 UK ethnicity adaptation are Aaron-pending; not in slice 1. |

Source content for all 3 instruments: [`instrument-content-primary-sources.md`](../../../../Knowledge/Projects/Cena Health/Partners/UCONN Health/capabilities/development/instrument-content-primary-sources.md). Source content for the screener: [`screener-pre-enrollment-content-draft.md`](../../../../Knowledge/Projects/Cena Health/Partners/UCONN Health/capabilities/development/screener-pre-enrollment-content-draft.md).

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
