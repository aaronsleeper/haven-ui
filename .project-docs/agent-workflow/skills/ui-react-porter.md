---
name: ui-react-porter
description: Mechanically port a pattern-library HTML component into a matching React component in packages/ui-react. Purely deterministic. Never invents HTML structure, class names, or props — copies the pattern-library entry class-for-class and wraps it in minimal JSX. Fails loudly if the pattern-library entry is missing or inconsistent with COMPONENT-INDEX.md. Use after pattern-library is the source of truth and a React consumer needs the component.
model: sonnet
task_class: deterministic
---

# UI React Porter

You mechanically translate a pattern-library HTML component into a React component in `packages/ui-react/` that mirrors the pattern-library entry 1:1. This is a **deterministic** skill — no judgment, no invention. If the task requires judgment, you fail loudly and route to `haven-mapper` or `ux-wireframe` instead.

## Preconditions (check first; fail if any are false)

Before writing any React code, verify:

1. A pattern-library file exists at `packages/design-system/pattern-library/components/[category]-[name].html` with a `@component-meta` header.
2. Every class used in that HTML file is defined in `packages/design-system/src/styles/tokens/components.css` (either as `@apply` definition or as a Preline/Tailwind class documented in the project conventions).
3. A row for this component exists in `packages/design-system/pattern-library/COMPONENT-INDEX.md`.
4. No existing React component at `packages/ui-react/src/components/[Name].tsx` covers the same pattern.
5. **Pre-port accessibility audit** — the pattern-library HTML passes these checks:
   - Root element is correct for its role (interactive elements → `<button>`, `<a>`, or a semantic form element — not `<div>`; containers → `<section>`, `<aside>`, `<nav>`, etc.)
   - Decorative icons have `aria-hidden="true"`
   - Icon-only or state-only indicators (SLA badges, status dots, alert chevrons) have a text equivalent via `aria-label`, visible text, or `<span class="sr-only">`
   - List structures use `<ul>`/`<ol>` + `<li>` (or `role="list"`/`"listitem"` where a styled list defies native elements)
   - Section headers use a heading element (`<h2>`/`<h3>`) or `role="heading"` + `aria-level`
   - Color is never the sole conveyor of state — text or icon backs it up
   - Hit targets on interactive elements are at least 44×44 CSS px (or the surrounding touch target is)
   - Any animation respects `prefers-reduced-motion` (at the CSS level via `@media (prefers-reduced-motion: reduce)`)

6. **Layout-component addendum** — if the component is a layout shell (panel, landmark container, app-shell, grid), additionally verify:
   - Every `<aside>`, `<nav>`, `<section>`, `<form>` that shares a page with a sibling of the same tag carries an `aria-label` so screen-reader landmark navigation can distinguish them (WCAG 1.3.1 / 2.4.1). The React port's default `label` prop matches the pattern-library HTML's value; override optional.
   - Every `<main>` has an `aria-label` too when another `<main>` or ambiguous structure could exist (e.g., multi-app shells). Single-`<main>` pages can omit but it doesn't hurt.
   - DOM child order matches the visual left-to-right / top-to-bottom reading order the wireframe specifies — the React port must not reorder. CSS-only reordering (`flex-direction`, `order`) is fine for visual layout but breaks reading order and is forbidden for layout shells.
   - Do NOT add focus-trap behavior to persistent layout panels. Focus-trap is a modal-dialog pattern per WAI-ARIA APG; applied to a persistent panel it becomes a WCAG 2.1.2 (No Keyboard Trap, Level A) failure. Wireframes that specify trapping for persistent panels are incorrect; route back to `ux-design-lead` to restate as panel-cycle keyboard shortcut or remove.
   - Every non-interactive landmark that sits beside a scroll container has `overflow-y-auto` (or `overflow-y-hidden` if intentionally clipped) so content that grows does not strand focus off-screen.

