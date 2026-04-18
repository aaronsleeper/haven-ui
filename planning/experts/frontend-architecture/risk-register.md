# Risk Register

| Risk | Likelihood | Impact | Mitigation | Residual risk |
|---|---|---|---|---|
| Responsive retrofit breaks desktop layout | Medium | High | Mobile-first approach with lg: classes preserving current desktop behavior. Test desktop first after each change | Low — desktop classes are additive |
| @ava/ui changes not reflected in admin app | High (current DX pain) | Medium | Document build+clear+restart workflow. Investigate Turborepo watch mode | Medium until watch mode implemented |
| Thread panel CLS on open/close | Medium | Medium | Always render thread container on desktop (placeholder when empty) | Low after implementation |
| Over-engineering mobile for queue-check-only use case | Medium | Low | Mobile is reference-only: queue list + detail. No complex interactions | Low — scope is explicitly limited |
