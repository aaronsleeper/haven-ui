# Order Details

**Parent Navigation:** Meals & Nutrition > Orders

## Screen Overview

Patients view complete details for a specific meal order including all meals, produce, delivery date, and order status. They can update the order (if before cutoff), reorder the same items, or provide feedback on completed orders.

## Features on Screen

- **Order Summary** - Order number, placement date, delivery date, total items (meals + produce), order status (Pending, In Progress, Delivered, Completed).
- **Meal List** - Each meal with name, description, thumbnail, quantity. Shows dietary tags (gluten-free, low-carb, etc.).
- **Produce Items** - List of produce items included in order with quantities.
- **Delivery Information** - Delivery address, special instructions, estimated delivery time window.
- **Update Order Button** - Enabled if before submission cutoff. Opens modal to modify meals/produce. Shows cutoff date/time.
- **Order Again Button** - Quick reorder option. Includes field to repeat n times (e.g., order same items for next 4 weeks).
- **Feedback Link** - For completed orders, link to provide feedback on meal quality.

**Key data:** orderId, orderDate, deliveryDate, status, meals, produceItems, deliveryAddress, submissionCutoff

## Ava Integration

**Completed order:** "Your order from Dec 10 was delivered! How did you like the Mediterranean chicken and quinoa bowl? I'd love to hear your feedback."

**Before cutoff:** "You can update this order until Dec 8 at 5 PM. Want to add or remove any meals?"

**Reordering:** "I can reorder these same meals for you. How many weeks would you like me to repeat this order?"

## Wireframe

```
┌──────────────────────────────────────┬─────────────────┐
│ Order #12345                         │ Ava Chat        │
├──────────────────────────────────────┤                 │
│ ORDER SUMMARY                        │ "Your order was │
│ Placed: Dec 1, 2025                  │ delivered! How  │
│ Delivery: Dec 8, 2025                │ did you like the│
│ Status: [Delivered ✓]                │ meals?"         │
│                                      │                 │
│ [Update Order CLICK] (if before cutoff) [Chat input]  │
│ [Order Again CLICK] [Provide Feedback]                │
│                                      │                 │
│ MEALS (12)                           │                 │
│ ┌──────────────────────────────────┐ │                 │
│ │ [📸] Mediterranean Chicken       │ │                 │
│ │ Qty: 3 | Low-carb, Gluten-free   │ │ [Audit log]     │
│ └──────────────────────────────────┘ │                 │
│ ┌──────────────────────────────────┐ │                 │
│ │ [📸] Salmon with Vegetables      │ │                 │
│ │ Qty: 4 | Heart-healthy           │ │                 │
│ └──────────────────────────────────┘ │                 │
│ (+ 10 more meals...)                 │                 │
│                                      │                 │
│ PRODUCE (1 bag)                      │                 │
│ • Mixed greens                       │                 │
│ • Cherry tomatoes                    │                 │
│ • Cucumbers                          │                 │
│                                      │                 │
│ DELIVERY INFO                        │                 │
│ Address: 123 Main St, Apt 4B         │                 │
│ Window: Dec 8, 2-6 PM                │                 │
│ Instructions: Leave at door          │                 │
└──────────────────────────────────────┴─────────────────┘
```

## Critical Questions

- **Cutoff timing:** How many hours/days before delivery can patients update? → **A) 48 hours before delivery date**
- **Partial updates:** Can patients modify quantity or only add/remove items? → **A) Both - modify quantities and add/remove**
- **Recurring orders:** Maximum repeat count? → **A) Up to 4 weeks (1 month) of repeats**