# Slice 3 — Log a check-in (self-reported outcomes)

Patient-facing self-reported-outcomes log for the UConn pilot (cap-20). Deterministic structured form — the patient adds optional, dated measures (weight, blood pressure, A1C) plus a free-form check-in note.

## What this is

A "log a check-in" surface, **one card per measure**. Each card (weight / BP / A1C / note) is independently fillable and savable — there is no single batched submit. All measures are optional and opportunistic: the patient logs what they have and skips the rest. The care team (RDN + coordinator) reads the values between the scheduled assessment windows to steer care.

**Scope = Care tier only** (per `candidate-measures.md` §3.2):
- Weight (self-report, periodic) — RDN plan adjustment + trend
- Blood pressure (if the patient has a cuff) — cardiometabolic signal
- A1C (when the patient has a recent lab) — glycemic trend
- Free-form check-in — coordinator's weekly-check-in input

**Out of scope (deliberately):**
- **Agentic chat version** — `flows/flow-log-outcome.md` specs a conversational, contextual-attribute capture flow. That is **post-launch**. This slice is the pre-agentic deterministic MVP per cap-20 ("ship a small structured form, dated, optional + notes textarea"). The flow doc is design-intent/tone reference, not the build spec.
- **Compliance tier** (HFIAS / WHOQOL / GNKQ-R) — shipped as the [`assessments/`](../assessments/) slice.
- **Evidence tier** (viral load, ART adherence, utilization) — EHR/lab linkage, not patient self-report; deferred pending the PI's endpoint declaration. See `candidate-measures.md` §3.3–§4.5.
- **Trends surface, custom care-plan fields, cap-62 alerting, voice input** — all post-MVP (`flow-log-outcome.md` § Future scope).

## States

No wireframe exists for log-outcome (only `take-assessment.*` and `meal-ordering.*`); the states below were authored from cap-20 + `candidate-measures.md` §3.2. Each is a separate HTML page demonstrating the structural shape.

### Abstract template pages — in the responsive app shell

Both wrap their state in the **responsive app shell** (`layout-app-shell-responsive.html`), the same shell as assessments. The rationale carries over directly from [`../assessments/SHELL-DECISION.md`](../assessments/SHELL-DECISION.md): this is a deterministic form with no live agent / chat during entry, so the agentic shell's chat-primary right-pane affordance is structurally inert. The single agent framing sentence renders inline as `patient-chat-message` above the cards.

| State | File | What it shows |
|---|---|---|
| Fillable | [`log-outcome.form.html`](./log-outcome.form.html) | The working surface — all four measure cards in their empty/fillable state. Interactive (wired to `log-outcome.js`): type a value, toggle units, Save → the card swaps to its saved read-back. |
| Saved | [`log-outcome.confirm.html`](./log-outcome.confirm.html) | The per-card saved state — value read back + timestamp + Edit, plus the calm acknowledgement message. Shows a realistic mixed state (weight + note saved; BP + A1C untouched). |

### Resolved instance — single-page narrative demo

| File | What it demonstrates that the abstract templates can't |
|---|---|
| [`log-check-in.html`](./log-check-in.html) | Walks fillable → **gentle out-of-range confirm** → saved → BP paired input → A1C out-of-range → note saved → acknowledgement, top-to-bottom with representative content (demo patient Maria Rivera). Does **not** wrap in the shell (scrollable narrative). Do not port as a production page — the production runner renders one card per state. |

## State transitions

```
[fillable card] ── type a value + tap Save
      │
      ├─ value plausible ───────────────► [saved card]  (read-back + Edit)
      │
      └─ value far from last / out of band ─► [gentle warning]  (amber, Save STILL enabled)
                                                   │
                                          tap Save again ──► [saved card]
[saved card] ── tap Edit ──► [fillable card]
```

Each card runs this independently. There is no cross-card submit or completion gate.

## CSS — semantic classes used

All exist in `packages/design-system/src/styles/tokens/components.css`. This slice added **no** new classes (Tier 2 composition). Copy these into Angular component styles or import the haven-ui CSS directly.

**Shell:** `app-shell`, `app-shell-frame`, `app-shell-sidebar`, `app-shell-main`, `app-shell-content`, `app-shell-bottom-nav`, `nav-*`, `mobile-bottom-nav*` — identical to the assessments slice.

**Measure card (app-local composition of existing primitives):**
- `.card`, `.card-header`, `.card-body`
- `.field-row`, `.field-label`, `.field-input-group`, `.field-addon`, `.field-help` — labeled inputs + unit addons
- `.field-row-warning`, `.field-warning` — amber, non-blocking gentle out-of-range confirm
- `.trend-snippet-list` (`-body`, `-title`, `-row`, `-row-when`, `-row-value`) — last 3–5 dated values, the typo-catch aid (gap-doc R-27)
- `.patient-chat-message` — inline agent framing + acknowledgement
- `.btn-primary` (Save — a *commitment*, so primary teal per DESIGN.md), `.btn-ghost`/`.btn-sm` (Edit)

