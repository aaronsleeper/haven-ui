# Task 03: `<OptionRow />` — React port via ui-react-porter

## Scope
React port (`packages/ui-react/`)

## Task class
deterministic

## Model tier
sonnet

## Context

`<OptionRow />` is the React port of the `option-row` PL fragment shipped in Task 01. Per haven-ui's "copy, don't generate" rule, this port is a **mechanical 1:1 mirror** of the PL HTML — same class names, same DOM structure, same ARIA. The React component is a thin wrapper exposing typed props for variants (single/multi), states (selected, disabled, is-other expanded), and content (title, description, recommended).

This task uses the `ui-react-porter` skill at `.project-docs/agent-workflow/skills/ui-react-porter.md`. Read that skill spec before starting — it owns the porting discipline (mechanical port, registry.json entry, variant-matrix story coverage).

## Prerequisites

- **Task 01 complete + 4-expert panel approved** — option-row PL fragment shipped, classes in components.css, COMPONENT-INDEX row exists, panel verdict is ship (or iterate-then-ship cleared)
- Round 1 of `slice-manifest.md` updated with the panel verdict

## Files to Read First

- `.project-docs/agent-workflow/skills/ui-react-porter.md` — owning skill; follow its discipline
- `packages/design-system/pattern-library/components/option-row.html` — the source of truth (Task 01 output)
- `apps/_shared/design/new-components/option-row.md` — companion spec (typed props guide)
- `packages/ui-react/src/components/ResponseOption.tsx` — closest precedent (assessment-context option-row); informs prop shape but NOT class names (option-row uses its own classes per steward verdict)
- `packages/ui-react/registry.json` — find existing entries for precedent format (PL source path + stories array)
- `packages/ui-react/src/index.ts` — barrel export pattern

## Instructions

### Step 1: Run ui-react-porter for `<OptionRow />`

Per `.project-docs/agent-workflow/skills/ui-react-porter.md`, port the option-row PL HTML to a React component at `packages/ui-react/src/components/OptionRow.tsx`. The port:

- Reads `packages/design-system/pattern-library/components/option-row.html` AS-IS
- Uses identical class names (no rename to camelCase or PascalCase)
- Preserves ARIA attributes verbatim (`role`, `aria-checked`, `aria-expanded`, `aria-controls`, `aria-disabled`)
- Preserves `tabindex` semantics (caller controls roving tabindex)
- Preserves the `<button>` root element (NOT a `<div>` with click handler)

### Step 2: Define typed props

The component exposes these props (TypeScript discriminated union for selection mode):

```typescript
type OptionRowSelectionMode =
  | { mode: 'single'; checked: boolean }
  | { mode: 'multi'; checked: boolean };

interface OptionRowBaseProps {
  optionId: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  recommended?: boolean; // renders inline .badge.badge-sm.option-row-recommended
  disabled?: boolean;
  tabIndex?: 0 | -1; // caller controls roving tabindex
  tabletDense?: boolean; // applies .is-tablet-dense modifier
  onSelect?: (id: string, nextChecked: boolean) => void;
  // ...callback for keyboard handlers; consumer composes
}

interface OptionRowStandardProps extends OptionRowBaseProps {
  variant?: 'standard';
  selectionMode: OptionRowSelectionMode;
}

interface OptionRowOtherProps extends OptionRowBaseProps {
  variant: 'is-other';
  selectionMode: OptionRowSelectionMode;
  expanded: boolean; // mirrors aria-expanded
  textareaId: string; // for aria-controls
  textareaValue?: string;
  textareaPlaceholder?: string;
  textareaLabel: string; // for sr-only <label>
  onTextareaChange?: (value: string) => void;
}

type OptionRowProps = OptionRowStandardProps | OptionRowOtherProps;
```

(Confirm naming + field names against `ui-react-porter` skill conventions — the skill may dictate camelCase vs. snake_case; default to camelCase per existing TypeScript ports.)

### Step 3: Render

Render the `<button>` element with the same class set + ARIA attributes from the PL HTML. For the `.is-other` variant, render the `<div class="option-row-other-wrapper">` containing the `<button>` + sr-only `<label>` + `<textarea class="option-row-other-textarea">`.

The component does NOT manage selection state itself — `aria-checked` is driven by the `selectionMode.checked` prop. The component does NOT manage focus — caller wires `ref` + roving tabindex.

For `.is-tablet-dense`, conditionally append the modifier class to the root: `className={`option-row ${tabletDense ? 'is-tablet-dense' : ''}`.trim()}`.

### Step 4: Update barrel export

Open `packages/ui-react/src/index.ts`. Add:

```typescript
export { OptionRow } from './components/OptionRow';
export type { OptionRowProps } from './components/OptionRow';
```

(Place in the existing alphabetized export list.)

### Step 5: Update registry.json

Open `packages/ui-react/registry.json`. Add a new entry mirroring existing precedents:

```json
{
  "name": "OptionRow",
  "patternLibrarySource": "packages/design-system/pattern-library/components/option-row.html",
  "componentPath": "packages/ui-react/src/components/OptionRow.tsx",
  "stories": [
    "single-select-unselected",
    "single-select-selected",
    "with-recommendation",
    "multi-select-unselected",
    "multi-select-selected",
    "is-other-collapsed",
    "is-other-expanded",
    "is-tablet-dense",
    "disabled"
  ],
  "tier": 1
}
```

