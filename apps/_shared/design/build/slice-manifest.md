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

## Round 2 expert verdict — option-row PL fragment (post-Round 1 iterations)

Panel re-dispatched 2026-05-11 after commit `289acad` landed Round 1 iterations. All four reviewers opus-tier, unprimed; each asked to verify Round 1 closure + surface anything new.

- **design-system-steward:** ship — Both Round 1 items closed (CSS comment scope wording + `.option-row-recommended` no-rule semantic-hook). Two micro-observations not blocking: dark-mode `.option-row-glyph` still carries sand-500 (pre-existing pattern, not regression — flag for future dark-mode sweep); response-option's sand-500 cascade flagged for future WCAG 1.4.11 re-measurement.
- **ux-design-lead:** ship — All four Round 1 items closed cleanly. Three advisory observations: pre-selected variant now annotated as "visually identical to user-toggled by design" (Round 2 polish); wrap-demo's second option is short-and-unrecommended (trivial, point made); 7-option PL exemplar deliberately NOT added (intentional — >6-options is a process gate via @component-meta note, not a sanctioned render pattern).
- **accessibility:** ship, WCAG pass — All four Round 1 items closed. WCAG 1.4.11 hover-border recomputed: sand-600 on sand-50 = 3.82:1 (Round 1 docs cited 4.28:1 — Round 2 polish corrects to 3.82:1; both pass 3.0:1 floor). Glyph border on white interior = 4.52:1 — affordance improvement for default state. One forward-pointer raised (consumer-side, deferred to thread-question-card spec): mounted `aria-checked="true"` is valid ARIA but invisible to SR users as "agent-suggested vs user-selected" — consumer should pair with visible "(Suggested)" label or `aria-live="polite"` on card mount.
- **brand-fidelity:** ship — Scorecard 9.5/10 (up from 8.5/10). All three actionable Round 1 items closed: `badge-info` confirmed cyan-family (materially distinct from teal commit-signal), `items-center` cleanly resolves baseline-hang, dead `@apply block` correctly removed. One advisory observation (low, non-blocking): sand-500 → sand-600 hover/glyph bump creates a slight visual-weight delta vs response-option (still at sand-500) — visual harmony question dissolves if/when response-option re-runs WCAG 1.4.11 against sand-50.

### Net verdict

**Round 2: ship.** All four reviewers ship; no iterate, no block. Task 01 closed.

Round 2 polish applied in same commit cycle (`[next sha]`):
- Doc-accuracy: components.css comments + spec line 74 corrected 4.28:1 → 3.82:1 (per a11y recomputation)
- Pre-selected variant annotation: `<p class="pl-variant-title">` and HTML comment now explicitly call out "visually identical to user-toggled by design" to prevent future delta-review from proposing collapse

### Forward-pointers + backlog (out of option-row scope)

