# Patient App: Onboarding Use Cases

**Module:** Onboarding
**Application:** Patient Portal (Mobile)

---

## PT-ONB-001: Account Setup & Consent

**User type:** Patient
**Frequency:** Once (at enrollment)
**Criticality:** High — incomplete consent blocks program participation; errors affect HIPAA compliance
**Platform:** Mobile

### Context

A patient has been referred to the Cena Health program by their provider. A care coordinator has initiated enrollment and the patient receives an SMS with a link to complete their account setup. They may be at home, at a clinic, or on the go. Many are completing this on a phone with limited data. Some are completing it with a family member helping.

### Goal

"I want to get signed up so I can start getting my meals."

### Preconditions

- Care coordinator has created a pre-populated patient record in the system
- Patient has received an SMS or email invite with a one-time setup link
- Patient's Medicaid eligibility has been verified by the care team

### Primary Flow

1. Patient opens the setup link from their SMS
2. System presents a welcome screen with the Cena Health name, a brief plain-language description of the program, and a "Get Started" button
3. Patient creates a password (or sets up a PIN for simpler access)
4. System presents consent screens one at a time:
   - HIPAA authorization
   - Program participation agreement
   - AVA voice interaction consent (can opt out; program continues)
5. Each consent screen has: plain-language summary, option to hear it read aloud (bilingual), and a clear "I agree" / "Read more" action
6. Patient completes all required consents
7. System confirms account is active and routes to preferences setup (PT-ONB-002)

### Alternate Flows

- **4a.** Patient opts out of AVA consent: Program continues; AVA calls are disabled for this patient; care team is notified
- **5a.** Patient selects "Read more": Full consent text displayed in an expandable section; does not navigate away

### Error Conditions

- **E1.** Setup link is expired (>72 hours): Show message to call care team; display phone number prominently
- **E2.** Patient already has an account: Route to login screen with a "forgot password" link
- **E3.** Session drops mid-consent: Progress is saved; patient resumes where they left off on next open

### Success Criteria

- All required consents signed and timestamped in the system
- Patient account is active and accessible
- Care coordinator receives confirmation that onboarding is complete

### Data Requirements

- Read: Patient name, program name, pre-populated from care coordinator record
- Write: Password/PIN, consent records (with timestamp and IP), AVA opt-in status, language preference (set in PT-ONB-002)

### Accessibility Notes

- "Read aloud" option for each consent screen is required (not optional) given low health literacy population
- Minimum font size 16px for consent text
- "I agree" buttons must be large touch targets (min 48x48px)

### Related Use Cases

- PT-ONB-002: Preferences Setup (next step in flow)
- PT-PROFILE-001: Profile (preferences are editable after onboarding)

### Open Questions

- Does AVA opt-out require a care coordinator notification, or is it a silent system flag?
- Is a PIN login option feasible vs. password? PIN is lower friction for this population.
- Should family/caregiver access be set up during onboarding or later via profile?

---

## PT-ONB-002: Preferences Setup

**User type:** Patient
**Frequency:** Once at enrollment; editable via Profile afterward
**Criticality:** Medium — affects meal matching and communication; errors cause friction, not harm
**Platform:** Mobile

### Context

Immediately following account creation, the patient completes a short preferences setup. This is not a clinical intake (that is done by the care team). This is the patient's own voice: what foods they like, how they want to be reached, what language they prefer.

### Goal

"I want to tell you about my food preferences so the meals feel right for me."

### Preconditions

- Patient has completed PT-ONB-001
- Patient is logged in

### Primary Flow

1. System presents a short, friendly intro: "Let's personalize your meals and how we keep in touch." (bilingual)
2. Patient selects language preference (English / Spanish); UI updates immediately
3. Patient selects cultural food preferences from a visual menu (with images): Latin American, Soul Food, Mediterranean, Asian, No preference
4. Patient confirms or updates any food allergies or restrictions (pre-populated from care team record if available; patient can add but not remove clinical restrictions)
5. Patient sets communication preferences: preferred contact method (call / text / app notification), preferred contact times (morning / afternoon / evening)
6. System confirms: "You're all set. Your first meals are on the way." Routes to Meals home screen

### Alternate Flows

- **3a.** Patient selects multiple cultural preferences: All selections are saved; meals rotate across preferences
- **4a.** Patient tries to remove a clinical dietary restriction: System shows a message: "This restriction was set by your care team. Contact them to make changes." Restriction remains.

### Error Conditions

- **E1.** Patient skips without completing: Remind once ("This helps us get your meals right") but allow skip; preferences default to "no preference" and can be updated via Profile

### Success Criteria

- Language, food preferences, and communication preferences saved to patient record
- Care team and kitchen partner system reflect updated preferences before first order is placed

### Data Requirements

- Read: Pre-populated allergies/restrictions from care team record
- Write: Language preference, cultural food preferences, communication method, contact time preference

### Accessibility Notes

- Cultural food selection should use images, not text-only labels
- All images must have alt text in both English and Spanish

### Related Use Cases

- PT-ONB-001: Account Setup (precedes this)
- PT-PROFILE-001: Profile (these preferences are editable here post-onboarding)
- PT-MEALS-001: Meal Ordering (preferences drive menu shown)

### Open Questions

- Who manages the cultural food preference images and menu categories? Does this need a CMS or is it hardcoded for MVP?
- Can a patient select "no preference" and still receive culturally tailored meals based on the care team's assessment?
