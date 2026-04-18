# Product & Engineering

> The function that builds and maintains Ava itself. Product defines what to build;
> engineering builds it. At Cena's scale these are tightly coupled.

---

## Responsibilities

- Product roadmap — prioritization, feature definition, user research
- UX/UI design — interaction patterns, visual design, prototyping
- Software development — frontend, backend, infrastructure, integrations
- DevOps & infrastructure — CI/CD, monitoring, deployments, security
- QA & testing — automated tests, manual QA, regression, load testing
- Technical architecture — system design, data modeling, scalability
- Documentation — technical docs, API specs, runbooks

## Sub-functions

| Sub-function | Owner today | Automation target | Notes |
|---|---|---|---|
| Product strategy & roadmap | Aaron | 🚫 Human (agent-informed) | Vision-driven, requires judgment |
| Feature specification | Aaron | 🤝 Agent drafts specs from user research | Structured output from research inputs |
| UX design | Aaron | 🤝 Agent generates variants, human selects | Design exploration is automatable |
| Frontend development | Aaron + agents | 🤝 Agent writes code, human reviews | Already happening via Claude Code |
| Backend development | Andrey + agents | 🤝 Agent writes code, human reviews | Already happening via Claude Code |
| Infrastructure & DevOps | Andrey | 🤖 Automated (with alerts) | CI/CD, monitoring, scaling rules |
| QA & testing | Agents | 🤖 Automated (test suites) / 🤝 (exploratory) | Automated regression + agent-driven QA |
| Code review | Andrey + Aaron | 🤝 Agent pre-reviews, human approves | Agent catches patterns, human judges architecture |
| Incident response | Andrey | 🤝 Agent diagnoses, human decides | See [AD-07](../../decisions.md) |
| Technical documentation | Agents | 🤖 Automated from code | Generated and kept in sync |

## Interfaces

| Direction | Function | What flows |
|---|---|---|
| **From** | Executive | Roadmap priorities, resource allocation |
| **From** | Clinical Care | Feature requests, workflow gaps |
| **From** | All service delivery | Bug reports, UX friction |
| **From** | Compliance | Security requirements, audit findings |
| **To** | All functions | Working software, new capabilities |
| **To** | Data & Analytics | Instrumentation, data pipelines |
| **To** | Internal Ops | System status, capacity planning |
| **To** | Clinical Education | New features requiring clinical staff training |
| **From** | Information Security | Security requirements, vulnerability findings |
| **From** | Customer Success | Partner-driven feature requests |

## Current state (Cena Health, March 2026)

Aaron handles all product and UX. Andrey handles all backend and infrastructure.
Both work extensively with AI coding agents (Claude Code). No dedicated QA, PM, or
design roles — all absorbed by the two founders.

Existing tooling:
- `cena-health-spark/` — main platform monorepo (Angular, Firebase)
- `haven-ui/` — design system and UI prototype layer
- `project-ava/` — next-gen platform (planning phase)

## Quality checks

- All code reviewed before merge (human or agent pre-review + human approval)
- Automated test suites run on every PR
- QA testing on staging before production deploy
- Architecture decisions documented in [decisions.md](../../decisions.md)
- Performance benchmarks tracked per release

## Automation roadmap

**Phase 1 (current):** AI-assisted coding, AI-generated specs, automated testing.

**Phase 2:** Automated QA pipelines (agent-driven regression + exploratory testing),
automated documentation generation, self-healing infrastructure.

**Phase 3:** Agent-proposed feature improvements based on usage patterns and user feedback.
Agent-maintained test coverage targets. Automated incident diagnosis and remediation for
known failure modes.
