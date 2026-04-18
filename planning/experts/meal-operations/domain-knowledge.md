# Domain Knowledge

## Recipe matching

| Knowledge area | Value | Source | Shelf life |
|---|---|---|---|
| Matching algorithm | 4-stage: hard filter (allergens) > clinical filter (macro/micro limits) > soft rank (preference, variety, satisfaction) > classify (sufficient/limited/none) | workflows/meal-prescription steps.md | Until algorithm change |
| Sufficient threshold | 5+ valid recipes after filtering | workflows/meal-prescription steps.md | Until clinical review |
| Limited threshold | 1-4 valid recipes | workflows/meal-prescription steps.md | Until clinical review |
| Zero-match protocol | Escalate to RDN for constraint relaxation — hardcoded gate | workflows/meal-prescription steps.md | Permanent |
| Variety penalty | Penalize recipes served in last 7 days; weight increases with recency | workflows/03-meal-operations.md | Until patient data informs |
| `[ASSUMPTION]` Cultural preference tags | Cuisine-type tags (Latin American, Southern, Asian, Mediterranean, etc.) on recipes, matched against patient cultural_preferences | Basis: journey maps mention cultural food preferences. Validates by: RDN + first kitchen partner onboarding | Until validated |

## Order generation

| Knowledge area | Value | Source | Shelf life |
|---|---|---|---|
| Order lifecycle | pending > prepping > packed > quality_checked > dispatched > delivered | workflows/03-meal-operations.md | Until workflow change |
| Format types | Fresh (tight windows, 2-3x/week), Frozen (weekly batch, longer shelf life) | OQ-17 (resolved) | Until logistics change |
| Demand forecast timing | 48 hours before delivery cutoff | workflows/03-meal-operations.md | Until kitchen contract change |
| KitchenOrderSummary | Aggregated grocery list + special flags + delivery_date per kitchen | workflows/03-meal-operations.md | Until format change |

## Kitchen coordination

| Knowledge area | Value | Source | Shelf life |
|---|---|---|---|
| Partner model | Kitchens procure independently; platform provides demand forecasts only | Vanessa (operational context) | Until partnership model changes |
| Multi-kitchen routing | System suggests alternative when primary insufficient; coordinator must approve | OQ-20 (resolved) | Permanent (gate) |
| Inventory shortfall | Kitchen flags insufficient ingredients 48h before cutoff; triggers substitution or reroute | workflows/03-meal-operations.md | Until process change |
| `[ASSUMPTION]` Kitchen capacity | ~200 meals/day per kitchen partner | Basis: initial planning estimates. Validates by: first kitchen contract | Until validated |

## Delivery logistics

| Knowledge area | Value | Source | Shelf life |
|---|---|---|---|
| PHI on packing slips | First name + last initial, delivery address, meal contents, allergen flags, delivery window | OQ-18 (resolved) | Until compliance review |
| Third-party delivery (no BAA) | Generic allergen tags only ("nut-free"), no diagnosis-linked language | OQ-18 (resolved) | Until BAA resolved |
| Delivery confirmation | Required within delivery window; unconfirmed = missed | workflows/03-meal-operations.md | Until process change |
| Missed delivery escalation | Escalate within 2 hours; 3+ misses triggers food insecurity risk review | workflows/03-meal-operations.md | Until clinical threshold change |

## Patient feedback

| Knowledge area | Value | Source | Shelf life |
|---|---|---|---|
| Feedback routing | Distinguish: "don't like recipe" / "delivery problem" / "made me sick" | OQ-21 (resolved) | Until feedback taxonomy change |
| Recipe removal threshold | Patient must confirm repeated dislike; single bad rating is insufficient | OQ-21 (resolved) | Permanent |
| Food safety incident | "Made me feel sick" creates food safety incident (Domain 7) | OQ-21 (resolved) | Permanent |
| Feedback collection channels | Patient app, AVA voice check-in, coordinator entry | product-structure.md | Until channel change |

## Reference sources

| Source | Domain | Trust level | When to consult |
|---|---|---|---|
| FDA Food Code | Food safety, handling, temperature | Authoritative | Food safety questions, kitchen compliance |
| USDA FoodData Central | Nutritional composition | Authoritative | Recipe nutritional validation |
| AND (Academy of Nutrition and Dietetics) MNT guidelines | Medical nutrition therapy | Authoritative | Dietary restriction definitions |

## Assumptions index

| # | Assumption | Basis | Validates by | Status |
|---|---|---|---|---|
| A1 | Cultural preference tags exist on recipes | Journey maps reference cultural food preferences | RDN + first kitchen partner onboarding | unvalidated |
| A2 | Kitchen capacity ~200 meals/day | Planning estimates | First kitchen contract | unvalidated |
| A3 | Demand forecast 48h lead time is sufficient | Operational planning docs | First kitchen partner feedback | unvalidated |
