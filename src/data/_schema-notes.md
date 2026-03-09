# Data Schema Notes

This file documents any deltas between dummy data in `src/data/` and the Firebase schema.
It is the visibility contract between Aaron and Andrey.

## Purpose

All dummy data in this repo should conform to the Firebase schema.
When it doesn't -- because a UI need requires a shape Firebase doesn't support yet,
or because we're prototyping ahead of the schema -- document it here.

## Format

```
## [Entity]
- **Field**: `fieldName`
- **Delta**: What we have vs. what Firebase has
- **Reason**: Why we deviated
- **Status**: [ ] Needs schema update | [ ] Intentional prototype only | [x] Resolved
```

## Deltas

_None yet._
