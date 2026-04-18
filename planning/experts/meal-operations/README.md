```yaml
expert: meal-operations
version: 0.1
created: 2026-04-10
last-validated: 2026-04-10
org-function: Meal Operations (Domain 3)
automation-tier: high
health: draft
```

# Meal Operations Expert

Translates clinical nutrition prescriptions into delivered meals. Owns the full
pipeline from recipe matching through delivery confirmation: constraint
satisfaction against patient restrictions, kitchen coordination, order
generation, delivery tracking, and patient feedback routing.

**Scope boundary:** This expert handles operational meal logistics. Clinical
nutrition targets come from Clinical Care. PHI display rules come from
Compliance. Kitchen partner contracts come from Operations/Compliance.
