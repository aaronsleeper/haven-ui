# Haven UI — Pattern Library Component Index

Ground truth for what exists in the pattern library. The agent must check this file
before creating any new component or semantic class.

**Before building anything new:**
1. Check this index for the component you need
2. If it exists — copy the HTML from the component file. Do not regenerate.
3. If it does not exist — add it to the pattern library first, then use it in the app.

---

## How to Read This Index

| Column | Meaning |
|---|---|
| Component | Display name |
| File | `pattern-library/components/[file]` |
| Classes | Semantic class names defined in `components.css` |
| Preline | Whether Preline JS is required |
| Notes | Usage constraints |

---

## Foundations

| Component | File | Classes | Preline | Notes |
|---|---|---|---|---|
| Colors | `foundations-colors.html` | — | no | Reference only |
| Typography | `foundations-typography.html` | — | no | Reference only |
| Spacing | `foundations-spacing.html` | — | no | Reference only |

---

## Layout

| Component | File | Classes | Preline | Notes |
|---|---|---|---|---|
| Card (all variants) | `layout-card.html` | `card`, `card-header`, `card-title`, `card-subtitle`, `card-body`, `card-footer` | no | Default container. Use before anything else. |
| Stat Card | `layout-stat-card.html` | `card-stat`, `stat-label`, `stat-value` | no | Dashboard metric cards. No pie/donut charts. |
| Container | `layout-container.html` | `container` | no | Max-width page wrapper |
| Page Header | `layout-page-header.html` | `page-header` | no | Title left, actions right |
| Section Title | `layout-section-title.html` | `section-title` | no | Subheading inside a section |
| Sticky Footer | `layout-sticky-footer.html` | `sticky-footer`, `sticky-footer-inner`, `sticky-footer-info`, `sticky-footer-actions` | no | Fixed bottom action bar |
| Grid (2-col) | `layout-grid.html` | `grid-2` | no | Responsive 2-col grid |
| Prose Section | `layout-prose-section.html` | `prose-section` | no | Constrains text to readable line length |
| App Shell | `layout-app-shell.html` | `app-sidebar`, `app-sidebar-header`, `app-sidebar-brand`, `app-sidebar-nav`, `sidebar-nav-list`, `sidebar-nav-item`, `sidebar-nav-section` | yes | Full app layout with sidebar |
| Mobile Shell | `layout-mobile-shell.html` | `mobile-app`, `mobile-shell` | no | Patient app only. Apply `mobile-app` to `<body>`, `mobile-shell` to inner wrapper. |
| Mobile i18n Bar | `layout-mobile-i18n-bar.html` | `mobile-i18n-bar`, `mobile-i18n-toggle` | no | Patient app only. Partial: `src/partials/patient-i18n-bar.html`. JS: `src/scripts/components/i18n.js` |
| Mobile Bottom Nav | `layout-mobile-bottom-nav.html` | `mobile-bottom-nav`, `mobile-bottom-nav-tab`, `mobile-bottom-nav-badge` | no | Patient app only. Shared partial: `src/partials/patient-bottom-nav.html`. Copy + set `.active` per screen. |
| Onboarding Progress | `layout-onb-progress.html` | `onb-progress` | no | Patient app only. Used on ONB-01, 02, 03. Set `aria-label="Step N of 3"`. |

---

## Buttons

| Component | File | Classes | Preline | Notes |
|---|---|---|---|---|
| Primary | `btn-primary.html` | `btn-primary` | no | Default CTA |
| Secondary | `btn-secondary.html` | `btn-secondary` | no | Secondary action |
| Outline | `btn-outline.html` | `btn-outline` | no | Tertiary / cancel |
| Danger | `btn-danger.html` | `btn-danger` | no | Destructive (outlined) |
| Danger Outline | `btn-danger-outline.html` | `btn-danger-outline` | no | Explicit destructive outline |
| Icon | `btn-icon.html` | `btn-icon`, `btn-icon-primary` | no | Icon-only buttons |
| Dropdown | `btn-dropdown.html` | `btn-model-selector`, `dropdown-btn` | yes | Dropdown trigger |
| Dark Mode Toggle | `btn-dark-mode-toggle.html` | `btn-dark-mode-toggle`, `dark-mode-toggle` | no | Theme toggle button |
| Sizes | `btn-sizes.html` | `btn-sm`, `btn-xs` | no | Size modifiers for any button variant |

---

## Badges & Status

