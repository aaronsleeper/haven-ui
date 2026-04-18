# Cena Health: Business Function Map

> **What if LLMs could automate everything?**
>
> This document maps every function Cena Health must execute to operate — across clinical care,
> meal operations, billing, compliance, business development, and internal management. Each function
> is a candidate automation project. Some will be fully automated. Most will be agent-assisted with
> human review at key decision points. A few will always require human judgment.
>
> The places where functions require human-navigable interfaces are the surfaces where our platform
> applications live. Everything else runs as an automated workflow — observed, logged, and
> auditable, but not requiring a screen.

---

## How to read this map

Each function entry captures:
- **What it is** — plain description
- **Automation potential** — 🟢 High (agent handles end-to-end), 🟡 Medium (agent + human review), 🔴 Low (human primary, agent-supported)
- **Surface** — which app/interface, if any, is needed
- **Upstream / downstream dependencies** — what feeds it and what it feeds

Functions are grouped into 10 domains. Domains are not silos — they share data and trigger each
other constantly. The dependency notes make those connections explicit.

---

## Domain Map

| # | Domain | Core question |
|---|---|---|
| 1 | Patient Operations | How do patients enter and move through the system? |
| 2 | Clinical Care | How is care delivered, documented, and coordinated? |
| 3 | Meal Operations | How do medically tailored meals get planned, made, and delivered? |
| 4 | Partner & Payer Relations | How do we work with referral sources, payers, and MCOs? |
| 5 | Revenue Cycle & Billing | How do we get paid? |
| 6 | Compliance & Regulatory | How do we stay legal, licensed, and auditable? |
| 7 | Risk Management & Quality | How do we catch problems before they become crises? |
| 8 | Internal Operations | How does the company run day to day? |
| 9 | Business Development | How do we grow? |
| 10 | Data, Analytics & Research | How do we understand what is working? |

---

## 1. Patient Operations

Everything from first contact to discharge.

### 1.1 Referral Intake
Receive incoming patient referrals from partners (health systems, MCOs, PCPs), validate completeness,
route to intake queue, and acknowledge receipt to referral source.

- **Automation:** 🟢 High — structured data from FHIR/HL7 feeds can be parsed, validated, and routed
  automatically; incomplete referrals auto-trigger a data request back to the source
- **Surface:** Admin app (review queue for edge cases); no screen needed for clean referrals
- **Upstream:** Partner & Payer (1.1 triggers from partner agreements)
- **Downstream:** 1.2 Eligibility Verification

### 1.2 Eligibility Verification
Confirm the patient qualifies for the program — insurance active, benefit covers FAM services,
meets clinical criteria (diagnosis, risk tier). Includes real-time payer API checks.

- **Automation:** 🟢 High — real-time eligibility APIs (Athena, clearinghouses) return structured
  results; agent interprets coverage and flags exceptions
- **Surface:** Admin app (exception handling only — agent handles clean cases)
- **Upstream:** 1.1 Referral Intake
- **Downstream:** 1.3 Enrollment

### 1.3 Patient Enrollment & Registration
Capture demographics, insurance, emergency contacts, preferred contact method, language, address.
Create patient record. Trigger consent collection.

- **Automation:** 🟡 Medium — agent pre-fills from referral data and asks clarifying questions via
  conversational intake; coordinator reviews and approves before record is finalized
- **Surface:** Admin app (coordinator review); Patient app (patient self-completion option)
- **Upstream:** 1.2 Eligibility
- **Downstream:** 1.4 Intake Assessment, 6.4 Consent Management

### 1.4 Intake Assessment
Collect SDOH data, PHQ-9, dietary restrictions and preferences, medical history, current medications,
lab values, vital signs. Build a structured clinical and social profile.

- **Automation:** 🟡 Medium — AVA conducts voice-based intake; agent structures and validates
  responses; RDN and care coordinator review before care plan creation
- **Surface:** Provider app (RDN/care coordinator review); Patient app (self-reported inputs);
  AVA (voice collection)
- **Upstream:** 1.3 Enrollment
- **Downstream:** 1.5 Care Plan Creation, 7.1 Risk Scoring

### 1.5 Care Plan Creation
Generate an individualized care plan: goals, interventions, visit cadence, meal prescription,
behavioral health referrals, PCP communication. Requires multi-disciplinary input and sign-off.

- **Automation:** 🟡 Medium — agent drafts plan from assessment data and clinical guidelines;
  RDN, BHN, and care manager review sections within their scope; final plan requires
  coordinator approval
- **Surface:** Provider app (draft review, collaborative editing, approval)
- **Upstream:** 1.4 Intake Assessment
- **Downstream:** 1.6 Meal Prescription, 2.x Clinical Scheduling, 1.7 Ongoing Monitoring

### 1.6 Meal Prescription
Translate care plan nutrition goals into a weekly meal prescription: caloric targets, macro limits,
allergen exclusions, cultural preferences, hot/cold preference, delivery frequency.

- **Automation:** 🟢 High — agent matches patient profile to available recipe catalog; flags
  cases with no valid match; presents selection for coordinator confirmation
