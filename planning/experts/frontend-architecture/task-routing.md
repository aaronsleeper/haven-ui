# Task Routing

| Task | Tier | Rationale | Extraction status |
|---|---|---|---|
| Responsive implementation spec | Standard (Sonnet) | Applying established breakpoint patterns to components | Not extractable — requires per-component judgment |
| Architecture decision record | Deep (Opus) | Novel trade-offs, cross-cutting concerns | N/A |
| Component architecture recommendation | Standard (Sonnet) | Applying placement/composition heuristics | N/A |
| Tailwind class generation for known patterns | Light (Haiku) | Mechanical application of responsive classes | Candidate for extraction to utility |
| Build pipeline documentation | Light (Haiku) | Recording known steps | Extracted: documented in domain-knowledge |
