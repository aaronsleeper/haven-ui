# Output Contract — UX Design Lead

What this expert produces, in what format, and for whom. Downstream consumers
should know exactly what they'll receive.

---

## Primary outputs

### 1. Interaction specification

**Produced when:** A new feature, view, or workflow needs design.

| Field | Format | Description |
|---|---|---|
| surface | enum | Which app surface (Provider, Admin, Kitchen, Patient, Partner, AVA) |
| view_name | string | Descriptive name for this view/interaction |
| layout | diagram | Three-panel composition showing what goes where |
| user_flow | sequence diagram | Step-by-step interaction from user intent to completion |
| component_map | table | Which Haven components are used and how they're configured |
| states | table | All view states: default, loading, empty, error, edge cases |
| approval_interactions | card specs | Any approval cards, with context shown, actions available |
| data_requirements | table | What data the view needs, from which source |
| accessibility_notes | list | WCAG considerations specific to this interaction |

**Consumed by:** Frontend engineering, product management, QA

---

### 2. Component specification

**Produced when:** An existing Haven component doesn't cover the need, or an
existing component needs a new variant.

| Field | Format | Description |
|---|---|---|
| component_name | string | Following Haven naming conventions |
| purpose | string | One sentence: what this component is for |
| variants | table | All variants with visual diff and use case |
| props | table | Configurable properties with types and defaults |
| tokens | table | Design tokens consumed (spacing, color, type) |
| states | table | All interactive states: default, hover, focus, active, disabled, error |
| responsive_behavior | description | How the component adapts across breakpoints |
| accessibility | spec | ARIA roles, keyboard behavior, screen reader announcements |
| do_dont | examples | Correct and incorrect usage to prevent misapplication |

**Consumed by:** Haven design system maintainers, frontend engineering

---

### 3. Design review

**Produced when:** Reviewing an implemented feature or proposed design change.

| Field | Format | Description |
|---|---|---|
| reviewed_item | reference | What was reviewed (PR, mockup, prototype) |
| verdict | enum | approved / approved-with-changes / needs-revision |
| issues | list | Each issue with severity (critical/major/minor), location, and fix |
| praise | list | What works well (reinforces good patterns) |
| consistency_check | table | How this aligns with or diverges from standard patterns |
| accessibility_check | pass/fail | Against WCAG 2.1 AA baseline |

**Consumed by:** Frontend engineering, product management

---

### 4. Usability assessment

**Produced when:** Evaluating a workflow for UX quality — either proactively
during design or reactively when friction is reported.

| Field | Format | Description |
|---|---|---|
| workflow | reference | Which workflow or journey was assessed |
| task_analysis | table | Steps, clicks, decisions, and time estimate per step |
| friction_points | list | Where users slow down, make errors, or need help |
| recommendations | list | Prioritized changes with expected impact |
| severity | enum per item | critical / major / minor / enhancement |
| benchmark | metrics | Comparison to previous version or industry baseline if available |

**Consumed by:** Product management, clinical operations (for workflow design)

---

## Output guarantees

- All interaction specs include all states (not just the happy path)
- All component specs include design-phase accessibility requirements (contrast,
  keyboard interaction, ARIA roles, screen reader behavior). Note: accessibility
  is a shared responsibility — engineering experts own implementation-phase checks,
  QA experts own runtime verification. This expert owns the design specification.
- All outputs reference specific Haven tokens and components rather than
  raw values (no hardcoded px, hex, or font names). Token selection follows the
  usage guidance in Haven's token reference (dependency: Haven must maintain an
  agent-readable token usage guide describing when to use each token, e.g.,
  `padding-sm` for tight component internals vs. `padding-md` for section spacing)
- Design reviews always include at least one positive observation — this serves
  as a behavioral reinforcement signal for the retro log, making successful
  patterns visible and preserving them across review cycles (not sentiment,
  but pattern labeling for self-assessment)
- Usability assessments always include severity ratings and prioritized recommendations
