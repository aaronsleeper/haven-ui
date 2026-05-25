---
marp: true
theme: cena-deck
size: 16:9
paginate: false
---

<!--
  Cena Health — Yale Innovation Summit (Health Track, May 2026). 3-min pitch.
  v2 emit from Vanessa Sena's script + generated deck (Downloads, 2026-05-25).
  Content/claims/numbers are VANESSA'S and preserved verbatim; her sources are
  carried as citation lines (the accountability trail). The "do better" is the
  visual system (canvas-on-ground, real logo, bold Lora, archetypes), not her
  voice. Render: marp-cli --theme cena-deck-theme.css --html
-->

<!-- _class: cover -->

<div class="deck-slide__content">
<img class="deck-cover__logo" src="../assets/logo-cenahealth.svg" alt="Cena Health">
<h1 class="deck-cover__title">Admitted. Discharged. Then 29 days <em class="deck-accent deck-accent--stakes">blind</em>.</h1>
<p class="deck-cover__subtitle">CenaHealth gives health systems a way to prescribe, monitor, and measure nutrition between visits — turning every meal into clinical intelligence.</p>
<p class="deck-cover__presenter"><strong>Vanessa Sena</strong>, Founder &amp; CEO<br><span>Yale Innovation Summit · Health Track · May 2026</span></p>
<p class="deck-cover__stat-strip">$1.2M revenue&nbsp;&nbsp;·&nbsp;&nbsp;150,000+ meals delivered&nbsp;&nbsp;·&nbsp;&nbsp;6 payer contracts</p>
</div>

---

<div class="deck-canvas">
<header class="deck-slide__chrome">
<p class="deck-eyebrow">Team</p>
<h2 class="deck-headline">Built from the <em class="deck-accent deck-accent--brand">messy middle</em> where food, data, and reimbursement meet</h2>
</header>

<div class="deck-slide__content">
<div class="deck-team">
<div class="deck-team__member">
<p class="deck-team__name">Vanessa Sena</p>
<span class="deck-team__role">Founder &amp; CEO</span>
<p class="deck-team__bio">3× founder. 150,000+ meals delivered. Published researcher (JNEB 2025). NIH NOURISH Award.</p>
</div>
<div class="deck-team__member">
<p class="deck-team__name">Andrey Kartashov</p>
<span class="deck-team__role">Founder &amp; CTO</span>
<p class="deck-team__bio">Co-founded Datirium. Platform adopted by NYU, Harvard, Fox Chase, U of Michigan.</p>
</div>
<div class="deck-team__member">
<p class="deck-team__name">Aaron Sleeper</p>
<span class="deck-team__role">Founder &amp; CXO</span>
<p class="deck-team__bio">20+ yrs enterprise product design — Google, FDA, Accenture. AI-powered care workflows.</p>
</div>
<div class="deck-team__member">
<p class="deck-team__name">Abigail Soto, MD</p>
<span class="deck-team__role">Medical Director</span>
<p class="deck-team__bio">Board-certified Family Medicine. Chief Resident, Eisenhower. UCLA-trained.</p>
</div>
<div class="deck-team__member">
<p class="deck-team__name">Mark Schepis</p>
<span class="deck-team__role">EHR Integration</span>
<p class="deck-team__bio">15+ yrs healthcare IT. Led Epic / MyChart at HSS and Montefiore Einstein.</p>
</div>
<div class="deck-team__member">
<p class="deck-team__name">Marinka Natale</p>
<span class="deck-team__role">Data Architect &amp; VBC Advisor</span>
<p class="deck-team__bio">Aetna and Cigna background. Rensselaer-trained informatics leader.</p>
</div>
</div>
</div>

<footer class="deck-slide__footer">
<img class="deck-logo" src="../assets/logo-cenahealth.svg" alt="Cena Health">
<span>02</span>
</footer>
</div>

---

