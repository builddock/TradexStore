# Decision owners and target dates — Stage 0 decisions

| Field | Value |
|---|---|
| Task | `T-0-M01-03` (location per `D-210`) |
| Source | BP §31.1 item 7 ("Assign decision owners and dates for the unresolved questions"); approver column of BP §27.2 and `plan/DECISIONS.md` |
| Prepared | 2026-09-29 — owners and dates **not yet assigned**; they are agreed at the next meeting (`next-meeting-pack.md`, agenda item 7) |
| Scope | Every decision that a Stage 0 "Decide D-…" task must record: **47 decisions**. `D-210` is already decided and not listed |
| Shareable | Yes |

## How to use this list
1. **Approver** is copied from `DECISIONS.md` (which follows BP §27.2 where BP names one). It is the role that
   *may* decide. It is the proposed owner until the meeting confirms or changes it.
2. **Named owner** is the role or person the client names at the meeting, the one who brings the decision to a
   close. Store a personal name only if the client agrees to it being stored while `D-115` (publication) is open.
   Otherwise record the role.
3. **Target date** is agreed at the meeting. It cannot be earlier than the **evidence needed first**. That column
   lists the Stage 0 tasks that must be finished before the decision can be made (from each task's *Depends on*
   in `TASKS.md`) and the questionnaire answers that inform it (`questionnaire.md`).
4. **Decided by** is derived from the approver: *Client* when only business roles approve, *Implementation team*
   when only the technical lead approves, *Joint* when both do. Design sits on the implementation-team side
   (BP §22.4).
5. **Status now:** `OPEN` means there is no documented proposal. `PROPOSED-DEFAULT` means a documented proposal
   exists but is **not** a decision. `DECISIONS.md` quotes it, and the decide task's brief presents it as a
   proposal.
