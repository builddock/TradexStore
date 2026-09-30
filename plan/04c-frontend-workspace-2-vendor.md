# 04c — Frontend plan: ERP workspace part 2 (P-E09–P-E15, P-E17–P-E18) and vendor portal (P-V01–P-V04)

**Purpose.** Screen-level implementation plan for the ERP staff workspace screens P-E09 Purchasing & receiving,
P-E10 Customers & dealers, P-E11 Vendors & submissions, P-E12 Payments & reconciliation, P-E13 Reports, P-E14
Automation & exceptions, P-E15 Settings, roles & audit, and for the vendor portal application
(`frontend/vendor-portal/`): vendor shell and screens P-V01–P-V04. Future sessions implement each tab, drawer and
modal from this file by its section number, using the API IDs of `06-api.md`, business rules of `05-backend.md` and
entities of `03-database.md`.

**Not in this file.** The ERP workspace shell (sidebar, location switcher, global search, "New" menu,
notifications, user menu, system-health card) and the shared workspace patterns (page header + KPI strip, tab bar
with URL hash, data table, filters, bulk bar, drawers, modals, toasts, empty/loading/error states, export button,
approval-decision pattern, masked-field reveal) are specified in **`04b-frontend-workspace-1.md`** together with
P-E01–P-E08: workspace application structure §1, cross-cutting rules §1.4, shared patterns §2.1–§2.18 (page head,
filter bar, KPI strip, data table, bulk bar, pager, tabs, drawer, modal, exception row, states, state pills, callout,
timeline/audit, diff view, scan box, masked value + reveal, charts), data-visualisation rules §2.19, action patterns
§2.20 (approval decision, export button, toast, masked-field reveal, assignee picker, reason-coded form) and the
workspace shell §3. This file only records what is specific to P-E09–P-E15 and references 04b for the rest ("04b
pattern" below means those sections). The vendor
shell is specified here (§9.2) because it belongs to the vendor-portal application.

**Sources used.** BP §2.1, §3.1–3.3, §5.1–5.3, §6.7, §7.3–7.4, §8.3, §9.2–9.7, §10.1–10.6, §11.1–11.5, §12.1–12.6,
§13.3, §14.1–14.4, §15.2–15.6, §16.3–16.4, §17.3–17.6, §18.1–18.2, §19.1–19.3, §20.1–20.5, §22.2, §23.1, §24.1, §25.5,
§26.6, §29.3, §29.7, §30.1 · PR1 §4, §7, §10, §11 · PR2 §2, §5, §7, §9 · MEET · mockup pages `erp-purchasing.html`,
`erp-customers.html`, `erp-vendors.html`, `erp-finance.html`, `erp-reports.html`, `erp-automation.html`,
`erp-admin.html`, `vendor-dashboard.html`, `vendor-products.html`, `vendor-availability.html`, `vendor-account.html`
and `assets/tradex.js` (VENDOR_NAV, `buildWorkspaceShell`) · plan files `00-conventions.md`, `DECISIONS.md`,
`01-tech-stack.md`, `02-architecture.md`, `03-database.md`, `05-backend.md`, `06-api.md`.

**Labels and status.** Evidence labels and status values are those of `00-conventions.md` §2–§3. Every item is
`NOT_STARTED` unless an OPEN decision blocks it, in which case it is `REQUIRES_DECISION (D-xxx)`. All P-E screens
are additionally gated by **D-004** (native ERP screen vs custom UI, per screen) and **D-101** (framework); the
vendor portal by **D-101**, **D-102** and **D-048** (whether 1B ships at first launch). These gates are stated once
per screen and not repeated per tab.

---

## 0. How to read this file

§22 (P-E17 Team & activity, `erp-team.html`) and §23 (P-E18 Analytics, `erp-analytics.html`) were added on
2026-09-30 for the client feedback `CF1 §2` and `CF1 §3` (`docs/CLIENT_FEEDBACK_2026-09-30.md`; decisions
`D-282`–`D-286`). They use the structure of §0.1; each also names the capability that governs every section
(`21-feature-map.md` §4).

### 0.1 Per-screen structure
Each screen section has: **(a) summary card** — purpose, evidence, route, module/folder, phase & requirement IDs,
D-004 considerations (P-E only, not a decision), roles, status; **(b) page header** — title, header actions, KPI
strip; **(c) one sub-section per tab** (mockup `data-tab` id), and one per drawer/modal (mockup element id);
**(d) screen permissions**; **(e) CONDITIONAL / MOCKUP-ONLY / LATER items**.

Each tab/drawer/modal uses a property table with these rows (a row is omitted only when it does not apply):

| Row | Content |
|---|---|
| Purpose | What the user achieves; source |
| Evidence | Label(s) per `00-conventions.md` §2 with citation |
| Route | Always `NOT SPECIFIED` (production routes follow D-003/D-004/D-101); mockup file + `#tab` / element id given as reference |
| Sections / components | UI blocks in mockup order; component names are the design-system components listed in `02-architecture.md` §4.5 (implementation D-103) |
| Table | Column list in mockup order |
| Filters · search · pagination | Controls and the API list parameters they map to (`06-api.md` §1.9; paging style D-080) |
| States | loading / empty / error / stale / forbidden — only deltas from the 04b standard state set (04b §2.11) are written out |
| Permissions | R-* roles (`00-conventions.md` §9), record scope (`own`/`org`/`loc`/`assigned`/`all`), separation of duties |
| APIs | `API-M##-##` from `06-api.md` |
| Backend / data | `BR-M##-##` (`05-backend.md`), `E-*` (`03-database.md`) |
| Related | Other screens/tabs |
| Phase · reqs | Phase (BP §5.1), requirement `R##` (BP §2.1), automation `A##` (BP §12.2), tests `T##` (BP §23.1), `WP##` (BP §22.2) |
| Status | `NOT_STARTED` or `REQUIRES_DECISION (D-xxx)` |

Forms use a **field table** (Field · Type · Req · Validation / source) and actions use an **action table**
(Control (mockup label) · API · Result / guard · Evidence). "Req" values: `Y` required, `N` optional, `C` conditional.
Types are UI input types (text, number, money, date, datetime, select, multi-select, radio, checkbox, toggle, file,
textarea, stepper, scan-input, OTP) — server-side types are in `03-database.md`.

### 0.2 Sample values
Mockup values such as ₹ thresholds, percentages, day counts, timers, grade names, courier/bank/accounting product
names, schedules and people are **samples** (00-conventions §1.1). Where a screen shows such a value as a rule, this
file writes "sample → REQUIRES_DECISION (D-xxx)" and the UI must render the value from configuration/API, never a
constant.

### 0.3 Prototype elements that are not product features
The prototype toolbar (View-as, Phase notes, All screens), `data-anno` annotation badges, `index.html` and
`credits.html` are review aids (00-conventions §1.1) and are **not** built. The annotations are nevertheless used
below as evidence of the intended phase/requirement for the block they label (cited as `anno`).

---

## 1. Cross-cutting rules for P-E09–P-E15, P-E17–P-E18 and P-V01–P-V04

Rules X1–X20 apply unchanged to P-E17 Team & activity (§22) and P-E18 Analytics (§23), added 2026-09-30. On P-E17
a staff member without the screen's permission gets 404 rather than a "forbidden" state (§22.13); on P-E18 X19
(cost and margin columns) is applied through `analytics.margin.read` (§23.9).

| # | Rule | Source | Label |
|---|---|---|---|
| X1 | Every screen is a client of the controlled commerce API; no screen reads or writes ERP tables directly. If D-004 selects native ERP screens for a P-E screen, that screen gets no code in `frontend/workspace/`, but every guard listed here still applies through the native operations | BP §16.3, §17.4, §30.1; `06-api.md` §1.1 rule 3 | DOCUMENTED |
| X2 | UI permission hints come from `API-M02-01` (`ui_permissions[]`, `location_scope[]`, vendor scope); controls the caller may not use are hidden or disabled with a reason, but the server re-checks every call. Out-of-scope records return 404 and are shown as "not found", never as "forbidden" with details | BP §19.1, T11; `06-api.md` §1.3 | DOCUMENTED |
| X3 | Money is displayed from API values only (no client arithmetic that could diverge from server totals); tax basis labelled (incl./excl. GST) | BP §8.1, §14.4; D-104, D-016 | DOCUMENTED · REQUIRES_DECISION (D-104) |
| X4 | Every material change action (stock, price, refund, permission, approval, configuration, vendor scope) requires a reason where the API marks it; the reason field is mandatory in the UI before the button enables | BP §17.3, §18.2; `06-api.md` §1.14 | DOCUMENTED |
| X5 | Actions that return `202 APPROVAL_REQUIRED` show "Sent for approval" with the approval request reference and required approver; the record shows the pending approval; nothing is shown as done | BP §12.5, §18.1–18.2; `06-api.md` §1.3 | DOCUMENTED |
| X6 | Initiator ≠ approver: the UI never offers Approve on a request the current user created (the server enforces `SELF_APPROVAL_NOT_ALLOWED`) | BP §18.2; `06-api.md` §4.13 | DOCUMENTED |
| X7 | Idempotent operations (goods receipt posting, bill recording, refund transitions/retries, reconciliation runs, accounting-export retries, availability updates, vendor batch actions, fulfilment evidence) send one idempotency key per user intent and reuse it on retry; double-click never creates a second effect | BP §10.3, §17.5; D-079 | DOCUMENTED · REQUIRES_DECISION (D-079) |
| X8 | Versioned records send `expected_version`; a `409 VERSION_CONFLICT` shows "This record changed — reload" and keeps the user's unsaved input visible | BP §17.3–17.4; D-125 | DOCUMENTED |
| X9 | Personal data and supplier cost/margin columns are masked or omitted unless the role is authorised; reveal of masked PII uses the reason-based, time-limited, audited reveal pattern (04b §2.17, §2.20 #4; `API-M02-31`) | BP §14.4, §18.2, §19.1; D-153 | DOCUMENTED · REQUIRES_DECISION (D-153) |
| X10 | Exports are jobs (`API-M18-03` → `API-M18-04`, `API-M18-05`), never client-side file generation; row limits, expiring links and approvals per D-152; CSV formula injection neutralised server-side | BP §14.4; D-152 | DOCUMENTED · REQUIRES_DECISION (D-152) |
| X11 | Data freshness is shown wherever a value comes from a feed, projection or scheduled job (e.g. "as of", "stale") | BP §14.4, §9.7, A19 | DOCUMENTED |
| X12 | Live update of queues (approvals, exceptions, notifications, vendor tasks) follows D-146 (polling vs push); until decided, screens refresh on focus/navigation and via an explicit refresh control | D-146 | REQUIRES_DECISION (D-146) |
| X13 | Charts always have a table equivalent (mockup "Table" toggle) and non-colour status indicators | BP §6.7 (WCAG 2.2 AA, non-colour status); D-051 | DOCUMENTED |
| X14 | Keyboard-only completion of key flows; labels, focus, error summaries | BP §6.7, T30; D-051 | DOCUMENTED |
| X15 | Staff role labels in the mockup ("Buyer", "Warehouse lead", "Catalog specialist", "Support executive", "Seasonal packer", "Sales associate", "Branch accountant") are job titles, not roles; permissions are expressed as R-* roles; the mapping is D-222. "Buyer roles" below means the roles `06-api.md` lists for buyer operations: R-ops_admin and R-branch_manager where assigned, plus R-owner | MK; D-222 | REQUIRES_DECISION (D-222) |
| X16 | Phase 1 targets desktop/laptop browsers (staff/vendor mobile is not implied by the BP). Since 2026-09-28 the mockup screens also have tablet/phone layouts (`04b` §2.24, page rows included there for P-E09–P-E15 and P-V01–P-V04); whether they are Phase 1 acceptance criteria is D-226 (tasks T-1A.16-M24-07, T-1B.1-M14-17, CONDITIONAL) | BP §5.1, §6.7 step 8, §28.4; D-085; D-226 | DOCUMENTED · tablet/phone REQUIRES_DECISION (D-226) |
| X17 | Vendor-portal specific: every vendor call is scoped to the vendor organisation of the session; no Tradex margins, other vendors' data, cost of other suppliers or full customer data are ever returned or rendered (§9.1) | BP §3.1, §11.2, §19.1, T11 | DOCUMENTED |
| X18 | KPI tiles, scores and summary figures on these screens follow the definitions decided under D-173 (proposed in `04b-frontend-workspace-1.md`); tile values shown in the mockup are samples | 04b §2.3; D-173 | REQUIRES_DECISION (D-173) |
| X19 | Supplier cost, landed cost and margin columns appear only for roles allowed under D-197 (proposed in `10-erp.md`); otherwise the column is omitted, not blanked | BP §3.1, §14.4; D-197 | REQUIRES_DECISION (D-197) |
| X20 | Contextual help per `04b-frontend-workspace-1.md` §2.21: ⓘ explanations, help panel with page guide, glossary and search on P-E09–P-E15 and P-V01–P-V04 (vendor wording addresses the vendor); the guided-workflow elements (§2.21 #6–#9) on P-E09 and P-E12; vendor help never reveals Tradex-internal rules, margins or other vendors' data (X17) | D-224; BP §11.2, §24.2 | DECIDED (D-224) · content REQUIRES_DECISION (D-225) |

---

## 2. P-E09 — Purchasing & receiving (`erp-purchasing.html`)

### 2.0 Summary card

| Property | Value |
|---|---|
| Purpose | Reorder suggestions (A17), purchase orders with value-based approval, goods receipt with serial scanning and per-unit QC, supplier bills with three-way match and duplicate detection, supplier master metrics (BP §9.3, §9.4, §14.1 "Purchasing: Requests/drafts, purchase orders, receipts, variances") |
| Evidence | DOCUMENTED (BP §9.2–9.4, §14.1, §18.1, A03, A17, A25) · MOCKUP (layout, tabs, fields) |
| Route | NOT SPECIFIED — MK `erp-purchasing.html` tabs `#suggestions`, `#orders`, `#new-po`, `#receive`, `#bills`, `#suppliers`; drawer `#d-po`. Shell "New › Purchase order" → `#new-po`; "New › Goods receipt (GRN)" → `#receive` (04b shell) |
| Module / folder | M07 (+ M06 inspections/reorder rules, M17 approvals, M19 export of approved bills) · `frontend/workspace/` only if D-004 = custom |
| Phase · reqs | 1A (BP §5.1 "purchase receipt"; §5.2 "Purchase orders, receipts, basic supplier records" = M) · R08, R06, R10, R14 · A03, A17, A25, A04 (availability refresh on posting) · WP08 · T15, T21 · BP §15.3 proof scenario 1 |
| D-004 native-vs-custom considerations | (1) Purchase order, goods receipt and supplier invoice are standard documents of the operational-core candidates (BP §15.2 "Reuse operational modules"; §9.4 cites ERPNext serial/batch traceability [S05]); fitness is to be shown in proof scenario 1 (BP §15.3). (2) Receiving with serial scan and per-unit QC is a frequent warehouse task (A03 P1) — the BP §30.1 test "custom staff UI only where it materially improves a frequent task" applies most directly to `#receive`. (3) Suggestions, PO list and bills are lower-frequency back-office views where BP §15.6 "platform configuration before custom code" applies. (4) A per-tab split (native documents + custom receiving/scan view) is compatible with `06-api.md` §1.1 rule 3. **Not decided — D-004.** |
| Roles | Buyer roles (R-ops_admin; R-branch_manager where assigned; R-owner) for suggestions/POs; R-warehouse_staff and R-branch_manager (loc) for receiving; R-finance for bills; approvers per PO value (D-024) — see §2.9 |
| Status | REQUIRES_DECISION (D-004, D-101); tab status below |

### 2.1 Page header and KPI strip (MK:erp-purchasing.html top)

| Element | Content | API / source | Label · status |
|---|---|---|---|
| Title | "Purchasing & receiving" | MK | MOCKUP |
| Action "Export" | Export PO register (toast "po-register-….xlsx") | `API-M18-03` dataset `po_register` → `API-M18-04`, `API-M18-05` | DOCUMENTED BP §14.4 · REQUIRES_DECISION (D-152) |
| Action "Receive goods" | Opens `#receive` | — | MOCKUP |
| Action "New purchase order" | Opens `#new-po` | — | MOCKUP |
| KPI "Open POs" | count + value ex-GST | derived from `API-M07-03` (see API gap G-01) | MOCKUP · NOT_STARTED |
| KPI "Awaiting approval" | count + count needing owner | `API-M07-03` status `pending_approval`; approver tier from `API-M07-05` | MOCKUP |
| KPI "Due this week" | count + overdue supplier | `API-M07-03` (`expected_at`) | MOCKUP |
| KPI "Receiving now" | draft GRN + dock | no list endpoint for draft receipts (G-02) | MOCKUP |
| KPI "Bills on hold" | count + duplicates blocked | `API-M07-14` status filter | MOCKUP |
| KPI "Supplier on-time" | % over period, delta | `API-M07-18` (`on_time_pct`); period sample | MOCKUP · BP §14.3 Vendor performance |

KPI period labels ("90 d") are samples. KPI tiles link to the filtered tab. Loading: tile skeletons; error per tile
with retry (04b §2.11).

### 2.2 Tab `#suggestions` — Reorder suggestions (rule A17)

| Property | Value |
|---|---|
| Purpose | Review rule-generated replenishment suggestions and turn selected lines into **draft** POs for buyer approval; nothing is sent to suppliers from here (BP §9.3 "Automatic reorder should first create a suggestion or draft purchase order", §5.3 "autonomous purchasing" excluded) |
| Evidence | DOCUMENTED (BP §9.3, A17 P1) · MOCKUP (anno "1A · A17 Rule drafts, buyer approves (no auto-purchasing)") |
| Route | NOT SPECIFIED — MK `#suggestions` |
| Sections / components | (1) Rule card "Rule A17 · reorder suggestion": run info (last run, next run, triggered count, excluded count), rule text (trigger, suggest formula, rounding to pack/MOQ, exclusions), link "Rule settings"; (2) callout "Human boundary: the rule only drafts…" (static); (3) note "Forecast-based quantities (A30) are a Phase 2 candidate" (LATER, static); (4) toolbar: supplier select, segmented filter, bulk bar; (5) grouped table (group row per supplier: name, ID, city, actual lead time); (6) footer total "Suggested value ₹… ex-GST · would create N draft POs"; (7) excluded-items note |
| Table | ☐ select · Product (thumbnail, title, SKU, condition badge) · ATP · ROP · On order · Avg/day · lead · Cover (days; colour + text) · Suggested qty (stepper, editable, step = pack size) · Unit cost (last PO cost ex-GST) · Line value · Reason (badge: below ROP / stock-out in N d / dealer demand / refurbished lot / refurbished unit) |
| Filters · search · pagination | Supplier select ("All suppliers" + suppliers with suggestions) → `supplier_id`; segmented "All / Stock-out < N days / Refurbished lots" → `filter` (`stockout_lt_days`, `refurb_lots`) — N is a sample (D-070); no text search in MK; all suggestions for the filter on one page (grouped); paging per D-080 if large |
| States | Loading: skeleton rows. Empty: "Nothing to reorder in this view — all SKUs are above their reorder point" (MK). Stale: show rule last-run time; if the last run failed show the A38 incident link (`API-M17-15`). Error: retry |
| Permissions | View/act: buyer roles (X15). Unit cost/line value columns only for roles permitted to see supplier cost (BP §3.1 "Cost/margin access only if assigned", §14.4; D-197) — hidden otherwise |
| APIs | `API-M07-01` (list), `API-M07-02` (create drafts / dismiss), `API-M17-09` (A17 definition & last run for the rule card), `API-M06-30` (per-SKU reorder point/lead time — edited in P-E08#stock) |
| Backend / data | BR-M07-02, BR-M07-13; E-replenishment_suggestion, E-reorder_rule, E-stock_position, E-purchase_order(_line) |
| Related | P-E14 (rule A17 detail — MK "Rule settings" links to `erp-automation.html`), P-E08#stock (ROP), `#new-po` ("Add from suggestions") |
| Phase · reqs | 1A · A17 (P1) · R08, R09 · A30 forecast = LATER (P2) |
| Status | REQUIRES_DECISION (D-070) |

| Control (mockup label) | API | Result / guard | Evidence |
|---|---|---|---|
| Row checkbox / select all | — | Enables bulk bar ("N lines selected") | MOCKUP |
| Suggested qty stepper | (sent with draft creation — G-03) | Recomputes line value from server cost on submit; qty ≥ 0 | MOCKUP ("quantities editable before drafting") |
| "Create draft POs for buyer approval" | `API-M07-02` `action=create_draft_pos` | Returns draft PO ids (one per supplier); toast lists them; "nothing sent to suppliers"; links to `#orders` filtered to Draft | DOCUMENTED BP §9.3 |
| "Dismiss…" | `API-M07-02` `action=dismiss`, `reason` (required), `snooze_until?` | Modal/popover with reason + snooze duration (duration sample → D-070) | MOCKUP |
| "Rule settings" | navigation → P-E14 rule A17 | — | MOCKUP |

### 2.3 Tab `#orders` — Purchase orders

| Property | Value |
|---|---|
| Purpose | Find and act on POs across their lifecycle (BP §9.2 "Purchase order issued — none on physical on-hand"; §14.1) |
| Evidence | DOCUMENTED (BP §9.2, §9.3, §14.1) · MOCKUP (anno "1A · PO state machine") |
| Route | NOT SPECIFIED — MK `#orders`; drawer `#d-po` (deep-linkable in MK via `#d-po`) |
| Sections / components | (1) Pipeline stage cards — Draft · Awaiting approval · Approved · Sent · Partially received · Received · to close — each with count and sub-note (e.g. "needs owner", "unconfirmed", "overdue", "bill on hold"); clicking a stage toggles the status filter; (2) search + supplier select; (3) table; (4) footer "Showing n of N in last 90 days", closed-in-30-days count; pager |
| Table | PO (number, created by — rule or user) · Supplier (name, ID, city) · Lines · Value ex-GST · Status (+ note) · Approval (draft: "Will need: <tier>"; pending: tier + approver; decided: approver) · Expected (late flag) · Received (meter %, received/ordered units) |
| Filters · search · pagination | `q` (PO number, supplier, SKU) → `API-M07-03 q`; supplier → `supplier_id`; stage → `status` (draft, pending_approval, approved, sent, partial, received, closed); pager per D-080 |
| States | Empty per stage: "No purchase orders in this stage — Draft POs are created from suggestions or manually" (MK). Late POs flagged by text "· late" plus colour (X13) |
| Permissions | Buyer roles; R-warehouse_staff read (loc, for receiving); R-finance read; R-owner |
| APIs | `API-M07-03`, `API-M07-05` (drawer) |
| Backend / data | BR-M07-01, BR-M07-10; E-purchase_order, E-purchase_order_line, E-approval_request |
| Related | `#receive`, `#bills`, P-V03#pos (vendor view of the same POs), P-E01 approvals, P-E14#approvals |
| Phase · reqs | 1A · R08, R06 · WP08 |
| Status | NOT_STARTED |

Status display mapping (MK labels → `API-M07-03` status): Draft → `draft`; Awaiting approval → `pending_approval`;
Approved · not sent → `approved`; Sent · awaiting confirmation → `sent` ("awaiting confirmation" only if supplier
confirmation exists — D-131); Partially received → `partial`; Received → `received`; Closed → `closed`.

### 2.4 Drawer `#d-po` — Purchase order detail

| Property | Value |
|---|---|
| Purpose | Full PO view with approval, linked documents and next actions |
| Evidence | DOCUMENTED (BP §9.3) · MOCKUP |
| Sections / components | Head: "Purchase order · created by …", PO number + status pill, supplier name/ID/city/GSTIN, close. Stepper Draft → Approved → Sent → Receiving → Received → Closed. Stat tiles: Value ex-GST; GST (CGST+SGST or IGST by place of supply); Expected; Received n/m. Lines table. Cards "Approval" (required tier, decision/time/reason, terms) and "Linked documents" (receipts, bills, quotation attachment). Callout for partially received POs ("N units still pending — keep as backorder with a new expected date, or cancel the remaining quantity"). Activity timeline (created, approved + threshold, sent via email + vendor portal / confirmation state, GRNs) |
| Table | SKU · Ordered · Received · Pending · Unit cost · Line total |
| States | Loading skeleton; 404 "PO not found" |
| Permissions | As §2.3; cost columns per X9 |
| APIs | `API-M07-05`; actions below |
| Backend / data | BR-M07-01, BR-M07-10, BR-M02-06; E-purchase_order, E-purchase_order_line, E-goods_receipt, E-supplier_bill, E-approval_request, E-attachment |
| Status | NOT_STARTED |

| Control (shown when) | API | Result / guard | Evidence |
|---|---|---|---|
| "Approve" (pending approval; caller is an eligible approver ≠ requester) | `API-M17-03` on the PO's `approval_request_id` (`decision=approve`, `expected_version`) | PO → approved; whether it is then sent automatically or by a separate "Send" is not specified (G-04; D-176) | DOCUMENTED BP §18.2; MK toast "Approved · PO will be sent to supplier" |
| "Reject" (pending approval) | `API-M17-03` `decision=reject`, `reason` (required) | Reason sent to buyer | DOCUMENTED BP §18.2 |
| "Edit draft" (draft) | navigates to `#new-po` with the draft loaded; save via `API-M07-06` | Only drafts editable | MOCKUP |
| "Submit for approval" (draft) | `API-M07-07` `action=submit` | 202 approval request (tier by value, D-024) or approved when within the caller's authority (D-175) | MOCKUP · REQUIRES_DECISION (D-024, D-175) |
| "Remind supplier" (approved/sent/partial) | `API-M07-07` `action=remind_supplier` | Notification via M20/M14 | MOCKUP |
| "Cancel remaining" (sent/partial) | `API-M07-07` `action=cancel_remaining`, `reason` | Only unreceived qty; supplier notified; reorder rule re-evaluates | MOCKUP · BR-M07-03 |
| "Keep as backorder with new expected date" (callout, partial) | no endpoint (G-05) | — | MOCKUP · BP §9.3 "partial receipts and backorders" |
| "Receive goods" (approved/sent/partial) | navigation → `#receive` preselecting the PO | — | MOCKUP |
| "Download PDF" (received/closed) | `API-M07-08` | Approved/sent POs only | MOCKUP |
| "Close PO" (received) | `API-M07-07` `action=close`, `reason` | — | MOCKUP |
| Quotation attachment link | `API-M22-02` | Authorised private file | DOCUMENTED BP §9.3 "attachments", §19.1 |

### 2.5 Tab `#new-po` — New purchase order (draft)

| Property | Value |
|---|---|
| Purpose | Create/edit a draft PO and submit it for value-based approval (BP §9.3; MK anno "1A · R06/R10 Approval by PO value") |
| Evidence | DOCUMENTED (BP §9.3, §18.2) · MOCKUP |
| Route | NOT SPECIFIED — MK `#new-po`; shell "New › Purchase order" |
| Sections / components | Header "New purchase order · draft <number>", autosave indicator ("Autosaved hh:mm · submitting twice returns the same PO"), status pill Draft; header form; supplier info line (GSTIN, state, intra/inter-state tax note, actual lead time 90-day average); Lines table with "Add from suggestions" and "Add line" (SKU search); totals block (subtotal ex-GST, CGST/SGST or IGST, PO total); "Approval required — determined by PO value ex-GST" tier list with approver and alternate, note "Sample thresholds — exact ₹ limits to be confirmed by the client (§18). The creator can't approve their own PO."; callout with the tier this PO needs; "Checks" list; "Attachments" (supplier quotation, specs, price confirmation); footer "Save draft", "Submit for approval" |
| Table | SKU · supplier code · Qty (stepper, min 1) · Unit cost (money input) · Last cost (with % difference warning) · Line total · remove |
| States | Autosave error → banner "Draft not saved — retry"; version conflict X8; submit success toast "submitted · <tier> approval requested · nothing sent to supplier yet" |
| Permissions | Buyer roles create/edit/submit; creator cannot approve (BP §18.2) |
| APIs | `API-M07-04` (create), `API-M07-06` (edit, `expected_version`), `API-M07-07` (`submit`), `API-M07-01` (Add from suggestions), `API-M04-15` or `API-M21-03` (SKU search for "Add line" — G-06), `API-M07-18`, `API-M07-19` (supplier list, GSTIN, lead time), `API-M03-02` (deliver-to locations), `API-M22-01` (attachments) |
| Backend / data | BR-M07-01, BR-M07-09, BR-M07-10, BR-M02-06, BR-M17-14; E-purchase_order, E-purchase_order_line, E-supplier_code_mapping, E-attachment |
| Related | `#suggestions`, `#orders`, P-E14#approvals, P-E15#thresholds |
| Phase · reqs | 1A · R06, R10 · WP08 |
| Status | REQUIRES_DECISION (D-024) |

| Field | Type | Req | Validation / source |
|---|---|---|---|
| Supplier | select | Y | Only active approved suppliers; applicants listed disabled with reason ("not eligible (marketplace applicant)") (MK; `API-M07-04` "supplier active"; BP §11.1) |
| Deliver to | select (location) | Y | Active company location with receiving capability (`API-M03-02`) (MK; BP §9.5) |
| Expected delivery | date | Y | ≥ today; check "Delivery date ≥ lead time" is a warning, not a block (MK) |
| Payment terms | select | Y | Values from supplier terms/reference data; MK list is sample (MK) |
| Freight | select | Y | "Supplier pays (FOR)" / "Tradex pays · landed cost applies" — landed cost only if D-056 enables (CONDITIONAL) |
| Supplier quotation ref. | text | N | Free text (MK) |
| Note to supplier | text | N | Sent with the PO (MK) |
| Lines[].sku | SKU search | Y | SKU mapped to supplier code (`E-supplier_code_mapping`); one line per SKU (MK "Open PO overlap" check warns on duplicates across POs) |
| Lines[].qty | stepper (integer) | Y | ≥ 1; supplier pack/MOQ rounding shown as warning (MK supplier terms "packs of 10") — UoM per D-127 |
| Lines[].unit_cost | money | Y | ≥ 0 (`API-M07-04`); above last cost by more than the sample 1 % → "reason needed" (MK check) — reason field shown on the line; threshold sample → D-024 |
| Attachments | file (multiple) | N | Type/size allow-list (`API-M22-01`; D-112 scanning) (BP §9.3 "attachments") |
| Reason for price increase | text | C | Required when the price check fails (MK "2 lines above last cost — reason needed") |

| Check (MK "Checks") | Source of result | Label |
|---|---|---|
| Supplier active · GSTIN verified | `API-M07-04` `checks[]` | MOCKUP · BP §8.3 (verification, not typed identifier) |
| Price vs last PO | `checks[]` (threshold D-024) | MOCKUP |
| Open PO overlap | `checks[]` | MOCKUP |
| Delivery date ≥ lead time | `checks[]` | MOCKUP |
| Budget ("purchase budget n % used") | none | MOCKUP-ONLY — no purchase budget in any document → REQUIRES_DECISION (D-177) |

| Control | API | Result / guard | Evidence |
|---|---|---|---|
| "Add from suggestions" | `API-M07-01` `supplier_id` | Adds this supplier's open suggestions as lines | MOCKUP |
| "Add line" | SKU search (G-06) | Adds line with last cost | MOCKUP |
| Remove line | local; persisted by save | — | MOCKUP |
| "Save draft" / autosave | `API-M07-04` first time, then `API-M07-06` | Draft saved; version returned | MOCKUP |
| "Submit for approval" | `API-M07-07` `action=submit` | 202 `APPROVAL_REQUIRED` (approval request shown) or approved within authority (D-175); "submitting twice returns the same PO" → idempotency on submit (G-07) | MOCKUP · BP §17.5 |

Approval tier display: tiers, approver names and alternates are read from `API-M17-18` (thresholds by control
`purchase_order`) and `API-M17-20` (alternates) — values TBC by client (D-024, D-025).

### 2.6 Tab `#receive` — Goods receipt (GRN)

| Property | Value |
|---|---|
| Purpose | Receive a delivery against a PO: count, scan serials, record per-unit QC, handle variances, post the receipt so that only accepted units become sellable (BP §9.2 receipt/inspection events, §9.3, §9.4; A03) |
| Evidence | DOCUMENTED (BP §9.2–9.4, §17.4 "Receive goods", A03, T15) · MOCKUP (anno "1A · A03 Scan receipt & serials against PO", "1A · T15 Wrong serial → discrepancy, not stock", "1A · Partial, over, short & substitution", "1A · §9.3 QC pass → sellable · fail → quarantine") |
| Route | NOT SPECIFIED — MK `#receive`; shell "New › Goods receipt (GRN)" |
| Sections / components | (1) Receipt header: GRN number, PO reference, supplier, delivery challan no., supplier invoice no., location + dock, vehicle no., started time and user; PO selector (POs in sent/partial state); (2) stepper 1 Match PO · 2 Count & scan serials · 3 QC per unit · 4 Post receipt; (3) scan box "Scan barcode or serial, then Enter" + "Add", counter "n of m serials for <SKU>"; (4) scan log (newest first; result icon + text + time); (5) exception callout "N exceptions on this delivery — none can become sellable stock" with list; (6) Landed cost card; (7) Lines table with note "Quantities are posted only after QC · nothing reaches the website until units are sellable"; (8) QC-per-unit table for the selected serialised SKU with filter All/Failed, "Showing n of m", "Mark remaining as pass"; (9) post panel "Ready to post <GRN> · N units held" with effects text; "Save draft", "Post <GRN>" |
| Table — lines | SKU · Ordered · Before (previously received) · Receiving now (stepper) · Serials (scanned/expected or "not serialised") · Variance (Short n / Matched / Over +n / Fully received earlier / Substitution) · Handling (select) |
| Table — QC per unit | Unit (internal unit ID assigned at receipt) · Manufacturer serial (masked) · checklist columns (MK: Seal, Physical, Speed test — category checklist D-023) · Outcome (select: Pass → Sellable / Fail → Quarantine / Pending) · Resolution (fail reason + select: Return to supplier (RTV) / Replacement / Credit note) |
| Filters | QC filter All (n) / Failed (n) (client-side on `API-M07-10` `qc_units`) |
| States | Scan result states: matched, duplicate serial (held + discrepancy case), not on PO (set aside, discrepancy), over-receipt (held), substitution (held for buyer); each rejected scan shows a toast and a log line (MK). Posting blocked while any line has unresolved handling (`422 UNRESOLVED_LINES`). Posting result summary (sellable / quarantined / held counts, "availability refresh queued"). Error on posting → nothing posted ("posting failures roll back entirely", 05-backend §5.7) |
| Permissions | R-warehouse_staff and R-branch_manager assigned to the receiving location (`loc`); buyer roles read; vendors never record company receipts (BR-M07-11, BP §18.1). Substitution / over-receipt acceptance needs buyer approval (BP §9.3) |
| APIs | `API-M07-09` (start receipt), `API-M07-10` (GRN detail), `API-M07-12` (scan), `API-M07-11` (quantities, handling, QC outcomes, landed cost, `expected_version`), `API-M06-09` (inspection records, checklist version), `API-M07-13` (post, Idem), `API-M02-31` (reveal manufacturer serial, D-153), `API-M07-03` (PO selector) |
| Backend / data | BR-M07-03, BR-M07-04, BR-M07-05, BR-M07-08, BR-M07-11, BR-M07-12; E-goods_receipt, E-goods_receipt_line, E-serial_unit, E-serial_event, E-inspection, E-stock_movement, E-exception_case, E-supplier_rma, E-idempotency_record |
| Related | P-E08#serials (unit record), P-E04 (quarantine), P-E14#exceptions (discrepancy cases), P-V03#pos (ASN, D-131) |
| Phase · reqs | 1A · A03 (P1), A04 · R08, R19 · T15, T21 · WP08 · proof scenario 1 |
| Status | REQUIRES_DECISION (D-023 checklists, D-110 scanning devices, D-056 landed cost) |

| Field | Type | Req | Validation / source |
|---|---|---|---|
| PO | select | Y | Approved/sent, not closed (`§4.6` of 06-api) |
| Supplier reference (delivery challan / supplier invoice no.) | text | Y | `supplier_reference` (BP §9.2 "Receipt and supplier reference") |
| Vehicle no., dock | text | N | MOCKUP (not in `API-M07-09`; G-08) |
| Scan input | scan-input (keyboard wedge assumed) | — | Enter submits to `API-M07-12`; device D-110 |
| Receiving now (per line) | stepper | Y | ≥ 0; > pending triggers over-receipt handling |
| Handling (per line with variance) | select | C | Required when variance ≠ 0; options by variance type (MK): short → "Backorder n (new ETA)", "Cancel remaining n", "Wait — more cartons"; over → "Hold extra for buyer approval", "Return extra to supplier", "Accept +n (needs PO amendment)"; substitution → "Hold · ask buyer to approve", "Reject · return to supplier". `API-M07-11` enum covers only accept/short/over_hold/substitution_request (G-09) |
| QC outcome (per unit) | select | Y before posting | Pass / Fail / Pending; Pending blocks posting of that unit |
| QC checklist values | checkbox / measured value | Y per checklist | Checklist version per category (D-023) |
| Fail reason | text | C | Required on Fail |
| Supplier resolution (failed unit) | select | C | RTV / Replacement / Credit note → creates E-supplier_rma draft on posting (BR-M07-04) |
| Landed-cost charges and basis | money list + segmented (value / quantity / weight) | C | Only if D-056 enables; "never changes retail price" (MK) |

| Control | API | Result / guard | Evidence |
|---|---|---|---|
| "Add" / Enter in scan box | `API-M07-12` | `matched` / `duplicate_serial` / `not_on_po` / `over_qty` (+ substitution) — log entry; duplicates create a discrepancy, never stock | DOCUMENTED BP §9.4, T15 |
| Masked manufacturer serial "reveal" | `API-M02-31` | Time-limited, reason required | MOCKUP · D-153 |
| "Mark remaining as pass" | `API-M07-11` (`qc_units[]` outcome pass for all pending units shown) | Bulk; each unit keeps its own inspection record | MOCKUP |
| Landed cost basis buttons | `API-M07-11` `landed_cost.method` | Shows per-unit effect | CONDITIONAL (D-056) |
| "Save draft" | `API-M07-11` | Draft saved | MOCKUP |
| "Post <GRN>" | `API-M07-13` (Idem, `expected_version`, `confirm_variances=true`) | Confirmation dialog listing effects (sellable / quarantine / held, A04 refresh, bill matchable); result summary toast | DOCUMENTED BP §9.2, §17.4 |

### 2.7 Tab `#bills` — Supplier bills & three-way match

| Property | Value |
|---|---|
| Purpose | Record supplier bills, see PO ↔ GRN ↔ invoice match, resolve variances and suspected duplicates; only matched bills become payable/exportable (BP §9.3 flow "Match invoice to receipt and order → variance beyond tolerance? → finance or buyer review → approved payable workflow"; A25) |
| Evidence | DOCUMENTED (BP §9.3, A25, A26) · MOCKUP (anno "1A · 3-way match PO ↔ GRN ↔ invoice", "1A · A25 Duplicate invoice detection") |
| Route | NOT SPECIFIED — MK `#bills` |
| Sections / components | (1) Summary tiles: Matched & approved (period) count + value; On hold · variance (count + types); Duplicate suspected (blocked from payment); Tolerance (sample: "±2 % or ₹500 per line; quantity must match exactly; tax must match") → rendered from configuration (D-024); (2) Bills table with "Record bill"; (3) three-way match detail card for the selected bill; (4) duplicate-blocked comparison card for a suspected duplicate |
| Table — bills | Bill · Supplier invoice · Supplier · PO · GRN · Amount incl. GST · Match (PO / GRN / INV indicators with text) · Status (price variance, duplicate suspected · blocked, qty mismatch, awaiting goods receipt, matched · approved for payment, paid) · Due |
| Table — 3-way detail | Line · PO qty × price · GRN qty · Invoice qty × price · Variance · Result; totals rows Taxable value, GST (rate match) |
| Table — duplicate comparison | Field · new bill · posted bill · Same? (supplier, invoice no. (normalised), date, amount, status incl. payment reference) + footnote on normalisation and near matches |
| Filters · search · pagination | Status filter (`matched`, `variance`, `duplicate_hold`), supplier, due-before → `API-M07-14`; pager per D-080 |
| States | Empty "No bills" ; bill without GRN shows "Awaiting goods receipt" (not an error) |
| Permissions | R-finance (record, act); buyer roles (review "send to buyer"); approver per threshold for "approve with variance" (D-024); R-owner |
| APIs | `API-M07-14`, `API-M07-15`, `API-M07-16`, `API-M07-17`, `API-M22-01` (bill attachment), `API-M19-06` (export status of approved bills) |
| Backend / data | BR-M07-06, BR-M07-07, BR-M07-09, BR-M19-03; E-supplier_bill, E-supplier_bill_line, E-exception_case, E-approval_request, E-accounting_export |
| Related | P-E12#export (accounting export), `#orders` drawer (linked bills) |
| Phase · reqs | 1A · A25 (P1), A26 (P1/C) · WP15 · A31 OCR = LATER (P2) |
| Status | REQUIRES_DECISION (D-024 tolerance, D-011 export) |

| Field ("Record bill" form — not drawn in MK; fields per `API-M07-15`) | Type | Req | Validation / source |
|---|---|---|---|
| Supplier | select | Y | Active supplier |
| Supplier invoice no. | text | Y | Duplicate detection on supplier + normalised number (A25) → bill created **on hold** with `409 DUPLICATE_SUSPECTED` |
| Invoice date | date | Y | — |
| Lines (PO line, SKU, qty, unit cost, tax) | table | Y | Reference PO/GRN lines; totals consistent (05-backend §5.7) |
| Totals | money | Y | — |
| Bill attachment | file | Y | `API-M22-01` (D-112) |

| Control | API | Result / guard | Evidence |
|---|---|---|---|
| "Record bill" | `API-M07-15` (Idem) | Opens the form; MK toast "OCR extraction is a Phase 2 candidate (A31); enter manually" | DOCUMENTED A25; A31 LATER |
| Row click | `API-M07-16` | Opens 3-way detail | DOCUMENTED |
| "Send to buyer" | `API-M07-17` `send_to_buyer`, reason | Buyer notified with PO price evidence | DOCUMENTED BP §9.3 "buyer review" |
| "Request credit note" | `API-M07-17` `request_credit_note`, `amount` | Supplier notified | MOCKUP |
| "Approve with reason…" | `API-M07-17` `approve_with_variance`, reason (required) | 200 or 202 approval by threshold; approved bill exported once (A26) | DOCUMENTED BP §9.3 · D-024 |
| "Not a duplicate…" | `API-M07-17` `not_duplicate`, reason (required) | "reason & approver required" (MK) → approval per SoD | DOCUMENTED A25 "Staff reviews near matches" |
| "Reject as duplicate" | `API-M07-17` `reject_duplicate`, reason | Supplier notified | DOCUMENTED A25 |

Sample values on this tab: tolerance, 12-month duplicate window, near-match rule ("same amount ±1 %"), assignment
and due dates → REQUIRES_DECISION (D-024 for tolerance; D-178 for duplicate-detection parameters). "Paid" status with
bank reference is shown only when payment data comes back from the accounting authority (D-011).

### 2.8 Tab `#suppliers` — Suppliers

| Property | Value |
|---|---|
| Purpose | Supplier master overview with measured lead time, on-time, fill rate, QC failures, terms and score (BP §14.1 master data "suppliers"; §14.3 "Vendor performance: Freshness, fill rate, dispatch, returns") |
| Evidence | DOCUMENTED (BP §14.1, §14.3) · MOCKUP (anno "1A · Actual lead times feed reorder points") |
| Route | NOT SPECIFIED — MK `#suppliers` |
| Sections / components | Note "Lead time used by the reorder rule is the 90-day actual, not the quoted figure"; "Vendor onboarding" link (→ P-E11); suppliers table; footnote "Scores combine on-time, fill rate, QC failures and invoice accuracy · vendors see only their own scorecard in the vendor portal"; chart "Actual lead time · last 90 days" (horizontal bars; "Table" toggle, X13); supplier terms card for the selected supplier (account manager + masked contact, payment terms, bank account masked "verified (maker-checker)", categories, MOQ/packs, returns (RTV) terms, feed methods) |
| Table | Supplier (name, ID, model, city) · GSTIN · Status (Active / Pilot / Applied + "Not eligible for POs") · Lead time quoted · actual · On-time · Fill rate · QC fail · Terms · Open POs · Score (meter + number) · row action ("New PO" → `#new-po` preselected; "Review" → P-E11#applications for applicants) |
| Filters · search | `q`, `status` → `API-M07-18` |
| Permissions | Buyer roles, R-finance, R-ops_admin, R-owner; terms/bank masked or hidden unless permitted (X9; BP §18.1 payout account) |
| APIs | `API-M07-18`, `API-M07-19` |
| Backend / data | BR-M07-13, BR-M14-09; E-supplier, E-purchase_order, E-goods_receipt, E-vendor_approval |
| Related | P-E11#vendors, P-V01 scorecard, P-E08#supplier |
| Phase · reqs | 1A · R14 · A17 input |
| Status | REQUIRES_DECISION (D-187 score definition; D-070 lead-time basis) |

No edit control exists in the mockup for supplier terms; supplier records are created/linked when a vendor is
approved (E-vendor_application.supplier_id) — maintenance of commercial terms is listed as gap G-10.

### 2.9 Screen permissions (P-E09)

| Capability | R-warehouse_staff | R-branch_manager | R-ops_admin | R-finance | R-owner | Others | Source |
|---|---|---|---|---|---|---|---|
| View suggestions / create draft POs | — | where assigned as buyer | Yes | — | Yes | — | BP §9.3; `06-api.md` API-M07-01, API-M07-02 |
| Create / edit / submit PO | — | where assigned | Yes | — | Yes | — | API-M07-04, API-M07-06, API-M07-07 |
| Approve PO | — | per threshold (D-024) | per threshold | — | per threshold | never the creator | BP §18.2; D-024; D-175 |
| Record / post goods receipt | assigned location | Yes (loc) | read | read | Yes | vendor: never | BP §18.1 "Record matching receipt" |
| Record bills / resolve variances | — | — | review | Yes | Yes | buyer review | BP §9.3 |
| View supplier cost columns | — | if permitted | if permitted | Yes | Yes | R-catalog_staff only if assigned | BP §3.1, §14.4 |

### 2.10 CONDITIONAL / MOCKUP-ONLY / LATER items (P-E09)

| Item | Label | Decision |
|---|---|---|
| Landed-cost allocation card and "Tradex pays · landed cost applies" freight option | CONDITIONAL (BP §9.3 "if imported goods require it") | D-056 |
| OCR bill extraction (A31) | LATER (P2) | — |
| Forecast-based quantities (A30) | LATER (P2) | — |
| Purchase budget check | MOCKUP-ONLY | D-177 |
| Supplier confirmation state "Sent · awaiting confirmation" and confirmation timeline | MOCKUP-ONLY | D-131 |
| Vehicle number / dock fields on GRN | MOCKUP | G-08 |
| Supplier score formula | MOCKUP | D-187 |

---
## 3. P-E10 — Customers & dealers (`erp-customers.html`)

### 3.0 Summary card

| Property | Value |
|---|---|
| Purpose | Staff view of consumers and business (dealer) accounts: customer 360, business-account administration (members, price list, suspension), dealer application review, duplicate handling, consent overview and data-rights requests (BP §3.1, §8.3, §13.3–13.4, §19.3; PR1 §4 "Customer Management") |
| Evidence | DOCUMENTED (BP §8.3, §13.3, §13.4, §19.3, §18.1, A27) · MOCKUP (layout) · MOCKUP-ONLY (tags, consented bulk message, merge) |
| Route | NOT SPECIFIED — MK `erp-customers.html` tabs `#all`, `#business`, `#applications`, `#duplicates`, `#privacy`; drawer `#d-360` (customer 360, deep-linkable); modals `#m-suspend`, `#m-merge`, `#m-invite` |
| Module / folder | M08 (+ M02 invitations/reveal, M05 price lists, M17 approvals, M18 exports, M20 messages) · `frontend/workspace/` if D-004 = custom |
| Phase · reqs | 1A (BP §5.2 "Dealer approval, price list, quantity tiers" = M) · R03, R06 · A27 (P1) · T02, T10, T22, T23, T25 · WP07 |
| D-004 native-vs-custom considerations | (1) Customer master records exist natively in the operational-core candidates (BP §14.1 "Master data: … customers"). (2) Dealer approval needs a verification checklist with stored GSTIN-check evidence, reason capture and price-list assignment (BP §8.3 "a typed identifier alone is not verification"; A27) — functions not implied by a plain customer form. (3) Business-account members/roles and consent history are custom concepts in this plan (E-business_account_member, E-consent_record). (4) BP §30.1 lists no "Customers" workspace — customer views are reached from Orders/Support/Returns; the frequency argument of BP §30.1 is therefore weaker than for P-E02/P-E05. **Not decided — D-004.** |
| Roles | R-sales_support, R-branch_manager, R-ops_admin, R-owner, R-finance (read) — detail §3.9 |
| Status | REQUIRES_DECISION (D-004, D-101); tab status below |

### 3.1 Page header and KPI strip

| Element | Content | API / source | Label · status |
|---|---|---|---|
| Title | "Customers & dealers" | MK | MOCKUP |
| "Export" menu → "Customer list (masked)" | Masked export job; link expiry sample | `API-M18-03` dataset `customers_masked` | DOCUMENTED BP §14.4, §18.1 · REQUIRES_DECISION (D-152) |
| "Export" → "Full contact details (needs approval)" | Creates an approval request instead of a file ("Request sent to Owner") | `API-M18-03` dataset `customers_full` → 202 `APPROVAL_REQUIRED` | DOCUMENTED BP §18.1 "Export customer data: … governed permission" · D-152 |
| "Export" → "Dealer accounts & price lists" | Business-account summary export | `API-M18-03` (dataset for business accounts — not in the dataset list, G-13) | MOCKUP |
| "Review duplicates" | Opens `#duplicates` | — | MOCKUP |
| "Invite business account" | Opens `#m-invite` | — | MOCKUP |
| KPIs | Consumers (+30 d); Active · 90 d (repeat rate); Business accounts (approved · suspended · invited; anno "1A · R03 Approved dealers only"); Applications (oldest, SLA); Dealer share (net, 30 d); Duplicates (eligible to merge) | no summary endpoint (G-11) | MOCKUP · NOT_STARTED |

SLA and period values on KPI tiles are samples (D-179 for review SLA).

### 3.2 Tab `#all` — All customers

| Property | Value |
|---|---|
| Purpose | Find any consumer or business customer and open the right detail view |
| Evidence | DOCUMENTED (BP §14.1 master data customers) · MOCKUP |
| Route | NOT SPECIFIED — MK `#all` |
| Sections / components | Search; segmented type filter (All / Consumers / Business); filter chips (Open return / support, WhatsApp opt-in, Needs attention); bulk bar (Add tag, Export (masked), Send consented message); table; "n shown" counter; pager |
| Table | ☐ · Customer (avatar, name, ID or contact + city) · Type (consumer segment badge, or price-list badge / "Applicant" for business) · Orders · Net lifetime value · Last order (date + order no.) · Open items (badges: support ticket, return, quote, privacy request, application) · Consent (three indicators: order updates, email marketing, WhatsApp marketing — each with text tooltip, X13) · Status (Active, Deletion requested, Suspended, Possible duplicate, Applicant …) |
| Filters · search · pagination | `q` (name, business, city, order no.) → `API-M08-28 q`; `type` (consumer, business); `flags` (open_return_support, whatsapp_opt_in, needs_attention); pager per D-080 |
| States | Empty: "No customers match these filters — Clear a filter or search by order number" (MK). PII masked by default (X9) |
| Permissions | R-sales_support, R-branch_manager, R-ops_admin, R-owner, R-finance (API-M08-28); bulk message R-ops_admin/R-owner; tags R-sales_support+ |
| APIs | `API-M08-28`, `API-M08-31` (tags), `API-M08-32` (consented message), `API-M18-03` (`customers_masked`) |
| Backend / data | BR-M08-06, BR-M08-12; E-customer, E-customer_segment, E-business_account, E-consent_record, E-customer_tag (MOCKUP-ONLY) |
| Related | `#d-360`, `#business`, `#applications`, P-E02, P-E04, P-E05 |
| Phase · reqs | 1A · R03 |
| Status | NOT_STARTED (tags / bulk message: REQUIRES_DECISION (D-145)) |

| Control | API | Result / guard | Evidence |
|---|---|---|---|
| Row click — consumer | `API-M08-29` | Opens `#d-360` | MOCKUP |
| Row click — business account | — | Opens `#business` with the account selected | MOCKUP |
| Row click — applicant | — | Opens `#applications` with the application selected | MOCKUP |
| "Add tag" (bulk) | `API-M08-31` | MOCKUP-ONLY | D-145 |
| "Export (masked)" (bulk) | `API-M18-03` `customers_masked` with selected ids | Export job | D-152 |
| "Send consented message" (bulk) | `API-M08-32` (template, purpose) | Only customers with consent for the purpose/channel; excluded count returned and shown (MK "2 excluded"); T25 | MOCKUP-ONLY · D-145, D-058 |

### 3.3 Drawer `#d-360` — Customer 360

| Property | Value |
|---|---|
| Purpose | One view of a consumer's orders, returns, conversations, consent and profile (MK "Customer 360") |
| Evidence | MOCKUP (MK:erp-customers.html `#d-360`); consent DOCUMENTED (BP §13.3); deletion notice DOCUMENTED (BP §19.3) |
| Route | NOT SPECIFIED — MK `#d-360` |
| Sections / components | Head: avatar, name, segment badge, status, ID, customer since, city, masked email and phone + "Reveal" (reason, time-limited; X9). Callouts: deletion requested (marketing stopped; profile removal after retention review; statutory records kept); possible duplicate (link "Review" → `#duplicates`). Mini KPIs (anno "lifetime value is net of returns, excl. GST"): Lifetime value (net), Orders, Avg. order, Returns, Conversations. Sub-tabs `c-orders`, `c-returns`, `c-support`, `c-consent`, `c-profile`. Footer actions |
| Sub-tab `c-orders` | Table: Order (no., date) · Item · Total · Order (state) · Payment (state) · Fulfilment (state); note "Order, payment and fulfilment are separate states" (BP §10.1); row → P-E02 order |
| Sub-tab `c-returns` | List: RMA no., item + issue, status line, status pill; empty "No returns" |
| Sub-tab `c-support` | List: ticket/conversation no., subject, channel + verification ("verified by OTP") + agent + time, status; empty "No conversations" |
| Sub-tab `c-consent` | Table: Purpose · Channel · Status (Opted in / Off / Not given / Opted out / Not asked) · Captured (date + source) · Evidence (notice version, double opt-in, message reference); note "Consent changes are append-only; the most recent record wins. Transactional messages don't need marketing consent but respect opt-outs where required." (BP §13.3; BR-M08-06) |
| Sub-tab `c-profile` | Addresses, preferred branch, buyer type ("Consumer · public prices incl. GST" — D-016), tags (MOCKUP-ONLY D-145), risk flags ("COD eligible" — D-020), account manager; textarea "Internal note (staff only) — never shown to the customer" |
| States | Loading per sub-tab; sections omitted when the role may not see them (`API-M08-29` "sections limited by role") |
| Permissions | As §3.2; reveal needs reveal permission (D-153); internal notes R-sales_support+ |
| APIs | `API-M08-29` (`sections[]`), `API-M02-31` (reveal), `API-M08-30` (note), `API-M08-45` `open_for_customer` ("Data request"), `API-M13-03` via P-E04 ("Start return"), `API-M10-18` via P-E02 ("Assisted order"), `API-M20-04` (message delivery status, optional) |
| Backend / data | BR-M02-17, BR-M08-06, BR-M08-07, BR-M08-09; E-customer, E-address, E-consent_record, E-sales_order, E-return_request, E-support_conversation, E-data_request, E-internal_note (MOCKUP-ONLY) |
| Related | P-E02, P-E04, P-E05, `#privacy` |
| Status | NOT_STARTED (internal note: REQUIRES_DECISION (D-134); reveal: REQUIRES_DECISION (D-153)) |

| Control | API | Result / guard | Evidence |
|---|---|---|---|
| "Reveal" (email/phone) | `API-M02-31` (reason_code, reason_text) | Value visible until `visible_until`; audit entry (MK "Reveal logged · reason … · visible for 5 min" — duration sample) | MOCKUP · D-153 |
| Save internal note | `API-M08-30` | Staff-only | MOCKUP-ONLY · D-134 |
| "Data request" | `API-M08-45` `action=open_for_customer`, `customer_id` | Opens a request in `#privacy` | DOCUMENTED BP §19.3 |
| "Start return" | navigation → P-E04 (new RMA for this customer) | — | MOCKUP |
| "Assisted order" | navigation → P-E02 `#assisted` with customer preselected | — | MOCKUP |

### 3.4 Tab `#business` — Business accounts

| Property | Value |
|---|---|
| Purpose | Administer approved dealer accounts: status, price list, terms, members, history (BP §8.3; §6.3 dealer account states) |
| Evidence | DOCUMENTED (BP §8.3, §6.3, §18.1 "Change dealer tier") · MOCKUP (anno "Suspension: prices hidden, new orders blocked, history kept", "§8.3 Default prepaid; credit is separate finance scope", "§8.3 Who can order, who sees invoices") |
| Route | NOT SPECIFIED — MK `#business` |
| Sections / components | Split view. **List:** search "Search business accounts", account items (initials, name, price list, city, status pill), applicant items (→ `#applications`), "N more accounts — use search". **Detail:** header (name, price-list badge, Approved/Suspended badge, legal name, approved date, account manager) with actions; suspended banner (date, by, reason, effects, reinstatement condition); mini KPIs (Orders, Net sales, Avg. order, Last order, Returns); panel "Business & tax" (GSTIN + verification status with source/date, PAN, address, place of supply); panel "Commercial terms" (price list + version + pending version, tiers, payment terms "Prepaid — credit not enabled" with lock, COD "Not offered on dealer orders"); "Members & roles" (note "Only the account owner can invite members", "Invite member"); members table; panel "Credit terms" (disabled toggle + explanation); panel "Account history" timeline |
| Table — members | Member · Role · Orders (can order) · Invoices & GST (can see) · Invite (can invite) · Last sign-in · Status (Active; "Active · read-only" while suspended; invitation expiry) |
| Filters · search | `q`, `status`, `price_list` → `API-M08-33` |
| States | Suspended account: detail rendered in suspended style, invite disabled, members read-only |
| Permissions | View R-sales_support+, R-finance; suspend R-branch_manager, R-ops_admin, R-owner; reinstatement needs approval; price-list change: R-sales_support request, R-branch_manager within delegated policy, R-ops_admin/R-owner (BP §18.1); invite member on behalf: R-sales_support+ (logged) |
| APIs | `API-M08-33`, `API-M08-24`, `API-M08-25`, `API-M08-26` (on behalf), `API-M02-18` (resend invitation), `API-M08-35` (suspend / request_reinstatement), `API-M08-36` (price list / terms change), `API-M08-37` (view as dealer, D-149), `API-M08-23` (GSTIN re-check before reinstatement), `API-M05-10` (price-list names/versions, via P-E07) |
| Backend / data | BR-M08-01, BR-M08-03, BR-M08-04, BR-M08-05, BR-M02-13; E-business_account, E-business_account_member, E-price_list, E-approval_request, E-invitation |
| Related | P-E07 (price lists, tiers), P-S11 (dealer zone the members use), `#applications` |
| Phase · reqs | 1A · R03, R04 · T02, T10, T22 |
| Status | REQUIRES_DECISION (D-066 member roles, D-019 credit terms, D-149 view as dealer) |

| Control | API | Result / guard | Evidence |
|---|---|---|---|
| "Suspend" | opens `#m-suspend` | — | DOCUMENTED BP §6.3 |
| "Request reinstatement" (suspended) | `API-M08-35` `action=request_reinstatement` | "GSTIN re-check required first" → `API-M08-23`; approval (202) | MOCKUP |
| "Change price list" | `API-M08-36` (price_list_id, payment_terms?, reason) | 202 approval request (MK "needs Operations admin approval") | DOCUMENTED BP §18.1 |
| "View as dealer" | `API-M08-37` | Read-only preview; no impersonation unless D-149 decides otherwise; audited | MOCKUP · D-149 |
| "Invite member" | `API-M08-26` (email_or_mobile, role, order_limit?) | Sent on behalf of the account owner, logged; disabled when suspended | DOCUMENTED BP §8.3 · D-066 |
| Credit-terms toggle | none (disabled) | Shown disabled while D-019 = prepaid | PROPOSED-DEFAULT (D-019) |

### 3.5 Modal `#m-suspend` — Suspend business account

| Field | Type | Req | Validation / source |
|---|---|---|---|
| Reason | select | Y | Error "Choose a reason — it is shown to approvers and kept in the audit log" (MK); list values samples (GSTIN cancelled/inactive, suspected dealer-price misuse, chargeback/payment dispute, account owner request) → D-139 |
| Note to account owner | textarea | N | Sent to the account owner (`note_to_owner`) |

Static text: "Suspension hides dealer prices and blocks new orders. Open orders continue under their confirmed terms;
invoices and history stay accessible to authorised members." (BR-M08-05). "Suspend account" → `API-M08-35`
`action=suspend`; effect immediate, owner notified (MK toast). Permissions R-branch_manager, R-ops_admin, R-owner.
Status: NOT_STARTED.

### 3.6 Modal `#m-invite` — Invite a business account

| Field | Type | Req | Validation / source |
|---|---|---|---|
| Business name | text | Y | — (MK) |
| Contact email | email | Y | Email format |
| Suggested price list | select | Y | Lists needing higher authority are marked "(needs manager approval)" — approval happens at decision time (`API-M08-34`) |
| City | text | N | — |

Static text: "The business completes the same application (GSTIN check, documents). An invitation never creates an
approved account on its own." (BP §8.3; BR-M08-01). "Send invitation" → `API-M08-34` → 201 with `expires_at`
(MK "valid for 7 days" is a sample; token lifetime → D-083). Permissions R-sales_support, R-branch_manager,
R-ops_admin. Status: NOT_STARTED.

### 3.7 Tab `#applications` — Dealer applications

| Property | Value |
|---|---|
| Purpose | Verify dealer applications, decide with a reason and assign a price list (BP §8.3 flow; A27 "No automatic business approval on unchecked documents") |
| Evidence | DOCUMENTED (BP §8.3, A27) · MOCKUP (anno "1A · R03 Dealer approval: verify, decide with reason, assign price list") |
| Route | NOT SPECIFIED — MK `#applications` |
| Sections / components | Split view. **Queue** "oldest first · SLA n working days" (sample → D-179): items with name, city, age, status pill (Ready for review, GSTIN name mismatch, Awaiting applicant); "Recently decided" list (name, outcome, date, reason summary). **Detail:** header (name, status, applicant, submitted, reviewer, due / "paused (awaiting applicant)"), badge "A27 · completeness auto-checked · approval is never automatic"; "Application" key-values (legal name, constitution, GSTIN, PAN, address, business, expected volume, categories of interest); "Decision" form; "Verification checklist" with "Re-run GSTIN check" and per-item document buttons; note "A typed GSTIN alone is not verification — the check stores the portal response, time and reference" |
| Checklist items (MK) | GSTIN verified via registration check (result, legal-name match, state, reference, time; "View response") · Registered address matches registration record · GST registration certificate (Open) · Trade / shop licence (Open) · Contact verified (OTP) · Duplicate check (GSTIN, PAN, phone) · Authorisation letter (when applicant ≠ proprietor) · Bank proof ("Not required — prepaid account") — the required set is D-067 |
| Filters | `status` → `API-M08-38` |
| States | Approve disabled with message "Approve is disabled until every required check passes"; reason error "A reason is mandatory for approve, reject and request-info decisions"; after decision the queue item shows the outcome (Approved / Rejected / Info requested — "SLA paused") |
| Permissions | View R-sales_support, R-branch_manager, R-ops_admin, R-finance; decide: approver per policy (R-branch_manager, R-ops_admin, R-owner — D-067); price lists above the approver's authority require the higher approver (MK "Dealer Gold (needs manager approval)"); initiator ≠ approver where feasible |
| APIs | `API-M08-38`, `API-M08-39`, `API-M08-40`, `API-M08-23` (re-run check), `API-M22-02` (document viewer — watermarked, access logged) |
| Backend / data | BR-M08-01, BR-M08-02, BR-M08-04; E-dealer_application, E-business_account, E-business_account_member, E-invitation, E-attachment, E-audit_event |
| Related | P-S12#dealer (applicant form), P-S11 (approved dealer zone), `#business` |
| Phase · reqs | 1A · R03 · A27 (P1) · T02, T10 |
| Status | REQUIRES_DECISION (D-067) |

| Field (Decision form) | Type | Req | Validation / source |
|---|---|---|---|
| Assign price list | select | C (approve) | Price lists from P-E07; options needing higher authority flagged (MK) |
| Payment terms | read-only text "Prepaid only" + hint "Credit not enabled in Phase 1" | — | D-019 PROPOSED-DEFAULT prepaid (BR-M08-04) |
| Reason | textarea | Y | Mandatory for approve, reject and request-info; sent to applicant for reject/request-info; always audited (MK; BP §18.2 "Record why") |

| Control | API | Result / guard | Evidence |
|---|---|---|---|
| "Approve" | `API-M08-40` `decision=approve`, `price_list_id`, `payment_terms`, `reason`, `expected_version` | Creates business account + owner invitation atomically (05-backend §5.8); enabled only when required checks pass | DOCUMENTED BP §8.3 · D-067 |
| "Reject" | `API-M08-40` `decision=reject`, reason | Reason emailed to applicant | DOCUMENTED |
| "Request info" | `API-M08-40` `decision=request_info`, reason | Due clock paused (MK "SLA paused") — D-179 | MOCKUP |
| "Re-run GSTIN check" | `API-M08-23` (context dealer_application) | Stores new response/time/reference | DOCUMENTED BP §8.3 |
| "Open" / "View response" | `API-M22-02` / checklist evidence from `API-M08-39` | Watermarked viewer; access logged | DOCUMENTED BP §19.1 |

### 3.8 Tab `#duplicates` — Duplicates (and modal `#m-merge`)

| Property | Value |
|---|---|
| Purpose | Review candidate duplicate customer records with explicit match signals; never merge on name only (BP §13.4 "Never merge customers because names match"; §21.2 "Duplicate and consent review" at migration) |
| Evidence | DOCUMENTED (BP §13.4, §21.2) for review/verification · MOCKUP-ONLY (merge execution, D-133) · MOCKUP (anno "Merge safeguards — never merge on name only") |
| Route | NOT SPECIFIED — MK `#duplicates`; modal `#m-merge` |
| Sections / components | Safeguards callout (≥ 2 strong identifiers; name similarity never qualifies; consumer and business never merged; original IDs kept; merges reversible for a period and audited — period sample); candidates table; "Merge review" panel for the selected pair; footer "Merge is reversible until <date>" + actions |
| Table — candidates | Candidate pair (names, IDs, city) · Match signals (chips: verified phone, same delivery address, name similar, different email …) · Assessment (Eligible · 2 strong identifiers / Needs a 2nd identifier / Blocked · name-only match / Not mergeable · business ↔ consumer) · Action (Review merge / Request verification / Not duplicates / Invite as member) |
| Table — merge review | Field · Record A (survivor) · Record B · After merge — rows: Name (radio), Email (radio primary; other kept secondary), Phone, Addresses (deduplicated), Orders & invoices (re-linked; original IDs and invoices unchanged), Consent ("most restrictive / latest wins"), Support & returns (re-linked), Wishlist & cart (union); plus Record B after merge (closed as merged, sign-in redirected, kept for undo), Customer notice (email to both), Separation of duties (suggested by automation, executed by a person, audited) |
| Permissions | Review/request verification/not duplicates: R-sales_support, R-ops_admin; merge: R-ops_admin (`API-M08-43`; MK "executed by Support lead" is a job title — D-222) |
| APIs | `API-M08-41`, `API-M08-42` (not_duplicates, request_verification, invite_as_member), `API-M08-43` (merge) |
| Backend / data | BR-M08-08; E-customer, E-consent_record, E-address, E-audit_event; merge record (E-customer_merge, MOCKUP-ONLY per 00-conventions §7.1, D-133) |
| Related | `#d-360` (duplicate callout), P-E05 (verification), migration M25 |
| Phase · reqs | 1A (review) · merge per D-133 |
| Status | Review: NOT_STARTED · Merge: REQUIRES_DECISION (D-133); candidate rules (strong-identifier set, reversible period) REQUIRES_DECISION (D-178, D-133) |

| Control | API | Result / guard | Evidence |
|---|---|---|---|
| "Review merge" | `API-M08-41` detail of pair (selected row) | Shows merge review panel | MOCKUP |
| "Request verification" | `API-M08-42` `request_verification` | Sent to both contacts | DOCUMENTED BP §13.4 (secure verification before linking) |
| "Not duplicates" / "Not the same person" | `API-M08-42` `not_duplicates` | Pair not suggested again | MOCKUP |
| "Invite as member" | `API-M08-42` `invite_as_member`, `account_id` | Personal account stays separate; invitation to join the business account | MOCKUP · D-066 |
| Field choice radios | local; sent as `field_choices` | — | MOCKUP-ONLY |
| "Merge records…" → `#m-merge` "Merge" | `API-M08-43` (source, target, field_choices, reason, verification_evidence) | Modal summary (strong identifiers, records moved, consent result, undo-until date) + mandatory reason; result "reversible until …, audit entry" | MOCKUP-ONLY · D-133 |

### 3.9 Tab `#privacy` — Consent & data requests

| Property | Value |
|---|---|
| Purpose | Consent overview and processing of data-rights requests (deletion, access/copy, correction) that separate profile removal from legally retained records (BP §19.3; §13.3 permission records) |
| Evidence | DOCUMENTED (BP §13.3, §19.2, §19.3) · MOCKUP (anno "§19.3 Deletion keeps statutory invoice/warranty records") |
| Route | NOT SPECIFIED — MK `#privacy` |
| Sections / components | Consent summary tiles (order updates on WhatsApp — % opted in; marketing email %; marketing WhatsApp %; opt-outs in period incl. "STOP" replies) — G-12; "Data requests" table with note "Deletion separates profile removal from legally retained transaction records"; compliance callout "Compliance items (DPDP rules, retention periods, notices) are an implementation checklist for qualified review — retention periods shown are placeholders" |
| Table | Request · Customer · Type (Delete account / Access – copy of data / Correct details) · Received · Due · Retention check (e.g. invoice retained masked for n years; open warranty until date; "Invoice name can't change after issue · credit/re-issue only") · Status (In review / Completed date) · Action (Process / Re-send link) |
| Filters | `type`, `status` → `API-M08-44` |
| Permissions | R-ops_admin, R-owner (privacy role per D-036) |
| APIs | `API-M08-44`, `API-M08-45` (process, resend_link, open_for_customer) |
| Backend / data | BR-M08-06, BR-M08-09, BR-M08-10; E-data_request, E-consent_record, E-customer, E-invoice_reference, E-warranty_case |
| Related | P-S09#privacy (customer side), `#d-360` |
| Phase · reqs | 1A · T25 |
| Status | REQUIRES_DECISION (D-036, D-037, D-060) |

| Control | API | Result / guard | Evidence |
|---|---|---|---|
| "Process" | `API-M08-45` `process` | Profile and marketing data scheduled for deletion; invoice and warranty records retained (masked) | DOCUMENTED BP §19.3 · D-060 |
| "Re-send link" | `API-M08-45` `resend_link` | Secure link re-sent (expiry sample → D-083) | MOCKUP |

Due dates and retention periods are placeholders → D-036/D-037.

### 3.10 Screen permissions (P-E10)

| Capability | R-sales_support | R-branch_manager | R-ops_admin | R-finance | R-owner | Source |
|---|---|---|---|---|---|---|
| View customers / 360 (masked) | Yes | Yes (loc per D-029) | Yes | Yes (finance sections) | Yes | API-M08-28, API-M08-29 |
| Reveal PII | per D-153 | per D-153 | per D-153 | per D-153 | per D-153 | BP §18.2 |
| Export masked list | narrow approved scope | scoped | Yes | finance purpose | Yes | BP §18.1 |
| Export full contact details | — | — | request | request | governed permission / approver | BP §18.1; D-152 |
| Decide dealer application | — | per D-067 | Yes | — | Yes | BP §8.3 |
| Change dealer price list | request | within delegated policy | Yes | review if needed | Yes | BP §18.1 |
| Suspend / reinstate account | — | suspend | suspend | — | approve reinstatement | API-M08-35 |
| Merge customers | — | — | Yes (D-133) | — | Yes | API-M08-43 |
| Data requests | — | — | Yes | — | Yes | BP §19.3; D-036 |

### 3.11 CONDITIONAL / MOCKUP-ONLY / LATER items (P-E10)

| Item | Label | Decision |
|---|---|---|
| Customer tags, "Send consented message" bulk action | MOCKUP-ONLY | D-145 |
| Customer merge execution and field-choice review | MOCKUP-ONLY | D-133 |
| Internal staff note on customer | MOCKUP-ONLY | D-134 |
| "View as dealer" | MOCKUP (mode undecided) | D-149 |
| Credit terms toggle, credit limits/ageing | CONDITIONAL (BP §8.3 "only if explicitly enabled") | D-019 |
| "COD eligible" risk flag | CONDITIONAL | D-020 |
| "Personalised recommendations — Not asked (Phase 1)" consent row | LATER (no recommendation feature in Phase 1; BP §15.6) | — |

---
## 4. P-E11 — Vendors & submissions (`erp-vendors.html`)

### 4.0 Summary card

| Property | Value |
|---|---|
| Purpose | Staff side of vendor management: vendor list and detail, onboarding (invitation or application) with an approval record, review of vendor submissions with diff and sensitive-field flags, supplier availability freshness, vendor performance, and the locked marketplace gate (BP §11.1–11.5; BP §30.1 "Vendors: Applications, profile review, submissions, freshness, performance") |
| Evidence | DOCUMENTED (BP §3.2, §9.7, §11.1–11.3, §30.1, A20, A21) · MOCKUP (anno "Phase 1B · R05 Vendor portal & submissions") · LATER (marketplace tab, BP §11.4–11.5, D-046) |
| Route | NOT SPECIFIED — MK `erp-vendors.html` tabs `#list`, `#applications`, `#submissions`, `#freshness`, `#performance`, `#marketplace`; drawer `#d-vendor` (deep-linkable); modals `#m-vsdec`, `#m-policy`, `#m-invite` |
| Module / folder | M14 (+ M04 review queue, M06 supplier feeds, M17 approvals, M07 supplier record) · `frontend/workspace/` if D-004 = custom |
| Phase · reqs | 1B (BP §5.1 "Controlled vendor portal"; §5.2 "Vendor admin-created accounts and submissions" 1A = C, 1B = M) · R05, R06 · A20, A21 (P1B) · T11, T12, T13, T14 · WP13 · BP §15.3 proof scenarios 6, 9 · MEET ("Vendor registration would be handled by a super admin … approval step before product data enters the live database") |
| D-004 native-vs-custom considerations | (1) The supplier master exists natively in the core candidates; vendor applications, approval records with permitted categories/locations/terms, submission diff review and freshness monitoring are plan-specific concepts (E-vendor_application, E-vendor_approval, E-vendor_submission, E-supplier_availability). (2) BP §15.2 lists "custom B2B/portal work" as a cost driver of the ERPNext option — relevant to how much of this screen is native. (3) Submission review is a recurring reviewer task once 1B is live (BP §11.3 "without bottlenecks"). (4) If D-048 keeps the vendor portal out of the first launch, only admin-created supplier records (1A = C) are needed at launch. **Not decided — D-004.** |
| Roles | R-ops_admin, R-owner (onboarding decisions, suspension, permissions); designated catalog reviewers (R-catalog_staff per D-081) for submissions; buyer roles and R-catalog_staff for freshness; R-finance for tax/payout-sensitive reviews — detail §4.10 |
| Status | REQUIRES_DECISION (D-004, D-101, D-048, D-047, D-081) |

### 4.1 Page header, launch-model callout and KPI strip

| Element | Content | API / source | Label · status |
|---|---|---|---|
| Title | "Vendors" | MK | MOCKUP |
| "Review policy" | Opens `#m-policy` | `API-M14-56` | DOCUMENTED BP §11.3 · REQUIRES_DECISION (D-081) |
| "Invite vendor" | Opens `#m-invite` | `API-M14-47` | DOCUMENTED BP §11.1 · REQUIRES_DECISION (D-047) |
| Launch-model callout | "Customers buy from Tradex. Suppliers provide data and stock; <vendor> runs a supplier-fulfilment pilot with confirmation deadlines. Marketplace selling … is Phase 2 and stays locked" + "Prerequisites" link → `#marketplace` (anno "§3.2 Launch model") | Content, not data; wording depends on D-007 | PROPOSED-DEFAULT (D-007) |
| KPIs | Active vendors (by model; suspended count); Applications (blocked by Phase 2); To review (oldest; SLA — anno "R05 Review queue with SLA"); Auto-accepted (routine stock refreshes today within bounds); Stale feeds (offers in confirm-before-promise); Avg. fill rate (period) | No summary endpoint (G-14); partial sources `API-M14-48`, `API-M04-39`, `API-M06-26`, `API-M14-55` | MOCKUP · SLA sample → D-185 |

### 4.2 Tab `#list` — Vendors

| Property | Value |
|---|---|
| Purpose | Find vendors, see model, status, permitted scope, feed freshness and pending items |
| Evidence | DOCUMENTED (BP §30.1 Vendors; §11.1) · MOCKUP |
| Route | NOT SPECIFIED — MK `#list` |
| Sections / components | Search "Vendor, city, category…"; segmented model filter (All models / Supplier / Supplier fulfilment / Marketplace); table; row → `#d-vendor` |
| Table | Vendor (avatar, name, ID, city) · Model (badge; marketplace shown with lock "Marketplace · Phase 2"; pilot badge) · Status (Active / Pilot / Applicant / Suspended + terms version) · Permitted categories (first two + "+n") · Feed freshness (Fresh / Near deadline / Confirm before promise / Suspended / No feed + last update + deadline) · Offers · Pending (submissions) · Score (meter + number, or "Not rated") |
| Filters · search · pagination | `q`, `model` (supplier, supplier_fulfilment, marketplace), `status` → `API-M14-45`; pager per D-080 |
| States | Empty "No vendors match" (MK) |
| Permissions | R-ops_admin, R-catalog_staff, buyer roles, R-owner (`API-M14-45`) |
| APIs | `API-M14-45` |
| Backend / data | BR-M14-03, BR-M14-04, BR-M14-11; E-supplier, E-vendor_approval, E-supplier_availability |
| Related | P-E09#suppliers (same parties, purchasing view) |
| Phase · reqs | 1B · R05 |
| Status | REQUIRES_DECISION (D-187 score) |

### 4.3 Drawer `#d-vendor` — Vendor detail

| Property | Value |
|---|---|
| Purpose | Vendor record: approval record, what the vendor can see, KPIs, recent activity, actions |
| Evidence | DOCUMENTED (BP §11.1 approval record, suspension; §11.2 data minimisation) · MOCKUP |
| Sections / components | Head (name, model badge, status, ID, city, contact, since). Callouts: suspended ("Live offers withdrawn; the vendor can't submit changes. POs, GRNs, returns and statements remain visible to authorised staff" — BP §11.1), marketplace applicant ("No catalog, stock or order access" — BP §3.1), stale feed. Panel "Approval record" (decision + reviewer, review date, terms version, categories, locations). Panel "Data the vendor can see" (✓ own products, submissions & validation errors; ✓ own POs, GRN results & supplier RMAs; ✓ own availability feed status; pilot only: assigned shipments with minimum customer data; ✗ retail prices, margins, other vendors' costs; ✗ customer identities & full orders). KPI tiles (fill rate, response, return/defect, score). "Recent activity" table (Reference · What · When · Status) |
| States | Loading; 404 |
| Permissions | As §4.2; actions per row below |
| APIs | `API-M14-46`; actions below |
| Backend / data | BR-M14-03, BR-M14-04, BR-M14-06, BR-M14-07; E-supplier, E-vendor_approval, E-vendor_user |
| Status | NOT_STARTED |

The pilot line in "Data the vendor can see" reads "name, phone & address only" in MK:erp-vendors.html but the vendor
portal shows name, city, masked phone and masked PIN (MK:vendor-availability.html#tasks, BP §11.2) — the drawer
must render the field set actually returned by `API-M14-27` (inconsistency I-6; field set REQUIRES_DECISION
(D-007, D-153)).

| Control | API | Result / guard | Evidence |
|---|---|---|---|
| "Message" | `API-M14-53` (text, related_ref?) | Delivered to the vendor portal (and email) | MOCKUP |
| "Edit permissions" | `API-M14-52` (categories[], locations[], reason) | 202 approval request ("drafted · needs approval") | MOCKUP · BP §12.6 |
| "Suspend…" | `API-M14-51` `action=suspend`, reason (required) | Offers withdrawn; submissions blocked; history kept (BP §11.1); detailed effects D-189 | DOCUMENTED |
| "Request reinstatement" (suspended) | `API-M14-51` `action=request_reinstatement` | 202 — owner approval | DOCUMENTED |
| "Close" | — | — | — |

### 4.4 Tab `#applications` — Vendor applications (onboarding decision)

| Property | Value |
|---|---|
| Purpose | Review vendor applicants (public application or invitation) and record an approval decision with reviewer, reasons, permitted categories, permitted locations, terms version and review date (BP §11.1) |
| Evidence | DOCUMENTED (BP §11.1, §3.1 "Vendor applicant: no live catalog or stock write access", PR2 §5 steps 1–3) · MOCKUP (anno "§11.1 Approval records reviewer, reasons, categories, locations, terms version, date") |
| Route | NOT SPECIFIED — MK `#applications` |
| Sections / components | Split view. **List** "Applications · applicant ≠ activated vendor": items (name, city, model applied for, status: Ready for review / Blocked · Phase 2); "Recently decided" (name, outcome, date, scope/reason). **Detail (supplier applicant):** header (status, applied date and route "via public vendor form", contact, location, badge "Vendor applicant · no catalog or stock access"); "Checks" list (GSTIN verified via registration check; bank account verification — D-068; brand authorisation document "Open"; sample price file validation with "Report"; contacts verified by OTP); "Business model" radios; "Decision record" form; actions. **Detail (marketplace applicant):** callout "Marketplace selling isn't enabled … hold the application, or offer the supplier model instead"; key values (GSTIN, categories requested, fulfilment, payout details "not verified (not needed until Phase 2)"); actions Hold until Phase 2 / Offer supplier model / Reject… |
| Filters | `status` → `API-M14-48` |
| States | Reason error "Reasons are required and stored with the decision"; approved → toast summarises model, categories, location, terms version, "portal access sent" |
| Permissions | Decide: R-ops_admin, R-owner (approver per D-047; MEET "super admin"); view reviewers |
| APIs | `API-M14-48`, `API-M14-49`, `API-M14-50`, `API-M22-02` (documents — watermarked, logged), `API-M08-23` (GSTIN check, context vendor_application), `API-M04-25` (category tree for permitted categories), `API-M03-02` (locations), `API-M14-41`-equivalent staff read of terms versions (G-17) |
| Backend / data | BR-M14-01, BR-M14-02, BR-M14-03, BR-M14-08, BR-M14-13; E-vendor_application, E-vendor_approval, E-supplier, E-terms_version, E-invitation, E-attachment |
| Related | P-S12#vendor (public application), P-V04#profile (approval record seen by vendor) |
| Phase · reqs | 1B · R05 · T11 |
| Status | REQUIRES_DECISION (D-047, D-068, D-028, D-007) |

| Field (Decision record) | Type | Req | Validation / source |
|---|---|---|---|
| Business model | radio | Y | Supplier / Supplier fulfilment (pilot) — shows pilot capacity "n of m used" (capacity D-007; G-16) / Marketplace seller — **disabled, locked** (D-046) |
| Permitted categories | multi-select (checkbox list) | Y (approve) | At least one; enforced on every submission (BP §11.1) |
| Permitted delivery locations | multi-select (checkbox list of company locations) | Y (approve) | At least one (BP §11.1 "permitted locations") |
| Terms version | select | Y | Active supplier terms versions (E-terms_version); superseded shown disabled |
| Feed freshness deadline | select | C (vendor provides availability) | Values sample (24/12/6 h) → D-028 |
| Reviewer | read-only | Y | Session user (BP §11.1) |
| Review date | read-only | Y | Today (BP §11.1) |
| Reasons | textarea | Y | Required for every decision; stored with the decision (BP §11.1; §18.2) |

| Control | API | Result / guard | Evidence |
|---|---|---|---|
| "Approve" | `API-M14-50` `decision=approve` + model, categories, locations, terms_version_id, freshness_deadline, reasons, review_date | Supplier record created/linked, vendor admin invited ("portal access sent"); marketplace model rejected by API (D-046) | DOCUMENTED BP §11.1 |
| "Request info" | `API-M14-50` `decision=request_info`, reasons | Applicant notified | DOCUMENTED |
| "Reject" / "Reject…" | `API-M14-50` `decision=reject`, reasons (required) | Reasons sent to applicant | DOCUMENTED |
| "Hold until Phase 2" | `API-M14-50` `decision=hold_phase2` | Applicant informed | LATER-gate (D-046) |
| "Offer supplier model" | `API-M14-50` `decision=offer_supplier_model` | Offer sent (company is seller of record) | MOCKUP · D-007 |
| Document "Open" / "Report" | `API-M22-02` / `validation_report_link` of `API-M14-49` | Watermarked viewer, access logged; validation report download | MOCKUP |

### 4.5 Tab `#submissions` — Vendor submissions review (and modal `#m-vsdec`)

| Property | Value |
|---|---|
| Purpose | Review vendor submissions (new products, sensitive edits, cost updates, availability batches) with validation results, diff against the live version and sensitive-field flags; decide with reason; pending versions never overwrite live until approved (BP §11.3, §7.3; T12, T13) |
| Evidence | DOCUMENTED (BP §11.3, §17.4 "no automatic publication", §29.3, A20, T12, T13) · MOCKUP (anno "1B · R05 Submission review: diff, validation, sensitive flags") |
| Route | NOT SPECIFIED — MK `#submissions`; modal `#m-vsdec` |
| Sections / components | Segmented "Needs review (n) / All"; split view. **List items:** submission no., age, vendor, what (type + summary), status (Sensitive edit / n validation errors / Price outlier held / Auto-accepted / Returned to vendor). **Detail header:** number, status, vendor, summary, submitted age, reviewer; actions Reject / Request changes / Approve (label "Approve outlier" for held price lines; disabled while validation fails, text "Approve stays disabled until validation passes"). **Detail variants:** (a) sensitive edit — callout "Pending version vN — live listing vN-1 is unchanged …; if approved, only units received after approval carry the new terms; existing orders keep their original warranty" (BP §11.3; T33), sensitive-field flags, check counts (passed / warnings / errors), diff grid Field · Live · Submitted with flagged rows, validation warning panel; (b) failed validation — callout "can't be approved yet … vendor sees these errors", error rows (message, hint, field path), diff; (c) cost update with outlier — lines table Product · Current cost · Submitted · Change · Result ("Accepted · cost only" / "Outlier · held") and callout "retail and dealer prices do not change automatically; they appear as cost signals in Pricing"; (d) auto-accepted availability batch — callout "Auto-accepted within validated bounds … no reviewer needed; the run is audited", tiles Rows / Accepted / Rejected rows / "Tradex stock created 0", explanation of rejected rows; (e) returned to vendor — callout + timeline (submitted, validation failed, changes requested, awaiting vendor; "SLA paused while with vendor") |
| Filters · search | `source=vendor`, `sensitive_only`, `auto_accepted_today`, `reviewer` → `API-M04-39`; "All" includes decided items |
| States | Approve note "Approving publishes the new version at the next catalog sync; the decision, reason and diff are kept in the audit log" (publication checks still apply — 05-backend §8 #3) |
| Permissions | Designated reviewers (D-081): catalog reviewers for content; R-finance for tax classification and payout-sensitive fields; buyer roles for price outliers (MK review policy); R-catalog_staff read |
| APIs | `API-M04-39` (queue), `API-M14-54` (review view: diff, validation, sensitive flags, vendor history), `API-M17-03` (decision), `API-M17-02` (approval detail), `API-M06-29` (revert an auto-accepted refresh — also on P-E06#review) |
| Backend / data | BR-M14-05, BR-M14-10, BR-M14-11, BR-M14-12, BR-M04-05, BR-M04-06, BR-M04-07, BR-M04-08, BR-M04-09; E-vendor_submission, E-catalog_change_version, E-supplier_availability, E-approval_request, E-audit_event |
| Related | P-E06#review (same queue, staff drafts included), P-V02#submissions (vendor side), P-E07 (cost signals) |
| Phase · reqs | 1B · R05 · A20 (P1B) · T12, T13, T14, T33 |
| Status | REQUIRES_DECISION (D-081) |

| Field (`#m-vsdec`) | Type | Req | Validation / source |
|---|---|---|---|
| Decision | segmented (Approve / Request changes / Reject) | Y | Preselected from the clicked button |
| Reason / comments to vendor | textarea | Y | "A reason is required" (MK; BP §18.2) — sent to the vendor for request-changes/reject |
| Keep the current live version until the vendor resubmits | checkbox (default on) | N | `keep_live_version_until_resubmit` (BP §11.3 "pending version while last approved remains live unless safety or stock concerns require immediate suspension") |

| Control | API | Result / guard | Evidence |
|---|---|---|---|
| "Submit" (approve) | `API-M17-03` `decision=approve` (or `approve_and_publish` where publish authority is held), `expected_version` = submission version | New version publishes at next sync after publication checks; stale version → 409 | DOCUMENTED BP §17.4 |
| "Submit" (request changes) | `API-M17-03` `decision=request_changes`, `fields_needing_changes[]?`, reason | Returned to vendor; live unchanged | DOCUMENTED BP §29.3 |
| "Submit" (reject) | `API-M17-03` `decision=reject`, reason | Reason sent to vendor | DOCUMENTED |
| "Cancel" | — | — | — |

Sample values on this tab: outlier rule ("> ±15 % vs 30-day median"), auto-accept bounds ("quantity change ≤ 50 %,
known SKU mappings, no sensitive fields"), minimum image size, SLA → review-policy configuration (`API-M14-56`,
`API-M24-01`) under D-186 (bounds, outlier rule) / D-081 (reviewer authority) / D-185 (SLA); never constants.

### 4.6 Tab `#freshness` — Availability feeds

| Property | Value |
|---|---|
| Purpose | Monitor supplier availability feeds against each supplier's freshness deadline; stale feeds switch offers to confirm-before-promise or suspend them; supplier quantity is never company stock (BP §9.7, A21, T14) |
| Evidence | DOCUMENTED (BP §9.7, §11.3, A21 P1B, T14) · MOCKUP (anno "§9.7 Stale feeds switch automatically · never shown as company stock") |
| Route | NOT SPECIFIED — MK `#freshness` |
| Sections / components | State legend cards: Fresh (promises shown normally: supplier lead time + buffer) · Stale → confirm before promise (immediate-delivery promise hidden; checkout message) · Suspended (past n × deadline; offers hidden; vendor and buyer team alerted); feeds table; incident timeline "<vendor> · what happened" (last successful update, deadline passed + reminder, automation A21 action with audit reference, scheduled auto-suspension with open orders needing manual confirmation); "Freshness rules" card (deadline per vendor set at approval; on stale; on n × deadline; routine refresh auto-accept bounds; "A feed never creates Tradex stock — only a GRN does"; escalation) |
| Table | Vendor · feed (name, ID, method: API / portal CSV / SFTP CSV) · Offers · Last update · Age vs deadline (bar with deadline marker + text) · State (Fresh / Near deadline / Confirm before promise / Suspended / Suspended (vendor)) · Last run (OK · n rejected / Timeout ×n) · actions |
| Filters | `state` (fresh, stale, suspended) → `API-M06-26` |
| States | Suspended vendor feed shows "Disabled <date>" with no actions |
| Permissions | View R-ops_admin, R-catalog_staff, R-branch_manager (read), buyer roles; actions R-ops_admin, R-catalog_staff |
| APIs | `API-M06-26`, `API-M06-27` (request_update, suspend_offers, resume), `API-M06-28` (log), `API-M17-15` (A21 runs for the timeline), `API-M24-01` (freshness rules configuration) |
| Backend / data | BR-M14-11, BR-M06-14, BR-M06-15; E-supplier_availability, E-supplier, E-offer, E-job_attempt, E-configuration_version |
| Related | P-E08#supplier (same data from the inventory side), P-V03#availability (vendor side), P-S03 (promise text) |
| Phase · reqs | 1B · A21 (P1B) · R08 · T14 |
| Status | REQUIRES_DECISION (D-028) |

| Control | API | Result / guard | Evidence |
|---|---|---|---|
| "Request" (stale) | `API-M06-27` `request_update`, reason | Vendor notified via portal + email | DOCUMENTED BP §9.7 |
| "Suspend" (stale) | `API-M06-27` `suspend_offers`, reason | Offers suspended now; audited | DOCUMENTED BP §9.7 |
| "Resume" (suspended by staff) | `API-M06-27` `resume` | Only with fresh data | DOCUMENTED |
| "Log" | `API-M06-28` | Feed run log (runs, source, rows, accepted, rejected, result) | MOCKUP |

All thresholds on this tab (deadlines 6–24 h, "3× deadline" suspension, "confirmed within 4 h" checkout text, ±50 %
auto-accept bound, escalation "once then daily digest") are samples → D-028 (freshness), D-186 (auto-accept
bounds), D-185 (vendor escalation timing).

### 4.7 Tab `#performance` — Vendor performance

| Property | Value |
|---|---|
| Purpose | Compare vendor metrics and scores; scores feed vendor priority in suggestions and auto-accept eligibility, never prices (BP §11.2 "Performance: Data quality and response time"; §14.3 "Vendor performance: Freshness, fill rate, dispatch, returns — adjust vendor permissions/priority") |
| Evidence | DOCUMENTED (BP §11.2, §14.3) · MOCKUP |
| Route | NOT SPECIFIED — MK `#performance` |
| Sections / components | Period segmented (30 d / 90 d / 12 m) → `period`; metrics table; definitions footnote (fill rate = PO lines received in full ÷ lines ordered; response time = median time to confirm a PO or availability request; dispatch SLA pilot only; first-pass approval = submissions approved without changes); chart "Performance score" + "Table" toggle (X13); callout "Scores drive vendor priority … They never change prices on their own."; "Score weights (proposed)" text with thresholds for buyer review / switching off auto-accept |
| Table | Vendor · Model · Fill rate · Response time · Dispatch SLA · Return / defect · First-pass approval · Feed on time |
| Permissions | R-ops_admin, buyer roles, R-owner |
| APIs | `API-M14-55` |
| Backend / data | BR-M07-13; E-supplier, E-purchase_order, E-goods_receipt, E-vendor_submission, E-supplier_availability, E-supplier_fulfilment_task |
| Related | P-V01 scorecard (vendor sees only its own — `API-M14-03`), P-E09#suppliers, P-E13 vendor-performance report |
| Phase · reqs | 1B · R05 · WP13 |
| Status | REQUIRES_DECISION (D-187) |

Metric definitions shown in the mockup are consistent with BP §14.3 dimensions but the score weights and the
thresholds that switch auto-accept off or trigger permission review are **proposed** in the mockup → D-187.

### 4.8 Tab `#marketplace` — Marketplace · Phase 2 (locked)

| Property | Value |
|---|---|
| Purpose | Show that marketplace selling is locked until the BP §11.4 prerequisites are decided; preview of the settlement-statement design (BP §11.5) |
| Evidence | LATER (BP §5.1 Phase 2 optional, §11.4, §11.5; anno "Phase 2 · §11.4 Marketplace prerequisites gate") |
| Route | NOT SPECIFIED — MK `#marketplace` |
| Sections / components | Locked callout ("can only be activated once every prerequisite has an approved decision from its owner. Ordinary bank transfers are not automated marketplace settlement" — BP §11.4); disabled "Activate marketplace"; prerequisites list (9 items of BP §11.4 with owner and decision status, "n of 9 decided"); "Settlement statement (preview of Phase 2 design)" table Component · Basis & version · Amount (eligible delivered sales, refunds, commission, tax on commission/TCS, logistics deductions, return reserve, seller payable "maker–checker before payout") |
| APIs | none (G-15) — prerequisite statuses correspond to DECISIONS.md D-046 / D-008 and related decisions |
| Backend / data | M15 (LATER): E-seller_agreement, E-commission_rule, E-seller_settlement, E-payout |
| Permissions | R-owner, R-ops_admin (view) |
| Phase · reqs | 2 (LATER, optional) |
| Status | LATER — not built in Phase 1. If the owner wants the locked notice visible in Phase 1, it is static content with no activation path (05-backend §5.15 "'Activate marketplace' must stay locked") — D-046 |

### 4.9 Modals `#m-policy` and `#m-invite`

**`#m-policy` — Review policy · vendor data** ("Small approval matrix — the owner doesn't approve routine stock
refreshes"; BP §11.3 "Use deterministic rules and a small approval matrix"). Read-only table Change type · Handling
· Reviewer from `API-M14-56`; MK rows (samples: reviewer roles D-081; thresholds D-186): new vendor → explicit
review (categories, locations, terms version) → owner / operations admin; new product → validation + explicit review
before publication → catalog reviewer; sensitive edit (brand, condition, warranty, tax class, payout account) →
pending version, live unchanged → catalog lead, finance for tax/payout; price outside a band of recent median → held
as outlier → buyer; routine stock/lead-time refresh from a trusted vendor → auto-accepted within validated bounds
(audited); safety or counterfeit concern → immediate suspension of offer → operations admin. Editing the policy is
not shown in the mockup (policy changes would be configuration change requests — `API-M24-02`). Status:
REQUIRES_DECISION (D-081).

**`#m-invite` — Invite a vendor** (BP §11.1 "admin invitation"). Static text: "Invited vendors still go through
verification and approval. An invitation creates an applicant, not an active vendor."

| Field | Type | Req | Validation / source |
|---|---|---|---|
| Business name | text | Y | — |
| Contact email | email | Y | Email format |
| Proposed model | select | Y | Supplier / Supplier fulfilment (pilot — shows "capacity full" when no pilot capacity, D-007) / Marketplace seller (Phase 2 — not selectable for activation, D-046) |

"Send invitation" → `API-M14-47` → 201 `{invitation_id, expires_at}` (MK "link valid 7 days" sample → D-083).
Permissions R-ops_admin, R-owner. Status REQUIRES_DECISION (D-047).

### 4.10 Screen permissions (P-E11)

| Capability | R-catalog_staff | R-ops_admin | R-finance | R-owner | Buyer roles | Source |
|---|---|---|---|---|---|---|
| View vendors, detail, performance | Yes | Yes | — | Yes | Yes | API-M14-45, API-M14-46, API-M14-55 |
| Invite vendor / decide application | — | Yes (D-047) | — | Yes | — | BP §11.1; MEET |
| Review submissions | designated reviewer (D-081) | Yes | tax / payout fields | Yes | price outliers | BP §11.3, §18.1 "Publish new product" |
| Suspend vendor | — | Yes | — | Yes | — | BP §11.1 |
| Approve reinstatement | — | — | — | Yes | — | API-M14-51 |
| Change permitted scope | — | request | — | approve | — | API-M14-52 |
| Freshness actions | Yes | Yes | — | Yes | read | API-M06-27 |
| Vendor (any R-supplier) | never — no access to this screen | | | | | BP §3.1 |

### 4.11 CONDITIONAL / MOCKUP-ONLY / LATER items (P-E11)

| Item | Label | Decision |
|---|---|---|
| Marketplace tab, marketplace model option, settlement preview | LATER | D-046 |
| Supplier-fulfilment pilot (model option, capacity, pilot KPIs) | CONDITIONAL / PROPOSED-DEFAULT pilot | D-007, D-008 |
| Bank-account verification of applicants ("penny-drop") | REQUIRES_DECISION | D-068 |
| Score weights and thresholds | MOCKUP (proposed) | D-187 |
| Vendor messaging from staff | MOCKUP | — (API-M14-53) |

---
## 5. P-E12 — Payments & reconciliation (`erp-finance.html`)

### 5.0 Summary card

| Property | Value |
|---|---|
| Purpose | Finance workspace: payment attempts and provider events, settlement and bank reconciliation with an unmatched-items queue, refunds with safe retries and maker–checker release, COD remittances (conditional), accounting export with control totals and invoice series, and the daily close (BP §10.1–10.3, §10.6, §14.2; BP §30.1 "Finance: Payment attempts, unmatched entries, refunds, settlement import, accounting export status") |
| Evidence | DOCUMENTED (BP §10.1–10.3, §10.6, §14.2, §16.4, A09, A10, A26, T06–T09, T18, T19, T27) · MOCKUP (daily close — BP §14.2, §18.2) · CONDITIONAL (COD — D-020; settlement import A10 P1/C; accounting export A26 P1/C) |
| Route | NOT SPECIFIED — MK `erp-finance.html` tabs `#payments`, `#events`, `#recon`, `#refunds`, `#cod`, `#export`, `#close`; drawer `#d-pay` (deep-linkable); modals `#m-retry`, `#m-import` |
| Module / folder | M11 (+ M19 export/series, M18 exports, M22 files) · `frontend/workspace/` if D-004 = custom |
| Phase · reqs | 1A (BP §5.1 "payments"; §5.2 "Basic finance exports/reconciliation" = M) · R06, R10 · A09 (P1), A10 (P1/C), A26 (P1/C) · T06, T07, T08, T09, T18, T19, T21, T27, T34 · WP10, WP15 · BP §4 "Payment accuracy" measure · proof scenarios 5, 10 |
| D-004 native-vs-custom considerations | (1) The official books stay with the accounting authority (D-011, BP §14.2), so accounting screens are not rebuilt; this screen only shows payment/refund/reconciliation/export **status**. (2) Payment attempts, provider events and refund transitions are custom records of the controlled API (E-payment_attempt, E-payment_event, E-refund) whatever the core is. (3) Native payment-entry/bank-reconciliation tools of the core candidates may cover parts of `#recon` if ERP accounting is adopted (BR-M19-06, CONDITIONAL D-011). (4) Finance work is daily (daily close), which BP §30.1 weighs in favour of a purpose-built view. **Not decided — D-004.** |
| Roles | R-finance (primary), R-owner (checker, overrides), R-ops_admin (read / reconciliation runs), R-sales_support (read attempts in scope) — detail §5.11 |
| Status | REQUIRES_DECISION (D-004, D-101, D-012) |

### 5.1 Page header, filters, KPI strip and overview panels

| Element | Content | API / source | Label · status |
|---|---|---|---|
| Subtitle | Provider, last settlement import time, accounting authority statement (names are samples — D-012, D-011) | `API-M24-03` (integration status) | MOCKUP |
| "Check pending with provider" | Queries provider for all pending/unknown attempts | `API-M11-06` `scope=all_pending` (Idem) → 202 job | DOCUMENTED BP §10.2 step 8 |
| "Import settlement file" | Opens `#m-import` | — | CONDITIONAL (A10) |
| "Export" menu | "Accounting export (<product>)" → `#export`; "Payment ledger (CSV)" → `API-M18-03` `payment_ledger` (formula-safe, expiring link); "Reconciliation report" → `API-M18-03` `recon_report` | `API-M18-03` | DOCUMENTED BP §14.4 · D-152 |
| Period segmented | Today / Yesterday / 7 days / Month to date → `from`/`to` | list filters | MOCKUP |
| Location & channel select | All / website / WhatsApp checkout links / each branch POS → `location/channel` | `API-M11-04` | MOCKUP · R14 |
| Provider select | provider / branch card terminals / COD couriers (samples) → `provider` | `API-M11-04` | MOCKUP · D-012, D-020 |
| Business-date line | "Business date … · amounts incl. GST unless stated · payment date ≠ invoice date ≠ settlement date" | — | DOCUMENTED BP §14.4 · D-124 (business-day timezone) |
| KPIs | Captured today (value, count, sparkline); Success rate (sparkline); In flight (pending · authorised); Unmatched (value, items, oldest — anno "1A · R09 Settlement matching (A10)"); Refunds open (failed, value); Accounting export (acknowledged / sent, failed, batch time) | G-18 (only method mix/success in `API-M11-04` summary) | MOCKUP |
| Panel "Unmatched value by age" | Horizontal bars by age bucket + "Table" toggle; note "Items older than n days escalate to the Owner digest" (n sample → D-138) | `API-M11-16` aggregated client-side or G-18 | DOCUMENTED A10 |
| Panel "Method mix · today" | Stacked bar + table Method · Attempts · Success (EMI shown as a method — D-062/D-012) | `API-M11-04` summary | MOCKUP |
| Panel "Daily close" | Progress "n of m checks done · sign-off by <time>", open items list, "Open" → `#close` | `API-M11-20` | MOCKUP |

### 5.2 Tab `#payments` — Payment attempts

| Property | Value |
|---|---|
| Purpose | Inspect payment attempts and their state separately from order state (BP §10.1) |
| Evidence | DOCUMENTED (BP §10.1, §10.2) · MOCKUP (anno "1A · §10.1 Payment attempt states are separate from order state") |
| Route | NOT SPECIFIED — MK `#payments`; drawer `#d-pay` |
| Sections / components | Search "Order, provider ref, customer…"; state segmented (All / Created / Pending / Authorised / Captured / Failed / Expired); table; "Showing n of N attempts"; pager |
| Table | Attempt · Order (number + customer) · Method (masked instrument) · Provider ref · Amount · Attempt state (pill) · Order state (pill) · Updated · Note (highlighted when exception) |
| Filters · search · pagination | `q`, `state`, `from`/`to`, `location/channel`, `provider` → `API-M11-04`; pager per D-080 |
| States | Empty "No payment attempts in this state — Try another filter" (MK); exception rows highlighted with text (X13) |
| Permissions | R-finance, R-ops_admin, R-owner; R-sales_support read (loc) |
| APIs | `API-M11-04`, `API-M11-05` (drawer) |
| Backend / data | BR-M11-01…06, BR-M11-10; E-payment_attempt, E-payment_event, E-sales_order |
| Related | P-E02 order drawer (payment section), P-S08 payment status |
| Phase · reqs | 1A · T06, T07, T08, T09 |
| Status | NOT_STARTED |

### 5.3 Drawer `#d-pay` — Payment attempt detail

| Property | Value |
|---|---|
| Purpose | Show one attempt with its provider evidence and the three separate states |
| Sections / components | Head (attempt id, state, order, customer, method, amount). Exception callout when captured after reservation expiry (policy: re-reserve with consent, offer alternative, or refund; escalated to finance with due time) — BP §10.3, §29.6, T09. Three state tiles Order · Payment attempt · Fulfilment (anno "Separate state machines"). Key-values: provider, provider order ref, payment id, idempotency key, amount, method, gateway fee (estimate, + GST), "Card data: Not stored — tokenised by provider" (BR-M11-10). "Attempt timeline" (created after stock reservation, redirected, authorised with signature check, captured "signed webhook verified · applied once", failed reason, expired "reservation released", stock exception raised). Pending callout on provider polling (interval sample → D-012). Footer: Close, "Check with provider", "Open order" |
| APIs | `API-M11-05`, `API-M11-06` (`scope=attempt_id`), navigation to P-E02 |
| Backend / data | BR-M11-02…06, BR-M11-10, BR-M11-14; E-payment_attempt, E-payment_event, E-reservation, E-exception_case |
| Permissions | As §5.2; "Check with provider" R-finance, R-ops_admin, R-sales_support (single order) |
| Status | NOT_STARTED; late-capture policy text REQUIRES_DECISION (D-026) |

| Control | API | Result / guard | Evidence |
|---|---|---|---|
| "Check with provider" | `API-M11-06` `scope=attempt_id` (Idem) | Provider result shown; never marks captured without provider confirmation | DOCUMENTED BP §10.2 step 8 |
| "Open order" | navigation → P-E02 drawer `d-order` (04b §5.4) | — | MOCKUP |

### 5.4 Tab `#events` — Webhook events

| Property | Value |
|---|---|
| Purpose | Audit provider events: signature result, application result (applied, duplicate ignored, out-of-order recorded without downgrade, rejected, status poll) (BP §10.2–10.3, §17.4) |
| Evidence | DOCUMENTED (BP §10.2, §10.3, T07, T08) · MOCKUP (anno "1A · §10.2 Signed webhooks, duplicates & out-of-order events handled idempotently") |
| Route | NOT SPECIFIED — MK `#events` |
| Sections / components | Result segmented (All / Applied / Duplicate / Out of order / Rejected / Polling); table (newest first) |
| Table | Received · Event ID · Type · Payment / order · Signature (Verified / Invalid / "API call" for polls) · Result (text explanation) · Latency |
| Filters | `result`, `from`/`to` → `API-M11-07` |
| States | Invalid-signature rows show "security alert raised" (MK) |
| Permissions | R-finance, R-ops_admin; raw payload view only for permitted roles (`API-M11-07`) |
| APIs | `API-M11-07` |
| Backend / data | BR-M11-02, BR-M11-03, BR-M11-04; E-payment_event |
| Phase · reqs | 1A · A09 · T07, T08 |
| Status | NOT_STARTED |

### 5.5 Tab `#recon` — Settlement reconciliation

| Property | Value |
|---|---|
| Purpose | Match provider settlements to captures, fees and bank credits; manage the unmatched-items queue by age and owner (A10 "Import provider settlement records and match fees/net — unmatched or partial entries to finance") |
| Evidence | DOCUMENTED (A10 P1/C, BP §14.3 "Payment reconciliation") · MOCKUP (anno "Captured vs settled vs fees vs net vs bank") |
| Route | NOT SPECIFIED — MK `#recon` |
| Sections / components | (1) Settlement detail waterfall for the selected settlement: captured payments (count) − not in this batch = gross settled − gateway fees − GST on fees − refunds adjusted = net payout per file; bank credit (reference); difference; explanatory note (fee ledger mapping in the accounting export); status pill (Matched to bank). (2) "Recent settlements" table (auto-match schedule text — sample). (3) "Settlement & statement imports" table + "Import file". (4) "Unmatched items queue" with note "Each item has an owner and a due date · write-offs above <placeholder> need Owner approval", age segmented, table, total |
| Table — settlements | Settlement · For date · Captured · Fees + GST · Net · Status (Matched / n fee mismatch / Chargeback debit / Expected <date>) |
| Table — imports | File (name, type, time, source/user) · Rows · Matched · Result (Imported / n unmatched / Duplicate · rejected same file hash / n short) |
| Table — unmatched | Item · Type (Settlement / Fees / Bank / COD / Dispute) · Reference · Amount · Age (colour + text) · Owner · Action (suggested action button, e.g. "Raise with provider", "Investigate", "Match manually", "Match to <order>", "Dispute with courier", "Submit evidence by <date>", "Check with provider") |
| Filters | Settlements `from`/`to`, `status` → `API-M11-14`; unmatched `age_bucket`, `type`, `owner` → `API-M11-16` |
| Permissions | R-finance; R-owner read; write-off approvals per D-024 |
| APIs | `API-M11-14`, `API-M11-15`, `API-M11-13` (via `#m-import`), `API-M11-16`, `API-M11-17`, `API-M11-19` (bank-transfer match) |
| Backend / data | BR-M11-06, BR-M11-13, BR-M11-18; E-settlement_record, E-payment_attempt, E-refund, E-exception_case |
| Related | P-E14#exceptions (finance exceptions), P-E13 payment-reconciliation report |
| Phase · reqs | 1A (CONDITIONAL A10) · T27 |
| Status | REQUIRES_DECISION (D-064, D-012) |

| Control | API | Result / guard | Evidence |
|---|---|---|---|
| Settlement row click | `API-M11-15` | Loads waterfall + lines (payment ref, order ref, captured, fee, tax, net, bank ref, match state) | DOCUMENTED A10 |
| "Import file" | opens `#m-import` | — | CONDITIONAL |
| Unmatched item action button | `API-M11-17` (`match_to` + target_ref / `write_off_request` / `dispute` / `note`, reason) | 200 or 202 approval for write-offs above threshold (D-024) | DOCUMENTED A10 |
| "Match to <order>" for a bank credit without settlement (dealer bank transfer) | `API-M11-19` (record bank-transfer payment against the order, R-finance match) then `API-M11-17` `match_to` | Order payment recorded only on finance match (06-api API-M11-19) | MOCKUP · D-012, D-019 |

Matching tolerances, schedule time and escalation age are samples → D-178 (matching parameters), D-138
(escalation), D-064 (file formats).

### 5.6 Modal `#m-import` — Import settlement or bank file

| Field | Type | Req | Validation / source |
|---|---|---|---|
| File type | segmented (provider settlement / bank statement / courier COD remittance) | Y | `type` (`provider_settlement`, `bank_statement`, `cod_remittance`); COD only if D-020 |
| File | file (drop zone or browse) | Y | CSV/XLSX; size limit and template version are samples (D-064, D-113 not applicable — document class); upload via `API-M22-01` (private) |
| Period | date range | C | `period` (API-M11-13) — not drawn in MK |

Static text: "Duplicate files are rejected by content hash · rows are matched automatically"; preview of the last
successful import. "Import & match" → `API-M11-13` (Idem) → 202; toast "you'll be notified when matching finishes"
(notification via `API-M20-01`). Permissions R-finance. Status REQUIRES_DECISION (D-064).

### 5.7 Tab `#refunds` — Refunds (and modal `#m-retry`)

| Property | Value |
|---|---|
| Purpose | Move refunds through requested → approved → submitted → pending → completed/failed with authority, maker–checker for bank transfers and safe retries (BP §10.1, §10.3, §18.1) |
| Evidence | DOCUMENTED (BP §10.1 refund states, §10.3, §17.6, §18.1, T18, T19, T34) · MOCKUP (anno "1A · §10.1 Refund state machine") |
| Route | NOT SPECIFIED — MK `#refunds`; modal `#m-retry` |
| Sections / components | State summary tiles (Requested — awaiting RMA result; Approved — n need checker; Submitted to provider; Pending at provider — method-specific timing; Completed today — value; Failed — response-time target "SLA n h · m h used", sample → D-179/D-138); refunds table; note "Refunds use the original allocated line amount, discount and tax from the order · credit notes are raised automatically and exported" (BP §8.4; BR-M11-07); link "Returns & RMA →" (P-E04) |
| Table | Refund · Source (RMA / cancelled order / duplicate capture) · Customer · Route (original method with masked instrument / bank transfer "IFSC verified") · Amount · State · Approval (auto within policy / approver + limit / "Maker … → checker pending") · Provider ref · Action |
| Filters · search | `state`, `source`, `age` → `API-M11-08` |
| States | "Approve" disabled with reason while the source RMA has no inspection result (MK "Waits for inspection result"; BR-M11-16 refund vs resale are separate decisions) |
| Permissions | R-finance approve/submit within policy; check & release by a second finance user ≠ maker (BP §18.2); R-owner override with audit; R-sales_support sees own requests; vendors request only (BP §18.1) |
| APIs | `API-M11-08`, `API-M11-10` (approve, submit, check_release, hold — Idem), `API-M11-11`, `API-M11-12` |
| Backend / data | BR-M11-07, BR-M11-08, BR-M11-09, BR-M11-14, BR-M11-16; E-refund, E-payment_attempt, E-return_request, E-order_cancellation, E-invoice_reference |
| Related | P-E04#refunds, P-E02 (cancellations), P-E14#approvals |
| Phase · reqs | 1A · T18, T19, T34 · WP10 |
| Status | REQUIRES_DECISION (D-024 refund thresholds; D-150 reject/hold states) |

| Control (row state) | API | Result / guard | Evidence |
|---|---|---|---|
| "Approve" (requested) | `API-M11-10` `approve` (expected_version) | Approver ≠ requester; within authority (D-024) else 202 | DOCUMENTED BP §18.1 |
| "Submit" (approved) | `API-M11-10` `submit` (Idem) | Submitted with provider idempotency reference | DOCUMENTED BP §10.3 |
| "Check & release" (approved, bank transfer) | `API-M11-10` `check_release` | Maker ≠ checker recorded | DOCUMENTED BP §18.1 "maker/checker" |
| "Status" (submitted/pending) | `API-M11-11` | Provider status, safe_to_retry | DOCUMENTED BP §10.3 |
| "Retry safely" (failed) | opens `#m-retry` | — | DOCUMENTED T19 |

`#m-retry` — "Retry refund <id> safely": static text "A refund is never re-issued blindly. The provider's status is
checked first so a timed-out or delayed refund can't be paid twice." Steps (each with result text): 1 "Query
provider status" → `API-M11-11`; 2 "Check total refunded on <payment>" (refunded so far vs captured, no refund in
flight) → from `API-M11-11`/`API-M11-08`; 3 "Choose a route" (enabled only after 1–2 pass).

| Field | Type | Req | Validation / source |
|---|---|---|---|
| Refund route | select | Y | New customer-confirmed UPI ID (verified) or bank transfer with maker–checker (MK); verification method sample → D-012 |
| Idempotency key | read-only display | — | Same key on any further retry (BP §17.5) |

Buttons: Cancel; "Run status check" (steps 1–2); "Submit retry" (disabled until checks pass) → `API-M11-12` (Idem).
Status: NOT_STARTED.

### 5.8 Tab `#cod` — COD remittance (conditional)

| Property | Value |
|---|---|
| Purpose | Reconcile courier COD remittances and show COD eligibility rules — only if COD is enabled (BP §10.6 "COD is conditional: eligibility rules, delivery collection reconciliation, returned-to-origin handling, and fraud/abuse controls") |
| Evidence | CONDITIONAL (BP §10.6) · MOCKUP (anno "§10.6 COD is conditional — eligibility, remittance, RTO, abuse controls"; callout "Values shown are placeholders pending client decision (discovery Q37)") |
| Route | NOT SPECIFIED — MK `#cod` |
| Sections / components | Conditional callout; "Courier remittances" table (+ COD share of orders/value); tiles: returned to origin (period), RTO rate on COD vs prepaid, customers COD-blocked (rule text); "Eligibility rules (proposed)" list (serviceable PIN with COD courier; order value limit; consumer orders only — dealers prepaid; exclusions for high-value refurbished/serial-tracked items; disable after n refused deliveries; OTP confirmation above a value) — all placeholders; callout "COD refunds can't go back to 'cash' — they go to a verified bank account or UPI ID with maker–checker release" |
| Table | Courier · batch · Orders · Expected · Remitted · Diff. · Due · Status (Reconciled / Short · disputed / Awaiting remittance / Overdue n d) |
| APIs | `API-M11-18`, `API-M11-13` (`cod_remittance` import), `API-M11-17` (dispute short remittance), `API-M24-01` (eligibility rules as configuration), `API-M24-02` (rule change request — edit control not drawn in MK) |
| Backend / data | BR-M11-12; E-settlement_record, E-payment_attempt, E-fulfilment, E-configuration_version |
| Permissions | R-finance |
| Phase · reqs | 1A CONDITIONAL |
| Status | REQUIRES_DECISION (D-020, D-013) — tab hidden when COD is disabled (feature flag, D-077) |

### 5.9 Tab `#export` — Accounting export & GST series

| Property | Value |
|---|---|
| Purpose | Show the controlled export of approved financial documents to the single accounting authority with control totals, per-document status, safe retries, and the invoice-series register (BP §14.2, §16.4, §17.6; A26) |
| Evidence | DOCUMENTED (BP §14.2, §16.4 "Signed-off file export and control totals", §17.6, A26 P1/C) · MOCKUP (anno "§14.2 One accounting authority … controlled export with control totals", "1A · GST invoice series — gapless, never reused") |
| Route | NOT SPECIFIED — MK `#export` |
| Sections / components | Callout (accounting authority remains official books; approved invoices, credit notes, receipts and gateway charges are published; each document exported once — key = document id + version; re-runs skip acknowledged documents; corrections via credit/debit notes, never editing an exported voucher); "Control totals · batch <id>" table + "Retry failed (n)" + "Control-total report"; "Documents" table with filter All / Failed / Skipped; "GST invoice series · FY · registration" table with note "Numbers are allocated only when an invoice is finalised · cancelled numbers are kept, never reused" |
| Table — control totals | Measure (documents, taxable value, CGST, SGST, IGST, receipts, credit notes) · Tradex · Accounting ack. · Diff. |
| Table — documents | Document · Type (sales invoice, B2B invoice, receipt, credit note, journal · gateway charges, amended) · Amount · Status (Exported / Failed / Skipped) · Voucher / error text |
| Table — invoice series | Series · Used for · Last issued · Next · Issued FY · Cancelled · Gap check · E-invoice (IRN) status |
| Filters | batch/period, status → `API-M19-06`; financial year → `API-M19-09` |
| Permissions | R-finance, R-owner |
| APIs | `API-M19-06`, `API-M19-07` (Idem), `API-M19-08`, `API-M19-09` |
| Backend / data | BR-M19-01…05; E-accounting_export, E-invoice_reference |
| Related | P-E09#bills (approved supplier bills), P-E04 credit notes, `#close` |
| Phase · reqs | 1A (A26 P1/C) · T27 · proof scenario 10 |
| Status | REQUIRES_DECISION (D-011, D-055, D-037) |

| Control | API | Result / guard | Evidence |
|---|---|---|---|
| "Retry failed (n)" | `API-M19-07` (`all_failed` or refs; same idempotency keys) | "no duplicates possible" | DOCUMENTED BP §17.6 |
| "Control-total report" | `API-M19-08` | File download | DOCUMENTED BP §16.4 |
| Documents filter | `API-M19-06` | — | DOCUMENTED |

Accounting product name ("Tally"), gateway-agent mechanism, series prefixes and IRN applicability are samples →
D-011 (authority/method), D-055 (series/templates), D-037 (e-invoicing applicability).

### 5.10 Tab `#close` — Daily close

| Property | Value |
|---|---|
| Purpose | Daily finance checklist; maker signs off (with exceptions note if items are open), a different checker approves; sign-off locks the day's payment ledger for export (BP §14.2 reconcile counts/amounts; §18.2 separation of duties; T27) |
| Evidence | MOCKUP (anno "1A · Daily close checklist (maker → checker)"); SoD DOCUMENTED (BP §18.2) |
| Route | NOT SPECIFIED — MK `#close` |
| Sections / components | Header "Daily close · <date> · Maker: <user> · Checker: <user> · deadline <time>" + progress n/m; checklist rows (icon, check name, detail, done by, status "Done · time" / "Open", "Resolve" → relevant tab); textarea "Exceptions note (required to sign off with open items)"; callout "Signing off locks the day's payment ledger for export. Late events still post, but to the next business date with a reference to this close."; "Re-run checks", "Sign off with exceptions" |
| Checklist items (MK samples) | Webhook events processed · pending attempts resolved · settlement imported & matched · bank statement matched · failed refunds reviewed · COD remittances received (CONDITIONAL) · branch POS & card terminal totals entered (D-009/D-030) · invoice-series gap check · accounting export control totals match |
| States | Sign-off without note while items open → error "Add an exceptions note — n items are still open" (MK); after maker sign-off: "sent to <checker> for checker approval" — the **checker approval view is not drawn** in MK; it uses the same tab with an "Approve" action for a user ≠ maker |
| Permissions | Maker R-finance; checker R-owner or a second finance user (≠ maker) (BR-M11-17) |
| APIs | `API-M11-20`, `API-M11-21` (`rerun_checks`, `sign_off`, `approve`) |
| Backend / data | BR-M11-17; E-finance_day_close (MOCKUP entity, 00-conventions §7.1), E-payment_attempt, E-settlement_record, E-accounting_export |
| Phase · reqs | 1A · T27 |
| Status | NOT_STARTED (deadline time sample → D-179; business date timezone D-124) |

### 5.11 Screen permissions (P-E12)

| Capability | R-finance | R-owner | R-ops_admin | R-sales_support | Source |
|---|---|---|---|---|---|
| View attempts / events | Yes | Yes | Yes | attempts read (loc) | API-M11-04, API-M11-07 |
| Provider reconciliation run | Yes | — | Yes | single order | API-M11-06 |
| Settlement import / unmatched resolution | Yes | read | — | — | API-M11-13, API-M11-17 |
| Refund approve / submit | within policy | override with audit | — | request only | BP §18.1 |
| Refund check & release (bank transfer) | second finance user ≠ maker | Yes | — | — | BP §18.1–18.2 |
| Accounting export retries / series | Yes | read | — | — | API-M19-06…09 |
| Daily close maker / checker | maker | checker | — | — | BR-M11-17 |

### 5.12 CONDITIONAL / MOCKUP-ONLY / LATER items (P-E12)

| Item | Label | Decision |
|---|---|---|
| COD tab, COD provider filter, COD checks in daily close | CONDITIONAL | D-020 |
| Settlement import & matching (A10) | CONDITIONAL (P1/C) | D-064 |
| Accounting export (A26) | CONDITIONAL (P1/C) | D-011 |
| E-invoice (IRN) column | REQUIRES_DECISION | D-037 |
| EMI as a payment method in method mix | MOCKUP-ONLY | D-062 |
| Branch POS totals in daily close | REQUIRES_DECISION | D-009, D-030 |
| OCR of supplier invoices / payout automation | LATER | — (A31 P2, A33 P2) |

---
## 6. P-E13 — Reports (`erp-reports.html`)

### 6.0 Summary card

| Property | Value |
|---|---|
| Purpose | Operational report catalogue (BP §14.3) with one report viewer (filters, KPIs, chart, table, definitions, freshness), saved views, schedules, export jobs and the owner digest preview (BP §14.3, §14.4; A19; PR1 §10 "Scheduled daily/weekly management reports") |
| Evidence | DOCUMENTED (BP §14.1, §14.3, §14.4, §4, A19; PR1 §4 Reporting, §10) · MOCKUP (anno "1A · R14 Standard report catalogue (blueprint §14.3)") |
| Route | NOT SPECIFIED — MK `erp-reports.html` (no tabs; sections: catalogue, open report, `#schedules`, `#exports`); modals `#m-export`, `#m-schedule`, `#m-request`, `#m-digest`. MK deep-link parameters `?state=` and `?group=` are prototype aids |
| Module / folder | M18 (+ M17 digest) · `frontend/workspace/` if D-004 = custom |
| Phase · reqs | 1A (BP §5.1 "reports") · R14, R06, R10 · A19 (P1) · T27, T35 · WP15 · catalogue items marked 1B in MK: Vendor performance, Approval ageing |
| D-004 native-vs-custom considerations | (1) Core candidates have native report/query tooling; BP §14.1 keeps "data warehouse and advanced BI" out of minimum scope. (2) BP §14.4 rules — distinct event dates, gross vs net, tax-basis labels, freshness and failed-feed indicators, restricted columns, export row limits/expiry/audit, formula-injection neutralisation — must hold whichever UI is used; a native report view would need these added. (3) The launch report set itself is D-075. **Not decided — D-004.** |
| Roles | Any staff role for reports it is permitted to see (per-report permission); R-branch_manager branch-scoped; restricted reports (gross margin, payment reconciliation, accountant extract, audit export) R-finance / R-owner / R-ops_admin — detail §6.8 |
| Status | REQUIRES_DECISION (D-004, D-101, D-075) |

### 6.1 Page header

| Element | Content | API | Label · status |
|---|---|---|---|
| Title | "Reports" | — | MOCKUP |
| "Scheduled reports (n)" | Scrolls to `#schedules` | `API-M18-06` (count) | MOCKUP |
| "My exports" | Scrolls to `#exports` | `API-M18-04` | MOCKUP |
| "Request a report" | Opens `#m-request` | — | DOCUMENTED BP §25.5 |

### 6.2 Section "Report catalogue"

| Property | Value |
|---|---|
| Purpose | Find a report from the approved catalogue, filtered by what the user may see |
| Evidence | DOCUMENTED (BP §14.3) · MOCKUP |
| Sections / components | Search "Find a report…"; group chips (All n / Sales & customers / Stock / Orders, payments & returns / Partners / Governance); report cards (icon, name, phase badge, dimension chips, "action enabled" line, KPI teaser, freshness pill or lock tag "Restricted to <roles>", "Open" button or "Open below" badge; cards for Automation health / Approval ageing / Audit export link to P-E14 / P-E15); "Request a report" card; empty state "No report matches '<q>' — Try 'stock', 'margin' or 'audit', or request a new report" |
| Catalogue (MK) | Sales & returns · Stock position · Stock ageing · Low stock · Inventory extract (accountant) · Order ageing · Payment reconciliation · Returns & warranty · Gross margin ("Illustrative — not a statutory P&L") · Customer funnel ("Excludes test & duplicate events") · Branch comparison · Vendor performance (1B) · Automation health · Approval ageing (1B) · Audit export — 13 of these are BP §14.3; "Inventory extract (accountant)" is BP §14.1 "inventory extracts" (meaning D-075); "Branch comparison" is BP §30.1 Owner workspace |
| Filters · search | `group`, `q` → `API-M18-01` (catalogue filtered by permission) |
| Permissions | Cards for reports the user may not run are not returned (BR-M18-04) — restricted cards shown with lock only to roles that can open them |
| APIs | `API-M18-01` |
| Backend / data | BR-M18-01, BR-M18-04 |
| Status | REQUIRES_DECISION (D-075) |

### 6.3 Section "Open report" (viewer; example "Sales & returns by branch")

| Property | Value |
|---|---|
| Purpose | Run one report with a single filter row that scopes KPIs, chart and table; show definitions and data freshness (BP §14.4) |
| Evidence | DOCUMENTED (BP §14.3, §14.4) · MOCKUP (anno "One filter row scopes KPIs, chart and table", "Gross vs net labelled on every figure", "R14 Branch · channel · condition", "§14.4 Data freshness & failed-feed indicators", "§14.4 Definitions: event dates · gross vs net · tax basis") |
| Sections / components | Header: close (filters kept in the saved view), report title, freshness pill + detail (sources with as-of times); actions "Save view", "Schedule", "Print", "Export CSV". Filter row: period segmented (30 days / MTD / QTD / Custom…), date basis select (Invoice / Order / Payment / Dispatch / Settlement date), location, channel (Website / Branch POS / WhatsApp / Assisted), buyer type (Consumers / Dealers), condition (New / Open box / Refurbished / Used), category, reset; tax toggle (Excl. GST / Incl. GST). KPI row: Gross sales (before returns), Returns (% of gross), Net sales (Δ vs previous period), Invoiced orders (units), Avg. order value (net ÷ orders), GST on net sales (shown separately). Chart "Net sales by <dimension>" with group segmented (Branch / Channel / Condition / Daily trend) and "Table view" toggle (X13). Side panels: "Net sales mix by condition" (stacked bar), "Top return reasons" (list with %). "Definitions used in this report" card: version, approver, "history" link; Gross vs net; event-date strip with the chosen basis highlighted; refunds in a later period; tax-inclusive/exclusive rule; exclusions ("Not a statutory profit & loss statement"). Breakdown table with sortable headers, totals footer, "Δ compares with the previous period", export note (row count, within limit, expiry, formula-safe) + "Export CSV" |
| Table | <Dimension> · Orders · Units · Gross sales · Returns · Net sales · Share of net (bar + %) · Return rate (flag above a threshold — sample) · AOV · Δ net; row click drills into invoices |
| Filters · search | All filter-row values → `API-M18-02` query (`date_basis`, `from`, `to`, `location_id`, `channel`, `buyer_type`, `condition`, `category`, `tax_basis`, `group_by`, `drill`) |
| States | **Stale** — warning callout "Some feeds are behind — figures may be incomplete …" listing failed feeds with "View failed job →" (P-E14#runs) and the freshness pill "Partially stale" (from `freshness[]`, `failed_feeds[]`). **Empty** — "No sales match these filters" with the filter summary and suggestions "Widen to 30 days", "Use order date". **Restricted scope** — callout "Record scope limits this report to <branch>; other branches, supplier cost and margin columns are not shown, and exports are limited to the same scope" (BR-M18-09; group-by options outside scope disabled). The MK state switcher (Normal / Stale feed / No results / Branch manager view) is a prototype control, not built |
| Permissions | Per report (`API-M18-02`); R-branch_manager branch-scoped (D-029); margin/cost/PII columns only for authorised roles (BP §14.4) |
| APIs | `API-M18-02`, `API-M18-14` (save view), `API-M18-13` (load saved views), `API-M18-03` (export), `API-M03-02` (location options) |
| Backend / data | BR-M18-02, BR-M18-03, BR-M18-04, BR-M18-06, BR-M18-07, BR-M18-08, BR-M18-09; E-saved_view (MOCKUP entity), E-export_job |
| Related | P-E01 (owner KPIs), P-E14#runs (failed jobs), P-E15#audit |
| Phase · reqs | 1A · R14 · T27, T35 |
| Status | REQUIRES_DECISION (D-075; D-124 period boundaries; D-016 tax display) |

| Control | API | Result / guard | Evidence |
|---|---|---|---|
| "Save view" | `API-M18-14` (screen_key `reports.<key>`, name, filters, shared_with_team?) | Toast with view name | MOCKUP |
| "Schedule" | opens `#m-schedule` prefilled | — | DOCUMENTED PR1 §10 |
| "Print" | print layout of the current report with filters in the header | none (browser print or document rendering — D-111) | MOCKUP |
| "Export CSV" | opens `#m-export` | — | DOCUMENTED BP §14.4 |
| Row click (drill) | `API-M18-02` with `drill` | Invoice-level rows | MOCKUP |
| Definitions "history" | none (G-19) | Definition version history | MOCKUP |

### 6.4 Modal `#m-export` — Export

| Field | Type | Req | Validation / source |
|---|---|---|---|
| Format | segmented (CSV (UTF-8) / XLSX) | Y | `format` (API-M18-03) |
| Rows | select (lines matching filters · summary by dimension · all lines since start of FY) with row counts | Y | Count preview not available in API (G-22); above the row limit → background job callout ("runs at low priority so it doesn't affect checkout; email with a private expiring link") — limit/expiry samples → D-152; BR-M18-06 |
| Column groups | checkboxes: invoice no. & dates; location/channel/buyer/condition; SKU, serial, qty, amounts excl. GST, GST; credit-note reference & return reason; customer name/phone/address (disabled unless permitted); supplier cost & margin (owner/finance only) | Y (≥ 1) | `column_groups[]`; PII/cost groups need permission; full PII → approval (BP §14.4, §18.1) |

"Generate CSV" / "Queue background export" → `API-M18-03` (Idem) → 202 `{export_id}` or 202 `APPROVAL_REQUIRED`.
Status REQUIRES_DECISION (D-152).

### 6.5 Section `#schedules` — Scheduled reports (and modals `#m-schedule`, `#m-digest`)

| Property | Value |
|---|---|
| Purpose | Manage scheduled report deliveries and digests (PR1 §10; BP §14.1 "scheduled files sent to accountants or suppliers" — D-075; A19 owner digest) |
| Evidence | DOCUMENTED (PR1 §10, A19) · MOCKUP (anno "1A · R14 Scheduled digests & accountant export") |
| Sections / components | Note "Delivered as expiring secure links (never raw attachments with personal data) · a delivery failure retries n× then raises one exception"; "New schedule"; table |
| Table | Schedule (name + contents) · Recipients (users or groups; record scope applied per recipient) · Frequency · Contents & format · Last run (delivered/opened, retries) · Next run · Status (Active / Paused) · Action (Preview · Test run · Edit · History · Resume) |
| Permissions | View/create R-owner, R-ops_admin, R-finance and schedule owners; recipients must be authorised for the report (`API-M18-07`) |
| APIs | `API-M18-06`, `API-M18-07`, `API-M18-08` (edit, pause, resume), `API-M18-09` (test run), `API-M18-10` (run history), `API-M17-25` (digest preview), `API-M17-26` (digest settings) |
| Backend / data | BR-M18-03, BR-M18-05, BR-M17-18; E-report_schedule, E-saved_view, E-exception_case |
| Status | REQUIRES_DECISION (D-075, D-063) |

MK schedule rows (samples): owner weekly digest (email + WhatsApp summary — D-063, D-014); accountant monthly
export to an **external** accountant via OTP link (external recipients are not supported by `API-M18-07` — G-20;
D-075, D-011); branch daily sales (own branch per recipient); low stock & purchase suggestions (buyer); stock ageing
(retried delivery).

| Field (`#m-schedule`) | Type | Req | Validation / source |
|---|---|---|---|
| Name | text | Y | — |
| Report & saved view | select | Y | Reports/saved views the creator may run (`report_key`, `saved_view_id?`) |
| Frequency | select (monthly first working day / weekly day / daily) | Y | `frequency` |
| Time (IST) | time | Y | Timezone per D-124 |
| Recipients | user picker (multiple) | Y | Each recipient authorised for the report; record scope applied per recipient (MK) |
| Format | segmented (PDF summary + link / CSV / XLSX) | Y | `format`; PDF rendering D-111 |
| If data is stale | select (send with a stale-data warning / hold and retry for n h / skip this run) | Y | `if_stale` (BR-M18-03) |
| Skip sending when the report is empty | checkbox | N | `skip_if_empty` |
| Raise one exception if delivery fails after n retries | checkbox | N | `raise_exception_on_failure` (BR-M17-12) — retry count sample |

"Create schedule" → `API-M18-07` → 201 `{schedule_id, first_run_at}`.

`#m-digest` — "Owner weekly digest · preview": KPI tiles (net sales excl. GST vs prior period; returns % of gross;
owner decisions count vs weeks ago; estimated hours saved by automation rules), "Decide this week" callout (items above
delegated authority), "Data freshness" callout; "Close"; "Edit digest" → digest settings (`API-M17-26`; settings form
not drawn in MK). Content, channel and schedule are D-063. Source A19 "Freshness labels and drill-down evidence".
Status REQUIRES_DECISION (D-063).

### 6.6 Section "How exports work" and `#exports` — Recent exports

| Property | Value |
|---|---|
| Purpose | Explain export controls and list recent export jobs with expiring links (BP §14.4) |
| Evidence | DOCUMENTED (BP §14.4) · MOCKUP (anno "§14.4 Row limits · expiring links · formula-injection safe") |
| Sections / components | "How exports work" list: row limit per direct download (larger → background job so checkout is not slowed); expiring private links (external accountant variant); formula-injection neutralisation with example; plain values (INR without symbols, ISO 8601 dates with timezone, tax basis in the file header); permissions and audit logging of every export with filters and row count. "Recent exports" (yours and team's, last n days) with "Export audit →" (P-E15#audit) |
| Table | Export · Report · filters · requested by · Rows · Link (expires in / background job · emailed link / expired / downloaded n×) · Status (Ready / Over limit → job / Expired / Denied — needs "Export customer data") · download |
| Permissions | Own exports; R-owner/R-ops_admin all (`API-M18-04`); team scope G-21 |
| APIs | `API-M18-04`, `API-M18-05` (download, audited) |
| Backend / data | BR-M18-05; E-export_job, E-audit_event |
| Status | REQUIRES_DECISION (D-152) — all numbers in the explanatory text (50,000 rows, 24 h, 7 days) are samples |

### 6.7 Modal `#m-request` — Request a new report

| Field | Type | Req | Validation / source |
|---|---|---|---|
| What decision should this report support? | textarea | Y | `decision_supported` (BP §14.3 "Action enabled" column) |
| Dimensions and filters | text | N | `dimensions_filters` |

Callout "New reports go through change control: definitions are agreed with Finance before the report is published
(§14.4, §25.5)". "Submit request" → `API-M18-11` → 201 `{change_request_id}` (E-change_request; where the change register is
maintained: D-191). Any staff. Status NOT_STARTED.

### 6.8 Screen permissions (P-E13)

| Capability | Any staff | R-branch_manager | R-finance | R-ops_admin | R-owner | Source |
|---|---|---|---|---|---|---|
| Open non-restricted reports | per report permission | own branch (D-029) | Yes | Yes | Yes | BR-M18-09 |
| Gross margin, payment reconciliation, accountant extract | — | — | Yes | per permission | Yes | BP §14.4 |
| Audit export | — | own-branch objects | finance objects | Yes | Yes | API-M02-30 |
| Export with PII / supplier cost | per dataset permission | scoped | finance purpose | per permission | governed | BP §18.1 |
| Create schedules / digest settings | — | — | Yes | Yes | Yes (digest) | API-M18-07, API-M17-26 |
| Request a report | Yes | Yes | Yes | Yes | Yes | API-M18-11 |

### 6.9 CONDITIONAL / MOCKUP-ONLY / LATER items (P-E13)

| Item | Label | Decision |
|---|---|---|
| Launch report set | REQUIRES_DECISION | D-075 |
| External recipients for scheduled files | REQUIRES_DECISION | D-075 (G-20) |
| Owner digest channels (WhatsApp summary) | REQUIRES_DECISION | D-063, D-014 |
| Data warehouse / advanced BI | LATER (BP §14.1 further expansion) | — |
| Prototype state switcher and `?state=` deep links | not a product feature | 00-conventions §1.1 |

---
## 7. P-E14 — Automation & exceptions (`erp-automation.html`)

### 7.0 Summary card

| Property | Value |
|---|---|
| Purpose | Operate the selected automations (catalogue per BP §12.2, each defined with the BP §12.3 template), watch job runs and failures (A38), work the exception queue ("what needs attention, why, who owns it, and by when" — BP §12.5), decide approvals with reason/deadline/alternate (BP §18.2), stop a faulty rule (kill switch — BP §12.3, §26.6 Q60) or pause automation during an incident (BP §20.4) |
| Evidence | DOCUMENTED (BP §12.1–12.6, §16.3, §18.2, §20.3, §20.4, A38) · MOCKUP (anno "R09/R10 Named reviewer may disable a faulty rule (§26.6 Q60)") |
| Route | NOT SPECIFIED — MK `erp-automation.html` tabs `#rules`, `#runs`, `#exceptions`, `#approvals`; drawer `#d-rule` (sub-tabs `rd-def`, `rd-runs`, `rd-hist`; MK `?rule=` deep link); modals `#m-kill`, `#m-resume`, `#m-pauseall`, `#m-propose`, `#m-approve` |
| Module / folder | M17 (+ M02 audit, M18 reports, M24 system status) · `frontend/workspace/` if D-004 = custom |
| Phase · reqs | 1A (rules, runs, exceptions — BP §5.2 "Owner exception dashboard, audit, alerts" = M) / 1B (approvals queue — BP §5.1 1B "approvals"; MK anno "1B · R06 Approvals") · R09, R10, R06 · A38, A19 and every selected A-rule (D-078) · T21, T31 · WP12 |
| D-004 native-vs-custom considerations | (1) Job/queue tooling and document approvals exist natively in the core candidates (BP §15.1 "Serial/batch records, approvals and APIs/background jobs exist" for ERPNext [S05, S06, S08]; §15.6 "Use the ERP's queue before adding another broker"). (2) The cross-module exception queue with severity, due time, escalation path and recommended actions (BP §12.5) and approval records with "why required", deadline and alternate (BP §18.2) are plan-specific records (E-exception_case, E-approval_request). (3) BP §15.6 / D-221 exclude a general workflow designer — rule definitions here are parameters of coded rules, not a builder. (4) The owner's daily use (T31) supports a purpose-built queue; native approval screens could serve single-document approvals. **Not decided — D-004.** |
| Roles | R-owner, R-ops_admin (rules, pause, all queues); rule owners/named reviewers; every operational role for its team's exceptions; approvers per type/value (D-024, D-025) — detail §7.10 |
| Status | REQUIRES_DECISION (D-004, D-101, D-078, D-138, D-024, D-025) |

### 7.1 Page header, KPI strip, value chart and health panel

| Element | Content | API / source | Label · status |
|---|---|---|---|
| "Pause automation…" | Opens `#m-pauseall` | `API-M17-14` | DOCUMENTED BP §20.4 |
| "Propose a rule" | Opens `#m-propose` | `API-M17-13` | DOCUMENTED BP §12.1 |
| KPIs | Active rules (n / N; paused; off); Runs today (7-day count); Success rate (today · 7 d); Staff time saved (h/week est., anno "§12.4 Hours saved are estimates, measured weekly"); Open exceptions (critical; owner-level); Approvals waiting (overdue; on me) | `API-M17-08` (per-rule runs/success/est. hours), `API-M17-05`, `API-M17-01`; no summary endpoint (G-24) | DOCUMENTED BP §12.4, §14.3 Automation health · MOCKUP |
| Chart "Estimated staff hours saved per week" | Line chart + "Table view" (anno "1A/1B · R09 Measured value — hours saved per week") | weekly series not in any API (G-24) | DOCUMENTED BP §12.4 formula · inputs D-193 |
| Panel "Health right now" | Worker queue, retries and failing rules with as-of time; items (e.g. rule auto-paused, import rows rejected, settlement matching partial) with "Evidence"/"Open"; "Global pause: off · last used …"; tiles Oldest queued job · Retries 24 h (recovered) · Failed → exception | `API-M24-08` (`summary`), `API-M17-15`, `API-M17-05`; global pause state (G-24) | DOCUMENTED BP §20.3 "worker queue age, retries" |

### 7.2 Tab `#rules` — Rules

| Property | Value |
|---|---|
| Purpose | Catalogue of selected automation rules with owner, status, run volume, success and estimated value (BP §12.2, §12.3, §14.3 "Automation health") |
| Evidence | DOCUMENTED (BP §12.2, §12.3) · MOCKUP (anno "1A/1B · R09 Rules catalogue from blueprint §12.2 (A01–A38)") |
| Route | NOT SPECIFIED — MK `#rules` |
| Sections / components | Search "Search rules, triggers, IDs…"; status chips (All / Active / Paused / Off / Failed in 7 d); phase select (All phases / 1A / 1B); table; footer "n of N rules · h/week saved (est.)" |
| Table | Rule (A-ID, name, manual activity replaced, phase) · When → then · Owner (role + named person) · Status (switch with label On / Paused · auto / Off; "Pilot" badge) · Runs 7 d · success (count + meter; colour + number) · Saved (h/week est.) · Last failure |
| Filters · search | `status` (active, paused, off), `phase` (1A, 1B), `failed_in_days`, `q` → `API-M17-08` |
| States | Empty "No rules match — Clear the search or filters" (MK) |
| Permissions | View R-ops_admin, R-owner, rule owners; R-finance read; status switch only for the named rule reviewer (R-ops_admin, R-owner) — governance D-194 |
| APIs | `API-M17-08`, `API-M17-10` (via switch → `#m-kill` / `#m-resume` / request enable) |
| Backend / data | BR-M17-01, BR-M17-02, BR-M17-15; E-automation_rule, E-job_attempt |
| Related | Rule-specific screens: A17 → P-E09#suggestions; A21 → P-E11#freshness; A10 → P-E12#recon; A19 → P-E13 digest |
| Phase · reqs | 1A / 1B per rule (BP §12.2 priorities; selection D-078) |
| Status | REQUIRES_DECISION (D-078) |

MK rule list (sample selection, not the launch set): A09, A05, A06, A04, A17, A01, A13, "A13.2 Courier tracking
sync", A14, A08, A21, A19, A16, A22, A10, A36 (off), A38. "A13.2" is not a BP §12.2 ID (inconsistency I-7); the
launch set and IDs follow D-078. Switch behaviour: turning off → `#m-kill`; turning on a paused rule → `#m-resume`;
turning on an off rule → "request enable" (`API-M17-10` `request_enable` → 202, requires complete template, staging
dry run and owner approval — MK).

### 7.3 Drawer `#d-rule` — Rule detail

| Property | Value |
|---|---|
| Purpose | Rule definition per BP §12.3 template, kill switch, recent runs, change history |
| Evidence | DOCUMENTED (BP §12.3) · MOCKUP (anno "§12.3 Disable / rollback — kill switch") |
| Sections / components | Head: A-ID, phase, status ("Running" / "Paused automatically · time" / "Off · not yet enabled"), name, "Replaces: … · owner … · version n, approved by … on …". Kill-switch panel: switch + explanatory text by state + button (Stop rule / Resume… / Request enable). KPI tiles: Runs · 7 days; Success (vs target — target value sample); Saved / week (estimate); Open exceptions. Sub-tabs: `rd-def` Definition — table of the 13 template fields (Business problem · Owner · Trigger · Inputs · Preconditions · Action · Idempotency · Failure behaviour · Human boundary · Audit · Notification · KPI · Disable / rollback) with note "every field is required before a rule can be enabled in production"; `rd-runs` Recent runs table (Run · Started · Attempt n/max · Result · Duration; empty "No runs yet — This rule has never been enabled in production"); `rd-hist` Change history timeline (auto-pauses, version approvals, resumes, edits, go-live with dry run). Footer: "Dry-run on staging", "Edit (needs approval)", "Done" |
| Permissions | View as §7.2; stop/resume named reviewer; edit proposal rule owner, R-ops_admin; approval R-owner |
| APIs | `API-M17-09`, `API-M17-10`, `API-M17-11`, `API-M17-12`, `API-M02-30` (change history detail) |
| Backend / data | BR-M17-01, BR-M17-10, BR-M17-11, BR-M17-15; E-automation_rule, E-job_attempt, E-approval_request, E-audit_event |
| Status | NOT_STARTED (dry run: REQUIRES_DECISION (D-077)) |

| Control | API | Result / guard | Evidence |
|---|---|---|---|
| "Stop rule" | opens `#m-kill` | — | DOCUMENTED BP §12.3 |
| "Resume…" | opens `#m-resume` | — | DOCUMENTED |
| "Request enable" | `API-M17-10` `request_enable`, reason | 202 approval; requires complete template + dry run | MOCKUP |
| "Dry-run on staging" | `API-M17-11` (rule_version, sample_size) | Runs on masked inputs (BP §19.3) — staging per D-077 | MOCKUP |
| "Edit (needs approval)" | `API-M17-12` (definition changes, reason) | Draft version + approval request | MOCKUP |

Values in MK definitions (retry caps, backoff, 15-min holds, 3-min grace, "max 2 h pause") are samples → D-026,
D-078; they come from rule configuration.

### 7.4 Modals `#m-kill` and `#m-resume`

`#m-kill` — "Stop rule <name>?"; callout "What happens: new runs stop now · in-flight runs complete · queued items
move to the manual queue · the rule owner and reviewer are notified · the change is audited" (BP §12.3
"Disable/rollback — how to stop safely and recover pending work").

| Field | Type | Req | Validation / source |
|---|---|---|---|
| Reason | select (provider outage / wrong results observed / business policy change / planned maintenance / other) | Y | List is a sample (D-139) |
| Note for the audit log | textarea | C | Required when reason = other (design of MK "Note for the audit log") |
| Auto-resume | select (never — resume manually / in n hour with health check / at time with health check) | Y | `auto_resume` (`never`, `after_minutes`, `at_time`) |

"Stop rule" → `API-M17-10` `action=stop`.

`#m-resume` — "Resume <rule>"; callout "A health check runs first (one test call). If it passes, the rule resumes
and the delayed items are re-synced once — repeating is safe" (idempotent). Field: Reason (textarea, Y). "Health
check & resume" → `API-M17-10` `action=resume`. Both: R-ops_admin, R-owner (named reviewer). Status NOT_STARTED.

### 7.5 Tab `#runs` — Job runs (with failed-job incident panel)

| Property | Value |
|---|---|
| Purpose | Durable job runs with retries/backoff, duplicates skipped, and one actionable incident per failure with evidence (BP §16.3, §20.3, A38) |
| Evidence | DOCUMENTED (BP §16.3, §12.3 failure behaviour, A38) · MOCKUP (anno "§16.3 Durable jobs · retries with backoff · evidence", "A38 One actionable incident per failure, with evidence") |
| Route | NOT SPECIFIED — MK `#runs` (incident panel anchored `#ev-<run>`) |
| Sections / components | Result segmented (All / Failed n / Retrying n / Partial n / Skipped (duplicate) n); rule select; period segmented (Last hour / Today / 7 days); runs table; failed-job incident panel: title "Failed job <run> · <rule>", actions "Retry now", "Switch to manual <work>", "Resume rule…", attempt timeline (scheduled start with idempotency key and "safe to repeat" note; each attempt with result and backoff; retry cap reached; rule auto-paused; one exception raised with assignee, due, owner-digest rule), customer-impact callout |
| Table | Run · Rule · Entity · Started · Duration · Attempt (n/max) · Result (Succeeded / Succeeded after retry / Skipped · duplicate / Partial / Retrying / Failed → exception) · Detail |
| Filters | `result`, `rule_id`, `period` → `API-M17-15` |
| Permissions | R-ops_admin, R-owner, rule owners |
| APIs | `API-M17-15`, `API-M17-16`, `API-M17-17`, `API-M17-10` (resume via `#m-resume`) |
| Backend / data | BR-M17-10, BR-M17-11, BR-M17-12; E-job_attempt, E-outbox_operation, E-exception_case |
| Related | P-E13 automation-health report; P-E03 (manual tracking queue); P-E12 (payment/refund jobs) |
| Phase · reqs | 1A · A38 · T21 |
| Status | NOT_STARTED |

| Control | API | Result / guard | Evidence |
|---|---|---|---|
| "Retry now" | `API-M17-17` `retry_now`, reason | Manual attempt beyond the auto-retry cap, logged; irreversible external actions reconcile by provider reference first (BP §10.3) | DOCUMENTED |
| "Switch to manual …" | `API-M17-17` `switch_to_manual`, reason | Affected entities moved to the owning team's manual queue | DOCUMENTED BP §12.3 |
| "Resume rule…" | opens `#m-resume` | — | DOCUMENTED |

Retry caps, backoff intervals and "owner digest if > n h" are samples → D-078 (rule configuration), D-138
(escalation).

### 7.6 Tab `#exceptions` — Exception queue

| Property | Value |
|---|---|
| Purpose | One queue for every exception type with entity reference, severity, age, assignee, due time, evidence, escalation path and recommended allowed actions; resolution needs a reason (BP §12.5) |
| Evidence | DOCUMENTED (BP §12.5, §12.6, §29.7, T31) · MOCKUP (anno "1A · R10 Exception queue: what, why, who, by when (§12.5)") |
| Route | NOT SPECIFIED — MK `#exceptions` |
| Sections / components | View segmented (All teams n / Owner-level n / Mine n / Overdue n); team select (Finance / Operations / Warehouse / Catalog / Branches / Returns desk — sample team list); table; link "Approval & exception ageing report →" (P-E13) |
| Table | Severity (icon + text: Critical / Serious / Warning / Resolved) · Exception · evidence (title + evidence summary) · Entity (reference + value) · Age · Assignee (avatar, name, team) · Due (text + colour; "Overdue …") · Escalation path (chain of roles) · Recommended actions (buttons) |
| Filters | `view` (all_teams, owner_level, mine, overdue), `team`, `severity`, `type` → `API-M17-05` |
| States | Resolved items shown muted with "Resolution reason: … · by … time" and "Reopen" (G-23; D-198); owner-level view shows only material exceptions (BR-M17-04) |
| Permissions | All operational roles for their team scope; R-owner owner-level; assign/escalate R-branch_manager+; resolve assignee |
| APIs | `API-M17-05`, `API-M17-06`, `API-M17-07` (assign, escalate, resolve with reason, log_callback, flag_recurring); recommended actions call their own domain endpoints (e.g. `API-M06-25`/`API-M10-*` reserve, `API-M11-09` refund, `API-M17-17` manual tracking, `API-M06-19` recount, `API-M06-23` adjust, `API-M20-03` notify, `API-M06-27` contact vendor, `API-M11-17` match, `API-M06-17` investigate); "Decide…" opens `#m-approve` for the linked approval |
| Backend / data | BR-M17-03, BR-M17-04, BR-M17-05, BR-M17-13; E-exception_case, E-approval_request |
| Related | P-E01 (owner exception overview), source screens of each exception |
| Phase · reqs | 1A · R10 · T31 |
| Status | REQUIRES_DECISION (D-138 severity/due/escalation) |

MK exception examples (samples) cover BP §12.5 cards: payment captured without confirmation, failed integration,
refund failure, low-margin override, stock mismatch (count variance), unresolved return (serial mismatch), overdue
dispatch, write-off above threshold, stale vendor data, import rows rejected, settlement unmatched, transfer
discrepancy. Thresholds shown ("floor 6 % · TBC", "> ₹25k (TBC)") are D-024 values.

### 7.7 Tab `#approvals` — Approvals (and modal `#m-approve`)

| Property | Value |
|---|---|
| Purpose | Decide pending approvals, seeing why approval is required, value, deadline, approver and alternate; separation of duties visible (BP §18.2 "Record why an approval was required … Set a deadline, alternate approver, escalation rule, and outcome") |
| Evidence | DOCUMENTED (BP §18.1, §18.2, §12.6) · MOCKUP (anno "1B · R06 Approvals: reason, deadline, alternate approver (§18.2)") |
| Route | NOT SPECIFIED — MK `#approvals`; modal `#m-approve` |
| Sections / components | View segmented (All n / Waiting on me n / Overdue / escalated n); type select (discount override, stock write-off, purchase order, price change, vendor content, refund, payout account — plus MK rows for refund method, dealer application, stock transfer); link "Settings → Approval thresholds" (P-E15#thresholds); table |
| Table | Type (icon + text) · Item · requested by (+ status badge e.g. "Awaiting call-back") · Why approval is needed · Value · Deadline (colour + text) · Approver → alternate ("Not set" flagged) · Decision ("Approve…" / "Reject…"; "Cannot self-approve" lock badge on own requests; "Log call-back" for payout-account changes) |
| Filters | `view` (waiting_on_me, overdue_escalated, all), `type` → `API-M17-01` |
| States | Own requests show the lock badge (X6); overdue rows show "escalated" approver; missing alternate highlighted |
| Permissions | Approvers with authority for type and value (D-024), active delegations (D-025); initiator ≠ approver (BP §18.2); payout account: finance checker after call-back (BP §11.5, §18.1) |
| APIs | `API-M17-01`, `API-M17-02`, `API-M17-03`, `API-M17-04` (bulk — not drawn in MK), `API-M17-07` `log_callback` (payout-account call-back via the linked exception/approval) |
| Backend / data | BR-M17-06, BR-M17-07, BR-M17-08, BR-M17-13, BR-M17-14, BR-M02-06; E-approval_request, E-approval_threshold, E-delegation |
| Related | Owning screens (P-E09 PO drawer, P-E12 refunds, P-E08 adjustments, P-E07 price lists, P-E11 submissions, P-E10 dealer applications), P-E15#thresholds, #delegation |
| Phase · reqs | 1B (queue) — 1A approvals can be decided from the owning screens (I-8; D-192) · R06, R10 · T31 |
| Status | REQUIRES_DECISION (D-024, D-025, D-179) |

| Field (`#m-approve` "Decision required") | Type | Req | Validation / source |
|---|---|---|---|
| Summary | read-only (type · item · value) | — | From the row |
| Reason (stored in the audit log) | textarea | Y for reject and overrides; recorded for approve (BP §18.2) | `reason` (`API-M17-03`; `422 REASON_REQUIRED`) |
| "This exception recurs — flag it for a policy/threshold review" | checkbox | N | `flag_recurring` (BP §12.6) |

Buttons "Reject" / "Approve" → `API-M17-03` (`decision`, `reason`, `flag_recurring`, `expected_version`). A
counter-offer (discount overrides, `counter_value`) is supported by the API but not drawn in MK.

### 7.8 Modal `#m-pauseall` — Pause automation

"Incident control (§20.4) · requires Owner or Ops admin · audited".

| Field | Type | Req | Validation / source |
|---|---|---|---|
| Mode | radio: "Non-critical only" (notifications, digests, reminders, suggestions and imports pause; payment webhooks, reservations and availability keep running) / "Incident mode — stop checkout-affecting automation" (checkout switched to "temporarily unavailable"; provider events stored and replayed after reconciliation) | Y | `mode` (`non_critical`, `incident`) — BP §20.4 step 3, BR-M17-16 |
| Reason | text | Y | `reason` |

"Pause" → `API-M17-14` `action=pause` → notified users listed (who may pause: D-194). Resume uses `API-M17-14` `action=resume` from the
health panel (control not drawn while "Global pause: off"). R-owner, R-ops_admin. Status NOT_STARTED.

### 7.9 Modal `#m-propose` — Propose an automation rule

| Field | Type | Req | Validation / source |
|---|---|---|---|
| Business problem (observable manual step) | textarea | Y | BP §12.1, §12.3 "Business problem" |
| Trigger | select (Event / Schedule / Threshold / Explicit user action) | Y | BP §12.3 "Trigger" |
| Owner role | select (Operations / Finance / Warehouse / Catalog / Support — sample) | Y | BP §12.3 "Owner" |
| Cases per month (observed) | number | Y | ≥ 0 (BP §12.4 formula input) |
| Minutes saved per case | number | Y | ≥ 0 (BP §12.4) |
| Human boundary — what the rule must never decide | text | Y | BP §12.3 "Human boundary" |

Callout "Phase 1 rules are deterministic. Suggestions that need judgement (compatibility answers, forecasting,
invoice OCR) are logged for Phase 2/3 review — not built as rules" (BP §12.1 "Avoid placing an LLM …"; A30/A31 P2,
A34 P3). "Submit proposal" → `API-M17-13` → 201 `{proposal_id}`. Any staff. Status NOT_STARTED.

### 7.10 Screen permissions (P-E14)

| Capability | Operational roles | R-branch_manager | R-finance | R-ops_admin | R-owner | Source |
|---|---|---|---|---|---|---|
| View rules / runs | rule owners | rule owners | read | Yes | Yes | API-M17-08, API-M17-15 |
| Stop / resume a rule | — | — | — | named reviewer | named reviewer | BP §12.3, §26.6 Q60 |
| Edit rule / request enable / dry run | rule owner (propose) | — | — | Yes | approve | API-M17-10, API-M17-11, API-M17-12 |
| Pause automation / incident mode | — | — | — | Yes | Yes | BP §20.4 |
| Work exceptions | own team | own branch + escalations | finance | all teams | owner-level | BP §12.5 |
| Decide approvals | per authority | within threshold | within policy | within threshold | high-value / owner-only | BP §18.1; D-024 |
| Propose a rule | Yes | Yes | Yes | Yes | Yes | BP §12.1 |

### 7.11 CONDITIONAL / MOCKUP-ONLY / LATER items (P-E14)

| Item | Label | Decision |
|---|---|---|
| Rules marked 1B (A01, A08, A21, A36) and pilot rules | per BP §12.2 priority | D-078, D-048 |
| Staging dry-run with masked inputs | MOCKUP | D-077, D-136 |
| Hours-saved chart | DOCUMENTED method (BP §12.4) · values estimates | — |
| AI-assisted rules (forecast A30, OCR A31, assistant A34) | LATER | — |
| General workflow designer | excluded (BP §5.3, §15.6) | D-221 |

---
## 8. P-E15 — Settings, roles & audit (`erp-admin.html`)

### 8.0 Summary card

| Property | Value |
|---|---|
| Purpose | Administration: staff users (individually attributable, MFA, record scope), roles and the BP §18.1 authority matrix, separation-of-duties rules, approval thresholds, delegation and emergency access, company and locations (bins), integrations (status, masked credentials, contract checklist), audit log, system status (environments, backups/restore, alerts, retention matrix, support model) (BP §18, §19.1, §19.3, §20.1, §20.3, §24.1, §16.4; BP §30.1 "Administration: Users, roles, approval thresholds, integrations, templates, audit logs") |
| Evidence | DOCUMENTED (BP §3.3, §9.5, §12.6, §16.4, §18.1, §18.2, §19.1, §19.3, §20.1, §20.3, §24.1, §24.3) · MOCKUP (layout, contract checklist, access review) |
| Route | NOT SPECIFIED — MK `erp-admin.html` tabs `#users`, `#roles`, `#thresholds`, `#delegation`, `#locations`, `#integrations`, `#audit`, `#system`; drawer `#d-audit`; modals `#m-invite`, `#m-thr`, `#m-ea`. Shell user-menu "Delegation while away" → `#delegation`; shell help → this screen (04b) |
| Module / folder | M24, M02, M03, M17 (thresholds, delegation), M26 (status data) · `frontend/workspace/` if D-004 = custom |
| Phase · reqs | 1A (BP §5.1 "access controls") · R06, R10, R17, R18 · T11, T22, T28, T31 · WP05, WP17 · BP §15.3 proof scenario 9 |
| D-004 native-vs-custom considerations | (1) Users, roles/permissions and audit trails are native in the core candidates; BP §15.6 "Use platform configuration before custom code" applies strongly. (2) Thresholds × role, delegation with scoped limits, emergency access with post-review (BP §12.6, §18.2) and the integration contract checklist (BP §16.4) are plan-specific records (E-approval_threshold, E-delegation, E-integration_setting). (3) Location and bin masters are native ERP concepts (BP §9.5, §9.6). (4) Administration is low-frequency; BP §30.1 "Do not reproduce every ERP screen merely to match the storefront branding" applies. (5) Audit tamper-resistance depends on platform capabilities (D-114). **Not decided — D-004.** |
| Roles | R-owner, R-ops_admin (full); R-finance (thresholds, finance audit); R-branch_manager (limited team scope if delegated; own-branch audit; access-review reviewer); all staff (emergency-access request; status summary) — detail §8.12 |
| Status | REQUIRES_DECISION (D-004, D-101, D-222, D-040) |

### 8.1 Page header and KPI strip

| Element | Content | API | Label · status |
|---|---|---|---|
| "Start access review" | Starts a periodic review; accounts assigned to managers ("AR-… started · n accounts assigned") | `API-M02-28` | MOCKUP (BP §24.3 "access review", §20.1) |
| "Invite user" | Opens `#m-invite` | — | DOCUMENTED BP §18.2 |
| KPIs | Staff accounts (active · invited); MFA enrolled (n / N; in grace period); Privileged (count, role names); Delegation (active delegate until …); Integrations (count; degraded; stale feed); Restore test (result, duration vs target) | G-25 (partial: `API-M02-20`, `API-M17-20`, `API-M24-03`, `API-M24-08`) | MOCKUP · RTO target D-034 |

The manager-side access-review screen (confirm/revoke per account, `API-M02-29`) is not drawn in MK; it is
listed here as required by `API-M02-28` and implemented with the 04b decision-row pattern (status NOT_STARTED).

### 8.2 Tab `#users` — Users

| Property | Value |
|---|---|
| Purpose | Manage staff accounts: roles, location scope, MFA state, sessions, status (BP §18.2 "least privilege, record-level scope … MFA for privileged accounts … Separate user administration from ordinary warehouse work") |
| Evidence | DOCUMENTED (BP §18.1 "Edit permissions", §18.2, §20.1 "Privileged access: MFA and individually attributable accounts") · MOCKUP (anno "1A · R06 Individually attributable accounts, MFA, record scope (§18.2)") |
| Route | NOT SPECIFIED — MK `#users` |
| Sections / components | Search "Search name, email, role…"; role select; location select; chips "MFA issues n", "Privileged n"; link "Vendors" (vendor users are managed in P-E11 / P-V04, not here); bulk bar (Force sign-out, Require MFA re-enrolment, Deactivate…); table; count "Showing n of N accounts · active · invited · deactivated" |
| Table | ☐ · User (avatar, name, email) · Role (role labels; "Privileged" badge; "SoD post-review" badge for accepted conflicts) · Location scope · MFA (method + state: enrolled / weaker method warning / not enrolled with grace end / pending / revoked) · Last sign-in (time + device/IP/location; failed attempts) · Status (Active / Active · delegate until … / Temporary · expires … / Invited · link expires … / Deactivated · sessions revoked) · Actions (Edit roles, Reset MFA, Sign out everywhere; Resend for invited; Reactivate… for deactivated) |
| Filters · search | `q`, `role`, `location`, `flag` (mfa_issues, privileged), `status` → `API-M02-20` |
| States | Empty "No users match — Clear the filters to see all accounts" (MK) |
| Permissions | R-owner, R-ops_admin; R-branch_manager own team only if delegated (BP §18.1); no self-elevation (BR-M02-15) |
| APIs | `API-M02-20`, `API-M02-22` (edit roles/scope/expiry — privileged change → 202 second approver), `API-M02-23` (force_sign_out, require_mfa_reenrolment, reset_mfa with identity-check reference), `API-M02-24` (deactivate / reactivate — reactivation owner approval), `API-M02-18` (resend invitation), `API-M02-19` (cancel invitation) |
| Backend / data | BR-M02-03, BR-M02-04, BR-M02-05, BR-M02-06, BR-M02-15; E-user_account, E-user_role_assignment, E-role, E-invitation, E-user_session (CONDITIONAL D-083), E-audit_event |
| Related | `#roles`, `#delegation`, P-E11 (vendor users), shell "Security & MFA" (04b §3.3) |
| Phase · reqs | 1A · R06 · T22, T30 |
| Status | REQUIRES_DECISION (D-040 MFA methods, D-083 sessions, D-222 role labels) |

| Control | API | Result / guard | Evidence |
|---|---|---|---|
| "Edit roles" (row) | `API-M02-22` (roles[], location_scope[], access_expires_at?, reason, expected_version) | Role editor; privileged changes need a second approver (202) | DOCUMENTED BP §18.1; MK |
| "Reset MFA" (row) | `API-M02-23` `reset_mfa` + `identity_check_ref`, reason | "identity check required" (MK) | MOCKUP |
| "Sign out everywhere" (row) / "Force sign-out" (bulk) | `API-M02-23` `force_sign_out`, reason | Sessions revoked | MOCKUP · D-083 |
| "Require MFA re-enrolment" (bulk) | `API-M02-23` `require_mfa_reenrolment` | At next sign-in | MOCKUP |
| "Deactivate…" (bulk) | `API-M02-24` `status=deactivated`, reason (required) | Sessions revoked, records kept | MOCKUP |
| "Reactivate…" | `API-M02-24` `status=active`, reason | Owner approval (202) | MOCKUP |
| "Resend" (invited) | `API-M02-18` | New expiry | MOCKUP |

### 8.3 Modal `#m-invite` — Invite a staff user

Static text: "Individual account · no shared logins · invite link expires in n h" (BP §18.2; expiry sample → D-083).

| Field | Type | Req | Validation / source |
|---|---|---|---|
| Full name | text | Y | — |
| Work email | email | Y | Unique among staff accounts |
| Mobile (for OTP fallback) | tel (+91 prefix sample, D-059) | N | Format; OTP fallback per D-040/D-015 |
| Role | select | Y | Role catalogue (`API-M02-25`); privileged roles flagged; note "Privileged roles need a second approver and app-based MFA" (BP §18.2); cannot grant above own authority (`API-M02-21`); role list labels → D-222 |
| Location scope | checkbox list of locations | Y (non-global roles) | Active locations (`API-M03-02`) |
| Access expires | date | N | Future date (seasonal staff) |
| MFA | select (authenticator app / security key — sample options) | Y for privileged | Methods per D-040 |

"Send invite" → `API-M02-21` → 201 `{invitation_id, expires_at}` (or approval for privileged roles). Status
REQUIRES_DECISION (D-040).

### 8.4 Tab `#roles` — Roles & permissions

| Property | Value |
|---|---|
| Purpose | Show the authority matrix, roles, record-scope rules and separation-of-duties controls; create/change roles under approval (BP §18.1, §18.2) |
| Evidence | DOCUMENTED (BP §18.1, §18.2, §19.1) · MOCKUP (anno "1A · R06 Authority matrix (blueprint §18.1)", "§18.2 Separation of duties") |
| Route | NOT SPECIFIED — MK `#roles` |
| Sections / components | "Permission matrix" (note "enforced on the server for every operation, not just hidden in the UI"; legend Allowed / Limited — condition shown / Not allowed; "New role"); matrix table; "Roles" list ("n staff roles + vendor role": name, note, Privileged badge, user count); "Record-scope notes" list; "Separation of duties" list ("Checked when roles are assigned and on every approval"): rule · status (Enforced / Warn / Accepted) with conflict details and post-review owner |
| Table — matrix | Action · Staff (n) · Manager (n) · Finance (n) · Owner / admin (n) · Vendor (external · n). Rows 1–9 = BP §18.1 verbatim (create product draft, publish new product, record matching receipt, adjust stock, change dealer tier, initiate refund, change payout account, export customer data, edit permissions); rows marked "added" in MK (view supplier cost & margin; pause an automation rule; manage integrations & secrets) are MOCKUP extensions (I-10) |
| Record-scope notes (MK) | branch managers & staff → own location (company-wide availability read-only); warehouse → own-site tasks, no prices or customer phone beyond the shipping label; support → verified order lookup, masked contact until verified, never payment instruments; finance → all locations for payments/refunds/settlements, personal data only for a finance purpose; vendors → own records only with object-level checks; sensitive fields (supplier cost, margin, bank accounts, identity documents) hidden unless allowed, every identity-document view logged — BP §3.1, §13.4, §18.2, §19.1; masking policy D-153 |
| Separation-of-duties rules (MK) | requester cannot approve own request (discounts, refunds, write-offs, price changes) — BP §18.2; user admin separate from warehouse work — BP §18.2; payout account maker & checker + call-back — BP §11.5, §18.1; price-list editor cannot approve — MOCKUP; PO creator should not receive the goods (warn; small branches may combine with post-review) — MOCKUP (D-196); accepted conflicts with monthly post-review — MOCKUP (D-196) |
| Permissions | View R-owner, R-ops_admin; R-branch_manager read; changes R-owner/R-ops_admin with second approver |
| APIs | `API-M02-25`, `API-M02-26` ("New role" → draft + approval), `API-M02-27` (change permissions → approval) |
| Backend / data | BR-M02-15, BR-M02-18, BR-M02-06; E-role, E-permission, E-role_permission, E-approval_request |
| Related | `07-auth-roles-permissions.md` (permission keys) |
| Phase · reqs | 1A · R06 · T11, T13 |
| Status | REQUIRES_DECISION (D-222, D-196, D-175) |

### 8.5 Tab `#thresholds` — Approval thresholds (and modal `#m-thr`)

| Property | Value |
|---|---|
| Purpose | Show and change approval limits per control and role, deadlines/escalation, and pending threshold changes (BP §18.1 "Exact monetary thresholds must be supplied by the client"; §18.2 deadlines, alternates, escalation, bulk review) |
| Evidence | DOCUMENTED (BP §18.1, §18.2, §12.6) · MOCKUP (anno "§18.1 Exact ₹ limits must come from the client") |
| Route | NOT SPECIFIED — MK `#thresholds` (tab label shows "TBC") |
| Sections / components | Warning callout "All values are placeholders — to be confirmed by the client … not enforced as approved until signed off … Until then the system routes these cases to the owner" (default routing is a MOCKUP proposal → D-024; I-9); thresholds table with per-row edit (→ `#m-thr`); "Deadlines & escalation" card (default deadline; on expiry escalate once to named alternate; still pending → owner digest, never auto-approved; working hours; bulk review allowed with individual decisions; recurrence → policy review); "Pending change" card (proposer, time, "needs second approver", field · current · proposed, effective, reason) |
| Table | Control (name + basis) · Staff · Branch manager · Ops admin · Finance · Owner · Status ("TBC by client" / "Agreed <date>") — MK controls: stock adjustment, discount off list price, margin floor, refund outside auto-policy, write-off, price change, purchase order value, stock transfer value, refund within auto-policy |
| Permissions | View R-owner, R-ops_admin, R-finance; propose R-owner, R-finance; second approver ≠ proposer |
| APIs | `API-M17-18`, `API-M17-19` (propose), `API-M17-03` (second approver decides the pending change), `API-M24-01`, `API-M24-02` (deadline/escalation settings as configuration) |
| Backend / data | BR-M17-06, BR-M17-07, BR-M17-13, BR-M17-14, BR-M24-01, BR-M24-03; E-approval_threshold, E-approval_request, E-configuration_version |
| Related | P-E14#approvals, P-E09 PO tiers, P-E07 discount authority |
| Phase · reqs | 1A · R06, R10 · T31 |
| Status | REQUIRES_DECISION (D-024, D-179) |

| Field (`#m-thr` "Change approval threshold") | Type | Req | Validation / source |
|---|---|---|---|
| Control | read-only (control · role) | — | From the row |
| New limit | number / money / % by control | Y | Value schema per control |
| Effective from | datetime | Y | Future; timezone D-124 |
| Second approver | select (users with authority) | Y | ≠ proposer (`API-M17-19`) |
| Reason | textarea | Y | Audited |

Callout "Placeholder values are for discussion. A change takes effect only after a second approver confirms it, from
the effective date, and is audited." "Propose change" → `API-M17-19` → 202 `{approval_request_id}`.

### 8.6 Tab `#delegation` — Delegation & emergency access (and modal `#m-ea`)

| Property | Value |
|---|---|
| Purpose | Owner-away delegation to a named alternate with explicit, scoped, time-bounded authority; emergency access with post-event review (BP §12.6, §18.2; T31) |
| Evidence | DOCUMENTED (BP §12.6, §18.2, §29.7) · MOCKUP (anno "1A · R10 Owner-away delegation: named, time-bounded, scoped (§12.6)", "§18.2 Emergency access: time-bounded + post-review") |
| Route | NOT SPECIFIED — MK `#delegation`; shell user menu "Delegation while away" |
| Sections / components | **Active delegation card**: delegator → delegate, id, window, reason, status "Active · n h left"; "Delegated" list (discounts up to n % — margin floor still applies; write-offs & adjustments ≤ …; refunds within policy; POs ≤ …; dealer applications); "Stays with owner" list (permission & role changes; payout/bank account changes; list-wide price changes; integrations & secrets; anything above the delegated limits); decisions made under delegation (tagged "delegated" in the audit log; owner still receives digest and urgent items); "Ends automatically · no silent owner-level access"; "Extend…", "End now". **Create a delegation** form. **Emergency access** card: rules (maximum duration, specific scope, reason required, auto-expiry; granted by owner or ops admin, never self-granted, no shared admin password; every action tagged EMERGENCY; post-event review within n working days), "Request" (→ `#m-ea`), table Request · Window · Post-review ("Review" action). **Delegation history** table Delegation · Window · Decisions · Review |
| Permissions | Create: delegator for own authority (R-owner, managers); extend: owner approval; emergency access request: any staff; grant: R-owner, R-ops_admin (≠ requester); post-review: R-owner, R-ops_admin |
| APIs | `API-M17-20`, `API-M17-21`, `API-M17-22` (extend, end_now, post_review_complete), `API-M17-23`, `API-M17-24`, `API-M02-30` (actions tagged delegated/emergency) |
| Backend / data | BR-M17-08, BR-M17-09, BR-M02-07; E-delegation, E-approval_request, E-audit_event |
| Related | P-E14#approvals (alternates), P-E01 |
| Phase · reqs | 1A · R10 · T31 |
| Status | REQUIRES_DECISION (D-025) |

| Field (Create a delegation) | Type | Req | Validation / source |
|---|---|---|---|
| Delegate to | select (named staff) | Y | ≠ delegator; active user |
| Reason | text | Y | — |
| From | datetime | Y | ≥ now |
| Until | datetime | Y | > From; maximum duration sample ("max 14 days") → D-025 |
| Discounts up to | checkbox + % | N | ≤ delegator's own limit (BR-M17-08) |
| Write-offs ≤ | checkbox + money | N | ≤ delegator's own limit |
| Refunds within policy | checkbox | N | — |
| Purchase orders ≤ | checkbox (+ limit) | N | ≤ delegator's own limit |
| Vendor content approvals | checkbox | N | — |
| Permissions / payouts / secrets | checkbox **disabled** | — | Never delegable (MK; BP §12.6 "Do not silently convert owner-only rules into unrestricted access") |
| Notify finance and branch managers | checkbox | N | `notify[]` |

"Schedule delegation" → `API-M17-21` → 201.

| Field (`#m-ea` "Request emergency access — time-bounded · reviewed afterwards") | Type | Req | Validation / source |
|---|---|---|---|
| Scope | select (stock adjustments at one location / refund retry — failed refunds only / order release from hold) | Y | Scope list sample (D-025) |
| Duration | select (up to a maximum — sample "4 hours") | Y | ≤ maximum (D-025) |
| Reason | textarea | Y | BP §18.2 |
| Approver | select (owner / ops admin; "app approval") | Y | ≠ requester (BP §18.2) |

"Send request" → `API-M17-23` → 202 `{request_id, approval_request_id}`.

### 8.7 Tab `#locations` — Company & locations

| Property | Value |
|---|---|
| Purpose | Company (selling organisation) details and locations with capabilities and bins (BP §3.3 "Store those relationships explicitly", §9.5, §9.6) |
| Evidence | DOCUMENTED (BP §3.3, §9.5, §9.6) · MOCKUP |
| Route | NOT SPECIFIED — MK `#locations` |
| Sections / components | **Company** card: legal name, trade name, GSTIN (verified), PAN, CIN, registered office, financial year, invoice-series pattern (D-055), grievance officer (D-037), currency · tax (D-059); "Edit" (owner only, second approver); note "Separate businesses later (R15): not configured …" (D-045 LATER). **Locations** table + "Add location". **Bins** card for the selected location: "Print labels", "Add bin", bins table |
| Table — locations | Location (name, code, type) · Address · Capabilities (badges: ships online orders, receives POs, QC & returns, walk-in POS, click & collect, demo units, ships local orders) · Bins · Manager · Status (Live / "Legacy POS until … · segregated stock allocation" — D-009, D-030) |
| Table — bins | Bin · Zone · Disposition · Units · SKUs · Last count (date · variance) · Status (Open / Locked for picking · count variance) |
| Permissions | View all staff (company), R-owner/R-ops_admin (locations full); edit company R-owner + second approver; add/edit locations R-owner, R-ops_admin; bins R-ops_admin, R-owner, R-branch_manager (loc); labels R-warehouse_staff (loc), R-ops_admin |
| APIs | `API-M03-08`, `API-M03-09`, `API-M03-02`, `API-M03-03`, `API-M03-04`, `API-M03-05`, `API-M03-06`, `API-M03-07` |
| Backend / data | BR-M03-01…06; E-company, E-location, E-location_bin |
| Related | P-E08 (stock by bin, counts), shell location switcher (04b §3.2), P-S13 stores |
| Phase · reqs | 1A · R14 · WP08 |
| Status | REQUIRES_DECISION (D-010 seed data, D-037 GST place-of-business check, D-061 click & collect capability) |

| Control | API | Result / guard | Evidence |
|---|---|---|---|
| Company "Edit" | `API-M03-09` (fields, reason, expected_version) | 202 second approver | MOCKUP (BR-M03-06) |
| "Add location" | `API-M03-03` | Draft; GST place-of-business check before activation | MOCKUP · D-037 |
| Location row edit (status/capabilities) | `API-M03-04` | Deactivation blocked while stock or open tasks exist (BR-M03-05) | DOCUMENTED (derived) |
| "Add bin" | `API-M03-06` | Unique code per location | MOCKUP |
| "Print labels" | `API-M03-07` | Label document (QR) — printer/label format D-110, D-111 | MOCKUP |

### 8.8 Tab `#integrations` — Integrations

| Property | Value |
|---|---|
| Purpose | Status, last sync, masked credentials, health, fallback and owner per integration; connection tests; write-only credential rotation with second approver; logs; planned integrations; integration contract checklist (BP §16.4, §19.1) |
| Evidence | DOCUMENTED (BP §16.4 integration contract, §19.1 secrets) · MOCKUP (anno "1A/1B · R18 Integrations: status, last sync, masked credentials, health") |
| Route | NOT SPECIFIED — MK `#integrations` |
| Sections / components | "Test all"; integration cards (name, provider — samples, status pill, owner, alert with link to the failed job, last sync, masked credential key-values with rotation due, success 24 h meter, fallback text; buttons Test · Rotate · Logs); "Planned integrations" card ("Not active — each needs its §16.4 contract, sandbox access and an owner before go-live": second courier (1B), e-invoice / e-way bill (TBC), marketplace seller settlements (Phase 2), mobile app push (Phase 2)) + "Request integration"; "Integration contract checklist" table |
| Table — contract checklist | Requirement (authentication; entity mapping & source of truth; idempotency; retries, timeouts, rate limits; reconciliation; support owner named; fallback tested) × integration (payment, courier, WhatsApp, email/SMS, accounting, legacy ERP/POS, supplier feeds) → Done / In progress |
| Permissions | R-owner, R-ops_admin; R-finance for payment/accounting; secrets never returned by any API (BR-M24-02) |
| APIs | `API-M24-03`, `API-M24-04`, `API-M24-05`, `API-M24-06`, `API-M24-07` |
| Backend / data | BR-M24-02, BR-M02-11, BR-M02-12; E-integration_setting, E-integration_event, E-change_request, E-api_credential (CONDITIONAL D-083) |
| Related | P-E14#runs (failed jobs), P-E12 (payment/settlement), P-E11#freshness (supplier feeds) |
| Phase · reqs | 1A / 1B · R18 |
| Status | REQUIRES_DECISION (D-012, D-013, D-014, D-015, D-011, D-009, D-107) |

| Control | API | Result / guard | Evidence |
|---|---|---|---|
| "Test" / "Test all" | `API-M24-04` (all?) | No side-effecting calls | MOCKUP |
| "Rotate" | `API-M24-05` (new_secret write-only, reason) | 202 second approver; separate per environment | DOCUMENTED BP §19.1 |
| "Logs" | `API-M24-06` | Credentials and payment data redacted | MOCKUP |
| "Request integration" | `API-M24-07` | Change request (BP §25.5; register placement D-191) | DOCUMENTED |

### 8.9 Tab `#audit` — Audit log (and drawer `#d-audit`)

| Property | Value |
|---|---|
| Purpose | Search audit events (actor, action, object, before → after, reason, IP/device) and inspect one event (BP §17.3, §19.1, §14.3 "Audit export", §20.1 auditability) |
| Evidence | DOCUMENTED (BP §14.3, §17.3, §19.1, §20.1) · MOCKUP (anno "1A · R06 Audit log: actor, action, object, before → after, reason") |
| Route | NOT SPECIFIED — MK `#audit`; drawer `#d-audit` |
| Sections / components | Search "Search actor, object, reason…"; actor select (users + System); object-type select (Access / Stock / Price / Order / Automation / Security / Export); period segmented (Today / 7 days / 30 days / Custom…); "Export"; table; count "n events shown · N events today"; drawer: event id, object type, title, subtitle (time with timezone, actor, object); key-values (actor, object, reason, IP · device, session); "Change" diff (Field · Before · After); "Event record" (structured payload incl. previous-hash / hash in MK); callout "Tamper-evident: each event stores the hash of the previous event. A broken chain raises a Critical security alert." (mechanism D-114); "All events for this object"; "Close" |
| Table | Time · Actor (avatar, name, role / "Delegated" / rule id / "Unknown") · Action (security events flagged by colour + text) · Object (+ type badge) · Before → after · Reason · IP · device |
| Filters · search | `actor`, `object_type`, `object_id`, `action`, `from`, `to`, `q` → `API-M02-30` |
| States | Empty "No events match — Widen the date range or clear filters" (MK); sensitive before/after values masked unless permitted (BP §17.3) |
| Permissions | R-owner, R-ops_admin all; R-finance finance objects; R-branch_manager own-branch objects (`API-M02-30`); viewing the log is itself logged (MK sample — D-114) |
| APIs | `API-M02-30`, `API-M18-03` (dataset `audit_log`) |
| Backend / data | BR-M02-08; E-audit_event |
| Related | P-E13 audit-export report, P-E14 rule history |
| Phase · reqs | 1A · R06 · T31 |
| Status | REQUIRES_DECISION (D-114, D-152) |

### 8.10 Tab `#system` — System

| Property | Value |
|---|---|
| Purpose | Operational status for owner/ops: environments, backups and restore evidence, alert routing, retention matrix, support model and maintenance calendar (BP §16.6, §19.3, §20.1, §20.3, §20.5, §21.4, §24.1, §24.3) |
| Evidence | DOCUMENTED (BP §16.6, §19.3, §20.1, §20.3, §24.1, §24.3) · MOCKUP (anno "§20.1 Backups, RPO/RTO & restore rehearsal", "§19.3 Data retention matrix (proposed)") |
| Route | NOT SPECIFIED — MK `#system` |
| Sections / components | **Environments**: note "Production and staging are separate accounts with separate credentials" (BP §16.6); per environment: status, domain + hostnames (samples, D-102), version, release and approver, data (live / masked copy — D-136), admin access ("MFA + IP allow-list" — IP allow-list MOCKUP-ONLY, D-177); feature flags list (D-077); change-freeze callout (sample). **Backups & restore**: "Stored outside the primary runtime · encrypted · separate account" (BP §16.6; D-108); tiles last full backup, point-in-time logs (RPO vs target), last restore rehearsal (duration vs RTO target) with evidence reference; callout "A database restore never silently rolls back orders or payments taken after the snapshot — they are exported and reconciled first" (BP §20.5, §21.4); retention, next rehearsal, runbook link; "Schedule test". **Monitoring & alerts** table (Alert · Condition · Route (page / exception queue / daily review) · Owner · Last fired) — BP §20.3 "Assign an owner to every alert. Page only for urgent customer/revenue/stock risk" (alert catalogue D-195). **Data retention matrix** table (Data · Purpose · Access · Retention · Deletion / anonymisation · Exceptions), "Proposed — TBC by client". **Support & maintenance**: support hours, severity table (Severity · Example · Response — "Target TBC"), maintenance calendar list |
| Permissions | R-owner, R-ops_admin full; all staff see only the summary used by the shell health card (`API-M24-08 summary_only`) |
| APIs | `API-M24-08`, `API-M24-09` ("Schedule test") |
| Backend / data | BR-M24-01; M26 data (backups, alerts); E-configuration_version |
| Related | shell system-health card (04b §3.1), P-E14 health panel |
| Phase · reqs | 1A · R17, R18 · T28 · WP05, WP17 |
| Status | REQUIRES_DECISION (D-052, D-005, D-034, D-035, D-036, D-108) |

All figures on this tab (RPO/RTO values, alert thresholds, retention periods, support hours, maintenance cadence,
hostnames) are samples → D-034, D-052, D-036, D-035, D-102.

### 8.11 Items not drawn in the mockup but required by this screen's APIs

| Item | API | Source | Status |
|---|---|---|---|
| Access-review reviewer view (confirm / revoke / change per account) | `API-M02-29` | BP §24.3, §20.1 | NOT_STARTED |
| Cancel pending invitation | `API-M02-19` | MK:store-dealer.html#team pattern | NOT_STARTED |
| Document templates (invoice, credit note, packing slip) — BP §30.1 lists "templates" under Administration; MK places message templates in P-E05#library only | none | BP §30.1, A12; D-055 | REQUIRES_DECISION (D-055) |

### 8.12 Screen permissions (P-E15)

| Capability | R-owner | R-ops_admin | R-finance | R-branch_manager | Other staff | Source |
|---|---|---|---|---|---|---|
| Users: invite / edit roles / security actions | Yes | Yes (privileged → second approver) | — | own team if delegated | — | BP §18.1 |
| Roles & permission changes | approve | propose | — | read | — | BR-M02-15 |
| Thresholds | propose / approve | view | propose / approve | — | — | API-M17-18, API-M17-19 |
| Delegation | create (own authority) | create (own authority) | own authority | own authority | — | BP §12.6 |
| Emergency access | grant, post-review | grant, post-review | request | request | request | BP §18.2 |
| Company edit | Yes (+ second approver) | — | — | — | — | BR-M03-06 |
| Locations / bins | Yes | Yes | — | bins (loc) | labels (warehouse, loc) | API-M03-* |
| Integrations (test / rotate / logs) | Yes | Yes | payment/accounting read | — | — | API-M24-* |
| Audit log | all | all | finance objects | own-branch objects | — | API-M02-30 |
| System status | full | full | — | summary | summary | API-M24-08 |

### 8.13 CONDITIONAL / MOCKUP-ONLY / LATER items (P-E15)

| Item | Label | Decision |
|---|---|---|
| Added matrix rows beyond BP §18.1 | MOCKUP | D-222 / 07-auth |
| "Route to owner until thresholds are signed off" | MOCKUP proposal | D-024 |
| Hash-chained audit events | MOCKUP (option) | D-114 |
| Admin IP allow-list | MOCKUP-ONLY | D-177 |
| Planned integrations (second courier 1B, e-invoice/e-way bill, marketplace settlements, mobile push) | CONDITIONAL / LATER | D-013, D-037, D-046, D-085 |
| Separate businesses (R15) | LATER | D-045 |
| Staff mobile app sessions in sample audit rows | not in scope | D-085 (00-conventions §12 #10) |

---
## 9. Vendor portal application (`frontend/vendor-portal/`)

### 9.1 Application summary, structure and data-isolation rules

| Property | Value |
|---|---|
| Purpose | Restricted vendor workspace where approved suppliers submit product data and availability, see POs issued to them, handle pilot fulfilment tasks and returns to vendor, and maintain their profile, users, documents, terms and payout-account change requests — always limited to their own organisation's records (BP §11.2; PR1 §3 "Vendor Experience"; PR2 §5; MEET "role-based access and an approval step before product data enters the live database") |
| Evidence | DOCUMENTED (BP §3.1, §3.2, §11.1–11.3, §17.4, §19.1, T11–T14) · MOCKUP (4 screens + vendor shell) · LATER (marketplace previews, D-046) |
| Phase | **1B** (BP §5.1 "Controlled vendor portal"; R05; WP13). Admin-created vendor accounts and submissions are 1A = C (BP §5.2). Whether 1B ships at first public launch: D-048 |
| Roles | R-supplier (approved vendor user), R-vendor_applicant (applicant — profile/documents/application status only), R-integration (vendor API key — availability and submissions only); R-seller LATER. Vendor-organisation sub-roles (MK: Admin / Catalog / Operations / Accounts) → D-137 |
| Framework / deployable / hostname | REQUIRES_DECISION (D-101 framework; D-102 deployable & hostname — MK sample "vendors"; D-103 design-system technology; D-049 visual sign-off) |
| Routes | NOT SPECIFIED — MK files `vendor-dashboard.html`, `vendor-products.html`, `vendor-availability.html`, `vendor-account.html` with `#tab` hashes; production routes follow D-101 |
| Status | REQUIRES_DECISION (D-101, D-102, D-048, D-047, D-137) |

**Logical structure** (grouping mirrors P-V01–P-V04; physical folder and file naming follows the framework chosen
under D-101 — nothing below fixes a technology):

| Logical part | Contents | Source |
|---|---|---|
| App shell | Vendor shell (§9.2): sidebar, org card, nav with badges, search, "Submit product", notifications, help, user menu | MK `assets/tradex.js` `buildWorkspaceShell("vendor")`, VENDOR_NAV |
| Session & scope | Load principal and vendor scope (`API-M02-01`, `API-M14-02`); expose approval state (applicant / approved / suspended), permitted categories/locations, vendor sub-role (D-137) to screens; sign-out (`API-M02-06`) | BP §11.1; 06-api §1.2 `VEN` |
| Screens | `dashboard` (P-V01) · `products` (P-V02: listings, submissions, new submission, bulk upload) · `availability` (P-V03: feed, POs, pilot tasks, returns) · `account` (P-V04: profile, documents, users, statements, terms, bank, marketplace notice) | MK |
| API client | Typed client for the vendor-scoped operations `API-M14-02…44`, plus `API-M02-*` (own security), `API-M20-01`, `API-M20-02` (notifications), `API-M21-03` (search), `API-M22-01…03` (files) — no staff endpoints are callable from this app | 06-api §1.1 rule 6 (`/v1/vendor/...` family) |
| Shared UI | Components and tokens from `frontend/design-system/` (vendor accent token `--vendor`) | 02-architecture §4.5; D-103 |
| Pages outside the mockup (required) | Vendor sign-in with MFA, invitation acceptance (set credentials, terms acceptance), password reset, own "Security & MFA" page — no MK screen (06-api API-M02-04 "staff & vendor sign-in (no mockup screen)"); apply the same approach as the workspace pages outside the mockup (04b §3.3a) and the storefront sign-in (P-S12) | API-M02-04, -05, -07, -08, -12, -13, -16, -17; D-040 |
| Tests | Cross-vendor access (T11), draft never purchasable (T12), sensitive edit review (T13), stale feed (T14), proof scenarios 6 and 9 — suites in `tests/` (D-053) | BP §23.1, §15.3 |

**Data-isolation rules (every P-V screen)** — BP §3.1 "Approved supplier: own records; no competitor costs or
company margins", §11.2 "Share only the data needed for its fulfilment role", §19.1 / T11 object- and property-level
authorisation:

| # | Rule | Source |
|---|---|---|
| V1 | The vendor organisation is derived from the session only; no screen sends a vendor/seller/supplier id as a filter or body field, and any such value would be ignored by the API | BP §17.4; 06-api §1.4 (`seller_id`) |
| V2 | Every list is implicitly "own organisation"; there is no organisation selector. A record id from another vendor (typed into the URL or found elsewhere) yields a generic "not found" page with no hint that it exists | BP §19.1, T11; 06-api §1.3 (404) |
| V3 | Never rendered: Tradex retail/dealer prices, margins, Tradex costs, Tradex stock positions, other vendors' products, prices, stock, costs or scores (MK:vendor-dashboard.html "What you can see"; MK:vendor-products.html "Retail prices are set by Tradex and are not shown") | BP §3.1, §11.2 |
| V4 | Minimum customer data for supplier-fulfilment tasks: recipient name as returned (MK shows first name + initial), city/state, **masked** phone and **masked** PIN; the full address appears only on the courier label document; customer data is hidden once a task expires or is reassigned (MK:vendor-availability.html#tasks, anno "§11.2 Minimum customer data: name, city, masked phone/PIN"). Exact field set → D-007/D-153 (I-6) | BP §11.2 |
| V5 | Returns to vendor show unit, serial and evidence only — "Customer identity is never shared" (MK); a customer RMA reference may be shown as the source | BP §11.2 |
| V6 | Protected approval fields (permitted categories, permitted locations, supply model, terms version, freshness deadline, verified legal/tax details, approval record) are read-only; changes only through `API-M14-34` change requests | BP §11.3, §19.1, T13; BR-M14-10 |
| V7 | Applicant state (R-vendor_applicant): product submission, availability and PO areas are disabled with the explanation "Applicant, not an activated supplier …" (MK); profile, documents and application status remain available | BP §3.1, §11.1 |
| V8 | Suspended state: new submissions and changes blocked, offers paused; open POs, returns and statements remain visible (MK; BP §11.1); full effect list D-189 | BP §11.1; BR-M14-04 |
| V9 | Vendor sub-role gating (MK role matrix, D-137): Catalog → products/submissions/bulk; Operations → availability, API key, POs/ASN, pilot tasks, returns; Accounts → statements, bank change (maker); Admin → all incl. users, terms acceptance, bank change checker. UI hides/disables; server enforces | MK:vendor-account.html#users; D-137 |
| V10 | All vendor responses are private and never cached under shared keys; sign-out clears in-memory data and returns to the sign-in page | 06-api §1.11; BR-M02-13 (analogous to T22) |
| V11 | Private files (labels, invoices, documents, evidence photos) are opened only through authorised file access (`API-M22-02`) scoped to the organisation | BP §19.1; API-M22-02 |
| V12 | Vendor search (`API-M21-03`) returns only the vendor's own products, POs and submissions | 06-api API-M21-03 |

### 9.2 Vendor shell (`assets/tradex.js` `buildWorkspaceShell` with `app = "vendor"`)

| Element | Content (MK) | API | Evidence · status |
|---|---|---|---|
| Brand | Logo mark + word mark, subtitle "Vendor portal" | — | MOCKUP · D-049 |
| Accent | Teal vendor accent (`--vendor` token; "Submit product" button, active nav, badges) — token value sample | — | MOCKUP · D-049, D-103 |
| Org card | Initials avatar (teal), vendor trade name, "Vendor <id> · <approval state>" (e.g. "Approved supplier"), chevron | `API-M14-02` (name, approval_state) | MOCKUP. The chevron implies an organisation menu/switcher; one vendor user in several vendor organisations is not specified → D-177 (until decided, the card is static) |
| Navigation (group "Workspace") | Dashboard → P-V01 · Products & submissions → P-V02 (badge) · Availability & orders → P-V03 (badge) · Profile & statements → P-V04 | badge counts from `API-M14-03` `actions[]` by area | MOCKUP · badge semantics REQUIRES_DECISION (D-172, same question as the ERP sidebar) |
| Not present | No system-health card, no location switcher, no "New" menu, no delegation item | — | MK; 02-architecture §4.4 |
| Footer | User avatar, name, vendor organisation; "Open storefront" link (public storefront P-S01) | `API-M02-01` | MOCKUP |
| Search | Placeholder "Search your products, POs, submissions…", keyboard shortcut hint (Ctrl K) | `API-M21-03` (VEN scope: own products, POs, submissions) | MOCKUP · V12 |
| "Submit product" button | → P-V02 `#new`; hidden/disabled for applicants, suspended vendors and roles without catalog permission (V7, V8, V9) | — | MOCKUP |
| Notifications bell | Dropdown "Notifications" + "Mark all read"; items link to the record (MK samples: submission needs changes; availability feed goes stale in n h; new PO awaiting confirmation) | `API-M20-01`, `API-M20-02` | MOCKUP · refresh per D-146 |
| Help | Help icon → MK links the storefront help centre (P-S13); vendor-specific help content is not specified | — | MOCKUP · REQUIRES_DECISION (D-174) |
| User menu | "My profile" (target not specified in MK — own user row in P-V04#users; D-174), "Security & MFA" (own password, MFA, sessions — `API-M02-09`, `-10`, `-11`, `-12`, `-13`, `-14`), "Sign out" (`API-M02-06`) | as listed | MOCKUP · D-040, D-083 |
| Page breadcrumb | "Vendor portal" link to P-V01 on P-V02–P-V04 | — | MOCKUP |
| States | Session expired → sign-in; vendor suspended → shell shows the suspended state and routes to P-V01 notice (V8); applicant → nav items for products/availability shown disabled with tooltip (V7) | `API-M14-02` | DOCUMENTED BP §11.1 |

---

## 10. P-V01 — Vendor dashboard (`vendor-dashboard.html`)

### 10.0 Summary card

| Property | Value |
|---|---|
| Purpose | Vendor home: account state and permitted scope, own KPIs, action items with due times, performance scorecard, recent submissions, announcements, upcoming deadlines, and an explicit statement of what the vendor can and cannot see (BP §11.2 "Performance: Data quality and response time"; §11.1 approval record) |
| Evidence | DOCUMENTED (BP §11.1, §11.2, §9.7) · MOCKUP (anno "1B · R05 Vendor KPIs — own records only", "1B · R10 Action items replace calls & emails", "1B · §18 / T11 Own data only — no margins, no other vendors") |
| Route | NOT SPECIFIED — MK `vendor-dashboard.html` |
| Phase · reqs | 1B · R05, R10 · T11, T14 · WP13 |
| Roles | R-supplier (all sub-roles; sections filtered by sub-role V9), R-vendor_applicant (state card + profile links only, V7) |
| APIs | `API-M14-02`, `API-M14-03`, `API-M14-18` (freshness countdown), `API-M14-07` (recent submissions, if not embedded in `API-M14-03`) |
| Backend / data | BR-M14-03, BR-M14-04, BR-M14-06, BR-M14-11; E-supplier, E-vendor_approval, E-vendor_submission, E-supplier_availability, E-purchase_order, E-supplier_fulfilment_task, E-supplier_rma |
| Status | REQUIRES_DECISION (D-101, D-048, D-142 announcements, D-187 scorecard targets) |

### 10.1 Header and account-state card

| Element | Content | API / source | Label |
|---|---|---|---|
| Greeting | "Welcome back, <first name>"; date · vendor name (id) · "data as of <time>" | `API-M02-01`, `API-M14-03` | MOCKUP |
| Header actions | "Purchase orders" → P-V03#pos · "Bulk upload" → P-V02#bulk · "Update availability" → P-V03#feed (hidden per sub-role, V9) | — | MOCKUP |
| Account state — approved | Name + badge "Approved supplier"; permitted categories (with grades); approved date and approver; terms version accepted + date; dispatch location → delivery location; pilot participation (n SKUs); next review date; "Marketplace selling · Phase 2" (locked) | `API-M14-02`, `API-M14-33` (approval record) | DOCUMENTED BP §11.1 |
| Account state — applicant | Badge "Application under review"; applied date, requested categories, documents verified n of m, review SLA (sample → D-185), awaiting items, reviewer; callout "Applicant, not an activated supplier. You can complete your profile and documents, but you cannot submit products, declare availability or receive purchase orders until Tradex approves your application." | `API-M14-02` | DOCUMENTED BP §3.1, §11.1 |
| Account state — suspended | Badge "Suspended"; date, by, reason; facts "New submissions & changes blocked · Offers paused on storefront · Open POs, returns & statements remain visible"; callout with reinstatement path (e.g. upload renewed document) | `API-M14-02` | DOCUMENTED BP §11.1 · effects D-189 |
| Prototype switch | "Prototype · preview account state" (Approved / Applicant / Suspended) | — | not built (00-conventions §1.1) |

### 10.2 KPI strip

| KPI (MK) | Content | API | Label |
|---|---|---|---|
| Live listings | count, change this month, sparkline → P-V02#listings | `API-M14-03` `kpis[]` | MOCKUP |
| In Tradex review | count, average review time → P-V02#submissions | `API-M14-03` | MOCKUP |
| Needs changes | count, first item id · reply-by date → P-V02#submissions | `API-M14-03` | MOCKUP |
| Availability feed | live countdown until stale + last update time (anno "1B · §9.7 Freshness deadline") → P-V03#feed | `API-M14-18` `freshness{state, last_update, deadline}` | DOCUMENTED BP §9.7 |
| Open POs | count, value (supplier price — own), n awaiting confirmation → P-V03#pos | `API-M14-03` | DOCUMENTED BP §11.2 |
| Fill rate · 90 days | value, delta, sparkline | `API-M14-03` `scorecard` | DOCUMENTED BP §14.3 |

KPIs show only the vendor's own data (V3). The countdown is display-only; the authoritative state comes from the API
(stale behaviour D-028).

### 10.3 Section "Needs your action"

| Property | Value |
|---|---|
| Purpose | Replace calls and emails with action items sorted by due time, each linking to the record (MK anno "R10") |
| Components | Header "n open · sorted by due time · each item links to the record"; segmented "Open (n)" / "Done this week (n)"; item cards: due badge (e.g. "Due 18:00", "Needs changes", "In n h", "Pilot task", "Due <date>"), title, meta line, detail (e.g. reviewer quote, consequence "Unconfirmed POs are escalated to Tradex purchasing at <time>", "After the deadline customers see 'confirm before promise'"), action button (Review PO → P-V03 PO drawer · Fix & resubmit → P-V02 submission drawer · Update now → P-V03#feed · Open task → P-V03#tasks · Respond → P-V03 RTV drawer); note "You get these by email and WhatsApp too. Notification preferences are in Profile → Users" |
| APIs | `API-M14-03` `actions[{type, ref, due}]`; "Done this week" not available (G-32); notification preferences G-26 |
| States | Empty (no open actions): "Nothing needs your action" (text not in MK — 04b empty pattern) |
| Status | NOT_STARTED; PO confirmation items REQUIRES_DECISION (D-131); pilot items REQUIRES_DECISION (D-007) |

### 10.4 Section "Performance scorecard"

Rows (MK): Data quality (submissions passing validation first time), Response time (average PO confirmation), Dispatch
SLA (shipped by ship-by date), Feed freshness (hours with a fresh feed), Return rate (units returned to vendor) — each
with value, target marker, badge "On target" / "Below" (text + colour, X13); link "How scores are calculated".
Source: `API-M14-03` `scorecard{data_quality, response_time, dispatch, returns}` (+ feed freshness in MK). BP §11.2
supplier-version performance = "Data quality and response time"; dispatch/returns/freshness align with BP §14.3.
Targets and definitions are samples → D-187. Only the vendor's own scorecard (P-E09 footnote "vendors see only their
own scorecard"). Status REQUIRES_DECISION (D-187).

### 10.5 Section "Recent submissions"

Table ID · Product (thumbnail, title, condition, change type) · Status · next step (Draft / Submitted · in review /
Needs changes / Approved · published / Rejected + next-step text) · Updated; link "All submissions →" (P-V02
`#submissions`); row → submission drawer. Source `API-M14-03` `recent_submissions[]` or `API-M14-07`. Lifecycle per
BP §7.3 (anno "§7.3 Draft → Submitted → Needs changes → Approved"). Status NOT_STARTED.

### 10.6 Sections "Announcements & policy updates", "Coming up", "What you can see", "Sell directly on Tradex"

| Section | Content (MK) | API | Label · status |
|---|---|---|---|
| Announcements & policy updates | "From Tradex vendor management · n new": items (terms version accepted/published → "View" P-V04#terms; policy change e.g. warranty provider mandatory; document expiring → "Upload" P-V04#documents; capacity declarations; rubric version update; portal maintenance) | `API-M14-03` `announcements[]` | MOCKUP · REQUIRES_DECISION (D-142) |
| Coming up | Dated list for the next weeks: feed freshness deadline, PO confirmations, RTV response due, PO ship-by with ASN, submission reply-by, document expiry | `API-M14-03` `upcoming[]` | MOCKUP · ASN items D-131 |
| What you can see | ✓ products/submissions/reviewer comments; ✓ declared availability & lead times; ✓ POs issued to you; ✓ pilot tasks with minimum shipping data; ✓ returns, statements & scorecard; ✗ Tradex selling prices, margins or costs; ✗ other vendors' products, prices, stock or scores; ✗ Tradex's own stock positions; ✗ full customer addresses, phones or order history; callout "Every view and export is logged in Tradex's audit trail. Your users see only what their role allows." | static content | DOCUMENTED BP §3.1, §11.2, T11 · NOT_STARTED |
| Sell directly on Tradex | "Phase 2" notice: marketplace selling is a separately approved extension, not active; "Your model today" (supplier; supplier-fulfilment pilot; marketplace not offered); disabled "Locked"; "See sample settlement →" (P-V04#marketplace) | static + `API-M14-02` (model) | LATER (D-046) — show only if the owner wants the notice; no activation path |

---
## 11. P-V02 — Products & submissions (`vendor-products.html`)

### 11.0 Summary card

| Property | Value |
|---|---|
| Purpose | Vendor catalog work: see own approved listings (with pending changes), track own submissions with reviewer comments, submit a new product or a change through category-schema validation, and upload batches with row-level results (BP §11.2 "Products: Submit drafts, upload files, respond to errors"; §7.3 lifecycle; §7.4 import pipeline; §11.3 pending versions; §29.3) |
| Evidence | DOCUMENTED (BP §7.3, §7.4, §11.1–11.3, §17.4 "Vendor submission: vendor scope; no automatic publication", §29.3, A20, T12, T13, T26) · MOCKUP (anno "1B · §11.1 Permitted scope enforced on every submission", "1B · §7.3 Lifecycle: Draft → Submitted → Needs changes → Approved → Published") |
| Route | NOT SPECIFIED — MK `vendor-products.html` tabs `#listings`, `#submissions`, `#new`, `#bulk`; drawers `#d-listing`, `#d-sub`; modal `#m-submitted` |
| Phase · reqs | 1B · R05, R07, R19, R20 · A01, A20 (P1B) · T12, T13, T26 · WP13 · BP §15.3 proof scenario 6 |
| Roles | R-supplier with catalog permission (MK Catalog, Admin — D-137); other vendor sub-roles read-only or hidden (V9); applicants and suspended vendors cannot submit (V7, V8) |
| Status | REQUIRES_DECISION (D-101, D-048, D-137) |

### 11.1 Page header

"Products & submissions"; "Templates" (download submission templates and grade rubric — `API-M14-12`
`templates[]`, `grade_rubric`); "Submit product" (→ `#new`). Breadcrumb "Vendor portal".

### 11.2 Tab `#listings` — Live listings

| Property | Value |
|---|---|
| Purpose | Own approved listings, with pending change and suspension state; the approved version stays live while a change is in review (BP §11.3) |
| Evidence | DOCUMENTED (BP §11.2, §11.3) · MOCKUP (anno "1B · §11.3 Pending version never overwrites live data") |
| Sections / components | Link "Availability" (→ P-V03#feed); info callout "The approved version stays live while a change is in review. Sensitive edits — brand, condition, warranty, tax class, or a supplier-price change above n % — always need Tradex review. Quantities and lead times are updated in Availability, not here. Retail prices are set by Tradex and are not shown." (threshold sample → D-186); search; category and grade selects; status segmented (All / Live / Pending change / Suspended); table; count; pager |
| Table | Product (thumbnail, title, condition badge, key spec) · Your code · SKU (vendor code + Tradex SKU) · Warranty (duration + provider) · Supplier price (ex-GST — vendor's own price) · Declared (units + lead days, or "0 · offer paused") · Status ("Live · vN"; pending note "<VS-id> pending · <change>"; "Suspended — not purchasable · fix & resubmit") · actions ("View"/"Fix"; menu: View approved version, Propose a change, View on storefront, Update availability) |
| Filters · search · pagination | `q` (title, vendor code, Tradex SKU), `category`, `grade`, `state` (live, pending_change, suspended) → `API-M14-04`; pager per D-080 |
| States | Empty per filter (04b pattern); suspended rows styled with text reason (X13) |
| Permissions | R-supplier catalog/admin (V9); own organisation (V1–V3) |
| APIs | `API-M14-04`, `API-M14-05` (drawer), `API-M14-06` (propose change / correct & resubmit), `API-M14-10` (withdraw pending change) |
| Backend / data | BR-M14-05, BR-M14-06, BR-M14-10; E-vendor_submission, E-catalog_change_version, E-offer, E-supplier_availability |
| Related | P-V03#feed (quantities), P-S03 (public product page — "View on storefront"), P-E11#submissions |
| Status | NOT_STARTED |

### 11.3 Drawer `#d-listing` — Listing detail

| Property | Value |
|---|---|
| Sections / components | Head (thumbnail, condition, vendor code · SKU, title, specs). Body by state — **pending**: callout "Change <VS-id> is waiting for Tradex review. Customers still see the approved vN. If the change is rejected or withdrawn, vN simply continues."; diff "Live vN · on storefront" vs "Pending <VS-id>" per field (unchanged fields marked); note "Warranty changes are a sensitive edit and always need review". **suspended**: callout with suspension reason (e.g. QC failure on a GRN); panels Storefront (offer hidden since …), Open POs, Returns; "To reinstate" steps (re-grade or disclose, submit corrected version for normal review, Tradex QC checks next receipt). **live**: callout "Live · approved vN on <date>. No change pending." Then "Approved data (vN)" key-values (category, condition, warranty, supplier price ex-GST, declared availability, approved date + reviewer) and "Version history" timeline |
| Footer | pending → "Withdraw change" (`API-M14-10` `withdraw` on the pending submission; live stays), "Open <VS-id>" (→ `#submissions` drawer) · suspended → "Contact reviewer" (G-30), "Correct & resubmit" (→ `#new` prefilled from the approved version; `API-M14-06` `type=change`, `listing_id`) · live → "View on storefront" (public P-S03 link), "Propose a change" (→ `#new` prefilled; live stays unchanged) |
| APIs | `API-M14-05` |
| Status | NOT_STARTED |

### 11.4 Tab `#submissions` — Submissions

| Property | Value |
|---|---|
| Purpose | Track own submissions through the lifecycle with reviewer comments (BP §7.3; §29.3 "clear correction request") |
| Evidence | DOCUMENTED (BP §7.3, §29.3) · MOCKUP (anno "1B · R05 Own submissions with reviewer comments") |
| Sections / components | Status segmented with counts (All / Draft / Submitted / Needs changes / Approved / Rejected); search "Search VS-number or product"; table; empty state "No submissions in this state — Try another filter, or submit a product" (link → `#new`); "Export CSV" (MK: "CSV of your submissions will be emailed to you" — G-31) |
| Table | ID · Product (thumbnail, title, condition) · Type (new product / change + "Live vN stays unchanged") · Status · Reviewer comment · Updated (+ by user) · chevron |
| Filters · search | `state`, `q` → `API-M14-07` |
| APIs | `API-M14-07`, `API-M14-08` (drawer), `API-M14-09`, `API-M14-10`, `API-M14-11` |
| Backend / data | BR-M14-05, BR-M14-12; E-vendor_submission, E-catalog_change_version, E-approval_request |
| Status | NOT_STARTED |

**Drawer `#d-sub` — Submission detail.** Head (id, status, title, type, condition, submitted by). Stepper Draft →
Submitted → Tradex review → Approved / Needs changes / Rejected → Published. Body by state and footer actions:

| State | Body (MK) | Footer controls → API |
|---|---|---|
| Draft | Callout "Draft — only your organisation can see it" + completeness | "Delete draft" → `API-M14-10` `delete`; "Continue editing" → `#new` (`API-M14-09`) |
| Submitted | Callout "In Tradex review · SLA n working days. Editing is locked while in review. The live vN stays unchanged / Nothing is visible to customers yet"; "Your change" diff for change submissions | "Withdraw" → `API-M14-10` `withdraw`; "Locked in review" (disabled) |
| Needs changes | Callout "Needs changes — reply by <date>. Nothing from this submission is visible to customers…"; "Field issues (n)" list (field, message, Blocking / Clarify badge); "Conversation" (reviewer message with name, team, time); "Reply to reviewer" textarea | "Send reply only" → `API-M14-11`; "Edit & resubmit" → `#new` (`API-M14-09`, then `API-M14-10` `submit`) |
| Approved | Callout "Approved by <reviewer>" + either "Published on <date>" or "Approved is not yet live: Tradex runs publication checks (tax class, storefront copy, retail price)" | "View live listing" → `#listings` |
| Rejected | Callout with rejection reason; reviewer message; note "A rejected submission can't be edited. Duplicate it as a new draft to try again — the original stays in your history" | "Duplicate as new draft" → `API-M14-10` `duplicate` |

SLA/reply-by values are samples → D-185. Status NOT_STARTED.

### 11.5 Tab `#new` — Submit product (new submission or change)

| Property | Value |
|---|---|
| Purpose | Enter a new product or a change to an approved listing in the category schema, see validation inline before review, and submit (BP §7.2, §7.3, §7.4, §11.1, §29.3; A20) |
| Evidence | DOCUMENTED (BP §7.2, §7.4, §11.1, §17.4, §29.3, A20) · MOCKUP (anno "1B · §7.4 Validation errors shown inline, before review", "1B · R07 Category schema drives attributes", "1B · R19 Grade rubric + mandatory warranty provider", "1B · §7.4 Image quality + rights confirmation") |
| Route | NOT SPECIFIED — MK `#new`; shell "Submit product" |
| Sections / components | Title "New product submission"; error summary callout "n issues must be fixed before you can submit" with links jumping to fields; five sections (1 Category & identity · 2 Specifications · 3 Condition grade & warranty · 4 Images & content · 5 Supplier price & availability); side panel "Submission checklist" (n of 7 complete; items with "Fix" jump links) and "What happens next" (automatic validation instant · Tradex catalog review ≤ n working days · approved → publication checks (tax class, storefront copy, retail price by Tradex) · live — "Customers see nothing before this step"); link "Request a category" (→ P-V04 change request); footer "Save draft", "Validate", "Submit for review"; modal `#m-submitted` |
| States | Field-level invalid state + error summary (BP §6.7 error summaries; T30); schema switch toast when the category changes ("Attributes switched to the <category> schema"); version conflict X8 |
| Permissions | Catalog/admin vendor sub-roles; categories limited to permitted ones (non-permitted shown disabled "— not permitted"); grades limited to permitted ones (disabled "Not permitted for your account"); dispatch locations limited to approved ones ("approval pending" shown) (BP §11.1) |
| APIs | `API-M14-12` (category schema, grade rubric, warranty provider options, templates), `API-M14-06` (create draft / submit), `API-M14-09` (update draft), `API-M14-10` (`validate`, `submit`), `API-M22-01` (photos; type/size), `API-M22-03` (remove unsubmitted photo) |
| Backend / data | BR-M14-05, BR-M14-10, BR-M14-12, BR-M04-01, BR-M04-04, BR-M04-12, BR-M04-13, BR-M04-14; E-vendor_submission, E-catalog_change_version, E-attribute_definition, E-category_attribute, E-condition_grade, E-warranty_policy, E-media_asset, E-attachment, E-supplier_availability |
| Status | REQUIRES_DECISION (D-023 grade rubric/checklist, D-057 image rights/sources, D-113 image rules) |

| Field | Type | Req | Validation / source |
|---|---|---|---|
| Category | select | Y | Permitted categories only (`403 CATEGORY_NOT_PERMITTED`); drives the attribute schema (BP §7.1, §11.1) |
| Condition type | read-only | Y | From permitted scope (e.g. refurbished) (MK) |
| Brand | select | Y | Brand list (E-brand); brand is a sensitive field → review; brand authorisation evidence may be required (MK validation warning) (BP §11.3) |
| Model | text | Y | — (BP §7.2) |
| Manufacturer part no. (MPN) | text | C | Per category schema (BP §7.2) |
| Your product code | text | Y | Unique within the vendor (supplier code mapping, E-supplier_code_mapping) |
| Title preview | read-only (generated) | — | Generated from schema fields (MK) |
| Tax classification | read-only (HSN · GST rate) | Y | Derived per category; sensitive — reviewed by finance where required (BP §11.3, §18.1 "Tax review if required"); D-037 |
| Barcode / EAN | text | N | Format check |
| Specifications (category attributes, e.g. processor, memory, storage type/capacity, display size/resolution, battery health, OS licence, keyboard layout, graphics, ports, weight, backlit keyboard; monitors: panel size, resolution, panel type, refresh rate, inputs, stand, dead/stuck pixels, backlight bleed) | per attribute type (text, number with unit and range, select, checkbox) | per schema | Required/optional, ranges and allowed values from `API-M14-12` (BP §7.1–7.2; R07). MK attribute lists are samples of schemas |
| Condition grade | radio cards (with rubric summary) | Y | Permitted grades only; rubric version shown with "Full rubric (PDF)" and rubric table (cosmetic, screen, battery, keyboard & touchpad, function test) — rubric content D-023 |
| Warranty provider | select (vendor / Tradex back-to-back / manufacturer with proof — sample options) | Y | "Refurbished listings must name who honours the warranty" (BP §29.3 "fails validation because warranty provider is missing"); options from `API-M14-12` `warranty_provider_options` |
| Warranty duration | select | Y | Policy values (E-warranty_policy; D-022) |
| Defects & cosmetic notes | textarea | C | Required for graded/used conditions where the schema requires (BP §7.2 "defects") |
| Inspection & data-erasure evidence | checkbox + date / evidence reference | Y (refurbished/used) | Inspection checklist and erasure evidence (BP §7.2, §7.5); "42-point" wording sample → D-023 |
| Photos | file upload (multiple) | Y | JPG/PNG, minimum long-edge size, maximum count (samples → D-113); each photo shows its measured size, "too small" error with "Replace photo"; actual unit or batch (BP §6.6) |
| Image-rights confirmation | checkbox | Y | "I confirm <vendor> owns these photos or has written permission…" — recorded with user, time and terms clause (BP §7.4, R20; D-057) |
| Description | textarea | Y | Plain text; length limits sample |
| Included accessories | multi-select chips | N | — (BP §7.2 "accessories") |
| Supplier price (ex-GST, per unit) | money | Y | ≥ 0; change beyond a threshold vs current = sensitive (MK "> 10 %" sample → D-186) (BP §11.3 "extraordinary price changes") |
| Price valid until | date | Y | Future date |
| Supplier-held quantity | stepper (integer) | Y | ≥ 0; declared stock is never Tradex stock (callout; BP §9.7, §11.3) |
| Lead time to Tradex warehouse (days) | number | Y | ≥ 1 (MK API sample error "lead_days must be ≥ 1") |
| Dispatch from | select | Y | Approved dispatch locations only; others shown "approval pending" (BP §11.1) |
| Minimum order per PO | number | N | ≥ 1 |
| Eligible for supplier-fulfilment pilot | checkbox (disabled unless pilot-approved) | N | D-007 |

| Control | API | Result / guard | Evidence |
|---|---|---|---|
| "Save draft" | `API-M14-06` (`submit=false`) first, then `API-M14-09` (`expected_version`) | Draft id (VS-…) | MOCKUP |
| "Validate" | `API-M14-10` `validate` | Errors/warnings returned and mapped to fields + summary | DOCUMENTED A20 |
| "Submit for review" | `API-M14-10` `submit` (or `API-M14-06` `submit=true`) | Allowed only with no blocking errors → `#m-submitted` ("<id> passed validation and is now in the Tradex catalog review queue"; "Stay here" / "View submissions"); never publishes (BP §17.4, T12) | DOCUMENTED |
| "Replace photo" / remove photo | `API-M22-01` / `API-M22-03` | Re-validates image rules | MOCKUP |
| "Full rubric (PDF)" | `API-M14-12` (rubric document link) | — | MOCKUP |
| "Request a category" | → P-V04 `#m-req` (type "Add a permitted category") → `API-M14-34` | Change request reviewed by vendor management | DOCUMENTED BP §11.3 |

### 11.6 Tab `#bulk` — Bulk upload

| Property | Value |
|---|---|
| Purpose | Upload a versioned template file (or use the API) for staged validation with row-level results; fix and resubmit rows without duplicates (BP §7.4 "versioned template … row-level results"; T26) |
| Evidence | DOCUMENTED (BP §7.4, T26, A01/A20) · MOCKUP (anno "1B · R20 Versioned template · file or API · same validation", "1B · §7.4 Row-level results · fix & resubmit without duplicates") |
| Route | NOT SPECIFIED — MK `#bulk` |
| Sections / components | Stepper Download template · Upload file · Fix row errors · Submit valid rows. **1 · Download a template** (version + date; per-category XLSX templates and CSV + field guide). **2 · Upload** (limits: max rows and size — samples; drop zone; "Older template versions are rejected with a clear message"; images via ZIP named by product code or approved HTTPS hosts — "Other URLs are blocked"). **… or connect via API** (badge "1B pilot"; "Same validation and review as uploads — the API can never publish directly. Uses your scoped key from Availability → API"; link to API documentation). **Batch panel**: batch id + file name, uploaded by/at, template version check, batch key note ("re-validation never duplicates accepted rows"); "Error report", "Discard batch"; row filter (All / Errors / Duplicates / Valid); rows table; footer "Resubmit fixed rows (n)", "Submit n valid rows". **Previous batches** table |
| Table — rows | Row · Your code · Product · Grade · Supplier price · Result (valid / error / duplicate / fixed / skipped) · Issue & fix (message + inline fix: value input with range check, "Upload photo", "Remove row", "Request category" link) |
| Table — previous batches | Batch · File · Uploaded (date · user) · Rows · Outcome (submitted/approved/needs changes; file rejected — old template; skipped duplicates) |
| Permissions | Catalog/admin vendor sub-roles; permitted categories enforced per row |
| APIs | `API-M14-12` (templates), `API-M22-01` (file), `API-M14-13` (upload for staged validation, Idem), `API-M14-15` (rows, error-report link), `API-M14-16` (fix/remove row), `API-M14-17` (`submit_valid`, `resubmit_fixed`, `discard`; Idem), `API-M14-14` (previous batches), `API-M14-06` (API submissions with INT key) |
| Backend / data | BR-M14-05, BR-M14-12; E-import_job, E-import_row, E-vendor_submission, E-import_mapping_profile |
| Phase · reqs | 1B · A01, A20 · R20 · T26 |
| Status | REQUIRES_DECISION (D-057 file/API formats, D-113 image rules) |

URL-based images: allow-listed HTTPS hosts only, SSRF-restricted (BP §7.4, §19.1); host list is configuration, not
the MK sample.

---

## 12. P-V03 — Availability, POs, fulfilment tasks & returns (`vendor-availability.html`)

### 12.0 Summary card

| Property | Value |
|---|---|
| Purpose | Declare supplier-held availability and lead times (portal, CSV, API) against a freshness deadline; see (and, if D-131 approves, confirm) purchase orders; handle supplier-fulfilment pilot tasks with minimum customer data; respond to returns to vendor (BP §11.2 Availability / Transactions / Returns; §9.7; §3.2) |
| Evidence | DOCUMENTED (BP §3.2, §9.7, §11.2, §11.3, T14) · MOCKUP (anno "1B · §9.7 Freshness deadline per supplier") · MOCKUP-ONLY (PO confirmation, ASN — D-131) · CONDITIONAL (pilot tasks — D-007) |
| Route | NOT SPECIFIED — MK `vendor-availability.html` tabs `#feed`, `#pos`, `#tasks`, `#returns` (update card sub-tabs `m-form`, `m-csv`, `m-api`); drawers `#d-po`, `#d-rtv`; modals `#m-reject`, `#m-asn`, `#m-evidence`, `#m-decline`, `#m-rotate` |
| Phase · reqs | 1B · R05, R08 · A21 · T11, T14 · WP13 |
| Roles | R-supplier Operations/Admin sub-roles (D-137); R-integration vendor API key (availability, submissions); Catalog/Accounts read-only where MK allows (returns view) |
| Status | REQUIRES_DECISION (D-101, D-048, D-028, D-131, D-007) |

Header: "Availability & orders"; "Export current feed" (`API-M14-18` `format=csv`); "Update availability" (scrolls to
the update card).

### 12.1 Tab `#feed` — Availability feed

| Property | Value |
|---|---|
| Purpose | Keep supplier-held quantities and lead times fresh; show how the storefront uses them; stale feeds pause delivery promises (BP §9.7; T14; anno "1B · T14 Stale feed pauses delivery promises", "1B · R08 Supplier stock is never Tradex stock", "1B · §11.3 Routine refresh auto-accepted within bounds") |
| Sections / components | **Feed freshness** card: state (Fresh / Stale / Suspended — the MK segmented control is a prototype preview), timeline of the policy bands with the current band highlighted, callout for stale ("Feed stale since … n offers now show 'confirm before promise' … every new order creates a confirmation request with a deadline"). **How your availability is used** list (never counted as Tradex stock — "Ships in n–m days · partner stock", never "In stock"; becomes Tradex stock only after GRN + QC; safety buffer per offer; PO-confirmed quantities deducted automatically; routine refreshes within ±n % auto-accepted, bigger jumps held; promises pause after n h, offers hidden after m h). **Update availability** card with sub-tabs Edit in portal / CSV upload / API |
| Sub-tab `m-form` table | Offer (thumbnail, title, condition) · Your code · last confirmed · Supplier-held qty (stepper) · Lead days (number) · Customer sees ("Ships in n–m days" / "Confirm before promise" / —) · Check (No change / Auto-accept within bounds / Held for check (+n % vs old — old value stays until accepted) / Held · awaiting Tradex / Listing suspended — quantity ignored / Not listed yet — used after approval) |
| Sub-tab `m-form` controls | Search; "Confirm all unchanged" (anno "Confirm unchanged also restarts the clock"); footer "n unsaved changes · n will be held for a Tradex check · saving also confirms all other rows and restarts the clock"; "Discard changes"; "Save & refresh feed" |
| Sub-tab `m-csv` | Drop zone; "Template v2" (G-33); "Current feed as CSV"; "Recent CSV uploads" table (Uploaded · Rows · Result incl. rejected rows with reasons and held rows) |
| Sub-tab `m-api` | Live API key (masked) + "Reveal" (password + OTP, logged) + copy + "Rotate" (`#m-rotate`); metadata (created by/at, last used, expiry); Scope (availability:write, submissions:write); "Cannot: publish products, read orders, customers, prices or other vendors"; IP allow-list (MOCKUP-ONLY — D-177); rate limit and "idempotency key required" (D-084, D-079); example request (MK path differs from 06-api — I-12, D-080); callout "Keys are shown once on creation. Revealing requires your password + OTP and is logged. Never share keys by email or WhatsApp."; "Recent calls" table (call · result) |
| Permissions | Operations/Admin sub-roles; API key management Admin (D-137); own offers only (V1–V3) |
| APIs | `API-M14-18` (feed + freshness; CSV), `API-M14-19` (portal edit / confirm unchanged / CSV / API — Idem), `API-M14-20` (recent uploads and API calls), `API-M22-01` (CSV file), `API-M14-21` (rotate), `API-M14-22` (reveal), `API-M02-02`/`API-M02-03` (OTP → verification token), credential metadata (G-34) |
| Backend / data | BR-M14-05, BR-M14-11, BR-M06-14, BR-M06-15; E-supplier_availability, E-offer, E-api_credential (CONDITIONAL D-083), E-idempotency_record |
| Related | P-E11#freshness, P-E08#supplier, P-S03 (partner-stock promise) |
| Status | REQUIRES_DECISION (D-028 freshness, D-027 buffer, D-186 auto-accept bounds, D-083 API credentials) |

| Control | API | Result / guard | Evidence |
|---|---|---|---|
| "Save & refresh feed" | `API-M14-19` `source=portal`, `offers[]` (+ `confirm_all_unchanged=true` for untouched rows), Idem | `accepted[]`, `review_required[]` (held — storefront keeps the old value until accepted), `rejected[]`; freshness reset | DOCUMENTED BP §9.7, §11.3 |
| "Confirm all unchanged" | `API-M14-19` `confirm_all_unchanged=true` | Freshness clock restarted, no quantity change | MOCKUP |
| "Discard changes" | local | — | MOCKUP |
| CSV upload | `API-M22-01` → `API-M14-19` `source=csv`, `file_id` | Row results in "Recent CSV uploads" | DOCUMENTED BP §11.2 "upload files" |
| "Current feed as CSV" / "Export current feed" | `API-M14-18` `format=csv` | File | MOCKUP |
| "Reveal" | `API-M14-22` (password + `verification_token`) | Secret visible until `visible_until`; logged. MK practice vs BP §19.1 secret handling — kept MOCKUP, REQUIRES_DECISION (D-083) | MOCKUP |
| "Rotate" → `#m-rotate` | `API-M02-02` (OTP, purpose `confirm_action`) → `API-M02-03` → `API-M14-21` | New key shown once; old key revoked after a grace period (sample) | MOCKUP · D-083 |

`#m-rotate` — "Rotate API key?": "OTP sent to <masked phone>" + 6-digit code input (Y); "Rotate key". Status
REQUIRES_DECISION (D-083, D-040).

Policy values on this tab (24 h stale, 72 h hidden, ±50 %, buffer 2 units, 4 h confirmation) are samples and
differ between MK pages (I-14) → D-028, D-027, D-186, D-007.

### 12.2 Tab `#pos` — Purchase orders (with drawer `#d-po`, modals `#m-reject`, `#m-asn`)

| Property | Value |
|---|---|
| Purpose | See purchase orders issued to the vendor (BP §11.2 "View purchase orders"); MK additionally lets the vendor confirm/partially confirm/reject lines and send an advance shipping notice with serials (anno "1A/1B · §9.3 PO confirmation → ASN with serials → GRN & QC") |
| Evidence | DOCUMENTED (view — BP §11.2) · MOCKUP-ONLY (confirmation, rejection, ASN — D-131) |
| Sections / components | Info callout ("Purchase orders are Tradex's orders to you. Confirm, partially confirm or reject each line with a reason before the confirmation deadline. Ship against an ASN with serial numbers — Tradex receives against it (GRN) and inspects every unit before it becomes sellable."); segmented Open · n / All · n / Closed · n; table; row action ("Review" / "Send ASN" / view) |
| Table | PO · Issued · Lines (summary, units) · Value (at the vendor's supplier prices) · Deliver to (location code) · Deadline (confirm-by / ship-by / arriving / received) · Status (Awaiting confirmation / Confirmed / Partially confirmed · in transit / Received · n passed QC (→ RTV) / Rejected by you) |
| Filters | `status` (open, closed, all) → `API-M14-23` |
| Permissions | Operations/Admin vendor sub-roles; only POs to this vendor; no company margins (06-api API-M14-23) |
| APIs | `API-M14-23`, `API-M14-24`, `API-M14-25` (D-131), `API-M14-26` (D-131, D-037) |
| Backend / data | BR-M07-01, BR-M14-06; E-purchase_order, E-purchase_order_line (`supplier_confirmation` D-131), E-advance_shipping_notice (MOCKUP-ONLY D-131) |
| Related | P-E09#orders (staff view of the same PO), P-E09#receive (GRN against ASN) |
| Status | View: NOT_STARTED · Confirmation/ASN: REQUIRES_DECISION (D-131) |

**Drawer `#d-po`** — "Purchase order from <company>": header facts (PO number, issued, buyer, deliver-to, deadlines);
lines table Line · Ordered · Your decision & reason (select Confirm / Partially confirm / Reject + reason input) ·
Confirm qty (stepper, 0…ordered) · Your ship-by (date); error callout "Give a reason for every partially confirmed or
rejected line"; info callout "Confirmed quantities are deducted from your declared availability … Unconfirmed
quantity goes back to Tradex purchasing to source elsewhere"; "History" list (awaiting confirmation + reminders;
issued by + "approved within buyer limit"); footer "Reject whole PO" (→ `#m-reject`), "Save draft", "Send
confirmation".

| Control | API | Result / guard | Evidence |
|---|---|---|---|
| "Send confirmation" | `API-M14-25` `action=confirm`, `lines[{line_id, decision, confirm_qty, ship_by, reason?}]` | Reason required for partial/rejected lines (MK); confirmed qty deducted from declared availability (MK) | MOCKUP-ONLY · D-131 |
| "Save draft" | `API-M14-25` `action=save_draft` | Draft response saved | MOCKUP-ONLY · D-131 |
| "Reject whole PO" → `#m-reject` "Reject PO" | `API-M14-25` `action=reject`, `reject_reason` | Reason select (stock no longer available / price has changed / model discontinued / quality hold / cannot meet ship-by / other — samples, D-139) + details textarea; warning "Rejections count toward your fill rate" | MOCKUP-ONLY · D-131 |
| "Send ASN" → `#m-asn` | `API-M14-26` (Idem) | See fields below | MOCKUP-ONLY · D-131, D-037 |

| Field (`#m-asn` "Advance shipping notice · <PO>") | Type | Req | Validation / source |
|---|---|---|---|
| Dispatch date | date | Y | ≤ ship-by (warn) |
| Carrier | select (sample carriers; own vehicle) | Y | — |
| AWB / LR number | text | Y | — |
| Boxes | number | Y | ≥ 1 |
| Your tax invoice no. | text | Y | Used for bill matching (BP §9.3) |
| E-way bill no. | text | C | Only where applicable (D-037) |
| Serial numbers (one per line — scan or paste) | textarea | Y for serialised SKUs | Count = units shipped; unique; format; receiving still validates at GRN (BP §9.3, §9.4; API-M14-26) |

### 12.3 Tab `#tasks` — Fulfilment tasks (supplier-fulfilment pilot) with modals `#m-decline`, `#m-evidence`

| Property | Value |
|---|---|
| Purpose | Pilot "company sale with supplier fulfilment": confirm each task by its deadline or return it, ship on the company's behalf with the company's invoice and packing slip, upload shipment evidence — with minimum customer data (BP §3.2 "Confirmation deadline, shipment evidence, invoice and warranty responsibility"; §11.2 minimum data) |
| Evidence | CONDITIONAL / PROPOSED-DEFAULT pilot (BP §3.2 "Activate direct supplier fulfilment only for a small pilot"; D-007) · MOCKUP (anno "1B pilot · §3.2 Company sale with supplier fulfilment", "1B · §11.2 Minimum customer data: name, city, masked phone/PIN") |
| Sections / components | Pilot callout (scope, "Tradex sells to the customer; you ship on Tradex's behalf with Tradex's invoice and packing slip. Confirm each task within n hours or it returns to Tradex for reallocation. You see only the minimum data needed to ship — the courier label carries the full address."); KPI tiles (confirmed within target, handed to courier same day, tasks this month, reassigned (expired)); segmented Open · n / Shipped · n / Expired · n / All; note on timezone and confirmation-clock pause hours (sample); task cards |
| Task card | Task number, state, countdown ("n h m min left" / "Pickup by …"); item (qty × product, condition, vendor code); Tradex order reference; promised delivery date; courier (company account); "Ship to" block: recipient name as returned, city/state, **masked** phone, **masked** PIN (V4); expired: "Customer data: Hidden after reassignment" + consequence text (counts toward response-time score) |
| Actions by state | Awaiting → "Confirm — can ship today" (`API-M14-28` `confirm`, `pickup_time?`), "Can't fulfil" (→ `#m-decline`). Confirmed → "Label & invoice" (`API-M14-29` — company invoice per seller-of-record D-008), "Upload shipment evidence" (→ `#m-evidence`). Shipped → "View evidence" (G-35). Expired → "Add explanation" (`API-M14-28` `explain`, reason) |
| Filters | `status` (open, shipped, expired) → `API-M14-27` |
| Permissions | Operations/Admin sub-roles of a vendor approved for the pilot; tasks of this vendor only |
| APIs | `API-M14-27`, `API-M14-28`, `API-M14-29`, `API-M14-30`, `API-M22-01` (photos) |
| Backend / data | BR-M14-07, BR-M14-08; E-supplier_fulfilment_task (CONDITIONAL), E-fulfilment, E-shipment_event, E-invoice_reference |
| Related | P-E03 (company fulfilment), P-E02 (order), P-E11#list pilot vendors |
| Status | REQUIRES_DECISION (D-007, D-008; unconfirmed-by-deadline handling D-181) — tab hidden for vendors not in the pilot |

| Field (`#m-decline` "Can't fulfil <task>") | Type | Req | Validation / source |
|---|---|---|---|
| Reason | select (unit no longer available / failed our final check / cannot ship today / other — samples, D-139) | Y | Callout "The task returns to Tradex immediately so the customer's delivery date can be protected. Your availability for <code> will be reduced by 1." |

"Return task to Tradex" → `API-M14-28` `cannot_fulfil`, `reason` (409 `TASK_EXPIRED` if too late).

| Field (`#m-evidence` "Shipment evidence · <task>") | Type | Req | Validation / source |
|---|---|---|---|
| AWB number | text | Y | BP §3.2 "shipment evidence" |
| Serial shipped (scan) | scan-input | Y (serialised) | Must match the allocated unit (`API-M14-30`) |
| Packed weight | number (kg) | Y | > 0 |
| Handover time | datetime | Y | ≤ now |
| Declaration: company invoice and packing slip enclosed; no vendor price list or branding inside the box | checkbox | Y | MK |
| Photos | file (multiple) | C | `photo_file_ids[]` (API-M14-30; MK shipped card "2 packing photos"; upload control not drawn in the modal) |

"Submit evidence" → `API-M14-30` (Idem) → task `shipped`; customer notified by the company (MK).

### 12.4 Tab `#returns` — Returns to vendor (with drawer `#d-rtv`)

| Property | Value |
|---|---|
| Purpose | Respond to supplier RMAs raised by the company (inbound QC failure or warranty claim under the vendor's warranty) with a resolution or a dispute with evidence (BP §11.2 "Returns: Supplier RMA requests and evidence") |
| Evidence | DOCUMENTED (BP §11.2, §9.3 QC fail → supplier resolution) · MOCKUP (anno "1B · R19 Supplier RMA with evidence & resolution") |
| Sections / components | Info callout ("Returns to vendor (RTV) are raised by Tradex when a unit fails inbound QC or a warranty claim falls under your warranty. Respond within n working days … Customer identity is never shared — only the unit, serial and evidence."); segmented Open · n / All · n; table; row → `#d-rtv` |
| Table | RTV · Source (Inbound QC + GRN/PO ref / Warranty claim + customer RMA ref) · Unit (thumbnail, product, unit id, serial) · Issue & evidence · Requested (resolution requested) · Due · Status (Waiting for you / Disputed · Tradex reviewing / Resolved · debit note …) |
| Drawer `#d-rtv` | Product title + condition; failure callout (e.g. rubric criterion exceeded; "Unit is in Tradex quarantine — not sellable"); "Evidence from Tradex QC · inspector · time" (photos via `API-M22-02`); "Your resolution" radios — Send a replacement unit (ship within n working days on a new ASN) / Issue a credit note (amount + GST against invoice) / Repair & return / Dispute with evidence (goes to Tradex purchasing for a decision); "Note to Tradex" textarea; "History" (raised, due; quarantined at location; related GRN results); footer "Later", "Send response" |
| Filters | `status` → `API-M14-31` |
| Permissions | Operations/Admin respond; Catalog/Accounts view (MK role matrix, D-137) |
| APIs | `API-M14-31`, `API-M14-32` (`resolution`, `note`, `refs?`), `API-M22-02` (evidence) |
| Backend / data | BR-M07-04, BR-M14-06; E-supplier_rma, E-serial_unit, E-inspection, E-attachment |
| Related | P-E04 (customer RMA/warranty), P-E08#serials, P-E09#receive (QC fail), P-V04#statements (debit notes) |
| Status | NOT_STARTED (response window sample → D-185; supplier-RMA states D-150/D-139) |

---
## 13. P-V04 — Business profile & statements (`vendor-account.html`)

### 13.0 Summary card

| Property | Value |
|---|---|
| Purpose | Vendor organisation record: verified business details and contacts, permitted scope and approval record, documents with validity, vendor users and roles, supplier statement, terms versions with acceptance evidence, payout-account change requests (maker–checker), and the locked marketplace preview (BP §11.1, §11.2 "Profile: Business details and approved contacts", "Finance: Relevant supplier statements if integrated", §11.5, §18.1 "Change payout account") |
| Evidence | DOCUMENTED (BP §11.1, §11.2, §11.5, §18.1, §19.1) · MOCKUP (anno "1B · Verified identity: GSTIN, PAN, approval") · LATER (marketplace tab) |
| Route | NOT SPECIFIED — MK `vendor-account.html` tabs `#profile`, `#documents`, `#users`, `#statements`, `#marketplace`, `#terms`, `#bank`; modals `#m-req`, `#m-invite`, `#m-terms` |
| Phase · reqs | 1B · R05, R06 · T11, T13 · WP13 |
| Roles | Vendor Admin (all), Accounts (statements, bank change maker), Catalog/Operations (profile read) — MK role matrix, D-137; R-vendor_applicant: profile, documents, terms (V7) |
| Status | REQUIRES_DECISION (D-101, D-048, D-137, D-068) |

Header: organisation legal name; "Request a change" (→ `#m-req`); "Download statement" (`API-M14-39`
`format=pdf`, Accounts/Admin; hidden if D-011 says statements are not integrated).

### 13.1 Tab `#profile` — Profile

| Property | Value |
|---|---|
| Purpose | Show verified business details, contacts, permitted scope and the approval record; changes only by request (BP §11.1, §11.3, §19.1; T13) |
| Sections / components | **Verified business details** ("Locked fields change only through a verified change request" + "Request change"): legal name, trade name, constitution (+ company registration no.), GSTIN (status, verified date), PAN (verified), MSME registration (if any), registered address, established/size facts, website. **Contacts** ("Who Tradex contacts for what — notifications follow these roles" + "Edit"): per contact name, role (primary/escalation, operations, accounts, catalog), email, phone; notification channels + consent date + quiet hours (G-26). **Permitted categories & locations** (anno "1B · §11.1 Permitted categories & locations set by Tradex"; "every submission, feed and PO is checked against this scope"; "Request category or location"): table. **Approval record** ("Kept for audit"): decision, reviewer, date, terms at approval → current, next review date, reasons, pilot addendum (approved by, scope, end date) |
| Table — permitted scope | Scope (category / location) · Conditions (e.g. grades) · Supply model · Decision (approved date / requested date) · Reviewer · Status (Active / Under review + note) |
| Permissions | View all vendor roles; "Request change" Admin (`API-M14-34` VEN admin role) |
| APIs | `API-M14-33` (profile, contacts, permitted scope, approval record, documents summary, payout status), `API-M14-34` (change requests), `API-M14-02` |
| Backend / data | BR-M14-02, BR-M14-03, BR-M14-10; E-supplier, E-vendor_approval, E-terms_version, E-approval_request |
| Status | NOT_STARTED |

Contacts "Edit" is a change request (BP §11.1 "approved contacts") → `API-M14-34` type contacts; there is no direct
contact write endpoint (property-level protection V6).

**Modal `#m-req` — Request a profile change**

| Field | Type | Req | Validation / source |
|---|---|---|---|
| What do you want to change? | select (add a permitted category / add a dispatch location / legal name or address / GSTIN (new registration) / contact details) | Y | `type` (`API-M14-34`) |
| Details | textarea | Y | — |
| Supporting documents | file (multiple) | C | `document_file_ids[]` (API-M14-34) — upload control not drawn in MK; required for legal/GSTIN changes (D-068) |

Callout "Changes are reviewed by Tradex vendor management. Your current approved profile stays in force until a
decision is recorded." (BP §11.3). "Submit request" → `API-M14-34` → 201 `{change_request_id, reviewer}`.

### 13.2 Tab `#documents` — Documents

| Property | Value |
|---|---|
| Purpose | Business and compliance documents with validity and verification state; renewals before expiry (BP §11.1 verification; §19.1 private files; MK anno "1B · GST, PAN, agreement v3 with validity dates") |
| Sections / components | Expiry callout ("<document> expires in n days … if it lapses, your account is suspended automatically and offers pause until it's verified" — automatic suspension on lapse is MOCKUP, D-068) + "Upload renewal"; documents table; upload row (document type select, "Upload document"; "PDF/JPG · max n MB · verified by Tradex within n working days" — samples) |
| Table | Document · Number / reference · Uploaded · Valid (no expiry / until date / expiring in n days / period) · Verification (verified date + method, e.g. registration check re-checked periodically; countersigned; under review; pending verification) · action (View / download / Upload) |
| Permissions | Admin uploads (`API-M14-35` VEN admin); all roles view per D-137; every view of an identity document is logged (MK "Sensitive fields … every view of a KYC file is logged") |
| APIs | `API-M14-33` (`documents[]`), `API-M22-01` (upload), `API-M14-35` (register document/renewal), `API-M22-02` (view — authorised, logged) |
| Backend / data | BR-M14-02; E-attachment (document metadata gap — see Entity gaps), E-supplier, E-terms_version (agreements) |
| Status | REQUIRES_DECISION (D-068 required documents & verification; D-112 scanning) |

### 13.3 Tab `#users` — Users & roles (and modal `#m-invite`)

| Property | Value |
|---|---|
| Purpose | Vendor admin manages the organisation's users, roles, MFA and sessions — own organisation only (BP §3.1, §18.1 Vendor column, §18.2 MFA; MK anno "1B · §18 Vendor users & roles — own organisation only") |
| Sections / components | **Users** ("Only people in your organisation · max n users" — sample; "Invite user"): table. **What each role can do** ("Fixed vendor roles · always limited to <org>'s records"): matrix Action × Admin / Catalog / Ops / Accounts — submit products & changes; bulk upload & catalog API; update availability · API key; confirm POs · send ASN; pilot fulfilment tasks; respond to returns (RTV) (Catalog/Accounts view); view statements; request bank change (Accounts maker, Admin checker); accept terms; manage users — note "Bank changes need two people on your side (maker + checker) and Tradex Finance verification". **Security & sign-in** ("Policy set by Tradex for all vendor accounts": MFA required within n days (methods), session timeout, password policy — samples, D-040/D-083; "Sign out other sessions"): table Recent sign-ins · Device · IP · Result (MFA ok / Blocked + reason, alert sent). Note "Tradex staff access to your account is logged; ask your vendor manager for the access report" (MOCKUP) |
| Table — users | User (avatar, name, email) · Role · MFA (On / Off + "Required by <date>") · Last active · Status (Active "You" / Active / Invited · expires / Deactivated · history kept) · actions (Change role, Reset password, Deactivate; Remind (MFA); Resend (invitation)) |
| Permissions | Admin only for user management; cannot deactivate the last admin (API-M14-38); own security for every user |
| APIs | `API-M14-36` (users + role matrix), `API-M14-37` (invite), `API-M14-38` (change_role, deactivate, send_password_reset, remind_mfa, sign_out_all), `API-M02-18` (resend invitation), `API-M02-15` (recent sign-ins — vendor admin org scope), `API-M02-11` ("Sign out other sessions" — own sessions), `API-M02-09`, `API-M02-10`, `API-M02-12`, `API-M02-13` (own password/sessions/MFA) |
| Backend / data | BR-M02-03, BR-M14-06; E-vendor_user, E-user_account, E-invitation, E-user_session (CONDITIONAL D-083), E-audit_event |
| Status | REQUIRES_DECISION (D-137 vendor roles, D-040 MFA methods, D-083 sessions) |

| Field (`#m-invite` "Invite a user") | Type | Req | Validation / source |
|---|---|---|---|
| Full name | text | Y | — |
| Work email | email | Y | MK: "Only @<vendor-domain> addresses can be invited" — domain rule not in any document → D-137 |
| Role | select (Catalog — products & submissions / Operations — availability, POs, tasks, returns / Accounts — statements, bank change requests / Admin — everything incl. users) | Y | Vendor role set D-137 |

Callout "MFA is required within n days" (sample; D-040). "Send invitation" → `API-M14-37` → 201; expiry sample (D-083).

### 13.4 Tab `#statements` — Supplier statement

| Property | Value |
|---|---|
| Purpose | Statement between the vendor and the company: invoices, payments, debit notes/TDS, running balance, holds — only if finance data is integrated (BP §11.2 "Relevant supplier statements if integrated") |
| Evidence | DOCUMENTED (BP §11.2) — REQUIRES_DECISION (D-011) · MOCKUP (anno "1B · Supplier statements (if finance integrated)") |
| Sections / components | Title "Supplier statement · <period>" + source note ("Between <vendor> and Tradex only · amounts incl. GST · source: Tradex accounts, synced <time>" — freshness, X11); period select (month / previous month / quarter / FY to date); "PDF", "CSV"; KPI tiles (balance payable to you; next payment run; on hold (reasons); last payment) — G-27; type segmented (All / Invoices / Payments / Debit notes & TDS); note "Invoices are matched to PO + GRN before they become payable (3-way match)"; table; footer "Tradex's selling prices and margins are never part of your statement. Questions? Raise a query on any line" |
| Table | Date · Document (+ type) · Reference (PO · GRN, UTR, RTV) · Payable to you · Paid / deducted · Balance · Status (Matched / Paid · reconciled / Applied / Part on hold / On hold · variance / Deducted) · "Query" |
| Permissions | Accounts/Admin vendor sub-roles |
| APIs | `API-M14-39` (period, type_filter, format json/pdf/csv; `404 FEATURE_DISABLED` when not integrated), `API-M14-40` (query on a line) |
| Backend / data | BR-M14-14, BR-M07-06; E-supplier_bill, E-accounting_export (payments from the accounting authority), E-support_ticket (queries) |
| States | Not integrated → tab hidden or notice "Statements are not available" (D-011) |
| Status | REQUIRES_DECISION (D-011) |

### 13.5 Tab `#terms` — Terms (and modal `#m-terms`)

| Property | Value |
|---|---|
| Purpose | Terms versions with effective dates and acceptance evidence; review and accept a new version (BP §11.1 "terms version"; MK anno "1B · Terms version history with acceptance evidence") |
| Sections / components | Pending-version callout (published date, review-by date, summary of changes, which version stays in force until acceptance/effective date) + "Review changes"; table; "What changed in vN" (clause · previous · new) |
| Table | Document (supplier terms, pilot addendum, applicant terms, marketplace seller agreement — "Phase 2 · not offered") · Version · Effective · Accepted (date · user) · Evidence (OTP / checkbox · IP) · Status (Awaiting your acceptance + review-by / Current / Superseded) · Review / download |
| APIs | `API-M14-41`, `API-M14-42`, `API-M02-02`/`API-M02-03` (OTP verification token) |
| Backend / data | BR-M14-15; E-terms_version, E-terms_acceptance |
| Permissions | Admin accepts (MK role matrix); all view |
| Status | REQUIRES_DECISION (D-188 terms-change process, D-040 OTP method) |

`#m-terms` — "Supplier terms vN — changes from vM" (published, takes effect): change table Clause · current · new;
checkbox "I have read supplier terms vN and accept them on behalf of <org>" (Y); "Decide later"; "Accept with OTP" →
OTP challenge (`API-M02-02` purpose `confirm_action`) → `API-M02-03` → `API-M14-42` (`verification_token`) → evidence
recorded (time, user, method, IP).

### 13.6 Tab `#bank` — Payout (bank) account

| Property | Value |
|---|---|
| Purpose | Show the current payout account (masked) and let the vendor request a change that the company verifies with maker–checker; payments continue to the current account until the change is approved (BP §11.5 "Require maker-checker control for payout-account changes"; §18.1 "Change payout account: Vendor — Submit change; Finance — Maker/checker"; MK anno "1B · §11.5 Maker-checker for payout-account changes") |
| Evidence | DOCUMENTED (BP §11.5, §18.1) · MOCKUP (verification steps) |
| Sections / components | **Current payout account** (bank, masked account, IFSC, type, account name, verification date/method/checker, last payment) — "All Tradex payments go here until a change is approved". **Change history** table (Request · Account (masked) · Outcome with reason). Fraud-warning callout ("Tradex will never ask you to change bank details by email, phone or WhatsApp. If you didn't request <id>, cancel it now and call <number>."). **Open change request** card: status, callout "Payments continue to <current> until this change is approved. The payment run on <date> will use the current account.", verification timeline (requested by maker (Accounts) with proof uploaded; confirmed by vendor admin with OTP — vendor-side checker; account-validation test; company finance document check; call-back to the registered number (to a different person than the requester); approval by company finance checker (different person from the handler); cooling-off period then effective with notifications); "Cancel change request"; "Request another change" (disabled while one is open) |
| Permissions | Accounts (maker) and Admin (checker on the vendor side, MK role matrix — vendor-side dual control is MOCKUP, I-13); company finance maker/checker (P-E14#approvals "Payout account", `API-M17-07` `log_callback`) |
| APIs | `API-M14-33` (`payout_account{masked, status}`), `API-M14-43` (submit change: write-only account details + proof file; `409 CHANGE_ALREADY_OPEN`), `API-M14-44` (cancel pending), `API-M22-01` (proof upload), history/status (G-28), `API-M02-02`, `API-M02-03` (OTP for the vendor-side confirmation) |
| Backend / data | BR-M14-09, BR-M02-06; E-supplier (`bank_details` PD2 — protection D-130), E-approval_request, E-attachment, E-audit_event |
| States | Account details never displayed unmasked; entry fields are write-only (BP §19.1); one open change at a time |
| Status | REQUIRES_DECISION (D-068 — collection timing, verification method, cooling-off; D-130) |

| Field (change request — form not drawn in MK; fields per `API-M14-43`) | Type | Req | Validation / source |
|---|---|---|---|
| Account holder name | text | Y | Must match the legal name (MK rejected example "must match legal name") — rule D-068 |
| Account number | text (write-only, masked after entry) | Y | Format; re-entry confirmation (design) |
| IFSC | text | Y | Format (India, D-059) |
| Account type | select | Y | — |
| Proof (e.g. cancelled cheque) | file | Y | `proof_file_id` (`API-M22-01`, private) |

### 13.7 Tab `#marketplace` — Marketplace · Phase 2 (locked preview)

Callout "Marketplace selling is a Phase 2 extension — not active for your account. This is a sample settlement
statement … Nothing here is calculated from your data or paid out." + "Notify me" (G-29); sample settlement table
Component · Basis & version · Amount (anno "2 · §11.5 Settlement components with basis & version") with disabled
"Download"; "How a settlement would flow" (delivered → return window closes → eligible settlement run → payout
requested ("Requested is not paid") → bank confirms → reconciled); "Decided before activation" list (BP §11.4 items).
Evidence LATER (BP §11.4, §11.5; D-046). Status: LATER — not built in Phase 1 unless the owner wants a static notice;
no data, no API.

### 13.8 CONDITIONAL / MOCKUP-ONLY / LATER items (P-V01–P-V04)

| Item | Screen | Label | Decision |
|---|---|---|---|
| PO confirmation / rejection / ASN with serials | P-V03#pos | MOCKUP-ONLY | D-131 |
| Supplier-fulfilment pilot tasks | P-V03#tasks, P-V01 | CONDITIONAL / PROPOSED-DEFAULT | D-007, D-008 |
| API key reveal (password + OTP) | P-V03#feed m-api | MOCKUP | D-083 |
| API key IP allow-list | P-V03#feed m-api | MOCKUP-ONLY | D-177 |
| Vendor-side maker/checker for bank changes | P-V04#bank, #users | MOCKUP | D-068 |
| Automatic suspension on document lapse | P-V04#documents | MOCKUP | D-068 |
| Vendor organisation switcher (org-card chevron) | shell | MOCKUP-ONLY | D-177 |
| Invitation restricted to the vendor's email domain; max users | P-V04#users | MOCKUP | D-137 |
| Announcements | P-V01 | MOCKUP | D-142 |
| Supplier statements | P-V04#statements | CONDITIONAL on integration | D-011 |
| Marketplace previews ("Sell directly", settlement sample, seller agreement row) | P-V01, P-V04 | LATER | D-046 |

---
## 14. Screen ↔ API matrix

Consumption per tab / drawer / modal (APIs from `06-api.md`; `G-xx` = gap in §16). Deltas against `06-api.md` §7.3:
this file additionally uses on P-E09 `API-M02-31`, `API-M03-02`, `API-M04-15`/`API-M21-03` (SKU search, G-06),
`API-M17-15`, `API-M17-18`, `API-M17-20`, `API-M18-04`, `API-M18-05`, `API-M19-06`, `API-M22-02`; on P-E10
`API-M05-10`, `API-M20-04`; on P-E11 `API-M03-02`, `API-M04-25`, `API-M06-29`, `API-M08-23`, `API-M17-02`,
`API-M17-15`; on P-E12 `API-M20-01`, `API-M24-03`; on P-E13 `API-M02-30` (audit link); on P-E14 the domain endpoints
behind recommended exception actions and `API-M24-08`; on P-E15 `API-M17-03` (second approver of a threshold change);
on P-V01 `API-M02-01`, `API-M14-18`, `API-M14-33`; on P-V03 `API-M02-02`, `API-M02-03`, `API-M22-02`; on P-V04
`API-M14-02`. `06-api.md` §7.3 maps `API-M14-23` and `API-M14-35` to P-V01 — in this plan the P-V01 PO KPI comes from
`API-M14-03` and document uploads happen on P-V04 (the P-V01 announcement "Upload" navigates there). P-E17 and
P-E18 (added 2026-09-30) match `06-api.md` §7.3 plus, on P-E17, `API-M02-01` (badge wording), `API-M02-27`
(delegating the screen, done on P-E15), `API-M02-43` (shell heartbeat and status control, §22.12), `API-M18-15`
(sidebar badge) and `API-M24-01` (`#m-recorded` content from configuration), and on P-E18 `API-M18-07` ("Schedule
email" opens P-E13).

| Screen | Tab / element | APIs |
|---|---|---|
| P-E09 | Page header and KPI strip (MK:erp-purchasing.html top) | API-M07-03, API-M07-05, API-M07-14, API-M07-18, API-M18-03, API-M18-04, API-M18-05 |
| P-E09 | Tab `#suggestions` — Reorder suggestions (rule A17) | API-M06-30, API-M07-01, API-M07-02, API-M17-09, API-M17-15 |
| P-E09 | Tab `#orders` — Purchase orders | API-M07-03, API-M07-05 |
| P-E09 | Drawer `#d-po` — Purchase order detail | API-M07-05, API-M07-06, API-M07-07, API-M07-08, API-M17-03, API-M22-02 |
| P-E09 | Tab `#new-po` — New purchase order (draft) | API-M03-02, API-M04-15, API-M07-01, API-M07-04, API-M07-06, API-M07-07, API-M07-18, API-M07-19, API-M17-18, API-M17-20, API-M21-03, API-M22-01 |
| P-E09 | Tab `#receive` — Goods receipt (GRN) | API-M02-31, API-M06-09, API-M07-03, API-M07-09, API-M07-10, API-M07-11, API-M07-12, API-M07-13 |
| P-E09 | Tab `#bills` — Supplier bills & three-way match | API-M07-14, API-M07-15, API-M07-16, API-M07-17, API-M19-06, API-M22-01 |
| P-E09 | Tab `#suppliers` — Suppliers | API-M07-18, API-M07-19 |
| P-E10 | Page header and KPI strip | API-M18-03 |
| P-E10 | Tab `#all` — All customers | API-M08-28, API-M08-29, API-M08-31, API-M08-32, API-M18-03 |
| P-E10 | Drawer `#d-360` — Customer 360 | API-M02-31, API-M08-29, API-M08-30, API-M08-45, API-M10-18, API-M13-03, API-M20-04 |
| P-E10 | Tab `#business` — Business accounts | API-M02-18, API-M05-10, API-M08-23, API-M08-24, API-M08-25, API-M08-26, API-M08-33, API-M08-35, API-M08-36, API-M08-37 |
| P-E10 | Modal `#m-suspend` — Suspend business account | API-M08-35 |
| P-E10 | Modal `#m-invite` — Invite a business account | API-M08-34 |
| P-E10 | Tab `#applications` — Dealer applications | API-M08-23, API-M08-38, API-M08-39, API-M08-40, API-M22-02 |
| P-E10 | Tab `#duplicates` — Duplicates (and modal `#m-merge`) | API-M08-41, API-M08-42, API-M08-43 |
| P-E10 | Tab `#privacy` — Consent & data requests | API-M08-44, API-M08-45 |
| P-E11 | Page header, launch-model callout and KPI strip | API-M04-39, API-M06-26, API-M14-47, API-M14-48, API-M14-55, API-M14-56 |
| P-E11 | Tab `#list` — Vendors | API-M14-45 |
| P-E11 | Drawer `#d-vendor` — Vendor detail | API-M14-46, API-M14-51, API-M14-52, API-M14-53 |
| P-E11 | Tab `#applications` — Vendor applications (onboarding decision) | API-M03-02, API-M04-25, API-M08-23, terms-version read: G-17, API-M14-48, API-M14-49, API-M14-50, API-M22-02 |
| P-E11 | Tab `#submissions` — Vendor submissions review (and modal `#m-vsdec`) | API-M04-39, API-M06-29, API-M14-54, API-M14-56, API-M17-02, API-M17-03, API-M24-01 |
| P-E11 | Tab `#freshness` — Availability feeds | API-M06-26, API-M06-27, API-M06-28, API-M17-15, API-M24-01 |
| P-E11 | Tab `#performance` — Vendor performance | API-M14-55 |
| P-E11 | Modals `#m-policy` and `#m-invite` | API-M14-47, API-M14-56, API-M24-02 |
| P-E12 | Page header, filters, KPI strip and overview panels | API-M11-04, API-M11-06, API-M11-16, API-M11-20, API-M18-03, API-M24-03 |
| P-E12 | Tab `#payments` — Payment attempts | API-M11-04, API-M11-05 |
| P-E12 | Drawer `#d-pay` — Payment attempt detail | API-M11-05, API-M11-06 |
| P-E12 | Tab `#events` — Webhook events | API-M11-07 |
| P-E12 | Tab `#recon` — Settlement reconciliation | API-M11-13, API-M11-14, API-M11-15, API-M11-16, API-M11-17, API-M11-19 |
| P-E12 | Modal `#m-import` — Import settlement or bank file | API-M11-13, API-M20-01, API-M22-01 |
| P-E12 | Tab `#refunds` — Refunds (and modal `#m-retry`) | API-M11-08, API-M11-10, API-M11-11, API-M11-12 |
| P-E12 | Tab `#cod` — COD remittance (conditional) | API-M11-13, API-M11-17, API-M11-18, API-M24-01, API-M24-02 |
| P-E12 | Tab `#export` — Accounting export & GST series | API-M19-06, API-M19-07, API-M19-08, API-M19-09 |
| P-E12 | Tab `#close` — Daily close | API-M11-20, API-M11-21 |
| P-E13 | Page header | API-M18-04, API-M18-06 |
| P-E13 | Section "Report catalogue" | API-M18-01 |
| P-E13 | Section "Open report" (viewer; example "Sales & returns by branch") | API-M03-02, API-M18-02, API-M18-03, API-M18-13, API-M18-14 |
| P-E13 | Modal `#m-export` — Export | API-M18-03 |
| P-E13 | Section `#schedules` — Scheduled reports (and modals `#m-schedule`, `#m-digest`) | API-M17-25, API-M17-26, API-M18-06, API-M18-07, API-M18-08, API-M18-09, API-M18-10 |
| P-E13 | Section "How exports work" and `#exports` — Recent exports | API-M18-04, API-M18-05 |
| P-E13 | Modal `#m-request` — Request a new report | API-M18-11 |
| P-E14 | Page header, KPI strip, value chart and health panel | API-M17-01, API-M17-05, API-M17-08, API-M17-13, API-M17-14, API-M17-15, API-M24-08 |
| P-E14 | Tab `#rules` — Rules | API-M17-08, API-M17-10 |
| P-E14 | Drawer `#d-rule` — Rule detail | API-M02-30, API-M17-09, API-M17-10, API-M17-11, API-M17-12 |
| P-E14 | Modals `#m-kill` and `#m-resume` | API-M17-10 |
| P-E14 | Tab `#runs` — Job runs (with failed-job incident panel) | API-M17-10, API-M17-15, API-M17-16, API-M17-17 |
| P-E14 | Tab `#exceptions` — Exception queue | API-M06-17, API-M06-19, API-M06-23, API-M06-25, API-M06-27, API-M11-09, API-M11-17, API-M17-05, API-M17-06, API-M17-07, API-M17-17, API-M20-03 |
| P-E14 | Tab `#approvals` — Approvals (and modal `#m-approve`) | API-M17-01, API-M17-02, API-M17-03, API-M17-04, API-M17-07 |
| P-E14 | Modal `#m-pauseall` — Pause automation | API-M17-14 |
| P-E14 | Modal `#m-propose` — Propose an automation rule | API-M17-13 |
| P-E15 | Page header and KPI strip | API-M02-20, API-M02-28, API-M02-29, API-M17-20, API-M24-03, API-M24-08 |
| P-E15 | Tab `#users` — Users | API-M02-18, API-M02-19, API-M02-20, API-M02-22, API-M02-23, API-M02-24 |
| P-E15 | Modal `#m-invite` — Invite a staff user | API-M02-21, API-M02-25, API-M03-02 |
| P-E15 | Tab `#roles` — Roles & permissions | API-M02-25, API-M02-26, API-M02-27 |
| P-E15 | Tab `#thresholds` — Approval thresholds (and modal `#m-thr`) | API-M17-03, API-M17-18, API-M17-19, API-M24-01, API-M24-02 |
| P-E15 | Tab `#delegation` — Delegation & emergency access (and modal `#m-ea`) | API-M02-30, API-M17-20, API-M17-21, API-M17-22, API-M17-23, API-M17-24 |
| P-E15 | Tab `#locations` — Company & locations | API-M03-02, API-M03-03, API-M03-04, API-M03-05, API-M03-06, API-M03-07, API-M03-08, API-M03-09 |
| P-E15 | Tab `#integrations` — Integrations | API-M24-03, API-M24-04, API-M24-05, API-M24-06, API-M24-07 |
| P-E15 | Tab `#audit` — Audit log (and drawer `#d-audit`) | API-M02-30, API-M18-03 |
| P-E15 | Tab `#system` — System | API-M24-08, API-M24-09 |
| P-E15 | Items not drawn in the mockup but required by this screen's APIs | API-M02-19, API-M02-29 |
| P-E17 | Page header and filter row | API-M02-01, API-M03-02, API-M18-03, API-M24-15, API-M24-17, API-M24-18 |
| P-E17 | KPI tiles | API-M18-15, API-M24-15 |
| P-E17 | Section "Live status board" (`#board`) | API-M24-15 |
| P-E17 | Section "How each area is being handled" (`#area-body`) | API-M24-15 |
| P-E17 | Section "Who is working where" (`#hm`) | API-M24-15 |
| P-E17 | Section "Activity" (`#feed`) | API-M02-30, API-M24-17 |
| P-E17 | Section "Alerts & unusual activity" (`#alerts`) | API-M02-34, API-M24-15, API-M24-18, API-M24-20 |
| P-E17 | Section "Performance" (`#perf-body`) | API-M24-15 |
| P-E17 | Drawer `#d-person` — person detail | API-M02-23, API-M02-30, API-M02-34, API-M24-16 |
| P-E17 | Modal `#m-recorded` — What Tradex records about staff activity | API-M24-01 |
| P-E17 | Modal `#m-rules` — Alert rules | API-M17-26, API-M20-09, API-M24-18, API-M24-19 |
| P-E17 | Items not drawn in the mockup (staff status control, heartbeat, delegation) | API-M02-27, API-M02-43, API-M24-01 |
| P-E18 | Page header and filter row | API-M03-02, API-M04-01, API-M18-03, API-M18-07 (via P-E13), API-M18-13, API-M18-14, API-M18-20 |
| P-E18 | Tab `overview` — Overview | API-M18-20 |
| P-E18 | Tab `sales` — Sales | API-M18-20 |
| P-E18 | Tab `products` — Products | API-M18-20 |
| P-E18 | Tab `customers` — Customers | API-M18-20 |
| P-E18 | Tab `store` — Store & operations (view `operations`) | API-M18-20 |
| shell(S) | Visit beacon (no visible UI; CONDITIONAL, D-285) | API-M09-03 |
| shell(V) / app | Vendor app — session, sign-in & files (pages outside MK) | API-M02-01, API-M02-04, API-M02-05, API-M02-06, API-M02-07, API-M02-08, API-M02-16, API-M02-17, API-M14-02, API-M22-01, API-M22-02 |
| shell(V) / app | Vendor shell (`assets/tradex.js` `buildWorkspaceShell` with `app = "vendor"`) | API-M02-01, API-M02-06, API-M02-09, API-M02-10, API-M02-11, API-M02-12, API-M02-13, API-M02-14, API-M14-02, API-M14-03, API-M20-01, API-M20-02, API-M21-03 |
| P-V01 | Header and account-state card | API-M02-01, API-M14-02, API-M14-03, API-M14-33 |
| P-V01 | KPI strip | API-M14-03, API-M14-18 |
| P-V01 | Section "Needs your action" | API-M14-03 |
| P-V01 | Section "Performance scorecard" | API-M14-03 |
| P-V01 | Section "Recent submissions" | API-M14-03, API-M14-07 |
| P-V01 | Sections "Announcements & policy updates", "Coming up", "What you can see", "Sell directly on Tradex" | API-M14-02, API-M14-03 |
| P-V02 | Page header | API-M14-12 |
| P-V02 | Tab `#listings` — Live listings | API-M14-04, API-M14-05, API-M14-06, API-M14-10 |
| P-V02 | Drawer `#d-listing` — Listing detail | API-M14-05, API-M14-06, API-M14-10 |
| P-V02 | Tab `#submissions` — Submissions | API-M14-07, API-M14-08, API-M14-09, API-M14-10, API-M14-11 |
| P-V02 | Tab `#new` — Submit product (new submission or change) | API-M14-06, API-M14-09, API-M14-10, API-M14-12, API-M14-34, API-M22-01, API-M22-03 |
| P-V02 | Tab `#bulk` — Bulk upload | API-M14-06, API-M14-12, API-M14-13, API-M14-14, API-M14-15, API-M14-16, API-M14-17, API-M22-01 |
| P-V03 | Tab `#feed` — Availability feed | API-M02-02, API-M02-03, API-M14-18, API-M14-19, API-M14-20, API-M14-21, API-M14-22, API-M22-01 |
| P-V03 | Tab `#pos` — Purchase orders (with drawer `#d-po`, modals `#m-reject`, `#m-asn`) | API-M14-23, API-M14-24, API-M14-25, API-M14-26 |
| P-V03 | Tab `#tasks` — Fulfilment tasks (supplier-fulfilment pilot) with modals `#m-decline`, `#m-evidence` | API-M14-27, API-M14-28, API-M14-29, API-M14-30, API-M22-01 |
| P-V03 | Tab `#returns` — Returns to vendor (with drawer `#d-rtv`) | API-M14-31, API-M14-32, API-M22-02 |
| P-V04 | Tab `#profile` — Profile | API-M14-02, API-M14-33, API-M14-34 |
| P-V04 | Tab `#documents` — Documents | API-M14-33, API-M14-35, API-M22-01, API-M22-02 |
| P-V04 | Tab `#users` — Users & roles (and modal `#m-invite`) | API-M02-09, API-M02-10, API-M02-11, API-M02-12, API-M02-13, API-M02-15, API-M02-18, API-M14-36, API-M14-37, API-M14-38 |
| P-V04 | Tab `#statements` — Supplier statement | API-M14-39, API-M14-40 |
| P-V04 | Tab `#terms` — Terms (and modal `#m-terms`) | API-M02-02, API-M02-03, API-M14-41, API-M14-42 |
| P-V04 | Tab `#bank` — Payout (bank) account | API-M02-02, API-M02-03, API-M14-33, API-M14-43, API-M14-44, API-M17-07 (company side, P-E14), API-M22-01 |

## 15. Screen ↔ role matrix

Legend: **F** full use of the screen within the role's authority · **A** acts on specific tabs/records (named) ·
**R** read only · **S** scoped (own location / team / organisation, named) · **—** no access. Monetary limits come from
D-024; staff role labels in the mockup map to these roles under D-222; vendor sub-roles under D-137. Record scope
qualifiers as in `06-api.md` §1.3. Server-side enforcement is authoritative (X2).

| Screen | R-catalog_staff | R-warehouse_staff | R-sales_support | R-branch_manager | R-finance | R-ops_admin | R-owner | R-vendor_applicant | R-supplier | R-integration |
|---|---|---|---|---|---|---|---|---|---|---|
| P-E09 Purchasing & receiving | — | A `#receive` (loc), R `#orders` (loc) | — | A buyer where assigned; `#receive` (loc); approve within threshold | A `#bills`; R POs, suppliers | F (buyer; approve within threshold) | F (high-value approval) | — | — | — |
| P-E10 Customers & dealers | — | — | A list, 360, business accounts (request price-list change, invite), applications (view) | S own location (D-029); decide applications (D-067); suspend | R (finance sections; applications view) | F (incl. merge D-133, data requests) | F | — | — | — |
| P-E11 Vendors & submissions | A submission review as designated reviewer (D-081); freshness actions | — | — | R freshness; buyer views where assigned | A tax/payout-sensitive reviews | F (onboarding, suspension, scope requests) | F (approvals, reinstatement) | — | — | — |
| P-E12 Payments & reconciliation | — | — | R attempts (loc); single-order provider check; own refund requests | — | F (maker; checker ≠ maker) | R + reconciliation runs | A checker, overrides with audit | — | — | — |
| P-E13 Reports | R per report permission | R per report permission | R per report permission | S own branch | A restricted finance reports, schedules | F | F (digest) | — | — | — |
| P-E14 Automation & exceptions | S own-team exceptions; propose rules | S own-team exceptions | S own-team exceptions | S branch exceptions; approvals within threshold; rule owner if named | A finance exceptions/approvals; R rules | F (rules, pause, all queues) | F (owner-level, high-value approvals) | — | — | — |
| P-E15 Settings, roles & audit | — (emergency-access request only) | S bin labels (loc); emergency-access request | — (emergency-access request) | S own team if delegated; bins (loc); own-branch audit; access-review reviewer | A thresholds; finance-object audit | F (privileged changes need second approver) | F | — | — | — |
| P-E17 Team & activity | — (403) | — (403) | — (403) | S own branch, only if the owner delegates (D-283 b): read, acknowledge, export | — (403) | A only if the owner delegates (D-283 b): read, acknowledge, rules, export | F (rules with MFA) | — | — | — |
| P-E18 Analytics | — | — | — | S own branch per D-286 (f); margin per D-286 (b) | R per D-286; margin per D-286 (b) | R per D-286; margin per D-286 (b) | F (incl. margin) | — | — | — |
| Vendor shell | — | — | — | — | — | — | — | S (state notice, profile) | F (sub-role gated) | — |
| P-V01 Vendor dashboard | — | — | — | — | — | — | — | S account-state card only | F own organisation | — |
| P-V02 Products & submissions | — | — | — | — | — | — | — | — (disabled, V7) | A Catalog / Admin sub-roles | A submissions API (key scope) |
| P-V03 Availability, POs, tasks, returns | — | — | — | — | — | — | — | — (disabled, V7) | A Operations / Admin; returns view Catalog / Accounts | A availability API (key scope) |
| P-V04 Business profile & statements | — | — | — | — | — | — | — | S profile, documents, terms | A Admin (users, terms, change requests, bank checker); Accounts (statements, bank maker); others read | — |

R-guest, R-consumer, R-dealer and R-seller (LATER) have no access to any screen in this file. Every staff role
sends its own presence from the workspace shell (`presence.self`, API-M02-43, when `CAP-STAFF_PRESENCE` is on) —
that is not access to P-E17.

## 16. API gaps found

> **Resolved 2026-09-27:** every gap below is resolved in `06-api.md` §8 "Gap resolution" (new endpoint ID, existing endpoint, or rejected with reason). Use the API IDs from `06-api.md`; the local gap refs here are historical.

Operations the screens need that have no endpoint (or an incomplete one) in `06-api.md`. No API IDs are invented here;
the API owner decides whether to extend an existing endpoint or add one.

| ID | Screen / element | Needed operation | Closest existing API | Source |
|---|---|---|---|---|
| G-01 | P-E09 header KPIs, `#orders` pipeline | Aggregated PO counts/values per status (+ "needs owner", "overdue", "unconfirmed" sub-counts) | `API-M07-03` (list only) | MK:erp-purchasing.html top, `#orders` |
| G-02 | P-E09 KPI "Receiving now", GRN lists | List goods receipts (in progress / posted) by location/PO | `API-M07-10` (detail only) | MK:erp-purchasing.html; BP §9.3 |
| G-03 | P-E09 `#suggestions` | Carry buyer-edited quantities per suggestion when creating draft POs | `API-M07-02` (`suggestion_ids[]` only) | MK "quantities editable before drafting" |
| G-04 | P-E09 `#d-po` | Define whether approval triggers sending to the supplier or an explicit "Send" is needed (MK shows no Send button; toast "Approved · PO will be sent to supplier") — decision D-176 | `API-M07-07` `send` | MK:erp-purchasing.html `#d-po` |
| G-05 | P-E09 `#d-po` partial callout | Change expected date / keep backorder on a sent or partially received PO | `API-M07-06` (drafts only) | MK "Keep as backorder with a new expected date"; BP §9.3 backorders |
| G-06 | P-E09 `#new-po` "Add line" | Purchasable-SKU lookup returning supplier code and last cost for a supplier | `API-M04-15`, `API-M21-03` (no supplier code / last cost) | MK `#new-po` lines |
| G-07 | P-E09 `#new-po` | Idempotent create/submit of a PO ("submitting twice returns the same PO") | `API-M07-04`, `API-M07-07` (not marked Idem) | MK; BP §17.5 |
| G-08 | P-E09 `#receive` header | Vehicle number and dock on a receipt | `API-M07-09` | MK `#receive` |
| G-09 | P-E09 `#receive` lines | Handling options: backorder with new ETA, cancel remaining, wait for more cartons, return over-receipt, accept over-receipt with PO amendment, reject substitution | `API-M07-11` (`accept, short, over_hold, substitution_request`) | MK `#receive`; BP §9.3 |
| G-10 | P-E09 `#suppliers` | Maintain supplier commercial terms (payment terms, MOQ/packs, RTV terms, contacts, feed methods) | `API-M07-18`/`API-M07-19` (read) | MK terms card; BP §14.1 master data; PR2 §10 |
| G-11 | P-E10 header | Customer KPIs (counts by type/state, active, repeat rate, dealer share, duplicates) | none | MK:erp-customers.html |
| G-12 | P-E10 `#privacy` | Consent summary (opt-in share per purpose/channel, opt-outs incl. STOP) | none | MK `#privacy`; BP §13.3 |
| G-13 | P-E10 header export | Export dataset "dealer accounts & price lists" | `API-M18-03` dataset list | MK export menu |
| G-14 | P-E11 header | Vendor KPIs (active by model, applications blocked, review queue age vs SLA, auto-accepted refreshes today, stale feeds, fill rate) | partial: `API-M14-48`, `API-M04-39`, `API-M06-26`, `API-M14-55` | MK:erp-vendors.html |
| G-15 | P-E11 `#marketplace` | Prerequisite decision statuses (LATER) | none | MK; BP §11.4 |
| G-16 | P-E11 `#applications`, `#m-invite` | Supplier-fulfilment pilot capacity (used / available) | none (configuration under D-007) | MK "pilot capacity: 1 of 1 used" |
| G-17 | P-E11 `#applications` | Staff read of supplier terms versions for the decision form | `API-M14-41` (vendor side only) | MK "Terms version" select; BP §11.1 |
| G-18 | P-E12 header | Finance KPIs (captured today, success rate, in flight, unmatched value/oldest, refunds open by state, export batch status) | `API-M11-04` summary (method mix, success) | MK:erp-finance.html |
| G-19 | P-E13 definitions | Report definition version history | `API-M18-02` (current definitions) | MK "history (v1.0 → v1.2)"; BP §14.4 |
| G-20 | P-E13 schedules | Scheduled delivery to external recipients (e.g. external accountant via OTP link) | `API-M18-07` (authorised users only) | MK schedules; BP §14.1 "scheduled files sent to accountants or suppliers" (D-075) |
| G-21 | P-E13 `#exports` | Team-scoped list of recent exports | `API-M18-04` (own; owner/ops all) | MK "Yours and your team's" |
| G-22 | P-E13 `#m-export` | Row-count estimate per export option (direct vs background job) | none | MK row options with counts; BP §14.4 row limits |
| G-23 | P-E14 `#exceptions` | Reopen a resolved exception | `API-M17-07` (no `reopen`) | MK "Reopen" |
| G-24 | P-E14 header / health | Automation KPIs, weekly hours-saved series, health summary (oldest queued job, retries 24 h, failed → exception), global pause state and last use | partial: `API-M17-08`, `API-M24-08` | MK:erp-automation.html; BP §12.4, §20.3 |
| G-25 | P-E15 header | Admin KPIs (accounts by state, MFA enrolment/grace, privileged count, active delegation, integration health, restore test) | partial: `API-M02-20`, `API-M17-20`, `API-M24-03`, `API-M24-08` | MK:erp-admin.html |
| G-26 | P-V01 note, P-V04 contacts | Vendor notification preferences (channels, quiet hours) | none | MK "Notification preferences are in Profile → Users", "quiet hours" |
| G-27 | P-V04 `#statements` | Statement summary (balance payable, next payment run, amount on hold with reasons, last payment) | `API-M14-39` (lines, totals) | MK statements tiles |
| G-28 | P-V04 `#bank` | Payout-account change history and status timeline (verification steps) | `API-M14-43` (create), `API-M14-44` (cancel), `API-M14-33` (current masked) | MK `#bank`; BP §11.5 |
| G-29 | P-V04 `#marketplace` | "Notify me" when marketplace opens (LATER) | none | MK |
| G-30 | P-V02 `#d-listing` (suspended) | Message the reviewer about a listing that has no open submission | `API-M14-11` (per submission) | MK "Contact reviewer" |
| G-31 | P-V02 `#submissions` | Vendor export of own submissions (emailed CSV) | none (`API-M18-03` is staff-only) | MK "Export CSV" |
| G-32 | P-V01 "Needs your action" | Completed action items ("Done this week") | `API-M14-03` (open actions) | MK |
| G-33 | P-V03 `#feed` CSV | Availability CSV template download | `API-M14-12` (submission templates), `API-M14-18` (current feed CSV) | MK "Template v2" |
| G-34 | P-V03 `#feed` API | Read API-key metadata (created, last used, expiry, scopes, rate limit) | `API-M14-21`, `API-M14-22` (rotate, reveal) | MK m-api |
| G-35 | P-V03 `#tasks` | Read shipment evidence of a shipped pilot task | `API-M14-27` (list) | MK "View evidence" |

## 17. Entity gaps found

> **Resolved 2026-09-27:** every gap below is resolved in `03-database.md` "Entity gap resolution (2026-09-27)". Use the entity/column definitions from `03-database.md`.

Fields or records the screens need that are not in `03-database.md` (existing entity → missing field, or no entity).

| # | Entity / concept | Missing | Needed by | Source | Label |
|---|---|---|---|---|---|
| EG-1 | E-supplier | MOQ / pack-size terms, supplier RTV/returns terms, feed/data-sharing methods | P-E09 `#suppliers`, `#new-po` checks | MK:erp-purchasing.html terms card | MOCKUP |
| EG-2 | E-goods_receipt | Vehicle number, dock; landed-cost charges and allocation basis | P-E09 `#receive` | MK; BP §9.3 (landed cost "if imported goods require it") | MOCKUP · CONDITIONAL (D-056) |
| EG-3 | E-purchase_order_line | Reason for unit cost above last cost | P-E09 `#new-po` | MK "reason needed" | MOCKUP |
| EG-4 | E-replenishment_suggestion | Buyer-adjusted quantity, dismiss reason, snooze-until | P-E09 `#suggestions` (API-M07-02 already takes `reason`, `snooze_until`) | MK | MOCKUP |
| EG-5 | E-attachment (or a new document record) | Document type, number, valid from/until, verification state, verified by/at, verification method | P-V04 `#documents`, P-E10 `#applications` checklist, P-E11 `#applications` checks | BP §8.3, §11.1; API-M14-35; MK | DOCUMENTED · D-067, D-068 |
| EG-6 | Vendor notification preferences | Channels, consent to WhatsApp, quiet hours per vendor contact/user | P-V01, P-V04 | MK:vendor-account.html contacts | MOCKUP |
| EG-7 | Payout-account change | Verification evidence (validation result, call-back record, vendor-side confirmation, cooling-off end) beyond the generic E-approval_request | P-V04 `#bank`, P-E14 approvals | BP §11.5, §18.1; MK | DOCUMENTED (maker-checker) · MOCKUP (steps) · D-068 |
| EG-8 | Vendor announcements | Announcement record (title, body, audience, validity) | P-V01 | MK:vendor-dashboard.html | MOCKUP · D-142 |
| EG-9 | E-report_schedule | External (non-user) recipients with secure delivery | P-E13 schedules | MK; BP §14.1 | REQUIRES_DECISION (D-075) |
| EG-10 | E-exception_case | Reopened state/history (state enum has no reopen) | P-E14 `#exceptions` | MK "Reopen" | MOCKUP |
| EG-11 | Supplier-fulfilment pilot capacity | Configuration key or record for pilot capacity (vendors / SKUs) | P-E11 `#applications`, `#m-invite` | MK | CONDITIONAL (D-007) — may be E-configuration_version |
| EG-12 | E-api_credential | IP allow-list | P-V03 `#feed` m-api | MK | MOCKUP-ONLY (D-177) |

## 18. Proposed new decisions

Reserved range D-175–D-179 (agent B2b). Status `OPEN` when added to `DECISIONS.md`. Documented options only; no
answer is chosen here. Decisions proposed in parallel by sibling plan files and **cited** in this file (pending
registration by the orchestrator): D-170, D-172, D-173, D-174 (`04b-frontend-workspace-1.md`); D-181
(`08-ecommerce.md`); D-185, D-186, D-187, D-188, D-189 (`09-vendor-marketplace.md`); D-191, D-192, D-193, D-194,
D-195, D-196, D-197, D-198 (`10-erp.md`). Where a question here was already covered by one of them, this file cites
that ID instead of proposing a duplicate (vendor performance score → D-187; vendor review/response deadlines →
D-185; auto-accept bounds → D-186).

| ID | Question | Documented options / proposal (source) | Approver | Blocks |
|---|---|---|---|---|
| D-175 | **Self-approval below a value threshold**: may a requester approve their own request when the value is below a (client-supplied) limit — e.g. the buyer self-approval tier for POs — and for which approval types? *(Complements D-196 in `10-erp.md`, which covers the general SoD rule set, warned combinations and accepted conflicts; orchestrator may merge.)* | BP §18.2 "Staff who initiate high-risk transactions should not approve their own requests where separation is feasible". MK:erp-purchasing.html `#new-po` shows a tier "Buyer self-approval ≤ ₹1 L" **and** the note "The creator can't approve their own PO"; MK:erp-automation.html `#approvals` shows "Cannot self-approve" on the requester's own price change. Options: (a) no self-approval for any approval type; (b) self-approval allowed below per-control thresholds (D-024), audited, for named approval types only | Owner / finance | `API-M07-07` submit outcome, `API-M17-03` self-approval guard, BR-M02-06, P-E09 `#new-po` tier display |
| D-176 | **Purchase-order transmission to suppliers**: once a PO is approved, is it sent automatically or only by an explicit "Send" action, through which channel(s) (email; vendor portal once 1B is live; both), and what reminder/escalation applies to POs the supplier has not acknowledged? | BP §9.2 ("Purchase order issued … Evidence: Approved purchase order"), §9.3, §11.2 (suppliers "View purchase orders"); 05-backend §5.7 "supplier PO transmission via email/portal (M14/M20)"; `API-M07-07` actions `send`, `remind_supplier`. MK:erp-purchasing.html `#d-po`: no "Send" button, toast "Approved · PO will be sent to supplier", timeline "Sent to supplier (email + vendor portal) … reminder at 48 h" (sample); MK:vendor-dashboard.html "Unconfirmed POs are escalated to Tradex purchasing at 18:00" (confirmation itself is D-131). Options: (a) automatic send on approval; (b) explicit send by the buyer after approval; channel (email only in 1A; portal from 1B; both) | Owner / operations | `API-M07-07` behaviour, P-E09 `#d-po` footer and timeline, P-V03 `#pos`, M20 PO templates (D-058), G-04 |
| D-177 | **Mockup-only controls on P-E09–P-E15 and the vendor portal not covered by an existing decision** — build, defer or drop each: (1) purchase-budget check on new POs; (2) admin IP allow-list; (3) vendor API-key IP allow-list; (4) organisation switcher on the vendor org card (a vendor user belonging to several vendor organisations; the ERP org-card switcher is D-170) | Not in BP/PR/MEET. MK:erp-purchasing.html `#new-po` "Budget: purchase budget n % used (sample)"; MK:erp-admin.html `#system` "Admin MFA + IP allow-list"; MK:vendor-availability.html m-api "IP allowlist"; MK `assets/tradex.js` org card chevron. Related: BP §19.1 (security controls), §3.3 (organisation boundaries). Options per item: launch / later / not built | Owner / technical lead | P-E09 `#new-po` checks, P-E15 `#system`, P-V03 m-api, vendor shell org card, E-api_credential, E-vendor_user uniqueness (supplier, user) |
| D-178 | **Matching and duplicate-detection rule parameters**: supplier-invoice duplicate detection (look-back window, number normalisation, near-match criteria, block vs flag), customer duplicate-candidate criteria (which identifiers are "strong", how many are required), settlement/bank auto-matching tolerances and schedule | A25 "Match supplier invoice/document keys — staff reviews near matches"; BP §9.3 duplicate supplier invoice detection; BP §13.4 "Never merge customers because names match"; A10 "unmatched or partial entries to finance". MK samples: 12-month window, separators removed, "same amount ±1 % flagged, not blocked" (erp-purchasing `#bills`); "at least two strong identifiers (verified phone, verified email, GSTIN or matching delivery address + one verified contact)" (erp-customers `#duplicates`); "auto-matched daily at 07:15", fee mismatch (erp-finance `#recon`). Related but separate: D-024 (3-way-match monetary tolerance), D-133 (whether merge is built), D-064 (settlement file format) | Finance / operations | BR-M07-07, `API-M07-15`, `API-M08-41`, `API-M11-13`, `API-M11-16`, P-E09 `#bills`, P-E10 `#duplicates`, P-E12 `#recon` |
| D-179 | **Approval and review deadlines, reminders and escalation timing (non-vendor)**: default approval deadline, working hours used for deadlines, escalation to the alternate on expiry, reminder cadence, inclusion in the owner digest, never auto-approve; review-queue target for dealer applications; daily-close deadline; refund-failure response target; recurrence threshold that triggers a policy review. *(Vendor-related deadlines are D-185 in `09-vendor-marketplace.md`; orchestrator may merge the two.)* | BP §18.2 "Set a deadline, alternate approver, escalation rule, and outcome"; §12.6 recurring exceptions → improve policy; §11.3 "approval policy without bottlenecks"; A16 "escalate to a manager once; avoid alert storms". MK samples: erp-admin `#thresholds` (default deadline 4 working hours TBC; escalate once to alternate; still pending → owner digest, never auto-approved; working hours; ≥ 5 similar approvals/month → policy review); erp-customers ("SLA 2 working days" for dealer applications); erp-finance (daily close "deadline 19:00", failed refund "SLA 6 h"). Related: D-185 (vendor deadlines), D-138 (exception due times), D-025 (alternates), D-074 (support SLA) | Owner / operations | E-approval_request due/escalation fields, `API-M17-01`, BR-M17-06, BR-M17-12, P-E10 `#applications`, P-E12 `#refunds`/`#close`, P-E14 `#approvals`, P-E15 `#thresholds` |

## 19. Registry additions requested

| Registry | Requested addition | Justification | Source | Label |
|---|---|---|---|---|
| Entity (M08/M14/M22) | Verification-document metadata — either a new entity (e.g. business/vendor document record) or columns on E-attachment (type, number, valid_from/until, verification state, verified_by/at, method) | Vendor and dealer documents have validity and verification state shown to staff and vendors; renewals and expiry-driven actions depend on them | BP §8.3, §11.1; API-M14-35, API-M08-39; MK:vendor-account.html `#documents`, erp-customers.html `#applications`, erp-vendors.html `#applications` | DOCUMENTED / MOCKUP (D-067, D-068) |
| Entity (M20) | Notification preference (per staff/vendor user or vendor contact: channel, consent, quiet hours) | Vendor notification channels and quiet hours are shown and editable in MK; M20 has no preference record (E-consent_record is customer consent) | MK:vendor-account.html contacts, vendor-dashboard.html note | MOCKUP (G-26) |
| Entity (M14) | Payout-account change request with verification evidence (or agreed fields on E-approval_request) | Maker–checker for payout-account changes with call-back and validation evidence | BP §11.5, §18.1; MK:vendor-account.html `#bank` | DOCUMENTED / MOCKUP (D-068) |
| Entity (M14) | Vendor announcement | Only if D-142 decides a managed source for vendor-portal announcements | MK:vendor-dashboard.html | REQUIRES_DECISION (D-142) |
| Entity (M07) | Landed-cost charge (or struct on E-goods_receipt) | Only if D-056 enables landed-cost allocation | BP §9.3; MK:erp-purchasing.html `#receive` | CONDITIONAL (D-056) |
| Page | Vendor sign-in / invitation acceptance / own security page (e.g. a P-V entry or part of the vendor shell) | Required by API-M02-04/05/16/17 and BP §19.1 authentication; no mockup screen exists (06-api API-M02-04 "no mockup screen") | BP §11.1, §18.2, §19.1 | DOCUMENTED (no MK) · D-040 |
| Page | Staff access-review reviewer view (part of P-E15) | Required by API-M02-29; not drawn in MK | BP §24.3, §20.1; MK:erp-admin.html "Start access review" | MOCKUP |

No new modules or roles are requested (vendor sub-roles stay under D-137; staff job titles under D-222).

## 20. Inconsistencies found (for the orchestrator)

| # | Finding | Sources | Handling here |
|---|---|---|---|
| I-1 | PO approval tiers include "Buyer self-approval" while the same panel states "The creator can't approve their own PO" | MK:erp-purchasing.html `#new-po`; BP §18.2 | D-175 |
| I-2 | Receipt QC can be captured through two endpoints: `API-M07-11` (`qc_units`) and `API-M06-09` (`context=receipt`) | 06-api §3.5, §3.6 | Plan uses `API-M07-11` for the draft and `API-M06-09` for inspection records; API owner to confirm one path |
| I-3 | "Rule settings" on P-E09 links to the automation screen (rule A17), while 06-api maps "Rule settings" to per-SKU `API-M06-30` | MK:erp-purchasing.html; 06-api API-M06-30 | Both kept: rule A17 definition in P-E14, per-SKU parameters in P-E08 |
| I-4 | `API-M08-30` (customer notes) is labelled MOCKUP / NOT_STARTED, but E-internal_note is MOCKUP-ONLY under D-134 | 06-api §3.7; 00-conventions §7.1 | Treated as MOCKUP-ONLY (D-134) |
| I-5 | `API-M08-43` (customer merge) is labelled DOCUMENTED (BP §13.4) while D-133 / 00-conventions §7.1 treat merge as MOCKUP-ONLY | 06-api §3.7; DECISIONS D-133 | Treated as MOCKUP-ONLY (D-133) |
| I-6 | Minimum customer data for pilot tasks: staff drawer says "name, phone & address"; vendor portal shows name, city, masked phone and masked PIN (label carries the address) | MK:erp-vendors.html `#d-vendor`; MK:vendor-availability.html `#tasks`; BP §11.2 | Portal version + BP §11.2; field set D-007/D-153 |
| I-7 | Automation rule "A13.2 Courier tracking sync" is not a BP §12.2 ID | MK:erp-automation.html; BP §12.2 | Kept as MOCKUP sub-rule (03-database notes the same); launch set D-078 |
| I-8 | BP §5.1 places "approvals" in 1B (MK anno "1B · R06 Approvals") although 1A flows need approval decisions | BP §5.1; MK | Queue tab 1B; 1A decisions from owning screens; D-192 |
| I-9 | Thresholds tab proposes "until values are signed off, route these cases to the owner" — a default not in BP | MK:erp-admin.html `#thresholds`; BP §18.1 | REQUIRES_DECISION (D-024) |
| I-10 | Permission matrix shows three rows not in BP §18.1 (view supplier cost & margin; pause an automation rule; manage integrations & secrets) | MK:erp-admin.html `#roles` | MOCKUP extension; `07-auth-roles-permissions.md` / D-222 |
| I-11 | BP §30.1 lists "templates" under Administration; MK places message templates in P-E05 and has no document-template screen | BP §30.1; MK | Noted in §8.11 (D-055) |
| I-12 | Vendor API sample path `PUT /v1/vendor/availability` differs from `API-M14-19` `POST /v1/vendor/availability-updates` | MK:vendor-availability.html m-api; 06-api | Paths provisional (D-080) |
| I-13 | MK shows vendor-side maker (Accounts) + checker (Admin) for bank changes in addition to company finance maker–checker; BP places maker–checker on the finance side | MK:vendor-account.html `#users`, `#bank`; BP §11.5, §18.1 | Vendor-side dual control MOCKUP (D-068) |
| I-14 | Freshness sample timings differ between pages: stale at 24 h / hidden at 72 h (vendor portal), suspended at 3× deadline (erp-vendors), "auto-suspend at 36 h" (erp-vendors timeline), "suspend at 48 h" (erp-automation) | MK pages | All samples → D-028 |
| I-15 | MK thresholds callout cites "decision log D-07" — the mockup's own numbering, unrelated to DECISIONS.md D-007 (vendor model) | MK:erp-admin.html | Ignore the MK reference; thresholds are D-024 |
| I-16 | Vendor model enums differ: 03-database E-vendor_application `proposed_model {supplier_reseller, supplier_fulfilment, marketplace_seller}` vs 06-api API-M14-01 `model {supplier, supplier_fulfilment_pilot, marketplace_waitlist}` | 03-database §2.12.1; 06-api §3.13 | DB/API owners to align names |
| I-17 | Report catalogue in MK adds "Inventory extract (accountant)" and "Branch comparison" to the 13 BP §14.3 reports | MK:erp-reports.html; BP §14.1, §14.3, §30.1 | Kept with sources (BP §14.1, §30.1); launch set D-075 |

---

## 21. SaaS additions — the vendor portal is configuration-driven (2026-09-28, `D-227`)

Architecture: `19-saas-platform.md` §6.5, §9, §11.

| Rule | Detail | Task |
|---|---|---|
| VND-1 | The vendor portal itself is a capability (`CAP-VENDOR_PORTAL`). A store that does not use vendors has no portal, no routes, no bundle and no sign-in page for it | `T-1A.1-M31-02` |
| VND-2 | Submission form fields, availability-feed columns and fulfilment-task types come from the pack's **vendor profile**, so a fashion vendor submits sizes and colourways where an electronics vendor submits serials and condition | `T-1B.1-M32-01` |
| VND-3 | Every label and message comes from a terminology token | `T-1A.1-M31-06` |
| VND-4 | A vendor user belongs to one store and one vendor organisation. Cross-store vendor access does not exist, and a credential from one store is unauthenticated on another | `T-1A.2-M02-10` |
| VND-5 | No vendor screen shows another store, a category or template list, or any platform vocabulary; the vendor sees a portal built for their client's business | `T-1A.3-M31-01` |
| VND-6 | Vendor terminology, help content (X20) and responsive behaviour (X16) apply to whatever screen set the configuration produces | `T-1B.1-M14-16`, `T-1B.1-M14-17` |

Read §1–§20 as the specification of the vendor portal **for a store configured with `VP-electronics`**.

---

## 22. P-E17 — Team & activity (`erp-team.html`)

Added 2026-09-30 for the client feedback `CF1 §2` (`D-282` DECIDED; policy `D-283` OPEN). Cross-cutting rules §1
apply. Every name, time, count, limit, target, threshold and retention period on this screen is a sample (§0.2).

### 22.0 Summary card

| Property | Value |
|---|---|
| Purpose | The owner's view of the team: who is working now and on what, what each person did today, how every workspace area is being handled, rule-based alerts on unusual activity, and performance over complete days compared within the same role (CF1 §2: "monitor each employee", "check the activities performed by each employee", "check the current status of each employee", "monitor how employees are handling the REP section" — read as the ERP section, D-282) |
| Evidence | DOCUMENTED (CF1 §2) · MOCKUP (MK:erp-team.html; anno "1A · CF1 Employee monitoring …") · scope and the recorded / never-recorded lists DECIDED (D-282) · policy REQUIRES_DECISION (D-283) |
| Route | NOT SPECIFIED — MK `erp-team.html` (no tabs; sections: KPI tiles, "Live status board", "How each area is being handled", "Who is working where", "Activity", "Alerts & unusual activity", "Performance"); drawer `#d-person` (tabs `pd-today`, `pd-areas`, `pd-perf`, `pd-sess`, `pd-sens`, `pd-access`); modals `#m-recorded`, `#m-rules`. Sidebar group Overview → "Team monitor" with a badge (open serious and critical alerts) |
| Module / folder | M24 (screen), M02 (presence, work-item events, audit tags), M17 (staff alerts) · `MOD-administration` · `frontend/workspace/` if D-004 = custom |
| Phase · reqs | 1A · CF1 §2 · BP §18.2 (individually attributable accounts), §19.1 (audit), §12.5 (owner exception view) · T-1A.2-M02-11 (activity capture), T-1A.14-M17-13 (alert rules), T-1A.16-M24-12 (screen), T-1A.16-M24-13 (help), T-0-M09-07 (client review) |
| D-004 native-vs-custom considerations | (1) The core candidates have native user lists and audit trails (as for P-E15) but no presence board, per-area handling view or people × areas view. (2) The data the screen needs — area and work-item tags on audit events, presence intervals, work-item events, staff alerts — are extension records whichever UI is chosen (T-1A.2-M02-11, T-1A.14-M17-13). (3) Owner-only and read-mostly; BP §30.1 "build custom staff UI only where it materially improves a frequent task" applies. **Not decided — D-004.** |
| Roles | R-owner; R-ops_admin and R-branch_manager (own branch only) only if the owner delegates (D-283 b); every other staff role has no navigation entry and gets 403 for the route and its endpoints — detail §22.13 |
| Capability | Screen and navigation entry `CAP-TEAM_MONITOR`; presence `CAP-STAFF_PRESENCE`; alerts, alert tile, sidebar badge and rules `CAP-STAFF_ACTIVITY_ALERTS`; audit-log links `CAP-AUDIT_VIEWER` (`21` §4) |
| Status | REQUIRES_DECISION (D-004, D-101, D-283) |

### 22.1 Page header and filter row

| Element | Content | API | Label · status |
|---|---|---|---|
| Crumbs / title / subtitle | Overview; "Team & activity"; "Who is working, what they are doing and how each part of the workspace is being handled · live · updated <time>" (freshness, X11) | API-M24-15 `as_of` | MOCKUP |
| Badge "Visible to the owner only" | Lock badge; the wording follows the actual delegation (a delegated branch manager sees their branch named) | API-M02-01 | MOCKUP · REQUIRES_DECISION (D-283 b) |
| "What is recorded" | Opens `#m-recorded` | — | DECIDED (D-282) |
| "Alert rules" | Opens `#m-rules` | API-M24-18 | MOCKUP |
| "Export" | CSV of today's team activity for the current filters, only what the caller may see; the export itself is audited (toast "Export queued …") | API-M18-03 (dataset `team_activity`) | MOCKUP · REQUIRES_DECISION (D-152) |
| Period `#f-period` | Segmented Live · Today (default) · 7 days · 30 days. Live limits the activity list to the last 60 minutes; 7 / 30 days change only the performance table; KPI tiles, board, area table and heatmap are always live / today (help `f-period`) | API-M24-15 `period`, API-M24-17 `period` | MOCKUP |
| Location `#f-loc` | "All locations" + each location | API-M03-02 | MOCKUP |
| Team `#f-team` | All teams · Warehouse · Sales & branches · Support · Catalog & pricing · Finance · Management — no entity holds a team; grouping from roles / job titles | API-M24-15 `team` | MOCKUP · REQUIRES_DECISION (D-222) |
| Workspace area `#f-area` | "All workspace areas" + the 14 areas in menu order | API-M24-15 `area_key`, API-M24-17 `area_key` | MOCKUP |
| Person search `#f-q` | "Search a person…" — name or job title | `q` | MOCKUP |
| Count `#flt-count` | "Showing n of N staff on today's roster" + "Clear filters" when any filter is set | — | MOCKUP |

Filter scope (MK anno "Filters scope the status board, heatmap rows, activity, alerts and performance"): the area
table always covers all locations and highlights the selected area; the location filter narrows only who is shown
as working there (help `f-location`, `f-area`). T-1A.16-M24-12 AC 1: filters change the board, feed and
performance table consistently.

### 22.2 KPI tiles

| Tile (MK label) | Value · foot | Response field (API-M24-15 `kpis`) | Label · status |
|---|---|---|---|
| "On shift now" | n / scheduled; foot explains the gap ("1 on leave", "n not signed in", "n starts later") | on_shift, scheduled, on_leave, not_signed_in, starts_later | MOCKUP · REQUIRES_DECISION (D-283 — needs a roster/leave source, §22.12 #1) |
| "Active now" | n; "worked in Tradex in the last 10 min"; half-hourly sparkline | active_now | MOCKUP · window sample (D-283 c) |
| "Idle now (10+ min)" | n; names with minutes, longest first | idle_over_threshold[] | MOCKUP · threshold sample (D-283 c) |
| "Actions recorded today" | n; delta vs the same weekday; sparkline | actions_today, actions_comparison | MOCKUP · comparison basis D-173 |
| "Work items handled today" | n; "median n min each"; sparkline | items_handled_today, median_handling_minutes | MOCKUP |
| "Open alerts" | n; "n serious or critical" — the same count as the sidebar badge | open_alerts, open_alerts_serious; badge via API-M18-15 | MOCKUP · `CAP-STAFF_ACTIVITY_ALERTS` |

Tile definitions follow X18 (D-173). The status key and the tile use one idle rule (MK sample: 10+ min,
D-283 c); the alert rule "20 min idle while work is waiting" is a separate alert threshold (D-283 f).

### 22.3 Section "Live status board" (`#board`)

| Property | Value |
|---|---|
| Purpose | One card per person on today's roster: status, current activity, today's counts and open-item load (CF1 §2 "current status of each employee") |
| Evidence | DOCUMENTED (CF1 §2) · MOCKUP (anno "1A · CF1 Employee monitoring · status board (D-282)") |
| Route | MK `#board`; status groups `#sg` |
| Sections / components | Header sub "n of N on today's roster (n more on their weekly day off) · presence from Tradex activity only · updated <time>"; segmented `#sg` All · Active · Idle · Break or away · Not working, each with its count; "Status key" legend: Active · Idle (no activity 10+ min) · On break · In a meeting / away · Offline · On leave · Not yet signed in; card grid; foot "Presence is worked out only from activity inside the Tradex workspace; staff can set 'On break' or 'In a meeting' themselves." + "What is recorded →" (`#m-recorded`) |
| Card | Avatar with a status-coloured ring (dashed when on leave); name (button → `#d-person`); job title · location; status pill with text + "since" / "last action" time; current or last activity with icon and a link to its area; optional tag (e.g. "Acting for owner until …", "Extra role · leave cover", "Temporary · until …", "Two-step sign-in not set up", "Signs in with SMS code", "New starter"); counters actions today · items handled · median time ("—" when not working); "Open items" meter n / capacity (amber, then red as it fills; notes "Queue full", "Still assigned while on leave — reassign"); foot: device and sign-in network/branch label, open-alert badge. A click anywhere on the card opens the drawer |
| Ordering | Active, idle, on break, in a meeting, not signed in, offline, on leave (help `board`) |
| States | **Empty** "No one matches — Clear the filters or choose All to see everyone." **Stale presence**: when presence is older than the heartbeat window the "updated" time says so and statuses read "last seen <time>" (X11; T-1A.16-M24-12). **Presence off** (`CAP-STAFF_PRESENCE`): ring, idle / break / away statuses, "since", the Idle tile and the status key are absent; cards keep role, last activity from the audit log and counters. Status is never colour-only (X13) |
| Permissions | `team.monitor.read`; R-branch_manager own branch (D-283 b); the owner is not on the board (MK) |
| APIs | API-M24-15 (`sections` kpis, board) |
| Backend / data | E-staff_presence_interval, E-work_item_event, E-audit_event, E-user_account, E-user_role_assignment, E-staff_alert (`03` §13) |
| Related | `#d-person`; P-E15 `#users` |
| Phase · reqs | 1A · CF1 §2 |
| Status | REQUIRES_DECISION (D-283 — idle threshold, self-set statuses, roster/leave, open-item capacity) |

### 22.4 Section "How each area is being handled" (`#area-body`)

| Property | Value |
|---|---|
| Purpose | One row per ERP workspace area showing whether the work is keeping up — the plan's reading of "how employees are handling the REP section" (CF1 §2; D-282) |
| Evidence | DOCUMENTED (CF1 §2 as read by D-282) · MOCKUP (anno "1A · CF1 Employee monitoring · ERP area handling (D-282)") |
| Sections / components | Header sub "Every part of the ERP workspace · today until <time> · all locations"; summary "n on track · n at risk · n behind"; table; foot legend "On track = within targets · At risk = a target is close to being missed or cover is missing · Behind = targets are being missed now. Targets are samples (TBC)" + "Service reports →" (P-E13) |
| Table | Workspace area (icon + name, link to the area's screen) · Open (count + note, e.g. "4 past reply target") · Handled today (count + note) · Oldest waiting (age + record / note) · Target met (% or "—" + "no target") · Median time (+ what it measures, e.g. "pick → packed") · Working now (avatars of active people; others listed with their status; "Nobody right now") · Overrides (count + note, e.g. "6 discounts above limit · 1 price") · State (On track / At risk / Behind, icon + text, with the reason underneath) |
| Rows | The 14 areas in menu order: Orders, Pick · pack · dispatch, Returns & warranty, Support inbox, Products (catalog), Pricing & tiers, Inventory & serials, Purchasing & receiving, Customers & dealers, Vendors, Payments & reconciliation, Reports, Automation, Settings & access — only areas whose module the store has (`21` §4). P-E01, P-E17 and P-E18 are not rows |
| Filters | `#f-area` highlights the row (`sel`); location narrows "Working now" only |
| States | Area without a target → "—" and "no target"; the state is always written, never colour-only |
| Permissions | `team.monitor.read`; R-branch_manager own-branch figures (D-283 b) |
| APIs | API-M24-15 (`sections` areas) |
| Backend / data | E-work_item_event (open, handled, waiting, target met, median), E-audit_event (overrides), E-staff_presence_interval (working now). Each row must match the open-item count of the area's own screen (T-1A.16-M24-12 AC 2) — same sources as API-M18-15 / API-M18-16 |
| Related | P-E02…P-E15 (row links), P-E13 |
| Status | REQUIRES_DECISION (D-283 — per-area service targets and the at-risk / behind rules; definitions D-173) |

### 22.5 Section "Who is working where" (`#hm`)

| Property | Value |
|---|---|
| Purpose | People × areas heatmap of the actions recorded today |
| Evidence | MOCKUP (anno "1A · CF1 Employee monitoring · who works where (D-282)") |
| Sections / components | Header sub "Actions recorded today per person and workspace area · darker blue = more actions"; grid: rows = people (avatar + short name, grouped by team), columns = the 14 areas (short labels), cell = actions today ("·" for none); single-hue sequential blue ramp (11 steps, 1 … 55+) with a "none" swatch; tooltip "<person> · <area>: n actions today, x % of <person>'s n actions"; keyboard: focus the grid, arrow keys, Home / End, Enter opens the person; the area filter fades the other columns; "Table view" `#hm-toggle` → `#hm-table` (Person · 14 areas · Total, totals row) (04b §2.19 #3, X13) |
| States | Empty "No one matches — Clear the filters to see everyone." |
| Permissions | `team.monitor.read` |
| APIs | API-M24-15 (`sections` heatmap) |
| Backend / data | E-audit_event (actor × area, today) |
| Status | REQUIRES_DECISION (D-283) |

### 22.6 Section "Activity" (`#feed`)

| Property | Value |
|---|---|
| Purpose | Staff actions in plain language, newest first (CF1 §2 "check the activities performed by each employee") |
| Evidence | DOCUMENTED (CF1 §2) · MOCKUP (anno "1A · CF1 Employee monitoring · activity feed from the audit log (D-282)") |
| Sections / components | Header sub by period ("Last 60 minutes (since …)", "Staff actions today in plain language · newest first", "Showing today · for the last 7 days open the audit log"); "Audit log →" (P-E15 `#audit`); chip bar `#feed-chips` "Show": All · Sensitive only · Money · Stock · Prices & discounts · Access & exports, each with a count; rows: time, avatar, person (button → drawer) + action text, record link, area link or "Sign-in", flag badges; "Show all n" / "Show fewer" (first 12); foot flag key: Sensitive · Delegated authority · After hours · Needed approval · Emergency access ("Raised an alert" also appears in the drawer) |
| Filters · search | period, location, team, area, person search, chip → API-M24-17 (`period`, `location_id`, `team`, `area_key`, `user_id`, `q`, `chip`) |
| States | Empty "No activity matches — Change the filters or choose All." |
| Permissions | `team.monitor.read`; before/after values are not shown here (audit-log rules, D-153) |
| APIs | API-M24-17; API-M02-30 through the "Audit log →" link |
| Backend / data | E-audit_event (`area`, `work_item_ref`), E-delegation, E-approval_request, E-staff_alert |
| Status | REQUIRES_DECISION (D-283 — the working hours behind "After hours") |

### 22.7 Section "Alerts & unusual activity" (`#alerts`)

| Property | Value |
|---|---|
| Purpose | Rule-based alerts on unusual staff activity (no AI), newest and most serious first |
| Evidence | MOCKUP (anno "1A · CF1 Employee monitoring · rule-based alerts, no AI (D-282)") · D-282 |
| Sections / components | Header sub "Rule-based checks · no AI · n open · n acknowledged"; "Rules" → `#m-rules`; alert rows: severity pill (Critical / Serious / Warning, icon + text), title, person, time, record link, what happened, "Why flagged:" rule text + "Threshold: <value>" with a "sample · TBC" tag; actions Acknowledge · Open person · Open record · Reassign (only on "Open work assigned to someone on leave"); acknowledged rows dimmed with "Acknowledged by you · <time>"; foot "Why flagged names the rule and its sample threshold. Acknowledge records that you have seen it; it does not accuse anyone." |
| Ordering | Open before acknowledged; then critical, serious, warning |
| States | Empty "No alerts — Nothing unusual for the people and areas in your filters."; the whole section is absent when `CAP-STAFF_ACTIVITY_ALERTS` is off |
| Permissions | See: `team.monitor.read`; acknowledge: `team.alert.ack` |
| APIs | API-M24-15 (`sections` alerts), API-M24-18 (rule text), API-M24-20 |
| Backend / data | E-staff_alert, E-staff_alert_rule, E-audit_event |
| Related | Serious and critical alerts also reach the owner's exception view (P-E01) and digest (T-1A.14-M17-13; D-063) |
| Status | REQUIRES_DECISION (D-283 f) |

| Control | API | Result / guard | Evidence |
|---|---|---|---|
| "Acknowledge" | API-M24-20 (Idem) | Toast "Alert acknowledged · recorded in the audit log"; row dimmed; tile and sidebar badge decrease | MOCKUP |
| "Open person" | — | Opens `#d-person` | MOCKUP |
| "Open record" | — | Navigates to the record's own screen; the server re-checks access | MOCKUP |
| "Reassign" (leave alert) | none — no bulk reassign endpoint (§22.12 #4) | MK toast "4 return cases moved to the returns queue" is not backed by an endpoint; reassign on P-E04 ("Assign…", API-M02-34) | MOCKUP |

### 22.8 Section "Performance" (`#perf-body`)

| Property | Value |
|---|---|
| Purpose | Work over complete days (7, or 30 with period = 30 days) per person, compared within the same role |
| Evidence | MOCKUP (anno "1A · CF1 Employee monitoring · performance, compare within the same role (D-282)") |
| Sections / components | Header sub "Last 7 days (<dates>) · complete days only · today is on the status board"; "Reports →" (P-E13); info callout **"Roles differ — compare people within the same role.** These figures show workload and flow inside Tradex. They do not capture phone calls, walk-in advice, training or help given to colleagues. Use them to start a conversation, not to rank people." (part of the specification); sortable table; footer "Team median · n people"; pager "n people · sorted by …" + "Click a column heading to sort · click a name for the person's details" |
| Table | Employee (avatar, name → drawer, job title · team · context note) · Work items · Median time · Target met · Sent back / corrected · Overrides · Per day (sparkline + screen-reader list of values); header sort buttons with `aria-sort` |
| States | New starter "No complete days yet — first shift today"; empty "No one matches" |
| Permissions | `team.monitor.read` |
| APIs | API-M24-15 (`sections` performance, `period`) |
| Backend / data | E-work_item_event, E-audit_event (overrides) |
| Status | REQUIRES_DECISION (D-283; definitions D-173) |

### 22.9 Drawer `#d-person` — person detail

| Property | Value |
|---|---|
| Purpose | One person in full: their day, areas, performance against the same-role median, sessions and access, sensitive actions and access summary (CF1 §2 "monitor each employee") |
| Evidence | DOCUMENTED (CF1 §2) · MOCKUP (anno "1A · CF1 Employee monitoring · person view (D-282)") |
| Header | Avatar with status ring; name; "job title · team · location"; status pill, since, current area link (when on shift), tag, open-alert badge; close |
| Opened from | Board card or name, feed name, heatmap row or cell (click or Enter), performance row, alert "Open person". Opening is itself audited (`team.person.view`; MK `#m-recorded` "Opening a person's details is itself recorded in the audit log") |
| Permissions | `team.monitor.read`; target within the caller's scope (R-branch_manager own branch) else 404; only that person's data (T-1A.16-M24-12 AC 3) |
| APIs | API-M24-16 |
| Status | REQUIRES_DECISION (D-004, D-283) |

| Tab (`data-tab`) | Content (MK) | API / data | Label |
|---|---|---|---|
| `pd-today` "Today" | Summary "First sign-in · active · idle · breaks · in meetings"; "Full record in the audit log →"; timeline (sign-in, sign-out, actions, flagged items, status changes, idle, "Now"), each with time and area link; note "Only actions inside Tradex are listed. Phone calls, walk-in advice and work away from the screen do not appear here." | API-M24-16 `today` | MOCKUP |
| `pd-areas` "Areas" | "Presence today" 100 % stacked bar Active · Idle · On break · In a meeting / away ("worked out from activity inside Tradex"); "Actions today by area" horizontal bars with share % and Table view; empty "No actions today"; "Usual areas (last 7 days)" links | API-M24-16 `areas` | MOCKUP; presence part `CAP-STAFF_PRESENCE` |
| `pd-perf` "Performance" | Callout "Last 7 days …, compared with the n <role> (or the whole team when the person is alone in the role) … Figures start a conversation; they are not a rating."; five tiles — Work items, Median time, Target met, Sent back / corrected, Overrides — each with "Role median" or "Team median"; line chart of work items per day against the median with Table view; empty "No complete days yet" | API-M24-16 `performance` | MOCKUP |
| `pd-sess` "Sessions & access" | Tiles Sessions open now · Failed sign-ins (7 days) · Two-step sign-in; "Today" table (Signed in · Signed out / "Still open" · Device · Network or branch · Sign-in method); optional note; "Failed attempts" (When · Device · Network or branch · What happened); "Earlier this week" (Day · Signed in · Device · Network or branch); note "The network or branch label comes from where the device connected at sign-in — no GPS or location tracking."; "Sign out everywhere" when sessions are open | API-M24-16 `sessions`; "Sign out everywhere" API-M02-23 (`admin.users.security_actions`, reason, audited) | MOCKUP · sessions D-083 |
| `pd-sens` "Sensitive actions" | "Overrides, refunds, price and discount changes, stock adjustments, exports and access changes in the last 7 days — each with the reason given"; rows: icon, action, "Reason: …", time · record link, flag badges; empty "No sensitive actions …" | API-M24-16 `sensitive` | MOCKUP |
| `pd-access` "Access" | Key–value list: Role · Location scope · Two-step sign-in · Limits (samples) · Delegation / Emergency access / Separation of duties / Leave when present · Account · Access review; callout "Roles, location scope and limits are changed only in Settings & access → Users. Privileged changes need a second approver and every change is recorded in the audit log."; "Manage in Settings & access" → P-E15 `#users` | API-M24-16 `access` | MOCKUP · limits D-024 |

| Control (drawer foot) | API | Result / guard | Evidence |
|---|---|---|---|
| "Message" | none | MK toast "Message window opened · messages stay inside Tradex" — no staff-messaging feature exists in any source or plan file (§22.12 #5) | MOCKUP-ONLY |
| "Reassign open items" | none (bulk) — per item on the owning screen with API-M02-34 | MK toast "n open items ready to reassign · choose a colleague with the same role" (§22.12 #4) | MOCKUP |
| "View in audit log" | API-M02-30 (P-E15 `#audit` filtered by actor) | Link; `CAP-AUDIT_VIEWER` | MOCKUP |

### 22.10 Modal `#m-recorded` — What Tradex records about staff activity

| Property | Value |
|---|---|
| Purpose | Transparency notice: what is and is not recorded, how staff are told, who can see the page, how long records are kept and what they are used for |
| Evidence | DECIDED (D-282 recorded and never-recorded lists) · MOCKUP (anno "1A · CF1 Employee monitoring · transparency: what is recorded (D-283)") · wording, retention and legal review REQUIRES_DECISION (D-283 d, e, g) |
| Sections / components | Sub "The same notice staff see at their first sign-in and in their profile · wording TBC". **Recorded**: actions taken in Tradex (who did what, to which record, when, from which device and branch network — the audit-log entries) · sign-ins and sessions (time, device type and browser, branch or network label, sign-in method, failed attempts) · workspace presence (active or idle from workspace activity only; staff set "On break" or "In a meeting / away" themselves) · work items (assigned, picked up, finished — for handling times and targets). **Not recorded**: screen contents or screenshots · keystrokes, typing or mouse movements · webcam or microphone · personal devices, other apps or websites · GPS or physical location (only the branch or network label at sign-in) · private messages outside Tradex. "How staff are told" (notice at first sign-in; My profile → Privacy notice; My profile → My activity; notice text TBC with the client's legal adviser). "Who can see this page" (the owner; others only if the owner delegates, e.g. a branch manager for their own branch; opening a person is recorded; the owner's own actions are recorded the same way). "How long it is kept" (presence and sessions, performance summaries, audit log — sample periods TBC). "What it is used for" (workload and cover, service targets, security, review of sensitive actions; fixed rules, no AI; nothing about pay, warnings or dismissal is decided automatically). Warning callout "Legal review TBC — notice, purpose and retention checked against India's DPDP Act and rules and employment law before go-live". Footer "Preview staff notice", "Close" |
| Rules | The two lists are rendered from D-282 and must match it word for word in meaning (T-1A.16-M24-12 AC 4; T-1A.16-M24-13 AC 3); retention periods, notice text and who-can-see come from configuration set under D-283, never typed into the page |
| APIs | API-M24-01 (configuration keys set under D-283) |
| Status | REQUIRES_DECISION (D-283 d, e, g) |

### 22.11 Modal `#m-rules` — Alert rules

| Property | Value |
|---|---|
| Purpose | See and change which rules raise staff alerts, their thresholds, who is notified and the level |
| Evidence | MOCKUP (anno "1A · CF1 Employee monitoring · alert rules, thresholds TBC (D-282)") |
| Sections / components | Sub "Fixed rules checked by the system — no AI. Every threshold is a sample to be confirmed (TBC)."; table On · Rule (name + description) · Threshold (input + "sample · TBC") · Who is notified (select) · Level (pill); panel "How alerts reach you" with three checkboxes; footer Cancel · "Save rules" (toast "Alert rules saved · change recorded in the audit log · thresholds stay marked TBC until confirmed") |
| MK rows (all thresholds samples) | Same person creates and approves — any occurrence · Owner · Critical · on; Bulk customer export — 500 records · Owner + Operations admin · Serious · on; Failed sign-in attempts — 5 in 10 min · Owner + Operations admin · Serious · on; Discounts above the person's limit — 3 a day · Branch manager · Warning · on; Stock removed without a photo — any · Warehouse lead + Operations admin · Warning · on; Waiting work, idle assignee — 20 min idle · Team lead · Warning · on; Sign-in outside working hours — 09:30–20:30 · Operations admin · Warning · on; Work assigned to someone on leave — hourly check · Team lead · Warning · on; Price change above the person's limit — 5% · Owner · Warning · off |
| Permissions | Open: `team.monitor.read` (read-only rows); change: `team.alert.manage` (R-owner with MFA; R-ops_admin if delegated) |
| APIs | API-M24-18, API-M24-19; delivery block API-M17-26, API-M20-09 |
| Backend / data | E-staff_alert_rule (seed S-17 addendum, all off) |
| Status | REQUIRES_DECISION (D-283 f) |

| Field | Type | Req | Validation / source |
|---|---|---|---|
| On | toggle per rule | Y | `enabled`; seeded off until D-283 (f) sets the threshold |
| Threshold | text / number per rule (unit per rule) | C (when on) | `threshold`; schema per rule; marked "sample · TBC" until `threshold_confirmed` |
| Who is notified | select | Y | `notify[]` — roles holding `team.monitor.read`; MK options "Team lead" and "Warehouse lead + Operations admin" are job titles (D-222) |
| Level | pill (read-only in MK) | Y | `level`; MK draws no editor although API-M24-19 accepts it |
| "Critical and serious: at once, in Tradex and on WhatsApp" | checkbox | N | Recipient's channel preferences (API-M20-09); WhatsApp to staff needs a channel — D-063, D-014 |
| "Warnings: in the owner's 8:00 daily digest" | checkbox | N | Owner digest content (API-M17-26); time and channel D-063 |
| "Tell the person concerned when an alert about them is raised" | checkbox | N | `notify_subject` on each rule (API-M24-19) — D-283 (e) |

"Save rules" → API-M24-19 once per changed rule (reason, `expected_version`, MFA) and API-M17-26 / API-M20-09 for
the delivery block. MK has nine rules while T-1A.14-M17-13's title lists seven kinds; the nine rule keys are in
`03` §13.3.

### 22.12 States, items not drawn in the mockup, and gaps (P-E17)

States (deltas from 04b §2.11; T-1A.16-M24-12): **live** (default); **stale presence** (§22.3); **empty filter
result** (every section's empty text above); **no alerts** (§22.7); **presence off** and **alerts off** (sections
absent, §22.14); **not delegated** → no navigation entry; the route and its endpoints answer 403.

| Item not drawn in MK | Where | API | Source | Status |
|---|---|---|---|---|
| Staff-side "On break / In a meeting" control and "Back" | shell(E) user menu (04b §3.3) | API-M02-43 | MK:erp-team.html board foot; D-282 | REQUIRES_DECISION (D-283 c) |
| Presence heartbeat client | shell(E) | API-M02-43 | T-1A.2-M02-11 | REQUIRES_DECISION (D-283) |
| Staff notice at first sign-in; My profile → Privacy notice; My profile → My activity (own activity and presence history) | P-E16, shell(E) "My profile" | notice: configuration (API-M24-01); own-activity read: none yet | MK `#m-recorded` | REQUIRES_DECISION (D-283 e, D-174) |
| Delegating P-E17 to R-ops_admin / R-branch_manager | P-E15 `#roles` | API-M02-27 | D-282, D-283 b | REQUIRES_DECISION (D-283 b) |

| # | Gap (no source, entity or endpoint) | MK | Handling |
|---|---|---|---|
| 1 | Roster, shifts, weekly day off, approved leave ("On shift now … scheduled", "Not yet signed in · shift started 10:30", "Offline · shift 11:00–20:00", "On leave") | KPI tile, board, alerts | REQUIRES_DECISION — not among the D-283 questions; reported for addition |
| 2 | Comfortable open-item load per person ("Open items n / capacity", "Queue full") | board | REQUIRES_DECISION (D-283) |
| 3 | Team grouping (Warehouse, Sales & branches, Support, Catalog & pricing, Finance, Management) | `#f-team`, heatmap grouping | D-222 |
| 4 | "Reassign open items" (drawer) and "Reassign" (leave alert) — no bulk cross-area reassign endpoint | drawer, `#alerts` | Per item on the owning screen (API-M02-34 + that screen's assign endpoint) until an endpoint is decided |
| 5 | "Message" to a staff member inside Tradex — no internal messaging in any source | drawer foot | MOCKUP-ONLY; not built without a decision |
| 6 | Service targets per area ("Target met", "past reply target", at-risk / behind rules) | area table, performance | REQUIRES_DECISION (D-283; definitions D-173) |

### 22.13 Screen permissions (P-E17)

| Capability | R-owner | R-ops_admin | R-branch_manager | R-finance | Other staff | Source |
|---|---|---|---|---|---|---|
| Open the screen (tiles, board, areas, heatmap, feed, alerts, performance, person drawer) | Yes | if delegated (D-283 b) | own branch, if delegated | — (403) | — (403) | D-282; `team.monitor.read` |
| Acknowledge an alert | Yes | if delegated | own branch, if delegated | — | — | `team.alert.ack` |
| Change alert rules | Yes (MFA) | if delegated | — | — | — | `team.alert.manage` |
| Export team activity | Yes | if delegated | own branch, if delegated | — | — | API-M18-03 `team_activity`; D-152 |
| "Sign out everywhere" in the drawer | Yes | Yes when also delegated P-E17 (holds `admin.users.security_actions`) | — | — | — | API-M02-23 |
| Send own presence, set own break / away | Yes | Yes | Yes | Yes | Yes | `presence.self` (not access to this screen) |

The owner's own actions are not on the board or in the feed; they stay in the audit log (MK). Denied callers get
**404**, not 403 (`06-api.md` §11 rule 1; `07` §17 #9).

### 22.14 CONDITIONAL / MOCKUP-ONLY / LATER items and capability gating (P-E17)

| Item | Label | Decision / capability |
|---|---|---|
| Whole screen and navigation entry | 1A | `CAP-TEAM_MONITOR` — off: entry absent, route 404, no heartbeat |
| Presence: status ring, idle / break / away statuses, "since", Idle tile, presence split in the drawer | 1A | `CAP-STAFF_PRESENCE`; idle rule, self-set status, retention D-283 (c, d) |
| Alerts section, Open alerts tile, sidebar badge, "Alert rules" button and `#m-rules` | 1A | `CAP-STAFF_ACTIVITY_ALERTS`; each rule its own switch; thresholds D-283 (f) |
| "Audit log →", "Full record in the audit log →", "View in audit log" | 1A | `CAP-AUDIT_VIEWER` — links absent when off |
| "Export" | 1A | `CAP-DATA_EXPORTS`; D-152 |
| Alert delivery on WhatsApp | REQUIRES_DECISION | D-063, D-014 |
| "Message" | MOCKUP-ONLY | no decision (§22.12 #5) |
| POS-terminal and legacy-POS-bridge sessions in samples | CONDITIONAL | D-009 (`CAP-POS_INTEGRATION`) |
| Reading of "REP section" as the ERP workspace | DECIDED, to be confirmed | D-282, D-283 (a) |
| Every threshold, target, limit, retention period, working hours, person, time | samples | D-283, D-024, 00-conventions §1.1 |

Help content (ⓘ, page guide, glossary terms presence, idle, work item, handling time) is T-1A.16-M24-13 from MK
`assets/help/erp-team.js` (X20); tablet and phone layouts follow X16 (D-226).

---

## 23. P-E18 — Analytics (`erp-analytics.html`)

Added 2026-09-30 for the client feedback `CF1 §3` (`D-284` DECIDED; `D-285`, `D-286` OPEN). Cross-cutting rules §1
apply. Every amount, target, threshold, date, band and name on this screen is a sample (§0.2).

### 23.0 Summary card

| Property | Value |
|---|---|
| Purpose | Store and customer analytics on one screen: one filter row and five views — Overview, Sales, Products, Customers, Store & operations — with every figure compared against an earlier period (CF1 §3 "sales analytics, product analytics, different store metrics, customer analytics, similar/relevant business metrics") |
| Evidence | DOCUMENTED (CF1 §3; BP §4 success measures, §14.1, §14.3, §14.4) · MOCKUP (MK:erp-analytics.html; anno "1A · CF1 Analytics dashboard (D-284)") · scope DECIDED (D-284) · definitions, targets, refresh and visibility REQUIRES_DECISION (D-286) · visit metrics CONDITIONAL (D-285) |
| Route | NOT SPECIFIED — MK `erp-analytics.html`; tabs `overview`, `sales`, `products`, `customers`, `store` (API view `operations`); no drawers or modals. Sidebar group Overview → "Analytics" |
| Module / folder | M18 · `MOD-reporting` · `frontend/workspace/` if D-004 = custom; charts via `frontend/design-system/` (D-103) |
| Phase · reqs | 1A · CF1 §3 · R14 · BP §4 ("Better shopping", "Better discovery", "Faster dispatch", "Accurate stock", "Trust in refurbished sales") · T-1A.15-M18-09 (read models), T-1A.15-M18-10 (screen), T-1A.9-M09-14 (visit tracking, CONDITIONAL), T-1A.16-M24-13 (help), T-0-M09-07 (client review) |
| D-004 native-vs-custom considerations | (1) The core candidates have native report and query tooling, but BP §14.1 keeps "data warehouse and advanced BI" out of minimum scope; P-E18 stays on pre-aggregated, store-scoped read models (D-284; T-1A.15-M18-09). (2) BP §14.4 rules — event dates, gross vs net, tax basis, freshness, restricted margin — hold whichever UI is used. (3) P-E13 keeps report tables, exports and schedules; P-E01 keeps exceptions; P-E18 adds the charted views (D-284). **Not decided — D-004.** |
| Roles | R-owner; R-ops_admin, R-finance and R-branch_manager (own branch) per D-286; margin figures only with `analytics.margin.read` (D-286 b) — detail §23.9 |
| Capability | Screen and the Overview, Sales, Products views `CAP-ANALYTICS_DASHBOARD`; Customers view `CAP-CUSTOMER_ANALYTICS`; every card marked "Needs visit tracking" `CAP-STOREFRONT_VISIT_ANALYTICS` (CANDIDATE, D-285); "Save view" `CAP-SAVED_VIEWS`; "Export" `CAP-DATA_EXPORTS`; "Schedule email" `CAP-SCHEDULED_REPORTS` (`21` §4) |
| Status | REQUIRES_DECISION (D-004, D-101, D-286; visit cards D-285) |

### 23.1 Page header and filter row

| Element | Content | API | Label · status |
|---|---|---|---|
| Crumbs / title | Overview › Analytics; "Analytics" | — | MOCKUP |
| Subtitle | "<date> · data as of <time> · figures exclude GST unless stated" (X11 freshness; X3 tax basis) | API-M18-20 `as_of`, `freshness[]`, `tax_basis` | DOCUMENTED BP §14.4 |
| "Save view" | Keeps period, comparison and filters under the user's name (toast "View saved · Analytics · <range> · <filters>") | API-M18-14 (screen_key `analytics`); list API-M18-13 | MOCKUP |
| "Schedule email" | Opens P-E13 `#schedules` to send a saved view by email; each recipient gets only their own scope | API-M18-07 (on P-E13) | DOCUMENTED PR1 §10 |
| "Export" (primary) | Figures behind the cards with the current filters, one CSV per card; private expiring link (MK sample 24 h); audited; never customers' personal details | API-M18-03 (dataset `analytics.<view>`) | DOCUMENTED BP §14.4 · REQUIRES_DECISION (D-152) |
| Date range `#f-range` | Segmented 7 days · 30 days (default) · 90 days · 12 months | `period` | MOCKUP |
| Compare to `#f-cmp` | Previous period (default) · Same period last year | `compare` | MOCKUP |
| Location `#f-loc` | "All locations" + each site; location = the site that fulfilled the order | `location_id`; options API-M03-02 | MOCKUP |
| Channel `#f-ch` | All channels · Website · Branch POS · WhatsApp · Assisted (staff) | `channel` | MOCKUP |
| Buyer type `#f-buyer` | All buyers · Consumers · Approved dealers | `buyer_type` | MOCKUP |
| Category `#f-cat` | "All categories" + categories | `category_id`; options API-M04-01 | MOCKUP |
| Reset `#f-reset` | Back to 30 days, previous period, whole store (toast) | — | MOCKUP |
| Note `#f-note` | "<period dates> vs <comparison dates> · ₹ excl. GST" | — | MOCKUP |

Rules: one filter row scopes every tile, chart and table on all five tabs (MK anno; T-1A.15-M18-10 AC 1); the
comparison period is labelled on every delta; store-wide cards (highlights, targets, cohort retention, segments)
are not narrowed by location, channel, buyer or category and say so; a tab renders when first shown and again after
a filter change. Channel options list only the channels the store sells through (Branch POS `CAP-POS_INTEGRATION`,
WhatsApp `CAP-WHATSAPP_ASSISTED_ORDERS`, Assisted `CAP-ASSISTED_ORDERS`); Buyer type only with
`CAP-BUSINESS_ACCOUNTS`.

Backend / data for every tab: API-M18-20 reads only the rebuildable read models of T-1A.15-M18-09 —
E-analytics_daily_fact (all views), E-customer_cohort_snapshot (Customers) and, only under D-285 (b) or (c),
E-storefront_visit_counter / E-storefront_visit_event aggregated into the facts (`03` §13.5–§13.7); the storefront
beacon posts to API-M09-03 (`public.visit`). P-E18 never scans transactional tables on request (D-268).

### 23.2 Tab `overview` — Overview

| Property | Value |
|---|---|
| Purpose | Headline measures with change against the comparison period, the sales trend, rule-based highlights, channel mix, top categories and this month's targets |
| Evidence | DOCUMENTED (CF1 §3; D-284 "headline measures, trend vs comparison, channel mix, top categories, rule-based highlights, targets") · MOCKUP |
| APIs | API-M18-20 `view = overview` |
| Status | REQUIRES_DECISION (D-286) |

| Card (MK id) | Content | Gating / notes | Label |
|---|---|---|---|
| KPI tiles `#ov-kpis` (8) | Net sales · Orders · Average order value · Gross margin · Units sold · Store conversion rate · Returning-customer share · Return rate — each with value, comparison value ("Previous: …" / "Last year: …"), delta (% or "pt" for rates; colour says good or bad, lower is better for return rate) and sparkline | Gross margin needs `analytics.margin.read`; Store conversion rate carries "Needs visit tracking" (`CAP-STOREFRONT_VISIT_ANALYTICS`) and shows "—" with "Website only — choose All channels or Website" when another channel is chosen | DOCUMENTED BP §4 · definitions D-286 (a, b) |
| Net sales trend `#ch-trend` | Line chart, this period vs comparison, one axis; subtitle "<Daily / Monthly> · <dates> vs <dates> · ₹ excl. GST"; Table view | — | MOCKUP |
| Highlights `#hl-rows` | Up to six rule-based notes: icon, text, detail, "Rule: …", status Good / Watch, button to the tab with the detail; foot "n of m checks fired · m rules run nightly and at <time> · store-wide (not narrowed by location, channel, buyer or category) · thresholds are samples" | Store-wide; the conversion-rate rule only with `CAP-STOREFRONT_VISIT_ANALYTICS`; rule set and thresholds samples | MOCKUP · REQUIRES_DECISION (D-286) |
| Top categories by net sales `#ch-topcat` | Horizontal bars, top six + "Other (n categories)"; Table view | — | MOCKUP |
| Sales by channel `#ch-chmix`, `#chmix-list` | 100 % stacked bar of net sales share + list with amount and delta per channel; Table view | Only channels the store has | MOCKUP |
| "September targets" `#tgt-rows` | Badge "Sample targets · TBC"; five meters — Net sales, Orders, Gross margin (level target, not cumulative), New customers, Dealer sales — with value "of" target, status On track / Behind pace / Above target, pace marker (share of the month gone), "% of target" | Absent until D-286 (c) decides who sets targets and whether they are shown; store-wide; Gross margin meter needs `analytics.margin.read`; Dealer sales `CAP-BUSINESS_ACCOUNTS` | MOCKUP · REQUIRES_DECISION (D-286 c) |

### 23.3 Tab `sales` — Sales

| Card (MK id) | Content | Gating / notes | Label |
|---|---|---|---|
| Net sales and orders over time `#ch-sales-t`, `#ch-orders-t` | Two line charts side by side, one axis each (04b §2.19 #4); grouping `#gran` Daily · Weekly · Monthly (default by range; daily shows at most 90 days); one Table view toggle for both | — | MOCKUP |
| Sales by channel `#chtab-body` | Channel · Net sales · Orders · AOV · Share of net sales (bar + %) · Growth vs previous / vs last year; footer "All channels" | — | MOCKUP |
| Sales by location `#ch-loc` | Horizontal bars, "Site that fulfilled the order · ₹ excl. GST"; Table view | `CAP-MULTI_LOCATION` | MOCKUP |
| Orders by weekday and hour `#ch-heat` | 7 × 24 heat grid, sequential 7-step blue ramp with scale legend, tooltip (orders, share of the period), keyboard navigation, Table view; note "Busiest slot …" | — | MOCKUP |
| Payment methods `#ch-pay` | 100 % stacked bar by share of paid value (UPI · Cards · Net banking & bank transfer · EMI · Cash on delivery) for website, WhatsApp and assisted orders; note that branch counter payments are reconciled on P-E12; empty "Branch counter payments are not in this chart" when channel = Branch POS | Methods follow `CAP-ONLINE_PAYMENTS`, `CAP-EMI`, `CAP-COD`, `CAP-BANK_TRANSFER` | MOCKUP |
| Consumers and dealers `#ch-buyer`, `#buyer-stats` | Stacked bar + per group net sales, orders, AOV, delta | `CAP-BUSINESS_ACCOUNTS` | MOCKUP |
| Discounts and promotions `#promo-body` | Promotion · Type · Window (dates or "since … · running") · Orders · Net sales · Discount given ("₹0 · bank pays") · Extra margin (est.) · Result (Adds margin / Loses margin); footer totals; sub "n promotions · discount given ₹ = x % of net sales"; "Pricing & promotions →" (P-E07); empty "No promotions ran in this period." | `CAP-PROMOTIONS`; "Extra margin (est.)" and "Result" need `analytics.margin.read`; estimate method D-286 | MOCKUP · REQUIRES_DECISION (D-286) |

### 23.4 Tab `products` — Products

| Card (MK id) | Content | Gating / notes | Label |
|---|---|---|---|
| Top products `#tp-table` | Sortable: Product (image, name, SKU) · Condition · Units · Net sales · Gross margin · Return rate (flag "high" above a sample) · Stock cover (flag "low" below a sample) · Sell-through; row → P-E06; "Catalog →"; foot "stock cover uses the last 30 days' sales rate"; empty "No top-10 products in this category" | Gross margin column needs `analytics.margin.read` (omitted, X19); Condition `CAP-CONDITION_GRADES` | MOCKUP |
| Category performance `#ch-cat` | Horizontal bars; measure `#cat-measure` Net sales · Gross margin; Table view | "Gross margin" measure needs `analytics.margin.read` | MOCKUP |
| Sales by price band `#ch-bands` | Column chart by selling price incl. GST; measure `#band-measure` Units · Net sales; Table view | Band boundaries samples (D-286) | MOCKUP |
| Slow movers and ageing stock `#slow-body` | Product · Location · Oldest unit (days) · Last sale (days ago) · Units · Stock value (landed cost) · Suggested action (rule-based); "Stock ageing report →" (P-E13); foot total of stock older than the ageing threshold | Stock value needs `analytics.margin.read`; ageing threshold and suggestion rules samples (D-286); one MK suggestion names the "Deals page" — the storefront says "Offers" since D-281 | MOCKUP |
| Condition mix and margin `#ch-cond`, `#cond-body` | Stacked bar of net sales by condition + table Condition · Net sales · Share · Margin · Returns (flag above a sample) | `CAP-CONDITION_GRADES`; Margin column needs `analytics.margin.read` | MOCKUP · BP §4 "Trust in refurbished sales" |
| Viewed often, bought rarely `#vnb-body` | Badge "Needs visit tracking"; Product · Views · Added to cart · Bought (% + orders) · Rule-based check; website only ("Visit tracking covers the website only") | `CAP-STOREFRONT_VISIT_ANALYTICS` — absent when off | CONDITIONAL (D-285) |
| Searches with no results `#nr-body` | Badge "Needs visit tracking"; Search term · Searches · Suggested fix | `CAP-STOREFRONT_VISIT_ANALYTICS` | CONDITIONAL (D-285); BP §4 "Better discovery" |

### 23.5 Tab `customers` — Customers

The whole tab is `CAP-CUSTOMER_ANALYTICS`; when off the tab and its view (`view = customers` → 404) are absent.

| Card (MK id) | Content | Gating / notes | Label |
|---|---|---|---|
| KPI tiles `#cu-kpis` (5) | Active customers · New customers · Repeat-purchase rate (2+ orders in 12 months) · Average lifetime value · Dealer accounts active ("n of N"); comparison, delta, sparkline; buyer-filter conflicts show "—" with the reason | Dealer tile `CAP-BUSINESS_ACCOUNTS` | MOCKUP · definitions D-286 |
| New and returning customers `#ch-newret` | Two lines (Returning, New); Table view | — | MOCKUP |
| Monthly cohort retention `#ch-cohort` | Heat grid: rows = first-purchase month with customer count, plus "All · weighted"; columns Month 0…5; later months blank; 6-step ramp and legend; note "Store-wide · not affected by the date range"; Table view | Store-wide | MOCKUP |
| Customer segments `#seg-body` | Segment · Rule · Customers · Share of customers · Share of sales (24 months) · AOV · Suggested action; foot total + "Messages go only to customers who agreed to receive them"; "Customers & dealers →" | Segment names and rules samples (D-286 e), nightly (D-286 d); using a segment for a campaign is `CAP-CAMPAIGN_SEGMENTS`, not on this screen | MOCKUP · REQUIRES_DECISION (D-286 e) |
| Top cities and regions `#ch-cities` | Horizontal bars by delivery city, or the branch city for counter sales; Table view | — | MOCKUP |
| Why customers return items `#ch-reasons` | Horizontal bars, share of returns value; note on refurbished share of returns | `CAP-RETURNS` | MOCKUP |
| Top dealer accounts `#dl-body` | Dealer (name, city) · Price list · Orders · Net sales · AOV · Last order · Growth; row → P-E10 `#business`; "Business accounts →"; empty when buyer = Consumers | `CAP-BUSINESS_ACCOUNTS` | MOCKUP |
| Support satisfaction `#sup-stats` | First response time (median) · Resolution time (median) · Satisfaction score (/ 5, n ratings), deltas and sparklines; "Support inbox →" | Times from support conversations and tickets (`CAP-SUPPORT_TICKETS`); the score needs customer ratings that no source, entity or endpoint captures (§23.8 #1) | MOCKUP · score REQUIRES_DECISION (D-286) |

### 23.6 Tab `store` — Store & operations (API view `operations`)

| Card (MK id) | Content | Gating / notes | Label |
|---|---|---|---|
| Visit-tracking callout | "Some store figures need visit tracking … show sample values until it is approved and running, with visitor consent" | MK review note for the open D-285 — not built: with the capability off the cards are absent, with it on they carry real figures | not a product feature |
| Store conversion funnel `#ch-funnel` | Bars Sessions → Product views → Added to cart → Reached checkout → Paid, with % of sessions, step conversion and drop-off; note on overall conversion and the biggest loss; Table view | `CAP-STOREFRONT_VISIT_ANALYTICS`; website only | CONDITIONAL (D-285); BP §4 "Better shopping", §14.3 "Customer funnel" |
| Cart abandonment and recovery `#cart-stats`, `#cart-where` | Abandonment rate · Carts left without paying · Recovered carts · Recovered value ("by WhatsApp or email reminder"); "Where shoppers leave a filled cart" (before checkout, delivery details step, payment) | `CAP-STOREFRONT_VISIT_ANALYTICS`; recovered carts and value also need `CAP-ABANDONED_CART_RECOVERY` (CANDIDATE, D-275) | CONDITIONAL (D-285, D-275) |
| Traffic sources `#ch-traffic` | Bars by source (search engines, direct, WhatsApp links, social, referral & partners, email); Table view | `CAP-STOREFRONT_VISIT_ANALYTICS` | CONDITIONAL (D-285) |
| Devices `#ch-devices`, `#dev-body` | Stacked bar mobile / desktop / tablet + table Device · Sessions · Conversion | `CAP-STOREFRONT_VISIT_ANALYTICS` | CONDITIONAL (D-285) |
| Top landing pages `#lp-body` | Landing page (name, path) · Sessions · Left after one page · Conversion | `CAP-STOREFRONT_VISIT_ANALYTICS`; MK row "Deals /deals" predates D-281 ("Offers") | CONDITIONAL (D-285) |
| Site search `#ss-stats` | Searches (per session) · Sessions using search · Search → purchase · Searches with no results; "No-result searches →" (Products tab) | `CAP-STOREFRONT_VISIT_ANALYTICS` | CONDITIONAL (D-285); BP §4 "Better discovery" |
| Fulfilment `#ful-stats` | Paid → dispatched (median, h) · On-time delivery · Delivery exceptions · Returned to origin (RTO); deltas and sparklines; sub "n shipments · branch counter sales are not shipped"; "Pick · pack · dispatch →" | `CAP-COURIER_SHIPPING` | DOCUMENTED BP §4 "Faster dispatch" · MOCKUP |
| Stock accuracy and stock-outs `#stk-stats`, `#stk-list` | Stock accuracy (counted units that matched) · SKUs out of stock now · Stock-out days (SKU × days) · Lost sales estimate (average daily sales × days out); "Longest stock-outs · last 30 days"; "Inventory →" | Accuracy `CAP-CYCLE_COUNTS`; lost-sales method D-286 | DOCUMENTED BP §4 "Accurate stock" · MOCKUP |
| Branch comparison `#br-body` | Location · Net sales · Orders · AOV · Footfall → sale · Return rate · Paid → dispatched (flag "slowest") · Growth; footer "All locations" | `CAP-MULTI_LOCATION`; "Footfall → sale" needs a door counter per branch — no source or decision (§23.8 #2) | MOCKUP; footfall MOCKUP-ONLY |
| Return rate by category `#ch-retcat` | Bars, returns value as % of gross sales; Table view | `CAP-RETURNS` | MOCKUP |

### 23.7 States (P-E18)

Deltas from 04b §2.11; the four states of T-1A.15-M18-10 first.

| State | Behaviour |
|---|---|
| Normal | As §23.1–§23.6 |
| Stale data | A read model older than its freshness window (D-286 d): the subtitle names it with its time and the affected cards show "as of <time>" (X11; BP §14.4 "failed-feed indicators") |
| Empty period | Card empty states ("No promotions ran in this period.", "No slow movers match these filters.", "No top-10 products in this category", "No dealer orders in this view."); tiles show 0 or "—" with the reason |
| Restricted margin | Without `analytics.margin.read` margin, cost and stock-value fields are omitted (not blanked), the "Gross margin" measure switch is hidden and a note says margin is limited to authorised roles (D-286 b; X19) |
| Channel other than website on a visit card | "Visit tracking covers the website only — Choose All channels or Website" |
| Buyer filter conflicts | Dealer tiles and lists show "—" or "The buyer filter is set to Consumers" |
| Branch-scoped viewer | Own branch only; location filter fixed (D-286 f) |
| Capability off | Cards and the Customers tab are absent — not empty (T-1A.15-M18-10 AC 3; `21` §1 rule 1) |

### 23.8 Metric definitions, and items with no source

Definitions shown in the MK help (`assets/help/erp-analytics.js`), to be confirmed under D-286 before they are
built (T-1A.16-M24-13 AC 2):

| Metric | MK definition | Decision |
|---|---|---|
| Net sales | Sales after returns and refunds (credit notes), excl. GST | D-286 (a) — basis and date (order vs invoice) |
| Average order value | Net sales ÷ orders | D-286 |
| Gross margin | (Net sales − landed cost of goods sold) ÷ net sales | D-286 (b), D-197 |
| Store conversion rate | Paid website orders ÷ website sessions | D-285, D-286 |
| Returning-customer share | Buyers in the period who had bought before ÷ buyers in the period | D-286 |
| Return rate | Returns value ÷ gross sales (tiles, branch table); returned units ÷ units sold (product rows) | D-286 — one definition to be chosen |
| Stock cover | Units available ÷ average daily units sold over the last 30 days | D-286 |
| Sell-through | Units sold ÷ (units sold + units available) | D-286 |
| Repeat-purchase rate | Buyers with 2+ orders in 12 months ÷ buyers in 12 months | D-286 |
| Average lifetime value | Net sales per buyer since the first purchase, averaged | D-286 |
| Cohort retention | Share of a first-purchase-month group that bought again in each later month | D-286 |
| Extra margin (promotion) | Margin on promotion orders − margin normally earned without it − discount given | D-286 |

| # | Item | MK | Handling |
|---|---|---|---|
| 1 | Satisfaction score (ratings out of 5) | Customers `#sup-stats` | No rating capture exists (no source, entity or endpoint). First-response and resolution times are derivable. Absent until a decision adds rating capture (reported against D-286) |
| 2 | "Footfall → sale" (branch door counter) | Store `#br-body` | MOCKUP-ONLY — no source, device or decision; column absent until decided |
| 3 | Highlight rules; "suggested action" rules (slow movers, viewed-not-bought, no-result searches, segments); price bands | several | Rule sets and thresholds are samples → D-286 (its question list does not name them yet) |
| 4 | Recovered carts and value | Store `#cart-stats` | Also needs `CAP-ABANDONED_CART_RECOVERY` (D-275) |
| 5 | Targets | Overview `#tgt-rows` | D-286 (c); no MK control sets targets — configuration (API-M24-02) if D-286 decides they are shown |

### 23.9 Screen permissions (P-E18)

| Capability | R-owner | R-ops_admin | R-finance | R-branch_manager | Other staff | Source |
|---|---|---|---|---|---|---|
| Open the screen and the views the store has | Yes | per D-286 | per D-286 | own branch per D-286 (f) | — | `analytics.read` |
| Margin, landed cost, stock value, promotion extra margin | Yes | per D-286 | per D-286 | per D-286 | — | `analytics.margin.read`; D-197 |
| Save view | Yes | as open | as open | as open | — | `saved_view.self` |
| Export | Yes | per dataset | per dataset | own branch | — | `export.create`; D-152 |
| Schedule email (on P-E13) | Yes | Yes | Yes | — | — | `report.schedule` |

### 23.10 CONDITIONAL / MOCKUP-ONLY / LATER items and capability gating (P-E18)

| Item | Label | Decision / capability |
|---|---|---|
| Screen, navigation entry, Overview, Sales, Products | 1A | `CAP-ANALYTICS_DASHBOARD` |
| Customers view | 1A | `CAP-CUSTOMER_ANALYTICS` |
| Every card marked "Needs visit tracking": Store conversion rate tile, conversion highlight, "Viewed often, bought rarely", "Searches with no results", funnel, cart abandonment, traffic sources, devices, landing pages, site search | CONDITIONAL | `CAP-STOREFRONT_VISIT_ANALYTICS` (CANDIDATE) — D-285; absent under option (a) |
| Visit-tracking callout on `store` | review note, not built | D-285 |
| Recovered carts and value | CONDITIONAL | D-275 (`CAP-ABANDONED_CART_RECOVERY`) |
| Targets card | REQUIRES_DECISION | D-286 (c) |
| "Footfall → sale" | MOCKUP-ONLY | no decision (§23.8 #2) |
| Satisfaction score | REQUIRES_DECISION | D-286 (§23.8 #1) |
| "Save view" · "Export" · "Schedule email" | 1A | `CAP-SAVED_VIEWS` · `CAP-DATA_EXPORTS` · `CAP-SCHEDULED_REPORTS` |
| Data warehouse, advanced BI, predictions | LATER / not in scope | BP §14.1; D-284 "no AI" |
| Every amount, target, threshold, date, band and name | samples | 00-conventions §1.1 |

Every chart follows 04b §2.19 — one axis, fixed categorical order, sequential single-hue ramps for heat grids,
tooltip on hover and keyboard focus, and a Table view with the same numbers (X13; T-1A.15-M18-10 AC 2; TS-A11Y-02).
Help content is T-1A.16-M24-13 from MK `assets/help/erp-analytics.js` (X20); tablet and phone layouts follow X16
(D-226).