<div class="deck-canvas">
<header class="deck-slide__chrome">
<p class="deck-eyebrow">Why now</p>
<h2 class="deck-headline">Reimbursement is opening. The evidence is in. The <em class="deck-accent deck-accent--brand">infrastructure</em> isn't.</h2>
</header>

<div class="deck-slide__content">
<div class="deck-row">
<div class="deck-card deck-card--sage">
<p class="deck-card__eyebrow">Policy</p>
<h3 class="deck-card__title">Pathways are opening</h3>
<p class="deck-card__body">16 states approved 1115 waivers authorizing nutrition as a Medicaid benefit; Medicare Advantage now covers medically tailored meals.</p>
</div>
<div class="deck-row__sep" aria-hidden="true">·</div>
<div class="deck-card deck-card--teal">
<p class="deck-card__eyebrow">Evidence</p>
<h3 class="deck-card__title">Clinical integration wins</h3>
<p class="deck-card__body">Medically tailored meals cut inpatient admissions 49%, and are net cost-saving in Year 1 across 49 of 50 states.</p>
</div>
<div class="deck-row__sep" aria-hidden="true">·</div>
<div class="deck-card deck-card--ochre">
<p class="deck-card__eyebrow">Infrastructure</p>
<h3 class="deck-card__title">No tool exists for it</h3>
<p class="deck-card__body">EHRs were never built to prescribe, track, measure, and bill nutrition. CenaHealth built that missing layer.</p>
</div>
</div>
<p class="deck-citation">Berkowitz et al., JAMA Internal Medicine 2018 (49% admissions) · Health Affairs, April 2025 (49/50 states) · AHA, Circulation 2024 (clinical integration)</p>
</div>

<footer class="deck-slide__footer">
<img class="deck-logo" src="../assets/logo-cenahealth.svg" alt="Cena Health">
<span>03</span>
</footer>
</div>

---

<div class="deck-canvas">
<header class="deck-slide__chrome">
<p class="deck-eyebrow">The problem</p>
<h2 class="deck-headline">$30B in readmissions. <em class="deck-accent deck-accent--stakes">Everyone pays.</em></h2>
</header>

<div class="deck-slide__content">
<div class="deck-stats">
<div class="deck-stat">
<span class="deck-stat__num">$320M</span>
<span class="deck-stat__label"><strong>Hospitals</strong> don't get paid — CMS readmission penalties last year</span>
</div>
<div class="deck-stat">
<span class="deck-stat__num">$17B</span>
<span class="deck-stat__label"><strong>Payers</strong> pay again — CMS-identified avoidable costs</span>
</div>
<div class="deck-stat">
<span class="deck-stat__num">29 days</span>
<span class="deck-stat__label"><strong>Patients</strong> cycle back — clinical blindness between visits</span>
</div>
</div>
<div class="deck-emphasis-bar">Nutrition goes unaddressed between visits — so the cycle repeats.</div>
</div>

<footer class="deck-slide__footer">
<img class="deck-logo" src="../assets/logo-cenahealth.svg" alt="Cena Health">
<span>04</span>
</footer>
</div>

---

<div class="deck-canvas">
<header class="deck-slide__chrome">
<p class="deck-eyebrow">Market opportunity</p>
<h2 class="deck-headline">16 states reimburse nutrition. <em class="deck-accent deck-accent--brand">None</em> can operationalize it.</h2>
</header>

<div class="deck-slide__content">
<div class="deck-stats">
<div class="deck-stat">
<span class="deck-stat__num">$209B</span>
<span class="deck-stat__label"><strong>TAM</strong> — health systems, providers, payer partnerships</span>
</div>
<div class="deck-stat">
<span class="deck-stat__num">$98B</span>
<span class="deck-stat__label"><strong>SAM</strong> — health systems &amp; IDNs (24M eligible patients)</span>
</div>
<div class="deck-stat deck-stat--climax">
<span class="deck-stat__num">$50B</span>
<span class="deck-stat__label"><strong>SOM</strong> — payer-provider partnerships, our beachhead</span>
</div>
</div>
<div class="deck-emphasis-bar">Repeatable motion: MSA (2–4 mo) → pilot at $280 PMPM → full deployment at $340 PMPM.</div>
</div>

