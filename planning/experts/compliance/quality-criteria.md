# Quality Criteria — Compliance

Testable definitions of what "good" looks like for each output type.

---

## PHI field access matrix

| # | Criterion | Pass | Fail |
|---|---|---|---|
| 1 | Every PHI field in the data model appears in the matrix | All PHI fields accounted for | Any PHI field missing from the matrix |
| 2 | Every role has an entry for every PHI field | Complete role × field coverage | Any role-field combination unspecified |
| 3 | Every "full access" entry has a minimum-necessary justification | Justification cites treatment need, operational need, or regulatory requirement | Justification is blank or says "convenience" |
| 4 | Every "suppressed" entry identifies what the role sees instead (if anything) | Alternative specified (e.g., "summary" or "none") | Suppressed with no alternative and no rationale |
| 5 | Kitchen roles cannot see diagnosis codes, biomarker values, or clinical notes | Verified suppressed | Any clinical field accessible to kitchen roles |
| 6 | Patient-facing fields use patient-friendly language, not clinical codes | ICD-10, CPT, LOINC codes never render to patient role | Clinical codes visible to patients |

## Consent scope specification

| # | Criterion | Pass | Fail |
|---|---|---|---|
| 1 | Every consent type has explicit "covers" and "does NOT cover" lists | Both lists present and non-empty | Either list missing |
| 2 | Boundary rules specify enforcement mechanism, not just policy | "Middleware blocks data_export if research_consent != active" | "Research data should only be exported with consent" |
| 3 | Research consent references specific IRB protocol version | Version number and scope documented | Generic "research consent" without protocol binding |
| 4 | No data operation is authorized by more than one consent type without explicit documentation | Each operation maps to exactly one consent type, or overlap is documented | Ambiguous dual-authorization without clarification |

## Audit trigger specification

| # | Criterion | Pass | Fail |
|---|---|---|---|
| 1 | Every PHI-accessing action in every workflow has a corresponding audit trigger | Workflow step audit coverage is complete | Any PHI-accessing step without an audit trigger |
| 2 | Every audit event includes actor_id, resource_id, timestamp, and outcome | All four fields present in every trigger definition | Any trigger missing required fields |
| 3 | Retention class is assigned to every trigger | Retention specified with regulatory basis | Retention undefined |
| 4 | Failed access attempts are logged at the same or higher detail than successful ones | Failed attempts include reason for denial | Failed attempts not logged or logged at lower detail |

## Compliance review verdict

| # | Criterion | Pass | Fail |
|---|---|---|---|
| 1 | Every finding cites the specific rule applied | "§164.502(b) minimum necessary" or "PHI field access matrix row 12" | "Not HIPAA compliant" without specificity |
| 2 | Pass-with-conditions verdicts include actionable conditions | Each condition is a specific change with a verification method | Vague conditions ("improve compliance") |
| 3 | Confidence reduction is explained | "Medium confidence: consent template v2 not yet reviewed by counsel" | "Medium confidence" with no explanation |
| 4 | Fail verdicts identify the minimum change needed to pass | Specific field suppression, consent addition, or gate insertion | "Redesign needed" without direction |

## Breach risk assessment

| # | Criterion | Pass | Fail |
|---|---|---|---|
| 1 | All 4 factors are addressed with specific evidence | Each factor has analysis grounded in observable facts | Any factor is "unknown" without investigation steps |
| 2 | Conclusion follows from the 4-factor analysis | Logical chain from evidence to conclusion | Conclusion contradicts or ignores factor findings |
| 3 | "Not a breach" conclusions are conservative | All 4 factors clearly favorable before concluding not-breach | "Probably fine" or ambiguous factors treated as favorable |
