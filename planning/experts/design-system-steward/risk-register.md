# Risk Register

| Risk | Likelihood | Impact | Mitigation | Residual |
|---|---|---|---|---|
| Extraction introduces visual regression (colors shift, spacing breaks) | Medium | Medium | Before/after screenshot comparison during extraction PRs | Low |
| Premature extraction locks in wrong API before usage patterns stabilize | Medium | High | Pre-MVP flag-day exception; extract only patterns with 3+ identical copies or cross-app usage | Medium |
| Token rename without codemod leaves broken references | Low | High | Codemod required for all token renames; grep verification step | Low |
| Divergent copies continue to be created during extraction work | Medium | Medium | Lint rule or PR review checklist for new component creation | Low |