<footer class="deck-slide__footer">
<img class="deck-logo" src="../assets/logo-cenahealth.svg" alt="Cena Health">
<span>05</span>
</footer>
</div>

---

<div class="deck-canvas">
<header class="deck-slide__chrome">
<p class="deck-eyebrow">The solution</p>
<h2 class="deck-headline">Food is the wedge. Every interaction generates <em class="deck-accent deck-accent--brand">intelligence</em>.</h2>
</header>

<div class="deck-slide__content">
<div class="deck-seq">
<div class="deck-card deck-card--neutral">
<span class="deck-step-chip">1</span>
<h3 class="deck-card__title">Food, the wedge</h3>
<p class="deck-card__body">Medically tailored meals — a trusted touchpoint with the highest-risk patients. <strong>49%</strong> fewer admissions.</p>
</div>
<div class="deck-seq__arrow" aria-hidden="true"><svg viewBox="0 0 24 12" fill="none"><path d="M0 6h20M16 2l5 4-5 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
<div class="deck-card deck-card--neutral">
<span class="deck-step-chip">2</span>
<h3 class="deck-card__title">Every meal, a signal</h3>
<p class="deck-card__body">Adherence, preferences, symptoms, food insecurity, social needs — <strong>~50</strong> structured data points per meal.</p>
</div>
<div class="deck-seq__arrow" aria-hidden="true"><svg viewBox="0 0 24 12" fill="none"><path d="M0 6h20M16 2l5 4-5 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
<div class="deck-card deck-card--climax">
<span class="deck-step-chip">3</span>
<h3 class="deck-card__title">AVA surfaces risk</h3>
<p class="deck-card__body">Agentic AI flags early risk before it becomes a utilization event. <strong>$6,299</strong> net savings / patient, yr 1.</p>
</div>
</div>
<p class="deck-citation">49% fewer admissions: Berkowitz et al., JAMA Internal Medicine 2018. The services are the signal-collection engine; the intelligence layer is where value compounds.</p>
</div>

<footer class="deck-slide__footer">
<img class="deck-logo" src="../assets/logo-cenahealth.svg" alt="Cena Health">
<span>06</span>
</footer>
</div>

---

<div class="deck-canvas">
<header class="deck-slide__chrome">
<p class="deck-eyebrow">Business model</p>
<h2 class="deck-headline">Three revenue streams, working in <em class="deck-accent deck-accent--brand">parallel</em></h2>
</header>

<div class="deck-slide__content">
<div class="deck-row">
<div class="deck-card deck-card--teal">
<h3 class="deck-card__title--label">Clinical services</h3>
<p class="deck-card__body">RDN &amp; behavioral visits billed via CPT to 6 in-network payers.</p>
<span class="deck-tag deck-tag--live">Live now</span>
</div>
<div class="deck-card deck-card--sage">
<h3 class="deck-card__title--label">Meal coordination</h3>
<p class="deck-card__body">60% margin on fulfillment; kitchen-agnostic, scales geographically.</p>
<span class="deck-tag deck-tag--live">Live now</span>
</div>
<div class="deck-card deck-card--ochre">
<h3 class="deck-card__title--label">Infrastructure + PMPM</h3>
<p class="deck-card__body">Platform + care coordination + meals. $280 pilot → $340 PMPM, 41% margins.</p>
<span class="deck-tag deck-tag--planned">Post-pilot</span>
</div>
</div>
<div class="deck-emphasis-bar">Total blended $340 PMPM · 41% gross margins · referral-driven acquisition through health-system partners.</div>
</div>