- **Forward-pointer to `thread-question-card` spec (Task 02):** consumer-side SR announcement strategy for agent-pre-selected state — primitive provides valid `aria-checked` scaffolding; consumer must pair with visible "(Suggested)" label OR `aria-live="polite"` announcement on card mount. Sourced from Round 2 a11y verdict 2026-05-11.
- **Steward backlog:** response-option WCAG 1.4.11 re-measurement against sand-50 hover-fill — if it fails (likely), bump to sand-600 for visual harmony with option-row. Quarterly steward sweep. Sourced from Round 2 brand-fidelity + steward verdicts 2026-05-11.
- **Plan-readiness candidate extensions** (3 surfaced from this slice's retrospectives):
  1. State-specific contrast pair check — `conform:contrast-pairs` should compute against state-specific surfaces (hover-fill vs default surface), not just one (a11y Round 1)
  2. Open-question tracing — every spec line flagged as "open question" must trace to a resolved decision before authorizing build; otherwise the question ships into the artifact (brand Round 1 + ux-lead Round 1 convergence)
  3. Visual-identity-by-design variant annotation — for any variant intentionally visually identical to another, require explicit PL annotation so future delta-review doesn't propose collapse (ux-lead Round 2)
  4. Reviewer-recomputes contrast values — panel template should require recomputation from palette.css hex literals before accepting cited ratios as ground truth (a11y Round 2)

### Pre-build check retrospective (Round 2)

All ship — no iterate or block verdicts. No retro entries.

---

## Round 1 expert verdict — thread-question-card PL fragment (after Task 02 build, before Task 03)

(To be filled in after the 4-expert panel runs for thread-question-card.)

Task 02 build complete 2026-05-11. Plan-readiness: READY 9/9. Build subagent: 17/17, zero judgment calls. haven-pl-qa: PASS with 3 mechanical fixes applied during review (`file:`/`when-to-use:` meta fields; redundant `items-center` utility on 4 option-row-title spans; missing COMPONENT-REGISTRY rows). Commit `ecd8891` pushed to haven-ui main.

For visual review by Aaron before panel dispatch (surfaced by haven-pl-qa):
1. `.is-idle` opacity transition (0.65 → 1.0 on hover/focus) reads as "still here but quiet" vs disabled
2. `(Recommended)` badge co-existence with `ai-insight-callout` in Variant 1 — reinforcing vs redundant
3. Bottom-sheet sticky-footer pinning under iOS Safari address-bar collapse (Variant 4)
4. `.is-historical` muted treatment (sand-50 surface + sand-400 left border + 0.85 opacity) reads as "past, not actionable"

Panel dispatched 2026-05-11. Original opus dispatch hit quota; re-dispatched on sonnet (4 verdicts captured). Sonnet escalation flags from agents addressed inline — brand reviewer's sonnet pass covered the items steward + ux-lead flagged for opus depth.

- **design-system-steward:** iterate — three concrete issues: surface token divergence (`bg-surface-card` vs sibling's `bg-sand-50`); `.is-historical` opacity mismatch (0.85 vs sibling's 0.70); missing `aria-controls` on `.is-other` PL examples.
- **ux-design-lead:** iterate — three items in single follow-up pass: idle `aria-labelledby` resolves to summary not prompt (annotate as deliberate); idle avatar omission (single example = cargo-cult; annotate or add second variant); no `.is-other` row in Variant 2 multi-select (wireframe says present in every variant). Plus low-priority: deferred feel-tests (callout/badge co-existence, keybinding hint visibility) unresolved as explicit verdicts.
- **accessibility:** iterate, WCAG conditional — one hard fail: `sand-400` historical left-border on sand-50 = 1.93:1 (need ≥3:1; bump to sand-600 at 3.61:1). Plus: `aria-keyshortcuts="1"` ambiguity in Variant 2 multi-select with both rows pre-selected; missing `aria-controls` (convergent with steward); focus-trap consumer-side note missing from Variant 4 comment block.
- **brand-fidelity:** ship-with-iterate, 8.5/10 — feel test mostly yes. Surface token alias creates latent drift vs sibling (recommend explicit `bg-sand-50`); 3px vs 4px left border delta vs sibling (4px) — intentional tier signal or incidental?; suggestion line italic sand-600 may read as decorative metadata (consider sand-700); no Lora serif anywhere in card (wireframe-chosen body copy on prompt — defensible, but card carries no serif warmth vs sibling's Lora `h3`).

### Convergence — issues flagged by multiple reviewers

- **Missing `aria-controls` on `.is-other`** (steward + a11y) — both flagged. Resolved in iteration: 3 instances now carry `aria-controls="tqc-{variant}-other-textarea"` placeholder + inline HTML comment documenting consumer-side binding pattern.
- **Surface token divergence + opacity mismatch + border-width delta** (steward + brand) — all three are family-parity questions against thread-approval-card. Aaron's verdict 2026-05-11: align all three (explicit `bg-sand-50`, opacity 0.70, border 4px). Resolved in iteration.

### Iteration cycle applied (commit `[next sha]`)

13 items landed in one patch cycle per Aaron's verdict 2026-05-11:

1. WCAG 1.4.11: `.is-historical` border-left-color sand-400 → sand-600 (3.61:1 PASS)
2. Surface alignment: base `@apply bg-surface-card` → explicit `background-color: var(--color-sand-50)` (family parity)
3. `.is-historical` opacity 0.85 → 0.70 (family parity)
4. Left border 3px → 4px (family parity)
5. Suggestion line sand-600 → sand-700 (informational over decorative-metadata read)
6. `aria-controls` placeholder added on all 4 `.is-other` instances (Variants 1, 1-es, 2, 4) + HTML comment explaining the binding documents the consumer-side wiring
7. Variant 2 pre-selection reset to single option (keyshortcuts ambiguity resolved; digit-on-Submit semantics no longer conflate with per-option digit binding)
8. Variant 2 multi-select now includes `.is-other` row
9. Idle state HTML comments added: `aria-labelledby` → summary is deliberate; avatar omission is the optional form
10. Variant 4 focus-trap consumer-side note added to comment block
11. Feel-test verdicts recorded inline in `@component-meta notes`: (a) `ai-insight-callout` + `(Recommended)` badge are REINFORCING (callout = prose register; badge = inline anchor — different read-order layers); (b) per-option numbered keybinding hints NOT rendered in primitive PL (consumer-side per surface)
12. Lora absence: NOT addressed — wireframe explicitly chose body copy for prompt; deferred to a future feel-test if the card needs more serif warmth
13. Suggestion line visibility: addressed via #5 (sand-700 bump)

Spec (`thread-question-card.md`) updated to match: CSS Definition block + Accessibility Notes references.

### Pre-build check retrospective (Round 1)

- **steward (3 iterate items):** partially — surface-token-intent gap could be caught by a "spec must declare canonical surface token explicitly when paralleling a sibling primitive" check. Opacity + aria-controls are translation gaps from spec → PL.
- **a11y (1 fail + iterate items):** partially — the historical contrast pair was named in spec's PL Authoring Checklist (`conform:contrast-pairs`) but without expected ratio; the gate as-written would have caught the fail on first run. Candidate plan-readiness extension: contrast pairs in spec must declare expected ratios.
- **ux-lead (3 items):** partially — the idle-state `aria-labelledby` ambiguity is structural (annotated as deliberate post-Round 1); the missing `.is-other` in Variant 2 is a wireframe-vs-PL completeness check candidate (also surfaced in option-row Round 2 as a general plan-readiness extension).
- **brand (1 iterate item):** yes — spec was the build; the `bg-surface-card` alias was the only gap a spec-level "explicit surface declaration for paralleling primitives" check could have caught.

**Net signal for plan-readiness calibration:** the 3-item plan-readiness candidate extensions from option-row's slice (state-specific contrast pair check; open-question tracing; wireframe-vs-PL completeness) would have caught at least 5 of the 13 iterate items in this Round. The extensions are increasingly worth shipping; tracked in `~/.claude/plans/bmad-pilots-implementation.md` (pending — out of scope this slice).

---

## Round 2 expert verdict — thread-question-card PL fragment (after Round 1 iterations)

Panel re-dispatched 2026-05-11 on sonnet after Round 1 iterations landed (commit `062c142`). Asked each reviewer to verify Round 1 closure + surface anything new. Same opus quota constraint as Round 1.

- **design-system-steward:** ship — all 3 Round 1 items closed cleanly. One trivial drift: `.is-historical` `<p class="pl-description">` still read "sand-400 + 0.85" pre-iteration values; spec + CSS were correct; PL prose was the 3rd copy-point that lagged. Patched mid-cycle (commit pending). Plus 3 "non-issue confirmed" notes: `bg-surface-card` removal has no behavior delta; 1px+4px border composition is clean shorthand-then-longhand cascade; opacity + background-color cascade in `.is-historical` is structurally sound. Plan-readiness retro: candidate extension worth flagging — "diff PL `<p class='pl-description'>` prose against corresponding CSS values."
- **ux-design-lead:** ship — all 4 Round 1 items closed. One non-blocking advisory: suggestion line italic sand-700 on sand-50 lands at ~4.3:1 (clears AA Body but feels thin at Body/03 13px italic; italic strokes are narrower than roman → perceived weight lower than measured ratio). Worth adding suggestion-line/sand-50 pair to spec's `conform:contrast-pairs` checklist so it carries through to the React port. Plan-readiness retro: partially — "verify .is-other on all variants against wireframe" would have caught the V2 omission in Round 1.
- **accessibility:** ship, WCAG pass — all 4 Round 1 items closed. Contrast pairs (recomputed from palette.css hex): sand-600 on sand-50 = **3.79:1** PASS (1.4.11 ≥3:1; CSS comment cited 3.61:1; both clear); sand-700 on sand-50 = **5.74:1** PASS (AA Body ≥4.5:1). Variant 2 `.is-other` confirmed `role="checkbox"` (matches multi-select context). Plan-readiness retro: no extensions needed for the a11y plane.
- **brand-fidelity:** ship, scorecard **8.5 → 9.5/10**. Items 1 + 3 + 4 closed; item 2 (Lora) deferred per wireframe intent. Visual hierarchy and Stone surface palette both bumped to 2/2; Typography expression held at 1.5/2 pending future Lora feel-test. One consumer-side advisory: `.is-other` copy register ("Type a different answer") reads as clinical-workflow; in Kitchen meal-substitution context the consumer should override description via the `option-row-description` slot ("Add your own substitution"). Primitive stays generic. Plan-readiness retro: yes — all Round 1 items have explicit verdicts in `@component-meta`; CSS carries inline decision rationale; Lora deferral is named.

### Net verdict

**Round 2: 4/4 SHIP.** No iterate, no block. Task 02 thread-question-card closed.

Round 2 polish: one stale `<p class="pl-description">` string on `.is-historical` section corrected (sand-400/0.85 → sand-600/0.70) per Steward's mid-cycle observation.

### Convergence + carry-forward items (non-blocking)

- **Suggestion-line contrast pair** (ux-lead): add `sand-700 on sand-50` to spec's `conform:contrast-pairs` checklist so the React port carries the gate. Flag for spec update.
- **Kitchen `.is-other` copy override** (brand): when the Kitchen app composes Variant 2 multi-select, consider overriding the description text via the `option-row-description` slot for stronger domain context. Primitive remains generic.
- **PL prose drift** (steward retro): plan-readiness candidate extension — diff `<p class="pl-description">` against corresponding CSS values. Adds to the existing 4 plan-readiness extension candidates from option-row + 1 from thread-question-card Round 1 retros.

### Pre-build check retrospective (Round 2)

All ship — no iterate or block verdicts.

The Round 2 panel cycle on thread-question-card mirrored option-row's Round 1 → Round 2 trajectory:
- Round 1: 3 iterate + 1 ship-with-iterate verdicts
- Iteration cycle: 13 actionable items + 1 deferred (Lora) in one patch
- Round 2: 4/4 SHIP

Iteration efficiency stayed high — Round 1 items had clear mechanical fixes; Round 2 caught one stale PL prose string + surfaced low-priority advisories that don't block ship.

- **ux-design-lead:** [ship / iterate / block] — [one-line summary]
- **design-system-steward:** [ship / iterate / block] — [...]
- **accessibility:** [ship / iterate / block, WCAG pass/conditional/fail] — [...]
- **brand-fidelity:** [ship / iterate / block] — [...]

### Pre-build check retrospective (Round 2 — thread-question-card)

For each reviewer's `iterate` or `block` verdict, answer:
- **Would `plan-readiness` have caught this pre-build?** [yes / no / partially] — [one-line why]
