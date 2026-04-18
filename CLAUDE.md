# haven-ui — Agent Rules

haven-ui is a React monorepo that owns the full Cena Health frontend. AD-08 (React 19 + Vite) and AD-09 (Turborepo + pnpm workspaces) are locked. See `planning/decisions.md` and `planning/team/proposals/stack-recommendations.md`.

**Load-bearing rules:** pattern-library-first ("copy, don't generate"), semantic classes in `components.css`, `@apply` over utility soup, `pattern-library/COMPONENT-INDEX.md` as ground truth, scope declaration per task. Every React component in `packages/ui-react/` is a 1:1 mechanical port of its pattern-library HTML entry (see `.project-docs/agent-workflow/skills/ui-react-porter.md`).

The handoff-to-Andrey model has been retired. The vanilla HTML composites from that era live at `archive/vanilla-html-handoff/` for reference only; do not modify them.

---

Read the full task before taking any action. Complete it fully before stopping.

When done:
1. List every file modified and every new semantic class added to `components.css`
2. Run the following git commands from the repo root:
   ```
   git add [specific files]
   git commit -m "[brief description of what was built]"
   ```
3. Output the local server URL so Aaron can review:
   - Pattern-library spec server: `pnpm --filter @haven/design-system dev` → http://localhost:5173
   - App dev servers: `pnpm --filter @haven/app-care-coordinator dev` (5174), `@haven/app-kitchen` (5175), `@haven/app-patient` (5176), `@haven/app-provider` (5177)
   - All at once: `pnpm dev` (turbo runs every dev script in parallel)

Do not proceed to the next task — wait for review.

---

## Project Structure

```
haven-ui/
├── package.json                       # pnpm workspace root
├── pnpm-workspace.yaml
├── turbo.json
├── tsconfig.base.json
├── packages/
│   ├── design-system/                 # The authoritative spec — tokens + pattern library HTML
│   │   ├── package.json               # @haven/design-system
│   │   ├── vite.config.ts
│   │   ├── index.html                 # pattern-library browser entry
│   │   ├── src/
│   │   │   ├── styles/
│   │   │   │   ├── main.css           # Entry: imports tokens + haven + components + preline
│   │   │   │   ├── haven.css          # Tailwind theme + Preline token overrides
│   │   │   │   └── tokens/
│   │   │   │       ├── colors.css
│   │   │   │       ├── typography.css
│   │   │   │       ├── spacing.css
│   │   │   │       ├── defaults.css
│   │   │   │       └── components.css # ALL semantic component classes — edit here
│   │   │   ├── partials/              # Shared HTML fragments (pattern-library pages)
│   │   │   ├── scripts/env/           # Data loading, chart config
│   │   │   ├── vendor/fontawesome/    # FA Pro (gitignored)
│   │   │   └── data/                  # Dummy data (Firebase-schema-conformant)
│   │   │       ├── _schema-notes.md
│   │   │       ├── shared/
│   │   │       └── personas/{provider,kitchen,patient,care-coordinator}/
│   │   └── pattern-library/
│   │       ├── COMPONENT-INDEX.md     # Ground truth for built components
│   │       ├── components/            # Component HTML with @component-meta headers
│   │       └── pages/                 # Browsable pattern-library pages
│   └── ui-react/                      # React components mirroring pattern-library 1:1
│       ├── package.json               # @haven/ui-react
│       └── src/
│           ├── index.ts               # Barrel export (populated by ui-react-porter)
│           └── components/            # One file per ported pattern-library entry
├── apps/                              # React + Vite apps per persona
│   ├── care-coordinator/              # port 5174 (@haven/app-care-coordinator)
│   ├── kitchen/                       # port 5175
│   ├── patient/                       # port 5176
│   ├── provider/                      # port 5177
│   │   └── (each has: package.json, vite.config.ts, tsconfig.json, index.html, src/main.tsx, src/App.tsx, design/)
│   └── [app]/design/                  # Planning material: wireframes, use-cases, component-map, validation
├── archive/
│   └── vanilla-html-handoff/          # Historical handoff artifacts (ANDREY-README, composite HTMLs)
├── planning/                          # Product / UX / architecture (imported from Ava)
├── .project-docs/
│   ├── prompts/next-task.md           # Active agent prompt
│   ├── decisions-log.md
│   ├── roadmap.md
│   ├── prompts-library.md
│   ├── cdn-resources.md
│   ├── verification-checklist.md
│   ├── icon-reference.md
│   ├── COMPONENT-REGISTRY.md
│   └── agent-workflow/                # The design-to-build skill pipeline
└── CLAUDE.md
```

---

## File System Rules

### Never edit files in `dist/`

`dist/` is build output only. It is auto-generated and overwritten on every build.

