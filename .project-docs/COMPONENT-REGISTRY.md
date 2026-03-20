# Haven UI — Component Registry

**This is the authoritative, exhaustive list of every component that must exist in the pattern library.**

The `/pl-build` command reads this file to find the next unbuilt component and build it.
Do not remove rows. Do not reorder sections. Update the Status column only.

Status values:
- `missing` — not yet built
- `in-progress` — currently being built
- `built` — in pattern library, passes QA
- `brand-reviewed` — built + reviewed against Cena brand spec

---

## How the build sprint works

1. Run `/pl-build` in Claude Code
2. The agent finds the first `missing` row in this file
3. It builds that component (CSS + pattern library page + COMPONENT-INDEX row)
4. It runs the QA checklist
5. It marks the row `built` and commits
6. Repeat

Never mark a row `built` until the QA checklist passes and the component is
visible at localhost:5173/pattern-library/pages/.

---

## Foundations

| Component | PL Page | Status | Notes |
|---|---|---|---|
| Colors | `pages/foundations-colors.html` | built | Reference only |
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
| Toast | `pages/toast.html` | missing | Transient notification — 4 variants, enter/exit animation |

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
| Toggle / Switch | `pages/forms-toggle.html` | missing | On/off toggle — Preline HSToggle or custom |
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
| Form Validation | `pages/forms-validation.html` | missing | Error states, success states, inline messages |
| File Upload | `pages/forms-file-upload.html` | missing | Drag-drop zone, file list, progress |
| Date Picker | `pages/forms-datepicker.html` | missing | Preline HSDatepicker |
| Time Picker | `pages/forms-timepicker.html` | missing | Preline HSTimepicker |
| Tags Input | `pages/forms-tags-input.html` | missing | Free-entry tag chips — Preline HSTagsInput |
| Color Picker | `pages/forms-color-picker.html` | missing | Swatch selector for meal type / status |
| Combobox | `pages/forms-combobox.html` | missing | Autocomplete with open dropdown — Preline HSCombobox |

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
| Navbar / Top Bar | `pages/nav-topbar.html` | missing | Top application bar — logo, nav links, actions |
| Pagination | `pages/pagination.html` | built | |
| Stepper | `pages/stepper.html` | missing | Horizontal step indicator — Preline HsStepper |
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
| Medication Row | `pages/data-medication.html` | missing | Medication list row — icon, name, dose, schedule |
| Alert Summary Row | `pages/data-alert-summary.html` | missing | Alert list row — severity, title, status, date |
| Pipeline Bar | `pages/data-pipeline-bar.html` | built | |
| Progress Bar | `pages/data-progress.html` | missing | Linear progress — labeled, colored variants |
| List Group | `pages/data-list-group.html` | missing | Bordered list with optional actions — Preline |
| Accordion (data) | `pages/accordion.html` | missing | Content accordion — Preline HSAccordion |
| Collapse | `pages/collapse.html` | missing | Single inline show/hide — Preline HSCollapse |

---

## Overlays

| Component | PL Page | Status | Notes |
|---|---|---|---|
| Modal | `pages/overlays.html` | built | |
| Dropdown | `pages/overlays.html` | built | |
| Tooltip | `pages/overlays.html` | built | |
| Popover | `pages/overlays.html` | built | |
| Drawer | `pages/overlays.html` | built | |
| Context Menu | `pages/overlays-context-menu.html` | missing | Right-click / long-press menu |
| Confirm Dialog | `pages/overlays-confirm.html` | missing | Destructive action confirmation modal variant |
| Bottom Sheet | `pages/overlays-bottom-sheet.html` | missing | Mobile-only drawer from bottom — patient app |

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
| Notification Center | `pages/complex-notifications.html` | missing | Grouped notification list with dismiss |
| Command Palette | `pages/complex-command-palette.html` | missing | Keyboard-driven search/action launcher |

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
