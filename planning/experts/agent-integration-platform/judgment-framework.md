# Judgment Framework — Agent Integration Platform

How this expert makes decisions when the textbook doesn't give a clear answer. Most integration decisions involve tradeoffs between surface fit, substrate purity, security posture, and team ergonomics.

---

## Core heuristics

### H1: Substrate over surface

When a surface-specific affordance would leak into ava's core substrate, prefer the substrate version and translate at the bridge boundary. The substrate is forever; surfaces come and go.

- Example: Slack reactions for PR approval. Don't add a `slack_reaction_approval` field to the thread-engine schema. Map the reaction to an ava-native approval event at the bridge layer.

### H2: Invariant writes, variant reads

Every surface can render the substrate differently (Slack shows a thread summary; IDE shows a diff). But all surfaces write through the same invariant schema: message, attribution, ship-point, commit. Diverge on read, converge on write.

### H3: No silent identity inference

If a surface-origin event can't be resolved to a known identity in `identity-map.yaml`, the bridge refuses to write. Silent inference is a security hole — a misattributed commit is worse than a rejected one.

### H4: Ship-point is the agent's call, not the surface's

Ship-points are detected from conversation content (ship/hold signals) not from surface events (thread timeout, channel activity). Keeping the judgment in the agent means the heuristic improves everywhere at once; keeping it in the bridge would require per-surface recalibration.

### H5: Portability tax is worth paying at the provider seam

Every temptation to call a provider-specific feature (Anthropic's prompt caching, Vertex's grounding) through the raw SDK leaks provider assumptions into the runtime. The tax of going through the `invoke()` abstraction is real but small; the cost of re-abstracting later is large.

### H6: Auto-merge is policy, not code

Auto-merge decisions live in `planning/governance/auto-merge-policy.yaml`, not in bridge code. The bridge reads and enforces. Changes require reviewing the yaml, which is visible and auditable. This keeps the policy human-readable and prevents accidental scope creep via code edits.

---

## Decision trees

### Should this surface event trigger a ship-point?

```
Event received → Agent determines response
  ↓
Response produces a coherent artifact?
  ├── No → Continue conversation, no ship
  └── Yes → Check ship signals
        ↓
      Strong ship signal (explicit assent, "ship it", "PR this")?
        ├── Yes → Check artifact type
        │         ↓
        │       Type allowed on this surface per auto-merge policy?
        │         ├── Yes → Ship
        │         └── No → Block + explain
        └── No → Check hold signals
              ↓
            Hold signals present (exploratory, "what if", half-draft)?
              ├── Yes → Continue conversation
              └── Neither → Ask initiator: "Ready to PR?"
```

### Should a new surface be supported?

```
Surface proposed (e.g., Telegram, SMS, voice)
  ↓
Does any team member have a concrete use case?
  ├── No → Defer (no speculative surfaces)
  └── Yes → Evaluate along 5 axes
        ↓
      1. Identity: can user be mapped to ava identity map reliably?
      2. Attribution: can writes carry unambiguous attribution trailers?
      3. Security: does platform meet or allow meeting OWASP webhook/OAuth baseline?
      4. Compliance: does platform support BAA or exclude PHI by design?
      5. Bolt-equivalent SDK: does a maintained, typed SDK exist?
        ↓
      All 5 pass → RFC for bridge design
      Any fail → Block until resolved, document rejection
```

### Provider-specific feature vs portability tax

```
Want to use provider-specific capability (e.g., prompt caching)
  ↓
Can it be expressed through the invoke() abstraction without leaking?
  ├── Yes → Add to abstraction, available to all providers
  └── No → Is it load-bearing for a deliverable?
        ├── No → Skip, stay portable
        └── Yes → Add as optional capability flag; document that
                  providers without support fall back gracefully
```

---

## Worked examples

### Example 1 — Slack reaction for PR approval

**Situation:** The `#ava-changes` channel receives PR summary posts. Reviewers want a low-friction way to approve.

**Options:**
- A: Add `slack_reaction` field to PR approval schema
- B: Map reaction to ava-native `approval` event at bridge layer

**Reasoning:** H1 (substrate over surface). The PR approval concept is substrate-level and used by auto-merge policy. If we added Slack-specific fields, adding Telegram or custom UI later would fork the schema.

**Decision:** B. Bridge listens for `reaction_added` on PR summary messages, resolves Slack user to identity, calls ava's approval API with generic fields. GitHub's native review approval is the source of truth; Slack is a UX convenience for triggering it.

### Example 2 — Vanessa pastes a Claude.ai link into Slack

**Situation:** Vanessa sometimes drafts with Claude.ai directly and shares the conversation link in her Slack thread to give context.

**Options:**
- A: Ignore links; treat Slack-native content as the only source
- B: Fetch the Claude.ai page and ingest its content
- C: Recognize the link as a context pointer, prompt Vanessa to paste relevant content

**Reasoning:** B is high-risk (auth, rate limits, privacy). A is useful but loses context. C is the surface-appropriate affordance — treats the external conversation as a reference Vanessa curates.

**Decision:** C for now. Revisit if link-fetching becomes a repeated ask with a clear pattern. Documented as an open retro item.

### Example 3 — A GitHub App vs. bot user

**Situation:** Choosing ava's GitHub identity.

**Options:**
- A: Bot user (ava-bot) — one org seat, standard attribution
- B: GitHub App — installation-scoped, finer permission control, no seat cost

**Reasoning:** For 3 people + 1 bot, bot user simplicity beats App granularity. GitHub App wins at ~20 seats where per-user permissions matter more than per-repo permissions.

**Decision:** Bot user. Aaron's call to confirm. Revisit when team exceeds ~20 or when permission boundaries across repos diverge.

### Example 4 — Model-tier bypass for cost

**Situation:** A teammate proposes defaulting all Vanessa's Slack sessions to Haiku to control cost.

**Reasoning:** Vanessa's work includes investor decks (judgment-heavy) and quick admin questions (classification-light). Surface-wide tier override ignores the skill/agent frontmatter declarations that already route tier per task. Per model-routing rule, "If you find yourself escalating constantly in a domain, that domain's default tier was wrong — fix the assignment, don't keep escalating." Same logic in reverse: if costs are high, fix the tier declarations on the expensive skills, don't bypass the system.

**Decision:** Reject the surface-wide override. Propose audit of which skills Vanessa triggers most and whether their tier declarations match stakes.

---

## Anti-patterns to catch

- **Surface-specific fields in substrate schemas.** Smells like "easier this way" but costs compound.
- **Identity inference from email or display name.** Slack IDs are cheap to store; inference is never worth the security risk.
- **Ship-point detection in bridge code.** The agent should own the judgment; bridge should only carry signals.
- **Provider calls outside the `invoke()` abstraction.** Every bypass compounds portability tax at refactor time.
- **Auto-merge rules hardcoded in bridge.** Move to yaml. Every time.
- **"We'll add a webhook later" deferring signature verification.** Never. First thing, every time.
