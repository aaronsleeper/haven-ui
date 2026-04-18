# Thread Engine Spec

> Detailed technical design for thread-as-audit-log: storage, real-time sync,
> message visibility enforcement, approval gate mechanics, and immutability
> guarantees. The thread is simultaneously the UI, the audit log, and the
> compliance record — this spec defines how that works at runtime.
>
> **Created:** 2026-04-10
> **Phase:** 2.4
> **Key inputs:** `agent-framework.md` (thread model, coordination patterns),
> `data-model.md` (Thread/Message entities), `data-model-validation.md` (ME-01 QueueItem),
> `agent-implementation-spec.md` (Pattern 3 human gate, state persistence)

---

## 1. Storage architecture

### Decision: Firestore for threads, Postgres for queryable state

The agent-implementation-spec established this split (Section 4, state persistence
table). This section formalizes the boundary and the sync mechanism.

| Data | Store | Why |
|---|---|---|
| Thread messages (full payload) | Firestore | Real-time sync to UI via Firestore listeners. Flexible schema accommodates 6 message content types without migrations. Offline support for mobile (Provider/Patient apps). |
| Thread metadata (id, type, status, subject_id, timestamps) | Postgres (denormalized) | Queryable for reporting, SLA tracking, queue aggregation. Joins with Patient, CarePlan, Claim entities. |
| QueueItem records | Postgres | Primary work surface for QueueManager. SLA deadline queries, priority scoring, cross-tenant admin views — all need SQL. |
| AuditEvent records | Postgres (append-only, separate tablespace) | Compliance queries, retention enforcement, immutability guarantees via DB-level constraints. |

### Firestore document structure

```
threads/{thread_id}
  ├── type: string
  ├── subject_id: string
  ├── subject_type: string
  ├── tenant_id: string
  ├── status: string
  ├── created_at: timestamp
  ├── updated_at: timestamp
  └── messages/{message_id}
        ├── timestamp: timestamp
        ├── actor: { type, id, display_name, role }
        ├── content_type: string
        ├── payload: map           // type-specific
        ├── visible_to: string[]   // role list
        ├── phi_present: boolean
        ├── requires_approval: boolean
        ├── approved_by: string | null
        ├── approved_at: timestamp | null
        └── _audit_hash: string    // SHA-256 of payload — see immutability
```

**Why subcollection for messages?** Threads can accumulate hundreds of messages
over a patient's lifecycle. Subcollections allow paginated loading, Firestore
security rules per message, and independent real-time listeners on the message
stream without loading the full thread document.

### Postgres denormalized tables

```sql
-- Thread metadata mirror (synced from Firestore)
CREATE TABLE thread_metadata (
  id UUID PRIMARY KEY,
  tenant_id UUID NOT NULL,
  type TEXT NOT NULL,
  subject_id UUID NOT NULL,
  subject_type TEXT NOT NULL,
  status TEXT NOT NULL,
  message_count INT DEFAULT 0,
  last_message_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);

-- Approval state mirror (for SLA queries)
CREATE TABLE approval_state (
  id UUID PRIMARY KEY,
  thread_id UUID NOT NULL REFERENCES thread_metadata(id),
  tenant_id UUID NOT NULL,
  message_id UUID NOT NULL,          -- the approval_request message
  assigned_to_role TEXT NOT NULL,
  assigned_to_user UUID,
  sla_deadline TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  completed_by UUID,
  completed_at TIMESTAMPTZ,
  outcome TEXT,
  created_at TIMESTAMPTZ NOT NULL
);

-- Both tables use tenant_id RLS per AD-04
ALTER TABLE thread_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE approval_state ENABLE ROW LEVEL SECURITY;
```

### Sync mechanism: Firestore → Postgres

**Direction:** Firestore is the write-primary store for thread content. Postgres
mirrors are updated via Cloud Functions triggered by Firestore `onWrite` events.

