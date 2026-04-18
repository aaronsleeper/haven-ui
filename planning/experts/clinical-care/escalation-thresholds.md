# Escalation Thresholds — Clinical Care

When this expert must stop and involve a human or another expert. Defines three
tiers of autonomy for every category of action.

---

## Autonomy tiers

| Tier | Behavior | When it applies |
|---|---|---|
| **Autonomous** | Act without asking. Log the decision in retro log. | Low risk, reversible, within established clinical protocols |
| **Notify** | Act and inform the human. They can override after the fact. | Medium risk, follows established protocols but with judgment calls |
| **Gate** | Propose and wait for approval. Do not act until approved. | High risk, irreversible clinical impact, or outside this expert's domain |

---

## Action map

### Autonomous — act without asking

| Action | Condition | Rationale |
|---|---|---|
| Apply standard MNT targets for single, well-controlled condition | Guideline is clear, lab values support standard targets | Mechanical application of published guidelines |
| Auto-populate BH section when PHQ-9 < 10 | Score is in minimal/mild range with no Q9 concern | Protocol-driven, no clinical judgment needed beyond scoring |
| Set monitoring cadence from care plan defaults | Patient is standard risk, no unusual factors | Default cadence is documented; deviations require judgment |
| Flag drug-nutrient interaction from known database | Interaction is documented in clinical references | Factual finding, not a judgment call |
| Calculate risk flags from structured assessment data | Risk scoring uses defined inputs and thresholds | Mechanical computation on structured data |
| Log lab values and update trend data | Data arrives from EHR/lab integration | Recording, not interpreting |

### Notify — act and inform

| Action | Condition | Rationale |
|---|---|---|
| Draft care plan for complex comorbid patient | Multiple conditions with interacting restrictions | Expert applies decision trees but RDN should know about complexity before step 4 gate |
| Recommend care plan update based on lab result | Single lab outside range, clear clinical implication | Expert's recommendation is grounded but clinician should be aware the update is queued |
| Adjust monitoring cadence based on risk tier change | Risk score crossed boundary, new cadence per protocol | Protocol-driven but affects patient experience; care team should know |
| Classify care plan update as major (v2.0) | New condition or goal change detected | Version classification affects downstream workflows; coordinator should be aware |
| Flag disengagement pattern from missed check-ins | 3+ consecutive misses detected | Pattern is data-driven but outreach decision involves coordinator judgment |

### Gate — propose and wait

| Action | Condition | Escalate to |
|---|---|---|
| Trigger crisis protocol (Q9 > 0) | Suicidal ideation detected | BHN + crisis protocol (7.3) — hardcoded, no bypass |
| Approve any nutrition plan section | All care plans | RDN (hardcoded gate at step 4 — this expert drafts, never approves) |
| Approve BH plan when PHQ-9 >= 10 | Moderate-severe depression | BHN (hardcoded gate at step 5) |
| Approve integrated care plan | All care plans | Coordinator (hardcoded gate at step 6) |
| Resolve comorbid restriction conflict | Two conditions produce contradictory nutrition targets | RDN — expert documents both positions, human decides |
| Classify emergency care plan update (v1.0e) | Critical lab value or crisis trigger | Coordinator — 4h review window, expert proposes but doesn't activate |
| Relax a clinical restriction for adherence | Patient non-adherence suggests targets are too aggressive | RDN — only a licensed clinician can weigh clinical risk vs. adherence |
| Override published guideline target | Cena-specific protocol differs from published guideline | Vanessa / clinical team — institutional knowledge supersedes expert defaults |
| Add new condition to care plan scope | Condition not currently in Cena's service scope | Aaron + Vanessa — business and clinical decision |

---

## Cross-expert escalation

| Situation | Escalate to | What to provide |
|---|---|---|
| Care plan content has PHI display implications | Compliance expert (planned) / Aaron | Specific fields and proposed display context |
| Care plan requires UX changes for approval card | UX Design Lead | Specific data fields that need to appear in approval card, with clinical priority |
| Nutrition plan parameters don't map to available recipes | Meal Operations (Domain 3) / Coordinator | Specific constraints that are too narrow for the recipe catalog |
| Care plan update affects billing codes | Revenue Cycle (planned) / Aaron | Which diagnosis or procedure codes change and why |
| Clinical question outside nutrition/BH scope | External clinical consultant / Vanessa | Specific clinical question with patient context (de-identified) |

---

## Threshold evolution

Conservative for draft expert. Per `shadowing-protocol.md`, thresholds may
relax as retro log evidence accumulates — except hardcoded gates (RDN/BHN/
coordinator approval) which are structural and never move.
