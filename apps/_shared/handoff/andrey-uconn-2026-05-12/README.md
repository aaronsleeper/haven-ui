# Agentic Shell — Handoff Bundle (2026-05-12)

Self-contained 3-column agentic-shell HTML template for the Cena Health patient UI supporting the UConn pilot. Use this as the layout starting point — fill the panes with your own content.

## Contents

| File | Purpose |
|---|---|
| `agentic-shell-template.html` | Layout HTML. 3 panes + splitters + nav-header with logo. Empty slots marked with HTML comments. |
| `haven-shell.css` | Self-contained stylesheet. Tokens, body reset, shell + pane classes, splitter, nav chrome. Plain CSS — no Tailwind compilation needed. |
| `logo-cenahealth-teal.svg` | Cena Health wordmark. Drop-in for the nav header. |

Open `agentic-shell-template.html` directly in a browser — no build step.

## Architecture (one minute)

The shell expresses Haven's pages-float vocabulary via surface luminance:

- Outer `.app-shell.app-shell--agentic` provides 1rem padding AND a darker sand-200 (v2-canonical) ground around the shell. The ground is what carries the "page floats" effect.
- `.agentic-shell` keeps only the 11px border-radius — no border. It floats above the ground because its panes are translucent white over a darker surface, not because a line draws around it.
- Inside the shell, three direct flex children:
  - `.panel-nav` (left, chrome surface, sand-100 — one step lighter than the ground; reads as the persistent chrome rail)
  - `.panel-chat` (center, pane surface, translucent white over ground — the agent thread)
  - `.panel-content` (right, pane surface, translucent white — the contextual artifact opened by the agent)
- Between each pair, a `.panel-splitter` div (1px static, thickens to 3px teal-500 on hover).

This reconciles DESIGN.md §Pages-float — the spec's earlier "3px sand-150 border + border-radius" treatment was retired 2026-05-12 because it produced a "frame around frame" effect against the light body bg. Surface contrast does the job more cleanly.

## Slots — where content goes

| Slot | Empty marker in HTML | Typical content |
|---|---|---|
| Nav sections | `<!-- Slot: nav sections + nav items go here -->` | `.nav-section` blocks containing `.nav-section-label` + `.nav-item` rows |
| Chat thread | `<!-- Slot: thread content goes here -->` | Agent messages, user messages, tool calls — sit inside `.chat-thread-inner` |
| Chat composer | `<!-- Slot: prompt input / composer goes here -->` | Your prompt input pattern — textarea + send button |
| Content body | `<!-- Slot: artifact content goes here -->` | Whatever the agent is showing — cards, lists, forms, records |

## Panel widths (DESIGN.md §Panel widths)

| Pane | Default | Min | Max | Resize |
|---|---|---|---|---|
| Left nav | 260px | 220px | 320px | User-resizable via splitter; persisted per-user when wired |
| Center chat | flex | 480px floor | — | Always flexes; never collapses |
| Right content | 640px | 480px | 800px | User-resizable within range |

Splitter drag-to-resize behavior is **not wired** in this template — splitters are visual only. Wire your own splitter JS or use the haven-ui splitter source at `Lab/haven-ui/packages/design-system/src/scripts/components/panel-splitter.js` as a reference.

## Brand-fidelity notes (DESIGN.md §Brand-taste)

A few rules that are easy to violate by accident:

- **Pages are never pure white.** Page bg is sand-50 (`#fbfaf8`). Panes layer translucent white on top.
- **Primary teal is for commitments, not advancement.** Reserve `teal-700` for buttons that change state ("Save", "Schedule", "Send"). Don't paint `Next` buttons teal.
- **Active nav state uses font weight, not background color.** `.nav-item.active` is bold + teal-700 text; no background fill.
- **Cena logo is chrome; the agent avatar is the agent.** Don't substitute one for the other. Logo lives in the nav header always.
- **Pill radius (54px) is reserved for chat send/mic buttons only.** Other surfaces use 11px (`border-radius: 11px`) or smaller.

## What's NOT included

| Not included | Why | Where to get it |
|---|---|---|
| Icons | Icon choice is yours — FontAwesome, Material Symbols, Lucide, all work | If you want FA Pro v7: see haven-ui's `packages/design-system/src/vendor/fontawesome/` (gitignored, install separately) |
| Component vocabulary (buttons, cards, tags, message bubbles, prompt input) | Out of scope for the shell template | Reference `Lab/haven-ui/packages/design-system/src/styles/tokens/components.css` for canonical implementations |
| Interactive splitter JS | Visual-only template | See `panel-splitter.js` reference above |
| Preline overlays (dropdowns, accordions) | Not needed at the shell layer | Add at the app level if your patterns need them |
| Patient persona content | Phase 2 follow-up: per-use-case HTML blobs covering Maria Rivera flows | Coming separately |

## Snapshot context

- **Source:** `Lab/haven-ui/packages/design-system/pattern-library/components/layout-agentic-shell.html` and adjacent token files in the haven-ui repo.
- **Snapshot date:** 2026-05-12.
- **Refresh from canonical:** if these files drift from haven-ui code, regenerate from the source — do not drift forward in this folder. The handoff is a snapshot, not a fork.

## Cena context

This template ships in support of the UConn pilot — Cena Health's patient-facing experience for HIV+ food-insecure patients (cohort of 60). The persona for Phase 2 use-case blobs defaults to Maria Rivera until cohort-specific data adjustments are made.

Vault docs covering the patient experience (use cases, flows, mini wireframes, A2UI components): see the per-use-case HTML doc that will accompany this template in Phase 2 — one use case at a time, each linking to the specific step(s) and condition(s) it covers.
