# Component Registry

This registry lists all reusable UI components for the Cena Health patients application. Each component has a detailed specification file in this directory.

---

## Global Components

### Ava Chat Components
- **AvaChatPane** - [View specs](./AvaChatPane.md) - Persistent right-side chat interface (always visible)
- **AvaChatMessages** - [View specs](./AvaChatMessages.md) - Scrollable message history
- **AvaChatInput** - [View specs](./AvaChatInput.md) - Text input for patient messages
- **AvaActionLog** - [View specs](./AvaActionLog.md) - Collapsible audit trail blocks

### Navigation Components
- **PrimaryNav** - [View specs](./PrimaryNav.md) - Main navigation sidebar/bottom bar
- **ScreenHeader** - [View specs](./ScreenHeader.md) - Page title and context actions

---

## Screen-Specific Components

### Appointments
- **AppointmentList** - [View specs](./AppointmentList.md)
- **AppointmentCard** - [View specs](./AppointmentCard.md)
- **AppointmentDetailsModal** - [View specs](./AppointmentDetailsModal.md)
- **ScheduleAppointmentModal** - [View specs](./ScheduleAppointmentModal.md)
- **PrepChecklistModal** - [View specs](./PrepChecklistModal.md)

### Device Integration
- **DeviceList** - [View specs](./DeviceList.md)
- **DeviceCard** - [View specs](./DeviceCard.md)
- **DeviceDetailsModal** - [View specs](./DeviceDetailsModal.md)
- **ConnectDeviceModal** - [View specs](./ConnectDeviceModal.md)
- **SyncStatusBadge** - [View specs](./SyncStatusBadge.md)

### Home Dashboard
- **ProgressOverviewCard** - [View specs](./ProgressOverviewCard.md)
- **QuickActionsPanel** - [View specs](./QuickActionsPanel.md)
- **ActivityTimelinePreview** - [View specs](./ActivityTimelinePreview.md)
- **MealDeliveryCard** - [View specs](./MealDeliveryCard.md)
- **MessagePreviewCard** - [View specs](./MessagePreviewCard.md)
- **ContentSuggestionCard** - [View specs](./ContentSuggestionCard.md)
- **ContentSuggestionsPanel** - [View specs](./ContentSuggestionsPanel.md)

### Health Data
- **HealthMetricsList** - [View specs](./HealthMetricsList.md)
- **HealthMetricCard** - [View specs](./HealthMetricCard.md)
- **MetricDetailView** - [View specs](./MetricDetailView.md)
- **LogDataModal** - [View specs](./LogDataModal.md)
- **HealthDataChart** - [View specs](./HealthDataChart.md)
- **DataSourceBadge** - [View specs](./DataSourceBadge.md)
- **MetricEducationCard** - [View specs](./MetricEducationCard.md)

---

## Form Components
- **Button** - [View specs](./Button.md)
- **DateTimePicker** - [View specs](./DateTimePicker.md)
- **Dropdown** - [View specs](./Dropdown.md)
- **TextInput** - [View specs](./TextInput.md)
- **Checkbox** - [View specs](./Checkbox.md)

---

## Layout Components
- **Modal** - [View specs](./Modal.md)
- **Card** - [View specs](./Card.md)
- **List** - [View specs](./List.md)
- **EmptyState** - [View specs](./EmptyState.md)

---

## Notes
- All components must follow accessibility standards (WCAG 2.1 AA)
- Components should be responsive and work across desktop, tablet, and mobile
- When creating new components, add them to this registry
- Always check this registry before creating new components to avoid duplication