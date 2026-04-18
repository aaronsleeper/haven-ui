# Journey: First-Time Enrollment and Onboarding

## Journey Metadata
- **User:** Patient (e.g., Maria, 62, Type 2 diabetes, moderate smartphone proficiency, Spanish-preferred)
- **Goal:** Complete registration, sign consents, and set up their account so care can begin
- **Frequency:** Once per patient
- **Entry Point:** Receives enrollment invite (SMS or email) after coordinator approves their referral
- **Success Criteria:** Profile complete, consents signed, patient app active, ready for intake assessment
- **Duration:** 10-20 minutes (self-service) or 15-25 minutes (with coordinator on the phone)

## Prerequisites
- Referral has been processed and approved by coordinator
- Patient is eligible — status: `enrollment_pending`
- Enrollment invite has been sent via patient's preferred contact method

---

## Design Constraints

This journey serves patients who may be:
- Elderly with limited smartphone experience
- Low-income with older devices or slow connections
- Non-English speaking (Spanish at minimum)
- Unfamiliar with digital health tools

Every screen must work at 8th-grade reading level, WCAG 2.1 AA, large tap targets,
and low-data mode. AVA or a coordinator can walk the patient through by phone if needed.

---

## Happy Path

### Step 1: Receive and Open Invite
- **Screen:** Patient's SMS or email app (not yet in Ava)
- **User Action:** Opens the message:

```
SMS from Cena Health:
Hi Maria, your doctor referred you to Cena Health's
nutrition program. Tap the link to get started:
[cenahealth.app/enroll/abc123]

Questions? Call us: (860) 555-0100
```

- **System Response:** Link opens a mobile-friendly enrollment page (no app download required at this stage)
- **Decision Point:** Does Maria trust this message enough to tap the link?

**Design note:** The message must feel legitimate — Cena Health branding, the referring doctor's name, and a phone number for questions. No generic "click here" language.

### Step 2: Language Selection
- **Screen:** Enrollment landing page — first screen
- **User Action:** Selects preferred language

```
┌─────────────────────────────────┐
│        [Cena Health logo]       │
│                                 │
│   Welcome to Cena Health        │
│   Bienvenido a Cena Health      │
│                                 │
│   Choose your language:         │
│   Elija su idioma:              │
│                                 │
│   ┌───────────────────────┐     │
│   │     English           │     │
│   └───────────────────────┘     │
│   ┌───────────────────────┐     │
│   │     Español            │     │
│   └───────────────────────┘     │
│                                 │
│   Need help? Call (860) 555-0100│
└─────────────────────────────────┘
```

- **System Response:** All subsequent screens render in selected language
- **Decision Point:** None — straightforward selection

### Step 3: Verify Identity
- **Screen:** Identity verification
- **User Action:** Confirms their date of birth (pre-populated name from referral):

```
┌─────────────────────────────────┐
│   Hi Maria,                     │
│                                 │
│   To protect your information,  │
│   please confirm your birthday: │
│                                 │
│   Month  [March     ▾]         │
│   Day    [15        ▾]         │
│   Year   [1964      ▾]         │
│                                 │
│   ┌───────────────────────┐     │
│   │       Continue         │     │
│   └───────────────────────┘     │
│                                 │
│   Not Maria? Call (860) 555-0100│
└─────────────────────────────────┘
```

- **System Response:** DOB matched against referral record. If match: proceed. If no match: "That didn't match our records. Please try again or call us."
- **Decision Point:** None — verification step

### Step 4: Create Account
- **Screen:** Account creation
- **User Action:** Sets a password (or opts for SMS login code — no password needed):

```
┌─────────────────────────────────┐
│   Set up your account           │
│                                 │
│   How would you like to log in? │
│                                 │
│   ┌───────────────────────┐     │
│   │  📱 Text me a code     │     │
│   │  each time I log in    │     │
│   └───────────────────────┘     │
│                                 │
│   ┌───────────────────────┐     │
│   │  🔑 Create a password  │     │
│   └───────────────────────┘     │
│                                 │
│   We recommend text codes —     │
│   no password to remember.      │
│                                 │
└─────────────────────────────────┘
```

- **System Response:** SMS code option sends a 6-digit code to the phone number on file. Password option shows standard password creation.
- **Decision Point:** Login method preference

**Design note:** SMS code is the recommended default for this population. Fewer friction points, no forgotten passwords. Password is available for patients who prefer it.

