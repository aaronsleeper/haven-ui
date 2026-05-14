# Nutrition expert audit — Patient meals screen (UConn demo)

**Date:** 2026-05-13
**Expert:** Nutrition (cross-cutting, `experts/nutrition.md`)
**Surface:** `apps/patient/src/screens/meals/index.tsx` — 5-meal week for Maria Rivera (T2DM / cardiometabolic profile, Latin American cuisine preference)
**Mode:** Recommendation only. No code edits. Demo to Dr. Dieckhaus ~2026-05-22.

---

## Framing

Maria's profile (T2DM, likely overlapping cardiometabolic risk, Latin American cuisine preference) sets three clinical priors that should govern meal selection and tag taxonomy:

- **Glycemic control is the primary clinical objective.** Total carb load, carb quality (fiber, glycemic load), and meal balance (protein + fat + non-starchy veg pairing with carbs) drive A1C trajectory more than sodium does for most T2DM patients without comorbid HTN or CKD.
- **Cardiometabolic overlap is the realistic comorbidity assumption.** ~70%+ of T2DM patients carry HTN, dyslipidemia, or both. Low-sodium + DASH-aligned patterns are defensible defaults, but tagging every meal "low sodium" treats sodium as the *primary* axis when glycemic load should be.
- **Cultural fit is adherence.** A medical-meal program that ignores Maria's stated Latin American preference will see lower adherence regardless of macronutrient elegance. Adherence is the outcome variable; nutritional optimization is the input variable. Sustainability over optimization (per expert judgment framework).

The current set passes a basic "looks like a hospital food service menu" sniff test. It fails three sharper tests: cuisine fidelity to Maria's preferences, tag taxonomy alignment with T2DM clinical priors, and tag-meal coherence.

The demo audience is a clinician (Dr. Dieckhaus). A clinician will read this list and pattern-match it against what they'd order for a real T2DM patient. The current set reads as "generic American medical meal program with two Latin-flavored tokens" — defensible, not impressive.

---

## Per-meal audit

### 1. Chicken Verde — Low sodium, Diabetic-friendly

- **Cultural fit:** Strong. Pollo verde / salsa verde is core Mexican/Tex-Mex/Central American vocabulary.
- **Clinical fit:** Defensible if the plate is built well — lean protein (chicken breast), tomatillo-based verde sauce is naturally low-sodium and low-sugar, and the alt-text mentions rice + beans (good fiber + slow carbs). Composition matters: white rice spikes glucose; brown rice, cauliflower rice, or a smaller rice portion with double beans is more diabetic-defensible.
- **Tag accuracy:** "Diabetic-friendly" is correct as the primary tag. "Low sodium" depends on the verde sauce recipe — restaurant verde is often heavily salted; medical-meal verde should be made to spec. The tag is plausible but should be empirically verified against the actual recipe.
- **Verdict:** Keep. This is the best meal in the set for Maria's profile.

### 2. Lemon Salmon — Heart-healthy

- **Cultural fit:** Weak. Lemon salmon is generic American/Mediterranean cuisine. There's no Latin American framing. Salmon isn't culturally absent from Latin cuisine (ceviche, salmon with chimichurri, salmon a la veracruzana), but "Lemon Salmon" reads as a hospital cafeteria default.
- **Clinical fit:** Strong on the nutrition side — fatty fish (omega-3s), the alt-text mentions quinoa (low GI, complete protein, fiber). This is genuinely the best cardiometabolic meal in the set.
- **Tag accuracy:** **"Heart-healthy" is correct but incomplete.** Fatty fish like salmon is the canonical "Heart-healthy" food, AND it's a top-tier diabetic-friendly meal (omega-3s improve insulin sensitivity, quinoa has lower glycemic load than rice). Tagging it only "Heart-healthy" understates its T2DM value and reinforces the impression that the tags are loosely applied. Should carry both "Heart-healthy" and either "Diabetic-friendly" or "Low glycemic load."
- **Verdict:** Keep the meal; rework the cultural framing (Salmon a la Veracruzana, Salmon with chimichurri verde, or Ceviche-inspired salmon) and the tag set.

### 3. Tofu Noodle Bowl — Low sodium, Vegetarian

- **Cultural fit:** Weak. Tofu + noodles reads as East Asian / pan-Asian fusion. This is the off-profile meal in the set for a Latin-preferring patient. No Latin American cuisine I'm aware of has tofu + noodles as a recognized dish.
- **Clinical fit:** Depends entirely on the noodles. Wheat noodles are a glycemic-load problem. Soba (buckwheat), shirataki, or legume-based noodles work. The alt-text doesn't specify. Tofu is excellent diabetic protein.
- **Tag accuracy:** "Vegetarian" is accurate. "Low sodium" depends on the broth/sauce — Asian-style sauces (soy, miso, oyster) are usually high-sodium; a low-sodium version requires careful recipe design. The label is plausible but recipe-dependent.
- **Verdict:** **Replace.** This is the weakest meal for Maria's profile. A vegetarian Latin option (frijoles negros con calabacitas, mole de hongos, sopa de lentejas) would respect both her cuisine preference and cover the vegetarian-meal slot.

