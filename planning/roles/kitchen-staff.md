# Role: Kitchen Staff

> Operates the Kitchen app. Receives orders, coordinates meal preparation and packing,
> confirms quality checks, and manages delivery dispatch. Kitchen staff see what they
> need to produce and deliver — nothing more.

---

## Primary app surface

**Kitchen app** — order list, packing slips, grocery list, delivery status, and recipe
catalog management.

---

## Responsibilities

- Review incoming orders for each delivery cycle
- Flag preparation issues (ingredient unavailability, recipe ambiguity)
- Track meal prep and packing status through the quality check pipeline
- Confirm delivery dispatch and track delivery status
- Report missed deliveries
- Manage the recipe catalog (create, edit, request RDN approval)
- Log food safety documentation (temperature checks, quality records)

---

## What kitchen staff see

Kitchen staff have the **most restricted PHI access** of any role. They need to know
what to make and where to deliver — not who the patient is clinically.

**What they see:**
- Order list for the current and next delivery cycle
- Per-order: delivery address, meal list, allergen/dietary notes (tags only — not diagnosis)
- Packing slip: patient first name + last initial, address, meal contents, allergen flags
- Grocery list: aggregated ingredients for all orders this cycle
- Recipe catalog: full recipe detail, nutritional values, allergen tags
- Delivery status: per-order dispatch and confirmation

**What they do not see:**
- Patient last name (packing slips use first name + last initial)
- Diagnosis or medical conditions
- Insurance or billing information
- Clinical notes or care plan detail
- PHQ-9 or any behavioral health data
- Full contact information (delivery address only)

**Why packing slips are limited:** If kitchen staff or delivery drivers are not Cena Health
employees (third-party kitchen or logistics partner), they are business associates with PHI
access limited to what's necessary to fulfill the delivery. The minimum necessary principle
applies to the physical packing slip, not just digital systems.

---

## Approval gates owned by kitchen staff

| Gate | Condition | SLA |
|---|---|---|
| Order quality check | Every order before dispatch | Before delivery window |
| Delivery confirmation | Every completed delivery | Within 2h of delivery |
| Missed delivery report | Any unconfirmed delivery | Within 2h of scheduled window |
| Recipe submission for nutritional review | Any new or modified recipe | Submit before production |

---

## Kitchen app workflow (typical day)

```
Morning:
1. Open Kitchen app → today's orders loaded
2. Review grocery list → flag any shortfalls to coordinator
3. Begin prep → mark orders: prepping → packed → quality_checked

Before dispatch:
4. Quality check complete → mark order: quality_checked
5. Assign to driver → mark order: dispatched

After delivery:
6. Driver confirms delivery → mark order: delivered
7. Undelivered orders → flag: missed, add reason

Ongoing:
8. Recipe submissions → create in app, submit for RDN nutritional review
9. Food safety logs → temperature checks, quality records
```

---

## Recipe management

Kitchen staff are the primary creators of recipe content. The workflow:

1. Kitchen staff create a recipe in the app (freeform text or structured entry)
2. Agent structures the recipe, assigns allergen tags, estimates nutritional values
3. Kitchen staff review the structured output and confirm
4. Recipe enters `pending_nutritional_review` status
5. RDN reviews nutritional values and approves or requests changes
6. Approved recipe is `active` in the catalog

Kitchen staff can mark recipes `inactive` (out of season, ingredient unavailable). They
cannot delete recipes — inactive recipes are retained for historical order records.

---

## What kitchen staff cannot do

- View patient clinical information beyond dietary restriction tags
- Access or modify care plans
- Approve recipes for nutritional compliance (RDN required)
- Access billing or financial data
- View full patient contact information beyond delivery address
