# Meal Operations

> How medically tailored meals get planned, produced, and delivered. The tangible
> product patients interact with daily — and a key differentiator for Cena Health.

---

## Responsibilities

- Recipe catalog management
- Meal prescription matching (dietary needs → menu)
- Weekly order generation
- Kitchen partner coordination
- Production scheduling
- Delivery coordination and tracking
- Patient meal feedback collection
- Quality control (food safety, dietary compliance)
- Menu rotation and seasonal planning

## Sub-functions

| Sub-function | Automation target | Agent coverage | Notes |
|---|---|---|---|
| Recipe catalog management | 🤝 Agent-assisted | MealMatchingAgent | Agent maintains; RDN reviews nutritional accuracy |
| Meal prescription → menu matching | 🤖 Automated | MealMatchingAgent | Constraint solver: restrictions, preferences, variety |
| Weekly order generation | 🤖 Automated | OperationsOrchestrator | Triggered on schedule, aggregates patient orders |
| Kitchen order transmission | 🤖 Automated | CommunicationAgent | Structured orders to kitchen partners |
| Delivery scheduling | 🤖 Automated | OperationsOrchestrator | Route optimization, time windows |
| Delivery tracking | 🤖 Automated | OperationsOrchestrator | Status updates from delivery partner |
| Meal feedback collection | 🤖 Automated | AVA | Collected during check-in calls |
| Quality incidents | 🤝 Agent-assisted | AlertRouter | Agent flags; coordinator investigates |
| Menu planning | 🤝 Agent-assisted | MealMatchingAgent | Agent proposes rotation; RDN approves |

## Interfaces

| Direction | Function | What flows |
|---|---|---|
| **From** | Patient Operations | Meal prescriptions from care plans |
| **From** | Clinical Care | Updated dietary restrictions, allergy alerts |
| **To** | Revenue Cycle | Meal delivery records for billing |
| **To** | Risk & Quality | Delivery success rates, quality incidents |
| **To** | Data & Analytics | Meal satisfaction, dietary adherence |
| **To** | Partner & Payer | Meal delivery metrics for partner reporting |

## Current state

Kitchen partnerships established (details pending BAA confirmation — [OQ-28](../../open-questions.md)).
Workflows fully specified in [03-meal-operations.md](../../workflows/03-meal-operations.md) (10 workflows).

## Quality checks

- Every meal order verified against patient's current restrictions before kitchen transmission
- Delivery confirmation required within delivery window
- Missed deliveries escalated within 2 hours
- Patient satisfaction tracked per meal; scores below threshold trigger review
- Kitchen partners audited quarterly for food safety compliance

## Detailed workflows

See [03-meal-operations.md](../../workflows/03-meal-operations.md) for full workflow specifications.

## Key roles

- [Kitchen Staff](../../roles/kitchen-staff.md) — production and delivery
- [Care Coordinator](../../roles/care-coordinator.md) — escalation handling
- OperationsOrchestrator — weekly cycle management
- MealMatchingAgent — prescription-to-menu matching
