# Quality Criteria — Agent Integration Platform

Testable definitions of what "good" looks like for each output type. Criteria must be observable, not subjective.

---

## Bridge architecture doc

- [ ] Event flow diagram covers happy path and all named error paths (signature fail, unknown user, agent error, git write fail, rate limit)
- [ ] Auth model names specific tokens, specific scopes, and specific Secret Manager resource IDs
- [ ] Every external service call has a declared timeout and retry policy
- [ ] Error paths specify user-visible behavior (does the user see an error? a silent drop? a retry notification?)
- [ ] Cloud Run service config is spelled out: region, service account, min/max instances, timeout, concurrency
- [ ] No PHI handling path exists unless the surface has a BAA (verified against Compliance)
- [ ] Rate-limit handling is explicit — what does backpressure look like from the user's perspective?

## Surface RFC

- [ ] 5-axis evaluation is explicit — each axis has a verdict and one-sentence rationale
- [ ] Motivation cites a named team member with a specific use case (no hypothetical users)
- [ ] At least one rejection path is considered — what would cause this surface to fail in 6 months?
- [ ] Open questions carry owners and resolution triggers

## Identity map entries

- [ ] Keyed on Slack user ID (or equivalent immutable identifier for other surfaces)
- [ ] `git_email` matches the email on the GitHub account or matches org-standard format
- [ ] No PHI in display_name or any field
- [ ] Role matches an allowed value (`aaron`, `andrey`, `vanessa`, future additions documented)

## Auto-merge policy entries

- [ ] Path pattern is unambiguous (no overlap with another rule, or overlap is explicitly resolved)
- [ ] Rationale names the specific risk the rule mitigates or the specific efficiency it creates
- [ ] Every rule either auto-merges or requires review — no rules left in indeterminate state
- [ ] Wildcard rules are reviewed with extra scrutiny (`**` can auto-merge memory, not code)

## Webhook security review

- [ ] Signature verification is implemented and tested (negative test: tampered payload rejected)
- [ ] Timestamp replay window documented and tested (stale timestamp rejected)
- [ ] Secret storage confirmed to be Secret Manager, not env var, not checked-in config
- [ ] Log redaction verified — sample error log produced and checked for token leakage
- [ ] Error response does not leak internal state (e.g., "secret not found" vs. "auth failed")

## Ship-point heuristic spec

- [ ] Ship signals and hold signals both enumerated
- [ ] Ambiguity handling defined (agent asks rather than silently chooses)
- [ ] Calibration mechanism named (how do overrides feed back?)
- [ ] False-ship rate is a tracked metric, not just a concern

## Commit trailer output

- [ ] Every bot-initiated commit carries `Initiated-by:` trailer
- [ ] Thread URL in trailer resolves to the actual Slack/surface thread
- [ ] `Session-Log:` trailer matches an existing file in `planning/session-logs/logs/`
- [ ] Co-authored-by line present for attribution visibility in GitHub UI

## Provider abstraction

- [ ] Every LLM call in the codebase routes through the `invoke()` function (grep check)
- [ ] `code/config/model-tiers.yaml` is the only place model IDs appear
- [ ] Provider-specific features are behind capability flags, not direct calls
- [ ] Session log emits `model` and `tier` fields on every session

## Shared with other experts

These concerns are shared — this expert participates but another expert owns the standard:

| Concern | Owner expert | This expert's contribution |
|---|---|---|
| HIPAA compliance | Compliance | Surfaces PHI implications of every bridge; excludes non-BAA surfaces from PHI paths |
| Infrastructure security | Platform-Infrastructure | Applies their IAM, Secret Manager, VPC guidance to bridge deployments |
| Conversational UX | UX Design Lead | Translates their surface-specific design intent into bridge affordances |
| Non-dev copy | Plain Language Positioning (cross-cutting) | PR summaries posted to `#ava-changes` use their voice standards |
