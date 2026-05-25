# Slice 4 — Home (things-to-do surface)

The patient app's landing surface for the UConn pilot. **Surface-primary, agent-assisted** (IA v1): direct-manipulation furniture is the spine; the agent (Surfacer) surfaces what's due in a reserved zone. This is **not** chat-primary.

Design spec (canonical, build-on, do-not-restate): `~/.claude/plans/patient-app-home-surface.md` (composition §2, states §3, Surfacer behavior §4, copy §5). IA: `~/.claude/plans/patient-app-ia-v1.md`.

## What this is

The Home tab — greeting + a reserved "things-to-do" zone + at-a-glance tiles + promoted-from-Home entry rows + a global "Talk to a person". Navigation is the IA-v1 **3-tab** bar: **Home · Order · Activity**. My Health and Appointments are **rows on Home, not tabs** (they'd be dark most weeks); assessments/recall/survey are **agent-pushed** and surface in the things-to-do zone when due — they have no tab either.

## States

Each state is a separate self-contained HTML page (open directly; CSS + fonts load from `../assets/`).

| State | File | What it shows |
|---|---|---|
| Caught-up (default) | [`home.caught-up.html`](./home.caught-up.html) | Nothing due — the **designed-for default**. Calm affirmation block in the zone (NOT a card, no "0 tasks"), warm greeting, full standing furniture. |
| One item due | [`home.one-item.html`](./home.one-item.html) | A single `patient-focus-card` in the zone (order reminder). Greeting hands off softly. |
| Several due | [`home.several.html`](./home.several.html) | One focus card (agent's top pick) + a quiet native-`<details>` "A couple of other things, when you're ready" expanding to two more. **No count badge anywhere.** |

First-run / consent (state d) is owned by the onboarding flow (`flow-onboarding`) and gates Home; not rebuilt here.

## Composition (top → bottom)

`Header/brand → Greeting → [things-to-do reserved zone] → at-a-glance tiles (order + budget) → entry rows (My Health, Appointments) → Talk to a person → bottom tabs (Home·Order·Activity)`

Shell: `layout-app-shell-responsive` (sidebar desktop ≥lg · bottom-nav mobile <lg) — same shell as the assessments + log-outcome slices.

## CSS — semantic classes used

All exist in `packages/design-system/src/styles/tokens/components.css` and are compiled into `../assets/haven.css`. **This slice added one new PL primitive** — `patient-focus-card` (the calm surfaced due-item; see COMPONENT-INDEX). Everything else is composition of existing primitives: `app-shell*`, `nav-*`, `mobile-bottom-nav*`, `page-title`/`page-header`, `card`/`card-body`, `budget-meter` + `progress`, `list-group`/`list-group-item-action`, `avatar`, `btn-primary`/`btn-ghost`.

The caught-up affirmation block is plain text in the zone (Tailwind layout utilities only) — deliberately chrome-less, NOT a card.

## Behavior to implement on port (the zone contract — not in these static pages)

These pages are static state exemplars. The live Home needs a small zone controller (the future `home.js`, or its Angular equivalent):

- **`aria-live="polite" aria-atomic="true"`** on the things-to-do `<section>` (already in the markup) so an agent-surfaced card is announced on appear/replace. Debounce re-surfacing ≥500ms (no chatty announcements).
- **"Not now" dismiss** recedes the card; the zone falls back to the caught-up affirmation. Focus moves to the zone (or the next card's primary action) — never `<body>`. Dismiss is **remembered** (don't re-surface the same item next open).
- **One focus card at a time.** Surfacer admission/ordering rules in spec §4 decide which item is the focus and which collapse.
- The "couple of other things" uses native `<details>` here (zero-JS for the bundle); the production version may use the agent's sequencing + a styled toggle.

## Rebuilding `../assets/haven.css`

This slice required regenerating the bundle CSS to include `patient-focus-card`. Per the top-level [README](../README.md#rebuilding-the-assets): `pnpm --filter @haven/design-system build` → `sed -E 's|url\(/assets/|url(./|g' dist/assets/haven-ui.css > assets/haven.css`. Run after any design-system class change.
