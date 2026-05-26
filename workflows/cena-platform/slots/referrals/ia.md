---
slot: 7
slot-name: information-architecture (per-surface — Referrals)
primary-author: IA Designer
project: cena-platform
surface: referrals
created: 2026-05-26
status: in-review
consumes:
  - slots/_app/trigger-map.md
  - slots/_app/surface-shell-model.md
  - slots/_app/content-model.md
---

# Referrals — Information Architecture (per-surface)

Per-surface IA for **Referrals** — the partner-scoped pipeline view + convert-to-patient flow (J6). Referrals is a **dual-trigger surface**: incoming referrals are **pushed** (a partner sends one → they surface on Today's "Pending referrals" queue and deep-link here), AND the coordinator can **pull** the full referral list via the Referrals nav anchor. The IA's critical fix: today's referrals screen looks blank because it is not partner-scoped — the redesign explains the empty state and gives the pipeline a meaningful shape.

See `slots/_app/trigger-map.md` J6, `Knowledge/Projects/Cena Health/Apps/Platform/IA Synthesis.md` §2 J6, §4, and `slots/_app/content-model.md` → Referral entity.

## What Referrals is (and is not)

- **Is:** a **partner-scoped status pipeline** — incoming referrals grouped by referring partner, staged through a pending → in-review → converted / declined funnel. Each referral is reviewable in detail, with a convert-to-patient action as the terminal outcome.
- **Is not:** the place partner relationships are managed. Referring partners (Program Partners) live in **Network**; Referrals shows their referral pipeline only.
- **Fixes:** the current mystery-blank-screen failure. Today's referrals table is not partner-scoped, so a coordinator with no referrals for their specific filter context sees a table with no explanation. The redesign scopes by partner, labels the pipeline clearly, and gives the empty state a diagnostic message ("No pending referrals — partners are: X, Y, Z" or "No partners have sent referrals yet").

## Sub-surfaces (one connected surface, two zones)

| Zone | Job | What it is |
|---|---|---|
| **Pipeline list** | J6 (full-list anchor) | Partner-grouped referral pipeline: status columns or filter-by-status, dense table per partner group, counts + pipeline-bar proportional summary, search/filter toolbar |
| **Referral detail** | J6 (review → convert / decline) | Read-first record for one referral — candidate identity + referring partner + received date + status + notes; convert (→ Patients intake) and decline actions, each confirm-gated |

## Where / how reached

- **Pushed:** Today's "Pending referrals" queue card deep-links directly to the Referral detail for that specific referral (one-click, convert-ready).
- **Pulled:** the **Referrals nav anchor** (3rd of 7) — coordinator visits for the full partner-scoped pipeline.
- **Cross-link from Network:** a Program Partner record in Network may link to "View referrals from this partner" → Referrals list filtered to that partner.

## Entities surfaced (see content-model)

- **Referral** — referring partner, patient candidate identifiers, received date, status (pending / in-review / converted / declined), notes. Converts to → Patient.
- **Program Partner** (identity only, not managed here — drill-out → Network) — name, org.

## Nav graph (out-edges from Referrals)

| From element | Routes to | Trigger |
|---|---|---|
| Referral detail "Convert" action | Patients intake (single, fields pre-filled, referral source locked) | coordinator-pulled after review |
| Referring partner name (detail view) | Network → that Program Partner record | drill-down |
| Today "Pending referral" card | Referral detail (that referral) | agent-pushed |
| Referrals nav anchor | Pipeline list (default) | coordinator-pulled |

## URL / page contract (static-bundle targets, under `handoff/cena-platform/referrals/`)

- `referrals.pipeline.html` — partner-scoped pipeline, populated (the hero; all referrals grouped by partner, pipeline-bar summary)
- `referrals.pipeline-empty.html` — no referrals / no pending (partner-scoped; explains WHY — diagnostic message, not a silent blank)
- `referrals.detail.html` — referral detail, in-review state (review fields + convert/decline actions)
- `referrals.detail-pending.html` — referral detail, pending state (not yet opened for review) *(may fold into detail as a documented variant at build)*

Exact built page count finalizes at build (pending/in-review variants may fold). The contract here is the state set, not URL strings.

## Cognitive-walkthrough pre-commit (feeds acceptance.md)

A coordinator opening Referrals (via Today push or nav anchor) should: (orientation) see immediately which partners have sent referrals and how many are pending vs. in-review; (path) open a specific referral for review in one click and convert it to a patient in ≤2 actions from the detail; (affordance) the convert action is clearly gated (not available until the referral has been opened/reviewed); (empty state) if no referrals are present, the screen explains why — names the partners configured — rather than showing a silent blank. Pre-committed expected answers live in `acceptance.md`.
