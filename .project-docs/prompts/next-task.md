# First Run Setup

## Context

This is a new repo. The scaffold is complete but several things need to happen before work begins.

## Task 1: Copy components.css

The file at `src/styles/tokens/components.css` currently contains only a placeholder comment.
Copy the full content from the old repo into it:

```
cp /Users/aaronsleeper/Desktop/Vaults/Lab/haven/theme/styles/tokens/components.css \
   /Users/aaronsleeper/Desktop/Vaults/Lab/haven-ui/src/styles/tokens/components.css
```

## Task 2: Copy FontAwesome Pro

FontAwesome Pro v7.1.0 lives at `/Users/aaronsleeper/Desktop/Vaults/Lab/fontawesome-pro_v7.1.0/`.
Copy it into the repo so pages can reference it via relative path:

```
cp -r /Users/aaronsleeper/Desktop/Vaults/Lab/fontawesome-pro_v7.1.0 \
      /Users/aaronsleeper/Desktop/Vaults/Lab/haven-ui/src/vendor/fontawesome
```

Then update `src/partials/head.html` to replace the CDN link with the local path:

```html
<!-- Replace this: -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />

<!-- With this: -->
<link rel="stylesheet" href="/src/vendor/fontawesome/css/all.css" />
```

Also add `src/vendor/` to `.gitignore` so the FA Pro files are not committed:

```
# .gitignore — add this line:
src/vendor/
```

## Task 3: Install dependencies

```
cd /Users/aaronsleeper/Desktop/Vaults/Lab/haven-ui
npm install
```

## Task 4: Verify dev server

```
npm run dev
```

Confirm it starts at `http://localhost:5173` and the index page renders without errors.
Check the browser console for any CSS or JS errors.

## Task 5: Confirm glob-based build input works

The `vite.config.js` uses `glob.sync` to auto-discover HTML entry points.
Vite v6 includes `glob` natively — no separate install needed.
If you see a `glob is not defined` error, install it:

```
npm install glob
```

Then re-run `npm run dev`.

## When done

Report:
- [ ] components.css copied and file size matches source
- [ ] fontawesome copied to src/vendor/fontawesome/
- [ ] head.html updated to use local FA path
- [ ] src/vendor/ added to .gitignore
- [ ] npm install completed with no errors
- [ ] Dev server running at localhost:5173
- [ ] Index page renders with FA icons visible
- [ ] No console errors
