# Domain Knowledge

## WCAG 2.1 AA requirements (admin app relevant)

| Criterion | ID | Requirement | Admin app impact |
|---|---|---|---|
| Contrast (minimum) | 1.4.3 | Text: 4.5:1, large text: 3:1 | Status badges, table text, form labels |
| Contrast (non-text) | 1.4.11 | UI components and graphics: 3:1 against adjacent | Buttons, inputs, icons, focus indicators |
| Target size | 2.5.5 | Touch targets minimum 44×44 CSS px | Action buttons, table row actions, card controls |
| Keyboard | 2.1.1 | All functionality available from keyboard | Queue list navigation, approval actions, table sorting |
| No keyboard trap | 2.1.2 | Keyboard focus can always be moved away | Dialogs, popovers, dropdown menus |
| Focus visible | 2.4.7 | Keyboard focus indicator is visible | Every interactive element — currently zero |
| Focus order | 2.4.3 | Focus moves in meaningful sequence | Sidebar → content → chat panel |
| Meaningful sequence | 1.3.2 | Reading order matches visual order | Three-panel layout, card content hierarchy |
| Name, role, value | 4.1.2 | All UI components expose name, role, state to AT | Clickable rows, status badges, action menus |
| Status messages | 4.1.3 | Status changes announced without focus move | Toast notifications, approval state changes |

## ARIA patterns for admin app components

| Component | ARIA pattern | Key roles/properties | Keyboard |
|---|---|---|---|
| Queue list | `listbox` or `feed` | `role="listbox"`, `aria-activedescendant`, `aria-label` | ↑↓ to navigate, Enter to select |
| Approval cards | `dialog` / `alertdialog` | `role="dialog"`, `aria-modal`, `aria-labelledby` | Tab through actions, Esc to close |
| Status badges | `status` | `role="status"`, `aria-live="polite"` | N/A (informational) |
| Data tables | `table` with sortable headers | `role="grid"` or semantic `<table>`, `aria-sort` | ↑↓ rows, ←→ cells, Enter to activate |
| Navigation | `nav` landmark | `role="navigation"`, `aria-current="page"` | Tab between items, Enter to activate |
| Action menus | `menu` | `role="menu"`, `role="menuitem"` | ↑↓ to navigate, Enter to select, Esc to close |

## React Aria component mapping

React Aria provides built-in keyboard interaction + ARIA roles. Map to admin app:

| React Aria primitive | Admin app usage | What it replaces |
|---|---|---|
| `Button` | All action buttons, approve/deny, card actions | Plain `<button>` or `<div onClick>` |
| `Link` | Navigation items, breadcrumbs | Plain `<a>` without keyboard handling |
| `Table` + `Column` | Queue tables, data grids, sortable lists | Custom `<table>` without ARIA |
| `Dialog` + `Modal` | Approval dialogs, detail panels, confirmations | Custom modal divs |
| `Menu` + `MenuItem` | Action dropdowns, context menus | Custom dropdown implementations |
| `Tabs` | Panel switching, view modes | Custom tab implementations |
| `Checkbox` | Bulk selection, filter toggles | Plain `<input type="checkbox">` |
| `Select` | Dropdowns, filter selectors | Custom select implementations |
| `TextField` | Search, forms, notes input | Plain `<input>` without labeling |
| `TagGroup` | Filter chips, status labels | Custom chip components |

## Healthcare accessibility considerations

- **Variable lighting:** Clinical environments range from bright fluorescent to dimmed rooms — 4.5:1 contrast is a functional minimum, not an aesthetic choice
- **Shared workstations:** Staff rotate through stations; screen reader users need consistent landmark structure to orient quickly on arrival
- **Motor impairment:** Repetitive strain from clinical work means some users rely on keyboard-only or switch devices — every click target must be keyboard-reachable
- **Cognitive load:** Clinical staff under time pressure need predictable interaction patterns — consistent focus order and clear status announcements reduce errors
- **Screen magnification:** Users at 200-400% zoom need content that reflows without horizontal scrolling (WCAG 1.4.10)

## Reference sources

| Source | Domain | Trust level | Consult when |
|---|---|---|---|
| [W3C WAI APG](https://www.w3.org/WAI/ARIA/apg/) | ARIA design patterns | Authoritative | Choosing ARIA pattern for a component |
| [React Aria docs](https://react-spectrum.adobe.com/react-aria/) | React Aria API and patterns | Expert | Implementing accessible components |
| [Section 508 standards](https://www.section508.gov/) | Federal accessibility law | Authoritative | Federally funded program compliance |
| [WCAG 2.1 spec](https://www.w3.org/TR/WCAG21/) | Full success criteria | Authoritative | Resolving ambiguous compliance questions |
| [Deque axe rules](https://dequeuniversity.com/rules/axe/) | Automated testing rules | Expert | Configuring automated accessibility checks |
