# Slice Manifest — 02: three-panel-shell

**Target app:** `apps/care-coordinator/`
**Primary wireframe(s):** `apps/care-coordinator/design/wireframes/cc-shell-layout.md`
**Commit:** TBD (appended after git commit)

## In scope (ships in this slice)

- **Three-panel shell outer container** (wireframe §17–33) — flex row, 240px left, flex-grow center, 380px right
  - Pattern library: `packages/design-system/pattern-library/components/three-panel-shell.html`
  - ui-react: `ThreePanelShell`
- **Left panel slot** (wireframe §36–40) — consumed by existing `QueueSidebar` (shipped in slice 1); 240px fixed width, border-right, independent scroll
  - ui-react: existing `QueueSidebar`
- **Center panel** (wireframe §42–47) — `<main>` landmark with `aria-label="Main content"`; flex-grow, min-w-0, independent scroll; `bg-gray-50` recessed background per wireframe
  - Pattern library: center slot inside `three-panel-shell.html`
  - ui-react: `ThreePanelShellCenter`
- **Right panel (thread placeholder)** (wireframe §49–54) — `<aside>` landmark with `aria-label="Activity thread"`, 380px fixed width, border-left, independent scroll; slice 2 renders only the empty-state inside
  - Pattern library: `packages/design-system/pattern-library/components/thread-panel.html`
  - ui-react: `ThreadPanel`, `ThreadPanelEmpty`
- **Panel focus — click a queue item, center and right update simultaneously** (wireframe §70–72)
  - `App.tsx` keeps `activeId` in React state; passes active name/category/summary to center; swaps right-panel empty-state copy
- **Landmarks and aria-label per wireframe §95–96** — `<main>` for center, `<aside aria-label>` for sidebar and thread panel

## Deferred (explicitly not in this slice, tracked for later)

Walked the wireframe section by section. Every element not in "In scope" above appears here with a reason.

- **Responsive collapse below `lg` — right panel → overlay** (wireframe §66) — reason: overlay/slide-in interaction design is a whole component pattern; requires its own pattern-library entry + focus-trap decisions — tracked as slice-4 responsive-behavior item
- **Responsive collapse below `md` — left sidebar → hamburger** (wireframe §67) — reason: same as above — tracked as slice-4
- **Skeleton loading state** (wireframe §83–86) — queue sidebar skeleton rows, center skeleton card, thread skeleton rows; reason: requires the `skeleton` component which is already in the pattern library but hasn't been ported; tracked as slice-5 when real data wiring begins
- **Error state** (wireframe §88–90) — `alert-error` banner at center-panel top with retry button; reason: depends on real data path; tracked as slice-5
- **Morning summary** (wireframe §45 default center content) — center-panel default when no queue item is active; reason: separate feature (cc-03-morning-summary wireframe) with its own set of components; tracked as slice-3 if we want a real default, or slice-5 when data lands
- **Patient record content in center** (wireframe §45 varying center content) — real record view (cc-04 through cc-09 wireframes); reason: each record type is its own feature; tracked as slices 3+
- **Thread panel content** — the 6 message types (system, tool_call, tool_result, approval_request, approval_response, human) and the approval card pattern; reason: wireframe cc-02-thread-panel is an entire feature on its own; tracked as slice-3
- **Thread input field fixed at bottom** (wireframe §53) — reason: same as above — tracked as slice-3
- **Panel focus-trap when using keyboard navigation** (wireframe §99) — reason: not a WCAG 2.1 AA requirement; needs interaction design for when trap activates; tracked as slice-4 responsive-behavior item
- **Keyboard shortcut to cycle panels** (wireframe §98) — reason: wireframe explicitly says "not at launch — add if coordinator feedback requests it"; tracked as post-launch
- **Sidebar scroll position preservation when switching items** (wireframe §73) — reason: requires scroll state management and route-level state coordination; tracked as slice-5
- **Open question — right panel close/minimize control** (wireframe §102) — reason: not yet decided; keep panel always-visible for slice 2
- **Open question — center panel breadcrumbs** (wireframe §103) — reason: not yet decided; center is a single-view container in slice 2

## Wireframe-vs-design-system reconciliation

- **Thread panel background** — wireframe §54 specifies `bg-white`; design system canonicalizes `bg-sand-50` in the Three-panel surface hierarchy (components.css). Sand-50 wins — the design-system decision is durable and documented; the wireframe suggestion was a reasonable-but-not-binding color call. The thread-panel pattern-library HTML and components.css agree on sand-50.

## Workflow gates applied

- ui-react-porter preconditions met for every ported component: yes — pre-port a11y audit passed on both new pattern-library HTML files (correct root elements, landmarks, aria-labels, list/heading semantics N/A for layout, contrast for the empty-state text verified via text-gray-600)
- app-composer utility-soup rejection clean: yes — `App.tsx` uses only layout utilities (`p-6`, `mt-2`, `mt-4`) plus semantic classes (`section-title`, `prose-section`, `queue-list`). Zero `bg-*`, `text-{color}-*`, `border-{color}-*`, `font-*`, `shadow*`
- Post-slice expert review dispatched (ux-design-lead, design-system-steward, accessibility): pending

## Known gaps at slice-end

- Slice 1's open items (arrow-key nav, aria-live for SLA transitions, whole-queue empty state, etc.) remain open; tracked in slice-01 manifest
- Focus ring not yet browser-verified — severity: should-fix; tracked from slice 1
- Responsive behavior entirely unimplemented — severity: should-fix; tracked as slice-4
- No breakpoint at `lg` means a narrow browser window will overflow horizontally rather than collapse the right panel; acceptable for slice-2 desktop-first scope but surfaces quickly on real use
