---
slot: 7
slot-name: surface-shell-model (app shell)
primary-author: IA Designer
project: cena-platform
created: 2026-05-26
status: ratified
consumes:
  - Knowledge/Projects/Cena Health/Apps/Platform/IA Synthesis.md
mode: ratify IA §6 + resolve concrete PL shell composition
---

# Surface-Shell Model — Cena Care-Coordinator Platform

Ratifies the IA's surface-shell model (IA Synthesis §6) and resolves the concrete PL shell composition flagged at ds-binding step 2. The shell is a **referenced DS component composed once**, then reused by every surface — never hand-rolled (forbidden).

## Shell paradigm (from IA §6, ratified)

- **One nav model**, replacing the current app's three competing models (sidebar + category-buttons + ad-hoc tabs).
- **Persistent left nav** = the 7 grouped anchors. Flat, not accordion — the 16→7 collapse is the fix; sub-structure lives *inside* each surface (tabs / breadcrumb / drill-down), never back in the sidebar.
- **Persistent top bar** = global patient search + work-queue badge + user/role.
- **Landing surface = Today** (triage launchpad, not a count dashboard).
- **Orientation:** every surface has a heading (`page-title`) + breadcrumb. Fixes the no-headings-anywhere finding.
- **Drill-down over flat tables:** entity lists gain relationship navigation (partner → referrals/patients; provider → meals/orders; week → distributions).

## Concrete PL composition (the decision)

Compose `layout-app-shell-responsive` — the non-agentic desktop+responsive shell, proven render-gate-clean in the cena-uconn handoff. Regions:

| Region | Class | Holds |
|---|---|---|
| Frame | `app-shell` / `app-shell-frame` | outer flex root |
| Sidebar (desktop ≥lg) | `app-shell-sidebar` + `nav-header`/`nav-logo` + `nav-section` of `nav-item` + `nav-section--pinned-bottom` | Cena logo brand + 7 anchors + pinned user/role at bottom |
| Topbar (persistent) | `app-shell-topbar` | global patient search (`toolbar-search`/`search-input`) + work-queue badge + `navbar-user` (avatar + name + role) |
| Content | `app-shell-content` | per-surface; opens with `page-header`/`page-title` + `nav-breadcrumb` |
| Bottom-nav (<lg) | `app-shell-bottom-nav` | responsive fallback; desktop-primary tool, so secondary |

- **Persona register difference from the patient app's use of this same shell:** compact/dense (not comfort), professional vocabulary, operational urgency color allowed (per ds-binding). Same shell component, opposite-end calibration.

## The 7 anchors (sidebar nav-items, in order)

1. **Today** — `fa-solid fa-inbox` (or `fa-list-check`) + **work-queue count badge** (pending pushed items). Landing.
2. **Patients** — `fa-solid fa-user`
3. **Referrals** — `fa-solid fa-arrow-right-arrow-left` (incoming pipeline)
4. **Diet Operations** — `fa-solid fa-utensils`
5. **Network** — `fa-solid fa-sitemap` (org → partner graph)
6. **Clinical Library** — `fa-regular fa-book-medical`
7. **Admin** — `fa-solid fa-gear`

Global, in topbar: **patient search** (always reachable — J2 highest-frequency pulled job) + **work-queue badge** (mirrors Today's count). Removed: the four redundant category buttons that created the second nav model (their groupings absorbed into the 7 anchors).

## Within-surface wayfinding (NOT sidebar sub-menus)

- Surface entry: `page-header` + `page-title` + optional `nav-breadcrumb`.
- Entity sub-structure: `nav-tabs` (e.g. patient-record tabs: overview / contact / referral / identifiers / dietary / notes / app-access); drill-down via `row-clickable` / `list-group-item-action` / breadcrumb.
- Diet Operations' six sub-areas (providers / catalog / weekly plans / AI import / distribution / orders) are **one connected surface** with cross-links + an in-surface sub-nav (`nav-section`/`segmented-control` or `nav-tabs`), not six sidebar items.

## Micro-gap to confirm at build (not blocking)

- **Sidebar nav-item count badge** (the Today work-queue count). Compose `badge badge-primary badge-pill badge-sm` inside the `nav-item`; if the cena-uconn `nav-item` chrome doesn't seat it cleanly, that's a tiny Tier-2 composition tweak confirmed at render-verify — not a new primitive. Flagged so it's resolved at build, not improvised silently.

Resolves: steps.md step 0.8 (shell half).
