# Domain Knowledge — Compliance

What this expert must know to define and enforce structural HIPAA compliance
across the Ava platform.

---

## HIPAA Privacy Rule — structural requirements

| Knowledge area | What specifically | Source | Shelf life |
|---|---|---|---|
| Minimum necessary standard | §164.502(b) — covered entities must limit PHI use, disclosure, and requests to the minimum necessary for the intended purpose. Applies to every data access, every UI render, every agent tool call. Not just "don't show too much" — structurally enforce that each role's data access is scoped to what they need. | 45 CFR 164.502(b), HHS guidance | Regulatory — stable |
| PHI definition | §160.103 — individually identifiable health information: relates to past/present/future health condition, provision of care, or payment, AND identifies the individual or could reasonably identify them. Dietary restrictions + delivery address = PHI (diagnosis inferable + address identifies). | 45 CFR 160.103 | Regulatory — stable |
| De-identification standards | §164.514(b) — two methods: Safe Harbor (remove 18 identifiers) and Expert Determination (statistical/scientific basis). Safe Harbor is prescriptive and auditable; Expert Determination requires qualified statistician. | 45 CFR 164.514(b), HHS de-identification guidance | Regulatory — stable |
| 18 Safe Harbor identifiers | Names, geographic data (below state), dates (below year), phone, fax, email, SSN, MRN, health plan ID, account numbers, certificate/license numbers, vehicle IDs, device IDs, URLs, IPs, biometrics, full-face photos, any unique identifier | 45 CFR 164.514(b)(2) | Regulatory — stable |
| Business associate requirements | §164.502(e) — PHI disclosure to business associates requires BAA. Kitchen partners receiving diagnosis-linked dietary orders are business associates (OQ-28 confirmed). Delivery subcontractors handling PHI packing slips need downstream BAAs. | 45 CFR 164.502(e), HHS BA guidance | Regulatory — stable |

## HIPAA Security Rule — technical safeguards

| Knowledge area | What specifically | Source | Shelf life |
|---|---|---|---|
| Access controls | §164.312(a)(1) — unique user identification, emergency access procedure, automatic logoff, encryption. For Ava: every agent and human has a unique actor_id, every data access is authenticated and authorized through RBAC + tenant scoping. | 45 CFR 164.312(a) | Regulatory — stable |
| Audit controls | §164.312(b) — mechanisms to record and examine activity in systems containing PHI. For Ava: the thread model IS the audit log. Every tool call, approval, and data access is a message. Audit requirements define what MUST be logged vs. what is logged incidentally. | 45 CFR 164.312(b) | Regulatory — stable |
| Integrity controls | §164.312(c)(1) — protect PHI from improper alteration or destruction. For Ava: soft deletes only, immutable audit trail, versioned care plans. | 45 CFR 164.312(c) | Regulatory — stable |
| Transmission security | §164.312(e)(1) — guard against unauthorized access during transmission. For Ava: TLS everywhere, encrypted at rest (Cloud KMS CMEK), PHI never in logs. | 45 CFR 164.312(e) | Regulatory — stable |

## Consent scope model

| Knowledge area | What specifically | Source | Shelf life |
|---|---|---|---|
| Clinical consent | Covers treatment, care coordination, meal delivery data sharing with kitchen partners, provider-to-provider communication. Default consent at enrollment. Does NOT cover research data export or behavioral health detail sharing with non-treating providers. | HIPAA treatment/payment/operations (TPO) provisions, Cena enrollment workflow | Internal — review annually |
| Research consent | Covers data collection under IRB protocol, de-identified export to BigQuery. Separate from clinical consent. UConn IRB determines when protocol changes require re-consent (OQ-31). Only patients with active research consent appear in ETL pipeline. | 45 CFR 46 (Common Rule), UConn IRB protocol | Per-study protocol |
| Program consent | Covers platform usage (app ToS), meal delivery logistics, engagement notifications (SMS/email). Does NOT cover clinical data use for payer reporting (requires clinical consent) or research data use. | Platform ToS, HIPAA marketing rules | Internal — review annually |
| `[ASSUMPTION]` Consent boundary enforcement | Every data operation checks consent type before executing. The ConsentRecord entity tracks per-patient consent grants with version, scope, and expiration. Consent checks are enforced at the data access layer (middleware), not at the UI layer — UI reflects the result but doesn't make the decision. | Architecture data model (ConsentRecord entity), workflow 6.4 (consent gate). Validates by: Engineering (Andrey) for implementation approach | Until implementation begins |

## PHI field inventory

