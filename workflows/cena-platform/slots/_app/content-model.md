---
slot: 8
slot-name: content-model
primary-author: Content Strategist
project: cena-platform
created: 2026-05-26
status: ratified
consumes:
  - Knowledge/Projects/Cena Health/Apps/Platform/Current-State Inventory.md
  - Knowledge/Projects/Cena Health/Apps/Platform/IA Synthesis.md
mode: ratify (entities derived from the validated current-state walk)
---

# Content Model — Cena Care-Coordinator Platform

The entity graph the surfaces compose over and drill-down navigation traverses. **Structure + relationships only — no real patient/business records** (Priority 1). Attributes are field *shapes*, not values. Source: the current-state inventory (18 screens walked); the two relationship chains are the brief's load-bearing structure.

## Two relationship chains (the spine the redesign reconnects)

The current app severs these across sibling flat tables; the IA's drill-down restores them.

```
Network chain:   Organization → Program Partner → Referral → Patient → (Companion app access)
Diet chain:      Food Provider → Meal (catalog) → Weekly Plan → Distribution → Kitchen Order
                                          ↘ AI Import feeds the catalog
Patient ↔ Diet:  Patient receives meals via the partner's distributions; clinical needs shape the diet
```

## Entities

| Entity | Surface home | Key attribute shapes (no values) | States | Relationships |
|---|---|---|---|---|
| **Organization** | Network | name, type, parent-of-partners | active / inactive | parent of → Program Partners |
| **Program Partner** | Network | name, org (parent), referral-pipeline counts, contact | active / inactive | child of → Organization; source of → Referrals |
| **Referral** | Referrals | referring partner, patient candidate identifiers, received date, status | pending / in-review / converted / declined | from → Partner; converts to → Patient |
| **Patient** | Patients | identifiers, contact, referral source, status, dietary profile, diagnosis codes, clinical flags/alerts, companion-app access state | active / archived / deleted; app-access: connected / disconnected / error | converted from → Referral; has → Companion app access; receives → meals via Distributions; carries → clinical alerts (J1) |
| **Companion App Access** | Patients (within record) | connection state, last-sync, fix/disconnect affordance | connected / disconnected / needs-fix | belongs to → Patient |
| **Clinical Alert** | Today (pushed) + Patient record | type, severity, fired-at, source patient | active / resolved / pending | fires on → Patient; surfaces in → Today queue |
| **Food Provider** | Diet Operations | name, type (kitchen/vendor), meals offered, contact | active / inactive | supplies → Meals; fulfills → Kitchen Orders |
| **Meal** | Diet Operations | name, medically-tailored attributes (diet tags, clinical conformance), provider, hot/cold | active / retired | from → Food Provider; appears in → Weekly Plans |
| **Weekly Plan** | Diet Operations | week range, meal set, cutoff date/time | draft / open / cutoff-passed / closed | composed of → Meals; produces → Distributions; cutoff drives Today "due" (J8) |
| **AI Import** | Diet Operations | source text, parsed meal candidates, confirm/edit state | parsing / review / committed | feeds → Meal catalog (J9) |
| **Distribution** | Diet Operations | source week, target partner kitchen, quantities, status | draft / sent / confirmed | from → Weekly Plan → Partner kitchen; generates → Kitchen Orders (J10) |
| **Kitchen Order** | Diet Operations | distribution, provider, fulfillment status, exceptions | pending / fulfilling / fulfilled / exception | from → Distribution; exceptions push to → Today (J11) |
| **Dietary Guideline** | Clinical Library | guideline text, diagnosis linkage | current / archived | reference; informs → Meal conformance |
| **Diagnosis Code** | Clinical Library | code, description | active / deprecated | reference; tags → Patients |
| **Employee / Role** | Admin | name, role, permissions | active / inactive | admin (J17) |
| **Setting** | Admin | key, scope, value-shape | — | admin (J18) |
| **EHR Integration** | Admin | system, connection state, mapping | connected / error / unconfigured | admin (J19); links → Patients |

## Voice contract (carried into slot 14 per-surface strings)

- Professional coordinator register: clinical/operational terms used directly (no plain-language simplification — that was the patient-app contract).
- "Diet" not "Meal" at the surface level — these are prescriptions conforming to patient clinical needs + tastes (Aaron, IA review). Entity names keep precise domain terms.
- Status copy names operational state plainly ("Cutoff passed", "Exception — 3 orders", "Pending review").

Resolves: steps.md step 0.7.
