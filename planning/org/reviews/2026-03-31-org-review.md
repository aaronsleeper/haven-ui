# Org Chart Expert Review — 2026-03-31

## Expert 1: VBC Operations Leader

*Perspective: Has built and scaled value-based care and food-as-medicine programs from 0 to 5,000+ patients.*

### Coverage assessment

**Functions present that should be ✅**

- Patient Operations, Clinical Care, Meal Operations — the three operational pillars of any MTM program are well-defined with detailed sub-functions and workflow coverage.
- Revenue Cycle & Billing — correctly separated from Finance with appropriate focus on claims, denial management, and PMPM billing.
- Risk Management & Quality — present with risk scoring, care gap detection, and CQI cycles. Real-time (event-driven, not batch) risk scoring is a meaningful design choice.
- Partner & Payer Relations — correctly identified as relationship-heavy with appropriate automation restraint.
- Patient Experience as a cross-cutting function — unusually mature recognition for a pre-launch company. The link between engagement and clinical outcomes in MTM programs is well-established.

**Functions missing or underspecified ❌**

- **Supply Chain & Inventory Management** — No function covering ingredient sourcing, food cost management, inventory forecasting, or kitchen capacity planning. `meal-ops.md` covers recipe-to-delivery but assumes kitchens manage their own supply chain. At 500+ patients with 3+ kitchens, ingredient cost variability and supply disruptions become a primary operational risk.
- **Provider Network Management** — `people-culture.md` covers credentialing, but there's no sub-function for managing a distributed network of RDNs/BHNs across states. At 200+ patients spanning 5+ states, managing provider panels (licensure matching, panel balancing, PTO coverage) becomes a full operational function.
- **Transportation & Logistics** — Delivery is in `meal-ops.md` but treated as kitchen-dependent. At scale, delivery logistics (cold chain, delivery windows, proof of delivery, failed delivery rebooking) becomes its own domain.
- **Patient Advocacy / Grievance** — `patient-experience.md` covers complaints but doesn't address formal grievance procedures required by many Medicaid MCOs. Formal grievances have mandated timelines, written responses, and appeal rights — distinct from "complaint handling."

**Functions present but unnecessary at current stage ⚠️**

- Clinical Education (correctly marked as "activates with first clinical hire")
- Customer Success (correctly marked as "activates at 5+ partners")
- Both are smart to define now; premature to staff.

### Scaling blind spots

| Inflection point | What breaks | Which function | Recommendation |
|---|---|---|---|
| 50 patients, 1 partner | **Coordinator capacity.** At 50 patients, a single coordinator hits ~40 hrs/week of queue review even with agent assistance. | Patient Ops, Clinical Care | Model coordinator queue depth at 50 patients. Define max panel size per coordinator. Hire first coordinator before 30 patients. |
| 200 patients, 3 partners | **Kitchen coordination diverges.** Three kitchens with different delivery models, recipe catalogs, and quality levels. OperationsOrchestrator runs a single weekly cycle — needs per-kitchen orchestration. | Meal Ops | Add kitchen-specific configuration to OperationsOrchestrator before 3rd kitchen. |
| 200 patients, 3 partners | **Multi-partner reporting.** Each partner has different metrics, cadences, contract terms. ReportingAgent needs partner-specific templates. | Partner & Payer, Data & Analytics | Build partner-specific report config before 3rd partner. Document per-partner metric definitions. |
| 500 patients, 5+ partners | **RDN panel management.** 5 RDNs across 3 states — patient-to-provider matching becomes constraint optimization, not manual assignment. | Clinical Care, People & Culture | Add provider matching sub-function. Build licensure-aware scheduling before expanding past 2 states. |
| 1,000 patients | **Risk scoring volume.** ~5,000+ events/day from AVA check-ins + labs + meal feedback. Latency and alert fatigue. | Risk & Quality | Design alert consolidation and tiered notification before 500 patients. |
| 1,000 patients | **Denial management.** ~4,000+ claims/month, 5% denial rate = 200 denials/month requiring human review. | Revenue Cycle | Build denial pattern detection and auto-appeal for common codes before 500 patients. |
| 5,000 patients | **Database performance.** Clinical Postgres serving 5,000 concurrent records with real-time risk scoring becomes bottleneck. | Data & Analytics, Product & Engineering | Plan read replica strategy before 2,000 patients. Monitor query latency from day one. |

