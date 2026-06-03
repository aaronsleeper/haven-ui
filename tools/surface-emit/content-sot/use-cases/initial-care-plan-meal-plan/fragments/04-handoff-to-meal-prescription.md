---
fragment_id: 04-handoff-to-meal-prescription
type: hand-off
x_cena_actor: system
x_cena_actor_role: cena-platform
x_cena_watches: registered-dietitian
receiving_actor:
  role: meal-prescription-workflow (downstream Cena workflow)
  organization: Cena platform (internal hand-off, not cross-organization)
  identity_resolution: downstream workflow defined outside RD SoP scope — contract not yet authored in this asset family
x_cena_uncertainty: deferred
handoff:
  package_contents:
    - activated combined-care-plan-and-meal-plan artifact (versioned)
    - participant identifier
    - meal-prescription parameters (extracted from the combined artifact — exact schema deferred to downstream workflow spec)
    - RDN attestation record (decision, rationale, signed_at, signed_by)
  transport: internal Cena platform event — synchronous trigger on artifact activation
  acknowledgment_required: yes (synchronous — downstream workflow accepts the artifact and confirms)
  ack_sla: immediate
  on_ack_timeout:
    action: alert RDN; combined artifact remains activated but meal-prescription generation is blocked
    target_role: registered-dietitian
gaps:
  - Downstream meal-prescription workflow contract is not authored in the RD SoP scope — deferred to downstream workflow asset family
  - Meal-prescription parameter schema (what subset of the combined artifact drives prescription generation) — pending downstream workflow spec
  - Behavior when downstream workflow rejects the activated artifact (e.g., missing required fields detected late) — pending Marrero + platform spec
outgoing_edges:
  - to: out-of-scope-meal-prescription-workflow
    type: handoff-acknowledged
    condition: ack received synchronously
    label: ack → meal prescription generates
  - to: 03-attestation-rdn-approval
    type: handoff-timeout
    condition: ack not received
    label: rejection → RDN paged
---

# Hand-off: Combined artifact activates → meal prescription generates

On RDN approval (fragment 03), the combined care-plan-and-meal-plan artifact activates and the Cena platform raises a synchronous hand-off event to the downstream meal-prescription workflow. The downstream workflow accepts the artifact and generates the participant's meal prescription automatically.

This is an **internal Cena hand-off** — not a cross-organization hand-off. The receiving actor is another Cena workflow, not a partner system. The hand-off contract is therefore lighter than fragment 04 in the PHQ9 escalation use case (which crosses to BHN / UConn); the integrity discipline is the same — typed package, acknowledgment required, fallback on rejection.

## Package contents

- **Activated combined-care-plan-and-meal-plan artifact** — versioned, post-RDN-approval
- **Participant identifier** — for downstream workflow correlation
- **Meal-prescription parameters** — the subset of the combined artifact that drives prescription generation (exact schema deferred to downstream workflow spec)
- **RDN attestation record** — the signed sign-off from fragment 03 with decision, rationale, timestamp, and attestor identity (chain-of-custody continuity)

## Acknowledgment contract

- Downstream meal-prescription workflow acknowledges synchronously on receipt
- If the downstream workflow rejects the activated artifact (e.g., missing required fields detected late, schema mismatch), the rejection pages the RDN; the combined artifact remains activated but meal-prescription generation is blocked until the RDN resolves the issue (typically via fragment 02 re-author + fragment 03 re-approval)
- Acknowledgment generates an audit-trail event that closes the chain-of-custody for this use case

## Open questions

- **Downstream workflow contract** — what the meal-prescription workflow expects from the activated artifact is not authored in the RD SoP scope. The downstream workflow is a separate asset family and its spec is deferred.
- **Rejection-handling specifics** — what counts as a rejectable issue once the artifact is activated (vs. catchable upstream at fragment 03) — pending Marrero + platform spec.

## Who watches

The Registered Dietitian remains supervisor-of-record for this hand-off. If the downstream workflow rejects the activated artifact, the RDN receives the page and re-enters the authoring loop (fragment 02 → fragment 03).

## Authoring note (Cena-internal)

This fragment exercises:

- `type: hand-off` — Cena-novel spec primitive (internal cross-workflow transfer, not cross-organization)
- `receiving_actor` block — names the receiving workflow + organization explicitly; identity resolution deferred to downstream workflow asset family
- `x_cena_uncertainty: deferred` — the receiving workflow's contract is intentionally deferred (out of RD SoP scope), distinct from `tbd` (pending external input) or `gap` (structural absence in current scope)
- `on_ack_timeout` — typed fallback path different from the normal "ack received" edge
