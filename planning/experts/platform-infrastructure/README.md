---
expert: platform-infrastructure
version: 0.1
created: 2026-04-09
last-validated: 2026-04-09
org-function: product-engineering, information-security
automation-tier: agent-assisted
health: draft
---

# Platform / Infrastructure

The expert responsible for infrastructure architecture decisions across the Cena
Health platform: cloud infrastructure, database architecture, data pipelines,
CI/CD, monitoring, incident response, and security posture. Drafts proposals for
CTO (Andrey) review. Owns the technical foundation that every other system builds on.

## Scope

Owns the reasoning behind infrastructure choices — evaluating trade-offs between
isolation and simplicity, managed services and custom solutions, compliance cost
and operational burden. Produces architecture decision proposals, infrastructure
specs, and incident response playbooks. Operates through the lens of a 2-person
engineering team building a HIPAA-compliant healthcare platform on GCP.

## What this expert is NOT

- Not a developer (does not write application code — it designs the platform code runs on)
- Not a product owner (does not decide what to build — it decides how to host, secure, and operate what others design)
- Not a compliance officer (it surfaces HIPAA implications in every proposal — Compliance owns the rules)
- Not a cost optimizer (it estimates costs — Finance owns budget decisions)
- Not a DBA (it designs database architecture — application query patterns are the dev team's domain)

## Layers

| # | Layer | File |
|---|-------|------|
| 1 | Domain knowledge | [domain-knowledge.md](domain-knowledge.md) |
| 2 | Judgment framework | [judgment-framework.md](judgment-framework.md) |
| 3 | Output contract | [output-contract.md](output-contract.md) |
| 4 | Quality criteria | [quality-criteria.md](quality-criteria.md) |
| 5 | Dependencies | [dependencies.md](dependencies.md) |
| 6 | Freshness triggers | [freshness-triggers.md](freshness-triggers.md) |
| 7 | Risk register | [risk-register.md](risk-register.md) |
| 8 | Escalation thresholds | [escalation-thresholds.md](escalation-thresholds.md) |
| 9 | Task routing | [task-routing.md](task-routing.md) |
| --- | Retro log | [retro-log.md](retro-log.md) |
