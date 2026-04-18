# Quality Criteria

## Responsive implementation spec
- [ ] All three breakpoints addressed (mobile, tablet, desktop)
- [ ] Desktop behavior preserved — no regression from adding responsive classes
- [ ] CSS-first: JS used only when justified (rationale provided)
- [ ] No layout shift (CLS) at any breakpoint transition
- [ ] Classes follow mobile-first ordering (base, md:, lg:)

## Architecture decision record
- [ ] At least 2 options considered with concrete trade-offs
- [ ] Decision linked to a principle from judgment framework
- [ ] Consequences include both benefits and costs
- [ ] Assumptions explicitly listed

## Component architecture recommendation
- [ ] @ava/ui vs app-local placement justified
- [ ] State strategy matches pattern for data type (server=tRPC, URL=filters, context=UI)
- [ ] Lazy loading decision follows performance decision tree
