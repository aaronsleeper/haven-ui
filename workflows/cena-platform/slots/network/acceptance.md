---
slot: 19
slot-name: acceptance-criteria (Network)
primary-author: QA Lead
project: cena-platform
surface: network
created: 2026-05-26
status: in-review
consumes:
  - slots/network/states.md
  - slots/network/ia.md
  - slots/_app/content-model.md
folds-in: [test-plan (20)]
---

# Network — Acceptance Criteria

Per-screen observable rows (binary pass/fail) + flow-level use-case acceptance + pre-build cognitive walkthrough. The contract build executes against.

## Per-screen acceptance

| # | Criterion | State(s) | Pass condition |
|---|---|---|---|
| N1 | Organizations list is a dense table with pipeline-count columns | orgs-list | `data-table-compact`; org name + type + partner count + referrals-pending + active-patients + status visible per row; `badge-warning` on pending count > 0 |
| N2 | Network nav anchor reads as a relationship graph, not Admin | all | Sidebar label "Network" + `fa-solid fa-sitemap` icon (not `fa-gear`, not `fa-building`); no settings/config vocabulary anywhere on the surface |
| N3 | Org row click drills into org record (keyboard-activable) | orgs-list | `row-clickable` → org-record; focusable name link, not bare div onclick |
| N4 | Org record shows child partner sub-list with pipeline summary per partner | org-record | `data-list-group` partner rows with `list-group-item-title` (partner name) + description (pipeline summary string "N pending · M active patients"); each row `row-clickable` / `list-group-item-action` → partner-record |
| N5 | Breadcrumb is present and correctly hierarchical on all drill-down pages | org-record, partner-record | org-record: "Network › {Org Name}"; partner-record: "Network › {Org Name} › {Partner Name}"; "Network" and org-name crumbs are `text-link`s back to their respective pages; deepest crumb carries `aria-current="page"` |
| N6 | Partner record shows referral-pipeline stat-group and both cross-link CTAs | partner-record | `stat-group` with Pending / In Review / Converted / Declined counts; `btn-outline` "View all referrals" (→ Referrals, partner-filtered); `btn-outline` "View patients" (→ Patients, partner-filtered); both present and functional |
| N7 | Pipeline counts use operational badge register correctly | partner-record, org-record, orgs-list, partners-list | `badge-warning` on pending count > 0; plain count (no badge tinting) when count = 0; `badge-error` only for defined overdue threshold (not decorative) |
| N8 | Partners list (all-orgs view) includes org stratification bar | partners-list | `nav-stratification-bar` stratifies by parent org; org column in table is a text-link → org-record |
| N9 | View-toggle (Organizations | Partners) is present and correctly scopes the list | orgs-list, partners-list | `nav-segmented-control`/`view-toggle` in page-header; Organizations tab → orgs-list; Partners tab → partners-list; active state correctly reflected |
| N10 | Empty states are operational and CTA-correct | orgs-list-empty, org-record partner-empty, partners-list-empty | no-orgs → Add organization CTA; no-partners-in-org → "No program partners yet" + Add partner CTA; filter-empty → clear-filters affordance; no patient-app tone, no ceremony |
| N11 | Add/edit paths are confirm-gated for destructive actions | org-record, partner-record | deactivate/delete routes through `overlay-confirm-dialog`; save/cancel for non-destructive edits; no unguarded destructive path |
| N12 | Record header present and correctly composed | org-record, partner-record | `layout-record-header` (`record-header`) with title, subtitle (parent entity / type), status badge, meta right; `<h1>` semantics on the title element |
| N13 | Toolbar: search + filter-pills present on list views | orgs-list, partners-list | `toolbar` + `toolbar-search` (`search-input`) + `nav-filter-pills` (Active / Inactive / All); toolbar persists across filter states |
| N14 | Section titles are `<h2>`, sub-list headings `<h3>` where nested | org-record, partner-record | heading hierarchy correct; skip-link to main content |
| N15 | Cross-links from Referrals and Patients surface land on partner-record | partner-record (entry via cross-link) | arriving from a Referrals source-partner link or a Patients referral-tab source-partner link → correct partner-record; breadcrumb still shows full "Network › {Org} › {Partner}" hierarchy regardless of entry path |
| N16 | Renders self-contained under `file://` | all | `../assets/haven.css` + relative paths; no dev server; render-gate clean (zero undefined classes); no `complex-partner-list-item` phantom class — see PL-gap flag |
| N17 | No real partner / patient / business data | all | synthetic org names, partner names, referral counts; no real UConn Health or partner pipeline data |

## Flow-level use-case acceptance

**Jobs:** J14 manage Organizations (parent of partners) · J13 manage Program Partners + their referral pipeline.

