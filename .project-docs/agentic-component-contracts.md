# Agentic UI — Component Data Contracts

Defines the payload shape for each component the agent can render in the content panel. The agent sends a message with:

```json
{ "type": "ui", "component": "ComponentName", "data": { ... } }
```

The frontend component router maps `component` to a pre-built Haven component and passes `data` as props.

## Conventions

- Fields marked `?` are optional
- `action` objects define buttons/links the agent can attach: `{ label, action_id, style? }`
- `style` on actions: `"primary"` | `"outline"` | `"danger"` — defaults to `"outline"`
- `status` fields use a closed set: `"active"` | `"pending"` | `"complete"` | `"cancelled"` | `"urgent"`
- All monetary values are numbers (cents or dollars TBD with Andrey)
- All dates are ISO 8601 strings
- `id` fields are always strings

---

## Content Cards

### MealCard

Single meal item for browsing/ordering.

```
{
  id:            string
  name:          string
  description:   string
  price:         number
  image_url?:    string
  dietary_tags?: string[]        // e.g. ["gluten-free", "halal"]
  available:     boolean
  kitchen_name?: string
  actions?:      action[]        // e.g. [{ label: "Add to basket", action_id: "add_to_basket" }]
}
```

### PatientSummary

At-a-glance view of a patient record.

```
{
  id:              string
  name:            string
  age?:            number
  preferred_lang?: string
  phone?:          string
  flags?:          string[]      // e.g. ["diabetic", "low-sodium"]
  provider_name?:  string
  stats?:          { label: string, value: string }[]
  actions?:        action[]
}
```

### CarePlanCard

Overview of a patient's care plan.

```
{
  id:            string
  patient_name:  string
  plan_name:     string
  status:        status
  goals?:        string[]
  updated_at?:   string          // ISO date
  assigned_to?:  string
  actions?:      action[]
}
```

### KitchenCard

Kitchen summary for selection or review.

```
{
  id:            string
  name:          string
  cuisine_type?: string
  area?:         string          // service area or address
  available:     boolean
  meal_count?:   number          // meals available this week
  image_url?:    string
  actions?:      action[]
}
```

### OrderCard

Summary of a single order.

```
{
  id:            string
  order_number:  string
  status:        status
  items:         { name: string, quantity: number, price: number }[]
  total:         number
  placed_at?:    string          // ISO date
  delivery_at?:  string          // ISO date
  kitchen_name?: string
  patient_name?: string
  actions?:      action[]
}
```

---

## Lists

### MenuGrid

Collection of meals displayed as a browsable grid.

```
{
  kitchen_name:  string
  week_label?:   string          // e.g. "This Week", "Apr 7–11"
  meals:         MealCard.data[]
}
```

### BasketReview

Current order basket with budget tracking.

```
{
  items:            { id: string, name: string, quantity: number, price: number }[]
  subtotal:         number
  budget_total:     number
  budget_remaining: number
  meals_remaining?: number
  actions?:         action[]     // e.g. [{ label: "Place order", action_id: "confirm_order", style: "primary" }]
}
```

### QueueList

Prioritized list of items needing human action.

```
{
  title?:   string               // e.g. "Pending Approvals"
  items:    {
    id:          string
    title:       string
    subtitle?:   string
    urgency?:    "urgent" | "normal" | "low"
    agent_name?: string          // which agent is waiting
    timestamp?:  string
    actions?:    action[]
  }[]
}
```

### DataTable

Tabular data with optional striping, sorting, and monospace columns.

```
{
  title?:     string
  columns:    {
    key:       string
    label:     string
    align?:    "left" | "center" | "right"    // default: "left"
    mono?:     boolean                         // render in monospace
    sortable?: boolean
  }[]
  rows:        Record<string, string | number | boolean>[]
  striped?:    boolean           // default: true
  compact?:    boolean           // tighter row padding
  actions?:    action[]          // table-level actions (e.g. "Export")
  row_action?: {                 // makes rows clickable
    action_id: string
    id_field:  string            // which row field to pass as the clicked ID
  }
}
```

