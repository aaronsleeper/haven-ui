---
slot: 7
slot-name: information-architecture (per-surface — Network)
primary-author: IA Designer
project: cena-platform
surface: network
created: 2026-05-26
status: in-review
consumes:
  - slots/_app/trigger-map.md
  - slots/_app/surface-shell-model.md
  - slots/_app/content-model.md
  - Knowledge/Projects/Cena Health/Apps/Platform/IA Synthesis.md
  - Knowledge/Projects/Cena Health/Apps/Platform/Redesign Brief.md
---

# Network — Information Architecture (per-surface)

Per-surface IA for **Network** — the partner relationship graph with drill-down (J14 = Organizations, J13 = Program Partners + referral pipeline). Both jobs are **pulled**. This is the connecting view the current flat-table app severs: the `Organization → Program Partner → Referral → Patient` chain in `slots/_app/content-model.md §Two relationship chains` is the spine Network exposes.

## What Network is (and is not)

- **Is:** a navigable relationship graph — two levels of hierarchy (Organization → Program Partner) plus a referral-pipeline lens into each partner's incoming volume and cross-links outward to Referrals and Patients.
- **Is not:** where referrals are processed (that is Referrals, J6) or where patients are managed (that is Patients, J2–J5). Network exposes the relationship context and pipelines — the coordinator acts on the referral *in* Referrals; the patient *in* Patients.
- **Replaces:** two flat sibling routes (`/organizations`, `/program-partners`) in the current app that share no connection and carry no referral-pipeline counts, requiring the coordinator to mentally reconstruct the org→partner→referral chain.

## Discoverability risk and mitigation (Layer-2 watch — REQUIRED to address)

**Risk:** The Layer-2 cold findability review scored Network's discoverability at **S4 2/5, leaning Admin** (IA Synthesis §Review trail, 2026-05-26). Two of five reviewers expected partner/org management to live under Admin, not a peer anchor. This is the surface's primary design risk — if coordinators don't find Network they revert to the flat-table app behavior the redesign fixes.

**Mitigations specified at IA layer (carry to states.md + acceptance.md):**

1. **Anchor naming and icon — explicit graph vocabulary.** Nav label is `Network`, icon is `fa-solid fa-sitemap` (the org-hierarchy glyph, per surface-shell-model.md anchor 5). `fa-sitemap` vs `fa-gear` (Admin) is the glyphic disambiguation — "org chart" vs "configuration." Never `fa-building`, `fa-users`, or anything generic.
2. **Breadcrumb orientation — always show the hierarchy.** Every Network page carries a `nav-breadcrumb` rooted at **Network** (not "Organizations" or the app root), making the surface name visible at every drill-down depth: `Network › {org name}` / `Network › {org name} › {partner name}`.
3. **Cross-links from Referrals pull coordinators in.** The Referrals surface links each referral's source partner back to the partner's Network record (`network.partner-record.html`). Today's queue cards for pending referrals include the referring partner name as a text-link into Network. Both are inbound edges that orient coordinators toward Network as the relationship surface, not just a configuration section.
4. **Cross-links from Patients pull coordinators in.** The Patients record's referral tab links to the source referral (Referrals) AND to the source partner (Network partner record). Clinical coordinators who live in Patients discover Network via the patient's originating partner.
5. **Operational pipeline counts on the partner list.** Each partner row in the organizations-list and in the partner sub-list shows referral-pipeline counts (`{N} referrals · {M} active patients`). This signals that Network is an operational surface — live volume, not just configuration metadata — distinguishing it from Admin's static configuration flavor.
6. **Reject "Admin-adjacency" framing in copy.** No string in Network uses administrative vocabulary ("configure", "manage settings", "administration"). All copy is operational: "partner", "referral pipeline", "active patients", "program".

## Sub-surfaces (one connected surface, two levels + cross-links)

| Zone | Job | What it is |
|---|---|---|
| **Organizations list** | J14 | Dense table/list of orgs with partner counts + status; drill-down → org record |
| **Organization record** | J14 | Org's detail + its child program partners as a sub-list; add/edit org |
| **Partners list (all)** | J13 | All partners across orgs, filterable by org; drill-down → partner record |
| **Partner record** | J13 | Partner detail + its referral-pipeline counts + cross-links → Referrals (its pipeline) + Patients (referred via this partner) |

Note: the "partners list (all)" view and the partner sub-list within an org record are the same list component scoped differently — the all-partners view is the top-level anchor; the org-scoped sub-list is the drill-down within an org record. Not two separate pages at separate nav anchors.

## Where / how reached

- **Reached as:** the **Network nav anchor** (5th of 7) — no pushed work for Network (both J13/J14 are pulled).
- **Cross-linked into:** from Referrals (source-partner link on each referral); from Patients record referral-tab (source-partner cross-link); from Today pending-referral queue cards (partner name text-link). These inbound edges are the discoverability mitigation in practice — coordinators don't always arrive via the nav anchor.
- **Drill-down entry:** nav anchor → Organizations list (default landing within Network) → org row → org record → partner row → partner record. Partners list (all) is a tab/view within Network, not a separate nav item.

## Entities (see content-model)

- **Organization** — name, type, active/inactive, parent of partners.
- **Program Partner** — name, org (parent), referral-pipeline counts (pending / in-review / converted / declined), active-patient count, contact, active/inactive.
- Cross-links to: **Referral** (Referrals surface, J6), **Patient** (Patients surface, J2).

## Nav graph (out-edges from Network)

| From element | Routes to | Trigger |
|---|---|---|
| Org list row | Org record | pulled (drill-down) |
| Org record partner sub-list row | Partner record | pulled (drill-down) |
| Partners list (all) tab | scoped to all orgs; same partner-record drill-down | pulled |
| Partner record "View referrals" | Referrals, filtered to this partner | cross-link |
| Partner record "View patients" | Patients roster, filtered to referred-by this partner | cross-link |
| Breadcrumb "Network" crumb | Organizations list (default) | orientation / back |
| Breadcrumb "{org name}" crumb | Org record | back up one level |
| "Add organization" | Org create form (within Network, overlay or dedicated page) | pulled |
| "Add partner" | Partner create form (within org record, overlay or dedicated page) | pulled |

## URL / page contract (static-bundle targets, under `handoff/cena-platform/network/`)

- `network.orgs-list.html` — populated organizations list (default landing)
- `network.orgs-list-empty.html` — no organizations yet (empty state)
- `network.org-record.html` — org detail + child partner sub-list (populated)
- `network.partners-list.html` — all partners, cross-org view (filterable by org)
- `network.partners-list-empty.html` — no partners matching filter / none yet
- `network.partner-record.html` — partner detail + referral-pipeline counts + cross-links

Add/edit forms may be implemented as `overlay-confirm-dialog`-sized overlays or as separate pages (`network.org-form.html`, `network.partner-form.html`) — finalize at build. The state contract here is the entity + form state set, not URL strings.

## Cognitive-walkthrough pre-commit (feeds acceptance.md)

A coordinator needing to find which organization a partner belongs to, or how many referrals a partner has pending, should: (orientation) recognize the Network surface as the partner relationship graph from the nav label + icon alone, before clicking; (path) reach the partner record from the all-partners list or via org drill-down in ≤3 clicks from nav anchor; (cross-link) reach the partner's referral pipeline (Referrals) in one action from the partner record; (anchor) re-orient to any level of the hierarchy via breadcrumb without hunting for a back button.
