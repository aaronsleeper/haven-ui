# haven-ui — Agent Rules

## ⚠️ Scope change in progress (2026-04-18)

haven-ui is pivoting from "vanilla HTML + CSS delivered to Andrey for Angular translation" to a React monorepo that owns the full frontend. Decisions locked: AD-08 (React 19 + Vite), AD-09 (Turborepo + pnpm workspaces). See `planning/decisions.md` and `planning/team/proposals/stack-recommendations.md`.

**What this means for agents working here right now:**

- The restructure (Commit B in the rollout plan at `~/.claude/plans/haven-ui-stack-and-workflow-consult.md`) has not landed yet. Until it does, this file's existing conventions still describe the current tree — vanilla HTML + Tailwind 4 + Preline, single-app Vite, pattern-library-first discipline.
- The ANDREY-README.md handoff mandate (below) is superseded. ANDREY-README will move to archive in Commit B. Do not update it in new work.
- The "No React, Vue, Angular" ban in the Framework Usage section is superseded — React is now the target, not a prohibited tool. But until the monorepo restructure lands, new React code has no home; wait for the scaffold.
- **Load-bearing rules that survive the transition:** pattern-library-first ("copy, don't generate"), semantic classes in `components.css`, `@apply` over utility soup, COMPONENT-INDEX.md as ground truth, scope declaration ("PL only / app only / both") per task. Every React component built after Commit B will be a 1:1 mechanical port of its pattern-library HTML entry.

The rest of this file describes the current state. Treat it as authoritative for vanilla work and informational for planning the React migration.

---

Read the full task before taking any action. Complete it fully before stopping.

When done:
1. List every file modified and every new semantic class added to `components.css`
2. Update `ANDREY-README.md` if any component, screen, nav, or JS changed (see ANDREY-README section)
3. Run the following git commands from the repo root:
   ```
   git add -A
   git commit -m "[brief description of what was built]"
   ```
4. Output the local server URL so Aaron can review:
   - If `npm run dev` is already running: http://localhost:5173/[path/to/primary/file.html]
   - If not running: instruct Aaron to run `npm run dev` from the repo root, then visit the URL

Do not proceed to the next task — wait for review.

---

## Project Structure

haven-ui is the design system and UI prototype layer for Cena Health.
It produces static HTML/CSS that is the primary handoff format to Andrey for Angular integration.

```
haven-ui/
├── src/
│   ├── styles/
│   │   ├── main.css              # Entry: imports tokens + haven + components + preline
│   │   ├── haven.css             # Tailwind theme + Preline token overrides
│   │   └── tokens/
│   │       ├── colors.css        # All color tokens (@theme)
│   │       ├── typography.css    # Fonts, sizes, heading/body defaults
│   │       ├── spacing.css       # Spacing scalar
│   │       ├── defaults.css      # Form element defaults, shadows, surface vars
│   │       └── components.css    # ALL semantic component classes — edit here
│   ├── partials/                 # Shared HTML fragments (head, scripts, etc.)
│   ├── scripts/
│   │   ├── env/                  # Environment functions: data loading, chart config
│   │   └── components/           # Component-scoped interaction JS
│   └── data/                     # Dummy data as markdown (Firebase-schema-conformant)
│       ├── _schema-notes.md      # Delta log: deviations from Firebase schema
│       ├── shared/
│       └── personas/
│           ├── provider/
│           ├── kitchen/
│           ├── patient/
│           └── care-coordinator/
├── apps/
│   ├── provider/
│   ├── kitchen/
│   ├── patient/
│   ├── care-coordinator/
│   └── _prototypes/              # Exploratory work not tied to a persona
├── pattern-library/
├── dist/                         # Build output — NEVER edit directly
├── .project-docs/
│   ├── prompts/next-task.md      # Active agent prompt
│   ├── decisions-log.md
│   ├── roadmap.md
│   ├── prompts-library.md
│   ├── cdn-resources.md          # Pinned CDN/asset versions
│   ├── verification-checklist.md # Post-task QA checklist
│   └── icon-reference.md         # FontAwesome icon mapping
├── CLAUDE.md
├── vite.config.js
└── package.json
```

---

## File System Rules

### Never edit files in `dist/`

`dist/` is build output only. It is auto-generated and overwritten on every build.

| What you want to change | Edit this file |
|---|---|
| Colors, tokens | `src/styles/tokens/colors.css` |
| Semantic component classes | `src/styles/tokens/components.css` |
| Typography | `src/styles/tokens/typography.css` — fonts: Plus Jakarta Sans (display), Source Sans 3 (body/sans), Source Code Pro (mono). `--font-serif` / Lora no longer exists. |
| Spacing | `src/styles/tokens/spacing.css` |
| Theme + Preline overrides | `src/styles/haven.css` |
| Page HTML | `apps/[persona]/**/*.html` |
| Shared partials | `src/partials/*.html` |

### Dev server and verification

- `npm run dev` runs Vite on `http://localhost:5173`, watching source files directly
- Changes to source CSS appear instantly via hot reload — no build step needed
- `npm run build` is only needed for Angular handoff, not for visual verification
- **Always verify at `http://localhost:5173` — not any other port.**
  `vite.config.js` uses `strictPort: true`. If 5173 is taken, Vite will fail loudly.

---

## Architecture: Semantic Classes, Not Utility Soup

**This is the most important rule.**

All styling goes in `src/styles/tokens/components.css` using `@apply` directives.
HTML files use clean semantic class names.

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

- Use existing semantic classes from `components.css` in HTML
- If a semantic class doesn't exist, add it to `components.css` with `@apply`, then use it in HTML
- Layout-only classes (e.g. `grid sm:grid-cols-3`) that apply only to the current template
  may appear in HTML — these are not component styling
