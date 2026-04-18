# Function Files

Each file defines one organizational function for Cena Health. Files are self-contained —
an agent working on a specific function reads that file and its linked workflow docs
without needing to load the full org chart.

## Structure

Every function file follows this template:

1. **Responsibilities** — what this function does
2. **Sub-functions table** — breakdown with automation targets and agent coverage
3. **Interfaces** — inputs from and outputs to other functions
4. **Current state** — who handles this today at Cena Health
5. **Quality checks** — how we know this function is working
6. **Automation roadmap** — phased plan for increasing automation

## Index

### Company Infrastructure
- [executive.md](executive.md) — vision, fundraising, board, strategy
- [product-engineering.md](product-engineering.md) — building and maintaining Ava
- [people-culture.md](people-culture.md) — hiring, onboarding, performance, credentialing
- [finance.md](finance.md) — bookkeeping, AP/AR, financial planning, payroll
- [marketing-brand.md](marketing-brand.md) — positioning, content, partner marketing
- [legal-corporate.md](legal-corporate.md) — contracts, BAAs, IP, governance
- [information-security.md](information-security.md) — security posture, threat detection, LLM security

### Service Delivery
- [patient-ops.md](patient-ops.md) — referral through discharge
- [clinical-care.md](clinical-care.md) — nutrition and behavioral health care delivery
- [meal-ops.md](meal-ops.md) — meal planning, production, delivery
- [partner-payer.md](partner-payer.md) — health system and payer relationships
- [revenue-cycle.md](revenue-cycle.md) — claims, billing, collections
- [compliance.md](compliance.md) — HIPAA, regulatory, audit
- [risk-quality.md](risk-quality.md) — risk scoring, quality metrics, CQI
- [internal-ops.md](internal-ops.md) — IT, infrastructure, processes
- [business-dev.md](business-dev.md) — pipeline, proposals, market expansion
- [data-analytics.md](data-analytics.md) — reporting, population health, research

### Cross-Cutting
- [patient-experience.md](patient-experience.md) — holistic patient journey quality
- [customer-success.md](customer-success.md) — partner health, QBRs, retention
- [clinical-education.md](clinical-education.md) — protocols, training, competency

## Scoring

See [automation-readiness.md](../automation-readiness.md) for the rubric used to
evaluate automation targets in sub-function tables.