- **Surface:** Admin app (exception handling and coordinator confirmation)
- **Upstream:** 1.5 Care Plan, Meal Operations (recipe catalog)
- **Downstream:** 3.5 Order Generation

### 1.7 Ongoing Monitoring & Check-ins
Scheduled outreach via AVA (voice), patient app, or care team — collecting symptoms, mood, medication
adherence, meal satisfaction, weight, and engagement signals.

- **Automation:** 🟢 High — AVA handles scheduled calls autonomously; responses are structured,
  scored, and logged; anomalies trigger alerts; agent drafts follow-up actions
- **Surface:** Provider app (alert review, response actions); AVA (primary channel)
- **Upstream:** 1.5 Care Plan (sets check-in schedule)
- **Downstream:** 7.1 Risk Scoring, 4.4 Partner Reporting, 2.5 Clinical Documentation

### 1.8 Appointment Scheduling
Schedule RDN visits, BHN sessions, PCP consultations, and telehealth calls based on care plan
cadence, provider availability, and patient preference.

- **Automation:** 🟡 Medium — agent matches availability and sends scheduling links; handles
  confirmations, reminders, and rescheduling autonomously; human needed for complex
  multi-provider coordination
- **Surface:** Provider app (provider calendar management); Patient app (patient self-scheduling)
- **Upstream:** 1.5 Care Plan
- **Downstream:** 2.1–2.3 Clinical Visits

### 1.9 Care Plan Updates
Revise care plan in response to clinical events, new lab results, changed patient circumstances,
or provider recommendations. Requires versioning and audit trail.

- **Automation:** 🟡 Medium — agent drafts proposed changes with rationale; care team reviews and
  approves; chat-as-audit-log captures full decision trail
- **Surface:** Provider app
- **Upstream:** 2.5 Clinical Documentation, 4.3 Lab Results, 7.1 Risk Scoring
- **Downstream:** 1.6 Meal Prescription, 1.7 Monitoring schedule

### 1.10 Patient Communication
Outbound communication to patients: appointment reminders, delivery notifications, educational
content, survey requests, and ad hoc responses to patient questions.

- **Automation:** 🟢 High — agent handles templated outreach; escalates to human for clinical
  or sensitive queries; multilingual support
- **Surface:** Patient app (patient-facing); Admin app (coordinator override)
- **Upstream:** All patient lifecycle events
- **Downstream:** Patient engagement metrics (10.x)

### 1.11 Discharge & Care Transitions
Close the care episode cleanly: generate transition summary, share with PCP, archive records,
notify payer, complete final billing, collect closure survey.

- **Automation:** 🟡 Medium — agent generates summary and triggers downstream tasks; coordinator
  reviews and approves transmission to external parties
- **Surface:** Admin app / Provider app
- **Upstream:** Clinical events, partner contract terms
- **Downstream:** 5.x Billing (final claims), 4.4 Partner Reporting

---

## 2. Clinical Care

How care is delivered, documented, and coordinated across disciplines.

### 2.1 RDN Visits
Schedule, conduct (in-person or telehealth), document, and bill Registered Dietitian Nutritionist
visits. Includes nutrition counseling, meal plan review, and biomarker discussion.

- **Automation:** 🔴 Low — visit itself is human; agent pre-populates notes template, surfaces
  relevant patient history, drafts SOAP note from transcript, auto-codes for billing
- **Surface:** Provider app (documentation, scheduling, billing)
- **Upstream:** 1.8 Scheduling, 4.3 Lab Results
- **Downstream:** 2.5 Documentation, 5.2 Claims

### 2.2 BHN Sessions
Schedule, conduct, and document Behavioral Health Navigator sessions — PHQ-9 follow-up, stress
management, mental health screening, safety planning.

- **Automation:** 🔴 Low — session is human; agent assists with documentation, risk flags,
  and referral drafting
- **Surface:** Provider app
- **Upstream:** 1.8 Scheduling, 7.3 Crisis Flags
- **Downstream:** 2.5 Documentation, 7.3 Crisis Intervention

### 2.3 PCP Consultations
Coordinate with the patient's primary care provider — share care plan summaries, receive lab
orders, transmit clinical notes, manage bidirectional data flow via FHIR.

- **Automation:** 🟡 Medium — FHIR-compliant data exchange can be largely automated; agent
  prepares summaries for transmission; human reviews before sending to external EHR
- **Surface:** Provider app; EHR integration (Epic)
- **Upstream:** 2.5 Clinical Documentation
- **Downstream:** External EHR (Epic), Partner reporting

### 2.4 Telehealth / Virtual Visits
Conduct and record virtual visits via integrated video platform. Link recordings and transcripts
to patient record.

- **Automation:** 🟡 Medium — scheduling and documentation largely automated; note generation
  from transcript; human conducts the visit
- **Surface:** Provider app (embedded video), Patient app
- **Upstream:** 1.8 Scheduling
- **Downstream:** 2.5 Documentation

### 2.5 Clinical Documentation
Capture, structure, and store all clinical interactions — SOAP notes, progress notes, assessment
results, treatment plan changes, care coordination actions.