### Step 5: Complete Profile
- **Screen:** Profile form — multi-step with progress indicator
- **User Action:** Reviews and completes pre-filled information:

**Step 5a — Contact info (pre-filled from referral):**
- Phone number (confirmed)
- Email (optional)
- Mailing address / delivery address
- Emergency contact name and phone
- Best time to contact

**Step 5b — Preferences:**
- Preferred contact method (phone, text, email)
- Preferred language (carried from step 2)
- Food allergies (critical — large, prominent field)
- Foods you enjoy / foods you avoid
- Hot meals or frozen meals preference

- **System Response:** Progress bar shows completion. Pre-filled fields are editable. Required fields marked with a simple asterisk. Form auto-saves every 30 seconds.
- **Decision Point:** Patient reviews pre-filled data for accuracy

### Step 6: Sign Consents
- **Screen:** Consent collection — one consent per screen
- **User Action:** For each consent:
  1. Reads the consent document in plain language (with scroll tracking)
  2. Signs by tapping "I agree" (or typing name for e-signature)
  3. Advances to next consent

**Consent order:**
1. **Treatment consent** — required
2. **HIPAA authorization** — required
3. **Program participation** (meal delivery, care coordination) — required
4. **Research consent** (if UConn or research partner) — optional, clearly marked

```
┌─────────────────────────────────┐
│   Agreement 1 of 3              │
│   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                 │
│   Treatment Consent             │
│                                 │
│   This says that you agree to   │
│   receive nutrition care from   │
│   Cena Health. Your dietitian   │
│   will create a food plan       │
│   based on your health needs.   │
│                                 │
│   [Read full document ↓]        │
│                                 │
│   What this means for you:      │
│   • A dietitian will review     │
│     your health information     │
│   • You'll receive meals        │
│     designed for your needs     │
│   • You can stop at any time    │
│                                 │
│   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│   ┌───────────────────────┐     │
│   │   ✓ I agree            │     │
│   └───────────────────────┘     │
│   ┌───────────────────────┐     │
│   │   ✗ I do not agree     │     │
│   └───────────────────────┘     │
│                                 │
│   Questions? Call (860) 555-0100│
└─────────────────────────────────┘
```

- **System Response:** Consent recorded with version number, timestamp, scroll depth, and signature. If patient declines a required consent: enrollment cannot proceed — clear message explaining why.
- **Decision Point:** Agree or decline per consent. Research consent is genuinely optional.

### Step 7: Confirmation and Next Steps
- **Screen:** Enrollment complete screen
- **User Action:** Reads confirmation:

```
┌─────────────────────────────────┐
│        ✓ You're all set!        │
│                                 │
│   Welcome to Cena Health,       │
│   Maria.                        │
│                                 │
│   What happens next:            │
│                                 │
│   1. Your dietitian will call   │
│      you within 7 days to       │
│      create your food plan.     │
│                                 │
│   2. Ava (our phone assistant)  │
│      will call you this week    │
│      to learn about your food   │
│      preferences.               │
│                                 │
│   3. Meals will start after     │
│      your dietitian approves    │
│      your plan.                 │
│                                 │
│   Your coordinator:             │
│   Sarah K. — (860) 555-0123    │
│                                 │
│   ┌───────────────────────┐     │
│   │   Open the Cena Health │     │
│   │   app                  │     │
│   └───────────────────────┘     │
│                                 │
└─────────────────────────────────┘
```

- **System Response:**
  - Patient status: `enrollment_pending` → `assessment_pending`
  - Coordinator notified: enrollment complete
  - Intake assessment scheduled (AVA call + app-based components)
  - Patient app account activated
- **Next Step:** Patient receives AVA intake call (Journey: AVA conducts intake assessment — part of workflow 1.4)

---

## Alternative Paths

### Alt 1: Coordinator-Assisted Enrollment (Phone)
- **Trigger:** Patient doesn't respond to enrollment invite within 3 days, or patient calls Cena Health after receiving the invite
- **Modified Steps:**
  - Coordinator opens the enrollment form on their end (Admin App)
  - Walks the patient through each field by phone
  - Coordinator reads consents aloud; patient gives verbal consent (recorded with coordinator attestation)
  - Coordinator completes the form on the patient's behalf
- **Outcome:** Same result — patient enrolled. Coordinator attestation logged for verbal consent.

