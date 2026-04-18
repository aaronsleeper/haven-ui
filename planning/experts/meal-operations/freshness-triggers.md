# Freshness Triggers

| Trigger | Source | Check method | Frequency | Layers affected |
|---|---|---|---|---|
| Recipe matching algorithm changes | workflows/meal-prescription | Diff steps.md | On workflow edit | domain-knowledge, judgment-framework |
| New kitchen partner onboarded | Kitchen contracts | Partner list review | Per event | domain-knowledge (capacity), assumptions A2/A3 |
| Packing slip PHI rules change | Compliance expert | Compliance output-contract diff | On Compliance update | domain-knowledge (delivery), quality-criteria |
| Feedback taxonomy expanded | product-structure.md or workflow edit | Check feedback routing categories | On product change | domain-knowledge (feedback), judgment-framework |
| OQ-28 (kitchen BAAs) resolved | open-questions.md | Check OQ-28 status | Monthly until resolved | domain-knowledge, dependencies, essential-briefing |
| Delivery logistics model changes | Kitchen contracts, partner feedback | Contract review | Per event | domain-knowledge (delivery), judgment-framework |
| New dietary restriction type added | Clinical Care expert | Clinical Care output-contract diff | On Clinical Care update | domain-knowledge (matching), quality-criteria |
| Assumption validation: first kitchen partner | Kitchen onboarding | Validate A1, A2, A3 against real data | One-time | domain-knowledge, assumptions index |
