# Task 09: Build + Typecheck + Visual Verification

## Scope
App only (verification only — no new files created)

## Task class
deterministic

## Model tier
sonnet

## Context
Final verification task for the coordinator agentic-shell upgrade slice. Runs the dev server, typecheck, and conform gates to confirm no regressions, then performs a visual check of the three-pane layout with the queue loaded.

## Prerequisites
- All of Tasks 01–08 must be complete

## Files to Read First
- `apps/care-coordinator/package.json` — confirm `dev` script command
- `.project-docs/verification-checklist.md` — Haven verification checklist

## Instructions

### Step 1 — Run typecheck

```bash
pnpm typecheck
```

Expected: zero errors. If errors appear, read them and fix them before proceeding to Step 2.

### Step 2 — Run fast conform gate

```bash
pnpm --filter @haven/app-care-coordinator conform:fast
```

If `conform:fast` is not defined for this package, run:
```bash
pnpm --filter @haven/design-system conform:css-family
pnpm --filter @haven/design-system conform:brand-fonts
```

Expected: no violations. If violations appear, fix them and re-run.

### Step 3 — Start dev server

```bash
pnpm --filter @haven/app-care-coordinator dev
```

Open http://localhost:5174 in the browser. If the port is already in use, check for a running process (`lsof -i :5174`) and kill it.

### Step 4 — Visual verification checklist

With the app running at http://localhost:5174, verify in the browser:

**Three-panel layout:**
- [ ] Three panes visible: left (queue), center (record/empty state), right (thread/empty state)
- [ ] Left and right panel splitter handles are visible; drag resizes the adjacent pane
- [ ] Panel widths clamp correctly: left stays between 220–320px; right stays between 480–800px

**Queue panel (left):**
- [ ] Cena Health wordmark visible in `nav-header` / `queue-sidebar-brand`
- [ ] Five filter pills render: All, Referrals, Care plans, Discharges, Insurance
- [ ] "All" pill is active by default
- [ ] Three urgency section headers render: "Urgent" (red icon), "Needs Attention" (amber icon), "Informational" (sand icon)
- [ ] Section headers are `<h2>` elements with count badges
- [ ] Queue items render under each section with correct urgency styling
- [ ] Click "Referrals" filter: only referral items visible
- [ ] Click "All": all items restored
- [ ] Reload page: filter persists (reads from localStorage)
- [ ] Secondary nav links visible below queue: Patients, Reports, Settings
- [ ] User menu at bottom: avatar + "Sarah K." + dropdown with Profile, Help, Sign out
- [ ] User dropdown opens when clicked; closes when clicking outside

**Center pane (record viewer):**
- [ ] With no item selected: empty-state renders ("Pick a queue item to start.")
- [ ] Clicking a queue item: center pane loads the care plan record or record stub
- [ ] `record-header` visible when a care-plan item is selected (Lora font heading)

**Right pane (thread):**
- [ ] With no item selected: `thread-panel-empty` renders
- [ ] Clicking the urgent queue item (Maria Rivera): thread loads with approval card
- [ ] Approval card is visible without manual scroll (auto-scroll on first open)
- [ ] Approval card actions in order: Approve → Edit first → Reassign → Reject (Reject rightmost, with gap)
- [ ] Clicking Reject: note field expands below actions
- [ ] `thread-msg-tool` events render collapsed by default
- [ ] Clicking Approve: undo toast appears at viewport level (not clipped by panel)
- [ ] Undo toast has Undo link; clicking it restores the card
- [ ] Undo toast auto-dismisses after 5 seconds

**Empty states:**
- [ ] With all items filtered out (try a filter that has no items): full empty state renders with "Nothing needs your attention right now"
- [ ] If one tier is empty: per-tier note renders below that section's header

### Step 5 — Confirm no console errors

In browser devtools: check console. Expected: no errors, no React prop warnings.

Acceptable: Preline initialization log (if any), HMR messages.

### Known Constraints
- Do NOT edit any files in this task unless fixing a typecheck error or conform violation.
- Do NOT commit in this task — wait for Aaron's review.

## Expected Result
All verification checks pass. App renders three panes with correct queue content, approval card, auto-scroll, empty states, and toast portal. No typecheck errors. No conform violations.

## Verification
- [ ] `pnpm typecheck` passes with 0 errors
- [ ] `conform:fast` passes (or no violations on checked gates)
- [ ] Dev server starts at http://localhost:5174 without errors
- [ ] All browser visual checks from Step 4 pass
- [ ] No console errors in browser
- [ ] HTML classes are semantic — no utility chains visible on styled elements in DOM inspector
- [ ] Dark mode variants present — toggle dark mode (if OS setting) and verify queue sidebar, approval card, and empty states render legibly
- [ ] `_schema-notes.md` — not applicable

## Completion Report

```
## Completion Report — Task 09: Build + Typecheck + Visual Verification

- New semantic classes added to components.css: none
- Existing classes modified: none
- Pattern library files created or updated: none
- Judgment calls: none
- Dark mode added: not applicable (verification only)
- Schema delta logged: not applicable
- Visual checks passed: [list which passed, which failed if any]
- Typecheck result: [0 errors / N errors (listed)]
- Conform result: [pass / N violations (listed)]
- Items deferred or incomplete: [list any for Stage 5 tracking, or "none"]
```

## If Something Goes Wrong
- If typecheck fails with module-not-found for `@haven/ui-react`: run `pnpm install` at the repo root, then retry.
- If dev server fails with port conflict: check `lsof -i :5174`; kill the process if it's a stale instance.
- If the auto-scroll does not fire: recheck Task 08's `useEffect` dependency array — `activeId` must be in the array.
- If the toast is behind the panels (z-index): add `z-50` utility to the toast container wrapper in `ThreadUndoBar.tsx` (layout-only).
- If filter pills overflow the sidebar: check `flex-wrap` is on the pill container — should wrap correctly per Task 04.
