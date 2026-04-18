# Freshness Triggers — UX Design Lead

External events or changes that invalidate part of this expert's knowledge.
When a trigger fires, the expert's health status should downgrade and the
relevant domain knowledge should be re-researched.

---

## Triggers

| Trigger | Source | What it invalidates | Check method | Expected frequency |
|---|---|---|---|---|
| WCAG version update | W3C | Accessibility requirements across all specs | Check W3C WCAG page for version changes | Every ~3 years |
| Haven design system release | `Lab/haven-ui/` releases | Component specs, token references, responsive breakpoints | Check haven-ui git log for breaking changes | Monthly |
| Cena Health brand refresh | Brand team / Aaron | Visual design layer, color usage, typography | Check brand guidelines for updates | Every 1-2 years |
| New Ava app surface added | `architecture/ui-patterns.md` changes | Three-panel adaptation table, role-specific density rules | Check ui-patterns.md for new surface entries | As needed |
| New role defined | `roles/*.md` new file | Density and workflow heuristics for that role | Check roles directory for new files | As needed |
| Agent framework architecture change | `architecture/agent-framework.md` | Thread rendering rules, approval card format, message types | Check agent-framework.md for structural changes | Quarterly |
| Clinical workflow change | `workflows/*.md` updates | Interaction specs for affected clinical views | Check workflow files for significant revisions | Quarterly |
| Platform/framework migration | Engineering decision | Component implementation assumptions, responsive model | Decisions.md or direct notification | Rare |
| Healthcare UX research publication | Nielsen Norman, AHRQ, HIMSS | Clinical workflow ergonomics, EHR fatigue patterns | Web search during update sweep | Annually |
| Section 508 update | US government | Accessibility compliance requirements for federally funded programs | Check Section 508 site during update sweep | Every ~5 years |
| Mobile OS design guideline change | Apple HIG, Material Design | Mobile interaction patterns, gesture behavior | Check during update sweep | Annually |
| Figma platform change | Figma release notes | Design workflow, prototyping capabilities, handoff process | Check Figma changelog during update sweep | Quarterly |

---

## Trigger evaluation during `/expert-update`

For each trigger, the update sweep should:

1. **Check:** Has this trigger fired since `last-validated`?
2. **Assess:** Does the change affect this expert's domain knowledge or judgment?
3. **Scope:** Which layers need updating? (Most triggers only affect domain-knowledge.md)
4. **Act:** Update the affected layers, bump version, reset `last-validated`

If a trigger fires but the change is minor (e.g., WCAG clarification that doesn't
change requirements), note it in the retro log and keep the health status green.
