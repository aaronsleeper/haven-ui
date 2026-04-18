# Org Chart Review — Meeting Prep

> Prepared for Aaron to walk Vanessa and Andrey through the expert panel findings.
> Structured as a 45-60 minute meeting with clear asks per person.

---

## Framing (2 min)

We mapped every function Cena Health performs — 20 functions across company
infrastructure and service delivery. Then ran a structured review through three
expert lenses: VBC operations, automation architecture, and healthcare compliance.

The review surfaced 4 pre-launch blockers, 5 items to address before implementation,
and several strategic insights about where we'll hit scaling walls.

This meeting has two goals:
1. Get decisions on the items that need your input
2. Align on which findings to act on and when

---

## Section 1: Pre-launch blockers (15 min)

These must be resolved before any patient data enters the system. Walk through
each and get a status or decision.

### 1a. Kitchen partner BAAs (OQ-28) — Vanessa

**The finding:** If a kitchen receives "diabetic, renal diet, low sodium" attached
to a patient name and delivery address, that is PHI. Every kitchen partner must
have an executed BAA before receiving any orders. Three experts independently
flagged this as a compliance blocker.

**Current status:** Sent to Vanessa, no resolution.

**Ask:** What is the BAA status for each kitchen partner? If not executed, what's
the timeline? This is binary — we cannot send dietary orders to kitchens without it.


- *agreed to create one for each partner*

### 1b. LLM BAA execution (OQ-02) — Andrey

**The finding:** Claude via Vertex AI means patient data flows through Google's
infrastructure. "In progress" is not "done." Any PHI in prompts without an executed
BAA is a federal violation.

**Current status:** In progress, Andrey is aware.

**Ask:** Is the Google/Vertex AI BAA executed? If not, what's blocking it and when
will it be done? We need a confirmed date, not "in progress."

*we already have a BAA from google*
*we'll need to get ones for the LLMs as well*
*if any models are taking in PHI*

*tags mention things like low sodium instead of "diabetes" therefore this is not PHI*

*V would still prefer to just have a BAA in place as a CYA measure*

*no EHR data will ever leave our premesis to anyone.* 

*can have LLM providers sign a BAA this is a common practice*

"we are not going to send any PHI to an external LLM"

### 1c. Licensure override policy (OQ-29) — Both

**The finding:** Current decision is "warn, don't hard block" on lapsed licensure.
All three experts flagged this — a coordinator override on licensure means a visit
could occur without proper state licensure. That's a state enforcement action and
malpractice exposure.

**Current decision:** Warn only, coordinator can override.

**Ask:** Should we change this to require compliance officer approval (not coordinator)
for any licensure override? The recommendation is a hard block with an expedited
override process, not a dismissible warning.

aligned. ultimately will be director of clinical ops decision when they come on. for now "understood"

### 1d. Engineering on-call policy (OQ-38) — Andrey

**The finding:** A live platform handling PHI with no defined incident response
ownership is an unacceptable risk. If the system goes down at 2am with active
patients, who gets paged?

**Current status:** Pending Andrey's input.

**Ask:** What does on-call look like for a 3-person engineering team? Doesn't need
to be complex — just needs to exist before go-live. Who gets called, how, and
what's the SLA for acknowledgment?

*what damage would be done if/when the system goes down and are we responsible for that. answering this question will help us decide what SLA should be. if it goes down at 2am what damage would happen. this could affect alerts if a trigger event happens and it can't go to the EHR because our system is down. most likely we won't be pushing this data to EHR so it won't be our responsibility*

---

## Section 2: Decisions needed before implementation (15 min)

These don't block go-live but should be resolved before we start building.

### 2a. Meal prescription data contract — Both

**The finding:** The handoff from Patient Ops to Meal Ops (care plan → meal orders)
is the most safety-critical data interface in the system. Wrong dietary data =
wrong food for a clinically vulnerable patient. Currently no formal contract defines
what fields are included, how restrictions are encoded, or how changes propagate.

**Ask:** We need to define the exact schema.  We will draft it, but needs input from
Vanessa on what clinical fields matter and from Andrey on data modeling.

*andrey will provide current schema for reference.*

### 2b. 42 CFR Part 2 (substance abuse confidentiality) — Vanessa

**The finding:** Not addressed anywhere in our planning. PHQ-9 and behavioral health
screening may surface substance use disorder information, which triggers heightened
federal protections (separate consent required for disclosure). This is a blind spot.

**Ask:** Is there a likelihood our patient population will include individuals with
co-occurring SUDs? If yes, we need to build Part 2 compliance into the consent
framework before launch.

*dr. morero and leo clinic is behavioral health, substance abuse background and will have these answers. we will need to consider this with all implementations after we align with dr*

### 2c. Consent taxonomy — Both

