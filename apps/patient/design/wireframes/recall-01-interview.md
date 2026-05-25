---
shells:
  - name: app-shell
    pl_shell_version: sha256:8b78f90e5bf5e177749cbde07dd80415cd0c54e48588dc8b20582404d92101fb
---

# recall-01-interview: Dietary recall (24-hour, multiple-pass)

**Application:** Patient App · **Use Case(s):** cap-08 (HEI input, AMPM multiple-pass) · **User Type:** Patient (Maria Rivera) · **Device:** Mobile-first, responsive (mobile single-column; desktop two-region)

The patient-facing 24-hour dietary recall. Agent-led structured interview over a canonical food-list record. **Agent-pushed** (surfaces from Home's things-to-do when an HEI window is open) — no nav tab.

**Provenance / define-once:**
- **Wrapper (shell + nav + regions):** `~/.claude/plans/ui-workflow-ia-synthesis/surface-primary-shell-model.md` §per-surface shell-fit (recall) + §desktop-vs-mobile. THE shell authority.
- **Interaction design (passes, copy, edits, edge cases):** `flow-dietary-recall.md`. THE interaction authority — **except its §"Shell context"** (3-pane center-chat), which is **superseded by the shell-model** (the pre-pivot description; do not build it).
- **Reconciliation:** `apps/patient/design/ia-v1-wireframe-reconciliation.md`.

## Shell + nav (the wrapper — canonical)
- **Shell: `app-shell`** (`layout-app-shell-responsive`), NOT `agentic-shell`. The recall is a patient surface, not a coordinator console. Per shell-model: "center-pane agent chat → dockable agent; chat is not the app."
- **Nav: suppressed** (focused agent-led moment, like the assessment runner). The shell renders content-only: no 3-tab bar competing with the interview. A single quiet **"Done for now / back to Home"** affordance + persistent **"Talk to a person"** (header chip — recall is sensitive; keep it close to hand) are the only chrome.
- **NOT** the demo 5-item rail (Home/Health check/Meals/Care/Messages) — that nav is retired.

## Layout — two-region content inside `app-shell` (NOT three panes)
- **Mobile (default):** single-column **conversation** is the viewport. The food-list record opens as a **full-screen sheet** on "View your list" / tapping an item reference; closing returns to the conversation. (No Preline overlay in the handoff bundle — the mobile sheet is a full-screen route/section, not `overlay-bottom-sheet`.)
- **Desktop (≥lg):** **two regions** via `layout-two-pane` — conversation rail (left/main) + **food-list working surface** (right). The food-list is the canonical record (`patient-recall-list`); the conversation describes additions/edits verbally and never duplicates the list (chat-affordance principle).
- Region composition uses existing primitives only: conversation = `patient-chat-message` + chat affordances (`chat-chip-row`, `chat-button-row`, `chat-numeric-input`); record = `patient-recall-list` (+ `.is-locked` at review); header chip = `chat-handoff-trigger.is-header`. No `panel-nav`/`panel-chat`/`panel-content` (those are the CC agentic shell).

## Components (all shipped — zero PL gaps)
`app-shell` (content-only, nav suppressed) · `patient-recall-list` (working surface; `.is-locked` review) · `patient-chat-message` · `chat-chip-row`(+`.is-small`,`.is-soft`) · `chat-button-row`(+`.has-helper`) · `chat-numeric-input` · `chat-handoff-trigger.is-header` · `log-confirmation-card` (receipt) · `layout-two-pane`/`layout-two-pane-grid` (desktop two-region).

## States (the five passes + entry + confirm; each a focused step)
Per `flow-dietary-recall.md` Steps 1–7. Pass indicator lives in the food-list header ("Pass N of 5 — <label>").
1. **Entry + day-select** — agent greeting; `chat-chip-row` ("Yesterday" / "A different day"); empty food-list, header = selected day + "Pass 1 of 5 — quick list".
2. **Pass 1 quick list** — free input; list grows names-only; no chips (free conversation).
3. **Pass 2 forgotten foods** — paced prompts (one/two at a time); list grows.
4. **Pass 3 time/occasion** — chronological walk; when-column populates; `chat-chip-row.is-small` time-of-day aids.
5. **Pass 4 detail/portion** — `chat-numeric-input` for amounts (size anchors in copy); amount-column populates.
6. **Pass 5 review + submit** — verbal summary (comprehension check, NOT a list dump); `patient-recall-list.is-locked`; `chat-button-row` "Looks right, submit".
7. **Confirm** — `log-confirmation-card`; **NO score** ("Your care team will see this at your next session").
- **Edit-in-place (passes 2–6):** Path A (tell the agent) + Path B (tap a food-list row to edit / trash / "+ add"). Both always available. Inline editor composed from `field-row` + `chat-numeric-input` (NOT Preline bottom-sheet).

## Interaction / behavior
- The live behavior ships as the slice-scoped `dietary-recall-runner.js` (multi-pass FoodItem[] orchestrator) — already authored; rebind to the new wrapper.
- Voice input encouraged; one prompt at a time for ESL/low-literacy; agent reads literacy signals.

## States (shell-level) — loading / error / stop-mid-recall
- **Stop mid-recall:** agent offers to save draft ("We can pick up where we left off"); resumes at the same pass.
- **Error / schema fail on submit:** plain-language fix prompt, no raw codes.

## Accessibility
- Conversation is a `log`/`feed` region; agent turns announced politely (runner owns debounce).
- Food-list edits move focus predictably; tap targets ≥44px; the record carries `role="list"`.
- Color-as-status never alone; large-text absorbs +200%.

## Bilingual
- EN v1; ES slot reserved (account corner). All strings `data-i18n-*`-ready; ~30% Spanish expansion absorbed.

## New components flagged
**None.** Composes shipped primitives in `app-shell`. The rebuild's only change vs the shipped slice is the **wrapper** (agentic 3-pane → `app-shell` two-region) + **nav** (5-item demo → suppressed) — content/runner are reused.

## Notes / upstream cleanup flagged
- `flow-dietary-recall.md` §"Shell context" (3-pane) is **stale** — mark superseded by shell-model (it predates the 2026-05-24 pivot). Interaction sections remain canonical.
