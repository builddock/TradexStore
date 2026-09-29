# Next-meeting pack — discovery and scope review

| Field | Value |
|---|---|
| Task | `T-0-M01-03` (location per `D-210`) |
| Sources | BP §31.1 agenda items 1–8; BP §1.4 pre-quotation questions; PR1 §5 (discovery activities and deliverables), PR1 §16 steps 1–4 |
| Prepared | 2026-09-29 |
| Meeting date | **Not scheduled.** The first meeting's "next-day discussion had no final time; schedule this agenda separately rather than treating it as an existing appointment" (BP §31.1, §2.2) |
| Shareable | Yes — this pack may be sent to the client representatives as it stands |
| Companion files | `questionnaire.md` (Q1–Q70) · `decision-owners.md` · `vision-backlog.md` · `release-scope.md` · `change-register.md` |

## Purpose
This meeting is PR1 §16 step 2, "a structured requirements workshop with the owner and key operational users". It
confirms the business model and gathers what is needed to finish discovery. It also agrees who decides each
open question, and by when, and what discovery and the platform proof must deliver before implementation is
quoted (BP §31.1 item 8, §25.1). **It does not set a price, a delivery date or a technology.** The first meeting
agreed to scope before budget and timeline (BP §25.1, MEET).

## Participants (by role, BP §22.4)
Roles may be combined in a small team.

| Side | Role | Main agenda items |
|---|---|---|
| Client | Business owner / product sponsor: priorities, commercial policies, final scope | all |
| Client | Operations representative: current processes and workflow acceptance | 2, 3, 6 |
| Client | Finance representative: invoices, payments, refunds, tax, reconciliation | 1, 2, 6, 7 |
| Implementation | Product / business analyst: requirements, decision log, notes | all |
| Implementation | Technical lead | 4, 6, 8 |
| Implementation | UI/UX designer | 5 |

## Ground rules
1. **No fixed price or timeline at this meeting.** A fixed quote now would conceal uncertainty about legacy
   integration, marketplace trading, accounting, WhatsApp depth, data quality and team capacity (BP §25.1).
2. **Figures from the first meeting are not commitments.** "5–6" and "10" have no confirmed amount or currency.
   The ₹5,000 calling cost, the ₹12,000–₹20,000 "per card" and the ₹80,000 total have unclear scope and stay out of
   estimates until written vendor details clarify them (BP §2.2).
3. **Prototype values are samples.** Prices, product names, day counts, ₹ limits and product names of third-party
   tools shown in the prototype illustrate the screens. They are not requirements.
4. **Three separate lists.** Everything the business may eventually need goes to the vision backlog. Only
   approved, finite workflows with acceptance criteria make up the release scope. Requests after approval go to the
   change register (BP §2.3).
5. **An answer is evidence, not a decision.** A decision is made by its approver and recorded with the approver
   and the date. Nothing said in the meeting is treated as decided unless the approver says so.
6. **No credentials or personal data in the notes.** Passwords and access keys are never written into meeting
   notes, these files or the repository (BP §19.1). Examples are shared with unnecessary personal information
   redacted (BP §26.10).

## Before the meeting
| # | Preparation | Who | Source |
|---|---|---|---|
| P1 | Agree the meeting date and participants | Owner + analyst | BP §31.1 |
| P2 | Send `questionnaire.md` with the invitation, so figures (orders per day, SKUs, branches, units) can be gathered beforehand. Any question not answered by the meeting gets an owner and a due date under item 7 | Analyst | BP §26.1–26.7 |
| P3 | Ask the client to bring **one real purchase receipt, one website order, one WhatsApp order and one return**, redacted, for item 2 | Analyst → operations | BP §31.1 item 2, §26.10 |
| P4 | Ask the client to bring a list of current systems, their suppliers and the accounts they sit in (names only, no credentials), for item 6 | Analyst → owner | BP §21.1, §26.8 |
| P5 | Have the clickable prototype v0.1 ready (overview page `index.html`: 13 storefront, 15 staff workspace and 4 vendor-portal screens) | Designer | BP §6.7 steps 3–4 |
| P6 | Print or share `decision-owners.md` for item 7 and `release-scope.md` (proposed baseline v0) for item 4 | Analyst | BP §31.1 items 4, 7 |

