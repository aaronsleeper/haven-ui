# Slice Manifest — agentic-question-primitives: Agentic Question Pattern (PL + React port)

**Target app:** `apps/_shared` (multi-app primitive — Care Coordinator, Provider, Kitchen, Patient consume in their own slices)
**Primary wireframe(s):**
- `apps/_shared/design/wireframes/agentic-question.md`
- `apps/_shared/design/wireframes/agentic-question-brief.md`
**Component map:** `apps/_shared/design/component-map-agentic-question.md`
**Per-component specs:**
- `apps/_shared/design/new-components/option-row.md`
- `apps/_shared/design/new-components/thread-question-card.md`
**Commit:** [sha after Phase-2 completion]

---

## In scope (ships in this slice)

### Pattern library

- `option-row` PL fragment — new — `packages/design-system/pattern-library/components/option-row.html`
  - Single-select (`role="radio"`) and multi-select (`role="checkbox"`) variants
  - With-recommendation example (inline `(Recommended)` `.badge.badge-sm`)
  - `.is-other` collapsed and expanded examples (reveal-on-select textarea)
  - Disabled example
  - `.is-tablet-dense` modifier example (kitchen gloved-hand context)
- `option-row` semantic classes added to `packages/design-system/src/styles/tokens/components.css`:
  - `.option-row`, `.option-row-glyph`, `.option-row-content`, `.option-row-title`, `.option-row-recommended`, `.option-row-description`, `.option-row-check`, `.option-row.is-other`, `.option-row-other-wrapper`, `.option-row-other-textarea`, `.option-row.is-tablet-dense`, `.option-row-list`
  - Custom property: `--option-row-min-height`
  - Dark-mode block redeclaring all color properties
- `thread-question-card` PL fragment — new — `packages/design-system/pattern-library/components/thread-question-card.html`
  - Variant 1 (single-select desktop, base case)
  - Variant 2 (multi-select with optional pre-selection suggestion line)
  - Variant 4 (mobile bottom-sheet)
  - `.is-idle` state example (90s collapse to one-line summary)
  - `.is-historical` state example (read-only thread-history)
  - Error-state example (Submit failed)
  - Empty-state example (defensive zero-options)
  - Submitted-state composition (existing `thread-msg-response`; no new variant)
  - Cancelled-state composition (existing `thread-msg-system`)
- `thread-question-card` semantic classes added to `components.css`:
  - `.thread-question-card`, `.thread-question-card-header`, `.thread-question-card-body`, `.thread-question-card-prompt`, `.thread-question-card-summary`, `.thread-question-card-suggestion`, `.thread-question-card.is-idle`, `.thread-question-card.is-historical`
  - Custom property: `--thread-question-card-idle-opacity`
  - Dark-mode block redeclaring all color properties
- `pattern-library/COMPONENT-INDEX.md` updated:
  - Row for `option-row` added under "Forms" or "Thread / Agent" category (steward call at PL authoring)
  - Row for `thread-question-card` added under "Thread / Agent" category alongside `thread-approval-card`

### React port (`packages/ui-react/`)

- `<OptionRow />` 1:1 port — new — `packages/ui-react/src/components/OptionRow.tsx`
- `<ThreadQuestionCard />` 1:1 port — new — `packages/ui-react/src/components/ThreadQuestionCard.tsx`
- `packages/ui-react/src/index.ts` barrel exports both
- `packages/ui-react/registry.json` entries for both components (PL source path + Storybook stories array)
- Storybook variant-matrix stories:
  - `OptionRow.stories.tsx` — single-select, multi-select, with-recommendation, is-other-collapsed, is-other-expanded, is-tablet-dense, disabled (7 stories)
  - `ThreadQuestionCard.stories.tsx` — Variant 1, Variant 2, Variant 4, .is-idle, .is-historical, error-state, empty-state (7 stories)

### Documentation

- Slice-manifest (this file)
- task-list.md
- 5 numbered task prompt files (01–05)

---

## Deferred (explicitly not in this slice, tracked for later)

Walked the wireframe section-by-section. Every wireframe element NOT in scope appears below with a reason.

