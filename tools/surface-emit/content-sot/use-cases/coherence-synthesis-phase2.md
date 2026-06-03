---
pass: coherence-synthesis
date: 2026-06-03
use_cases_analyzed:
  - escalation-phq9-positive
  - written-consent-execution
  - phq9-administration
  - monthly-uconn-review-meeting
  - weekly-checkin-call
  - initial-care-plan-meal-plan
phase: 2 (5 newly emitted + 1 reference)
---

## Headline

The set is **structurally coherent and ready for Friday**, with drift confined to cosmetic and per-use-case-specific extensions of the escalation reference pattern. Modifier-class CSS is identical across all six diagrams (verbatim copy, the right discipline). Cross-use-case hand-off edges name the same structural gaps (BHN role, first-action specifics, transport options) with the same language — three use cases consciously share the catalog #1 + #2 gaps and say so. Fragment-shape consistency holds within each type with **one structural divergence worth surfacing** (attestation-gate frontmatter shape is consistent in *content* but the patient-as-attestor case uses a different signature semantic — that is the deliverable, not the drift). The only fix-before-Friday items are (1) a small glossary-definition drift on `Attestation gate` and `Chain of custody` where two use cases added trailing extensions that change phrasing slightly, and (2) the inventive-primitive matrix has one manifest-vs-fragment mismatch in `phq9-administration` (claims `enquiry` + `decision` as inventive primitives, but those are PROforma primitives, not Cena-novel ones). Everything else is informational or fix-later.

## 1. Glossary drift

Ten distinct terms appear across the six rendered SoPs. Cross-use-case overlaps:

| Term | Appears in | Definition variants | Recommendation |
|---|---|---|---|
| **PHQ9** | escalation, phq9-admin, initial-care-plan | All three verbatim: "Patient Health Questionnaire 9-item — a validated depression screening instrument scoring 0–27. Clinical thresholds for 'positive' vary by guideline source; Cena's pilot threshold is pending Healthcare Data Governance review." | **No drift.** Canonical phrasing already locked. |
| **BHN** | escalation, monthly-uconn-review, weekly-checkin | escalation: "the partner clinical team that receives escalated cases for behavioral health follow-up. Whether BHN is a Cena-staffed role or a UConn-side function is unresolved as of this draft." monthly-uconn: same first sentence + adds "This SoP does not itself route to BHN, but a downstream clinical refinement might." weekly-checkin: same first sentence + adds "Same definition as the PHQ9 escalation use case; resolution applies to both." | **Cosmetic drift.** All three carry identical core definition; per-use-case tails are appropriate context. Recommend: canonical lead sentence + per-SoP scoping clause is the right pattern. Codify as glossary convention in the README. |
| **Attestation gate** | escalation, written-consent, phq9-admin, monthly-uconn, initial-care-plan | escalation/phq9-admin/initial-care-plan: identical core "A point in a procedure where a named human in a named role must record an explicit sign-off — with rationale and timestamp — before the case can proceed. Every sign-off generates an immutable audit-trail entry." written-consent appends: "In this procedure, the attestor is the participant; the attestation is the participant's handwritten signature on the paper consent form." monthly-uconn appends: "This SoP names two attestation-gate-shaped moments that are NOT currently defined as gates: the meeting-close sign-off (decisions captured) and the ownership-transition gate (Vanessa attesting Marrero is ready). Both are candidate gates the catalog flagged but did not author." | **Acceptable structured drift.** Same lead sentence; per-use-case extensions name structural specifics. Same convention as BHN. Recommend: hold this pattern. |
| **Chain of custody** | escalation, written-consent, phq9-admin, weekly-checkin, initial-care-plan | All five carry identical core: "The sequenced, hashed record of every action taken on a case — from the trigger event through every attestation gate, hand-off, and acknowledgment. Allows the case history to be reconstructed deterministically for audit or regulatory review." written-consent appends "In this procedure, chain of custody spans paper (signature) → administrator hand-off → digitized PDF → Athena record." | **No meaningful drift.** Same canonical sentence + one per-use-case extension. |
| **C-SSRS** | escalation only | Single canonical definition. | **No drift.** |
| **IRB** | written-consent only | Single canonical definition. | **No drift.** |
| **CITI training** | phq9-admin only | Single canonical definition. | **No drift.** |
| **CQI** | monthly-uconn only | Single canonical definition. | **No drift.** |
| **HFIAS / HEI / WHOQOL-HIV BREF / NKQ** | initial-care-plan only | Single canonical definitions. | **No drift.** |

