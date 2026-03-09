# Task: Migrate existing pages from haven repo into haven-ui
_Generated: 2026-03-09_
_Context: All app pages and pattern library pages were built in the old haven repo at
/Users/aaronsleeper/Desktop/Vaults/Lab/haven/theme/. haven-ui has the correct structure
and build pipeline but no pages yet. This task copies all existing pages into haven-ui
and updates them to use haven-ui's partial and asset conventions._

---

## Prompt 1: Audit source files

Before copying anything, list the following directories and report their contents:

Source (old repo):
- `/Users/aaronsleeper/Desktop/Vaults/Lab/haven/theme/pages/kitchen/`
- `/Users/aaronsleeper/Desktop/Vaults/Lab/haven/theme/pages/providers/`
- `/Users/aaronsleeper/Desktop/Vaults/Lab/haven/theme/pages/providers/patients/`
- `/Users/aaronsleeper/Desktop/Vaults/Lab/haven/theme/pattern-library/pages/`
- `/Users/aaronsleeper/Desktop/Vaults/Lab/haven/theme/pattern-library/partials/`
- `/Users/aaronsleeper/Desktop/Vaults/Lab/haven/theme/pattern-library/components/`
- `/Users/aaronsleeper/Desktop/Vaults/Lab/haven/theme/partials/`

Destination (haven-ui):
- `/Users/aaronsleeper/Desktop/Vaults/Lab/haven-ui/apps/kitchen/`
- `/Users/aaronsleeper/Desktop/Vaults/Lab/haven-ui/apps/provider/`
- `/Users/aaronsleeper/Desktop/Vaults/Lab/haven-ui/pattern-library/`
- `/Users/aaronsleeper/Desktop/Vaults/Lab/haven-ui/src/partials/`

Report the full file list for each. Do not copy anything yet.

---

## Prompt 2: Copy app pages

Run these copy commands from the terminal:

```bash
# Kitchen pages
cp /Users/aaronsleeper/Desktop/Vaults/Lab/haven/theme/pages/kitchen/*.html \
   /Users/aaronsleeper/Desktop/Vaults/Lab/haven-ui/apps/kitchen/

# Provider pages (flat files)
cp /Users/aaronsleeper/Desktop/Vaults/Lab/haven/theme/pages/providers/*.html \
   /Users/aaronsleeper/Desktop/Vaults/Lab/haven-ui/apps/provider/

# Provider patients subfolder
mkdir -p /Users/aaronsleeper/Desktop/Vaults/Lab/haven-ui/apps/provider/patients/
cp /Users/aaronsleeper/Desktop/Vaults/Lab/haven/theme/pages/providers/patients/*.html \
   /Users/aaronsleeper/Desktop/Vaults/Lab/haven-ui/apps/provider/patients/
```

Confirm each copy succeeded by listing the destination directories.

---

## Prompt 3: Copy pattern library

Run these copy commands:

```bash
# Pattern library pages
cp /Users/aaronsleeper/Desktop/Vaults/Lab/haven/theme/pattern-library/pages/*.html \
   /Users/aaronsleeper/Desktop/Vaults/Lab/haven-ui/pattern-library/pages/

# Pattern library partials
mkdir -p /Users/aaronsleeper/Desktop/Vaults/Lab/haven-ui/pattern-library/partials/
cp /Users/aaronsleeper/Desktop/Vaults/Lab/haven/theme/pattern-library/partials/*.html \
   /Users/aaronsleeper/Desktop/Vaults/Lab/haven-ui/pattern-library/partials/

# Pattern library components
mkdir -p /Users/aaronsleeper/Desktop/Vaults/Lab/haven-ui/pattern-library/components/
cp /Users/aaronsleeper/Desktop/Vaults/Lab/haven/theme/pattern-library/components/*.html \
   /Users/aaronsleeper/Desktop/Vaults/Lab/haven-ui/pattern-library/components/
```

Confirm each copy succeeded by listing the destination directories.

---

## Prompt 4: Copy remaining partials

The haven-ui `src/partials/` already has `head.html`, `scripts.html`, and `scripts-charts.html`
written for the new repo. Do NOT overwrite those three files.

Copy everything else from the old partials directory:

```bash
# List what's in the source so we can copy selectively
ls /Users/aaronsleeper/Desktop/Vaults/Lab/haven/theme/partials/
```

Then copy each file that is NOT `head.html` or `scripts.html`:

```bash
# Copy sidebar and other partials (not head.html, not scripts.html)
cp /Users/aaronsleeper/Desktop/Vaults/Lab/haven/theme/partials/kitchen-sidebar.html \
   /Users/aaronsleeper/Desktop/Vaults/Lab/haven-ui/src/partials/
cp /Users/aaronsleeper/Desktop/Vaults/Lab/haven/theme/partials/providers-sidebar.html \
   /Users/aaronsleeper/Desktop/Vaults/Lab/haven-ui/src/partials/
cp /Users/aaronsleeper/Desktop/Vaults/Lab/haven/theme/partials/kitchen-meal-assignment-grid.html \
   /Users/aaronsleeper/Desktop/Vaults/Lab/haven-ui/src/partials/
cp /Users/aaronsleeper/Desktop/Vaults/Lab/haven/theme/partials/prompt-input.html \
   /Users/aaronsleeper/Desktop/Vaults/Lab/haven-ui/src/partials/
cp /Users/aaronsleeper/Desktop/Vaults/Lab/haven/theme/partials/footer.html \
   /Users/aaronsleeper/Desktop/Vaults/Lab/haven-ui/src/partials/
cp /Users/aaronsleeper/Desktop/Vaults/Lab/haven/theme/partials/header.html \
   /Users/aaronsleeper/Desktop/Vaults/Lab/haven-ui/src/partials/
```

