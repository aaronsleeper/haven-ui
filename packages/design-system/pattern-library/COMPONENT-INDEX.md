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
| Palette Swatch | `foundations-palette-swatch.html` | `palette-swatch`, `palette-swatch-sm`, `palette-swatch-lg`, `palette-swatch-trigger`, `palette-swatch-tooltip`, `palette-swatch-grid` | yes — hs-tooltip | Rectangular color cell with hex tooltip on hover/focus. Used by `foundations-colors.html`. Three size variants; mobile family-grid collapses to 1 column below sm. Composes Preline hs-tooltip via `data-hs-tooltip`. |

---

## Layout

| Component | File | Classes | Preline | Notes |
|---|---|---|---|---|
| Card (all variants) | `layout-card.html` | `card`, `card-header`, `card-title`, `card-subtitle`, `card-body`, `card-footer` | no | Default container. Use before anything else. |
| Stat Card | `layout-stat-card.html` | `card-stat`, `stat-label`, `stat-value` | no | Dashboard metric cards. No pie/donut charts. |
| Container | `layout-container.html` | `container` | no | Max-width page wrapper |
| Page Header | `layout-page-header.html` | `page-header` | no | Title left, actions right |
| Page Title | `typography-page-title.html` | `page-title` | no | Heading/01 register (Lora 27.65px Medium on sand-900). Used as `<h1>` at the top of route content. Spec fixed in DESIGN.md §Typography. Composes with `page-header` when actions sit to the right on desktop. |
| Record Header | `layout-record-header.html` | `record-header`, `record-header-main`, `record-header-title`, `record-header-subtitle`, `record-header-trailing`, `record-header-meta` | no | Identity bar at top of a center-pane record (referral, care plan, care plan diff, patient record). Lora display title per DESIGN.md §Typography. Title left + subtitle, status badge + meta right. Reusable across cc-04/cc-05/cc-06/cc-07. |
| Section Title | `layout-section-title.html` | `section-title` | no | Subheading inside a section |
| Sticky Footer | `layout-sticky-footer.html` | `sticky-footer`, `sticky-footer-inner`, `sticky-footer-info`, `sticky-footer-actions` | no | Fixed bottom action bar |
| Grid (2-col) | `layout-grid.html` | `grid-2` | no | Responsive 2-col grid |
| Prose Section | `layout-prose-section.html` | `prose-section` | no | Constrains text to readable line length |
| App Shell | `layout-app-shell.html` | `app-sidebar`, `app-sidebar-header`, `app-sidebar-brand`, `app-sidebar-nav`, `sidebar-nav-list`, `sidebar-nav-item`, `sidebar-nav-section` | yes | Full app layout with sidebar |
| App Shell (Responsive) | `layout-app-shell-responsive.html` | `app-shell`, `app-shell-sidebar`, `app-shell-main`, `app-shell-topbar`, `app-shell-content`, `app-shell-bottom-nav` | no | Non-agentic counterpart to `agentic-shell`. Responsive: sidebar nav on desktop (≥lg), bottom-nav on mobile (<lg), persistent topbar across both. Five regions with fixed semantic roles. Consumer authors nav-items ONCE and provides both renderings. Topbar is the only persistent surface; content is the only mandatory region. Used by patient app + future non-agentic persona apps. |
| Panel Splitter | `panel-splitter.html` | `panel-splitter`, `queue-sidebar`, `queue-list` | no | Drag-to-resize handle between panels. JS: `panel-splitter.js`. `data-panel-splitter` to init, `data-target`, `data-min`, `data-max`. |
| Mobile Shell | `layout-mobile-shell.html` | `mobile-app`, `mobile-shell`, `pb-safe-4`, `pb-safe-8` | no | Patient app only. Apply `mobile-app` to `<body>`, `mobile-shell` to inner wrapper. Compose `pb-safe-4` / `pb-safe-8` on sticky footers / page-end containers for iOS home-indicator clearance via `max(floor, env(safe-area-inset-bottom))`. |
| Mobile i18n Bar | `layout-mobile-i18n-bar.html` | `mobile-i18n-bar`, `mobile-i18n-toggle` | no | Patient app only. Partial: `src/partials/patient-i18n-bar.html`. JS: `src/scripts/components/i18n.js` |
| Mobile Bottom Nav | `layout-mobile-bottom-nav.html` | `mobile-bottom-nav`, `mobile-bottom-nav-tab`, `mobile-bottom-nav-badge` | no | Patient app only. Shared partial: `src/partials/patient-bottom-nav.html`. Copy + set `.active` per screen. |
| Two-Pane Layout | _(no PL page — utility classes)_ | `layout-two-pane`, `layout-two-pane-grid` | no | Bounded page width (1400px) + a rail/main two-column grid. `layout-two-pane` on the page container; `layout-two-pane-grid` on the grid wrapper — 420px rail + fluid main at `lg`, single column below. Promoted 2026-05-16 from inline arbitrary-value utilities used across the cena-uconn handoff. |
| Onboarding Progress | `layout-onb-progress.html` | `onb-progress` | no | Patient app only. Used on ONB-01, 02, 03. Set `aria-label="Step N of 3"`. |
| Divider | `layout-divider.html` | `divider`, `divider-compact`, `divider-spacious`, `divider-labeled`, `divider-label`, `divider-vertical` | no | Horizontal rule, labeled divider, vertical divider. Spacing variants: compact/default/spacious. |
| Issues Sidebar Layout | `(layout page only)` | `issues-layout`, `issues-layout-main`, `issues-layout-aside`, `issues-layout-toggle`, `issues-layout-backdrop` | no | 2-column layout with persistent right issues panel. Mobile: slides off-screen, toggled via `[data-issues-toggle]`. JS: `issues-sidebar-toggle.js`. |
| Field Row | `layout-field-row.html` | `field-row`, `field-row-horizontal`, `field-label`, `field-body`, `field-help`, `field-error`, `field-row-error`, `field-input-group`, `field-addon` | no | Stacked label+input row. Horizontal variant at sm+. Prefix/suffix addons. Error state uses `!important` on input border. |
| Agentic Shell | `layout-agentic-shell.html` | `agentic-shell`, `panel-splitter` | no | 3-panel flex root (nav, chat, content) at height:100vh. Ported as `AgenticShell` — thin layout-shell wrapper; nested panes (panel-nav / panel-chat / panel-content) remain inline carve-outs in app code until a second consumer needs them. Drag-resize splitters and panel toggles deferred. First consumer: care-coordinator cc-05 (2026-04-28). |
| Agentic Nav | `(prototype only)` | `nav-header`, `nav-logo`, `nav-section`, `nav-section-label`, `nav-item` | no | Sidebar nav for agentic shell. `.nav-item.active` for current selection. Collapses to icon-only when parent `.panel-nav.collapsed`. |
| Agentic Chat | `(prototype only)` | `chat-thread`, `chat-thread-inner`, `chat-input-area`, `message-agent`, `message-user`, `message-meta`, `message-avatar`, `message-name`, `message-body`, `tool-call` | no | Agent chat thread with centered 720px inner wrapper. User bubbles right-align. Tool-call indicators use monospace. |
| Content Panel | `(prototype only)` | `content-header`, `content-header-title`, `content-body` | no | Right-side content/artifact panel header and scrollable body. |
| MealOptionCard | `meal-option-card.html` | `meal-option-card`, `meal-option-card-image`, `meal-option-card-placeholder`, `meal-option-card-content`, `meal-option-card-name-row`, `meal-option-card-name`, `meal-option-card-description`, `meal-option-card-tags`, `meal-option-card-warning-row`, `meal-option-card-footer`, `meal-option-card-price`, `meal-option-card.is-recommended`, `meal-option-card.is-non-recommended-warned` | no | Agentic browse + select meal card for patient-app right-pane menu-grid. Image + name + description + diet tags + price + inline quantity-stepper. Variants: default, `.is-recommended` (leading `badge-primary` "Picked for you" with `fa-sparkles` Ava-attribution icon; pinned to first via CSS order), `.is-non-recommended-warned` (always-visible inline warning row below tags; card stays at full opacity per chat-affordance-principles "warning over hiding"), placeholder (uses `.meal-option-card-placeholder` when image absent). Tag-row badge register is reset (text-transform: none, font-medium) for restaurant-menu vocabulary; status pills elsewhere keep the global uppercase register. Distinct from MealDeliveryCard (idle-pane delivery + swap). Covers gap-doc R-3 / R-5. |
| PatientSummary | `(agentic)` | `patient-summary-header`, `patient-summary-avatar`, `patient-summary-name`, `patient-summary-subtitle`, `patient-summary-flags`, `patient-summary-stats`, `patient-summary-stat-label`, `patient-summary-stat-value` | no | At-a-glance patient record card. |
| MenuGrid | `menu-grid.html` | `menu-grid`, `menu-grid-header`, `menu-grid-title`, `menu-grid-subtitle` | no | Right-pane wrapper for a collection of `meal-option-card` items during meal-ordering. Layout-only composition (flex flex-col gap-3) with optional header carrying title + subtitle. Each child card brings its own visual register + inline quantity-stepper; menu-grid does not handle quantity logic. Variants: default (with header), headless (bare grid). Covers gap-doc R-5. |
| CartPanel | `cart-panel.html` | `cart-panel`, `cart-panel-header`, `cart-panel-title`, `cart-panel-status`, `cart-panel-body`, `cart-item-list`, `cart-item`, `cart-item-name`, `cart-item-qty`, `cart-item-price`, `cart-total`, `cart-total-row`, `cart-total-row.is-primary`, `cart-budget-remaining`, `cart-helper`, `cart-helper.is-active`, `cart-helper.is-gate`, `cart-submit`, `cart-panel.is-locked` | no | Right-pane cart container for meal-ordering Steps 2–6. Pre-submit (editable) variant: `cart-item-list` + `cart-total` + `cart-helper` (gate copy for empty + over-budget) + `cart-submit` button ("Send order to kitchen", disabled when `itemCount == 0 OR total > budget.cap`). Post-submit `.is-locked` variant hides submit + helpers and reveals the `cart-panel-status` "Sent to kitchen" pill in the header (same DOM, modifier-class switch). Surface: `bg-surface-card` (white) per DESIGN.md §Surface. Vanilla JS module `cart-panel.js` does NOT auto-subscribe to stepper events — consumer wires the stepper→cart bridge via `_cartPanel.setQty(itemId, qty)`. JS responsibilities: recompute total + budget remaining, swap the budget-row label between "Budget remaining" / "Over budget by", toggle the active helper gate, set submit disabled state, manage focus on `lock()`, and emit debounced (400ms) polite live-region announcements on validator transitions. Disabled submit links to both helpers via auto-wired `aria-describedby`; cart items carry `role="listitem"` inside `role="list"`. Covers gap-doc R-7. |
| QueueList (agentic) | `(agentic)` | `agentic-queue`, `agentic-queue-item`, `agentic-queue-item-title`, `agentic-queue-item-subtitle`, `agentic-queue-item-meta` | no | Prioritized action queue. `.is-urgent` for red left border. |
| DataTable extensions | `(agentic)` | `data-table-striped`, `data-table-compact`, `cell-mono`, `row-clickable` | no | Adds striped rows, compact sizing, monospace cells, clickable rows to existing `.data-table`. |
| StatGroup | `(agentic)` | `stat-group`, `stat-group-item`, `stat-group-label`, `stat-group-value`, `stat-group-delta`, `stat-group-icon` | no | Auto-fit grid of metrics. Delta styling: `.trend-up`, `.trend-down`, `.trend-flat`. |
| TrendChart | `(agentic)` | `trend-chart`, `trend-chart-header`, `trend-chart-title`, `trend-chart-metric`, `trend-chart-canvas` | no | Chart.js container with title and metric label. |
| ComparisonBar | `(agentic)` | `comparison-bar-group`, `comparison-bar`, `comparison-bar-label`, `comparison-bar-track`, `comparison-bar-fill` | no | Labeled progress bars for value comparison. |
| ChoicePicker | `(agentic)` | `choice-picker`, `choice-picker-option`, `choice-picker-icon`, `choice-picker-label`, `choice-picker-description` | no | Single/multi-select option cards. `.selected` and `.disabled` states. |
| ConfirmAction | `(agentic)` | `confirm-action`, `confirm-action-title`, `confirm-action-description`, `confirm-action-details`, `confirm-action-detail-row`, `confirm-action-warning`, `confirm-action-buttons` | no | Agent approval request card with summary, warning, confirm/cancel. |
| Receipt | `(agentic)` | `receipt`, `receipt-icon`, `receipt-title`, `receipt-reference`, `receipt-summary`, `receipt-summary-row`, `receipt-timestamp`, `receipt-actions` | no | Centered success confirmation with icon, reference ID, key-value summary. |
| ProgressTracker | `(agentic)` | `progress-tracker`, `progress-tracker-step`, `progress-tracker-dot`, `progress-tracker-label`, `progress-tracker-detail` | no | Horizontal multi-step indicator. Steps: `.is-complete`, `.is-active`. Connector lines auto-generated. |
| AlertBanner (agentic) | `(agentic)` | `alert-banner-agentic`, `alert-banner-agentic-icon`, `alert-banner-agentic-content`, `alert-banner-agentic-title`, `alert-banner-agentic-message`, `alert-banner-agentic-dismiss` | no | Status banner: `.is-success`, `.is-warning`, `.is-error`, `.is-info`. |
| CodeView | `(agentic)` | `code-view`, `code-view-header`, `code-view-title`, `code-view-copy`, `code-view-body` | no | Preformatted text block with copy button. `.wrap-lines` on body for line wrapping. `.copied` state on copy button. |
| InfoPanel | `(agentic)` | `info-panel`, `info-panel-title`, `info-panel-body`, `info-panel-image`, `info-panel-source`, `info-panel-actions` | no | Prose content card with optional image and source attribution. |
| Timeline (agentic) | `(agentic)` | `agentic-timeline`, `agentic-timeline-event`, `agentic-timeline-icon`, `agentic-timeline-body`, `agentic-timeline-title`, `agentic-timeline-detail`, `agentic-timeline-meta`, `agentic-timeline-actor` | no | Chronological event list with connector lines. `data-type` attribute: `agent`, `human`, `system` for icon color. |

