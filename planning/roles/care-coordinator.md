# Role: Care Coordinator

> The human hub of the platform. Coordinators own the patient relationship end-to-end —
> from referral intake to discharge. They are the primary reviewers of agent output,
> the escalation point for clinical exceptions, and the point of contact for partners.

---

## Who holds this role

Care coordinators at Cena Health. May also be held by a senior admin or program manager
in a smaller-team configuration.

**Not:** clinical staff (RDN, BHN), kitchen staff, billing staff, or admin IT. Those are
separate roles with different permission scopes.

---

## Primary app surface

**Admin app** — the coordinator's primary workspace. Patient list, queue, partner management,
and reporting all live here. The Provider app is readable but not the coordinator's home.

---

## Responsibilities

- Manage the patient queue: intake, eligibility, enrollment, and discharge
- Own care plan approval (with RDN and BHN as domain reviewers)
- Primary contact for referral partner staff
- Resolve exceptions that agents cannot handle automatically
- Confirm patient communication before it goes external
- Monitor disengagement signals and act before patients fall through gaps

---

## What the coordinator sees

**Queue items (sorted by urgency):**
- Eligibility failures or ambiguous coverage requiring a decision
- Patients stuck in `enrollment_pending` > 5 days (unreachable or consent outstanding)
- Care plan approval requests (after RDN sign-off, coordinator approves the full plan)
- Discharge approvals
- Missed check-ins (3+ consecutive)
- Partner data request escalations
- Report distribution approvals

**Patient list view:**
- All active patients in their caseload
- Status, risk tier, and last activity at a glance
- Patients with open queue items surface at the top

**Thread view (right panel):**
- Full workflow thread for the selected patient
- All agent actions, approvals, and events in chronological order
- Input field to message the agent or add a human note to the record

---

## Approval gates owned by coordinator

| Gate | Condition | SLA |
|---|---|---|
| Care plan full approval | After RDN (and BHN if PHQ ≥ 10) have reviewed | 24h |
| Patient enrollment confirmation | After consent collection is complete | 24h |
| Discharge approval | Any discharge trigger | 48h |
| Outbound partner communication | Before transmission to external EHR or partner | 4h |
| Report distribution | Before partner report is sent | 72h |
| Alternative eligibility path | When standard eligibility fails but alternative may exist | 8h |

---

## What coordinators cannot do

- Sign clinical documentation (RDN or BHN must sign)
- Override a PHQ-9 Q9 crisis flag (crisis protocol is not coordinator-approvable — it requires BHN)
- Access billing detail (Finance/Admin role required)
- Modify partner contract terms (Admin role required)

---

## Coordinator interaction with agents

The coordinator's primary interaction mode is **review and approval**, not task execution.
Agents do the work; coordinators confirm that the work is correct.

In practice, this looks like:
1. Coordinator opens their queue
2. Each item has: what the agent did, what it recommends, what the coordinator needs to decide
3. Coordinator reviews the center panel (the record) and the right panel (the thread)
4. One tap to approve; or edit inline and approve; or reject with a note to the agent

The agent resumes automatically after approval. The coordinator's decision is logged in the
thread with timestamp and any notes.

Coordinators can also **direct the agent** via the thread input. Typing "Check if the patient
has a secondary insurance" triggers the agent to run that check and return the result to the
thread. The coordinator doesn't need to navigate to a form — the thread is the interface.