| What you want to change | Edit this file |
|---|---|
| Colors, tokens | `packages/design-system/src/styles/tokens/colors.css` |
| Semantic component classes | `packages/design-system/src/styles/tokens/components.css` |
| Typography | `packages/design-system/src/styles/tokens/typography.css` — fonts: Plus Jakarta Sans (display), Source Sans 3 (body/sans), Source Code Pro (mono). `--font-serif` / Lora no longer exists. |
| Spacing | `packages/design-system/src/styles/tokens/spacing.css` |
| Theme + Preline overrides | `packages/design-system/src/styles/haven.css` |
| Pattern-library HTML (the spec) | `packages/design-system/pattern-library/components/[category]-[name].html` |
| React component (1:1 port of PL entry) | `packages/ui-react/src/components/[Name].tsx` |
| App shell or composition | `apps/[persona]/src/App.tsx` (or child components local to that app) |
| Shared partials (pattern-library pages only) | `packages/design-system/src/partials/*.html` |

### Dev server and verification

- `pnpm dev` at the repo root runs all dev servers in parallel via turbo
- Per-package: `pnpm --filter @haven/design-system dev` (pattern library, port 5173), `pnpm --filter @haven/app-care-coordinator dev` (port 5174), etc.
- Changes to source CSS appear instantly via hot reload — no build step needed
- All Vite servers use `strictPort: true`. If the port is taken, Vite fails loudly rather than drifting.
- When verifying a React component built via `ui-react-porter`, compare visually against the corresponding pattern-library page at `http://localhost:5173/pattern-library/pages/[category]-[name].html`. Parity with the spec is the test.

---

## Architecture: Semantic Classes, Not Utility Soup

**This is the most important rule.**

All styling goes in `packages/design-system/src/styles/tokens/components.css` using `@apply` directives. Pattern-library HTML and React JSX both use clean semantic class names.

```html
<!-- Correct -->
<div class="card">
  <div class="card-header">
    <h2 class="card-title">Title</h2>
  </div>
  <div class="card-body">Content</div>
</div>

<!-- Wrong -->
<div class="flex flex-col bg-white border border-gray-200 shadow-sm rounded-xl">
  <div class="px-4 py-3 border-b border-gray-200">
    <h2 class="text-2xl font-semibold text-gray-800">Title</h2>
  </div>
</div>
```

### Rules

- Use existing semantic classes from `components.css` in HTML and React JSX
- If a semantic class doesn't exist, add it to `packages/design-system/src/styles/tokens/components.css` with `@apply`, then use it
- Layout-only classes (e.g. `grid sm:grid-cols-3`) that apply only to the current template may appear inline — these are not component styling
- **Never** write `style="..."` attributes or `style={{...}}` in React — exception: Chart.js `flex` values on pipeline segments are data-driven and acceptable
- **Never** write `<style>` blocks in HTML files or CSS modules in React components

### Audit before building

Before creating or editing any file:

1. Read `packages/design-system/pattern-library/COMPONENT-INDEX.md` — ground truth for every existing component and its semantic classes
2. Check `packages/design-system/src/styles/tokens/components.css` for any class not yet indexed
3. Check `packages/design-system/src/partials/` for existing pattern-library partials
4. Check `packages/ui-react/src/components/` for existing React ports before porting a component again
5. Only then write or modify files

### Pattern-Library-First Rule

This is mandatory. No exceptions.

**Copy, don't generate.** If a component exists in `packages/design-system/pattern-library/components/`, copy its HTML directly. Every React component in `packages/ui-react/` is a 1:1 mechanical port — same class names, same structure. Never rewrite from memory or regenerate.

**Pattern library before app.** If a component you need does not exist in the index:
1. Create `packages/design-system/pattern-library/components/[category]-[name].html` with a `@component-meta` header
2. Add the semantic classes to `packages/design-system/src/styles/tokens/components.css`
3. Add a row to `packages/design-system/pattern-library/COMPONENT-INDEX.md`
4. Port the pattern-library HTML to React via `ui-react-porter` skill — produces `packages/ui-react/src/components/[Name].tsx`
5. Then and only then use it in an app via `import { Name } from '@haven/ui-react'`

**What goes in the pattern library:**
- Any new semantic class added to `components.css`
- Any component with interactive behavior (accordion, modal, dropdown, tabs)
- Any new partial used by more than one pattern-library page
- Any chart pattern or data visualization variant
- Any form pattern (input group, validation state, etc.)
- Any reusable visual unit that will appear in more than one app

**What stays app-only:**
- Page layout (grid, columns, sidebar composition)
- Composition of existing components into a screen
- Data-driven content wired to dummy data
- App-specific components that are tightly coupled to one persona's workflow