- **Automation:** 🟡 Medium — agent generates drafts from transcripts and structured inputs;
  clinician reviews and signs; signature is the compliance gate
- **Surface:** Provider app
- **Upstream:** 2.1–2.4 Visits, 1.7 Monitoring
- **Downstream:** 5.2 Claims, 4.4 Reporting, 10.x Analytics

### 2.6 Lab Result Intake & Biomarker Tracking
Receive lab results (HL7/FHIR), associate with patient record, update biomarker trending, flag
out-of-range values, and notify care team.

- **Automation:** 🟢 High — structured data ingestion, auto-association, threshold alerting
  all fully automatable
- **Surface:** Provider app (alert review, trend visualization)
- **Upstream:** External labs, wearables, patient-reported
- **Downstream:** 7.1 Risk Scoring, 1.9 Care Plan Updates, 10.x Analytics

### 2.7 Medication Reconciliation
Maintain current medication list, flag interactions, track adherence (via AVA check-ins),
coordinate with prescribing providers.

- **Automation:** 🟡 Medium — agent maintains list from multiple sources (EHR, patient report,
  pharmacy); interaction checking fully automated; adherence data from AVA; human reviews
  discrepancies
- **Surface:** Provider app
- **Upstream:** 1.4 Intake, 2.1 RDN/PCP visits, 1.7 Monitoring (AVA)
- **Downstream:** Care plan, Risk scoring

### 2.8 External Referrals
Generate and track referrals to specialists, community resources, social services, and other
care partners outside of Cena Health.

- **Automation:** 🟡 Medium — agent drafts referral letters, identifies appropriate resources,
  tracks status; human approves outbound referrals
- **Surface:** Provider app
- **Upstream:** Clinical documentation, risk flags
- **Downstream:** Care coordination, partner tracking

### 2.9 Provider-to-Provider Communication
Secure messaging between care team members (RDN, BHN, PCP, care coordinator) for handoffs,
questions, and care coordination.

- **Automation:** 🟡 Medium — agent can surface relevant patient context when a message thread
  is opened, draft responses, and flag unanswered messages; humans conduct the actual
  communication
- **Surface:** Provider app (secure messaging)
- **Upstream:** All clinical events
- **Downstream:** Clinical documentation

---

## 3. Meal Operations

How medically tailored meals get planned, made, and delivered.

### 3.1 Recipe Management
Create, edit, approve, and maintain the recipe catalog. Includes freeform text input → structured
recipe (ingredients, quantities, prep, variations), allergen tagging, and nutritional analysis.

- **Automation:** 🟡 Medium — agent parses freeform input into structured recipe, assigns tags,
  flags ambiguities, asks clarifying questions; kitchen staff reviews and approves
- **Surface:** Kitchen app (recipe creation/editing, tag management)
- **Upstream:** Kitchen staff input, RDN nutritional guidelines
- **Downstream:** 3.3 Meal Matching, 3.5 Orders

### 3.2 Nutritional Analysis
Validate that recipes meet clinical targets (caloric range, macro ratios, sodium limits,
potassium limits for renal diets, etc.). Flag non-compliant recipes.

- **Automation:** 🟢 High — structured nutritional databases + agent logic can score and flag
  recipes automatically
- **Surface:** Kitchen app (flag review); Provider app (RDN validation)
- **Upstream:** 3.1 Recipes
- **Downstream:** 3.3 Meal Matching

### 3.3 Meal Plan Matching
Match each patient's active prescription to available recipes. Account for allergens, preferences,
variety (avoid repetition), cultural appropriateness, and clinical constraints.

- **Automation:** 🟢 High — constraint satisfaction problem well-suited to automation; agent
  generates weekly selections, flags patients with no valid match
- **Surface:** Admin app (exception handling, coordinator confirmation)
- **Upstream:** 1.6 Meal Prescription, 3.1 Recipe Catalog
- **Downstream:** 3.5 Order Generation

### 3.4 Inventory Management
Track ingredient availability across kitchens, forecast demand from upcoming orders, flag
shortfalls, coordinate procurement.

- **Automation:** 🟡 Medium — agent generates demand forecast from order pipeline; flags
  shortfalls; human approves procurement actions
- **Surface:** Kitchen app
- **Upstream:** 3.5 Orders
- **Downstream:** 3.6 Kitchen Coordination

### 3.5 Order Generation
Convert approved meal selections into kitchen orders — one order per patient per delivery,
aggregated grocery list per kitchen, packing slips with patient name and dietary notes.

- **Automation:** 🟢 High — fully automatable from approved meal plan selections
- **Surface:** Kitchen app (order list, packing slips, grocery list); Admin app (aggregate view)
- **Upstream:** 3.3 Meal Matching
- **Downstream:** 3.6 Kitchen Coordination, 3.7 Delivery

### 3.6 Kitchen Coordination
Transmit orders to kitchen, track preparation status (prepped, packed, quality-checked),
coordinate handoff to delivery.

- **Automation:** 🟡 Medium — status updates via QR scan or kitchen staff input; agent
  monitors status and flags delays or issues