**Verdict for axis 1:** Zero structural definition conflicts. All cross-use-case terms either match verbatim or carry the same lead sentence + per-SoP-specific tail. The pattern is good and worth codifying as a convention.

## 2. Shared hand-off conflicts

Three cross-use-case edges identified:

### Edge A: phq9-administration (fragment 05) → escalation-phq9-positive (fragment 01)

| Property | Originating side (phq9-admin/05) | Receiving side (escalation/01) | Consistent? |
|---|---|---|---|
| Target | `out-of-scope-escalation-phq9-positive`, named explicitly as `target_use_case: escalation-phq9-positive` + `target_fragment: 01-trigger-phq9-positive (entry of escalation use case)` | Frag 01 `trigger.source: "PHQ9 screening assessment completion (onboarding or recurring check-in)"` — describes the upstream event, not the upstream use case | **Consistent in intent**; receiving side doesn't name administration as the upstream by use-case-id, but the trigger-source language covers it. Recommend: light edit on escalation/01 frontmatter to reference `phq9-administration` as the named producer for traceability. |
| Severity vocabulary | `x_cena_severity: red-yellow` (combined) for positive branch on phq9-admin/04 → admin/05 → escalation | escalation/02 splits into `red` / `yellow` / `green` | **Consistent.** Admin's combined red-yellow is upstream of escalation's per-tier split — admin doesn't know severity tier yet, escalation does. No reconciliation needed. |
| Hand-off package | canonical PHQ9 record + identity + admin context + prior screenings | Frag 01 doesn't list received package; consumed implicitly by frag 02's severity assessment | **No conflict** but receiving-side payload contract is implicit. Recommend: add `incoming_package` block to escalation/01 frontmatter naming what frag 02 needs, so the contract is symmetric. |
| SLA | `same-day — no deferral to next check-in (per catalog attestation/escalation point)` | escalation has SLA pending at fragment 03 (clinical lead), but no entry-side SLA | **Consistent.** Admin owns the producer-side same-day handoff SLA; escalation owns the receiver-side review SLA. Distinct SLAs, both pending Marrero. |

### Edge B: weekly-checkin-call (fragment 06) → "UConn clinical team" (also escalation-phq9-positive fragment 04 receiver-side analog)

| Property | weekly-checkin/06 | escalation/04 | Consistent? |
|---|---|---|---|
| Receiving actor | `role: TBD — UConn clinical team member OR BHN intake coordinator (Cena-staffed?)` | `role: TBD — BHN intake coordinator OR UConn clinical team member` | **Consistent.** Both name the same two-headed ambiguity and label the catalog #1 gap with explicit cross-reference. weekly-checkin/06 says: "shares the receiving-actor edge with escalation-phq9-positive (fragment 04)." |
| Transport options | Secure messaging API / Athena CommonWell / fax fallback | Same three options | **Consistent verbatim.** |
| Package contents | patient identity + check-in summary + structured outcome + concern detail + care plan summary + prior history + preferences | patient identity + PHQ9 result + C-SSRS + clinical-lead attestation + care plan + preferences | **Use-case-appropriate divergence.** Yellow-flag package contains check-in-specific evidence; PHQ9 escalation package contains screening-specific evidence. Shared backbone (identity + care plan + preferences) is identical. Recommend: extract the shared backbone as a named `cena.handoff.clinical-team.base-package` reference and have each use case extend it. (Fix-later — not Friday-blocking.) |
| Ack SLA | TBD pending UConn protocol | TBD pending UConn protocol | **Consistent.** Both note same gap. |
| First-action specifics | Catalog #2 gap; same NEEDS VANESSA / MARRERO placeholder | Catalog #2 gap; same placeholder | **Consistent — deliberately shared.** Both use cases name the same gap with the same language. |

