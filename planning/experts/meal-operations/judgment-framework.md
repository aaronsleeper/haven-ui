# Judgment Framework

## Core principle
**Allergen safety is non-negotiable; everything else optimizes for patient
satisfaction and operational efficiency.** When constraints conflict, safety
wins over variety, variety wins over cost, cost wins over convenience.

## Decision trees

### Recipe match classification

```
Patient prescription received
├─ Hard filter: any allergen in patient exclusions?
│  └─ Yes → recipe eliminated (absolute, no exceptions)
├─ Clinical filter: exceeds hard restrictions (Na, K, cal, etc.)?
│  └─ Yes → recipe eliminated
├─ Count remaining recipes
│  ├─ 5+ → SUFFICIENT — proceed to soft ranking
│  ├─ 1-4 → LIMITED — proceed with warning, flag for variety review
│  └─ 0 → NONE — escalate to RDN (hardcoded gate)
└─ Soft rank (only for sufficient/limited sets):
   Score = preference_match + cultural_match + format_preference
         - recency_penalty - dissatisfaction_penalty
```

### Substitution vs. reroute

When a kitchen flags inventory shortfall 48h before cutoff:

```
Inventory shortfall reported
├─ Can substitute within same nutritional profile?
│  ├─ Yes, patient has no history of rejecting substitute → substitute (autonomous)
│  └─ Yes, but patient previously rejected this substitute → flag coordinator
├─ Cannot substitute
│  ├─ Alternative kitchen available with matching recipes?
│  │  ├─ Yes → propose reroute to coordinator (gate — never autonomous)
│  │  └─ No → escalate to coordinator with options: delay, partial delivery, or skip
│  └─ Shortfall affects allergen-safe alternatives only → escalate immediately (safety)
```

### Feedback triage

```
Patient feedback received
├─ Category: "made me sick" → food safety incident (immediate, Domain 7)
├─ Category: "delivery problem" → delivery issue (operations)
│  ├─ Wrong items → kitchen quality flag
│  ├─ Late delivery → logistics flag
│  └─ Damaged → packaging flag
├─ Category: "don't like recipe"
│  ├─ First complaint about this recipe → log, no action
│  ├─ Second complaint, same recipe → flag for review, ask patient to confirm
│  └─ Patient confirms repeated dislike → remove from rotation for this patient
└─ Category: ambiguous → route to coordinator for classification
```

### Missed delivery escalation

```
Delivery not confirmed within window
├─ First occurrence → notify coordinator, attempt redelivery if same-day feasible
├─ 2nd miss in 30 days → notify coordinator + flag for logistics review
├─ 3rd+ miss in 30 days → escalate to coordinator as food insecurity risk
│  └─ Trigger: care plan review for food security assessment
```

## Worked example: multi-kitchen week

A patient with celiac disease (gluten-free absolute) and renal diet (potassium
< 2000mg/day) has their primary kitchen report flour supplier disruption
affecting 60% of gluten-free recipes.

1. **Hard filter:** Remove all gluten-containing recipes (allergen — absolute)
2. **Clinical filter:** Remove recipes exceeding potassium threshold
3. **Count:** Primary kitchen has 2 valid recipes (LIMITED) — down from usual 8
4. **Judgment:** 2 recipes for a full week = poor variety. Check alternative kitchen.
5. **Alternative kitchen:** Has 6 valid recipes after same filtering
6. **Action:** Propose to coordinator: split week between primary (2 recipes, 2 days)
   and alternative (remaining days). Include: both kitchens' delivery windows,
   additional logistics cost if any, patient's delivery address compatibility.
7. **Gate:** Coordinator approves or modifies split. Expert does not reroute autonomously.
