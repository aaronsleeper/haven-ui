# UX Design Lead — Demo Prep Verdict (Cena Patient App, UConn MVP)

**Date:** 2026-05-13
**Reviewer:** ux-design-lead (haven-ui)
**Demo:** ~2026-05-22 (~9 days)
**Source inputs:**
- `apps/patient/design/build/validation-2026-05-13.md` (post-build screen-by-screen)
- `apps/patient/design/wireframes/pt-01-dashboard.md`, `pt-02-messages.md`
- `apps/patient/src/screens/meals/index.tsx` (DEMO_MEALS shape)
- Expert layers: `planning/experts/ux-design-lead/{judgment-framework,domain-knowledge,quality-criteria,output-contract}.md`

## Framing

The demo audience is Dr. Dieckhaus — a primary-care clinician who is being asked to believe that a 3-person agent-first company can deliver a coherent, trustworthy patient experience to UConn's pilot cohort. What he needs to feel is *not* "look at all these screens" but "this is a product a real patient could live inside for a week." Three decisions move the demo most: (1) which side of the conversation gets the branded color (signal of who the system thinks the protagonist is), (2) whether Maria's data threads through the screens as one continuous patient or scatters as nine prototype mocks, and (3) which single interaction is wired all the way through — because one fully-alive interaction reads as competence, three half-alive ones read as scaffolding.

---

## Q1 — Message bubble register

### Verdict

**Keep the current state: patient (self/outgoing) = teal primary, care team (other/incoming) = sand neutral.** The validation pass's swap recommendation is wrong for this product, even though the iMessage precedent it implicitly cites lines up the *other way*. Confidence: **high.**

### Reasoning

Three frames disagree on what's "convention," so name them explicitly:

