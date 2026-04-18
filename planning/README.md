# planning/

Product, UX, and architecture planning for the human-facing apps that integrate with Ava.

## Origin

Imported from the Ava repo on 2026-04-18 at commit `96c96e1` (github.com/CenaHealth/ava). Ava the repo now holds only the agent-brain internals — runtime, model gateway, tool implementations. Everything that specifies what the human-user applications look like, how they behave, and who uses them lives here.

**Treat Ava as historical.** Edit these docs in place; do not round-trip back to the Ava repo.

## What was imported

- `ui-patterns.md` + `architecture/` — three-panel layout spec, data-model, thread-engine contract (what the UI renders)
- `experts/` — domain experts whose judgment shapes requirements and review (ux-design-lead, design-system-steward, frontend-architecture, accessibility, compliance, patient-ops, meal-operations, clinical-care, platform-infrastructure, and supporting specs)
- `journeys/` — user journeys for each role across the apps
- `roles/` — personas (care coordinator, RDN, BHN, kitchen, patient, admin, Ava herself)
- `workflows/` — the ten business workflows the apps support
- `avatar/` — Ava's orb rendering
- `humans/`, `team/`, `org/`, `onboarding/` — team and org context that experts need to calibrate
- Root docs — vision, roadmap, product-structure, business-functions, feature-expert-mapping, open-questions, decisions, doc-dependencies

## What was not imported (still lives in the Ava repo)

- `architecture/agent-framework.md`, `agent-implementation-spec.md`, `expert-runtime-spec.md`
- `agent-infrastructure-notes.md`
- `topology.*`, `generate-topology.py`
- `governance/`, `session-logs/`
- `planning/CLAUDE.md` (Ava-specific agent rules)

If you need any of these for UI work, pull the specific file rather than mirroring the agent brain here.

## Known drift

- Internal file references may still point to paths that made sense in the Ava repo (e.g., `packages/ui`, `apps/admin`). Fix on read, not in a sweep.
- `experts/*/retro-log.md` carries Ava-era context. Keep appending; don't rewrite history.
