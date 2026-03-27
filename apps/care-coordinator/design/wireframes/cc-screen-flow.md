# Screen Flow: Care Coordinator Queue Triage

## Screens in This Feature

| ID | Name | Route | Persona | Shell |
|----|------|-------|---------|-------|
| CC-SHELL | Admin App Shell | `/care-coordinator/` | Care Coordinator | Three-panel layout |
| CC-QUEUE | Queue Sidebar | *(persistent left panel)* | Care Coordinator | Part of shell |
| CC-SUMMARY | Morning Summary | `/care-coordinator/` (default center) | Care Coordinator | CC-SHELL center |
| CC-THREAD | Thread Panel | *(persistent right panel)* | Care Coordinator | Part of shell |

## Navigation Flows

- App opens → CC-SHELL loads → CC-QUEUE (left) + CC-SUMMARY (center) + CC-THREAD empty (right)
- Click queue item → CC-QUEUE (item highlighted) + record loads (center) + CC-THREAD loads (right)
- Approve item → queue item removed → next item highlights → center/right stay or clear
- Click "Patients" in sidebar nav → patient list (center) + CC-THREAD empty (right)
- Click patient in list → record (center) + CC-THREAD loads (right)

## Shared Shell Components

- `cc-shell` — three-panel layout (left ~240px, center flex, right ~380px)
- `cc-queue` — left sidebar (queue items + nav)
- `cc-thread` — right panel (thread messages + approval cards + input)

## Out of Scope

- Patient List view (CC-PATIENTS) — separate feature, not in this sprint
- Record viewer center panel content — varies by item type, each is its own wireframe set
- Settings, Reports — future screens
