---
slot: 10
slot-name: state-and-transition-spec (Today)
primary-author: Interaction Designer
project: cena-platform
surface: today
created: 2026-05-26
status: in-review
consumes:
  - slots/today/ia.md
  - slots/_app/content-model.md
  - slots/_app/surface-shell-model.md
folds-in: [flows (9), wireframes (11), a11y (13), strings (14), component-plan (17)]
---

# Today — State & Transition Spec

Per-screen state machine + the primitives each state composes (PL-only; copy, don't generate). Register: **professional coordinator** — operational urgency color is allowed and wanted (NOT the patient-app calm/no-alarm frame).

## State set

| State | Trigger | Content | Built page |
|---|---|---|---|
| **queue** (default/hero) | ≥1 pending pushed item | four queue groups, each a `queue-section-header` + `queue-list` of `queue-item`s; urgency-sorted within + across groups; counts as secondary glance | `today.queue.html` |
| **caught-up** | all four queues clear | quiet professional all-clear (`data-empty-state`): "You're caught up — no pending work." + standing-glance stat row (counts) below; NO ceremony, NO patient-app affirmation tone | `today.caught-up.html` |
| **loading** | before queue resolves | `data-skeleton` rows in each group region; topbar + sidebar render immediately | spec-only (not built unless warranted) |
| **error** | queue fetch fails | `alert` (error) "Couldn't load the work queue." + retry + queues fall back to last-known if available | spec-only |

## Per-state composition (component-plan, folded)

### `today.queue.html` (hero)
- **Shell:** `layout-app-shell-responsive` per surface-shell-model — sidebar (Today active, queue-count badge), topbar (patient search + work-queue badge + user/role).
- **Page head:** `page-header` + `page-title` "Today" + a one-line date/context sub-label.
- **Standing glance (subordinate):** a `stat-group` row of counts (e.g. Active patients · Open referrals · Orders today · Weeks at cutoff) — small, above or beside the queue, explicitly secondary to actionable cards.
- **Queue groups (the hero):** four blocks, each:
  - `queue-section-header` (with `.is-urgent` / `.is-attention` / `.is-info` per group's top urgency) naming the group + count.
  - `queue-list` (`<ul>`) of `queue-item` (`<button>` in `<li>`) — `queue-item-header` / `-name` / `-summary` / `-meta`; urgency modifier `.is-urgent` / `.is-attention` / `.is-info`; SLA `.is-warning` / `.is-breached` where a deadline applies (cutoffs, SLA-bound referrals).
  - Each `queue-item` deep-links into its entity (href to the target surface page).
- **Group order + sort:** most-urgent group first; within a group, `.is-breached` → `.is-urgent` → `.is-warning` → rest. Patient alerts and order exceptions typically lead; due-cutoffs escalate as the date nears.
- **Overflow:** long groups show top N + a "View all in [surface]" `text-link` (no infinite pile on the launchpad — it routes to the full list).

### `today.caught-up.html`
- Same shell. `page-header`/`page-title` "Today".
- `data-empty-state` (`empty-state` + `empty-state-icon`) — plain professional copy ("You're caught up. No pending alerts, referrals, exceptions, or due items.").
- The standing-glance `stat-group` row remains (the coordinator still wants the at-a-glance counts even when the queue is clear).

## Transitions

- `loading → {queue | caught-up}` once the queue resolves.
- `queue → caught-up` as items are actioned/cleared (each card, once handled in its entity, leaves the queue).
- `caught-up → queue` when a new pushed item arrives (badge count increments).
- `* → error` on fetch failure; recover to `queue`/`caught-up` when data resolves. Error is operationally plain (not suppressed-calm like the patient app, not panic-red full-surface).

## Invariants (carry to acceptance + a11y)

- **Furniture stable across states** — sidebar (7 anchors), topbar (search + badge + user) never appear/disappear; only the queue/empty region changes.
- **Today never becomes a workspace** — no inline complete-the-work affordances on cards beyond deep-link + at-most-one quick triage action (e.g. "snooze"/"acknowledge"); the work completes in the entity.
- **Counts are subordinate to cards** — the vanity-dashboard failure mode is counts-as-hero; here actionable cards lead, counts glance.
- **Hard relationship to urgency color** — `.is-urgent`/`.is-breached` red is reserved for genuine operational urgency (SLA breach, fired clinical alert), not decoration.
- **A11y:** each `queue-item` is a `<button>` with an accessible name = "{type}: {who/what} — {summary}"; SLA icon `aria-hidden`, SLA span carries `aria-label`; `queue-section-header` renders as `<h2>`; the work-queue badge count has an `aria-label` ("3 items need attention"). Keyboard: queue is a list of focusable buttons in urgency order; skip-link to main.
- **Strings (voice):** professional/operational — "Order exception · 3 orders unfulfilled", "Referral pending review · Hartford Community Health", "Cutoff in 6h · Week of June 2". No plain-language simplification; no gamification.

## Open / watch

- **Snooze/acknowledge inline action** — decide at wireframe/build whether Today cards carry a single quick-triage verb (acknowledge an alert, snooze a due item) vs. pure deep-link. Default: pure deep-link + the entity owns the action; revisit if a coordinator workflow clearly needs an inline ack. Folded here as a flagged interaction decision.
- **Build Today LAST** (per build order) — its deep-link href targets are finalized once the entity surfaces' pages exist.