```
Message written to Firestore
  → Cloud Function (onWrite trigger)
    → Update thread_metadata (message_count, last_message_at, status)
    → If content_type == approval_request: INSERT approval_state
    → If content_type == approval_response: UPDATE approval_state
    → INSERT audit_event (always, for every message)
```

**Consistency model:** Eventually consistent, typically <500ms. Acceptable because:
- Real-time UI reads from Firestore directly (immediate)
- Postgres queries are for dashboards, reports, SLA checks (tolerates seconds of lag)
- QueueManager reads from Postgres on a polling cadence, not real-time

**Failure handling:** Cloud Function retries on transient failure (Pub/Sub
dead-letter after 5 retries). If sync fails persistently, the thread message
exists in Firestore (UI shows it) but Postgres is stale — QueueManager may
miss a new approval request. Monitoring alert fires if sync lag exceeds 5 seconds.

### AD-04 swappability

If AD-04 reverses to per-tenant databases, Postgres tables above move to
per-tenant instances. Firestore stays shared (tenant isolation via security rules
on `tenant_id`). The sync Cloud Function resolves the target Postgres instance
from `tenant_id` via the data access layer — no architecture change needed.

---

## 2. Real-time sync mechanics

### Client-side: Firestore listeners

Each app surface maintains a real-time listener on the relevant thread:

```typescript
// Provider app — right panel thread view
const unsubscribe = onSnapshot(
  query(
    collection(db, 'threads', threadId, 'messages'),
    orderBy('timestamp', 'asc')
  ),
  (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === 'added') {
        // New message — append to timeline, check visibility
        renderMessage(change.doc.data(), currentUserRole);
      }
    });
  }
);
```

**Key behaviors:**
- Listener is scoped to a single thread's message subcollection
- Messages arrive in real-time as agents write them — the coordinator sees agent
  actions as they happen, not after the fact
- `visible_to` filtering happens client-side (Firestore security rules enforce
  server-side — see Section 3)
- Offline support: Firestore SDK caches locally, syncs when connection restores.
  For Provider app (often on hospital WiFi), this prevents data loss during
  connectivity drops

### Agent-side: writing messages

Agents write messages via a `ThreadWriter` service that enforces structure:

```
ThreadWriter.write({
  thread_id,
  actor: { type: 'agent', id: agent_id, display_name },
  content_type,
  payload,
  visible_to,
  phi_present,
  requires_approval
})
```

**ThreadWriter responsibilities:**
1. Validate payload against content_type schema (reject malformed messages)
2. Compute `_audit_hash` (SHA-256 of canonical payload JSON)
3. Set `timestamp` server-side (Firestore server timestamp — prevents clock skew)
4. Write to Firestore
5. If `requires_approval`: also create the QueueItem (see Section 4)

**Ordering guarantee:** Firestore server timestamps ensure consistent ordering
within a thread. Cross-thread ordering is not guaranteed and not needed — each
thread is its own timeline.

### Thread status transitions

```
active → awaiting_human    (when approval_request message written)
awaiting_human → active    (when approval_response received)
active → completed         (when orchestrator closes the thread)
active → failed            (when unrecoverable error, human escalation)
```

Status transitions are written as `system_event` messages in the thread itself —
the thread records its own lifecycle changes.

---

## 3. Message visibility enforcement

### Two-layer enforcement

**Layer 1: Firestore Security Rules (server-side)**

```javascript
match /threads/{threadId}/messages/{messageId} {
  allow read: if
    // User's role is in the message's visible_to list
    request.auth.token.role in resource.data.visible_to
    // OR user is admin (can see all non-PHI messages)
    || request.auth.token.role == 'admin'
    // OR message is a system_event (visible to all authenticated users in tenant)
    || resource.data.content_type == 'system_event';

  // PHI messages: even if visible_to matches, phi_present messages
  // are never returned with raw payload — a Cloud Function strips
  // PHI fields before the client receives them
  allow read: if resource.data.phi_present == true
    && request.auth.token.role in resource.data.visible_to
    // Payload is pre-stripped by a Firestore Extension or Cloud Function
    // that replaces PHI fields with "[PHI — access via audit log]"
}
```

