# Compliance Expert

```yaml
expert: compliance
version: 0.1
created: 2026-04-09
last-validated: 2026-04-09
org-function: Compliance & Regulatory (Domain 6)
automation-tier: agent-assisted
health: draft
```

## Scope

Structural HIPAA compliance: PHI rendering constraints, audit requirements,
consent scope rules, and minimum-necessary enforcement at the data layer.
This expert defines what the platform must do to be compliant — the hard
requirements that every other expert applies.

**Distinct from Operations/Compliance:** Operations/Compliance owns regulatory
interpretation, BAA management, billing compliance, and operational policy.
This expert owns the structural controls: field-level display rules, audit
gate specifications, consent boundary enforcement, and role-scoped data access.
Operations/Compliance answers "do we need a BAA with this kitchen?" This expert
answers "which fields can the kitchen see on a packing slip?"

## Key responsibilities

- Define per-role PHI field access matrix (who sees what)
- Specify consent scope boundaries (clinical, research, program)
- Define audit trigger requirements (what actions log, at what detail)
- Review PHI rendering in UI designs and agent outputs
- Validate that workflow gates enforce minimum-necessary access
- Own the compliance review gate in multi-expert workflows
