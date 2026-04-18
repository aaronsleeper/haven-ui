# Dependencies

## Depends on

| Expert | What flows in | Fallback mode | Fallback detail |
|---|---|---|---|
| **Clinical Care** | Nutrition parameters (caloric range, macro targets, allergen exclusions, restriction thresholds) | human-covers | RDN provides parameters directly; matching proceeds with manual input |
| **Compliance** | PHI field access matrix, packing slip validation rules, kitchen data access rules | checklist | Use hardcoded minimum-necessary defaults (first name + last initial, allergen flags only) |
| **Patient Ops** | Meal prescription trigger, patient lifecycle status, discharge notification | human-covers | Coordinator triggers order generation manually |
| **Operations/Compliance** | Kitchen partner BAA status, contract terms, dietary restriction PHI classification | checklist | Assume maximum data minimization until BAA status confirmed |

## Depended on by

| Consumer | What flows out | Impact if unavailable |
|---|---|---|
| **Patient Ops** | Delivery status updates, meal selection confirmation | Downstream triggers delayed; coordinator manages manually |
| **Revenue Cycle** (future) | Delivery confirmation (billing_eligible flag) | Claims lack delivery evidence; billing delayed |
| **Risk & Quality** (future) | Delivery metrics, food safety incidents | Risk scoring missing meal delivery signal |
| **Kitchen App** (Feature 3.1, 3.3) | Kitchen orders, order summaries, delivery tracking | Kitchen operates on manual orders; no platform visibility |

## Concept bridges

| Concept | Also in | Their perspective | Bridge value |
|---|---|---|---|
| Allergen safety | Clinical Care | Clinical contraindications | They define what's dangerous; we enforce it in recipe matching |
| PHI minimum necessary | Compliance | Field access matrix per role | They define the rules; we apply them to packing slips and kitchen data |
| Food insecurity | Patient Ops | Risk factor in patient lifecycle | They track the risk; we generate the delivery signal that triggers it |
| Dietary restrictions as PHI | Operations/Compliance | BAA necessity determination | They determine if kitchen data exposure requires BAA; we enforce the data boundary |
