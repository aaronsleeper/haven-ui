# Gate 1 — Universal App Shell + Per-App Minimums (haven-ui)

**Date:** 2026-05-03
**Pipeline run:** haven-ui-universal-app-shell (worked example through design-to-build pipeline)
**Stage completed:** ux-architect (Phase 1 Discovery + Phase 2 Functional Spec + Phase 3 IA)
**Next stage:** ux-wireframe (Gate 2 — wireframes + copy review)
**Plan:** `~/.claude/plans/haven-ui-universal-app-shell.md`
**Skill:** `Lab/haven-ui/.project-docs/agent-workflow/skills/ux-architect.md`

> **Note on file location:** the parent task asked for this gate summary at `~/.claude/plans/gates/2026-05-03-shell-pipeline-gate-1.md`. Writes to `~/.claude/plans/` (and creating the `gates/` subdirectory) are blocked in this environment. Landing the doc here in the repo, parallel with the other Gate 1 artifacts, so it stays under version control alongside the work it summarizes. Move/copy into `~/.claude/plans/gates/` whenever Aaron creates that directory.

---

## Scope

Universal application shell for haven-ui that serves as the base for all four Cena Health apps (care-coordinator, patient, kitchen, provider) plus the minimum per-app features that make each app feel like *that app* rather than chrome with placeholders.

**The shell + minimums are the artifact. The pipeline run is the proof.**

### Locked Gate 1 decisions (entered this pass; do not re-litigate)

- **G1.1 — Shell foundation: rich base, restrict downward.** The universal shell adopts `layout-agentic-shell.html` as the universal base — resizable panes, gradient-sphere Ava avatar in chat-pane header, agent-working indicator, approval cards, tool-call rendering. Per-app variants restrict capability downward (e.g., patient hides agent-activity thread; mobile collapses to swipe-nav between panels). The agentic shell *is* the Cena identity; hiding capability is mechanical, adding it later is a redesign.
- **G1.2 — Per-app "minimum to feel like that app":**
  - **Coordinator:** queue with 3 categories (urgent / needs-attention / informational) + thread showing one active agent task with approval card
  - **Patient:** assessments list (already shipped) + one in-progress thread surface showing notifications-only (no agent activity exposed to patient)
  - **Kitchen:** orders queue + one open order with packing slip + status thread (all new)
  - **Provider:** patient queue + one patient record + clinical action thread (all new)
- **G1.3 — Patient mobile shell: authored now.** Mobile *is* the patient app's reality; demoing desktop-only would misrepresent. ux-architect produces the parallel mobile shell spec at `apps/patient/design/wireframes/patient-mobile-shell.md` alongside coordinator desktop.

---

## Files produced

| Path | Purpose |
|---|---|
| `Lab/haven-ui/apps/_shared/design/universal-shell-use-cases.md` | Shell-level personas, goals, use cases, constraints, IA — applies across all 4 apps |
| `Lab/haven-ui/apps/care-coordinator/design/shell-use-cases.md` | Coordinator slice: persona, use cases, functional spec, IA |
| `Lab/haven-ui/apps/patient/design/shell-use-cases.md` | Patient slice (mobile-first): persona, use cases, functional spec, IA |
| `Lab/haven-ui/apps/_shared/design/kitchen-shell-use-cases.md` | Kitchen slice (lives in `_shared/` until app restored): persona, use cases, functional spec, IA |
| `Lab/haven-ui/apps/_shared/design/provider-shell-use-cases.md` | Provider slice (lives in `_shared/` until app restored): persona, use cases, functional spec, IA |
| `Lab/haven-ui/apps/patient/design/wireframes/patient-mobile-shell.md` | Mobile shell wireframe spec (parallel to `cc-shell-layout.md`) |
| `Lab/haven-ui/packages/design-system/src/data/shared/ia-map.md` | Canonical IA map across all 4 apps + cross-app flows |
| `Lab/haven-ui/apps/_shared/design/shell-component-gaps.md` | Wireframe-vs-PL delta report for `haven-mapper` |
| `Lab/haven-ui/apps/_shared/design/2026-05-03-shell-pipeline-gate-1.md` | This summary |

