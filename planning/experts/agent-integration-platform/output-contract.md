# Output Contract — Agent Integration Platform

What this expert produces, in what format, for whom. Downstream consumers (engineering, security review, other experts) build against these contracts.

---

## Outputs

| Output | Format | Consumer | Purpose |
|---|---|---|---|
| Bridge architecture doc | Markdown in `planning/architecture/bridges/<surface>.md` | Platform-Infrastructure expert, engineering, future expert reviewers | End-to-end design of a surface bridge — event flow, auth, error paths, rate-limit handling, deployment shape |
| Surface RFC | Markdown in `planning/experts/agent-integration-platform/rfcs/RFC-####-<surface>.md` | All experts + Aaron/Andrey | Proposal and decision record for adding a new surface |
| Ship-point heuristic spec | Markdown in `planning/architecture/ship-points.md` | Agent-framework implementers, runtime | Signals, thresholds, calibration mechanism, override handling |
| Identity map entry | YAML entry in `planning/team/identity-map.yaml` | Bridge services, attribution resolver | Maps surface-native user ID → ava canonical identity |
| Auto-merge policy entries | YAML entries in `planning/governance/auto-merge-policy.yaml` | Bridge services, reviewer | Path patterns → required approvals / auto-merge conditions |
| Webhook security review | Markdown in `planning/architecture/bridges/<surface>-security-review.md` | Compliance, Platform-Infrastructure | OWASP baseline check per bridge — signature verification, token handling, log hygiene, error path redaction |
| OAuth scope justification | Markdown in `planning/architecture/bridges/<surface>-oauth.md` | Compliance, Aaron (app installer) | Each requested scope paired with the specific feature that needs it |
| Provider abstraction spec | Markdown in `planning/architecture/provider-abstraction.md` | Agent-framework, runtime implementers | `invoke()` shape, tier mapping, telemetry contract, portability guarantees |
| Bridge deployment spec | Markdown (or Terraform/gcloud commands) in `planning/architecture/bridges/<surface>-deploy.md` | Platform-Infrastructure, Andrey | Cloud Run config, IAM bindings, Secret Manager references, min-instances, scaling |
| Retro-log calibration note | Appended entry in `retro-log.md` | This expert, reviewers | Calibration data when ship-points, identity mapping, or surface behavior produces overrides |

---

## Format specifications

### Bridge architecture doc

Every bridge architecture doc includes:

- **Surface summary** — what platform, why chosen, who uses it
- **Event flow diagram** — sequence: external event → bridge receive → verify → identity resolve → agent invoke → response → ship-point detect → git write → response post
- **Auth model** — bot token scope, signing secret verification, user identity resolution
- **Error paths** — what happens when: signature fails, user unknown, agent errors, git write fails, rate limit hit
- **Deployment shape** — Cloud Run service name, region, min/max instances, service account, Secret Manager bindings
- **Open questions** — anything unresolved with explicit owner + trigger

### Surface RFC

```markdown
# RFC-####: Add <surface> as ava bridge

## Summary
One paragraph.

## Motivation
Concrete use case(s) with named team member(s).

## 5-axis evaluation
- Identity: [pass/fail + rationale]
- Attribution: [pass/fail + rationale]
- Security: [pass/fail + rationale]
- Compliance: [pass/fail + rationale]
- SDK: [pass/fail + rationale]

## Proposed architecture
Link to bridge architecture doc (draft).

## Open questions
...

## Decision
[Pending | Accepted YYYY-MM-DD | Rejected YYYY-MM-DD + reason]
```

### Identity map entry shape

```yaml
# planning/team/identity-map.yaml
U01ABCDEFG:  # Slack user ID (immutable)
  display_name: Vanessa Sleeper  # comment only, may change
  role: vanessa
  git_name: Vanessa Sleeper
  git_email: vanessa@cenahealth.com
  github_username: vanessa-cena
```

### Auto-merge policy entry shape

```yaml
# planning/governance/auto-merge-policy.yaml
rules:
  - id: session-logs-auto
    path: planning/session-logs/**
    auto_merge: always
    rationale: Append-only audit log; no manual review adds value
  - id: memory-writes
    path: planning/memory/**
    auto_merge: on_initiator_assent
    rationale: Initiator's conversation is the review
  - id: code-gated
    path: code/**
    require: [pr_review_human, ci_pass]
    rationale: Code changes affect runtime; human review required
```

### Commit trailer format

```
<commit subject>

<commit body>

Initiated-by: Vanessa (via Slack thread https://cenahealth.slack.com/archives/C0X/p1234)
Session-Log: 2026-04-15-14.md
Co-authored-by: ava-bot <ava-bot@cenahealth.com>
```

---

## Non-outputs

What this expert does not produce:

- Bridge implementation code (Platform-Infrastructure + engineering own)
- UX flows or conversational copy (UX Design Lead owns)
- Security policy standards (Compliance owns — this expert applies them)
- Runtime/agent-framework code (Agent-framework package owns)
- Skill/agent content (skill authors own)
