# Freshness Triggers — Agent Integration Platform

External events or changes that invalidate part of this expert's knowledge. When a trigger fires, health downgrades and the affected domain knowledge is re-researched.

---

## Platform-level triggers

| Trigger | Source | Check method | Expected frequency | Affected knowledge |
|---|---|---|---|---|
| Slack Bolt SDK major version bump | slack.dev release notes | Check on `/expert-update` | ~yearly | Slack platform section, SDK-specific code examples |
| Slack API deprecation notice | Slack API changelog | Email subscription to developer list | Quarterly | OAuth scopes, event types, rate limits |
| Anthropic SDK breaking change | @anthropic-ai/sdk releases | Check on `/expert-update` | ~quarterly | Provider abstraction, model tier config |
| Vertex AI Claude availability change (new model, deprecation) | GCP Vertex AI release notes | Check on `/expert-update` | Monthly | Model tier config, model-tiers.yaml defaults |
| GitHub API / Octokit breaking change | GitHub changelog, Octokit releases | Check on `/expert-update` | ~yearly | Git integration knowledge, branch protection behavior |
| GCP Cloud Run feature change (cold start, scaling, networking) | GCP release notes | Check on `/expert-update` | Quarterly | Deployment shape, auth model |

## Compliance / security triggers

| Trigger | Source | Check method | Expected frequency | Affected knowledge |
|---|---|---|---|---|
| GCP BAA service list change | Google HIPAA compliance page | Check on `/expert-update` | ~quarterly | Which surfaces can carry PHI; bridge eligibility |
| OWASP Webhook Security Cheat Sheet update | OWASP cheat sheet repo | Check on `/expert-update` | ~yearly | Security review checklist |
| Slack workspace permission / security policy change | Slack admin / Aaron | Notification from Aaron | Event-driven | OAuth scope policy, app installation posture |
| Internal compliance policy update (Compliance expert) | Compliance retro log | `/expert-update` dependency walk | Event-driven | PHI handling in bridges, audit log requirements |

## Internal triggers

| Trigger | Source | Check method | Expected frequency | Affected knowledge |
|---|---|---|---|---|
| New team member added | Aaron / Andrey notifies | Human signal | Event-driven | Identity map; possible role/permission model update if new role type |
| Team member departure | Aaron / Andrey notifies | Human signal | Event-driven | Identity map entry retirement; token rotation for any credentials they had access to |
| New surface proposed (Telegram, voice, web) | Aaron, Andrey, or Vanessa | Human signal | Event-driven | Triggers RFC process, new bridge architecture doc |
| Ship-point false-positive cluster | Retro log interaction summaries | Self-assessment during `/expert-update` | Continuous monitoring | Ship-point heuristic spec; may trigger signal recalibration |
| Auto-merge policy rule produces unexpected merge | Git log audit | Self-assessment | Event-driven | Auto-merge policy rule revision |
| `invoke()` abstraction bypassed in PR | Code review or grep audit | CI lint check (future) | Continuous | Reinforce abstraction use in domain-knowledge + judgment-framework |

## Assumption validation triggers (one-time)

Each row fires once; when it does, the corresponding assumption in `domain-knowledge.md` assumptions index moves from `unvalidated` to `validated` or `revised`.

| Assumption | Validates by |
|---|---|
| A1 (Socket Mode dev / HTTP production) | First production deploy |
| A2 (Bolt SDK TypeScript) | Implementation begins in `code/services/slack-bridge/` |
| A3 (Bot user vs GitHub App) | Aaron's explicit decision |
| A4 (Session log path for Slack) | First Slack-originated session lands in repo |
| A5 (Ship-point heuristics sufficient for memory writes) | First 20 Slack sessions accumulate |
| A6 (Unknown user block) | First external-user event observed |

## Sweep cadence

- **Monthly:** Slack API changelog, Vertex AI release notes, OWASP updates
- **Quarterly:** SDK version checks, GCP BAA service list, Compliance expert cross-check
- **Event-driven:** All internal triggers fire from Aaron/Andrey signals or retro log patterns
- **On-demand:** When a new surface is proposed, run full 5-axis evaluation before RFC
