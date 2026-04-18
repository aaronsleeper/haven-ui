# Freshness Triggers -- Operations / Compliance

External events or changes that invalidate part of this expert's knowledge.
When a trigger fires, the expert's health status should downgrade and the
relevant domain knowledge should be re-researched.

---

## Triggers

| Trigger | Source | What it invalidates | Check method | Expected frequency |
|---|---|---|---|---|
| CMS Medicare Physician Fee Schedule update | CMS.gov | MNT billing code rates, coverage rules, modifier requirements | Check CMS fee schedule page for new calendar year release | Annual (January) |
| CMS billing/claims processing manual update | CMS.gov | Timely filing windows, claims submission rules, MNT coverage policies | Check CMS transmittals for manual updates | Quarterly |
| HIPAA guidance update (OCR) | HHS.gov | Privacy Rule interpretation, Security Rule requirements, enforcement priorities, AI/LLM-specific guidance | Check OCR guidance publications | Irregular -- monitor quarterly |
| State telehealth regulation change | State legislatures, medical boards | Telehealth billing rules, audio-only coverage, cross-state practice | Check state-by-state telehealth registries (CCHP, ATA) | Ongoing -- legislatures meet annually |
| NCQA HEDIS specification update | NCQA | HEDIS measure definitions, data collection requirements, retirement/addition of measures | Check NCQA publications for annual release | Annual (typically Q4 for following measurement year) |
| New partner contract signed | Business development | New billing model possible, new payer requirements, new BAA needed | Direct notification from Vanessa/Aaron | As needed |
| Payer-specific policy change | Individual payers | Coverage rules, credentialing requirements, timely filing changes | Payer bulletins and provider communications | Ongoing |
| Dietetics Licensure Compact membership change | CDR/ASDA | States where Cena RDNs can practice without individual licensure | Check compact membership list | Approximately annual |
| Grant funding opportunity or deadline | NIH Reporter, grants.gov | PI requirements, budget constraints, submission timelines | Check relevant funding opportunity announcements | Per funding cycle |
| AKS/Stark safe harbor update | CMS/OIG | VBC arrangement compliance, pricing model legal defensibility | Check Federal Register for final rules | Rare -- last major update 2020 |
| Legal counsel opinion received | External counsel | Pending legal questions resolved -- may change recommendations built on conservative assumptions | Direct notification from Vanessa | As needed |
| Validating authority arrives | Hiring/partnership event | All unvalidated assumptions -- assumptions index becomes validation checklist | Direct notification | Once per authority |

---

## Trigger evaluation during `/expert-update`

For each trigger, the update sweep should:

1. **Check:** Has this trigger fired since `last-validated`?
2. **Assess:** Does the change affect domain knowledge, judgment framework, or output contract?
3. **Scope:** Which layers need updating?
4. **Act:** Update affected layers, bump version, reset `last-validated`

If a trigger fires but the change doesn't affect Cena's current operations
(e.g., HEDIS measure added for a condition Cena doesn't treat), note it in
the retro log and keep health status unchanged.