- **Surface:** Kitchen app (primary interface for kitchen staff)
- **Upstream:** 3.5 Orders
- **Downstream:** 3.7 Delivery Logistics

### 3.7 Delivery Logistics
Schedule delivery routes, dispatch drivers, track delivery status in real time, confirm
completion or flag missed deliveries.

- **Automation:** 🟡 Medium — route optimization automatable; delivery confirmation via
  driver app or QR scan; missed delivery triggers automated follow-up workflow
- **Surface:** Kitchen app (dispatch view); Patient app (delivery tracking)
- **Upstream:** 3.6 Kitchen Coordination
- **Downstream:** 3.8 Missed Delivery, 3.9 Feedback, 5.x Billing triggers

### 3.8 Missed Delivery Management
Detect missed deliveries, attempt patient contact, determine cause (access issue, patient away,
kitchen error), reroute or reschedule, document outcome, notify care team if clinically relevant.

- **Automation:** 🟡 Medium — detection and initial outreach automated; resolution may need
  human coordination
- **Surface:** Admin app, Kitchen app
- **Upstream:** 3.7 Delivery
- **Downstream:** 1.10 Patient Communication, 7.1 Risk (food insecurity flag)

### 3.9 Patient Feedback Collection
Collect meal satisfaction ratings and qualitative feedback per delivery. Surface to kitchen
and care team. Use to improve recipe selection and patient matching.

- **Automation:** 🟢 High — AVA collects via call; Patient app collects via in-app survey;
  agent aggregates and surfaces patterns
- **Surface:** Patient app, AVA; Kitchen app (feedback view)
- **Upstream:** 3.7 Delivery confirmation
- **Downstream:** 3.1 Recipe Management (feedback loop), 10.x Analytics

### 3.10 Food Safety & Compliance
Document temperature logs, quality checks, food handling certifications, and kitchen inspections.
Maintain records for regulatory compliance.

- **Automation:** 🟡 Medium — structured data entry automatable; human must conduct actual
  checks; agent monitors for gaps and flags overdue documentation
- **Surface:** Kitchen app
- **Upstream:** Kitchen operations
- **Downstream:** 6.x Compliance

---

## 4. Partner & Payer Relations

How Cena Health works with health systems, MCOs, and payers.

### 4.1 Partner Onboarding
Set up a new partner organization: execute contract, configure data exchange (FHIR endpoints,
HL7 feeds), define referral workflows, establish reporting schedule, train partner staff.

- **Automation:** 🟡 Medium — contract execution, FHIR configuration, and workflow setup
  all have templated components; final validation requires human sign-off
- **Surface:** Admin app (partner configuration, onboarding checklist)
- **Upstream:** Business Development (signed contract)
- **Downstream:** 1.1 Referral Intake (now live), 4.4 Reporting

### 4.2 Contract Management
Maintain active contracts, track term dates, renewal conditions, reporting obligations,
payment schedules, and SLA commitments.

- **Automation:** 🟡 Medium — agent monitors dates and flags actions; humans own negotiations
  and signing
- **Surface:** Admin app (contract dashboard)
- **Upstream:** Business Development, Legal
- **Downstream:** 5.x Billing, 4.4 Reporting

### 4.3 Payer Data Exchange
Send and receive clinical data, encounter records, claims, and quality metrics with MCOs and
payers via FHIR, HL7, and EDI formats.

- **Automation:** 🟢 High — structured data exchange is well-defined and largely automatable;
  agent monitors for errors and rejects
- **Surface:** Admin app (error/exception queue)
- **Upstream:** 2.5 Clinical Documentation, 5.2 Claims
- **Downstream:** 5.3 Payment, 4.4 Reporting

### 4.4 Partner Reporting
Generate regular performance reports for each partner: enrollment counts, visit completion rates,
biomarker outcomes, meal delivery completion, engagement metrics, shared savings data.

- **Automation:** 🟡 Medium — data aggregation and report generation automatable; human reviews
  before distribution
- **Surface:** Admin app (report preview, distribution); Partner portal (report view)
- **Upstream:** All clinical and operational data
- **Downstream:** Partner relationship management, 5.4 Shared Savings

### 4.5 Referral Pipeline Management
Track the volume, source, conversion rate, and outcome of referrals from each partner.
Identify gaps, escalate low-performing pipelines.

- **Automation:** 🟡 Medium — data aggregation automated; human owns partner conversations
- **Surface:** Admin app
- **Upstream:** 1.1 Referral Intake
- **Downstream:** 9.x Business Development

### 4.6 Shared Savings Calculation & Reporting
Calculate shared savings performance against contract benchmarks. Prepare documentation for
payer settlement. Reconcile against payer calculations.

- **Automation:** 🟡 Medium — calculation from structured data automatable; reconciliation
  with payer requires human review and negotiation if discrepancies exist
- **Surface:** Admin app / Finance
- **Upstream:** 10.x Analytics, 2.5 Clinical Documentation
- **Downstream:** 5.3 Payment receipt

---

## 5. Revenue Cycle & Billing

How Cena Health gets paid.

