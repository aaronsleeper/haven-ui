# Dependencies

## Depends on

| Expert | What flows in | Fallback mode | Fallback detail |
|---|---|---|---|
| **UX Design Lead** | Layout specs, interaction patterns, responsive behavior requirements, journey maps | human-covers | Aaron provides layout direction; architecture proceeds with stated assumptions |
| **Platform-Infrastructure** | API contracts (tRPC router types), auth patterns, deployment constraints | checklist | Use existing tRPC types as contract; flag when API changes affect frontend |

## Depended on by

| Consumer | What flows out | Impact if unavailable |
|---|---|---|
| **Design System Steward** (future) | Component architecture constraints, @ava/ui boundaries, responsive patterns | Design system components may not align with architecture patterns |
| **UX Design Lead** | Feasibility feedback on proposed interactions, responsive capability constraints | Designs may specify patterns that are expensive to implement |

## Concept bridges

| Concept | Also in | Their perspective | Bridge value |
|---|---|---|---|
| ThreePanelLayout | UX Design Lead | Information hierarchy, panel content priority | They define what goes where; we define how it responds to viewport |
| @ava/ui components | Design System Steward (future) | Visual consistency, design tokens | They own the design spec; we own the component architecture |
| tRPC queries | Platform-Infrastructure | API design, type safety, performance | They own the API shape; we own how it's consumed in React |
