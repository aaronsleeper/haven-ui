---
title: Components
description: The same content tier, exercising more of the seam — cards, badges, tables, code.
---

Each block below is a plain-markdown construct or a named directive. The build step binds it to haven-ui.

## Cards

:::card{title="Authored as a directive" icon="cube"}
This card is `:::card{title="..." icon="cube"}` in the source. The seam emitted `.card` + `.card-header` + `.card-body` and dropped in a FontAwesome icon.
:::

:::card{title="Swap-survivable" icon="arrows-rotate"}
Repoint the seam at a different component set and this becomes a different card — the markdown stays byte-for-byte identical.
:::

## Inline elements

A paragraph can carry inline `code spans` and [links](./getting-started.html) — both get haven-ui treatment from the primitive seam, not from anything written here.

Status labels are directives too: :badge[Stable]{variant="success"} and :badge[Beta]{variant="warning"} and :badge[Internal]{variant="info"}.

## Tables

Markdown tables are a primitive — the seam adds the `.data-table` class so they pick up haven-ui's table styling automatically.

| Tier | What it is | Brand judgment? |
| --- | --- | --- |
| Content | Markdown + directives | None |
| Compile | remark/rehype AST | None |
| Seam | the handler map | All of it |
| Shell | nav walk + chrome | Almost none |

## Code

```js
// Fenced code stays a code block; only INLINE code is restyled.
const seam = (contentNode) => havenComponent(contentNode);
```

## Reasoning disclosures

The `:::reason` directive folds the cena-reasoning surface's pokeable `<details>` into the same engine — same content tier, no hand-built HTML.

:::reason{q="Why does this directive exist?" source="surface-emission-convergence.md" kind="poke"}
The reasoning surface was a third hand-built emitter of the same seam. Folding its `<details>` disclosure into a directive means one engine renders docs, SoT, and reasoning surfaces alike.
:::

:::reason{q="Challenge this" kind="challenge"}
Does a single directive really capture the reasoning surface's richer blocks (model-to-break, push-here)? Those may stay surface-local CSS, or promote to the pattern library on a second consumer.
:::
