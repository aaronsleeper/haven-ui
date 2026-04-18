# Risk Register — Agent Integration Platform

Known failure modes ranked by likelihood × impact. Current mitigations and residual risk. Reviewed on every `/expert-update` and after incidents.

---

## Risk matrix

| # | Risk | Likelihood | Impact | Mitigations | Residual risk |
|---|---|---|---|---|---|
| R1 | Secret leakage via logs or error messages | Medium | High (credential exposure → unauthorized access) | Redaction at framework level; log hygiene in quality criteria; Secret Manager with IAM scoping; rotation policy; no secrets in env vars | Low — depends on discipline during custom error-path code |
| R2 | Identity spoofing (unverified Slack event) | Low | Critical (misattributed commits → audit failure → compliance risk) | Bolt SDK enforces signature verification; reject events older than 5 min; no identity inference outside map | Very low at bridge layer; higher if custom event handlers added |
| R3 | Runaway ship-points (agent PRs too aggressively) | Medium | Medium (noise in `#ava-changes`, reviewer fatigue, possible bad merges on auto-merge paths) | Explicit hold signals; ambiguity asks the user; false-ship rate tracked in retro; auto-merge policy scopes what can land without review | Medium — calibration data doesn't exist yet; will improve with retro feedback |
| R4 | Rate-limit cascading failures | Medium | Medium (Slack messages dropped, user confusion) | Respect `Retry-After`; backoff on 429; debounce `#ava-changes` notifications; Cloud Run concurrency limits | Medium — depends on usage patterns we can't predict |
| R5 | Provider lock-in creep breaks portability tenant | Medium | High (violates company-level stance; expensive to refactor) | All LLM calls through `invoke()`; CI lint check (future) to flag raw SDK usage; provider-specific features behind capability flags | Medium — tempting shortcuts under deadline pressure; requires vigilant review |
| R6 | PHI leaks into non-BAA surface | Low | Critical (HIPAA breach, reportable) | Compliance dependency; no PHI rendering in Slack by design; content filters on bridge output (future); surface-level annotation of PHI-safe vs PHI-unsafe | Low if Compliance + UX discipline holds; higher if new surfaces added without re-audit |
| R7 | Identity map staleness (departed member still has access) | Low | High (unauthorized access post-departure) | Team-change freshness trigger; quarterly audit; token rotation on departure; GitHub org membership revocation | Low — manual process, depends on Aaron/Andrey signaling departures promptly |
| R8 | Bridge outage blocks company operations | Medium | Medium (Vanessa can't reach ava; workaround is IDE access she doesn't have) | Cloud Run auto-restart; min-instances ≥ 1 for production; fallback IDE path exists for Aaron/Andrey; documented manual escalation to Andrey's OpenClaw install during outage | Medium — single-bridge dependency; multi-region deferred |
| R9 | Slack workspace admin changes policy that breaks bot | Low | Medium (bridge loses access; need reinstall or scope re-approval) | Aaron or Andrey maintain workspace admin; change notifications from Slack admin email | Low — small workspace, changes are intentional |
| R10 | Commit attribution trailer format drift across bridges | Low | Low (audit queries miss events) | Output contract defines canonical format; linters on bot commits (future) | Low — contract enforces discipline |
| R11 | Auto-merge policy rule collision (two rules match same path, different decisions) | Medium | Medium (unexpected merge behavior) | Policy validation on load (bridge refuses to start if rules conflict); quality-criteria demands unambiguous paths | Low once validation exists; medium until then |
| R12 | New surface added without full 5-axis evaluation | Low | High (security/compliance gap) | RFC process; Compliance + Platform-Infrastructure sign-off hard gate; this expert's escalation thresholds enforce gating | Low if process followed; higher under time pressure |

---

## Highest-stakes decisions

Decisions this expert makes that warrant particular care:

- **Accepting a new surface.** Once a bridge ships, retiring it costs real effort. Every new surface expands attack surface, compliance scope, and identity-mapping maintenance.
- **Changing the provider abstraction shape.** Ripples through agent-framework, every skill, every session log. Breaking changes require coordinated refactor.
- **Changing auto-merge policy.** Widening the policy is one-way in practice — easy to add rules, hard to tighten once teammates rely on auto-merge cadence.
- **Identity map entry for a non-founding member.** First non-founder entry is the one that proves (or breaks) the security model — review with extra scrutiny.
- **Adding a raw-SDK escape hatch for a provider-specific feature.** Every one is a compromise to the portability tenant; document explicitly and gate behind capability flag.