| Component | File | Classes | Preline | Notes |
|---|---|---|---|---|
| Badge (base + variants) | `badge.html` | `badge`, `badge-primary`, `badge-secondary`, `badge-neutral`, `badge-success`, `badge-warning`, `badge-error`, `badge-info`, `badge-pill`, `badge-sm` | no | Use `badge-pill` for tags/status; `badge-sm` in dense layouts |
| Trend Badge | `badge-trend.html` | `trend-badge`, `trend-up`, `trend-improving`, `trend-down`, `trend-worsening`, `trend-flat` | no | `.trend-improving` and `.trend-worsening` are semantic aliases |
| Severity Badge | `badge-severity.html` | `severity-badge`, `severity-high`, `severity-medium`, `severity-low` | no | Replaces colored-dot pattern in alert tables |
| Sentiment Badge | `badge-sentiment.html` | `sentiment-badge`, `sentiment-satisfied`, `sentiment-neutral`, `sentiment-dissatisfied` | no | Patient feedback sentiment |
| SDOH Badge | `badge-sdoh.html` | `sdoh-badge` | no | Social determinants; monospace font |
| AI Insight Badge | `badge-ai-insight.html` | `ai-insight-badge`, `ai-insight-callout`, `ai-insight-callout-icon` | no | Violet; for AI-generated content |
| Removable Badge | *(inside tag-group)* | `badge-removable` | no | Badge with X close button |

---

## Alerts

| Component | File | Classes | Preline | Notes |
|---|---|---|---|---|
| Alert (all variants) | `alert.html` | `alert`, `alert-icon`, `alert-success`, `alert-warning`, `alert-error`, `alert-info` | no | Use FA icon inside `.alert-icon` |

---

## Forms

| Component | File | Classes | Preline | Notes |
|---|---|---|---|---|
| Text Input | `form-input-text.html` | *(element default)* `input[type='text']` | no | Default styling on element |
| Inputs (all types) | `form-inputs-all.html` | `input-group`, `input-group-addon`, `input-group-addon-end`, `input-group-field` | no (password toggle variant needs HSTogglePassword) | Comprehensive reference: text, email, tel, url, password, number, date, time, search, states, input-group addon. Page: `inputs.html`. |
| Textarea | `form-textarea.html` | *(element default)* `textarea` | no | |
| Select | `form-select.html` | *(element default)* `select`, `select-haven` | no | `.select-haven` for explicit custom styling |
| Checkbox | `form-checkbox.html` | *(element default)* `input[type='checkbox']`, `checkbox-label`, `schedule-checkbox` | no | |
| Radio | `form-radio.html` | *(element default)* `input[type='radio']`, `radio-label` | no | |
| Fieldset | `form-fieldset.html` | *(element default)* `fieldset`, `legend` | no | |
| File List | `form-file-list.html` | `file-list`, `file-list-item`, `file-list-input`, `file-list-action`, `file-list-add`, `file-list-heading`, `file-list-description` | no | Dynamic file attachment input |
| Stepped Form | `form-layout.html` | `form-layout`, `step-nav`, `step-nav-item`, `step-num`, `form-content`, `form-nav` | yes | Multi-step form with vertical tab nav |
| Advanced Select | `form-advanced-select.html` | `adv-select-toggle`, `adv-select-dropdown`, `adv-select-search`, `adv-select-option`, `adv-select-no-result`, `adv-select-tags-item` | yes — HSSelect | Classes passed as strings in `data-hs-select` JSON, NOT as HTML attributes. Supports single, multi-select tags, search. Use instead of native select for lists 8+ items or when search is needed. |
| Range Slider | `form-range-slider.html` | `range-field`, `range-label-row`, `range-label`, `range-value`, `range-input`, `range-pips`, `range-pip` | no | Native `<input type="range">`. No external plugin. Use `step` + `datalist` for preset increments. |
| Clipboard | `form-clipboard.html` | `copy-field`, `copy-field-input`, `copy-field-btn`, `copy-icon-btn` | no | Uses native Web Clipboard API. JS: `src/scripts/components/clipboard.js` — `havenCopyField(sourceId, btnId)`. |
| Toggle Password | `form-toggle-password.html` | *(none — uses `.btn-icon`)* | yes — HSTogglePassword | `data-hs-toggle-password` on button with `target` pointing to input id. Supports single input or array of ids. |
| Strong Password | `form-strong-password.html` | `strong-password-strip`, `strong-password-hints` | yes — HSStrongPassword | `stripClasses` and hints container id passed via `data-hs-strong-password`. Preline injects DOM. |
| Toggle Count | `form-toggle-count.html` | *(none — uses `.badge`)* | yes — HSToggleCount | `data-hs-toggle-count` on the count display element. `target` = checkbox id, `min`/`max` = values, `duration` = ms. |
| PIN Input | `form-pin-input.html` | `pin-input-wrap`, `pin-input-field` | yes — HSPinInput | `data-hs-pin-input` on wrapper, `data-hs-pin-input-item` on each cell. Handles focus, backspace, paste. |
| Copy Markup | `form-copy-markup.html` | `copy-markup-wrap`, `copy-markup-item` | yes — HSCopyMarkup | `data-hs-copy-markup` on add button. `targetSelector`/`wrapperSelector`/`limit`. Delete via `data-hs-remove-element`. |

