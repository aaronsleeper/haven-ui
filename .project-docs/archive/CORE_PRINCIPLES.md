# Patients App - Core Principles

## Overview

This document contains important principles that must be observed throughout the application.

---

## Principles

### 1. Audit Trail (Field-Level Change Log)

**Requirement:** Every modification to patient data must be immutably logged with:

- Previous value and new value
- User ID and role of the editor
- Timestamp (ISO 8601 format with timezone)
- Context (e.g., "Ava-assisted edit", "Manual UI edit", "System update")

**Implementation Notes:**

- Audit logs must be append-only and tamper-evident
- Logs themselves require elevated permissions to access
- Consider HIPAA audit requirements for retention periods

### 2. Ava AI Assistant (Conversational Co-Pilot)

**Permission Model:** Ava operates under explicit, session-scoped authorization

- Permission is **never persistent** - must be granted per interaction
- Ava requests permission for specific field(s) before any write operation
- User must explicitly confirm edits before they are committed

**Workflow:**

1. User makes request to Ava
2. Ava interprets and presents planned changes in human-readable format
3. User reviews and either: confirms, requests modifications, or cancels
4. Upon confirmation, Ava executes changes and provides confirmation summary
5. All Ava-editable fields must also be editable via standard UI

**Security Considerations:**

- Ava inherits the requesting user's permission scope (cannot escalate privileges)
- All Ava actions are logged with AI-assisted context in audit trail
- Consider rate limiting and anomaly detection for AI-driven edits

### 3. Zero-Trust Data Access (Field-Level Permissions)

**Core Principle:** Default-deny access model - no user can view or modify data without explicit permission grants

**Access Control Requirements:**

- **Granularity:** Permissions enforced at the field level, not just resource level
- **Role-Based + Attribute-Based:** Combine RBAC (role-based) with ABAC (attribute-based) controls
  - Example: A coordinator role may see appointment times but not clinical notes
  - Example: A provider can only see patients assigned to their care team
- **Least Privilege:** Users receive minimum permissions necessary for their function
- **Separation of Duties:** Sensitive operations require multiple roles or approval workflows

**Implementation Guidelines:**

- **Server-side enforcement only:** Never rely on client-side permission checks
- **API responses:** Filter data before transmission - never send fields the user cannot access
- **Database queries:** Apply row-level security (RLS) and column-level permissions
- **Fail secure:** If permissions cannot be determined, deny access
- **Permission inheritance:** Child resources inherit parent restrictions (e.g., if user cannot access patient record, they cannot access any nested data)

**Example Access Scenarios:**

- Provider A can view Patient X's medical history (assigned provider)
- Provider B cannot view Patient X's data (not assigned)
- Coordinator C can view Patient X's contact info and appointments, but not clinical notes
- Coordinator C cannot view privileged provider-patient communications

**Audit & Monitoring:**

- Log all permission checks (both grants and denials)
- Alert on unusual access patterns or permission escalation attempts
- Regular permission audits to identify over-provisioned access

### 4. Consistent Date and Time Formatting

**Core Principle:** All dates and times must follow a consistent, human-readable format throughout the application.

**Standard Formats:**

- **Full format:** `Tue Dec 9 2025 at 1:45 PM Pacific`
  - Use for: Appointments, official timestamps, audit logs, detailed views
  - Pattern: `[Day] [Month] [Date] [Year] at [Time] [Timezone]`
- **Contextual short formats:** Adapt based on context and space constraints
  - **Date only:** `Dec 9` - Use in chat history, timeline views, compact lists
  - **Time only:** `1:45 PM` - Use when date is implicit (same-day items)
  - **Relative:** "Today at 1:45 PM", "Yesterday" - Use for recent activity

**Implementation Guidelines:**

- Always store dates in UTC with timezone information in the database
- Display dates in the user's local timezone or facility timezone as appropriate
- Include timezone indicator when showing absolute times
- For HIPAA audit logs, use ISO 8601 format with full timezone (as per Principle #1)
- Ensure consistent formatting across all UI components, notifications, and exports

**Accessibility Considerations:**

- Use semantic HTML time elements with machine-readable datetime attributes
- Ensure date formats are unambiguous (avoid MM/DD vs DD/MM confusion)
- Support screen readers with proper ARIA labels for date/time information
