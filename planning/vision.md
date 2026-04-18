# Vision

## What Ava is

Ava is the operating system for Cena Health — an agent-first platform where LLMs run the
workflows of a Food-as-Medicine care program, and humans provide judgment, relationship, and
oversight at the moments that genuinely require it.

The name "Ava" started as the AI voice assistant that calls patients. It became the name for
the whole platform because the insight generalized: the same architecture that lets an agent
conduct a patient check-in by phone also lets it process a referral, generate a care plan
draft, match meals to a prescription, submit a claim, and report outcomes to a partner. AVA
the voice agent is one specialist in a larger system. Ava the platform is the system.

---

## The problem

Running a value-based care program is predominantly administrative. Coordinators spend the
majority of their time on tasks that require data but not judgment: entering referrals,
checking eligibility, tracking visit completion, following up on missed check-ins, chasing
documentation, generating reports. Clinical staff document the same information in multiple
places. Partners wait days for data that exists in the system. Patients fall through gaps
not because anyone failed clinically, but because no one had time to check.

The administrative burden scales with patients. The team size required to manage that burden
makes the unit economics of value-based care difficult. This is why most Food-as-Medicine
programs stay small.

Ava inverts the constraint. Agents handle the administrative work. The team Cena Health can
afford to hire manages a patient panel that would otherwise require a staff several times
larger. The shared savings that result aren't just a revenue model — they're the proof that
this approach works, made possible by the platform that executes it.

## The deeper thesis

The popular conversation around AI frames it as "human in the loop" — humans are the smart
ones, agents are tools that assist. Ava challenges this framing based on an operational
observation: in human + agent workflows, humans are the bottleneck. They process information
more slowly, have more retrieval errors given the same context, and can't hold the same
amount of information in working memory.

This isn't a criticism of humans — it's an acknowledgment of where value flows. Humans
provide things agents cannot: legal accountability, trust relationships, clinical judgment
in novel situations, and the institutional authority to make binding decisions. These are
essential. But research, analysis, domain reasoning, documentation, and workflow execution
are not where human value concentrates.

Ava is designed to demonstrate that a healthcare business — and by extension, any business
built on domain expertise — is better run with agents as the primary operational brain and
humans as the accountable decision-makers. The founding team of three people doesn't have
deep expertise across every operational domain Cena needs. The agents do, or can be built
to. The hypothesis that started this project — "if I can duplicate my own expertise via
agents, can I generalize the pattern to duplicate any area of expertise?" — is the premise
the entire system exists to validate.

Every proposal an expert drafts, and every approval a human gives, is a data point in
building that trust. The faster humans can reach the point where they confidently approve
agent output at speed, the faster the bottleneck dissolves and the system proves its thesis.

---

## Core principles

These are decision filters, not aspirations. When architecture, feature, or product decisions
are contested, these resolve them.

### 1. Agents propose, humans dispose
An agent never takes a consequential action without surfacing it first. "Consequential" means
anything that affects patient care, external communications, financial transactions, or
compliance state. The human sees what the agent wants to do, why, and what the downstream
effects are. Approval is one tap. The ability to override is always present.

This principle has a corollary: agents should be opinionated. A draft that says "here are
five options" is less useful than a draft that says "here's what I recommend, and here's why."
The human's job is to accept, edit, or reject — not to make decisions from scratch.

### 2. The thread is the record
Every agent action, human decision, and system event is a message in a conversation thread.
The thread is simultaneously the UX surface, the audit log, and the compliance record. There
is no separate logging system. There are no "behind the scenes" actions that don't appear in
the thread.

This matters for compliance: when a regulator, payer, or legal team asks what happened, who
decided it, and when — the answer is a query against threads, not a manual reconstruction.
It also matters for trust: coordinators and clinicians can see exactly what the agent did
before they approved it. The system is not a black box.

### 3. Failure is always visible
No workflow fails silently. Every exception either auto-resolves (agent retries, finds an
alternative path) or lands in a named human queue with the specific issue surfaced, a
recommended action, and an escalation clock. There is no state where a patient is stuck
with no one responsible for the next action.

### 4. HIPAA compliance is structural, not procedural
Compliance is built into the data model, access control, and thread architecture — not
enforced by policy documents that people may or may not follow. PHI access is logged
automatically. Minimum-necessary is enforced at the tool level. Consent gates block
workflows before they need to be manually checked. The audit trail exists because the
system cannot function without producing it, not because someone remembered to log things.

### 5. Human attention is the scarce resource
Every design decision should be evaluated against this question: does this make better use
of a coordinator's or clinician's attention, or does it waste it? A feature that routes
every message through human review is not "safe" — it's expensive in the currency that
matters most. The right amount of automation is the maximum that clinical judgment and
regulatory requirements permit, not the minimum that someone is comfortable with.

---

## What success looks like

**For coordinators:** A care coordinator manages a patient panel 3x larger than they could
without Ava. Their day is reviews and relationships, not data entry and status tracking.
Every item in their queue is something only they can decide.

**For clinicians:** Clinical documentation is drafted and ready for review before the provider
closes the visit. Lab results surface automatically with context. Care gaps are flagged before
they become adverse outcomes. The RDN's job is nutrition counseling, not paperwork.

**For patients:** Every patient who should receive a check-in gets one. Meals arrive that
match their restrictions and preferences. When something goes wrong — a missed delivery,
a concerning PHQ-9 score, an uncontrolled A1C — someone acts within hours, not days.

**For partners:** Reports arrive on schedule with the metrics the contract requires. Referrals
receive acknowledgment within hours. Shared savings calculations are documented and
auditable. The partnership feels like infrastructure, not overhead.

**For the business:** The economics of value-based care work. Shared savings are earned and
documented. The platform can onboard a new partner in days, not months. Cena Health can
grow without hiring proportionally.

---

## What Ava is not

**Not a chatbot.** A chatbot answers questions. Ava runs workflows. The conversational thread
interface in the right panel is an audit surface and approval mechanism, not a product feature.

**Not a replacement for clinical judgment.** The RDN decides the nutrition plan. The BHN
decides the safety plan. The care coordinator decides when a situation requires escalation
beyond what the agent recommends. Agents draft; clinicians decide.

**Not a consumer product.** Ava is an operational system for a clinical organization. The
users are trained staff operating within a regulated environment. The design optimizes for
accuracy, auditability, and efficiency — not discoverability or casual onboarding.

**Not an EHR.** Ava coordinates care and manages the workflows of a specific program. It
integrates with EHRs (Epic primarily) via FHIR but does not attempt to replace them. The
boundary is: clinical record lives in the EHR; program workflow lives in Ava.

---

## The longer arc

The current design serves Cena Health's immediate program: medically tailored meals,
care coordination, and value-based outcomes measurement. But the architecture is intentionally
general — because the thesis is general.

If agents can hold and apply domain expertise in healthcare — one of the most regulated,
high-stakes, and knowledge-dense industries — then the pattern works anywhere. The
extensible role/workflow registry means new care programs, new partners, and new
requirements are added by configuring new agents and workflows, not by rebuilding the
platform or hiring proportionally.

More importantly, the expert system itself is the proof mechanism. Every domain where an
agent expert is stood up, produces reliable output, and earns human trust is evidence that
the agents-first operating model generalizes. Cena Health is the first instantiation.
The architecture is designed so it won't be the last.
