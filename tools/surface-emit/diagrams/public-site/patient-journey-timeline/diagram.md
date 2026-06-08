---
use_case: patient-journey-timeline
diagram_type: swimlane-flow
layout_direction: horizontal-left-to-right
viewbox: "0 0 2080 720"
lanes:
  - id: patient
    label: PATIENT
    y_center: 110
    actors:
      - patient
  - id: clinical-staff
    label: CLINICAL STAFF
    y_center: 280
    actors:
      - partner-program-coordinator
      - partner-rd
      - partner-clinician
      - partner-care-coordinator
  - id: substrate
    label: CENA SUBSTRATE
    y_center: 450
    actors:
      - cena-substrate
  - id: provenance
    label: PROVENANCE ARTIFACT
    y_center: 620
    actors:
      - audit-trail
node_placement:
  01-referral:
    x_center: 145
    emphasis: default
  02-enrollment:
    x_center: 360
    emphasis: default
  03-assessment:
    x_center: 575
    emphasis: default
  04-care-plan:
    x_center: 790
    emphasis: default
  05-ordering:
    x_center: 1005
    emphasis: default
  06-fulfillment:
    x_center: 1220
    emphasis: default
  07-adherence-check-ins:
    x_center: 1435
    emphasis: default
  08-outcome-capture:
    x_center: 1650
    emphasis: default
  09-re-assessment:
    x_center: 1865
    emphasis: default
edges_from_manifest: true
edge_overrides:
  - within_lane: substrate
    style: muted
    label: ""
    note: "Substrate-lane within-stage flow is the load-bearing temporal axis; muted style keeps it documentation-quiet."
caption: "The live academic-medical-center HIV-nutrition program, end-to-end. Each stage crosses four lanes: the patient's action (top), the partner's clinical staff action, Cena's substrate action, and the audit-trail artifact the substrate writes at that stage (bottom). The bottom lane is the legal/compliance reader's deep-link read; the substrate lane is the technical/financial reader's read; the clinical lane carries the partner-protagonist accountability frame."
---

# Diagram intent — patient journey timeline (blueprint render)

## What this diagram emphasizes

The **four-lane structure** is the load-bearing innovation. Each lane serves a distinct decision-role read:

- **Patient lane (top)** — the patient as the protagonist of their own care, mediated by the partner's clinical team. Patient cells use role language (*"patient enters via referral,"* *"patient receives fulfillment"*) not identity language.
- **Clinical staff lane** — the partner's clinical team at every stage where a clinical call is required. HDG row 4 partner-clinician phrasing throughout. Per HDG packet §3.2 row "Accountability model" — *"During pilots, partner-institution clinicians retain clinical accountability for every recommendation Cena's substrate generates."* This is the load-bearing accountability frame; never *"Cena's clinicians,"* never *"Cena's care team."*
- **Substrate lane** — what the substrate *does*, structural verbs only. The substrate work is *underneath*, never *in front of*, the clinical staff lane (per voice.md §2 Reference program register). Stage 07 (adherence-check-ins) and stage 08 (outcome-capture) carry the easiest-to-overclaim cells per HDG §8 watchlist — these cells are written conservatively.
- **Provenance artifact lane (bottom)** — the audit-trail artifact written at each stage. This is the legal/compliance reader's lane — a scan of just this lane should read as a complete defensible trail per Cena's accountability model. Verbs in this lane are nominal (*"referral receipt + source attribution + timestamp"*) — the artifact's existence is the claim.

## Lane choice

Four lanes (PATIENT / CLINICAL STAFF / CENA SUBSTRATE / PROVENANCE ARTIFACT) stratified by **actor type + audit-trail axis**. The provenance-as-swim-lane structure is the distinguishing feature from the sibling SoP-use-case swim-lanes (which use AGENT / HUMAN / PARTNER / SYSTEM stratification); here the audit-trail is first-class because the page's legal/compliance read requires it. Per IA §7.

A PARTNER lane was considered (used in the SoP-use-case swim-lanes for partner watcher-only relationships) but rejected for this diagram. On the public site's blueprint frame, the *partner-institution clinicians ARE the clinical-staff lane* — the partner is not an outside watcher, the partner runs the program. The accountability framing folds the partner-relationship into the clinical-staff lane's HDG row 4 partner-possessive phrasing.

## Layout direction

