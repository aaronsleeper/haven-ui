# Provider — Shell Use Cases (Universal Shell + Provider Minimums)

**Application:** Provider App (RDN primary; BHN + future referring provider out of v1 scope)
**Persona:** RDN (Dr. Soto — Registered Dietitian Nutritionist; clinical lead for nutrition)
**Device:** Desktop primary
**Status:** Phase 1–3 complete; Gate 1 ready
**Parent:** [`apps/_shared/design/universal-shell-use-cases.md`](universal-shell-use-cases.md)
**Restoration note:** Provider app was archived 2026-04-23 to `archive/inactive-apps/provider/`. Shell design proceeds now; **Stage 5 (build) requires `git mv archive/inactive-apps/provider apps/provider` first** — see `archive/inactive-apps/README.md`. Living here under `_shared/` until restoration.

This doc covers the provider's slice of the universal shell + the **minimum features that make the app feel like the provider app** rather than chrome with placeholders. Per Gate 1 G1.2: *patient queue + one patient record + clinical action thread (all new).*

---

## Phase 1: Discovery

### Persona — RDN (Dr. Soto)

- Clinical lead for nutrition; signs the nutrition section of every care plan
- Reviews agent-drafted SOAP notes before signing
- Conducts MNT visits (initial 97802 and follow-up 97803/G0271)
- Monitors biomarker trends (HbA1c, lipids, weight, nutritional labs) across caseload
- Flags recipe catalog issues that affect clinical appropriateness
- Owns the "nutrition plan approval" gate — 24h SLA for new care plans, 24h for revisions, 48h for SOAP notes

The provider's primary interaction mode is **review and signature**, not free task execution. Agents draft; RDNs decide.

### User goals (provider shell-level)

| Goal | Frequency | Priority |
|---|---|---|
| Open the app and see today's clinical queue grouped by gate type | Daily, first action | Highest |
| Review the nutrition section of a care plan with the agent's draft + my edit room | Per care plan | Highest |
| Sign a SOAP note knowing the audit trail is intact | Per visit | Highest |
| See biomarker trends for a patient in context with their care plan | Per patient review | High |
| Direct the agent to retrieve labs / flag a meal mismatch | Ad hoc | Medium |
| Reassign an item if it needs another clinician (BHN for behavioral health) | Occasional | Medium |

### Use cases (provider-specific)

#### PR-SHELL-01: Open clinical queue
**Precondition:** RDN is logged in. Agent has been running.
**Trigger:** RDN opens the Provider App.
**Flow:**
1. Shell renders three panes; agentic-shell rich base; Cena logo in nav
2. Left pane: clinical queue grouped by gate type:
   - **Care plan nutrition reviews** (24h SLA)
   - **SOAP notes pending signature** (48h SLA)
   - **Lab results flagged** (varies; meal-relevant lab changes 8h)
   - **Recipe nutritional validation** (72h SLA)
   - **Meal match exceptions** (8h SLA — patients with no valid recipe match)
3. Center pane: caseload overview — patients RDN is assigned to, sortable by last-activity / risk-tier / next-MNT-visit
4. Right pane: empty state — "Pick a queue item to review"
**Outcome:** RDN sees the clinical day at a glance.

#### PR-SHELL-02: Review care plan nutrition section
**Precondition:** Care plan nutrition section is in the queue.
**Trigger:** RDN clicks the queue item.
**Flow:**
1. Left pane: item active
2. Center pane: patient record viewer with **focus on nutrition section** — current care plan nutrition (if any), agent's drafted update, biomarker trends (HbA1c, lipid panel, weight, nutritional labs), dietary restrictions + preferences, meal delivery history, satisfaction ratings
3. Right pane: thread for this care plan — agent actions related to nutrition (meal-matching exceptions, lab flags, RDN draft generation), BHN + coordinator notes visible as summaries, the **nutrition-section approval card** with: agent recommendation, NCP terminology, ICD-10 mapping, downstream effects
**Outcome:** RDN has full clinical context to approve, edit, or reject.

#### PR-SHELL-03: Sign SOAP note after MNT visit
**Precondition:** RDN completed an MNT visit; agent drafted the SOAP note.
**Trigger:** RDN clicks SOAP-note item in queue.
**Flow:**
1. Center pane: SOAP note draft (Subjective / Objective / Assessment / Plan) with editable sections + visit billing context (referral order on file? — agent surfaces a warning if not)
2. Right pane: visit thread — agent's draft generation events, the **SOAP-signature approval card** with NCP-terminology preview + ICD-10 mapping + signature button
3. RDN edits inline if needed → taps Sign → digital signature applied + visit closed for billing
**Outcome:** Visit documented + billing-ready.

