# Place New Order

**Parent Navigation:** Meals & Nutrition

## Screen Overview

Patients select meals and produce for a new delivery order. They browse available meals filtered by their dietary preferences, choose delivery date, review selections, and confirm the order. Ava provides personalized recommendations based on care plan and past orders.

## Features on Screen

- **Meal Selection Grid** - Browse available meals with photo, name, description, nutrition info, dietary tags. Add to cart with quantity selector.
- **Preference Filters** - Display patient's preferences (e.g., "gluten free", "low-carb"). Clickable to filter meals. "Clear filters" to show all. "View all" to remove filters.
- **Meal Categories** - Filter by meal type: Breakfast, Lunch, Dinner, Snacks.
- **Nutrition Info** - Calories, protein, carbs, fat displayed on each meal card. Click for full nutrition facts.
- **Cart Summary** - Running total of selected meals and produce. Shows count and estimated cost.
- **Delivery Date Picker** - Calendar showing available dates (future only). Defaults to next available. Shows delivery window (2-6 PM).
- **Produce Selection** - Optional add-on: weekly produce bag (pre-selected items).
- **Review & Confirm** - Final review screen showing all selections, delivery date, address, cost. Confirm button to place order.
- **Order Confirmation** - Success message with order number, delivery date, and summary. Link to order details.

**Key data:** mealId, mealName, category, dietaryTags, nutritionInfo, deliveryDate, totalCost

## Ava Integration

**Recommendation:** "Based on your care plan and past favorites, I recommend the Mediterranean chicken, salmon with veggies, and turkey chili. Want me to add these to your cart?"

**During selection:** "Great choice! The grilled chicken has 35g of protein and fits your low-carb plan perfectly."

**At checkout:** "You've selected 12 meals for Dec 15 delivery. Your total is $120. Ready to confirm?"

## Wireframe

```
┌──────────────────────────────────────┬─────────────────┐
│ Place New Order          [Cart: 8]   │ Ava Chat        │
├──────────────────────────────────────┤                 │
│ Delivery Date: [Dec 15, 2025 ▼]     │ "Based on your  │
│                                      │ care plan, I    │
│ MY PREFERENCES (click to filter)     │ recommend..."   │
│ [Gluten-free] [Low-carb] [Clear]     │                 │
│                                      │ [Chat input]    │
│ [Breakfast] [Lunch] [Dinner] [All]   │                 │
│                                      │                 │
│ AVAILABLE MEALS                      │                 │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ │                 │
│ │[📸]     │ │[📸]     │ │[📸]     │ │                 │
│ │Med.     │ │Salmon   │ │Turkey   │ │                 │
│ │Chicken  │ │& Veggies│ │Chili    │ │ [Audit log]     │
│ │350 cal  │ │420 cal  │ │380 cal  │ │                 │
│ │35g pro  │ │40g pro  │ │30g pro  │ │                 │
│ │Low-carb │ │Heart    │ │Gluten   │ │                 │
│ │[+ Add]  │ │healthy  │ │-free    │ │                 │
│ └─────────┘ │[+ Add]  │ │[+ Add]  │ │                 │
│             └─────────┘ └─────────┘ │                 │
│ (+ 20 more meals...)                 │                 │
│                                      │                 │
│ PRODUCE                              │                 │
│ □ Add weekly produce bag ($15)       │                 │
│                                      │                 │
│ [Review Order CLICK] (8 meals, $96)  │                 │
└──────────────────────────────────────┴─────────────────┘
```

## Critical Questions

- **Meal minimum:** Minimum meals per order? → **A) 6 meals minimum**
- **Custom meals:** Can patients request custom meals not in menu? → **A) No for v1, use feedback for requests**
- **Price display:** Show prices or insurance-covered only? → **A) Show prices with "insurance may cover" note**