1. **Consumer messengers (iMessage, WhatsApp, Signal, FB Messenger, SMS).** Self gets the colored bubble (iMessage blue / WhatsApp green / Signal blue), other gets the neutral gray. This is what the validation pass calls "convention" — and it is genuinely the default a patient under 60 has internalized from 15+ years of texting. **Current state matches this convention.** The validation pass got the direction backwards in its own argument (it claimed iMessage is self-gray, other-colored — it isn't).
2. **Patient portal messaging (MyChart, Athena, etc.).** These are list-of-messages surfaces, not bubble surfaces. They don't actually use the chat-bubble register at all — message-detail screens are full-width text with sender names above. So there *is no* established patient-portal bubble convention to defer to. [Search confirmed — no canonical Epic/MyChart bubble-color rule documented.]
3. **Brand-as-protagonist reading.** A subset of designers argue the *other* party (the brand) should always get the brand color, because the user's own messages are theirs and don't need branding. This is the reading the validation pass intuited but mis-attributed to iMessage.

The judgment call comes down to: **whose voice does the patient most need to hear as warm and present?** In a longitudinal-care context where the *patient is doing the work of getting better*, the patient's own voice as the branded one says: "your voice is the protagonist here; we are the warm-but-quiet support behind it." Flipping it (care team teal, patient gray) makes the care team the protagonist and the patient the *quoted reply* — which is exactly the wrong power dynamic for an agent-augmented care model that depends on patient agency.

Two further reasons this is the right call for Cena specifically:

- **Color independence (WCAG 1.4.1).** Both bubbles already carry sender labels + alignment + timestamps. The color isn't carrying identity — it's carrying *warmth signal.* Self-as-warm > other-as-warm for a patient app.
- **System notifications take a third register.** Per `pt-02-messages.md`, system updates render as `notif-item` blocks — not bubbles at all. So the bubble register only needs to disambiguate two parties, and alignment + sender label already do that work. Color is free to do voice work instead of identity work.

**Caveat / hedge.** If you ever build a *clinician-facing* messaging surface that reuses these primitives, flip the register there — the clinician is the protagonist of that view, so the *patient's* messages become the "other" and should be neutral. Same component, opposite role. Note this in `components.css` for whoever touches it next.

### What to do

- **Override the validation pass's recommended swap.** Leave `.message-bubble-out` (patient/outgoing) teal and `.message-bubble-in` (care team/incoming) sand-neutral.
- Add a one-sentence note in `packages/design-system/src/styles/tokens/components.css` near the bubble classes: "Outgoing = self = branded teal. Convention follows consumer messenger precedent (iMessage et al.) and a patient-as-protagonist stance. In clinician-facing reuse, the register inverts."
- Care-team avatar still needs initials or a glyph — that's a separate fix from the FA-loading work and is what's *actually* making the incoming bubble feel anemic right now.

---

## Q2 — Maria Rivera's journey arc

### Single-sentence arc

> **Maria is mid-week of week 2 in her UConn pilot — she's onboarded, she's eaten three of this week's meals, her mood is trending up, her coordinator just rescheduled Wednesday's delivery, and her weekly check-in is ready to take right now.**

That sentence threads every screen Dieckhaus is going to click.

### Patient state on first load

**Returning user, mid-week, one open nudge.** Not fresh-onboarded; not steady-state-with-nothing-to-do. The dashboard should open with three things visible above the fold:

1. **Today's task:** "Your weekly check-in is ready · About 2 minutes" → routes to GAD-7
2. **Recent message:** Sarah K. — "Your delivery was rescheduled to Wednesday — let me know if that doesn't work." (already specified in `pt-02-messages.md` Worked-example)
3. **Delivery countdown:** "Arriving Wednesday — 5 meals" (matches the rescheduled message)

Onboarding is a separate path the demo audience visits to *show how she got here*, not the entry point. Plan the click order: Dashboard → Messages → Care → Meals → Check-in → (back to Dashboard, now with the check-in nudge cleared). Onboarding is a sidebar tour, not the main loop.

### Minimal connective tissue (~8 fields)

These are the demo-day single-source-of-truth fields. Living in one place (suggest `apps/patient/src/data/demo-patient.ts` or similar) and imported everywhere:

| # | Field | Value | Appears on |
|---|---|---|---|
| 1 | `patient.firstName` | "Maria" | Dashboard greeting, every personalized copy |
| 2 | `patient.coordinator` | "Sarah K., Care Coordinator" | Messages sender, dashboard preview, care footer |
| 3 | `patient.weekNumber` | 2 (of UConn pilot) | Nowhere visible — used to derive #4, #5 |
| 4 | `nextDelivery.date` | next Wednesday (compute from today, not hardcoded May 14) | Dashboard delivery card, Care recent-deliveries, Meals confirm-by deadline |
| 5 | `nextDelivery.mealCount` | 5 | Dashboard delivery card, Meals page header |
| 6 | `appointments.next` | "Nutrition check-in with Dr. Soto, next Thursday 10:00 AM" (compute relative to today) | Care upcoming |
| 7 | `weeklyCheckIn.status` | "ready" (with deadline = today + 1 day) | Dashboard task card, Messages system-notification, Care footer text |
| 8 | `trends.mood` | 7-day series ending today, trending up from 4 to 6 | My Health Mood sparkline |
| 9 | `trends.energy` | flat 5-6 (Stable) | My Health Energy sparkline |
| 10 | `trends.mealSatisfaction` | trending up | My Health Meal Satisfaction sparkline |

Two of these (4 and 6) are date computations relative to today — that fixes the "May 8 is in the past" deviation flagged by validation without needing to hand-edit demo strings the morning of the 22nd.

### Why this arc binds

Dieckhaus's click path now tells a story:

- **Dashboard:** "Maria has one thing to do today, one message from her coordinator, and dinner Wednesday."
- **Messages:** "Sarah's been talking with her about a delivery change. Real human contact." (Q1 verdict: Maria's reply is the warm-colored bubble — *her voice is the protagonist*)
- **Care:** "Here's the underlying care plan, the upcoming visit, what's already been delivered." (continuity with the dashboard delivery card)
- **Meals:** "Here are this week's meals — including the rescheduled Wednesday delivery from the message." (same data, different surface)
- **Check-in:** "She does the 2-minute GAD-7." (the task from the dashboard, completed)
- **Back to Dashboard:** "The check-in card is gone. Empty state: 'Nothing else to do today, Maria.'" (the *empty* dashboard is the demo's strongest moment — it shows the agent did its job)

That last beat is the one Dieckhaus will remember.

---

## Q3 — The interactive moment

### Verdict

**Check-in start (Dashboard → GAD-7 → Thank You → Dashboard with prompt cleared) — fully wired, with the empty-dashboard return as the climax.** Confidence: **high.**

### Why this beats meal swap and message reply

Reason about each candidate as a demo audience would interpret it:

**Meal swap.** Shows: "the patient can substitute one meal for another." What Dieckhaus sees: a competent but bounded shopping-app interaction. Defensibility under poking: weak — *what if the substitute isn't in stock? what if the swap violates dietary restrictions? what about the kitchen?* All real questions Cena has answers to in the *system*, but none of them visible in the *patient app* alone. The interaction is a thin slice that opens four cans of worms.

**Message reply.** Shows: "the patient can text her care coordinator." What Dieckhaus sees: SMS. Defensibility: also weak — *what's the response SLA? does this replace a phone call? what's the documentation trail?* And the reply doesn't *advance* anything — it ends with a sent message and an idle "delivering…" indicator. No closure.

**Check-in start (GAD-7).** Shows: "the patient takes a validated clinical instrument the way Cena's agent-augmented model is designed to deliver it — short, low-friction, private, and the result threads into the care plan." This is the *thesis of the product on one screen.* Maria taps the dashboard task → answers 7 questions → sees a warm "Thank you, your care team will review your answers" → returns to a dashboard that has *registered her completion* by clearing the prompt. The audience experiences the whole loop.

**Defensibility under "what if X":**

- *"What if a patient scores severely?"* — perfect entry to the "Safety + Escalation" talking point. The patient sees "Thank you," the care team sees a flag. (Show this in clinician view if there's time; if not, narrate.)
- *"What if she doesn't want to do it right now?"* — the back button works, state persists per the wireframe spec. Show by demonstration.
- *"What about PHQ-9?"* — already wired, same flow.
- *"Where does the data go?"* — answer with the care-team review copy plus the My Health sparkline (now showing a fresh data point — see risks below).

The check-in flow defends itself with copy that already exists and patterns that already work.

### Connect it to the journey arc

After the check-in completes:

- **Dashboard return:** task card is gone; replace with action-recent variant of the greeting subline ("You did this week's check-in — thank you, Maria.")
- **Optional flourish (only if cheap):** the Mood sparkline on My Health gets one new tick at today's date. If implementing this is more than 30 minutes, skip — the dashboard-clear beat is enough.

### Risks + mitigations

| Risk | Mitigation |
|---|---|
| The `[prototype] score 5 of 21 — mild` debug line is visible on Complete (validation criticals #7) | **MUST fix before demo.** Showing the score to the patient breaks the clinical thesis of the flow. This is the single most demo-blocking issue. |
| FontAwesome not loading kills the `fa-circle-check` success icon on Complete | Falls under cross-cutting FA fix; without it the Thank-You screen reads as "Thank You" floating alone. |
| Maria's "completion" doesn't persist across a demo refresh | localStorage already persists per spec — verify before demo. If broken, hard-code the post-completion state and skip the live click-through. |
| Dieckhaus asks "what does she see *during* the assessment if her phone rings?" | The question wireframe persists answers per question. Demonstrate by tapping back, returning, resume in place. |
| The dashboard return doesn't actually clear the task | Wire the demo so that completion writes to local state and the dashboard reads it on remount. This is the wiring that proves "this is a product, not screens." Without it, the demo's climax breaks. |

### What to skip from the candidates

- Meal swap: leave as a clickable-but-non-functional Swap button that opens a "Coming soon" toast OR (better) remove the Swap button entirely and reframe the Meals page as "view-only this week" for the demo. A non-functional swap button is *worse* than no swap button.
- Message reply: leave as a tappable composer that visibly accepts text, but don't promise a roundtrip. Demonstrating typing into the composer is enough to imply the interaction without committing to wiring a fake response.

---

## Confidence summary

| Question | Confidence | Why |
|---|---|---|
| Q1 — bubble register | **High** | Consumer-messenger precedent + patient-as-protagonist reading both point the same way; validation pass mis-cited iMessage in its own argument |
| Q2 — journey arc | **High** for the arc; **medium** for the specific connective-tissue field list (some fields may already live elsewhere in source; consolidate where they do) |
| Q3 — interactive moment | **High** that check-in is the right choice; **medium** on the "Mood sparkline tick" flourish — could go either way depending on dev cost |

---

## Inputs that would change these verdicts

- **Q1 swap argument** — if Cena's brand voice doc or Vanessa's positioning explicitly states "the care team is the protagonist of patient surfaces," that overrides my patient-as-protagonist reading. Worth a one-message check with brand-fidelity expert before locking the bubbles.
- **Q2 onboarding placement** — if Dieckhaus has specifically asked to see the onboarding flow as the primary thing, reorder the demo path. Default assumption: he wants to see the steady-state patient.
- **Q3 if a kitchen demo is also planned** — meal swap gains value when the audience sees the kitchen side of the swap. Without that pairing, the meal swap is half a story; the check-in is whole.
