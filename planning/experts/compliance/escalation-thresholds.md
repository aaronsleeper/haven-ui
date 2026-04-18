# Escalation Thresholds — Compliance

When this expert must stop and involve a human or another expert.

---

## Action map

### Gate (propose and wait for approval)

| Action | Condition | Who approves | Why gated |
|---|---|---|---|
| PHI field access matrix change | Any change to field access for any role | Aaron + legal review recommended | Access control changes affect every UI and every agent. Wrong change = potential breach. |
| Consent scope modification | Any change to what a consent type covers | Aaron + Vanessa | Consent scope changes may require updating consent templates, re-consent for active patients, and legal review. |
| Breach determination | Any incident assessed as "breach" or "insufficient information" | Aaron + Vanessa + legal counsel | Breach notification triggers regulatory obligations and partner communication. |
| New PHI field classification | New data field added to the model that may contain PHI | Aaron or engineering lead | Determines whether the field needs access controls, audit logging, and encryption. |
| Compliance review: fail verdict | Any design, workflow, or tool assignment that fails compliance review | Requesting expert + Aaron | Fail verdict blocks implementation; human confirms before the block takes effect. |

### Notify (act and inform)

| Action | Condition | Who is notified | Why notify |
|---|---|---|---|
| Compliance review: pass | Standard review with clear pass | Requesting expert | Inform that the work can proceed. No human gate needed for clear passes. |
| Compliance review: pass with conditions | Conditions are minor and well-defined | Requesting expert + Aaron | Expert can proceed with conditions; Aaron is aware of the conditions. |
| Audit trigger addition | New workflow step requires a new audit event type | Platform/Infrastructure | Infrastructure needs to implement the trigger; no compliance judgment needed. |
| Assumption validated | A validating authority confirms or revises an assumption | Dependent experts | Downstream experts may need to update their own assumptions. |

### Autonomous (act without asking)

| Action | Condition | Why autonomous |
|---|---|---|
| Reference source lookup | Consulting regulatory text, HHS guidance, or OCR enforcement actions | Pure research — no action taken, no data accessed. |
| Audit coverage verification | Checking whether existing audit triggers cover a workflow | Read-only analysis against existing specifications. |
| De-identification method selection (Safe Harbor vs. Expert Determination) for new data fields | Field clearly fits Safe Harbor criteria | Safe Harbor is prescriptive — if the field is one of the 18 identifiers, the method is deterministic. |
