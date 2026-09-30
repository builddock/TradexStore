# 16 — Testing strategy, suites and acceptance

**Purpose.** Defines how Tradex is verified: test layers, the suite catalogue (`TS-<area>-##`), the BP critical
acceptance suite T01–T36 and when each becomes runnable, UAT, the go-live checklist, the definition of ready/done for
tasks, and how results are recorded in `TASKS.md` / `STATE.md`. Future sessions use this file to decide which tests a
task must add and run (`14-continuation-protocol.md` steps 16–17).

**Sources used.** BP §4, §5.1, §6.3–6.8, §7.4, §8, §9, §10.1–10.6, §11, §12.3–12.5, §13.4, §14.4, §15.3, §16.3–16.6,
§17.4–17.6, §18, §19.1–19.3, §20.1–20.5, §21.2–21.4, §22.2, §22.5, §23.1–23.4, §24.1–24.3, §27.2, §29 · PR2 §9, §12 ·
PR1 §14 · MK (states, samples) · plan files `00-conventions.md`, `01-tech-stack.md` §25, `02-architecture.md` §24–25,
`03-database.md` §4–§8, `05-backend.md` (module tests), `06-api.md`, `07-auth-roles-permissions.md` §16,
`14-continuation-protocol.md`, `STATE.md`.

**Labels / status.** Evidence labels and status values per `00-conventions.md` §2–§3. Suites are `NOT_STARTED`
unless marked `REQUIRES_DECISION (D-xxx)` or `LATER`. **Tools and frameworks for every suite are REQUIRES_DECISION
(D-053)** — nothing here selects a tool; accessibility scope D-051; CI provider D-077; observability D-052.

**ID scheme.** Suites `TS-<area>-##` (`00-conventions.md` §5); cases inside a suite `<suite>.<n>` (e.g.
`TS-PERM-02.4`). Areas: UNIT, SVC, FE, API, DB, INT, AUTH, PERM, ECOM, VEN, MKT, ERP, ADM, E2E, ERR, SEC, A11Y, PERF,
BKP, MIG, REG, PROOF. (The `TS-INV-04` example in `00-conventions.md` §5 is illustrative; inventory suites are
`TS-ERP-01…08`.) BP acceptance tests keep their IDs `T01…T36`.

---

## 1. Principles

| # | Principle | Source |
|---|---|---|
| P1 | Prioritise **money, inventory, access boundaries and recovery**; do not spend the same effort on a cosmetic label as on a duplicate refund | BP §23.2 |
| P2 | Acceptance proves business correctness, not visual completion; an attractive demo is not proof that stock or money reconcile | PR2 §12; BP §23.3 |
| P3 | The critical suite applies to the release containing each feature; Phase 1 verifies complete web e-commerce and ERP workflows on agreed desktop/laptop browsers; mobile-specific testing (T29) is Phase 2 and not a Phase 1 gate | BP §23.1 phase applicability |
| P4 | Integrations are tested for timeout, duplicate event, reconciliation and manual recovery; reports for definitions and reconciled totals; UI for loading, empty, error, desktop/laptop viewport and accessibility states | BP §22.5 |
| P5 | Developers are not the sole approvers of business correctness; client representatives execute UAT | BP §23.3 |
| P6 | Releases require automated critical tests and staging verification | BP §20.5 |
| P7 | A test that cannot run (missing tool/environment/decision) leaves its task not `COMPLETED` | `14-continuation-protocol.md` step 16 |
| P8 | Tests never encode an undecided business value as if it were approved: undecided thresholds, windows, durations and rates are **test fixtures**, never seed defaults (`03-database.md` §6 "no value is invented in seeds") | BP §18.1 "Do not invent ₹ limits"; `00-conventions.md` §2 |
| P9 | Production personal data never enters development fixtures; only approved masked extracts elsewhere | BP §19.3 · D-136 |
| P10 | Test traffic and duplicate events are excluded from business metrics | BP §4 |

---

## 2. Test layers → suite areas (BP §23.2; PR2 §12)

| BP / PR2 layer | Suite areas | Code location (`00-conventions.md` §11) | Phase |
|---|---|---|---|
| Focused unit tests: pricing, permissions, transitions, money, reservation rules | TS-UNIT, parts of TS-FE | Next to the code in `backend/<module>/`, `frontend/<app>/`, `frontend/design-system/` | 1A |
| Integration tests for ERP/provider interfaces | TS-SVC, TS-API, TS-DB, TS-INT, TS-AUTH | `backend/` (module and adapter tests) | 1A/1B |
| Concurrency tests for stock | TS-ERP-01, TS-ERP-07, TS-DB-03, TS-PERF-04 | `backend/inventory/`, `tests/load/` | 1A |
| Small set of end-to-end critical customer/staff journeys | TS-E2E, T01–T36 automation | `tests/e2e/`, `tests/acceptance/` | 1A/1B |
| Desktop/laptop browser UI | TS-FE, TS-FE-07 | `frontend/*`, `tests/e2e/` | 1A |
| Accessibility | TS-A11Y | `tests/a11y/` | 1A |
| Load | TS-PERF | `tests/load/` | 1A |
| Security | TS-PERM, TS-SEC, TS-AUTH | `backend/identity/`, `tests/security/` | 1A |
| Restore | TS-BKP | `tests/restore/`, `infra/` runbooks | 1A |
| Migration rehearsal | TS-MIG | `backend/migration/`, `tests/migration/` | 1A |
| Platform proof (Phase 0, WP04) | TS-PROOF | proof workspace per candidate (not `main`) | 0 |
| Real mobile device / app | T29 only | — | 2 (LATER, D-085) |

`tests/` sub-folders above (`acceptance/`, `e2e/`, `load/`, `a11y/`, `security/`, `restore/`, `migration/`, `uat/`) are
this plan's layout under D-054 (folder names delegated to the plan); their internal structure follows the D-053 tools.

---

## 3. Environments and test data

### 3.1 Environments (`02-architecture.md` §24.1; BP §16.6, §20.5)

| Environment | Suites run there | Data allowed | Source |
|---|---|---|---|
| Developer / CI | UNIT, SVC, API, DB, AUTH, PERM, FE, ERR (provider fakes) | Synthetic fixtures only | BP §19.3; PR1 §14 |
| Staging | INT (provider sandboxes), E2E, acceptance T01–T36, A11Y, PERF, SEC, BKP rehearsal, MIG rehearsals, UAT | Synthetic or **approved masked extracts** (D-136); representative volumes (D-010) | BP §16.6, §20.5, §23.3 · D-136 |
| Production | Post-release smoke checks, synthetic availability checks (TS-PERF-07), supervised verification transactions after cutover (BP §21.3 step 9) | Live — only through D-209 procedure | BP §20.1, §21.3 · D-209 |
| Separate UAT / other | — | — | REQUIRES_DECISION (D-077) |

### 3.2 Test data rules

| # | Rule | Source |
|---|---|---|
| TD1 | Default fixtures are synthetic and generated by scripts in `backend/` (seed/fixture scripts) or `tests/`; no real customer, vendor or staff personal data | BP §19.3 |
| TD2 | Masked extracts only when approved; masking covers PD1/PD2/PD3/PD-R fields (`03-database.md` §1.7, §9.2); approver and masking rules per D-136 | BP §19.3 · D-136 |
| TD3 | Fixture packs mirror the entity groups DB-G0…G10 (`03-database.md` §4) and include: every role and sub-role account (`07-auth-roles-permissions.md` §4), ≥2 business accounts, ≥2 vendors (T11), ≥2 locations (branch + warehouse), serialised refurbished units with inspection evidence, fungible SKUs with tiers | BP §15.3 proof data; T02, T05, T11 |
| TD4 | Undecided policy values are supplied by the test as named fixtures (e.g. `TEST_THRESHOLD_*`), never read from production seeds | P8 |
| TD5 | Provider tests use provider sandboxes only (payment, shipping, WhatsApp, email/SMS, accounting file targets) with separate credentials | BP §10.6, §19.1 · D-012…D-015, D-011 |
| TD6 | Load and performance data use representative volumes: active SKUs, serialised units, images, daily/peak orders, concurrent shoppers, branch transactions, import batch size, staff sessions, message volume, report size (BP §20.2) | D-010, D-207 |
| TD7 | UAT uses representative data agreed with the client; screenshots and evidence must not contain unmasked personal data | BP §23.3, §19.3 |
| TD8 | Tests that create orders/payments in staging are flagged as test traffic and excluded from report/metric assertions except where the report itself is under test | BP §4 |

---

## 4. Cadence, gates and entry/exit criteria

| Code | When | What runs | Entry | Exit (pass criteria) | Source |
|---|---|---|---|---|---|
| C | Every change in CI (provider D-077) | UNIT, SVC, API, DB, AUTH, PERM (fast subset), FE unit | Code compiles; migrations apply to an empty DB | All pass; no skipped test without a recorded reason | BP §20.5 |
| T | Task completion (DoD §15) | Suites listed in the task + TS-REG-02 for touched modules | Task implementation done | All listed suites pass; evidence recorded (§16) | BP §22.5; protocol steps 16–17 |
| S | Stage exit (`12-phases.md`) | All suites of the stage's modules; acceptance T-tests that became runnable (§6); TS-REG-01 | All stage tasks `COMPLETED` | All pass; T-tests recorded in `STATE.md` §11 | BP §22.1 |
| R | Release candidate on staging | TS-REG-01, E2E, INT (sandboxes), SEC (automated), A11Y (scope D-051), PERF (where targets decided) | Candidate deployed to staging with migration plan | All critical pass; staging verification signed; release notes | BP §20.5 |
| G | Go-live / phase gate | Go-live checklist §14, UAT §13, TS-BKP-02, TS-MIG-06/07, TS-SEC-12 (if D-208) | UAT complete | BP §23.4 items evidenced; no unresolved critical defects | BP §5.1 exit gates, §23.4 |
| P | Periodic | TS-BKP-04 restore rehearsal, TS-PERF-07 availability, TS-SEC-08 dependency review, TS-ADM-09 access review, TS-REG-03 upgrade regression | Schedule (values D-108, D-035) | Evidence stored; findings to Known issues | BP §20.1, §24.3 |

Severity of defects found in any run uses the support severity scale (BP §24.1 Critical/High/Medium/Low examples;
definitions **D-035**). Go-live rule: "No unresolved critical defects; other known issues have explicit acceptance and
workaround" (BP §23.4).

---

## 5. Suite catalogue

Columns: **When** codes from §4 · **Data** `SYN` synthetic, `MSK` approved masked extract (D-136), `SBX` provider
sandbox, `REP` representative volume (D-010), `PRD` production verification (D-209) · **Tools** always
REQUIRES_DECISION (D-053) plus any listed decision · **Entry → Exit** suite-specific criteria in addition to §4.
Module behaviour and business rules referenced as `BR-M##-##` are in `05-backend.md`.

### 5.1 Unit — TS-UNIT (location: next to code)

| ID | Scope — verifies (source) | Modules · APIs · screens | When | Entry → Exit | Data | Tools | Status |
|---|---|---|---|---|---|---|---|
| TS-UNIT-01 | Pricing engine: 8-step sequence each branch, contract/dealer/public precedence, tiers (all-units vs graduated), stacking, expired list never zero, margin-floor routing, quantity/location change repricing (BP §8.1–8.4; BR-M05-01…20) | M05 · API-M05-01 engine | C, T | PricingEngine exists → every precedence branch covered | SYN | D-053 | REQUIRES_DECISION (D-017, D-018) |
| TS-UNIT-02 | Money & tax arithmetic: fixed decimal/minor units, line allocation of discounts and tax, refunds reuse original allocation (BP §8.1, §8.4; BR-M05-02, -13) | M05, M10, M11, M13 | C, T | → no floating-point money path | SYN | D-053 | REQUIRES_DECISION (D-104, D-016) |
| TS-UNIT-03 | AccessPolicy: key × role × scope evaluation, property allow-lists, SoD predicates, deny-by-default (`07` §5–§8, §15) | M02 · all keys | C, T | Matrix seeded as test data → every §5 cell asserted | SYN | D-053 | NOT_STARTED |
| TS-UNIT-04 | State machines: order, payment attempt, refund, fulfilment, RMA, product lifecycle, vendor submission, transfer, approval — every legal transition passes, every illegal one rejected; captured never downgraded (BP §10.1, §7.3, §10.3) | M04, M06, M10–M14, M17 | C, T | Transition tables → 100 % of table rows asserted | SYN | D-053 | REQUIRES_DECISION (D-150) for undocumented transitions |
| TS-UNIT-05 | ATP & reservation rules: formula, excluded dispositions, serial vs quantity reservation, expiry, extension-with-reason (BP §9.2, §9.4; BR-M06-02, -05, -06, -07, -23) | M06 | C, T | → formula cases incl. zero floor | SYN | D-053 | REQUIRES_DECISION (D-026, D-027, D-031) |
| TS-UNIT-06 | Idempotency records: same key + same payload → stored result; different payload → conflict; scope caller+operation (BP §10.3, §17.5) | M10, M11, M12, M07, M19 | C, T | → all `Idem` operations use it | SYN | D-053 | REQUIRES_DECISION (D-079) |
| TS-UNIT-07 | Validation: typed attributes, import-row checks, GSTIN format, address/PIN, upload type/size (BP §7.2, §7.4, §8.3; `03-database.md` §8.2) | M04, M08, M22 | C, T | → each rule has pass/fail case | SYN | D-053 | NOT_STARTED |
| TS-UNIT-08 | Policy evaluation: return/DOA/warranty eligibility by policy version in force at purchase (BP §7.5, §10.5; BR-M13-13) | M13 | C, T | → version v2 order evaluated under v2 after v3 | SYN | D-053 | REQUIRES_DECISION (D-022) |
| TS-UNIT-09 | Mapping tables: carrier status → canonical fulfilment state (raw preserved); provider events → payment transitions (BP §10.2, §10.5) | M11, M12, M23 | C, T | → every mapped status | SYN | D-053 | REQUIRES_DECISION (D-012, D-013) |
| TS-UNIT-10 | Approval routing: threshold × role × delegation resolution, deadlines, single escalation (BP §18.1–18.2, §12.6; A16) | M17 | C, T | Fixture thresholds (P8) → all branches | SYN | D-053 | REQUIRES_DECISION (D-024, D-025) |
| TS-UNIT-11 | Report definitions and export formatting: distinct event dates, gross/net, tax-inclusive/exclusive labels, CSV formula neutralisation (BP §14.4) | M18 | C, T | → each launch report definition | SYN | D-053 | REQUIRES_DECISION (D-075) |

### 5.2 Backend service — TS-SVC (location: `backend/<module>/`)

| ID | Scope — verifies (source) | Modules · APIs · screens | When | Entry → Exit | Data | Tools | Status |
|---|---|---|---|---|---|---|---|
| TS-SVC-01 | Transaction boundaries TX-1…TX-10 are atomic; fault injection inside each → no partial effect (BP §16.3; `05-backend.md` §1.2) | M06, M07, M10–M13, M17 | C, T | Core selected (D-001) → every TX has a failure case | SYN | D-053 | REQUIRES_DECISION (D-001) |
| TS-SVC-02 | Outbox and durable jobs: intent recorded in the business transaction; worker crash after send/before save → reconciled, no duplicate; scanner closes enqueue gap; retry cap → one exception (BP §16.3; A38; BR-M17-10, -11) | M17, M11, M12, M19, M20 | C, T | → kill-worker cases pass (T21) | SYN | D-053 | NOT_STARTED |
| TS-SVC-03 | Audit writing: every action in `07` §11 writes E-audit_event in the same transaction with reason where required; sample transaction reconstruction (BP §17.3, §20.1) | M02 + all | C, T | → reconstruction of one order, one adjustment, one refund, one permission change | SYN | D-053 | NOT_STARTED |
| TS-SVC-04 | Configuration versions: effective dates, approval where required, secrets never returned by any API (BR-M24-01…03) | M24 · API-M24-01/02/05 | C, T | → secret-leak scan of all responses | SYN | D-053 | NOT_STARTED |
| TS-SVC-05 | Notification dispatch: approved transitions only, consent per channel/purpose, templates, frequency caps, delivery failure keeps order valid and is visible (BP §12.2 A14, §13.3, §10.3; BR-M20-01…06) | M20, M16 · API-M20-03/04 | C, T | → opt-out case (T25) | SYN | D-053 | REQUIRES_DECISION (D-058) |
| TS-SVC-06 | Exceptions: entity ref, severity, age, owner, due time, evidence, allowed actions, escalation path, resolution reason; one per job+entity; escalate once (BP §12.5; A16; BR-M17-03, -12) | M17 · API-M17-05…07 | C, T | → all exception types | SYN | D-053 | REQUIRES_DECISION (D-138) |
| TS-SVC-07 | Automation template & kill switch: rule cannot run without completed BP §12.3 template; disable leaves pending work recoverable; automation actor cannot approve (BR-M17-01, -15; `07` §15 E12) | M17 · API-M17-08…17 | C, T | → each launch automation (D-078) | SYN | D-053 | REQUIRES_DECISION (D-078) |
| TS-SVC-08 | Files & media: type/size limits, private vs public class, authorised download, optimised variants, orphan cleanup (BP §7.4, §15.4, §19.1; BR-M22-01…05) | M22 · API-M22-01…04 | C, T | → private file never served without check | SYN | D-053 | REQUIRES_DECISION (D-033, D-113) |
| TS-SVC-09 | Search/cache projections: approved change invalidates projections with version/timestamp; private prices never indexed; checkout revalidates (BP §16.5; BR-M21-03, -06; BR-M04-20) | M21, M04, M09 | C, T | → stale projection detectable | SYN | D-053 | REQUIRES_DECISION (D-105, D-032) |
| TS-SVC-10 | Report/export jobs: row limits, expiring audited downloads, restricted columns, job isolation from checkout (BP §14.4, §20.2) | M18 · API-M18-03…05 | C, T | → export audit record per download | SYN | D-053 | REQUIRES_DECISION (D-152) |
| TS-SVC-11 | Scheduled jobs: reservation expiry (A06), challenge/invitation expiry, delegation start/end, approval deadlines, dealer approval expiry reminders | M06, M02, M17, M08 | C, T | → time-travel cases | SYN | D-053 | REQUIRES_DECISION (D-026, D-025) |
| TS-SVC-12 | Presence derivation and work-item events: server-derived active / idle / offline from heartbeats, self-set break / away, area and work-item tags on audit events, idempotent work-item events, retention, nothing stored when the capability is off (CF1 §2; D-282) | M02 · API-M02-43 · E-staff_presence_interval, E-work_item_event, E-audit_event | C, T | Fixture idle threshold → cases 12.1–12.5 (§19) | SYN | D-053 | REQUIRES_DECISION (D-283) |
| TS-SVC-13 | Staff alert evaluator: each rule fires exactly at its threshold and names rule, threshold, person, record and time; rule off stops new alerts and keeps history; acknowledge audited; no alert storms; staff work never blocked (T-1A.14-M17-13) | M17 · API-M24-18…20 · E-staff_alert_rule, E-staff_alert | C, T | Fixture thresholds → cases 13.1–13.5 (§19) | SYN | D-053 | REQUIRES_DECISION (D-283) |