---

## Data Display

| Component | File | Classes | Preline | Notes |
|---|---|---|---|---|
| Data Table | `data-table.html` | `data-table`, `cell-primary`, `cell-numeric`, `section-header`, `detail-row`, `table-row-muted`, `table-section-divider` | no | Default sticky first column. Use `data-table-sticky-cols` for 3-col sticky. |
| KV Table | `data-table-kv.html` | `kv-table` | no | Key/value definition list |
| Empty State | `data-empty-state.html` | `empty-state`, `empty-state-icon` | no | Zero-data pages |
| Pagination | `data-pagination.html` | `pagination`, `pagination-info`, `pagination-controls`, `pagination-btn` | no | |
| Skeleton Loader | `data-skeleton.html` | `skeleton`, `skeleton-text`, `skeleton-text-sm` | no | Loading placeholders |
| Table Section Divider | `data-table-section-divider.html` | `table-section-divider` | no | Visual separator row in tables |

---

## Navigation

| Component | File | Classes | Preline | Notes |
|---|---|---|---|---|
| Breadcrumb | `nav-breadcrumb.html` | `breadcrumb`, `breadcrumb-separator`, `breadcrumb-current` | no | |
| Filter Pills | `nav-filter-pills.html` | `filter-pill` | no | `.active` state on selected |
| Section Nav | `nav-section.html` | `section-nav`, `section-nav-item` | no | In-page jump nav |
| Segmented Control | `nav-segmented-control.html` | `segmented-control`, `segmented-control-btn`, `view-toggle`, `view-toggle-btn` | no | Also used as view toggle |
| Sidebar Nav | `nav-sidebar.html` | *(see App Shell)* | yes | |
| Stratification Bar | `nav-stratification-bar.html` | `stratification-bar`, `stratification-bar-label`, `stratification-bar-item` | no | Filter by cohort/segment |
| Tab Nav | `nav-tabs.html` | `tab-nav`, `tab-nav-item` | yes | Preline `hs-tab-active` class on active item |
| Sub-Nav (sidebar) | *(inside App Shell)* | `sidebar-subnav-list`, `sidebar-subnav-item` | no | Indented sub-items in sidebar accordion |

---

## Overlays

| Component | File | Classes | Preline | Notes |
|---|---|---|---|---|
| Dropdown | `overlay-dropdown.html` | `hs-dropdown-menu`, `hs-dropdown-item` | yes | **Use exact pattern from CLAUDE.md.** Never add transition utilities to menu div. |
| Modal | `overlay-modal.html` | `modal-panel`, `modal-header` | yes | Use `.modal-header` alongside `.card-header` on title-only headers to reduce gap. |
| Tooltip | `overlay-tooltip.html` | `tooltip-content` | yes — HSTooltip | `.hs-tooltip` wrapper, `.hs-tooltip-toggle` on trigger, `.hs-tooltip-content tooltip-content` on panel. Placement via `[--placement:X]` CSS var. |
| Popover | `overlay-popover.html` | `popover-panel`, `popover-header`, `popover-title`, `popover-body` | yes — HSPopover | `.hs-popover` wrapper, `.hs-popover-toggle` trigger, `.hs-popover-content popover-panel` on content. Trigger type via `[--trigger:click]`. |
| Drawer (right) | `overlay-drawer.html` | `drawer-panel`, `drawer-header`, `drawer-title`, `drawer-body`, `drawer-footer` | yes — HSOverlay | Default right-slide. z-index: 70 (above app-sidebar). |
| Drawer (left) | `overlay-drawer.html` | `drawer-panel-left` | yes — HSOverlay | Left-slide variant. z-index: 70 fixes the stacking-under-sidebar issue. |

---

## Toolbars

