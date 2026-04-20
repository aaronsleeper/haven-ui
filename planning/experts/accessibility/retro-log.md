# Retro Log

## 2026-04-20 — Contrast-pair gate WCAG scope (Patch 8; slice-1 debt item 4)

**Trigger:** Token Steward designing a structural `conform:contrast-pairs` gate to catch WCAG 1.4.11 non-text-contrast failures at authoring time. Consulted on scope: which SC in, which out, thresholds, pair classes, exemption policy.

**Observations:**
- Haven is contracted to WCAG 2.1 AA per CLAUDE.md + essential-briefing.md. Not AAA — SC 1.4.6 (7:1) is a non-goal. Authored a v1 scope table covering SC 1.4.11 (3:1 non-text) and SC 1.4.3 (4.5:1 normal text, 3:1 large text); SC 1.4.1 flagged for "color-only state-carrier" detection.
- Haven's major-third type scale (11.11 / 13.33 / 16 / 19.2 / 23.04 / 27.65 / 33.18 / 39.81 / 47.78 px) pairs with weights 400–600 only — no 700+. **Every text pair is evaluated at 4.5:1 unless ≥24px regular.** Only Display/01 + Heading/01 (≥27.65px) qualify for the large-text exception. Heading/02 (23.04) misses by <1px and evaluates at 4.5:1.
- Disabled state: WCAG exempts from 1.4.11; Haven holds **3:1 minimum anyway** for clinical-lighting / low-vision patients. Haven-specific rule exceeds WCAG.
- ARIA redundancy (e.g., `aria-current="step"`) does NOT exempt from 1.4.11. Token Steward noted the pilot's `.progress-bar-pagination-segment.is-in-progress` comment explicitly relied on ARIA to satisfy 1.3.3 / 1.4.1 — which is correct for those rules, but 1.4.11 requires visual-contrast-at-the-edge independent of ARIA. Caught and codified.
- Token Steward proposed a `brand-taste-override` exemption; **rejected** — DESIGN.md does not authorize brand-taste relaxations of WCAG 1.4.11, and primary-teal discipline is about commit-vs-navigation (orthogonal to contrast). Final exemption list: disabled-state (kept for v2 readiness; Haven's 3:1 rule makes it seldom-used), placeholder-text (v2 text scope), decorative-background, focus-ring-adjacent-only, logotype.
- Decorative vs informational test: "an element is decorative only when it conveys no information redundantly unavailable in text or another accessible channel." `.three-panel-shell` border and `.queue-sidebar` outline qualify (landmarks carry the boundary); `.queue-item.is-urgent/is-attention/is-info` left-border does NOT qualify (tier is only carried by color at the row level).

**Calibration updates:**
- Standing red flag: any contrast-pair gate failure paired with ARIA reasoning is a miscalibrated defense — 1.4.11 is visual-edge-contrast independent of ARIA. Surface explicitly in any future round-2 review that invokes the ARIA defense.
- Haven's disabled-state exceeds-WCAG rule should be called out in every slice's A11y pass; it's not a WCAG-AA conformance requirement but a Haven policy rooted in the clinical use-case.
- State-indicator contrast applies per-state: `.active`, `:hover`, `:focus-visible` are each distinct rendered pairs and each must clear 3:1 against adjacent. Multi-state coverage is a v2 gate expansion.

**Changes to this expert:**
- Add to `quality-criteria.md` (future edit): "ARIA-redundancy defense of a sub-threshold 1.4.11 contrast is miscalibrated — flag immediately."
- Add to `domain-knowledge.md`: WCAG-SC-to-Haven-pair-class mapping table + Haven-disabled-3:1-rule.

**Open questions:**
- **v2 gate expansion — SC 1.4.3 text contrast with font-size resolution.** Blocked on slice-1 debt 3b (button fontSize 14px — whole generic `button` rule uses Tailwind default `text-sm = 0.875rem` which is not in Haven's type scale). Resolve 3b first, then SC 1.4.3 can gate cleanly.
- **v2 gate expansion — multi-state coverage.** `:hover`, `:focus-visible`, `:active`, `:disabled`, `dark:*` variants all distinct pairs. Worth a gate-authoring cycle in slice-2 or slice-3.

---

No interactions prior to 2026-04-20. Expert created 2026-04-11.
