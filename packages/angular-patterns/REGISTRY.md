# @cena/catalog-ui — registry index

Catalog of registry items the agentic pipeline emits against. Each item lives at `src/registry/<name>.json` and follows the shadcn `registry-item.json` schema with a `meta.cena` extension carrying Cena-specific metadata (classification, preference-ledger row references, upstream lineage, pairing relationships).

## Registry types

| Type | What it carries | Authored by |
|---|---|---|
| `registry:ui` | A component primitive — source files + variant axes + Helm/Brain classification | Cena owns the lines from the day they land; ZardUI is the source of initial starts (see UPSTREAM.md) |
| `registry:cena-pattern` | A pattern — code template, decision tree, or knowledge entry. NO component source. The agent reads `meta.cena.template` / `principles` / `phases` to emit code into consumer apps. | Cena-authored. No upstream lineage. |
| `registry:cena-data-binding` | A data-binding pattern — the 4-tier shape (connector → service wrapper → component signals → template) for binding catalog components to Firebase Data Connect. The structural row (#13) in the preference ledger. | Cena-authored. No upstream lineage in any contender. |

## Component primitives (registry:ui)

| Name | Classification | Pairs with | Source |
|---|---|---|---|
| `button` | Helm | card | ZardUI |
| `input` | Helm | form | ZardUI |
| `form` | Helm | input | ZardUI |
| `card` | Helm | button, badge | ZardUI |
| `badge` | Helm | card | ZardUI |

All five are **Helm** — styled compositions with CVA-based variant axes. Brain behavior is supplied by native HTML semantics (`<button>`, `<a>`, `<input>`, `<textarea>`) + Angular Forms' `NG_VALUE_ACCESSOR` contract. There is no separate behavior-primitive package to install for these.

## Patterns (registry:cena-pattern)

| Name | Pattern type | Used by | Pairs with |
|---|---|---|---|
| `route-lazy` | code-template | Every non-shell route | — |
| `route-guard` | code-template | Routes needing auth/role/onboarding gating | route-lazy |
| `di-providing` | decision-tree | Any new Angular service | — |
| `cd-zoneless` | knowledge | Any component using signals under zoneless | — |
| `list-stream` | composition-pattern | Chat/feed/log lists (E1: Messages) | card |
| `detail-view` | composition-pattern | Single-resource views (E2: Profile) | card, button |
| `event-mutation` | code-template | UI action → service mutation + optimistic update | list-stream |

## Preference-ledger row coverage

Every registry item declares the preference-ledger rows (`Lab/haven-ui/planning/team/proposals/angular-emit-preferences.md`) it touches. Coverage across the catalog:

- Row 1 (Standalone): `cd-zoneless`
- Row 2 (Zoneless CD): `cd-zoneless`
- Row 3 (Signal I/O): every component primitive + most patterns
- Row 4 (Functional DI): `route-guard`, `di-providing`
- Row 5 (Control-flow @if/@for): `button`, `form`, `card`, `list-stream`, `detail-view`
- Row 8 (PL semantic class vocabulary): every component primitive
- Row 10 (linkedSignal): `cd-zoneless`, `input`
- Row 11 (viewChild signal queries): `card`
- Row 13 (Data Connect contract shape): `data-connect-binding` (canonical, structural-row owner), plus `list-stream`, `detail-view`, `event-mutation` (all reference data-connect-binding)
- Row 15 (Behavior re-expressed as signals): `event-mutation`
- Row 16 (Angular 21.2.13 signal APIs): every registry item

## Data Connect bindings (registry:cena-data-binding)

| Name | Iteration | Reference implementations |
|---|---|---|
| `data-connect-binding` | first-pass (2026-05-28) | Messages (E1) + Profile (E2) inline references |

The structural row (#13) in the preference ledger. First-pass authored 2026-05-28 — 4-tier shape (raw connector → DataConnectService → PatientDataService → component signals) + read/write templates + Messages/Profile reference implementations + gotchas covering structural-tier violations. Refines against real emission attempts in subsequent commits (E1 + E2 of the proving slice).

The previous "deferred" status (when this section described a 1–2 week gap) lifts with this entry. What remains is the iteration loop — emit, observe friction, refine templates — not the initial authoring.

## Authoring discipline

- **One slice per primitive.** Each component lands with its source + variants + spec skeleton + `registry-item.json` + barrel update.
- **Preserve upstream `@/...` import paths.** Resolved by tsconfig `paths` in this package (`@/* → ./src/*`). Diffing in-tree components against upstream becomes a clean text diff.
- **Brain/Helm classification is required.** Every component must declare classification + classificationRationale.
- **Preference-ledger row references are required.** Every registry item names which rows it touches and how (the `applies` field). This is the audit trail that lets a future row change reveal which items need re-emission.
- **Cena patterns reference upstream where applicable.** Even for Cena-authored patterns, name the Andrey-anchor (his existing implementation) as the shape reference — so we never silently invent a contract he'll reject.

## Adding a new entry

For a community component start:

1. `cd packages/angular-patterns`
2. `npx zard-cli@latest add <component>` (configures via `components.json`)
3. Move/rename files to land at `src/shared/components/<name>/` if needed
4. Author `src/registry/<name>.json` per the schema above
5. Update `src/index.ts` barrel
6. Update this REGISTRY.md
7. Commit as a single vertical slice

For a Cena-authored pattern:

1. Author `src/registry/<name>.json` directly with `type: registry:cena-pattern`
2. No file source; populate `meta.cena.template` / `principles` / `phases` per pattern type
3. Reference relevant Andrey anchors + in-catalog cross-references
4. Update this REGISTRY.md
5. Commit

## Related

- [UPSTREAM.md](./UPSTREAM.md) — lineage, anchor commit, adoption model
- [README.md](./README.md) — package intent + sibling structure in haven-ui
- Proving slice plan: `~/.claude/plans/angular-emit-proving-slice.md`
- Concept rule: `.claude/rules/generative-determinism.md`
- Preference ledger: `Lab/haven-ui/planning/team/proposals/angular-emit-preferences.md`
