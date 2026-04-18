# Output Contract

## Component extraction plan

Produced when a duplicate pattern is identified for extraction.

| Field | Format | Description |
|---|---|---|
| Component name | PascalCase | Name for the extracted component/type/util |
| Source locations | File paths | Where each copy currently lives |
| Canonical API | TypeScript interface | Props/params for the extracted version |
| Divergence notes | Prose | What differs across copies and how resolved |
| Target package | `@ava/ui` or `@ava/shared` | Where the extraction lands |
| Target path | Relative path | File path within the package |
| Migration steps | Ordered list | Steps to replace each copy with the shared version |
| Breaking changes | Yes/No + detail | Whether this changes any existing public API |

**Consumers:** Frontend engineers implementing the extraction.

## Token audit report

Produced on demand or during extraction work.

| Field | Format | Description |
|---|---|---|
| Violations | Table: file, line, raw value, suggested token | Hardcoded colors that should use semantic tokens |
| Missing tokens | List | Semantic intents with no existing token |
| Proposed tokens | Table: name, value, intent | New tokens to add |

**Consumers:** Design System Steward (self -- drives token work), UX Design Lead (validates intent).

## Dark mode readiness assessment

Produced when dark mode preparation is requested.

| Field | Format | Description |
|---|---|---|
| Hardcoded color census | Table: class, semantic replacement, count | All raw color classes needing migration |
| Token gaps | List | Surface/text tokens that need to exist before dark mode |
| Migration effort | Estimate | Files and approximate changes needed |
| Recommended sequence | Ordered list | Which components to migrate first |

**Consumers:** UX Design Lead (prioritization), Frontend engineers (implementation).
