---
slot: 10
slot-name: state-and-transition-spec (Home)
primary-author: Interaction Designer
project: cena-uconn-patient-app
surface: home
created: 2026-05-25
status: in-review
consumes:
  - slots/home/ia.md
  - slots/_app/content-model.md
  - slots/_app/surface-shell-model.md
inputs-hash: null
friction: []
pre-flight-authority: aaron
---

# Home — State & Transition Spec

Per-screen state machine. The **content states** (caught-up / one-item / several / first-run) are owned by `patient-app-home-surface.md` §3 (ratified) — referenced, not restated. This doc adds the **system states** the slot-10 contract requires (loading / partial / error / permission / offline) that the design prior does not fully cover, and the transitions between all states.

## State set

| State | Trigger | Reserved-zone content | Furniture |
|---|---|---|---|
| **loading** | app open, before Surfacer resolves | a calm skeleton in the things-to-do zone (no spinner-anxiety); greeting renders immediately from cached name | stable (tiles show last-known or skeleton) |
| **caught-up** (default) | nothing due | calm affirmation block (home-surface §3a) | stable |
| **one-item** | exactly one admitted item | single focus card (§3b) | stable |
| **several** | ≥2 admitted items | one focus card + collapsed "A couple of other things" `<details>` (§3c); **hard cap ≤3 surfaced** | stable |
| **first-run** | consent (cap-12) not yet acknowledged | full-canvas consent moment (§3d); steady furniture suppressed | suppressed until consent |
| **partial** | tiles resolve but Surfacer data is stale/unavailable | things-to-do zone shows caught-up affirmation (fail-safe to calm, never to error) | tiles render last-known with a quiet "updated a while ago" if needed |
| **error** | Surfacer fetch fails | calm, non-alarming line: "We're having trouble loading right now." + "Talk to a person" prominent; **never** red-alert | stable; furniture still navigable |
| **permission** | OS notification permission not granted | no nag; a quiet one-time inline offer at most; never blocks Home | stable |
| **offline** | no connectivity | last-known tiles + "You're offline — we'll catch up when you're back." | stable; outbound actions queue or disable gracefully |

## Transitions

- `loading → {caught-up | one-item | several | first-run}` once Surfacer + consent resolve.
- `first-run → caught-up|one-item` after consent acknowledged (gentle "You're all set, Maria — here's your home").
- `several → one-item → caught-up` as items are completed/dismissed; **completion lands in calm** (the zone recedes to the affirmation; "That's taken care of." — no celebration).
- `* → error|offline|partial` on data/connectivity failure; **fail-safe to calm**, not to alarm. Recovery transitions back when data resolves.
- `"Not now"` on a card → item recedes, remembered (no re-surface next open); does not advance urgency styling.

## Invariants (carry to acceptance + a11y)

- **Furniture is stable across all content states** — tiles, doors, "Talk to a person", tabs do not appear/disappear (no flicker). Only the reserved things-to-do zone + greeting change.
- **No state uses red-alert / overdue styling.** Error and deadline-near states stay plain.
- **Caught-up is the designed-for default**, not an empty fallback. partial/error fail-safe *to* caught-up's calm, never to a sad empty box.
- **Hard cap ≤3** surfaced items (incl. focus card); overflow waits, never piles.
- **"Talk to a person" reachable in every state**, including first-run and error.
