# SHELL: Bottom Tab Bar

**Application:** Patient Portal (Mobile)
**Use Case(s):** All post-onboarding screens
**User Type:** Patient
**Device:** Mobile-first
**Route:** Persistent across `/meals`, `/deliveries`, `/care-team/*`, `/profile`

## Page Purpose

Provide persistent, always-accessible primary navigation across the four main sections of the patient app.

---

## Layout Structure

### Component
- **Component:** Fixed bottom bar, `position: fixed; bottom: 0; left: 0; right: 0`
- Height: 64px; `padding-bottom: env(safe-area-inset-bottom)` for iOS home indicator
- Background: `bg-white border-t border-gray-200`
- Shadow: `shadow-lg`
- Z-index: above all content, below modals and bottom sheets

### Tab Items
Four tabs in a horizontal row, equal width (`grid grid-cols-4`):

| Tab | Icon | Label | Route | Badge |
|-----|------|-------|-------|-------|
| Meals | `fa-bowl-food` | "Meals" | `/meals` | None |
| Delivery | `fa-truck` | "Delivery" | `/deliveries` | None |
| Care Team | `fa-comments` | "Care Team" | `/care-team/messages` | Unread message count |
| Profile | `fa-circle-user` | "Profile" | `/profile` | None |

### Tab Item Anatomy
- **Component:** Full-height tappable area, `flex flex-col items-center justify-center gap-1`
- Icon: `text-xl`, `text-gray-400` inactive / `text-primary-600` active
- Label: `text-xs`, `text-gray-400` inactive / `text-primary-600 font-medium` active
- Active indicator: icon + label color change only (no underline or background fill)
- Touch target: full tab area (64px height exceeds 44px minimum)

### Badge (Care Team tab only)
- **Component:** `bg-error-500 text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center`
- Positioned: absolute, top-right of the icon
- Shows unread message count; hidden when 0; displays "9+" when count exceeds 9

---

## Behavior

### Active State
Tab corresponding to the current route shown in active state (primary color). Route matching: `/meals`, `/deliveries`, `/care-team/*`, `/profile`.

### Navigation
- Tapping an inactive tab navigates to that section's default screen
- Tapping the active tab scrolls the current screen to the top (standard mobile pattern)

### Visibility
- **Shown:** All post-onboarding screens
- **Hidden:** All onboarding screens (`/onboarding/*`)
- **Covered (not hidden):** When a bottom sheet overlay is open

---

## Interaction Specifications

### Tab Tap (inactive)
- **Trigger:** Patient taps an inactive tab
- **Feedback:** Active state transitions immediately; navigates to section default screen

### Tab Tap (active)
- **Trigger:** Patient taps the current active tab
- **Feedback:** Screen scrolls to top (native animation)

### Badge
- Unread count updates when new care team messages arrive; badge becomes visible if previously 0
- If count fails to load: badge hidden silently (informational, not functional)

---

## Accessibility Notes
- Each tab: `aria-label` including section name and badge count -- e.g., `aria-label="Care Team, 3 unread messages"` or `aria-label="Meals"`
- Active tab: `aria-current="page"`
- Tab bar wrapped in `<nav aria-label="Main navigation">`
- Icon + text label on every tab (never icon alone)

## Bilingual Considerations
- Tab labels in Spanish: "Comidas" | "Entrega" | "Mi equipo" | "Perfil"
- Badge `aria-label` in patient's language: "3 mensajes sin leer"

## Open Questions
- Should the Delivery tab show a visual indicator (dot) when a delivery is active today?
- If a 5th section is added post-MVP, tab bar moves to a "More" overflow pattern -- note as a known constraint for Andrey.
