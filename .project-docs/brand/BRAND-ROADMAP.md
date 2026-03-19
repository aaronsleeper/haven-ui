# Cena Health Brand — Roadmap

_Last updated: 2026-03-16_

This roadmap tracks everything the brand/design system documentation needs to reach a state where any contributor (human or agent) can work confidently without asking clarifying questions. It is separate from the application feature roadmap (`.project-docs/roadmap.md`).

---

## Current State

A `BRAND.md` reference document exists at `.project-docs/brand/BRAND.md`. It covers:
- Product context and app map
- Voice and tone
- Color roles, semantic tokens, and dark mode patterns
- Typography typefaces and usage rules
- Iconography rules and patterns
- Layout / mobile shell / card anatomy
- Component patterns (buttons, alerts, badges, pref-row, image inset border)
- Preline integration rules
- Accessibility baselines
- Angular handoff notes

All content in `BRAND.md` reflects what is currently in code. It is a reference document, not a design spec.

---

## Phase 1 — Pattern Library Health (Priority: High)

These are the issues identified in the peer review of the pattern library infrastructure. They block reliable agent work and visual QA on PL pages.

### PL-INFRA-01: Fix `glob.sync()` → `globSync` in vite.config.js

**Status:** Known bug, unfixed
**Impact:** `npm run build` silently produces empty input — no HTML pages are included in the build. Dev server is unaffected (Vite serves directly), which is why this has been invisible.
**Fix:** `import { globSync } from 'glob';` and replace `glob.sync([...])` with `globSync([...])`.
**Effort:** 10 minutes.

### PL-INFRA-02: Fix active nav state in pattern library

**Status:** CSS class defined (`.pl-nav-link.active`) but never applied. Selector targets wrong class (`.pl-nav-link` vs actual class `.sidebar-nav-item`).
**Fix:**
1. Rename CSS selector to `.sidebar-nav-item.active`
2. Add script to `pl-scripts.html` that sets `active` class based on `window.location.pathname`
3. Handle hash-anchor links (foundations page sections) gracefully

**Effort:** 30 minutes.

### PL-INFRA-03: Replace CDN Preline with local copy in pl-scripts.html

**Status:** `pl-scripts.html` loads `preline@2.6.0` from CDN. App uses `preline@4.1.2` locally. These are not compatible — any PL component requiring Preline JS initialization behaves incorrectly.
**Fix:** Replace CDN script tag with local path: `/node_modules/preline/dist/preline.min.js`
**Effort:** 5 minutes.

---

## Phase 2 — Pattern Library Page Completeness (Priority: Medium)

### PL-PAGES-01: Alerts page — adopt current alert.html component markup

The `pattern-library/pages/alerts.html` page (as described in the peer review) uses a `<template>` + JS injection pattern for icons. The actual `pattern-library/components/alert.html` uses direct `<i class="fa-solid ...">` markup. The page should be updated to match the component file pattern.

**Action:** Audit `alerts.html` page — if it contains `<template id="icon-*">` blocks, refactor them out. The component file already has the correct pattern.

### PL-PAGES-02: Add component-level search/filter to PL nav

At 30+ components, the sidebar becomes slow to navigate. A simple text input that filters `.sidebar-nav-item` entries by label would eliminate most scroll overhead.

**Implementation:** Inline `<input>` above the nav list in `pl-nav.html`. Script in `pl-scripts.html`. No new component class needed — PL chrome only.

### PL-PAGES-03: Add collapsible sections to PL nav

Currently the nav is a flat list. When expanded to 30+ items, sections become visually indistinct. A disclosure widget per section (Foundations / Primitives / Patterns / Components / Reference) would organize the space.

**Dependency:** PL-INFRA-02 (active state) should be done first so active state is preserved across collapse/expand.

---

## Phase 3 — Brand Documentation Expansion (Priority: Medium)

These are docs that don't exist yet. Each represents a gap that currently requires a human to answer a question an agent could otherwise resolve from docs.

### BRAND-DOC-01: Copywriting & Microcopy Guide

A reference for actual string content used in the patient app: empty state copy, error messages, CTA labels, confirmation messages, i18n patterns. Currently this content lives only in HTML files and has to be inferred by reading each screen.

