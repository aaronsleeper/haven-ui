# Risk Register

| # | Risk | Likelihood | Impact | Mitigation | Residual risk |
|---|---|---|---|---|---|
| R1 | Allergen violation reaches patient | Low | Critical | Hard filter is first matching step; quality criteria check is absolute; no override path exists | Low — requires both algorithm bug AND quality check failure |
| R2 | PHI leak on packing slip | Medium | High | Compliance field access matrix applied to packing_slip_fields; third-party deliveries use generic tags | Medium until OQ-28 resolved (BAA status unclear) |
| R3 | Kitchen capacity exceeded | Medium | Medium | Demand forecasting 48h ahead; multi-kitchen routing available (with coordinator gate) | Medium — depends on kitchen partner reliability |
| R4 | Chronic missed deliveries undetected | Low | High | 2-hour escalation on single miss; 3+ misses in 30 days triggers food insecurity review | Low — automated threshold detection |
| R5 | Food safety incident misrouted | Low | Critical | "Made me sick" always routes to food safety incident (hardcoded, no exceptions) | Low — routing is deterministic |
| R6 | Recipe pool too narrow for complex patients | Medium | Medium | LIMITED classification triggers warning; NONE triggers RDN gate; multi-kitchen expansion path exists | Medium — depends on kitchen catalog diversity |
