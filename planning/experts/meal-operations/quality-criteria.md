# Quality Criteria

## Matched meal selection
- [ ] Zero allergen violations in selected meals (absolute — failure = critical defect)
- [ ] All selected meals within clinical restriction thresholds
- [ ] match_classification accurately reflects recipe count (5+ = sufficient, 1-4 = limited, 0 = none)
- [ ] Variety score reflects actual diversity (no duplicate recipes in same week unless limited pool)
- [ ] Warnings populated when assumptions are active or match is limited
- [ ] Confidence signal reflects recipe pool depth and active assumption count

## Kitchen order
- [ ] PHI boundary enforced: first name + last initial only, no diagnosis codes, no clinical notes
- [ ] Allergen flags present and accurate for every meal in order
- [ ] Format (fresh/frozen) matches kitchen capability and patient prescription
- [ ] packing_slip_fields validated against Compliance field access matrix
- [ ] Third-party delivery orders use generic allergen tags, not diagnosis-linked language

## Kitchen order summary
- [ ] Aggregated grocery quantities are arithmetically correct
- [ ] Demand forecast covers next 48h from delivery_date
- [ ] Special flags include all allergen-safe prep requirements from individual orders

## Delivery status update
- [ ] Status transitions follow valid lifecycle (pending > dispatched > delivered)
- [ ] Missed delivery escalated within 2 hours of window close
- [ ] 3+ misses in 30 days triggers food_insecurity_risk escalation
- [ ] billing_eligible is true only when status = delivered

## Feedback routing decision
- [ ] "Made me sick" always routes to food_safety_incident (no exceptions)
- [ ] Single recipe_dislike logs only — does not remove from rotation
- [ ] Removal requires patient confirmation of repeated dislike
- [ ] Ambiguous feedback routes to coordinator, not auto-classified
