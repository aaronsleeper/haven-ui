# `.page-title` Patch Plan

**Date:** 2026-05-13
**Source:** drift audit (`apps/patient/design/audit-2026-05-13.md`)
**Target:** haven-ui patient app (`apps/patient/`)
**Tier:** Tier 1 — Primitive (new PL fragment + components.css + COMPONENT-INDEX)

---

## Goal

Replace the inline typography literal `text-[27.65px] font-serif font-medium text-sand-900` (used as the `<h1>` register on all 5 main patient screens) with a single semantic class `.page-title`. Eliminates ~80% of the "screens feel inconsistent" reaction Aaron flagged in the audit.

The Heading/01 register (Lora 27.65px Medium) is already specified in DESIGN.md §Typography. This patch makes the existing spec reusable as a class — not a new design decision.

---

## Current state

Every screen's `<h1>` (5 main screens + 2 assessment scaffolds where applicable) carries the same literal:

```tsx
<h1 className="text-[27.65px] font-serif font-medium text-sand-900">Title</h1>
```

Wireframes for pt-01, pt-02, pt-03, pt-04, pt-05 all reference this same spec: "Heading/01 27.65px Lora Medium."

---

## Target state

```tsx
<h1 className="page-title">Title</h1>
```

Semantic class lives in `components.css`. Pattern-library fragment authored at `pattern-library/components/typography-page-title.html`. COMPONENT-INDEX entry updated.

---

## Changes

### 1. `packages/design-system/src/styles/tokens/components.css`

Add a new section (placed near other typography classes, or in a new "Typography" section if not present):

```css
/* ===================================
   PAGE TITLE
   Heading/01 register: Lora 27.65px Medium.
   Used at the top of route content as <h1>.
   See DESIGN.md §Typography Heading/01.
   =================================== */

.page-title {
    @apply text-[27.65px] font-serif font-medium text-sand-900;
}
```

### 2. Pattern-library fragment

New file: `packages/design-system/pattern-library/components/typography-page-title.html`

```html
<!--
@component-meta
name: Page Title
classes: page-title
preline: no
notes: |
  Heading/01 register — Lora 27.65px Medium on sand-900.
  Used as <h1> at the top of route content in every persona app.
  Spec is fixed in DESIGN.md §Typography. The semantic class is a
  reusable wrapper around the canonical type spec, not a new design
  decision.
-->

<h1 class="page-title">Page Title</h1>
```

### 3. `packages/design-system/pattern-library/COMPONENT-INDEX.md`

Add a row under "Typography" (or create the section if it doesn't exist):

```
| Page Title | `typography-page-title.html` | `page-title` | no | Heading/01 register (Lora 27.65px Medium). Used as `<h1>` at the top of route content. Spec fixed in DESIGN.md §Typography. |
```

### 4. Screen file replacements

Replace the literal in 5 files. Pattern:

```diff
- <h1 className="text-[27.65px] font-serif font-medium text-sand-900">
+ <h1 className="page-title">
```

Files:

- `apps/patient/src/screens/dashboard/index.tsx` (line ~54)
- `apps/patient/src/screens/messages/index.tsx` (line ~76)
- `apps/patient/src/screens/settings/index.tsx` (line ~41)
- `apps/patient/src/screens/health/index.tsx` (line ~59)
- `apps/patient/src/screens/care/index.tsx` (line ~55)

Assessment screens (`gad-7`, `phq-9`) use a smaller `text-xl font-serif font-semibold` register, not Heading/01. Leave those alone. Future work could add a `.section-title` class for those if desired; not part of this patch.

---

## Tier assessment

Per `Lab/haven-ui/CLAUDE.md`: Tier 1 (new PL fragment) with brand-fidelity-weighted authoring requires the 4-expert review panel.

**Resolved 2026-05-13:** Aaron approved skipping the 4-expert panel for this patch. Rationale: PL is up to date and the Heading/01 spec is locked in DESIGN.md §Typography; this is mechanical extraction of an existing register, not a new design decision. Closer to a 1:1 mechanical port than a new primitive.

**Estimated effort:** ~30 minutes including PL fragment + COMPONENT-INDEX entry + 5 screen replacements + browser verification.

---

## Verification

1. `pnpm typecheck` from haven-ui root — must pass
2. `pnpm --filter @haven/app-patient dev` — visual walkthrough of all 5 screens at narrow + desktop widths; headers should look identical to before
3. `pnpm --filter @haven/design-system dev` — pattern-library page renders the new `Page Title` exemplar
4. `pnpm conform` — full umbrella before opening PR; blocking-on-patch gates per haven-ui CLAUDE.md

---

## Commit message

```
feat(patient): extract Heading/01 register to .page-title semantic class

Replaces the inline typography literal text-[27.65px] font-serif
font-medium text-sand-900 on 5 patient screens with a single
.page-title class. Mechanical extraction of an existing repeated
pattern; design decision is unchanged (locked in DESIGN.md
§Typography). Eliminates per-screen drift in H1 rendering.

- components.css: add .page-title
- pattern-library/components/typography-page-title.html: new fragment
- COMPONENT-INDEX.md: registered
- apps/patient/src/screens/{dashboard,messages,settings,health,care}/index.tsx:
  replace inline literal with semantic class
```
