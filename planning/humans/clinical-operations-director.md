---
name: Clinical Operations Director
status: planned
roles: []
---

# Clinical Operations Director

Planned hire. Owns Cena-specific clinical protocols, MNT targets by condition,
clinical risk thresholds, and study cohort-specific overrides. The authority
that multiple expert assumptions are waiting for.

## Role mapping

Role definition does not yet exist in `roles/*.md` — will need to be created
when the position is scoped for hiring.

## Expert relationships

| Expert | Relationship | What this means |
|---|---|---|
| **Clinical Care** | Assumption validator | Primary authority for all clinical assumptions: A1 (MNT targets), A3 (risk thresholds). Assumptions index becomes their onboarding checklist. |
| **Clinical Care** | Domain authority | Institutional clinical standards that override published guidelines. Owns the "Cena way" for MNT. |
| **Clinical Care** | Reviewer | Reviews Clinical Care expert spec for clinical accuracy — partners with Aaron (system) for full review. |
| **Compliance** (planned) | Domain authority (clinical) | Clinical compliance requirements (documentation standards, clinical audit expectations) |

## Assumptions awaiting this role

From `experts/clinical-care/domain-knowledge.md` assumptions index:

| # | Assumption | Current basis | What this person validates |
|---|---|---|---|
| A1 | Cena MNT caloric targets follow ADA/KDOQI/AHA | Published guidelines | Whether Cena uses standard targets or has institutional overrides, and whether targets vary by study cohort |
| A3 | Clinical risk thresholds follow published values | ADA, KDOQI, clinical norms | Cena-specific thresholds for care plan updates and escalations (HbA1c, eGFR, K+, albumin) |

## Open questions awaiting this role

- OQ-16: RDN documentation format (NCP/eNCPT or SOAP) — Aaron leans SOAP, final decision deferred to this role
- OQ-25: Medicare MNT visit cap integration into care plan cadence (partially Vanessa's, partially this role's)

## Freshness triggers

This entry is itself a freshness trigger for Clinical Care expert per RFC-0001:
when this position is filled, the assumptions index becomes the validation
checklist and the new person's onboarding includes reviewing all `[ASSUMPTION]`
entries in clinical-care/domain-knowledge.md.

## Hiring signal

This position unblocks: Clinical Care expert assumption validation, care plan
workflow shadowing confidence, and cohort-specific protocol definition. Priority
increases when Cena signs its first partner contract that specifies clinical
protocol requirements.
