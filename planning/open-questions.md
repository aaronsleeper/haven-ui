# Open Questions

Unresolved decisions that block design, architecture, or implementation. Updated as answers
arrive. Questions from Vanessa's form responses will be marked answered here.

**Status legend:**
- 🔴 Open — no answer yet
- 🟡 Sent to Vanessa — awaiting response / Pending — needs input from someone other than Vanessa
- 🟢 Answered — decision recorded
- ⏸ Deferred — not blocking current phase, revisit later

---

## Blocking multiple domains

These questions affect more than one domain. Resolve these first.

| # | Question | Status | Blocks | Source |
|---|---|---|---|---|
| OQ-01 | Epic integration tier per partner (UConn, Cedars, Vanderbilt) | 🟢 Answered | Domains 2, 4, 10 | 04, 02 |
| OQ-02 | LLM provider BAA — executed or in progress? | 🟢 Answered | All AI features | 06 |
| OQ-03 | Athena Health confirmed as billing platform? | 🟢 Answered | Domain 5 architecture | 05 |
| OQ-04 | First-patient target date and forcing function | 🟢 Answered | Phase planning | 09, 08 |
| OQ-05 | Agent autonomy level at launch — conservative/moderate/aggressive | 🟢 Answered | All workflow design | agent-framework |
| OQ-06 | TriCare/DoD data handling requirements assessed? | 🟢 Answered | Domains 4, 6 | 06 |
| OQ-07 | HEDIS data model — design now or when first VBC contract requires it? | 🟡 [Proposal ready](team/proposals/OQ-07-proposal.md) — awaiting Vanessa | Domains 5, 7, 10 | 10 |
| OQ-08 | Shared savings reconciliation — who owns disputes with payer? | 🟡 [Proposal ready](team/proposals/OQ-08-proposal.md) — awaiting Vanessa | Domains 4, 5 | 04 |

**OQ-01 decision:** Partners vary — assess each one. UConn does not want integration for phase 1. Cedars will want Epic integration. Vanderbilt uses Athena, not Epic.

**OQ-02 decision:** BAA not yet executed — in progress. Andrey is aware and has discussed; Aaron will confirm status with him.

**OQ-03 decision:** Athena confirmed for billing and practice management.

**OQ-04 decision:** Soft target — nothing binding. UConn pilot starts Q2 2026. Runway will be determined after contract negotiation, assuming 8–12 months.

**OQ-05 decision:** Moderate autonomy — admin/logistics tasks autonomous; all clinical workflows require a human in the loop.

**OQ-06 decision:** Not assessed — TriCare is early stage. Defer until TriCare engagement matures.

---

## Domain 1 — Patient Operations

| # | Question | Status | Source |
|---|---|---|---|
| OQ-09 | Care plan approval when RDN is unavailable — hard gate or workaround? | 🟢 Answered | 01 |
| OQ-10 | Patient unreachable after 3 coordinator attempts — what obligation? | 🟡 Pending | 01 |
| OQ-11 | While care plan is under revision, does current meal prescription keep running? | 🟢 Answered | 01 |

**OQ-09 decision:** Hard gate — patient waits for RDN approval. No workaround.

**OQ-10 decision:** Not yet determined — will be decided by the client/partner. Status changed to Pending.

**OQ-11 decision:** Yes — current prescription continues until new plan is approved. Flag this explicitly in the workflow so all roles are aware.

---

## Domain 2 — Clinical Care

| # | Question | Status | Source |
|---|---|---|---|
| OQ-12 | RDN credentialing scope — telehealth only (Cena Health creds) or in-person at partner facilities (dual creds needed)? | 🟢 Answered | 02 |
| OQ-13 | Who owns PHQ-9/GAD-7 billing — BHN independently, bundled into RDN visit, under PCP NPI, or PMPM? | 🟢 Answered | 02 |
| OQ-14 | Medicare physician referral order required for MNT billing — does current intake workflow capture this? | 🟢 Answered | 02, 05 |
| OQ-15 | Audio-only telehealth billing rules — applicable to our patient population? | 🟢 Answered | 02 |
| OQ-16 | RDN documentation format — NCP/eNCPT or SOAP? (These must not be conflated in the data model) | 🟡 Pending | 02 |

**OQ-12 decision:** Cena Health credentialing only — covers all telehealth and on-site visits. No dual credentialing at partner facilities.

**OQ-13 decision:** BHN bills independently for PHQ-9/GAD-7.

**OQ-14 decision:** Referral document serves as physician order — will validate this interpretation before go-live.

**OQ-15 decision:** Yes — support audio-only telehealth billing from day one. Many patients lack video capability.

**OQ-16 decision:** Pending — director of clinical ops will decide. Aaron leans toward SOAP. Status changed to Pending.

