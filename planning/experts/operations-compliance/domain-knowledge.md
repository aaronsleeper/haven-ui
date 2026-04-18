# Domain Knowledge -- Operations / Compliance

What this expert must know to do the job. Organized by sub-domain, with source
and shelf life for each knowledge area.

---

## HIPAA compliance

| Knowledge area | What specifically | Source | Shelf life |
|---|---|---|---|
| Privacy Rule (45 CFR 164.500-534) | Covered entity obligations, permitted uses/disclosures, minimum necessary standard, patient rights (access, amendment, accounting of disclosures). Cena Health is a covered entity providing MNT -- all patient nutrition data is PHI. | HHS.gov HIPAA guidance | Stable framework, OCR enforcement priorities shift ~annually |
| Security Rule (45 CFR 164.302-318) | Administrative, physical, and technical safeguards. Risk analysis requirement (45 CFR 164.308(a)(1)). Encryption standards for PHI at rest and in transit. Applies to all electronic PHI in the platform. | HHS.gov Security Rule guidance, NIST SP 800-66 | Stable framework, technology controls evolve |
| Breach Notification Rule (45 CFR 164.400-414) | 60-day notification window for breaches affecting 500+ individuals (HHS + media). Individual notification for all breaches. Risk assessment to determine if breach occurred (4-factor test). | HHS.gov Breach Rule | Stable |
| BAA requirements (45 CFR 164.502(e)) | Any entity that creates, receives, maintains, or transmits PHI on behalf of a covered entity requires a BAA. Subcontractor BAAs required. BAA must specify permitted uses, safeguards, breach reporting obligations, and termination provisions. | HHS BAA guidance | Stable requirement |
| Minimum necessary standard | PHI disclosures limited to the minimum necessary for the intended purpose. Kitchen partners receiving dietary orders should receive restriction categories, not diagnosis codes, unless diagnosis is clinically necessary for food safety. | 45 CFR 164.502(b) | Stable principle |
| `[ASSUMPTION]` LLM/AI PHI handling | PHI in LLM prompts requires a BAA with the model provider. Google/Vertex AI BAA is in progress. Until executed, no PHI should enter LLM prompts. De-identification or synthetic data required for development. | HHS guidance on cloud computing + HIPAA, ONC health AI framework. Validates by: Vanessa/legal counsel confirming BAA execution | Evolving -- OCR has not issued AI-specific guidance yet |

## Medicare/Medicaid billing

| Knowledge area | What specifically | Source | Shelf life |
|---|---|---|---|
| MNT billing codes | 97802: MNT initial assessment (15 min). 97803: MNT reassessment/intervention (15 min). 97804: MNT group (2+ patients, 30 min). These are the primary CPT codes for dietitian-delivered nutrition therapy under Medicare Part B. | CMS Medicare Physician Fee Schedule, CPT Manual | Annual (CMS rate updates each January) |
| Medicare MNT visit caps | 3 initial hours + 2 follow-up hours per calendar year. Applies to Medicare Part B beneficiaries. Referral from treating physician required. Covered diagnoses: diabetes (E11.x), renal disease (N18.x), kidney transplant (Z94.0) within 36 months. | Medicare Benefit Policy Manual Ch. 15, Sec. 80 | Stable -- legislative change required to modify |
| Timely filing windows | Medicare: 12 months from date of service. Medicaid: varies by state, commonly 90-180 days. Commercial: varies by payer contract, commonly 90-365 days. Medicare Advantage: per plan contract, often 12 months. | CMS Claims Processing Manual; state Medicaid manuals; payer contracts | Payer-specific -- verify per contract |
| PMPM billing models | Per-member-per-month capitation: fixed monthly payment per enrolled member regardless of utilization. Common in VBC arrangements. Requires member roster reconciliation. Revenue recognized monthly; no per-visit claims. | Industry standard; specific rates are contract-negotiated | Model is stable; rates are contract-specific |
| `[ASSUMPTION]` Athena billing integration | Athena Health is the confirmed billing platform. Claims generated and submitted through Athena. Denial management, payment posting, and ERA processing through Athena workflows. Assume standard Athena API for claims submission and status tracking. | Vanessa confirmation (Athena selected). Validates by: Vanessa/billing team confirming Athena configuration | Changes with platform decisions |

## Value-based care economics

