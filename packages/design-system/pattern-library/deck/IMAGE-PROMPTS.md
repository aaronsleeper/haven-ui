# Image Prompts — Cena Deck (FPO)

Gemini generation prompts for **For-Placement-Only** imagery in Cena decks. Mirrors the proven CAA SB54 method (`Lab/caa-campaign-section/IMAGE-PROMPTS.md`): the deck is drafted with FPO placeholders; each placeholder has a numbered prompt here; Aaron runs it in Gemini and returns the image; it drops into the slot.

## How to run these

1. Copy the **Persistent context** block once.
2. Copy the **one numbered prompt** for the slot you're generating (context first, then the prompt).
3. Do **not** paste the whole file — pasting layout/context notes makes Gemini bake page chrome into the image.
4. Return the image; it lands at `deck/assets/img/<NN>-<slug>.webp` and the FPO placeholder is replaced with `<img>`.

## Where the engine sits in the pipeline

This is the resolution of the deferred imagery engine (Aaron 2026-05-25): the **art-direction gate** (concept → brief) produces these prompts; **Aaron runs Gemini** (the production engine); the agent drops results in. Concept and execution stay approved separately — the prompt below is the approved-direction artifact.

## Source of truth

- **On-slide FPO descriptions** (the `.deck-cover__media-label` text + slot comments in the deck markdown) are canonical per slot; this file caches them and owns the *generation prompt*. Change the slide first, then re-derive the prompt.
- **Brand visual language** = Cena Color System v2 + the deck POV (`Knowledge/Projects/Cena Health/Deck Assets/deck-visual-regrounding-POV.md`). The organic circular crop is added by the page (the `.deck-cover__media` blob frame in CSS), **never painted into the image**.

---

## Persistent context — copy this first, every time

```
Brand image system for Cena Health, a food-as-medicine healthcare company. Every image follows these rules:

PALETTE: warm sand ground (#FBFAF8 to #E6E4E0), brand teal #3A8478, deep teal #1E5149, sage green #81B983, warm near-black #0D322D. Warm, optimistic, human. Brand colors and warm neutrals fill the composition; avoid cold blue-grey clinical sterility.

TONE: food as medicine, built into real clinical care. Warm, hopeful, dignified, human — real people, real food, real care. Optimistic and professional, never corporate-stock cliché, never sterile-hospital, never sad/sick-patient imagery.

SUBJECTS: fresh whole foods and produce presented as a clinical intervention (valuable, intentional, beautiful — never as a grocery flyer); warm care moments between people; nutrition and health woven together. Food always reads as nourishing and dignified.

FRAME: the image fills the full frame edge-to-edge, full-bleed. No border blocks, framing panels, corner shapes, or circular crops — the page supplies its own organic framing in CSS. Do NOT paint arcs, rings, circular crops, flower/petal shapes, or pinwheels onto the image.

CLEAN: no text, words, letters, logos, watermarks, charts, UI, or decorative sparkles/stars anywhere in the image.

STYLE: even, optimistic, natural lighting; warm modern art direction; generous negative space; documentary warmth, not staged stock.

NEGATIVE PROMPT: text, words, letters, logo, watermark, chart, UI, sparkle, star, ring, circle crop, flower, pinwheel, border, frame, cold blue clinical, sterile hospital, sad patient, sick, distorted hands, cluttered, grocery-flyer.
```

---

## Prompts — paste one below the context

### 1 · Investor cover hero — `deck/marp/cena-investor-deck.md` (cover `.deck-cover__media`)

Warm food-as-medicine hero · **Aspect 3:4** (tall, fills the organic blob frame on the right of the cover). The page clips it into an organic blob — image stays a clean full-bleed photo.

```
A warm, optimistic documentary photograph: fresh whole foods — colorful produce, grains, healthy ingredients — arranged as an intentional, dignified clinical intervention on a warm sand surface, with soft natural light. Or a warm care moment of a person receiving/preparing nourishing food. Hopeful, human, professional. Warm sand and gentle teal-green tones in the scene. Generous negative space. Full-bleed, no text or graphics. Aspect ratio 3:4.
```

<!-- Add new slots as the deck gains image placeholders. Slot ref = the slide file + element; keep the on-slide FPO label in sync. -->
