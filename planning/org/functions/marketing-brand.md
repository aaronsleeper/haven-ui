# Marketing & Brand

> How the world sees Cena Health. In a B2B2C healthcare company, marketing serves
> two audiences: partners (health systems, payers) and patients. The brand must
> convey clinical credibility and human warmth simultaneously.

---

## Responsibilities

- Brand strategy — positioning, messaging, visual identity, voice and tone
- Content creation — thought leadership, case studies, blog, social media
- Website — company site, SEO, conversion optimization
- Partner marketing — materials for health system and payer audiences
- Patient-facing communications — enrollment materials, education content
- Conference & event presence — speaking, booths, sponsorships
- PR & media — press releases, media relationships, awards
- Referral source marketing — materials for PCPs and care teams who refer patients

## Sub-functions

| Sub-function | Owner today | Automation target | Notes |
|---|---|---|---|
| Brand guidelines & assets | Aaron | 🤝 Agent maintains, human evolves | See `cena-health-brand/` |
| Website content | Aaron | 🤝 Agent drafts, human reviews | SEO-aware content generation |
| Case studies & outcomes | Not active | 🤝 Agent drafts from data, human approves | Requires real patient outcome data |
| Social media | Not active | 🤖 Automated scheduling / 🤝 content | Calendar-based posting from approved content |
| Partner pitch materials | Aaron + Vanessa | 🤝 Agent drafts, human customizes | Per-partner customization from templates |
| Patient education content | Not active | 🤝 Agent drafts, clinical review | Must be clinically accurate, health-literate |
| Conference strategy | Vanessa | 🚫 Human | Relationship and judgment driven |
| Email campaigns | Not active | 🤖 Automated (triggered) / 🤝 (campaigns) | Drip sequences for partners, newsletters |
| Competitive intelligence | Not active | 🤖 Automated monitoring | Track competitors, market trends, regulatory changes |
| Testimonial collection | Not active | 🤝 Agent prompts, human curates | Post-outcome surveys → testimonial candidates |

## Interfaces

| Direction | Function | What flows |
|---|---|---|
| **From** | Data & Analytics | Outcomes data for case studies, ROI metrics |
| **From** | Executive | Strategic messaging priorities |
| **From** | Clinical Care | Clinical accuracy review for patient content |
| **From** | Business Development | What resonates with prospects, objection patterns |
| **To** | Business Development | Qualified leads, content for sales enablement |
| **To** | Patient Operations | Enrollment and education materials |
| **To** | Partner & Payer | Co-branded materials, partner-specific content |

## Current state (Cena Health, March 2026)

Aaron maintains brand assets in `cena-health-brand/`. No active content marketing,
social media, or email campaigns. Partner materials created ad hoc for specific
pitches. Patient-facing materials minimal. Brand identity established but not yet
widely deployed.

## Quality checks

- All patient-facing content reviewed for health literacy (target: 6th grade reading level)
- Clinical claims reviewed by RDN or medical director before publication
- Brand consistency check — assets match guidelines in `cena-health-brand/`
- Partner materials reviewed by Vanessa for strategic alignment
- Outcomes claims backed by actual data (no aspirational statistics)

## Automation roadmap

**Phase 1:** Competitive intelligence monitoring. Agent-drafted website content and
blog posts from approved topics.

**Phase 2:** Automated case study generation from patient outcome data (de-identified).
Social media scheduling. Email drip sequences for partner nurturing.

**Phase 3:** Personalized partner marketing — agent generates partner-specific materials
from CRM data and interaction history. Patient education content dynamically tailored
to patient literacy level and condition.
