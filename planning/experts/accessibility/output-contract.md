# Output Contract

## 1. Accessibility audit report

Per-page or per-component WCAG compliance assessment.

| Field | Format | Description |
|---|---|---|
| Page/component | string | What was audited |
| Violations | table | Criterion ID, severity (critical/major/minor), element selector, current state, remediation |
| ARIA pattern | string | Which WAI APG pattern applies |
| Priority | 1-6 | Per the remediation priority order in judgment-framework |

**Consumers:** UX Design Lead (design changes), Platform/Infrastructure (implementation), QA (test criteria)

## 2. Component ARIA specification

For each `@ava/ui` component that needs accessibility work:

| Field | Format | Description |
|---|---|---|
| Component name | string | The `@ava/ui` component |
| React Aria primitive | string | Which React Aria component to use |
| Required roles | list | ARIA roles the component must expose |
| Required states/properties | list | `aria-*` attributes with expected values |
| Keyboard interactions | table | Key → action mapping |
| Focus management | string | Where focus moves on open/close/activate |

**Consumers:** Platform/Infrastructure (implementation), QA (keyboard testing)

## 3. Implementation recommendation

Specific file-level change mapping for remediation:

| Field | Format | Description |
|---|---|---|
| File path | string | Source file to modify |
| Current pattern | code snippet | What exists now |
| Recommended pattern | code snippet | What it should become (React Aria) |
| WCAG criteria addressed | list | Which success criteria this fixes |
| Effort estimate | S/M/L | Implementation complexity |

**Consumers:** Platform/Infrastructure (direct implementation input)
