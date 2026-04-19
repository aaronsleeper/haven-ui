# Dependencies

## Must read before every review

- [DESIGN.md](../../../DESIGN.md) at haven-ui repo root — canonical brand spec. Every rule the reviewer applies traces back to a section anchor here.
- Figma design system file: https://www.figma.com/design/opvzZC7Ds38MNwRFvFuKZe/Haven---Design-System
- Figma screen mocks file: https://www.figma.com/design/NvZceBAZq9uLWTWUY6Teko/temp---screen-export

## Must consult for visual claims

- Figma via MCP (`mcp__claude_ai_Figma__get_design_context`, `get_screenshot`, `get_variable_defs`)
- haven-ui tokens at `packages/design-system/src/styles/tokens/` — see what code currently ships
- Existing pattern library components in `packages/design-system/pattern-library/components/` (HTML, authoritative) — confirm which archetypes exist
- React ports in `packages/ui-react/src/components/` — confirm which have been ported
- `packages/design-system/pattern-library/COMPONENT-INDEX.md` — ground truth for every built component

## Sibling experts

- **design-system-steward** — token discipline overlaps; brand-fidelity defers on raw token values and semantic adoption questions
- **ux-design-lead** — information architecture overlaps; brand-fidelity defers on task-flow structure
- **accessibility** — WCAG compliance is a separate gate
- **frontend-architecture** — code quality is a separate gate

## Upstream artifacts (not authoritative; use only as context)

- `Lab/cena-health-brand/` — OKLCH brand spec. Currently stale; reconciliation pending. Do not cite as source in reviews.
- `planning/` at repo root — decisions.md, convocation-protocol.md, workflow-spec.md

## Human dependencies

- **Aaron** — final taste arbiter. Escalate when a review result contradicts what Aaron would recognize as Haven.
- **Haven Visual Designer** expert (`Lab/cena-health-brand/experts/haven-visual-designer.md`) — consult on novel visual questions that DESIGN.md doesn't cover yet.
