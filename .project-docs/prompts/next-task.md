# Task: Fix shared header + add missing app index stubs
_Generated: 2026-03-10_
_App: cross-app_

---

## Scope Classification

- [x] Cross-app infrastructure — no new components; three HTML files edited/created

---

## Pre-Build Audit

Before writing anything:

1. Read `src/partials/header.html` in full — this is the file being replaced
2. Read `apps/provider/index.html` to confirm the `<load src="src/partials/header.html" />` usage pattern
3. Read `src/partials/scripts.html` to confirm the scripts partial path
4. Confirm `apps/patient/` and `apps/care-coordinator/` directories exist but are empty

No new semantic classes are needed. No `components.css` changes. No pattern library changes.

---

## Prompt 1: Replace `src/partials/header.html`

The current `src/partials/header.html` is a leftover theme demo header. It has a nav bar
with section jump links (`#buttons`, `#forms`, etc.) that have no targets in the apps.
Replace it entirely with a minimal Haven branding header.

Write this exact content to `src/partials/header.html`:

```html
<header>
  <nav class="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-200 dark:bg-neutral-800/95 dark:border-neutral-700">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <a href="/" class="text-xl font-bold text-primary-600 dark:text-primary-400 no-underline">Haven</a>
        <div class="flex items-center gap-4">
          <a href="/apps/" class="text-sm font-medium text-gray-600 hover:text-primary-600 dark:text-neutral-400 dark:hover:text-primary-400 no-underline">Apps</a>
          <a href="/pattern-library/" class="text-sm font-medium text-gray-600 hover:text-primary-600 dark:text-neutral-400 dark:hover:text-primary-400 no-underline">Pattern Library</a>
        </div>
      </div>
    </div>
  </nav>
</header>
```

Confirm by reading back the file after writing.

### Known Constraints
- No utility chains in HTML for component styling. These are layout/nav-specific one-off utilities on a shared partial, which is acceptable per CLAUDE.md.
- No `<script>` blocks in HTML files.

---

## Prompt 2: Create `apps/patient/index.html`

The `apps/patient/` directory exists but is empty. Create `apps/patient/index.html`
as a minimal coming-soon stub that matches the structure of the other app index pages.

Write this exact content to `apps/patient/index.html`:

```html
<!doctype html>
<html lang="en">
<load src="src/partials/head.html" />
<body>
  <load src="src/partials/header.html" />
  <main class="container py-8">
    <h1>Patient App</h1>
    <p class="mt-2">Patient-facing mobile experience.</p>
    <p class="mt-4 text-gray-500">Coming soon.</p>
    <div class="mt-6">
      <a href="/apps/" class="btn-outline">Back to Apps</a>
    </div>
  </main>
  <load src="src/partials/scripts.html" />
</body>
</html>
```

Confirm by reading back the file after writing.

---

## Prompt 3: Create `apps/care-coordinator/index.html`

The `apps/care-coordinator/` directory exists but is empty. Create
`apps/care-coordinator/index.html` as a minimal coming-soon stub.

Write this exact content to `apps/care-coordinator/index.html`:

```html
<!doctype html>
<html lang="en">
<load src="src/partials/head.html" />
<body>
  <load src="src/partials/header.html" />
  <main class="container py-8">
    <h1>Care Coordinator</h1>
    <p class="mt-2">Care team coordination interface.</p>
    <p class="mt-4 text-gray-500">Coming soon.</p>
    <div class="mt-6">
      <a href="/apps/" class="btn-outline">Back to Apps</a>
    </div>
  </main>
  <load src="src/partials/scripts.html" />
</body>
</html>
```

Confirm by reading back the file after writing.

---

## Verification

- [ ] Verified at `http://localhost:5173/` — header shows "Haven" with Apps + Pattern Library links
- [ ] Verified at `http://localhost:5173/apps/provider/` — same clean header, no section jump links
- [ ] Verified at `http://localhost:5173/apps/patient/` — renders coming soon stub
- [ ] Verified at `http://localhost:5173/apps/care-coordinator/` — renders coming soon stub
- [ ] Verified at `http://localhost:5173/pattern-library/` — still works (uses its own pl-nav, unaffected)
- [ ] No utility chains added for component styling
- [ ] No `style="..."` attributes
- [ ] No `<script>` blocks in HTML files
- [ ] No `components.css` changes
- [ ] No pattern library files changed

---

## Completion Report

After verification passes, output:

```
## Completion Report — Fix shared header + add missing app index stubs

- New semantic classes added to components.css: none
- Existing classes modified: none
- Pattern library files created or updated: none
- Files modified: src/partials/header.html
- Files created: apps/patient/index.html, apps/care-coordinator/index.html
- Judgment calls: none
- Dark mode: existing dark: variants used inline on nav partial (layout partial, acceptable)
- ANDREY-README.md updated: not applicable
- Schema delta logged: not applicable
- Items deferred or incomplete: none
```

---

## Final Step

```bash
git add -A
git commit -m "Replace theme demo header with minimal Haven nav; add patient + care-coordinator stubs"
```

Then output:

---
**View your result:**
- If `npm run dev` is already running: http://localhost:5173/
- If not running: open a terminal in the repo root, run `npm run dev`, then visit http://localhost:5173/
---
