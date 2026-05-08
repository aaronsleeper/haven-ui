# Component Map: Agentic Question Pattern

**Date:** 2026-05-08
**Source wireframes:** `apps/_shared/design/wireframes/agentic-question.md`
**Source brief:** `apps/_shared/design/wireframes/agentic-question-brief.md`
**Source review notes:** `apps/_shared/design/review-notes-agentic-question.md`
**components.css read:** 2026-05-08 (fresh — confirmed slot patterns at lines 9091–9233 for thread-approval-card; 10418–10445 for response-option; 1840–1860 for sticky-footer; 8662–8670 for cmd-palette-shortcut; 4648–4655 for ai-insight-callout; 10285–10330 for info-panel; 1484–1565 for alert-error; 9046–9085 for thread-msg-response; 683 for badge-pill)
**COMPONENT-INDEX.md read:** 2026-05-08 (fresh — full file scanned; 369 lines)

---

## Component Inventory Summary

**Existing components composed:** 14 (`thread-approval-card` slot patterns, `sticky-footer`, `data-empty-state`, `info-panel`, `alert-error`, `cmd-palette-shortcut`, `badge-pill`, `ai-insight-callout`, `code-view`, `thread-msg-response`, `thread-msg-system`, `bottom-sheet-panel` family, `chat-sheet-link`, `agentic-shell` panes)
**New PL fragments required:** 2 (`option-row` Tier 1 primitive, `thread-question-card` Tier 2 composition primitive)
**New variants/states/sub-primitives:** 4 ship within those 2 PL fragments (`option-row.is-other`, `thread-question-card.is-historical`, `thread-question-card.is-idle`, plus `option-row-list` slot inside thread-question-card)
**Per-instance compositions (no new class):** 5 (`thread-question-footer`, `option-preview-empty`, `option-preview-error`, `thread-question-empty`, `kbd-shortcut-hint`, `badge-pill.is-question-class` via inline `.badge-pill` usage, `thread-msg-response.is-question-answer` via existing `.thread-msg-response`)
**Cross-primitive scope (NOT primitive work):** 2 (pin-priority policy across `thread-approval-card` + `thread-question-card`; allowlist parity for `agent_question` event type across 4 consuming-app thread renderers)

---

## Bucketed Delta — 13 wireframe-flagged components

Each row is one of the 13 components Aaron locked at Gate 2 (2026-05-08). Bucket per the `Slice authoring — wireframe-driven, PL-first` schema in `Lab/haven-ui/CLAUDE.md`: **exists in PL** / **novel composition** / **novel primitive**.

