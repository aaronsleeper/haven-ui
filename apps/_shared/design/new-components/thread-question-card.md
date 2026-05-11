# New Component Spec: `thread-question-card`

**Date:** 2026-05-08
**Tier:** 2 — Novel composition primitive (PL fragment + components.css class set + COMPONENT-INDEX entry; brand-fidelity-weighted → 4-expert panel required)
**Priority:** Required for launch (downstream React port + first consumer-app slice block on this primitive)
**App:** Multi-app shared primitive (Care Coordinator, Provider, Kitchen, Patient)
**Wireframes:**
- `apps/_shared/design/wireframes/agentic-question.md` (driving)
**Component map:**
- `apps/_shared/design/component-map-agentic-question.md`
**Companion specs:**
- `apps/_shared/design/new-components/option-row.md` (Tier 1 dependency — must ship first)
**Gate references:**
- Gate 2 approved 2026-05-08 (Aaron); 13-component scope locked (12 → 13 with `.is-idle`)
- Gap-gate approved 2026-05-08 (Aaron); per-component spec authoring authorized
- UX Lead primed-pass verdict 2026-05-08: NOT modal-by-default; haven-ui has a thread pane, invert from Claude Code's modal to inline-thread approval-class card.
- Pin-priority order locked 2026-05-08 (Aaron, Gate 2 review): `thread-approval-card.is-urgent > thread-question-card (in-flight) > thread-approval-card (default) > thread-question-card.is-historical`. Cross-primitive thread-renderer-policy concern; surfaced for downstream consuming-app slices.

---

## Purpose

A thread-embedded card that renders an agent-posed structured question requiring a single-or-multi-option commit (with optional free-text "Other" fallback). Parallels `thread-approval-card` as a thread hero: pinned in `panel-content` (right rail) on desktop, mounted as `overlay-bottom-sheet` on mobile, expanding to master-detail across `panel-chat + panel-content` (desktop) or sequential bottom-sheets (mobile) when options carry rich preview payloads.

The card carries the question's full context (question-class chip, prompt body with optional recommendation, option set, Submit commit) co-located with the agent's preceding thread message — so the question and answer share provenance.

The pattern's success state: the user reads the question, scans options + recommendation in under 5 seconds for routine cases, and commits. For preview-bearing options, the user can compare-and-commit without leaving the thread.

---

## Used In

Multi-app primitive consumed by:
- **Care Coordinator** — referral-clarification flow (`cc-04` and similar). Variant 1 (single-select) primary; Variant 3 (master-detail) for `cc-08`-style duplicate-comparison previews.
- **Provider** — clinical-decision-with-preview flow (`pv-01` and similar). Variant 3 master-detail desktop primary.
- **Kitchen** — substitution flow (`kt-01`). Variant 2 (multi-select) primary on tablet; `option-row.is-tablet-dense` modifier raises touch targets to 48px.
- **Patient** — meal-window selection in Ava chat thread. Variant 4 (mobile bottom-sheet) primary; 5th-grade reading level + Spanish parity required.

This is the third thread-message-class card in the system (after `thread-approval-card` and `thread-msg-response`); future thread-message-class additions follow this slot pattern.

---

## Preline Base

**None directly on the card.** Composes existing Preline-backed primitives in mobile variants:

- `bottom-sheet-panel` family (`data-hs-overlay`) — Variants 4 + 5
- `chat-sheet-link` (existing primitive) — Variant 3 fallback when single option carries preview payload

The card itself is React/JSX-driven for: selection state, roving tabindex, idle timer, master-detail layout-engagement, preview-pane data-source attribute. No new Preline integrations.

---

## New Classes Required

| Class | Type | Notes |
|---|---|---|
| `.thread-question-card` | Primitive base | Outer `<section>` element; envelope paralleling `thread-approval-card` |
| `.thread-question-card-header` | Slot | Question class chip + optional agent identity |
| `.thread-question-card-body` | Slot | Prompt body + optional recommendation callout + option-row-list |
| `.thread-question-card-prompt` | Slot | Body/02 prose (the question text); receives `id` for `aria-labelledby` from option-row-list |
| `.thread-question-card-summary` | Slot (idle-state only) | One-line summary rendered in `.is-idle`; replaces description body |
| `.thread-question-card.is-historical` | Variant | Read-only thread-history rendering; muted; no Submit, no select, no Other-reveal |
| `.thread-question-card.is-idle` | Variant | After 90s no focus/interaction: collapses description to one-line summary + dims via opacity reduction |

**Existing classes reused (composed inside `thread-question-card`):**