The measure-card is an app-local composition (not a new PL primitive), consistent with the assessments slice's `questionnaire-panel` carve-out. If a second flow needs the same shape, promote it to the PL then.

## JS contracts

- [`log-outcome.js`](./log-outcome.js) — vanilla ES module, zero deps. Drives `log-outcome.form.html`. Handles unit toggle, per-card save, the fillable↔saved transition, and the gentle out-of-range confirm. Wiring contract, custom events (`logoutcome:save` / `logoutcome:edit`), and programmatic API (`el._logOutcome`) are documented in the file header. Andrey reads + ports to an Angular service/component.
- Follows haven-ui's "Vanilla JS per primitive" convention (`data-*` attachment, bubbling `CustomEvent`s with structured `detail`, programmatic API on `el._<name>`). See `Lab/haven-ui/CLAUDE.md` § "Vanilla JS per primitive."

## Data shapes

Inputs/outputs the runner deals in. Receiving framework binds these to its state model + Firebase write:

```typescript
type MeasureKey = 'weight' | 'bp' | 'a1c' | 'note';

interface MeasureDraft {
  measure: MeasureKey;
  value: string | { sys: string; dia: string };  // string for weight/a1c/note; pair for bp
  unit: 'lb' | 'kg' | '%' | 'mmHg' | null;        // null for note
  date: string | null;                            // ISO date for weight/bp/a1c; null for note
}

// Emitted on logoutcome:save (CustomEvent.detail)
interface LogOutcomeSave extends MeasureDraft {
  outOfRange: boolean;                            // true if the gentle band/delta check flagged it
}

// Suggested persisted shape (consumer-owned; the runner does not write)
interface SelfReportedOutcome {
  id: string;
  patientId: string;
  measure: MeasureKey;
  value: string | { sys: number; dia: number };
  unit: string | null;
  observedAt: string;                             // patient-stated date of the reading
  loggedAt: number;                               // Date.now() at save
  flaggedOutOfRange: boolean;                     // routes to cap-62 alerting downstream, NOT shown to patient
}
```

## Port notes

- The composite is a **content area**, not a route. Wire to your Angular routing as fits the patient app shell.
- **Each measure saves independently.** Model per-card save, not a form submit. A patient may log only weight today, only a note tomorrow.
- **Out-of-range is a gentle confirm, never a block.** The warning is a typo-catch. The Save action must stay enabled. Clinical alerting on out-of-range values is **cap-62's** job, server-side, downstream of capture — never gate or alarm the patient in this flow. Patient-facing copy never diagnoses.
- **No celebration.** No streaks, no "great job", no gamification. This cohort (HIV+, food-insecure, chronic stress) may read cheerleading as patronizing. The acknowledgement is calm and names where the data goes (`flow-log-outcome.md` Decisions log).
- **Showing the patient their own logged value is correct** — it is their data. This is distinct from the assessments no-score invariant (which hides a *computed clinical score*); there is no computed score in self-report logging.
- **Plausible bands in `log-outcome.js` are typo-catch heuristics, not clinical thresholds.** Tune with clinical input; keep them wide.

## Open issues

- **MVP attribute set** — weight / BP / A1C / note per cap-20 + `candidate-measures.md` §3.2. The contract-required subset vs. nice-to-have is still an Aaron/Vanessa/Dieckhaus question (`flow-log-outcome.md` § Open for Aaron). A1C + custom fields ride the same patterns if added.
- **Concerning free-form content** (acute distress in a note) — out of scope here; routes via the cap-50 escalation pathway. Same boundary as the WHOQOL distress-signal gap (`candidate-measures.md` §4.3). Worth a dedicated scoping pass before this ships beyond demo.
- **Trends surface** — the `trend-snippet-list` is the demo-tier read; a full trends view (sparklines, care-team annotations) is post-MVP.
- **Unit memory** — the runner toggles units per session; production should remember the patient's last-used unit (chat-affordance principle).

## Canonical references

- Capability: `Knowledge/Projects/Cena Health/Partners/UCONN Health/capabilities/development/cap-20-self-reported-outcomes.md`
- Measures (Care tier): `…/development/candidate-measures.md` §3.2
- Flow doc (design intent / agentic version, post-launch): `…/development/flows/flow-log-outcome.md`
- Cross-cutting principles: `Knowledge/Projects/Cena Health/Apps/Patients/chat-affordance-principles.md`
- Shell decision (inherited): [`../assessments/SHELL-DECISION.md`](../assessments/SHELL-DECISION.md)
- Pattern library: `Lab/haven-ui/packages/design-system/pattern-library/COMPONENT-INDEX.md`
- Plan: `~/.claude/plans/cena-uconn-measurements-ui.md`