| Knowledge area | What specifically | Source | Shelf life |
|---|---|---|---|
| Shared savings models | Payer calculates total cost of care for attributed population. If actual cost < benchmark, savings are split per contract (typical splits: 50/50 to 70/30 provider-favoring). Downside risk optional in early contracts. Reconciliation periods: typically annual. | CMS MSSP documentation, commercial VBC contract patterns | Model stable; terms are contract-specific |
| HEDIS measures relevant to nutrition | CDC (Comprehensive Diabetes Care): HbA1c testing, HbA1c control (<8.0%), eye exam, nephropathy screening. CBP (Controlling High Blood Pressure). BMI screening/follow-up. These are the measures where food-as-medicine programs demonstrate value. | NCQA HEDIS Technical Specifications (annual) | Annual updates (NCQA publishes each year) |
| Quality metrics for VBC contracts | Star ratings (Medicare Advantage), HEDIS measures, patient experience (CAHPS), medication adherence. Cena's value proposition: improved CDC metrics through MNT + behavioral health integration. | CMS Star Ratings methodology, NCQA | Annual methodology updates |
| `[ASSUMPTION]` Shared savings dispute process | Disputes arise when Cena's calculated savings differ from the payer's settlement calculation. Payer provides actual cost data; Cena provides quality/utilization data. No standard dispute resolution -- contract-specific. Cena should own internal reconciliation; dispute escalation path per payer contract. | Industry practice. Validates by: Vanessa/legal counsel during contract negotiation | Contract-specific |

## BAA management

| Knowledge area | What specifically | Source | Shelf life |
|---|---|---|---|
| BAA trigger analysis | A BAA is required when: (1) the entity is not part of Cena's workforce, (2) the entity performs a function involving PHI, (3) the function is on behalf of Cena Health. Kitchen partners receiving diagnosis-linked dietary orders (e.g., "diabetic renal diet") are handling PHI if the order links to a patient's condition. | 45 CFR 160.103 (business associate definition) | Stable definition |
| Kitchen partner PHI exposure | Dietary orders that include diagnosis-linked restrictions (diabetic, renal, cardiac) constitute PHI when combined with patient identity. Even if the kitchen doesn't see the patient's name, if they can identify the patient (delivery address + condition), it's PHI. Minimum necessary: send restriction category without diagnosis code where possible. | HHS PHI definition (45 CFR 160.103), minimum necessary guidance | Stable |
| `[ASSUMPTION]` Kitchen partners are handling PHI | Kitchen partners receiving diagnosis-linked dietary orders are handling PHI and require BAAs. This is a conservative interpretation -- some might argue restriction categories alone aren't PHI, but combined with delivery address and patient identity, they are. | Conservative HIPAA interpretation. Validates by: Vanessa/legal counsel | Stable interpretation unless counsel disagrees |
| Subcontractor BAA chain | If a kitchen partner uses a subcontractor (e.g., delivery service), the subcontractor also needs a BAA with the kitchen. Cena's BAA with the kitchen should require downstream BAA compliance. | HITECH Act subcontractor provisions | Stable requirement |

## State telehealth regulations

| Knowledge area | What specifically | Source | Shelf life |
|---|---|---|---|
| Multi-state dietitian licensure | RDNs must be licensed in the patient's state of residence. Dietetics Licensure Compact covers ~20 states (growing). Non-compact states require individual licensure. Scheduling must block on lapsed credentials per OQ-29 decision. | Commission on Dietetic Registration, state practice acts | Compact membership changes ~annually |
| Audio-only billing | Medicare covers audio-only MNT with modifier 93 (effective post-PHE). Medicaid: state-by-state. Commercial: payer-specific. Some payers require video for initial visit. | CMS Telehealth Services fact sheet, state Medicaid policies | Evolving rapidly -- check quarterly |
| Credentialing requirements | Each payer requires provider credentialing before billing. Credentialing timelines: 60-120 days typical. Must credential in each state where patients reside. CAQH ProView is the standard credentialing database. | Payer credentialing guides, CAQH | Process stable; timelines vary |

## Grant/research compliance

| Knowledge area | What specifically | Source | Shelf life |
|---|---|---|---|
| Federal grant PI requirements | NIH requires PI to have an appointment at the applicant institution. If UConn is the applicant, UConn faculty must serve as PI. Cena Health can be a subcontractor or consultant with a subaward. PI must demonstrate relevant expertise and institutional support. | NIH Grants Policy Statement (GPS), SF-424 (R&R) instructions | Stable requirements |
| IRB interaction | Research involving human subjects requires IRB approval at the PI's institution. If UConn is PI, UConn IRB is primary. Cena may need a reliance agreement or independent IRB review depending on role. | 45 CFR 46 (Common Rule) | Stable framework |
| Research vs. operational data | Quality improvement (QI) data is operational -- no IRB required. Research data requires consent, IRB approval, and data use agreements. The line: is the primary purpose to generate generalizable knowledge? If yes, it's research. | OHRP guidance on QI vs. research | Stable distinction |
| `[ASSUMPTION]` UConn PI structure | UConn has the institutional infrastructure to serve as PI on federal grants (grants office, F&A rate agreement, NIH-approved eRA Commons accounts). UConn faculty member identified or identifiable for PI role. | General expectation for R1 research university. Validates by: Vanessa confirming with UConn contacts | One-time verification |