**Layer 2: Client-side rendering**

Even if a message passes security rules, the client renders it appropriately:
- `phi_present: true` messages show a redacted summary, not raw payload
- `approval_request` messages render as interactive cards only for the assigned role
- `tool_call` / `tool_result` messages render as collapsed "agent action" entries
  for non-technical roles, expanded for admin/engineering

### Visibility matrix (from agent-framework.md, formalized)

| Content type | Provider | Coordinator | Kitchen | Patient | Finance | Admin | Audit |
|---|---|---|---|---|---|---|---|
| Clinical notes | Yes | Yes | No | No | No | Yes | Yes |
| Approval requests | Assigned role only | Assigned role only | Assigned role only | No | Assigned role only | Yes | Yes |
| System events | No | Yes | No | No | No | Yes | Yes |
| Delivery status | No | Yes | Yes | Yes | No | Yes | Yes |
| Billing details | No | No | No | No | Yes | Yes | Yes |
| PHI in tool calls | No | No | No | No | No | No | Yes (raw) |
| Agent tool calls | Collapsed | Collapsed | No | No | No | Expanded | Yes |
| Agent tool results | Collapsed | Collapsed | No | No | No | Expanded | Yes |

**"Audit" column:** AuditMonitor and compliance queries see all messages in raw
form. This is a backend read path, never a UI render path. Implemented via a
service account with elevated Firestore permissions, not user-context reads.

### PHI handling in messages

Messages flagged `phi_present: true` follow a two-copy pattern:

1. **Firestore copy:** Payload has PHI fields replaced with `"[REDACTED]"` at
   write time. The ThreadWriter never stores raw PHI in Firestore.
2. **AuditEvent copy:** The full payload (with PHI) is written to the Postgres
   AuditEvent table, encrypted at the column level. Only accessible via the
   audit query path with elevated permissions.

This means: the thread UI never renders PHI from tool call payloads. A provider
sees "Patient assessment retrieved" but not the raw SSN or sensitive fields that
the agent read. The audit trail has the full record for compliance queries.

---

## 4. Approval gate mechanics

### Flow: from agent proposal to human decision

This is Pattern 3 from agent-framework.md, fully specified.

```
Step 1: Orchestrator determines approval is needed
  ├── Tool definition has approval_required: always
  │   OR approval_required: conditional AND condition evaluates true
  └── Orchestrator does NOT execute the tool yet

Step 2: Orchestrator writes to thread
  ├── approval_request message (visible to assigned role)
  │   payload: {
  │     tool_name,
  │     tool_args,
  │     agent_recommendation: string,   // what the agent suggests
  │     context: object,                // structured data for the approval card
  │     action_options: ["approve", "reject", "modify"]
  │   }
  └── ThreadWriter also creates QueueItem in Postgres (see below)

Step 3: QueueItem created
  ├── QueueItem {
  │     thread_id, tenant_id,
  │     item_type: derived from tool category,
  │     priority_class: derived from tool urgency + patient risk tier,
  │     headline: agent-generated summary,
  │     context: same as approval_request payload,
  │     agent_recommendation,
  │     action_options,
  │     assigned_to_role: from tool definition,
  │     sla_deadline: now + SLA duration from tool definition
  │   }
  └── QueueManager picks it up on next poll cycle

Step 4: Orchestrator suspends
  ├── Persists state: { suspended: true, waiting_on: message_id, thread_id }
  ├── State persisted in Postgres (orchestrator state table)
  └── No active compute — the orchestrator is not polling or waiting

Step 5: Human acts
  ├── Sees QueueItem in their review queue (left sidebar)
  ├── Taps item → loads thread in center panel
  ├── Reviews approval_request in thread timeline (right panel)
  └── Responds: approve | reject | modify (with optional edits/notes)

Step 6: approval_response message written to thread
  ├── payload: {
  │     decision: "approve" | "reject" | "modify",
  │     edits: object | null,
  │     note: string | null,
  │     decided_by: user_id,
  │     decided_at: timestamp
  │   }
  └── QueueItem status updated to completed

Step 7: Orchestrator resumes
  ├── Firestore onWrite → Cloud Function → Pub/Sub event
  │   Event: { type: "approval_response", thread_id, message_id, decision }
  ├── Orchestrator's Pub/Sub subscription receives the event
  ├── Orchestrator loads its suspended state from Postgres
  ├── If approved: execute the staged tool call
  ├── If approved with edits: execute with modified args
  ├── If rejected: branch to rejection handler (defined per workflow step)
  └── Write execution result to thread as tool_result message
```

