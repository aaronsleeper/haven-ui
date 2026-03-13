# Orders

**Parent Navigation:** Meals & Nutrition

## Screen Overview

Patients view all their meal orders (past, current, upcoming) in a timeline view. They can track delivery status, update orders before cutoff, reorder favorites, pause/resume delivery service, and provide feedback on completed orders.

## Features on Screen

- **Orders Timeline** - Chronological list of orders with placement date, delivery date, 1-line summary (e.g., "12 meals, 1 bag of produce"), status badge. Highlights issues needing attention (action required, delivery delayed). Click to view order details.
- **Upcoming Deliveries Calendar** - Calendar view showing scheduled delivery dates for next 2-4 weeks. Click date to see order details.
- **Order Status Badges** - Pending, Confirmed, In Progress, Out for Delivery, Delivered, Cancelled. Color-coded for quick scanning.
- **Pause/Resume Service** - Toggle to temporarily pause deliveries (e.g., for vacation). Shows resume date. Ava helps reschedule.
- **Delivery Frequency Settings** - Configure how often deliveries occur (weekly, bi-weekly, custom schedule).
- **Quick Reorder Button** - Reorder last order or favorite order with one click.
- **Delivery Tracking** - For active deliveries, shows tracking link or estimated arrival time.

**Key data:** orderId, orderDate, deliveryDate, status, itemSummary, trackingNumber, issues

## Ava Integration

**Recent delivery:** "Your meals were delivered yesterday! How's everything tasting? I'd love your feedback on the teriyaki salmon."

**Upcoming order:** "Your next delivery is Dec 15. Want to make any changes? The cutoff is Dec 13 at 5 PM."

**Paused service:** "I see you paused deliveries for your vacation. Should I resume them on Jan 5 when you return?"

## Wireframe

```
┌──────────────────────────────────────┬─────────────────┐
│ Orders            [Place Order CLICK]│ Ava Chat        │
├──────────────────────────────────────┤                 │
│ [Upcoming] [Past] [Calendar View]    │ "Your meals were│
│                                      │ delivered! How's│
│ UPCOMING ORDERS                      │ everything?"    │
│ ┌──────────────────────────────────┐ │                 │
│ │ Order #12346 [Out for Delivery]  │ │ [Chat input]    │
│ │ Delivery: Today, 2-6 PM          │ │                 │
│ │ 12 meals, 1 bag of produce       │ │                 │
│ │ [Track Delivery CLICK]           │ │                 │
│ │ [CLICK FOR DETAILS]              │ │                 │
│ └──────────────────────────────────┘ │                 │
│                                      │                 │
│ ┌──────────────────────────────────┐ │ [Audit log]     │
│ │ Order #12347 [Confirmed]         │ │                 │
│ │ Delivery: Dec 15                 │ │                 │
│ │ 12 meals, 1 bag of produce       │ │                 │
│ │ Cutoff: Dec 13 at 5 PM           │ │                 │
│ │ [Update Order CLICK]             │ │                 │
│ │ [CLICK FOR DETAILS]              │ │                 │
│ └──────────────────────────────────┘ │                 │
│                                      │                 │
│ PAST ORDERS                          │                 │
│ ┌──────────────────────────────────┐ │                 │
│ │ Order #12345 [Delivered ✓]       │ │                 │
│ │ Delivered: Dec 8, 2025           │ │                 │
│ │ 12 meals, 1 bag of produce       │ │                 │
│ │ [Order Again] [Give Feedback]    │ │                 │
│ │ [CLICK FOR DETAILS]              │ │                 │
│ └──────────────────────────────────┘ │                 │
│                                      │                 │
│ SERVICE SETTINGS                     │                 │
│ [Pause Deliveries] [Frequency: Weekly ▼]              │
└──────────────────────────────────────┴─────────────────┘
```

## Critical Questions

- **Pause duration:** Max pause length? → **A) Up to 4 weeks, must specify resume date**
- **Delivery windows:** Can patients select specific time slots or just date? → **A) Date only for v1, 4-hour window**
- **Cancel policy:** How late can orders be cancelled? → **A) Before submission cutoff (48hrs), full refund if within policy**