**Contents to include:**
- Standard empty state formula (icon + headline + supporting text)
- Standard error message formula
- Standard CTA label conventions (verb-first, plain language)
- i18n attribute convention (`data-i18n-en` / `data-i18n-es`)
- List of established patient-facing strings (by screen)

### BRAND-DOC-02: Motion & Transition Reference

The project has transition patterns in CSS (dropdown opacity, feedback confirmation state transitions) but no central record of what speeds and easing values are used where. This leads to inconsistent transitions as new components are added.

**Contents to include:**
- Approved transition durations (currently `0.15s` is the only established value)
- Approved easing functions
- What types of interactions get transitions vs. instant state changes
- Dark mode transition rules (should transitions be suppressed when switching themes?)

### BRAND-DOC-03: Illustration & Empty State Patterns

The patient app has empty states but no documented pattern for what they should look like and how they should behave. An agent building a new screen will invent a pattern rather than follow an established one.

**Contents to include:**
- Empty state anatomy (icon, headline, body, optional CTA)
- Which icon styles are appropriate (solid vs. light vs. duotone)
- Icon size and color conventions for empty states
- Whether empty states should be inside cards or standalone
- List of existing empty state implementations by screen

### BRAND-DOC-04: Screen/Flow Inventory Update

The archive in `.project-docs/archive/screens/` contains screen specs from before the current build. Many of these screens were built, some were not, some were redesigned during build. The archive is now misleading — it implies things are unbuilt that are built, and vice versa.

**Action:** Create a single `SCREENS.md` that lists every screen across all apps with: filename, route, build status, and whether the archive spec still reflects the built screen.

---

## Phase 4 — Multi-App Consistency (Priority: Lower — unblocked by app work)

These items become relevant once kitchen portal and provider portal builds begin.

### BRAND-MULTI-01: Cross-app component audit

The four apps (patient, kitchen, provider, care-coordinator) share `components.css` but have different surface requirements. Before building kitchen or provider screens, audit which existing semantic classes:
1. Are patient-specific in their visual language (e.g., mobile shell, bottom nav, `.pref-row`)
2. Are genuinely shared (cards, buttons, alerts, badges)
3. Need portal variants (e.g., desktop-optimized card layouts, sidebar navigation instead of bottom nav)

**Output:** A `COMPONENT-SCOPE.md` table mapping each semantic class to which apps it applies to.

### BRAND-MULTI-02: Typography scale for portal / desktop contexts

The patient app type scale is tuned for mobile. Provider and kitchen portal screens are desktop-first. The current scale (body `text-sm`, captions `text-xs`) may be too small for a desktop information-dense UI without adjustment.

**Action:** Before the first portal screen build, decide whether to extend the type scale with portal-specific size steps or whether existing steps are sufficient.

### BRAND-MULTI-03: Navigation patterns per persona

Each persona has a different navigation model:
- Patient: bottom nav, mobile shell
- Kitchen portal: left sidebar, desktop full-width
- Provider portal: likely sidebar, possibly tabbed subnavigation
- Care coordinator: not yet designed

Document the confirmed nav pattern per app before building portal screens. This avoids building nav chrome that needs to be refactored.

---

## Deferred / Backlog

- **Logo / wordmark:** No logo asset exists in the repo. If Cena Health develops a logo, it should be added to `src/assets/brand/` and referenced in `BRAND.md`.
- **`pref-row` generalization:** The inset-ring selection pattern is patient onboarding only. Promote to shared when a second use case appears across a different app.
- **Print / document styles:** If patient-facing PDFs (meal plans, care summaries) are in scope, they will need a separate type treatment. Deferred until a concrete use case exists.
- **Brand animation / loading states:** No spinner or skeleton screen pattern exists. Add when the first screen with async data loading is built.

---

## Completion Criteria for Phase 1

Phase 1 is done when:
- [ ] `npm run build` succeeds and includes all HTML files in the Rollup input log
- [ ] Active nav link is highlighted correctly on every PL page
- [ ] PL interactive components (dropdowns, modals) work correctly using the local Preline copy

These three items are prerequisites before any meaningful PL visual QA can happen.
