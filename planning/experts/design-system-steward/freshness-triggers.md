# Freshness Triggers

| Trigger | Source | Check method | Expected frequency |
|---|---|---|---|
| New component added to @ava/ui | Code repo | Monitor packages/ui/src/components/ | Monthly |
| Haven token file changed | Code repo | Diff on packages/ui/src/tokens/*.css | As needed |
| New app added to monorepo | Code repo | Monitor apps/ directory | Rare |
| Tailwind major version upgrade | package.json | Version bump in root or ui package | Annual |
| Second external consumer of @ava/ui | Code repo or planning docs | New app importing @ava/ui | Once -- triggers end of flag-day exception |
