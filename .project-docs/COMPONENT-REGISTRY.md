# Haven UI — Component Registry

**This is the authoritative, exhaustive list of every component that must exist in the pattern library.**

The `/pl-build` command reads this file to find the next unbuilt component and build it.
Do not remove rows. Do not reorder sections. Update the Status column only.

Status values (progression is left-to-right; later states imply earlier ones):
- `missing` — not yet built
- `in-progress` — currently being built
- `built` — pattern-library HTML exists, semantic class in `components.css`, COMPONENT-INDEX row, QA passes
- `brand-reviewed` — built + reviewed against Cena brand spec
- `react-ported` — also has a matching React component in `packages/ui-react/` produced by the `ui-react-porter` skill (1:1 class mirror of the pattern-library HTML)

**Note:** `react-ported` cannot be assigned until the monorepo scaffold lands in Commit B of the haven-ui stack-and-workflow rollout (see `~/.claude/plans/haven-ui-stack-and-workflow-consult.md`). The status value is defined now so the registry model doesn't need another rewrite when the scaffold exists.

---

## How the build sprint works

1. Run `/pl-build` in Claude Code
2. The agent finds the first `missing` row in this file
3. It builds that component (CSS + pattern library page + COMPONENT-INDEX row)
4. It runs the QA checklist
5. It marks the row `built` and commits
6. Repeat

Never mark a row `built` until the QA checklist passes and the component is
visible at localhost:5173/packages/design-system/pattern-library/pages/.

---

## Foundations

| Component | PL Page | Status | Notes |
|---|---|---|---|
| Colors | `pages/foundations-colors.html` | brand-reviewed | Reference only |
| Typography | `pages/foundations-typography.html` | built | Reference only — update to show Plus Jakarta Sans + Source Sans 3 |
| Spacing | `pages/foundations-spacing.html` | built | Reference only |
| Motion / Animation | `pages/foundations-motion.html` | built | Show all `--duration-*` and `--ease-*` tokens with live demos |
| Iconography | `pages/foundations-icons.html` | built | FA Pro icon reference — categories, usage rules |

---

## Layout

| Component | PL Page | Status | Notes |
|---|---|---|---|
| Card (all variants) | `pages/layout-cards.html` | built | |
| Stat Card | `pages/layout-stat-card.html` | built | |
| Container | `pages/layout-container.html` | built | |
| Page Header | `pages/layout-page-header.html` | built | |
| Section Title | `pages/layout-section-title.html` | built | |
| Sticky Footer | `pages/layout-sticky-footer.html` | built | |
| Grid | `pages/layout-grid.html` | built | |
| Prose Section | `pages/layout-prose-section.html` | built | |
| App Shell / Sidebar | `pages/layout-app-shell.html` | built | |
| Divider | `pages/layout-divider.html` | built | Horizontal rule, labeled divider, vertical divider |
| KV Table | `pages/layout-kv-table.html` | built | Key-value definition table |
| Comparison Panel | `pages/layout-comparison-panel.html` | built | Side-by-side comparison layout |
| Issues Sidebar | `pages/layout-issues-sidebar.html` | built | Persistent right-side issue tracking panel |
| Field Row | `pages/layout-field-row.html` | built | Stacked label+input row pattern |

---

## Buttons

| Component | PL Page | Status | Notes |
|---|---|---|---|
| Primary | `pages/buttons.html` | built | |
| Secondary | `pages/buttons.html` | built | |
| Outline | `pages/buttons.html` | built | |
| Danger | `pages/buttons.html` | built | |
| Danger Outline | `pages/buttons.html` | built | |
| Icon Button | `pages/buttons.html` | built | |
| Button Sizes | `pages/buttons.html` | built | |
| Dark Mode Toggle | `pages/buttons.html` | built | |
| Button Group | `pages/btn-group.html` | built | Horizontal group of connected buttons (Preline HSButtonGroup or custom) |
| Loading State | `pages/btn-loading.html` | built | Spinner inside button, disabled interaction |

---

## Badges & Status

