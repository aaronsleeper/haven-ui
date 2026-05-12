# Build Tasks: foundations-colors redesign

**Date:** 2026-05-12
**Source:**
- Component map: `packages/design-system/design/component-map-foundations-colors.md`
- Wireframe: `packages/design-system/design/wireframes/foundations-colors-redesign.md`
- Review notes (copy + decisions): `packages/design-system/design/review-notes-foundations-colors.md`
- New primitive spec: `packages/design-system/design/new-components/palette-swatch.md`
**Target:** haven-ui (CenaHealth + aaronsleeper mirror dual-push)

## Task Summary

- **Total tasks:** 3
- **New components:** 1 (palette-swatch primitive — Task 01)
- **Screen builds:** 1 (foundations-colors.html rewrite — Task 02)
- **Verification:** 1 (Task 03)
- **Estimated complexity:** Simple — all judgment calls resolved upstream; both build tasks deterministic

## Execution Order

| # | Task | Scope | Task class | Model | Files Modified | Depends On | Status |
|---|------|-------|-----------|-------|----------------|------------|--------|
| 01 | Author `palette-swatch` primitive | Pattern library only | deterministic | sonnet | `components.css`, new `foundations-palette-swatch.html` (component), new `foundations-palette-swatch.html` (page), `pl-nav.html`, `COMPONENT-INDEX.md` | — | ☐ |
| 02 | Rewrite `foundations-colors.html` per new IA | Pattern library only | deterministic | sonnet | `foundations-colors.html` | 01 | ☐ |
| 03 | Verify + visual review + commit + dual-push | Verification | deterministic | sonnet | — (no source edits) | 02 | ☐ |

## Task 01: Author palette-swatch primitive

### Scope
Pattern library only

### Task class
deterministic

### Model tier
sonnet

### Context
Author the `palette-swatch` primitive per spec at `packages/design-system/design/new-components/palette-swatch.md`. This is the foundation of the foundations-colors rewrite — every swatch in Zones 2/4/6 of the new page uses it. Composes Preline `hs-tooltip` (already proven in `meal-warning-tooltip` and `badge-sdoh`). No new JS.

### Files to Read First
- `packages/design-system/design/new-components/palette-swatch.md` — full spec
- `packages/design-system/src/styles/tokens/components.css` — find a good insertion point near other foundations primitives (after the `.section-title` or similar)
- `packages/design-system/pattern-library/components/meal-warning-tooltip.html` — reference for Preline tooltip composition pattern
- `packages/design-system/pattern-library/components/chat-tag-group.html` — reference for the canonical PL preview-page pattern (`<load>` chain)

### Instructions

1. **Add CSS to `components.css`** (5 classes per spec): `.palette-swatch`, `.palette-swatch-trigger`, `.palette-swatch-sm`, `.palette-swatch-lg`, `.palette-swatch-tooltip`, `.palette-swatch-grid`. Use `@apply` definitions exactly as written in the spec.
2. **Create `packages/design-system/pattern-library/components/foundations-palette-swatch.html`** — PL fragment with `@component-meta` header + demo of: single default swatch, `-sm` swatch, `-lg` swatch, an 11-stop `palette-swatch-grid` example.
3. **Create `packages/design-system/pattern-library/pages/foundations-palette-swatch.html`** — preview page per `chat-tag-group.html` pattern (`<load>` chain: pl-head, pl-nav, fragment, pl-scripts).
4. **Add nav entry** in `packages/design-system/pattern-library/partials/pl-nav.html` under the **Foundations** section.
5. **Add row** to `packages/design-system/pattern-library/COMPONENT-INDEX.md` listing the new classes + Preline base note.

### Expected Result
- `.palette-swatch` and 5 sibling classes defined in `components.css`
- `foundations-palette-swatch.html` PL fragment exists with @component-meta + working demo
- Preview page exists at `http://localhost:5173/pattern-library/pages/foundations-palette-swatch.html` and renders with PL chrome
- Tooltip appears on hover/focus, dismisses on blur/leave (Preline `hs-tooltip` behavior)
- Focus ring visible on keyboard focus (Tab into a swatch)

### Verification
- [ ] Classes exist in `components.css`
- [ ] PL fragment file exists with `@component-meta` header
- [ ] Preview page file exists at `pages/foundations-palette-swatch.html`
- [ ] Nav entry in `pl-nav.html` under Foundations
- [ ] COMPONENT-INDEX row exists
- [ ] Preview page renders with full PL chrome at localhost:5173
- [ ] Hover shows hex tooltip
- [ ] Keyboard focus shows tooltip + focus ring
- [ ] Dark mode tested (toggle in PL sidebar)
- [ ] No console errors
- [ ] `pnpm typecheck` + `pnpm --filter @haven/ui-react conform:fast` pass

