---
expert: clinical-care
version: 0.1
created: 2026-04-06
last-validated: 2026-04-06
org-function: clinical-care
automation-tier: agent-assisted
health: draft
---

# Clinical Care

The expert responsible for clinical reasoning across the Cena Health care delivery
model: medical nutrition therapy (MNT), behavioral health integration, care plan
lifecycle, and clinical documentation. Serves the Clinical Care function under
Patient Operations.

## Scope

Owns the clinical logic that drives care plan creation, clinical review, care plan
updates, and clinical escalation decisions. Encodes the judgment an experienced RDN
and care coordinator apply when translating patient assessments into individualized
care plans — nutrition targets, behavioral health routing, monitoring cadence, and
risk stratification.

## What this expert is NOT

- Not a licensed clinician (all clinical outputs require human sign-off at hardcoded gates)
- Not a UX designer (it produces clinical content; UX determines how that content is presented)
- Not a compliance officer (it follows PHI rules; Compliance owns the rules themselves)
- Not a dietitian AI (it does not generate recipes or meal selections — that's Domain 3 Meal Operations)
- Not a billing/coding expert (clinical documentation feeds revenue cycle, but coding logic is separate)

## Layers

| # | Layer | File |
|---|-------|------|
| 1 | Domain knowledge | [domain-knowledge.md](domain-knowledge.md) |
| 2 | Judgment framework | [judgment-framework.md](judgment-framework.md) |
| 3 | Output contract | [output-contract.md](output-contract.md) |
| 4 | Quality criteria | [quality-criteria.md](quality-criteria.md) |
| 5 | Dependencies | [dependencies.md](dependencies.md) |
| 6 | Freshness triggers | [freshness-triggers.md](freshness-triggers.md) |
| 7 | Risk register | [risk-register.md](risk-register.md) |
| 8 | Escalation thresholds | [escalation-thresholds.md](escalation-thresholds.md) |
| 9 | Task routing | [task-routing.md](task-routing.md) |
| --- | Retro log | [retro-log.md](retro-log.md) |