**BHN gap handled consistently across both use cases** — three use cases (escalation, weekly-checkin, monthly-uconn) and the phq9-admin inherit name BHN-vs-UConn-clinical-team as catalog #1, all with similar wording, all cross-referenced. Excellent coherence.

### Edge C: initial-care-plan-meal-plan (fragment 04) → downstream meal-prescription workflow

| Property | Originating side | Receiving side | Consistent? |
|---|---|---|---|
| Receiving actor | `role: meal-prescription-workflow (downstream Cena workflow); organization: Cena platform (internal hand-off, not cross-organization)` | Not in scope of any use case in this batch | **Out-of-scope-deferred, named honestly.** `x_cena_uncertainty: deferred` is the right call. No conflict to reconcile. |

### Edge D: monthly-uconn-review-meeting (fragment 05) → Marrero / Vanessa (clinical / operational refinements)

| Property | Originating side | Receiving side | Consistent? |
|---|---|---|---|
| Receiving actor | Conditional routing by classification | No receiving fragment in this batch (downstream pipelines out of scope) | **Consistent — no cross-fragment edge to reconcile.** |

**Verdict for axis 2:** No structural conflicts. The shared catalog #1 (BHN) and #2 (first-action specifics) gaps are named with the same language and cross-referenced from all four use cases that touch them — the deliberate consistency Aaron explicitly hoped for. One small recommendation: extract the shared clinical-team hand-off package backbone as a reference (fix-later).

## 3. Fragment-shape consistency

### enquiry fragments (8 total: 01-trigger × 6 + 03-enquiry × 2)

| Property | Consistency |
|---|---|
| `trigger:` block (`source:` + `fires_when:`) on initiating enquiries | All 6 trigger-shaped enquiries carry the same shape. **Consistent.** |
| `x_cena_actor` + `x_cena_actor_role` | Always paired except escalation/01 which has only `x_cena_actor: agent` (no `_role`). **Minor drift** — escalation predates the convention. Fix-later. |
| `x_cena_watches` | Present in all but written-consent/01 (which uses `x_cena_actor_role: registered-dietitian` and notes the executor-is-effective-supervisor case). **Acceptable carve-out** documented in manifest. |
| `outgoing_edges` | Present and well-formed in all 8. **Consistent.** |
| `gaps` | Present (possibly empty array) in all 8. **Consistent.** |
| Non-trigger enquiry shape (phq9-admin/03 records-the-data and weekly-checkin/03 conducts-the-call) | These use `enquiry:` block with `records:` (phq9-admin) and the same trigger-block (weekly-checkin/03). **Light divergence** — the README's "enquiry" type covers both data-capture and information-gathering shapes; documented OK. |

### decision fragments (4 total)

| Property | Consistency |
|---|---|
| `branches:` array with `condition` / `target` / `label` | All 4 carry the same shape. **Consistent.** |
| `x_cena_severity` on branches | escalation/02 uses `red/yellow/green`; phq9-admin/04 uses `red-yellow/green` (combined); weekly-checkin/04 uses `green/yellow`; weekly-checkin/02 omits severity (channel selection — not clinical). **Consistent intent**, vocabulary differences are use-case-appropriate. |
| `default:` field | Present in all 4. **Consistent.** |
| `gaps:` | Present in all 4. **Consistent.** |

### attestation-gate fragments (5 total)

