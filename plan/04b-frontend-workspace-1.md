# 04b — Frontend plan: ERP staff workspace, part 1 — shell and P-E01…P-E08

**Purpose.** Screen-level implementation plan for the ERP staff workspace (`frontend/workspace/`): the workspace
**shell** and screens **P-E01 Owner control centre, P-E02 Orders, P-E03 Pick · pack · dispatch, P-E04 Returns/RMA/
warranty, P-E05 Support & WhatsApp inbox, P-E06 Catalog & imports, P-E07 Pricing & dealer tiers, P-E08 Inventory &
serials**. Future sessions implement a screen from its section here, calling the endpoints of `06-api.md` by ID and
relying on the business rules of `05-backend.md` (BR-*) and entities of `03-database.md` (E-*). Part 2 (P-E09–P-E15
and the vendor portal) is `04c-frontend-workspace-2-vendor.md`; it reuses the shell and patterns defined here.

**Sources used.** BP §2.1, §3.1, §4, §5.1–5.3, §6.1, §6.7, §7, §8, §9, §10, §11.3, §12.2–12.6, §13, §14, §15.1–15.6,
§17.3–17.6, §18, §19.1, §20.3, §22.5, §23.1, §24.2, §28.4, §30.1 · PR1 §4, §8–§11 · PR2 §4, §6, §7 · MEET ·
mockup `assets/tradex.js` (workspace shell, charts, event handling), `assets/tradex.css` (workspace/pattern styles),
`erp-dashboard.html`, `erp-orders.html`, `erp-fulfilment.html`, `erp-returns.html`, `erp-support.html`,
`erp-catalog.html`, `erp-pricing.html`, `erp-inventory.html` · plan files `00-conventions.md`, `DECISIONS.md`,
`01-tech-stack.md`, `02-architecture.md` §4.3–4.6/§9/§22, `03-database.md`, `05-backend.md`, `06-api.md`.

**Evidence labels and status values:** `00-conventions.md` §2–§3. **Decisions:** `DECISIONS.md`; new decisions
D-170–D-174 are proposed in §16 of this file.

**Status rule (as in `06-api.md` §1.15).** D-004 (native vs custom per P-E screen) and D-101 (workspace framework) are
prerequisites of every screen in this file; each screen's overall status is therefore `REQUIRES_DECISION (D-004,
D-101)` and they are not repeated per item. Item status is `NOT_STARTED` unless an **item-specific** OPEN decision
applies, in which case it is `REQUIRES_DECISION (D-xxx)`. If D-004 decides a screen is native, its items become
configuration tasks in `backend/` (00-conventions §11) and every business guard listed here still applies (06-api §1.1
rule 3).

---

## 0. Notation

| Notation | Meaning |
|---|---|
| `MK:erp-orders.html#od-pay` | Mockup reference: file + `data-tab` / modal / drawer id. Modals are `m-…`, drawers `d-…` |
| Route | Always **NOT SPECIFIED** — production routes follow D-004/D-101 (00-conventions §8). The MK reference is the identifier |
| → API | Endpoint ID from `06-api.md` §2–§4. "gap-N" = listed in §14 *API gaps found* |
| Field tables | Field · UI control · Req (Y/N/C = conditional) · Validation (source) · API field |
| Roles | `R-*` IDs of 00-conventions §9. Record scope qualifiers `own`, `org`, `loc`, `assigned`, `all` as in 06-api §1.3 |
| States | L = loading, E = empty, X = error, S = stale data, P = permission-limited (see §2.11) |
| "sample" | Value shown in the mockup that is **not** a requirement (00-conventions §1.1) |

---

## 1. Workspace application structure (`frontend/workspace/`)

### 1.1 Application boundary

| # | Item | Plan | Source | Label | Status |
|---|---|---|---|---|---|
| 1 | Folder | `frontend/workspace/` holds the shell and only those P-E screens decided **custom** under D-004; native screens get no code here | 00-conventions §11; BP §30.1 | DOCUMENTED | REQUIRES_DECISION (D-004) |
| 2 | Framework, router, state handling | Not specified; same stack as storefront or native ERP screens are the documented options | D-101; 01-tech-stack §3 row "Custom ERP staff workspace screens" | REQUIRES_DECISION | REQUIRES_DECISION (D-101) |
| 3 | Deployable / hostname | Separate app or shared deployable; sample hostname `erp` in MK is not a requirement | D-102; MK:erp-admin.html#system | REQUIRES_DECISION | REQUIRES_DECISION (D-102) |
| 4 | Design system | Components and tokens from `frontend/design-system/` (MK `tradex.css`), workspace shell variant | 02-architecture §4.5; D-049, D-103 | PROPOSED | REQUIRES_DECISION (D-049, D-103) |
| 5 | Users | R-catalog_staff, R-warehouse_staff, R-sales_support, R-branch_manager, R-finance, R-ops_admin, R-owner | 02-architecture §4.1; BP §3.1 | DOCUMENTED | NOT_STARTED |
| 6 | Authentication | Staff session (06-api §1.2 `STF`); MFA mandatory for privileged roles | BP §18.2, §20.1; D-040, D-083 | DOCUMENTED | REQUIRES_DECISION (D-040, D-083) |
| 7 | Devices / viewport | Agreed desktop/laptop browsers in Phase 1; staff mobile optimisation or staff app is not implied | BP §6, §28.4; 02-architecture §4.3 | DOCUMENTED | NOT_STARTED |
| 8 | Accessibility | WCAG 2.2 AA target: contrast, labels, focus visibility, keyboard order, error summaries, non-colour status | BP §6.7; D-051 | PROPOSED-DEFAULT | REQUIRES_DECISION (D-051) |
| 9 | Languages | Per D-050 | BP §26.7 Q63 | REQUIRES_DECISION | REQUIRES_DECISION (D-050) |
| 10 | Data access | Custom screens call only the staff-scoped business operations of `06-api.md`; never write tables directly or bypass core validations | BP §16.1, §16.3; 02-architecture §4.6 | DOCUMENTED | NOT_STARTED |

### 1.2 Logical layout (framework-neutral; physical structure per D-101)

```
frontend/workspace/
├── shell/          ← §3: sidebar (brand, org card, grouped nav + counts, system-health card, user footer) and top bar
│                     (global search, location scope, "New" menu, notifications, help, user menu)
├── patterns/       ← §2: workspace compositions of frontend/design-system components — page head, filter bar, KPI strip,
│                     data table + bulk bar + pager, drawer/modal frames, exception row, state pills, stale-data callout,
│                     chart card with table view, timeline/audit panel, diff view, scan box, masked value + reveal
├── api/            ← client for the 06-api endpoints used by the workspace, grouped by module (M02…M24); applies the
│                     cross-cutting request rules of §1.4 (idempotency key, expected_version, error envelope)
└── screens/        ← one folder per custom P-E screen: p-e01-control-centre, p-e02-orders, p-e03-fulfilment,
                      p-e04-returns, p-e05-support, p-e06-catalog, p-e07-pricing, p-e08-inventory (part 2: p-e09…p-e15)
```

Unit tests live next to the code; cross-application E2E suites live in `/tests` (00-conventions §11). Folder names
above are the plan's proposal under the delegation of D-054; everything below them (file types, routing, state) is
`REQUIRES_DECISION (D-101, D-103)`.

### 1.3 Screen inclusion and phase

| Page | Mockup | Primary modules | Phase (BP §5.1–5.2) | Requirement IDs (BP §2.1) | D-004 | Folder if custom |
|---|---|---|---|---|---|---|
| shell | `assets/tradex.js` `buildWorkspaceShell` (ERP) | M02, M03, M20, M21, M24 | 1A | R06, R10, R14 | REQUIRES_DECISION (D-004) | `shell/` |
| P-E01 | erp-dashboard.html | M17, M18 | 1A (improve 1B) | R06, R09, R10, R14 | REQUIRES_DECISION | `screens/p-e01-control-centre/` |
| P-E02 | erp-orders.html | M10, M11 (+M05, M06, M12, M20) | 1A; WhatsApp draft baskets 1B (A08) | R03, R04, R08, R10, R11 | REQUIRES_DECISION | `screens/p-e02-orders/` |
| P-E03 | erp-fulfilment.html | M12 (+M06, M13) | 1A | R08, R14, R19 | REQUIRES_DECISION | `screens/p-e03-fulfilment/` |
| P-E04 | erp-returns.html | M13 (+M06, M11) | 1A basic returns; advanced RMA 2/3 | R19 | REQUIRES_DECISION | `screens/p-e04-returns/` |
| P-E05 | erp-support.html | M16 (+M10, M20) | 1A Level 1 + assisted orders; 1B Level 2 | R11 | REQUIRES_DECISION | `screens/p-e05-support/` |
| P-E06 | erp-catalog.html | M04, M22 (+M06, M14) | 1A; validated bulk import and vendor-submission review 1B | R05, R07, R20 | REQUIRES_DECISION | `screens/p-e06-catalog/` |
| P-E07 | erp-pricing.html | M05 | 1A | R03, R04, R06 | REQUIRES_DECISION | `screens/p-e07-pricing/` |
| P-E08 | erp-inventory.html | M06 (+M13, M17) | 1A; supplier stock 1B (A21) | R08, R14, R19 | REQUIRES_DECISION | `screens/p-e08-inventory/` |

Import phase note: BP §12.2 marks A01/A02 P1 while BP §5.1 places validated bulk import in 1B (00-conventions §12 #5;
D-048, D-078).

### 1.4 Cross-cutting rules for every workspace screen

| # | Rule | Source | Label |
|---|---|---|---|
| 1 | The server authorises every operation (object- and property-level). The UI only hides actions the server would refuse; `ui_permissions` from API-M02-01 are hints, never enforcement | BP §19.1, §18.2; 06-api §1.3 | DOCUMENTED |
| 2 | Out-of-scope records return `404` — the UI shows a generic "not found or no access" state without revealing existence | 06-api §1.3; T11 | DOCUMENTED |
| 3 | Never send server-derived fields (role flags, prices, stock, buyer type, channel). Mockup role selectors ("Acting as") are prototype aids | 06-api §1.4, §4.15; BP §17.4 | DOCUMENTED |
| 4 | Operations marked `Idem` carry one idempotency key per user intent, reused on network retry; double clicks never create a second effect | BP §10.3, §17.5; 06-api §1.5; D-079 | DOCUMENTED · transport REQUIRES_DECISION (D-079) |
| 5 | Versioned records are saved with `expected_version`; `409 VERSION_CONFLICT` reloads the record and shows what changed | BP §17.3–17.4; 06-api §1.6; D-080, D-125 | DOCUMENTED |
| 6 | `202 APPROVAL_REQUIRED` is shown as "sent for approval" with the approval reference, deadline and approver — never as success | BP §12.5, §18.1–18.2; 06-api §1.3 | DOCUMENTED |
| 7 | `202 PROVIDER_PENDING` is shown as pending; retry of irreversible provider actions is offered only after a status check | BP §10.3; 06-api §1.7 | DOCUMENTED |
| 8 | Overrides, rejections, holds, suspensions, write-offs and reveals require a reason field; the reason is sent and audited | BP §18.2, §17.3; 06-api §1.14 | DOCUMENTED |
| 9 | Sensitive fields (customer contact, manufacturer serial, cost, margin, dealer/contract prices) are masked or omitted unless the role is permitted; reveal via API-M02-31 | BP §3.1, §14.4, §18.2; D-130, D-153 | DOCUMENTED · policy REQUIRES_DECISION (D-153) |
| 10 | Order, payment, fulfilment, refund and return states are displayed as separate state machines, never one status | BP §10.1 | DOCUMENTED |
| 11 | Every data view shows its freshness (as-of time, sync lag) and failed-feed indicators; stale data is labelled, not hidden | BP §14.4, §20.3 | DOCUMENTED |
| 12 | Live refresh of queues, inbox, scan station and notification bell follows D-146 (no polling interval is invented) | D-146 | REQUIRES_DECISION |
| 13 | Money comes from the API in minor units/fixed decimal and is displayed in INR with an explicit tax basis (incl./excl. GST) | BP §8.1, §14.4; D-059, D-104, D-016 | DOCUMENTED · REQUIRES_DECISION (D-104, D-016) |
| 14 | Business dates and times are displayed in the business-day timezone | D-124 | REQUIRES_DECISION |
| 15 | Every UI item includes loading, empty, error, desktop/laptop viewport and accessibility states | BP §22.5; D-051 | DOCUMENTED |
| 16 | Mockup sample values (names, prices, IDs, windows, thresholds, provider names, hours) are not requirements | 00-conventions §1.1 | DOCUMENTED |
| 17 | Prototype toolbar, "Phase notes" annotations (`data-anno`) and `index.html` are not product features | 00-conventions §1.1 | DOCUMENTED |
| 18 | Mockup toasts simulate outcomes; the product renders the actual API response (result, approval request, error envelope with `correlation_id`) | 06-api §1.7; D-080 | DOCUMENTED |
| 19 | All "Export" actions create an export job (API-M18-03) with row limits, expiring audited downloads and formula-injection neutralisation | BP §14.4; D-152 | DOCUMENTED · REQUIRES_DECISION (D-152) |
| 20 | Printing (pick lists, invoices, labels, manifests) and devices (scanners, scale, camera, erasure station, POS terminal) follow D-110, D-111, D-147 | BP §10.4; D-110, D-111, D-147 | REQUIRES_DECISION |
| 21 | Page tabs update the URL fragment; tabs inside drawers/modals do not; records open by link parameter (MK `?order=`, `?rma=`, `?conv=`, `?loc=`, `&tab=`). Route scheme NOT SPECIFIED | MK `assets/tradex.js` `bindEvents`, page scripts; D-101 | MOCKUP |
| 22 | Keyboard: `Esc` closes open modals, drawers and menus; charts are focusable and navigable with arrow keys | MK `assets/tradex.js`; BP §6.7 | MOCKUP |

### 1.5 The D-004 rule

BP §30.1: *"Reuse native ERP screens where they fit. Build custom staff UI only where it materially improves a
frequent task. Do not reproduce every ERP screen merely to match the storefront branding."* BP §15.6 adds *"Use platform
configuration before custom code; custom extension before core fork."* The mockup shows custom UI for all 15 P-E
screens (D-004 row). Each screen section below has a **"D-004 native-vs-custom considerations"** row that lists what the
sources say about that screen — it does not decide. The decision is recorded in `DECISIONS.md` D-004 per screen.

---

## 2. Shared workspace patterns

Patterns are compositions of design-system components (01-tech-stack §4 component inventory). Styling technology is
D-103; visual direction D-049.

| # | Pattern | Anatomy (MK) | Behaviour rules | Source | Used on |
|---|---|---|---|---|---|
| 2.1 | **Page head** | Breadcrumb (`crumbs`: nav group › page), `h1`, subtitle with context and **freshness** ("live, refreshed 10:42:08 · stock authority in sync (lag 14 s)" — sample), right-aligned actions (secondary buttons, one primary) | Subtitle states scope (location, policy versions, rule-set version) and data freshness; primary action = most frequent create action | MK all P-E pages; BP §14.4 | all |
| 2.2 | **Filter bar** | Search input with icon, selects (date, location, channel, buyer type, payment state…), segmented period control, "Reset", right-aligned note ("Compared with the previous 30 days · figures exclude GST unless stated" — sample) | **One filter row scopes every tile, chart and list below it** (MK anno on P-E01); filters are intersected with the caller's record scope server-side; reset clears all; empty result shows the empty state with "Clear filters" | MK:erp-dashboard.html, erp-orders.html, erp-catalog.html#products, erp-inventory.html#stock; 06-api §1.9 | P-E01, P-E02, P-E06, P-E08 |
| 2.3 | **KPI tile / strip** | Label with icon; value; foot with delta (arrow + text, colour by *good/bad direction*: `up-good`, `down-good`, `up-bad`), context text and optional sparkline | Delta colour encodes whether the direction is good, never colour alone (arrow + sign + text); definitions, baselines and tax basis per D-173; each tile needs a freshness source | MK `.kpi`, `.delta`; BP §4, §14.4 | P-E01…P-E08 |
| 2.4 | **Data table** | Checkbox column + "select all", column groups (e.g. "Three independent state machines — never one status"), `cell-main`/`cell-sub` two-line cells, right-aligned numerics with tabular figures, row click opens drawer (`tr[data-drawer]`) or page (`tr[data-href]`) unless the click is on a control, compact variant | Clicking inside links/buttons/inputs never triggers the row action; numeric columns right-aligned; status cells use pills (2.9) | MK `assets/tradex.js` `bindEvents`; `tradex.css` Tables | all |
| 2.5 | **Bulk action bar** | Appears when ≥1 row selected: "N selected", actions, right note ("Each order keeps its own decision history"; "Bulk actions never approve refunds") | Bulk endpoints return per-item results (`ok`, `skipped_reason`); UI lists skipped items with reasons; bulk review only where each item keeps its own history | BP §18.2; MK `.bulkbar`, `syncBulk`; API-M10-13, API-M17-04 | P-E02, P-E03, P-E04, P-E06 |
| 2.6 | **Pager** | "Showing 1–18 of 148", numbered pages | Page/page-size or cursor per D-080; "N of M matching" when filtered | MK `.pager`; 06-api §1.9; D-080 | lists |
| 2.7 | **Tabs** | Page tabs with count badges (`count`, `count hot`); saved-view tabs | Page tab → URL fragment (§1.4 rule 21); count badges need facet counts (gap-2) | MK `activateTab`; `tradex.css` Tabs | P-E02…P-E08 |
| 2.8 | **Drawer** | Right-side panel (`drawer-card`, `wide`), head (meta line, ID, badges, close), optional state boxes, tab set inside body, foot with grouped actions | Opens from row or deep link; `Esc`/backdrop closes; tabs inside do not change URL; foot actions call the same endpoints as page actions | MK `.drawer`; `TX.open/close` | P-E02, P-E04, P-E06, P-E07 |
| 2.9 | **Modal** | Sizes default/`lg`/`xl`; head (title, subtitle, close), body, foot (Cancel + primary) | Primary disabled until required fields valid; required labels marked (`.req`); reason fields mandatory where §1.4 rule 8 applies | MK `.modal` | all |
| 2.10 | **Exception row** | Severity chip (icon + label + colour: Critical, Serious, Warning, Resolved), title, meta line (entity ref, age, assigned role/person, due time), evidence line, allowed actions (buttons) | Carries every BP §12.5 field: entity reference, severity, age, assigned role/person, due time, evidence, recommended allowed actions, escalation path, resolution reason; severity scale is D-138 (mockup labels are samples); **never colour alone** | BP §12.5; MK `.exc`, `.sev` ("Severity — icon + label + colour, never colour alone"); E-exception_case | P-E01, P-E03, P-E07 |
| 2.11 | **States** | Loading: skeleton (`.skel`); empty: icon + heading + guidance + action (`.empty`); error: error envelope message + `correlation_id` + retry where safe; **stale**: warning callout naming the stale source, since when, what is unaffected, "Sync now"/"View job" actions; permission-limited: section hidden or masked | Every data view implements loading, empty, error, stale and permission-limited variants; stale data is labelled, never hidden; one failing source never blanks the whole page | BP §22.5 (loading, empty, error), §14.4 (freshness, failed feeds), §10.3 (failures), §20.3 (telemetry); MK `.empty`, `.skel`, stale callouts | all |
| 2.12 | **State pills & state boxes** | Status pill per state machine; drawer "state boxes" (Order · Payment · Fulfilment · Return) each with a guard/explanation line | Display labels map to stored states of BP §10.1; summary labels not in BP ("Not started", "Partly dispatched", "Released", "COD · due") are derived display summaries | BP §10.1; 00-conventions §12 #7; D-150 | P-E02, P-E03, P-E05 |
| 2.13 | **Callout** | `c-info`, `c-ok`, `c-warn`, `c-bad`, `c-brand` with icon | Used for policy notes, pending approvals, stale data, blocking reasons; content from API (never hard-coded policy values) | MK `.callout`; BR-M24-03 | all |
| 2.14 | **Timeline & audit panel** | Timeline items (done/current/warn) with actor, time, reference; audit table Actor · Change | Timeline from domain events; audit from E-audit_event (API-M02-30) with masked before/after where required | BP §17.3; MK `.timeline` | P-E02, P-E04, P-E06, P-E08 |
| 2.15 | **Diff view** | Three columns Field · Live/current · Proposed; old values struck through, new highlighted, unchanged marked | Used for draft vs live, price-list change, import preview, answer versions; live version stays in effect until approval | BP §7.3, §11.3; MK `.diff` | P-E05, P-E06, P-E07 |
| 2.16 | **Scan box** | Large monospace input with scan icon, submit, optional camera toggle | Scanner input device per D-110; unknown codes logged and change nothing | BP §10.4, §9.4; MK `.scanbox`; D-110 | P-E03, P-E08 |
| 2.17 | **Masked value + reveal** | Masked text (`U•••••2K3`) + "Reveal (audited)" link → reason modal | Reveal needs reason, is time-limited and audited | BR-M02-17; D-153 | P-E08 (serials); masked contacts P-E02, P-E05 |
| 2.18 | **Charts** | Chart card with title, subtitle (period, unit, tax basis), "Table view" toggle | See §2.19 | MK `assets/tradex.js` charts | P-E01 |

### 2.19 Data-visualisation rules used in the mockup

Chart rendering technology is REQUIRES_DECISION (D-103); the mockup's SVG helpers are prototype code (00-conventions
§1.1). The following rules are what the mockup applies and the plan keeps (MOCKUP):

| # | Rule | MK implementation (`assets/tradex.js` "Charts" block) |
|---|---|---|
| 1 | **Legend only when there are ≥ 2 series**; a single series has no legend (its title names it) | `TX.charts.line`: legend appended only if `series.length > 1` |
| 2 | **Direct labels** at the end of each line (value + series name), with collision nudging and a leader line when moved | end markers + `end-label`/`end-label-sub`, 28 px minimum spacing |
| 3 | **Table-view twin** for every chart (same data as an accessible table), toggled by a "Table view" button | `tableTwin()`; `TX.charts.toggleTable`; `data-table-toggle` buttons on P-E01 |
| 4 | **No dual axis**; one value axis per chart; units stated in the subtitle ("₹ excl. GST") | single `y` scale per chart |
| 5 | Clean axis ticks (1/2/2.5/5 × 10ᵏ), hairline grid, baseline at zero | `niceMax`, `gridline`, `baseline` |
| 6 | Single-series line gets a light area fill; multi-series lines are plain | `series.length === 1` fill |
| 7 | Crosshair tooltip listing every series at the hovered point; keyboard focus + ← → navigation | overlay `tabindex=0`, `keydown` handler |
| 8 | Horizontal bars carry value labels at the bar end and a tooltip; one series | `TX.charts.hbar` |
| 9 | 100 % stacked bar for composition (e.g. sales mix by condition) with legend showing name + percentage | `TX.charts.stack` |
| 10 | Sparklines in KPI tiles: de-emphasised grey history, accent-coloured last point, decorative (`aria-hidden`) | `TX.charts.spark` |
| 11 | Charts are `role="img"` with an `aria-label`; charts in hidden tabs render when they become visible | `svg role="img"`, `whenVisible` |
| 12 | Series colours come from design tokens `--series-1…3`; status colours `--st-good/warning/serious/critical`; colour never carries meaning alone | `tradex.css :root` |
| 13 | Each chart states its data freshness and definition (BP §14.4) | chart subtitles ("Daily, last 30 days · ₹ excl. GST") |

### 2.20 Action patterns (also referenced by part 2, `04c-frontend-workspace-2-vendor.md`)

| # | Pattern | Specification | → API | Source | Label |
|---|---|---|---|---|---|
| 1 | **Approval decision** | Decision control (Approve · Request changes · Reject; plus "Approve & publish" for catalog items, "Counter" for discount overrides), mandatory reason ("A reason is required for every decision" — MK:erp-pricing.html m-decide), optional "fields needing changes", notify-requester option, separation-of-duties notice ("X requested this change and cannot approve it"). Sends `expected_version` of the subject under review; `403 SELF_APPROVAL_NOT_ALLOWED`, `403 AUTHORITY_EXCEEDED`, `409 VERSION_CONFLICT`, `422 REASON_REQUIRED` are rendered inline | API-M17-02, API-M17-03 (bulk API-M17-04) | BP §18.2; 06-api §4.13 | DOCUMENTED |
| 2 | **Export button** | Page-level or bulk-bar "Export" creates an export job for the current filters/selection with permitted column groups; UI shows "export queued" and where the file appears; full-PII exports may return `202 APPROVAL_REQUIRED` | API-M18-03 (download API-M18-05, list API-M18-04 on P-E13) | BP §14.4, §18.1; D-152 | DOCUMENTED · REQUIRES_DECISION (D-152) |
| 3 | **Toast** | Short non-blocking confirmation after a **server-confirmed** result (icon + message + reference, e.g. created ID); errors and approval-required outcomes that need attention are shown inline/callout, not only as a toast | — | MK `TX.toast`; §1.4 rule 18 | MOCKUP |
| 4 | **Masked-field reveal** | Pattern 2.17: reason select (required) → reveal for a limited time → audit entry | API-M02-31 | BR-M02-17; D-153 | MOCKUP · REQUIRES_DECISION (D-153) |
| 5 | **Assignee picker** | Select of staff users eligible for the task (role + location scope), "me" first | gap-7 | BP §13.4 (owner), §12.5 (assigned role/person) | DOCUMENTED |
| 6 | **Reason-coded form** | Select of reason codes + free-text note; reason catalogues are D-139 (mockup lists are samples) | per action | BP §9.6, §10.3, §18.2; D-139 | REQUIRES_DECISION (D-139) |

---

## 3. Workspace shell (MK `assets/tradex.js` `buildWorkspaceShell("erp")`)

### 3.0 Summary

| Field | Value |
|---|---|
| Purpose | Persistent frame around every custom P-E screen: identity, organisation and location context, permission-filtered navigation with queue counts, global search, create shortcuts, notifications, help, account/security/delegation, system-health summary |
| Evidence | MOCKUP (MK `assets/tradex.js`); consistent with BP §12.5 (exception queues), §18.2 (least privilege, MFA), §12.6 (delegation), §20.3 (telemetry), §3.1/§9.5 (location scope) — 02-architecture §4.3 "Workspace shell" |
| Route | NOT SPECIFIED (frame, not a page) |
| Phase / IDs | 1A · R06, R10, R14 · WP03, WP05 |
| D-004 native-vs-custom considerations | 02-architecture §4.3: the shell "applies to custom screens and, where feasible, to native configuration". BP §6.7 step 4: one coherent visual direction for e-commerce and ERP. BP §30.1: do not reproduce ERP screens merely for branding. If some P-E screens are native, whether the shell wraps them or they open in the native desk is not specified in any source |
| Excluded | Prototype toolbar (`buildProtobar`: Overview/Storefront/ERP/Vendor switch, "All screens", "View as", "Phase notes", hide button) — review aid (00-conventions §1.1) |
| Status | REQUIRES_DECISION (D-004, D-101); items below |

### 3.1 Sidebar

