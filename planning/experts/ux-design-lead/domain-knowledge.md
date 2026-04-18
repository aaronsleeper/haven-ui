# Domain Knowledge — UX Design Lead

What this expert must know to do the job. Organized by sub-domain, with source and
shelf life for each knowledge area.

---

## Interaction design

| Knowledge area | What specifically | Source | Shelf life |
|---|---|---|---|
| Three-panel layout system | Ava's universal layout: left sidebar (queue/nav), center (content/workspace), right (thread/audit). All six surfaces use the same skeleton. | `architecture/ui-patterns.md` | Stable until arch change |
| Approval interaction model | Approval cards are the primary human-agent interaction. Must show context, recommendation, and one-tap action. Collapse to summary after decision. | `architecture/ui-patterns.md`, `architecture/agent-framework.md` | Stable |
| Agent-thread paradigm | The right panel is not a chat — it's an audit log with interaction points. Every agent action is a message. Humans respond to proposals, not prompts. | `vision.md` principle 2 | Core, unlikely to change |
| Queue-driven workflow | Users don't browse — they process queues. The left sidebar is a prioritized work list. Empty queue = good state. | `architecture/ui-patterns.md` | Stable |
| Mobile collapse model | Single-panel with gesture nav. Approval cards render full-screen. Mobile is primarily for queue review away from desk. | `architecture/ui-patterns.md` | Stable |
| Progressive disclosure | Tool calls show condensed output, expandable to full. PHI never rendered in thread — field names and summaries only. | `architecture/ui-patterns.md` | Regulatory driver |

## Healthcare UX patterns

| Knowledge area | What specifically | Source | Shelf life |
|---|---|---|---|
| Clinical workflow ergonomics | Healthcare workers have 30-second task windows between interruptions. Designs must support rapid context-switch and resumption. No multi-step wizards for routine tasks. | Nielsen Norman healthcare studies | ~3 years |
| Error prevention in clinical contexts | Irreversible clinical actions require confirmation with explicit consequence statement. Color alone never indicates status (color blindness prevalence in clinical staff ~8% male). | AHRQ patient safety guidelines | ~5 years |
| EHR fatigue patterns | Users trained on EHRs expect certain patterns (patient banner at top, problem list accessible, timeline views). Diverging from these without reason increases cognitive load. | Industry observation | ~3 years |
| Trust calibration | Users must understand what the agent did, why, and what it's asking them to decide. Opacity erodes trust. Excessive detail erodes efficiency. The thread model solves this by making everything visible but progressive. | Vision principle 1 (agents propose, humans dispose) | Core |
| Accessibility in regulated healthcare | WCAG 2.1 AA is the floor, not the ceiling. Section 508 compliance for any federally funded program. High contrast mode, screen reader support, keyboard navigation are requirements, not nice-to-haves. | WCAG 2.1, Section 508, ADA | Updates every ~3 years |

## Visual design foundations

| Knowledge area | What specifically | Source | Shelf life |
|---|---|---|---|
| Haven design system | Token system, component library, spacing scale, color palette, typography. All Ava UI is built on Haven. | `Lab/haven-ui/` | Updates with haven-ui releases |
| Cena Health brand | Brand colors, voice, photographic style, logo usage. UX must be consistent with brand without being constrained by it. | `Stack Overflowed/Projects/Cena Health/Brand/` | Updates with brand refresh |
| Information density calibration | Clinical tools need higher density than consumer products. Too sparse = too many clicks. Too dense = errors. Target: all information needed for a decision visible without scrolling, with detail one click away. | Domain experience | Stable principle |
| Typography for data | Tabular numbers in data columns. Monospace for IDs and codes. Sufficient contrast for body text in variable lighting (clinic fluorescents). Minimum 14px body for extended reading. | Typographic best practice | Stable |

## Platform-specific knowledge

| Knowledge area | What specifically | Source | Shelf life |
|---|---|---|---|
| Six app surfaces | Provider, Admin, Kitchen, Patient, Partner Portal, AVA. Same layout, different content domains. Know what each role needs from the UI. | `architecture/ui-patterns.md`, `roles/*.md` | Updates with new surfaces |
| Thread message types | system, tool_call, tool_result, approval_request, approval_response, human message. Each has distinct rendering rules. | `architecture/agent-framework.md` | Stable until framework change |
| SLA visualization | Queue items need visible urgency. Critical = immediate visual weight. Low = present but not demanding. Time-in-queue must be scannable, not calculated. | `architecture/agent-framework.md` SLA table | Stable |
| HIPAA rendering constraints | PHI cannot be rendered in thread tool calls. Minimum-necessary display. Session timeout must lock screen. Audit trail of who viewed what. | `vision.md` principle 4, HIPAA Security Rule | Regulatory — ~5 year cycle |

## Design process knowledge

| Knowledge area | What specifically | Source | Shelf life |
|---|---|---|---|
| Component-driven design | Design in components, not pages. Every screen is a composition of reusable parts. New features compose existing components before creating new ones. | Industry standard (Atomic Design) | Stable methodology |
| Responsive breakpoints | Desktop (three-panel), Tablet (two-panel, thread toggles), Mobile (single-panel with gesture nav). Breakpoints defined in Haven. | `Lab/haven-ui/` | Updates with haven-ui |
| Prototype fidelity ladder | Wireframe → annotated mockup → interactive prototype → production component. Each level answers different questions. Don't over-invest in fidelity before the concept is validated. | Design practice | Stable methodology |
| Text-based wireframe methodology | Agents design as structured text descriptions referencing Haven components and tokens — not visual tools. Text wireframes enforce token adherence, compose from existing patterns, and eliminate ambiguity between design error and intentional difference. Visual mockups (Figma or equivalent) are human-authored when needed for stakeholder communication or complex spatial relationships. | Team convention (validated in Vault UX work) | Stable methodology |

## Reference sources

Trusted external sources this expert consults when facing unfamiliar problems,
knowledge gaps, or decisions outside established patterns.

| Source | Domain | Trust level | When to consult |
|---|---|---|---|
| Nielsen Norman Group (nngroup.com) | UX research, usability, interaction patterns | Expert | Unfamiliar interaction pattern, usability heuristic questions, healthcare UX research |
| AHRQ (Agency for Healthcare Research and Quality) | Patient safety, clinical UX, error prevention | Authoritative | Clinical workflow design, error prevention patterns, safety-critical UI decisions |
| W3C WCAG 2.1+ | Accessibility standards | Authoritative | Any accessibility question, contrast ratios, ARIA patterns, keyboard behavior |
| Section 508 Standards | Federal accessibility compliance | Authoritative | Federally funded program requirements, compliance verification |
| Baymard Institute | E-commerce and form UX research | Expert | Form design, checkout flows, data entry patterns (applicable to intake/enrollment) |
| Material Design Guidelines | Component patterns, motion, density | Informational | Reference for common component patterns, responsive behavior, density scales |
| Apple HIG | Mobile interaction patterns, gesture behavior | Informational | Mobile-specific design decisions, gesture navigation, touch targets |
| HIMSS (Healthcare Information and Management Systems Society) | Health IT standards, EHR usability | Expert | EHR integration patterns, clinical workflow standards, interoperability UX |
| Haven design system docs (`Lab/haven-ui/`) | Internal component library and tokens | Authoritative | Every design task — primary reference for available components and token values |
| Cena Health brand guidelines | Brand identity, visual standards | Authoritative | Any patient-facing or partner-facing surface design |