| Component | File | Classes | Preline | Notes |
|---|---|---|---|---|
| Toolbar | `toolbar.html` | `toolbar`, `toolbar-search` | no | Wraps search + filter controls above content |
| Search Input | `toolbar-search.html` | `search-input`, `search-input-icon` | no | Icon-in-input pattern |

---

## Text & Utility

| Component | File | Classes | Preline | Notes |
|---|---|---|---|---|
| Text Link | `text-link.html` | `text-link`, `text-link-danger` | no | Inline action links |
| Accordion Toggle | `util-accordion-toggle.html` | `hs-accordion-toggle`, `accordion-chevron-up`, `accordion-chevron-down` | yes | Sidebar accordion pattern |
| Instruction Card | `util-instruction-card.html` | `instruction-title`, `instruction-text` | no | Helper text block |
| Sidebar Toggle Bar | `util-sidebar-toggle.html` | `sidebar-toggle-bar`, `sidebar-toggle-btn` | yes | Mobile sidebar open trigger |
| Tag Container | `util-tag-container.html` | `tag-container` | no | Flex wrap for tag badges |

---

## Clinical / Healthcare

| Component | File | Classes | Preline | Notes |
|---|---|---|---|---|
| Activity Feed Row | `clinical-activity-feed.html` | `activity-feed-row` | no | |
| AI Field | `clinical-ai-field.html` | `ai-field`, `ai-field-icon`, `ai-field-confirmed`, `ai-field-confirmed-icon`, `ai-field-label`, `ai-field-confirmed-label`, `ai-field-zero-callout` | no | Agent-populated values pending confirmation |
| Alert Category Card | `clinical-alert-category.html` | `alert-category-card`, `alert-category-label` | no | `--alert-accent` CSS var for left border color |
| Alert Summary Row | `clinical-alert-summary-row.html` | `alert-summary-row` | no | |
| HEDIS Grid | `clinical-hedis-grid.html` | `hedis-grid`, `hedis-stat`, `hedis-stat-label`, `hedis-stat-value`, `hedis-stat-detail` | no | |
| Medication Row | `clinical-medication-row.html` | `medication-row` | no | |
| Metric Card | `clinical-metric-card.html` | `clinical-metric-card`, `metric-card-flagged`, `metric-value-danger` | no | |
| Nutrition List | `clinical-nutrition-list.html` | `nutrition-list`, `nutrition-list-row`, `nutrition-list-label`, `nutrition-list-value`, `nutrition-input-group`, `nutrition-input`, `nutrition-unit` | no | Always-editable inputs, not click-to-edit |
| Patient Card | `clinical-patient-card.html` | `patient-card` | no | Card-view patient list item |
| Patient Row | `clinical-patient-row.html` | `patient-row` | no | Table-view patient list item |
| ROI Calculator | `clinical-roi-calculator.html` | `roi-calculator`, `roi-formula`, `roi-result`, `roi-result-label` | no | |
| Session Mode Bar | `clinical-session-mode-bar.html` | `session-mode-bar` | no | Sticky bar for active session |
| SLA Warning | `clinical-sla-warning.html` | `sla-warning` | no | |
| Timeline | `clinical-timeline.html` | `timeline-list`, `timeline-event`, `timeline-left`, `timeline-connector`, `timeline-icon-circle`, `timeline-icon-circle-*`, `timeline-event-body`, `timeline-event-header`, `timeline-event-preview`, `timeline-event-detail`, `timeline-event-actor` | no | Patient timeline events |

---

## Complex / Composite

