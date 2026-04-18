# Task Routing

## Tasks by model tier

| Task | Tier | Determinism | Rationale | Extraction status |
|---|---|---|---|---|
| Allergen hard filter | Light (Haiku) | High | Set intersection — no judgment | Ready for extraction |
| Clinical restriction filter | Light (Haiku) | High | Threshold comparison — deterministic | Ready for extraction |
| Soft ranking (preference/variety) | Standard (Sonnet) | Medium | Weighted scoring with patient history context | Not extractable — weights may need tuning |
| Multi-kitchen reroute proposal | Standard (Sonnet) | Low | Logistics judgment: split scheduling, cost, delivery windows | Not extractable |
| Substitution assessment | Standard (Sonnet) | Medium | Must evaluate nutritional equivalence and patient history | Not extractable |
| Order generation | Light (Haiku) | High | Template application from approved selection | Ready for extraction |
| Kitchen order summary aggregation | Light (Haiku) | High | Arithmetic aggregation | Ready for extraction |
| Packing slip field validation | Light (Haiku) | High | Checklist against Compliance field access matrix | Ready for extraction |
| Feedback triage | Light (Haiku) | High | Category-based routing — deterministic per category | Ready for extraction |
| Missed delivery escalation | Light (Haiku) | High | Threshold-based (count in window) | Ready for extraction |
| Complex patient meal planning | Deep (Opus) | Low | Multiple competing restrictions, limited pool, multi-kitchen coordination | Not extractable |

## Selective loading profiles

| Activity | Layers loaded |
|---|---|
| Recipe matching | README + essential-briefing + domain-knowledge + judgment-framework + output-contract + task-routing |
| Order generation | README + essential-briefing + output-contract + task-routing |
| Feedback routing | README + essential-briefing + judgment-framework (feedback section) + output-contract |
| Delivery escalation | README + essential-briefing + escalation-thresholds |
| Self-assessment | README + essential-briefing + quality-criteria + retro-log + task-routing |

## Extraction candidates (priority order)

1. **Allergen filter function** — input: patient allergen list + recipe allergen tags. Output: filtered recipe set. Zero ambiguity.
2. **Order generator** — input: approved meal selection. Output: structured kitchen order. Template application.
3. **Packing slip validator** — input: order fields. Output: pass/fail per Compliance matrix. Deterministic.
4. **Feedback router** — input: feedback category. Output: action enum. Decision table.
5. **Missed delivery counter** — input: patient delivery history. Output: escalation level. Threshold math.
