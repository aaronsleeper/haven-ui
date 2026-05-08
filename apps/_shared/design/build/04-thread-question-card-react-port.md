# Task 04: `<ThreadQuestionCard />` — React port via ui-react-porter

## Scope
React port (`packages/ui-react/`)

## Task class
deterministic

## Model tier
sonnet

## Context

`<ThreadQuestionCard />` is the React port of the `thread-question-card` PL fragment shipped in Task 02. Mechanical 1:1 mirror of the PL HTML — same class names, same DOM structure, same ARIA. The component composes `<OptionRow />` (from Task 03) inside an `option-row-list` slot.

Per haven-ui's "copy, don't generate" rule, the React port mirrors the PL HTML exactly. The component exposes typed props for variants, states, and content; it does NOT manage selection state, idle timer, focus trap, or pin-priority logic — all consumer-side.

This task uses the `ui-react-porter` skill at `.project-docs/agent-workflow/skills/ui-react-porter.md`.

## Prerequisites

- **Task 02 complete + 4-expert panel approved** — thread-question-card PL fragment shipped, classes in components.css, COMPONENT-INDEX row exists, panel verdict is ship (or iterate-then-ship cleared)
- **Task 03 complete** — `<OptionRow />` is exported and importable
- Round 2 of `slice-manifest.md` updated with the panel verdict

## Files to Read First

- `.project-docs/agent-workflow/skills/ui-react-porter.md` — owning skill
- `packages/design-system/pattern-library/components/thread-question-card.html` — source of truth (Task 02 output)
- `apps/_shared/design/new-components/thread-question-card.md` — companion spec (typed props guide)
- `packages/ui-react/src/components/OptionRow.tsx` — Task 03 output; this component composes it
- `packages/ui-react/src/components/ThreadApprovalCard.tsx` (if exists) — closest precedent for thread-message-class card port; informs slot-component decomposition
- `packages/ui-react/registry.json` — find OptionRow entry from Task 03 for adjacency

## Instructions

### Step 1: Run ui-react-porter for `<ThreadQuestionCard />`

Per `.project-docs/agent-workflow/skills/ui-react-porter.md`, port the thread-question-card PL HTML to a React component at `packages/ui-react/src/components/ThreadQuestionCard.tsx`. The port:

- Reads `packages/design-system/pattern-library/components/thread-question-card.html` AS-IS
- Uses identical class names (`thread-question-card`, `thread-question-card-header`, etc.)
- Preserves ARIA attributes verbatim (`role="region"`, `aria-labelledby`)
- Preserves `data-pin-priority` attribute
- Composes `<OptionRow />` from Task 03 inside the `option-row-list` slot

### Step 2: Define typed props

```typescript
type ThreadQuestionCardVariant = 'desktop-inline' | 'desktop-master-detail' | 'mobile-bottom-sheet' | 'mobile-master-detail';

type ThreadQuestionCardState = 'in-flight' | 'idle' | 'historical' | 'submitted' | 'cancelled' | 'error' | 'empty';

interface ThreadQuestionCardOption {
  id: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  recommended?: boolean;
  preview?: React.ReactNode; // for master-detail variants; consumer renders into the detail pane
  disabled?: boolean;
}

interface ThreadQuestionCardProps {
  questionId: string;
  questionClass: string; // header chip label
  prompt: React.ReactNode;
  recommendation?: React.ReactNode; // ai-insight-callout body
  agentIdentity?: { avatarSrc: string; alt: string }; // optional Ava identity badge
  selectionMode: 'single' | 'multi';
  options: ThreadQuestionCardOption[];
  allowOther?: boolean; // appends .is-other option-row at end
  selectedIds: string[];
  focusedId?: string; // for roving tabindex; caller-managed
  state?: ThreadQuestionCardState;
  variant?: ThreadQuestionCardVariant;
  pinPriority?: 2 | 4; // data-pin-priority value; default 2 for in-flight, 4 for historical
  errorMessage?: React.ReactNode; // shown in 'error' state
  preSelectionSuggestion?: React.ReactNode; // multi-select agent-pre-selection line
  submitLabel?: string; // default "Submit answer" (single) / "Submit answers" (multi)
  cancelHintLabel?: string; // default "Esc to cancel"; pass empty string or undefined to hide
  keyboardShortcutDigit?: number; // 1–9; default 1
  submitDisabled?: boolean;
  submitting?: boolean; // adds .btn-loading + .btn-spinner; disables Submit
  otherTextareaValue?: string;
  // Callbacks — all consumer-side state
  onOptionSelect: (id: string, nextChecked: boolean) => void;
  onOtherTextareaChange?: (value: string) => void;
  onSubmit: () => void;
  onCancel?: () => void;
}
```

