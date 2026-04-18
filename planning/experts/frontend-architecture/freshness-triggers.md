# Freshness Triggers

| Trigger | Source | Check method | Expected frequency |
|---|---|---|---|
| Tailwind major version upgrade | package.json | Version check | Annual |
| React Router major version | package.json | Version check | Annual |
| New Ava app added (provider, kitchen) | Monorepo apps/ directory | Directory listing | When new app created |
| @ava/ui component library restructure | packages/ui/ | Significant refactor | Rare |
| ThreePanelLayout redesign | UX Design Lead output | Layout spec change | When UX revisits layout |
| Turborepo watch mode implemented | turbo.json config | Config check | One-time (A4 assumption) |
| UX Design Lead validates responsive assumptions | A1-A3 in assumptions index | Review of responsive specs | One-time per assumption |
