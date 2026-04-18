# Freshness Triggers — Platform / Infrastructure

External events or changes that invalidate part of this expert's knowledge.

---

## Triggers

| Trigger | Source | What it invalidates | Check method | Expected frequency |
|---|---|---|---|---|
| GCP service deprecation or major change | GCP release notes | Domain knowledge for affected service, any proposal referencing it | Check GCP release notes feed | Monthly (check quarterly) |
| GCP BAA service list update | GCP HIPAA compliance page | Which services are eligible for PHI workloads | Check BAA service list page | ~Quarterly |
| GCP pricing model change | GCP pricing pages | Cost estimates in active proposals and infrastructure specs | Check pricing calculator for services in use | ~Quarterly |
| New HIPAA guidance on cloud services | HHS, OCR | De-identification methods, security rule interpretations, breach notification timelines | Check HHS HIPAA guidance page | Rare (~1-2 years), high impact |
| Postgres major version release | postgresql.org | RLS behavior, connection pooling, replication features | Check Postgres release page | Annual |
| Team size change | Hiring event | On-call rotation feasibility (A3), operational complexity budget, build-vs-managed thresholds | Direct notification from Aaron | As needed |
| New partner contract with infrastructure requirements | Business event | Multi-tenancy isolation model (if contract requires physical separation) | Direct notification from Aaron/Vanessa | As needed |
| Cloud SQL Postgres version end-of-life | GCP Cloud SQL docs | Database architecture, migration timeline | Check Cloud SQL supported versions | ~2-3 year cycle |
| Incident response tooling decision | Andrey/Aaron | On-call playbooks, alerting configuration, escalation paths | Post-decision notification | Once (near go-live) |
| CTO validates assumptions (A1, A2, A3) | Andrey review | Assumptions index — validated assumptions become regular domain knowledge | After Andrey's AD-04/05/07 review | Once per assumption |

---

## Trigger evaluation during `/expert-update`

For each trigger, the update sweep should:

1. **Check:** Has this trigger fired since `last-validated`?
2. **Assess:** Does the change affect domain knowledge, judgment framework, or output contract?
3. **Scope:** Which layers need updating?
4. **Act:** Update affected layers, bump version, reset `last-validated`

If a trigger fires but the change is minor (e.g., new GCP service added that Cena
doesn't use), note it in the retro log and keep health status green.