### 4. Beef Stir-fry — Diabetic-friendly

- **Cultural fit:** Weak. Stir-fry is East Asian. Latin American beef preparations (ropa vieja, picadillo, carne asada, bistec encebollado) would fit Maria's preferences and serve the same clinical goals.
- **Clinical fit:** **Tag is questionable.** Stir-fry sauces (soy, hoisin, oyster) are typically high-sodium AND can be high-sugar (hoisin, sweet-and-sour, teriyaki). The carb base (rice, noodles) is the bigger glycemic question. "Diabetic-friendly" depends on (a) the sauce being clinically formulated, (b) the carb base being low-GI, (c) the protein-to-carb ratio. Without those guarantees, the tag is aspirational, not descriptive.
- **Tag accuracy:** "Diabetic-friendly" *can* be accurate but isn't self-evidently so. A clinician reading this will assume it's a guess unless the recipe is documented.
- **Verdict:** **Replace.** A Latin-cuisine substitute (Carne Asada with avocado salsa + black beans, or Picadillo with cauliflower rice) would carry the same clinical claim more credibly and respect Maria's preferences.

### 5. Turkey Chili — High protein, Low sodium

- **Cultural fit:** Defensible. Chili has Mexican roots; turkey chili reads as American-Mexican fusion. Not a stretch.
- **Clinical fit:** Strong. Ground turkey (lean protein), beans (fiber, slow carbs), tomato base (low-glycemic). Naturally diabetic-friendly when made without sugar in the chili recipe. The alt-text mentions a side salad (good — non-starchy veg pairing).
- **Tag accuracy:** "High protein" is accurate. "Low sodium" is plausible but recipe-dependent (chili powder and canned tomatoes are sodium vectors). **Missing tag: "Diabetic-friendly" applies just as strongly as it does to Chicken Verde.** The fact that two clearly-diabetic-friendly meals (Lemon Salmon, Turkey Chili) don't carry that tag while two questionable ones (Beef Stir-fry, Chicken Verde) do, makes the tag set look inconsistent.
- **Verdict:** Keep the meal; add "Diabetic-friendly" to the tag set.

---

## Tag taxonomy recommendation

The current taxonomy (Low sodium / Heart-healthy / Diabetic-friendly / Vegetarian / High protein) mixes three layers without separating them:

- **Clinical-program alignment** (Heart-healthy, Diabetic-friendly, DASH-aligned, Mediterranean) — what condition / guideline this meal supports
- **Single-nutrient claims** (Low sodium, High protein, Low glycemic load, High fiber) — measurable nutrient targets
- **Dietary pattern / restriction** (Vegetarian, Vegan, Gluten-free, Halal, Kosher) — preference and exclusion patterns

