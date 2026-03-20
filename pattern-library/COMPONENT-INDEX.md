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
| Motion / Animation | `foundations-motion.html` | `motion-demo-box`, `motion-demo-track` | no | Reference only. Tokens: `--duration-*`, `--ease-*`. JS: `motion-demos.js` |
| Iconography | `foundations-icons.html` | `icon-demo-grid`, `icon-demo-card`, `icon-demo-label`, `icon-style-row` | no | Reference only. FA Pro v7.1.0 — styles, sizing, common icons, usage rules. |

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
| Divider | `layout-divider.html` | `divider`, `divider-compact`, `divider-spacious`, `divider-labeled`, `divider-label`, `divider-vertical` | no | Horizontal rule, labeled divider, vertical divider. Spacing variants: compact/default/spacious. |
| Issues Sidebar Layout | `(layout page only)` | `issues-layout`, `issues-layout-main`, `issues-layout-aside`, `issues-layout-toggle`, `issues-layout-backdrop` | no | 2-column layout with persistent right issues panel. Mobile: slides off-screen, toggled via `[data-issues-toggle]`. JS: `issues-sidebar-toggle.js`. |
| Field Row | `layout-field-row.html` | `field-row`, `field-row-horizontal`, `field-label`, `field-body`, `field-help`, `field-error`, `field-row-error`, `field-input-group`, `field-addon` | no | Stacked label+input row. Horizontal variant at sm+. Prefix/suffix addons. Error state uses `!important` on input border. |

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
| Sizes | `btn-sizes.html` | `btn-sm`, `btn-xs`, `btn-lg` | no | Size modifiers for any button variant |
| Button Group | `btn-group.html` | `btn-group`, `btn-group-item`, `btn-group-vertical` | no | Connected buttons. Combine with `btn-outline`, `btn-primary`, size classes. `.active` for selected state. |
| Loading State | `btn-loading.html` | `btn-loading`, `btn-spinner` | no | Spinner inside button, disabled interaction. Combine with any variant + size. CSS-only animation. |

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
| Indicator / Dot | `indicator-dot.html` | `indicator`, `indicator-sm`, `indicator-lg`, `indicator-online`, `indicator-offline`, `indicator-busy`, `indicator-away`, `indicator-pulse`, `indicator-label`, `indicator-positioned` | no | Status dot for presence/severity. Pulse variant for live state. Position on avatars with `indicator-positioned`. |
| Avatar | `avatar.html` | `avatar`, `avatar-xs`, `avatar-sm`, `avatar-lg`, `avatar-xl`, `avatar-primary`, `avatar-secondary`, `avatar-neutral`, `avatar-img`, `avatar-icon`, `avatar-group`, `avatar-group-overflow` | no | Circular user representation — initials, image, icon. Size scale xs–xl. Group/stack with overflow. Use `indicator-positioned` for status dots. |
| Spinner | `spinner.html` | `spinner`, `spinner-sm`, `spinner-lg`, `spinner-xl`, `spinner-primary`, `spinner-white`, `spinner-container`, `spinner-container-vertical`, `spinner-label`, `spinner-overlay` | no | Standalone loading spinner. Sizes sm–xl. Colors: neutral (default), primary, white. Overlay variant for full-section loading. Uses shared `@keyframes spin`. For button spinners use `.btn-spinner` instead. |

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
| Textarea | `form-textarea.html` | *(element default)* `textarea` | no | |
| Select | `form-select.html` | *(element default)* `select`, `select-haven` | no | `.select-haven` for explicit custom styling |
| Checkbox | `form-checkbox.html` | *(element default)* `input[type='checkbox']`, `checkbox-label`, `schedule-checkbox` | no | |
| Radio | `form-radio.html` | *(element default)* `input[type='radio']`, `radio-label` | no | |
| Fieldset | `form-fieldset.html` | *(element default)* `fieldset`, `legend` | no | |
| File List | `form-file-list.html` | `file-list`, `file-list-item`, `file-list-input`, `file-list-action`, `file-list-add`, `file-list-heading`, `file-list-description` | no | Dynamic file attachment input |
| Stepped Form | `form-layout.html` | `form-layout`, `step-nav`, `step-nav-item`, `step-num`, `form-content`, `form-nav` | yes | Multi-step form with vertical tab nav |

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
| Modal | `overlay-modal.html` | `modal-panel` | yes | |

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
| Comparison Panel | `complex-comparison-panel.html` | `comparison-panel`, `comparison-column`, `comparison-intro`, `comparison-column-header`, `comparison-title`, `comparison-subtitle`, `comparison-meal-title`, `comparison-meal-details`, `comparison-meta`, `comparison-actions`, `comparison-row`, `comparison-row-header`, `comparison-row-label`, `comparison-row-value`, `comparison-row-diff` | no | Side-by-side comparison: column-based (free content) or row-based (value pairs). Add `.comparison-row-diff` to highlight changes. |
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
