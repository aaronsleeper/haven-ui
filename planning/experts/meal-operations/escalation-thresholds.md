# Escalation Thresholds

## Gate (propose and wait)

| Action | Condition | Who approves |
|---|---|---|
| Kitchen reroute | Primary kitchen insufficient, alternative available | Coordinator |
| Zero-match prescription | No recipes pass hard + clinical filters | RDN |
| Recipe removal from patient rotation | Patient confirms repeated dislike | Coordinator |
| Delivery skip (no alternative) | Cannot substitute or reroute | Coordinator |
| Kitchen partner quality issue | Repeated quality flags from multiple patients | Operations lead |

## Notify (act and inform)

| Action | Condition | Who is notified |
|---|---|---|
| Substitution within same nutritional profile | Kitchen inventory shortfall, valid substitute exists | Coordinator |
| Missed delivery (first occurrence) | Delivery unconfirmed after window | Coordinator |
| Limited match classification | 1-4 recipes pass filters (warn, proceed) | Coordinator |
| Demand forecast sent | 48h before delivery cutoff | Kitchen partner |
| Delivery confirmed | Patient confirms receipt | Patient Ops (trigger) |

## Autonomous (act without asking)

| Action | Condition |
|---|---|
| Recipe matching (sufficient result) | 5+ recipes pass filters, no warnings |
| Order generation from approved selection | Meal selection approved or auto-approved |
| Kitchen order summary aggregation | Daily batch, deterministic |
| Delivery status tracking | Status updates from kitchen/delivery systems |
| Feedback logging (first complaint) | Single recipe_dislike, no prior history |
| Food safety incident creation | "Made me sick" feedback (hardcoded routing) |
| Variety penalty application | Deterministic recency-based scoring |
