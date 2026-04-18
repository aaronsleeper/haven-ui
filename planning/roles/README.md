# Roles

Every human who uses the platform has a role. Every role has a defined set of permissions,
a primary app surface, a review queue, and a set of approval gates they own.

Roles are not job titles — they're capability bundles. A single person may hold multiple
roles (a care coordinator might also have admin access). The platform grants the union of
permissions across all roles a user holds.

---

## Role overview

| Role | App surface | Primary responsibility | Key approval gates |
|---|---|---|---|
| [Care Coordinator](care-coordinator.md) | Admin app | Patient lifecycle management, team coordination | Care plan approval, patient communication, discharge |
| [RDN](rdn.md) | Provider app | Nutrition assessment and care | Nutrition plan sign-off, MNT documentation |
| [BHN](bhn.md) | Provider app | Behavioral health assessment and monitoring | Behavioral health plan, crisis protocol |
| [Kitchen Staff](kitchen-staff.md) | Kitchen app | Meal production and delivery coordination | Order quality check, delivery confirmation |
| [Admin](admin.md) | Admin app | Platform operations, partner management, billing | Partner onboarding, claim submission, reports |
| [Patient](patient.md) | Patient app | Program participation | Consent, self-reported data, feedback |
| [AVA](ava.md) | Voice / no screen | Patient outreach and data collection | N/A — surfaces to humans, doesn't approve |

---

## Permission model

Permissions are additive. Users hold one or more roles; their effective permissions are the
union. Roles cannot be partially granted — you have a role or you don't.

**Data access is scoped by tenant.** A user can only access records within their tenant.
Cross-tenant access does not exist at the application level.

**PHI minimum necessary is enforced by role.** Even within a tenant, roles see only the PHI
fields relevant to their function:

| Data | Coordinator | RDN | BHN | Kitchen | Admin | Patient |
|---|---|---|---|---|---|---|
| Demographics | ✅ | ✅ | ✅ | ❌ | ✅ | Own only |
| Insurance / billing | ✅ | ❌ | ❌ | ❌ | ✅ | Own only |
| Clinical notes | ✅ summary | ✅ full | ✅ full | ❌ | ❌ | Own only |
| Diagnosis / medications | ✅ | ✅ | ✅ | ❌ | ❌ | Own only |
| Dietary restrictions | ✅ | ✅ | ✅ | ✅ tags only | ❌ | Own only |
| Delivery address | ✅ | ❌ | ❌ | ✅ | ❌ | Own only |
| PHQ-9 / behavioral | ✅ | ✅ summary | ✅ full | ❌ | ❌ | Own only |
| Billing / claims | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| Thread history | ✅ | ✅ clinical | ✅ clinical | ✅ ops | ✅ all | Own only |

---

## The agent as a role

AVA and the other specialist agents operate under a system role with tightly scoped
tool access. Agent tool registries enforce minimum necessary at the action level —
EligibilityAgent cannot read clinical notes; DocumentationAgent cannot submit claims.

See [ava.md](ava.md) for AVA's specific capabilities and constraints.
See [agent-framework.md](../architecture/agent-framework.md) for the full agent role model.
