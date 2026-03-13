# SyncStatusBadge

**Type:** Badge / Status Indicator

**Purpose:** Visual indicator displaying device sync status at a glance

**Usage:** Used within DeviceCard and DeviceDetailsModal to show current sync state

---

## Data Fields

- `status` (Enum) - Current sync status
  - Values: "Active" | "Syncing" | "Error" | "Disconnected"
  - Required
- `lastSyncTime` (DateTime, optional) - Timestamp of last sync
  - Used for tooltip or additional context
  - Optional

---

## Visual Structure (SVG)

### Active Status
```svg
<svg viewBox="0 0 110 30" xmlns="http://www.w3.org/2000/svg">
  <rect x="0" y="0" width="110" height="30" fill="#10b981" rx="4"/>
  <text x="15" y="19" font-size="12" font-weight="600" fill="#ffffff">Active ✓</text>
</svg>
```

### Syncing Status
```svg
<svg viewBox="0 0 110 30" xmlns="http://www.w3.org/2000/svg">
  <rect x="0" y="0" width="110" height="30" fill="#3b82f6" rx="4"/>
  <circle cx="20" cy="15" r="8" stroke="#ffffff" stroke-width="2" fill="none" opacity="0.8">
    <animate attributeName="stroke-dasharray" values="0 50;50 0" dur="1s" repeatCount="indefinite"/>
    <animateTransform attributeName="transform" type="rotate" from="0 20 15" to="360 20 15" dur="1s" repeatCount="indefinite"/>
  </circle>
  <text x="35" y="19" font-size="12" font-weight="600" fill="#ffffff">Syncing...</text>
</svg>
```

### Error Status
```svg
<svg viewBox="0 0 110 30" xmlns="http://www.w3.org/2000/svg">
  <rect x="0" y="0" width="110" height="30" fill="#ef4444" rx="4"/>
  <text x="15" y="19" font-size="12" font-weight="600" fill="#ffffff">Error ⚠</text>
</svg>
```

### Disconnected Status
```svg
<svg viewBox="0 0 130 30" xmlns="http://www.w3.org/2000/svg">
  <rect x="0" y="0" width="130" height="30" fill="#6b7280" rx="4"/>
  <text x="15" y="19" font-size="12" font-weight="600" fill="#ffffff">Disconnected</text>
</svg>
```

---

## States

### Active
- **Visual:** Green background (#10b981), white text, checkmark icon ✓
- **Meaning:** Device is connected and syncing normally
- **Icon:** ✓ (checkmark)

### Syncing
- **Visual:** Blue background (#3b82f6), white text, animated spinner
- **Meaning:** Device is currently syncing data
- **Icon:** Animated spinner or sync icon 🔄
- **Animation:** Continuous rotation or pulse

### Error
- **Visual:** Red background (#ef4444), white text, warning icon ⚠
- **Meaning:** Sync failed or connection issue
- **Icon:** ⚠ (warning triangle)

### Disconnected
- **Visual:** Gray background (#6b7280), white text, disconnect icon
- **Meaning:** Device authorization revoked or connection lost
- **Icon:** No icon or disconnect symbol

---

## Interactions

- **Hover (optional):** Show tooltip with last sync time and additional context
  - Example: "Last synced: 2 hours ago (Dec 11 at 9:15 AM)"
- **Click (optional):** Could trigger detailed sync status modal or expand inline details

---

## Accessibility

- **ARIA Labels:**
  - `role="status"` for status badges
  - `aria-label` describing full status
    - Active: "Sync status: Active, last synced [time]"
    - Syncing: "Sync status: Currently syncing"
    - Error: "Sync status: Error, sync failed"
    - Disconnected: "Sync status: Disconnected"
- **Visual Requirements:**
  - Do not rely solely on color - must include text label and/or icon
  - Sufficient color contrast (white text on colored background meets WCAG AA)
- **Screen Reader Support:**
  - Status changes announced dynamically with `aria-live="polite"`
  - Icon meanings conveyed through aria-label, not just visual

---

## Color Palette

| Status       | Background | Text    | Icon    |
| ------------ | ---------- | ------- | ------- |
| Active       | #10b981    | #ffffff | ✓       |
| Syncing      | #3b82f6    | #ffffff | spinner |
| Error        | #ef4444    | #ffffff | ⚠       |
| Disconnected | #6b7280    | #ffffff | none    |

---

## Animation Details

### Syncing Animation

Two animation options:

**Option A: Rotating Spinner**
- Circular icon rotates 360° continuously
- Duration: 1-2 seconds per rotation
- Smooth, constant rotation

**Option B: Pulsing**
- Badge opacity or scale pulses
- Duration: 1.5 seconds per pulse
- Ease-in-out timing

Choose spinner for active data transfer indication, pulse for less distracting ambient indication.

---

## Usage Examples

### In DeviceCard
```
[Device Icon] Withings Body+              [Active ✓]
Smart Scale                               Last synced: 2 hours ago
```

### In DeviceDetailsModal
```
Status: [Active ✓]
Last Sync: 2 hours ago (Dec 11 at 9:15 AM)
```

### Error State with Context
```
Status: [Error ⚠]
Last Sync: 3 days ago (Dec 8 at 9:15 AM)
Error: Authorization expired. Please re-authorize.
```

---

## Notes

- Badge should have rounded corners (border-radius: 4-6px)
- Text should be bold for readability
- Icon should be visually balanced with text
- Consider subtle shadow for elevation
- Badge width should accommodate longest text ("Disconnected")
- Maintain consistent padding (8-12px horizontal, 6-8px vertical)
