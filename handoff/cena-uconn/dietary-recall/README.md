# Slice — Dietary recall (cap-08)

24-hour multiple-pass dietary recall for the UConn pilot. Agent-conducted interview that mirrors how an RDN would administer the AMPM methodology. Chat is the primary interaction surface; the right pane holds the running food list as the canonical record.

## Shell decision

**Shell: `app-shell` (patient responsive shell, nav SUPPRESSED) — per `apps/patient/design/wireframes/recall-01-interview.md`.**

Rationale: the dietary recall is a patient surface, not a coordinator console. The canonical wireframe (`recall-01-interview.md`, authored 2026-05-24) pins `app-shell` with nav suppressed — a focused agent-led moment analogous to the assessment runner. The prior `agentic-shell` (3-pane care-coordinator shell) was a pre-pivot description in `flow-dietary-recall.md §"Shell context"` and is superseded by the shell model (`surface-primary-shell-model.md`).

**Nav:** suppressed entirely. No 3-tab mobile bar, no 5-item sidebar rail. The shell renders content-only with a slim persistent header: a quiet "Back to Home" affordance (left) + a `chat-handoff-trigger.is-header` "Talk to a person" (right). The recall is a sensitive, focused moment — the handoff trigger stays close.

**Layout (two-region):**
- Desktop (≥lg): `layout-two-pane` + `layout-two-pane-grid` — conversation (420px left column) as the chat region + food-list (`patient-recall-list`) as the fluid right region. First grid child = conversation; second = food-list.
- Mobile (<lg): single-column `layout-two-pane-grid` — conversation is the viewport; food-list renders as a stacked section below. No Preline overlay / `hs-*` / `overlay-bottom-sheet`.

