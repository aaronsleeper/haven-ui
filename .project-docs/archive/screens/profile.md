# Profile

**Parent Navigation:** Account

## Screen Overview

Patients view and update their personal information including name, contact details, demographics, emergency contacts, and optional profile photo. Some fields may be locked if verified by care team. Identity documents are managed separately in Documents screen.

## Features on Screen

- **Personal Information** - Name (first, last), Date of birth, Gender, Preferred pronouns, Demographics (ethnicity, race - optional). Edit button for unlocked fields.
- **Contact Information** - Phone number (primary, secondary), Email address, Mailing address. Verification status badges.
- **Emergency Contacts** - List of emergency contacts with name, relationship, phone number. Add, edit, remove contacts (minimum 1 required).
- **Profile Photo** - Optional avatar/photo upload. Default to initials if not provided. Camera/file picker to update.
- **Verification Status** - Badges showing which information is verified (email, phone, identity). Links to verify unverified fields.
- **Account Information** - Patient ID, enrollment date, assigned care team members (read-only).
- **Identity Documents** - Link to Documents screen to manage ID, insurance cards.

**Key data:** firstName, lastName, dateOfBirth, phone, email, address, emergencyContacts, profilePhotoUrl, verificationStatus

## Ava Integration

**Profile incomplete:** "I notice you haven't added an emergency contact yet. Would you like to add one now for safety?"

**Verification needed:** "Your phone number isn't verified yet. I can send you a verification code to confirm it."

**Photo upload:** "Want to add a profile photo? It helps your care team recognize you during video appointments."

## Wireframe

```
┌──────────────────────────────────────┬─────────────────┐
│ Profile                              │ Ava Chat        │
├──────────────────────────────────────┤                 │
│ [Profile Photo]                      │ "I notice you   │
│ [Upload Photo CLICK]                 │ haven't added   │
│                                      │ emergency       │
│ PERSONAL INFORMATION                 │ contact..."     │
│ Name: John Doe [🔒 Verified]         │                 │
│ Date of Birth: Jan 1, 1980           │ [Chat input]    │
│ Gender: Male                         │                 │
│ Pronouns: He/Him                     │                 │
│ [Edit Info CLICK]                    │                 │
│                                      │                 │
│ CONTACT INFORMATION                  │                 │
│ Phone: (555) 123-4567 [✓ Verified]   │                 │
│ Email: john@example.com [✓ Verified] │ [Audit log]     │
│ Address: 123 Main St, Apt 4B         │                 │
│          City, ST 12345              │                 │
│ [Edit Contact CLICK]                 │                 │
│                                      │                 │
│ EMERGENCY CONTACTS                   │                 │
│ ┌──────────────────────────────────┐ │                 │
│ │ Jane Doe                         │ │                 │
│ │ Relationship: Spouse             │ │                 │
│ │ Phone: (555) 987-6543            │ │                 │
│ │ [Edit] [Remove]                  │ │                 │
│ └──────────────────────────────────┘ │                 │
│ [Add Emergency Contact CLICK]        │                 │
│                                      │                 │
│ ACCOUNT INFORMATION                  │                 │
│ Patient ID: P123456                  │                 │
│ Enrolled: Jan 15, 2024               │                 │
│ Care Team: Dr. Chen, J. Martinez     │                 │
└──────────────────────────────────────┴─────────────────┘
```

## Critical Questions

- **Verification requirements:** Which fields must be verified? → **A) Email and phone required, address optional**
- **Edit restrictions:** Can patients change verified info? → **A) Yes but requires re-verification, care team notification**
- **Minimum emergency contacts:** How many required? → **A) Minimum 1, recommended 2**