---

## Document District

Haven's document-class register — the quiet, readable surface for SOPs, policies, and training docs. Opened by the Clinical Staff SOP deliverable-type (`Knowledge/Areas/Meta/Entities/workflows/clinical-staff-sop.md`). The district's newness is structural (shell + print adapter + compositions); per the 2026-05-26 scoping memo it adds **zero novel content primitives** — scope card and block glossary reuse `card` + `kv-table` outright; decision branch reuses `alert-stripe` for severity-coded flags. Print/export behavior is the `@media print` block in `print.css` scoped to `.document-shell`.

| Component | File | Classes | Preline | Notes |
|---|---|---|---|---|
| Document Shell | `layout-document-shell.html` | `document-shell`, `document-masthead`, `document-eyebrow`, `document-title`, `document-meta`, `document-meta-item`, `document-draft-banner`, `document-lead`, `document-section`, `document-section-title`, `document-section-intro`, `document-subsection-title`, `document-prose` | no | Single-column readable layout (52rem measure), Lora masthead + section titles. The outer wrapper for any document-class artifact; use once per page. Quiet register: no chrome, primary-teal reserved for the attestation commit. `document-draft-banner` is the visible masthead-level draft signal (pairs with `.attestation-status.is-pending`); `document-subsection-title` is a quiet sand sub-label for grouping within a section. |
| SOP Scope Card | `doc-scope-card.html` | *(composition)* `card`, `kv-table`, `text-link` | no | For / Covers / Does not cover. Pure composition — zero new classes. The "Does not cover" row is the boundary that keeps role SOPs from overlapping. |
| Procedure Steps | `doc-procedure-steps.html` | `procedure-steps`, `procedure-step`, `procedure-step-number`, `procedure-step-body`, `procedure-step-action`, `procedure-step-detail`, `procedure-step-detail-icon` | no | Numbered action → where in the system → expected result. Step numbers authored in HTML so they survive export. Quick-ref checklist is the define-once derivative. |
| Decision Branch | `doc-decision-branch.html` | `decision-branch`, `decision-branch-row`, `decision-branch-condition`, `decision-branch-outcome`, `decision-branch-arrow`; *(severity)* `alert-stripe` variants | no | If X → then Y. Neutral routing rows + severity-coded escalation flags. Red/yellow/green flags reuse `alert-stripe` error/warning/success — no new severity primitive. |
| Quick-Reference Checklist | `doc-quick-ref-checklist.html` | `checklist`, `checklist-item`, `checklist-item-label`; `input[type=checkbox]` | no | Lightweight tickable recap DERIVED from procedure steps (define-once — never an independent restatement). Reuses the form checkbox element. |
| Block Glossary | `doc-block-glossary.html` | *(composition)* `card`, `kv-table` | no | Plain-language term → definition, gathered as one block. Pure composition — zero new classes. Keep definitions free of engineering vocabulary. |
| Attestation Block | `doc-attestation-block.html` | `attestation-block`, `attestation-block-header`, `attestation-block-body`, `attestation-status`, `attestation-status.is-pending`, `attestation-status.is-signed`, `attestation-signature`, `attestation-signature-name`, `attestation-signature-role`, `attestation-signature-placeholder`, `attestation-gates`, `attestation-gate`, `attestation-gate-icon`, `attestation-gate-label` | no | In-document accountable-human sign-off. Single-gate: `.is-pending` (warning) is the honest unsigned-draft default; `.is-signed` (primary-teal commit moment) carries name/role/version/date. Multi-gate variant (`attestation-gates`/`attestation-gate`, added n=2 for the RD SOP) lists multiple gates (clinically-accurate + operationally-true + signed-off), each reusing the pending/signed color language. Recurring across all Document-district deliverables. |

---

## Buttons

| Component | File | Classes | Preline | Notes |
|---|---|---|---|---|
| Primary | `btn-primary.html` | `btn-primary` | no | Default CTA |
| Secondary | `btn-secondary.html` | `btn-secondary` | no | Secondary action |
| Outline | `btn-outline.html` | `btn-outline` | no | Tertiary / cancel |
| Ghost | `(utility — composes with sizes)` | `btn-ghost` | no | Minimum-weight inline action — transparent bg, sand text, sand-100 hover. Compose with `btn-xs` / `btn-sm`. Use when btn-outline (border) is too heavy and a plain link is too informal. |
| Danger | `btn-danger.html` | `btn-danger` | no | Destructive (outlined) |
| Danger Outline | `btn-danger-outline.html` | `btn-danger-outline` | no | Explicit destructive outline |
| Icon | `btn-icon.html` | `btn-icon`, `btn-icon-primary` | no | Icon-only buttons |
| Dropdown | `btn-dropdown.html` | `btn-model-selector`, `btn-dropdown` | yes | Dropdown trigger |
| Dark Mode Toggle | `btn-dark-mode-toggle.html` | `btn-dark-mode-toggle`, `dark-mode-toggle` | no | Theme toggle button |
| Sizes | `btn-sizes.html` | `btn-sm`, `btn-xs`, `btn-lg` | no | Size modifiers for any button variant |
| Block | exemplar in `primary-action.html` + `commit-action.html` | `btn-block` | no | Full-width modifier — composes `w-full justify-center`. Use on sticky-footer / mobile CTAs. |
| Button Group | `btn-group.html` | `btn-group`, `btn-group-item`, `btn-group-vertical` | no | Connected buttons. Combine with `btn-outline`, `btn-primary`, size classes. `.active` for selected state. |
| Loading State | `btn-loading.html` | `btn-loading`, `btn-spinner` | no | Spinner inside button, disabled interaction. Combine with any variant + size. CSS-only animation. |