- `.option-row` + `.option-row-list` (Tier 1 dependency; see companion spec)
- `.badge-pill` — question class chip (per-instance; promotion to `.is-question-class` deferred to second consumer)
- `.ai-insight-callout` + `.ai-insight-callout-icon` — recommendation register
- `.sticky-footer` + `.sticky-footer-inner` + `.sticky-footer-actions` — footer composition
- `.btn-primary` + `.btn-block` — Submit button
- `.btn-loading` + `.btn-spinner` — Submit in-flight state
- `.text-link` — cancel hint ("Esc to cancel")
- `.cmd-palette-shortcut` — numbered keybinding hint typography (per-instance token reuse)
- `.thread-msg-response` — Submitted-state historical summary (compose existing; no new variant unless answer-summary shape diverges)
- `.thread-msg-system` — Cancelled-state log entry ("Question dismissed at [timestamp]")
- `.alert-error` — Error state (Submit failed)
- `.empty-state` + `.empty-state-icon` — `thread-question-empty` defensive state (per-instance composition); also `option-preview-empty` (Variant 3)
- `.info-panel` + `.code-view` — master-detail preview pane primitives (Variant 3)
- `.bottom-sheet-panel` + `.bottom-sheet-handle` + `.bottom-sheet-header` + `.bottom-sheet-title` + `.bottom-sheet-body` — Variants 4 + 5
- `.btn-icon` — close button in bottom-sheet header (`fa-xmark` close, `fa-arrow-left` back)
- `.chat-sheet-link` — Variant 3 fallback for single-option-with-preview
- `.avatar.avatar-xs` — agent identity badge (Ava)

**Custom CSS variable:**

| Variable | Default | Purpose |
|---|---|---|
| `--thread-question-card-idle-opacity` | `0.65` | `.is-idle` dimming level; tuned at PL authoring |

---

## HTML Structure

### Variant 1 — Single-select, no preview (DESKTOP, base case)

```html
<section
  class="thread-question-card"
  role="region"
  aria-labelledby="thread-question-card-prompt-[id]"
  data-pin-priority="2"
>
  <!-- Header zone -->
  <div class="thread-question-card-header">
    <span class="badge-pill">Match referral</span>
    <img class="avatar avatar-xs" src="/sphere-ava.png" alt="Ava">
  </div>

  <!-- Body zone -->
  <div class="thread-question-card-body">
    <p
      id="thread-question-card-prompt-[id]"
      class="thread-question-card-prompt"
    >
      A new referral landed for Aaron Sleeper. Should I match it to the existing referral or treat it as a new one?
    </p>

    <!-- Optional recommendation callout (when agent has a preferred answer) -->
    <div class="ai-insight-callout">
      <i class="fa-solid fa-sparkles ai-insight-callout-icon" aria-hidden="true"></i>
      <span><strong>Recommendation:</strong> Match to existing referral — same provider, last seen 3 days ago.</span>
    </div>

    <!-- Option zone — option-row-list slot -->
    <div
      class="option-row-list"
      role="radiogroup"
      aria-labelledby="thread-question-card-prompt-[id]"
    >
      <!-- option-row × N (per option-row spec); .is-other always last -->
      <button class="option-row" role="radio" aria-checked="false" tabindex="0">
        <span class="option-row-glyph" aria-hidden="true"></span>
        <span class="option-row-content">
          <span class="option-row-title">
            Match to existing referral
            <span class="badge badge-sm option-row-recommended">Recommended</span>
          </span>
          <span class="option-row-description">Aaron Sleeper from BHN — same patient, same provider, last seen 3 days ago.</span>
        </span>
        <i class="fa-solid fa-check option-row-check" aria-hidden="true"></i>
      </button>
      <!-- ... additional option-rows ... -->
      <button class="option-row is-other" role="radio" aria-checked="false" tabindex="-1" aria-expanded="false" aria-controls="opt-other-textarea-[id]">
        <span class="option-row-glyph" aria-hidden="true"></span>
        <span class="option-row-content">
          <span class="option-row-title">Other</span>
          <span class="option-row-description">Type a different answer</span>
        </span>
        <i class="fa-solid fa-check option-row-check" aria-hidden="true"></i>
      </button>
    </div>
  </div>

  <!-- Footer zone — composes sticky-footer -->
  <div class="sticky-footer">
    <div class="sticky-footer-inner">
      <div class="sticky-footer-actions">
        <button
          type="button"
          class="btn-primary btn-block"
          aria-keyshortcuts="1"
          disabled
        >
          <span class="cmd-palette-shortcut" aria-hidden="true"><kbd>1</kbd></span>
          Submit answer
        </button>
        <span class="text-link" aria-hidden="true">Esc to cancel</span>
      </div>
    </div>
  </div>
</section>
```

### Variant 2 — Multi-select, no preview

Diffs from Variant 1:

```html
<!-- Optional pre-selection suggestion line above option-row-list (when agent pre-selects) -->
<p class="thread-question-card-suggestion">Ava suggested these. Edit and submit when ready.</p>

<div
  class="option-row-list"
  role="group"  <!-- NOT radiogroup -->
  aria-labelledby="thread-question-card-prompt-[id]"
>
  <button class="option-row" role="checkbox" aria-checked="false" tabindex="0">
    <!-- ... -->
  </button>
</div>

<!-- Submit -->
<button type="button" class="btn-primary btn-block" aria-keyshortcuts="1">
  <span class="cmd-palette-shortcut" aria-hidden="true"><kbd>1</kbd></span>
  Submit answers
</button>
```

The pre-selection suggestion line uses Body/03 muted-tone copy. Per-instance composition; no new class. (If a third surface needs the same line, promote to `.thread-question-card-suggestion`.)

### Variant 3 — Single-select, master-detail preview (DESKTOP)

The card breaks the pane boundary. Two regions render in tandem:

```html
<!-- Master pane (panel-chat) — same Variant 1 recipe constrained to ~480px max-width -->
<section class="thread-question-card" role="region" aria-labelledby="...">
  <!-- header / body / footer as Variant 1, with constrained inner max-width -->
</section>

<!-- Detail pane (panel-content) — focused option's preview -->
<div
  class="thread-question-card-preview"
  data-preview-source="selection|keyboard|hover"
  aria-live="polite"
>
  <!-- Renders one of: -->

  <!-- Structured content -->
  <div class="info-panel">
    <h3 class="info-panel-title">Care plan path B preview</h3>
    <div class="info-panel-body">
      <p>Low-sodium, 2200 kcal/day, 6 meals/day. Adjusts for HbA1c trend.</p>
    </div>
  </div>

  <!-- OR — Code/diagram content -->
  <div class="code-view">
    <header class="code-view-header">
      <span class="code-view-title">care-plan-b.json</span>
    </header>
    <pre class="code-view-body">{ "kcal": 2200, "sodium_mg": 1500 }</pre>
  </div>

  <!-- OR — Empty state (no-preview option focused) — per-instance composition -->
  <div class="empty-state">
    <i class="fa-solid fa-eye-slash empty-state-icon" aria-hidden="true"></i>
    <h3>No preview for this option</h3>
    <p>Pick a different option to see a preview, or select this one to commit.</p>
  </div>

  <!-- OR — Error state — per-instance composition -->
  <div class="info-panel">
    <div class="alert-error">
      <i class="fa-solid fa-circle-exclamation alert-icon" aria-hidden="true"></i>
      <div>
        <h4>Couldn't load this preview</h4>
        <p>Try again, or pick a different option.</p>
      </div>
    </div>
    <div class="info-panel-actions">
      <button type="button" class="btn-outline btn-sm">Try again</button>
    </div>
  </div>
</div>
```

The `.thread-question-card-preview` wrapper is per-instance — no new class on the primitive itself. The `data-preview-source` attribute exposes precedence (selection > keyboard-focus > hover) for diagnostic + AT use; consumer-side state.

**Layout-engagement rule (resolved 2026-05-08):** Variant 3 engages only when ≥2 options carry preview payloads OR ≥1 option has preview AND agent marks `compare_previews: true`. Single-option-with-preview falls back to Variant 1 + a `chat-sheet-link` ("View preview") that opens the preview in `overlay-bottom-sheet`.

### Variant 4 — Mobile single-select (`overlay-bottom-sheet`)

```html
<div
  class="bottom-sheet-panel"
  data-hs-overlay-keyboard="true"
  role="dialog"
  aria-labelledby="thread-question-card-prompt-[id]"
>
  <div class="bottom-sheet-handle" aria-hidden="true"></div>

  <header class="bottom-sheet-header">
    <span class="badge-pill">Delivery time</span>
    <button
      type="button"
      class="btn-icon"
      aria-label="Cancel question"
      data-hs-overlay-close
    >
      <i class="fa-solid fa-xmark" aria-hidden="true"></i>
    </button>
  </header>

  <div class="bottom-sheet-body">
    <p
      id="thread-question-card-prompt-[id]"
      class="thread-question-card-prompt"
    >
      What time works best for your meal delivery?
    </p>

    <div class="option-row-list" role="radiogroup" aria-labelledby="thread-question-card-prompt-[id]">
      <!-- option-row × N (option-row.is-tablet-dense for kitchen if applicable) -->
      <!-- option-row.is-other last -->
    </div>
  </div>

  <!-- Sticky footer pinned to bottom-sheet-panel ROOT (sibling of body, NOT inside body's scroll context) -->
  <div class="sticky-footer">
    <div class="sticky-footer-inner">
      <div class="sticky-footer-actions">
        <button type="button" class="btn-primary btn-block" disabled>Submit answer</button>
      </div>
    </div>
  </div>
</div>
```

**Sticky-footer placement:** the wireframe explicitly resolves this — pin to `bottom-sheet-panel` root (sibling of body), NOT inside body's scroll context. Rationale: iOS Safari's bottom-bar collapse during scroll can briefly hide a body-internal footer behind the address bar.