| Property | Consistency |
|---|---|
| `attestation:` block (attestor_role + evidence_required + decision_payload_schema + sla + escalation_on_timeout) | All 5 carry the full 5-key block. **Consistent.** |
| `attestor_role` values | `clinical-lead` (escalation/03), `audit-system` (escalation/05), `participant` (written-consent/02), `registered-dietitian` (initial-care-plan/03), `[none — meeting/ownership-transition gates are flagged as undefined]` (monthly-uconn). **Use-case-appropriate diversity.** |
| `decision_payload_schema` shape | All include `decision: enum[...] / rationale: text / signed_at / signed_by`. Written-consent uses `signed_by: participant handwritten signature` + `witnessed_by:` field (additive — patient-as-attestor needs the extra field). **Consistent core + structurally honest extension.** |
| `sla:` always present | Yes, always (often TBD). **Consistent.** |
| `escalation_on_timeout:` always present | Yes, including escalation/05's `not applicable (audit system is synchronous)` — i.e. the field is filled even when the answer is "N/A." **Consistent.** |
| `outgoing_edges` with typed conditions (`attestation-approved` / `attestation-deferred` / `attestation-revise` / `attestation-declined`) | All 5 use typed edge labels from a shared vocabulary. **Consistent.** |

### hand-off fragments (6 total)

| Property | Consistency |
|---|---|
| `receiving_actor:` block (role + organization + identity_resolution) | All 6 carry the 3-key block. **Consistent.** |
| `handoff:` block (package_contents + transport + acknowledgment_required + ack_sla + on_ack_timeout) | All 6 carry the 5-key block. **Consistent.** |
| `on_ack_timeout:` with `action:` + `target_role:` | All 6 carry the sub-shape. monthly-uconn/05 uses `not defined` (also honest). **Consistent.** |
| Cross-org hand-offs (escalation/04, weekly-checkin/06) vs internal hand-offs (initial-care-plan/04, written-consent/03, monthly-uconn/05) | Cross-org shapes carry richer `identity_resolution` prose noting partner-protocol gaps. Internal shapes are tighter. **Consistent in intent.** |
| Cross-medium hand-off (written-consent/03 paper-to-human) | Same shape with `transport: physical paper hand-delivered same day`. **Consistent.** |

### action fragments (7 total)

| Property | Consistency |
|---|---|
| `action:` block | All 7 carry one, but the inner shape varies — `description:` (most) vs `performer_role:` + `steps:` + `system_actor:` + `output:` (written-consent/04 — richest) vs `performed_in:` + `inputs:` + `output:` (initial-care-plan/02) vs `inputs:` + `outputs:` (monthly-uconn/02, 03, 04). **Light divergence — the closed vocabulary doesn't lock the inner shape of `action:`.** Recommend: stabilize on a {description, inputs, outputs, system_actor (optional)} inner shape as the canonical pattern; fix-later.|
| `gaps:` | Present in all 7. **Consistent.** |
| `outgoing_edges:` | Present in all 7. **Consistent.** |

**Verdict for axis 3:** Within each type, fragment shape is consistent enough for downstream rendering. Two informational items to fix-later: (i) one missing `_role` on escalation/01 (legacy); (ii) the inner shape of `action:` could be more canonical.

## 4. Modifier-class consistency

### Diff of inline `<style>` blocks (focus: candidate modifier classes from lines 8–57 of escalation reference)

All 5 candidate modifier classes (`.diagram-box--attestation-gate`, `.diagram-box--uncertain-tbd`, `.diagram-box--uncertain-assumption`, `.diagram-box--uncertain-gap`, `.diagram-box-watcher-label`, `.diagram-tbd-callout` + 3 variants) appear **byte-identical** across all 6 rendered diagrams. Verified via inspection.

| Use case | Modifier-class block | Page chrome differences |
|---|---|---|
| escalation-phq9-positive | reference | `.diagram-frame-wrapper { max-width: 1180px }` |
| written-consent | identical | `1180px` |
| phq9-administration | identical + **adds inline TODO comment** for a future `diagram-box--watcher-cross-lane` modifier (NOT a CSS rule — just a `/* TODO */` comment naming a *proposed* class) | `1180px` |
| monthly-uconn | identical | `1240px` — widened to fit five-step diagram |
| weekly-checkin | identical | `1480px` — widened for seven-step diagram |
| initial-care-plan | identical | `1180px` |

**Inventions check:** Zero invented modifier classes. The phq9-administration TODO comment names a class that does NOT exist in the CSS — it's an explicit deferral marker pointing to the planned PL promotion. That is the discipline the diagram-mapper skill asks for, not a drift.