---

## Badges & Status

| Component | File | Classes | Preline | Notes |
|---|---|---|---|---|
| Badge (base + variants) | `badge.html` | `badge`, `badge-primary`, `badge-secondary`, `badge-neutral`, `badge-success`, `badge-warning`, `badge-error`, `badge-info`, `badge-orange`, `badge-yellow`, `badge-lime`, `badge-emerald`, `badge-blue`, `badge-indigo`, `badge-purple`, `badge-fuchsia`, `badge-pink`, `badge-rose`, `badge-pill`, `badge-sm` | no | Use `badge-pill` for tags/status; `badge-sm` in dense layouts. v2 expanded family variants (orange/yellow/lime/emerald/blue/indigo/purple/fuchsia/pink/rose) are raw color chips reserved for data viz, illustration, and future semantic role assignments — not for inventing new semantics ad-hoc |
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
| Toast | `toast.html` | `toast-container`, `toast`, `toast-static`, `toast-icon`, `toast-content`, `toast-title`, `toast-description`, `toast-dismiss`, `toast-progress`, `toast-success`, `toast-warning`, `toast-error`, `toast-info` | no | Transient notification — JS required (`toast.js`). Use `HavenToast.show()` API. `toast-static` suppresses animation for inline previews. |

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
| Toggle / Switch | `forms-toggle.html` | `toggle`, `toggle-track`, `toggle-sm`, `toggle-lg`, `toggle-success`, `toggle-danger`, `toggle-group`, `toggle-label`, `toggle-description` | no | CSS-only hidden checkbox + label. Sizes: sm/default/lg. Colors: primary/success/danger. |
| Form Validation | `forms-validation.html` | `field-success`, `field-warning`, `field-row-success`, `field-row-warning`, `validation-summary`, `validation-summary-title`, `validation-summary-list` | no | Error/success/warning states on inputs, selects, textareas, checkboxes, radios. Summary error banner. Reuses `field-row-error`, `field-error`, `field-help`, `required` from Field Row. |
| File Upload | `forms-file-upload.html` | `file-upload-dropzone`, `file-upload-dropzone-compact`, `file-upload-dropzone-icon`, `file-upload-dropzone-text`, `file-upload-dropzone-hint`, `file-upload-browse`, `file-upload-list`, `file-upload-item`, `file-upload-item-icon`, `file-upload-item-info`, `file-upload-item-name`, `file-upload-item-size`, `file-upload-item-status`, `file-upload-item-progress`, `file-upload-item-progress-bar`, `file-upload-item-remove` | no | Drag-drop zone with file list, progress bars, complete/error states. JS: `file-upload.js`. Compact variant for inline use. |
| Date Picker | `forms-datepicker.html` | `datepicker-wrapper`, `datepicker-icon`, `vc`, `vc-week`, `vc-week__day`, `vc-dates`, `vc-date`, `vc-arrow`, `vc-month`, `vc-year`, `vc-months`, `vc-months__month`, `vc-years`, `vc-years__year` | yes — HSDatepicker | Calendar popup from input. Variants: basic, preset, range, min/max, multiple, inline, custom format. Uses `data-hs-datepicker` for config. |
| Time Picker | `forms-timepicker.html` | `timepicker-wrapper`, `timepicker-icon-btn`, `timepicker-panel`, `timepicker-columns`, `timepicker-column`, `timepicker-option`, `timepicker-footer`, `timepicker-footer-btn`, `timepicker-footer-ok` | yes — hs-dropdown | Scroll-column time selector. 12-hour (AM/PM) and 24-hour variants. JS: `timepicker.js`. Use unique radio name prefixes per instance. |
| Tags Input | `forms-tags-input.html` | `tags-input`, `tags-input-focused`, `tags-input-disabled`, `tags-input-tag`, `tags-input-tag-remove`, `tags-input-field`, `tags-input-error`, `tags-input-success`, `tags-input-warning`, `tags-input-count` | no | Free-entry tag chips. JS: `tags-input.js`. `data-tags-input` to init, `data-max` for limit, `data-initial` for pre-populated. |
| Color Picker | `forms-color-picker.html` | `color-picker`, `color-picker-label`, `color-picker-swatches`, `color-picker-swatch`, `color-picker-swatch-sm`, `color-picker-swatch-custom`, `color-picker-check`, `color-picker-preview`, `color-picker-preview-dot`, `color-picker-value`, `color-picker-disabled` | no | Swatch selector for meal type / status. JS: `color-picker.js`. `data-color-picker` to init. Small variant with `-sm`. Custom swatch bridges native `input[type=color]`. |
| Combobox | `forms-combobox.html` | `combobox`, `combobox-input`, `combobox-toggle`, `combobox-close`, `combobox-output`, `combobox-item`, `combobox-item-check`, `combobox-group-title`, `combobox-empty`, `combobox-disabled`, `combobox-item-description` | yes — HSCombobox | Autocomplete with dropdown. Variants: basic, with description, grouped, disabled, pre-selected. Uses `data-hs-combo-box` for config. Preline controls open/close via inline display. |
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
| Bulk Action Bar | `data-bulk-action-bar.html` | `bulk-action-bar`, `bulk-action-bar-info`, `bulk-action-bar-count`, `bulk-action-bar-actions` | no | Contextual selection-mode bar for dense tables (care-coordinator platform). Appears on ≥1 row checked; sticky bottom-0 within the scroll container, full content width. Count announced via `aria-live`; destructive bulk actions route through `overlay-confirm-dialog`. Distinct from `.sticky-footer` (patient-app, fixed-viewport, save semantics). |
| List Group | `data-list-group.html` | `list-group`, `list-group-item`, `list-group-item-action`, `list-group-item-icon`, `list-group-item-content`, `list-group-item-title`, `list-group-item-description`, `list-group-item-trailing`, `list-group-flush`, `list-group-striped` | no | Bordered list with optional icons, descriptions, trailing actions. Flush variant for cards. `.active` / `.disabled` states. |
| Accordion | `data-accordion.html` | `accordion`, `accordion-item`, `accordion-header`, `accordion-body`, `accordion-header-icon`, `accordion-flush`, `accordion-bordered`, `accordion-chevron-wrap` | yes — HSAccordion | Content accordion — default, single-open, icons, flush, bordered, nested. Uses `data-hs-accordion-always-open` for multi-open. |
| Collapse | `data-collapse.html` | `collapse-toggle`, `collapse-chevron`, `collapse-content`, `collapse-card`, `collapse-card-toggle`, `collapse-card-content`, `collapse-inline-toggle`, `collapse-inline-content` | yes — HSCollapse | Single inline show/hide — default, initially open, icon, card variant, inline "show more", multiple independent. Uses `data-hs-collapse`. |

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
| Navbar / Top Bar | `nav-topbar.html` | `navbar`, `navbar-shell`, `navbar-compact`, `navbar-transparent`, `navbar-brand`, `navbar-nav`, `navbar-nav-item`, `navbar-actions`, `navbar-action-btn`, `navbar-user`, `navbar-user-name`, `navbar-user-role`, `navbar-mobile-toggle`, `navbar-mobile-menu`, `navbar-divider` | yes — hs-dropdown, hs-collapse | Top application bar — logo, nav links, user dropdown. Mobile hamburger via hs-collapse. Toggle/menu/divider use container queries against `.navbar` (or `.navbar-shell` when collapse target is a sibling). |
| Tab Nav | `nav-tabs.html` | `tab-nav`, `tab-nav-item` | yes | Preline `hs-tab-active` class on active item |
| Stepper | `nav-stepper.html` | `stepper`, `stepper-nav`, `stepper-nav-item`, `stepper-nav-icon`, `stepper-nav-label`, `stepper-nav-line`, `stepper-nav-description`, `stepper-content`, `stepper-content-item`, `stepper-actions`, `stepper-nav-vertical` | yes — HsStepper | Horizontal/vertical step indicator. Preline drives transitions. `.completed` / `.active` for static state demos. |
| Sub-Nav (sidebar) | *(inside App Shell)* | `sidebar-subnav-list`, `sidebar-subnav-item` | no | Indented sub-items in sidebar accordion |

---

## Overlays

