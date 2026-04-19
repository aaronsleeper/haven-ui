# Domain Knowledge

## What "feels like Haven" means

Haven's brand voice is **warm + specific + playful + stress-literate**. Every surface earns its warmth by being specific to the patient's context. Generic positivity reads as inauthentic; observational specificity lands.

### Visual signals that say "this is Haven"

- **Stone + teal + Lora pairing** — warm surface palette with serif-headings-on-sans-body typographic contrast
- **Translucent white panes over stone bg** — layered surface depth without hard edges
- **Page floats** — 3px `stone/150` outer border + `border-radius/md 11px` on the shell container; apps live inside a frame, not edge-to-edge
- **Rich font-feature settings on Inter** — ss01/ss03/ss04/cv01–cv11/dlig/frac enabled; gives the typographic polish
- **Lora for headings** — warmth and humanity in type; Inter alone reads cold
- **Ava's bubble avatar in chat** — distinctive, organic, non-human; marks agent presence
- **Measurement cards on solid white over stone bg** — crisp data hierarchy
- **Coach-mark cards with image top + copy + CTA + close** — reward-forward, earns attention

### Visual signals that say "this is NOT Haven"

- Pure white page background
- Bootstrap/Material default shadows (flat or uniform)
- Sans-only typography stack
- Primary teal on every interactive element (dilutes commitment signal)
- Active nav state as background fill (breaks the weight-only rule)
- FA icons replacing the Ava avatar in chat
- Hard-edged panes without translucency
- Dense-by-default layouts ignoring `data-density`
- Clinical / sterile copy ("Submit," "Are you sure you want to proceed?")

## Voice patterns

### Warm greeting
- Observes a specific action the user took
- Names what's positive about it, briefly
- Leaves the conversational door open
- Sample: *"¡Hola Maria! How are you feeling today? I noticed you logged your weight this morning - great job!"*

### Recommended content titles
- Assertion-framed, not question-framed
- Specific cultural/emotional reference
- Plain language ("Real Talk") over clinical ("Guidance Document")
- Sample: *"Why Your Abuela Was Right About Eating Together"*

### Reward-forward moments
- Reference the specific thing the user achieved
- Use informal register to land emotion
- Sample: *"Your A1C dropped like it's hot"*

### Destructive confirmations
- Repetition as warmth ("absolutely sure")
- Not sterile, not hedged
- Sample: *"Are you sure absolutely sure?"*

### Prompt placeholders
- Invitation, not instruction
- Italic treatment
- Sample: *"You talk. I'll listen."*

## Primary teal discipline

`teal/700 #337a6e` is the primary action color. Reserve it for:
- User commits that change state — "Book my visit," "Schedule Appointment"
- Destructive confirms — "Continue" in a dialog context
- Send actions — "Send" in chat, mic activation

Don't use it for:
- Advancement — "Next" in a multi-step form (use secondary stone)
- Navigation — nav items, breadcrumbs (use weight/muted treatment)
- Informational buttons — "Learn more," "View details" (use tertiary or secondary)

The rule: teal earns its weight by being rare. Overuse kills the commitment signal.

## Haven's surface hierarchy

1. **Page** — `stone/50 #f5eee5` (never white)
2. **Shell container** — outer border `3px stone/150` + `border-radius/md`
3. **Panes** — translucent white over stone (`rgba(255,255,255,0.6)` nav, slightly lower opacity when bg has blob imagery)
4. **Cards** — solid white or `stone/100`, `border-radius/sm` or `md`, no visible shadow at rest
5. **Elevated surfaces** (coach-marks, dialogs, notifications) — `elevation/02` or `elevation/03`, stone-family bg

Shadows are warm-black (`rgba(4,3,1, <opacity>)`) — not pure black — because Haven's visual world is warm.
