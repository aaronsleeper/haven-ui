# Build Tasks: Agentic Question Pattern

**Date:** 2026-05-08
**Source:** `apps/_shared/design/component-map-agentic-question.md`, `apps/_shared/design/new-components/option-row.md`, `apps/_shared/design/new-components/thread-question-card.md`, `apps/_shared/design/wireframes/agentic-question.md`
**Target:** haven-ui pattern library + React port (apps/_shared, multi-app primitive)

## Task Summary

**Total tasks:** 5 build tasks + 2 expert-panel review ceremonies (not build tasks; surfaced for sequencing)
**New PL fragments:** 2 (option-row, thread-question-card)
**New React ports:** 2 (`<OptionRow />`, `<ThreadQuestionCard />`)
**Estimated complexity:** Moderate

This slice authors the agentic-question pattern's **primitive layer only** — PL HTML, components.css, COMPONENT-INDEX rows, React ports, and Storybook variant-matrix stories. Cross-primitive scope items (pin-priority logic in `thread-panel`, `agent_question` allowlist additions in 4 consuming apps) are **explicitly out of scope** for this slice. They ship in consuming-app slices.

## Execution Order

| # | Task | Scope | Class | Model | File(s) Modified | Depends On | Status |
|---|---|---|---|---|---|---|---|
| 01 | option-row PL fragment | Pattern library + CSS | deterministic | sonnet | `pattern-library/components/option-row.html` (new), `src/styles/tokens/components.css`, `pattern-library/COMPONENT-INDEX.md` | — | ☐ |
|   | **4-expert panel review for option-row** | Review ceremony | — | — | (no files; verdict captured in slice-manifest Round 1) | 01 | ☐ |
| 02 | thread-question-card PL fragment | Pattern library + CSS | deterministic | sonnet | `pattern-library/components/thread-question-card.html` (new), `src/styles/tokens/components.css`, `pattern-library/COMPONENT-INDEX.md` | 01 + option-row panel | ☐ |
|   | **4-expert panel review for thread-question-card** | Review ceremony | — | — | (no files; verdict captured in slice-manifest Round 2) | 02 | ☐ |
| 03 | option-row React port via ui-react-porter | React port | deterministic | sonnet | `packages/ui-react/src/components/OptionRow.tsx` (new), `packages/ui-react/src/index.ts` (barrel), `packages/ui-react/registry.json` | 01 + panel approval | ☐ |
| 04 | thread-question-card React port via ui-react-porter | React port | deterministic | sonnet | `packages/ui-react/src/components/ThreadQuestionCard.tsx` (new), `packages/ui-react/src/index.ts`, `packages/ui-react/registry.json` | 02 + panel approval, 03 | ☐ |
| 05 | Storybook variant-matrix stories | React port | deterministic | sonnet | `packages/ui-react/src/components/OptionRow.stories.tsx` (new), `packages/ui-react/src/components/ThreadQuestionCard.stories.tsx` (new) | 03, 04 | ☐ |

## Phase boundaries

**Phase 1 — PL fragments (Tasks 01–02 + their panels):** must complete before any React port. These tasks include a 4-expert panel review *between* the two build tasks, because option-row's panel verdict may produce iterate-then-ship feedback that the thread-question-card spec relies on.

**Phase 2 — React ports + stories (Tasks 03–05):** mechanical 1:1 ports per `ui-react-porter` skill. No 4-expert panel — review happened at PL fragment level. Run blocking-on-patch + blocking-on-merge gates.

**Phase 3 — Cross-primitive + consuming-app slices (NOT this slice):** surfaced in slice-manifest "Deferred" section. Tracked for next slices in each consuming app.

## Post-Build

- [ ] `pnpm --filter @haven/design-system dev` — verify both PL fragments render at http://localhost:5173 without errors
- [ ] `pnpm --filter @haven/ui-react storybook` — verify both Storybook stories render with all variants
- [ ] `pnpm typecheck` — passes
- [ ] `pnpm --filter @haven/ui-react conform:fast` — passes (typecheck + conform:manifest)
- [ ] `pnpm --filter @haven/ui-react conform` — full umbrella passes (run before PR)
- [ ] Run ux-design-review (post-build mode) on the rendered Storybook + PL output
- [ ] Update slice-manifest with Round-N expert verdicts as each panel completes

## Notes

- **Spec dependency:** every task reads its companion spec from `apps/_shared/design/new-components/`. The spec is the source of truth for HTML structure, CSS class set, ARIA, and dark-mode treatment. **Copy from the spec; don't regenerate from memory.**
- **Pre-existing dirty files in working tree:** `DESIGN.md`, `packages/ui-react/schema/index.js`, `packages/ui-react/schema/primary-action.markdoc.js`, plus untracked `schema/{avatar,card,commit-action,icon-button,mobile-shell,patient-task-card}.markdoc.js`. These belong to a different task — do NOT stage them with any of the tasks below.
- **Scope discipline:** stage only files each task explicitly authored. Use `git add <explicit-paths>` per `commit-scope.md`.
- **Active rules from `.project-docs/decisions-log.md`** (relevant to these tasks):
  - When adding a new component nested inside another, check the parent's border radius and use one step smaller. *(option-row at `rounded-[5px]` is already smaller than thread-question-card at `rounded-[8px]` — no action needed; flagged for verification.)*
  - Other rules (button base no size/color) do not apply.

## Promotion to next-task.md

When ready to execute, copy Task 01 to `.project-docs/prompts/next-task.md` and run `/build`. Promote subsequent tasks one at a time after each completes verification.
