# Task 07: Morning Summary Center Panel

## Scope
App only

## Context
Populates the center panel with the morning summary card — the coordinator's orientation view when no queue item is selected. Uses existing Haven card, stat-card, list-group, and section-title components.

## Prerequisites
- Task 04 (three-panel shell exists)

## Files to Read First
- `apps/care-coordinator/index.html` — current shell
- `apps/care-coordinator/design/wireframes/cc-03-morning-summary.md` — content spec
- `apps/care-coordinator/design/review-notes.md` — copy decisions
- `pattern-library/components/layout-card.html` — card structure
- `pattern-library/components/layout-stat-card.html` — stat card structure
- `pattern-library/components/data-list-group.html` — list group structure

## Instructions

### Step 1: Add morning summary card to center panel

Replace the placeholder in the center panel with the summary card. All components are existing Haven patterns — no new semantic classes needed.

**Structure:**

```html
<div class="max-w-2xl mx-auto p-6">
  <div class="card">
    <!-- Card header: greeting -->
    <div class="card-header">
      <h1 class="card-title text-lg">Good morning, Sarah</h1>
      <p class="card-subtitle">Thursday, March 27</p>
    </div>

    <div class="card-body space-y-6">

      <!-- Queue counts -->
      <div class="grid grid-cols-3 gap-4">
        <div class="card-stat">
          <div class="stat-value text-2xl text-red-600 dark:text-red-400">2</div>
          <div class="stat-label">Urgent</div>
        </div>
        <div class="card-stat">
          <div class="stat-value text-2xl text-amber-600 dark:text-amber-400">7</div>
          <div class="stat-label">Needs attention</div>
        </div>
        <div class="card-stat">
          <div class="stat-value text-2xl text-gray-400">3</div>
          <div class="stat-label">Informational</div>
        </div>
      </div>

      <!-- Urgent items preview -->
      <div>
        <p class="text-xs font-semibold uppercase tracking-wide text-red-700 dark:text-red-400 mb-2">
          Urgent items
        </p>
        <div class="list-group list-group-flush">
          <div class="list-group-item list-group-item-action">
            <div class="list-group-item-content">
              <div class="list-group-item-title">Maria Garcia — Care Plan</div>
              <div class="list-group-item-description">Care plan ready for final approval</div>
            </div>
            <div class="list-group-item-trailing">
              <span class="text-xs text-amber-600 font-medium dark:text-amber-400">Due in 1h</span>
            </div>
          </div>
          <div class="list-group-item list-group-item-action">
            <div class="list-group-item-content">
              <div class="list-group-item-title">Robert Thompson — Eligibility</div>
              <div class="list-group-item-description">Eligibility failed — alternative path available</div>
            </div>
            <div class="list-group-item-trailing">
              <span class="text-xs text-red-600 font-medium dark:text-red-400">2h overdue</span>
            </div>
          </div>
        </div>
      </div>

      <div class="divider-compact"></div>

      <!-- Today's scheduled items -->
      <div>
        <h3 class="section-title">Today</h3>
        <div class="space-y-2 mt-2">
          <div class="flex items-center gap-3">
            <span class="text-sm font-medium text-gray-500 dark:text-gray-400 w-16 shrink-0">10:00am</span>
            <span class="text-sm text-gray-900 dark:text-gray-100">RDN visit — Maria Garcia</span>
          </div>
          <div class="flex items-center gap-3">
            <span class="text-sm font-medium text-gray-500 dark:text-gray-400 w-16 shrink-0">2:00pm</span>
            <span class="text-sm text-gray-900 dark:text-gray-100">Partner call — UConn Health check-in</span>
          </div>
          <div class="flex items-center gap-3">
            <span class="text-sm font-medium text-gray-500 dark:text-gray-400 w-16 shrink-0">4:00pm</span>
            <span class="text-sm text-gray-900 dark:text-gray-100">Report review — Q1 outcomes (Cedars)</span>
          </div>
        </div>
      </div>

    </div>
  </div>
</div>
```

**Notes:**
- `max-w-2xl mx-auto` centers the card in the wide center panel
- All components are existing Haven patterns
- Stat card values use urgency colors directly (not badge classes)
- Urgent items use `list-group-item-action` for clickable appearance
- Scheduled items use a simple flex layout — no new component needed

## Expected Result
- Center panel shows the morning summary card
- Queue counts match the sidebar counts (2, 7, 3)
- Urgent items preview lists the same 2 urgent items from the sidebar
- Scheduled items show 3 time-stamped events
- Card is centered and comfortable to read

## Verification
- [ ] Morning summary card renders in center panel
- [ ] 3 stat cards with urgency-colored counts
- [ ] 2 urgent item previews with SLA indicators
- [ ] 3 scheduled items with times
- [ ] `divider-compact` separates sections
- [ ] All components are existing Haven patterns — no new classes added
- [ ] Dark mode renders correctly
- [ ] Card is centered with `max-w-2xl mx-auto`
- [ ] HTML classes are semantic
- [ ] ANDREY-README.md updated: not applicable
- [ ] `src/data/_schema-notes.md`: not applicable

## If Something Goes Wrong
- If stat cards don't align, check that `card-stat` exists and isn't being overridden by another style.
- If list-group items don't have borders, ensure `list-group-flush` is on the container.
