# Journey: Provide Meal Feedback

## Journey Metadata
- **User:** Patient (e.g., Maria, 62, receiving 14 meals/week)
- **Goal:** Rate a recent meal delivery and surface any issues
- **Frequency:** Per delivery (2x/week) or as prompted by AVA
- **Entry Point:** AVA call prompt, app push notification, or patient-initiated
- **Success Criteria:** Feedback recorded, issues routed to the right team, recipe rotation adjusted if needed
- **Duration:** 1-2 minutes (app), 2-3 minutes (AVA call)

## Prerequisites
- Patient has received at least one meal delivery
- Delivery is marked as confirmed in the system

---

## Happy Path (App)

### Step 1: Receive Feedback Prompt
- **Screen:** Patient app — push notification or home dashboard card
- **User Action:** Sees prompt: "How were your meals this week? Tap to rate."
- **System Response:** Opens meal feedback screen with recent deliveries listed

### Step 2: Rate Delivery
- **Screen:** Patient app — meal feedback screen
- **User Action:** Sees their recent delivery:

```
┌─────────────────────────────────┐
│   Meals delivered Monday        │
│   March 23                      │
│                                 │
│   How were your meals?          │
│                                 │
│   😊  😐  😞                     │
│   Good  OK  Bad                 │
│                                 │
│   ┌───────────────────────┐     │
│   │ Tell us more           │     │
│   │ (optional)             │     │
│   │ [                    ] │     │
│   │ [                    ] │     │
│   └───────────────────────┘     │
│                                 │
│   Any meal you don't want       │
│   again?                        │
│                                 │
│   □ Chicken & rice bowl         │
│   □ Lentil soup                 │
│   □ Turkey meatloaf             │
│   □ Bean & cheese burrito       │
│                                 │
│   ┌───────────────────────┐     │
│   │       Submit           │     │
│   └───────────────────────┘     │
│                                 │
└─────────────────────────────────┘
```

- **Decision Point:** Overall rating, optional comment, optional recipe exclusion

### Step 3: Handle Recipe Exclusion (If Selected)
- **Screen:** Follow-up question (only appears if patient checked a meal)
- **User Action:** Clarifies why:

```
┌─────────────────────────────────┐
│   You selected: Turkey meatloaf │
│                                 │
│   What was the issue?           │
│                                 │
│   ┌───────────────────────┐     │
│   │ I don't like this meal │     │
│   └───────────────────────┘     │
│   ┌───────────────────────┐     │
│   │ Problem with this      │     │
│   │ delivery (cold, damaged)│     │
│   └───────────────────────┘     │
│   ┌───────────────────────┐     │
│   │ Made me feel sick      │     │
│   └───────────────────────┘     │
│                                 │
└─────────────────────────────────┘
```

- **System Response:**
  - "I don't like this meal" → removed from patient's rotation, feedback to kitchen
  - "Problem with this delivery" → quality issue flagged for kitchen/coordinator
  - "Made me feel sick" → urgent flag to coordinator and RDN, food safety protocol
- **Decision Point:** Categorize the issue

### Step 4: Confirmation
- **Screen:** Thank you screen
- **User Action:** Reads confirmation:

```
┌─────────────────────────────────┐
│   ✓ Thanks, Maria!              │
│                                 │
│   Your feedback helps us make   │
│   your meals better.            │
│                                 │
│   [Turkey meatloaf removed      │
│    from your meals]             │
│                                 │
└─────────────────────────────────┘
```

- **System Response:**
  - Feedback recorded and linked to delivery record
  - Recipe rotation updated if exclusion was confirmed
  - Quality issues routed to kitchen app queue
  - Safety concerns escalated immediately

---

## Alternative Path: AVA Call

### AVA Feedback Collection
- **Trigger:** AVA calls the patient as part of a scheduled check-in or delivery follow-up
- **Flow:**
  1. AVA: "Hi Maria, I see you got your meals on Monday. How were they?"
  2. Patient responds conversationally
  3. AVA structures the response: rating, any specific feedback, any issues
  4. If patient mentions a problem: AVA asks clarifying questions
  5. If patient mentions feeling sick after a meal: AVA flags immediately (safety protocol)
  6. AVA: "Thanks for letting me know. I've made a note about the turkey meatloaf."