---

## Agenda

### 1. Confirm consumer/dealer terminology and the supplier-versus-marketplace model
- **Why:** the words used for buyers set prices, screens and permissions. The vendor model sets invoicing, money
  flow and liability. BP §27.1: "Decide seller of record before architecture approval".
- **Questions:** Q2, Q7, Q8, Q22, Q31.
- **Decisions tabled** (proposals are shown as proposals, not as decided):

  | Decision | What is documented | Approver |
  |---|---|---|
  | D-006 Buyer terminology | Proposal: *consumer* (B2C) and *approved dealer* (B2B). "If the client means something different by 'retail users', rename the segments before implementation" (BP §3.1) | Owner / sales |
  | D-007 Vendor model at launch | Three models: supplier/reseller; company sale with supplier fulfilment; marketplace (BP §3.2). Proposal: "company-controlled sales with suppliers submitting information for review; direct supplier fulfilment only for a small pilot …; a full marketplace as a separately approved extension". If direct marketplace selling is needed on day one, the marketplace work package is included and re-estimated (BP §3.2) | Owner / finance |
  | D-008 Seller of record, invoice issuer, warranty and payment ownership per stock unit | No documented proposal. Follows D-007 | Owner / finance / legal |
- **Output:** the Q2/Q7/Q8/Q22/Q31 answers in `questionnaire.md`. If the approvers decide at the meeting, record the
  decisions per `DECISIONS.md`. Otherwise record owners and dates under item 7.

### 2. Walk through one real purchase receipt, one website order, one WhatsApp order and one return
- **Why:** "For each manual process, ask a staff member to perform a real example while explaining their
  decisions" (BP §12.1). A real example shows where time, rework and owner involvement actually occur.
- **Materials:** the four redacted examples (P3).
- **Questions:** Q23, Q24 and Q44 (receipt, inspection, serials); Q41, Q42, Q43 and Q45 (orders and dispatch); Q50
  (WhatsApp); Q46 and Q47 (returns).
- **Capture for each example:** input, system, time, exceptions, rework and owner involvement (BP §12.1).
- **Output:** notes that feed the current-state process maps (`T-0-M01-04`), the sample-document collection
  (`T-0-M25-04`) and the manual-work observation (`T-0-M17-01`). No decision is expected.

### 3. Identify the owner's five most frequent interruptions and agree candidate delegation rules
- **Why:** reducing owner intervention is a confirmed direction (R10). New software must not keep every routine
  event waiting for the owner (BP §27.1 "Owner approves every routine event").
- **Questions:** Q51–Q57.
- **Candidate rules only.** Thresholds, delegation and automation choices are decided after observation, not in
  this meeting: D-024 approval thresholds ("exact monetary thresholds must be supplied by the client", BP §18.1),
  D-025 delegation and D-078 automations for launch. Their evidence comes from `T-0-M17-01`.
- **Output:** the five interruptions and candidate rules in `questionnaire.md` (Q51, Q55, Q56). Owners and dates
  for D-024, D-025 and D-078 go under item 7.

### 4. Review the proposed 1A/1B scope and any true launch blockers
- **Why:** a finite scope with acceptance criteria is the base for the estimate (BP §2.3, §25.2).
- **Materials:** `release-scope.md`, the proposed baseline v0 from BP §5.1–§5.3. It covers 1A core web launch,
  1B operational completion, the conditional items and the explicit first-release exclusions.
- **Questions:** Q9, Q10, Q64; Q63 for phones.
- **Decisions tabled:**

  | Decision | What is documented | Approver |
  |---|---|---|
  | D-048 First public launch: 1A only, or 1A + 1B combined | "If the client requires vendor self-service and WhatsApp ordering at the first public launch, combine the gates and budget for them. A click-to-chat button alone is not complete WhatsApp ordering" (BP §5.1) | Owner |
  | D-220 Phase allocation of modules | PR1 §12 places the vendor platform, purchasing/warehouses/transfers/RMA and WhatsApp/automation in later phases than BP §5.1 and PR2 §11 do. PR1 itself says final phase boundaries are confirmed after discovery | Owner |
  | D-223 / D-226 Phone and tablet layouts in Phase 1 | BP places dedicated mobile-friendly work in Phase 2 (BP §5.1, §5.3). The prototype already shows responsive layouts, so confirm whether they are Phase 1 scope | Owner / operations |
  | D-041, D-042, D-121 Reviews, wishlist/comparison, quotations and bulk order entry | Conditional in BP §5.2 ("do not block reliable checkout") | Owner |
