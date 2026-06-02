---
title: Workflow mapping — Aaron + Vanessa, 2026-06-02
description: A working surface for the 1:30 PM PDT session. Walk it section by section, capture answers, copy the session capture at the end.
slug: uconn-workflow-mapping-2026-06-02
---

<style>
  /* Capture block — visually distinguishes "your turn" areas from prose. */
  .capture-block {
    background: var(--color-surface-card, #fff);
    border: 1px solid var(--color-border-default, #d6cdbe);
    border-left: 3px solid var(--color-primary-500, #5f9a8f);
    border-radius: 6px;
    padding: 16px 20px;
    margin: 20px 0;
  }
  .capture-block-prompt {
    font-family: var(--font-sans, 'Source Sans 3', sans-serif);
    font-weight: 600;
    font-size: 0.95rem;
    color: var(--color-text-normal, #1a1d1c);
    margin-bottom: 12px;
  }
  .capture-block-prompt::before {
    content: "✎ ";
    color: var(--color-primary-500, #5f9a8f);
    font-weight: 700;
    margin-right: 4px;
  }
  /* Radio/checkbox list — aligned with haven canon (.radio-row in components.css):
     flex items-center gap-3, label text-sm line-height 1.25, no per-row padding.
     Wrapper spacing 8px matches canon's `space-y-2`. */
  .capture-options {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 12px;
  }
  .capture-options label {
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
    font-size: 0.875rem;
    line-height: 1.25;
    color: var(--color-text-normal, #1a1d1c);
  }
  .capture-options input[type="radio"],
  .capture-options input[type="checkbox"] {
    cursor: pointer;
    flex-shrink: 0;
    margin: 0;
  }
  .capture-block textarea {
    width: 100%;
    min-height: 70px;
    padding: 8px 10px;
    border: 1px solid var(--color-border-default, #d6cdbe);
    border-radius: 4px;
    font-family: var(--font-sans, 'Source Sans 3', sans-serif);
    font-size: 0.9rem;
    line-height: 1.5;
    resize: vertical;
    background: var(--color-surface-subtle, #faf6ee);
  }
  .capture-block textarea:focus {
    outline: 2px solid var(--color-primary-500, #5f9a8f);
    outline-offset: -1px;
  }
  .capture-context {
    font-size: 0.88rem;
    color: var(--color-text-muted, #555);
    margin: 4px 0 12px;
    font-style: italic;
  }
  /* Honest-uncertainty register — small in-section note */
  .honest-unknowns {
    font-size: 0.85rem;
    color: var(--color-text-muted, #555);
    border-top: 1px dashed var(--color-border-muted, #e8dfca);
    padding-top: 8px;
    margin-top: 12px;
  }
  .honest-unknowns::before {
    content: "What we honestly don't know — ";
    font-weight: 600;
    color: var(--color-text-faint, #777);
  }
  /* Four-lane map — CSS grid with brand-fidelity cards */
  .lane-map {
    display: grid;
    grid-template-columns: 140px 1fr;
    gap: 10px 16px;
    margin: 16px 0 24px;
  }
  .lane-map .lane-label {
    font-family: var(--font-code, 'Source Code Pro', monospace);
    font-size: 0.78rem;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--color-text-muted, #555);
    align-self: center;
    text-align: right;
    padding-right: 6px;
  }
  .lane-map .lane-row {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    padding: 10px 12px;
    border-radius: 5px;
  }
  .lane-map .lane-row.lane-cena    { background: #e8f1ef; border-left: 3px solid #5f9a8f; }
  .lane-map .lane-row.lane-athena  { background: #fdf6e6; border-left: 3px solid #c9954a; }
  .lane-map .lane-row.lane-paper   { background: #f3efe7; border-left: 3px solid #7a6f5a; }
  .lane-map .lane-row.lane-partner { background: #eef0f3; border-left: 3px solid #566173; }
  .lane-map .lane-pill {
    background: #fff;
    border: 1px solid rgba(0,0,0,0.08);
    border-radius: 4px;
    padding: 4px 10px;
    font-size: 0.85rem;
    color: var(--color-text-normal, #1a1d1c);
  }
  /* Ownership table — keep tidy */
  .ownership-table { width: 100%; border-collapse: collapse; margin: 16px 0 8px; font-size: 0.92rem; }
  .ownership-table th, .ownership-table td { text-align: left; padding: 8px 10px; border-bottom: 1px solid var(--color-border-muted, #e8dfca); }
  .ownership-table th { font-weight: 600; background: var(--color-surface-subtle, #faf6ee); }
  .ownership-table td.owner-cell { font-weight: 600; }
  /* Wrap-up + copy button */
  .session-wrap {
    background: var(--color-surface-subtle, #faf6ee);
    border: 1px solid var(--color-border-default, #d6cdbe);
    border-radius: 6px;
    padding: 20px 24px;
    margin-top: 36px;
  }
  .session-wrap h3 { margin-top: 0; }
  #copy-session-capture {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 20px;
    background: #5f9a8f;
    color: #fff;
    border: none;
    border-radius: 5px;
    font-family: var(--font-sans, 'Source Sans 3', sans-serif);
    font-weight: 600;
    font-size: 0.95rem;
    cursor: pointer;
    margin-top: 12px;
    transition: background-color 0.15s ease;
  }
  #copy-session-capture:hover { background: #4f8579; }
  #copy-session-capture:active { background: #3f6b62; }
  #copy-feedback {
    display: inline-block;
    margin-left: 12px;
    font-size: 0.88rem;
    color: var(--color-text-muted, #555);
  }
  #copy-feedback.is-success { color: #4f8579; font-weight: 600; }
  #copy-feedback.is-error { color: #b6452f; font-weight: 600; }
  /* Account-creation SVG sizing */
  .flow-svg { max-width: 100%; height: auto; margin: 16px 0 24px; }
  /* Section header chip + breathing room — strong visual divider between sections
     so scrolling the page reads as discrete decision moments, not a wall. */
  h2.section-title {
    display: flex;
    align-items: baseline;
    gap: 12px;
    margin-top: 72px;
    padding-top: 28px;
    border-top: 1px solid var(--color-border-default, #d6cdbe);
  }
  /* The first h2 in the article doesn't need a divider — the page header above carries it. */
  article > h2.section-title:first-of-type { border-top: none; padding-top: 0; margin-top: 32px; }
  h2.section-title .section-num {
    font-family: var(--font-code, 'Source Code Pro', monospace);
    font-size: 0.78rem;
    color: var(--color-text-faint, #888);
    letter-spacing: 0.12em;
    font-weight: 600;
  }
  /* Section 3 — per-SoP approve/deny rows */
  .sop-grid {
    display: grid;
    grid-template-columns: minmax(220px, 1fr) auto;
    gap: 10px 24px;
    align-items: center;
    margin: 16px 0;
    padding: 12px 16px;
    background: var(--color-surface-subtle, #faf6ee);
    border-radius: 6px;
    border: 1px solid var(--color-border-muted, #e8dfca);
  }
  .sop-grid .sop-name { font-size: 0.92rem; line-height: 1.35; color: var(--color-text-normal, #1a1d1c); }
  .sop-grid .sop-name a { font-size: 0.78rem; color: var(--color-text-muted, #555); margin-left: 6px; text-decoration: none; }
  .sop-grid .sop-name a:hover { text-decoration: underline; }
  .sop-grid .sop-vote { display: flex; gap: 14px; }
  .sop-grid .sop-vote label {
    display: flex; align-items: center; gap: 4px;
    font-size: 0.82rem;
    color: var(--color-text-muted, #555);
    cursor: pointer;
  }
  .sop-grid .sop-vote input[type="radio"] { margin: 0; cursor: pointer; }
  /* Cascade list — section 4 */
  .cascade-list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin: 12px 0;
    padding: 0;
    list-style: none;
  }
  .cascade-list li {
    background: var(--color-surface-card, #fff);
    border: 1px solid var(--color-border-default, #d6cdbe);
    border-left: 3px solid #c9954a;
    padding: 6px 12px;
    border-radius: 4px;
    font-size: 0.9rem;
    color: var(--color-text-normal, #1a1d1c);
  }
  /* Context-preview disclosure — section 5 (uses haven .poke base; adds source link footer) */
  .context-source-link {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    margin-top: 8px;
    font-size: 0.82rem;
    color: var(--color-primary-600, #4f8579);
    text-decoration: none;
  }
  .context-source-link:hover { text-decoration: underline; }
  /* Inline definition list (section 7d) */
  .inline-defs {
    margin: 10px 0;
    padding: 10px 16px;
    background: var(--color-surface-subtle, #faf6ee);
    border-left: 2px solid var(--color-border-default, #d6cdbe);
    border-radius: 4px;
    font-size: 0.88rem;
    color: var(--color-text-muted, #444);
  }
  .inline-defs strong { color: var(--color-text-normal, #1a1d1c); }
</style>

## Why we're meeting

Map the UConn pilot's operational and technical workflows onto where each step lives — Cena, Athena, paper, partner — and walk through the open calls together. Seven sections. Each one focused on a single thing to land or honestly name.

This page is a working surface for the conversation. Capture your answer as we go; at the end, a Copy button exports everything to markdown that I'll fold into the source-of-truth docs after the call.

:::callout{variant="info"}
**How to use this with me.** Each section opens with what's already settled (the context), then a single thing to land — a confirm-or-flag, a pick-an-option, or a note. The "what we honestly don't know" lines at the bottom of each section are the honest-uncertainty register; they're not for you to solve, they're for both of us to see.
:::

## <span class="section-num">SECTION 1</span> The map — where each step lives

Four places. Every step in the pilot lives in exactly one of them. This is the map we're walking through.

<div class="lane-map" aria-label="Four lanes of the UConn pilot — where each step lives">
  <div class="lane-label">CENA</div>
  <div class="lane-row lane-cena">
    <span class="lane-pill">Care coordinator app</span>
    <span class="lane-pill">Registered dietitian app</span>
    <span class="lane-pill">Patient app</span>
    <span class="lane-pill">Meal ordering</span>
    <span class="lane-pill">Reporting &amp; dashboards</span>
  </div>
  <div class="lane-label">ATHENA</div>
  <div class="lane-row lane-athena">
    <span class="lane-pill">Referral inbox (CommonWell)</span>
    <span class="lane-pill">Appointment scheduling</span>
    <span class="lane-pill">Encounter notes</span>
    <span class="lane-pill">Signed-consent PDF storage</span>
  </div>
  <div class="lane-label">PAPER</div>
  <div class="lane-row lane-paper">
    <span class="lane-pill">Written consent (in person)</span>
    <span class="lane-pill">Fax / external form fallback</span>
    <span class="lane-pill">Partner one-pagers</span>
  </div>
  <div class="lane-label">PARTNER</div>
  <div class="lane-row lane-partner">
    <span class="lane-pill">UConn Epic referrals</span>
    <span class="lane-pill">Food vendor</span>
    <span class="lane-pill">Kitchen + fulfillment partner</span>
  </div>
</div>

The read in one line each:

- **Cena** is the long-term system of record for everything we own end-to-end.
- **Athena** is external-facing connections + scheduling; not the long-term home of Cena-internal data.
- **Paper** is backup paths and in-person signatures; bridges to digital where the digital path isn't ready.
- **Partner** is outside-Cena systems we plug into.

No capture for this one — it's the orientation we use as we walk the rest.

## <span class="section-num">SECTION 2</span> SoP ownership — confirm or flag

The set of ten SoPs and who owns each, as ratified at yesterday's call:

<table class="ownership-table">
  <thead>
    <tr><th>SoP</th><th>Owner</th><th>Notes</th></tr>
  </thead>
  <tbody>
    <tr><td>Care Coordinator</td><td class="owner-cell">Marrero</td><td>Primary</td></tr>
    <tr><td>Registered Dietitian</td><td class="owner-cell">Marrero</td><td>Primary</td></tr>
    <tr><td>Administrator</td><td class="owner-cell">Vanessa</td><td>Primary</td></tr>
    <tr><td>Enrollment &amp; Onboarding</td><td class="owner-cell">Marrero</td><td>Primary; Andrey consulted on technical services</td></tr>
    <tr><td>Escalation protocol</td><td class="owner-cell">Marrero</td><td>Currently folded inside CC; standalone-or-folded is section 7</td></tr>
    <tr><td>Kitchen operations</td><td class="owner-cell">Vanessa</td><td>Likely partner one-pager — depends on vendor</td></tr>
    <tr><td>Fulfillment / delivery</td><td class="owner-cell">Vanessa</td><td>Likely partner one-pager — depends on vendor</td></tr>
    <tr><td>Subcontractor onboarding + BAA</td><td class="owner-cell">Vanessa</td><td>Currently folded inside Admin</td></tr>
    <tr><td>Monthly reporting &amp; review</td><td class="owner-cell">Vanessa + Marrero</td><td>Shared; transitions to Marrero post-launch</td></tr>
    <tr><td>Technical Infrastructure</td><td class="owner-cell">— pending —</td><td>Section 3 settles whether this row even belongs here</td></tr>
  </tbody>
</table>

<div class="capture-block" data-section="2" data-section-name="SoP ownership confirm-or-flag" data-question="Confirm the ownership table, or flag rows to discuss?">
  <div class="capture-block-prompt">Confirm — or type a flag</div>
  <div class="capture-options">
    <label><input type="checkbox" name="q-2-confirm" value="confirmed"> All ten rows confirmed as ratified</label>
  </div>
  <textarea data-capture="note" placeholder="If you want to flag specific rows — just type here. Typing is the signal; no other click needed."></textarea>
</div>

## <span class="section-num">SECTION 3</span> Technical Infrastructure — approve or deny each candidate

You said yesterday: *"Andrey writes no SoPs."* Here are the eight technical-workflow specs the team has drafted as candidate SoPs (Andrey would sign off if accepted; he's not the author). **For each: approve as SoP class, deny (belongs as a different artifact), or flag for discussion.** If everything denies, that's the signal — these are something other than SoPs.

<div class="capture-block" data-section="3" data-section-name="Technical Infrastructure per-candidate approve/deny" data-question="For each candidate: approve as SoP / deny / flag for discussion?">
  <div class="capture-block-prompt">Per-candidate vote — approve, deny, or discuss</div>

  <div class="sop-grid">
    <div class="sop-name"><strong>1. Patient Data Handling</strong> — how PHI is stored, accessed, exchanged across Cena + Athena + partners</div>
    <div class="sop-vote">
      <label><input type="radio" name="q-3a" value="approve"> ✓ approve</label>
      <label><input type="radio" name="q-3a" value="deny"> ✗ deny</label>
      <label><input type="radio" name="q-3a" value="discuss"> discuss</label>
    </div>
    <div class="sop-name"><strong>2. Account Provisioning &amp; Deprovisioning</strong> — staff role-based access lifecycle</div>
    <div class="sop-vote">
      <label><input type="radio" name="q-3b" value="approve"> ✓ approve</label>
      <label><input type="radio" name="q-3b" value="deny"> ✗ deny</label>
      <label><input type="radio" name="q-3b" value="discuss"> discuss</label>
    </div>
    <div class="sop-name"><strong>3. System Integration &amp; Interoperability</strong> — Cena ↔ Athena ↔ CommonWell ↔ partner connections</div>
    <div class="sop-vote">
      <label><input type="radio" name="q-3c" value="approve"> ✓ approve</label>
      <label><input type="radio" name="q-3c" value="deny"> ✗ deny</label>
      <label><input type="radio" name="q-3c" value="discuss"> discuss</label>
    </div>
    <div class="sop-name"><strong>4. Incident Response</strong> — security/availability incident escalation + remediation</div>
    <div class="sop-vote">
      <label><input type="radio" name="q-3d" value="approve"> ✓ approve</label>
      <label><input type="radio" name="q-3d" value="deny"> ✗ deny</label>
      <label><input type="radio" name="q-3d" value="discuss"> discuss</label>
    </div>
    <div class="sop-name"><strong>5. Audit Logging &amp; Compliance</strong> — what's logged, retained, surfaced for HIPAA + IRB audits</div>
    <div class="sop-vote">
      <label><input type="radio" name="q-3e" value="approve"> ✓ approve</label>
      <label><input type="radio" name="q-3e" value="deny"> ✗ deny</label>
      <label><input type="radio" name="q-3e" value="discuss"> discuss</label>
    </div>
    <div class="sop-name"><strong>6. Subcontractor Technical Onboarding</strong> — vendor access grants, BAA, technical access checks</div>
    <div class="sop-vote">
      <label><input type="radio" name="q-3f" value="approve"> ✓ approve</label>
      <label><input type="radio" name="q-3f" value="deny"> ✗ deny</label>
      <label><input type="radio" name="q-3f" value="discuss"> discuss</label>
    </div>
    <div class="sop-name"><strong>7. Backup, Disaster Recovery, Business Continuity</strong> — recovery cadence + offsite + downtime procedures</div>
    <div class="sop-vote">
      <label><input type="radio" name="q-3g" value="approve"> ✓ approve</label>
      <label><input type="radio" name="q-3g" value="deny"> ✗ deny</label>
      <label><input type="radio" name="q-3g" value="discuss"> discuss</label>
    </div>
    <div class="sop-name"><strong>8. Vulnerability Management</strong> — patch cadence, CVE tracking, dependency review</div>
    <div class="sop-vote">
      <label><input type="radio" name="q-3h" value="approve"> ✓ approve</label>
      <label><input type="radio" name="q-3h" value="deny"> ✗ deny</label>
      <label><input type="radio" name="q-3h" value="discuss"> discuss</label>
    </div>
  </div>

  <textarea data-capture="note" placeholder="Reasoning — especially for any flagged for discussion, or denied (where do they belong if not SoPs?)"></textarea>
  <div class="honest-unknowns">
    Which subset Phase-1 launch actually needs. Full eight don't need to ship before launch.
  </div>
</div>

## <span class="section-num">SECTION 4</span> Food vendor lock — highest blast radius

This is the call with the largest downstream cascade. Today's state:

- **Fire by Forge** — declined the contract.
- **Instacart Health** — under discussion but not accepting new businesses (no positive updates per Andrey 2026-06-01).
- **Greens and Things** — Vanessa meeting Sarah; possible route via John Furello (Torrington business community).
- **No vendor secured.**

The vendor lock cascades to eight downstream rows:

<ul class="cascade-list" aria-label="Downstream rows that depend on food vendor lock">
  <li>Kitchen operations</li>
  <li>Fulfillment / delivery</li>
  <li>Meal ordering surface</li>
  <li>Patient app meal logic</li>
  <li>Order-status transitions</li>
  <li>Budget-leftover handling</li>
  <li>Order edit cutoff</li>
  <li>Order week boundaries</li>
</ul>

Build assumes provisional values until vendor lands; swap when locked.

<div class="capture-block" data-section="4" data-section-name="Food vendor lock" data-question="Which path are we committing to, and what's the next step?">
  <div class="capture-block-prompt">Path forward</div>
  <div class="capture-options">
    <label><input type="radio" name="q-4-path" value="greens-and-things"> Greens and Things — lead with this conversation; lock if pricing + menu fit hold</label>
    <label><input type="radio" name="q-4-path" value="continue-instacart"> Continue waiting on Instacart Health — risk slipping past contract signing</label>
    <label><input type="radio" name="q-4-path" value="open-search-wider"> Open the search wider — name what a real second-best alternative would look like</label>
    <label><input type="radio" name="q-4-path" value="parallel-both"> Parallel: lead with Greens and Things, keep Instacart warm as fallback</label>
  </div>
  <textarea data-capture="note" placeholder="Status of the Greens and Things conversation. Pricing read. Cultural-food preferences fit. Decision-by-when?"></textarea>
  <div class="honest-unknowns">
    Timing on the Greens and Things conversation. Pricing fit. Whether the menu style holds for the cultural-food preferences the assessments capture.
  </div>
</div>

## <span class="section-num">SECTION 5</span> Daryl-vs-Ryan workflow — pick the canonical pattern

Marrero owns this. Open per Andrey's 1:1 observation 2026-06-01.

:::reason{q="What was Andrey's observation?" source="UConn Pilot — Source of Truth · From 2026-06-01 Tech Talk 1:1 (Aaron + Andrey only; Vanessa invited but not present)"}
From the SoT, *Divergent staff workflows* row under open SoP-class items:

> Daryl Mae (internal-software-only; role refined 2026-06-01 Clinical Workflows Meeting: assistant to care coordinators, not performing data entry) vs. Ryan (Athena-only) — needs standardization (per Andrey's 1:1 observation). Owner: Marrero. Status: open, SoP-class.

The observation in plain words: the two CCs work in materially divergent patterns — one inside Cena platform only, one inside Athena only — and the SoP set can't be consistent until that's standardized.

<a class="context-source-link" href="obsidian://open?vault=Vaults&amp;file=Knowledge%2FProjects%2FCena%20Health%2FPartners%2FUCONN%20Health%2FUConn%20Pilot%20%E2%80%94%20Source%20of%20Truth.md"><i class="fa-solid fa-arrow-up-right-from-square"></i> Open SoT in Obsidian</a>
:::

- **Daryl Mae** works internal-software-only (role refined 2026-06-01 as *assistant to care coordinators*, not performing data entry).
- **Ryan** works Athena-only.

The flow today + the standardization question:

<svg class="flow-svg diagram-frame" viewBox="0 0 820 480" role="img" aria-label="Account creation today — referral acknowledged splits into Athena-task / Cena-platform / paper-fallback paths, all converge into the Daryl-vs-Ryan workflow gate, which then splits into Cena-record or Athena-record before converging to 7-day intake.">
  <defs class="diagram-marker-defs">
    <marker id="flow-arrow-end" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="9" markerHeight="9" markerUnits="userSpaceOnUse" orient="auto">
      <path d="M 0 1 L 10 5 L 0 9 Q -1 5 0 1 z" class="diagram-marker-fill"/>
    </marker>
  </defs>

  <!-- Top row: Referral acknowledged -->
  <g class="diagram-box">
    <rect class="diagram-box-shape" x="320" y="20" width="180" height="56"/>
    <text x="410" y="48" class="diagram-box-label" text-anchor="middle">Referral</text>
    <text x="410" y="64" class="diagram-box-sublabel" text-anchor="middle">acknowledged</text>
  </g>

  <!-- Gate 1: where does the account get created? -->
  <g class="diagram-box diagram-box--dashed">
    <rect class="diagram-box-shape" x="290" y="110" width="240" height="62"/>
    <text x="410" y="138" class="diagram-box-label" text-anchor="middle">Where does the</text>
    <text x="410" y="156" class="diagram-box-label" text-anchor="middle">account get created?</text>
  </g>

  <!-- Three branches -->
  <g class="diagram-box">
    <rect class="diagram-box-shape" x="60" y="210" width="200" height="56"/>
    <text x="160" y="238" class="diagram-box-label" text-anchor="middle">Athena task on</text>
    <text x="160" y="254" class="diagram-box-sublabel" text-anchor="middle">referral receipt — current default</text>
  </g>
  <g class="diagram-box">
    <rect class="diagram-box-shape" x="310" y="210" width="200" height="56"/>
    <text x="410" y="238" class="diagram-box-label" text-anchor="middle">CC creates in Cena</text>
    <text x="410" y="254" class="diagram-box-sublabel" text-anchor="middle">platform directly</text>
  </g>
  <g class="diagram-box diagram-box--dashed">
    <rect class="diagram-box-shape" x="560" y="210" width="200" height="56"/>
    <text x="660" y="238" class="diagram-box-label" text-anchor="middle">Paper fallback</text>
    <text x="660" y="254" class="diagram-box-sublabel" text-anchor="middle">CC enters manually</text>
  </g>

  <!-- Gate 2: the Daryl-vs-Ryan workflow -->
  <g class="diagram-box diagram-box--dashed">
    <rect class="diagram-box-shape" x="240" y="310" width="340" height="62"/>
    <text x="410" y="338" class="diagram-box-label" text-anchor="middle">Daryl-vs-Ryan workflow —</text>
    <text x="410" y="356" class="diagram-box-label" text-anchor="middle">which system holds day-to-day data?</text>
  </g>

  <!-- Bottom: two patterns -->
  <g class="diagram-box">
    <rect class="diagram-box-shape" x="120" y="410" width="220" height="56"/>
    <text x="230" y="438" class="diagram-box-label" text-anchor="middle">Cena platform record</text>
    <text x="230" y="454" class="diagram-box-sublabel" text-anchor="middle">internal-software primary</text>
  </g>
  <g class="diagram-box">
    <rect class="diagram-box-shape" x="480" y="410" width="220" height="56"/>
    <text x="590" y="438" class="diagram-box-label" text-anchor="middle">Athena record</text>
    <text x="590" y="454" class="diagram-box-sublabel" text-anchor="middle">Athena primary</text>
  </g>

  <!-- Arrows -->
  <path d="M 410 76 L 410 108" class="diagram-arrow" marker-end="url(#flow-arrow-end)" aria-hidden="true"/>
  <path d="M 360 172 L 200 208" class="diagram-arrow" marker-end="url(#flow-arrow-end)" aria-hidden="true"/>
  <path d="M 410 172 L 410 208" class="diagram-arrow" marker-end="url(#flow-arrow-end)" aria-hidden="true"/>
  <path d="M 460 172 L 620 208" class="diagram-arrow diagram-arrow--dashed" marker-end="url(#flow-arrow-end)" aria-hidden="true"/>
  <path d="M 160 268 L 320 308" class="diagram-arrow" marker-end="url(#flow-arrow-end)" aria-hidden="true"/>
  <path d="M 410 268 L 410 308" class="diagram-arrow" marker-end="url(#flow-arrow-end)" aria-hidden="true"/>
  <path d="M 660 268 L 500 308" class="diagram-arrow diagram-arrow--dashed" marker-end="url(#flow-arrow-end)" aria-hidden="true"/>
  <path d="M 360 372 L 250 408" class="diagram-arrow" marker-end="url(#flow-arrow-end)" aria-hidden="true"/>
  <path d="M 460 372 L 570 408" class="diagram-arrow" marker-end="url(#flow-arrow-end)" aria-hidden="true"/>
</svg>

<div class="capture-block" data-section="5" data-section-name="Daryl-vs-Ryan canonical pattern" data-question="Which pattern is canonical for the pilot?">
  <div class="capture-block-prompt">Pick the canonical pattern</div>
  <div class="capture-options">
    <label><input type="radio" name="q-5-pattern" value="cena-primary"> Cena platform primary — Athena read-only mirror for the data classes UConn / partners need</label>
    <label><input type="radio" name="q-5-pattern" value="athena-primary"> Athena primary — Cena platform mirrors for patient-facing surfaces</label>
    <label><input type="radio" name="q-5-pattern" value="hybrid-by-type"> Hybrid by data type — clinical encounters + scheduling in Athena; operational care-coordination in Cena</label>
  </div>
  <textarea data-capture="note" placeholder="Why this pattern. If hybrid: which classes go where."></textarea>
  <div class="honest-unknowns">
    Which pattern's daily operational load is heavier, in practice. Andrey's read leans hybrid; this is where you weigh in.
  </div>
</div>

## <span class="section-num">SECTION 6</span> Athena CC-decision protocol — rule per data class

Open. Marrero (business) + Andrey (technical) co-own. Distinct from Andrey's Athena-vs-internal high-level integration doc (that's the system layer); this is the **human-decision layer**.

The question — *when does the care coordinator decide to record a given data type in Athena vs. internal software?* — today is judgment-by-CC. We need a rule.

Three candidate rules:

<div class="capture-block" data-section="6" data-section-name="Athena CC-decision protocol" data-question="Which rule per data class?">
  <div class="capture-block-prompt">Pick the rule</div>
  <div class="capture-options">
    <label><input type="radio" name="q-6-rule" value="by-data-class"> By data class — clinical → Athena; operational care-coordination → Cena; patient-facing surfaces → Cena</label>
    <label><input type="radio" name="q-6-rule" value="by-patient-facing"> By patient-facing-vs-not — anything a patient sees lives in Cena; everything internal lives in Athena</label>
    <label><input type="radio" name="q-6-rule" value="by-integration"> By integration-friendliness — wherever the data is easier to integrate / report from lives there</label>
  </div>
  <textarea data-capture="note" placeholder="Which classes go where, in your read. Edge cases that don't fit cleanly."></textarea>
  <div class="honest-unknowns">
    Which Athena API fields are open (writable, queryable) vs closed under HIPAA — Andrey tracking this. The closed set constrains what we can put in Athena even if we wanted to.
  </div>
</div>

## <span class="section-num">SECTION 7</span> Per-SoP open calls

The smaller row-level questions that need a touch from you but don't merit their own section. Pick one option per row; add notes only where it matters.

<div class="capture-block" data-section="7a" data-section-name="RD — meal plan vs care plan" data-question="Two distinct artifacts, or one combined?">
  <div class="capture-block-prompt">RD — meal plan vs care plan</div>
  <div class="capture-options">
    <label><input type="radio" name="q-7a" value="two-distinct"> Two distinct artifacts (care plan + meal plan)</label>
    <label><input type="radio" name="q-7a" value="one-combined"> One combined artifact</label>
  </div>
  <textarea data-capture="note" placeholder="Optional note"></textarea>
</div>

<div class="capture-block" data-section="7b" data-section-name="RD — Dr. Wu's role" data-question="Scope on dietary requirements?">
  <div class="capture-block-prompt">RD — Dr. Wu's scope on dietary requirements</div>
  <textarea data-capture="note" placeholder="How does dietary-requirements review fit between Dr. Wu's input and the RD's meal plan?"></textarea>
</div>

<div class="capture-block" data-section="7c" data-section-name="CC — PHQ9 thresholds" data-question="What triggers same-day escalation vs next-week follow-up?">
  <div class="capture-block-prompt">CC — PHQ9 positive-response thresholds</div>
  <textarea data-capture="note" placeholder="Score threshold for same-day escalation. Pending Healthcare Data Governance review for CITI/CT-licensure coverage."></textarea>
</div>

<div class="capture-block" data-section="7d" data-section-name="Admin — task set" data-question="Five tasks including or excluding subcontractor onboarding?">
  <div class="capture-block-prompt">Admin — task set confirmation</div>
  <div class="inline-defs">
    <strong>The 5 candidate Admin tasks</strong> (per SOP Coverage Map): staff training &amp; credentials · access provisioning · materials distribution · data export · subcontractor onboarding. Plus <strong>consent-form digitization → PDF storage</strong> (added 2026-05-27, M3 redline) — counted as a 6th, separate question 7e.
  </div>
  <div class="capture-options">
    <label><input type="radio" name="q-7d" value="five-incl-subcontractor"> Five tasks including subcontractor onboarding</label>
    <label><input type="radio" name="q-7d" value="five-excl-subcontractor"> Five tasks excluding (subcontractor onboarding promoted standalone)</label>
    <label><input type="radio" name="q-7d" value="different-set"> A different task set entirely (note below)</label>
  </div>
  <textarea data-capture="note" placeholder="Optional note"></textarea>
</div>

<div class="capture-block" data-section="7e" data-section-name="Admin — consent digitization owner" data-question="Admin role, or shared with CC?">
  <div class="capture-block-prompt">Admin — consent digitization owner</div>
  <div class="capture-options">
    <label><input type="radio" name="q-7e" value="admin-only"> Admin role</label>
    <label><input type="radio" name="q-7e" value="shared-with-cc"> Shared with care coordinator</label>
  </div>
  <textarea data-capture="note" placeholder="Optional note"></textarea>
</div>

<div class="capture-block" data-section="7f" data-section-name="Enrollment — account creation default" data-question="Athena task / CC creates in Cena / paper fallback?">
  <div class="capture-block-prompt">Enrollment — account-creation default</div>
  <div class="capture-options">
    <label><input type="radio" name="q-7f" value="athena-task-on-receipt"> Athena task on referral receipt (current default)</label>
    <label><input type="radio" name="q-7f" value="cc-creates-in-cena"> CC creates in Cena platform</label>
    <label><input type="radio" name="q-7f" value="follows-section-5"> Follows from section 5's canonical pattern (no separate call)</label>
  </div>
  <textarea data-capture="note" placeholder="Optional note"></textarea>
</div>

<div class="capture-block" data-section="7g" data-section-name="Escalation — folded or standalone" data-question="Folded inside CC, or promoted to standalone?">
  <div class="capture-block-prompt">Escalation protocol — folded or standalone?</div>
  <div class="capture-options">
    <label><input type="radio" name="q-7g" value="folded-in-cc"> Folded inside CC SoP (keeps it next to the routine that produces the trigger)</label>
    <label><input type="radio" name="q-7g" value="standalone"> Standalone (easier for partners to reference)</label>
  </div>
  <textarea data-capture="note" placeholder="First-action specifics for safety-concern call — Marrero owns the body content"></textarea>
</div>

<div class="capture-block" data-section="7h" data-section-name="Subcontractor onboarding — folded or standalone" data-question="Folded inside Admin, or promoted to standalone?">
  <div class="capture-block-prompt">Subcontractor onboarding — folded or standalone?</div>
  <div class="capture-options">
    <label><input type="radio" name="q-7h" value="folded-in-admin"> Folded inside Admin (for now)</label>
    <label><input type="radio" name="q-7h" value="standalone"> Standalone (subcontractor count climbing — possibly with multi-vendor mechanics)</label>
  </div>
  <textarea data-capture="note" placeholder="Optional note. BAA template = Cena's own per M2 — confirm active version + location."></textarea>
</div>

<div class="capture-block" data-section="7i" data-section-name="Monthly reporting — metric set" data-question="What's the exact metric set in Exhibit F?">
  <div class="capture-block-prompt">Monthly reporting — metric set</div>
  <textarea data-capture="note" placeholder="Marinka + Andrey own Exhibit F data-elements list. Anything you want to flag here?"></textarea>
</div>

## Wrap — action checklist + copy session capture

<div class="session-wrap">

<h3>Action items from the session</h3>

These are the open calls coming in. As we walk through, some will land in the captures above (and auto-flow into the copy). Others stay open and roll forward.

- [ ] Care Coordinator — first-action specifics for safety-concern escalation (Marrero)
- [ ] Care Coordinator — PHQ9 positive-response thresholds (Marrero + Healthcare Data Governance)
- [ ] Registered Dietitian — meal plan vs care plan separation (Vanessa)
- [ ] Registered Dietitian — Dr. Wu's role on dietary requirements (Vanessa)
- [ ] Administrator — Admin task set confirmation (Vanessa)
- [ ] Administrator — consent digitization owner (Vanessa)
- [ ] Enrollment &amp; Onboarding — account creation default (Marrero + Andrey)
- [ ] Escalation — folded or standalone? (Marrero)
- [ ] Kitchen / Fulfillment — full SoP or partner one-pager? (Vanessa, post-vendor lock)
- [ ] Subcontractor onboarding — folded or standalone? (Vanessa)
- [ ] Monthly reporting — exact metric set in Exhibit F (Marinka + Andrey)
- [ ] Technical Infrastructure — SoPs as you see them, or different artifact class? (Vanessa)
- [ ] Food vendor lock — Greens and Things conversation status; secondary candidates (Vanessa)
- [ ] Daryl-vs-Ryan workflow — canonical pattern (Marrero)
- [ ] Athena CC-decision protocol — rule per data class (Marrero + Andrey)

<p style="margin-top: 20px;">
  <button id="copy-session-capture" type="button" aria-label="Copy the session capture as markdown to your clipboard">
    <i class="fa-solid fa-copy" aria-hidden="true"></i>
    Copy session capture
  </button>
  <span id="copy-feedback" role="status" aria-live="polite"></span>
</p>

<p style="font-size: 0.88rem; color: var(--color-text-muted, #555); margin-top: 14px;">
  This page is regenerable, not a transcription target. After the conversation, the captures land in the canonical sources — the SOP Coverage Map, the UConn Source of Truth, the per-SoP markdown drafts. This asset is the working surface that gets us there.
</p>

</div>

<script>
(function() {
  'use strict';
  const btn = document.getElementById('copy-session-capture');
  const feedback = document.getElementById('copy-feedback');
  if (!btn || !feedback) return;

  function escapeMd(s) {
    return (s || '').replace(/\r\n/g, '\n').trim();
  }

  function buildCapture() {
    const blocks = document.querySelectorAll('.capture-block');
    const lines = [];
    lines.push('# UConn workflow mapping — session capture');
    lines.push('');
    lines.push('Date: ' + new Date().toISOString().slice(0, 10));
    lines.push('Captured at: ' + new Date().toISOString());
    lines.push('');
    let any = false;
    blocks.forEach(function(block) {
      const sectionId = block.getAttribute('data-section') || '?';
      const sectionName = block.getAttribute('data-section-name') || '';
      const question = block.getAttribute('data-question') || '';
      const radios = block.querySelectorAll('input[type="radio"]:checked');
      const checkboxes = block.querySelectorAll('input[type="checkbox"]:checked');
      const textarea = block.querySelector('textarea');
      const note = textarea ? escapeMd(textarea.value) : '';
      const hasInput = radios.length > 0 || checkboxes.length > 0 || note;
      if (!hasInput) return;
      any = true;
      lines.push('## Section ' + sectionId + ' — ' + sectionName);
      if (question) lines.push('_' + question + '_');
      lines.push('');
      radios.forEach(function(r) {
        const labelText = r.closest('label') ? r.closest('label').textContent.trim() : r.value;
        lines.push('- **Choice:** ' + labelText);
      });
      checkboxes.forEach(function(cb) {
        const labelText = cb.closest('label') ? cb.closest('label').textContent.trim() : cb.value;
        lines.push('- ✓ ' + labelText);
      });
      if (note) {
        lines.push('- **Note:**');
        note.split('\n').forEach(function(l) { lines.push('  > ' + l); });
      }
      lines.push('');
    });
    if (!any) {
      lines.push('_(No captures yet — answer some sections above first.)_');
    }
    return lines.join('\n');
  }

  function fallbackCopy(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.top = '0';
    ta.style.left = '0';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    let ok = false;
    try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    document.body.removeChild(ta);
    return ok;
  }

  btn.addEventListener('click', function() {
    const md = buildCapture();
    const setOk = function() {
      feedback.textContent = '✓ Copied — paste into the SoT thread';
      feedback.className = 'is-success';
      setTimeout(function() { feedback.textContent = ''; feedback.className = ''; }, 4500);
    };
    const setErr = function(err) {
      feedback.textContent = '✗ Copy failed — see browser console';
      feedback.className = 'is-error';
      if (err) console.error('Session capture copy failed:', err);
      setTimeout(function() { feedback.textContent = ''; feedback.className = ''; }, 5500);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(md).then(setOk).catch(function(err) {
        if (fallbackCopy(md)) setOk(); else setErr(err);
      });
    } else {
      if (fallbackCopy(md)) setOk(); else setErr();
    }
  });
})();
</script>