### 5.3 Frontend / component — TS-FE (location: `frontend/*`)

| ID | Scope — verifies (source) | Modules · APIs · screens | When | Entry → Exit | Data | Tools | Status |
|---|---|---|---|---|---|---|---|
| TS-FE-01 | Design-system components: loading/empty/error states, focus visibility, labels, non-colour status indicators (BP §6.7, §22.5) | M09 · `frontend/design-system/` | C, T | Tokens approved (D-049) → every component state | SYN | D-053, D-103 | REQUIRES_DECISION (D-049) |
| TS-FE-02 | Storefront screens P-S01…P-S13 + store shell: important states of BP §6.3 (slow connection, no results, price changed, stock shortage, failed payment, expired reservation, duplicate submission, verification pending, partial shipment, refund pending, outside policy, serial mismatch, dealer pending/rejected/suspended/expired, outside hours, bot failure) | M09 · P-S01…P-S15 | C, T | → each BP §6.3 state per screen | SYN | D-053 | REQUIRES_DECISION (D-003, D-049) |
| TS-FE-03 | Workspace screens decided "custom" under D-004: queues, filters, saved views, bulk actions with per-item results, scan stations | P-E01…P-E16 | C, T | → per-screen states | SYN | D-053, D-101 | REQUIRES_DECISION (D-004) |
| TS-FE-04 | Vendor portal P-V01…P-V04: submission forms with inline validation, batch results, availability updates, statements | M14 · P-V01…P-V05 | C, T | → per-screen states | SYN | D-053, D-101 | NOT_STARTED |
| TS-FE-05 | Buyer context & permission rendering: guest/consumer/dealer differences (`07` §12.1); private data purged from client caches on sign-out; UI hints from API-M02-01 only; hidden ≠ authorised (T02, T22; `07` §15 E15) | M09, M02 | C, T | → sign-out purge case | SYN | D-053 | NOT_STARTED |
| TS-FE-06 | API error-code rendering: every `06-api.md` §1.7 code has an accurate user state (PRICE_CHANGED explicit acceptance, STOCK_UNAVAILABLE with available qty, RESERVATION_EXPIRED, APPROVAL_REQUIRED, PROVIDER_PENDING) — no false success (BP §6.3 Confirmation) | all apps | C, T | → each code | SYN | D-053 | NOT_STARTED |
| TS-FE-07 | Browser matrix: key flows on agreed desktop/laptop browsers (BP §6.7 step 8, §23.4) | all P-* | R | Browser list decided → all key flows | SYN | D-053 | REQUIRES_DECISION (D-206) |
| TS-FE-08 | Double-submit & retry UX: one idempotency key per user intent reused on retries; disabled repeat submit; payment status polling shows server-verified state (BP §10.3, §17.5) | P-S07, P-S08, P-E02 | C, T | → network-retry case | SYN | D-053 | REQUIRES_DECISION (D-079, D-146) |
| TS-FE-09 | P-E17 Team & activity and P-E18 Analytics: every section, tab, drawer tab, modal and state of `04c` §22–§23; one filter row drives every section; area rows match their own screens; table view on every chart; help keys resolve (CF1 §2, §3) | M24, M18 · API-M24-15…20, API-M18-20 · P-E17, P-E18 | C, T | Screens built → cases 09.1–09.9 (§19) | SYN | D-053, D-101 | REQUIRES_DECISION (D-004, D-283, D-286) |

### 5.4 API / contract — TS-API (location: `backend/` API tests)

| ID | Scope — verifies (source) | Modules · APIs · screens | When | Entry → Exit | Data | Tools | Status |
|---|---|---|---|---|---|---|---|
| TS-API-01 | Contract conformance of every endpoint: request, validation, response, errors (`06-api.md` §3–§4) | all 492 API IDs | C, T | Endpoint implemented → contract cases incl. `std` errors | SYN | D-053 | REQUIRES_DECISION (D-080) |
| TS-API-02 | Error envelope: stable codes, correlation id, no internal detail, HTTP mapping (`06-api.md` §1.7) | all | C | → every code emitted somewhere | SYN | D-053 | REQUIRES_DECISION (D-080) |
| TS-API-03 | Idempotency contract on every `Idem` endpoint: replay → same result; different payload → `409 IDEMPOTENCY_CONFLICT`; key transport (`06-api.md` §1.5; T06) | API-M10-06, API-M11-01, -09…-12, API-M07-09, -13, API-M06-15, -16, -23, API-M12-09, -11, -15, API-M13-10, API-M19-07, … | C, T | → each `Idem` endpoint | SYN | D-053 | REQUIRES_DECISION (D-079) |
| TS-API-04 | Optimistic concurrency: stale `expected_version` → `409 VERSION_CONFLICT` (`06-api.md` §1.6) | API-M17-03, API-M05-13, API-M04-18, API-M02-22, … | C, T | → each versioned mutation | SYN | D-053 | REQUIRES_DECISION (D-080) |
| TS-API-05 | Lists: pagination/filter/sort; filters intersected with caller scope before paging (`06-api.md` §1.9) | all list endpoints | C, T | → scope-leak cases | SYN | D-053 | REQUIRES_DECISION (D-080) |
| TS-API-06 | Webhook ingestion: raw-body signature before parsing; persist + dedup on provider event id; duplicate → no effect; out-of-order → legal transitions only; fast acknowledgement (`06-api.md` §1.8; T07, T08) | API-M11-03, API-M12-16, API-M16-10, API-M20-05 | C, T | → duplicate, reversed, forged | SYN, SBX | D-053 | REQUIRES_DECISION (D-012, D-013, D-014, D-015) |
| TS-API-07 | Caching headers: personalised responses `private, no-store`; public catalog cacheable (`06-api.md` §1.11; T22) | API-M04-03, API-M05-*, API-M09-01, API-M10-*, `/v1/me/*` | C | → every CUS/GAT/LNK response | SYN | D-053 | NOT_STARTED |
| TS-API-08 | Long-running work: `202` + job reference, status endpoint, expiring downloads (`06-api.md` §1.12) | API-M04-30, API-M18-03/05, API-M11-13, API-M19-03 | C, T | → each job endpoint | SYN | D-053 | NOT_STARTED |
| TS-API-09 | BP §17.4 documented contracts and their core guards (`06-api.md` §7.1: search, offers, quote, place order, read order, cancel lines, request return, vendor submission, review decision, receive goods, payment webhook, shipping webhook) | 12 contracts | T, S | → each guard of BP §17.4 table | SYN | D-053 | NOT_STARTED |
| TS-API-10 | Server-derived context: every field of `06-api.md` §1.4 is ignored/recomputed on every endpoint that could receive it (T10) | API-M05-01, API-M10-06, API-M04-03, API-M11-09, API-M14-06 | C, T | → each field × endpoint | SYN | D-053 | NOT_STARTED |

### 5.5 Database — TS-DB (location: `backend/` migration tests)

| ID | Scope — verifies (source) | Modules · APIs · screens | When | Entry → Exit | Data | Tools | Status |
|---|---|---|---|---|---|---|---|
| TS-DB-01 | Migrations DB-G0…G10 apply in order on empty DB and on the previous release; reversible where declared; later groups only add nullable references (BP §20.5; `03-database.md` §4, §7.2) | all | C, S | Group schema → apply + rollback | SYN | D-053 | REQUIRES_DECISION (D-001) |
| TS-DB-02 | Constraints and uniqueness (I-01 keys, active-serial uniqueness, member uniqueness, one accounting mapping per document/version) (`03-database.md` §2, §5.1) | all | C, T | → each unique/check constraint | SYN | D-053 | REQUIRES_DECISION (D-001) |
| TS-DB-03 | Invariants I-01…I-10 (BP §17.6) as randomised operation sequences: no duplicate effect, no negative sellable allocation, no double-shipped serial, movements reconcile, refunds ≤ captured, private prices isolated, snapshots preserved, unapproved content not purchasable, one export mapping, overrides traced | M05, M06, M10–M14, M19 | C, S | → 10 invariants hold over generated histories | SYN | D-053 | NOT_STARTED |
| TS-DB-04 | Append-only ledgers: updates/deletes of E-stock_movement, E-serial_event, E-payment_event, E-shipment_event, E-integration_event, E-job_attempt, E-audit_event, E-consent_record rejected; corrections are reversing records (BP §9.6; `03-database.md` §1.5) | M02, M06, M11, M12, M17, M08 | C | → each ledger | SYN | D-053 | REQUIRES_DECISION (D-114) for audit mechanism |
| TS-DB-05 | Seeds S-01…S-20 load only decided values; placeholder/sample values rejected; schema validation (`03-database.md` §6) | all | S | → seed lint passes | SYN | D-053 | REQUIRES_DECISION (per seed decision) |
| TS-DB-06 | Personal-data classification and retention hooks: PD fields tagged; anonymisation keeps statutory records; deletion workflow separates profile from transactions (BP §19.3; `03-database.md` §9) | M08, M02, M16 | S | → each retention class | SYN | D-053 | REQUIRES_DECISION (D-036, D-060) |
| TS-DB-07 | Stock reconciliation: Σ movements = positions; ATP recomputation equals projection (BP §9.2, §17.6 I-04) | M06 | C, S | → zero drift after load run | SYN, REP | D-053 | NOT_STARTED |
| TS-DB-08 | Types: no floating money columns; timestamps and business dates per decisions (D-104, D-124) | all | C | → schema scan | SYN | D-053 | REQUIRES_DECISION (D-104, D-124) |

### 5.6 Integration adapters — TS-INT (location: `backend/integrations/`; staging sandboxes)
Every adapter case set includes **timeout, duplicate event, out-of-order event, reconciliation and manual recovery**
(BP §22.5, §16.4).

