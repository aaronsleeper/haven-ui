# Build Tasks: Care Coordinator — Agentic Shell Upgrade (Pipeline Stage 4)

**Date:** 2026-05-04
**Source:** `component-map-shell-pipeline.md`, `wireframes/shell-cc-coordinator.md`, `wireframes/cc-01-queue-with-care-plan-approval.md`
**Target:** `apps/care-coordinator/` (React, port 5174)
**Tier:** Tier 2 — Slice composition. Zero PL gaps. All primitives exist in COMPONENT-INDEX and components.css.
**Stage:** Pipeline Stage 4 (dev-tasker output)

---

## Task Summary

**Total tasks:** 9
**New PL components:** 0 (zero gaps confirmed Stage 3)
**App-only composition tasks:** 9
**Class distribution:** 8 deterministic / 1 generative
**Estimated complexity:** Moderate
**Estimated total build time:** ~45–60 min (8 deterministic × 3–5 min + 1 generative × 10–15 min)

---

## Build Phases

### Phase 1 — Shell + splitter wiring (Tasks 01–03)
Must run first. All later tasks assume three-pane layout is correctly bound and splitter JS is active.

### Phase 2 — Queue sidebar upgrade (Tasks 04–06)
Requires Phase 1. Adds filter pills, urgency section headers, secondary nav, user menu, and empty states. Task 06 is generative (empty-state copy requires judgment).

### Phase 3 — Thread + approval card upgrade (Tasks 07–08)
Requires Phase 1. Fixes action ordering per NN/G locked decision; wires auto-scroll + document-level toast portal.

### Phase 4 — Verification (Task 09)
Requires Phases 1–3. Build check + typecheck + visual verification.

---

## Execution Order

| # | Task | Scope | File(s) Modified | Depends On | Class | Model | Status |
|---|------|-------|-----------------|------------|-------|-------|--------|
| 01 | Audit AgenticShell import and panel landmarks | App only | `App.tsx` (read + patch if needed) | — | deterministic | haiku | ☐ |
| 02 | Wire queue data to QueueSectionHeader + urgency sections | App only | `App.tsx` | 01 | deterministic | haiku | ☐ |
| 03 | Confirm panel-splitter JS initializes post-mount | App only | `src/main.tsx` | 01 | deterministic | haiku | ☐ |
| 04 | Add filter pills row with per-user persistence stub | App only | `App.tsx` | 02 | deterministic | haiku | ☐ |
| 05 | Add secondary nav + user dropdown to queue panel | App only | `App.tsx` | 02 | deterministic | sonnet | ☐ |
| 06 | Add queue empty-states (full queue empty + per-tier empty) | App only | `App.tsx` | 04, 05 | generative | opus | ☐ |
| 07 | Fix approval card action ordering (NN/G dangerous-UX) | App only | `src/components/thread/ThreadMessageList.tsx` | 01 | deterministic | haiku | ☐ |
| 08 | Wire approval card auto-scroll + document-level toast portal | App only | `App.tsx`, `src/components/thread/ThreadUndoBar.tsx` | 07 | deterministic | sonnet | ☐ |
| 09 | Build + typecheck + visual verification | App only | — (verification only) | 01–08 | deterministic | sonnet | ☐ |

---

## Post-Build

- [ ] Run `pnpm --filter @haven/app-care-coordinator dev` → http://localhost:5174
- [ ] Visual: three panes render; queue shows urgency sections; approval card present in right pane
- [ ] Run `pnpm typecheck`
- [ ] Run `pnpm --filter @haven/app-care-coordinator conform:fast`
- [ ] Dispatch post-build ux-design-review (required for Tier 2 slice after QA gates pass)

---

## Notes

- Existing `App.tsx` already imports `AgenticShell` from `@haven/ui-react`. Tasks 01–03 verify correctness, not rewrite.
- Toast portal must be document-level (not inside `<aside>`) — verify `ThreadUndoBar` renders via `ReactDOM.createPortal` in Task 08.
- Splitter keyboard increment: 16px — check `panel-splitter.js` step config.
- Filter persistence: per-user via `localStorage` key `user_prefs.queue_filter` until real persistence layer exists (locked decision).
- Reassign scope: team-only at v1 — note in modal when wired; modal itself is out of scope for this task list.
- Tool-call default-collapsed: verify `data-hs-collapse` is active on `thread-msg-tool` rows in `ThreadMessageList.tsx` — if not, wire it in Task 07.
- Prior task-list (2026-03-27): `task-list.md` — covers queue-triage phase; do not re-run those tasks.