| Component | PL Page | Status | Notes |
|---|---|---|---|
| Badge variants | `pages/badges.html` | built | |
| Trend Badge | `pages/badges.html` | built | |
| Severity Badge | `pages/badges.html` | built | |
| Sentiment Badge | `pages/badges.html` | built | |
| SDOH Badge | `pages/badges.html` | built | |
| AI Insight Badge | `pages/badges.html` | built | |
| Removable Badge | `pages/badges.html` | built | |
| Indicator / Dot | `pages/badges-indicator.html` | built | Small status dot — online/offline/busy, pulse variant |
| Avatar | `pages/avatar.html` | built | Initials, image, size variants, group/stack |
| Spinner | `pages/spinner.html` | built | Loading spinner — sizes, colors |

---

## Alerts

| Component | PL Page | Status | Notes |
|---|---|---|---|
| Alert variants | `pages/alerts.html` | built | success/warning/error/info |
| Alert Banner | `pages/alerts.html` | built | Full-bleed edge-to-edge |
| Alert Stripe | `pages/alerts.html` | built | Full-height icon column |
| Alert Inset | `pages/alerts.html` | built | Mobile card list variant |
| Alert Warning Btn | `pages/alerts.html` | built | Contextual button inside warning alert |
| Toast | `pages/toast.html` | built | Transient notification — 4 variants, enter/exit animation |

---

## Forms

| Component | PL Page | Status | Notes |
|---|---|---|---|
| Text Input (all types) | `pages/inputs.html` | built | All input types + states |
| Input Group | `pages/inputs.html` | built | Prefix/suffix addon |
| Textarea | `pages/forms.html` | built | |
| Select (native) | `pages/forms.html` | built | |
| Select (haven custom) | `pages/forms.html` | built | `.select-haven` |
| Checkbox | `pages/forms.html` | built | |
| Radio | `pages/forms.html` | built | |
| Toggle / Switch | `pages/forms-toggle.html` | built | On/off toggle — CSS-only hidden checkbox + label |
| Range Slider | `pages/range-sliders.html` | built | |
| Clipboard / Copy | `pages/clipboard.html` | built | |
| Advanced Select | `pages/forms.html` | built | Preline HSSelect — searchable, multi-select |
| Toggle Password | `pages/forms.html` | built | Preline HSTogglePassword |
| Strong Password | `pages/forms.html` | built | Preline HSStrongPassword |
| Toggle Count | `pages/forms.html` | built | Preline HSToggleCount |
| PIN Input | `pages/forms.html` | built | Preline HSPinInput |
| Copy Markup | `pages/forms.html` | built | Preline HSCopyMarkup |
| Stepped Form | `pages/forms-stepped.html` | built | Multi-step vertical tab form |
| Fieldset | `pages/forms.html` | built | |
| Form Validation | `pages/forms-validation.html` | built | Error states, success states, inline messages |
| File Upload | `pages/forms-file-upload.html` | built | Drag-drop zone, file list, progress |
| Date Picker | `pages/forms-datepicker.html` | built | Preline HSDatepicker |
| Time Picker | `pages/forms-timepicker.html` | built | Scroll-column picker on hs-dropdown. 12h/24h variants. JS: timepicker.js |
| Tags Input | `pages/forms-tags-input.html` | built | Free-entry tag chips — vanilla JS (no Preline plugin) |
| Color Picker | `pages/forms-color-picker.html` | built | Swatch selector for meal type / status |
| Combobox | `pages/forms-combobox.html` | built | Autocomplete with open dropdown — Preline HSCombobox |

---

## Navigation

| Component | PL Page | Status | Notes |
|---|---|---|---|
| Breadcrumb | `pages/navigation.html` | built | |
| Filter Pills | `pages/navigation.html` | built | |
| Section Nav | `pages/navigation.html` | built | In-page jump nav |
| Segmented Control | `pages/navigation.html` | built | |
| Tab Nav | `pages/navigation.html` | built | |
| Sidebar Sub-nav | `pages/navigation.html` | built | Indented accordion sub-items |
| Stratification Bar | `pages/navigation.html` | built | |
| Navbar / Top Bar | `pages/nav-topbar.html` | built | Top application bar — logo, nav links, actions |
| Pagination | `pages/pagination.html` | built | |
| Stepper | `pages/stepper.html` | built | Horizontal step indicator — Preline HsStepper |
| Mobile Bottom Nav | `pages/layout-mobile-bottom-nav.html` | built | Patient app only |

