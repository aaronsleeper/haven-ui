<!-- Extracted from CLAUDE.md — edit here, not in CLAUDE.md -->

## Verification Checklist

After completing any build task:

- [ ] Verified at `http://localhost:5173` (not any other port)
- [ ] HTML classes are semantic — no utility chains
- [ ] Layout-only utilities are acceptable in HTML (one-off template layout)
- [ ] All new classes added to `src/styles/tokens/components.css` with `@apply` definitions
- [ ] No `style="..."` attributes (except data-driven flex values on pipeline segments)
- [ ] No `<script>` blocks in HTML files
- [ ] All JS in external files under `src/scripts/`
- [ ] Chart.js colors use `HAVEN.*` constants, no hardcoded hex
- [ ] Preline interactive components open/close correctly
- [ ] Layout holds at ~768px width
- [ ] No files edited in `dist/`
- [ ] Any new dummy data schema deltas documented in `src/data/_schema-notes.md`
- [ ] Any new component has a file in `pattern-library/components/` with `@component-meta`
- [ ] `pattern-library/COMPONENT-INDEX.md` updated if a new component was added
- [ ] `ANDREY-README.md` updated (see ANDREY-README.md section below — this is mandatory, not optional)