6. A decision is recorded only when its approver makes it. It then goes into `DECISIONS.md` ("How to record a
   decision") and `STATE.md` §6. This list is not updated to say "decided". Remove the row's target date and point
   to the `DECISIONS.md` row instead.
7. **Change control for dates:** when a target date moves, keep the old date struck through with the reason. A
   moved decision may move the Phase 0 exit gate (`T-0-M01-29`).

### A. Business model, scope and launch

| # | D-ID | Decision | Status now | Approver (BP §27.2 / DECISIONS) | Decided by | Named owner | Target date | Evidence needed first | Decide task |
|---|---|---|---|---|---|---|---|---|---|
| 1 | D-048 | First public launch scope | OPEN | Owner | Client | — | — | Q9, Q10 | `T-0-M01-07` |
| 2 | D-220 | Phase allocation of modules | OPEN | Owner | Client | — | — | `T-0-M01-07`; Q10, Q27 | `T-0-M01-08` |
| 3 | D-211 | Start condition of stage 1A.1 | OPEN | Owner | Client | — | — | none beyond this questionnaire | `T-0-M01-02` |
| 4 | D-006 | Buyer terminology | PROPOSED-DEFAULT | Owner / sales | Client | — | — | Q2 | `T-0-M08-01` |
| 5 | D-007 | Vendor model at launch | PROPOSED-DEFAULT | Owner / finance | Client | — | — | Q7 | `T-0-M14-02` |
| 6 | D-008 | Seller of record, invoice issuer, warranty and payment ownership per stock unit | OPEN | Owner / finance / legal | Client | — | — | `T-0-M14-02`; Q8, Q22 | `T-0-M19-01` |
| 7 | D-010 | Operational volumes | OPEN | Operations | Client | — | — | `T-0-M25-01`; Q1, Q4, Q5, Q21 | `T-0-M03-01` |
| 8 | D-059 | Jurisdiction & currency | PROPOSED-DEFAULT | Owner | Client | — | — | Q1, Q6 | `T-0-M01-24` |
| 9 | D-037 | Compliance applicability | OPEN | Accountant / legal | Client | — | — | `T-0-M19-01`; Q8, Q38 | `T-0-M19-03` |

### B. Commercial and operating policies

| # | D-ID | Decision | Status now | Approver (BP §27.2 / DECISIONS) | Decided by | Named owner | Target date | Evidence needed first | Decide task |
|---|---|---|---|---|---|---|---|---|---|
| 10 | D-016 | Price display tax convention | OPEN | Finance | Client | — | — | Q35 | `T-0-M05-02` |
| 11 | D-017 | Pricing precedence & promotion stacking | PROPOSED-DEFAULT | Owner / finance | Client | — | — | Q32, Q34 | `T-0-M05-03` |
| 12 | D-018 | Quantity tiers | OPEN | Owner / sales | Client | — | — | Q33; TS-PROOF-03 results (`T-0-M05-01`) | `T-0-M05-04` |
| 13 | D-022 | Return, cancellation, DOA and warranty policies | OPEN | Owner / support | Client | — | — | `T-0-M25-04`; Q46, Q47 | `T-0-M13-02` |
| 14 | D-023 | Refurbished grade rubric | OPEN | Owner / operations | Client | — | — | `T-0-M25-04`; Q3, Q25, Q26 | `T-0-M04-01` |
| 15 | D-024 | Approval thresholds | OPEN | Owner / finance | Client | — | — | `T-0-M17-01`; Q36, Q40, Q52, Q55 | `T-0-M17-07` |
| 16 | D-025 | Delegation | OPEN | Owner | Client | — | — | `T-0-M02-01`; Q51, Q56 | `T-0-M17-08` |
| 17 | D-222 | Role list and mapping of job titles to roles | OPEN | Owner | Client | — | — | `T-0-M01-04`; Q40, Q41, Q47, Q52 | `T-0-M02-01` |
| 18 | D-192 | Approval routing in 1A vs 1B | OPEN | Owner / technical lead | Joint | — | — | `T-0-M01-07` | `T-0-M17-04` |
| 19 | D-221 | Rules / workflow engine scope | OPEN | Owner / technical lead | Joint | — | — | `T-0-M17-01`; Q53, Q55 | `T-0-M17-05` |
| 20 | D-078 | Automations selected for launch | PROPOSED-DEFAULT | Owner / operations | Client | — | — | `T-0-M17-01`, `T-0-M17-02`; Q48, Q51, Q53–Q55, Q58, Q59 | `T-0-M17-06` |

### C. Existing systems and data

| # | D-ID | Decision | Status now | Approver (BP §27.2 / DECISIONS) | Decided by | Named owner | Target date | Evidence needed first | Decide task |
|---|---|---|---|---|---|---|---|---|---|
| 21 | D-009 | Existing systems: retain, integrate, partially replace or replace, per module | OPEN | Owner / technical lead | Joint | — | — | `T-0-M25-03`, `T-0-M01-06`; Q11–Q15, Q18 | `T-0-M25-05` |
| 22 | D-011 | Accounting authority | PROPOSED-DEFAULT | Finance | Client | — | — | `T-0-M25-03`; Q11, Q38 | `T-0-M19-02` |
| 23 | D-038 | Historical data migration | PROPOSED-DEFAULT | Operations / finance | Client | — | — | `T-0-M25-01`; Q13, Q16, Q19 | `T-0-M25-06` |
| 24 | D-122 | Record deletion policy | OPEN | Owner / technical lead | Joint | — | — | `T-0-M25-01`; Q19 | `T-0-M01-21` |
| 25 | D-136 | Non-production data sourcing and masking | OPEN | Owner / technical lead | Joint | — | — | `T-0-M25-01` | `T-0-M01-25` |

### D. Service levels, support and recovery

| # | D-ID | Decision | Status now | Approver (BP §27.2 / DECISIONS) | Decided by | Named owner | Target date | Evidence needed first | Decide task |
|---|---|---|---|---|---|---|---|---|---|
| 26 | D-034 | Service levels & performance targets | PROPOSED-DEFAULT | Owner / operations | Client | — | — | Q20, Q69 | `T-0-M26-01` |
| 27 | D-035 | Support & maintenance | OPEN | Owner | Client | — | — | `T-0-M26-01`; Q49 | `T-0-M26-02` |
| 28 | D-108 | Backup and restore method | OPEN | Owner / operations / technical lead | Joint | — | — | `T-0-M01-11`, `T-0-M26-01`; Q20, Q69 | `T-0-M26-04` |

### E. User interface

| # | D-ID | Decision | Status now | Approver (BP §27.2 / DECISIONS) | Decided by | Named owner | Target date | Evidence needed first | Decide task |
|---|---|---|---|---|---|---|---|---|---|
| 29 | D-049 | UI sign-off | OPEN | Owner / design | Joint | — | — | `T-0-M09-03`; Q1, Q61, Q62, Q70 | `T-0-M09-04` |
| 30 | D-004 | Staff ERP UI: native ERP screen or custom UI, per screen | OPEN | Owner / design / technical lead | Joint | — | — | `T-0-M01-09`, `T-0-M09-02` | `T-0-M01-26` |
| 31 | D-003 | Storefront framework | PROPOSED-DEFAULT | Technical lead | Implementation team | — | — | `T-0-M01-06` | `T-0-M09-05` |
| 32 | D-101 | Framework for custom staff workspace screens and the vendor portal | OPEN | Technical lead | Implementation team | — | — | `T-0-M01-26`, `T-0-M09-05` | `T-0-M01-27` |

### F. Platform and engineering

| # | D-ID | Decision | Status now | Approver (BP §27.2 / DECISIONS) | Decided by | Named owner | Target date | Evidence needed first | Decide task |
|---|---|---|---|---|---|---|---|---|---|
| 33 | D-001 | Operational core (owns stock, reservations, orders, permissions, integrations) | OPEN | Technical lead / owner | Joint | — | — | `T-0-M01-06`; Q14 | `T-0-M01-09` |
| 34 | D-002 | Backend stack | OPEN (only if D-001 = custom) | Technical lead | Implementation team | — | — | `T-0-M01-09` | `T-0-M01-10` |
| 35 | D-005 | Hosting | OPEN | Owner / operations | Client | — | — | `T-0-M01-06`, `T-0-M25-02`; Q12, Q15 | `T-0-M01-11` |
| 36 | D-109 | Runtime packaging and deployment method | OPEN | Technical lead / operations | Joint | — | — | `T-0-M01-09`, `T-0-M01-11` | `T-0-M01-12` |
| 37 | D-102 | Deployables and hostnames of storefront, workspace and vendor portal | OPEN | Technical lead / owner | Joint | — | — | `T-0-M01-09` | `T-0-M01-13` |
| 38 | D-077 | Environments & release process | OPEN | Technical lead | Implementation team | — | — | `T-0-M01-09` | `T-0-M01-14` |
| 39 | D-107 | Secrets management and TLS certificate tooling | OPEN | Technical lead | Implementation team | — | — | `T-0-M01-11` | `T-0-M01-15` |
| 40 | D-115 | Publication scope of the published site once implementation code is added | OPEN | Owner / technical lead | Joint | — | — | none beyond this questionnaire | `T-0-M01-16` |
| 41 | D-053 | Testing tools/frameworks | OPEN | Technical lead | Implementation team | — | — | `T-0-M01-09`, `T-0-M09-05` | `T-0-M01-17` |
| 42 | D-080 | API conventions | OPEN | Technical lead | Implementation team | — | — | `T-0-M01-09` | `T-0-M01-18` |
| 43 | D-079 | Idempotency key transport | OPEN | Technical lead | Implementation team | — | — | `T-0-M01-18` | `T-0-M01-19` |
| 44 | D-104 | Money representation and rounding | OPEN | Technical lead / finance | Joint | — | — | `T-0-M01-09`, `T-0-M05-02` | `T-0-M01-20` |
| 45 | D-123 | Identifier strategy and non-fiscal document numbering | OPEN | Owner / technical lead | Joint | — | — | `T-0-M01-09` | `T-0-M01-22` |
| 46 | D-124 | Timestamp storage and business-day timezone | OPEN | Owner / technical lead | Joint | — | — | Q1, Q6 | `T-0-M01-23` |
| 47 | D-052 | Observability tooling | OPEN | Technical lead | Implementation team | — | — | `T-0-M01-09`, `T-0-M01-11` | `T-0-M26-03` |


## Other open decisions this questionnaire informs (no Stage 0 decide task)
These decisions are not Phase 0 gate items. Most are decided in the stage that builds the feature, some when their
owners are ready (providers: `12-phases.md` §6.1). The questionnaire answers are their first evidence, so an owner
may still be named at the meeting. No target date is required here.

| Area | Decisions | Questions |
|---|---|---|
| Providers and delivery | D-012 payment, D-013 courier, D-014 WhatsApp, D-015 email/SMS/OTP, D-162 delivery options and charges | Q6, Q39, Q43, Q50 |
| Storefront features at launch | D-021 guest checkout, D-041 reviews, D-042 wishlist/comparison, D-121 quotations and bulk order entry, D-223 storefront on phones in Phase 1 | Q10, Q63, Q64 |
| Pricing and dealers | D-019 credit terms, D-020 COD, D-043 promotions, D-044 location-based pricing, D-066 business-account member roles, D-067 dealer verification | Q31, Q32, Q34, Q37 |
| Stock and sourcing | D-026 reservation expiry and late payment, D-028 supplier freshness, D-029 fulfilment location and split shipments, D-030 branch offline selling, D-031 serial reservation, D-069 cycle counts, D-073 selling supplier-held stock, D-081 catalog publication authority, D-126 batch/expiry tracking, D-128 consignment stock | Q21–Q30, Q42, Q44, Q45 |
| Catalog content | D-057 content and image sources and rights, D-167 digital goods | Q3, Q17, Q30 |
| Service and exceptions | D-063 owner digest, D-074 support operations, D-138 exception severity and escalation, D-185 vendor deadlines, D-194 automation governance, D-195 alert catalogue, D-198 exception ownership | Q48, Q49, Q56, Q57, Q60 |
| Finance | D-036 data retention, D-055 document numbering, D-193 automation value inputs, D-196 separation of duties | Q19, Q38, Q40, Q54, Q59 |
| Devices, languages, access | D-050 languages, D-051 accessibility scope, D-110 scanning devices, D-206 supported browsers, D-207 load-test workload | Q5, Q44, Q63, Q65 |
| Later phases (listed only) | D-046 marketplace, D-085 mobile app, D-086 AI | Q7, Q66, Q67, Q68 |