#### PR-SHELL-04: Review meal-match exception
**Precondition:** Agent flagged a patient with no valid recipe match (Domain 3 exception).
**Trigger:** RDN opens the meal-match exception in queue.
**Flow:**
1. Center pane: patient's dietary constraints + the recipes the agent tried + why each failed
2. Right pane: the agent's tool calls (recipe queries, constraint checks) + an action card: "Add new recipe / Modify constraints / Consult patient"
3. RDN consults, decides path, logs decision
**Outcome:** Domain 3 exception resolved before patient meal delivery is delayed.

#### PR-SHELL-05: Direct agent via thread
**Precondition:** RDN has a record open.
**Trigger:** RDN types in the thread input.
**Flow:**
1. RDN types: "Pull last 6 months HbA1c trend" or "Check if patient has gluten intolerance flagged"
2. Agent runs the request; tool call + result render in thread
**Outcome:** RDN gets clinical context fast.

### Constraints (provider-specific)

- **Clinical accountability:** RDN signature is a hard gate; the system records signature timestamp + signer identity in the audit log
- **Billing prerequisites:** every MNT visit requires a physician referral order on file; agent surfaces warning if absent; RDN must not sign without resolving
- **Medicare MNT cap:** 3 initial (97802) + 2 follow-up (97803/G0271) per year; agent tracks visit count and warns near cap
- **Payer enrollment:** RDN must be enrolled with patient's payer at time of service; scheduling system blocks booking if enrollment is inactive
- **NCP terminology in clinical notes; ICD-10 codes on claims** — both fields, agent populates both, RDN reviews NCP, confirms ICD-10 mapping
- **HIPAA:** full PHI access for the RDN's caseload; tool calls in thread still show field names + summaries (defense in depth, not just minimization)
- **Performance:** clinical queue ≤2s for ~50 items; record viewer with biomarker chart ≤2s; thread ≤1s
- EN-only at v1

### Constraints inherited from universal shell

See `_shared/design/universal-shell-use-cases.md` §Phase 1 Constraints.

---

## Phase 2: Functional Specification

### Provider-specific functions

| Function | Notes |
|---|---|
| `loadClinicalQueue(rdnId)` | groups by gate type; sorts by SLA |
| `loadPatientRecord(patientId, focusSection?)` | focus on a section (nutrition, biomarkers, etc.) |
| `loadCarePlanNutrition(carePlanId)` | nutrition section + agent draft |
| `submitNutritionApproval(cardId, decision, edits?)` | logs to thread, transitions care plan, resumes coordinator's full-plan approval gate |
| `signSOAPNote(noteId, signature)` | applies digital signature; closes visit for billing |
| `loadBiomarkerTrends(patientId)` | HbA1c, lipid, weight, nutritional labs over time |
| `directAgent(threadId, text)` | adds human_message; dispatches agent task |
| `reassignToBHN(itemId, note?)` | for behavioral-health subset (PHQ-9 ≥ 10, etc.) |

### Thread message-type allowlist (provider)

Provider sees the full clinical message set:
- `system`
- `agent_tool_call` / `agent_tool_result`
- `approval_request` (clinical-decision variant — nutrition approval, SOAP signature)
- `approval_response` (collapsed summary with signature timestamp + actor)
- `human_message` (RDN, BHN summaries, coordinator notes)
- `notification`
- `status_change`

Provider's thread shows BHN + coordinator messages **as summaries**, not full conversational threads — keeps attention on the clinical action.

### Business rules (provider)

- Care plan **full approval** is coordinator-owned; RDN signs the nutrition section; coordinator approves the plan after RDN (and BHN if PHQ-9 ≥ 10)
- RDN cannot approve the behavioral-health section; reassign to BHN
- RDN cannot override a PHQ-9 Q9 crisis flag — crisis protocol is BHN-owned
- SOAP note signature requires referral order on file; agent warning + RDN gate
- Biomarker trend chart is meal-relevant only at this layer (HbA1c, lipid panel, weight, nutritional labs); full lab panels live in EHR

---

## Phase 3: Information Architecture

### Provider screen inventory

| Screen ID | Name | Purpose | Primary actions |
|---|---|---|---|
| PR-SHELL | Provider three-pane shell | Persistent layout | pane resize, item select |
| PR-LEFT | Clinical queue + secondary nav | Gate-type-grouped queue + Patients / Recipes / Settings | click item, filter |
| PR-CENTER-CASELOAD | Caseload overview | Patients sortable by activity / risk / visit | sort, click |
| PR-CENTER-RECORD | Patient record (clinical) | Patient record with nutrition focus + biomarker trends | inline edit, sign |
| PR-CENTER-CAREPLAN | Care plan nutrition section | Nutrition section + agent draft | edit, approve |
| PR-CENTER-SOAP | SOAP note draft | Subjective / Objective / Assessment / Plan + signature | edit, sign |
| PR-CENTER-RECIPES | Recipe nutritional validation | Recipe + nutritional values + approval | approve, request changes |
| PR-RIGHT-THREAD | Clinical activity thread + approvals | Agent activity + approval cards | approve, sign, type |

