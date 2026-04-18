# Task Routing — Agent Integration Platform

Determinism assessment and model tier assignment for each task this expert performs.

---

## Determinism assessment

Tasks that should be extracted to deterministic utilities rather than reasoned about:

| Candidate | Why deterministic | Extraction status |
|---|---|---|
| Webhook signature verification | Zero ambiguity, security-critical, computable | Already deterministic (Bolt SDK handles) |
| Commit trailer formatting | Same output shape every time for same input type | Extract when first bridge ships — util in `code/services/slack-bridge/lib/` |
| Identity resolution (Slack user ID → ava identity) | Lookup in a yaml file, zero judgment | Deterministic by design — this expert never "judges" identity |
| Auto-merge policy evaluation (path → rule → decision) | Policy-as-code, deterministic match | Deterministic in bridge; expert reasons about policy *authoring* not *evaluation* |
| Session log frontmatter generation | Fixed schema, template-fillable | Extract when first bridge ships |
| OAuth scope audit (compare requested vs used) | Set diff, deterministic | Extract when first bridge ships; script in `code/scripts/` |
| Rate-limit backoff calculation | Formula from `Retry-After` header | Deterministic in SDK — no expert reasoning needed |

**Extraction principle:** When a task shows zero ambiguity + repeated identical structure, move it out of reasoning and into code. This expert then shifts from doing the task to specifying the function.

---

## Model tier routing

| Task | Tier | Rationale | Extraction status |
|---|---|---|---|
| Design a new bridge architecture (novel surface) | Deep (Opus) | Novel judgment, cross-domain synthesis, high-stakes design decision | Not extractable |
| Write a surface RFC | Deep (Opus) | Same as above + structured argument for/against | Not extractable |
| Evaluate 5-axis for a proposed surface | Standard (Sonnet) | Applied framework with known axes | Not extractable |
| Revise ship-point heuristic spec from retro data | Deep (Opus) | Pattern synthesis from accumulated overrides, affects all surfaces | Not extractable |
| Draft auto-merge policy rule | Standard (Sonnet) | Applied policy framework; judgment needed on scope/risk | Not extractable |
| Audit an existing auto-merge policy for collisions | Light (Haiku) | Set analysis; approaches deterministic | Candidate for extraction (rules parser + collision detector) |
| Webhook security review for an existing bridge | Standard (Sonnet) | Applied OWASP checklist with interpretation | Not extractable (interpretation matters) |
| OAuth scope justification | Standard (Sonnet) | Pair each scope to a feature; light reasoning | Not extractable |
| Validate commit trailer format on a sample commit | Light (Haiku) | Regex + field presence | Candidate for extraction (linter) |
| Respond to "should we add <feature> from provider X?" | Deep (Opus) | Portability-tenant tradeoff, multi-factor reasoning | Not extractable |
| Triage retro log for ship-point calibration signals | Standard (Sonnet) | Pattern match across recent entries | Not extractable until corpus is large |
| Answer bridge-operations questions ("why is X event being rejected?") | Standard (Sonnet) | Lookup + reasoning across domain knowledge | Not extractable |
| Generate a deployment spec from architecture doc | Standard (Sonnet) | Template-heavy with some judgment on resource sizing | Candidate for partial extraction (template + judgment layer) |
| Emit session log frontmatter from event metadata | Light (Haiku) → deterministic | Schema fill from structured input | Extract on first bridge |

---

## Progression expectations

Tasks that start at a higher tier often migrate downward as patterns solidify:

- Novel bridge design: Opus → Sonnet once the template solidifies across 2+ surfaces
- Ship-point heuristic revision: Opus → Sonnet once the retro loop produces reliable signal vocabulary
- 5-axis evaluation: Sonnet → Haiku if axes become deterministic checks (unlikely without loss of judgment)

**Upgrade signals:** If outputs at Sonnet require frequent Opus rework (rejected by Aaron, missed by reviewers), upgrade the task's default tier. Downgrade signals: Opus outputs that Sonnet could have produced with the same quality — log in retro and downgrade.

---

## Context loading

For selective loading (per [expert-spec.md](../expert-spec.md) size targets):

| Activity | Layers to load |
|---|---|
| Design new bridge | README + essential-briefing + domain-knowledge + judgment-framework + output-contract + task-routing |
| Review a PR that touches bridge code | README + essential-briefing + quality-criteria + judgment-framework |
| Respond to Aaron's RFC question | README + essential-briefing + domain-knowledge (relevant section) + judgment-framework |
| Self-assessment during `/expert-update` | README + essential-briefing + quality-criteria + retro-log + freshness-triggers |
| Handle a bridge-ops question | README + essential-briefing + domain-knowledge (relevant section) |