### Interface gaps

- **Patient Ops → Meal Ops handoff lacks a data contract.** What fields constitute a meal prescription? How are dietary restrictions encoded? How do changes propagate? This is the most safety-critical data interface — broken prescription = wrong food to a diabetic patient.
- **Clinical Care → Revenue Cycle timing dependency.** 24-hour documentation window + claim generation timing = potential systematic revenue leakage at 500+ patients.
- **Risk & Quality → Patient Ops feedback loop is one-directional.** No mechanism for Patient Ops to signal back when patient circumstances change (hospitalized, moved, changed phone) in ways that affect risk scoring validity.
- **Partner & Payer → Compliance interface is thin.** Partner contracts include specific compliance requirements that differ from baseline HIPAA. No sub-function maps partner-specific compliance into monitoring.

### Bottleneck forecast

**Vanessa is the critical bottleneck.** Owns or co-owns 7 of 20 functions (Executive, People, Finance, Legal, Partner & Payer, Business Dev, Customer Success). These are mostly human-primary. At 50 patients, she'll split between fundraising, partner management, hiring, and financial management — each independently demanding full attention.

**Recommendation:** Delegate Finance first (external bookkeeper + agent-assisted AP). Automate People & Culture credentialing. Protect partner relationship management as her highest-value activity.

**Aaron bottlenecks at product-clinical intersection.** No PM or designer = zero redundancy in the feedback-to-feature pipeline when clinical operations go live.

**Andrey bottlenecks at infrastructure-security intersection.** Engineering on-call (OQ-38) is a pre-launch blocker.

---

## Expert 2: Healthcare Automation Architect

*Perspective: Has built agent/AI automation systems for healthcare workflows with LLMs in production.*

### Automation target audit

| Sub-function | Current target | Recommended target | Rationale |
|---|---|---|---|
| Referral intake | 🤖 Automated | 🤖 Agree, with caveat | Clean HL7/FHIR automates well. Fax/free-text (30-40% in year 1) need human fallback. |
| Eligibility verification | 🤖 Automated | 🤖 Agree | Payer APIs mature. Rubric 21 realistic. |
| Visit documentation | 🤝 Agent-assisted | 🤝 Agree, harder than it looks | See overestimated section. STT quality + format decision + automation bias. |
| Meal prescription matching | 🤖 Automated | 🤖 Agree | Constraint solving well-understood. Rubric 21 appropriate. |
| Claims generation | 🤖 Automated | 🤖 with gate | MNT codes (97802/3/4) have specific documentation requirements. Add completeness check gate. |
| Denial management | 🤝 Agent-assisted | 🤝 Agree | Denial appeal writing is strong LLM use case. Needs continuously updated denial pattern DB. |
| Consent tracking | 🤖 Automated | 🤝 Downgrade | Multiple consent types with evolving requirements score lower than a single state gate implies. |
| Delivery scheduling | 🤖 Automated | 🤝 Downgrade | Kitchen-dependent delivery with no API = low tooling score. |
| Regulatory change monitoring | 🤖 Automated | 🤝 Downgrade | Detection automatable; impact assessment requires domain expertise. |
| Market research | 🤖 Automated | 🤝 Downgrade | Web research is LLM strength; interpreting market signals for VBC partnerships requires judgment. |

### Overestimated automation

**Visit documentation** — The difficulty is not generating text. The problems:
1. STT error rates 5-15% for medical conversations. 10% word error rate can change dietary recommendations.
2. OQ-16 (SOAP vs NCP/eNCPT) still pending. NCP requires specific nutrition diagnosis codes (IDNT) mapping to clinical reasoning.
3. Automation bias — providers approve without editing, leading to notes that look similar across patients (audit red flag).

**Recommendation:** Invest in STT quality validation. Build "draft confidence score" forcing review of specific sections.

**Medication reconciliation** — Drug-nutrient interactions (warfarin + vitamin K from MTMs) are not standard med rec. No agent handles this intersection.