---

## Data Display

| Component | PL Page | Status | Notes |
|---|---|---|---|
| Data Table | `pages/data-display.html` | built | |
| KV Table | `pages/data-display.html` | built | |
| Stat Card | `pages/data-display.html` | built | |
| Table Section Divider | `pages/data-display.html` | built | |
| Empty State | `pages/data-display.html` | built | |
| Pagination | `pages/data-display.html` | built | |
| Skeleton Loader | `pages/data-display.html` | built | |
| Activity Feed | `pages/data-activity-feed.html` | built | |
| Timeline | `pages/data-timeline.html` | built | |
| Medication Row | `pages/data-medication.html` | built | Medication list row — icon, name, dose, schedule |
| Alert Summary Row | `pages/data-alert-summary.html` | built | Alert list row — severity, title, status, date |
| Pipeline Bar | `pages/data-pipeline-bar.html` | built | |
| Progress Bar | `pages/data-progress.html` | built | Linear progress — labeled, colored variants |
| List Group | `pages/data-list-group.html` | built | Bordered list with optional actions — no Preline needed |
| Accordion (data) | `pages/accordion.html` | built | Content accordion — Preline HSAccordion |
| Collapse | `pages/collapse.html` | built | Single inline show/hide — Preline HSCollapse |

---

## Overlays

| Component | PL Page | Status | Notes |
|---|---|---|---|
| Modal | `pages/overlays.html` | built | |
| Dropdown | `pages/overlays.html` | built | |
| Tooltip | `pages/overlays.html` | built | |
| Popover | `pages/overlays.html` | built | |
| Drawer | `pages/overlays.html` | built | |
| Context Menu | `pages/overlays-context-menu.html` | built | Right-click / long-press menu |
| Confirm Dialog | `pages/overlays-confirm.html` | built | Destructive action confirmation modal variant |
| Bottom Sheet | `pages/overlays-bottom-sheet.html` | built | Mobile-only drawer from bottom — patient app |

---

## Toolbars

| Component | PL Page | Status | Notes |
|---|---|---|---|
| Toolbar | `pages/toolbar.html` | built | |
| Search Input | `pages/toolbar.html` | built | |
| Filter Tags | `pages/toolbar.html` | built | |
| Tag Group | `pages/toolbar.html` | built | |
| Tag Container | `pages/toolbar.html` | built | |

---

## Charts & Utilities

| Component | PL Page | Status | Notes |
|---|---|---|---|
| Chart Line | `pages/charts.html` | built | |
| Chart Bar | `pages/charts.html` | built | |
| Chart Sparkline | `pages/charts.html` | built | |
| HEDIS Grid | `pages/charts.html` | built | |
| ROI Calculator | `pages/charts.html` | built | |
| Calendar Widget | `pages/charts.html` | built | |

---

## Healthcare / Clinical (Domain-specific)

| Component | PL Page | Status | Notes |
|---|---|---|---|
| Alert Category Card | `pages/healthcare.html` | built | |
| Clinical Metric Card | `pages/healthcare.html` | built | |
| Patient Card | `pages/healthcare.html` | built | |
| Partner List Item | `pages/healthcare.html` | built | |
| Partner Alert Row | `pages/healthcare.html` | built | |
| Meal Card (patient app) | `pages/healthcare.html` | built | |
| Feedback Rating Card | `pages/healthcare.html` | built | |
| Pref Image Card | `pages/healthcare.html` | built | |
| Pref Row Control | `pages/healthcare.html` | built | |
| Delivery Status Card | `pages/healthcare.html` | built | |
| Message Bubbles | `pages/healthcare.html` | built | |
| Nutrition List | `pages/healthcare.html` | built | |
| AI Field Indicators | `pages/healthcare.html` | built | |
| Meal Assignment Grid | `pages/healthcare-meal-grid.html` | built | Kitchen-specific |
| Session Mode Bar | `pages/healthcare.html` | built | |
| SDOH Badge | `pages/badges.html` | built | |
| Performance Metric Card | `pages/healthcare.html` | built | |
| Stratification Bar | `pages/navigation.html` | built | |

---

## Complex / Composed