| Component | File | Classes | Preline | Notes |
|---|---|---|---|---|
| Dropdown | `overlay-dropdown.html` | `hs-dropdown-menu`, `hs-dropdown-item` | yes | **Use exact pattern from CLAUDE.md.** Never add transition utilities to menu div. |
| Context Menu | `overlay-context-menu.html` | `ctx-menu`, `ctx-menu-item`, `ctx-menu-item-danger`, `ctx-menu-divider`, `ctx-menu-label`, `ctx-menu-shortcut`, `ctx-menu-icon`, `ctx-menu-backdrop` | no | Vanilla JS — right-click / long-press. JS: `context-menu.js`. Trigger via `data-ctx-menu="<id>"`. |
| Modal | `overlay-modal.html` | `modal-panel` | yes | |
| Confirm Dialog | `overlay-confirm-dialog.html` | `confirm-dialog-icon`, `confirm-dialog-icon-danger`, `confirm-dialog-icon-warning`, `confirm-dialog-icon-info`, `confirm-dialog-title`, `confirm-dialog-body` | yes — hs-overlay | Destructive/warning/info confirmation. Reuses `modal-panel` + `card`. |
| Bottom Sheet | `overlay-bottom-sheet.html` | `bottom-sheet-panel`, `bottom-sheet-handle`, `bottom-sheet-header`, `bottom-sheet-title`, `bottom-sheet-body` | yes — hs-overlay | Mobile-only slide-up drawer. Reuses `.hs-overlay-backdrop`. Max 85vh, scrollable body. Patient app. |

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
| Skip Link | _(no PL page — utility class)_ | `skip-link` | no | WCAG 2.4.1 bypass-blocks affordance. Visually hidden until focused, then pinned top-left. Pair with a matching `id` target (e.g. `<a class="skip-link" href="#main">`). |
| Accordion Toggle | `util-accordion-toggle.html` | `hs-accordion-toggle`, `accordion-chevron-up`, `accordion-chevron-down` | yes | Sidebar accordion pattern |
| Instruction Card | `util-instruction-card.html` | `instruction-title`, `instruction-text` | no | Helper text block |
| Sidebar Toggle Bar | `util-sidebar-toggle.html` | `sidebar-toggle-bar`, `sidebar-toggle-btn` | yes | Mobile sidebar open trigger |
| Tag Container | `util-tag-container.html` | `tag-container` | no | Flex wrap for tag badges |
| Editable Indicator | _(no PL page — utility class)_ | `editable-indicator` | no | Inline label + pen icon for coordinator-owned editable sections (cc-05). One-line semantic class; pair with `<i class="fa-solid fa-pen-to-square">` + label text. |

---

## Clinical / Healthcare

| Component | File | Classes | Preline | Notes |
|---|---|---|---|---|
| Activity Feed Row | `clinical-activity-feed.html` | `activity-feed-row` | no | |
| AI Field | `clinical-ai-field.html` | `ai-field`, `ai-field-icon`, `ai-field-confirmed`, `ai-field-confirmed-icon`, `ai-field-label`, `ai-field-confirmed-label`, `ai-field-zero-callout` | no | Agent-populated values pending confirmation |
| Alert Category Card | `clinical-alert-category.html` | `alert-category-card`, `alert-category-label` | no | `--alert-accent` CSS var for left border color |
| Alert Summary Row | `clinical-alert-summary-row.html` | `alert-summary-row`, `alert-summary-row-title`, `alert-summary-row-meta`, `alert-summary-row-status` | no | Wrap rows in a `.card`. Status modifiers: `.is-active`, `.is-resolved`, `.is-pending`. Already excluded from `card-body` spacing rule. |
| HEDIS Grid | `clinical-hedis-grid.html` | `hedis-grid`, `hedis-stat`, `hedis-stat-label`, `hedis-stat-value`, `hedis-stat-detail` | no | |
| Medication Row | `clinical-medication-row.html` | `medication-row`, `medication-row-icon`, `medication-row-details`, `medication-row-name`, `medication-row-dose` | no | Wrap rows in a `.card`. Already excluded from `card-body` spacing rule. |
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
| Progress Bar | `data-progress.html` | `progress`, `progress-bar`, `progress-label`, `progress-label-text`, `progress-label-value`, `progress-sm`, `progress-lg`, `progress-primary`, `progress-success`, `progress-warning`, `progress-error`, `progress-info`, `progress-striped`, `progress-animated`, `progress-inner-label`, `progress-stacked` | no | Linear progress — labeled, colored, striped, stacked. Width set via `style="width: N%"` on `.progress-bar`. |
| Pipeline Bar | `complex-pipeline-bar.html` | `pipeline-bar`, `pipeline-segment` | no | Proportional stacked bar. Segments use `style="flex: N"` (data-driven, acceptable). |
| Prompt Input | `complex-prompt-input.html` | `prompt-input-container`, `prompt-textarea`, `prompt-toolbar`, `category-chip` | no | AI prompt box with category chips |
| Tag Group | `complex-tag-group.html` | `tag-group`, `tag-group-label`, `badge-removable` | no | |
| Notification Center | `complex-notification-center.html` | `notif-center`, `notif-center-header`, `notif-center-title`, `notif-center-count`, `notif-center-count-positioned`, `notif-center-mark-read`, `notif-center-tabs`, `notif-center-tab`, `notif-center-body`, `notif-center-empty`, `notif-center-empty-icon`, `notif-center-empty-text`, `notif-group-label`, `notif-item`, `notif-item-unread`, `notif-item-icon`, `notif-item-icon-success`, `notif-item-icon-warning`, `notif-item-icon-error`, `notif-item-icon-info`, `notif-item-icon-default`, `notif-item-content`, `notif-item-title`, `notif-item-description`, `notif-item-time`, `notif-item-dismiss`, `notif-center-footer` | yes — hs-dropdown (for dropdown trigger demo) | Grouped notification list with dismiss. JS: `notification-center.js`. |
| Command Palette | `complex-command-palette.html` | `cmd-palette`, `cmd-palette-backdrop`, `cmd-palette-panel`, `cmd-palette-search`, `cmd-palette-input`, `cmd-palette-shortcut`, `cmd-palette-body`, `cmd-palette-empty`, `cmd-palette-group`, `cmd-palette-group-title`, `cmd-palette-item`, `cmd-palette-item-icon`, `cmd-palette-item-content`, `cmd-palette-item-title`, `cmd-palette-item-description`, `cmd-palette-item-shortcut`, `cmd-palette-footer`, `cmd-palette-footer-hint` | no | Keyboard-driven search/action launcher. JS: `command-palette.js`. Open via Cmd+K / Ctrl+K or trigger button. |

---

## Chart Utilities

| Component | File | Classes | Preline | Notes |
|---|---|---|---|---|
| Chart Containers | `chart-containers.html` | `chart-canvas-wrapper`, `chart-sparkline`, `chart-line`, `chart-bar` | no | **No pie or donut charts.** Use stat cards or bar charts. |

---

## Diagrams

Inline-SVG primitives for system diagrams. Layer 1 = hand-coordinate authoring; Layer 2 = dagre-backed `diagram-graph` helper composes these primitives at computed positions (ships in a follow-up lane). All tokens land in `semantic.css` (color) + `typography.css` (font) + `components.css` (radius alias). Spec: `~/.claude/plans/haven-ui-diagram-research.md`.

| Component | File | Classes | Preline | Notes |
|---|---|---|---|---|
| Diagram Frame | `diagram-frame.html` | `diagram-frame`, `diagram-frame-wrap`, `diagram-frame-placeholder`, `diagram-frame-placeholder-label`, `diagram-marker-sample-label` | no | Outer SVG container. role="img" + aria-label required; aria-describedby optional. Default viewBoxes: landscape 760×460, wide 760×360, timeline 760×200. Wrap in `<div class="diagram-frame-wrap">` to opt into horizontal-scroll-below-500px (round-3 P1). |
| Diagram Marker Defs | `diagram-marker-defs.html` | `diagram-marker-defs`, `diagram-marker-fill`, `diagram-marker-fill-emphasis`, `diagram-marker-stroke` | no | SVG arrow markers. All point +X with orient="auto" tangent rotation; markerUnits="userSpaceOnUse"; refX="9" for visual gap. Four IDs: `arrow-end`, `arrow-end-emphasis`, `arrow-end-bidirectional`, `arrow-end-open`. |
| Diagram Box | `diagram-box.html` | `diagram-box`, `diagram-box-shape`, `diagram-box-label`, `diagram-box-sublabel`, `diagram-box-overline`, `diagram-box--dashed`, `diagram-box--substrate`, `diagram-box--ghost`, `diagram-box--milestone-done`, `diagram-box--milestone-progress`, `diagram-box--milestone-queued` | no | Rounded-rect surface. Substrate uses teal-800 (logo-anchor) NOT teal-700 (round-4 B1). Dashed uses sand-100 NOT sand-50 (round-4 B2). Corner radius pinned to `--radius-diagram-box` = radius-sm (round-4 B3). |
| Diagram Pill | `diagram-pill.html` | `diagram-pill`, `diagram-pill-shape`, `diagram-pill-label`, `diagram-pill--surface-dark`, `diagram-pill--mono` | no | Small chip inside diagrams. Default = white fill + sand-500 stroke (1.4.11 pass). Pill rx (~half height); kept distinct from box's radius-sm. |
| Diagram Arrow | `diagram-arrow.html` | `diagram-arrow`, `diagram-arrow--emphasis`, `diagram-arrow--muted`, `diagram-arrow--dashed`, `diagram-arrow--dotted` | no | Connector path. Always reference markers from `diagram-marker-defs` via `marker-end="url(#arrow-end)"`. aria-hidden on the path; meaning lives in connected boxes' labels and the diagram's long-desc. |
| Diagram Lane | `diagram-lane.html` | `diagram-lane`, `diagram-lane-label`, `diagram-lane-boundary` | no | Swim-lane region grouping boxes. Label uses Source Code Pro per Cena canon (round-4 B4). Optional dashed boundary. |
| Diagram Caption | `diagram-caption.html` | `diagram-caption` | no | Italic explanatory text below a diagram. Lora italic + weight 500 (one step above 400 roman per `feedback_lora_italic_weight_bump.md`). |
| Diagram Milestone | `diagram-milestone.html` | `diagram-milestone`, `diagram-milestone-shape`, `diagram-milestone-track`, `diagram-milestone-check`, `diagram-milestone-title`, `diagram-milestone-subtitle`, `diagram-milestone--done`, `diagram-milestone--progress`, `diagram-milestone--queued` | no | Timeline-circle with title/subtitle. Progress state IS the canonical user-commitment use of teal-700, distinct from substrate's teal-800 anchor. |
| Diagram Icon | `diagram-icon.html` | `diagram-icon`, `diagram-icon--folder`, `diagram-icon--code`, `diagram-icon--comments`, `diagram-icon--robot`, `diagram-icon--public`, `diagram-icon--smart-toy`, `diagram-icon--forum` | no | Two paths: SVG `<text>` (font-family + content authoring) and HTML `<span>` (::before resolver classes — true name-only authoring, one-file FA-Pro swap when CDN access lands). |
| Diagram Long-Desc | (markup hook in `diagram-frame.html`) | `diagram-long-desc`, `diagram-long-desc__purpose`, `diagram-long-desc__elements`, `diagram-long-desc__relationships`, `diagram-long-desc__notes` | no | Sr-only canonical long-desc structure (purpose → elements → relationships → notes). Purpose-line uses Cena observational + specific brand voice per round-4 B5. |
| Diagram Graph (Layer 2) | `diagram-graph.html` | (renders Layer 1 primitives — no new classes) | yes (dagre via npm) | Data-driven authoring. Author `data-diagram-graph='{nodes:[...],edges:[...]}'` on a `<svg class="diagram-frame">`; the env module runs dagre + renders Layer 1 primitives. Endpoint contract: 12 named anchors + auto, polyline / smooth route modes, 4 marker styles, self-loops rejected. Module: `src/scripts/env/diagram-graph.js` (ESM). |

