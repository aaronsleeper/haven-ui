# Payment Management

**Parent Navigation:** Billing & Insurance

## Screen Overview

Patients manage payment methods, view billing history, access invoices and receipts, and update responsible party information. They can add/edit credit cards, review past payments, download financial records, and get Ava's help with billing questions.

## Features on Screen

- **Responsible Party Info** - Name, relationship to patient, contact info. Edit button to update.
- **Payment Methods** - List of cards on file showing last 4 digits, card type, expiration date, default badge. Actions: Set as default, Edit, Remove, Add new.
- **Payment History** - Chronological list of payments with date, amount, description, payment method used, status (Paid, Pending, Failed). Click for receipt.
- **Invoices** - List of invoices with invoice number, date, amount, status (Paid, Outstanding, Overdue). Download PDF button.
- **Receipts** - Access receipts for individual payments. Download as PDF.
- **Download All Data** - Export complete financial history as CSV or PDF for tax/records purposes.
- **Auto-Pay Settings** - Toggle automatic payment for recurring charges. Shows next scheduled payment.

**Key data:** paymentMethodId, cardLast4, expirationDate, paymentDate, amount, invoiceNumber, status

## Ava Integration

**Payment failed:** "I noticed your payment for invoice #12345 failed. Would you like to update your payment method or try again?"

**New invoice:** "You have a new invoice for $120 due Dec 20. Want me to set up auto-pay so you never miss a payment?"

**Balance inquiry:** "Your current balance is $0. All invoices are paid. Need a receipt for anything?"

## Wireframe

```
┌──────────────────────────────────────┬─────────────────┐
│ Payment Management                   │ Ava Chat        │
├──────────────────────────────────────┤                 │
│ RESPONSIBLE PARTY                    │ "Your current   │
│ Name: John Doe                       │ balance is $0.  │
│ Relationship: Self                   │ All paid."      │
│ [Edit Info CLICK]                    │                 │
│                                      │ [Chat input]    │
│ PAYMENT METHODS                      │                 │
│ ┌──────────────────────────────────┐ │                 │
│ │ Visa •••• 1234                   │ │                 │
│ │ Expires: 12/2026  [Default]      │ │                 │
│ │ [Edit] [Remove]                  │ │                 │
│ └──────────────────────────────────┘ │                 │
│ ┌──────────────────────────────────┐ │ [Audit log]     │
│ │ Mastercard •••• 5678             │ │                 │
│ │ Expires: 08/2025                 │ │                 │
│ │ [Set as Default] [Edit] [Remove] │ │                 │
│ └──────────────────────────────────┘ │                 │
│ [Add Payment Method CLICK]           │                 │
│                                      │                 │
│ PAYMENT HISTORY                      │                 │
│ ┌──────────────────────────────────┐ │                 │
│ │ Dec 1, 2025 - $120.00 [Paid ✓]   │ │                 │
│ │ Meal delivery (Visa •••• 1234)   │ │                 │
│ │ [View Receipt]                   │ │                 │
│ └──────────────────────────────────┘ │                 │
│                                      │                 │
│ INVOICES                             │                 │
│ ┌──────────────────────────────────┐ │                 │
│ │ #INV-12346 - Dec 15 - $120 [Due] │ │                 │
│ │ [Pay Now] [Download PDF]         │ │                 │
│ └──────────────────────────────────┘ │                 │
│                                      │                 │
│ [Download All Financial Data CLICK]  │                 │
└──────────────────────────────────────┴─────────────────┘
```

## Critical Questions

- **Auto-pay default:** Opt-in or opt-out for new patients? → **A) Opt-in (patient must enable)**
- **Payment retry:** Auto-retry failed payments? → **A) Yes, retry once after 3 days, then notify patient**
- **Financial export:** Include what data in export? → **A) All payments, invoices, insurance claims for selected date range**