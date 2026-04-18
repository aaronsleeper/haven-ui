# Dependencies — Agent Integration Platform

Who this expert relies on for input, and who relies on this expert's output. Walks the dependency graph during `/expert-update` to detect cascading staleness.

---

## depends-on

| Upstream | What flows in | If interface changes | fallback_mode | fallback_detail |
|---|---|---|---|---|
| Platform-Infrastructure | GCP service availability, Cloud Run deployment patterns, Secret Manager conventions, IAM posture, VPC rules | Bridge deployment spec may need revision; security review re-run | halt | Bridge design blocked until Platform-Infrastructure's new posture is documented. No speculative bridges on unverified infra. |
| Compliance | HIPAA posture, BAA service list, PHI handling rules, audit log requirements | Bridge eligibility for new surfaces may need re-evaluation; PHI paths may need new safeguards | downgrade | Treat all new surfaces as "no PHI" until Compliance re-confirms BAA extent. Existing surfaces continue with last-known posture. |
| UX Design Lead | Surface affordance decisions, non-dev user experience principles, conversational patterns for Vanessa-class users | Surface-specific translations (reactions → approvals, etc.) may need revision | continue-with-note | Use last-ratified affordance mapping; note in retro log that UX guidance is stale. |
| Plain Language Positioning | Voice/tone standards for non-dev copy (PR summaries, `#ava-changes` posts) | `#ava-changes` post format updates | continue-with-note | Continue with last-approved templates; flag for refresh next cycle. |
| Agent-framework (code package) | Runtime `invoke()` implementation, tool registry, orchestrator behavior | Provider abstraction may need re-alignment; ship-point detection may need rewiring | halt | If `invoke()` contract breaks, no bridge can run; fix before continuing. |

## depended-on-by

| Downstream | What flows out | If this expert's interface changes | Their response |
|---|---|---|---|
| Platform-Infrastructure | Bridge deployment spec, Secret Manager resource requests, IAM binding requests | They provision new resources or update existing ones | They review and approve the deployment spec before resources provisioned |
| Compliance | Webhook security review, OAuth scope justification | They audit and sign off before each bridge ships | Their sign-off is a hard gate — bridge cannot deploy to production without it |
| Agent-framework (code package) | Provider abstraction spec, ship-point heuristic spec | They implement `invoke()` and ship-point logic per spec | They implement against the contract; mismatch = bug in their implementation |
| UX Design Lead | Surface capability matrix (what can each surface render/accept) | Their surface-specific designs respect capability boundaries | They check capability matrix before proposing features that may not translate |
| Bridge services (`code/services/<surface>-bridge/`) | All of the above | Bridge services ship design changes | Direct implementation consumer |

---

## Concept bridges

| Concept | Also in | Their perspective | Bridge value |
|---|---|---|---|
| Identity | Compliance, Platform-Infrastructure | Compliance: audit trail, access control. Platform: IAM principals, service accounts. | This expert: cross-surface identity mapping (Slack user → git author). All three views must stay consistent — a user who can do X in Slack must have equivalent GitHub/GCP permissions or the privilege gap is a vulnerability. |
| PHI boundary | Compliance, Clinical Care, Patient Ops, Meal Operations | Compliance: regulatory scope. Clinical/Patient/Meal: what content is PHI in their domain. | This expert: which surfaces carry which data. Enforces the "no PHI in non-BAA surface" rule at the bridge, consuming the definition from Compliance and the content examples from domain experts. |
| Secret storage | Platform-Infrastructure, Compliance | Platform: GCP Secret Manager operations. Compliance: access audit, rotation policy. | This expert: which secrets a bridge needs, what rotation cadence, what IAM binding. Requests storage, they provision, Compliance audits. |
| Ship-point / approval | Agent-framework, UX Design Lead, all downstream consumers | Agent-framework: runtime detection logic. UX: how approval feels on each surface. | This expert: the signal catalog and cross-surface mapping. Reactions are surface-specific; "approval" is substrate-level. |
| Session log | All experts | Every expert reads session logs during retros | This expert: defines the transcript capture contract at the bridge layer so logs stay consistent regardless of origin surface. |