| # | Component | Bucket | Tier | Notes |
|---|---|---|---|---|
| 1 | `thread-question-card` | **Novel primitive** | Tier 2 (composition) | Card envelope; parallels `thread-approval-card` (`components.css` 9091–9233) but functionally distinct (prompt + recommendation + option-row-list + footer vs approval's summary + effects + attachment). Composes `thread-approval-header` + `thread-approval-body` *slot patterns* (not class reuse — pattern reuse) + new option-row-list + new thread-question-footer. New PL fragment + new components.css class set + COMPONENT-INDEX entry. Brand-fidelity-weighted → 4-expert panel required at PL authoring. |
| 2 | `option-row` | **Novel primitive** | Tier 1 | Steward verdict 2026-05-08: keep `response-option` (line 10418) assessment-only; new primitive for thread-question-card. Bold title + description + (Recommended) badge slot + single-select `<button role="radio">` + multi-select `<button role="checkbox">` variants. Brand-fidelity-weighted → 4-expert panel required at PL authoring. |
| 3 | `option-row.is-other` | **Novel primitive (sub)** | Tier 1 sub-primitive | Variant of #2. Reveal-on-select textarea — no PL precedent for this interaction. Ships within option-row's PL fragment as a variant; reveal-on-select interaction is Tier 1 novel. Same 4-expert panel as #2. |
| 4 | `option-row-list` | **Novel composition** | Tier 2 (slot-or-standalone) | Radiogroup/group container holding option-rows; provides `role` + `aria-labelledby` semantics + roving-tabindex behavior. Default: slot inside `thread-question-card` (no standalone PL entry). Steward call at PL authoring on whether it earns standalone PL status (only if a second carrier emerges that needs the radiogroup container without the question-card envelope). |
| 5 | `thread-question-footer` | **Novel composition** | Tier 2 (slot-only) | Sticky-footer composition holding Submit + numbered keybinding hint + cancel hint. Composes existing `.sticky-footer` (line 1840) + `.btn-primary.btn-block` + per-instance keybinding hint (#7). Lives as a slot inside `thread-question-card`; no standalone class needed. |
| 6 | `badge-pill.is-question-class` | **Exists in PL (per-instance)** | — | `.badge-pill` already exists (line 683). Wireframe states "Start with inline usage; promote to modifier only if a second consumer emerges." Default: per-instance `.badge-pill` with question-class label. NO new class at this slice. Steward retains the call at PL authoring to promote if visual weight warrants. |
| 7 | `kbd-shortcut-hint` | **Exists in PL (per-instance)** | — | Token reuse from `.cmd-palette-shortcut` (line 8662). Wireframe states "(steward call on whether this earns a class)." Default: per-instance utility — render the digit hint inside the Submit button label using cmd-palette-shortcut typography tokens; no new class. Promote to class only if a second consumer emerges. |
| 8 | `thread-question-card.is-historical` | **Novel composition (variant)** | Tier 2 modifier | Variant modifier on the new card primitive. Pattern is established by `.thread-approval-card.is-historical` (line 9099); applies the same muted/no-actions treatment to the new card. Ships alongside `thread-question-card` PL fragment as a modifier rule in components.css. |
| 9 | `thread-msg-response.is-question-answer` | **Exists in PL (compose existing)** | — | `.thread-msg-response` exists (line 9046) with `.is-approved` and `.is-rejected` precedent variants. Wireframe states "May not need a dedicated variant — composes existing `thread-msg-response`." Default: NO new variant — render the user's exact answer text inside the existing `.thread-msg-response-detail` slot. Steward call at PL authoring to confirm; if the answer-summary shape diverges meaningfully from the approval-summary shape, add `.is-question-answer` then. |
| 10 | `option-preview-empty` | **Novel composition (per-instance)** | Tier 2 (no class) | Composes existing `.empty-state` + `.empty-state-icon` (line 158 of COMPONENT-INDEX) with `fa-eye-slash` icon + heading + body copy. Per-instance composition; no new class needed. Master-detail variant only. |
| 11 | `option-preview-error` | **Exists in PL (compose existing)** | — | Composes existing `.alert-error` (line 1484) inside `.info-panel` (line 10285) with retry CTA. Pure composition of existing primitives; no new class needed. Master-detail variant only. |
| 12 | `thread-question-empty` | **Novel composition (per-instance)** | Tier 2 (no class) | Defensive degenerate state for zero-options input. Composes existing `.empty-state` + `.empty-state-icon` with `fa-circle-question` icon + heading + body copy. Per-instance composition; no new class needed. Should never render in production — flag as bug telemetry. |
| 13 | `thread-question-card.is-idle` | **Novel composition (variant)** | Tier 2 modifier | Aaron-confirmed at Gate 2 (2026-05-08); locked list expanded 12 → 13. Variant modifier on the new card primitive. After 90s no focus/interaction, collapses description to one-line summary + dims via reduced opacity. Tap/focus re-expands. Ships alongside `thread-question-card` PL fragment as a modifier rule. JS-driven 90s timer (no PL JS file needed; consumer-app responsibility). |

### Bucket totals

- **Novel primitive (new PL fragment + new class set + COMPONENT-INDEX row + 4-expert panel):** 2 (#1 thread-question-card, #2 option-row)
- **Novel primitive — sub:** 1 (#3 option-row.is-other; ships within #2's fragment)
- **Novel composition — variant on new primitive:** 2 (#8 is-historical, #13 is-idle; ship within #1's fragment)
- **Novel composition — slot inside new primitive (no standalone class):** 2 (#4 option-row-list, #5 thread-question-footer)
- **Novel composition — per-instance (no new class):** 2 (#10 option-preview-empty, #12 thread-question-empty)
- **Exists in PL (per-instance composition; promotion deferred):** 4 (#6 badge-pill, #7 kbd-shortcut-hint, #9 thread-msg-response, #11 option-preview-error)

**Net new PL fragments to author:** 2 — `thread-question-card` and `option-row`.
**Net new components.css class additions:** ~12–18 lines per fragment (estimated based on `thread-approval-card` and `response-option` precedents).
**Net new COMPONENT-INDEX rows:** 2 (one per PL fragment).

---

## Per-variant screen recipes

### Variant 1 — Single-select, no preview (DESKTOP, base case)

**Surface:** inline-thread approval-class card hosted in `panel-content` (right rail) of `agentic-shell`. Pins as the active hero while in-flight.

**Recipe (outermost → inward):**

1. **Container:** `<section class="thread-question-card" role="region" aria-labelledby="...">` *(NEW PRIMITIVE; new class)*
2. **Header zone:** `<div class="thread-question-card-header">` *(slot inside new primitive; styled per thread-approval-header precedent)*
   - Question class chip — `<span class="badge-pill">` (per-instance; e.g., "Match referral", "Delivery time", "Care plan path", "Substitution") *(EXISTS)*
   - Optional agent identity — `<img class="avatar avatar-xs" alt="Ava">` + name *(EXISTS — avatar + size modifier)*
3. **Body zone:** `<div class="thread-question-card-body">` *(slot inside new primitive; styled per thread-approval-body precedent)*
   - Prompt body — `<p>` Body/02 16px Source Sans 3 *(token usage; no class)*
   - Recommendation callout (when present) — `<div class="ai-insight-callout">` with `.ai-insight-callout-icon` *(EXISTS — line 4648)*
4. **Option zone:** `<div class="option-row-list" role="radiogroup" aria-labelledby="...">` *(NEW; slot inside new primitive; roving tabindex)*
   - `<button class="option-row" role="radio" aria-checked="false" tabindex="0|−1">` *(NEW PRIMITIVE; new class)*
     - Selection glyph (radio circle filled-on-select) — sub-element of option-row
     - `<span class="option-row-title">` Body/02 16px font-semibold sand-900 + inline `<span class="badge badge-sm">Recommended</span>` slot *(badge EXISTS; option-row-title is sub-class of new primitive)*
     - `<p class="option-row-description">` Body/03 14px sand-700 *(sub-class of new primitive)*
   - Final option always: `<button class="option-row option-row.is-other">` *(NEW SUB-PRIMITIVE)*
     - On selection, reveals inline `<textarea>` below description slot — focus moves to textarea on reveal
5. **Footer zone:** `<div class="sticky-footer">` *(EXISTS — line 1840)*
   - `<div class="sticky-footer-inner">` `<div class="sticky-footer-actions">`
   - `<button class="btn-primary btn-block" aria-keyshortcuts="1">` `<span class="cmd-palette-shortcut">1</span> — Submit answer `</button>` *(button + sticky-footer EXIST; cmd-palette-shortcut typography reused per-instance)*
   - Cancel hint — `<span class="text-link">Esc to cancel</span>` *(EXISTS — text-link)*

**Data bindings:** Question payload → header chip + prompt body + recommendation. Options array → option-row-list + each option-row title/description. Recommended-flag on option → inline (Recommended) badge. `aria-keyshortcuts` digit → matches Submit-button-displayed digit.

**Preline interactions:** None. Roving tabindex + radio group is React/JSX-state. Submit button transitions to `.btn-loading` on click (existing `btn-loading.html` pattern, line 99 of COMPONENT-INDEX).

### Variant 2 — Multi-select, no preview

**Surface:** same as Variant 1.

**Diffs from Variant 1:**

- `<div class="option-row-list" role="group" aria-labelledby="...">` (NOT radiogroup)
- `<button class="option-row" role="checkbox" aria-checked="false">` (NOT radio)
- Pre-selection (when agent suggests defaults): render `<p class="thread-question-suggestion-line">` above option-row-list with copy "Ava suggested these. Edit and submit when ready." (per-instance class or token reuse — steward call at PL authoring; NOT in locked list)
- Stray-Enter guard: digit-keybinding muted until at least one user-driven toggle (consumer-app state; not a primitive concern)
- Submit copy: "Submit answers" (plural)

### Variant 3 — Single-select, master-detail preview (DESKTOP)

**Surface:** breaks the pane boundary — option list takes over `panel-chat` (master); focused option's preview renders in `panel-content` (detail). Engages only when ≥2 options carry preview payloads OR when agent marks `compare_previews: true`.

**Recipe:**

- **Master pane (`panel-chat`):** Same as Variant 1 recipe, constrained to ~480px max-width within panel-chat's wider canvas.
- **Detail pane (`panel-content`):** `<div data-preview-source="selection|keyboard|hover" aria-live="polite">`
  - Per-option preview body:
    - Structured key-value content → `<div class="info-panel">` with `.info-panel-title` + `.info-panel-body` *(EXISTS — line 10285)*
    - Code/diagram content → `<div class="code-view">` with `.code-view-header` + `.code-view-body` *(EXISTS — line 77)*
  - Empty state (no-preview option focused) — `<div class="empty-state">` `<i class="empty-state-icon fa-eye-slash">` + heading "No preview for this option" + body copy *(EXISTS — line 158)*
  - Error state (preview failed to render) — `<div class="alert-error">` inside `<div class="info-panel">` with retry CTA `<button class="btn-outline btn-sm">Try again</button>` *(EXISTS)*

**Layout-engagement rule:** below 720px → fall back to Variant 5 (mobile sequential bottom-sheets). Single-option-with-preview falls back to Variant 1 + `<button class="chat-sheet-link">` ("View preview"; opens preview in `overlay-bottom-sheet`).

### Variant 4 — Mobile single-select (`overlay-bottom-sheet`)

**Surface:** `<div class="bottom-sheet-panel">` mounted as overlay invocation in `mobile-shell` *(EXISTS — line 193)*.

**Recipe:**

1. `<div class="bottom-sheet-handle">` *(EXISTS)*
2. `<header class="bottom-sheet-header">` *(EXISTS)*
   - `<span class="badge-pill">` (question class chip) + `<button class="btn-icon" aria-label="Cancel question">` `<i class="fa-xmark">` (right slot)
3. `<div class="bottom-sheet-body">` *(EXISTS — scrollable; max 85vh)*
   - Prompt body + (optional) `.ai-insight-callout` recommendation
   - `<div class="option-row-list" role="radiogroup" aria-labelledby="...">` with `option-row` instances *(NEW)*
   - Final `option-row.is-other` *(NEW)*
4. **Sticky footer pinned to `bottom-sheet-panel` ROOT** (sibling of body, NOT inside body's scroll context — per iOS Safari address-bar collision guidance):
   - `<div class="sticky-footer">` `<button class="btn-primary btn-block">` Submit answer `</button>`

**Touch targets:** `option-row` enforces 44px minimum height at primitive level. Kitchen tablet override: `option-row.is-tablet-dense` raises to 48px (steward call: modifier-on-primitive vs per-app token override).

**Focus trap:** active inside the bottom-sheet (modal-overlay; WCAG 2.4.3). Tab cycles option-rows → Submit → close-button and back. Esc dismisses.

### Variant 5 — Mobile master-detail (sequential bottom-sheets)

**Sheet 1 — option list (master):** Same as Variant 4 recipe. Each option-row with a preview shows trailing `<i class="fa-chevron-right">` glyph.

**Sheet 2 — preview detail:** Replaces Sheet 1 in the overlay slot.

1. `<header class="bottom-sheet-header">` with `<button class="btn-icon" aria-label="Back to options">` `<i class="fa-arrow-left">` (left slot) + option title text
2. `<div class="bottom-sheet-body">` hosting `.info-panel` or `.code-view` preview
3. Sticky footer: `<button class="btn-primary btn-block">` "Choose this option" — on tap, returns to Sheet 1 with this option pre-selected; Sheet 1's Submit fires the actual commit.

**Sheet-stack focus return:** when Sheet 2 dismisses, focus returns to the option-row in Sheet 1 that opened Sheet 2 (NOT to Sheet 1's first option). `aria-live` announcement on return: "Returned to options. [Option title] is selected."

---

## States (recipes)

| State | Recipe |
|---|---|
| In-flight (default) | Card mounted with current variant's recipe; pinned as thread hero; Submit disabled-or-enabled per selection. |
| **Idle** (`thread-question-card.is-idle`) `[NEW VARIANT]` | After 90s no focus/interaction: collapse description to one-line summary `<p class="thread-question-card-summary">Question from Ava: [class chip text]</p>`; reduced opacity; tap/focus re-expands. JS-driven timer at consumer level. |
| Submitted (terminal) | Card unmounts → `<div class="thread-msg-response">` with `.thread-msg-response-toggle` + `.thread-msg-response-detail` rendering exact user answer text + timestamp. NO new variant unless answer-summary shape diverges meaningfully from approval-summary (steward call at PL authoring). |
| Cancelled (terminal) | Card unmounts → `<div class="thread-msg-system">` "Question dismissed at [timestamp]" *(EXISTS — line 348)* — always log per HIPAA audit-trail value. |
| **Historical** (`thread-question-card.is-historical`) `[NEW VARIANT]` | Read-only thread-history rendering; muted treatment paralleling `.thread-approval-card.is-historical`; option states preserved (showing what user selected); no Submit, no select, no Other-reveal. |
| Error (Submit failed) | Inline `<div class="alert-error">` inside card body above option list; Submit returns to enabled (allowing retry); option selection preserved. |
| **Empty** (degenerate, defensive) | `<div class="empty-state">` `<i class="empty-state-icon fa-circle-question">` + "Question loaded without options" + body copy. Bug telemetry. |
| Loading | None — card mounts when payload is fully resolved; thread shows `tool-call`-style indicators while agent thinks. |

---

## Cross-primitive scope (NOT primitive work; surface-only)

These items are flagged for downstream tasks but are NOT inside the agentic-question primitive's authoring scope. haven-mapper surfaces them; dev-tasker enumerates them; consuming-app slices execute them.

### 1. Pin-priority policy across thread message types

**Aaron-confirmed pin order at Gate 2 (2026-05-08):**

```
thread-approval-card.is-urgent
  > thread-question-card (in-flight)
  > thread-approval-card (default)
  > thread-question-card.is-historical
```

**Where this lives:** `thread-panel`'s thread-renderer logic — NOT inside `thread-question-card` or `thread-approval-card` primitives. This is a thread-renderer-policy concern that crosses primitives.

**Work item:** when `thread-question-card` ships, `thread-panel`'s renderer in each consuming app (and any shared renderer if/when extracted) needs the new pin-priority logic added. Pre-existing `thread-approval-card`-only renderers cannot be assumed to handle the new event type's pin slot.

**Surfaced to:** dev-tasker (build sequence) and the four consuming-app slices (allowlist parity tasks below).

### 2. Allowlist parity for `agent_question` event type

After the primitive ships and React port lands, each consuming app's `panel-content` thread renderer must add `agent_question` to its `data-allowlist` attribute. Per the wireframe's downstream-tasks table:

| App | File (target) | Change |
|---|---|---|
| Care Coordinator | `apps/care-coordinator/src/.../thread-panel allowlist config` | Add `agent_question` to coordinator-thread allowlist (currently `system`, `agent_tool_call`, `agent_tool_result`, `approval_request`, `approval_response`, `human_message`, `notification`, `status_change`) |
| Provider | provider thread renderer (when active app exists) | Add `agent_question` to clinical-thread allowlist |
| Patient | `apps/patient/src/.../thread allowlist config` | Add `agent_question` to patient chat-thread allowlist |
| Kitchen | `apps/kitchen/src/.../thread allowlist config` (when active) | Add `agent_question` to order-relevant allowlist |

**Scope:** consuming-app integration; NOT primitive work. haven-ui owns the primitive; consuming apps own their `data-allowlist` config.

**Surfaced to:** dev-tasker; tracked as "downstream consuming-app integration" alongside the per-app pin-priority policy update.

---

## Recommended build sequence (for dev-tasker handoff)

This component-map proposes the following sequence; dev-tasker translates into atomic build tasks.

**Phase 1 — PL fragment authoring (Tier 1, brand-fidelity-weighted, 4-expert panel)**

1. **`option-row` PL fragment** — author HTML at `packages/design-system/pattern-library/components/option-row.html` with `@component-meta`; add `.option-row` + sub-classes + `.option-row.is-other` to `components.css`; add COMPONENT-INDEX row. Variants: single-select (`role="radio"`), multi-select (`role="checkbox"`), with-recommendation badge slot, is-other reveal-on-select.
2. **`thread-question-card` PL fragment** — author HTML at `packages/design-system/pattern-library/components/thread-question-card.html` with `@component-meta`; add `.thread-question-card` + sub-classes + `.is-historical` + `.is-idle` modifiers to `components.css`; add COMPONENT-INDEX row. Composes option-row instances inside `option-row-list` slot + sticky-footer slot (per-instance).
3. **4-expert panel review** — design-system-steward, ux-design-lead, accessibility, brand-fidelity. All four must pass (or iterate-then-ship) before merge.

Each fragment runs the blocking-on-patch gate set: `typecheck`, `conform:manifest`, `conform:app-shell`, `conform:plain-language`, `conform:css-family`, `conform:brand-fonts`, `conform:wireframe-shell`.

**Phase 2 — React port (Tier 1, mechanical 1:1)**

4. **`<OptionRow />` and `<ThreadQuestionCard />` ports** — via `ui-react-porter` skill; mirrors PL HTML 1:1; adds `registry.json` entries; adds variant-matrix Storybook stories (single-select, multi-select, is-other, with-recommendation, is-historical, is-idle).

Mechanical ports skip the 4-expert panel — review happened at PL-fragment level. Run blocking-on-patch + blocking-on-merge gates.

**Phase 3 — Per-instance compositions (deferred to first consumer-app slice)**

The following compose existing primitives or use `thread-question-card`'s slots; they author no new classes and are deferred to the first consuming-app slice:

- `thread-question-footer` (composes `.sticky-footer` + `.btn-primary.btn-block` inside thread-question-card's footer slot)
- `kbd-shortcut-hint` (per-instance `.cmd-palette-shortcut` typography inside Submit button label)
- `option-preview-empty` (per-instance `.empty-state` composition)
- `option-preview-error` (per-instance `.alert-error` inside `.info-panel`)
- `thread-question-empty` (per-instance `.empty-state` defensive composition)
- `badge-pill.is-question-class` (per-instance `.badge-pill` usage; promotion deferred to second consumer)
- `thread-msg-response.is-question-answer` (per-instance `.thread-msg-response` composition; steward call at PL authoring whether a variant is warranted)

**Phase 4 — Cross-primitive scope (NOT this slice; surface-only)**

- Thread-renderer pin-priority logic in each consuming app's `thread-panel` renderer (or shared renderer if/when extracted).
- `agent_question` allowlist addition in each of 4 apps' `data-allowlist` config.

These ship in consuming-app slices, not in haven-ui's PL or React-port slices.

**Phase 5 — Deferred to PL fragment authoring (visual feel-test)**

Four open items resolve only with rendered output (per wireframe):

- Preview swap transition: instant vs. subtle crossfade.
- Per-option numbered keybinding hint visibility: always vs. Cmd-hold vs. never.
- Recommendation callout (`ai-insight-callout`) + inline `(Recommended)` badge co-existence: redundant vs. reinforcing.
- Master-detail preview-pane primitive choice: `info-panel` + `code-view` per-instance vs. unified `option-preview-pane` primitive.

These do NOT block Phase 1; tested with a real preview payload during PL fragment authoring.

---

## Utility-only patterns

- `aria-keyshortcuts="1"` on Submit button — declarative attribute, not a class.
- Roving tabindex on option-row-list — JSX state, not a class.
- 90s idle timer for `is-idle` activation — JS-driven at consumer level; not a PL JS file.
- 300ms hover-cooldown after keyboard event in master-detail preview — consumer-app state.
- `data-preview-source="selection|keyboard|hover"` on detail pane — diagnostic + AT announcement attribute, not a class.

---

## Preline interactions

- **Bottom-sheet (mobile):** `data-hs-overlay` on Variant 4 + Variant 5 trigger; uses HSOverlay (existing `bottom-sheet-panel` pattern, line 193).
- **No new Preline integrations** — option-rows use React state + roving tabindex; no Preline JS for the question primitive itself.

---

## References

- `packages/design-system/pattern-library/components/thread-approval-card.html` — slot pattern precedent for the envelope.
- `packages/design-system/pattern-library/components/response-option.html` — assessment-context option-row precedent (NOT reused per steward verdict; informs option-row primitive's design only).
- `packages/design-system/pattern-library/components/layout-sticky-footer.html` — footer composition precedent.
- `packages/design-system/pattern-library/components/data-empty-state.html` — empty-state precedent for `option-preview-empty` and `thread-question-empty`.
- `packages/design-system/pattern-library/components/info-panel.html` + `code-view.html` — master-detail preview composition.
- `packages/design-system/pattern-library/components/overlay-bottom-sheet.html` — mobile shell precedent for Variants 4 + 5.
- `apps/_shared/design/wireframes/agentic-question.md` — driving wireframe.
- `apps/_shared/design/review-notes-agentic-question.md` — pre-build review notes (53 [REVISED] tags + Gate 2 resolutions).
- `apps/_shared/design/wireframes/agentic-question-brief.md` — pre-wireframe brief.

---

_Last updated: 2026-05-08_