**Focus trap:** active inside the bottom-sheet (modal-overlay; WCAG 2.4.3). Tab cycles option-rows → Submit → close-button and back. Esc dismisses.

**Touch targets:** 44px floor on `option-row`; kitchen tablet override raises to 48px via `option-row.is-tablet-dense`.

### Variant 5 — Mobile master-detail (sequential bottom-sheets)

Two bottom-sheet invocations swap in/out:

**Sheet 1 (option list — master):** same as Variant 4. Each option-row with a preview shows trailing `<i class="fa-chevron-right">` glyph indicating "tap for preview."

**Sheet 2 (preview detail):**

```html
<div class="bottom-sheet-panel" role="dialog" aria-labelledby="...">
  <div class="bottom-sheet-handle" aria-hidden="true"></div>

  <header class="bottom-sheet-header">
    <button
      type="button"
      class="btn-icon"
      aria-label="Back to options"
    >
      <i class="fa-solid fa-arrow-left" aria-hidden="true"></i>
    </button>
    <h2 class="bottom-sheet-title">Care plan path B</h2>
  </header>

  <div class="bottom-sheet-body">
    <!-- info-panel or code-view, same as Variant 3 detail pane -->
  </div>

  <div class="sticky-footer">
    <div class="sticky-footer-inner">
      <div class="sticky-footer-actions">
        <button type="button" class="btn-primary btn-block">Choose this option</button>
      </div>
    </div>
  </div>
</div>
```

**Sheet-stack focus return:** when Sheet 2 dismisses (via back or via Choose-this-option), focus returns to the option-row in Sheet 1 that opened Sheet 2 — NOT to Sheet 1's first option. SR announcement: "Returned to options. [Option title] is selected. Submit answer at the bottom."

**Sheet 2 → Sheet 1 return behavior:** Sheet 2's "Choose this option" returns to Sheet 1 with the option pre-selected; Sheet 1's Submit fires the actual commit.

### State variants

#### `.is-idle`

```html
<section class="thread-question-card is-idle" role="region" aria-labelledby="...">
  <div class="thread-question-card-header">
    <span class="badge-pill">Match referral</span>
  </div>
  <div class="thread-question-card-body">
    <!-- Description body collapsed; one-line summary in its place -->
    <p class="thread-question-card-summary">Question from Ava: Match referral</p>
  </div>
  <!-- Footer hidden (or muted; consumer-app choice; primitive default: hidden) -->
</section>
```

Triggered by 90s no focus + no interaction. Tap or focus re-expands to full state.

#### `.is-historical`

```html
<section class="thread-question-card is-historical" role="region" aria-labelledby="...">
  <!-- Same structure as Variant 1, but: -->
  <!-- - aria-disabled on all option-rows -->
  <!-- - Submit button removed or disabled -->
  <!-- - Selected state preserved (showing what user selected) -->
</section>
```

Read-only thread-history rendering. Muted treatment paralleling `.thread-approval-card.is-historical`.

#### Submitted-state (transitions to `thread-msg-response`)

The card unmounts and a `thread-msg-response` historical summary renders in its place — no new `thread-question-card` state needed.

```html
<!-- Composes existing thread-msg-response; no .is-question-answer variant unless answer-summary shape diverges -->
<div class="thread-msg-response">
  <button class="thread-msg-response-toggle">
    <strong>You answered:</strong> Match to existing referral
  </button>
  <div class="thread-msg-response-detail">
    <span class="thread-msg-time">2026-05-08 9:42 AM</span>
  </div>
</div>
```

Format: `"[User] answered: [exact option title(s)]. [timestamp]"`. For "Other" answers: `"[User] answered: [free-text body]. [timestamp]"` — free-text payload preserved verbatim (audit-trail value).

#### Cancelled-state (transitions to `thread-msg-system`)

```html
<div class="thread-msg-system">
  <span>Question dismissed at 9:43 AM</span>
  <span class="thread-msg-time">2026-05-08 9:43 AM</span>
</div>
```

Always log per HIPAA-adjacent audit-trail value (resolved 2026-05-08).

#### Error-state (Submit failed; inline)

```html
<div class="thread-question-card-body">
  <div class="alert-error">
    <i class="fa-solid fa-circle-exclamation alert-icon" aria-hidden="true"></i>
    <div>
      <p>We couldn't send your answer. Try again, or close and we'll re-ask.</p>
    </div>
  </div>
  <!-- option-row-list still rendered; selection preserved; Submit returns to enabled -->
</div>
```

Agent-supplied per-instance copy may override the default error message when the agent has specific context.

#### Empty-state (defensive; zero options)

