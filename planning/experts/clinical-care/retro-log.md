# Retro Log — Clinical Care

Running record of interactions, self-assessments, peer reviews, and update proposals.
This is the expert's learning mechanism — reviewed and synthesized during `/expert-update`.

See `experts/expert-spec.md` for the full review system protocol.
See `experts/shadowing-protocol.md` for the shadow-to-live graduation path this
expert will follow.

---

## Interaction summaries

### 2026-04-06 — Expert created

**Task:** Draft the initial Clinical Care expert with all 9 layers, grounded in
Cena Health's care-plan-creation workflow, patient operations domain, and clinical
domain knowledge.

**Recommendation:** Full 9-layer spec. Domain knowledge from workflow docs + published
guidelines. Output contracts aligned to care-plan-creation steps 1/2a. Thresholds
conservative per `shadowing-protocol.md`.

**Outcome:** Pending — not yet applied to a real case.
**Overrides:** None. **Surprises:** None.
**Layers affected:** All (initial creation).

**Stakeholder gaps:** Cena-specific MNT protocols, EHR integration specifics,
clinical risk thresholds, output field formats — all require Vanessa input.

**Next:** Capture Vanessa input → shadow steps 1 + 2a (min 5 runs each) → validate.

---

## Self-assessments

_No self-assessments yet — first one will run during the initial `/expert-update` sweep
after this expert has accumulated interaction summaries from shadowing._

---

## 360 peer reviews

_No peer reviews yet — requires other experts in the dependency graph to be online._

**Planned reviewers when available:**

| Reviewer | Type | What they'd evaluate |
|---|---|---|
| UX Design Lead | Downstream | Are care plan fields sufficient for approval card rendering? Do field names match what UX expects? |
| Compliance | Lateral | Does the care plan respect PHI boundaries? Are consent scope implications handled? |
| Patient Ops | Downstream | Are output formats consumable by orchestration? Is confidence signaling useful for reconciliation? |
| RDN (human — Vanessa) | Upstream/domain | Do clinical targets match institutional standards? Are restriction conflicts handled the way the clinical team would handle them? |

---

## Update proposals

_No proposals yet — first synthesis will follow the first self-assessment + 360 review cycle._
