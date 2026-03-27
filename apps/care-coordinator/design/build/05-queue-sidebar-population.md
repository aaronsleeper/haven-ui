# Task 05: Queue Sidebar Population

## Scope
App only

## Context
Populates the queue sidebar in the three-panel shell with dummy data: queue summary bar, filter pills, three urgency sections with queue items. Uses components from Task 01.

## Prerequisites
- Task 01 (queue components in pattern library)
- Task 04 (three-panel shell exists)

## Files to Read First
- `apps/care-coordinator/index.html` — current shell
- `pattern-library/components/queue-item.html` — copy HTML from here
- `pattern-library/components/queue-section-header.html` — copy HTML from here
- `apps/care-coordinator/design/wireframes/cc-01-queue-sidebar.md` — content spec
- `apps/care-coordinator/design/review-notes.md` — copy decisions

## Instructions

### Step 1: Add queue summary bar

Replace the placeholder in the left panel's scrollable area with the queue summary bar. This is a simple utility layout — no new component needed:

```html
<!-- Queue summary bar -->
<div class="flex items-center justify-around px-3 py-2 border-b border-gray-100 dark:border-neutral-800">
  <div class="text-center">
    <div class="text-xl font-bold text-red-600 dark:text-red-400">2</div>
    <div class="text-xs text-gray-500">Urgent</div>
  </div>
  <div class="text-center">
    <div class="text-xl font-bold text-amber-600 dark:text-amber-400">7</div>
    <div class="text-xs text-gray-500">Attention</div>
  </div>
  <div class="text-center">
    <div class="text-xl font-bold text-gray-400">3</div>
    <div class="text-xs text-gray-500">Info</div>
  </div>
</div>
```

### Step 2: Add filter pills

Below the summary bar:

```html
<!-- Filter pills -->
<div class="flex items-center gap-1.5 px-3 py-2 overflow-x-auto">
  <button class="filter-pill active">All</button>
  <button class="filter-pill">Referrals</button>
  <button class="filter-pill">Care Plans</button>
  <button class="filter-pill">Clinical</button>
  <div class="hs-dropdown relative inline-flex">
    <button type="button" class="hs-dropdown-toggle filter-pill">
      More <i class="fa-solid fa-chevron-down text-xs ml-0.5"></i>
    </button>
    <div class="hs-dropdown-menu" role="menu">
      <a class="hs-dropdown-item" href="#">Eligibility</a>
      <a class="hs-dropdown-item" href="#">Discharge</a>
      <a class="hs-dropdown-item" href="#">Reports</a>
    </div>
  </div>
</div>
```

### Step 3: Add urgency sections with queue items

Below the filter pills, add three urgency sections with dummy queue items. Use realistic Cena Health data:

**Urgent section (2 items):**
- Maria Garcia — Care Plan — "Care plan ready for final approval" — 2h ago — SLA warning: "Due in 1h"
- Robert Thompson — Eligibility — "Eligibility failed — alternative path available" — 4h ago — SLA breached: "2h overdue"

**Needs Attention section (7 items):**
- Lisa Chen — Referral — "New referral from UConn Health" — 45m ago
- James Wilson — Care Plan — "Care plan update — HbA1c reversal" — 1h ago
- Angela Davis — Discharge — "Program term end — discharge review" — 3h ago
- David Park — Referral — "New referral from Cedars" — 3h ago
- Carmen Ruiz — Communication — "Outbound partner report pending" — 5h ago
- Michael Brown — Clinical — "3 missed check-ins — outreach needed" — 6h ago
- Sarah Kim — Referral — "Referral — missing insurance info" — 8h ago

**Informational section (3 items):**
- Patricia Moore — "Enrolled successfully" — 1h ago
- Thomas Lee — "Delivery confirmed" — 2h ago
- Nancy White — "Lab results imported" — 3h ago

Copy the HTML structure from the pattern library files. Set the first urgent item (Maria Garcia) as `.active`.

## Expected Result
- Queue sidebar populated with 12 dummy items across 3 urgency sections
- Filter pills visible with "More" dropdown
- Summary bar shows counts
- First urgent item highlighted as active
- SLA indicators show warning and breached states

## Verification
- [ ] 12 queue items visible in the sidebar
- [ ] Urgency sections have correct headers with icons
- [ ] SLA warning shows "Due in 1h" in amber
- [ ] SLA breached shows "2h overdue" in red
- [ ] First item has `.active` class with `bg-primary-50`
- [ ] Filter pills render, "More" dropdown opens on click
- [ ] Content truncates gracefully at 240px sidebar width
- [ ] HTML copies from pattern library files — not regenerated
- [ ] ANDREY-README.md updated: not applicable
- [ ] `src/data/_schema-notes.md`: not applicable

## If Something Goes Wrong
- If filter pills overflow, add `overflow-x-auto` and `flex-nowrap` to the container.
- If the "More" dropdown gets clipped by the sidebar overflow, add `z-50` to the dropdown menu.