```html
<section class="thread-question-card" role="region" aria-labelledby="...">
  <div class="thread-question-card-body">
    <div class="empty-state">
      <i class="fa-solid fa-circle-question empty-state-icon" aria-hidden="true"></i>
      <h3>Question loaded without options</h3>
      <p>Something's off on our side. Try refreshing, or message us if it stays stuck.</p>
    </div>
  </div>
</section>
```

Should never render in production — flag as bug telemetry. Consumer-app guards against zero-option payloads; this state exists as a defensive fallback.

---

## CSS Definition (`components.css` additions)

```css
/* ============================================================
   thread-question-card
   Tier 2 novel composition primitive — agentic-question pattern
   envelope. Parallels thread-approval-card slot pattern but
   functionally distinct (prompt + recommendation + option-row-list
   + footer vs approval's summary + effects + attachment).
   Wireframe source: agentic-question.md
   Pin priority: 2 (in-flight) / 4 (historical).
   ============================================================ */

.thread-question-card {
    --thread-question-card-idle-opacity: 0.65;

    /* Surface: explicit var(--color-sand-50) matches thread-approval-card
       family register (Round 1 brand + steward verdict 2026-05-11).
       Avoids bg-surface-card alias's drift risk vs the sibling hero. */
    @apply flex flex-col gap-3 w-full p-4 rounded-[8px];
    background-color: var(--color-sand-50);
    border: 1px solid var(--color-border-image);
    /* 4px left border (was 3px) for family parity with thread-approval-card
       — Round 1 brand verdict 2026-05-11. */
    border-left: 4px solid var(--color-primary-500);
}

/* ----------------------------------------------------------
   Header — question class chip + optional agent identity
   Composes existing .badge-pill and .avatar.avatar-xs.
   ---------------------------------------------------------- */

.thread-question-card-header {
    @apply flex items-center justify-between gap-2;
}

/* ----------------------------------------------------------
   Body — prompt + optional recommendation + option-row-list
   ---------------------------------------------------------- */

.thread-question-card-body {
    @apply flex flex-col gap-3;
}

.thread-question-card-prompt {
    @apply text-body-02 m-0;
    color: var(--color-text-normal);
}

/* Suggestion line (multi-select, when agent pre-selects).
   Per-instance Body/03 muted-tone copy. Promote to its own class
   only if a third surface needs the same line. sand-700 (was sand-600)
   so italic register reads as informational rather than decorative
   metadata — Round 1 brand verdict 2026-05-11. */
.thread-question-card-suggestion {
    @apply text-body-03 m-0 italic;
    color: var(--color-sand-700);
}

/* ----------------------------------------------------------
   .is-idle — 90s collapse to one-line summary + dim
   ---------------------------------------------------------- */

.thread-question-card.is-idle {
    opacity: var(--thread-question-card-idle-opacity);
    transition: opacity var(--duration-default) var(--ease-default);
}

@media (prefers-reduced-motion: reduce) {
    .thread-question-card.is-idle {
        transition: none;
    }
}

.thread-question-card.is-idle:hover,
.thread-question-card.is-idle:focus-within {
    opacity: 1;
}

/* Idle summary — one-line replacement for the body description */
.thread-question-card-summary {
    @apply text-body-03 m-0;
    color: var(--color-sand-700);
}

/* ----------------------------------------------------------
   .is-historical — read-only thread-history rendering
   Mirrors thread-approval-card.is-historical muted treatment.
   ---------------------------------------------------------- */

.thread-question-card.is-historical {
    /* Background sand-50 already set on base after Round 1 surface-token alignment;
       explicit redeclaration kept for structural parity with .dark .is-historical. */
    background-color: var(--color-sand-50);
    /* sand-600 (was sand-400) to clear WCAG 1.4.11 against sand-50 surface
       (sand-400 = 1.93:1 FAIL; sand-600 = 3.61:1 PASS) — Round 1 a11y
       verdict 2026-05-11. */
    border-left-color: var(--color-sand-600);
    /* opacity 0.70 (was 0.85) for family parity with thread-approval-card.is-historical
       — Round 1 steward verdict 2026-05-11. */
    opacity: 0.70;
}

.thread-question-card.is-historical .option-row {
    cursor: default;
    pointer-events: none;
}

.thread-question-card.is-historical .option-row:hover {
    background-color: inherit;
    border-color: inherit;
}

/* ----------------------------------------------------------
   Dark mode
   All color properties redeclared — no implicit inheritance.
   ---------------------------------------------------------- */

.dark .thread-question-card {
    background-color: var(--color-sand-900);
    border-color: var(--color-sand-700);
    border-left-color: var(--color-primary-400);
}

.dark .thread-question-card-prompt {
    color: var(--color-sand-100);
}

.dark .thread-question-card-suggestion {
    color: var(--color-sand-400);
}

.dark .thread-question-card-summary {
    color: var(--color-sand-300);
}

.dark .thread-question-card.is-historical {
    background-color: var(--color-sand-950);
    border-left-color: var(--color-sand-600);
}
```