---

## Patient App

| Component | File | Classes | Preline | Notes |
|---|---|---|---|---|
| Meal Delivery Card | `meal-delivery-card.html` | `meal-delivery-card`, `meal-delivery-card-img`, `meal-delivery-card-body`, `meal-delivery-card-name`, `meal-delivery-card-day`, `meal-delivery-card-tags`, `meal-delivery-card-swap`, `meal-delivery-card.is-swapped` | no | Idle-pane delivery + swap. Add `.is-swapped` after swap. Missing images show `bg-sand-100` placeholder. Distinct from agentic MealOptionCard (browse + select). |
| Delivery Status Card | `patient-delivery-status-card.html` | `delivery-status-card`, `delivery-status-top`, `delivery-status-icon`, `delivery-status-label`, `delivery-status-timing`, `delivery-status-divider`, `delivery-summary`, `delivery-summary-label`, `delivery-summary-count`, `delivery-summary-list` | no | Three states (preparing/delivering/delivered) driven by JS URL param. |
| Message Bubble | `patient-message-bubble.html` | `message-bubble-out`, `message-bubble-in`, `message-sender-label`, `message-date-sep`, `message-timestamp`, `message-new-pill` | no | Right-align outgoing with `flex flex-col items-end`; left-align incoming with `items-start`. |
| Feedback Rating Card | `patient-feedback-rating.html` | `feedback-rating-fieldset`, `feedback-rating-card` | no | Uses `:has(input:checked)` for selected state. Three cards in `grid grid-cols-3 gap-2`. |
| Preference Image Card | `patient-pref-image-card.html` | `pref-image-card`, `pref-image-card-img-wrap`, `pref-image-card-img`, `pref-image-card-check`, `pref-image-card-label`, `pref-image-card-img-wrap-plain` | no | Mutual exclusivity JS: `src/scripts/components/pref-image-cards.js`. Grid: `grid grid-cols-2 gap-3`. |
| Task Card | `patient-task-card.html` | `task-card`, `task-card-icon`, `task-card-content`, `task-card-name`, `task-card-meta`, `task-card-overdue`, `task-card-in-progress`, `task-card-completed` | no | Tappable task row. Overdue: left warning border + badge. In-progress: left teal border + teal meta (via descendant rule). Completed: muted + check icon. React port: `<TaskCard />`. |
| Focus Card | `patient-focus-card.html` | `patient-focus-card`, `patient-focus-card-icon`, `patient-focus-card-body`, `patient-focus-card-title`, `patient-focus-card-context`, `patient-focus-card-actions` | no | The single surfaced due-item on Home's things-to-do zone (Home spec §3b/c). Calm invitation: soft agent glyph (decorative, aria-hidden) + plain title + one context line + default-size primary action (`btn-primary`) + quiet "Not now" (`btn-ghost`). Default button size (not `btn-sm`) for ≥44px tap targets. Deliberately NOT task-card's register — no overdue-red, no count, no completion-check, no shaming. Surface one at a time; others collapse via `data-collapse`. Live-region + post-dismiss focus owned by the zone container in the slice (see @component-meta notes). NOT for the caught-up affirmation (distinct chrome-less block). React port deferred (handoff slice is HTML). |
| Trend Card | `patient-trend-card.html` | `trend-card`, `trend-card-header`, `trend-card-chart` | no | Metric summary + sparkline. Requires Chart.js. Tappable → metric detail. |
| Emoji Scale | `patient-emoji-scale.html` | `emoji-scale`, `emoji-scale-option`, `emoji-scale-icon`, `emoji-scale-label` | no | Horizontal emoji/icon selector for assessments. `:has(input:checked)` pattern. 3–5 options. |
| Assessment Slider | `patient-assess-slider.html` | `assess-slider`, `assess-slider-value`, `assess-slider-track`, `assess-slider-labels`, `assess-progress`, `assess-progress-bar`, `assess-progress-fill` | no | Styled range input + progress bar for question stepper. JS: `src/scripts/components/assess-slider.js`. |
| Response Option | `response-option.html` | `response-option`, `response-option-index`, `response-option-index-num`, `response-option-label`, `response-option-check` | no | Numbered Likert / multi-choice option for assessments (GAD-7, PHQ-9). Root is `<button role="radio">`; selected state via `aria-checked="true"` (Radix-compatible). 325px max-width, 36×36 index square (rounded-[2px]), check icon fades in on select. |
| Response Option Group | `response-option-group.html` | `response-option-group`, `response-option-group-prompt`, `response-option-group-list` | no | Fieldset-equivalent wrapper pairing one question prompt with N response-options. Uses `role="radiogroup"` + `aria-labelledby`. Prompt is Body/01 (19.2px Inter). |
| Progress Bar Pagination | `progress-bar-pagination.html` | `progress-bar-pagination`, `progress-bar-pagination-segment` | no | Step-per-segment progress indicator for assessments — N bars, `.is-filled` for completed. `sand-500` empty / `accent-interactive` filled per DESIGN.md §Assessment patterns. Distinct from `data-progress` (single continuous bar). |
| Assessment Header | `assessment-header.html` | `assessment-header`, `assessment-header-title`, `assessment-header-meta` | no | Top of every assessment screen. Heading/02 title + `progress-bar-pagination` + optional Body/04 meta ("Question N of M"). |
| Pagination Row | `pagination-row.html` | `pagination-row` | no | Previous / Next anchor for paginated flows (assessments, onboarding). Distinct from `data-pagination` (page-number pills for tables). Previous = `btn-outline` (tertiary), Next = `btn-secondary` per DESIGN.md §Component archetypes — primary teal is reserved for commitments, not advancement. |
| Chat Button Row | `chat-button-row.html` | `chat-button-row`, `chat-button-row.has-helper`, `chat-row-helper` | no | Inline button row embedded in patient-app chat thread. Tier comes from the btn-* child (row is tier-agnostic). Variants: single (one btn-secondary advancement), dual (two btn-secondary, peer irreversible-feeling choices), asymmetric (btn-secondary + btn-primary, advancement + commit pair — e.g., Skip + Save when the row terminates a multi-step affordance like chat-tag-group). `.has-helper` modifier stacks a helper paragraph below the button(s); use with btn-primary for commits, with btn-secondary when an advancement needs a gating reason. Helper class `.chat-row-helper` is shared across chat-row siblings. Two editorial contracts on helper text: helper-gate (paired with disabled button + `aria-describedby`) names the unmet precondition; helper-consequence (paired with enabled button) names the commit side effect. Covers gap-doc C-1 / C-2 / C-14 (and provides the asymmetric composition consumed by C-4). |
| Chat Chip Row | `chat-chip-row.html` | `chat-chip-row`, `chat-chip-row.is-small`, `chat-chip`, `chat-chip.is-soft` | no | Pill-shaped affordance row embedded in patient-app chat thread. `.chat-chip` mirrors btn-secondary's fill + focus register exactly (sand-100 fill, sand-700 text, sand-500 focus ring) — pill geometry is the only visual difference. `.is-soft` per-chip modifier mutes one option for the C-8 "Just say I'm okay" pattern (transparent fill + sand-200 border so the chip still reads as a chip without filled chrome). `.is-small` per-row modifier scales chips down for context-probe groups (C-12); soft-escape ("Skip") is an additive 4th option carved out at small size only. Editorial 1–3 cap on main options. Lifecycle: ephemeral, replaced (not disabled) when state shifts. For commits use chat-button-row; for selected-state tag-confirmation flows use chat-tag-group. Covers gap-doc C-3 / C-6 / C-7 / C-8 / C-12. |
| Chat Handoff Trigger | `chat-handoff-trigger.html` | `chat-handoff-trigger`, `chat-handoff-trigger.is-header` | no | Persistent "talk to a person" affordance embedded in patient-app chat. Tertiary tier (transparent fill + sand-300 border) — always available without competing with the conversation. Default variant for sticky-footer mobile placement (compose with `.btn-block` in `.sticky-footer` container). `.is-header` for desktop chat-header (smaller chip register). NOT ephemeral — session-level affordance that persists across agent turns. On tap, the consumer opens the appropriate handoff pathway (typically the `handoff-menu` primitive's patient-initiated variant). Covers gap-doc C-5. |
| Chat Numeric Input | `chat-numeric-input.html` | `chat-numeric-input`, `chat-numeric-input-field`, `chat-numeric-input-unit` | no | Single-value numeric input embedded in the patient-app chat thread. Field + optional trailing unit-toggle pill (chat-chip-shaped, taps cycle units). Defaults to last-used unit per consumer memory (chat-affordance principle). Distinct from clinician-facing `nutrition-input` (always-editable cell, no unit toggle, different surface). Pair with `chat-button-row` submit when the input is gating an advancement. Covers gap-doc C-9. |
| Chat Paired Numeric | `chat-paired-numeric.html` | `chat-paired-numeric`, `chat-paired-numeric-separator` (uses `chat-numeric-input-field`) | no | Two number fields separated by a slash glyph. Canonical use: blood pressure (systolic / diastolic). Each field carries its own sr-only `<label>` so screen-reader users hear the half-name; the slash separator is `aria-hidden`. No unit toggle (BP units don't vary in patient-facing flows). Single-use today; PL coverage authored proactively for future paired-numeric patterns. Covers gap-doc C-10. |
| Chat Time Preference Picker | `chat-time-preference-picker.html` | `chat-time-preference-picker`, `chat-time-preference-picker-input`, `chat-time-preference-picker-section-label` (composes `chat-chip-row.is-small` + `chat-chip` + `.is-soft`) | no | Time-window preference composition: free-text input + 2× `chat-chip-row.is-small` (day-of-week, time-of-day). Free text takes editorial precedence — when both are populated, the consumer treats free text as canonical. Path A only (free-text + chips); Path B (Athena slot list, R-15) is a separate primitive. Lifecycle: ephemeral, replaced when state shifts. Covers gap-doc C-13. |
| Chat Sheet Link | `chat-sheet-link.html` | `chat-sheet-link`, `chat-sheet-link-icon` | no | Inline link in agent message that opens a right-pane sheet (or bottom-sheet on mobile). Composes `text-link` color register (primary-600); implemented as `<button>` (sheet-opening is a UI action, not navigation) with trailing icon hint and `aria-haspopup="dialog"`. Same component across viewports; only the target sheet behavior differs by breakpoint (`overlay-bottom-sheet` on mobile, right-pane slide-in on desktop). Renamed from `chat-mobile-link`. Covers gap-doc C-16. |
| Chat Status Row | `chat-status-row.html` | `chat-status-row`, `chat-status-row-icon` | no | Patient-app variant of `thread-msg-system`. Subdued centered row for system events in the chat thread — typically CC takeover ("Maria joined the conversation") or handback signals. Sand-700 text on chat-pane sand-50 surface (clears WCAG AA where coordinator's sand-600 register would not). Covers gap-doc C-17. |
| Patient Chat Message | `patient-chat-message.html` | `patient-chat-message`, `patient-chat-message-indicator`, `patient-chat-message-body` | no | Ava-styled chat message for the patient app per DESIGN.md §Chat message patterns: dot-sparkle leading indicator + plain Body/02 paragraph, no bubble chrome. Distinct from `complex-chat`'s `chat-bubble-ai` (filled bubble) and from coordinator's `thread-msg-*` family. Patient-app chat-pane is a conversation, not a console — Ava gets visual minimalism. Covers gap-doc C-15. |
| Budget Meter | `budget-meter.html` | `budget-meter`, `budget-meter-label`, `budget-meter-amount`, `budget-meter-message`, `budget-meter.is-error`, `budget-meter.is-empty` | no | Patient-facing weekly meal-budget display ($X of $Y). Composes `.progress` + `.progress-bar` + state-specific progress modifiers (.progress-success, .progress-error). State modifiers on the wrapper: default (in-budget), `.is-error` (over-budget, error register), `.is-empty` ($0 first-time). Optional `.budget-meter-message` line for context ("$80 left this week", "Over budget by $15"). Covers gap-doc R-1 / R-11. |
| Flow Actions | _(behavior primitive — no PL HTML)_ | `[data-nav]`, `[data-action="save"]`, `[data-reveal-submit]`, `[data-submit-region]` | no | Framework-agnostic flow-advancement behavior so no-framework static builds advance + complete without a router. JS: `src/scripts/components/flow-actions.js`. `[data-nav="path"]` click → navigate; `[data-action="save"]` → in-place saved state; `[data-reveal-submit]` → reveal `[data-submit-region]` + enable `[data-action="submit"]`. file://-safe (no fetch). Consumed by the cena-uconn handoff bundle (copy in its `assets/`). |
| Quantity Stepper | `quantity-stepper.html` | `quantity-stepper`, `quantity-stepper-btn`, `quantity-stepper-value`, `[data-quantity-stepper]`, `[data-quantity-stepper-announce]`, `[data-action="decrement"]`, `[data-action="increment"]` | no | Patient-app +/- stepper for adjusting numeric quantities. Pill-shaped row with secondary-100 surface; minus + tabular-numeric value cell + plus. Behavior ships as `src/scripts/components/quantity-stepper.js` — vanilla ES module attaches via `[data-quantity-stepper]`, reads `data-value` / `data-min` / `data-max` / `data-step`, auto-disables buttons at bounds, emits bubbling `quantity-change` CustomEvent with `{ value, previousValue, source }` detail. Programmatic API at `el._quantityStepper.setValue(n)`. SR announcements debounced 400ms via `[data-quantity-stepper-announce]` live region (resolves chatty-announcement a11y verdict 2026-05-12). Distinct from kitchen-meal-assignment-grid's `meal-qty-cell` (kitchen-only tabular pattern). |
| Appointment Card | `appointment-card.html` | `appointment-card`, `appointment-card-header`, `appointment-card-avatar`, `appointment-card-meta`, `appointment-card-title`, `appointment-card-subtitle`, `appointment-card-details`, `appointment-card-detail-row`, `appointment-card-detail-icon`, `appointment-card-actions` | no | Single upcoming appointment display: avatar + name + role + date/time + location + add-to-calendar action. Composes `.card`. Used in onboarding Fork A confirmation, idle next-appointment, request-appointment confirmation. Add-to-calendar = btn-secondary (advancement; appointment already exists). Covers gap-doc R-12 / R-13. |
| Appointments List | `appointments-list.html` | `appointments-list`, `appointments-list-row`, `appointments-list-row-icon`, `appointments-list-row-meta`, `appointments-list-row-when`, `appointments-list-row-who`, `appointments-list-empty` | no | Read-only list of upcoming appointments — icon + when-line + who-line per row. Used below `appointment-card` (next-up) when the patient has 2+ scheduled visits. Empty-state row included. Composes `.card`. Covers gap-doc R-14. |
| Pending Request Card | `pending-request-card.html` | `pending-request-card`, `pending-request-card-body`, `pending-request-card-type`, `pending-request-card-detail`, `pending-request-card-status-row`, `pending-request-card-eta` | no | Outstanding patient request awaiting CC response — type + preference window + status badge + ETA line. Composes `.card` + `.badge` family. Status: badge-warning (pending), badge-info (queued), badge-success (approved transitional state). Covers gap-doc R-15 / R-16 / R-17. |
| Delivery Status Timeline | `delivery-status-timeline.html` | `delivery-status-timeline`, `delivery-status-timeline-body`, `delivery-status-timeline-list`, `delivery-status-timeline-step` (`.is-complete`, `.is-current`), `delivery-status-timeline-icon`, `delivery-status-timeline-meta`, `delivery-status-timeline-label`, `delivery-status-timeline-when`, `delivery-status-timeline-window` | no | 5-step fulfillment timeline for the patient's most-recent meal order. State per step: future (default), `.is-complete` (primary-100 fill), `.is-current` (primary-600 filled). Pickup / delivery variants only differ in icons and final-step label. Distinct from agentic `progress-tracker` (action steps, not fulfillment milestones). Covers gap-doc R-9. |
| Meal Warning Tooltip | `meal-warning-tooltip.html` | `meal-warning-tooltip`, `meal-warning-tooltip-icon` | yes — hs-tooltip | Inline warning hint on a meal item — soft signals like "contains peanuts (saved preference)" or "above weekly sodium target." "Never blocks, never dims" rule: meal item stays at full opacity, remains tappable. Warning-600 (amber) tone, not error-red — patient is informed, not gated. Composes Preline tooltip via `data-hs-tooltip`. Covers gap-doc R-7. |
| Onboarding Orientation Card | `onboarding-orientation-card.html` | `onboarding-orientation-card`, `onboarding-orientation-card-body`, `onboarding-orientation-card-title`, `onboarding-orientation-card-grid`, `onboarding-orientation-card-cell`, `onboarding-orientation-card-icon`, `onboarding-orientation-card-label` | no | 3-column icon-label card for onboarding step 5 visual primer. Visual-only; non-interactive. Composes `.card` + 3-col grid. Icons primary-100/-700 for warm Restrained accent. Covers gap-doc R-18. |
| Consent Doc Viewer | `consent-doc-viewer.html` | `consent-doc-viewer`, `consent-doc-viewer-header`, `consent-doc-viewer-title`, `consent-doc-viewer-scroll`, `consent-doc-viewer-actions` | optional — hs-overlay | Consent / agreement doc preview during onboarding. Card with scroll-bounded body, `View full document` (btn-secondary, opens overlay-bottom-sheet on mobile / sheet panel on desktop), `Acknowledge` (btn-primary commit). Covers gap-doc R-19. |
| Week Rhythm Card | `week-rhythm-card.html` | `week-rhythm-card`, `week-rhythm-card-body`, `week-rhythm-card-row`, `week-rhythm-card-icon`, `week-rhythm-card-meta`, `week-rhythm-card-label`, `week-rhythm-card-detail` | no | 3-row visualization of weekly cadence (meal-ordering window, CC check-in cadence, occasional surveys). Visual-only, non-interactive. Composes `.card`. Sand-toned icon register (secondary-100), not primary — this primitive is about routine continuity, not a commit moment. Covers gap-doc R-20. |
| Patient Recall List | `patient-recall-list.html` | `patient-recall-list`, `patient-recall-list-header`, `patient-recall-list-header-day`, `patient-recall-list-header-pass`, `patient-recall-list-rows`, `patient-recall-list-row`, `patient-recall-list-row-name`, `patient-recall-list-row-when`, `patient-recall-list-row-amount`, `patient-recall-list-row-trash`, `patient-recall-list-footer`, `patient-recall-list-add`, `patient-recall-list.is-locked` | no | Multi-pass dietary recall display in the right-pane during chat-driven recall flow. Header (day in Lora Medium 16 + pass indicator) + 4-col grid rows (name + when + amount + trash). Columns populate progressively across passes 1–4; passes 5–6 lock the list (`.is-locked` hides trash + footer). "+ add" footer when editable. Renamed from food-recall-list. Covers gap-doc R-21. |
| Outreach Card | `outreach-card.html` | `outreach-card`, `outreach-card-header`, `outreach-card-avatar`, `outreach-card-meta`, `outreach-card-eyebrow`, `outreach-card-name`, `outreach-card-role`, `outreach-card-when`, `outreach-card-body`, `outreach-card-question-preview`, `outreach-card-actions`, `outreach-card.is-checkin-active`, `outreach-card.is-handoff-live`, `outreach-card-live-indicator`, `outreach-card-live-indicator-dot` | no | Right-pane CC outreach surface — photo + name + role + arrival time + topic + optional note + actions. Variants: weekly-checkin (with question preview), missed-visit (softer copy), general-message, photo-unavailable. Live modifiers `.is-checkin-active` / `.is-handoff-live` add a 4px primary-500 left-edge accent + pulsing dot indicator. Renamed from cc-outreach-card. Covers gap-doc R-22 / R-23 / R-24. |
| Handoff Menu | `handoff-menu.html` | `handoff-menu`, `handoff-menu-header`, `handoff-menu-avatar`, `handoff-menu-meta`, `handoff-menu-eyebrow`, `handoff-menu-title`, `handoff-menu-subtitle`, `handoff-menu-body`, `handoff-menu-option`, `handoff-menu-option-icon`, `handoff-menu-option-meta`, `handoff-menu-option-label`, `handoff-menu-option-helper`, `handoff-menu-fallback` | no | Handoff routing menu: contact identity header + stacked option buttons (Phone / In-chat / Email) each with helper copy. 11 editorial variants per gap-doc (patient-initiated, agent-suggested, agent-escalated, crisis-non-clinical, crisis-clinical, cc-unavailable, language-mismatch, anonymized, no-cc-assigned, order-status-escalation, respond-to-cc-handoff). 4 representative demos shipped; remaining variants are editorial copy + button-set differences over the same primitive shape. Covers gap-doc R-23. |
| Crisis Resources Card | `crisis-resources-card.html` | `crisis-resources-card`, `crisis-resources-card-body`, `crisis-resources-card-title`, `crisis-resources-card-text`, `crisis-resources-card-actions`, `crisis-resources-card-action`, `crisis-resources-card-action-icon`, `crisis-resources-card-action-meta`, `crisis-resources-card-action-label`, `crisis-resources-card-action-helper` | no | 988 + UConn-specific crisis protocol. surface-card + 4px error-500 left-edge accent. NEVER full-red surface (violates Warm Ground / Cool Figure). Variants TBD pending UConn clinical-team protocol input. Covers gap-doc R-26. |
| Assessment Preflight Card | `assessment-preflight-card.html` | `assessment-preflight-card`, `assessment-preflight-card-body`, `assessment-preflight-card-title`, `assessment-preflight-card-meta`, `assessment-preflight-card-meta-item`, `assessment-preflight-card-disclosure`, `assessment-preflight-card-actions` | no | Pre-flight card before the questionnaire — instrument name in plain language + question count + time estimate + disclosure + Begin (btn-primary commit, creates session record). Covers gap-doc R-25. |
| Trend Snippet List | `trend-snippet-list.html` | `trend-snippet-list`, `trend-snippet-list-body`, `trend-snippet-list-title`, `trend-snippet-list-row`, `trend-snippet-list-row-when`, `trend-snippet-list-row-value` | no | Bullet/row list of last 3-5 values with dates — quick-glance trend without a chart. Distinct from `patient-trend-card` (Chart.js sparkline). Covers gap-doc R-27. |
| Log Confirmation Card | `log-confirmation-card.html` | `log-confirmation-card` (composes `.receipt`) | no | Patient-app log receipt — composes existing `.receipt` agentic pattern. Attribute(s) + value(s) + context + timestamp + reassurance copy. Used after the patient logs a value (weight, BP, recall). Covers gap-doc R-28. |
| Assessment Confirmation | `assessment-confirmation.html` | `assessment-confirmation` (composes `.receipt`) | no | Patient-app receipt after assessment submission. Composes `.receipt`. CRITICAL: NO score is rendered to the patient — patients see "submitted, your care team has it" reassurance only; the score routes to the clinician surface. Covers gap-doc R-29. |
| Patient Week Panel | `patient-week-panel.html` | `patient-week-panel`, `patient-week-panel-section`, `patient-week-panel-section-label` | no | Tier 2 section-wrapper. The wrapper provides vertical rhythm + optional eyebrow labels; **the middle slot composes any time-bounded primitive** — `patient-delivery-status-card` for idle-state, `delivery-status-timeline` for active-order (post-submit), or any future time-bounded primitive that fits the rhythm. The PL demo composition documents one valid arrangement (budget → delivery-status-card → appointment-card); consumers compose alternatives using the same `.patient-week-panel-section` wrappers. Renamed from at-a-glance-panel. Covers gap-doc R-30. |
| Chat Tag Group | `chat-tag-group.html` | `chat-tag-group`, `chat-tag-group-prompt`, `chat-tag-list`, `chat-tag` (composes `chat-chip`), `chat-tag.is-selected`, `chat-tag-check` | no | Preference-confirmation column embedded in patient-app chat thread. Composition: leading prompt (Body/02 16px) + flex-wrap toggleable tag list + `chat-button-row` asymmetric variant (Skip btn-secondary + Save btn-primary). Tags compose `.chat-chip` for the unselected register (no token duplication); `.chat-tag` is the behavior-marker class scoping the toggle-aware focus ring (sand-700) and `.is-selected` rule. Selected state is sand-200 fill + sand-700 border + check icon (`chat-tag-check`) — Restraint-clean (no teal), triple-cued differentiation per WCAG 1.4.1 (color is not the only signal) and 1.4.3/1.4.11 (~5.4:1 text contrast, ≥3:1 border contrast). ARIA: row is `role="group"` + `aria-labelledby` referencing the prompt; tags are `<button aria-pressed>` (multi-select toggle, not radiogroup). Restaurant-menu register only (food preferences); clinical labels belong in `complex-tag-group`. Care-plan-derived tags can render pre-selected per chat-affordance principles. Lifecycle: row is mounted while toggling pre-Save; Save and Skip both terminate the affordance and the consumer removes the row. Covers gap-doc C-4. |

---

## Meal Assignment Grid (Kitchen-Specific)

These components live in `src/partials/` as full partials, not standalone pattern library
components. They are tightly coupled to the kitchen app and must not be used in other apps.

| Partial | Classes |
|---|---|
| `kitchen-meal-assignment-grid.html` | `meal-qty-cell`, `meal-qty-input`, `meal-qty-btn`, `meal-col-header`, `meal-col-name`, `meal-col-meta`, `meal-temp-tag`, `meal-mod-cell`, `meal-totals-cell`, `data-table-sticky-cols` |

---

## Queue (Care Coordinator)

| Component | File | Classes | Preline | Notes |
|---|---|---|---|---|
| Queue Item | `queue-item.html` | `queue-item`, `queue-item-header`, `queue-item-name`, `queue-item-summary`, `queue-item-meta`, `queue-item-sla` | no | Root is `<button>` inside `<li>`. Urgency: `.is-urgent`, `.is-attention`, `.is-info`. State: `.active` (sets `aria-current="true"`). SLA: `.is-warning`, `.is-breached`. Decorative SLA icon carries `aria-hidden="true"`; SLA span carries `aria-label` naming the state. |
| Queue Section Header | `queue-section-header.html` | `queue-section-header` | no | Rendered as `<h2>` (or matching heading level). Urgency: `.is-urgent`, `.is-attention`, `.is-info`. Icon is `aria-hidden="true"`. |
| Queue Sidebar | `queue-sidebar.html` | `queue-sidebar`, `queue-sidebar-brand`, `queue-sidebar-body`, `queue-list` | no | Left-panel shell for three-panel apps. `<aside aria-label="Queue sidebar">` with brand header, body (sections of `queue-section-header` + `queue-list` of `queue-item`). 240px fixed width, full-height scroll. |
| Three-Panel Shell | `three-panel-shell.html` | `three-panel-shell`, `three-panel-shell-center` | no | Outermost shell: flex row hosting queue-sidebar (left, 240px), main content (center, flex-grow), thread-panel (right, 380px). Landmarks: `<main>` center, `<aside>` sides. Desktop-first; responsive collapses deferred. |
| Thread Panel | `thread-panel.html` | `thread-panel`, `thread-panel-body`, `thread-panel-empty` | no | Right rail of the three-panel app. 380px fixed, border-left, independent scroll, sand-50 bg per three-panel surface hierarchy. Slice 2 ships only the empty-state placeholder; slice 3 adds message types (system, tool_call, tool_result, approval_request, human, approval_response) and the input field. |

---

## Thread / Agent

| Component | File | Classes | Preline | Notes |
|---|---|---|---|---|
| Thread System Message | `thread-msg-system.html` | `thread-msg-system`, `thread-msg-time` | no | Compact system event with timestamp. |
| Thread Tool Call | `thread-msg-tool-call.html` | `thread-msg-tool`, `thread-msg-tool-icon`, `thread-msg-tool-content`, `thread-msg-tool-toggle`, `thread-msg-tool-name`, `thread-msg-tool-result`, `thread-msg-tool-detail` | yes — HSCollapse | Agent action with expandable payload. Toggle is a `<button>` (per Preline collapse pattern); `.thread-msg-tool-toggle` resets defaults.css button chrome. |
| Thread Human Message | `thread-msg-human.html` | `thread-msg-human`, `thread-msg-human-label`, `thread-msg-human-bubble` | no | Right-aligned coordinator message. |
| Thread Approval Response | `thread-msg-response.html` | `thread-msg-response`, `thread-msg-response-toggle`, `thread-msg-response-detail` | yes — HSCollapse | Collapsed decision summary. `.is-approved`, `.is-rejected`. |
| Thread Approval Card | `thread-approval-card.html` | `thread-approval-card`, `thread-approval-header`, `thread-approval-body`, `thread-approval-context`, `thread-approval-context-title`, `thread-approval-context-meta`, `thread-approval-summary`, `thread-approval-effects`, `thread-approval-effects-label`, `thread-approval-attachment`, `thread-approval-attachment-unviewed`, `thread-approval-actions`, `thread-approval-note`, `thread-approval-note-label` | no | THE HERO. Variants: `.is-urgent` (red), `.is-warning` (amber, semantic-warning surface), `.is-historical` (read-only, no actions). Uses `.btn-primary btn-sm` + `.btn-outline btn-sm`. Header h3 uses Lora (display) per DESIGN.md §Typography. Surface is sand-50 with primary-500 left accent (urgent/warning swap surface + accent per family). Attachment supports unviewed warning state via `.thread-approval-attachment-unviewed`. Note textarea uses an `<label>` (sr-only) per WCAG 4.1.2; rendered conditionally tied to parent's reject/approve flow. Root is `<section role="region" aria-labelledby>` with an `<h3>` title for landmark navigation. |
| Thread Question Card | `thread-question-card.html` | `thread-question-card`, `thread-question-card-header`, `thread-question-card-body`, `thread-question-card-prompt`, `thread-question-card-summary`, `thread-question-card-suggestion`, `thread-question-card-actions`, `thread-question-card.is-idle`, `thread-question-card.is-historical` | no | Tier 2 composition primitive for the agentic-question pattern. Parallels thread-approval-card. Composes option-row + ai-insight-callout + badge-pill; carries its own `.thread-question-card-actions` footer slot (paralleling `.thread-approval-actions` — natural-flow flex footer at bottom of card, NOT the patient-app `.sticky-footer`). `.is-idle` (90s collapse), `.is-historical` (read-only) modifiers. Pin priority via `data-pin-priority` (in-flight: 2; historical: 4). Cross-primitive thread-renderer logic enforces order against thread-approval-card. Mobile composes `bottom-sheet-panel`. |
| Option Row | `option-row.html` | `option-row`, `option-row-glyph`, `option-row-content`, `option-row-title`, `option-row-recommended`, `option-row-description`, `option-row.is-other`, `option-row-other-wrapper`, `option-row-other-textarea`, `option-row.is-tablet-dense`, `option-row-list` | no | Tier 1 primitive for the agentic-question pattern. `<button role="radio">` (single-select) or `<button role="checkbox">` (multi-select) + `aria-checked`. Title + description + inline `.badge.badge-info.badge-sm.option-row-recommended` slot. Dual-cued selection (filled glyph with inset white ring — shape cue + accent-interactive border — color cue; Round 1.5 refactor 2026-05-11 removed the redundant right-side check icon). `.is-other` reveals an inline textarea on select via the always-present `.option-row-other-wrapper` (gov.uk "Conditionally revealed questions" pattern); `aria-expanded` + `aria-controls` link button to textarea. `.is-tablet-dense` raises `--option-row-min-height` from 44px to 48px for kitchen gloved-hand context. Roving tabindex is consumer-side state. NOT response-option (assessment-only per steward verdict 2026-05-08). |

---

## Deck Library — separate design system (do not normalize to haven-ui conventions)

> ✓ **TOKEN BASIS = Cena Color System v2 (migrated 2026-05-25).** The vendored `deck/tokens/tokens-color.css` is the v2 canon (`cena-health-brand/_tokens/generated/palette.css` + `tokens-semantic.css`, concatenated with a provenance header): conventional scale (50=lightest), `sand` neutral, 18 Tailwind-hue families, interactive `--color-primary` = teal-700 `#1e5149`. `deck.css` was remapped in lockstep (warm→sand, ochre→amber tint, light-tint scale-flip, climax teal-700). Re-sync from cena-health-brand on brand-SoT change (delta D-10). Brand migration committed local in cena-health-brand (`212f509`, push held for Aaron).

The `deck/` subtree is the **Cena Deck Design System** (the [[Branded Deck Pipeline]]'s output medium), hosted here only because haven-ui's vite auto-globs `pattern-library/**/*.html` and serves it at :5173 with zero build-config change. It is **not** part of the Haven app design system. Treat it as a guest system with deliberate, sanctioned deviations from the rules above:

- **Own tokens.** Deck components ride the **cena-health-brand** token SoT (Cena Color System v2: 18 Tailwind-hue families incl. teal/sage/amber/rose/violet/indigo + `sand` neutral), vendored into `deck/tokens/*.css` with provenance headers — NOT haven-ui's `src/styles/tokens/`. Both cena-health-brand and haven-ui now map `--color-primary`→teal-700 `#1e5149` under v2 (the divergence noted previously was the v1-vs-v2 gap, resolved by the 2026-05-25 migration). Vendored (not live-linked) because the deck renders inside haven-ui's vite root; reconciliation to a workspace-package import is polish-pass (D-10).
- **Own CSS, no `@apply`.** Styling lives in `deck/deck.css` as plain `var()`-based classes (mirroring cena-health-brand's own slide CSS), linked directly — NOT routed through haven-ui's Tailwind entry or `components.css`. **Do not migrate `deck.css` into `components.css`** — it would pull in haven-ui's narrower palette and break the deck system.
- **No React port.** Deck slides are a presentation medium, not Haven app primitives. They are not ported to `ui-react/`, not tracked in `registry.json`, and not subject to the 4-expert PL panel (the deck design system has its own review via the Deck Production expert).
- **Charts: consume the haven-ui chart SoT, do NOT recreate (Aaron 2026-05-25).** When a slide needs a chart, use haven-ui's existing Chart.js patterns (`charts-utilities.html`, `chart-containers.html`, `HAVEN.*` color constants) rather than authoring bespoke deck charts. This supersedes the bespoke chart specs in Deck Design System Part B B.3.7 (Donut/Bar/Proportion) — single source of truth, no silent drift. **No donut/pie** (haven-ui Tufte rule applies; the Part B donut is dropped).
- **Diagrams: consume the brand SVG diagram system, do NOT recreate.** Slide flowcharts/diagrams use the existing brand-consistent SVG diagram primitives (`diagrams.html`, `diagram-*-iter.html`, the `--color-diagram-*` tokens) already used on the Andrey/Vanessa HTML deliverables + the SoT-slice pipeline. Reference, don't fork.
- **Token cross-system caveat:** haven-ui's chart/diagram SoT is authored on haven-ui tokens, which diverge from cena-health-brand (inverted scale, different `--color-primary` step). Clean reuse in a deck slide may need a token-bridge until the haven-ui ↔ cena-health-brand reconciliation lands (tracked; brand-expert + Aaron call). Noted so reuse doesn't silently import the wrong primary hue.

Spec (canonical): `Knowledge/Projects/Cena Health/Deck Assets/Deck Design System.md` Part B (team-defined). Identity: Atlas → [[Branded Deck Pipeline]]. Built archetypes (cqw-scaled 16:9 slides):

| Archetype | Fragment | Page | Notes |
|---|---|---|---|
| C1 · Cover | `deck/components/slide-c1-cover.html` | `deck/archetypes/c1-cover.html` | Lora title + italic brand accent + concentric flower hero. Chrome-less (structural). |
| C2 · Section divider | `deck/components/slide-c2-divider.html` | `deck/archetypes/c2-section-divider.html` | Quiet Lora title + large solid dark-teal circle. No footer. |
| C4 · Tinted-card row | `deck/components/slide-c4-tinted-card-row.html` | `deck/archetypes/c4-tinted-card-row.html` | Multi-hue tinted cards (amber/rose/violet light tints) + × separators + emphasis bar. Serif card titles (editorial). |
| C5 · Capability sequence | `deck/components/slide-c5-capability-sequence.html` | `deck/archetypes/c5-capability-sequence.html` | Stepped cards + arrows → single solid climax card (teal-700 + sand-50, ≈8.96:1 AA+AAA). |
| C8 · Stat triple | `deck/components/slide-c8-stat-triple.html` | `deck/archetypes/c8-stat-triple.html` | Oversized Lora numerals + one climax stat + mandatory citation line. |

Gallery (all archetypes stacked): `deck/index.html` → http://localhost:5173/pattern-library/deck/. Remaining core/situational archetypes (C3, C6, C7, C9, C10, S1–S6) and the B.3.7 components are pending.

---

## Adding New Components

When you add a new component:

1. Create `pattern-library/components/[category]-[name].html` with `@component-meta` header
2. Define the semantic classes in `src/styles/tokens/components.css`
3. Add a row to this index in the correct category
4. Then use the component in the app page

**The pattern library file is the source of truth. App pages copy from it.**

---

_Last updated: 2026-05-11_

