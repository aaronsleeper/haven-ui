# Freshness Triggers — Compliance

External events or changes that invalidate part of this expert's knowledge.

---

| Trigger | Source | Check method | Expected frequency | Layers affected |
|---|---|---|---|---|
| HIPAA regulatory update | HHS rulemaking, Federal Register | Monitor HHS.gov/hipaa for final rules | Rare (~every 2-5 years for major changes) | domain-knowledge, judgment-framework |
| New state privacy law (CT PDPA, CA CCPA amendments, new state) | State legislatures | Monitor for states where Cena operates | ~Annual (state sessions) | domain-knowledge (retention, consent) |
| OCR enforcement action relevant to healthcare AI or food-as-medicine | HHS Office for Civil Rights | Review OCR resolution agreements quarterly | Quarterly check | judgment-framework (risk calibration) |
| New role added to Ava | Internal — role definitions, org chart | Role definition created or modified | Per event | output-contract (field access matrix must expand) |
| New PHI field added to data model | Internal — architecture/data-model.md | Data model change | Per event | output-contract (field access matrix), domain-knowledge (field inventory) |
| Consent template revision | Internal — legal/Vanessa | Consent template versioned | Per event | domain-knowledge (consent scope), output-contract (consent spec) |
| IRB protocol change | UConn IRB | Protocol version update | Per study amendment | domain-knowledge (research consent scope) |
| New kitchen or delivery partner onboarded | Internal — partner management | Partner onboarding event | Per event | output-contract (field access matrix for partner roles) |
| Validating authority arrives | Clinical Ops Director hired, legal counsel engaged | Role filled | One-time per assumption | domain-knowledge (assumptions index becomes validation checklist) |
| New workflow with PHI access | Internal — workflows/ directory | Workflow spec created or step added | Per event | output-contract (audit triggers must cover new steps) |