### Suspension and resume internals

**Why Pub/Sub, not polling?** The orchestrator is a Cloud Run service. If it
polled Firestore waiting for approval, it would consume compute for hours or days
(care plan reviews have 24h SLA). Instead:

1. Orchestrator writes its suspended state to Postgres and exits
2. Cloud Function on Firestore `onWrite` detects `approval_response` messages
3. Publishes a resume event to the orchestrator's Pub/Sub subscription
4. Cloud Run service scales up to handle the resume event
5. Loads suspended state, processes approval, continues workflow

**Cold start concern:** Cloud Run cold start adds 1-5s latency to resume. This
is acceptable — the human just finished a decision, adding seconds is invisible.

**Concurrent approvals:** An orchestrator may have multiple suspended gates
(e.g., fan-out Pattern 2 followed by approval). Each gate is a separate
`message_id` in the suspended state map. Resume events are keyed by `message_id`,
so they're independent.

### SLA enforcement

QueueManager runs on a scheduled cadence (Cloud Scheduler → Cloud Run, every 5 min):

```
For each QueueItem WHERE status = 'pending' AND sla_deadline < now():
  1. Determine escalation tier:
     - 50% of SLA elapsed: reminder notification
     - 100% elapsed: escalate to supervisor role
     - 150% elapsed: escalate to director role + compliance alert
  2. Write escalation_event message to thread
  3. Update QueueItem: escalated_to, escalation_count++
  4. Fire notification via CommunicationAgent (SMS for P1, push for P2+)
```

### Hardcoded gates

Five approval gates cannot be configured away (from agent-framework.md):

| Gate | Tool | Approval role | SLA | Rejection behavior |
|---|---|---|---|---|
| Care plan finalization | `finalize_care_plan` | RDN | 24h | Return to draft, re-enter review cycle |
| FHIR document transmission | `transmit_fhir_document` | Coordinator | 4h | Hold transmission, notify partner of delay |
| Claim submission (above threshold) | `submit_claim` | Finance | 24h | Hold claim, flag for manual review |
| Crisis protocol | `trigger_crisis_protocol` | Any on-call | Immediate | Cannot be rejected — acknowledge only |
| Patient discharge | `discharge_patient` | Coordinator | 24h | Cancel discharge, return patient to active |

**Implementation:** These are enforced at the tool registry level. The tool
definition's `approval_required` field is set to `always` and the enforcement
is in the tool execution layer, not the orchestrator. Even if an orchestrator
bug skips the approval gate, the tool itself refuses to execute without a
valid `approved_by` on the thread.

---

## 5. Audit immutability guarantees

### Principle: messages are append-only

Once a message is written to a thread, it cannot be modified or deleted. This is
the compliance backbone — every regulatory question about "what happened" has a
single, tamper-evident answer.

### Three layers of enforcement

**Layer 1: Firestore Security Rules**

```javascript
match /threads/{threadId}/messages/{messageId} {
  // Messages can be created but never updated or deleted
  allow create: if request.auth != null
    && request.resource.data.tenant_id == request.auth.token.tenant_id;
  allow update: false;
  allow delete: false;
}
```

Exception: `approved_by` and `approved_at` fields on `approval_request` messages
are updated exactly once when the approval response arrives. This is the only
permitted write-after-create, enforced by:

```javascript
allow update: if
  // Only approval fields can change
  request.resource.data.diff(resource.data).affectedKeys()
    .hasOnly(['approved_by', 'approved_at'])
  // And they can only be set once (from null to a value)
  && resource.data.approved_by == null
  && request.resource.data.approved_by != null;
```

**Layer 2: Audit hash chain**

Each message includes an `_audit_hash` (SHA-256 of its canonical payload). The
AuditEvent record in Postgres stores the same hash. Compliance audits can verify
that the Firestore message matches the AuditEvent record — any post-write
tampering would break the hash match.

For stronger guarantees (future): hash chain where each message's hash includes
the previous message's hash, creating a tamper-evident linked list. Not needed
at launch but the `_audit_hash` field is the foundation.

**Layer 3: Postgres AuditEvent table constraints**

```sql
-- AuditEvent table: no UPDATE, no DELETE at the database level
REVOKE UPDATE, DELETE ON audit_event FROM app_role;
-- Only the app service account can INSERT
GRANT INSERT ON audit_event TO app_role;
-- Even DBAs use a separate audit_admin role with logging
```

**Retention:** HIPAA requires 6-year retention. Shared savings reconciliation
may reference records for longer. AuditEvent records are never purged in the
application lifecycle — archival to cold storage (GCS) after 2 years, with
the hash chain preserved for verification.

### Corrections and amendments

Clinical corrections (e.g., "the dosage should have been 500mg, not 5000mg")
do not modify the original message. Instead:

1. A new `amendment` message is written to the thread
2. The amendment references the original message ID
3. The amendment includes the correction and the reason
4. Both messages remain — the original (incorrect) and the correction are part
   of the record

This matches clinical documentation standards (amendments, not overwrites) and
preserves the audit trail.

---

## 6. Thread lifecycle patterns

### Per-thread-type lifecycle

| Thread type | Created when | Completed when | Typical message count | Lifetime |
|---|---|---|---|---|
| `patient_workflow` | Referral received | Patient discharged or ineligible | 50-200 | Weeks to months |
| `clinical_visit` | Visit scheduled | Note signed + claim submitted | 10-30 | Hours to days |
| `meal_cycle` | Weekly cycle starts | All deliveries confirmed + feedback collected | 20-50 | 1 week |
| `claim` | Claim generated | Paid or written off | 5-15 | Days to months |
| `partner_report` | Report cycle starts | Report delivered + acknowledged | 5-10 | Days |
| `alert` | Alert triggered | Alert resolved | 3-10 | Hours to days |
| `crisis` | Crisis protocol triggered | Crisis resolved + documented | 5-20 | Minutes to hours |

### Thread spawning

Orchestrators spawn new threads for bounded workflows. The `patient_workflow`
thread is the long-lived parent; child threads are spawned for visits, meal
cycles, claims, etc.

```
patient_workflow thread (long-lived)
  ├── clinical_visit thread (per visit)
  ├── meal_cycle thread (per week)
  ├── claim thread (per claim)
  └── alert thread (per alert)
```

Child threads reference the parent via `subject_id` (patient_id). There is no
formal parent-child thread relationship in the schema — the connection is through
the shared `subject_id`. This is intentional: child threads must be queryable
independently (e.g., "show me all claim threads for this payer") without walking
a hierarchy.

### Thread archival

Completed threads are never deleted (soft deletes, per data model design
decisions). After 90 days of completion:
- Firestore messages are exported to GCS (JSON, preserving hashes)
- Firestore documents are deleted to manage storage costs
- Postgres metadata remains (for queries and joins)
- AuditEvent records remain permanently

If a historical thread needs to be viewed, the UI fetches from GCS on demand
(cold read, acceptable latency for historical review).

---

## 7. QueueItem integration

ME-01 from data-model-validation established QueueItem as a first-class entity.
Here's how it integrates with the thread engine.

### QueueItem ↔ Thread relationship

Every QueueItem is created from an `approval_request` message in a thread.
The QueueItem is the human-facing work surface; the thread message is the
audit record. They are linked by `thread_id` + `message_id`.

