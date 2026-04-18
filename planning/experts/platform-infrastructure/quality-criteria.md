# Quality Criteria — Platform / Infrastructure

Testable definitions of "good" for every output this expert produces.

---

## Architecture decision proposals

| Criterion | Pass condition | Check method |
|---|---|---|
| Reversibility present | Reversibility field is populated with enum + specific detail about what reversal requires | Field check — non-empty, includes concrete reversal steps |
| What-breaks-if-wrong present | Concrete failure scenario described, not generic ("things could go wrong") | Read for specificity — names the failure mode and its impact |
| HIPAA implications addressed | Proposal states how the decision affects PHI handling, access controls, or audit posture | Check hipaa_implications field is non-empty and specific to this decision |
| Alternatives genuinely considered | At least 2 alternatives with real pros/cons, not strawmen | Each alternative has at least 1 genuine pro — if an alternative has zero pros, it's a strawman |
| Cost estimate grounded | Order-of-magnitude estimate based on GCP pricing, not fabricated | Verify against GCP pricing calculator for named services |
| Self-contained | Reviewer can make a decision without reading external docs | Read proposal cold — does it provide enough context? |
| Team-size awareness | Proposal accounts for 2-person eng team operational capacity | Check that operational burden is explicitly discussed |
| Judgment trail visible | Rationale references a decision framework from judgment-framework.md | Rationale should name which framework was applied |

## Infrastructure specs

| Criterion | Pass condition | Check method |
|---|---|---|
| Mermaid diagram renders | Architecture diagram is valid Mermaid syntax and shows trust boundaries | Render test + boundary check |
| PHI flow identified | Every point where PHI is stored, transmitted, or transformed is labeled | Trace data flow for PHI touchpoints |
| Security at every boundary | Each trust boundary (network, service, user) has authentication/authorization specified | Review security_considerations against architecture_diagram boundaries |
| Deployment is reproducible | Deployment notes are sufficient for the other engineer to deploy without verbal guidance | Could Andrey deploy this from the spec alone? |
| Monitoring covers failure modes | Each component in the diagram has at least one monitoring signal | Cross-reference architecture_diagram components against monitoring_requirements |

## Incident response playbooks

| Criterion | Pass condition | Check method |
|---|---|---|
| Steps are executable | Response steps include specific commands or check procedures, not vague ("investigate the issue") | Each step has a concrete action |
| Escalation path complete | Every severity level has a named escalation target | Check escalation_path covers P1/P2/P3 |
| Communication template ready | Status update template can be sent with only variable substitution, not authoring | Template has placeholders, not blank sections |

---

## Meta-quality

| Criterion | Pass condition | Check method |
|---|---|---|
| Andrey override rate trending down | CTO modifications to proposals decrease over review cycles | Track modifications in retro log |
| Proposal turnaround | Proposals drafted within one session of request, not deferred | Track time-to-draft in retro log |
| Scope discipline | Expert stays in infrastructure — doesn't make product, clinical, or business decisions | Review outputs for out-of-scope recommendations |
| Assumption transparency | Every unvalidated assumption in a proposal is marked and traceable to assumptions index | Cross-reference proposal assumptions against index |
