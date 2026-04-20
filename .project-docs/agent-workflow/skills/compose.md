---
name: compose
description: Deterministic build agent. Transforms a `.mdoc` wireframe into a React screen component by walking the Markdoc AST and mapping each registered tag to its React component via `registry.json`. Runs the schema validator first and refuses to emit broken JSX. Use after a wireframe has cleared the Step-8 Aaron gate and is ready to materialize as a `.tsx` screen.
model: sonnet
task_class: deterministic
---

# /compose

You mechanically translate a validated Markdoc wireframe into a React screen component in `apps/<persona>/src/screens/`. This is a **deterministic** skill — no judgment, no invention. If a tag has no registered component, or the wireframe fails validation, you fail loudly rather than guessing.

Authoritative source: SPEC v0.4 §Tier 3 (`Lab/generative-ui-research/SPEC.md`). The executable lives at `packages/ui-react/scripts/compose.ts`.

## Preconditions (check first; fail if any are false)

1. `packages/ui-react/schema/index.js` exists — Markdoc tag schemas have been generated from the registry. If not, run `pnpm --filter @haven/ui-react build` first.
2. The input wireframe is a `.mdoc` file whose top-level nodes are **only** registered Markdoc tags (no loose headings, paragraphs, or prose). Validate with `pnpm tsx scripts/validate-mdoc.ts <path>` before invoking `/compose`.
3. Every tag used in the wireframe is listed in `registry.json` with a non-null `haven.composition.markdocTag`.
4. The wireframe basename is a valid JS identifier after kebab→Pascal conversion (e.g. `gad-7` → `Gad7` is valid; `7-day-plan` → `7DayPlan` is not — add a prefix first).

## Invocation

Run from `packages/ui-react/`:

```bash
pnpm compose <input.mdoc-relative-to-cwd> <output.tsx-relative-to-cwd>
```

Example:

```bash
cd packages/ui-react
pnpm compose ../../apps/patient/design/wireframes/gad-7.mdoc ../../apps/patient/src/screens/gad-7.tsx
```

The script:

1. Parses the `.mdoc` with `Markdoc.parse()`.
2. Runs `Markdoc.validate(ast, config)` against the generated schemas — fails with file:line:col errors if any critical or error-level issue surfaces.
3. Walks `ast.children`. Each top-level tag node → one JSX element in the output. Non-tag top-level nodes fail the build.
4. Resolves attributes via `node.transformAttributes(config)` and serializes them into JSX: strings as `prop="value"`, everything else as `prop={…}` with 2-space JSON reflow.
5. Derives the default-exported component name from the wireframe basename (kebab→Pascal).
6. Imports components from `@haven/ui-react`; component names come from each registry entry's primary `.tsx` file basename.
7. Writes the file. Deterministic: re-running with no source change produces zero diff.

## Verification

After emitting:

1. `pnpm --filter @haven/ui-react typecheck` (and/or `pnpm turbo run typecheck`) — confirms JSX compiles against the registry's prop types.
2. `pnpm --filter @haven/app-<persona> dev` — boot the app server and load the wired route. Per the Step-7 lesson, HTTP 200 does not prove rendered pixels; eyeball the result against the pattern-library reference.
3. Leave the dev URL in the Aaron gate message so visual verification happens before advancing.

## Fail modes

- Validation errors → print the envelope and exit 1. Fix the wireframe.
- Non-tag top-level node (e.g. a leftover `#` heading) → exit 1. Strip non-tag content so the `.mdoc` is tags-only.
- Tag has no registered component → exit 1. Either the tag is a typo, or the registry entry is missing/has `markdocTag: null`.
- Basename doesn't yield a valid identifier → exit 1. Rename the wireframe.

## What this skill does not do

- Decide where screens live (`apps/<persona>/src/screens/` is conventional but the path is passed in).
- Wire the emitted screen into the app shell — that's an editor step in `apps/<persona>/src/App.tsx`.
- Run the conformance gates — see `pnpm --filter @haven/ui-react conform`.
- Invent JSX structure, add wrapper divs, or reorder tags — output tag order mirrors AST order exactly.

## Pilot scope

The pilot wires the 6 Markdoc-addressable registry entries through `/compose`:

- `assessment-header`
- `progress-bar-pagination`
- `queue-item`
- `queue-sidebar`
- `response-option`
- `response-option-group`

Layout tags (`canonical-shell`, `content-pane`, `nav-pane`) from SPEC §5's illustrative example are registered post-pilot. Until then, the consuming app wraps the generated screen at composition time in `App.tsx`.
