# Quality Criteria — UX Design Lead

Testable definitions of "good" for every output this expert produces. Each criterion
is observable and evaluable — not subjective.

---

## Interaction specifications

| Criterion | Pass condition | Check method |
|---|---|---|
| Three-panel compliance | Layout uses standard left/center/right model or documents why it doesn't | Visual inspection against `ui-patterns.md` |
| State completeness | All states documented: default, loading, empty, error, edge cases | Checklist — each state has a description or wireframe |
| Approval card quality | Every approval interaction shows: context, recommendation, primary action, secondary actions, optional note | Compare against approval card spec in `ui-patterns.md` |
| Data grounding | Every data field shown in the spec has a named source (API, computed, user input) | Cross-reference data_requirements table |
| Haven component coverage | ≥90% of UI elements map to existing Haven components | Count novel elements vs. existing components |
| Role appropriateness | Information density matches the target role (clinical=high, patient=low, kitchen=scannable) | Compare against density heuristic in judgment framework |
| Mobile behavior defined | Spec includes responsive collapse behavior for tablet and mobile | Check for breakpoint documentation |
| Information hierarchy | Content is organized by priority for the target use case: most critical information (decisions, alerts, key metrics) is most prominent; supporting detail is accessible but secondary; information order matches the user's expected operational flow | Review layout against target role's workflow steps — does the hierarchy match how they process information? |

## Component specifications

| Criterion                | Pass condition                                                                                | Check method                                          |
| ------------------------ | --------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| Token compliance         | Every visual value (color, spacing, size, font) references a Haven design token               | Grep spec for raw values — zero hardcoded px/hex/font |
| State completeness       | All interactive states documented: default, hover, focus, active, disabled, error             | Checklist                                             |
| Keyboard accessibility   | Full keyboard interaction defined: tab order, enter/space behavior, arrow key behavior        | Review ARIA + keyboard spec section                   |
| Screen reader behavior   | ARIA roles and announcements specified                                                        | Review accessibility section                          |
| Contrast compliance      | All text and interactive elements meet WCAG 2.1 AA contrast ratios (4.5:1 body, 3:1 large/UI) | Contrast checker tool against token values            |
| Responsive specification | Behavior defined at each breakpoint (desktop, tablet, mobile)                                 | Review responsive_behavior section                    |

## Design reviews

| Criterion | Pass condition | Check method |
|---|---|---|
| Issue specificity | Every issue identifies: what's wrong, where, why it matters, and how to fix it | Review each issue entry |
| Severity calibration | Critical = blocks user or violates compliance. Major = measurable friction. Minor = polish. Enhancement = nice-to-have. | Check severity assignments against definitions |
| Consistency grounding | Consistency issues reference the specific pattern being violated | Check each consistency flag has a source reference |
| Balanced feedback | Review includes both issues and things done well | Check praise section is non-empty |

## Usability assessments

| Criterion | Pass condition | Check method |
|---|---|---|
| Task measurability | Each step has estimated clicks, decisions, and time | Review task_analysis table completeness |
| Recommendation actionability | Each recommendation is specific enough to implement without further design | Review: could a developer act on this? |
| Prioritization justification | Priority ranking has stated rationale (impact × effort, user frequency, error severity) | Check for rationale on each recommendation |

---

## Meta-quality: what makes the expert itself good

These criteria evaluate the expert's overall calibration, not individual outputs.

| Criterion | Pass condition | Check method |
|---|---|---|
| Prediction accuracy | Design recommendations, when implemented, produce the expected outcome (measured by usability metrics, user feedback, or error rates) | Retro log review — compare predicted vs. actual outcomes |
| Judgment consistency | Similar design problems receive similar solutions unless the context genuinely differs | Compare retro log entries for analogous situations |
| Staleness detection | Expert flags when its own domain knowledge is out of date rather than producing stale recommendations | Freshness trigger check during `/expert-update` |
| Scope discipline | Expert stays in its lane — doesn't make product strategy calls, engineering decisions, or brand choices | Review outputs for out-of-scope recommendations |
| Override rate trending down | Proportion of recommendations that humans override decreases over time as judgment calibrates | Compare override counts across review cycles in retro log |
| 360 feedback integration | Expert demonstrates uptake of peer feedback — growth areas from cycle N show improvement by cycle N+2 | Compare successive 360 reviews for recurring themes |
| Interaction capture rate | Expert logs interaction summaries for ≥80% of conversations where its domain was active | Count summaries vs. known active conversations per review period |
| Extraction rate | Expert identifies and proposes at least one deterministic extraction per review cycle as task patterns stabilize | Review task-routing.md extraction candidates — are new ones being identified? |
| Model tier efficiency | No task runs at a higher model tier than it needs — verified by checking whether downgraded tasks maintain output quality | Compare output quality at current tier vs. one tier lower for stable tasks |
| Determinism awareness | Expert actively flags when its probabilistic output could be replaced by a function, rather than continuing to reason through mechanical work | Review interaction summaries for repeated identical structures that weren't flagged |