- **Output:** review comments on `release-scope.md` (v0 stays *proposed* until the BP §31.2 "Launch scope and
  exclusions" sign-off). New ideas go to `vision-backlog.md`.

### 5. Review reference UI screens and agree the first prototype tasks
- **Why:** "Ask the client which reference screens they like and why. Record those preferences as design
  requirements. A generic statement such as 'make it exactly like Amazon' cannot serve as an acceptance test"
  (BP §1.3).
- **Materials:** the client's reference screens; prototype v0.1 (P5). The prototype already covers BP §6.7
  steps 3–4: layouts for home, listing, product detail, dealer pricing, checkout and order tracking, and one visual
  direction for the storefront and the staff workspace.
- **Questions:** Q61–Q65, Q48 (the support questions that shape the customer tasks).
- **Agree:** the tasks and participants for the prototype user tests (BP §6.7 steps 5–6, `T-0-M09-02`). Test with
  actual consumer, dealer and staff users. "A small initial set such as five participants per materially different
  group is a discovery starting point, not statistical proof" (BP §6.7). Record task completion, confusion, wrong
  clicks and time.
- **Not decided here:** UI sign-off (D-049) follows the tests and the revision (BP §6.7 step 7).
- **Output:** reference screens with reasons (feeds `T-0-M09-01`) and the agreed test tasks and participant groups.

### 6. Identify existing modules, access, data exports and provider accounts
- **Why:** "Inspect the existing backend. Retain it if it can reliably own stock, reservations, order transitions,
  permissions, and integrations at an acceptable maintenance cost" (BP §1.2 step 1). This needs access and
  evidence (BP §21.1).
- **Materials:** the list of current systems and accounts (P4).
- **Walk the module list** of the BP §26.8 assessment form: inventory · billing/POS · website · accounting ·
  WhatsApp/support · purchasing. For each: system and version, users, what works, pain point.
- **Access to request** (read-only access or supervised demonstration, BP §21.1): website, ERP/backend, hosting,
  source repository, database schema or export, API documentation, integrations, logs, backups, billing and domain
  configuration. Confirm the client's rights to source code and data export.
- **Sample documents to request, redacted** (BP §26.10): product export, supplier file, purchase order, receipt,
  serial/inspection record, price list, dealer application, branch invoice, website order, payment/settlement
  report, shipping label, return/warranty case, stock report, accounting export.
- **Provider accounts:** payment (Q39), courier (Q43), WhatsApp (Q50), email/SMS, accounting (Q38).
- **Questions:** Q11–Q20, Q38, Q39, Q43, Q50.
- **Not decided here:** D-009 (retain, integrate or replace each system) and D-005 (hosting) follow the audit
  evidence. Provider choices (D-012–D-015) are recorded when their owners are ready.
- **Output:** access requests for the system audit (`T-0-M25-02`), the module form (`T-0-M25-03`), the sample
  collection (`T-0-M25-04`) and the data inventory (`T-0-M25-01`).

### 7. Assign decision owners and dates for the unresolved questions
- **Materials:** `decision-owners.md`, 47 decisions grouped as business model and scope · policies · existing
  systems and data · service levels · user interface · platform and engineering. Each row shows the approver, who
  decides (client, implementation team or joint) and the evidence needed first.
- **Do:** confirm or change each owner. Set a target date no earlier than its evidence. Give every unanswered
  questionnaire question an owner and a due date. Name the approvers of the BP §31.2 sign-off items (Q70).
- **Output:** `decision-owners.md` and the *Status* lines of `questionnaire.md` filled in.

### 8. Agree discovery/proof deliverables before quoting implementation
- **Why:** "Complete a requirements form, an existing-module assessment, and a manual-activity observation sheet
  … Produce prototypes … then execute the platform proof scenarios … Then issue a proposal with named modules,
  integrations, limits, phases, exclusions, acceptance tests, recurring costs, and delivery assumptions"
  (BP §31.3).
- **Discovery deliverables** (PR1 §5): Business Requirements Document · Current-State Assessment · Future-State
  Workflows · Module Specification · Role & Permission Matrix · Wireframes / UX Direction · Technical Architecture ·
  Data Migration Plan · Implementation Roadmap · Commercial Estimate.
- **Acceptance evidence per work package** (BP §22.2):

  | Work package | Acceptance evidence |
  |---|---|
  | WP01 Discovery | Approved requirements and open decisions |
  | WP02 Technical audit | Retain/replace recommendation with evidence |
  | WP03 UI/UX | Web client approval and task-test notes |
  | WP04 Platform proof | Critical scenarios pass |
- **Platform proof:** candidates in BP §1.2 order: (1) the existing backend, (2) an ERPNext/Frappe-based core, (3)
  Odoo on the same scenarios, (4) a custom modular backend only if the others fail critical requirements or cost
  more to own. "Choose one operational core." The ten BP §15.3 scenarios apply, together with the implementation
  team's own engineering and performance checks. A critical failure, such as being unable to prevent overselling,
  overrides a high weighted score (BP §15.3).
- **Sign-off worksheet** (BP §31.2), completed by the end of discovery: business and vendor model · launch scope
  and exclusions · UI prototype · platform proof and architecture · pricing/approval/returns policies ·
  finance/accounting boundary · migration and historical access · service levels and support · costed work
  packages and schedule · UAT and launch.
- **Output:** the agreed deliverable list with owners. The commercial estimate follows the proof and decisions
  (`T-0-M01-28`); it is not produced at this meeting.

---

## The eight questions to settle before a fixed quotation (BP §1.4)
| # | Question (BP §1.4, verbatim) | Agenda item | Questionnaire | Decisions |
|---|---|---|---|---|
| 1 | Are “retail users” ordinary consumers or approved shops/dealers buying for resale? | 1 | Q2 | D-006 |
| 2 | Does the company sell all goods in its own name, or do external sellers sell to customers? | 1 | Q7 | D-007, D-046 |
| 3 | Who owns each stock unit, issues the customer invoice, handles warranty, and receives payment? | 1 | Q8, Q22 | D-008, D-128 |
| 4 | Is existing software retained, integrated, partially replaced, or fully replaced? | 6 | Q11–Q18 | D-009 |
| 5 | How many branches, warehouses, legal entities, users, products, serialised units, and daily orders exist? | 6 (figures via the questionnaire) | Q1, Q4, Q5, Q21 | D-010 |
| 6 | Which manual activities consume the most time and why? | 2, 3 | Q51, Q54 | D-078 |
| 7 | What must work at launch, and what can follow? | 4 | Q9, Q10, Q64 | D-048, D-220 |
| 8 | Who can approve requirements, accounting treatment, UI, and UAT? | 7 | Q70 | BP §31.2 approvers; `decision-owners.md` |

## After the meeting
1. Record answers, respondent roles and dates in `questionnaire.md`. Unanswered questions keep `open` with an
   owner and a due date.
2. Record owners and target dates in `decision-owners.md`.
3. Add new ideas to `vision-backlog.md`. Record scope comments against v0 in `release-scope.md`; it stays
   *proposed* until signed off.
4. Only decisions an approver actually made go into `plan/DECISIONS.md` and `plan/STATE.md` §6.
5. Send the client a short summary: answers recorded, owners and dates agreed, the next deliverables.
6. Work that can start on the answers: process maps (`T-0-M01-04`), data inventory (`T-0-M25-01`), system audit
   (`T-0-M25-02`), sample documents (`T-0-M25-04`), manual-work observation (`T-0-M17-01`), UI inputs (`T-0-M09-01`),
   and the decision briefs whose tasks depend only on this questionnaire: D-006, D-007, D-016, D-017, D-018,
   D-034, D-048, D-059, D-124.