---

## Variants

### Composition variants (5 wireframe surface variants)

The 5 wireframe variants (single-select desktop / multi-select / master-detail desktop / mobile bottom-sheet / mobile sequential) compose at the consumer-app layer — they're not class modifiers on the primitive itself. The primitive provides the slots; the consumer composes which carrier shell hosts it (`agentic-shell` `panel-content` vs `bottom-sheet-panel` vs split master-detail).

### State variants (modifier classes on the primitive)

- `.is-idle` — 90s no-interaction collapse + dim
- `.is-historical` — read-only thread-history rendering

These are the only two new classes on `thread-question-card` itself. All other "variants" listed in the wireframe (e.g., recommendation callout present/absent) are conditional render of composed primitives.

### Pin-priority data attribute

`data-pin-priority="2"` on in-flight cards; `data-pin-priority="4"` on historical cards. Consumer-side `thread-panel` renderer reads this attribute to enforce the pin order:

```
1: thread-approval-card.is-urgent
2: thread-question-card (in-flight)
3: thread-approval-card (default)
4: thread-question-card.is-historical
```

The pin-priority logic lives in `thread-panel`, not in `thread-question-card`. The primitive only supplies the data attribute. (See component-map "Cross-primitive scope".)

---

## Data Bindings

| Element | Binding |
|---|---|
| Rendered condition | `event.type === 'agent_question'` (after consuming-app allowlist update) |
| `data-pin-priority` | `'2'` (in-flight) or `'4'` (`.is-historical`) — consumed by `thread-panel` renderer |
| `.thread-question-card-header` badge | `question.class` — agent-authored short label (~12 char), per-instance `.badge-pill` |
| `.avatar.avatar-xs` (agent identity) | Conditional render when asking-agent isn't implicit from context; `src` is agent's avatar asset |
| `.thread-question-card-prompt` text | `question.body` — agent-authored prose; receives `id` for `aria-labelledby` |
| `.ai-insight-callout` (recommendation) | Conditional render when `question.recommendation` is non-empty |
| `option-row-list` | `*ngFor` over `question.options[]`; each option binds per `option-row` spec |
| `option-row.is-other` | Append at end iff `question.allow_other === true` |
| `aria-checked` per option-row | `selectedIds.includes(option.id)` |
| `.thread-question-card.is-idle` | 90s no focus/no interaction timer; consumer-app maintained |
| `.thread-question-card.is-historical` | Static after Submit success → card replaced with `thread-msg-response`; `.is-historical` is for thread-history view (past threads, not in-flight) |
| Submit button `aria-keyshortcuts` | Digit "1" by default; matches the position of recommended option (or first option if no recommendation); consumer-app sets per-instance |
| Submit `disabled` | True until ≥1 option selected (single/multi) OR `.is-other` selected with non-whitespace textarea content |
| Submitted-state | Card unmounts → `<div class="thread-msg-response">` renders user's exact answer text + timestamp |
| Cancelled-state | Card unmounts → `<div class="thread-msg-system">` "Question dismissed at [timestamp]" |
| Error-state | Inline `.alert-error` above option-row-list; Submit returns to enabled; selection preserved |

---

## Accessibility Notes

- **Roles + ARIA:**
  - `<section role="region" aria-labelledby="...">` — landmark for SR navigation; `aria-labelledby` references the prompt body's `id`
  - `<p>` prompt body has `id` matched by both `aria-labelledby` (region) and `aria-labelledby` (option-row-list)
  - Submit button: `aria-keyshortcuts="1"` (or whichever displayed digit) — per MDN; AT announces the affordance regardless of layout
- **Focus management:**
  - On card mount: focus moves to first checked option-row, otherwise first option-row (WAI-ARIA APG Radio Group). Consumer-side responsibility.
  - On Submit success: focus moves to the post-submit `thread-msg-response`. Consumer-side.
  - On Cancel (desktop): focus moves to `prompt-input-container`. Consumer-side.
  - On Cancel (mobile): focus moves to thread parent.
  - **Bottom-sheet variants (Variants 4 + 5):** focus is trapped inside the sheet (WCAG 2.4.3 modal-overlay rule). Tab cycles option-rows → Submit → close-button and back. Esc dismisses. Sheet 2 → Sheet 1 return preserves which option-row opened Sheet 2.
- **Keyboard shortcuts:**
  - Tab — enter/exit the card (single stop into option-row-list via roving tabindex)
  - Arrow keys — navigate within radiogroup (single-select); jump within multi-select via Tab
  - Space/Enter — select focused option
  - Number keys 1–9 — select corresponding option (per Numbered keybinding)
  - Esc — cancel/dismiss
