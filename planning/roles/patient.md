# Role: Patient

> The person the platform exists to serve. Patients have a limited but important app
> surface — they are data providers, consent holders, and feedback sources. The platform
> is not designed to be their primary interface with Cena Health; AVA and their coordinator
> are. The app supports those relationships, it doesn't replace them.

---

## Primary app surface

**Patient app** — profile view, order tracking, appointment calendar, feedback, consent
management, and educational content. Secondary channel: AVA voice calls (not a screen).

---

## Design constraint

A significant portion of Cena Health's patient population is elderly, low-income, or has
limited smartphone proficiency. The Patient app must be designed for low digital literacy:
large tap targets, plain language, minimal navigation depth, and Spanish (at minimum) as
a first-class language alongside English.

AVA (voice) is the primary patient touchpoint — not the app. The app is for patients who
prefer it, or for tasks that are better done asynchronously (reading a consent form,
checking a delivery time).

---

## What patients see (own records only)

- **Profile:** name, contact info, delivery address, language preference (view only — coordinator edits)
- **Upcoming deliveries:** next delivery date, what's coming, delivery window
- **Past orders:** order history with status (delivered / missed)
- **Appointments:** upcoming RDN and BHN appointments with option to reschedule
- **Feedback:** rating and comments on recent deliveries and visits
- **Consents:** view active consents, understand what they cover, initiate withdrawal request
- **Educational content:** articles and resources curated to their care plan and conditions
- **Messages:** asynchronous secure messaging with their coordinator (not clinical staff directly)

---

## What patients cannot do

- Edit clinical information (allergies, diagnoses, medications) — these go through the coordinator
- View care plan detail beyond their meal delivery parameters and appointment schedule
- Access other patients' data (enforced structurally)
- Directly message clinical staff (messages route through coordinator)
- Cancel their enrollment unilaterally via app (requires coordinator call — this is a clinical transition)

---

## Patient data contributions

Patients contribute data in several ways. All are voluntary except consents.

| Contribution | Channel | Frequency |
|---|---|---|
| PHQ-9 and GAD-7 responses | AVA call or app survey | Monthly |
| Weekly mood/energy/symptom check-in | AVA call | Weekly |
| Meal satisfaction rating | AVA call or app | Per delivery |
| Weight and vitals (self-reported) | App | Per care plan schedule |
| Ad hoc feedback | App message | Any time |
| Consent decisions | App | At enrollment; renewal as required |

---

## Consent management

The Patient app is the primary surface for consent collection and management. Patients can:
- View each consent in plain language with a scroll-tracking requirement
- Sign or decline each consent independently
- View the history of their consent decisions
- Initiate a withdrawal request (coordinator confirms and processes)

Consents are versioned. When a consent document is updated, the patient receives a
notification and must re-sign. The care plan is not affected during the re-consent window
(patient has a grace period defined per consent type).

---

## Accessibility and language

- **Language:** All patient-facing content must be available in English and Spanish at launch.
  Additional languages as patient population warrants. AVA's voice interface supports
  multilingual conversation natively.
- **Reading level:** All patient-facing copy is written at ≤ 8th grade reading level.
- **Accessibility:** WCAG 2.1 AA minimum. Large text mode. Screen reader support.
- **Low-data mode:** The Patient app must be functional on slow connections. No video autoplay,
  no heavy assets on primary screens.
