# Task 02: thread-question-card — PL fragment + CSS + COMPONENT-INDEX

## Scope
Pattern library + CSS

## Task class
deterministic

## Model tier
sonnet

## Context

`thread-question-card` is a Tier 2 novel composition primitive — a thread-embedded card paralleling `thread-approval-card`. It composes existing primitives (`option-row` from Task 01, `sticky-footer`, `ai-insight-callout`, `badge-pill`, `bottom-sheet-panel`, `thread-msg-response`, `thread-msg-system`, `alert-error`, `info-panel`, `data-empty-state`) into the agentic-question pattern's envelope.

This task copies the spec at `apps/_shared/design/new-components/thread-question-card.md` into:
1. A new PL HTML fragment with `@component-meta` header
2. New semantic classes in `components.css` (modifier classes only — most slots compose existing primitives)
3. A new row in `COMPONENT-INDEX.md`

The spec is the source of truth — copy from it, do not regenerate.

## Prerequisites

- **Task 01 complete** — `option-row` PL fragment shipped, classes in components.css, COMPONENT-INDEX row exists
- **4-expert panel for option-row complete** — ship verdict (or iterate-then-ship cleared) on Round 1 of slice-manifest.md
- Any iterate-then-ship feedback from option-row's panel resolved BEFORE this task starts (option-row's class set may have shifted; thread-question-card consumes those classes)

## Files to Read First

- `apps/_shared/design/new-components/thread-question-card.md` — full spec (HTML structure, CSS definition, variants, accessibility, dark-mode, pin-priority data attribute)
- `apps/_shared/design/new-components/option-row.md` — companion spec (this primitive composes option-row)
- `packages/design-system/pattern-library/components/thread-approval-card.html` — slot-pattern precedent for the envelope; copy slot semantics (NOT class names)
- `packages/design-system/pattern-library/components/option-row.html` — created in Task 01
- `packages/design-system/pattern-library/components/overlay-bottom-sheet.html` — Variant 4 mobile precedent
- `packages/design-system/src/styles/tokens/components.css` — find `.thread-approval-card` block (around line 9091) to anchor the new `.thread-question-card` block; place the new block immediately AFTER thread-approval-card so the two thread-message-class cards sit in the same neighborhood
- `packages/design-system/pattern-library/COMPONENT-INDEX.md` — find the **Thread / Agent** category; add the new row alongside `thread-approval-card`

## Instructions

### Step 1: Create the PL fragment

Create `packages/design-system/pattern-library/components/thread-question-card.html`. Header format:

```html
<!-- @component-meta
name: thread-question-card
category: thread-agent
classes:
  - thread-question-card
  - thread-question-card-header
  - thread-question-card-body
  - thread-question-card-prompt
  - thread-question-card-summary
  - thread-question-card-suggestion
  - thread-question-card.is-idle
  - thread-question-card.is-historical
preline: false (composes bottom-sheet-panel which uses data-hs-overlay in Variants 4+5)
notes: Tier 2 novel composition primitive for the agentic-question pattern. Parallels thread-approval-card. Composes option-row + sticky-footer + ai-insight-callout + badge-pill. Pin priority via data-pin-priority attribute (cross-primitive thread-renderer-policy concern).
-->
```

After the header, render seven exemplar instances inside the standard `<section class="pl-page">` wrapper:

1. **Variant 1 — Single-select desktop, base case** — full envelope: header chip + Ava avatar + prompt + recommendation callout + 3 option-rows (one with `(Recommended)` badge) + `.is-other` + sticky-footer with Submit (disabled state)
2. **Variant 2 — Multi-select with pre-selection suggestion line** — `<p class="thread-question-card-suggestion">Ava suggested these. Edit and submit when ready.</p>` above option-row-list; option-rows are `role="checkbox"`; Submit shows enabled state with cmd-palette-shortcut "1"
3. **Variant 4 — Mobile bottom-sheet** — composes `bottom-sheet-panel` + `bottom-sheet-handle` + `bottom-sheet-header` (with `badge-pill` + `btn-icon` close) + `bottom-sheet-body` (prompt + option-row-list) + sticky-footer pinned to `bottom-sheet-panel` ROOT (sibling of body, NOT inside body's scroll context)
4. **`.is-idle` state** — `<section class="thread-question-card is-idle">` with header chip + body collapsed to `.thread-question-card-summary` ("Question from Ava: Match referral") + footer hidden or muted
5. **`.is-historical` state** — read-only treatment with `aria-disabled` on option-rows + Submit removed; selected state preserved
6. **Error-state** — Variant 1 with inline `.alert-error` above option-row-list ("We couldn't send your answer. Try again, or close and we'll re-ask."); Submit returns to enabled
7. **Empty-state (defensive)** — `<section class="thread-question-card">` with `.empty-state` + `.empty-state-icon` (`fa-circle-question`) + heading "Question loaded without options" + body "Something's off on our side. Try refreshing, or message us if it stays stuck."

Include data attributes:
- `data-pin-priority="2"` on in-flight cards (Variants 1, 2, 4, error-state, empty-state)
- `data-pin-priority="4"` on `.is-historical` example
- `aria-labelledby` on the `<section>` referencing the prompt body's `id` (also referenced by option-row-list's `aria-labelledby`)

Bilingual demo: include at least one Variant 1 instance with Spanish copy:
- Submit label: "Enviar respuesta"
- Cancel hint: "Esc para cancelar"
- Error default: "No pudimos enviar tu respuesta. Inténtalo otra vez, o ciérrala y te volveremos a preguntar."

Copy HTML structure verbatim from the spec's "HTML Structure" section. Do not paraphrase.

### Step 2: Add semantic classes to components.css

Open `packages/design-system/src/styles/tokens/components.css`. Find the `.thread-approval-card` block (around line 9091). Insert the new `.thread-question-card` block immediately AFTER the entire thread-approval-card class set (after the last `.thread-approval-note` rule and any thread-approval-* dark-mode rules).

Add the full CSS block exactly as specified in `thread-question-card.md` § "CSS Definition (`components.css` additions)". This includes:

- Comment header naming the spec source + Tier + pin priority
- `.thread-question-card` base + custom property `--thread-question-card-idle-opacity`
- `.thread-question-card-header`
- `.thread-question-card-body`
- `.thread-question-card-prompt`
- `.thread-question-card-suggestion` (Body/03 italic muted)
- `.thread-question-card.is-idle` + `:hover` / `:focus-within` re-expansion + reduced-motion suppression
- `.thread-question-card-summary`
- `.thread-question-card.is-historical` + descendant rule muting `.option-row` (cursor:default + pointer-events:none + neutralized hover)
- Dark-mode block redeclaring all color properties

Copy CSS verbatim from the spec — do not paraphrase or "improve" `@apply` chains.

### Step 3: Add COMPONENT-INDEX row

Open `packages/design-system/pattern-library/COMPONENT-INDEX.md`. Find the **Thread / Agent** category (currently includes `thread-msg-system`, `thread-msg-tool-call`, `thread-msg-human`, `thread-msg-response`, `thread-approval-card`). Add the new row alongside `thread-approval-card`:

```markdown
| Thread Question Card | `thread-question-card.html` | `thread-question-card`, `thread-question-card-header`, `thread-question-card-body`, `thread-question-card-prompt`, `thread-question-card-summary`, `thread-question-card-suggestion`, `thread-question-card.is-idle`, `thread-question-card.is-historical` | no | Tier 2 composition primitive for the agentic-question pattern. Parallels thread-approval-card. Composes option-row + sticky-footer + ai-insight-callout + badge-pill. `.is-idle` (90s collapse), `.is-historical` (read-only) modifiers. Pin priority via `data-pin-priority` (in-flight: 2; historical: 4). Cross-primitive thread-renderer logic enforces order against thread-approval-card. Mobile composes `bottom-sheet-panel`. |
```

Update the `_Last updated:` line at the bottom of the file to today's date.

### Step 4: Verify the fragment renders

Run `pnpm --filter @haven/design-system dev` and visit http://localhost:5173. Navigate to the thread-question-card PL page. Confirm:

