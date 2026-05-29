# Upstream lineage and adoption model

This document records where `@cena/catalog-ui` came from and how Cena consumes from upstream over time.

## Lineage

- **shadcn-ui** (https://github.com/shadcn-ui/ui, MIT) — Distribution model: components are FILES that get copied into the consumer's source tree, not a library dependency. `registry.json` / `registry-item.json` schema. Cena adopts the schema verbatim.
- **ZardUI** (https://github.com/zard-ui/zardui, MIT) — Angular adaptation of the shadcn pattern. Source of community component starts via `zard-cli`. Provides `provideZard()` Angular-idiomatic DI integration, CVA + tailwind-merge variant pattern, signals-first / zoneless-ready components.
- **spartan-ng** (https://github.com/goetzrobin/spartan, MIT) — Architectural reference for Brain/Helm split (Brain = behavior primitive from npm/CDK; Helm = styled composition copied-and-owned in-tree). Not a source of code — pattern only.
- **Volt UI** (https://volt.angular.dev/, MIT) — Architectural reference for CVA + tailwind-merge usage and (potentially) MCP-route surface exposure. Not a source of code — pattern only.

## Anchor points (the basis as of this package's first commit)

- **Anchor commit (ZardUI):** `1e069d70120c09583999f2e4e7500b00ec258a9d` (master, fetched 2026-05-28 via shallow clone for evaluation; see `Lab/haven-ui/handoff/_proofs/cena-angular-proof/research/adoption-decision.md`).
- **ZardUI library version at anchor:** `1.0.0-beta.80` (from `libs/zard/package.json`).
- **zard-cli version verified in Phase 0 sandbox:** `1.0.0-beta.70` (2026-03-24).
- **Angular pin:** `21.2.13` (Cena's production patient app pin, from `cena-health-spark/patients/package.json`, 2026-05-25).
- **Phase 0 sandbox result:** clean build + clean `tsc --noEmit` on `/tmp/angular-eval/ng21-zard-sandbox` (2026-05-28). Details recorded in the proving slice plan.

## Adoption model — own the lines

When `zard-cli add <component>` runs inside this package, ZardUI's source for that component lands in our `src/shared/components/<component>/`. We own those lines from that moment. Upstream is the source of *starts*, not a continuously-merged dependency. There is no npm-time runtime link between Cena's catalog and ZardUI's library.

Practical implications:

- We do not import from `@zard/ui` at runtime. Our consumer apps import from `@cena/catalog-ui`.
- We can edit any component freely. Upstream changes to that component will not silently flow in.
- License obligations carry forward (MIT) — we preserve attribution at file headers when authoring derives meaningfully from upstream.

## Workflow — adding a new community component start

```
cd packages/angular-patterns
npx zard-cli@latest add <component>
```

`zard-cli` reads our `components.json` (created at `zard-cli init` time) and writes the component into `src/shared/components/<component>/`. After landing:

1. Author or update the corresponding `src/registry/<component>.json` (`registry-item.json` schema) with files / dependencies / registry-deps / Brain-or-Helm classification.
2. Add the component's smoke test under `src/shared/components/<component>/<component>.component.spec.ts`.
3. If new peer dependencies are required (e.g. `embla-carousel-angular` for `carousel`), add them to this package's `package.json` `dependencies` block.

## Workflow — updating an existing component against a new upstream version

When upstream ZardUI ships a meaningful update to a component we already own:

1. Re-clone ZardUI to a probe location (e.g. `/tmp/zard-probe/`); read the current upstream component source.
2. Diff our in-tree component against upstream. Manual three-way merge: upstream baseline → upstream current → our modifications.
3. Update this document's "anchor commit" line if the merge incorporates a new upstream baseline for that component.

This is intentionally manual. Automatic upstream merges defeat the "own the lines" model — we want explicit reconciliation each time.

## Why this model

- **shadcn-style ownership matches the agentic pipeline.** The pipeline emits against our catalog; our catalog must be a stable, owned contract, not a moving library dependency.
- **Upstream is a source of starts, not a continuously-merged dependency.** Our modifications (Brain/Helm classification, Data Connect bindings, Cena-specific theming) can land in-tree without coordinating with upstream maintainers.
- **License obligations carry forward (MIT).** Attribution preserved here at the package level and at file headers when components are authored upstream.

## Testing strategy — dual-runner reality (unresolved)

Catalog source ships with **Jest-flavored** spec files (`*.spec.ts` using `jest.fn()`, `toHaveValue()`, `toBeDisabled()`) inherited from ZardUI upstream. Consumer apps (Cena's patient app, the proving slice's evidence gate, the future spark patient app) use **Jasmine + Karma** (Angular CLI default).

**Empirical impact, observed in the proving slice 2026-05-28:** when the catalog's `src/` was copied into the evidence-gate Angular workspace, `ng test` compilation failed on catalog spec files (`jest.fn`, `toHaveValue`, `toBeDisabled` not in Jasmine types). The gate worked around it by renaming catalog spec files to `*.spec.ts.gate-excluded` so Angular's bundler skipped them.

**Two valid resolutions, both deferred:**

- **Path A — port catalog specs to Jasmine.** One-time cost (~5 spec files: button, card, badge, form, input). Removes the consumer-side workaround. Aligns catalog with the Angular CLI default. Cost: re-write spec idioms; lose any zone-free Jest assertions that don't have Jasmine equivalents.
- **Path B — document dual-runner intent and ship two configs.** Catalog keeps Jest specs (matches upstream, lower friction for catalog-internal CI when we add one). Consumer apps exclude catalog specs from their test compilation per the evidence-gate pattern. Cost: documented workaround at every consumer adoption site.

**Current state: implicit Path B + workaround.** Decision deferred until either (a) a catalog-internal CI surfaces a real need for catalog specs to run there, or (b) Andrey's pairing call (or another consumer) surfaces a real cost from the consumer-side exclusion.

When a consumer copies the catalog source: add this to their `tsconfig.spec.json` exclude list, OR move catalog spec files out of compilation scope:

```jsonc
// tsconfig.spec.json
{
  "exclude": ["src/lib/catalog-ui/**/*.spec.ts"]
}
```

If the consumer's Angular CLI version auto-includes spec files with `@Component`/`@Directive` metadata regardless of tsconfig (observed in Angular 21.2.x), physically rename the catalog spec files (e.g., `*.spec.ts.consumer-excluded`) so the bundler doesn't pick them up.

## When NOT to adopt from upstream

- A component upstream doesn't fit our use case shape (over-flexible for our patients, under-flexible for our care-coordinators, etc.).
- A component upstream has a behavior contract that conflicts with our preference ledger (`Lab/haven-ui/planning/team/proposals/angular-emit-preferences.md`).
- We need a Cena-specific primitive with no upstream equivalent (e.g., Firebase Data Connect binding components — see proving slice plan).

In those cases, author directly. The catalog is the contract; upstream is convenience, not authority.
