# Task 05: Storybook variant-matrix stories — OptionRow + ThreadQuestionCard

## Scope
React port (`packages/ui-react/`)

## Task class
deterministic

## Model tier
sonnet

## Context

Storybook variant-matrix stories provide:
1. Visual-regression baselines for `conform:visual` (Playwright) — pixel-level divergence detection between React port and PL fragment
2. Interactive exploration during 4-expert panel reviews and consumer-app integration
3. Documentation of every variant declared in `registry.json`'s `stories` array

Each story renders one variant exactly as the PL fragment shows it. The `stories` arrays in `registry.json` (Tasks 03, 04) declare the expected stories — `conform:manifest` enforces presence.

This task creates two `.stories.tsx` files and verifies all stories render in Storybook.

## Prerequisites

- **Task 03 complete** — `<OptionRow />` exported, `registry.json` declares 9 stories
- **Task 04 complete** — `<ThreadQuestionCard />` exported, `registry.json` declares 7 stories

## Files to Read First

- `packages/ui-react/src/components/OptionRow.tsx` — Task 03 output
- `packages/ui-react/src/components/ThreadQuestionCard.tsx` — Task 04 output
- `packages/ui-react/registry.json` — confirms expected story names
- `packages/ui-react/src/components/ResponseOption.stories.tsx` (if exists) — closest precedent
- `packages/ui-react/src/components/ThreadApprovalCard.stories.tsx` (if exists) — closest precedent for thread-message-class card stories
- Any existing `.stories.tsx` in `packages/ui-react/src/components/` — for Storybook CSF format precedent

## Instructions

### Step 1: OptionRow stories

Create `packages/ui-react/src/components/OptionRow.stories.tsx`. Use Storybook CSF (Component Story Format) v3 with `Meta` + `StoryObj` types:

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { OptionRow } from './OptionRow';