(Adjust to match `ui-react-porter` skill conventions and existing TypeScript ports.)

### Step 3: Render slots

Render the `<section class="thread-question-card">` root with:

- Conditional class: `is-idle`, `is-historical` based on `state` prop
- `data-pin-priority` from `pinPriority` prop
- `aria-labelledby` referencing the prompt body's `id` (auto-generated from `questionId`: `thread-question-card-prompt-${questionId}`)

Slots inside:

1. **Header** — `<div class="thread-question-card-header">` with `<span class="badge-pill">{questionClass}</span>` + optional `<img class="avatar avatar-xs">`
2. **Body** — `<div class="thread-question-card-body">`:
   - In `idle` state: render `<p class="thread-question-card-summary">Question from Ava: {questionClass}</p>` (i18n via `summary` prop if needed; default English)
   - Otherwise: `<p class="thread-question-card-prompt" id="thread-question-card-prompt-{questionId}">{prompt}</p>` + optional `<div class="ai-insight-callout">` + optional `<p class="thread-question-card-suggestion">` + `<div class="option-row-list" role="...">` mapping `options` to `<OptionRow />` instances; append `.is-other` `<OptionRow variant="is-other">` if `allowOther`
   - In `error` state: prepend `<div class="alert-error">` with `errorMessage` above the option-row-list
   - In `empty` state: render `<div class="empty-state">` with `fa-circle-question` icon
3. **Footer** — `<div class="sticky-footer"><div class="sticky-footer-inner"><div class="sticky-footer-actions">` with the Submit `<button>` (composes `.btn-primary.btn-block` + optional `.btn-loading` for submitting state) + cancel hint span. In `idle` state: footer hidden (or muted via opacity).

### Step 4: Roving tabindex on option-rows

The component does NOT manage roving tabindex itself — but it passes `tabIndex` prop to each `<OptionRow />` based on `focusedId` matching the option's `id`:

```typescript
const computedTabIndex = (option.id === focusedId || (focusedId === undefined && index === 0)) ? 0 : -1;
```

Default behavior (no `focusedId`): first option gets tabindex 0, rest get -1. Consumer overrides via `focusedId` to manage roving.

### Step 5: Sub-components for clarity

Split into reasonable sub-components inside the same file (not separate files):

- `<ThreadQuestionCardHeader />` — header zone slot
- `<ThreadQuestionCardBody />` — body zone slot
- `<ThreadQuestionCardFooter />` — footer zone slot

These are NOT exported — internal-only. The single `<ThreadQuestionCard />` is the public API.

### Step 6: Update barrel export

Open `packages/ui-react/src/index.ts`. Add:

```typescript
export { ThreadQuestionCard } from './components/ThreadQuestionCard';
export type { ThreadQuestionCardProps, ThreadQuestionCardOption, ThreadQuestionCardState, ThreadQuestionCardVariant } from './components/ThreadQuestionCard';
```

### Step 7: Update registry.json

```json
{
  "name": "ThreadQuestionCard",
  "patternLibrarySource": "packages/design-system/pattern-library/components/thread-question-card.html",
  "componentPath": "packages/ui-react/src/components/ThreadQuestionCard.tsx",
  "stories": [
    "variant-1-single-select-desktop",
    "variant-2-multi-select-with-pre-selection",
    "variant-4-mobile-bottom-sheet",
    "is-idle",
    "is-historical",
    "error-state",
    "empty-state"
  ],
  "tier": 2,
  "composes": ["OptionRow"]
}
```

### Step 8: Run conform gates

- `pnpm typecheck`
- `pnpm --filter @haven/ui-react conform:fast`
- `pnpm --filter @haven/ui-react conform:manifest`
- `pnpm --filter @haven/ui-react conform:css-family`

## Known Constraints

- **Mechanical port only.** No new ARIA, no new class names. The PL HTML is the spec.
- **No state inside the component.** Selection, focus, roving tabindex, idle timer, focus trap, pin-priority logic — all consumer-side. The component is presentational.
- **No allowlist or pin-priority logic.** This component emits `data-pin-priority` as a static value passed via prop. Consuming-app `thread-panel` renderers read and apply.
- **Compose existing `<OptionRow />`.** Don't reimplement the option-row inside this component.

## Anti-patterns

