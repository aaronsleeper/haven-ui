# Figma North Star — Aaron's Original Aesthetic

The original Figma mockups for Cena Health (Platform Design file) represent the emotional target for Haven. They predate the formalized brand token system and carry design intent that the tokens partially captured but partially lost during systematization.

## Figma source files

- **Platform Design:** `figma.com/design/FCiLNAABRkwUV2LyGPRW3K`
  - Node 338:1491 — Patient dashboard (clinical view)
  - Node 350:6926 — Appointments (chat + dashboard)
  - Node 351:11138 — Home (greeting + prompt + cards)
- **Investor Deck slides:** `figma.com/design/opvzZC7Ds38MNwRFvFuKZe` (page 915:344)

## Key gaps between mockups and formalized tokens

| Element | Figma mockups | Brand token system | Impact |
|---|---|---|---|
| Background | `#F5EEE5` (stone/50) | `#FBFAF8` (warm-950) | Figma is dramatically warmer — visible sand vs barely-there off-white |
| Heading font | Lora (serif) | Plus Jakarta Sans (sans) | Lora carries organic warmth as a humanist serif — the single biggest aesthetic difference |
| Body font | Inter | Source Sans 3 | Different typeface |
| Text color | `#040301` (near-black, warm) | `#0D322D` (chromatic dark teal) | Near-black vs green-tinted dark |
| Muted text | `#52432A` (warm brown) | `#5B544C` (warm neutral) | Figma is warmer/more amber |
| Faint text | `#806F56` (amber) | — | A whole register the tokens don't capture |
| Teal accent | `#337A6E` (teal/700) | `#1B685E` (teal-400) | Different point on the teal scale |
| Warm gradient | Peach elliptical blobs at bottom | Not in tokens | The emotional centerpiece of warmth in the mockups |

## Typography hierarchy from the mockups

The investor deck crystallized the presentation voice:

- **Section overlines** — small, teal or warm brown, Inter SemiBold, sometimes uppercase
- **Main headings** — Lora Bold, large, near-black `#040301`. Commands attention.
- **Subheadings** — Lora lighter weight, sometimes teal, sometimes italic
- **Body text** — Inter Regular, `#040301`
- **Bold emphasis** — Inter Bold inline
- **Pull quotes / impact lines** — Lora Italic
- **Stats** — Large Inter SemiBold numbers

Formula: **Lora commands, Inter works, teal punctuates.**

## Design system token variables from Figma

Extracted from the Figma design context:

```
--stone/50:  #f5eee5    (page background)
--stone/100: #eee6db    (card/elevated surfaces)
--stone/150: #e7ded2    (secondary borders)
--stone/200: #dfd5c9    (user message bubbles)
--stone/250: #d8cec0    (button borders, default border)

--teal/350:  #71c0b2    (decorative/illustration)
--teal/500:  #52a395    (provider accent border)
--teal/700:  #337a6e    (primary button, interactive)
--teal/750:  #2d6f64    (button border/pressed)

--text/on-light/normal: #040301  (primary text)
--text/on-light/muted:  #52432a  (secondary text)
--text/on-light/faint:  #806f56  (tertiary text)

--border/default: #d8cec0
--border/image:   rgba(4,3,1,0.1)

--surface/primary/enabled: white  (card interiors)
```

## What this means for Haven implementation

The formalized token system (in `cena-health-brand/_tokens/`) made correct architectural decisions — semantic layering, OKLCH as canonical, accessibility constraints. But the aesthetic temperature drifted cooler during systematization. The mockups are the compass for where the aesthetic should go.

Specifically:
1. **The warm stone palette** (`#F5EEE5` family) should inform surface colors — the current `#FBFAF8` is too subtle
2. **Lora for display/heading contexts** should be considered alongside Plus Jakarta Sans — or the warmth Plus Jakarta Sans loses compared to Lora should be compensated elsewhere
3. **The text color stack** (`#040301` / `#52432A` / `#806F56`) is warmer than the current token stack and may better serve the "grew, not built" quality test

These are not mandates — the token system has its own coherence. But when evaluating whether Haven "feels right," these mockups are the reference point.

## How this was discovered

April 2026: while building themed document templates for the `/share` skill, the Haven Visual Designer expert identified that the doc template using brand tokens felt "correct but cold." Aaron shared his original Figma mockups, revealing the aesthetic gap. The Figma MCP extracted the actual design variables, confirming the palette divergence.