**Task scope declaration.** Every task prompt must declare its scope before building:
- Pattern library only (new component; no app work in this task)
- App only (composing existing patterns; no new components)
- Both (pattern first, then app — run as two sequential prompts)

See `.project-docs/prompts/task-template.md` for the canonical prompt format.

---

## JavaScript / TypeScript Rules

### Where code lives

**Pattern-library HTML pages** at `packages/design-system/pattern-library/` use vanilla JS for Preline initialization and chart config:
- Shared env scripts: `packages/design-system/src/scripts/env/`
- Included via `<script src="...">` in pattern-library HTML pages
- No inline `<script>` blocks in pattern-library HTML

**React apps** at `apps/[persona]/` use TypeScript:
- Entry: `apps/[persona]/src/main.tsx`
- Root component: `apps/[persona]/src/App.tsx`
- App-scoped components: `apps/[persona]/src/components/`
- Shared React components (ports of pattern-library entries): `packages/ui-react/src/components/[Name].tsx`, imported as `import { Name } from '@haven/ui-react'`

### Component interactions

- Preline is initialized in `apps/[persona]/src/main.tsx` via `import 'preline'` as an ES module (not CDN). The `HSStaticMethods.autoInit()` call runs automatically.
- For React-internal interactions that don't map to Preline (e.g., local UI state, form state), use React hooks directly. Keep them in the app or in the React component wrapper — not in the pattern-library HTML.

### No style escape hatches

- No `<style>` blocks in HTML
- No `style={{...}}` in React
- No CSS modules, styled-components, or runtime CSS-in-JS
- Utility classes only for layout (spacing, grid, flex positioning not covered by a semantic class)

---

## Framework Usage

### Tailwind CSS v4 (CSS-first)

- Use `@import "tailwindcss";` — no `tailwind.config.js`
- Design tokens use `@theme` directive in `packages/design-system/src/styles/tokens/colors.css`
- Semantic classes use `@apply` in `packages/design-system/src/styles/tokens/components.css`
- Do not create `tailwind.config.js`

**CRITICAL — Tailwind @theme cascade trap:**
Tailwind's `@layer theme` overwrites any `@theme` variable whose name Tailwind owns
(`--color-teal-*`, `--color-gray-*`, `--color-neutral-*`, `--color-blue-*`, etc.) with its own
OKLCH values, regardless of source order. Always use **hex literals** for those variables
inside `@theme`. Custom names (`--color-sand-*`, `--color-warm-*`) survive untouched.
See decisions-log.md → "Cena Health Brand Theme Merge" for full context.

### Preline UI

- Used for interactive behavior (dropdowns, accordions, modals, overlays)
- Pattern-library pages: Preline JS loaded via `packages/design-system/src/scripts/main.js` (`import 'preline'`) as a Vite module
- React apps: Preline imported in `apps/[persona]/src/main.tsx` as `import 'preline'`; `HSStaticMethods.autoInit()` runs automatically on mount
- Never add a CDN script tag for Preline
- Use Preline's `data-hs-*` attributes for JS behavior
- Apply Haven semantic classes instead of Preline's utility-heavy markup patterns
- A single accordion does not need `hs-accordion-group` wrapper
- Apply `.hs-accordion-toggle` to toggle buttons to neutralize Preline's hover background

**CRITICAL — Dropdown markup (Preline v4 behavior differs from docs):**

Preline v4 uses FloatingUI for positioning. When a dropdown opens, it removes `hidden` from the menu, adds `block`, and applies `position: fixed` inline. It does NOT add `hs-dropdown-open` to the wrapper. The `hs-dropdown-open:*` Tailwind variants shown in Preline docs are inert in our setup.

Use this exact pattern — no extras:
```html
<div class="hs-dropdown relative inline-flex">
  <button type="button" class="hs-dropdown-toggle btn-outline">
    Label <i class="fa-solid fa-chevron-down text-xs"></i>
  </button>
  <div class="hs-dropdown-menu" role="menu">
    <a class="hs-dropdown-item" href="#">Option</a>
  </div>
</div>
```

Do NOT add `transition-[opacity,margin] hs-dropdown-open:opacity-100 opacity-0 hidden` to the menu -- these are inert/harmful. Visibility is controlled entirely by `components.css`:

```css
.hs-dropdown-menu          { display: none; opacity: 0; }   /* hidden by default */
.hs-dropdown-menu.block    { display: block; opacity: 1; }  /* Preline adds 'block' when open */
```

The `display: none` default is required to prevent the menu from occupying layout space before Preline initializes. Without it, the menu renders as an invisible ghost box on page load.

### Icons

