# AGENTS.md — Order-status slice

For AI coding agents working with this slice. Read [`../AGENTS.md`](../AGENTS.md) first for bundle-wide conventions, then this file.

## What this slice is

Post-submit order states for the UConn pilot. Covers IA-v1 Order surface jobs 3 (optimize), 4 (pickup), and 5 (status). **The order-entry flow (jobs 1–2, steps 1–6) lives in `../meals/` — do not duplicate it here.**

This is a Tier 2 composition slice — zero new PL primitives. Every class used is compiled into `../assets/haven.css`.

## Shell and nav

- Shell: `layout-app-shell-responsive` (same as home, log-outcome, assessments)
- Nav: **IA-v1 3-tab — Home · Order · Activity**, Order tab active on all pages
- This is a **surface-primary** surface, not chat-primary. There is no persistent chat input area. The `patient-chat-message` blocks are read-only status messages, not conversation.
- Mobile: the `app-shell-bottom-nav` + `mobile-bottom-nav` provide the tab bar on small screens. The shell stacks naturally — no agentic-shell three-pane chrome.

## Hard invariants

These are load-bearing rules from `flow-order-status.md`. A ported runner that violates one breaks the spec.

- **No chat box on the Order surface.** IA-v1 is explicit: Order = TRANSACT, no chat box. The `patient-chat-message` blocks are agent status messages (short sentences), not an input area. Do not add a `<input type="text">` to any order-status page.
- **Issue path = immediate human escalation, no in-channel troubleshooting.** The agent does not attempt to redeliver, refund, or resolve fulfillment problems. Handoff-menu surfaces 3 options (phone / in-chat / email). This is non-negotiable for this population (food-insecure, HIV+, weekly grocery dependence). `flow-order-status.md` Step 4 decision 2026-05-07.
- **Order detail card stays visible during the issue state.** Patient and CC (on handoff) must share the same view of what was ordered, when, and what status the system shows. Do not hide or collapse the card in the issue state.
- **Optimize is direct manipulation only.** The comparison-panel's Keep/Swap buttons are the interaction surface. No chat affordances on this state.
- **Budget framed as available, never spent/judged.** Copy: "$130 still available" not "$70 used." Framing is always positive balance. The `budget-meter-message` slot carries this copy.
- **Status copy is plain English, not system labels.** "Being prepared" not "PREP_IN_PROGRESS". "Ready for pickup" not "FULFILLMENT_READY". From `flow-order-status.md` Decisions log 2026-05-07.

## Pickup variant — why this slice uses pickup throughout

The UConn pilot is pickup-oriented. `flow-order-status.md` Step 2 names "The Grocery on Broad, 585 Broad St, Hartford" as the pickup location. The `delivery-status-timeline` pickup variant uses `fa-bag-shopping` on step 5, "Ready for pickup" label, and no truck icon / delivery address. See `README.md §Pickup vs. delivery decision` for the full fork note.

## Gap: handoff-menu order-status-escalation variant not rendered in PL

The `handoff-menu.html` PL component declares `order-status-escalation` in `@component-meta variants:` but does not render a demo for it (only the `patient-initiated`, `cc-unavailable`, `no-cc-assigned`, and `anonymized` variants are demoed in the current HTML). The `order-status.issue.html` page implements this variant inline using the same semantic `handoff-menu` classes with fulfillment-routing copy. This is NOT a new class — the variant is editorial only (different copy, same HTML structure).

**Port note:** the `order-status-escalation` variant should eventually be promoted to a demo in the PL `handoff-menu.html` for completeness. Track this as a PL authoring task, not a blocking gap for this slice.

## Known reconciliation item — meals slice 5-tab nav drift

The `../meals/` slice pages use a 5-tab agentic-shell nav (`Home · Health check · Meals · Care · Messages`). This is pre-IA-v1 demo drift. This slice correctly uses the 3-tab nav. **Do not copy the 5-tab nav into this slice or any future slices.** Reconciling `../meals/` is a separate cleanup task.

## Conventions to honor

- Copy semantic classes verbatim from the bundle. No invented substitutes.
- Demo patient is Maria Rivera across all states. MR initials in `nav-avatar`.
- Timeline steps: `is-complete` for past steps, `is-current` for the active step, no modifier for future steps.
- `comparison-row-diff` highlights rows where the two options differ. Use it only on genuinely different values.
- `btn-primary` for commitment actions (Make the swap). `btn-outline` for non-commitment (Keep what I have). Matches DESIGN.md primary-teal-for-commitments rule.

## Porting tasks: done when

- DOM hierarchy + semantic class names match these abstract template pages
- ARIA: `aria-current="page"` on the active nav tab, `role="status"` on agent messages, `aria-label` on nav and main landmarks
- Order tab is active in sidebar nav AND mobile bottom nav
- No chat input area on any page (Order surface is direct-manipulation)
- Issue state: all 3 handoff-menu options wired; order detail card visible alongside
- Optimize state: comparison-panel buttons update cart state; budget meter reflects swap delta live
- Budget copy is always "available" framing, never "spent" framing
- Timeline is pickup variant throughout (unless a delivery cohort is explicitly added)

If any criterion cannot be met, surface the gap. Do not silently substitute.

## Where to find the canonical spec

- Flow doc: `Knowledge/Projects/Cena Health/Partners/UCONN Health/capabilities/development/flows/flow-order-status.md`
- IA-v1: `~/.claude/plans/patient-app-ia-v1.md`
- Bundle conventions: [`../AGENTS.md`](../AGENTS.md)
- PL primitives: `Lab/haven-ui/packages/design-system/pattern-library/components/`
  - `delivery-status-timeline.html`
  - `handoff-menu.html`
  - `complex-comparison-panel.html`
  - `budget-meter.html`
  - `patient-delivery-status-card.html`