### Wireframe variants deferred

- **Variant 3 — Single-select master-detail preview (DESKTOP)** — defers PL-fragment authoring of the layout-engagement break across `panel-chat + panel-content`; the wireframe explicitly defers four feel-test items (preview-swap transition, per-option keybinding hint, recommendation co-existence, preview-pane primitive choice) to PL fragment authoring with a real preview payload in hand. Reason: PL primitive ships first; layout-engagement experiments run with real payloads in the consuming-app slice (likely provider `pv-01`). Tracked as: provider-slice TBD.
- **Variant 5 — Mobile master-detail (sequential bottom-sheets)** — same reason as Variant 3; the bottom-sheet sequencing requires consumer-side state for sheet-stack management. Reason: deferred to mobile-app slice (likely patient-meal-window or similar) where real preview payloads are available. Tracked as: patient-slice or provider-mobile-slice TBD.

### Cross-primitive scope (per haven-mapper component-map)

- **Pin-priority logic in `thread-panel` renderer** — primitive emits `data-pin-priority="2"` (in-flight) / `data-pin-priority="4"` (historical); consuming-app `thread-panel` renderer reads and applies the priority. Reason: thread-renderer-policy concern, NOT primitive work. Pin order locked: `thread-approval-card.is-urgent > thread-question-card (in-flight) > thread-approval-card (default) > thread-question-card.is-historical`. Tracked as: each consuming-app's first thread-question-card slice.
- **`agent_question` allowlist additions** — 4 consuming apps' `panel-content` thread renderers each need `agent_question` added to `data-allowlist`. Reason: app-architecture work, NOT haven-ui primitive concern. Tracked as: per-app slice (coordinator, provider, patient, kitchen).

### Wireframe items intentionally not promoted to classes

The wireframe flagged these as "steward call" or "promote to modifier only if a second consumer emerges" — explicitly deferred to per-instance composition rather than class promotion:

- `badge-pill.is-question-class` — per-instance `.badge-pill` usage in this slice; promotion deferred to second consumer
- `kbd-shortcut-hint` — per-instance `.cmd-palette-shortcut` typography reuse; promotion deferred to second consumer
- `thread-msg-response.is-question-answer` — composes existing `.thread-msg-response`; no variant unless answer-summary shape diverges (steward call at PL authoring)
- Pre-selection suggestion line — per-instance `Body/03 italic` copy in this slice; promote to `.thread-question-card-suggestion` only if a third surface needs the same line *(authored as an optional class in this slice for ergonomic re-use; see thread-question-card.md CSS section)*
- `option-preview-empty`, `option-preview-error`, `thread-question-empty` — per-instance compositions of existing `.empty-state` / `.alert-error` / `.info-panel`; no new classes

### Accessibility items deferred to consumer-app integration

- **Roving tabindex behavior** — primitive supports `tabindex="0|−1"` per option-row; the actual roving logic is consumer-side state (React refs + keyDown handler). Reason: tied to consumer-app component composition. Tracked as: each consuming-app's first slice; may extract to a shared hook in `packages/ui-react/src/hooks/` if 2+ consumers share the same pattern.
- **`aria-keyshortcuts` digit assignment** — primitive supports the attribute; consumer assigns the digit per-instance based on recommended/first-option position. Reason: consumer-side state.
- **Stray-Enter guard** — multi-select pre-selection guard is consumer-side state. Reason: depends on consumer's selection-state-tracking.
- **Focus-trap inside bottom-sheet** — `bottom-sheet-panel` (existing primitive) handles this via Preline's `data-hs-overlay` integration; no new work in this slice.
- **Sheet-stack focus return (Variant 5)** — consumer-side state; deferred to first mobile master-detail consumer.
- **Idle-state 90s timer** — consumer-side `setTimeout` + activity-listener; primitive provides `.is-idle` class only. Reason: timer policy varies (some consumers may want 60s, some 120s, some never). Tracked as: each consuming app's thread-renderer config.

### Interactions deferred

