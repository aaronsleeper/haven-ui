---
title: Round-trip test — haven callout style
purpose: verify whether a Pandoc fenced-div with a custom paragraph style survives Google Docs upload + suggesting-mode edit + download
---

# Round-trip test — haven callout style

This is a normal body paragraph for baseline comparison. If the round-trip works, this paragraph stays as Normal/Body Text and the next one keeps its `callout-warning` style.

::: callout-warning
This is a styled callout-warning paragraph. The test question is whether this paragraph's style name survives the round-trip: Pandoc → docx → upload to Google Drive → open in Google Docs → suggesting-mode edit → download as docx → Pandoc parse.

After download, run `pandoc test-roundtrip-callout-edited.docx --track-changes=all -o roundtrip-parsed.md` and check: (a) does the `::: callout-warning` fence appear in the output, and (b) does the suggesting-mode edit show as a tracked-change span with author + date.
:::

This is another normal body paragraph for baseline comparison.

## Second-level heading for style baseline

A paragraph after a subheading. Heading 2 should be Lora in `#0D322D`. Body is Source Sans 3 in `#0D322D`.

> A blockquote for visual reference. Should be Lora bold italic in teal-700 with a teal-500 left border.