### Alt 2: Patient Abandons Mid-Flow
- **Trigger:** Patient closes browser or loses connection during enrollment
- **Modified Steps:**
  - Auto-save preserves progress (every 30 seconds)
  - 24-hour reminder sent: "You started signing up — pick up where you left off: [link]"
  - Link returns to the last incomplete step, not the beginning
  - If no response after 48h: second reminder
  - If no response after 5 days: coordinator notified for phone follow-up
- **Outcome:** Patient completes later, or coordinator assists

### Alt 3: Patient Declines Required Consent
- **Trigger:** Patient taps "I do not agree" on a required consent
- **Modified Steps:**
  - Screen explains: "We need this agreement to provide care. Without it, we can't enroll you in the program."
  - Options: "Read again" / "Call us with questions" / "I still do not agree"
  - If patient confirms decline: enrollment halted, coordinator notified, referring provider notified
  - Patient record archived with decline reason
- **Outcome:** Clean exit — no abandoned enrollment lingering in the system

### Alt 4: Patient Needs Help Understanding Consents
- **Trigger:** Patient taps "Questions?" or calls the phone number
- **Modified Steps:**
  - If in-app: opens a simplified FAQ for that specific consent
  - If phone: coordinator is available to explain
  - Enrollment flow pauses — patient can return to the same step after getting answers
- **Outcome:** Informed consent, not rushed consent

---

## Exception Handling

### Exception 1: SMS Invite Not Received
- **Cause:** Wrong phone number, carrier blocking, patient changed number
- **Frequency:** Occasional
- **Severity:** Graceful — patient is waiting, not harmed
- **Recovery:** After 3 days with no response, coordinator is notified. Coordinator verifies phone number and resends or uses alternative channel (email, mail).
- **Prevention:** Enrollment invite confirmation: "Invite sent to (860) 555-XXXX" shown to coordinator

### Exception 2: Identity Verification Fails
- **Cause:** Patient enters wrong DOB (misremember, typo) or the referral data has a DOB error
- **Frequency:** Occasional
- **Severity:** Graceful
- **Recovery:** 3 attempts, then: "We couldn't verify your information. Please call us at (860) 555-0100."
- **Prevention:** Coordinator can override identity verification if patient calls in

---

## Critical Moments

| Step | Risk | Mitigation |
|---|---|---|
| 1 | Patient thinks the SMS is spam | Include referring doctor's name, Cena Health branding, phone number |
| 3 | DOB verification fails (data error, not patient error) | Coordinator override available; patient isn't locked out permanently |
| 5 | Patient overwhelmed by form length | Progress bar, auto-save, pre-filled fields, "call us" always visible |
| 6 | Patient signs without understanding | Plain language summaries, "what this means for you" bullets, scroll tracking |
| 6 | Patient feels pressured to consent to research | Research consent clearly marked optional, distinct visual treatment |

---

## Connected Journeys

**Feeds into:**
- Intake assessment (1.4) — after enrollment, AVA calls for assessment
- [Coordinator morning triage](coordinator-morning-triage.md) — enrollment completions and stalls appear in queue

**Feeds from:**
- [Coordinator referral intake](coordinator-referral-intake.md) — coordinator approval triggers the enrollment invite
- Partner referral submission — original referral that started the process

---

## Design Implications

1. **SMS code login, not passwords.** For this population, forgotten passwords are a guaranteed
   drop-off point. SMS code is the default and recommended path. Password is there for
   patients who want it, not as the primary option.

2. **Bilingual from the first screen.** Language selection is step 1, before anything else.
   Both English and Spanish appear simultaneously on the selection screen — neither is the
   "default" that the other deviates from.

3. **Consent must be understood, not just signed.** Plain language summaries, "what this means
   for you" bullets, and a phone number on every screen. Scroll tracking ensures the document
   was at least scrolled through. Research consent is visually distinct from required consents.

4. **Progress is never lost.** Auto-save every 30 seconds, resume link, coordinator-assisted
   completion as a fallback. A patient who starts enrollment should never have to start over.

5. **The confirmation screen sets expectations.** The patient should leave enrollment knowing
   exactly what happens next and who their coordinator is. No ambiguity, no "we'll be in touch."

6. **Every screen has a phone number.** When in doubt, the patient should always know they
   can call a human. This is the ultimate fallback for every digital interaction.
