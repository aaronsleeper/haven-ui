# Risk Register — Compliance

Known failure modes ranked by likelihood × impact.

---

| # | Risk | Likelihood | Impact | Current mitigation | Residual risk |
|---|---|---|---|---|---|
| R1 | **Cross-role PHI exposure** — a UI renders PHI fields to a role that shouldn't see them (e.g., kitchen staff sees diagnosis codes) | Medium (pre-launch: design error; post-launch: regression) | Critical — potential HIPAA breach, partner trust damage | PHI field access matrix, compliance review gate on UI designs, RBAC enforcement at middleware | Medium until automated field-level access tests exist in CI |
| R2 | **Consent scope violation** — data operation executes without checking consent, or consent check is misconfigured | Low (if middleware enforcement works) to Medium (if enforcement is UI-only) | Critical — unauthorized use of PHI, potential breach | Consent enforcement at data access layer (A1), audit logging of consent checks | High until A1 is validated by engineering |
| R3 | **Audit gap** — a PHI-accessing action is not logged, creating a compliance blind spot | Medium (new workflows may miss audit triggers) | High — inability to demonstrate compliance during audit, potential regulatory finding | Audit trigger specification covers all current workflows, freshness trigger on new workflow creation | Medium — depends on discipline of updating triggers when workflows change |
| R4 | **Breach misclassification** — incident incorrectly assessed as "not a breach," notification timeline missed | Low (4-factor framework is structured) | Critical — regulatory penalties, mandatory corrective action plan | Structured 4-factor assessment, conservative default (ambiguity = breach), gate tier requires human + legal | Low — framework is sound, but untested with real incidents |
| R5 | **De-identification failure** — research ETL exports PHI to BigQuery | Low (Safe Harbor is prescriptive) | Critical — PHI exposed to researchers, breach affecting research participants | Post-load validation, quarterly manual audit, 24-hour access delay (AD-05 proposal) | Low if validation pipeline is implemented correctly |
| R6 | **State law conflict** — HIPAA preemption assumed but state law is more restrictive | Medium (multi-state operation with CT, CA, TN) | Medium — state-level regulatory exposure | State privacy law monitoring (freshness trigger), OQ-30 deferred but framework needed | Medium — OQ-30 unresolved |
| R7 | **Compliance expert unavailable during workflow** — fallback degrades to conservative defaults, over-restricting access and slowing workflows | Medium (draft expert, pre-launch) | Low — conservative defaults are safe but slow | Fallback modes: checklist for routine reviews, human-covers for novel questions | Low — over-restriction is the safe failure mode |
