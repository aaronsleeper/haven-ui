---
title: Org capabilities
description: The durable, cross-program capability layer — what Cena offers across any program.
---

:::callout{variant="info" title="Stub — grows by promotion, not by authoring."}
This is the durable capability layer: what Cena can do across *any* program, independent of one contract. It is intentionally thin today. It fills as program-specific capabilities prove general and **promote up** from a program space — not by writing a speculative org catalogue now (anti-boil-the-ocean).
:::

## What this layer is

- **Program-level capability** = scoped to one contract (e.g. UConn's referral funnel, its meal-ordering flow). Lives in that program's space.
- **Org-level capability** = the generalized version Cena offers any partner (e.g. "agent-assisted meal ordering against a budget", "referral intake + enrollment"). Lives here.

## The promotion path

When a capability defined for the UConn pilot proves general — a second program would reuse it largely unchanged — it promotes from `capabilities/` in the program space to this org layer, and the program references it instead of owning it. Until a second program exists to pull against, the UConn capability set (see [UConn → Apps & surfaces](./uconn-apps.html) and [Operations](./uconn-operations.html)) is the working draft of this layer.

> Canonical capability detail stays in the program spaces until promotion. This page indexes the promoted set — empty by design until the first promotion.
