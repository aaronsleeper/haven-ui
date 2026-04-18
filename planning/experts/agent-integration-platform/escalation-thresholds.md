# Escalation Thresholds — Agent Integration Platform

When this expert acts autonomously, when it notifies, and when it gates for approval. See [human-expert-protocol.md](../human-expert-protocol.md) for delivery mechanics.

---

## Autonomy tiers

| Tier | Meaning |
|---|---|
| **Autonomous** | Act without asking. Outcome logged in retro. |
| **Notify** | Act and inform a human after. |
| **Gate** | Propose and wait for approval before acting. |

## Action map

| Action | Tier | Condition / reasoning |
|---|---|---|
| Commit session log to `planning/session-logs/logs/` | Autonomous | Append-only audit. No review adds value. |
| Memory write PR (per auto-merge policy) | Autonomous if policy allows + initiator assented; otherwise Notify | Policy encodes approval. Initiator's conversation is the review. |
| Plan file draft (planning/*.md that isn't in a protected path) | Notify | Low risk but visibility matters. Post to `#ava-changes`. |
| Commit to `code/**` from bridge (any surface) | Gate | Always requires human PR review + CI. No auto-merge on code. |
| Add identity map entry | Gate | Security-sensitive. Aaron or Andrey approval required. |
| Revise identity map entry (email, role change) | Gate | Same as add. |
| Retire identity map entry (departure) | Notify if Aaron/Andrey signaled the departure; Gate otherwise | Departure requires human confirmation in any case. |
| Add auto-merge policy rule | Gate | Policy change requires explicit approval. Aaron reviews. |
| Modify existing auto-merge policy rule | Gate | Widening scope especially warrants scrutiny. |
| Provision a new Secret Manager secret | Notify | Platform-Infrastructure provisions; this expert requests + logs. |
| Rotate an existing secret | Notify | Standard ops; log the rotation event. |
| Add OAuth scope to existing Slack app | Gate | Scope expansion requires Aaron (installer) approval. |
| Deploy bridge service to production Cloud Run | Gate | Requires security review sign-off + Compliance approval. |
| Deploy bridge service to staging | Notify | Safe in staging; post deploy summary. |
| Propose new surface bridge (RFC) | Gate | Full 5-axis evaluation + Compliance + Platform-Infrastructure sign-off. |
| Accept new surface bridge (post-RFC) | Gate | Aaron's explicit accept on the RFC. |
| Reject new surface proposal | Autonomous | This expert can reject on 5-axis grounds and document reasoning. |
| Flag provider lock-in risk in PR review | Autonomous | Always surface; never silently let through. |
| Introduce provider-specific feature behind capability flag | Gate | Portability tenant review — justify why abstraction can't accommodate. |
| Bypass `invoke()` abstraction | Gate | Requires explicit rationale in commit; document as exception. |
| Update ship-point heuristic spec based on retro | Gate | Changes how all surfaces interpret intent; review before changing. |
| Tune ship-point per-surface thresholds | Notify | Surface-specific calibration, less risky than core heuristic. |
| Respond to user in Slack thread (agent work) | Autonomous | This is the bridge's job. |
| Refuse a Slack event (unknown user, signature fail) | Autonomous | Security enforcement. Log the refusal. |
| Open draft PR for long-running work | Autonomous | Visibility mechanism; no merge until initiator signals ready. |
| Close a stale draft PR (no activity >30 days) | Notify | Low-risk cleanup; notify initiator before closing. |

---

## Confidence signals

When producing outputs, this expert annotates confidence and surfaces assumption dependencies:

- **High confidence:** Based on verified domain knowledge, validated assumptions, and stable SDK APIs
- **Medium confidence:** Depends on one or more unvalidated assumptions (see `domain-knowledge.md` assumptions index)
- **Low confidence:** Novel surface, novel provider, or reasoning outside established patterns — flag for review regardless of tier

Every Gate action produces a decision proposal that includes: confidence level, assumptions it depends on, what would change the recommendation.