**Consent tracking** — VBC programs require multiple consent types (clinical, research/IRB, telehealth by state, data sharing per partner, AI disclosure). Single binary gate undersells complexity.

**Delivery scheduling** — If kitchens use their own drivers with no API, automation target is aspirational.

### Underestimated automation

**Pre-visit prep** — Current scope too narrow. Can also: generate visit agenda from care gaps, draft provider questions from AVA data, pre-populate assessments, estimate duration. At 500 patients with weekly visits, saving 10 min/visit = 83 hours/week of RDN time.

**Partner outcomes reporting** — Can extend to narrative trend explanations, proactive threshold alerts, and suggested interventions. Moves from passive data delivery to active partner intelligence.

**Peer consultation prep** — Decision is human, but preparation (gathering history, identifying clinical question, finding precedent cases in Cena's data) is highly automatable. Saves 15-30 min per consultation.

**Incident root cause analysis** — Agent can auto-generate preliminary RCA by correlating incident with system events and workflow state. Human validates and extends.

### Agent framework gaps

1. **No orchestrator for company infrastructure.** All 4 orchestrators serve service delivery. Phase 2-3 automation roadmaps imply orchestration for Tier 1 functions. **Recommendation:** Design a `CompanyOpsOrchestrator`.

2. **No SchedulingAgent.** Visit scheduling assigned to CommunicationAgent, but scheduling is constraint optimization (provider availability × patient preference × licensure × visit type), not communication. At 50+ patients with 3+ providers, this needs its own specialist.

3. **CommunicationAgent is overloaded.** Serves patient SMS/email, AVA notifications, kitchen orders, partner comms, and scheduling. **Recommendation:** Split into PatientCommunicationAgent + SystemNotificationService.

4. **No agent for financial planning.** FinancialOrchestrator = revenue cycle only. Finance & Accounting automation targets have no agent home.

5. **Meta layer is thin.** Three meta agents for a growing specialist count. Needs a WorkloadBalancer for distributing human work by queue depth, expertise, and shift schedule.

### Rubric disagreements

| Sub-function | Assigned target | Rubric score | Rubric tier | Disagreement |
|---|---|---|---|---|
| Consent tracking | 🤖 Automated | ~13 | Agent-assisted | Yes — multiple consent types lower DC and CT scores |
| Delivery scheduling | 🤖 Automated | ~11 | Agent-assisted | Yes — no kitchen API drops CT to 1 |
| Regulatory monitoring | 🤖 Automated | ~12 | Agent-assisted | Yes — impact assessment is decision-complex |

---

## Expert 3: Healthcare Compliance & Risk Officer

*Perspective: Has led compliance for healthcare organizations handling PHI through AI/LLM systems.*

### Compliance coverage

**Requirements covered ✅**

- HIPAA Privacy Rule — PHI access controls defined per role with minimum necessary enforcement at tool level
- HIPAA Security Rule — Information Security function covers technical safeguards; thread-as-audit-log provides structural audit trail
- HIPAA Breach Notification — 72-hour HHS timeline explicitly referenced
- Consent management — enforced as gate in patient state machine
- BAA management — tracked with automated inventory

**Requirements missing ❌**

- **42 CFR Part 2 (substance abuse confidentiality)** — No mention anywhere. PHQ-9 and BH screening may surface SUD-related information triggering Part 2 protections requiring separate consent.
- **State nutrition counseling practice act compliance** — Generic "state-by-state" reference but no specific tracking. Dietetics Licensure Compact covers only ~20 states.
- **CMS Conditions of Participation** — If billing Medicare for MNT, CoPs apply (patient rights, QAPI, medical records, coordination of services). No reference.
- **Anti-Kickback Statute / Stark Law** — Shared savings and PMPM arrangements may implicate AKS depending on structure. Pricing model (OQ-41) needs AKS/Stark review.
- **State food safety regulations** — Which standards apply to MTMs (FDA Food Code, state cottage food, USDA for Medicaid/SNAP populations)?
- **FTC Health Claims Act** — Marketing outcomes claims subject to FTC substantiation standards. Not referenced in `marketing-brand.md`.

**Requirements partially covered ⚠️**

- Research/IRB compliance — referenced but de-identification method (Safe Harbor vs Expert Determination) not specified; no ongoing IRB monitoring sub-function
- State telehealth regulations — OQ-29 "warn, don't hard block" on lapsed licensure is a compliance risk
- HIPAA minimum necessary for LLM prompts — monitoring is monthly; should be continuous for system processing PHI daily

### Audit readiness gaps

1. **No formal HIPAA Risk Assessment documented.** OCR's first request. The org chart defines the process but not the artifact.
2. **Kitchen partner BAA gap (OQ-28) is an active compliance violation** if kitchens receive diagnosis-linked dietary orders.
3. **LLM BAA not yet executed (OQ-02).** "In progress" ≠ "done." Any PHI in prompts without executed BAA = HIPAA violation.
4. **No documented incident response plan.** Who is notified, in what order, within what timeframe, using what channels?
5. **No Business Continuity Plan / Disaster Recovery Plan.** What happens when the platform is down for 4 hours? How do patients get meals?
6. **Thread retention policy not defined (OQ-30).** HIPAA requires 6 years minimum. State laws vary (7-10 years). Some data deletion regulations may conflict.
7. **No workforce sanctions policy.** HIPAA requires sanctions policy for privacy/security violations.

### LLM/AI governance assessment

**Strengths:**
- Thread-as-audit-log = every LLM action logged by architecture, not policy
- Tool registries enforce minimum necessary at action level
- Hardcoded approval gates for consequential actions cannot be configured away
- "Agents propose, humans dispose" is the correct governance model

**Gaps:**

1. **No model version tracking.** When Claude updates, every agent changes. Must be able to answer: "Which model version was in use when this care plan was drafted?"
2. **No LLM output validation framework.** For automated flows below approval thresholds, no structural validation that output is well-formed and correct.
3. **No AI bias monitoring.** RiskScoringAgent scores patients — if outcomes differ by race/ethnicity/zip code, that's disparate impact. CMS and OCR increasingly focused here.
4. **No process for consequential agent judgment failures.** Distinct from system failures — the AI equivalent of adverse event reporting.
5. **PHI minimization in prompts not enforced architecturally.** Agent definitions show full "patient context" being passed. Need minimum necessary PHI per agent per tool call, not just per role per screen.

### Regulatory blind spots

- **State-by-state telehealth for nutrition counseling** — Dietetics Licensure Compact not universal. Some states require initial in-person visit.
- **Medicaid MCO requirements vary by state** — grievance procedures, quality metrics, network adequacy, cultural competency documentation all cascade into multiple functions.
- **State MTM classification** — Food service vs medical nutrition therapy vs home-delivered meals. Determines kitchen eligibility and licensing.
- **FEHB/TRICARE requirements** — Distinct data handling and audit requirements if TriCare matures.
- **AI transparency requirements** — Several states implementing disclosure requirements for AI in healthcare decisions. Patient-facing surfaces may need AI disclosure.

---

## Synthesis

### Consensus findings (all 3 experts agree)

1. **Kitchen partner BAA (OQ-28) and LLM BAA (OQ-02) are pre-launch blockers.** Binary compliance gates, not questions to defer. Federal HIPAA violation if unresolved.
2. **OQ-29 (licensure warning) should be a compliance-officer-approved override, not a coordinator dismissal.** Practicing without proper licensure = state enforcement action + malpractice exposure.
3. **Vanessa is single point of failure for 7 of 20 functions.** Unsustainable past 50 patients regardless of automation.
4. **Agent framework has no coverage for company infrastructure functions.** Need a CompanyOpsOrchestrator before Phase 2 automations begin.
5. **Meal prescription handoff (Patient Ops → Meal Ops) lacks a formal data contract.** Most safety-critical data interface — wrong dietary data = wrong food for clinically vulnerable patient.
6. **Engineering on-call (OQ-38) must be resolved before go-live.** Live platform handling PHI with no incident response ownership is unacceptable.

### Disagreements worth resolving

| Topic | Expert 1 | Expert 2 | Expert 3 | Recommended resolution |
|---|---|---|---|---|
| Delivery scheduling | Kitchen-dependent delivery limits operational visibility | Downgrade to agent-assisted due to lack of APIs | Proof of delivery is compliance evidence for billing | Downgrade to agent-assisted for kitchens without API. Define kitchen integration tiers with different automation levels per tier. |
| Consent complexity | Known scaling challenge in multi-partner VBC | Needs own agent or expanded sub-function | Requires per-state, per-partner, per-protocol tracking | Build ConsentManagementAgent or expand PatientJourneyOrchestrator. Define consent taxonomy before pilot. |
| Alert fatigue at 1,000+ | Biggest operational risk — clinicians stop reading | Solvable with consolidation and smart prioritization | Missed safety events = compliance/liability risk | Design alert consolidation before 500 patients. Define max daily alert volume per clinician role. |
| AI bias monitoring | Not day-one for 10-patient pilot | Easy to add — build demographic breakdowns from day one | Increasingly a regulatory requirement | Add algorithmic fairness sub-function to Risk & Quality. Instrument RiskScoringAgent outputs with demographic breakdowns from day one. Low cost now, high cost to retrofit. |

### Prioritized recommendations

| Priority | Recommendation | Experts | Impact |
|---|---|---|---|
| P0 | Resolve kitchen BAA (OQ-28) and confirm LLM BAA execution (OQ-02) before any PHI enters system. | 1, 2, 3 | Blocks go-live. Federal violation if unresolved. |
| P0 | Change OQ-29 licensure override to require compliance officer approval with documented justification. | 1, 3 | State enforcement + malpractice exposure. |
| P0 | Define meal prescription data contract: exact fields, dietary restriction encoding, allergen validation, change propagation. Add to `patient-ops.md` and `meal-ops.md`. | 1, 2 | Patient safety event if wrong dietary data flows. |
| P0 | Resolve engineering on-call policy (OQ-38) before go-live. | 1, 3 | Care disruption + compliance incident without on-call. |
| P1 | Add 42 CFR Part 2 (substance abuse confidentiality) to `compliance.md`. Define how PHQ-9/BH data is classified. | 3 | Federal violation if SUD data disclosed without Part 2 consent. |
| P1 | Document incident response plan (notification chain, channels, timelines, regulatory reporting). | 3 | First item an OCR auditor requests. Cannot be generated post-incident. |
| P1 | Add model version tracking to agent framework. Every thread message includes model version. Add model governance sub-function. | 2, 3 | "Which AI made this recommendation?" must be answerable. |
| P1 | Design coordinator capacity model: max panel size, queue depth monitoring, hiring triggers. Add to `patient-ops.md` and `people-culture.md`. | 1 | At 50 patients, single coordinator breaks every downstream function. |
| P1 | Expand consent tracking to handle multiple independent consent types with per-state/per-partner requirements. | 2, 3 | Multi-consent complexity at 3+ partners exceeds single state gate. |
| P2 | Add SchedulingAgent to specialist layer. Remove scheduling from CommunicationAgent. | 2 | At 50+ patients with 3+ providers across 2+ states, scheduling needs constraint solving. |
| P2 | Add Supply Chain / Kitchen Capacity sub-function to Meal Ops. | 1 | At 200+ patients with 3+ kitchens, supply chain is top-3 operational risk. |
| P2 | Add algorithmic fairness monitoring to Risk & Quality. Instrument RiskScoringAgent with demographic breakdowns. | 2, 3 | Low cost now, high cost to retrofit. Regulatory pressure increasing. |
| P2 | Define data retention policy (HIPAA 6-year min, state variations, thread archival, deletion handling). | 3 | Auditors require documented policy. |
| P2 | Split CommunicationAgent into PatientCommunicationAgent + SystemNotificationService. | 2 | Architecture debt compounds with each new communication type. |
| P3 | Design CompanyOpsOrchestrator for Tier 1 function automation. | 2 | Phase 2 automations need an architectural home. |
| P3 | Add Provider Network Management sub-function. | 1 | Critical at 5+ providers across 3+ states. |
| P3 | Add formal grievance procedure to Patient Experience (distinct from complaints). | 1, 3 | Required by first MCO contract. |
| P3 | Document state-by-state MTM classification for current and target states. | 1, 3 | Determines kitchen partner eligibility and licensing per state. |
