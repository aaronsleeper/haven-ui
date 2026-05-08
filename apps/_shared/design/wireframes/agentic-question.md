---
shells:
  - name: agentic-shell
    pl_shell_version: sha256:95bb370a7ae1ca4187ca461ef613ccc798089036498f8db13abeaf6cdbadd80c
  - name: mobile-shell
    pl_shell_version: sha256:7216f974a242c2b4803414646c733b3b194a1bdeec04e10b61be499eb7a2e599
---

# AGENTIC-QUESTION: Thread Question Card

**Application:** Multi-app shared component — Care Coordinator, Provider, Kitchen (`agentic-shell`); Patient (`mobile-shell`)
**Use Case(s):** Agent-initiated structured question requiring user commit. Specific consuming-app use cases TBD by consuming wireframes (likely cc-referral-clarification, patient meal-window selection, provider clinical-decision-with-preview).
**User Type:** Coordinator, Provider, Kitchen Staff, Patient
**Device:** Responsive — desktop hosts inline-thread variant in `panel-content`; mobile hosts `overlay-bottom-sheet` variant; preview-escalation variant expands across `panel-chat` + `panel-content` (desktop) or sequences bottom-sheets (mobile).
**Route:** No own route — composes into the active route's `panel-content` (desktop) or overlays the active route (mobile).

## Page Purpose

Render an agent-posed structured question that requires the user to commit a single-or-multi-option answer (with optional free-text "Other" fallback) so the agent can advance its work. The card carries the question's full context (a header chip naming the question class, the prompt body with optional recommendation, the option set, the Submit commit) co-located with the agent's preceding thread message — so the question and answer share provenance. When an option carries a rich preview payload, the card escalates to a master-detail layout that surfaces the preview without leaving the thread.

The pattern's success state: the user reads the question, scans options + recommendation in under 5 seconds for routine cases, and commits. For preview-bearing options the user can compare-and-commit without context-switching to a separate screen.

---

## Layout Structure

### Shell

The card composes into two carrier shells:

- **`agentic-shell` (desktop, primary):** rendered inside `panel-content` (right rail) as a thread-embedded approval-class card, alongside `thread-approval-card` and other allowlisted thread message types. Pins as the active hero when in-flight, like an active approval card.
- **`mobile-shell` (mobile):** rendered as an `overlay-bottom-sheet` invocation. The mobile shell has no thread pane, so the card becomes a focused overlay rather than an inline-thread element.

The **master-detail (preview escalation) variant** breaks the pane boundary on desktop: the option list takes over `panel-chat` (master) while the focused option's preview renders in `panel-content` (detail). On mobile, the master-detail variant uses sequential `overlay-bottom-sheet` invocations (option list → focused option preview → back to list).

### Variants

This pattern has **five variants** the wireframe specifies. Each variant shares the card's structural slots; the layout shell, interaction surface, and preview behavior differ.

#### Variant 1 — Single-select, no preview (DESKTOP, base case)

Hosted inline in `panel-content` (right rail). The card pins as the thread hero while in-flight.

**Header Zone**
- **Component:** `[NEW COMPOSITION: thread-question-header]` — composes `thread-approval-header` slot pattern
- Question class chip — `[STEWARD CALL: badge-pill OR new modifier `badge-pill.is-question-class`]`. Short label naming the question class (~12 char max). Example: "Mgmt repo name", "Delivery window", "Care plan".
- Optional secondary metadata — agent identity badge (Ava avatar `size-5` + name) when the asking agent is not implicit from context.

**Body Zone**
- **Component:** `[NEW PRIMITIVE: thread-question-card] > thread-question-body` (composes `thread-approval-body` slot pattern)
- **Prompt body** — prose, Body/02 (16px Source Sans 3). Holds the question and any background context the user needs. Lora display title is NOT used here — this is body, not record-header territory.
- **Recommendation callout** (optional, when the agent has a preferred answer) — `ai-insight-callout` (violet, AI-content register). Renders the "Recommendation:" line. Composes the existing primitive; no new class.

