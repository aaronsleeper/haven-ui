# Task 10: Build Verification

## Scope
App only (read-only; runs build commands)

## Task class
deterministic

## Model tier
haiku

## Context
Final verification pass after all 9 implementation tasks complete. Runs typecheck, build, and a checklist of visual + functional checks on the running app. This task does not modify any files — it reads, runs, and reports.

## Prerequisites
- Tasks 01–09 all complete

## Files to Read First
- `apps/patient/src/App.tsx` — confirm all routes present before running build
- `.project-docs/verification-checklist.md` — standard post-build verification checklist

## Instructions

### Step 1: Run typecheck

```bash
cd /path/to/haven-ui && pnpm --filter @haven/app-patient typecheck
```

If typecheck fails: STOP. Report the exact TypeScript error. Do not proceed to build. Identify which file introduced the error and what the type mismatch is.

### Step 2: Run build

```bash
pnpm --filter @haven/app-patient build
```

If build fails: STOP. Report the exact build error. Do not proceed to visual checks.

### Step 3: Start dev server

```bash
pnpm --filter @haven/app-patient dev
```

The patient app dev server should start at http://localhost:5176.

### Step 4: Verify checklist

After the dev server is running, report the status of each item:

**Shell:**
- [ ] App loads at http://localhost:5176
- [ ] `mobile-i18n-bar` visible at top (Cena logo + EN/ES buttons)
- [ ] `mobile-bottom-nav` visible at bottom (5 tabs: Dashboard / My Health / Messages / Care / Settings)
- [ ] Active tab highlights correctly when navigating
- [ ] Messages tab shows badge (unread count = 1)
- [ ] Tapping EN/ES toggles all visible strings on the current route
- [ ] Language toggle persists after page refresh (localStorage)

**Routes:**
- [ ] `/` renders Dashboard: greeting + task card + message preview + delivery status card
- [ ] `/messages` renders Messages: 3 demo message items + reply composer collapsed
- [ ] `/settings` renders Settings: 3 section cards (Language / Notifications / Account)
- [ ] `/health` renders My Health: 3 trend cards
- [ ] `/care` renders Care: 3 section cards (plan / appointments / deliveries)
- [ ] `/assessment/gad-7` still routes correctly (existing flow not broken)
- [ ] `/assessment/phq-9` still routes correctly (existing flow not broken)
- [ ] Bottom nav hidden on `/assessment/*` routes

**Mobile:**
- [ ] At 430px viewport width: all routes render without horizontal overflow
- [ ] At 320px viewport width: bottom nav tabs fit without label truncation ("Mensajes" is 8 chars — validate)

**i18n:**
- [ ] All route headers render in Spanish when ES is active
- [ ] Settings language card switches app language

**Accessibility:**
- [ ] `<main>` landmark present on every route
- [ ] `<h1>` present on every route
- [ ] `document.documentElement.lang` updates when language toggles (inspect in DevTools)

**iOS safe-area:**
- [ ] `pb-safe-8` present on all route `<main>` containers (inspect in DevTools)
- [ ] `pb-safe-4` present on Messages reply bar

**HIPAA:**
- [ ] No "thread" / "agent" / "tool_call" text in Messages route DOM
- [ ] `ALLOWED_TYPES` comment present in Messages component (client backstop documented)

### Step 5: Run conform gates

```bash
pnpm --filter @haven/ui-react conform:fast
```

Report pass/fail for blocking-on-patch gates: `typecheck`, `conform:manifest`, `conform:app-shell`, `conform:plain-language`, `conform:css-family`, `conform:brand-fonts`.

## Expected Result
- All verification items pass
- No TypeScript errors
- Build succeeds
- All 5 routes render without errors at http://localhost:5176
- Assessment flows remain functional

## Verification
- [ ] `pnpm --filter @haven/app-patient typecheck` exits 0
- [ ] `pnpm --filter @haven/app-patient build` exits 0
- [ ] Dev server starts at port 5176
- [ ] All checklist items above pass
- [ ] `conform:fast` gate set passes

## Completion Report

After all verification passes, output this report:

```
## Completion Report — Task 10: Build Verification

- Build status: [pass / fail — list errors if fail]
- Typecheck status: [pass / fail — list errors if fail]
- Routes verified: [list]
- conform:fast gate: [pass / fail — list failing gates if fail]
- Judgment calls: none (verification only)
- Dark mode added: not applicable
- Schema delta logged: not applicable
- Items deferred or incomplete: [list any checklist items that did not pass, with reason]
- Ready for Stage 5 (ux-design-review post-build): [yes / no — why if no]
```

## If Something Goes Wrong
- **Typecheck errors on `@haven/ui-react` imports:** confirm `@haven/ui-react` is in `apps/patient/package.json` and workspace is correctly linked (`pnpm install` at repo root if needed)
- **`conform:app-shell` failure:** gate checks that `<MobileShell>` is the registered app-shell tag at the JSX root; confirm `App.tsx` still wraps routes in `<MobileShell>`
- **`conform:brand-fonts` failure:** gate checks that `apps/patient/index.html` links Lora + Source Sans 3 + Source Code Pro; if these were accidentally removed, re-add from `packages/design-system/src/partials/head.html`
- **320px tab label truncation:** if "Mensajes" truncates at 320px, report the exact pixel measurement; this is a known risk flagged in Stage 2 review; resolution is to allow `overflow: visible` on the label or reduce font-size to `text-[11px]` — escalate to Aaron rather than fixing autonomously
