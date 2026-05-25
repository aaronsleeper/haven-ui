---
slot: 4
slot-name: framework-binding
primary-author: Tech Lead
project: cena-uconn-patient-app
created: 2026-05-24
status: in-review
consumes:
  - stack.md
inputs-hash: null
friction: []
pre-flight-authority: aaron
---

# Framework Binding — Cena × UConn Patient App

The "framework" for this engagement is the **static-HTML handoff bundle** discipline. This doc binds the concrete toolchain, conventions, and accessibility-tree expectations. (When/if T0.1 selects a production framework, a sibling framework-binding is authored for that target; this one governs the owned design realization.)

## Target "framework" + version

- **Static HTML5**, composed from haven-ui pattern-library v-current (`packages/design-system/pattern-library/`, COMPONENT-INDEX ground truth).
- **CSS:** compiled `assets/haven.css` (Tailwind v4 build of the design system) — **closed vocabulary** (DS component classes + sanctioned/safelisted utilities only).
- **No JS framework.** Vanilla-JS-per-primitive only where a behavior module is genuinely needed (the bundle ships **without Preline** — Preline-driven collapse is inert; use native `<details>`/`<summary>`).

## Routing / navigation

- No client-side router. Each surface state is a static HTML page (or a documented in-page disclosure via `<details>`). Navigation between surfaces = links; the 3-tab bottom nav (`layout-mobile-bottom-nav`) sets `.active` per page and links across.
- Per-surface states (loading/empty/error/success) are authored as **separate state pages** or documented variants (as the prior Home build did: `home.caught-up.html`, `home.one-item.html`, `home.several.html`).

## State library

- None (no framework). State is expressed structurally per-page. Behavior contracts (save-pause, validators, transitions) are **documented in the wireframe + states.md** for the eventual production port to implement — they are spec, not shipped runtime logic, in the static bundle.

## Build / test toolchain

- **Build:** `scripts/handoff-rebuild-bundle.sh` (the only supported path — builds `@haven/design-system`, copies FA Pro font binaries + SVG fallbacks + logo, rewrites absolute→relative `url()`). Idempotent. **Never run the CSS step alone** (scrambles FA glyphs bundle-wide; render gate can't catch it — Guardrail 1, commit `77cd7ae`).
- **Render gate:** `scripts/handoff-render-gate.sh` → renders every page with `render-check.mjs`, fails on undefined-class drift. Run after every rebuild.
- **Render-verification (Principle 13):** `node tools/render-check.mjs <html> --out render/<slice>/` (vault-root pipeline tool) for screenshots + mechanical checks at declared viewports.

## Declared viewports (render-check + responsive)

- **Mobile (primary):** 390px.
- **Desktop (reflow):** 1280px.
- (render-check.config.json defaults match: desktop 1280, mobile 390.)

## Accessibility-tree expectations

- Semantic landmarks: `<header>`, `<main>`, `<nav>` (bottom tab bar), `<footer>` where used.
- Headings: one `<h1>` per surface (the greeting/page-title register), logical heading order.
- Bottom-nav tabs: `role`/`aria-current="page"` on the active tab; icon+label pairs (never icon-only for primary nav).
- Disclosure via `<details>`/`<summary>` exposes native expanded/collapsed state.
- "Talk to a person": a clearly-labeled link/button with a person icon + visible text label, reachable without scrolling past everything.
- Onboarding progress: `aria-label="Step N of 3"` on `onb-progress`.

## Closed-vocabulary contract (honor; do not violate)

- Use only: DS component classes in `components.css`, or sanctioned/safelisted utilities (`@source inline(...)` in `main.css`). A needed-but-missing standard utility → safelist + rebuild + re-gate. An arbitrary-value utility → promote to a named PL pattern (e.g., `layout-two-pane`), never safelist. A missing component class → add to `components.css` + COMPONENT-INDEX (Tier-1 ceremony), never invent a phantom.