---

## Domain 3 — Meal Operations

| # | Question | Status | Source |
|---|---|---|---|
| OQ-17 | Fresh or frozen delivery? (Determines entire logistics architecture) | 🟢 Answered | 03 |
| OQ-18 | Who delivers — kitchen/Cena staff or third-party logistics? (Determines PHI exposure on packing slips) | 🟢 Answered | 03 |
| OQ-19 | Recipe catalog ownership — Cena RDNs, kitchen partners, or shared? | 🟢 Answered | 03 |
| OQ-20 | Multi-kitchen routing — if primary kitchen can't fulfill, can system reroute transparently? | 🟢 Answered | 03 |
| OQ-21 | Feedback loop latency — does a single "disliked" rating remove a recipe from a patient's rotation? | 🟢 Answered | 03 |

**OQ-17 decision:** Both fresh and frozen. Logistics architecture must support both formats.

**OQ-18 decision:** Varies by kitchen — delivery method is kitchen-dependent. PHI exposure on packing slips must account for multiple delivery models.

**OQ-19 decision:** Kitchens own their recipe catalogs; RDNs validate recipes for nutritional/clinical appropriateness.

**OQ-20 decision:** System suggests alternative kitchen, coordinator approves before rerouting. Not fully automatic.

**OQ-21 decision:** Ask the patient — distinguish "don't like the recipe" from "problem with this specific preparation/delivery." Only remove from rotation if the patient confirms they don't want it again.

---

## Domain 4 — Partner & Payer Relations

| # | Question | Status | Source |
|---|---|---|---|
| OQ-22 | Partner portal scope — self-service or push-only? | 🟢 Answered | 04 |
| OQ-23 | Research data agreement with UConn — same document as BAA or separate? | 🟢 Answered | 04, 06 |
| OQ-24 | Who is primary relationship owner per partner type (Vanessa vs. Aaron vs. future BD hire)? | ⏸ Deferred | 09 |

**OQ-22 decision:** Referral submission surface at minimum. UConn starts with push model; Cedars will likely want a self-service portal. Build the referral surface first, portal later.

**OQ-23 decision:** Separate research data use agreement — distinct from the BAA.

---

## Domain 5 — Revenue Cycle

| # | Question | Status | Source |
|---|---|---|---|
| OQ-25 | Medicare MNT visit cap (3 initial + 2 follow-up/year) — does care plan cadence account for this? | 🟡 [Proposal ready](team/proposals/OQ-25-proposal.md) — awaiting Vanessa | 05 |
| OQ-26 | Meal delivery billing path — contract-dependent or is there a CPT strategy? | 🟢 Answered | 05 |
| OQ-27 | Timely filing deadline per payer — has this been mapped? (90 days Medicaid, 365 days Medicare) | 🟡 [Proposal ready](team/proposals/OQ-27-proposal.md) — awaiting Vanessa | 05 |

**OQ-26 decision:** Contract-dependent — each payer contract defines how meals are billed. No universal CPT strategy.

---

## Domain 6 — Compliance

| # | Question | Status | Source |
|---|---|---|---|
| OQ-28 | Kitchen partners handling diagnosis-linked dietary orders — do they have BAAs? | 🟡 [Proposal ready](team/proposals/OQ-28-proposal.md) — awaiting Vanessa | 06 |
| OQ-29 | Multi-state telehealth: RDN licensed in patient's state of residence? Scheduling must block on lapsed out-of-state credentials. | 🟢 Answered | 06, 08 |

| OQ-30 | CT PDPA / CA CCPA data deletion rights vs. HIPAA 6-year retention — conflict resolution strategy? | ⏸ Deferred | 06 |

**OQ-29 decision:** Warn, don't hard block. Show a warning for lapsed/missing state licensure but allow coordinator override.
| OQ-31 | IRB re-consent process — who determines when protocol changes require re-consent? | 🟢 Answered | 06 |

**OQ-31 decision:** UConn IRB makes the call on when protocol changes require re-consent.

---

## Domain 7 — Risk Management

| # | Question | Status | Source |
|---|---|---|---|
| OQ-32 | Who owns risk score weight configuration — clinical team, engineering, or joint? | 🟢 Answered | 07 |
| OQ-33 | C-SSRS for crisis vs. PHQ-9 Q9 alone — will BHN conduct structured C-SSRS assessment during crisis protocol? | 🟡 Pending | 07 |
| OQ-34 | SDOH score decay model — how stale is too stale? At what point does the score get invalidated? | 🟢 Answered | 07 |
| OQ-35 | Attribution model for outcomes — before value-based reporting, needs formal definition | 🟢 Answered | 07, 10 |

**OQ-32 decision:** Clinical team owns risk score weight configuration. Engineering implements.

