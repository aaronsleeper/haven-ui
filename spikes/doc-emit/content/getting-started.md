---
title: Introduction
description: A documentation page emitted from portable markdown — zero styling in this file.
---

This entire page is written in plain markdown plus a handful of content directives. It carries **no CSS classes, no haven-ui markup, no component imports**. The brand surface is applied at build time by the seam (`handlers.mjs`), exactly the way Mintlify applies its `components` map at render time — except we emit static HTML.

## Why this matters

If the seam works, the same content below could be re-rendered through a *different* component map and reskin completely, with no edits here. That is the property we are proving.

:::callout{variant="success" title="The seam works if you can read this as a styled alert."}
This was authored as a `:::callout` directive. The build step substituted haven-ui's `.alert` markup, FontAwesome Pro icon, and tokens.
:::

:::callout{variant="warning" title="Heads up:"}
Spacing, type ramp, and density are NOT set here — they live in haven-ui's `components.css`. This file cannot override them, by design.
:::

## What the author controls

- The words.
- The *kind* of block (a callout, a card, a table) via a directive name.
- Nothing about how that block looks.

## What the system controls

Everything visual. Try changing a class in the seam and re-emitting — every page changes at once.
