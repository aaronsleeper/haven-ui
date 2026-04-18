# Domain Knowledge — Agent Integration Platform

What this expert must know to design surface-to-substrate bridges for ava: a HIPAA-compliant, agent-first platform where 3 founders (plus future team) interact from different origins and expect coherent shared state.

---

## Slack Platform

| Knowledge area | What specifically | Source | Shelf life |
|---|---|---|---|
| Slack Bolt SDK | Official framework for Slack apps. Handles event verification, OAuth, Socket Mode, message/thread handling. TypeScript-native. Preferred over raw Events API for new builds. | [slack.dev/bolt-js](https://slack.dev/bolt-js) | ~1 year |
| Events API vs Socket Mode | Events API: public HTTP endpoint, signed payloads, production-grade, requires public URL. Socket Mode: WebSocket connection, no public endpoint, simpler dev, scope-limited tokens (`xapp-…`). Recommend Socket Mode for dev, HTTP Events for production. | Slack API docs | ~1 year |
| OAuth scopes | Principle of least privilege: `app_mentions:read`, `chat:write`, `channels:history`, `channels:read`, `groups:history`, `im:history`, `reactions:read`, `users:read`. Add scopes only when a specific feature requires them; audit on every release. | Slack API docs | Stable |
| User ID immutability | `U`-prefixed user IDs are stable for the lifetime of the workspace member. Display names, emails, avatars can change — never key on them. | Slack API docs | Stable |
| Thread semantics | `thread_ts` is the timestamp of the parent message and the canonical thread identifier. Child messages carry both `ts` (own) and `thread_ts` (parent). A "thread" is always identified by `(channel_id, thread_ts)`. | Slack API docs | Stable |
| Signing secret verification | Every incoming HTTP event must verify the `X-Slack-Signature` header against the signing secret within 5 minutes of the `X-Slack-Request-Timestamp`. Bolt SDK handles this; bypass only for Socket Mode which uses token auth instead. | Slack API docs | Stable |
| 3-second response SLA | Slack requires ack within 3 seconds. Long-running work must return an immediate ack (`response_type: in_channel`) and post follow-ups via `chat.postMessage`. Cloud Run cold start (~1-2s) is marginal — use min-instances ≥ 1 for production. | Slack API docs | Stable |
| Rate limits | Most methods tier 2 (20 req/min). `chat.postMessage` tier 4 (100+/min). Respect `Retry-After` on 429s. Batch when possible; debounce notifications to `#ava-changes`. | Slack API rate-limit docs | ~1 year |
| Reaction events | `reactions:read` scope enables listening for `reaction_added` / `reaction_removed`. Canonical approval mechanism for PR posts in `#ava-changes` (e.g., ✅ = approve, ❌ = reject, 👀 = investigating). | Slack API docs | Stable |

## LLM provider abstraction

| Knowledge area | What specifically | Source | Shelf life |
|---|---|---|---|
| Anthropic SDK | `@anthropic-ai/sdk` — canonical client for Claude. Supports Vertex AI via `@anthropic-ai/vertex-sdk`. Interface: `messages.create({ model, max_tokens, messages, tools })`. | [docs.anthropic.com](https://docs.anthropic.com) | ~1 year |
| Vertex AI for Claude | GCP-hosted Claude via Vertex AI. HIPAA-eligible when covered under GCP BAA. Same request/response shape as direct Anthropic API with auth swapped for GCP service account. Chosen by AD-02. | GCP Vertex AI docs | ~1 year |
| Model tier mapping | Tier → model ID is a runtime config, not hardcoded. File: `code/config/model-tiers.yaml`. Skills/agents declare tier in frontmatter; runtime resolves. Swap = change the yaml. | Project CLAUDE.md model-routing rule | Until portability refactor |
| Provider interface shape | `invoke(prompt, tier, tools, context) → response`. Provider implementations (anthropic-vertex, anthropic-direct, future) implement this interface. Portability tenant requires all provider-specific code to be confined to this layer. | Project architecture | Stable (load-bearing) |
| Telemetry for model traceability | Every session log emits `model: <id>` alongside `tier: <name>`. Enables "what produced this output" forensics when model behavior changes. | Project session-log convention | Stable |

## Git integration (GitHub / Octokit)

| Knowledge area | What specifically | Source | Shelf life |
|---|---|---|---|
| Octokit.js | Official GitHub SDK. Handles REST + GraphQL. Auth via personal access token (PAT), GitHub App, or deploy key. Used for branch creation, commit, PR open, review state, merge. | [octokit.github.io](https://octokit.github.io) | ~1 year |
| Bot user vs GitHub App | Bot user (ava-bot) = simpler, costs one org seat, standard attribution. GitHub App = more permissions granularity, installation-scoped, no seat cost. For 3-person team, bot user is simpler; revisit at ~20 seats. | GitHub docs | ~1 year |
| Commit attribution trailers | Git commit messages support trailers (key-value pairs at end). Canonical: `Co-authored-by: Name <email>`. Custom: `Initiated-by: Vanessa (via Slack thread <link>)` — widely used for automation attribution. Trailers appear in GitHub UI and `git log --show-signature`. | Git docs, GitHub conventions | Stable |
| Branch protection + bot PRs | Protected `main` requires status checks + human approval. Bot PRs follow same rules — no bypass. Auto-merge uses GitHub's native auto-merge (`gh pr merge --auto`) which waits for checks + approvals before merging. | GitHub branch protection docs | Stable |
| GitHub auto-merge | Opt-in per PR. Once enabled, PR merges automatically when all required checks pass and required approvals are met. Combines with ava's auto-merge-policy.yaml for declarative control. | GitHub auto-merge docs | ~1 year |

## Session capture conventions

| Knowledge area | What specifically | Source | Shelf life |
|---|---|---|---|
| Session log path | `planning/session-logs/logs/YYYY-MM-DD-HH.md`. Established convention in project-ava/code/CLAUDE.md. Commit trailer `Session-Log: <filename>` ties diffs to reasoning. | project-ava CLAUDE.md | Stable |
| Transcript format | Markdown with: initiator, surface, thread URL (if applicable), model + tier used, message log (timestamped), agent tool calls summary, ship-points detected. Human-readable, searchable via grep. | Established session-log pattern | Stable |
| Attribution header | Every session log opens with a frontmatter block: `initiator`, `surface`, `slack_thread` (if applicable), `started_at`, `model`, `tier`. Enables programmatic filtering. | New convention | Draft |
| Append-only discipline | Session logs are never edited after close. Corrections go in a new session log that references the prior. Immutability underpins audit trail. | Audit-trail principle | Stable |

## Ship-point detection

| Knowledge area | What specifically | Source | Shelf life |
|---|---|---|---|
| Ship signals | (1) explicit assent after artifact produced ("yeah send that", "ship it", "looks good"); (2) coherent code change with passing checks; (3) distinct new memory fact; (4) explicit ask ("PR this"). Multiple signals increase confidence. | Design conversation 2026-04-15 | Draft |
| Hold signals | Exploratory phrasing ("what if we…"), options still open, half-drafts, conditional approvals ("ship it after we check X"). Agent asks when ambiguous rather than shipping. | Design conversation 2026-04-15 | Draft |
| Calibration via overrides | When human rejects a ship (reverts PR, closes without merge, comments "not yet"), treat as calibration signal. Track false-ship rate per surface and per artifact type. | Interaction-retro pattern | Stable principle |
| Long-running drafts | Multi-day artifacts (investor decks, plan drafts) use GitHub draft PRs that update as work progresses. Initiator marks "ready for review" explicitly — this is itself a ship-point. | Design conversation 2026-04-15 | Draft |

## Identity mapping across surfaces

| Knowledge area | What specifically | Source | Shelf life |
|---|---|---|---|
| Canonical identity map | `planning/team/identity-map.yaml`. Each entry: Slack user ID (`U…`) as key; fields `role`, `display_name`, `git_name`, `git_email`, `github_username`. Display name is comment only; IDs are the stable key. | Decision 2026-04-15 | Stable |
| Commit author conventions | For bot-initiated commits: author = `ava-bot <ava-bot@cenahealth.com>`; trailer `Initiated-by: <role> (via <surface> <link>)` carries the human. For directly-attributed commits: author = the human; bot acts as co-author. | Decision 2026-04-15 | Draft |
| Unknown initiator handling | If an event comes from a Slack user ID not in the map, bridge refuses to write — replies in-thread with "User not in team registry, ask Aaron or Andrey to add you." This is a gate; never infer identity. | Security posture | Stable |
| Privacy posture | Identity map is config, not secret. Names and emails already live in git commit history. Not PHI. Safe in planning repo. | HIPAA scope analysis | Stable |

## Webhook & OAuth security

| Knowledge area | What specifically | Source | Shelf life |
|---|---|---|---|
| Slack signing secret verification | Verify every HTTP Events request. Reject if timestamp >5 min old (replay protection) or signature mismatch. Bolt SDK handles; for custom code, follow Slack's HMAC-SHA256 spec. | Slack API docs, OWASP webhook guide | Stable |
| Token storage | All external tokens (Slack bot token, GitHub PAT, LLM keys) live in GCP Secret Manager. Cloud Run service account gets `roles/secretmanager.secretAccessor` on specific secret resources, not wildcard. Rotate quarterly or on exposure. | GCP Secret Manager docs, compliance posture | Stable |
| OAuth state parameter | When implementing user-OAuth flows (deferred to team > 10), always use `state` parameter with CSRF-random value. Validate on callback. | OWASP OAuth guide | Stable |
| Log hygiene | Never log tokens, signing secrets, or full request payloads containing them. Redact at framework level. Slack message content may be logged in session transcripts but never secrets. | Security posture | Stable |

## Multi-surface coherence

| Knowledge area | What specifically | Source | Shelf life |
|---|---|---|---|
| thread-engine adapter pattern | `packages/thread-engine` exposes pluggable storage adapters. Slack bridge implements an adapter that maps Slack thread ↔ ava thread. All surfaces ultimately produce ava threads with consistent message schema. | project-ava packages/thread-engine | ~1 year |
| Surface-invariant vs surface-specific | Invariant: message content, attribution, timestamps, tool calls, ship-points, commits. Specific: UI rendering, input modality, notification behavior, attachment handling. Bridge translates specific → invariant at the boundary. | Design principle | Stable |
| Cross-surface continuation | A thread started in Slack should be resumable from IDE (and vice versa) if both surfaces read from the same thread-engine state. Mechanism: thread URL / ID shared out-of-band (e.g., Vanessa pastes the ava thread link into VSCode). | Design principle | Draft |

## Reference sources

| Source | Domain | Trust level | When to consult |
|---|---|---|---|
| Slack API docs (api.slack.com) | All Slack platform behavior | Authoritative | Any Slack-specific decision |
| Slack Bolt SDK docs (slack.dev/bolt-js) | Framework patterns, event handling | Authoritative | Implementing bridge code |
| Anthropic SDK docs | Claude API shape, Vertex integration | Authoritative | Provider abstraction design |
| Octokit.js docs | GitHub API integration | Authoritative | Git operations from bridge |
| OWASP Webhook Security Cheat Sheet | Webhook security baseline | Authoritative | Any new webhook endpoint |
| OWASP OAuth Cheat Sheet | OAuth flow security | Authoritative | User-OAuth flow design (deferred) |
| GitHub branch protection + auto-merge docs | PR merge mechanics | Authoritative | Auto-merge policy implementation |
| Project CLAUDE.md (vault + project-ava) | Current rules (model routing, identity, planning) | Authoritative | Any decision that touches project convention |

---

## Assumptions index

| # | Assumption | Basis | Validates by | Status |
|---|---|---|---|---|
| A1 | Socket Mode for dev, HTTP Events for production | Slack docs + Cloud Run cold-start profile | First production deploy | unvalidated |
| A2 | Slack Bolt SDK (TypeScript) as framework | Official, industry standard, matches existing TS monorepo | Implementation begins | unvalidated |
| A3 | Bot user (ava-bot) for GitHub attribution, not GitHub App | 3-person team, simpler for now | Aaron's decision (pending) | unvalidated |
| A4 | Session log path convention (planning/session-logs/logs/YYYY-MM-DD-HH.md) extends to Slack-origin sessions unchanged | Consistency with existing CLAUDE.md convention | First Slack session lands | unvalidated |
| A5 | Ship-point heuristics (explicit assent + artifact coherence) are sufficient for memory-write first slice | No empirical data yet; will calibrate from retro | First 20 Slack sessions | unvalidated |
| A6 | Unknown Slack user IDs blocked at bridge (no inference) | Security posture | First external-user event observed | unvalidated |