**OQ-33 decision:** Depends on BHN licensure level — needs Shenira's guidance. Status changed to Pending.

**OQ-34 decision:** Configurable per SDOH domain — clinical team sets the decay threshold for each domain.

**OQ-35 decision:** Attribution model is contract-dependent — each payer contract defines its own attribution rules.

---

## Domain 8 — Internal Operations

| # | Question | Status | Source |
|---|---|---|---|
| OQ-36 | HR platform integration — programmatic hire/terminate events or manual coordinator triggers? | 🟢 Answered | 08 |
| OQ-37 | Credentialing timeline — plan for the 60–180 day Medicaid enrollment gap? | 🟢 Answered | 08 |
| OQ-38 | Engineering on-call for P1 incidents — explicit policy before go-live | 🟡 Needs Andrey | 08 |

**OQ-36 decision:** No HR platform at launch. Handle onboarding/offboarding manually.

**OQ-37 decision:** Delay patient assignment until credentialing completes. Cena Health is becoming a fully licensed clinic — providers contract under the Cena NPI, reducing turnaround to ~4 weeks instead of 60–180 days. No provider sees patients until working under the Cena NPI.

---

## Domain 9 — Business Development

| # | Question | Status | Source |
|---|---|---|---|
| OQ-39 | Outcomes data readiness — what does Cena Health have today to cite in proposals? | 🟢 Answered | 09 |
| OQ-40 | Grant PI strategy — is UConn structured to serve as PI on federal grants? | 🟡 [Proposal ready](team/proposals/OQ-40-proposal.md) — awaiting Vanessa | 09 |
| OQ-41 | Pricing model framework — standard PMPM rates and shared savings splits, or case-by-case? | 🟡 [Proposal ready](team/proposals/OQ-41-proposal.md) — awaiting Vanessa | 09 |

**OQ-39 decision:** Combination of pilot data and published literature. Clinical validation summary is in the CenaShare drive.

---

## Domain 10 — Data & Analytics

| # | Question | Status | Source |
|---|---|---|---|
| OQ-42 | Data warehouse architecture — single DB with materialized views vs. separate warehouse | 🟢 Answered | 10 |
| OQ-43 | Research vs. clinical data tier — hard separation or row-level access controls? | 🟢 Answered | 10 |
| OQ-44 | Model governance — who can change risk scoring weights after deployment? What is the change process? | 🟢 Answered | 10, 07 |

**OQ-42 decision:** Engineering's call — Andrey and team decide the data architecture approach.

---

## Architecture

| # | Question | Status | Source |
|---|---|---|---|
| OQ-45 | Primary cloud provider — AWS or GCP? (Affects HIPAA-eligible service selection) | 🟢 Answered | 08 |
| OQ-46 | LLM provider for production — OpenAI, Anthropic, Azure, AWS Bedrock? (Affects BAA path and latency) | 🟢 Answered | 06, agent-framework |
| OQ-47 | AVA voice provider — Twilio assumed, confirmed? | 🟢 Answered | agent-framework |
| OQ-48 | Multi-tenancy isolation model — separate databases per tenant or shared DB with tenant_id? | 🟢 Answered | architecture |

**OQ-45 decision:** GCP — already in Firebase ecosystem with Spark, Healthcare API for FHIR, simpler ops for small team. See AD-01.

**OQ-46 decision:** Anthropic (Claude) via Vertex AI — one BAA (Google's), one billing relationship, option to add Gemini later. See AD-02.

**OQ-47 decision:** Twilio confirmed — proven healthcare telephony, BAA-ready, full pipeline control. See AD-03.

**OQ-48 decision:** Shared DB with tenant_id + Postgres RLS. Operational simplicity at current scale, with path to per-tenant isolation if contracts require it. See AD-04.

---

## Working assumptions (not yet validated)

These decisions have been made implicitly in the workflow and architecture docs. They should
be validated before implementation begins.

| Assumption | Made in | Risk if wrong |
|---|---|---|
| ~~Current meal prescription continues during care plan revision~~ | 01 | **Validated** — OQ-11 confirmed |
| ~~AVA uses Twilio for voice~~ | agent-framework | **Validated** — OQ-47 confirmed |
| ~~Epic is the primary EHR integration target~~ | 02, 04 | **Partially validated** — OQ-01: Cedars uses Epic, Vanderbilt uses Athena, UConn skips integration for phase 1. Multi-EHR support required. |
| React/Next.js frontend | CLAUDE.md (archive) | Front-end architecture change |
| FHIR R4 for all data exchange | multiple | Some partners may only support STU3 or HL7 v2 |
| Coordinator is the primary approver for care plans (with RDN) | 01 | Different approval chain changes workflow routing |
