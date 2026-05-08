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
- Question class chip — `[STEWARD CALL: badge-pill OR new modifier `badge-pill.is-question-class`]`. Short label naming the question class (~12 char max). Examples (final copy `[REVISED 2026-05-08]`): "Match referral", "Delivery time", "Care plan path", "Substitution".
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
- The "Other" option always appears last in the list — `[NEW VARIANT: option-row.is-other]`. Initial state: collapsed; same selection glyph + title slot; description slot reads "Type a different answer" (Spanish: "Escribe otra respuesta") `[REVISED 2026-05-08]`. On selection, reveals an inline `<textarea>` (see Interaction §"Other-reveal"). Textarea placeholder: "Tell us what fits better." (Spanish: "Cuéntanos qué se ajusta mejor.")
- **In-place reveal guardrail `[REVISED 2026-05-08]`:** in-place expansion is the default for option lists ≤6 options. Lists exceeding 6 options trigger a steward review before authoring (in-place reveal pushes options out of view at higher counts; dedicated-slot-below approach may be appropriate). Default expected option count is 2–5, matching `response-option-group` precedent.

**Footer Zone**
- **Component:** `[NEW COMPOSITION: thread-question-footer]` — composes `thread-approval-actions` slot pattern + `sticky-footer` pinning
- Submit — `btn-primary btn-block`, label "Submit answer" (single-select) — disabled until ≥1 option selected or until "Other" textarea has non-whitespace content `[REVISED 2026-05-08]` Spanish label: "Enviar respuesta"
- Numbered keybinding hint — `[NEW COMPOSITION: kbd-shortcut-hint]` (token reuse from `cmd-palette-shortcut` typography; steward call on whether this earns a class). Renders as "1" inside the Submit button label, e.g. "1 — Submit answer". Desktop-only. `aria-keyshortcuts="1"` on the Submit button per MDN guidance — shortcut must be both visible AND announced. `[REVISED 2026-05-08]`
- Cancel/dismiss hint — secondary affordance, `text-link` muted: "Esc to cancel". (Spanish: "Esc para cancelar"). Desktop-only.

#### Variant 2 — Multi-select, no preview

Same layout as Variant 1, with these differences:

- Option list root: `role="group"` + `aria-labelledby` (NOT radiogroup — multi-select)
- Selection glyph: `<button role="checkbox">` + `aria-checked` per option `[REVISED 2026-05-08]` — locked to `role="checkbox"` (NOT `aria-pressed`). Rationale: option-row-list is a structured group of selectable options; `role="checkbox"` is the WAI-ARIA-canonical multi-select-from-a-group pattern. `aria-pressed` is the toggle-button pattern (used in `chat-tag-group`, which is a free-form chip-cloud, a different shape). Selected state: filled checkbox glyph + check icon + ring (triple-cued).
- Recommendation: agent may pre-select the recommended option(s) on mount. When pre-selected, render a quiet suggestion line above the option list `[REVISED 2026-05-08]`:
  - Coordinator/provider/kitchen surface: "Ava suggested these. Edit and submit when ready." (Spanish: "Ava sugirió estas opciones. Ajusta y envía cuando quieras.")
  - Patient surface (5th-grade): "Ava picked these to start. Change them or send as is." (Spanish: "Ava marcó estas para empezar. Cámbialas o envíalas así.")
- **Stray-Enter guard `[REVISED 2026-05-08]`:** when the agent pre-selects, Submit remains enabled but requires at least one user-driven interaction (toggle on or off any option) before the digit-keybinding fires. The Submit button itself remains clickable to honor "Submit as suggested" intent; only the keybinding shortcut requires the touch. Rationale: a stray Enter on mount otherwise commits the agent's preset as the user's answer.
- Submit label: "Submit answers" (plural). Enabled when ≥1 option selected. (Spanish: "Enviar respuestas").
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
- "Focused option" precedence `[REVISED 2026-05-08]`: **selection > keyboard-focus > hover.** Keyboard-focus changes mute hover-induced swaps for a 300ms cooldown after the last keyboard event. The preview pane carries `data-preview-source="selection|keyboard|hover"` for diagnostic + AT announcement use.
- **Screen-reader announcement for preview swap `[REVISED 2026-05-08]`:** the detail pane wraps an `aria-live="polite"` region announcing the focused option's title + first-line preview summary (e.g., "Care plan path B preview: low-sodium, 2200 kcal/day, 6 meals/day."). Suppress announcements when selection is the trigger (selection already announces at the option-row level).
- The preview pane shows context-only — the Submit affordance stays in the master pane.
- **Layout-engagement rule `[REVISED 2026-05-08]`:** Variant 3 (master-detail break) engages only when **≥2 options carry preview payloads**, OR when ≥1 option has a preview AND the agent has marked the question with `compare_previews: true`. Single-option-with-preview falls back to Variant 1 with a `chat-sheet-link` ("View preview") that opens the preview in an `overlay-bottom-sheet`-style panel without breaking the layout. Zero-options-with-preview always falls back to Variant 1.

