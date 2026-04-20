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

### Variant coverage

Each registered component ships one story per distinct exemplar in its
pattern-library HTML — one `Default` plus one per additional variant.
Story exports use PascalCase (CSF convention); Storybook kebab-cases them
for iframe IDs (`export const NoMeta` → `ui-assessmentheader--no-meta`).
Registry `stories` entries use dot-notation (`AssessmentHeader.no-meta`).

Per-axis coverage (landed 2026-04-20 as slice-1 debt-closeout item 2):

- `QueueItem` — `default`, `urgent` (breached SLA), `attention`, `info`
  (tier axis; `active` flag exercised in `default`)
- `QueueSectionHeader` — `default` (urgent), `attention`, `info`
- `ResponseOption` — `default` (checked), `unselected`
  (`disabled` parked — no pattern-library exemplar rendered yet)
- `ResponseOptionGroup` — `default` (answered), `unanswered`
- `PrimaryAction` — `default` (anchor), `button`
- `ProgressBarPagination` — `default` (mid), `start`, `end`, `phq2`
- `AssessmentHeader` — `default` (GAD-7 mid), `start` (PHQ-9), `no-meta`

Orthogonal axes (e.g., `QueueItem.is-urgent` tier vs `is-breached` SLA
state) get one story per axis value, not one per visual combination.
When a pattern-library HTML adds a new exemplar, the corresponding story
and registry entry ship in the same commit.

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