- **`data-preview-source="selection|keyboard|hover"` consumer logic** — primitive supports the data attribute; consumer-app implements precedence (selection > keyboard-focus > hover) + 300ms hover cooldown. Reason: consumer-side state. Tracked as: first master-detail consumer.
- **Submit double-tap protection** — primitive composes existing `.btn-loading` + `disabled` simultaneously; consumer-side wires the state transitions. Reason: pattern is established (existing `btn-loading.html`); consumer applies.
- **Submit error retry** — consumer-side wiring of error → enabled-Submit cycle. Reason: consumer-side state.

### Bilingual labels deferred

- All Spanish copy in the wireframe Bilingual Considerations section is verified at PL authoring time as visual labels in the PL-fragment example HTML; the React-port stories include both language demos. Reason: spec is bilingual; PL HTML demonstrates both. **In scope** for PL fragment HTML — labels are baked into the example.

### Future ports

- **Angular port** — when/if Cena's Angular apps consume haven-ui (per current stack reality, this is not yet decided per `Lab/haven-ui/CLAUDE.md`). Reason: pattern library is framework-agnostic; React is the only port today. Tracked as: cross-cutting Angular-port roadmap.

---

## Workflow gates applied

- ui-react-porter preconditions met for every ported component:
  - [ ] PL fragment exists with `@component-meta` header (Tasks 01, 02)
  - [ ] Semantic classes in `components.css` (Tasks 01, 02)
  - [ ] COMPONENT-INDEX row exists (Tasks 01, 02)
  - [ ] 4-expert panel approved (between Tasks 02 and 03)
- app-composer utility-soup rejection clean: N/A — this slice does NOT touch `apps/*` consumer code
- Post-slice expert review dispatched (Round 1: option-row PL; Round 2: thread-question-card PL): pending

---

## Known gaps at slice-end

(To be filled in after task execution.)

- _placeholder_

---

## Round 1 expert verdict — option-row PL fragment (after Task 01)

Panel dispatched 2026-05-11; all four reviewers opus-tier, unprimed prompts per bias-control protocol.

- **design-system-steward:** ship (with one cosmetic iterate) — Spec executed faithfully; class vocabulary, variant-modifier discipline, `--option-row-min-height` shape, and `@apply` cleanliness all hold; one minor scope-drift on `.option-row-list` CSS comment vs spec wording.
- **ux-design-lead:** iterate — Scan order and dual-cue logic sound; four IA-level fixes needed: `(Recommended)` badge wrap collision, missing >6-options threshold signal, `.option-row-recommended` no-op class without tone documentation, missing agent-pre-selected multi-select variant.
- **accessibility:** iterate, WCAG conditional — ARIA semantics + focus-visible + triple-cue + reduced-motion + 7/8 contrast pairs correct, but `sand-500` hover-border on `sand-50` hover-fill computes 2.81:1 (under WCAG 1.4.11 3:1 floor); spec line 239 + CSS comment line 10530 cite incorrect 3.42:1 against wrong background.
- **brand-fidelity:** iterate, 8.5/10 — Chassis unmistakably Haven; `(Recommended)` badge ships colorless (no `badge-info`/etc. variant); title `items-baseline` will misalign badge against text baseline; dead `@apply block` on `.option-row-recommended` is cleanup-class; Spanish `.is-other` register flagged for patient-surface contextual review.

### Convergence — issues flagged by multiple reviewers

- `(Recommended)` badge slot is unresolved at three levels: brand-fidelity (colorless = unstyled render), ux-design-lead (no-op class needs tone documentation), brand-fidelity again (dead `@apply block`). Spec § 4-Expert Panel Scope line 535 flagged the badge tone as an open question; Task 01 shipped the open question *into* the artifact.
- `.option-row-title` flex alignment (ux-design-lead wrap collision + brand-fidelity baseline misalignment) — both observable visual issues stem from `items-baseline` on a small-uppercase-pill-against-semibold-body-text composition.

### Net verdict

**Round 1: iterate** — Three iterate + one ship-with-iterate. Must-fix before Round 2 or ship sign-off:

1. **WCAG 1.4.11 fail** (a11y) — bump `.option-row:hover` border from `sand-500` to a stop that clears 3.0:1 against `sand-50` hover-fill; correct comments + spec
2. **Colorless badge** (brand) — apply a color variant to `(Recommended)`; recommended `badge-info` (preserves teal as commit-signal token)
3. **Title alignment** (brand + ux-lead) — `items-baseline` → `items-center` or `self-center` on `.option-row-recommended`

Iterate-then-ship (apply in same patch cycle):
4. **Pre-selected multi-select variant** (ux-lead) — add 10th PL example
5. **Long-title wrap example** (ux-lead) — demonstrate badge stays adjacent
6. **`@component-meta notes` additions:** >6 options trigger steward review (ux-lead); consumer must `preventDefault()` Space on `role="radio"` button (a11y); consumer must focus-trap bottom-sheet (a11y)
7. **`.option-row-list` CSS comment scope** (steward) — update wording to match spec

Deferred (not blocking; tracked separately):
- Spanish `.is-other` description register (brand) — revisit at Variant 4 mobile patient-surface authoring
- `.option-row-recommended` tone variant taxonomy beyond `badge-info` — defer to consumer surface emergence per "promote on second use" rule

### Pre-build check retrospective (Round 1)

For each iterate verdict, would `plan-readiness` have caught this pre-build?

- **steward cosmetic iterate** (CSS comment scope drift): **partially** — a check diffing spec class-table notes against `@component-meta` headers and CSS comment blocks would surface wording leaks. Candidate plan-readiness extension.
- **ux-lead badge wrap collision**: **no** — needs rendered evaluation against real copy + bilingual Spanish (visual feel-test).
- **ux-lead >6-options threshold signal**: **no** — IA judgment about primitive-level signaling; not a structural completeness check.
- **ux-lead `.option-row-recommended` tone documentation**: **yes** — the spec flagged badge tone as an open question; a pre-build check tracing open questions to resolved spec lines would have surfaced this.
- **ux-lead missing pre-selected multi-select variant**: **yes** — wireframe Variant 2 explicitly establishes pre-selection as first-class; a PL-completeness check against "every wireframe-specified state has at least one PL variant" would catch.
- **a11y WCAG 1.4.11 hover-border fail**: **partially** — `conform:contrast-pairs` would catch IF the gate computes against state-specific surface backgrounds (hover-fill vs default surface). Drift here is that spec line 239 named the right pair conceptually but the comment-claimed value substituted the wrong background. Candidate gate extension.
- **a11y consumer-guidance notes** (preventDefault on Space; focus-trap on bottom-sheet): **no** — post-build documentation polish.
- **brand colorless badge**: **yes** — spec § 4-Expert Panel Scope line 535 explicitly flagged badge tone as an open question; build shipped the question into the artifact. Same plan-readiness extension as ux-lead's tone-documentation item.
- **brand title `items-baseline` baseline misalignment**: **no** — visual-render-only; caught by eye in live PL page.
- **brand Spanish `.is-other` register**: **no** — voice/feel evaluation; inherently post-build.
- **brand dead `@apply block`**: **partially** — a check that traces every `@apply block` (the tree-shake guard) against subsequent rules that would override `display:` would catch. Niche check; low priority.

**Net signal for plan-readiness calibration:** 3 of 11 iterate items would have been caught by current check shape; 4 of 11 would be caught by candidate extensions (open-Q tracing, wireframe-vs-PL completeness, state-specific contrast pairs, comment-vs-spec wording diff). 4 of 11 are inherently post-build (visual feel-test, IA judgment, voice register, documentation polish).

---

## Round 2 expert verdict — thread-question-card PL fragment (after Task 02)

(To be filled in after the 4-expert panel runs.)

- **ux-design-lead:** [ship / iterate / block] — [one-line summary]
- **design-system-steward:** [ship / iterate / block] — [...]
- **accessibility:** [ship / iterate / block, WCAG pass/conditional/fail] — [...]
- **brand-fidelity:** [ship / iterate / block] — [...]

### Pre-build check retrospective (Round 2)

For each reviewer's `iterate` or `block` verdict, answer:
- **Would `plan-readiness` have caught this pre-build?** [yes / no / partially] — [one-line why]