**The finding:** We currently treat consent as a single gate in the patient workflow.
In reality, VBC programs with research partners need multiple independent consent
types: clinical care consent, research/IRB consent (UConn-specific), telehealth
consent (state-specific), data sharing consent (per partner), and potentially AI
disclosure consent (emerging state requirements).

**Ask:** Can we enumerate the consent types we know we'll need for UConn pilot?
Aaron will design the consent management system, but needs the business requirements
from Vanessa and the data model considerations from Andrey.

*dieckhaus will provide for UConn*

### 2d. Model version tracking — Andrey

**The finding:** When Claude's model updates via Vertex AI, every agent's behavior
changes simultaneously. An auditor will ask: "Which version of the AI model was in
use when this care plan was drafted?" We need to log model version with every
agent action.

**Ask:** Is this something we can capture from the Vertex AI API? How hard is it
to implement? Should be a design consideration for the agent framework, not a
retrofit.

*we will need to make sure audit logs capture current model(s) version*

### 2e. Outstanding OQs sent to Vanessa — Vanessa

**Ask:** Status check on the batch of questions sent to Vanessa that haven't come back:
- OQ-07: HEDIS data model (blocks domains 5, 7, 10)
- OQ-08: Shared savings reconciliation ownership (blocks domains 4, 5)
- OQ-25: Medicare MNT visit cap
- OQ-27: Timely filing deadlines per payer
- OQ-40: UConn grant PI strategy
- OQ-41: Pricing model framework

Don't need answers in this meeting — need timelines for when answers are coming.

*need to work with VG and/or Marinka for these @Aaron to do*

---

## Section 3: Strategic findings to discuss (15 min)

These are patterns the review surfaced that affect how we think about the business,
not specific decisions to make.

### 3a. Vanessa's function load — Both

**The finding:** Vanessa currently owns or co-owns 7 of 20 functions: Executive,
People & Culture, Finance, Legal, Partner & Payer, Business Development, Customer
Success. These are mostly human-primary — automation provides limited relief. At
50 patients, each of these independently demands full attention.

**Not an accusation — a structural observation.** The question is: which functions
can be delegated first?

**Suggested sequence:**
1. Finance → external bookkeeper + agent-assisted AP (lowest relationship dependency)
2. People & Culture credentialing → automate verification and tracking
3. Legal & Corporate → external counsel handles more; agents track contracts/BAAs

**Ask Vanessa:** Does this priority feel right? What would free up the most time?

*legal for contracts and BAAs are the first focus area for agentic delegation*
*finance: understanding burn rate, make sure expenses and receipts are accounted for, these are highest priority for delegation*

### 3b. Agent framework gaps — Andrey

**The finding:** The review identified several architectural gaps:
- CommunicationAgent is overloaded (patient SMS, kitchen orders, scheduling, partner comms) — should split
- No SchedulingAgent for constraint-based scheduling (provider × patient × licensure × availability)
- No orchestrator for company infrastructure functions (Phase 2 automations have no home)
- No financial planning agent (FinancialOrchestrator only handles revenue cycle)

**Ask:** These don't need to be built now, but should the architecture account for
them? Specifically, the CommunicationAgent split and SchedulingAgent addition for
the first multi-provider deployment.

### 3c. Compliance gaps to be aware of — Vanessa

Quick flag — these are things our compliance planning doesn't address yet:
- CMS Conditions of Participation (if billing Medicare for MNT)
- Anti-Kickback Statute / Stark Law analysis for shared savings model
- State-by-state MTM classification (food service vs. medical nutrition therapy)
- FTC requirements for outcomes claims in marketing materials
- State AI transparency requirements (emerging)

**Ask:** Which of these does Vanessa think we need counsel's input on before UConn
pilot? The AKS/Stark analysis for the pricing model (OQ-41) seems highest priority.

*we are already in network for cms. will work on anti-kickback statute with VG. VS will work on MTM classifications ... send VS a reminder email re: this. will work on FTC with Danny. state ai reqs will work on with Marinka*

---

## Summary of asks

### From Vanessa
1. Kitchen partner BAA status — timeline to executed (blocker)
2. Licensure override policy — approve change to compliance-officer gate?
3. 42 CFR Part 2 — SUD likelihood in patient population?
4. Consent types needed for UConn pilot
5. Timeline on outstanding OQs (7, 8, 25, 27, 40, 41)
6. Function delegation priority — what frees up the most time?
7. Which compliance gaps need counsel before pilot?

### From Andrey
1. LLM BAA execution status — confirmed date (blocker)
2. Engineering on-call policy — define before go-live (blocker)
3. Model version tracking — feasibility via Vertex AI API
4. Agent framework gaps — should architecture account for splits/additions?
5. Data model input for meal prescription schema

### Follow-up work (Aaron)
- Draft meal prescription data contract
- Design consent management expansion
- Update org chart based on decisions from this meeting
- File new OQs for compliance items that need counsel