| # | Element | MK content (sample values) | Behaviour | → API | Label | Status |
|---|---|---|---|---|---|---|
| 1 | Brand | Logo mark + word mark + "ERP workspace" | Static; brand per D-049 | — | MOCKUP | REQUIRES_DECISION (D-049) |
| 2 | Organisation card | Avatar, "Tradex Electronics Pvt Ltd", "All locations · FY 2026-27", chevron (switcher affordance) | Shows the selling organisation (company) and financial-year context from API-M03-08; the second line mirrors the current location scope (§3.2 #2). Whether a **company/FY switcher** exists is not specified — BP §3.3 "Start with the confirmed legal entities"; multi-business is LATER (D-045) | API-M03-08; switch: gap-1 | MOCKUP | REQUIRES_DECISION (D-170) |
| 3 | Navigation groups | **Overview**: Control centre (P-E01). **Sell & serve**: Orders (P-E02), Pick · pack · dispatch (P-E03), Returns & warranty (P-E04), Support inbox (P-E05). **Catalog**: Products (P-E06), Pricing & tiers (P-E07). **Stock**: Inventory & serials (P-E08), Purchasing & receiving (P-E09). **Partners**: Customers & dealers (P-E10), Vendors (P-E11). **Finance & insight**: Payments & reconciliation (P-E12), Reports (P-E13), Automation (P-E14). **Administration**: Settings & access (P-E15) | Items shown only if the user holds a read permission for that screen (API-M02-01 `ui_permissions`); a group with no visible item is hidden; active item highlighted; native screens (D-004) link out per D-004 outcome | API-M02-01 | MOCKUP; BP §18.2 least privilege | NOT_STARTED |
| 4 | Queue counts | Count badges on Orders (18), Pick·pack·dispatch (9), Returns (6), Support (4, **hot** red), Customers (3), Vendors (5) — samples | What each badge counts (needs-action items vs open items), whether it is role/location-scoped, when it is "hot", and refresh (D-146) are not specified | gap-3 | MOCKUP | REQUIRES_DECISION (D-172, D-146) |
| 5 | System-health card | "System health · All good"; "Stock sync lag 14 s · Jobs queue 3"; "Last backup 02:00 today · restore tested 21 Sep" | Summary from API-M24-08 `summary` (stock projection lag, job queue depth, last backup, last restore test, status). Status wording/thresholds (when "All good" turns warning) per D-034/D-052; card links to P-E15#system for permitted roles | API-M24-08 (summary_only) | MOCKUP; BP §20.3, §20.1 (backup restore), §16.6 | REQUIRES_DECISION (D-052) |
| 6 | User footer | Avatar, name, role label ("Owner · Super admin" — sample label, D-222), "Open storefront" external link | Name/roles from API-M02-01; role labels map to R-* (D-222); storefront link target per D-102 | API-M02-01 | MOCKUP | REQUIRES_DECISION (D-222, D-102) |

### 3.2 Top bar

| # | Element | MK content | Behaviour | → API | Label | Status |
|---|---|---|---|---|---|---|
| 1 | Global search | Input placeholder "Search orders, SKUs, serials, customers, POs…", `Ctrl K` hint | Keyboard shortcut focuses the input; results grouped by type (order, SKU, serial, customer, PO, product) with title/subtitle/link; **only object types and records the user may see** (object-level authorisation, location scope); serial/manufacturer-serial lookup reuses API-M06-06 semantics; empty result state "No matches in your scope" | API-M21-03 (+ API-M06-06 for serial scans) | MOCKUP; BP §18.2, §19.1; BR-M21-07 | NOT_STARTED |
| 2 | Location scope switcher | Button "All locations" ▾; menu "Scope": All locations, then each location with type icon (warehouse/branch) and code | Lists locations the user may see (API-M03-02 is `loc`-scoped; full list for R-owner/R-ops_admin). Semantics — global filter vs default for page filters, persistence per user, availability of "All locations" for branch-scoped roles, relation to page-level location filters on P-E01/P-E02/P-E03/P-E08 — not specified | API-M03-02 | MOCKUP; BP §3.1, §9.5; D-029 | REQUIRES_DECISION (D-170, D-029) |
| 3 | "New" menu (primary) | Assisted order → P-E02 `#assisted`; Purchase order → P-E09 `#new-po`; Goods receipt (GRN) → P-E09 `#receive`; Stock transfer → P-E08 `#transfers` (MK opens the tab; the create form is `m-transfer`); Product draft → P-E06 `#editor`; Bulk import → P-E06 `#import` | Each item shown only if the user may perform the create operation; the target screen performs the call (server re-authorises) | via targets: API-M10-18, API-M07-04, API-M07-09, API-M06-13, API-M04-16, API-M04-30 | MOCKUP; BP §19.1 | NOT_STARTED |
| 4 | Notifications (bell + unread pip) | Menu (360 px): "Notifications", "Mark all read"; items with icon + text linking to the relevant screen (samples: payment captured not confirmed → P-E12; cycle-count variance → P-E08#counts; vendor submissions waiting → P-E11; courier sync failed → P-E14) | Lists own in-app notifications (unread first); each item links to its entity; "Mark all read" marks all; routine notifications stay in staff queues, owner receives digest + urgent material exceptions only; refresh per D-146; staff notification events per D-058 | API-M20-01, API-M20-02 | MOCKUP; BP §12.5, §12.3 (Notification: recipient, urgency, dedup, frequency cap) | REQUIRES_DECISION (D-146, D-058) |
| 5 | Help | Icon button; MK links to `erp-admin.html` (Settings) | Destination not specified. BP §24.2 requires staff SOPs, role walkthroughs and an owner guide to the dashboard | — | MOCKUP | REQUIRES_DECISION (D-174) |
| 6 | User menu | Avatar, name, role; items: My profile, Security & MFA, **Delegation while away** → P-E15 `#delegation`, Sign out | See §3.3 | see §3.3 | MOCKUP | see §3.3 |

### 3.3 User menu items

| Item | Behaviour | Form fields | → API | Label | Status |
|---|---|---|---|---|---|
| My profile | Content not in mockup; own account read (name, roles, location scope, MFA state) is available from API-M02-01; editing own contact data has no API | — | API-M02-01; edit: gap-4 | MOCKUP | REQUIRES_DECISION (D-174) |
| Security & MFA | Change password; enrol MFA (method per D-040); confirm enrolment (backup codes shown once); regenerate backup codes (recent re-auth); optionally own security events | Current password (Y), new password (Y, policy D-040); MFA method (Y, D-040); verification code (Y) | API-M02-09, API-M02-12, API-M02-13, API-M02-14, API-M02-15 | DOCUMENTED for privileged (BP §18.2, §20.1); MOCKUP | REQUIRES_DECISION (D-040) |
| Delegation while away | Opens P-E15 delegation (part 2); creation of a time-bounded scoped delegation is API-M17-21 | (P-E15) | API-M17-21 (via P-E15) | DOCUMENTED BP §12.6, §18.2 | REQUIRES_DECISION (D-025) |
| Sign out | Ends the session; private data no longer accessible | — | API-M02-06 | DOCUMENTED BP §8.4 | NOT_STARTED |

### 3.3a Workspace pages outside the mockup (required to enter the shell)

| Page | Behaviour | → API | Label | Status |
|---|---|---|---|---|
| Staff sign-in | Credentials per D-040; rate-limited (D-084); generic failure message | API-M02-04 | DOCUMENTED BP §18.2, §19.1 (no MK screen) | REQUIRES_DECISION (D-040, D-083, D-084) |
| MFA challenge / enrolment on first sign-in | Privileged roles must complete MFA before any screen; enrolment before a privileged role becomes effective | API-M02-05, API-M02-12, API-M02-13 | DOCUMENTED BP §18.2, §20.1 | REQUIRES_DECISION (D-040) |
| Password reset (request + set) | Reset link flow | API-M02-07, API-M02-08 | MOCKUP pattern (store); staff use per D-040 | REQUIRES_DECISION (D-040) |
| Invitation acceptance | Staff invited from P-E15 accept, set credentials, enrol MFA if privileged | API-M02-16, API-M02-17 | DOCUMENTED (E-invitation, 00-conventions §7.1) | REQUIRES_DECISION (D-040) |

### 3.4 Shell states, permissions, dependencies

| Aspect | Specification | Source |
|---|---|---|
| Loading | Shell renders with skeleton nav counts and health card until API-M02-01 resolves; screens wait for API-M02-01 before rendering permission-dependent actions | BP §22.5 |
| Error | API-M02-01 `401` → sign-in; other errors → shell error state with retry; health card error shows "status unavailable", never "All good" | BP §22.5, §20.3 |
| Stale | Health card shows its own as-of time; if API-M24-08 is older than the freshness window (D-034/D-052), the card shows "stale" | BP §14.4, §20.3 |
| Permissions | Any authenticated staff user sees the shell; nav items, "New" items and health-card detail link are permission-filtered; MFA-pending privileged users are routed to enrolment before any screen (BP §18.2) | BP §18.2; 06-api §1.2 |
| API dependencies | API-M02-01, API-M02-04, API-M02-05, API-M02-07, API-M02-08, API-M02-16, API-M02-17 (§3.3a), API-M02-06, API-M02-09, API-M02-12, API-M02-13, API-M02-14, API-M02-15, API-M03-02, API-M03-08, API-M20-01, API-M20-02, API-M21-03, API-M06-06, API-M24-08; counts gap-3; company switch gap-1 | 06-api §7.3 row shell(E) |
| Backend / DB | BR-M02-01…04, BR-M02-15, BR-M21-07, BR-M17-04, BR-M20-05, BR-M26-01; E-user_account, E-user_role_assignment, E-company, E-location, E-notification, E-job_attempt, E-configuration_version | 05-backend §5.2, §5.20, §5.21, §5.26 |
| Related pages | P-E01…P-E15; P-E15 #delegation, #system | — |

---

## 4. P-E01 — Owner control centre (`erp-dashboard.html`)

### 4.0 Summary

| Field | Value |
|---|---|
| Purpose | Answer "what needs attention, why, who owns it, and by when" (BP §12.5): exceptions above delegated authority, approvals waiting on the viewer, KPI summary, order pipeline, branch/channel comparison, stock and automation health, recent activity, top products, owner digest preview |
| Evidence | DOCUMENTED (BP §12.5 owner exception dashboard; BP §30.1 Owner workspace "Exception overview, KPI summary, policy approvals, branch comparison"; BP §4 success measures; PR2 §7 dashboard areas; PR1 §11 "Central dashboard showing business activity and exceptions") + MOCKUP |
| Route | NOT SPECIFIED · MK:erp-dashboard.html (modal `m-digest`) |
| Phase / IDs | 1A (BP §5.2 "Owner exception dashboard, audit, alerts": M 1A, improve 1B) · R06, R09, R10, R14 · WP12, WP15 · T31 |
| Primary modules | M18 (dashboard data), M17 (exceptions, approvals, digest, delegation) |
| D-004 native-vs-custom considerations | BP §30.1 lists the Owner workspace (exception overview, KPI summary, policy approvals, branch comparison). BP §12.5 defines required exception fields; BP §24.2 asks for "an owner guide to the dashboard so monitoring can replace frequent phone calls"; PR2 §7 calls it the operational "control tower" spanning sales, inventory, vendors, exceptions, management. Content aggregates many modules (M05–M17); BP §15.1 notes ERPNext approvals/jobs exist as reuse candidates (S05, S06, S08). Frequency: owner/manager review daily/weekly (BP §4 review cadences). Mockup: custom |
| Status | REQUIRES_DECISION (D-004, D-101) |

### 4.1 Page head and filter bar

| Element | Specification | → API | Label | Status |
|---|---|---|---|---|
| Crumb / title | "Overview" · greeting with the user's first name (time-of-day greeting is MOCKUP) | API-M02-01 | MOCKUP | NOT_STARTED |
| Subtitle | Date · "data fresh as of HH:MM" · "stock sync lag N s" | API-M18-12 (freshness per tile), API-M24-08 summary | DOCUMENTED BP §14.4 | NOT_STARTED |
| Delegation badge | "Delegation on · {delegate} ≤ {limit} (sample limit)" — shows active delegations granted by the viewer | API-M17-20 (active) | DOCUMENTED BP §12.6 · MOCKUP | REQUIRES_DECISION (D-025, D-024) |
| "Preview daily digest" | Opens `m-digest` (§4.9) | API-M17-25 | DOCUMENTED A19 | REQUIRES_DECISION (D-063) |
| "Export" | Export of the dashboard datasets for current filters (§2.20 #2) | API-M18-03 | DOCUMENTED BP §14.4 | REQUIRES_DECISION (D-152) |
| Filter: period | Segmented Today · 7 days · 30 days · 90 days (default 30 days in MK — sample) | API-M18-12 `period` | MOCKUP | NOT_STARTED |
| Filter: location | All locations + each location | API-M03-02 → API-M18-12 `location_id` | MOCKUP; BP §14.3 branch | REQUIRES_DECISION (D-170) |
| Filter: channel | All channels · Website · Branch POS · WhatsApp · Assisted (staff) | API-M18-12 `channel` | MOCKUP; BP §4 segment branch/online | NOT_STARTED |
| Filter: buyer | All buyers · Consumers · Approved dealers | API-M18-12 `buyer_type` | MOCKUP; BP §4 segment consumer/dealer | REQUIRES_DECISION (D-006 terminology) |
| Scope note | "Compared with the previous 30 days · figures exclude GST unless stated" — comparison baseline and tax basis must be stated | — | DOCUMENTED BP §14.4 | REQUIRES_DECISION (D-173) |
| Rule | **The filter row scopes every tile, chart and list on the page** (MK anno) — including exceptions and approvals lists | — | MOCKUP | NOT_STARTED |

### 4.2 KPI strip (6 tiles, each with delta and sparkline)

| Tile | Definition in sources | → API | Label | Status |
|---|---|---|---|---|
| Net sales | Net sales, gross vs net and tax basis labelled; refunds period treatment stated (BP §14.4) | API-M18-12 `success_measures[]` | DOCUMENTED | REQUIRES_DECISION (D-173) |
| Orders | Count of orders in period (event date = order date, BP §14.4) | API-M18-12 | MOCKUP | REQUIRES_DECISION (D-173) |
| Avg. order value | Net sales ÷ orders | API-M18-12 | MOCKUP | REQUIRES_DECISION (D-173) |
| Owner touches | "Routine cases requiring owner action / total routine cases" (BP §4; illustrative target BP §4 "cut … by half" is not a requirement) | API-M18-12 `owner_touches` | DOCUMENTED | REQUIRES_DECISION (D-173) |
| Stock accuracy | "Correct counted units / counted units, with value variance separately" (BP §4) | API-M18-12 | DOCUMENTED | REQUIRES_DECISION (D-173) |
| Paid → dispatched | "Paid/approved to dispatched time, median and p95" (BP §4) — MK shows one value | API-M18-12 | DOCUMENTED | REQUIRES_DECISION (D-173) |

### 4.3 "Needs attention" (exceptions above delegated authority)

| Element | Specification | → API | Label | Status |
|---|---|---|---|---|
| Header | "Needs attention" · "Only exceptions above delegated authority reach you · N open · N resolved by staff this week" | API-M17-05 (`view=owner_level` / `mine`), counts | DOCUMENTED BP §12.5 ("send the owner a digest and urgent material exceptions only") | NOT_STARTED |
| Segmented | "Mine (n)" · "All teams (n)" | API-M17-05 `view` (mine, all_teams) | MOCKUP | NOT_STARTED |
| Row | Exception row pattern §2.10: severity chip, title, meta (entity reference + product/value, age, assigned role/person, due time or SLA), evidence line, allowed actions | API-M17-05 items; detail API-M17-06 | DOCUMENTED BP §12.5 | REQUIRES_DECISION (D-138 severity/due) |
| Footer | "Routine work stays in staff queues. Thresholds are set in Settings → Approval thresholds" (link P-E15#thresholds) · "All exceptions →" (P-E14#exceptions) | — | MOCKUP | NOT_STARTED |

Exception types shown (MK samples) and their allowed actions:

| Exception (BP §12.5 card) | Actions in MK | → API | Result | Label | Status |
|---|---|---|---|---|---|
| Payment captured but order not confirmed — reservation expired (late capture) | "Reserve alternate" · "Refund" | API-M10-17 (alternate unit/location; customer consent if unit/condition differs) · API-M11-09 | Reservation for alternate + customer asked to confirm (template, D-058) / refund request to finance | DOCUMENTED BP §10.3, §29.6, T09 | REQUIRES_DECISION (D-026) |
| Discount below margin floor needs owner approval (low-margin override) | "Approve" · "Counter 10%" (sample value) | API-M17-03 (`approve` with reason; `counter` with `counter_value`) | Approval recorded with reason in audit; requester notified | DOCUMENTED BP §8.4, §18.1–18.2 | REQUIRES_DECISION (D-024) |
| Refund failed at payment provider (n retries) | "Open refund" → P-E12#refunds | — (navigation) | — | DOCUMENTED BP §12.5, §10.3 | NOT_STARTED |
| Stock write-off above manager threshold | "Review evidence" → P-E08#counts (06-api maps it to API-M17-06) | API-M17-06 | Evidence view; decision in P-E14/P-E08 | DOCUMENTED BP §9.6, §18.1 | REQUIRES_DECISION (D-024) |
| Supplier availability feed stale (auto-rule switched offers to "confirm before promise") | "Contact vendor" → P-E11 | API-M14-53 | Message to vendor | DOCUMENTED BP §9.7, A21 (1B) | REQUIRES_DECISION (D-028) |
| Courier status sync failing — auto-retry paused after n attempts (failed integration) | "View job" → P-E14 | API-M17-16 | Job incident | DOCUMENTED A38 | NOT_STARTED |

Other BP §12.5 cards not sampled in MK but in scope of the list: overdue dispatch, stock mismatch, purchase variance,
unresolved return, expired approval (E-exception_case `exception_type`).

### 4.4 "Approvals waiting on you"

| Element | Specification | → API | Label | Status |
|---|---|---|---|---|
| Header | "Approvals waiting on you" · "N items · oldest n" · "Open queue" → P-E14#approvals | API-M17-01 (`view=waiting_on_me`) | DOCUMENTED BP §18.2 | NOT_STARTED |
| Row | Avatar of requester/subject, approval type title, one-line summary (subject, key facts), "Review" → owning screen (P-E11#applications, P-E10#applications, P-E07, P-E11#submissions) | API-M17-01 | DOCUMENTED BP §18.2 ("Record why an approval was required") | NOT_STARTED |
| MK sample types | Marketplace seller application ("Phase 2 pilot") · Dealer application · Price list change · Vendor listing — sensitive edit | — | Marketplace item: LATER (M15, D-046); others DOCUMENTED BP §8.3, §18.1, §11.3 | marketplace: LATER |

### 4.5 "Order pipeline"

| Cell | Meaning | → API | Label |
|---|---|---|---|
| Awaiting payment · Confirmed · to pick · Picking / packed · Dispatched today · Delivery exceptions · Overdue dispatch (> 24 h, sample threshold) | Counts by order/fulfilment state in scope; "Live · all locations"; link "Orders →" (P-E02) | API-M18-12 `order_pipeline` | MOCKUP; BP §10.1, §12.5 (overdue dispatch) · threshold REQUIRES_DECISION (D-138, D-078 A16) |

### 4.6 Charts (dataviz rules §2.19)

| Chart | Type | Series / items | Table view | → API | Label | Status |
|---|---|---|---|---|---|---|
| Net sales by channel — "Daily, last 30 days · ₹ excl. GST" | Multi-series line with legend, direct end labels, crosshair tooltip | Website, Branch POS, WhatsApp (MK omits "Assisted (staff)" although the filter offers it — include every channel of the filter) | "Table view" toggle | API-M18-12 `net_sales_by_channel[]` | MOCKUP; BP §14.3 "Sales and returns: channel" | NOT_STARTED |
| Net sales by location — "Last 30 days · includes online orders fulfilled from each site" | Horizontal bars with value labels | One bar per location in scope | "Table" toggle | API-M18-12 `net_sales_by_location[]` | DOCUMENTED BP §30.1 "branch comparison", R14 | NOT_STARTED |
| Sales mix by condition — "share of net sales" | 100 % stacked bar with legend + % | New, Refurbished, Open box, Used | legend values | API-M18-12 `sales_mix_by_condition[]` | MOCKUP; BP §4 segment new/refurbished | NOT_STARTED |

### 4.7 Health, automation, activity, top products

| Card | Content | Actions | → API | Label | Status |
|---|---|---|---|---|---|
| Stock health | Rows with icon: SKUs below reorder point (+ draft PO suggestions awaiting buyer approval) · units in quarantine (returns vs inbound QC) · transfers in transit (+ partly received) · stock value older than N days (N sample) | "Review" → P-E09#suggestions · "Inspect" → P-E04 · "Track" → P-E08#transfers · "Ageing" → P-E13 · "Inventory →" P-E08 | API-M18-12 `stock_health[]` | DOCUMENTED BP §14.3 (low stock, stock ageing), A17, T16, T17 | REQUIRES_DECISION (D-070) |
| Automation | Tiles: Runs today · Success rate · Staff time saved this week (est.) · Failing jobs; rule rows (name, runs, failures / paused reason) | "Rules →" P-E14 | API-M18-12 `automation_health[]` (rule detail API-M17-08) | DOCUMENTED BP §14.3 automation health, §12.4 (hours-saved formula), §4 reliable automation | REQUIRES_DECISION (D-078, D-173) |
| Recent activity | Feed: actor avatar, actor + action, time · location/context (e.g. "delegated authority", "scheduled job") | "Audit log →" P-E15#audit | API-M18-12 `recent_activity[]` (from E-audit_event) | MOCKUP; BP §17.3 | NOT_STARTED |
| Top products — "Last 30 days · net of returns" | Table: Product (thumb, title, SKU) · Condition · Units · Net sales · Gross margin · Return rate · Available; row → P-E06; "Sales report →" P-E13 | — | API-M18-12 `top_products[]` | MOCKUP; BP §14.3 (gross margin; returns) | REQUIRES_DECISION (D-135 cost basis for margin) |

### 4.8 States

| State | Specification | Source |
|---|---|---|
| L | Skeleton tiles, list rows and chart frames | BP §22.5 |
| E | Needs attention: "Nothing needs you" with count of items resolved by staff; approvals: "No approvals waiting"; charts: "No sales in this period for the selected filters" (not in MK — required) | BP §22.5 |
| X | Per-card error with retry; other cards keep rendering (one failing source never blanks the page) | BP §22.5, §20.3 |
| S | Each tile/card carries its freshness; a stale/failed source (e.g. settlements not imported, courier sync paused) is labelled on the card and summarised in the subtitle | BP §14.4 ("Display data freshness and failed-feed indicators") |
| P | Finance-only tiles hidden for non-finance roles; margin/cost columns hidden unless permitted; branch managers see only their branch (location filter fixed) | BP §14.4, §3.1; BR-M18-04, BR-M18-09 |

### 4.9 Modal `m-digest` — Owner daily digest preview

| Element | Specification | → API | Label | Status |
|---|---|---|---|---|
| Head | "Owner daily digest · preview" · schedule/channel line ("Sent 8:00 AM by email & WhatsApp · only material items" — sample) | API-M17-25 | DOCUMENTED A19; BP §12.5 | REQUIRES_DECISION (D-063) |
| KPI tiles | Yesterday net sales · Orders · Exceptions for you | API-M17-25 `sections[]` | MOCKUP | REQUIRES_DECISION (D-063, D-173) |
| Callouts | **Needs a decision** (items above delegated authority) · **Handled by staff** (summary counts) · **Data freshness** (per source, e.g. stock sync, settlements import, courier status) | API-M17-25 `sections[]`, `data_freshness[]` | DOCUMENTED A19 "Freshness labels and drill-down evidence" | REQUIRES_DECISION (D-063) |
| "Close" · "Edit digest settings" | Settings form not shown in MK; fields per API-M17-26: content sections, channels (WhatsApp needs consent/approved template), schedule, recipients, `expected_version` | API-M17-26 | DOCUMENTED A19 | REQUIRES_DECISION (D-063, D-014) |

### 4.10 Permissions

| Role | Access (source: API-M18-12, API-M17-01/-05 auth) |
|---|---|
| R-owner | Full page; owner-level exceptions and approvals; digest settings |
| R-ops_admin | Full page within operations; approvals it can decide; no sensitive finance changes (BP §3.1) |
| R-branch_manager | Branch-scoped tiles, exceptions and approvals within its authority (location filter fixed to assigned branch; cross-branch per D-029) |
| R-finance | Finance tiles and finance exceptions/approvals |
| R-catalog_staff, R-warehouse_staff, R-sales_support | No access to P-E01 (not listed for API-M18-12); their queues live on their screens |
| Sensitive | Gross margin/cost (permitted roles only, BP §14.4); recent activity limited to objects the viewer may see (API-M02-30 rules) |

### 4.11 Dependencies, related pages, open items

| Aspect | Items |
|---|---|
| APIs | API-M02-01, API-M03-02, API-M10-17, API-M11-09, API-M14-53, API-M17-01, API-M17-03, API-M17-05, API-M17-06, API-M17-08, API-M17-16, API-M17-20, API-M17-25, API-M17-26, API-M18-03, API-M18-12, API-M24-08 |
| Backend rules | BR-M17-03, BR-M17-04, BR-M17-05, BR-M17-06, BR-M17-08, BR-M17-13, BR-M17-18, BR-M18-02, BR-M18-03, BR-M18-04, BR-M18-07, BR-M18-09 |
| Entities | E-exception_case, E-approval_request, E-delegation, E-report_schedule, E-audit_event, E-automation_rule, E-job_attempt, E-sales_order, E-order_line, E-refund, E-stock_position, E-stock_count_line, E-transfer |
| Related pages | P-E02, P-E04, P-E08, P-E09, P-E10, P-E11, P-E12, P-E13, P-E14, P-E15 |
| CONDITIONAL / MOCKUP-ONLY / LATER | Marketplace seller application approvals — LATER (D-046); WhatsApp digest channel — REQUIRES_DECISION (D-063, D-014); "Staff time saved (est.)" uses BP §12.4 formula inputs that are measured, not assumed (BP §12.4) — D-173 |
| Tests | T31 (owner unavailable; only true exceptions escalate) |

---

## 5. P-E02 — Orders (`erp-orders.html`)

### 5.0 Summary

| Field | Value |
|---|---|
| Purpose | Order queue and detail across all channels (web, branch POS, WhatsApp, assisted) with three independent state machines, work-queue views, holds, line cancellation with allocated refund, re-notification, payment/webhook evidence, shipment evidence, timeline/audit, internal notes, and creation of **assisted orders** (phone, walk-in, WhatsApp basket) through the same pricing, reservation and payment rules |
| Evidence | DOCUMENTED (BP §30.1 Orders "Order queue/detail, assisted order, holds"; §10.1–10.3; §13.1–13.2 secure assisted orders; §14.1 Sales "assisted sales"; PR2 §6; PR1 §4 Orders) + MOCKUP |
| Route | NOT SPECIFIED · MK:erp-orders.html (saved views via `data-sv`; drawer `d-order` tabs `od-lines`, `od-pay`, `od-ship`, `od-time`, `od-notes`; modals `m-hold`, `m-cancel`, `m-assisted`; deep links `?order=…&tab=…`, `?cancel=1`, `#assisted`) |
| Phase / IDs | 1A (assisted orders, holds, cancellations); WhatsApp draft basket → order 1B (A08); payment reminders A28 P1/C · R03, R04, R08, R10, R11 · WP09, WP10, WP11 · T06, T07, T08, T09, T10, T33, T34 |
| Primary modules | M10 (+ M05 quotes, M06 reservations/transfers, M11 payments/refunds, M12 fulfilment docs/sync, M19 invoices, M20 notifications, M18 saved views/exports) |
| D-004 native-vs-custom considerations | BP §30.1 lists order queue/detail, assisted order, holds. Order processing is the most frequent operational task (every order; BP §4 "Staff touch time per accepted order"). BP §10.1 "Do not implement a single status field that tries to represent all five processes" — any native order screen must show order, payment, fulfilment, refund and return states separately. BP §15.4 proposes ERPNext for operations "without editing vendor core" and narrow endpoints for customer/vendor channels. Assisted orders must use the same pricing engine and reservation as the website (BP §8.1, §13.2). Mockup: custom |
| Status | REQUIRES_DECISION (D-004, D-101) |

### 5.1 Page head, KPI strip, filter bar

| Element | Specification | → API | Label | Status |
|---|---|---|---|---|
| Crumb / title / subtitle | "Sell & serve › Orders" · "Orders" · "All channels · {date} · live, refreshed HH:MM:SS · stock authority in sync (lag N s)" | API-M10-08 (as-of), API-M24-08 summary | MOCKUP; BP §14.4 | NOT_STARTED |
| "Export" | Orders export for current filters/view (§2.20 #2) | API-M18-03 (`dataset=orders`) | DOCUMENTED BP §14.4 | REQUIRES_DECISION (D-152) |
| "Print pick lists" | Pick lists for released orders at the user's location (printer/format per D-111) | API-M12-10 (`doc_type=pick_list`) | DOCUMENTED BP §10.4 | REQUIRES_DECISION (D-055, D-111) |
| "Assisted order" (primary) | Opens `m-assisted` (§5.8); also reached from shell "New › Assisted order" and P-E05 | API-M10-18 | DOCUMENTED BP §13.1 | NOT_STARTED |
| KPI tiles | Orders today (delta vs same weekday — sample baseline) · Awaiting payment (₹ in live reservations) · Needs action (oldest age · critical count) · Overdue dispatch (delta vs last week) · Paid → dispatched (sparkline) · Cancel requests (₹ at stake · response SLA — sample) | gap-5 | MOCKUP; BP §4 | REQUIRES_DECISION (D-173) |
| Search | "Order no., customer, serial…" | API-M10-08 `q` (order no., product, serial, customer) | MOCKUP | NOT_STARTED |
| Filters | Date (Today · Last 7 days · Last 30 days · This financial year · Custom range…) → `from`/`to`; Location (All + each location) → `location_id`; Channel (Web · Branch POS · WhatsApp · Assisted (staff)) → `channel`; Buyer type (Consumer (B2C) · Approved dealer (B2B)) → `buyer_type`; Payment state (Not started · Pending · Failed · Captured · COD · due on delivery · Refunded) → `payment_state`; "Reset" | API-M10-08 | MOCKUP; "COD" CONDITIONAL (D-020); payment labels vs stored states D-150 | REQUIRES_DECISION (D-020, D-150, D-170) |
| Stale-data callout | "Courier status sync paused since HH:MM (provider timeout, n auto-retries). Fulfilment states for N dispatched shipments may be stale — order and payment states are unaffected." · "View job" (P-E14) · "Sync now" | API-M12-17 (manual sync), API-M17-16 (job) | MOCKUP ("Stale-data state"); BP §14.4, §10.5 | REQUIRES_DECISION (D-013) |

### 5.2 Saved views (work queues) and table

| Element | Specification | → API | Label | Status |
|---|---|---|---|---|
| View tabs | All (total) · Needs action · Awaiting payment · On hold · Partially fulfilled · Cancellation requests — each with a count | API-M10-08 `view` (needs_action, awaiting_payment, on_hold, partially_fulfilled, cancellation_requests); counts gap-2 | MOCKUP ("Saved views = work queues") | NOT_STARTED |
| "Save view" | Save current filters as a named view, optionally for the team ("View saved as '…' for your team") | API-M18-14; list API-M18-13 (`screen_key=orders`) | MOCKUP | NOT_STARTED |
| "Columns" (icon) | Column chooser; persistence of the choice not specified | — | MOCKUP | REQUIRES_DECISION (D-170) |
| Table columns | ☐ · **Order** (number; second line = exception note with icon, else created time) · **Buyer** (name; badge "Dealer {price-list name}" or "Consumer") · **Channel** (icon + Web/POS/WhatsApp/Assisted) · **Loc.** (location code, tooltip name) · **Value** (order total; units count) · group header "Three independent state machines — never one status": **Order state** · **Payment** · **Fulfilment** · **SLA flag · age** (ok/warn/bad pill with text, e.g. "Dispatch by 16:00", "Approval due 12:00", "Overdue · 26 h"; age) | API-M10-08 items | DOCUMENTED BP §10.1; MOCKUP | NOT_STARTED |
| State vocabularies | Order: Draft, Awaiting payment, Confirmed, On hold, Partially fulfilled, Fulfilled, Cancelled, Closed (BP §10.1). Payment: Not started, Pending, Failed, Captured, COD · due, Refunded (summary labels — D-150). Fulfilment: Unallocated, Allocated, Picking, Packed, Partly dispatched, Dispatched, Delivered, Delivery failed, Released (summary labels — D-150) | — | DOCUMENTED / MOCKUP (00-conventions §12 #7) | REQUIRES_DECISION (D-150) |
| SLA flags | Deadline texts come from exception/deadline rules (A16) and approvals; values are samples | API-M10-08 `sla_flag`, `age` | DOCUMENTED A16 | REQUIRES_DECISION (D-138, D-078) |
| Row click | Opens `d-order` on the Lines tab | API-M10-07 | MOCKUP | NOT_STARTED |
| Pager | "Showing 1–18 of 148" / "Showing N of N matching" when filtered | API-M10-08 page info (D-080) | MOCKUP | NOT_STARTED |
| Empty state | "No orders match these filters — Nothing in {view} for the selected location, channel or payment state." + "Clear filters" | — | MOCKUP; BP §22.5 | NOT_STARTED |

### 5.3 Bulk actions

| Action | → API | Result / rule | Label | Status |
|---|---|---|---|---|
| Release to fulfilment | API-M10-13 `release_to_fulfilment` | Only eligible orders (paid/approved + reserved, A11); per-order results with skip reasons | DOCUMENTED BP §10.4, A11; BR-M10-15 | NOT_STARTED |
| Print pick lists | API-M12-10 `pick_list` | Document for selected released orders | DOCUMENTED BP §10.4 | REQUIRES_DECISION (D-055, D-111) |
| Assign… | API-M10-13 `assign` / API-M12-06; picker gap-7 | Assignment audited | MOCKUP | NOT_STARTED |
| Place on hold | Opens `m-hold` for the selection → API-M10-13 `hold{…}` | Same fields as §5.5 | DOCUMENTED BP §10.1 "on hold" | NOT_STARTED |
| Payment reminder | API-M10-13 `payment_reminder` | Only to consented, eligible orders; opted-out skipped and reported ("1 skipped (customer opted out)") | CONDITIONAL A28 (P1/C); BP §13.5 (not debt collection); T25 | REQUIRES_DECISION (D-078, D-058) |
| Export | API-M18-03 (selected order IDs) | Export job | DOCUMENTED BP §14.4 | REQUIRES_DECISION (D-152) |
| Note | "Each order keeps its own decision history" (BP §18.2) | — | DOCUMENTED | — |

### 5.4 Drawer `d-order` — order detail

**Head.** Meta line "Created {time} · {channel} · fulfil from {location name (code)}"; order number; buyer badge
(dealer name + price list, or consumer); source badge (e.g. "WhatsApp draft basket DB-…"); "Copy link" (deep link to
this order and tab — MOCKUP); close. **State boxes** (§2.12): *Order* (state + guard text, e.g. "Release blocked until
resolved", "Awaiting approval APR-…", "Reserved · waiting for payment", "Guard: paid + stock allocated"); *Payment*
(state + amount/provider, "1 failed attempt · link still valid", "UPI collect sent", "No attempt yet", "Collect on
delivery"); *Fulfilment* (state + wave/assignee, attempt n of n, courier in transit, "1 of 2 lines shipped"); *Return*
(state + "Eligible until {date} (policy vX)" or "Not delivered yet" — return window starts at delivery, BR-M12-15).
→ API-M10-07. Label: DOCUMENTED BP §10.1; MOCKUP.

**Exception callouts in the head** (one per active exception on the order; API-M10-07 `staff{holds[]…}` plus open E-exception_case records whose subject is the order — lookup by subject is gap-18):

| Situation (MK sample) | Callout content | Action(s) | → API | Label | Status |
|---|---|---|---|---|---|
| Payment captured after reservation expiry | Reservation expiry and capture times, "stock was not oversold", alternate unit available, owner + due | "Reserve alternate" · "Refund" | API-M10-17 · API-M11-09 | DOCUMENTED BP §10.3, §29.6, T09 | REQUIRES_DECISION (D-026) |
| Customer requested cancellation of a line | Line, channel, pick state, eligibility, respond-by | "Review & cancel line" → `m-cancel` | API-M10-09 | DOCUMENTED BP §10.3, T34 | NOT_STARTED |
| Dealer requested full cancellation | Whole order eligible; refund to original method | "Review" → `m-cancel` | API-M10-09 | DOCUMENTED | NOT_STARTED |
| On hold (e.g. GSTIN on invoice ≠ dealer profile) | Reason, linked ticket, who must verify, reservation extended to | "Release hold" | API-M10-15 | DOCUMENTED BP §10.1; MOCKUP | REQUIRES_DECISION (D-026) |
| Overdue dispatch — short pick, count task raised | Cause, count task, stock available elsewhere | "Request transfer" | API-M06-13 | DOCUMENTED BP §9.5, §12.5 | NOT_STARTED |
| Delivery failed (raw courier status shown) | "Order and payment states are unchanged"; next attempt; RTO after last attempt | "Ask customer" (address-check template) | API-M20-03 | DOCUMENTED BP §10.5 | REQUIRES_DECISION (D-058) |
| Discount approval pending | Requested %, requester authority, margin vs floor, approver, due; "Order stays Draft — no stock reserved, no link sent" | "Open approval" → P-E14 | API-M17-02 | DOCUMENTED BP §18.1; MOCKUP | REQUIRES_DECISION (D-024) |

#### 5.4.1 Tab `od-lines` — Lines & pricing

| Section | Content | → API | Label | Status |
|---|---|---|---|---|
| Lines table | **Item · condition** (thumb, title, condition badge, SKU) · **Qty** · **Allocated unit** (unit ID chip + masked/printed S/N + inspection record link; or "Not allocated", "Qty allocated · serial at pick", "n/n serials scanned · bin", "Picked · held at pack bench", "Serials captured at pack") · **Unit (ex-GST or incl. GST) · rule** (price + rule tag, e.g. list version and tier) · **Line total** · **Line status** (fulfilment pill or "Cancel req." badge) | API-M10-07 lines | DOCUMENTED BP §9.4 (serial allocation), §10.4, §8.1 (rule version on line) | REQUIRES_DECISION (D-031) |
| Price snapshot | Price list · rule; Quote (id · locked time · validity); "Revalidated at checkout" (result + time); Promotion; Stacking policy (version + summary); Margin check (visible to permitted roles only) | API-M10-07 (order snapshot) | DOCUMENTED BP §8.1 steps 7–8, T33; MOCKUP | REQUIRES_DECISION (D-017, D-154) |
| Snapshot note | When a newer list version exists: "this order keeps its snapshot (T33)" | API-M10-07 | DOCUMENTED T33 | NOT_STARTED |
| Totals | Subtotal (ex-/incl. GST) · order discount · GST (CGST+SGST / IGST or "GST included") · shipping · order total; invoice type note (B2B tax invoice · place of supply / B2C invoice) | API-M10-07 | DOCUMENTED BP §8.1 step 5, §14.4 | REQUIRES_DECISION (D-016, D-037) |
| Stock reservation | Reservation ID · location · state (Active with expiry meter / Expired "unit re-reserved by another order" / Converted to allocation at capture / None — "draft orders don't hold stock until approved and sent"); explanatory line (hold duration, release job A06) | API-M10-07 reservations | DOCUMENTED BP §9.2, §10.2, A05, A06 | REQUIRES_DECISION (D-026, D-151) |
| Customer & delivery | Buyer (+ GSTIN for dealers) · Contact (masked, "verified") · Ship to · Promise (dispatch/delivery estimate) | API-M10-07 | DOCUMENTED BP §13.4 (masking), §6.5 | REQUIRES_DECISION (D-153) |

#### 5.4.2 Tab `od-pay` — Payments (count badge = attempts)

| Section | Content | Actions | → API | Label | Status |
|---|---|---|---|---|---|
| Payment attempts | Table: Attempt · Provider reference · Method · Amount · State · Time · Detail (e.g. decline code, settlement batch); COD row "Due on delivery"; empty "No payment attempt yet" with reason ("Checkout link is sent only after the discount approval" / "waiting for the customer") | — | API-M11-04 (`order`), API-M11-05 | DOCUMENTED BP §10.1 payment states, §10.2 | REQUIRES_DECISION (D-012; COD D-020) |
| Webhook event log | "signature verified · recorded once · applied in legal order"; table: Event id · Type · Received · Signature · Result (Applied / Applied (no-op) / Ignored — duplicate id / Ignored — out-of-order) · Effect; footer "Reconciled against {provider} at HH:MM — provider and order records match" | "Reconcile now" | API-M11-07 (by order), API-M11-06 (`scope=order_id`, Idem) | DOCUMENTED BP §10.2–10.3, T07, T08 | NOT_STARTED |
| Refunds | Refund rows (ID · amount · route · completion time · provider ref · state) or note "Line cancellations and returns create a refund request for finance — one provider refund per request (T18)" | — | API-M11-08 (by order) | DOCUMENTED BP §10.3, T18 | NOT_STARTED |
| Invoice | Invoice number · "generated once on confirmation" · type; "PDF" | "PDF" | API-M19-01, API-M19-02 | DOCUMENTED BP §10.3 (no duplicate invoice), §14.2 | REQUIRES_DECISION (D-055) |

Raw provider payloads only for permitted roles (API-M11-07). Payment attempt data for R-sales_support is read-only and
location-scoped (API-M11-04).

#### 5.4.3 Tab `od-ship` — Shipments

| Section | Content | → API | Label | Status |
|---|---|---|---|---|
| Shipment panel | Shipment ID · courier · AWB · parcels · weight · canonical state; booking/label/manifest/handover evidence line ("rider OTP + photo" — MOCKUP-ONLY D-132) | API-M10-07 fulfilments, API-M12-04 | DOCUMENTED BP §10.4 (handover with evidence) | REQUIRES_DECISION (D-013, D-132) |
| Split shipment callout | Second line ships separately (partner stock / transfer), "Customer was told at checkout (split shipment approved)" | API-M10-07 | DOCUMENTED BP §10.4 "partial dispatch only if the client approves" | REQUIRES_DECISION (D-029) |
| Carrier events | Table: Carrier time · Raw carrier status (code + text) · Canonical state; note "Courier events are external evidence — mapped to canonical fulfilment states; raw events kept. They never change order or payment state" | API-M12-04 (shipment events) | DOCUMENTED BP §10.5 | REQUIRES_DECISION (D-013) |
| Counter handover | "Handed over at {branch} counter · time · signature · serials printed on invoice · No courier shipment" | API-M10-07 | MOCKUP; BP §5.2 branch sale | REQUIRES_DECISION (D-009, D-030) |
| Empty | "No shipment yet" + text (booking happens when packed; manual booking fallback) + serviceability panel (location → PIN · service · COD offered/not; promised dispatch) | API-M10-07 | DOCUMENTED BP §6.5, §16.4 | REQUIRES_DECISION (D-013, D-020) |

#### 5.4.4 Tab `od-time` — Timeline & audit

| Section | Content | → API | Label | Status |
|---|---|---|---|---|
| Timeline | Ordered events with status icon (done/warn/current): draft basket created (source conversation), quote locked, customer confirmed + reservation, payment attempts (failed/captured, event ids, automation rule, duplicate ignored), invoice + pick task released, notification delivery failures and retries, cancellation requests, picking progress, "Now" (current SLA text) | API-M10-07, API-M20-04 (notification delivery states) | DOCUMENTED BP §10.3 (notification failure exposed), §17.3 | NOT_STARTED |
| Audit trail | Table Actor (user or automation rule + version, time) · Change (state change, input reference, idempotency key; price snapshot written; cancel request; pick started) | API-M02-30 (`object=order`) | DOCUMENTED BP §17.3, §20.1 | NOT_STARTED |
| "viewed order · read access logged" row | MK logs read access to the order | API-M02-30 | MOCKUP — whether record reads are logged is not documented; include in D-114 scope | REQUIRES_DECISION (D-114) |

#### 5.4.5 Tab `od-notes` — Notes (count badge)

| Element | Specification | → API | Label | Status |
|---|---|---|---|---|
| Note list | Author · team · timestamp · text | API-M10-07 (notes) | MOCKUP-ONLY | REQUIRES_DECISION (D-134) |
| Add internal note | Field "Add internal note" (textarea, Y, placeholder "Visible to staff only · @mention to notify"); button "Add note"; hint "Notes are internal and never sent to the customer" | API-M10-16 (`text`, `mentions[]`) | MOCKUP-ONLY (E-internal_note, 00-conventions §7.1) | REQUIRES_DECISION (D-134) |

#### 5.4.6 Drawer foot

| Action | → API | Result | Label | Status |
|---|---|---|---|---|
| Hold | `m-hold` → API-M10-14 | Order `on_hold` | DOCUMENTED | NOT_STARTED |
| Cancel line… | `m-cancel` → API-M10-09 | Lines cancelled, reservation released, refund request | DOCUMENTED T34 | NOT_STARTED |
| Resend notification ▴ | Menu "Transactional · consent checked": Order confirmation · email; WhatsApp · approved template (name/version sample); SMS · dispatch & tracking; footer shows last delivery failure and auto-retry time | API-M20-03 (template, channel, related order); delivery info API-M20-04 | DOCUMENTED A14, BP §13.3 | REQUIRES_DECISION (D-058, D-014, D-015) |
| Add note | Switches to `od-notes` | — | MOCKUP-ONLY | REQUIRES_DECISION (D-134) |
| Invoice | Opens invoice document ("generated once") | API-M19-02 | DOCUMENTED BP §10.3 | REQUIRES_DECISION (D-055) |
| Open in fulfilment → | Navigates to P-E03 (picking) for this order | — | MOCKUP | NOT_STARTED |

### 5.5 Modal `m-hold` — Place order on hold

Subtitle: "Stops release to fulfilment · payment and reservations are kept".

| Field | UI control | Req | Validation (source) | API field |
|---|---|---|---|---|
| Reason | Select: Customer request — confirm details · Address / GSTIN verification · Payment review (mismatch or risk) · Stock exception · Awaiting approval | Y | Reason catalogue D-139; hold must have reason (BR-M10-16) | `reason_code` |
| Review by | Date-time | Y (hold carries review date, BR-M10-16) | Future time; D-124 | `review_by` |
| Owner | Select of staff (MK: support / operations / finance) | Y | Assignee picker gap-7 | `owner_user_id` |
| Note (internal) | Textarea, placeholder "What must happen before release?" | N | — | `note` |
| Notify customer | Switch "Notify customer that the order is under review (template …)" | N | Consent/template rules (BP §13.3) | `notify_customer` |

Info callout (MK): reservation extended while on hold (maximum duration sample), escalation to operations manager
once if review time passes (A16). → API-M10-14 (bulk: API-M10-13 `hold`). Result: `on_hold`, E-exception_case,
audit. Errors: `409 STATE_TRANSITION_INVALID`. Label DOCUMENTED BP §10.1; MOCKUP. Status REQUIRES_DECISION (D-026 hold
extension, D-139, D-150).

### 5.6 Modal `m-cancel` — Cancel line(s)

Subtitle: "Only lines not yet dispatched are eligible · refund uses the original allocated price".

| Element | Specification | → API | Label | Status |
|---|---|---|---|---|
| Line list | Per line: checkbox (disabled when not eligible), thumb, title, qty × unit · condition (+ "customer requested"), line value, eligibility note ("not picked", "picked · return to bin", "already shipped → use return") | API-M10-07; eligibility gap-6 | DOCUMENTED BP §17.4 "State, quantity and refund rules" | NOT_STARTED |
| Cancellation reason | Select (Y): Customer request (before dispatch) · Out of stock / cannot fulfil · Pricing error · Suspected fraud (staff-only reasons need permission) | API-M10-09 `reason_code` | DOCUMENTED 06-api §4.5 | REQUIRES_DECISION (D-139) |
| Refund preview | Line value (ex/incl. GST) · allocated order discount · GST reversed / of which GST · shipping · **Refund to customer** (or "No refund — payment not captured, reservation released only"); route (original method, credit note ref) | gap-6 (preview); final values from API-M10-09 response `refund{}` | DOCUMENTED BP §8.4, §17.6 | REQUIRES_DECISION (D-082) |
| Stock effect | "N units released from {location} back to available stock (after the picker returns them to bin — task created). Other lines keep their allocation." | gap-6 | DOCUMENTED BP §10.3 partial cancellation | NOT_STARTED |
| Promotion effect | Warning when remaining order falls below a promotion threshold — clawback policy "proposed, client to confirm" | gap-6 | MOCKUP | REQUIRES_DECISION (D-082, D-043) |
| Control note | "Support initiates · Finance executes the refund (requested → approved → submitted → completed). A repeated click returns the same refund request (T18)" | — | DOCUMENTED BP §18.1, §10.3 | NOT_STARTED |
| "Keep lines" · "Cancel selected & request refund" (danger) | Primary disabled until ≥1 eligible line and reason; Idem | API-M10-09 (Idem) | DOCUMENTED T34, T06 | NOT_STARTED |

Result: E-order_cancellation, affected reservations released, one refund request (E-refund `requested`) for the
allocated amount, customer notified (outbox). Errors: `409 STATE_TRANSITION_INVALID` (already dispatched), `422
POLICY_INELIGIBLE`, `409 IDEMPOTENCY_CONFLICT`.

### 5.7 Deep links

`?order={id}` opens the drawer; `&tab={od-*}` selects a drawer tab; `?cancel=1` opens `m-cancel`; `#assisted` opens
`m-assisted` (used by the shell "New" menu and P-E05 "Open as assisted order"). MOCKUP; route scheme D-101.

### 5.8 Modal `m-assisted` — New assisted order (xl)

Subtitle: "Staff-created order · uses the same pricing engine, stock reservation and payment rules as the website"
(BP §8.1, §13.2, §29.5).

| Element | Specification | → API | Label | Status |
|---|---|---|---|---|
| "Acting as" role selector | Prototype aid; the acting role comes from the session and is never sent (06-api §4.15) | — | MOCKUP (prototype aid) | excluded |
| Source callout + segmented source | WhatsApp basket · Phone · Walk-in. WhatsApp: "Created from WhatsApp draft basket DB-… · conversation SUP-… · identity verified by OTP HH:MM · chat prices are not trusted; every price is recomputed". Phone: "caller identity must be verified (OTP to the registered number) before account prices or order history are shown". Walk-in: "customer present at {branch} counter · pay at POS or send link" | API-M10-18 `source`, `conversation_id` | DOCUMENTED BP §13.2, §13.4, §29.5; WhatsApp basket 1B (A08) | REQUIRES_DECISION (D-014) |
| Customer | Select/search: existing business account (name, contact, price list, GSTIN) · consumer (masked phone) · "New walk-in customer (consumer)"; hint "Buyer type comes from the approved account — it can't be changed on the order (T10)" | API-M08-28 (search), API-M08-33 (business accounts); `customer{…}` in API-M10-18 | DOCUMENTED BP §8.4, T10 | NOT_STARTED |
| Fulfil from | Select of locations with line availability ("all lines available", "1 line short") or "Customer pickup · {branch}"; hint "Single location that can fulfil every line is suggested first" | API-M03-02, API-M06-04; basket suggestion gap-8 | DOCUMENTED BP §9.5 default rule; pickup CONDITIONAL | REQUIRES_DECISION (D-029, D-061) |
| Add product | Search input "Search by name, model or SKU"; results (thumb, title, SKU · condition, context price with tax basis, availability "n avail." / "partner stock") + "Add"; no-query state "Suggested for this customer" | API-M21-01 + API-M05-01 (context price) + API-M06-04; suggestions gap-8 | DOCUMENTED BP §13.2 (agent selects item); suggestions MOCKUP | NOT_STARTED |
| Lines table | Item · availability (condition badge, SKU, "n available at {location}" / "short by n" / "Partner stock · lead time") · Qty stepper · Unit price · rule (+ tier hint "+n → tier {x} {price}") · Line total · remove | API-M05-01 (quote), API-M10-19 (save) | DOCUMENTED BP §8.1–8.2, §8.4 (quantity change recalculates tier) | REQUIRES_DECISION (D-018, D-073) |
| Empty lines | "No items yet — Search above to add products" | — | MOCKUP | NOT_STARTED |
| Staff discount | % input (decimal) + reason select (bulk / tender quote · price match (evidence) · service recovery) + "Your authority: up to n % (example threshold)"; result callout: within authority ("applies immediately, recorded with your reason") / needs approval ("becomes request APR-…, routed to {approver} → {higher approver}; order stays Draft; no stock reserved and no link sent until approved; deadline, alternate approver") / owner override below floor ("reason mandatory, appears in digest and audit") | API-M10-18/-19 `staff_discount{percent, reason_code, evidence_file_id?}` → 202 approval | DOCUMENTED BP §18.1, §12.6, §8.4 (margin floor) | REQUIRES_DECISION (D-024, D-139) |
| Price summary | List basis label (e.g. dealer list · ex-GST / public list · GST-incl.) · Subtotal · Staff discount · GST · Shipping · **Payable**; "Margin after discount (est.)" with floor meter — cost/margin only for permitted roles | API-M05-01 / API-M10-19 response | DOCUMENTED BP §8.1; margin visibility BP §3.1 | REQUIRES_DECISION (D-016, D-135) |
| Payment option (radio) | **Send secure checkout link** (WhatsApp if service window open · SMS · email; customer confirms address and final price and pays via the provider) · **Collect at branch counter (POS)** (UPI/card on terminal, invoice printed at counter) · **Bank transfer (dealer prepaid)** (released only after finance matches the credit; credit terms not enabled) | API-M10-20 · API-M10-21 (`payment_route=pos_counter`), API-M11-19 · API-M10-21 (`bank_transfer`) | DOCUMENTED BP §13.2, §29.5, §8.3 (prepaid default), §5.2 branch sale; MOCKUP | REQUIRES_DECISION (D-151, D-014, D-012, D-009, D-030, D-019) |
| Reservation note | "Stock is reserved for {duration} when the link is sent" (MK) — reservation timing at send vs confirmation is open | — | MOCKUP (00-conventions §12 #8) | REQUIRES_DECISION (D-151, D-026) |
| Foot | "Draft saved automatically · DB-… → order on confirmation"; "Cancel" · "Save draft" ("no stock reserved yet") · primary "Send checkout link" which becomes **"Submit for approval"** when the discount/margin exceeds authority | API-M10-19 (save), API-M10-20 (send, Idem), approval via 202 | DOCUMENTED BP §13.2; MOCKUP | REQUIRES_DECISION (D-151) |

Validation: at least one line; quantity ≥ 1; customer required; fulfil-from required; discount reason required when
discount > 0; no link while an approval is pending (06-api §4.15). Errors: `409 STOCK_UNAVAILABLE` (line shows
available qty), `PRICE_CHANGED` (new quote shown for acceptance), `403 CONSENT_MISSING` / `409
WINDOW_CLOSED_TEMPLATE_REQUIRED` (link channel), `202 APPROVAL_REQUIRED`.

### 5.9 States

| State | Specification | Source |
|---|---|---|
| L | Table skeleton rows; drawer tabs load lazily with skeletons | BP §22.5 |
| E | View/filter empty state (§5.2); drawer tabs: "No payment attempt yet", "No shipment yet", no notes | MK; BP §22.5 |
| X | List error with retry; drawer error keeps head visible; action errors inline (error envelope, `correlation_id`) | BP §22.5; D-080 |
| S | Courier-sync stale callout (§5.1); subtitle shows refresh time and stock-authority lag; stale shipments flagged in `od-ship` | BP §14.4 |
| Failure cases (BP §10.3) | Late capture exception; duplicate/out-of-order webhook rows marked "Ignored"; refund timeout shows pending (P-E12); notification failure visible with retry; partial cancellation preview; stock authority unavailable → assisted-order confirmation blocked with `503 STOCK_AUTHORITY_UNAVAILABLE` message | BP §10.3; 06-api §1.7 table |

### 5.10 Permissions

| Role | Access (06-api auth for API-M10-07/-08/-09/-13/-14/-18 …) |
|---|---|
| R-sales_support | View/search orders (loc/own served); holds; cancellation requests; notes; resend notifications; assisted orders; discount within own authority; refund **request** only |
| R-branch_manager | As sales support for its branch + release holds, bulk release, reservation alternates, higher discount authority (D-024) |
| R-ops_admin | All orders; all actions except finance execution |
| R-finance | Payment review holds; payments/refunds tabs; bank-transfer matching (API-M11-19); refund execution in P-E12 |
| R-owner | All; overrides with reason (audited) |
| R-warehouse_staff | Read order detail needed for fulfilment (API-M10-07 role + loc); pick lists |
| Sensitive | Customer contact masked (D-153); margin/cost columns permitted roles only; raw webhook payloads permitted roles only; dealer/contract prices visible to staff roles with order access |

### 5.11 Dependencies, related pages, open items

| Aspect | Items |
|---|---|
| APIs | API-M02-30, API-M03-02, API-M05-01, API-M06-04, API-M06-13, API-M08-28, API-M08-33, API-M10-07, API-M10-08, API-M10-09, API-M10-13, API-M10-14, API-M10-15, API-M10-16, API-M10-17, API-M10-18, API-M10-19, API-M10-20, API-M10-21, API-M11-04, API-M11-05, API-M11-06, API-M11-07, API-M11-08, API-M11-09, API-M11-19, API-M12-04, API-M12-06, API-M12-10, API-M12-17, API-M17-02, API-M17-16, API-M18-03, API-M18-13, API-M18-14, API-M19-01, API-M19-02, API-M20-03, API-M20-04, API-M21-01, API-M24-08 |
| Backend rules | BR-M10-01…07, BR-M10-10, BR-M10-11, BR-M10-13, BR-M10-15, BR-M10-16, BR-M10-17; BR-M05-01, BR-M05-03, BR-M05-11, BR-M05-13, BR-M05-20; BR-M06-05, BR-M06-06; BR-M11-03…05, BR-M11-08, BR-M11-09, BR-M11-15; BR-M12-08; BR-M20-01…04 |
| Entities | E-sales_order (incl. `hold`), E-order_line, E-order_cancellation, E-idempotency_record, E-quote, E-quote_line, E-reservation, E-payment_attempt, E-payment_event, E-refund, E-fulfilment, E-shipment_event, E-invoice_reference, E-notification, E-exception_case, E-approval_request, E-audit_event, E-internal_note (§7.1), E-saved_view (§7.1) |
| Related pages | P-E03 (fulfilment), P-E05 (source conversations, draft baskets), P-E10 (customer), P-E12 (payments/refunds), P-E14 (approvals, jobs), P-S07/P-S08 (customer checkout link, tracking) |
| CONDITIONAL / MOCKUP-ONLY | COD filters/labels — CONDITIONAL (D-020); internal notes — MOCKUP-ONLY (D-134); payment reminders — CONDITIONAL A28 (D-078); rider OTP/manifest evidence — MOCKUP-ONLY (D-132); customer pickup — CONDITIONAL (D-061); POS counter confirmation — D-009/D-030; product suggestions for a customer — MOCKUP (gap-8) |
| Tests | T06, T07, T08, T09, T10, T18, T23 (phone/WhatsApp verification before details), T25, T33, T34 |

---

## 6. P-E03 — Pick · pack · dispatch (`erp-fulfilment.html`)

### 6.0 Summary

| Field | Value |
|---|---|
| Purpose | Location-scoped warehouse/branch work queue by stage: released orders to pick (waves), scan-verified picking (bin → SKU → serial against allocation, substitution blocked), packing checklist with documents and evidence, courier booking (API + manual fallback, lost-response reconciliation), handover manifest, dispatched-today tracking with raw carrier events, and delivery/warehouse exceptions |
| Evidence | DOCUMENTED (BP §10.4 "Release eligible orders to a staff queue. Staff scan location/SKU/serial, verify the condition and included accessories, print the appropriate invoice/packing label, and mark shipment handover with evidence"; §10.5; §30.1 Orders "picking, packing, dispatch"; A11, A12, A13, A16; PR2 §6 Pick/pack, Dispatch) + MOCKUP; pick waves and manifests MOCKUP-ONLY (D-132) |
| Route | NOT SPECIFIED · MK:erp-fulfilment.html#topick, #picking, #topack, #ready, #dispatched, #exceptions; modal `m-manual`; `?loc=` |
| Phase / IDs | 1A · R08, R14, R19 · WP11 · T17, T20, T21 |
| Primary modules | M12 (+ M06 counts/transfers/adjustments/erasure, M13 RTO receipt, M19 invoices, M20 notifications, M17 exceptions) |
| D-004 native-vs-custom considerations | BP §10.4 describes a scan-driven workflow performed for every dispatched order (frequent). Devices and handheld layout are open (D-110, D-147); BP §28.4: staff mobile optimisation or a staff app is not implied in Phase 1. BP §15.1/§9.4: ERPNext serial records exist as a reuse candidate "to prove through realistic workflows"; proof scenario 1–2 and 7 (BP §15.3) touch serial handling. Mockup: custom scan station |
| Status | REQUIRES_DECISION (D-004, D-101); scanning devices REQUIRES_DECISION (D-110) |

### 6.1 Page head and KPI strip

| Element | Specification | → API | Label | Status |
|---|---|---|---|---|
| Crumb / title | "Sell & serve › Pick · pack · dispatch" | — | MOCKUP | NOT_STARTED |
| Subtitle | "{Location name} ({code}) · {date} · shift/branch hours · courier cut-off · courier pickup time" — hours, cut-off and pickup times are samples | API-M03-02 (location), API-M24-01 (configuration) | MOCKUP | REQUIRES_DECISION (D-013, D-074) |
| Location selector | "Location" select — **counts and queues are scoped to one location** (MK anno "Location-scoped work queue"); options limited to the user's locations | API-M03-02 → API-M12-03 `location_id` | DOCUMENTED BP §3.1 (warehouse staff: assigned locations); R14 | REQUIRES_DECISION (D-170) |
| "Pick list" | Print pick list for the active wave | API-M12-10 (`pick_list`, `wave_id`) | DOCUMENTED BP §10.4 | REQUIRES_DECISION (D-111, D-132) |
| "Handover manifest" | Switches to `#ready` | — | MOCKUP | NOT_STARTED |
| "Start next wave" (primary) | Creates a wave from released fulfilments (route by bin sequence) | API-M12-05 | MOCKUP-ONLY (D-132) | REQUIRES_DECISION (D-132) |
| KPI tiles | Due today (n before express cut-off) · Paid → dispatched (delta, sparkline) · Overdue (> 24 h, oldest order) · Scan accuracy (wrong units blocked today) · Courier integration (Degraded/OK: "Booking OK · tracking sync paused") · Next pickup (parcels on manifest · staged) | API-M12-03 counts; integration status API-M24-08 summary / gap-5 | MOCKUP; BP §4 (paid→dispatched), §20.3 | REQUIRES_DECISION (D-173) |

### 6.2 Stage tabs

Tabs with counts per stage for the selected location: To pick · Picking · To pack · Ready to ship · Dispatched today
· Exceptions (hot). → API-M12-03 (`stage`, counts per stage). Page tab → URL fragment.

### 6.3 Tab `#topick` — To pick

| Element | Specification | → API | Label | Status |
|---|---|---|---|---|
| Card "Released orders" | Sub: "Paid + stock reserved → released automatically by rule A11 · held and cancel-requested orders are blocked" | API-M12-03 `stage=to_pick` | DOCUMENTED BP §10.4, A11; BR-M10-15, BR-M12-02 | NOT_STARTED |
| Sort | Segmented Priority · Promise time · Zone | API-M12-03 `sort` | MOCKUP | NOT_STARTED |
| Table | ☐ (disabled for blocked rows) · **Order** (number, customer, flag e.g. "Short pick", "Cancel req. · blocked") · **Items** (thumb, first title, "+n more · n units", "serial-specific") · **Priority** (Overdue · Express · Standard · Dealer · Store pickup — badge) · **Bins** · **Dispatch by** (time + remaining, progress meter coloured ok/warn/bad, picker name) | API-M12-03 items | MOCKUP; BP §10.4 | REQUIRES_DECISION (D-061 store pickup) |
| Bulk bar | "Create wave" → API-M12-05 · "Assign picker" → API-M12-06 (picker gap-7) · "Print" → API-M12-10 | as listed | MOCKUP (waves MOCKUP-ONLY D-132) | REQUIRES_DECISION (D-132) |
| Footer | "Held orders stay out of this queue until released" · "Orders →" P-E02 | — | DOCUMENTED BR-M10-16 | NOT_STARTED |
| Empty | "Nothing to pick at this location — New paid orders appear here automatically" (+ next pickup text) | — | MOCKUP | NOT_STARTED |
| Wave card | "Wave {id} · in progress" · picker · started · orders · "route by bin sequence" · state badge; progress "n of m units picked" meter; route list (bin, thumb, item, order ref/status, picked/required, error state "wrong unit scanned"); "Re-print" (API-M12-10) · "Open scan station" (→ `#picking`) | API-M12-03 (`wave_id`), API-M12-04 | MOCKUP-ONLY (D-132) | REQUIRES_DECISION (D-132) |
| No active wave | "Waves are created when at least n released orders are waiting, or at {time}" (rule values sample) + "Create wave now" | API-M12-05 | MOCKUP-ONLY | REQUIRES_DECISION (D-132, D-078) |
| Info callout | "Refurbished and open-box units are serial-specific … New stock reserves quantity; the serial is captured at pick" | — | PROPOSED BP §9.4 | REQUIRES_DECISION (D-031) |

### 6.4 Tab `#picking` — Scan station

| Element | Specification | → API | Label | Status |
|---|---|---|---|---|
| Header | "Scan station · {bench}" · picker · wave · order · "line n of m"; device state badge ("Scanner connected"); camera-scanning toggle | — | MOCKUP | REQUIRES_DECISION (D-110, D-147) |
| Step indicator | 1 Bin → 2 SKU → 3 Serial → 4 Verified against allocation; each step done/current/error with scanned value | API-M12-07 response `next_step` | DOCUMENTED BP §10.4 | NOT_STARTED |
| Scan input | Scan box "Scan bin, SKU or serial…" + "Enter" | API-M12-07 (`code`, `step`) | DOCUMENTED BP §10.4 | REQUIRES_DECISION (D-031, D-110) |
| "Simulate scan" quick codes | Prototype aid for the review | — | MOCKUP (review aid) | REQUIRES_DECISION (D-171) |
| Verification panel | Result states: **ok** (unit verified, inspection record linked, S/N recorded on invoice), **wrong bin**, **wrong SKU/condition** ("Condition is part of the SKU, so a different grade can never pass as the same item"), **wrong unit** (comparison grid Check · Allocated · Scanned for Unit, Condition, Configuration, Inspection, Expected bin, with ✓/✗), **unknown code** ("logged but change nothing") | API-M12-07 `result` (ok, wrong_unit, wrong_bin, not_found, duplicate), `expected` | DOCUMENTED BP §10.4 ("Flag substitution rather than silently sending a different configuration or condition"), §9.4 | NOT_STARTED |
| Mismatch actions | "Scan the correct unit" (focus input) · "Report mis-slotted unit" (→ recount task) · "Substitute" **disabled** ("Needs customer consent + manager approval from the order — not at the bench") · instruction "Put {unit} back to {bin}" | API-M12-08 (`mis_slot`); substitution only via P-E02 API-M10-17 with consent | DOCUMENTED BR-M12-05; MOCKUP | NOT_STARTED |
| Scan log | "Every scan is stored with user, device and time": time · code · result icon + message (newest first) | API-M12-04 `scan_log[]` | MOCKUP; BP §10.4 | NOT_STARTED |
| Allocation card | "Allocation · {order}" · customer · list · dispatch-by · "Order →" (P-E02 `?order=`); per line thumb, title (unit ID + grade for serial-specific), condition, badge (verified / awaiting correct unit / set aside · cancel requested); "Include with {unit}: accessories, battery health report, inspection sheet, warranty card" | API-M12-04 `allocation[]` | DOCUMENTED BP §10.4 (included accessories), BR-M12-04 | NOT_STARTED |
| Bench actions | "Short pick · bin empty or damaged" (→ count task, order to Exceptions) · "Park line & continue wave" (supervisor notified) · "Set aside cancel-requested line" · **"Complete pick → move to packing"** (enabled only when every line is verified) | API-M12-08 (`short_pick`, `park_line`, `set_aside_cancel_requested`) · API-M12-09 (`complete_pick`, Idem) | DOCUMENTED BP §10.4, §10.3; MOCKUP | NOT_STARTED |
| Next in wave | List of next orders with verification progress and bin | API-M12-03 (`wave_id`) | MOCKUP-ONLY (D-132) | REQUIRES_DECISION (D-132) |

### 6.5 Tab `#topack` — To pack

| Element | Specification | → API | Label | Status |
|---|---|---|---|---|
| "Picked · waiting to pack" | "FIFO by promise time"; rows (thumb, order, item summary, "by" time); selected row highlighted | API-M12-03 `stage=to_pack` | MOCKUP | NOT_STARTED |
| Benches panel | Bench status (packer, current order, idle, "scale offline") | gap-9 | MOCKUP | REQUIRES_DECISION (D-147) |
| Packing card header | "Packing · {order}" · customer · buyer type · PIN · service · dispatch by; product with condition badge, unit chip, S/N; "Pack progress n / m" | API-M12-04 | DOCUMENTED BP §10.4 | NOT_STARTED |
| Checklist (each row: checkbox, title, evidence line, action) | 1 Serial re-verified at pack bench (scan) · 2 Condition matches the listing (inspection record, photos compared) · 3 Accessories (as listed) · 4 Data-erasure certificate on file (storage devices) · 5 Inspection sheet printed & inserted ("Print") · 6 Warranty card (provider, start rule, policy version) · 7 Tax invoice printed ("generated once"; "Print invoice") · 8 Packaging (seal number) · 9 Weight & dimensions ("Capture" from scale) · 10 Packed-box photo (evidence; required above a value threshold — sample) ("Capture") | API-M12-09 `checklist{serial_verified, condition_matches, accessories, data_erasure, inspection_sheet, warranty_card, invoice, packaging, weight, photo_file_id}`; API-M06-10 (erasure evidence); API-M19-02 (invoice); API-M12-10 (`inspection_sheet`); API-M22-01 (photo) | DOCUMENTED BP §10.4, §7.5 (erasure), A12; MOCKUP | REQUIRES_DECISION (D-055, D-111, D-147, D-023) |
| Footer | "Invoice" (print) · "Shipping label" **disabled until AWB booked** · primary **"Mark packed & book courier"** enabled only when all checklist items are done | API-M12-09 (`mark_packed`, Idem) → enqueues booking (A13) via outbox; API-M12-10 (`shipping_label`, `409 NOT_READY` before AWB) | DOCUMENTED BP §10.4, A12, A13; BR-M12-12 | REQUIRES_DECISION (D-013) |

Checklist item set per product type and value thresholds are samples → D-023 (inspection/grade), D-024 (value
threshold for photo evidence), D-147 (scale/camera capture).

### 6.6 Tab `#ready` — Ready to ship

| Element | Specification | → API | Label | Status |
|---|---|---|---|---|
| Card "Courier booking" | Sub: "{primary courier} API (primary integration) · booking is idempotent per parcel reference · manual fallback captures the carrier's reference"; actions "Manual booking" (`m-manual`) · "Book selected" | API-M12-11 (Idem) | DOCUMENTED BP §10.4, §16.4, A13 (P1/C), T20 | REQUIRES_DECISION (D-013) |
| Table | ☐ · **Order · parcel ref** (order number; parcel reference `{order}-P1`) · **Parcel** (count · weight) · **Destination** (city PIN) · **Courier · service** · **AWB / reference** · **Label** (Printed / Uploaded / —) · **Booking state** (Booked · API / Response lost · reconcile / Manual · ref captured / Not booked) · row action ("Check status" for lost response, "Book" for not booked) | API-M12-03 `stage=ready_to_ship`; API-M12-12 (check); API-M12-11 (book) | DOCUMENTED T20; MOCKUP | REQUIRES_DECISION (D-013) |
| Bulk bar | "Book via API" (API-M12-11) · "Print labels" (API-M12-10 `shipping_label`) · "Add to manifest" (API-M12-14) | as listed | MOCKUP (manifest MOCKUP-ONLY D-132) | REQUIRES_DECISION (D-013, D-132) |
| Handover manifest card | "Handover manifest · {id}" · courier · pickup time · "dock-scanned when staged, re-scanned by the rider at handover"; "Print" (2 copies); progress "n of m parcels staged & dock-scanned"; list (order · AWB · staged time / not staged); "+ n more parcels" | API-M12-14, API-M12-10 (`handover_manifest`) | MOCKUP-ONLY (D-132); BP §10.4 handover evidence | REQUIRES_DECISION (D-132, D-111) |
| Handover form | Courier rider (text, Y — name/ID) · Pickup OTP from rider app (numeric, 6 digits — sample) · note "Rider OTP + photo of the handed-over parcels are stored as evidence. Parcels the rider doesn't scan stay in Ready to ship" · **"Sign & hand over"** | API-M12-15 (`courier`, `rider_name`, `pickup_otp?`, `scanned_parcel_refs[]`, `evidence_file_id?`; Idem) → per parcel: fulfilment `dispatched`, on-hand reduced and reservation consumed atomically, serial + inspection linked to sale | DOCUMENTED BP §9.2 "Shipment dispatched", §10.4; rider OTP MOCKUP-ONLY | REQUIRES_DECISION (D-132, D-013) |
| Lost-response callout (critical) | "Booking response lost for {order} · parcel P1. {courier} timed out at HH:MM. Before retrying, Tradex queries the carrier by client reference so a second consignment is never created" · "Check booking status" · "Book manually instead" (`m-manual`) | API-M12-12 (links existing AWB, never duplicates) | DOCUMENTED T20, BP §10.3 | REQUIRES_DECISION (D-013) |
| Serviceability checks | "n of m parcels serviceable by {service}" · PIN not served above a value (sample) → "Manual" · "n orders are customer pickups — moved to {branch} counter · pickup OTP sent" | API-M12-11 results; summary gap-17 | DOCUMENTED BP §6.5, §10.5; pickup CONDITIONAL | REQUIRES_DECISION (D-013, D-061) |

### 6.7 Tab `#dispatched` — Dispatched today

| Element | Specification | → API | Label | Status |
|---|---|---|---|---|
| Stale callout | "Tracking sync paused since HH:MM — N shipments show their last known carrier event. Canonical states won't change until sync resumes; raw events are kept as evidence." + "Sync now" | API-M12-17 (`all_stale`) | MOCKUP ("raw events preserved"); BP §10.5, §14.4 | REQUIRES_DECISION (D-013) |
| Table | **Order** · **Customer** (COD marker where applicable) · **Courier · AWB** (or "Branch runner (own delivery)", "Counter pickup · {branch}") · **Handed over** (time) · **Last raw carrier event** (code badge + text; per-row "stale · last sync HH:MM") · **Canonical state** (In transit / Delivered / Manual tracking / Dispatched) · **Promise** | API-M12-03 `stage=dispatched_today` (`last_raw_event`, `canonical_state`) | DOCUMENTED BP §10.5 "Carrier status → canonical state" | REQUIRES_DECISION (D-013; COD D-020; own delivery/pickup D-061) |
| Pager | "Showing n of N dispatched today" | API-M12-03 | MOCKUP | NOT_STARTED |
| Manual tracking | Manual bookings show "Manual tracking" so nobody mistakes them for live data | E-shipment_event `source=manual` | MOCKUP | NOT_STARTED |

### 6.8 Tab `#exceptions` — Exceptions

| Element | Specification | → API | Label | Status |
|---|---|---|---|---|
| Filter | Segmented All · Overdue dispatch · Delivery · Warehouse (with counts) | API-M12-03 `stage=exceptions`, `exception_type`; API-M17-05 | MOCKUP | NOT_STARTED |
| Note | "Escalates to the operations manager once if not resolved by the due time · owner sees only above-authority cases" | — | DOCUMENTED A16, BP §12.5 | REQUIRES_DECISION (D-138) |
| Rows | Exception row pattern §2.10 (severity, title, meta: order · product · value / AWB / age / owner → escalation / due, evidence line) | API-M17-05 | DOCUMENTED BP §12.5 | REQUIRES_DECISION (D-138) |

| Exception (MK sample) | Actions | → API | Result | Label | Status |
|---|---|---|---|---|---|
| Overdue dispatch — short pick, bin empty (count task opened, stock at another location, customer informed) | "Transfer from {location}" (primary) · "Offer cancel" (needs customer consent) | API-M12-18 (`request_transfer`) / API-M06-13 · API-M12-18 (`offer_cancel`) → API-M20-03 (consent request); refund only after consent (API-M11-09) | Transfer request / consent message | DOCUMENTED BP §9.5, §12.5 | NOT_STARTED |
| Returned to origin (RTO) after failed attempts | "Receive RTO" (→ P-E04) · "Contact customer" (template) | API-M13-10 (`source=rto`) · API-M12-18 (`contact_customer`) / API-M20-03 | RTO received into **quarantine** before stock returns to sellable; refund or reship per customer choice | DOCUMENTED BP §10.5, §9.2, T17 | REQUIRES_DECISION (D-058) |
| Damaged in transit — customer refused delivery (courier photos, claim window sample) | "Create replacement" (primary) · "Claim" | API-M10-23 (source delivery claim) · API-M12-18 (`courier_claim`) | Replacement order linked to claim; claim uses packed-box photo evidence | DOCUMENTED BP §10.5 (lost/damaged) | REQUIRES_DECISION (D-022, D-013) |
| Address issue — consignee unreachable (attempt n of m) | "Ask customer" · "Update address" (instruction to courier) | API-M12-18 (`contact_customer`, `update_address_instruction`) | Template message / courier instruction | DOCUMENTED BP §10.5 | REQUIRES_DECISION (D-058, D-013) |
| Mis-slotted unit found during pick | "Recount {bins}" | API-M06-19 (`type=recount`) | Recount task | MOCKUP; A24 | REQUIRES_DECISION (D-069) |
| Courier tracking sync paused (one job incident, not N alerts) | "View job" → P-E14 | API-M17-16 | — | DOCUMENTED A38 | NOT_STARTED |

### 6.9 Modal `m-manual` — Manual courier booking

Subtitle: "Fallback when the API is down, a PIN isn't serviceable, or the parcel is bulky" (BP §16.4).

| Field | UI control | Req | Validation (source) | API field |
|---|---|---|---|---|
| Order · parcel | Select (order · parcel · PIN · weight) | Y | Parcel packed and not booked; `409 ALREADY_BOOKED` | `parcel_ref` |
| Carrier | Select (carrier · service, incl. "Branch runner (own delivery)") | Y | Carrier list per D-013 (MK names are samples) | `carrier` |
| AWB / carrier reference | Text (mono) | Y | Format checked per carrier; duplicate AWBs rejected (MK; E-fulfilment unique tracking number) | `awb_or_reference` |
| Reason for manual booking | Select: PIN not serviceable by primary courier · Courier API unavailable · Bulky / high-value handling | Y | Reason catalogue D-139 | `reason` |
| Carrier label or booking receipt | Drop zone (PDF/photo), "Stored with the shipment as evidence" | N | Upload restrictions (BP §19.1; D-112, D-113) | `label_file_id` via API-M22-01 |

Info: "Tracking for manual bookings is updated by staff (or the carrier's email feed) — the shipment shows Manual
tracking". Buttons "Cancel" · "Save booking" → API-M12-13 (Idem). Label DOCUMENTED BP §16.4; status REQUIRES_DECISION
(D-013, D-139).

### 6.10 States, permissions, dependencies

| Aspect | Specification |
|---|---|
| L / E / X | Skeleton queues; per-tab empty states (MK: "Nothing to pick at this location", "No active wave"); scan errors are results, not failures — network/API errors keep the scanned code in the log with "not recorded" and allow rescan (idempotent scans) (BP §22.5) |
| S | Tracking-sync stale callouts on `#dispatched` and in KPI "Courier integration"; per-row stale marker (BP §14.4) |
| Failure cases | Lost booking response → status check before re-book (T20); worker crash after booking request → outbox reconciliation (T21); serial already on another active fulfilment → blocked (BP §9.4, `409 SERIAL_ALREADY_SHIPPED`) |
| Permissions | R-warehouse_staff: assigned locations and tasks (pick, pack, book, manifest, handover, pick exceptions). R-branch_manager: its branch + waves/assignments + booking. R-ops_admin: all locations. R-sales_support: delivery-exception customer contact, manual tracking sync (API-M12-17, API-M12-18). No cost/margin shown. Substitution is never a warehouse action (P-E02 with consent/approval) |
| APIs | API-M03-02, API-M06-10, API-M06-13, API-M06-19, API-M06-23 (damage/short-pick adjustments), API-M10-07, API-M10-23, API-M11-09, API-M12-03, API-M12-04, API-M12-05, API-M12-06, API-M12-07, API-M12-08, API-M12-09, API-M12-10, API-M12-11, API-M12-12, API-M12-13, API-M12-14, API-M12-15, API-M12-17, API-M12-18, API-M13-10, API-M17-05, API-M17-16, API-M19-02, API-M20-03, API-M22-01, API-M24-01, API-M24-08 |
| Backend rules | BR-M12-01…15, BR-M06-03, BR-M06-07, BR-M06-08, BR-M06-16, BR-M10-15, BR-M13-03, BR-M17-11, BR-M17-12 |
| Entities | E-fulfilment, E-fulfilment_line, E-shipment_event, E-reservation, E-serial_unit, E-serial_event, E-inspection, E-stock_movement, E-stock_count, E-exception_case, E-invoice_reference, E-attachment, E-pick_wave and E-handover_manifest (§7.1, MOCKUP-ONLY D-132) |
| Related pages | P-E02, P-E04 (RTO receipt), P-E08 (counts, transfers), P-E14 (jobs), P-S08 (tracking) |
| CONDITIONAL / MOCKUP-ONLY | Pick waves, manifests, rider OTP — MOCKUP-ONLY (D-132); bench/scale/camera/printer integration — D-147; customer pickup — CONDITIONAL (D-061); COD — CONDITIONAL (D-020); partial dispatch/split — D-029; courier booking automation A13 P1/C (D-013) |
| Tests | T17, T20, T21; BP §30.2 "As warehouse staff, I dispatch the correct serial" |

---

## 7. P-E04 — Returns, RMA & warranty (`erp-returns.html`)

### 7.0 Summary

| Field | Value |
|---|---|
| Purpose | RMA queue by state and type, per-RMA case with original order/unit, serial match, customer evidence, inspection in quarantine, data erasure, two **separate** decisions (refund authorisation by finance; stock disposition by operations), warranty claim tracking, supplier RMAs, refunds pending and the quarantine list |
| Evidence | DOCUMENTED (BP §30.1 Returns "RMA queue, receipt/inspection, refund approval, warranty case"; §10.1 RMA states; §10.5; §7.5; A22, A23; PR2 §6 Return/refund; §5.2 "Basic returns, refund and warranty traceability" M 1A) + MOCKUP; suspicious-return flag rule A37 is P2 (LATER) |
| Route | NOT SPECIFIED · MK:erp-returns.html#rma, #refunds, #warranty, #supplier, #quarantine; drawer `d-rma` tabs `rd-case`, `rd-insp`, `rd-dec`, `rd-wty`, `rd-time`; `?rma=…&tab=…` |
| Phase / IDs | 1A (basic returns, warranty traceability); advanced RMA 2/3 (BP §5.2); A37 flag LATER · R19 · WP11 · T17, T18, T19, T33, T34 |
| Primary modules | M13 (+ M06 serial units/inspection/erasure/quarantine, M11 refunds, M12 reverse pickups/labels, M20 notifications) |
| D-004 native-vs-custom considerations | BP §30.1 lists RMA queue, receipt/inspection, refund approval, warranty case. BP §10.5 requires two independent decisions (refund vs resale). BP §5.3: "a warranty ticket can be tracked without building a full repair workshop management system"; BP §14.1 Returns/warranty minimum scope "RMA, quarantine, refund link, warranty evidence". ERPNext serial traceability (BP §9.4, S05) is a reuse candidate. Frequency: per return (BP §4 "condition-related returns" monthly). Mockup: custom |
| Status | REQUIRES_DECISION (D-004, D-101); return/warranty policies REQUIRES_DECISION (D-022) |

### 7.1 Page head and KPI strip

| Element | Specification | → API | Label | Status |
|---|---|---|---|---|
| Title / subtitle | "Sell & serve › Returns & warranty" · "Returns, RMA & warranty" · active policy versions (returns policy, warranty policy — windows are samples) and quarantine zone | API-M24-01 / policy refs (API-M04-22) | MOCKUP | REQUIRES_DECISION (D-022) |
| "Export" | RMA list export | API-M18-03 (`rma_list`) | DOCUMENTED BP §14.4 | REQUIRES_DECISION (D-152) |
| "Receive return" | Scan parcel label or RMA number to receive into quarantine — form not drawn in MK: scan input (RMA no./parcel label/AWB), location, per unit serial + condition note, optional photos | API-M13-10 (Idem; `source=rma`) | DOCUMENTED BP §9.2, §10.5, T17 | NOT_STARTED |
| "New RMA" (primary) | Staff-created RMA — "link it to an order and serial first"; form not drawn in MK: fields of API-M13-03 (order or store invoice, lines, type, reason, description, serial + verification, evidence, return method, refund destination, policy acknowledgement) with eligibility check first | API-M13-01, API-M13-02, API-M13-03 (Idem) | DOCUMENTED BP §17.4 "Request return" | REQUIRES_DECISION (D-022) |
| KPI tiles | Open RMAs (n need a decision today) · In quarantine (n awaiting inspection) · Refunds pending (n failed · total) · Avg. resolution (delta, target — sample) · Warranty claims (n with manufacturers) · Return rate (30 d; refurbished vs new) | gap-5 (or API-M18-02 report "returns & warranty") | MOCKUP; BP §4 (condition-related returns), §14.3 | REQUIRES_DECISION (D-173) |

### 7.2 Tab `#rma` — RMA queue

| Element | Specification | → API | Label | Status |
|---|---|---|---|---|
| State pipeline | Clickable stage counts: Requested · Reviewed · Authorised · In transit · Received · Inspected · Resolved (last 7 d) · Rejected (last 7 d); click filters the table (toggle) | API-M13-04 `state`; counts gap-2 | DOCUMENTED BP §10.1 RMA states | NOT_STARTED |
| Search | "RMA, order, serial, customer…" | API-M13-04 `q` | MOCKUP | NOT_STARTED |
| Type chips | All types · Return · Replacement · Warranty · DOA | API-M13-04 `type` | MOCKUP; BP §6.3 Returns | REQUIRES_DECISION (D-022) |
| Switch | "Review flags only" | API-M13-04 `review_flag_only` | MOCKUP; flag rule A37 LATER | LATER (A37) |
| Bulk bar | "Assign…" (API-M13-08; picker gap-7) · "Book reverse pickup" (API-M13-09, authorised RMAs only) · "Export" (API-M18-03); note "Bulk actions never approve refunds — each refund is decided individually" | as listed | DOCUMENTED BP §18.2; MOCKUP | REQUIRES_DECISION (D-013 reverse pickup) |
| Table columns | ☐ · **RMA** (number; "Review flag" pill or opened date) · **Product · unit** (thumb, title, condition short, unit ID) · **Order · customer** (order number, customer — masked per D-153) · **Type** badge · **State** pill · **Serial match** (Match / Mismatch / Pending / Not serialised) · **Policy** (policy name + version/window at sale) · **Age · owner · SLA** (age, owner, due text coloured) | API-M13-04 | DOCUMENTED BP §10.5 (original order, item, serial, policy version), A22 (routing) | REQUIRES_DECISION (D-022) |
| Row click | Opens `d-rma` on `rd-case` | API-M13-05 | MOCKUP | NOT_STARTED |
| Pager | "Showing n of N open · resolved/rejected shown for the last 7 days" (period sample) | API-M13-04 `status_group` | MOCKUP | NOT_STARTED |
| Empty | "No RMAs in this view — Nothing matches the selected state, type or flag filter" | — | MOCKUP | NOT_STARTED |

### 7.3 Tab `#refunds` — Refunds pending

| Element | Specification | → API | Label | Status |
|---|---|---|---|---|
| Rule callout | "Refund state machine: requested → approved → submitted → pending at provider → completed / failed. Support can request; finance approves and executes. A repeated approve returns the existing refund (idempotency key = refund id); a timed-out refund is queried at the provider before any retry" | — | DOCUMENTED BP §10.1, §10.3, §18.1, T18, T19 | NOT_STARTED |
| Table | **Refund** · **Source** (RMA / order line cancel) · **Customer** · **Amount** · **Method** (original UPI/card via provider; NEFT to dealer's verified bank account) · **Refund state** · **Provider ref** · **Age** · **Owner** · action ("Approve" for requested; "Check at provider" for failed) | API-M11-08 (`source=rma`/cancellation); "Approve" → API-M11-10 (`approve`, Idem); "Check at provider" → API-M11-11 | DOCUMENTED BP §10.3, T18, T19 | REQUIRES_DECISION (D-024, D-012) |
| Duplicate-prevented callout | Example of a second approve returning the existing refund | — | MOCKUP (T18) | NOT_STARTED |

Execution/"Check & release"/retry routes live in P-E12 (part 2); this tab is the returns-side view of the same refund
queue (06-api API-M11-08 consumers P-E12#refunds, P-E04#refunds).

### 7.4 Tab `#warranty` — Warranty claims

| Element | Specification | → API | Label | Status |
|---|---|---|---|---|
| Rule callout | "Eligibility is matched automatically from invoice date + serial + policy version. The system never promises that a manufacturer will accept a claim — customers see 'claim logged with {brand}', not 'approved'" | — | DOCUMENTED A23; BR-M13-07 | NOT_STARTED |
| Table | **Claim** · **Product · serial** (masked where required) · **Warranty provider** (manufacturer badge vs company warranty) · **Coverage check** (in warranty to {date} / expired / "serial not on invoice — check") · **Where** (service centre / in-house bench / in transit) · **External ref** · **Status · customer update** | API-M13-12 | DOCUMENTED BP §7.5, §14.1, A23; BP §6.6 (do not imply manufacturer warranty when the seller provides it) | REQUIRES_DECISION (D-022) |
| Row detail | Opens the related RMA drawer on `rd-wty` (MK has no separate claim drawer) | API-M13-05, API-M13-13 | MOCKUP | NOT_STARTED |

### 7.5 Tab `#supplier` — Supplier RMAs

| Element | Specification | → API | Label | Status |
|---|---|---|---|---|
| Card | "Returns to vendors · Units go back under the supplier's own warranty or DOA terms · vendors see only their own RMAs in the vendor portal"; "Supplier RMA" (create draft) | API-M13-14; create API-M13-15 | DOCUMENTED BP §11.2 Returns | NOT_STARTED |
| Table | **Supplier RMA** · **Vendor** (name, code) · **Units** (qty × product · unit ID) · **Reason** · **Supplier terms** (warranty window from GRN date / DOA replacement window — samples) · **State** (Draft, Shipped to vendor, Credit note received …) · **Expected credit** (amount or "Replacement"; credit note ref) · **Linked** (RMA / GRN) | API-M13-14 | DOCUMENTED BP §11.2; states REQUIRES_DECISION (D-139, D-150) | REQUIRES_DECISION (D-139) |
| Create form (not drawn in MK) | Vendor (Y), units (Y, in quarantine/repair), reason (Y), evidence files, expected resolution | API-M13-15 | DOCUMENTED | NOT_STARTED |

### 7.6 Tab `#quarantine` — Quarantine

| Element | Specification | → API | Label | Status |
|---|---|---|---|---|
| Rule callout | "Returned and RTO units enter quarantine — they are not available to sell on the website or at branches until an inspector records a disposition. Storage devices need a data-erasure certificate before they leave quarantine" | — | DOCUMENTED BP §9.2, §7.5, T17 | NOT_STARTED |
| Table | **Unit** · **Product** · **Source** (RMA · customer return / RTO · order / inbound QC · GRN) · **Location** (quarantine zone/bin) · **Days** · **Data erasure** (Required · not started / Running · % / Certified {id} / Failed · retry / Not a storage device / n/a) · **Next step** | API-M06-05 (`disposition=quarantine`, `source`) | DOCUMENTED BP §9.2, §7.5 | NOT_STARTED |
| Pager | "Showing n of N units · n more from GRN inbound QC" | API-M06-05 | MOCKUP | NOT_STARTED |

### 7.7 Drawer `d-rma` — RMA detail

**Head.** Meta "Opened {time} · {channel} · {customer} · order {no.}"; RMA number; type badge + state pill; review-flag
pill (A37 — LATER); state stepper (Requested → Reviewed → Authorised → In transit → Received → Inspected → Resolved;
rejected path Requested → Reviewed → Rejected). → API-M13-05.

#### 7.7.1 Tab `rd-case` — Case & unit

| Section | Content | Actions | → API | Label | Status |
|---|---|---|---|---|---|
| Review-flag callout (when flagged) | "Review flag raised by rule A37 — this is a prompt for review, not an accusation", reasons (serial received ≠ sold; repeated returns), possible innocent causes, "must not be rejected automatically; a manager records the decision and reason" | "Check our dispatch scan" · "Ask customer for photos" · "Escalate to manager" · "Clear flag (reason)" | API-M12-04 (dispatch scan log) · API-M13-07 (`request_evidence` + template, `escalate`, `clear_flag` + reason) | A37 rule LATER (P2); human-decision principle DOCUMENTED (BR-M13-12) | LATER (flag rule); actions NOT_STARTED |
| Original order & unit | Product (thumb, title, condition, unit chip); Order (link P-E02) · delivered date; Paid for this line (+ allocated coupon share); Warranty at sale; Policy at sale (+ "day n of m" in window); Reason given | — | API-M13-05, API-M10-07 | DOCUMENTED BP §10.5, T33 | REQUIRES_DECISION (D-022) |
| Unit history | Timeline: received on GRN (supplier, supplier warranty) → inspected/graded (inspection id, battery, photos) → sold (order, price snapshot kept) → dispatched & delivered (serial scanned at pack) → RMA current state | — | API-M06-07 (lifecycle) | DOCUMENTED BP §9.4, §7.2 | NOT_STARTED |
| Serial match check | Three values: Sold (invoice) · Declared by customer · Received scan; result line (all match / mismatch "review before any refund" / pending / not serialised "SKU and batch checked instead") | — | API-M13-05 `serial_match` | DOCUMENTED BP §7.5, T17 | REQUIRES_DECISION (D-126 batch) |
| Customer photos & description | Photos/video thumbnails, quoted customer description with name/date; note "Photos are kept for the dispute window only — no unnecessary personal data is collected" | — | API-M13-05 `photos[]`, API-M22-02 | DOCUMENTED BP §10.5 (evidence without unnecessary personal data) | REQUIRES_DECISION (D-036) |

#### 7.7.2 Tab `rd-insp` — Inspection

| Section | Content | → API | Label | Status |
|---|---|---|---|---|
| Not received | Empty state "Unit not received yet — Inspection opens when the parcel is scanned into quarantine" (+ reverse pickup AWB in transit) | API-M13-05 | DOCUMENTED BP §10.5 | NOT_STARTED |
| Quarantine line | Zone/bin · received time · "not sellable" · badge "In quarantine" | API-M13-05 | DOCUMENTED T17 | NOT_STARTED |
| Inspection form | Checklist rows (item · result · evidence): Serial/BIOS matches return · Accessories returned · Powers on / boots / ports · Reported fault reproduced (or specific check, e.g. battery health vs listing) · Cosmetic vs grade at sale · Customer-induced damage; inspector + time | API-M06-09 (`context=return`, `checklist_version`, `results[]`, Idem) | DOCUMENTED BP §10.5, §6.6 | REQUIRES_DECISION (D-023) |
| Inspection photos | Thumbnails + "Add" (bench camera) | API-M22-01 → API-M06-09 `photo_file_ids[]` | MOCKUP | REQUIRES_DECISION (D-147) |
| Grade outcome | Select (Y): {outcome text} · Grade A — resell as sold · Grade B — light wear · Needs repair · Unsellable / parts | API-M06-09 `grade_outcome` | DOCUMENTED BP §6.6 (rubric) | REQUIRES_DECISION (D-023) |
| Inspector notes | Text | API-M06-09 `defects[]`/notes | MOCKUP | NOT_STARTED |
| Data-erasure step (storage devices) | "Certified erasure required before this unit leaves quarantine (resale, repair or return to supplier)"; method/station/certificate line; state pill; "Start erasure"; warning "Customer data is never inspected or copied — the drive is erased, not browsed" | API-M06-10 (`start_on_station_id` or certificate upload) | DOCUMENTED BP §7.5, §7.2 (erasure evidence) | REQUIRES_DECISION (D-147) |

#### 7.7.3 Tab `rd-dec` — Decisions (two separate decisions)

| Section | Content | Actions | → API | Label | Status |
|---|---|---|---|---|---|
| Rejected callout | Who, when, reason with policy clause, "No refund and no stock movement", alternative route offered (warranty), "decision and message are in the audit log" | — | API-M13-05 | DOCUMENTED BP §10.1 rejected | REQUIRES_DECISION (D-022) |
| Principle callout | "Two separate decisions. Whether the customer gets money back (finance) and what happens to the unit (operations) are decided independently — a refund never makes the unit sellable" | — | — | DOCUMENTED BP §10.5; BR-M13-04 | NOT_STARTED |
| **1 · Refund authorisation** (Finance) | State pill (Not ready / Awaiting finance / Failed · n retries / Completed / Not applicable); calculation: line price paid · allocated order discount · restocking fee (dealer policy — sample) · deductions for damage · **Refund amount**; route note (original method; dealer bank transfer) "uses the original allocated price, not today's price (T33)"; for warranty/replacement/DOA types the text explains no refund / replacement first; provider-timeout callout ("queries refund … before any retry (T19)"); flag callout ("Refund is on hold until the review flag is cleared"); refund state stepper; authority note ("Support may request · finance approves & executes · above the finance limit the owner approves (thresholds set by the client)") | "Hold" · "Approve refund (finance)" (enabled only after inspection, for return type, no open flag) | API-M13-11 (`decision_type=refund`, `refund{action: approve|hold, lines[{line_id, amount}], reason}`) → M11 (API-M11-10) | DOCUMENTED BP §10.5, §8.4, §18.1, T18, T19 | REQUIRES_DECISION (D-024, D-022, D-082) |
| **2 · Stock disposition** (Operations) | State (After inspection / Decision needed); radio options: Resell as Grade A (back to sellable with new inspection report) · Resell as Grade B (regrade; new photos & price before listing) · Repair · Return to supplier (within supplier warranty → supplier RMA draft) · Scrap / parts (write-off above threshold needs approval); "Stock effect: unit stays in quarantine until this decision is approved (and erasure is certified)" | "Record disposition" | API-M13-11 (`decision_type=disposition`, `disposition{outcome, grade_inspection_ref?, reason}`); replacement → API-M10-23 | DOCUMENTED BP §10.5, §9.2 ("Return approved for resale"), §7.5 | REQUIRES_DECISION (D-023, D-024) |

#### 7.7.4 Tab `rd-wty` — Warranty & supplier

| Section | Content | Actions | → API | Label | Status |
|---|---|---|---|---|---|
| Warranty claim tracking | Two panels: **Manufacturer warranty** (provider badge; claim ref · service centre · pickup booked · typical turnaround — sample) vs **Company warranty** (policy + duration; in-house bench repair or replacement; SLA — sample); timeline for warranty type: eligibility matched automatically → awaiting pickup/in transit ("Customer told: 'claim logged' — not 'approved'") → diagnosis & provider decision | Update tracking fields (where, external ref, status, note) | API-M13-12, API-M13-13 (`expected_version`) | DOCUMENTED A23, BP §6.6, §7.5, §5.3 | REQUIRES_DECISION (D-022) |
| Supplier RMA | Linked supplier RMA (id · vendor · state · supplier warranty window from GRN · expected credit or replacement · "vendor sees only this RMA") or "No supplier RMA. One is created only if the disposition is 'Return to supplier'" | "Send to vendor" | API-M13-16 (`send`) | DOCUMENTED BP §11.2 (share only needed data) | NOT_STARTED |

#### 7.7.5 Tab `rd-time` — Timeline

Timeline of RMA events (requested with channel and evidence; rule A22 routing with window check; reviewed & authorised
with reverse pickup; picked up/in transit with AWB; received into quarantine with serial scan; inspected; awaiting
decisions with owners and due) and an Audit note "Every decision records actor, time, policy version, evidence and
reason. Customer messages use approved templates". → API-M13-05 (`states_timeline`, `audit[]`), API-M20-04 (message
delivery). DOCUMENTED BP §17.3, A22. NOT_STARTED.

#### 7.7.6 Drawer foot

| Action | → API | Result | Label | Status |
|---|---|---|---|---|
| Update customer | API-M20-03 (RMA update template) | Templated message, consent checked | DOCUMENTED A14 | REQUIRES_DECISION (D-058) |
| Reverse pickup | API-M13-09 (authorised RMA) | Booking with courier (reverse fulfilment) | MOCKUP; BP §10.5 | REQUIRES_DECISION (D-013) |
| Reject… (danger) | Reason (Y) + policy clause (Y) form → API-M13-07 (`reject`, `reason`, `policy_clause`, `expected_version`) | RMA `rejected`, customer message | DOCUMENTED BP §10.1, §10.5 | REQUIRES_DECISION (D-022, D-139) |
| RMA label | API-M12-10 (`doc_type=rma_label`) | Printable label | MOCKUP | REQUIRES_DECISION (D-111) |
| Go to decisions → | Switches to `rd-dec` | — | MOCKUP | NOT_STARTED |

Review/authorise transitions (Requested → Reviewed → Authorised) use API-M13-07 (`review`, `authorise`); MK shows them
only in the timeline — the drawer needs "Review" / "Authorise" actions where the RMA is in `requested`/`reviewed`
(BR-M13-06; D-150 whether rule-eligible RMAs may skip review).

### 7.8 States, permissions, dependencies

| Aspect | Specification |
|---|---|
| L / E / X | Skeleton table and drawer; empty states above; inspection empty "Unit not received yet"; per-action inline errors (`409 STATE_TRANSITION_INVALID`, `403 AUTHORITY_EXCEEDED`, `403 SELF_APPROVAL_NOT_ALLOWED`, `422 AMOUNT_EXCEEDS_REFUNDABLE`, `202 PROVIDER_PENDING`) |
| Documented failure states | Outside policy · serial mismatch · warranty route (BP §6.3 Returns); refund timeout → pending + status query before retry (T19); duplicate refund command → existing refund (T18) |
| Permissions | R-sales_support: create/review RMAs, request evidence, escalate, update customer, book reverse pickup, request refunds (no approval). R-warehouse_staff (loc): receive returns, inspect, erasure, record disposition within authority (06-api: disposition → warehouse lead/branch manager). R-branch_manager: authorise beyond policy, disposition, assignments, write-offs within threshold. R-finance: refund decisions/execution. R-ops_admin: all, supplier RMAs. R-owner: overrides with audit. Customer identity/contact masked (D-153); photos kept for dispute window (D-036) |
| APIs | API-M06-05, API-M06-07, API-M06-09, API-M06-10, API-M10-07, API-M10-23, API-M11-08, API-M11-10, API-M11-11, API-M12-04, API-M12-10, API-M13-01, API-M13-02, API-M13-03, API-M13-04, API-M13-05, API-M13-07, API-M13-08, API-M13-09, API-M13-10, API-M13-11, API-M13-12, API-M13-13, API-M13-14, API-M13-15, API-M13-16, API-M18-03, API-M20-03, API-M20-04, API-M22-01, API-M22-02, API-M24-01 |
| Backend rules | BR-M13-01…16, BR-M06-16, BR-M06-21, BR-M06-22, BR-M11-07, BR-M11-08, BR-M11-09, BR-M11-16, BR-M05-13 |
| Entities | E-return_request, E-return_line, E-warranty_case, E-supplier_rma, E-serial_unit, E-serial_event, E-inspection, E-stock_movement, E-refund, E-attachment, E-notification, E-return_policy, E-warranty_policy, E-fulfilment (reverse), E-audit_event |
| Related pages | P-E02 (order), P-E03 (RTO), P-E05 (start return from chat), P-E08 (unit lifecycle), P-E12 (refund execution), P-E10 (customer), P-S10/P-S09 (customer side) |
| CONDITIONAL / MOCKUP-ONLY / LATER | A37 review flag and "Review flags only" filter — LATER (P2); restocking fee for dealers — sample (D-022); bench camera/erasure station — D-147; COD refund to bank account — CONDITIONAL (D-020) |
| Tests | T17, T18, T19, T33, T34 |

---

## 8. P-E05 — Support & WhatsApp inbox (`erp-support.html`)

### 8.0 Summary

| Field | Value |
|---|---|
| Purpose | Shared inbox for WhatsApp, website chat and email with ownership, priority, SLA, bot→human handoff with context, verified order lookup before any disclosure, consent/service-window-aware replies (approved templates outside the window), pause automation per conversation, draft baskets and secure checkout links, escalation tickets, and the approved-answer library and message templates |
| Evidence | DOCUMENTED (BP §30.1 Support "Conversation/ticket list, verified order lookup, handoff, approved answers"; §13.1–13.5; A08, A15; T23, T24, T25; PR1 §4 Customer Management "communication history") + MOCKUP |
| Route | NOT SPECIFIED · MK:erp-support.html#inbox, #tickets, #library; modals `m-basket`, `m-ticket`; `?conv=` |
| Phase / IDs | 1A: website guided help + human handoff, click-to-chat (Level 1), secure assisted orders; 1B: guided WhatsApp ordering (Level 2, A08), verified "where is my order" (A15); Level 3 AI LATER (Phase 3, R13) · R11 · WP14 · T23, T24, T25 |
| Primary modules | M16 (+ M10 assisted orders, M05 quotes, M20 notifications/templates, M13 returns) |
| D-004 native-vs-custom considerations | BP §13.3 lists "shared inbox ownership" as implementation work and BP §13.5 budgets "inbox seats", i.e. a provider inbox is one possibility; the provider/Cloud API is open (D-014). Verification-before-disclosure, template-only outside the 24-hour window and pause-automation are required regardless of UI (BP §13.3–13.4). Frequency: every customer conversation (BP §4 "Staff touch time"). Mockup: custom three-pane inbox integrated with orders |
| Status | REQUIRES_DECISION (D-004, D-101); provider REQUIRES_DECISION (D-014); live updates D-146 |

### 8.1 Page head and KPI strip

| Element | Specification | → API | Label | Status |
|---|---|---|---|---|
| Title / subtitle | "Sell & serve › Support inbox" · "Support & WhatsApp inbox" · "Shared inbox for WhatsApp Business, website chat and email · service hours {hours} · guided bot answers approved FAQs and hands off to people — no AI in Phase 1" (hours sample) | API-M24-01 (support hours) | DOCUMENTED BP §13.1, §13.4 | REQUIRES_DECISION (D-074) |
| Availability menu | Own status: Available · Busy · no new chats · Away (MK 3 states; API defines available/away — gap-16) | API-M16-19 | MOCKUP | REQUIRES_DECISION (D-074) |
| "New ticket" | Opens `m-ticket` without a conversation | API-M16-11 | DOCUMENTED BP §13.4 | NOT_STARTED |
| "Draft basket" | Opens `m-basket` for the selected (verified) conversation | API-M10-18 | DOCUMENTED BP §13.2; A08 1B | REQUIRES_DECISION (D-048 for 1B scope) |
| KPI tiles | Open chats (by channel) · Waiting on us (oldest) · First response (delta, sparkline) · Bot-resolved (%) · SLA breaches · Chat → orders (count, value via checkout links) | gap-5 | MOCKUP | REQUIRES_DECISION (D-173, D-074) |

### 8.2 Tab `#inbox` — three-pane shared inbox

**List pane.**

| Element | Specification | → API | Label | Status |
|---|---|---|---|---|
| Channel filter | Segmented All · WhatsApp · Web chat · Email | API-M16-04 `channel` | DOCUMENTED BP §13.3 | NOT_STARTED |
| Status filter | Open · all (n) · Assigned to me · Unassigned · Bot handling · Waiting on customer · Closed today | API-M16-04 `status` | MOCKUP | NOT_STARTED |
| Sort | Icon button (order not specified in MK) | API-M16-04 `sort` | MOCKUP | NOT_STARTED |
| Conversation item | Avatar with channel icon; name (masked number or "Unknown contact" until verified; organisation); verified ✓ / not-verified 🔒 icon; last time; preview; status pill (Open, Waiting on customer, Waiting for agent, Bot handling, Escalated · ticket, Escalated · safety); priority badge; "Template only" badge when the WhatsApp window is closed; unread count; assignee · SLA text ("Reply in n min", "Accept in n min", "Breached n") | API-M16-04 items | DOCUMENTED BP §13.4 (owner, priority, handoff status), §13.3 (window) | REQUIRES_DECISION (D-074 SLA values) |
| Empty | "Inbox zero — No conversations for this filter" | — | MOCKUP | NOT_STARTED |
| Live update | New messages/conversations appear per D-146 | API-M16-04, API-M16-06 | — | REQUIRES_DECISION (D-146) |

**Thread pane.**

| Element | Specification | → API | Label | Status |
|---|---|---|---|---|
| Header | Avatar/channel, name + organisation, channel · reference · masked phone; **Assign** menu ("Assign to": me, operations, finance, catalog … — gap-7); "Escalate" (→ `m-ticket`); "Close conversation" icon ("customer can reopen by replying") | API-M16-05; assign/close → API-M16-08 (`assign`, `close`) | DOCUMENTED BP §13.4 | NOT_STARTED |
| Sub-bar | Switch **"Pause automation in this conversation"** (+ state text "Bot & automatic updates are silent here until resumed"); priority badge | API-M16-08 (`pause_automation` / `resume_automation`) → system line "Automation paused by {agent}" | DOCUMENTED BP §13.4 | NOT_STARTED |
| Messages | Types: system lines (source e.g. "started from product page (click-to-chat) · product reference — a reference, not a trusted price"; verification events; checkout/payment events; window closed notice), customer, bot (with quick-reply chips), agent (with read receipts), **handoff marker** ("Handed off to human · {agent/queue} · reason …"), automation pause/resume lines, draft-basket card (basket id, items, rule, total, "Converted · {order}", secure link with expiry); "Latest messages" jump button | API-M16-06 (`after_message_id`) | DOCUMENTED BP §13.1–13.4, T24 | REQUIRES_DECISION (D-146) |
| Window bar | WhatsApp service window open (closes in …) / closed (closed at …) / Email (sending address, signature version — samples) / Web chat (customer online / offline — reply is emailed) | API-M16-05 `window` | DOCUMENTED BP §13.3 (24-hour window) | REQUIRES_DECISION (D-014) |
| Window-closed callout | "Free-text reply not allowed. The 24-hour customer service window has closed — send an approved template (utility). Marketing templates are blocked: {customer} opted out on {date}" | API-M16-05 (`window`, `consent`) | DOCUMENTED BP §13.3, T25 | NOT_STARTED |
| Composer | Textarea (disabled when window closed; placeholder "Choose an approved template to continue…" / "Reply — don't share order details: identity not verified" / "Type a reply · / for quick answers"); Enter sends, Shift+Enter newline | API-M16-07 (`text` or `approved_answer_id` or `template{id, params}`) | DOCUMENTED BP §13.3–13.4 | REQUIRES_DECISION (D-014) |
| Templates menu | "Approved WhatsApp templates" (name · version · category + purpose; marketing template **disabled** when consent missing) and "Quick answers (approved FAQ)" (title · version · answer id); choosing inserts content/params | API-M16-17 (templates), API-M16-14 (approved answers) | DOCUMENTED BP §13.3, §13.4 | NOT_STARTED |
| Attach | Paperclip (disabled when window closed) | API-M22-01 → API-M16-07 `attachments` | MOCKUP; BP §19.1 (scan risky attachments) | REQUIRES_DECISION (D-112, D-033) |
| "Order status" insert | Inserts verified order status; blocked with message when identity not verified ("Blocked — verify identity before sharing order details") | API-M16-05 `linked_orders` (verified only) | DOCUMENTED BP §13.4, T23, A15 | NOT_STARTED |
| Send / Send template | Primary (WhatsApp styling for WA); validation "Type a message first" / "Choose an approved template first"; result "Template sent · window re-opens when the customer replies" | API-M16-07; errors `409 WINDOW_CLOSED_TEMPLATE_REQUIRED`, `403 CONSENT_MISSING` | DOCUMENTED BP §13.3 | REQUIRES_DECISION (D-014) |

**Side pane.**

| Section | Content | Actions | → API | Label | Status |
|---|---|---|---|---|---|
| Contact | Avatar, name (or "Unknown contact"), organisation / "No account linked" / "Website visitor" / "Consumer"; badges (dealer list, channel) | — | API-M16-05 | MOCKUP | NOT_STARTED |
| Identity | **Verified by OTP** (time; "Valid for this conversation (24 h)" — duration sample; account link) / **Not verified** ("OTP sent to the phone on the order — not entered. Don't reveal address, invoice, serials or payment details") / **Guest** ("Ask them to sign in or verify by OTP before discussing an order") | "Resend OTP" · "Call-back to registered no." | API-M16-09 (`send_otp`, `verify_otp`, `callback_registered_number`); link identity API-M16-08 (`link_identity` with verification evidence) | DOCUMENTED BP §13.4, T23 | REQUIRES_DECISION (D-040, D-015) |
| Linked orders | Verified: mini cards (order link to P-E02, date · value, three state pills Order/Payment/Fulfilment); not verified: hidden block "Order details hidden until verified" (+ "1 order matches the reference given"); "All →" | — | API-M16-05 `linked_orders[]` | DOCUMENTED BP §13.4, §10.1 | NOT_STARTED |
| Consent | Rows: Service replies (in window) · Order & return updates · Marketing — each Allowed / Opted in {date} / Opted out {date} / Unknown / No consent; note "Saving our number is not marketing consent. Opt-outs stop reminders and promotions immediately (rule A28)" | "Record opt-out" | API-M16-05 `consent`; API-M16-08 (`record_opt_out`, purpose) | DOCUMENTED BP §13.3, T25; A28 P1/C | REQUIRES_DECISION (D-058, D-036) |
| Actions | "Create draft basket" (enabled only when verified) → `m-basket`; "Send secure checkout link" (enabled only when verified and window open); "Escalate to ticket" → `m-ticket`; "Start return / warranty" → P-E04 (RMA creation via API-M13-03); tag "1B · Guided WhatsApp ordering (R11) · Phase 1A offers assisted orders + click-to-chat" | as listed | API-M10-18, API-M10-20, API-M16-11, API-M13-03 | DOCUMENTED BP §13.1–13.2; MOCKUP | REQUIRES_DECISION (D-151, D-014, D-048) |

### 8.3 Tab `#tickets` — Tickets

| Element | Specification | → API | Label | Status |
|---|---|---|---|---|
| Filters | Segmented Open · Mine · Breached · Resolved (counts); Category select (All · Payment dispute · Warranty ambiguity · Missing / late order · Unsafe product · Compatibility); note "SLA by priority: Critical · High · Normal · Low (business hours, example targets)" | API-M16-12 (`status`, `category`) | DOCUMENTED BP §13.4 escalation categories; SLA values D-074 | REQUIRES_DECISION (D-074) |
| Table | **Ticket** (reference) · **Subject · customer** (channel icon) · **Category** · **Priority** badge · **Status** (New, Open, In progress, Waiting on customer, Resolved) · **Assignee** · **SLA** (text + meter: due / breached / paused / met) · **Linked** (order → P-E02, RMA → P-E04, SKU) | API-M16-12 | DOCUMENTED BP §13.4 | REQUIRES_DECISION (D-074, D-139) |
| Row actions | Status, assignee, priority, resolution — MK has no ticket detail view; editing via API-M16-13 with `expected_version`, resolution note required on close | API-M16-13 | DOCUMENTED BP §13.4 | NOT_STARTED |
| Pager note | "escalations from chat keep the full transcript" | — | DOCUMENTED T24 | NOT_STARTED |

MK ticket rows also use categories Billing, Returns, Pricing, General that are neither in the MK filter list nor in
E-support_ticket `category` — category catalogue is D-074/D-139 (reported in §14 gap-16 note).

### 8.4 Tab `#library` — Answer library & templates

| Element | Specification | → API | Label | Status |
|---|---|---|---|---|
| Approved answers (FAQ) | Sub "Used by the guided bot, agents' quick replies and the help centre · every change is a new version that needs approval"; "New answer"; table **Answer** (title, id) · **Version** · **Status** (Approved / In review / Draft / Retired) · **Used by** (bot · agents · help centre / "— (not live)" / "Replaced by …") · **Owner** · **Uses 30 d** | API-M16-14; create API-M16-16 | DOCUMENTED BP §13.4 ("FAQ answers use versioned approved content") | NOT_STARTED |
| WhatsApp message templates | Sub "Required for business-initiated messages and for any reply after the 24-hour service window · approved by Meta via the provider"; "Submit template"; table **Template** · **Category** (Utility / Authentication / Marketing) · **Version** · **Status · last sent** (Approved / In review / Rejected + reason) · **Rule / consent** (e.g. "opted-in only · stops on payment/dispute/opt-out · max n"); footer note that debt-collection messages are a restricted use and no such template is configured | API-M16-17; submit API-M16-18 (fields: name, channel, category, body, variables[], consent_rule) | DOCUMENTED BP §13.3, §13.5; A28 | REQUIRES_DECISION (D-014, D-058) |
| Answer detail card | Title · "Answer {id} · v{n} approved by {name} · {date} · linked to {policy} v{x}"; badge Live; answer text; Channels; Bot triggers ("menu {path} · keywords are not interpreted by AI"); pending-draft callout ("v{n+1} draft pending review … Bot keeps using v{n} until approved"); diff v(live) vs v(draft); "Version history"; "Approve v{n+1}" | API-M16-15 (versions); approve via API-M17-03 (answer's approval request) | DOCUMENTED BP §13.4; linked policy BP §27.2 | NOT_STARTED |
| Guided bot menu | Badge "Deterministic · no LLM"; options with descriptions and share of use: Track my order (OTP to order phone → permitted status only) · Buy / get a quote (pick item & qty → draft basket → agent confirms variant) · Returns & warranty (approved answers → RMA form) · Talk to a person (always available · handoff with transcript); footer "Free-text AI answers are a Phase 3 option (R13)" | API-M16-02 (menu); usage shares gap-5 | DOCUMENTED BP §13.1 (guided FAQ without an LLM), T24; AI LATER | NOT_STARTED (AI: LATER) |

### 8.5 Modal `m-basket` — Create draft basket

Subtitle: "Draft lives in the main order system · prices from the pricing engine · customer confirms on a secure
checkout page" (BP §13.2, §29.5).

| Element | Specification | → API | Label | Status |
|---|---|---|---|---|
| Source callout | "Pre-filled from conversation {ref}: '{customer text}'. The item and condition were confirmed by the agent — the system never infers an order from unconfirmed text" | API-M10-18 (`source=whatsapp_basket`, `conversation_id`) | DOCUMENTED BP §13.2 | NOT_STARTED |
| Lines | Table Item (thumb, title, condition, SKU) · Qty · Unit (ex-GST) · Rule (list version · tier) · Total; footer "Payable incl. GST" | API-M05-01 (quote), API-M10-18/-19 | DOCUMENTED BP §8.1, §13.2 | REQUIRES_DECISION (D-016) |
| Send link via | Select: WhatsApp · approved template (name/version sample) · SMS · Email | API-M10-20 `channel` | DOCUMENTED BP §13.3 | REQUIRES_DECISION (D-014, D-015) |
| Link & reservation expiry | Select: default duration · longer duration for dealers "needs approval" (values samples) | API-M10-20 `link_expiry_option` | MOCKUP | REQUIRES_DECISION (D-026, D-151) |
| Explanation | "Stock is reserved when the link is sent and revalidated at payment; the same reservation, payment and fulfilment rules as the website apply" | — | MOCKUP (conflict 00-conventions §12 #8) | REQUIRES_DECISION (D-151) |
| Foot | "Open as assisted order" (→ P-E02 `#assisted` with the draft) · "Save draft" ("no stock reserved") · "Send secure checkout link" (primary, Idem) | API-M10-19 · API-M10-20 | DOCUMENTED BP §13.2, A08 (1B) | REQUIRES_DECISION (D-151, D-014) |

Preconditions: conversation verified (side-pane action enabled only when verified); no pending approval on the draft;
channel consent / window rules (06-api §4.15).

### 8.6 Modal `m-ticket` — Escalate to ticket

Subtitle: "Transcript, customer identity state and linked orders are attached".

| Field | UI control | Req | Validation (source) | API field |
|---|---|---|---|---|
| Category | Select: Payment dispute · Warranty ambiguity · Missing / late order · Unsafe product issue · Compatibility uncertainty · Other; hint "These categories always go to a person — the bot never answers them" | Y | BP §13.4 escalation list; catalogue D-074/D-139 | `category` |
| Priority | Select with SLA text (High · Critical · Normal · Low — SLA values samples) | N | D-074 | `priority` |
| Assign to | Select (finance, operations, catalog, me) | N | gap-7 | `assignee` |
| Summary | Textarea | Y | — | `summary` |
| Keep conversation open & notify | Checkbox "Keep the conversation open and tell the customer a ticket was created (template …)" | N | Template/consent (BP §13.3) | `keep_conversation_open`, `notify_customer_template` |

Buttons "Cancel" · "Create ticket" → API-M16-11 (`related.conversation_id` when opened from a thread). Result: ticket
reference and due time. DOCUMENTED BP §13.4, T24; status REQUIRES_DECISION (D-074).

### 8.7 States, permissions, dependencies

| Aspect | Specification |
|---|---|
| L / E / X | Skeleton list/thread; "Inbox zero"; send failures show per-message delivery state (failed + retry) — BP §10.3 "expose delivery failure"; provider unavailable → `503` banner, conversations still readable |
| S | Live-update lag/stale indicator per D-146; delivery states (sent, delivered, read, failed) per message |
| Documented support states | Outside hours, bot failure, human handoff (BP §6.3 Help); verification failed / third-party request → handoff without disclosure (T23) |
| Permissions | R-sales_support: inbox, replies, verification, draft baskets, links, tickets, answer drafts. R-branch_manager, R-ops_admin: all conversations and tickets; template submission (API-M16-18: R-ops_admin). Finance/catalog/operations staff: tickets assigned to them (API-M16-12). Order/address/serial/payment data only after verification (BP §13.4, T23); message bodies not written to logs (BP §19.1) |
| APIs | API-M05-01, API-M10-18, API-M10-19, API-M10-20, API-M13-03, API-M16-02, API-M16-04, API-M16-05, API-M16-06, API-M16-07, API-M16-08, API-M16-09, API-M16-11, API-M16-12, API-M16-13, API-M16-14, API-M16-15, API-M16-16, API-M16-17, API-M16-18, API-M16-19, API-M17-03, API-M20-04, API-M22-01, API-M24-01 |
| Backend rules | BR-M16-01…15, BR-M10-10, BR-M20-03, BR-M20-04, BR-M02-11 |
| Entities | E-support_conversation, E-support_message, E-support_ticket, E-approved_answer, E-message_template, E-consent_record, E-verification_challenge (§7.1), E-sales_order (draft), E-quote, E-notification, E-attachment |
| Related pages | P-E02 (orders, `#assisted`), P-E04 (returns), P-E10 (customer), P-S13/shell(S) chat widget, P-S07 (checkout link) |
| CONDITIONAL / MOCKUP-ONLY / LATER | WhatsApp Level 2 guided ordering and A15 verified lookup — 1B (D-048, D-014); AI answers — LATER (Phase 3, D-086); agent availability states — D-074; bot usage shares/support KPIs — D-173 |
| Tests | T23, T24, T25 |

---

## 9. P-E06 — Catalog & imports (`erp-catalog.html`)

### 9.0 Summary

| Field | Value |
|---|---|
| Purpose | Staff catalog management: product list with lifecycle, quality, channels, ATP and price; product editor (versioned drafts that never overwrite live), typed category attributes, variants/SKUs, media with rights, refurbished/serial settings and grade rubric, warranty/returns, tax classification, SEO; attribute templates and new categories by configuration; staged bulk import with mapping, supplier-code matching, row-level fix/retry and preview diff; review queue for staff drafts, vendor submissions, sensitive edits and auto-accepted supplier refreshes |
| Evidence | DOCUMENTED (BP §30.1 Catalog "Product list, product editor, attribute templates, import preview, review queue"; §7.1–7.5; §11.3; §18.1; A01, A02, A20; PR2 §4; PR1 §4 Product Management) + MOCKUP |
| Route | NOT SPECIFIED · MK:erp-catalog.html#products, #editor, #templates, #import, #review; drawer `d-prod`; modals `m-vdiff`, `m-url`, `m-import-new`, `m-newcat`, `m-changes` |
| Phase / IDs | 1A (catalog, editor, templates, publication); validated bulk import and image import 1B per BP §5.1 (A01/A02 marked P1 — conflict §12 #5, D-048/D-078); vendor submissions review 1B · R05, R07, R19, R20 · WP06, WP13 · T12, T13, T26, T32, T33, T36 |
| Primary modules | M04, M22 (+ M06 ATP/supplier refreshes, M14 vendor submissions, M17 approvals, M27 redirects) |
| D-004 native-vs-custom considerations | BP §30.1 lists all five catalog views. BP §15.6 "Use platform configuration before custom code"; BP §7.1 new ordinary categories by configuration (T36). BP §7.4 requires staging, preview diff and row-level retry for imports; BP §7.3 versioned drafts separate from live. Frequency: daily catalog upkeep and imports (MEET "Product and stock entry currently involves manual steps"; A01/A02). Mockup: custom |
| Status | REQUIRES_DECISION (D-004, D-101); publication authority REQUIRES_DECISION (D-081) |

### 9.1 Page head and KPI strip

| Element | Specification | → API | Label | Status |
|---|---|---|---|---|
| Title / subtitle | "Catalog › Products" · "Products & catalog" · "{n} SKUs across {n} categories · {n} awaiting review · last import {id} {time} · stock shown from the inventory authority" | API-M04-15 summary, API-M04-31 | MOCKUP | NOT_STARTED |
| "Export" | Catalog export | API-M18-03 (`catalog`) | DOCUMENTED BP §14.4 | REQUIRES_DECISION (D-152) |
| "Attribute templates" · "Bulk import" | Switch to `#templates` / `#import` | — | MOCKUP | NOT_STARTED |
| "New product draft" (primary) | Opens `#editor` with a new draft (category chosen first) | API-M04-16 | DOCUMENTED BP §18.1 "Create product draft" | NOT_STARTED |
| KPI tiles | Published SKUs (channels) · Drafts (from today's import) · Awaiting review (vendor share · oldest) · Needs changes (back with submitter) · Avg data quality (delta 30 d) · Suspended (quality / safety holds) | API-M04-15 facets / gap-5 | MOCKUP; BP §7.3 states | REQUIRES_DECISION (D-173) |
| Tab counts | Products (total) · Bulk import (errors) · Review queue (n) | gap-2 | MOCKUP | NOT_STARTED |

### 9.2 Tab `#products` — Product list

| Element | Specification | → API | Label | Status |
|---|---|---|---|---|
| Search | "Search title, SKU, brand, barcode…" | API-M04-15 `q` | MOCKUP | NOT_STARTED |
| Filters | Category · Condition · Data quality (Quality below n · Quality n+ — bands sample) · count "n shown" | API-M04-15 (`category`, `condition`, quality band) | MOCKUP | NOT_STARTED |
| Lifecycle chips | All · Draft · Submitted · Needs changes · Approved · Published · Suspended · Archived (counts) | API-M04-15 `lifecycle`; counts gap-2 | DOCUMENTED BP §7.3 | NOT_STARTED |
| Bulk bar | Submit for review · Publish (publish checks run; blocked items reported, e.g. image rights not confirmed) · Channels… · Suspend (reason required) · Archive (URLs redirect); note "Publishing never changes stock — availability comes from inventory" | API-M04-20 (`submit`, `publish`, `set_channels`, `suspend`, `archive`; per-item results with `blocking[]`) | DOCUMENTED BP §7.3, §18.1, T32 | REQUIRES_DECISION (D-081, D-076) |
| Table columns | ☐ · **Product** (thumb, title, SKU · brand · category) · **Condition** badge · **Lifecycle** (pill + note: pending version, supplier-offer-only, suspension reason, last updated by · time) · **Channels** (Website · Branch POS · WhatsApp · Dealer zone — on/off icons with labels) · **Quality** (meter + score) · **ATP** (company ATP; "0 + partner" when only supplier availability — "not company stock") · **Price** (consumer incl. GST; "B2B" dealer ex-GST) · row menu | API-M04-15 | DOCUMENTED BP §7.2 (channels, status), §9.7 (supplier ≠ company stock); price display D-016 | REQUIRES_DECISION (D-016) |
| Row menu | Open in editor · View on store (storefront product page) · Stock by location (P-E08#stock) · Prices & tiers (P-E07) · Duplicate as draft · Suspend… (reason) | API-M04-16 (`duplicate_from_product_id`) · API-M04-20 (`suspend`) | DOCUMENTED BP §7.3; MOCKUP | NOT_STARTED |
| Row click | Quick-view drawer `d-prod` (§9.8) | API-M04-17, API-M06-04 | MOCKUP | NOT_STARTED |
| Empty | "No products match these filters — Try clearing the status or quality filter. Drafts from imports appear under 'Draft'" + "Clear filters" | — | MOCKUP | NOT_STARTED |
| Pager | "Showing a–b of n …" with page buttons | API-M04-15 | MOCKUP | NOT_STARTED |
| Info callout | "Listing approval is not stock. A published product is purchasable only when the inventory authority reports available-to-promise stock (or an approved, fresh supplier offer). Pending versions of a live product are reviewed separately" | — | DOCUMENTED BP §7.1, §9.7, §11.3 | NOT_STARTED |

Data-quality score: MK shows a 0–100 score and meter; its formula is not specified → D-173 (KPI/score definitions).

### 9.3 Tab `#editor` — Product editor

**Header card.** Thumb, title, condition badge; "{internal id} · display SKU · category · editing **draft vN**
(autosaved HH:MM) · live **vN-1** published {date} by {name}"; lifecycle steps (Draft → Submitted → Approved →
Published vN · "vN Draft (pending changes)"); actions "Preview" (storefront preview of the draft), "Save draft",
"Submit for review" (blocked with message when blocking checks exist). → API-M04-17 (`live_version`, `draft_version`,
`preview`), API-M04-18 (`expected_version`), API-M04-20 (`submit`). DOCUMENTED BP §7.3 ("Draft v7 never overwrites live
v6" — MK anno). Autosave: MOCKUP. Status NOT_STARTED.

**Section 1 — Core details** ("Stable core fields shared by every category"; BP §7.2):

| Field | UI control | Req | Validation (source) | API field |
|---|---|---|---|---|
| Title | Text, counter "n / 120 characters" (limit sample) | Y | Hint "no condition words in title (condition is its own field)"; length limit value is a sample — content rules REQUIRES_DECISION (D-049) | `core.title` |
| Brand | Select (approved brands) + propose new brand | Y | Unapproved brands rejected (BP §7.4); new brand → API-M04-23 (approval) | `core.brand_id` |
| Model | Text | Y | — | `core.model` |
| Category | Select (tree path) | Y | Determines attribute template | `core.category_id` |
| Internal ID | Read-only with lock icon, hint "Immutable · never reused" | — | BP §7.2 immutable internal identifier; D-123 format | `product_id` |
| Display SKU | Text (mono) | Y | Unique; format D-123 | `core.display_sku` |
| Barcode (EAN / UPC) | Text (mono), hint "Checked for duplicates across SKUs" | N | Duplicate barcodes flagged (BP §7.4) | `core.barcodes[]` |
| Unit of measure | Select (e.g. Each (unit), Box of 10 — samples) | Y | D-127 | `core.unit_of_measure` |
| Dimensions (L × W × H) | Text + unit addon "cm" | N | Impossible dimensions flagged (BP §7.4) | `core.dimensions` |
| Shipping weight | Decimal + "kg" | N | — | `core.weight` |
| Description | Textarea | N | Claims must match inspection standard (BP §6.6 "Avoid promises such as 'like new' unless…") | `core.description` |
| Publication channels | Checkboxes: Website (B2C) · Dealer zone (B2B) · Branch POS · WhatsApp guided ordering (badge 1B) · Marketplace feed (disabled, badge Phase 2) | Y (≥1 to publish) | BP §7.2 publication channels; marketplace LATER (D-046) | `channels[]` |

**Section 2 — Category attributes** (from template "{category} vN"; "types & units validated on save and import";
legend of field types Numeric + unit · Enum · Boolean · Multi-select · Text; "* required for publishing"; "Edit
template" → `#templates`). Controls by type: numeric input with unit addon; enum select (error state "Required since
template vN"); boolean switch (Yes/No); multi-select chips; text input; hint "{condition types} only" for attributes
that apply to refurbished/used. → API-M04-27 (template), API-M04-18 (`attributes`). Validation: data type, unit,
allowed values/range, required flag per template (BP §7.2 "Avoid unstructured free text for fields needed in
filters"). DOCUMENTED BP §7.1–7.2, T36. NOT_STARTED. The attribute list shown (processor, RAM, storage, screen, battery
health …) is sample template content.

**Section 3 — Variants & SKUs** ("Purchasable specification combinations · axes: {attribute} × {attribute} ×
Condition grade"; "Add variant"): table **SKU** (+ EAN) · **{axis values}** · **Condition** · **Price** (consumer incl.
GST) · **Dealer** (ex-GST) · **ATP** · **Status** · edit. Footer: "Prices are resolved by the pricing engine — edit
them in Pricing & tiers (P-E07). ATP comes from Inventory (P-E08)". → API-M04-17 `skus[]`, API-M04-18 `skus[]`; prices
read-only here (BR-M05-01). DOCUMENTED BP §7.1 (SKU ≠ unit), §7.2 variant relationships. NOT_STARTED.

**Section 4 — Media** ("Drag to reorder · first image is the main image · alt text required"):

| Element | Specification | → API | Label | Status |
|---|---|---|---|---|
| Media grid | Tiles with image, main flag, flags (Low-res, New in vN), caption (view · resolution), status icon (ok / below recommended size / rights not confirmed) | API-M04-17 `media[]` | MOCKUP; BP §7.4 image availability | NOT_STARTED |
| "Upload" / drop tile | Accepted types/size (MK "JPG · PNG · WebP ≤ 8 MB" — sample) | API-M22-01 (`purpose=product_media`, public) → API-M04-18 media refs | DOCUMENTED BP §7.4, §19.1 | REQUIRES_DECISION (D-113, D-112, D-033) |
| "Import from URL" | `m-url` (§9.12) | API-M22-04 | DOCUMENTED A02 (1B) | REQUIRES_DECISION (D-057) |
| Image source | Select (own photography · supplier-licensed (agreement) · manufacturer press kit — samples) | API-M04-18 media `source_type` | DOCUMENTED BP §7.4 rights, R20 | REQUIRES_DECISION (D-057) |
| Alt text (main) | Text (Y) | API-M04-18 media `alt` | DOCUMENTED BP §6.7 image descriptions | NOT_STARTED |
| Rights confirmation | Checkbox "I confirm Tradex has the right to use these images for web, dealer and WhatsApp channels" — **blocking for publishing**; "Recorded with your name, time and the image hashes"; refurbished units additionally show actual unit photos captured at inspection | API-M04-18 image-rights flag | DOCUMENTED BP §7.4 ("Confirm permission to use product images"), §6.6 | NOT_STARTED |

**Section 5 — Refurbished & serial tracking** ("Each unit keeps its own serial, grade, inspection record and photos";
switch "Serialised"):

| Field | UI control | Req | Validation (source) | API field |
|---|---|---|---|---|
| Serialised | Switch | Y | BP §9.4; D-126 lots | `refurb_settings.serialised` |
| Condition grade | Select (Refurbished · Grade A/B, Open box, Used · Good, New — samples) | Y | Grade rubric D-023 (BP §6.6) | `refurb_settings.grade` / SKU condition |
| Inspection checklist | Select (checklist name/version — sample "42-point") + link "View an inspection record" (P-E08#serials) | Y (refurbished) | D-023 | `refurb_settings.checklist_ref` |
| Purchase source | Select (vendor · buy-back lot · trade-in — samples) | N | BP §7.2 purchase source | `refurb_settings.purchase_source` |
| Data erasure evidence | Switch "Required per unit (certificate)" (standard named in MK is sample) | C | Storage devices (BP §7.5) | `refurb_settings.erasure_required` |
| Included accessories | Text | N | BP §7.2 | `refurb_settings.accessories` |
| Manufacturer serial | Select "Capture at GRN · store masked" / "Not applicable" | N | BP §9.4; masking D-153 | (serial policy) |
| Defects & cosmetic disclosure (shown on product page) | Textarea | C (refurbished/used) | BP §6.6 known defects disclosure | `refurb_settings.defects` |

Grade rubric panel (read-only, "Rubric vN · approved by Operations {date}"): table Grade · Cosmetic · Battery · Screen
· Function · Default warranty — rubric content is D-023. Units panel: "N serialised units linked to this SKU (available
· reserved · quarantine · in transit)" + "Open units →" (P-E08#serials). → API-M04-17 `refurb_settings`, API-M04-22
(grades, checklists), API-M06-05 (units count). DOCUMENTED BP §6.6, §7.2, §9.4; status REQUIRES_DECISION (D-023).

**Section 6 — Warranty & returns:**

| Field | UI control | Req | Validation (source) | API field |
|---|---|---|---|---|
| Warranty policy | Select (policy name · duration · version) | Y | Versioned policy (BP §27.2) | `policies.warranty_policy_id` |
| Warranty provider | Select Tradex / Manufacturer / Supplier | Y | Explicit provider; never imply manufacturer warranty when seller provides it (BP §6.6) | `policies.warranty_provider` |
| Duration (months) | Number | C | From policy | policy |
| Return window (days) | Number | C | Warranty duration and return window are separate policy fields (BP §7.5); values D-022 | `policies.return_policy_id` |
| Warranty starts | Select On delivery / On invoice date | C | D-022 | policy |

Note "The policy version is snapshotted on every order line (T33)". DOCUMENTED BP §7.5, §27.2; REQUIRES_DECISION
(D-022).

**Section 7 — Tax classification** (badge "Tax review needed" when changed):

| Field | UI control | Req | Validation (source) | API field |
|---|---|---|---|---|
| HSN code | Text (mono); error "Changed from … in vN · finance review required" | Y | Missing tax classification blocks (BP §7.4); change = sensitive edit → review (BP §11.3, §18.1 "Tax review if required") | `tax.hsn` |
| GST rate | Select | Y | Finance rules (D-037) | `tax.rate_ref` |
| Tax class reference | Select (incl. "margin scheme (finance to confirm)" sample) | Y | D-037 | `tax.class` |
| Price entry | Segmented "Consumer prices incl. GST" / "Dealer prices ex-GST" | — | D-016 | display only |

REQUIRES_DECISION (D-037, D-016).

**Section 8 — SEO & URL** ("Old URLs redirect when slugs change (T32)"):

| Field | UI control | Req | Validation (source) | API field |
|---|---|---|---|---|
| URL slug | Text with domain prefix | Y (to publish) | Slug change creates redirect (BP §6.8, T32) | `seo.slug` |
| Meta title | Text, counter "n / 60 characters — slightly long" (warning) | N | Length is a warning, not blocking (MK) | `seo.meta_title` |
| Meta description | Textarea, counter "n / 160 (warning)" | N | Warning only | `seo.meta_description` |
| Search result preview | Read-only preview (URL, title, snippet) | — | — | — |
| Redirects | "Redirects: {old path} → current slug (301, created {date})" | — | API gap-14 | — |

DOCUMENTED BP §6.8; REQUIRES_DECISION (D-076).

**Right rail — Publish readiness** ("Checks run on save · vN"; badge "n blocking"):

| Element | Specification | → API | Label | Status |
|---|---|---|---|---|
| Data quality score | "n / 100" meter | API-M04-17 `publish_readiness` | MOCKUP | REQUIRES_DECISION (D-173) |
| Blocking (must fix) | e.g. image rights not confirmed · required attribute missing (added as required in template vN) · HSN change needs tax review | API-M04-17/-18 `publish_readiness.blocking[]` | DOCUMENTED BP §7.4 checks, §18.1 | NOT_STARTED |
| Warnings (can publish) | e.g. low-resolution image · meta description over limit · no compatible accessories linked | `publish_readiness.warnings[]` | MOCKUP; compatibility CONDITIONAL (D-071) | REQUIRES_DECISION (D-071) |
| Passed (n) | Title/brand/model/category · condition + rubric · warranty provider & return window · price list resolves (public + dealer) · barcode unique · stock authority linked · serial capture configured | `publish_readiness` | DOCUMENTED BP §7.4, §8.4 | NOT_STARTED |
| Footer | "Reviewer: {role}" · "Publish" (disabled while blocking checks exist; only designated reviewer) | API-M04-20 (`publish`) | DOCUMENTED BP §18.1 | REQUIRES_DECISION (D-081) |

**Right rail — Version history:** timeline (vN draft pending with author/time/changed fields; vN-1 published (live)
approved by …; earlier published versions; "Needs changes" with reviewer comment; v1 created from import job) and
"Compare vN-1 ↔ vN" → `m-vdiff`. → API-M04-17 `version_history`, API-M04-21. DOCUMENTED BP §7.3, §11.3. NOT_STARTED.

### 9.4 Tab `#templates` — Attribute templates & categories

| Element | Specification | → API | Label | Status |
|---|---|---|---|---|
| Categories list | Items: icon, name, "vN · n attributes · n products" or "v1 draft · n attributes · n to map" + "Draft" badge; "New" → `m-newcat` | API-M04-25 | DOCUMENTED BP §7.1 | NOT_STARTED |
| Template governance card | "Edit: {role} · Publish: {role}" (samples); "Every change is a new version with an impact check (products failing, filters affected)"; "Removing an attribute hides it from filters first; data is kept for old order snapshots"; "Template audit log →" (P-E15#audit) | API-M02-30 (via P-E15) | DOCUMENTED BP §7.1, T33; roles REQUIRES_DECISION (D-081) | REQUIRES_DECISION (D-081) |
| Template editor header | "{category} · attribute template" · "Live vN (n products) · editing vN+1 draft · n changes · products are re-validated against vN+1 before it goes live"; "Preview filters" · "Add attribute" · "Publish vN+1" | API-M04-27 (template, `filter_preview`, `impact`); API-M04-28 (`attributes[]`, `expected_version`); API-M04-29 (submission → approval) | DOCUMENTED BP §7.1–7.2 | NOT_STARTED |
| Attribute table | Columns: drag handle · # · **Label & key** (editable label; key mono; change note "New in vN / Filterable in vN") · **Type** (Numeric, Enum, Boolean, Multi, Text) · **Unit** · **Allowed values / range** · **Req.** · **Filter** · **Search** (checkboxes) · **Applies to** (e.g. condition subset) | API-M04-27/-28 | DOCUMENTED BP §7.2 attribute fields | NOT_STARTED |
| Footer | "Changed in vN rows are highlighted. Changing a type on a live attribute creates a migration preview — nothing is rewritten silently" · last published version/by | API-M04-28 `impact` | MOCKUP | NOT_STARTED |
| New category wizard card ("New category by configuration: {name}") | Sub: moving products off a generic template, "no code change, no new product table, checkout unchanged — acceptance test T36"; stepper Details → Attributes → Filters & listing → Review & publish; fields Parent (select), Default HSN · GST, Default warranty (select); attribute table (Attribute · Type · Unit/values · Req. · Filter); **storefront filter preview** (facets with counts); **"T36 acceptance checklist"** panel; footer "Back" · "Saved as draft category — not visible on the storefront until published" · "Continue to review" | API-M04-26, API-M04-28, API-M04-29, API-M04-27 (`filter_preview`) | DOCUMENTED BP §7.1, §29.8, T36; T36 checklist panel MOCKUP | NOT_STARTED · checklist panel REQUIRES_DECISION (D-171) |

### 9.5 Tab `#import` — Bulk import (staged pipeline)

| Element | Specification | → API | Label | Status |
|---|---|---|---|---|
| Job header | File icon; "{job id} · {file name}" · "Template vN · {supplier (code)} · n rows · uploaded by {name} at HH:MM · file hash {sha256…}"; "Template vN" (download XLSX + CSV) · "Error report" (download) · "New import" (`m-import-new`) | API-M04-32; API-M04-37; API-M04-38 | DOCUMENTED BP §7.4 (versioned template, row-level errors) | NOT_STARTED |
| Stepper | Upload → Validate → Map supplier codes → Preview diff → Publish | API-M04-32 `status` | DOCUMENTED BP §7.4 sequence | NOT_STARTED |
| Result tiles | Valid (ready after mapping) · Warnings (can proceed, review advised) · Errors (held in staging · fix & retry) · Duplicates (already imported · skipped) · Unchanged (same as previous job · no-op) | API-M04-32 counts | DOCUMENTED BP §7.4, T26 | NOT_STARTED |
| Idempotency callout | "Safe to re-run. Rows are keyed by supplier + supplier code and the job by file hash. Re-importing the same file, or retrying failed rows, never creates duplicate products, SKUs or images — only changed fields produce new draft versions" | — | DOCUMENTED T26, BP §7.4 | NOT_STARTED |
| Image-fetch callout | "Image URLs are fetched only from allow-listed domains… Private IPs, localhost and cloud metadata addresses are blocked; type/size limits; supplier image rights confirmed per agreement; no scraping of marketplace listings" (domains/limits samples) | — | DOCUMENTED BP §7.4, §19.1, R20 | REQUIRES_DECISION (D-057, D-113) |
| Column mapping | "Saved as profile '{name}'"; badge "n / n mapped"; table **File column** · **Tradex field** · **Transform** (trim, uppercase, checksum, ₹ → minor units, lookup, unit normalisation, allow-list check, "not company stock" for supplier quantity) | API-M04-32 `column_mapping[]`; API-M04-33 (`column_mapping[]`, `save_as_profile`) | DOCUMENTED BP §7.4; E-import_mapping_profile (§7.1) | REQUIRES_DECISION (D-104 money transform) |
| Map supplier codes | "Rule-based matching: barcode → MPN → saved mapping (no AI)"; badge "n need a decision"; table **Supplier code** (+ description) · **Match** (Barcode / Saved / MPN / None / n candidates) · **Tradex SKU** · **Action** (Mapped badge or select: Create new draft · Map to existing… · Ignore / Map to {candidate}); footer "Mappings are saved per supplier and reused next time" · "Save & preview diff" | API-M04-33 (`supplier_codes[{code, action, sku_id}]`) | DOCUMENTED BP §7.4 ("map supplier codes"), §7.1 (supplier code ≠ SKU), §12.1 (no LLM where rules suffice) | NOT_STARTED |
| Row-level results | "Fix inline, then retry only the failed rows — successful rows are not reprocessed"; filter segmented All · Errors · Warnings · Duplicates · Valid; "Retry failed rows"; table **Row** · **Supplier code** · **Product** · **Result** badge · **Message** · **Field** · **Action** (errors: "Fix" (inline edit), "Retry" (re-validate row); warnings: "Accept"; others —) | API-M04-32 (`row_filter`); API-M04-34 (`field_values{}`, `acknowledge_warning`); API-M04-35 (Idem) | DOCUMENTED BP §7.4 checks (required attributes, contradictory condition labels, image availability, duplicate barcodes, impossible dimensions, missing tax classification, unapproved brands/categories), T26 | NOT_STARTED |
| Preview diff | "Step 4 preview · n products change · showing 1 of n" with prev/next; product header; diff Field · Current · After import (supplier cost, supplier availability "not company stock", images +n from allow-listed domain, title "supplier titles don't overwrite curated titles", retail price "Unchanged — cost changes never auto-reprice"); callout "Publishing step 5 will: create n new drafts (need review before going live), update n supplier offers & costs, leave n error rows in staging. Supplier quantities update supplier availability only — never company stock" | API-M04-32 `diff[]`; commit API-M04-36 (Idem) | DOCUMENTED BP §7.4 preview, §8.4 (supplier cost ≠ live price), §9.7, §11.3 | NOT_STARTED |
| Publish (step 5) | Commit valid rows into drafts/change versions for review (no live change without review) | API-M04-36 | DOCUMENTED BP §7.3–7.4 | NOT_STARTED |
| Import history & feeds | "Jobs are monitored · repeated failures raise one incident (A38)"; table **Job** · **Source** (file / API feed with schedule) · **Rows** · **Result** (In progress · n errors / OK · n changes / Published n · n rejected / Failed · template retired / Published) · **By** (staff / Automation / vendor) · **When** | API-M04-31 | DOCUMENTED BP §7.4, A38 | NOT_STARTED |

### 9.6 Tab `#review` — Review queue

| Element | Specification | → API | Label | Status |
|---|---|---|---|---|
| Filter bar | Segmented All · Vendor · Staff · Sensitive edits · Auto-accepted today (counts); reviewer select (Assigned to: {reviewers} · Assigned to me); note "Review SLA {n} h · you cannot approve your own submission" (SLA sample) | API-M04-39 (`source`, `sensitive_only`, `auto_accepted_today`, `reviewer`) | DOCUMENTED BP §11.3, §18.2; review SLA value is a sample | REQUIRES_DECISION (D-081) |
| Queue list | "oldest first"; items: avatar, id, type badge (Sensitive edit / New listing / Needs changes / Update / Auto-accepted), one-line change, submitter, age, SLA (overdue highlighted); empty "Queue is clear"; footer "Routine stock refreshes from trusted vendors auto-accept within bounds" | API-M04-39 | DOCUMENTED BP §11.3 | NOT_STARTED |
| Detail header | Thumb; "{id} · {type} · submitted by {name}" + Vendor/Staff badge; title; flag badges (Sensitive, Open orders on n SKUs, New product, High value, Within bounds, Trusted API feed); SLA + age | API-M14-54 (vendor) / API-M04-21 + API-M17-02 (staff) | DOCUMENTED BP §11.3 | REQUIRES_DECISION (D-081) |
| Live-version callout | "Nothing is live yet — not purchasable until approved and publication checks pass" / "Live version vN stays published until this change is approved. Orders already placed keep their original warranty & price snapshot" / auto-accepted: "Applied automatically at HH:MM — within the auto-accept bounds for this trusted feed. Supplier quantities never become company stock. Revert restores the previous values" | — | DOCUMENTED BP §7.3, §11.3, T12, T13, T33 | NOT_STARTED |
| Diff | Field · Live · Proposed (changed/unchanged) | API-M14-54 `diff[]` / API-M04-21 | DOCUMENTED | NOT_STARTED |
| Automated checks | List ok/bad/warn (schema & required fields; sensitive field change → human review; open orders keep snapshot; barcode unique; duplicate-title warning; image count; auto-accept bound checks such as quantity change within a % and no price/warranty/brand/condition change — bounds are samples) | API-M14-54 `validation`, API-M04-39 | DOCUMENTED BP §11.3 ("within validated boundaries"), A20 | REQUIRES_DECISION (D-081, D-028) |
| Decision note | Textarea "Decision note (required for sensitive edits · kept in audit log)" | API-M17-03 `reason` | DOCUMENTED BP §18.2 | NOT_STARTED |
| Footer (manual items) | "Reviewer: {name} ({role}) · separation of duties enforced"; **Reject** (danger) · **Request changes** (`m-changes`) · **Approve** ("will publish when publication checks pass") · **Approve & publish** | API-M17-03 (`reject`, `request_changes`, `approve`, `approve_and_publish`, `expected_version`) | DOCUMENTED BP §17.4 "Review submission", §18.1–18.2 | REQUIRES_DECISION (D-081) |
| Footer (auto-accepted) | "View rule" (→ P-E14 rule) · **Revert refresh** (danger) | API-M17-09 · API-M06-29 (reason) | DOCUMENTED BP §11.3 | NOT_STARTED |

### 9.7 Staff draft discard

`m-vdiff` "Discard vN" and the review of a staff draft use API-M04-19 (reason; live stays). DOCUMENTED BP §7.3.

### 9.8 Drawer `d-prod` — Product quick view

Head: thumb, SKU, title, condition badge, lifecycle pill, close. Body: lifecycle steps (+ Suspended / Archived / Needs
changes markers and note); tiles Data quality · Price (incl. GST) · Available to promise; Channels (Website, Branch POS,
WhatsApp, Dealer zone — on/off); "Stock by location (from inventory authority)" table Location · ATP; callout "Edits
create a new draft version; the live version stays published until the change is approved". Foot: "Inventory"
(P-E08#stock) · "Open editor". → API-M04-17, API-M06-04. MOCKUP; DOCUMENTED BP §7.3. NOT_STARTED.

### 9.9 Modal `m-vdiff` — Compare versions

"Compare versions · {SKU}" · "vN-1 (live, published {date}) ↔ vN (draft, {author})"; diff rows (e.g. HSN code, missing
attribute "still missing — blocking", images, meta description, warranty policy unchanged); foot "Close" · **"Discard
vN"** (danger; "vN-1 stays live"). → API-M04-21 (`from_version`, `to_version`), API-M04-19 (reason). MOCKUP; BP §7.3.
NOT_STARTED.

### 9.10 Modal `m-import-new` — New bulk import

| Field | UI control | Req | Validation (source) | API field |
|---|---|---|---|---|
| Supplier / source | Select (suppliers + "Internal catalog team") | Y | Supplier exists; permitted | `source` |
| Mapping profile | Select (saved profiles + "New profile…") | N | Profile belongs to source | `mapping_profile_id` |
| File | Drop zone "Drop CSV or XLSX · Template vN · max n rows · staged, nothing goes live on upload" (row limit sample) | Y | Type/size (BP §7.4, §19.1); template version current (retired template → job fails, MK history) | `file_id` via API-M22-01; `template_version` |

"Cancel" · "Upload & validate" → API-M22-01 then API-M04-30 (Idem) → `202 {import_job_id}`. DOCUMENTED BP §7.4, A01;
phase 1B. REQUIRES_DECISION (D-057 supplier formats, D-112).

### 9.11 Modal `m-newcat` — New category

| Field | UI control | Req | Validation (source) | API field |
|---|---|---|---|---|
| Name | Text, placeholder "e.g. Projectors" | Y | Unique under parent (API-M04-26) | `name` |
| Start from | Select: Empty template · Copy attributes from {category} | N | — | `start_from` |

Info: "Ordinary categories are configuration only. New business behaviour (rentals, installation bookings, regulated
goods) needs a development change request" (BP §7.1; change register BP §2.3). "Cancel" · "Create draft" →
API-M04-26. DOCUMENTED. NOT_STARTED.

### 9.12 Modal `m-url` — Import image from URL

| Field | UI control | Req | Validation (source) | API field |
|---|---|---|---|---|
| Image URL | Text (mono); error "Blocked: private network address. Only allow-listed HTTPS domains can be fetched" | Y | Allow-listed hosts only; no internal destinations; redirects to non-allow-listed hosts refused (BP §7.4, §19.1) | `url` |
| Allow-list panel | Read-only list of allowed domains "Managed in Settings → Integrations" (P-E15) | — | — | — |
| Rights | Checkbox "I confirm Tradex has permission to use this image" | Y | BP §7.4 | `rights_confirmed` |

"Fetch image" disabled until valid URL + rights → API-M22-04 (`product_id`, `source_type`) → `202 {media_asset_id}`;
`422 SOURCE_NOT_ALLOWED`. DOCUMENTED A02 (1B). REQUIRES_DECISION (D-057).

### 9.13 Modal `m-changes` — Request changes

| Field | UI control | Req | Validation (source) | API field |
|---|---|---|---|---|
| Fields needing changes | Checkboxes per changed field (e.g. warranty duration with note, images, attributes) | N | — | `fields_needing_changes[]` |
| Reason (sent to submitter, kept in audit) | Textarea | Y | BP §18.2 | `reason` |

"Cancel" · "Send request" → API-M17-03 (`request_changes`, `keep_live_version_until_resubmit`) — "live version
unchanged". DOCUMENTED BP §11.3, T13. REQUIRES_DECISION (D-081).

### 9.14 States, permissions, dependencies

| Aspect | Specification |
|---|---|
| L / E / X | Skeleton list/editor; list empty state; editor save errors inline per field (`VALIDATION_FAILED details.fields[]`); `409 VERSION_CONFLICT` on save shows the other editor's version and a diff |
| S | ATP and supplier availability labelled with their as-of time; import job status refreshes per D-146 |
| Permissions | R-catalog_staff: drafts in assigned categories, imports, mapping, template drafts (template permission), submit for review; cost only if assigned (BP §3.1). Designated reviewer (D-081): approve/publish, review queue decisions — never own submissions (BP §18.2). R-ops_admin/R-owner: publish, suspend, archive, template publication. R-finance: tax review of HSN/GST changes (BP §18.1). R-branch_manager, R-sales_support: read list (API-M04-15). Vendors never use this screen (P-V02) |
| APIs | API-M02-30, API-M04-15…API-M04-23, API-M04-25…API-M04-39, API-M06-03, API-M06-04, API-M06-05, API-M06-29, API-M14-54, API-M17-02, API-M17-03, API-M17-09, API-M18-03, API-M22-01, API-M22-04 |
| Backend rules | BR-M04-01…15, BR-M04-18, BR-M04-20, BR-M22-02…04, BR-M06-14, BR-M06-15, BR-M05-14, BR-M17-06, BR-M17-07 |
| Entities | E-product, E-sku, E-sku_attribute_value, E-offer, E-category, E-attribute_definition, E-category_attribute, E-brand, E-media_asset, E-tax_classification, E-condition_grade, E-warranty_policy, E-return_policy, E-catalog_change_version, E-import_job, E-import_row, E-supplier_code_mapping, E-import_mapping_profile (§7.1), E-vendor_submission, E-supplier_availability, E-approval_request, E-seo_redirect (§7.1), E-attachment |
| Related pages | P-E07 (prices), P-E08 (stock, serials), P-E11 (vendor submissions), P-E14 (rules), P-E15 (integrations allow-list, audit), P-S03 (preview), P-V02 |
| CONDITIONAL / MOCKUP-ONLY / LATER | Marketplace feed channel — LATER (D-046); WhatsApp guided-ordering channel — 1B (D-014/D-048); compatibility warnings — CONDITIONAL (D-071); bundles — CONDITIONAL (D-072); T36 checklist panel — D-171; data-quality score — D-173 |
| Tests | T12, T13, T26, T32, T33, T36 |

---

## 10. P-E07 — Pricing & dealer tiers (`erp-pricing.html`)

### 10.0 Summary

| Field | Value |
|---|---|
| Purpose | Manage price lists (public, dealer, location, contract) as versioned, approved changes; edit quantity tiers per SKU and list; simulate any price through the live engine; manage promotions and stacking policy; view margin floors and discount authority; review pending list changes as diffs; act on supplier cost signals without auto-repricing; browse the price change audit |
| Evidence | DOCUMENTED (BP §8.1–8.4; §14.1 Master data "price lists"; §18.1 "Change dealer tier"; §12.6; PR1 §8 pricing engine; PR2 §4 Pricing) + MOCKUP. BP §30.1 does not list a pricing workspace; 02-architecture §4.3 maps P-E07 to "Master data: price lists (§14.1)" |
| Route | NOT SPECIFIED · MK:erp-pricing.html#lists, #tiers, #simulator, #promotions, #controls, #rules, #approvals, #audit; drawer `d-list`; modals `m-newlist`, `m-decide` |
| Phase / IDs | 1A (WP07) · R03, R04, R06 · T02, T03, T10, T22, T33 |
| Primary modules | M05 (+ M17 approvals, M02 audit, M18 exports) |
| D-004 native-vs-custom considerations | BP §15.1: "Odoo pricelists support customer, location and volume contexts" — candidate cores have native price-list screens. BP §8.1 requires one server-side engine for all channels and a proposed precedence (D-017); BP §18.1 approval of tier changes; BP §8.4 edge cases. Frequency: price-list changes are periodic (list versions, quarterly revisions in MK samples), simulations/override decisions more frequent. Mockup: custom (incl. simulator and diff review) |
| Status | REQUIRES_DECISION (D-004, D-101); pricing precedence REQUIRES_DECISION (D-017) |

### 10.1 Page head, expiry callout, KPI strip, precedence panel

| Element | Specification | → API | Label | Status |
|---|---|---|---|---|
| Title / subtitle | "Catalog › Pricing & tiers" · "Pricing & dealer tiers" · "One server-side price engine for website, staff orders, WhatsApp checkout links and the future app · rule set {version} active since {date}" | API-M05-10 (rule-set version) | DOCUMENTED BP §8.1 | NOT_STARTED |
| "Simulate a price" | Jumps to `#simulator` | — | MOCKUP | NOT_STARTED |
| "Export" ▾ | Price lists (CSV · formula-safe · link expiry — sample) · Quantity tiers (CSV) · Price change audit | API-M18-03 (`price_lists`; tiers dataset gap-11; `audit_log`) | DOCUMENTED BP §14.4 | REQUIRES_DECISION (D-152) |
| "New price list" (primary) | `m-newlist` (§10.11) | API-M05-12 | DOCUMENTED BP §8.1 | REQUIRES_DECISION (D-044 location lists) |
| Expiry callout | "{list} v{n} expires on {date} (in n days). Its successor … is waiting for your approval. If not approved in time, accounts fall back to {fallback list} — never to ₹0 or an arbitrary price" + "Review change" (→ `#approvals`) | API-M05-10 (validity, fallback), API-M17-01 | DOCUMENTED BP §8.4 "Expired price list" | NOT_STARTED |
| KPI tiles | Active price lists (pending · expired) · Dealer accounts (by list) · Live promotions (scheduled · paused) · Below-floor asks (30 d · approved) · Locked quotes (hold durations — samples) · Pending changes (oldest · due) | gap-5 | MOCKUP | REQUIRES_DECISION (D-173) |
| "How every price is calculated" | 8-step flow grouped Resolve base price (1 Customer contract, 2 Dealer price list, 3 Public list/location list) → Adjust (4 Quantity tier, 5 Eligible promotions) → Deliver & tax (6 Shipping & GST) → Guard & commit (7 Margin & authority, 8 Quote lock); badge "Proposed precedence · client sign-off pending"; sub "final price and rule version are stored on each order line · the engine never silently picks 'the biggest discount'" | — (static explanation) | DOCUMENTED BP §8.1 (proposed sequence) | REQUIRES_DECISION (D-017, D-171) |

### 10.2 Tab `#lists` — Price lists

| Element | Specification | → API | Label | Status |
|---|---|---|---|---|
| Toolbar | Filter "Filter lists, accounts…"; type segmented All · Public · Dealer · Location · Contract; note "Consumers see GST-inclusive prices · dealers see ex-GST + tiers · guests see public only" | API-M05-10 (`q`, `type`) | DOCUMENTED BP §8.1; display D-016 | REQUIRES_DECISION (D-016, D-044) |
| Table | **Price list** (name, code) · **Type** badge · **Basis & display** (e.g. derived "Public −n % · ex-GST · tiers", "fixed per-SKU prices") · **Validity** (from → to / open-ended) · **Assigned to** (accounts / channels / PIN ranges) · **SKUs** · **Version** · **Status** (Active / Expires in n days / Awaiting approval / Expired) · open › | API-M05-10 | DOCUMENTED BP §8.1 (contract, dealer, public lists); location lists D-044 | NOT_STARTED |
| Footer | "Every list has a defined fallback on expiry. Expired or missing lists block checkout for that buyer rather than pricing at ₹0" · "Click a row for lines, accounts and history" | — | DOCUMENTED BP §8.4 | NOT_STARTED |
| Empty | "No price lists match — Try another filter" | — | MOCKUP | NOT_STARTED |
| Row click | `d-list` (§10.10) | API-M05-11 | MOCKUP | NOT_STARTED |

### 10.3 Tab `#tiers` — Quantity tiers

| Element | Specification | → API | Label | Status |
|---|---|---|---|---|
| Context | SKU select (title · SKU); Price list segmented (dealer lists); context panel (product, condition, public price incl. GST, est. landed cost, floor %) — cost/floor visible only to permitted roles | API-M05-15 (`sku_id`, `price_list_id`) | DOCUMENTED BP §8.1 step 3; cost visibility BP §3.1 | REQUIRES_DECISION (D-018, D-135) |
| Tier table | **Tier** (List / Tier n) · **Min qty** (editable, list row fixed 1) · **Unit ex-GST** (editable) · **vs list** (%) · **Margin** (%) · **Floor** (OK / "Below n %" → needs approval) · remove | API-M05-15; save via API-M05-13 (`tiers[{sku_id, min_qty, unit_price}]`) | DOCUMENTED BP §8.2, §8.4 (below margin → authorised override) | REQUIRES_DECISION (D-018, D-024) |
| Actions | "Add tier" · checkbox "Scope: per SKU (not mixed basket)" · "Discard" · **"Save as draft change"** ("sent to {approver} for approval") | API-M05-13 (reason, 202 approval) | DOCUMENTED BP §18.1, §12.6; tier scope D-018 | REQUIRES_DECISION (D-018) |
| Info | "Tier edits never go live directly — they are bundled into a price-list change with an effective date and reviewed like any other change. Changing quantity after a quote recalculates the tier and asks the buyer to confirm" | — | DOCUMENTED BP §8.4, BR-M05-11, BR-M05-17 | NOT_STARTED |
| All-units vs graduated worked example | Quantity stepper; two panels (All-units "Proposed default" total and unit; Graduated "Alternative" total and average) with band bars; difference text and storefront nudge text ("Add n more for …") | client calculation over API-M05-15 tiers | MOCKUP; decision Q33 BP §26.4 | REQUIRES_DECISION (D-018, D-171) |
| Blueprint illustration table | BP §8.2 all-units example (Buyer · Qty · Unit price · Line subtotal) | — | review aid (quotes BP §8.2 illustrative values) | REQUIRES_DECISION (D-171) |
| Open-policy callout | "If a dealer returns or cancels part of a tiered order, does the original tier price stand or is an adjustment due? No retroactive repricing until the client agrees a policy and customer disclosure" | — | DOCUMENTED BP §8.2 | REQUIRES_DECISION (D-082) |

### 10.4 Tab `#simulator` — Price simulator (read-only, live engine)

| Field | UI control | Req | Validation (source) | API field |
|---|---|---|---|---|
| Product | Select grouped by category (title + condition) | Y | Approved offer | `sku_id` |
| Buyer context | Select: Guest (not signed in) · Consumer · Dealer (Standard) · Dealer (Gold) · Contract (samples of accounts) | Y | Context derived from the chosen account, never a free "customer type" (BP §8.4, T10) | `buyer_context` |
| Quantity | Stepper | Y | ≥ 1 | `quantity` |
| Channel | Select Website · WhatsApp checkout link · Assisted (staff) · Branch POS | Y | — | `channel` |
| Delivery / location | Select (PIN in-state · PIN with location list · inter-state PIN · pickup at branch — samples) | Y | Serviceability & place of supply (BP §8.4) | `delivery` |
| Coupon code | Text | N | Promotion scope D-043 | `coupon_code` |
| Manual discount % | Number | N | Ignored on website channel (MK) | `manual_discount_pct` |
| Requested by (role) | Select with role limits (samples) | Y | Limits D-024 | `requested_by_role` |
| Simulate on date | Checkbox (MK: "Simulate on {date} ({list} expired, successor not approved)") | N | `as_of` | `as_of` |
| "Try:" presets | Chips (consumer + coupon; clearance + coupon; % off below floor; expired list) | — | review aid | — (D-171) |

Calculation panel (→ API-M05-16 `steps[]`, `final`, `authority_check`, `margin_check`, `warnings[]`): header
"{qty} × {product} · {buyer}" with rule-set badge; ordered steps with status (ok/skip/warn/bad) and value: 0 Context
("Guest session — any client-sent customer type is ignored" / "Buyer context derived server-side"); 1–3 Resolve base
price (contract line / dealer list / expired list → defined fallback / location list / public list); 4 Quantity tier
(tier reached or "add n more"); 5 Eligible promotions (automatic promotions; coupon results incl. not recognised,
not live, not combinable with dealer lists, exclusive vs automatic — "higher-priority rule kept; the larger discount is
not auto-picked", category/minimum basket failures; manual discount ignored on web); 6 Shipping & tax (shipping rule —
values samples; place of supply → CGST+SGST or IGST; HSN); 7 Margin & discount authority (below floor → approval by
{role}; discount above role limit → routed to {role}; est. landed cost "visible to Finance/Owner only"); 8 Quote lock
(locked for {duration} or "held — approval request created; the buyer sees 'price under review', nothing is reserved
yet"). Final panel: dealer — unit ex-GST, unit incl. GST, line ex-GST (GST), order total; consumer — unit incl. GST
(shown to buyer), unit ex-GST, line incl. GST, order total; "held" marker. No side effects, no reservation (06-api
API-M05-16). DOCUMENTED BP §8.1, §8.4; MOCKUP. REQUIRES_DECISION (D-017, D-018, D-043, D-016, D-024, D-154).

### 10.5 Tab `#promotions` — Promotions

| Element | Specification | → API | Label | Status |
|---|---|---|---|---|
| Toolbar | Segmented All · Live · Scheduled · Paused / ended (counts); "Generate single-use codes"; "New promotion" (primary; "draft · needs approval before going live") | API-M05-17 (`status`); API-M05-19; API-M05-18 | DOCUMENTED BP §8.1 step 4; PR1 §8 "subject to confirmed scope" | REQUIRES_DECISION (D-043) |
| Table | **Promotion / code** (code, description) · **Type** (Coupon / Automatic / Payment offer / Bundle / Dealer promotion) · **Eligibility** · **Benefit** · **Stacking** · **Validity** · **Usage / budget** (used / cap meter or orders / amount given) · **Status** (Live, Live · n % budget, Scheduled, Awaiting approval, Paused · reason, Ended) | API-M05-17 items | DOCUMENTED BP §8.1; bank "Payment offer" MOCKUP-ONLY (D-062); bundles CONDITIONAL (D-072) | REQUIRES_DECISION (D-043, D-062, D-072) |
| Promotion lifecycle | MK shows paused/ended states and an audit entry "Live → Paused" but no pause/resume/edit control | gap-10 | MOCKUP | REQUIRES_DECISION (D-043) |
| Stacking policy panel | Rules (max one coupon; automatic + coupon only if both combinable; consumer promotions never on dealer lists/contracts; dealer promotions after tier when flagged; payment offers itemised separately; exclusive conflicts → higher-priority rule, not larger discount) — rule content is policy | API-M05-17 `stacking_policy` | DOCUMENTED BP §8.1 step 4, §8.4 | REQUIRES_DECISION (D-017, D-043) |
| Coupon validation failures · 24 h | Rows: expired code · not valid on dealer pricing · minimum basket not met · rate-limited guesses (IP blocked — sample) with counts | API-M05-17 `validation_failures_24h[]` | MOCKUP; BP §19.1 abuse protection | REQUIRES_DECISION (D-043, D-084) |
| Budget & abuse controls | Per-customer limit · budget stop · refund handling (original line discount) · approval of large budgets (values samples) | API-M05-17 `budget_controls` | DOCUMENTED BP §8.4 (refund uses original allocated discount); values D-024 | REQUIRES_DECISION (D-043, D-024) |
| New promotion form (not drawn in MK) | name, type, eligibility, benefit, stacking class (Y — explicit), validity, budget, usage limits | API-M05-18 → 202 approval | DOCUMENTED | REQUIRES_DECISION (D-043) |

### 10.6 Tab `#controls` — Margin & authority

| Element | Specification | → API | Label | Status |
|---|---|---|---|---|
| Placeholder callout | "Placeholder thresholds. The margin floors and % limits below are proposed values for the prototype. Exact limits must be supplied and signed off by the client before they are enforced as policy" (MK anno "§18.1 Thresholds are placeholders") | API-M05-20 (values TBC) | DOCUMENTED BP §18.1 | REQUIRES_DECISION (D-024) |
| Margin floors | Table Scope (by condition / contracts) · Floor · 30 d breaches · On breach (approval with reason / block · owner only); "Edit" → floor change request ("needs Owner approval"); note on margin formula and visibility ("Cost & margin are visible only to Finance, Operations admin and Owner roles") | API-M05-20; API-M05-21 (`scope`, `new_floor`, `reason`) | DOCUMENTED BP §8.4; cost basis D-135 | REQUIRES_DECISION (D-024, D-135) |
| Authority matrix | Table Action × role (Sales/support · Branch mgr · Ops admin · Finance · Owner) with Allowed / Not allowed / limit text / "Request" / "Review"; actions: manual line discount, sell below margin floor, assign/change dealer tier, create/edit promotion, publish price-list change, override expired list/quote lock, view cost & margin; legend "'Request' = creates an approval item · Nobody approves their own request"; link "Approval thresholds →" (P-E15#thresholds) | API-M05-20 `authority_matrix[]` | DOCUMENTED BP §18.1 (example matrix), §18.2; values D-024; role labels D-222 | REQUIRES_DECISION (D-024, D-222) |
| Open override requests | Exception rows (severity, title with order/quantity/purpose, requester + limit, margin vs floor, age · due, approver) with "Decide" (→ `m-decide`); resolved rows with reason and "Audit" (→ `#audit`); link "Approval queue →" (P-E14#approvals) | API-M05-20 `open_overrides[]`; API-M17-02/-03 | DOCUMENTED BP §8.4, §18.2 | REQUIRES_DECISION (D-024) |

### 10.7 Tab `#rules` — Edge cases

Table **Case** · **Engine behaviour** · **Status** (Configured / Decision pending) · **Acceptance test** (IDs "AT-PR-01
✓" …). Cases: dealer signs out; guest sends a dealer customer type; promotion + dealer discount; expired price list;
below minimum margin; quantity changes after quote; location changes; refund on discounted order; supplier changes cost;
shared page cache; partial return of tiered order (decision pending); tier scope per SKU or basket (decision pending).
Content = BP §8.4 case table (DOCUMENTED) plus two open policies (D-082, D-018). Whether this tab is a product
feature (and where its "Configured" status and test IDs would come from) is REQUIRES_DECISION (D-171). No API.

### 10.8 Tab `#approvals` — Pending changes

| Element | Specification | → API | Label | Status |
|---|---|---|---|---|
| Change card header | "{list} · {revision name}" · badges "Awaiting approval", "vN → vN+1"; sub "{change id} · requested by {name} ({role}) {time} · effective {date time} · approver: {role} · due {date}"; **Reject** · **Request changes** · **Approve** (each opens `m-decide` preset) | API-M05-14; API-M17-02 | DOCUMENTED BP §18.1–18.2; MOCKUP ("Pending change shown as a diff; live list unchanged until approved") | NOT_STARTED |
| Impact tiles | SKUs changed (of total) · Average change · Est. margin impact / month · Below margin floor (n SKUs) | API-M05-14 | MOCKUP | REQUIRES_DECISION (D-135) |
| Reason callout | Requester's reason + evidence references (cost sheet, competitor quotes — attachments) | API-M05-14 / API-M17-02 `evidence[]` | DOCUMENTED BP §18.2 ("Record why") | NOT_STARTED |
| List header diff | Field · Live · Proposed (validity, fallback on expiry, assigned accounts, tier mode, rounding) | API-M05-14 `header_diff` | DOCUMENTED BP §8.4; rounding D-104 | REQUIRES_DECISION (D-104, D-018) |
| Line changes | "showing n of N"; filter segmented All · Decreases · Increases · Floor breaches; table Product · List ex-GST (old → new) · tier 1 (old → new) · tier 2 (old → new) · Price Δ · Cost Δ · Margin at top tier · Check (OK / "Below n % floor") | API-M05-14 (`filter`) | MOCKUP | REQUIRES_DECISION (D-024) |
| Footer | "{requester} requested this change and cannot approve it (separation of duties). Quotes locked before {effective date} keep their locked price" · "Live list vN stays in effect until approval" | — | DOCUMENTED BP §18.2, §8.1 step 7 | REQUIRES_DECISION (D-154) |
| Supplier cost changes detected | Sub "From supplier price files & POs · live prices are NOT changed automatically — each signal needs a decision"; badge "n signals"; table Product · Source (price file / PO invoice cost / feed / GRN batch cost) · Cost change · Margin at current price (public · dealer) · Suggested (e.g. raise list by n %, hold price, no change) · Action "Draft change" / "Dismiss" (reason required) | API-M05-22; API-M05-23 (`draft_change` / `dismiss` + reason) | DOCUMENTED BP §8.4 "Supplier changes cost"; BR-M05-14 | NOT_STARTED |

### 10.9 Tab `#audit` — Change audit

| Element | Specification | → API | Label | Status |
|---|---|---|---|---|
| Toolbar | Search "Search actor, SKU, list…"; object select All objects · Price lists · Tiers · Promotions · Overrides · Security events; note "Immutable · before/after · reason · approval reference"; "Export" (formula-safe CSV) | API-M02-30 (`object_type`, `q`); API-M18-03 (`audit_log`) | DOCUMENTED BP §17.3, §14.3 audit export, §14.4 | REQUIRES_DECISION (D-114, D-152) |
| Table | **When** · **Actor** (user / price engine / release / security) · **Object** · **Change** · **Reason** · **Approval** (reference + status: pending, delegated, owner, within role, logged, n/a) | API-M02-30 | DOCUMENTED BP §17.3, §20.1 | NOT_STARTED |
| Pager | "Showing n of N events" | API-M02-30 | MOCKUP | NOT_STARTED |

### 10.10 Drawer `d-list` — Price list detail

Head: list name, type badge, status; "{code} · {version} · {from} → {to}". Body: expiry/successor callout (fallback
accounts count) or expired-list callout ("kept read-only for audit and for orders placed while it was valid. It can't
be assigned to new accounts"); key-values Basis · Tax display · Tier mode · Fallback on expiry · Rounding · Owner /
approver; **Assigned accounts** table Account (name, contact · city) · Status · Payment terms (prepaid default, D-019) ·
"Open" (P-E10#business) + "+ n more accounts"; **Sample lines** table Product · Public incl. GST · This list · tier 1 ·
tier 2 · Margin ("margin visible to Finance/Owner only"); **Version history** timeline. Foot: "Close" · **"Duplicate as
draft"** · **"Propose change"** ("live list unchanged until approved"). → API-M05-11; API-M05-13 (`duplicate`,
`lines[]`, `tiers[]`, `header_changes{}`, `reason`). DOCUMENTED BP §8.1, §8.4, §18.1. REQUIRES_DECISION (D-018, D-019,
D-135).

### 10.11 Modal `m-newlist` — New price list

Subtitle "Created as a draft · goes live only after approval".

| Field | UI control | Req | Validation (source) | API field |
|---|---|---|---|---|
| Name | Text, placeholder "e.g. Dealer Platinum" | Y | Unique | `name` |
| Type | Select Dealer · Location · Customer contract · Public | Y | Location lists REQUIRES_DECISION (D-044) | `type` |
| Price display | Segmented Ex-GST (B2B) / GST-inclusive (B2C) | Y | D-016 | `display_basis` |
| Basis | Select: derived rule (e.g. public list −n %) · copy of {list vN} · explicit per-SKU prices (import) | Y | — | `basis` |
| Valid from | Date | Y | ≤ valid to | `valid_from` |
| Valid to | Date | Y | ≥ valid from | `valid_to` |
| Fallback on expiry | Select {list} · Public list · Block checkout (quote only); hint "Required — a list can never fall back to ₹0" | Y | BP §8.4 | `fallback_on_expiry` |
| Rounding | Select Nearest ₹10 · Ends in 9 (B2C) · None (paise) — samples | N | D-104 | `rounding` |
| Reason for change | Textarea "Visible to the approver and kept in the audit log" | Y | BP §18.2 | `reason` |

"Cancel" · "Create draft" → API-M05-12 → `201 {price_list_id, status: draft}`; lines are then added via change requests
(API-M05-13) and approved (API-M17-03). DOCUMENTED BP §8.4; MOCKUP. REQUIRES_DECISION (D-044, D-016, D-104).

### 10.12 Modal `m-decide` — Decide on change

Approval-decision pattern (§2.20 #1): segmented Approve · Request changes · Reject (preset by the calling button);
"Reason (recorded in audit log)" textarea **required** (inline error "A reason is required for every decision");
checkbox "Notify requester and affected account managers" (gap-15); info "Approving publishes vN+1 on its effective date.
Locked quotes keep their price until the lock expires". "Cancel" · "Submit decision" → API-M17-03 (`decision`,
`reason`, `expected_version`). Results: approved (goes live on effective date, requester notified) / changes requested
(returned to requester) / rejected (live list stays; fallback applies at expiry). DOCUMENTED BP §18.2, §17.4.
REQUIRES_DECISION (D-024 authority).

### 10.13 States, permissions, dependencies

| Aspect | Specification |
|---|---|
| L / E / X | Skeleton tables; list empty state; simulator shows engine errors per step (e.g. no valid list → "block checkout") rather than failing silently; save errors inline; `409 VERSION_CONFLICT` on change requests |
| S | Rule-set version and list validity shown; cost signals show source date |
| Permissions | R-ops_admin, R-owner: create lists, propose changes, promotions; R-finance: read, margin/cost, floor change requests, review; R-branch_manager: read, tier/list change requests within delegated policy, own-branch promotions (MK sample); R-sales_support: read lists, simulate, request; approvals by authorised approver ≠ requester. Cost and margin visible only to permitted roles (MK "Finance, Operations admin and Owner"; BP §3.1, §14.4) |
| APIs | API-M02-30, API-M05-10, API-M05-11, API-M05-12, API-M05-13, API-M05-14, API-M05-15, API-M05-16, API-M05-17, API-M05-18, API-M05-19, API-M05-20, API-M05-21, API-M05-22, API-M05-23, API-M17-01, API-M17-02, API-M17-03, API-M18-03 |
| Backend rules | BR-M05-01…20, BR-M17-06, BR-M02-06 |
| Entities | E-price_list, E-price_list_item, E-quantity_tier, E-price_rule_version, E-promotion, E-promotion_code (§7.1, CONDITIONAL D-043), E-margin_floor, E-discount_authority, E-quote, E-approval_request, E-audit_event, E-business_account |
| Related pages | P-E02 (assisted discounts), P-E06 (variants show resolved prices), P-E10 (account price list), P-E14 (approvals), P-E15 (thresholds), P-S11 (dealer price list) |
| CONDITIONAL / MOCKUP-ONLY | Coupons/promotions — D-043; bank payment offers — MOCKUP-ONLY (D-062); bundles — CONDITIONAL (D-072); location lists — D-044; explanatory panels, worked examples, edge-case test IDs, simulator presets — D-171 |
| Tests | T02, T03, T10, T22, T33 |

---

## 11. P-E08 — Inventory & serials (`erp-inventory.html`)

### 11.0 Summary

| Field | Value |
|---|---|
| Purpose | One stock authority view: enterprise stock by SKU with ATP components and per-location breakdown, serialised-unit lookup and lifecycle, append-only movement ledger, transfers with partial receipt and discrepancies, cycle counts with variance approval, reservations (holds, expiry job, releases), and supplier availability with freshness |
| Evidence | DOCUMENTED (BP §30.1 Inventory "Stock by location, serial lookup, receipt, QC, transfer, cycle count, movement history"; §9.1–9.7; §7.5; §17.2, §17.6; A05, A06, A18, A21, A24; PR2 §4 Inventory authority; PR1 §9) + MOCKUP |
| Route | NOT SPECIFIED · MK:erp-inventory.html#stock, #serials, #movements, #transfers, #counts, #reservations, #supplier; modals `m-transfer`, `m-reveal` |
| Phase / IDs | 1A (WP08); supplier stock freshness 1B (A21) · R08, R14, R19 · T04, T05, T14, T15, T16, T17 |
| Primary modules | M06 (+ M13 supplier RMA, M17 approvals/jobs, M24 configuration, M02 reveal) |
| D-004 native-vs-custom considerations | BP §9.4: "ERPNext documents serial and batch traceability across an item's lifecycle [S05]. The implementation still needs business-specific checks for duplicate serials, refurbished grading, replacement history, and warranty policy". BP §15.1 lists ERPNext serial/batch records as reuse candidates "to prove through realistic workflows"; proof scenarios 1, 4, 7, 8 (BP §15.3). BP §9.2 ATP formula and §9.6 count controls must hold regardless of UI. Frequency: continuous (receipts, moves, counts). Mockup: custom |
| Status | REQUIRES_DECISION (D-004, D-101) |

### 11.1 Page head and KPI strip

| Element | Specification | → API | Label | Status |
|---|---|---|---|---|
| Title / subtitle | "Stock › Inventory & serials" · "One stock authority for web, branches & WhatsApp · website availability is a projection of this ledger · last movement HH:MM · sync lag n s" | API-M06-11 (latest), API-M24-08 summary | DOCUMENTED BP §9.1, §16.5 | NOT_STARTED |
| Location scope select | All locations · each location | API-M03-02 → `location_id` on tab queries | MOCKUP | REQUIRES_DECISION (D-170, D-029) |
| "Export" | Stock snapshot export "includes movement totals for reconciliation" | API-M18-03 (`stock_snapshot`) | DOCUMENTED BP §14.1 ("Inventory extracts" = filterable reports), §14.4 | REQUIRES_DECISION (D-152, D-075) |
| "Start count" | Goes to `#counts`; count creation form not drawn in MK: location (Y), scope bins/SKUs (Y), type cycle/full/recount (Y), mode freeze/reconcile (D-069) | API-M06-19 | DOCUMENTED BP §9.6 | REQUIRES_DECISION (D-069) |
| "New transfer" (primary) | `m-transfer` (§11.9) | API-M06-13 | DOCUMENTED BP §9.5 | NOT_STARTED |
| KPI tiles | Sellable on-hand (value at cost — permitted roles) · Reserved (n expire soon) · Available (ATP) (after buffer units) · Quarantine (returns vs inbound QC) · In transit (transfers · discrepancies) · Low-stock SKUs (→ PO suggestions P-E09#suggestions) | gap-5 (aggregates of API-M06-03) | DOCUMENTED BP §9.2, §14.3; A17 | REQUIRES_DECISION (D-173, D-135) |
| Tab counts | Transfers (n) · Counts (n) · Reservations (n) · Supplier stock ("n stale") | gap-2 | MOCKUP | NOT_STARTED |

### 11.2 Tab `#stock` — Stock by SKU

| Element | Specification | → API | Label | Status |
|---|---|---|---|---|
| ATP formula card | "How available-to-promise is calculated · Per SKU × location × stock owner · worked example for {SKU} — click any row to recalculate"; formula terms Sellable on-hand − Reserved − Safety buffer = ATP; aside Quarantine, In transit ("not sellable"); notes "Sellable on-hand already excludes quarantine, damaged, repair and in-transit units — they are not subtracted twice" · "Open POs and supplier availability are never counted as company stock"; badge "Stock authority: {system}" | Values from API-M06-04 for the selected SKU | DOCUMENTED BP §9.2 (formula text) | NOT_STARTED · panel form REQUIRES_DECISION (D-171) |
| Filters | Search "SKU, title or barcode" · Location · Category · toggle chips Low stock · Has quarantine · In transit · count "n SKUs shown" | API-M06-03 (`q`, `location_id`, `category`, `flags`) | MOCKUP | NOT_STARTED |
| Table columns | expand toggle · **Product · SKU** (thumb, title, SKU, condition badge) · **Sellable** ("Excludes quarantine & in-transit") · **Reserved** · **Buffer** · **ATP** (emphasised; low stock highlighted) · **Quar.** · **Transit** ("Not sellable until received") · **ROP** (reorder point) · **Web shows** (In stock / Only n left / Out of stock / Partner stock / Hidden · listing suspended) · **Flags** (Low · No company stock · QC) | API-M06-03 items (incl. `web_projection{value, as_of}`) | DOCUMENTED BP §9.2, §9.7, A18 ("Distinguish reserved and in-transit"); buffer D-027; ROP D-070 | REQUIRES_DECISION (D-027, D-070, D-128) |
| Expanded row (location view) | Table Location (name, code) · Bin · Sellable · Reserved · Buffer · ATP · Quarantine · Incoming + Enterprise totals row; links Movements · n active holds · Serialised units · Reorder suggestion (P-E09) · Transfer (`m-transfer`) | API-M06-04 | DOCUMENTED BP §9.2, §9.5 | NOT_STARTED |
| Footer | "Sample of … · n below reorder point" / "Location view: expand a row · low stock = ATP ≤ reorder point" | API-M06-03 | MOCKUP | REQUIRES_DECISION (D-070) |
| Empty | "No SKUs match — Clear a filter to see more stock" | — | MOCKUP | NOT_STARTED |

Stock owner dimension (company vs consignment) is part of the ATP key (BP §9.2) → column/filter REQUIRES_DECISION
(D-128); lot/batch → D-126.

### 11.3 Tab `#serials` — Serial lookup and unit lifecycle

| Element | Specification | → API | Label | Status |
|---|---|---|---|---|
| Scan box | Input "Scan or type U-…, manufacturer serial or order no." + "Look up" (Enter submits) | API-M06-06 (`q`) | DOCUMENTED BP §9.4 ("Store a manufacturer identifier separately from the internal tracking identifier") | REQUIRES_DECISION (D-110) |
| "Try:" chips | Sample lookups (returned, sellable, sold, duplicate serial, not found) | — | review aid | REQUIRES_DECISION (D-171) |
| Duplicate serial state | Critical callout "Duplicate manufacturer serial detected — {serial}: appears on {unit} (sold, order) and on a unit scanned into {GRN} (receiving now). The new unit is held in receiving and cannot become sellable until resolved (possible mis-scan, relabelled or returned device)"; "Open {GRN}" (P-E09#receive) · "Open discrepancy case" | API-M06-06 `duplicate_warning`; case: API-M06-08 (`open_discrepancy`) for existing units / gap-12 for a unit still in receiving | DOCUMENTED BP §9.4 duplicate checks, T15 | NOT_STARTED |
| Not found state | "No unit found for '{q}' — We search internal unit IDs, manufacturer serials and order numbers. Check for a mis-scan, or look up the GRN if the unit is still being received" + "Receiving" (P-E09) · "Returns desk" (P-E04) | API-M06-06 | MOCKUP | NOT_STARTED |
| Unit card | "Serialised unit" · unit ID · grade badge · state pill (e.g. Quarantine · awaiting re-grade / Sellable · available / Sold · delivered); actual-unit photos (main + thumbs); key-values Product · SKU · {manufacturer serial label} (masked + "Reveal (audited)" → `m-reveal`) · Location (with bin / "With customer · {area PIN}") · Photos ("n actual-unit photos · captured at inspection") | API-M06-07 (`masked_manufacturer_serial`) | DOCUMENTED BP §7.2 refurbished/serial fields, §6.6 (actual photos) | REQUIRES_DECISION (D-153) |
| Inspection record | Inspection id · Inspector · Date · Result · Battery · Erasure (certificate) · "Full checklist" (report document — gap-11) | API-M06-07 `inspection` | DOCUMENTED BP §7.2 | REQUIRES_DECISION (D-023) |
| Warranty | Policy · Provider · Term (paused while in RMA — MK); "Policy version is the one snapshotted on the original order line" | API-M06-07 `warranty` | DOCUMENTED BP §7.5, T33 | REQUIRES_DECISION (D-022) |
| Unit lifecycle | "Every event is a ledger entry with reference and actor"; timeline: Purchase order → Goods receipt (serial scanned against PO) → QC inspection → Graded (+ erasure) → Photographed → Published (unit shown with its own photos) → Reserved (serial-specific hold) → Sold & dispatched (invoice, AWB) → Returned (RMA, "linked to original sale ✓") → Quarantine → Re-grade (pending); "Export" (gap-11) | API-M06-07 `lifecycle[]` | DOCUMENTED BP §9.4 ("traceability across an item's lifecycle"), §7.5 | NOT_STARTED |
| Quarantine callout + actions | "A unit can't be in two active fulfilments. While in quarantine it is excluded from sellable stock and from ATP; re-grading creates a new grade event — the original history is preserved"; **Start re-grade** (→ inspection form, checklist version) · **Send to repair** · **Return to supplier** (supplier RMA draft) | API-M06-08 (`re_grade` → API-M06-09 `context=re_grade`; `send_to_repair`; `return_to_supplier` → API-M13-15), reason required | DOCUMENTED BP §9.4, §7.5 (serial replacement keeps histories), BR-M06-08, BR-M06-21 | REQUIRES_DECISION (D-023) |

### 11.4 Tab `#movements` — Movement ledger

| Element | Specification | → API | Label | Status |
|---|---|---|---|---|
| Rule callout | "Immutable ledger. Every quantity change is a movement with an event type, reference document and actor. Movements are never edited or deleted — corrections are posted as reversing entries with a reason and approver. Balances on the Stock tab are the sum of this ledger" | — | DOCUMENTED BP §9.6, §17.6; BR-M06-04 | NOT_STARTED |
| Filters | Search "SKU, serial, document…" · Event type (Receipt, QC pass, QC fail, Reserve, Release, Dispatch, Return in, Transfer out, Transfer in, Adjustment, Reversal, Re-grade) · Location · period segmented Today · 7 days · 30 days · "Export ledger" ("signed hash for audit" — MK) | API-M06-11 (`q`, `event_type`, `location_id`, `from`, `to`); API-M18-03 (`stock_ledger`) | MOCKUP; BP §9.2 event table | REQUIRES_DECISION (D-152, D-114) |
| Table | **Time · ID** · **Event** (coloured type chip with icon) · **SKU · unit** · **From → to** · **Disposition change** (e.g. "sellable → shipped · reservation consumed", "free → reserved (ATP −1)") · **Units** · **Δ Sellable** (+/−/0 — "Effect on sellable on-hand") · **Reference** (order/AWB, GRN/PO, reservation, count) · **Actor** (user, station, automation, checkout) | API-M06-11 | DOCUMENTED BP §9.2 | NOT_STARTED |
| Reserve/Release rows | MK shows reservations as ledger rows with Δ sellable 0; the plan models reservations in E-reservation (00-conventions §12 #6) — the screen may present both views | API-M06-11 + API-M06-24 | MOCKUP; conflict §12 #6 | NOT_STARTED |
| Pager | "Showing n of N movements today · ledger total reconciles with balances ✓ checked HH:MM" | API-M06-11 | DOCUMENTED BP §17.6 ("history reconciles to balances") | NOT_STARTED |
| Empty | "No movements match — Try another event type or search" | — | MOCKUP | NOT_STARTED |

### 11.5 Tab `#transfers` — Transfers

| Element | Specification | → API | Label | Status |
|---|---|---|---|---|
| List card | "Stock transfers · Internal transfers never create or destroy enterprise stock · in-transit is not available at the destination until received"; "New transfer"; table **Transfer** · **Route** (from → to) · **Lines** · **Units** · **Value (cost)** (permitted roles) · **Status** (Requested · awaiting approval / Approved · picking / In transit · ETA / Partly received · −n / Received · matched / Cancelled · stock returned to source) · **Requested by** · **Updated** | API-M06-12 | DOCUMENTED BP §9.5; T16 | NOT_STARTED |
| Detail card (selected transfer) | "{id} · {from} → {to}" · shipped info (time, vehicle — sample) · received info (time, by, scan); discrepancy badge; stepper Requested → Approved → Shipped → Partial → Closed; lines table SKU (serials scanned / "Not serialised · carton count") · Shipped · Received · In transit · Line status (Matched / Short n · investigating) | API-M06-14 | DOCUMENTED BP §9.5, T16 | NOT_STARTED |
| Discrepancy callout | "n × {SKU} ({value} at cost) remains in transit. It stays on the enterprise ledger under 'in transit {from} → {to}'; destination ATP increased only by the units received. Resolve by receiving it, recording a loss (needs approval) or returning it to source" | API-M06-14 `discrepancies[]` | DOCUMENTED BP §9.5, T16 | NOT_STARTED |
| Detail footer | "Discrepancy case {id} · owner · due"; **Receive late unit** · **Investigate** · **Record loss…** (danger; "needs manager approval (value …)") | API-M06-16 (Idem) · API-M06-17 (`investigate` / `record_loss` + qty, evidence, reason → 202 approval) | DOCUMENTED BP §9.5, §9.6 | REQUIRES_DECISION (D-024) |
| Lifecycle actions (not drawn in MK) | Submit, ship (source → transit, serial scan at dispatch), cancel | API-M06-15 (Idem, `expected_version`) | DOCUMENTED BP §9.2 transfer events | NOT_STARTED |
| Enterprise balance check | Per SKU: source sellable before → after, destination before → after, in transit before → after, **Enterprise total unchanged ✓**; "Transfers move stock between buckets; totals only change through an approved adjustment" | API-M06-14 `enterprise_balance_check` | DOCUMENTED BP §9.5, §17.6 | NOT_STARTED |
| Transfer rules card | "Transfer rules (sample — to confirm)": branch visibility/request/promise rule; approval by value (sample); serial scans at dispatch and receipt | API-M24-01 (configuration) | MOCKUP; BP §9.5 "Decide whether each branch may see other branches' stock, request it, or promise it" | REQUIRES_DECISION (D-029, D-024) |

### 11.6 Tab `#counts` — Counts

| Element | Specification | → API | Label | Status |
|---|---|---|---|---|
| Rule callout | "Counts never overwrite quantity. A count records what was observed. Approved variances post an adjustment movement with reason, evidence and approver; unapproved variances change nothing. Bins being counted are frozen or intervening movements are reconciled" | — | DOCUMENTED BP §9.6 | REQUIRES_DECISION (D-069) |
| Stat tiles | Open count (location/zone · % progress · blind count · bins frozen) · Variances awaiting approval (net · gross value) · Auto-accepted within tolerance (tolerance sample) · Stock accuracy (30 d; count cadence by class — sample) | API-M06-18, API-M06-22 | DOCUMENTED BP §9.6, §4 stock accuracy; tolerance D-024; cadence D-069 | REQUIRES_DECISION (D-069, D-024, D-173) |
| Count sheet | "Count sheet · {id}" · counter · started · "expected quantities hidden from counter (blind count)"; badge Counting; table **Bin** (frozen marker) · **SKU** · **Counted** (number input) · **Serial check** (n/n scanned ✓) · action (✓ / "Scan" for a bin not yet counted); footer "Scanning a bin locks it until the count is submitted" · **"Submit count"** ("n variances sent for review (no stock changed yet)") | API-M06-20; per-bin scan/lock gap-13; API-M06-21 (Idem, `lines[{line_id, counted, serials_seen[]}]`, `counted_at`) | DOCUMENTED BP §9.6 (time, operator, expected, observed); blind count MOCKUP | REQUIRES_DECISION (D-069, D-110) |
| Variance review | "Reviewer sees expected vs counted, value and reason"; badge "n open"; table **SKU · bin** (+ reason: Unknown / Water damage · n photos / Receiving error {GRN}) · **Exp.** · **Cnt.** · **Var.** · **Value** · **Approval** (required level: Manager / Owner / finance "Above manager limit" / Warehouse lead "Approved HH:MM · {movement id}") | API-M06-22 | DOCUMENTED BP §9.6, A24 | REQUIRES_DECISION (D-024) |
| Variance actions | Row selection; **Request recount** (second counter) · **Approve selected** (each keeps its own decision) ; footer "Staff submit · managers approve within threshold · large or unexplained losses go to owner/finance" | API-M06-19 (`type=recount`) · API-M17-04 (bulk decisions) / API-M17-03 | DOCUMENTED BP §9.6, §18.2 | REQUIRES_DECISION (D-024, D-069) |
| Adjustment approval thresholds | Three tiers (warehouse lead / branch-operations manager / owner-finance) with value and quantity limits (samples — "exact ₹ limits to be supplied by the client (§18)"); "The person who counted cannot approve their own variance. Alternate approver applies when the approver is on leave (delegation)"; "Edit in Settings" (P-E15#thresholds) | API-M17-18 | DOCUMENTED BP §18.1–18.2, §12.6 | REQUIRES_DECISION (D-024, D-025) |

### 11.7 Tab `#reservations` — Reservations

| Element | Specification | → API | Label | Status |
|---|---|---|---|---|
| Stat tiles | Active holds (units · "reduce ATP only") · Expiring soon (released by job if unpaid) · Serial-specific holds · Payment-race exceptions (link to P-E01) | API-M06-24 | DOCUMENTED BP §9.2, §10.3, A05, A06 | REQUIRES_DECISION (D-026, D-031) |
| Active holds | "A reservation reduces available-to-promise, not physical on-hand · dispatch consumes it atomically"; channel segmented All · Website · WhatsApp · Assisted · Dealer · Branch POS; table **Hold · created** · **Order** (or draft/basket ref) · **Channel** · **SKU** · **Qty** · **Unit** (serial-specific or —) · **Location** · **Expires in** (live countdown; warning under a threshold) · **State** (Payment page open / UPI collect pending / Awaiting discount approval / Customer confirming address …) · actions **Extend** ("needs a reason · max 1 extension" — sample) · **Release** (ATP +n, audited) | API-M06-24 (`channel`, `state`); API-M06-25 (`extend` + reason / `release` + reason, Idem) | DOCUMENTED BP §9.2 ("Reservation expires/cancels"); extension MOCKUP (BR-M06-23) | REQUIRES_DECISION (D-026) |
| Expiry job runs | "Released by job · reservation-expiry · Runs every n min · skips holds with a payment in progress · idempotent per hold" (cadence sample); status badge; table **Run** · **Released** · **Skipped** · **Notes** (e.g. skipped due to pending UPI grace; late capture after release → exception with alternate unit or refund) | API-M06-24 `expiry_runs[]` (run detail API-M17-15) | DOCUMENTED A06, BP §10.3, T09 | REQUIRES_DECISION (D-026) |
| Recent releases | Table Hold · Order/quote · Reason (expired unpaid / cancelled by customer / manual release — dealer changed quantity / payment failed) · Actor · time | API-M06-24 `recent_releases[]` | DOCUMENTED BP §9.2 | NOT_STARTED |
| Hold durations by channel | "Sample policy · configurable in Automation": website checkout, UPI grace, WhatsApp draft, assisted/staff quote, dealer awaiting bank transfer, branch POS — all values samples; note "Extending a hold needs a reason and is limited to one extension; late payments after expiry re-reserve if stock is still available, otherwise raise an exception with refund path (T09)" | API-M06-24 `durations_by_channel`, API-M24-01 | DOCUMENTED BP §10.3; values D-026 | REQUIRES_DECISION (D-026, D-151) |

### 11.8 Tab `#supplier` — Supplier stock (freshness)

| Element | Specification | → API | Label | Status |
|---|---|---|---|---|
| Rule callout | "Supplier availability is never company stock. It is stored separately with its own timestamp, source, lead time and buffer, excluded from ATP, and shown to shoppers as 'Ships in n–m days · partner stock'. Company stock only increases through an authorised goods receipt" | — | DOCUMENTED BP §9.7, §11.3 | NOT_STARTED |
| Stale-feed handling | "Per-supplier freshness deadline (default n h — sample)"; three bands: **Fresh** (offer shows supplier lead time; can be promised with buffer) · **Stale** (hide immediate-delivery promise · "Confirm availability" — order held until supplier confirms) · **Expired** (offer suspended from sale · vendor and buyer notified · reactivates on next valid feed) | API-M24-01 (freshness rules) | DOCUMENTED BP §9.7 ("hide immediate-delivery promises, require confirmation, or suspend the offer"), A21, T14 | REQUIRES_DECISION (D-028) |
| Supplier feeds | "Now: {time}"; table **Supplier** (name · code · model · city) · **Feed** (API schedule / vendor portal (manual) / CSV upload) · **Offers** · **Last update** (+ age) · **Freshness** (Fresh / Stale / Not onboarded) · **Current policy** · action ("Request update" for stale → portal & email; "Log" for fresh) | API-M06-26; API-M06-27 (`request_update`, `suspend_offers`, `resume` + reason); API-M06-28 | DOCUMENTED BP §9.7, A21 (1B) | REQUIRES_DECISION (D-028) |
| Partner offers | "Company stock shown alongside for clarity — the two are never added together"; table **SKU** · **Supplier** · **Co. ATP** · **Supplier qty** · **Buffer** · **Lead time** · **Confirmed** (time) · **Freshness** (Fresh / Stale · n h / Expired · n h) · **Storefront promise** (e.g. "Ships in n–m days · partner stock", "Company stock shown; partner offer needs confirmation", "Partner offer suspended") | API-M06-26 `partner_offers[]` | DOCUMENTED BP §9.7, T14 | REQUIRES_DECISION (D-028, D-073) |
| Marketplace applicant row | "Marketplace applicant · no offers (Phase 2)" | — | LATER (D-046) | LATER |

### 11.9 Modal `m-transfer` — New stock transfer

Subtitle "Draft {id} · stock leaves source only when shipped".

| Field | UI control | Req | Validation (source) | API field |
|---|---|---|---|---|
| From | Select location | Y | User may request from this location | `from_location_id` |
| To | Select location | Y | ≠ From | `to_location_id` |
| Needed by | Date | N | Future date (D-124) | `needed_by` |
| Reason | Select: Replenish branch stock · Customer order {order} (collect in store) · Rebalance slow stock · Repair / RMA handling | Y | Reason catalogue D-139 | `reason` (+ `customer_order{order_id}`) |
| Note | Text | N | — | `note` |
| Lines | Table SKU (thumb, title, SKU) · ATP at source · Qty (stepper) · Value (cost — permitted roles) · remove; total value at cost; "Add line" (SKU picker) | Y (≥1 line) | Qty ≤ ATP at source at submission (API-M06-13) | `lines[{sku_id, qty, unit_ids[]?}]` |
| Approval callout | Within/above approval limit by value ("Branch manager can approve" / "Needs operations admin approval — value above the {sample} limit; approver; alternate") | — | Thresholds D-024; delegation D-025 | derived (202 approval) |

Foot: "Cancel" · "Save draft" · **"Submit for approval"** ("source stock unchanged until shipped") → API-M06-13
(`submit`), SKU picker via API-M04-15 / API-M06-03 (`q`); ATP via API-M06-04. Errors `409 STOCK_UNAVAILABLE`, `202
APPROVAL_REQUIRED`. DOCUMENTED BP §9.5. REQUIRES_DECISION (D-024, D-139).

### 11.10 Modal `m-reveal` — Reveal manufacturer serial

Text "Full manufacturer serials are masked by default. Revealing is logged with your name, time and reason".

| Field | UI control | Req | Validation (source) | API field |
|---|---|---|---|---|
| Reason | Select: Warranty claim with manufacturer · Police / insurance request · Customer verification (RMA) | Y | Reason list and reveal duration (MK "revealed for 60 s" — sample) per D-153 | `reason_code`, `reason_text` |

"Cancel" · "Reveal" → API-M02-31 (`object{type: serial_unit, id}`, `field: manufacturer_serial`) → `{value,
visible_until}`; audit entry reference shown. MOCKUP; BP §18.2 sensitive-field restrictions. REQUIRES_DECISION (D-153).

### 11.11 States, permissions, dependencies

| Aspect | Specification |
|---|---|
| L / E / X | Skeleton tables; empty states above; lookup "not found"; stock authority unavailable → page banner "Stock authority unavailable — figures may be stale; confirmations are blocked" (BP §10.3, §9.1) |
| S | Subtitle last movement + sync lag; web projection column shows its as-of; supplier freshness bands; reservation countdowns live per D-146 |
| Permissions | R-warehouse_staff: assigned locations — lookups, movements (read), counts (count/submit), transfers ship/receive, adjustment **requests**, re-grade/repair requests. R-branch_manager: branch scope — transfers, counts, approvals within threshold, reservations extend/release. R-ops_admin: all locations, supplier feeds, reservations. R-finance: values, variance value review, ledger. R-owner: high-value approvals. R-sales_support: read reservations and serial lookup (API-M06-24, API-M06-06); extend/release for own orders. R-catalog_staff: supplier feeds (API-M06-26/-27). Values at cost only for permitted roles; manufacturer serial masked (D-153); cross-branch visibility per D-029 |
| APIs | API-M02-31, API-M03-02, API-M04-15, API-M06-03, API-M06-04, API-M06-05, API-M06-06, API-M06-07, API-M06-08, API-M06-09, API-M06-11, API-M06-12, API-M06-13, API-M06-14, API-M06-15, API-M06-16, API-M06-17, API-M06-18, API-M06-19, API-M06-20, API-M06-21, API-M06-22, API-M06-23, API-M06-24, API-M06-25, API-M06-26, API-M06-27, API-M06-28, API-M13-15, API-M17-03, API-M17-04, API-M17-15, API-M17-18, API-M18-03, API-M24-01, API-M24-08 |
| Backend rules | BR-M06-01…23, BR-M03-03, BR-M02-17, BR-M13-03, BR-M13-09, BR-M17-07, BR-M24-03 |
| Entities | E-stock_position, E-stock_movement, E-reservation, E-serial_unit, E-serial_event, E-inspection, E-transfer, E-transfer_line, E-stock_count, E-stock_count_line, E-stock_adjustment, E-supplier_availability, E-reorder_rule, E-location, E-location_bin, E-supplier_rma, E-exception_case, E-approval_request, E-approval_threshold, E-configuration_version, E-job_attempt, E-audit_event |
| Related pages | P-E01 (payment-race exceptions), P-E03 (picks, short picks), P-E04 (quarantine, returns), P-E06 (catalog ATP), P-E09 (receipts, reorder suggestions), P-E11 (supplier freshness), P-E14 (jobs), P-E15 (thresholds) |
| CONDITIONAL / MOCKUP-ONLY / LATER | Supplier stock tab — 1B (A21, D-048); marketplace applicant — LATER (D-046); lot/batch — CONDITIONAL (D-126); consignment owner — D-128; blind counts and tolerance auto-accept — MOCKUP (D-069, D-024); ATP formula panel and "Try:" chips — D-171 |
| Tests | T04, T05, T09, T14, T15, T16, T17 |

---

## 12. Screen ↔ API matrix

✓ = called by the screen; → = reached through navigation to the owning screen (called there). Endpoint status and
contracts: `06-api.md`.

| API | shell | P-E01 | P-E02 | P-E03 | P-E04 | P-E05 | P-E06 | P-E07 | P-E08 |
|---|---|---|---|---|---|---|---|---|---|
| API-M02-01 me/context | ✓ | ✓ | | | | | | | |
| API-M02-06 sign out | ✓ | | | | | | | | |
| API-M02-04 / -05 / -07 / -08 / -16 / -17 sign-in, MFA challenge, password reset, invitation (pages outside MK, §3.3a) | ✓ | | | | | | | | |
| API-M02-09 / -12 / -13 / -14 / -15 password, MFA, security events | ✓ | | | | | | | | |
| API-M02-30 audit events | | | ✓ | | | | → | ✓ | |
| API-M02-31 sensitive reveal | | | | | | | | | ✓ |
| API-M03-02 locations | ✓ | ✓ | ✓ | ✓ | | | | | ✓ |
| API-M03-08 company | ✓ | | | | | | | | |
| API-M04-15 staff product list | | | | | | | ✓ | | ✓ |
| API-M04-16 create/duplicate draft | → | | | | | | ✓ | | |
| API-M04-17 … API-M04-23 editor, draft, discard, lifecycle, diff, reference data, brands | | | | | | | ✓ | | |
| API-M04-22 reference data (policies) | | | | | ✓ | | ✓ | | |
| API-M04-25 … API-M04-29 categories & templates | | | | | | | ✓ | | |
| API-M04-30 … API-M04-38 imports | → | | | | | | ✓ | | |
| API-M04-39 review queue | | | | | | | ✓ | | |
| API-M05-01 quote | | | ✓ | | | ✓ | | | |
| API-M05-10 … API-M05-23 pricing | | | | | | | | ✓ | |
| API-M06-03 stock positions | | | | | | | ✓ | | ✓ |
| API-M06-04 stock by location | | | ✓ | | | | ✓ | | ✓ |
| API-M06-05 serial units list | | | | | ✓ | | ✓ | | ✓ |
| API-M06-06 serial lookup | ✓ | | | | | | | | ✓ |
| API-M06-07 unit record | | | | | ✓ | | | | ✓ |
| API-M06-08 unit actions | | | | | | | | | ✓ |
| API-M06-09 inspection | | | | | ✓ | | | | ✓ |
| API-M06-10 data erasure | | | | ✓ | ✓ | | | | |
| API-M06-11 movements | | | | | | | | | ✓ |
| API-M06-12 … API-M06-17 transfers | | | | | | | | | ✓ |
| API-M06-13 create transfer | → | | ✓ | ✓ | | | | | ✓ |
| API-M06-18 … API-M06-22 counts & adjustments queue | | | | | | | | | ✓ |
| API-M06-19 start count/recount | | | | ✓ | | | | | ✓ |
| API-M06-23 request adjustment | | | | ✓ | | | | | ✓ |
| API-M06-24 / -25 reservations | | | | | | | | | ✓ |
| API-M06-26 / -27 / -28 supplier feeds | | | | | | | | | ✓ |
| API-M06-29 revert refresh | | | | | | | ✓ | | |
| API-M07-04 / API-M07-09 PO, receipt | → | | | | | | | | |
| API-M08-28 / API-M08-33 customer & account search | | | ✓ | | | | | | |
| API-M10-07 order detail | | | ✓ | ✓ | ✓ | | | | |
| API-M10-08 order list | | | ✓ | | | | | | |
| API-M10-09 cancellations | | | ✓ | | | | | | |
| API-M10-13 bulk actions | | | ✓ | | | | | | |
| API-M10-14 / -15 holds | | | ✓ | | | | | | |
| API-M10-16 order notes | | | ✓ | | | | | | |
| API-M10-17 reserve alternate | | ✓ | ✓ | | | | | | |
| API-M10-18 / -19 assisted order draft | → | | ✓ | | | ✓ | | | |
| API-M10-20 checkout link | | | ✓ | | | ✓ | | | |
| API-M10-21 confirm counter/bank transfer | | | ✓ | | | | | | |
| API-M10-23 replacement order | | | | ✓ | ✓ | | | | |
| API-M11-04 / -05 / -06 / -07 attempts, reconciliation, events | | | ✓ | | | | | | |
| API-M11-08 refunds list | | | ✓ | | ✓ | | | | |
| API-M11-09 refund request | | ✓ | ✓ | ✓ | | | | | |
| API-M11-10 / -11 refund transition, provider status | | | | | ✓ | | | | |
| API-M11-19 offline payment | | | ✓ | | | | | | |
| API-M12-03 … API-M12-15 fulfilment queue → handover | | | | ✓ | | | | | |
| API-M12-04 fulfilment detail | | | ✓ | ✓ | ✓ | | | | |
| API-M12-06 assignments | | | ✓ | ✓ | | | | | |
| API-M12-10 documents | | | ✓ | ✓ | ✓ | | | | |
| API-M12-17 shipment sync | | | ✓ | ✓ | | | | | |
| API-M12-18 delivery exception actions | | | | ✓ | | | | | |
| API-M13-01 / -02 eligibility, serial verification | | | | | ✓ | | | | |
| API-M13-03 create RMA | | | | | ✓ | → | | | |
| API-M13-04 … API-M13-16 RMA, warranty, supplier RMA | | | | | ✓ | | | | |
| API-M13-10 return/RTO receipt | | | | ✓ | ✓ | | | | |
| API-M13-15 supplier RMA draft | | | | | ✓ | | | | ✓ |
| API-M14-53 message vendor | | ✓ | | | | | | | |
| API-M14-54 submission review | | | | | | | ✓ | | |
| API-M16-02 … API-M16-19 support | | | | | | ✓ | | | |
| API-M17-01 approvals list | | ✓ | | | | | | ✓ | |
| API-M17-02 approval detail | | | ✓ | | | | ✓ | ✓ | |
| API-M17-03 approval decision | | ✓ | | | | ✓ | ✓ | ✓ | ✓ |
| API-M17-04 bulk decisions | | | | | | | | | ✓ |
| API-M17-05 / -06 exceptions | | ✓ | | ✓ | | | | | |
| API-M17-08 / -09 automation rules | | ✓ | | | | | ✓ | | |
| API-M17-15 / -16 job runs | | ✓ | ✓ | ✓ | | | | | ✓ |
| API-M17-18 approval thresholds | | | | | | | | | ✓ |
| API-M17-20 delegations (active) | | ✓ | | | | | | | |
| API-M17-21 create delegation | → | | | | | | | | |
| API-M17-25 / -26 owner digest | | ✓ | | | | | | | |
| API-M18-03 exports | | ✓ | ✓ | | ✓ | | ✓ | ✓ | ✓ |
| API-M18-12 owner dashboard | | ✓ | | | | | | | |
| API-M18-13 / -14 saved views | | | ✓ | | | | | | |
| API-M19-01 / -02 invoices | | | ✓ | ✓ | | | | | |
| API-M20-01 / -02 staff notifications | ✓ | | | | | | | | |
| API-M20-03 customer message (template) | | | ✓ | ✓ | ✓ | | | | |
| API-M20-04 delivery status | | | ✓ | | ✓ | ✓ | | | |
| API-M21-01 catalog search | | | ✓ | | | | | | |
| API-M21-03 workspace search | ✓ | | | | | | | | |
| API-M22-01 upload | | | | ✓ | ✓ | ✓ | ✓ | | |
| API-M22-02 private file view | | | | | ✓ | | | | |
| API-M22-04 URL image import | | | | | | | ✓ | | |
| API-M24-01 configuration read | | | | ✓ | ✓ | ✓ | | | ✓ |
| API-M24-08 system status (summary) | ✓ | ✓ | ✓ | ✓ | | | | | ✓ |

Differences from `06-api.md` §7.3 (for the API owner): P-E08 here does not call API-M06-30 (reorder-rule edit) or
API-M24-02 (configuration change) — the mockup only displays ROP and hold durations ("configurable in Automation");
P-E06 does not call API-M06-11. P-E01 does not call API-M10-08 or API-M20-03 directly (pipeline comes from
API-M18-12; customer messages are server effects of API-M10-17). Added consumers not in §7.3: API-M13-01/-02,
API-M11-11, API-M22-02, API-M04-22, API-M24-01 (P-E04); API-M08-28/-33, API-M06-04, API-M12-04 (P-E02); API-M17-20,
API-M24-08 (P-E01); API-M04-15 (P-E08 SKU picker).

## 13. Screen ↔ role matrix

F = full use of the screen/tab within record scope · A = listed actions only · R = read-only · — = no access ·
— * = role not listed in the 06-api authorisation of the underlying endpoints (confirm in
`07-auth-roles-permissions.md`). Monetary limits: D-024; role labels: D-222; cross-branch visibility: D-029.

| Screen / area | R-catalog_staff | R-warehouse_staff | R-sales_support | R-branch_manager | R-finance | R-ops_admin | R-owner |
|---|---|---|---|---|---|---|---|
| Shell (nav, search, notifications, profile/MFA) | F (filtered) | F (filtered) | F (filtered) | F (filtered) | F (filtered) | F | F |
| P-E01 Owner control centre | — | — | — | F (branch) | A (finance tiles/exceptions) | F | F |
| P-E02 list, drawer, holds, notes, cancellations | — | R (loc; fulfilment view, pick lists) | F (served/loc; refund request only) | F (branch) | A (payments tab, payment-review holds, bank-transfer match) | F | F |
| P-E02 `m-assisted` | — | — | F (discount within authority) | F | — | F | F |
| P-E03 pick · pack · dispatch | — | F (assigned loc) | A (delivery-exception contact, tracking sync) | F (branch; waves, assignment) | — | F | — * |
| P-E04 RMA queue & drawer | — | A (receive, inspect, erasure, disposition within authority; loc) | F (create, review, evidence, reverse pickup, refund request) | F (authorise beyond policy, assign, disposition) | A (refund decision) | F | F (overrides with audit) |
| P-E04 `#refunds` | — | — | R (own requests) | — * | F | R | F |
| P-E05 inbox, tickets | — | — | F | F | A (assigned tickets) | F | — * |
| P-E05 `#library` (answers, templates) | A (assigned tickets / answer owner) | — | A (answer drafts) | R | R | F (template submission) | — * |
| P-E06 products, editor, templates, import | F (assigned categories) | — | R | R | A (tax review) | F | F |
| P-E06 `#review` decisions | R (designated reviewer per D-081) | — | — | — | A (tax review) | F | F |
| P-E07 pricing (lists, tiers, promotions, controls) | — | — | A (read, simulate, request) | A (read, requests within delegated policy) | A (read, margin, floor change requests, review) | F | F |
| P-E07 approvals (`m-decide`) | — | — | — | A (within delegated policy) | A (review) | A (≠ requester) | F |
| P-E08 stock, serials, movements | — | F (assigned loc) | R (serial lookup) | F (branch) | R (values, ledger) | F | F |
| P-E08 transfers | — | A (ship/receive at loc) | A (order-driven request) | F (branch) | — | F | — * |
| P-E08 counts & variances | — | A (count, submit, request adjustment) | — | A (approve within threshold) | A (value review) | F | A (high-value approval) |
| P-E08 reservations | — | — | A (read; extend/release own orders) | F | — | F | — * |
| P-E08 supplier stock | A (feeds, request update) | — | — | R | — | F | — * |
| Manufacturer-serial reveal | — | A (per D-153) | A (RMA verification, D-153) | A | — | A | A |

Privileged roles (R-owner, R-ops_admin, R-finance and roles granting permission edits) require MFA before any screen
is usable (06-api §1.2 `STF`).

## 14. API gaps found

> **Resolved 2026-09-27:** every gap below is resolved in `06-api.md` §8 "Gap resolution" (new endpoint ID, existing endpoint, or rejected with reason). Use the API IDs from `06-api.md`; the local gap refs here are historical.

Operations the screens need that have no endpoint (or no field) in `06-api.md`. IDs are local to this file; the API
owner assigns `API-*` IDs if adopted.

| Gap | Screen | Action / need | Source | Notes / related decision |
|---|---|---|---|---|
| gap-1 | shell | Switch company / financial-year context (list selectable companies, set context) — API-M03-08 returns one company | MK `assets/tradex.js` `ws-org` (chevron) | Only if D-170 adopts a switcher; BP §3.3; D-045 |
| gap-2 | P-E02, P-E03 (has counts), P-E04, P-E05, P-E06, P-E07, P-E08 | Facet/tab counts for list views: saved-view counts (API-M10-08), RMA pipeline/state counts (API-M13-04), inbox status/channel counts (API-M16-04), ticket segment counts (API-M16-12), lifecycle chip counts (API-M04-15), price list/promotion counts (API-M05-10/-17), transfers/counts/reservations/stale-feed badges (API-M06-12/-18/-24/-26) | MK tab badges on every screen | Extend list responses with facet counts or add a counts query; refresh D-146 |
| gap-3 | shell | Sidebar navigation queue counts per module (badge + "hot") | MK `ERP_NAV` counts | Definition D-172; could reuse gap-2 counts |
| gap-4 | shell | Staff edits own profile/contact fields ("My profile") | MK user menu | Only if D-174 decides profile is editable |
| gap-5 | P-E02–P-E08 (P-E01 covered by API-M18-12) | KPI summary strips: orders (today, awaiting payment ₹ in reservations, needs action, overdue, cancel requests), fulfilment (due today, overdue, scan accuracy, next pickup), returns (open, quarantine, refunds pending, avg resolution, return rate), support (open chats, waiting, first response, bot-resolved %, SLA breaches, chat→orders, bot menu usage shares), catalog (published, drafts, awaiting review, needs changes, avg quality, suspended), pricing (active lists, dealer accounts, live promotions, below-floor asks, locked quotes, pending changes), inventory (enterprise totals, value at cost, expiring holds) | MK KPI strips | Per-screen summary endpoints, report keys on API-M18-02, or list aggregates; definitions D-173 |
| gap-6 | P-E02 `m-cancel` | Cancellation **preview**: per-line eligibility, allocated refund (discount/tax), reservation/stock effect and promotion effect **before** submitting API-M10-09 | MK:erp-orders.html m-cancel "Refund preview"; BP §8.4, §17.6, T34 | Dry-run flag on API-M10-09 or separate preview; promo effect D-082 |
| gap-7 | P-E02, P-E03, P-E04, P-E05, P-E06 | Assignable-staff lookup (users eligible for a task by role, location scope and permission) for hold owner, picker, RMA assignee, conversation/ticket assignee, reviewer filter — API-M02-20 is restricted to R-owner/R-ops_admin | MK selects "Owner", "Assign picker", "Assign…", "Assign to" | BP §12.5 assigned role/person; §13.4 owner |
| gap-8 | P-E02 `m-assisted`, P-E05 `m-basket` | (a) Staff product search returning context price (for the chosen customer) and per-location availability; (b) "Suggested for this customer"; (c) fulfil-from suggestion for a basket (single location that can fulfil every line) | MK:erp-orders.html m-assisted; BP §9.5 default rule, §13.2 | (a) composition of API-M21-01 + API-M05-01 + API-M06-04 is possible but not specified; (b) MOCKUP; (c) D-029 |
| gap-9 | P-E03 `#topack` | Bench/station status (packer, current order, device offline) | MK:erp-fulfilment.html#topack "Benches" | Only if D-147 integrates devices; MOCKUP |
| gap-10 | P-E07 `#promotions` | Promotion lifecycle actions: pause/resume/end/edit (MK shows "Paused · stock low" and audit "Live → Paused") — API-M05-18 only creates | MK:erp-pricing.html#promotions, #audit | D-043 |
| gap-11 | P-E07, P-E08 | Export datasets not enumerated in API-M18-03: quantity tiers (P-E07 "Quantity tiers (CSV)"), unit lifecycle (P-E08 "Export" on lifecycle); inspection report document for a unit/inspection (P-E08 "Full checklist") — API-M12-10 refs do not include inspection/unit | MK:erp-pricing.html Export menu; MK:erp-inventory.html#serials | D-152, D-111 |
| gap-12 | P-E08 `#serials` | Open a discrepancy case for a unit still in receiving (duplicate manufacturer serial on a GRN line) — API-M06-08 needs an existing `unit_id`; API-M17 has no staff "create exception" | MK:erp-inventory.html#serials duplicate state; BP §9.4, T15 | Could be raised by API-M07-09/-13 receipt validation instead |
| gap-13 | P-E08 `#counts` | Per-bin scan/lock during a count ("Scanning a bin locks it until the count is submitted"; per-bin "Scan") — API-M06-19/-20/-21 model the count, not per-bin start | MK:erp-inventory.html#counts | E-location_bin `state=frozen_for_count` exists; D-069 |
| gap-14 | P-E06 `#editor` SEO | Product redirect list in the editor aggregate (API-M04-17 `seo` has no redirects) | MK:erp-catalog.html#editor "Redirects" | E-seo_redirect; D-076 |
| gap-15 | P-E07 `m-decide` | "Notify requester and affected account managers" option — API-M17-03 has no notify field | MK:erp-pricing.html m-decide | Or server rule (requester always notified per 06-api §4.13) |
| gap-16 | P-E05 | Agent availability has three states in MK (Available · Busy · no new chats · Away); API-M16-19 defines available/away. Ticket categories in MK rows (Billing, Returns, Pricing, General) are not in E-support_ticket `category` nor the MK filter | MK:erp-support.html header, #tickets | D-074, D-139 |
| gap-17 | P-E03 `#ready` | Serviceability summary for parcels at booking ("n of m serviceable", PIN not served above a value, pickups moved to counter) — API-M12-01 is the public PIN check | MK:erp-fulfilment.html#ready | Could be part of API-M12-03/-11 responses; D-013 |
| gap-18 | P-E02 `d-order`, P-E04 `d-rma` | Open exceptions for one record (subject = order / RMA) to render per-record exception callouts — API-M17-05 filters (view, team, severity, type) have no subject filter and API-M10-07/API-M13-05 responses do not list linked exceptions | MK:erp-orders.html `od-alert` callouts; BP §12.5 (entity reference) | Add `subject` filter to API-M17-05 or embed linked exceptions in record reads |

## 15. Entity gaps found

> **Resolved 2026-09-27:** every gap below is resolved in `03-database.md` "Entity gap resolution (2026-09-27)". Use the entity/column definitions from `03-database.md`.

| # | Gap | Needed by | Source | Suggestion for `03-database.md` owner |
|---|---|---|---|---|
| EG-1 | E-notification has `channel enum{email, sms, whatsapp}` and no read state; the staff bell (API-M20-01/-02) needs an in-app channel and `read_at` per recipient | shell notifications | MK `assets/tradex.js` bell, "Mark all read" | Add in-app channel + read marker, or a separate staff-notification record |
| EG-2 | No record for **fulfilment scan events** ("Every scan is stored with user, device and time"); E-fulfilment_line only has `verification_state` | P-E03 scan log (API-M12-04 `scan_log[]`) | MK:erp-fulfilment.html#picking; BP §10.4 | Registry addition requested (§17 #2) or store as E-audit_event entries |
| EG-3 | **Parcels** within one fulfilment (parcel refs P1/P2, per-parcel booking idempotency key, "2 pcs" on one AWB) — E-fulfilment holds one tracking number and one booking key | P-E03 `#ready`, API-M12-11/-15 | MK:erp-fulfilment.html#ready; A13; T20 | Registry addition requested (§17 #1) or 1:1 if one parcel per fulfilment |
| EG-4 | **Supplier cost signal** state (open, drafted, dismissed + reason) — API-M05-22/-23 have no persisted signal | P-E07 `#approvals` | BP §8.4; MK:erp-pricing.html#approvals | Registry addition requested (§17 #3) |
| EG-5 | Support **agent availability** (API-M16-19 writes E-user_account; no field) | P-E05 header | MK:erp-support.html | Field on E-user_account or support-agent profile; D-074 |
| EG-6 | Product **data-quality score** shown in list/editor (API-M04-15 `quality_score`) has no column | P-E06 | MK:erp-catalog.html#products, #editor | Field on E-product/E-catalog_change_version (derived); formula D-173 |
| EG-7 | Warehouse **bench / device station** registry (packer bench, scale, bench camera, erasure station) | P-E03, P-E04 | MK:erp-fulfilment.html, erp-returns.html | Only if D-147 integrates devices (CONDITIONAL) |
| EG-8 | Per-user **UI preferences** (table columns; shell location scope persistence) | shell, P-E02 "Columns" | MK | Only if D-170 decides persistence; could extend E-saved_view |

## 16. Proposed new decisions (reserved range D-170–D-174)

| ID | Question | Documented options / proposal (source) | Blocks |
|---|---|---|---|
| D-170 | **Workspace context and per-user preferences.** (a) Does the workspace show a company / financial-year **switcher** (MK org card "Tradex Electronics Pvt Ltd · All locations · FY 2026-27" with chevron) or a fixed label? (b) What are the semantics of the shell **location-scope switcher** relative to the page-level location filters on P-E01, P-E02, P-E03 and P-E08 — global filter applied to every screen, default for page filters only, or removed in favour of page filters; is it persisted per user; is "All locations" offered to location-scoped roles? (c) Are per-user table **column choices** ("Columns" button, P-E02) persisted? | BP §3.3 "Start with the confirmed legal entities… Store those relationships explicitly"; multi-business later (R15, D-045); number of legal entities unknown (D-010); BP §3.1/§9.5 location scope and branch visibility (D-029); 02-architecture §9.2 "workspace location switcher" as record-scope dimension; MK shows both a shell switcher and page filters. Options: (a1) fixed company label, (a2) switcher if D-010 finds >1 entity; (b1) global scope, (b2) default for page filters, (b3) page filters only; (c1) not persisted, (c2) persisted per user (extends E-saved_view) | Shell §3.1 #2, §3.2 #2; filter defaults on P-E01, P-E02, P-E03, P-E08; gap-1; EG-8 |
| D-171 | **Explanatory panels and review aids inside mockup screens — product features or prototype aids?** Items: P-E07 "How every price is calculated" flow (badge "Proposed precedence · client sign-off pending"), "Edge cases" tab with Status and acceptance-test IDs (AT-PR-01 ✓…), "All-units vs graduated — worked example", "Blueprint illustration (§8.2)" table, simulator "Try:" presets; P-E08 "How available-to-promise is calculated" card and serial "Try:" chips; P-E06 "T36 acceptance checklist" panel; P-E03 "Simulate scan" quick codes | 00-conventions §1.1 classifies the prototype toolbar, annotations and hub page as review aids but does not cover in-page panels; 06-api §4.15 already classifies the "Acting as" selector as a prototype aid; BP §8.1 precedence is "proposed, not a settled client policy" (D-017); BP §24.2 asks for staff SOPs and an owner guide (help content). Options: (a) build as read-only in-product help sourced from live configuration (rule-set version, formula components); (b) omit as review aids; (c) keep explanations that display live configuration/values (price calculation steps, ATP components) and drop test IDs, BP citations and presets | P-E03 §6.4, P-E06 §9.4, P-E07 §10.1/§10.3/§10.4/§10.7, P-E08 §11.2/§11.3 |
| D-172 | **Sidebar navigation queue counts**: what each nav badge counts (MK: Orders, Pick·pack·dispatch, Returns & warranty, Support inbox (hot), Customers & dealers, Vendors), per whose scope, when a badge is "hot", and how often it refreshes | MK `assets/tradex.js` `ERP_NAV` (counts are samples); 02-architecture §4.3 "counts come from scoped queries"; BP §12.5 "Keep routine notifications in staff queues"; BP §18.2 least privilege; refresh D-146. Options: (a) count of the screen's "needs action" work queue within the user's scope; (b) count of all open items in scope; (c) count of SLA-breached/overdue items only (hot = any breach); (d) no counts | Shell §3.1 #4; gap-3 |
| D-173 | **KPI tile, score and summary definitions on workspace screens**: formulas, event dates, comparison baselines ("vs previous 30 days", "vs last Sat", "vs last week"), median vs p95, tax basis, freshness per tile, and which MOCKUP-only tiles are built (e.g. Scan accuracy, Bot-resolved %, First response, Avg data quality / product quality score, Chat → orders, Locked quotes, Staff time saved (est.), Return rate) | BP §4 defines some measures and methods (owner touches, stock accuracy, paid/approved → dispatched "median and p95", reliable automation, payment accuracy, delegation, condition-related returns) with consistent denominators and segmentation; BP §12.4 hours-saved formula; BP §14.4 event dates, gross/net, tax basis, freshness; BP §22.5 "For reports, include definitions and reconciled totals"; D-075 covers the report catalogue, not screen tiles. Options: (a) adopt BP §4 definitions and record the others in an approved KPI definitions register; (b) limit tiles to BP §4/§14.3 measures; (c) build as mockup with definitions set during UAT | KPI strips of P-E01–P-E08, API-M18-12 content, gap-5, EG-6 |
| D-174 | **Staff in-app help and "My profile"**: where the shell Help icon leads (MK: Settings page for staff, help centre for vendors) and what "My profile" shows/edits | BP §24.2 handover: staff SOPs, role walkthroughs (receipt, dispatch, return, approval, exception resolution) and an owner guide to the dashboard; own account data from API-M02-01; security from API-M02-09/-12/-13/-14/-15. Options: (a) Help opens a role-based SOP/walkthrough library; (b) Help links to P-E15 settings as in MK; (c) no in-app help in Phase 1; profile (p1) read-only own account + security, (p2) editable contact fields (needs API, gap-4) | Shell §3.2 #5, §3.3; gap-4 |

## 17. Registry additions requested

| # | Module | Entity | Label | Justification | Source |
|---|---|---|---|---|---|
| 1 | M12 | E-fulfilment_parcel | MOCKUP | Per-parcel reference used as the courier-booking idempotency key, AWB/label per parcel, multi-parcel fulfilments ("P1–P2 · 2 parcels"), handover per parcel ("Parcels the rider doesn't scan stay in Ready to ship") — E-fulfilment has one tracking number and booking key | MK:erp-fulfilment.html#ready; A13 "booking deduplication"; T20; 06-api §4.10 (`parcel_ref`) |
| 2 | M12 | E-fulfilment_scan | MOCKUP | Scan log with user, device, time, code, step and result, including rejected/unknown scans ("logged but change nothing") — needed for evidence and scan-accuracy measures | MK:erp-fulfilment.html#picking "Every scan is stored with user, device and time"; BP §10.4 |
| 3 | M05 | E-cost_signal | MOCKUP | Detected supplier cost change awaiting a decision (draft change / dismiss with reason); keeps the "never auto-reprice" rule auditable | BP §8.4 "Supplier changes cost"; MK:erp-pricing.html#approvals; API-M05-22/-23 |
| 4 | M12/M06 | E-device_station | CONDITIONAL | Registry of benches/devices (scanner, scale, bench camera, erasure station, label/document printers) — only if D-147 decides device integration | MK:erp-fulfilment.html (benches, scale, printer), erp-returns.html (erasure station); D-147 |

No page or role registry additions are requested (role labels are covered by D-222).

## 18. Inconsistencies noted (for the orchestrator)

| # | Observation | Where | Treatment in this file |
|---|---|---|---|
| 1 | `plan/README.md` lists 4b as `04-frontend-workspace-vendor.md`; the files are `04b-frontend-workspace-1.md` and `04c-frontend-workspace-2-vendor.md` | README | Reported only |
| 2 | 06-api §7.3 lists API-M06-30 and API-M24-02 for P-E08; the mockup P-E08 only displays ROP and sample hold durations | 06-api | §12 note |
| 3 | API-M16-19 statuses (available, away) vs three MK states; E-support_ticket categories vs MK ticket rows | 06-api, 03-database, MK | gap-16 |
| 4 | P-E01 "Net sales by channel" omits Assisted (staff) although the filter offers it | MK:erp-dashboard.html | §4.6 (include all channels) |
| 5 | Mockup samples disagree across screens (reservation hold 15 min on P-E08 vs 30 min on P-E02/P-E05; margin floor 6 % on P-E01/P-E02 vs 5/6/8/10 % table on P-E07) — all samples | MK | D-026, D-024 |
| 6 | P-E01 approvals list includes a "Marketplace seller application · Phase 2 pilot" item while marketplace is LATER and the launch vendor model is supplier (D-007, D-046) | MK:erp-dashboard.html | Labelled LATER |
| 7 | 06-api does not list R-owner for API-M12-03 (fulfilment queue), API-M16-04 (inbox) or API-M06-24 (reservations) | 06-api | "— *" in §13; confirm in 07-auth |
| 8 | MK shell Help icon links staff to Settings (`erp-admin.html`) | MK `assets/tradex.js` | D-174 |
| 9 | Order audit shows "viewed order · read access logged" — read logging of operational records is not documented; D-114 only covers audit-log mechanism | MK:erp-orders.html `od-time` | §5.4.4 → D-114 scope |
| 10 | Mockup nav/page labels differ from registry names (e.g. "Products" / "Products & catalog" for P-E06 Catalog & imports; "Settings & access" for P-E15) | MK vs 00-conventions §8 | Registry names used |