**Uncertainty-modifier choices spot-check** (per spec — `uncertain-tbd` = pending-external, `uncertain-gap` = structural-absence, `uncertain-assumption` = current-best-guess):

- escalation/01 trigger threshold pending HDG → `tbd` ✓
- escalation/02 severity tiers entirely unauthored → `gap` ✓
- escalation/04 BHN partner protocol assumed → `assumption` ✓
- written-consent/02 decline-to-sign path → `gap` ✓
- phq9-admin/04 threshold pending HDG → `tbd` ✓
- monthly-uconn/01 cadence shape assumed-from-catalog → `assumption` ✓
- monthly-uconn/02 Exhibit F absent → `gap` ✓
- weekly-checkin/06 partner protocol → `assumption` ✓
- initial-care-plan/03 SoP body doesn't surface gate → `gap` ✓
- initial-care-plan/04 downstream workflow deferred → `deferred` (5th value — README enumerates `resolved / tbd / assumption / gap / deferred`, valid) ✓

**Verdict for axis 4:** Excellent. The discipline held perfectly. The TODO marker in phq9-administration is a positive signal — the agent recognized a need but did not invent the class.

## 5. Inventive-primitive coverage matrix

|                       | escalation | written-consent | phq9-admin | monthly-uconn | weekly-checkin | initial-care-plan |
|-----------------------|:---:|:---:|:---:|:---:|:---:|:---:|
| **attestation-gate**  | ✓ (2 — clinical-lead, audit-system) | ✓ (1 — patient-as-attestor) | — | ⚠ candidate-gap only (NOT exercised; flagged twice as gaps) | — | ✓ (1 — RDN approval) |
| **escalation-route**  | ✓ | — | ✓ (5: handoff-to-escalation) | — | ✓ (06: yellow-flag) | — |
| **who-watches**       | ✓ (clinical-lead) | — (RD = executor + supervisor) | ✓ (UConn PI — partner-as-watcher) | ✓ (ownership-transition arc) | ✓ (clinical-lead) | ✓ (Dr. Wu) |
| **hand-off**          | ✓ (cross-org) | ✓ (cross-medium) | ✓ (cross-use-case) | ✓ (conditional routing + ownership transition) | ✓ (cross-org) | ✓ (internal) |

**Manifest-vs-fragment mismatches** (manifest claims primitive X; fragments don't exercise X — OR vice versa):

1. **phq9-administration manifest** declares `inventive_primitives_exercised: [enquiry, decision, escalation-route, who-watches]`. **`enquiry` and `decision` are PROforma primitives, not Cena-novel** per README's "Cena-novel `x_cena_*` fields" section — the four Cena-novel primitives are attestation-gate, escalation-route, who-watches, hand-off. The manifest catalog (line 67) says phq9-admin exercises `attestation-gate, escalation-route` only. **Fix-before-Friday — small.** Either: (a) drop `enquiry`/`decision` from the manifest's inventive-primitives list (recommended), or (b) clarify the field as "primitives exercised, Cena-novel + PROforma," in which case all manifests need to recheck. The README convention favors (a). Note: phq9-admin also exercises `hand-off` (fragment 05) but the manifest omits it. **Two underspecifications.**

2. **monthly-uconn-review-meeting manifest** declares `inventive_primitives_exercised: [hand-off, who-watches]` and the catalog says the same — and there are zero attestation-gates in the fragments because each candidate attestation moment is flagged as "candidate gap, not authored." That's the deliverable, not a miss. **Consistent.**

3. **initial-care-plan-meal-plan manifest** declares `inventive_primitives_exercised: [action, attestation-gate, who-watches, hand-off]`. Same `action` is-PROforma issue as phq9-admin's `enquiry/decision` declaration. **Fix-before-Friday.**

4. **escalation, written-consent, weekly-checkin** manifests correctly list only Cena-novel primitives. **Consistent.**

5. **escalation-route as a hand-off-type:** the README enumerates `escalation-route` as a value of `inventive_primitives_exercised` (line 67-72) but does NOT register it as a fragment type — it's a typed edge inside hand-off fragments (e.g., phq9-admin/05's edge `type: escalation-route`). **Vocabulary clash worth surfacing:** is `escalation-route` a fragment type, a primitive marker, or just a typed edge? Current usage is "primitive name + typed-edge value." **Informational** — clarify in the README.

