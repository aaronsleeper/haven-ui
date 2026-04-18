# Output Contract

## Output 1: Matched meal selection

**Trigger:** Meal prescription received from care-plan-creation or care-plan-update workflow
**Consumer:** Patient Ops (downstream trigger), Kitchen App (order display)

| Field | Type | Description |
|---|---|---|
| patient_id | UUID | Patient receiving meals |
| prescription_id | UUID | Source prescription |
| match_classification | enum | sufficient / limited / none |
| selected_meals | array | Ordered list of meal objects (recipe_id, date, format, kitchen_id) |
| variety_score | float | 0-1 measure of menu diversity over the selection period |
| constraint_summary | object | Applied filters: allergens excluded, clinical limits enforced |
| warnings | array | Any flags: limited variety, substitutions made, assumption dependencies |
| confidence | enum | high / medium / low — based on recipe pool depth and assumption count |

## Output 2: Kitchen order

**Trigger:** Matched meal selection approved (or auto-approved when sufficient + no warnings)
**Consumer:** Kitchen App (Feature 3.1), delivery pipeline

| Field | Type | Description |
|---|---|---|
| order_id | UUID | Unique order identifier |
| kitchen_id | UUID | Assigned kitchen partner |
| delivery_date | date | Scheduled delivery |
| patient_first_name | string | First name only (PHI boundary) |
| patient_last_initial | string | Last initial only |
| delivery_address | object | Full delivery address |
| meals | array | Recipe ID, quantity, format (fresh/frozen), allergen_flags, dietary_tags |
| special_instructions | string | Preparation notes (no clinical language) |
| packing_slip_fields | object | Pre-validated minimum-necessary fields per Compliance rules |

## Output 3: Kitchen order summary

**Trigger:** Daily order aggregation (batch, scheduled)
**Consumer:** Kitchen App (production planning), kitchen partner systems

| Field | Type | Description |
|---|---|---|
| kitchen_id | UUID | Kitchen receiving summary |
| delivery_date | date | Production target date |
| total_orders | int | Count of individual orders |
| aggregated_grocery | array | Ingredient, total quantity, unit |
| special_flags | array | Allergen-safe prep requirements, format-specific handling |
| demand_forecast | object | Next 48h projected orders (for procurement planning) |

## Output 4: Delivery status update

**Trigger:** Delivery confirmation, missed delivery, or delivery issue reported
**Consumer:** Patient Ops (lifecycle events), Revenue Cycle (billing trigger), Risk (delivery metrics)

| Field | Type | Description |
|---|---|---|
| order_id | UUID | Order being tracked |
| status | enum | dispatched / delivered / missed / issue_reported |
| timestamp | datetime | When status changed |
| issue_type | enum | null / wrong_items / late / damaged / not_received |
| escalation_level | enum | none / coordinator_notify / food_insecurity_risk |
| billing_eligible | boolean | Whether delivery confirmation triggers billing |

## Output 5: Feedback routing decision

**Trigger:** Patient feedback received (app, AVA, or coordinator entry)
**Consumer:** Kitchen App (quality), Clinical Care (if food safety), Patient Ops (if escalation)

| Field | Type | Description |
|---|---|---|
| feedback_id | UUID | Feedback record |
| patient_id | UUID | Feedback source |
| category | enum | recipe_dislike / delivery_problem / food_safety / ambiguous |
| action | enum | log_only / flag_for_review / remove_from_rotation / food_safety_incident / route_to_coordinator |
| recipe_id | UUID | Affected recipe (if applicable) |
| prior_complaints | int | Count of prior complaints about this recipe from this patient |
| rationale | string | Why this routing decision was made |