- All 7 exemplar instances render
- Variant 1 desktop renders with primary-500 left accent + sand-50 surface (matches thread-approval-card family)
- Variant 2 multi-select shows checkbox glyphs (rounded-square) on option-rows, not radio circles
- Variant 4 mobile bottom-sheet pins sticky-footer at the bottom, NOT inside the scrollable body region
- `.is-idle` example shows reduced opacity (~0.65) + collapsed one-line summary; hovering re-expands to opacity 1
- `.is-historical` example shows muted treatment (sand-50 surface + sand-400 left border + 0.85 opacity)
- Error-state shows `.alert-error` above the option-row-list with the option selection still visible
- Empty-state shows `.empty-state` with `fa-circle-question` icon
- Dark mode renders all colors with adequate contrast

## Known Constraints

- **No utility soup.** All thread-question-card styling lives in semantic classes inside `components.css`. The PL HTML uses semantic classes — never raw Tailwind utilities for styling.
- **No inline `<style>` blocks** in the PL HTML.
- **Dark mode is mandatory.** Every color property in the new component class must have a `.dark` counterpart per the dark-mode block in the spec.
- **Cross-primitive scope is OUT.** Do NOT modify `thread-panel`'s renderer for pin-priority logic. Do NOT add `agent_question` to any consuming app's allowlist. Those ship in consuming-app slices (per slice-manifest "Deferred").
- **Active rule from `.project-docs/decisions-log.md`:** when adding a new component nested inside another, check the parent's border radius and use one step smaller. Verify: thread-question-card uses `rounded-[8px]`; option-row inside uses `rounded-[5px]`. ✓ Already smaller.

## Anti-patterns

- Do NOT regenerate the option-row HTML inside thread-question-card examples. Compose from the existing PL primitive (Task 01 ships option-row.html; this task references its classes).
- Do NOT introduce a new `.option-row-list` class — it ships with Task 01 as part of the option-row primitive.
- Do NOT add `.is-question-class` to `.badge-pill`. The wireframe explicitly defers this promotion until a second consumer emerges. Use inline `.badge-pill` in the PL examples.
- Do NOT add new variants to `thread-msg-response`. The Submitted-state composes existing `thread-msg-response`; if the answer-summary shape diverges meaningfully from approval-summary, the steward will call for an `.is-question-answer` variant — but not in this task.
- Do NOT modify the `thread-approval-card` class set or HTML. The two cards parallel each other but are independent primitives.
- Do NOT pin sticky-footer inside the bottom-sheet body's scroll context. Per the wireframe (Variant 4 spec, resolved 2026-05-08): pin to `bottom-sheet-panel` ROOT (sibling of body) to avoid iOS Safari address-bar collision.

## Expected Result

After this task:
- `packages/design-system/pattern-library/components/thread-question-card.html` exists with `@component-meta` header + 7 exemplar instances rendered
- `packages/design-system/src/styles/tokens/components.css` contains the new `.thread-question-card` class set + dark-mode block, placed immediately after thread-approval-card
- `packages/design-system/pattern-library/COMPONENT-INDEX.md` has a new row for `thread-question-card` in the **Thread / Agent** category
- The PL page renders at http://localhost:5173 without console errors
- All variants visually distinct + accessible
- No changes to `thread-approval-card` or `option-row` — they ship unchanged

## Verification

