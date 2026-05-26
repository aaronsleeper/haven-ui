---
slot: 7
slot-name: trigger-map
primary-author: IA Designer
project: cena-platform
created: 2026-05-26
status: ratified
consumes:
  - Knowledge/Projects/Cena Health/Apps/Platform/IA Synthesis.md
mode: ratify (extract IA §3 — the stable spine)
---

# Trigger Map — Cena Care-Coordinator Platform

The load-bearing, stable layer (IA Synthesis §3): each job classified **pushed** (system/agent surfaces it when due → needs a *queue*, no nav anchor of its own) vs **pulled** (coordinator goes looking → needs a wayfinding anchor). The current app makes *everything* pulled; the redesign's single biggest move is giving pushed work a home (**Today**).

## Pushed work → Today queue (no anchor of its own)

| Job | Trigger | Today queue group | Deep-links into |
|---|---|---|---|
| J1 patient alerts | clinical flag fires | Patient alerts | Patient record |
| J6 incoming referral | partner sends | Pending referrals | Referral → convert flow |
| J11 order exception | fulfillment event | Order exceptions | that Kitchen Order (Diet Operations) |
| J8/J10 cutoff + distribution-due | date-driven | Due: cutoffs / distributions | that Weekly Plan / Distribution (Diet Operations) |

**Today is discovery + routing, not where work completes.** Each card deep-links into the entity where the coordinator acts (Layer-2 refinement: launchpad, not workspace).

## Pulled work → wayfinding anchor

| Job | Anchor |
|---|---|
| J2 open a patient (highest-frequency pulled) | Patients + global search |
| J3 intake patient (also pushed when referral converts) | Patients (single + bulk) |
| J4/J5 patient status / app access | within Patient record (no top-level anchor) |
| J6 referral pipeline (full list) | Referrals |
| J7/J9 meal catalog / AI import | Diet Operations |
| J11 order full list | Diet Operations (exceptions also push to Today) |
| J12 food providers | Diet Operations (supply side) |
| J13/J14 partners / orgs | Network |
| J15/J16 clinical reference | Clinical Library (low-frequency) |
| J17/J18/J19 staff / settings / EHR | Admin (separated from ops) |

## Why this is the stable layer

Surface placement (sitemap) is provisional and re-arrangeable; the pushed/pulled classification is the durable design fact. If a future job appears, classify its trigger first — that determines whether it needs a queue card or a nav anchor, before any placement debate.

Resolves: steps.md step 0.8 (trigger-map half).