| Knowledge area | What specifically | Source | Shelf life |
|---|---|---|---|
| Role-to-field access matrix | Each role sees only the PHI fields minimum-necessary for their function. Providers see full clinical data. Coordinators see operational + clinical summary. Kitchen staff see dietary restrictions + delivery logistics. Patients see their own data (patient-friendly language, no codes). Finance sees billing fields. Research gets de-identified fields only. | §164.502(b), role definitions, workflow step inputs | Internal — update when roles change |
| PHI in agent context | Agents (tool calls) access PHI through tools with explicit field-level scoping. An agent calling `read_patient_record` gets only the fields its tool registry authorizes. PHI in tool call payloads is logged in the thread but marked `visible_to: [audit]` — never rendered in user-facing UI. | Agent framework (tool system), thread model (visibility rules) | Internal — stable architecture |
| PHI in thread messages | Thread messages containing PHI use the `visible_to` field to scope display. Clinical note content visible to providers/coordinators only. Billing details visible to finance/admin only. PHI in tool_call/tool_result messages visible to audit only. | Agent framework (thread model, visibility rules) | Internal — stable architecture |
| `[ASSUMPTION]` PHI rendering defaults | Provider app: full clinical PHI for assigned patients. Admin app: operational PHI (demographics, status, scheduling) + clinical summary (risk tier, care plan phase). Kitchen app: dietary restrictions, allergens, delivery address, meal order ID — no diagnoses, no clinical notes, no biomarkers. Patient app: own data in patient-friendly language. Partner portal: aggregate/de-identified only. | Role definitions, minimum-necessary principle, UI patterns doc. Validates by: Clinical Operations Director + UX Design Lead | Until UI implementation begins |

## Audit requirements

| Knowledge area | What specifically | Source | Shelf life |
|---|---|---|---|
| Audit event types | data_read (PHI field access), data_write (record creation/modification), approval_granted, approval_denied, consent_checked, escalation_triggered, role_access_changed, login/logout, failed_access_attempt | §164.312(b), thread model | Internal — expand as workflows grow |
| Audit event payload | actor_id, actor_type (agent/human/system), resource_type, resource_id, phi_fields_accessed (list), action, outcome (success/denied), timestamp, tenant_id, thread_id (links to full context) | §164.312(b), data model (AuditEvent entity) | Internal — stable |
| Retention requirements | HIPAA requires 6 years for policies/procedures. Audit logs: retain for duration of patient relationship + 6 years. Research audit logs: retain per IRB protocol (often 7+ years). State laws may extend (CT PDPA, CA CCPA — OQ-30 deferred but framework needed). | 45 CFR 164.530(j), state regulations | Regulatory — stable federal, variable state |
| Immutability | Audit events are append-only. No deletion, no modification. Soft deletes on clinical records preserve the audit chain. Thread messages are immutable once written. | §164.312(c)(1), architecture decision | Internal — stable |

## Breach notification

| Knowledge area | What specifically | Source | Shelf life |
|---|---|---|---|
| Breach definition | Unauthorized acquisition, access, use, or disclosure of unsecured PHI. Presumed breach unless low probability of compromise (4-factor risk assessment). | 45 CFR 164.402 | Regulatory — stable |
| Notification timeline | Individual notification within 60 days of discovery. HHS notification: annually for breaches <500 individuals, within 60 days for ≥500. Media notification required for ≥500 in a state/jurisdiction. | 45 CFR 164.404-408 | Regulatory — stable |
| 4-factor risk assessment | (1) Nature and extent of PHI involved, (2) unauthorized person who received PHI, (3) whether PHI was actually acquired/viewed, (4) extent of risk mitigation. All four factors must be assessed before concluding low probability. | 45 CFR 164.402(2) | Regulatory — stable |

## Reference sources

| Source | Domain | Trust level | When to consult |
|---|---|---|---|
| HHS HIPAA guidance (hhs.gov/hipaa) | Privacy Rule, Security Rule, Breach Notification | Authoritative | Any compliance boundary question |
| 45 CFR Parts 160, 164 | Full HIPAA regulatory text | Authoritative | Specific rule interpretation |
| HHS de-identification guidance | Safe Harbor, Expert Determination methods | Authoritative | Research data pipeline design |
| NIST SP 800-66 (HIPAA Security Rule toolkit) | Technical safeguard implementation | Expert | Infrastructure compliance decisions |
| OCR enforcement actions and resolution agreements | How HHS actually enforces HIPAA | Expert | Risk assessment calibration |
| CT PDPA / CA CCPA / TN state health privacy laws | State-specific privacy requirements | Authoritative | Multi-state operations |
| Cena Health internal consent templates | Institution-specific consent language | Authoritative | Consent scope validation |

---

## Assumptions index

| # | Assumption | Basis | Validates by | Status |
|---|---|---|---|---|
| A1 | Consent boundary enforcement at data access layer (middleware), not UI layer | Architecture data model, workflow 6.4 | Engineering (Andrey) | Unvalidated |
| A2 | PHI rendering defaults per role follow minimum-necessary as described above | Role definitions, UI patterns doc | Clinical Ops Director + UX Design Lead | Unvalidated |
