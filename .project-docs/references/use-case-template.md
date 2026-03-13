# Use Case Template

Use this structure to document every use case before designing the UI. The use case is the source of truth for what the interface must support.

## Structure

```
## [Use Case ID]: [Descriptive Name]

**User type:** [Patient | Dietitian | Care Coordinator | Kitchen Partner | Administrator]
**Frequency:** [Daily | Weekly | Occasional | Rare]
**Criticality:** [High - errors cause harm | Medium - errors cause friction | Low - errors are recoverable]
**Platform:** [Mobile | Desktop | Both | Voice (AVA)]

### Context
What situation triggers this use case? Where is the user, what were they just doing, what state are they in emotionally and practically?

### Goal
What does the user want to accomplish? State this from the user's perspective, not the system's. "I want to know what meals are coming this week" not "System displays meal schedule."

### Preconditions
What must be true before this use case can begin? (User is logged in, patient has active meal plan, etc.)

### Primary Flow
Numbered steps describing the happy path. Each step should be an observable action or system response.

1. User does X
2. System shows Y
3. User selects Z
4. System confirms

### Alternate Flows
Branches from the primary flow. Reference the step number where they diverge.

- **3a.** If no options match: System suggests alternatives
- **3b.** If user is unsure: System provides contextual help

### Error Conditions
What can go wrong and how does the system handle it?

- **E1.** Network unavailable: Show cached data with "last updated" timestamp
- **E2.** Invalid input: Inline validation with plain-language guidance

### Success Criteria
How do we know this use case was completed successfully? What changed in the system? What does the user see as confirmation?

### Data Requirements
What information does this screen need to display or collect? List the data fields and their sources.

### Accessibility Notes
Any specific accessibility considerations for this use case beyond the baseline (WCAG AA, bilingual support, etc.)

### Related Use Cases
Links to use cases that are adjacent in the user flow or share UI patterns.

### Open Questions
Unresolved decisions or unknowns that need input from stakeholders, engineering, or user research.
```

## Guidelines

- Write goals in the user's language, not system language
- Keep primary flows to 7 steps or fewer. If longer, consider breaking into sub-use cases.
- Every alternate flow and error condition should specify the system's response, not just the condition
- Data requirements should note whether data is read, written, or both
- Open questions are valuable. Don't resolve them prematurely. Flag them and move on.
- Use case IDs should follow the pattern: [Application]-[Module]-[Sequence] (e.g., KP-RCP-001 for Kitchen Partner Recipes #1)
