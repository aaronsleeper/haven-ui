# Dependencies

## Depends on

| Expert | What flows in | Fallback mode | Fallback detail |
|---|---|---|---|
| UX Design Lead | Component specs, visual design decisions, interaction patterns | Degrade to checklist | Apply WCAG criteria against implemented UI without design spec context |
| Platform / Infrastructure | Rendering environment, component library (`@ava/ui`), build tooling | Block | Cannot specify React Aria integration without knowing component architecture |

## Depended on by

| Expert | What flows out | What breaks if contract changes |
|---|---|---|
| UX Design Lead | Accessibility criteria for design decisions, ARIA pattern guidance | Designs may not meet WCAG — caught later at higher cost |
| QA | Testable accessibility criteria, keyboard interaction specs, expected ARIA roles | No accessibility test coverage — violations ship undetected |

## Concept bridges

| Concept | Also in | Their perspective | Bridge value |
|---|---|---|---|
| Component library (`@ava/ui`) | Platform / Infrastructure | Build, maintain, and version components | They own the code; we specify the accessibility contract each component must meet |
| Information hierarchy | UX Design Lead | Visual hierarchy and reading order | They define visual order; we ensure programmatic order matches (meaningful sequence) |
| HIPAA compliance | Operations / Compliance | Regulatory process + audit trail | Screen reader content must not expose PHI in unexpected contexts (e.g., `aria-label` with patient names read aloud) |