<footer class="deck-slide__footer">
<img class="deck-logo" src="../assets/logo-cenahealth.svg" alt="Cena Health">
<span>07</span>
</footer>
</div>

---

<div class="deck-canvas">
<header class="deck-slide__chrome">
<p class="deck-eyebrow">Differentiation</p>
<h2 class="deck-headline">Competitors specialize in one layer. We combine <em class="deck-accent deck-accent--brand">four</em>.</h2>
</header>

<div class="deck-slide__content">
<div class="deck-row">
<div class="deck-card deck-card--teal">
<h3 class="deck-card__title--label">Clinical delivery</h3>
<p class="deck-card__body">RDNs, care coordination, behavioral coaching, medical oversight.</p>
</div>
<div class="deck-card deck-card--ochre">
<h3 class="deck-card__title--label">Food operations</h3>
<p class="deck-card__body">Medically tailored meals, kitchen-agnostic, culturally relevant.</p>
</div>
<div class="deck-card deck-card--indigo">
<h3 class="deck-card__title--label">Data infrastructure</h3>
<p class="deck-card__body">EHR-integrated (Epic, Athena), structured engagement data, patient registry.</p>
</div>
<div class="deck-card deck-card--rose">
<h3 class="deck-card__title--label">Reimbursement</h3>
<p class="deck-card__body">6 payer contracts, CPT billing, VBC contracting, HEDIS measurement.</p>
</div>
</div>
<div class="deck-emphasis-bar">Meal companies lack clinical teams. Telenutrition lacks meals. Benefits managers serve payers, not systems. <em>Nutrition is the wedge. Intelligence is the moat.</em></div>
</div>

<footer class="deck-slide__footer">
<img class="deck-logo" src="../assets/logo-cenahealth.svg" alt="Cena Health">
<span>08</span>
</footer>
</div>

---

<div class="deck-canvas">
<header class="deck-slide__chrome">
<p class="deck-eyebrow">Traction &amp; the ask</p>
<h2 class="deck-headline">Real revenue, signed contracts, and a <em class="deck-accent deck-accent--brand">$2.5M Seed</em> in diligence</h2>
</header>

<div class="deck-slide__content">
<div class="deck-stats">
<div class="deck-stat"><span class="deck-stat__num">$1.2M</span><span class="deck-stat__label">revenue to date</span></div>
<div class="deck-stat"><span class="deck-stat__num">$500K</span><span class="deck-stat__label">signed contract — UConn Health</span></div>
<div class="deck-stat"><span class="deck-stat__num">150K+</span><span class="deck-stat__label">meals delivered</span></div>
<div class="deck-stat deck-stat--climax"><span class="deck-stat__num">6</span><span class="deck-stat__label">payer contracts, in-network</span></div>
</div>
<div class="deck-emphasis-bar">Pipeline: Cedars-Sinai (advancing to Pop Health), MGB Health Plan (800 dual-eligible), Vanderbilt, Kaiser. <strong>18-mo:</strong> 1,460 patients · 4 health systems · $5.7M ARR · Series A readiness.</div>
</div>

<footer class="deck-slide__footer">
<img class="deck-logo" src="../assets/logo-cenahealth.svg" alt="Cena Health">
<span>09</span>
</footer>
</div>

---

<!-- _class: divider -->

<div class="deck-motif deck-motif--divider" aria-hidden="true">
<svg viewBox="0 0 100 100" fill="none">
<circle cx="50" cy="50" r="48" fill="var(--color-surface-teal)"/>
<circle cx="50" cy="50" r="33" fill="var(--color-teal-100)"/>
</svg>
</div>

<div class="deck-slide__content">
<p class="deck-divider__kicker">CenaHealth</p>
<h2 class="deck-divider__title">We detect patient risk <em class="deck-accent">before</em> it appears in the medical record.</h2>
<p class="deck-cover__presenter"><strong>Vanessa Sena</strong> · vsena@cena.health · cena.health</p>
</div>
