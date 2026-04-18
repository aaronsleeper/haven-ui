# Task Routing

| Task | Model tier | Rationale | Extraction candidate |
|---|---|---|---|
| Identify duplicate patterns | Standard | Pattern matching against known criteria | No -- requires codebase judgment |
| Draft extraction plan | Standard | Applying framework to specific components | No |
| Token audit (grep + classify) | Light | Mechanical search and categorization | Yes -- could be a lint rule |
| Resolve divergent interfaces | Deep | Novel judgment when copies conflict significantly | No |
| Dark mode census | Light | Grep for hardcoded classes, tabulate | Yes -- script candidate |
| Review extraction PR | Standard | Check against quality criteria | No |