```
Thread (Firestore)                    QueueItem (Postgres)
├── approval_request message    →     { thread_id, message_id,
│   { tool_name, context,              headline, priority_class,
│     agent_recommendation }            agent_recommendation,
│                                       sla_deadline, status }
└── approval_response message   →     { completed_by, completed_at,
    { decision, edits, note }           outcome }
```

**Who creates the QueueItem?** The ThreadWriter, at the same time it writes
the `approval_request` message. This is a single logical operation (Firestore
write + Postgres insert) — if the Postgres insert fails, the message still
exists in the thread but the QueueItem doesn't, meaning it won't appear in the
review queue. The sync Cloud Function retries the insert as a fallback.

### QueueManager aggregation

QueueManager queries Postgres to build role-specific review queues:

```sql
SELECT qi.*, tm.type as thread_type, tm.subject_id
FROM queue_item qi
JOIN thread_metadata tm ON qi.thread_id = tm.id
WHERE qi.tenant_id = :tenant_id
  AND qi.assigned_to_role = :role
  AND qi.status IN ('pending', 'in_review')
ORDER BY
  CASE qi.priority_class
    WHEN 'p1_immediate' THEN 1
    WHEN 'p2_today' THEN 2
    WHEN 'p3_standard' THEN 3
    WHEN 'p4_batch' THEN 4
  END,
  qi.sla_deadline ASC;
```

---

## 8. Performance considerations

### Message volume projections (at scale)

| Metric | Estimate | Basis |
|---|---|---|
| Active patients | 1,000 | Pilot ramp over 12 months |
| Messages per patient per week | ~50 | Across all thread types |
| New messages per day | ~7,000 | 1,000 × 50 / 7 |
| QueueItems per day | ~200 | ~3% of messages need approval |
| Firestore reads per day | ~50,000 | UI listeners + agent reads |
| Firestore writes per day | ~7,000 | Message writes |

**Firestore costs:** At 7K writes and 50K reads per day, well within free tier
during pilot. At scale (10K patients), Firestore costs are dominated by reads
from real-time listeners — optimize by loading only recent messages and
paginating history.

**Postgres costs:** Thread metadata and QueueItem tables are small (thousands of
rows). AuditEvent table grows indefinitely — partition by `tenant_id` and
`timestamp` for query performance.

### Indexing strategy

**Firestore:**
- Composite index on `messages` subcollection: `(content_type, timestamp)` — for
  filtering approval requests in a thread
- No index on `visible_to` (array-contains queries are auto-indexed)

**Postgres:**
- `thread_metadata`: index on `(tenant_id, type, status)`, `(tenant_id, subject_id)`
- `approval_state`: index on `(tenant_id, assigned_to_role, status, sla_deadline)`
- `audit_event`: partition by `(tenant_id, timestamp)`, index on `(session_id)`

---

## What this spec does NOT cover

- **Firestore security rules — full ruleset**: This spec shows the pattern; the
  complete ruleset is an implementation deliverable
- **Thread UI rendering logic**: How the Provider/Admin app renders the thread
  timeline — UX Design Lead's domain
- **CommunicationAgent notification payloads**: How SLA escalation notifications
  are formatted and delivered
- **Thread search and filtering**: Full-text search across thread messages —
  future feature, likely Algolia or Firestore extensions
- **Multi-region Firestore**: Single-region at launch (us-central1 per AD-01);
  multi-region is a scale decision

---

## Cross-references

| This spec references | Referenced doc |
|---|---|
| Thread model, visibility rules, coordination patterns, approval gating | `architecture/agent-framework.md` |
| Thread/Message entities, AuditEvent, design decisions | `architecture/data-model.md` |
| ME-01 QueueItem, field gaps | `architecture/data-model-validation.md` |
| Pattern 3 human gate, state persistence, Firestore/Postgres split | `architecture/agent-implementation-spec.md` |
| AD-01, AD-04, AD-05 | `decisions.md` |
