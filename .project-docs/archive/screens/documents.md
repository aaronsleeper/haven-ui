# Documents

**Navigation Label:** "Documents"

## Screen Overview

Patients upload, view, and manage health-related documents (insurance cards, lab results, ID, prescriptions, etc.). They see which documents are required by their care team, upload new files, download existing documents, and get Ava's help with missing or expired documents.

## Features on Screen

- **Required Documents** - Placeholders for documents requested by providers or needed for care (insurance card, photo ID, etc.). Shows status: Missing, Pending Review, Approved, Expired.
- **Uploaded Documents** - List of all patient documents with filename, type, upload date, status badge. Click to view/download. Actions to delete or replace.
- **Upload Button** - Opens file picker or camera (mobile) to add new document. Select document type during upload.
- **Document Filters** - Filter by type (Insurance, Lab Results, Prescriptions, ID, Other) or status (All, Pending, Approved, Expired).

**Key data:** fileName, documentType, uploadDate, status, requiredBy, expirationDate, fileSize

## Ava Integration

**Missing docs:** "You have 2 required documents to upload: insurance card and photo ID. I can help you get those uploaded now."

**All complete:** "Great! All required documents are uploaded and approved. Let me know if you need to add anything else."

**Document expiring:** "Your insurance card expires in 30 days. Want to upload the new one now so we have it ready?"

## Wireframe

```
┌──────────────────────────────────────┬─────────────────┐
│ Documents              [Upload CLICK]│ Ava Chat        │
├──────────────────────────────────────┤                 │
│ [Filter: All ▼] [Type: All ▼]        │ "You have 2     │
│                                      │ required docs   │
│ REQUIRED DOCUMENTS                   │ to upload..."   │
│ ┌──────────────────────────────────┐ │                 │
│ │ ⚠ Insurance Card - MISSING       │ │ [Chat input]    │
│ │ Required by care team            │ │                 │
│ │ [CLICK TO UPLOAD]                │ │                 │
│ └──────────────────────────────────┘ │                 │
│                                      │                 │
│ ┌──────────────────────────────────┐ │                 │
│ │ ⚠ Photo ID - MISSING             │ │                 │
│ │ Required for verification        │ │                 │
│ │ [CLICK TO UPLOAD]                │ │                 │
│ └──────────────────────────────────┘ │                 │
│                                      │                 │
│ MY DOCUMENTS                         │                 │
│ ┌──────────────────────────────────┐ │                 │
│ │ 📄 Lab_Results_Dec2025.pdf       │ │                 │
│ │ Lab Results | Uploaded Dec 10    │ │ [Audit log]     │
│ │ [✓ Approved]                     │ │                 │
│ │ [View] [Download] [Delete]       │ │                 │
│ └──────────────────────────────────┘ │                 │
│                                      │                 │
│ ┌──────────────────────────────────┐ │                 │
│ │ 📄 Prescription_Metformin.jpg    │ │                 │
│ │ Prescription | Uploaded Dec 5    │ │                 │
│ │ [⏱ Pending Review]               │ │                 │
│ │ [View] [Download] [Delete]       │ │                 │
│ └──────────────────────────────────┘ │                 │
│                                      │                 │
│ ┌──────────────────────────────────┐ │                 │
│ │ 📄 Insurance_Card_2024.png       │ │                 │
│ │ Insurance | Uploaded Jan 2024    │ │                 │
│ │ [⚠ Expires Dec 31, 2024]         │ │                 │
│ │ [View] [Download] [Replace]      │ │                 │
│ └──────────────────────────────────┘ │                 │
└──────────────────────────────────────┴─────────────────┘
```

## Critical Questions

- **Upload method:** File picker only or include camera option (mobile)? → **A) Both (file picker + camera on mobile)**
- **Document review:** Automatic approval or staff review required? → **A) Staff review for sensitive docs (insurance, ID), auto-approve for others**
- **File types:** Allow all or restrict to specific formats? → **A) Images (jpg, png), PDFs only. Max 10MB per file**