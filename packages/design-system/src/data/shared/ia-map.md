# Haven UI — Information Architecture Map

This is the canonical IA map for haven-ui across all four apps. The map evolves as new screens are added; agents update it after a `ux-architect` pass when the application structure changes.

**Last updated:** 2026-05-03 (universal app shell — Gate 1)
**Owner:** ux-architect skill (per `.project-docs/agent-workflow/skills/ux-architect.md`)

---

## Universal model

Every app uses **one shell pattern, four content variants.** The structure is constant; what fills the panes varies by persona.

```
┌──────────────┬─────────────────────────────────┬──────────────────┐
│   LEFT       │         CENTER                   │   RIGHT          │
│   (queue /   │         (record / content /      │   (thread /      │
│   tasks /    │          summary / list)         │    notifications │
│   orders /   │                                  │   / approvals)   │
│   clinical   │                                  │                  │
│   queue)     │                                  │                  │
└──────────────┴─────────────────────────────────┴──────────────────┘
   ~260px def       flex (480 floor / 560 comfortable)    ~640px def
   220–320           expandable                            480–800
```

**Rich base:** `layout-agentic-shell.html` is the universal base — resizable panes, gradient-sphere Ava avatar in chat-pane header, agent-working indicator, approval cards, tool-call rendering. Per-app variants restrict capability downward (e.g., patient hides agent activity; mobile collapses to single-pane swipe-nav).

**Mobile (patient):** the three-pane abstraction collapses to a route-based single-pane model with `mobile-i18n-bar` (top) + `mobile-bottom-nav` (bottom). The right pane (Messages) becomes its own route.

**Cena logo** in nav header across every app and context. **Ava avatar** appears only when the agent is doing something or has authored content — chat-pane header, message-leading indicator on Ava-authored events, agent-action citations. Ava NEVER appears in the patient app.

---

## App: Care Coordinator (`apps/care-coordinator`)

| Screen ID | Name | Pane | Notes |
|---|---|---|---|
| CC-SHELL | Coordinator three-pane shell | shell | Persistent layout, agentic-shell rich base |
| CC-LEFT | Queue sidebar | left | 3-tier urgency grouping + secondary nav (Patients, Reports, Settings) |
| CC-CENTER-SUMMARY | Morning summary | center | Default center on first open |
| CC-CENTER-RECORD | Record viewer | center | Patient / referral / care plan / discharge / etc. |
| CC-CENTER-PATIENT-LIST | Patient list (caseload) | center | Browsable, sortable |
| CC-RIGHT-THREAD | Thread + approval card | right | Full agent activity allowlist |

**Cited use cases:** `apps/care-coordinator/design/queue-triage-use-cases.md` + `apps/care-coordinator/design/shell-use-cases.md`
**Wireframes:** `apps/care-coordinator/design/wireframes/cc-01` through `cc-09` + `cc-shell-layout.md`
**Per-app minimum (Gate 1):** queue with 3 categories + thread showing one active agent task with approval card

---

## App: Patient (`apps/patient`)

| Screen ID | Name | Surface | Notes |
|---|---|---|---|
| PT-MOBILE-SHELL | Mobile shell | shell | 430px max-width centered + i18n bar + bottom-nav |
| PT-DASHBOARD | Dashboard (Tasks) | center route | Today's task, message preview, next delivery |
| PT-ASSESS-* | Assessment flow | center route | assess-01 through assess-05 (shipped) |
| PT-MESSAGES | Messages | center route (the patient "thread" surface) | Coordinator-patient threaded messages; STRICT allowlist |
| PT-HEALTH | My Health | center route | Trend cards |
| PT-CARE | Care plan / appointments | center route | View care plan + appointments (deferred detail) |
| PT-SETTINGS | Settings | center route | Language, notifications, accessibility |

**Cited use cases:** `apps/patient/design/assessments-use-cases.md` + `apps/patient/design/shell-use-cases.md`
**Wireframes:** `apps/patient/design/wireframes/assess-*`, `dashboard-tasks-section.md`, `tasks-01-task-list.md`, `patient-mobile-shell.md` (this pass)
**Per-app minimum (Gate 1):** assessments list (shipped) + one in-progress thread surface with notifications-only

**Patient-app strict allowlist:** the Messages route renders ONLY `notification`, `human_message` (coordinator + patient), and `status_change` events. NEVER `agent_tool_call`, `agent_tool_result`, `approval_request`, `approval_response`. Filtered server-side AND client-side.

---

## App: Kitchen (`apps/kitchen`, currently archived to `archive/inactive-apps/kitchen/`)

| Screen ID | Name | Pane | Notes |
|---|---|---|---|
| KT-SHELL | Kitchen three-pane shell | shell | Persistent layout, agentic-shell rich base |
| KT-LEFT | Daily orders list | left | Status-grouped (pending / prepping / packed / quality_checked / dispatched / delivered) + secondary nav (Recipes, Grocery, History, Settings) |
| KT-CENTER-SUMMARY | Daily production summary | center | Recipe-grouped breakdown + allergen alerts + grocery status |
| KT-CENTER-ORDER | Open order with packing slip | center | Per-order detail; allergen flags prominent |
| KT-CENTER-RECIPES | Recipe catalog | center | Recipe list + create + RDN review queue |
| KT-RIGHT-THREAD | Order activity thread | right | Status events + ops messages; kitchen allowlist |