### 5.1 Insurance Eligibility Verification
Real-time verification of coverage at or before each service event. Track expiration, MCO
changes, and benefit updates.

- **Automation:** 🟢 High — API-based, structured response, fully automatable
- **Surface:** Admin app (exception handling)
- **Upstream:** 1.2 Enrollment eligibility, service scheduling
- **Downstream:** 5.2 Claims

### 5.2 Claims Generation
Translate service documentation into billable claims (CPT codes, diagnosis codes, place of
service, units). Covers FFS, PMPM, and value-based contract structures.

- **Automation:** 🟡 Medium — agent auto-codes from structured visit documentation; human
  reviews high-value or complex claims before submission
- **Surface:** Admin app / Finance (claim review queue)
- **Upstream:** 2.5 Clinical Documentation, 3.7 Delivery confirmation
- **Downstream:** 5.3 Submission

### 5.3 Claims Submission & Tracking
Submit claims to payers via clearinghouse, track status, receive ERAs (Electronic Remittance
Advice), post payments.

- **Automation:** 🟢 High — clearinghouse integration handles submission and status tracking;
  agent monitors for rejections and errors
- **Surface:** Admin app / Finance (exception queue)
- **Upstream:** 5.2 Claims
- **Downstream:** 5.4 Payment Posting, 5.5 Denials

### 5.4 Payment Posting
Apply received payments to outstanding claims. Reconcile against expected amounts.

- **Automation:** 🟡 Medium — ERA-based auto-posting where structured; exceptions need human review
- **Surface:** Finance app
- **Upstream:** 5.3 Claims
- **Downstream:** Financial reporting

### 5.5 Denial Management & Appeals
Identify denied claims, determine root cause, generate appeals, resubmit corrected claims.

- **Automation:** 🟡 Medium — categorization and appeal letter drafting automatable; human
  reviews before submission; complex cases need human strategy
- **Surface:** Finance app (denial queue, appeal drafting)
- **Upstream:** 5.3 Claims
- **Downstream:** 5.3 Resubmission

### 5.6 PMPM & Contract Billing
Generate and submit per-member-per-month invoices for value-based contracts. Reconcile enrollment
counts with payer records.

- **Automation:** 🟡 Medium — generation from enrollment data automatable; reconciliation
  requires human review
- **Surface:** Finance app
- **Upstream:** 1.3 Enrollment, 4.2 Contracts
- **Downstream:** 5.4 Payment

### 5.7 Financial Reporting
Produce P&L, revenue cycle metrics, cost-per-patient, shared savings actuals vs. targets,
cash flow forecasts.

- **Automation:** 🟡 Medium — data aggregation and report generation automatable; interpretation
  and board presentation require human judgment
- **Surface:** Finance app, Admin app
- **Upstream:** All billing and cost data
- **Downstream:** Board reporting, investor relations

---

## 6. Compliance & Regulatory

How Cena Health stays legal, licensed, and auditable.

### 6.1 HIPAA Compliance Monitoring
Monitor access logs, data flows, and system events for HIPAA violations. Maintain minimum
necessary access controls. Generate compliance reports.

- **Automation:** 🟢 High — log monitoring, anomaly detection, and report generation
  all automatable; human reviews alerts and owns response
- **Surface:** Admin app (compliance dashboard, alert queue)
- **Upstream:** All system events
- **Downstream:** 6.5 Incident Response

### 6.2 Audit Logging
Maintain immutable, timestamped records of all data access, modifications, agent actions,
and human decisions. This is the chat-as-audit-log system.

- **Automation:** 🟢 High — fully automated at the infrastructure layer; every tool call
  is a log entry
- **Surface:** Admin app (audit trail viewer, export)
- **Upstream:** All system actions
- **Downstream:** 6.1 HIPAA, compliance reporting, legal

### 6.3 Access Control Management
Manage roles, permissions, and user provisioning. Enforce least-privilege. Handle onboarding,
offboarding, and role changes for all users.

- **Automation:** 🟡 Medium — provisioning from HR triggers automatable; access review
  requires periodic human audit
- **Surface:** Admin app (user management)
- **Upstream:** 8.1 HR (hire/terminate events)
- **Downstream:** All system access

### 6.4 Consent Management
Collect, store, version, and track patient consents — clinical treatment, HIPAA authorization,
research participation, data sharing, and program-specific consents. Support withdrawal.

- **Automation:** 🟡 Medium — digital signature flow automatable; agent monitors for
  expired or missing consents and triggers renewal; human handles complex withdrawal cases
- **Surface:** Patient app (consent flow); Admin app (consent status, compliance view)
- **Upstream:** 1.3 Enrollment
- **Downstream:** All data use decisions

### 6.5 Security Incident Response
Detect, classify, contain, investigate, and report security incidents. Includes breach
notification process if PHI is involved.

- **Automation:** 🔴 Low — detection automated; response is human-led with agent support for
  documentation and notification drafting
- **Surface:** Admin app (incident tracker)
- **Upstream:** 6.1 Monitoring
- **Downstream:** Legal, payer notifications, OCR reporting

