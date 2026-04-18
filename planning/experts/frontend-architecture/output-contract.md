# Output Contract

## Output 1: Responsive implementation spec

**Trigger:** Component or layout needs responsive behavior
**Consumer:** Developer implementing the change, code review

| Field | Type | Description |
|---|---|---|
| component | string | Component path being modified |
| breakpoint_behavior | table | Per-breakpoint (mobile/tablet/desktop): layout, visibility, sizing |
| css_classes | string | Exact Tailwind classes to add/modify |
| js_required | boolean | Whether JS conditional rendering is needed |
| js_rationale | string | If js_required, why CSS can't handle it |
| migration_notes | string | What to change in existing code, what to preserve |

## Output 2: Architecture decision record

**Trigger:** "Should we X?" question about frontend architecture
**Consumer:** Aaron (approval), development sessions

| Field | Type | Description |
|---|---|---|
| title | string | Decision being made |
| context | string | Why this decision is needed now |
| options | array | Options considered with pros/cons |
| decision | string | Recommended option |
| consequences | string | What changes, what trade-offs are accepted |
| assumptions | array | What this decision depends on being true |

## Output 3: Component architecture recommendation

**Trigger:** New feature or component being planned
**Consumer:** Developer implementing the feature

| Field | Type | Description |
|---|---|---|
| component_tree | string | Proposed component hierarchy |
| placement | enum | @ava/ui / app-local |
| state_strategy | string | Where state lives (URL, context, tRPC, local) |
| lazy_loading | boolean | Whether to code-split this component |
| dependencies | array | Other components/packages this depends on |
