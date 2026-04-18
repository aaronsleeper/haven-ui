# RFC-0001 — Proposed spec addition

> This is the exact text to insert into `expert-spec.md` Layer 1 (Domain Knowledge)
> after the "Reference sources" section, if RFC-0001 is accepted.

---

**Assumptions:** Experts are often authored before all institutional knowledge is
available. When a knowledge area depends on a role that doesn't exist yet, a
protocol not yet published, or institutional standards that haven't been captured,
the expert should make a defensible assumption rather than leaving a gap.

An assumption is domain knowledge that the expert operates on but that has not been
validated by the appropriate authority. It differs from a gap (unknown, blocking)
and from validated knowledge (confirmed by authority).

Each assumption entry in the domain knowledge tables includes the standard fields
plus a `[ASSUMPTION]` prefix on the knowledge area name and a **Validates by**
note (role or event, not person) in the source field:

```
| `[ASSUMPTION]` Knowledge area | Assumed value | Basis (published guideline, workflow doc, etc.) + "Validates by: [role/event]" | Shelf life |
```

**Assumptions index:** Every domain-knowledge.md with assumptions includes a
summary table at the bottom:

```markdown
## Assumptions index

| # | Assumption | Basis | Validates by | Status |
|---|---|---|---|---|
| A1 | [short description] | [source] | [role/event] | unvalidated / validated / revised / retired |
```

**Lifecycle:** Assumptions are authored with the expert, operated on in outputs
(with assumption dependencies noted in the confidence signal), tracked in the
retro log when overrides correlate with assumption-dependent outputs, and
validated or revised when the authority arrives. Validated assumptions lose
their marker and become regular domain knowledge.

**Freshness trigger:** "Validating authority arrives" (role hired, protocol
published) is a one-time freshness trigger. When it fires, the assumptions
index becomes the validation checklist.

**Guard rail:** If an expert's assumptions index exceeds 10 entries, the gap
between theoretical and institutional knowledge may be too wide — consider
whether the expert should be built yet, or whether it needs a different
bootstrapping strategy (e.g., direct human coverage until the authority exists).