### 6.6 Regulatory Reporting
Generate and submit required reports to CMS, HEDIS, state agencies, and payer-specific
quality programs. Includes NCQA certification requirements.

- **Automation:** 🟡 Medium — data aggregation automatable; submission may require
  human sign-off
- **Surface:** Admin app (report generation, submission tracking)
- **Upstream:** 10.x Analytics
- **Downstream:** Payer contracts, regulatory relationships

### 6.7 IRB Compliance (Research)
Manage IRB protocols for UConn and future research partners — consent versioning, data
de-identification, access controls for research data, protocol adherence tracking.

- **Automation:** 🟡 Medium — monitoring and documentation automatable; IRB submissions
  and protocol decisions are human
- **Surface:** Admin app (research compliance view)
- **Upstream:** Partner agreements (UConn)
- **Downstream:** Research data exports, academic reporting

### 6.8 Staff Credentialing & Licensure
Verify, track, and maintain clinical credentials — RDN, BHN, PCP, NPI, state licenses.
Flag expirations and trigger renewal workflows.

- **Automation:** 🟢 High — primary source verification automatable; expiration tracking
  and alerts fully automated; human handles the actual renewal process
- **Surface:** Admin app (credentialing dashboard)
- **Upstream:** 8.1 HR
- **Downstream:** Billing (valid NPI required for claims)

---

## 7. Risk Management & Quality

How Cena Health catches problems before they become crises.

### 7.1 Real-Time Risk Scoring
Continuously score each active patient across clinical, behavioral, social, and engagement
dimensions. Update on new data. Surface risk tier (low/medium/high/critical) to care team.

- **Automation:** 🟢 High — rule-based and ML-based scoring fully automatable; human acts
  on alerts, not on scoring itself
- **Surface:** Provider app / Admin app (risk dashboard, color-coded patient list)
- **Upstream:** 1.7 Monitoring, 2.6 Labs, AVA call data, delivery data
- **Downstream:** 7.2 Alerts, 1.9 Care Plan Updates

### 7.2 Clinical Alert Generation & Routing
Generate alerts when risk thresholds are crossed or specific clinical events occur. Route to
the right care team member based on alert type, urgency, and role.

- **Automation:** 🟢 High — generation and routing are rule-based and fully automatable;
  humans act on alerts
- **Surface:** Provider app (alert inbox, notification layer)
- **Upstream:** 7.1 Risk Scoring, 2.6 Labs, 1.7 Monitoring
- **Downstream:** 7.3 Crisis Intervention, 1.9 Care Plan Updates, 2.9 Provider Messaging

### 7.3 Crisis Intervention
Detect mental health crises from AVA calls, PHQ-9 scores, or care team flags. Trigger
safety protocols: escalate to BHN, notify emergency contacts, initiate safety plan,
document everything.

- **Automation:** 🔴 Low — detection automated; intervention is human-led; agent supports
  with protocol checklists and documentation
- **Surface:** Provider app (crisis workflow, safety plan documentation)
- **Upstream:** AVA sentiment analysis, BHN session flags, PHQ-9 scores
- **Downstream:** 2.2 BHN Session, external emergency services if needed

### 7.4 Outcomes Measurement
Track patient-level and population-level clinical outcomes over time: HbA1c trends, weight,
BP, PHQ-9, food security scores, quality of life metrics.

- **Automation:** 🟡 Medium — data aggregation and trending automatable; interpretation
  and clinical significance assessment require human review
- **Surface:** Provider app (patient-level trends); Admin app (population-level)
- **Upstream:** 2.6 Labs, 1.7 Monitoring, 2.5 Documentation
- **Downstream:** 4.4 Partner Reporting, 10.x Analytics

### 7.5 Care Gap Identification
Identify patients overdue for scheduled visits, lab draws, check-ins, or care plan updates.
Trigger outreach or escalation.

- **Automation:** 🟢 High — fully automatable from schedule and completion data; agent
  generates outreach actions automatically
- **Surface:** Provider app (gap list), Admin app
- **Upstream:** 1.8 Scheduling, 2.5 Documentation, 1.7 Monitoring
- **Downstream:** 1.10 Patient Communication, 2.x Scheduling

### 7.6 Patient Satisfaction & Engagement Monitoring
Track NPS scores, feedback patterns, engagement rates (AVA response rate, app usage, appointment
adherence), and disengagement signals.

- **Automation:** 🟢 High — data collection and pattern detection automatable; human reviews
  aggregate patterns and responds to concerning trends
- **Surface:** Admin app (engagement dashboard)
- **Upstream:** 3.9 Meal Feedback, 1.7 Monitoring, AVA interaction data
- **Downstream:** 10.x Analytics, 1.9 Care Plan Updates

---

## 8. Internal Operations

How the company runs day to day.

### 8.1 HR & People Operations
Hiring, onboarding, offboarding, payroll, benefits, performance management, PTO tracking,
and staff training compliance.

- **Automation:** 🟡 Medium — admin tasks (offer letters, onboarding checklists, payroll runs)
  largely automatable via integrations (Gusto, Rippling); human owns hiring decisions and
  performance conversations