**Option Zone**
- **Component:** `[NEW PRIMITIVE: option-row]` rendered in a `[NEW COMPOSITION: option-row-list]` (`role="radiogroup"` `aria-labelledby` referencing the prompt-body heading)
- Each `option-row` carries:
  - Selection glyph — `<button role="radio">` + `aria-checked` (Radix-compatible). Selected state: ring + filled glyph + check icon (triple-cued per WCAG 1.4.1).
  - Title — Body/02 16px, `font-semibold`, `text-sand-900`
  - Inline `(Recommended)` tag — `badge-sm` adjacent to title, only on the recommended option
  - Description — Body/03 14px, `text-sand-700`, 1–3 sentences
- The "Other" option always appears last in the list — `[NEW VARIANT: option-row.is-other]`. Initial state: collapsed; same selection glyph + title slot; description slot reads "Provide your own input" (or `[COPY: contextual prompt for free-text input]`). On selection, reveals an inline `<textarea>` (see Interaction §"Other-reveal").

**Footer Zone**
- **Component:** `[NEW COMPOSITION: thread-question-footer]` — composes `thread-approval-actions` slot pattern + `sticky-footer` pinning
- Submit — `btn-primary btn-block`, label "Submit answer" (single-select) — disabled until ≥1 option selected or until "Other" textarea has content
- Numbered keybinding hint — `[NEW COMPOSITION: kbd-shortcut-hint]` (token reuse from `cmd-palette-shortcut` typography; steward call on whether this earns a class). Renders as "1" inside the Submit button label, e.g. "1 Submit answer". Desktop-only.
- Cancel/dismiss hint — secondary affordance, `text-link` muted: "Esc to cancel". Desktop-only.

#### Variant 2 — Multi-select, no preview

Same layout as Variant 1, with these differences:

- Option list root: `role="group"` + `aria-labelledby` (NOT radiogroup — multi-select)
- Selection glyph: `<button role="checkbox">` + `aria-checked` per option (alt: `<button aria-pressed>`; steward call at PL authoring on which ARIA pattern). Selected state: filled checkbox glyph + check icon + ring.
- Recommendation: agent may pre-select the recommended option(s) on mount; user can deselect.
- Submit label: "Submit answers" (plural). Enabled when ≥1 option selected.
- "Other" variant retains free-text behavior; selecting it adds it to the answer set alongside any other selected options.

#### Variant 3 — Single-select, master-detail preview (DESKTOP)

Triggered automatically when ≥1 option carries a `preview` payload (mockup, code snippet, diagram, or other rich content). Layout breaks the pane boundary:

**Master pane (`panel-chat`)**
- Hosts the question header + prompt body + recommendation callout + option-row list + footer
- Same structural slots as Variant 1, but constrained to a max-width (~480px) within `panel-chat`'s wider canvas so the option list doesn't sprawl

**Detail pane (`panel-content`)**
- Hosts the focused option's preview, rendered via:
  - `info-panel` for general structured content (key-value rows, body prose)
  - `code-view` for monospace text (code, diagrams in mermaid/ASCII, JSON, etc.)
  - `[STEWARD CALL: which primitive is canonical for option-preview detail; info-panel + code-view are starting candidates, NOT comparison-panel]`
- "Focused option" = the option the user has hovered, focused-via-keyboard, or selected. Selection takes precedence over hover.
- The preview pane shows context-only — the Submit affordance stays in the master pane.

**Pane sizing**
- `panel-chat` reduces to its minimum (480px floor / 560 comfortable, per agentic-shell canon)
- `panel-content` expands to its comfortable range (640 default, 480–800 range)
- The user can drag the splitter; sizing within shell canon

**Behavior on no-preview options in a mostly-preview list**
- If the user focuses an option without a preview payload, `panel-content` shows an `[NEW STATE: option-preview-empty]` — `data-empty-state` style affordance: "No preview available for this option" with `fa-eye-slash` icon. NOT silent.

#### Variant 4 — Mobile single-select (`overlay-bottom-sheet`)