**Removed from all 6 files:** `app-shell--agentic`, `agentic-shell`, `panel-nav`, `panel-chat`, `panel-content`, `panel-splitter`, the 5-item nav (Home/Health check/Meals/Care/Messages), `chat-thread`/`chat-thread-inner` are retained as chat scaffolding inside the conversation section (they are not agentic-shell-specific; they are the conversation region's own structure), `chat-input-area` retained likewise.

**Canonical authority:** `apps/patient/design/wireframes/recall-01-interview.md` § Shell + nav and § Layout. The former `flow-dietary-recall.md §"Shell context"` section is stale (superseded by shell-model); the interaction sections of that flow doc remain canonical for pass logic and copy.

## States

Each state is a standalone HTML page. Each represents a single point-in-time during the multi-pass flow.

| State | File | Pass / Moment |
|---|---|---|
| Entry | `recall.entry.html` | Agent greeting + day-select chips (Yesterday / A different day) |
| Pass 1 | `recall.pass1.html` | Quick list — patient names foods freely; right pane grows with names only |
| Pass 3 | `recall.pass3.html` | Time/occasion — when column populating per item; time-of-day chips as aids |
| Pass 4 | `recall.pass4.html` | Detail/portion — amounts column populating; `chat-numeric-input` for servings |
| Review | `recall.review.html` | Final review — `patient-recall-list.is-locked`; agent verbal summary; submit button |
| Confirm | `recall.confirm.html` | Receipt — `log-confirmation-card` (no score, no HEI number) |

Pass 2 (forgotten foods) is not a separate static page — it uses the same markup shape as Pass 1 with different agent copy (see flow-dietary-recall.md §Step 3). The runner transitions between passes in the full single-page wiring.

## Composition — primitive classes used

All classes confirmed present in `../assets/haven.css` before use.

**Shell:**
- `.app-shell`, `.app-shell-frame`, `.app-shell-main`, `.app-shell-content`
- `.layout-two-pane`, `.layout-two-pane-grid`
- `.chat-handoff-trigger.is-header` (persistent header chip — right side)
- `.btn.btn-ghost.btn-sm` (Back to home — left side)

**Agent messages:**
- `.patient-chat-message`, `.patient-chat-message-indicator`, `.patient-chat-message-body`

**Chat affordances:**
- `.chat-chip-row`, `.chat-chip`, `.chat-chip.is-soft`, `.chat-chip-row.is-small` (time-of-day context probe, pass 3)
- `.chat-button-row`, `.chat-button-row.has-helper`, `.chat-row-helper` (submit + helper-consequence, review)
- `.chat-handoff-trigger`, `.chat-handoff-trigger.is-header` (persistent "talk to a person")
- `.chat-numeric-input`, `.chat-numeric-input-field`, `.chat-numeric-input-unit` (portion input, pass 4)
- `.chat-thread`, `.chat-thread-inner`, `.chat-input-area`
- `.btn-primary`, `.btn-secondary`

**Recall list (right pane — canonical record):**
- `.patient-recall-list`, `.patient-recall-list.is-locked`
- `.patient-recall-list-header`, `.patient-recall-list-header-day`, `.patient-recall-list-header-pass`
- `.patient-recall-list-rows`, `.patient-recall-list-row`
- `.patient-recall-list-row-name`, `.patient-recall-list-row-when`, `.patient-recall-list-row-amount`, `.patient-recall-list-row-trash`
- `.patient-recall-list-footer`, `.patient-recall-list-add`

**Receipt (confirm state):**
- `.log-confirmation-card`, `.receipt-icon`, `.receipt-title`, `.receipt-summary`, `.receipt-summary-row`, `.receipt-timestamp`

## Runner contract

`dietary-recall-runner.js` is the slice-scoped chat-driven multi-pass orchestrator. It is NOT a PL primitive — analogous to `assessment-runner.js` but maintains a `FoodItem[]` state across passes and sequences agent messages per pass.

### State shape

```typescript
interface FoodItem {
  id: string;         // auto-generated slug: "item-0", "item-1", …
  name: string;       // food/drink name as patient said it
  when?: string;      // time + occasion (populated in pass 3)
  amount?: string;    // portion + preparation (populated in pass 4)
  addedInPass: number; // which pass index (0–6) added this item
}

interface RecallSession {
  recallDate: string;               // recalled day label (e.g. "Thursday, May 23")
  currentPass: RecallPass;          // 'entry'|'pass1'|'pass2'|'pass3'|'pass4'|'review'|'confirm'
  items: FoodItem[];                // accumulates across passes; never cleared once added
  status: 'in-progress' | 'submitted';
  startedAt: number;                // Date.now() at session start
  submittedAt?: number;             // Date.now() at submit
}
```

### Pass sequence

```
entry → pass1 → pass2 → pass3 → pass4 → review → confirm
```

Each pass adds a column to the running food list in the right pane:
- pass1/pass2: `name` only
- pass3: `when` (time + occasion) per item
- pass4: `amount` (portion + preparation) per item
- review: list locked (`.is-locked`); no trash/add controls
- confirm: list replaced by `log-confirmation-card` receipt

### Wiring contract

HTML provides `[data-recall-root]` as the root element. Child `<section data-pass="...">` sections are toggled by `[hidden]`. In demo mode (separate static pages), the runner boots quietly and wires `[data-action]` buttons for in-page interactivity + cross-page navigation links.

### Events

| Event | Detail |
|---|---|
| `recall:state-change` | `{ from: RecallPass, to: RecallPass }` |
| `recall:item-added` | `{ item: FoodItem, passAdded: number }` |
| `recall:item-updated` | `{ item: FoodItem, field: 'name'\|'when'\|'amount' }` |
| `recall:item-removed` | `{ itemId: string }` |
| `recall:submit` | `{ session: RecallSession }` |
| `recall:save-pause` | `{ session: RecallSession }` |
| `recall:go-home` | `{}` |

### Programmatic API

Exposed on the root element as `el._recall` (non-enumerable).

```
getPass()              → RecallPass
getItems()             → FoodItem[]  (copy)
getSession()           → RecallSession  (copy)
addItem(name)          → FoodItem
removeItem(id)         → void
updateItem(id, patch)  → void  (patch keys: name, when, amount)
advancePass()          → void
reset()                → void
```

### Edit paths (passes 2–review)

- **Path A — talk to agent:** patient says a correction in free text → runner parses and calls `updateItem()`. Agent replies verbally; right pane updates silently. No food card is rendered in chat.
- **Path B — direct manipulation:** patient taps a right-pane row → inline field-row edit form appears (Save / Cancel). The list is the single source of truth; chat never re-renders the item.

### Save-and-resume

`[data-action="save-pause"]` → runner serializes session to `sessionStorage['cena-recall-draft']` and dispatches `recall:save-pause`. On next boot the runner checks for a stored draft. Andrey wires backend persistence.

### Demo-mode navigation

When no `[data-recall-root]` is found on the page, the runner attaches a lightweight page-level click handler that navigates between the static exemplar files:

- `submit-recall` → `recall.confirm.html`
- `pass1-done` → `recall.pass3.html`
- `go-home` → `../home/home.caught-up.html`

## No-judgment copy rule

This is a HARD RULE from the flow doc and clinical context. Every agent message — in the static exemplars and in any dynamically generated copy in the runner — must honor:

- No judgment about what or how much was eaten.
- "I don't remember" handled gracefully: agent offers an anchor ("What time did you wake up? Did you have anything before you left?"); if patient still can't recall, agent records what exists and moves on.
- Skipped meals acknowledged without probing: "Got it, you didn't have lunch yesterday. Some days are different from others. Walking on."
- No comparison to recommended amounts.
- No surprise at small intake. No emphasis on missing meals.
- Food-insecurity context normalized via variation language: "just walk me through what you actually had."
- ESL / low-literacy patients: shorter sentences, one prompt at a time, concrete anchors ("about a fist size?" not "about a cup?").

## No-score invariant

The `log-confirmation-card` receipt on `recall.confirm.html` shows: day recalled, item count, submitted timestamp, and "Your care team has it." Nothing else. No score. No HEI number. No component breakdown. This is load-bearing per cap-08 clinical governance.

## Behavior to implement on Angular port

- Agent message generation per pass (pass-paced forgotten-foods probes in pass 2 — ONE or TWO prompts at a time, not a checklist dump)
- Free-text parsing to extract food names from patient input → `addItem()` calls
- Per-item time/occasion capture from free text → `updateItem(id, { when })`
- Per-item portion capture from free text or `chat-numeric-input` → `updateItem(id, { amount })`
- Recall list real-time update as items and columns are added
- Save-and-resume (backend persistence behind `recall:save-pause`)
- Mobile: single-column chat layout; inline "Tap to view your list" link opens a full-screen recall list
- "Talk to a person" → handoff-menu routes to RDN or MPH student per cap-08 supervision model
- Day-of-week confirmation for the "A different day" path (calendar picker or plain-text date prompt)

## Canonical references

- Flow doc: `Knowledge/Projects/Cena Health/Partners/UCONN Health/capabilities/development/flows/flow-dietary-recall.md`
- Cap spec: `Knowledge/Projects/Cena Health/Partners/UCONN Health/capabilities/development/cap-08-24hr-dietary-recall.md`
- IA v1: `~/.claude/plans/patient-app-ia-v1.md`
- Chat affordance principles: `Knowledge/Projects/Cena Health/Apps/Patients/chat-affordance-principles.md`
- PL component spec for recall list: `packages/design-system/pattern-library/components/patient-recall-list.html`
- Sibling runner: `../assessments/assessment-runner.js`
