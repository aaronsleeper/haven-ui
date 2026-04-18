# Slice Manifest — 01: queue-sidebar

**Target app:** `apps/care-coordinator/`
**Primary wireframe(s):** `apps/care-coordinator/design/wireframes/cc-01-queue-sidebar.md`
**First ship commit:** 83ab145 (initial; failed expert review)
**Iterated commit:** TBD (after phase C+D lands)

## In scope (ships in this slice)

- Queue sidebar shell — `<aside class="queue-sidebar">` with brand header and scrollable body
  - Pattern library: `packages/design-system/pattern-library/components/queue-sidebar.html`
  - ui-react: `QueueSidebar`, `QueueSidebarBrand`, `QueueSidebarBody`
- Three urgency-tiered sections with item counts — `<section aria-labelledby>` + `<h2 class="queue-section-header is-*">`
  - Pattern library: `packages/design-system/pattern-library/components/queue-section-header.html`
  - ui-react: `QueueSectionHeader`
- Queue items with urgency, active, and SLA variants — `<button class="queue-item is-*">`
  - Pattern library: `packages/design-system/pattern-library/components/queue-item.html`
  - ui-react: `QueueItem`
- App composition in `apps/care-coordinator/src/App.tsx` wiring sidebar to placeholder data

## Deferred (explicitly not in this slice, tracked for later)

- **Queue Summary Bar** (wireframe cc-01 §32–40) — 3-count row of tappable urgency counts — reason: out of scope for slice-1; tracked as next-slice item
- **Filter Pills** (wireframe cc-01 §42–50) — category filter pills (All / Referrals / Care Plans / Eligibility / Clinical / Other) — reason: interaction pattern needs its own pattern-library entry + state model; tracked as slice-2
- **Cena Health logo in brand header** (wireframe cc-01 §27) — currently using FA `fa-circle-nodes` as placeholder; tracked as nice-to-have (needs logo asset pipeline decision first)
- **Internal sort** (breached → warning → within-SLA by age) — currently depends on the order of entries in `data/queue.ts`; tracked as slice-2 when real data lands
- **Whole-queue empty state** ("Nothing needs your attention right now.") — currently hides empty sections entirely; tracked as next-slice item
- **Center panel + right thread panel** — the other two panels of the three-panel shell; tracked as slices 2 and 3

## Workflow gates applied

- ui-react-porter preconditions met for every ported component: yes — all four ported entries passed the pre-port a11y audit after phase B fixed the pattern-library HTML
- app-composer utility-soup rejection clean: yes — `App.tsx` uses only layout utilities (`flex`, `min-h-screen`, `flex-1`, `p-8`, `mt-2`, `mt-4`) plus semantic classes (`queue-list`, `section-title`, `prose-section`)
- Post-slice expert review dispatched (ux-design-lead, design-system-steward, accessibility): pending — re-dispatch after this commit

## Known gaps at slice-end

- Logo asset in brand header — using placeholder icon — severity: nice-to-have
- Internal sort not enforced in component — relies on data order — severity: should-fix (surface when real data lands)
- Focus ring specificity not yet battle-tested across browsers — severity: should-fix (verify manually in Chrome/Safari/Firefox before slice-2)