## Partner contract structures

| Knowledge area | What specifically | Source | Shelf life |
|---|---|---|---|
| PMPM pricing | Fixed monthly rate per enrolled member. Rate covers: MNT services, care coordination, behavioral health screening, meal program administration. Typical ranges for nutrition programs: $50-150 PMPM depending on acuity and service scope. Does not include meal costs (separate line item or carved out). | Industry benchmarking, Cena-specific cost modeling | Rates are contract-specific |
| Shared savings splits | Typical early-stage split: 50/50. As program demonstrates value: shifts toward 60/40 or 70/30 provider-favoring. Downside risk: avoid in first 2-3 contracts until actuarial data supports risk-bearing. | CMS MSSP benchmarks, commercial VBC norms | Contract-specific |
| Anti-Kickback Statute (AKS) / Stark Law | PMPM and shared savings arrangements may implicate AKS depending on structure. Safe harbors exist for VBC arrangements (CMS final rule 2020). Stark Law exceptions for VBC. Pricing model (OQ-41) needs AKS/Stark review by counsel before execution. | 42 USC 1320a-7b, CMS VBC safe harbors (2020 final rule) | Stable framework; counsel review required per arrangement |
| `[ASSUMPTION]` Pricing is contract-specific | Standard PMPM rates will be contract-specific, not universal. Each partner/payer negotiation produces unique rates based on population acuity, service scope, and market. A framework with ranges and methodology is useful; a single rate card is not. | Industry practice for early-stage providers. Validates by: Vanessa | Stable assumption |

## Reference sources

| Source | Domain | Trust level | When to consult |
|---|---|---|---|
| HHS.gov HIPAA guidance | HIPAA Privacy, Security, Breach rules | Authoritative | Any HIPAA compliance question |
| CMS.gov (Medicare Benefit Policy Manual, Claims Processing Manual) | Medicare billing, MNT coverage, timely filing | Authoritative | Billing code questions, coverage rules, filing deadlines |
| NCQA HEDIS Technical Specifications | Quality measures for VBC | Authoritative | HEDIS measure definitions, data model requirements |
| CMS MSSP documentation | Shared savings models, VBC frameworks | Authoritative | Shared savings structure, reconciliation processes |
| NIH Grants Policy Statement | Federal grant requirements, PI eligibility | Authoritative | Grant compliance questions |
| State Medicaid manuals | State-specific billing, telehealth, filing deadlines | Authoritative | Per-state payer requirements |
| CAQH ProView | Provider credentialing | Authoritative | Credentialing process, timeline questions |
| CMS VBC safe harbors (2020 final rule) | AKS/Stark compliance for VBC arrangements | Authoritative | Pricing model and shared savings legal structure |
| Commission on Dietetic Registration | Dietitian licensure, compact states | Authoritative | Multi-state credentialing questions |
| Cena Health internal knowledge (Vanessa) | Institution-specific policies, partner relationships | Authoritative | Any gap between published guidance and Cena's actual practice |

---

## Assumptions index

| # | Assumption | Basis | Validates by | Status |
|---|---|---|---|---|
| A1 | Kitchen partners receiving diagnosis-linked dietary orders are handling PHI | Conservative HIPAA interpretation (PHI = condition + patient identity) | Vanessa/legal counsel | Unvalidated |
| A2 | UConn has institutional infrastructure to serve as federal grant PI | Expected for R1 research university | Vanessa (UConn contacts) | Unvalidated |
| A3 | Standard PMPM rates will be contract-specific, not universal | Industry practice for early-stage providers | Vanessa | Unvalidated |
| A4 | Medicare MNT visit caps apply as published (3+2/year) with no waiver pathway for VBC programs | Medicare Benefit Policy Manual Ch. 15 | Vanessa/billing team | Unvalidated |
| A5 | LLM BAA (Google/Vertex AI) will be executed before PHI enters any LLM prompt | HHS cloud computing guidance + HIPAA | Vanessa/legal counsel confirming execution | Unvalidated |
| A6 | Athena Health handles standard claims workflows (submission, ERA, denial management) | Vanessa confirmation of billing platform selection | Vanessa/billing team confirming configuration | Unvalidated |
