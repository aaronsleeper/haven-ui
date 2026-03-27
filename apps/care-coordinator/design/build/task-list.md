# Build Tasks: Care Coordinator Queue Triage

**Date:** 2026-03-27
**Source:** `component-map.md`, wireframes, new-components specs
**Target:** haven-ui

## Task Summary

**Total tasks:** 7
**New components:** 4 tasks (01-04)
**Screen builds:** 3 tasks (05-07)
**Estimated complexity:** Moderate

## Execution Order

| # | Task | Scope | File(s) Modified | Depends On | Status |
|---|------|-------|-----------------|------------|--------|
| 01 | Queue components CSS + pattern library | Pattern + CSS | `components.css`, `pattern-library/components/queue-item.html`, `queue-section-header.html`, `COMPONENT-INDEX.md` | — | ☐ |
| 02 | Thread message components CSS + pattern library | Pattern + CSS | `components.css`, `pattern-library/components/thread-msg-*.html` (4 files), `COMPONENT-INDEX.md` | — | ☐ |
| 03 | Thread approval card CSS + pattern library | Pattern + CSS | `components.css`, `pattern-library/components/thread-approval-card.html`, `COMPONENT-INDEX.md` | — | ☐ |
| 04 | Three-panel shell layout | App | `apps/care-coordinator/index.html` | 01, 02, 03 | ☐ |
| 05 | Queue sidebar population | App | `apps/care-coordinator/index.html` | 04 | ☐ |
| 06 | Thread panel population | App | `apps/care-coordinator/index.html` | 04 | ☐ |
| 07 | Morning summary center panel | App | `apps/care-coordinator/index.html` | 04 | ☐ |

**Note:** Tasks 01, 02, and 03 have no dependencies on each other and can run in parallel. Tasks 05, 06, 07 can also run in parallel after 04.

## Post-Build
- [ ] Run build: `npm run build`
- [ ] Verify compiled output in `dist/`
- [ ] Run ux-design-review (post-build mode)

## Notes
- All new components go in `components.css` — no separate CSS files
- Preline JS needed for `hs-collapse` on tool call and approval response expand/collapse
- The three-panel shell does NOT use `app-sidebar` fixed positioning — it uses flex layout so all three panels participate in the same row
- Existing `next-task.md` has an unfinished patient dashboard task — this build creates a new working scope, not a replacement