The drift between layers makes "Diabetic-friendly" do too much work. A meal can be high-sodium AND diabetic-friendly (sodium isn't the diabetes axis); a meal can be low-sodium and NOT diabetic-friendly (white-rice + low-sodium sauce). Collapsing them into "Diabetic-friendly = low sodium + low sugar + lean protein" hides what the program actually optimizes for.

### Recommended taxonomy for T2DM / cardiometabolic program

**Primary clinical tag (always present, one per meal):**

- **Low glycemic load** (preferred over "Diabetic-friendly" — more precise, less stigmatizing, names what's actually being optimized)
- **Heart-protective** (for fatty fish, olive-oil-forward, nut-forward meals — names the omega-3 / monounsaturated benefit)
- **DASH-aligned** (for meals that are simultaneously low-sodium + high-potassium + high-fiber — the multi-axis cardiometabolic claim)

**Secondary descriptive tags (zero to two per meal):**

- **High protein** (when grams meet a defined threshold — e.g., ≥25g)
- **High fiber** (when grams meet a threshold — e.g., ≥8g)
- **Low sodium** (sub-600mg per meal — measurable, not aspirational)

**Pattern tags (when applicable):**

- **Vegetarian** / **Vegan** / **Gluten-free**
- **Mediterranean-style** / **Latin-style** / **Comfort food** — cuisine framing, helps patient orient

This separates "what condition this meal supports" from "what's measurable about this meal" from "how this meal feels culturally." Each layer is honest about what it claims. A clinician can read a tag set and know whether to trust it.

### Tag naming notes

- "Diabetic-friendly" is the standard medical-meal-program tag, but "Low glycemic load" is more clinically specific and avoids stigma. If the demo audience expects "Diabetic-friendly," keep it as a synonym/fallback; if Dr. Dieckhaus is the audience, "Low glycemic load" reads as more sophisticated.
- "Heart-healthy" is generic and increasingly meaningless. "Heart-protective" or specific claim ("Omega-3 rich," "DASH-aligned") is sharper.
- "High protein" needs a threshold to be meaningful. ≥25g is a defensible default for adult metabolic patients.

---

## Revised 5-meal set

Three changes (Tofu Noodle Bowl and Beef Stir-fry replaced; Chicken Verde and Turkey Chili kept; Lemon Salmon culturally reframed). Tags use the recommended taxonomy.

### 1. Pollo Verde con Frijoles Negros (Chicken Verde with black beans + cauliflower rice)

- **Tags:** Low glycemic load · Latin-style · High protein
- **Why:** Strong Latin cuisine fit, clear clinical claim, cauliflower rice replaces white rice for glycemic control, black beans add fiber + plant protein.

### 2. Salmón a la Veracruzana (Salmon with tomato-caper-olive sauce over quinoa)

- **Tags:** Heart-protective · Low glycemic load · Mediterranean-style
- **Why:** Salmón Veracruzano is canonical Mexican coastal cuisine — Latin-authentic. Same clinical benefits as Lemon Salmon (omega-3s + quinoa) with cuisine fidelity. Carries both clinical tags honestly.

### 3. Sopa de Lentejas con Verduras (Lentil and vegetable soup)

- **Tags:** DASH-aligned · Vegetarian · High fiber
- **Why:** Replaces Tofu Noodle Bowl. Lentils are excellent for T2DM (low glycemic load, high fiber, plant protein). Sopa de lentejas is a staple across Latin America. Vegetarian slot stays filled with a culturally-coherent option.

### 4. Picadillo with Cauliflower Rice and Avocado

- **Tags:** Low glycemic load · Latin-style · High protein
- **Why:** Replaces Beef Stir-fry. Picadillo (ground beef with tomato, onion, olives, raisins-optional or omitted for sugar control) is core Latin American comfort food (Cuban, Puerto Rican, Mexican variants). Cauliflower rice + avocado completes the plate as low-glycemic-load + heart-healthy fats.

### 5. Chili de Pavo (Turkey Chili) with mixed greens

- **Tags:** Low glycemic load · High protein · High fiber
- **Why:** Kept from current set. Adds the "Low glycemic load" tag that should have been there. "High protein" and "High fiber" are both defensible if portion-sized correctly.

---

## Biggest single change

If only one change ships before the 2026-05-22 demo, **replace Tofu Noodle Bowl with Sopa de Lentejas (or any Latin-vegetarian option)**. It fixes the most visible cuisine-mismatch (East Asian dish in a Latin American patient's meal plan), it improves the clinical profile (lentils > tofu+noodles for T2DM), and it signals to Dr. Dieckhaus that the meal-program backend respects patient preferences. A clinician will notice this single swap more than they'd notice any tag-taxonomy refinement.

---

## Notes for build / product

- The image URLs use `picsum.photos` with seed slugs that wouldn't change if the meal names change — image regeneration is needed if meals are swapped. (Out of scope for nutrition; flagging for the build owner.)
- Spanish translations should be reviewed by a native speaker for any new meal names — `Salmón a la Veracruzana`, `Sopa de Lentejas con Verduras`, `Picadillo` are standard, but regional variation matters (Cuban Spanish vs. Mexican Spanish in patient-facing copy).
- If the tag taxonomy changes, the `MealDeliveryTag` variants in `packages/ui-react` may need new color mappings — `info` / `secondary` / `neutral` aren't enough for a 3-layer taxonomy. Coordinate with the design system before changing tag names.
- This audit assumes Maria is on a single-condition T2DM track. If her chart includes HTN, CKD, or heart failure, sodium becomes a sharper axis and "Low sodium" deserves more prominence. Worth a 30-second clinical-care expert check before the demo.

---

## Sources / framework references

- ADA Standards of Care in Diabetes (2025) — nutrition therapy recommendations
- DASH diet (NHLBI) — sodium + potassium + fiber framework
- Mediterranean diet evidence base (PREDIMED, Lyon Heart Study) — for the Heart-protective claim
- General medical-meal-program taxonomy (Mom's Meals, BistroMD, Sun Basket Diabetes-Friendly) — for comparison points on commercial tag conventions

Time-sensitive claims in this doc (specific guideline thresholds, ADA cutoffs): not embedded as numeric values in the meal plan itself. Tag thresholds (≥25g protein, ≥8g fiber, ≤600mg sodium) are common-practice defaults; if Cena Health adopts the taxonomy, verify against the most recent ADA + DASH guideline documents before publishing patient-facing.
