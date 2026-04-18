# Risk Register — Patient Ops

Known failure modes ranked by likelihood × impact.

---

| # | Risk | Likelihood | Impact | Current mitigation | Residual risk |
|---|---|---|---|---|---|
| R1 | **Patient falls through gap** — patient stuck in a status with no one working on it, no alert fires | Medium (pre-operational: untested detection logic) | High — patient not receiving care, partner trust damage, potential clinical harm if high-risk | Stuck patient detection at 7-day threshold, no-limbo assumption (A1), coordinator morning triage pattern | Medium until detection is tested with real patients |
| R2 | **Wrong transition executed** — patient advanced to a status without prerequisites met (e.g., active without RDN approval) | Low (hardcoded gates prevent the highest-risk cases) | Critical — patient receives care under an unapproved plan, compliance violation | Hardcoded gates for care plan, discharge. Prerequisite verification before every transition. | Low — hardcoded gates are the strongest control |
| R3 | **Review conflict misresolved** — reconciliation step applies the wrong authority rule, incorrect finding overrides correct one | Medium (authority rules are clear for known conflicts, but novel conflicts may not fit) | High — clinical error propagated into approved care plan | Authority rules in judgment framework, human gate catches most errors at RDN/coordinator step | Medium — depends on whether novel conflicts surface |
| R4 | **Queue overwhelm** — coordinator receives too many items, misses critical ones buried in volume | Medium (scales with patient panel size) | High — SLA breaches, delayed care, coordinator burnout | Priority classes, SLA escalation, morning triage pattern, filtering by type | Medium — mitigation is design, not automation |
| R5 | **Downstream trigger failure** — care plan locks but meal prescription, scheduling, or monitoring doesn't fire | Low (triggers are mechanical) | Medium — patient is "active" but not receiving expected services | Independent triggers (one failure doesn't block others), monitoring for expected downstream events | Low if monitoring is implemented |
| R6 | **Discharge data loss** — transition summary incomplete, outcome metrics missing, partner not notified | Medium (discharge has many closure steps) | Medium — incomplete outcomes reporting, partner dissatisfaction, billing gaps | Structured discharge package with boolean completion tracking per action | Low — structured checklist catches omissions |
