# @cena/catalog-ui

Cena Health's Angular pattern catalog. Part of haven-ui.

## What this is

A catalog of Angular component starts and patterns that Cena's agentic pipeline emits against. shadcn-style ownership: components arrive in this package (via `zard-cli` for community starts, or hand-authored for Cena-specific patterns), and are owned in-tree from the moment they land. There is no runtime dependency on an upstream library.

The catalog is the *deterministic contract* half of generative determinism (see vault rule `.claude/rules/generative-determinism.md`). The agent's emission against a use-case brief is the *generative fill* within that contract.

## Sibling structure under haven-ui

- `packages/design-system/` — HTML pattern library + tokens (the design system spec).
- `packages/ui-react/` — 1:1 mechanical React port of the HTML PL.
- **`packages/angular-patterns/`** — this package; Angular pattern catalog (shadcn-style; ZardUI lineage).
- `packages/preline/` (and others) — additional siblings as the platform grows.

## What's in here (incremental)

This first commit contains the package scaffold only. Components arrive in subsequent commits, each as a complete vertical slice (component source + `registry-item.json` manifest + Brain/Helm classification + smoke test).

When populated, the structure will be:

```
src/
  shared/
    components/       # Component starts (sourced via zard-cli or authored)
    core/             # Shared providers (e.g., provideCena() — analog to provideZard())
    utils/            # Shared utilities (cn, etc.)
  registry/
    <component>.json  # registry-item.json manifest per component
```

## How to use

- **Adding a community component start** — run `npx zard-cli@latest add <component>` inside this package; the file lands in `src/shared/components/`. We own it from then on; upstream is the source of starts, not a continuously-merged dependency.
- **Adding a Cena-authored pattern** — author directly under `src/shared/components/` and pair with a `registry-item.json` manifest under `src/registry/`.
- **Updating an existing component against a new upstream version** — see `UPSTREAM.md` for the diff-and-merge workflow.

## Build

This package is consumed in-tree by the Cena proving slice + (eventually) by Andrey's Angular apps. Build configuration (ng-packagr, etc.) is added when the first vertical-slice commit lands.

## Provenance + license

Cena Health, MIT. Component starts derived from ZardUI (MIT) and shadcn-ui (MIT) are credited in `UPSTREAM.md` and at the file level where authored upstream.

## Related

- Proving slice plan: `~/.claude/plans/angular-emit-proving-slice.md`
- Concept rule: `.claude/rules/generative-determinism.md`
- Preference ledger: `Lab/haven-ui/planning/team/proposals/angular-emit-preferences.md`