---

## Data Visualization

### StatGroup

Row of key metrics.

```
{
  stats: {
    label:    string
    value:    string              // pre-formatted: "$45.00", "3", "82%"
    delta?:   string              // e.g. "+5%", "-2 meals"
    trend?:   "up" | "down" | "flat"
    icon?:    string              // FontAwesome icon name, e.g. "fa-dollar-sign"
  }[]
}
```

### TrendChart

Single metric over time.

```
{
  title:       string
  metric_label: string
  unit?:       string             // e.g. "$", "lbs", "meals"
  data_points: { date: string, value: number }[]
  chart_type?: "line" | "bar"     // default: "line"
  goal_line?:  number             // horizontal reference line
}
```

### ComparisonBar

Side-by-side values for comparison.

```
{
  title?:  string
  items:   {
    label:   string
    value:   number
    max?:    number               // if provided, renders as a progress bar
    color?:  string               // Haven color token name, e.g. "teal-500"
    unit?:   string
  }[]
}
```

---

## Forms and Input

### SimpleForm

Structured input collection.

```
{
  title?:       string
  description?: string
  fields:       {
    key:          string
    label:        string
    type:         "text" | "number" | "email" | "tel" | "date" | "textarea" | "select"
    placeholder?: string
    required?:    boolean
    value?:       string | number           // pre-filled value
    options?:     { label: string, value: string }[]  // for select type
  }[]
  submit_action: action
  cancel_action?: action
}
```

### ChoicePicker

Single or multi-select from a visual set of options.

```
{
  title?:       string
  description?: string
  mode:         "single" | "multi"
  options:      {
    value:       string
    label:       string
    description?: string
    icon?:       string           // FontAwesome icon name
    disabled?:   boolean
  }[]
  selected?:    string[]          // pre-selected values
  submit_action: action
}
```

### ConfirmAction

Agent requests human approval before executing.

```
{
  title:        string            // e.g. "Confirm Order"
  description:  string            // what the agent is about to do
  details?:     { label: string, value: string }[]  // summary key-value pairs
  warning?:     string            // optional caution message
  confirm_action: action          // style defaults to "primary"
  cancel_action:  action
}
```

---

## Status and Feedback

### Receipt

Completed action confirmation.

```
{
  title:         string           // e.g. "Order Confirmed"
  icon?:         string           // FontAwesome icon, e.g. "fa-circle-check"
  reference_id?: string           // order number, confirmation code
  summary:       { label: string, value: string }[]
  timestamp?:    string
  actions?:      action[]         // e.g. "View order", "Return to menu"
}
```

### ProgressTracker

Multi-step process visualization.

```
{
  title?:    string
  steps:     {
    label:    string
    status:   "complete" | "active" | "pending"
    detail?:  string
  }[]
}
```

### AlertBanner

Status message at the top of the content panel.

```
{
  type:       "success" | "warning" | "error" | "info"
  title:      string
  message?:   string
  dismissible?: boolean
  actions?:   action[]
}
```

---

## Rich Content

### CodeView

Preformatted text with copy support.

```
{
  title?:     string
  content:    string              // the raw text/markdown/code
  language?:  string              // hint for highlighting: "markdown", "json", etc.
  copyable?:  boolean             // default: true — shows copy-to-clipboard button
  wrap?:      boolean             // default: false — horizontal scroll vs. line wrap
}
```

### InfoPanel

Reference content the agent surfaces.

```
{
  title:       string
  body:        string             // rendered as HTML or markdown
  image_url?:  string
  source?:     string             // attribution, e.g. "USDA Dietary Guidelines"
  actions?:    action[]
}
```

### Timeline

Chronological event list.

```
{
  title?:   string
  events:   {
    timestamp:  string
    title:      string
    detail?:    string
    icon?:      string
    actor?:     string            // who/what caused the event
    type?:      "system" | "human" | "agent"
  }[]
  order?:   "newest_first" | "oldest_first"   // default: "newest_first"
}
```