### Navigation placement

- **Left pane:** clinical queue (default top) + secondary nav (Patients caseload, Recipes, Settings, user menu)
- **Center pane:** loads based on left selection or secondary-nav choice
- **Right pane:** thread for whatever's open in center; empty when center is a list

### Screen flows

```
Open app → PR-LEFT (queue rendered) + PR-CENTER-CASELOAD + PR-RIGHT-THREAD (empty)

Click "Care plan nutrition review" → PR-LEFT (item active) + PR-CENTER-CAREPLAN + PR-RIGHT-THREAD (loaded with approval card)

Approve nutrition section → PR-LEFT (item removed) + transition logged → coordinator's full-plan approval card now appears in coordinator's queue

Click "SOAP note pending signature" → PR-LEFT (active) + PR-CENTER-SOAP + PR-RIGHT-THREAD (with signature card)

Sign SOAP → PR-LEFT (item removed) + visit closed for billing
```

### Content priority per pane

**PR-LEFT (clinical queue):**
1. Cena logo header
2. Care plan nutrition reviews (count, items)
3. SOAP notes pending signature (count, items)
4. Lab results flagged (count, items)
5. Recipe nutritional validation (count, items)
6. Meal match exceptions (count, items)
7. Per-item: patient name, gate type, time-in-queue + SLA chip
8. Secondary nav: Patients (caseload), Recipes, Settings
9. User menu

**PR-CENTER-RECORD (patient record, clinical):**
1. Patient identity bar (name, DOB, MRN, contact — Lora display)
2. Status + risk markers
3. Nutrition section of care plan (or focus section based on entry)
4. Biomarker trends — HbA1c, lipid panel, weight, nutritional labs (line charts; no pie/donut per Tufte)
5. Dietary restrictions + preferences
6. Meal delivery history + satisfaction
7. Clinical note history (link out)

**PR-RIGHT-THREAD (clinical thread + approvals):**
1. Active **clinical-decision approval card** (nutrition approval / SOAP signature / recipe validation) — the hero
2. Recent thread events (agent tool calls + results)
3. BHN + coordinator messages **as summaries** (not full conversation)
4. Thread input (clinical-direction queries)

### Per-app minimum (Gate 1 G1.2)

- **Patient queue** grouped by clinical gate type (nutrition reviews / SOAP signatures / lab flags / recipe validations / meal-match exceptions)
- **One patient record:** center pane renders a clinical patient record with nutrition focus + biomarker trends + agent's drafted nutrition section
- **Clinical action thread:** right pane renders the clinical thread including a **nutrition-section approval card** with NCP terminology, ICD-10 mapping, downstream effects, signature/approve action

---

## Component-gap pointer

See `apps/_shared/design/shell-component-gaps.md`. Provider-specific gaps:
- **Clinical-decision approval card variant** — `thread-approval-card` shipped with `.is-urgent` / `.is-warning` / `.is-historical` variants; needs a clinical variant carrying NCP terminology + ICD-10 mapping + signature affordance. Tier 1 promote (recurring across nutrition / SOAP / recipe).
- **Biomarker trend chart** — `trend-chart` (agentic) covers the container; per-metric line chart wired to Chart.js with HAVEN.* defaults
- **Patient record (clinical)** — `clinical-patient-card`, `clinical-metric-card`, `clinical-medication-row`, `clinical-nutrition-list`, `clinical-timeline` shipped; composition is novel (clinical record viewer with nutrition focus); inline carve-out acceptable until 2nd consumer
- **Caseload list** — `data-table` + `clinical-patient-row` cover

---

## Open questions for Aaron at Gate 2

1. **Restoration timing:** Stage 5 (build) requires provider app restored from `archive/inactive-apps/provider/`. Same question as kitchen — restore as part of pipeline run, or prerequisite gate before scheduling build?
2. **Clinical-decision approval card:** does this become a new PL primitive (Tier 1, 4-expert panel review) or a `thread-approval-card` variant via a new modifier class (`.is-clinical`)? Recommend variant — same anatomy, different content priority. Confirm.
3. **BHN scope at v1:** the provider app serves RDN at v1; BHN is a future expansion. Confirm BHN UI is deferred (different clinical gates: PHQ-9 review, safety plans, crisis protocol).
4. **Names — Soto + Morales + Director of Clinical Ops:** memory says these are the planned clinical hires; confirm with Vanessa before external citation. For shell-design dummy data, recommend "Dr. Soto" as the v1 RDN persona placeholder pending confirmation.
