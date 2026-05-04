# Component Map: Universal Agentic Shell

**Date:** 2026-05-04
**Source wireframes:** `apps/_shared/design/wireframes/shell-universal-agentic.md`
**components.css read:** 2026-05-04 (fresh — confirmed at lines 7962–8112 for thread-approval-card; full file scanned)
**COMPONENT-INDEX.md read:** 2026-05-04 (fresh)

---

## Component Inventory Summary

**Existing components used:** 22
**New components required:** 0 (universally; per-app new components are flagged in their respective maps)
**Utility-only patterns:** 4

---

## New Components Required

None at the universal-shell level. All structure, pane, and thread primitives ship in PL. Per-app variants flag new components in their own component-maps.

---

## Screen: Universal Agentic Shell (Persistent, all desktop apps)

**Wireframe source:** `wireframes/shell-universal-agentic.md`

### Recipe

1. **Outermost body:** `body` — sand-50 page background; ambient gradient blobs via `body::before` / `body::after` (in components.css, suppressed for kitchen with `mobile-app` body class pattern)
2. **Shell root:** `agentic-shell` — flex row at `height: 100vh` (`layout-agentic-shell.html`); 3-pane flex container
3. **Left pane:** `panel-nav` — per-app queue sidebar content (see per-app maps); 260px default, 220–320 range
   - **Splitter handle (left):** `panel-splitter` (`data-panel-splitter`, `data-target`, `data-min="220"`, `data-max="320"`) — `panel-splitter.js`
   - **Pane surface:** `--color-surface-pane` (rgba(255,255,255,0.6)) over chrome ground sand-100
4. **Center pane:** `panel-chat` — flex-fill, 480px floor / 560 comfortable
   - **Pane surface:** `--color-surface-page` (sand-50)
   - **When record loaded:** `record-header` → `record-header-main` → `record-header-title` (Lora Heading/01) + `record-header-subtitle` (Body/03 muted) + `record-header-trailing` (status badges) + `record-header-meta`
   - **When chat/agent active:** `chat-thread` → `chat-thread-inner` → `message-agent` / `message-user` + `tool-call` + `message-avatar` + Ava avatar `<img>` at 44px
5. **Splitter handle (right):** `panel-splitter` (480–800 range for right pane)
6. **Right pane:** `panel-content` — thread rail, 640px default, 480–800 range
   - **Component:** `thread-panel` → `thread-panel-body` / `thread-panel-empty`
   - **Pane surface:** `--color-surface-page` (sand-50); `border-left` separator
   - **Thread events (top to bottom):** `thread-msg-system`, `thread-msg-tool-call` (collapsed default — `data-hs-collapse`), `thread-msg-human`, `thread-msg-response` (`.is-approved` / `.is-rejected`)
   - **Active approval card (hero, when present):** `thread-approval-card` with `.is-urgent` / `.is-warning` / `.is-historical` variant — auto-scrolls on first record-open
   - **Thread input (coordinator/provider only):** `prompt-input-container` → `prompt-textarea` + `prompt-toolbar` with `btn-icon` send + `btn-icon` mic
7. **State — empty (no left-pane items):** `data-empty-state` in left pane; `thread-panel-empty` in right pane
8. **State — loading:** `skeleton` + `skeleton-text` + `skeleton-text-sm` rows in all three panes (parallel load)
9. **State — error (per-pane):** `alert-error` at top of affected pane + `btn-outline btn-sm` "Try again"
10. **State — nav-collapsed:** `panel-nav.collapsed` reduces to 80px icon-rail; nav items show icon-only
11. **Toast (approval decisions):** `toast` + `toast-info` — document-level portal (not inside `<aside>`); `aria-live="assertive"`

### Utility-Only Patterns

- `height: 100vh` on `agentic-shell` root — inline layout, not a semantic class
- `aria-label` overrides on `<aside>` landmarks per app (coordinator / provider / kitchen — different label text, same class)
- `is-resizing` body class on drag-active state — transient JS class, not a semantic class
- `col-resize` cursor during drag — inline via JS

### Data Bindings

- Ava avatar: `sphere-ava.png` asset rendered as `<img alt="Ava (your care assistant)">` in chat-pane header (apps with Ava)
- Cena logo: `logo-cenahealth-teal.svg` as `<img>` in `nav-logo` — constant, never per-persona
- Thread allowlist: `data-allowlist="[...]"` on `thread-panel` — per-app configuration (coordinator-full / patient-strict / kitchen-order / provider-clinical)
- Approval card variant: dynamic class binding (`.is-urgent` / `.is-warning` / `.is-historical`) based on approval priority from API response
- Per-user pane widths: `user_pane_prefs.left_width_px` + `user_pane_prefs.right_width_px` + `user_pane_prefs.nav_collapsed` — loaded from user profile on mount; clamped to viewport's allowed range before applying

### Preline Interactions

- `panel-splitter.js` — drag-resize for both boundaries; `data-panel-splitter` attribute init
- `data-hs-collapse` on `thread-msg-tool` — tool call expand/collapse (HSCollapse); default collapsed per Stage 2-review decision
- `hs-dropdown` on user-menu (sign-out, settings) — per `overlay-dropdown.html` pattern from CLAUDE.md
- `data-hs-overlay` (optional) — bottom-sheet inspector variant for right pane at 720–959px responsive