| ID | Scope — verifies (source) | Modules · APIs · screens | When | Entry → Exit | Data | Tools | Status |
|---|---|---|---|---|---|---|---|
| TS-INT-01 | Payment adapter: signed webhooks, duplicate (T07), out-of-order (T08), capture after expiry (T09), status query, pending reconciliation, refund create/timeout/query (T18, T19), provider down (BP §10.2–10.3, §10.6) | M11, M23 · API-M11-01…12, P-E12 | T, S, R | Provider + sandbox (D-012) → all T-cases | SBX | D-053 | REQUIRES_DECISION (D-012) |
| TS-INT-02 | Shipping adapter: serviceability, booking dedup, lost booking response (T20), labels, tracking duplicate/out-of-order with raw status preserved, manual booking fallback, reverse pickup (BP §10.4–10.5, §16.4) | M12, M13, M23 · API-M12-01, -11…-17, API-M13-09 | T, S, R | Provider (D-013) → all cases | SBX | D-053 | REQUIRES_DECISION (D-013) |
| TS-INT-03 | WhatsApp: inbound dedup, 24-hour window & approved templates, delivery status, opt-out (T25), human handoff (T24), identity linking only after verification (BP §13.1–13.4) | M16, M20, M23 · API-M16-07, -10, API-M16-18 | T, S, R | Provider (D-014) → all cases | SBX | D-053 | REQUIRES_DECISION (D-014) |
| TS-INT-04 | Email/SMS/OTP: delivery status, retry, OTP never logged, rate limits (BP §19.1) | M20, M02, M23 · API-M02-02, API-M20-05 | T, S | Provider (D-015) → all cases | SBX | D-053 | REQUIRES_DECISION (D-015) |
| TS-INT-05 | Accounting export: one mapping per approved document/version (I-09), retries with the same keys, control totals, file export fallback (BP §14.2, §16.4; T27) | M19 · API-M19-06…08 | T, S, R | Authority & format (D-011) → reconciled sample day | SYN | D-053 | REQUIRES_DECISION (D-011, D-055) |
| TS-INT-06 | Supplier feeds / vendor API: versioned feed, invalid rows, freshness & stale behaviour (T14), SSRF-safe media fetch (BP §7.4, §9.7, §16.4) | M06, M14, M22 · API-M14-19, API-M06-26…29, API-M22-04 | T, S | Freshness policy (D-028) → stale case | SYN | D-053 | REQUIRES_DECISION (D-028, D-057) |
| TS-INT-07 | Legacy ERP/POS: stock events through a supported interface, idempotent, shared authority (T05), outage allocation (BP §9.1, §9.5, §16.4) | M23, M06 · API-M23-01 | T, S | D-009 = retain/integrate → cases | SYN | D-053 | REQUIRES_DECISION (D-009, D-030) |
| TS-INT-08 | GSTIN verification source: active, cancelled, malformed, source unavailable (BP §8.3) | M08 · API-M08-23 | T | Source (D-067) → cases | SBX | D-053 | REQUIRES_DECISION (D-067) |
| TS-INT-09 | Settlement & COD remittance import: fee/net matching, partial and unmatched items to finance queue (A10; BP §10.6) | M11 · API-M11-13…18 | T, S | Format (D-064) → cases | SYN | D-053 | REQUIRES_DECISION (D-064, D-020) |
| TS-INT-10 | Integration contract checklist per enabled adapter: authentication, mapping, source of truth, external ids, event schema/version, retries, timeouts, rate limits, idempotency, reconciliation, support owner, fallback tested (BP §16.4; MK:erp-admin.html#integrations checklist) | M23, M24 · API-M24-03/04 | R, G | Adapter enabled → checklist complete | SBX | D-053 | NOT_STARTED |

### 5.7 Authentication — TS-AUTH (location: `backend/identity/`, `tests/security/`)

| ID | Scope — verifies (source) | Modules · APIs · screens | When | Entry → Exit | Data | Tools | Status |
|---|---|---|---|---|---|---|---|
| TS-AUTH-01 | Sign-in by code and by password; generic failures; no account enumeration at sign-in, reset and registration (`07` §3.2, §3.8) | M02 · API-M02-02…05, -07, API-M08-01 · P-S12, P-S14, P-E16, P-V05 | C, T | Methods decided (D-040) → all flows | SYN | D-053 | REQUIRES_DECISION (D-040) |
| TS-AUTH-02 | MFA: privileged principals cannot operate without MFA; enrolment before role activation; backup codes; step-up actions (BP §18.2, §20.1 "Privileged access … login tests"; `07` §3.11) | M02 · API-M02-04/05/12…14, API-M14-21/22 | C, T, R | → each privileged key | SYN | D-053 | REQUIRES_DECISION (D-040, D-200, D-202) |
| TS-AUTH-03 | Rate limits and lockout on every operation in `07` §3.12; normal shopping not hindered (BP §19.1) | M02, M10 | T, R | Values (D-084) → each operation | SYN | D-053 | REQUIRES_DECISION (D-084) |
| TS-AUTH-04 | Sessions: sign-out removes private data (T22), revoke one/all, force sign-out, deactivation revokes, expiry/idle, role change effective next request (`07` §3.8, §3.11) | M02 · API-M02-06, -10, -11, -23, -24 | C, T | Mechanism (D-083) → all cases | SYN | D-053 | REQUIRES_DECISION (D-083, D-202) |
| TS-AUTH-05 | Passwords: supported storage mechanism, policy, reset single-use/expiry, change needs current password, migration or forced reset (BP §19.1, §21.2) | M02, M25 · API-M02-07…09 | C, T | → no plaintext anywhere | SYN | D-053 | REQUIRES_DECISION (D-039, D-040) |
| TS-AUTH-06 | Registration and invitations: consumer registration with verification token, consents and terms version; member/staff/vendor-user invitations single-use and expiring; privileged invite needs second approver (`07` §3.2–3.6) | M02, M08, M14 · API-M02-16…21, API-M08-01, -26, API-M14-37 · P-S14, P-E16, P-V05 | C, T | → each invitation type | SYN | D-053 | REQUIRES_DECISION (D-040, D-066, D-137) |
| TS-AUTH-07 | Guest order access and checkout links: token bound to one order/draft and listed scopes, expiry, no enumeration (BP §6.5, §13.2; `06-api.md` §4.14) | M10 · API-M10-10…12, -22 · P-S08, P-S10 | C, T | Method (D-021) → cases | SYN | D-053 | REQUIRES_DECISION (D-021, D-151) |
| TS-AUTH-08 | CSRF on cookie-authenticated mutations; CORS allow-list only (BP §19.1) | M02, all apps | C, R | Mechanism & hostnames → cases | SYN | D-053 | REQUIRES_DECISION (D-083, D-102) |
| TS-AUTH-09 | Machine credentials and signatures: integration keys limited to named scope, rotation invalidates old key, webhook signatures verified (BP §3.1, §16.4, §17.4) | M02, M14, M23 · API-M14-19/21, API-M23-01, webhooks | C, T | → scope-escape cases | SYN | D-053 | REQUIRES_DECISION (D-083) |
| TS-AUTH-10 | Credential hygiene: passwords, OTPs, tokens, API keys absent from logs, audit payloads, error messages and URLs (BP §19.1) | all | C, R | → log scan after full suite run | SYN | D-053 | NOT_STARTED |

### 5.8 Permissions — TS-PERM (cases in `07-auth-roles-permissions.md` §16)

| ID | Scope — verifies (source) | Modules · APIs · screens | When | Entry → Exit | Data | Tools | Status |
|---|---|---|---|---|---|---|---|
| TS-PERM-01 | Route inventory vs `07` §13 (deny by default; 501 endpoints) and matrix conformance key × role for every key in `07` §5, incl. the 16 keys added 2026-09-27 (`staff.assignable.read` … `system.alerts.manage`) and the 7 added 2026-09-30 (`presence.self`, `public.visit`, `analytics.read`, `analytics.margin.read`, `team.monitor.read`, `team.alert.ack`, `team.alert.manage`) | M02 · all | C, S | → zero unmapped routes | SYN | D-053 | NOT_STARTED |
| TS-PERM-02 | BOLA — object id substitution across customer, business account, vendor, location, token, export, session, conversation, dealer order-approval objects (BP §19.1 S14; **T11**, T23) | all | C, S, R | → cases 02.1–02.12 | SYN | D-053 | NOT_STARTED |
| TS-PERM-03 | BOPLA — protected/derived properties (price, buyer type, approval fields, refund approval, self-elevation, payout bypass, GSTIN change) (**T10**, **T13**) | M05, M10, M14, M11, M02, M08 | C, S, R | → cases 03.1–03.7 | SYN | D-053 | NOT_STARTED |
| TS-PERM-04 | Function-level: wrong principal type, wrong role, integration scope, webhook forgery, vendor applicant limits | all | C, S | → cases 04.1–04.6 | SYN | D-053 | NOT_STARTED |
| TS-PERM-05 | Private-price isolation: public, sign-out cache, membership loss (**T02**, **T22**) | M02, M05, M09, M21, M27 | S, R | → cases 05.1–05.3 incl. CDN/shared cache | SYN | D-053 | REQUIRES_DECISION (D-105) |
| TS-PERM-06 | Chat/WhatsApp disclosure (**T23**) | M16, M10 | S, R | → cases 06.1–06.2 | SYN | D-053 | REQUIRES_DECISION (D-021) |
| TS-PERM-07 | Owner away: delegation in scope, out of scope, expiry (**T31**) | M17, M02 | S, R | → cases 07.1–07.3 | SYN | D-053 | REQUIRES_DECISION (D-025) |
| TS-PERM-08 | Separation of duties and maker-checker (`07` §8) | M17, M02, M11, M08 | C, S | → cases 08.1–08.5 | SYN | D-053 | REQUIRES_DECISION (D-196) for warn rules |
| TS-PERM-09 | Thresholds and request-only roles; stale approvals; privileged operational flags; change register & templates (`07` §9) | M17, M10, M02, M24, M19 | C, S | Fixture thresholds → cases 09.1–09.6 | SYN | D-053 | REQUIRES_DECISION (D-024) |
| TS-PERM-10 | Sensitive fields: masking, reveal with reason, cost/margin columns, secrets (`07` §7) | M02, M08, M06, M18, M24 | C, S | → cases 10.1–10.5 | SYN | D-053 | REQUIRES_DECISION (D-153, D-197) |
| TS-PERM-11 | Record scope: location switch, cross-branch read, branch-scoped reports/dashboard (`07` §6) | M03, M06, M12, M18, M02 | C, S | → cases 11.1–11.4 | SYN | D-053 | REQUIRES_DECISION (D-029) |
| TS-PERM-12 | State effects: suspension, deactivation, role removal with cache invalidation (`07` §3.13) | M02, M08, M14 | C, S | → cases 12.1–12.3 | SYN | D-053 | NOT_STARTED |
| TS-PERM-13 | Emergency access lifecycle (`07` §10) | M17 | S | → case 13.1 | SYN | D-053 | REQUIRES_DECISION (D-025) |
| TS-PERM-14 | Approval-type authority (designated reviewers, buyer designation) | M17, M04, M14, M07 | S | → case 14.1 | SYN | D-053 | REQUIRES_DECISION (D-081, D-222) |

### 5.9 E-commerce — TS-ECOM (location: `tests/acceptance/`, `tests/e2e/`)

| ID | Scope — verifies (source) | Modules · APIs · screens | When | Entry → Exit | Data | Tools | Status |
|---|---|---|---|---|---|---|---|
| TS-ECOM-01 | Discovery: category filters relevant to category, exact SKU/model, spelling variants, abbreviations, curated synonyms, zero results, pagination, unavailable products (BP §6.3–6.4; T01, T36) | M21, M04, M09 · API-M21-01/02, API-M04-01 · P-S01, P-S02 | T, S | → relevance fixtures | SYN, REP | D-053 | REQUIRES_DECISION (D-032) |
| TS-ECOM-02 | Product & refurbished trust: condition distinct, grade rubric described, unit photos + inspection report, warranty provider (no implied manufacturer warranty), defects, box contents; honest merchandising (BP §6.1, §6.6; T01) | M04, M06 · API-M04-02/03, API-M06-02 · P-S03, P-S04 | T, S | Rubric (D-023) → cases | SYN | D-053 | REQUIRES_DECISION (D-023) |
| TS-ECOM-03 | Dealer pricing: authorised price & tier, stacking explanation, repricing on context/location change with notice, bulk shortage alternatives (BP §8, §29.2; T02, T03) | M05, M08 · API-M04-03, API-M05-01/04 · P-S02, P-S03, P-S06, P-S11 | T, S | Tier & stacking policy → cases | SYN | D-053 | REQUIRES_DECISION (D-017, D-018, D-016, D-205) |
| TS-ECOM-04 | Cart persistence across refresh and recovery after payment interruption; changed price/stock notices; minimum quantity failure (BP §6.3, §6.5) | M10 · API-M10-01…05, API-M10-25 · P-S06 | T, S | Cart model (D-129) → cases | SYN | D-053 | REQUIRES_DECISION (D-129) |
| TS-ECOM-05 | Checkout: serviceability before payment, clear shipping/tax totals, pending order + atomic reservation, payment attempt, verification pending, no false success, duplicate submission (BP §6.5, §10.2; T04, T06, T09, T10) | M10, M11, M12 · API-M10-06, API-M11-01/02, API-M11-22, API-M12-01 · P-S07, P-S08 | T, S, R | Payment provider (D-012) → cases | SYN, SBX | D-053 | REQUIRES_DECISION (D-012, D-021, D-026) |
| TS-ECOM-06 | Orders & tracking: separate order/payment/fulfilment/refund states, partial shipment, cancellation requested, refund pending, invoice access (BP §6.3 Orders, §10.1) | M10, M12, M19 · API-M10-07/08, API-M19-01/02 · P-S08, P-S09 | T, S | → state combinations | SYN | D-053 | REQUIRES_DECISION (D-150, D-055) |
| TS-ECOM-07 | Line cancellation: affected reservation released, discount allocation, refund once (BP §10.3; T34) | M10, M06, M11 · API-M10-09 · P-S08 | T, S | Policy (D-082) → cases | SYN | D-053 | REQUIRES_DECISION (D-082) |
| TS-ECOM-08 | Returns & warranty requests: eligible items, outside policy, serial mismatch, warranty route, evidence upload (BP §6.3 Returns, §10.5, §7.5) | M13 · API-M13-01…06, API-M13-17/18 · P-S10 | T, S | Policies (D-022) → cases | SYN | D-053 | REQUIRES_DECISION (D-022) |
| TS-ECOM-09 | Account: profile, contact change with dual codes, addresses, consents with history, data requests, devices (BP §13.3, §19.3) | M08 · API-M08-02…19, API-M08-49, API-M20-08/09 · P-S09 | T, S | → cases | SYN | D-053 | REQUIRES_DECISION (D-060, D-133) |
| TS-ECOM-10 | Dealer application and business account: pending, rejected (reason), approved, suspended, approval expired; member invitations; statements (BP §6.3 Dealer account, §8.3) | M08, M19 · API-M08-20…27, API-M08-46…48, API-M08-50, API-M19-04 · P-S11, P-S12 | T, S | Member roles (D-066) → cases | SYN | D-053 | REQUIRES_DECISION (D-066, D-067) |
| TS-ECOM-11 | Assisted orders and WhatsApp draft baskets: live price/stock, chat reference not trusted, secure checkout link, same reservation/payment controls (BP §13.2, §29.5) | M10, M16 · API-M10-18…22 · P-E02, P-E05, P-S07 | T, S | Reservation timing (D-151) → cases | SYN | D-053 | REQUIRES_DECISION (D-151) |
| TS-ECOM-12 | Help & chat: versioned FAQ answers, guided flows, outside hours, bot failure → handoff with context, verification before disclosure (BP §6.3 Help, §13.4; T23, T24) | M16 · API-M16-01…03, -07, -09, -20 · P-S13 | T, S | Support hours (D-074) → cases | SYN | D-053 | REQUIRES_DECISION (D-074) |
| TS-ECOM-13 | SEO: crawlable pages, canonical URLs, sitemap without private/unpublished URLs, accurate structured data for unavailable products, redirects (BP §6.8; T32) | M27, M09 · API-M27-01/02 · P-S15 | S, R | Redirect map (D-076) → cases | SYN | D-053 | REQUIRES_DECISION (D-076) |
| TS-ECOM-14 | Conditional and MOCKUP-ONLY features: when disabled the API answers `FEATURE_DISABLED` and screens hide the feature; when enabled, cases are added — reviews (D-041), wishlist/compare (D-042), coupons (D-043), Q&A (D-065), alerts (D-141), EMI/bank offers (D-062), store pickup (D-061), COD (D-020) | M04, M05, M08, M09, M11, M12, M20 | T | Per decision | SYN | D-053 | REQUIRES_DECISION (per feature) |
| TS-ECOM-15 | Customer notifications: approved transitions, consent, opt-out never messaged (T25), unpaid reminders stop after payment/dispute/opt-out (A14, A28) | M20, M08 · API-M08-10, API-M20-03/04 | T, S | Events (D-058) → cases | SYN | D-053 | REQUIRES_DECISION (D-058) |

### 5.10 Vendor — TS-VEN (phase 1B; location: `tests/acceptance/`, `backend/vendors/`)

| ID | Scope — verifies (source) | Modules · APIs · screens | When | Entry → Exit | Data | Tools | Status |
|---|---|---|---|---|---|---|---|
| TS-VEN-01 | Onboarding: application creates applicant only; invitation route; approval record (reviewer, reasons, categories, locations, terms version, date); reject; request info (BP §11.1) | M14 · API-M14-01, -47…50, -66…68 · P-S12#vendor, P-E11 | T, S | Route (D-047) → cases | SYN | D-053 | REQUIRES_DECISION (D-047) |
| TS-VEN-02 | Submission lifecycle: inline validation (A20), draft → submitted → needs changes → approved → published, non-purchasable until approved (T12), sensitive edit reviewed with live version kept (T13) (BP §7.3, §11.3) | M14, M04, M17 · API-M14-06…11, API-M14-54, API-M17-03 · P-V02, P-E06, P-E11 | T, S | Reviewer designation (D-081) → cases | SYN | D-053 | REQUIRES_DECISION (D-081) |
| TS-VEN-03 | Bulk batches: row-level results, fix and resubmit, repeat upload does not duplicate (BP §7.4) | M14 · API-M14-13…17 · P-V02#bulk | T, S | → cases | SYN | D-053 | NOT_STARTED |
| TS-VEN-04 | Availability: portal, CSV and API updates; auto-accept within validated boundaries; freshness deadline and stale behaviour (T14); revert; never company stock (BP §9.7, §11.3) | M14, M06 · API-M14-18…20, API-M06-26…29 · P-V03, P-E08, P-E11 | T, S | Freshness policy (D-028) → cases | SYN | D-053 | REQUIRES_DECISION (D-028) |
| TS-VEN-05 | Vendor isolation in vendor context — executes TS-PERM-02.4, 02.5, 04.3 (T11) | M14, M02 | S, R | → all pass | SYN | D-053 | NOT_STARTED |
| TS-VEN-06 | Supplier POs: view own POs; confirmation and ASN only if decided (BP §11.2) | M14, M07 · API-M14-23…26 · P-V03#pos | T, S | D-131 → cases | SYN | D-053 | REQUIRES_DECISION (D-131) |
| TS-VEN-07 | Supplier-fulfilment pilot: confirmation deadline, expiry returns task, shipment evidence, minimal customer data (BP §3.2, §11.2) | M14, M12 · API-M14-27…30, -62…65 · P-V03#tasks, P-E11 | T, S | D-007, D-008 → cases | SYN | D-053 | REQUIRES_DECISION (D-007, D-008) |
| TS-VEN-08 | Supplier RMAs: evidence, resolution options, data minimisation (BP §11.2) | M13, M14 · API-M13-14…16, API-M14-31/32 | T, S | → cases | SYN | D-053 | NOT_STARTED |
| TS-VEN-09 | Profile change requests, documents, terms acceptance with evidence, payout-account change maker-checker (BP §11.1, §11.5) | M14 · API-M14-33…44, -57…59, -69 · P-V04, P-E11 | T, S | D-068, D-137 → cases | SYN | D-053 | REQUIRES_DECISION (D-068, D-137) |
| TS-VEN-10 | Suspension: live submissions blocked, offers paused, history accessible to staff (BP §11.1) | M14 · API-M14-51 | T, S | → cases | SYN | D-053 | NOT_STARTED |
| TS-VEN-11 | Vendor performance metrics: freshness, fill rate, dispatch, returns, response time (BP §11.2, §14.3) | M14, M18 · API-M14-55 | T | → metric definitions | SYN | D-053 | NOT_STARTED |

### 5.11 Marketplace — TS-MKT (LATER, BP §23.1 "For a marketplace release, add …"; D-046)

| ID | Scope (BP §23.1) | Status |
|---|---|---|
| TS-MKT-01 | Seller-order splitting | LATER |
| TS-MKT-02 | Commission versions | LATER |
| TS-MKT-03 | Partial returns after payout | LATER |
| TS-MKT-04 | Payout failure | LATER |
| TS-MKT-05 | Seller suspension with open orders | LATER |
| TS-MKT-06 | Negative seller balances | LATER |
| TS-MKT-07 | Settlement reconciliation | LATER |

### 5.12 ERP — TS-ERP (location: `backend/<module>/`, `tests/acceptance/`)

| ID | Scope — verifies (source) | Modules · APIs · screens | When | Entry → Exit | Data | Tools | Status |
|---|---|---|---|---|---|---|---|
| TS-ERP-01 | Last-unit concurrency: N parallel reservations on one unit → exactly one success, others accurate `STOCK_UNAVAILABLE`; website vs branch (T04, T05); stock authority down → stop, never guess (BP §9.1, §10.3, §29.4) | M06, M10, M23 · API-M10-06, API-M10-21, API-M23-01 | C, S, R | Core (D-001) → 0 oversell in 100 % of runs | SYN | D-053 | REQUIRES_DECISION (D-001, D-030) |
| TS-ERP-02 | Stock ledger: every BP §9.2 stock event produces the documented movement; no quantity overwrite; history reconciles (BP §9.2, §9.6) | M06 · API-M06-11 · P-E08#movements | C, S | → event table rows | SYN | D-053 | NOT_STARTED |
| TS-ERP-03 | Serial lifecycle: duplicate serial check, manufacturer vs internal id, no serial on two active fulfilments, never shipped twice (I-03), replacement history, recall query (BP §9.4, §7.5) | M06, M12, M13 · API-M06-05…08 · P-E08#serials | C, S | → cases | SYN | D-053 | REQUIRES_DECISION (D-126) for batch recall |
| TS-ERP-04 | Receiving & QC: partial receipt, wrong serial → discrepancy not published (T15), over/short, substitution approval, quarantine on fail, posting idempotent (BP §9.3; A03; proof scenario 1) | M07, M06 · API-M07-09…13, API-M06-09 · P-E09#receive | T, S | → cases | SYN | D-053 | REQUIRES_DECISION (D-023, D-110) |
| TS-ERP-05 | Transfers: ship/receive, in-transit not available at destination, partial receipt keeps discrepancy visible (T16), enterprise stock unchanged (BP §9.5) | M06 · API-M06-12…17 · P-E08#transfers | T, S | → cases | SYN | D-053 | NOT_STARTED |
| TS-ERP-06 | Counts & adjustments: blind count, variance review, no stock change until approval, threshold routing (A24; BP §9.6) | M06, M17 · API-M06-18…23, -32 · P-E08#counts | T, S | Count policy → cases | SYN | D-053 | REQUIRES_DECISION (D-069, D-024) |
| TS-ERP-07 | Reservations: expiry job (A06), extension with reason, capture after expiry → re-reserve or exception/refund path (T09; BP §29.6) | M06, M10, M11, M17 · API-M06-24/25, API-M11-03 · P-E08#reservations, P-E12 | T, S | Durations (D-026) → cases | SYN | D-053 | REQUIRES_DECISION (D-026) |
| TS-ERP-08 | Supplier availability freshness on staff side: stale feed hides immediate promise / requires confirmation / suspends offer (T14; BP §9.7) | M06, M14 · API-M06-26…29 · P-E08#supplier, P-E11#freshness | T, S | D-028 → cases | SYN | D-053 | REQUIRES_DECISION (D-028) |
| TS-ERP-09 | Purchasing: reorder suggestion only (A17), PO approval by value, duplicate supplier invoice detection (A25), 3-way match variances to finance/buyer (BP §9.3) | M07 · API-M07-01…08, -14…17, -20…23 · P-E09 | T, S | D-070, D-222 → cases | SYN | D-053 | REQUIRES_DECISION (D-070, D-222, D-024) |
| TS-ERP-10 | Fulfilment: release only eligible orders, scans verify location/SKU/serial against allocation, substitution flagged, documents from approved templates, dispatch atomic with reservation consumption, handover evidence (BP §10.4) | M12 · API-M12-03…15 · P-E03 | T, S | D-031, D-055, D-110 → cases | SYN | D-053 | REQUIRES_DECISION (D-031, D-055) |
| TS-ERP-11 | Shipping & delivery exceptions: booking dedup (T20), carrier mapping, non-delivery, address issues, RTO, lost/damaged, customer pickup (BP §10.5) | M12 · API-M12-11…19 · P-E03#exceptions | T, S | D-013 → cases | SBX | D-053 | REQUIRES_DECISION (D-013, D-061) |
| TS-ERP-12 | Returns/RMA/warranty: quarantine until inspection with serial linked to sale (T17), policy version (T33), separate refund and resale decisions, data erasure before resale, supplier RMA (BP §10.5, §7.5) | M13, M06 · API-M13-03…16 · P-E04 | T, S | D-022 → cases | SYN | D-053 | REQUIRES_DECISION (D-022) |
| TS-ERP-13 | Payments & refunds operations: captured-not-confirmed exception, reconciliation queue, duplicate refund command (T18), refund timeout query (T19), refundable cap (I-05), partial cancellation refund (T34) | M11 · API-M11-04…12 · P-E12 | T, S | D-012 → cases | SBX | D-053 | REQUIRES_DECISION (D-012) |
| TS-ERP-14 | Finance boundary: daily close maker-checker, settlement matching, accounting export with control totals (T27; BP §14.2) | M11, M19 · API-M11-13…21, API-M19-06…09 · P-E12#close, #export | T, S | D-011, D-064 → reconciled test day | SYN | D-053 | REQUIRES_DECISION (D-011, D-064) |
| TS-ERP-15 | Catalog management: category & attribute templates by configuration (T36), drafts never overwrite live, publication checks, imports with mixed rows and no duplicates on repeat (T26), order snapshot survives product/price change (T33) (BP §7) | M04, M21 · API-M04-15…41 · P-E06 | T, S | → cases | SYN | D-053 | REQUIRES_DECISION (D-081) |
| TS-ERP-16 | Pricing management: change requests shown as diff with approval, promotions & stacking, margin-floor override with reason, supplier cost change never auto-changes live price (BP §8.1–8.4) | M05 · API-M05-10…24 · P-E07 | T, S | → cases | SYN | D-053 | REQUIRES_DECISION (D-017, D-024, D-043) |
| TS-ERP-17 | Customers & dealers admin: application decision with reason and price list, suspension/reinstatement, members on behalf, duplicate review and merge safeguards, privacy requests (BP §8.3, §13.4, §19.3) | M08 · API-M08-28…45 · P-E10 | T, S | → cases | SYN | D-053 | REQUIRES_DECISION (D-067, D-133, D-060) |
| TS-ERP-18 | Support inbox: assignment, automation pause in a conversation, verification, templates outside window, tickets and escalation categories (BP §13.3–13.4) | M16 · API-M16-04…19 · P-E05 | T, S | D-014, D-074 → cases | SYN | D-053 | REQUIRES_DECISION (D-014, D-074) |
| TS-ERP-19 | Reporting: launch report set definitions, event-date basis, freshness labels, branch scope, restricted columns, exports reconcile with sample transactions (BP §14.3–14.4; WP15) | M18 · API-M18-01…19 · P-E13 | T, S | Report set (D-075) → reconciled totals | SYN | D-053 | REQUIRES_DECISION (D-075) |
| TS-ERP-20 | Analytics read models: totals reconcile to orders, returns and refunds for a seeded month; full rebuild identical; freshness per model; test transactions excluded; anonymised customers leave the cohort snapshot (CF1 §3; D-284; T-1A.15-M18-09) | M18 · API-M18-20 · E-analytics_daily_fact, E-customer_cohort_snapshot · P-E18 | T, S | Seeded month → cases 20.1–20.5 (§19) | SYN | D-053 | REQUIRES_DECISION (D-286) |

### 5.13 Admin — TS-ADM (location: `tests/acceptance/`, `backend/admin/`, `backend/identity/`)

| ID | Scope — verifies (source) | Modules · APIs · screens | When | Entry → Exit | Data | Tools | Status |
|---|---|---|---|---|---|---|---|
| TS-ADM-01 | Users: invite, privileged second approver, deactivate keeps history, bulk security actions (BP §18.2; MK) | M02 · API-M02-20…24 · P-E15#users | T, S | → cases | SYN | D-053 | NOT_STARTED |
| TS-ADM-02 | Roles: displayed matrix equals enforced matrix; role change approval; SoD rules listed (BP §18.1) | M02 · API-M02-25…27, -39/40 · P-E15#roles | T, S | → matrix equality check | SYN | D-053 | NOT_STARTED |
| TS-ADM-03 | Thresholds: draft vs active, second approver, effective date; placeholders never active (BP §18.1) | M17 · API-M17-18/19 · P-E15#thresholds | T, S | D-024 → cases | SYN | D-053 | REQUIRES_DECISION (D-024) |
| TS-ADM-04 | Delegation & emergency access UI and lifecycle (BP §12.6, §18.2; T31) | M17 · API-M17-20…24 · P-E15#delegation | T, S | D-025 → cases | SYN | D-053 | REQUIRES_DECISION (D-025) |
| TS-ADM-05 | Audit log: filters, object history, sample transaction reconstruction (BP §20.1), export, masking, viewing logged, tamper evidence | M02 · API-M02-30 · P-E15#audit | T, S, G | D-114 → reconstruction of stock, price, refund, permission change | SYN | D-053 | REQUIRES_DECISION (D-114) |
| TS-ADM-06 | Locations & company: add location, bins/labels, deactivation guard, company edit second approver (BP §3.3) | M03 · API-M03-02…09 · P-E15#locations | T, S | → cases | SYN | D-053 | REQUIRES_DECISION (D-010) |
| TS-ADM-07 | Integrations & secrets: status/health, test connection, write-only rotation with second approver, logs redacted (BP §16.4, §19.1) | M24, M02 · API-M24-03…07, -10, API-M02-35…37 · P-E15#integrations | T, S | → cases | SYN | D-053 | REQUIRES_DECISION (D-107) |
| TS-ADM-08 | System status: environments, backup and restore evidence, alert routing (BP §20.3) | M24, M26 · API-M24-08/09, -11, -14 · P-E15#system | T, S | D-052 → cases | SYN | D-053 | REQUIRES_DECISION (D-052) |
| TS-ADM-09 | Access review: start, list/read, reviewer decisions, revocations applied (BP §20.1, §24.3) | M02 · API-M02-28/29, -41/42 | T, P | → cases | SYN | D-053 | NOT_STARTED |
| TS-ADM-10 | Owner control centre & digest: each exception shows what, why, who, by when; digest contains only material items; freshness labels (BP §12.5; A19; T31) | M17, M18 · API-M18-12, API-M17-25/26 · P-E01 | T, S | D-063 → cases | SYN | D-053 | REQUIRES_DECISION (D-063) |
| TS-ADM-11 | Automation admin: rule catalogue, staging dry run before enable (MK), kill switch, job runs, manual retry beyond cap logged, incident pause (BP §12.3, §20.4) | M17 · API-M17-08…17 · P-E14 | T, S | D-078 → cases | SYN | D-053 | REQUIRES_DECISION (D-078, D-077) |
| TS-ADM-12 | Operational configuration: versioned settings with approval and effective date (hold durations, freshness rules, COD eligibility, review policy, support hours) | M24 · API-M24-01/02 | T, S | → cases | SYN | D-053 | NOT_STARTED |
| TS-ADM-13 | Change register: requests from any staff, read scope (own vs all), owner decision with effort/cost/dates/baseline (BP §2.3, §25.5) | M24 · API-M24-07, -12/13, API-M18-11 | T, S | → cases | SYN | D-053 | REQUIRES_DECISION (D-191) |
| TS-ADM-14 | Document templates: versions, approval before activation, fiscal templates finance-only; generated documents use the active version (A12; BP §30.1) | M19 · API-M19-11/12 | T, S | → cases | SYN | D-053 | REQUIRES_DECISION (D-055, D-111) |
| TS-ADM-15 | Workspace context, queue counts and assignee picker: counts only for readable queues, context limited to assigned companies/locations, picker within scope (MK shell) | M02, M03, M18 · API-M02-34, API-M03-10/11, API-M18-15/16 | T, S | → cases | SYN | D-053 | REQUIRES_DECISION (D-170, D-172, D-173) |

### 5.14 End-to-end journeys — TS-E2E (location: `tests/e2e/`; detail §7)

| ID | Journey (source) | Covers | Modules · APIs · screens | When | Entry → Exit | Data | Tools | Status |
|---|---|---|---|---|---|---|---|---|
| TS-E2E-01 | Consumer buys a refurbished laptop (BP §29.1) | T01, T04, T07, T17, T33 | M04, M06, M07, M10–M13 · §7 steps · P-E09, P-E08, P-S03, P-S07, P-S08, P-E03, P-S10, P-E04 | S, R, G | All §7 step APIs implemented → every step passes on staging | SYN, SBX | D-053 | REQUIRES_DECISION (D-012, D-013, D-023) |
| TS-E2E-02 | Dealer places a bulk order (BP §29.2) | T02, T03, T10, T22 | M02, M05, M08, M10, M11, M17 · P-S12, P-S11, P-S06, P-S07, P-E02 | S, R, G | Dealer pricing + checkout → every step passes | SYN, SBX | D-053 | REQUIRES_DECISION (D-018, D-066) |
| TS-E2E-03 | Vendor submits a new product (BP §29.3) — 1B | T11, T12, T13 | M14, M04, M06, M17 · P-S12, P-V02, P-V03, P-E11, P-E06 | S, R, G | Vendor portal (1B) → every step passes incl. isolation | SYN | D-053 | REQUIRES_DECISION (D-047, D-081) |
| TS-E2E-04 | Website and branch compete for one item (BP §29.4) | T04, T05 | M06, M10, M23 · P-S07, P-E02 / legacy POS | S, R, G | Branch sale path → one allocation in 100 % of runs | SYN | D-053 | REQUIRES_DECISION (D-009, D-030) |
| TS-E2E-05 | WhatsApp customer asks to order (BP §29.5) | T23, T24, T25 | M16, M10, M11 · P-S03, P-E05, P-S07 | S, R, G | WhatsApp/assisted flow → every step passes | SBX | D-053 | REQUIRES_DECISION (D-014, D-151) |
| TS-E2E-06 | Payment succeeds after a hold expires (BP §29.6) | T09 | M06, M10, M11, M17 · P-S07, P-E01, P-E02, P-E12 | S, R, G | Expiry job + payment sandbox → exception path verified | SYN, SBX | D-053 | REQUIRES_DECISION (D-026) |
| TS-E2E-07 | Owner is away for a working day (BP §29.7) | T31 | M17, M02, M18 + routine modules · P-E15, P-E01, P-E14, P-E12 | S, R, G | Delegation + digest → owner sees only material items | SYN | D-053 | REQUIRES_DECISION (D-024, D-025, D-063) |
| TS-E2E-08 | New product category is introduced (BP §29.8) | T36 | M04, M21, M09, M10, M13 · P-E06, P-S02, P-S07, P-S10 | S, R, G | Templates → purchase without schema change | SYN | D-053 | NOT_STARTED |
| TS-E2E-09 | Return of a serialised unit with partial refund (BP §15.3 #7; PR2 §12 "Return of serialised unit") | T17, T18, T34 | M13, M06, M11 · P-S10, P-E04, P-E12 | S, R, G | Returns + refunds → every step passes | SYN, SBX | D-053 | REQUIRES_DECISION (D-022, D-012) |
| TS-E2E-10 | Receipt → inspection → publication → sale of accepted units only (BP §15.3 #1–#2, §29.1) | T15, T01 | M07, M06, M04, M10, M12 · P-E09, P-E08, P-S03, P-S07, P-E03 | S, R | Receiving + publication → only accepted units sold | SYN | D-053 | REQUIRES_DECISION (D-023) |
| TS-E2E-11 | Guest checkout and later order access (BP §6.5) | T23 (web), T06 | M02, M10, M11, M13 · P-S07, P-S08, P-S10 | S, R | Guest policy decided → token scope verified | SYN, SBX | D-053 | REQUIRES_DECISION (D-021) |

### 5.15 Error handling — TS-ERR (location: `backend/`, `tests/acceptance/`; detail §8)

| ID | Scope — verifies (source) | Modules · APIs · screens | When | Entry → Exit | Data | Tools | Status |
|---|---|---|---|---|---|---|---|
| TS-ERR-01 | Every row of the BP §10.3 failure table (§8 cases TS-ERR-01.1…12) | M06, M10, M11, M12, M20 · §8 APIs · P-S07, P-S08, P-E12 | C, S, R | Failure injection hooks → all 12 cases | SYN, SBX | D-053 | REQUIRES_DECISION (D-012, D-013, D-026) |
| TS-ERR-02 | Stock authority unavailable and branch outage: stop confirmation or segregated allocation; never guess (BP §9.5, §10.3, §29.4) | M06, M10, M23 · API-M10-06 | S, R | Stock authority fault injection → no confirmation without authority | SYN | D-053 | REQUIRES_DECISION (D-030) |
| TS-ERR-03 | Provider outages and documented fallbacks (manual booking, file export, support handoff, reconciliation queue) (BP §16.4) | M23, M11, M12, M16, M19 · adapters | S, R | Provider simulated down → fallback used and visible | SBX | D-053 | REQUIRES_DECISION (D-011…D-015) |
| TS-ERR-04 | User-facing error states of BP §6.3 on every screen (with TS-FE-02/06) | M09 + workspace/vendor apps · all P-* | T, S | Screens built → every §8.2 state reachable | SYN | D-053 | NOT_STARTED |
| TS-ERR-05 | Incident containment: incident mode stops checkout-affecting automation; post-incident reconciliation of orders, payments, stock, jobs (BP §20.4; API-M17-14) | M17, M26 · API-M17-14 · P-E14 | S, R | Incident mode → checkout-affecting automation stopped; reconciliation report | SYN | D-053 | NOT_STARTED |
| TS-ERR-06 | Import/sync failure creates one actionable incident with retry cap, owner, evidence, resolution (A38; BP §12.2) | M17, M04, M23 · API-M17-15…17 · P-E14#runs | C, S | Failing job → exactly one exception with owner | SYN | D-053 | NOT_STARTED |

### 5.16 Security — TS-SEC (location: `tests/security/`; BP §19.1)

| ID | Scope — verifies (source) | Modules · APIs · screens | When | Entry → Exit | Data | Tools | Status |
|---|---|---|---|---|---|---|---|
| TS-SEC-01 | OWASP API authorisation: executes TS-PERM-01…14 against staging (BP §19.1, S14) | M02 + all · all APIs | R, G | Staging deployed → all TS-PERM pass | SYN | D-053 | NOT_STARTED |
| TS-SEC-02 | Input validation & injection on all write endpoints and search/filter parameters (BP §19.1 "Validate inputs") | All write/search endpoints | C, R | → no injection finding open | SYN | D-053 | NOT_STARTED |
| TS-SEC-03 | Uploads: type/size limits, malware scan of risky classes, private files only through authorised access (BP §19.1) | M22, M13, M14, M08 · API-M22-01/02 · P-S10, P-S12, P-V02, P-E06, P-E09 | C, R | Scanner decided → risky classes scanned; private files unreachable without check | SYN | D-053, D-112 | REQUIRES_DECISION (D-112, D-033) |
| TS-SEC-04 | SSRF: URL imports and supplier fetches cannot reach internal/metadata addresses (BP §7.4, §19.1) | M04, M22, M23 · API-M22-04, API-M06-26 | C, R | → internal addresses rejected | SYN | D-053 | NOT_STARTED |
| TS-SEC-05 | Secrets & environment credentials: separate per environment, rotation, none in the repository or published site (BP §19.1; D-115) | M01, M24, M26 · API-M24-05 · `infra/` | R, G | Environments exist → no shared or committed secrets | SYN | D-053, D-107 | REQUIRES_DECISION (D-107, D-115) |
| TS-SEC-06 | Logging hygiene: no passwords, OTPs, tokens, payment data, identity documents or complete chat content in logs (BP §19.1) — with TS-AUTH-10 | All modules · logs | C, R | Full suite run → log scan clean | SYN | D-053, D-052 | NOT_STARTED |
| TS-SEC-07 | Encryption in transit and appropriate storage encryption (BP §19.1, §16.6) | M01, M22, M26 · `infra/` | R, G | Hosting decided → transport and storage encryption verified | — | D-053 | REQUIRES_DECISION (D-005, D-130) |
| TS-SEC-08 | Dependency updates and vulnerability triage (BP §19.1, §24.3) | All code in `frontend/`, `backend/` | C, P | → no untriaged high findings | — | D-053 | REQUIRES_DECISION (D-053) |
| TS-SEC-09 | Audit tamper-resistance per selected mechanism (BP §19.1) | M02 · E-audit_event | R | Mechanism decided → tampering detected/prevented | SYN | D-053, D-114 | REQUIRES_DECISION (D-114) |
| TS-SEC-10 | CSV/spreadsheet formula injection neutralised in every export (BP §14.4) | M18, M04, M19 · export endpoints | C | → formula cells neutralised | SYN | D-053 | NOT_STARTED |
| TS-SEC-11 | Abuse protection under load on sign-in, OTP, order access and checkout (BP §19.1) | M02, M10 · §3.12 of `07` | R | Rate limits decided → protected under load, shoppers unaffected | SYN | D-053, D-084 | REQUIRES_DECISION (D-084) |
| TS-SEC-12 | Independent security assessment before go-live | Whole platform on staging | G | D-208 decided → no open critical finding | MSK/SYN | D-208 | REQUIRES_DECISION (D-208) |
| TS-SEC-13 | Staff-monitoring and visit-tracking privacy: no column, payload key or log line outside the D-282 recorded list; visit tracking stores no personal data under D-285 (b) and nothing before consent under (c) (DPDP Act 2023) | M02, M09, M17, M24 · API-M02-43, API-M24-15…17, API-M09-03 | C, R | → cases 13.1–13.4 (§19) | SYN | D-053 | REQUIRES_DECISION (D-283, D-285) |

### 5.17 Accessibility — TS-A11Y (location: `tests/a11y/`; BP §6.7; scope D-051)

| ID | Scope — verifies (source) | Modules · APIs · screens | When | Entry → Exit | Data | Tools | Status |
|---|---|---|---|---|---|---|---|
| TS-A11Y-01 | Keyboard-only completion of key flows (T30): sign-in, search → product → cart → checkout, order tracking, return request; staff receipt, dispatch, approval decision | M09, workspace, vendor apps · P-S02…P-S08, P-S10, P-S12; P-E09, P-E03, P-E14 | S, R, G | Key flows built → completed without pointer | SYN | D-053, D-051 | REQUIRES_DECISION (D-051) |
| TS-A11Y-02 | WCAG 2.2 AA checks within the agreed scope: contrast, labels, focus visibility, keyboard order, error summaries, image descriptions, non-colour status indicators (BP §6.7) | All P-* in agreed scope | C (automated part), R | Scope agreed → no open AA failure in scope | SYN | D-053, D-051 | REQUIRES_DECISION (D-051) |
| TS-A11Y-03 | Screen-reader navigation of key flows on agreed browsers (BP §6.7 step 8) | Key flows on agreed browsers | R, G | Browser list decided → flows navigable by screen reader | SYN | D-053, D-051, D-206 | REQUIRES_DECISION (D-051, D-206) |

### 5.18 Performance & load — TS-PERF (location: `tests/load/`; targets PROPOSED D-034; detail §10)

| ID | Scope — verifies (source) | Modules · APIs · screens | When | Entry → Exit | Data | Tools | Status |
|---|---|---|---|---|---|---|---|
| TS-PERF-01 | Web page experience lab tests on agreed desktop/laptop profiles before each launch (BP §20.1) | M09, M22 · P-S01…P-S04 | R, G | Targets decided → p75 lab values within target | REP | D-053, D-034 | REQUIRES_DECISION (D-034, D-206) |
| TS-PERF-02 | Internal catalog/quote API p95 under agreed normal workload, excluding provider wait (BP §20.1) | M05, M21, M04 · API-M05-01, API-M04-03, API-M21-01 | R, G | Workload agreed → p95 within target | REP | D-053, D-034 | REQUIRES_DECISION (D-034, D-207) |
| TS-PERF-03 | Stock browse propagation: timestamped movement-to-display (BP §20.1) | M06, M21, M09 · A04 projection | S, R | → 95th percentile propagation within window | REP | D-053 | REQUIRES_DECISION (D-034, D-105) |
| TS-PERF-04 | Mixed workload: browsing with images, search, dealer pricing, last-unit contention, bulk import and staff picking at once; peak × agreed growth (BP §20.2) | M09, M21, M05, M06, M10, M04, M12 | R, G | Mix & growth agreed → targets met at peak × growth | REP | D-053, D-207 | REQUIRES_DECISION (D-207, D-010) |
| TS-PERF-05 | Heavy job isolation: large report/import during checkout keeps agreed checkout performance (T35; BP §20.2) | M18, M04, M10 · API-M18-03, API-M04-30, API-M10-06 | R, G | → checkout within target while jobs run (T35) | REP | D-053 | REQUIRES_DECISION (D-034) |
| TS-PERF-06 | Search relevance and latency at representative catalog size (BP §6.4, §28.5) | M21 · API-M21-01/02 | S, R | Catalog loaded → relevance fixtures pass and latency within target | REP | D-053, D-032 | REQUIRES_DECISION (D-032, D-010) |
| TS-PERF-07 | Availability: synthetic checks and incident accounting in production (BP §20.1) | M26 · synthetic checks | P | Production live → monthly availability reported | PRD | D-052 | REQUIRES_DECISION (D-034, D-052) |

### 5.19 Backup & restore — TS-BKP (location: `tests/restore/`, runbooks in `infra/`; detail §11)

| ID | Scope — verifies (source) | Modules · APIs · screens | When | Entry → Exit | Data | Tools | Status |
|---|---|---|---|---|---|---|---|
| TS-BKP-01 | Backup completeness: database, attachments and media; stored outside the primary runtime; schedule met (BP §16.6) | M26, M01, M22 · `infra/` | R, P | Backups configured → complete set incl. attachments | — | D-053, D-108 | REQUIRES_DECISION (D-108) |
| TS-BKP-02 | Restore rehearsal: restore to staging, measure achieved recovery point and time against agreed targets, reconcile data and attachments (**T28**; BP §20.1) | M26 · API-M24-08/09, -11 · P-E15#system | G, P | Staging available → recovery point/time measured, data reconciled | MSK/SYN | D-053, D-108 | REQUIRES_DECISION (D-108, D-034) |
| TS-BKP-03 | Post-restore business reconciliation: orders/payments/refunds/stock movements after the snapshot exported and reconciled; deletions/anonymisations re-applied (BP §20.5, §21.4; MK) | M25, M26, M11, M06 | G | Restore done → post-snapshot transactions reconciled | MSK/SYN | D-053 | REQUIRES_DECISION (D-108, D-036) |
| TS-BKP-04 | Scheduled rehearsal after launch (BP §20.1 "scheduled thereafter"; §24.3) | M26 | P | Launch done → rehearsal on schedule with evidence | MSK/SYN | D-108 | REQUIRES_DECISION (D-108) |

### 5.20 Migration rehearsal — TS-MIG (location: `backend/migration/`, `tests/migration/`; detail §11)

| ID | Scope — verifies (source) | Modules · APIs · screens | When | Entry → Exit | Data | Tools | Status |
|---|---|---|---|---|---|---|---|
| TS-MIG-01 | Sample clean + trial import reconciled with warehouse, sales, support and finance (BP §21.3 steps 1–2) | M25 + target modules | S | Legacy export sample → sample reconciled with four departments | MSK | D-053 | REQUIRES_DECISION (D-009, D-038) |
| TS-MIG-02 | Full dry run with measured downtime/workload; stop/go thresholds agreed (steps 3–4) | M25 | G | Full export → timing within window; stop/go agreed | MSK | D-053 | REQUIRES_DECISION (D-038) |
| TS-MIG-03 | Dataset control totals per BP §21.2 (products, images, stock qty/value by location/owner/condition/serial, customers/dealers, vendors, open POs, open orders, payments/refunds, warranty, historical, passwords, SEO) | M25, M04, M06, M08, M07, M10, M11, M13, M27 | S, G | Final load → all control totals match | MSK | D-053 | REQUIRES_DECISION (D-038, D-135) |
| TS-MIG-04 | Password migration or forced reset (BP §21.2) | M02, M25 | G | D-039 decided → sign-in works or reset issued; no plaintext | MSK | D-053 | REQUIRES_DECISION (D-039) |
| TS-MIG-05 | Redirects: old URL → redirect or useful unavailable page (T32) | M27, M25 · API-M27-01 | G | Redirect map → every mapped URL resolves (T32) | SYN | D-053 | REQUIRES_DECISION (D-076) |
| TS-MIG-06 | Cutover verification: opening stock, serials, payment references, permissions; supervised low-risk transactions and refunds flagged via API-M10-26 (steps 6–9) | All launch modules · API-M10-26 | G | Cutover window → verification signed | PRD | D-053 | REQUIRES_DECISION (D-209) |
| TS-MIG-07 | Rollback/forward-recovery rehearsal (BP §21.4) | M25, M26 | G | Plan approved → rehearsal restores service without losing transactions | MSK | D-053 | REQUIRES_DECISION (D-038) |
| TS-MIG-08 | Legacy read-only access for history after cutover (step 10) | M25, M23 | G | → legacy history readable, not writable | — | D-053 | REQUIRES_DECISION (D-038, D-009) |

### 5.21 Regression — TS-REG (detail §17)

| ID | Scope — verifies (source) | Modules · APIs · screens | When | Entry → Exit | Data | Tools | Status |
|---|---|---|---|---|---|---|---|
| TS-REG-01 | Critical regression pack: all automated T-tests runnable so far + TS-PERM-01/02/03/05 + TS-ERR-01 + TS-DB-03 (BP §20.5 "automated critical tests") | All built modules | S, R | Stage/release → all members pass | SYN, SBX | D-053 | NOT_STARTED |
| TS-REG-02 | Module regression: suites mapped to each touched module (§17) | Touched modules (§17) | T | Task done → mapped suites pass | SYN | D-053 | NOT_STARTED |
| TS-REG-03 | Platform/extension upgrade regression (BP §24.3 "Custom ERP extensions need upgrade regression tests") | Core + extension (D-001) | P | Upgrade candidate → critical pack passes on upgraded staging | SYN | D-053 | REQUIRES_DECISION (D-001) |
| TS-REG-04 | Decision-change regression: when a decision value changes, re-run every suite whose Status cites it | Suites citing the decision | T | Decision recorded → suites re-run and pass | SYN | D-053 | NOT_STARTED |

### 5.22 Platform proof — TS-PROOF (Phase 0, WP04; BP §15.3 — run per candidate core under D-001)
A critical failure (e.g. cannot prevent overselling) overrides any weighted score (BP §15.3).

| ID | Proof scenario (BP §15.3) | Later suites |
|---|---|---|
| TS-PROOF-01 | Receive three refurbished laptops with different serials and inspection outcomes | TS-ERP-04 |
| TS-PROOF-02 | Publish only accepted units and preserve actual condition information | TS-E2E-10 |
| TS-PROOF-03 | Public and dealer prices with a ten-unit tier and no cross-user leakage | TS-ECOM-03, TS-PERM-05 |
| TS-PROOF-04 | Simultaneously reserve the last unit through website and branch sale | TS-ERP-01 |
| TS-PROOF-05 | Duplicate and out-of-order payment notifications | TS-INT-01 |
| TS-PROOF-06 | Vendor product change, approval, retained history | TS-VEN-02 |
| TS-PROOF-07 | Return a serialised unit to quarantine and process a partial refund | TS-E2E-09 |
| TS-PROOF-08 | Recover a failed stock-update job and reconcile the channel view | TS-SVC-02, TS-SVC-09 |
| TS-PROOF-09 | Restrict a supplier to its own data and staff to assigned permissions | TS-PERM-02, TS-PERM-11 |
| TS-PROOF-10 | Export an invoice/credit once and reconcile with finance records | TS-INT-05 |
Status: all REQUIRES_DECISION (D-001) — they are the evidence for D-001 (Phase 0 exit, BP §5.1).

---

## 6. BP critical acceptance suite T01–T36 → modules, APIs, screens, first runnable point

"First runnable" = the earliest point at which every prerequisite module/endpoint in the row exists (module
dependency order `05-backend.md` §2); `12-phases.md` assigns the stage ID in which those prerequisites complete.
Each T-test is automated in `tests/acceptance/` where possible and executed in UAT (§13). Phase applicability per
BP §23.1: a test applies to the release containing its feature.

| T | Scenario (BP §23.1) | Phase | Modules | Key APIs | Screens | Suites | First runnable when | Blocking decisions |
|---|---|---|---|---|---|---|---|---|
| T01 | Guest browses refurbished laptop: condition, warranty, spec, actual offer clear | 1A | M04, M06, M09, M21, M05 | API-M21-01, API-M04-02, -03, -04, API-M06-02 | P-S02, P-S03, P-S04 | TS-ECOM-01/02, TS-E2E-01 | Catalog + serial units with inspection + storefront product page | D-023, D-022, D-049 |
| T02 | Approved dealer sees authorised price & tier; public cannot obtain it | 1A | M05, M08, M02, M09, M21 | API-M04-03, API-M05-01, -04, API-M02-01 | P-S02, P-S03, P-S11 | TS-ECOM-03, TS-PERM-05 | Pricing engine + business accounts + membership context | D-016, D-017, D-066, D-205 |
| T03 | Dealer quantity crosses threshold → correct all-units/graduated rule | 1A | M05, M10 | API-M05-01, API-M10-02/03 | P-S03, P-S06 | TS-UNIT-01, TS-ECOM-03 | Pricing engine + cart | D-018, D-129 |
| T04 | Two sessions buy last unit → one succeeds, other no-stock | 1A | M06, M10 | API-M10-06 | P-S07 | TS-ERP-01, TS-ECOM-05 | Reservation in stock authority + order placement | D-001, D-026 |
| T05 | Branch sale competes with online sale → shared authority, no duplicate allocation | 1A | M06, M10, M23 | API-M10-06, API-M10-21, API-M23-01 | P-S07, P-E02 (assisted/counter) | TS-ERP-01, TS-INT-07, TS-E2E-04 | Branch sale path exists (native branch entry or legacy adapter) | D-009, D-030 |
| T06 | Buyer repeats order request → same order, no duplicate effect | 1A | M10, M11 | API-M10-06, API-M11-01 | P-S07 | TS-API-03, TS-FE-08 | Idempotency records + order placement | D-079 |
| T07 | Payment callback duplicated → one payment effect, one fulfilment release | 1A | M11, M12, M19 | API-M11-03 | P-E12#events | TS-API-06, TS-INT-01 | Payment adapter with sandbox | D-012 |
| T08 | Payment events out of order → final state consistent with capture | 1A | M11 | API-M11-03, API-M11-06 | P-E12 | TS-INT-01, TS-UNIT-04 | Payment adapter with sandbox | D-012 |
| T09 | Payment after reservation expiry → re-reserve or visible exception/refund path | 1A | M11, M06, M10, M17 | API-M11-03, API-M06-24, API-M17-05, API-M10-17 | P-E12, P-E02, P-E01 | TS-ERP-07, TS-E2E-06 | Expiry job + payment adapter + exception queue | D-026, D-012 |
| T10 | Customer tampers with price or buyer type → rejected / recomputed | 1A | M05, M10, M02, M08 | API-M05-01, API-M10-06, API-M04-03 | P-S06, P-S07 | TS-PERM-03, TS-API-10 | Quote + order placement | — |
| T11 | Vendor edits another vendor's ID → denied without exposing data | 1B | M14, M02 | API-M14-05, -08, -09, -24, -32, -39 | P-V02, P-V03, P-V04 | TS-PERM-02, TS-VEN-05 | Vendor portal endpoints with two vendors | D-137, D-047 |
| T12 | Vendor submits new listing → non-purchasable until approval | 1B | M14, M04, M17 | API-M14-06, -10, API-M17-03, API-M21-01, API-M10-06 | P-V02, P-E06#review, P-E11 | TS-VEN-02 | Submissions + review + publication gate | D-081 |
| T13 | Vendor edits approved warranty → review required, no silent overwrite | 1B | M14, M04, M17 | API-M14-06, -54, API-M17-03 | P-V02, P-E11 | TS-VEN-02, TS-PERM-03 | Pending-version mechanism | D-081 |
| T14 | Supplier feed becomes stale → promise changes or listing pauses | 1B | M06, M14 | API-M14-19, API-M06-26/27, API-M04-03 | P-V03, P-E08#supplier, P-E11#freshness | TS-VEN-04, TS-ERP-08 | Supplier availability (1B) + freshness job | D-028 |
| T15 | Partial receipt with wrong serial → discrepancy recorded; invalid stock not published | 1A | M07, M06 | API-M07-09, -12, -13 | P-E09#receive | TS-ERP-04, TS-E2E-10 | PO + goods receipt + serial validation | D-110 |
| T16 | Transfer partly received → in-transit balance and discrepancy visible | 1A | M06 | API-M06-14, -15, -16, -17 | P-E08#transfers | TS-ERP-05 | Transfers | D-024 (loss approval) |
| T17 | Returned laptop → quarantine until inspection; serial linked to sale | 1A | M13, M06 | API-M13-10, -11, API-M06-07 | P-E04#quarantine | TS-ERP-12, TS-E2E-09 | Returns receipt after dispatch exists | D-022 |
| T18 | Duplicate refund command → one provider refund, one accounting effect | 1A | M11, M19 | API-M11-10, -12, API-M19-06 | P-E12#refunds | TS-INT-01, TS-ERP-13 | Refund adapter + accounting export | D-012, D-011 |
| T19 | Refund provider times out → existing refund checked before retry | 1A | M11 | API-M11-10, -11, -12 | P-E12#refunds | TS-INT-01, TS-ERP-13 | Refund adapter with fault injection | D-012 |
| T20 | Shipping booking response lost → reconcile before duplicate consignment | 1A | M12 | API-M12-11, -12, -13 | P-E03#ready | TS-INT-02, TS-ERP-11 | Courier adapter with fault injection | D-013 |
| T21 | Worker stops after order commit → durable work recovered | 1A | M17, M10, M11 | API-M17-15…17 (+ outbox) | P-E14#runs | TS-SVC-02 | Outbox + worker + scanner | D-001 |
| T22 | Dealer signs out; another user browses → no private-price cache leakage | 1A | M02, M05, M09 | API-M02-06, API-M04-03, API-M21-01 | P-S02, P-S03 | TS-PERM-05, TS-API-07, TS-FE-05 | Dealer pricing on storefront + caching design | D-105, D-083 |
| T23 | Chat customer asks for another person's order → no disclosure without verification | 1A (web chat) / 1B (WhatsApp L2) | M16, M10 | API-M16-07, -09, API-M10-10/11 | P-S13 (chat), P-E05 | TS-PERM-06, TS-ECOM-12 | Chat + verified order lookup | D-021, D-014 |
| T24 | WhatsApp bot cannot resolve → clear handoff with context | 1B (L2) | M16 | API-M16-02, -03, -11 | P-S13, P-E05 | TS-ECOM-12, TS-INT-03 | Guided flow + inbox | D-014, D-074 |
| T25 | Opted-out customer meets reminder rule → no prohibited reminder | 1A/1B | M20, M08, M16 | API-M08-10, API-M20-03 | P-S09#privacy, P-E05 | TS-SVC-05, TS-ECOM-15 | Consent records + notification rules (A14/A28) | D-058, D-014 |
| T26 | Import with mixed valid/invalid rows → row-level results; repeat does not duplicate | 1B (validated bulk import; D-048) | M04 | API-M04-30…38 | P-E06#import | TS-ERP-15 | Import pipeline | D-057, D-048 |
| T27 | Accountant reconciles a test trading day | 1A | M11, M19, M18 | API-M11-20/21, API-M19-06/08, API-M18-02 | P-E12#close, #export, P-E13 | TS-ERP-14, TS-INT-05 | Payments, refunds, invoices, export on one day | D-011, D-055, D-064 |
| T28 | Backup restoration rehearsal → data and attachments to agreed point/time | 1A (go-live) | M26, M01 | API-M24-08/09, -11 | P-E15#system | TS-BKP-02 | Staging + backups in place | D-108, D-034, D-005 |
| T29 | Phase 2 mobile web/app checkout on devices | 2 | M28 | — | — | — | LATER | D-085 |
| T30 | Keyboard-only user completes key flow | 1A | M09 (+ workspace/vendor apps) | — | P-S12, P-S02…P-S08; P-E16 and key P-E flows | TS-A11Y-01 | Each key flow's screens built | D-051 |
| T31 | Owner unavailable → delegated staff complete routine work; only true exceptions escalate | 1A | M17, M02, M18 | API-M17-01/03, -20…24, -25, API-M18-12 | P-E01, P-E14, P-E15#delegation | TS-PERM-07, TS-ADM-04, TS-ADM-10, TS-E2E-07 | Approvals + thresholds + delegation + digest | D-024, D-025, D-063 |
| T32 | Old product URL after migration → correct redirect or useful unavailable page | 1A (launch) | M27, M25 | API-M27-01 | P-S15, storefront routes | TS-ECOM-13, TS-MIG-05 | Redirect map loaded | D-076 |
| T33 | Product/price change after order → original snapshot and warranty terms intact | 1A | M10, M04, M05, M13 | API-M10-07, API-M04-18/20, API-M05-13 | P-S08, P-S09, P-E02 | TS-ERP-15, TS-DB-03 | Orders with snapshots + catalog/price change | D-022 |
| T34 | Customer cancels one line → reservation release, discount allocation, refund | 1A | M10, M06, M11, M05 | API-M10-09, API-M11-10 | P-S08, P-E02 | TS-ECOM-07, TS-ERP-13 | Cancellation + refunds | D-082, D-012 |
| T35 | Large report/import during checkout → agreed checkout performance | 1A (1B for bulk import) | M18, M04, M10, M26 | API-M18-03, API-M04-30, API-M10-06 | P-E13, P-E06, P-S07 | TS-PERF-05 | Exports + checkout on staging with load tooling | D-034, D-207 |
| T36 | New ordinary category configured → attributes, filters, listing, purchase without table rewrite | 1A | M04, M21, M09, M10 | API-M04-26…29, API-M04-01, API-M21-01 | P-E06#templates, P-S02, P-S03 | TS-ERP-15, TS-E2E-08 | Category templates + search facets + checkout | — |

Marketplace release adds TS-MKT-01…07 (LATER). T29 is not a Phase 1 gate (BP §23.1).

---

## 7. End-to-end journeys (BP §29) mapped to screens

Each step is one assertion in the journey test; the screen is the mockup reference (`00-conventions.md` §8).

**TS-E2E-01 — Consumer buys a refurbished laptop (BP §29.1)**

| # | Step | Screen | API | Check |
|---|---|---|---|---|
| 1 | Supplier delivers three units; two pass QC, one quarantined | P-E09#receive | API-M07-09, -12, -13, API-M06-09 | Only two sellable (T15) |
| 2 | Staff record serials, grade, defects, accessories, photos, warranty policy | P-E08#serials | API-M06-09 | Unit record complete (BR-M06-22) |
| 3 | Customer views accurate offer and delivery estimate | P-S03 | API-M04-03, API-M12-01 | Condition, warranty, inspection shown (T01) |
| 4 | Checkout calculates price and reserves one eligible unit | P-S07 | API-M05-01, API-M10-06 | Reservation of a specific serial if unique (D-031) |
| 5 | Payment captured and confirmed through the server | P-S08 | API-M11-01, -03, -02 | No success before provider verification |
| 6 | Warehouse scans allocated serial, packs, dispatches | P-E03 | API-M12-07, -09, -15 | Serial matches allocation; stock decremented (TX-4) |
| 7 | Customer receives order/shipment reference | P-S08 | API-M10-07 | Separate order/payment/fulfilment states |
| 8 | Order preserves grade and warranty terms | P-S09 | API-M10-07 | Snapshot intact after catalog edit (T33) |
| 9 | Unit returns → matched to sale → quarantine → inspection decides | P-S10, P-E04 | API-M13-03, -10, -11 | Not sellable until disposition (T17) |

**TS-E2E-02 — Dealer places a bulk order (BP §29.2)**

| # | Step | Screen | API | Check |
|---|---|---|---|---|
| 1 | Approved dealer member signs in | P-S12 | API-M02-02/03 or -04 | Buyer context = dealer (API-M02-01) |
| 2 | Orders ten SSDs; ten-unit tier applied | P-S11 (quick order), P-S06 | API-M05-03, API-M05-01 | Correct tier (T03) |
| 3 | Public browser cannot retrieve the private price | P-S03 (guest) | API-M04-03 | Public price only (T02, T22) |
| 4 | Only eight available → agreed alternative offered | P-S07 | API-M10-06 `STOCK_UNAVAILABLE` | Reduce qty / backorder or quote / reject (BR-M10-12; D-073, D-121) |
| 5 | Quantity becomes eight → price recalculated and confirmed | P-S06, P-S07 | API-M05-01 `PRICE_CHANGED` | Explicit acceptance (D-154) |
| 6 | Checkout stays prepaid when credit not enabled | P-S07 | API-M11-01 | Prepaid (D-019) |
| 7 | Staff discount below margin boundary → approval request | P-E02 (assisted) | API-M10-19, API-M17-03 | `202 APPROVAL_REQUIRED` (D-024) |

**TS-E2E-03 — Vendor submits a new product (BP §29.3; 1B)**

| # | Step | Screen | API | Check |
|---|---|---|---|---|
| 1 | Applicant reviewed and activated for selected categories | P-S12#vendor, P-E11#applications | API-M14-01, -50 | Approval record fields (BP §11.1) |
| 2 | Submits laptop listing with images and availability | P-V02, P-V03 | API-M14-06, -19 | Draft, not purchasable (T12) |
| 3 | Validation fails: warranty provider missing → correction request | P-V02 | API-M14-10 | Clear field error (BP §29.3) |
| 4 | Corrected; reviewer approves | P-E11#submissions, P-E06#review | API-M14-54, API-M17-03 | Only designated reviewer (D-081) |
| 5 | Product/offer eligible for publication; supplier availability separate from company stock | P-S03, P-E08#supplier | API-M04-03, API-M06-26 | Never company stock (BR-M06-15) |
| 6 | Other vendor cannot see or edit it | P-V02 (vendor 2) | API-M14-05/09 | `404` (T11) |

**TS-E2E-04 — Website and branch compete for one item (BP §29.4)**

| # | Step | Screen | API | Check |
|---|---|---|---|---|
| 1 | Website checkout and branch sale request the final unit concurrently | P-S07, P-E02 (counter) / legacy POS | API-M10-06, API-M10-21 / API-M23-01 | Exactly one allocation (T05) |
| 2 | Second channel receives unavailable result | P-S07 / P-E02 | same | Accurate message |
| 3 | Stale storefront quantity cannot override the reservation check | P-S03 | API-M04-03 | Checkout revalidates (BR-M06-18) |
| 4 | Branch offline scenario follows the chosen allocation/restriction | — | — | Per D-030 |

**TS-E2E-05 — WhatsApp customer asks to order (BP §29.5)**

| # | Step | Screen | API | Check |
|---|---|---|---|---|
| 1 | Customer opens WhatsApp from product page with a product reference | P-S03 | click-to-chat | Reference is not a trusted price |
| 2 | Agent or guided flow confirms variant, condition, quantity; draft basket created | P-E05 | API-M16-07, API-M10-18/19 | Live price/stock |
| 3 | Secure checkout link sent | P-E05 | API-M10-20 | Reservation timing per D-151 |
| 4 | Customer opens link, confirms address and final price, pays | P-S07 | API-M10-22, API-M10-06, API-M11-01 | Same controls as website checkout |
| 5 | Ambiguous compatibility question → agent review, no guess | P-E05 | API-M16-08 | Escalation (BR-M16-10) |
| 6 | Another person's order requested → no disclosure | P-E05 | API-M16-09 | T23 |

**TS-E2E-06 — Payment succeeds after a hold expires (BP §29.6)**

| # | Step | Screen | API | Check |
|---|---|---|---|---|
| 1 | Buyer starts payment, abandons; reservation expires (A06) | P-S07 | API-M06-24 | Released with reason |
| 2 | Another buyer reserves the item | P-S07 | API-M10-06 | Succeeds |
| 3 | Delayed capture arrives | — | API-M11-03 | Payment recorded; stock exception; no negative stock (T09) |
| 4 | Support resolves: stock with consent, alternative, or refund | P-E01, P-E02, P-E12 | API-M17-07, API-M10-17, API-M11-09 | Owner only if beyond authority/deadline |

**TS-E2E-07 — Owner is away for a working day (BP §29.7)**

| # | Step | Screen | API | Check |
|---|---|---|---|---|
| 1 | Owner creates scoped, time-bounded delegation | P-E15#delegation | API-M17-21 | Owner-only items excluded |
| 2 | Routine receipts, orders, notifications, fulfilment proceed | P-E09, P-E02, P-E03 | normal APIs | No owner touch |
| 3 | Staff resolve ordinary stock/dispatch issues within authority | P-E08, P-E03 | API-M17-07 | Within thresholds |
| 4 | Manager receives overdue tasks; finance handles authorised refunds | P-E14, P-E12 | API-M17-05, API-M11-10 | Escalate once (A16) |
| 5 | Owner receives digest and material exceptions only | P-E01 | API-M17-25, API-M18-12 | Digest content (D-063) |
| 6 | End of day: unresolved items, exposure, responsible people visible | P-E01 | API-M18-12 | T31 evidence |

**TS-E2E-08 — New product category (BP §29.8)**

| # | Step | Screen | API | Check |
|---|---|---|---|---|
| 1 | Authorised user configures printer attributes (technology, colour, connectivity, paper sizes) | P-E06#templates | API-M04-26…29 | Configuration only, no schema change |
| 2 | Products created and published | P-E06 | API-M04-16, -20 | Publication checks |
| 3 | Filters appear on listing for that category only | P-S02 | API-M04-01, API-M21-01 | Irrelevant laptop filters absent |
| 4 | Purchase, payment and return reuse the standard flows | P-S07, P-S10 | API-M10-06, API-M13-03 | T36 passes |

**TS-E2E-09 — Return of a serialised unit with partial refund (BP §15.3 #7; PR2 §12)**

| # | Step | Screen | API | Check |
|---|---|---|---|---|
| 1 | Customer (or GAT guest) checks eligibility and validates serial against the sale | P-S10 | API-M13-01, -02 | Serial must match original sale (BR-M13-08) |
| 2 | Return requested with evidence; routed to review queue (A22) | P-S10, P-E04#rma | API-M13-03, -06, -07 | Policy version of the order applies (T33) |
| 3 | Reverse pickup or drop-off; unit received into quarantine | P-E04#quarantine | API-M13-09, -10 | Quarantine, not sellable (T17) |
| 4 | Inspection; storage device → data erasure evidence before resale | P-E04, P-E08 | API-M06-09, -10 | BR-M13-09 |
| 5 | Refund decision (finance) and disposition decision (warehouse lead/manager) recorded separately | P-E04#rd-dec, P-E12#refunds | API-M13-11, API-M11-10 | Separate decisions (BP §10.5) |
| 6 | Partial refund uses original line discount/tax allocation; duplicate command has no second effect | P-E12 | API-M11-10, -12 | T18, T34; refund ≤ captured (I-05) |

**TS-E2E-10 — Receipt → inspection → publication → sale (BP §15.3 #1–#2)**

| # | Step | Screen | API | Check |
|---|---|---|---|---|
| 1 | Approved PO; three units received with scans | P-E09#receive | API-M07-09, -12 | Serials captured (A03) |
| 2 | One wrong serial → discrepancy; not published | P-E09 | API-M07-11, -13 | T15 |
| 3 | Inspection outcomes recorded; accepted units sellable, failed to quarantine | P-E08#serials | API-M06-09, API-M07-13 | BP §9.2 event table |
| 4 | Only accepted units appear as offers with their actual condition | P-S03, P-S04 | API-M04-03, API-M06-02 | T01 |
| 5 | Sale reserves and dispatches one accepted unit | P-S07, P-E03 | API-M10-06, API-M12-15 | TX-1, TX-4 |

**TS-E2E-11 — Guest checkout and later order access (BP §6.5; D-021)**

| # | Step | Screen | API | Check |
|---|---|---|---|---|
| 1 | Guest verifies phone at checkout (if guest purchase allowed) | P-S07 | API-M02-02/03 | D-021 |
| 2 | Places order and pays; replayed submission returns same order | P-S07, P-S08 | API-M10-06, API-M11-01 | T06 |
| 3 | Secure order link or order no. + phone + OTP opens the order | P-S08 | API-M10-10/11 | Token scoped to one order |
| 4 | Same token cannot open another order; unverified visitor sees only the lookup form | P-S08 | API-M10-07 | TS-PERM-02.7 |
| 5 | Guest requests a return with the token | P-S10 | API-M13-03 | Scope `request_return` |

---

## 8. Error handling — BP §10.3 failure table (TS-ERR-01)

| Case | Failure (BP §10.3) | Required response | APIs | T |
|---|---|---|---|---|
| TS-ERR-01.1 | Two buyers compete for last unit | One reservation; other gets accurate message | API-M10-06 | T04 |
| TS-ERR-01.2 | Double-click pay/order | Idempotency returns existing result | API-M10-06, API-M11-01 | T06 |
| TS-ERR-01.3 | Same key, different basket | `409 IDEMPOTENCY_CONFLICT`; earlier order untouched | API-M10-06 | T06 |
| TS-ERR-01.4 | Payment after reservation expiry | Controlled re-reservation, else hold and resolve/refund | API-M11-03 | T09 |
| TS-ERR-01.5 | Callback delivered twice | One transition, one fulfilment task, no duplicate invoice | API-M11-03, API-M12-16 | T07 |
| TS-ERR-01.6 | Failed event after captured | Captured not downgraded | API-M11-03 | T08 |
| TS-ERR-01.7 | Worker crashes after sending request | Reconcile by provider reference before retrying | outbox behind API-M11-10/-12, API-M12-11 | T19, T20, T21 |
| TS-ERR-01.8 | Payment captured while application unavailable | Provider events + reconciliation recover order state | API-M11-03, API-M11-06 | T21 |
| TS-ERR-01.9 | Stock system unavailable | Stop confirmation (`503`) or segregated allocation; never guess | API-M10-06 | T05 |
| TS-ERR-01.10 | Notification fails | Order stays valid; retry; failure visible | API-M20-04 | — |
| TS-ERR-01.11 | Refund request times out | `202 PROVIDER_PENDING`; status query before new refund | API-M11-10…12 | T18, T19 |
| TS-ERR-01.12 | Partial cancellation | Release only affected reservation; refund allocated amount once | API-M10-09 | T34 |

### 8.1 Integration fault-injection matrix (BP §10.3, §16.3, §22.5 — used by TS-INT and TS-SVC-02)

| Fault injected | Payment (D-012) | Shipping (D-013) | Accounting export (D-011) | WhatsApp / SMS / email (D-014, D-015) | Supplier feed / legacy (D-028, D-009) |
|---|---|---|---|---|---|
| Timeout before request sent | Retry with same reference | Retry with same parcel reference | Retry same idempotency key | Retry; delivery pending visible | Retry within cap |
| Timeout after request sent (response lost) | Query attempt/refund status before retry (T19) | Check booking before re-booking (T20) | Query target/control totals before resend | Check provider message id | Reconcile last accepted version |
| Duplicate event / callback | One effect (T07) | One transition, raw event kept | One mapping per document (I-09) | One message record | Row hash dedup (T26) |
| Out-of-order events | Legal transitions only; capture never downgraded (T08) | Canonical mapping; no unrelated overwrite (BP §10.5) | — | Status order tolerated | Older feed version ignored |
| Worker crash between send and save | Outbox reconciliation (T21) | Outbox reconciliation | Outbox reconciliation | Outbox reconciliation | Job resumes from checkpoint |
| Invalid signature / authentication | `401`, no effect, security event | `401`, no effect | n/a (outbound) | `401`, no effect | Credential rejected |
| Provider unavailable | `PROVIDER_UNAVAILABLE`; reconciliation queue | Manual booking fallback (BR-M12-10) | Signed-off file export fallback | Website/email/support handoff | Freshness policy applies (T14) |
| Retry cap exhausted | One exception case (A38) | One exception case | One exception case | Delivery failure exposed | One exception case |

### 8.2 User-facing states per screen (BP §6.3 → TS-FE-02, TS-ERR-04)

| Screen | Required states (BP §6.3) |
|---|---|
| P-S01 Home | Slow connection, no promotions, signed-in dealer |
| P-S02 Category/search | No results, unavailable filters, pagination, unavailable products |
| P-S03 Product | Variant unavailable, price changed, supplier confirmation needed |
| P-S05 Compare | Different categories, missing specification |
| P-S06 Cart | Changed price, stock shortage, minimum quantity failure |
| P-S07 Checkout | Failed payment, expired reservation, duplicate submission |
| P-S08 Confirmation / orders | Payment verification pending (no false success); partial shipment, cancellation requested, refund pending |
| P-S10 Returns | Outside policy, serial mismatch, warranty route |
| P-S11 Dealer account | Pending, rejected, suspended, approval expired |
| P-S13 Help | Outside hours, bot failure, human handoff |

---

## 9. Security requirements (BP §19.1) → suites

| BP §19.1 requirement | Suites |
|---|---|
| Object- and property-level authorisation (S14): vendor cannot access another vendor's record by changing its ID nor edit a protected approval field | TS-PERM-02, TS-PERM-03, TS-SEC-01 (T11, T13) |
| Supported authentication; rate limits; secure session handling | TS-AUTH-01…05, TS-AUTH-03, TS-SEC-11 |
| Server-side authorisation for every business operation | TS-PERM-01, TS-PERM-04 |
| CSRF for cookie-authenticated mutations; deliberate CORS | TS-AUTH-08 |
| Validate inputs; restrict uploads; scan risky attachments; private files via authorised access | TS-SEC-02, TS-SEC-03, TS-SVC-08 |
| Encryption in transit and storage; secret rotation; separate environment credentials | TS-SEC-05, TS-SEC-07, TS-ADM-07 |
| No logging of passwords, payment data, identity documents, complete chat content or tokens | TS-SEC-06, TS-AUTH-10 |
| Dependency updates, vulnerability triage, backups, incident procedures | TS-SEC-08, TS-BKP-*, TS-ERR-05 |
| Protect authentication and checkout from abuse without hindering shopping | TS-AUTH-03, TS-SEC-11 |
| Restrict outbound import requests (SSRF) | TS-SEC-04, TS-INT-06 |
| Tamper-resistant privileged audit evidence | TS-SEC-09, TS-ADM-05 |
| Formula-injection-safe CSV exports (BP §14.4) | TS-SEC-10, TS-UNIT-11 |

---

## 10. Performance and load (BP §20.1–20.2 — PROPOSED targets, D-034)

"These are negotiation starting points" (BP §20.1); no target is a pass criterion until D-034 is decided. Measurement
windows, devices, network profile, catalog size, order load and exclusions are part of D-034.

| Area | Proposed target (BP §20.1) | Verification (BP §20.1) | Suite |
|---|---|---|---|
| Web page experience | LCP ≤2.5 s, INP ≤200 ms, CLS ≤0.1 at p75 | Phase 1 desktop/laptop lab tests before each launch; field data after enough traffic (D-106) | TS-PERF-01 |
| Internal catalog/quote API | p95 ≤500 ms under agreed normal workload, excluding external-provider wait | Representative load test + production telemetry | TS-PERF-02 |
| Stock browse propagation | Normal changes visible within an agreed short window; starting proposal ≤60 s | Timestamped movement-to-display test | TS-PERF-03 |
| Checkout stock integrity | Authoritative reservation on every confirmed sale | Concurrency and failure tests (not a cache promise) | TS-ERP-01, TS-ERR-01 |
| Availability | 99.5 % monthly discussed for the initial deployment | Synthetic checks and incident accounting | TS-PERF-07 |
| Recovery point | ≤1 h for transactional data if backup/log design supports it | Measured restore point in rehearsal | TS-BKP-02 |
| Recovery time | ≤4 h for the agreed major recovery scenario | Timed restoration exercise | TS-BKP-02 |
| Privileged access | MFA and individually attributable accounts | Access review and login tests | TS-AUTH-02, TS-ADM-09 |
| Auditability | Every material stock, price, refund and permission change traceable | Sample transaction reconstruction | TS-SVC-03, TS-ADM-05 |
| Backup restore | Successful rehearsal before launch and scheduled thereafter | Restore evidence and reconciliation | TS-BKP-02, TS-BKP-04 |

Load mix for TS-PERF-04 (BP §20.2): browsing with image delivery, search, dealer pricing, last-unit contention, bulk
import and staff picking simultaneously; volume = current measured peak × jointly agreed growth scenario (BP example
"twice the measured peak" is an example only) → **D-207**, volumes **D-010**. Exports and imports must not starve
checkout (T35). No invented "Amazon-scale" benchmark (BP §20.2).

---

## 11. Restore rehearsal (T28) and migration rehearsal (BP §21.3)

### 11.1 Restore rehearsal procedure (TS-BKP-02)
| Step | Action | Evidence |
|---|---|---|
| 1 | Select a production-like backup (database + attachments/media) from outside the primary runtime | Backup id, timestamp, location (D-108) |
| 2 | Restore into staging (never over production) | Start/end time → achieved recovery time |
| 3 | Determine the latest recoverable transaction → achieved recovery point | Compare with D-034 targets |
| 4 | Reconcile: order counts and totals, payment totals, opening stock by location, serial counts, attachment sampling (open files) | Reconciliation report |
| 5 | Re-apply deletions/anonymisations executed after the backup (MK retention note) | List re-applied (D-036) |
| 6 | Record result in `E-restore_rehearsal` via API-M24-11, in `STATE.md` §11, and check system status (API-M24-08) | Evidence id (MK sample "RR-…") |
Rule: a database restore never silently rolls back orders or payments taken after the snapshot — they are exported
and reconciled first (BP §20.5, §21.4).

### 11.2 Migration rehearsal (TS-MIG; BP §21.2–21.4)
| BP §21.3 step | Test | Pass criterion |
|---|---|---|
| 1–2 Sample clean, trial import, reconcile with warehouse/sales/support/finance | TS-MIG-01 | Sample reconciles; issues logged |
| 3 Full dry run, measure downtime/workload | TS-MIG-02 | Measured duration within agreed window |
| 4 Agree window, people, stop/go thresholds | TS-MIG-02 | Signed stop/go criteria |
| 5–6 Freeze or final delta; import final data; control totals | TS-MIG-03 | All BP §21.2 datasets reconcile |
| 7 Verify opening stock, serials, payment references, permissions | TS-MIG-06, TS-PERM-01 | Signed verification |
| 8 Switch channels to the new authority | TS-MIG-06 | One stock authority per transaction |
| 9 Supervised real low-risk transactions and refunds | TS-MIG-06 | Per D-209 procedure |
| 10 Hypercare; legacy read-only for history | TS-MIG-08 | Legacy read-only verified |
| Rollback boundary (BP §21.4) | TS-MIG-07 | Forward-recovery point agreed and rehearsed |

---

## 12. Phase exit gates (BP §5.1)

| Phase | Exit gate (BP §5.1) | Test evidence |
|---|---|---|
| 0 Discovery & proof | Owner and operations approve business model and scope | TS-PROOF-01…10 results; D-001 decision |
| 1A Core web launch | Web end-to-end UAT and reconciled opening stock | All 1A T-tests (§6) pass; UAT sign-off (§13); TS-MIG-03/06; go-live checklist (§14) |
| 1B Operational completion | Measured process improvement and manageable exceptions | T11–T14, T24, T26 pass; BP §4 measures vs baseline (owner touches, touch time, exceptions resolved at staff level); TS-ADM-10 |
| 2 Mobile & approved growth | Mobile web/app UAT; marketplace financial controls if included | T29; TS-MKT-01…07 (LATER) |
| 3 AI & expansion | Evidence of adoption, quality, sustainable cost | Out of scope (LATER) |

---

## 13. User acceptance testing (BP §23.3)

### 13.1 Ownership
The client nominates **warehouse, sales, finance, support, vendor and owner** representatives who execute agreed
real-world scenarios using representative data (BP §23.3). Developers are not the sole approvers of business
correctness. UAT runs on staging (`02-architecture.md` §24.1) with data per §3.2 (D-136). The analyst/QA owner
coordinates (BP §22.4); approvers per BP §27.2 decision owners.

### 13.2 UAT scenario sets

| Set | Executed by | Scenarios | Phase |
|---|---|---|---|
| UAT-WH (warehouse) | Warehouse representative | Receive & inspect with serials (T15, TS-E2E-10), transfer (T16), count & adjustment request, pick/pack/dispatch correct serial, returned unit to quarantine (T17) | 1A |
| UAT-SALES (sales/dealer) | Sales representative | Assisted order, dealer application decision, dealer bulk order (TS-E2E-02, T02, T03), cancellation of one line (T34) | 1A |
| UAT-FIN (finance) | Finance representative / accountant | Payment reconciliation, refund incl. duplicate & timeout (T18, T19), daily close, accounting export of a test trading day (T27) | 1A |
| UAT-SUP (support) | Support representative | Help/chat handoff, verified order lookup (T23), return request, WhatsApp order (TS-E2E-05, T24, T25 — 1B) | 1A / 1B |
| UAT-VEN (vendor) | Vendor representative(s) | Application, submission with correction, availability update, isolation check (T11–T14; TS-E2E-03) | 1B |
| UAT-OWN (owner) | Owner | Control centre, approvals within thresholds, owner-away day (T31; TS-E2E-07), audit reconstruction | 1A |
| UAT-CUS (customer journeys) | Consumer and dealer users from the client's groups | Browse → buy refurbished laptop (TS-E2E-01), guest order access, keyboard-only key flow (T30) | 1A |
| UAT-WALK (BP §31.1 walkthroughs) | All | One real purchase receipt, one website order, one WhatsApp order, one return | 1A / 1B |

### 13.3 Evidence record (per test execution — BP §23.3 fields)

| Field | Content |
|---|---|
| Test | T-ID and/or suite case ID, scenario name |
| Expected result | From BP §23.1 / suite definition |
| Actual result | Observed outcome |
| References | Screenshots/record references (no unmasked personal data, TD7) |
| Defect | Severity (BP §24.1 scale, D-035), owner, link to issue |
| Retest | Date and result |
| Acceptance | Accepted by (client representative), date |

Evidence storage location and format follow the chosen tooling (D-053); the index lives in `tests/uat/` and each
accepted T-test is recorded in `STATE.md` §11 (§16).

### 13.4 Entry / exit
- **Entry:** stage suites and TS-REG-01 pass on staging; UAT data loaded; representatives trained on the scenario
  (BP §23.4 "Staff trained"); open decisions affecting the scenario are `DECIDED`.
- **Exit:** every in-scope T-test accepted or its defect explicitly accepted with workaround (non-critical only);
  phase exit gate (§12) evidence complete.

---

## 14. Go-live checklist (BP §23.4) → evidence

| # | Item (BP §23.4) | Evidence / suites | Approver (BP §27.2) | Decisions |
|---|---|---|---|---|
| G1 | Approved scope and unresolved-item disposition | Signed scope; `DECISIONS.md` open items dispositioned | Owner | D-048 |
| G2 | Signed-off product/price/warranty/return policies | Policy versions active (API-M04-24); TS-UNIT-08 | Owner / support / finance | D-017, D-022, D-023 |
| G3 | Correct opening stock and serials | TS-MIG-03, TS-MIG-06, TS-DB-07 | Operations / finance | D-038, D-135 |
| G4 | Merchant/courier/WhatsApp prerequisites complete for enabled features | TS-INT-10 checklist per adapter | Finance / operations | D-012, D-013, D-014 |
| G5 | Critical payment, refund, stock, access and recovery tests passed | TS-REG-01; T04–T10, T18–T21, T11/T22/T23 (as applicable); TS-BKP-02 | Technical lead + QA owner | — |
| G6 | Finance confirms invoice/export and reconciliation process | T27; TS-ERP-14; TS-INT-05 | Finance / accountant | D-011, D-055 |
| G7 | Phase 1 e-commerce and ERP web UI accepted on agreed desktop/laptop browsers (Phase 2: mobile) | TS-FE-07, TS-A11Y-01…03, UAT sign-off | Owner / design | D-049, D-206, D-051 |
| G8 | Staff trained with assigned responsibilities and alternate approvers | Role assignments (S-03/S-04), delegation alternates (S-06), UAT attendance | Operations | D-025 |
| G9 | Monitoring, backups, incident contacts and restore evidence available | TS-ADM-08, TS-BKP-02, alert owners (BP §20.3) | Operations / technical lead | D-052, D-108, D-035 |
| G10 | Migration rehearsal and rollback/forward-recovery plan approved | TS-MIG-02, TS-MIG-07 | Operations / finance | D-038 |
| G11 | No unresolved critical defects; other known issues accepted with workaround | Defect log (§13.3) | Owner | D-035 |
| G12 | Domain, hosting, credentials, repository and vendor accounts controlled by agreed owners | Handover record (BP §24.2); TS-SEC-05 | Owner | D-005, D-115 |
| G13 | Security assessment result (only if D-208 requires it) | TS-SEC-12 | Owner / technical lead | D-208 |

---

## 15. Definition of ready and definition of done (BP §22.5)

### 15.1 Ready (a task may be started)
| # | Criterion | Source |
|---|---|---|
| R1 | Actor, business rule, data source, failure behaviour, dependency and acceptance criteria are clear | BP §22.5 |
| R2 | All tasks in **Depends on** are `COMPLETED`; no `OPEN` decision blocks it | `14-continuation-protocol.md` steps 8–9 |
| R3 | The task names the suites (`TS-*` / T-IDs) that prove it | this file |
| R4 | Test data needs are covered by synthetic fixtures or an approved extract (D-136) | §3.2 |

### 15.2 Done (a task may be marked `COMPLETED`)
| # | Criterion | Source |
|---|---|---|
| D1 | Implemented, reviewed, tested at the appropriate level, demonstrated, documented, observable in the target environment | BP §22.5 |
| D2 | Permissions verified: new endpoints mapped in `07` §13 and TS-PERM-01 passes; negative cases for the new keys exist | BP §22.5 "permissions … verified"; `07` §15 E1 |
| D3 | Failure recovery verified (error cases of the task's APIs; BP §10.3 rows it touches) | BP §22.5 |
| D4 | UI tasks: loading, empty, error, desktop/laptop viewport and accessibility states covered (TS-FE, TS-A11Y scope) | BP §22.5 |
| D5 | Integration tasks: timeout, duplicate event, reconciliation and manual recovery covered (TS-INT) | BP §22.5 |
| D6 | Report tasks: definitions documented and totals reconciled with sample transactions (TS-ERP-19) | BP §22.5 |
| D7 | All suites listed in the task pass **and actually ran**; module regression (TS-REG-02) passes | protocol steps 16–17 |
| D8 | No undecided value hard-coded (P8); secrets not committed; audit events present for material actions (TS-SVC-03) | `00-conventions.md` §2; BP §19.1 |
| D9 | Evidence recorded in `TASKS.md` and `STATE.md` per §16 | protocol steps 18–20 |

---

## 16. Recording test results (`14-continuation-protocol.md` steps 16–20)

### 16.1 In `TASKS.md` — task **Evidence** field
```
Evidence (YYYY-MM-DD, commit <hash or "uncommitted">):
- Files: <paths>
- Migrations: <DB-G# / migration ids> | none
- APIs: <API-M##-## list> implemented
- Tests: TS-XXX-## <pass>/<total> [T-IDs covered: T04, T06] ; TS-PERM-01 pass ; TS-REG-02 (M06, M10) pass
- Not run: <suite> — reason (tool/env/decision D-xxx) → task stays IN_PROGRESS
- Remaining: <none | list>
```

### 16.2 In `STATE.md` §11 "Tests" — one row per suite (and per T-test once runnable)

| Suite / T | Status (`00-conventions.md` §3) | Last run | Result | Environment | Evidence |
|---|---|---|---|---|---|
| e.g. TS-ERP-01 | IN_PROGRESS | 2026-10-12 | PASS 14/14 | CI | T-1A.x-M06-03 |
| e.g. T04 | COMPLETED | 2026-10-20 | PASS | staging | UAT-WH accepted 2026-10-21 |

Rules: `Status` uses the conventions statuses for the suite's implementation; `Result` is `PASS n/n`, `FAIL k/n`
(list failing cases) or `NOT_RUN (reason)`. A failing critical suite (TS-REG-01 members) is also entered under
`STATE.md` §13 Known issues. T-tests move to `COMPLETED` only after execution in staging and, where in UAT scope,
client acceptance (§13.3). Stage IDs in the Evidence column follow `12-phases.md`/`TASKS.md`.

### 16.3 Traceability in code
Test names start with the suite/case ID and any T-ID (e.g. `[TS-ERP-01.3][T04] last unit — second buyer gets
STOCK_UNAVAILABLE`) so `grep` finds coverage from this file, `TASKS.md` and `STATE.md`.

---

## 17. Regression policy and module → suite map

Per task: run the suites of every touched module (TS-REG-02). Per stage exit and release candidate: TS-REG-01 plus all
suites of the stage's modules (§4). Changes to M02 (identity/permissions) always run the full TS-PERM and TS-AUTH sets.

| Module | Suites to run when touched |
|---|---|
| M01 | TS-DB-01, TS-SVC-02, deploy smoke; TS-BKP-01 (infra changes) |
| M02 | TS-UNIT-03, TS-AUTH-01…10, TS-PERM-01…14, TS-SVC-03, TS-SVC-12, TS-SEC-13, TS-ADM-01/02/05/09 |
| M03 | TS-ADM-06, TS-PERM-11 |
| M04 | TS-UNIT-07, TS-ERP-15, TS-ECOM-01/02, TS-SVC-09, TS-SEC-04, TS-VEN-02 (1B) |
| M05 | TS-UNIT-01/02, TS-ECOM-03, TS-ERP-16, TS-PERM-05, TS-API-10 |
| M06 | TS-UNIT-05, TS-ERP-01…08, TS-DB-03/07, TS-SVC-01 |
| M07 | TS-ERP-04, TS-ERP-09, TS-INT-05 (bills export) |
| M08 | TS-ECOM-09/10, TS-ERP-17, TS-PERM-02.3, TS-DB-06 |
| M09 | TS-FE-02/05/06, TS-ECOM-01…05, TS-PERF-01 (incl. 01.1 visit beacon), TS-SEC-13.3/13.4 |
| M10 | TS-UNIT-04/06, TS-ECOM-04…07/11, TS-ERP-01, TS-ERR-01, TS-API-03 |
| M11 | TS-INT-01, TS-ERP-13/14, TS-ERR-01, TS-DB-03 (I-05) |
| M12 | TS-UNIT-09, TS-ERP-10/11, TS-INT-02 |
| M13 | TS-UNIT-08, TS-ERP-12, TS-ECOM-08, TS-E2E-09 |
| M14 | TS-VEN-01…11, TS-PERM-02.4/02.5/03.2/04.3 |
| M16 | TS-ECOM-12, TS-ERP-18, TS-INT-03, TS-PERM-06 |
| M17 | TS-UNIT-10, TS-SVC-02/06/07/11/13, TS-PERM-07/08/09/13/14, TS-ADM-03/04/10/11 |
| M18 | TS-UNIT-11, TS-SVC-10, TS-ERP-19, TS-ERP-20, TS-FE-09 (P-E18), TS-PERF-05, TS-SEC-10, TS-ADM-15 |
| M19 | TS-INT-05, TS-ERP-14, TS-DB-02 (I-09), TS-ADM-14 |
| M20 | TS-SVC-05, TS-ECOM-15, TS-INT-04 |
| M21 | TS-ECOM-01, TS-SVC-09, TS-PERF-06, TS-PERM-05.1 |
| M22 | TS-SVC-08, TS-SEC-03/04 |
| M23 | TS-INT-01…10 for the touched adapter |
| M24 | TS-SVC-04, TS-ADM-07/12/13, TS-FE-09 (P-E17), TS-PERM-04.6 |
| M25 | TS-MIG-01…08 |
| M26 | TS-BKP-01…04, TS-PERF-07, TS-SEC-05…09 |
| M27 | TS-ECOM-13, TS-MIG-05 |
| M15, M28, M29 | LATER — TS-MKT; T29; none |

---

## API gaps found

Status 2026-09-27: both resolved in `06-api.md` §8 — G-T1 by API-M24-11, G-T2 by API-M10-26 (key `order.verification_flag`, `07` §5.5).

| # | Screen · action | Needed operation | Source | Decision | Resolution |
|---|---|---|---|---|---|
| G-T1 | P-E15#system — record restore-rehearsal evidence into `E-restore_rehearsal` (achieved recovery point/time, reconciliation result, evidence id) after TS-BKP-02; API-M24-09 only schedules a rehearsal and API-M24-08 only reads status | Record rehearsal outcome | BP §20.1 "Restore evidence and reconciliation"; MK:erp-admin.html#system ("Evidence RR-…") | D-108 | API-M24-11 |
| G-T2 | Production verification transactions (BP §21.3 step 9) and test traffic exclusion (BP §4) — no way to mark an order/payment/refund as a verification/test transaction or to exclude it from reports and accounting export | Flag/unflag verification transactions (staff) | BP §4, §21.3 | D-209 | API-M10-26 |

## Entity gaps found

| # | Gap | Source | Decision |
|---|---|---|---|
| E-T1 | Restore rehearsals now have `E-restore_rehearsal` (`00-conventions.md` §7.2); **migration** rehearsal results (dry-run timing, control totals, stop/go outcome, approver) still have no record — needed for go-live items G3, G10 | BP §21.3, §23.4 | D-038 |
| E-T2 | `E-sales_order` / `E-payment_attempt` / `E-refund` have no marker for verification/test transactions to exclude them from metrics, reports and accounting export | BP §4, §21.3 | D-209 |
| E-T3 | UAT evidence (BP §23.3 fields) has no entity — kept as test artefacts under `tests/uat/` unless the client wants it in the system | BP §23.3 | D-053 |

## Proposed new decisions

| ID | Question | Documented options / proposal (source) | Blocks |
|---|---|---|---|
| D-206 | Which **desktop/laptop browsers and versions** (and screen sizes) define Phase 1 UI acceptance and screen-reader checks? | BP §6.7 step 8 "Validate Phase 1 on agreed desktop/laptop browsers and with keyboard/screen-reader navigation"; BP §23.4 "accepted on agreed desktop/laptop browsers"; BP §20.1 LCP/INP/CLS measured on Phase 1 desktop/laptop. No list in any source | TS-FE-07, TS-A11Y-03, TS-PERF-01, go-live item G7 |
| D-207 | **Load-test workload model**: growth multiplier over measured peak and the traffic mix/proportions for TS-PERF-04 | BP §20.2 "Use current peak and a jointly agreed growth scenario, for example twice the measured peak — not an invented Amazon-scale benchmark"; mix listed in BP §20.2; volumes D-010; targets D-034 | TS-PERF-02, TS-PERF-04, TS-PERF-05, T35 |
| D-208 | **Security testing depth before go-live**: automated suites only (TS-SEC-01…11) or also an independent penetration test / external review, and who performs it | BP §23.2 "Add … security … checks for Phase 1"; BP §19.1 (OWASP S14 object/property tests, vulnerability triage); BP §23.4 "Critical … access … tests passed". Independent testing is not mentioned in any source | TS-SEC-12, go-live item G13 |
| D-209 | **Production verification transactions** after cutover/releases: who performs them, which products/payment modes, how they are flagged and excluded from reports, metrics and accounting export, and how they are reversed/refunded | BP §21.3 step 9 "Perform supervised real low-risk transactions and refunds where appropriate"; BP §4 "Exclude test traffic and duplicate events from conversion metrics"; BP §20.5 staging verification | TS-MIG-06, API gap G-T2, entity gap E-T2, `12-phases.md` launch tasks |

Decisions D-200, D-202 and D-205 are proposed in `07-auth-roles-permissions.md` (D-201, D-203, D-204 unused).

## Registry additions requested

| # | Addition | Justification | Source |
|---|---|---|---|
| RA-T1 | `00-conventions.md` §5: test **case** IDs `<suite>.<n>` (e.g. `TS-PERM-02.4`) under the `TS-<area>-##` scheme; note that area codes are those of §0 of this file | Cases are referenced from `07` §16, `TASKS.md` and test names | this file |
| RA-T2 | `00-conventions.md` §11: `tests/` sub-folders `acceptance/`, `e2e/`, `load/`, `a11y/`, `security/`, `restore/`, `migration/`, `uat/` | Folder names delegated to the plan (D-054); matches `tests/` purpose in §11 | D-054 |
| RA-T3 | `STATE.md` §11 columns: Suite/T · Status · Last run · Result · Environment · Evidence (§16.2) | Consistent recording across sessions | `14-continuation-protocol.md` step 19 |
| RA-T4 | Entity for **migration**-rehearsal evidence (E-T1) if D-038 decides it is kept in-system (M25); restore evidence uses the registered `E-restore_rehearsal` | Go-live evidence G3/G10 | BP §21.3, §23.4 |

---

## 18. SaaS test suites `TS-SAAS-*` (2026-09-28, `D-227`)

Architecture: `19-saas-platform.md` §15. These suites test **platform properties** — the things that stop being
true silently. They run in CI on every change, not before a release.

### 18.1 Suites

| Suite | Cases | Verifies |
|---|---|---|
| `TS-SAAS-SEP-01…06` | import boundary, no committed artefact, no shared session, no store-DB access from the platform, independent builds, independent pipelines | `19` §2 SEP-1…SEP-6 |
| `TS-SAAS-CFG-01…18` | schema completeness, unknown key rejected, layer resolution, artefact validation (checksum, schema hash, release), determinism (100 runs byte-identical), no secret in the artefact, reload without mixed-version requests, rollback, cold-key refusal, L4 overlay, draft isolation, diff accuracy, immutability, publish audit, validation not overridable, schema-driven rendering coverage, content addressing and retention | `19` §3, §4 |
| `TS-SAAS-CAP-01…06` | all six enforcement points per capability, no undeclared store-facing route or component, dependency and conflict resolution, disable/re-enable preserves data, registry import and drift | `19` §5 |
| `TS-SAAS-PACK-01…17` | profile loading, packs carry no code, no pack-id branching, two packs → two schemas, idempotent schema application, identity models, pack validation, bootstrap result, publish immutability, deprecate/retire rules, migration preview accuracy, no implicit migration, second-pack end-to-end, vendor and import profiles | `19` §6 |
| `TS-SAAS-TPL-01…09` | no hard-coded visual value, template switch changes no data or business output, template cannot alter business output, renders every page for two packs, preview matches published result, registry import and compatibility, deprecate/retire, palette derivation and contrast gate | `19` §7 |
| `TS-SAAS-TERM-01…05` | no hard-coded concept word in store-facing output, pluralisation and case, locale fallback and missing-token behaviour, labels from tokens, coverage gate blocks publish | `19` §11 |
| `TS-SAAS-ISO-01…16` | the invisibility rules INV-1…INV-10 and cross-store isolation: vocabulary crawl, effective-config-only responses, 404 not 403, locked keys absent, suspension notice, emails/PDFs/exports, no link to the root admin, no store data without a grant, unknown host, unscoped query refused, cross-store CRUD/search/export refused, signed-URL isolation, bootstrap isolation, cross-store session/invitation/code, notice content, migration isolation | `19` §9, §10 |
| `TS-SAAS-PERF-01…06` | zero configuration DB queries / file reads / JSON parses per request, accessor cost, boot load and memory, reload propagation, added latency vs a single-store build, `theme.css` caching | `19` §4.5 / `D-248` |
| `TS-SAAS-DEPLOY-01…14` | idempotency, resume at each step, hand-off from the wizard, retry caps, provisioning rollback, domain lifecycle, cold boot from the disk copy, smoke failure → automatic rollback, smoke against real hosts, drift detection, two-person decommission, retention and destruction evidence, support-access expiry, transition guards | `20` §5, §7 |
| `TS-SAAS-EXP-01` | every store-facing output traces to the five inputs of `19` §8 | `19` §8 |
| `TS-SAAS-REL-01…05` | Schema-change classification, migrate-and-rebuild release procedure, no-op rebuild byte-identical, two-schema acceptance window, rollback eligibility | `19` §17 |
| `TS-SAAS-EDGE` | Every row of `19` §23 as an executable case: run-out rule, delegation invariants, lifecycle and webhook edges, currency and locale changes, search during migration | `19` §23 |
| `TS-SAAS-CHAN-01…08` | Channel model: publish blocked without a verified binding, sender and templates; no secret in any table, log or artefact; verification states; suspension after repeated failure; no send without a consent basis from any caller; caps and quiet hours across channels together; one event one message under retry; delivery tracking with backoff | `19` §5.6, §26.2 |
| `TS-SAAS-AUTO-01…05` | Each automation independently grantable; a disabled automation is never scheduled and its queued messages are dead-lettered; idempotent execution; enabling a messaging automation without its channel or template is blocked; pause without a deployment, audited | `19` §5.3 N, §26.3 |
| `TS-SAAS-CAP-12, -13` | A `CANDIDATE` capability with an open gating decision cannot be granted; every capability has a plain-language description and an owning module | `19` §5.3 |
| `TS-PROOF-11`, `TS-PROOF-12` | Stage 0: isolation and configuration cost per candidate core | `D-252` |

### 18.2 The two-store rule

**Every** integration and end-to-end run uses the two-store fixture (`T-1A.1-M30-04`): `VP-electronics` /
`TPL-forge` and `VP-fashion_apparel` / `TPL-aurora`, with different terminology and different data. A suite that
passes with one store and fails with two is precisely the regression this architecture exists to prevent, so the
fixture is mandatory from stage 1A.1 onward, not an extra scenario added at the end.

A mutation check is part of the isolation suite's own acceptance: removing a tenant filter from any repository
must make at least one test fail. A suite that still passes after that mutation is not testing isolation.

### 18.3 Effect on the existing suites

No existing suite is replaced. Each gains the store dimension: fixtures are created inside a store context,
assertions that used global uniqueness become per-store, and any test that asserted an electronics-specific
behaviour now asserts it for the store configured with `VP-electronics`. The BP acceptance tests T01–T36 are
unchanged in content and are run against the Tradex store.

### 18.4 New go-live items

Added to the §14 go-live checklist: **G14** the isolation suite passes with zero findings on the launch
environment; **G15** every line of the `D-248` performance budget is measured and within budget; **G16** a
single-store restore has been rehearsed without affecting another store. All three are evidenced by
`T-1A.17-M26-08`.

---

## 19. Client feedback CF1 test cases (2026-09-30, P-E17 and P-E18)

Source: `CF1 §2` (employee monitoring → P-E17) and `CF1 §3` (analytics → P-E18); decisions `D-282`–`D-286`;
screens `04c` §22–§23; data `03` §13; APIs `06-api.md` §11. Cases use existing suites where one fits and add the
suites TS-FE-09, TS-SVC-12, TS-SVC-13, TS-ERP-20 and TS-SEC-13 (§5). Thresholds, idle times and retention periods
in fixtures are **test values**, never the mockup samples (§3.2). Every case runs with the two-store fixture
(§18.2).

| Case | Verifies | Setup | Action | Expected | Task | APIs / entities |
|---|---|---|---|---|---|---|
| TS-FE-09.1 | P-E17 filters | 14 staff across 3 locations and 6 teams, activity in several areas | Change period, location, team, area, person search | Board, heatmap rows, feed, alerts and performance change consistently; the area table keeps all locations and highlights the area; "Showing n of N" and "Clear filters" correct | T-1A.16-M24-12 AC 1 | API-M24-15, API-M24-17 |
| TS-FE-09.2 | Area rows match their screens | Open items seeded in every area | Compare each area row's "Open" with the area's own queue | Equal for all rows the store has | T-1A.16-M24-12 AC 2 | API-M24-15, API-M18-15, API-M18-16 |
| TS-FE-09.3 | Person drawer | Open a person from a board card, the feed, the heatmap (Enter), the performance table and an alert | Read all six tabs | Only that person's data; one `team.person.view` audit event per opening | T-1A.16-M24-12 AC 3 | API-M24-16, E-audit_event |
| TS-FE-09.4 | P-E17 states | Fixtures: stale presence, empty filter result, no alerts, new starter, person on leave | Load the page | Each state of `04c` §22.12 shown; status and severity always written in text, never colour-only | T-1A.16-M24-12 | API-M24-15 |
| TS-FE-09.5 | "What is recorded" | D-282 lists; D-283 retention and notice set in configuration (test values) | Open `#m-recorded` | Recorded and not-recorded lists match D-282; retention and notice text come from configuration, none is typed into the page | T-1A.16-M24-12 AC 4; T-1A.16-M24-13 AC 3 | API-M24-01 |
| TS-FE-09.6 | P-E18 filter row | Seeded month | Change range, comparison, location, channel, buyer and category on each tab | Every tile, chart and table changes; store-wide cards stay and say so; the comparison period is labelled on every delta | T-1A.15-M18-10 AC 1 | API-M18-20 |
| TS-FE-09.7 | Table view | Every chart on the five tabs and on P-E17 | Toggle "Table view" | The table shows the same numbers as the chart | T-1A.15-M18-10 AC 2 | API-M18-20, API-M24-15 |
| TS-FE-09.8 | P-E18 states | Stale read model, empty period, role without `analytics.margin.read` | Load each view | Stale label names the model and time; empty-state texts; margin fields absent, not blank | T-1A.15-M18-10 | API-M18-20 |
| TS-FE-09.9 | Help | Both screens | Open every ⓘ, the page guide and each glossary term | No empty entry; metric definitions equal D-286; recorded lists equal D-282 | T-1A.16-M24-13 | — |
| TS-SVC-12.1 | Presence derivation | Test idle threshold T | Scripted session: heartbeats → no heartbeat for longer than T → self-set "On break" → heartbeats → sign-out | Intervals active → idle → on_break → active → offline, each boundary within one heartbeat interval | T-1A.2-M02-11 AC 2 | API-M02-43, E-staff_presence_interval |
| TS-SVC-12.2 | Area and work-item tags | One action in every workspace area | Perform the actions | Every audit event carries its area and, where one exists, its work item | T-1A.2-M02-11 AC 1 | E-audit_event |
| TS-SVC-12.3 | Work-item events | An item assigned, started, sent back, started again, completed; the writer retried | Run | Each event stored once; handling time, waiting time and sent-back share computed as `03` §13.2 | T-1A.2-M02-11 | E-work_item_event |
| TS-SVC-12.4 | Presence capability off | `CAP-STAFF_PRESENCE` off | Scripted workspace session | No heartbeat sent; API-M02-43 answers 404; no interval stored | T-1A.2-M02-11 AC 3 | API-M02-43 |
| TS-SVC-12.5 | Retention | Test retention period for presence and work items (D-283 d) | Advance time past it | Presence and work-item rows beyond the period removed; audit events untouched (own retention, D-036) | T-1A.2-M02-11 | E-staff_presence_interval, E-work_item_event |
| TS-SVC-13.1 | Rule thresholds | Each of the nine rules enabled with a test threshold N | Scripted data just below, at and above N | Each rule fires exactly at its threshold; the alert names rule, threshold, person, record and time | T-1A.14-M17-13 AC 1 | E-staff_alert |
| TS-SVC-13.2 | Rule turned off | Alerts exist for a rule | Turn it off; repeat the data | No new alert; existing alerts kept | T-1A.14-M17-13 AC 2 | API-M24-19 |
| TS-SVC-13.3 | Acknowledge | Open alert | Acknowledge twice | One acknowledgement (who, when), audited; the second call returns the first; nothing about the person's work or access changes | T-1A.14-M17-13 AC 3 | API-M24-20 |
| TS-SVC-13.4 | No storms, no blocking | The same condition repeats | Repeat it | One open alert per rule, subject and record; the staff action is never blocked or delayed | T-1A.14-M17-13 | E-staff_alert |
| TS-SVC-13.5 | Seeds | Fresh store | Bootstrap | Nine rules present, all off, thresholds unconfirmed; no mockup sample value seeded | S-17 addendum | E-staff_alert_rule |
| TS-ERP-20.1 | Reconciliation | Seeded month of orders, cancellations, returns and refunds over 3 locations, 4 channels, 2 buyer types | Sum net sales, orders, units, returns and refunds from the read model | Equal to the source ledgers under the D-286 definitions | T-1A.15-M18-09 AC 1 | E-analytics_daily_fact |
| TS-ERP-20.2 | Rebuild | Same data | Drop and rebuild the read models | Identical rows | T-1A.15-M18-09 AC 2 | E-analytics_daily_fact, E-customer_cohort_snapshot |
| TS-ERP-20.3 | Freshness | Refresh job stopped | Load P-E18 | Freshness recorded per model; stale state shown | T-1A.15-M18-09 AC 3 | API-M18-20 |
| TS-ERP-20.4 | Test traffic excluded | Verification orders flagged (D-209) | Rebuild | Excluded from every measure (BP §4) | T-1A.15-M18-09 | E-analytics_daily_fact |
| TS-ERP-20.5 | Customer anonymisation | A customer anonymised through a data request | Next rebuild | The customer is gone from E-customer_cohort_snapshot | T-1A.15-M18-09 | E-customer_cohort_snapshot |
| TS-SEC-13.1 | Nothing outside the D-282 list — schema | DB-G1 and DB-G8 addenda and the E-audit_event columns | Compare every column and payload key with the recorded list | No screen, keystroke, camera, microphone, device-inventory, GPS or private-message field exists | T-1A.2-M02-11 AC 4 | `03` §13.1–§13.4 |
| TS-SEC-13.2 | Nothing outside the D-282 list — traffic and logs | Full P-E17 session with heartbeats | Scan requests, stored rows and logs | Nothing outside the list sent, stored or logged | T-1A.2-M02-11 | API-M02-43 |
| TS-SEC-13.3 | Visit tracking option (b) | D-285 (b) fixture | Browse, search, add to cart | Counters only — no identifier, cookie, IP address or personal data stored | T-1A.9-M09-14 AC 3 | API-M09-03, E-storefront_visit_counter |
| TS-SEC-13.4 | Visit tracking option (c) | D-285 (c) fixture | Browse before consent, after consent, after declining | Nothing sent before consent or after declining | T-1A.9-M09-14 AC 3 | API-M09-03, E-storefront_visit_event |
| TS-PERM-02.12, 03.7, 04.6, 09.6, 10.5, 11.4 | Person-activity BOLA; presence BOPLA; non-delegated staff get 403; alert-rule change authority; margin on analytics; branch scope on P-E17 / P-E18 | `07` §16 | `07` §16 | `07` §16 | T-1A.2-M02-11, T-1A.14-M17-13, T-1A.16-M24-12, T-1A.15-M18-10 | API-M02-43, API-M24-15…20, API-M18-20 |
| TS-A11Y-02.1 | P-E17 accessibility | Screen built | Keyboard only: heatmap arrows / Home / End / Enter, drawer tabs, rules modal; screen reader on board cards | Status and severity in text; heatmap has a table view; focus returns to the opener on drawer close | T-1A.16-M24-12 | P-E17 |
| TS-A11Y-02.2 | P-E18 accessibility | Screen built | Keyboard focus on every chart; table views; delta chips | Values readable by keyboard; every chart has a table view; direction of each change stated in text | T-1A.15-M18-10 | P-E18 |
| TS-PERF-01.1 | Storefront budget with the visit beacon | D-285 (b) or (c) fixture | Lab test P-S01…P-S04 with the beacon on | LCP / INP / CLS within the D-268 budget; events sent after first paint, batched | T-1A.9-M09-14 AC 2 | API-M09-03 |
| TS-PERF-04.1 | Heartbeat load | Full staff roster sending heartbeats | Add to the mixed workload | Workspace and checkout targets unchanged (D-268) | T-1A.2-M02-11 | API-M02-43 |
| TS-PERF-05.1 | P-E18 query budget | 12-month range, all filters, representative volume | Load every view while checkout runs | Within the P-E18 query budget; reads only the read models; checkout unaffected | T-1A.15-M18-09 | API-M18-20 |
| TS-SAAS-CAP-01.1 | CF1 capabilities off | Each of `CAP-TEAM_MONITOR`, `CAP-STAFF_PRESENCE`, `CAP-STAFF_ACTIVITY_ALERTS`, `CAP-ANALYTICS_DASHBOARD`, `CAP-CUSTOMER_ANALYTICS`, `CAP-STOREFRONT_VISIT_ANALYTICS` off in turn | Load the screens, call the endpoints, inspect bundles and the scheduler | Governed screen, navigation entry, section or card absent (not empty); endpoints 404; no heartbeat, no alert job, no visit beacon, no code shipped | T-1A.16-M24-12, T-1A.15-M18-10, T-1A.9-M09-14 | `21` §4 |
| TS-SAAS-ISO-10.1 | No cross-store money | Two stores with sales | Run every analytics aggregation | No query sums money across stores (D-261) | T-1A.15-M18-09 AC 4 | E-analytics_daily_fact |
| TS-SAAS-ISO-11.1 | Two-store isolation | Stores A and B with staff, presence, alerts, facts and visit counters | Read P-E17 and P-E18 in each store | Nothing of store A appears or is counted in store B | T-1A.2-M02-11, T-1A.14-M17-13, T-1A.15-M18-09 | all §13 entities |
