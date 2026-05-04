# Task 03: Confirm Panel-Splitter JS Initializes Post-Mount

## Scope
App only

## Task class
deterministic

## Model tier
haiku

## Context
The `panel-splitter` drag-resize behavior is driven by `panel-splitter.js` from the design-system scripts. In the pattern library, this file is loaded as a plain `<script>` tag. In the React app, it must be imported and initialized after the DOM mounts — otherwise `data-panel-splitter` elements won't be interactive.

This task verifies the splitter is initialized correctly in `apps/care-coordinator/src/main.tsx` (or wherever Preline's `autoInit` runs). If the import is missing, add it. Also confirms the keyboard step is 16px per the locked decision.

## Prerequisites
- Task 01 must be complete

## Files to Read First
- `apps/care-coordinator/src/main.tsx` — current entry point; check for Preline import + any panel-splitter import
- `packages/design-system/src/scripts/components/panel-splitter.js` — script content; check if it reads `data-panel-splitter` and has a step config
- `apps/patient/src/main.tsx` — reference: how does the patient app init its scripts? Same pattern expected.

## Instructions

### Step 1 — Read main.tsx

Open `apps/care-coordinator/src/main.tsx`. Look for:
1. `import 'preline'` — Preline autoInit (required; initializes HSCollapse, HSDropdown etc.)
2. Any import of `panel-splitter.js` or a custom init call for panel splitters

### Step 2 — Read panel-splitter.js

Open `packages/design-system/src/scripts/components/panel-splitter.js`. Look for:
1. The init mechanism — does it use `document.querySelectorAll('[data-panel-splitter]')` on DOMContentLoaded or does it export an init function?
2. A step/increment config — look for a variable named `step`, `increment`, `STEP`, or similar. The wireframe lock is 16px.

### Step 3 — Wire the import if missing

If `main.tsx` does not already import panel-splitter:

**Option A — If `panel-splitter.js` exports an init function:**
```tsx
import { initPanelSplitters } from '@haven/design-system/scripts/components/panel-splitter.js';
// Call after React mounts — use a useEffect in App.tsx if needed, or call after createRoot render
```

**Option B — If `panel-splitter.js` self-executes on DOMContentLoaded:**
```tsx
import '@haven/design-system/scripts/components/panel-splitter.js';
// Side-effect import — runs when the module is loaded
```

Add the import to `apps/care-coordinator/src/main.tsx`, after the `import 'preline'` line.

If the package path `@haven/design-system/scripts/...` is not resolvable, use a relative path from `main.tsx`:
```tsx
import '../../packages/design-system/src/scripts/components/panel-splitter.js';
```
Check `apps/care-coordinator/tsconfig.json` and `vite.config.ts` for path aliases first.

### Step 4 — Set keyboard step to 16px

In `panel-splitter.js`, find the step/increment constant. If it is not already 16 (or if it is configurable via `data-*` attribute), set it to 16.

If the step is hardcoded and is already 16: no change needed.
If the step is configurable via a `data-step` attribute on the splitter div: add `data-step="16"` to both `panel-splitter` divs in `App.tsx`.
If the step is a hardcoded constant in the JS and is not 16: change it to `const STEP = 16;` (or equivalent).

**Note:** Do NOT create a new file. Patch the existing JS or add the attribute to existing elements only.

### Known Constraints
- Do NOT add a CDN script tag for Preline — it is loaded via the ES module import already.
- Do NOT write `<script>` blocks in HTML files — all JS goes via imports.
- Do NOT modify `packages/design-system/src/scripts/panel-splitter.js` if it affects the pattern library page behavior (the change must be safe for both contexts).
- Splitter keyboard increment must be 16px per locked decision (Gate 2-prep #1).

## Expected Result
After this task:
- `apps/care-coordinator/src/main.tsx` imports `panel-splitter.js` (if not already)
- Panel splitter handles respond to drag and keyboard arrow keys with 16px steps
- No build errors

## Verification
- [ ] `main.tsx` has `import 'preline'`
- [ ] `main.tsx` has a panel-splitter import or init call (or panel-splitter already self-inits via Preline autoInit — note which)
- [ ] `panel-splitter.js` step/increment is 16px
- [ ] `pnpm --filter @haven/app-care-coordinator dev` starts without errors
- [ ] In the browser: drag the left splitter handle — pane resizes
- [ ] In the browser: focus the left splitter handle, press ArrowRight — pane grows by 16px
- [ ] HTML classes are semantic — no utility chains added
- [ ] No `style={{...}}` added
- [ ] Dark mode variants — N/A (no CSS changes)
- [ ] `_schema-notes.md` — not applicable

## Completion Report

```
## Completion Report — Task 03: Confirm Panel-Splitter JS Initializes Post-Mount

- New semantic classes added to components.css: none
- Existing classes modified: none
- Pattern library files created or updated: none
- Judgment calls: none
- Dark mode added: not applicable
- Schema delta logged: not applicable
- Items deferred or incomplete: [list any, or "none"]
- Panel-splitter init mechanism found: [describe — self-exec / exported function / already via Preline]
- Step value before/after: [e.g., "was 8, changed to 16" or "was already 16"]
```

## If Something Goes Wrong
- If `panel-splitter.js` cannot be imported as an ES module (uses `var` globals, no export): use a `<script>` tag in `apps/care-coordinator/index.html` pointing to the built asset, or refactor the init into a callable function.
- If Preline's `HSStaticMethods.autoInit()` already handles `data-panel-splitter`: confirm by reading `panel-splitter.js` header comment. If it's Preline-driven, no explicit import is needed.
- If the step config is not found: read the entire `panel-splitter.js` file; the step will be there.