**Cited use cases:** `apps/_shared/design/kitchen-shell-use-cases.md` (until app is restored)
**Wireframes:** none yet — next pipeline stage
**Per-app minimum (Gate 1):** orders queue + one open order with packing slip + status thread (all new; pending restoration before build)

---

## App: Provider (`apps/provider`, currently archived to `archive/inactive-apps/provider/`)

| Screen ID | Name | Pane | Notes |
|---|---|---|---|
| PR-SHELL | Provider three-pane shell | shell | Persistent layout, agentic-shell rich base |
| PR-LEFT | Clinical queue | left | Gate-type-grouped (nutrition reviews / SOAP signatures / lab flags / recipe validations / meal-match exceptions) + secondary nav (Patients, Recipes, Settings) |
| PR-CENTER-CASELOAD | Caseload overview | center | Patients sortable |
| PR-CENTER-RECORD | Patient record (clinical) | center | Nutrition focus + biomarker trends |
| PR-CENTER-CAREPLAN | Care plan nutrition section | center | Agent draft + edit room |
| PR-CENTER-SOAP | SOAP note draft | center | S/O/A/P + signature |
| PR-CENTER-RECIPES | Recipe nutritional validation | center | Recipe + nutritional values + approval |
| PR-RIGHT-THREAD | Clinical thread + approvals | right | Clinical-decision approval cards |

**Cited use cases:** `apps/_shared/design/provider-shell-use-cases.md` (until app is restored)
**Wireframes:** none yet — next pipeline stage
**Per-app minimum (Gate 1):** patient queue + one patient record + clinical action thread (all new; pending restoration before build)

---

## Cross-app screen flows

### Universal: open app
```
Authenticated → SHELL renders → LEFT loads role-specific list → CENTER loads orientation surface → RIGHT empty
```

### Universal: select left item
```
Click left item → LEFT highlights item → CENTER loads record/content → RIGHT loads contextual thread (allowlist applied per app)
```

### Coordinator-specific: approve
```
Right approval card → tap Approve → 5-second undo → log decision → LEFT removes item → next-item highlight
```

### Patient-specific: complete assessment
```
Dashboard task → tap → assess-02 intro → assess-03 questions (one at a time, per-question save) → assess-04 complete → return to dashboard → trend visible in My Health route
```

### Kitchen-specific: progress order
```
Click order → open order in CENTER + RIGHT thread → tap status button → status_change logs → LEFT regroups
```

### Provider-specific: approve nutrition section
```
Click nutrition review → patient record + care plan in CENTER + RIGHT clinical thread with approval card → review + edit → tap Approve → log signature → coordinator's full-plan approval card now appears in coordinator queue
```

### Cross-app handoff (e.g., kitchen flags allergen → coordinator queue)
```
Kitchen taps "Allergen concern" on order → issue logged in order thread + coordinator queue gets new urgent item → coordinator reviews → coordinator either re-prep with kitchen or notify patient
```

---

## Pane width + responsive collapse (universal)

Per `DESIGN.md` §Composition patterns:

| Viewport | Left nav | Center | Right |
|---|---|---|---|
| ≥1240px | 260 expanded | flex | 640 visible |
| 960–1239px | 260 expanded | flex | 480 collapsible |
| 720–959px | 80 icon rail | flex | inspector sheet on demand |
| <720px | hamburger sheet (or mobile-bottom-nav for patient) | full | full-screen sheet on demand (Messages route for patient) |

**Collapse order:** right pane first → left to rail → left to sheet. Center chat is the product; never collapses.

**Resize state:** persisted per-user (not per-device).

---

## Component-pane bindings (canonical)

| Pane role | PL component | Notes |
|---|---|---|
| Shell envelope | `agentic-shell` (rich) or `three-panel-shell` (bare) | Rich is canonical for v1 per Gate 1 G1.1 |
| Mobile shell | `mobile-shell` + `mobile-i18n-bar` + `mobile-bottom-nav` | Patient app only |
| Pane resize | `panel-splitter` + `panel-splitter.js` | Drag-to-resize handles |
| Left pane (coordinator/provider/kitchen) | `queue-sidebar` + `queue-section-header` + `queue-list` + `queue-item` | Patient uses bottom-nav instead |
| Right pane (any app) | `thread-panel` + `thread-msg-*` + `thread-approval-card` | Allowlist parameterized per app |
| Right pane (patient) | `thread-panel` configured strict | Allowlist: `notification` + `human_message` + `status_change` only |
| Center pane | varies by record type — `record-header`, `clinical-*`, `card`, `data-table`, etc. | App + record specific |

---

## Update protocol

1. After a `ux-architect` pass, if the application structure changed (new screen added, screen moved, new app introduced), update this file.
2. Each screen entry needs: ID, name, pane, persona, primary actions (or "see linked use cases"), and a pointer to the use-case doc.
3. Cross-app flows go in the §Cross-app section.
4. Component-pane bindings update when a new shell-level PL primitive lands.
5. Date-stamp the "Last updated" line.

---

## Change log

| Date | Change | Author |
|---|---|---|
| 2026-05-03 | Initial canonical IA map: universal shell + 4 apps; locked Gate 1 decisions; coordinator + patient + kitchen + provider per-app rows; mobile route model | ux-architect (haven-ui-universal-app-shell pipeline run) |
