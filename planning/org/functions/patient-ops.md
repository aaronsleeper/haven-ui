# Patient Operations

> Everything from first contact to discharge. The front door of the company —
> every patient passes through this function.

---

## Responsibilities

- Referral intake and validation
- Eligibility verification
- Patient enrollment and registration
- Intake assessment (SDOH, PHQ-9, dietary, medical history)
- Care plan creation and updates
- Ongoing monitoring and check-ins (via AVA)
- Status transitions through the patient lifecycle
- Discharge and program completion
- Readmission management
- Patient communication and scheduling

## Sub-functions

| Sub-function | Automation target | Agent coverage | Notes |
|---|---|---|---|
| Referral intake | 🤖 Automated | EligibilityAgent, IntakeAgent | Clean referrals fully automated; edge cases to human queue |
| Eligibility verification | 🤖 Automated | EligibilityAgent | Real-time payer API checks |
| Enrollment | 🤝 Agent-assisted | IntakeAgent | Agent pre-fills, coordinator reviews |
| Intake assessment | 🤝 Agent-assisted | AVA, IntakeAgent | AVA collects via voice; agent structures |
| Care plan creation | 🤝 Agent-assisted | DocumentationAgent | Agent drafts; RDN/BHN/coordinator approve |
| Ongoing monitoring | 🤖 Automated | AVA, RiskScoringAgent | Scheduled check-ins with risk scoring |
| Status management | 🤖 Automated | PatientJourneyOrchestrator | State machine with human gates at key transitions |
| Discharge | 🤝 Agent-assisted | PatientJourneyOrchestrator | Agent recommends; coordinator approves |
| Patient communication | 🤖/🤝 Mixed | CommunicationAgent, AVA | Routine comms automated; sensitive comms human |

## Interfaces

| Direction | Function | What flows |
|---|---|---|
| **From** | Partner & Payer | Referrals, eligibility data |
| **From** | Clinical Care | Care plan updates, visit outcomes |
| **To** | Clinical Care | Enrolled patients, assessment data |
| **To** | Meal Operations | Meal prescriptions from care plans |
| **To** | Revenue Cycle | Enrollment events, service records |
| **To** | Risk & Quality | Patient data for risk scoring |
| **To** | Data & Analytics | Patient journey data, outcome metrics |
| **To** | Patient Experience | Per-interaction satisfaction via AVA, enrollment experience |
| **From** | Marketing & Brand | Enrollment and education materials |

## Current state

No patients yet — platform in planning phase. UConn pilot targeted for Q2 2026.
Workflows fully specified in [01-patient-operations.md](../../workflows/01-patient-operations.md) (11 workflows).

## Quality checks

- No patient record created without verified eligibility
- Care plans require multi-disciplinary sign-off (RDN + coordinator minimum)
- Every patient has a monitoring schedule within 48 hours of enrollment
- Discharge criteria documented and met before status change
- Patient communication preferences respected (language, channel, time)

## Detailed workflows

See [01-patient-operations.md](../../workflows/01-patient-operations.md) for full workflow specifications.

## Key roles

- [Care Coordinator](../../roles/care-coordinator.md) — primary human for patient lifecycle
- [AVA](../../roles/ava.md) — voice agent for monitoring and intake
- PatientJourneyOrchestrator — workflow state management