- [ ] `thread-question-card.html` exists with `@component-meta` header
- [ ] All semantic classes from the spec exist in `components.css` (grep: `^\.thread-question-card` returns 8+ matches)
- [ ] `--thread-question-card-idle-opacity` custom property is defined
- [ ] Dark-mode block redeclares every color property used in the light-mode block
- [ ] `COMPONENT-INDEX.md` has the new row in the Thread / Agent category
- [ ] PL page renders at http://localhost:5173 without errors
- [ ] HTML classes in `thread-question-card.html` are semantic — no utility chains for styling
- [ ] No inline `<style>` blocks in `thread-question-card.html`
- [ ] `data-pin-priority` attribute present on all in-flight (`"2"`) and historical (`"4"`) examples
- [ ] `aria-labelledby` correctly chained: section → prompt body's id; option-row-list → same prompt body's id
- [ ] Variant 4 sticky-footer is a sibling of `bottom-sheet-body`, NOT inside it
- [ ] Variant 2 option-rows use `role="checkbox"` (not `role="radio"`, not `aria-pressed`)
- [ ] `prefers-reduced-motion: reduce` block present for `.is-idle` opacity transition
- [ ] `pnpm --filter @haven/design-system dev` runs cleanly
- [ ] `_Last updated:` line in `COMPONENT-INDEX.md` updated to today's date
- [ ] `packages/design-system/src/data/_schema-notes.md` updated if any dummy data deviates from Firebase schema (yes / no / **not applicable**)
- [ ] No changes to `.thread-approval-card`, `.option-row`, or any other existing primitive

## Completion Report

After all verification passes and before running the git commit, output this report:

```
## Completion Report — Task 02: thread-question-card PL fragment

- New semantic classes added to components.css: .thread-question-card, .thread-question-card-header, .thread-question-card-body, .thread-question-card-prompt, .thread-question-card-summary, .thread-question-card-suggestion, .thread-question-card.is-idle, .thread-question-card.is-historical (8 classes + 1 custom property + dark-mode block)
- Existing classes modified: none
- Pattern library files created or updated:
  - packages/design-system/pattern-library/components/thread-question-card.html (new)
  - packages/design-system/pattern-library/COMPONENT-INDEX.md (new row in Thread / Agent)
- Judgment calls (anything not explicitly specified in the prompt): none
- Dark mode added: yes
- Schema delta logged: not applicable
- Items deferred or incomplete: none
```

**Deterministic task — "Judgment calls" must be `none`.** If the report shows any judgment call, the task was misclassified — STOP, do not commit, and route back to the thread-question-card spec for the missing detail.

## Commit scope

Stage explicitly:
```
git -C /Users/aaronsleeper/Vaults/Lab/haven-ui add \
  packages/design-system/pattern-library/components/thread-question-card.html \
  packages/design-system/src/styles/tokens/components.css \
  packages/design-system/pattern-library/COMPONENT-INDEX.md
```

Pre-existing dirty files remain unstaged.

Commit message format:
```
feat(haven-pl): thread-question-card Tier 2 primitive — PL fragment + CSS + index

Tier 2 composition primitive for the agentic-question pattern. Parallels
thread-approval-card. Composes option-row + sticky-footer + ai-insight-callout
+ badge-pill. .is-idle (90s collapse) and .is-historical (read-only) modifiers.
Pin-priority via data-pin-priority (2: in-flight, 4: historical) — cross-
primitive thread-renderer logic deferred to consuming-app slices.
Spec: apps/_shared/design/new-components/thread-question-card.md
```

## Next step

After verification + commit:
1. Update `apps/_shared/design/build/slice-manifest.md` Round 2 section as the 4-expert panel runs
2. Resolve any iterate-then-ship feedback from the panel
3. Then proceed to Task 03 (`03-option-row-react-port.md`) — option-row React port via ui-react-porter

## If Something Goes Wrong

- **Variant 4 bottom-sheet sticky-footer is rendering inside the scroll region:** confirm the DOM structure is `bottom-sheet-panel > [handle, header, body, sticky-footer]` (footer as a sibling of body), NOT `bottom-sheet-panel > [handle, header, body > sticky-footer]`.
- **`.is-idle` opacity not changing on hover:** the `:hover` rule must use `&:hover, &:focus-within { opacity: 1; }` — both selectors are needed for keyboard-driven re-expansion.
- **`.is-historical` option-rows still show hover state:** confirm the descendant rule `.thread-question-card.is-historical .option-row:hover { background-color: inherit; border-color: inherit; }` is present; it neutralizes the inherited hover.
- **`data-pin-priority` not consumed anywhere:** correct — this slice does NOT wire pin-priority logic. The attribute exists on the primitive; consuming apps' `thread-panel` renderers will read it in their own slices. (See slice-manifest "Deferred".)