## Recommended follow-ups

### Fix-before-Friday (drift Marrero / Vanessa could read into)

- **F1.** Drop `enquiry`, `decision`, `action` from manifest `inventive_primitives_exercised:` arrays in **phq9-administration** and **initial-care-plan-meal-plan**. The README pins inventive primitives to the four Cena-novel ones; including PROforma primitives in the list reads as confusion about what's novel.
- **F2.** Add `hand-off` to **phq9-administration** manifest's `inventive_primitives_exercised:` array — fragment 05 is a hand-off and it's not declared.
- **F3.** Spot-correct: the `Attestation gate` glossary definition is canonical in 3 SoPs (escalation, phq9-admin, initial-care-plan) and gets per-use-case appendices in 2 (written-consent, monthly-uconn). This is intentional. No edit needed — just confirm with Vanessa that the appended sentences are wanted.

### Fix-later (informational; not Friday-blocking)

- **L1.** Codify the glossary convention in `use-cases/README.md`: "Cross-use-case terms carry an identical canonical lead sentence; per-SoP extension sentences (`In this procedure, ...`) are allowed and encouraged when they name structural specifics."
- **L2.** Extract the **clinical-team hand-off package backbone** (patient identity + care plan summary + contact preferences) as a named reference in the README's vocabulary, and have escalation/04 + weekly-checkin/06 declare `extends: cena.handoff.clinical-team.base-package`. Reduces duplication and resolves once for both use cases.
- **L3.** Stabilize the inner shape of `action:` frontmatter blocks. Today's variants (description / inputs / outputs / system_actor / steps / performer_role / performed_in) need a closed vocabulary. Propose: `{ description, inputs, outputs, system_actor (optional), performer_role (optional) }`. Update README.
- **L4.** Add `x_cena_actor_role` field to escalation/01 (currently has `x_cena_actor: agent` only, no `_role`). Mechanical alignment with the now-standard pair.
- **L5.** Add `incoming_package:` block to **escalation/01** frontmatter naming what phq9-admin/05 sends and what fragment 02 needs. Currently the receiver-side contract is implicit.
- **L6.** Clarify in README: `escalation-route` is BOTH a Cena-novel primitive marker (manifest level) AND a typed edge value (fragment level). Today the dual usage is consistent but undocumented.

### Informational (no action this cycle)

- **I1.** The `phq9-administration` rendered-diagram.html carries an inline `/* TODO */` comment for a future `diagram-box--watcher-cross-lane` modifier. Correct discipline (no invented CSS); a candidate for the 4-expert PL-promotion panel.
- **I2.** Page-chrome `.diagram-frame-wrapper { max-width: ... }` varies across use cases (1180 / 1240 / 1480) based on diagram complexity. This is per-rendering chrome, not modifier-class drift. No fix needed.
- **I3.** **Strong cross-use-case coherence pattern worth celebrating:** the BHN gap (catalog #1) and first-action gap (catalog #2) are named with the same language, cross-referenced explicitly, and labeled with identical uncertainty modifiers in all four use cases that share them (escalation, phq9-admin, weekly-checkin, monthly-uconn). The shared-gap discipline held under parallel fan-out. This is the load-bearing test of the parallel-emission strategy and it passed.
- **I4.** Three use cases name a **novel candidate attestation shape that's not yet authored**: (a) monthly-uconn meeting-close sign-off, (b) monthly-uconn ownership-transition gate, (c) written-consent PDF-landed verification gate. All three are flagged as `:::callout-error` structural gaps. Worth surfacing to Marrero / Vanessa as a class of work: "attestations the catalog implies but doesn't yet author."