- **Outcome:** Same data captured, same routing — just via voice instead of app

---

## Alternative Paths

### Alt 1: Patient Reports a Missed Delivery
- **Trigger:** Patient didn't receive their meals
- **Modified Steps:**
  - Patient taps "I didn't get my delivery" (visible on feedback screen and home dashboard)
  - System checks delivery status — if marked "delivered," flags a discrepancy
  - Coordinator notified immediately
  - Patient sees: "We're looking into this. Your coordinator Sarah will follow up today."
- **Outcome:** Missed delivery tracked, coordinator acts, kitchen/driver accountability

### Alt 2: Patient Reports Allergic Reaction
- **Trigger:** Patient selects "Made me feel sick" or mentions an allergic reaction
- **Modified Steps:**
  - Urgent flag to coordinator AND RDN simultaneously
  - System checks meal contents against known allergens
  - If allergen match found: food safety incident created, kitchen notified
  - Patient sees: "We're taking this seriously. Your coordinator will call you today."
  - Compliance logging: incident record created for quality management (Domain 7)
- **Outcome:** Safety event handled, root cause tracked

### Alt 3: Patient Provides No Feedback
- **Trigger:** Patient ignores feedback prompts for 2+ deliveries
- **Modified Steps:**
  - System doesn't nag — prompt frequency reduces to once per week
  - AVA asks about meals during the next wellness check-in (lower pressure than a dedicated prompt)
  - If patient consistently skips: no feedback is logged (absence is data too — may indicate disengagement)
- **Outcome:** Patient isn't pestered. Silence is noted but not escalated unless part of a broader disengagement pattern.

---

## Exception Handling

### Exception 1: Feedback Contradicts Delivery Record
- **Cause:** Patient says "I didn't get my meals" but delivery is marked confirmed
- **Frequency:** Occasional
- **Severity:** Needs investigation
- **Recovery:** Both records preserved. Coordinator investigates — was it left at the wrong door? Delivered to a neighbor?
- **Prevention:** Delivery confirmation with photo evidence (if supported by delivery partner)

---

## Critical Moments

| Step | Risk | Mitigation |
|---|---|---|
| 2 | Feedback feels like a chore | Keep it to one screen, 3-tap minimum. Don't require comments. |
| 3 | Patient removes a meal they actually liked (misclick) | Confirmation: "Remove turkey meatloaf from your meals?" with undo |
| 3 | Patient reports illness — this is a safety event | "Made me feel sick" triggers immediate escalation, not just a note |

---

## Connected Journeys

**Feeds into:**
- Kitchen order queue — recipe feedback informs production
- [RDN nutrition plan review](rdn-nutrition-plan-review.md) — adherence and satisfaction data visible to RDN
- [Coordinator morning triage](coordinator-morning-triage.md) — quality issues and missed deliveries appear in queue
- Risk management (Domain 7) — food safety incidents

**Feeds from:**
- Meal delivery (Domain 3) — delivery triggers the feedback prompt
- AVA check-in calls (1.7) — AVA asks about meals during wellness calls

---

## Design Implications

1. **Three taps to submit.** Rating (emoji tap) → submit. That's the minimum path. Comments
   and exclusions are optional. Never make feedback feel like homework.

2. **Emoji ratings, not stars or numbers.** 😊😐😞 are universally understood across age,
   language, and digital literacy. Three options, not five — simpler decision.

3. **The "made me feel sick" option is a safety trigger, not a rating.** It must be visually
   distinct from preference feedback and route differently. This is a food safety event,
   not a menu preference.

4. **Don't punish silence.** If a patient doesn't provide feedback, reduce prompt frequency
   rather than escalating. Pestering elderly patients about meal ratings damages the
   relationship. AVA can ask casually during check-ins instead.

5. **Confirmation that action was taken.** When a patient says "don't send turkey meatloaf
   again," they should see confirmation that it was removed. Trust is built by closing the loop.