- Do NOT add a `useState` for selection. `selectedIds` is parent-managed.
- Do NOT add a `useEffect` to start an idle timer. The `state="idle"` prop is set by the parent based on its own activity timer.
- Do NOT manage focus on Submit success. Parent transitions the card off (mounts `<ThreadMsgResponse />` in its place); focus management is parent-side.
- Do NOT add Preline JS init for the bottom-sheet. Variant 4 is rendered inside an existing `<BottomSheetPanel />` (or whatever the React port for `bottom-sheet-panel` is named); Preline's `data-hs-overlay` lives on that component, not on the card.
- Do NOT extract `<OptionRowList />` as a standalone exported component in this task. It's a slot inside this card; extraction is deferred per slice-manifest.

## Expected Result

After this task:
- `packages/ui-react/src/components/ThreadQuestionCard.tsx` exists; mirrors `thread-question-card.html` 1:1; composes `<OptionRow />`
- `packages/ui-react/src/index.ts` exports the new types
- `packages/ui-react/registry.json` has the new entry with `composes: ["OptionRow"]`
- All conform gates pass

## Verification

- [ ] `ThreadQuestionCard.tsx` exists; reads as a 1:1 mirror of the PL HTML
- [ ] `<section role="region" aria-labelledby={...}>` root with `data-pin-priority`
- [ ] `state` prop drives `is-idle` / `is-historical` class application + slot variations
- [ ] Composes `<OptionRow />` from Task 03 — does NOT reimplement option-row markup
- [ ] `option-row-list` slot has correct `role="radiogroup"` (single) or `role="group"` (multi)
- [ ] `aria-labelledby` chained: section → prompt-body's id; option-row-list → same prompt-body's id
- [ ] No inline styles, no `useState` for selection or idle
- [ ] Sub-components for header/body/footer are internal (not exported)
- [ ] Barrel export updated
- [ ] `registry.json` entry added with `composes: ["OptionRow"]`
- [ ] `pnpm typecheck` passes
- [ ] `pnpm --filter @haven/ui-react conform:fast` passes
- [ ] `pnpm --filter @haven/ui-react conform:manifest` passes
- [ ] `pnpm --filter @haven/ui-react conform:css-family` passes

## Completion Report

After all verification passes and before running the git commit:

```
## Completion Report — Task 04: <ThreadQuestionCard /> React port

- New semantic classes added to components.css: none
- Existing classes modified: none
- Pattern library files created or updated: none
- React components created: packages/ui-react/src/components/ThreadQuestionCard.tsx
- Barrel export updated: packages/ui-react/src/index.ts
- registry.json entry added: yes (composes: ["OptionRow"])
- Composed primitives: <OptionRow /> (Task 03)
- Judgment calls (anything not explicitly specified in the prompt): none
- Dark mode added: not applicable (CSS lives in pattern-library; React port inherits)
- Schema delta logged: not applicable
- Items deferred or incomplete: none
```

**Deterministic task — "Judgment calls" must be `none`.**

## Commit scope

Stage explicitly:
```
git -C /Users/aaronsleeper/Vaults/Lab/haven-ui add \
  packages/ui-react/src/components/ThreadQuestionCard.tsx \
  packages/ui-react/src/index.ts \
  packages/ui-react/registry.json
```

Commit message format:
```
feat(ui-react): port ThreadQuestionCard Tier 2 primitive 1:1 from PL fragment

Mechanical 1:1 port of thread-question-card.html to React. Composes <OptionRow />
inside option-row-list slot. .is-idle and .is-historical state variants. Pin-
priority via data-pin-priority prop (consumer-side thread-renderer logic).
Presentational component; all state (selection, idle, focus) is consumer-side.
PL source: packages/design-system/pattern-library/components/thread-question-card.html
```

## Next step

After verification + commit, proceed to Task 05 (`05-storybook-variant-matrix.md`) — Storybook stories for both `<OptionRow />` and `<ThreadQuestionCard />`.

## If Something Goes Wrong

- **`<OptionRow />` import fails:** confirm Task 03's barrel export landed; the import in this file should be `import { OptionRow } from './OptionRow';` (relative within the same directory).
- **`data-pin-priority` not appearing in JSX output:** in React, custom data attributes use `data-pin-priority={pinPriority}` (kebab-case); avoid `dataPinPriority` which won't render.
- **Discriminated union on `state` prop fails to narrow:** confirm `state?: ThreadQuestionCardState` with `string` union (`'in-flight' | 'idle' | ...`); narrow via if-statements or switch in the component body.
- **`conform:manifest` complains about `composes` field:** if the existing schema doesn't have `composes`, drop the field — it's a documentation aid, not a contract. Confirm via `registry.json` schema docs in `packages/ui-react/`.