---

## IA map (high-level)

```
┌──────────────┬─────────────────────────────────┬──────────────────┐
│   LEFT       │         CENTER                   │   RIGHT          │
│   (queue /   │         (record / content /      │   (thread /      │
│   tasks /    │          summary / list)         │   notifications  │
│   orders /   │                                  │   / approvals)   │
│   clinical)  │                                  │                  │
└──────────────┴─────────────────────────────────┴──────────────────┘
   ~260px def       flex (480 floor / 560 comfortable)    ~640px def
```

- **Coordinator:** queue + record viewer + full-allowlist thread (with approval cards)
- **Patient (mobile):** route-based single-pane (Dashboard / My Health / Messages / Care / Settings) + bottom-nav + i18n bar
- **Kitchen:** orders list (status-grouped) + open order with packing slip + order activity thread
- **Provider (RDN):** clinical queue (gate-type-grouped) + patient record (clinical/nutrition focus) + clinical action thread

Full IA at `packages/design-system/src/data/shared/ia-map.md`.

---

## Key decisions made during this pass

- **The patient's "thread" is a route, not a swipe target at v1.** The Messages tab in `mobile-bottom-nav` IS the patient's right-pane equivalent. Swipe-nav (vision per `ui-patterns.md`) is deferred to v1.1.
- **Patient app uses a strict thread allowlist enforced server-side AND client-side.** A `tool_call` leak to a patient surface is a P0 bug. Defense in depth.
- **`thread-panel` is one component, four allowlist configurations** — coordinator (full), patient (notifications-only strict), kitchen (order-relevant operational), provider (full clinical). The component stays one; the allowlist is data, not chrome.
- **Cena logo is constant; Ava avatar appears only when the agent is doing something.** Logo lives in nav header; Ava lives in chat-pane header + on Ava-authored events. Ava NEVER appears in the patient app.
- **Clinical-decision approval card is a `thread-approval-card` variant**, not a new primitive. New modifier `.is-clinical` carries NCP terminology + ICD-10 mapping + signature affordance. 4-expert panel because brand-fidelity-weighted.
- **Packing slip is a novel primitive** — Tier 1 PL fragment + 4-expert panel because allergen prominence is safety-critical.
- **Kitchen + provider apps are archived;** pre-restoration design proceeds. Build waits on `git mv archive/inactive-apps/{kitchen,provider} apps/`.

---

## Component coverage (for `haven-mapper`)

| Bucket | Count | Items |
|---|---|---|
| Exists in PL (use as-is or compose) | 30+ | universal shell + coordinator + patient minimums almost entirely covered |
| Novel composition (recurring shape) | 3 | status-grouped orders list (kitchen), patient Messages route allowlist, gate-type-grouped clinical queue (provider) |
| Novel primitive (no decomposition path) | 1 | **packing slip** (kitchen, brand-fidelity-weighted) |
| Novel variant (extends existing primitive) | 1 | **clinical-decision approval card** (`thread-approval-card.is-clinical`, brand-fidelity-weighted) |

Detailed breakdown at `apps/_shared/design/shell-component-gaps.md`.

---

## Conflicts with locked Gate 1 decisions surfaced during reading

- **None directly conflicting.** A few surface-level tensions worth flagging at Gate 2 (not blockers):
  - Care-coordinator app currently renders the **bare** `three-panel-shell`, not the agentic-shell rich base. Gate 1 G1.1 locks rich base as universal. Adoption is mechanical (compose `<AgenticShell>` + bind nav/chat/content panes; port `panel-splitter` drag-resize to React) but does require a slice. Flag for the wireframer: should we wireframe the *target* (rich base) and let dev-tasker sequence the upgrade, or wireframe the *current* state? Recommend target.
  - `agentic-shell` chat header treats Ava avatar (gradient sphere) as canonical for the agent-rich surface. Coordinator + provider + kitchen all have Ava conversations; patient does not. Confirm Ava chat-header appears in coordinator/provider/kitchen even though kitchen's primary mode is status-progression more than agent-conversation. Recommend yes for consistency.

---

## Open questions for Aaron at Gate 2