(Adjust the field names to match the existing `registry.json` schema — read 2–3 existing entries before writing this one.)

### Step 6: Run conform gates

- `pnpm typecheck` — confirms TypeScript compiles
- `pnpm --filter @haven/ui-react conform:fast` — manifest + typecheck
- `pnpm --filter @haven/ui-react conform:manifest` — registry.json consistency
- `pnpm --filter @haven/ui-react conform:css-family` — Tailwind-family drift check on the React JSX

If any gate fails, fix and re-run before proceeding.

## Known Constraints

- **Mechanical port only.** No new ARIA, no new class names, no rearranged DOM. The PL HTML is the spec.
- **No inline styles.** No `style={{...}}` in JSX. No CSS Modules. No styled-components.
- **No state inside the component.** Selection, focus, roving tabindex, idle timer — all consumer-side. The component is presentational.
- **Active rule from `.project-docs/decisions-log.md`:** when adding a new component nested inside another, check the parent's border radius and use one step smaller. ✓ already verified at PL fragment level — option-row's `rounded-[5px]` is one step smaller than thread-question-card's `rounded-[8px]`.

## Anti-patterns

- Do NOT rename class names from kebab-case to camelCase. The class names ARE the contract between PL and port.
- Do NOT add a `useState` for `checked`. The component is controlled — `checked` is a prop driven by parent state.
- Do NOT add a click handler that toggles `aria-checked` internally. Selection is parent-managed; the component's `onSelect` callback notifies the parent.
- Do NOT use a `<div>` with `role="button"`. The PL HTML uses `<button>` — preserve that.
- Do NOT create an `<OptionRowList />` component in this task. The list container ships as a slot inside `<ThreadQuestionCard />` (Task 04). Steward call may extract `<OptionRowList />` as a standalone component later if a second carrier emerges.

## Expected Result

After this task:
- `packages/ui-react/src/components/OptionRow.tsx` exists; mirrors `option-row.html` 1:1
- `packages/ui-react/src/index.ts` exports `OptionRow` and `OptionRowProps`
- `packages/ui-react/registry.json` has a new entry for OptionRow
- `pnpm typecheck` passes
- `pnpm --filter @haven/ui-react conform:fast` passes

## Verification

- [ ] `OptionRow.tsx` exists; reads as a 1:1 mirror of `option-row.html`
- [ ] `<button>` root with appropriate `role` ("radio" or "checkbox")
- [ ] `aria-checked` driven by `selectionMode.checked` prop
- [ ] `.is-other` variant renders the `<textarea>` + sr-only `<label>` + correct `aria-expanded` + `aria-controls`
- [ ] `.is-tablet-dense` modifier conditionally applied via prop
- [ ] No inline styles, no `useState` for selection
- [ ] Barrel export updated
- [ ] `registry.json` entry added
- [ ] `pnpm typecheck` passes
- [ ] `pnpm --filter @haven/ui-react conform:fast` passes
- [ ] `pnpm --filter @haven/ui-react conform:manifest` passes
- [ ] `pnpm --filter @haven/ui-react conform:css-family` passes
- [ ] `_Last updated:` line in `COMPONENT-INDEX.md` already updated in Task 01 — no change needed here

## Completion Report

After all verification passes and before running the git commit, output this report:

```
## Completion Report — Task 03: <OptionRow /> React port

- New semantic classes added to components.css: none
- Existing classes modified: none
- Pattern library files created or updated: none
- React components created: packages/ui-react/src/components/OptionRow.tsx
- Barrel export updated: packages/ui-react/src/index.ts
- registry.json entry added: yes
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
  packages/ui-react/src/components/OptionRow.tsx \
  packages/ui-react/src/index.ts \
  packages/ui-react/registry.json
```

Pre-existing dirty files remain unstaged.

Commit message format:
```
feat(ui-react): port OptionRow Tier 1 primitive 1:1 from PL fragment

Mechanical 1:1 port of option-row.html to React. Single-select role=radio +
multi-select role=checkbox + .is-other reveal-on-select + .is-tablet-dense.
Presentational component; selection + roving tabindex are consumer-side state.
PL source: packages/design-system/pattern-library/components/option-row.html
```

## Next step

After verification + commit, proceed to Task 04 (`04-thread-question-card-react-port.md`).

## If Something Goes Wrong

- **`conform:css-family` complains about a missing class:** confirm the class names in JSX exactly match the PL HTML. Tailwind-family drift means the JSX uses utilities that the PL HTML doesn't (or vice versa); the gate detects family-level divergence.
- **`conform:manifest` complains about missing stories:** the `stories` array in registry.json must list each story name; story files don't exist yet (Task 05) but the manifest entry pre-declares them.
- **TypeScript discriminated union narrowing fails on consumers:** confirm `variant` is the discriminator on `OptionRowOtherProps` and the union type is correctly typed with `?` defaults.
- **The `.is-other` variant's textarea doesn't focus on reveal:** that's expected here — focus management is consumer-side. The component renders the textarea but doesn't move focus to it.