- **Surface:** Admin app (HR integrations); external HR platform
- **Upstream:** Business needs, budget
- **Downstream:** 6.3 Access Control, 6.8 Credentialing, 5.x Billing (NPI)

### 8.2 Provider Credentialing Operations
Maintain NPI registry, payer enrollment, clinical privilege management, and malpractice
insurance tracking for all clinical staff.

- **Automation:** 🟡 Medium — tracking and alerts automatable; payer enrollment applications
  require human effort
- **Surface:** Admin app
- **Upstream:** 8.1 HR
- **Downstream:** 5.2 Claims (valid billing credentials required)

### 8.3 Vendor Management
Track contracts, performance, and renewals for technology vendors, kitchen partners, delivery
logistics partners, and clinical service contractors.

- **Automation:** 🟡 Medium — contract tracking and renewal alerts automatable; relationship
  management is human
- **Surface:** Admin app
- **Upstream:** Operations needs
- **Downstream:** 3.x Meal Operations, IT infrastructure

### 8.4 IT Infrastructure & Security
Manage cloud infrastructure (AWS/GCP), HIPAA-compliant hosting, monitoring, incident response,
backups, disaster recovery.

- **Automation:** 🟡 Medium — infrastructure management largely automated via IaC and monitoring
  tools; incident response needs humans
- **Surface:** Internal engineering tooling; no user-facing app surface
- **Upstream:** Engineering team
- **Downstream:** All platform functions

### 8.5 Legal & Contract Management
Manage business agreements, NDAs, BAAs (Business Associate Agreements, required for all HIPAA-
covered data sharing), clinical contracts, and regulatory filings.

- **Automation:** 🟡 Medium — agent drafts agreements from templates, tracks signatures,
  monitors renewal dates; humans own negotiations and legal review
- **Surface:** Admin app (contract tracker, signature workflow)
- **Upstream:** Business Development, HR, Partner Operations
- **Downstream:** All partner and vendor relationships

### 8.6 Facility Management (Primary Care Clinic)
Manage the physical clinic: lease, equipment maintenance, janitorial, safety inspections,
supplies procurement, and regulatory site compliance (CT state).

- **Automation:** 🔴 Low — physical world; agent can help with scheduling, documentation,
  and vendor coordination; everything else is human
- **Surface:** Admin app (facility task management)
- **Upstream:** Facility lease, state requirements
- **Downstream:** Clinical operations

---

## 9. Business Development

How Cena Health grows.

### 9.1 Market Research & Competitive Intelligence
Monitor the Food-as-Medicine landscape, track competitors, identify new payer programs,
and surface regulatory opportunities (e.g., new Medicaid waivers).

- **Automation:** 🟡 Medium — agent monitors news, policy updates, CMS publications,
  and competitor activity; human interprets and acts
- **Surface:** Internal briefing doc / Slack equivalent; no dedicated app surface needed
- **Upstream:** External signals
- **Downstream:** 9.2 Prospect Identification, 9.5 Strategy

### 9.2 Prospect Identification & Outreach
Identify health systems, MCOs, and employer groups that are strong fits. Research decision
makers, draft outreach, manage pipeline.

- **Automation:** 🟡 Medium — research and draft generation automatable; human owns
  actual relationship and sales conversations
- **Surface:** CRM (external); Admin app (pipeline view)
- **Upstream:** 9.1 Market Research
- **Downstream:** 9.3 Proposals, 4.1 Partner Onboarding

### 9.3 Proposal & RFP Responses
Research and write responses to RFPs from health systems, MCOs, and government programs.
Synthesize clinical evidence, operational capability, and pricing.

- **Automation:** 🟡 Medium — agent drafts from template + knowledge base; humans review,
  customize, and own strategy
- **Surface:** No dedicated surface; doc-based workflow
- **Upstream:** 9.2 Prospects, 10.x Outcomes data
- **Downstream:** 9.4 Contracts, 4.1 Onboarding

### 9.4 Grant Writing & Management
Identify and pursue grant opportunities (NIH, AHRQ, state programs, foundations).
Write applications, manage reporting obligations, track budgets.

- **Automation:** 🟡 Medium — research and draft generation strong agent use case;
  human owns strategy and relationship with funding bodies
- **Surface:** No dedicated surface; doc-based
- **Upstream:** 10.x Research data
- **Downstream:** Revenue, research capabilities

### 9.5 Investor Relations
Maintain investor updates, manage data room, prepare board materials, track cap table.

- **Automation:** 🟡 Medium — data aggregation and report generation automatable;
  relationship is entirely human
- **Surface:** No dedicated surface; doc-based
- **Upstream:** All operational and financial data
- **Downstream:** Fundraising, board governance

### 9.6 Marketing & Brand
Content creation (clinical thought leadership, patient stories, case studies), website,
social media, conference presence.

- **Automation:** 🟡 Medium — content drafting and scheduling automatable; brand voice
  and strategy are human; approvals required before publication
- **Surface:** No dedicated surface; external marketing tools
- **Upstream:** Outcomes data, patient stories, clinical expertise
- **Downstream:** Brand awareness, referral pipeline

