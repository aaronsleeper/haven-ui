# Screen Flow: Provider Shell + Per-App Minimums

## Screens in This Feature

| ID | Name | Route | Persona | Shell |
|----|------|-------|---------|-------|
| shell-pv-provider | Provider-specific shell | `/` (persistent) | Provider (RDN — Dr. Soto) | shell-pv-provider |
| pv-01-patient-record-with-clinical-decision | Clinical queue + selected patient record + clinical-decision approval card (worked example) | `/patients/{patientId}/care-plan` | Provider (RDN) | shell-pv-provider |

Per Gate 2-prep decision 7: provider app restoration is at Stage 5 prep, not a separate gate. Wireframes here use `apps/_shared/design/wireframes/provider/` as the design home until `git mv archive/inactive-apps/provider apps/provider` runs.

Per Gate 2-prep decision 8: BHN deferred at v1. Provider serves RDN only. Per Gate 2-prep decision 6: clinical-decision approval card is `thread-approval-card.is-clinical` variant (not new primitive).

## Navigation Flows

- App open → shell-pv-provider renders → left = clinical queue gate-type-grouped + secondary nav, center = caseload overview, right = empty-state thread
- shell-pv-provider (click "Care plan nutrition review" item) → pv-01-patient-record-with-clinical-decision (queue item active, center loads patient record with nutrition focus + biomarker trends, right loads clinical thread with `thread-approval-card.is-clinical` approval card)
- pv-01-patient-record-with-clinical-decision (Approve clicked) → 5-second undo toast → decision logs as `thread-msg-response.is-approved` with signature timestamp + signer identity → coordinator's full-plan approval card appears in coordinator's queue
- pv-01-patient-record-with-clinical-decision (Edit first clicked) → inline edits in nutrition section in center → Save & approve → flow returns to Approve handling
- pv-01-patient-record-with-clinical-decision (Reject clicked) → note required → decision logs → agent receives feedback → care plan re-routes for redraft
- pv-01-patient-record-with-clinical-decision (Reassign to BHN clicked) → routes to BHN queue (deferred at v1; UI shows "BHN reassignment is not yet available; please contact coordinator" placeholder)
- shell-pv-provider (click "SOAP note pending signature" item) → pv-soap-note (deferred to later wireframe pass)
- shell-pv-provider (click "Lab results flagged" item) → patient record with lab focus (deferred)
- shell-pv-provider (click "Recipe nutritional validation" item) → recipe validation view (deferred)
- shell-pv-provider (click "Meal match exception" item) → patient + meal-match exception view (deferred)

## Shared Shell Components

- `shell-pv-provider.md` — provider-specific shell (this pass) inheriting from `apps/_shared/design/wireframes/shell-universal-agentic.md`
- Existing primitives: `agentic-shell`, `panel-splitter`, `queue-sidebar`, `queue-section-header` (gate-type-grouped — inline carve-out, no new modifier needed since gate types are content labels not visual semantics), `queue-item`, `thread-panel`, `thread-msg-*`, `thread-approval-card` + `[NEW VARIANT: thread-approval-card.is-clinical]`, `record-header`, `clinical-patient-card`, `clinical-metric-card`, `clinical-medication-row`, `clinical-nutrition-list`, `clinical-timeline`, `clinical-ai-field`, `trend-chart` (Chart.js), `prompt-input-container`
- New variant flagged: `[NEW COMPONENT: thread-approval-card.is-clinical variant]` — Tier 1 variant on existing `thread-approval-card`, brand-fidelity-weighted

## Out of Scope

- BHN UI — deferred at v1 per Gate 2-prep decision 8
- Provider mobile shell — desktop primary at v1; mobile lab-flag check-ins flagged for v1.1
- Caseload overview screen detail (pv-caseload) — secondary; shell renders the existing `data-table` + `clinical-patient-row` composition, full wireframe deferred
- Recipe nutritional validation screen detail (pv-recipes) — deferred
- SOAP note editor screen detail (pv-soap) — deferred to later wireframe pass; reference flow only
- Bilingual EN/ES — provider EN-only at v1
- Crisis-protocol UI for PHQ-9 Q9 flag — BHN-owned, deferred
