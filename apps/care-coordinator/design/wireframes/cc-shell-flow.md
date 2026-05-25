---
shells:
  - name: agentic-shell
    pl_shell_version: sha256:ad941b49f775658633dc7e30121545c3a092fb6d712a7fd1c37167c6d3346940
---

# Screen Flow: Care Coordinator Shell + Per-App Minimums

## Screens in This Feature

| ID | Name | Route | Persona | Shell |
|----|------|-------|---------|-------|
| shell-cc-coordinator | Coordinator-specific shell | `/` (persistent) | Care Coordinator | Universal agentic-shell rich base |
| cc-01-queue-with-care-plan-approval | Queue + Maria Rivera record + care-plan approval card (worked example) | `/patients/maria-rivera/care-plan` | Care Coordinator | shell-cc-coordinator |

Existing shipped wireframes (cc-01-queue-sidebar through cc-09-patient-list) cover queue + record-viewer + approval-card content; this pass updates the shell to the agentic-shell rich base and adds the worked example. The earlier `cc-shell-layout.md` is superseded by `shell-cc-coordinator.md` (this pass).

## Navigation Flows

- App open → shell-cc-coordinator renders → left = queue (3 urgency tiers) + secondary nav, center = morning summary, right = empty-state thread
- shell-cc-coordinator (queue clicked: Maria Rivera "Care plan ready for final approval") → cc-01-queue-with-care-plan-approval (queue item active, center loads care plan record, right loads thread with approval card)
- cc-01-queue-with-care-plan-approval (Approve clicked) → 5-second undo toast → decision logs → queue item resolves → next urgent item highlights but does not auto-open
- cc-01-queue-with-care-plan-approval (Edit first clicked) → inline edits in center → returns to Approve flow
- cc-01-queue-with-care-plan-approval (Reject clicked) → note required → decision logs as `thread-msg-response.is-rejected`
- cc-01-queue-with-care-plan-approval (Reassign clicked) → routes to selected coordinator's queue → item disappears from current view

## Shared Shell Components

- `shell-cc-coordinator.md` — coordinator-specific shell (this pass) inheriting from `apps/_shared/design/wireframes/shell-universal-agentic.md`
- Existing primitives shipped in PL: `queue-sidebar`, `queue-section-header` (with `.is-urgent` / `.is-attention` / `.is-info`), `queue-item` (with urgency + SLA modifiers), `thread-panel`, `thread-msg-*`, `thread-approval-card` (with `.is-urgent` / `.is-warning` / `.is-historical`), `prompt-input-container`, `record-header`, `editable-indicator`

## Out of Scope

- cc-shell-layout.md (the bare three-panel-shell version) — superseded; left in place as historical reference until dev-tasker sequences the upgrade slice
- cc-02-thread-panel.md (separate spec) — content covered here in shell-cc-coordinator
- The other shipped per-record wireframes (cc-03 through cc-09) — they remain valid; this pass does not redesign them
- Mobile coordinator view — coordinator is desktop-primary; mobile rare per shell-use-cases.md