---

## 10. Data, Analytics & Research

How Cena Health understands what is working.

### 10.1 Population Health Analytics
Analyze outcomes across the full patient population — by condition, demographics, kitchen,
partner, risk tier. Identify what interventions are working and for whom.

- **Automation:** 🟡 Medium — data pipeline and visualization generation automatable;
  interpretation and action require human clinical and strategic judgment
- **Surface:** Admin app / Provider app (dashboards)
- **Upstream:** All clinical and operational data
- **Downstream:** Care program improvements, partner reporting, research

### 10.2 Operational Analytics
Track operational efficiency — order fulfillment rates, delivery completion, appointment
adherence, care team workload, AVA call completion rates.

- **Automation:** 🟢 High — entirely data-pipeline driven; agent generates daily/weekly
  summaries and flags anomalies
- **Surface:** Admin app, Kitchen app
- **Upstream:** All operational events
- **Downstream:** 8.x Internal Operations improvement

### 10.3 Value-Based Care Reporting
Calculate and report on HEDIS measures, CMS quality indicators, and contract-specific quality
metrics. Build the evidence base for shared savings claims.

- **Automation:** 🟡 Medium — calculation automatable from structured data; human reviews
  before submission to payers
- **Surface:** Admin app / Finance
- **Upstream:** 2.5 Clinical Documentation, 4.x Partner data
- **Downstream:** 4.4 Partner Reporting, 5.6 PMPM, 5.4 Shared Savings

### 10.4 Research Data Management
De-identify patient data for research use, manage IRB-compliant datasets, support academic
publication and grant reporting for UConn and future research partners.

- **Automation:** 🟡 Medium — de-identification pipeline automatable; dataset curation
  and research query support require human oversight
- **Surface:** Admin app (research data export, IRB compliance view)
- **Upstream:** All clinical data
- **Downstream:** Academic publications, grant reporting, 9.4 Grant Writing

### 10.5 Predictive Modeling
Build and maintain models that predict patient risk, estimate shared savings potential,
and optimize meal matching and intervention timing.

- **Automation:** 🟡 Medium — model execution fully automated; model development and
  validation require human data science work
- **Surface:** No direct surface; outputs feed 7.1 Risk Scoring and 3.3 Meal Matching
- **Upstream:** Historical clinical and operational data
- **Downstream:** 7.1 Risk Scoring, 3.3 Meal Matching, 9.x Business strategy

### 10.6 Board & Investor Reporting
Aggregate business metrics (revenue, patient count, outcomes, pipeline) for board meetings
and investor updates.

- **Automation:** 🟡 Medium — data aggregation and report generation automatable;
  narrative and strategic framing are human
- **Surface:** No dedicated surface; doc-based
- **Upstream:** All operational and financial data
- **Downstream:** 9.5 Investor Relations, board governance

---

## Automation potential summary

| Potential | Count | Meaning |
|---|---|---|
| 🟢 High | ~18 | Agent handles end-to-end; human sets policy, reviews exceptions |
| 🟡 Medium | ~38 | Agent does the work; human reviews before consequential actions |
| 🔴 Low | ~6 | Human primary; agent supports with prep, documentation, alerting |

The Low functions are mostly: in-person care delivery, crisis intervention, security incident response,
facility management, and investor/partner relationships. Everything else has a credible path to
near-full automation given sufficient data structure and agent capability.

---

## Platform surfaces implied by this map

The functions above that require human-navigable interfaces cluster into six distinct surfaces:

| Surface | Serves | Primary functions |
|---|---|---|
| **Patient app** | Patients | Enrollment self-completion, meal tracking, feedback, consent, appointment scheduling, AVA integration |
| **Provider app** | RDN, BHN, PCP, Care Coordinators | Care plans, clinical documentation, risk dashboard, alerts, scheduling, secure messaging |
| **Kitchen app** | Kitchen staff | Recipe management, order list, packing slips, grocery list, delivery status, feedback view |
| **Admin app** | Internal Cena staff | Patient management, partner config, compliance, billing/finance, credentialing, reporting |
| **Partner portal** | Health system/MCO staff | Referral submission, performance reports, data exchange status |
| **AVA** | Patients (voice) | Intake, check-ins, feedback, reminders, escalation |

Everything else — the 🟢 High functions and the automated pipelines within 🟡 Medium functions —
runs headlessly and surfaces only when it needs a human decision.

---

## Next steps from here

This map is the foundation. The logical next layer is:

1. **Prioritize by phase** — which functions are required for MVP vs. Phase 2 vs. later?
   (Rough answer: Phase 1 = domains 1, 2, 3, and enough of 5/6 to be legally operable)

2. **Define each function as a workflow** — inputs, steps, outputs, decision points, error states

3. **Identify the agent architecture** — what agents exist, what tools they call, how they
   coordinate, and what data they share

4. **Map compliance gates** — HIPAA, IRB, clinical sign-off requirements are constraints on
   automation potential, not afterthoughts

5. **Surface open questions** — the hard problems that need decisions before workflows can be
   designed (see `open-questions.md`)