- **Never** write `style="..."` attributes — exception: Chart.js `flex` values on pipeline
  segments (e.g., `style="flex: 65"`) are data-driven and acceptable
- **Never** write `<style>` blocks in HTML files

### Audit before building

Before creating or editing any file:

1. Read `pattern-library/COMPONENT-INDEX.md` — this is the ground truth for every existing component and its semantic classes
2. Check `src/styles/tokens/components.css` for any class not yet indexed
3. Check `src/partials/` for existing partials
4. Only then write or modify files

### Pattern-Library-First Rule

This is mandatory. No exceptions.

**Copy, don't generate.** If a component exists in `pattern-library/components/`, copy its HTML directly into the app page. Do not rewrite it from memory or regenerate it.

**Pattern library before app.** If a component you need does not exist in the index:
1. Create `pattern-library/components/[category]-[name].html` with a `@component-meta` header
2. Add the semantic classes to `src/styles/tokens/components.css`
3. Add a row to `pattern-library/COMPONENT-INDEX.md`
4. Then and only then use it in an app page

**What goes in the pattern library:**
- Any new semantic class added to `components.css`
- Any component with interactive behavior (accordion, modal, dropdown, tabs)
- Any new partial added to `src/partials/`
- Any chart pattern or data visualization variant
- Any form pattern (input group, validation state, etc.)
- Any reusable visual unit that will appear in more than one app

**What stays app-only:**
- Page layout (grid, columns, sidebar composition)
- Composition of existing components into a screen
- Data-driven content wired to dummy data
- App-specific partials that are tightly coupled to one persona's workflow

**Task scope declaration.** Every task prompt must declare its scope before building:
- Pattern library only (new component; no app work in this task)
- App only (composing existing patterns; no new components)
- Both (pattern first, then app — run as two sequential prompts)

See `.project-docs/prompts/task-template.md` for the canonical prompt format.

---

## JavaScript Rules

### Two categories of JS — each with a fixed location

**1. Environment functions** (data loading, chart config, utilities)
- Location: `src/scripts/env/`
- These are shared across the entire repo
- Reference them from HTML via `<script src="/src/scripts/env/[file].js"></script>`
- Or include via a partial (e.g., `src/partials/scripts-charts.html`)

**2. Component interaction JS** (accordion toggle, modal open/close, etc.)
- Location: `src/scripts/components/[component-name].js`
- Scoped to the component it serves
- Referenced from the HTML page that uses the component

### Inline script ban

- **No inline `<script>` blocks in HTML files**
- All JS must be in external files and referenced via `<script src="...">` tags
- Page scripts go at the bottom of `<body>`, before `</body>`, after partials

---

## Framework Usage

### Tailwind CSS v4 (CSS-first)

- Use `@import "tailwindcss";` — no `tailwind.config.js`
- Design tokens use `@theme` directive in `src/styles/tokens/colors.css`
- Semantic classes use `@apply` in `src/styles/tokens/components.css`
- Do not create `tailwind.config.js`

**CRITICAL — Tailwind @theme cascade trap:**
Tailwind's `@layer theme` overwrites any `@theme` variable whose name Tailwind owns
(`--color-teal-*`, `--color-gray-*`, `--color-neutral-*`, `--color-blue-*`, etc.) with its own
OKLCH values, regardless of source order. Always use **hex literals** for those variables
inside `@theme`. Custom names (`--color-sand-*`, `--color-warm-*`) survive untouched.
See decisions-log.md → "Cena Health Brand Theme Merge" for full context.

### Preline UI

- Used for interactive behavior (dropdowns, accordions, modals, overlays)
- Preline JS is loaded via `src/scripts/main.js` (`import 'preline'`) as a Vite module — never add a CDN script tag for Preline
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

- **FontAwesome Pro v7.1.0** — local copy at `src/vendor/fontawesome/`
- Usage: `<i class="fa-solid fa-[icon-name]"></i>`
- Pro styles available: solid, regular, light, thin, duotone, sharp variants
- Never use Material Icons, Heroicons, emoji as icons, or any other icon library
- Never reference the FA CDN — always use the local copy

### Charts

- **Chart.js v4** via CDN only — no npm-installed chart libraries
- Every chart page must include `src/partials/scripts-charts.html` after base scripts
- Never write raw Chart.js config without using Haven defaults from `haven-chart-config.js`
- Always use `HAVEN.*` constants for colors — never hardcode hex values
- **Never use pie or donut charts.** Use stat cards, bar charts, or numeric comparisons.
  This is a firm design principle (Tufte).

### No frameworks in HTML output

- No React, Vue, Angular, or any npm-installed JS framework in HTML files
- No `localStorage` or `sessionStorage`
- Pure HTML / CSS / vanilla JS only
- Angular integration is Andrey's responsibility — deliver clean HTML/CSS

---

## Data Rules

- All dummy data lives in `src/data/`
- Data files are markdown (`.md`) formatted to reflect Firebase schema shapes
- Any delta from Firebase schema must be documented in `src/data/_schema-notes.md`
  before building pages that depend on that data

---

## ANDREY-README.md

`ANDREY-README.md` is the Angular integration handoff document. It must stay in sync with every commit.

**Update ANDREY-README.md in the same commit whenever any of these change:**
- New screens added → add to the Patient App Screen Index table
- New semantic classes or components → add HTML structure + class table
- Existing component HTML structure changed → update the relevant section
- Class names renamed or removed → update all references
- New JS files that Andrey needs to know about → document the script and its purpose
- Navigation changes (tabs added/removed, routing) → update nav section
- New URL parameters or state conventions → document them

**Do not defer this to a separate task.** ANDREY-README updates are part of the same commit as the code change. If you forget, the next agent to read the file will work from stale documentation.

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