### Completion Report
Standard format. Judgment calls expected to be `none` (deterministic task).

---

## Task 02: Rewrite foundations-colors.html

### Scope
Pattern library only

### Task class
deterministic

### Model tier
sonnet

### Context
Rewrite `packages/design-system/pattern-library/components/foundations-colors.html` to the new 7-zone IA per the wireframe + component-map. All copy is in `review-notes-foundations-colors.md`. All component references are in the component-map. Task 01's `palette-swatch` primitive must exist before this task runs.

### Files to Read First
- `packages/design-system/design/wireframes/foundations-colors-redesign.md` — IA structure
- `packages/design-system/design/component-map-foundations-colors.md` — exact recipe per zone
- `packages/design-system/design/review-notes-foundations-colors.md` — verbatim copy
- `packages/design-system/pattern-library/components/foundations-colors.html` — current state (will be replaced)
- `packages/design-system/pattern-library/components/foundations-palette-swatch.html` — primitive usage reference (just created in Task 01)

### Instructions

Rewrite `components/foundations-colors.html` end-to-end per the 7-zone recipe in `component-map-foundations-colors.md`:

1. **Zone 1** — `<!-- @component-meta -->` with updated notes field per review-notes; `<h2>Colors</h2>` + lead paragraph (review-notes verbatim) + Color Role Guide table (preserve Phase G Pass 1 18-row structure; drop the 10 "(v2 — no semantic alias yet)" parentheticals and add the one footer sentence per review-notes).
2. **Zone 2** — System Overview Strip: `<div class="flex gap-0.5 mb-8">` with 18× `.palette-swatch.palette-swatch-lg` (data-hs-tooltip wired, aria-label per swatch, hex in tooltip, onclick smooth-scroll to anchor). Order: sand, teal, sage, red, amber, green, cyan, orange, yellow, lime, emerald, blue, indigo, violet, purple, fuchsia, pink, rose.
3. **Zone 3** — Logo Identity Tokens: existing 4-cell grid (Phase G Pass 1) with updated lead caption per review-notes + per-cell role descriptors. Swatch radius stays `rounded` (4px).
4. **Zone 4** — Semantic Roles: 8 role rows per review-notes copy. Each row: 240px label column + 5× `.palette-swatch.palette-swatch-sm` (stops 50/100/300/500/700) + flex description column. `border-b border-sand-200 dark:border-sand-700` between rows. Click each swatch → smooth-scroll to family anchor.
5. **Zone 5** — Semantic Surfaces: keep 5-cell grid (Phase G Pass 1), update lead caption per review-notes, change swatch `rounded-lg` → `rounded`.
6. **Zone 6** — Family Reference Grid: 18 family rows in same order as Zone 2. Each row wrapped in `<div id="family-{family}" class="mb-6">` (anchor target). Section heading per review-notes "Family Reference Grid" per-family role hints. Use `.palette-swatch-grid` wrapper containing 11× `.palette-swatch` (default size) with stop number captions.
7. **Zone 7** — Rules & Discipline: `<div class="card card-body">` + `<h3 class="card-title">System Rules</h3>` + bulleted list per review-notes "Rules & Discipline" copy. Italic `Enforced by {gate}` pointers where applicable.