| Component | PL Page | Status | Notes |
|---|---|---|---|
| Prompt Input | `pages/complex.html` | built | AI chat input |
| Chat Interface | `pages/complex.html` | built | Bubble layout |
| Stepped Form | `pages/forms-stepped.html` | built | |
| Issues Sidebar | `pages/complex.html` | built | |
| Notification Center | `pages/complex-notifications.html` | built | Grouped notification list with dismiss |
| Command Palette | `pages/complex-command-palette.html` | built | Keyboard-driven search/action launcher |

---

## Patient App — A2UI Renderer (queue 2026-05-07)

Source queue: `apps/patient/design/a2ui-component-queue.md`. 29 components in tier order — Tier 1a = foundational chat-affordance primitives (10), Tier 1b = foundational right-pane primitives (10), Tier 1c = per-flow right-pane primitives (8), Tier 2 = composition (1). Vertical-slice each: one full primitive end-to-end before the next. Cross-reference per-component context against `Knowledge/Projects/Cena Health/Partners/UCONN Health/capabilities/development/flows/a2ui-haven-gap.md` (uconn-pilot-docs).

### Tier 1a — Chat-affordance primitives

| Component | PL Page | Status | Notes |
|---|---|---|---|
| chat-button-row | `pages/chat-button-row.html` | built | Tier-agnostic row (tier comes from btn-* child); single + dual default to btn-secondary; `.has-helper` modifier stacks `.chat-row-helper` paragraph below. Helper-gate (disabled + aria-describedby) vs helper-consequence (enabled). Covers C-1, C-2, C-14. |
| chat-chip-row | `pages/chat-chip-row.html` | built | Base + `.is-soft` modifier (soft-third option). Covers C-3, C-6, C-7, C-8, C-12. |
| chat-tag-group | `pages/chat-tag-group.html` | built | Extends `complex-tag-group`. Preference-confirmation variant with selected-state highlighting + inline Save/Skip. Restaurant-menu register only. |
| chat-handoff-trigger | `pages/chat-handoff-trigger.html` | built | Persistent talk-to-a-person affordance. Two variants: header chip (desktop) + sticky-footer button (mobile). Tier: tertiary. Renamed from `talk-to-person-trigger`. |
| chat-numeric-input | `pages/chat-numeric-input.html` | built | Extends `nutrition-input` family. Unit-toggle (lb/kg, %, etc.); defaults to last-used unit. |
| chat-paired-numeric | `pages/chat-paired-numeric.html` | built | BP-specific. Two `<input type=number>` with slash separator, no unit toggle. |
| chat-time-preference-picker | `pages/chat-time-preference-picker.html` | built | Free-text input + two chip rows (day-of-week + time-of-day). Free text overrides chip selection. |
| chat-sheet-link | `pages/chat-sheet-link.html` | built | Extends `text-link` + `overlay-bottom-sheet`. Inline link in agent message that opens right-pane sheet. Renamed from `chat-mobile-link`. |
| chat-status-row | `pages/chat-status-row.html` | built | Extends `thread-msg-system`. Patient-app variant for CC takeover ("[CC first name] joined"). Subdued register. |
| patient-chat-message | `pages/patient-chat-message.html` | built | Extends `complex-chat`. Ava-styled bubble (dot-sparkle leading indicator + plain Body/02, no bubble) per DESIGN.md. Distinct from coordinator's thread-msg-* family. |

### Tier 1b — Foundational right-pane primitives

