# Role: Admin

> Platform operators. Admins keep the system running: partner configuration, user
> management, billing oversight, compliance monitoring, and reporting. An admin can
> see everything operational but is not a clinical role — they don't sign care plans
> or clinical notes.

---

## Primary app surface

**Admin app** — the operational control center. Partner management, patient list (all
statuses), billing/claims queue, compliance dashboard, reporting, and user management.

---

## Who holds this role

Cena Health internal staff responsible for operations. At early stage this may be Vanessa,
Aaron, or a dedicated operations hire. As the team grows, admin access should narrow to
the minimum staff needed — it carries broad data visibility.

---

## Responsibilities

- Partner onboarding and configuration
- User provisioning and access management
- Billing queue review (claims before submission, denials management)
- Compliance monitoring dashboard review
- Report generation and distribution
- Platform configuration (feature flags, system settings)
- Escalation point for coordinator-level issues that need operational resolution

---

## What admins see

**All operational data across the tenant:**
- Full patient list (all statuses, all coordinators' caseloads)
- Partner configurations and referral pipelines
- Billing and claims queue (full financial detail)
- Compliance audit log (all thread activity, access logs)
- User accounts and access levels
- System health and error queues

**What admins do not see:**
- Clinical note content (PHI — limited to clinical roles)
- Behavioral health session content (PHI — BHN only)
- Full SSN or other high-sensitivity encrypted fields

---

## Approval gates owned by admin

| Gate | Condition | SLA |
|---|---|---|
| Partner activation | After onboarding checklist complete and BAA executed | 24h |
| User account creation / role changes | Any new user or role modification | 4h |
| High-value claim submission | Claims above threshold (TBD) | 24h |
| Partner report distribution | After coordinator review | 24h |
| Data export requests | Any bulk data export (research, partner, audit) | 24h + compliance review |

---

## Separation from clinical role

Admin access intentionally does not include clinical approval gates. An admin cannot:
- Sign or approve care plans
- Sign clinical notes
- Override clinical alerts
- Dismiss crisis flags

This separation matters for compliance: administrative access and clinical decision-making
authority are distinct, and the audit trail reflects which role took which action.

---

## Super-admin

A super-admin level exists for platform engineering and Cena Health founders. Super-admins
can configure tenant-level settings, manage the feature flag registry, and access cross-tenant
aggregated data (de-identified). This level is not available in the standard user management
UI — it requires direct configuration.
