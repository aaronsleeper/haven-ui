# Clinical Education & Training

> Ongoing clinical competency development — not onboarding (that's People & Culture)
> but the continuous education, protocol updates, and competency validation that
> keeps clinical staff current as the platform and clinical science evolve.

---

## Responsibilities

- Clinical protocol development and updates
- Continuing education tracking (CEU requirements for RDNs, BHNs)
- Platform workflow training — how to use Ava effectively
- New feature training — when platform capabilities change
- Competency validation — ensuring staff meet quality standards
- Clinical knowledge base maintenance — guidelines, formularies, protocols
- Preceptor/mentorship coordination — for new clinical staff

## Sub-functions

| Sub-function | Automation target | Agent coverage | Notes |
|---|---|---|---|
| Protocol documentation | 🤝 Agent-assisted | DocumentationAgent | Agent drafts from clinical guidelines; clinical lead reviews |
| Protocol change notification | 🤖 Automated | CommunicationAgent | Auto-notify affected staff when protocols update |
| CEU tracking | 🤖 Automated | None (gap) | Expiration monitoring, renewal reminders per credential type |
| Platform training modules | 🤝 Agent-assisted | None (gap) | Generated from feature docs; updated on release |
| Training completion tracking | 🤖 Automated | None (gap) | Required training per role, completion status |
| Competency assessment | 🤝 Agent-assisted | AuditMonitor | Agent flags documentation quality patterns; supervisor reviews |
| Clinical knowledge base | 🤝 Agent-assisted | None (gap) | Agent maintains from guidelines; clinical lead validates |
| Evidence-based practice updates | 🤖 Automated | None (gap) | Monitor published nutrition/behavioral health research |
| New hire clinical orientation | 🤝 Agent-assisted | None (gap) | Structured program with checklist and sign-off |

## Interfaces

| Direction | Function | What flows |
|---|---|---|
| **From** | Clinical Care | Documentation quality signals, protocol questions |
| **From** | Risk & Quality | Quality metric gaps that suggest training needs |
| **From** | Product & Engineering | New features requiring clinical staff training |
| **From** | Compliance | Regulatory changes requiring protocol updates |
| **To** | Clinical Care | Updated protocols, trained staff |
| **To** | People & Culture | Training completion data, credential status |
| **To** | Compliance | Training compliance evidence |
| **To** | Risk & Quality | Competency data for quality analysis |

## Current state

No formal clinical education function. RDN protocols will be established during
UConn pilot. CEU tracking not yet needed (no employed clinical staff yet).
Documentation format still an open question ([OQ-16](../../open-questions.md)).

## Quality checks

- Every clinical protocol has a version, effective date, and approving clinician
- Protocol changes communicated to all affected staff within 48 hours
- CEU status current for 100% of clinical staff at all times
- Platform training completed within 7 days of feature release
- Competency assessment annually for all clinical staff
- Clinical knowledge base reviewed quarterly for currency

## Scaling trigger

This function activates when Cena Health employs or contracts its first clinical
staff (RDNs, BHNs). Before that, clinical education is handled by partner
organizations. The function scales with clinical headcount and geographic expansion
(multi-state licensure adds complexity).

## Automation roadmap

**Phase 1:** CEU tracking and renewal alerts. Protocol documentation system with
version control. Training completion tracking.

**Phase 2:** Auto-generated training modules from feature documentation. Evidence-based
practice monitoring (agent scans published research for relevant updates).
Competency signals from documentation quality analysis.

**Phase 3:** Adaptive training — agent identifies individual staff knowledge gaps
from their documentation patterns and quality scores, then recommends targeted
education. Clinical knowledge base that updates automatically from guideline
changes and flags items needing human validation.