| Component | PL Page | Status | Notes |
|---|---|---|---|
| budget-meter | `pages/budget-meter.html` | missing | Extends `data-progress`. Variants: live-update, error state ("Over budget by $X"), $0 first-time, post-order ("$190 of $200 used"). |
| quantity-stepper | `pages/quantity-stepper.html` | missing | Patient-app version distinct from kitchen partials (per CLAUDE.md "must not be used in other apps"). |
| appointment-card | `pages/appointment-card.html` | missing | RDN name, date/time, location, "Add to calendar". Used in onboarding Fork A, idle next-appointment, request-appointment confirmation. |
| appointments-list | `pages/appointments-list.html` | missing | Read-only list of upcoming appointments. May compose `data-list-group` + appointment-row. |
| pending-request-card | `pages/pending-request-card.html` | missing | Requested type + preference window + status + expected response window. |
| delivery-status-timeline | `pages/delivery-status-timeline.html` | missing | 5-step status timeline (completed/current/future styling), pickup vs. delivery variants, fulfillment-window copy. Distinct from agentic `progress-tracker`. |
| meal-warning-tooltip | `pages/meal-warning-tooltip.html` | missing | Small icon + tooltip. "Never blocks, never dims" rule — items remain at full opacity. |
| onboarding-orientation-card | `pages/onboarding-orientation-card.html` | missing | Card + 3-column icon-label pattern (meals / appointments / check-ins). |
| consent-doc-viewer | `pages/consent-doc-viewer.html` | missing | Card + scroll-container + `overlay-bottom-sheet` for full PDF on mobile. |
| week-rhythm-card | `pages/week-rhythm-card.html` | missing | 3-row visualization (meal-ordering window / CC check-in cadence / occasional surveys). Visual-only, non-interactive. Onboarding Step 5. |

### Tier 1c — Per-flow right-pane primitives

| Component | PL Page | Status | Notes |
|---|---|---|---|
| patient-recall-list | `pages/patient-recall-list.html` | missing | Largest single new authoring effort. Header (Heading/04, Lora Medium 16) with day + pass indicator. Food rows: name + time/occasion + amount columns populated progressively across passes. Per-row inline editor + trash + "+ add" footer. Variants per pass (1: names; 2: more names; 3: time; 4: amounts; 5/6: locked via `.is-locked`). Renamed from `food-recall-list`. |
| outreach-card | `pages/outreach-card.html` | missing | CC photo + name + role + arrival time + topic + note. Variants: weekly check-in (with question preview), missed-visit (softer copy), general message, photo-unavailable fallback, `.is-checkin-active`, `.is-handoff-live` ("Live with [CC first name]"). Renamed from `cc-outreach-card`. |
| handoff-menu | `pages/handoff-menu.html` | missing | Contact card + 3 stacked handoff buttons (Phone / In-chat / Email). 11 variants: patient-initiated, agent-suggested, agent-escalated, crisis-non-clinical, crisis-clinical, CC-unavailable, language-mismatch, anonymized, no-CC-assigned, order-status-escalation, respond-to-cc-handoff. |
| crisis-resources-card | `pages/crisis-resources-card.html` | missing | 988 + UConn-specific protocol. `surface-card` + `border-l-4 rose-04` left accent. Never red surface. Variants TBD pending UConn clinical-team protocol input. |
| assessment-preflight-card | `pages/assessment-preflight-card.html` | missing | Extends `AssessmentHeader`. Pre-flight card before questionnaire panel: instrument name in plain language, question count, time estimate, "your answers go to your care team" disclosure, "Begin" button. |
| trend-snippet-list | `pages/trend-snippet-list.html` | missing | Bullet list of last 3–5 values with dates ("Apr 30 — 184 lb / Apr 23 — 185 lb / ..."). Demo + likely pilot path. Do not extend `patient-trend-card.html` (Chart.js-bound). |
| log-confirmation-card | `pages/log-confirmation-card.html` | missing | Extends `Receipt`. Receipt-shaped variant: attribute(s), value(s), context, timestamp. |
| assessment-confirmation | `pages/assessment-confirmation.html` | missing | Extends `Receipt`. Receipt-shaped variant: instrument name, "Submitted [date]", "Your care team has it." No score shown to patient. |

### Tier 2 — Composition (build after Tier 1 dependencies land)

| Component | PL Page | Status | Notes |
|---|---|---|---|
| patient-week-panel | `pages/patient-week-panel.html` | missing | Idle-state right-pane composition: `budget-meter` + existing `patient-delivery-status-card.html` + `appointment-card`. Compose only after dependencies are built. Renamed from `at-a-glance-panel`. |

---

## Summary

Run this query to see build progress:

```
built:         count rows where Status = "built" or "brand-reviewed"
missing:       count rows where Status = "missing"
in-progress:   count rows where Status = "in-progress"
brand-reviewed: count rows where Status = "brand-reviewed"
```

Current totals (update after each sprint):
- Built: ~65
- Missing: ~25
- Brand-reviewed: 0
