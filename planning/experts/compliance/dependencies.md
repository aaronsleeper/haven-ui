# Dependencies — Compliance

## Depends on

| Expert | What flows in | What breaks if unavailable | Fallback mode | Fallback detail |
|---|---|---|---|---|
| Operations/Compliance | BAA status per vendor, regulatory interpretations, billing compliance context | Cannot confirm vendor data handling is authorized; consent scope may miss contractual obligations | `checklist` | Use published HIPAA requirements directly; defer vendor-specific questions to human |
| Clinical Care | Clinical data field definitions, care plan structure, biomarker types | Cannot build accurate PHI field inventory for clinical roles | `human-covers` | Human compliance officer (or Aaron) reviews clinical field access manually |
| Platform/Infrastructure | Data model schema, RBAC implementation approach, encryption configuration | Cannot verify structural enforcement of access controls | `human-covers` | Human reviews infrastructure compliance; flag as reduced confidence |

## Depended on by

| Expert | What flows out | What breaks if this expert is unavailable |
|---|---|---|
| UX Design Lead | PHI field access matrix, compliance review verdicts on UI designs | UI designs proceed without field-level compliance validation; may render PHI to wrong roles |
| Clinical Care | Consent scope specification (what data operations are authorized under clinical consent) | Clinical workflows operate on assumed consent scope; may over-share or under-share |
| Patient Ops (planned) | Consent gate specifications, audit trigger requirements for workflow steps | Workflow gates use default conservative assumptions; may over-gate |
| Platform/Infrastructure | Audit trigger specification, access control requirements | Infrastructure built with assumed audit requirements; may miss required logging |
| Operations/Compliance | Breach risk assessment methodology, structural compliance status | Breach notification decisions lack structured 4-factor analysis |
| Revenue Cycle (planned) | Billing audit requirements, consent scope for payer data sharing | Revenue cycle workflows carry implicit compliance assumptions |
