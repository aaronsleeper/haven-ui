# Output Contract — Compliance

What this expert produces, in what format, for whom.

---

## Outputs

### 1. PHI field access matrix

**Description:** Per-role table specifying which PHI fields are accessible,
with access level (full, summary, suppressed) and justification.

**Format:**

```
| Role | Field | Access | Justification |
|---|---|---|---|
| provider | diagnosis_codes | full | Treating provider — TPO |
| kitchen_staff | dietary_restrictions | full | Minimum-necessary for meal prep |
| kitchen_staff | diagnosis_codes | suppressed | Not needed for meal prep |
| patient | diagnosis_codes | summary | Patient-friendly language, no ICD-10 |
```

**Consumers:** UX Design Lead (drives UI field visibility), Platform/
Infrastructure (drives RBAC and middleware scoping), agent framework
(drives tool field scoping).

**Update trigger:** New role added, new PHI field added to data model,
consent scope change.

---

### 2. Consent scope specification

**Description:** Per-consent-type document defining what data operations
are authorized, with boundary rules and examples.

**Format:**

```
Consent type: [clinical | research | program]
Version: [semver]
Covers:
  - [data operation]: [justification]
Does NOT cover:
  - [data operation]: [why excluded, what consent IS needed]
Boundary rules:
  - [rule]: [enforcement mechanism]
```

**Consumers:** Patient Ops (consent gate in enrollment), Clinical Care
(treatment scope), Platform/Infrastructure (middleware enforcement),
research ETL pipeline (export filtering).

**Update trigger:** Consent template revision, new data operation type,
IRB protocol change, legal counsel guidance.

---

### 3. Audit trigger specification

**Description:** Table of actions that must generate audit events, with
required payload fields and retention class.

**Format:**

```
| Action | Trigger condition | Required payload | Retention class |
|---|---|---|---|
| phi_field_read | Any PHI field access | actor, resource, fields, outcome | standard (6yr) |
| consent_check | Any consent validation | actor, patient, consent_type, result | standard (6yr) |
| approval_decision | Any gate approval/denial | actor, thread, decision, rationale | standard (6yr) |
| failed_access | Access denied by RBAC/RLS | actor, resource, reason | extended (6yr+) |
| breach_assessment | Suspected PHI exposure | incident_id, 4-factor assessment | permanent |
```

**Consumers:** Platform/Infrastructure (audit event implementation),
AuditMonitor meta-agent (monitoring rules), Operations/Compliance
(breach notification process).

**Update trigger:** New workflow with PHI access, new agent with PHI
tools, regulatory change.

---

### 4. Compliance review verdict

**Description:** Pass/fail assessment of a proposed UI design, workflow
step, or agent tool assignment against PHI rendering rules and consent
scope. Produced when another expert requests a compliance check.

**Format:**

```
Review type: [ui_design | workflow_step | tool_assignment | data_pipeline]
Subject: [what was reviewed]
Verdict: [pass | pass_with_conditions | fail]
Findings:
  - [field/element]: [compliant | non-compliant] — [specific rule applied]
Conditions (if pass_with_conditions):
  - [what must change before implementation]
Confidence: [high | medium | low]
  - medium/low includes: [what assumption or gap reduces confidence]
```

**Consumers:** Requesting expert (UX Design Lead, Clinical Care, Patient
Ops, Platform/Infrastructure), human reviewer at gate.

**Update trigger:** On request — this is a reactive output, not scheduled.

---

### 5. Breach risk assessment

**Description:** Structured 4-factor analysis when a potential PHI
exposure is detected. Feeds the breach notification decision.

**Format:**

```
Incident ID: [reference]
Date discovered: [timestamp]
PHI involved:
  - Type: [field names]
  - Volume: [number of records/patients]
  - Sensitivity: [low | medium | high]
4-factor assessment:
  1. Nature/extent: [analysis]
  2. Unauthorized recipient: [known/unknown, relationship]
  3. Actually acquired/viewed: [evidence]
  4. Mitigation applied: [actions taken]
Conclusion: [breach | not a breach | insufficient information]
Recommendation: [notification action or further investigation]
```

**Consumers:** Operations/Compliance (notification process), legal counsel,
human decision-maker (Aaron/Vanessa).

**Update trigger:** On incident — this is event-driven.
