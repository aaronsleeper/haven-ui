# Role: BHN (Behavioral Health Navigator)

> Clinical lead for mental health and behavioral health within the program. Owns the
> behavioral health section of care plans, conducts BHN sessions, and is the required
> responder for any mental health crisis. The BHN's response to a crisis flag is a
> hard requirement — no queue, no SLA, immediate.

---

## Primary app surface

**Provider app** — patient records, behavioral health assessments, care plan BH sections,
PHQ-9/GAD-7 trends, and the clinical queue.

---

## Responsibilities

- Review and approve the behavioral health section of care plans when PHQ-9 ≥ 10
- Conduct BHN sessions (initial and follow-up)
- Sign session documentation
- Own the crisis response workflow — immediate response to PHQ-9 Q9 > 0 or AVA crisis flag
- Monitor PHQ-9 and GAD-7 trends across caseload
- Escalate to PCP when depression severity requires medication evaluation
- Maintain and update safety plans for patients with active crisis history

---

## What the BHN sees

**Clinical queue:**
- Crisis alerts (surfaced immediately, outside normal queue ordering)
- PHQ-9 scores ≥ 10 requiring BHN session scheduling
- Care plan BH sections awaiting review
- Session notes awaiting signature
- PHQ-9 follow-up reminders (for patients with positive screens)
- Safety plan review reminders

**Patient record view:**
- PHQ-9 and GAD-7 score history (full trend)
- SDOH data relevant to behavioral health (housing stability, social isolation)
- Current safety plan (if active)
- Medication list (read-only — relevant to BH med interactions)
- BHN session history
- AVA call summaries with mood/energy ratings

**Thread view:**
- Crisis protocol threads (always accessible, regardless of assignment)
- BHN session threads
- Coordinator and RDN notes visible as summaries

---

## Approval gates owned by BHN

| Gate | Condition | SLA |
|---|---|---|
| BH plan approval | PHQ-9 ≥ 10 at assessment or plan creation | 24h (3 days if PHQ-9 ≥ 10) |
| BH plan update | Care plan revision affecting behavioral health | 24h |
| Session note signature | Every completed BHN session | 48h post-session |
| Safety plan co-signature | Any patient with active safety plan | Immediate on creation |
| Crisis protocol acknowledgment | PHQ-9 Q9 > 0 or AVA crisis flag | **Immediate — no SLA, bypasses queue** |

---

## Crisis protocol (hardcoded, cannot be configured away)

When a crisis flag is triggered — from AVA sentiment analysis, PHQ-9 Q9 > 0, or coordinator
escalation — the following sequence executes automatically:

1. Alert fires to all on-call BHNs simultaneously (SMS + app push)
2. A crisis thread is created with full context (what was said, score, patient contact info)
3. The care coordinator is notified in parallel
4. BHN acknowledges the alert — this starts the clock on response actions
5. BHN assesses severity using C-SSRS (structured — not free text)
6. Based on C-SSRS result:
   - Low risk: safety planning session, schedule follow-up within 48h
   - Moderate risk: same-day or next-day BHN session + PCP notification
   - High risk: emergency services contact, emergency contact notification, crisis center referral
7. Safety plan created or updated — co-signed by BHN and patient
8. Safety plan transmitted to PCP via FHIR
9. All future BHN and RDN visits flagged until safety plan is resolved

**The crisis thread is never closed by an agent.** Only the BHN can close a crisis thread,
after documenting resolution.

---

## Scope of practice limits

The BHN is a navigator, not a therapist or prescriber. Platform workflows reflect this:

- BHN **cannot** prescribe medications or modify medication records
- BHN **cannot** authorize emergency psychiatric holds (can initiate contact with emergency services)
- BHN **cannot** provide ongoing psychotherapy — they navigate to appropriate resources
- PHQ-9 score ≥ 15 requires PCP notification in addition to BHN session — agent auto-triggers this

---

## What the BHN cannot do

- Approve the nutrition section of a care plan (RDN owns that)
- Access billing or insurance detail
- Override a PHQ-9 flag to avoid crisis protocol (the flag is structural — it cannot be dismissed without acknowledgment)