- **FontAwesome Pro v7.1.0** — local copy at `packages/design-system/src/vendor/fontawesome/` (gitignored; drop in place per setup)
- HTML: `<i class="fa-solid fa-[icon-name]"></i>`
- React: same — use `<i className="fa-solid fa-[icon-name]" />` in JSX
- Pro styles available: solid, regular, light, thin, duotone, sharp variants
- Never use Material Icons, Heroicons, emoji as icons, or any other icon library
- Never reference the FA CDN — always use the local copy

### Charts

- **Chart.js v4** via CDN only — no npm-installed chart libraries
- Every chart page must include `packages/design-system/src/partials/scripts-charts.html` after base scripts
- In React apps, use Chart.js via a thin wrapper component in `packages/ui-react/src/components/` — same approach: 1:1 port of the pattern-library chart entry
- Never write raw Chart.js config without using Haven defaults from `haven-chart-config.js`
- Always use `HAVEN.*` constants for colors — never hardcode hex values
- **Never use pie or donut charts.** Use stat cards, bar charts, or numeric comparisons. This is a firm design principle (Tufte).

---

## Data Rules

- All dummy data lives in `packages/design-system/src/data/`
- Data files are markdown (`.md`) formatted to reflect Firebase schema shapes
- Any delta from Firebase schema must be documented in `packages/design-system/src/data/_schema-notes.md` before building pages or components that depend on that data
- React apps consume data via `import` from `@haven/design-system/data/...`

---

## Documentation

- **Tailwind:** https://tailwindcss.com/docs
- **Preline:** https://preline.co/docs/index.html
- **Chart.js:** https://www.chartjs.org/docs/latest/

---

## References

**CDN versions:** See [.project-docs/cdn-resources.md] — pinned versions for Chart.js, Leaflet, FontAwesome.
**Build verification:** Run the checklist in [.project-docs/verification-checklist.md] after every task.
**Icon mapping:** See [.project-docs/icon-reference.md] — concept-to-icon-name table for FontAwesome.

---

## Slash Commands

| Command | What it does |
|---|---|
| `/build` | Executes `.project-docs/prompts/next-task.md`, then runs QA sub-agent |
| `/pl-build` | Builds next `missing` component from `COMPONENT-REGISTRY.md`, runs QA, marks `built` |
| `/brand-review` | Reviews next `built` component against Cena brand spec, produces proposals for Aaron |

Command files live in `.claude/commands/`. Skill files live in `.project-docs/agent-workflow/skills/`.

## Component Registry

`.project-docs/COMPONENT-REGISTRY.md` is the authoritative list of every component
that must exist in the pattern library. It has a Status column (`missing` / `in-progress` /
`built` / `brand-reviewed`). The `/pl-build` command uses this file to drive systematic
build sprints without requiring manual diffing or multiple requests.

**Never mark a component `built` until:**
1. `pattern-library/components/{name}.html` exists with `@component-meta`
2. Classes are in `src/styles/tokens/components.css`
3. `COMPONENT-INDEX.md` row is updated
4. QA checklist in `haven-pl-qa.md` passes

## Planning docs (imported from Ava, 2026-04-18)

`planning/` holds the product, UX, and architecture planning for the human-facing
apps that integrate with the Ava agent: UI patterns, journeys, roles, workflows,
and the experts (ux-design-lead, design-system-steward, frontend-architecture,
accessibility, compliance, patient-ops, etc.) that shape requirements and review.

Read `planning/README.md` for the full import manifest and what was intentionally
left in the Ava repo. When starting any new feature, consult the relevant
`planning/journeys/`, `planning/roles/`, and `planning/experts/` files before
jumping to wireframes.

## UX Design & Build Workflow

A full design-to-build pipeline lives in `.project-docs/agent-workflow/`.
Read `.project-docs/agent-workflow/README.md` for an overview.

**When to use it:** Any time Aaron describes a new feature, screen, or application
to design and build. Also for redesigns of existing screens.

**Pipeline:**
ux-architect → ux-wireframe → ux-design-review (pre-build) → haven-mapper →
dev-tasker → [build] → ux-design-review (post-build) → debrief-capture

**To invoke a skill:** Read the skill file from
`.project-docs/agent-workflow/skills/[skill-name].md`, follow its instructions,
produce its specified outputs.

**Design artifacts live in:** `apps/[persona]/design/`

**Gates:** Pause and present a structured summary to Aaron after:
1. ux-architect completes (Gate 1: scope + IA)
2. ux-wireframe + ux-design-review pre-build complete (Gate 2: wireframes + copy)
3. dev-tasker completes (Gate 3: build plan)

**Constraints Lookup (mandatory before writing any build prompt):**
Read `.project-docs/decisions-log.md`. Extract every entry with a
"Rule to follow in future prompts" line. Apply relevant rules to each prompt
under a "Known Constraints" heading.
