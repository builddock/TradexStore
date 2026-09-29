# Discovery questionnaire — Q1–Q70 (BP §26.1–26.7)

| Field | Value |
|---|---|
| Task | `T-0-M01-03` (location per `D-210`) |
| Source | BP §26.1–26.7. Question wording is **verbatim** so every answer stays traceable to the blueprint |
| Prepared | 2026-09-29 |
| Issued | **Not yet issued** — see *Record of issue* below |
| Shareable | Yes — this file may be given to the client representatives as it stands |
| Related | `next-meeting-pack.md` (where each question is discussed) · `decision-owners.md` (who decides what the answers inform) |

## How to record an answer
1. **Answer** — what the respondent said, in plain words. Give figures with their unit and period ("≈ 40 orders
   per normal day, website only"). If the respondent does not know yet, leave the answer empty and set the status
   to `open` with an owner and a due date.
2. **Respondent** — record the **role** (Owner, Operations, Finance, …), not a personal name. Personal
   information that the analysis does not need is left out (BP §26.10).
3. **Date** — the date the answer was given (YYYY-MM-DD). A later correction adds a new dated line; it does not
   overwrite the earlier one.
4. **Status** — `open · owner <role> · due <date>` → `answered` (given, not yet checked) → `confirmed`
   (checked against evidence, e.g. by the system audit `T-0-M25-02` or the data inventory `T-0-M25-01`).
5. **An answer is evidence, not a decision.** The decisions listed under *Informs* are made separately, by their
   approver, and recorded in `plan/DECISIONS.md`. Figures from the first meeting ("5–6", "10", call and card
   costs) are not commitments and are not used in estimates (BP §2.2).
6. **Store only what the owner approves for storage** while the publication question `D-115` is open. Never
   record passwords, access keys, customer records or bank details here (BP §19.1, §26.10). Sample documents
   are collected, redacted, by `T-0-M25-04`, not pasted into this file.
7. *Sources already say* is context for the interviewer so a known point can be confirmed rather than asked
   cold. It is **not an answer** and does not replace the respondent's answer.
8. *Suggested respondent* is the approver of the decision the answer informs (BP §27.2, `DECISIONS.md`). Change
   it freely; it only helps route the question.

## Record of issue
| Issued to (role) | Date issued | How | Answers returned | Notes |
|---|---|---|---|---|
| — | — | — | — | Not yet issued |

---

## 26.1 Business and scope

#### Q1 · What is the legal selling entity and brand? Are multiple entities involved?
- *Informs:* D-059, D-010, D-124, D-049 (brand name) · *Suggested respondent:* Owner
- *Sources already say:* BP §27.3 planning assumption, not client-confirmed — one primary selling organisation, operating in India, currency INR.
- *Answer:* —
- *Respondent · date:* —
- *Status:* open · owner Owner · due —

#### Q2 · What does “retail user” mean here: consumer, shop, reseller, institution, or all of these?
- *Informs:* D-006 · *Suggested respondent:* Owner / sales
- *Sources already say:* MEET — "dealer and retail prices". BP §3.1 assumes consumer (B2C) and approved dealer (B2B); "if the client means something different by 'retail users', rename the segments before implementation".
- *Answer:* —
- *Respondent · date:* —
- *Status:* open · owner Owner · due —

#### Q3 · Which product categories and conditions are in the first catalog?
- *Informs:* D-023 (conditions), D-167 (if digital goods are sold), catalog seed S-07 (`T-1A.4-M04-03`) · *Suggested respondent:* Owner
- *Sources already say:* MEET — "imported and refurbished IT goods, own-brand products, and vendor-stocked products". Categories shown in the prototype are samples.
- *Answer:* —
- *Respondent · date:* —
- *Status:* open · owner Owner · due —

#### Q4 · How many active SKUs and unique refurbished units exist?
- *Informs:* D-010 · *Suggested respondent:* Operations
- *Sources already say:* —
- *Answer:* —
- *Respondent · date:* —
- *Status:* open · owner Operations · due —

#### Q5 · How many orders come from website, branch, phone and WhatsApp on a normal/peak day?
- *Informs:* D-010, D-207 (load-test workload from measured peak) · *Suggested respondent:* Operations
- *Sources already say:* MEET — orders arrive through the website, branches and WhatsApp. No volumes given.
- *Answer:* —
- *Respondent · date:* —
- *Status:* open · owner Operations · due —

#### Q6 · Which geographic areas are served? What are the unsupported areas?
- *Informs:* D-059, D-013, D-162, D-124 · *Suggested respondent:* Owner / operations
- *Sources already say:* BP §27.3 planning assumption, not client-confirmed — initial operations primarily in India.
- *Answer:* —
- *Respondent · date:* —
- *Status:* open · owner Owner · due —

#### Q7 · Are any sellers selling directly to customers, or does the company buy/resell everything?
- *Informs:* D-007, D-046 · *Suggested respondent:* Owner / finance
- *Sources already say:* MEET — sellers would upload products "while the company retains overall control over vendor access, listing approval, and priority"; future models may include "seller listings and products the business does not stock". BP §3.2 proposed launch model: company-controlled sales, suppliers submit information for review (a proposal, not a decision).
- *Answer:* —
- *Respondent · date:* —
- *Status:* open · owner Owner · due —

#### Q8 · Who issues each invoice and handles returns/warranty?
- *Informs:* D-008, D-022, D-037 · *Suggested respondent:* Owner / finance
- *Sources already say:* MEET — authenticity, warranty/RMA handling and returns were raised as concerns. No answer given.
- *Answer:* —
- *Respondent · date:* —
- *Status:* open · owner Owner · due —

#### Q9 · Which three problems must improve in the first release?
- *Informs:* D-048, D-220; the BP §4 baseline (`T-0-M17-02`) · *Suggested respondent:* Owner
- *Sources already say:* MEET — the current site is "unattractive and slow"; product and stock entry involves manual steps; the goal is to "reduce user dependency" on the owner.
- *Answer:* —
- *Respondent · date:* —
- *Status:* open · owner Owner · due —

#### Q10 · What exact features must exist on the first public launch day?
- *Informs:* D-048, D-220, D-223 · *Suggested respondent:* Owner
- *Sources already say:* MEET — "Phase 1 prioritizes the customer-facing website and customer attraction; web comes before an app"; chatbot, automated customer care and expanded reporting "considered later". BP §5.1 proposes 1A and 1B as two web sub-releases (a proposal).
- *Answer:* —
- *Respondent · date:* —
- *Status:* open · owner Owner · due —

## 26.2 Current systems and data

#### Q11 · What applications manage stock, billing, accounts, customer records and support?
- *Informs:* D-009, D-011; `T-0-M25-02`, `T-0-M25-03` · *Suggested respondent:* Owner (or whoever runs the current systems)
- *Sources already say:* MEET — "Current inventory is managed through an existing backend".
- *Answer:* —
- *Respondent · date:* —
- *Status:* open · owner Owner · due —

#### Q12 · Who owns the source code, cloud account, domain and databases?
- *Informs:* D-009, D-005 · *Suggested respondent:* Owner
- *Sources already say:* MEET — the existing site is hosted on Amazon AWS (BP R18: reported, not inspected).
- *Answer:* —
- *Respondent · date:* —
- *Status:* open · owner Owner · due —

#### Q13 · Are documented APIs and data exports available?
- *Informs:* D-009, D-038; `T-0-M25-02` · *Suggested respondent:* Owner (or whoever runs the current systems)
- *Sources already say:* —
- *Answer:* —
- *Respondent · date:* —
- *Status:* open · owner Owner · due —

#### Q14 · Can the current stock system reserve inventory atomically across channels?
- *Informs:* D-001, D-009; verified by `T-0-M25-02` and the platform proof · *Suggested respondent:* Owner (or whoever runs the current systems)
- *Sources already say:* —
- *Answer:* —
- *Respondent · date:* —
- *Status:* open · owner Owner · due —

#### Q15 · What causes current website slowness, according to measured evidence?
- *Informs:* D-009, D-005; measured by `T-0-M25-02` · *Suggested respondent:* Owner (or whoever runs the current systems)
- *Sources already say:* MEET — the site is "reported to be unattractive and slow". No measurement yet; BP §21.1 requires the cause to be measured before any replacement is recommended.
- *Answer:* —
- *Respondent · date:* —
- *Status:* open · owner Owner · due —

#### Q16 · Are there duplicate products, inconsistent SKUs or missing serials?
- *Informs:* D-038; `T-0-M25-01` · *Suggested respondent:* Operations
- *Sources already say:* MEET — "Product and stock entry currently involves manual steps".
- *Answer:* —
- *Respondent · date:* —
- *Status:* open · owner Operations · due —

#### Q17 · Where are images stored, and who owns usage rights?
- *Informs:* D-057; `T-0-M25-01` · *Suggested respondent:* Owner
- *Sources already say:* MEET / BP R20 — automatic transfer of product details, quantities and images "raised for investigation".
- *Answer:* —
- *Respondent · date:* —
- *Status:* open · owner Owner · due —

#### Q18 · Which integrations already exist and what are their failure rates?
- *Informs:* D-009; `T-0-M25-02` · *Suggested respondent:* Owner (or whoever runs the current systems)
- *Sources already say:* —
- *Answer:* —
- *Respondent · date:* —
- *Status:* open · owner Owner · due —

#### Q19 · What historical data must remain available for warranty and finance?
- *Informs:* D-038, D-036, D-122; `T-0-M25-01` · *Suggested respondent:* Operations / finance
- *Sources already say:* MEET — warranty/RMA handling matters. BP §27.2 proposed default: open transactions plus needed warranty history (a proposal).
- *Answer:* —
- *Respondent · date:* —
- *Status:* open · owner Operations · due —

#### Q20 · When was a backup last successfully restored?
- *Informs:* D-108, D-034; `T-0-M25-02` · *Suggested respondent:* Owner (or whoever runs the current systems)
- *Sources already say:* —
- *Answer:* —
- *Respondent · date:* —
- *Status:* open · owner Owner · due —

## 26.3 Inventory and sourcing

#### Q21 · How many branches, warehouses and bins are used?
- *Informs:* D-010, D-029 · *Suggested respondent:* Operations
- *Sources already say:* MEET — multiple branches; "branch and warehouse stock reporting" is required. No counts given.
- *Answer:* —
- *Respondent · date:* —
- *Status:* open · owner Operations · due —

#### Q22 · What are the ownership rules for supplier-held or consignment stock?
- *Informs:* D-128, D-008, D-073 · *Suggested respondent:* Owner / finance
- *Sources already say:* MEET — "vendor-stocked products" were raised.
- *Answer:* —
- *Respondent · date:* —
- *Status:* open · owner Owner · due —

#### Q23 · How are receipt, inspection and publication separated today?
- *Informs:* D-081, D-023; process maps `T-0-M01-04` · *Suggested respondent:* Operations
- *Sources already say:* MEET — "an approval step before product data enters the live database was discussed".
- *Answer:* —
- *Respondent · date:* —
- *Status:* open · owner Operations · due —

#### Q24 · Which goods require serial/batch/expiry tracking?
- *Informs:* D-126, D-031 · *Suggested respondent:* Operations
- *Sources already say:* — (serial numbers in the prototype are samples)
- *Answer:* —
- *Respondent · date:* —
- *Status:* open · owner Operations · due —

#### Q25 · How are refurbished grades defined and verified?
- *Informs:* D-023 · *Suggested respondent:* Owner / operations
- *Sources already say:* The prototype's "42-point" check and Grade A/B thresholds are samples only. BP §6.6: a grade is not meaningful unless its rubric covers cosmetic, functional, battery, accessories and warranty.
- *Answer:* —
- *Respondent · date:* —
- *Status:* open · owner Owner · due —

#### Q26 · Are specific units photographed, or do all units use generic images?
- *Informs:* D-023, D-057 · *Suggested respondent:* Operations
- *Sources already say:* —
- *Answer:* —
- *Respondent · date:* —
- *Status:* open · owner Operations · due —

#### Q27 · How are transfers and in-transit goods tracked?
- *Informs:* D-220 (PR1 §12 places transfers later than BP §5.1); process maps `T-0-M01-04` · *Suggested respondent:* Operations
- *Sources already say:* —
- *Answer:* —
- *Respondent · date:* —
- *Status:* open · owner Operations · due —

#### Q28 · Can branch staff sell while offline? How often?
- *Informs:* D-030 · *Suggested respondent:* Operations
- *Sources already say:* —
- *Answer:* —
- *Respondent · date:* —
- *Status:* open · owner Operations · due —

#### Q29 · How frequently is stock physically counted?
- *Informs:* D-069 · *Suggested respondent:* Operations
- *Sources already say:* —
- *Answer:* —
- *Respondent · date:* —
- *Status:* open · owner Operations · due —

#### Q30 · Which supplier files/APIs exist, and how reliable/fresh are they?
- *Informs:* D-028, D-057 · *Suggested respondent:* Operations
- *Sources already say:* MEET / BP R20 — automatic transfer of product details, quantities and images "raised for investigation".
- *Answer:* —
- *Respondent · date:* —
- *Status:* open · owner Operations · due —

## 26.4 Pricing and finance

#### Q31 · What approves a dealer account and its employees?
- *Informs:* D-067, D-066 · *Suggested respondent:* Owner / finance
- *Sources already say:* —
- *Answer:* —
- *Respondent · date:* —
- *Status:* open · owner Owner · due —

#### Q32 · Is price based on customer, location, quantity, channel or negotiated contract?
- *Informs:* D-017, D-044 · *Suggested respondent:* Owner / finance
- *Sources already say:* MEET — "Pricing may vary by location, with dealer and retail prices and potentially location-based pricing engines".
- *Answer:* —
- *Respondent · date:* —
- *Status:* open · owner Owner · due —

#### Q33 · Are quantity tiers all-units or graduated? Do they apply per SKU or basket?
- *Informs:* D-018 · *Suggested respondent:* Owner / sales
- *Sources already say:* BP §8.2 shows an all-units example — illustrative only.
- *Answer:* —
- *Respondent · date:* —
- *Status:* open · owner Owner · due —

#### Q34 · Which promotions may combine with dealer prices?
- *Informs:* D-017, D-043 · *Suggested respondent:* Owner / finance
- *Sources already say:* —
- *Answer:* —
- *Respondent · date:* —
- *Status:* open · owner Owner · due —

#### Q35 · Is displayed pricing tax-inclusive, tax-exclusive, or different by buyer type?
- *Informs:* D-016 · *Suggested respondent:* Finance
- *Sources already say:* The prototype shows consumer prices including GST and dealer prices excluding GST — a sample, not a decision.
- *Answer:* —
- *Respondent · date:* —
- *Status:* open · owner Finance · due —

#### Q36 · What minimum margin/discount limits require approval?
- *Informs:* D-024 · *Suggested respondent:* Owner / finance
- *Sources already say:* BP §18.1 — monetary limits must be supplied by the client; ₹ values in the prototype are samples.
- *Answer:* —
- *Respondent · date:* —
- *Status:* open · owner Owner · due —

#### Q37 · Are credit terms, COD, partial payment or deposits required?
- *Informs:* D-019, D-020 · *Suggested respondent:* Finance
- *Sources already say:* BP §8.3 planning default — prepaid (not client-confirmed).
- *Answer:* —
- *Respondent · date:* —
- *Status:* open · owner Finance · due —

#### Q38 · Which accounting software and tax registrations apply?
- *Informs:* D-011, D-037, D-055 · *Suggested respondent:* Finance (with the accountant)
- *Sources already say:* The accounting product named in the prototype is a sample only.
- *Answer:* —
- *Respondent · date:* —
- *Status:* open · owner Finance · due —

#### Q39 · Which payment provider is preferred and already approved?
- *Informs:* D-012 · *Suggested respondent:* Finance
- *Sources already say:* MEET — the payment gateway "remains to be determined".
- *Answer:* —
- *Respondent · date:* —
- *Status:* open · owner Finance · due —

#### Q40 · Who can issue a refund, credit note, write-off or payout?
- *Informs:* D-024, D-222, D-196 · *Suggested respondent:* Owner / finance
- *Sources already say:* —
- *Answer:* —
- *Respondent · date:* —
- *Status:* open · owner Owner · due —

## 26.5 Order fulfilment and service

#### Q41 · Who checks and releases an order today?
- *Informs:* D-222; process maps `T-0-M01-04` · *Suggested respondent:* Operations
- *Sources already say:* —
- *Answer:* —
- *Respondent · date:* —
- *Status:* open · owner Operations · due —

#### Q42 · How is a warehouse chosen and are split shipments allowed?
- *Informs:* D-029 · *Suggested respondent:* Operations
- *Sources already say:* —
- *Answer:* —
- *Respondent · date:* —
- *Status:* open · owner Operations · due —

#### Q43 · Which courier/serviceability rules apply to laptops and other electronics?
- *Informs:* D-013, D-162 · *Suggested respondent:* Operations
- *Sources already say:* MEET — delivery modules "remain to be determined".
- *Answer:* —
- *Respondent · date:* —
- *Status:* open · owner Operations · due —

#### Q44 · How are serials captured during picking and packing?
- *Informs:* D-110, D-031 · *Suggested respondent:* Operations
- *Sources already say:* —
- *Answer:* —
- *Respondent · date:* —
- *Status:* open · owner Operations · due —

#### Q45 · What happens if payment succeeds but stock is unavailable?
- *Informs:* D-026 · *Suggested respondent:* Owner / finance
- *Sources already say:* BP §10.3 proposal — re-reserve if possible, otherwise a visible hold or refund under policy. Durations are not specified.
- *Answer:* —
- *Respondent · date:* —
- *Status:* open · owner Owner · due —

#### Q46 · What are return, cancellation, DOA and warranty policies by product condition?
- *Informs:* D-022 · *Suggested respondent:* Owner / support
- *Sources already say:* The return windows shown in the prototype (7 and 10 days) are samples. BP §27.2 proposed default: policies versioned by product and condition.
- *Answer:* —
- *Respondent · date:* —
- *Status:* open · owner Owner · due —

#### Q47 · Who inspects returns and authorises resale?
- *Informs:* D-222, D-022 · *Suggested respondent:* Operations / support
- *Sources already say:* —
- *Answer:* —
- *Respondent · date:* —
- *Status:* open · owner Operations · due —

#### Q48 · Which support questions consume the most staff time?
- *Informs:* D-074, D-078; UI inputs `T-0-M09-01` · *Suggested respondent:* Support
- *Sources already say:* MEET — automation "could support … customer service"; automated customer care "considered later".
- *Answer:* —
- *Respondent · date:* —
- *Status:* open · owner Support · due —

#### Q49 · What support hours and escalation contacts exist?
- *Informs:* D-074, D-035 · *Suggested respondent:* Owner / support
- *Sources already say:* — (record escalation contacts by role, not by name or phone number)
- *Answer:* —
- *Respondent · date:* —
- *Status:* open · owner Owner · due —

#### Q50 · Which WhatsApp number/app/provider is used today?
- *Informs:* D-014 · *Suggested respondent:* Operations
- *Sources already say:* MEET — WhatsApp orders are received today. (Record the app and provider; the number itself need not be stored here.)
- *Answer:* —
- *Respondent · date:* —
- *Status:* open · owner Operations · due —

## 26.6 Automation and owner control

#### Q51 · List the five tasks for which staff most often call the owner.
- *Informs:* D-078, D-025; owner-interruption list `T-0-M17-01` · *Suggested respondent:* Owner
- *Sources already say:* MEET — the immediate scope is "to reduce user dependency and establish core functionality".
- *Answer:* —
- *Respondent · date:* —
- *Status:* open · owner Owner · due —

#### Q52 · Which decisions can staff already make independently?
- *Informs:* D-222, D-024 · *Suggested respondent:* Owner
- *Sources already say:* MEET — the operating model emphasises "monitoring rather than unrestricted staff input".
- *Answer:* —
- *Respondent · date:* —
- *Status:* open · owner Owner · due —

#### Q53 · Which tasks require judgement, physical inspection or negotiation?
- *Informs:* D-078, D-221 · *Suggested respondent:* Owner / operations
- *Sources already say:* —
- *Answer:* —
- *Respondent · date:* —
- *Status:* open · owner Owner · due —

#### Q54 · How much time and how many errors occur per task each week?
- *Informs:* D-078, D-193; `T-0-M17-01`, `T-0-M17-02` · *Suggested respondent:* Operations
- *Sources already say:* — (observation by `T-0-M17-01` confirms or corrects the estimate)
- *Answer:* —
- *Respondent · date:* —
- *Status:* open · owner Operations · due —

#### Q55 · What approved rules would allow routine cases to proceed automatically?
- *Informs:* D-078, D-024, D-221 · *Suggested respondent:* Owner
- *Sources already say:* —
- *Answer:* —
- *Respondent · date:* —
- *Status:* open · owner Owner · due —

#### Q56 · Who owns each exception and who acts when they are absent?
- *Informs:* D-025, D-138, D-185, D-198 · *Suggested respondent:* Owner
- *Sources already say:* —
- *Answer:* —
- *Respondent · date:* —
- *Status:* open · owner Owner · due —

#### Q57 · Which alerts are urgent and which can be in a daily digest?
- *Informs:* D-138, D-063, D-195 · *Suggested respondent:* Owner
- *Sources already say:* —
- *Answer:* —
- *Respondent · date:* —
- *Status:* open · owner Owner · due —

#### Q58 · Which automation mistake would have the highest business impact?
- *Informs:* D-078, D-194 · *Suggested respondent:* Owner
- *Sources already say:* —
- *Answer:* —
- *Respondent · date:* —
- *Status:* open · owner Owner · due —

#### Q59 · What improvement would justify the monthly operating cost?
- *Informs:* D-078, D-193 · *Suggested respondent:* Owner
- *Sources already say:* MEET — payment-collection calls were quoted at ₹5,000 a month with usage charges unclear; the basis is unknown, so the figure is not a commitment and is excluded from estimates (BP §2.2).
- *Answer:* —
- *Respondent · date:* —
- *Status:* open · owner Owner · due —

#### Q60 · Who reviews automation performance and may disable a faulty rule?
- *Informs:* D-194 · *Suggested respondent:* Owner
- *Sources already say:* —
- *Answer:* —
- *Respondent · date:* —
- *Status:* open · owner Owner · due —

## 26.7 UI and future direction

#### Q61 · Which exact Amazon/Flipkart screens or patterns does the client prefer?
- *Informs:* D-049; recorded as design requirements by `T-0-M09-01` · *Suggested respondent:* Owner
- *Sources already say:* MEET / BP R01 — a strong UI resembling familiar large marketplaces. BP §1.3 — record *which* screens are liked and *why*; "make it exactly like Amazon" cannot be an acceptance test.
- *Answer:* —
- *Respondent · date:* —
- *Status:* open · owner Owner · due —

#### Q62 · What should the new brand feel like, and which assets already exist?
- *Informs:* D-049 · *Suggested respondent:* Owner
- *Sources already say:* MEET — the current site's look and feel was identified as a shortcoming.
- *Answer:* —
- *Respondent · date:* —
- *Status:* open · owner Owner · due —

#### Q63 · Which devices/languages do customers use?
- *Informs:* D-050, D-206, D-223 · *Suggested respondent:* Owner
- *Sources already say:* MEET — mobile responsiveness was identified as a shortcoming of the current site.
- *Answer:* —
- *Respondent · date:* —
- *Status:* open · owner Owner · due —

#### Q64 · Are comparison, wishlist, reviews, quotations or bulk order entry launch needs?
- *Informs:* D-042, D-041, D-121 · *Suggested respondent:* Owner
- *Sources already say:* BP §5.2 marks wishlist/comparison and reviews as conditional ("do not block reliable checkout"). All appear in the prototype.
- *Answer:* —
- *Respondent · date:* —
- *Status:* open · owner Owner · due —

#### Q65 · What accessibility expectations apply?
- *Informs:* D-051 · *Suggested respondent:* Owner
- *Sources already say:* BP §6.7 proposes WCAG 2.2 AA with an agreed test scope (a proposal).
- *Answer:* —
- *Respondent · date:* —
- *Status:* open · owner Owner · due —

#### Q66 · For Phase 2, which mobile app platforms and capabilities are needed: repeat buying, scanning, push, or offline staff work?
- *Informs:* D-085 (Phase 2 scope, `T-2-M28-01`) · *Suggested respondent:* Owner
- *Sources already say:* MEET — web comes before an app.
- *Answer:* —
- *Respondent · date:* —
- *Status:* open · owner Owner · due —

#### Q67 · What future businesses are likely, and do they share ownership, stock and staff?
- *Informs:* D-046; `vision-backlog.md` VB-019 and VB-029 · *Suggested respondent:* Owner
- *Sources already say:* MEET — possible future models include "separate domains or instances on one platform, including seller listings and products the business does not stock".
- *Answer:* —
- *Respondent · date:* —
- *Status:* open · owner Owner · due —

#### Q68 · What AI task has sufficient data and measurable value?
- *Informs:* D-086 (Phase 3 scope, `T-3-M29-01`) · *Suggested respondent:* Owner
- *Sources already say:* MEET — LLM functionality was excluded from the initial budget; local LLM hosting was raised as a later possibility.
- *Answer:* —
- *Respondent · date:* —
- *Status:* open · owner Owner · due —

#### Q69 · What service outage/data loss can the business tolerate?
- *Informs:* D-034, D-108 · *Suggested respondent:* Owner / operations
- *Sources already say:* —
- *Answer:* —
- *Respondent · date:* —
- *Status:* open · owner Owner · due —

#### Q70 · Who signs off scope, UI, finance, UAT and launch?
- *Informs:* approvers of the BP §31.2 sign-off worksheet (checked by the exit gate `T-0-M01-29`); owners in `decision-owners.md`; D-049 · *Suggested respondent:* Owner
- *Sources already say:* MEET — for the requirements document "no specific owner was established".
- *Answer:* —
- *Respondent · date:* —
- *Status:* open · owner Owner · due —