- **Numbered keybinding caveat:** per MDN's `aria-keyshortcuts` reference, single-digit shortcuts are fragile across keyboard layouts (French AZERTY requires Shift for digits 1–9). The Submit-button digit is a hint, not a contract; canonical commit is Submit-click + Enter on focused option.
- **Stray-Enter guard (multi-select):** when agent pre-selects, Submit remains clickable but the digit-keybinding requires at least one user-driven option toggle before firing. Consumer-side state.
- **Screen-reader announcements:**
  - On mount: "Question from [agent name]: [prompt body]. [N] options. Use arrow keys to select."
  - On option focus: option title + description + "Recommended" if applicable (option-row's accessible name carries this)
  - On Submit success: "Answer submitted. [Brief response from agent if available]."
  - On Submit failure: "Submit failed. [Error message]. Press Enter to retry."
  - On preview swap (Variant 3): `aria-live="polite"` on the preview wrapper announces "[Option title] preview: [first-line summary]." Suppress on selection (selection announces at option-row level).
  - On Sheet 2 → Sheet 1 return (Variant 5): "Returned to options. [Option title] is selected. Submit answer at the bottom."
- **Color independence:**
  - Question class chip uses `.badge-pill` text label as canonical signal; color is reinforcement
  - Recommendation: violet `.ai-insight-callout` register paired with text label "Recommendation:"
  - Selected state: triple-cued via `option-row` (filled glyph + ring + check icon)
  - Error state: `.alert-error` carries `fa-circle-exclamation` icon + text
- **Touch targets (mobile):**
  - `option-row` 44px floor (48px with `.is-tablet-dense` for kitchen)
  - Submit button 48px minimum height (consumer composes `.btn-block` + sticky-footer padding)
  - "Other" textarea 44px minimum after reveal
- **Reduced motion:** `.is-idle` opacity transition suppressed under `(prefers-reduced-motion: reduce)`; state still applies — only the transition is suppressed.
- **HIPAA visibility:** option titles + descriptions are agent-authored; agent must avoid raw PHI in option text where the thread is visible to non-attending users (over-shoulder views in shared workstations). The card primitive carries no PHI-awareness — redaction is consuming-app render-time concern (resolved 2026-05-08; no `is-phi-redacted` modifier in scope).

---

## 4-Expert Panel Scope

Required before PL fragment ships (Tier 1, brand-fidelity-weighted per `Lab/haven-ui/CLAUDE.md` § Slice authoring — wireframe-driven, PL-first). Option-row's panel runs first; this panel runs after option-row is approved.

| Expert | Focus areas |
|---|---|
| **Pattern-library steward** | Card envelope vs `thread-approval-card` parallel — slot-pattern reuse vs class-name divergence (this primitive shares slot *patterns* but uses its own class names); `.is-idle` and `.is-historical` as primitive modifiers vs sibling primitives; preview-pane composition (info-panel + code-view per-instance vs unified `option-preview-pane` primitive — wireframe defers this to PL authoring feel-test); pin-priority `data-pin-priority` attribute as primitive contract vs thread-renderer-only concern; per-instance vs class promotions: `.thread-question-card-suggestion`, `.thread-question-card-preview`, `kbd-shortcut-hint`, `badge-pill.is-question-class`. |
| **Information architecture** | Card scan order (header chip → prompt → recommendation → options → footer); recommendation callout (`ai-insight-callout`) + inline `(Recommended)` badge co-existence — wireframe explicitly defers this feel-test to PL authoring; question-class chip register (badge-pill weight; promote to `.is-question-class` modifier only if a second consumer warrants); pre-selection suggestion line placement (above option-row-list vs inline within first option vs separate row); idle-state collapse content (one-line summary copy "Question from Ava: [class]"); historical-state minimal info preserved. |
| **Accessibility** | `<section role="region" aria-labelledby>` landmark; option-row-list `aria-labelledby` referencing prompt body; `aria-keyshortcuts` on Submit; bottom-sheet focus-trap + sheet-stack focus-return (Sheet 2 → Sheet 1); preview-pane `aria-live="polite"` announcements (Variant 3); SR cadence on mount; numbered keybinding layout caveat (AZERTY); 44px / 48px touch-target floors; sticky-footer at bottom-sheet-panel root (NOT inside body's scroll) — iOS Safari address-bar collision; reduced-motion handling on `.is-idle`; contrast pairs: primary-500 left border on sand-50 surface (≥3:1), sand-900 prompt on sand-50 (AA Body), sand-700 idle summary on sand-50 (AA Body). |
| **Brand fidelity** | Card surface treatment — sand-50 with primary-500 left accent (mirrors thread-approval-card's family register; clinical/urgent/warning swap surface + accent per family); whether the question card warrants its own accent register vs reusing approval-card's primary-500 (default: reuse — same hero class, same surface family); restraint check on primary-teal usage (thread-approval-card already uses primary; this card adds another primary-bordered hero — confirm density doesn't dilute the signal in busy threads); idle-state opacity 0.65 — read as "still here but quiet" without reading as disabled; bilingual copy review ("Submit answer" / "Enviar respuesta"; "Esc to cancel" / "Esc para cancelar"; "Question from Ava" / "Pregunta de Ava"; idle-state summary copy); Cena voice on default error message ("We couldn't send your answer. Try again, or close and we'll re-ask." — utilitarian + warm without over-apologizing). |

---

## PL Authoring Checklist

Before this spec feeds the build (dev-tasker handoff):

- [ ] **Prerequisite:** `option-row` PL fragment shipped + 4-expert-panel-approved per its companion spec
- [ ] 4-expert panel review complete on this primitive (all four verdicts ship or iterate-then-ship)
- [ ] `packages/design-system/pattern-library/components/thread-question-card.html` created with `@component-meta` header; includes Variant 1 (single-select desktop), Variant 2 (multi-select with pre-selection suggestion line), Variant 4 (mobile bottom-sheet), `.is-idle`, `.is-historical`, error-state, empty-state examples
- [ ] **Variant 3** (master-detail desktop) and **Variant 5** (mobile sequential) demonstrated in PL — these compose multiple primitives across pane boundaries; PL example may render as side-by-side sample or split-view demo
- [ ] New classes added to `packages/design-system/src/styles/tokens/components.css` per CSS definition above
- [ ] `packages/design-system/pattern-library/COMPONENT-INDEX.md` row for `thread-question-card` added under "Thread / Agent" category (alongside `thread-approval-card`)
- [ ] `pnpm --filter @haven/design-system dev` renders the variants at http://localhost:5173/pattern-library/components/thread-question-card.html
- [ ] `conform:contrast-pairs` passes: primary-500 left border on sand-50 surface (≥3:1 SC 1.4.11), sand-900 prompt on sand-50 (AA Body), sand-700 idle summary on sand-50 (AA Body), sand-700 description on sand-50 hover, all dark-mode pairs
- [ ] Reduced-motion verified: idle-state opacity transitions suppressed; state still applies
- [ ] Dark mode verified: all color properties in `.dark` block render at ≥ WCAG AA contrast
- [ ] Bilingual labels verified: "Submit answer" / "Enviar respuesta", "Submit answers" / "Enviar respuestas", "Esc to cancel" / "Esc para cancelar", "(Recommended)" / "(Recomendado)", "Other" / "Otro", error-state default copy
- [ ] Visual feel-test (deferred-to-PL-authoring items from wireframe):
  - Preview swap transition (instant vs subtle crossfade)
  - Per-option numbered keybinding hint visibility (always vs Cmd-hold vs never)
  - Recommendation callout + inline (Recommended) badge co-existence (redundant vs reinforcing)
  - Master-detail preview-pane primitive choice (info-panel + code-view per-instance vs unified `option-preview-pane`)
- [ ] `ui-react-porter` skill: port `<ThreadQuestionCard />` 1:1 from PL HTML; `registry.json` entry; variant-matrix Storybook stories (Variant 1, Variant 2, Variant 4, .is-idle, .is-historical, error-state, empty-state); subcomponents for header/body/footer slots
- [ ] `conform:manifest`, `conform:css-family`, `conform:brand-fonts`, `conform:wireframe-shell` all pass on patch
- [ ] `conform:visual` Storybook diffs baseline-locked (when CI bootstrap lands per Patch 8b)
- [ ] Consumer-app handoff doc written naming the cross-primitive items: pin-priority logic for `thread-panel` renderer + `agent_question` allowlist additions for each of 4 apps

---

## Build Sequencing Note

This primitive depends on `option-row` shipping first. Recommended sequence (matches component-map Phase 1):

1. **option-row PL fragment + CSS + COMPONENT-INDEX update** (Tier 1; companion spec)
2. **4-expert panel for option-row**
3. **thread-question-card PL fragment + CSS + COMPONENT-INDEX update** (this spec)
4. **4-expert panel for thread-question-card**
5. **`ui-react-porter` skill: `<OptionRow />` then `<ThreadQuestionCard />` ports** (mechanical 1:1; skip 4-expert panel — review happened at PL fragment level)
6. **First consumer-app slice** (Tier 2 composition; uses ported components)
7. **Cross-primitive scope items** ship in consuming-app slices, not in haven-ui's PL or React-port slices:
   - Pin-priority logic added to each app's `thread-panel` renderer (or shared renderer if/when extracted)
   - `agent_question` allowlist additions to `data-allowlist` config in coordinator, provider, patient, kitchen apps

Highest-risk Tier 2 element in this spec: master-detail Variant 3 layout — breaks the pane boundary across `panel-chat` + `panel-content`. Plan for one design-review iteration cycle after the initial PL fragment renders, with a real preview payload in hand to feel-test the deferred items.
