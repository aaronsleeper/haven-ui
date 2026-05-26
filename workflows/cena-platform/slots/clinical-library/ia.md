---
slot: 7
slot-name: information-architecture (per-surface — Clinical Library)
primary-author: IA Designer
project: cena-platform
surface: clinical-library
created: 2026-05-26
status: in-review
consumes:
  - slots/_app/trigger-map.md
  - slots/_app/surface-shell-model.md
  - slots/_app/content-model.md
---

# Clinical Library — Information Architecture (per-surface)

Per-surface IA for **Clinical Library** — the low-frequency reference surface (J15 dietary guidelines, J16 diagnosis codes). Both jobs are **pulled** (see trigger-map): coordinators visit this surface to maintain reference tables, not because the system surfaces work to them. Appropriate lean: two sub-areas, each a maintainable reference table, accessed via an in-surface sub-nav.

## What Clinical Library is (and is not)

- **Is:** a reference-maintenance surface. Two reference tables — Dietary Guidelines and Diagnosis Codes — that coordinators edit to keep the clinical vocabulary current. Low-frequency; a coordinator visits this surface when a new ICD-10 code needs adding or a guideline is revised, not as part of daily triage.
- **Is not:** a documentation browser or patient-facing resource. Both entities are operational reference: Diagnosis Codes tag patients and filter diet conformance; Dietary Guidelines inform meal conformance decisions downstream in Diet Operations. Neither is a long-form knowledge base.
- **Replaces:** two separate flat sidebar items (`dietary-guidelines`, `diagnosis-codes`) — collapsed into one surface per the 16→7 IA consolidation.

## Sub-surfaces (one surface, two reference zones)

| Zone | Job | What it is |
|---|---|---|
| **Dietary Guidelines** | J15 | Maintainable reference table: guideline text + diagnosis linkage. Each guideline may be current or archived. Cross-links into Diet Operations meal conformance. |
| **Diagnosis Codes** | J16 | Maintainable reference table: ICD-10 code + description + active/deprecated status. Tags patients; cross-links into Patients dietary tab. |

Switching between zones uses an **in-surface sub-nav** (`nav-segmented-control` or `nav-tabs`), not two sidebar anchors — the surface is one Clinical Library nav-item; zone choice is within-surface wayfinding.

## Where/how reached

- **Reached as:** the **Clinical Library nav anchor** (6th of 7) — pulled, low-frequency. No badge or pushed-work indicator; coordinators navigate here deliberately.
- **No global deep-link entry:** unlike Patients (which Today deep-links into), Clinical Library has no pushed trigger. Coordinators arrive by nav anchor only.
- **Cross-link destinations (this surface is a target):**
  - From **Patients** dietary tab: diagnosis-code tags link to the code's detail/edit view in Clinical Library.
  - From **Diet Operations** meal-conformance context: dietary-guideline references link to the guideline's detail view.

## Entities (see content-model)

- **Dietary Guideline** — guideline text, diagnosis linkage, current/archived status. Informs meal conformance (Diet Operations cross-link).
- **Diagnosis Code** — ICD-10 code, description, active/deprecated status. Tags patients (Patients cross-link).

Both entities are reference-only from the content-model: they do not originate work, they are referenced by other entities. Their home is Clinical Library; they are consumed by Patients and Diet Operations.

## Nav graph (out-edges from Clinical Library)

| From element | Routes to | Trigger |
|---|---|---|
| Sub-nav: Dietary Guidelines | Dietary Guidelines table (default zone) | pulled |
| Sub-nav: Diagnosis Codes | Diagnosis Codes table | pulled |
| Diagnosis Code row / detail | Patient records that use this code (cross-link, optional) | drill-down (deferred to build) |
| Dietary Guideline row / detail | Diet Operations meal conformance context (cross-link) | drill-down (deferred to build) |
| Sidebar anchors (7) | their surfaces | coordinator-pulled |
| Topbar patient search | Patients (matched patient record) | pulled |

## URL / page contract (static-bundle targets, under `handoff/cena-platform/clinical-library/`)

Each sub-area + key state is a candidate built page:

- `clinical-library.guidelines.html` — Dietary Guidelines table, populated (default landing)
- `clinical-library.guidelines-empty.html` — Dietary Guidelines, no entries yet
- `clinical-library.guidelines-detail.html` — single guideline detail/edit view
- `clinical-library.guidelines-add.html` — add-new guideline form
- `clinical-library.codes.html` — Diagnosis Codes table, populated
- `clinical-library.codes-empty.html` — Diagnosis Codes, no entries yet
- `clinical-library.codes-detail.html` — single code detail/edit view (inline edit preferred)
- `clinical-library.codes-add.html` — add-new code form

The sub-nav zone switch (Guidelines ↔ Codes) may be represented as a single HTML page with active-state toggling at build, or as two separate files — finalized at build. The contract here is the state set.

## Cognitive-walkthrough pre-commit (feeds acceptance.md)

A coordinator needing to add a diagnosis code should: (orientation) land on Clinical Library and immediately see the two-zone sub-nav + the active zone's reference table; (path) switch to Diagnosis Codes, find the Add button, fill the form in one step, and return to the populated table; (affordance) the edit/deprecate actions on existing rows are visible but not visually dominant — this is a reference surface, not an action surface; (cross-link) a coordinator reviewing a patient's dietary tab and clicking a diagnosis-code tag should land on that code's detail view without losing context.
