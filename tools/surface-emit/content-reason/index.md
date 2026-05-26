---
title: Patient-app reasoning — interrogate it
---

This surface shows the team's reasoning on the patient-app build and makes each decision pokeable. It renders the *why*, not the plans. Open a disclosure to see the rationale and its source; push where the question is still open.

## Framework: emit Angular, not own a React frontend

:::reason{q="Why this approach?" source="planning/team/proposals/AD-08-revisit-pipeline-framework-emit.md" kind="poke"}
The original frontend decision (React, "we own the full frontend") rested on a premise that lapsed — production is Angular, you own it, and it doesn't consume our design system. Once that premise is gone, the question stops being "what stack do we own" and becomes "what artifact should the pipeline hand to production." A mechanical Angular emit meets you in your stack with less manual work than HTML you re-type, and sidesteps the old anti-Angular objections (those were about free-form AI generation + React-Aria a11y — neither of which this pipeline uses).
:::

:::push
"Functional, not HTML" is overstated by exactly the data-layer gap. A mechanical emit delivers presentation + client behavior; it can't deliver your service layer because the service contract (T0.2) doesn't exist yet. The real question for you: would generated Angular dropped into your codebase *reduce* your work — or do its idioms fight your conventions enough that you'd rather get HTML and write the Angular yourself? That single answer decides the whole approach.
:::

:::reason{q="Challenge this" kind="challenge"}
The emit thesis leans on one hand-ported component. Push on it: does the generated Angular actually match how you'd write it, or does it create reconciliation work that cancels the saving? You're the only person who can answer whether this helps or hinders.
:::

## The cart — featured model-to-break

:::card{title="Why does the order flow have a cart?" icon="cart-shopping"}
The meal-ordering flow uses a cart rather than one-tap-order because patients assemble a multi-item order against a weekly budget — the cart is where the budget math is visible before commit. The open question is **when** the cart persists (per-session vs. across visits), which changes the budget-reconciliation model.
:::

:::reason{q="Why a cart and not one-tap?" source="flow-meal-ordering.md" kind="poke"}
Patients order multiple items against a per-week dollar budget; they need to see the running total and adjust before committing. One-tap-order can't show the budget tradeoff at decision time. The cart is the budget-visibility surface, not e-commerce mimicry.
:::
