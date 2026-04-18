# Checkpoints — Care Plan Creation

> Human decision points in this workflow. Each checkpoint defines what the human
> sees, what they can do, and where each decision routes.

---

## Checkpoint 1 — RDN approval (after step 3)

```yaml
after_step: "3.0"
tier: gate
audience: RDN (assigned to this patient)
sla: 24 hours
escalation: Reminder at 12h. Escalate to RDN supervisor at 24h.
hardcoded: true  # cannot be overridden — clinical sign-off required
```

**What the RDN sees:**

| Card section | Content | Source |
|---|---|---|
| Patient summary | Name, age, diagnosis codes, risk tier | Patient record |
| Goals | 3-5 SMART goals with clinical rationale | Draft care plan (step 1) |
| Nutrition plan | Caloric targets, macro limits, dietary restrictions, meal prescription parameters | Draft care plan (step 1) |
| Relevant labs | Most recent HbA1c, glucose, lipids, eGFR — with trend direction | Patient assessment |
| Clinical flags | Any issues from clinical review (step 2a) | Clinical Care handoff envelope |
| Medications | Current list with drug-nutrient interactions flagged | Patient record + reconciliation |
| Compliance notes | Any PHI display or consent issues flagged | Compliance handoff envelope (step 2c) |

**Decision options:**

| Decision | Routing |
|---|---|
| **Approve** | Proceed to step 5 (BHN) or step 6 (coordinator) |
| **Approve with edits** | RDN's edits are applied to the draft, then proceed. Edits logged in thread. |
| **Reject — needs revision** | Return to step 1 with rejection reason. Clinical Care re-drafts. Max 2 revision cycles before escalating to coordinator. |
| **Reject — patient not ready** | Workflow halts. Patient status remains `care_plan_pending`. Coordinator notified with reason. |

---

## Checkpoint 2 — BHN approval (conditional, after step 4)

```yaml
after_step: "4.0"
tier: gate
audience: BHN (assigned to this patient)
sla: 24 hours
escalation: Escalate to BHN supervisor at 24h.
hardcoded: true
condition: PHQ-9 >= 10 at intake assessment
```

**What the BHN sees:**

| Card section | Content |
|---|---|
| PHQ-9 score + trend | Current score, previous if available, classification |
| GAD-7 score | Current score if administered |
| Behavioral health plan | Session cadence, escalation thresholds, safety plan status |
| SDOH summary | Relevant social determinants from intake |

**Decision options:**

| Decision | Routing |
|---|---|
| **Approve** | Proceed to step 6 (coordinator) |
| **Approve with edits** | BHN edits applied, proceed |
| **Reject — needs BHN session first** | Workflow pauses. BHN session scheduled. Resumes after session. |

---

## Checkpoint 3 — Coordinator final approval (after step 5 or 4)

```yaml
after_step: "5.0 or 4.0"  # depends on whether BHN gate was required
tier: gate
audience: Care coordinator (assigned to this patient)
sla: 24 hours
escalation: Reminder at 12h.
hardcoded: true
```

**What the coordinator sees:**

| Card section | Content |
|---|---|
| Full care plan | All sections, with RDN and BHN approval status shown |
| Logistics | Delivery address, schedule, hot/cold preference, contact prefs |
| Visit schedule | RDN visits, BHN sessions, PCP follow-ups — dates and modality |
| Monitoring setup | AVA check-in frequency, lab draw schedule |
| UX flags | Any presentation issues from UX review (step 2b) — informational |

**Decision options:**

| Decision | Routing |
|---|---|
| **Approve** | Proceed to step 7 — lock and activate |
| **Approve with logistics edits** | Coordinator adjusts delivery/schedule details, proceed |
| **Reject — coordination issue** | Specific issue flagged, routed to relevant expert or human for resolution |

---

## Checkpoint summary

| # | Gate | Audience | Hardcoded | Condition |
|---|---|---|---|---|
| 1 | RDN approval | RDN | Yes | Always |
| 2 | BHN approval | BHN | Yes | PHQ-9 >= 10 |
| 3 | Coordinator approval | Care coordinator | Yes | Always |

All three are hardcoded gates — this workflow has no autonomous-tier human
decisions. The care plan is the highest-stakes artifact in the patient journey;
every section requires human sign-off from the appropriate discipline.
