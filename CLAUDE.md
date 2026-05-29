# haven-ui — Agent Rules

haven-ui is the Cena Health **design system**, framework-agnostic at the pattern-library layer. The pattern library — HTML in `packages/design-system/pattern-library/` plus tokens in `packages/design-system/src/styles/tokens/` — is the spec. Framework ports mirror that spec 1:1; today the only port is the React monorepo here under `packages/ui-react/` and `apps/*/`. Future ports (Angular is plausible) would consume the same pattern-library spec.

The React port has its own architectural decisions (AD-08 React 19 + Vite, AD-09 Turborepo + pnpm — see `planning/decisions.md`). These are React-port decisions, not pattern-library decisions.

**Stack reality (2026-05):** Cena's existing production apps are Angular and **don't yet consume haven-ui**. Andrey (Cena's technical lead) has not signed off on React as Cena's frontend stack. Do not state framework decisions externally without Andrey's alignment — "React is our stack" is forbidden phrasing until that conversation lands.

**Load-bearing rules:** pattern-library-first ("copy, don't generate"), semantic classes in `components.css`, `@apply` over utility soup, `pattern-library/COMPONENT-INDEX.md` as ground truth, scope declaration per task. Every React component in `packages/ui-react/` is a 1:1 mechanical port of its pattern-library HTML entry (see `.project-docs/agent-workflow/skills/ui-react-porter.md`).

**Design system spec:** [DESIGN.md](./DESIGN.md) at repo root, plus the pattern-library HTML and CSS tokens, is the canonical source of truth for haven-ui. Vault docs (`Vaults/Knowledge/Projects/Cena Health/`) are the canonical companion docs; Figma is no longer the upstream source. Measurement tokens stay on haven-ui's 4px Tailwind scalar.

The handoff-to-Andrey model has been retired. The vanilla HTML composites from that era live at `archive/vanilla-html-handoff/` for reference only; do not modify them.

## Watch for these drifts

The React port silently becomes the canonical X. This is **structural** drift, not one-off — multiple manifestations have been observed across 2026, and the surrounding context (filenames, code samples, this very repo's prominence) pulls in this direction every time. Resist explicitly.

- **Consumption surface drift** — phrasing like "apps import from `@haven/ui-react`" treats the React port as the only consumption path. Default phrasing: "apps consume compounds via their framework's haven-ui port." When writing about consumer apps in general, name the port; when writing about the existing React port specifically, name it as "the React port" or `packages/ui-react/`, not as the canonical haven-ui consumption surface.
- **Status-taxonomy drift** — gating "exists" or "built" on `.tsx` file presence (in coverage docs, status reports, registry tables) silently makes the React port canonical. Use PL-HTML presence as the spec-level "exists" check; React-port presence is "is the React port up to date." (Source incident: 2026-05-07 gap-doc treated `exists` as ui-react-port readiness; corrected to PL-HTML-only.)
- **Vocabulary drift** — TypeScript discriminated unions, Storybook stories, and `registry.json` are React-port-specific artifacts. Variant *vocabulary* lives in CSS modifier classes at the pattern-library layer. Don't conflate "the variant set" with "the discriminated-union members."
- **Stack-decision drift** — referring to "haven-ui's stack" or "haven-ui is a React monorepo" collapses pattern-library + port into a single React-shaped thing. The pattern library has no stack; the React port has React; future ports will have their own. **Carve-out (2026-05-28, per Angular-emit proving slice Review trail #6):** framework-port pattern catalogs ARE design-system content and live as siblings under the haven-ui package roof — e.g., `packages/angular-patterns/` (`@cena/catalog-ui`) alongside `packages/design-system/` and `packages/ui-react/`. Co-location is the egalitarian structure this rule protects, not a violation of it. The rule's target is preventing the React port from canonicalizing haven-ui ("haven-ui IS React"), not excluding framework-port catalogs from `packages/`. A future React-port pattern catalog (`packages/react-patterns/`?) would live the same way.

**Why drift recurs:** the React port is the only port that exists today, so concrete examples and surrounding context dominate. Project memory and opening framing are not enough on their own — the pull comes from context, not from missing information. When classifying or characterizing something on a dimension where the React port could silently become canonical, name the suspicion explicitly and check before committing to the framing.

**Generalize the resistance:** any future dimension (data model, state management, testing strategy, accessibility patterns) where someone describes "haven-ui does X" must distinguish between the pattern-library layer and the React-port layer. The pattern library doesn't have a state-management library; the React port might.

(Recurring-drift fix per Vault feedback memory `feedback_no_haven_ui_react_conflation.md`; flagged in retro 2026-05-07.)

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
   - App dev servers: `pnpm --filter @haven/app-care-coordinator dev` (5174), `@haven/app-patient` (5176)
   - Archived apps (not in `apps/*`): kitchen + provider live in `archive/inactive-apps/` as of 2026-04-23 — restore when scheduled.
   - All at once: `pnpm dev` (turbo runs every dev script in parallel)

Do not proceed to the next task — wait for review.

---

## One-time local setup

After cloning haven-ui, run once:

```
git config core.hooksPath .githooks
```

This wires the tracked `.githooks/pre-push` hook that runs `pnpm typecheck` + `pnpm --filter @haven/ui-react conform:fast` before every `git push`. Without it, `git push` uses the default `.git/hooks/` (empty), and broken gates will only be caught by CI — one failure email per push per remote. The hook skips `conform:token` and `conform:visual` (Playwright, slow); run `pnpm --filter @haven/ui-react conform` manually before opening a PR for the full umbrella.

Bypass is available via `git push --no-verify`. Use it only for genuine emergencies, not as a habit.

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
├── apps/                              # React + Vite apps per persona (active only)
│   ├── care-coordinator/              # port 5174 (@haven/app-care-coordinator)
│   ├── patient/                       # port 5176
│   │   └── (each has: package.json, vite.config.ts, tsconfig.json, index.html, src/main.tsx, src/App.tsx, design/)
│   └── [app]/design/                  # Planning material: wireframes, use-cases, component-map, validation
├── archive/
│   ├── inactive-apps/                 # Archived persona apps (kitchen, provider — 2026-04-23). README inside has restoration steps.
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
| Typography | `packages/design-system/src/styles/tokens/typography.css` | Canonical fonts (per Cena brand spec, directive 2026-04-27): **Lora** (headings/display), **Source Sans 3** (body/UI), **Source Code Pro** (code). Full type scale and font-feature defaults in [DESIGN.md §Typography](./DESIGN.md#typography). |
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

### Brand fonts per app

Every new React app under `apps/*` MUST link the canonical Haven font stack (Lora + Source Sans 3 + Source Code Pro) in its `index.html` — see `apps/patient/index.html` for the exact block, or copy from `packages/design-system/src/partials/head.html`.

This is not optional styling. `base/font-features.css` sets a rich OpenType feature set on `body` (ss01/ss03/ss04, dlig, frac, etc.) tuned for Source Sans 3. If an app forgets the `<link>`, the browser falls back to system fonts (Times, Helvetica), and the feature codes map to unrelated glyphs in those fonts — often superscripts or small caps — so body text renders as unreadable. The Patient + Care-Coordinator apps shipped multiple slices in this broken state before Aaron caught it visually (Patch 75, 2026-04-23).

`conform:brand-fonts` is in the blocking-on-patch set and will refuse the commit if any active `apps/*/index.html` is missing the font links or is missing one of the three families.

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

### Slice authoring — wireframe-driven, PL-first

Every slice begins with a **wireframe-vs-PL delta review** — the one ceremony step between expert-authored wireframes and build. Compare each component flagged in the wireframe against `pattern-library/COMPONENT-INDEX.md`. Decompose: a wireframe name like `thread-approval-card` may already be expressible as existing primitives. Three buckets per item:

1. **Exists in PL** — copy the HTML; if a ui-react port is missing, port it (Tier 1, mechanical).
2. **Novel composition (recurring shape)** — composition of existing primitives that appears across ≥2 wireframes with the same shape. Promote to PL as a composition entry (Tier 1).
3. **Novel primitive** — no PL equivalent and no decomposition path. Promote to PL as a new primitive (Tier 1, full ceremony including 4-expert panel for brand-fidelity-weighted entries).

PL-first is the default. The output of the delta review is a build plan that names which work falls into each bucket.

| Tier | When | Ceremony |
|---|---|---|
| **Primitive (Tier 1)** | Delta requires a new PL fragment OR an existing PL fragment that has not yet been ported to ui-react | PL HTML → components.css → COMPONENT-INDEX → ui-react port (via `ui-react-porter` skill) → `registry.json` + variant-matrix stories → 4-expert panel for brand-fidelity-weighted entries; mechanical 1:1 ports skip the panel. All blocking-on-patch gates per patch. |
| **Slice composition (Tier 2)** | App composes ui-react primitives already in `packages/ui-react/`; delta review found zero PL gaps | Compose in `apps/*`. Skip: PL fragment authoring, ui-react porting, expert panel. Keep: typecheck + blocking-on-patch gate set. |
| **Bug fix / polish (Tier 3)** | Behavior or styling fix in shipped code | Patch the file; run typecheck + the gates whose scope was touched. |

Declare the tier at the top of any task prompt larger than a single edit.

#### Narrow inline carve-out

Some compositions belong inline in app code, not in the PL. The carve-out is narrow:

- **Wireframe-flagged as app-specific.** The expert who authored the wireframe explicitly marked the component as not-yet-promotable (single use, app-specific shape).
- **Composition shape is materially simpler than any existing PL alternative.** Example: cc-02's thread-input is a `<textarea>` + `<IconButton>` — the existing `prompt-input-container` is a richer shape that doesn't fit. Compose inline; promote when a second app needs the same simpler shape.

Default is still PL-first. The carve-out is the exception, not the on-ramp. "Promote on second use" is the trigger for *graduating an inline carve-out into the PL*, not the default decision for new wireframe components. The TaskCard port (Patch 67) was promoted because a second consumer was anticipated; the prototype score line on Complete (Patches 71–72) was correct to leave inline.

#### Gate triage

Not all 14 conform gates need to run on every patch.

- **Blocking on patch (always):** `typecheck`, `conform:manifest`, `conform:app-shell`, `conform:plain-language`, `conform:css-family`, `conform:brand-fonts`, `conform:wireframe-shell`
- **Blocking on merge:** `conform:surface-role`, `conform:contrast-pairs`, `conform:wireframe-completeness`, `conform:font-features`, `conform:button-font-size`, `conform:radius-pill`
- **Local-only / informational:** `conform:token`, `conform:visual` (Playwright; no CI enforcement yet)

The "blocking on patch" set catches what breaks the build or violates authoring discipline. The "blocking on merge" set catches drift that's safe to accumulate during iteration but unsafe to ship. Run the full umbrella `pnpm conform` before opening a PR.

`conform:wireframe-shell` runs in strict mode (Phase 4 flipped 2026-05-07): every wireframe under `apps/*/design/wireframes/` MUST declare `shells:` in YAML frontmatter. The gate halts on missing field, stale `pl_shell_version` (canon drift), unregistered shell name, or shape errors. To get current canon for a shell, run `pnpm --filter @haven/ui-react shell-canon` (add `--json` for scripted use, `--audit` for the declared/undeclared count). Authoring contract:

```yaml
---
shells:
  - name: agentic-shell
    pl_shell_version: sha256:95bb370a7ae1ca4187ca461ef613ccc798089036498f8db13abeaf6cdbadd80c
---
```

Three valid shapes:
- `shells: [{name, pl_shell_version}, ...]` — full screen composing inside one or more registered shells; gate validates each entry against current canon
- `shells: []` — fragment-spec (component-only, not a full screen); gate skips silently
- `shells:` field absent → gate halts with `missing 'shells:' declaration`

The gate enforces *"I saw this canon,"* not *"I reconciled my composition against this canon."* Always run the haven-mapper wireframe-vs-PL delta review before stamping a new hash; the gate records observation, the delta review records reconciliation. Don't skip reconciliation just because the hash matches.

#### Investigation discipline

Before patching a bug, name the *system* causing it, not the symptom. Patches that fix symptoms without naming root cause invite repeated round-trips (cf. Patches 70/71/72 — three patches for one OpenType-feature scoping bug because the first two addressed visible symptoms).

For dev-only bugs (StrictMode flash, HMR cache, dev-only race), label them as such in the commit message — don't burn cycles checking prod.

### Pattern-library vs Storybook — boundary + drift protection

These are NOT duplicative. They sit on opposite sides of the spec → port line.

| | Pattern-library | Storybook |
|---|---|---|
| **Role** | Spec / ground truth. What a component *should* look like. | Test harness + visual-regression target. React ports running. |
| **Tech** | HTML + semantic CSS classes (vanilla) | React components rendering in isolation |
| **Served at** | `pnpm --filter @haven/design-system dev` → http://localhost:5173 | `pnpm --filter @haven/ui-react storybook` |
| **When to edit** | Design decisions, new classes, new components | Derivative — mirrors pattern-library entries 1:1 |
| **Audience** | Designers, brand reviewers, new agents figuring out what exists | `conform:visual` Playwright gate; React devs verifying port parity |
| **Authoring authority** | Canonical. If they diverge, pattern-library wins. | Follows pattern-library. Edits here are ports, not design. |

**When to use which:**
- Copying HTML for a new component → pattern-library
- Reviewing a brand-fidelity or design decision → pattern-library
- Running `conform:visual` screenshot-diff → Storybook (Playwright)
- Verifying a React port renders identically to spec → compare Storybook output to pattern-library page

**Drift protections between pattern-library and React ports:**

| Protection | Scope | Status |
|---|---|---|
| `ui-react-porter` skill | Enforces 1:1 mechanical port from pattern-library HTML → React JSX | Active |
| `conform:manifest` | `registry.json` consistency check — every registered component declares its pattern-library source + stories | Active (pilot scope) |
| `conform:css-family` | Tailwind-family drift in pattern-library HTML + React JSX (extended Patch 10) | Active (pilot scope) |
| `conform:token` | Token divergence at runtime — Playwright renders stories, reads computed styles, asserts against registered token set | Active (pilot scope) |
| `conform:visual` | Pixel-level divergence — Playwright screenshots React stories, diffs against committed baselines | Local-only; CI pending item 8b Playwright bootstrap |
| Variant-matrix story coverage | 9 stories mirror pattern-library variant exemplars; `registry.json` `stories` arrays enforce presence (Patch 7) | Active |
| COMPONENT-INDEX.md + COMPONENT-REGISTRY.md | Human-readable ground-truth lists; every PL component indexed; every target component tracked by status | Active (manual) |

**The gap today (April 2026):** `conform:visual` runs locally but has no CI enforcement until item 8b lands the Playwright bootstrap. Visual drift between pattern-library HTML and React port could slip through PR review until CI is wired. Until then, drift protection leans on the `ui-react-porter` skill's mechanical discipline + `conform:css-family` + `conform:token` structural coverage + variant-matrix Storybook baselines.

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

### Vanilla JS per primitive — framework-agnostic behavior ships with the PL

For PL primitives with `interactive-usage: required` that encode **non-trivial design decisions** in behavior (debouncing, focus management, bounds/disabled-state logic, drag/resize, focus trap, keyboard-handling beyond native button clicks), ship a tightly-scoped vanilla ES module alongside the HTML/CSS. The JS makes the primitive drop-in usable by any consumer (Angular, React, vanilla) — they import the file unchanged, or port the contract to their framework's idioms. Either path beats from-scratch.

- **Location:** `packages/design-system/src/scripts/components/{name}.js` (matches the panel-splitter precedent)
- **Shape:** IIFE that runs on script load; `document.querySelectorAll('[data-{name}]')` to find instances; attach behavior via data attributes (no class-name coupling)
- **Events:** dispatch bubbling `CustomEvent`s on the host element with a `detail` object describing the state change. Document the event name + detail shape in the `@component-meta` `notes:` block.
- **Programmatic API:** expose a non-enumerable property on the host element (e.g., `el._{primitiveName}`) with read/write methods for state-controlled consumers.
- **A11y:** if the primitive needs live-region announcements, JS owns the debounce — never rely on raw `aria-live` for rapid state changes (chatty-announcement a11y failure).
- **Wiring:** each PL page that consumes the primitive `<script src="/src/scripts/components/{name}.js"></script>` after the partials. No auto-import in `main.js` (per the panel-splitter convention — keeps the bundle lean).
- **Document the contract** in the component's `@component-meta` `notes:` block: usage example, attributes, events, programmatic API, a11y behavior. Andrey (or any consumer) reads the contract and either uses or ports.

**When NOT to ship JS:** trivial native interactions (a button that runs a consumer-supplied handler, a link that navigates). Those don't encode design decisions — they're ceremony in code form.

Existing examples following this convention: `panel-splitter.js`, `quantity-stepper.js`.

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

## Per-slice QA — 4-expert review panel

Required for **Tier 1 (Primitive)** work that authors new PL fragments or composes brand-fidelity-weighted ports. Mechanical 1:1 ports of already-approved PL fragments skip the panel — review happened at the PL-fragment level. Tier 2 (Slice composition) and Tier 3 (Bug fix / polish) skip the panel by default. See [Slice authoring — wireframe-driven, PL-first](#slice-authoring--wireframe-driven-pl-first).

When required, the slice passes through a 4-reviewer panel before merge. Each reviewer ships a structured verdict (`ship` / `iterate` / `block`):

1. **Pattern-library steward** ([planning/experts/design-system-steward/](./planning/experts/design-system-steward/)) — token discipline, no utility soup, component reuse
2. **Information architecture** ([planning/experts/ux-design-lead/](./planning/experts/ux-design-lead/)) — structure, handoff, gates
3. **Accessibility** ([planning/experts/accessibility/](./planning/experts/accessibility/)) — WCAG 2.1 AA floor + focus management
4. **Brand fidelity** ([planning/experts/brand-fidelity/](./planning/experts/brand-fidelity/)) — "does this feel like Haven" — voice, hierarchy, typography, primary-teal discipline, Ava identity

All four must pass (or produce iterate-then-ship) before a slice ships.

### Slice-opening checklist

Before starting a new slice or retrofit:

- [ ] Read the wireframe(s) for the slice in `apps/[persona]/design/wireframes/`
- [ ] Read [DESIGN.md](./DESIGN.md)
- [ ] Load relevant Figma frames via MCP if visual reference helps (`mcp__claude_ai_Figma__get_design_context` / `get_variable_defs` / `get_screenshot`)
- [ ] **Confirm the wireframe declares `shells:` frontmatter** with current canon. Run `pnpm --filter @haven/ui-react shell-canon` and compare each wireframe's `pl_shell_version` against current; if stale, re-run the haven-mapper delta review against the new canon BEFORE stamping the new hash. The gate enforces "I saw this canon"; the delta review enforces "I reconciled my composition against this canon" — don't skip the second one because the hash update is mechanical.
- [ ] **Run the wireframe-vs-PL delta review** against `pattern-library/COMPONENT-INDEX.md`. Decompose every wireframe-flagged component into primitives. Categorize each as exists-in-PL / novel-composition / novel-primitive.
- [ ] Declare the tier per the delta outcome (Primitive / Slice composition / Bug fix)
- [ ] If Tier 1 with brand-fidelity-weighted authoring: plan the 4-expert review panel dispatch before shipping
- [ ] Document the delta and tier decision in the slice plan (or task prompt)

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

> [!warning] The canonical UI pipeline is **vault-level, NOT this repo's `.project-docs/agent-workflow/`.**
> For ANY UI design/build engagement (new feature, screen, app, or redesign), run **`workflows/ui-development/`** — 34 role-shaped slots (brief → discovery → design → build → verify → release → retro), two work modes (deciding/applying), re-entry from any slot. Identity + boundary: Atlas entity `Knowledge/Areas/Meta/Entities/workflows/ui-pipeline.md`. Entry + opt-in + project variables: `workflows/ui-development/README.md`; the 34 slots: `workflows/ui-development/slot-list.md`; cross-cutting rules: `workflows/ui-development/principles.md`.
> The local `.project-docs/agent-workflow/` is the **deprecated prototype** the canonical pipeline was lifted + generalized from. Do **not** run its linear `ux-architect → … → dev-tasker` flow as "the pipeline." (Running it on 2026-05-24 reintroduced app-scoped-IA-blindness the canonical pipeline already fixed at slot 7 — `~/.claude/plans/closure-obligations/2026-05-24-ui-pipeline-fork-collapse.md`.)

**To run UI work in haven-ui:**
1. Read `workflows/ui-development/README.md` (opt-in), `slot-list.md`, `principles.md`.
2. Declare haven-ui's project variables: `design-system` = this repo's `DESIGN.md` + `packages/design-system/pattern-library/`; `target-framework` per slot-3 stack-declaration; `pattern-library` = `packages/design-system/pattern-library/`; `wireframe-syntax` (project-declared); `qa-panel` (haven-ui's 4-expert panel + skeptic); `tier-model` = haven-ui Tier 1/2/3.
3. Instantiate a per-engagement workflow dir, fire the slots, honor the gates — including the **non-waivable** slot-30 human cold render-and-look (client-facing/regulated) and slot-31 release-readiness skip-audit.

**Still valid in `.project-docs/agent-workflow/skills/` (applying-mode tooling):** `haven-mapper`, `ui-react-porter`, `haven-pl-builder`, `haven-pl-qa` are haven-ui's realizations of canonical slots (ds-binding application, build-execute, PL ceremony). Invoke them **as the canonical workflow's slots direct**, not via the prototype's linear flow. The Tier 1/2/3 slice ceremony + 4-expert panel (above, "Per-slice QA") are haven-ui's `tier-model` + `qa-panel`.

**Design artifacts live in:** `apps/[persona]/design/`.

**Constraints Lookup (before any build prompt):** read `.project-docs/decisions-log.md`; apply every "Rule to follow in future prompts" entry under a "Known Constraints" heading.
