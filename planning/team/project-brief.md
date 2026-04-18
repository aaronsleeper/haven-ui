# Project Ava — Brief

## What this is

Ava is the operating system for Cena Health — an agent-first platform where AI agents run the administrative and operational workflows of our Food-as-Medicine care program. Humans provide judgment, relationship, and oversight at the moments that genuinely require it.

The name started as our AI voice assistant that calls patients for check-ins. The architecture proved general: the same patterns that let an agent conduct a phone call also let it process a referral, draft a care plan, match meals to a prescription, submit a claim, and report outcomes. AVA the voice agent is one specialist in a larger system.

## Where Cena Health is today

Cena Health is in-network with all major payers, but we have no contracted projects running yet. Our pilots are in planning phases. This means many decisions you'd expect to be settled — pricing models, HEDIS timing, shared savings structures — are still open questions that depend on the needs of actual clients we haven't onboarded yet.

This context matters for how we work: we need defensible starting positions, not permanent answers. The goal right now is to build a foundation solid enough that we can run real workflows through the system, see the outputs, and assess. Many things will change. That's expected.

## The hypothesis

Running a value-based care program is predominantly administrative. Coordinators spend the majority of their time on tasks that require data but not judgment: entering referrals, checking eligibility, tracking visit completion, chasing documentation, generating reports. This administrative burden scales linearly with patients, making unit economics difficult.

**Our bet:** If agents handle the administrative work, a small clinical team can manage a patient panel that would otherwise require a staff several times larger. The shared savings that result aren't just revenue — they're the proof that the approach works.

This is not incremental automation. It's a different operating model — one where the default is agent-handled and human involvement is the exception, reserved for clinical judgment, relationship, and regulatory requirements.

**The deeper claim:** The popular framing of "human in the loop" assumes humans are the smart ones checking agent work. We're testing the inverse — that agents are the primary domain expertise and humans provide accountability, trust, and judgment at defined gates. Our founding team of three doesn't have deep expertise across every domain Cena needs. The agents do. Every time a domain expert drafts a proposal and a human approves it, that's a data point proving the model works. The faster we build that trust, the faster we can demonstrate that an agents-first business outperforms the alternative.

## How it works

Five principles govern every design decision:

1. **Agents propose, humans dispose.** No consequential action without surfacing it first. Agents are opinionated — they recommend, not enumerate options. Humans approve, edit, or reject.

2. **The thread is the record.** Every action, decision, and event is a message in a conversation thread. The thread is the UX, the audit log, and the compliance record simultaneously. No separate logging. No behind-the-scenes actions.

3. **Failure is always visible.** No silent failures. Every exception either auto-resolves or lands in a named human queue with the issue, a recommended action, and an escalation clock.

4. **HIPAA compliance is structural.** Built into the data model, access control, and thread architecture — not enforced by policy documents. The audit trail exists because the system can't function without producing it.

5. **Human attention is the scarce resource.** The right amount of automation is the maximum that clinical judgment and regulations permit, not the minimum someone is comfortable with.

## What success looks like

- **Coordinators** manage 3x the patient panel, spending time on reviews and relationships instead of data entry
- **Clinicians** find documentation drafted before they close a visit, care gaps flagged before they become adverse outcomes
- **Patients** get every check-in, meals that match their needs, and rapid response when something goes wrong
- **Partners** receive reports on schedule with auditable data
- **The business** earns shared savings, onboards partners in days not months, grows without hiring proportionally

## What Ava is not

- **Not a chatbot.** Ava runs workflows. The thread interface is an audit surface, not a product feature.
- **Not a replacement for clinical judgment.** Agents draft; clinicians decide.
- **Not an EHR.** Integrates with EHRs via FHIR. Clinical record lives in the EHR; program workflow lives in Ava.
- **Not a consumer product.** Operational system for trained staff in a regulated environment.

## Technical foundations (decided)

| Decision | Choice | Status |
|---|---|---|
| Cloud provider | GCP (already in Firebase ecosystem) | Decided |
| LLM | Claude via Vertex AI (one BAA, one billing relationship) | Decided |
| Voice (AVA) | Twilio + Deepgram STT + TTS | Decided |
| Multi-tenancy | Shared DB with tenant_id + Postgres RLS | Proposed — needs Andrey review |
| Data separation | Clinical Postgres DB + BigQuery for research | Proposed — needs Andrey review |
| On-call policy | Andrey/Aaron rotation for P1 incidents | Proposed — needs Andrey review |

---

*This document is a living summary. Source of truth for principles: [vision.md](../vision.md). For decisions: [decisions.md](../decisions.md).*