const meta = {
  title: 'Forms/OptionRow', // or 'Thread Agent/OptionRow' — match the COMPONENT-INDEX category from Task 01
  component: OptionRow,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof OptionRow>;

export default meta;
type Story = StoryObj<typeof meta>;
```

Then 9 stories matching `registry.json`'s `stories` array:

1. `SingleSelectUnselected` — `selectionMode: { mode: 'single', checked: false }`, title "Match to existing referral", description from wireframe
2. `SingleSelectSelected` — `selectionMode: { mode: 'single', checked: true }`
3. `WithRecommendation` — single-select unselected with `recommended: true` showing the inline `(Recommended)` badge
4. `MultiSelectUnselected` — `selectionMode: { mode: 'multi', checked: false }`, title "Cilantro"
5. `MultiSelectSelected` — `selectionMode: { mode: 'multi', checked: true }`
6. `IsOtherCollapsed` — `variant: 'is-other'`, `expanded: false`
7. `IsOtherExpanded` — `variant: 'is-other'`, `expanded: true`, with revealed textarea
8. `IsTabletDense` — single-select with `tabletDense: true`
9. `Disabled` — `disabled: true`

Each story uses the wireframe's example copy (from `agentic-question.md`); pass realistic content.

### Step 2: ThreadQuestionCard stories

Create `packages/ui-react/src/components/ThreadQuestionCard.stories.tsx`. Same CSF v3 format:

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { ThreadQuestionCard } from './ThreadQuestionCard';

const meta = {
  title: 'Thread Agent/ThreadQuestionCard',
  component: ThreadQuestionCard,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ThreadQuestionCard>;

export default meta;
type Story = StoryObj<typeof meta>;
```

7 stories matching `registry.json`:

1. `Variant1SingleSelectDesktop` — `variant: 'desktop-inline'`, `selectionMode: 'single'`, 3 options (one with `recommended: true`), `allowOther: true`, recommendation callout populated, agentIdentity for Ava
2. `Variant2MultiSelectWithPreSelection` — `variant: 'desktop-inline'`, `selectionMode: 'multi'`, 3 options pre-selected via `selectedIds`, `preSelectionSuggestion: "Ava suggested these. Edit and submit when ready."`
3. `Variant4MobileBottomSheet` — `variant: 'mobile-bottom-sheet'`, `selectionMode: 'single'`, wrapped in a `<BottomSheetPanel />` (or a div mocking the bottom-sheet shell if BottomSheetPanel isn't available — confirm against existing port). Use Storybook viewport addon for mobile sizing.
4. `IsIdle` — `state: 'idle'`, demonstrates the collapsed one-line summary + reduced opacity
5. `IsHistorical` — `state: 'historical'`, `pinPriority: 4`, with previously-selected option preserved in `selectedIds`
6. `ErrorState` — `state: 'error'`, `errorMessage: "We couldn't send your answer. Try again, or close and we'll re-ask."`, Submit returned to enabled
7. `EmptyState` — `state: 'empty'`, `options: []`

Use the wireframe's "Use-case anchors" examples for realistic content:
- Variant 1: Coordinator referral clarification — questionClass "Match referral", options reflecting cc-04 referral flow
- Variant 2: Kitchen substitution — questionClass "Substitution", multi-select substitution options
- Variant 4: Patient meal-window selection — questionClass "Delivery time", 3 meal windows

Each story handles its own callbacks via Storybook's `args` + `action` addon (or local component-level state via Storybook's `useArgs` hook for interactive selection).

### Step 3: Verify stories render

Run `pnpm --filter @haven/ui-react storybook`. Open the Storybook URL it prints. Navigate to:

- `Forms/OptionRow` (or `Thread Agent/OptionRow` per Step 1) — confirm all 9 stories render and visual treatment matches the PL page at http://localhost:5173 (run both servers)
- `Thread Agent/ThreadQuestionCard` — confirm all 7 stories render

Compare side-by-side with the PL fragments. Differences indicate port drift; fix at the React-port level (Tasks 03/04) until parity is achieved.

### Step 4: Run conform gates

- `pnpm --filter @haven/ui-react conform:fast` — manifest check confirms all expected stories exist
- `pnpm --filter @haven/ui-react conform:manifest` — `registry.json` parity
- `pnpm --filter @haven/ui-react conform:visual` — Playwright screenshots vs baselines (LOCAL ONLY today; no CI enforcement until Patch 8b lands per `Lab/haven-ui/CLAUDE.md`)

If any gate fails, fix and re-run.

## Known Constraints

- **Story names match `registry.json` exactly.** `conform:manifest` checks story-array parity. Renaming a story without updating registry.json breaks the gate.
- **No Storybook play functions for state changes.** Interactive selection state is consumer-side; the stories demonstrate visual variants, not interaction flows. Use Storybook's `args` for static state per story.
- **`conform:visual` baselines** — when Playwright snapshots run for the first time, they create new baselines. Commit those baselines alongside the stories. The visual gate is local-only today; CI will enforce when item 8b lands.

## Anti-patterns

- Do NOT add stories that don't appear in `registry.json`. Add to registry.json first if a new story is warranted.
- Do NOT use `args` to inject state that the component shouldn't expose as a prop. If a story needs to demonstrate a transient state, the component prop API needs that state — fix at the component level.
- Do NOT mock `<OptionRow />` inside ThreadQuestionCard stories. Compose the real component for visual fidelity.

## Expected Result

After this task:
- `packages/ui-react/src/components/OptionRow.stories.tsx` exists with 9 stories
- `packages/ui-react/src/components/ThreadQuestionCard.stories.tsx` exists with 7 stories
- All stories render in Storybook without console errors
- `conform:manifest` confirms parity with `registry.json`'s `stories` arrays
- `conform:visual` baselines committed (or noted as pending CI bootstrap)

## Verification

- [ ] `OptionRow.stories.tsx` has all 9 stories from registry.json
- [ ] `ThreadQuestionCard.stories.tsx` has all 7 stories from registry.json
- [ ] All stories use realistic content from the wireframe examples
- [ ] `pnpm --filter @haven/ui-react storybook` runs cleanly; all 16 stories render
- [ ] Visual treatment matches the PL fragments (compare side-by-side with http://localhost:5173)
- [ ] `pnpm --filter @haven/ui-react conform:fast` passes
- [ ] `pnpm --filter @haven/ui-react conform:manifest` passes (story-array parity)
- [ ] `pnpm --filter @haven/ui-react conform:visual` runs locally; baselines committed if generated
- [ ] No new exports from the barrel — `.stories.tsx` files are not exported

## Completion Report

After all verification passes and before running the git commit:

```
## Completion Report — Task 05: Storybook variant-matrix stories

- New semantic classes added to components.css: none
- Existing classes modified: none
- Pattern library files created or updated: none
- React components created: none
- Storybook stories created:
  - packages/ui-react/src/components/OptionRow.stories.tsx (9 stories)
  - packages/ui-react/src/components/ThreadQuestionCard.stories.tsx (7 stories)
- Visual baselines committed: yes (path: ...) / no (CI bootstrap pending) [report which]
- Judgment calls (anything not explicitly specified in the prompt): none
- Dark mode added: not applicable (stories inherit from CSS)
- Schema delta logged: not applicable
- Items deferred or incomplete: none
```

**Deterministic task — "Judgment calls" must be `none`.**

## Commit scope

Stage explicitly:
```
git -C /Users/aaronsleeper/Vaults/Lab/haven-ui add \
  packages/ui-react/src/components/OptionRow.stories.tsx \
  packages/ui-react/src/components/ThreadQuestionCard.stories.tsx
```

If `conform:visual` generated new baseline screenshots:
```
git -C /Users/aaronsleeper/Vaults/Lab/haven-ui add \
  packages/ui-react/tests/__screenshots__/[OptionRow|ThreadQuestionCard]/
```
(Confirm the actual screenshot path against the existing visual gate setup.)

Commit message format:
```
test(ui-react): variant-matrix stories for OptionRow + ThreadQuestionCard

9 stories for <OptionRow /> + 7 stories for <ThreadQuestionCard /> matching
registry.json declarations. Visual-regression baselines committed for
conform:visual gate. Stories use wireframe-anchored realistic content
(coordinator referral, kitchen substitution, patient meal-window).
```

## Next step

After verification + commit:

1. Update `apps/_shared/design/build/slice-manifest.md` "Known gaps at slice-end" with anything observed during Storybook review
2. The agentic-question primitive slice is complete — primitives are in PL, ports are in ui-react, stories provide visual baselines
3. **Cross-primitive scope items (NOT this slice):** consuming-app slices in coordinator, provider, patient, kitchen each add `agent_question` to their thread-renderer allowlist and wire pin-priority logic. Surfaced in slice-manifest "Deferred"; tracked for next slices in each app
4. Run `ux-design-review` (post-build mode) on the rendered Storybook + PL output for the final design-fidelity check
5. Run `debrief-capture` to log this slice's decisions, panel verdicts, and any deferred items

## If Something Goes Wrong

- **`conform:manifest` complains "story declared in registry.json but not exported":** confirm story names in the `.stories.tsx` file (the `export const StoryName = ...` names) exactly match the registry.json `stories` array (kebab-case in registry, PascalCase in TS — confirm against the existing convention for the haven-ui setup).
- **Storybook fails to render `<ThreadQuestionCard />` Variant 4:** if `<BottomSheetPanel />` isn't yet ported to React, mock the bottom-sheet shell with a `<div className="bottom-sheet-panel">...</div>` wrapper. Add a TODO comment naming the deferred port; surface in slice-manifest "Known gaps at slice-end".
- **`conform:visual` produces large diffs immediately:** the gate is locally-run with no CI enforcement today. If the diffs are pure baseline-creation (first-run), accept them. If they show real divergence between React port and PL fragment, fix at the port level (Tasks 03/04), not at the story or baseline level.
- **Story interaction (e.g., clicking Submit) doesn't update args:** Storybook stories are not the right surface for interaction flows; they demonstrate variants. If interaction is needed for review, attach a Storybook play function — but typically the consumer-app integration is the right place to test interaction.
