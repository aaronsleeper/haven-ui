# Risk Register — UX Design Lead

Known failure modes ranked by likelihood and impact. What goes wrong most often,
what's the worst-case scenario, and what mitigations exist.

---

## Risk matrix

| Risk | Likelihood | Impact | Current mitigation | Residual risk |
|---|---|---|---|---|
| **PHI exposure through UI** — design shows patient data that violates minimum-necessary principle | Medium | Critical | Thread rendering rules hide raw PHI; design review checklist includes PHI check | Low — but any new view with patient data reintroduces the risk |
| **Accessibility failure** — shipped UI doesn't meet WCAG 2.1 AA, blocking federally funded users or triggering compliance issue | Medium | High | Quality criteria include contrast/keyboard/screen reader checks; Haven components built accessible by default | Medium — custom components and composition patterns can introduce failures not caught by component-level checks |
| **Approval card ambiguity** — approval interaction doesn't give enough context, leading clinician to approve/reject without understanding consequences | Medium | High | Judgment framework requires approval cards to show context + recommendation + consequence; output contract requires approval interaction spec | Medium — this is the highest-stakes interaction and context varies by domain |
| **Density miscalibration** — clinical view is too sparse (workflow friction) or too dense (error-prone) | High | Medium | Density heuristic in judgment framework keyed to role; usability assessment output identifies friction points | Medium — no substitute for actual usage observation, which is limited in planning phase |
| **Consistency drift** — different surfaces evolve independently and diverge from the universal pattern | Medium | Medium | Three-panel model documented; design review output includes consistency check | Medium — drift happens slowly and is hard to catch without periodic cross-surface audit |
| **Stale component references** — design specs reference Haven components or tokens that have been renamed or removed | Medium | Low | Freshness trigger for Haven releases; dependency graph includes Haven | Low — caught in implementation, but causes rework |
| **Over-design** — investing in high-fidelity design for features that aren't validated yet | Medium | Medium | Fidelity ladder in judgment framework: wireframe before mockup before prototype | Medium — pressure to "look finished" can override the ladder |
| **Agent thread overload** — thread becomes too long/noisy for humans to scan, defeating the audit-log-as-UI model | Low | High | Progressive disclosure in thread rendering (condensed tool calls, expandable detail) | Medium — as workflows get more complex, thread length grows; may need summarization or segmentation patterns |
| **Mobile degradation** — responsive collapse loses critical information or creates unusable interactions | Medium | Medium | Mobile behavior required in every interaction spec; approval cards designed mobile-first | Medium — mobile testing happens late and gets deprioritized |
| **EHR pattern conflict** — Ava patterns conflict with EHR patterns users are trained on, causing confusion | Low | Medium | Domain knowledge includes EHR fatigue patterns; judgment framework considers existing mental models | Low — most divergence is intentional (Ava is not an EHR) |

---

## Highest-stakes decisions

These are the design decisions where getting it wrong has disproportionate consequences:

1. **Approval card design** — If a clinician can't quickly understand what they're
   approving, the whole "agents propose, humans dispose" model breaks. Either they
   rubber-stamp (unsafe) or they slow down to investigate (defeats efficiency).

2. **PHI display boundaries** — Every new view that shows patient data is an opportunity
   to leak more than minimum-necessary. The rule is clear (no raw PHI in threads) but
   application to new views requires judgment.

3. **Queue prioritization visualization** — If urgent items don't visually dominate,
   a coordinator could process queue items in the wrong order. If everything looks
   urgent, nothing is.

4. **Error and failure state design** — "An error occurred" in a clinical system is
   unacceptable. The failure state must tell the user what happened, what was affected,
   and what they need to do. A vague error could mean a patient doesn't get their meal
   or a claim misses its filing deadline.

5. **Voice interaction hand-off (AVA)** — The transition from AI voice agent to human
   must be seamless. If a patient in distress experiences confusion during hand-off,
   the clinical and reputational consequences are severe.