Copy the section-*.html partials (used by the pattern library):
```bash
cp /Users/aaronsleeper/Desktop/Vaults/Lab/haven/theme/partials/section-*.html \
   /Users/aaronsleeper/Desktop/Vaults/Lab/haven-ui/src/partials/
```

Confirm by listing `/Users/aaronsleeper/Desktop/Vaults/Lab/haven-ui/src/partials/`.

---

## Prompt 5: Update asset references in app pages

The old pages reference assets with relative paths (`../../styles/main.css`,
`../../partials/`) and use FontAwesome Free CDN. haven-ui uses absolute paths
and FA Pro local.

For every `.html` file in `apps/kitchen/`, `apps/provider/`, and `apps/provider/patients/`:

**Replace these patterns (use sed or equivalent):**

```bash
# Working directory for these commands:
cd /Users/aaronsleeper/Desktop/Vaults/Lab/haven-ui

# 1. Remove old stylesheet link (main.css or haven-theme)
# 2. Remove FA Free CDN link
# 3. Remove old script tags for preline/main.js
# These are all replaced by the <load> partial approach below.
```

For each app page file, open it and make these changes manually or via script:

**Remove** any line containing:
- `../../styles/main.css`
- `../../styles/haven-theme`
- `font-awesome/6` (FA Free CDN)
- `src/main.js`
- `preline.min.js` (standalone script tag — the partial handles this)

**Replace** the entire `<head>` content (everything between `<head>` and `</head>`) with:
```html
  <load src="/src/partials/head.html" />
```

**Note:** Set the page `<title>` by adding it after the load tag:
```html
  <load src="/src/partials/head.html" />
  <title>Page Title — Haven UI</title>
```

**Replace** any `<load src="../../partials/` with `<load src="/src/partials/`

**Replace** any `<load src="../partials/` (from providers subfolder) with `<load src="/src/partials/`

**Before closing `</body>`**, ensure this line exists (add if missing):
```html
  <load src="/src/partials/scripts.html" />
```

Report every file changed and what was changed.

---

## Prompt 6: Update asset references in pattern library pages

For every `.html` file in `pattern-library/pages/`:

**Replace** any `<load src="../partials/pl-head.html" />` -- check if `pl-head.html`
exists in `pattern-library/partials/`. If it does, leave pattern library internal
`<load>` references as-is (they use their own partial structure). Only update
references that point outside the pattern-library directory.

If pattern library pages reference `../../styles/` or the FA Free CDN directly
(i.e. they are NOT using `<load>` tags), apply the same head replacement as
Prompt 5.

Report what you find and what was changed.

---

## Prompt 7: Spot-check finance.html

Open `apps/kitchen/finance.html` and report:

1. What is in the `<head>` block? (Are the old stylesheet/CDN references gone?)
2. Does it have `<load src="/src/partials/head.html" />`?
3. Does it have `<load src="/src/partials/scripts.html" />` before `</body>`?
4. Are there any remaining `../../` path references?
5. Are there any `<style>` blocks in the file? (Note: these exist in the old version
   and will need to be migrated to `components.css` in a future task -- do NOT
   remove them now, just report them.)

---

## Prompt 8: Start dev server and verify

Run `npm run dev` from `/Users/aaronsleeper/Desktop/Vaults/Lab/haven-ui/`.

If it starts successfully, report:
- Any build errors or warnings
- Confirmation that the server is running

If there are errors, report the full error message. Do not attempt to fix errors
without reporting them first.

---

## Prompt 9: Commit

Once the dev server starts without errors, run:

```bash
cd /Users/aaronsleeper/Desktop/Vaults/Lab/haven-ui
git add -A
git commit -m "Migrate app pages and pattern library from haven repo"
```

Report the commit hash.

---

## Verification

After all prompts complete, confirm:

- [ ] `apps/kitchen/` contains: add-meals.html, delivery-status.html, finance.html, meal-list.html, orders.html, reports.html, settings.html
- [ ] `apps/provider/` contains dashboard, patients, alerts, program, reports, partners pages
- [ ] `apps/provider/patients/` contains detail.html
- [ ] `pattern-library/pages/` contains 14 pages
- [ ] No `../../styles/` references remain in any app page
- [ ] No FA Free CDN references remain in any app page
- [ ] Dev server starts without errors at http://localhost:5173

---

## Final Step: View the Result

Output the following to Aaron:

---
**Migration complete. View your pages:**
- Kitchen finance: http://localhost:5173/apps/kitchen/finance.html
- Provider dashboard: http://localhost:5173/apps/provider/dashboard.html
- Pattern library: http://localhost:5173/pattern-library/pages/index.html
- Root index: http://localhost:5173/

If `npm run dev` is not running, start it from the repo root first.

**Note:** Some app pages may have inline `<style>` blocks that were not migrated to
`components.css`. These will render correctly for now. They are flagged for a
follow-up cleanup task.
---