**Pane sizing**
- `panel-chat` reduces to its minimum (480px floor / 560 comfortable, per agentic-shell canon)
- `panel-content` expands to its comfortable range (640 default, 480–800 range)
- The user can drag the splitter; sizing within shell canon

**Behavior on no-preview options in a mostly-preview list**
- If the user focuses an option without a preview payload, `panel-content` shows an `[NEW STATE: option-preview-empty]` — `data-empty-state` style affordance with `fa-eye-slash` icon. `[REVISED 2026-05-08]`
  - Heading: "No preview for this option" (Spanish: "Sin vista previa")
  - Body: "Pick a different option to see a preview, or select this one to commit." (Spanish: "Selecciona otra opción para ver una vista previa, o elige esta para enviar.")
  - NOT silent.

#### Variant 4 — Mobile single-select (`overlay-bottom-sheet`)

Hosted in `overlay-bottom-sheet` (`bottom-sheet-panel` + `bottom-sheet-handle` + `bottom-sheet-header` + `bottom-sheet-body`). Max 85vh, scrollable body.

- **bottom-sheet-header:** question class chip + agent identity (when shown)
- **bottom-sheet-body:** prompt body + recommendation callout + option-row-list + "Other" variant
- **Sticky footer pinned to `bottom-sheet-panel` root (sibling of body, NOT inside body's scroll context) `[REVISED 2026-05-08]`:** Submit button, full-width. Rationale: iOS Safari's bottom-bar collapse during scroll can briefly hide a body-internal footer behind the address bar; pinning to the panel root avoids this. Existing `sticky-footer` primitive supports the panel-root pattern.
- No numbered keybinding hint (no keyboard surfaced on touch devices) — but if a Bluetooth keyboard is connected (common on tablets), Esc dismisses the sheet. `[REVISED 2026-05-08]`
- Dismissal via overlay-tap (outside the sheet) or back-affordance (a `btn-icon` `fa-xmark` in `bottom-sheet-header`'s right slot, `aria-label="Cancel question"` / Spanish "Cancelar pregunta") `[REVISED 2026-05-08]`
- **44px minimum touch targets** on every option-row at the primitive level. **Kitchen tablet override:** when consumed by the kitchen app (gloved-hand context), `--option-row-min-height` raises to 48px via `option-row.is-tablet-dense` modifier OR per-app token override. Steward call at PL authoring on which mechanism. `[REVISED 2026-05-08]`
- **Focus-trap inside the bottom-sheet `[REVISED 2026-05-08]`:** the bottom-sheet IS a modal-equivalent overlay; per WCAG 2.4.3, focus is trapped inside the sheet while open. Tab cycles option-rows → Submit → close-button (`fa-xmark`) and back. Esc dismisses. This is the one place focus-trap applies (the persistent shell does not trap focus per WCAG 2.1.2; modal overlays do).

#### Variant 5 — Mobile master-detail (sequential bottom-sheets)

Triggered when ≥1 option carries a preview payload. Layout uses two bottom-sheet invocations:

**Sheet 1 — Option list (master)**
- Same as Variant 4, but each option-row with a preview payload shows a trailing chevron-right glyph (`fa-chevron-right`) indicating "tap for preview"
- Tapping an option with a preview opens Sheet 2 (preview detail); tapping an option without a preview selects it directly (skipping Sheet 2)

**Sheet 2 — Preview detail**
- `bottom-sheet-header` shows the option title + back affordance (`btn-icon` `fa-arrow-left` left slot, `aria-label="Back to options"`) `[REVISED 2026-05-08]`
- `bottom-sheet-body` hosts the preview (`info-panel` or `code-view`)
- Sticky footer: **"Choose this option"** — `btn-primary btn-block` `[REVISED 2026-05-08]`. (Spanish: "Elegir esta opción"). On commit, returns to Sheet 1 with this option pre-selected — Sheet 1's Submit fires the actual commit.
- **Sheet-stack focus return `[REVISED 2026-05-08]`:** when Sheet 2 dismisses (via back or via Choose-this-option), focus returns to the option-row in Sheet 1 that opened Sheet 2 — NOT to Sheet 1's first option. Standard sheet-stack pattern.
- **Returning-from-Sheet-2 announcement** (sr-only `aria-live`): "Returned to options. [Option title] is selected. Submit answer at the bottom." `[REVISED 2026-05-08]`

`[RESOLVED 2026-05-08]` **Sheet 2 → Sheet 1 return behavior:** Sheet 2's "Choose this option" returns to Sheet 1 with the option pre-selected; Sheet 1's Submit fires the commit. Three reasons: (a) consistency — every variant has Submit as the canonical commit affordance, (b) reversibility — user can back out of the selection without re-opening the preview, (c) mental model — master-detail's "drill in, come back, decide" matches Apple HIG and Material navigation conventions. [Source: webapphuddle.com, "Master-Detail UI Pattern Design"]

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
- **Feedback:** Submit button enters loading state (`btn-primary` with spinner) AND simultaneously transitions to `disabled` to block double-fire `[REVISED 2026-05-08]`. The disabled-with-spinner state is canonical for in-flight commits across `thread-approval-card.actions` (consistency, not a new pattern). On success, the card transitions to the **Submitted** state (see States §). On failure, transitions to **Error** state.
- **Navigation:** Card collapses to a `thread-msg-response` style summary in the thread (desktop) or dismisses the bottom-sheet (mobile). The agent's next message appears in the thread.
- **Error handling:** See **Error State** below. Retry is supported.
- **Submitted-state copy `[REVISED 2026-05-08]`:** the historical summary renders the user's exact selected answer text (NOT a paraphrase) so the answer is auditable later. Format: "[User] answered: [exact option title(s)]. [timestamp]". For "Other" answers: "[User] answered: [free-text body]. [timestamp]" — the free-text payload is preserved verbatim.

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
- **Discoverability:** The numbered hint inside Submit is the visible affordance; per-option numbering is NOT shown by default (would clutter). `[DEFERRED to PL fragment authoring (visual feel-test)]` per-option number hints visible always vs. Cmd-hold vs. never.
- **Error handling:** Pressing a digit outside 1–N (where N is the option count, max 9) does nothing.
- **Keyboard-layout caveat `[REVISED 2026-05-08]`:** per MDN's `aria-keyshortcuts` reference, single-digit shortcuts are fragile across keyboard layouts (French AZERTY requires Shift for digits 1–9). The Submit-button digit is a hint, not a contract; the canonical commit is the Submit click + Enter on focused option. The `aria-keyshortcuts="1"` (or whichever digit) MUST be declared so AT can announce the affordance regardless of layout. [Source: MDN Web Docs, "aria-keyshortcuts"]
- **Stray-Enter guard interaction `[REVISED 2026-05-08]`:** when the agent pre-selects in multi-select, the digit shortcut requires at least one user-driven option toggle before firing (prevents stray Enter from committing the agent's preset as the user's answer). The Submit button itself remains clickable to honor "Submit as suggested" intent.
- **Accessibility:** `aria-keyshortcuts="1"` (or matching digit) declared on the Submit button.

### Preview swap (master-detail variant only)
- **Trigger:** User hovers an option-row with a preview payload (desktop), OR keyboard-focuses an option-row, OR clicks/taps to select
- **Feedback:** The detail pane (`panel-content`) updates to render the focused option's preview. The transition is non-animated by default (instant swap) — `[DEFERRED to PL fragment authoring (visual feel-test)]` instant vs. subtle crossfade.
- **Precedence `[REVISED 2026-05-08]`:** **selection > keyboard-focus > hover.** Keyboard-focus changes mute hover-induced swaps for a 300ms cooldown after the last keyboard event. Hover/focus on a selected option is a no-op (preview already shown). The preview pane's `data-preview-source` attribute exposes which signal currently drives the preview.
- **Screen-reader announcement `[REVISED 2026-05-08]`:** detail pane is wrapped in `aria-live="polite"`. On hover/focus changes, it announces "[Option title] preview: [first-line summary]". Suppress on selection (selection announces at the option-row level).
- **Navigation:** None — stays in the card.
- **Error handling:** Preview payload fails to render (network image, unparseable code) — show `[NEW STATE: option-preview-error]`: `alert-error` inside `info-panel` with retry affordance. Copy `[REVISED 2026-05-08]`: heading "Couldn't load this preview", body "Try again, or pick a different option.", retry CTA "Try again".

---

## States

### In-flight (default)
- The card is mounted, awaiting an answer
- Pinned as the thread hero (desktop) or mounted as the active overlay (mobile)
- Submit button: disabled (no selection) or enabled (selection made and valid)
- The agent has acknowledged the question is in-flight; while in-flight, the agent does not pose another question on the same thread (one question at a time) — see "Multiple in-flight questions" below.
- **Non-question messages while in-flight `[REVISED 2026-05-08]`:** the agent MAY post `thread-msg-system` "Heads up: [context]" messages without invalidating the in-flight card (e.g., "Heads up: another duplicate-flag landed on this referral"). The agent MUST NOT post another question card. If urgent context arrives that would change the question, the agent cancels the in-flight card (logging as `thread-msg-system` "Question dismissed — context changed") and re-poses an updated question.

### Idle (in-flight, ≥90s no interaction) `[REVISED 2026-05-08]` `[AARON-CONFIRMED 2026-05-08]`
- After 90 seconds of no focus and no interaction, the card collapses its description text into a one-line summary ("Question from Ava: [class chip text]") and dims slightly via reduced opacity to free the thread for non-blocking scrolling.
- Tapping or focusing the collapsed card re-expands to full state.
- Added as `[NEW VARIANT: thread-question-card.is-idle]` — Aaron approved 2026-05-08; locked component list expanded from 12 to 13. Cost rationale: authoring the modifier alongside the rest at PL fragment time is cheaper than retrofit; without it, stale cards stay full-size and compound with `thread-approval-card` for vertical real estate in busy threads.

### Submitted (terminal)
- After Submit succeeds, the card transitions to a `thread-msg-response`-style historical summary
- Renders the question class chip + the user's selected answer(s) + a timestamp
- Is `[NEW VARIANT: thread-msg-response.is-question-answer]` or composes existing `thread-msg-response`; steward call at PL authoring
- No interactive affordances — read-only history element in the thread

### Cancelled (terminal)
- After Cancel, the card removes itself from the thread (desktop) or dismisses the bottom-sheet (mobile)
- **Always log `[REVISED 2026-05-08]`:** a `thread-msg-system` log entry renders in place: "Question dismissed at [timestamp]". Three reasons: (a) thread-history clarity for retrospective debugging, (b) HIPAA-adjacent audit trail for clinical apps, (c) bounded noise cost (one line per cancel, dimmed register). If consecutive `thread-msg-system` entries become noisy, collapse them in a follow-up slice — a known-safe optimization, not a reason to skip logging now.

### Locked / historical (read-only)
- For thread-history view (the user is reviewing past threads, not the in-flight thread), already-answered question cards render as `[NEW VARIANT: thread-question-card.is-historical]`
- All interactive affordances disabled — option states preserved (showing what the user selected) but no Submit, no select, no Other-reveal
- Visual treatment: muted, similar to `thread-approval-card.is-historical`

### Error State (Submit failed)
- After Submit failure (network, agent rejected the answer, validation error from agent side)
- Inline `alert-error` renders inside the card body, above the option list
- Submit button returns to enabled state (allowing retry)
- **Error message default copy `[REVISED 2026-05-08]`:** "We couldn't send your answer. Try again, or close and we'll re-ask." (Spanish: "No pudimos enviar tu respuesta. Inténtalo otra vez, o ciérrala y te volveremos a preguntar."). Agent-supplied per-instance copy may override this default when the agent has specific context (e.g., "Care plan B isn't available right now — pick a different option.").
- Retry: user can re-Submit; option selection is preserved across the failure

### Empty state (no options provided)
- Edge case: agent posts a question with zero options (degenerate). The card should NOT render in this case — agent should pose a free-text-only question via a different affordance (e.g., `prompt-input-container` with the question as preceding `message-agent`).
- If the card receives zero options at runtime, render `[NEW STATE: thread-question-empty]`: `data-empty-state` with `fa-circle-question` icon. Copy `[REVISED 2026-05-08]`: heading "Question loaded without options" (Spanish: "Pregunta sin opciones"), body "Something's off on our side. Try refreshing, or message us if it stays stuck." (Spanish: "Algo no está bien de nuestra parte. Intenta refrescar, o avísanos si sigue así."). This is defensive — should never render in production; flag as bug telemetry.

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
  - On card mount, focus moves to the **first checked option-row, otherwise the first option-row** `[REVISED 2026-05-08]` — matches WAI-ARIA APG Radio Group pattern (focus the checked radio if any; else the first). [Source: W3C WAI-ARIA APG, "Radio Group Pattern"]
  - **Roving tabindex `[REVISED 2026-05-08]`:** the option-row-list uses a roving tabindex strategy — exactly one option-row has `tabindex="0"` at any time (the focused or last-focused option); all others have `tabindex="-1"`. Tab enters/exits the group as a single stop. Arrow keys move focus *and* check (single-select) or move focus only (multi-select; Space toggles).
  - Tab order: prompt body's interactive elements (none by default) → option-row list (single tab stop via roving tabindex) → Submit button → Cancel hint
  - On "Other" reveal, focus moves to the textarea (per gov.uk's "single-input conditional reveal" guidance — simple reveals perform well; complex reveals fail testing). [Source: gov.uk Accessibility Blog, "Conditionally revealed questions"]
  - On Submit success, focus moves to the post-submit thread message (Submitted state)
  - On Cancel, focus moves to the `prompt-input-container` (desktop) or the thread parent (mobile)
  - **Bottom-sheet variants (mobile):** focus is trapped inside the sheet while open (per WCAG 2.4.3 modal-overlay rule). On Sheet 2 → Sheet 1 return, focus returns to the option-row in Sheet 1 that opened Sheet 2 — NOT to Sheet 1's first option. `[REVISED 2026-05-08]`
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
- "(Recommended)" → "(Recomendado)" — verify this longer string fits the inline-with-title slot at small viewport widths; may need to break to a second line on mobile `[REVISED 2026-05-08]`. Layout escape-hatch: when `(Recomendado)` would force a line break inside the option-row title, the badge wraps to a second line within the option-row instead of stretching the title's container — handled at PL fragment authoring via `flex-wrap` on the title row.
- "Esc to cancel" → "Esc para cancelar"
- "No preview for this option" → "Sin vista previa" `[REVISED 2026-05-08]`
- "Pick a different option to see a preview, or select this one to commit." → "Selecciona otra opción para ver una vista previa, o elige esta para enviar." `[REVISED 2026-05-08]`
- "Type a different answer" (Other description) → "Escribe otra respuesta" `[REVISED 2026-05-08]`
- "Tell us what fits better." (Other textarea placeholder) → "Cuéntanos qué se ajusta mejor." `[REVISED 2026-05-08]`
- "Cancel question" (mobile close button aria-label) → "Cancelar pregunta" `[REVISED 2026-05-08]`
- "Choose this option" (Sheet 2 commit) → "Elegir esta opción" `[REVISED 2026-05-08]`
- "Back to options" (Sheet 2 back button aria-label) → "Volver a las opciones" `[REVISED 2026-05-08]`
- "Couldn't load this preview" / "Try again, or pick a different option." → "No pudimos cargar esta vista previa." / "Inténtalo otra vez o elige otra opción." `[REVISED 2026-05-08]`
- "We couldn't send your answer. Try again, or close and we'll re-ask." (Submit error default) → "No pudimos enviar tu respuesta. Inténtalo otra vez, o ciérrala y te volveremos a preguntar." `[REVISED 2026-05-08]`
- "Ava suggested these. Edit and submit when ready." (multi-select agent pre-selection line, coordinator/provider/kitchen) → "Ava sugirió estas opciones. Ajusta y envía cuando quieras." `[REVISED 2026-05-08]`
- "Ava picked these to start. Change them or send as is." (patient 5th-grade variant) → "Ava marcó estas para empezar. Cámbialas o envíalas así." `[REVISED 2026-05-08]`
- Numbered keybinding hint is language-agnostic (digits) — but caveat per MDN: French AZERTY layouts require Shift for digit keys. The digit hint is a hint, not a contract; the canonical commit is Submit-click + Enter on focused option. `[REVISED 2026-05-08]`
- Prompt body and option text are agent-authored — bilingual responsibility falls on the agent's content layer, not the card primitive
- Question class chip (header) — agent-authored; bilingual responsibility same as prompt body. Final copy examples (English): "Match referral", "Delivery time", "Care plan path", "Substitution".

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

### Resolved during ux-design-review pre-build (2026-05-08)

These items had defaults named in the wireframe; the design-review pass turned them into spec-grade rules. See inline `[REVISED 2026-05-08]` tags for each resolution.

- **Master-detail breakpoint** — implicit at shell-routing level. Above 720px → Variant 3; below 720px → Variant 5. No per-card breakpoint.
- **In-flight idle behavior (agent messages while a question is in-flight)** — agent MAY post `thread-msg-system` heads-up notes; MUST NOT post another question card. If urgent context arrives that would change the question, agent cancels and re-poses.
- **Multiple in-flight questions per thread** — locked to one question per thread. Subsequent questions queue.
- **Sequential mobile bottom-sheets, return behavior** — Sheet 2's "Choose this option" returns to Sheet 1 with the option pre-selected; Sheet 1's Submit fires the actual commit. Preserves consistent Submit affordance + reversibility + matches mobile master-detail navigation conventions.
- **"Other" reveal direction** — in-place expansion is the default for option lists ≤6. Lists exceeding 6 trigger a steward review (in-place reveal pushes options out of view at higher counts; dedicated-slot-below approach may be appropriate).
- **Cancellation logging** — always log as `thread-msg-system` "Question dismissed at [timestamp]". Bounded noise cost; HIPAA audit-trail value.
- **Loading spinner on Submit** — ship the spinner; instrument the latency. Submit transitions to disabled-with-spinner simultaneously to block double-fire. Revisit if 95p latency stays under 800ms (drop spinner) or exceeds 2s (add a "still working" affordance after 1.5s).
- **Recommendation pre-selection (multi-select)** — agent may pre-select; render a quiet "Ava suggested these" line above the option list; require at least one user-driven option toggle before the digit-keybinding fires (stray-Enter guard). Submit button itself remains clickable to honor "Submit as suggested" intent.
- **Submit double-tap protection** — Submit transitions to `disabled` simultaneously with the spinner-on transition. Canonical pattern across `thread-approval-card.actions`.
- **Master-detail focused-option precedence** — selection > keyboard-focus > hover. 300ms cooldown on hover after the last keyboard event. Detail pane carries `data-preview-source` for diagnostic + AT use.
- **Screen-reader announcement for preview swap** — detail pane wrapped in `aria-live="polite"`; announces "[Option title] preview: [first-line summary]". Suppress on selection.
- **Initial focus on card mount** — first checked option-row, otherwise first option-row (matches WAI-ARIA APG Radio Group pattern).
- **Roving tabindex** — option-row-list uses roving tabindex; one option has `tabindex="0"`, others `tabindex="-1"`. Tab is a single stop into/out of the group.
- **Bottom-sheet focus-trap** — focus is trapped inside the sheet while open (WCAG 2.4.3 modal-overlay rule).
- **Sticky-footer pinning on bottom-sheet** — pinned to `bottom-sheet-panel` root, NOT inside body's scroll context (iOS Safari address-bar collision).
- **Master-detail layout-engagement rule** — Variant 3 engages only when ≥2 options carry preview payloads OR when ≥1 option has a preview AND agent marks the question with `compare_previews: true`. Single-option-with-preview falls back to Variant 1 + a `chat-sheet-link` "View preview".
- **ARIA pattern for multi-select** — locked to `<button role="checkbox">` + `aria-checked` (NOT `aria-pressed`). `aria-pressed` is the toggle-button pattern; option-row-list is a structured group of selectable options.
- **Multi-select Submit copy default** — "Submit answers" (plural). Per-instance copy override permitted (e.g., "Apply selections", "Add to plan") when the agent's question warrants it.

### Resolved at Gate 2 review (Aaron, 2026-05-08)

All six open-questions surfaced for Aaron at Gate 2 are resolved below. The questions and answers are preserved verbatim for audit; resolutions are tagged `[AARON-CONFIRMED 2026-05-08]`.

1. **Pin-priority across thread message types** `[AARON-CONFIRMED 2026-05-08]` — confirmed. Pin order: `thread-approval-card.is-urgent > thread-question-card (in-flight) > thread-approval-card (default) > thread-question-card.is-historical`. This is a thread-rendering-policy entry that haven-mapper must surface for cross-primitive thread-renderer scope.
2. **Idle-state collapse (`thread-question-card.is-idle`)** `[AARON-CONFIRMED 2026-05-08]` — add now. Locked component list expanded from 12 to 13. Cost rationale: authoring alongside other modifiers is cheaper than retrofit; idle-collapse prevents stale-card vertical-space compounding in busy threads.
3. **PHI-redaction modifier** `[AARON-CONFIRMED 2026-05-08]` — punt to consuming-app concern. Card primitive carries no PHI-awareness; each app's thread renderer applies redaction at render time. Locked list stays at 13 (does not add a 14th).
4. **Allowlist parity for `agent_question` event type** `[AARON-CONFIRMED 2026-05-08]` — confirmed not a primitive concern. haven-ui owns the primitive; consuming apps own their `data-allowlist` config. The downstream "update each app's allowlist" work is consuming-app integration — see "Downstream consuming-app integration tasks" section below. haven-mapper surfaces these tasks but does not execute them.
5. **Recommendation pre-selection acceptance** `[AARON-CONFIRMED 2026-05-08]` — confirmed. User-must-touch + stray-Enter guard is the lock; no confirmation modal (avoids friction). Already reflected in Variant 2 spec + Interaction §"Numbered keybinding (desktop only)".
6. **Question class chip register** `[AARON-CONFIRMED 2026-05-08]` — understood. Inline `badge-pill` usage at wireframe; steward retains the call at PL authoring to promote to a `.is-question-class` modifier if visual weight warrants.

### Deferred to PL fragment authoring (visual feel-test)

These items can only be evaluated against rendered output:

- **Preview swap transition** — instant vs. subtle crossfade. Crossfade risks distraction; instant risks feeling abrupt. Test both at PL authoring with a real preview payload.
- **Per-option numbered keybinding hint visibility** — always vs. Cmd-hold vs. never. Always-on may clutter dense lists; Cmd-hold is discoverable for power users; never may underutilize the affordance. Test all three with realistic option counts (3, 5, 7).
- **Recommendation callout (`ai-insight-callout`, violet) vs. inline `(Recommended)` badge co-existence** — when both render, do they read as redundant or as reinforcing? Test in `cc-08` consuming context where the question + recommendation both carry weight. May warrant dropping one register when both are present.
- **Master-detail preview-pane primitive choice** — `info-panel` + `code-view` per-instance vs. a unified `option-preview-pane` primitive. Steward call at PL authoring with one or two real preview payloads in hand.

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
| NEW VARIANT | `thread-question-card.is-idle` `[AARON-CONFIRMED 2026-05-08]` | Tier 2 modifier | After 90s no focus/interaction, collapses description to one-line summary + dims slightly. Tap/focus re-expands. Added per Aaron's Gate 2 approval — locked list expanded 12 → 13. |

`[GATE 2]` — this wireframe flags **13 new components/variants/states** (12 at initial Gate 2 + 1 added at Aaron's Gate 2 review for idle-state). Aaron approved Gate 2 pursuit on 2026-05-08; pipeline advances to haven-mapper.

---

## Healthcare-specific notes `[REVISED 2026-05-08]`

- **Alert-fatigue mitigation `[AARON-CONFIRMED 2026-05-08]`:** if agentic-questions become high-frequency interrupts (multiple per hour for a coordinator), the always-pinned-as-hero behavior compounds with `thread-approval-card` pinning. Both can't pin simultaneously. **Pin-priority order:** `thread-approval-card.is-urgent > thread-question-card (in-flight) > thread-approval-card (default) > thread-question-card.is-historical`. This is a thread-rendering-policy entry that crosses primitives — haven-mapper must surface it as part of the thread-renderer scope, not just the question-card scope. [Source: AHRQ PSNet, "Alert Fatigue"]
- **Consuming-app context coupling:** when the question class corresponds to an existing viewer (e.g., "Match referral" → `cc-08-duplicate-comparison`), the question body should include a `chat-sheet-link` ("View full comparison") that opens the viewer in the center pane. The card stays pinned in the right pane. This pattern keeps the question + answer co-located in the thread while letting the user cross-reference the deep view without losing place.
- **HIPAA visibility for option text `[AARON-CONFIRMED 2026-05-08]`:** option titles + descriptions are agent-authored; the agent must avoid raw PHI in option text where the thread is visible to non-attending users (over-shoulder views in shared workstations). The card primitive carries no PHI-awareness — redaction is a consuming-app render-time concern. Per Aaron's Gate 2 review, no `is-phi-redacted` modifier is added to this primitive's locked component list.
- **Documentation burden:** Submitted-state's historical summary preserves the user's exact answer (not a paraphrase) for audit. No additional clinical-documentation work created.

## Use-case anchors `[REVISED 2026-05-08]`

The pattern is cross-app; specific consuming-app use cases are confirmed below.

- **Coordinator referral clarification (Variant 1):** pinned to `cc-04` (referral record) right pane. Three options + Other; question class chip "Match referral". When `cc-08-duplicate-comparison` exists for the same referral, prompt body includes a `chat-sheet-link` "View full comparison".
- **Patient meal-window selection (Variant 4, mobile):** Ava chat thread; bottom-sheet. Three meal windows; question class chip "Delivery time". 5th-grade reading level + Spanish parity required.
- **Provider clinical-decision with preview (Variant 3, desktop master-detail):** pinned to `pv-01` right pane. Two care-plan options each with preview; question class chip "Care plan path". `aria-live` announcements on preview swap. Open question #4 for Aaron: provider thread allowlist parity.
- **Kitchen substitution (Variant 2, multi-select):** pinned to `kt-01` right pane on tablet. Two-three substitution options + Other; question class chip "Substitution". Touch targets raise to 48px (gloved-hand context) via `option-row.is-tablet-dense` or per-app token override.

## Downstream consuming-app integration tasks `[AARON-CONFIRMED 2026-05-08]`

After this primitive ships, each consuming app must update its `panel-content` thread renderer's `data-allowlist` to accept the new `agent_question` event type. This is **app-architecture work, NOT a haven-ui primitive concern** — the primitive carries no allowlist semantics. haven-mapper surfaces these tasks as a follow-up list; consuming-app slices execute them.

| App | File | Change required |
|---|---|---|
| Care Coordinator | `apps/care-coordinator/src/.../thread-panel allowlist config` | Add `agent_question` to the coordinator-thread allowlist (currently includes `system`, `agent_tool_call`, `agent_tool_result`, `approval_request`, `approval_response`, `human_message`, `notification`, `status_change`) |
| Provider | provider thread renderer (when active app exists) | Add `agent_question` to the clinical-thread allowlist |
| Patient | `apps/patient/src/.../thread allowlist config` | Add `agent_question` to the patient chat-thread allowlist |
| Kitchen | `apps/kitchen/src/.../thread allowlist config` (when active) | Add `agent_question` to the order-relevant allowlist |

Pin-priority policy (resolved Open Q #1) is the same kind of cross-primitive integration — `thread-approval-card`'s thread renderer needs the new pin-priority logic added when the new primitive ships. haven-mapper will surface this alongside the allowlist tasks.

## References

- `apps/_shared/design/wireframes/agentic-question-brief.md` — pre-wireframe brief (driving spec)
- `apps/_shared/design/wireframes/shell-universal-agentic.md` — `agentic-shell` carrier surface
- `packages/design-system/pattern-library/COMPONENT-INDEX.md` — PL inventory; entries for `thread-approval-card`, `response-option`, `response-option-group`, `ai-insight-callout`, `info-panel`, `code-view`, `sticky-footer`, `cmd-palette-shortcut`, `badge-pill`, `bottom-sheet-panel`, `data-empty-state`
- `packages/design-system/pattern-library/components/thread-approval-card.html` — slot pattern precedent for the envelope
- `packages/design-system/pattern-library/components/response-option.html` — assessment-context option-row precedent (NOT reused; informs the new option-row primitive's design)
- `planning/experts/design-system-steward/judgment-framework.md` — extract-vs-keep-local rule applied to the response-option-group boundary
- `planning/experts/ux-design-lead/judgment-framework.md` — surface decision tree (in-thread default for routine + low-risk)
- `apps/care-coordinator/design/wireframes/cc-08-duplicate-comparison.md` — likely consumer of the master-detail preview variant once the pattern ships
- `apps/_shared/design/review-notes-agentic-question.md` — pre-build ux-design-review notes (2026-05-08); resolved nine of twelve original open questions, write-final-copy pass, four critical-issue patches `[REVISED 2026-05-08]`
