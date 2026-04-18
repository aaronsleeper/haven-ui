# AD-07 Proposal: Engineering on-call policy

## Decision

**decision_id:** AD-07
**title:** Engineering on-call policy for P1 incidents
**date:** 2026-04-09
**status:** Proposal for Andrey

---

## Recommendation

Weekly alternating rotation between Aaron and Andrey with differentiated response scopes. Andrey is primary on-call for all infrastructure and data incidents. Aaron is primary on-call for product/UX-layer incidents and serves as the communication lead during any P1. Both carry the pager, but escalation paths differ based on incident type.

### Severity tiers

| Tier | Definition | Examples | Ack SLA | Resolution target | Who responds |
|---|---|---|---|---|---|
| **P1 — Critical** | Patient-facing system down, suspected data breach, AVA voice unreachable, any potential PHI exposure | Production DB unreachable, Twilio voice pipeline failure, unauthorized data access detected, all clinical users locked out | 15 min | Stabilize in 1 hr, resolve in 4 hr | On-call primary. Auto-page secondary if no ack in 15 min. Both engaged for data breaches. |
| **P2 — High** | Degraded service affecting clinical workflows, but workaround exists | Slow API responses (>5s), BigQuery ETL pipeline failed (research data stale), single EHR integration down, one partner's tenant experiencing errors | 30 min | Resolve in 8 hr (business hours) | On-call primary only. Escalate to secondary at discretion. |
| **P3 — Medium** | Internal tooling issue, non-blocking bug, monitoring alert that isn't patient-facing | Admin dashboard error, CI pipeline broken, non-critical background job failed, staging environment down | Next business day | Resolve in 48 hr | Whoever picks it up. No pager. Slack notification. |

### Aaron vs. Andrey: differentiated on-call scope

Aaron is product/UX, not an infrastructure engineer. His on-call value is in triage, communication, and product-layer diagnosis — not in debugging Postgres replication lag or Kubernetes networking.

**Aaron as primary on-call can handle:**
- Triage and severity classification (is this P1, P2, or P3?)
- Patient/partner communication during incidents ("we're aware, ETA is X")
- Product-layer bugs (UI errors, broken workflows, misconfigured feature flags)
- Restarting known-good runbooks (restart Cloud Run service, clear cache, toggle feature flag)
- Monitoring dashboard interpretation (is this a real alert or a flap?)

**Aaron escalates to Andrey for:**
- Database issues (connection pool exhaustion, replication lag, RLS policy errors)
- Infrastructure failures (Cloud Run scaling, networking, IAM misconfigurations)
- Data incidents (suspected breach, cross-tenant data leak, PHI exposure)
- Voice pipeline issues (Twilio/STT/TTS integration failures)
- Anything requiring production database access or infrastructure changes

**Andrey as primary on-call handles everything**, including product-layer issues. When Andrey is primary, Aaron is a communication/triage backup, not a technical escalation.

### Rotation schedule

- **Weekly rotation**, Monday 9:00 AM ET to Monday 9:00 AM ET
- Published 4 weeks in advance in a shared calendar
- Swap requests require 24-hour notice and explicit confirmation from the other person

### Quiet hours policy

- **Quiet hours: 22:00–07:00 local time**, Monday–Friday
- **Weekends: all day** is quiet hours
- During quiet hours, only P1 incidents page. P2 notifications are held until 07:00.
- P3 never pages — Slack only, business hours.

### Vacation and unavailability

With a 2-person rotation, vacation = solo coverage. This is the hard constraint.

- **One person on vacation:** The other person is on-call for the full duration. Maximum consecutive solo coverage: 7 days. Beyond 7 days, engage a contractor or defer the vacation.
- **Both unavailable:** Not permitted until a third on-call-capable person exists. Stagger vacations with a minimum 2-day buffer between trips.
- **Sick/emergency:** If on-call person becomes unavailable unexpectedly, the other person takes over immediately. No SLA gap — the auto-escalation (15-min no-ack) handles this automatically.

### Alerting and monitoring that reduces on-call burden

The best on-call policy is one that rarely pages. Invest in monitoring that catches problems before they become P1s:

| Monitor | Tool | Threshold | Severity |
|---|---|---|---|
| API response time (p95) | Cloud Monitoring | > 3s for 5 min | P2 |
| API error rate (5xx) | Cloud Monitoring | > 5% for 3 min | P1 |
| Cloud SQL connections | Cloud Monitoring | > 80% pool utilization | P2 |
| Cloud SQL replication lag | Cloud Monitoring | > 60s | P2 |
| Twilio voice pipeline health | Synthetic check (Cloud Run cron) | Failed test call | P1 |
| ETL pipeline completion | Cloud Scheduler + custom metric | No completion in 36 hrs | P2 |
| SSL certificate expiry | Cloud Monitoring | < 14 days | P3 |
| Uptime check (patient-facing URLs) | Cloud Monitoring uptime checks | Down for 1 min | P1 |
| Disk usage | Cloud Monitoring | > 80% | P2 |
| Auth failures (brute force) | Cloud Audit Logs + alert policy | > 10 failed logins in 5 min | P1 |

### Tooling recommendation

**PagerDuty** (Starter plan, $21/user/month). Reasoning:
- Opsgenie is comparable in features but PagerDuty has better GCP Cloud Monitoring integration (native integration, no webhook configuration needed)
- PagerDuty's escalation policies handle the "auto-page secondary after 15 min" requirement out of the box
- Starter plan supports 2 users, unlimited integrations, on-call schedules, and escalation policies
- Can add a third person to the rotation later without plan changes

---

## Alternatives considered

### Option A: Andrey-only on-call

**Description:** Andrey handles all on-call. Aaron is never paged.

**Pros:**
- Simple — one person, no handoff confusion
- Aaron's non-infrastructure background isn't a liability
- Aaron focuses entirely on product without on-call interruption

**Cons:**
- Andrey has zero coverage gaps — every vacation, every sick day, every weekend is his responsibility
- Burnout risk is maximal and existential for a company this size
- If Andrey is unreachable during a P1, there is literally no one else. Response SLA is broken.
- Sets a precedent that on-call is "someone else's problem" for non-eng co-founders

### Option B: Aaron and Andrey alternating, identical scope (naive rotation)

**Description:** Both take the same on-call responsibilities, alternating weekly.

**Pros:**
- Fair 50/50 split
- Simple rotation

**Cons:**
- Aaron cannot resolve infrastructure incidents. A P1 database issue during Aaron's week means Andrey gets paged anyway after a 15-minute delay, adding response latency
- Aaron feels responsible for things he can't fix, which is demoralizing
- The "ack within 15 min" SLA is met (Aaron acks), but time-to-resolution suffers

### Option C: Differentiated rotation with runbook-gated Aaron scope (recommended)

**Description:** Both rotate weekly, but Aaron's response scope is explicitly bounded. Aaron handles triage, communication, and product-layer issues. Infrastructure issues auto-escalate to Andrey regardless of whose week it is.

**Pros:**
- Andrey gets genuine time off — Aaron handles the first 15 minutes of triage for everything, and resolves product-layer issues independently
- Aaron's contribution is real and well-scoped — triage, communication, and product diagnosis are high-value, not busywork
- Infrastructure P1s reach Andrey within 15 minutes regardless — no worse than Option A
- Scales naturally: when a third engineer joins, they slot into the rotation and inherit Andrey's scope

**Cons:**
- Requires runbooks for Aaron's scope (restart procedures, monitoring interpretation, communication templates). These need to be written and maintained.
- Aaron must be willing to carry a pager and respond at 2 AM for triage, even if the resolution is "page Andrey"
- Slightly more complex escalation policy configuration in PagerDuty

---

## Rationale

1. **Burnout prevention is a business continuity issue.** With 2 co-founders, losing either person to burnout is an existential risk. Andrey-only on-call is not sustainable past launch. The rotation must start before the habit of "Andrey handles everything" calcifies.

2. **Aaron's triage value is real.** Classifying an incident as P1 vs. P2, communicating with affected partners, and restarting a known-good service are meaningful contributions that save Andrey 15-30 minutes per incident. This is not theater — it's operational leverage.

3. **Pre-launch is the time to build the muscle.** Incident volume is near-zero right now. Setting up PagerDuty, writing runbooks, and practicing the rotation during a low-stakes period means the team is ready when launch brings real incidents. Building on-call culture after a P1 is reactive and painful.

