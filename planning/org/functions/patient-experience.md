# Patient Experience

> The cross-cutting function that owns the holistic patient journey — not individual
> touchpoints (those belong to Patient Ops, Clinical Care, Meal Ops) but the overall
> experience quality, satisfaction, and engagement that determines outcomes and retention.

---

## Responsibilities

- Patient satisfaction measurement (NPS, CSAT, per-touchpoint ratings)
- Experience design — consistency across all patient-facing surfaces
- Patient engagement strategy — keeping patients active in the program
- Patient communication preferences and personalization
- Complaint handling and service recovery
- Patient advisory input — incorporating patient voice into product decisions
- Health literacy and accessibility — ensuring materials work for all patients
- Cultural competency — language, dietary, and cultural sensitivity

## Sub-functions

| Sub-function | Automation target | Agent coverage | Notes |
|---|---|---|---|
| Satisfaction measurement | 🤖 Automated | AVA, ReportingAgent | Collected during check-ins; aggregated in dashboards |
| Satisfaction trend analysis | 🤖 Automated | ReportingAgent | Anomaly detection on per-patient and cohort trends |
| Engagement scoring | 🤖 Automated | RiskScoringAgent | Call completion, meal feedback, appointment adherence |
| Disengagement detection | 🤖 Automated | RiskScoringAgent, AlertRouter | Pattern-based: missed calls, declined meals, no-shows |
| Service recovery | 🤝 Agent-assisted | CommunicationAgent | Agent flags issue + drafts outreach; coordinator personalizes |
| Complaint triage | 🤝 Agent-assisted | AlertRouter | Categorize, route, track resolution |
| Experience analytics | 🤖 Automated | ReportingAgent | Journey-level analysis: where do patients drop off? |
| Patient advisory collection | 🤝 Agent-assisted | AVA | Structured feedback collection during interactions |
| Health literacy review | 🤝 Agent-assisted | None (gap) | Review patient-facing content for reading level |
| Communication personalization | 🤖 Automated | CommunicationAgent | Channel, language, time preference enforcement |

## Interfaces

| Direction | Function | What flows |
|---|---|---|
| **From** | Patient Operations | Enrollment experience, scheduling friction |
| **From** | Clinical Care | Visit experience, provider communication quality |
| **From** | Meal Operations | Meal satisfaction, delivery experience |
| **From** | Patient Operations | Per-interaction satisfaction via AVA check-ins, qualitative feedback |
| **To** | Product & Engineering | Experience improvement requirements |
| **To** | Clinical Care | Patient-reported experience data for care planning |
| **To** | Executive | Patient satisfaction KPIs, retention metrics |
| **To** | Partner & Payer | Patient satisfaction metrics for partner reporting |
| **To** | Risk & Quality | Engagement scores as risk factor |

## Current state

Patient experience is distributed across other functions with no unified ownership.
AVA check-ins collect some satisfaction data. No NPS, no experience analytics, no
formal complaint handling process.

## Quality checks

- Patient satisfaction measured at every major touchpoint (enrollment, first meal, first visit, monthly)
- Disengagement alerts generated within 48 hours of pattern detection
- Complaints acknowledged within 24 hours, resolved within 7 days
- Patient-facing materials validated for health literacy (6th grade reading level target)
- Experience metrics included in every partner report

## Why this function matters

Patient engagement directly drives clinical outcomes in food-as-medicine programs.
A patient who stops answering AVA calls, declines meals, or misses appointments is
a patient whose health outcomes will suffer — and whose data stops flowing into the
system. Patient experience isn't a nice-to-have; it's the mechanism that keeps the
entire model working.

## Automation roadmap

**Phase 1:** Engagement scoring integrated into risk model. Disengagement detection
as an automated alert. Satisfaction collection during AVA calls.

**Phase 2:** Journey-level experience analytics. Automated service recovery for
common issues (missed delivery → immediate reorder + apology). Complaint triage.

**Phase 3:** Predictive engagement modeling — identify patients likely to disengage
before they do. Personalized intervention strategies based on patient profile.