If any check fails:
- Do NOT write the React component.
- Report which precondition failed and which upstream skill should resolve it:
  - Missing pattern-library HTML → escalate to `haven-mapper` (gap analysis) or `ux-wireframe` (new component flagged).
  - Missing components.css definition → escalate to `haven-mapper` (new-component spec needed).
  - Missing COMPONENT-INDEX row → escalate to `haven-pl-builder` or manual index update.
  - Existing React component → escalate to human review (duplicate/divergent component question — steward's call).
  - **A11y audit fails** → escalate to `accessibility` expert via `haven-pl-builder` to fix the pattern-library HTML first. Do not paper over an HTML gap by patching the React component — the React must mirror the HTML 1:1, so the fix belongs at the source. This rule exists because `ui-react-porter` silently propagates HTML a11y defects; the structural gate is here.

## The port rule

**Copy HTML structure exactly. Map class attributes 1:1 to React `className`. Replace attribute-based content with `children` or named props. Nothing else.**

Permissible transformations:
- `class="..."` → `className="..."` (identical value)
- `for="..."` → `htmlFor="..."`
- Inline event handlers (`onclick="..."`) → accept a prop, e.g. `onClick: () => void`
- Static text nodes that are clearly content → replace with `{children}` or a named prop
- Attribute-based values (e.g. `href="#"`) → accept as prop with same name
- Preline `data-hs-*` attributes → keep as-is (Preline JS is loaded in app entry, not in the component)
- **Implied clickability via CSS** — if the pattern-library `components.css` definition for the component's class includes `cursor-pointer`, the component is semantically clickable. Accept an `onClick?: () => void` prop on the component root even if the HTML has no inline `onclick`. Conversely, if `components.css` does NOT declare `cursor-pointer`, do not add `onClick` — the clickability wasn't specified.
- **Implied selection state via CSS** — if `components.css` defines an `.active` variant (or similar stateful variant), expose it as a boolean prop (`active?: boolean`) that toggles the class; and set `aria-current="true"` on the root when active (assumes the component is a selectable list item; for tab-like semantics use `aria-selected`).

Forbidden transformations:
- Adding structure not present in the pattern-library HTML (no "improvements")
- Removing structure present in the pattern-library HTML (no "simplifications")
- Renaming class names (break-the-port offense)
- Adding utility classes not in the pattern-library HTML (use pattern-library variants instead)
- Adding state, hooks, or behavior not represented in the pattern-library HTML
- Inferring dark-mode classes that the pattern-library HTML does not already carry
- Adding `style={{...}}` or CSS modules

## Output shape

One file: `packages/ui-react/src/components/[Name].tsx`

```tsx
import type { ReactNode } from 'react';

// Mirror of packages/design-system/pattern-library/components/[category]-[name].html
// Classes track components.css; do not edit this file's class attributes without
// also editing the pattern-library HTML.

export interface [Name]Props {
  children?: ReactNode;
  className?: string;
  // + exactly the props the pattern-library HTML variation points require
  // + exactly the event handlers the pattern-library HTML has inline handlers for
}

export function [Name]({ children, className = '', ...rest }: [Name]Props) {
  return (
    // Structure copied verbatim from pattern-library HTML, `class` → `className`
  );
}
```

Also update the component barrel at `packages/ui-react/src/components/index.ts` with the new export.

## Props policy

- Every prop must map to something in the pattern-library HTML — a class variant, an inline handler, an attribute value, or a content slot.
- Never add convenience props that don't exist in the HTML (no `loading`, `disabled`, `variant`, etc., unless the HTML has a variant class for it).
- `className` pass-through is allowed (standard React pattern) and must concatenate, not replace, the component's base classes.
- `children` is allowed for content slots.

## Variants

If the pattern-library HTML shows multiple variants (e.g., `.badge-success`, `.badge-warning`, `.badge-danger`), expose a `variant` prop whose values are exactly the variant suffixes:

```tsx
export interface BadgeProps {
  variant?: 'success' | 'warning' | 'danger';
  // ...
}
```

Class is composed mechanically: `badge badge-${variant}`. If pattern-library shows a base-only variant with no suffix, default `variant` to `undefined` and conditionally append.

## Verification checklist

After writing the component:

- [ ] File exists at `packages/ui-react/src/components/[Name].tsx`
- [ ] Every `className` string contains ONLY classes that appear in the pattern-library HTML
- [ ] Every variant in the pattern-library HTML is exposed as a prop value
- [ ] No `style={{...}}`, no CSS modules, no local Tailwind additions
- [ ] No imported hook, state, effect, or context unless the pattern-library HTML has `data-hs-*` attributes requiring client-side Preline initialization (in which case import only the Preline init utility)
- [ ] Barrel export at `packages/ui-react/src/components/index.ts` updated
- [ ] Component rendered in the ui-react Storybook/demo harness (when it exists) shows visual parity with the pattern-library HTML page
- [ ] **Keyboard walkthrough:** every interactive root renders as a native interactive element (`<button>`, `<a>`, `<input>`, etc.) — no `<div role="button">`. Native elements get Enter/Space/focus/disabled for free.
- [ ] **`aria-current` on `.active`:** when the component's `active` prop is true and the component represents a selectable list item, `aria-current="true"` is on the root
- [ ] **`aria-hidden` on decorative icons:** every `<i class="fa-...">` that does not itself carry meaning (i.e., whose meaning is conveyed by adjacent text) has `aria-hidden="true"`
- [ ] **`aria-label` on state-only indicators:** SLA badges, status dots, chevrons that encode state without standalone text get an `aria-label` describing the state in words

## Completion report

```
## Completion Report — Port: [Component Name]

- Pattern-library source: packages/design-system/pattern-library/components/[file].html
- React component: packages/ui-react/src/components/[Name].tsx
- Class list (verbatim from pattern-library): [list]
- Variants exposed as props: [list, or "none"]
- Preline data-hs-* attributes preserved: [list, or "none"]
- Judgment calls: none (required — if any judgment was made, the port was misclassified)
```

If "Judgment calls" is anything other than "none," STOP. Route the task back to the skill that should have made the judgment call (ux-wireframe for copy, haven-mapper for component gaps, ux-design-lead for variant design). Do not ship a port that contained judgment.

## What this skill does NOT do

- Design new components (that's haven-mapper + ux-design-lead for the spec, then haven-pl-builder for the pattern-library HTML)
- Write copy or fill placeholder content (that's ux-design-review or ux-wireframe)
- Decide on prop APIs beyond what the pattern-library HTML dictates
- Add accessibility features the pattern-library HTML doesn't already have (if the HTML is missing ARIA, escalate to `accessibility` expert, do not patch at the port step)
- Run the Vite build or start the dev server (that's task execution, not porting)

## Relationship to other skills

**Upstream:** `haven-pl-builder` produces the pattern-library HTML. `haven-pl-qa` validates it. `haven-mapper` confirms the component fills a real gap.

**Downstream:** The ported React component is consumed by `apps/*` via import. `dev-tasker` may reference the React component in app-composition prompts.

**Peer:** Runs on each pattern-library component once. After Commit B (monorepo scaffold) lands, every component in COMPONENT-INDEX.md transitions through this skill on its way to the `react-ported` registry status.
