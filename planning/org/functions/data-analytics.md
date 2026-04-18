# Data, Analytics & Research

> How Cena Health understands what's working. Reporting, population health analytics,
> research data management, and the insights that drive improvement.

---

## Responsibilities

- Operational reporting (daily, weekly, monthly dashboards)
- Partner reporting (outcomes, utilization, ROI)
- Population health analytics
- Research data management (for academic partners)
- Data pipeline management (ETL, data warehouse)
- Predictive modeling (risk, utilization, outcomes)
- Ad hoc analysis and data requests
- Attribution modeling for outcomes

## Sub-functions

| Sub-function | Automation target | Agent coverage | Notes |
|---|---|---|---|
| Operational dashboards | 🤖 Automated | ReportingAgent | Real-time from production data |
| Partner reports | 🤖 Automated | ReportingAgent | Scheduled per partner contract |
| Population health analysis | 🤝 Agent-assisted | ReportingAgent | Agent runs analysis; clinician interprets |
| Research data exports | 🤖 Automated (with gate) | DataExchangeAgent | De-identified exports per IRB protocol |
| Data pipeline management | 🤖 Automated | DataExchangeAgent | ETL monitoring, data quality checks |
| Predictive modeling | 🤝 Agent-assisted | RiskScoringAgent | Model training, validation, deployment |
| Ad hoc analysis | 🤝 Agent-assisted | ReportingAgent | Natural language → SQL → visualization |
| Attribution modeling | 🤝 Agent-assisted | None (gap) | See [OQ in workflows](../../workflows/10-data-analytics-research.md) |
| Data quality monitoring | 🤖 Automated | DataExchangeAgent | Automated validation rules, anomaly detection |

## Interfaces

| Direction | Function | What flows |
|---|---|---|
| **From** | All service delivery functions | Raw operational and clinical data |
| **From** | Finance | Cost data for unit economics |
| **From** | Product & Engineering | Instrumentation, data pipelines |
| **To** | Executive | KPIs, strategic insights |
| **To** | Risk & Quality | Population health metrics, benchmarks |
| **To** | Partner & Payer | Outcomes reports |
| **To** | Business Development | Proof points, market analysis |
| **To** | Marketing & Brand | Data for case studies and content |
| **To** | Clinical Care | Population insights for care planning |

## Current state

Hybrid data architecture decided: clinical Postgres + BigQuery for analytics
([AD-05 in decisions.md](../../decisions.md) — needs Andrey's review).
HEDIS data model pending ([OQ-07](../../open-questions.md)).
Workflows specified in [10-data-analytics-research.md](../../workflows/10-data-analytics-research.md) (7 workflows).

## Quality checks

- Data pipeline health monitored continuously (latency, completeness, accuracy)
- Reports validated against source data monthly (sample audit)
- Research exports verified against IRB-approved protocol
- Predictive models validated quarterly against outcomes
- Data access logged and auditable (PHI minimum necessary applies)

## Architectural note

The separation of clinical Postgres (OLTP) from BigQuery (OLAP) is designed to:
- Keep clinical operations fast (queries hit dedicated DB)
- Enable research/analytics without impacting clinical performance
- Enforce physical data separation between operational and research tiers
- Support de-identification at the ETL layer

## Detailed workflows

See [10-data-analytics-research.md](../../workflows/10-data-analytics-research.md) for full workflow specifications.