### Known Constraints (per .project-docs/decisions-log.md scan + CLAUDE.md)
- Use semantic Haven classes wherever possible; raw utilities only for layout composition unique to this page (flex/grid/spacing)
- All swatch instances use the `.palette-swatch` primitive — NEVER reinvent the tooltip wiring inline
- Family palette stops decouple from logo hex per v2 §1.5 — DON'T add ring-lock indicators to teal-400, teal-800, sage-300 (only teal-500 still coincides with logo-primary)
- Use NEW v2 sand hex values in Semantic Surfaces captions (sand-50 #FBFAF8, sand-100 #E6E4E0, sand-200 #D1CEC8) — already corrected in Phase G Pass 1
- No inline `<style>` blocks. No `<script>` blocks in the fragment file.
- Hex values in tooltips: hardcoded from current `palette.css` (regenerate from v2 if palette changes — currently stable)

### Expected Result
- New foundations-colors.html ~3500px tall (vs current ~11669px)
- All 18 families surfaced once (in Zone 6 grid) + previewed once (Zone 4 for the 8 semantic roles)
- System Overview Strip at top showing all 18 families in one viewport
- Click any swatch in Zones 2/4 → smooth-scroll to Zone 6 family anchor
- Hover/focus any swatch → hex tooltip
- All tighter radii (`rounded-sm` for default swatches, `rounded` for surfaces and `-lg` swatches)
- Dark mode parity preserved

### Verification
- [ ] All 7 zones present in order
- [ ] All 18 families have rows in Zone 6 with correct family-{name} IDs
- [ ] All 18 cells in Zone 2 strip
- [ ] All 8 semantic role rows in Zone 4
- [ ] Click on Zone 2 cell scrolls to Zone 6 family anchor
- [ ] Click on Zone 4 swatch scrolls to Zone 6 family anchor
- [ ] Hover/focus any swatch shows hex tooltip
- [ ] Page renders at `http://localhost:5173/pattern-library/pages/foundations.html`
- [ ] No console errors
- [ ] `pnpm typecheck` + `pnpm --filter @haven/ui-react conform:fast` pass
- [ ] Doc height ≤ ~3500px (verify via JS in browse: `document.documentElement.scrollHeight`)
- [ ] Visual check: dark mode renders correctly (no missing dark: classes)
- [ ] No utility soup — all repeated patterns use the primitive

### Completion Report
Standard format. Judgment calls expected to be `none` (deterministic task — all judgment resolved upstream in wireframe + review).

---

## Task 03: Verify, commit, dual-push

### Scope
Verification only

### Task class
deterministic

### Model tier
sonnet

### Context
Final verification pass before commit. Confirm all gates pass, page renders correctly, then stage commits (one for the new primitive + one for the rewrite, OR a single commit covering both — see decision below) and push to dual-push remote.

### Instructions

1. **Run gates locally:**
   - `pnpm typecheck`
   - `pnpm --filter @haven/ui-react conform:fast`
2. **Visual verification via browse skill:**
   - Open `http://localhost:5173/pattern-library/pages/foundations.html` — confirm all 7 zones
   - Open `http://localhost:5173/pattern-library/pages/foundations-palette-swatch.html` — confirm primitive preview renders
   - Hover + keyboard-Tab through a few swatches — confirm tooltip + focus ring behavior
   - Toggle dark mode in PL sidebar — confirm parity
3. **Commit decision:** Single commit covers both Task 01 + Task 02 (they're co-required; the new primitive only exists because the rewrite needs it). Title: `feat(haven-pl): redesign foundations-colors page + palette-swatch primitive`.
4. **Stage explicitly** per `.claude/rules/commit-scope.md`:
   - `packages/design-system/src/styles/tokens/components.css`
   - `packages/design-system/pattern-library/components/foundations-palette-swatch.html`
   - `packages/design-system/pattern-library/pages/foundations-palette-swatch.html`
   - `packages/design-system/pattern-library/components/foundations-colors.html`
   - `packages/design-system/pattern-library/partials/pl-nav.html`
   - `packages/design-system/pattern-library/COMPONENT-INDEX.md`
   - Design artifacts (wireframe, review-notes, component-map, new-component spec, task-list, slice manifest) — group as separate commit OR include in main commit? Decision: separate commit titled `docs(haven-pl): foundations-colors redesign artifacts` so the source-of-truth design trail is reviewable separately.
5. **Push** to dual-push remote; verify both URLs received.

### Verification
- [ ] All conform gates pass
- [ ] Visual check confirms 7 zones render correctly
- [ ] No console errors at the foundations or primitive preview pages
- [ ] Dark mode parity confirmed
- [ ] Both remotes (CenaHealth + aaronsleeper) match local HEAD after push
- [ ] Plan file updated (~/.claude/plans/haven-ui-foundations-page-redesign.md) with Phase 4-7 completion

### Completion Report
Standard format. Judgment calls: `none`.

---

## Post-Build

- [ ] **ux-design-review post-build mode** (validation): produce `validation.md` comparing built page against wireframe spec.
- [ ] **4-expert panel review** per haven-ui Tier 1 slice protocol:
  - design-system-steward (token discipline, primitive promotion)
  - brand-fidelity (palette canon, logo decoupling, voice)
  - ux-design-lead (IA, hierarchy)
  - accessibility (WCAG AA, keyboard nav, tab-trap mitigation)
- [ ] **debrief-capture** if any unexpected friction surfaced during build.

## Notes

- This redesign is bounded — no other PL surfaces should drift during this slice. If something off-scope feels broken, log it as a follow-up; don't expand scope mid-slice.
- The palette content itself (palette.css) is NOT touched. Only the documentation surface changes.