### When to hire a third person for on-call

Add a third on-call-capable person when any of these trigger:

- **Incident volume exceeds 4 P1/P2 incidents per month** — the rotation is consuming too much of 2 people's time
- **Either person needs more than 7 consecutive days off** — solo coverage beyond a week is unsustainable
- **Patient volume exceeds 200 active patients** — the blast radius of incidents justifies 24/7 coverage depth
- **Post-launch stabilization period ends** (typically 3-6 months after first patient) — ongoing operational load is clear enough to justify the hire

The third person should be an infrastructure/backend engineer who can handle Andrey's full scope. This converts the rotation to 1-in-3 weeks, which is the industry standard for sustainable on-call.

---

## Reversibility assessment

**Rating:** Easy

**What reversal requires:** On-call policy is organizational, not architectural. Changing the rotation, scope, or tooling is a configuration change in PagerDuty and a conversation between two people. No code changes. No infrastructure changes.

---

## HIPAA implications

- **Incident response (§164.308(a)(6)):** HIPAA requires a security incident response plan. This on-call policy is part of that plan. The severity tiers and response SLAs document our incident response procedures.
- **Data breach notification (§164.408):** P1 incidents involving suspected PHI exposure trigger the breach assessment process. The on-call policy ensures someone is available to begin that assessment within 15 minutes, 24/7.
- **Workforce security (§164.308(a)(3)):** On-call personnel have production access. Aaron's access should be scoped: read-only monitoring dashboards, service restart capability, but no direct database access. Andrey's access includes production database (as needed for incident resolution).
- **Documentation:** All P1 and P2 incidents must produce a written incident report within 48 hours. Include timeline, root cause, data impact assessment (was PHI involved?), and remediation steps. This feeds the HIPAA-required incident log.

---

## Cost estimate

| Item | Monthly cost |
|---|---|
| PagerDuty Starter (2 users) | ~$42 |
| Cloud Monitoring (alerting policies) | ~$0 (included in GCP spend) |
| Synthetic monitoring (voice pipeline health check) | ~$5 |
| **Total** | **~$47/mo** |

The real cost is human time. At pre-launch incident volumes (<1 P1/month expected), the direct time cost is negligible. The indirect cost is carrying a pager — compensate for this with clear quiet hours and a firm vacation policy.

---

## What breaks if wrong

**Worst case:** A P1 incident occurs (e.g., suspected data breach) and neither person responds within 15 minutes. HIPAA breach notification timeline starts, and the clock runs without anyone investigating. Partner trust is damaged. Regulatory exposure increases with every hour of delay.

**Mitigations:**
- Auto-escalation: if primary doesn't ack in 15 min, secondary is paged automatically
- If neither responds in 30 min, PagerDuty can send an SMS/phone call (bypasses Do Not Disturb)
- Both co-founders carry the pager app on personal devices — this is a co-founder responsibility, not an employee obligation
- Pre-launch: incident likelihood is near-zero (no patients, no production PHI). The policy exists to be ready, not because incidents are expected

**Second worst case:** Aaron is on-call, a database issue occurs, and the 15-minute triage window adds latency to resolution. Mitigation: Aaron's runbook includes "if infrastructure, page Andrey immediately" — the triage step takes 2 minutes, not 15. Net added latency: ~2 minutes over Andrey-only on-call.

---

## Dependencies

- AD-01 (GCP) — Cloud Monitoring as the alerting source
- PagerDuty account setup (or Opsgenie — decision in this proposal)
- Runbooks for Aaron's on-call scope (must be written before the rotation starts)
- Production infrastructure deployed (monitoring requires running services)
- Production access model defined (Aaron: read-only monitoring + restart; Andrey: full production access)

---

## Ask

Andrey: **approve, modify, or reject.**

Specific questions for your review:

1. Are you comfortable with Aaron carrying on-call with the differentiated scope described? Or would you prefer Andrey-only until a third engineer is hired?
2. PagerDuty vs. Opsgenie — do you have a preference or existing account?
3. Is the 15-minute ack SLA realistic for quiet hours (overnight)? Some teams use 30 minutes for overnight P1s.
4. Should we define a formal incident commander role for P1s, or is "whoever responds first leads" sufficient at 2 people?