1. **Care-coordinator existing shell vs. agentic-shell adoption.** Wireframe the target (rich base) and let dev-tasker sequence the upgrade, or wireframe current state? Recommendation: target.
2. **Right-pane availability per app.** Kitchen + provider both have a thread in vision docs but kitchen's value is order-status events, not agent-conversation. Default render or collapsible-by-default for kitchen below 1240px?
3. **Patient "thread" naming.** Recommend "Messages" as the route name and "Notifications" or "Updates" for system-generated events. "Thread" is too clinical for patient-facing copy.
4. **Bilingual scope at v1.** Assessments + Dashboard are bilingual-ready in source docs. Messages tab + Settings tab — v1 bilingual or deferred? Recommend v1 for both since both contain plain-language copy.
5. **Worked-example agent task for the coordinator approval card.** Care plan ready for final approval (RDN signed, coordinator approving full plan)? Confirm so the wireframer doesn't pick a different example.
6. **Clinical-decision approval card pathway.** New PL primitive or extension variant of `thread-approval-card`? Recommend variant — same anatomy, different content priority.
7. **Restoration timing for kitchen + provider apps.** Restore as part of pipeline run (before build), or prerequisite gate before scheduling build?
8. **BHN scope at v1.** Provider serves RDN at v1; BHN deferred. Confirm.
9. **Mobile swipe-nav at v1 or v1.1.** Recommend bottom-nav-only at v1; swipe-nav as v1.1 enhancement.
10. **Kitchen tablet vs. desktop primary.** Designing for desktop-primary + tablet (≥768px) supported with same agentic-shell rich base. Confirm.

---

## What Aaron must confirm before Gate 2

Aaron's go/no-go on:

- [ ] **The 4 use-case docs** (universal + coordinator + patient + kitchen + provider). Each is specific enough that a wireframer can convert it to text wireframes without further synthesis.
- [ ] **The IA map** (`packages/design-system/src/data/shared/ia-map.md`) reflects the universal shell + per-app variants accurately.
- [ ] **The mobile shell spec** (`apps/patient/design/wireframes/patient-mobile-shell.md`) is the parallel to coordinator desktop and meets the G1.3 commitment.
- [ ] **The component-gap report** correctly classifies what's covered vs. what needs authoring — including the 1 novel primitive (packing slip) and 1 novel variant (clinical-decision approval card).
- [ ] **The 10 open questions** above either resolved or flagged as "answer at Gate 2 with the wireframes in hand."

If Aaron confirms, the next stage is `ux-wireframe`:
- Author text wireframes for each per-app shell + minimum
- Pre-build `ux-design-review` + 4-expert panel for brand-fidelity-weighted entries
- Gate 2 review with Aaron

---

## Pipeline status update

**Done:**
- [x] Reframed the question: shell + pipeline run, not features
- [x] Confirmed the four apps in scope
- [x] Discovery sweep across 22+ source docs (Lab/haven-ui + Knowledge/Projects/Cena Health)
- [x] Reconciled with code (rich agentic-shell vs. bare three-panel-shell)
- [x] **Stage 1: discovery / use cases / personas — complete**
- [x] **Gate 1 ready for Aaron's review (this doc)**

**Next:**
- [ ] **Gate 1 review with Aaron** — confirm scope and IA before proceeding
- [ ] Stage 2: ux-wireframe — text wireframes for each per-app shell + minimum
- [ ] Stage 2 review: ux-design-review (pre-build) + 4-expert panel for brand-fidelity-weighted entries
- [ ] **Gate 2 review with Aaron**
- [ ] Stage 3: haven-mapper delta review (input is `apps/_shared/design/shell-component-gaps.md`)
- [ ] Stage 4: dev-tasker build plan
- [ ] **Gate 3 review with Aaron**
- [ ] Stage 5: build (kitchen + provider apps restored from `archive/inactive-apps/` first)
- [ ] Stage 6: ux-design-review post-build + 4-expert panel
- [ ] Stage 7: debrief-capture

---

## File List (append-only, code-work plans only — N/A here)

This is a design-only stage; no code or config changed during this pass.
