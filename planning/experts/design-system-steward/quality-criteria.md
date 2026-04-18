# Quality Criteria

## Component extraction plan

- [ ] All source locations verified to exist in current codebase
- [ ] Canonical API is the union of all variants (no fields dropped without justification)
- [ ] Divergent values resolved with documented rationale
- [ ] Migration steps are ordered and each step leaves the app in a working state
- [ ] Target path follows package conventions in judgment-framework.md

## Token audit report

- [ ] Zero false positives (flagged values are genuinely hardcoded, not already semantic)
- [ ] Every violation has a concrete suggested token (not "use a semantic token")
- [ ] Proposed new tokens follow naming conventions

## Dark mode readiness assessment

- [ ] Census covers all files in the audited scope (no silent omissions)
- [ ] Effort estimate includes both token creation and component migration
