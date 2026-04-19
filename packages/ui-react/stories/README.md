# @haven/ui-react — Storybook stories

Stories are the **canonical visual baselines** for every entry in
`registry.json`. Each `Component.stories.tsx` mirrors its pattern-library
HTML exemplar byte-for-byte. A composed screen (e.g. the pilot GAD-7 wireframe)
is not diffed against a mockup; its sub-components are extracted as stories
and diffed against these baselines (SPEC v0.4 §7).

## Running Storybook

```sh
pnpm --filter @haven/ui-react storybook           # dev — port 5178
pnpm --filter @haven/ui-react storybook:build     # static build at storybook-static/
```

FontAwesome is served via `staticDirs` from the design-system's vendor
directory, mounted at `/vendor/fontawesome`, and linked from
`.storybook/preview-head.html`. This mirrors the pattern-library pages
so stories render identically.

## Story authoring rules

One story file per registry entry. File name matches the component:
`QueueItem.stories.tsx`, `QueueSidebar.stories.tsx`, etc.

Every story:

- Uses **typed-prop args** matching the component's `.props.ts` schema. No
  `children: ReactNode` passthrough (QueueSectionHeader is the documented
  exception — see its registry entry `notes` field).
- Exports `Default` as the primary variant, matching the **first variant** of
  the pattern-library HTML exemplar.
- Titles follow `UI/{Component}` for predictable iframe URLs. Registry
  story references use the dot notation: `QueueItem.default` ↔ iframe URL
  `iframe.html?id=ui-queueitem--default`.
- **Decorators mirror the component's outer container** when the pattern-library
  HTML wraps it in one (e.g., QueueItem lives inside `<ul class="queue-list">`
  in `queue-sidebar.html`, so its story decorator reproduces that wrapper).
  Components that own their outer container (QueueSidebar, AssessmentHeader)
  use no decorator.

### Variant coverage — roadmap

Pilot ships one `Default` story per component. Variant matrix stories
(e.g. `QueueItem.breached`, `QueueItem.attention`, `QueueItem.info`;
unselected `ResponseOption`; start/end `ProgressBarPagination`) land
before the step-10 visual-regression gate wires to Playwright. Each
additional variant is added to both the component's `.stories.tsx` file
and the registry entry's `stories` array in `registry.json`.

## Visual regression — CI-only baselines

The step-10 visual gate (see `haven-ui-pilot-gates-first.md`) wires
Playwright `toHaveScreenshot` against every Storybook story's iframe URL.
**Baselines are generated in CI only — never locally** (SPEC §7).

**Reason:** macOS dev environments produce different font-hinting and
antialiasing than Linux CI runners. Local baselines drift against CI on
every PR; CI baselines remain stable.

### Policy (enforced when step 10 ships)

1. Baselines commit to `packages/ui-react/__screenshots__/` (or equivalent),
   gated to Linux runners.
2. `playwright.config.ts` reads `process.env.CI`:
   - `CI=true` (Linux runner) — `--update-snapshots` permitted; diff on subsequent runs.
   - Local (no `CI`) — snapshot assertions skipped with a clear message. Any
     attempt to run `--update-snapshots` locally fails loud.
3. First baseline generation per component: PR opens a designated workflow
   that runs `--update-snapshots` in CI and commits the artifact.
4. Developers rely on **visual review in Storybook** plus the
   **pattern-library dev server** (`pnpm --filter @haven/design-system dev`,
   port 5173) for local parity checks.

Until step 10 lands, stories run via `pnpm --filter @haven/ui-react storybook`
and are reviewed visually against the pattern-library pages.