| Sub-check | Pre-committed expected answer |
|---|---|
| **Orientation** | Coordinator arrives at Network and recognizes it as the partner relationship graph from label + icon (fa-sitemap) before clicking; "Network" reads as operational/relationship surface, not configuration. |
| **Affordance** | The hierarchy (org → partner) is visible from the orgs-list; "Add organization" and "Add partner" are unambiguous primary CTAs; pipeline counts and "View all referrals" / "View patients" on partner-record are prominent above the fold. |
| **Path** | Find a partner from nav anchor → orgs-list → org row → org record → partner row → partner record in ≤4 actions; or from partners-list (all) → partner row → partner record in ≤2 actions. Reach the partner's referral pipeline (Referrals surface) in 1 action from partner-record. |
| **Feedback** | Drill-down depth is legible via breadcrumb at every level; no heading ambiguity (record-header title names the current entity); view-toggle shows which scope is active. |
| **Cross-link discoverability** | A coordinator living in Referrals reaches Network via the source-partner link on a referral without ever touching the Network nav anchor — and lands with full breadcrumb orientation. Same from Patients referral tab. |
| **Legibility** | Operational copy ("4 pending · 12 active patients", "View all referrals", "Referral Pipeline"); dense but scannable; professional coordinator register throughout. |

## Discoverability mitigation — acceptance gates (Layer-2 watch resolution)

The IA review flagged Network discoverability at S4 2/5 leaning Admin (IA Synthesis §Review trail). These criteria are the acceptance contract that resolves that watch:

| # | Discoverability criterion | Pass condition |
|---|---|---|
| D1 | Nav icon is unambiguously graph/hierarchy, not settings | `fa-solid fa-sitemap` in sidebar `nav-item`; not `fa-gear`, `fa-cog`, `fa-building`, `fa-users` |
| D2 | Zero admin-register vocabulary on any Network page | grep for "configure", "settings", "administration", "manage settings" → 0 hits on any network.*.html |
| D3 | Breadcrumb roots to "Network" label at every drill-down depth | org-record and partner-record both show "Network" as the top-level `text-link` crumb, not "Organizations" or the app root |
| D4 | Inbound cross-links from Referrals present and land correctly | Referrals surface carries source-partner name as `text-link` → partner-record; link resolves to correct page |
| D5 | Inbound cross-links from Patients present and land correctly | Patients record referral tab carries source-partner `text-link` → partner-record |
| D6 | Today pending-referral queue cards include partner name as text-link | queue-item for a pending referral shows partner name text-link → partner-record (resolved at Today build, which is built last) |
| D7 | Pipeline counts visible on first-level orgs-list | Referrals-pending column with `badge-warning` on pending > 0 visible in the orgs-list without drilling in — gives coordinators operational signal at first glance |

Human proxy confirmation of D1–D3 is a slot-30 non-waivable check (human cold render-and-look). D4–D6 verify at cross-surface integration test.

## Pre-build cognitive walkthrough (slot-19 sub-step) — result

Fresh-context walk of the spec against the jobs (spec-checkable subset):

- **Path:** PASS — from nav anchor: orgs-list → org-record → partner-sub-list → partner-record in ≤4 clicks; from partners-list: ≤2 clicks. Both paths are uniquely clear with no ambiguous choice points. Cross-link paths (Referrals → partner-record, Patients → partner-record) are single-action. Breadcrumb provides reversal at every depth.
- **Feedback-existence:** PASS — breadcrumb names current depth; record-header titles the current entity; view-toggle reflects scope; drill-down is visually distinct from in-place navigation (breadcrumb adds a crumb, does not replace the page header's identity). Add/edit confirm-gates are specified (states.md transitions).
- **Legibility:** PASS — operational strings throughout (ds-binding voice contract); pipeline counts are numeric + badge-conditional; no admin vocabulary in the state set.
- **Orientation-ingredients:** PASS — page-title "Network" + `fa-solid fa-sitemap` icon + breadcrumb hierarchy + record-header entity identity + section titles all contribute. Coordinator can orient to where they are and where they came from at any depth.
- **Discoverability mitigation:** PASS (spec-level) — `fa-sitemap` icon, "Network" label, breadcrumb root, operational pipeline counts, and three inbound cross-link paths all specified. Real-coordinator validation deferred to slot-30 human cold render-and-look per same-model ceiling noted in IA Synthesis §Review trail (Layer-2 used same-model reviewers; fresh-eyes coordinator proxy is the non-waivable complement).
- **Product-rule gate audit:** mutating paths (add/edit org or partner, deactivate) are confirm-gated. Cross-link targets (Referrals, Patients) are navigational, not mutating — no gates needed on link traversal. No unguarded irreversible action in the Network state set. PL gap #1 (`complex-partner-list-item` class resolution) must resolve before first build — phantom class would fail the render-gate.

**Render-only checks (pipeline-counts-read-as-operational, hierarchy-legible-at-depth-3, icon-vs-admin-disambiguation):** deferred to slot 30 (human cold render-and-look) — non-waivable. The D1–D7 discoverability gates above are the most critical render checks for this surface.
