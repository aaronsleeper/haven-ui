# Patient App: Profile Use Cases

**Module:** Profile & Settings
**Application:** Patient Portal (Mobile)

---

## PT-PROFILE-001: Manage Personal Preferences & Contact Info

**User type:** Patient
**Frequency:** Occasional (after onboarding, when life circumstances change)
**Criticality:** Medium — outdated delivery address or contact info causes operational failures; dietary preference errors could affect clinical adherence
**Platform:** Mobile

### Context

A patient needs to update something about themselves — they moved, got a new phone number, want meals in a different cultural style, or want to change how often the team contacts them. This is not a clinical record update (the care team manages diagnoses, medications, and clinical restrictions); it is the patient managing their own preferences and logistics.

### Goal

"I want to make sure my information is current so my meals arrive and my care team can reach me."

### Preconditions

- Patient is logged in and enrolled

### Primary Flow

1. Patient navigates to Profile/Settings (accessible from persistent bottom navigation)
2. System displays profile screen organized in clear sections:
   - **Contact & Delivery:** Phone, email, delivery address
   - **Meal Preferences:** Language, cultural food preferences, dietary notes (free text)
   - **Communication:** Preferred contact method (call/text/app), preferred contact times
   - **Account:** Password/PIN change, logout
3. Fields managed by the care team are shown as read-only with a label: "Set by your care team — contact us to change"
4. Patient taps an editable field, makes a change, and saves
5. Change is saved immediately
6. Changes to operationally critical fields (delivery address, phone) trigger a care coordinator notification

### Alternate Flows

- **3a.** Patient taps a read-only clinical field (e.g., a dietary restriction): System shows a brief explanation and a "Message your care team" link
- **6a.** Delivery address change is outside the current kitchen service area: System flags for care coordinator review before the next order processes; patient sees: "We're reviewing your new address. Your care team will follow up."

### Error Conditions

- **E1.** Patient enters an invalid phone number or address format: Inline validation with plain-language error message before save
- **E2.** Delivery address change arrives after the current week's ordering window has closed: Apply to the following week's order; notify patient of the effective date

### Success Criteria

- Updated fields saved and reflected immediately in the patient's record
- Care team notified of changes that affect operations (address, phone)
- Patient receives confirmation that changes were saved

### Data Requirements

- Read: All profile fields (contact info, delivery address, preferences, clinical restrictions [read-only], communication preferences)
- Write: Phone, email, delivery address, cultural food preferences, dietary notes (free text), language preference, communication method, contact time preference, password/PIN

### Accessibility Notes

- Section headings must clearly separate editable from read-only fields; do not rely on visual styling alone (use labels)
- Language toggle (English/Spanish) must be accessible from this screen and take effect immediately across the entire app

### Related Use Cases

- PT-ONB-002: Preferences Setup (initial version of these fields)
- PT-MEALS-001: Browse & Confirm (food preferences affect meal options shown)
- PT-CARE-001: Messaging (linked from read-only field explanation)

### Open Questions

- Can patients update their own dietary preferences and allergies (beyond clinical restrictions), or does any change to dietary data require care team approval before it takes effect on the meal plan?
- Should family/caregiver access be managed here? (e.g., a family member who wants to receive delivery notifications) — deferred from onboarding but needs a home.
- Is password/PIN change self-serve or does it require email/SMS verification?
