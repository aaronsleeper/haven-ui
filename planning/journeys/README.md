# User Journeys

Step-by-step journey maps for each role's key workflows. Built using the
User Journey Mapping skill framework (`skills/ux-architect/`).

**Status:** 🔲 Not started | ✅ Complete

---

## Journey index

### Care Coordinator (Admin App)
| Journey | Status |
|---|---|
| [Morning queue triage](coordinator-morning-triage.md) | ✅ Complete |
| [Process a new referral](coordinator-referral-intake.md) | ✅ Complete |
| [Review and approve a care plan](coordinator-care-plan-review.md) | ✅ Complete |
| Handle a disengaged patient | 🔲 |
| Process a discharge | 🔲 |

### RDN (Provider App)
| Journey | Status |
|---|---|
| [Review nutrition plan for new care plan](rdn-nutrition-plan-review.md) | ✅ Complete |
| [Post-visit documentation and signing](rdn-post-visit-documentation.md) | ✅ Complete |
| [Respond to out-of-range lab alert](rdn-lab-alert-response.md) | ✅ Complete |

### Patient (Patient App)
| Journey | Status |
|---|---|
| [First-time enrollment and onboarding](patient-enrollment.md) | ✅ Complete |
| [Provide meal feedback](patient-meal-feedback.md) | ✅ Complete |
| [View and confirm appointment](patient-appointment-management.md) | ✅ Complete |

### Kitchen Staff (Kitchen App)
| Journey | Status |
|---|---|
| [Fulfill daily orders](kitchen-daily-orders.md) | ✅ Complete |
| [Report a delivery issue](kitchen-delivery-issue.md) | ✅ Complete |

### Partner (Partner Portal)
| Journey | Status |
|---|---|
| [Submit a referral](partner-submit-referral.md) | ✅ Complete |
| [Review outcomes report](partner-outcomes-report.md) | ✅ Complete |

---

## Remaining journeys

Two coordinator journeys are deferred — they follow the same patterns established above:
- **Handle a disengaged patient** — uses the same queue → review → decide flow; unique element is the disengagement escalation ladder
- **Process a discharge** — uses the same approval card pattern; unique element is the transition summary generation

These can be mapped when needed, likely during wireframe design.

---

## Cross-journey patterns

Patterns that emerged across all journeys and should inform component design:

| Pattern | Appears in | Design priority |
|---|---|---|
| **Approval card** | All coordinator and RDN journeys | Highest — the hero component |
| **Queue item with urgency tier** | Coordinator, RDN, Kitchen | High — drives daily workflow |
| **Thread message types** | All internal roles | High — consistency across surfaces |
| **Diff view (before/after)** | Care plan updates, lab alerts | Medium — saves review time |
| **Split-panel comparison** | Duplicate detection, freeform parsing | Medium — trust-building |
| **SMS-first interaction** | Patient appointment, enrollment | High — primary patient channel |
| **Recipe/order grouping** | Kitchen daily orders | Medium — matches physical workflow |
| **Inline metric definitions** | Partner outcomes report | Medium — prevents misinterpretation |

## How to read these journeys

Each journey follows a consistent structure:

- **Journey metadata** — who, goal, frequency, entry/exit, duration
- **Prerequisites** — what must be true before starting
- **Happy path** — step-by-step ideal flow with screen, action, system response
- **Alternative paths** — common variations
- **Exception handling** — what goes wrong and how to recover
- **Critical moments** — where the UX must earn trust or prevent error
- **Connected journeys** — what feeds in and what follows
- **Design implications** — what this journey means for component and interaction design
