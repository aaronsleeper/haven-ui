# Stage 4: Dev-Tasker Output — Care Coordinator Agentic Shell Upgrade

**Date:** 2026-05-04
**Pipeline stage:** Stage 4 (dev-tasker) — complete
**Scope:** Care coordinator only (patient routes are parallel; separate dispatch)
**Input:** Stage 3 component map + 3 wireframes + locked decisions from Gate 2-review
**Output:** 9 task prompts + 1 task list + 1 slice manifest

---

## Task Summary

| Metric | Value |
|--------|-------|
| Total tasks | 9 |
| Deterministic | 8 |
| Generative | 1 (Task 06 — empty-state copy + component tree judgment) |
| New PL components | 0 (zero gaps — confirmed Stage 3) |
| App-only composition | 9 |
| Estimated build time | 45–65 minutes total |
| Estimated complexity | Moderate |

---

## Classification Distribution

- **Deterministic (8):** Tasks 01, 02, 03, 04, 05, 07, 08, 09 — all fully specified by inputs; no judgment needed
- **Generative (1):** Task 06 — empty-state layout + copy rendering requires judgment on full-empty vs per-tier display logic and icon color selection; copy is locked but component-tree wiring is novel

The single generative task (06) is isolated and well-constrained. The locked copy for the full-empty state removes the highest-risk generative surface. The only open judgment is how to transition between full-empty and per-tier states in the React component tree — which is a standard conditional-render decision.

---

## Build Phases

| Phase | Tasks | Rationale |
|-------|-------|-----------|
| Phase 1 — Shell + splitter | 01, 02, 03 | Must run first; later tasks assume shell structure is correct |
| Phase 2 — Queue sidebar | 04, 05, 06 | Requires Phase 1; adds filter pills, nav, user menu, empty states |
| Phase 3 — Thread upgrade | 07, 08 | Requires Phase 1; independent of Phase 2 |
| Phase 4 — Verification | 09 | Requires all prior phases |

Tasks 04–06 and 07–08 are in parallel dependency graphs (both depend on Phase 1 but not each other). A single build track runs them in sequence; two tracks could parallelize Phase 2 and Phase 3.

---

## Estimated Build Time Per Phase

| Phase | Tasks | Est. time |
|-------|-------|-----------|
| Phase 1 | 01–03 | 10–15 min (all haiku) |
| Phase 2 | 04–05 (deterministic) | 10–15 min |
| Phase 2 | 06 (generative, opus) | 10–15 min |
| Phase 3 | 07–08 | 10–15 min |
| Phase 4 | 09 (verification) | 10 min |
| **Total** | | **~50–70 min** |

---

## Files Created

| File | Purpose |
|------|---------|
| `apps/care-coordinator/design/build/shell-upgrade-task-list.md` | Task list with execution order, dependencies, class + model tier per task |
| `apps/care-coordinator/design/build/01-audit-agentic-shell-landmarks.md` | Task 01 prompt |
| `apps/care-coordinator/design/build/02-wire-queue-urgency-sections.md` | Task 02 prompt |
| `apps/care-coordinator/design/build/03-confirm-panel-splitter-js-init.md` | Task 03 prompt |
| `apps/care-coordinator/design/build/04-add-filter-pills-row.md` | Task 04 prompt |
| `apps/care-coordinator/design/build/05-add-secondary-nav-and-user-menu.md` | Task 05 prompt |
| `apps/care-coordinator/design/build/06-add-queue-empty-states.md` | Task 06 prompt (generative) |
| `apps/care-coordinator/design/build/07-fix-approval-card-action-ordering.md` | Task 07 prompt |
| `apps/care-coordinator/design/build/08-wire-auto-scroll-and-toast-portal.md` | Task 08 prompt |
| `apps/care-coordinator/design/build/09-build-verification.md` | Task 09 verification prompt |
| `apps/care-coordinator/design/slices/cc-shell-upgrade/manifest.md` | Slice manifest — in-scope / deferred / gaps / expert verdict slots |
| `apps/_shared/design/2026-05-04-shell-pipeline-stage-4-coordinator-tasks.md` | This summary |

---

## Prerequisite for Stage 5 (Build)

The task list is ready for execution. Before Aaron runs Stage 5:

### Confirmed ready
- All 9 task prompts are complete, self-contained, and executable in 1–3 min each.
- All task prompts include: scope, task class, model tier, "Files to Read First", step-by-step instructions, verification checklist, completion report template.
- All locked decisions are embedded in each relevant task's "Known Constraints" block.
- Zero PL gaps — no new `components.css` entries needed; all classes confirmed in COMPONENT-INDEX.

### Ambiguities / Aaron needs to call before Stage 5

**Q1 — `panel-splitter.js` import path:** Task 03 assumes `packages/design-system/src/scripts/components/panel-splitter.js` is importable from the care-coordinator Vite app. If Vite's path aliases don't expose design-system scripts directly, Task 03 will need to use a relative path or the scripts will need to be re-exported. Claude Code should read `apps/care-coordinator/vite.config.ts` in Task 03 and resolve this — it should be self-healing.

**Q2 — `ThreadUndoBar.tsx` current portal status:** Task 08 assumes `ThreadUndoBar` does NOT already use `ReactDOM.createPortal`. If it does already portal to `document.body`, Task 08 becomes a verification-only task with no code change. Claude Code reads the file first and self-resolves — no pre-call needed.

**Q3 — `thread-msg-tool` collapse mechanism:** Task 07 checks whether tool-call collapse is via Preline `data-hs-collapse` or React state. Either is acceptable per the task spec. Claude Code reads `ThreadMessageList.tsx` and verifies — no pre-call needed.

**Q4 — Reassign modal** is explicitly deferred from this slice (tracked in manifest). Confirm Aaron is OK with Reassign button doing nothing at the end of this slice, with the modal wired in a follow-up slice (`cc-reassign-modal`).

---

## Locked Decisions Embedded in Tasks

All locked decisions from Gate 2-review are embedded in the relevant task's "Known Constraints" section:

| Decision | Task(s) |
|----------|---------|
| Action ordering: `[Approve][Edit first][Reassign][Reject]`, Reject rightmost + 16px gap | Task 07 |
| Undo window: 5s coordinator | Task 08 |
| Toast portal: document-level (not inside `<aside>`) | Task 08 |
| Splitter keyboard increment: 16px | Task 03 |
| Filter persistence: per-user (`localStorage`) | Task 04 |
| Reassign scope: team-only at v1 | Task 05 (noted), manifest (deferred) |
| Tool-call thread events: default-collapsed | Task 07 |
| Auto-scroll to active approval card on first record-open | Task 08 |

---

## Stage 4 Sign-off

Stage 4 is complete. 9 task prompts authored. Slice manifest complete with full wireframe-delta walk. Summary doc complete. No open questions that block execution — all ambiguities are self-resolving by reading files in the task's first step. Task list is ready for Stage 5 (build).