| Component | File | Classes | Preline | Notes |
|---|---|---|---|---|
| Assignment Filter Tag | `complex-assignment-filter-tag.html` | `assignment-filter-tag`, `assignment-filter-count` | no | |
| Assignment Select | `complex-assignment-select.html` | `assignment-select`, `assignment-modified` | no | |
| Calendar Widget | `complex-calendar-widget.html` | `calendar-widget`, `calendar-month`, `calendar-day` | no | |
| Chat Interface | `complex-chat.html` | `chat-bubble-user`, `chat-bubble-ai`, `chat-avatar-ai` | no | |
| Comparison Panel | `complex-comparison-panel.html` | `comparison-panel`, `comparison-column`, `comparison-intro`, `comparison-meal-title`, `comparison-meal-details`, `comparison-meta`, `comparison-column-header`, `comparison-actions` | no | Side-by-side duplicate resolution |
| Issues Sidebar | `complex-issues-sidebar.html` | `issues-sidebar`, `issues-sidebar-header`, `issues-sidebar-title`, `issue-item`, `issue-item-icon`, `issue-item-content`, `issue-item-description`, `issue-item-action`, `issue-item-resolved`, `issues-sidebar-resolved` | no | Persistent issue tracker |
| Meal Type Indicator | `complex-meal-type.html` | `meal-label-hot`, `meal-label-cold`, `meal-type-icon`, `meal-type-toggle`, `meal-type-toggle-hot`, `meal-type-toggle-cold` | no | Hot/cold meal labels and toggles |
| Partner Alert Row | `complex-partner-alert-row.html` | `partner-alert-row` | no | |
| Partner List Item | `complex-partner-list-item.html` | `partner-list-item` | no | |
| Performance Metric Card | `complex-performance-metric-card.html` | `performance-metric-card`, `performance-metric-label`, `performance-metric-value`, `performance-metric-detail`, `performance-stats-row`, `performance-stat-compact`, `performance-stat-compact-label`, `performance-stat-compact-value`, `performance-stat-compact-detail` | no | |
| Pipeline Bar | `complex-pipeline-bar.html` | `pipeline-bar`, `pipeline-segment` | no | Proportional stacked bar. Segments use `style="flex: N"` (data-driven, acceptable). |
| Prompt Input | `complex-prompt-input.html` | `prompt-input-container`, `prompt-textarea`, `prompt-toolbar`, `category-chip` | no | AI prompt box with category chips |
| Tag Group | `complex-tag-group.html` | `tag-group`, `tag-group-label`, `badge-removable` | no | |

---

## Chart Utilities

| Component | File | Classes | Preline | Notes |
|---|---|---|---|---|
| Chart Containers | `chart-containers.html` | `chart-canvas-wrapper`, `chart-sparkline`, `chart-line`, `chart-bar` | no | **No pie or donut charts.** Use stat cards or bar charts. |

---

## Patient App

| Component | File | Classes | Preline | Notes |
|---|---|---|---|---|
| Meal Card | `patient-meal-card.html` | `meal-card`, `meal-card-img`, `meal-card-body`, `meal-card-name`, `meal-card-day`, `meal-card-tags`, `meal-card-swap`, `meal-card.is-swapped` | no | Add `.is-swapped` after swap. Missing images show `bg-stone-100` placeholder. |
| Delivery Status Card | `patient-delivery-status-card.html` | `delivery-status-card`, `delivery-status-top`, `delivery-status-icon`, `delivery-status-label`, `delivery-status-timing`, `delivery-status-divider`, `delivery-summary`, `delivery-summary-label`, `delivery-summary-count`, `delivery-summary-list` | no | Three states (preparing/delivering/delivered) driven by JS URL param. |
| Message Bubble | `patient-message-bubble.html` | `message-bubble-out`, `message-bubble-in`, `message-sender-label`, `message-date-sep`, `message-timestamp`, `message-new-pill` | no | Right-align outgoing with `flex flex-col items-end`; left-align incoming with `items-start`. |
| Feedback Rating Card | `patient-feedback-rating.html` | `feedback-rating-fieldset`, `feedback-rating-card` | no | Uses `:has(input:checked)` for selected state. Three cards in `grid grid-cols-3 gap-2`. |
| Preference Image Card | `patient-pref-image-card.html` | `pref-image-card`, `pref-image-card-img-wrap`, `pref-image-card-img`, `pref-image-card-check`, `pref-image-card-label`, `pref-image-card-img-wrap-plain` | no | Mutual exclusivity JS: `src/scripts/components/pref-image-cards.js`. Grid: `grid grid-cols-2 gap-3`. |

---

## Meal Assignment Grid (Kitchen-Specific)

These components live in `src/partials/` as full partials, not standalone pattern library
components. They are tightly coupled to the kitchen app and must not be used in other apps.

| Partial | Classes |
|---|---|
| `kitchen-meal-assignment-grid.html` | `meal-qty-cell`, `meal-qty-input`, `meal-qty-btn`, `meal-col-header`, `meal-col-name`, `meal-col-meta`, `meal-temp-tag`, `meal-mod-cell`, `meal-totals-cell`, `data-table-sticky-cols` |

---

## Adding New Components

When you add a new component:

1. Create `pattern-library/components/[category]-[name].html` with `@component-meta` header
2. Define the semantic classes in `src/styles/tokens/components.css`
3. Add a row to this index in the correct category
4. Then use the component in the app page

**The pattern library file is the source of truth. App pages copy from it.**

---

_Last updated: 2026-03-09_