Hosted in `overlay-bottom-sheet` (`bottom-sheet-panel` + `bottom-sheet-handle` + `bottom-sheet-header` + `bottom-sheet-body`). Max 85vh, scrollable body.

- **bottom-sheet-header:** question class chip + agent identity (when shown)
- **bottom-sheet-body:** prompt body + recommendation callout + option-row-list + "Other" variant
- **Sticky footer inside bottom-sheet-body's bottom edge:** Submit button, full-width
- No numbered keybinding hint (no keyboard surfaced on touch devices)
- No "Esc to cancel" hint — dismissal via overlay-tap (outside the sheet) or back-affordance (a `btn-icon` `fa-xmark` in `bottom-sheet-header`'s right slot)
- 44px minimum touch targets on every option-row

#### Variant 5 — Mobile master-detail (sequential bottom-sheets)

Triggered when ≥1 option carries a preview payload. Layout uses two bottom-sheet invocations:

**Sheet 1 — Option list (master)**
- Same as Variant 4, but each option-row with a preview payload shows a trailing chevron-right glyph (`fa-chevron-right`) indicating "tap for preview"
- Tapping an option with a preview opens Sheet 2 (preview detail); tapping an option without a preview selects it directly (skipping Sheet 2)

**Sheet 2 — Preview detail**
- `bottom-sheet-header` shows the option title + back affordance (`btn-icon` `fa-arrow-left` left slot)
- `bottom-sheet-body` hosts the preview (`info-panel` or `code-view`)
- Sticky footer: "Select this option" — `btn-primary btn-block`. On commit, returns to Sheet 1 with this option selected, OR (if option is single-select sufficient to commit) closes both sheets and submits directly.

`[OPEN QUESTION: Does the user explicitly Submit from Sheet 1 after selecting from Sheet 2, or does selecting from Sheet 2 commit and dismiss directly? Default: explicit Submit from Sheet 1 — preserves the consistent "Submit" affordance across all variants.]`

---

## Interaction Specifications

### Option select (single-select / radio)
- **Trigger:** User clicks/taps an option-row (radio variant), or focuses + presses Space/Enter
- **Feedback:** Previously-selected option (if any) deselects; new option enters selected state (ring + filled glyph + check icon). Submit button enables (was disabled if no prior selection).
- **Navigation:** None — stays in the card.
- **Error handling:** N/A — pure local state.

### Option select (multi-select / checkbox)
- **Trigger:** User clicks/taps an option-row (checkbox variant), or focuses + presses Space
- **Feedback:** Option toggles selected/unselected. Submit button enables when ≥1 option selected; disables when 0 selected.
- **Navigation:** None — stays in the card.
- **Error handling:** N/A.

### "Other" reveal
- **Trigger:** User clicks/taps the "Other" option-row (or focuses + Space/Enter)
- **Feedback:** Option enters selected state (same as any other option). Inline `<textarea>` reveals below the option's description slot, expanding the option-row's height. Focus moves to the textarea. Submit button: enabled only when textarea has non-whitespace content.
- **Layout:** Reveal is in-place expansion of the "Other" option-row, NOT a modal or separate slot. Other options stay rendered above; user can still see the full list.
- **Deselect:** If the user selects a different option (single-select variant) or unchecks "Other" (multi-select variant), the textarea collapses and its content is preserved in local state but not committed. Re-selecting "Other" restores the previous textarea content.
- **Error handling:** Empty textarea on Submit attempt — Submit stays disabled (no error needed; affordance is self-evident).

### Submit
- **Trigger:** User clicks/taps the Submit button, OR presses Enter on a focused option (single-select), OR presses the displayed number key (e.g., "1" for first option) on desktop
- **Feedback:** Submit button enters loading state (`btn-primary` with spinner). On success, the card transitions to the **Submitted** state (see States §). On failure, transitions to **Error** state.
- **Navigation:** Card collapses to a `thread-msg-response` style summary in the thread (desktop) or dismisses the bottom-sheet (mobile). The agent's next message appears in the thread.
- **Error handling:** See **Error State** below. Retry is supported.

### Cancel / dismiss
- **Trigger (desktop):** User presses Esc; OR clicks outside the card if the card is in a modal-overlay variant (NOT default — default is inline-thread, no outside-click dismissal)
- **Trigger (mobile):** User taps the overlay backdrop (outside the bottom-sheet) OR taps the `fa-xmark` in the bottom-sheet header
- **Feedback:** Card collapses or dismisses. Agent receives a "no answer" / null response signal.
- **Navigation:** Returns to thread state without an answer; agent may re-pose the question or proceed without answer per the agent's logic.
- **Error handling:** N/A — cancel is always reversible (the agent can re-pose).
- **Confirmation:** No confirmation dialog on cancel. The card is a question, not a destructive action.

### Numbered keybinding (desktop only)
- **Trigger:** User presses a digit key (1–9) corresponding to a visible option's position in the list. The "Submit" button shows the numbered hint (e.g., "1") matching the recommended or first-selected option's number; pressing that digit submits.
- **Feedback:** If the digit matches an unselected option, that option is selected (single-select) or toggled (multi-select). If the digit matches the Submit-button-displayed number, Submit fires.
- **Discoverability:** The numbered hint inside Submit is the visible affordance; per-option numbering is NOT shown by default (would clutter). `[OPEN QUESTION: per-option number hints visible always, on Cmd-hold, never?]`
- **Error handling:** Pressing a digit outside 1–N (where N is the option count, max 9) does nothing.
- **Accessibility:** `aria-keyshortcuts` declared on the Submit button.

### Preview swap (master-detail variant only)
- **Trigger:** User hovers an option-row with a preview payload (desktop), OR keyboard-focuses an option-row, OR clicks/taps to select
- **Feedback:** The detail pane (`panel-content`) updates to render the focused option's preview. The transition is non-animated by default (instant swap) to feel responsive; `[OPEN QUESTION: subtle crossfade vs. instant — feel test at design-review pre-build]`.
- **Selection precedence:** If an option is selected, its preview takes precedence over hover-focused options. Hover/focus on a selected option is a no-op (preview already shown).
- **Navigation:** None — stays in the card.
- **Error handling:** Preview payload fails to render (network image, unparseable code) — show `[NEW STATE: option-preview-error]`: alert-error inside `info-panel` with retry affordance.

---

## States

### In-flight (default)
- The card is mounted, awaiting an answer
- Pinned as the thread hero (desktop) or mounted as the active overlay (mobile)
- Submit button: disabled (no selection) or enabled (selection made and valid)
- The agent has acknowledged the question is in-flight; while in-flight, the agent does not pose another question on the same thread (one question at a time)
- `[OPEN QUESTION: Can the agent send a non-question message while a question is in-flight? E.g., "still waiting on your answer" or a clarifying note?]`

### Submitted (terminal)
- After Submit succeeds, the card transitions to a `thread-msg-response`-style historical summary
- Renders the question class chip + the user's selected answer(s) + a timestamp
- Is `[NEW VARIANT: thread-msg-response.is-question-answer]` or composes existing `thread-msg-response`; steward call at PL authoring
- No interactive affordances — read-only history element in the thread

### Cancelled (terminal)
- After Cancel, the card removes itself from the thread (desktop) or dismisses the bottom-sheet (mobile)
- A `thread-msg-system`-style log entry MAY render in its place: "Question dismissed" with timestamp
- `[OPEN QUESTION: Always log the cancellation, or only when the agent's logic depends on knowing the user explicitly declined?]`

### Locked / historical (read-only)
- For thread-history view (the user is reviewing past threads, not the in-flight thread), already-answered question cards render as `[NEW VARIANT: thread-question-card.is-historical]`
- All interactive affordances disabled — option states preserved (showing what the user selected) but no Submit, no select, no Other-reveal
- Visual treatment: muted, similar to `thread-approval-card.is-historical`

### Error State (Submit failed)
- After Submit failure (network, agent rejected the answer, validation error from agent side)
- Inline `alert-error` renders inside the card body, above the option list
- Submit button returns to enabled state (allowing retry)
- Error message: `[COPY: error message when answer-submit fails — context-specific, agent provides]`
- Retry: user can re-Submit; option selection is preserved across the failure

### Empty state (no options provided)
- Edge case: agent posts a question with zero options (degenerate). The card should NOT render in this case — agent should pose a free-text-only question via a different affordance (e.g., `prompt-input-container` with the question as preceding `message-agent`).
- If the card receives zero options at runtime, render `[NEW STATE: thread-question-empty]`: `data-empty-state` with `fa-circle-question` icon, copy `[COPY: degenerate-no-options state — should never render in production; flag as bug]`. This is defensive.

### Loading state
- Cards do not have an own loading state — the card mounts when the agent's question payload is fully resolved. If the agent is "thinking" before posing a question, the thread shows `tool-call`-style indicators, not this card.

---

## Accessibility Notes

- **Roles + ARIA:**
  - Card root: `<section role="region" aria-labelledby>` referencing the prompt body's heading; matches `thread-approval-card`'s landmark pattern
  - Single-select option list: `role="radiogroup"` + `aria-labelledby` referencing the prompt body
  - Multi-select option list: `role="group"` + `aria-labelledby`
  - Each option-row: `<button role="radio">` (single-select) or `<button role="checkbox">` (multi-select); `aria-checked` on each
  - Submit button: `aria-keyshortcuts="1"` (or whichever number is displayed)
- **Focus management:**
  - On card mount, focus moves to the first option-row (NOT the Submit button — the user must answer first)
  - Tab order: prompt body's interactive elements (none by default) → option-row list (Tab enters; arrow keys navigate within radiogroup) → Submit button → Cancel hint
  - On "Other" reveal, focus moves to the textarea
  - On Submit, focus moves to the post-submit thread message (Submitted state)
  - On Cancel, focus moves to the `prompt-input-container` (desktop) or the thread parent (mobile)
- **Touch targets (mobile):**
  - Each option-row: 44px minimum height
  - Submit button: 48px minimum height
  - "Other" textarea: 44px minimum height after reveal
- **Color independence:**
  - Selected state is triple-cued: filled glyph + ring + check icon (per WCAG 1.4.1; matches `chat-tag-group`'s pattern)
  - "(Recommended)" badge does NOT rely on color alone — text label "Recommended" is the canonical signal; color is reinforcement
  - Error state: `alert-error` carries `fa-circle-exclamation` icon + text; not color-only
- **Screen reader announcements:**
  - On mount: "Question from [agent name]: [prompt body]. [N] options. Use arrow keys to select."
  - On option focus: announce option title + description + "Recommended" if applicable
  - On Submit success: "Answer submitted. [Brief response from agent if available]."
  - On Submit failure: "Submit failed. [Error message]. Press Enter to retry."
- **Keyboard shortcuts:**
  - Tab — enter/exit the card
  - Arrow keys — navigate within radiogroup (single-select); jump within multi-select group via Tab
  - Space/Enter — select focused option
  - Number keys 1–9 — select corresponding option (per Numbered keybinding interaction)
  - Esc — cancel/dismiss

---

## Bilingual Considerations

- "Submit answer" / "Submit answers" → "Enviar respuesta" / "Enviar respuestas"
- "Other" → "Otro"
- "(Recommended)" → "(Recomendado)" — verify this longer string fits the inline-with-title slot at small viewport widths; may need to break to a second line on mobile
- "Esc to cancel" → "Esc para cancelar"
- "No preview available for this option" → "[COPY: Spanish translation]"
- "Provide your own input" → "[COPY: Spanish translation]"
- Numbered keybinding hint is language-agnostic (digits)
- Prompt body and option text are agent-authored — bilingual responsibility falls on the agent's content layer, not the card primitive
- Question class chip (header) — agent-authored; bilingual responsibility same as prompt body

---

## Open Questions

### Resolved (sign-off captured below)

**Define-once boundary against `response-option-group` — design-system-steward sign-off, 2026-05-08:**

```
keep response-option-group assessment-only;
new option-row primitive for thread-question-card

Rationale: response-option carries assessment-specific assumptions
(numbered index square 36×36, 325px max-width, single-select-only,
single-text label) that would warp if reused for agentic questions.
The shared bone is Radix <button role="radio"> + aria-checked
semantics; everything else differs.

Path: author a new option-row primitive at PL-fragment time, sized
and shaped for the thread-card context, with these slots:
  - bold title + description body (richer than response-option-label)
  - inline (Recommended) badge-sm slot on the title row
  - single-select role=radio + multi-select role=checkbox variants
  - Other-with-textarea-reveal variant (Tier 1 novel; no PL precedent)

response-option / response-option-group remain canonical for
patient-assessment Likert (PHQ-9, GAD-7) and stay unchanged.
Assessment Likert keeps the numbered index square as its
distinguishing decoration.

If a third surface emerges (third option-row consumer with the
shared shape and divergent decoration), promote a shared base then
under judgment-framework "used 3+ times in one app" — not now.
Premature extraction across two contexts with different decorative
load lands in a primitive that's the union of warts.
```

### Unresolved (for ux-design-review pre-build, then steward at PL authoring)

- **Question class chip rendering:** `badge-pill` inline usage, or new modifier `badge-pill.is-question-class`? Steward call at PL authoring. The chip's max-width (~12 char) and visual weight need a steward decision; start with inline `badge-pill` and only promote a modifier if a second consumer needs the same shape.
- **Numbered keybinding hint inline-with-button:** new composition class (`kbd-shortcut-hint` or similar), or per-instance Tailwind utility? Token reuse from `cmd-palette-shortcut` typography is the starting point. Per-option numbers visible always, on Cmd-hold, or never? `cc-design-review` to feel-test.
- **Master-detail preview-pane primitive:** `info-panel` for structured content + `code-view` for monospace are the starting candidates. Is a unified `option-preview-pane` warranted, or are the two existing primitives composed directly per-instance? Steward call at PL authoring.
- **Master-detail breakpoint:** at what viewport does the `panel-chat` + `panel-content` master-detail collapse to mobile sequential bottom-sheets? Tablet (~720px) is the agentic-shell minimum; below 720px the mobile-shell takes over. So the breakpoint is implicit at the shell-routing level. Confirm.
- **Multi-select Submit copy:** "Submit answers" (plural) is the default. Per-instance copy override (e.g., "Apply selections", "Add to plan") is acceptable when the agent's question warrants it. NOT a primitive concern — agent authors per-instance.
- **In-flight idle behavior:** can the agent send another message in the thread while a question is in-flight? Default assumption: NO, one question at a time per thread. If the agent needs to add a clarifying note, it does so as part of the question's prompt body, not as a separate message. Confirm with agent-platform owner.
- **Multiple in-flight questions:** does a thread support more than one in-flight question card simultaneously? Default: NO, one at a time. Subsequent questions queue. Confirm.
- **Sequential mobile bottom-sheets, return behavior:** does selecting from Sheet 2 (preview detail) commit and dismiss directly, or return to Sheet 1 with the option pre-selected for explicit Submit? Default in this wireframe: return to Sheet 1 for explicit Submit (preserves consistent affordance). Validate at design-review.
- **"Other" reveal reveal-direction (in-place vs. dedicated slot):** in-place expansion of the option-row is the default in this wireframe. Validate against typical option list lengths — if option lists run long, in-place reveal pushes options out of view.
- **Preview swap transition:** instant vs. crossfade. Feel-test at design-review.
- **Cancellation logging:** always log a cancel as `thread-msg-system`, or only when the agent's logic needs to know? Default: log always for thread-history clarity; flag if noise becomes a problem.
- **Loading spinner on Submit:** is there a meaningful latency window where the user might think Submit failed? Agent acknowledgment is typically <1s; if 95th-percentile is >2s, the loading spinner needs a dedicated treatment. Confirm with agent-platform metrics.

---

## New Components Flagged

This wireframe introduces components that do not exist in `pattern-library/COMPONENT-INDEX.md`. Each requires PL fragment authoring (Tier 1 sub-primitive) or composition entry (Tier 2) before the React port and consuming app integration.

| Status | Component | Tier | Notes |
|---|---|---|---|
| NEW PRIMITIVE | `thread-question-card` | Tier 2 (composition) | Card envelope; parallels `thread-approval-card`. Composes `thread-approval-header` + `thread-approval-body` slot patterns + new `option-row-list` + new `thread-question-footer`. |
| NEW PRIMITIVE | `option-row` | Tier 1 | Per steward verdict 2026-05-08. Bold title + description + (Recommended) badge slot + single-select `role="radio"` AND multi-select `role="checkbox"` variants. NOT response-option (assessment-only). |
| NEW VARIANT | `option-row.is-other` | Tier 1 sub-primitive | Reveal-on-select textarea. No PL precedent for reveal-on-select interaction; load-bearing for the agentic-question pattern. |
| NEW COMPOSITION | `option-row-list` | Tier 2 | The radiogroup/group container holding option-rows; provides `role` + `aria-labelledby` semantics. May be a slot inside `thread-question-card` rather than a standalone primitive — steward call. |
| NEW COMPOSITION | `thread-question-footer` | Tier 2 | Sticky-footer composition holding Submit button + numbered keybinding hint + cancel hint. Composes `sticky-footer` + `btn-primary btn-block`. |
| NEW VARIANT (steward call) | `badge-pill.is-question-class` | Tier 1 modifier OR per-instance `badge-pill` usage | Header chip naming the question class. Start with inline usage; promote to modifier only if a second consumer emerges. |
| NEW COMPOSITION (steward call) | `kbd-shortcut-hint` (inline-with-button) | Tier 2 OR per-instance utility | Numbered keybinding affordance inside the Submit button label. Token reuse from `cmd-palette-shortcut` typography. |
| NEW VARIANT | `thread-question-card.is-historical` | Tier 2 modifier | Read-only thread-history rendering; parallels `thread-approval-card.is-historical`. |
| NEW VARIANT | `thread-msg-response.is-question-answer` (steward call) | Tier 2 modifier OR composes existing `thread-msg-response` | Submitted-state historical summary in the thread. May not need a dedicated variant — composes existing `thread-msg-response`. |
| NEW STATE | `option-preview-empty` | Tier 2 (composition) | data-empty-state for master-detail variant when focused option has no preview. |
| NEW STATE | `option-preview-error` | Tier 2 (composition) | alert-error inside info-panel for preview render failure. |
| NEW STATE | `thread-question-empty` | Tier 2 (composition) | Defensive degenerate-no-options state. |

`[GATE 2]` — this wireframe flags 12 new components/variants/states. Per haven-ui CLAUDE.md "Slice authoring — wireframe-driven, PL-first," this triggers a mandatory pause at Gate 2 before haven-mapper proceeds. Aaron must approve pursuing them (or redirect) before the pipeline advances.

---

## References

- `apps/_shared/design/wireframes/agentic-question-brief.md` — pre-wireframe brief (driving spec)
- `apps/_shared/design/wireframes/shell-universal-agentic.md` — `agentic-shell` carrier surface
- `packages/design-system/pattern-library/COMPONENT-INDEX.md` — PL inventory; entries for `thread-approval-card`, `response-option`, `response-option-group`, `ai-insight-callout`, `info-panel`, `code-view`, `sticky-footer`, `cmd-palette-shortcut`, `badge-pill`, `bottom-sheet-panel`, `data-empty-state`
- `packages/design-system/pattern-library/components/thread-approval-card.html` — slot pattern precedent for the envelope
- `packages/design-system/pattern-library/components/response-option.html` — assessment-context option-row precedent (NOT reused; informs the new option-row primitive's design)
- `planning/experts/design-system-steward/judgment-framework.md` — extract-vs-keep-local rule applied to the response-option-group boundary
- `planning/experts/ux-design-lead/judgment-framework.md` — surface decision tree (in-thread default for routine + low-risk)
- `apps/care-coordinator/design/wireframes/cc-08-duplicate-comparison.md` — likely consumer of the master-detail preview variant once the pattern ships