Left-to-right because the temporal sequence is strictly linear (Referral → Enrollment → Assessment → Care plan → Ordering → Fulfillment → Adherence check-ins → Outcome capture → Re-assessment). The Re-assessment stage produces a soft back-edge to Care plan in operational reality (re-assessment can trigger care-plan revision); for v0.1 this back-edge is rendered as a documentation note in the substrate-lane cell rather than as a visible loop arrow — keeps the timeline reading linearly. Promotion to a visible back-edge is a Haven Visual Designer call.

## Visualization rules

- **No emphasis modifier on any stage cell** — this diagram's load is breadth (9×4 = 36 cells) not climax. Highlighting any stage as more-load-bearing-than-others would collapse the *"this is a complete program shape"* read into a *"these are the moments"* read; the four-roles audience needs to scan the WHOLE shape, not selected highlights. This is a deliberate restraint call per voice.md §2 Reference program register; the SoP-use-case swim-lanes use `--attestation-gate` modifiers on 1–2 climax cells which is the right call there (operational documents emphasize critical moments) but the wrong call here (blueprint documents emphasize completeness).
- **Substrate-action cells use the existing `.diagram-box--substrate` variant** — teal-800 fill, white text. This is the canonical "data-grounding" treatment per the existing components.css §12432; it visually distinguishes *"this is where Cena's structural work lives"* across all 9 substrate-lane cells. Uniformity across all 9 substrate cells is intentional — it carries the *"by the system, automatically"* read.
- **Patient + clinical-staff cells use the default `.diagram-box`** — sand-50 fill, sand-300 stroke. No variant modifier. The default register matches the artifact-voice constraint; the read is documentation, not marketing.
- **Provenance cells use the default `.diagram-box`** — same default register. NOT `.diagram-box--milestone-done` (green-50 fill) which reads as *"outcome achieved"* and collides with the artifact-voice constraint (artifact is *produced*, not outcomes *achieved*). Per Phase 3a audit §3 brand-fidelity considerations recommendation. Promoting a `.diagram-box--provenance` variant for register differentiation is deferred to the Haven Visual Designer expert.
- **Stage column headers** above the diagram name each of the 9 stages (Referral, Enrollment, etc.) as small tiny-caps Source Code Pro labels — matches `diagram-lane-label` register so headers + lane labels share one vocabulary. Header treatment specifics (background tint, separator weight) deferred to Haven Visual Designer.
- **Intra-lane edges (default arrow)** — within the substrate lane only, the 8 inter-stage arrows show the load-bearing temporal axis. `.diagram-arrow--muted` keeps the flow documentation-quiet. Patient + clinical + provenance lanes do NOT carry inter-stage arrows — those lanes read as the cells themselves; adding 24 more arrows for symmetric coverage would clutter the read without adding signal.
- **No uncertainty modifiers in v0.1.** Stages 07–08 are the watchlist cells per HDG §8 (substrate adherence-capture + outcome-attribution claims must hold under technical-evaluator scrutiny). v0.1 hedges in cell COPY rather than visual modifier — the cells read conservatively. Promoting to `--uncertain-tbd` is the right call if a substantive claim doesn't survive Andrey's review of current Spark + Ava fidelity.
- **No watcher annotations.** This diagram has no partner-as-watcher relationships (the partner IS the clinical-staff lane, not a watcher); the four-lane structure already encodes "who does what" at every stage.

## Instructions to the rendering agent

Hand-author the SVG following the conventions in the sibling bundle `content-sot/use-cases/phq9-administration/rendered-diagram.html`. Mirror its structure: `<!DOCTYPE html>` + `<head>` with relative stylesheet link to the haven-ui main.css + inline `<style>` for any per-rendering chrome + SVG body with `<defs class="diagram-marker-defs">` + lanes + boxes + edges + caption.

**Reuse the existing diagram primitives only.** `.diagram-frame`, `.diagram-frame-wrap`, `.diagram-lane`, `.diagram-lane-label`, `.diagram-box`, `.diagram-box-shape`, `.diagram-box-label`, `.diagram-box-sublabel`, `.diagram-box--substrate`, `.diagram-arrow`, `.diagram-arrow--muted`, `.diagram-marker-defs`, `.diagram-caption`. **Do not add inline modifier classes** for v0.1 — the slice's scope explicitly defers visual-language calls (lane background tints, substrate-uniformity register, provenance-lane treatment, stage-column-header treatment) to the Haven Visual Designer expert.

**Do not name vendor stack** anywhere — no Anthropic, Google Cloud, Vertex AI, Epic, Cerner, Athena. HDG row 3 governs. Substrate-action cells describe *what the substrate does*, never *what vendor underlies it*.

**Generic-AMC framing throughout** — never name UConn. The strict-superset upgrade is deferred to a later edit when Vanessa clearance lands.
