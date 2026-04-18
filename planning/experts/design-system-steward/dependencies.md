# Dependencies

## Depends on

| Expert | What flows in | Fallback mode | Fallback detail |
|---|---|---|---|
| UX Design Lead | Component design specs, visual language decisions, token intent | degrade-to-checklist | Use existing Haven tokens and admin app patterns as reference; flag decisions for UX review |

## Depended on by

| Expert | What flows out | What breaks if interface changes |
|---|---|---|
| UX Design Lead | Token naming conventions, component API contracts | Design specs may reference stale component names or unavailable props |
| All frontend experts | Shared components, tokens, type definitions | Build failures or visual inconsistency if exports change without notice |

## Concept bridges

| Concept | Also in | Their perspective | Bridge value |
|---|---|---|---|
| Component API design | UX Design Lead | Defines visual behavior and interaction patterns | They define what it does; we define the prop interface and extraction boundary |
| Token system | UX Design Lead | Uses tokens to specify designs | They consume tokens; we govern naming, layering, and lifecycle |
| Type safety | Platform / Infrastructure | TypeScript strictness, shared type patterns | They set TS conventions; we apply them to component/UI types |
